"use strict";

const assert = require("assert");
const { test } = require("node:test");
const { NashirCampaignRepository } = require("../src/repositories/nashir-campaign-repository");

const WORKSPACE_A = "workspace-a";
const WORKSPACE_B = "workspace-b";
const CAMPAIGN_A_ID = "00000000-0000-4000-8000-000000000a01";
const CAMPAIGN_B_ID = "00000000-0000-4000-8000-000000000b01";

function createPoolDouble(records = []) {
  return {
    records: records.map((record) => ({ ...record })),
    queries: [],
    async query(sql, params, options) {
      this.queries.push({ sql, params, options });

      if (sql.includes("INSERT INTO nashir_campaigns")) {
        const record = {
          nashir_campaign_id: `00000000-0000-4000-8000-${String(this.records.length + 1).padStart(12, "0")}`,
          workspace_id: params[0],
          campaign_name: params[1],
          campaign_status: "draft",
          created_by_user_id: params[2],
          created_at: params[3] || "2026-05-15T00:00:00.000Z",
          updated_at: params[3] || "2026-05-15T00:00:00.000Z"
        };
        this.records.push(record);
        return [record];
      }

      if (sql.includes("FROM nashir_campaigns") && params.length === 1) {
        return this.records.filter((record) => record.workspace_id === params[0]);
      }

      if (sql.includes("FROM nashir_campaigns") && params.length === 2) {
        return this.records.filter(
          (record) => record.workspace_id === params[0] && record.nashir_campaign_id === params[1]
        );
      }

      return [];
    }
  };
}

function seedCampaigns() {
  return [
    {
      nashir_campaign_id: CAMPAIGN_A_ID,
      workspace_id: WORKSPACE_A,
      campaign_name: "Workspace A Campaign",
      campaign_status: "draft",
      created_by_user_id: "user-owner-a",
      created_at: "2026-05-15T00:00:00.000Z",
      updated_at: "2026-05-15T00:00:00.000Z"
    },
    {
      nashir_campaign_id: CAMPAIGN_B_ID,
      workspace_id: WORKSPACE_B,
      campaign_name: "Workspace B Campaign",
      campaign_status: "draft",
      created_by_user_id: "user-owner-a",
      created_at: "2026-05-15T00:00:00.000Z",
      updated_at: "2026-05-15T00:00:00.000Z"
    }
  ];
}

test("constructor requires a pool", () => {
  assert.throws(
    () => new NashirCampaignRepository(),
    /NashirCampaignRepository requires a pool/
  );
});

test("listCampaigns preserves workspace isolation", async () => {
  const pool = createPoolDouble(seedCampaigns());
  const repository = new NashirCampaignRepository({ pool });

  const campaigns = await repository.listCampaigns({ workspaceId: WORKSPACE_A });

  assert.deepStrictEqual(campaigns.map((campaign) => campaign.nashir_campaign_id), [CAMPAIGN_A_ID]);
  assert.deepStrictEqual(pool.queries[0].params, [WORKSPACE_A]);
  assert.deepStrictEqual(pool.queries[0].options, { workspaceId: WORKSPACE_A });
});

test("findCampaignById returns null for non-existent or cross-workspace campaign IDs", async () => {
  const pool = createPoolDouble(seedCampaigns());
  const repository = new NashirCampaignRepository({ pool });

  const missing = await repository.findCampaignById({ workspaceId: WORKSPACE_A, nashirCampaignId: "missing" });
  const crossWorkspace = await repository.findCampaignById({ workspaceId: WORKSPACE_A, nashirCampaignId: CAMPAIGN_B_ID });

  assert.strictEqual(missing, null);
  assert.strictEqual(crossWorkspace, null);
});

test("findCampaignById returns a normalized campaign for matching workspace and ID", async () => {
  const pool = createPoolDouble(seedCampaigns());
  const repository = new NashirCampaignRepository({ pool });

  const campaign = await repository.findCampaignById({ workspaceId: WORKSPACE_A, nashirCampaignId: CAMPAIGN_A_ID });

  assert.deepStrictEqual(campaign, seedCampaigns()[0]);
  assert.deepStrictEqual(pool.queries[0].params, [WORKSPACE_A, CAMPAIGN_A_ID]);
  assert.deepStrictEqual(pool.queries[0].options, { workspaceId: WORKSPACE_A });
});

test("createCampaign inserts only the approved campaign fields", async () => {
  const pool = createPoolDouble();
  const repository = new NashirCampaignRepository({ pool });

  const campaign = await repository.createCampaign({
    workspaceId: WORKSPACE_A,
    campaignName: "Created Campaign",
    actorUserId: "user-owner-a",
    timestamp: "2026-05-15T01:00:00.000Z"
  });

  assert.strictEqual(campaign.workspace_id, WORKSPACE_A);
  assert.strictEqual(campaign.campaign_name, "Created Campaign");
  assert.strictEqual(campaign.campaign_status, "draft");
  assert.strictEqual(campaign.created_by_user_id, "user-owner-a");
  assert.deepStrictEqual(pool.queries[0].params, [
    WORKSPACE_A,
    "Created Campaign",
    "user-owner-a",
    "2026-05-15T01:00:00.000Z"
  ]);
  assert.deepStrictEqual(pool.queries[0].options, { workspaceId: WORKSPACE_A });
});
