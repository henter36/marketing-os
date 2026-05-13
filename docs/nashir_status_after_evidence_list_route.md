# Nashir Status After Evidence List Route

## Purpose

This document is a documentation-only post-merge status reconciliation after PR #202:

```text
feat: wire Nashir evidence list route
```

This status record does not implement runtime behavior, modify tests, change SQL, change OpenAPI YAML, expand RBAC, update generated clients, add UI, or approve Sprint 5, Pilot, or Production readiness.

## Task Classification

Documentation-only / post-merge status reconciliation.

## Approved Sources Used

- `AGENTS.md`
- `README.md`
- `docs/17_change_log.md`
- `docs/03_decision_log.md`
- `docs/nashir_evidence_list_route_implementation_report.md`
- `docs/nashir_evidence_route_contract_gate.md`
- `docs/nashir_evidence_route_gate.md`
- `docs/nashir_status_after_readiness_route.md`
- `docs/nashir_openapi_patch.yaml`
- `src/router.js`
- `src/nashir/backend-slice0-service.js`
- `src/nashir/backend-slice0-repository.js`
- `test/nashir-route.test.js`
- `test/nashir-openapi-contract.test.js`
- `test/nashir-prewiring-contract.test.js`
- `test/nashir-service-repository-read-path.test.js`

No approved source conflict was identified.

## Current Implemented Nashir Routes

After PR #202, the implemented Nashir routes are:

```text
GET /workspaces/{workspaceId}/nashir-campaigns
GET /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}
POST /workspaces/{workspaceId}/nashir-campaigns
GET /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/readiness
GET /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/evidence
```

## Evidence List Route Behavior Confirmed

`GET /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/evidence` is implemented as:

- read-only;
- in-memory;
- non-mutating;
- `{ data: [] }` response shape;
- no evidence submission exists;
- no evidence persistence exists;
- no synthetic or seeded evidence is exposed;
- route-derived `workspaceId` only;
- route-derived `nashirCampaignId` only;
- protected by `authGuard`;
- protected by `nonDisclosingMembershipCheck`;
- protected by `nashir.campaign.read`;
- non-disclosing `404` for missing membership;
- non-disclosing `404` for unknown workspace;
- `404` for unknown or cross-workspace campaign access;
- `403` for a valid active member without `nashir.campaign.read`;
- no audit event emitted.

The evidence list route does not submit, review, accept, invalidate, supersede, approve, publish, or persist evidence.

## OpenAPI State Confirmed

`docs/nashir_openapi_patch.yaml` now exposes:

```text
GET /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/evidence
operationId: listNashirCampaignEvidence
x-permission: nashir.campaign.read
```

The response schema is:

- `NashirCampaignEvidenceListResponse`

No `POST` evidence path exists.

No generated clients were updated.

## Preserved Behavior

The following behavior remains preserved after PR #202:

- list route behavior is unchanged;
- read-by-id route behavior is unchanged;
- create route behavior is unchanged;
- readiness route behavior is unchanged;
- non-disclosing membership behavior is preserved;
- create route audit event remains `nashir_campaign.created`;
- readiness read emits no audit event;
- evidence list emits no audit event.

## Remaining NO-GO

The following remain NO-GO:

- `POST` evidence;
- evidence submission;
- evidence review;
- evidence acceptance;
- evidence invalidation;
- evidence supersession;
- approval routes/transitions;
- publishing workflows;
- update/delete routes;
- scoring persistence;
- DB-backed Nashir persistence;
- SQL/schema/migrations;
- RBAC expansion;
- generated clients;
- frontend/UI;
- package/workflow/script changes;
- Sprint 5;
- Pilot;
- Production.

## Follow-Up Candidates

Candidate next gates:

- docs-only evidence submit route gate;
- docs-only evidence submit contract gate;
- docs-only evidence review/acceptance/invalidation gate;
- approval route gate only after evidence submit/review boundaries are stable;
- DB-backed Nashir persistence planning gate.

## Recommendation

Do not implement `POST` evidence directly yet.

The next safest step is a docs-only evidence submit route gate.

Evidence submit requires audit, request payload, validation, idempotency/duplicate behavior, version binding, self-review/four-eyes, permission strategy, and ErrorModel mapping before implementation.

## GO / NO-GO Recommendation

GO for this documentation-only post-merge status reconciliation limited to:

```text
docs/nashir_status_after_evidence_list_route.md
docs/17_change_log.md
```

NO-GO for runtime, tests, SQL, OpenAPI YAML, RBAC, generated clients, UI, package/workflow/script changes, migrations, `POST` evidence, evidence submission/review/acceptance/invalidation/supersession, approval, publishing, update/delete routes, scoring persistence, DB-backed Nashir persistence, Sprint 5, Pilot, or Production changes in this PR.
