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
// user-viewer-a  → workspace-a, viewer      (has nashir.campaign.read, lacks nashir.campaign.write)
// user-outsider  → no memberships in any workspace
const OWNER_A = "user-owner-a";
const BILLING_A = "user-billing-a";
const VIEWER_A = "user-viewer-a";
const OUTSIDER = "user-outsider";
const INVALID_USER = "user-missing";

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

test("GET nashir-campaigns returns 401 for unauthenticated callers without workspace disclosure", async () => {
  const server = await createTestServer();
  const existingWorkspace = await server.request("GET", `/workspaces/${WORKSPACE_A}/nashir-campaigns`);
  const unknownWorkspace = await server.request("GET", "/workspaces/workspace-missing/nashir-campaigns");

  assert.strictEqual(existingWorkspace.status, 401);
  assert.strictEqual(unknownWorkspace.status, 401);
});

test("GET nashir-campaigns returns 401 for invalid users without workspace disclosure", async () => {
  const server = await createTestServer();
  const existingWorkspace = await server.request("GET", `/workspaces/${WORKSPACE_A}/nashir-campaigns`, { userId: INVALID_USER });
  const unknownWorkspace = await server.request("GET", "/workspaces/workspace-missing/nashir-campaigns", { userId: INVALID_USER });

  assert.strictEqual(existingWorkspace.status, 401);
  assert.strictEqual(unknownWorkspace.status, 401);
});

test("GET nashir-campaigns returns 404 for user with no workspace membership", async () => {
  const server = await createTestServer();
  const res = await server.request("GET", `/workspaces/${WORKSPACE_A}/nashir-campaigns`, { userId: OUTSIDER });
  assert.strictEqual(res.status, 404);
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

test("GET nashir-campaigns/{nashirCampaignId} returns 404 for unknown workspace", async () => {
  const server = await createTestServer();
  const res = await server.request("GET", `/workspaces/workspace-missing/nashir-campaigns/${CAMPAIGN_A_ID}`, { userId: OWNER_A });
  assert.strictEqual(res.status, 404);
});

// ─── 404 — cross-workspace nashirCampaignId ───────────────────────────────────

test("GET nashir-campaigns/{nashirCampaignId} returns 404 for cross-workspace campaign ID", async () => {
  const server = await createTestServer();
  const res = await server.request("GET", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_B_ID}`, { userId: OWNER_A });
  assert.strictEqual(res.status, 404);
});

// ─── 404 — no workspace membership ───────────────────────────────────────────

test("GET nashir-campaigns/{nashirCampaignId} returns 404 for user with no workspace membership", async () => {
  const server = await createTestServer();
  const res = await server.request("GET", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}`, { userId: OUTSIDER });
  assert.strictEqual(res.status, 404);
});

// ─── 403 — lacking nashir.campaign.read ──────────────────────────────────────

test("GET nashir-campaigns/{nashirCampaignId} returns 403 for user lacking nashir.campaign.read", async () => {
  const server = await createTestServer();
  const res = await server.request("GET", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}`, { userId: BILLING_A });
  assert.strictEqual(res.status, 403);
});

test("GET nashir-campaigns/{nashirCampaignId} returns 401 for unauthenticated callers without workspace disclosure", async () => {
  const server = await createTestServer();
  const existingWorkspace = await server.request("GET", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}`);
  const unknownWorkspace = await server.request("GET", `/workspaces/workspace-missing/nashir-campaigns/${CAMPAIGN_A_ID}`);

  assert.strictEqual(existingWorkspace.status, 401);
  assert.strictEqual(unknownWorkspace.status, 401);
});

test("GET nashir-campaigns/{nashirCampaignId} returns 401 for invalid users without workspace disclosure", async () => {
  const server = await createTestServer();
  const existingWorkspace = await server.request("GET", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}`, { userId: INVALID_USER });
  const unknownWorkspace = await server.request("GET", `/workspaces/workspace-missing/nashir-campaigns/${CAMPAIGN_A_ID}`, { userId: INVALID_USER });

  assert.strictEqual(existingWorkspace.status, 401);
  assert.strictEqual(unknownWorkspace.status, 401);
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

// ─── Readiness route — read-only advisory response ──────────────────────────

test("GET nashir-campaigns/{nashirCampaignId}/readiness returns 200 for authorized member", async () => {
  const server = await createTestServer();
  const res = await server.request("GET", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}/readiness`, { userId: OWNER_A });

  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.data.nashir_campaign_id, CAMPAIGN_A_ID);
  assert.strictEqual(res.body.data.workspace_id, WORKSPACE_A);
});

test("GET nashir readiness response shape is { data: readiness }", async () => {
  const server = await createTestServer();
  const res = await server.request("GET", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}/readiness`, { userId: OWNER_A });

  assert.strictEqual(res.status, 200);
  assert.ok(Object.hasOwn(res.body, "data"), "response must have a top-level data key");
  assert.ok(typeof res.body.data === "object" && res.body.data !== null, "data must be an object");
  assert.ok(!Object.hasOwn(res.body.data, "data"), "response must not be double-wrapped");
});

test("GET nashir readiness includes required fields and allowed advisory values", async () => {
  const server = await createTestServer();
  const res = await server.request("GET", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}/readiness`, { userId: OWNER_A });
  const readiness = res.body.data;

  assert.strictEqual(res.status, 200);
  for (const field of [
    "nashir_campaign_id",
    "workspace_id",
    "readiness_level",
    "gate_state",
    "blockers",
    "warnings",
    "missing_fields",
    "explanations",
    "evaluated_at"
  ]) {
    assert.ok(Object.hasOwn(readiness, field), `${field} is required`);
  }
  assert.ok(["pass", "soft_pass", "fail", "blocked_until_review"].includes(readiness.readiness_level));
  assert.ok(["advisory_only", "blocked_until_review", "ready_for_human_review"].includes(readiness.gate_state));
  assert.strictEqual(readiness.readiness_level, "pass");
  assert.strictEqual(readiness.gate_state, "advisory_only");
  assert.ok(Date.parse(readiness.evaluated_at), "evaluated_at must be a date-time string");
});

test("GET nashir readiness structured detail fields are arrays", async () => {
  const server = await createTestServer();
  const res = await server.request("GET", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}/readiness`, { userId: OWNER_A });
  const readiness = res.body.data;

  assert.strictEqual(res.status, 200);
  assert.deepStrictEqual(readiness.blockers, []);
  assert.deepStrictEqual(readiness.warnings, []);
  assert.deepStrictEqual(readiness.missing_fields, []);
  assert.ok(Array.isArray(readiness.explanations));
  assert.deepStrictEqual(readiness.explanations, [
    {
      code: "NASHIR_READINESS_ADVISORY_ONLY",
      message: "Readiness is advisory and does not approve content or authorize publishing.",
      related_fields: []
    }
  ]);
});

test("GET nashir readiness is read-only and does not mutate campaign", async () => {
  const server = await createTestServer();
  const before = JSON.stringify(server.store.nashirCampaigns);

  const res = await server.request("GET", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}/readiness`, { userId: OWNER_A });

  assert.strictEqual(res.status, 200);
  assert.strictEqual(JSON.stringify(server.store.nashirCampaigns), before);
});

test("GET nashir readiness does not emit an audit event", async () => {
  const server = await createTestServer();
  const auditCount = server.store.auditLogs.length;

  const res = await server.request("GET", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}/readiness`, { userId: OWNER_A });

  assert.strictEqual(res.status, 200);
  assert.strictEqual(server.store.auditLogs.length, auditCount);
});

test("GET nashir readiness returns 404 for user with no workspace membership", async () => {
  const server = await createTestServer();
  const res = await server.request("GET", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}/readiness`, { userId: OUTSIDER });

  assert.strictEqual(res.status, 404);
});

test("GET nashir readiness returns 404 for unknown workspace", async () => {
  const server = await createTestServer();
  const res = await server.request("GET", `/workspaces/workspace-missing/nashir-campaigns/${CAMPAIGN_A_ID}/readiness`, { userId: OWNER_A });

  assert.strictEqual(res.status, 404);
});

test("GET nashir readiness returns 404 for unknown campaign", async () => {
  const server = await createTestServer();
  const res = await server.request("GET", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${UNKNOWN_ID}/readiness`, { userId: OWNER_A });

  assert.strictEqual(res.status, 404);
});

test("GET nashir readiness returns 404 for cross-workspace campaign", async () => {
  const server = await createTestServer();
  const res = await server.request("GET", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_B_ID}/readiness`, { userId: OWNER_A });

  assert.strictEqual(res.status, 404);
});

test("GET nashir readiness returns 403 for member lacking nashir.campaign.read", async () => {
  const server = await createTestServer();
  const res = await server.request("GET", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}/readiness`, { userId: BILLING_A });

  assert.strictEqual(res.status, 403);
});


test("GET nashir readiness returns 401 for unauthenticated callers without workspace disclosure", async () => {
  const server = await createTestServer();

  const existingWorkspace = await server.request("GET", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}/readiness`);
  const unknownWorkspace = await server.request("GET", `/workspaces/workspace-missing/nashir-campaigns/${CAMPAIGN_A_ID}/readiness`);

  assert.strictEqual(existingWorkspace.status, 401);
  assert.strictEqual(unknownWorkspace.status, 401);
});

test("GET nashir readiness returns 401 for invalid users without workspace disclosure", async () => {
  const server = await createTestServer();

  const existingWorkspace = await server.request("GET", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}/readiness`, { userId: INVALID_USER });
  const unknownWorkspace = await server.request("GET", `/workspaces/workspace-missing/nashir-campaigns/${CAMPAIGN_A_ID}/readiness`, { userId: INVALID_USER });

  assert.strictEqual(existingWorkspace.status, 401);
  assert.strictEqual(unknownWorkspace.status, 401);
});

test("GET nashir-campaigns/readiness without campaign id remains non-disclosing 404", async () => {
  const server = await createTestServer();
  const res = await server.request("GET", `/workspaces/${WORKSPACE_A}/nashir-campaigns/readiness`, { userId: OWNER_A });

  assert.strictEqual(res.status, 404);
});

test("GET nashir readiness derives route IDs from path and ignores body overrides", async () => {
  const server = await createTestServer();
  const res = await server.request("GET", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}/readiness`, {
    userId: OWNER_A,
    body: {
      workspace_id: WORKSPACE_B,
      nashir_campaign_id: UNKNOWN_ID
    }
  });

  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.data.workspace_id, WORKSPACE_A);
  assert.strictEqual(res.body.data.nashir_campaign_id, CAMPAIGN_A_ID);
});

// ─── Evidence list route — read-only empty collection ──────────────────────

test("GET nashir evidence list returns 200 with { data: [] } for authorized member", async () => {
  const server = await createTestServer();
  const res = await server.request("GET", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}/evidence`, { userId: OWNER_A });

  assert.strictEqual(res.status, 200);
  assert.deepStrictEqual(res.body, { data: [] });
});

test("GET nashir evidence list does not emit an audit event", async () => {
  const server = await createTestServer();
  const auditCount = server.store.auditLogs.length;

  const res = await server.request("GET", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}/evidence`, { userId: OWNER_A });

  assert.strictEqual(res.status, 200);
  assert.strictEqual(server.store.auditLogs.length, auditCount);
});

test("GET nashir evidence list is read-only and does not mutate campaign store", async () => {
  const server = await createTestServer();
  const before = JSON.stringify(server.store.nashirCampaigns);

  const res = await server.request("GET", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}/evidence`, { userId: OWNER_A });

  assert.strictEqual(res.status, 200);
  assert.strictEqual(JSON.stringify(server.store.nashirCampaigns), before);
  assert.strictEqual(Object.hasOwn(server.store, "nashirEvidence"), false);
});

test("GET nashir evidence list returns 404 for user with no workspace membership", async () => {
  const server = await createTestServer();
  const res = await server.request("GET", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}/evidence`, { userId: OUTSIDER });

  assert.strictEqual(res.status, 404);
});

test("GET nashir evidence list returns 404 for unknown workspace", async () => {
  const server = await createTestServer();
  const res = await server.request("GET", `/workspaces/workspace-missing/nashir-campaigns/${CAMPAIGN_A_ID}/evidence`, { userId: OWNER_A });

  assert.strictEqual(res.status, 404);
});

test("GET nashir evidence list returns 404 for unknown campaign", async () => {
  const server = await createTestServer();
  const res = await server.request("GET", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${UNKNOWN_ID}/evidence`, { userId: OWNER_A });

  assert.strictEqual(res.status, 404);
});

test("GET nashir evidence list returns 404 for cross-workspace campaign", async () => {
  const server = await createTestServer();
  const res = await server.request("GET", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_B_ID}/evidence`, { userId: OWNER_A });

  assert.strictEqual(res.status, 404);
});

test("GET nashir evidence list returns 403 for member lacking nashir.campaign.read", async () => {
  const server = await createTestServer();
  const res = await server.request("GET", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}/evidence`, { userId: BILLING_A });

  assert.strictEqual(res.status, 403);
});

test("GET nashir evidence list derives route IDs from path and ignores body overrides", async () => {
  const server = await createTestServer();
  const res = await server.request("GET", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}/evidence`, {
    userId: OWNER_A,
    body: {
      workspace_id: WORKSPACE_B,
      nashir_campaign_id: UNKNOWN_ID
    }
  });

  assert.strictEqual(res.status, 200);
  assert.deepStrictEqual(res.body, { data: [] });
});

test("POST nashir evidence remains unregistered", async () => {
  const server = await createTestServer();
  const res = await server.request("POST", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}/evidence`, {
    userId: OWNER_A,
    body: {
      evidence_type: "url",
      evidence_url: "https://example.com/evidence"
    }
  });

  assert.strictEqual(res.status, 404);
});

// ─── Create route — in-memory only ──────────────────────────────────────────

test("POST nashir-campaigns creates a draft campaign for authorized active member", async () => {
  const server = await createTestServer();
  const res = await server.request("POST", `/workspaces/${WORKSPACE_A}/nashir-campaigns`, {
    userId: OWNER_A,
    body: { campaign_name: "New Campaign" }
  });

  assert.strictEqual(res.status, 201);
  assert.ok(res.body.data, "response must contain data");
  assert.strictEqual(res.body.data.workspace_id, WORKSPACE_A);
  assert.strictEqual(res.body.data.campaign_name, "New Campaign");
  assert.strictEqual(res.body.data.campaign_status, "draft");
  assert.strictEqual(res.body.data.created_by_user_id, OWNER_A);
  assert.ok(res.body.data.nashir_campaign_id, "created campaign must have an ID");
  assert.ok(res.body.data.created_at, "created_at is required");
  assert.strictEqual(res.body.data.updated_at, res.body.data.created_at);
  assert.ok(
    server.store.nashirCampaigns.some((campaign) => campaign.nashir_campaign_id === res.body.data.nashir_campaign_id),
    "created campaign must be stored in memory"
  );
});

test("POST nashir-campaigns response shape is { data: campaign }", async () => {
  const server = await createTestServer();
  const res = await server.request("POST", `/workspaces/${WORKSPACE_A}/nashir-campaigns`, {
    userId: OWNER_A,
    body: { campaign_name: "Shape Check" }
  });

  assert.strictEqual(res.status, 201);
  assert.ok(Object.hasOwn(res.body, "data"), "response must have a top-level data key");
  assert.ok(typeof res.body.data === "object" && res.body.data !== null, "data must be an object");
  assert.ok(!Object.hasOwn(res.body.data, "data"), "response must not be double-wrapped");
});

test("POST nashir-campaigns uses route workspaceId only", async () => {
  const server = await createTestServer();
  const res = await server.request("POST", `/workspaces/${WORKSPACE_A}/nashir-campaigns`, {
    userId: OWNER_A,
    body: { campaign_name: "Route Workspace" }
  });

  assert.strictEqual(res.status, 201);
  assert.strictEqual(res.body.data.workspace_id, WORKSPACE_A);
  assert.notStrictEqual(res.body.data.workspace_id, WORKSPACE_B);
});

test("POST nashir-campaigns rejects body workspace_id override", async () => {
  const server = await createTestServer();
  const before = server.store.nashirCampaigns.length;
  const res = await server.request("POST", `/workspaces/${WORKSPACE_A}/nashir-campaigns`, {
    userId: OWNER_A,
    body: { workspace_id: WORKSPACE_B, campaign_name: "Wrong Workspace" }
  });

  assert.strictEqual(res.status, 422);
  assert.strictEqual(server.store.nashirCampaigns.length, before);
});

test("POST nashir-campaigns generated nashir_campaign_id does not collide", async () => {
  const server = await createTestServer();
  server.store.nashirCampaigns[0].nashir_campaign_id = "nashir-campaign-3";
  const res = await server.request("POST", `/workspaces/${WORKSPACE_A}/nashir-campaigns`, {
    userId: OWNER_A,
    body: { campaign_name: "Collision Safe" }
  });

  assert.strictEqual(res.status, 201);
  assert.strictEqual(res.body.data.nashir_campaign_id, "nashir-campaign-4");
  assert.strictEqual(
    server.store.nashirCampaigns.filter((campaign) => campaign.nashir_campaign_id === res.body.data.nashir_campaign_id).length,
    1
  );
});

test("POST nashir-campaigns duplicate valid submissions create separate campaign records", async () => {
  const server = await createTestServer();
  const first = await server.request("POST", `/workspaces/${WORKSPACE_A}/nashir-campaigns`, {
    userId: OWNER_A,
    body: { campaign_name: "Duplicate Name" }
  });
  const second = await server.request("POST", `/workspaces/${WORKSPACE_A}/nashir-campaigns`, {
    userId: OWNER_A,
    body: { campaign_name: "Duplicate Name" }
  });

  assert.strictEqual(first.status, 201);
  assert.strictEqual(second.status, 201);
  assert.notStrictEqual(first.body.data.nashir_campaign_id, second.body.data.nashir_campaign_id);
  assert.strictEqual(first.body.data.campaign_name, second.body.data.campaign_name);
});

test("POST nashir-campaigns returns 404 for user with no workspace membership", async () => {
  const server = await createTestServer();
  const res = await server.request("POST", `/workspaces/${WORKSPACE_A}/nashir-campaigns`, {
    userId: OUTSIDER,
    body: { campaign_name: "No Membership" }
  });

  assert.strictEqual(res.status, 404);
});

test("POST nashir-campaigns returns 404 for unknown workspace", async () => {
  const server = await createTestServer();
  const res = await server.request("POST", "/workspaces/workspace-missing/nashir-campaigns", {
    userId: OWNER_A,
    body: { campaign_name: "Unknown Workspace" }
  });

  assert.strictEqual(res.status, 404);
});

test("POST nashir-campaigns returns 403 for member lacking nashir.campaign.write", async () => {
  const server = await createTestServer();
  const res = await server.request("POST", `/workspaces/${WORKSPACE_A}/nashir-campaigns`, {
    userId: VIEWER_A,
    body: { campaign_name: "No Write Permission" }
  });

  assert.strictEqual(res.status, 403);
});

test("POST nashir-campaigns requires campaign_name", async () => {
  const server = await createTestServer();
  const res = await server.request("POST", `/workspaces/${WORKSPACE_A}/nashir-campaigns`, {
    userId: OWNER_A,
    body: {}
  });

  assert.strictEqual(res.status, 422);
});

test("POST nashir-campaigns records the approved create audit event", async () => {
  const server = await createTestServer();
  const res = await server.request("POST", `/workspaces/${WORKSPACE_A}/nashir-campaigns`, {
    userId: OWNER_A,
    body: { campaign_name: "Audited Campaign" }
  });
  const audit = server.store.auditLogs.at(-1);

  assert.strictEqual(res.status, 201);
  assert.strictEqual(audit.action, "nashir_campaign.created");
  assert.strictEqual(audit.entity_type, "NashirCampaign");
  assert.strictEqual(audit.entity_id, res.body.data.nashir_campaign_id);
  assert.strictEqual(audit.before_snapshot, null);
  assert.deepStrictEqual(audit.after_snapshot, res.body.data);
  assert.deepStrictEqual(audit.metadata, { sprint: "nashir-slice-0" });
});

test("POST nashir-campaigns/{nashirCampaignId}, update, and delete routes remain unregistered", async () => {
  const server = await createTestServer();
  const requests = [
    server.request("POST", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}`, {
      userId: OWNER_A,
      body: { campaign_name: "Nested Create" }
    }),
    server.request("PATCH", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}`, {
      userId: OWNER_A,
      body: { campaign_name: "Update" }
    }),
    server.request("DELETE", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}`, { userId: OWNER_A })
  ];

  for (const res of await Promise.all(requests)) {
    assert.strictEqual(res.status, 404);
  }
});

test("approval, scoring mutation, publishing, and evidence submit Nashir routes remain unregistered", async () => {
  const server = await createTestServer();
  const requests = [
    server.request("GET", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}/approval`, { userId: OWNER_A }),
    server.request("GET", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}/score-readiness`, { userId: OWNER_A }),
    server.request("GET", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}/publish`, { userId: OWNER_A }),
    server.request("POST", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}/evidence`, {
      userId: OWNER_A,
      body: { evidence_type: "url", evidence_url: "https://example.com/evidence" }
    })
  ];

  for (const res of await Promise.all(requests)) {
    assert.strictEqual(res.status, 404);
  }
});
