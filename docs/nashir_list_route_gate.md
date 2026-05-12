# Nashir List Route Gate

## 1. Status

```text
Task classification:                 Documentation-only / Nashir list route gate.
Current implemented Nashir route:     GET /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}
Candidate next route:                 GET /workspaces/{workspaceId}/nashir-campaigns
Gate decision:                        GO - read-only list route may be the next implementation slice.
Create route:                         NO-GO.
Write/evidence/approval routes:       NO-GO.
Scoring/readiness routes:             NO-GO.
Publishing routes/workflows:          NO-GO.
DB-backed Nashir persistence:         NO-GO.
SQL/schema/migration changes:         NO-GO.
OpenAPI YAML changes:                 NO-GO unless separately gated.
RBAC expansion:                       NO-GO.
Sprint 5:                             NO-GO.
Pilot:                                NO-GO.
Production:                           NO-GO.
```

## 2. Purpose

This document is a documentation-only route gate after the read-by-id Nashir route implementation. It confirms the current post-read-route state and decides whether the next implementation PR may wire only:

```text
GET /workspaces/{workspaceId}/nashir-campaigns
```

This gate does not implement code, change tests, modify OpenAPI YAML, modify SQL, expand RBAC, or approve any write-side Nashir behavior.

## 3. Approved Sources Used

- `README.md`
- `docs/17_change_log.md`
- `docs/nashir_status_after_read_route.md`
- `docs/nashir_read_route_wiring_gate.md`
- `docs/nashir_service_repository_gate.md`
- Request context:
  - PR #176 added in-memory `nashirCampaigns` store entities.
  - PR #179 implemented the Nashir service/repository read-by-id path.
  - PR #181 implemented `GET /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}`.
  - PR #182 added strict OpenAPI lint support for the approved Nashir OpenAPI patch.
  - PR #184 recorded the post-read-route Nashir status reconciliation.

Source note: this gate relies on the aligned substantive state after PRs #181, #182, and #184: the read-by-id route is implemented, strict OpenAPI lint recognizes the approved Nashir patch, and the list route remains unimplemented and separately gated.

## 4. Current Implemented State

After PR #181 and the post-read-route status record:

- `GET /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}` is implemented.
- The route uses `workspaceContextGuard`, `authGuard`, `membershipCheck`, and `permissionGuard`.
- The route enforces `nashir.campaign.read`.
- `workspaceId` and `nashirCampaignId` are derived from URL path context, not from request bodies.
- `NashirSlice0Repository.findCampaignById` and `NashirSlice0Service.getCampaignById` provide the existing read-by-id path.
- `store.nashirCampaigns` remains the only approved Nashir runtime data source.
- `GET /workspaces/{workspaceId}/nashir-campaigns` is not registered.
- `POST /workspaces/{workspaceId}/nashir-campaigns` is not registered.
- Write, evidence, approval, scoring/readiness, and publishing routes are not registered.
- DB-backed Nashir persistence is not implemented.
- No SQL/schema/migration change is authorized.
- No OpenAPI YAML change is authorized by this gate.
- No RBAC expansion is authorized by this gate.

No approved source conflict was identified for the implementation state above.

## 5. Gate Decision

**GO for a future implementation PR limited to the read-only Nashir list route:**

```text
GET /workspaces/{workspaceId}/nashir-campaigns
```

The route is approved only as a read-only list over the existing in-memory `store.nashirCampaigns` collection. It must use the same workspace-scoped guard pattern as the existing read-by-id route and must enforce `nashir.campaign.read`.

The future implementation PR may add the minimal list read path needed to support this route:

- `NashirSlice0Repository.listCampaigns({ workspaceId })`
- `NashirSlice0Service.listCampaigns({ workspaceId })`

No create, update, delete, evidence, approval, readiness/scoring, publishing, DB, SQL, OpenAPI YAML, or RBAC expansion work is approved.

## 6. Approved Future Implementation Scope

The future implementation PR may do only the following:

1. Register `GET /workspaces/{workspaceId}/nashir-campaigns` in `src/router.js`.
2. Add the route to the router's implemented route list, using the exact list path only.
3. Instantiate or reuse the existing Nashir repository/service wiring already present for read-by-id.
4. Add `NashirSlice0Repository.listCampaigns({ workspaceId })`.
5. Add `NashirSlice0Service.listCampaigns({ workspaceId })`.
6. Return `ok(items)` where `items` is the array of campaigns, ensuring the response shape is `{ data: [...] }` and remains consistent with other list endpoints in `src/router.js`.
7. Filter list results by `workspace_id === workspaceId`.
8. Return an empty list for workspaces with no matching Nashir campaigns.
9. Preserve the existing read-by-id route behavior.
10. Update focused tests for the list route and forbidden route boundaries.

The future implementation must not trust `workspace_id` from a request body or query string. Workspace scope must come from the route-derived workspace context only.

## 7. Allowed Files for the Future Implementation PR

| File | Allowed future change |
|---|---|
| `src/router.js` | Register only `GET /workspaces/{workspaceId}/nashir-campaigns`; preserve existing read-by-id route |
| `src/nashir/backend-slice0-repository.js` | Add read-only `listCampaigns({ workspaceId })` over `store.nashirCampaigns` |
| `src/nashir/backend-slice0-service.js` | Add read-only `listCampaigns({ workspaceId })` delegating to the repository |
| `test/nashir-prewiring-contract.test.js` | Narrowly allow the approved list route/list method identifiers while preserving all other Nashir route blocks |
| `test/nashir-route.test.js` | Add focused list route tests |
| `test/nashir-service-repository.test.js` | Add focused list service/repository tests if existing coverage does not already cover the new methods |
| `docs/nashir_list_route_implementation_report.md` | New implementation report |
| `docs/03_decision_log.md` | Add implementation decision entry if the implementation PR changes scope status |
| `docs/17_change_log.md` | Add implementation change-log entry |

No other files are in scope for the future implementation PR.

## 8. Forbidden Files for the Future Implementation PR

| File / Category | Boundary |
|---|---|
| `src/store.js` | No store entity changes; `nashirCampaigns` already exists |
| `src/rbac.js` | No RBAC expansion; `nashir.campaign.read` already exists |
| `src/server.js` | No server changes |
| `src/config.js` | No config changes |
| Any SQL file | No SQL/schema/persistence change |
| Any migration file | No migration change |
| Any OpenAPI YAML file | No OpenAPI YAML change unless separately gated |
| `package.json` / lockfiles | No dependency or script changes |
| `.github/workflows/` | No workflow changes |
| `scripts/` | No script changes |
| `prototype/` | No prototype changes |
| Any generated client | No generated client update |

## 9. Acceptance Criteria

The future implementation PR is GO only if all criteria are satisfied:

1. `GET /workspaces/{workspaceId}/nashir-campaigns` is registered.
2. No other Nashir route is added.
3. The existing read-by-id route remains registered and behaviorally unchanged.
4. The list route applies `workspaceContextGuard`, `authGuard`, `membershipCheck`, and `permissionGuard`.
5. The list route enforces `nashir.campaign.read`.
6. `workspaceId` is derived from route context only.
7. Request body `workspace_id` is ignored or irrelevant for this GET route.
8. Returned campaigns are limited to `workspace_id === workspaceId`.
9. Cross-workspace campaigns are never included.
10. Empty existing workspaces return an empty list; unknown or non-existent workspaces must result in a 404 error via the existing guard pattern.
11. The list route uses only the in-memory `store.nashirCampaigns` path.
12. No DB connection, pool, query, SQL, or migration is introduced.
13. No OpenAPI YAML file is modified.
14. No RBAC file is modified.
15. Create/write/evidence/approval/scoring/publishing routes remain unregistered.
16. All focused Nashir tests and the repository's strict verification gate pass.

## 10. Required Tests in Prose Only

The future implementation PR must include focused tests that prove:

- A workspace member with `nashir.campaign.read` receives HTTP 200 for `GET /workspaces/{workspaceId}/nashir-campaigns`.
- The response contains only Nashir campaigns from the route-derived workspace.
- A workspace with no Nashir campaigns receives HTTP 200 with an empty list.
- A caller without workspace membership is rejected by the existing guard behavior.
- A caller without `nashir.campaign.read` is rejected by the existing permission behavior.
- A request body or query parameter containing another `workspace_id` does not affect the workspace filter.
- The existing read-by-id route still returns the expected single campaign.
- `POST /workspaces/{workspaceId}/nashir-campaigns` remains unregistered.
- Evidence, approval, scoring/readiness, and publishing route patterns remain unregistered.
- Service/repository list methods return shallow copies or otherwise avoid exposing mutable store internals, matching the existing read-by-id defensive-copy pattern.
- Service/repository list methods do not import router, server, guards, RBAC, DB, SQL, scripts, or external packages.

## 11. Remaining NO-GO Boundaries

- NO-GO: Create route.
- NO-GO: Update, delete, write-side service, or write-side repository behavior.
- NO-GO: Evidence routes or evidence store methods.
- NO-GO: Approval routes or approval state transitions.
- NO-GO: Scoring/readiness route or scoring runtime.
- NO-GO: Publishing route, publishing workflow, direct publishing, scheduling, paid execution, or external platform integration.
- NO-GO: DB-backed Nashir persistence.
- NO-GO: SQL/schema/migration changes.
- NO-GO: OpenAPI YAML changes unless separately gated.
- NO-GO: RBAC expansion.
- NO-GO: Runtime agents, AI providers, generated clients, package changes, workflow changes, scripts, or prototype changes.
- NO-GO: Sprint 5 coding approval beyond the narrow separately approved future implementation PR.
- NO-GO: Pilot readiness.
- NO-GO: Production readiness.

## 12. GO / NO-GO Recommendation

```text
GO:     Open a future implementation PR for the read-only Nashir list route only.
GO:     Add minimal listCampaigns service/repository read methods if needed for the route.
GO:     Preserve nashir.campaign.read and existing workspace guard behavior.
NO-GO:  Any create/write/evidence/approval/scoring/publishing route.
NO-GO:  Any DB/SQL persistence work.
NO-GO:  Any RBAC expansion.
NO-GO:  Any OpenAPI YAML change unless separately gated.
NO-GO:  Any Pilot or Production readiness claim.
```
