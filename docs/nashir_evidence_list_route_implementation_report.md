# Nashir Evidence List Route Implementation Report

## Purpose

This report records the narrow implementation of the read-only Nashir evidence list route:

```text
GET /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/evidence
```

This implementation is based on the approved documentation gates from PR #200 (`docs/nashir_evidence_route_gate.md`) and PR #201 (`docs/nashir_evidence_route_contract_gate.md`).

## Implemented Route

Implemented only:

```text
GET /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/evidence
```

The route is read-only evidence list only.

For this first slice, it returns:

```json
{
  "data": []
}
```

The empty list is intentional because no evidence submission, review, acceptance, invalidation, supersession, or persistence is implemented.

## Runtime Behavior

The route:

- uses route-derived `workspaceId` only;
- uses route-derived `nashirCampaignId` only;
- uses `authGuard`;
- uses `nonDisclosingMembershipCheck`;
- uses `permissionGuard(membership, "nashir.campaign.read")`;
- returns non-disclosing `404` for missing membership and unknown workspace;
- returns `404` for unknown campaign and cross-workspace campaign access;
- returns `403` for a valid active member lacking `nashir.campaign.read`;
- does not mutate `store.nashirCampaigns`;
- does not create `store.nashirEvidence`;
- does not persist evidence;
- does not expose synthetic or seeded evidence.

## Explicit Non-Implementation

This PR does not implement:

- `POST /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/evidence`;
- evidence submission;
- evidence acceptance;
- evidence review;
- evidence invalidation;
- evidence supersession;
- approval routes or transitions;
- publishing workflows;
- update/delete routes;
- scoring persistence;
- DB-backed persistence;
- UI;
- generated clients.

## Audit

The read-only evidence list route emits no audit event.

The audit helper was not modified.

## OpenAPI

`docs/nashir_openapi_patch.yaml` was updated for this `GET` route only:

```text
GET /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/evidence
operationId: listNashirCampaignEvidence
x-permission: nashir.campaign.read
```

The response schema documents `{ data: [] }` through `NashirCampaignEvidenceListResponse`.

No `POST` evidence path was added.

No generated clients were updated.

## Preserved Behavior

The following routes remain unchanged:

- `GET /workspaces/{workspaceId}/nashir-campaigns`
- `GET /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}`
- `POST /workspaces/{workspaceId}/nashir-campaigns`
- `GET /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/readiness`

## Files Changed

Changed files are limited to the approved implementation scope:

- `src/router.js`
- `src/nashir/backend-slice0-service.js`
- `src/nashir/backend-slice0-repository.js`
- `docs/nashir_openapi_patch.yaml`
- `test/nashir-route.test.js`
- `test/nashir-prewiring-contract.test.js`
- `test/nashir-openapi-contract.test.js`
- `test/nashir-service-repository-read-path.test.js`
- `docs/nashir_evidence_list_route_implementation_report.md`
- `docs/03_decision_log.md`
- `docs/17_change_log.md`

## NO-GO Preserved

The following remain NO-GO:

- SQL/schema/migration changes;
- RBAC expansion;
- DB-backed Nashir persistence;
- generated clients;
- package changes;
- workflow changes;
- script changes;
- prototype changes;
- UI changes;
- Sprint 5;
- Pilot;
- Production.

## Recommendation

GO for the narrow read-only evidence list implementation.

NO-GO remains for evidence submission, review, acceptance, invalidation, supersession, approval, publishing, scoring persistence, DB-backed persistence, generated clients, UI, package/workflow/script changes, Sprint 5, Pilot, and Production.
