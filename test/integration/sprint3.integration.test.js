const assert = require("node:assert/strict");
const test = require("node:test");
const { implementedRoutes } = require("../../src/router");
const { createTestServer } = require("../helpers");

const hashA = "c".repeat(64);
const wrongHash = "f".repeat(64);

test("Sprint 3 implemented routes stay inside the approved Sprint 3 surface", () => {
  for (const route of [
    "GET /workspaces/{workspaceId}/asset-versions/{mediaAssetVersionId}/review-tasks",
    "POST /workspaces/{workspaceId}/asset-versions/{mediaAssetVersionId}/review-tasks",
    "GET /workspaces/{workspaceId}/review-tasks/{reviewTaskId}",
    "PATCH /workspaces/{workspaceId}/review-tasks/{reviewTaskId}/status",
    "GET /workspaces/{workspaceId}/review-tasks/{reviewTaskId}/decisions",
    "POST /workspaces/{workspaceId}/review-tasks/{reviewTaskId}/decisions",
    "GET /workspaces/{workspaceId}/approval-decisions/{approvalDecisionId}/publish-jobs",
    "POST /workspaces/{workspaceId}/approval-decisions/{approvalDecisionId}/publish-jobs",
    "GET /workspaces/{workspaceId}/publish-jobs/{publishJobId}",
    "PATCH /workspaces/{workspaceId}/publish-jobs/{publishJobId}/status",
    "GET /workspaces/{workspaceId}/publish-jobs/{publishJobId}/manual-evidence",
    "POST /workspaces/{workspaceId}/publish-jobs/{publishJobId}/manual-evidence",
    "GET /workspaces/{workspaceId}/manual-evidence/{manualPublishEvidenceId}",
    "POST /workspaces/{workspaceId}/manual-evidence/{manualPublishEvidenceId}/invalidate",
    "POST /workspaces/{workspaceId}/manual-evidence/{manualPublishEvidenceId}/supersede"
  ]) {
    assert.ok(implementedRoutes.includes(route), `${route} should be implemented`);
  }
});

test("ReviewTask create/list/get/update-status enforces tenant isolation and RBAC", async () => {
  const server = await createTestServer();
  try {
    const denied = await server.request("POST", "/workspaces/workspace-a/asset-versions/asset-version-a/review-tasks", {
      userId: "user-viewer-a",
      body: { review_type: "brand" }
    });
    assert.equal(denied.status, 403);
    assert.equal(denied.body.code, "PERMISSION_DENIED");

    const nonMember = await server.request("POST", "/workspaces/workspace-a/asset-versions/asset-version-a/review-tasks", {
      userId: "user-creator-a",
      body: { review_type: "legal", assigned_to_user_id: "user-outsider" }
    });
    assert.equal(nonMember.status, 422);
    assert.equal(nonMember.body.code, "ASSIGNEE_NOT_WORKSPACE_MEMBER");

    const crossTenant = await server.request("POST", "/workspaces/workspace-a/asset-versions/asset-version-b/review-tasks", {
      userId: "user-creator-a",
      body: { review_type: "quality" }
    });
    assert.equal(crossTenant.status, 404);
    assert.equal(crossTenant.body.code, "ASSET_VERSION_NOT_FOUND");

    const created = await server.request("POST", "/workspaces/workspace-a/asset-versions/asset-version-a/review-tasks", {
      userId: "user-creator-a",
      body: { review_type: "final", assigned_to_user_id: "user-reviewer-a" }
    });
    assert.equal(created.status, 201);
    assert.equal(created.body.data.workspace_id, "workspace-a");
    assert.equal(server.store.auditLogs.at(-1).action, "review_task.created");

    const list = await server.request("GET", "/workspaces/workspace-a/asset-versions/asset-version-a/review-tasks", {
      userId: "user-reviewer-a"
    });
    assert.ok(list.body.data.some((task) => task.review_task_id === created.body.data.review_task_id));

    const get = await server.request("GET", `/workspaces/workspace-a/review-tasks/${created.body.data.review_task_id}`, {
      userId: "user-reviewer-a"
    });
    assert.equal(get.status, 200);

    const status = await server.request("PATCH", `/workspaces/workspace-a/review-tasks/${created.body.data.review_task_id}/status`, {
      userId: "user-creator-a",
      body: { review_status: "in_review" }
    });
    assert.equal(status.status, 200);
    assert.equal(status.body.data.review_status, "in_review");
  } finally {
    server.close();
  }
});

test("ApprovalDecision validates hashes and marks MediaAssetVersion approved", async () => {
  const server = await createTestServer();
  try {
    const version = await server.request("POST", "/workspaces/workspace-a/assets/asset-a/versions", {
      userId: "user-creator-a",
      body: { version_number: 2, content_payload: { text: "Needs approval" } }
    });
    assert.equal(version.status, 201);
    assert.equal(version.body.data.version_status, "draft");

    const task = await server.request("POST", `/workspaces/workspace-a/asset-versions/${version.body.data.media_asset_version_id}/review-tasks`, {
      userId: "user-creator-a",
      body: { review_type: "final", assigned_to_user_id: "user-reviewer-a" }
    });

    const creatorDenied = await server.request("POST", `/workspaces/workspace-a/review-tasks/${task.body.data.review_task_id}/decisions`, {
      userId: "user-creator-a",
      body: { media_asset_version_id: version.body.data.media_asset_version_id, decision: "approved", approved_content_hash: version.body.data.content_hash }
    });
    assert.equal(creatorDenied.status, 403);

    const missingHash = await server.request("POST", `/workspaces/workspace-a/review-tasks/${task.body.data.review_task_id}/decisions`, {
      userId: "user-reviewer-a",
      body: { media_asset_version_id: version.body.data.media_asset_version_id, decision: "approved" }
    });
    assert.equal(missingHash.status, 422);
    assert.equal(missingHash.body.code, "APPROVAL_HASH_REQUIRED");

    const mismatch = await server.request("POST", `/workspaces/workspace-a/review-tasks/${task.body.data.review_task_id}/decisions`, {
      userId: "user-reviewer-a",
      body: { media_asset_version_id: version.body.data.media_asset_version_id, decision: "approved", approved_content_hash: wrongHash }
    });
    assert.equal(mismatch.status, 409);
    assert.equal(mismatch.body.code, "APPROVAL_HASH_MISMATCH");

    const outsideAssignment = await server.request("POST", `/workspaces/workspace-a/review-tasks/${task.body.data.review_task_id}/decisions`, {
      userId: "user-reviewer-a",
      body: { media_asset_version_id: "asset-version-a", decision: "approved", approved_content_hash: hashA }
    });
    assert.equal(outsideAssignment.status, 409);
    assert.equal(outsideAssignment.body.code, "REVIEW_TASK_VERSION_MISMATCH");

    const approved = await server.request("POST", `/workspaces/workspace-a/review-tasks/${task.body.data.review_task_id}/decisions`, {
      userId: "user-reviewer-a",
      body: {
        media_asset_version_id: version.body.data.media_asset_version_id,
        decision: "approved",
        approved_content_hash: version.body.data.content_hash
      }
    });
    assert.equal(approved.status, 201);
    assert.equal(
      server.store.mediaAssetVersions.find((candidate) => candidate.media_asset_version_id === version.body.data.media_asset_version_id).version_status,
      "approved"
    );
  } finally {
    server.close();
  }
});

test("PublishJob create/list/get/status requires approved decision, matching hash, and idempotency", async () => {
  const server = await createTestServer();
  try {
    const rejected = await server.request("POST", "/workspaces/workspace-a/review-tasks/review-task-a/decisions", {
      userId: "user-reviewer-a",
      body: { media_asset_version_id: "asset-version-a", decision: "rejected", decision_reason: "No" }
    });
    assert.equal(rejected.status, 201);

    const rejectedPublish = await server.request("POST", `/workspaces/workspace-a/approval-decisions/${rejected.body.data.approval_decision_id}/publish-jobs`, {
      userId: "user-publisher-a",
      headers: { "idempotency-key": "publish-rejected" },
      body: { media_asset_version_id: "asset-version-a", campaign_id: "campaign-a", channel: "manual" }
    });
    assert.equal(rejectedPublish.status, 409);
    assert.equal(rejectedPublish.body.code, "APPROVAL_NOT_APPROVED");

    const missingKey = await server.request("POST", "/workspaces/workspace-a/approval-decisions/approval-decision-a/publish-jobs", {
      userId: "user-publisher-a",
      body: { media_asset_version_id: "asset-version-a", campaign_id: "campaign-a", channel: "manual" }
    });
    assert.equal(missingKey.status, 400);
    assert.equal(missingKey.body.code, "IDEMPOTENCY_KEY_REQUIRED");

    const created = await server.request("POST", "/workspaces/workspace-a/approval-decisions/approval-decision-a/publish-jobs", {
      userId: "user-publisher-a",
      headers: { "idempotency-key": "publish-ok" },
      body: { media_asset_version_id: "asset-version-a", campaign_id: "campaign-a", channel: "manual" }
    });
    assert.equal(created.status, 201);

    const replay = await server.request("POST", "/workspaces/workspace-a/approval-decisions/approval-decision-a/publish-jobs", {
      userId: "user-publisher-a",
      headers: { "idempotency-key": "publish-ok" },
      body: { media_asset_version_id: "asset-version-a", campaign_id: "campaign-a", channel: "manual" }
    });
    assert.equal(replay.status, 201);
    assert.equal(replay.body.data.publish_job_id, created.body.data.publish_job_id);

    const conflict = await server.request("POST", "/workspaces/workspace-a/approval-decisions/approval-decision-a/publish-jobs", {
      userId: "user-publisher-a",
      headers: { "idempotency-key": "publish-ok" },
      body: { media_asset_version_id: "asset-version-a", campaign_id: "campaign-a", channel: "email" }
    });
    assert.equal(conflict.status, 409);
    assert.equal(conflict.body.code, "IDEMPOTENCY_CONFLICT");

    const get = await server.request("GET", `/workspaces/workspace-a/publish-jobs/${created.body.data.publish_job_id}`, {
      userId: "user-publisher-a"
    });
    assert.equal(get.status, 200);

    const status = await server.request("PATCH", `/workspaces/workspace-a/publish-jobs/${created.body.data.publish_job_id}/status`, {
      userId: "user-publisher-a",
      body: { publish_status: "submitted" }
    });
    assert.equal(status.status, 200);
    assert.equal(status.body.data.publish_status, "submitted");
  } finally {
    server.close();
  }
});

test("ManualPublishEvidence submit/list/get/invalidate/supersede protects proof fields", async () => {
  const server = await createTestServer();
  try {
    const denied = await server.request("POST", "/workspaces/workspace-a/publish-jobs/publish-job-a/manual-evidence", {
      userId: "user-viewer-a",
      body: { media_asset_version_id: "asset-version-a", content_hash: hashA }
    });
    assert.equal(denied.status, 403);

    const wrong = await server.request("POST", "/workspaces/workspace-a/publish-jobs/publish-job-a/manual-evidence", {
      userId: "user-publisher-a",
      body: { media_asset_version_id: "asset-version-a", content_hash: wrongHash }
    });
    assert.equal(wrong.status, 409);
    assert.equal(wrong.body.code, "EVIDENCE_HASH_MISMATCH");

    const submitted = await server.request("POST", "/workspaces/workspace-a/publish-jobs/publish-job-a/manual-evidence", {
      userId: "user-publisher-a",
      body: {
        media_asset_version_id: "asset-version-a",
        published_url: "manual-post-b",
        screenshot_ref: "screenshot-b",
        external_post_id: "external-b",
        content_hash: hashA
      }
    });
    assert.equal(submitted.status, 201);

    const invalidated = await server.request("POST", `/workspaces/workspace-a/manual-evidence/${submitted.body.data.manual_publish_evidence_id}/invalidate`, {
      userId: "user-publisher-a",
      body: { invalidated_reason: "Wrong URL" }
    });
    assert.equal(invalidated.status, 200);
    assert.equal(invalidated.body.data.evidence_status, "invalidated");
    assert.equal(invalidated.body.data.published_url, submitted.body.data.published_url);

    const missingReason = await server.request("POST", `/workspaces/workspace-a/manual-evidence/${submitted.body.data.manual_publish_evidence_id}/invalidate`, {
      userId: "user-publisher-a",
      body: {}
    });
    assert.equal(missingReason.status, 422);

    const superseded = await server.request("POST", `/workspaces/workspace-a/manual-evidence/${submitted.body.data.manual_publish_evidence_id}/supersede`, {
      userId: "user-publisher-a",
      body: {
        media_asset_version_id: "asset-version-a",
        published_url: "manual-post-c",
        screenshot_ref: "screenshot-c",
        external_post_id: "external-c",
        content_hash: hashA
      }
    });
    assert.equal(superseded.status, 201);
    assert.equal(superseded.body.data.supersedes_evidence_id, submitted.body.data.manual_publish_evidence_id);
    assert.notEqual(superseded.body.data.manual_publish_evidence_id, submitted.body.data.manual_publish_evidence_id);

    const patch = await server.request("PATCH", `/workspaces/workspace-a/manual-evidence/${submitted.body.data.manual_publish_evidence_id}`, {
      userId: "user-publisher-a",
      body: { published_url: "mutate" }
    });
    assert.equal(patch.status, 404);

    const del = await server.request("DELETE", `/workspaces/workspace-a/manual-evidence/${submitted.body.data.manual_publish_evidence_id}`, {
      userId: "user-publisher-a"
    });
    assert.equal(del.status, 404);
  } finally {
    server.close();
  }
});

test("Sprint 3 validation errors preserve unified ErrorModel", async () => {
  const server = await createTestServer();
  try {
    const response = await server.request("POST", "/workspaces/workspace-a/asset-versions/asset-version-a/review-tasks", {
      userId: "user-creator-a",
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
