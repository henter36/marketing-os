# Patch 002 Reconciliation Plan

## 1. Executive Decision

- Patch 002 activation: NO-GO.
- Patch 002 reconciliation: GO.
- Sprint 5 coding: NO-GO until this plan is reviewed and approved.
- Pilot: NO-GO.
- Production: NO-GO.

This document is planning-only. It does not implement Patch 002, activate Patch 002 migrations, add endpoints, modify OpenAPI, modify SQL, change tests, or change application code.

Current verified baseline used for this plan:

- Sprint 0 passed.
- Sprint 1 passed.
- Sprint 2 passed.
- Sprint 3 passed.
- Sprint 4 passed.
- Repository cleanup after Sprint 4 passed and was merged to main.
- Documentation reconciliation after Sprint 4 passed and was merged to main.
- Latest verified main commit: `db32d4c`.
- GitHub Actions strict verification passed on main.

## 2. Source Review

The plan was prepared after reviewing the required project status, change log, Codex instructions, Patch 002 materials, and baseline conflict files:

- `README.md`
- `docs/project_status_after_sprint_4.md`
- `docs/patch_002_reconciliation_notes.md`
- `docs/patch_002_pending_qa_addendum.md`
- `docs/17_change_log.md`
- `docs/marketing_os_v5_6_5_codex_implementation_instructions.md`
- `docs/marketing_os_v5_6_5_phase_0_1_competitive_patch_002.md`
- `docs/marketing_os_v5_6_5_phase_0_1_contract_patch_002_competitive_features.md`
- `docs/marketing_os_v5_6_5_phase_0_1_schema_patch_002.sql`
- `docs/marketing_os_v5_6_5_phase_0_1_openapi_patch_002.yaml`
- `docs/marketing_os_v5_6_5_phase_0_1_schema.sql`
- `docs/marketing_os_v5_6_5_phase_0_1_schema_patch_001.sql`
- `docs/marketing_os_v5_6_5_phase_0_1_openapi.yaml`
- `docs/marketing_os_v5_6_5_phase_0_1_qa_test_suite.md`
- `docs/marketing_os_v5_6_5_phase_0_1_backlog.md`

## 3. Patch 002 Scope Confirmation

Patch 002 reconciliation should remain limited to the competitive baseline scope already described by the Patch 002 files:

- Connector baseline registry.
- Connector account metadata.
- Credential reference storage that does not store raw secrets.
- Webhook endpoint and webhook event logging.
- Performance events.
- Campaign metric confidence snapshots.
- CRM-lite contacts, identifiers, consents, and lead captures.
- Notification rules and notification delivery tracking.

Explicitly out of scope:

- External integration execution.
- Full CRM.
- Commerce connector implementation.
- Plugin framework.
- Advanced attribution.
- Strapi integration.
- Medusa integration.
- Slack integration.
- Mattermost integration.
- Frappe integration.
- Any provider-side publishing, syncing, or paid execution behavior.

Connector types and connector metadata may exist as registry records, but Patch 002 must not perform live external integration work until a later approved scope explicitly allows it.

## 4. Naming Reconciliation

### References Found

| Source | Naming Found | Notes |
| --- | --- | --- |
| Competitive Patch 002 brief | `ConnectorCredential`, `connector_credentials` | Treats credentials as secret references and requires no raw secret storage. |
| Contract Patch 002 | `ConnectorCredentialRef`, `connector_credential_refs` | Describes the same concept as a reference, using a different table/entity name. |
| Patch 002 SQL | `connector_credentials`, `connector_credential_id`, `secret_ref` | SQL creates `connector_credentials` and enforces immutability of `secret_ref`. |
| Patch 002 OpenAPI | Credential reference wording, `connector_credential_id`, `/credentials` path | API language references credential references while response fields match SQL-style `connector_credential_id`. |
| Pending QA addendum | `connector credentials` | QA intent is focused on preventing raw secret storage. |

### Recommendation

Use `connector_credentials` as the canonical SQL table and persistence entity name, with `ConnectorCredential` as the canonical domain/API entity name.

Rationale:

- The SQL patch already uses `connector_credentials`.
- The competitive Patch 002 brief uses `ConnectorCredential` and `connector_credentials`.
- The OpenAPI field name `connector_credential_id` already aligns with `connector_credentials`.
- The safety requirement is captured by the `secret_ref` field and by QA, not by the table name alone.

Future implementation PRs should align SQL, OpenAPI, docs, QA, RBAC seed naming, and handler names to the canonical `connector_credentials` / `ConnectorCredential` name. Contract references to `connector_credential_refs` and `ConnectorCredentialRef` should be reconciled before any Patch 002 activation. The API documentation can still state that the stored record is a credential reference and must never contain raw secret material.

No naming changes are made in this planning PR.

## 5. Notification Model Reconciliation

Patch 002 currently has inconsistent notification wording:

- The competitive patch emphasizes notification rules and delivery attempts.
- The contract patch references `notification_rules`, `notifications`, and `notification_deliveries`.
- Patch 002 SQL creates `notification_rules` and `notification_deliveries` only.
- Patch 002 SQL has `notification_deliveries.admin_notification_id`, but no standalone `notifications` table.
- Patch 002 OpenAPI exposes `notification-rules` and `notification-deliveries`, but no standalone `notifications` route.

### Options

| Option | Model | Assessment |
| --- | --- | --- |
| A | `notification_rules` + `notification_deliveries` only | Lowest scope, aligns with SQL and OpenAPI, keeps Patch 002 as delivery tracking rather than a user notification product. |
| B | Add standalone `notifications` table | Expands Patch 002 scope, implies unread/read lifecycle and extra routes not present in OpenAPI patch. |
| C | Use both standalone `notifications` plus rules/deliveries | Highest complexity, likely duplicates existing admin notification concepts and increases QA/RBAC burden. |

### Recommendation

Use option A: `notification_rules` + `notification_deliveries` only.

If Patch 002 needs to reference existing admin notification records, future reconciliation should decide whether `notification_deliveries.admin_notification_id` must become a foreign key to the existing admin notification table. It should not introduce a new standalone `notifications` table in Patch 002 unless a separately approved contract expands the scope.

Implementation risk and scope impact:

- Option A keeps Patch 002 focused on rules and delivery tracking.
- It avoids introducing read/unread notification workflows, user inbox behavior, or provider-specific notification integrations.
- It keeps OpenAPI reconciliation smaller because the current OpenAPI patch has no standalone `/notifications` routes.
- The main remaining risk is clarifying whether `admin_notification_id` is nullable metadata or a true relationship requiring a foreign key.

No notification SQL or OpenAPI changes are made in this planning PR.

## 6. Migration Idempotency Review

### Unsafe Trigger Statements

`docs/marketing_os_v5_6_5_phase_0_1_schema_patch_002.sql` contains raw `CREATE TRIGGER` statements that are not retry-safe if the migration is re-run after a partial or successful application:

| Trigger | Table | Required future hardening |
| --- | --- | --- |
| `trg_connectors_updated_at` | `connectors` | Add `DROP TRIGGER IF EXISTS trg_connectors_updated_at ON connectors;` before `CREATE TRIGGER`. |
| `trg_connector_accounts_updated_at` | `connector_accounts` | Add `DROP TRIGGER IF EXISTS trg_connector_accounts_updated_at ON connector_accounts;` before `CREATE TRIGGER`. |
| `trg_webhook_endpoints_updated_at` | `webhook_endpoints` | Add `DROP TRIGGER IF EXISTS trg_webhook_endpoints_updated_at ON webhook_endpoints;` before `CREATE TRIGGER`. |
| `trg_contacts_updated_at` | `contacts` | Add `DROP TRIGGER IF EXISTS trg_contacts_updated_at ON contacts;` before `CREATE TRIGGER`. |
| `trg_notification_rules_updated_at` | `notification_rules` | Add `DROP TRIGGER IF EXISTS trg_notification_rules_updated_at ON notification_rules;` before `CREATE TRIGGER`. |
| `trg_webhook_event_logs_append_only` | `webhook_event_logs` | Add `DROP TRIGGER IF EXISTS trg_webhook_event_logs_append_only ON webhook_event_logs;` before `CREATE TRIGGER`. |
| `trg_performance_events_append_only` | `performance_events` | Add `DROP TRIGGER IF EXISTS trg_performance_events_append_only ON performance_events;` before `CREATE TRIGGER`. |
| `trg_campaign_metric_snapshots_append_only` | `campaign_metric_snapshots` | Add `DROP TRIGGER IF EXISTS trg_campaign_metric_snapshots_append_only ON campaign_metric_snapshots;` before `CREATE TRIGGER`. |
| `trg_metric_confidence_scores_append_only` | `metric_confidence_scores` | Add `DROP TRIGGER IF EXISTS trg_metric_confidence_scores_append_only ON metric_confidence_scores;` before `CREATE TRIGGER`. |
| `trg_contact_consents_append_only` | `contact_consents` | Add `DROP TRIGGER IF EXISTS trg_contact_consents_append_only ON contact_consents;` before `CREATE TRIGGER`. |
| `trg_connector_credentials_immutable` | `connector_credentials` | Add `DROP TRIGGER IF EXISTS trg_connector_credentials_immutable ON connector_credentials;` before `CREATE TRIGGER`. |

### Already Retry-Safe Patterns

The following patterns are already suitable for repeated execution:

- `CREATE TYPE` statements wrapped in `DO $$ ... EXCEPTION WHEN duplicate_object THEN NULL; END $$;`.
- `CREATE TABLE IF NOT EXISTS` for Patch 002 tables.
- `CREATE INDEX IF NOT EXISTS` for Patch 002 indexes.
- `ALTER TABLE ... ENABLE ROW LEVEL SECURITY`, which is repeat-safe.
- `DROP POLICY IF EXISTS ...; CREATE POLICY ...`, which is policy-idempotent.
- RBAC permission inserts using `ON CONFLICT (permission_code) DO NOTHING`.

### Remaining Migration Risks

- `CREATE TABLE IF NOT EXISTS` does not reconcile changed columns, constraints, or foreign keys if a previous partial version of the table exists.
- The `notification_deliveries.admin_notification_id` field is not backed by a clear Patch 002 foreign key relationship.
- The trigger hardening must use exact trigger/table pairs; otherwise a retry can still fail.

### Future SQL Patching Approach

A future implementation PR should:

1. Keep Patch 002 out of the active migration order until reconciliation is complete.
2. Add `DROP TRIGGER IF EXISTS <trigger_name> ON <table_name>;` immediately before each Patch 002 `CREATE TRIGGER` statement.
3. Preserve existing shared trigger functions such as `set_updated_at`, `prevent_update_delete`, and `prevent_column_update` unless a reviewed schema gap proves a new function is required.
4. Review `notification_deliveries.admin_notification_id` and either add an approved foreign key to the existing admin notification table or document it as nullable external metadata.
5. Run strict migration verification from a clean database and then a second retry pass against the same database before activation.

No SQL changes are made in this planning PR.

## 7. OpenAPI Reconciliation

### Patch 002 Endpoints Found

| Method | Route | x-permission | Scope Assessment |
| --- | --- | --- | --- |
| `GET` | `/workspaces/{workspaceId}/connectors` | `connector.read` | In scope as connector registry read. |
| `POST` | `/workspaces/{workspaceId}/connectors` | `connector.write` | In scope if it creates metadata only and performs no external integration. |
| `GET` | `/workspaces/{workspaceId}/connectors/{connectorId}/accounts` | `connector.read` | In scope as connector account metadata read. |
| `POST` | `/workspaces/{workspaceId}/connectors/{connectorId}/accounts` | `connector.write` | In scope if account metadata only. |
| `POST` | `/workspaces/{workspaceId}/connectors/{connectorId}/accounts/{connectorAccountId}/credentials` | `connector.rotate_secret` | In scope if it stores only `secret_ref` and never raw secrets. |
| `GET` | `/workspaces/{workspaceId}/connectors/{connectorId}/sync-runs` | `connector.read` | In scope as read-only metadata/history, but must not imply live sync execution. |
| `POST` | `/workspaces/{workspaceId}/webhooks/{endpointKey}` | `webhook.receive` | In scope for signature validation and event logging only. |
| `GET` | `/workspaces/{workspaceId}/campaigns/{campaignId}/performance-events` | `performance.read` | In scope. |
| `POST` | `/workspaces/{workspaceId}/campaigns/{campaignId}/performance-events` | `performance.event_create` | In scope if append-only and not advanced attribution. |
| `GET` | `/workspaces/{workspaceId}/campaigns/{campaignId}/metric-snapshots` | `performance.read` | In scope. |
| `POST` | `/workspaces/{workspaceId}/campaigns/{campaignId}/metric-snapshots` | `performance.snapshot_create` | In scope if append-only. |
| `GET` | `/workspaces/{workspaceId}/contacts` | `contact.read` | In scope as CRM-lite. |
| `POST` | `/workspaces/{workspaceId}/contacts` | `contact.create` | In scope as CRM-lite. |
| `GET` | `/workspaces/{workspaceId}/contacts/{contactId}/consents` | `contact.read` | In scope as CRM-lite consent history. |
| `POST` | `/workspaces/{workspaceId}/contacts/{contactId}/consents` | `contact.consent_update` | In scope if append-only. |
| `GET` | `/workspaces/{workspaceId}/campaigns/{campaignId}/lead-captures` | `lead_capture.read` | In scope as CRM-lite lead capture. |
| `POST` | `/workspaces/{workspaceId}/campaigns/{campaignId}/lead-captures` | `lead_capture.create` | In scope if campaign and contact are workspace-scoped. |
| `GET` | `/workspaces/{workspaceId}/notification-rules` | `notification_rule.read` | In scope. |
| `POST` | `/workspaces/{workspaceId}/notification-rules` | `notification_rule.write` | In scope if it defines rules only and does not integrate providers. |
| `GET` | `/workspaces/{workspaceId}/notification-deliveries` | `notification_delivery.read` | In scope as delivery tracking. |

### Forbidden Scope Review

No Patch 002 OpenAPI route directly implements Strapi, Medusa, Slack, Mattermost, Frappe, full CRM, commerce workflows, plugins, or advanced attribution. However, connector metadata and notification wording must be constrained carefully:

- Connector routes must not perform external sync, external credential exchange, provider publishing, or paid execution.
- `sync-runs` must remain read-only metadata/history unless a future approved scope adds execution.
- Notification rules and deliveries must not introduce Slack, Mattermost, email provider, or webhook delivery integrations in Patch 002.
- Performance endpoints must not introduce advanced attribution beyond append-only events and snapshots.

### x-permission Metadata

Patch 002 endpoints include x-permission metadata. Future reconciliation should verify that each permission also exists in RBAC seed data before activation:

- `connector.read`
- `connector.write`
- `connector.rotate_secret`
- `webhook.receive`
- `performance.read`
- `performance.event_create`
- `performance.snapshot_create`
- `contact.read`
- `contact.create`
- `contact.consent_update`
- `lead_capture.read`
- `lead_capture.create`
- `notification_rule.read`
- `notification_rule.write`
- `notification_delivery.read`

### OpenAPI Routes Lacking Direct Pending QA Coverage

The pending QA addendum covers the highest-risk behaviors, but the following route groups need explicit QA additions before implementation can be considered complete:

| Route Group | Missing QA Coverage |
| --- | --- |
| Connector registry and account create/list | Tenant isolation, RBAC allow/deny, and no external side effects. |
| Connector sync-runs read | Tenant isolation and confirmation that the route does not execute sync. |
| Credential endpoint response shape | Confirmation that raw secrets are neither persisted nor echoed. |
| Webhook event logs | Append-only behavior and rejection-state logging. |
| Metric confidence snapshots | Confidence score range and relationship to metric snapshots. |
| Contact identifiers | Tenant isolation and uniqueness behavior. |
| Lead captures | Cross-workspace contact rejection, not only cross-workspace campaign rejection. |
| Notification rules | Tenant isolation, RBAC allow/deny, and disabled-rule behavior. |
| Notification deliveries | Failed delivery recording without provider integration side effects. |
| Audit behavior | Sensitive Patch 002 writes should create audit events or a documented placeholder if persistence is not in scope. |
| ErrorModel behavior | Patch 002 errors should use the existing unified ErrorModel. |

No OpenAPI changes are made in this planning PR.

## 8. QA Reconciliation

Pending QA cases remain pending and not passing. They should be treated as activation blockers until implemented and verified.

| QA Case | SQL Table(s) | OpenAPI Endpoint(s) | Required Permission(s) | Expected Negative Case | Expected Tenant Isolation Behavior |
| --- | --- | --- | --- | --- | --- |
| QA-CON-001: connector credentials must not store raw secrets. | `connector_credentials`, `connector_accounts`, `connectors` | `POST /workspaces/{workspaceId}/connectors/{connectorId}/accounts/{connectorAccountId}/credentials` | `connector.rotate_secret` | Raw secret material in request must not be persisted or returned; only `secret_ref` is allowed. | Connector and account IDs must belong to the route workspace. Cross-workspace account IDs must be rejected. |
| QA-CON-002: invalid webhook signature must not change business state. | `webhook_endpoints`, `webhook_event_logs`; any target business table must remain unchanged | `POST /workspaces/{workspaceId}/webhooks/{endpointKey}` | `webhook.receive` | Invalid signature records a rejected/failed event if logging is approved, but must not mutate campaigns, contacts, publish state, evidence, or usage. | Endpoint key and workspace route must resolve to the same workspace; cross-workspace endpoint use must be rejected. |
| QA-PERF-001: performance events are isolated by workspace. | `performance_events`, `campaigns` | `GET/POST /workspaces/{workspaceId}/campaigns/{campaignId}/performance-events` | `performance.read`, `performance.event_create` | Workspace A must not create or read events for a Workspace B campaign. | All queries and inserts must filter through route workspace and campaign workspace. |
| QA-PERF-002: `metric_value` cannot be negative. | `performance_events` | `POST /workspaces/{workspaceId}/campaigns/{campaignId}/performance-events` | `performance.event_create` | Negative `metric_value` must be rejected with ErrorModel-aligned validation behavior or a database constraint failure mapped to ErrorModel. | Validation occurs only after confirming the campaign belongs to the route workspace. |
| QA-PERF-003: `campaign_metric_snapshot` is immutable. | `campaign_metric_snapshots`, `metric_confidence_scores` | `GET/POST /workspaces/{workspaceId}/campaigns/{campaignId}/metric-snapshots` | `performance.read`, `performance.snapshot_create` | Updates and deletes must be impossible; no PATCH/DELETE route should exist and direct mutation should fail. | Snapshot list/create must be scoped to route workspace and campaign workspace. |
| QA-CRM-001: contacts are isolated by workspace. | `contacts`, `contact_identifiers`, `contact_consents` | `GET/POST /workspaces/{workspaceId}/contacts` | `contact.read`, `contact.create` | Workspace A cannot read, infer, create against, or update Workspace B contact records. | Every contact query must include workspace context. |
| QA-CRM-002: `contact_consent` is append-only. | `contact_consents`, `contacts` | `GET/POST /workspaces/{workspaceId}/contacts/{contactId}/consents` | `contact.read`, `contact.consent_update` | Existing consent records cannot be overwritten, updated, or deleted. New consent state must append a new record. | Contact ID must belong to the route workspace before consent history is listed or appended. |
| QA-CRM-003: `lead_capture` cannot link campaign from another workspace. | `lead_captures`, `campaigns`, `contacts` | `GET/POST /workspaces/{workspaceId}/campaigns/{campaignId}/lead-captures` | `lead_capture.read`, `lead_capture.create` | Route workspace A cannot link a lead capture to a campaign from workspace B. Future QA should also reject contact IDs from another workspace. | Campaign and contact references must be validated against the same route workspace. |
| QA-NOTIF-001: failed notification delivery must not roll back original operation. | `notification_rules`, `notification_deliveries`; source operation table depends on event | `POST /workspaces/{workspaceId}/notification-rules`, `GET /workspaces/{workspaceId}/notification-deliveries` | `notification_rule.write`, `notification_delivery.read` | Simulated delivery failure records failed delivery status but the original business operation remains committed. | Rule and delivery records must belong to the route workspace. |
| QA-NOTIF-002: notification delivery is isolated by workspace. | `notification_rules`, `notification_deliveries` | `GET /workspaces/{workspaceId}/notification-rules`, `GET /workspaces/{workspaceId}/notification-deliveries` | `notification_rule.read`, `notification_delivery.read` | Workspace A cannot read Workspace B rules or delivery attempts. | All delivery queries must include workspace context. |

### Missing QA Cases

Before implementation, the pending QA addendum should be expanded or integrated into the canonical QA suite with additional cases for:

- Connector registry tenant isolation and RBAC allow/deny.
- Connector account tenant isolation and RBAC allow/deny.
- Connector sync-run read behavior that proves no sync execution occurs.
- Webhook event log append-only behavior.
- Credential endpoint response behavior proving raw secrets are not echoed.
- Metric confidence score bounds and snapshot relationship integrity.
- Contact identifier tenant isolation and uniqueness behavior.
- Lead capture rejection when the contact belongs to another workspace.
- Notification rule RBAC, tenant isolation, and disabled-rule behavior.
- Notification delivery failure behavior without external provider integrations.
- Audit events or documented audit placeholders for sensitive writes.
- ErrorModel consistency for all Patch 002 validation and authorization failures.

## 9. Implementation Sequencing Proposal

1. Contract naming decision.
2. SQL Patch 002 idempotency hardening.
3. OpenAPI Patch 002 alignment.
4. QA canonical integration or dedicated QA addendum.
5. RBAC seed/update.
6. Router/store implementation only after prior steps.
7. GitHub Actions strict verification.
8. Patch 002 activation decision.

Sequencing rule: Patch 002 must not be added to the active migration order until naming, SQL idempotency, OpenAPI alignment, QA coverage, and RBAC permissions are reconciled.

## 10. Risk Register

| Risk | Description | Reconciliation Control |
| --- | --- | --- |
| Tenant isolation risk | New connector, performance, CRM-lite, and notification tables are workspace-scoped and can leak data if any query omits workspace context. | Require route workspace validation, composite FK checks where applicable, RLS review, and tenant isolation tests for every route group. |
| Secret storage risk | Credential handling can accidentally persist raw secrets instead of references. | Canonicalize `connector_credentials`, allow only `secret_ref`, add no-raw-secret tests, and verify responses do not echo raw secrets. |
| Webhook signature/business-state risk | Invalid webhook payloads can mutate business state if validation order is wrong. | Validate signature before business handling; rejected events must not alter campaign/contact/publish/usage state. |
| Metric immutability risk | Snapshots and event records can be changed after creation, undermining reporting integrity. | Keep append-only triggers, add retry-safe triggers, and test update/delete rejection. |
| CRM consent/legal risk | Consent records are legally sensitive and must preserve history. | Enforce append-only consent records, tenant isolation, and no destructive update path. |
| Notification rollback risk | Delivery failures can accidentally roll back the originating business transaction. | Treat delivery attempts as best-effort records and test failed delivery behavior separately from source operation commits. |
| Idempotency/migration retry risk | Patch 002 trigger creation can fail on retry and block strict verification. | Add exact `DROP TRIGGER IF EXISTS` statements before all Patch 002 `CREATE TRIGGER` statements before activation. |
| Scope creep risk | Connector and notification language can drift into integrations, commerce, plugins, or advanced attribution. | Keep Patch 002 as metadata/logging only; reject provider execution, external delivery integrations, and advanced attribution in this patch. |

## 11. Final Readiness Decision

- Patch 002 implementation planning: CONDITIONAL GO.
- Patch 002 reconciliation planning: GO.
- Patch 002 activation: NO-GO.
- Sprint 5 coding: NO-GO until this reconciliation plan is reviewed and accepted.
- Pilot: NO-GO.
- Production: NO-GO.

Patch 002 can move toward implementation planning only after reviewers accept the canonical naming decision, notification model decision, SQL idempotency approach, OpenAPI alignment work, RBAC seed requirements, and QA expansion requirements described above.
