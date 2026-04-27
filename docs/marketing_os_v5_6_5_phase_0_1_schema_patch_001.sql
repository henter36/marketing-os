-- Marketing OS V5.6.5 — Phase 0/1 Schema Patch 001
-- Purpose: Resolve pre-Sprint-0 contract conflicts discovered after reviewing ERD/SQL/OpenAPI/Backlog/QA.
-- Authority: This patch supersedes conflicting behavior in docs/marketing_os_v5_6_5_phase_0_1_schema.sql.
-- Scope: No new product capability. Only approval-flow and manual-evidence invalidation corrections.

BEGIN;

-- =========================================================
-- PATCH 001-A
-- ApprovalDecision must approve MediaAssetVersion through a safe trigger.
-- Previous conflict:
--   validate_approval_decision_integrity required MediaAssetVersion.version_status='approved'
--   before an approval decision could be created.
-- Corrected behavior:
--   1. Validate ReviewTask ↔ MediaAssetVersion match.
--   2. Validate approved_content_hash equals MediaAssetVersion.content_hash.
--   3. When decision='approved', safely set MediaAssetVersion.version_status='approved'.
--   4. Do not require the version to already be approved.
-- =========================================================

CREATE OR REPLACE FUNCTION validate_approval_decision_integrity()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  v_content_hash char(64);
  v_review_asset_version_id uuid;
BEGIN
  SELECT media_asset_version_id
    INTO v_review_asset_version_id
  FROM review_tasks
  WHERE review_task_id = NEW.review_task_id
    AND workspace_id = NEW.workspace_id;

  IF v_review_asset_version_id IS NULL THEN
    RAISE EXCEPTION 'ReviewTask % not found in workspace %', NEW.review_task_id, NEW.workspace_id;
  END IF;

  IF v_review_asset_version_id IS DISTINCT FROM NEW.media_asset_version_id THEN
    RAISE EXCEPTION 'ApprovalDecision review_task_id does not match media_asset_version_id';
  END IF;

  SELECT content_hash
    INTO v_content_hash
  FROM media_asset_versions
  WHERE media_asset_version_id = NEW.media_asset_version_id
    AND workspace_id = NEW.workspace_id;

  IF v_content_hash IS NULL THEN
    RAISE EXCEPTION 'MediaAssetVersion % not found in workspace %', NEW.media_asset_version_id, NEW.workspace_id;
  END IF;

  IF NEW.decision = 'approved' THEN
    IF NEW.approved_content_hash IS NULL THEN
      RAISE EXCEPTION 'approved_content_hash is required for approved decision';
    END IF;

    IF NEW.approved_content_hash IS DISTINCT FROM v_content_hash THEN
      RAISE EXCEPTION 'approved_content_hash does not match MediaAssetVersion.content_hash';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION apply_approval_decision_effects()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.decision = 'approved' THEN
    UPDATE media_asset_versions
       SET version_status = 'approved'::media_asset_version_status
     WHERE media_asset_version_id = NEW.media_asset_version_id
       AND workspace_id = NEW.workspace_id
       AND version_status IS DISTINCT FROM 'approved'::media_asset_version_status;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_apply_approval_decision_effects ON approval_decisions;
CREATE TRIGGER trg_apply_approval_decision_effects
AFTER INSERT ON approval_decisions
FOR EACH ROW EXECUTE FUNCTION apply_approval_decision_effects();

-- =========================================================
-- PATCH 001-B
-- Approved MediaAssetVersion remains content-immutable, but approval trigger may set status to approved.
-- Previous conflict:
--   prevent_approved_asset_version_update blocked every update when OLD.version_status='approved'.
-- Corrected behavior:
--   - content fields remain immutable via trg_media_asset_versions_immutable.
--   - version_status may transition to approved.
--   - once approved, status cannot move away from approved.
-- =========================================================

CREATE OR REPLACE FUNCTION prevent_approved_asset_version_update()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF OLD.version_status = 'approved'::media_asset_version_status
     AND NEW.version_status IS DISTINCT FROM OLD.version_status THEN
    RAISE EXCEPTION 'Approved MediaAssetVersion status cannot be changed away from approved';
  END IF;

  RETURN NEW;
END;
$$;

-- =========================================================
-- PATCH 001-C
-- ManualPublishEvidence invalidate must be allowed as a limited state correction.
-- Previous conflict:
--   manual_publish_evidence was fully append-only, blocking invalidate endpoint.
-- Corrected behavior:
--   - UPDATE is allowed only for evidence_status and invalidated_reason.
--   - status can move to invalidated.
--   - content and proof fields remain immutable.
--   - DELETE remains forbidden.
-- =========================================================

DROP TRIGGER IF EXISTS trg_manual_publish_evidence_append_only ON manual_publish_evidence;

CREATE OR REPLACE FUNCTION protect_manual_publish_evidence_update()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    RAISE EXCEPTION 'ManualPublishEvidence is protected; DELETE is not allowed';
  END IF;

  -- Immutable ownership and proof fields
  IF NEW.manual_publish_evidence_id IS DISTINCT FROM OLD.manual_publish_evidence_id
     OR NEW.workspace_id IS DISTINCT FROM OLD.workspace_id
     OR NEW.publish_job_id IS DISTINCT FROM OLD.publish_job_id
     OR NEW.media_asset_version_id IS DISTINCT FROM OLD.media_asset_version_id
     OR NEW.published_url IS DISTINCT FROM OLD.published_url
     OR NEW.screenshot_ref IS DISTINCT FROM OLD.screenshot_ref
     OR NEW.external_post_id IS DISTINCT FROM OLD.external_post_id
     OR NEW.content_hash IS DISTINCT FROM OLD.content_hash
     OR NEW.supersedes_evidence_id IS DISTINCT FROM OLD.supersedes_evidence_id
     OR NEW.submitted_by_user_id IS DISTINCT FROM OLD.submitted_by_user_id
     OR NEW.submitted_at IS DISTINCT FROM OLD.submitted_at
     OR NEW.created_at IS DISTINCT FROM OLD.created_at THEN
    RAISE EXCEPTION 'ManualPublishEvidence proof fields are immutable; only evidence_status and invalidated_reason may change';
  END IF;

  -- Allowed limited invalidation transition
  IF NEW.evidence_status IS DISTINCT FROM OLD.evidence_status THEN
    IF NEW.evidence_status <> 'invalidated'::evidence_status THEN
      RAISE EXCEPTION 'ManualPublishEvidence status may only transition to invalidated through this update path';
    END IF;

    IF NEW.invalidated_reason IS NULL OR length(trim(NEW.invalidated_reason)) = 0 THEN
      RAISE EXCEPTION 'invalidated_reason is required when invalidating ManualPublishEvidence';
    END IF;
  END IF;

  -- invalidated_reason cannot be changed unless the status is or becomes invalidated
  IF NEW.invalidated_reason IS DISTINCT FROM OLD.invalidated_reason
     AND NEW.evidence_status <> 'invalidated'::evidence_status THEN
    RAISE EXCEPTION 'invalidated_reason can only be changed when evidence_status is invalidated';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_manual_publish_evidence_protect_update ON manual_publish_evidence;
CREATE TRIGGER trg_manual_publish_evidence_protect_update
BEFORE UPDATE OR DELETE ON manual_publish_evidence
FOR EACH ROW EXECUTE FUNCTION protect_manual_publish_evidence_update();

COMMIT;

-- End of Patch 001
