# Nashir Evidence Lifecycle Review Gate

## Purpose

This document records a governance-only gate for future Nashir evidence lifecycle review.

Candidate future lifecycle concepts:

- evidence review
- evidence acceptance
- evidence rejection
- evidence invalidation
- evidence supersession

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
- Evidence review does not exist.
- Evidence acceptance does not exist.
- Evidence invalidation does not exist.
- Evidence supersession does not exist.
- Approval and publishing do not exist.
- DB-backed evidence persistence does not exist.

## Why Lifecycle Review Needs A Gate

Evidence submit only proves that a user submitted proof. Evidence review is a separate human/governance action with different semantics, permissions, audit requirements, and integrity risks.

Acceptance must not equal campaign approval. Acceptance must not authorize publishing. Evidence lifecycle actions can affect how operators interpret proof, so they require explicit boundaries for role permissions, audit payloads, review actor separation, version linkage, and stale evidence handling.

In-memory lifecycle review may be acceptable only for internal MVP verification. Durable lifecycle review requires DB-backed persistence first.

## Candidate Lifecycle States

Planning-level candidate statuses:

- `submitted`
- `accepted`
- `rejected`
- `invalidated`
- `superseded`

Only `submitted` exists today. The other statuses are future candidate states only.

## Candidate Future Routes

Candidate routes only:

- `POST /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/evidence/{evidenceId}/review`
- `POST /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/evidence/{evidenceId}/invalidate`
- `POST /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/evidence/{evidenceId}/supersede`

Exact route naming remains unresolved and must be finalized in a later contract gate.

## Candidate Review Actions

Planning-level candidate actions:

- `accept`
- `reject`

Candidate request fields:

- `action`
- `reviewerNotes`
- `reasonCode`
- `reviewedAt`

These are planning candidates only and not OpenAPI schemas.

## Candidate Invalidation / Supersession Semantics

- Invalidation marks previously submitted or accepted evidence as no longer valid.
- Supersession links an older evidence record to a newer replacement evidence record.
- Supersession must preserve audit trail and must not delete the original evidence.
- Invalidation must require reason and actor.
- Neither invalidation nor supersession implies approval or publishing authorization.

## Permission Strategy Candidates

Candidate options:

- Option A: reuse `nashir.campaign.write` for internal MVP review only.
- Option B: require a future dedicated permission such as `nashir.evidence.review`.
- Option C: separate invalidation and supersession into stronger permissions later.

This PR does not choose an implementation permission strategy. A later contract gate must decide permission codes before implementation. Do not modify `src/rbac.js` in this PR.

## Audit Candidate Events

Candidate events:

- `nashir_evidence.reviewed`
- `nashir_evidence.accepted`
- `nashir_evidence.rejected`
- `nashir_evidence.invalidated`
- `nashir_evidence.superseded`

Audit names are candidates only and follow the current entity/domain plus dotted action pattern. A later audit naming reconciliation may adjust them.

## Integrity And Versioning Risks

- Reviewing evidence without durable persistence may be unsuitable beyond internal MVP.
- Accepted evidence can be misread as campaign approval.
- Stale evidence may remain accepted after campaign changes.
- Supersession without linkage can destroy traceability.
- Invalidation without reason creates audit weakness.
- Review actor must not silently become publisher or approver.

## Critical Decision Before Implementation

A later decision must choose one of:

- in-memory lifecycle review for internal MVP verification only; or
- DB-backed evidence lifecycle persistence first.

Do not implement lifecycle review until this decision is explicit.

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

After this gate:

- create an evidence lifecycle route contract gate; or
- create a decision PR choosing in-memory lifecycle review vs DB-backed lifecycle persistence first.

Do not implement lifecycle review directly from this gate.

## GO / NO-GO Recommendation

GO for documentation-only evidence lifecycle review gate.

NO-GO for implementation.
