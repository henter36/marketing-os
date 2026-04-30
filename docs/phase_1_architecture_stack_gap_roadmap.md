# Phase 1 Architecture and Stack Gap Roadmap

> **Document type:** Architecture fit-gap / development roadmap candidate  
> **Scope:** Documentation-only  
> **Repository:** `henter36/marketing-os`  
> **Status date:** 2026-04-30  
> **Runtime impact:** None  
> **SQL/OpenAPI impact:** None  
> **Pilot:** NO-GO  
> **Production:** NO-GO

---

## Purpose

This document records a strict fit-gap assessment for the current Marketing OS implementation against the expected Phase 1 / V5.6.x product architecture direction.

It captures the major gap between the repository's current plain JavaScript + in-memory router/store baseline and the broader documented product direction that references modular architecture, durable domain entities, review/approval integrity, commercial controls, and frontend/product flows.

This is a roadmap and decision-preparation artifact only. It does not authorize implementation, stack migration, NestJS adoption, SQL/OpenAPI changes, runtime changes, frontend work, provider execution, AI agents, Sprint 5, Pilot, or Production.

---

## Executive Decision

```text
GO: document the Phase 1 architecture and stack gap.
GO: treat the current repository as a controlled baseline, not as Phase 1-ready implementation.
GO: require a stack decision RFC before any NestJS or modular framework migration.
GO: prioritize DB-backed domain foundations before adding new product flows.
NO-GO: immediate NestJS migration without RFC, migration plan, and verification strategy.
NO-GO: continuing broad Phase 1 feature work directly on in-memory router/store as the default path.
NO-GO: implementing Media, Approval, Commercial, or Frontend flows without contract-first SQL/OpenAPI/QA alignment.
```

---

## Current Reality Snapshot

The current repository is valuable because it is disciplined and contract-first, but it is not yet a durable Phase 1 product backend.

Observed current-state position:

```text
Plain JavaScript backend baseline.
Current product routes still default to in-memory runtime unless explicitly switched by future approved PRs.
DB-backed Slice 0 is limited to Workspace / Membership / RBAC repository read-path verification.
Brand Slice 1 is repository-only for BrandProfileRepository and BrandVoiceRuleRepository.
Full DB-backed persistence remains NO-GO.
Pilot and Production remain NO-GO.
Frontend implementation is not present beyond static prototype artifacts.
```

Implication:

```text
The repository is safe to continue only if next work reduces the documentation/runtime gap.
It is unsafe to keep adding high-level product capabilities on top of the in-memory router/store baseline without a controlled DB-backed domain plan.
```

---

## Biggest Gaps and Deviations

### 1. Stack and Architecture Mismatch

The broader product direction references modular architecture concepts such as:

```text
Modules
Guards
Interceptors
Workers
Clear domain services
Background processing
Cross-cutting tenant and audit controls
```

Current implementation is closer to:

```text
Plain JavaScript
router/store layering
limited repository slices
in-memory product routes
```

Risk:

```text
If the team continues building Phase 1 flows directly on in-memory router/store, the repository will accumulate technical debt before Media, Review, Approval, Cost, and Reporting domains become stable.
```

Decision:

```text
Do not jump directly to NestJS.
Create a Stack Decision RFC first.
```

---

### 2. Media Domain Not Operational Yet

Core entities and flows that appear central to the intended product are not yet implemented as durable runtime capabilities:

```text
MediaJob
MediaAsset
MediaAssetVersion
ReviewTask
ApprovalDecision as full approval flow
AssetLineage
Content hash binding
Version binding
```

Current repository has Brand Slice 1 repository-only progress, but not a complete Media domain.

Risk:

```text
Without MediaJob -> MediaAsset -> MediaAssetVersion foundations, text generation, review queue, approval integrity, manual publishing evidence, and reporting will remain fragmented.
```

Decision:

```text
Media domain must become the next major domain-planning track after stack/foundation decisions.
```

---

### 3. Commercial Layer Is Not Mature Enough

The commercial-control layer is still not sufficient for Phase 1 execution:

```text
UsageMeter baseline not durable enough for commercial control.
FeatureGate not mature as a runtime/business gate.
CostGuardrail not implemented as a reliable product control.
SafeModeState not present as a governed operating state.
ProviderUsageLog / BillingProvider remain NO-GO.
```

Risk:

```text
Adding AI/provider execution before cost, usage, feature gating, and safety-state controls would expose the product to uncontrolled spend, inconsistent entitlement behavior, and weak audit posture.
```

Decision:

```text
Commercial controls must precede provider execution and any paid/usage-sensitive automation.
```

---

### 4. Approval Integrity Patch Is Not Yet Implementable as Runtime

The integrity expectations around:

```text
MediaAssetVersion
content_hash
ApprovalDecision binding
PublishJob approved-version matching
immutable approved content
ManualPublishEvidence proof protection
```

cannot fully operate until MediaAsset and MediaAssetVersion exist.

Risk:

```text
Building review/approval UI or publish flows before version/hash integrity creates a false sense of governance.
```

Decision:

```text
Approval integrity must be implemented only after the Media domain exists and SQL/OpenAPI/QA contracts align.
```

---

### 5. Phase 1 Core Flows Are Incomplete

The following product flows remain in-memory, partial, or absent:

```text
Brief Builder
PromptTemplate -> MediaJob text generation flow
Review Queue
Approval flow
ManualPublishEvidence
ClientReportSnapshot
Frontend product experience
```

Risk:

```text
A Phase 1 label would be misleading until these flows are backed by durable domain behavior and tests.
```

Decision:

```text
Do not authorize Sprint 5, Pilot, or Production until these flows are decomposed into approved, testable slices.
```

---

## Readiness Assessment

Indicative readiness for continued controlled development:

```text
55% - 60%
```

This does not mean product readiness. It means the repository has enough disciplined baseline to continue, but only if the next roadmap closes foundational gaps instead of expanding product scope.

Breakdown:

```text
Governance discipline: Strong
Documentation depth: Strong but ahead of implementation
Runtime durability: Weak outside limited slices
DB-backed product persistence: Weak / NO-GO
Media domain readiness: Weak
Commercial controls: Weak
Approval integrity runtime: Weak
Frontend readiness: Weak
Pilot readiness: NO-GO
Production readiness: NO-GO
```

---

## Stack Decision: Do Not Treat NestJS as Automatic

### Option A — Continue Plain JS, But Modularize Strictly

```text
Recommendation: Best immediate path.
```

Why:

```text
Lowest migration risk.
Preserves existing verification gates.
Allows DB-backed slices to mature.
Avoids framework rewrite while domain model is still moving.
```

Required actions:

```text
Create clear domain modules inside current structure.
Keep route/store behavior constrained.
Move persistence through repositories by slice.
Add explicit service boundaries.
Strengthen guards and audit controls without framework lock-in.
```

Risk:

```text
If modular discipline is weak, the plain JS codebase may become harder to govern than a framework-based architecture.
```

---

### Option B — Move to NestJS After Foundation Slices

```text
Recommendation: Conditional later path.
```

Why:

```text
NestJS may fit a larger team and modular domain architecture.
It offers natural placement for modules, guards, interceptors, providers, queues, and workers.
```

Required before migration:

```text
Stack Decision RFC
Module boundary map
Migration strategy
Parallel run / compatibility plan
Test migration plan
Performance and operational impact review
Rollback plan
CI impact review
Package/workflow approval
```

Risk:

```text
A premature migration could consume effort without solving the domain persistence and approval integrity gaps.
```

---

### Option C — Immediate Full Rewrite to NestJS

```text
Recommendation: Reject now.
```

Reason:

```text
Too much unresolved domain work.
Current verified gates would be disrupted.
The repository still needs domain slice clarity more than framework churn.
```

---

## Recommended Development Priorities

### Priority 0 — Architecture Decision and Gap Lock

```text
Create a Stack Decision RFC.
Lock the current plain JS vs NestJS decision criteria.
Define module boundaries independent of framework.
Freeze broad Phase 1 feature coding until gaps are decomposed.
```

Expected output:

```text
docs/stack_decision_rfc_plain_js_vs_nestjs.md
docs/phase_1_domain_gap_register.md
```

---

### Priority 1 — DB-backed Foundation

Scope:

```text
Workspace
Membership
RBAC
AuditLog baseline
Tenant isolation tests
Composite indexes where applicable
Optional RLS feasibility review
```

Goal:

```text
Move from proof-style DB read paths toward durable repository-backed foundation behavior.
```

Guardrail:

```text
Do not claim full DB-backed persistence until all affected runtime paths are actually switched and tested.
```

---

### Priority 2 — Media Domain Foundation

Scope:

```text
MediaJob
MediaAsset
MediaAssetVersion
MediaJob -> MediaAsset relationship
Text-only media generation first
AssetLineage later
```

Goal:

```text
Establish the durable unit of generated/managed content before review, approval, evidence, and reporting flows.
```

Required before implementation:

```text
ERD review
SQL review
OpenAPI review
QA suite
Repository-only implementation plan
Runtime switch plan only after repository verification
```

---

### Priority 3 — Approval Integrity Foundation

Scope:

```text
ReviewTask
ApprovalDecision
MediaAssetVersion approval binding
content_hash validation
immutable approved version behavior
PublishJob approved-version matching
```

Goal:

```text
Prevent approval from becoming a weak status flag disconnected from immutable content versions.
```

Guardrail:

```text
No review queue or publish flow should be treated as governed until version/hash binding is in place.
```

---

### Priority 4 — Commercial and Safety Controls

Scope:

```text
UsageMeter
FeatureGate
CostEvent baseline
CostGuardrail
SafeModeState
Provider execution NO-GO until controls exist
```

Goal:

```text
Prepare for controlled AI/provider usage without uncontrolled spend or ungoverned feature access.
```

Guardrail:

```text
CostEvent remains non-billing / non-invoice source unless a future approved commercial contract changes that.
```

---

### Priority 5 — Core Product Flows

Scope:

```text
Brief Builder
PromptTemplate -> MediaJob text generation
Review Queue
ManualPublishEvidence append-only proof flow
ClientReportSnapshot basic
```

Goal:

```text
Turn documented Phase 1 workflows into durable, testable slices.
```

Guardrail:

```text
Each flow must be implemented as a separately approved slice with SQL/OpenAPI/QA alignment.
```

---

### Priority 6 — Frontend Product Experience

Scope:

```text
Frontend application planning
OpenAPI-bound endpoints only
No invented frontend endpoints
Review queue UX
Brief builder UX
Evidence upload UX
Report snapshot UX
```

Goal:

```text
Move beyond static prototype only after backend contracts stabilize.
```

Guardrail:

```text
Frontend must not invent endpoints outside OpenAPI.
```

---

## Immediate NO-GO Items

```text
Immediate NestJS rewrite.
Sprint 5 coding before stack/domain gap review.
Patch 003 activation without current gap reconciliation.
Media domain coding without SQL/OpenAPI/QA plan.
Review queue coding before MediaAssetVersion integrity.
ManualPublishEvidence coding without immutability and content hash plan.
Provider abstraction execution before commercial controls.
Frontend implementation before backend contract stabilization.
Pilot.
Production.
```

---

## Proposed Issue Candidates

### Issue 1 — Stack Decision RFC: Plain JS Modularization vs NestJS

```text
Type: Architecture RFC
Priority: Critical
Scope: decide near-term architecture path and migration criteria
Implementation: NO
```

### Issue 2 — Phase 1 Domain Gap Register

```text
Type: Architecture / governance documentation
Priority: Critical
Scope: map docs-vs-runtime gaps for Media, Approval, Commercial, Core Flows, Frontend
Implementation: NO
```

### Issue 3 — DB-backed Foundation Plan

```text
Type: Technical planning
Priority: Critical
Scope: Workspace / Membership / RBAC / AuditLog durability path
Implementation: NO until reviewed
```

### Issue 4 — Media Domain Foundation Plan

```text
Type: Domain planning
Priority: Critical
Scope: MediaJob, MediaAsset, MediaAssetVersion, text-only first
Requires: ERD / SQL / OpenAPI / QA review
```

### Issue 5 — Approval Integrity Plan

```text
Type: Domain planning / governance
Priority: Critical
Scope: ReviewTask, ApprovalDecision, content_hash, immutable approved versions
Requires: Media foundation
```

### Issue 6 — Commercial Controls Plan

```text
Type: Domain planning
Priority: High
Scope: UsageMeter, FeatureGate, CostGuardrail, SafeModeState
Requires: cost and safety governance
```

### Issue 7 — Core Flow Slice Plan

```text
Type: Product flow planning
Priority: High
Scope: Brief Builder, Text Generation, Review Queue, ManualPublishEvidence, ClientReportSnapshot
Requires: DB-backed Media / Approval foundations
```

### Issue 8 — Frontend Readiness Plan

```text
Type: Product / frontend planning
Priority: Medium
Scope: move from prototype to OpenAPI-bound frontend slices
Requires: stable backend contracts
```

---

## Recommended Next Step

The next safe PR should not be implementation.

Recommended next PR:

```text
Add Stack Decision RFC: Plain JS modularization vs NestJS
```

Purpose:

```text
Decide whether the repository should harden the existing plain JS architecture or plan a controlled NestJS migration later.
```

Required decision criteria:

```text
Team size and skill set
Domain complexity
Migration cost
Verification impact
Package/workflow impact
CI stability
Rollback path
Compatibility with existing repository slices
Ability to implement guards/interceptors/workers without framework lock-in
```

---

## Final GO / NO-GO Decision

```text
GO: document the Phase 1 architecture and stack gap as roadmap input.
GO: treat readiness as controlled-development readiness only, not product readiness.
GO: create a stack decision RFC before architecture migration.
CONDITIONAL GO: continue plain JS only if strict modular boundaries and DB-backed slices are enforced.
CONDITIONAL GO: NestJS only after RFC, migration plan, and verification strategy.
NO-GO: immediate NestJS rewrite.
NO-GO: new Phase 1 code before DB-backed/domain gap plans are approved.
NO-GO: Sprint 5 / Pilot / Production authorization from this document.
```
