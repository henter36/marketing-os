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

// ─── Repository: inert write/evidence methods ────────────────────────────────

test("repository saveCampaign remains not implemented", async () => {
  const repo = createNashirSlice0Repository({ store: createSeedStore() });
  await assert.rejects(() => repo.saveCampaign({}), /not implemented/);
});

test("repository findEvidenceById remains not implemented", async () => {
  const repo = createNashirSlice0Repository({ store: createSeedStore() });
  await assert.rejects(() => repo.findEvidenceById("any"), /not implemented/);
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

// ─── Service: inert approval/evidence/create methods ────────────────────────

test("service createCampaign remains not implemented", async () => {
  const svc = createNashirSlice0Service();
  await assert.rejects(() => svc.createCampaign({}), /not implemented/);
});

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
