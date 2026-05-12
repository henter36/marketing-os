"use strict";

const assert = require("assert");
const { test } = require("node:test");
const { createTestServer } = require("./helpers");

const WORKSPACE_A = "workspace-a";
const WORKSPACE_B = "workspace-b";
const CAMPAIGN_A_ID = "00000000-0000-4000-8000-000000000a01";
const CAMPAIGN_B_ID = "00000000-0000-4000-8000-000000000b01";
const UNKNOWN_ID = "00000000-0000-4000-8000-000000000000";

// Seed users and roles (from store.js):
// user-owner-a   → workspace-a, owner       (has nashir.campaign.read)
// user-billing-a → workspace-a, billing_admin (no nashir.campaign.read)
// user-outsider  → no memberships in any workspace
const OWNER_A = "user-owner-a";
const BILLING_A = "user-billing-a";
const OUTSIDER = "user-outsider";

// ─── List route — workspace-scoped read-only collection ─────────────────────

test("GET nashir-campaigns returns 200 with { data: [...] } for workspace-a", async () => {
  const server = await createTestServer();
  const res = await server.request("GET", `/workspaces/${WORKSPACE_A}/nashir-campaigns`, { userId: OWNER_A });
  assert.strictEqual(res.status, 200);
  assert.ok(Array.isArray(res.body.data), "data must be an array");
  assert.strictEqual(res.body.data.length, 1);
  assert.strictEqual(res.body.data[0].nashir_campaign_id, CAMPAIGN_A_ID);
  assert.strictEqual(res.body.data[0].workspace_id, WORKSPACE_A);
});

test("GET nashir-campaigns returns only workspace-scoped Nashir campaigns", async () => {
  const server = await createTestServer();
  const res = await server.request("GET", `/workspaces/${WORKSPACE_A}/nashir-campaigns`, { userId: OWNER_A });

  assert.strictEqual(res.status, 200);
  assert.ok(res.body.data.length > 0, "workspace-a must have seed data");
  assert.ok(res.body.data.every((campaign) => campaign.workspace_id === WORKSPACE_A));
  assert.ok(!res.body.data.some((campaign) => campaign.nashir_campaign_id === CAMPAIGN_B_ID));
});

test("GET nashir-campaigns returns [] for an empty existing workspace", async () => {
  const server = await createTestServer();
  server.store.nashirCampaigns = server.store.nashirCampaigns.filter(
    (campaign) => campaign.workspace_id !== WORKSPACE_A
  );

  const res = await server.request("GET", `/workspaces/${WORKSPACE_A}/nashir-campaigns`, { userId: OWNER_A });

  assert.strictEqual(res.status, 200);
  assert.deepStrictEqual(res.body.data, []);
});

test("GET nashir-campaigns returns 404 for unknown workspace", async () => {
  const server = await createTestServer();
  const res = await server.request("GET", "/workspaces/workspace-missing/nashir-campaigns", { userId: OWNER_A });
  assert.strictEqual(res.status, 404);
});

test("GET nashir-campaigns returns 403 for user with no workspace membership", async () => {
  const server = await createTestServer();
  const res = await server.request("GET", `/workspaces/${WORKSPACE_A}/nashir-campaigns`, { userId: OUTSIDER });
  assert.strictEqual(res.status, 403);
});

test("GET nashir-campaigns returns 403 for user lacking nashir.campaign.read", async () => {
  const server = await createTestServer();
  const res = await server.request("GET", `/workspaces/${WORKSPACE_A}/nashir-campaigns`, { userId: BILLING_A });
  assert.strictEqual(res.status, 403);
});

test("GET nashir-campaigns ignores body workspace_id when filtering", async () => {
  const server = await createTestServer();
  const res = await server.request("GET", `/workspaces/${WORKSPACE_A}/nashir-campaigns`, {
    userId: OWNER_A,
    body: { workspace_id: WORKSPACE_B }
  });

  assert.strictEqual(res.status, 200);
  assert.ok(res.body.data.every((campaign) => campaign.workspace_id === WORKSPACE_A));
  assert.ok(!res.body.data.some((campaign) => campaign.workspace_id === WORKSPACE_B));
});

// ─── 200 — valid workspace + nashirCampaignId ─────────────────────────────────

test("GET nashir-campaigns/{nashirCampaignId} returns 200 for valid workspace member", async () => {
  const server = await createTestServer();
  const res = await server.request("GET", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}`, { userId: OWNER_A });
  assert.strictEqual(res.status, 200);
  assert.ok(res.body.data, "response must have a data field");
  assert.strictEqual(res.body.data.nashir_campaign_id, CAMPAIGN_A_ID);
  assert.strictEqual(res.body.data.workspace_id, WORKSPACE_A);
});

// ─── Response shape — { data: <campaign> }, not double-wrapped ────────────────

test("GET nashir-campaigns/{nashirCampaignId} response shape is { data: campaign }", async () => {
  const server = await createTestServer();
  const res = await server.request("GET", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}`, { userId: OWNER_A });
  assert.strictEqual(res.status, 200);
  assert.ok(Object.hasOwn(res.body, "data"), "response must have a top-level 'data' key");
  assert.ok(typeof res.body.data === "object" && res.body.data !== null, "data must be an object");
  assert.ok(!Object.hasOwn(res.body.data, "data"), "response must not be double-wrapped");
});

// ─── 404 — unknown nashirCampaignId ──────────────────────────────────────────

test("GET nashir-campaigns/{nashirCampaignId} returns 404 for unknown campaign ID", async () => {
  const server = await createTestServer();
  const res = await server.request("GET", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${UNKNOWN_ID}`, { userId: OWNER_A });
  assert.strictEqual(res.status, 404);
});

// ─── 404 — cross-workspace nashirCampaignId ───────────────────────────────────

test("GET nashir-campaigns/{nashirCampaignId} returns 404 for cross-workspace campaign ID", async () => {
  const server = await createTestServer();
  const res = await server.request("GET", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_B_ID}`, { userId: OWNER_A });
  assert.strictEqual(res.status, 404);
});

// ─── 403 — no workspace membership ───────────────────────────────────────────

test("GET nashir-campaigns/{nashirCampaignId} returns 403 for user with no workspace membership", async () => {
  const server = await createTestServer();
  const res = await server.request("GET", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}`, { userId: OUTSIDER });
  assert.strictEqual(res.status, 403);
});

// ─── 403 — lacking nashir.campaign.read ──────────────────────────────────────

test("GET nashir-campaigns/{nashirCampaignId} returns 403 for user lacking nashir.campaign.read", async () => {
  const server = await createTestServer();
  const res = await server.request("GET", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}`, { userId: BILLING_A });
  assert.strictEqual(res.status, 403);
});

// ─── nashirCampaignId from path only — body is ignored ───────────────────────

test("GET nashir-campaigns/{nashirCampaignId} derives nashirCampaignId from path — body override ignored", async () => {
  const server = await createTestServer();
  const res = await server.request("GET", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}`, {
    userId: OWNER_A,
    body: { nashir_campaign_id: UNKNOWN_ID }
  });
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.data.nashir_campaign_id, CAMPAIGN_A_ID);
});

// ─── workspaceId from path only — body workspace_id is ignored ───────────────

test("GET nashir-campaigns/{nashirCampaignId} ignores workspace_id in request body", async () => {
  const server = await createTestServer();
  const res = await server.request("GET", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}`, {
    userId: OWNER_A,
    body: { workspace_id: WORKSPACE_B }
  });
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.data.workspace_id, WORKSPACE_A);
});

// ─── No create route registered ──────────────────────────────────────────────

test("POST nashir-campaigns (create route) is not registered — returns 404", async () => {
  const server = await createTestServer();
  const res = await server.request("POST", `/workspaces/${WORKSPACE_A}/nashir-campaigns`, {
    userId: OWNER_A,
    body: { campaign_name: "New Campaign" }
  });
  assert.strictEqual(res.status, 404);
});

test("evidence, approval, scoring, and publishing Nashir routes remain unregistered", async () => {
  const server = await createTestServer();
  const paths = [
    `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}/evidence`,
    `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}/approval`,
    `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}/score-readiness`,
    `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}/publish`
  ];

  for (const path of paths) {
    const res = await server.request("GET", path, { userId: OWNER_A });
    assert.strictEqual(res.status, 404, `${path} must remain unregistered`);
  }
});
