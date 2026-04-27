# Marketing OS V5.6.5 — Codex Patch 002 Execution Instructions

> **Document type:** Binding Codex execution addendum  
> **Applies to:** `docs/marketing_os_v5_6_5_codex_implementation_instructions.md`  
> **Patch authority:** `docs/marketing_os_v5_6_5_phase_0_1_competitive_patch_002.md`  
> **SQL:** `docs/marketing_os_v5_6_5_phase_0_1_schema_patch_002.sql`  
> **OpenAPI:** `docs/marketing_os_v5_6_5_phase_0_1_openapi_patch_002.yaml`  
> **QA:** `docs/marketing_os_v5_6_5_phase_0_1_qa_patch_002.md`  
> **Status:** Binding after owner approval  
> **Scope:** Phase 0/Core V1 only

---

## 1. Executive Instruction

Codex must treat Patch 002 as a narrow execution contract.

Patch 002 does not authorize broad product expansion. It authorizes only:

```text
1. Connector baseline registry and webhook logging.
2. Basic performance event ingestion and metric snapshots.
3. CRM-lite contact, consent, lead capture, and campaign-contact attribution.
4. Notification rule and delivery tracking.
```

Patch 002 does not authorize:

```text
Strapi integration
Medusa integration
Frappe CRM sync
Mattermost integration
Slack integration
External CRM bidirectional sync
Commerce connector
Full CRM
Full CMS
Full ERP
Internal chat
Plugin system
Omnichannel inbox
Workflow builder
Advanced attribution
MMM
Uplift modeling
```

If asked to implement any forbidden area, Codex must stop and report scope violation.

---

## 2. Mandatory Source Order

Codex must read the documents in this order before implementing any Patch 002 work:

```text
1. docs/marketing_os_v5_6_5_phase_0_1_erd.md
2. docs/marketing_os_v5_6_5_phase_0_1_schema.sql
3. docs/marketing_os_v5_6_5_phase_0_1_schema_patch_001.sql
4. docs/marketing_os_v5_6_5_phase_0_1_contract_patch_001.md
5. docs/marketing_os_v5_6_5_phase_0_1_competitive_patch_002.md
6. docs/marketing_os_v5_6_5_phase_0_1_schema_patch_002.sql
7. docs/marketing_os_v5_6_5_phase_0_1_openapi.yaml
8. docs/marketing_os_v5_6_5_phase_0_1_openapi_patch_002.yaml
9. docs/marketing_os_v5_6_5_phase_0_1_backlog.md
10. docs/marketing_os_v5_6_5_phase_0_1_qa_test_suite.md
11. docs/marketing_os_v5_6_5_phase_0_1_qa_patch_002.md
12. docs/marketing_os_v5_6_5_codex_implementation_instructions.md
13. docs/marketing_os_v5_6_5_codex_patch_002_instructions.md
```

---

## 3. Mandatory SQL Migration Order

Codex must apply SQL in this exact order:

```text
1. docs/marketing_os_v5_6_5_phase_0_1_schema.sql
2. docs/marketing_os_v5_6_5_phase_0_1_schema_patch_001.sql
3. docs/marketing_os_v5_6_5_phase_0_1_schema_patch_002.sql
```

Rules:

```text
- Patch 001 remains mandatory.
- Patch 002 must never be applied without the base schema and Patch 001.
- Patch 002 must not modify or weaken Patch 001 approval/evidence protections.
- If SQL dry-run fails, Codex must stop and report the failing statement.
- Codex must not silently remove RLS, triggers, constraints, or append-only protections.
```

---

## 4. Mandatory OpenAPI Contract Order

Codex must validate OpenAPI in this order:

```text
1. docs/marketing_os_v5_6_5_phase_0_1_openapi.yaml
2. docs/marketing_os_v5_6_5_phase_0_1_openapi_patch_002.yaml
```

Patch 002 paths are additive only.

Codex must not merge in or invent endpoints for:

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

---

## 5. Implementation Order for Patch 002

Patch 002 must not start before Sprint 0 baseline passes.

Required order:

```text
1. Confirm base schema + Patch 001 migration passes.
2. Apply Patch 002 migration.
3. Confirm new RLS policies exist for Patch 002 tables.
4. Add backend models/repositories for connector baseline only.
5. Add webhook event logging without business mutation on invalid signature.
6. Add performance event and metric snapshot APIs.
7. Add CRM-lite contact/consent/lead-capture APIs.
8. Add notification rule/delivery tracking APIs.
9. Add QA Patch 002 tests.
10. Run OpenAPI validation.
11. Run integration tests.
12. Produce implementation report.
```

---

## 6. Patch 002 Allowed Modules

Codex may add modules only for:

```text
connectors
webhook-logs
performance
contacts
lead-captures
notification-deliveries
```

These modules must remain inside Phase 0/Core V1 boundaries.

---

## 7. Patch 002 Forbidden Modules

Codex must not add modules for:

```text
strapi
medusa
mattermost
slack
frappe
crm-sync
commerce
plugins
omnichannel-inbox
workflow-builder
advanced-attribution
mmm
uplift-modeling
sales-deals
sales-pipeline
sales-forecast
quotes
support-tickets
internal-chat
```

---

## 8. Security and Governance Rules

### Connector security

```text
- Store secret_ref only.
- Never store raw access token, API key, refresh token, signing secret, or OAuth secret in DB.
- Webhook signature must be validated.
- signature_valid=false must not mutate business state.
- webhook_event_logs must be append-only.
```

### Performance

```text
- performance_events.metric_value must be >= 0.
- campaign_metric_snapshots must be append-only.
- metric_confidence_scores must be append-only.
- No advanced attribution decision is allowed in Phase 0/Core V1.
```

### CRM-lite

```text
- ContactIdentifier stores hashed values where possible.
- ContactConsent is append-only.
- Consent changes create new rows.
- Do not create deals, pipelines, forecasts, quotes, CRM activities, or support tickets.
```

### Notifications

```text
- Notification failure must not rollback the original business transaction.
- Mattermost/Slack external delivery is Extended V1 and must not be implemented now.
```

---

## 9. Required QA Additions

Codex must add and run the QA cases from:

```text
docs/marketing_os_v5_6_5_phase_0_1_qa_patch_002.md
```

Minimum blocking checks:

```text
QA-CON-001
QA-CON-002
QA-CON-003
QA-CON-004
QA-PERF-001
QA-PERF-002
QA-PERF-003
QA-PERF-004
QA-CRM-001
QA-CRM-002
QA-CRM-003
QA-CRM-004
QA-NOTIF-002
QA-SCOPE-001
```

`QA-NOTIF-001` must pass if notification delivery worker behavior is implemented. If delivery worker is not implemented yet, Codex must explicitly mark it as deferred with risk acceptance, not silently ignore it.

---

## 10. Stop Conditions

Codex must stop if any of these occur:

```text
1. Patch 002 SQL migration fails.
2. Patch 002 weakens Patch 001 approval/evidence rules.
3. Raw connector secret is stored in DB.
4. Invalid webhook signature mutates business state.
5. Performance metrics allow negative values.
6. Metric snapshots become mutable.
7. Contact consent becomes mutable.
8. Full CRM tables/endpoints are introduced.
9. External integrations are introduced.
10. Advanced attribution is introduced.
11. Workspace isolation fails for any Patch 002 table.
12. OpenAPI exposes forbidden Extended V1 paths.
```

---

## 11. Required Final Report

After implementation, Codex must produce a report covering:

```text
- Applied SQL files in exact order.
- OpenAPI files validated.
- Patch 002 tables created.
- RLS policies verified.
- Append-only triggers verified.
- Permission seeds added.
- QA Patch 002 cases passed/failed.
- Any deferred notification worker behavior.
- Confirmation that Extended V1 integrations were not implemented.
```

---

## 12. Final Codex Decision

```text
GO: Implement Patch 002 only after owner approval and after Sprint 0/base + Patch 001 pass.
NO-GO: Implement Patch 002 directly before the base schema and Patch 001.
NO-GO: Treat Patch 002 as permission for external integrations.
NO-GO: Move into Extended V1 without a new approved contract.
```
