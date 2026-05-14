# Nashir Evidence Lifecycle Read/List OpenAPI Contract Gate

## Purpose

This document defines the documentation-only OpenAPI Contract Gate for Nashir Evidence Lifecycle read/list routes before any OpenAPI YAML patch or runtime implementation.

This is documentation-only. It does not modify OpenAPI YAML/spec files, implement runtime routes, expand RBAC, update generated clients, add UI/prototype, modify SQL/schema patches, modify tests, change package/workflow/script files, or approve approval, publishing, Sprint 5, Pilot, Production, or isolated route-by-route implementation.

## Current State

The current state is:

- PR #232 defined the read/list route contract specification;
- PR #233 reconciled status after the read/list route contract;
- no OpenAPI lifecycle routes are approved;
- no runtime route implementation is approved;
- no RBAC expansion is approved;
- no generated-client gate is approved.

## Scope

This PR only defines OpenAPI contract planning for:

- list campaign evidence;
- get evidence by ID.

This PR does not edit OpenAPI YAML.

## Candidate OpenAPI Paths

Candidate paths consistent with the read/list route contract:

- `GET /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/evidence`
- `GET /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/evidence/{evidenceId}`

These paths are planning candidates only. They are not implemented by this document.

## Candidate operationIds

Candidate operationIds:

- `listNashirCampaignEvidenceLifecycleEvidence`
- `getNashirCampaignEvidenceLifecycleEvidence`

Shorter operationIds may be preferable in a future OpenAPI patch if uniqueness is preserved:

- `listNashirCampaignEvidence`
- `getNashirCampaignEvidence`

The shorter names are easier to read and align with a resource-oriented OpenAPI surface. The future OpenAPI patch PR must confirm they do not conflict with existing operations before use.

## Parameters

Candidate OpenAPI parameters:

- `workspaceId`: path parameter, required;
- `nashirCampaignId`: path parameter, required;
- `evidenceId`: path parameter, required for get-by-id only.

No list-route query parameters are approved by this gate. Pagination, ordering, status filtering, and lifecycle-event expansion remain deferred unless separately gated.

Request body is forbidden for both `GET` routes.

## Response Schema Planning

Candidate response envelopes:

- list route returns `{ "data": [...] }`;
- get route returns `{ "data": {...} }`.

Planning-level `NashirEvidence` fields should remain limited to fields already present in the repository and read/list route contract:

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

No new product fields are approved by this gate.

## Status Codes

Candidate status codes:

- `200` success;
- `400` validation error if route or query parameters are invalid;
- `401` unauthenticated;
- `403` permission denied where applicable;
- `404` generic not found for get-by-id and non-disclosing tenant/campaign boundaries;
- `500` internal error.

## Generic 404 Requirement

For get-by-id, all of the following must map to generic `404 Not Found` without resource-existence disclosure:

- non-existent evidence;
- cross-workspace evidence;
- cross-campaign evidence.

The contract must not disclose whether an `evidenceId` exists outside the route-derived `workspaceId` and `nashirCampaignId` context.

## Tenant Isolation

The OpenAPI contract must express route-derived `workspaceId` and `nashirCampaignId` as trusted scope.

Request body overrides are forbidden.

The get-by-id route must also treat route-derived `evidenceId` as authoritative.

## ErrorModel Mapping

Future OpenAPI YAML must reference approved ErrorModel responses without changing runtime code in this PR.

Planning-level requirements:

- invalid route or query parameters map to the approved validation ErrorModel category;
- unauthenticated requests map to existing `401` auth behavior;
- active members without the approved read permission map to `403` only if permission enforcement is separately approved;
- missing membership, unknown workspace, and unknown campaign preserve existing non-disclosing `404` behavior;
- non-existent, cross-workspace, and cross-campaign evidence map to generic `404 Not Found`;
- unexpected failures map to safe internal error behavior without leaking SQL or tenant details.

## RBAC Candidate

RBAC permission codes are candidates only.

No RBAC enforcement is approved by this PR.

The conservative candidate from the read/list contract is:

- `nashir.campaign.read`

A dedicated permission such as `nashir.evidence.read` requires a separate RBAC gate before enforcement changes.

Do not add seed data or permission tables in this PR.

## Audit Expectation

Read/list audit requirements remain planning-only.

Read/list routes should remain non-mutating and no-audit unless a later approved gate explicitly requires audit for read operations.

If OpenAPI must describe audit behavior later, it must not create runtime/audit implementation obligations without a separate audit naming reconciliation gate.

Audit naming must follow entity/domain plus dotted action if introduced by a later approved gate.

## Generated Client Impact

Generated clients must not change in this PR.

Any future OpenAPI YAML patch that changes generated-client output requires a separate generated-client gate or an explicit generated-client NO-GO decision.

## Future OpenAPI Patch Acceptance Criteria

A future OpenAPI patch PR may be considered only if:

- it modifies only the approved OpenAPI patch/spec files and allowed docs;
- it uses approved paths and operationIds;
- it preserves generic 404 behavior;
- it uses approved ErrorModel references;
- it does not modify runtime routes;
- it does not modify RBAC enforcement;
- it does not generate clients unless separately approved;
- it has verification commands.

## Future Runtime Implementation Dependency

Runtime implementation must not proceed until:

- OpenAPI contract gate is reconciled;
- an implementation gate explicitly authorizes exact files and behavior;
- route-level Journey Flow Verification is defined;
- Status Reconciliation is required after verification.

## GO / NO-GO

GO:

- documentation-only OpenAPI Contract Gate for Nashir Evidence Lifecycle read/list routes.

NO-GO:

- OpenAPI YAML/spec modification;
- runtime route implementation;
- RBAC expansion;
- generated-client changes;
- UI/prototype;
- SQL/schema changes;
- tests;
- package/workflow/script/migration changes;
- approval;
- publishing;
- Sprint 5;
- Pilot;
- Production;
- isolated route-by-route implementation outside the Journey model.
