-- Marketing OS V5.6.5 — Phase 0/1 Schema Patch 002
-- Purpose: Add the narrow competitive-scope Phase 0/Core V1 additions approved by Patch 002.
-- Authority: docs/marketing_os_v5_6_5_phase_0_1_competitive_patch_002.md
-- Scope: Connector baseline, performance events, CRM-lite contacts/consent, notification delivery tracking.
-- Explicitly out of scope: Strapi/Medusa/Mattermost/Slack/Frappe integrations, full CRM, commerce connector, plugins, advanced attribution.

BEGIN;

-- =========================================================
-- 1) ENUMS — PATCH 002 ONLY
-- =========================================================

DO $$ BEGIN CREATE TYPE connector_type AS ENUM ('generic','cms','crm','commerce','analytics','social','notification','storage','webhook'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE connector_status AS ENUM ('draft','active','disabled','archived'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE connector_account_status AS ENUM ('active','disabled','reauth_required','archived'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE connector_credential_status AS ENUM ('active','rotated','revoked'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE webhook_endpoint_status AS ENUM ('active','disabled','archived'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE webhook_processing_status AS ENUM ('received','ignored','processed','failed','dead_letter'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE connector_sync_status AS ENUM ('queued','running','succeeded','failed','canceled'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE contact_status AS ENUM ('active','suppressed','deleted'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE consent_status AS ENUM ('granted','denied','revoked','unknown'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE notification_rule_status AS ENUM ('active','disabled','archived'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE notification_delivery_status AS ENUM ('queued','sent','failed','skipped'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- =========================================================
-- 2) CONNECTOR BASELINE — NO EXTERNAL INTEGRATION IMPLEMENTED
-- =========================================================

CREATE TABLE IF NOT EXISTS connectors (
  connector_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(workspace_id),
  connector_key varchar(120) NOT NULL,
  connector_name varchar(255) NOT NULL,
  connector_type connector_type NOT NULL DEFAULT 'generic',
  connector_status connector_status NOT NULL DEFAULT 'draft',
  config_schema jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by_user_id uuid NOT NULL REFERENCES users(user_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_connectors_workspace_key UNIQUE (workspace_id, connector_key),
  CONSTRAINT uq_connectors_id_workspace UNIQUE (connector_id, workspace_id)
);

CREATE INDEX IF NOT EXISTS idx_connectors_workspace ON connectors(workspace_id);
CREATE INDEX IF NOT EXISTS idx_connectors_type ON connectors(workspace_id, connector_type);
CREATE INDEX IF NOT EXISTS idx_connectors_status ON connectors(workspace_id, connector_status);

CREATE TABLE IF NOT EXISTS connector_accounts (
  connector_account_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  connector_id uuid NOT NULL,
  external_account_ref varchar(255),
  account_label varchar(255) NOT NULL,
  account_status connector_account_status NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_connector_accounts_connector_workspace FOREIGN KEY (connector_id, workspace_id) REFERENCES connectors(connector_id, workspace_id),
  CONSTRAINT uq_connector_accounts_id_workspace UNIQUE (connector_account_id, workspace_id)
);

CREATE INDEX IF NOT EXISTS idx_connector_accounts_workspace ON connector_accounts(workspace_id);
CREATE INDEX IF NOT EXISTS idx_connector_accounts_connector ON connector_accounts(connector_id);
CREATE INDEX IF NOT EXISTS idx_connector_accounts_status ON connector_accounts(workspace_id, account_status);

CREATE TABLE IF NOT EXISTS connector_credentials (
  connector_credential_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  connector_account_id uuid NOT NULL,
  secret_ref text NOT NULL,
  credential_status connector_credential_status NOT NULL DEFAULT 'active',
  rotated_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_connector_credentials_account_workspace FOREIGN KEY (connector_account_id, workspace_id) REFERENCES connector_accounts(connector_account_id, workspace_id),
  CONSTRAINT chk_connector_credentials_secret_ref_not_empty CHECK (length(trim(secret_ref)) > 0),
  CONSTRAINT uq_connector_credentials_id_workspace UNIQUE (connector_credential_id, workspace_id)
);

CREATE INDEX IF NOT EXISTS idx_connector_credentials_workspace ON connector_credentials(workspace_id);
CREATE INDEX IF NOT EXISTS idx_connector_credentials_account ON connector_credentials(connector_account_id);
CREATE INDEX IF NOT EXISTS idx_connector_credentials_status ON connector_credentials(workspace_id, credential_status);

CREATE TABLE IF NOT EXISTS webhook_endpoints (
  webhook_endpoint_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  connector_id uuid NOT NULL,
  endpoint_key varchar(160) NOT NULL,
  signing_secret_ref text NOT NULL,
  endpoint_status webhook_endpoint_status NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_webhook_endpoints_connector_workspace FOREIGN KEY (connector_id, workspace_id) REFERENCES connectors(connector_id, workspace_id),
  CONSTRAINT uq_webhook_endpoints_key UNIQUE (workspace_id, endpoint_key),
  CONSTRAINT uq_webhook_endpoints_id_workspace UNIQUE (webhook_endpoint_id, workspace_id),
  CONSTRAINT chk_webhook_endpoints_secret_ref_not_empty CHECK (length(trim(signing_secret_ref)) > 0)
);

CREATE INDEX IF NOT EXISTS idx_webhook_endpoints_workspace ON webhook_endpoints(workspace_id);
CREATE INDEX IF NOT EXISTS idx_webhook_endpoints_connector ON webhook_endpoints(connector_id);
CREATE INDEX IF NOT EXISTS idx_webhook_endpoints_status ON webhook_endpoints(workspace_id, endpoint_status);

CREATE TABLE IF NOT EXISTS webhook_event_logs (
  webhook_event_log_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  webhook_endpoint_id uuid NOT NULL,
  external_event_id varchar(255),
  event_type varchar(150) NOT NULL,
  signature_valid boolean NOT NULL DEFAULT false,
  payload_hash char(64) NOT NULL,
  received_payload jsonb NOT NULL,
  processing_status webhook_processing_status NOT NULL DEFAULT 'received',
  received_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_webhook_event_logs_endpoint_workspace FOREIGN KEY (webhook_endpoint_id, workspace_id) REFERENCES webhook_endpoints(webhook_endpoint_id, workspace_id),
  CONSTRAINT uq_webhook_event_logs_id_workspace UNIQUE (webhook_event_log_id, workspace_id)
);

CREATE INDEX IF NOT EXISTS idx_webhook_event_logs_workspace ON webhook_event_logs(workspace_id, received_at);
CREATE INDEX IF NOT EXISTS idx_webhook_event_logs_endpoint ON webhook_event_logs(webhook_endpoint_id, received_at);
CREATE INDEX IF NOT EXISTS idx_webhook_event_logs_status ON webhook_event_logs(workspace_id, processing_status);
CREATE INDEX IF NOT EXISTS idx_webhook_event_logs_signature ON webhook_event_logs(workspace_id, signature_valid);

CREATE TABLE IF NOT EXISTS connector_sync_runs (
  connector_sync_run_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  connector_account_id uuid NOT NULL,
  sync_type varchar(120) NOT NULL,
  sync_status connector_sync_status NOT NULL DEFAULT 'queued',
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  failure_code varchar(120),
  CONSTRAINT fk_connector_sync_runs_account_workspace FOREIGN KEY (connector_account_id, workspace_id) REFERENCES connector_accounts(connector_account_id, workspace_id),
  CONSTRAINT uq_connector_sync_runs_id_workspace UNIQUE (connector_sync_run_id, workspace_id)
);

CREATE INDEX IF NOT EXISTS idx_connector_sync_runs_workspace ON connector_sync_runs(workspace_id, started_at);
CREATE INDEX IF NOT EXISTS idx_connector_sync_runs_account ON connector_sync_runs(connector_account_id, started_at);
CREATE INDEX IF NOT EXISTS idx_connector_sync_runs_status ON connector_sync_runs(workspace_id, sync_status);

CREATE TABLE IF NOT EXISTS connector_error_logs (
  connector_error_log_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(workspace_id),
  connector_account_id uuid,
  webhook_event_log_id uuid,
  error_code varchar(120) NOT NULL,
  error_message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_connector_error_logs_account_workspace FOREIGN KEY (connector_account_id, workspace_id) REFERENCES connector_accounts(connector_account_id, workspace_id),
  CONSTRAINT fk_connector_error_logs_webhook_workspace FOREIGN KEY (webhook_event_log_id, workspace_id) REFERENCES webhook_event_logs(webhook_event_log_id, workspace_id)
);

CREATE INDEX IF NOT EXISTS idx_connector_error_logs_workspace ON connector_error_logs(workspace_id, created_at);
CREATE INDEX IF NOT EXISTS idx_connector_error_logs_account ON connector_error_logs(connector_account_id, created_at);
CREATE INDEX IF NOT EXISTS idx_connector_error_logs_code ON connector_error_logs(workspace_id, error_code);

-- =========================================================
-- 3) PERFORMANCE MEASUREMENT — BASIC ONLY, NO ADVANCED ATTRIBUTION
-- =========================================================

CREATE TABLE IF NOT EXISTS performance_events (
  performance_event_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  campaign_id uuid NOT NULL,
  publish_job_id uuid,
  tracked_link_id uuid,
  media_asset_version_id uuid,
  metric_name varchar(120) NOT NULL,
  metric_value numeric(18,6) NOT NULL CHECK (metric_value >= 0),
  event_source varchar(120) NOT NULL,
  source_ref varchar(255),
  observed_at timestamptz NOT NULL,
  ingested_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_performance_events_campaign_workspace FOREIGN KEY (campaign_id, workspace_id) REFERENCES campaigns(campaign_id, workspace_id),
  CONSTRAINT fk_performance_events_publish_job_workspace FOREIGN KEY (publish_job_id, workspace_id) REFERENCES publish_jobs(publish_job_id, workspace_id),
  CONSTRAINT fk_performance_events_asset_version_workspace FOREIGN KEY (media_asset_version_id, workspace_id) REFERENCES media_asset_versions(media_asset_version_id, workspace_id)
);

CREATE INDEX IF NOT EXISTS idx_performance_events_workspace ON performance_events(workspace_id, ingested_at);
CREATE INDEX IF NOT EXISTS idx_performance_events_campaign ON performance_events(campaign_id, observed_at);
CREATE INDEX IF NOT EXISTS idx_performance_events_metric ON performance_events(workspace_id, metric_name, observed_at);
CREATE INDEX IF NOT EXISTS idx_performance_events_publish_job ON performance_events(publish_job_id) WHERE publish_job_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_performance_events_asset_version ON performance_events(media_asset_version_id) WHERE media_asset_version_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS campaign_metric_snapshots (
  campaign_metric_snapshot_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  campaign_id uuid NOT NULL,
  snapshot_period_start timestamptz NOT NULL,
  snapshot_period_end timestamptz NOT NULL,
  snapshot_payload jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_campaign_metric_snapshots_campaign_workspace FOREIGN KEY (campaign_id, workspace_id) REFERENCES campaigns(campaign_id, workspace_id),
  CONSTRAINT chk_campaign_metric_snapshots_period CHECK (snapshot_period_end > snapshot_period_start),
  CONSTRAINT uq_campaign_metric_snapshots_id_workspace UNIQUE (campaign_metric_snapshot_id, workspace_id)
);

CREATE INDEX IF NOT EXISTS idx_campaign_metric_snapshots_workspace ON campaign_metric_snapshots(workspace_id, created_at);
CREATE INDEX IF NOT EXISTS idx_campaign_metric_snapshots_campaign ON campaign_metric_snapshots(campaign_id, snapshot_period_start, snapshot_period_end);

CREATE TABLE IF NOT EXISTS metric_confidence_scores (
  metric_confidence_score_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  campaign_metric_snapshot_id uuid NOT NULL,
  confidence_score numeric(5,4) NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 1),
  confidence_reason jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_metric_confidence_scores_snapshot_workspace FOREIGN KEY (campaign_metric_snapshot_id, workspace_id) REFERENCES campaign_metric_snapshots(campaign_metric_snapshot_id, workspace_id),
  CONSTRAINT uq_metric_confidence_scores_snapshot UNIQUE (campaign_metric_snapshot_id)
);

CREATE INDEX IF NOT EXISTS idx_metric_confidence_scores_workspace ON metric_confidence_scores(workspace_id, created_at);
CREATE INDEX IF NOT EXISTS idx_metric_confidence_scores_score ON metric_confidence_scores(workspace_id, confidence_score);

-- =========================================================
-- 4) CRM-LITE CONTACTS — NO DEALS / PIPELINES / FORECASTS
-- =========================================================

CREATE TABLE IF NOT EXISTS contacts (
  contact_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(workspace_id),
  display_name varchar(255),
  contact_status contact_status NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_contacts_id_workspace UNIQUE (contact_id, workspace_id)
);

CREATE INDEX IF NOT EXISTS idx_contacts_workspace ON contacts(workspace_id);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(workspace_id, contact_status);

CREATE TABLE IF NOT EXISTS contact_identifiers (
  contact_identifier_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  contact_id uuid NOT NULL,
  identifier_type varchar(80) NOT NULL,
  identifier_value_hash char(64) NOT NULL,
  identifier_label varchar(255),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_contact_identifiers_contact_workspace FOREIGN KEY (contact_id, workspace_id) REFERENCES contacts(contact_id, workspace_id),
  CONSTRAINT uq_contact_identifiers_hash UNIQUE (workspace_id, identifier_type, identifier_value_hash)
);

CREATE INDEX IF NOT EXISTS idx_contact_identifiers_workspace ON contact_identifiers(workspace_id);
CREATE INDEX IF NOT EXISTS idx_contact_identifiers_contact ON contact_identifiers(contact_id);
CREATE INDEX IF NOT EXISTS idx_contact_identifiers_type ON contact_identifiers(workspace_id, identifier_type);

CREATE TABLE IF NOT EXISTS contact_consents (
  contact_consent_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  contact_id uuid NOT NULL,
  consent_type varchar(120) NOT NULL,
  consent_status consent_status NOT NULL,
  consent_source varchar(120) NOT NULL,
  consent_evidence_ref text,
  recorded_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_contact_consents_contact_workspace FOREIGN KEY (contact_id, workspace_id) REFERENCES contacts(contact_id, workspace_id)
);

CREATE INDEX IF NOT EXISTS idx_contact_consents_workspace ON contact_consents(workspace_id, recorded_at);
CREATE INDEX IF NOT EXISTS idx_contact_consents_contact ON contact_consents(contact_id, recorded_at);
CREATE INDEX IF NOT EXISTS idx_contact_consents_type_status ON contact_consents(workspace_id, consent_type, consent_status);

CREATE TABLE IF NOT EXISTS lead_captures (
  lead_capture_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  campaign_id uuid NOT NULL,
  contact_id uuid,
  captured_from varchar(120) NOT NULL,
  source_payload jsonb NOT NULL,
  captured_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_lead_captures_campaign_workspace FOREIGN KEY (campaign_id, workspace_id) REFERENCES campaigns(campaign_id, workspace_id),
  CONSTRAINT fk_lead_captures_contact_workspace FOREIGN KEY (contact_id, workspace_id) REFERENCES contacts(contact_id, workspace_id),
  CONSTRAINT uq_lead_captures_id_workspace UNIQUE (lead_capture_id, workspace_id)
);

CREATE INDEX IF NOT EXISTS idx_lead_captures_workspace ON lead_captures(workspace_id, captured_at);
CREATE INDEX IF NOT EXISTS idx_lead_captures_campaign ON lead_captures(campaign_id, captured_at);
CREATE INDEX IF NOT EXISTS idx_lead_captures_contact ON lead_captures(contact_id, captured_at) WHERE contact_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS campaign_contact_attributions (
  campaign_contact_attribution_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  campaign_id uuid NOT NULL,
  contact_id uuid NOT NULL,
  attribution_source varchar(120) NOT NULL,
  attribution_confidence numeric(5,4) NOT NULL CHECK (attribution_confidence >= 0 AND attribution_confidence <= 1),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_campaign_contact_attributions_campaign_workspace FOREIGN KEY (campaign_id, workspace_id) REFERENCES campaigns(campaign_id, workspace_id),
  CONSTRAINT fk_campaign_contact_attributions_contact_workspace FOREIGN KEY (contact_id, workspace_id) REFERENCES contacts(contact_id, workspace_id),
  CONSTRAINT uq_campaign_contact_attributions_unique UNIQUE (workspace_id, campaign_id, contact_id, attribution_source)
);

CREATE INDEX IF NOT EXISTS idx_campaign_contact_attributions_workspace ON campaign_contact_attributions(workspace_id, created_at);
CREATE INDEX IF NOT EXISTS idx_campaign_contact_attributions_campaign ON campaign_contact_attributions(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_contact_attributions_contact ON campaign_contact_attributions(contact_id);

-- =========================================================
-- 5) NOTIFICATION DELIVERY TRACKING — NO MATTERMOST/SLACK IMPLEMENTATION
-- =========================================================

CREATE TABLE IF NOT EXISTS notification_rules (
  notification_rule_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(workspace_id),
  rule_name varchar(255) NOT NULL,
  trigger_event varchar(150) NOT NULL,
  channel varchar(80) NOT NULL,
  rule_status notification_rule_status NOT NULL DEFAULT 'active',
  created_by_user_id uuid NOT NULL REFERENCES users(user_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_notification_rules_workspace_name UNIQUE (workspace_id, rule_name),
  CONSTRAINT uq_notification_rules_id_workspace UNIQUE (notification_rule_id, workspace_id)
);

CREATE INDEX IF NOT EXISTS idx_notification_rules_workspace ON notification_rules(workspace_id);
CREATE INDEX IF NOT EXISTS idx_notification_rules_trigger ON notification_rules(workspace_id, trigger_event);
CREATE INDEX IF NOT EXISTS idx_notification_rules_status ON notification_rules(workspace_id, rule_status);

CREATE TABLE IF NOT EXISTS notification_deliveries (
  notification_delivery_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  notification_rule_id uuid,
  admin_notification_id uuid,
  delivery_channel varchar(80) NOT NULL,
  delivery_status notification_delivery_status NOT NULL DEFAULT 'queued',
  destination_ref text,
  failure_code varchar(120),
  created_at timestamptz NOT NULL DEFAULT now(),
  delivered_at timestamptz,
  CONSTRAINT fk_notification_deliveries_rule_workspace FOREIGN KEY (notification_rule_id, workspace_id) REFERENCES notification_rules(notification_rule_id, workspace_id)
);

CREATE INDEX IF NOT EXISTS idx_notification_deliveries_workspace ON notification_deliveries(workspace_id, created_at);
CREATE INDEX IF NOT EXISTS idx_notification_deliveries_rule ON notification_deliveries(notification_rule_id) WHERE notification_rule_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_notification_deliveries_status ON notification_deliveries(workspace_id, delivery_status);

-- =========================================================
-- 6) TRIGGERS / IMMUTABILITY
-- =========================================================

DROP TRIGGER IF EXISTS trg_connectors_updated_at ON connectors;
CREATE TRIGGER trg_connectors_updated_at BEFORE UPDATE ON connectors FOR EACH ROW EXECUTE FUNCTION set_updated_at();
DROP TRIGGER IF EXISTS trg_connector_accounts_updated_at ON connector_accounts;
CREATE TRIGGER trg_connector_accounts_updated_at BEFORE UPDATE ON connector_accounts FOR EACH ROW EXECUTE FUNCTION set_updated_at();
DROP TRIGGER IF EXISTS trg_webhook_endpoints_updated_at ON webhook_endpoints;
CREATE TRIGGER trg_webhook_endpoints_updated_at BEFORE UPDATE ON webhook_endpoints FOR EACH ROW EXECUTE FUNCTION set_updated_at();
DROP TRIGGER IF EXISTS trg_contacts_updated_at ON contacts;
CREATE TRIGGER trg_contacts_updated_at BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE FUNCTION set_updated_at();
DROP TRIGGER IF EXISTS trg_notification_rules_updated_at ON notification_rules;
CREATE TRIGGER trg_notification_rules_updated_at BEFORE UPDATE ON notification_rules FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_webhook_event_logs_append_only ON webhook_event_logs;
CREATE TRIGGER trg_webhook_event_logs_append_only BEFORE UPDATE OR DELETE ON webhook_event_logs FOR EACH ROW EXECUTE FUNCTION prevent_update_delete();
DROP TRIGGER IF EXISTS trg_performance_events_append_only ON performance_events;
CREATE TRIGGER trg_performance_events_append_only BEFORE UPDATE OR DELETE ON performance_events FOR EACH ROW EXECUTE FUNCTION prevent_update_delete();
DROP TRIGGER IF EXISTS trg_campaign_metric_snapshots_append_only ON campaign_metric_snapshots;
CREATE TRIGGER trg_campaign_metric_snapshots_append_only BEFORE UPDATE OR DELETE ON campaign_metric_snapshots FOR EACH ROW EXECUTE FUNCTION prevent_update_delete();
DROP TRIGGER IF EXISTS trg_metric_confidence_scores_append_only ON metric_confidence_scores;
CREATE TRIGGER trg_metric_confidence_scores_append_only BEFORE UPDATE OR DELETE ON metric_confidence_scores FOR EACH ROW EXECUTE FUNCTION prevent_update_delete();
DROP TRIGGER IF EXISTS trg_contact_consents_append_only ON contact_consents;
CREATE TRIGGER trg_contact_consents_append_only BEFORE UPDATE OR DELETE ON contact_consents FOR EACH ROW EXECUTE FUNCTION prevent_update_delete();

DROP TRIGGER IF EXISTS trg_connector_credentials_immutable ON connector_credentials;
CREATE TRIGGER trg_connector_credentials_immutable
BEFORE UPDATE ON connector_credentials
FOR EACH ROW EXECUTE FUNCTION prevent_column_update('workspace_id','connector_account_id','secret_ref','created_at');

-- =========================================================
-- 7) RLS BASELINE FOR NEW WORKSPACE-SCOPED TABLES
-- =========================================================

ALTER TABLE connectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE connector_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE connector_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_endpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_event_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE connector_sync_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE connector_error_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_metric_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE metric_confidence_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_identifiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_captures ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_contact_attributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_deliveries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS workspace_isolation_connectors ON connectors;
CREATE POLICY workspace_isolation_connectors ON connectors USING (workspace_id = app_current_workspace_id()) WITH CHECK (workspace_id = app_current_workspace_id());
DROP POLICY IF EXISTS workspace_isolation_connector_accounts ON connector_accounts;
CREATE POLICY workspace_isolation_connector_accounts ON connector_accounts USING (workspace_id = app_current_workspace_id()) WITH CHECK (workspace_id = app_current_workspace_id());
DROP POLICY IF EXISTS workspace_isolation_connector_credentials ON connector_credentials;
CREATE POLICY workspace_isolation_connector_credentials ON connector_credentials USING (workspace_id = app_current_workspace_id()) WITH CHECK (workspace_id = app_current_workspace_id());
DROP POLICY IF EXISTS workspace_isolation_webhook_endpoints ON webhook_endpoints;
CREATE POLICY workspace_isolation_webhook_endpoints ON webhook_endpoints USING (workspace_id = app_current_workspace_id()) WITH CHECK (workspace_id = app_current_workspace_id());
DROP POLICY IF EXISTS workspace_isolation_webhook_event_logs ON webhook_event_logs;
CREATE POLICY workspace_isolation_webhook_event_logs ON webhook_event_logs USING (workspace_id = app_current_workspace_id()) WITH CHECK (workspace_id = app_current_workspace_id());
DROP POLICY IF EXISTS workspace_isolation_connector_sync_runs ON connector_sync_runs;
CREATE POLICY workspace_isolation_connector_sync_runs ON connector_sync_runs USING (workspace_id = app_current_workspace_id()) WITH CHECK (workspace_id = app_current_workspace_id());
DROP POLICY IF EXISTS workspace_isolation_connector_error_logs ON connector_error_logs;
CREATE POLICY workspace_isolation_connector_error_logs ON connector_error_logs USING (workspace_id = app_current_workspace_id()) WITH CHECK (workspace_id = app_current_workspace_id());
DROP POLICY IF EXISTS workspace_isolation_performance_events ON performance_events;
CREATE POLICY workspace_isolation_performance_events ON performance_events USING (workspace_id = app_current_workspace_id()) WITH CHECK (workspace_id = app_current_workspace_id());
DROP POLICY IF EXISTS workspace_isolation_campaign_metric_snapshots ON campaign_metric_snapshots;
CREATE POLICY workspace_isolation_campaign_metric_snapshots ON campaign_metric_snapshots USING (workspace_id = app_current_workspace_id()) WITH CHECK (workspace_id = app_current_workspace_id());
DROP POLICY IF EXISTS workspace_isolation_metric_confidence_scores ON metric_confidence_scores;
CREATE POLICY workspace_isolation_metric_confidence_scores ON metric_confidence_scores USING (workspace_id = app_current_workspace_id()) WITH CHECK (workspace_id = app_current_workspace_id());
DROP POLICY IF EXISTS workspace_isolation_contacts ON contacts;
CREATE POLICY workspace_isolation_contacts ON contacts USING (workspace_id = app_current_workspace_id()) WITH CHECK (workspace_id = app_current_workspace_id());
DROP POLICY IF EXISTS workspace_isolation_contact_identifiers ON contact_identifiers;
CREATE POLICY workspace_isolation_contact_identifiers ON contact_identifiers USING (workspace_id = app_current_workspace_id()) WITH CHECK (workspace_id = app_current_workspace_id());
DROP POLICY IF EXISTS workspace_isolation_contact_consents ON contact_consents;
CREATE POLICY workspace_isolation_contact_consents ON contact_consents USING (workspace_id = app_current_workspace_id()) WITH CHECK (workspace_id = app_current_workspace_id());
DROP POLICY IF EXISTS workspace_isolation_lead_captures ON lead_captures;
CREATE POLICY workspace_isolation_lead_captures ON lead_captures USING (workspace_id = app_current_workspace_id()) WITH CHECK (workspace_id = app_current_workspace_id());
DROP POLICY IF EXISTS workspace_isolation_campaign_contact_attributions ON campaign_contact_attributions;
CREATE POLICY workspace_isolation_campaign_contact_attributions ON campaign_contact_attributions USING (workspace_id = app_current_workspace_id()) WITH CHECK (workspace_id = app_current_workspace_id());
DROP POLICY IF EXISTS workspace_isolation_notification_rules ON notification_rules;
CREATE POLICY workspace_isolation_notification_rules ON notification_rules USING (workspace_id = app_current_workspace_id()) WITH CHECK (workspace_id = app_current_workspace_id());
DROP POLICY IF EXISTS workspace_isolation_notification_deliveries ON notification_deliveries;
CREATE POLICY workspace_isolation_notification_deliveries ON notification_deliveries USING (workspace_id = app_current_workspace_id()) WITH CHECK (workspace_id = app_current_workspace_id());

-- =========================================================
-- 8) PERMISSION SEEDS FOR PATCH 002 DOMAINS
-- =========================================================

INSERT INTO permissions (permission_code, permission_name, domain) VALUES
  ('connector.read', 'Read connectors', 'connectors'),
  ('connector.write', 'Create or update connectors', 'connectors'),
  ('connector.rotate_secret', 'Rotate connector credentials', 'connectors'),
  ('webhook.receive', 'Receive connector webhooks', 'connectors'),
  ('performance.read', 'Read performance metrics', 'performance'),
  ('performance.event_create', 'Create performance events', 'performance'),
  ('performance.snapshot_create', 'Create metric snapshots', 'performance'),
  ('contact.create', 'Create contacts', 'contacts'),
  ('contact.read', 'Read contacts', 'contacts'),
  ('contact.update', 'Update contacts', 'contacts'),
  ('contact.consent_update', 'Record contact consent changes', 'contacts'),
  ('lead_capture.create', 'Create lead captures', 'contacts'),
  ('lead_capture.read', 'Read lead captures', 'contacts'),
  ('notification_rule.read', 'Read notification rules', 'notifications'),
  ('notification_rule.write', 'Create or update notification rules', 'notifications'),
  ('notification_delivery.read', 'Read notification deliveries', 'notifications')
ON CONFLICT (permission_code) DO NOTHING;

COMMIT;

-- End of Patch 002
