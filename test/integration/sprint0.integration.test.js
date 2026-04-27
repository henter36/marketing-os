const assert = require("node:assert/strict");
const test = require("node:test");
const { createTestServer } = require("../helpers");

test("unauthenticated requests return the unified ErrorModel", async () => {
  const server = await createTestServer();
  try {
    const response = await server.request("GET", "/workspaces");
    assert.equal(response.status, 401);
    assert.equal(response.body.code, "AUTH_REQUIRED");
    assert.equal(typeof response.body.message, "string");
    assert.equal(typeof response.body.user_action, "string");
    assert.equal(typeof response.body.correlation_id, "string");
  } finally {
    server.close();
  }
});

test("workspace list is scoped to authenticated user's memberships", async () => {
  const server = await createTestServer();
  try {
    const response = await server.request("GET", "/workspaces", { userId: "user-creator-a" });
    assert.equal(response.status, 200);
    assert.deepEqual(response.body.data.map((workspace) => workspace.workspace_id), ["workspace-a"]);
  } finally {
    server.close();
  }
});

test("tenant isolation denies cross-workspace campaign reads by entity id", async () => {
  const server = await createTestServer();
  try {
    const response = await server.request("GET", "/workspaces/workspace-a/campaigns/campaign-b", {
      userId: "user-creator-a"
    });
    assert.equal(response.status, 404);
    assert.equal(response.body.code, "NOT_FOUND");
  } finally {
    server.close();
  }
});

test("tenant isolation denies cross-workspace media asset reads by entity id", async () => {
  const server = await createTestServer();
  try {
    const response = await server.request("GET", "/workspaces/workspace-a/assets/asset-b/versions", {
      userId: "user-creator-a"
    });
    assert.equal(response.status, 404);
    assert.equal(response.body.code, "NOT_FOUND");
  } finally {
    server.close();
  }
});

test("body workspace_id mismatch is rejected before any business workflow", async () => {
  const server = await createTestServer();
  try {
    const response = await server.request("POST", "/workspaces/workspace-a/campaigns", {
      userId: "user-creator-a",
      body: {
        workspace_id: "workspace-b",
        campaign_name: "Bad Tenant",
        campaign_objective: "Leak data"
      }
    });
    assert.equal(response.status, 422);
    assert.equal(response.body.code, "TENANT_CONTEXT_MISMATCH");
  } finally {
    server.close();
  }
});

test("viewer cannot execute write endpoints", async () => {
  const server = await createTestServer();
  try {
    const response = await server.request("POST", "/workspaces/workspace-a/campaigns", {
      userId: "user-viewer-a",
      body: {
        campaign_name: "Viewer Write",
        campaign_objective: "Should fail"
      }
    });
    assert.equal(response.status, 403);
    assert.equal(response.body.code, "PERMISSION_DENIED");
  } finally {
    server.close();
  }
});

test("billing admin cannot modify campaign content", async () => {
  const server = await createTestServer();
  try {
    const response = await server.request("PATCH", "/workspaces/workspace-a/campaigns/campaign-a", {
      userId: "user-billing-a",
      body: {
        campaign_name: "Billing Write"
      }
    });
    assert.equal(response.status, 403);
    assert.equal(response.body.code, "PERMISSION_DENIED");
  } finally {
    server.close();
  }
});
