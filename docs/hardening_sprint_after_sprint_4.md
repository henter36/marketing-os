# Hardening Sprint After Sprint 4

## Executive Decision

```text
GO: Hardening Sprint only.
NO-GO: Sprint 5 feature expansion.
NO-GO: Pilot.
NO-GO: Production.
```

The repository has implemented Sprint 0/1/2/3/4 and completed partial repository cleanup after Sprint 4. The next correct step is not adding features. The next correct step is hardening the implementation baseline so the project can safely move from a contract-first in-memory backend surface toward a pilot-capable SaaS foundation.

---

## Purpose

This document locks the next workstream to hardening only.

It prevents the following execution risks:

- Adding Sprint 5 features before runtime persistence is real.
- Treating in-memory behavior as pilot-ready behavior.
- Treating test/header AuthGuard as production authentication.
- Allowing audit events to remain placeholder-only while exposing audit read workflows.
- Expanding Safe Mode without an approved protected-write policy.
- Inventing PilotGate, AdminNotification, or SetupChecklistItem APIs outside OpenAPI.
- Continuing with stale project status metadata.

---

## Non-Negotiable Scope

Hardening Sprint may include only:

1. Documentation and metadata alignment.
2. Behavior-equivalence cleanup planning and verification.
3. PostgreSQL runtime persistence design and phased implementation plan.
4. Production authentication boundary design.
5. Audit append-only enforcement plan.
6. Safe Mode protected-write policy definition.
7. Pilot readiness contract clarification.
8. QA expansion for hardening risks.
9. OpenAPI/schema/backlog patches only where required to close documented gaps.

Hardening Sprint must not include:

```text
Sprint 5 feature expansion
frontend shell
auto-publishing
paid execution
AI agents
advanced attribution
BillingProvider
ProviderUsageLog
external provider execution
unapproved PilotGate API
unapproved AdminNotification API
unapproved SetupChecklistItem API
new unapproved entities
```

---

## Current Confirmed State

| Area | Current State | Hardening Risk |
|---|---|---|
| Sprint implementation | Sprint 0/1/2/3/4 implemented | Good progress, but feature velocity is ahead of production readiness |
| Runtime persistence | In-memory store | Cannot support pilot, restart, concurrency, or real tenant data |
| PostgreSQL | SQL migrations validated | Schema exists, but runtime does not use it as source of truth |
| Authentication | Header/test-user based AuthGuard | Not acceptable for pilot or production |
| Authorization | RBAC and workspace membership checks implemented | Needs DB-backed enforcement and negative regression tests after persistence migration |
| Audit | In-memory audit placeholder events with read endpoint | Needs append-only persistence and tamper-resistance before pilot |
| Safe Mode | State read/change implemented | Protected-write behavior is not fully defined |
| Reports | ClientReportSnapshot implemented | Snapshot immutability must survive DB migration and evidence changes |
| Repository cleanup | Sprint 3/4 moved under src; Sprint 0/1/2 root base retained | Needs future flattening with behavior-equivalence proof |
| README/package/CI naming | Updated in this branch | Must remain synchronized with future sprint state |

---

## Required Hardening Work Packages

### H1. Documentation and Metadata Alignment

#### Required changes

- README must state Sprint 0/1/2/3/4 are implemented.
- README must state the project is not pilot-ready or production-ready.
- `package.json` must not describe the project as Sprint 0 only.
- GitHub Actions workflow naming must not imply Sprint 0 only.
- Cleanup report must not leave a stale conditional status after the PR has passed and merged.

#### Acceptance criteria

- A new contributor can identify the true current status in under five minutes.
- No top-level metadata says Sprint 0 is the current implementation state.
- Next step is explicitly hardening, not Sprint 5.

---

### H2. Behavior-Equivalence Cleanup Plan

#### Problem

`src/router_sprint3.js` and `src/store_sprint3.js` still depend on root `router.js` and `store.js` as the Sprint 0/1/2 base implementation.

This is acceptable temporarily, but it is not a clean long-term structure.

#### Required plan

- Do not flatten root `router.js` and `store.js` casually.
- First create behavior-equivalence tests covering all implemented routes and critical negative cases.
- Then move Sprint 0/1/2 base logic under `src/` in a dedicated cleanup branch.
- Keep route outputs, status codes, ErrorModel shape, and audit side effects identical.

#### Acceptance criteria

- `implementedRoutes` count and contents are unchanged after flattening.
- All existing integration tests pass.
- New behavior-equivalence snapshot tests pass.
- No endpoint, permission, or status code changes.

---

### H3. PostgreSQL Runtime Persistence Plan

#### Problem

The SQL schema is validated by migration gates, but runtime behavior still uses in-memory state.

This blocks pilot readiness.

#### Required plan

- Introduce repository/service layer interfaces before replacing store behavior.
- Migrate one domain at a time, not all domains at once.
- Preserve route behavior while replacing data access.
- Enforce tenant scope at query level for every workspace-scoped read/write.
- Preserve idempotency semantics in database tables.
- Preserve immutable content hash behavior for BriefVersion, MediaAssetVersion, ManualPublishEvidence, and ClientReportSnapshot.
- Preserve append-only audit behavior.

#### Suggested migration sequence

1. Workspace, User, Membership, Role, Permission.
2. Campaign, CampaignStateTransition, BrandProfile, templates, BriefVersion.
3. MediaJob, MediaAsset, MediaAssetVersion, cost/usage domains.
4. ReviewTask, ApprovalDecision, PublishJob, ManualPublishEvidence.
5. ClientReportSnapshot, AuditLog, SafeModeState, OnboardingProgress.

#### Acceptance criteria

- In-memory store remains test-only or is removed from runtime.
- Runtime reads/writes use PostgreSQL.
- Tests prove tenant isolation after DB migration.
- Tests prove idempotency replay/conflict behavior after DB migration.
- Tests prove immutable entities remain immutable after DB migration.

---

### H4. Authentication Boundary Hardening

#### Problem

Current AuthGuard is suitable for tests but not for pilot.

#### Required plan

- Define authentication provider boundary without committing to a full identity provider prematurely.
- Replace `x-user-id` runtime trust with a verified principal abstraction.
- Keep test helpers able to inject users safely in test mode.
- Define clear separation between authenticated user, workspace membership, and permissions.

#### Acceptance criteria

- Production mode must not accept arbitrary `x-user-id` headers as identity.
- Test mode can still simulate users deterministically.
- All RBAC and tenant isolation tests still pass.

---

### H5. Audit Append-Only Hardening

#### Problem

Audit read workflow exists, but audit persistence remains placeholder/in-memory.

#### Required plan

- Persist audit events in PostgreSQL.
- Prevent API update/delete routes for audit logs.
- Prevent application-level mutation of historical audit rows.
- Include correlation ID, actor, workspace, entity, action, before/after snapshots, and metadata.
- Add regression tests proving audit cannot be modified through public API.

#### Acceptance criteria

- AuditLog is append-only.
- Sensitive writes create audit records.
- Audit records are workspace-scoped on read.
- No PATCH/DELETE audit route exists.

---

### H6. Safe Mode Protected-Write Policy

#### Problem

Safe Mode state exists, but the protected-write behavior is not fully approved.

#### Required decision

Define which writes are blocked, allowed, or allowed with audit when Safe Mode is active.

#### Minimum policy proposal

| Write category | Safe Mode behavior |
|---|---|
| Read endpoints | Allowed |
| Workspace/member changes | Block or require owner/admin override |
| Campaign edits | Block non-critical writes |
| MediaJob creation | Block |
| UsageMeter record | Block unless system-confirmed recovery action |
| CostEvent record | Allow only if needed for reconciliation and audited |
| ApprovalDecision | Block unless emergency override is explicitly approved |
| PublishJob creation/status update | Block |
| ManualPublishEvidence submit/invalidate/supersede | Allow evidence correction only with reason and audit |
| ClientReportSnapshot generation | Allow if read-only snapshot generation is required |
| SafeMode deactivate | Allow only operations.safe_mode |

#### Acceptance criteria

- Policy is approved in docs before implementation.
- OpenAPI/backlog/QA are patched if enforcement requires behavior changes.
- Tests prove protected writes are blocked or allowed according to policy.

---

### H7. Pilot Readiness Contract

#### Problem

Sprint 4 added pilot readiness regressions but no PilotGate API because no such endpoint is approved.

#### Required decision

Either:

1. Keep pilot readiness as QA/reporting only, with no API.
2. Add an approved PilotGate API through OpenAPI/schema/backlog/QA patches.

No implementation is allowed until this decision is made.

#### Acceptance criteria

- Pilot readiness definition is explicit.
- Required P0 gates are listed.
- Missing gates are blocking and visible.
- No endpoint is invented without OpenAPI approval.

---

## Required QA Expansion

Add or verify tests for:

- README/package/workflow status checks where practical through static verification.
- Route behavior equivalence before and after cleanup.
- PostgreSQL-backed tenant isolation.
- PostgreSQL-backed idempotency replay/conflict.
- PostgreSQL-backed immutable content hash behavior.
- Audit append-only behavior.
- Safe Mode protected-write behavior after policy approval.
- Pilot readiness gate reporting or API behavior after decision.

---

## Completion Definition

Hardening Sprint is complete only when:

```text
1. README/package/workflow metadata are aligned.
2. Behavior-equivalence cleanup plan is either completed or explicitly scheduled with tests.
3. PostgreSQL runtime persistence plan is approved and at least the first domain migration is implemented or formally queued.
4. Production AuthGuard boundary is documented and test-safe replacement path is defined.
5. Audit append-only enforcement is documented and tested or formally queued.
6. Safe Mode protected-write policy is approved.
7. Pilot readiness contract is clarified.
8. GitHub Actions strict verification passes on the PR head.
```

---

## Final Decision

```text
DO NOW: Hardening Sprint.
DO NOT DO NOW: Sprint 5 features.
```
