"use strict";

const assert = require("assert");
const { Readable } = require("stream");
const { test } = require("node:test");
const { createTestServer } = require("./helpers");
const { createApp } = require("../src/router");
const { createSeedStore } = require("../src/store");

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

async function requestRawJson(method, path, { userId, json } = {}) {
  const store = createSeedStore();
  const app = createApp({ store });
  const req = Readable.from([Buffer.from(json)]);
  req.method = method;
  req.url = `/v1${path}`;
  req.headers = {
    "content-type": "application/json",
    ...(userId ? { "x-user-id": userId } : {})
  };

  return await new Promise((resolve) => {
    const res = {
      statusCode: 200,
      headers: {},
      writeHead(status, headers) {
        this.statusCode = status;
        this.headers = headers;
      },
      end(payload) {
        resolve({
          status: this.statusCode,
          body: payload ? JSON.parse(payload) : null
        });
      }
    };

    app(req, res);
  });
}

function createNashirEvidenceRepositoryDouble(records = []) {
  const repository = {
    records: records.map((record) => ({ ...record })),
    calls: {
      createSubmittedEvidence: [],
      getById: [],
      listByCampaign: []
    },

    async createSubmittedEvidence(input) {
      this.calls.createSubmittedEvidence.push({ ...input });
      const record = {
        id: `db-evidence-${this.records.length + 1}`,
        workspaceId: input.workspaceId,
        nashirCampaignId: input.nashirCampaignId,
        evidenceType: input.evidenceType,
        channel: input.channel,
        status: "submitted",
        submittedByUserId: input.submittedByUserId,
        submittedAt: input.submittedAt,
        publishedAt: input.publishedAt || null,
        url: input.url || null,
        notes: input.notes || null,
        externalReference: input.externalReference || null
      };
      this.records.push(record);
      return { ...record };
    },

    async listByCampaign(input) {
      this.calls.listByCampaign.push({ ...input });
      return this.records
        .filter((record) => record.workspaceId === input.workspaceId && record.nashirCampaignId === input.nashirCampaignId)
        .map((record) => ({ ...record }));
    },

    async getById(input) {
      this.calls.getById.push({ ...input });
      const record = this.records.find(
        (candidate) =>
          candidate.workspaceId === input.workspaceId &&
          candidate.nashirCampaignId === input.nashirCampaignId &&
          candidate.id === input.evidenceId
      );
      return record ? { ...record } : null;
    }
  };

  return repository;
}

function createNashirDbEvidenceTestServer(records = []) {
  const store = createSeedStore();
  const nashirEvidenceRepository = createNashirEvidenceRepositoryDouble(records);
  const app = createApp({ store, evidenceRepository: nashirEvidenceRepository });

  async function request(method, path, options = {}) {
    const req = Readable.from(options.body ? [Buffer.from(JSON.stringify(options.body))] : []);
    req.method = method;
    req.url = `/v1${path}`;
    req.headers = {
      "content-type": "application/json",
      ...(options.userId ? { "x-user-id": options.userId } : {}),
      ...(options.headers || {})
    };

    return await new Promise((resolve) => {
      const res = {
        statusCode: 200,
        headers: {},
        writeHead(status, headers) {
          this.statusCode = status;
          this.headers = headers;
        },
        end(payload) {
          resolve({
            status: this.statusCode,
            body: payload ? JSON.parse(payload) : null
          });
        }
      };

      app(req, res);
    });
  }

  return { request, store, nashirEvidenceRepository };
}

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

test("GET nashir evidence list returns 200 with { data: [] } before submission", async () => {
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
  assert.deepStrictEqual(server.store.nashirEvidence, []);
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

test("GET nashir evidence list reads from DB-backed evidence repository after campaign guard", async () => {
  const server = createNashirDbEvidenceTestServer([
    {
      id: "db-evidence-a",
      workspaceId: WORKSPACE_A,
      nashirCampaignId: CAMPAIGN_A_ID,
      evidenceType: "external_post_url",
      channel: "linkedin",
      status: "submitted",
      submittedByUserId: OWNER_A,
      submittedAt: "2026-05-13T00:00:00.000Z",
      publishedAt: null,
      url: "https://example.com/db-evidence",
      notes: null,
      externalReference: null
    }
  ]);

  const res = await server.request("GET", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}/evidence`, { userId: OWNER_A });

  assert.strictEqual(res.status, 200);
  assert.deepStrictEqual(server.nashirEvidenceRepository.calls.listByCampaign, [
    { workspaceId: WORKSPACE_A, nashirCampaignId: CAMPAIGN_A_ID }
  ]);
  assert.deepStrictEqual(res.body.data, [
    {
      id: "db-evidence-a",
      workspaceId: WORKSPACE_A,
      nashirCampaignId: CAMPAIGN_A_ID,
      evidenceType: "external_post_url",
      channel: "linkedin",
      status: "submitted",
      submittedAt: "2026-05-13T00:00:00.000Z",
      publishedAt: null,
      url: "https://example.com/db-evidence",
      notes: null,
      externalReference: null,
      submittedBy: OWNER_A
    }
  ]);
});

test("POST nashir evidence creates submitted in-memory evidence for authorized member", async () => {
  const server = await createTestServer();
  const res = await server.request("POST", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}/evidence`, {
    userId: OWNER_A,
    body: {
      evidenceType: "manual_publish_proof",
      channel: "linkedin",
      publishedAt: "2026-05-13T00:00:00.000Z",
      url: "https://example.com/evidence",
      notes: "Published manually",
      externalReference: "post-123"
    }
  });

  assert.strictEqual(res.status, 201);
  assert.ok(res.body.data.id);
  assert.strictEqual(res.body.data.workspaceId, WORKSPACE_A);
  assert.strictEqual(res.body.data.nashirCampaignId, CAMPAIGN_A_ID);
  assert.strictEqual(res.body.data.evidenceType, "manual_publish_proof");
  assert.strictEqual(res.body.data.channel, "linkedin");
  assert.strictEqual(res.body.data.status, "submitted");
  assert.strictEqual(res.body.data.submittedBy, OWNER_A);
  assert.strictEqual(res.body.data.publishedAt, "2026-05-13T00:00:00.000Z");
  assert.strictEqual(res.body.data.url, "https://example.com/evidence");
  assert.strictEqual(res.body.data.notes, "Published manually");
  assert.strictEqual(res.body.data.externalReference, "post-123");
  assert.ok(Date.parse(res.body.data.submittedAt));
  assert.deepStrictEqual(server.store.nashirEvidence, [res.body.data]);
});

test("POST nashir evidence persists through DB-backed evidence repository after campaign guard", async () => {
  const server = createNashirDbEvidenceTestServer();
  const auditCount = server.store.auditLogs.length;
  const res = await server.request("POST", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}/evidence`, {
    userId: OWNER_A,
    body: {
      evidenceType: "manual_publish_proof",
      channel: "linkedin",
      publishedAt: "2026-05-13T00:00:00.000Z",
      url: "https://example.com/evidence",
      notes: "Published manually",
      externalReference: "post-123"
    }
  });

  assert.strictEqual(res.status, 201);
  assert.deepStrictEqual(server.store.nashirEvidence, []);
  assert.strictEqual(server.nashirEvidenceRepository.records.length, 1);
  assert.deepStrictEqual(server.nashirEvidenceRepository.calls.createSubmittedEvidence, [
    {
      workspaceId: WORKSPACE_A,
      nashirCampaignId: CAMPAIGN_A_ID,
      evidenceType: "manual_publish_proof",
      channel: "linkedin",
      submittedAt: res.body.data.submittedAt,
      submittedByUserId: OWNER_A,
      publishedAt: "2026-05-13T00:00:00.000Z",
      url: "https://example.com/evidence",
      notes: "Published manually",
      externalReference: "post-123"
    }
  ]);
  assert.strictEqual(res.body.data.id, "db-evidence-1");
  assert.strictEqual(res.body.data.submittedBy, OWNER_A);
  assert.strictEqual(res.body.data.submittedByUserId, undefined);
  assert.strictEqual(server.store.auditLogs.length, auditCount + 1);
  assert.strictEqual(server.store.auditLogs.at(-1).action, "nashir_evidence.submitted");
  assert.deepStrictEqual(server.store.auditLogs.at(-1).after_snapshot, res.body.data);
});

test("GET nashir evidence list returns submitted in-memory evidence after submit", async () => {
  const server = await createTestServer();
  const submit = await server.request("POST", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}/evidence`, {
    userId: OWNER_A,
    body: {
      evidenceType: "external_post_url",
      channel: "linkedin",
      url: "https://example.com/evidence"
    }
  });
  const list = await server.request("GET", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}/evidence`, { userId: OWNER_A });

  assert.strictEqual(submit.status, 201);
  assert.strictEqual(list.status, 200);
  assert.deepStrictEqual(list.body.data, [submit.body.data]);
});

test("GET nashir evidence by ID returns 200 for existing evidence", async () => {
  const server = await createTestServer();
  const submit = await server.request("POST", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}/evidence`, {
    userId: OWNER_A,
    body: {
      evidenceType: "external_post_url",
      channel: "linkedin",
      url: "https://example.com/evidence"
    }
  });

  const res = await server.request(
    "GET",
    `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}/evidence/${submit.body.data.id}`,
    { userId: OWNER_A }
  );

  assert.strictEqual(submit.status, 201);
  assert.strictEqual(res.status, 200);
  assert.deepStrictEqual(res.body.data, submit.body.data);
});

test("GET nashir evidence by ID reads from DB-backed evidence repository after campaign guard", async () => {
  const server = createNashirDbEvidenceTestServer([
    {
      id: "db-evidence-a",
      workspaceId: WORKSPACE_A,
      nashirCampaignId: CAMPAIGN_A_ID,
      evidenceType: "external_post_url",
      channel: "linkedin",
      status: "submitted",
      submittedByUserId: OWNER_A,
      submittedAt: "2026-05-13T00:00:00.000Z",
      publishedAt: null,
      url: "https://example.com/db-evidence",
      notes: null,
      externalReference: null
    }
  ]);

  const res = await server.request(
    "GET",
    `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}/evidence/db-evidence-a`,
    { userId: OWNER_A }
  );

  assert.strictEqual(res.status, 200);
  assert.deepStrictEqual(server.nashirEvidenceRepository.calls.getById, [
    { workspaceId: WORKSPACE_A, nashirCampaignId: CAMPAIGN_A_ID, evidenceId: "db-evidence-a" }
  ]);
  assert.strictEqual(res.body.data.id, "db-evidence-a");
  assert.strictEqual(res.body.data.submittedBy, OWNER_A);
  assert.strictEqual(res.body.data.submittedByUserId, undefined);
});

test("GET nashir evidence by ID returns 404 for missing evidence", async () => {
  const server = await createTestServer();
  const res = await server.request(
    "GET",
    `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}/evidence/nashir-evidence-missing`,
    { userId: OWNER_A }
  );

  assert.strictEqual(res.status, 404);
});

test("GET nashir evidence by ID returns 404 for missing DB-backed evidence", async () => {
  const server = createNashirDbEvidenceTestServer();
  const res = await server.request(
    "GET",
    `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}/evidence/db-evidence-missing`,
    { userId: OWNER_A }
  );

  assert.strictEqual(res.status, 404);
  assert.deepStrictEqual(server.nashirEvidenceRepository.calls.getById, [
    { workspaceId: WORKSPACE_A, nashirCampaignId: CAMPAIGN_A_ID, evidenceId: "db-evidence-missing" }
  ]);
});

test("GET nashir evidence by ID returns 404 for cross-workspace evidence", async () => {
  const server = await createTestServer();
  const submit = await server.request("POST", `/workspaces/${WORKSPACE_B}/nashir-campaigns/${CAMPAIGN_B_ID}/evidence`, {
    userId: OWNER_A,
    body: {
      evidenceType: "external_post_url",
      channel: "linkedin",
      url: "https://example.com/workspace-b-evidence"
    }
  });

  const res = await server.request(
    "GET",
    `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}/evidence/${submit.body.data.id}`,
    { userId: OWNER_A }
  );

  assert.strictEqual(submit.status, 201);
  assert.strictEqual(res.status, 404);
});

test("GET nashir evidence by ID returns 404 for cross-campaign evidence", async () => {
  const server = await createTestServer();
  const createCampaign = await server.request("POST", `/workspaces/${WORKSPACE_A}/nashir-campaigns`, {
    userId: OWNER_A,
    body: { campaign_name: "Second Campaign" }
  });
  const submit = await server.request(
    "POST",
    `/workspaces/${WORKSPACE_A}/nashir-campaigns/${createCampaign.body.data.nashir_campaign_id}/evidence`,
    {
      userId: OWNER_A,
      body: {
        evidenceType: "external_post_url",
        channel: "linkedin",
        url: "https://example.com/second-campaign-evidence"
      }
    }
  );

  const res = await server.request(
    "GET",
    `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}/evidence/${submit.body.data.id}`,
    { userId: OWNER_A }
  );

  assert.strictEqual(createCampaign.status, 201);
  assert.strictEqual(submit.status, 201);
  assert.strictEqual(res.status, 404);
});

test("GET nashir evidence by ID returns 404 for cross-workspace or cross-campaign DB-backed evidence", async () => {
  const server = createNashirDbEvidenceTestServer([
    {
      id: "db-evidence-workspace-b",
      workspaceId: WORKSPACE_B,
      nashirCampaignId: CAMPAIGN_B_ID,
      evidenceType: "external_post_url",
      channel: "linkedin",
      status: "submitted",
      submittedByUserId: OWNER_A,
      submittedAt: "2026-05-13T00:00:00.000Z"
    },
    {
      id: "db-evidence-campaign-b",
      workspaceId: WORKSPACE_A,
      nashirCampaignId: "nashir-campaign-other",
      evidenceType: "external_post_url",
      channel: "linkedin",
      status: "submitted",
      submittedByUserId: OWNER_A,
      submittedAt: "2026-05-13T00:00:00.000Z"
    }
  ]);

  const crossWorkspace = await server.request(
    "GET",
    `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}/evidence/db-evidence-workspace-b`,
    { userId: OWNER_A }
  );
  const crossCampaign = await server.request(
    "GET",
    `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}/evidence/db-evidence-campaign-b`,
    { userId: OWNER_A }
  );

  assert.strictEqual(crossWorkspace.status, 404);
  assert.strictEqual(crossCampaign.status, 404);
});

test("Nashir evidence DB-backed repository is not called before membership, permission, or campaign guards pass", async () => {
  const server = createNashirDbEvidenceTestServer();

  const unauthenticated = await server.request(
    "GET",
    `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}/evidence/db-evidence-1`
  );
  const invalidUser = await server.request(
    "GET",
    `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}/evidence/db-evidence-1`,
    { userId: INVALID_USER }
  );
  const missingMembership = await server.request(
    "GET",
    `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}/evidence/db-evidence-1`,
    { userId: OUTSIDER }
  );
  const missingReadPermission = await server.request(
    "GET",
    `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}/evidence/db-evidence-1`,
    { userId: BILLING_A }
  );
  const missingCampaignRead = await server.request(
    "GET",
    `/workspaces/${WORKSPACE_A}/nashir-campaigns/${UNKNOWN_ID}/evidence/db-evidence-1`,
    { userId: OWNER_A }
  );
  const missingWritePermission = await server.request("POST", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}/evidence`, {
    userId: VIEWER_A,
    body: {
      evidenceType: "manual_publish_proof",
      channel: "linkedin",
      notes: "Proof note"
    }
  });
  const missingCampaignWrite = await server.request("POST", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${UNKNOWN_ID}/evidence`, {
    userId: OWNER_A,
    body: {
      evidenceType: "manual_publish_proof",
      channel: "linkedin",
      notes: "Proof note"
    }
  });

  assert.strictEqual(unauthenticated.status, 401);
  assert.strictEqual(invalidUser.status, 401);
  assert.strictEqual(missingMembership.status, 404);
  assert.strictEqual(missingReadPermission.status, 403);
  assert.strictEqual(missingCampaignRead.status, 404);
  assert.strictEqual(missingWritePermission.status, 403);
  assert.strictEqual(missingCampaignWrite.status, 404);
  assert.deepStrictEqual(server.nashirEvidenceRepository.calls, {
    createSubmittedEvidence: [],
    getById: [],
    listByCampaign: []
  });
});

test("GET nashir evidence by ID returns 404 for unknown workspace", async () => {
  const server = await createTestServer();
  const res = await server.request(
    "GET",
    `/workspaces/workspace-missing/nashir-campaigns/${CAMPAIGN_A_ID}/evidence/nashir-evidence-1`,
    { userId: OWNER_A }
  );

  assert.strictEqual(res.status, 404);
});

test("GET nashir evidence by ID returns 404 for user with no workspace membership", async () => {
  const server = await createTestServer();
  const res = await server.request(
    "GET",
    `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}/evidence/nashir-evidence-1`,
    { userId: OUTSIDER }
  );

  assert.strictEqual(res.status, 404);
});

test("GET nashir evidence by ID returns 403 for member lacking nashir.campaign.read", async () => {
  const server = await createTestServer();
  const res = await server.request(
    "GET",
    `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}/evidence/nashir-evidence-1`,
    { userId: BILLING_A }
  );

  assert.strictEqual(res.status, 403);
});

test("GET nashir evidence by ID returns 401 for unauthenticated callers", async () => {
  const server = await createTestServer();
  const res = await server.request(
    "GET",
    `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}/evidence/nashir-evidence-1`
  );

  assert.strictEqual(res.status, 401);
});

test("GET nashir evidence by ID returns 401 for invalid users", async () => {
  const server = await createTestServer();
  const res = await server.request(
    "GET",
    `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}/evidence/nashir-evidence-1`,
    { userId: INVALID_USER }
  );

  assert.strictEqual(res.status, 401);
});

test("GET nashir evidence by ID derives route IDs from path and ignores body overrides", async () => {
  const server = await createTestServer();
  const submit = await server.request("POST", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}/evidence`, {
    userId: OWNER_A,
    body: {
      evidenceType: "external_post_url",
      channel: "linkedin",
      url: "https://example.com/evidence"
    }
  });

  const res = await server.request(
    "GET",
    `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}/evidence/${submit.body.data.id}`,
    {
      userId: OWNER_A,
      body: {
        workspace_id: WORKSPACE_B,
        nashir_campaign_id: CAMPAIGN_B_ID,
        evidence_id: "nashir-evidence-missing"
      }
    }
  );

  assert.strictEqual(submit.status, 201);
  assert.strictEqual(res.status, 200);
  assert.deepStrictEqual(res.body.data, submit.body.data);
});

test("POST nashir evidence records the candidate submit audit event", async () => {
  const server = await createTestServer();
  const auditCount = server.store.auditLogs.length;
  const res = await server.request("POST", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}/evidence`, {
    userId: OWNER_A,
    body: {
      evidenceType: "manual_publish_proof",
      channel: "linkedin",
      notes: "Proof note"
    }
  });
  const audit = server.store.auditLogs.at(-1);

  assert.strictEqual(res.status, 201);
  assert.strictEqual(server.store.auditLogs.length, auditCount + 1);
  assert.strictEqual(audit.action, "nashir_evidence.submitted");
  assert.strictEqual(audit.entity_type, "NashirEvidence");
  assert.strictEqual(audit.entity_id, res.body.data.id);
  assert.strictEqual(audit.before_snapshot, null);
  assert.deepStrictEqual(audit.after_snapshot, res.body.data);
});

test("POST nashir evidence rejects missing evidenceType", async () => {
  const server = await createTestServer();
  const res = await server.request("POST", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}/evidence`, {
    userId: OWNER_A,
    body: {
      channel: "linkedin",
      url: "https://example.com/evidence"
    }
  });

  assert.strictEqual(res.status, 422);
});

test("POST nashir evidence rejects missing channel", async () => {
  const server = await createTestServer();
  const res = await server.request("POST", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}/evidence`, {
    userId: OWNER_A,
    body: {
      evidenceType: "manual_publish_proof",
      url: "https://example.com/evidence"
    }
  });

  assert.strictEqual(res.status, 422);
});

test("POST nashir evidence rejects missing proof locator", async () => {
  const server = await createTestServer();
  const res = await server.request("POST", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}/evidence`, {
    userId: OWNER_A,
    body: {
      evidenceType: "manual_publish_proof",
      channel: "linkedin"
    }
  });

  assert.strictEqual(res.status, 422);
});

test("POST nashir evidence rejects null body without server error", async () => {
  const res = await requestRawJson("POST", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}/evidence`, {
    userId: OWNER_A,
    json: "null"
  });

  assert.strictEqual(res.status, 422);
  assert.strictEqual(res.body.code, "VALIDATION_FAILED");
  assert.strictEqual(res.body.message, "Request body must be a JSON object.");
});

test("POST nashir evidence rejects array body without server error", async () => {
  const res = await requestRawJson("POST", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}/evidence`, {
    userId: OWNER_A,
    json: "[]"
  });

  assert.strictEqual(res.status, 422);
  assert.strictEqual(res.body.code, "VALIDATION_FAILED");
  assert.strictEqual(res.body.user_action, "Send a valid JSON object body.");
});

test("POST nashir evidence derives route IDs from path and rejects body overrides", async () => {
  const server = await createTestServer();
  const res = await server.request("POST", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}/evidence`, {
    userId: OWNER_A,
    body: {
      workspaceId: WORKSPACE_B,
      nashirCampaignId: UNKNOWN_ID,
      evidenceType: "manual_publish_proof",
      channel: "linkedin",
      notes: "Proof note"
    }
  });

  assert.strictEqual(res.status, 422);
});

test("POST nashir evidence returns 403 for member lacking nashir.campaign.write", async () => {
  const server = await createTestServer();
  const res = await server.request("POST", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}/evidence`, {
    userId: VIEWER_A,
    body: {
      evidenceType: "manual_publish_proof",
      channel: "linkedin",
      notes: "Proof note"
    }
  });

  assert.strictEqual(res.status, 403);
});

test("POST nashir evidence returns 401 for unauthenticated callers", async () => {
  const server = await createTestServer();
  const res = await server.request("POST", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}/evidence`, {
    body: {
      evidenceType: "manual_publish_proof",
      channel: "linkedin",
      notes: "Proof note"
    }
  });

  assert.strictEqual(res.status, 401);
});

test("POST nashir evidence returns 401 for invalid users", async () => {
  const server = await createTestServer();
  const res = await server.request("POST", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}/evidence`, {
    userId: INVALID_USER,
    body: {
      evidenceType: "manual_publish_proof",
      channel: "linkedin",
      notes: "Proof note"
    }
  });

  assert.strictEqual(res.status, 401);
});

test("POST nashir evidence returns 404 for user with no workspace membership", async () => {
  const server = await createTestServer();
  const res = await server.request("POST", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}/evidence`, {
    userId: OUTSIDER,
    body: {
      evidenceType: "manual_publish_proof",
      channel: "linkedin",
      notes: "Proof note"
    }
  });

  assert.strictEqual(res.status, 404);
});

test("POST nashir evidence returns 404 for unknown workspace", async () => {
  const server = await createTestServer();
  const res = await server.request("POST", `/workspaces/workspace-missing/nashir-campaigns/${CAMPAIGN_A_ID}/evidence`, {
    userId: OWNER_A,
    body: {
      evidenceType: "manual_publish_proof",
      channel: "linkedin",
      notes: "Proof note"
    }
  });

  assert.strictEqual(res.status, 404);
});

test("POST nashir evidence returns 404 for unknown campaign", async () => {
  const server = await createTestServer();
  const res = await server.request("POST", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${UNKNOWN_ID}/evidence`, {
    userId: OWNER_A,
    body: {
      evidenceType: "manual_publish_proof",
      channel: "linkedin",
      notes: "Proof note"
    }
  });

  assert.strictEqual(res.status, 404);
});

test("POST nashir evidence returns 404 for cross-workspace campaign", async () => {
  const server = await createTestServer();
  const res = await server.request("POST", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_B_ID}/evidence`, {
    userId: OWNER_A,
    body: {
      evidenceType: "manual_publish_proof",
      channel: "linkedin",
      notes: "Proof note"
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

test("approval, scoring mutation, and publishing Nashir routes remain unregistered", async () => {
  const server = await createTestServer();
  const requests = [
    server.request("GET", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}/approval`, { userId: OWNER_A }),
    server.request("GET", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}/score-readiness`, { userId: OWNER_A }),
    server.request("GET", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${CAMPAIGN_A_ID}/publish`, { userId: OWNER_A })
  ];

  for (const res of await Promise.all(requests)) {
    assert.strictEqual(res.status, 404);
  }
});
