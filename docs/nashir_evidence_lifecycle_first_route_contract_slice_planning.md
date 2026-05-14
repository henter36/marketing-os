# Nashir Evidence Lifecycle First Route Contract Slice Planning

## Purpose

This document defines the first route-level contract slice for the Nashir Evidence Lifecycle Journey after repository-only verification and the route contract gate status.

This is documentation-only. It does not implement runtime routes, modify OpenAPI, expand RBAC, update generated clients, add UI/prototype, modify SQL/schema patches, modify tests, change package/workflow/script files, or approve approval, publishing, Sprint 5, Pilot, or Production readiness.

## Current State

The current repository state is:

- repository implementation exists for the Nashir evidence lifecycle persistence slice;
- repository flow verification exists;
- the route contract / Route Verification Gate exists;
- route contract status reconciliation exists;
- no new DB-backed evidence lifecycle route implementation is approved for this route-level contract slice;
- earlier in-memory Nashir evidence submit/list routes remain outside this DB-backed lifecycle route planning scope;
- no OpenAPI lifecycle contract is approved;
- no RBAC expansion is approved;
- no generated-client gate is approved.

## Journey Under Planning

Nashir Evidence Lifecycle Journey:

Submit evidence -> List evidence -> Review evidence -> Accept / Reject evidence -> Invalidate evidence -> Supersede evidence -> List updated lifecycle state.

## Route Candidates

Ranked safest to riskiest:

1. Option A: Read-only get evidence route contract planning.
   - Safest because read-by-id planning can focus on tenant isolation, generic 404 behavior, ErrorModel mapping, and repository usage without write-side idempotency or audit complexity.
   - It should not implement a route, OpenAPI, RBAC, generated clients, or UI.

2. Option B: List evidence route contract planning.
   - Low risk because list behavior is read-only and can verify route-derived workspace/campaign scoping.
   - It is slightly broader than read-by-id because it must define collection response shape, ordering, pagination/filter deferrals, and whether the current in-memory evidence list route remains separate from any future DB-backed lifecycle read surface.

3. Option C: Submit evidence route contract planning.
   - Higher risk because submit is a write route and must resolve idempotency, transaction behavior, request validation, audit, and write permission strategy before implementation.
   - It should follow read/list contract clarity.

4. Option D: Submit + list + get route contract bundle.
   - Riskier because it combines read and write contracts, increasing the chance of unclear scope or route-by-route shortcutting.
   - It may be useful later, but it is not the smallest first route contract slice.

5. Option E: Lifecycle review/accept/reject route planning.
   - Riskier because review outcomes introduce governance states, actor requirements, audit expectations, state transitions, and approval-separation risks.
   - It should not proceed before basic read/list/submit route contract boundaries are stable.

6. Option F: OpenAPI-first lifecycle route expansion.
   - Riskiest because it expands public API contract before route behavior, ErrorModel mapping, RBAC, audit, and generated-client boundaries are settled.
   - OpenAPI lifecycle routes require a separately approved OpenAPI contract PR.

## Recommendation

The safest first route contract slice is documentation-only read/list route contract planning before submit route implementation.

Within that slice, read-by-id should be specified first because it directly tests the highest-risk read concern: generic 404 behavior for non-existent, cross-workspace, and cross-campaign evidence. List planning should be paired with read-by-id only to keep response shape and tenant scoping consistent.

This recommendation is safer than starting with submit because:

- read/list contracts are lower risk than write routes;
- read/list contracts verify tenant isolation and generic 404 behavior;
- read/list planning avoids idempotency and write-side audit complexity initially;
- submit route planning can proceed after read/list contract clarity.

## Contract Questions For The Selected First Slice

Selected slice: documentation-only read/list route contract planning.

Route purpose:

- expose read-only evidence retrieval semantics for the Nashir Evidence Lifecycle Journey;
- preserve repository tenant scoping and generic not found behavior;
- avoid write behavior, lifecycle transitions, approval, publishing, OpenAPI expansion, RBAC expansion, generated clients, and UI.

Allowed HTTP methods:

- `GET` for list evidence;
- `GET` for read evidence by ID.

Candidate paths:

- `GET /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/evidence`
- `GET /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/evidence/{evidenceId}`

Route parameters:

- `workspaceId`, route-derived and authoritative;
- `nashirCampaignId`, route-derived and authoritative;
- `evidenceId`, route-derived and authoritative for read-by-id.

Query parameters:

- none for the first contract slice;
- pagination, status filtering, ordering, and lifecycle-event expansion remain deferred unless separately gated.

Request body rules:

- no request body is accepted or required for read/list routes;
- workspace, campaign, and evidence identifiers from request bodies must not be trusted.

Candidate response shape:

- list: `{ "data": [NashirEvidence] }`
- read-by-id: `{ "data": NashirEvidence }`

Candidate `NashirEvidence` fields should follow repository canonical camelCase output:

- `id`
- `workspaceId`
- `nashirCampaignId`
- `evidenceType`
- `channel`
- `status`
- `submittedByUserId`
- `submittedAt`
- `publishedAt`
- `url`
- `notes`
- `externalReference`
- `createdAt`
- `updatedAt`

Status codes:

- `200` for successful list/read;
- `401` for unauthenticated requests under existing auth behavior;
- `403` for an active member lacking the approved read permission, if permission enforcement is approved later;
- `404` for missing membership, unknown workspace, unknown campaign, non-existent evidence, cross-workspace evidence, or cross-campaign evidence;
- safe `5xx` ErrorModel behavior for unexpected repository failures.

ErrorModel mapping:

- exact ErrorModel fields remain subject to the future route contract PR;
- read-by-id must map non-existent, cross-workspace, and cross-campaign repository `null` results to the same generic `404 Not Found`;
- implementation must not leak database details or tenant existence.

Generic 404 behavior:

- non-existent evidence returns generic `404 Not Found`;
- cross-workspace evidence returns generic `404 Not Found`;
- cross-campaign evidence returns generic `404 Not Found`;
- missing membership and unknown workspace/campaign must preserve existing non-disclosing behavior.

Tenant isolation behavior:

- all reads must use route-derived `workspaceId` and `nashirCampaignId`;
- read-by-id must use route-derived `evidenceId`;
- list route must return only evidence scoped to the route-derived workspace and campaign;
- no route may bypass repository tenant scoping.

Audit requirements:

- read/list routes should not emit audit events unless a later gate explicitly requires read audit;
- if new audit naming is required, it must follow entity/domain plus dotted action and be handled through a separate audit naming reconciliation gate.

RBAC permission code candidates:

- `nashir.campaign.read` is the conservative candidate for read/list if existing campaign-read semantics remain sufficient;
- a dedicated future read permission, such as `nashir.evidence.read`, requires a separate RBAC gate before enforcement changes.

Repository methods allowed:

- `NashirEvidenceLifecycleRepository.listByCampaign`;
- `NashirEvidenceLifecycleRepository.getById`.

Repository methods not allowed in this read/list slice:

- `createSubmittedEvidence`;
- any future accept/reject/invalidate/supersede methods.

Non-scope:

- submit evidence route implementation;
- lifecycle review, accept, reject, invalidate, or supersede route planning beyond future references;
- OpenAPI lifecycle routes;
- RBAC expansion;
- generated clients;
- UI/prototype;
- approval;
- publishing;
- Sprint 5, Pilot, or Production readiness.

Verification expectations:

- future route tests must cover route-derived workspace/campaign/evidence usage;
- read-by-id tests must prove generic `404 Not Found` for non-existent, cross-workspace, and cross-campaign evidence;
- list tests must prove only route-scoped evidence is returned;
- tests must prove route behavior uses approved repository methods and does not bypass repository tenant scoping;
- route-level Journey Flow Verification and Status Reconciliation must follow any future implementation.

## Generic 404 Requirement

For read-by-id routes, all of the following must return generic `404 Not Found` and must not disclose resource existence:

- non-existent resources;
- cross-workspace resources;
- cross-campaign resources.

The route must not reveal whether an `evidenceId` exists outside the authorized route-derived `workspaceId` and `nashirCampaignId` context.

## Audit Requirement

Audit event naming must follow entity/domain plus dotted action.

Read/list routes should remain non-mutating and no-audit unless a later approved gate explicitly requires audit events for read access.

If new audit naming is required, it must be handled through a separate audit naming reconciliation gate.

## RBAC Requirement

RBAC permission codes must be approved before enforcement changes.

This PR does not introduce RBAC permission codes, change role mappings, or enforce RBAC changes.

## OpenAPI Requirement

OpenAPI lifecycle routes must not be added here.

OpenAPI changes require a separately approved OpenAPI contract PR before any generated-client or public-contract work is considered.

## Generated Client Requirement

Generated clients must not change unless an OpenAPI contract and generated-client gate approve that work.

This planning document does not approve generated-client updates.

## Acceptance Criteria For A Future Implementation PR

Any future implementation PR for the selected read/list route contract slice must satisfy:

- implementation uses approved repository methods only;
- no tenant-scope bypass exists;
- read-by-id generic `404 Not Found` behavior is preserved;
- list route returns only workspace/campaign-scoped evidence;
- ErrorModel mapping is implemented exactly as approved;
- audit events are implemented only if approved;
- RBAC enforcement happens only if approved;
- tests cover route behavior, tenant isolation, and generic 404 behavior;
- no OpenAPI or generated-client changes occur unless separately approved.

## Required Future Verification

Any future implementation must be followed by:

- route-level Journey Flow Verification;
- Status Reconciliation.

Route-level Journey Flow Verification must prove that the implemented read/list route behavior advances the Nashir Evidence Lifecycle Journey without expanding into submit, lifecycle transitions, OpenAPI, RBAC, generated clients, UI/prototype, approval, publishing, Sprint 5, Pilot, or Production unless separately approved.

## GO / NO-GO

GO:

- documentation-only first route contract slice planning;
- selecting read/list contract planning as the first route-level contract slice.

NO-GO:

- runtime route implementation;
- OpenAPI lifecycle implementation;
- RBAC expansion;
- generated-client changes;
- UI/prototype;
- approval or publishing;
- Sprint 5, Pilot, or Production readiness claims.
