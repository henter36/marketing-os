const assert = require("node:assert/strict");
const test = require("node:test");
const { implementedRoutes } = require("../../src/router");
const { createTestServer } = require("../helpers");

const mediaJobBody = {
  brief_version_id: "brief-version-a",
  prompt_template_id: "prompt-template-a",
  job_type: "text",
  input_payload: { topic: "Sprint 2" },
  requested_output_format: "text/plain"
};

test("Sprint 2 implemented routes stay inside the OpenAPI-approved surface", () => {
  for (const route of [
    "GET /workspaces/{workspaceId}/cost-budgets",
    "POST /workspaces/{workspaceId}/cost-budgets",
    "GET /workspaces/{workspaceId}/cost-guardrails",
    "POST /workspaces/{workspaceId}/cost-guardrails",
    "GET /workspaces/{workspaceId}/campaigns/{campaignId}/media-jobs",
    "POST /workspaces/{workspaceId}/campaigns/{campaignId}/media-jobs",
    "GET /workspaces/{workspaceId}/media-jobs/{mediaJobId}",
    "PATCH /workspaces/{workspaceId}/media-jobs/{mediaJobId}/status",
    "GET /workspaces/{workspaceId}/media-jobs/{mediaJobId}/assets",
    "POST /workspaces/{workspaceId}/media-jobs/{mediaJobId}/assets",
    "GET /workspaces/{workspaceId}/assets/{mediaAssetId}/versions",
    "POST /workspaces/{workspaceId}/assets/{mediaAssetId}/versions",
    "GET /workspaces/{workspaceId}/usage-meter",
    "POST /workspaces/{workspaceId}/usage-meter",
    "GET /workspaces/{workspaceId}/quota-state",
    "GET /workspaces/{workspaceId}/cost-events",
    "POST /workspaces/{workspaceId}/cost-events"
  ]) {
    assert.ok(implementedRoutes.includes(route), `${route} should be implemented`);
  }
});

test("CostBudget and CostGuardrail endpoints enforce tenant scope, RBAC, and validation", async () => {
  const server = await createTestServer();
  try {
    const viewerDenied = await server.request("POST", "/workspaces/workspace-a/cost-budgets", {
      userId: "user-viewer-a",
      body: {
        budget_name: "Viewer Budget",
        budget_amount: 100,
        currency: "USD",
        period_start: "2026-04-01T00:00:00.000Z",
        period_end: "2026-05-01T00:00:00.000Z"
      }
    });
    assert.equal(viewerDenied.status, 403);
    assert.equal(viewerDenied.body.code, "PERMISSION_DENIED");

    const negative = await server.request("POST", "/workspaces/workspace-a/cost-budgets", {
      userId: "user-billing-a",
      body: {
        budget_name: "Negative",
        budget_amount: -1,
        currency: "USD",
        period_start: "2026-04-01T00:00:00.000Z",
        period_end: "2026-05-01T00:00:00.000Z"
      }
    });
    assert.equal(negative.status, 422);
    assert.equal(negative.body.code, "INVALID_COST_AMOUNT");

    const budget = await server.request("POST", "/workspaces/workspace-a/cost-budgets", {
      userId: "user-billing-a",
      body: {
        budget_name: "Sprint 2 Budget",
        budget_amount: 500,
        currency: "USD",
        period_start: "2026-04-01T00:00:00.000Z",
        period_end: "2026-05-01T00:00:00.000Z"
      }
    });
    assert.equal(budget.status, 201);
    assert.equal(budget.body.data.workspace_id, "workspace-a");
    assert.equal(server.store.auditLogs.at(-1).action, "cost_budget.created");

    const guardrail = await server.request("POST", "/workspaces/workspace-a/cost-guardrails", {
      userId: "user-billing-a",
      body: {
        guardrail_name: "Tiny Block",
        guardrail_type: "per_job",
        threshold_amount: 1,
        currency: "USD",
        action: "block"
      }
    });
    assert.equal(guardrail.status, 201);
    assert.equal(server.store.auditLogs.at(-1).action, "cost_guardrail.created");

    const list = await server.request("GET", "/workspaces/workspace-a/cost-budgets", { userId: "user-billing-a" });
    assert.ok(list.body.data.every((candidate) => candidate.workspace_id === "workspace-a"));
  } finally {
    server.close();
  }
});

test("MediaJob create/list/get/status and idempotency behavior work", async () => {
  const server = await createTestServer();
  try {
    const missingKey = await server.request("POST", "/workspaces/workspace-a/campaigns/campaign-a/media-jobs", {
      userId: "user-creator-a",
      body: mediaJobBody
    });
    assert.equal(missingKey.status, 400);
    assert.equal(missingKey.body.code, "IDEMPOTENCY_KEY_REQUIRED");

    const created = await server.request("POST", "/workspaces/workspace-a/campaigns/campaign-a/media-jobs", {
      userId: "user-creator-a",
      headers: { "Idempotency-Key": "media-job-k1" },
      body: mediaJobBody
    });
    assert.equal(created.status, 202);
    assert.equal(created.body.data.job_status, "queued");
    assert.equal(created.body.data.workspace_id, "workspace-a");

    const replay = await server.request("POST", "/workspaces/workspace-a/campaigns/campaign-a/media-jobs", {
      userId: "user-creator-a",
      headers: { "Idempotency-Key": "media-job-k1" },
      body: mediaJobBody
    });
    assert.equal(replay.status, 202);
    assert.equal(replay.body.data.media_job_id, created.body.data.media_job_id);
    assert.equal(server.store.mediaJobs.filter((job) => job.idempotency_key === "media-job-k1").length, 1);

    const conflict = await server.request("POST", "/workspaces/workspace-a/campaigns/campaign-a/media-jobs", {
      userId: "user-creator-a",
      headers: { "Idempotency-Key": "media-job-k1" },
      body: { ...mediaJobBody, requested_output_format: "application/json" }
    });
    assert.equal(conflict.status, 409);
    assert.equal(conflict.body.code, "IDEMPOTENCY_CONFLICT");

    const list = await server.request("GET", "/workspaces/workspace-a/campaigns/campaign-a/media-jobs", {
      userId: "user-creator-a"
    });
    assert.ok(list.body.data.some((job) => job.media_job_id === created.body.data.media_job_id));

    const get = await server.request("GET", `/workspaces/workspace-a/media-jobs/${created.body.data.media_job_id}`, {
      userId: "user-creator-a"
    });
    assert.equal(get.status, 200);
    assert.equal(get.body.data.media_job_id, created.body.data.media_job_id);

    const running = await server.request("PATCH", `/workspaces/workspace-a/media-jobs/${created.body.data.media_job_id}/status`, {
      userId: "user-owner-a",
      body: { job_status: "running" }
    });
    assert.equal(running.status, 200);
    assert.equal(running.body.data.job_status, "running");

    const succeeded = await server.request("PATCH", `/workspaces/workspace-a/media-jobs/${created.body.data.media_job_id}/status`, {
      userId: "user-owner-a",
      body: { job_status: "succeeded" }
    });
    assert.equal(succeeded.status, 200);
    assert.equal(succeeded.body.data.job_status, "succeeded");
    assert.equal(server.store.auditLogs.at(-1).action, "media_job.completed");
  } finally {
    server.close();
  }
});

test("MediaJob requires approved MediaCostSnapshot before create, run, or success", async () => {
  const server = await createTestServer();
  try {
    server.store.mediaCostSnapshots = [];
    const createWithoutSnapshot = await server.request("POST", "/workspaces/workspace-a/campaigns/campaign-a/media-jobs", {
      userId: "user-creator-a",
      headers: { "Idempotency-Key": "missing-snapshot" },
      body: mediaJobBody
    });
    assert.equal(createWithoutSnapshot.status, 409);
    assert.equal(createWithoutSnapshot.body.code, "MEDIA_COST_SNAPSHOT_REQUIRED");

    server.store.mediaCostSnapshots.push({
      media_cost_snapshot_id: "media-cost-snapshot-test",
      workspace_id: "workspace-a",
      customer_account_id: "customer-a",
      campaign_id: "campaign-a",
      brief_version_id: "brief-version-a",
      prompt_template_id: "prompt-template-a",
      job_type: "text",
      estimated_amount: 5,
      currency: "USD",
      cost_check_result: "approved"
    });
    const created = await server.request("POST", "/workspaces/workspace-a/campaigns/campaign-a/media-jobs", {
      userId: "user-creator-a",
      headers: { "Idempotency-Key": "snapshot-approved" },
      body: mediaJobBody
    });
    assert.equal(created.status, 202);

    server.store.mediaCostSnapshots = [];
    const runningWithoutSnapshot = await server.request("PATCH", `/workspaces/workspace-a/media-jobs/${created.body.data.media_job_id}/status`, {
      userId: "user-owner-a",
      body: { job_status: "running" }
    });
    assert.equal(runningWithoutSnapshot.status, 409);
    assert.equal(runningWithoutSnapshot.body.code, "MEDIA_COST_SNAPSHOT_REQUIRED");

    const succeededWithoutSnapshot = await server.request("PATCH", `/workspaces/workspace-a/media-jobs/${created.body.data.media_job_id}/status`, {
      userId: "user-owner-a",
      body: { job_status: "succeeded" }
    });
    assert.equal(succeededWithoutSnapshot.status, 409);
    assert.equal(succeededWithoutSnapshot.body.code, "MEDIA_COST_SNAPSHOT_REQUIRED");
  } finally {
    server.close();
  }
});

test("Cost guardrail block prevents MediaJob creation when threshold is exceeded", async () => {
  const server = await createTestServer();
  try {
    server.store.costGuardrails.push({
      cost_guardrail_id: "cost-guardrail-block-test",
      workspace_id: "workspace-a",
      customer_account_id: "customer-a",
      guardrail_name: "Block all",
      guardrail_type: "per_job",
      threshold_amount: 1,
      currency: "USD",
      action: "block",
      guardrail_status: "active"
    });
    const blocked = await server.request("POST", "/workspaces/workspace-a/campaigns/campaign-a/media-jobs", {
      userId: "user-creator-a",
      headers: { "Idempotency-Key": "guardrail-block" },
      body: mediaJobBody
    });
    assert.equal(blocked.status, 409);
    assert.equal(blocked.body.code, "COST_GUARDRAIL_BLOCKED");
  } finally {
    server.close();
  }
});

test("MediaAsset and MediaAssetVersion create/list behavior is tenant scoped and immutable after approval", async () => {
  const server = await createTestServer();
  try {
    const crossTenant = await server.request("GET", "/workspaces/workspace-a/assets/asset-b/versions", {
      userId: "user-creator-a"
    });
    assert.equal(crossTenant.status, 404);
    assert.equal(crossTenant.body.code, "MEDIA_ASSET_NOT_FOUND");

    const asset = await server.request("POST", "/workspaces/workspace-a/media-jobs/media-job-a/assets", {
      userId: "user-creator-a",
      body: { asset_type: "text" }
    });
    assert.equal(asset.status, 201);
    assert.equal(asset.body.data.media_job_id, "media-job-a");
    assert.equal(server.store.auditLogs.at(-1).action, "media_asset.created");

    const list = await server.request("GET", "/workspaces/workspace-a/media-jobs/media-job-a/assets", {
      userId: "user-creator-a"
    });
    assert.ok(list.body.data.some((candidate) => candidate.media_asset_id === asset.body.data.media_asset_id));

    const version = await server.request("POST", `/workspaces/workspace-a/assets/${asset.body.data.media_asset_id}/versions`, {
      userId: "user-creator-a",
      body: { version_number: 1, content_payload: { text: "usable output" } }
    });
    assert.equal(version.status, 201);
    assert.equal(version.body.data.content_hash.length, 64);

    const duplicate = await server.request("POST", `/workspaces/workspace-a/assets/${asset.body.data.media_asset_id}/versions`, {
      userId: "user-creator-a",
      body: { version_number: 1, content_payload: { text: "duplicate" } }
    });
    assert.equal(duplicate.status, 409);
    assert.equal(duplicate.body.code, "DUPLICATE_ASSET_VERSION");

    const versions = await server.request("GET", `/workspaces/workspace-a/assets/${asset.body.data.media_asset_id}/versions`, {
      userId: "user-creator-a"
    });
    assert.equal(versions.body.data.length, 1);

    const patchApproved = await server.request("PATCH", "/workspaces/workspace-a/assets/asset-a/versions/asset-version-a", {
      userId: "user-creator-a",
      body: { content_payload: { text: "mutate approved" } }
    });
    assert.equal(patchApproved.status, 404);
    assert.equal(server.store.mediaAssetVersions.find((candidate) => candidate.media_asset_version_id === "asset-version-a").content_hash, "c".repeat(64));
  } finally {
    server.close();
  }
});

test("UsageMeter requires confirmed usable output and supports idempotency", async () => {
  const server = await createTestServer();
  try {
    const viewerDenied = await server.request("POST", "/workspaces/workspace-a/usage-meter", {
      userId: "user-viewer-a",
      headers: { "Idempotency-Key": "usage-viewer" },
      body: {
        usage_type: "media_output",
        quantity: 1,
        unit: "output",
        source_entity_type: "MediaJob",
        source_entity_id: "media-job-a",
        usable_output_confirmed: true
      }
    });
    assert.equal(viewerDenied.status, 403);

    const unconfirmed = await server.request("POST", "/workspaces/workspace-a/usage-meter", {
      userId: "user-owner-a",
      headers: { "Idempotency-Key": "usage-unconfirmed" },
      body: {
        usage_type: "media_output",
        quantity: 1,
        unit: "output",
        source_entity_type: "MediaJob",
        source_entity_id: "media-job-a",
        usable_output_confirmed: false
      }
    });
    assert.equal(unconfirmed.status, 422);
    assert.equal(unconfirmed.body.code, "USAGE_OUTPUT_NOT_CONFIRMED");

    const invalidQuantity = await server.request("POST", "/workspaces/workspace-a/usage-meter", {
      userId: "user-owner-a",
      headers: { "Idempotency-Key": "usage-zero" },
      body: {
        usage_type: "media_output",
        quantity: 0,
        unit: "output",
        source_entity_type: "MediaJob",
        source_entity_id: "media-job-a",
        usable_output_confirmed: true
      }
    });
    assert.equal(invalidQuantity.status, 422);
    assert.equal(invalidQuantity.body.code, "INVALID_USAGE_QUANTITY");

    const usage = await server.request("POST", "/workspaces/workspace-a/usage-meter", {
      userId: "user-owner-a",
      headers: { "Idempotency-Key": "usage-k1" },
      body: {
        usage_type: "media_output",
        quantity: 1,
        unit: "output",
        source_entity_type: "MediaJob",
        source_entity_id: "media-job-a",
        usable_output_confirmed: true
      }
    });
    assert.equal(usage.status, 201);
    assert.equal(usage.body.data.workspace_id, "workspace-a");

    const replay = await server.request("POST", "/workspaces/workspace-a/usage-meter", {
      userId: "user-owner-a",
      headers: { "Idempotency-Key": "usage-k1" },
      body: {
        usage_type: "media_output",
        quantity: 1,
        unit: "output",
        source_entity_type: "MediaJob",
        source_entity_id: "media-job-a",
        usable_output_confirmed: true
      }
    });
    assert.equal(replay.body.data.usage_meter_id, usage.body.data.usage_meter_id);
    assert.equal(server.store.usageMeters.length, 1);

    const conflict = await server.request("POST", "/workspaces/workspace-a/usage-meter", {
      userId: "user-owner-a",
      headers: { "Idempotency-Key": "usage-k1" },
      body: {
        usage_type: "media_output",
        quantity: 2,
        unit: "output",
        source_entity_type: "MediaJob",
        source_entity_id: "media-job-a",
        usable_output_confirmed: true
      }
    });
    assert.equal(conflict.status, 409);
    assert.equal(conflict.body.code, "IDEMPOTENCY_CONFLICT");
  } finally {
    server.close();
  }
});

test("Failed MediaJob does not create commercial usage", async () => {
  const server = await createTestServer();
  try {
    const created = await server.request("POST", "/workspaces/workspace-a/campaigns/campaign-a/media-jobs", {
      userId: "user-creator-a",
      headers: { "Idempotency-Key": "failed-job" },
      body: mediaJobBody
    });
    assert.equal(created.status, 202);

    const failed = await server.request("PATCH", `/workspaces/workspace-a/media-jobs/${created.body.data.media_job_id}/status`, {
      userId: "user-owner-a",
      body: { job_status: "failed", failure_code: "provider_timeout" }
    });
    assert.equal(failed.status, 200);
    assert.equal(failed.body.data.job_status, "failed");

    const usage = await server.request("GET", "/workspaces/workspace-a/usage-meter", { userId: "user-viewer-a" });
    assert.equal(usage.body.data.some((entry) => entry.source_entity_id === created.body.data.media_job_id), false);

    const manualUsage = await server.request("POST", "/workspaces/workspace-a/usage-meter", {
      userId: "user-owner-a",
      headers: { "Idempotency-Key": "failed-job-usage" },
      body: {
        usage_type: "media_output",
        quantity: 1,
        unit: "output",
        source_entity_type: "MediaJob",
        source_entity_id: created.body.data.media_job_id,
        usable_output_confirmed: true
      }
    });
    assert.equal(manualUsage.status, 422);
    assert.equal(manualUsage.body.code, "USAGE_OUTPUT_NOT_CONFIRMED");
  } finally {
    server.close();
  }
});

test("UsageQuotaState read endpoint is workspace scoped", async () => {
  const server = await createTestServer();
  try {
    const quota = await server.request("GET", "/workspaces/workspace-a/quota-state", { userId: "user-viewer-a" });
    assert.equal(quota.status, 200);
    assert.ok(quota.body.data.length > 0);
    assert.ok(quota.body.data.every((entry) => entry.workspace_id === "workspace-a"));
  } finally {
    server.close();
  }
});

test("CostEvent creation/read behavior does not create billing or invoice state", async () => {
  const server = await createTestServer();
  try {
    const denied = await server.request("POST", "/workspaces/workspace-a/cost-events", {
      userId: "user-viewer-a",
      body: {
        media_job_id: "media-job-a",
        cost_type: "provider",
        amount: 1,
        currency: "USD",
        event_status: "actual",
        source_entity_type: "MediaJob",
        source_entity_id: "media-job-a"
      }
    });
    assert.equal(denied.status, 403);
    assert.equal(denied.body.code, "PERMISSION_DENIED");

    const negative = await server.request("POST", "/workspaces/workspace-a/cost-events", {
      userId: "user-owner-a",
      body: {
        media_job_id: "media-job-a",
        cost_type: "provider",
        amount: -1,
        currency: "USD",
        event_status: "actual",
        source_entity_type: "MediaJob",
        source_entity_id: "media-job-a"
      }
    });
    assert.equal(negative.status, 422);
    assert.equal(negative.body.code, "INVALID_COST_AMOUNT");

    const cost = await server.request("POST", "/workspaces/workspace-a/cost-events", {
      userId: "user-owner-a",
      body: {
        media_job_id: "media-job-a",
        cost_type: "provider",
        provider_name: "mock-provider",
        amount: 1.25,
        currency: "USD",
        event_status: "actual",
        source_entity_type: "MediaJob",
        source_entity_id: "media-job-a"
      }
    });
    assert.equal(cost.status, 201);
    assert.equal(cost.body.data.workspace_id, "workspace-a");
    assert.equal(server.store.auditLogs.at(-1).action, "cost_event.recorded");
    assert.equal(Object.hasOwn(server.store, "billingProviders"), false);
    assert.equal(Object.hasOwn(server.store, "invoices"), false);

    const list = await server.request("GET", "/workspaces/workspace-a/cost-events", { userId: "user-billing-a" });
    assert.ok(list.body.data.some((entry) => entry.cost_event_id === cost.body.data.cost_event_id));
  } finally {
    server.close();
  }
});

test("Sprint 2 validation and idempotency conflicts keep the unified ErrorModel", async () => {
  const server = await createTestServer();
  try {
    const missing = await server.request("POST", "/workspaces/workspace-a/cost-events", {
      userId: "user-owner-a",
      body: { amount: 1 }
    });
    assert.equal(missing.status, 422);
    assert.equal(typeof missing.body.code, "string");
    assert.equal(typeof missing.body.message, "string");
    assert.equal(typeof missing.body.user_action, "string");
    assert.equal(typeof missing.body.correlation_id, "string");

    const first = await server.request("POST", "/workspaces/workspace-a/campaigns/campaign-a/media-jobs", {
      userId: "user-creator-a",
      headers: { "Idempotency-Key": "error-model-conflict" },
      body: mediaJobBody
    });
    assert.equal(first.status, 202);
    const conflict = await server.request("POST", "/workspaces/workspace-a/campaigns/campaign-a/media-jobs", {
      userId: "user-creator-a",
      headers: { "Idempotency-Key": "error-model-conflict" },
      body: { ...mediaJobBody, requested_output_format: "application/json" }
    });
    assert.equal(conflict.status, 409);
    assert.equal(conflict.body.code, "IDEMPOTENCY_CONFLICT");
    assert.equal(typeof conflict.body.correlation_id, "string");
  } finally {
    server.close();
  }
});
