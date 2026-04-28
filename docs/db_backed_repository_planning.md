# DB-backed Repository Planning

## 1. Executive decision

- DB-backed Repository Planning: GO.
- DB-backed implementation: NO-GO until this plan is reviewed.
- Sprint 5 coding: NO-GO.
- Pilot: NO-GO.
- Production: NO-GO.

## 2. Problem statement

Marketing OS now has a working in-memory runtime baseline across Sprint 0/1/2/3/4 and Patch 002. The SQL schema, Patch 001, and Patch 002 migrations exist and have passed strict migration plus retry verification. However, the runtime still does not persist application state to PostgreSQL.

The in-memory store remains acceptable for controlled sprint validation, API contract checks, and integration test coverage. It is not sufficient for Pilot or Production because runtime state is not durable, not query-optimized, and not proven against the SQL constraint model. The next bottleneck is persistence and runtime/SQL parity, not new product scope or feature expansion.

## 3. Current architecture reality

- `src/router.js` is the current runtime entrypoint for implemented routes.
- `src/store.js` holds in-memory collections and seed data, including Sprint 4 and Patch 002 baseline collections.
- `scripts/db-migrate.js` now runs the base schema, Patch 001, and Patch 002 in strict migration order.
- Migration retry verification exists through `scripts/db-migrate-retry.js` and is included in CI verification.
- A DB-backed runtime repository layer does not exist yet.
- Root duplicate files may still exist, but cleanup is out of scope for this plan.

## 4. Scope boundary

In scope for this planning track:

- Repository layer design.
- Persistence boundary design.
- Runtime/SQL parity strategy.
- Transaction and idempotency policy.
- Tenant isolation enforcement at repository level.
- RBAC-aware data access assumptions.
- Test strategy for DB-backed implementation slices.
- Migration and data compatibility checks.
- Rollout sequencing.

Out of scope:

- Implementing repositories.
- Replacing the in-memory store.
- Modifying runtime handlers.
- Adding new features.
- Sprint 5.
- Frontend work.
- InPactAI implementation.
- Creator Marketplace implementation.
- Production authentication.
- Pilot.
- Production.

## 5. Repository architecture options

### Option A: Direct `pg` repository layer

Use `node-postgres` or equivalent directly from route handlers or thin service helpers.

Pros:

- Minimal dependency footprint.
- SQL remains explicit.
- Easy to reason about exact queries.

Cons:

- High risk of scattered data access logic.
- Tenant isolation rules can drift between handlers.
- Transaction and idempotency patterns may be duplicated.
- Harder to maintain runtime/SQL parity as scope grows.

### Option B: Lightweight internal repository abstraction with raw SQL underneath

Introduce explicit repository modules with narrow methods, all backed by parameterized SQL.

Pros:

- Keeps SQL explicit while centralizing tenant isolation and ownership checks.
- Preserves contract-first behavior and current ErrorModel mapping.
- Enables incremental slice migration from in-memory to DB-backed behavior.
- Avoids heavy framework assumptions.
- Makes transaction boundaries testable and reviewable.

Cons:

- Requires disciplined interface design.
- Some boilerplate is unavoidable.
- Runtime and test fixtures must be carefully coordinated during coexistence.

### Option C: ORM or query builder approach

Adopt an ORM or query builder to model tables and queries.

Pros:

- Can reduce repetitive SQL for simple CRUD.
- May provide migration-adjacent schema modeling and typed query ergonomics.
- Familiar to many contributors.

Cons:

- Can obscure contract-specific SQL behavior, RLS assumptions, and trigger semantics.
- May encourage broad model rewrites instead of controlled slices.
- Adds dependency and learning surface.
- Heavy ORM behavior may not match existing SQL-first sprint artifacts.

Recommendation: Option B. Use a lightweight internal repository abstraction with raw parameterized SQL underneath. This is the conservative path for this project because it prevents direct DB calls from spreading through `src/router.js`, avoids a heavy ORM, and preserves the existing ErrorModel, RBAC, OpenAPI, and tenant isolation guardrails.

## 6. Proposed repository boundaries

| Repository | Primary tables | Key operations | Tenant isolation | Append-only / immutability | Audit requirement | Risk |
| --- | --- | --- | --- | --- | --- | --- |
| WorkspaceRepository | `workspaces`, `users`, `workspace_memberships` | workspace read, user read, membership checks | Required for all workspace lookups | N/A | Low, mostly read path | High |
| MembershipRepository | `workspace_memberships`, role/permission seed tables if present | role membership, permission preconditions | Required by workspace and user | N/A | No audit for reads | High |
| CampaignRepository | `campaigns`, related campaign state tables | campaign create/list/get/update where approved | Required on every query | Preserve current campaign lifecycle rules | Sensitive writes need audit events | High |
| BriefRepository | brief and brief version tables | brief create/list/get, versioning | Required by workspace and campaign | Brief versions should preserve version history | Version writes need audit events | Medium |
| BrandRepository | brand/profile related tables | brand create/list/get/update | Required by workspace | Respect immutable/versioned fields if present | Sensitive writes need audit events | Medium |
| MediaRepository | media jobs, cost snapshots, media assets, media asset versions | job create/list/get/status, asset/version read/write | Required by workspace and related campaign/asset | Approved media versions immutable | Sensitive writes need audit events | High |
| ApprovalRepository | review tasks, approval decisions, media asset versions | review task workflow and approval decisions | Required by workspace and assigned version | Approved decisions and approved content hash must remain consistent | Approval writes need audit events | High |
| PublishRepository | publish jobs | publish create/list/get/status | Required by workspace and campaign | Publish job history should not be rewritten | Publish writes need audit events | High |
| EvidenceRepository | manual publish evidence | submit/list/get/invalidate/supersede | Required by workspace and publish job | Proof fields immutable; supersede creates a new record | Evidence writes need audit events | High |
| ReportRepository | client report snapshots | report generate/list | Required by workspace and campaign | Snapshot payload frozen after generation | Generated report audit event required | Medium |
| Patch002ConnectorRepository | connectors, connector_accounts, connector_credentials, webhook_endpoints, webhook_event_logs, connector_sync_runs | registry/account/credential/webhook/sync metadata | Required by workspace; route workspace is authoritative | Credentials immutable; webhook logs append-only | Connector and webhook writes need audit events | High |
| Patch002PerformanceRepository | performance_events, campaign_metric_snapshots, metric_confidence_scores | event/snapshot/confidence list/create | Required by workspace and campaign | Events and snapshots append-only | Performance writes need audit events | Medium |
| Patch002ContactRepository | contacts, contact_identifiers, contact_consents, lead_captures | CRM-lite contact, consent, lead operations | Required by workspace and campaign/contact | Consents append-only | Contact, consent, and lead writes need audit events | High |
| Patch002NotificationRepository | notification_rules, notification_deliveries | rule list/create, delivery list | Required by workspace | Delivery history should not be rewritten | Rule/delivery writes need audit events when created | Medium |
| AuditRepository | audit logs/events | append and workspace-scoped read | Required by workspace | Audit events append-only | This is the audit record | High |
| UsageCostRepository | cost budgets, guardrails, cost events, usage meters, quota state | cost/usage read/write paths | Required by workspace | Cost events are evidence only, not billing/invoice | Sensitive writes need audit events | High |

## 7. Runtime/SQL parity strategy

The DB-backed track should first map each current in-memory collection in `src/store.js` to its SQL table or approved absence. The parity review must identify:

- Fields present in runtime but not represented in SQL.
- SQL columns or constraints not currently enforced by runtime validation.
- Runtime validations that are not represented in SQL and must remain at service/repository level.
- Append-only behavior covered by triggers, repository method restrictions, or both.
- Workspace scoping in both runtime collections and SQL tables.
- Cross-workspace rejection cases for related IDs.
- Differences between camel-case legacy collection names and snake-case Patch 002 collections.

Parity acceptance should be based on behavior, not mechanical field equality. Some runtime-only helper fields may remain acceptable in test fixtures, but business state must map cleanly to SQL-backed persistence before Pilot.

## 8. Tenant isolation strategy

- Every repository method must accept `workspaceId` explicitly.
- No repository method may trust `workspace_id` from request bodies.
- Every workspace-scoped query must filter by `workspace_id`.
- Cross-workspace references must fail before writes are committed.
- Write operations must validate ownership of related IDs, including campaign, brief, brand, media asset version, review task, publish job, contact, connector, connector account, and notification rule relationships.
- Tests must include `workspace-a` and `workspace-b` isolation cases for every migrated slice.
- Repository methods should return not-found or conflict errors through the existing ErrorModel mapping without leaking cross-tenant existence.

## 9. Transaction policy

Transactions should be required for operations that create or mutate multiple related business records or must preserve idempotency atomically:

- Creating a campaign with initial state or related defaults.
- Creating a brief version and related records.
- Creating media job, cost snapshot, usage, and cost records where a single workflow depends on multiple rows.
- Approval decisions that also update media asset version approval state.
- Publish job creation and related evidence checks.
- Report snapshot generation, including frozen ManualPublishEvidence state.
- Patch 002 lead capture with contact and campaign validation.
- Notification delivery recording where it is tied to a sensitive write.

Transactions are generally not needed for pure reads, single-row append-only writes with no dependent changes, or metadata list operations. Rollback behavior must leave no partial business state. Idempotency keys must be checked and recorded inside the same transaction as the protected write. SQL errors must be mapped to the existing ErrorModel without leaking implementation details.

## 10. Security and privacy persistence rules

- Never store raw secrets.
- `connector_credentials` must store `secret_ref` only.
- Credential responses must not echo secret material.
- `contact_consents` must remain append-only.
- `webhook_event_logs` must remain append-only.
- `campaign_metric_snapshots` must remain append-only.
- Sensitive writes must append audit placeholder/events consistent with the Sprint 1-4 and Patch 002 patterns.
- Production authentication remains a separate track and is not solved by repository work.

## 11. Implementation sequencing proposal

### Slice 0: Repository interfaces and DB connection/config planning only

Likely files changed: new repository interface/config planning docs or scaffolding only after approval.

Tests required: none beyond documentation validation if planning-only; later implementation should add connection smoke tests.

Risks: premature abstraction, unclear transaction boundary.

Rollback strategy: remove scaffolding before any runtime handlers depend on it.

Coexistence: fully coexists with in-memory store.

### Slice 1: Workspace, users, memberships, RBAC read path

Likely files changed: repository modules, DB connection helper, guard wiring behind an approved adapter.

Tests required: workspace lookup, membership allow/deny, permission compatibility, tenant isolation.

Risks: auth/RBAC drift and tenant leakage.

Rollback strategy: feature flag or adapter fallback to existing in-memory path during tests.

Coexistence: should coexist behind an interface before broader replacement.

### Slice 2: Campaign, brand, brief basic persistence

Likely files changed: campaign/brand/brief repositories and adapter wiring.

Tests required: CRUD/list behavior, workspace filtering, ErrorModel, cross-workspace rejection.

Risks: breaking Sprint 1 behavior and version/history assumptions.

Rollback strategy: revert slice adapter and leave schema unchanged.

Coexistence: possible with route-level adapter selection for this slice only.

### Slice 3: Media job, asset, usage/cost persistence

Likely files changed: media and usage/cost repositories.

Tests required: idempotency, cost snapshot enforcement, failed job usage behavior, cost event non-billing behavior.

Risks: idempotency race conditions and cost/usage semantic regressions.

Rollback strategy: keep in-memory path active until DB path passes parity tests.

Coexistence: should be isolated behind media and usage/cost repository boundaries.

### Slice 4: Review, approval, publish, evidence persistence

Likely files changed: approval, publish, and evidence repositories.

Tests required: content hash validation, approved version immutability, evidence proof immutability, supersede/invalidate behavior.

Risks: approval/publish safety regressions and evidence mutation.

Rollback strategy: revert slice wiring and keep SQL schema unchanged.

Coexistence: feasible only if all approval/publish/evidence relationships use one backing mode per test run.

### Slice 5: Reports, audit, safe mode, onboarding persistence

Likely files changed: report, audit, operations, and onboarding repositories.

Tests required: frozen report payloads, audit read isolation, safe mode audit events, one onboarding row per workspace.

Risks: report snapshot mutability and audit gaps.

Rollback strategy: revert adapter wiring.

Coexistence: reports should read from the same backing mode as evidence to avoid split-brain snapshots.

### Slice 6: Patch 002 connectors, webhooks, performance, CRM-lite, notifications persistence

Likely files changed: Patch 002 repository modules and adapter wiring.

Tests required: secret_ref-only credentials, invalid webhook non-mutation, append-only performance/consent/snapshot logs, contact/lead cross-workspace rejection, notification delivery non-rollback.

Risks: raw secret persistence, webhook mutation, CRM consent history issues, provider scope creep.

Rollback strategy: keep Patch 002 runtime in-memory baseline until DB parity passes.

Coexistence: should be introduced after core workspace/campaign/media dependencies are stable.

## 12. Coexistence strategy

Three transition choices are available:

- Replace the in-memory store all at once. This is high risk and likely to destabilize existing Sprint 0/1/2/3/4 and Patch 002 tests.
- Use a broad dual-mode adapter. This can help compare behavior, but it risks split-brain state if some operations write to one mode and reads come from another.
- Implement repository slices behind explicit interfaces. This allows controlled migration by domain while preserving current behavior.

Recommendation: implement repository slices behind interfaces. Each slice should run in one backing mode per test process and avoid mixed read/write paths. Existing tests must remain stable, and parity tests should prove DB-backed behavior before switching a slice. This approach also prevents accidental production-readiness claims because in-memory and DB-backed modes remain explicit.

## 13. QA strategy

Future DB-backed implementation PRs should add tests for:

- Repository tenant isolation.
- RBAC path compatibility.
- SQL constraint behavior.
- Transaction rollback.
- Idempotency.
- Append-only enforcement.
- Cross-workspace rejection.
- ErrorModel consistency.
- Migration and retry verification still passing.
- Runtime/SQL parity snapshot tests.

No tests are implemented in this planning PR.

## 14. Data migration / seed strategy

Existing in-memory seed data is not production data. DB seed data should remain test and development only. Production data migration is out of scope for this planning track. Test seed data must continue to support workspace isolation, including `workspace-a` and `workspace-b`. Manual database edits must not count as acceptance evidence for DB-backed behavior.

## 15. OpenAPI impact

No OpenAPI changes are required for repository planning. Existing API behavior should remain stable. DB-backed implementation must not add routes or remove routes. OpenAPI lint must remain strict. If a later persistence slice requires behavior changes, those changes must go through a separate contract PR before runtime implementation.

## 16. Operational risks

- Query mistakes causing tenant leakage.
- Incomplete transaction boundaries.
- In-memory/runtime behavior divergence.
- SQL constraint mismatch.
- Performance bottlenecks from unindexed or overly broad queries.
- Accidental raw secret persistence.
- Audit event gaps.
- Test flakiness from shared database state.
- False Pilot or Production readiness claims.

## 17. Go / No-Go criteria for future DB-backed implementation

GO only if:

- This planning document is reviewed.
- Repository boundaries are approved.
- The first implementation slice scope is approved.
- Migration retry remains passing.
- No Sprint 5 feature work is mixed in.
- A rollback plan exists for the selected slice.

NO-GO if:

- Implementation mixes feature expansion with persistence work.
- `src/router.js` or `src/store.js` is rewritten wholesale without slice control.
- Tenant isolation cannot be proven.
- Tests cannot isolate DB state.
- Production readiness is claimed prematurely.

## 18. Recommended next step

Recommendation: Proceed to DB-backed Repository Architecture Contract before implementation.

This is more conservative than starting implementation Slice 0 immediately. The architecture contract should pin down repository interfaces, transaction rules, DB connection expectations, test isolation strategy, and slice acceptance gates before any runtime persistence code is introduced. Sprint 5 planning should remain deferred until the persistence boundary is reviewed, because new feature work would increase the parity burden.

## 19. Final decision

- DB-backed Repository Planning: GO.
- DB-backed implementation: NO-GO.
- Sprint 5 coding: NO-GO.
- Pilot: NO-GO.
- Production: NO-GO.
