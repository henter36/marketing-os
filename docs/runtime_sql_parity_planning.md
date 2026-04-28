# Runtime/SQL Parity Planning

## 1. Executive decision

- Runtime/SQL Parity Planning: GO.
- Runtime/SQL parity implementation: NO-GO until this plan is reviewed.
- DB-backed Slice 0: GO as limited Workspace/Membership/RBAC read-path slice.
- pg adapter: GO for Slice 0 only.
- DB-backed full persistence: NO-GO.
- Slice 1: NO-GO.
- Sprint 5 coding: NO-GO.
- Pilot: NO-GO.
- Production: NO-GO.

## 2. Problem statement

The project now has an in-memory runtime baseline, SQL schema/migrations, migration retry verification, a pg adapter, and DB-backed Slice 0 repositories. Those pieces prove the migration gates and a narrow Workspace/Membership/RBAC read path, but product-domain runtime behavior is still in-memory.

It is not yet proven that in-memory runtime behavior matches SQL constraints, table structure, immutability rules, idempotency expectations, audit expectations, or OpenAPI behavior. Before Slice 1, the project needs a parity map to identify gaps and choose the safest next persistence slice.

Runtime/SQL parity planning does not mean DB-backed full persistence or production readiness.

## 3. Current architecture reality

- Runtime entrypoints still use `src/router.js` and `src/store.js`.
- Sprint 3 compatibility layer remains in `src/router_sprint3.js` and `src/store_sprint3.js`.
- DB-backed Slice 0 repositories exist only for Workspace/Membership/RBAC read path.
- `pg` adapter exists for Slice 0 only.
- Patch 002 runtime baseline remains in-memory.
- SQL base + Patch 001 + Patch 002 are active in strict migration order.
- Migration retry verification is active in CI.

## 4. Parity dimensions

Future parity work must compare these dimensions explicitly:

- Runtime collection/entity name vs SQL table.
- Runtime field vs SQL column.
- Runtime validation vs SQL constraint.
- Runtime immutability rule vs SQL trigger/check/protection.
- Runtime idempotency behavior vs SQL key/transaction pattern.
- Runtime tenant isolation vs SQL `workspace_id`/RLS/policy.
- Runtime RBAC check vs SQL role/permission model.
- Runtime ErrorModel behavior vs SQL/database error mapping.
- Runtime audit placeholder/event vs SQL audit table expectation.
- Runtime append-only behavior vs SQL constraints/triggers.
- Runtime hash/snapshot behavior vs SQL stored hash/snapshot fields.
- Runtime OpenAPI route behavior vs OpenAPI contract and SQL persistence model.
- Test coverage vs both runtime and SQL.

## 5. Domain coverage map

| Domain | Runtime status | SQL status | Parity risk | Candidate next action | Notes |
|---|---|---|---|---|---|
| Workspace / User / Membership / RBAC | DB-backed Slice 0 read path exists; runtime default remains in-memory | Base schema | Low | Test parity | Repository reads exist for workspace, membership, and RBAC only; route runtime remains in-memory. |
| Campaign | In-memory | Base schema | Medium | Test parity / repository slice candidate | State fields and transitions must be compared before DB write path. |
| CampaignStateTransition | In-memory | Base schema | Medium | Test parity | Runtime transition creation updates campaign state; SQL parity must confirm transaction/audit/state behavior. |
| BriefVersion | In-memory | Base schema | High | Test parity before slice | Server-side hash and immutability need exact mapping to SQL protections. |
| BrandProfile / BrandVoiceRule | In-memory | Base schema | Medium | Test parity / repository slice candidate | Lower write complexity, but duplicate constraints and workspace scoping must be mapped. |
| PromptTemplate / ReportTemplate | In-memory | Base schema | Medium | Test parity | Template version uniqueness and JSON payload constraints need mapping. |
| MediaJob | In-memory | Base schema | High | Map only | Idempotency, status transitions, cost preconditions, and no auto-execution rules need deeper transaction design. |
| MediaCostSnapshot | In-memory | Base schema | High | Map only | Cost snapshot approval and immutability must be matched before persistence. |
| MediaAsset / MediaAssetVersion | In-memory | Base schema | High | Map only | Content hash, approved-version immutability, and asset/version joins are high-risk. |
| UsageMeter | In-memory | Base schema | High | Map only | Commercial usage rules require transactional protection and idempotency mapping. |
| CostEvent | In-memory | Base schema | High | Map only | Cost event validation, guardrails, and audit implications require write-path policy. |
| ReviewTask | In-memory | Base schema | High | Map only | Assignment, status transitions, RBAC, and review decisions link to asset version state. |
| ApprovalDecision | In-memory | Base schema + Patch 001 | High | Map only | Patch 001 behavior updates approved asset status and must be proven against runtime. |
| PublishJob | In-memory | Base schema | High | Map only | Idempotency, approved hash checks, and status transitions require transaction policy. |
| ManualPublishEvidence | In-memory | Base schema + Patch 001 | High | Map only | Evidence invalidation/supersession and immutable proof fields need parity proof. |
| ClientReportSnapshot | In-memory | Base schema | High | Map only | Frozen report/evidence payloads and content hash need SQL/runtime parity. |
| Patch 002 Connector / ConnectorAccount / ConnectorCredential | In-memory | Patch 002 | High | Defer | Secret reference-only behavior and credential redaction require careful DB mapping. |
| Patch 002 WebhookEndpoint / WebhookEventLog / ConnectorSyncRun | In-memory | Patch 002 | High | Defer | Webhook logging must not mutate business state on invalid signatures. |
| Patch 002 PerformanceEvent / CampaignMetricSnapshot / MetricConfidenceScore | In-memory | Patch 002 | High | Defer | Non-negative metrics, immutable snapshots, and confidence bounds need parity tests. |
| Patch 002 Contact / ContactIdentifier / ContactConsent / LeadCapture | In-memory | Patch 002 | High | Defer | Contact consent append-only and cross-workspace campaign/contact protection need parity proof. |
| Patch 002 NotificationRule / NotificationDelivery | In-memory | Patch 002 | High | Defer | Delivery failure isolation and no provider execution remain critical. |
| AuditLog | In-memory audit placeholders/read model | Base schema | High | Map only | Persistent audit policy and transaction coupling are not approved yet. |
| SafeMode / Onboarding | In-memory | Base schema | Medium | Test parity / defer | Safe mode and onboarding state are present in runtime; SQL uniqueness and update semantics need mapping. |

## 6. Known parity risks to inspect

- Runtime fields not present in SQL.
- SQL `NOT NULL` constraints not enforced in runtime.
- Runtime allows statuses not defined by SQL enums.
- SQL trigger immutability not represented in runtime.
- Runtime immutability not represented in SQL.
- Runtime idempotency not represented transactionally.
- `workspace_id` is enforced in runtime but not consistently at DB layer.
- DB RLS/policies may exist but repository filters must still be explicit.
- Audit placeholders in runtime may not match future `AuditLog` schema.
- Cost/usage commercial usage rules may not be transactionally protected.
- Patch 002 contact consent append-only behavior must map to SQL.
- Credential `secret_ref`-only behavior must map to SQL.
- Notification delivery failure isolation must map to SQL.

## 7. Proposed parity artifact structure

Future Runtime/SQL parity work should create these artifacts before implementation:

- `docs/runtime_sql_parity_matrix.md`
- `docs/runtime_sql_parity_gap_register.md`
- `docs/runtime_sql_parity_test_plan.md`
- `docs/db_backed_slice_1_candidate_selection.md`

This planning PR does not create those artifacts unless explicitly allowed; it only defines them.

## 8. Recommended parity process

- Phase A: Inventory runtime collections and routes.
- Phase B: Inventory SQL tables, constraints, triggers, indexes, RLS policies, and grants.
- Phase C: Map runtime fields to SQL columns.
- Phase D: Map rules for tenant isolation, immutability, idempotency, append-only behavior, hashes, snapshots, and audit events.
- Phase E: Map tests to runtime and SQL expectations.
- Phase F: Produce the gap register.
- Phase G: Select the Slice 1 candidate based on lowest risk and highest foundational value.

## 9. Slice 1 candidate evaluation criteria

Slice 1 selection should use these criteria:

- Foundational value.
- Low write complexity.
- Low immutability/idempotency risk.
- Clear SQL table coverage.
- Existing runtime tests.
- Easy tenant isolation proof.
- Minimal OpenAPI impact.
- Rollback simplicity.
- No Patch 002 expansion.
- No Sprint 5 scope.

Candidate ranking logic:

- Workspace/Membership/RBAC is already Slice 0.
- Campaign, Brand, and Brief may be candidates but require parity mapping first.
- Media, Approval, Publish, and Evidence are higher risk because immutability, hashes, state transitions, and idempotency matter.
- Patch 002 persistence should be deferred until core product domains are mapped.
- Reports and Audit may require transaction/event policy before implementation.

## 10. QA strategy

Future QA planning must cover:

- Parity assertions between runtime behavior and SQL constraints.
- SQL constraint failure mapped to ErrorModel.
- Tenant isolation parity.
- RBAC parity.
- Status enum parity.
- Append-only parity.
- Immutability parity.
- Hash/snapshot parity.
- Idempotency parity.
- Usage/cost rule parity.
- Patch 002 secret/contact/notification parity.
- No OpenAPI drift.
- No regression in existing Sprint 0/1/2/3/4/Patch 002 tests.
- Migration and migration retry remain passing.

## 11. Out-of-scope

- No implementation in this PR.
- No repository slice implementation.
- No DB-backed full persistence.
- No router/store changes.
- No SQL changes.
- No OpenAPI changes.
- No tests added.
- No endpoints.
- No Sprint 5.
- No Pilot.
- No Production.

## 12. Remaining blockers

- Runtime/SQL parity matrix not created yet.
- Gap register not created yet.
- Slice 1 candidate not selected yet.
- Product-domain repository interfaces not approved yet.
- DB-backed write-path strategy not approved.
- Production auth not solved.
- Root/src cleanup pending.
- Production observability/security/deployment pending.

## 13. Recommended next step

Create a Runtime/SQL Parity Matrix PR before Slice 1.

This is the conservative next step because it keeps implementation paused while the project maps runtime behavior, SQL constraints, OpenAPI contracts, and QA evidence into a reviewed decision record.

## 14. Final decision

- Runtime/SQL Parity Planning: GO.
- Runtime/SQL Parity Matrix: next recommended step.
- Runtime/SQL parity implementation: NO-GO.
- DB-backed Slice 1: NO-GO.
- DB-backed full persistence: NO-GO.
- Sprint 5 coding: NO-GO.
- Pilot: NO-GO.
- Production: NO-GO.
