# Nashir Evidence Lifecycle Read/List Route Contract

## Purpose

This document defines the read/list route contract for the Nashir Evidence Lifecycle Journey before implementation.

This is documentation-only. It does not implement runtime routes, modify OpenAPI, expand RBAC, update generated clients, add UI/prototype, modify SQL/schema patches, modify tests, change package/workflow/script files, or approve approval, publishing, Sprint 5, Pilot, or Production readiness.

## Current State

The current repository state is:

- repository implementation exists;
- repository-only flow verification exists;
- the route contract gate exists;
- first route contract slice planning exists;
- no route implementation is approved;
- no OpenAPI lifecycle contract is approved;
- no RBAC expansion is approved;
- no generated-client gate is approved.

## Journey Scope

Nashir Evidence Lifecycle Journey:

Submit evidence -> List evidence -> Review evidence -> Accept / Reject evidence -> Invalidate evidence -> Supersede evidence -> List updated lifecycle state.

This PR only specifies read/list contract planning and does not implement any route.

## Candidate Routes

The candidate read/list routes are:

- list campaign evidence;
- get evidence by ID.

These candidate routes are contract specifications only. They are not implemented by this document.

## List Campaign Evidence Route Contract

Purpose:

- return evidence records scoped to a route-derived workspace and Nashir campaign;
- support read-only Journey visibility after evidence submission exists;
- avoid lifecycle transitions, write semantics, approval, publishing, OpenAPI expansion, RBAC expansion, generated clients, and UI.

Method:

- `GET`

Candidate path:

- `GET /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/evidence`

Path params:

- `workspaceId`, route-derived and authoritative;
- `nashirCampaignId`, route-derived and authoritative.

Query params:

- none for the first contract;
- pagination, ordering, status filtering, and lifecycle-event expansion remain deferred unless separately gated.

Request body rule:

- no request body is accepted or required;
- request body `workspaceId`, `nashirCampaignId`, or tenant-scope overrides must not be trusted.

Response shape:

```json
{
  "data": [
    {
      "id": "...",
      "workspaceId": "...",
      "nashirCampaignId": "...",
      "evidenceType": "...",
      "channel": "...",
      "status": "submitted",
      "submittedByUserId": "...",
      "submittedAt": "...",
      "publishedAt": "...",
      "url": "...",
      "notes": "...",
      "externalReference": "...",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

Status codes:

- `200` for successful list, including an empty `data` array;
- `401` for unauthenticated requests under existing auth behavior;
- `403` for an active member lacking the approved read permission, if permission enforcement is approved later;
- `404` for missing membership, unknown workspace, or unknown campaign under existing non-disclosing behavior;
- safe `5xx` ErrorModel behavior for unexpected repository failures.

ErrorModel mapping:

- exact ErrorModel fields remain subject to the future implementation gate;
- validation errors should remain minimal because no body or query parameters are approved in this contract;
- unexpected repository failures must not leak database details.

Generic 404 behavior:

- list route must preserve non-disclosing behavior for missing membership, unknown workspace, and unknown campaign;
- list route must not reveal evidence from other workspaces or campaigns.

Tenant isolation behavior:

- list route must derive `workspaceId` and `nashirCampaignId` from trusted route/context only;
- list route must call the approved repository with both `workspaceId` and `nashirCampaignId`;
- list route must return only evidence scoped to the route-derived workspace and campaign.

Audit expectations:

- list reads should not emit audit events unless a later gate explicitly requires read audit;
- if audit is introduced later, naming must follow entity/domain plus dotted action.

RBAC permission candidates:

- `nashir.campaign.read` is the conservative candidate if existing campaign-read semantics remain sufficient;
- a future dedicated permission such as `nashir.evidence.read` requires a separate RBAC gate before enforcement changes.

Repository method allowed:

- `NashirEvidenceLifecycleRepository.listByCampaign`.

Non-scope:

- submit evidence;
- get-by-id implementation;
- lifecycle review, accept, reject, invalidate, or supersede actions;
- OpenAPI lifecycle routes;
- RBAC expansion;
- generated clients;
- UI/prototype;
- approval, publishing, Sprint 5, Pilot, or Production.

Verification expectations:

- future route tests must prove only route-derived workspace/campaign evidence is returned;
- future route tests must prove empty scoped results return `200` with `{ "data": [] }`;
- future route tests must prove no request body scope override is trusted;
- route-level Journey Flow Verification and Status Reconciliation must follow implementation.

## Get Evidence By ID Route Contract

Purpose:

- return a single evidence record scoped to route-derived workspace, campaign, and evidence ID;
- verify generic 404 behavior for non-existent, cross-workspace, and cross-campaign evidence;
- avoid lifecycle transitions, write semantics, approval, publishing, OpenAPI expansion, RBAC expansion, generated clients, and UI.

Method:

- `GET`

Candidate path:

- `GET /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/evidence/{evidenceId}`

Path params:

- `workspaceId`, route-derived and authoritative;
- `nashirCampaignId`, route-derived and authoritative;
- `evidenceId`, route-derived and authoritative.

Query params:

- none for the first contract;
- lifecycle-event expansion remains deferred unless separately gated.

Request body rule:

- no request body is accepted or required;
- request body `workspaceId`, `nashirCampaignId`, `evidenceId`, or tenant-scope overrides must not be trusted.

Response shape:

```json
{
  "data": {
    "id": "...",
    "workspaceId": "...",
    "nashirCampaignId": "...",
    "evidenceType": "...",
    "channel": "...",
    "status": "submitted",
    "submittedByUserId": "...",
    "submittedAt": "...",
    "publishedAt": "...",
    "url": "...",
    "notes": "...",
    "externalReference": "...",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

Status codes:

- `200` for successful read;
- `401` for unauthenticated requests under existing auth behavior;
- `403` for an active member lacking the approved read permission, if permission enforcement is approved later;
- `404` for missing membership, unknown workspace, unknown campaign, non-existent evidence, cross-workspace evidence, or cross-campaign evidence;
- safe `5xx` ErrorModel behavior for unexpected repository failures.

ErrorModel mapping:

- non-existent evidence, cross-workspace evidence, and cross-campaign evidence must map to the same generic `404 Not Found`;
- missing membership, unknown workspace, and unknown campaign must preserve existing non-disclosing `404` behavior;
- unexpected repository failures must not leak database details.

Generic 404 behavior:

- non-existent evidence returns generic `404 Not Found`;
- cross-workspace evidence returns generic `404 Not Found`;
- cross-campaign evidence returns generic `404 Not Found`;
- the route must not reveal whether an `evidenceId` exists outside the authorized route-derived workspace/campaign context.

Tenant isolation behavior:

- get route must derive `workspaceId`, `nashirCampaignId`, and `evidenceId` from trusted route/context only;
- get route must call the approved repository with all three identifiers;
- get route must not bypass repository tenant scoping.

Audit expectations:

- read-by-id should not emit audit events unless a later gate explicitly requires read audit;
- if audit is introduced later, naming must follow entity/domain plus dotted action.

RBAC permission candidates:

- `nashir.campaign.read` is the conservative candidate if existing campaign-read semantics remain sufficient;
- a future dedicated permission such as `nashir.evidence.read` requires a separate RBAC gate before enforcement changes.

Repository method allowed:

- `NashirEvidenceLifecycleRepository.getById`.

Non-scope:

- submit evidence;
- lifecycle review, accept, reject, invalidate, or supersede actions;
- OpenAPI lifecycle routes;
- RBAC expansion;
- generated clients;
- UI/prototype;
- approval, publishing, Sprint 5, Pilot, or Production.

Verification expectations:

- future route tests must prove successful route-derived read behavior;
- future route tests must prove generic `404 Not Found` for non-existent, cross-workspace, and cross-campaign evidence;
- future route tests must prove no request body scope override is trusted;
- route-level Journey Flow Verification and Status Reconciliation must follow implementation.

## Generic 404 Requirement

For read-by-id routes, all of the following must return generic `404 Not Found` and must not disclose resource existence:

- non-existent resource;
- cross-workspace resource;
- cross-campaign resource.

The route must not reveal whether an `evidenceId` exists outside the authorized route-derived `workspaceId` and `nashirCampaignId` context.

## List Route Tenant Isolation

The list route must only return evidence scoped to `workspaceId` and `nashirCampaignId` derived from trusted route/context.

Request body overrides, query-string scope overrides, or client-provided workspace/campaign values outside the route/context must not be trusted.

## ErrorModel Mapping

Future implementation must map errors to approved ErrorModel categories without changing runtime code in this PR:

- unauthenticated requests use existing `401` auth behavior;
- missing membership, unknown workspace, and unknown campaign use existing non-disclosing `404` behavior;
- get-by-id non-existent, cross-workspace, and cross-campaign evidence use generic `404 Not Found`;
- active members lacking the approved read permission use `403` only if permission enforcement is separately approved;
- invalid unsupported request body or query input, if introduced later, must use the approved validation category;
- unexpected repository failures must use safe server error behavior and must not leak SQL or tenant details.

## Audit Requirement

Audit event naming must follow entity/domain plus dotted action.

Read/list routes should remain non-mutating and no-audit unless a later approved gate explicitly requires read audit.

If new audit naming is required, it must be handled through a separate audit naming reconciliation gate.

## RBAC Requirement

RBAC permission codes are candidates only.

No enforcement changes are approved in this PR.

The conservative candidate for read/list is `nashir.campaign.read`. A dedicated evidence read permission requires a separate RBAC gate.

## OpenAPI Requirement

OpenAPI lifecycle routes must not be added here.

OpenAPI changes require a separately approved OpenAPI contract PR.

## Generated Client Requirement

Generated clients must not change unless an OpenAPI contract and generated-client gate approve it.

This contract does not approve generated-client updates.

## Acceptance Criteria For Future Implementation PR

Any future implementation PR for this read/list contract must satisfy:

- implementation uses approved repository methods only;
- no tenant-scope bypass exists;
- get route preserves generic 404 behavior;
- list route returns only workspace/campaign-scoped evidence;
- ErrorModel mapping follows this contract;
- audit events are implemented only if approved;
- RBAC enforcement happens only if approved;
- no OpenAPI or generated-client changes occur unless separately approved;
- tests cover route behavior;
- route-level Journey Flow Verification follows implementation;
- Status Reconciliation follows verification.

## GO / NO-GO

GO:

- documentation-only read/list route contract specification.

NO-GO:

- runtime route implementation;
- OpenAPI lifecycle implementation;
- RBAC expansion;
- generated-client changes;
- UI/prototype;
- approval;
- publishing;
- Sprint 5;
- Pilot;
- Production;
- isolated route-by-route implementation outside the Journey model.
