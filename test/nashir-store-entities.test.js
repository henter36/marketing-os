"use strict";

const assert = require("assert");
const { test } = require("node:test");

// Imports only the store module chain — no router, server, db, rbac, guards,
// or Nashir-specific runtime modules are imported.
const { createSeedStore } = require("../src/store");

const VALID_STATUSES = new Set([
  "draft",
  "generated",
  "in_review",
  "approved",
  "rejected",
  "archived",
  "requires_reapproval",
  "blocked_until_review",
  "published",
]);

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const REQUIRED_FIELDS = [
  "nashir_campaign_id",
  "workspace_id",
  "campaign_name",
  "campaign_status",
  "created_by_user_id",
  "created_at",
  "updated_at",
];

test("nashirCampaigns collection exists and is an array", () => {
  const store = createSeedStore();
  assert.ok(Array.isArray(store.nashirCampaigns), "store.nashirCampaigns must be an Array");
});

test("nashirCampaigns has at least two seed entries", () => {
  const store = createSeedStore();
  assert.ok(store.nashirCampaigns.length >= 2, "store.nashirCampaigns must have at least two seed entries");
});

test("each nashirCampaign has all required fields including created_by_user_id", () => {
  const store = createSeedStore();
  for (const entity of store.nashirCampaigns) {
    for (const field of REQUIRED_FIELDS) {
      assert.ok(
        field in entity && entity[field] !== null && entity[field] !== undefined,
        `nashirCampaign must have a non-null field: ${field}`
      );
    }
  }
});

test("each nashirCampaign has a valid campaign_status", () => {
  const store = createSeedStore();
  for (const entity of store.nashirCampaigns) {
    assert.ok(
      VALID_STATUSES.has(entity.campaign_status),
      `campaign_status "${entity.campaign_status}" is not an approved value`
    );
  }
});

test("workspace-a nashirCampaign seed record exists", () => {
  const store = createSeedStore();
  const record = store.nashirCampaigns.find((c) => c.workspace_id === "workspace-a");
  assert.ok(record, "store.nashirCampaigns must contain a record for workspace-a");
});

test("workspace-b nashirCampaign seed record exists", () => {
  const store = createSeedStore();
  const record = store.nashirCampaigns.find((c) => c.workspace_id === "workspace-b");
  assert.ok(record, "store.nashirCampaigns must contain a record for workspace-b");
});

test("nashir_campaign_id values use UUID format", () => {
  const store = createSeedStore();
  for (const entity of store.nashirCampaigns) {
    assert.match(
      entity.nashir_campaign_id,
      UUID_RE,
      `nashir_campaign_id "${entity.nashir_campaign_id}" must be UUID format (8-4-4-4-12 hex)`
    );
  }
});

test("nashir_campaign_id values are distinct from each other", () => {
  const store = createSeedStore();
  const ids = store.nashirCampaigns.map((c) => c.nashir_campaign_id);
  const unique = new Set(ids);
  assert.strictEqual(unique.size, ids.length, "all nashir_campaign_id values must be unique within the collection");
});

test("nashir_campaign_id UUID format is the primary differentiator from human-readable campaign_id values", () => {
  const store = createSeedStore();
  const nashirIds = new Set(store.nashirCampaigns.map((c) => c.nashir_campaign_id));
  // Existing campaign_id values are human-readable (e.g., "campaign-a"); they must not collide.
  for (const campaign of store.campaigns) {
    assert.ok(
      !nashirIds.has(campaign.campaign_id),
      `nashir_campaign_id must not equal existing human-readable campaign_id: ${campaign.campaign_id}`
    );
  }
});

test("nashirCampaigns entities are workspace-scoped — no cross-workspace seed leakage", () => {
  const store = createSeedStore();
  const wsA = store.nashirCampaigns.find((c) => c.workspace_id === "workspace-a");
  const wsB = store.nashirCampaigns.find((c) => c.workspace_id === "workspace-b");
  assert.ok(wsA, "workspace-a entity must exist");
  assert.ok(wsB, "workspace-b entity must exist");
  assert.notStrictEqual(
    wsA.nashir_campaign_id,
    wsB.nashir_campaign_id,
    "workspace-a and workspace-b entities must have distinct nashir_campaign_id values"
  );
  assert.notStrictEqual(
    wsA.workspace_id,
    wsB.workspace_id,
    "workspace-a and workspace-b entities must have different workspace_id values"
  );
});

test("store.nashirCampaigns is additive — existing collections are unchanged", () => {
  const store = createSeedStore();
  // Spot-check that well-known existing collections are intact.
  assert.ok(Array.isArray(store.campaigns), "store.campaigns must still exist");
  assert.ok(store.campaigns.length > 0, "store.campaigns must still be non-empty");
  assert.ok(Array.isArray(store.connectors), "store.connectors must still exist");
});
