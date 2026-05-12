# Nashir Status After OpenAPI Patch (Post-PR #168)

## 1. Status

```text
Documentation status:              GO — documentation-only status reconciliation.
Nashir OpenAPI patch:              GO — docs/nashir_openapi_patch.yaml exists (documentation-only).
Nashir RBAC permission codes:      GO — four approved codes in src/rbac.js (PR #166).
Contract tests:                    GO — test/nashir-openapi-contract.test.js exists and passes.
Pre-wiring contract tests:         GO — test/nashir-prewiring-contract.test.js exists and passes.
Blocker 1 (RBAC):                  RESOLVED — PR #166.
Blocker 3 (OpenAPI):               RESOLVED — PR #168.
Blocker 2 (store entities):        Active — separately gated.
Blocker 4 (service/repo methods):  Active — separately gated.
Route exposure:                    NO-GO.
Runtime wiring:                    NO-GO.
src/router.js modification:        NO-GO.
src/store.js Nashir entities:      NO-GO — separately gated.
Service/repository implementation: NO-GO — separately gated.
SQL / DB access:                   NO-GO.
Generated client update:           NO-GO.
Audit runtime:                     NO-GO.
ErrorModel runtime:                NO-GO.
Package / workflow / migration:    NO-GO.
Prototype usage:                   NO-GO.
Pilot:                             NO-GO.
Production:                        NO-GO.
```

## 2. Purpose

This document records the exact Nashir state after PR #168 merged. It is a documentation-only status record. It does not authorize any implementation, runtime wiring, route exposure, SQL activation, RBAC enforcement, service or repository method implementation, audit runtime, ErrorModel runtime, Pilot readiness, or Production readiness.

## 3. What Exists

| Artifact | Path | State |
|---|---|---|
| Inert backend Slice 0 planning contract | `src/nashir/backend-slice0-planning.js` | Exists — inert constants only; no runtime behavior |
| Inert service skeleton | `src/nashir/backend-slice0-service.js` | Exists — all methods throw `new Error("not implemented")` |
| Inert repository skeleton | `src/nashir/backend-slice0-repository.js` | Exists — all methods throw `new Error("not implemented")` |
| Nashir RBAC permission codes | `src/rbac.js` | Exists — 4 approved codes in `permissions` and `rolePermissions` |
| Nashir OpenAPI patch | `docs/nashir_openapi_patch.yaml` | Exists — documentation-only contract patch |
| Planning contract tests | `test/nashir-slice0-planning-contract.test.js` | Exists and passes |
| Skeleton tests | `test/nashir-slice0-service-repository-skeleton.test.js` | Exists and passes |
| RBAC mapping tests | `test/nashir-rbac-permission-mapping.test.js` | Exists and passes |
| OpenAPI contract tests | `test/nashir-openapi-contract.test.js` | Exists and passes |
| Pre-wiring contract tests | `test/nashir-prewiring-contract.test.js` | Exists and passes |

### 3.1 Nashir OpenAPI Patch Surface

`docs/nashir_openapi_patch.yaml` documents these candidate operations (documentation-only — no routes activated):

| Operation | Path | x-permission |
|---|---|---|
| `listNashirCampaigns` | `GET /workspaces/{workspaceId}/nashir-campaigns` | `nashir.campaign.read` |
| `createNashirCampaign` | `POST /workspaces/{workspaceId}/nashir-campaigns` | `nashir.campaign.write` |
| `getNashirCampaign` | `GET /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}` | `nashir.campaign.read` |

This is a documentation-only contract patch. It does not register routes in `src/router.js`, expose endpoints, or authorize any runtime wiring.

### 3.2 Approved Nashir RBAC Permission Codes

Four codes are implemented in `src/rbac.js` (PR #166):

- `nashir.campaign.read`
- `nashir.campaign.write`
- `nashir.evidence.submit`
- `nashir.approval.decide`

Three secondary candidate codes (`nashir.evidence.read`, `nashir.approval.read`, `nashir.intake.create`) remain NOT APPROVED pending resolution of the open governance questions in `docs/nashir_rbac_implementation_scope_gate.md`.

## 4. Remaining Blockers

| # | Blocker | Location | State |
|---|---|---|---|
| 1 | No Nashir permission codes | `src/rbac.js` | **RESOLVED — PR #166** |
| 2 | No Nashir store entities | `src/store.js` | **Still active — separately gated** |
| 3 | No Nashir OpenAPI path | OpenAPI contract | **RESOLVED — PR #168** |
| 4 | Service/repository methods inert | `src/nashir/backend-slice0-*.js` | **Still active — separately gated** |

Blockers 2 and 4 must be resolved through separately approved gates before any Nashir route can be exposed.

## 5. What Does Not Exist

| Category | State |
|---|---|
| Nashir route registered in `src/router.js` | None |
| Nashir store entities in `src/store.js` | None |
| Service method implementation beyond "not implemented" | None |
| Repository method implementation beyond "not implemented" | None |
| DB-backed Nashir persistence | None |
| SQL schema changes for Nashir | None |
| Generated client updates | None |
| Workflow changes | None |
| Prototype usage | None |

## 6. Required Guards Before Any Next Implementation PR

### 6.1 Active Roadmap Guard — PR #155

PR #155 is the required Nashir active roadmap guard. No new Nashir implementation PR may proceed without satisfying the conditions established in PR #155.

### 6.2 Repository-Level Guard — PR #156

PR #156 is the required repository roadmap index and governance guard. No PR of any kind may proceed without satisfying the conditions established in PR #156.

### 6.3 Separate Gate Required for Next Steps

Any PR that involves any of the following must go through a separately approved gate before implementation begins:

- Nashir store entities in `src/store.js`
- Service or repository method implementation (replacing "not implemented" stubs)
- Runtime wiring (`src/router.js`, `src/server.js`, `src/store.js`)
- Route exposure
- SQL or DB access
- Generated client updates

No such gate is approved by this document.

## 7. Verification Summary

This document is documentation-only. No changes were made to:

- `src/**` — no runtime changes
- `test/**` — no test changes
- `scripts/**` — no script changes
- SQL schema or migration files
- OpenAPI YAML files (including `docs/nashir_openapi_patch.yaml`)
- `package.json`, `package-lock.json`, or lock files
- `.github/workflows/**`
- `prototype/**`

No implementation is authorized by this document.

## 8. GO / NO-GO Decision

```text
GO:     Documentation-only status reconciliation after PR #168.
GO:     Nashir OpenAPI patch exists at docs/nashir_openapi_patch.yaml (documentation-only contract).
GO:     Four Nashir RBAC permission codes exist in src/rbac.js.
GO:     Nashir contract tests and pre-wiring tests exist and pass.
GO:     Blocker 1 (RBAC) confirmed resolved by PR #166.
GO:     Blocker 3 (OpenAPI) confirmed resolved by PR #168.
GO:     Remaining Blocker 2 (store entities) and Blocker 4 (inert methods) recorded as active.
NO-GO:  Route exposure.
NO-GO:  Runtime wiring.
NO-GO:  src/router.js modification.
NO-GO:  src/store.js Nashir entity addition without a separately approved gate.
NO-GO:  Nashir service or repository method implementation without a separately approved gate.
NO-GO:  SQL or DB access.
NO-GO:  Generated client update unless separately approved.
NO-GO:  Audit runtime.
NO-GO:  ErrorModel runtime.
NO-GO:  Package, workflow, or migration changes.
NO-GO:  Prototype usage.
NO-GO:  Pilot readiness.
NO-GO:  Production readiness.
NO-GO:  Any next Nashir PR without satisfying PR #155 and PR #156 guard conditions.
```
