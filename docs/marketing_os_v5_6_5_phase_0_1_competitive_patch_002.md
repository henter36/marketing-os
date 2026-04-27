# Marketing OS V5.6.5 — Phase 0/1 Competitive Scope Patch 002

> **Document type:** Controlled contract patch  
> **Applies to:** ERD, SQL DDL, OpenAPI, Sprint Backlog, QA Test Suite, Codex Instructions  
> **Related documents:**  
> - `docs/marketing_os_competitive_features_scope.md`  
> - `docs/marketing_os_feature_phase_map.md`  
> - `docs/marketing_os_core_v1_backlog_competitive_features.md`  
> - `docs/marketing_os_integration_boundaries.md`  
> - `docs/marketing_os_risk_register_competitive_features.md`  
> - `docs/marketing_os_data_model_additions.md`  
> - `docs/marketing_os_api_surface_additions.md`  
> - `docs/marketing_os_rejected_features.md`  
> **Scope:** Phase 0 + Core V1 only  
> **Status:** Binding patch before extending Sprint scope  
> **Extended V1:** Explicitly not opened by this patch

---

## 1. Executive Decision

After reviewing the competitive feature documents against the current Phase 0/1 ERD, SQL DDL, OpenAPI, Sprint Backlog, and QA Test Suite, the current execution contracts already cover most Core V1 foundations:

```text
Workspace / RBAC / Audit
Campaign / Brief
Brand Profile / Brand Rules
Prompt Templates / Report Templates
MediaJob / MediaCostSnapshot
MediaAsset / MediaAssetVersion
ReviewTask / ApprovalDecision
PublishJob / ManualPublishEvidence / TrackedLink
UsageMeter / CostEvent / Quota / Budget / Guardrails
ClientReportSnapshot / SafeMode / Onboarding
```

This patch must **not** duplicate those domains.

The only Phase 0/Core V1 additions allowed now are:

```text
1. Connector baseline registry and webhook logging.
2. Performance event ingestion and metric confidence snapshot.
3. CRM-lite contact, consent, and lead capture layer.
4. Notification rule/delivery clarification mapped to existing AdminNotification concept.
```

This patch does **not** approve:

```text
Strapi integration
Medusa integration
Frappe CRM sync
Mattermost/Slack integration
External CRM bidirectional sync
Commerce connector
Plugin system
Omnichannel inbox
Workflow builder
Advanced attribution
MMM / uplift modeling
```

---

## 2. Review Findings Against Current Contracts

### 2.1 Already covered — do not duplicate

| Competitive feature | Existing approved execution contract | Decision |
|---|---|---|
| Campaign Workspace | `Campaign`, `CampaignStateTransition`, `BriefVersion` | Covered |
| Brand Governance | `BrandProfile`, `BrandVoiceRule` | Covered |
| Content Templates | `PromptTemplate`, `ReportTemplate` | Covered |
| AI Generation Jobs | `MediaJob` | Covered; do not reintroduce `GenerationJob` |
| Asset Library + Versioning | `MediaAsset`, `MediaAssetVersion` | Covered |
| Approval Workflow | `ReviewTask`, `ApprovalDecision` | Covered |
| Publishing Evidence | `PublishJob`, `ManualPublishEvidence`, `TrackedLink` | Covered |
| Usage / Cost Control | `UsageMeter`, `MediaCostSnapshot`, `CostEvent`, `CostBudget`, `CostGuardrail` | Covered |
| Audit Logs | `AuditLog` | Covered |
| Reports | `ClientReportSnapshot` | Covered |

### 2.2 Real Phase 0/Core V1 gaps

| Gap | Why it matters | Patch decision |
|---|---|---|
| Connector registry without external integration | Needed to prepare safe integration boundaries without opening Strapi/Medusa/CRM/Mattermost implementation | Add minimal generic connector tables only |
| Webhook event log | Required for future safe ingestion and replay diagnostics | Add append-only inbound log only |
| Performance events | Marketing OS must measure campaign outputs, but current contract mainly has reports/tracked links | Add basic performance events and confidence snapshot |
| CRM-lite contacts | Needed for lead capture and consent, not full CRM | Add Contact/Consent/LeadCapture only |
| Notification delivery | Existing AdminNotification is operational, but competitive scope requires delivery status/rules | Add clarification; either extend AdminNotification or add minimal NotificationDelivery contract |

---

## 3. ERD Patch

Add the following relationship contract to Phase 0/1 only.

```text
Workspace 1──N Connector
Connector 1──N ConnectorAccount
ConnectorAccount 1──N ConnectorCredential
ConnectorAccount 1──N ConnectorSyncRun
ConnectorAccount 1──N ConnectorErrorLog
WebhookEndpoint 1──N WebhookEventLog

Campaign 1──N PerformanceEvent
Campaign 1──N CampaignMetricSnapshot
PublishJob 1──0..N PerformanceEvent
TrackedLink 1──0..N PerformanceEvent
MediaAssetVersion 1──0..N PerformanceEvent
CampaignMetricSnapshot 1──1 MetricConfidenceScore

Workspace 1──N Contact
Contact 1──N ContactIdentifier
Contact 1──N ContactConsent
Campaign 1──N LeadCapture
Contact 1──N LeadCapture
Campaign 1──N CampaignContactAttribution
Contact 1──N CampaignContactAttribution

Workspace 1──N NotificationRule
NotificationRule 1──N NotificationDelivery
AdminNotification 1──0..N NotificationDelivery
```

### Naming rule

Do not add legacy or vague names:

```text
GenerationJob
Asset
Approval
OmnichannelInbox
CRMDeal
CommerceOrder
Plugin
```

Approved names:

```text
MediaJob
MediaAsset
ApprovalDecision
Connector
PerformanceEvent
Contact
LeadCapture
NotificationDelivery
```

---

## 4. SQL DDL Patch Requirements

This patch should be implemented as a future SQL file:

```text
docs/marketing_os_v5_6_5_phase_0_1_schema_patch_002.sql
```

The SQL file must add only the tables below. It must not alter existing approval/evidence behavior from Patch 001.

### 4.1 Connector baseline tables

Required tables:

```text
connectors
connector_accounts
connector_credentials
webhook_endpoints
webhook_event_logs
connector_sync_runs
connector_error_logs
```

Minimum required fields:

```text
connectors:
  connector_id uuid PK
  workspace_id uuid NOT NULL
  connector_key varchar NOT NULL
  connector_name varchar NOT NULL
  connector_type enum/internal varchar CHECK
  connector_status enum/internal varchar CHECK
  created_by_user_id uuid NOT NULL
  created_at timestamptz NOT NULL
  updated_at timestamptz NOT NULL

connector_accounts:
  connector_account_id uuid PK
  workspace_id uuid NOT NULL
  connector_id uuid NOT NULL
  external_account_ref varchar NULL
  account_label varchar NOT NULL
  account_status enum/internal varchar CHECK
  created_at timestamptz NOT NULL
  updated_at timestamptz NOT NULL

connector_credentials:
  connector_credential_id uuid PK
  workspace_id uuid NOT NULL
  connector_account_id uuid NOT NULL
  secret_ref text NOT NULL
  credential_status enum/internal varchar CHECK
  rotated_at timestamptz NULL
  created_at timestamptz NOT NULL

webhook_endpoints:
  webhook_endpoint_id uuid PK
  workspace_id uuid NOT NULL
  connector_id uuid NOT NULL
  endpoint_key varchar NOT NULL
  signing_secret_ref text NOT NULL
  endpoint_status enum/internal varchar CHECK
  created_at timestamptz NOT NULL

webhook_event_logs:
  webhook_event_log_id uuid PK
  workspace_id uuid NOT NULL
  webhook_endpoint_id uuid NOT NULL
  external_event_id varchar NULL
  event_type varchar NOT NULL
  signature_valid boolean NOT NULL
  payload_hash char(64) NOT NULL
  received_payload jsonb NOT NULL
  processing_status enum/internal varchar CHECK
  received_at timestamptz NOT NULL

connector_sync_runs:
  connector_sync_run_id uuid PK
  workspace_id uuid NOT NULL
  connector_account_id uuid NOT NULL
  sync_type varchar NOT NULL
  sync_status enum/internal varchar CHECK
  started_at timestamptz NOT NULL
  completed_at timestamptz NULL
  failure_code varchar NULL

connector_error_logs:
  connector_error_log_id uuid PK
  workspace_id uuid NOT NULL
  connector_account_id uuid NULL
  webhook_event_log_id uuid NULL
  error_code varchar NOT NULL
  error_message text NOT NULL
  created_at timestamptz NOT NULL
```

Hard SQL rules:

```text
- connector_credentials.secret_ref stores only a secret-manager reference, never raw secrets.
- webhook_event_logs must be append-only.
- webhook_event_logs.signature_valid=false must not trigger business state mutation.
- All connector tables must include workspace_id.
- No external system may write directly to approval_decisions, manual_publish_evidence, audit_logs, or usage_meter.
```

### 4.2 Performance measurement tables

Required tables:

```text
performance_events
campaign_metric_snapshots
metric_confidence_scores
```

Minimum required fields:

```text
performance_events:
  performance_event_id uuid PK
  workspace_id uuid NOT NULL
  campaign_id uuid NOT NULL
  publish_job_id uuid NULL
  tracked_link_id uuid NULL
  media_asset_version_id uuid NULL
  metric_name varchar NOT NULL
  metric_value numeric NOT NULL
  event_source varchar NOT NULL
  source_ref varchar NULL
  observed_at timestamptz NOT NULL
  ingested_at timestamptz NOT NULL

campaign_metric_snapshots:
  campaign_metric_snapshot_id uuid PK
  workspace_id uuid NOT NULL
  campaign_id uuid NOT NULL
  snapshot_period_start timestamptz NOT NULL
  snapshot_period_end timestamptz NOT NULL
  snapshot_payload jsonb NOT NULL
  created_at timestamptz NOT NULL

metric_confidence_scores:
  metric_confidence_score_id uuid PK
  workspace_id uuid NOT NULL
  campaign_metric_snapshot_id uuid NOT NULL UNIQUE
  confidence_score numeric NOT NULL CHECK confidence_score BETWEEN 0 AND 1
  confidence_reason jsonb NOT NULL
  created_at timestamptz NOT NULL
```

Hard SQL rules:

```text
- performance_events.metric_value must be >= 0.
- campaign_metric_snapshots are append-only.
- metric_confidence_scores are append-only.
- No advanced attribution decision table is allowed in Phase 0/1.
```

### 4.3 CRM-lite tables

Required tables:

```text
contacts
contact_identifiers
contact_consents
lead_captures
campaign_contact_attributions
```

Minimum required fields:

```text
contacts:
  contact_id uuid PK
  workspace_id uuid NOT NULL
  display_name varchar NULL
  contact_status enum/internal varchar CHECK
  created_at timestamptz NOT NULL
  updated_at timestamptz NOT NULL

contact_identifiers:
  contact_identifier_id uuid PK
  workspace_id uuid NOT NULL
  contact_id uuid NOT NULL
  identifier_type varchar NOT NULL
  identifier_value_hash char(64) NOT NULL
  identifier_label varchar NULL
  created_at timestamptz NOT NULL

contact_consents:
  contact_consent_id uuid PK
  workspace_id uuid NOT NULL
  contact_id uuid NOT NULL
  consent_type varchar NOT NULL
  consent_status enum/internal varchar CHECK
  consent_source varchar NOT NULL
  consent_evidence_ref text NULL
  recorded_at timestamptz NOT NULL

lead_captures:
  lead_capture_id uuid PK
  workspace_id uuid NOT NULL
  campaign_id uuid NOT NULL
  contact_id uuid NULL
  captured_from varchar NOT NULL
  source_payload jsonb NOT NULL
  captured_at timestamptz NOT NULL

campaign_contact_attributions:
  campaign_contact_attribution_id uuid PK
  workspace_id uuid NOT NULL
  campaign_id uuid NOT NULL
  contact_id uuid NOT NULL
  attribution_source varchar NOT NULL
  attribution_confidence numeric NOT NULL CHECK attribution_confidence BETWEEN 0 AND 1
  created_at timestamptz NOT NULL
```

Hard SQL rules:

```text
- Do not add deals, pipelines, sales forecasts, quotes, or CRM activities in Phase 0/1.
- contact_identifiers must store hashed identifiers where possible.
- contact_consents must be append-only.
- Campaign targeting must not use a contact without consent when consent is required by policy.
```

### 4.4 Notification delivery tables

Required tables:

```text
notification_rules
notification_deliveries
```

Minimum required fields:

```text
notification_rules:
  notification_rule_id uuid PK
  workspace_id uuid NOT NULL
  rule_name varchar NOT NULL
  trigger_event varchar NOT NULL
  channel varchar NOT NULL
  rule_status enum/internal varchar CHECK
  created_by_user_id uuid NOT NULL
  created_at timestamptz NOT NULL
  updated_at timestamptz NOT NULL

notification_deliveries:
  notification_delivery_id uuid PK
  workspace_id uuid NOT NULL
  notification_rule_id uuid NULL
  admin_notification_id uuid NULL
  delivery_channel varchar NOT NULL
  delivery_status enum/internal varchar CHECK
  destination_ref text NULL
  failure_code varchar NULL
  created_at timestamptz NOT NULL
  delivered_at timestamptz NULL
```

Hard SQL rules:

```text
- Mattermost/Slack channels must not be implemented in Core V1.
- delivery_channel may reserve values for webhook/email/in_app, but external integration is Extended V1.
- Notification failure must not rollback the primary business transaction.
```

---

## 5. OpenAPI Patch Requirements

This patch should be implemented as a future OpenAPI patch file:

```text
docs/marketing_os_v5_6_5_phase_0_1_openapi_patch_002.yaml
```

Allowed new path groups only:

```text
/workspaces/{workspaceId}/connectors
/workspaces/{workspaceId}/connectors/{connectorId}/accounts
/workspaces/{workspaceId}/connectors/{connectorId}/sync-runs
/workspaces/{workspaceId}/webhooks/{endpointKey}
/workspaces/{workspaceId}/campaigns/{campaignId}/performance-events
/workspaces/{workspaceId}/campaigns/{campaignId}/metric-snapshots
/workspaces/{workspaceId}/contacts
/workspaces/{workspaceId}/contacts/{contactId}/consents
/workspaces/{workspaceId}/campaigns/{campaignId}/lead-captures
/workspaces/{workspaceId}/notification-rules
/workspaces/{workspaceId}/notification-deliveries
```

Forbidden OpenAPI additions:

```text
/strapi/*
/medusa/*
/mattermost/*
/slack/*
/crm-sync/*
/commerce/*
/plugins/*
/inbox/*
/workflows/builder/*
/attribution/advanced/*
```

Required API rules:

```text
- Every new path must include WorkspaceId route context.
- Every mutation must define x-permission.
- Sensitive mutations must define x-audit-event.
- Webhook endpoint must require signature validation.
- Webhook event body must not be trusted unless signature_valid=true.
- No PATCH/DELETE endpoint for webhook_event_logs, contact_consents, campaign_metric_snapshots, metric_confidence_scores.
```

---

## 6. Sprint Backlog Patch Requirements

Add one controlled Sprint 2/3/4 block only.

### Story S2-06 — Connector Baseline Registry

**Phase:** Core V1 foundation  
**Purpose:** Prepare governed integration registry without implementing external tools.

Acceptance criteria:

```text
- Admin can create Connector metadata.
- Admin can create ConnectorAccount.
- ConnectorCredential stores secret_ref only.
- No raw secret is stored in DB.
- WebhookEventLog records payload hash and signature_valid.
- Invalid signature does not mutate business state.
```

### Story S3-06 — Basic Performance Events and Metric Confidence

Acceptance criteria:

```text
- PerformanceEvent can be recorded for Campaign.
- PerformanceEvent can optionally reference PublishJob, TrackedLink, or MediaAssetVersion.
- Metric value cannot be negative.
- CampaignMetricSnapshot freezes metrics for a period.
- MetricConfidenceScore is created for each snapshot.
- No advanced attribution table or model is created.
```

### Story S3-07 — CRM-lite Contacts and Lead Capture

Acceptance criteria:

```text
- Contact can be created in workspace.
- ContactIdentifier stores hashed identifier value.
- ContactConsent is append-only.
- LeadCapture can be tied to Campaign and optionally Contact.
- CampaignContactAttribution stores attribution_source and attribution_confidence.
- No deals, pipeline, sales forecast, quotes, or CRM activities are added.
```

### Story S4-05 — Notification Rule and Delivery Tracking

Acceptance criteria:

```text
- NotificationRule can be created for internal events.
- NotificationDelivery records delivery attempts.
- Failed notification delivery does not rollback the original business transaction.
- External Mattermost/Slack delivery remains Extended V1 and is not implemented.
```

---

## 7. QA Test Suite Patch Requirements

Add the following P0/P1 QA cases only.

### QA-CON-001 — Raw connector secret is never stored

Expected:

```text
connector_credentials.secret_ref exists.
No access token, API key, refresh token, or signing secret is stored as raw text in connector tables.
```

### QA-CON-002 — Invalid webhook signature cannot mutate business state

Expected:

```text
WebhookEventLog is recorded with signature_valid=false.
No Campaign, PublishJob, ManualPublishEvidence, UsageMeter, or Contact state is changed.
```

### QA-PERF-001 — Performance event is workspace-scoped

Expected:

```text
Workspace A cannot create/read PerformanceEvent for Workspace B campaign.
```

### QA-PERF-002 — Metric snapshot is immutable

Expected:

```text
CampaignMetricSnapshot cannot be updated or deleted.
MetricConfidenceScore cannot be updated or deleted.
New correction requires a new snapshot.
```

### QA-CRM-001 — Contact consent is append-only

Expected:

```text
ContactConsent cannot be updated or deleted.
Consent change creates a new ContactConsent row.
```

### QA-CRM-002 — No full CRM entities exist in Phase 0/1

Expected:

```text
No deals, pipelines, forecasts, quotes, CRM activities, or support tickets tables/endpoints exist.
```

### QA-NOTIF-001 — Notification failure does not rollback source transaction

Expected:

```text
If notification delivery fails after a source event, the source event remains committed and NotificationDelivery records failure_code.
```

---

## 8. Codex Instruction Patch

Codex must apply this patch after Patch 001 and before any Sprint 2+ implementation that touches connectors, performance, contacts, or notifications.

Execution order:

```text
1. docs/marketing_os_v5_6_5_phase_0_1_schema.sql
2. docs/marketing_os_v5_6_5_phase_0_1_schema_patch_001.sql
3. docs/marketing_os_v5_6_5_phase_0_1_competitive_patch_002.md
4. Generate implementation-specific schema patch 002 only after owner approval.
```

Codex must stop if asked to implement:

```text
Strapi integration
Medusa integration
Mattermost/Slack integration
Frappe/CRM sync
Commerce connector
Advanced attribution
Omnichannel inbox
Plugin system
Workflow builder
```

---

## 9. Final Patch Decision

```text
GO: Add Connector baseline metadata/logging.
GO: Add PerformanceEvent + CampaignMetricSnapshot + MetricConfidenceScore.
GO: Add CRM-lite Contact/Consent/LeadCapture/Attribution.
GO: Add NotificationRule/NotificationDelivery tracking.

NO-GO: External integrations.
NO-GO: Full CRM.
NO-GO: Commerce connector.
NO-GO: Plugin system.
NO-GO: Advanced attribution.
NO-GO: Rewriting existing Campaign/MediaJob/Approval/Evidence domains.
```

This patch is intentionally narrow. It protects the project from duplicating already-approved domains while adding the minimum missing Core V1 structures needed for a governed Marketing OS.
