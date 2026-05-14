# Nashir Evidence Lifecycle Route Contract Verification Gate

## Purpose

This document defines the route contract and route verification gate for the Nashir Evidence Lifecycle Journey after repository-only flow verification.

This is documentation-only. It does not implement runtime routes, modify tests, change SQL/schema patches, change OpenAPI, expand RBAC, update generated clients, add UI/prototype, or approve approval, publishing, Sprint 5, Pilot, or Production readiness.

## Current Verified State

Repository-only verification is complete after PR #226.

Status was reconciled in PR #227.

The verified repository state includes:

- `NashirEvidenceLifecycleRepository`;
- repository-only submitted evidence creation;
- submitted lifecycle event creation inside the same transaction;
- repository list/read behavior;
- canonical camelCase repository output;
- generic not found behavior for non-existent, cross-workspace, and cross-campaign reads;
- fail-closed missing transaction behavior;
- safe missing inserted-row error behavior;
- workspace context passed into transaction queries;
- submitted lifecycle event traceability.

No lifecycle route is implemented or approved by this state.

## Journey Under Consideration

Nashir Evidence Lifecycle Journey:

Submit evidence -> List evidence -> Review evidence -> Accept / Reject evidence -> Invalidate evidence -> Supersede evidence -> List updated lifecycle state.

## What This Gate Does NOT Approve

This gate does not approve:

- route implementation;
- OpenAPI lifecycle routes;
- RBAC expansion;
- generated clients;
- UI/prototype;
- approval;
- publishing;
- Sprint 5;
- Pilot;
- Production;
- isolated route-by-route implementation outside the Journey model.

## Route Contract Questions To Resolve Before Implementation

Before any route implementation PR, the project must resolve:

- Which route should be first?
- Should the first route be submit-only, list-only, or read-only?
- Which current route exists, if any, and what behavior remains in-memory vs DB-backed?
- What exact request shapes are allowed?
- What exact response shapes are allowed?
- What ErrorModel mappings are required?
- What audit events are required?
- What idempotency behavior is required?
- What RBAC permission codes are required?
- What tenant isolation behavior must be preserved?
- What repository methods may be used?
- What runtime wiring is explicitly allowed?
- What OpenAPI work is explicitly allowed or deferred?
- What generated-client work remains forbidden?
- What approval, publishing, Sprint 5, Pilot, and Production claims remain out of scope?

## Candidate Route-Level Options

Ranked safest to riskiest:

1. Option A: Route contract verification only, no runtime change.
   - Safest because it verifies route contracts and denial expectations without route registration, OpenAPI changes, RBAC changes, generated clients, or runtime behavior.
   - Best fit for the next documentation-only step.

2. Option B: Submit/list/get route contract gate only.
   - Still documentation-only, but broader than contract verification because it may define multiple future routes and must settle request/response, ErrorModel, audit, idempotency, and permission strategy.
   - Safer than implementation because runtime remains untouched.

3. Option C: Implement one DB-backed read-only route.
   - Narrow runtime scope, but it would cross from repository-only verification into HTTP behavior and requires explicit route, authorization, ErrorModel, tenant isolation, and possibly OpenAPI decisions.
   - Not approved by this gate.

4. Option D: Implement DB-backed submit/list/get route group.
   - Higher risk because it bundles multiple route behaviors, write semantics, audit expectations, transaction behavior, tenant isolation, and response contracts.
   - Not approved by this gate.

5. Option E: OpenAPI-first lifecycle route expansion.
   - Riskiest next step because it may imply public API contract expansion before route behavior, RBAC, audit, and ErrorModel choices are fully settled.
   - Not approved by this gate.

## Recommended Next Step

The recommended next step is a documentation-only route contract verification gate or route contract planning document before any implementation.

Do not proceed directly to route implementation.

The next gate should decide whether the project verifies route contracts first or defines a fuller submit/list/get route contract before implementation can be considered.

## Required Acceptance Criteria For Any Future Route Implementation PR

Any future route implementation PR must satisfy these acceptance criteria:

- repository-only verification remains the source of truth for repository behavior;
- no route may bypass repository tenant scoping;
- non-existent, cross-workspace, and cross-campaign reads must not disclose resource existence;
- route errors must use the approved ErrorModel;
- audit requirements must be specified before implementation;
- RBAC permission codes must be approved before enforcement changes;
- OpenAPI must be updated only in a separately approved contract PR;
- generated clients must not change unless an OpenAPI contract and generated-client gate approve it;
- route-derived workspace and campaign context must be authoritative;
- direct request-body workspace or campaign overrides must not be trusted;
- approval, publishing, Sprint 5, Pilot, and Production scope must remain excluded;
- implementation must remain inside a Journey Slice, not an isolated route-by-route shortcut;
- post-implementation Status Reconciliation must be required.

## Required Future Verification

Any future route implementation must be followed by:

- route-level Journey Flow Verification;
- Status Reconciliation.

Route-level Journey Flow Verification must prove the implemented route behavior advances the Nashir Evidence Lifecycle Journey without expanding into OpenAPI, RBAC, generated clients, UI/prototype, approval, publishing, Sprint 5, Pilot, or Production unless separately approved.

## Decision

GO:

- documentation-only route contract / Route Verification Gate.

NO-GO:

- immediate route implementation;
- OpenAPI lifecycle implementation;
- RBAC expansion;
- UI/prototype changes;
- generated client changes;
- approval or publishing work;
- Sprint 5, Pilot, or Production readiness claims.
