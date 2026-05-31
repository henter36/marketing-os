-- Marketing OS V5.6.5 — Phase 0/1 Schema Patch 007
-- Purpose: Nashir campaign content items, content-asset junction, preview artifacts,
--          and content review decisions (normalized schema).
-- Authority: docs/nashir_sql_schema_implementation_planning_gate.md
-- Scope: Schema-only. No routes, runtime, OpenAPI, generated clients, UI,
--        automatic publishing, Pilot, or Production readiness.
-- Self-approval denial is representable via content_actor_user_id vs reviewer_user_id fields;
-- backend enforcement of self-approval policy remains a runtime responsibility.
-- nashir_campaign_content_assets uses composite PK (campaign_content_id, asset_id).
-- No typed-array FK columns; all FK-like associations use proper FK constraints.

BEGIN;

-- =========================================================
-- 1) ENUMS — PATCH 007 ONLY
-- =========================================================

DO $$ BEGIN CREATE TYPE nashir_content_item_status AS ENUM ('draft','in_review','approved','rejected','archived','requires_reapproval'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE nashir_content_review_status AS ENUM ('pending','approved','rejected','changes_requested','withdrawn'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE nashir_preview_artifact_status AS ENUM ('active','superseded','archived'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- =========================================================
-- 2) NASHIR CAMPAIGN CONTENT ITEMS
-- =========================================================
-- Represents individual content pieces (copy, image brief, video script, etc.)
-- linked to a Nashir campaign. updated_at is application-managed.

CREATE TABLE IF NOT EXISTS nashir_campaign_content_items (
  campaign_content_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  nashir_campaign_id uuid NOT NULL,
  content_type varchar(120) NOT NULL,
  content_status nashir_content_item_status NOT NULL DEFAULT 'draft',
  content_body text,
  content_hash char(64),
  created_by_user_id uuid NOT NULL REFERENCES users(user_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_nashir_content_items_campaign_workspace FOREIGN KEY (nashir_campaign_id, workspace_id) REFERENCES nashir_campaigns(nashir_campaign_id, workspace_id),
  CONSTRAINT uq_nashir_content_items_id_workspace UNIQUE (campaign_content_id, workspace_id),
  CONSTRAINT uq_nashir_content_items_id_campaign_workspace UNIQUE (campaign_content_id, nashir_campaign_id, workspace_id),
  CONSTRAINT chk_nashir_content_items_type_not_empty CHECK (length(trim(content_type)) > 0)
);

CREATE INDEX IF NOT EXISTS idx_nashir_content_items_workspace ON nashir_campaign_content_items(workspace_id);
CREATE INDEX IF NOT EXISTS idx_nashir_content_items_campaign ON nashir_campaign_content_items(nashir_campaign_id);
CREATE INDEX IF NOT EXISTS idx_nashir_content_items_workspace_status ON nashir_campaign_content_items(workspace_id, content_status);
CREATE INDEX IF NOT EXISTS idx_nashir_content_items_created_by ON nashir_campaign_content_items(workspace_id, created_by_user_id);

-- =========================================================
-- 3) NASHIR CAMPAIGN CONTENT ASSETS (COMPOSITE PK)
-- =========================================================
-- Junction table linking content items to assets.
-- Uses composite PRIMARY KEY (campaign_content_id, asset_id) — no typed-array columns.
-- workspace_id included for tenant isolation enforcement at the join layer.

CREATE TABLE IF NOT EXISTS nashir_campaign_content_assets (
  campaign_content_id uuid NOT NULL,
  asset_id uuid NOT NULL,
  workspace_id uuid NOT NULL,
  linked_at timestamptz NOT NULL DEFAULT now(),
  linked_by_user_id uuid NOT NULL REFERENCES users(user_id),
  PRIMARY KEY (campaign_content_id, asset_id),
  CONSTRAINT fk_nashir_content_assets_content_workspace FOREIGN KEY (campaign_content_id, workspace_id) REFERENCES nashir_campaign_content_items(campaign_content_id, workspace_id),
  CONSTRAINT fk_nashir_content_assets_asset_workspace FOREIGN KEY (asset_id, workspace_id) REFERENCES nashir_assets(asset_id, workspace_id)
);

CREATE INDEX IF NOT EXISTS idx_nashir_content_assets_workspace ON nashir_campaign_content_assets(workspace_id);
CREATE INDEX IF NOT EXISTS idx_nashir_content_assets_asset ON nashir_campaign_content_assets(asset_id);

-- =========================================================
-- 4) NASHIR PREVIEW ARTIFACTS
-- =========================================================
-- Stores rendered preview outputs for content items.
-- No typed-array asset_ids column; each artifact references one content item via FK.
-- Multiple artifacts per content item are each their own row.

CREATE TABLE IF NOT EXISTS nashir_preview_artifacts (
  preview_artifact_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  campaign_content_id uuid NOT NULL,
  artifact_type varchar(120) NOT NULL,
  artifact_payload jsonb NOT NULL,
  preview_status nashir_preview_artifact_status NOT NULL DEFAULT 'active',
  generated_at timestamptz NOT NULL DEFAULT now(),
  created_by_user_id uuid NOT NULL REFERENCES users(user_id),
  CONSTRAINT fk_nashir_preview_artifacts_content_workspace FOREIGN KEY (campaign_content_id, workspace_id) REFERENCES nashir_campaign_content_items(campaign_content_id, workspace_id),
  CONSTRAINT uq_nashir_preview_artifacts_id_workspace UNIQUE (preview_artifact_id, workspace_id),
  CONSTRAINT chk_nashir_preview_artifacts_type_not_empty CHECK (length(trim(artifact_type)) > 0)
);

CREATE INDEX IF NOT EXISTS idx_nashir_preview_artifacts_workspace ON nashir_preview_artifacts(workspace_id);
CREATE INDEX IF NOT EXISTS idx_nashir_preview_artifacts_content ON nashir_preview_artifacts(campaign_content_id);
CREATE INDEX IF NOT EXISTS idx_nashir_preview_artifacts_workspace_status ON nashir_preview_artifacts(workspace_id, preview_status);

-- =========================================================
-- 5) NASHIR CONTENT REVIEW DECISIONS
-- =========================================================
-- Human approval/rejection decisions for Nashir content items.
-- content_actor_user_id records who created the content; reviewer_user_id
-- records who decided — enabling self-approval denial enforcement at runtime.
-- The CHECK constraint prevents the same user from deciding on their own content
-- when content_actor_user_id is known. Append-only (no UPDATE trigger needed here;
-- runtime must treat review records as immutable).

CREATE TABLE IF NOT EXISTS nashir_content_review_decisions (
  review_decision_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  nashir_campaign_id uuid NOT NULL,
  campaign_content_id uuid NOT NULL,
  decision_status nashir_content_review_status NOT NULL,
  content_version_hash char(64),
  decision_reason text,
  reviewer_user_id uuid NOT NULL REFERENCES users(user_id),
  content_actor_user_id uuid REFERENCES users(user_id),
  decided_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_nashir_content_review_campaign_workspace FOREIGN KEY (nashir_campaign_id, workspace_id) REFERENCES nashir_campaigns(nashir_campaign_id, workspace_id),
  CONSTRAINT fk_nashir_content_review_content_campaign_workspace FOREIGN KEY (campaign_content_id, nashir_campaign_id, workspace_id) REFERENCES nashir_campaign_content_items(campaign_content_id, nashir_campaign_id, workspace_id),
  CONSTRAINT uq_nashir_content_review_id_workspace UNIQUE (review_decision_id, workspace_id),
  CONSTRAINT chk_nashir_content_review_no_self_approval
    CHECK (content_actor_user_id IS NULL OR reviewer_user_id <> content_actor_user_id),
  CONSTRAINT chk_nashir_content_review_rejection_reason
    CHECK (decision_status <> 'rejected'::nashir_content_review_status OR length(trim(coalesce(decision_reason, ''))) > 0)
);

CREATE INDEX IF NOT EXISTS idx_nashir_content_review_workspace ON nashir_content_review_decisions(workspace_id);
CREATE INDEX IF NOT EXISTS idx_nashir_content_review_campaign ON nashir_content_review_decisions(nashir_campaign_id);
CREATE INDEX IF NOT EXISTS idx_nashir_content_review_content ON nashir_content_review_decisions(campaign_content_id);
CREATE INDEX IF NOT EXISTS idx_nashir_content_review_workspace_status ON nashir_content_review_decisions(workspace_id, decision_status);
CREATE INDEX IF NOT EXISTS idx_nashir_content_review_reviewer ON nashir_content_review_decisions(workspace_id, reviewer_user_id);

COMMIT;

-- End of Patch 007
