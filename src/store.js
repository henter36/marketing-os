const base = require("./store_sprint3");

function createSeedStore() {
  const store = base.createSeedStore();

  store.clientReportSnapshots ||= [];
  store.safeModeStates ||= [];
  store.onboardingProgress ||= [];

  store.connectors ||= [
    {
      connector_id: "connector-a",
      workspace_id: "workspace-a",
      connector_key: "generic-webhook-a",
      connector_name: "Generic Webhook A",
      connector_type: "webhook",
      connector_status: "active",
      config_schema: { mode: "metadata_only" },
      created_by_user_id: "user-owner-a",
      created_at: "2026-04-27T00:00:00.000Z",
      updated_at: "2026-04-27T00:00:00.000Z"
    },
    {
      connector_id: "connector-b",
      workspace_id: "workspace-b",
      connector_key: "generic-webhook-b",
      connector_name: "Generic Webhook B",
      connector_type: "webhook",
      connector_status: "active",
      config_schema: { mode: "metadata_only" },
      created_by_user_id: "user-owner-a",
      created_at: "2026-04-27T00:00:00.000Z",
      updated_at: "2026-04-27T00:00:00.000Z"
    }
  ];

  store.connector_accounts ||= [
    {
      connector_account_id: "connector-account-a",
      workspace_id: "workspace-a",
      connector_id: "connector-a",
      external_account_ref: "external-account-a",
      account_label: "Account A",
      account_status: "active",
      created_at: "2026-04-27T00:00:00.000Z",
      updated_at: "2026-04-27T00:00:00.000Z"
    },
    {
      connector_account_id: "connector-account-b",
      workspace_id: "workspace-b",
      connector_id: "connector-b",
      external_account_ref: "external-account-b",
      account_label: "Account B",
      account_status: "active",
      created_at: "2026-04-27T00:00:00.000Z",
      updated_at: "2026-04-27T00:00:00.000Z"
    }
  ];

  store.connector_credentials ||= [
    {
      connector_credential_id: "connector-credential-a",
      workspace_id: "workspace-a",
      connector_id: "connector-a",
      connector_account_id: "connector-account-a",
      secret_ref: "secret://workspace-a/connector-account-a/current",
      credential_status: "active",
      created_at: "2026-04-27T00:00:00.000Z"
    }
  ];

  store.webhook_endpoints ||= [
    {
      webhook_endpoint_id: "webhook-endpoint-a",
      workspace_id: "workspace-a",
      endpoint_key: "endpoint-a",
      connector_id: "connector-a",
      endpoint_status: "active",
      signature_validation_mode: "test-static",
      created_at: "2026-04-27T00:00:00.000Z",
      updated_at: "2026-04-27T00:00:00.000Z"
    },
    {
      webhook_endpoint_id: "webhook-endpoint-b",
      workspace_id: "workspace-b",
      endpoint_key: "endpoint-b",
      connector_id: "connector-b",
      endpoint_status: "active",
      signature_validation_mode: "test-static",
      created_at: "2026-04-27T00:00:00.000Z",
      updated_at: "2026-04-27T00:00:00.000Z"
    }
  ];

  store.webhook_event_logs ||= [];

  store.connector_sync_runs ||= [
    {
      connector_sync_run_id: "connector-sync-run-a",
      workspace_id: "workspace-a",
      connector_id: "connector-a",
      connector_account_id: "connector-account-a",
      sync_status: "completed",
      sync_mode: "metadata_history_only",
      started_at: "2026-04-27T00:00:00.000Z",
      completed_at: "2026-04-27T00:05:00.000Z"
    },
    {
      connector_sync_run_id: "connector-sync-run-b",
      workspace_id: "workspace-b",
      connector_id: "connector-b",
      connector_account_id: "connector-account-b",
      sync_status: "completed",
      sync_mode: "metadata_history_only",
      started_at: "2026-04-27T00:00:00.000Z",
      completed_at: "2026-04-27T00:05:00.000Z"
    }
  ];

  store.performance_events ||= [
    {
      performance_event_id: "performance-event-a",
      workspace_id: "workspace-a",
      campaign_id: "campaign-a",
      publish_job_id: "publish-job-a",
      tracked_link_id: null,
      media_asset_version_id: "asset-version-a",
      metric_name: "clicks",
      metric_value: 10,
      event_source: "manual_seed",
      source_ref: "seed-a",
      observed_at: "2026-04-27T00:00:00.000Z",
      ingested_at: "2026-04-27T00:01:00.000Z"
    },
    {
      performance_event_id: "performance-event-b",
      workspace_id: "workspace-b",
      campaign_id: "campaign-b",
      publish_job_id: null,
      tracked_link_id: null,
      media_asset_version_id: "asset-version-b",
      metric_name: "clicks",
      metric_value: 5,
      event_source: "manual_seed",
      source_ref: "seed-b",
      observed_at: "2026-04-27T00:00:00.000Z",
      ingested_at: "2026-04-27T00:01:00.000Z"
    }
  ];

  store.campaign_metric_snapshots ||= [
    {
      campaign_metric_snapshot_id: "metric-snapshot-a",
      workspace_id: "workspace-a",
      campaign_id: "campaign-a",
      snapshot_period_start: "2026-04-01T00:00:00.000Z",
      snapshot_period_end: "2026-05-01T00:00:00.000Z",
      snapshot_payload: { clicks: 10 },
      created_at: "2026-04-27T00:00:00.000Z"
    },
    {
      campaign_metric_snapshot_id: "metric-snapshot-b",
      workspace_id: "workspace-b",
      campaign_id: "campaign-b",
      snapshot_period_start: "2026-04-01T00:00:00.000Z",
      snapshot_period_end: "2026-05-01T00:00:00.000Z",
      snapshot_payload: { clicks: 5 },
      created_at: "2026-04-27T00:00:00.000Z"
    }
  ];

  store.metric_confidence_scores ||= [
    {
      metric_confidence_score_id: "metric-confidence-a",
      workspace_id: "workspace-a",
      campaign_metric_snapshot_id: "metric-snapshot-a",
      confidence_score: 0.9,
      confidence_reason: { source: "manual_seed" },
      created_at: "2026-04-27T00:00:00.000Z"
    },
    {
      metric_confidence_score_id: "metric-confidence-b",
      workspace_id: "workspace-b",
      campaign_metric_snapshot_id: "metric-snapshot-b",
      confidence_score: 0.8,
      confidence_reason: { source: "manual_seed" },
      created_at: "2026-04-27T00:00:00.000Z"
    }
  ];

  store.contacts ||= [
    {
      contact_id: "contact-a",
      workspace_id: "workspace-a",
      display_name: "Contact A",
      contact_status: "active",
      created_at: "2026-04-27T00:00:00.000Z",
      updated_at: "2026-04-27T00:00:00.000Z"
    },
    {
      contact_id: "contact-b",
      workspace_id: "workspace-b",
      display_name: "Contact B",
      contact_status: "active",
      created_at: "2026-04-27T00:00:00.000Z",
      updated_at: "2026-04-27T00:00:00.000Z"
    }
  ];

  store.contact_identifiers ||= [
    {
      contact_identifier_id: "contact-identifier-a",
      workspace_id: "workspace-a",
      contact_id: "contact-a",
      identifier_type: "email_hash",
      identifier_value_hash: "1".repeat(64),
      identifier_label: "primary",
      created_at: "2026-04-27T00:00:00.000Z"
    },
    {
      contact_identifier_id: "contact-identifier-b",
      workspace_id: "workspace-b",
      contact_id: "contact-b",
      identifier_type: "email_hash",
      identifier_value_hash: "2".repeat(64),
      identifier_label: "primary",
      created_at: "2026-04-27T00:00:00.000Z"
    }
  ];

  store.contact_consents ||= [
    {
      contact_consent_id: "contact-consent-a",
      workspace_id: "workspace-a",
      contact_id: "contact-a",
      consent_type: "email_marketing",
      consent_status: "granted",
      consent_source: "seed",
      consent_evidence_ref: "seed-a",
      created_at: "2026-04-27T00:00:00.000Z"
    },
    {
      contact_consent_id: "contact-consent-b",
      workspace_id: "workspace-b",
      contact_id: "contact-b",
      consent_type: "email_marketing",
      consent_status: "granted",
      consent_source: "seed",
      consent_evidence_ref: "seed-b",
      created_at: "2026-04-27T00:00:00.000Z"
    }
  ];

  store.lead_captures ||= [
    {
      lead_capture_id: "lead-capture-a",
      workspace_id: "workspace-a",
      campaign_id: "campaign-a",
      contact_id: "contact-a",
      captured_from: "manual_seed",
      source_payload: { source: "seed" },
      attribution_source: "manual",
      attribution_confidence: 0.7,
      created_at: "2026-04-27T00:00:00.000Z"
    },
    {
      lead_capture_id: "lead-capture-b",
      workspace_id: "workspace-b",
      campaign_id: "campaign-b",
      contact_id: "contact-b",
      captured_from: "manual_seed",
      source_payload: { source: "seed" },
      attribution_source: "manual",
      attribution_confidence: 0.7,
      created_at: "2026-04-27T00:00:00.000Z"
    }
  ];

  store.notification_rules ||= [
    {
      notification_rule_id: "notification-rule-a",
      workspace_id: "workspace-a",
      rule_name: "Rule A",
      trigger_event: "lead_capture.created",
      channel: "in_app",
      rule_status: "active",
      created_at: "2026-04-27T00:00:00.000Z",
      updated_at: "2026-04-27T00:00:00.000Z"
    },
    {
      notification_rule_id: "notification-rule-disabled-a",
      workspace_id: "workspace-a",
      rule_name: "Disabled Rule A",
      trigger_event: "contact.created",
      channel: "in_app",
      rule_status: "disabled",
      created_at: "2026-04-27T00:00:00.000Z",
      updated_at: "2026-04-27T00:00:00.000Z"
    },
    {
      notification_rule_id: "notification-rule-b",
      workspace_id: "workspace-b",
      rule_name: "Rule B",
      trigger_event: "lead_capture.created",
      channel: "in_app",
      rule_status: "active",
      created_at: "2026-04-27T00:00:00.000Z",
      updated_at: "2026-04-27T00:00:00.000Z"
    }
  ];

  store.notification_deliveries ||= [
    {
      notification_delivery_id: "notification-delivery-a",
      workspace_id: "workspace-a",
      notification_rule_id: "notification-rule-a",
      source_entity_type: "LeadCapture",
      source_entity_id: "lead-capture-a",
      delivery_status: "failed",
      failure_reason: "provider_not_configured_metadata_only",
      provider_delivery_ref: null,
      created_at: "2026-04-27T00:00:00.000Z"
    },
    {
      notification_delivery_id: "notification-delivery-b",
      workspace_id: "workspace-b",
      notification_rule_id: "notification-rule-b",
      source_entity_type: "LeadCapture",
      source_entity_id: "lead-capture-b",
      delivery_status: "failed",
      failure_reason: "provider_not_configured_metadata_only",
      provider_delivery_ref: null,
      created_at: "2026-04-27T00:00:00.000Z"
    }
  ];

  return store;
}

module.exports = { createSeedStore };
