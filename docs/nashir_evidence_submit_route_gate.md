# Nashir Evidence Submit Route Gate

## Purpose

This document is a governance-only gate for a future Nashir evidence submit route.

Candidate route:

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

Current evidence state:

- Evidence list exists.
- Evidence submit does not exist.
- Evidence persistence does not exist.
- Evidence review, acceptance, invalidation, and supersession do not exist.
- Approval and publishing do not exist.

The implemented evidence list route is read-only, in-memory, non-mutating, non-persistent, returns `{ data: [] }`, and emits no audit event.

## Candidate Submit Route

Candidate route for future consideration only:

```text
POST /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/evidence
```

Expected permission candidate:

```text
nashir.campaign.write
```

This PR does not authorize RBAC expansion.

## Candidate Request Shape

Planning-level candidate fields only:

- `evidenceType`
- `channel`
- `publishedAt`
- `url`
- `notes`
- `assetVersionId` or `campaignVersionId` if applicable later
- `externalReference` if applicable later

These fields are not a final OpenAPI schema. The exact request shape must be resolved in a later contract gate before implementation can be considered.

## Required Governance Decisions Before Implementation

The following decisions must be resolved before any implementation PR:

- exact request schema;
- exact response schema;
- allowed evidence types;
- validation rules;
- audit event naming;
- idempotency/duplicate behavior;
- version binding;
- self-review/four-eyes constraints;
- permission strategy;
- ErrorModel mapping;
- non-disclosing `404` behavior;
- cross-workspace protection;
- whether evidence remains in-memory or requires DB-backed persistence first;
- whether submit can exist before evidence review routes.

## Audit Expectations

Candidate audit event:

```text
nashir_evidence.submitted
```

This is candidate naming only. The exact audit event name and payload must be confirmed in a later contract or implementation PR before runtime changes are made.

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

## Recommended Sequencing

Recommended sequence:

1. This docs-only submit route gate.
2. Docs-only evidence submit route contract gate.
3. Implementation only after schema, audit, validation, idempotency, version binding, ErrorModel, and permission behavior are resolved.
4. Evidence review/acceptance/invalidation gate after the submit contract is stable.
5. Approval/publishing gates only after evidence lifecycle boundaries are stable.

## GO / NO-GO Recommendation

GO only for this documentation-only gate.

NO-GO for implementation of `POST` evidence, runtime behavior, tests, OpenAPI YAML, SQL/schema/migrations, RBAC expansion, generated clients, evidence persistence/review/acceptance/invalidation/supersession, approval routes/transitions, publishing workflows, scoring persistence, DB-backed Nashir persistence, frontend/UI, package/workflow/script changes, Sprint 5, Pilot, or Production.
