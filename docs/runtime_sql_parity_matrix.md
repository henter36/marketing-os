# Runtime/SQL Parity Matrix

## Executive Status

- Runtime/SQL Parity Matrix: GO.
- Runtime/SQL parity implementation: NO-GO.
- DB-backed Slice 1: NO-GO until candidate selection is reviewed.
- DB-backed full persistence: NO-GO.
- Sprint 5 coding: NO-GO.
- Pilot: NO-GO.
- Production: NO-GO.

## Method

This matrix compares each runtime domain against the current SQL and contract surface. The comparison uses these parity dimensions:

- Runtime entity/collection.
- Runtime fields.
- SQL table/column.
- SQL constraints.
- Runtime validation.
- SQL immutability/append-only mechanisms.
- Runtime immutability/append-only behavior.
- Tenant isolation.
- RBAC.
- ErrorModel behavior.
- Audit expectation.
- Test coverage.
- OpenAPI route/contract coverage.

This document is an evidence and planning artifact only. It does not implement Runtime/SQL parity logic, DB-backed Slice 1, DB-backed full persistence, Sprint 5, Pilot, or Production readiness.

## Domain Matrix

| Domain | Runtime status | SQL status | OpenAPI status | Current tests | Parity confidence | Risk level | Recommended action | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Workspace / User / Membership / RBAC | In-memory runtime plus DB-backed Slice 0 repository read path | Base schema | Base OpenAPI | Sprint 0, Slice 0 integration | High | Low | Keep as Slice 0 baseline and compare as reference | Only DB-backed repository slice currently proven; runtime default remains in-memory. |
| Campaign | In-memory runtime | Base schema | Base OpenAPI | Sprint 1, Sprint 2, Sprint 3, Sprint 4, Patch 002 coverage through campaign-scoped routes | Medium | Medium | Test parity before repository slice | Foundational domain, but lifecycle and state transition coupling raise risk. |
| CampaignStateTransition | In-memory runtime | Base schema | Base OpenAPI | Sprint 1 | Medium | Medium | Map transition rules and transaction policy | State transition creation is runtime-proven, not DB-runtime proven. |
| BriefVersion | In-memory runtime | Base schema | Base OpenAPI | Sprint 1 | Low | High | Defer until hash and append-only parity are proven | Content hash and immutability make it a poor first write-path slice. |
| BrandProfile / BrandVoiceRule | In-memory runtime | Base schema | Base OpenAPI | Sprint 1 | Medium | Low | Candidate for Slice 1 planning | Narrow workspace-scoped domain with lower lifecycle complexity. |
| PromptTemplate / ReportTemplate | In-memory runtime | Base schema | Base OpenAPI | Sprint 1, Sprint 4 report usage | Medium | Medium | Candidate after brand domain or in a separate slice | System/workspace template boundary needs careful parity checks. |
| MediaJob | In-memory runtime | Base schema | Base OpenAPI | Sprint 2, Sprint 4 readiness regression | Low | High | Defer | Idempotency, status transitions, cost snapshots, and provider boundaries make this high risk. |
| MediaCostSnapshot | In-memory runtime | Base schema | Base OpenAPI through MediaJob behavior | Sprint 2 | Low | High | Defer | Budget/cost guardrail behavior must be transactionally mapped. |
| MediaAsset / MediaAssetVersion | In-memory runtime | Base schema | Base OpenAPI | Sprint 2, Sprint 3, Sprint 4 | Low | High | Defer | Version immutability and approval hash coupling need DB write-path policy. |
| UsageMeter | In-memory runtime | Base schema | Base OpenAPI | Sprint 2, Sprint 4 readiness regression | Low | High | Defer | Commercial usage rules are not transactionally DB-runtime proven. |
| CostEvent | In-memory runtime | Base schema | Base OpenAPI | Sprint 2, Sprint 4 readiness regression | Low | High | Defer | Cost is non-source-of-truth and must not become billing implementation. |
| ReviewTask | In-memory runtime | Base schema | Base OpenAPI | Sprint 3 | Medium | Medium | Map only until write transaction policy exists | Review task state depends on approval workflow safety. |
| ApprovalDecision | In-memory runtime | Base schema plus Patch 001 behavior | Base OpenAPI | Sprint 0 Patch 001, Sprint 3, Sprint 4 | Low | High | Defer | Decision hash, approved/rejected behavior, and Patch 001 effects are safety-critical. |
| PublishJob | In-memory runtime | Base schema | Base OpenAPI | Sprint 3, Sprint 4 readiness regression | Low | High | Defer | Approved hash and idempotency checks must be atomic before DB runtime. |
| ManualPublishEvidence | In-memory runtime | Base schema plus Patch 001 behavior | Base OpenAPI | Sprint 0 Patch 001, Sprint 3, Sprint 4 | Low | High | Defer | Limited invalidation and immutable proof fields need DB-runtime parity. |
| ClientReportSnapshot | In-memory runtime | Base schema | Base OpenAPI | Sprint 4 | Low | High | Defer | Snapshot freezing and evidence/report hash behavior are not DB-runtime proven. |
| Patch 002 Connector / ConnectorAccount / ConnectorCredential | In-memory runtime | Patch 002 schema | Patch 002 OpenAPI | Patch 002 integration | Low | High | Defer Patch 002 persistence | Credential secret_ref-only behavior must be DB-runtime proven before persistence. |
| Patch 002 WebhookEndpoint / WebhookEventLog / ConnectorSyncRun | In-memory runtime | Patch 002 schema | Patch 002 OpenAPI | Patch 002 integration | Low | High | Defer Patch 002 persistence | Invalid signature handling must not mutate business state. |
| Patch 002 PerformanceEvent / CampaignMetricSnapshot / MetricConfidenceScore | In-memory runtime | Patch 002 schema | Patch 002 OpenAPI | Patch 002 integration | Low | High | Defer Patch 002 persistence | Snapshot immutability and confidence bounds need DB-runtime tests. |
| Patch 002 Contact / ContactIdentifier / ContactConsent / LeadCapture | In-memory runtime | Patch 002 schema | Patch 002 OpenAPI | Patch 002 integration | Low | High | Defer Patch 002 persistence | Consent append-only and cross-workspace campaign/contact checks are sensitive. |
| Patch 002 NotificationRule / NotificationDelivery | In-memory runtime | Patch 002 schema | Patch 002 OpenAPI | Patch 002 integration | Low | High | Defer Patch 002 persistence | Failed delivery isolation must not roll back source operation. |
| AuditLog | In-memory runtime read model and placeholders | Base schema | Base OpenAPI | Sprint 1 placeholders, Sprint 4 audit log route | Low | High | Map audit coupling before write slices | Persistence and transaction coupling are not implemented. |
| SafeMode / Onboarding | In-memory runtime | Base schema | Base OpenAPI | Sprint 4 | Medium | Medium | Map only | Workspace-scoped operational state is runtime-proven but not DB-runtime proven. |

## Candidate Short List

Possible DB-backed Slice 1 candidates, subject to separate review and approval:

| Candidate | Initial assessment | Implementation decision |
| --- | --- | --- |
| BrandProfile / BrandVoiceRule | Narrow workspace-scoped domain with limited lifecycle complexity. | Not approved in this PR. |
| PromptTemplate / ReportTemplate | Useful foundational template domain, but system/workspace boundary needs mapping. | Not approved in this PR. |
| Campaign | Foundational and highly connected, but lifecycle/state transition risk is higher. | Not approved in this PR. |
| BriefVersion | Important, but hash, append-only, and immutability risks are high. | Not approved in this PR. |

## Final Status

- Matrix created.
- Gap register required and created in `docs/runtime_sql_parity_gap_register.md`.
- Test plan required and created in `docs/runtime_sql_parity_test_plan.md`.
- Slice 1 candidate selection required and created in `docs/db_backed_slice_1_candidate_selection.md`.
- Runtime/SQL parity implementation remains NO-GO.
- DB-backed Slice 1 implementation remains NO-GO.
- DB-backed full persistence remains NO-GO.
- Sprint 5 coding remains NO-GO.
- Pilot remains NO-GO.
- Production remains NO-GO.
