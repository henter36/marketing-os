-- Marketing OS V5.6.5 — Phase 0/1 Schema Patch 008
-- Purpose: Nashir publishing queue schema.
-- Authority: docs/nashir_sql_schema_implementation_planning_gate.md
-- Scope: Schema-only for publishing queue items. References approved content only.
--        Supports human confirmation and evidence/audit requirements.
-- Explicitly out of scope: external platform publishing implementation, posting
--        automation, social OAuth, scheduling execution, paid execution, runtime
--        publishing behavior, OpenAPI, generated clients, UI, Pilot, Production.
-- Human confirmation is tracked via human_confirmed_at / human_confirmed_by_user_id.
-- No external platform publishing is implemented by this schema.

BEGIN;

-- =========================================================
-- 1) ENUMS — PATCH 008 ONLY
-- =========================================================

DO $$ BEGIN CREATE TYPE nashir_publish_queue_status AS ENUM ('pending_confirmation','confirmed','published','failed','canceled','superseded'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- =========================================================
-- 2) NASHIR PUBLISHING QUEUE ITEMS
-- =========================================================
-- Each item references an approved content review decision (confirming the content
-- was approved before being queued for publishing).
-- human_confirmed_at must be set before any external publishing action (runtime enforcement).
-- destination_channel is advisory; no external posting is implemented here.

CREATE TABLE IF NOT EXISTS nashir_publishing_queue_items (
  publish_queue_item_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  nashir_campaign_id uuid NOT NULL,
  campaign_content_id uuid NOT NULL,
  review_decision_id uuid NOT NULL,
  queue_status nashir_publish_queue_status NOT NULL DEFAULT 'pending_confirmation',
  human_confirmed_at timestamptz,
  human_confirmed_by_user_id uuid REFERENCES users(user_id),
  scheduled_at timestamptz,
  published_at timestamptz,
  destination_channel varchar(120),
  idempotency_key varchar(180) NOT NULL,
  created_by_user_id uuid NOT NULL REFERENCES users(user_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_nashir_publish_queue_campaign_workspace FOREIGN KEY (nashir_campaign_id, workspace_id) REFERENCES nashir_campaigns(nashir_campaign_id, workspace_id),
  CONSTRAINT fk_nashir_publish_queue_content_campaign_workspace FOREIGN KEY (campaign_content_id, nashir_campaign_id, workspace_id) REFERENCES nashir_campaign_content_items(campaign_content_id, nashir_campaign_id, workspace_id),
  CONSTRAINT fk_nashir_publish_queue_review_workspace FOREIGN KEY (review_decision_id, workspace_id) REFERENCES nashir_content_review_decisions(review_decision_id, workspace_id),
  CONSTRAINT uq_nashir_publish_queue_idempotency UNIQUE (workspace_id, idempotency_key),
  CONSTRAINT uq_nashir_publish_queue_id_workspace UNIQUE (publish_queue_item_id, workspace_id),
  CONSTRAINT chk_nashir_publish_queue_channel_not_empty
    CHECK (destination_channel IS NULL OR length(trim(destination_channel)) > 0),
  CONSTRAINT chk_nashir_publish_queue_confirmed_has_user
    CHECK (human_confirmed_at IS NULL OR human_confirmed_by_user_id IS NOT NULL),
  CONSTRAINT chk_nashir_publish_queue_published_confirmed
    CHECK (published_at IS NULL OR human_confirmed_at IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_nashir_publish_queue_workspace ON nashir_publishing_queue_items(workspace_id);
CREATE INDEX IF NOT EXISTS idx_nashir_publish_queue_campaign ON nashir_publishing_queue_items(nashir_campaign_id);
CREATE INDEX IF NOT EXISTS idx_nashir_publish_queue_content ON nashir_publishing_queue_items(campaign_content_id);
CREATE INDEX IF NOT EXISTS idx_nashir_publish_queue_workspace_status ON nashir_publishing_queue_items(workspace_id, queue_status);
CREATE INDEX IF NOT EXISTS idx_nashir_publish_queue_review_decision ON nashir_publishing_queue_items(review_decision_id);

COMMIT;

-- End of Patch 008
