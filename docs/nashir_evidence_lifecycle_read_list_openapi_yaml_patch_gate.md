# Nashir Evidence Lifecycle Read/List OpenAPI YAML Patch Gate

## Purpose

This document defines the documentation-only gate for a future OpenAPI YAML patch for Nashir Evidence Lifecycle read/list routes.

This is documentation-only. It does not modify OpenAPI YAML/spec files, implement runtime routes, expand RBAC, update generated clients, add UI/prototype, modify SQL/schema patches, modify tests, change package/workflow/script/migration files, or approve Sprint 5, Pilot, Production, publishing, approval, or isolated route-by-route implementation.

## Current State

The current state is:

- PR #234 defined the Read/List OpenAPI Contract Gate;
- PR #235 reconciled status after that gate;
- no OpenAPI YAML modification is approved yet;
- no runtime implementation is approved;
- no generated-client change is approved;
- no RBAC expansion is approved.

## Scope of This Gate

This PR only defines conditions for a future OpenAPI YAML patch.

It does not modify OpenAPI YAML.

## Candidate OpenAPI YAML Target

Candidate future target files, without modifying them:

- `docs/nashir_openapi_patch.yaml`, if that remains the approved Nashir OpenAPI patch surface;
- `docs/marketing_os_v5_6_5_phase_0_1_openapi.yaml`, only if separately approved as the canonical target.

The future patch PR must confirm the correct authoritative OpenAPI target before editing.

## Candidate Paths

Candidate paths:

- `GET /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/evidence`
- `GET /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/evidence/{evidenceId}`

These paths are planning candidates only and are not implemented by this document.

## Candidate operationIds

Approved concise candidate operationIds:

- `listNashirCampaignEvidence`
- `getNashirCampaignEvidence`

The future OpenAPI YAML patch must confirm no operationId collision before use.

## Candidate Schemas

Planning-only schema requirements:

- list response envelope: `{ "data": [...] }`;
- get response envelope: `{ "data": {...} }`;
- `NashirEvidence` fields limited to already approved repository and read/list contract fields;
- no new product fields.

Approved planning-level `NashirEvidence` fields remain:

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

## ErrorModel and Status Code Requirements

Candidate status codes:

- `200` success;
- `400` validation error;
- `401` unauthenticated;
- `403` permission denied where applicable;
- `404` generic not found;
- `500` internal error.

The future OpenAPI YAML patch must use approved ErrorModel references only.

## Generic 404 Requirement

For get-by-id, all of the following must use generic `404 Not Found` without resource-existence disclosure:

- non-existent evidence;
- cross-workspace evidence;
- cross-campaign evidence.

The OpenAPI YAML patch must not imply different observable behavior for those cases.

## Tenant Isolation Requirement

Route-derived `workspaceId` and `nashirCampaignId` are trusted scope.

Request body overrides are forbidden.

GET request bodies are forbidden.

The get-by-id route must also use route-derived `evidenceId`.

## RBAC Requirement

RBAC permission remains candidate-only.

Prefer existing `nashir.campaign.read` unless a separate RBAC gate approves a dedicated evidence permission.

No RBAC enforcement or seed change is approved.

## Generated Client Requirement

Generated clients must not change in the future OpenAPI YAML patch unless separately approved.

The future OpenAPI YAML patch must either:

- explicitly keep generated clients NO-GO; or
- be preceded or followed by a generated-client gate.

## Verification Expectations for Future OpenAPI YAML Patch PR

A future OpenAPI YAML patch PR must include verification such as:

- OpenAPI lint or strict validation;
- grep verification for paths and operationIds;
- diff-name verification proving only approved files changed;
- no runtime, test, RBAC, or generated-client changes unless separately approved.

## Future Sequencing

After this gate, the next safe steps are not automatically approved.

Possible future steps include:

- Status Reconciliation after this gate;
- OpenAPI YAML patch PR;
- generated-client NO-GO or generated-client gate;
- runtime implementation gate;
- route-level Journey Flow Verification gate.

Each future step requires separate approval.

## GO / NO-GO

GO:

- documentation-only OpenAPI YAML Patch Gate planning.

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
