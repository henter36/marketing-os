"use strict";

const assert = require("assert");
const { test } = require("node:test");
const { createTestServer } = require("./helpers");

const WORKSPACE_A = "workspace-a";
const OWNER_A = "user-owner-a";

test("Nashir Internal MVP Campaign Proof Flow works in-memory", async () => {
  const server = await createTestServer();

  const create = await server.request("POST", `/workspaces/${WORKSPACE_A}/nashir-campaigns`, {
    userId: OWNER_A,
    body: {
      campaign_name: "Internal MVP Flow Campaign"
    }
  });
  assert.strictEqual(create.status, 201);
  assert.strictEqual(create.body.data.workspace_id, WORKSPACE_A);
  assert.strictEqual(create.body.data.campaign_name, "Internal MVP Flow Campaign");
  const nashirCampaignId = create.body.data.nashir_campaign_id;
  assert.ok(nashirCampaignId);

  const listCampaigns = await server.request("GET", `/workspaces/${WORKSPACE_A}/nashir-campaigns`, {
    userId: OWNER_A
  });
  assert.strictEqual(listCampaigns.status, 200);
  assert.ok(
    listCampaigns.body.data.some(
      (campaign) =>
        campaign.workspace_id === WORKSPACE_A &&
        campaign.nashir_campaign_id === nashirCampaignId
    )
  );

  const readCampaign = await server.request("GET", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${nashirCampaignId}`, {
    userId: OWNER_A
  });
  assert.strictEqual(readCampaign.status, 200);
  assert.strictEqual(readCampaign.body.data.workspace_id, WORKSPACE_A);
  assert.strictEqual(readCampaign.body.data.nashir_campaign_id, nashirCampaignId);

  const readiness = await server.request("GET", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${nashirCampaignId}/readiness`, {
    userId: OWNER_A
  });
  assert.strictEqual(readiness.status, 200);
  assert.strictEqual(readiness.body.data.workspace_id, WORKSPACE_A);
  assert.strictEqual(readiness.body.data.nashir_campaign_id, nashirCampaignId);
  assert.strictEqual(readiness.body.data.gate_state, "advisory_only");

  const submitEvidence = await server.request("POST", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${nashirCampaignId}/evidence`, {
    userId: OWNER_A,
    body: {
      evidenceType: "manual_publish_proof",
      channel: "linkedin",
      notes: "Manual proof for internal MVP flow verification"
    }
  });
  assert.strictEqual(submitEvidence.status, 201);
  assert.strictEqual(submitEvidence.body.data.workspaceId, WORKSPACE_A);
  assert.strictEqual(submitEvidence.body.data.nashirCampaignId, nashirCampaignId);
  assert.strictEqual(submitEvidence.body.data.status, "submitted");
  assert.strictEqual(submitEvidence.body.data.submittedBy, OWNER_A);

  const listEvidence = await server.request("GET", `/workspaces/${WORKSPACE_A}/nashir-campaigns/${nashirCampaignId}/evidence`, {
    userId: OWNER_A
  });
  assert.strictEqual(listEvidence.status, 200);
  assert.deepStrictEqual(listEvidence.body.data, [submitEvidence.body.data]);
  assert.ok(
    listEvidence.body.data.every(
      (evidence) =>
        evidence.workspaceId === WORKSPACE_A &&
        evidence.nashirCampaignId === nashirCampaignId &&
        evidence.status === "submitted"
    )
  );
});
