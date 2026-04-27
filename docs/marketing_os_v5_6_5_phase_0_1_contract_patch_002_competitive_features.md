# Marketing OS V5.6.5 — Phase 0/1 Contract Patch 002

> **Document type:** Contract reconciliation patch  
> **Applies to:** ERD, SQL DDL, OpenAPI, Sprint Backlog, QA Test Suite, Codex Instructions  
> **Related docs:** Competitive feature extraction documents added under `docs/`  
> **Scope:** Phase 0 + Core V1 only  
> **Status:** Binding scope patch before any implementation  
> **Explicitly excluded:** Extended V1, Post V1, external product integrations, full CRM, full CMS, full commerce, chat, ERP, workflow builder, plugin marketplace

---

## 1. Executive Decision

This patch reconciles the newly added competitive feature documents with the current authoritative Phase 0/1 contracts.

The decision is:

```text
GO: Add only missing Phase 0 / Core V1 infrastructure required to support the approved Marketing OS loop.
NO-GO: Do not duplicate entities already covered by the existing ERD/SQL/OpenAPI/QA.
NO-GO: Do not introduce Extended V1 integrations.
NO-GO: Do not introduce Post V1 platform expansion.
```

The approved product loop remains:

```text
Understand → Plan → Generate → Review → Publish → Measure → Learn
```

The current authoritative model already covers most of this loop through:

```text
Campaign
BriefVersion
PromptTemplate
MediaJob
MediaAsset
MediaAssetVersion
ReviewTask
ApprovalDecision
PublishJob
ManualPublishEvidence
TrackedLink
ClientReportSnapshot
UsageMeter
CostEvent
AuditLog
AdminNotification
```

Therefore, this patch must not add duplicate legacy names such as:

```text
GenerationJob
Asset
Approval
ContentTemplate
CampaignBrief
ApprovalRequest
PublishingEvidence
```

These names remain conceptual only and must map to the already-approved execution names.

---

## 2. Review Findings Against Current Contracts

### 2.1 Already Covered — No New Entity Required

| Competitive feature | Existing approved contract entity | Patch decision |
|---|---|---|
| Campaign Workspace | `Campaign`, `CampaignStateTransition` | No new table |
| Campaign Brief | `BriefVersion` | No new table |
| Content / Prompt Templates | `PromptTemplate`, `ReportTemplate` | No `ContentTemplate` table in Phase 0/1 |
| AI Generation Job | `MediaJob` | No `GenerationJob` table |
| Asset Library | `MediaAsset`, `MediaAssetVersion` | No generic `Asset` table |
| Approval Workflow | `ReviewTask`, `ApprovalDecision` | No `ApprovalRequest` table |
| Publishing Evidence | `PublishJob`, `ManualPublishEvidence` | No `PublishingEvidence` table |
| Tracking / UTM baseline | `TrackedLink` | No advanced attribution |
| Reports | `ClientReportSnapshot` | No BI warehouse in Phase 0/1 |
| Cost / Usage | `MediaCostSnapshot`, `UsageMeter`, `CostEvent` | No billing provider |
| Audit | `AuditLog` | No mutable audit state |
| Basic admin notifications | `AdminNotification` | May be extended narrowly by delivery metadata only |

### 2.2 Missing But Required for Phase 0 / Core V1

The current contracts do not sufficiently cover four Core V1 support areas extracted from the competitive review:

```text
1. Connector Registry & Webhook Intake Skeleton
2. Performance Event Tracking & Metric Confidence
3. CRM-lite Contact / Consent / Lead Capture
4. Notification Rules & Delivery State
```

These are accepted only as **internal Marketing OS primitives**. They are not approval to build Strapi, Medusa, Frappe, Mattermost, Slack, or any real external integration in this phase.

---

## 3. Patch 002-A — Connector Registry & Webhook Intake Skeleton

### Decision

Add a minimal connector layer to support future integrations safely without connecting to external platforms yet.

### Phase

```text
Phase 0 foundation + Core V1 operational support
```

### Allowed

```text
Connector registry
Connector account metadata
Encrypted credential reference only
Webhook endpoint registry
Webhook event log
Connector sync run log
Connector error log
```

### Not Allowed

```text
No real Strapi integration
No real Medusa integration
No real Frappe CRM integration
No real Mattermost/Slack bot integration
No auto-publishing
No paid execution
No bidirectional sync
No external system as source of truth
No raw secret storage in SQL tables
```

### ERD Additions

```text
Workspace 1──N Connector
Connector 1──N ConnectorAccount
ConnectorAccount 1──N ConnectorCredentialRef
Connector 1──N WebhookEndpoint
WebhookEndpoint 1──N WebhookEventLog
ConnectorAccount 1──N ConnectorSyncRun
ConnectorAccount 1──N ConnectorErrorLog
```

### SQL DDL Additions Required

Add these tables in a future schema patch or migration implementation using the approved naming below:

```text
connectors
connector_accounts
connector_credential_refs
webhook_endpoints
webhook_event_logs
connector_sync_runs
connector_error_logs
```

Required constraints:

```text
workspace_id NOT NULL on workspace-scoped connector tables
No plaintext credentials
credential_secret_ref only, never secret_value
webhook payload stored as jsonb with signature validation status
sync/error rows are append-only
all external writes are inert until explicitly processed by internal service logic
```

Required enums:

```text
connector_kind: cms, crm, commerce, analytics, social, notification, webhook, other
connector_status: draft, active, disabled, error
credential_status: active, expired, revoked, rotation_required
webhook_event_status: received, rejected, processed, failed, ignored
connector_sync_status: queued, running, succeeded, failed, canceled
```

### OpenAPI Additions Required

```http
GET  /workspaces/{workspaceId}/connectors
POST /workspaces/{workspaceId}/connectors
GET  /workspaces/{workspaceId}/connectors/{connectorId}
PATCH /workspaces/{workspaceId}/connectors/{connectorId}
POST /workspaces/{workspaceId}/connectors/{connectorId}/accounts
POST /workspaces/{workspaceId}/connector-accounts/{connectorAccountId}/rotate-credential
POST /workspaces/{workspaceId}/webhooks/{webhookEndpointKey}
GET  /workspaces/{workspaceId}/connector-accounts/{connectorAccountId}/sync-runs
GET  /workspaces/{workspaceId}/connector-accounts/{connectorAccountId}/errors
```

Required permissions:

```text
connector.read
connector.manage
connector.credential.rotate
webhook.receive
```

Required audit events:

```text
connector.created
connector.updated
connector.disabled
connector.account_linked
connector.credential_rotated
webhook.received
webhook.rejected
connector.sync_started
connector.sync_failed
```

### QA Additions Required

```text
QA-CON-001 P0: connector credentials never expose secret values
QA-CON-002 P0: webhook without valid signature is rejected or marked rejected
QA-CON-003 P0: connector cannot mutate Campaign/Approval/Evidence state directly
QA-CON-004 P1: connector sync failure creates ConnectorErrorLog
QA-CON-005 P1: disabled connector cannot receive processing jobs
```

---

## 4. Patch 002-B — Performance Event Tracking & Metric Confidence

### Decision

Add a basic internal performance event and metric confidence layer. This is not advanced attribution.

### Phase

```text
Core V1
```

### Allowed

```text
Manual or imported performance events
Campaign metric snapshots
Asset/channel basic performance rollups
Metric confidence score
Source metadata
TrackedLink and ManualPublishEvidence linkage
```

### Not Allowed

```text
No MMM
No uplift modeling
No multi-touch attribution
No AI optimization loop
No ad platform spend automation
No external analytics connector implementation in this patch
```

### ERD Additions

```text
Campaign 1──N PerformanceEvent
PublishJob 1──0..N PerformanceEvent
TrackedLink 1──0..N PerformanceEvent
MediaAssetVersion 1──0..N PerformanceEvent
Campaign 1──N CampaignMetricSnapshot
CampaignMetricSnapshot 1──N MetricConfidenceScore
```

### SQL DDL Additions Required

```text
performance_events
campaign_metric_snapshots
metric_confidence_scores
```

Required constraints:

```text
workspace_id NOT NULL
campaign_id NOT NULL
source_type IN ('manual','webhook','import','api','system')
metric_name NOT NULL
metric_value >= 0
metric_recorded_at NOT NULL
confidence_score BETWEEN 0 AND 1
raw_payload jsonb allowed but normalized fields required
```

Minimum metrics allowed in Core V1:

```text
impressions
clicks
saves
shares
comments
leads
form_submissions
orders_reference_count
manual_conversions
```

### OpenAPI Additions Required

```http
POST /workspaces/{workspaceId}/performance-events
GET  /workspaces/{workspaceId}/campaigns/{campaignId}/performance
POST /workspaces/{workspaceId}/campaigns/{campaignId}/metric-snapshots
GET  /workspaces/{workspaceId}/campaigns/{campaignId}/metric-snapshots
GET  /workspaces/{workspaceId}/assets/{mediaAssetId}/performance
```

Required permissions:

```text
performance.read
performance.event_create
performance.snapshot_create
```

Required audit events:

```text
performance_event.created
campaign_metric_snapshot.created
metric_confidence_score.created
```

### QA Additions Required

```text
QA-PERF-001 P0: Workspace A cannot read Workspace B performance events
QA-PERF-002 P0: negative metric_value is rejected
QA-PERF-003 P1: manual metric has lower/default confidence than signed API source
QA-PERF-004 P1: campaign snapshot remains unchanged after later event ingestion
QA-PERF-005 P0: performance event cannot create billing, usage, approval, or publish state
```

---

## 5. Patch 002-C — CRM-lite Contact / Consent / Lead Capture

### Decision

Add CRM-lite entities only for marketing response capture and campaign attribution. Do not build a CRM.

### Phase

```text
Core V1 limited
```

### Allowed

```text
Contacts
Contact identifiers
Consent records
Lead captures
Campaign contact attribution
Basic segments as static labels only if needed
```

### Not Allowed

```text
No deals
No sales pipeline
No forecasting
No quotations
No invoices
No support tickets
No call center
No WhatsApp automation
No external CRM sync in Core V1
```

### ERD Additions

```text
Workspace 1──N Contact
Contact 1──N ContactIdentifier
Contact 1──N ContactConsent
Campaign 1──N LeadCapture
LeadCapture N──1 Contact
Campaign 1──N CampaignContactAttribution
Contact 1──N CampaignContactAttribution
```

### SQL DDL Additions Required

```text
contacts
contact_identifiers
contact_consents
lead_captures
campaign_contact_attributions
```

Required constraints:

```text
workspace_id NOT NULL
contact identifiers unique per workspace by type/value hash
consent state is append-only or versioned
lead capture must reference campaign_id in same workspace
attribution cannot override PerformanceEvent truth
PII fields must be minimized or hashed where practical
```

Required enums:

```text
contact_status: active, suppressed, deleted_reference
identifier_type: email, phone, social_handle, external_id, anonymous_id
consent_status: granted, denied, withdrawn, unknown
lead_capture_source: manual, form, import, webhook, tracked_link, evidence
attribution_role: source, influenced, converted, manually_linked
```

### OpenAPI Additions Required

```http
POST /workspaces/{workspaceId}/contacts
GET  /workspaces/{workspaceId}/contacts
GET  /workspaces/{workspaceId}/contacts/{contactId}
PATCH /workspaces/{workspaceId}/contacts/{contactId}
POST /workspaces/{workspaceId}/contacts/{contactId}/consents
POST /workspaces/{workspaceId}/lead-captures
GET  /workspaces/{workspaceId}/campaigns/{campaignId}/leads
```

Required permissions:

```text
contact.read
contact.write
contact.consent_update
lead_capture.create
lead_capture.read
```

Required audit events:

```text
contact.created
contact.updated
contact.consent_recorded
lead_capture.created
campaign_contact_attribution.created
```

### QA Additions Required

```text
QA-CRM-001 P0: Workspace A cannot read Workspace B contact
QA-CRM-002 P0: contact targeting fails when consent is withdrawn or denied
QA-CRM-003 P0: lead capture cannot reference campaign in another workspace
QA-CRM-004 P1: duplicate identifier in same workspace is blocked or merged by explicit policy
QA-CRM-005 P0: CRM-lite cannot create deals, invoices, or sales pipeline records
```

---

## 6. Patch 002-D — Notification Rules & Delivery State

### Decision

The current `AdminNotification` concept is not enough for operational delivery tracking. Add a narrow notification rules/delivery layer for Core V1 operational alerts.

### Phase

```text
Core V1 support
```

### Allowed

```text
Notification rules
Notification records
Delivery attempts
In-app and email channels
Webhook delivery placeholder only
```

### Not Allowed

```text
No internal chat
No Mattermost/Slack integration in Core V1
No threaded conversations
No external workflow state
```

### ERD Additions

```text
Workspace 1──N NotificationRule
Workspace 1──N Notification
Notification 1──N NotificationDelivery
```

### SQL DDL Additions Required

```text
notification_rules
notifications
notification_deliveries
```

Required constraints:

```text
workspace_id NOT NULL
notification_delivery does not change business state
failed notification does not rollback the source action
external webhook delivery is disabled by default in Core V1
```

Required enums:

```text
notification_channel: in_app, email, webhook_placeholder
notification_event_type: approval_requested, approval_decided, publish_failed, connector_failed, safe_mode_activated, quota_warning
notification_status: unread, read, archived
notification_delivery_status: queued, sent, failed, canceled
```

### OpenAPI Additions Required

```http
POST /workspaces/{workspaceId}/notification-rules
GET  /workspaces/{workspaceId}/notification-rules
PATCH /workspaces/{workspaceId}/notification-rules/{notificationRuleId}
GET  /workspaces/{workspaceId}/notifications
POST /workspaces/{workspaceId}/notifications/{notificationId}/mark-read
```

Required permissions:

```text
notification.read
notification_rule.manage
```

Required audit events:

```text
notification_rule.created
notification_rule.updated
notification.delivery_failed
```

### QA Additions Required

```text
QA-NOT-001 P1: failed notification delivery does not rollback approval/publish action
QA-NOT-002 P0: user cannot read notifications from another workspace
QA-NOT-003 P1: disabled notification rule does not enqueue delivery
QA-NOT-004 P0: webhook notification channel is placeholder-only unless connector is explicitly enabled later
```

---

## 7. Explicit Non-Changes to Current Contracts

This patch does not change Patch 001 behavior.

The following remain binding:

```text
ApprovalDecision approves MediaAssetVersion through safe trigger.
ManualPublishEvidence invalidation is limited to evidence_status and invalidated_reason.
Approved MediaAssetVersion content remains immutable.
PublishJob requires approved ApprovalDecision and matching content hash.
UsageMeter requires usable_output_confirmed=true.
```

This patch also does not change the existing forbidden scope:

```text
Auto-publishing
Paid execution
AI agents
Advanced attribution
BillingProvider
ProviderUsageLog
External workflow automation as source of truth
```

---

## 8. Backlog Patch

Add the following stories only after Sprint 0 foundation is stable. These stories do not open Extended V1 integrations.

### S1-06 — Connector Registry Skeleton

**Sprint:** 1 or 2, after RBAC and Audit baseline  
**Severity:** Core support

Acceptance criteria:

```text
- Workspace admin can create connector metadata.
- Credential secret value is never returned by API.
- Webhook endpoint can receive and log payload status.
- Webhook payload cannot mutate core state directly.
- Connector errors are logged.
```

### S3-06 — Performance Event Intake

**Sprint:** 3 or 4, after PublishJob/TrackedLink exists

Acceptance criteria:

```text
- PerformanceEvent can be linked to Campaign.
- Optional links to PublishJob, TrackedLink, and MediaAssetVersion are workspace-validated.
- Negative metric values are rejected.
- CampaignMetricSnapshot is immutable after creation.
- MetricConfidenceScore is recorded.
```

### S3-07 — CRM-lite Lead Capture

**Sprint:** 3 or 4, after Campaign and TrackedLink exist

Acceptance criteria:

```text
- Contact is workspace-scoped.
- ContactIdentifier is unique or merged by explicit policy.
- ContactConsent is recorded before campaign targeting.
- LeadCapture references Campaign in same workspace.
- No deal, pipeline, invoice, or support ticket entity is created.
```

### S4-05 — Notification Delivery State

**Sprint:** 4

Acceptance criteria:

```text
- Notification rules can be configured by authorized users.
- In-app notification can be listed and marked read.
- Delivery failure is recorded without rolling back source business action.
- Webhook delivery remains disabled/placeholder unless explicitly enabled later.
```

---

## 9. OpenAPI Patch Summary

The OpenAPI contract must be expanded only for these internal APIs:

```text
Connector metadata APIs
Webhook intake log API
Performance event APIs
Campaign metric snapshot APIs
CRM-lite contact/lead APIs
Notification rule/read APIs
```

Do not add:

```text
/strapi/*
/medusa/*
/frappe/*
/mattermost/*
/slack/*
/erp/*
/deals/*
/invoices/*
/auto-publish/*
/paid-execution/*
/advanced-attribution/*
```

---

## 10. SQL Patch Summary

A future SQL migration or schema patch must add only these groups:

```text
Connector skeleton tables
Performance event and metric confidence tables
CRM-lite contact/consent/lead tables
Notification delivery tables
```

Do not add:

```text
content_templates
campaign_briefs
generation_jobs
assets
approvals
approval_requests
publishing_evidence
crm_deals
commerce_orders
erp_accounting
chat_messages
workflow_definitions
plugin_manifests
```

---

## 11. QA Patch Summary

The QA suite must add P0/P1 tests for:

```text
Connector credential secrecy
Webhook signature validation or rejection state
Connector cannot mutate core truth directly
Performance event tenant isolation
Metric value validation
Metric confidence recording
Contact tenant isolation
Consent enforcement
Lead capture workspace validation
Notification delivery isolation
Notification failure non-rollback
```

---

## 12. Codex Instruction Patch

Codex must treat this patch as binding but must not implement it until the owner explicitly starts the relevant sprint.

Implementation order remains:

```text
1. Sprint 0 baseline first.
2. Apply Patch 001 rules.
3. Do not implement Patch 002 tables/endpoints until Sprint 0 quality gates pass.
4. When Patch 002 is implemented, add only the four accepted groups.
5. Do not introduce Extended V1 integrations.
```

Codex must stop and report a conflict if asked to implement:

```text
Strapi integration
Medusa integration
CRM sync
Mattermost/Slack integration
Full plugin system
Full CRM
Full commerce
Workflow builder
Advanced attribution
```

---

## 13. Revised Execution Decision

```text
GO: Keep current Phase 0/1 contracts as the implementation authority.
GO: Add Patch 002 as a controlled scope reconciliation patch.
GO: Add only connector skeleton, performance events, CRM-lite, and notification delivery when implementation reaches the approved sprint.
NO-GO: Do not add Extended V1 integrations.
NO-GO: Do not duplicate existing Section 52 entities.
NO-GO: Do not implement Patch 002 before Sprint 0 passes.
```

---

## 14. Risk Note

This patch intentionally delays real external integrations. That is correct.

The immediate system risk is not lack of integrations; it is uncontrolled scope expansion and source-of-truth conflict.

The protected implementation path is:

```text
Contract reconciliation → Sprint 0 gates → minimal internal Core V1 primitives → later integration enablement by explicit patch
```
