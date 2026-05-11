# Nashir OpenAPI Activation Planning Gate

## 1. Status

```text
Documentation status:         GO — documentation-only OpenAPI activation planning gate.
OpenAPI activation (docs):    GO — candidate surfaces defined for future review.
OpenAPI YAML modification:    NO-GO.
OpenAPI path exposure:        NO-GO.
Route exposure:               NO-GO.
Runtime wiring:               NO-GO.
RBAC implementation:          NO-GO.
SQL / DB access:              NO-GO.
Generated client update:      NO-GO.
Audit runtime:                NO-GO.
ErrorModel runtime:           NO-GO.
Pilot:                        NO-GO.
Production:                   NO-GO.
```

## 2. Purpose

This document is a documentation-only OpenAPI activation planning gate. It records the unresolved future question of whether and what Nashir OpenAPI paths and components should be activated before any route is exposed, proposes candidate future surfaces as NOT APPROVED planning references, and defines the prerequisites that must be satisfied before any future OpenAPI activation PR may open.

This document does not:
- Modify any OpenAPI YAML file.
- Add, remove, rename, or revise OpenAPI paths, operations, schemas, parameters, responses, examples, security definitions, or generated clients.
- Approve OpenAPI activation.
- Approve route exposure.
- Approve runtime wiring.
- Approve RBAC implementation.
- Approve SQL or DB access.
- Approve audit runtime, ErrorModel runtime, Pilot readiness, or Production readiness.

## 3. Context and Remaining Runtime Blockers

PR #161 (Nashir runtime wiring readiness gate) identified four simultaneous hard blockers preventing any runtime wiring PR from opening. PR #162 (Nashir RBAC permission activation planning gate) addressed Blocker 1 at the planning level. This gate addresses Blocker 3 at the planning level.

| # | Blocker | Location | Current State | Gate |
|---|---|---|---|---|
| 1 | No Nashir permission codes | `src/rbac.js` | Planned in PR #162 — NOT APPROVED for implementation | PR #162 |
| 2 | No Nashir store entities | `src/store.js` | Not yet planned | Future gate |
| 3 | No Nashir OpenAPI path | OpenAPI contract | Addressed here at planning level — NOT APPROVED for activation | This gate |
| 4 | Service/repository methods inert | `src/nashir/backend-slice0-*.js` | Not yet planned | Future gate |

All four blockers must be resolved — each via its own separately approved gate and implementation PR — before any runtime wiring PR can open.

## 4. Relationship to Prior Nashir OpenAPI Documents

Two comprehensive Nashir OpenAPI planning documents already exist and remain valid planning authority:

### `docs/nashir_openapi_patch_planning_gate.md`

Written before the backend skeleton existed. Establishes a broad OpenAPI planning framework covering the full Nashir Core V1 capability surface (readiness, smart wizard, campaign basics, approval, evidence, UTM Lite, manual performance review, RBAC). Concluded: NO-GO for actual OpenAPI patch; GO only for documentation-only planning. Recommended Option A reuse-first mapping as the safest initial path. That conclusion remains in force.

### `docs/nashir_openapi_patch_proposal.md`

Written after the planning gate. Proposes a reuse-first Option A mapping of all Nashir Core V1 capabilities to existing Phase 0/1 OpenAPI paths and schemas. Deferred all new paths and schema changes. Concluded: NO-GO for actual OpenAPI patch; Option A recommended if later approved. That conclusion remains in force.

**This gate does not supersede or replace those documents.** It adds a narrower, activation-focused layer: given that the backend skeleton now exists and a specific first route is a future candidate, what is the minimum OpenAPI contract surface that must be defined before any route is exposed?

## 5. Unresolved Future Question

> **Should Nashir OpenAPI paths and/or components be activated before any route exposure, and if so, what is the minimum contract surface for the first Nashir route?**

This question is not resolved by this document. It is recorded here as an open question requiring a separately approved OpenAPI activation PR before any OpenAPI YAML file may be modified and before any Nashir route is registered in `src/router.js`.

## 6. Existing OpenAPI Authority

The following files remain the authoritative OpenAPI contract. They must not be modified by this PR or by any future PR unless that future PR is explicitly approved and names these files in its allowed-files list.

| File | Authority |
|---|---|
| `docs/marketing_os_v5_6_5_phase_0_1_openapi.yaml` | Phase 0/1 OpenAPI contract |
| `docs/marketing_os_v5_6_5_phase_0_1_openapi_patch_002.yaml` | Patch 002 OpenAPI extension |

`AGENTS.md` rule 14 explicitly requires that no endpoints be invented outside the approved OpenAPI contract. This rule applies to any Nashir route added to `src/router.js` — a Nashir route cannot exist in the router without a corresponding approved OpenAPI path.

## 7. Candidate Future OpenAPI Surfaces (NOT APPROVED)

The following candidate surfaces are proposed for future review only. None are approved. Each requires a separately approved OpenAPI activation PR that explicitly names the allowed OpenAPI files, defines the exact path, schema, and governance requirements (see Section 8), and satisfies all prerequisites (see Section 9).

These candidates follow the Option A reuse-first recommendation from `docs/nashir_openapi_patch_proposal.md`. They are the minimum surfaces likely needed for the first Nashir route only — not the full Core V1 surface.

### 7.1 Candidate: Workspace-Scoped Nashir Campaign / Intake Path

| Attribute | Candidate value |
|---|---|
| Candidate path | Reuse of existing `/workspaces/{workspaceId}/campaigns` and `/workspaces/{workspaceId}/campaigns/{campaignId}` |
| Candidate method(s) | GET (list), POST (create intake), GET (single) |
| Candidate schema reuse | `Campaign`, `CreateCampaignRequest`, existing list/item wrappers |
| New path needed? | Defer — existing campaign paths are the primary reuse candidate |
| New schema needed? | Defer — reuse existing `Campaign` and `CreateCampaignRequest` first |
| Status | NOT APPROVED |

### 7.2 Candidate: Readiness / Scoring Path

| Attribute | Candidate value |
|---|---|
| Candidate path | Derive readiness from existing campaign, brief-version, approval, evidence, and onboarding paths; defer a dedicated `/readiness` subpath |
| Candidate method(s) | GET (derived) |
| Candidate schema reuse | Existing campaign and approval response schemas |
| New path needed? | Defer unless derivation is provably insufficient |
| New schema needed? | Defer — readiness must remain advisory and must not equal approval |
| Status | NOT APPROVED |

### 7.3 Candidate: Manual Evidence Path

| Attribute | Candidate value |
|---|---|
| Candidate path | Reuse of existing `/workspaces/{workspaceId}/publish-jobs/{publishJobId}/manual-evidence` and related supersede/invalidate paths |
| Candidate method(s) | POST (submit), GET (list/read) |
| Candidate schema reuse | `ManualPublishEvidence`, existing request/response wrappers |
| New path needed? | No — existing evidence paths are the primary reuse candidate |
| New schema needed? | Defer |
| Status | NOT APPROVED |

### 7.4 Candidate: Approval Transition Path

| Attribute | Candidate value |
|---|---|
| Candidate path | Reuse of existing `/workspaces/{workspaceId}/asset-versions/{mediaAssetVersionId}/review-tasks` and `/workspaces/{workspaceId}/review-tasks/{reviewTaskId}/decisions` |
| Candidate method(s) | POST (review task), POST (decision) |
| Candidate schema reuse | `ReviewTask`, `ApprovalDecision` |
| New path needed? | No — existing review and approval decision paths are the primary reuse candidate |
| New schema needed? | Defer |
| Status | NOT APPROVED |

### 7.5 Reuse-First Principle

Before any new Nashir-specific path is considered, the implementing PR must demonstrate that existing Phase 0/1 paths cannot represent the required flow. `docs/nashir_openapi_patch_proposal.md` Section 10 and Section 13 provide the authoritative capability-to-path mapping and deferred-path list. That analysis remains in force.

## 8. Required Definitions for Any Future OpenAPI Activation PR

Before any PR that modifies OpenAPI YAML files for Nashir may open, all of the following must be defined and documented in the activation PR's planning gate:

1. **Exact paths** — the full path template (e.g., `/workspaces/{workspaceId}/campaigns`) for each new or reused operation, confirmed against the existing OpenAPI authority and the reuse-first analysis.

2. **Request schemas** — the exact request body schema name, fields, required/optional status, and validation rules for each POST/PATCH operation. Must confirm that `workspace_id` is not trusted from the request body.

3. **Response schemas** — the exact response schema name, HTTP status code, and payload shape for each success case. Must confirm `ErrorModel` / `ErrorResponse` is used for all failure cases.

4. **ErrorModel mapping** — the exact Nashir error codes (`NASHIR_IDEMPOTENCY_CONFLICT`, `NASHIR_INVALID_STATE_TRANSITION`, `PERMISSION_DENIED`, `WORKSPACE_ACCESS_DENIED`, `TENANT_CONTEXT_MISMATCH`, and any others) mapped to HTTP status codes and response shapes, consistent with the existing `ErrorModel` contract.

5. **RBAC permission mapping** — the exact permission code (from the candidate codes defined in `docs/nashir_rbac_permission_activation_planning_gate.md`) required for each operation. RBAC implementation in `src/rbac.js` must be separately approved and merged before any route can enforce permissions.

6. **Audit event mapping** — the exact audit event name (from `docs/nashir_audit_errormodel_material_change_specification.md` and the planning contract) emitted for each state-changing operation.

7. **Tenant and workspace isolation rules** — confirmation that every workspace-scoped path carries `{workspaceId}` as a route parameter, that the route handler calls `workspaceContextGuard` and `membershipCheck`, and that `workspace_id` from the request body is rejected via `rejectBodyWorkspaceId`.

8. **Idempotency behavior** — whether each operation is idempotent, whether an `IdempotencyKey` header is declared, and how `NASHIR_IDEMPOTENCY_CONFLICT` (409) is handled.

9. **No generated client update unless separately approved** — any generated client change requires its own explicit approval, allowed-files list, verification commands, and rollback criteria. An OpenAPI YAML change does not implicitly authorize a generated client update.

10. **Tests required before route implementation** — a focused test plan covering the new operation's request validation, RBAC denial, workspace isolation, ErrorModel response, and (if applicable) audit event emission must be defined and approved before any route is added to `src/router.js`.

## 9. Prerequisites Before Any OpenAPI Activation PR

Before any PR that modifies OpenAPI YAML files for Nashir may open, all of the following must be satisfied:

1. **RBAC permission codes finalized** — the Nashir permission codes planned in `docs/nashir_rbac_permission_activation_planning_gate.md` must be resolved (open questions in Section 7.2 of that document answered) and approved for implementation in a separately approved RBAC implementation PR.

2. **Exact first route identified** — the specific HTTP method, path template, handler behavior, and minimum viable request/response contract for the first Nashir route must be specified. The activation PR must map this to an existing or new OpenAPI operation.

3. **All ten definitions in Section 8 satisfied** — every item in the required-definitions checklist must be documented in the activation PR's planning gate before the activation PR opens.

4. **Reuse-first review completed** — a review confirming that existing Phase 0/1 paths and schemas from `docs/nashir_openapi_patch_proposal.md` cannot represent the flow (if a new path is proposed) must be documented.

5. **No runtime wiring before both RBAC and OpenAPI gates are approved** — neither this gate nor any future OpenAPI activation PR authorizes runtime wiring. A separate runtime wiring implementation gate must explicitly name the allowed files, verification commands, and rollback/no-go criteria.

6. **Latest Strict Verification success** — the most recent Strict Verification run on main must pass before any implementation PR for OpenAPI activation opens.

## 10. `src/router.js` Remains NO-GO

`src/router.js` must not be modified for Nashir until all of the following are separately approved and merged:

1. OpenAPI activation is approved and the relevant OpenAPI YAML is patched.
2. RBAC implementation is approved and Nashir permission codes are present in `src/rbac.js`.
3. ErrorModel and audit event behavior is mapped (Section 8, items 4 and 6).
4. Focused tests for the new route are defined and approved.
5. Latest Strict Verification passes.

Opening a Nashir route in `src/router.js` before these prerequisites are met would:
- Violate `AGENTS.md` rule 14 (no endpoints outside OpenAPI).
- Deny all users due to the missing RBAC permission codes.
- Produce 500 errors on every real request due to inert service/repository methods.

## 11. Candidate Future Allowed Files (NOT APPROVED)

The following files are candidate future modification targets for OpenAPI activation. They are listed for planning reference only. None are approved for modification by this document.

| File | Change Category | Status |
|---|---|---|
| `docs/marketing_os_v5_6_5_phase_0_1_openapi.yaml` | Add Nashir operation(s) under existing or new path | NOT APPROVED |
| `docs/marketing_os_v5_6_5_phase_0_1_openapi_patch_002.yaml` | Add Nashir operation(s) if extending Patch 002 surface | NOT APPROVED |
| `test/nashir-openapi-contract.test.js` | New focused test verifying Nashir operation shape, RBAC, and ErrorModel alignment | NOT APPROVED |

No other files are in scope for the OpenAPI activation PR. In particular:
- `src/router.js` is NOT in scope for the OpenAPI activation PR (route wiring is a separate subsequent gate).
- `src/rbac.js` is NOT in scope for the OpenAPI activation PR (RBAC implementation is a separate gate).
- Generated clients are NOT in scope unless explicitly named in the activation PR.

## 12. Explicit NO-GO List

The following are explicitly NO-GO for this PR and for any future PR until a separately approved gate document permits each item:

- Any OpenAPI YAML file modification.
- Route exposure — no Nashir route may be registered in `src/router.js`.
- Runtime wiring of any kind (router, server, store, DB, guards, config).
- RBAC implementation — no Nashir permission codes added to `src/rbac.js`.
- SQL — no SQL schema change, migration, or query.
- DB access — no connection, pool, or query in any Nashir file.
- Generated client update.
- Audit runtime — no audit event emitted at runtime.
- ErrorModel runtime — no ErrorModel response constructed for Nashir at runtime.
- Package changes — no `package.json` or lockfile modification.
- Workflow changes — no CI/CD workflow modification.
- Migration changes — no migration file added or modified.
- Prototype — no `prototype/` file usage or modification.
- Direct publishing, social OAuth, scheduling, paid ads, payment, analytics ingestion, attribution, external integrations, autonomous AI execution, or Post V1 module endpoints — all NO-GO per `docs/nashir_openapi_patch_planning_gate.md` Section 14 and `docs/nashir_openapi_patch_proposal.md` Section 14.
- Pilot readiness — not approved.
- Production readiness — not approved.

## 13. Required Guards

### 13.1 Active Roadmap Guard — PR #155

PR #155 is the required Nashir active roadmap guard. No new Nashir PR may proceed without satisfying the conditions established in PR #155.

### 13.2 Repository-Level Guard — PR #156

PR #156 is the required repository roadmap index and governance guard. No PR of any kind may proceed without satisfying the conditions established in PR #156.

## 14. GO / NO-GO Decision

```text
GO:     Documentation-only OpenAPI activation planning gate.
GO:     Prior planning gate and proposal remain valid and are not superseded.
GO:     Unresolved future question recorded — OpenAPI activation not answered YES or NO.
GO:     Candidate future surfaces defined as NOT APPROVED.
GO:     Required definitions checklist for any future activation PR defined.
GO:     Prerequisites for any future OpenAPI activation PR defined.
GO:     src/router.js NO-GO conditions stated explicitly.
GO:     Candidate future allowed files listed as NOT APPROVED.
GO:     Explicit NO-GO list recorded.
NO-GO:  Any OpenAPI YAML modification.
NO-GO:  Route exposure.
NO-GO:  Runtime wiring.
NO-GO:  RBAC implementation.
NO-GO:  SQL or DB access.
NO-GO:  Generated client update.
NO-GO:  Audit runtime.
NO-GO:  ErrorModel runtime.
NO-GO:  Package, workflow, or migration changes.
NO-GO:  Prototype usage.
NO-GO:  Pilot readiness.
NO-GO:  Production readiness.
NO-GO:  Any next Nashir PR without satisfying PR #155 and PR #156 guard conditions.
NO-GO:  Any src/router.js change for Nashir without OpenAPI, RBAC, ErrorModel/audit mapping,
        focused tests, and Strict Verification all separately approved and merged.
NO-GO:  Any OpenAPI YAML change without a separately approved activation gate satisfying all
        items in Section 8 and Section 9.
```
