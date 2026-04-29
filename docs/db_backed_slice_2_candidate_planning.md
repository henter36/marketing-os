# DB-backed Slice 2 Candidate Planning

## 1. Executive Decision

```text
DB-backed Slice 2 Candidate Planning: GO.
Slice 2 implementation: NO-GO until candidate is selected and separately planned.
DB-backed full persistence: NO-GO.
Campaign persistence: NO-GO until separately planned.
BriefVersion persistence: NO-GO until separately planned.
Patch002 DB persistence: NO-GO.
Sprint 5 coding: NO-GO.
Pilot: NO-GO.
Production: NO-GO.
```

This is a documentation-only planning artifact. It does not implement Slice 2, does not change runtime behavior, does not modify SQL/OpenAPI, and does not authorize Sprint 5, Pilot, or Production readiness.

## 2. Purpose

Slice 0 proved Workspace/Membership/RBAC repository reads and pg adapter behavior. Slice 1 proved BrandProfile/BrandVoiceRule repository persistence and a gated Brand-only runtime switch. Config validation is now hardened so invalid explicit `BRAND_RUNTIME_MODE` fails safely instead of hiding misconfiguration.

Slice 2 must be selected conservatively based on parity risk, write complexity, runtime impact, SQL/OpenAPI readiness, rollback simplicity, and product value. This PR chooses a planning candidate only. It does not implement Slice 2.

## 3. Current Architecture Baseline

```text
HTTP/runtime product routes: mostly in-memory.
Brand routes: gated repository mode only.
Default runtime: in_memory.
DB-backed full persistence: not implemented.
Other domains: in-memory unless explicitly proven otherwise.
Durable AuditLog persistence: not implemented.
Patch 002 DB persistence: NO-GO.
```

Current DB-backed evidence is intentionally narrow:

- Slice 0 covers Workspace/Membership/RBAC repository read paths.
- Brand Slice 1 covers BrandProfileRepository and BrandVoiceRuleRepository list/create/internal validation methods.
- Brand runtime switch applies only to approved Brand list/create routes and only when explicitly configured.
- Patch 002 remains a limited in-memory runtime baseline plus strict SQL migration activation.

## 4. Candidate Domains

| Candidate | Current runtime status | SQL status | OpenAPI status | Existing tests | Write complexity | Immutability/idempotency risk | Tenant isolation risk | ErrorModel risk | Audit dependency | Runtime switch impact | Rollback simplicity | Recommendation | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| PromptTemplate / ReportTemplate | In-memory runtime | Base schema tables `prompt_templates`, `report_templates` | Base OpenAPI list/create routes | Sprint 1 template coverage and Sprint 4 report usage | Low to medium | Medium due version/status/template boundary rules | Medium | Medium | Placeholder only unless durable audit is separately planned | Low to medium if repository-only first | High if scoped repository-only | Recommend as Slice 2 planning candidate | Narrower than Campaign, lower hash/approval risk than BriefVersion, useful foundation. |
| Campaign | In-memory runtime | Base schema `campaigns` | Base OpenAPI list/create/get/patch routes | Sprint 1+ campaign behavior and downstream tests | Medium | Medium to high due status lifecycle and transition coupling | Medium | Medium | Sensitive writes expect audit placeholder/event | Medium to high | Medium | Defer until campaign-specific planning | Foundational but can imply broader product persistence readiness too early. |
| BriefVersion | In-memory runtime | Base schema `brief_versions` with hash/immutability trigger coverage | Base OpenAPI list/create routes | Sprint 1 create/list and immutability behavior | Medium | High due server-side hash, append-only, latest version, immutability | Medium | High | Audit expectation for version creation | Medium | Medium to low | Defer | Poor next candidate until stricter hash/version parity is mapped. |
| ClientReportSnapshot | In-memory runtime | Base schema `client_report_snapshots` with immutability trigger | Base OpenAPI list/create routes | Sprint 4 report snapshot tests | Medium | High due snapshot freeze/content hash/evidence capture | Medium | Medium | Report generation audit expectation | Medium | Medium | Defer behind templates | Narrow route surface but snapshot immutability and evidence dependencies increase risk. |
| AuditLog | In-memory read model/placeholders | Base schema `audit_logs`, append-only trigger | Base OpenAPI read route | Sprint 4 audit route and placeholder checks | Medium to high | High because audit coupling can become source-of-truth confusion | Medium | Medium | It is the audit domain itself | Medium | Medium | Defer until write-path policy | Should not be implemented casually as it may create false durable evidence claims. |
| CampaignStateTransition | In-memory runtime | Base schema `campaign_state_transitions` | Base OpenAPI list/change-state routes | Sprint 1 campaign state transition behavior | Medium | High due state/transition atomicity | Medium | Medium | Campaign status-change audit expectation | Medium | Medium | Defer behind Campaign planning | Should be planned with Campaign transaction policy, not alone by assumption. |
| UsageMeter / CostEvent | In-memory runtime | Base schema `usage_meter`, `cost_events`, quota/cost guardrail tables | Base OpenAPI usage/cost routes | Sprint 2 and Sprint 4 readiness regression | High | High due commercial usage, idempotency, non-billing constraints | Medium | High | Strong audit and business safety dependency | High | Low to medium | Defer | Financial/commercial implications make this unsuitable as Slice 2. |
| MediaJob / MediaAsset / MediaAssetVersion | In-memory runtime | Base schema media tables, triggers, cost snapshot dependencies | Base OpenAPI media routes | Sprint 2, Sprint 3, Sprint 4 tests | High | High due idempotency, status transitions, hash/approval coupling | Medium | High | Strong audit dependency | High | Low | Defer | High blast radius and provider/cost/approval adjacency. |
| ApprovalDecision / PublishJob / ManualPublishEvidence | In-memory runtime | Base schema plus Patch 001 safety behavior | Base OpenAPI approval/publish/evidence routes | Sprint 0 Patch 001, Sprint 3, Sprint 4 tests | High | Critical due approvals, approved hash, publish idempotency, evidence protections | Medium | High | Strong audit/evidence dependency | High | Low | Defer | Safety-critical workflow should not be used for Slice 2. |
| Patch002 connector/contact/performance/notification domains | Limited in-memory Patch 002 runtime | Patch 002 schema active in strict migration order | Patch 002 OpenAPI | Patch 002 runtime and QA addendum coverage | Medium to high | High due credentials, webhook signature, consent append-only, metric snapshots, delivery failure isolation | High | High | Patch 002 audit placeholder only | High | Low | Defer | Patch 002 DB persistence remains NO-GO until core product persistence patterns mature. |

## 5. Candidate Ranking

Safest to riskiest:

1. PromptTemplate / ReportTemplate.
2. ClientReportSnapshot.
3. Campaign.
4. CampaignStateTransition.
5. BriefVersion.
6. AuditLog.
7. UsageMeter / CostEvent.
8. MediaJob / MediaAsset / MediaAssetVersion.
9. ApprovalDecision / PublishJob / ManualPublishEvidence.
10. Patch002 connector/contact/performance/notification domains.

Reasoning:

- Templates are narrower and lower lifecycle risk than Campaign.
- ClientReportSnapshot has snapshot/immutability concerns but a narrower route surface than Campaign lifecycle persistence.
- Campaign is foundational but introduces status lifecycle, transition history, and downstream persistence expectations.
- BriefVersion has hash, append-only, immutability, and latest-version risks.
- AuditLog should not be implemented casually because it may become a false source of business truth.
- Usage/Cost has financial and commercial usage implications.
- Media/Approval/Publish/Evidence has high immutability, hash, state transition, provider, and evidence risk.
- Patch 002 persistence should remain deferred until core product-domain persistence patterns mature.

## 6. Recommended Slice 2 Candidate

Recommended Slice 2 planning candidate: PromptTemplate / ReportTemplate.

Justification:

- Narrower than Campaign.
- Lower immutability/hash risk than BriefVersion.
- Useful foundation for future content and report generation workflows.
- Likely lower runtime switch blast radius.
- Expected to avoid SQL/OpenAPI changes if existing contracts are aligned.
- Can be implemented repository-only first, with any runtime switch planned separately later.

If PromptTemplate / ReportTemplate mapping shows contract or runtime ambiguity, the next step should be a mapping addendum before implementation, not a blind switch to another domain.

## 7. Why Not Campaign Next

Campaign is foundational, but it should not be next unless lifecycle/status parity and transition history are mapped first.

Campaign persistence can create downstream expectations for BriefVersion, MediaJob, MediaAsset, ApprovalDecision, PublishJob, reports, performance metrics, lead captures, and Patch 002 campaign-scoped behavior. Premature Campaign persistence risks false DB-backed product readiness and broader runtime assumptions than this incremental repository strategy allows.

## 8. Why Not BriefVersion Next

BriefVersion involves versioning, server-side content hashing, append-only behavior, latest-version semantics, immutability protections, and audit expectations. It should not be selected before stricter parity mapping and tests prove the runtime and SQL constraints agree.

## 9. Why Not Patch002 Next

Patch 002 includes connector credentials, webhook event logging, contact consent, lead capture, performance events, metric snapshots, and notification delivery tracking. These areas carry secret governance, append-only consent, external-event idempotency, metric immutability, and provider failure isolation risk.

Patch 002 DB persistence remains NO-GO.

## 10. Required Next Planning Artifact

If PromptTemplate / ReportTemplate remains selected, the required next planning artifact is:

```text
docs/db_backed_slice_2_template_planning.md
```

That future planning PR should map:

- runtime routes and behavior;
- SQL tables and columns;
- OpenAPI contracts;
- repository methods;
- tenant isolation;
- duplicate, version, and status behavior;
- response shape;
- ErrorModel mapping;
- audit placeholder policy;
- required tests;
- rollback strategy;
- Go/No-Go for implementation.

## 11. Future Implementation Boundaries

Future Slice 2 implementation, if later approved, must remain bounded:

```text
Repository-only first.
No runtime switch unless separately planned.
No SQL/OpenAPI changes unless a contract PR is approved first.
No Campaign/Brief/Patch002 expansion.
No durable AuditLog claim.
No DB-backed full persistence claim.
No Sprint 5.
No Pilot.
No Production.
```

## 12. Required Tests For Future Slice 2

Future tests should be planned before implementation and should include:

- repository list/create/get behavior as applicable;
- workspace isolation;
- duplicate or version conflict handling;
- status validation;
- ErrorModel sanitization;
- no raw DB details;
- response shape parity;
- no OpenAPI drift;
- existing Sprint 0/1/2/3/4, Patch 002, Brand repository, Brand runtime switch, and config hardening tests still pass;
- strict migration and migration retry still pass.

These tests are not implemented in this planning PR.

## 13. Risks

- Choosing a candidate based on perceived simplicity without mapping evidence.
- Accidentally starting Campaign lifecycle persistence.
- Treating a repository-only slice as full runtime persistence.
- Creating a false Pilot or Production signal.
- Leaving runtime in-memory while assuming DB-backed behavior.
- Hidden SQL/OpenAPI mismatch.
- Audit placeholder mistaken for durable audit.
- Test flakiness due to DB state.
- Scope creep into Patch 002.
- Breaking Brand runtime switch or config behavior while doing unrelated work.

## 14. Go / No-Go

GO to next planning only if:

- the candidate is selected based on evidence;
- implementation remains NO-GO;
- scope is narrow;
- SQL/OpenAPI changes are not assumed;
- rollback and test strategy are planned.

NO-GO if:

- the PR tries to implement Slice 2;
- the PR modifies runtime/code/tests/contracts;
- the PR selects Campaign, BriefVersion, or Patch 002 without mapping rationale;
- the PR claims DB-backed full persistence;
- the PR opens Sprint 5, Pilot, or Production scope.

## 15. Recommended Next Step

Recommended next step: DB-backed Slice 2 Template Planning.

Do not start implementation. Do not start Sprint 5. Do not start Pilot or Production readiness.

## 16. Final Decision

```text
DB-backed Slice 2 Candidate Planning: GO.
Recommended next step: DB-backed Slice 2 Template Planning.
Slice 2 implementation: NO-GO.
DB-backed full persistence: NO-GO.
Campaign persistence: NO-GO.
BriefVersion persistence: NO-GO.
Patch002 DB persistence: NO-GO.
Sprint 5 coding: NO-GO.
Pilot: NO-GO.
Production: NO-GO.
```
