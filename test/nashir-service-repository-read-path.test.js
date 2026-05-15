"use strict";

const assert = require("assert");
const { test } = require("node:test");

const { NashirSlice0Repository, createNashirSlice0Repository } = require("../src/nashir/backend-slice0-repository");
const { NashirSlice0Service, createNashirSlice0Service } = require("../src/nashir/backend-slice0-service");

// Use the real seed store so tests stay consistent with the live store data.
const { createSeedStore } = require("../src/store");

// Seed IDs and workspace values come directly from src/store.js nashirCampaigns.
const CAMPAIGN_A_ID = "00000000-0000-4000-8000-000000000a01";
const CAMPAIGN_B_ID = "00000000-0000-4000-8000-000000000b01";
const WORKSPACE_A = "workspace-a";
const WORKSPACE_B = "workspace-b";
const UNKNOWN_ID = "00000000-0000-4000-8000-000000000000";

// ─── Repository: findCampaignById ────────────────────────────────────────────

test("repository returns matching campaign for correct workspace and ID", async () => {
  const store = createSeedStore();
  const repo = createNashirSlice0Repository({ store });

  const campaign = await repo.findCampaignById({ workspaceId: WORKSPACE_A, nashirCampaignId: CAMPAIGN_A_ID });

  assert.ok(campaign !== null, "must return a campaign object");
  assert.strictEqual(campaign.nashir_campaign_id, CAMPAIGN_A_ID);
  assert.strictEqual(campaign.workspace_id, WORKSPACE_A);
});

test("repository returns null when nashir_campaign_id does not exist", async () => {
  const store = createSeedStore();
  const repo = createNashirSlice0Repository({ store });

  const result = await repo.findCampaignById({ workspaceId: WORKSPACE_A, nashirCampaignId: UNKNOWN_ID });

  assert.strictEqual(result, null);
});

test("repository returns null for cross-workspace access — workspace-b campaign ID with workspace-a context", async () => {
  const store = createSeedStore();
  const repo = createNashirSlice0Repository({ store });

  const result = await repo.findCampaignById({ workspaceId: WORKSPACE_A, nashirCampaignId: CAMPAIGN_B_ID });

  assert.strictEqual(result, null, "workspace-b entity must not be returned for workspace-a caller");
});

test("repository returns null for cross-workspace access — workspace-a campaign ID with workspace-b context", async () => {
  const store = createSeedStore();
  const repo = createNashirSlice0Repository({ store });

  const result = await repo.findCampaignById({ workspaceId: WORKSPACE_B, nashirCampaignId: CAMPAIGN_A_ID });

  assert.strictEqual(result, null, "workspace-a entity must not be returned for workspace-b caller");
});

test("repository returns null when no store is injected", async () => {
  const repo = createNashirSlice0Repository();

  const result = await repo.findCampaignById({ workspaceId: WORKSPACE_A, nashirCampaignId: CAMPAIGN_A_ID });

  assert.strictEqual(result, null);
});

test("repository does not mutate store.nashirCampaigns on read", async () => {
  const store = createSeedStore();
  const originalLength = store.nashirCampaigns.length;
  const repo = createNashirSlice0Repository({ store });

  await repo.findCampaignById({ workspaceId: WORKSPACE_A, nashirCampaignId: CAMPAIGN_A_ID });

  assert.strictEqual(store.nashirCampaigns.length, originalLength, "store must not be mutated by a read");
});

test("repository can find both workspace-a and workspace-b seed records independently", async () => {
  const store = createSeedStore();
  const repo = createNashirSlice0Repository({ store });

  const campaignA = await repo.findCampaignById({ workspaceId: WORKSPACE_A, nashirCampaignId: CAMPAIGN_A_ID });
  const campaignB = await repo.findCampaignById({ workspaceId: WORKSPACE_B, nashirCampaignId: CAMPAIGN_B_ID });

  assert.ok(campaignA !== null);
  assert.ok(campaignB !== null);
  assert.strictEqual(campaignA.workspace_id, WORKSPACE_A);
  assert.strictEqual(campaignB.workspace_id, WORKSPACE_B);
  assert.notStrictEqual(campaignA.nashir_campaign_id, campaignB.nashir_campaign_id);
});

// ─── Repository: listCampaigns ───────────────────────────────────────────────

test("repository listCampaigns returns only campaigns for the requested workspace", async () => {
  const store = createSeedStore();
  const repo = createNashirSlice0Repository({ store });

  const campaigns = await repo.listCampaigns({ workspaceId: WORKSPACE_A });

  assert.strictEqual(campaigns.length, 1);
  assert.strictEqual(campaigns[0].nashir_campaign_id, CAMPAIGN_A_ID);
  assert.ok(campaigns.every((campaign) => campaign.workspace_id === WORKSPACE_A));
  assert.ok(!campaigns.some((campaign) => campaign.nashir_campaign_id === CAMPAIGN_B_ID));
});

test("repository listCampaigns returns [] when workspaceId is missing", async () => {
  const store = createSeedStore();
  const repo = createNashirSlice0Repository({ store });

  const campaigns = await repo.listCampaigns();

  assert.deepStrictEqual(campaigns, []);
});

test("repository listCampaigns returns [] when no campaigns match", async () => {
  const store = createSeedStore();
  const repo = createNashirSlice0Repository({ store });

  const campaigns = await repo.listCampaigns({ workspaceId: "workspace-empty" });

  assert.deepStrictEqual(campaigns, []);
});

test("repository listCampaigns returns shallow clones, not original store objects", async () => {
  const store = createSeedStore();
  const repo = createNashirSlice0Repository({ store });

  const campaigns = await repo.listCampaigns({ workspaceId: WORKSPACE_A });
  const original = store.nashirCampaigns.find(
    (campaign) => campaign.workspace_id === WORKSPACE_A && campaign.nashir_campaign_id === CAMPAIGN_A_ID
  );

  assert.notStrictEqual(campaigns[0], original);
  assert.deepStrictEqual(campaigns[0], original);
});

test("mutating a listed campaign does not mutate store.nashirCampaigns", async () => {
  const store = createSeedStore();
  const repo = createNashirSlice0Repository({ store });
  const original = store.nashirCampaigns.find(
    (campaign) => campaign.workspace_id === WORKSPACE_A && campaign.nashir_campaign_id === CAMPAIGN_A_ID
  );
  const originalName = original.campaign_name;

  const campaigns = await repo.listCampaigns({ workspaceId: WORKSPACE_A });
  campaigns[0].campaign_name = "MUTATED";

  assert.strictEqual(original.campaign_name, originalName);
});

test("repository listCampaigns does not mutate store.nashirCampaigns", async () => {
  const store = createSeedStore();
  const originalLength = store.nashirCampaigns.length;
  const repo = createNashirSlice0Repository({ store });

  await repo.listCampaigns({ workspaceId: WORKSPACE_A });

  assert.strictEqual(store.nashirCampaigns.length, originalLength);
});

// ─── Repository: listCampaignEvidence ──────────────────────────────────────

test("repository listCampaignEvidence returns [] when evidence store is empty", async () => {
  const store = createSeedStore();
  const repo = createNashirSlice0Repository({ store });

  const evidence = await repo.listCampaignEvidence({ workspaceId: WORKSPACE_A, nashirCampaignId: CAMPAIGN_A_ID });

  assert.deepStrictEqual(evidence, []);
  assert.deepStrictEqual(store.nashirEvidence, []);
});

test("repository listCampaignEvidence returns [] when workspaceId or nashirCampaignId is missing", async () => {
  const store = createSeedStore();
  const repo = createNashirSlice0Repository({ store });

  assert.deepStrictEqual(await repo.listCampaignEvidence({ workspaceId: WORKSPACE_A }), []);
  assert.deepStrictEqual(await repo.listCampaignEvidence({ nashirCampaignId: CAMPAIGN_A_ID }), []);
  assert.deepStrictEqual(await repo.listCampaignEvidence(), []);
});

test("repository listCampaignEvidence filters by route-derived workspace and campaign when a store exists", async () => {
  const store = createSeedStore();
  store.nashirEvidence = [
    { evidence_id: "evidence-a", workspace_id: WORKSPACE_A, nashir_campaign_id: CAMPAIGN_A_ID },
    { evidence_id: "evidence-b", workspace_id: WORKSPACE_B, nashir_campaign_id: CAMPAIGN_B_ID },
    { evidence_id: "evidence-cross", workspace_id: WORKSPACE_B, nashir_campaign_id: CAMPAIGN_A_ID }
  ];
  const repo = createNashirSlice0Repository({ store });

  const evidence = await repo.listCampaignEvidence({ workspaceId: WORKSPACE_A, nashirCampaignId: CAMPAIGN_A_ID });

  assert.deepStrictEqual(evidence, [
    { evidence_id: "evidence-a", workspaceId: WORKSPACE_A, nashirCampaignId: CAMPAIGN_A_ID }
  ]);
  assert.ok(!Object.hasOwn(evidence[0], "workspace_id"));
  assert.ok(!Object.hasOwn(evidence[0], "nashir_campaign_id"));
});

test("repository listCampaignEvidence returns shallow clones and does not mutate store", async () => {
  const store = createSeedStore();
  store.nashirEvidence = [
    { evidence_id: "evidence-a", workspace_id: WORKSPACE_A, nashir_campaign_id: CAMPAIGN_A_ID }
  ];
  const before = JSON.stringify(store);
  const repo = createNashirSlice0Repository({ store });

  const evidence = await repo.listCampaignEvidence({ workspaceId: WORKSPACE_A, nashirCampaignId: CAMPAIGN_A_ID });
  evidence[0].evidence_id = "mutated";
  evidence[0].workspaceId = "mutated";

  assert.strictEqual(JSON.stringify(store), before);
});

test("repository createCampaignEvidence creates submitted in-memory evidence scoped to workspace and campaign", async () => {
  const store = createSeedStore();
  const repo = createNashirSlice0Repository({ store });

  const evidence = await repo.createCampaignEvidence({
    workspaceId: WORKSPACE_A,
    nashirCampaignId: CAMPAIGN_A_ID,
    evidenceType: "manual_publish_proof",
    channel: "linkedin",
    submittedAt: "2026-05-13T00:00:00.000Z",
    submittedBy: "user-owner-a",
    publishedAt: "2026-05-12T00:00:00.000Z",
    url: "https://example.com/post",
    notes: "Published manually",
    externalReference: "post-123"
  });

  assert.deepStrictEqual(evidence, {
    id: "nashir-evidence-1",
    workspaceId: WORKSPACE_A,
    nashirCampaignId: CAMPAIGN_A_ID,
    evidenceType: "manual_publish_proof",
    channel: "linkedin",
    status: "submitted",
    submittedAt: "2026-05-13T00:00:00.000Z",
    submittedBy: "user-owner-a",
    publishedAt: "2026-05-12T00:00:00.000Z",
    url: "https://example.com/post",
    notes: "Published manually",
    externalReference: "post-123"
  });
  assert.deepStrictEqual(store.nashirEvidence, [evidence]);
});

test("repository createCampaignEvidence returns a shallow clone, not the stored object", async () => {
  const store = createSeedStore();
  const repo = createNashirSlice0Repository({ store });

  const evidence = await repo.createCampaignEvidence({
    workspaceId: WORKSPACE_A,
    nashirCampaignId: CAMPAIGN_A_ID,
    evidenceType: "manual_publish_proof",
    channel: "linkedin",
    submittedAt: "2026-05-13T00:00:00.000Z",
    submittedBy: "user-owner-a",
    notes: "Published manually"
  });
  const original = store.nashirEvidence.find((entry) => entry.id === evidence.id);

  assert.notStrictEqual(evidence, original);
  assert.deepStrictEqual(evidence, original);
});

test("repository createCampaignEvidence avoids legacy evidence_id collisions", async () => {
  const store = createSeedStore();
  store.nashirEvidence = [
    { evidence_id: "nashir-evidence-1", workspace_id: WORKSPACE_A, nashir_campaign_id: CAMPAIGN_A_ID }
  ];
  const repo = createNashirSlice0Repository({ store });

  const evidence = await repo.createCampaignEvidence({
    workspaceId: WORKSPACE_A,
    nashirCampaignId: CAMPAIGN_A_ID,
    evidenceType: "manual_publish_proof",
    channel: "linkedin",
    submittedAt: "2026-05-13T00:00:00.000Z",
    submittedBy: "user-owner-a",
    notes: "Published manually"
  });

  assert.strictEqual(evidence.id, "nashir-evidence-2");
  assert.deepStrictEqual(
    store.nashirEvidence.map((record) => record.id || record.evidence_id),
    ["nashir-evidence-1", "nashir-evidence-2"]
  );
});

// ─── Repository: createCampaign ─────────────────────────────────────────────

test("repository createCampaign creates an in-memory draft campaign scoped to workspace", async () => {
  const store = createSeedStore();
  const repo = createNashirSlice0Repository({ store });

  const campaign = await repo.createCampaign({
    workspaceId: WORKSPACE_A,
    campaignName: "Created Campaign",
    actorUserId: "user-owner-a",
    timestamp: "2026-05-13T00:00:00.000Z"
  });

  assert.strictEqual(campaign.workspace_id, WORKSPACE_A);
  assert.strictEqual(campaign.campaign_name, "Created Campaign");
  assert.strictEqual(campaign.campaign_status, "draft");
  assert.strictEqual(campaign.created_by_user_id, "user-owner-a");
  assert.strictEqual(campaign.created_at, "2026-05-13T00:00:00.000Z");
  assert.strictEqual(campaign.updated_at, "2026-05-13T00:00:00.000Z");
  assert.ok(store.nashirCampaigns.some((entry) => entry.nashir_campaign_id === campaign.nashir_campaign_id));
});

test("repository createCampaign returns a shallow clone, not the original store object", async () => {
  const store = createSeedStore();
  const repo = createNashirSlice0Repository({ store });

  const campaign = await repo.createCampaign({
    workspaceId: WORKSPACE_A,
    campaignName: "Clone Check",
    actorUserId: "user-owner-a",
    timestamp: "2026-05-13T00:00:00.000Z"
  });
  const original = store.nashirCampaigns.find((entry) => entry.nashir_campaign_id === campaign.nashir_campaign_id);

  assert.notStrictEqual(campaign, original);
  assert.deepStrictEqual(campaign, original);
});

test("repository createCampaign regenerates when the first generated ID would collide", async () => {
  const store = createSeedStore();
  store.nashirCampaigns[0].nashir_campaign_id = "nashir-campaign-3";
  const repo = createNashirSlice0Repository({ store });

  const campaign = await repo.createCampaign({
    workspaceId: WORKSPACE_A,
    campaignName: "Collision Safe",
    actorUserId: "user-owner-a",
    timestamp: "2026-05-13T00:00:00.000Z"
  });

  assert.notStrictEqual(campaign.nashir_campaign_id, "nashir-campaign-3");
  assert.strictEqual(campaign.nashir_campaign_id, "nashir-campaign-4");
  assert.strictEqual(
    store.nashirCampaigns.filter((entry) => entry.nashir_campaign_id === campaign.nashir_campaign_id).length,
    1
  );
});

// ─── Repository: inert write/evidence methods ────────────────────────────────

test("repository saveCampaign remains not implemented", async () => {
  const repo = createNashirSlice0Repository({ store: createSeedStore() });
  await assert.rejects(() => repo.saveCampaign({}), /not implemented/);
});

test("repository findEvidenceById returns null when called without arguments", async () => {
  const repo = createNashirSlice0Repository({ store: createSeedStore() });

  const result = await repo.findEvidenceById();

  assert.strictEqual(result, null);
});

test("repository findEvidenceById returns null for missing route-derived scope", async () => {
  const repo = createNashirSlice0Repository({ store: createSeedStore() });

  assert.strictEqual(await repo.findEvidenceById({ nashirCampaignId: CAMPAIGN_A_ID, evidenceId: "evidence-a" }), null);
  assert.strictEqual(await repo.findEvidenceById({ workspaceId: WORKSPACE_A, evidenceId: "evidence-a" }), null);
  assert.strictEqual(await repo.findEvidenceById({ workspaceId: WORKSPACE_A, nashirCampaignId: CAMPAIGN_A_ID }), null);
  assert.strictEqual(await repo.findEvidenceById(null), null);
  assert.strictEqual(await repo.findEvidenceById("evidence-a"), null);
});

test("repository findEvidenceById returns null when evidence does not exist", async () => {
  const repo = createNashirSlice0Repository({ store: createSeedStore() });

  const result = await repo.findEvidenceById({
    workspaceId: WORKSPACE_A,
    nashirCampaignId: CAMPAIGN_A_ID,
    evidenceId: "evidence-missing"
  });

  assert.strictEqual(result, null);
});

test("repository findEvidenceById returns a normalized shallow clone for matching evidence", async () => {
  const store = createSeedStore();
  store.nashirEvidence.push({
    evidence_id: "evidence-a",
    workspace_id: WORKSPACE_A,
    nashir_campaign_id: CAMPAIGN_A_ID,
    evidenceType: "external_post_url",
    channel: "linkedin",
    status: "submitted",
    submittedAt: "2026-05-15T00:00:00.000Z",
    submittedBy: "user-owner-a"
  });
  const repo = createNashirSlice0Repository({ store });

  const result = await repo.findEvidenceById({
    workspaceId: WORKSPACE_A,
    nashirCampaignId: CAMPAIGN_A_ID,
    evidenceId: "evidence-a"
  });

  assert.deepStrictEqual(result, {
    evidence_id: "evidence-a",
    evidenceType: "external_post_url",
    channel: "linkedin",
    status: "submitted",
    submittedAt: "2026-05-15T00:00:00.000Z",
    submittedBy: "user-owner-a",
    workspaceId: WORKSPACE_A,
    nashirCampaignId: CAMPAIGN_A_ID
  });
  assert.notStrictEqual(result, store.nashirEvidence[0]);
});

test("repository findEvidenceById returns null for cross-workspace or cross-campaign evidence", async () => {
  const store = createSeedStore();
  store.nashirEvidence.push({
    id: "evidence-a",
    workspaceId: WORKSPACE_A,
    nashirCampaignId: CAMPAIGN_A_ID
  });
  const repo = createNashirSlice0Repository({ store });

  const crossWorkspace = await repo.findEvidenceById({
    workspaceId: WORKSPACE_B,
    nashirCampaignId: CAMPAIGN_A_ID,
    evidenceId: "evidence-a"
  });
  const crossCampaign = await repo.findEvidenceById({
    workspaceId: WORKSPACE_A,
    nashirCampaignId: CAMPAIGN_B_ID,
    evidenceId: "evidence-a"
  });

  assert.strictEqual(crossWorkspace, null);
  assert.strictEqual(crossCampaign, null);
});

test("repository findEvidenceById does not allow returned evidence mutation to affect store", async () => {
  const store = createSeedStore();
  store.nashirEvidence.push({
    id: "evidence-a",
    workspaceId: WORKSPACE_A,
    nashirCampaignId: CAMPAIGN_A_ID,
    notes: "Original note"
  });
  const repo = createNashirSlice0Repository({ store });

  const result = await repo.findEvidenceById({
    workspaceId: WORKSPACE_A,
    nashirCampaignId: CAMPAIGN_A_ID,
    evidenceId: "evidence-a"
  });
  result.notes = "Mutated note";

  assert.strictEqual(store.nashirEvidence[0].notes, "Original note");
});

test("repository saveEvidence remains not implemented", async () => {
  const repo = createNashirSlice0Repository({ store: createSeedStore() });
  await assert.rejects(() => repo.saveEvidence({}), /not implemented/);
});

// ─── Service: getCampaignById ─────────────────────────────────────────────────

test("service getCampaignById delegates to repository and returns matching campaign", async () => {
  const store = createSeedStore();
  const repo = createNashirSlice0Repository({ store });
  const svc = createNashirSlice0Service({ repository: repo });

  const campaign = await svc.getCampaignById({ workspaceId: WORKSPACE_A, nashirCampaignId: CAMPAIGN_A_ID });

  assert.ok(campaign !== null);
  assert.strictEqual(campaign.nashir_campaign_id, CAMPAIGN_A_ID);
  assert.strictEqual(campaign.workspace_id, WORKSPACE_A);
});

test("service getCampaignById returns null when repository returns null", async () => {
  const store = createSeedStore();
  const repo = createNashirSlice0Repository({ store });
  const svc = createNashirSlice0Service({ repository: repo });

  const result = await svc.getCampaignById({ workspaceId: WORKSPACE_A, nashirCampaignId: UNKNOWN_ID });

  assert.strictEqual(result, null);
});

test("service getCampaignById returns null for cross-workspace access", async () => {
  const store = createSeedStore();
  const repo = createNashirSlice0Repository({ store });
  const svc = createNashirSlice0Service({ repository: repo });

  const result = await svc.getCampaignById({ workspaceId: WORKSPACE_A, nashirCampaignId: CAMPAIGN_B_ID });

  assert.strictEqual(result, null);
});

test("service getCampaignById returns null when no repository is injected", async () => {
  const svc = createNashirSlice0Service();

  const result = await svc.getCampaignById({ workspaceId: WORKSPACE_A, nashirCampaignId: CAMPAIGN_A_ID });

  assert.strictEqual(result, null);
});

test("service delegates to repository.findCampaignById with correct args", async () => {
  const calls = [];
  const fakeRepo = {
    findCampaignById(args) {
      calls.push(args);
      return Promise.resolve({ nashir_campaign_id: CAMPAIGN_A_ID, workspace_id: WORKSPACE_A });
    },
  };
  const svc = createNashirSlice0Service({ repository: fakeRepo });

  await svc.getCampaignById({ workspaceId: WORKSPACE_A, nashirCampaignId: CAMPAIGN_A_ID });

  assert.strictEqual(calls.length, 1, "findCampaignById must be called exactly once");
  assert.deepStrictEqual(calls[0], { workspaceId: WORKSPACE_A, nashirCampaignId: CAMPAIGN_A_ID });
});

// ─── Service: listCampaigns ─────────────────────────────────────────────────

test("service listCampaigns delegates to repository and returns matching campaigns", async () => {
  const store = createSeedStore();
  const repo = createNashirSlice0Repository({ store });
  const svc = createNashirSlice0Service({ repository: repo });

  const campaigns = await svc.listCampaigns({ workspaceId: WORKSPACE_A });

  assert.strictEqual(campaigns.length, 1);
  assert.strictEqual(campaigns[0].nashir_campaign_id, CAMPAIGN_A_ID);
  assert.strictEqual(campaigns[0].workspace_id, WORKSPACE_A);
});

test("service listCampaigns returns [] when no repository is injected", async () => {
  const svc = createNashirSlice0Service();

  const campaigns = await svc.listCampaigns({ workspaceId: WORKSPACE_A });

  assert.deepStrictEqual(campaigns, []);
});

test("service delegates to repository.listCampaigns with correct args", async () => {
  const calls = [];
  const fakeRepo = {
    listCampaigns(args) {
      calls.push(args);
      return Promise.resolve([{ nashir_campaign_id: CAMPAIGN_A_ID, workspace_id: WORKSPACE_A }]);
    },
  };
  const svc = createNashirSlice0Service({ repository: fakeRepo });

  await svc.listCampaigns({ workspaceId: WORKSPACE_A });

  assert.strictEqual(calls.length, 1, "listCampaigns must be called exactly once");
  assert.deepStrictEqual(calls[0], { workspaceId: WORKSPACE_A });
});

// ─── Service: listCampaignEvidence ─────────────────────────────────────────

test("service listCampaignEvidence returns [] for an existing campaign with no evidence persistence", async () => {
  const store = createSeedStore();
  const repo = createNashirSlice0Repository({ store });
  const svc = createNashirSlice0Service({ repository: repo });

  const evidence = await svc.listCampaignEvidence({ workspaceId: WORKSPACE_A, nashirCampaignId: CAMPAIGN_A_ID });

  assert.deepStrictEqual(evidence, []);
});

test("service listCampaignEvidence returns null for unknown or cross-workspace campaign", async () => {
  const store = createSeedStore();
  const repo = createNashirSlice0Repository({ store });
  const svc = createNashirSlice0Service({ repository: repo });

  assert.strictEqual(
    await svc.listCampaignEvidence({ workspaceId: WORKSPACE_A, nashirCampaignId: UNKNOWN_ID }),
    null
  );
  assert.strictEqual(
    await svc.listCampaignEvidence({ workspaceId: WORKSPACE_A, nashirCampaignId: CAMPAIGN_B_ID }),
    null
  );
});

test("service listCampaignEvidence delegates through the workspace-scoped campaign read path first", async () => {
  const calls = [];
  const fakeRepo = {
    findCampaignById(args) {
      calls.push(["findCampaignById", args]);
      return Promise.resolve({ nashir_campaign_id: CAMPAIGN_A_ID, workspace_id: WORKSPACE_A });
    },
    listCampaignEvidence(args) {
      calls.push(["listCampaignEvidence", args]);
      return Promise.resolve([]);
    }
  };
  const svc = createNashirSlice0Service({ repository: fakeRepo });

  const evidence = await svc.listCampaignEvidence({ workspaceId: WORKSPACE_A, nashirCampaignId: CAMPAIGN_A_ID });

  assert.deepStrictEqual(evidence, []);
  assert.deepStrictEqual(calls, [
    ["findCampaignById", { workspaceId: WORKSPACE_A, nashirCampaignId: CAMPAIGN_A_ID }],
    ["listCampaignEvidence", { workspaceId: WORKSPACE_A, nashirCampaignId: CAMPAIGN_A_ID }]
  ]);
});

test("service listCampaignEvidence does not call repository list when campaign is missing", async () => {
  const calls = [];
  const fakeRepo = {
    findCampaignById(args) {
      calls.push(["findCampaignById", args]);
      return Promise.resolve(null);
    },
    listCampaignEvidence(args) {
      calls.push(["listCampaignEvidence", args]);
      return Promise.resolve([]);
    }
  };
  const svc = createNashirSlice0Service({ repository: fakeRepo });

  const evidence = await svc.listCampaignEvidence({ workspaceId: WORKSPACE_A, nashirCampaignId: UNKNOWN_ID });

  assert.strictEqual(evidence, null);
  assert.deepStrictEqual(calls, [
    ["findCampaignById", { workspaceId: WORKSPACE_A, nashirCampaignId: UNKNOWN_ID }]
  ]);
});

test("service listCampaignEvidence returns null when no repository is injected", async () => {
  const svc = createNashirSlice0Service();

  const evidence = await svc.listCampaignEvidence({ workspaceId: WORKSPACE_A, nashirCampaignId: CAMPAIGN_A_ID });

  assert.strictEqual(evidence, null);
});

test("service createCampaignEvidence returns submitted evidence for an existing campaign", async () => {
  const store = createSeedStore();
  const repo = createNashirSlice0Repository({ store });
  const svc = createNashirSlice0Service({ repository: repo });

  const evidence = await svc.createCampaignEvidence({
    workspaceId: WORKSPACE_A,
    nashirCampaignId: CAMPAIGN_A_ID,
    evidenceType: "manual_publish_proof",
    channel: "linkedin",
    submittedAt: "2026-05-13T00:00:00.000Z",
    submittedBy: "user-owner-a",
    notes: "Published manually"
  });

  assert.strictEqual(evidence.id, "nashir-evidence-1");
  assert.strictEqual(evidence.workspaceId, WORKSPACE_A);
  assert.strictEqual(evidence.nashirCampaignId, CAMPAIGN_A_ID);
  assert.strictEqual(evidence.status, "submitted");
});

test("service createCampaignEvidence returns null for unknown or cross-workspace campaign", async () => {
  const store = createSeedStore();
  const repo = createNashirSlice0Repository({ store });
  const svc = createNashirSlice0Service({ repository: repo });
  const args = {
    workspaceId: WORKSPACE_A,
    evidenceType: "manual_publish_proof",
    channel: "linkedin",
    submittedAt: "2026-05-13T00:00:00.000Z",
    submittedBy: "user-owner-a",
    notes: "Published manually"
  };

  assert.strictEqual(await svc.createCampaignEvidence({ ...args, nashirCampaignId: UNKNOWN_ID }), null);
  assert.strictEqual(await svc.createCampaignEvidence({ ...args, nashirCampaignId: CAMPAIGN_B_ID }), null);
  assert.deepStrictEqual(store.nashirEvidence, []);
});

test("service createCampaignEvidence delegates through the workspace-scoped campaign read path first", async () => {
  const calls = [];
  const fakeRepo = {
    findCampaignById(args) {
      calls.push(["findCampaignById", args]);
      return Promise.resolve({ nashir_campaign_id: CAMPAIGN_A_ID, workspace_id: WORKSPACE_A });
    },
    createCampaignEvidence(args) {
      calls.push(["createCampaignEvidence", args]);
      return Promise.resolve({ id: "nashir-evidence-1", workspaceId: WORKSPACE_A, nashirCampaignId: CAMPAIGN_A_ID });
    }
  };
  const svc = createNashirSlice0Service({ repository: fakeRepo });
  const args = {
    workspaceId: WORKSPACE_A,
    nashirCampaignId: CAMPAIGN_A_ID,
    evidenceType: "manual_publish_proof",
    channel: "linkedin",
    submittedAt: "2026-05-13T00:00:00.000Z",
    submittedBy: "user-owner-a",
    notes: "Published manually"
  };

  await svc.createCampaignEvidence(args);

  assert.deepStrictEqual(calls, [
    ["findCampaignById", { workspaceId: WORKSPACE_A, nashirCampaignId: CAMPAIGN_A_ID }],
    [
      "createCampaignEvidence",
      {
        ...args,
        publishedAt: undefined,
        url: undefined,
        externalReference: undefined
      }
    ]
  ]);
});

// ─── Service: getCampaignReadiness ─────────────────────────────────────────

test("service getCampaignReadiness returns advisory readiness for an existing campaign", async () => {
  const store = createSeedStore();
  const repo = createNashirSlice0Repository({ store });
  const svc = createNashirSlice0Service({ repository: repo });

  const readiness = await svc.getCampaignReadiness({
    workspaceId: WORKSPACE_A,
    nashirCampaignId: CAMPAIGN_A_ID,
    evaluatedAt: "2026-05-13T00:00:00.000Z"
  });

  assert.deepStrictEqual(readiness, {
    nashir_campaign_id: CAMPAIGN_A_ID,
    workspace_id: WORKSPACE_A,
    readiness_level: "pass",
    gate_state: "advisory_only",
    blockers: [],
    warnings: [],
    missing_fields: [],
    explanations: [
      {
        code: "NASHIR_READINESS_ADVISORY_ONLY",
        message: "Readiness is advisory and does not approve content or authorize publishing.",
        related_fields: []
      }
    ],
    evaluated_at: "2026-05-13T00:00:00.000Z"
  });
});

test("service getCampaignReadiness returns null for unknown or cross-workspace campaign", async () => {
  const store = createSeedStore();
  const repo = createNashirSlice0Repository({ store });
  const svc = createNashirSlice0Service({ repository: repo });

  assert.strictEqual(
    await svc.getCampaignReadiness({ workspaceId: WORKSPACE_A, nashirCampaignId: UNKNOWN_ID, evaluatedAt: "2026-05-13T00:00:00.000Z" }),
    null
  );
  assert.strictEqual(
    await svc.getCampaignReadiness({ workspaceId: WORKSPACE_A, nashirCampaignId: CAMPAIGN_B_ID, evaluatedAt: "2026-05-13T00:00:00.000Z" }),
    null
  );
});

test("service getCampaignReadiness delegates through the workspace-scoped read path", async () => {
  const calls = [];
  const fakeRepo = {
    findCampaignById(args) {
      calls.push(args);
      return Promise.resolve({ nashir_campaign_id: CAMPAIGN_A_ID, workspace_id: WORKSPACE_A });
    }
  };
  const svc = createNashirSlice0Service({ repository: fakeRepo });

  await svc.getCampaignReadiness({
    workspaceId: WORKSPACE_A,
    nashirCampaignId: CAMPAIGN_A_ID,
    evaluatedAt: "2026-05-13T00:00:00.000Z"
  });

  assert.strictEqual(calls.length, 1);
  assert.deepStrictEqual(calls[0], { workspaceId: WORKSPACE_A, nashirCampaignId: CAMPAIGN_A_ID });
});

test("service getCampaignReadiness does not mutate store.nashirCampaigns", async () => {
  const store = createSeedStore();
  const before = JSON.stringify(store.nashirCampaigns);
  const repo = createNashirSlice0Repository({ store });
  const svc = createNashirSlice0Service({ repository: repo });

  await svc.getCampaignReadiness({
    workspaceId: WORKSPACE_A,
    nashirCampaignId: CAMPAIGN_A_ID,
    evaluatedAt: "2026-05-13T00:00:00.000Z"
  });

  assert.strictEqual(JSON.stringify(store.nashirCampaigns), before);
});

// ─── Service: createCampaign ────────────────────────────────────────────────

test("service createCampaign delegates to repository and returns created campaign", async () => {
  const store = createSeedStore();
  const repo = createNashirSlice0Repository({ store });
  const svc = createNashirSlice0Service({ repository: repo });

  const campaign = await svc.createCampaign({
    workspaceId: WORKSPACE_A,
    campaignName: "Service Created",
    actorUserId: "user-owner-a",
    timestamp: "2026-05-13T00:00:00.000Z"
  });

  assert.strictEqual(campaign.workspace_id, WORKSPACE_A);
  assert.strictEqual(campaign.campaign_name, "Service Created");
  assert.strictEqual(campaign.campaign_status, "draft");
});

test("service createCampaign remains inert when no repository is injected", async () => {
  const svc = createNashirSlice0Service();

  await assert.rejects(() => svc.createCampaign({
    workspaceId: WORKSPACE_A,
    campaignName: "No Repo",
    actorUserId: "user-owner-a",
    timestamp: "2026-05-13T00:00:00.000Z"
  }), /not implemented/);
});

test("service delegates to repository.createCampaign with correct args", async () => {
  const calls = [];
  const fakeRepo = {
    createCampaign(args) {
      calls.push(args);
      return Promise.resolve({ nashir_campaign_id: "created", workspace_id: WORKSPACE_A });
    }
  };
  const svc = createNashirSlice0Service({ repository: fakeRepo });
  const args = {
    workspaceId: WORKSPACE_A,
    campaignName: "Delegated",
    actorUserId: "user-owner-a",
    timestamp: "2026-05-13T00:00:00.000Z"
  };

  await svc.createCampaign(args);

  assert.strictEqual(calls.length, 1, "createCampaign must be called exactly once");
  assert.deepStrictEqual(calls[0], args);
});

// ─── Service: inert approval/evidence methods ───────────────────────────────

test("service scoreReadiness remains not implemented", async () => {
  const svc = createNashirSlice0Service();
  await assert.rejects(() => svc.scoreReadiness("any"), /not implemented/);
});

test("service submitForApproval remains not implemented", async () => {
  const svc = createNashirSlice0Service();
  await assert.rejects(() => svc.submitForApproval("any"), /not implemented/);
});

test("service recordManualEvidence remains not implemented", async () => {
  const svc = createNashirSlice0Service();
  await assert.rejects(() => svc.recordManualEvidence("any", {}), /not implemented/);
});

// ─── Default-argument and missing-param guards ───────────────────────────────

test("repository returns null when called without arguments", async () => {
  const store = createSeedStore();
  const repo = createNashirSlice0Repository({ store });

  const result = await repo.findCampaignById();

  assert.strictEqual(result, null);
});

test("service returns null when called without arguments", async () => {
  const store = createSeedStore();
  const repo = createNashirSlice0Repository({ store });
  const svc = createNashirSlice0Service({ repository: repo });

  const result = await svc.getCampaignById();

  assert.strictEqual(result, null);
});

test("repository returns null when workspaceId is missing", async () => {
  const store = createSeedStore();
  const repo = createNashirSlice0Repository({ store });

  const result = await repo.findCampaignById({ nashirCampaignId: CAMPAIGN_A_ID });

  assert.strictEqual(result, null);
});

test("repository returns null when nashirCampaignId is missing", async () => {
  const store = createSeedStore();
  const repo = createNashirSlice0Repository({ store });

  const result = await repo.findCampaignById({ workspaceId: WORKSPACE_A });

  assert.strictEqual(result, null);
});

// ─── Null/undefined entry guard and shallow-clone isolation ─────────────────

test("repository ignores null and undefined entries in store.nashirCampaigns", async () => {
  const store = {
    nashirCampaigns: [
      null,
      undefined,
      { nashir_campaign_id: CAMPAIGN_A_ID, workspace_id: WORKSPACE_A, campaign_name: "Test" }
    ]
  };
  const repo = createNashirSlice0Repository({ store });

  const campaign = await repo.findCampaignById({ workspaceId: WORKSPACE_A, nashirCampaignId: CAMPAIGN_A_ID });

  assert.ok(campaign !== null, "must find the valid entry even when nulls are present");
  assert.strictEqual(campaign.nashir_campaign_id, CAMPAIGN_A_ID);
});

test("repository returns a shallow clone — not the original store object", async () => {
  const store = createSeedStore();
  const repo = createNashirSlice0Repository({ store });

  const campaign = await repo.findCampaignById({ workspaceId: WORKSPACE_A, nashirCampaignId: CAMPAIGN_A_ID });
  const original = store.nashirCampaigns.find(
    (c) => c && c.nashir_campaign_id === CAMPAIGN_A_ID && c.workspace_id === WORKSPACE_A
  );

  assert.notStrictEqual(campaign, original, "returned object must not be the same reference as the store entry");
  assert.deepStrictEqual(campaign, original, "returned object must have the same values");
});

test("mutating the returned campaign does not mutate store.nashirCampaigns", async () => {
  const store = createSeedStore();
  const repo = createNashirSlice0Repository({ store });
  const original = store.nashirCampaigns.find(
    (c) => c && c.workspace_id === WORKSPACE_A && c.nashir_campaign_id === CAMPAIGN_A_ID
  );

  assert.ok(original, "seed campaign must exist");
  const originalName = original.campaign_name;

  const campaign = await repo.findCampaignById({ workspaceId: WORKSPACE_A, nashirCampaignId: CAMPAIGN_A_ID });
  campaign.campaign_name = "MUTATED";

  assert.strictEqual(
    original.campaign_name,
    originalName,
    "mutating the returned clone must not affect store.nashirCampaigns"
  );
});
