-- Marketing OS V5.6.5 — Phase 0/1 Schema Patch 009
-- Purpose: Nashir prompt templates and governance versions (before Creator Studio).
-- Authority: docs/nashir_sql_schema_implementation_planning_gate.md
-- Scope: Schema-only for Nashir-specific prompt template governance.
--        Must be applied before Patch 010 (Creator Studio) which references these tables.
-- Explicitly out of scope: raw prompt exposure beyond approved table design, routes/runtime,
--        OpenAPI, generated clients, UI, AI provider calls, Pilot, Production.
-- Uniqueness on (prompt_template_id, version_number) via partial unique index.
-- Partial unique excludes archived/deprecated versions to allow version number reuse
-- when governance status is 'archived' or 'deprecated'.
-- Audit linkage is nullable (audit_ref) for future approved audit correlation.

BEGIN;

-- =========================================================
-- 1) ENUMS — PATCH 009 ONLY
-- =========================================================

DO $$ BEGIN CREATE TYPE nashir_prompt_template_status AS ENUM ('draft','active','deprecated','archived'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE nashir_prompt_governance_status AS ENUM ('draft','active','deprecated','archived'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- =========================================================
-- 2) NASHIR PROMPT TEMPLATES
-- =========================================================
-- Nashir-specific prompt templates (distinct from base prompt_templates table).
-- Templates are workspace-scoped and versioned through governance records below.

CREATE TABLE IF NOT EXISTS nashir_prompt_templates (
  prompt_template_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(workspace_id),
  template_name varchar(255) NOT NULL,
  template_domain varchar(120) NOT NULL,
  prompt_template_status nashir_prompt_template_status NOT NULL DEFAULT 'draft',
  created_by_user_id uuid NOT NULL REFERENCES users(user_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_nashir_prompt_templates_workspace_name UNIQUE (workspace_id, template_name),
  CONSTRAINT uq_nashir_prompt_templates_id_workspace UNIQUE (prompt_template_id, workspace_id),
  CONSTRAINT chk_nashir_prompt_templates_name_not_empty CHECK (length(trim(template_name)) > 0),
  CONSTRAINT chk_nashir_prompt_templates_domain_not_empty CHECK (length(trim(template_domain)) > 0)
);

CREATE INDEX IF NOT EXISTS idx_nashir_prompt_templates_workspace ON nashir_prompt_templates(workspace_id);
CREATE INDEX IF NOT EXISTS idx_nashir_prompt_templates_workspace_status ON nashir_prompt_templates(workspace_id, prompt_template_status);
CREATE INDEX IF NOT EXISTS idx_nashir_prompt_templates_domain ON nashir_prompt_templates(workspace_id, template_domain);

-- =========================================================
-- 3) NASHIR PROMPT GOVERNANCE VERSIONS
-- =========================================================
-- Versioned content for each prompt template, with governance status and audit linkage.
-- version_number must be positive.
-- Uniqueness is based on (prompt_template_id, version_number) via a partial unique index
-- that excludes archived/deprecated versions, allowing version number reuse only for
-- those terminal governance statuses. This implements the "partial unique watch item"
-- where archived/deprecated reuse is allowed by the status model.

CREATE TABLE IF NOT EXISTS nashir_prompt_governance_versions (
  governance_version_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  prompt_template_id uuid NOT NULL,
  version_number integer NOT NULL,
  prompt_body text NOT NULL,
  governance_status nashir_prompt_governance_status NOT NULL DEFAULT 'draft',
  version_notes text,
  approved_by_user_id uuid REFERENCES users(user_id),
  approved_at timestamptz,
  audit_ref uuid,
  created_by_user_id uuid NOT NULL REFERENCES users(user_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_nashir_prompt_governance_template_workspace FOREIGN KEY (prompt_template_id, workspace_id) REFERENCES nashir_prompt_templates(prompt_template_id, workspace_id),
  CONSTRAINT uq_nashir_prompt_governance_id_workspace UNIQUE (governance_version_id, workspace_id),
  CONSTRAINT chk_nashir_prompt_governance_version_positive CHECK (version_number > 0),
  CONSTRAINT chk_nashir_prompt_governance_approved_has_user
    CHECK (approved_at IS NULL OR approved_by_user_id IS NOT NULL)
);

-- Partial unique index on (prompt_template_id, version_number) for non-archived/deprecated.
-- Allows version number reuse only when governance_status is 'archived' or 'deprecated'.
CREATE UNIQUE INDEX IF NOT EXISTS uq_nashir_prompt_governance_active_version
  ON nashir_prompt_governance_versions(prompt_template_id, version_number)
  WHERE governance_status NOT IN ('archived', 'deprecated');

CREATE INDEX IF NOT EXISTS idx_nashir_prompt_governance_workspace ON nashir_prompt_governance_versions(workspace_id);
CREATE INDEX IF NOT EXISTS idx_nashir_prompt_governance_template ON nashir_prompt_governance_versions(prompt_template_id);
CREATE INDEX IF NOT EXISTS idx_nashir_prompt_governance_workspace_status ON nashir_prompt_governance_versions(workspace_id, governance_status);
CREATE INDEX IF NOT EXISTS idx_nashir_prompt_governance_audit_ref ON nashir_prompt_governance_versions(audit_ref) WHERE audit_ref IS NOT NULL;

COMMIT;

-- End of Patch 009
