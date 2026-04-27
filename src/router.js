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
  "POST /workspaces/{workspaceId}/campaigns/{campaignId}/brief-versions"
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
      const workspace = store.workspaces.find((candidate) => candidate.workspace_id === workspaceId);
      if (!workspace) {
        throw new AppError(404, "NOT_FOUND", "Workspace was not found.", "Check the workspace ID.");
      }
      return { body: { data: workspace } };
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

    const assetVersionsRead = child.match(/^assets\/([^/]+)\/versions$/);
    if (req.method === "GET" && assetVersionsRead) {
      permissionGuard(membership, "media_asset.read");
      const asset = store.mediaAssets.find(
        (candidate) => candidate.media_asset_id === assetVersionsRead[1] && candidate.workspace_id === workspaceId
      );
      if (!asset) {
        throw new AppError(404, "NOT_FOUND", "Media asset was not found in this workspace.", "Check the asset and workspace IDs.");
      }
      return { body: { data: [] } };
    }
  }

  throw new AppError(404, "NOT_FOUND", "Route was not found.", "Use an endpoint from the OpenAPI contract.");
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
    correlation_id: "sprint-1-placeholder",
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

function hashContent(value) {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
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
