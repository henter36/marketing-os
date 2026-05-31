-- Marketing OS V5.6.5 — Phase 0/1 Schema Patch 010
-- Purpose: Nashir Creator Studio TTL-managed session and draft entities.
-- Authority: docs/nashir_sql_schema_implementation_planning_gate.md
-- Scope: Schema-only. All TTL entities require expires_at.
--        prompt_template_id FK references Patch 009 (nashir_prompt_templates).
--        410 Gone behavior is API/backend responsibility, not schema-only behavior.
-- Explicitly out of scope: raw prompt text storage beyond approved design, raw tokens,
--        destination service actor, routes/runtime, OpenAPI, generated clients, UI,
--        AI provider calls, external publishing, Pilot, Production.
-- IMPORTANT: Partial index predicates must not filter on a runtime clock comparison.
--            Use non-terminal status indexes instead for active TTL record queries.

BEGIN;

-- =========================================================
-- 1) ENUMS — PATCH 010 ONLY
-- =========================================================

DO $$ BEGIN CREATE TYPE nashir_cs_session_status AS ENUM ('active','completed','expired','abandoned'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE nashir_cs_idea_status AS ENUM ('draft','reviewing','approved','archived'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE nashir_cs_context_draft_status AS ENUM ('draft','active','expired','archived'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE nashir_cs_transfer_draft_status AS ENUM ('draft','pending_review','approved','rejected','expired'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE nashir_cs_readiness_status AS ENUM ('not_started','in_progress','ready','needs_attention','blocked'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE nashir_cs_campaign_angle_status AS ENUM ('draft','selected','archived'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE nashir_cs_audience_segment_status AS ENUM ('draft','active','archived'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE nashir_cs_publish_window_status AS ENUM ('draft','active','passed','archived'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- =========================================================
-- 2) NASHIR CREATOR STUDIO SESSIONS
-- =========================================================
-- TTL-managed workspace sessions for Creator Studio workflows.
-- expires_at is required; session management (expiry enforcement) is runtime responsibility.

CREATE TABLE IF NOT EXISTS nashir_creator_studio_sessions (
  session_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(workspace_id),
  nashir_campaign_id uuid,
  prompt_template_id uuid,
  session_status nashir_cs_session_status NOT NULL DEFAULT 'active',
  session_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  expires_at timestamptz NOT NULL,
  created_by_user_id uuid NOT NULL REFERENCES users(user_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_nashir_cs_session_id_workspace UNIQUE (session_id, workspace_id),
  CONSTRAINT chk_nashir_cs_session_expires_after_created CHECK (expires_at > created_at)
);

-- FK to prompt template from Patch 009 (must be applied after Patch 009). Guarded for idempotency.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'nashir_creator_studio_sessions'
      AND constraint_name = 'fk_nashir_cs_session_prompt_template'
  ) THEN
    ALTER TABLE nashir_creator_studio_sessions
      ADD CONSTRAINT fk_nashir_cs_session_prompt_template
      FOREIGN KEY (prompt_template_id, workspace_id)
      REFERENCES nashir_prompt_templates(prompt_template_id, workspace_id);
  END IF;
END $$;

-- FK to nashir_campaigns if campaign is associated (nullable; only enforced when non-NULL). Guarded.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'nashir_creator_studio_sessions'
      AND constraint_name = 'fk_nashir_cs_session_campaign_workspace'
  ) THEN
    ALTER TABLE nashir_creator_studio_sessions
      ADD CONSTRAINT fk_nashir_cs_session_campaign_workspace
      FOREIGN KEY (nashir_campaign_id, workspace_id)
      REFERENCES nashir_campaigns(nashir_campaign_id, workspace_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_nashir_cs_session_workspace ON nashir_creator_studio_sessions(workspace_id);
CREATE INDEX IF NOT EXISTS idx_nashir_cs_session_campaign ON nashir_creator_studio_sessions(nashir_campaign_id) WHERE nashir_campaign_id IS NOT NULL;
-- Non-terminal status index (uses status filter, not a clock-based predicate)
CREATE INDEX IF NOT EXISTS idx_nashir_cs_session_workspace_nonterminal
  ON nashir_creator_studio_sessions(workspace_id, expires_at)
  WHERE session_status NOT IN ('completed', 'expired', 'abandoned');

-- =========================================================
-- 3) NASHIR CREATOR CONTENT IDEAS
-- =========================================================
-- AI-assisted content idea drafts within a Creator Studio session.

CREATE TABLE IF NOT EXISTS nashir_creator_content_ideas (
  idea_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  session_id uuid NOT NULL,
  nashir_campaign_id uuid,
  idea_status nashir_cs_idea_status NOT NULL DEFAULT 'draft',
  idea_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  expires_at timestamptz NOT NULL,
  created_by_user_id uuid NOT NULL REFERENCES users(user_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_nashir_cs_idea_session_workspace FOREIGN KEY (session_id, workspace_id) REFERENCES nashir_creator_studio_sessions(session_id, workspace_id),
  CONSTRAINT uq_nashir_cs_idea_id_workspace UNIQUE (idea_id, workspace_id),
  CONSTRAINT chk_nashir_cs_idea_expires_after_created CHECK (expires_at > created_at)
);

CREATE INDEX IF NOT EXISTS idx_nashir_cs_idea_workspace ON nashir_creator_content_ideas(workspace_id);
CREATE INDEX IF NOT EXISTS idx_nashir_cs_idea_session ON nashir_creator_content_ideas(session_id);
-- Non-terminal status index
CREATE INDEX IF NOT EXISTS idx_nashir_cs_idea_workspace_nonterminal
  ON nashir_creator_content_ideas(workspace_id, expires_at)
  WHERE idea_status NOT IN ('approved', 'archived');

-- Workspace-scoped FK for optional campaign association (nullable; only enforced when non-NULL).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'nashir_creator_content_ideas'
      AND constraint_name = 'fk_nashir_cs_idea_campaign_workspace'
  ) THEN
    ALTER TABLE nashir_creator_content_ideas
      ADD CONSTRAINT fk_nashir_cs_idea_campaign_workspace
      FOREIGN KEY (nashir_campaign_id, workspace_id)
      REFERENCES nashir_campaigns(nashir_campaign_id, workspace_id);
  END IF;
END $$;

-- =========================================================
-- 4) NASHIR CREATOR CAMPAIGN ANGLES
-- =========================================================

CREATE TABLE IF NOT EXISTS nashir_creator_campaign_angles (
  angle_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  session_id uuid NOT NULL,
  nashir_campaign_id uuid,
  angle_status nashir_cs_campaign_angle_status NOT NULL DEFAULT 'draft',
  angle_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  expires_at timestamptz NOT NULL,
  created_by_user_id uuid NOT NULL REFERENCES users(user_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_nashir_cs_angle_session_workspace FOREIGN KEY (session_id, workspace_id) REFERENCES nashir_creator_studio_sessions(session_id, workspace_id),
  CONSTRAINT uq_nashir_cs_angle_id_workspace UNIQUE (angle_id, workspace_id),
  CONSTRAINT chk_nashir_cs_angle_expires_after_created CHECK (expires_at > created_at)
);

CREATE INDEX IF NOT EXISTS idx_nashir_cs_angle_workspace ON nashir_creator_campaign_angles(workspace_id);
CREATE INDEX IF NOT EXISTS idx_nashir_cs_angle_session ON nashir_creator_campaign_angles(session_id);
-- Non-terminal status index
CREATE INDEX IF NOT EXISTS idx_nashir_cs_angle_workspace_nonterminal
  ON nashir_creator_campaign_angles(workspace_id, expires_at)
  WHERE angle_status NOT IN ('selected', 'archived');

-- Workspace-scoped FK for optional campaign association (nullable; only enforced when non-NULL).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'nashir_creator_campaign_angles'
      AND constraint_name = 'fk_nashir_cs_angle_campaign_workspace'
  ) THEN
    ALTER TABLE nashir_creator_campaign_angles
      ADD CONSTRAINT fk_nashir_cs_angle_campaign_workspace
      FOREIGN KEY (nashir_campaign_id, workspace_id)
      REFERENCES nashir_campaigns(nashir_campaign_id, workspace_id);
  END IF;
END $$;

-- =========================================================
-- 5) NASHIR CREATOR AUDIENCE SEGMENTS
-- =========================================================

CREATE TABLE IF NOT EXISTS nashir_creator_audience_segments (
  segment_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  session_id uuid NOT NULL,
  segment_status nashir_cs_audience_segment_status NOT NULL DEFAULT 'draft',
  segment_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  expires_at timestamptz NOT NULL,
  created_by_user_id uuid NOT NULL REFERENCES users(user_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_nashir_cs_segment_session_workspace FOREIGN KEY (session_id, workspace_id) REFERENCES nashir_creator_studio_sessions(session_id, workspace_id),
  CONSTRAINT uq_nashir_cs_segment_id_workspace UNIQUE (segment_id, workspace_id),
  CONSTRAINT chk_nashir_cs_segment_expires_after_created CHECK (expires_at > created_at)
);

CREATE INDEX IF NOT EXISTS idx_nashir_cs_segment_workspace ON nashir_creator_audience_segments(workspace_id);
CREATE INDEX IF NOT EXISTS idx_nashir_cs_segment_session ON nashir_creator_audience_segments(session_id);
-- Non-terminal status index
CREATE INDEX IF NOT EXISTS idx_nashir_cs_segment_workspace_nonterminal
  ON nashir_creator_audience_segments(workspace_id, expires_at)
  WHERE segment_status NOT IN ('archived');

-- =========================================================
-- 6) NASHIR CREATOR PUBLISH WINDOWS
-- =========================================================

CREATE TABLE IF NOT EXISTS nashir_creator_publish_windows (
  publish_window_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  session_id uuid NOT NULL,
  nashir_campaign_id uuid,
  window_status nashir_cs_publish_window_status NOT NULL DEFAULT 'draft',
  window_start timestamptz,
  window_end timestamptz,
  window_notes text,
  expires_at timestamptz NOT NULL,
  created_by_user_id uuid NOT NULL REFERENCES users(user_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_nashir_cs_publish_window_session_workspace FOREIGN KEY (session_id, workspace_id) REFERENCES nashir_creator_studio_sessions(session_id, workspace_id),
  CONSTRAINT uq_nashir_cs_publish_window_id_workspace UNIQUE (publish_window_id, workspace_id),
  CONSTRAINT chk_nashir_cs_publish_window_expires_after_created CHECK (expires_at > created_at),
  CONSTRAINT chk_nashir_cs_publish_window_end_after_start
    CHECK (window_end IS NULL OR window_start IS NULL OR window_end > window_start)
);

CREATE INDEX IF NOT EXISTS idx_nashir_cs_publish_window_workspace ON nashir_creator_publish_windows(workspace_id);
CREATE INDEX IF NOT EXISTS idx_nashir_cs_publish_window_session ON nashir_creator_publish_windows(session_id);
-- Non-terminal status index
CREATE INDEX IF NOT EXISTS idx_nashir_cs_publish_window_workspace_nonterminal
  ON nashir_creator_publish_windows(workspace_id, expires_at)
  WHERE window_status NOT IN ('passed', 'archived');

-- Workspace-scoped FK for optional campaign association (nullable; only enforced when non-NULL).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'nashir_creator_publish_windows'
      AND constraint_name = 'fk_nashir_cs_publish_window_campaign_workspace'
  ) THEN
    ALTER TABLE nashir_creator_publish_windows
      ADD CONSTRAINT fk_nashir_cs_publish_window_campaign_workspace
      FOREIGN KEY (nashir_campaign_id, workspace_id)
      REFERENCES nashir_campaigns(nashir_campaign_id, workspace_id);
  END IF;
END $$;

-- =========================================================
-- 7) NASHIR CREATOR CONTEXT DRAFTS
-- =========================================================
-- Working context drafts used by the Creator Studio session.

CREATE TABLE IF NOT EXISTS nashir_creator_context_drafts (
  context_draft_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  session_id uuid NOT NULL,
  context_draft_status nashir_cs_context_draft_status NOT NULL DEFAULT 'draft',
  context_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  expires_at timestamptz NOT NULL,
  created_by_user_id uuid NOT NULL REFERENCES users(user_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_nashir_cs_context_draft_session_workspace FOREIGN KEY (session_id, workspace_id) REFERENCES nashir_creator_studio_sessions(session_id, workspace_id),
  CONSTRAINT uq_nashir_cs_context_draft_id_workspace UNIQUE (context_draft_id, workspace_id),
  CONSTRAINT chk_nashir_cs_context_draft_expires_after_created CHECK (expires_at > created_at)
);

CREATE INDEX IF NOT EXISTS idx_nashir_cs_context_draft_workspace ON nashir_creator_context_drafts(workspace_id);
CREATE INDEX IF NOT EXISTS idx_nashir_cs_context_draft_session ON nashir_creator_context_drafts(session_id);
-- Non-terminal status index
CREATE INDEX IF NOT EXISTS idx_nashir_cs_context_draft_workspace_nonterminal
  ON nashir_creator_context_drafts(workspace_id, expires_at)
  WHERE context_draft_status NOT IN ('expired', 'archived');

-- =========================================================
-- 8) NASHIR CREATOR TRANSFER DRAFTS
-- =========================================================
-- Transfer drafts represent prepared content ready to move into the campaign pipeline.
-- pending_review status is explicitly included for review workflows before approval.
-- 410 Gone behavior for expired drafts is a runtime/API responsibility.

CREATE TABLE IF NOT EXISTS nashir_creator_transfer_drafts (
  transfer_draft_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  session_id uuid NOT NULL,
  nashir_campaign_id uuid,
  prompt_template_id uuid,
  draft_status nashir_cs_transfer_draft_status NOT NULL DEFAULT 'draft',
  draft_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  expires_at timestamptz NOT NULL,
  submitted_for_review_at timestamptz,
  created_by_user_id uuid NOT NULL REFERENCES users(user_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_nashir_cs_transfer_draft_session_workspace FOREIGN KEY (session_id, workspace_id) REFERENCES nashir_creator_studio_sessions(session_id, workspace_id),
  CONSTRAINT uq_nashir_cs_transfer_draft_id_workspace UNIQUE (transfer_draft_id, workspace_id),
  CONSTRAINT chk_nashir_cs_transfer_draft_expires_after_created CHECK (expires_at > created_at),
  CONSTRAINT chk_nashir_cs_transfer_draft_review_at_status
    CHECK (submitted_for_review_at IS NULL OR draft_status IN ('pending_review', 'approved', 'rejected'))
);

-- FK to prompt template from Patch 009. Guarded for idempotency.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'nashir_creator_transfer_drafts'
      AND constraint_name = 'fk_nashir_cs_transfer_draft_prompt_template'
  ) THEN
    ALTER TABLE nashir_creator_transfer_drafts
      ADD CONSTRAINT fk_nashir_cs_transfer_draft_prompt_template
      FOREIGN KEY (prompt_template_id, workspace_id)
      REFERENCES nashir_prompt_templates(prompt_template_id, workspace_id);
  END IF;
END $$;

-- FK to nashir_campaigns if associated (nullable; only enforced when non-NULL). Guarded.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'nashir_creator_transfer_drafts'
      AND constraint_name = 'fk_nashir_cs_transfer_draft_campaign_workspace'
  ) THEN
    ALTER TABLE nashir_creator_transfer_drafts
      ADD CONSTRAINT fk_nashir_cs_transfer_draft_campaign_workspace
      FOREIGN KEY (nashir_campaign_id, workspace_id)
      REFERENCES nashir_campaigns(nashir_campaign_id, workspace_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_nashir_cs_transfer_draft_workspace ON nashir_creator_transfer_drafts(workspace_id);
CREATE INDEX IF NOT EXISTS idx_nashir_cs_transfer_draft_session ON nashir_creator_transfer_drafts(session_id);
CREATE INDEX IF NOT EXISTS idx_nashir_cs_transfer_draft_campaign ON nashir_creator_transfer_drafts(nashir_campaign_id) WHERE nashir_campaign_id IS NOT NULL;
-- Non-terminal status index (pending_review is non-terminal)
CREATE INDEX IF NOT EXISTS idx_nashir_cs_transfer_draft_workspace_nonterminal
  ON nashir_creator_transfer_drafts(workspace_id, expires_at)
  WHERE draft_status NOT IN ('approved', 'rejected', 'expired');

-- =========================================================
-- 9) NASHIR CREATOR READINESS ASSESSMENTS
-- =========================================================

CREATE TABLE IF NOT EXISTS nashir_creator_readiness_assessments (
  readiness_assessment_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  session_id uuid NOT NULL,
  nashir_campaign_id uuid,
  readiness_status nashir_cs_readiness_status NOT NULL DEFAULT 'not_started',
  assessment_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  expires_at timestamptz NOT NULL,
  created_by_user_id uuid NOT NULL REFERENCES users(user_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_nashir_cs_readiness_session_workspace FOREIGN KEY (session_id, workspace_id) REFERENCES nashir_creator_studio_sessions(session_id, workspace_id),
  CONSTRAINT uq_nashir_cs_readiness_id_workspace UNIQUE (readiness_assessment_id, workspace_id),
  CONSTRAINT chk_nashir_cs_readiness_expires_after_created CHECK (expires_at > created_at)
);

CREATE INDEX IF NOT EXISTS idx_nashir_cs_readiness_workspace ON nashir_creator_readiness_assessments(workspace_id);
CREATE INDEX IF NOT EXISTS idx_nashir_cs_readiness_session ON nashir_creator_readiness_assessments(session_id);
-- Non-terminal status index
CREATE INDEX IF NOT EXISTS idx_nashir_cs_readiness_workspace_nonterminal
  ON nashir_creator_readiness_assessments(workspace_id, expires_at)
  WHERE readiness_status NOT IN ('ready', 'blocked');

-- Workspace-scoped FK for optional campaign association (nullable; only enforced when non-NULL).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'nashir_creator_readiness_assessments'
      AND constraint_name = 'fk_nashir_cs_readiness_campaign_workspace'
  ) THEN
    ALTER TABLE nashir_creator_readiness_assessments
      ADD CONSTRAINT fk_nashir_cs_readiness_campaign_workspace
      FOREIGN KEY (nashir_campaign_id, workspace_id)
      REFERENCES nashir_campaigns(nashir_campaign_id, workspace_id);
  END IF;
END $$;

COMMIT;

-- End of Patch 010
