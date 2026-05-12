# Nashir Read Route Wiring Gate

## 1. Status

```text
Documentation status:                GO — documentation-only route wiring gate.
Six-step prerequisite sequence:      Steps 1–5 confirmed complete (see Section 3).
Route wiring approved:               GET /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}
Read-by-id route scope:              APPROVED for future implementation PR.
List route (GET /nashir-campaigns):  Deferred — separately gated.
Create route (POST /nashir-campaigns): Deferred — separately gated.
Write/evidence/approval routes:      NO-GO.
src/router.js modification:          Approved only for the one route listed above.
src/rbac.js modification:            NO-GO — nashir.campaign.read already implemented.
src/store.js modification:           NO-GO — store already has nashirCampaigns.
OpenAPI YAML changes:                NO-GO.
RBAC expansion:                      NO-GO.
SQL / DB access:                     NO-GO.
DB-backed Nashir persistence:        NO-GO.
Publishing workflow implementation:  NO-GO.
Package / workflow / migration:      NO-GO.
Prototype:                           NO-GO.
Sprint 5:                            NO-GO.
Pilot:                               NO-GO.
Production:                          NO-GO.
```

## 2. Purpose

This document is a documentation-only route wiring gate. It is the route implementation scope gate required by step 3 of the six-step `src/router.js` sequence established in `docs/nashir_openapi_implementation_scope_gate.md` (Section 8). It confirms that all prior required steps are complete, defines the exact scope of the approved single read-by-id Nashir route, and specifies allowed files, forbidden files, acceptance criteria, required tests, and prerequisites for the future route implementation PR.

This document does not:
- Implement any code.
- Authorize list or create route registration.
- Authorize write, evidence, approval, or publishing routes.
- Authorize OpenAPI YAML changes.
- Authorize RBAC expansion.
- Authorize SQL schema changes.
- Authorize DB-backed Nashir persistence.
- Authorize any route beyond the one defined in Section 5.

## 3. Six-Step Prerequisite Sequence — Status

`docs/nashir_openapi_implementation_scope_gate.md` Section 8 requires all six steps before `src/router.js` may be modified for Nashir.

| Step | Requirement | PR / Status |
|---|---|---|
| 1 | OpenAPI implementation scope gate merged | ✅ PR #167 |
| 2 | OpenAPI YAML patched (`docs/nashir_openapi_patch.yaml` added) | ✅ PR #168 |
| 3 | Route implementation scope gate approved | ✅ **This document** |
| 4 | Nashir store entities implemented (`store.nashirCampaigns`) | ✅ PRs #175 / #176 |
| 5 | Nashir service/repository read-path implemented | ✅ PRs #178 / #179 |
| 6 | Latest Strict Verification passes after all the above | ⏳ Required before the route implementation PR opens |

Step 6 is the only remaining prerequisite. It must be satisfied immediately before the route implementation PR opens — it cannot be satisfied in advance.

### 3.1 PR #179 Read-Path Confirmation

PR #179 implemented and verified:

| Method | Module | Behavior |
|---|---|---|
| `findCampaignById({ workspaceId, nashirCampaignId })` | `NashirSlice0Repository` | Reads `store.nashirCampaigns`; workspace-scoped; returns shallow clone or null |
| `getCampaignById({ workspaceId, nashirCampaignId })` | `NashirSlice0Service` | Delegates to repository; returns null when repository absent |

Both methods handle missing args (`= {}` default), null/undefined store entries, and cross-workspace isolation. No route is exposed; no DB access is present. 185/185 tests pass.

## 4. Approved Route

**Exactly one route is approved for the future implementation PR:**

```text
GET /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}
```

| Attribute | Value |
|---|---|
| Method | `GET` |
| Path | `/workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}` |
| RBAC permission | `nashir.campaign.read` (already in `src/rbac.js` via PR #166) |
| Service call | `nashirService.getCampaignById({ workspaceId, nashirCampaignId })` |
| Found response | HTTP 200 `{ "data": <campaign> }` |
| Not-found response | HTTP 404 `NOT_FOUND` via existing `notFound()` helper |
| workspaceId source | URL path parameter via `workspaceContextGuard` only |
| nashirCampaignId source | URL path parameter only; never from request body |

No other Nashir routes are approved by this gate. In particular:
- `GET /workspaces/{workspaceId}/nashir-campaigns` (list) — **NOT APPROVED**
- `POST /workspaces/{workspaceId}/nashir-campaigns` (create) — **NOT APPROVED**
- Any evidence, approval, scoring, or publishing routes — **NOT APPROVED**

## 5. Required Route Handler Pattern

The route handler must follow the existing guard pattern established by all other workspace-scoped routes in `src/router.js`. The implementation must:

1. Extract `workspaceId` via `workspaceContextGuard`.
2. Authenticate via `authGuard`.
3. Check workspace membership via `membershipCheck`.
4. Enforce `nashir.campaign.read` via `permissionGuard`.
5. Extract `nashirCampaignId` from the URL path segment — never from request body.
6. Call `nashirService.getCampaignById({ workspaceId, nashirCampaignId })`.
7. If the result is non-null: return `ok(result)`.
8. If the result is null: throw `notFound()`.
9. Wrap in the existing try/catch/correlationId pattern used by all other route handlers.

### 5.1 Service Wiring in `createRouter`

The router factory must instantiate the Nashir service using constructor injection:

```js
const { createSeedStore } = require("./store");       // already present
const { NashirSlice0Repository } = require("./nashir/backend-slice0-repository");
const { NashirSlice0Service } = require("./nashir/backend-slice0-service");

// Inside createRouter / route factory:
const nashirRepository = new NashirSlice0Repository({ store });
const nashirService = new NashirSlice0Service({ repository: nashirRepository });
```

This uses the already-approved `store.nashirCampaigns` data. No DB access. No pool.

### 5.2 Accepted Paths List

The `acceptedPaths` or equivalent list in `src/router.js` must include:

```text
GET /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}
```

The path must not be added as a catch-all. Only this exact single-resource path is authorized.

## 6. Allowed Files for the Future Implementation PR

| File | Change |
|---|---|
| `src/router.js` | Add route handler for the one approved read-by-id path; add service wiring |
| `test/nashir-prewiring-contract.test.js` | Update Group 1 (`src/router.js has no nashir keyword`) to allow the approved route pattern while keeping all other unauthorized patterns blocked |
| `test/nashir-route.test.js` | New focused behavioral test for the route (see Section 8) |
| `docs/nashir_route_implementation_report.md` | New post-merge implementation report |
| `docs/17_change_log.md` | Add change log entry |
| `docs/03_decision_log.md` | Add implementation decision entry |

No other files are in scope.

## 7. Forbidden Files for the Future Implementation PR

| File / Category | Reason |
|---|---|
| `src/store.js` | Store already has `nashirCampaigns`; no changes needed |
| `src/rbac.js` | `nashir.campaign.read` already implemented via PR #166 |
| `src/server.js` | No server changes needed |
| `src/nashir/backend-slice0-service.js` | Service already implemented via PR #179 |
| `src/nashir/backend-slice0-repository.js` | Repository already implemented via PR #179 |
| `src/config.js` | No config changes needed |
| SQL or migration files | No SQL authorized |
| `docs/nashir_openapi_patch.yaml` | Approved OpenAPI contract must not be modified |
| Any OpenAPI YAML file | No OpenAPI changes authorized |
| `package.json` / lockfiles | No dependency changes |
| `.github/workflows/` | No workflow changes |
| `prototype/` | No prototype changes |

## 8. Required Tests (Prose Description for the Future Implementation PR)

### 8.1 Updated pre-wiring contract test (`test/nashir-prewiring-contract.test.js`)

The existing Group 1 test asserts `src/router.js has no nashir keyword`. Since the route will introduce the `nashir` keyword into `src/router.js`, this test must be updated narrowly:
- Strip only the approved Nashir route pattern (`nashirCampaigns`, `nashirCampaignId`, `NashirSlice0Repository`, `NashirSlice0Service`) before running the keyword check.
- Keep the check that no other unauthorized Nashir keywords appear in `src/router.js`.
- Do not weaken any other guardrails.

### 8.2 New behavioral route test (`test/nashir-route.test.js`)

The focused route test must cover (using a fake router / direct route handler call pattern, not a real HTTP server):

- Route returns HTTP 200 and `{ data: <campaign> }` when the campaign exists in the correct workspace.
- Route returns HTTP 404 when `nashirCampaignId` does not exist.
- Route returns HTTP 404 for cross-workspace access (workspace-b ID with workspace-a context).
- Route returns HTTP 403 or 404 when the caller has no workspace membership.
- Route returns HTTP 403 when the caller lacks `nashir.campaign.read` permission.
- `nashirCampaignId` is always derived from the path, never from the request body.
- `workspace_id` in the response matches the path `workspaceId`.
- No list or create route is registered for Nashir campaigns.
- No write, evidence, or approval route is registered for Nashir.

The test file must not import `src/db.js`, use a real database, or require `DATABASE_URL`.

## 9. Required Acceptance Criteria

The future implementation PR is GO only if ALL of the following are satisfied:

1. `GET /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}` is registered in `src/router.js`.
2. `workspaceContextGuard`, `authGuard`, `membershipCheck`, and `permissionGuard` are all applied.
3. `permissionGuard` checks `nashir.campaign.read`.
4. `nashirCampaignId` is derived from the URL path only.
5. `workspaceId` is derived from the URL path via `workspaceContextGuard` only.
6. Route returns `{ data: campaign }` HTTP 200 for a valid, workspace-scoped lookup.
7. Route returns 404 when `getCampaignById` returns `null`.
8. No list route (`GET /nashir-campaigns`) is registered.
9. No create route (`POST /nashir-campaigns`) is registered.
10. `src/store.js` diff is empty — no store changes in this PR.
11. `src/rbac.js` diff is empty — no RBAC changes in this PR.
12. The pre-wiring contract test is updated to allow the approved route and still passes.
13. All existing tests (185/185 as of PR #179 baseline) still pass.
14. No DB access is present in any Nashir route handler.

## 10. Implementation Prerequisites

Before the future route implementation PR may open, all of the following must be satisfied:

1. **This gate is reviewed and merged** — `docs/nashir_read_route_wiring_gate.md` must be present on main.
2. **Active roadmap guard (PR #155)** — the conditions established in PR #155 must be satisfied.
3. **Repository-level guard (PR #156)** — the conditions established in PR #156 must be satisfied.
4. **PR #179 read-path confirmed** — `NashirSlice0Service.getCampaignById` and `NashirSlice0Repository.findCampaignById` exist and pass all tests.
5. **Latest Strict Verification success** — the most recent CI run on `main` must pass immediately before the route implementation PR opens.
6. **No SQL or DB in scope** — if any DB requirement is discovered during implementation, stop and open a separate gate.
7. **No OpenAPI YAML change in scope** — `docs/nashir_openapi_patch.yaml` must not be modified in the same PR.

## 11. What This Gate Does Not Authorize

Completing this gate and the subsequent route implementation does NOT authorize:

- List route (`GET /nashir-campaigns`).
- Create route (`POST /nashir-campaigns`).
- Any write, evidence, approval, scoring, or publishing Nashir routes.
- `src/rbac.js` changes (RBAC already implemented).
- `src/store.js` changes (store entities already implemented).
- DB-backed Nashir persistence of any kind.
- Any SQL schema change.
- Any OpenAPI YAML change.
- `src/nashir/backend-slice0-service.js` changes (read-path already implemented).
- `src/nashir/backend-slice0-repository.js` changes (read-path already implemented).
- Any `package.json` or workflow change.
- Sprint 5, Pilot, or Production readiness.

The next gate after this route implementation is a **Nashir list and create route gate** (or a write-path service/repository gate, whichever is sequenced next).

## 12. GO / NO-GO Decision

```text
GO:     Documentation-only read route wiring gate.
GO:     Six-step prerequisite sequence steps 1–5 confirmed complete.
GO:     PR #179 read-path (getCampaignById, findCampaignById) confirmed implemented.
GO:     GET /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId} approved for future implementation PR.
GO:     nashir.campaign.read RBAC check required for the route.
GO:     workspaceContextGuard, authGuard, membershipCheck, permissionGuard pattern required.
GO:     NashirSlice0Service constructor injection pattern confirmed.
GO:     Pre-wiring contract test update narrowly approved (approved route pattern only).
NO-GO:  List route (GET /nashir-campaigns) — separately gated.
NO-GO:  Create route (POST /nashir-campaigns) — separately gated.
NO-GO:  Write, evidence, approval, scoring, or publishing routes.
NO-GO:  src/rbac.js modification.
NO-GO:  src/store.js modification.
NO-GO:  OpenAPI YAML modification.
NO-GO:  RBAC expansion.
NO-GO:  SQL or DB access.
NO-GO:  DB-backed Nashir persistence.
NO-GO:  Publishing workflow implementation.
NO-GO:  Package, workflow, or migration changes.
NO-GO:  Prototype usage.
NO-GO:  Sprint 5 coding.
NO-GO:  Pilot readiness.
NO-GO:  Production readiness.
NO-GO:  Any implementation PR without satisfying all seven prerequisites in Section 10.
NO-GO:  Any implementation PR without step 6 (Latest Strict Verification) immediately satisfied.
```
