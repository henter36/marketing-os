# PRD Phase 0/1 Reconciliation After Brand Slice 1

> **Document type:** PRD reconciliation / scope-control addendum  
> **Scope:** Documentation-only / Phase 0/1 governance  
> **Repository:** `henter36/marketing-os`  
> **Status:** Binding clarification for PRD usage after Brand Slice 1  
> **Runtime impact:** None  
> **SQL/OpenAPI impact:** None  
> **Pilot:** NO-GO  
> **Production:** NO-GO

---

## 1. Executive Decision

The current PRD / master lock sheet remains valid as a strategic product direction document, but it must not be used as a direct implementation source unless this reconciliation is applied.

The PRD is directionally aligned with the Marketing OS plan: governed, phased, AI-assisted, multi-modal, human-in-the-loop, and scope-controlled.

However, several PRD sections describe future strategic capabilities as if they are Phase 0/1 build items. That creates execution risk for Codex and any implementation agent.

**Decision:**

```text
GO: Use the PRD for product vision and phased strategic direction.
GO: Use this reconciliation as the binding PRD correction layer for Phase 0/1 execution.
NO-GO: Use the PRD alone as an implementation contract.
NO-GO: Add runtime, SQL, OpenAPI, migration, or test changes from this reconciliation.
NO-GO: Pilot or Production.
```

---

## 2. Source-of-Truth Precedence

When PRD wording conflicts with repository contracts or current-state documents, apply this precedence:

```text
1. README.md for current repository execution status.
2. docs/current_repository_status_after_brand_slice_1.md for current post-Brand-Slice-1 status.
3. docs/17_change_log.md for accepted historical and current changes.
4. docs/marketing_os_v5_6_5_phase_0_1_erd.md for Phase 0/1 relationship authority.
5. docs/marketing_os_v5_6_5_phase_0_1_schema.sql plus approved schema patches for database authority.
6. docs/marketing_os_v5_6_5_phase_0_1_openapi.yaml plus approved OpenAPI patches for API authority.
7. docs/marketing_os_v5_6_5_phase_0_1_qa_test_suite.md for QA gates.
8. docs/marketing_os_v5_6_5_codex_implementation_instructions.md for Codex execution discipline, except where it is older than README / current status / change log.
9. docs/01_master_document.md as PRD vision and strategy, not as a direct implementation override.
```

Hard rule:

```text
If any conflict remains unresolved, Codex must stop and report the conflict instead of implementing by assumption.
```

---

## 3. Current Implementation Reality To Be Reflected In The PRD

The PRD must explicitly reflect the current repository reality:

```text
Sprint 0 through Sprint 4: GO / completed / verified.
Repository cleanup after Sprint 4: GO / merged.
Patch 002: GO only as limited in-memory runtime baseline and SQL migration activation in strict order.
Patch 002 DB persistence: NO-GO.
DB-backed Slice 0: GO only for Workspace / Membership / RBAC repository read-path verification.
pg adapter: GO only for DB-backed Slice 0.
Brand Slice 1: GO / merged / verified as repository-only BrandProfile / BrandVoiceRule implementation.
HTTP/runtime product routes: still in-memory unless separately switched by approved PR.
Brand runtime route switch: NO-GO.
Public Brand get/update routes: NO-GO.
SQL/OpenAPI changes from this reconciliation: NO-GO.
DB-backed full persistence: NO-GO.
Sprint 5 coding: NO-GO.
Pilot: NO-GO.
Production: NO-GO.
```

This means the PRD must not imply that the product is pilot-ready, production-ready, commercially launchable, or fully DB-backed.

---

## 4. PRD Scope Corrections

### 4.1 Strategic Future Capabilities Are Not Phase 0/1 Build Items

The following PRD concepts are valid strategic capabilities, but they are not approved Phase 0/1 implementation items unless a separate approved contract patch adds ERD, SQL, OpenAPI, QA, and execution instructions:

```text
AIProvider
AIProviderCredential
AIModelRegistry
ModelRoutingPolicy
ProviderUsageLog
ProviderQuotaState
ProviderFailureEvent
BillingProvider
BillingProviderConfig
PublishedPostSnapshot
AttributionDecision
SocialAutoPublishConnector
PaidExecution
AgentRun
Full AI agents
Advanced attribution
Automated campaign orchestration
External provider execution
Live sync execution
```

Correct Phase 0/1 classification:

| Capability | PRD treatment | Phase 0/1 execution decision |
|---|---|---|
| Provider abstraction strategy | Strategic direction | Future contract required |
| AI provider registry | Strategic / schema-ready concept | NO-GO until contract patch |
| Model registry | Strategic / schema-ready concept | NO-GO until contract patch |
| Provider credentials | Future integration concept | NO-GO until security contract patch |
| Provider usage logs | Future provider telemetry | NO-GO until contract patch |
| Billing provider | Future commercial integration | NO-GO until billing contract patch |
| Auto-publishing | Future capability | NO-GO |
| Paid execution | Future capability | NO-GO |
| AI agents | Post V1 capability | NO-GO |
| Advanced attribution | Phase 2+ capability | NO-GO |

### 4.2 Phase 0/1 Approved Core Remains Narrower

The approved Phase 0/1 implementation authority remains centered on:

```text
CustomerAccount
Workspace
User
WorkspaceMember
Role
Permission
RolePermission
CustomerSubscription
CustomerSubscriptionSnapshot
SubscriptionPlan
SubscriptionPlanVersion
PlanEntitlementVersion
Campaign
CampaignStateTransition
BriefVersion
PromptTemplate
MediaJob
MediaCostSnapshot
MediaAsset
MediaAssetVersion
CreativePackage
ReviewTask
ApprovalDecision
PublishJob
ManualPublishEvidence
TrackedLink
BrandProfile
BrandVoiceRule
ReportTemplate
UsageMeter
UsageQuotaState
CostEvent
CostBudget
CostGuardrail
MediaCostPolicy
AuditLog
AdminNotification
SafeModeState
OnboardingProgress
SetupChecklistItem
ClientReportSnapshot
```

Any entity outside this list must be treated as future, inspiration, or contract-patch-required.

---

## 5. Legacy Naming Lock

The PRD may use historical or explanatory labels only if they are not interpreted as implementation names.

The following names are forbidden as implementation artifacts:

```text
GenerationJob
Asset
Approval
Approved Asset
Publish Asset
```

Approved implementation names are:

| Legacy / narrative term | Approved execution name |
|---|---|
| GenerationJob | MediaJob |
| Asset | MediaAsset / MediaAssetVersion |
| Approval | ApprovalDecision |
| Approved Asset | Approved MediaAssetVersion |
| Publish Asset | Publish approved MediaAssetVersion via ApprovalDecision + content_hash |

Binding rule:

```text
Do not create tables, repositories, endpoints, tests, routes, classes, fixtures, docs sections, or migrations using forbidden legacy names as execution names.
```

---

## 6. Patch 002 Reconciliation Lock

Patch 002 must be represented in the PRD as follows:

```text
GO: Patch 002 limited in-memory runtime baseline.
GO: Patch 002 SQL migration activation in strict migration order.
GO: Migration retry verification under CI.
NO-GO: Patch 002 DB persistence.
NO-GO: Treating Patch 002 as production-ready implementation.
NO-GO: External provider execution.
NO-GO: Live sync execution.
NO-GO: Advanced attribution.
NO-GO: Auto-publishing.
NO-GO: Paid execution.
NO-GO: AI agents.
NO-GO: BillingProvider or ProviderUsageLog implementation.
```

Any older instruction that says Patch 002 is not in the active migration order must be reconciled before it is used for execution planning.

---

## 7. DB-backed Runtime Gate

The PRD must include this gate before any pilot, production, or commercial exposure:

```text
No Pilot before product routes are DB-backed, tested, and verified for the approved Phase 0/1 domains required for the pilot path.
```

Minimum pilot-path DB-backed domains must be explicitly planned before coding:

```text
Workspace / Membership / RBAC
BrandProfile / BrandVoiceRule runtime route switch, if included
Campaign
BriefVersion
PromptTemplate
MediaJob
MediaAsset / MediaAssetVersion
ReviewTask
ApprovalDecision
PublishJob
ManualPublishEvidence
TrackedLink
Usage / Cost baseline
AuditLog
ClientReportSnapshot
```

Current Brand Slice 1 does not satisfy this gate because it is repository-only and does not switch HTTP/runtime product routes.

---

## 8. Integration Boundary Lock

The PRD must not authorize external integrations to become operational sources of truth for Phase 0/1.

Forbidden integration patterns:

```text
Shared database with external systems.
External system directly mutating core campaign, approval, publish, usage, or report truth.
Bidirectional sync without ownership rules.
Unsigned or unaudited webhooks.
Plaintext secret storage.
Auto-publishing without explicit approval and platform-policy review.
Provider cost treated as customer billing source.
```

Allowed integration posture for current Phase 0/1 planning:

```text
Document integration strategy.
Define future connector boundaries.
Keep core truth in Marketing OS approved entities.
Use future contract patches before any runtime integration.
```

---

## 9. PRD Readiness Decision

The PRD is not rejected. It is reclassified:

```text
Strategic product direction: ACCEPTED.
Direct implementation source: RESTRICTED.
Phase 0/1 execution source: ONLY with this reconciliation plus ERD/SQL/OpenAPI/QA/Codex guardrails.
Pilot readiness: NO-GO.
Production readiness: NO-GO.
```

---

## 10. Allowed Next Step

The next allowed step is documentation-only planning:

```text
Create a scoped Sprint 5 planning document or Brand runtime switch planning document.
Do not implement runtime route switch until the plan defines allowed files, forbidden files, tests, rollback strategy, and CI gates.
```

Recommended next document options, in order:

| Priority | Document | Purpose | Status |
|---|---|---|---|
| 1 | Brand Slice 1 Runtime Switch Planning | Plan the safe route switch from in-memory to DB-backed Brand repositories | GO for planning only |
| 2 | DB-backed Slice 2 Candidate Selection | Select next persistence slice after Brand | GO for planning only |
| 3 | Codex Instructions Reconciliation | Align Codex instructions with current README / change log / Patch 002 status | GO |
| 4 | PRD Master Rewrite | Rewrite `docs/01_master_document.md` only after reconciliation is accepted | CONDITIONAL GO |

---

## 11. Forbidden Next Steps

```text
No Sprint 5 coding from this document.
No SQL changes from this document.
No OpenAPI changes from this document.
No runtime route switch from this document.
No public Brand get/update routes from this document.
No DB-backed full persistence claim.
No Patch 002 DB persistence.
No Patch 003 activation.
No AIProvider / AIModelRegistry / ProviderUsageLog / BillingProvider implementation.
No external provider execution.
No auto-publishing.
No paid execution.
No AI agents.
No Pilot.
No Production.
```

---

## 12. Codex Operating Instruction

When Codex or another implementation agent reads the PRD, it must apply this instruction:

```text
Read the PRD as product vision.
Read this reconciliation as the binding correction layer.
Read ERD / SQL / OpenAPI / QA as implementation authority.
Read README / current status / change log as repository reality.
If PRD ambition conflicts with implementation contracts, preserve the contract and report the gap.
Do not implement future strategic capabilities by inference.
```

---

## 13. Final Decision

```text
PRD after reconciliation: CONDITIONALLY ACCEPTED.
Execution from PRD alone: NO-GO.
Execution from PRD + reconciliation + ERD/SQL/OpenAPI/QA/Codex guardrails: GO only for approved planning branches.
Runtime implementation: NO-GO until separate approved plan.
Pilot: NO-GO.
Production: NO-GO.
```
