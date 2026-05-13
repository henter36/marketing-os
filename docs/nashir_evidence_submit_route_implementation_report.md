# Nashir Evidence Submit Route Implementation Report

## Purpose

This report records the narrow implementation of:

`POST /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/evidence`

The route completes the missing evidence submit step for the Nashir Internal MVP Campaign Proof Flow as an in-memory implementation only.

## Implemented Scope

- Added the `POST /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/evidence` route.
- Uses route-derived `workspaceId` only.
- Uses route-derived `nashirCampaignId` only.
- Uses `authGuard`.
- Uses `nonDisclosingMembershipCheck`.
- Uses existing `nashir.campaign.write`.
- Validates required `evidenceType`.
- Validates required `channel`.
- Requires at least one proof locator: `url`, `externalReference`, or `notes`.
- Creates an in-memory evidence record with `status: submitted`.
- Emits `nashir_evidence.submitted` through the existing audit helper.
- Updates the existing evidence list route so submitted in-memory evidence is returned for the same route-derived workspace and campaign.

## Evidence Record

The in-memory evidence record contains:

- `id`
- `workspaceId`
- `nashirCampaignId`
- `evidenceType`
- `channel`
- `status`
- `submittedAt`
- `submittedBy`
- `publishedAt`
- `url`
- `notes`
- `externalReference`

`campaignVersionId` and `assetVersionId` remain deferred. Version binding is not implemented in this slice.

## Evidence List Behavior

Before any in-memory evidence submission, the evidence list route returns:

```json
{ "data": [] }
```

After a valid in-memory evidence submission in the same runtime process, the evidence list route returns:

```json
{ "data": ["submitted in-memory evidence records for the route-derived campaign"] }
```

This is not durable evidence and is not DB-backed persistence.

## OpenAPI

`docs/nashir_openapi_patch.yaml` was updated for the new POST evidence route only:

- `operationId: submitNashirCampaignEvidence`
- `x-permission: nashir.campaign.write`
- `x-audit-event: nashir_evidence.submitted`
- request schema: `SubmitNashirCampaignEvidenceRequest`
- response schema: `NashirCampaignEvidenceResponse`
- evidence item schema: `NashirCampaignEvidence`
- default `ErrorResponse`

Generated clients were not updated.

## Explicit Non-Goals

This implementation does not add:

- durable evidence
- DB-backed evidence persistence
- SQL/schema/migrations
- RBAC expansion
- generated clients
- frontend/UI
- evidence review
- evidence acceptance
- evidence invalidation
- evidence supersession
- approval routes or transitions
- publishing workflows
- scoring persistence
- package, workflow, or script changes
- Sprint 5 readiness
- Pilot readiness
- Production readiness

## Remaining NO-GO

Nashir evidence remains internal-MVP and in-memory only. DB-backed persistence, evidence lifecycle review, approval, publishing, Sprint 5, Pilot, and Production remain NO-GO until separately approved.
