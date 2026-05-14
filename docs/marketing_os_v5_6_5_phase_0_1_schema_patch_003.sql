-- Marketing OS V5.6.5 — Phase 0/1 Schema Patch 003
-- Purpose: Add DB-backed Nashir evidence lifecycle persistence tables.
-- Authority: docs/nashir_evidence_lifecycle_schema_patch_target_decision.md
-- Scope: Persistence only for Nashir evidence records and lifecycle events.
-- Explicitly out of scope: routes/runtime, OpenAPI, RBAC, generated clients, evidence lifecycle actions, approval, publishing, UI, Sprint 5, Pilot, Production.
-- Tenant isolation must still be enforced by runtime using route-derived workspace/campaign context.
-- Non-disclosing 404 behavior remains runtime responsibility.

BEGIN;

-- =========================================================
-- 1) ENUMS — PATCH 003 ONLY
-- =========================================================

DO $$ BEGIN CREATE TYPE nashir_evidence_status AS ENUM ('submitted','accepted','rejected','invalidated','superseded'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE nashir_evidence_lifecycle_event_type AS ENUM ('nashir_evidence.submitted','nashir_evidence.accepted','nashir_evidence.rejected','nashir_evidence.invalidated','nashir_evidence.superseded'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- =========================================================
-- 2) NASHIR EVIDENCE RECORDS
-- =========================================================
-- Nashir campaign FK target is intentionally unresolved in this patch because
-- the authoritative DB-backed Nashir campaign table is not established here.
-- Route/repository implementations must scope every lookup by workspace_id and
-- nashir_campaign_id and must not disclose cross-tenant evidence existence.
-- updated_at is application-managed in this patch. Patch 003 does not introduce
-- an updated_at trigger; future runtime/repository implementation must set
-- updated_at explicitly on updates.

CREATE TABLE IF NOT EXISTS nashir_evidence (
  evidence_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(workspace_id),
  nashir_campaign_id uuid NOT NULL,
  evidence_type varchar(120) NOT NULL,
  channel varchar(120) NOT NULL,
  status nashir_evidence_status NOT NULL DEFAULT 'submitted',
  submitted_at timestamptz NOT NULL DEFAULT now(),
  submitted_by_user_id uuid NOT NULL REFERENCES users(user_id),
  published_at timestamptz,
  url text,
  notes text,
  external_reference text,
  replacement_evidence_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_nashir_evidence_id_workspace_campaign UNIQUE (evidence_id, workspace_id, nashir_campaign_id),
  CONSTRAINT chk_nashir_evidence_type_not_empty CHECK (length(trim(evidence_type)) > 0),
  CONSTRAINT chk_nashir_evidence_channel_not_empty CHECK (length(trim(channel)) > 0),
  CONSTRAINT chk_nashir_evidence_replacement_not_self CHECK (replacement_evidence_id IS NULL OR replacement_evidence_id <> evidence_id),
  CONSTRAINT chk_nashir_evidence_superseded_replacement CHECK (status <> 'superseded'::nashir_evidence_status OR replacement_evidence_id IS NOT NULL),
  CONSTRAINT fk_nashir_evidence_replacement_workspace_campaign FOREIGN KEY (replacement_evidence_id, workspace_id, nashir_campaign_id) REFERENCES nashir_evidence(evidence_id, workspace_id, nashir_campaign_id)
);

CREATE INDEX IF NOT EXISTS idx_nashir_evidence_workspace_campaign_id ON nashir_evidence(workspace_id, nashir_campaign_id, evidence_id);
CREATE INDEX IF NOT EXISTS idx_nashir_evidence_workspace_campaign_status ON nashir_evidence(workspace_id, nashir_campaign_id, status);
CREATE INDEX IF NOT EXISTS idx_nashir_evidence_replacement ON nashir_evidence(replacement_evidence_id) WHERE replacement_evidence_id IS NOT NULL;

-- =========================================================
-- 3) NASHIR EVIDENCE LIFECYCLE EVENTS
-- =========================================================
-- audit_event_id is intentionally nullable without an FK because the exact audit
-- table/column correlation is not approved in this patch. Lifecycle events are
-- durable state history; audit correlation remains separately gated.
-- prior_status is nullable so the initial nashir_evidence.submitted event can
-- represent creation without a previous lifecycle state.

CREATE TABLE IF NOT EXISTS nashir_evidence_lifecycle_events (
  lifecycle_event_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  evidence_id uuid NOT NULL,
  workspace_id uuid NOT NULL REFERENCES workspaces(workspace_id),
  nashir_campaign_id uuid NOT NULL,
  event_type nashir_evidence_lifecycle_event_type NOT NULL,
  prior_status nashir_evidence_status,
  next_status nashir_evidence_status NOT NULL,
  actor_user_id uuid NOT NULL REFERENCES users(user_id),
  reason_code varchar(120),
  reviewer_notes text,
  replacement_evidence_id uuid,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  audit_event_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_nashir_evidence_lifecycle_replacement_not_self CHECK (replacement_evidence_id IS NULL OR replacement_evidence_id <> evidence_id),
  CONSTRAINT chk_nashir_evidence_lifecycle_rejected_reason CHECK (event_type <> 'nashir_evidence.rejected'::nashir_evidence_lifecycle_event_type OR length(trim(coalesce(reason_code, ''))) > 0),
  CONSTRAINT chk_nashir_evidence_lifecycle_invalidated_reason CHECK (event_type <> 'nashir_evidence.invalidated'::nashir_evidence_lifecycle_event_type OR length(trim(coalesce(reason_code, ''))) > 0),
  CONSTRAINT chk_nashir_evidence_lifecycle_superseded_replacement CHECK (event_type <> 'nashir_evidence.superseded'::nashir_evidence_lifecycle_event_type OR replacement_evidence_id IS NOT NULL),
  CONSTRAINT fk_nashir_evidence_lifecycle_evidence_workspace_campaign FOREIGN KEY (evidence_id, workspace_id, nashir_campaign_id) REFERENCES nashir_evidence(evidence_id, workspace_id, nashir_campaign_id),
  CONSTRAINT fk_nashir_evidence_lifecycle_replacement_workspace_campaign FOREIGN KEY (replacement_evidence_id, workspace_id, nashir_campaign_id) REFERENCES nashir_evidence(evidence_id, workspace_id, nashir_campaign_id)
);

CREATE INDEX IF NOT EXISTS idx_nashir_evidence_lifecycle_evidence ON nashir_evidence_lifecycle_events(evidence_id);
CREATE INDEX IF NOT EXISTS idx_nashir_evidence_lifecycle_workspace_campaign_evidence ON nashir_evidence_lifecycle_events(workspace_id, nashir_campaign_id, evidence_id);
CREATE INDEX IF NOT EXISTS idx_nashir_evidence_lifecycle_event_type ON nashir_evidence_lifecycle_events(event_type);
CREATE INDEX IF NOT EXISTS idx_nashir_evidence_lifecycle_audit_event ON nashir_evidence_lifecycle_events(audit_event_id) WHERE audit_event_id IS NOT NULL;

COMMIT;

-- End of Patch 003
