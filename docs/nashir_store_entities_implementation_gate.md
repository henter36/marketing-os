# Nashir Store Entities Implementation Gate

## 1. Status

```text
Documentation status:              GO — documentation-only implementation gate.
Option A (store entities):         APPROVED for future implementation PR.
Option B (service/repo methods):   Deferred — requires store layer first; separately gated.
Option C (repository-backed):      NO-GO — requires SQL schema not yet approved.
Route exposure:                    NO-GO — separately gated.
Runtime wiring:                    NO-GO.
src/router.js modification:        NO-GO.
Service/repository implementation: NO-GO — separately gated after this gate.
SQL / DB access:                   NO-GO.
Generated client update:           NO-GO.
Package / workflow / migration:    NO-GO.
Prototype:                         NO-GO.
Pilot:                             NO-GO.
Production:                        NO-GO.
```

## 2. Purpose

This document is a documentation-only implementation gate after PR #174. It records the current Nashir state, compares three candidate first-implementation options, selects Option A (add Nashir in-memory store entities to `src/store.js`) as the approved first implementation slice, and defines the exact scope, allowed files, forbidden files, acceptance criteria, required tests, and prerequisites for the future implementation PR.

This document does not:
- Implement any code.
- Register any Nashir route.
- Authorize service or repository method implementation.
- Authorize SQL schema changes.
- Authorize DB-backed Nashir persistence.
- Authorize runtime wiring of any kind.

## 3. Context

### 3.1 Governance Chain

| PR | Purpose | State |
|---|---|---|
| #161 | Nashir runtime wiring readiness gate | Identified four runtime blockers |
| #166 | Nashir RBAC permission codes | **Blocker 1 resolved**: four codes in `src/rbac.js` |
| #167 | Nashir OpenAPI implementation scope gate | Documented Blocker 3 (OpenAPI) as active; defined prerequisites |
| #168 | Nashir OpenAPI patch | **Blocker 3 resolved**: `docs/nashir_openapi_patch.yaml` added |
| #174 | Nashir post-PR #168 status reconciliation | Confirmed Blockers 2 and 4 remain; refreshed change log |

### 3.2 Remaining Blockers

| # | Blocker | Location | State |
|---|---|---|---|
| 1 | No Nashir permission codes | `src/rbac.js` | **RESOLVED — PR #166** |
| 2 | No Nashir store entities | `src/store.js` | **Active — this gate addresses Blocker 2** |
| 3 | No Nashir OpenAPI path | OpenAPI contract | **RESOLVED — PR #168** |
| 4 | Service/repository methods inert | `src/nashir/backend-slice0-*.js` | Active — separately gated after Blocker 2 |

Resolving Blocker 2 via this gate is a required step before route wiring can be considered. Blocker 4 (implement service/repository methods) becomes the next gate after Blocker 2 is resolved.

### 3.3 Existing Store Architecture

The current `src/store.js` is the Patch 002-era store. It layers on top of `src/store_sprint3.js` which layers on top of root `store.js`. The root `store.js` owns the base `campaigns` array used by existing routes. Nashir uses a distinct path (`/nashir-campaigns`) and a distinct identifier (`nashir_campaign_id`), so Nashir entities must live in a separate `nashirCampaigns` collection — they must not be conflated with the existing `campaigns` array.

## 4. Option Analysis

### Option A — Add Nashir in-memory store entities to `src/store.js`

**Allowed changes:** Add a `nashirCampaigns` array to the `createSeedStore()` function in `src/store.js`, with two workspace-scoped seed records (one for `workspace-a`, one for `workspace-b`).

| Criterion | Assessment |
|---|---|
| Directly resolves active blocker | YES — resolves Blocker 2 per the approved gate structure |
| Requires SQL / DB schema | NO — in-memory only |
| Follows established pattern | YES — all Patch 002 entities (connectors, contacts, lead_captures, etc.) follow the same store.field \|\|= [...] pattern in `src/store.js` |
| Risk | Low — additive only; no existing behavior changed |
| Enables next step | YES — once the store layer exists, service/repository method implementation (Blocker 4) can be specified with a concrete data contract |
| Route wiring included | NO — route wiring is a separate gate |

**Verdict: Recommended — lowest risk, directly resolves Blocker 2, sets up the data contract for Blocker 4.**

---

### Option B — Implement service/repository methods first (without store)

**Proposed changes:** Implement the stubs in `src/nashir/backend-slice0-service.js` and `src/nashir/backend-slice0-repository.js` before adding a store or DB layer.

| Criterion | Assessment |
|---|---|
| Resolves a blocker | Partially — addresses Blocker 4, but Blocker 2 remains |
| Data contract defined | NO — without knowing the backing store, method implementations are speculative |
| Risk | Medium-High — the service/repo signatures need `workspaceId` for tenant isolation, and validation rules need a stable entity shape; implementing before the data layer means the signatures may change when the store (or DB) is added |
| Enables route wiring | NO — routes require both the store layer and service/repo implementation |

**Verdict: Deferred — premature without a backing data layer; must come after Option A.**

---

### Option C — Bypass in-memory store; go DB-backed from day one

**Proposed changes:** Implement `NashirSlice0Repository` using a live `pool.query` against a `nashir_campaigns` SQL table, following the DB-backed repository pattern used by `BrandProfileRepository`.

| Criterion | Assessment |
|---|---|
| Resolves blockers | Would address Blockers 2 and 4 together |
| Requires SQL schema | YES — a `nashir_campaigns` table does not exist in any approved migration; creating one requires a new SQL migration PR |
| Requires new migration | YES — forbidden by current gate scope |
| Requires approved ERD patch | YES — `docs/nashir_erd_patch_proposal.md` proposes reuse-only (no new entities); a `nashir_campaigns` table with `nashir_campaign_id` is a NEW entity not yet approved |
| Risk | High — blocked by SQL schema gate, ERD gate, and migration gate |

**Verdict: NO-GO — cannot proceed without a separately approved SQL schema, ERD patch, and migration. Not in scope for this gate.**

---

## 5. Decision: Option A

**Approved first implementation slice:** Add `nashirCampaigns` in-memory store entities to `src/store.js`.

**Rationale:**
1. Directly resolves Blocker 2 without any SQL, DB, migration, or OpenAPI changes.
2. Follows the exact same additive `store.field ||= [...]` pattern used for all Patch 002 entities.
3. Establishes a stable entity shape (`nashir_campaign_id`, `workspace_id`, `campaign_name`, `campaign_status`, `created_at`, `updated_at`) that the service/repository implementation (Blocker 4) can build against.
4. Contains no route exposure risk — `src/store.js` changes are not routed unless `src/router.js` explicitly dispatches to them.
5. Does not authorize DB access, SQL changes, generated client updates, or route wiring.

## 6. Approved Nashir Campaign Entity Shape

The future implementation PR must use this entity shape, derived from the `NashirCampaign` schema in `docs/nashir_openapi_patch.yaml`:

```js
{
  nashir_campaign_id: "<string: uuid-format>",
  workspace_id: "<string>",
  campaign_name: "<string>",
  campaign_status: "draft" | "generated" | "in_review" | "approved" | "rejected" | "archived" | "requires_reapproval" | "blocked_until_review" | "published",
  created_by_user_id: "<string>",
  created_at: "<string: ISO 8601>",
  updated_at: "<string: ISO 8601>"
}
```

> **Scope note:** The `campaign_status` values are an internal store-readiness lifecycle envelope aligned with the D-009 state machine and existing decision-log lifecycle concepts (`draft → generated → in_review → approved/rejected`, with `requires_reapproval`, `blocked_until_review`, and `published` as additional envelope states). `created_by_user_id` is included for future ownership, audit, and RBAC-readiness only. Adding these fields to the in-memory entity shape does not authorize OpenAPI YAML changes, route exposure, publishing workflow implementation, or service/repository method implementation.

Seed data must include exactly **two records** — one for `workspace-a` and one for `workspace-b` — following the pattern established by all other seed entities in the store chain.

## 7. Allowed Files for the Future Implementation PR

| File | Change | Notes |
|---|---|---|
| `src/store.js` | Add store.nashirCampaigns \|\|= [...] with two workspace-scoped seed entities | Follow the \|\|= initialization pattern used for all Patch 002 collections |
| `test/nashir-store-entities.test.js` | New focused test verifying the entity shape, workspace isolation, and collection initialization | Must not import router, server, db, rbac, guards, or any file not in `src/store.js` chain |
| `docs/nashir_store_entities_implementation_report.md` | New implementation report following post-merge documentation pattern | Required before opening the next gate |
| `docs/17_change_log.md` | Add change log entry | Required |
| `docs/03_decision_log.md` | Add implementation decision entry | Required |

No other files are in scope.

## 8. Forbidden Files for the Future Implementation PR

| File / Category | Reason |
|---|---|
| `src/router.js` | Route registration is a subsequent gate |
| `src/server.js` | No server changes needed |
| `src/nashir/backend-slice0-service.js` | Service implementation is separately gated (Blocker 4) |
| `src/nashir/backend-slice0-repository.js` | Repository implementation is separately gated (Blocker 4) |
| `src/rbac.js` | RBAC codes already implemented; no changes needed |
| `src/config.js` | No config changes needed for store addition |
| SQL or migration files | No SQL authorized |
| `docs/nashir_openapi_patch.yaml` | Approved OpenAPI contract must not be modified |
| Any OpenAPI YAML file | No OpenAPI changes |
| `package.json` / lockfiles | No dependency changes |
| `.github/workflows/` | No workflow changes |
| `prototype/` | No prototype changes |

## 9. Required Acceptance Criteria

The future implementation PR is GO only if ALL of the following are satisfied:

1. `store.nashirCampaigns` is initialized in `src/store.js` using `||=` pattern.
2. Each seed entity has all required fields: `nashir_campaign_id`, `workspace_id`, `campaign_name`, `campaign_status`, `created_by_user_id`, `created_at`, `updated_at`.
3. Exactly two seed entities are present: one for `workspace-a`, one for `workspace-b`.
4. `nashir_campaign_id` values are distinct from all existing `campaign_id` values (no cross-collection ID collision).
5. `workspace_id` values in Nashir entities are never derived from a request body; they match the workspace scope of each seed entity.
6. No Nashir route is registered in `src/router.js`.
7. No Nashir keyword appears in `src/router.js` or `src/server.js`.
8. All existing tests (148/148 as of PR #174 baseline) still pass.
9. The focused entity test covers:
   - Store initializes without error.
   - `nashirCampaigns` array is present and non-empty.
   - Each entity has all required fields including `created_by_user_id`.
   - Entities are workspace-scoped (no cross-workspace leakage in the seed data).
   - `nashir_campaign_id` values are distinct from each other.
10. `src/store.js` diff is additive only — no existing collections or behaviors changed.

## 10. Required Tests

The focused test file `test/nashir-store-entities.test.js` must cover:

| Test case | Assertion |
|---|---|
| Store initializes successfully | `createSeedStore()` does not throw |
| nashirCampaigns array exists | `store.nashirCampaigns` is an Array |
| nashirCampaigns is non-empty | At least two entries |
| Entity has required fields | Each entity has `nashir_campaign_id`, `workspace_id`, `campaign_name`, `campaign_status`, `created_by_user_id`, `created_at`, `updated_at` |
| campaign_status is valid | Each entity's `campaign_status` is one of the approved enum values |
| Workspace A entity exists | One entity has `workspace_id === "workspace-a"` |
| Workspace B entity exists | One entity has `workspace_id === "workspace-b"` |
| No cross-workspace seed leakage | Workspace-a entity does not have workspace-b ID, and vice versa |
| Distinct campaign IDs | All `nashir_campaign_id` values are unique within the array |
| No conflation with existing campaigns | No `nashir_campaign_id` value equals any existing `campaign_id` from `store.campaigns` |

The test file must not import `src/router.js`, `src/server.js`, `src/db.js`, `src/rbac.js`, `src/guards.js`, or any Nashir-specific runtime module. It imports only the store module(s).

## 11. Implementation Prerequisites

Before the future implementation PR may open, all of the following must be satisfied:

1. **This gate is reviewed** — `docs/nashir_store_entities_implementation_gate.md` must be merged and present on main.
2. **Active roadmap guard (PR #155)** — the conditions established in PR #155 must be satisfied.
3. **Repository-level guard (PR #156)** — the conditions established in PR #156 must be satisfied.
4. **Entity shape confirmed** — the `NashirCampaign` schema in `docs/nashir_openapi_patch.yaml` is the canonical field source; no new fields may be added without a separate OpenAPI gate.
5. **No SQL in scope** — if the implementation discovers a need for SQL, it must stop and open a separate SQL gate PR.
6. **No route registration in scope** — if the implementation reveals a need to register a route, it must stop and open a separate route wiring gate PR.
7. **Latest Strict Verification success** — the most recent CI run on `main` must pass before the implementation PR opens.

## 12. What This Gate Does Not Authorize

Completing this gate and the subsequent store-entity implementation does NOT authorize:

- Route exposure for Nashir campaigns.
- Implementing `NashirSlice0Service` or `NashirSlice0Repository` methods beyond "not implemented" (that is Blocker 4, a separate gate).
- DB-backed Nashir persistence of any kind.
- Any SQL schema change.
- Any OpenAPI YAML change.
- Any `src/router.js` change.
- Any `src/config.js` change.
- Any `package.json` change.
- Any workflow change.

The next gate after this implementation is a **Nashir service/repository implementation gate** (Blocker 4), which will define how `NashirSlice0Service` and `NashirSlice0Repository` methods replace the "not implemented" stubs using the `nashirCampaigns` store layer from this gate.

## 13. GO / NO-GO Decision

```text
GO:     Documentation-only first runtime implementation gate.
GO:     Option A (add nashirCampaigns to src/store.js) approved as first implementation slice.
GO:     Option B (service/repo methods first) deferred — requires store layer first; separately gated.
NO-GO:  Option C (repository-backed from day one) — requires SQL schema not yet approved.
NO-GO:  Route exposure.
NO-GO:  Runtime wiring.
NO-GO:  src/router.js modification.
NO-GO:  Nashir service or repository method implementation without a separately approved gate.
NO-GO:  SQL or DB access.
NO-GO:  Generated client update.
NO-GO:  OpenAPI YAML modification.
NO-GO:  Package, workflow, or migration changes.
NO-GO:  Prototype usage.
NO-GO:  Pilot readiness.
NO-GO:  Production readiness.
NO-GO:  Any implementation PR without satisfying all seven prerequisites in Section 11.
NO-GO:  Any implementation PR without satisfying PR #155 and PR #156 guard conditions.
```
