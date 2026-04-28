# Patch 002 Runtime Implementation Plan

## 1. Executive Decision

- Patch 002 runtime planning: GO.
- Patch 002 runtime implementation: CONDITIONAL GO only after this plan is reviewed.
- Patch 002 activation: NO-GO.
- Sprint 5 coding: NO-GO.
- Pilot: NO-GO.
- Production: NO-GO.

This document is a planning artifact only. It does not implement runtime behavior, activate Patch 002 migrations, add endpoints, or change router/store behavior.

## 2. Sources Reviewed

Reviewed from `main` before writing this plan:

- `README.md`
- `docs/project_status_after_sprint_4.md`
- `docs/post_pr9_readiness_gap_triage.md` was checked and does not exist on `main`.
- `docs/patch_002_reconciliation_notes.md`
- `docs/patch_002_pending_qa_addendum.md`
- `docs/patch_002_reconciliation_plan.md`
- `docs/patch_002_implementation_plan.md`
- `docs/patch_002_contract_hardening_report.md`
- `docs/17_change_log.md`
- `docs/marketing_os_v5_6_5_codex_implementation_instructions.md`
- `docs/marketing_os_v5_6_5_phase_0_1_schema_patch_002.sql`
- `docs/marketing_os_v5_6_5_phase_0_1_openapi_patch_002.yaml`
- `docs/marketing_os_v5_6_5_phase_0_1_qa_test_suite.md`
- `docs/marketing_os_v5_6_5_phase_0_1_schema.sql`
- `docs/marketing_os_v5_6_5_phase_0_1_schema_patch_001.sql`
- `docs/marketing_os_v5_6_5_phase_0_1_openapi.yaml`
- `docs/marketing_os_v5_6_5_phase_0_1_backlog.md`
- `src/rbac.js`
- `src/router.js`
- `src/store.js`
- `src/router_sprint3.js`
- `src/store_sprint3.js`
- root `router.js`
- root `store.js`
- `scripts/openapi-lint.js`
- `scripts/db-migrate.js`
- `scripts/verify-sprint0.js`
- `package.json`

## 3. Post-PR9 Readiness Triage

### Closed by PR #9

- Patch 002 SQL trigger idempotency was contract-hardened with `DROP TRIGGER IF EXISTS` guards before the Patch 002 trigger definitions.
- Patch 002 OpenAPI uses canonical `ConnectorCredential`, `connector_credentials`, and `connector_credential_id` naming instead of `connector_credential_refs`.
- Connector credential contract accepts `secret_ref` reference input and does not define persisted raw secret fields.
- Patch 002 OpenAPI documents webhook signature validation and non-mutating invalid signature behavior.
- Patch 002 OpenAPI keeps sync-runs as read-only metadata/history.
- Patch 002 QA addendum is expanded and remains pending/contract-hardened/not-yet-runtime-implemented.
- Patch 002 RBAC permissions are seeded in `src/rbac.js`.
- `scripts/openapi-lint.js` includes `docs/marketing_os_v5_6_5_phase_0_1_openapi_patch_002.yaml` during strict lint when the file exists.

### Still Blocking Before Patch 002 Runtime

- This runtime implementation plan must be reviewed and approved before runtime work starts.
- Runtime endpoints and in-memory store collections do not yet exist for Patch 002 resources.
- Executable integration tests for Patch 002 runtime behavior do not yet exist.
- Runtime implementation must prove tenant isolation, RBAC, ErrorModel consistency, and no body `workspace_id` trust for every implemented Patch 002 route.
- Credential response behavior must be deliberately implemented so raw secret material is never persisted or echoed.
- Webhook signature handling must be implemented so invalid signatures log only the approved event behavior and do not mutate business state.
- Append-only runtime resources must avoid PATCH/DELETE routes and reject mutation paths.

### Blocking Only Before Pilot/Production

- The in-memory Seed Store remains non-production and is acceptable only for the current sprint-style runtime baseline.
- `x-user-id` request authentication is non-production and does not equal the OpenAPI `bearerAuth` production posture.
- A DB-backed repository layer is not implemented.
- Patch 002 runtime must not be confused with Pilot or Production readiness.
- OpenAPI lint checks implemented routes against approved OpenAPI paths and permissions, but may not prove every OpenAPI route is implemented.
- Audit placeholder/correlation gaps are not Patch 002 runtime blockers unless the runtime PR directly touches those flows; they remain Pilot/Production readiness concerns.
- Billing/SaaS gaps are outside Patch 002 runtime and would block Product readiness if they become part of a future commercial launch scope.

### Deferred To Later Production Hardening

- Real bearer-token authentication and identity provider integration.
- DB-backed persistence and repository abstraction.
- Migration activation and migration retry execution for Patch 002.
- Stronger audit correlation, request tracing, and operational observability.
- Full contract coverage tooling that can prove required OpenAPI routes are implemented, not only that implemented routes are approved.
- Production-grade secret manager integration for resolving `secret_ref` values outside runtime responses.

### Forbidden Scope For This Phase

- External provider execution.
- Live sync execution.
- Provider credential exchange.
- Raw secret storage.
- Full CRM.
- Commerce connector implementation.
- Plugin system.
- Advanced attribution.
- Slack, Mattermost, email, Strapi, Medusa, or Frappe provider integrations.
- Paid execution.
- Auto-publishing.
- AI agents.
- BillingProvider or ProviderUsageLog.
- Pilot or Production logic.

## 4. Runtime Scope Boundary

### In Scope For A Later Runtime PR

- Connector registry list/create.
- Connector account list/create.
- Connector credential reference creation using `secret_ref` only.
- Connector sync-runs list only as metadata/history.
- Webhook receive event logging with signature validation behavior.
- Performance event list/create.
- Campaign metric snapshot list/create.
- Metric confidence score support if already covered by OpenAPI/SQL.
- Contact list/create.
- Contact consent list/append.
- Lead capture list/create.
- Notification rule list/create.
- Notification delivery list.

### Out Of Scope

- External provider execution.
- Live sync execution.
- Provider credential exchange.
- Raw secret storage.
- Full CRM.
- Commerce connector implementation.
- Plugin system.
- Advanced attribution.
- Slack/Mattermost/email provider execution.
- Strapi/Medusa/Frappe integration.
- Paid execution.
- Auto-publishing.
- AI agents.
- BillingProvider / ProviderUsageLog.
- Pilot / Production.

## 5. Endpoint Implementation Inventory

| Method | Path | Classification | Permission | Entity/Table | Expected response behavior | Required negative tests | Tenant isolation rule |
| --- | --- | --- | --- | --- | --- | --- | --- |
| GET | `/workspaces/{workspaceId}/connectors` | Implement in runtime PR | `connector.read` | `connectors` | Return connectors scoped to route workspace. | Deny without permission; outsider denied; no cross-workspace rows. | Filter by route `workspaceId`. |
| POST | `/workspaces/{workspaceId}/connectors` | Implement in runtime PR | `connector.write` | `connectors` | Create connector metadata in route workspace; create audit placeholder/event. | Deny without permission; reject body `workspace_id`; reject invalid required fields/duplicates if contract requires. | Assign route `workspaceId`; never trust body workspace. |
| GET | `/workspaces/{workspaceId}/connectors/{connectorId}/accounts` | Implement in runtime PR | `connector.read` | `connector_accounts` | Return accounts for connector within route workspace. | Unknown/cross-workspace connector returns ErrorModel; deny without permission. | Validate connector and accounts with route `workspaceId`. |
| POST | `/workspaces/{workspaceId}/connectors/{connectorId}/accounts` | Implement in runtime PR | `connector.write` | `connector_accounts` | Create account metadata for connector; no provider connection attempt; create audit placeholder/event. | Deny without permission; reject body `workspace_id`; reject cross-workspace connector. | Connector and new account must share route `workspaceId`. |
| POST | `/workspaces/{workspaceId}/connectors/{connectorId}/accounts/{connectorAccountId}/credentials` | Implement in runtime PR | `connector.rotate_secret` | `connector_credentials` | Create credential reference metadata only; never echo raw secret material; create audit placeholder/event. | Deny without permission; reject raw secret fields; reject missing `secret_ref`; reject cross-workspace account. | Connector and account must match route `workspaceId`. |
| GET | `/workspaces/{workspaceId}/connectors/{connectorId}/sync-runs` | Implement in runtime PR | `connector.read` | `connector_sync_runs` | Return sync-run metadata/history only. | No POST/PATCH/DELETE execution routes; deny without permission; reject cross-workspace connector. | Sync-runs filtered by route `workspaceId` and connector. |
| POST | `/workspaces/{workspaceId}/webhooks/{endpointKey}` | Implement in runtime PR | `webhook.receive` | `webhook_endpoints`, `webhook_event_logs` | Validate signature contract behavior; log event; invalid signature must not mutate business state. | Invalid signature returns ErrorModel or documented failure without business mutation; no campaign/contact/performance changes; endpoint not found. | Endpoint key lookup must resolve only within route `workspaceId`. |
| GET | `/workspaces/{workspaceId}/campaigns/{campaignId}/performance-events` | Implement in runtime PR | `performance.read` | `performance_events` | Return events for route workspace and campaign. | Deny without permission; reject cross-workspace campaign. | Campaign and events must match route `workspaceId`. |
| POST | `/workspaces/{workspaceId}/campaigns/{campaignId}/performance-events` | Implement in runtime PR | `performance.event_create` | `performance_events` | Append performance event; create audit placeholder/event if sensitive-write policy applies. | Deny without permission; reject negative `metric_value`; reject body `workspace_id`; reject cross-workspace campaign. | Assign route `workspaceId`; validate campaign workspace. |
| GET | `/workspaces/{workspaceId}/campaigns/{campaignId}/metric-snapshots` | Implement in runtime PR | `performance.read` | `campaign_metric_snapshots`, `metric_confidence_scores` | Return snapshots and any contract-approved confidence score data for route workspace/campaign. | Deny without permission; reject cross-workspace campaign. | Campaign and snapshots must match route `workspaceId`. |
| POST | `/workspaces/{workspaceId}/campaigns/{campaignId}/metric-snapshots` | Implement in runtime PR | `performance.snapshot_create` | `campaign_metric_snapshots`, `metric_confidence_scores` | Append immutable snapshot; create audit placeholder/event if sensitive-write policy applies. | Deny without permission; reject negative metric values; reject confidence out of bounds; reject body `workspace_id`. | Assign route `workspaceId`; validate campaign workspace. |
| GET | `/workspaces/{workspaceId}/contacts` | Implement in runtime PR | `contact.read` | `contacts` | Return contacts scoped to route workspace. | Deny without permission; no cross-workspace rows. | Filter by route `workspaceId`. |
| POST | `/workspaces/{workspaceId}/contacts` | Implement in runtime PR | `contact.create` | `contacts`, `contact_identifiers` | Create contact and optional identifiers in route workspace; create audit placeholder/event. | Deny without permission; reject body `workspace_id`; reject duplicate identifiers within workspace if contract requires. | Assign route `workspaceId`; identifier uniqueness scoped to workspace. |
| GET | `/workspaces/{workspaceId}/contacts/{contactId}/consents` | Implement in runtime PR | `contact.read` | `contact_consents` | Return consent history for contact. | Deny without permission; reject cross-workspace contact. | Contact and consents must match route `workspaceId`. |
| POST | `/workspaces/{workspaceId}/contacts/{contactId}/consents` | Implement in runtime PR | `contact.consent_update` | `contact_consents` | Append consent record only; create audit placeholder/event. | Deny without permission; reject body `workspace_id`; no mutation of prior consent records. | Contact and new consent must match route `workspaceId`. |
| GET | `/workspaces/{workspaceId}/campaigns/{campaignId}/lead-captures` | Implement in runtime PR | `lead_capture.read` | `lead_captures` | Return lead captures for campaign. | Deny without permission; reject cross-workspace campaign. | Campaign and captures must match route `workspaceId`. |
| POST | `/workspaces/{workspaceId}/campaigns/{campaignId}/lead-captures` | Implement in runtime PR | `lead_capture.create` | `lead_captures` | Create lead capture linked to route campaign and optional same-workspace contact; create audit placeholder/event. | Deny without permission; reject cross-workspace campaign; reject cross-workspace contact; reject body `workspace_id`. | Campaign, contact, and capture must match route `workspaceId`. |
| GET | `/workspaces/{workspaceId}/notification-rules` | Implement in runtime PR | `notification_rule.read` | `notification_rules` | Return notification rules scoped to workspace. | Deny without permission; no cross-workspace rows. | Filter by route `workspaceId`. |
| POST | `/workspaces/{workspaceId}/notification-rules` | Implement in runtime PR | `notification_rule.write` | `notification_rules` | Create rule metadata only; no provider integration; create audit placeholder/event. | Deny without permission; reject body `workspace_id`; reject provider-execution fields if outside contract. | Assign route `workspaceId`. |
| GET | `/workspaces/{workspaceId}/notification-deliveries` | Implement in runtime PR | `notification_delivery.read` | `notification_deliveries` | Return delivery records scoped to workspace. | Deny without permission; no cross-workspace rows; no POST/PATCH provider delivery execution. | Filter by route `workspaceId`. |

No Patch 002 OpenAPI route is currently classified as Forbidden. Runtime implementation must re-check the patch immediately before coding. If any route implies live provider execution, raw credential exchange, BillingProvider, ProviderUsageLog, advanced attribution, Pilot, or Production behavior, that route becomes Needs clarification or Forbidden until the contract is corrected.

## 6. Store/Data Model Plan

| Collection | Key/id field | Workspace handling | Immutable fields | Append-only rules | Relationship validation | Seed data required |
| --- | --- | --- | --- | --- | --- | --- |
| `connectors` | `connector_id` | Include `workspace_id`; filter and create using route workspace. | `connector_id`, `workspace_id`, creation metadata. | Not append-only, but runtime PR should expose only list/create unless OpenAPI approves updates. | None beyond workspace and connector uniqueness where needed. | One connector each in `workspace-a` and `workspace-b`. |
| `connector_accounts` | `connector_account_id` | Include `workspace_id`; parent connector must be same workspace. | `connector_account_id`, `workspace_id`, `connector_id`. | Not append-only, but no unapproved update/delete routes. | Validate connector exists in route workspace. | One account each under seeded connector. |
| `connector_credentials` | `connector_credential_id` | Include `workspace_id`; connector/account must be same workspace. | `connector_credential_id`, `workspace_id`, `connector_id`, `connector_account_id`, `secret_ref` after creation. | Treat as immutable after creation. Credential rotation creates a new credential reference record. | Validate connector/account relationship and route workspace. | A credential metadata row using safe `secret_ref` for workspace A; optionally workspace B isolation row. |
| `webhook_endpoints` | `webhook_endpoint_id` or `endpoint_key` | Include `workspace_id`; endpoint lookup must include route workspace. | Endpoint key and workspace once created in seed. | No mutation in runtime scope unless OpenAPI later approves. | Endpoint key must resolve in route workspace. | One endpoint key for workspace A and one for workspace B. |
| `webhook_event_logs` | `webhook_event_log_id` | Include `workspace_id`; append using route workspace. | All proof/request fields after creation. | Append-only; no PATCH/DELETE. | Validate endpoint belongs to route workspace. | Optional existing valid and invalid event rows for list/append-only tests if a read route exists later. |
| `connector_sync_runs` | `connector_sync_run_id` | Include `workspace_id`; filter by route workspace and connector. | History fields after creation. | Runtime scope is read-only metadata/history. | Validate connector belongs to route workspace. | One historical sync run per seeded connector. |
| `performance_events` | `performance_event_id` | Include `workspace_id`; campaign must be route workspace. | Event metric payload after creation. | Append-only; no PATCH/DELETE. | Validate campaign belongs to route workspace. | One event for campaign A and one for campaign B. |
| `campaign_metric_snapshots` | `campaign_metric_snapshot_id` | Include `workspace_id`; campaign must be route workspace. | Snapshot metric payload after creation. | Append-only/immutable; no PATCH/DELETE. | Validate campaign belongs to route workspace. | One snapshot for campaign A and one for campaign B. |
| `metric_confidence_scores` | `metric_confidence_score_id` | Include `workspace_id`; parent snapshot/campaign must be route workspace. | Score and reasoning fields after creation. | Append-only/immutable; no PATCH/DELETE. | Validate score belongs to same workspace snapshot/campaign. | Confidence score attached to seeded snapshot. |
| `contacts` | `contact_id` | Include `workspace_id`; filter and create using route workspace. | `contact_id`, `workspace_id`, creation metadata. | Not append-only, but runtime scope only lists/creates unless updates are separately approved. | Optional identifier uniqueness within workspace. | One contact each in workspace A and B. |
| `contact_identifiers` | `contact_identifier_id` | Include `workspace_id`; contact must be same workspace. | Identifier value/type after creation unless OpenAPI approves updates. | Prefer append-only for baseline identity history. | Validate contact belongs to route workspace; enforce uniqueness scoped to workspace. | Identifier for each seeded contact. |
| `contact_consents` | `contact_consent_id` | Include `workspace_id`; contact must be same workspace. | Entire consent record after creation. | Append-only; no PATCH/DELETE. | Validate contact belongs to route workspace. | Consent row for contact A and B. |
| `lead_captures` | `lead_capture_id` | Include `workspace_id`; campaign/contact must be same workspace. | `lead_capture_id`, `workspace_id`, campaign/contact references after creation. | No unapproved update/delete routes. | Validate campaign belongs to route workspace; validate optional contact belongs to same workspace. | One lead capture for campaign A/contact A and one for workspace B. |
| `notification_rules` | `notification_rule_id` | Include `workspace_id`; filter and create using route workspace. | `notification_rule_id`, `workspace_id`, creation metadata. | No unapproved update/delete routes; disabled rules must not imply provider delivery. | Validate only contract-approved rule targets/entities. | Enabled and disabled rules for workspace A; one workspace B rule. |
| `notification_deliveries` | `notification_delivery_id` | Include `workspace_id`; filter by route workspace. | Delivery attempt fields after creation. | Append-only read model in runtime scope; no provider execution route. | Validate optional rule/entity relationship is same workspace. | Success and failure rows, including failure that proves no rollback side effect. |

## 7. Security And Privacy Runtime Rules

- Store only `secret_ref` for connector credential references.
- Never persist `raw_secret`, `api_key`, `token`, `refresh_token`, `password`, or `signing_secret` as raw material.
- Never echo raw secret material. Prefer returning credential metadata only and avoid returning `secret_ref` unless the reviewed contract explicitly confirms it is safe.
- Invalid webhook signature must not mutate campaign, contact, publish, usage, evidence, performance, metric, notification, or connector account business state.
- Webhook receive may create only the contract-approved event log behavior for invalid signatures.
- Contact consent records must be append-only.
- Performance events and metric snapshots must be append-only.
- Notification delivery failure must be recorded without rolling back the original operation that caused a notification attempt.
- Every workspace-scoped operation must validate the route workspace context.
- Runtime must preserve AuthGuard, WorkspaceContextGuard, MembershipCheck, and PermissionGuard.
- Do not trust `workspace_id` from request bodies.
- Every workspace-scoped query must include the route workspace context.
- CostEvent remains not billing or invoice state.
- No external provider execution is allowed.

## 8. RBAC Runtime Plan

`src/rbac.js` already contains the Patch 002 permissions after contract hardening. Runtime tests must verify both allow and deny behavior.

| Permission | Present in `src/rbac.js` | Roles that should have it | Roles that must not have it | Deny tests required |
| --- | --- | --- | --- | --- |
| `connector.read` | Yes | owner, admin, creator, publisher, viewer | reviewer, billing_admin unless later justified | Reviewer/billing admin denied connector list; outsider denied. |
| `connector.write` | Yes | owner, admin | creator, reviewer, publisher, billing_admin, viewer | Creator/viewer denied connector create. |
| `connector.rotate_secret` | Yes | owner, admin | creator, reviewer, publisher, billing_admin, viewer | Creator/publisher/viewer denied credential reference create. |
| `webhook.receive` | Yes | owner only/service-equivalent owner path | admin, creator, reviewer, publisher, billing_admin, viewer | Admin and viewer denied webhook receive unless role model is explicitly revised. |
| `performance.read` | Yes | owner, admin, creator, reviewer, publisher, billing_admin, viewer | none among seeded active roles except outsider | Outsider denied; workspace B isolation denied via membership. |
| `performance.event_create` | Yes | owner, admin, creator, publisher | reviewer, billing_admin, viewer | Reviewer/viewer denied event create. |
| `performance.snapshot_create` | Yes | owner, admin, creator | reviewer, publisher, billing_admin, viewer | Publisher/viewer denied snapshot create. |
| `contact.read` | Yes | owner, admin, creator, reviewer, publisher, viewer | billing_admin unless later justified | Billing admin denied contacts list; outsider denied. |
| `contact.create` | Yes | owner, admin, creator, publisher | reviewer, billing_admin, viewer | Reviewer/viewer denied contact create. |
| `contact.update` | Yes | owner, admin, creator | reviewer, publisher, billing_admin, viewer | Publisher/viewer denied any approved contact update route if later added. |
| `contact.consent_update` | Yes | owner, admin, creator | reviewer, publisher, billing_admin, viewer | Publisher/viewer denied consent append. |
| `lead_capture.read` | Yes | owner, admin, creator, reviewer, publisher, viewer | billing_admin unless later justified | Billing admin denied lead capture list; outsider denied. |
| `lead_capture.create` | Yes | owner, admin, creator, publisher | reviewer, billing_admin, viewer | Reviewer/viewer denied lead capture create. |
| `notification_rule.read` | Yes | owner, admin, creator, reviewer, publisher, viewer | billing_admin unless later justified | Billing admin denied rule list; outsider denied. |
| `notification_rule.write` | Yes | owner, admin | creator, reviewer, publisher, billing_admin, viewer | Creator/publisher/viewer denied rule create. |
| `notification_delivery.read` | Yes | owner, admin, creator, reviewer, publisher, viewer | billing_admin unless later justified | Billing admin denied delivery list; outsider denied. |

## 9. QA And Integration Test Plan

The later runtime PR must add executable tests for:

- Connector registry tenant isolation and RBAC allow/deny.
- Connector account tenant isolation and RBAC allow/deny.
- Connector credential uses `secret_ref` only.
- Credential response does not echo raw secrets.
- Connector sync-runs are read-only and do not execute sync.
- Invalid webhook signature does not change business state.
- Webhook event log append-only behavior.
- Performance events tenant isolation.
- `metric_value` cannot be negative.
- Campaign metric snapshot immutability.
- Metric confidence score bounds.
- Contacts tenant isolation.
- Contact identifier uniqueness and tenant isolation.
- Contact consent append-only behavior.
- Lead capture rejects cross-workspace campaign.
- Lead capture rejects cross-workspace contact.
- Notification rule tenant isolation and RBAC.
- Notification disabled-rule behavior.
- Notification delivery tenant isolation.
- Failed notification delivery does not roll back original operation.
- Audit placeholder/event behavior for sensitive writes.
- ErrorModel consistency for Patch 002.
- OpenAPI alignment for implemented Patch 002 routes.
- All Sprint 0/1/2/3/4 tests still pass.

The runtime PR must not mark any pending Patch 002 QA case as passing until implementation and CI verification prove it.

## 10. Runtime Implementation Sequencing

1. Add store collections and seed data.
2. Add route inventory to `implementedRoutes` only for routes implemented.
3. Implement connector registry/account/credential routes.
4. Implement webhook receive logging.
5. Implement performance events/snapshots/confidence routes.
6. Implement CRM-lite contact/consent/lead routes.
7. Implement notification rules/deliveries routes.
8. Add integration tests.
9. Run strict verification.
10. Create `docs/patch_002_runtime_implementation_report.md`.

## 11. Migration And Activation Policy

- Do not activate Patch 002 in `scripts/db-migrate.js` during runtime implementation unless separately approved.
- Runtime may remain an in-memory baseline like previous sprints.
- Patch 002 activation requires a separate activation PR after runtime implementation and migration retry checks pass.
- No Patch 002 runtime PR may claim production readiness.
- No Pilot or Production readiness decision may be inferred from passing Patch 002 runtime tests.

## 12. OpenAPI Lint Policy

`src/rbac.js` contains Patch 002 permissions, and `scripts/openapi-lint.js` includes `docs/marketing_os_v5_6_5_phase_0_1_openapi_patch_002.yaml` in strict mode when present. The later runtime PR must add only implemented Patch 002 routes to `implementedRoutes`, and those route strings must match approved Patch 002 OpenAPI paths and methods.

Do not weaken lint. Do not suppress missing-route checks. Do not suppress unknown-permission checks. The current lint direction validates that implemented routes are approved by OpenAPI; it should not be treated as proof that every approved Patch 002 OpenAPI route has runtime behavior unless additional coverage is added.

## 13. Risk Register

- Tenant isolation risk: every route must filter and validate by route workspace.
- Raw secret storage/echo risk: credential handlers must reject raw secret fields and avoid returning secret material.
- Webhook signature validation risk: invalid signature behavior must be deterministic and tested.
- Webhook business-state mutation risk: invalid webhooks must not mutate campaign/contact/publish/usage/evidence/performance state.
- Append-only mutation risk: performance events, snapshots, confidence scores, consent records, webhook logs, and credential reference records must not expose mutation routes.
- CRM consent/legal history risk: consent history must preserve past records exactly.
- Cross-workspace lead/contact risk: lead capture must reject campaign/contact references from another workspace.
- Notification rollback risk: delivery failure must not undo the originating operation.
- Notification provider scope creep risk: notification rules/deliveries must remain metadata/read model without Slack/Mattermost/email execution.
- OpenAPI/RBAC mismatch risk: route permissions must match Patch 002 OpenAPI `x-permission` metadata and seeded RBAC.
- Runtime/store divergence from SQL risk: in-memory structures must follow Patch 002 SQL names and constraints closely enough for future activation.
- False product readiness risk: passing runtime tests must not be represented as Pilot or Production readiness.

## 14. Final Recommendation

Recommendation: Proceed to Patch 002 runtime implementation PR after review.

Reasoning: Patch 002 contract hardening closed the key contract blockers for runtime planning: SQL trigger idempotency was prepared, OpenAPI naming and credential constraints were aligned, QA expectations were documented, RBAC permissions were seeded, and strict OpenAPI lint includes the Patch 002 patch. Runtime work can proceed as a conditional, reviewed implementation PR if it stays in the in-memory baseline, preserves all Sprint 0/1/2/3/4 guardrails, and does not activate migrations or claim Pilot/Production readiness.

Patch 002 activation remains NO-GO. Sprint 5 coding remains NO-GO. Pilot and Production remain NO-GO.
