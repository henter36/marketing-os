# Nashir Evidence Submit Route Contract Gate

## Purpose

This document is a documentation-only route contract gate for future:

```text
POST /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/evidence
```

This document does not implement runtime behavior, tests, OpenAPI YAML, SQL, RBAC, generated clients, UI, package/workflow/script changes, migrations, Sprint 5, Pilot, or Production readiness.

## Current State

The currently implemented Nashir routes are:

- `GET /workspaces/{workspaceId}/nashir-campaigns`
- `GET /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}`
- `POST /workspaces/{workspaceId}/nashir-campaigns`
- `GET /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/readiness`
- `GET /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/evidence`

Current evidence and workflow state:

- `POST` evidence does not exist.
- Evidence persistence does not exist.
- Evidence review, acceptance, invalidation, and supersession do not exist.
- Approval and publishing do not exist.

The implemented evidence list route is read-only, in-memory, non-mutating, non-persistent, returns `{ data: [] }`, and emits no audit event.

## Candidate Route Contract

Candidate route:

```text
POST /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/evidence
```

Candidate `operationId`:

```text
submitNashirCampaignEvidence
```

Candidate permission:

```text
nashir.campaign.write
```

No RBAC expansion is authorized here.

## Candidate Request Schema

Planning-level candidate schema:

- `evidenceType`: required string
- `channel`: required string
- `publishedAt`: optional ISO datetime
- `url`: optional string
- `notes`: optional string
- `externalReference`: optional string
- `campaignVersionId`: optional string, only if version binding is resolved
- `assetVersionId`: optional string, only if asset version binding is resolved

Candidate validation notes:

- At least one proof locator should be required later: `url`, `externalReference`, or `notes`.
- `evidenceType` must be constrained to approved enum values later.
- `channel` must be constrained to approved channel values later.
- `publishedAt` must not imply analytics or performance proof.
- Evidence submission is proof-of-manual-publishing only, not approval, publishing authorization, or performance validation.

## Candidate Response Schema

Candidate response:

```json
{
  "data": {
    "id": "...",
    "nashirCampaignId": "...",
    "workspaceId": "...",
    "evidenceType": "...",
    "channel": "...",
    "status": "submitted",
    "submittedAt": "...",
    "submittedBy": "...",
    "publishedAt": "...",
    "url": "...",
    "notes": "...",
    "externalReference": "..."
  }
}
```

This is not an OpenAPI change and does not authorize generated clients.

## Candidate Status And Type Values

Candidate evidence status:

- `submitted`

Future statuses not implemented:

- `accepted`
- `rejected`
- `invalidated`
- `superseded`

Candidate evidence types:

- `manual_publish_proof`
- `external_post_url`
- `screenshot_reference`
- `platform_confirmation`
- `other`

These values must be finalized in a later implementation PR if implementation proceeds.

## ErrorModel / Authorization Candidate Mapping

Candidate behavior:

- `401` for unauthenticated requests.
- `404` for missing membership.
- `404` for unknown workspace.
- `404` for unknown or cross-workspace campaign.
- `403` for active member without `nashir.campaign.write`.
- `400` for invalid request body.
- `409` for duplicate/idempotency conflict if duplicate behavior is adopted.
- `422` only if project conventions already allow semantic validation; otherwise keep validation at `400`.

## Audit Candidate

Candidate audit event:

```text
nashir_evidence.submitted
```

Candidate audit fields:

- `workspaceId`
- `nashirCampaignId`
- `evidenceId`
- `evidenceType`
- `channel`
- `submittedBy`
- `submittedAt`
- `campaignVersionId` if adopted
- `assetVersionId` if adopted

Audit naming and fields are candidates only and must be confirmed before implementation.

## Idempotency / Duplicate Behavior

Unresolved choices:

- reject duplicate evidence by same campaign/channel/url;
- allow multiple evidence records;
- require idempotency key;
- use `externalReference` as duplicate guard.

This gate does not choose implementation behavior.

## Version Binding

Unresolved choices:

- bind evidence to campaign version;
- bind evidence to asset version;
- bind evidence only to current campaign;
- defer version binding until DB-backed persistence.

Implementation must not proceed until the version binding decision is explicit.

## Persistence Decision

`POST` evidence may be low-value if evidence is in-memory only.

Any future implementation PR must explicitly decide whether:

- in-memory submit is acceptable for contract/testing only; or
- DB-backed Nashir evidence persistence is required first.

## Review / Acceptance Separation

Submit does not mean review.

Submit does not mean acceptance.

Submit does not approve campaign content.

Submit does not authorize publishing.

Submit does not validate performance.

Review, acceptance, invalidation, and supersession require separate gates.

## NO-GO Boundaries

The following remain NO-GO:

- implementation of `POST` evidence;
- OpenAPI YAML changes;
- SQL/schema/migrations;
- RBAC expansion;
- generated clients;
- evidence persistence;
- evidence review;
- evidence acceptance;
- evidence invalidation;
- evidence supersession;
- approval routes/transitions;
- publishing workflows;
- scoring persistence;
- DB-backed Nashir persistence;
- frontend/UI;
- package/workflow/script changes;
- Sprint 5;
- Pilot;
- Production.

## Recommended Next Step

Do not implement `POST` evidence directly unless this contract gate is accepted and a separate implementation PR is scoped.

The next implementation PR, if approved later, must define allowed files, forbidden files, verification commands, rollback/no-go criteria, and exact OpenAPI/runtime/test scope.

## GO / NO-GO Recommendation

GO only for this documentation-only contract gate.

NO-GO for implementation of `POST` evidence, runtime behavior, tests, OpenAPI YAML, SQL/schema/migrations, RBAC expansion, generated clients, evidence persistence/review/acceptance/invalidation/supersession, approval routes/transitions, publishing workflows, scoring persistence, DB-backed Nashir persistence, frontend/UI, package/workflow/script changes, Sprint 5, Pilot, or Production.
