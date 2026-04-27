const base = require("./router");
const { createHash } = require("crypto");
const { AppError, correlationId, errorBody, sendJson } = require("./error-model");
const { createSeedStore } = require("./store_sprint3");
const { authGuard, membershipCheck, permissionGuard, rejectBodyWorkspaceId, workspaceContextGuard } = require("./guards");

const reviewTypes = ["brand", "legal", "quality", "final"];
const reviewStatuses = ["open", "in_review", "completed", "canceled"];
const approvalDecisions = ["approved", "rejected", "changes_requested"];
const publishStatuses = ["draft", "ready", "submitted", "published", "failed", "canceled"];
const sprint3Routes = [
  "GET /workspaces/{workspaceId}/asset-versions/{mediaAssetVersionId}/review-tasks",
  "POST /workspaces/{workspaceId}/asset-versions/{mediaAssetVersionId}/review-tasks",
  "GET /workspaces/{workspaceId}/review-tasks/{reviewTaskId}",
  "PATCH /workspaces/{workspaceId}/review-tasks/{reviewTaskId}/status",
  "GET /workspaces/{workspaceId}/review-tasks/{reviewTaskId}/decisions",
  "POST /workspaces/{workspaceId}/review-tasks/{reviewTaskId}/decisions",
  "GET /workspaces/{workspaceId}/approval-decisions/{approvalDecisionId}/publish-jobs",
  "POST /workspaces/{workspaceId}/approval-decisions/{approvalDecisionId}/publish-jobs",
  "GET /workspaces/{workspaceId}/publish-jobs/{publishJobId}",
  "PATCH /workspaces/{workspaceId}/publish-jobs/{publishJobId}/status",
  "GET /workspaces/{workspaceId}/publish-jobs/{publishJobId}/manual-evidence",
  "POST /workspaces/{workspaceId}/publish-jobs/{publishJobId}/manual-evidence",
  "GET /workspaces/{workspaceId}/manual-evidence/{manualPublishEvidenceId}",
  "POST /workspaces/{workspaceId}/manual-evidence/{manualPublishEvidenceId}/invalidate",
  "POST /workspaces/{workspaceId}/manual-evidence/{manualPublishEvidenceId}/supersede"
];
const implementedRoutes = [...base.implementedRoutes, ...sprint3Routes];

function createApp(options = {}) {
  const store = options.store || createSeedStore();
  const baseApp = base.createApp({ store });
  return async function app(req, res) {
    const url = new URL(req.url, "http://localhost");
    const path = url.pathname.replace(/^\/v1/, "");
    if (!isSprint3Path(path)) return baseApp(req, res);
    const id = correlationId(req);
    try {
      const body = await readBody(req);
      sendJson(res, 200, routeSprint3(req, path, body, store).body);
    } catch (error) {
      const appError = error instanceof AppError ? error : new AppError(500, "INTERNAL_ERROR", "Unexpected server error.", "Retry or contact support.");
      sendJson(res, appError.status, errorBody(appError, id));
    }
  };
}

function routeSprint3(req, path, body, store) {
  const workspaceMatch = path.match(/^\/workspaces\/([^/]+)\/(.*)$/);
  if (!workspaceMatch) throw notFound();
  const workspaceId = workspaceContextGuard({ workspaceId: workspaceMatch[1] });
  const user = authGuard(req, store);
  const membership = membershipCheck(user, workspaceId, store);
  const child = workspaceMatch[2];

  const reviewTasksForVersion = child.match(/^asset-versions\/([^/]+)\/review-tasks$/);
  if (reviewTasksForVersion) {
    const version = findVersion(store, workspaceId, reviewTasksForVersion[1]);
    if (req.method === "GET") {
      permissionGuard(membership, "review.read");
      return ok(store.reviewTasks.filter((task) => task.workspace_id === workspaceId && task.media_asset_version_id === version.media_asset_version_id));
    }
    if (req.method === "POST") {
      permissionGuard(membership, "review.assign");
      rejectBodyWorkspaceId(body, workspaceId);
      requireFields(body, ["review_type"]);
      requireOneOf(body.review_type, reviewTypes, "INVALID_REVIEW_TYPE", "Review type is invalid.");
      if (body.assigned_to_user_id) requireWorkspaceMember(store, workspaceId, body.assigned_to_user_id);
      const task = { review_task_id: nextId("review-task", store.reviewTasks), workspace_id: workspaceId, media_asset_version_id: version.media_asset_version_id, assigned_to_user_id: body.assigned_to_user_id || null, review_status: "open", review_type: body.review_type, due_at: body.due_at || null };
      store.reviewTasks.push(task); audit(store, workspaceId, user, "review_task.created", "ReviewTask", task.review_task_id, null, task);
      return created(task);
    }
  }

  const reviewTaskRead = child.match(/^review-tasks\/([^/]+)$/);
  if (reviewTaskRead && req.method === "GET") { permissionGuard(membership, "review.read"); return ok(findReviewTask(store, workspaceId, reviewTaskRead[1])); }

  const reviewTaskStatus = child.match(/^review-tasks\/([^/]+)\/status$/);
  if (reviewTaskStatus && req.method === "PATCH") {
    permissionGuard(membership, "review.assign"); rejectBodyWorkspaceId(body, workspaceId); requireFields(body, ["review_status"]); requireOneOf(body.review_status, reviewStatuses, "VALIDATION_FAILED", "Review task status is invalid.");
    const task = findReviewTask(store, workspaceId, reviewTaskStatus[1]); const before = { ...task }; task.review_status = body.review_status;
    audit(store, workspaceId, user, "review_task.status_updated", "ReviewTask", task.review_task_id, before, task); return okOne(task);
  }

  const decisionsForReview = child.match(/^review-tasks\/([^/]+)\/decisions$/);
  if (decisionsForReview) {
    const task = findReviewTask(store, workspaceId, decisionsForReview[1]);
    if (req.method === "GET") { permissionGuard(membership, "review.read"); return ok(store.approvalDecisions.filter((d) => d.workspace_id === workspaceId && d.review_task_id === task.review_task_id)); }
    if (req.method === "POST") {
      permissionGuard(membership, "approval.decide"); rejectBodyWorkspaceId(body, workspaceId); requireFields(body, ["media_asset_version_id", "decision"]); requireOneOf(body.decision, approvalDecisions, "VALIDATION_FAILED", "Approval decision is invalid.");
      const version = findVersion(store, workspaceId, body.media_asset_version_id);
      if (task.media_asset_version_id !== version.media_asset_version_id) throw new AppError(409, "REVIEW_TASK_VERSION_MISMATCH", "ApprovalDecision media_asset_version_id must match the ReviewTask assignment.", "Approve only the version assigned to this review task.");
      if (body.decision === "approved") { if (!body.approved_content_hash) throw new AppError(422, "APPROVAL_HASH_REQUIRED", "approved_content_hash is required when decision=approved.", "Send the exact MediaAssetVersion content_hash."); if (body.approved_content_hash !== version.content_hash) throw new AppError(409, "APPROVAL_HASH_MISMATCH", "approved_content_hash does not match the MediaAssetVersion content_hash.", "Approve the exact asset version content hash."); }
      const decision = { approval_decision_id: nextId("approval-decision", store.approvalDecisions), workspace_id: workspaceId, review_task_id: task.review_task_id, media_asset_version_id: version.media_asset_version_id, decision: body.decision, approved_content_hash: body.decision === "approved" ? body.approved_content_hash : null, decision_reason: body.decision_reason || null, decided_at: now() };
      store.approvalDecisions.push(decision); if (body.decision === "approved") version.version_status = "approved";
      audit(store, workspaceId, user, "approval_decision.created", "ApprovalDecision", decision.approval_decision_id, null, decision); return created(decision);
    }
  }

  const publishJobsForDecision = child.match(/^approval-decisions\/([^/]+)\/publish-jobs$/);
  if (publishJobsForDecision) {
    const decision = findDecision(store, workspaceId, publishJobsForDecision[1]);
    if (req.method === "GET") { permissionGuard(membership, "publish_job.create"); return ok(store.publishJobs.filter((job) => job.workspace_id === workspaceId && job.approval_decision_id === decision.approval_decision_id)); }
    if (req.method === "POST") {
      permissionGuard(membership, "publish_job.create"); rejectBodyWorkspaceId(body, workspaceId); const key = requireIdempotencyKey(req);
      return withIdempotency(store, workspaceId, "publish_job.create", key, body, () => {
        requireFields(body, ["media_asset_version_id", "campaign_id", "channel"]); if (decision.decision !== "approved") throw new AppError(409, "APPROVAL_NOT_APPROVED", "PublishJob requires an approved ApprovalDecision.", "Approve the asset version before creating a publish job.");
        const version = findVersion(store, workspaceId, body.media_asset_version_id); const campaign = findCampaign(store, workspaceId, body.campaign_id);
        if (decision.media_asset_version_id !== version.media_asset_version_id) throw new AppError(409, "ASSET_VERSION_MISMATCH", "PublishJob media_asset_version_id must match the ApprovalDecision.", "Publish the exact approved asset version.");
        if (decision.approved_content_hash !== version.content_hash) throw new AppError(409, "APPROVAL_HASH_MISMATCH", "ApprovalDecision hash no longer matches the MediaAssetVersion content_hash.", "Create a fresh approval for the current content hash.");
        const workspace = findWorkspace(store, workspaceId); const job = { publish_job_id: nextId("publish-job", store.publishJobs), workspace_id: workspaceId, customer_account_id: workspace.customer_account_id, approval_decision_id: decision.approval_decision_id, media_asset_version_id: version.media_asset_version_id, campaign_id: campaign.campaign_id, channel: body.channel, publish_status: "draft", scheduled_at: body.scheduled_at || null, published_at: null, idempotency_key: key };
        store.publishJobs.push(job); audit(store, workspaceId, user, "publish_job.created", "PublishJob", job.publish_job_id, null, job); return created(job);
      });
    }
  }

  const publishJobRead = child.match(/^publish-jobs\/([^/]+)$/);
  if (publishJobRead && req.method === "GET") { permissionGuard(membership, "manual_evidence.read"); return okOne(findPublishJob(store, workspaceId, publishJobRead[1])); }

  const publishJobStatus = child.match(/^publish-jobs\/([^/]+)\/status$/);
  if (publishJobStatus && req.method === "PATCH") {
    permissionGuard(membership, "publish_job.create"); rejectBodyWorkspaceId(body, workspaceId); requireFields(body, ["publish_status"]); requireOneOf(body.publish_status, publishStatuses, "VALIDATION_FAILED", "Publish job status is invalid.");
    const job = findPublishJob(store, workspaceId, publishJobStatus[1]); const before = { ...job }; job.publish_status = body.publish_status; job.published_at = body.publish_status === "published" ? now() : job.published_at;
    audit(store, workspaceId, user, "publish_job.status_updated", "PublishJob", job.publish_job_id, before, job); return okOne(job);
  }

  const evidenceForPublish = child.match(/^publish-jobs\/([^/]+)\/manual-evidence$/);
  if (evidenceForPublish) {
    const publishJob = findPublishJob(store, workspaceId, evidenceForPublish[1]);
    if (req.method === "GET") { permissionGuard(membership, "manual_evidence.read"); return ok(store.manualPublishEvidence.filter((ev) => ev.workspace_id === workspaceId && ev.publish_job_id === publishJob.publish_job_id)); }
    if (req.method === "POST") { permissionGuard(membership, "manual_evidence.submit"); rejectBodyWorkspaceId(body, workspaceId); const evidence = createManualEvidence(store, workspaceId, user, publishJob, body, null); audit(store, workspaceId, user, "manual_publish_evidence.submitted", "ManualPublishEvidence", evidence.manual_publish_evidence_id, null, evidence); return created(evidence); }
  }

  const evidenceRead = child.match(/^manual-evidence\/([^/]+)$/);
  if (evidenceRead && req.method === "GET") { permissionGuard(membership, "manual_evidence.read"); return okOne(findEvidence(store, workspaceId, evidenceRead[1])); }

  const evidenceInvalidate = child.match(/^manual-evidence\/([^/]+)\/invalidate$/);
  if (evidenceInvalidate && req.method === "POST") { permissionGuard(membership, "manual_evidence.invalidate"); rejectBodyWorkspaceId(body, workspaceId); requireFields(body, ["invalidated_reason"]); const ev = findEvidence(store, workspaceId, evidenceInvalidate[1]); const before = { ...ev }; ev.evidence_status = "invalidated"; ev.invalidated_reason = body.invalidated_reason; audit(store, workspaceId, user, "manual_publish_evidence.invalidated", "ManualPublishEvidence", ev.manual_publish_evidence_id, before, ev); return okOne(ev); }

  const evidenceSupersede = child.match(/^manual-evidence\/([^/]+)\/supersede$/);
  if (evidenceSupersede && req.method === "POST") { permissionGuard(membership, "manual_evidence.submit"); rejectBodyWorkspaceId(body, workspaceId); const existing = findEvidence(store, workspaceId, evidenceSupersede[1]); const job = findPublishJob(store, workspaceId, existing.publish_job_id); const before = { ...existing }; existing.evidence_status = "superseded"; const ev = createManualEvidence(store, workspaceId, user, job, body, existing.manual_publish_evidence_id); audit(store, workspaceId, user, "manual_publish_evidence.superseded", "ManualPublishEvidence", ev.manual_publish_evidence_id, before, ev); return created(ev); }

  throw notFound();
}

function isSprint3Path(path) { return /^\/workspaces\/[^/]+\/(asset-versions|review-tasks|approval-decisions|publish-jobs|manual-evidence)\//.test(path); }
function ok(data) { return { body: { data } }; }
function okOne(data) { return { body: { data } }; }
function created(data) { return { status: 201, body: { data } }; }
function notFound() { return new AppError(404, "NOT_FOUND", "Route was not found.", "Use an endpoint from the OpenAPI contract."); }
function nextId(prefix, collection) { return `${prefix}-${collection.length + 1}`; }
function now() { return new Date().toISOString(); }
function hash(value) { return createHash("sha256").update(JSON.stringify(value)).digest("hex"); }
function requireFields(body, fields) { const missing = fields.filter((field) => body[field] === undefined || body[field] === null || body[field] === ""); if (missing.length) throw new AppError(422, "VALIDATION_FAILED", `Missing required field(s): ${missing.join(", ")}.`, "Provide all required fields."); }
function requireOneOf(value, allowed, code, message) { if (!allowed.includes(value)) throw new AppError(422, code, message, "Use an approved value."); }
function findWorkspace(store, id) { const row = store.workspaces.find((x) => x.workspace_id === id); if (!row) throw new AppError(404, "NOT_FOUND", "Workspace was not found.", "Check the workspace ID."); return row; }
function findCampaign(store, workspaceId, id) { const row = store.campaigns.find((x) => x.workspace_id === workspaceId && x.campaign_id === id); if (!row) throw new AppError(404, "NOT_FOUND", "Campaign was not found in this workspace.", "Check the campaign and workspace IDs."); return row; }
function findVersion(store, workspaceId, id) { const row = store.mediaAssetVersions.find((x) => x.workspace_id === workspaceId && x.media_asset_version_id === id); if (!row) throw new AppError(404, "ASSET_VERSION_NOT_FOUND", "MediaAssetVersion was not found in this workspace.", "Check the version and workspace IDs."); return row; }
function findReviewTask(store, workspaceId, id) { const row = store.reviewTasks.find((x) => x.workspace_id === workspaceId && x.review_task_id === id); if (!row) throw new AppError(404, "REVIEW_TASK_NOT_FOUND", "ReviewTask was not found.", "Check the review task ID."); return row; }
function findDecision(store, workspaceId, id) { const row = store.approvalDecisions.find((x) => x.workspace_id === workspaceId && x.approval_decision_id === id); if (!row) throw new AppError(404, "APPROVAL_DECISION_NOT_FOUND", "ApprovalDecision was not found.", "Check the approval decision ID."); return row; }
function findPublishJob(store, workspaceId, id) { const row = store.publishJobs.find((x) => x.workspace_id === workspaceId && x.publish_job_id === id); if (!row) throw new AppError(404, "PUBLISH_JOB_NOT_FOUND", "PublishJob was not found.", "Check the publish job ID."); return row; }
function findEvidence(store, workspaceId, id) { const row = store.manualPublishEvidence.find((x) => x.workspace_id === workspaceId && x.manual_publish_evidence_id === id); if (!row) throw new AppError(404, "MANUAL_EVIDENCE_NOT_FOUND", "ManualPublishEvidence was not found.", "Check the evidence ID."); return row; }
function requireWorkspaceMember(store, workspaceId, userId) { if (!store.memberships.some((m) => m.workspace_id === workspaceId && m.user_id === userId && m.member_status === "active")) throw new AppError(422, "ASSIGNEE_NOT_WORKSPACE_MEMBER", "Assigned reviewer must be an active workspace member.", "Choose a reviewer from this workspace."); }
function requireIdempotencyKey(req) { const key = req.headers["idempotency-key"] || req.headers["Idempotency-Key"]; if (!key) throw new AppError(400, "IDEMPOTENCY_KEY_REQUIRED", "Idempotency-Key is required.", "Send an Idempotency-Key header."); return key; }
function stable(value) { return JSON.stringify(value, Object.keys(value).sort()); }
function withIdempotency(store, workspaceId, scope, key, body, createFn) { store.idempotencyRecords ||= []; const payload_hash = hash(body); const existing = store.idempotencyRecords.find((r) => r.workspace_id === workspaceId && r.scope === scope && r.idempotency_key === key); if (existing) { if (existing.payload_hash !== payload_hash) throw new AppError(409, "IDEMPOTENCY_CONFLICT", "Idempotency-Key was already used with a different payload.", "Use a new Idempotency-Key for different requests."); return existing.result; } const result = createFn(); store.idempotencyRecords.push({ workspace_id: workspaceId, scope, idempotency_key: key, payload_hash, result }); return result; }
function createManualEvidence(store, workspaceId, user, publishJob, body, supersedes) { const version = findVersion(store, workspaceId, body.media_asset_version_id || publishJob.media_asset_version_id); const contentHash = body.content_hash || version.content_hash; if (publishJob.media_asset_version_id !== version.media_asset_version_id) throw new AppError(409, "ASSET_VERSION_MISMATCH", "ManualPublishEvidence version must match the PublishJob version.", "Submit evidence for the published asset version."); if (contentHash !== version.content_hash) throw new AppError(409, "EVIDENCE_HASH_MISMATCH", "ManualPublishEvidence content_hash must match the MediaAssetVersion content_hash.", "Submit evidence for the exact approved content."); const evidence = { manual_publish_evidence_id: nextId("manual-evidence", store.manualPublishEvidence), workspace_id: workspaceId, publish_job_id: publishJob.publish_job_id, media_asset_version_id: version.media_asset_version_id, published_url: body.published_url || null, screenshot_ref: body.screenshot_ref || null, external_post_id: body.external_post_id || null, content_hash: contentHash, evidence_status: "valid", invalidated_reason: null, supersedes_evidence_id: supersedes, submitted_by_user_id: user.user_id, submitted_at: now() }; store.manualPublishEvidence.push(evidence); return evidence; }
function audit(store, workspaceId, user, action, entityType, entityId, before, after) { store.auditLogs.push({ audit_log_id: nextId("audit", store.auditLogs), workspace_id: workspaceId, actor_user_id: user.user_id, action, entity_type: entityType, entity_id: entityId, before_snapshot: before, after_snapshot: after, correlation_id: "sprint-3-placeholder", occurred_at: now() }); }
function readBody(req) { return new Promise((resolve, reject) => { const chunks = []; req.on("data", (chunk) => chunks.push(chunk)); req.on("error", reject); req.on("end", () => { const text = Buffer.concat(chunks).toString("utf8"); if (!text) return resolve({}); try { resolve(JSON.parse(text)); } catch { reject(new AppError(422, "VALIDATION_FAILED", "Request body must be valid JSON.", "Send a valid JSON body.")); } }); }); }

module.exports = { createApp, implementedRoutes };
