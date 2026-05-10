# Nashir Runtime Wiring Readiness Gate

## 1. Status

```text
Documentation status:    GO — documentation-only readiness gate.
Service skeleton:        GO — src/nashir/backend-slice0-service.js exists; inert only.
Repository skeleton:     GO — src/nashir/backend-slice0-repository.js exists; inert only.
Focused skeleton tests:  GO — test/nashir-slice0-service-repository-skeleton.test.js exists.
Runtime wiring:          NO-GO.
Route exposure:          NO-GO.
SQL activation:          NO-GO.
OpenAPI activation:      NO-GO.
DB access:               NO-GO.
RBAC enforcement:        NO-GO.
Audit runtime:           NO-GO.
ErrorModel runtime:      NO-GO.
Generated clients:       NO-GO.
Package / workflow:      NO-GO.
Migration:               NO-GO.
Prototype:               NO-GO.
Pilot:                   NO-GO.
Production:              NO-GO.
```

## 2. Purpose

This document is a documentation-only gate. It records the exact post-PR #160 Nashir state, defines the unresolved future question about runtime wiring and route exposure, states that this PR does not approve any runtime wiring or route exposure, and defines prerequisites that must be satisfied before any future runtime PR may open.

This document does not approve:
- Any runtime wiring (router, server, store, DB, RBAC, guards, config).
- Any route exposure.
- Any SQL or OpenAPI activation.
- Any RBAC enforcement, audit runtime, or ErrorModel runtime.
- Any package, workflow, or migration change.
- Any generated client update.
- Any prototype usage.
- Pilot readiness.
- Production readiness.

## 3. Inspected Post-PR #160 State

The following is the confirmed Nashir artifact state as of PR #160.

| Artifact | Path | State |
|---|---|---|
| Inert backend Slice 0 planning contract | `src/nashir/backend-slice0-planning.js` | Exists — inert constants only; no runtime behavior |
| Inert service skeleton | `src/nashir/backend-slice0-service.js` | Exists — async stub methods only; throws "not implemented" |
| Inert repository skeleton | `src/nashir/backend-slice0-repository.js` | Exists — async stub methods only; throws "not implemented" |
| Planning contract tests | `test/nashir-slice0-planning-contract.test.js` | Exists — focused contract-only tests |
| Skeleton tests | `test/nashir-slice0-service-repository-skeleton.test.js` | Exists — focused inertness tests |

### 3.1 Service Skeleton Surface (Inert)

`src/nashir/backend-slice0-service.js` exports `NashirSlice0Service` with five async stub methods:

- `async createCampaign(campaignData)` — throws "not implemented"
- `async getCampaignById(id)` — throws "not implemented"
- `async scoreReadiness(id)` — throws "not implemented"
- `async submitForApproval(id)` — throws "not implemented"
- `async recordManualEvidence(id, evidenceData)` — throws "not implemented"

And `createNashirSlice0Service()` factory returning a new instance.

No `require()` calls, no IO, no DB access, no router/server/store/db/rbac/guards/error-model references, no global state mutation, no external package dependencies.

### 3.2 Repository Skeleton Surface (Inert)

`src/nashir/backend-slice0-repository.js` exports `NashirSlice0Repository` with four async stub methods:

- `async findCampaignById(id)` — throws "not implemented"
- `async saveCampaign(campaign)` — throws "not implemented"
- `async findEvidenceById(id)` — throws "not implemented"
- `async saveEvidence(evidence)` — throws "not implemented"

And `createNashirSlice0Repository()` factory returning a new instance.

No `require()` calls, no IO, no DB access, no router/server/store/db/rbac/guards/error-model references, no global state mutation, no external package dependencies.

### 3.3 What Does Not Exist

| Category | State |
|---|---|
| Route exposure | None |
| Router / server / store wiring | None |
| SQL schema or migration | None |
| OpenAPI definition for Nashir | None |
| DB access in any skeleton file | None |
| RBAC enforcement | None |
| Audit event runtime | None |
| ErrorModel runtime | None |
| Generated clients | None |
| Package script changes | None |
| Workflow changes | None |
| Migration runner changes | None |
| Prototype usage | None |
| Pilot readiness | None |
| Production readiness | None |

## 4. Unresolved Future Question

> **Should a future PR introduce any runtime wiring or route exposure for Nashir?**

This question is not resolved by this document. It is not answered YES. It is not answered NO. It is recorded here as an open question that requires a separately approved gate document before any future runtime PR may open.

No stakeholder, no prior gate document, and no prior merged PR has approved runtime wiring or route exposure for Nashir. This gate does not fill that gap.

## 5. Prerequisites Before Any Future Runtime PR

Before any PR that touches runtime wiring, router wiring, server wiring, store wiring, or route exposure for Nashir may open, all of the following must be satisfied and documented in a separately approved gate:

1. **Exact first endpoint or route surface** — the specific route path, HTTP method, and handler contract must be defined and approved before any router or server file is modified.

2. **OpenAPI decision before route exposure** — the corresponding OpenAPI path, request/response schema, and error responses must be approved before any route is exposed. OpenAPI activation for Nashir is separately gated.

3. **RBAC permission mapping** — the exact permission code, role, and deny behavior for each route must be mapped and approved, referencing `docs/nashir_permission_codes_and_qa_case_specification.md` and `docs/nashir_role_permission_matrix.md`.

4. **ErrorModel mapping** — the exact `ErrorModel` codes, HTTP status codes, and payload shapes for each failure path must be defined and approved, referencing `docs/nashir_audit_errormodel_material_change_specification.md`.

5. **Audit event mapping** — the exact audit event names, payload fields, and trigger conditions must be mapped and approved, referencing `docs/nashir_audit_errormodel_material_change_specification.md`.

6. **Repository/service behavior boundary** — the exact contract boundary between `NashirSlice0Service` and `NashirSlice0Repository` must be resolved: which methods a route may call, what inputs are validated at which layer, and what errors are propagated.

7. **No SQL unless separately approved** — no SQL schema change, migration, or DB query may be added without a separately approved SQL gate. The skeleton files have no DB access; any change to that must be separately gated.

8. **No DB access unless separately approved** — no DB connection, pool, or query may be introduced without a separately approved DB gate.

9. **Focused tests** — a proposed test plan covering the new route behavior, RBAC denial, ErrorModel response, and audit event emission must be defined before implementation and verified as part of the merged PR.

10. **Rollback / no-go criteria** — explicit rollback steps and no-go triggers must be defined before implementation. The gate document must name conditions under which the PR is reverted.

11. **Latest Strict Verification success** — the most recent Strict Verification run on main must pass before any runtime PR opens.

## 6. Candidate Future Paths (NOT APPROVED)

The following files are candidate future paths for runtime wiring. They are listed here for planning reference only. None of them are approved for modification by this document. Each requires a separately approved gate before modification.

| File | Category | Status |
|---|---|---|
| `src/router.js` | Router wiring | NOT APPROVED |
| `src/server.js` | Server wiring | NOT APPROVED |
| `src/store.js` | Store wiring | NOT APPROVED |
| `src/nashir/backend-slice0-service.js` | Service implementation | NOT APPROVED |
| `src/nashir/backend-slice0-repository.js` | Repository implementation | NOT APPROVED |
| OpenAPI docs (separately gated) | OpenAPI activation | NOT APPROVED |
| Tests (separately gated) | Focused runtime tests | NOT APPROVED |

## 7. Explicit NO-GO List

The following are explicitly NO-GO for this PR and for any future Nashir PR unless a separately approved gate document permits each item individually:

- Runtime wiring of any kind (router, server, store, DB, RBAC, guards, config).
- Route exposure — no Nashir route may be registered in `src/router.js` or any other router file.
- SQL — no SQL schema change, migration, or query.
- OpenAPI activation — no Nashir path or schema added to the active OpenAPI contract.
- DB access — no connection, pool, or query in any Nashir file.
- RBAC enforcement — no permission check called at runtime.
- Audit runtime — no audit event emitted at runtime.
- ErrorModel runtime — no ErrorModel response constructed and returned at runtime.
- Generated clients — no generated client update.
- Package changes — no `package.json`, `package-lock.json`, or dependency change.
- Workflow changes — no CI/CD workflow modification.
- Migration changes — no migration file added or modified.
- Prototype — no `prototype/` file usage or modification.
- Pilot readiness — not approved.
- Production readiness — not approved.

## 8. Required Guards

### 8.1 Active Roadmap Guard — PR #155

PR #155 is the required Nashir active roadmap guard. No new Nashir PR may proceed without satisfying the conditions established in PR #155.

### 8.2 Repository-Level Guard — PR #156

PR #156 is the required repository roadmap index and governance guard. No PR of any kind may proceed without satisfying the conditions established in PR #156.

## 9. GO / NO-GO Decision

```text
GO:     Documentation-only runtime wiring readiness gate.
GO:     Post-PR #160 Nashir state inspection complete.
GO:     Inert planning contract confirmed at src/nashir/backend-slice0-planning.js.
GO:     Inert service skeleton confirmed at src/nashir/backend-slice0-service.js.
GO:     Inert repository skeleton confirmed at src/nashir/backend-slice0-repository.js.
GO:     Focused tests confirmed at test/nashir-slice0-planning-contract.test.js.
GO:     Focused skeleton tests confirmed at test/nashir-slice0-service-repository-skeleton.test.js.
GO:     Unresolved future question recorded — runtime wiring not answered YES or NO.
GO:     Prerequisites for any future runtime PR defined.
GO:     Candidate future paths listed as NOT APPROVED.
GO:     Explicit NO-GO list recorded.
NO-GO:  Runtime wiring.
NO-GO:  Route exposure.
NO-GO:  SQL activation.
NO-GO:  OpenAPI activation.
NO-GO:  DB access.
NO-GO:  RBAC enforcement.
NO-GO:  Audit runtime.
NO-GO:  ErrorModel runtime.
NO-GO:  Generated clients.
NO-GO:  Package or workflow changes.
NO-GO:  Migration changes.
NO-GO:  Prototype usage.
NO-GO:  Pilot readiness.
NO-GO:  Production readiness.
NO-GO:  Any modification to src/router.js, src/server.js, or src/store.js for Nashir.
NO-GO:  Any modification to src/nashir/backend-slice0-service.js beyond the existing inert skeleton.
NO-GO:  Any modification to src/nashir/backend-slice0-repository.js beyond the existing inert skeleton.
NO-GO:  Any next Nashir PR without satisfying PR #155 and PR #156 guard conditions.
NO-GO:  Any next Nashir PR involving runtime wiring or route exposure without a separately approved gate.
```
