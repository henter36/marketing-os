# Nashir Service / Repository Implementation Gate (Blocker 4)

## 1. Status

```text
Documentation status:                GO — documentation-only implementation gate.
Blocker 2 (store entities):          RESOLVED — PR #176.
Blocker 4 (service/repo inert):      Active — this gate defines the implementation scope.
Blocker 4 first slice approved:      Read-path only (findCampaignById, getCampaignById).
Write path (saveCampaign):           Deferred — separately gated after read path verified.
Evidence methods:                    Deferred — no evidence store exists yet.
Route exposure:                      NO-GO.
Runtime wiring (router/server):      NO-GO.
src/router.js modification:          NO-GO.
SQL / DB access:                     NO-GO.
OpenAPI YAML changes:                NO-GO.
RBAC expansion:                      NO-GO.
DB-backed Nashir persistence:        NO-GO.
Publishing workflow implementation:  NO-GO.
Package / workflow / migration:      NO-GO.
Prototype:                           NO-GO.
Sprint 5:                            NO-GO.
Pilot:                               NO-GO.
Production:                          NO-GO.
```

## 2. Purpose

This document is a documentation-only implementation gate. It records the current Nashir state after PRs #175, #176, and #177, confirms Blocker 2 closure, and defines the exact scope, allowed files, forbidden files, acceptance criteria, and required tests for the Blocker 4 first-slice implementation PR.

This document does not:
- Implement any code.
- Register any Nashir route.
- Authorize DB access or SQL changes.
- Authorize OpenAPI YAML changes.
- Authorize RBAC expansion.
- Authorize publishing workflow implementation.
- Authorize runtime wiring of any kind.

## 3. Context After PRs #175 – #177

### 3.1 Governance Chain

| PR | Purpose | State |
|---|---|---|
| #161 | Nashir runtime wiring readiness gate | Identified four runtime blockers |
| #166 | Nashir RBAC permission codes | **Blocker 1 resolved** — four codes in `src/rbac.js` |
| #168 | Nashir OpenAPI patch | **Blocker 3 resolved** — `docs/nashir_openapi_patch.yaml` added |
| #175 | Nashir store entities implementation gate | Approved Option A; defined Blocker 2 scope |
| #176 | Nashir store entities implementation | **Blocker 2 resolved** — `store.nashirCampaigns` added to `src/store.js` |
| #177 | Nashir approval archive transitions | Reconciled approval state machine archive rows (PR #105 remediation) |

### 3.2 Current Blocker Status

| # | Blocker | Location | State |
|---|---|---|---|
| 1 | No Nashir permission codes | `src/rbac.js` | **RESOLVED — PR #166** |
| 2 | No Nashir store entities | `src/store.js` | **RESOLVED — PR #176** |
| 3 | No Nashir OpenAPI path | OpenAPI contract | **RESOLVED — PR #168** |
| 4 | Service/repository methods inert | `src/nashir/backend-slice0-*.js` | **Active — this gate defines Blocker 4 first slice** |

Resolving Blocker 4 via this gate is required before runtime route wiring can be considered. Route wiring remains NO-GO until a separately approved route wiring gate is opened after Blocker 4 is resolved.

### 3.3 Current Skeleton State

`src/nashir/backend-slice0-service.js` exports `NashirSlice0Service` with these methods, all throwing `new Error("not implemented")`:
- `createCampaign(campaignData)`
- `getCampaignById(id)`
- `scoreReadiness(id)`
- `submitForApproval(id)`
- `recordManualEvidence(id, evidenceData)`

`src/nashir/backend-slice0-repository.js` exports `NashirSlice0Repository` with these methods, all throwing `new Error("not implemented")`:
- `findCampaignById(id)`
- `saveCampaign(campaign)`
- `findEvidenceById(id)`
- `saveEvidence(evidence)`

Neither file has a constructor, no `require()` calls, no IO, no DB access, and no router/server/store references.

### 3.4 Available Store Data

`store.nashirCampaigns` (added by PR #176) contains two workspace-scoped seed entities:

| Field | Values |
|---|---|
| `nashir_campaign_id` | UUID format, distinct from existing `campaign_id` values |
| `workspace_id` | `"workspace-a"` and `"workspace-b"` |
| `campaign_name` | `"Intake Campaign A"` and `"Intake Campaign B"` |
| `campaign_status` | `"draft"` |
| `created_by_user_id` | `"user-owner-a"` |
| `created_at` / `updated_at` | ISO 8601 strings |

## 4. First Implementation Slice Decision

**Approved Blocker 4 first slice:** Read-path only — implement `findCampaignById` on the repository and `getCampaignById` on the service.

**Rationale:**
1. The store provides a concrete, workspace-scoped `nashirCampaigns` collection to read against.
2. Read-path is lower risk than write-path: no mutation of store state, no persistence concerns.
3. Implementing `getCampaignById` end-to-end (service → repository → store) proves the service/repository contract boundary without touching routing, SQL, or DB.
4. Evidence methods (`findEvidenceById`, `saveEvidence`) and approval methods (`submitForApproval`) remain inert: no evidence store exists yet; deferring these to a subsequent gate is the correct sequencing.
5. Write path (`saveCampaign`, `createCampaign`) is deferred to a subsequent gate after the read path is verified.

**Deferred to later gates:**
- `saveCampaign` / `createCampaign` — write path; requires careful idempotency and audit design.
- `scoreReadiness` — requires readiness scoring contract alignment.
- `submitForApproval` — requires approval state machine integration.
- `recordManualEvidence` / `findEvidenceById` / `saveEvidence` — requires an evidence store layer.

## 5. Approved Blocker 4 First-Slice Scope

### 5.1 NashirSlice0Repository — `findCampaignById`

The implementation PR must add a constructor that accepts `{ store }` and implement `findCampaignById` as follows:

- **Signature:** `async findCampaignById({ workspaceId, nashirCampaignId })`
- **Behavior:** filter `store.nashirCampaigns` by both `workspace_id === workspaceId` AND `nashir_campaign_id === nashirCampaignId`.
- **Return:** the matching entity object if found; `null` if not found.
- **Tenant isolation:** `workspaceId` is always supplied by the caller; the repository must never look up a campaign without scoping to the caller-supplied `workspaceId`.
- **No cross-workspace leakage:** an entity from workspace-b must never be returned for a workspace-a caller.
- **No DB access:** reads only from `store.nashirCampaigns`.
- **No route registration:** the repository is not wired to `src/router.js`.

All other methods (`saveCampaign`, `findEvidenceById`, `saveEvidence`) must continue to throw `new Error("not implemented")`.

### 5.2 NashirSlice0Service — `getCampaignById`

The implementation PR must add a constructor that accepts `{ repository }` and implement `getCampaignById` as follows:

- **Signature:** `async getCampaignById({ workspaceId, nashirCampaignId })`
- **Behavior:** delegate to `this.repository.findCampaignById({ workspaceId, nashirCampaignId })`.
- **Return:** the entity object returned by the repository, or `null` if not found.
- **No business logic beyond delegation in this slice.**
- **No route registration:** the service is not wired to `src/router.js`.

All other methods (`createCampaign`, `scoreReadiness`, `submitForApproval`, `recordManualEvidence`) must continue to throw `new Error("not implemented")`.

### 5.3 Constructor Injection

| Module | Constructor argument | Purpose |
|---|---|---|
| `NashirSlice0Repository` | `{ store }` | Provides access to `store.nashirCampaigns` |
| `NashirSlice0Service` | `{ repository }` | Provides access to `NashirSlice0Repository` instance |

Factory functions (`createNashirSlice0Repository`, `createNashirSlice0Service`) should be updated accordingly.

## 6. Allowed Files for the Future Implementation PR

| File | Change |
|---|---|
| `src/nashir/backend-slice0-repository.js` | Add `{ store }` constructor; implement `findCampaignById({ workspaceId, nashirCampaignId })`; all other methods remain inert |
| `src/nashir/backend-slice0-service.js` | Add `{ repository }` constructor; implement `getCampaignById({ workspaceId, nashirCampaignId })`; all other methods remain inert |
| `test/nashir-slice0-service-repository-skeleton.test.js` | Update skeleton tests to reflect new constructor and the two implemented methods; preserve inertness checks for remaining stub methods |
| `test/nashir-service-repository.test.js` | New focused behavioral test (see Section 8) |
| `docs/nashir_service_repository_implementation_report.md` | New post-merge implementation report |
| `docs/17_change_log.md` | Add change log entry |
| `docs/03_decision_log.md` | Add implementation decision entry |

No other files are in scope.

## 7. Forbidden Files for the Future Implementation PR

| File / Category | Reason |
|---|---|
| `src/router.js` | Route registration is a subsequent gate |
| `src/server.js` | No server changes needed |
| `src/store.js` | Store layer already added by PR #176; no further store changes authorized |
| `src/rbac.js` | RBAC codes already implemented; no changes needed |
| `src/config.js` | No config changes needed for service/repository implementation |
| SQL or migration files | No SQL authorized |
| `docs/nashir_openapi_patch.yaml` | Approved OpenAPI contract must not be modified |
| Any OpenAPI YAML file | No OpenAPI changes authorized |
| `package.json` / lockfiles | No dependency changes |
| `.github/workflows/` | No workflow changes |
| `prototype/` | No prototype changes |

## 8. Required Tests (Prose Description — Do Not Create or Modify Test Files)

The implementation PR must include or update tests covering:

### 8.1 Updated skeleton tests (`test/nashir-slice0-service-repository-skeleton.test.js`)

- `createNashirSlice0Repository({ store: fakeStore })` does not throw.
- `createNashirSlice0Service({ repository: fakeRepo })` does not throw.
- `NashirSlice0Repository` still exports the expected method surface.
- `NashirSlice0Service` still exports the expected method surface.
- All stub methods (`saveCampaign`, `findEvidenceById`, `saveEvidence` on repository; `createCampaign`, `scoreReadiness`, `submitForApproval`, `recordManualEvidence` on service) still throw `new Error("not implemented")`.

### 8.2 New behavioral tests (`test/nashir-service-repository.test.js`)

- Repository returns the matching entity when `nashir_campaign_id` and `workspace_id` both match a seed record.
- Repository returns `null` when `nashir_campaign_id` does not exist.
- Repository returns `null` for a valid `nashir_campaign_id` supplied with the wrong `workspaceId` (cross-workspace isolation).
- Service `getCampaignById` delegates to repository and returns the entity.
- Service `getCampaignById` returns `null` when repository returns `null`.
- No router, server, db, rbac, or guards modules are imported by the test file.

## 9. Required Acceptance Criteria

The future implementation PR is GO only if ALL of the following are satisfied:

1. `NashirSlice0Repository` constructor accepts `{ store }`.
2. `findCampaignById({ workspaceId, nashirCampaignId })` returns the matching entity from `store.nashirCampaigns` when both keys match, `null` otherwise.
3. Cross-workspace lookup returns `null` — entities from one workspace are never returned for a different workspace.
4. `NashirSlice0Service` constructor accepts `{ repository }`.
5. `getCampaignById({ workspaceId, nashirCampaignId })` delegates to `this.repository.findCampaignById` and returns the result.
6. All remaining methods (`saveCampaign`, `findEvidenceById`, `saveEvidence`, `createCampaign`, `scoreReadiness`, `submitForApproval`, `recordManualEvidence`) still throw `new Error("not implemented")`.
7. No Nashir route is registered in `src/router.js`.
8. No Nashir keyword appears in `src/router.js` or `src/server.js`.
9. No DB connection, pool, or query is present in either Nashir file.
10. All existing tests (159/159 as of PR #177 baseline) still pass.
11. `src/store.js` diff is empty — store layer is not modified by this PR.
12. The pre-wiring contract test `src/store.js references nashir only via the approved store entities` still passes without modification.

## 10. Implementation Prerequisites

Before the future implementation PR may open, all of the following must be satisfied:

1. **This gate is reviewed** — `docs/nashir_service_repository_gate.md` must be merged and present on main.
2. **Active roadmap guard (PR #155)** — the conditions established in PR #155 must be satisfied.
3. **Repository-level guard (PR #156)** — the conditions established in PR #156 must be satisfied.
4. **Blocker 2 confirmed resolved** — `store.nashirCampaigns` exists in `src/store.js` (verified by PR #176).
5. **No SQL in scope** — if the implementation discovers a need for SQL, it must stop and open a separate SQL gate PR.
6. **No route registration in scope** — if the implementation reveals a need to register a route, it must stop and open a separate route wiring gate PR.
7. **Latest Strict Verification success** — the most recent CI run on `main` must pass before the implementation PR opens.

## 11. What This Gate Does Not Authorize

Completing this gate and the subsequent Blocker 4 first-slice implementation does NOT authorize:

- Route exposure for any Nashir endpoint.
- `src/router.js` modification.
- Any SQL schema change or migration.
- Any OpenAPI YAML change.
- RBAC expansion beyond the four approved codes.
- DB-backed Nashir persistence.
- Publishing workflow implementation.
- `createCampaign` or `saveCampaign` implementation (write path deferred).
- Evidence method implementation (`recordManualEvidence`, `findEvidenceById`, `saveEvidence` deferred).
- `scoreReadiness` or `submitForApproval` implementation (deferred).
- Any `package.json` or workflow change.
- Sprint 5, Pilot, or Production readiness.

The next gate after this implementation is a **Nashir write-path and route wiring gate**, which will define how write operations and route registration are sequenced.

## 12. GO / NO-GO Decision

```text
GO:     Documentation-only Blocker 4 first-slice implementation gate.
GO:     Blocker 2 confirmed resolved by PR #176.
GO:     Blocker 4 read-path approved: findCampaignById and getCampaignById.
GO:     Constructor injection pattern defined ({ store } for repo, { repository } for service).
GO:     Tenant isolation requirement explicit (workspaceId always caller-supplied).
GO:     Write path (saveCampaign, createCampaign) deferred to subsequent gate.
GO:     Evidence methods deferred to subsequent gate.
NO-GO:  Route exposure.
NO-GO:  src/router.js modification.
NO-GO:  SQL or DB access.
NO-GO:  OpenAPI YAML modification.
NO-GO:  RBAC expansion.
NO-GO:  DB-backed Nashir persistence.
NO-GO:  Publishing workflow implementation.
NO-GO:  Package, workflow, or migration changes.
NO-GO:  Prototype usage.
NO-GO:  Sprint 5 coding.
NO-GO:  Pilot readiness.
NO-GO:  Production readiness.
NO-GO:  Any implementation PR without satisfying all seven prerequisites in Section 10.
NO-GO:  Any implementation PR without satisfying PR #155 and PR #156 guard conditions.
```
