-- Marketing OS V5.6.5 — Phase 0/1 Schema Patch 011
-- Purpose: Nashir model routing rules, AI provider registry, and cost usage records.
-- Authority: docs/nashir_sql_schema_implementation_planning_gate.md
-- Scope: Schema-only layer for AI model routing metadata, provider registry, and
--        workspace-scoped cost usage tracking.
-- Explicitly out of scope: AI provider API calls, runtime model routing implementation,
--        API key storage, credential storage, autonomous AI execution, routes/runtime,
--        OpenAPI, generated clients, UI, Pilot, Production.
-- Admin/owner sensitivity: routing rules and AI provider records are workspace-scoped;
--        access should be restricted to owner/admin roles at the runtime layer.
-- No raw API keys, tokens, or credentials are stored in any column of these tables.

BEGIN;

-- =========================================================
-- 1) ENUMS — PATCH 011 ONLY
-- =========================================================

DO $$ BEGIN CREATE TYPE nashir_routing_rule_status AS ENUM ('active','disabled','archived'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE nashir_ai_provider_status AS ENUM ('active','disabled','archived'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE nashir_cost_usage_status AS ENUM ('estimated','actual','reversed'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- =========================================================
-- 2) NASHIR AI PROVIDERS
-- =========================================================
-- Metadata registry for AI providers. No credentials, API keys, or tokens stored.
-- vault_ref in integration_connections (Patch 006) handles credential references.
-- capabilities is advisory metadata only.

CREATE TABLE IF NOT EXISTS nashir_ai_providers (
  ai_provider_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(workspace_id),
  provider_key varchar(120) NOT NULL,
  provider_name varchar(255) NOT NULL,
  ai_provider_status nashir_ai_provider_status NOT NULL DEFAULT 'active',
  capabilities jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_nashir_ai_providers_workspace_key UNIQUE (workspace_id, provider_key),
  CONSTRAINT uq_nashir_ai_providers_id_workspace UNIQUE (ai_provider_id, workspace_id),
  CONSTRAINT chk_nashir_ai_providers_key_not_empty CHECK (length(trim(provider_key)) > 0),
  CONSTRAINT chk_nashir_ai_providers_name_not_empty CHECK (length(trim(provider_name)) > 0)
);

CREATE INDEX IF NOT EXISTS idx_nashir_ai_providers_workspace ON nashir_ai_providers(workspace_id);
CREATE INDEX IF NOT EXISTS idx_nashir_ai_providers_workspace_status ON nashir_ai_providers(workspace_id, ai_provider_status);

-- =========================================================
-- 3) NASHIR MODEL ROUTING RULES
-- =========================================================
-- Advisory routing rules for AI model selection by task domain.
-- Admin/owner sensitivity: these records govern AI behavior and must be
-- restricted to owner/admin at the runtime permission layer.
-- No provider credentials stored here.

CREATE TABLE IF NOT EXISTS nashir_model_routing_rules (
  routing_rule_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(workspace_id),
  rule_name varchar(255) NOT NULL,
  task_domain varchar(120) NOT NULL,
  provider_key varchar(120) NOT NULL,
  model_identifier varchar(255) NOT NULL,
  routing_rule_status nashir_routing_rule_status NOT NULL DEFAULT 'active',
  rule_config jsonb NOT NULL DEFAULT '{}'::jsonb,
  priority integer NOT NULL DEFAULT 0,
  created_by_user_id uuid NOT NULL REFERENCES users(user_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_nashir_routing_rule_id_workspace UNIQUE (routing_rule_id, workspace_id),
  CONSTRAINT chk_nashir_routing_rule_name_not_empty CHECK (length(trim(rule_name)) > 0),
  CONSTRAINT chk_nashir_routing_rule_task_domain_not_empty CHECK (length(trim(task_domain)) > 0),
  CONSTRAINT chk_nashir_routing_rule_provider_not_empty CHECK (length(trim(provider_key)) > 0),
  CONSTRAINT chk_nashir_routing_rule_model_not_empty CHECK (length(trim(model_identifier)) > 0)
);

CREATE INDEX IF NOT EXISTS idx_nashir_routing_rules_workspace ON nashir_model_routing_rules(workspace_id);
CREATE INDEX IF NOT EXISTS idx_nashir_routing_rules_workspace_status ON nashir_model_routing_rules(workspace_id, routing_rule_status);
CREATE INDEX IF NOT EXISTS idx_nashir_routing_rules_task_domain ON nashir_model_routing_rules(workspace_id, task_domain);
CREATE INDEX IF NOT EXISTS idx_nashir_routing_rules_priority ON nashir_model_routing_rules(workspace_id, task_domain, priority);

-- =========================================================
-- 4) NASHIR COST USAGE RECORDS
-- =========================================================
-- Workspace-scoped cost/token usage tracking for AI operations.
-- Records are advisory and do not constitute billing or invoice state.
-- source_entity_type and source_entity_id link the cost to the originating entity.

CREATE TABLE IF NOT EXISTS nashir_cost_usage_records (
  cost_usage_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(workspace_id),
  nashir_campaign_id uuid,
  session_id uuid,
  ai_provider_id uuid,
  task_domain varchar(120) NOT NULL,
  model_identifier varchar(255) NOT NULL,
  token_count integer,
  cost_amount numeric(18,6),
  cost_currency char(3),
  usage_status nashir_cost_usage_status NOT NULL DEFAULT 'estimated',
  source_entity_type varchar(120) NOT NULL,
  source_entity_id uuid NOT NULL,
  recorded_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_nashir_cost_usage_id_workspace UNIQUE (cost_usage_id, workspace_id),
  CONSTRAINT chk_nashir_cost_usage_task_domain_not_empty CHECK (length(trim(task_domain)) > 0),
  CONSTRAINT chk_nashir_cost_usage_model_not_empty CHECK (length(trim(model_identifier)) > 0),
  CONSTRAINT chk_nashir_cost_usage_amount_positive CHECK (cost_amount IS NULL OR cost_amount >= 0),
  CONSTRAINT chk_nashir_cost_usage_token_count_positive CHECK (token_count IS NULL OR token_count >= 0),
  CONSTRAINT chk_nashir_cost_usage_source_entity_not_empty CHECK (length(trim(source_entity_type)) > 0)
);

CREATE INDEX IF NOT EXISTS idx_nashir_cost_usage_workspace ON nashir_cost_usage_records(workspace_id, recorded_at);
CREATE INDEX IF NOT EXISTS idx_nashir_cost_usage_campaign ON nashir_cost_usage_records(nashir_campaign_id) WHERE nashir_campaign_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_nashir_cost_usage_session ON nashir_cost_usage_records(session_id) WHERE session_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_nashir_cost_usage_provider ON nashir_cost_usage_records(ai_provider_id) WHERE ai_provider_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_nashir_cost_usage_source_entity ON nashir_cost_usage_records(source_entity_type, source_entity_id);
CREATE INDEX IF NOT EXISTS idx_nashir_cost_usage_workspace_status ON nashir_cost_usage_records(workspace_id, usage_status);

-- =========================================================
-- 5) WORKSPACE-SCOPED FOREIGN KEYS (guarded for idempotency)
-- =========================================================

-- nashir_model_routing_rules.(workspace_id, provider_key) → nashir_ai_providers(workspace_id, provider_key)
-- Routing rules must reference a registered AI provider in the same workspace.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'nashir_model_routing_rules'
      AND constraint_name = 'fk_nashir_routing_rules_provider_workspace'
  ) THEN
    ALTER TABLE nashir_model_routing_rules
      ADD CONSTRAINT fk_nashir_routing_rules_provider_workspace
      FOREIGN KEY (workspace_id, provider_key)
      REFERENCES nashir_ai_providers(workspace_id, provider_key);
  END IF;
END $$;

-- nashir_cost_usage_records.(nashir_campaign_id, workspace_id) → nashir_campaigns (nullable)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'nashir_cost_usage_records'
      AND constraint_name = 'fk_nashir_cost_usage_campaign_workspace'
  ) THEN
    ALTER TABLE nashir_cost_usage_records
      ADD CONSTRAINT fk_nashir_cost_usage_campaign_workspace
      FOREIGN KEY (nashir_campaign_id, workspace_id)
      REFERENCES nashir_campaigns(nashir_campaign_id, workspace_id);
  END IF;
END $$;

-- nashir_cost_usage_records.(session_id, workspace_id) → nashir_creator_studio_sessions (nullable)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'nashir_cost_usage_records'
      AND constraint_name = 'fk_nashir_cost_usage_session_workspace'
  ) THEN
    ALTER TABLE nashir_cost_usage_records
      ADD CONSTRAINT fk_nashir_cost_usage_session_workspace
      FOREIGN KEY (session_id, workspace_id)
      REFERENCES nashir_creator_studio_sessions(session_id, workspace_id);
  END IF;
END $$;

-- nashir_cost_usage_records.(ai_provider_id, workspace_id) → nashir_ai_providers (nullable)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'nashir_cost_usage_records'
      AND constraint_name = 'fk_nashir_cost_usage_provider_workspace'
  ) THEN
    ALTER TABLE nashir_cost_usage_records
      ADD CONSTRAINT fk_nashir_cost_usage_provider_workspace
      FOREIGN KEY (ai_provider_id, workspace_id)
      REFERENCES nashir_ai_providers(ai_provider_id, workspace_id);
  END IF;
END $$;

COMMIT;

-- End of Patch 011
