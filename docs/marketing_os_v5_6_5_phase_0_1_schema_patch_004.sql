-- Marketing OS V5.6.5 — Phase 0/1 Schema Patch 004
-- Purpose: Add future DB-backed Nashir campaign persistence table.
-- Authority: docs/nashir_campaign_db_schema_patch_gate.md
-- Scope: Schema artifact only for Nashir campaign records.
-- Explicitly out of scope: migration runner activation, routes/runtime, repositories, runtime mode, OpenAPI, generated clients, UI, approval, publishing, readiness scoring, campaign update/delete routes, MVP, Pilot, Production.
-- Tenant isolation must still be enforced by runtime using route-derived workspace context.
-- Evidence relationships are intentionally not constrained here; any campaign/evidence foreign key decision requires separate approval.

BEGIN;

-- =========================================================
-- 1) ENUMS — PATCH 004 ONLY
-- =========================================================

DO $$ BEGIN CREATE TYPE nashir_campaign_status AS ENUM ('draft','generated','in_review','approved','rejected','archived','requires_reapproval','blocked_until_review','published'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- =========================================================
-- 2) NASHIR CAMPAIGN RECORDS
-- =========================================================
-- Patch 004 documents the future campaign persistence shape only.
-- It does not activate campaign DB runtime, implement a repository, or approve
-- campaign update/delete route behavior. updated_at is application-managed.

CREATE TABLE IF NOT EXISTS nashir_campaigns (
  nashir_campaign_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(workspace_id),
  campaign_name varchar(255) NOT NULL,
  campaign_status nashir_campaign_status NOT NULL DEFAULT 'draft',
  created_by_user_id uuid NOT NULL REFERENCES users(user_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_nashir_campaigns_id_workspace UNIQUE (nashir_campaign_id, workspace_id),
  CONSTRAINT chk_nashir_campaigns_name_not_empty CHECK (length(trim(campaign_name)) > 0)
);

CREATE INDEX IF NOT EXISTS idx_nashir_campaigns_workspace ON nashir_campaigns(workspace_id);
CREATE INDEX IF NOT EXISTS idx_nashir_campaigns_workspace_status ON nashir_campaigns(workspace_id, campaign_status);
CREATE INDEX IF NOT EXISTS idx_nashir_campaigns_created_by ON nashir_campaigns(workspace_id, created_by_user_id);

COMMIT;

-- End of Patch 004
