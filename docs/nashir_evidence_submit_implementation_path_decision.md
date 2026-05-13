# Nashir Evidence Submit Implementation Path Decision

## Purpose

This document records the implementation path decision for the missing evidence submit step in the Nashir Internal MVP Campaign Proof Flow.

This document does not implement runtime behavior, tests, OpenAPI YAML, SQL, RBAC, generated clients, UI, package/workflow/script changes, migrations, Sprint 5, Pilot, or Production readiness.

## Current Journey State

Current journey:

```text
Create campaign
-> List campaigns
-> Read campaign
-> Check readiness
-> Submit manual evidence
-> List evidence
```

Implemented:

- create campaign;
- list campaigns;
- read campaign;
- readiness;
- evidence list.

Missing:

- submit manual evidence.

## Options Considered

### Option A

In-memory evidence submit implementation for internal MVP journey verification only.

### Option B

DB-backed evidence persistence first before evidence submit implementation.

## Decision

Choose Option A.

The next implementation slice may implement in-memory evidence submit only if separately approved in an implementation PR.

## Why Option A Wins Now

Option A wins now because:

- it completes the smallest usable internal journey;
- it aligns with the current in-memory Nashir runtime;
- it avoids premature SQL/schema/migration expansion;
- it enables a future journey verification test:

```text
Create -> List -> Read -> Readiness -> Submit Evidence -> List Evidence
```

- it is faster and lower-risk than DB-backed persistence-first.

## Conditions For Option A

The future implementation PR must:

- be explicitly scoped as in-memory only;
- not claim durable evidence;
- not claim Pilot or Production readiness;
- not add SQL/schema/migrations;
- not add DB-backed persistence;
- not add review/acceptance/invalidation/supersession;
- not add approval or publishing;
- update OpenAPI only if separately allowed in the implementation PR scope;
- include route/service tests or a journey flow verification test;
- keep evidence scoped by route-derived `workspaceId` and `nashirCampaignId`;
- preserve non-disclosing `404` behavior;
- use existing `nashir.campaign.write` permission unless a later RBAC gate changes it;
- use candidate audit event naming only if the implementation scope explicitly approves audit behavior.

## What This Does Not Authorize

This PR does not authorize:

- implementation of `POST` evidence;
- OpenAPI YAML changes;
- SQL/schema/migrations;
- RBAC expansion;
- generated clients;
- DB-backed evidence persistence;
- evidence review;
- evidence acceptance;
- evidence invalidation;
- evidence supersession;
- approval routes/transitions;
- publishing workflows;
- scoring persistence;
- frontend/UI;
- package/workflow/script changes;
- Sprint 5;
- Pilot;
- Production.

## Future Implementation Candidate Scope

Candidate files for a separate future implementation PR only:

- `src/router.js`
- `src/nashir/backend-slice0-service.js`
- `src/nashir/backend-slice0-repository.js`
- `docs/nashir_openapi_patch.yaml`
- `test/nashir-route.test.js`
- `test/nashir-openapi-contract.test.js`
- `test/nashir-service-repository-read-path.test.js`
- `docs/nashir_evidence_submit_route_implementation_report.md`
- `docs/03_decision_log.md`
- `docs/17_change_log.md`

These are candidate files for a separate implementation PR only. This document does not authorize edits to those files.

## Recommended Next Step

After this decision PR is merged, open a separate implementation PR:

```text
feat: wire Nashir evidence submit route
```

That PR must explicitly allow runtime, tests, OpenAPI YAML, and implementation report files.

It must still forbid SQL/schema/migrations, DB-backed persistence, RBAC expansion, generated clients, UI, approval, publishing, Sprint 5, Pilot, and Production.

## GO / NO-GO Recommendation

GO for documentation-only implementation path decision.

NO-GO for implementation in this PR.
