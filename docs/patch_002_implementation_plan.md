# Patch 002 Implementation Plan

## 1. Executive Decision

```text
Patch 002 implementation planning: GO.
Patch 002 implementation: CONDITIONAL GO only after this plan is reviewed.
Patch 002 activation: NO-GO.
Sprint 5 coding: NO-GO.
Pilot: NO-GO.
Production: NO-GO.
```

This document is planning-only. It does not implement Patch 002, activate Patch 002, add endpoints, alter migration order, modify runtime code, modify SQL, modify OpenAPI, modify tests, or change business logic.

Current verified baseline:

```text
Sprint 0: Passed
Sprint 1: Passed
Sprint 2: Passed
Sprint 3: Passed
Sprint 4: Passed
Repository cleanup after Sprint 4: Passed and merged
Documentation reconciliation after Sprint 4: Passed and merged
Patch 002 reconciliation plan: Passed and merged
Latest verified main commit: 43aa7ba
GitHub Actions strict verification: Passed on main
```

## 2. Sources Reviewed

This plan was prepared after reviewing:

```text
README.md
docs/project_status_after_sprint_4.md
docs/patch_002_reconciliation_notes.md
docs/patch_002_pending_qa_addendum.md
docs/patch_002_reconciliation_plan.md
docs/17_change_log.md
docs/marketing_os_v5_6_5_codex_implementation_instructions.md
docs/marketing_os_v5_6_5_phase_0_1_competitive_patch_002.md
docs/marketing_os_v5_6_5_phase_0_1_contract_patch_002_competitive_features.md
docs/marketing_os_v5_6_5_phase_0_1_schema_patch_002.sql
docs/marketing_os_v5_6_5_phase_0_1_openapi_patch_002.yaml
docs/marketing_os_v5_6_5_phase_0_1_schema.sql
docs/marketing_os_v5_6_5_phase_0_1_schema_patch_001.sql
docs/marketing_os_v5_6_5_phase_0_1_openapi.yaml
docs/marketing_os_v5_6_5_phase_0_1_qa_test_suite.md
docs/marketing_os_v5_6_5_phase_0_1_backlog.md
src/rbac.js
scripts/db-migrate.js
scripts/openapi-lint.js
scripts/verify-sprint0.js
```

## 3. Scope Boundary

In scope for a future Patch 002 implementation, after plan review:

```text
Connector registry/account metadata.
Connector credential reference handling without raw secret storage.
Webhook endpoint and event logging.
Performance events and campaign metric snapshots.
Metric confidence score support.
CRM-lite contacts, identifiers, consents, and lead captures.
Notification rules and delivery tracking.
```

Out of scope:

```text
external provider execution
live sync execution
full CRM
commerce connector implementation
plugin system
advanced attribution
Strapi/Medusa/Slack/Mattermost/Frappe integrations
paid execution
auto-publishing
AI agents
BillingProvider / ProviderUsageLog
Pilot / Production
```

Patch 002 remains an internal metadata, logging, measurement, CRM-lite, and notification-tracking scope. It must not become a provider integration project.

## 4. Required Contract Decisions To Apply

Future implementation PRs must apply these decisions consistently across SQL, OpenAPI, QA, RBAC, router/store behavior, and documentation:

```text
Canonical name: connector_credentials / ConnectorCredential.
Do not use connector_credential_refs as the table/entity name.
Notification model: notification_rules + notification_deliveries only.
Do not add a standalone notifications table.
sync-runs are metadata/history only; no live external sync execution.
Webhook receive logs events and validates signatures; invalid signature must not mutate business state.
performance_events and campaign_metric_snapshots are append-only/immutable where applicable.
consent records are append-only.
notification delivery failure must not roll back the original operation.
```

Additional contract notes:

- `connector_credentials.secret_ref` is the credential reference. It is not permission to persist raw tokens, API keys, refresh tokens, signing secrets, or passwords.
- `notification_deliveries.admin_notification_id` must be reconciled before activation as either nullable metadata or an approved FK to the existing `admin_notifications` table.
- Patch 002 must not create `BillingProvider`, `ProviderUsageLog`, `GenerationJob`, `Asset`, or `Approval` entities.

## 5. Planned File Changes For A Future Implementation PR

The following are future implementation changes only. They are not made in this planning PR.

| Area | Planned file(s) | Plan |
| --- | --- | --- |
| SQL hardening | `docs/marketing_os_v5_6_5_phase_0_1_schema_patch_002.sql` | Harden trigger idempotency, confirm workspace scoping, secret references, append-only resources, and notification delivery relation. |
| OpenAPI alignment | `docs/marketing_os_v5_6_5_phase_0_1_openapi_patch_002.yaml` | Align naming, permissions, ErrorModel behavior, credential request/response shape, webhook semantics, and non-execution sync-run wording. |
| QA | `docs/marketing_os_v5_6_5_phase_0_1_qa_test_suite.md` or a dedicated Patch 002 QA file | Prefer canonical QA suite update if safe; otherwise create a dedicated Patch 002 QA addendum and explicitly link it. |
| RBAC | `src/rbac.js` | Add Patch 002 permissions and deliberate role mappings if not already seeded in runtime. |
| OpenAPI lint | `scripts/openapi-lint.js` | Include `openapi_patch_002.yaml` only if needed and safe after RBAC alignment. |
| Migration runner | `scripts/db-migrate.js` | Add Patch 002 to active migration order only if and when activation is explicitly approved. |
| Router/store | `src/router.js` / `src/store.js` | Implement in a later runtime PR only after SQL/OpenAPI/QA/RBAC hardening is accepted. |
| Implementation report | `docs/patch_002_implementation_report.md` | Create only during actual implementation, not in this planning PR. |

No SQL, OpenAPI, QA, RBAC, lint, migration runner, router, store, test, or package file is changed by this planning PR.

## 6. SQL Implementation Plan

Future SQL work must harden `docs/marketing_os_v5_6_5_phase_0_1_schema_patch_002.sql` before activation.

Required SQL decisions:

```text
Add DROP TRIGGER IF EXISTS before every Patch 002 CREATE TRIGGER.
Keep CREATE TYPE DO blocks.
Keep CREATE TABLE IF NOT EXISTS but document that changed columns/constraints are not auto-reconciled.
Keep CREATE INDEX IF NOT EXISTS.
Keep DROP POLICY IF EXISTS + CREATE POLICY pattern.
Confirm all new tables are workspace-scoped where applicable.
Confirm secrets use secret_ref only and no raw secret storage.
Confirm contact_consents, performance_events, campaign_metric_snapshots, metric_confidence_scores, webhook_event_logs are append-only.
Review notification_deliveries.admin_notification_id as nullable metadata or add an approved FK only if an existing admin_notifications table relation is confirmed.
Do not add Patch 002 to active migration order until activation is approved.
```

Trigger hardening list:

| Trigger | Table | Future required guard |
| --- | --- | --- |
| `trg_connectors_updated_at` | `connectors` | `DROP TRIGGER IF EXISTS trg_connectors_updated_at ON connectors;` |
| `trg_connector_accounts_updated_at` | `connector_accounts` | `DROP TRIGGER IF EXISTS trg_connector_accounts_updated_at ON connector_accounts;` |
| `trg_webhook_endpoints_updated_at` | `webhook_endpoints` | `DROP TRIGGER IF EXISTS trg_webhook_endpoints_updated_at ON webhook_endpoints;` |
| `trg_contacts_updated_at` | `contacts` | `DROP TRIGGER IF EXISTS trg_contacts_updated_at ON contacts;` |
| `trg_notification_rules_updated_at` | `notification_rules` | `DROP TRIGGER IF EXISTS trg_notification_rules_updated_at ON notification_rules;` |
| `trg_webhook_event_logs_append_only` | `webhook_event_logs` | `DROP TRIGGER IF EXISTS trg_webhook_event_logs_append_only ON webhook_event_logs;` |
| `trg_performance_events_append_only` | `performance_events` | `DROP TRIGGER IF EXISTS trg_performance_events_append_only ON performance_events;` |
| `trg_campaign_metric_snapshots_append_only` | `campaign_metric_snapshots` | `DROP TRIGGER IF EXISTS trg_campaign_metric_snapshots_append_only ON campaign_metric_snapshots;` |
| `trg_metric_confidence_scores_append_only` | `metric_confidence_scores` | `DROP TRIGGER IF EXISTS trg_metric_confidence_scores_append_only ON metric_confidence_scores;` |
| `trg_contact_consents_append_only` | `contact_consents` | `DROP TRIGGER IF EXISTS trg_contact_consents_append_only ON contact_consents;` |
| `trg_connector_credentials_immutable` | `connector_credentials` | `DROP TRIGGER IF EXISTS trg_connector_credentials_immutable ON connector_credentials;` |

Workspace scoping and references:

- `connectors`, `connector_accounts`, `connector_credentials`, `webhook_endpoints`, `webhook_event_logs`, `connector_sync_runs`, `connector_error_logs`, `performance_events`, `campaign_metric_snapshots`, `metric_confidence_scores`, `contacts`, `contact_identifiers`, `contact_consents`, `lead_captures`, `campaign_contact_attributions`, `notification_rules`, and `notification_deliveries` must include `workspace_id` or be strictly workspace-derived.
- Cross-table FKs should preserve workspace context where available.
- Append-only resources must be protected by retry-safe triggers and by absence of PATCH/DELETE runtime routes.

Activation rule:

```text
Patch 002 must not be added to scripts/db-migrate.js until activation is explicitly approved after contract hardening and runtime implementation pass strict CI.
```

## 7. OpenAPI Implementation Plan

Future OpenAPI work must align `docs/marketing_os_v5_6_5_phase_0_1_openapi_patch_002.yaml` with the canonical Patch 002 contract decisions.

Required OpenAPI checks:

```text
Ensure every Patch 002 route has x-permission metadata matching RBAC.
Ensure connector credential endpoint accepts only secret_ref or equivalent reference input, not raw_secret.
Ensure credential responses never echo raw secrets.
Ensure webhook endpoint behavior documents signature validation and non-mutating invalid signatures.
Ensure performance event endpoints do not imply advanced attribution.
Ensure sync-runs endpoint is read-only metadata/history.
Ensure notification endpoints do not imply Slack/Mattermost/email provider integration.
Ensure all errors use the existing ErrorModel.
Determine whether scripts/openapi-lint.js needs to include openapi_patch_002.yaml in addition to base OpenAPI and Sprint 3 patch.
```

Current Patch 002 OpenAPI route groups to preserve as metadata-only/internal-only:

```text
GET  /workspaces/{workspaceId}/connectors
POST /workspaces/{workspaceId}/connectors
GET  /workspaces/{workspaceId}/connectors/{connectorId}/accounts
POST /workspaces/{workspaceId}/connectors/{connectorId}/accounts
POST /workspaces/{workspaceId}/connectors/{connectorId}/accounts/{connectorAccountId}/credentials
GET  /workspaces/{workspaceId}/connectors/{connectorId}/sync-runs
POST /workspaces/{workspaceId}/webhooks/{endpointKey}
GET  /workspaces/{workspaceId}/campaigns/{campaignId}/performance-events
POST /workspaces/{workspaceId}/campaigns/{campaignId}/performance-events
GET  /workspaces/{workspaceId}/campaigns/{campaignId}/metric-snapshots
POST /workspaces/{workspaceId}/campaigns/{campaignId}/metric-snapshots
GET  /workspaces/{workspaceId}/contacts
POST /workspaces/{workspaceId}/contacts
GET  /workspaces/{workspaceId}/contacts/{contactId}/consents
POST /workspaces/{workspaceId}/contacts/{contactId}/consents
GET  /workspaces/{workspaceId}/campaigns/{campaignId}/lead-captures
POST /workspaces/{workspaceId}/campaigns/{campaignId}/lead-captures
GET  /workspaces/{workspaceId}/notification-rules
POST /workspaces/{workspaceId}/notification-rules
GET  /workspaces/{workspaceId}/notification-deliveries
```

Potential OpenAPI lint requirement:

- `scripts/openapi-lint.js` currently reads the base OpenAPI contract and the Sprint 3 patch.
- Patch 002 should be added to the lint input only after `src/rbac.js` includes the required Patch 002 permissions, otherwise strict lint may correctly fail on unknown `x-permission` values.

## 8. QA Implementation Plan

Future QA work must convert pending QA cases into executable tests or a canonical QA suite section. No Patch 002 QA case should be marked passing until implementation and CI verify it.

Minimum pending QA cases to include:

```text
QA-CON-001
QA-CON-002
QA-PERF-001
QA-PERF-002
QA-PERF-003
QA-CRM-001
QA-CRM-002
QA-CRM-003
QA-NOTIF-001
QA-NOTIF-002
```

Required expanded QA cases from reconciliation planning:

```text
connector registry tenant isolation and RBAC
connector account tenant isolation and RBAC
connector sync-runs read-only/no execution
webhook event log append-only behavior
credential response must not echo raw secrets
metric confidence score bounds
contact identifier uniqueness and tenant isolation
lead capture cross-workspace contact rejection
notification rule RBAC/tenant isolation/disabled-rule behavior
notification delivery failure without provider side effects
audit placeholder/event behavior for sensitive writes
ErrorModel consistency for Patch 002
```

QA acceptance map:

| QA group | Required future evidence |
| --- | --- |
| Connector credentials | `secret_ref` only, no raw secret persistence, no raw secret response echo, tenant isolation, RBAC deny. |
| Webhooks | Signature validation, invalid signature logs rejection only, no business-state mutation, append-only logs. |
| Performance | Workspace-scoped events, non-negative metric values, immutable snapshots, confidence score bounds. |
| CRM-lite | Workspace-scoped contacts, unique identifiers by workspace policy, append-only consents, cross-workspace lead/contact rejection. |
| Notifications | Rule RBAC/tenant isolation, disabled-rule behavior, delivery failure recorded without rollback or provider side effects. |
| Global controls | Audit placeholders/events for sensitive writes and consistent ErrorModel responses. |

Canonical QA strategy:

- Prefer updating `docs/marketing_os_v5_6_5_phase_0_1_qa_test_suite.md` if a safe append/edit path is available.
- Use a dedicated Patch 002 QA file only if canonical append remains unsafe.
- Runtime implementation tests should live in future `test/integration` coverage, not this planning PR.

## 9. RBAC Implementation Plan

Future implementation must compare Patch 002 SQL/OpenAPI permissions with `src/rbac.js`.

Required Patch 002 permissions:

```text
connector.read
connector.write
connector.rotate_secret
webhook.receive
performance.read
performance.event_create
performance.snapshot_create
contact.read
contact.create
contact.update
contact.consent_update
lead_capture.read
lead_capture.create
notification_rule.read
notification_rule.write
notification_delivery.read
```

Current runtime RBAC does not seed these Patch 002 permissions. A future implementation PR must update `src/rbac.js` deliberately.

Planned role mappings, subject to review:

| Role | Proposed Patch 002 grants | Rationale |
| --- | --- | --- |
| owner | All Patch 002 permissions | Owner already has full workspace authority. |
| admin | All Patch 002 permissions except possibly `webhook.receive` if webhook receive is service-only | Admin manages connectors, contacts, performance snapshots, and notification rules. |
| creator | `connector.read`, `performance.read`, `performance.event_create`, `performance.snapshot_create`, `contact.read`, `contact.create`, `contact.update`, `lead_capture.read`, `lead_capture.create`, `notification_rule.read`, `notification_delivery.read` | Creator can operate campaign/performance/contact workflows, but should not rotate secrets. |
| reviewer | `performance.read`, `contact.read`, `lead_capture.read`, `notification_rule.read`, `notification_delivery.read` | Reviewers need read-only campaign context only. |
| publisher | `connector.read`, `performance.read`, `performance.event_create`, `contact.read`, `lead_capture.read`, `lead_capture.create`, `notification_rule.read`, `notification_delivery.read` | Publishers may record post-publish performance or lead evidence, but should not manage secrets/rules by default. |
| billing_admin | `performance.read` only if cost/performance reporting requires it | Avoid broad contact, webhook, and connector authority. |
| viewer | Read-only permissions only where already justified: `connector.read`, `performance.read`, `contact.read`, `lead_capture.read`, `notification_rule.read`, `notification_delivery.read`; no write, secret, or webhook permissions | Viewer must not receive write, secret, webhook, or delivery-control permissions. |

RBAC guardrails:

```text
Viewer roles must not receive write/secret/webhook permissions unless a later approved role model explicitly justifies it.
connector.rotate_secret should be limited to owner/admin unless a security review approves otherwise.
webhook.receive may be service/system scoped; if modeled as user permission, it must not be granted broadly.
notification_rule.write should be owner/admin by default.
contact.consent_update should be owner/admin/creator only if consent workflow ownership is accepted.
```

## 10. Router/Store Implementation Plan For Later PR

Runtime implementation must wait until SQL/OpenAPI/QA/RBAC hardening is accepted.

Required runtime guardrails:

```text
Preserve AuthGuard, WorkspaceContextGuard, MembershipCheck, PermissionGuard.
Do not trust workspace_id from request body.
Every workspace-scoped query must include route workspace context.
Credential handling must store only secret_ref and never echo raw secrets.
Invalid webhook signature must not change business state.
Append-only resources must not expose PATCH/DELETE routes.
Notification delivery failures must be recorded but not roll back original operations.
CostEvent remains not billing/invoice.
No external provider execution.
```

Future router/store route groups:

- Connector metadata list/create and account list/create.
- Credential reference creation with `secret_ref` only.
- Connector sync-run list only; no live sync start/run endpoint.
- Webhook receive with signature validation result and event-log behavior.
- Performance event list/create and metric snapshot list/create.
- Contact list/create, consent history list/append, lead capture list/create.
- Notification rule list/create and notification delivery list.

Runtime must reject or omit:

```text
PATCH/DELETE for webhook_event_logs, performance_events, campaign_metric_snapshots, metric_confidence_scores, contact_consents.
External provider sync or publish execution.
Provider-specific notification delivery.
BillingProvider / ProviderUsageLog creation.
Advanced attribution outputs or decisioning.
```

Sensitive writes should append audit placeholders/events consistent with Sprint 1-4 behavior until persistent audit hardening is explicitly in scope.

## 11. Activation Sequence

```text
Phase A: Planning PR only.
Phase B: Contract hardening PR.
Phase C: Runtime implementation PR.
Phase D: Activation decision.
```

Phase A: Planning PR only

- Create this planning document.
- Do not modify code, SQL, OpenAPI, tests, package files, router/store files, or migration order.

Phase B: Contract hardening PR

```text
SQL Patch 002 idempotency.
OpenAPI Patch 002 alignment.
QA canonical/addendum integration.
RBAC permission seed alignment.
No router/store implementation yet unless explicitly approved.
```

Phase C: Runtime implementation PR

```text
router/store implementation.
integration tests.
strict verification.
Patch 002 implementation report.
```

Phase D: Activation decision

```text
Only after Phase B and C pass GitHub Actions.
Only after migration runner order is explicitly approved.
Only after Patch 002 implementation report is created.
```

Patch 002 activation remains NO-GO until Phase D.

## 12. Verification Gates For Future Implementation

Future implementation must pass:

```bash
npm test
npm run test:integration
npm run openapi:lint:strict
npm run db:seed
npm run db:migrate:strict
npm run verify:strict
```

Also required:

```text
GitHub Actions strict verification.
Migration retry test if Patch 002 is added to migration order.
OpenAPI/RBAC permission alignment check.
Tenant isolation tests across every Patch 002 route group.
No-raw-secret persistence/response test.
Invalid webhook signature no-business-mutation test.
Append-only mutation rejection tests.
```

## 13. Risk Register

| Risk | Description | Control |
| --- | --- | --- |
| tenant isolation risk | Patch 002 adds many workspace-scoped resources; any route or FK missing workspace context can leak data. | Route workspace validation, workspace-scoped FKs, RLS review, tenant isolation tests for every route group. |
| raw secret storage/echo risk | Credential endpoint could accidentally store or return raw secrets. | Accept/store only `secret_ref`, reject raw secret fields, redact responses, test no raw echo. |
| webhook signature validation risk | Signature validation could be skipped or happen after mutation. | Validate before business handling; record invalid event as rejected only. |
| webhook business-state mutation risk | Invalid or untrusted webhook could alter campaigns, contacts, usage, publish, or evidence state. | Invalid signatures must not mutate business state; add regression tests. |
| performance event immutability risk | Performance events could be altered after creation. | Append-only trigger and no PATCH/DELETE route. |
| metric snapshot immutability risk | Snapshots/confidence scores could change after reporting. | Append-only trigger and no mutation route. |
| CRM consent legal/history risk | Consent updates could overwrite legal history. | Append-only consent records only. |
| cross-workspace lead/contact risk | Lead captures could link a campaign/contact from another workspace. | Validate campaign and contact through route workspace context. |
| notification failure rollback risk | Notification delivery failure could roll back source operation. | Delivery failure recorded independently; original operation remains committed. |
| notification provider scope creep risk | Notification rules could become Slack/Mattermost/email provider integrations. | Keep as rules/delivery tracking only; no provider execution. |
| migration retry/idempotency risk | Patch 002 raw CREATE TRIGGER statements can fail on retry. | Add exact `DROP TRIGGER IF EXISTS` guards and migration retry test. |
| OpenAPI/RBAC mismatch risk | Patch 002 OpenAPI declares permissions absent from runtime RBAC. | Update RBAC before including Patch 002 in strict OpenAPI lint. |
| advanced attribution scope creep risk | Performance metrics could become attribution decisioning. | Restrict to events/snapshots/confidence only; no attribution models or decisions. |

## 14. Final Recommendation

Selected recommendation:

```text
Split Patch 002: contract hardening now, runtime implementation later.
```

Reasoning:

- Patch 002 already has useful contract artifacts, but the reconciliation notes identify naming, notification model, QA, RBAC, OpenAPI lint, and migration idempotency risks.
- Contract hardening before Sprint 5 planning reduces ambiguity and prevents a future runtime implementation from encoding conflicting names such as `connector_credential_refs` versus `connector_credentials`.
- Runtime implementation should wait until SQL, OpenAPI, QA, and RBAC are aligned, because implementing handlers first would increase the risk of business logic drift and test churn.
- Sprint 5 planning can proceed only after stakeholders decide whether Patch 002 is part of Sprint 5 scope or remains a separate contract/runtime track.

Execution recommendation:

```text
1. Review and approve this implementation plan.
2. Open a Patch 002 contract hardening PR.
3. Keep Patch 002 runtime implementation separate.
4. Keep Patch 002 activation, Sprint 5 coding, Pilot, and Production as NO-GO until their explicit gates pass.
```

## 15. Documentation-Only Statement

No code changes were made by this plan. No Patch 002 implementation is complete. No Patch 002 activation is approved.
