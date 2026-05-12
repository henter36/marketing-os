# Nashir List Route Implementation Report

## Task Classification

Implementation / narrow Nashir list route.

## Approved Sources Used

- `AGENTS.md`
- `README.md`
- `docs/17_change_log.md`
- `docs/nashir_list_route_gate.md`
- `src/router.js`
- `src/nashir/backend-slice0-service.js`
- `src/nashir/backend-slice0-repository.js`
- `src/store.js`
- `test/nashir-prewiring-contract.test.js`
- `test/nashir-route.test.js`
- `test/nashir-service-repository-read-path.test.js`

No approved source conflict was identified.

## Implemented Route

```text
GET /workspaces/{workspaceId}/nashir-campaigns
```

The route is read-only and returns:

```text
{ "data": [ ... ] }
```

The router calls `ok(items)`, where `items` is the array returned by the Nashir service.

## Service / Repository Methods Added

- `NashirSlice0Repository.listCampaigns({ workspaceId })`
- `NashirSlice0Service.listCampaigns({ workspaceId })`

Repository behavior:

- Reads only from injected `store.nashirCampaigns`.
- Filters by `workspace_id === workspaceId`.
- Returns `[]` when `workspaceId` is missing.
- Returns `[]` when no campaigns match.
- Returns shallow clones.
- Does not mutate `store.nashirCampaigns`.
- Does not access DB, SQL, migrations, or external services.

Service behavior:

- Delegates to `repository.listCampaigns({ workspaceId })`.
- Returns `[]` when no repository is injected.
- Does not implement create, save, write, evidence, approval, scoring, or publishing behavior.

## Guards and Permission

The route uses the existing guard pattern:

- `workspaceContextGuard`
- `authGuard`
- active membership lookup with non-disclosure behavior
- `permissionGuard`

Permission used:

```text
nashir.campaign.read
```

`workspaceId` is derived from the URL path only. Request body `workspace_id` is not used for filtering.

For the list route, authentication runs before membership evaluation. Missing membership returns `404` rather than `403` so the route does not disclose whether a workspace exists to non-members. Unknown or non-existent workspaces also return `404`. Empty existing workspaces return `200` with `[]` only after active membership and `nashir.campaign.read` permission are confirmed.

## Scope Boundaries Preserved

- `POST /workspaces/{workspaceId}/nashir-campaigns` remains unregistered.
- Evidence routes remain unregistered.
- Approval routes remain unregistered.
- Scoring/readiness routes remain unregistered.
- Publishing routes remain unregistered.
- Existing read-by-id route behavior is preserved.
- `src/store.js` unchanged.
- `src/rbac.js` unchanged.
- SQL files unchanged.
- OpenAPI YAML files unchanged.
- Package and workflow files unchanged.
- Generated clients unchanged.
- Sprint 5 remains NO-GO.
- Pilot remains NO-GO.
- Production remains NO-GO.

## Tests Added / Updated

`test/nashir-route.test.js` now covers:

- List route returns 200 with `{ data: [...] }` for workspace-a.
- List route returns only workspace-scoped Nashir campaigns.
- Empty existing workspace returns `[]` only for callers with confirmed active membership and `nashir.campaign.read`.
- Unknown workspace returns 404.
- Missing membership returns 404 for non-disclosure.
- Missing `nashir.campaign.read` permission returns 403.
- Request body `workspace_id` does not affect filtering.
- POST list path remains unregistered.
- Read-by-id route still works.
- Evidence, approval, scoring, and publishing routes remain unregistered.

`test/nashir-service-repository-read-path.test.js` now covers:

- Repository list filtering.
- Missing workspaceId returns `[]`.
- No matching campaigns returns `[]`.
- List results are shallow clones.
- Mutating a returned listed campaign does not mutate store state.
- Service delegation to `repository.listCampaigns`.
- Service returns `[]` when repository is absent.
- Existing write/evidence/approval/scoring/publishing methods remain inert.

`test/nashir-prewiring-contract.test.js` was updated to allow the approved read route patterns only.

## Verification

Verification run:

```text
PASS: node --test test/nashir-route.test.js
PASS: node --test test/nashir-prewiring-contract.test.js
PASS: node --test test/nashir-service-repository-read-path.test.js
PASS: npm test
```

Remaining local diff checks required before PR opening:

```text
git diff --check
git diff --name-only
git status --short
```

## GO / NO-GO Recommendation

GO for opening a scoped implementation PR if the full verification commands pass and `git diff --name-only` remains limited to the approved files.

NO-GO for create/write/evidence/approval/scoring/publishing behavior, DB/SQL persistence, RBAC expansion, OpenAPI YAML changes, package/workflow changes, Sprint 5, Pilot, or Production readiness.
