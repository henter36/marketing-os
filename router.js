const { AppError, correlationId, errorBody, sendJson } = require("./error-model");
const { createHash } = require("crypto");
const { createSeedStore } = require("./store");
const {
  authGuard,
  membershipCheck,
  permissionGuard,
  rejectBodyWorkspaceId,
  workspaceContextGuard
} = require("./guards");

const campaignStatuses = ["draft", "active", "paused", "completed", "archived"];
const brandRuleSeverities = ["info", "warning", "blocker"];
const mediaJobTypes = ["text", "image", "video", "image_enhancement", "variant", "report_asset"];
const mediaJobStatusUpdates = ["running", "succeeded", "failed", "canceled"];
const assetTypes = ["text", "image", "video", "mixed", "report"];
const guardrailTypes = ["daily", "monthly", "per_job", "per_campaign"];
const guardrailActions = ["warn", "block", "require_review"];
const costEventStatuses = ["estimated", "actual", "reversed"];

const implementedRoutes = [
  "GET /workspaces",
  "POST /workspaces",
  "GET /workspaces/{workspaceId}",
  "PATCH /workspaces/{workspaceId}",
  "GET /workspaces/{workspaceId}/members",
  "POST /workspaces/{workspaceId}/members",
  "PATCH /workspaces/{workspaceId}/members/{memberId}",
  "GET /roles",
  "GET /permissions",
  "GET /workspaces/{workspaceId}/brand-profiles",
  "POST /workspaces/{workspaceId}/brand-profiles",
  "GET /workspaces/{workspaceId}/brand-profiles/{brandProfileId}/rules",
  "POST /workspaces/{workspaceId}/brand-profiles/{brandProfileId}/rules",
  "GET /workspaces/{workspaceId}/prompt-templates",
  "POST /workspaces/{workspaceId}/prompt-templates",
  "GET /workspaces/{workspaceId}/report-templates",
  "POST /workspaces/{workspaceId}/report-templates",
  "GET /workspaces/{workspaceId}/campaigns",
  "POST /workspaces/{workspaceId}/campaigns",
  "GET /workspaces/{workspaceId}/campaigns/{campaignId}",
  "PATCH /workspaces/{workspaceId}/campaigns/{campaignId}",
  "GET /workspaces/{workspaceId}/campaigns/{campaignId}/state-transitions",
  "POST /workspaces/{workspaceId}/campaigns/{campaignId}/state-transitions",
  "GET /workspaces/{workspaceId}/campaigns/{campaignId}/brief-versions",
  "POST /workspaces/{workspaceId}/campaigns/{campaignId}/brief-versions",
  "GET /workspaces/{workspaceId}/cost-budgets",
  "POST /workspaces/{workspaceId}/cost-budgets",
  "GET /workspaces/{workspaceId}/cost-guardrails",
  "POST /workspaces/{workspaceId}/cost-guardrails",
  "GET /workspaces/{workspaceId}/campaigns/{campaignId}/media-jobs",
  "POST /workspaces/{workspaceId}/campaigns/{campaignId}/media-jobs",
  "GET /workspaces/{workspaceId}/media-jobs/{mediaJobId}",
  "PATCH /workspaces/{workspaceId}/media-jobs/{mediaJobId}/status",
  "GET /workspaces/{workspaceId}/media-jobs/{mediaJobId}/assets",
  "POST /workspaces/{workspaceId}/media-jobs/{mediaJobId}/assets",
  "GET /workspaces/{workspaceId}/assets/{mediaAssetId}/versions",
  "POST /workspaces/{workspaceId}/assets/{mediaAssetId}/versions",
  "GET /workspaces/{workspaceId}/usage-meter",
  "POST /workspaces/{workspaceId}/usage-meter",
  "GET /workspaces/{workspaceId}/quota-state",
  "GET /workspaces/{workspaceId}/cost-events",
  "POST /workspaces/{workspaceId}/cost-events"
];

function createApp(options = {}) {
  const store = options.store || createSeedStore();

  return async function app(req, res) {
    const id = correlationId(req);

    try {
      const body = await readBody(req);
      const result = route(req, body, store);
      sendJson(res, result.status || 200, result.body);
    } catch (error) {
      const appError = error instanceof AppError
        ? error
        : new AppError(500, "INTERNAL_ERROR", "Unexpected server error.", "Retry or contact support.");
      sendJson(res, appError.status, errorBody(appError, id));
    }
  };
}

function route(req, body, store) {
  const url = new URL(req.url, "http://localhost");
  const path = url.pathname.replace(/^\/v1/, "");

  if (req.method === "GET" && path === "/health") {
    return { body: { data: { status: "ok", service: "marketing-os", sprint: "0" } } };
  }

  if (req.method === "GET" && path === "/ready") {
    return { body: { data: { status: "ready", checks: { application: "ok" } } } };
  }

  if (req.method === "GET" && path === "/roles") {
    const user = authGuard(req, store);
    return { body: { data: store.roles, actor_user_id: user.user_id } };
  }

  if (req.method === "GET" && path === "/permissions") {
    const user = authGuard(req, store);
    return { body: { data: store.permissions, actor_user_id: user.user_id } };
  }

  if (req.method === "GET" && path === "/workspaces") {
    const user = authGuard(req, store);
    const memberships = store.memberships.filter((membership) => membership.user_id === user.user_id);
    const workspaceIds = new Set(memberships.map((membership) => membership.workspace_id));
    return { body: { data: store.workspaces.filter((workspace) => workspaceIds.has(workspace.workspace_id)) } };
  }

  if (req.method === "POST" && path === "/workspaces") {
    const user = authGuard(req, store);
    rejectAnyBodyWorkspaceId(body);
    requireUserPermission(user, store, "workspace.create");
    requireFields(body, ["customer_account_id", "workspace_name"]);
    const workspace = {
      workspace_id: nextId("workspace", store.workspaces),
      customer_account_id: body.customer_account_id,
      workspace_name: body.workspace_name,
      created_by_user_id: user.user_id
    };
    store.workspaces.push(workspace);
    store.memberships.push({
      workspace_member_id: nextId("member", store.memberships),
      user_id: user.user_id,
      workspace_id: workspace.workspace_id,
      role_code: "owner",
      member_status: "active"
    });
    audit(store, workspace.workspace_id, user, "workspace.created", "Workspace", workspace.workspace_id, null, workspace);
    return { status: 201, body: { data: workspace } };
  }

  const workspaceMatch = path.match(/^\/workspaces\/([^/]+)(?:\/(.*))?$/);
  if (workspaceMatch) {
    const workspaceId = workspaceContextGuard({ workspaceId: workspaceMatch[1] });
    const user = authGuard(req, store);
    const membership = membershipCheck(user, workspaceId, store);
    const child = workspaceMatch[2] || "";

    if (req.method === "GET" && child === "") {
      permissionGuard(membership, "workspace.read");
      return { body: { data: findWorkspace(store, workspaceId) } };
    }

    if (req.method === "PATCH" && child === "") {
      permissionGuard(membership, "workspace.manage");
      rejectBodyWorkspaceId(body, workspaceId);
      rejectImmutable(body, ["workspace_id", "customer_account_id", "created_by_user_id"]);
      const workspace = findWorkspace(store, workspaceId);
      const before = { ...workspace };
      if (body.workspace_name !== undefined) {
        workspace.workspace_name = body.workspace_name;
      }
      audit(store, workspaceId, user, "workspace.updated", "Workspace", workspaceId, before, workspace);
      return { body: { data: workspace } };
    }

    if (req.method === "GET" && child === "members") {
      permissionGuard(membership, "workspace.manage_members");
      return { body: { data: store.memberships.filter((candidate) => candidate.workspace_id === workspaceId) } };
    }

    if (req.method === "POST" && child === "members") {
      permissionGuard(membership, "workspace.manage_members");
      rejectBodyWorkspaceId(body, workspaceId);
      requireFields(body, ["user_id", "role_code"]);
      ensureRole(body.role_code, store);
      const existing = store.memberships.find(
        (candidate) => candidate.workspace_id === workspaceId && candidate.user_id === body.user_id
      );
      if (existing) {
        throw new AppError(409, "MEMBER_ALREADY_EXISTS", "Workspace member already exists.", "Update the existing member instead.");
      }
      const member = {
        workspace_member_id: nextId("member", store.memberships),
        user_id: body.user_id,
        workspace_id: workspaceId,
        role_code: body.role_code,
        member_status: body.member_status || "active"
      };
      store.memberships.push(member);
      audit(store, workspaceId, user, "member.invited", "WorkspaceMember", member.workspace_member_id, null, member);
      return { status: 201, body: { data: member } };
    }

    const memberUpdate = child.match(/^members\/([^/]+)$/);
    if (req.method === "PATCH" && memberUpdate) {
      permissionGuard(membership, "workspace.manage_members");
      rejectBodyWorkspaceId(body, workspaceId);
      const member = store.memberships.find(
        (candidate) => candidate.workspace_member_id === memberUpdate[1] && candidate.workspace_id === workspaceId
      );
      if (!member) {
        throw new AppError(404, "NOT_FOUND", "Workspace member was not found.", "Check the member and workspace IDs.");
      }
      if (body.role_code !== undefined) {
        ensureRole(body.role_code, store);
      }
      const before = { ...member };
      if (body.role_code !== undefined) {
        member.role_code = body.role_code;
      }
      if (body.member_status !== undefined) {
        member.member_status = body.member_status;
      }
      audit(store, workspaceId, user, "member.role_changed", "WorkspaceMember", member.workspace_member_id, before, member);
      return { body: { data: member } };
    }

    const sprint1Result = routeSprint1(req, body, store, workspaceId, user, membership, child);
    if (sprint1Result) {
      return sprint1Result;
    }

    const sprint2Result = routeSprint2(req, body, store, workspaceId, user, membership, child);
    if (sprint2Result) {
      return sprint2Result;
    }
  }

  throw new AppError(404, "NOT_FOUND", "Route was not found.", "Use an endpoint from the OpenAPI contract.");
}

function routeSprint1(req, body, store, workspaceId, user, membership, child) {
  if (req.method === "GET" && child === "brand-profiles") {
    permissionGuard(membership, "brand.read");
    return { body: { data: store.brandProfiles.filter((candidate) => candidate.workspace_id === workspaceId) } };
  }

  if (req.method === "POST" && child === "brand-profiles") {
    permissionGuard(membership, "brand.write");
    rejectBodyWorkspaceId(body, workspaceId);
    requireFields(body, ["brand_name"]);
    if (store.brandProfiles.some((candidate) => candidate.workspace_id === workspaceId && candidate.brand_name === body.brand_name)) {
      throw new AppError(409, "DUPLICATE_BRAND_PROFILE", "Brand profile already exists in this workspace.", "Use a different brand name.");
    }
    const brandProfile = {
      brand_profile_id: nextId("brand-profile", store.brandProfiles),
      workspace_id: workspaceId,
      brand_name: body.brand_name,
      brand_description: body.brand_description || ""
    };
    store.brandProfiles.push(brandProfile);
    audit(store, workspaceId, user, "brand_profile.created", "BrandProfile", brandProfile.brand_profile_id, null, brandProfile);
    return { status: 201, body: { data: brandProfile } };
  }

  const brandRules = child.match(/^brand-profiles\/([^/]+)\/rules$/);
  if (brandRules) {
    const brandProfile = findBrandProfile(store, workspaceId, brandRules[1]);
    if (req.method === "GET") {
      permissionGuard(membership, "brand.read");
      return {
        body: {
          data: store.brandVoiceRules.filter(
            (candidate) => candidate.workspace_id === workspaceId && candidate.brand_profile_id === brandProfile.brand_profile_id
          )
        }
      };
    }
    if (req.method === "POST") {
      permissionGuard(membership, "brand.write");
      rejectBodyWorkspaceId(body, workspaceId);
      requireFields(body, ["rule_type", "rule_text", "severity"]);
      if (!brandRuleSeverities.includes(body.severity)) {
        throw new AppError(422, "VALIDATION_FAILED", "Brand voice rule severity is invalid.", "Use info, warning, or blocker.");
      }
      const rule = {
        brand_voice_rule_id: nextId("brand-rule", store.brandVoiceRules),
        brand_profile_id: brandProfile.brand_profile_id,
        workspace_id: workspaceId,
        rule_type: body.rule_type,
        rule_text: body.rule_text,
        severity: body.severity
      };
      store.brandVoiceRules.push(rule);
      audit(store, workspaceId, user, "brand_voice_rule.created", "BrandVoiceRule", rule.brand_voice_rule_id, null, rule);
      return { status: 201, body: { data: rule } };
    }
  }

  if (req.method === "GET" && child === "prompt-templates") {
    permissionGuard(membership, "prompt_template.read");
    return { body: { data: store.promptTemplates.filter((candidate) => candidate.workspace_id === workspaceId) } };
  }

  if (req.method === "POST" && child === "prompt-templates") {
    permissionGuard(membership, "prompt_template.write");
    rejectBodyWorkspaceId(body, workspaceId);
    requireFields(body, ["template_name", "template_type", "template_body", "version_number"]);
    if (store.promptTemplates.some((candidate) => candidate.workspace_id === workspaceId && candidate.template_name === body.template_name && candidate.version_number === body.version_number)) {
      throw new AppError(409, "DUPLICATE_TEMPLATE_VERSION", "Prompt template version already exists.", "Use a new version number.");
    }
    const template = {
      prompt_template_id: nextId("prompt-template", store.promptTemplates),
      workspace_id: workspaceId,
      template_name: body.template_name,
      template_type: body.template_type,
      template_body: body.template_body,
      variables: body.variables || [],
      version_number: body.version_number
    };
    store.promptTemplates.push(template);
    audit(store, workspaceId, user, "prompt_template.created", "PromptTemplate", template.prompt_template_id, null, template);
    return { status: 201, body: { data: template } };
  }

  if (req.method === "GET" && child === "report-templates") {
    permissionGuard(membership, "report_template.read");
    return { body: { data: store.reportTemplates.filter((candidate) => candidate.workspace_id === workspaceId) } };
  }

  if (req.method === "POST" && child === "report-templates") {
    permissionGuard(membership, "report_template.write");
    rejectBodyWorkspaceId(body, workspaceId);
    requireFields(body, ["template_name", "report_type", "template_body"]);
    const template = {
      report_template_id: nextId("report-template", store.reportTemplates),
      workspace_id: workspaceId,
      template_name: body.template_name,
      report_type: body.report_type,
      template_body: body.template_body
    };
    store.reportTemplates.push(template);
    audit(store, workspaceId, user, "report_template.created", "ReportTemplate", template.report_template_id, null, template);
    return { status: 201, body: { data: template } };
  }

  if (req.method === "GET" && child === "campaigns") {
    permissionGuard(membership, "campaign.read");
    return { body: { data: store.campaigns.filter((candidate) => candidate.workspace_id === workspaceId) } };
  }

  if (req.method === "POST" && child === "campaigns") {
    permissionGuard(membership, "campaign.write");
    rejectBodyWorkspaceId(body, workspaceId);
    requireFields(body, ["campaign_name", "campaign_objective"]);
    const workspace = findWorkspace(store, workspaceId);
    const campaign = {
      campaign_id: nextId("campaign", store.campaigns),
      workspace_id: workspaceId,
      customer_account_id: workspace.customer_account_id,
      campaign_name: body.campaign_name,
      campaign_objective: body.campaign_objective,
      campaign_status: "draft"
    };
    store.campaigns.push(campaign);
    store.campaignStateTransitions.push({
      campaign_state_transition_id: nextId("campaign-transition", store.campaignStateTransitions),
      campaign_id: campaign.campaign_id,
      workspace_id: workspaceId,
      from_status: null,
      to_status: "draft",
      reason: "Campaign created",
      changed_at: now()
    });
    audit(store, workspaceId, user, "campaign.created", "Campaign", campaign.campaign_id, null, campaign);
    return { status: 201, body: { data: campaign } };
  }

  const campaignRead = child.match(/^campaigns\/([^/]+)$/);
  if (campaignRead) {
    if (req.method === "GET") {
      permissionGuard(membership, "campaign.read");
      return { body: { data: findCampaign(store, workspaceId, campaignRead[1]) } };
    }
    if (req.method === "PATCH") {
      permissionGuard(membership, "campaign.write");
      rejectBodyWorkspaceId(body, workspaceId);
      rejectImmutable(body, ["campaign_id", "workspace_id", "customer_account_id", "campaign_status"]);
      const campaign = findCampaign(store, workspaceId, campaignRead[1]);
      const before = { ...campaign };
      if (body.campaign_name !== undefined) {
        campaign.campaign_name = body.campaign_name;
      }
      if (body.campaign_objective !== undefined) {
        campaign.campaign_objective = body.campaign_objective;
      }
      audit(store, workspaceId, user, "campaign.updated", "Campaign", campaign.campaign_id, before, campaign);
      return { body: { data: campaign } };
    }
  }

  const stateTransitions = child.match(/^campaigns\/([^/]+)\/state-transitions$/);
  if (stateTransitions) {
    const campaign = findCampaign(store, workspaceId, stateTransitions[1]);
    if (req.method === "GET") {
      permissionGuard(membership, "campaign.read");
      return {
        body: {
          data: store.campaignStateTransitions.filter(
            (candidate) => candidate.workspace_id === workspaceId && candidate.campaign_id === campaign.campaign_id
          )
        }
      };
    }
    if (req.method === "POST") {
      permissionGuard(membership, "campaign.write");
      rejectBodyWorkspaceId(body, workspaceId);
      requireFields(body, ["to_status"]);
      if (!campaignStatuses.includes(body.to_status)) {
        throw new AppError(422, "INVALID_CAMPAIGN_STATE", "Campaign state is invalid.", "Use an approved campaign state.");
      }
      const before = { ...campaign };
      const transition = {
        campaign_state_transition_id: nextId("campaign-transition", store.campaignStateTransitions),
        campaign_id: campaign.campaign_id,
        workspace_id: workspaceId,
        from_status: campaign.campaign_status,
        to_status: body.to_status,
        reason: body.reason || null,
        changed_at: now()
      };
      campaign.campaign_status = body.to_status;
      store.campaignStateTransitions.push(transition);
      audit(store, workspaceId, user, "campaign.status_changed", "Campaign", campaign.campaign_id, before, campaign);
      return { status: 201, body: { data: transition } };
    }
  }

  const briefVersions = child.match(/^campaigns\/([^/]+)\/brief-versions$/);
  if (briefVersions) {
    const campaign = findCampaign(store, workspaceId, briefVersions[1]);
    if (req.method === "GET") {
      permissionGuard(membership, "brief.read");
      return {
        body: {
          data: store.briefVersions.filter(
            (candidate) => candidate.workspace_id === workspaceId && candidate.campaign_id === campaign.campaign_id
          )
        }
      };
    }
    if (req.method === "POST") {
      permissionGuard(membership, "brief.write");
      rejectBodyWorkspaceId(body, workspaceId);
      if (Object.hasOwn(body, "content_hash")) {
        throw new AppError(422, "VALIDATION_FAILED", "content_hash is generated server-side.", "Remove content_hash from the request body.");
      }
      requireFields(body, ["brief_title", "brief_content", "version_number"]);
      if (store.briefVersions.some((candidate) => candidate.workspace_id === workspaceId && candidate.campaign_id === campaign.campaign_id && candidate.version_number === body.version_number)) {
        throw new AppError(409, "DUPLICATE_BRIEF_VERSION", "Brief version already exists for this campaign.", "Use a new version number.");
      }
      const brief = {
        brief_version_id: nextId("brief-version", store.briefVersions),
        workspace_id: workspaceId,
        campaign_id: campaign.campaign_id,
        version_number: body.version_number,
        brief_title: body.brief_title,
        brief_content: body.brief_content,
        content_hash: hashContent(body.brief_content),
        status: "draft"
      };
      store.briefVersions.push(brief);
      audit(store, workspaceId, user, "brief.version_created", "BriefVersion", brief.brief_version_id, null, brief);
      return { status: 201, body: { data: brief } };
    }
  }

  return null;
}

function routeSprint2(req, body, store, workspaceId, user, membership, child) {
  if (req.method === "GET" && child === "cost-budgets") {
    permissionGuard(membership, "cost_budget.read");
    return { body: { data: store.costBudgets.filter((candidate) => candidate.workspace_id === workspaceId) } };
  }

  if (req.method === "POST" && child === "cost-budgets") {
    permissionGuard(membership, "cost_budget.write");
    rejectBodyWorkspaceId(body, workspaceId);
    requireFields(body, ["budget_name", "budget_amount", "currency", "period_start", "period_end"]);
    requireNonNegative(body.budget_amount, "INVALID_COST_AMOUNT", "Budget amount cannot be negative.");
    const workspace = findWorkspace(store, workspaceId);
    const budget = {
      cost_budget_id: nextId("cost-budget", store.costBudgets),
      workspace_id: workspaceId,
      customer_account_id: workspace.customer_account_id,
      budget_name: body.budget_name,
      budget_amount: body.budget_amount,
      currency: body.currency,
      period_start: body.period_start,
      period_end: body.period_end,
      budget_status: "active"
    };
    store.costBudgets.push(budget);
    audit(store, workspaceId, user, "cost_budget.created", "CostBudget", budget.cost_budget_id, null, budget);
    return { status: 201, body: { data: budget } };
  }

  if (req.method === "GET" && child === "cost-guardrails") {
    permissionGuard(membership, "cost_guardrail.read");
    return { body: { data: store.costGuardrails.filter((candidate) => candidate.workspace_id === workspaceId) } };
  }

  if (req.method === "POST" && child === "cost-guardrails") {
    permissionGuard(membership, "cost_guardrail.write");
    rejectBodyWorkspaceId(body, workspaceId);
    requireFields(body, ["guardrail_name", "guardrail_type", "threshold_amount", "currency", "action"]);
    requireOneOf(body.guardrail_type, guardrailTypes, "INVALID_COST_THRESHOLD", "Cost guardrail type is invalid.");
    requireOneOf(body.action, guardrailActions, "INVALID_COST_THRESHOLD", "Cost guardrail action is invalid.");
    requireNonNegative(body.threshold_amount, "INVALID_COST_THRESHOLD", "Cost guardrail threshold cannot be negative.");
    const workspace = findWorkspace(store, workspaceId);
    const guardrail = {
      cost_guardrail_id: nextId("cost-guardrail", store.costGuardrails),
      workspace_id: workspaceId,
      customer_account_id: workspace.customer_account_id,
      guardrail_name: body.guardrail_name,
      guardrail_type: body.guardrail_type,
      threshold_amount: body.threshold_amount,
      currency: body.currency,
      action: body.action,
      guardrail_status: "active"
    };
    store.costGuardrails.push(guardrail);
    audit(store, workspaceId, user, "cost_guardrail.created", "CostGuardrail", guardrail.cost_guardrail_id, null, guardrail);
    return { status: 201, body: { data: guardrail } };
  }

  const campaignMediaJobs = child.match(/^campaigns\/([^/]+)\/media-jobs$/);
  if (campaignMediaJobs) {
    const campaign = findCampaign(store, workspaceId, campaignMediaJobs[1]);
    if (req.method === "GET") {
      permissionGuard(membership, "media_job.read");
      return {
        body: {
          data: store.mediaJobs.filter(
            (candidate) => candidate.workspace_id === workspaceId && candidate.campaign_id === campaign.campaign_id
          )
        }
      };
    }
    if (req.method === "POST") {
      permissionGuard(membership, "media_job.create");
      rejectBodyWorkspaceId(body, workspaceId);
      const key = requireIdempotencyKey(req);
      return withIdempotency(store, workspaceId, "media_job.create", key, body, () => {
        requireFields(body, ["brief_version_id", "prompt_template_id", "job_type", "input_payload", "requested_output_format"]);
        requireOneOf(body.job_type, mediaJobTypes, "VALIDATION_FAILED", "Media job type is invalid.");
        const brief = findBriefVersion(store, workspaceId, campaign.campaign_id, body.brief_version_id);
        const promptTemplate = findPromptTemplate(store, workspaceId, body.prompt_template_id);
        const snapshot = requireApprovedCostSnapshot(store, workspaceId, {
          campaign_id: campaign.campaign_id,
          brief_version_id: brief.brief_version_id,
          prompt_template_id: promptTemplate.prompt_template_id,
          job_type: body.job_type
        });
        enforceCostPolicy(store, workspaceId);
        enforceCostGuardrails(store, workspaceId, snapshot);
        const job = {
          media_job_id: nextId("media-job", store.mediaJobs),
          workspace_id: workspaceId,
          customer_account_id: campaign.customer_account_id,
          campaign_id: campaign.campaign_id,
          brief_version_id: brief.brief_version_id,
          prompt_template_id: promptTemplate.prompt_template_id,
          media_cost_snapshot_id: snapshot.media_cost_snapshot_id,
          job_type: body.job_type,
          job_status: "queued",
          input_payload: body.input_payload,
          requested_output_format: body.requested_output_format,
          idempotency_key: key,
          failure_code: null
        };
        store.mediaJobs.push(job);
        audit(store, workspaceId, user, "media_job.created", "MediaJob", job.media_job_id, null, job);
        return { status: 202, body: { data: job } };
      });
    }
  }

  const mediaJobRead = child.match(/^media-jobs\/([^/]+)$/);
  if (mediaJobRead && req.method === "GET") {
    permissionGuard(membership, "media_job.read");
    return { body: { data: findMediaJob(store, workspaceId, mediaJobRead[1]) } };
  }

  const mediaJobStatus = child.match(/^media-jobs\/([^/]+)\/status$/);
  if (mediaJobStatus && req.method === "PATCH") {
    permissionGuard(membership, "media_job.update_status");
    rejectBodyWorkspaceId(body, workspaceId);
    requireFields(body, ["job_status"]);
    requireOneOf(body.job_status, mediaJobStatusUpdates, "VALIDATION_FAILED", "Media job status is invalid.");
    const job = findMediaJob(store, workspaceId, mediaJobStatus[1]);
    if (["running", "succeeded"].includes(body.job_status)) {
      requireJobApprovedCostSnapshot(store, workspaceId, job);
    }
    const before = { ...job };
    job.job_status = body.job_status;
    job.failure_code = body.job_status === "failed" ? body.failure_code || null : null;
    const auditAction = body.job_status === "succeeded"
      ? "media_job.completed"
      : body.job_status === "failed"
        ? "media_job.failed"
        : "media_job.status_updated";
    audit(store, workspaceId, user, auditAction, "MediaJob", job.media_job_id, before, job);
    return { body: { data: job } };
  }

  const mediaJobAssets = child.match(/^media-jobs\/([^/]+)\/assets$/);
  if (mediaJobAssets) {
    const job = findMediaJob(store, workspaceId, mediaJobAssets[1]);
    if (req.method === "GET") {
      permissionGuard(membership, "media_asset.read");
      return {
        body: {
          data: store.mediaAssets.filter(
            (candidate) => candidate.workspace_id === workspaceId && candidate.media_job_id === job.media_job_id
          )
        }
      };
    }
    if (req.method === "POST") {
      permissionGuard(membership, "media_asset.create");
      rejectBodyWorkspaceId(body, workspaceId);
      requireFields(body, ["asset_type"]);
      requireOneOf(body.asset_type, assetTypes, "VALIDATION_FAILED", "Media asset type is invalid.");
      if (job.job_status !== "succeeded") {
        throw new AppError(409, "MEDIA_JOB_NOT_SUCCEEDED", "MediaAsset requires a succeeded MediaJob.", "Only create assets after usable output exists.");
      }
      const asset = {
        media_asset_id: nextId("asset", store.mediaAssets),
        workspace_id: workspaceId,
        customer_account_id: job.customer_account_id,
        media_job_id: job.media_job_id,
        campaign_id: job.campaign_id,
        asset_type: body.asset_type,
        asset_status: "draft"
      };
      store.mediaAssets.push(asset);
      audit(store, workspaceId, user, "media_asset.created", "MediaAsset", asset.media_asset_id, null, asset);
      return { status: 201, body: { data: asset } };
    }
  }

  const assetVersions = child.match(/^assets\/([^/]+)\/versions$/);
  if (assetVersions) {
    const asset = findMediaAsset(store, workspaceId, assetVersions[1]);
    if (req.method === "GET") {
      permissionGuard(membership, "media_asset.read");
      return {
        body: {
          data: store.mediaAssetVersions.filter(
            (candidate) => candidate.workspace_id === workspaceId && candidate.media_asset_id === asset.media_asset_id
          )
        }
      };
    }
    if (req.method === "POST") {
      permissionGuard(membership, "media_asset.version_create");
      rejectBodyWorkspaceId(body, workspaceId);
      if (Object.hasOwn(body, "content_hash")) {
        throw new AppError(422, "VALIDATION_FAILED", "content_hash is generated server-side.", "Remove content_hash from the request body.");
      }
      requireFields(body, ["version_number", "content_payload"]);
      if (store.mediaAssetVersions.some((candidate) => candidate.workspace_id === workspaceId && candidate.media_asset_id === asset.media_asset_id && candidate.version_number === body.version_number)) {
        throw new AppError(409, "DUPLICATE_ASSET_VERSION", "Media asset version already exists for this asset.", "Use a new version number.");
      }
      const version = {
        media_asset_version_id: nextId("asset-version", store.mediaAssetVersions),
        workspace_id: workspaceId,
        customer_account_id: asset.customer_account_id,
        media_asset_id: asset.media_asset_id,
        version_number: body.version_number,
        content_payload: body.content_payload,
        content_hash: hashContent(body.content_payload),
        storage_ref: body.storage_ref || null,
        version_status: "draft"
      };
      store.mediaAssetVersions.push(version);
      audit(store, workspaceId, user, "media_asset.version_created", "MediaAssetVersion", version.media_asset_version_id, null, version);
      return { status: 201, body: { data: version } };
    }
  }

  if (req.method === "GET" && child === "usage-meter") {
    permissionGuard(membership, "usage.read");
    return { body: { data: store.usageMeters.filter((candidate) => candidate.workspace_id === workspaceId) } };
  }

  if (req.method === "POST" && child === "usage-meter") {
    permissionGuard(membership, "usage.record");
    rejectBodyWorkspaceId(body, workspaceId);
    const key = requireIdempotencyKey(req);
    return withIdempotency(store, workspaceId, "usage_meter.record", key, body, () => {
      requireFields(body, ["usage_type", "quantity", "unit", "source_entity_type", "source_entity_id", "usable_output_confirmed"]);
      if (body.usable_output_confirmed !== true) {
        throw new AppError(422, "USAGE_OUTPUT_NOT_CONFIRMED", "UsageMeter requires usable_output_confirmed=true.", "Record usage only after usable output exists.");
      }
      if (Number(body.quantity) <= 0) {
        throw new AppError(422, "INVALID_USAGE_QUANTITY", "Usage quantity must be greater than zero.", "Send a positive usage quantity.");
      }
      const workspace = findWorkspace(store, workspaceId);
      validateUsageSource(store, workspaceId, body.source_entity_type, body.source_entity_id);
      const usage = {
        usage_meter_id: nextId("usage-meter", store.usageMeters),
        workspace_id: workspaceId,
        customer_account_id: workspace.customer_account_id,
        usage_type: body.usage_type,
        quantity: body.quantity,
        unit: body.unit,
        source_entity_type: body.source_entity_type,
        source_entity_id: body.source_entity_id,
        usable_output_confirmed: true,
        metered_at: now()
      };
      store.usageMeters.push(usage);
      audit(store, workspaceId, user, "usage_meter.recorded", "UsageMeter", usage.usage_meter_id, null, usage);
      return { status: 201, body: { data: usage } };
    });
  }

  if (req.method === "GET" && child === "quota-state") {
    permissionGuard(membership, "usage.read");
    return { body: { data: store.usageQuotaStates.filter((candidate) => candidate.workspace_id === workspaceId) } };
  }

  if (req.method === "GET" && child === "cost-events") {
    permissionGuard(membership, "cost.read");
    return { body: { data: store.costEvents.filter((candidate) => candidate.workspace_id === workspaceId) } };
  }

  if (req.method === "POST" && child === "cost-events") {
    permissionGuard(membership, "cost.record");
    rejectBodyWorkspaceId(body, workspaceId);
    requireFields(body, ["cost_type", "amount", "currency", "event_status", "source_entity_type", "source_entity_id"]);
    requireOneOf(body.event_status, costEventStatuses, "VALIDATION_FAILED", "Cost event status is invalid.");
    requireNonNegative(body.amount, "INVALID_COST_AMOUNT", "CostEvent amount cannot be negative.");
    const workspace = findWorkspace(store, workspaceId);
    if (body.media_job_id !== undefined) {
      findMediaJob(store, workspaceId, body.media_job_id);
    }
    validateCostSource(store, workspaceId, body.source_entity_type, body.source_entity_id);
    const costEvent = {
      cost_event_id: nextId("cost-event", store.costEvents),
      workspace_id: workspaceId,
      customer_account_id: workspace.customer_account_id,
      media_job_id: body.media_job_id || null,
      cost_type: body.cost_type,
      provider_name: body.provider_name || null,
      amount: body.amount,
      currency: body.currency,
      event_status: body.event_status,
      source_entity_type: body.source_entity_type,
      source_entity_id: body.source_entity_id,
      occurred_at: now()
    };
    store.costEvents.push(costEvent);
    audit(store, workspaceId, user, "cost_event.recorded", "CostEvent", costEvent.cost_event_id, null, costEvent);
    return { status: 201, body: { data: costEvent } };
  }

  return null;
}

function audit(store, workspaceId, user, action, entityType, entityId, before, after) {
  store.auditLogs.push({
    audit_log_id: nextId("audit", store.auditLogs),
    workspace_id: workspaceId,
    actor_user_id: user.user_id,
    action,
    entity_type: entityType,
    entity_id: entityId,
    before_snapshot: before,
    after_snapshot: after,
    correlation_id: "sprint-2-placeholder",
    occurred_at: now()
  });
}

function ensureRole(roleCode, store) {
  if (!store.roles.some((role) => role.role_code === roleCode)) {
    throw new AppError(422, "ROLE_NOT_FOUND", "Role was not found.", "Use an approved role_code.");
  }
}

function findWorkspace(store, workspaceId) {
  const workspace = store.workspaces.find((candidate) => candidate.workspace_id === workspaceId);
  if (!workspace) {
    throw new AppError(404, "NOT_FOUND", "Workspace was not found.", "Check the workspace ID.");
  }
  return workspace;
}

function findCampaign(store, workspaceId, campaignId) {
  const campaign = store.campaigns.find(
    (candidate) => candidate.campaign_id === campaignId && candidate.workspace_id === workspaceId
  );
  if (!campaign) {
    throw new AppError(404, "NOT_FOUND", "Campaign was not found in this workspace.", "Check the campaign and workspace IDs.");
  }
  return campaign;
}

function findBrandProfile(store, workspaceId, brandProfileId) {
  const brandProfile = store.brandProfiles.find(
    (candidate) => candidate.brand_profile_id === brandProfileId && candidate.workspace_id === workspaceId
  );
  if (!brandProfile) {
    throw new AppError(404, "BRAND_PROFILE_NOT_FOUND", "Brand profile was not found in this workspace.", "Check the brand profile and workspace IDs.");
  }
  return brandProfile;
}

function findBriefVersion(store, workspaceId, campaignId, briefVersionId) {
  const brief = store.briefVersions.find(
    (candidate) =>
      candidate.brief_version_id === briefVersionId &&
      candidate.workspace_id === workspaceId &&
      candidate.campaign_id === campaignId
  );
  if (!brief) {
    throw new AppError(404, "BRIEF_VERSION_NOT_FOUND", "Brief version was not found in this workspace and campaign.", "Use a brief from the current campaign.");
  }
  return brief;
}

function findPromptTemplate(store, workspaceId, promptTemplateId) {
  const promptTemplate = store.promptTemplates.find(
    (candidate) => candidate.prompt_template_id === promptTemplateId && candidate.workspace_id === workspaceId
  );
  if (!promptTemplate) {
    throw new AppError(404, "PROMPT_TEMPLATE_NOT_FOUND", "Prompt template was not found in this workspace.", "Use a prompt template from the current workspace.");
  }
  return promptTemplate;
}

function findMediaJob(store, workspaceId, mediaJobId) {
  const job = store.mediaJobs.find(
    (candidate) => candidate.media_job_id === mediaJobId && candidate.workspace_id === workspaceId
  );
  if (!job) {
    throw new AppError(404, "MEDIA_JOB_NOT_FOUND", "Media job was not found in this workspace.", "Check the media job and workspace IDs.");
  }
  return job;
}

function findMediaAsset(store, workspaceId, mediaAssetId) {
  const asset = store.mediaAssets.find(
    (candidate) => candidate.media_asset_id === mediaAssetId && candidate.workspace_id === workspaceId
  );
  if (!asset) {
    throw new AppError(404, "MEDIA_ASSET_NOT_FOUND", "Media asset was not found in this workspace.", "Check the asset and workspace IDs.");
  }
  return asset;
}

function requireApprovedCostSnapshot(store, workspaceId, criteria) {
  const snapshot = store.mediaCostSnapshots.find(
    (candidate) =>
      candidate.workspace_id === workspaceId &&
      candidate.campaign_id === criteria.campaign_id &&
      candidate.brief_version_id === criteria.brief_version_id &&
      candidate.prompt_template_id === criteria.prompt_template_id &&
      candidate.job_type === criteria.job_type &&
      candidate.cost_check_result === "approved"
  );
  if (!snapshot) {
    throw new AppError(409, "MEDIA_COST_SNAPSHOT_REQUIRED", "Approved MediaCostSnapshot is required before MediaJob can run.", "Approve the media job cost snapshot first.");
  }
  return snapshot;
}

function requireJobApprovedCostSnapshot(store, workspaceId, job) {
  const snapshot = store.mediaCostSnapshots.find(
    (candidate) =>
      candidate.media_cost_snapshot_id === job.media_cost_snapshot_id &&
      candidate.workspace_id === workspaceId &&
      candidate.cost_check_result === "approved"
  );
  if (!snapshot) {
    throw new AppError(409, "MEDIA_COST_SNAPSHOT_REQUIRED", "MediaJob cannot run or succeed without an approved MediaCostSnapshot.", "Approve the cost snapshot before updating the job status.");
  }
  return snapshot;
}

function enforceCostPolicy(store, workspaceId) {
  const policy = store.mediaCostPolicies.find(
    (candidate) => candidate.workspace_id === workspaceId && candidate.policy_status === "active"
  );
  if (!policy) {
    throw new AppError(409, "COST_POLICY_MISSING", "Active MediaCostPolicy is required before MediaJob creation.", "Configure the workspace media cost policy.");
  }
}

function enforceCostGuardrails(store, workspaceId, snapshot) {
  const blockingGuardrail = store.costGuardrails.find(
    (candidate) =>
      candidate.workspace_id === workspaceId &&
      candidate.guardrail_status === "active" &&
      candidate.action === "block" &&
      candidate.currency === snapshot.currency &&
      candidate.threshold_amount < snapshot.estimated_amount
  );
  if (blockingGuardrail) {
    throw new AppError(409, "COST_GUARDRAIL_BLOCKED", "Cost guardrail blocks this MediaJob.", "Adjust the job cost or guardrail before retrying.");
  }
}

function validateUsageSource(store, workspaceId, sourceType, sourceId) {
  if (sourceType === "MediaJob") {
    const job = findMediaJob(store, workspaceId, sourceId);
    if (job.job_status !== "succeeded") {
      throw new AppError(422, "USAGE_OUTPUT_NOT_CONFIRMED", "Failed or unfinished MediaJob cannot record commercial usage.", "Record usage only for succeeded jobs with usable output.");
    }
    return;
  }
  if (sourceType === "MediaAsset") {
    findMediaAsset(store, workspaceId, sourceId);
    return;
  }
  if (sourceType === "MediaAssetVersion") {
    const version = store.mediaAssetVersions.find(
      (candidate) => candidate.media_asset_version_id === sourceId && candidate.workspace_id === workspaceId
    );
    if (!version) {
      throw new AppError(404, "SOURCE_ENTITY_NOT_FOUND", "Usage source entity was not found in this workspace.", "Use a workspace-scoped usage source.");
    }
    return;
  }
  throw new AppError(404, "SOURCE_ENTITY_NOT_FOUND", "Usage source entity type is not supported in Sprint 2.", "Use a MediaJob, MediaAsset, or MediaAssetVersion source.");
}

function validateCostSource(store, workspaceId, sourceType, sourceId) {
  if (sourceType === "MediaJob") {
    findMediaJob(store, workspaceId, sourceId);
    return;
  }
  if (sourceType === "MediaAsset") {
    findMediaAsset(store, workspaceId, sourceId);
    return;
  }
  if (sourceType === "MediaAssetVersion") {
    const version = store.mediaAssetVersions.find(
      (candidate) => candidate.media_asset_version_id === sourceId && candidate.workspace_id === workspaceId
    );
    if (!version) {
      throw new AppError(404, "SOURCE_ENTITY_NOT_FOUND", "Cost source entity was not found in this workspace.", "Use a workspace-scoped cost source.");
    }
    return;
  }
  throw new AppError(404, "SOURCE_ENTITY_NOT_FOUND", "Cost source entity type is not supported in Sprint 2.", "Use a MediaJob, MediaAsset, or MediaAssetVersion source.");
}

function requireIdempotencyKey(req) {
  const key = getHeader(req, "idempotency-key");
  if (!key) {
    throw new AppError(400, "IDEMPOTENCY_KEY_REQUIRED", "Idempotency-Key header is required.", "Retry with a stable Idempotency-Key header.");
  }
  return key;
}

function getHeader(req, name) {
  const lower = name.toLowerCase();
  const entry = Object.entries(req.headers).find(([key]) => key.toLowerCase() === lower);
  return entry ? entry[1] : undefined;
}

function withIdempotency(store, workspaceId, operation, idempotencyKey, body, createResult) {
  const payloadHash = hashContent(body);
  const existing = store.idempotencyRecords.find(
    (candidate) =>
      candidate.workspace_id === workspaceId &&
      candidate.operation === operation &&
      candidate.idempotency_key === idempotencyKey
  );

  if (existing) {
    if (existing.payload_hash !== payloadHash) {
      throw new AppError(409, "IDEMPOTENCY_CONFLICT", "Idempotency-Key was already used with a different payload.", "Use the original payload or a new Idempotency-Key.");
    }
    return { status: existing.status, body: clone(existing.body) };
  }

  const result = createResult();
  store.idempotencyRecords.push({
    idempotency_record_id: nextId("idempotency", store.idempotencyRecords),
    workspace_id: workspaceId,
    operation,
    idempotency_key: idempotencyKey,
    payload_hash: payloadHash,
    status: result.status || 200,
    body: clone(result.body)
  });
  return result;
}

function hashContent(value) {
  return createHash("sha256").update(stableStringify(value)).digest("hex");
}

function stableStringify(value) {
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(",")}]`;
  }
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function nextId(prefix, collection) {
  return `${prefix}-${collection.length + 1}`;
}

function now() {
  return new Date().toISOString();
}

function rejectAnyBodyWorkspaceId(body) {
  if (body && Object.hasOwn(body, "workspace_id")) {
    throw new AppError(422, "TENANT_CONTEXT_MISMATCH", "workspace_id is not accepted in the request body.", "Remove workspace_id from the body.");
  }
}

function rejectImmutable(body, fields) {
  const field = fields.find((candidate) => Object.hasOwn(body, candidate));
  if (field) {
    throw new AppError(422, "IMMUTABLE_FIELD_UPDATE", `${field} cannot be updated.`, "Remove immutable fields from the request.");
  }
}

function requireFields(body, fields) {
  const missing = fields.filter((field) => body[field] === undefined || body[field] === null || body[field] === "");
  if (missing.length > 0) {
    throw new AppError(422, "VALIDATION_FAILED", `Missing required field(s): ${missing.join(", ")}.`, "Provide all required fields.");
  }
}

function requireOneOf(value, allowed, code, message) {
  if (!allowed.includes(value)) {
    throw new AppError(422, code, message, "Use an approved value from the OpenAPI contract.");
  }
}

function requireNonNegative(value, code, message) {
  if (Number(value) < 0) {
    throw new AppError(422, code, message, "Send a non-negative amount.");
  }
}

function requireUserPermission(user, store, permission) {
  const memberships = store.memberships.filter((candidate) => candidate.user_id === user.user_id && candidate.member_status === "active");
  if (!memberships.some((candidate) => require("./rbac").hasPermission(candidate.role_code, permission))) {
    throw new AppError(403, "PERMISSION_DENIED", "User does not have the required permission.", "Ask a workspace admin for the right role.");
  }
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("error", reject);
    req.on("end", () => {
      const text = Buffer.concat(chunks).toString("utf8");
      if (!text) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(text));
      } catch {
        reject(new AppError(422, "VALIDATION_FAILED", "Request body must be valid JSON.", "Send a valid JSON body."));
      }
    });
  });
}

module.exports = {
  createApp,
  implementedRoutes
};
