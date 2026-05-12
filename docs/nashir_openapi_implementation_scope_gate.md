# Nashir OpenAPI Implementation Scope Gate

## 1. Status

```text
Documentation status:          GO — documentation-only OpenAPI implementation scope gate.
OpenAPI YAML modification:     NO-GO.
Route exposure:                NO-GO.
Runtime wiring:                NO-GO.
src/router.js modification:    NO-GO.
SQL / DB access:               NO-GO.
Generated client update:       NO-GO.
Audit runtime:                 NO-GO.
ErrorModel runtime:            NO-GO.
Package / workflow / migration: NO-GO.
Prototype:                     NO-GO.
Pilot:                         NO-GO.
Production:                    NO-GO.
```

## 2. Purpose

This document is a documentation-only OpenAPI implementation scope gate. It records the current Nashir runtime blocker state after PR #166, defines the candidate scope for a future OpenAPI implementation PR, records the unresolved future question about adding the minimum Nashir OpenAPI contract surface, and specifies the prerequisites and forbidden files that must govern any such future PR.

This document does not:
- Modify any OpenAPI YAML file.
- Expose any Nashir route.
- Approve runtime wiring.
- Approve `src/router.js` modification.
- Approve SQL or DB access.
- Approve generated client updates.
- Approve Pilot readiness or Production readiness.

## 3. Context

The following merged PRs establish the current Nashir state and governance chain:

| PR | Purpose | Governance role |
|---|---|---|
| #155 | Nashir active roadmap guard | Required before any next Nashir PR |
| #156 | Repository roadmap index and governance guard | Required before any PR |
| #159 | Inert Nashir Slice 0 service/repository skeleton | Skeleton exists; all methods throw "not implemented" |
| #161 | Nashir runtime wiring readiness gate | Identified four runtime blockers |
| #163 | Nashir OpenAPI activation planning gate | Defined minimum surface prerequisites; did not implement |
| #164 | Nashir pre-wiring contract tests | Machine-enforced guards; router/store/OpenAPI checks active |
| #165 | Nashir RBAC implementation scope gate | Defined nine implementation prerequisites for RBAC |
| #166 | Nashir Slice 0 RBAC permission codes implemented | **Blocker 1 resolved**: four codes now in `src/rbac.js` |
| #168 | Nashir Slice 0 OpenAPI patch added | **Blocker 3 resolved**: `docs/nashir_openapi_patch.yaml` added (documentation-only) |

### 3.1 Updated Blocker Status

PR #166 resolved Blocker 1. PR #168 added `docs/nashir_openapi_patch.yaml` and resolved Blocker 3. Two blockers remain before any Nashir route can be exposed:

| # | Blocker | Location | State |
|---|---|---|---|
| 1 | No Nashir permission codes | `src/rbac.js` | **RESOLVED — PR #166** |
| 2 | No Nashir store entities | `src/store.js` | Still missing — separately gated |
| 3 | No Nashir OpenAPI path | OpenAPI contract | **RESOLVED — PR #168** |
| 4 | Service/repository methods inert | `src/nashir/backend-slice0-*.js` | Still missing — separately gated |

## 4. Unresolved Future Question

> **Should a future PR add the minimum Nashir OpenAPI contract surface required before any route can be implemented, and if so, what is the exact scope?**

This question is not resolved by this document. It is recorded here as an open question requiring a separately approved implementation PR. No OpenAPI modification is authorized by this gate.

## 5. Candidate Future OpenAPI Implementation Scope (NOT YET IMPLEMENTED)

The following represents the candidate scope for a future OpenAPI implementation PR. None of it is approved or implemented by this document.

### 5.1 Candidate Target File

| File | Change | Status |
|---|---|---|
| `docs/marketing_os_v5_6_5_phase_0_1_openapi.yaml` | Add Nashir Slice 0 operations under existing workspace-scoped paths or as a separately approved Nashir OpenAPI patch file | NOT YET IMPLEMENTED |

Whether to add Nashir operations to the existing main OpenAPI file or create a separate patch file (following the Patch 002 precedent) must be decided before the implementation PR opens. Either approach requires explicit approval.

### 5.2 Candidate Test Files

| File | Change | Status |
|---|---|---|
| `test/nashir-openapi-contract.test.js` | New focused test verifying Nashir operation shape, RBAC mapping, ErrorModel response, and tenant isolation alignment | NOT YET IMPLEMENTED |

### 5.3 Generated Clients

No generated client update is approved. Any generated-client change requires its own explicit approval, allowed-files list, verification commands, and rollback criteria, separate from the OpenAPI YAML PR.

### 5.4 No Other Files

No other files are in scope for the OpenAPI implementation PR. In particular:
- `src/router.js` — NOT in scope. Route registration is a subsequent gate.
- `src/store.js` — NOT in scope.
- `src/rbac.js` — NOT in scope. RBAC codes are already implemented in PR #166.
- `src/nashir/` — NOT in scope.
- SQL or migration files — NOT in scope.
- `package.json` or lockfiles — NOT in scope.
- Workflow files — NOT in scope.
- `prototype/` — NOT in scope.

## 6. Candidate Minimum OpenAPI Surface (NOT APPROVED)

The following candidate paths and operations were identified in `docs/nashir_openapi_activation_planning_gate.md` (D-077) and `docs/nashir_openapi_patch_proposal.md`. They remain candidates pending final approval. None are implemented.

### 6.1 Workspace-Scoped Nashir Campaign / Intake Path

| Attribute | Candidate value |
|---|---|
| Candidate path | Reuse of existing `/workspaces/{workspaceId}/campaigns` and `/workspaces/{workspaceId}/campaigns/{campaignId}` |
| Candidate operations | GET (list), POST (create intake), GET (single) |
| Candidate schema reuse | `Campaign`, `CreateCampaignRequest`, existing list/item wrappers |
| RBAC mapping | `nashir.campaign.read` for GET; `nashir.campaign.write` for POST |
| New path needed? | Defer — reuse existing campaign paths first |
| New schema needed? | Defer — reuse existing `Campaign` and `CreateCampaignRequest` first |
| Status | NOT APPROVED |

### 6.2 Readiness / Scoring Path

| Attribute | Candidate value |
|---|---|
| Candidate path | Derive from existing campaign, brief-version, approval, evidence, and onboarding paths; defer a dedicated `/readiness` subpath |
| Candidate operations | GET (derived) |
| RBAC mapping | `nashir.campaign.read` |
| New path needed? | Defer unless derivation is provably insufficient |
| New schema needed? | Defer — readiness must remain advisory and must not equal approval |
| Status | NOT APPROVED |

### 6.3 Manual Evidence Path

| Attribute | Candidate value |
|---|---|
| Candidate path | Reuse of existing `/workspaces/{workspaceId}/publish-jobs/{publishJobId}/manual-evidence` and related supersede/invalidate paths |
| Candidate operations | POST (submit), GET (list/read) |
| Candidate schema reuse | `ManualPublishEvidence`, existing request/response wrappers |
| RBAC mapping | `nashir.evidence.submit` for POST; `nashir.campaign.read` for GET |
| New path needed? | No — existing evidence paths are the primary reuse candidate |
| New schema needed? | Defer |
| Status | NOT APPROVED |

### 6.4 Approval Transition Path

| Attribute | Candidate value |
|---|---|
| Candidate path | Reuse of existing `/workspaces/{workspaceId}/asset-versions/{mediaAssetVersionId}/review-tasks` and `/workspaces/{workspaceId}/review-tasks/{reviewTaskId}/decisions` |
| Candidate operations | POST (review task), POST (decision) |
| Candidate schema reuse | `ReviewTask`, `ApprovalDecision` |
| RBAC mapping | `nashir.approval.decide` for approval operations |
| New path needed? | No — existing review and approval decision paths are the primary reuse candidate |
| New schema needed? | Defer |
| Status | NOT APPROVED |

### 6.5 RBAC Mapping Available

Unlike prior planning gates, the RBAC codes are now implemented (PR #166). Any OpenAPI implementation PR must declare the correct `x-permission` or equivalent annotation for each operation, aligned to the four approved codes:

| Operation type | Required Nashir code |
|---|---|
| Read campaign or intake | `nashir.campaign.read` |
| Create/update campaign or intake | `nashir.campaign.write` |
| Submit manual evidence | `nashir.evidence.submit` |
| Approve/reject campaign | `nashir.approval.decide` |

## 7. Required Implementation Prerequisites

Before any PR may modify OpenAPI YAML files for Nashir, all of the following must be satisfied and documented in the implementation PR:

1. **Exact path names** — the complete path template for each new or reused operation (e.g., `/workspaces/{workspaceId}/campaigns`), confirmed against the existing OpenAPI authority and the reuse-first analysis in `docs/nashir_openapi_patch_proposal.md`.

2. **Request schemas** — the exact request body schema name, fields, required/optional status, and validation rules for each POST/PATCH operation. Must confirm `workspace_id` is not trusted from the request body.

3. **Response schemas** — the exact response schema name, HTTP status code, and payload shape for each success case. Must confirm `ErrorModel` / `ErrorResponse` is used for all failure cases.

4. **ErrorModel mapping** — the exact Nashir error codes (`NASHIR_IDEMPOTENCY_CONFLICT`, `NASHIR_INVALID_STATE_TRANSITION`, `PERMISSION_DENIED`, `WORKSPACE_ACCESS_DENIED`, `TENANT_CONTEXT_MISMATCH`) mapped to HTTP status codes and response shapes, consistent with the existing `ErrorModel` contract.

5. **RBAC mapping to the four approved Nashir codes** — each operation must declare which of the four implemented Nashir permission codes (`nashir.campaign.read`, `nashir.campaign.write`, `nashir.evidence.submit`, `nashir.approval.decide`) it requires. The RBAC mapping must align with the role grants implemented in PR #166.

6. **Audit event mapping** — the exact audit event name (from `docs/nashir_audit_errormodel_material_change_specification.md`) emitted for each state-changing operation, if audit emission is planned for the same route PR.

7. **Tenant and workspace isolation rules** — confirmation that every workspace-scoped path carries `{workspaceId}` as a route parameter, that no request body `workspace_id` is trusted, and that the OpenAPI schema declaration reflects this constraint.

8. **Idempotency rules** — whether each operation is idempotent, whether an `IdempotencyKey` header is declared, and how `NASHIR_IDEMPOTENCY_CONFLICT` (409) is handled at the OpenAPI level.

9. **Generated client boundary** — a decision on whether generated clients must be updated as part of this PR or deferred to a separate PR, with an explicit approval if generated-client update is included.

10. **Focused tests** — a proposed test file (`test/nashir-openapi-contract.test.js`) covering Nashir operation shape, RBAC permission mapping, ErrorModel response alignment, and workspace isolation, approved and merged in the same PR.

11. **Latest Strict Verification success** — the most recent Strict Verification run on main must pass before the OpenAPI implementation PR opens.

## 8. `src/router.js` Remains NO-GO

`src/router.js` must not be modified for Nashir until all of the following are separately approved and merged, in order:

1. This OpenAPI implementation scope gate is merged (this document).
2. OpenAPI implementation PR is approved and the relevant OpenAPI YAML is patched.
3. A route implementation scope gate is approved (a separate future gate document).
4. Store entities for Nashir are separately approved and implemented.
5. Service/repository behavior is separately approved and implemented.
6. Latest Strict Verification passes after all the above.

Adding a Nashir route to `src/router.js` before all of the above are complete would violate `AGENTS.md` rule 14 (no endpoints outside OpenAPI), produce 500 errors on every real request (inert service methods), and fail RBAC-based calls because `permissionGuard` cannot call routes that have not been registered.

## 9. Forbidden Files for the Future OpenAPI Implementation PR

The following files must not be modified in the OpenAPI implementation PR unless a separately approved gate explicitly names them:

| File / Category | Reason |
|---|---|
| `src/router.js` | Route registration is a subsequent gate |
| `src/server.js` | No server changes needed for OpenAPI YAML update |
| `src/store.js` | No store entity changes authorized |
| `src/rbac.js` | RBAC codes already implemented; no changes needed |
| `src/nashir/backend-slice0-service.js` | Service implementation is separately gated |
| `src/nashir/backend-slice0-repository.js` | Repository implementation is separately gated |
| SQL or migration files | No SQL authorized |
| `package.json` / `package-lock.json` | No dependency changes authorized |
| `.github/workflows/` | No workflow changes authorized |
| Generated clients | Separately gated unless explicitly included |
| `prototype/` | No prototype changes authorized |

## 10. Required Guards

### 10.1 Active Roadmap Guard — PR #155

PR #155 is the required Nashir active roadmap guard. No new Nashir PR may proceed without satisfying the conditions established in PR #155.

### 10.2 Repository-Level Guard — PR #156

PR #156 is the required repository roadmap index and governance guard. No PR of any kind may proceed without satisfying the conditions established in PR #156.

## 11. GO / NO-GO Decision

```text
GO:     Documentation-only OpenAPI implementation scope gate.
GO:     Context from PRs #155, #156, #159, #161, #163, #164, #165, #166 recorded.
GO:     Blocker 1 (RBAC) confirmed resolved by PR #166.
GO:     Blocker 3 (OpenAPI path) confirmed resolved by PR #168.
GO:     Blockers 2 and 4 (store entities, inert service/repository) remain active — separately gated.
GO:     Unresolved future question recorded — OpenAPI implementation not answered YES or NO.
GO:     Candidate future scope defined as NOT YET IMPLEMENTED.
GO:     Candidate minimum OpenAPI surface (4 paths) defined as NOT APPROVED.
GO:     RBAC mapping to four approved codes documented for each candidate operation.
GO:     Eleven implementation prerequisites defined.
GO:     src/router.js NO-GO conditions and sequencing stated explicitly.
GO:     Forbidden files for the future OpenAPI implementation PR listed.
NO-GO:  Any OpenAPI YAML modification.
NO-GO:  Route exposure.
NO-GO:  Runtime wiring.
NO-GO:  src/router.js modification.
NO-GO:  SQL or DB access.
NO-GO:  Generated client update unless separately approved.
NO-GO:  Audit runtime.
NO-GO:  ErrorModel runtime.
NO-GO:  Package, workflow, or migration changes.
NO-GO:  Prototype usage.
NO-GO:  Pilot readiness.
NO-GO:  Production readiness.
NO-GO:  Any next Nashir PR without satisfying PR #155 and PR #156 guard conditions.
NO-GO:  Any OpenAPI YAML change without a separately approved implementation PR satisfying
        all eleven prerequisites in Section 7.
NO-GO:  Any src/router.js change without completing the six-step sequence in Section 8.
```
