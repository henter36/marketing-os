const assert = require("node:assert/strict");
const test = require("node:test");
const { implementedRoutes } = require("../../src/router");
const { createTestServer } = require("../helpers");

const hashA = "c".repeat(64);
const reportBody = {
  report_template_id: "report-template-a",
  report_period_start: "2026-04-01T00:00:00.000Z",
  report_period_end: "2026-05-01T00:00:00.000Z"
};
const mediaJobBody = {
  brief_version_id: "brief-version-a",
  prompt_template_id: "prompt-template-a",
  job_type: "text",
  input_payload: { topic: "Sprint 4" },
  requested_output_format: "text/plain"
};

function freeze(value) {
  return JSON.parse(JSON.stringify(value));
}

test("Sprint 4 implemented routes stay inside the OpenAPI-approved surface", () => {
  for (const route of [
    "GET /workspaces/{workspaceId}/campaigns/{campaignId}/client-report-snapshots",
    "POST /workspaces/{workspaceId}/campaigns/{campaignId}/client-report-snapshots",
    "GET /workspaces/{workspaceId}/audit-logs",
    "GET /workspaces/{workspaceId}/safe-mode",
    "POST /workspaces/{workspaceId}/safe-mode",
    "GET /workspaces/{workspaceId}/onboarding-progress",
    "PATCH /workspaces/{workspaceId}/onboarding-progress"
  ]) {
    assert.ok(implementedRoutes.includes(route), `${route} should be implemented`);
  }
});

test("ClientReportSnapshot generate/list enforces RBAC, tenant scope, audit, and frozen payloads", async () => {
  const server = await createTestServer();
  try {
    const denied = await server.request("POST", "/workspaces/workspace-a/campaigns/campaign-a/client-report-snapshots", {
      userId: "user-viewer-a",
      body: reportBody
    });
    assert.equal(denied.status, 403);
    assert.equal(denied.body.code, "PERMISSION_DENIED");

    const invalidPeriod = await server.request("POST", "/workspaces/workspace-a/campaigns/campaign-a/client-report-snapshots", {
      userId: "user-admin-a",
      body: { ...reportBody, report_period_end: "2026-03-01T00:00:00.000Z" }
    });
    assert.equal(invalidPeriod.status, 422);
    assert.equal(invalidPeriod.body.code, "INVALID_REPORT_PERIOD");

    const crossTenant = await server.request("GET", "/workspaces/workspace-a/campaigns/campaign-b/client-report-snapshots", {
      userId: "user-admin-a"
    });
    assert.equal(crossTenant.status, 404);
    assert.equal(crossTenant.body.code, "CAMPAIGN_NOT_FOUND");

    const created = await server.request("POST", "/workspaces/workspace-a/campaigns/campaign-a/client-report-snapshots", {
      userId: "user-admin-a",
      body: reportBody
    });
    assert.equal(created.status, 201);
    assert.equal(created.body.data.workspace_id, "workspace-a");
    assert.equal(created.body.data.content_hash.length, 64);
    assert.equal(created.body.data.evidence_snapshot_payload.evidence.length, 1);
    assert.equal(server.store.auditLogs.at(-1).action, "client_report_snapshot.generated");

    const frozenEvidence = freeze(created.body.data.evidence_snapshot_payload);
    const frozenReport = freeze(created.body.data.report_snapshot_payload);
    const frozenHash = created.body.data.content_hash;

    const superseded = await server.request("POST", "/workspaces/workspace-a/manual-evidence/manual-evidence-a/supersede", {
      userId: "user-publisher-a",
      body: {
        media_asset_version_id: "asset-version-a",
        published_url: "https://example.com/manual-post-b",
        screenshot_ref: "screenshot-b",
        external_post_id: "external-b",
        content_hash: hashA
      }
    });
    assert.equal(superseded.status, 201);

    const afterSupersede = await server.request("GET", "/workspaces/workspace-a/campaigns/campaign-a/client-report-snapshots", {
      userId: "user-viewer-a"
    });
    const listed = afterSupersede.body.data.find((snapshot) => snapshot.client_report_snapshot_id === created.body.data.client_report_snapshot_id);
    assert.deepEqual(listed.evidence_snapshot_payload, frozenEvidence);
    assert.deepEqual(listed.report_snapshot_payload, frozenReport);
    assert.equal(listed.content_hash, frozenHash);

    const invalidated = await server.request("POST", "/workspaces/workspace-a/manual-evidence/manual-evidence-a/invalidate", {
      userId: "user-publisher-a",
      body: { invalidated_reason: "Original proof no longer visible" }
    });
    assert.equal(invalidated.status, 200);

    const afterInvalidate = await server.request("GET", "/workspaces/workspace-a/campaigns/campaign-a/client-report-snapshots", {
      userId: "user-viewer-a"
    });
    const sameSnapshot = afterInvalidate.body.data.find((snapshot) => snapshot.client_report_snapshot_id === created.body.data.client_report_snapshot_id);
    assert.deepEqual(sameSnapshot.evidence_snapshot_payload, frozenEvidence);
    assert.equal(sameSnapshot.content_hash, frozenHash);
  } finally {
    server.close();
  }
});

test("AuditLog read model is workspace scoped, permissioned, and update/delete routes are not exposed", async () => {
  const server = await createTestServer();
  try {
    await server.request("POST", "/workspaces/workspace-a/campaigns/campaign-a/client-report-snapshots", {
      userId: "user-admin-a",
      body: reportBody
    });

    const denied = await server.request("GET", "/workspaces/workspace-a/audit-logs", { userId: "user-viewer-a" });
    assert.equal(denied.status, 403);
    assert.equal(denied.body.code, "PERMISSION_DENIED");

    const logs = await server.request("GET", "/workspaces/workspace-a/audit-logs", { userId: "user-admin-a" });
    assert.equal(logs.status, 200);
    assert.ok(logs.body.data.some((log) => log.action === "client_report_snapshot.generated"));
    assert.ok(logs.body.data.every((log) => log.workspace_id === "workspace-a"));

    const otherWorkspace = await server.request("GET", "/workspaces/workspace-b/audit-logs", { userId: "user-owner-a" });
    assert.equal(otherWorkspace.status, 200);
    assert.equal(otherWorkspace.body.data.some((log) => log.workspace_id === "workspace-a"), false);

    const patch = await server.request("PATCH", `/workspaces/workspace-a/audit-logs/${logs.body.data[0].audit_log_id}`, {
      userId: "user-admin-a",
      body: { action: "mutated" }
    });
    assert.equal(patch.status, 404);

    const del = await server.request("DELETE", `/workspaces/workspace-a/audit-logs/${logs.body.data[0].audit_log_id}`, {
      userId: "user-admin-a"
    });
    assert.equal(del.status, 404);
  } finally {
    server.close();
  }
});

test("Safe Mode read and activate/deactivate are permissioned and audited without broad write blocking", async () => {
  const server = await createTestServer();
  try {
    const initial = await server.request("GET", "/workspaces/workspace-a/safe-mode", { userId: "user-viewer-a" });
    assert.equal(initial.status, 200);
    assert.equal(initial.body.data.safe_mode_status, "inactive");

    const denied = await server.request("POST", "/workspaces/workspace-a/safe-mode", {
      userId: "user-viewer-a",
      body: { safe_mode_status: "active", reason: "incident" }
    });
    assert.equal(denied.status, 403);
    assert.equal(denied.body.code, "PERMISSION_DENIED");

    const activated = await server.request("POST", "/workspaces/workspace-a/safe-mode", {
      userId: "user-admin-a",
      body: { safe_mode_status: "active", reason: "incident" }
    });
    assert.equal(activated.status, 200);
    assert.equal(activated.body.data.safe_mode_status, "active");
    assert.equal(server.store.auditLogs.at(-1).action, "safe_mode.activated");

    const deactivated = await server.request("POST", "/workspaces/workspace-a/safe-mode", {
      userId: "user-admin-a",
      body: { safe_mode_status: "inactive", reason: "resolved" }
    });
    assert.equal(deactivated.status, 200);
    assert.equal(deactivated.body.data.safe_mode_status, "inactive");
    assert.equal(server.store.auditLogs.at(-1).action, "safe_mode.deactivated");

    const otherWorkspace = await server.request("GET", "/workspaces/workspace-b/safe-mode", { userId: "user-owner-a" });
    assert.equal(otherWorkspace.body.data.safe_mode_status, "inactive");
  } finally {
    server.close();
  }
});

test("OnboardingProgress read/patch enforces one row per workspace, RBAC, tenant scope, and audit", async () => {
  const server = await createTestServer();
  try {
    const initial = await server.request("GET", "/workspaces/workspace-a/onboarding-progress", { userId: "user-viewer-a" });
    assert.equal(initial.status, 200);
    assert.equal(initial.body.data.onboarding_status, "not_started");
    assert.equal(server.store.onboardingProgress.length, 0);

    const denied = await server.request("PATCH", "/workspaces/workspace-a/onboarding-progress", {
      userId: "user-viewer-a",
      body: { onboarding_status: "in_progress" }
    });
    assert.equal(denied.status, 403);
    assert.equal(denied.body.code, "PERMISSION_DENIED");

    const patched = await server.request("PATCH", "/workspaces/workspace-a/onboarding-progress", {
      userId: "user-admin-a",
      body: { onboarding_status: "in_progress", current_step: "connect_accounts", progress_payload: { checklist: ["brand"] } }
    });
    assert.equal(patched.status, 200);
    assert.equal(patched.body.data.workspace_id, "workspace-a");
    assert.equal(patched.body.data.current_step, "connect_accounts");
    assert.equal(server.store.auditLogs.at(-1).action, "onboarding.updated");

    const completed = await server.request("PATCH", "/workspaces/workspace-a/onboarding-progress", {
      userId: "user-admin-a",
      body: { onboarding_status: "completed", current_step: "done" }
    });
    assert.equal(completed.status, 200);
    assert.equal(completed.body.data.onboarding_status, "completed");
    assert.equal(server.store.onboardingProgress.filter((row) => row.workspace_id === "workspace-a").length, 1);

    const otherWorkspace = await server.request("GET", "/workspaces/workspace-b/onboarding-progress", { userId: "user-owner-a" });
    assert.equal(otherWorkspace.status, 200);
    assert.equal(otherWorkspace.body.data.workspace_id, "workspace-b");
    assert.equal(otherWorkspace.body.data.onboarding_status, "not_started");
  } finally {
    server.close();
  }
});

test("Pilot readiness regressions remain enforced across Sprint 0-4 controls", async () => {
  const server = await createTestServer();
  try {
    const crossTenantAsset = await server.request("GET", "/workspaces/workspace-a/assets/asset-b/versions", {
      userId: "user-creator-a"
    });
    assert.equal(crossTenantAsset.status, 404);

    const rejected = await server.request("POST", "/workspaces/workspace-a/review-tasks/review-task-a/decisions", {
      userId: "user-reviewer-a",
      body: { media_asset_version_id: "asset-version-a", decision: "rejected", decision_reason: "No" }
    });
    assert.equal(rejected.status, 201);

    const publishRejected = await server.request("POST", `/workspaces/workspace-a/approval-decisions/${rejected.body.data.approval_decision_id}/publish-jobs`, {
      userId: "user-publisher-a",
      headers: { "Idempotency-Key": "pilot-rejected" },
      body: { media_asset_version_id: "asset-version-a", campaign_id: "campaign-a", channel: "manual" }
    });
    assert.equal(publishRejected.status, 409);
    assert.equal(publishRejected.body.code, "APPROVAL_NOT_APPROVED");

    const wrongVersion = await server.request("POST", "/workspaces/workspace-a/assets/asset-a/versions", {
      userId: "user-creator-a",
      body: { version_number: 2, content_payload: { text: "Different approved content" } }
    });
    assert.equal(wrongVersion.status, 201);

    const wrongHashPublish = await server.request("POST", "/workspaces/workspace-a/approval-decisions/approval-decision-a/publish-jobs", {
      userId: "user-publisher-a",
      headers: { "Idempotency-Key": "pilot-wrong-hash" },
      body: { media_asset_version_id: wrongVersion.body.data.media_asset_version_id, campaign_id: "campaign-a", channel: "manual" }
    });
    assert.equal(wrongHashPublish.status, 409);
    assert.ok(["ASSET_VERSION_MISMATCH", "APPROVAL_HASH_MISMATCH"].includes(wrongHashPublish.body.code));

    const evidencePatch = await server.request("PATCH", "/workspaces/workspace-a/manual-evidence/manual-evidence-a", {
      userId: "user-publisher-a",
      body: { published_url: "mutated" }
    });
    assert.equal(evidencePatch.status, 404);

    const evidenceDelete = await server.request("DELETE", "/workspaces/workspace-a/manual-evidence/manual-evidence-a", {
      userId: "user-publisher-a"
    });
    assert.equal(evidenceDelete.status, 404);

    const failedJob = await server.request("POST", "/workspaces/workspace-a/campaigns/campaign-a/media-jobs", {
      userId: "user-creator-a",
      headers: { "Idempotency-Key": "pilot-failed-job" },
      body: mediaJobBody
    });
    assert.equal(failedJob.status, 202);
    await server.request("PATCH", `/workspaces/workspace-a/media-jobs/${failedJob.body.data.media_job_id}/status`, {
      userId: "user-owner-a",
      body: { job_status: "failed", failure_code: "provider_timeout" }
    });
    const failedUsage = await server.request("POST", "/workspaces/workspace-a/usage-meter", {
      userId: "user-owner-a",
      headers: { "Idempotency-Key": "pilot-failed-usage" },
      body: {
        usage_type: "media_output",
        quantity: 1,
        unit: "output",
        source_entity_type: "MediaJob",
        source_entity_id: failedJob.body.data.media_job_id,
        usable_output_confirmed: true
      }
    });
    assert.equal(failedUsage.status, 422);
    assert.equal(failedUsage.body.code, "USAGE_OUTPUT_NOT_CONFIRMED");

    const cost = await server.request("POST", "/workspaces/workspace-a/cost-events", {
      userId: "user-owner-a",
      body: {
        media_job_id: failedJob.body.data.media_job_id,
        cost_type: "provider",
        amount: 1,
        currency: "USD",
        event_status: "actual",
        source_entity_type: "MediaJob",
        source_entity_id: failedJob.body.data.media_job_id
      }
    });
    assert.equal(cost.status, 201);
    assert.equal(Object.hasOwn(server.store, "billingProviders"), false);
    assert.equal(Object.hasOwn(server.store, "invoices"), false);

    await server.request("POST", "/workspaces/workspace-a/campaigns/campaign-a/client-report-snapshots", {
      userId: "user-admin-a",
      body: reportBody
    });
    await server.request("POST", "/workspaces/workspace-a/safe-mode", {
      userId: "user-admin-a",
      body: { safe_mode_status: "active", reason: "pilot readiness" }
    });
    await server.request("PATCH", "/workspaces/workspace-a/onboarding-progress", {
      userId: "user-admin-a",
      body: { onboarding_status: "in_progress", current_step: "pilot" }
    });

    for (const action of ["client_report_snapshot.generated", "safe_mode.activated", "onboarding.updated", "cost_event.recorded"]) {
      assert.ok(server.store.auditLogs.some((log) => log.action === action), `${action} should be audited`);
    }
  } finally {
    server.close();
  }
});

test("Sprint 4 validation errors preserve unified ErrorModel", async () => {
  const server = await createTestServer();
  try {
    const response = await server.request("POST", "/workspaces/workspace-a/campaigns/campaign-a/client-report-snapshots", {
      userId: "user-admin-a",
      body: {}
    });
    assert.equal(response.status, 422);
    assert.equal(typeof response.body.code, "string");
    assert.equal(typeof response.body.message, "string");
    assert.equal(typeof response.body.user_action, "string");
    assert.equal(typeof response.body.correlation_id, "string");
  } finally {
    server.close();
  }
});
