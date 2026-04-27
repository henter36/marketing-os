const assert = require("node:assert/strict");
const test = require("node:test");
const { implementedRoutes } = require("../../src/router");
const { createTestServer } = require("../helpers");

const sprint1Routes = [
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

test("Sprint 1 implemented routes remain inside the current OpenAPI-approved surface", () => {
  for (const route of sprint1Routes) {
    assert.ok(implementedRoutes.includes(route), `${route} should remain implemented`);
  }
});

test("workspace and member management enforce RBAC and audit placeholders", async () => {
  const server = await createTestServer();
  try {
    const denied = await server.request("POST", "/workspaces/workspace-a/members", {
      userId: "user-viewer-a",
      body: { user_id: "user-outsider", role_code: "viewer" }
    });
    assert.equal(denied.status, 403);
    assert.equal(denied.body.code, "PERMISSION_DENIED");

    const created = await server.request("POST", "/workspaces/workspace-a/members", {
      userId: "user-admin-a",
      body: { user_id: "user-outsider", role_code: "viewer" }
    });
    assert.equal(created.status, 201);
    assert.equal(created.body.data.workspace_id, "workspace-a");
    assert.equal(server.store.auditLogs.at(-1).action, "member.invited");

    const immutable = await server.request("PATCH", "/workspaces/workspace-a", {
      userId: "user-admin-a",
      body: { customer_account_id: "customer-b" }
    });
    assert.equal(immutable.status, 422);
    assert.equal(immutable.body.code, "IMMUTABLE_FIELD_UPDATE");
  } finally {
    server.close();
  }
});

test("BrandProfile and BrandVoiceRule access is tenant scoped", async () => {
  const server = await createTestServer();
  try {
    const created = await server.request("POST", "/workspaces/workspace-a/brand-profiles", {
      userId: "user-creator-a",
      body: { brand_name: "Sprint One Brand", brand_description: "Scoped brand" }
    });
    assert.equal(created.status, 201);
    assert.equal(created.body.data.workspace_id, "workspace-a");

    const duplicate = await server.request("POST", "/workspaces/workspace-a/brand-profiles", {
      userId: "user-creator-a",
      body: { brand_name: "Sprint One Brand" }
    });
    assert.equal(duplicate.status, 409);
    assert.equal(duplicate.body.code, "DUPLICATE_BRAND_PROFILE");

    const crossTenantRule = await server.request("POST", "/workspaces/workspace-a/brand-profiles/brand-profile-b/rules", {
      userId: "user-creator-a",
      body: { rule_type: "tone", rule_text: "No cross tenant writes", severity: "blocker" }
    });
    assert.equal(crossTenantRule.status, 404);
    assert.equal(crossTenantRule.body.code, "BRAND_PROFILE_NOT_FOUND");

    const rule = await server.request("POST", `/workspaces/workspace-a/brand-profiles/${created.body.data.brand_profile_id}/rules`, {
      userId: "user-creator-a",
      body: { rule_type: "tone", rule_text: "Be precise", severity: "warning" }
    });
    assert.equal(rule.status, 201);
    assert.equal(rule.body.data.workspace_id, "workspace-a");
  } finally {
    server.close();
  }
});

test("PromptTemplate and ReportTemplate endpoints enforce permissions", async () => {
  const server = await createTestServer();
  try {
    const prompt = await server.request("POST", "/workspaces/workspace-a/prompt-templates", {
      userId: "user-creator-a",
      body: {
        template_name: "Sprint Caption",
        template_type: "caption",
        template_body: "Write {{topic}}",
        variables: ["topic"],
        version_number: 1
      }
    });
    assert.equal(prompt.status, 201);

    const duplicate = await server.request("POST", "/workspaces/workspace-a/prompt-templates", {
      userId: "user-creator-a",
      body: {
        template_name: "Sprint Caption",
        template_type: "caption",
        template_body: "Write {{topic}}",
        version_number: 1
      }
    });
    assert.equal(duplicate.status, 409);
    assert.equal(duplicate.body.code, "DUPLICATE_TEMPLATE_VERSION");

    const viewerDenied = await server.request("POST", "/workspaces/workspace-a/report-templates", {
      userId: "user-viewer-a",
      body: { template_name: "Viewer Report", report_type: "monthly", template_body: { sections: [] } }
    });
    assert.equal(viewerDenied.status, 403);

    const report = await server.request("POST", "/workspaces/workspace-a/report-templates", {
      userId: "user-admin-a",
      body: { template_name: "Sprint Report", report_type: "monthly", template_body: { sections: ["summary"] } }
    });
    assert.equal(report.status, 201);
  } finally {
    server.close();
  }
});

test("Campaign create/list/get/update and tenant isolation work", async () => {
  const server = await createTestServer();
  try {
    const denied = await server.request("POST", "/workspaces/workspace-a/campaigns", {
      userId: "user-viewer-a",
      body: { campaign_name: "Denied", campaign_objective: "Should fail" }
    });
    assert.equal(denied.status, 403);

    const mismatch = await server.request("POST", "/workspaces/workspace-a/campaigns", {
      userId: "user-creator-a",
      body: { workspace_id: "workspace-b", campaign_name: "Bad", campaign_objective: "Bad" }
    });
    assert.equal(mismatch.status, 422);
    assert.equal(mismatch.body.code, "TENANT_CONTEXT_MISMATCH");

    const created = await server.request("POST", "/workspaces/workspace-a/campaigns", {
      userId: "user-creator-a",
      body: { campaign_name: "Sprint Campaign", campaign_objective: "Plan launch" }
    });
    assert.equal(created.status, 201);
    assert.equal(created.body.data.campaign_status, "draft");

    const list = await server.request("GET", "/workspaces/workspace-a/campaigns", { userId: "user-creator-a" });
    assert.ok(list.body.data.some((campaign) => campaign.campaign_id === created.body.data.campaign_id));

    const updated = await server.request("PATCH", `/workspaces/workspace-a/campaigns/${created.body.data.campaign_id}`, {
      userId: "user-creator-a",
      body: { campaign_name: "Sprint Campaign Updated" }
    });
    assert.equal(updated.status, 200);
    assert.equal(updated.body.data.campaign_name, "Sprint Campaign Updated");

    const crossTenant = await server.request("GET", "/workspaces/workspace-a/campaigns/campaign-b", {
      userId: "user-creator-a"
    });
    assert.equal(crossTenant.status, 404);
  } finally {
    server.close();
  }
});

test("CampaignStateTransition creation updates campaign state and records audit", async () => {
  const server = await createTestServer();
  try {
    const transition = await server.request("POST", "/workspaces/workspace-a/campaigns/campaign-a/state-transitions", {
      userId: "user-creator-a",
      body: { to_status: "active", reason: "Launch" }
    });
    assert.equal(transition.status, 201);
    assert.equal(transition.body.data.from_status, "draft");
    assert.equal(transition.body.data.to_status, "active");
    assert.equal(server.store.campaigns.find((campaign) => campaign.campaign_id === "campaign-a").campaign_status, "active");
    assert.equal(server.store.auditLogs.at(-1).action, "campaign.status_changed");
  } finally {
    server.close();
  }
});

test("BriefVersion create/list generates hash and rejects client content_hash", async () => {
  const server = await createTestServer();
  try {
    const brief = await server.request("POST", "/workspaces/workspace-a/campaigns/campaign-a/brief-versions", {
      userId: "user-creator-a",
      body: { brief_title: "Brief V2", brief_content: { goal: "Grow" }, version_number: 2 }
    });
    assert.equal(brief.status, 201);
    assert.equal(brief.body.data.content_hash.length, 64);
    assert.notEqual(brief.body.data.content_hash, "b".repeat(64));

    const duplicate = await server.request("POST", "/workspaces/workspace-a/campaigns/campaign-a/brief-versions", {
      userId: "user-creator-a",
      body: { brief_title: "Duplicate", brief_content: { goal: "Grow" }, version_number: 2 }
    });
    assert.equal(duplicate.status, 409);

    const clientHash = await server.request("POST", "/workspaces/workspace-a/campaigns/campaign-a/brief-versions", {
      userId: "user-creator-a",
      body: { brief_title: "Bad Hash", brief_content: { goal: "Grow" }, version_number: 3, content_hash: "b".repeat(64) }
    });
    assert.equal(clientHash.status, 422);

    const patch = await server.request("PATCH", "/workspaces/workspace-a/campaigns/campaign-a/brief-versions/brief-version-a", {
      userId: "user-creator-a",
      body: { brief_content: { goal: "Mutate" } }
    });
    assert.equal(patch.status, 404);
  } finally {
    server.close();
  }
});

test("Sprint 1 validation errors keep the unified ErrorModel", async () => {
  const server = await createTestServer();
  try {
    const response = await server.request("POST", "/workspaces/workspace-a/campaigns", {
      userId: "user-creator-a",
      body: { campaign_name: "Missing objective" }
    });
    assert.equal(response.status, 422);
    assert.equal(typeof response.body.code, "string");
    assert.equal(typeof response.body.message, "string");
    assert.equal(typeof response.body.user_action, "string");
    assert.equal(typeof response.body.correlation_id, "string");
  } finally {
    server.close();
  }
});
