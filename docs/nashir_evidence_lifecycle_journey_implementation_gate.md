# Nashir Evidence Lifecycle Journey Implementation Gate

## Purpose

This document defines the Journey Gate for the next Nashir Evidence Lifecycle work.

This PR is documentation-only. It does not implement runtime behavior, SQL changes, OpenAPI YAML, RBAC, tests, generated clients, UI, package/workflow changes, migrations, approval, publishing, Sprint 5, Pilot, or Production readiness.

The project delivery model is:

Journey Gate -> Journey Slice Implementation -> Journey Flow Verification -> Status Reconciliation.

## Journey

The next implementation work serves the Nashir Evidence Lifecycle Journey.

Journey flow:

1. Submit evidence
2. List evidence
3. Review evidence
4. Accept evidence
5. Reject evidence
6. Invalidate evidence
7. Supersede evidence
8. List updated lifecycle state

## Current Journey Step

The current step is pre-implementation Journey gating after Patch 003.

Submit evidence and list evidence exist in the current in-memory Internal MVP flow. Patch 003 exists as schema documentation only for future DB-backed evidence lifecycle persistence. Review, accept, reject, invalidate, supersede, and listing updated lifecycle state from DB-backed lifecycle records are not implemented.

## Repository State Before Implementation

- Patch 003 exists and is ordered after Patch 002 in schema documentation.
- Patch 003 defines `nashir_evidence`, `nashir_evidence_lifecycle_events`, `nashir_evidence_status`, and `nashir_evidence_lifecycle_event_type`.
- `updated_at` is application-managed in Patch 003; no trigger was introduced.
- Current Nashir evidence submit/list runtime remains in-memory.
- No DB-backed Nashir evidence lifecycle repository usage is approved.
- No lifecycle review route is approved.
- No OpenAPI lifecycle routes are approved.
- No RBAC expansion is approved.
- No generated clients changed.
- No UI changed.
- Approval, publishing, Sprint 5, Pilot, and Production remain NO-GO.

## Allowed State After First Journey Slice

After the first approved Journey Slice, the repository may contain the smallest safe DB-backed persistence read/write plumbing needed to make progress toward the Nashir Evidence Lifecycle Journey.

The first Journey Slice must not expose new lifecycle routes, OpenAPI lifecycle paths, RBAC permissions, generated clients, UI, approval, or publishing. It must not claim Pilot or Production readiness.

Allowed post-slice state, if separately approved:

- Repository-level DB-backed read/write plumbing for Nashir evidence and lifecycle event records.
- Tests proving repository persistence boundaries, tenant scoping, status/event writes, and lifecycle state reads.
- No HTTP route registration for lifecycle actions unless separately gated.
- No OpenAPI lifecycle expansion unless separately approved.
- No generated clients.
- A post-implementation Status Reconciliation document.

## Journey Slice Options

Ranked from safest to riskiest:

1. Option C: persistence read/write plumbing.
   Safest first Journey Slice because it exercises Patch 003 behind repository boundaries without exposing new lifecycle routes or public API behavior. It can prove tenant-scoped persistence, status/event writes, replacement linkage handling, and application-managed `updated_at` behavior while keeping OpenAPI, RBAC, generated clients, approval, publishing, UI, Pilot, and Production NO-GO.

2. Option A: DB-backed repository layer only.
   Safe if strictly limited to repository methods and tests, but slightly less complete than Option C if it does not include enough write/read plumbing to prove lifecycle progression in the Journey.

3. Option D: flow verification.
   Useful after persistence plumbing exists, but premature as the first slice because the DB-backed lifecycle flow cannot be meaningfully verified before repository read/write behavior exists.

4. Option B: lifecycle review route.
   Riskiest first slice because it exposes route behavior before DB-backed persistence boundaries, lifecycle state rules, OpenAPI/RBAC choices, and verification expectations are proven.

## Recommendation

Recommend Option C as the first implementation slice: DB-backed persistence read/write plumbing behind the existing evidence lifecycle model.

This is the smallest safe Journey Slice because it advances the Nashir Evidence Lifecycle Journey without creating a route-by-route shortcut. It establishes the persistence foundation required before review, acceptance, rejection, invalidation, supersession, and updated lifecycle listing can be safely exposed.

## Scope For Future Implementation PR

A future Journey Slice Implementation PR may include, only if explicitly approved:

- Repository boundaries for DB-backed `nashir_evidence` and `nashir_evidence_lifecycle_events`.
- Read/write plumbing for evidence records and lifecycle events.
- Tenant-scoped repository queries using route-derived workspace/campaign context supplied by future callers.
- Application-managed `updated_at` behavior for evidence updates.
- Tests for repository read/write behavior, tenant isolation, lifecycle status/event writes, invalidation/rejection reason requirements, supersession replacement linkage, and generic not found behavior for non-existent IDs and cross-tenant or cross-campaign IDs.
- Implementation report documenting the Journey Slice.
- Status Reconciliation after implementation.

## Non-Scope

This gate does not approve:

- lifecycle review route implementation
- accept/reject/invalidate/supersede HTTP routes
- OpenAPI lifecycle routes
- RBAC expansion
- generated clients
- UI
- approval
- publishing
- Sprint 5
- Pilot
- Production

## Allowed Future Files For Eventual Implementation PR

Candidate future files for the Journey Slice Implementation PR only:

- `src/repositories/nashir-evidence-repository.js` or the locally appropriate repository module
- `src/repositories/index.js` if repository export wiring is required
- `test/integration/nashir-evidence-lifecycle-repository.integration.test.js` or locally appropriate repository tests
- `docs/nashir_evidence_lifecycle_journey_slice_implementation_report.md`
- `docs/03_decision_log.md`
- `docs/17_change_log.md`
- `docs/nashir_status_after_evidence_lifecycle_journey_slice.md`

These files are candidate future files only. This document does not authorize edits to them.

## Forbidden Future Files Unless Separately Gated

- `src/router.js`
- `src/rbac.js`
- OpenAPI YAML files
- generated clients
- UI/prototype files
- package files
- workflow files
- migration runner scripts
- approval route/runtime files
- publishing route/runtime files

## Required Verification Commands

A future implementation PR must run or document:

- `git diff --name-only`
- `git diff --check`
- focused repository tests for the Nashir Evidence Lifecycle Journey Slice
- tenant isolation tests
- generic not found repository read tests for non-existent IDs and cross-tenant or cross-campaign IDs
- lifecycle state/event persistence tests
- `npm run db:migrate:strict`
- `npm run verify:strict`
- `git status --short`

If any command is not applicable or cannot run because of environment requirements, the PR must report the exact output and explain the limitation.

## Required Acceptance Criteria

- Repository persistence can create/read `nashir_evidence` records scoped by workspace and Nashir campaign.
- Repository persistence can create/read `nashir_evidence_lifecycle_events` records scoped by workspace, Nashir campaign, and evidence.
- Repository reads do not disclose cross-workspace or cross-campaign evidence by returning a generic not found result for both non-existent IDs and cross-tenant or cross-campaign IDs.
- Submitted, accepted, rejected, invalidated, and superseded status/event candidates are handled according to Patch 003 constraints.
- Rejection and invalidation require `reason_code` where persisted.
- Supersession requires replacement evidence linkage where persisted.
- `updated_at` is explicitly application-managed on evidence updates.
- No lifecycle HTTP routes are registered.
- No OpenAPI lifecycle routes are added.
- No RBAC permissions are added.
- No generated clients are changed.
- No UI is changed.
- Approval, publishing, Sprint 5, Pilot, and Production remain NO-GO.

## Required Post-Implementation Status Reconciliation

After any Journey Slice Implementation PR, create a Status Reconciliation document that records:

- implemented Journey Slice
- files changed
- verification results
- remaining Journey steps
- remaining NO-GO boundaries
- whether Flow Verification is ready or still blocked

The Status Reconciliation must not expand scope.

## Explicit NO-GO List

The following remain NO-GO:

- isolated route implementation outside the Journey Gate -> Journey Slice Implementation -> Journey Flow Verification -> Status Reconciliation model
- lifecycle review route implementation
- accept/reject/invalidate/supersede route implementation
- OpenAPI lifecycle routes
- RBAC expansion
- generated clients
- UI
- approval
- publishing
- Sprint 5
- Pilot
- Production

## GO / NO-GO Recommendation

GO for documentation-only Journey Gate.

NO-GO for implementation in this PR.
