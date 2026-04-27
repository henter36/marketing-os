const base = require("./router_sprint3");
const { createHash } = require("crypto");
const { AppError, correlationId, errorBody, sendJson } = require("./error-model");
const { createSeedStore } = require("./store");
const { authGuard, membershipCheck, permissionGuard, rejectBodyWorkspaceId, workspaceContextGuard } = require("./guards");

const safeModeStatuses = ["inactive", "active"];
const onboardingStatuses = ["not_started", "in_progress", "completed", "skipped"];
const sprint4Routes = [
  "GET /workspaces/{workspaceId}/campaigns/{campaignId}/client-report-snapshots",
  "POST /workspaces/{workspaceId}/campaigns/{campaignId}/client-report-snapshots",
  "GET /workspaces/{workspaceId}/audit-logs",
  "GET /workspaces/{workspaceId}/safe-mode",
  "POST /workspaces/{workspaceId}/safe-mode",
  "GET /workspaces/{workspaceId}/onboarding-progress",
  "PATCH /workspaces/{workspaceId}/onboarding-progress"
];
const implementedRoutes = [...base.implementedRoutes, ...sprint4Routes];

function createApp(options = {}) {
  const store = options.store || createSeedStore();
  const baseApp = base.createApp({ store });

  return async function app(req, res) {
    const url = new URL(req.url, "http://localhost");
    const path = url.pathname.replace(/^\/v1/, "");

    if (!isSprint4Path(path)) {
      return baseApp(req, res);
    }

    const id = correlationId(req);
    try {
      const body = await readBody(req);
      const result = routeSprint4(req, path, body, store);
      sendJson(res, result.status || 200, result.body);
    } catch (error) {
      const appError = error instanceof AppError
        ? error
        : new AppError(500, "INTERNAL_ERROR", "Unexpected server error.", "Retry or contact support.");
      sendJson(res, appError.status, errorBody(appError, id));
    }
  };
}

function routeSprint4(req, path, body, store) {
  const workspaceMatch = path.match(/^\/workspaces\/([^/]+)\/(.*)$/);
  if (!workspaceMatch) throw notFound();

  const workspaceId = workspaceContextGuard({ workspaceId: workspaceMatch[1] });
  const user = authGuard(req, store);
  const membership = membershipCheck(user, workspaceId, store);
  const child = workspaceMatch[2];

  const reports = child.match(/^campaigns\/([^/]+)\/client-report-snapshots$/);
  if (reports) {
    const campaign = findCampaign(store, workspaceId, reports[1]);

    if (req.method === "GET") {
      permissionGuard(membership, "report.read");
      return ok(store.clientReportSnapshots.filter((snapshot) => snapshot.workspace_id === workspaceId && snapshot.campaign_id === campaign.campaign_id));
    }

    if (req.method === "POST") {
      permissionGuard(membership, "report.generate");
      rejectBodyWorkspaceId(body, workspaceId);
      requireFields(body, ["report_template_id", "report_period_start", "report_period_end"]);
      validateReportPeriod(body.report_period_start, body.report_period_end);

      const reportTemplate = findReportTemplate(store, workspaceId, body.report_template_id);
      const workspace = findWorkspace(store, workspaceId);
      const generatedAt = now();
      const evidenceSnapshot = snapshotCampaignEvidence(store, workspaceId, campaign.campaign_id);
      const reportPayload = {
        campaign: clone(campaign),
        report_template: clone(reportTemplate),
        report_period_start: body.report_period_start,
        report_period_end: body.report_period_end,
        evidence_count: evidenceSnapshot.length,
        generated_at: generatedAt
      };
      const snapshot = {
        client_report_snapshot_id: nextId("client-report-snapshot", store.clientReportSnapshots),
        workspace_id: workspaceId,
        customer_account_id: workspace.customer_account_id,
        campaign_id: campaign.campaign_id,
        report_template_id: reportTemplate.report_template_id,
        report_period_start: body.report_period_start,
        report_period_end: body.report_period_end,
        report_snapshot_payload: clone(reportPayload),
        evidence_snapshot_payload: clone({ evidence: evidenceSnapshot }),
        generated_by_user_id: user.user_id,
        generated_at: generatedAt,
        content_hash: hash({ report_snapshot_payload: reportPayload, evidence_snapshot_payload: { evidence: evidenceSnapshot } })
      };

      store.clientReportSnapshots.push(snapshot);
      audit(store, workspaceId, user, "client_report_snapshot.generated", "ClientReportSnapshot", snapshot.client_report_snapshot_id, null, snapshot);
      return created(snapshot);
    }
  }

  if (child === "audit-logs" && req.method === "GET") {
    permissionGuard(membership, "audit.read");
    return ok(store.auditLogs.filter((log) => log.workspace_id === workspaceId));
  }

  if (child === "safe-mode") {
    if (req.method === "GET") {
      permissionGuard(membership, "operations.read");
      return okOne(getSafeModeState(store, workspaceId));
    }

    if (req.method === "POST") {
      permissionGuard(membership, "operations.safe_mode");
      rejectBodyWorkspaceId(body, workspaceId);
      requireFields(body, ["safe_mode_status"]);
      requireOneOf(body.safe_mode_status, safeModeStatuses, "INVALID_SAFE_MODE_STATE", "Safe mode state is invalid.");

      const state = getSafeModeState(store, workspaceId, true);
      const before = clone(state);
      state.safe_mode_status = body.safe_mode_status;
      state.reason = body.reason || null;
      if (body.safe_mode_status === "active") {
        state.activated_by_user_id = user.user_id;
        state.activated_at = now();
        state.deactivated_at = null;
      } else {
        state.deactivated_at = now();
      }
      state.updated_at = now();

      const action = body.safe_mode_status === "active" ? "safe_mode.activated" : "safe_mode.deactivated";
      audit(store, workspaceId, user, action, "SafeModeState", state.safe_mode_state_id, before, state);
      return okOne(state);
    }
  }

  if (child === "onboarding-progress") {
    if (req.method === "GET") {
      permissionGuard(membership, "onboarding.read");
      return okOne(getOnboardingProgress(store, workspaceId));
    }

    if (req.method === "PATCH") {
      permissionGuard(membership, "onboarding.write");
      rejectBodyWorkspaceId(body, workspaceId);
      if (body.onboarding_status !== undefined) {
        requireOneOf(body.onboarding_status, onboardingStatuses, "INVALID_ONBOARDING_STATE", "Onboarding status is invalid.");
      }

      const progress = getOnboardingProgress(store, workspaceId, true);
      const before = clone(progress);
      if (body.onboarding_status !== undefined) progress.onboarding_status = body.onboarding_status;
      if (body.current_step !== undefined) progress.current_step = body.current_step;
      if (body.progress_payload !== undefined) progress.progress_payload = clone(body.progress_payload);
      progress.completed_at = progress.onboarding_status === "completed" ? now() : null;
      progress.updated_at = now();

      audit(store, workspaceId, user, "onboarding.updated", "OnboardingProgress", progress.onboarding_progress_id, before, progress);
      return okOne(progress);
    }
  }

  throw notFound();
}

function isSprint4Path(path) {
  return /^\/workspaces\/[^/]+\/(campaigns\/[^/]+\/client-report-snapshots|audit-logs|safe-mode|onboarding-progress)$/.test(path);
}

function snapshotCampaignEvidence(store, workspaceId, campaignId) {
  const publishJobIds = new Set(
    store.publishJobs
      .filter((job) => job.workspace_id === workspaceId && job.campaign_id === campaignId)
      .map((job) => job.publish_job_id)
  );
  return store.manualPublishEvidence
    .filter((evidence) => evidence.workspace_id === workspaceId && publishJobIds.has(evidence.publish_job_id))
    .map(clone);
}

function getSafeModeState(store, workspaceId, persist = false) {
  let state = store.safeModeStates.find((candidate) => candidate.workspace_id === workspaceId);
  if (!state) {
    state = {
      safe_mode_state_id: nextId("safe-mode", store.safeModeStates),
      workspace_id: workspaceId,
      safe_mode_status: "inactive",
      reason: null,
      activated_by_user_id: null,
      activated_at: null,
      deactivated_at: null,
      created_at: now(),
      updated_at: now()
    };
    if (persist) store.safeModeStates.push(state);
  }
  return state;
}

function getOnboardingProgress(store, workspaceId, persist = false) {
  const existing = store.onboardingProgress.filter((candidate) => candidate.workspace_id === workspaceId);
  if (existing.length > 1) {
    throw new AppError(409, "ONBOARDING_PROGRESS_CONFLICT", "Only one onboarding progress record is allowed per workspace.", "Resolve duplicate onboarding progress records.");
  }
  if (existing.length === 1) return existing[0];

  const progress = {
    onboarding_progress_id: nextId("onboarding-progress", store.onboardingProgress),
    workspace_id: workspaceId,
    onboarding_status: "not_started",
    current_step: "start",
    progress_payload: {},
    completed_at: null,
    updated_at: now()
  };
  if (persist) store.onboardingProgress.push(progress);
  return progress;
}

function findWorkspace(store, workspaceId) {
  const workspace = store.workspaces.find((candidate) => candidate.workspace_id === workspaceId);
  if (!workspace) throw new AppError(404, "NOT_FOUND", "Workspace was not found.", "Check the workspace ID.");
  return workspace;
}

function findCampaign(store, workspaceId, campaignId) {
  const campaign = store.campaigns.find((candidate) => candidate.workspace_id === workspaceId && candidate.campaign_id === campaignId);
  if (!campaign) throw new AppError(404, "CAMPAIGN_NOT_FOUND", "Campaign was not found in this workspace.", "Check the campaign and workspace IDs.");
  return campaign;
}

function findReportTemplate(store, workspaceId, reportTemplateId) {
  const template = store.reportTemplates.find((candidate) => candidate.workspace_id === workspaceId && candidate.report_template_id === reportTemplateId);
  if (!template) throw new AppError(404, "REPORT_TEMPLATE_NOT_FOUND", "ReportTemplate was not found in this workspace.", "Use a report template from the current workspace.");
  return template;
}

function audit(store, workspaceId, user, action, entityType, entityId, before, after) {
  const workspace = findWorkspace(store, workspaceId);
  store.auditLogs.push({
    audit_log_id: nextId("audit", store.auditLogs),
    workspace_id: workspaceId,
    customer_account_id: workspace.customer_account_id,
    actor_user_id: user.user_id,
    action,
    entity_type: entityType,
    entity_id: entityId,
    before_snapshot: clone(before),
    after_snapshot: clone(after),
    metadata: { sprint: 4 },
    correlation_id: "sprint-4-placeholder",
    occurred_at: now()
  });
}

function validateReportPeriod(start, end) {
  const startTime = Date.parse(start);
  const endTime = Date.parse(end);
  if (!Number.isFinite(startTime) || !Number.isFinite(endTime) || endTime <= startTime) {
    throw new AppError(422, "INVALID_REPORT_PERIOD", "Report period end must be after report period start.", "Send a valid report period.");
  }
}

function requireFields(body, fields) {
  const missing = fields.filter((field) => body[field] === undefined || body[field] === null || body[field] === "");
  if (missing.length) throw new AppError(422, "VALIDATION_FAILED", `Missing required field(s): ${missing.join(", ")}.`, "Provide all required fields.");
}

function requireOneOf(value, allowed, code, message) {
  if (!allowed.includes(value)) throw new AppError(422, code, message, "Use an approved value.");
}

function ok(data) { return { body: { data } }; }
function okOne(data) { return { body: { data } }; }
function created(data) { return { status: 201, body: { data } }; }
function notFound() { return new AppError(404, "NOT_FOUND", "Route was not found.", "Use an endpoint from the OpenAPI contract."); }
function nextId(prefix, collection) { return `${prefix}-${collection.length + 1}`; }
function now() { return new Date().toISOString(); }
function clone(value) { return value === undefined ? undefined : JSON.parse(JSON.stringify(value)); }
function hash(value) { return createHash("sha256").update(stableStringify(value)).digest("hex"); }
function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  if (value && typeof value === "object") return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`;
  return JSON.stringify(value);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("error", reject);
    req.on("end", () => {
      const text = Buffer.concat(chunks).toString("utf8");
      if (!text) return resolve({});
      try { resolve(JSON.parse(text)); }
      catch { reject(new AppError(422, "VALIDATION_FAILED", "Request body must be valid JSON.", "Send a valid JSON body.")); }
    });
  });
}

module.exports = { createApp, implementedRoutes };
