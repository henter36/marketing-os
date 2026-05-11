# Nashir RBAC Implementation Scope Gate

## 1. Status

```text
Documentation status:          GO — documentation-only RBAC implementation scope gate.
RBAC implementation:           NO-GO.
src/rbac.js modification:      NO-GO.
Route exposure:                NO-GO.
Runtime wiring:                NO-GO.
OpenAPI activation:            NO-GO.
SQL / DB access:               NO-GO.
Audit runtime:                 NO-GO.
ErrorModel runtime:            NO-GO.
Generated client update:       NO-GO.
Package / workflow / migration: NO-GO.
Prototype:                     NO-GO.
Pilot:                         NO-GO.
Production:                    NO-GO.
```

## 2. Purpose

This document is a documentation-only RBAC implementation scope gate. It defines the exact candidate scope for a future RBAC implementation PR, records the unresolved future question about adding Nashir permission codes to `src/rbac.js`, and specifies the prerequisites and forbidden files that must govern any such future PR.

This document does not:
- Implement any RBAC permission code.
- Modify `src/rbac.js`.
- Approve runtime wiring or route exposure.
- Approve OpenAPI activation.
- Approve SQL or DB access.
- Approve audit runtime, ErrorModel runtime, Pilot readiness, or Production readiness.

## 3. Context

The following merged PRs establish the current Nashir state and governance chain:

| PR | Purpose | Governance role |
|---|---|---|
| #155 | Nashir active roadmap guard | Required before any next Nashir PR |
| #156 | Repository roadmap index and governance guard | Required before any PR |
| #161 | Nashir runtime wiring readiness gate | Identified four runtime blockers; blocked all runtime work |
| #162 | Nashir RBAC permission activation planning gate | Planned candidate permission codes; did not implement |
| #163 | Nashir OpenAPI activation planning gate | Defined minimum OpenAPI surface prerequisites; did not implement |
| #164 | Nashir pre-wiring contract tests | Machine-enforced: `src/rbac.js` must not contain any `nashir` keyword until RBAC is separately approved |

The pre-wiring contract test in `test/nashir-prewiring-contract.test.js` currently asserts that `src/rbac.js` has no Nashir keyword. This test will need to be updated when RBAC activation is explicitly approved and merged — but that update is part of the future RBAC implementation PR, not this gate.

## 4. Unresolved Future Question

> **Should a future PR add finalized Nashir permission codes to `src/rbac.js`, and update pre-wiring tests accordingly?**

This question is not resolved by this document. It is recorded here as an open question requiring a separately approved implementation PR. No implementation is authorized by this gate.

## 5. Candidate Future RBAC Implementation Scope (NOT YET IMPLEMENTED)

The following files and changes are the candidate scope for a future RBAC implementation PR. None are approved or implemented by this document.

### 5.1 Primary Candidate File

| File | Change | Status |
|---|---|---|
| `src/rbac.js` | Add Nashir permission codes to `permissions` array; add codes to `rolePermissions` mapping for each of the seven system roles | NOT YET IMPLEMENTED |

### 5.2 Candidate Test Files

| File | Change | Status |
|---|---|---|
| `test/nashir-rbac-permission-mapping.test.js` | New focused test file verifying that each Nashir permission code is granted to the expected roles and denied to all others | NOT YET IMPLEMENTED |
| `test/nashir-prewiring-contract.test.js` | Update the `src/rbac.js has no nashir keyword` assertion so it no longer blocks once RBAC activation is explicitly approved; all other pre-wiring checks (router, store, OpenAPI, planning docs) must be preserved | NOT YET IMPLEMENTED |

### 5.3 No Other Files

No other files are in scope for the RBAC implementation PR. In particular:
- `src/router.js` — NOT in scope.
- `src/server.js` — NOT in scope.
- `src/store.js` — NOT in scope.
- `src/nashir/` — NOT in scope.
- OpenAPI YAML files — NOT in scope.
- SQL or migration files — NOT in scope.
- `package.json` or lockfiles — NOT in scope.
- Workflow files — NOT in scope.
- Generated clients — NOT in scope.
- `prototype/` — NOT in scope.

## 6. Candidate Permission Codes (Pending Final Review)

The following codes were proposed in `docs/nashir_rbac_permission_activation_planning_gate.md`. They remain candidates pending final approval. None are implemented.

### 6.1 Primary Candidates

| Candidate Code | Proposed Action |
|---|---|
| `nashir.campaign.read` | Read Nashir campaign records, readiness state, and scoring |
| `nashir.campaign.write` | Create or update a Nashir campaign intake record |
| `nashir.evidence.submit` | Submit manual publishing evidence for a Nashir campaign |
| `nashir.approval.decide` | Approve or reject a Nashir campaign for manual publishing |

### 6.2 Secondary Candidates (Only If Explicitly Approved)

The following codes are lower-priority candidates. They may be included in the RBAC implementation PR only if separately and explicitly approved alongside the primary codes.

| Candidate Code | Proposed Action |
|---|---|
| `nashir.evidence.read` | Read submitted evidence records |
| `nashir.approval.read` | Read approval state and history |
| `nashir.intake.create` | Create a new Nashir campaign intake record (if intake creation is scoped separately from campaign write) |

### 6.3 Open Questions Still Requiring Resolution

Before any implementation PR may open, the following open questions from D-076 must be resolved:

1. Should `nashir.campaign.read` be separate from the existing `campaign.read` permission, or does existing entity reuse make a separate code unnecessary?
2. Should `nashir.evidence.submit` align with the existing `manual_evidence.submit` or be a new code?
3. Should `nashir.approval.decide` align with the existing `approval.decide` or be a new Nashir-specific code?
4. Is `nashir.campaign.write` sufficient for intake creation, or is `nashir.intake.create` needed as a separate code?
5. Are tenant isolation rules for Nashir RBAC identical to existing workspace-scoped guards?

These questions must be resolved and documented in the implementation PR's gate document before any code is written.

## 7. Candidate Role Mapping (Pending Final Review)

The following role mapping was proposed in `docs/nashir_rbac_permission_activation_planning_gate.md` and remains a candidate pending final approval.

Primary candidates (NOT APPROVED):

| Role | `nashir.campaign.read` | `nashir.campaign.write` | `nashir.evidence.submit` | `nashir.approval.decide` |
|---|---|---|---|---|
| `owner` | YES | YES | YES | YES |
| `admin` | YES | YES | YES | YES |
| `creator` | YES | YES | NO | NO |
| `reviewer` | YES | NO | NO | YES |
| `publisher` | YES | NO | YES | NO |
| `billing_admin` | NO | NO | NO | NO |
| `viewer` | YES | NO | NO | NO |

Secondary candidates (NOT APPROVED):

| Role | `nashir.evidence.read` | `nashir.approval.read` | `nashir.intake.create` |
|---|---|---|---|
| `owner` | YES | YES | YES |
| `admin` | YES | YES | YES |
| `creator` | NO | YES | YES |
| `reviewer` | NO | YES | NO |
| `publisher` | YES | YES | NO |
| `billing_admin` | NO | NO | NO |
| `viewer` | YES | YES | NO |

## 8. Implementation Prerequisites

Before any PR may add Nashir permission codes to `src/rbac.js`, all of the following must be satisfied and documented in a separately approved implementation gate:

1. **Final approved code list** — the open questions in Section 6.3 must be resolved and the complete final list of Nashir permission codes confirmed. The final list must be explicitly named in the implementation PR.

2. **Final approved role mapping** — the mapping of each approved code to each of the seven system roles must be confirmed against `docs/nashir_role_permission_matrix.md` and explicitly listed in the implementation PR.

3. **Denial behavior specified** — the expected HTTP status (`403`), error code (`PERMISSION_DENIED`), and error message for each denial scenario must be confirmed as consistent with the existing `permissionGuard` behavior in `src/guards.js`. No changes to `src/guards.js` are authorized.

4. **Focused allowed/denied role tests** — a proposed test file (`test/nashir-rbac-permission-mapping.test.js`) covering both allowed and denied roles for every approved code must be part of the implementation PR. Tests must verify `hasPermission(roleCode, permissionCode)` returns the expected boolean for every `(role, code)` pair.

5. **Pre-wiring contract test update** — `test/nashir-prewiring-contract.test.js` must be updated in the same PR to remove or adjust the `src/rbac.js has no nashir keyword` assertion. All other pre-wiring checks must remain: router, store, OpenAPI YAML, and planning gate document checks must still pass. The updated test must confirm that the RBAC activation is coherent with the rest of the pre-wiring state.

6. **No route exposure in the same PR** — adding Nashir permission codes to `src/rbac.js` does not authorize route registration. `src/router.js` must not be modified in the RBAC implementation PR.

7. **No OpenAPI activation in the same PR** — the RBAC implementation PR must not modify any OpenAPI YAML file. OpenAPI activation is separately gated by `docs/nashir_openapi_activation_planning_gate.md`.

8. **No SQL or DB access** — no SQL schema change, migration, connection pool, or query may be introduced in the RBAC implementation PR.

9. **Latest Strict Verification success** — the most recent Strict Verification run on main must pass before the RBAC implementation PR opens.

## 9. Forbidden Files for the Future RBAC Implementation PR

The following files must not be modified in the RBAC implementation PR under any circumstances:

| File / Category | Reason |
|---|---|
| `src/router.js` | Route exposure is a separate gate |
| `src/server.js` | No server changes authorized |
| `src/store.js` | No store entity changes authorized |
| `src/nashir/backend-slice0-service.js` | Service implementation is separately gated |
| `src/nashir/backend-slice0-repository.js` | Repository implementation is separately gated |
| OpenAPI YAML files | OpenAPI activation is separately gated |
| SQL or migration files | No SQL authorized |
| `package.json` / `package-lock.json` | No dependency changes authorized |
| `.github/workflows/` | No workflow changes authorized |
| Generated clients | No generated client update authorized |
| `prototype/` | No prototype changes authorized |

## 10. Required Guards

### 10.1 Active Roadmap Guard — PR #155

PR #155 is the required Nashir active roadmap guard. No new Nashir PR may proceed without satisfying the conditions established in PR #155.

### 10.2 Repository-Level Guard — PR #156

PR #156 is the required repository roadmap index and governance guard. No PR of any kind may proceed without satisfying the conditions established in PR #156.

## 11. GO / NO-GO Decision

```text
GO:     Documentation-only RBAC implementation scope gate.
GO:     Context from PRs #155, #156, #161, #162, #163, #164 recorded.
GO:     Unresolved future question recorded — RBAC implementation not answered YES or NO.
GO:     Candidate future scope defined as NOT YET IMPLEMENTED.
GO:     Candidate codes and role mapping from PR #162 preserved as pending review.
GO:     Open questions for final code list recorded.
GO:     Nine implementation prerequisites defined.
GO:     Forbidden files for the future RBAC implementation PR listed.
NO-GO:  RBAC implementation.
NO-GO:  src/rbac.js modification.
NO-GO:  Route exposure.
NO-GO:  Runtime wiring.
NO-GO:  OpenAPI activation.
NO-GO:  SQL or DB access.
NO-GO:  Audit runtime.
NO-GO:  ErrorModel runtime.
NO-GO:  Generated client update.
NO-GO:  Package, workflow, or migration changes.
NO-GO:  Prototype usage.
NO-GO:  Pilot readiness.
NO-GO:  Production readiness.
NO-GO:  Any next Nashir PR without satisfying PR #155 and PR #156 guard conditions.
NO-GO:  Any src/rbac.js change without a separately approved implementation gate that
        satisfies all nine prerequisites in Section 8.
```
