const base = require("./store");

function createSeedStore() {
  const store = base.createSeedStore();
  store.idempotencyRecords ||= [];
  store.reviewTasks ||= [];
  store.approvalDecisions ||= [];
  store.publishJobs ||= [];
  store.manualPublishEvidence ||= [];

  const versionA = store.mediaAssetVersions?.find((candidate) => candidate.media_asset_version_id === "asset-version-a");
  if (versionA) {
    versionA.content_hash = "c".repeat(64);
    versionA.version_status = "approved";
  }

  if (!store.reviewTasks.some((task) => task.review_task_id === "review-task-a")) {
    store.reviewTasks.push({
      review_task_id: "review-task-a",
      workspace_id: "workspace-a",
      media_asset_version_id: "asset-version-a",
      assigned_to_user_id: "user-reviewer-a",
      review_status: "completed",
      review_type: "final",
      due_at: null
    });
  }

  if (!store.approvalDecisions.some((decision) => decision.approval_decision_id === "approval-decision-a")) {
    store.approvalDecisions.push({
      approval_decision_id: "approval-decision-a",
      workspace_id: "workspace-a",
      review_task_id: "review-task-a",
      media_asset_version_id: "asset-version-a",
      decision: "approved",
      approved_content_hash: "c".repeat(64),
      decision_reason: "Seed approval",
      decided_at: "2026-04-27T00:00:00.000Z"
    });
  }

  if (!store.publishJobs.some((job) => job.publish_job_id === "publish-job-a")) {
    store.publishJobs.push({
      publish_job_id: "publish-job-a",
      workspace_id: "workspace-a",
      customer_account_id: "customer-a",
      approval_decision_id: "approval-decision-a",
      media_asset_version_id: "asset-version-a",
      campaign_id: "campaign-a",
      channel: "manual",
      publish_status: "draft",
      scheduled_at: null,
      published_at: null,
      idempotency_key: "seed-publish-job-a"
    });
  }

  if (!store.manualPublishEvidence.some((evidence) => evidence.manual_publish_evidence_id === "manual-evidence-a")) {
    store.manualPublishEvidence.push({
      manual_publish_evidence_id: "manual-evidence-a",
      workspace_id: "workspace-a",
      publish_job_id: "publish-job-a",
      media_asset_version_id: "asset-version-a",
      published_url: "manual-post-a",
      screenshot_ref: "screenshot-a",
      external_post_id: "external-a",
      content_hash: "c".repeat(64),
      evidence_status: "valid",
      invalidated_reason: null,
      supersedes_evidence_id: null,
      submitted_by_user_id: "user-publisher-a",
      submitted_at: "2026-04-27T00:00:00.000Z"
    });
  }

  return store;
}

module.exports = { createSeedStore };
