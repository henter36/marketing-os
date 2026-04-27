const { AppError } = require("./error-model");

function validateApprovalDecision({ reviewTask, mediaAssetVersion, decision }) {
  if (!reviewTask || !mediaAssetVersion) {
    throw new AppError(404, "NOT_FOUND", "Review task or media asset version was not found.", "Refresh and try again.");
  }

  if (reviewTask.workspace_id !== mediaAssetVersion.workspace_id) {
    throw new AppError(409, "TENANT_CONTEXT_MISMATCH", "Review task and media asset version are in different workspaces.", "Use records from the same workspace.");
  }

  if (reviewTask.media_asset_version_id !== mediaAssetVersion.media_asset_version_id) {
    throw new AppError(409, "REVIEW_TASK_VERSION_MISMATCH", "Review task does not match the requested media asset version.", "Approve the version assigned to the review task.");
  }

  if (decision.decision === "approved" && !decision.approved_content_hash) {
    throw new AppError(422, "APPROVAL_HASH_REQUIRED", "approved_content_hash is required for approved decisions.", "Send the exact content hash for the asset version.");
  }

  if (decision.decision === "approved" && decision.approved_content_hash !== mediaAssetVersion.content_hash) {
    throw new AppError(409, "APPROVAL_HASH_MISMATCH", "approved_content_hash does not match the media asset version.", "Re-read the asset version and submit the matching hash.");
  }

  return {
    ...decision,
    workspace_id: reviewTask.workspace_id,
    review_task_id: reviewTask.review_task_id,
    media_asset_version_id: mediaAssetVersion.media_asset_version_id
  };
}

function applyApprovalDecision(mediaAssetVersion, decision) {
  if (decision.decision !== "approved") {
    return mediaAssetVersion;
  }

  return {
    ...mediaAssetVersion,
    version_status: "approved"
  };
}

function protectManualPublishEvidenceUpdate(oldEvidence, newEvidence) {
  const allowed = new Set(["evidence_status", "invalidated_reason"]);

  for (const key of Object.keys(newEvidence)) {
    if (!allowed.has(key) && newEvidence[key] !== oldEvidence[key]) {
      throw new AppError(
        409,
        "EVIDENCE_APPEND_ONLY",
        "ManualPublishEvidence proof fields are immutable.",
        "Use supersede for new proof, or invalidate with a reason."
      );
    }
  }

  if (newEvidence.evidence_status !== oldEvidence.evidence_status && newEvidence.evidence_status !== "invalidated") {
    throw new AppError(409, "EVIDENCE_APPEND_ONLY", "ManualPublishEvidence status may only transition to invalidated.", "Use a supported invalidation action.");
  }

  if (newEvidence.evidence_status === "invalidated" && !String(newEvidence.invalidated_reason || "").trim()) {
    throw new AppError(422, "VALIDATION_FAILED", "invalidated_reason is required.", "Provide a reason for invalidation.");
  }

  return {
    ...oldEvidence,
    evidence_status: newEvidence.evidence_status,
    invalidated_reason: newEvidence.invalidated_reason
  };
}

module.exports = {
  applyApprovalDecision,
  protectManualPublishEvidenceUpdate,
  validateApprovalDecision
};
