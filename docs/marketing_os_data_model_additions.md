# Marketing OS Data Model Additions

## Purpose

هذه الوثيقة تحدد الكيانات المقترحة لإضافة الخصائص المناسبة من المشاريع المرجعية إلى Marketing OS.

---

## Phase 0 Foundation Entities

```text
workspaces
users
roles
permissions
role_permissions
user_workspace_roles
audit_logs
feature_gates
usage_meters
error_events
```

### Notes
- يجب أن تحتوي جميع جداول Core V1 تقريبًا على `workspace_id`.
- يجب أن يدعم audit_logs actor/subject/action/metadata.
- لا تستخدم soft delete للأدلة الحساسة دون event واضح.

---

## Core V1 Entities

### Campaign

```text
campaigns
campaign_briefs
campaign_objectives
campaign_audiences
campaign_channel_plans
campaign_activities
campaign_status_history
```

### Brand Governance

```text
brand_rule_sets
brand_rules
content_guardrails
forbidden_claims
required_disclaimers
```

### Templates

```text
content_templates
template_versions
template_variables
template_usage_logs
```

### Assets

```text
media_assets
media_asset_versions
asset_metadata
asset_tags
asset_usage
asset_approval_states
```

### AI Generation

```text
generation_jobs
generation_inputs
generation_outputs
model_providers
model_routing_decisions
generation_cost_events
generation_reviews
```

### Approvals

```text
approval_policies
approval_requests
approval_steps
approval_decisions
approval_comments
```

### Publishing

```text
publish_jobs
publishing_channels
manual_publish_evidence
publishing_status_history
tracking_links
utm_parameter_sets
evidence_hashes
```

### Connectors

```text
connectors
connector_accounts
connector_credentials
webhook_endpoints
webhook_event_logs
connector_sync_runs
connector_error_logs
```

### Performance

```text
performance_events
performance_metrics
campaign_metric_snapshots
channel_performance_snapshots
attribution_events
metric_confidence_scores
```

### CRM-lite

```text
contacts
contact_identifiers
contact_consents
lead_captures
contact_segments
campaign_contact_attributions
```

### Notifications

```text
notifications
notification_rules
notification_deliveries
notification_channels
alert_events
```

---

## Critical Constraints

### Workspace Isolation
كل جدول تشغيلي يجب أن يحتوي:
```text
workspace_id UUID NOT NULL
```

### Immutable Evidence
الجداول التالية لا تعدل محتواها بعد الإنشاء:
```text
manual_publish_evidence
evidence_hashes
approval_decisions
audit_logs
```

المسموح:
- إنشاء سجل invalidation جديد.
- إنشاء status history جديد.
- عدم تعديل الدليل الأصلي.

### Asset Version Approval
لا يسمح بـ PublishJob إلا إذا:
```text
media_asset_versions.approval_status = 'approved'
```

### Generation Commercial Usage
لا يتم احتساب usage billable إذا:
```text
generation_jobs.status IN ('failed', 'cancelled', 'rejected_by_system_error')
```

### Contact Consent
لا يسمح باستخدام Contact في campaign targeting إذا:
```text
contact_consents.status != 'granted'
```

إلا إذا كان الاستخدام لا يتطلب consent بحسب السياسة القانونية المحددة.

---

## Extended V1 Entities

```text
external_cms_references
external_crm_accounts
external_crm_contact_mappings
commerce_connectors
external_product_references
external_order_references
commerce_attribution_events
asset_performance_snapshots
variant_comparisons
experiment_lite_runs
```

---

## Post V1 Entities

```text
plugin_manifests
plugin_installations
plugin_permissions
workflow_definitions
workflow_runs
workflow_steps
omnichannel_threads
channel_messages
advanced_attribution_models
uplift_experiments
mmm_model_runs
```

---

## Rejected Entities for Current Scope

```text
erp_accounts
general_ledger
inventory_transactions
payment_settlements
chat_messages
chat_rooms
sales_deals
sales_forecasts
support_tickets
```

These entities should not be added to Marketing OS Core V1.
