const assert = require("node:assert/strict");
const test = require("node:test");
const { hasPermission, permissions, roles } = require("../src/rbac");
const {
  applyApprovalDecision,
  protectManualPublishEvidenceUpdate,
  validateApprovalDecision
} = require("../src/integrity");

test("RBAC seed includes Sprint 0 required roles and OpenAPI permissions", () => {
  const roleCodes = roles.map((role) => role.role_code);
  assert.deepEqual(roleCodes, ["owner", "admin", "creator", "reviewer", "publisher", "billing_admin", "viewer"]);

  for (const permission of ["workspace.read", "workspace.manage_members", "rbac.read", "campaign.write", "approval.decide"]) {
    assert.ok(permissions.some((candidate) => candidate.permission_code === permission));
  }
});

test("RBAC denies viewer writes and billing admin campaign edits", () => {
  assert.equal(hasPermission("viewer", "campaign.write"), false);
  assert.equal(hasPermission("billing_admin", "campaign.write"), false);
  assert.equal(hasPermission("creator", "campaign.write"), true);
  assert.equal(hasPermission("reviewer", "approval.decide"), true);
  assert.equal(hasPermission("publisher", "approval.decide"), false);
});

test("ApprovalDecision validates review task version and matching content hash", () => {
  const reviewTask = {
    review_task_id: "review-task-a",
    workspace_id: "workspace-a",
    media_asset_version_id: "asset-version-a"
  };
  const mediaAssetVersion = {
    media_asset_version_id: "asset-version-a",
    workspace_id: "workspace-a",
    content_hash: "a".repeat(64),
    version_status: "in_review"
  };

  const decision = validateApprovalDecision({
    reviewTask,
    mediaAssetVersion,
    decision: { decision: "approved", approved_content_hash: "a".repeat(64) }
  });

  const updated = applyApprovalDecision(mediaAssetVersion, decision);
  assert.equal(updated.version_status, "approved");
});

test("ApprovalDecision rejects missing or mismatched approved hash", () => {
  const reviewTask = {
    review_task_id: "review-task-a",
    workspace_id: "workspace-a",
    media_asset_version_id: "asset-version-a"
  };
  const mediaAssetVersion = {
    media_asset_version_id: "asset-version-a",
    workspace_id: "workspace-a",
    content_hash: "a".repeat(64)
  };

  assert.throws(
    () => validateApprovalDecision({ reviewTask, mediaAssetVersion, decision: { decision: "approved" } }),
    /approved_content_hash is required/
  );
  assert.throws(
    () =>
      validateApprovalDecision({
        reviewTask,
        mediaAssetVersion,
        decision: { decision: "approved", approved_content_hash: "b".repeat(64) }
      }),
    /does not match/
  );
});

test("ManualPublishEvidence protection allows only limited invalidation", () => {
  const evidence = {
    manual_publish_evidence_id: "evidence-a",
    workspace_id: "workspace-a",
    publish_job_id: "publish-job-a",
    media_asset_version_id: "asset-version-a",
    published_url: "https://example.com/post",
    screenshot_ref: "s3://proof",
    external_post_id: "external-a",
    content_hash: "a".repeat(64),
    evidence_status: "valid",
    supersedes_evidence_id: null,
    submitted_by_user_id: "user-publisher-a",
    submitted_at: "2026-04-27T00:00:00.000Z",
    created_at: "2026-04-27T00:00:00.000Z"
  };

  const invalidated = protectManualPublishEvidenceUpdate(evidence, {
    ...evidence,
    evidence_status: "invalidated",
    invalidated_reason: "Incorrect URL"
  });
  assert.equal(invalidated.evidence_status, "invalidated");

  assert.throws(
    () => protectManualPublishEvidenceUpdate(evidence, { ...evidence, published_url: "https://changed.example.com" }),
    /proof fields are immutable/
  );
});
