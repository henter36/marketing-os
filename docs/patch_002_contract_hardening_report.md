# Patch 002 Contract Hardening Report

## Executive Status

```text
Patch 002 contract hardening: CONDITIONAL GO pending GitHub Actions strict verification.
Patch 002 runtime implementation: NO-GO until reviewed in a later approved PR.
Patch 002 activation: NO-GO.
Sprint 5 coding: NO-GO.
Pilot: NO-GO.
Production: NO-GO.
```

This PR performs contract hardening only. It does not implement Patch 002 runtime behavior, does not add runtime handlers, and does not activate Patch 002 migrations.

## Files Changed

```text
docs/marketing_os_v5_6_5_phase_0_1_schema_patch_002.sql
docs/marketing_os_v5_6_5_phase_0_1_openapi_patch_002.yaml
docs/patch_002_pending_qa_addendum.md
docs/patch_002_contract_hardening_report.md
src/rbac.js
scripts/openapi-lint.js
```

## SQL Trigger Idempotency Hardening

`docs/marketing_os_v5_6_5_phase_0_1_schema_patch_002.sql` now adds exact retry guards immediately before every Patch 002 `CREATE TRIGGER` statement:

```text
DROP TRIGGER IF EXISTS trg_connectors_updated_at ON connectors;
DROP TRIGGER IF EXISTS trg_connector_accounts_updated_at ON connector_accounts;
DROP TRIGGER IF EXISTS trg_webhook_endpoints_updated_at ON webhook_endpoints;
DROP TRIGGER IF EXISTS trg_contacts_updated_at ON contacts;
DROP TRIGGER IF EXISTS trg_notification_rules_updated_at ON notification_rules;
DROP TRIGGER IF EXISTS trg_webhook_event_logs_append_only ON webhook_event_logs;
DROP TRIGGER IF EXISTS trg_performance_events_append_only ON performance_events;
DROP TRIGGER IF EXISTS trg_campaign_metric_snapshots_append_only ON campaign_metric_snapshots;
DROP TRIGGER IF EXISTS trg_metric_confidence_scores_append_only ON metric_confidence_scores;
DROP TRIGGER IF EXISTS trg_contact_consents_append_only ON contact_consents;
DROP TRIGGER IF EXISTS trg_connector_credentials_immutable ON connector_credentials;
```

Preserved SQL contract behavior:

```text
CREATE TYPE DO-blocks preserved.
CREATE TABLE IF NOT EXISTS preserved.
CREATE INDEX IF NOT EXISTS preserved.
DROP POLICY IF EXISTS + CREATE POLICY pattern preserved.
Workspace scoping preserved.
secret_ref credential reference model preserved.
No raw secret columns added.
No standalone notifications table added.
notification_deliveries.admin_notification_id remains nullable metadata.
Patch 002 remains out of active migration order.
```

## OpenAPI Naming And Security Alignment

`docs/marketing_os_v5_6_5_phase_0_1_openapi_patch_002.yaml` was aligned to the canonical `ConnectorCredential` name:

```text
CreateConnectorCredentialRequest
ConnectorCredential
ConnectorCredentialResponse
connector_credential_id
```

Credential request behavior is constrained to `secret_ref` with `additionalProperties: false`. Credential responses no longer echo `secret_ref` or raw secret material.

Webhook receive documentation now states that signatures must be validated and invalid signatures must not mutate business state. Sync-run documentation is read-only metadata/history only. Performance endpoints remain basic event/snapshot endpoints and do not imply advanced attribution. Notification endpoints remain `notification_rules` and `notification_deliveries` only and do not imply Slack, Mattermost, email provider, or standalone notification APIs.

All Patch 002 routes retain `x-permission` metadata and ErrorModel responses.

## QA Addendum Status

`docs/patch_002_pending_qa_addendum.md` was expanded into a contract-hardened pending QA addendum.

All Patch 002 QA items remain explicitly marked:

```text
Pending / contract-hardened / not-yet-runtime-implemented
```

No Patch 002 QA case is marked passing. Required pending coverage now includes connector registry/account tenant isolation and RBAC, sync-runs read-only/no-execution behavior, webhook event log append-only behavior, no raw secret response echo, metric confidence bounds, contact identifier uniqueness, lead capture cross-workspace rejection, notification rule/delivery behavior, audit placeholders/events, and ErrorModel consistency.

## RBAC Permissions Added

`src/rbac.js` now seeds these Patch 002 permissions:

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

Role mapping summary:

```text
owner: all Patch 002 permissions, including webhook.receive.
admin: all Patch 002 permissions except webhook.receive, usage.record, and cost.record.
creator: connector read plus performance/contact/lead read-write and notification read permissions; no secret rotation and no webhook receive.
reviewer: read-only Patch 002 permissions where review context may need them.
publisher: performance/contact/lead create/read where justified, plus notification read; no secret rotation and no webhook receive.
billing_admin: performance.read only for performance/cost reporting context.
viewer: read-only Patch 002 permissions only; no write, no secret, no webhook permissions.
```

## OpenAPI Lint Integration

`scripts/openapi-lint.js` now includes `docs/marketing_os_v5_6_5_phase_0_1_openapi_patch_002.yaml` in strict contract checks only.

The lint change does not weaken validation, suppress unknown-permission failures, suppress missing-route failures, or remove base OpenAPI/Sprint 3 patch checks.

## Migration Activation Status

```text
Patch 002 remains not activated.
scripts/db-migrate.js was not changed.
Patch 002 was not added to active migration order.
Strict migration verification still runs only base schema + Patch 001 until a later approved activation PR.
```

## Explicitly Not Implemented

```text
Patch 002 runtime endpoints
router/store handlers
external integrations
live sync execution
advanced attribution
Sprint 5
Pilot logic
Production logic
auto-publishing
paid execution
AI agents
BillingProvider
ProviderUsageLog
```

## Commands Run

Local commands were not run against a checkout because this branch was edited through the GitHub connector and the available shell did not have `git` installed. Verification is expected through GitHub Actions on the PR head.

Required verification commands for CI:

```bash
npm test
npm run test:integration
npm run openapi:lint:strict
npm run db:seed
npm run db:migrate:strict
npm run verify:strict
```

## GitHub Actions Result

```text
Pending at initial report creation. Update this section after GitHub Actions strict verification runs on the PR head.
```

## Readiness Decision

```text
Patch 002 contract hardening: CONDITIONAL GO pending GitHub Actions strict verification.
Patch 002 runtime implementation: NO-GO until reviewed.
Patch 002 activation: NO-GO.
```
