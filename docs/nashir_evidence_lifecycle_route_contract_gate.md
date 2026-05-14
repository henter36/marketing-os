# Nashir Evidence Lifecycle Route Contract Gate

## Purpose

This document records a route contract gate for future Nashir evidence lifecycle actions:

- review
- accept
- reject
- invalidate
- supersede

This document does not implement runtime behavior, modify tests, change SQL, change OpenAPI YAML, expand RBAC, update generated clients, add UI, or approve Sprint 5, Pilot, or Production readiness.

## Current State

The current implemented in-memory Nashir Internal MVP Campaign Proof Flow is:

```text
Create campaign
-> List campaigns
-> Read campaign
-> Check readiness
-> Submit manual evidence
-> List evidence
```

Current status:

- Evidence submit exists in-memory only.
- Evidence list returns submitted in-memory evidence.
- Only status `submitted` exists today.
- Evidence review does not exist.
- Evidence acceptance does not exist.
- Evidence rejection does not exist.
- Evidence invalidation does not exist.
- Evidence supersession does not exist.
- Approval and publishing do not exist.
- DB-backed evidence persistence does not exist.

## Candidate Route Set

Candidate routes only:

Review route:

`POST /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/evidence/{evidenceId}/review`

Invalidate route:

`POST /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/evidence/{evidenceId}/invalidate`

Supersede route:

`POST /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/evidence/{evidenceId}/supersede`

These are candidate route contracts only and do not authorize OpenAPI YAML changes or runtime registration.

## Candidate Operation IDs

Candidate operation IDs:

- `reviewNashirCampaignEvidence`
- `invalidateNashirCampaignEvidence`
- `supersedeNashirCampaignEvidence`

Final `operationId` naming remains subject to later implementation scope.

## Candidate Review Request

For the review route, candidate body:

- `action`: required, enum `accept` | `reject`
- `reviewerNotes`: optional string
- `reasonCode`: optional string
- `reviewedAt`: optional ISO datetime

Validation candidates:

- `action` is required.
- `action` must be `accept` or `reject`.
- `reject` should require `reasonCode` or `reviewerNotes`.
- `reviewedAt` may be server-generated if not supplied.
- Route-derived `workspaceId`, `nashirCampaignId`, and `evidenceId` must be authoritative.

## Candidate Invalidate Request

Candidate body:

- `reasonCode`: required string
- `reviewerNotes`: optional string
- `invalidatedAt`: optional ISO datetime

Validation candidates:

- `reasonCode` is required.
- Invalidation must not delete evidence.
- Invalidation must preserve prior evidence state in audit trail.
- Route-derived IDs only.

## Candidate Supersede Request

Candidate body:

- `replacementEvidenceId`: required string
- `reasonCode`: required string
- `reviewerNotes`: optional string
- `supersededAt`: optional ISO datetime

Validation candidates:

- `replacementEvidenceId` is required.
- `replacementEvidenceId` must belong to the same route-derived `workspaceId` and `nashirCampaignId`.
- Original evidence must remain available for traceability.
- Supersession must not delete original evidence.
- Route-derived IDs only.

## Candidate Response Shape

Planning-level candidate response:

```json
{
  "data": {
    "id": "...",
    "workspaceId": "...",
    "nashirCampaignId": "...",
    "status": "accepted|rejected|invalidated|superseded",
    "reviewedBy": "...",
    "reviewedAt": "...",
    "reviewerNotes": "...",
    "reasonCode": "...",
    "replacementEvidenceId": "..."
  }
}
```

This is not an OpenAPI schema and does not authorize generated clients.

## Candidate Status Transitions

Planning-level transitions:

- `submitted` -> `accepted`
- `submitted` -> `rejected`
- `submitted` -> `invalidated`
- `accepted` -> `invalidated`
- `accepted` -> `superseded`
- `rejected` -> `accepted` only after explicit re-review if later approved
- `rejected` -> `superseded` only if later approved
- `invalidated` is terminal unless later reopened by explicit gate
- `superseded` is terminal for the original evidence

Transition rules are candidates only and require a later implementation decision.

## Tenant Isolation / Non-Disclosure Expectations

Future `evidenceId`-based lifecycle routes must preserve non-disclosing behavior:

- missing membership returns non-disclosing `404`
- unknown workspace returns non-disclosing `404`
- unknown campaign returns `404`
- cross-workspace campaign returns `404`
- unknown evidence returns `404`
- evidence belonging to another workspace returns `404`
- evidence belonging to another campaign returns `404`

Routes must not leak whether an `evidenceId` exists outside the authorized route-derived `workspaceId` and `nashirCampaignId` context.

All lifecycle actions must use route-derived `workspaceId`, `nashirCampaignId`, and `evidenceId` only.

## Permission Strategy Candidates

Options:

- Option A: reuse `nashir.campaign.write` for internal MVP lifecycle review only.
- Option B: introduce `nashir.evidence.review`.
- Option C: introduce separate permissions:
  - `nashir.evidence.review`
  - `nashir.evidence.invalidate`
  - `nashir.evidence.supersede`

Do not decide in this PR. A later decision or contract update must choose permission strategy before implementation. Do not modify RBAC in this PR.

## Candidate Audit Events

Candidate events:

- `nashir_evidence.reviewed`
- `nashir_evidence.invalidated`
- `nashir_evidence.superseded`

Accept and reject are outcomes of the review action and should be captured as fields on `nashir_evidence.reviewed`, such as `action`, `priorStatus`, and `nextStatus`. Separate accepted/rejected audit events may be reconsidered only in a later audit naming or lifecycle implementation gate if needed.

Candidate audit fields:

- `workspaceId`
- `nashirCampaignId`
- `evidenceId`
- `action`
- `priorStatus`
- `nextStatus`
- `actorUserId`
- `reasonCode`
- `reviewerNotes`
- `replacementEvidenceId` if superseded
- `occurredAt`

Audit names and fields are candidates only and follow the current entity/domain plus dotted action pattern. A future audit naming reconciliation may change them.

## ErrorModel Candidate Mapping

Candidate behavior:

- `401` unauthenticated
- `404` missing membership / unknown workspace / unknown campaign / cross-workspace campaign / unknown evidence / cross-campaign evidence
- `403` active member without required permission
- `400` invalid request body or missing required fields
- `409` invalid state transition
- `409` process blocked if lifecycle action is blocked by governance
- `422` only if current project conventions explicitly allow semantic validation

## In-Memory Vs DB-Backed Decision

Lifecycle review implementation should not proceed until a decision is made:

- in-memory lifecycle actions for internal MVP verification only; or
- DB-backed evidence lifecycle persistence first.

In-memory lifecycle review is weak for traceability and should not be used for Pilot, Production, or durable evidence claims.

## Separation From Approval / Publishing

- Accepted evidence does not approve a campaign.
- Accepted evidence does not authorize publishing.
- Rejected evidence does not reject the campaign.
- Invalidated evidence does not change campaign status by itself.
- Superseded evidence does not imply approval or publishing.
- Approval and publishing require separate gates.

## NO-GO Boundaries

The following remain NO-GO:

- implementation of evidence review
- implementation of evidence acceptance
- implementation of evidence rejection
- implementation of evidence invalidation
- implementation of evidence supersession
- OpenAPI YAML changes
- SQL/schema/migrations
- RBAC expansion
- generated clients
- DB-backed evidence persistence
- approval routes/transitions
- publishing workflows
- scoring persistence
- frontend/UI
- package/workflow/script changes
- Sprint 5
- Pilot
- Production

## Recommended Next Step

After this contract gate:

- create a decision PR choosing in-memory lifecycle review vs DB-backed lifecycle persistence first; or
- create a more specific implementation gate only if permission, persistence, audit, and transition rules are settled.

Do not implement lifecycle routes directly from this document.

## GO / NO-GO Recommendation

GO for documentation-only route contract gate.

NO-GO for implementation.
