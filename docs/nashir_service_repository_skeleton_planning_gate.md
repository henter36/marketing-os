# Nashir Service / Repository Skeleton Planning Gate

## 1. Executive Status

```text
This PR:               GO — documentation-only planning gate inspection.
Implementation:        NO-GO — not approved by this PR.
Service skeleton:      NO-GO — not approved by this PR.
Repository skeleton:   NO-GO — not approved by this PR.
Runtime wiring:        NO-GO.
Route exposure:        NO-GO.
SQL activation:        NO-GO.
OpenAPI activation:    NO-GO.
Package / workflow:    NO-GO.
Migration:             NO-GO.
Generated clients:     NO-GO.
Prototype usage:       NO-GO.
Pilot:                 NO-GO.
Production:            NO-GO.
```

This document is a documentation-only planning gate. It inspects the current Nashir backend state and defines the future gate question and prerequisites for a possible next implementation step. It does not authorize any implementation.

## 2. Governance References

| Guard | PR | Role |
|---|---|---|
| Repository roadmap index and governance guard | #156 | Required before any PR of any kind |
| Nashir active roadmap guard | #155 | Required before any new Nashir implementation PR |
| Patch 003 backlog guard | #154 | Confirms Patch 003 is separate and not activated |
| Latest Nashir post-merge status record | #157 | Documents current state after PR #146 |

## 3. Current Nashir State (Post-PR #157)

| Category | State |
|---|---|
| Inert backend Slice 0 planning contract | `src/nashir/backend-slice0-planning.js` — inert constants only; no runtime behavior |
| Focused planning contract tests | `test/nashir-slice0-planning-contract.test.js` — 5 focused contract-only tests |
| Route exposure | None |
| SQL schema or migration | None |
| OpenAPI definition | None |
| Runtime wiring (router, server, store) | None |
| Package / workflow changes | None |
| Migration runner changes | None |
| Generated clients | None |
| Prototype usage | None |
| IO or global state mutation | None |
| Pilot readiness | None |
| Production readiness | None |

The only files under `src/nashir/` are:

```
src/nashir/backend-slice0-planning.js
```

## 4. Scope of This PR

This PR is inspect-only and gate-defining. It:

- Records the current Nashir state.
- States the future implementation question.
- Defines candidate future allowed and forbidden files for a possible next step.
- Defines future implementation prerequisites.
- Does not approve, authorize, or initiate any implementation.

**This PR does not implement a service skeleton or repository skeleton.**

## 5. Future Implementation Question (Not Yet Approved)

> Should the next Nashir implementation PR add an isolated, inert service/repository skeleton — with no route exposure, no SQL, no OpenAPI, no router/server/store wiring, no IO, no global state mutation, no external packages, no package/workflow/migration changes, no generated clients, no prototype usage, and no Pilot or Production readiness — to `src/nashir/` only?

This question is unresolved. It must be answered through a separate, explicitly approved implementation PR. This document does not answer it.

## 6. Future Implementation Candidate Scope

### ⚠️ NOT APPROVED — Candidates Only

The following represents the candidate scope for a possible future implementation PR. None of these files are authorized by this document.

### 6.1 Candidate Allowed Files

```text
src/nashir/nashir-slice0-service.js      — inert service skeleton candidate
src/nashir/nashir-slice0-repository.js   — inert repository skeleton candidate
```

Both candidates must remain inert if implemented:

- no imports from router, server, or store
- no IO (no database calls, no file reads, no network calls)
- no global state mutation
- no external package dependencies
- no route exposure
- no SQL
- no OpenAPI references
- no runtime wiring
- exports limited to the skeleton surface only

### 6.2 Candidate Forbidden Files (if implementation is later approved)

```text
src/router.js
src/server.js
src/store.js
src/repositories/ (existing files)
src/error-model.js
src/guards.js
src/rbac.js
src/integrity.js
src/config.js
src/db.js
test/
docs/
prototype/
scripts/
SQL files
OpenAPI files
package.json
package-lock.json
.github/workflows/
migrations/
generated clients
```

### 6.3 Candidate Test Scope (Not Approved — Separate Approval Required)

Focused inert-skeleton tests, if approved separately, would be limited to:

- verifying the module loads without error
- verifying the exported surface matches expectations
- no integration tests
- no database tests
- no route tests

## 7. Future Implementation Prerequisites

Before any future implementation PR may add a service/repository skeleton, all of the following must be satisfied:

| Prerequisite | Required |
|---|---|
| PR #155 Nashir active roadmap guard conditions satisfied | Yes |
| PR #156 repository-level guard conditions satisfied | Yes |
| All PR #157 status record NO-GO boundaries remain unviolated | Yes |
| Exact allowed files identified and approved (not just candidated) | Yes |
| Exact forbidden files confirmed | Yes |
| Inertness verified: no route exposure | Yes |
| Inertness verified: no SQL or OpenAPI | Yes |
| Inertness verified: no router/server/store wiring | Yes |
| Inertness verified: no IO | Yes |
| Inertness verified: no global state mutation | Yes |
| Inertness verified: no external packages | Yes |
| Inertness verified: no package/workflow/migration changes | Yes |
| Inertness verified: no generated client changes | Yes |
| Inertness verified: no prototype usage | Yes |
| Focused tests approved separately (if added) | Yes |
| All open review threads on this gate document resolved | Yes |
| Sprint 0 Strict Verification passes after candidate implementation | Yes |

## 8. Explicit NO-GO List

The following are NO-GO regardless of future approval status:

- any route that exposes a Nashir endpoint
- any SQL table, migration, or schema change
- any OpenAPI path or schema addition
- any import of router, server, or store modules
- any database call, file system call, or network call
- any mutation of module-level or global state
- any external npm package dependency
- any change to package.json, package-lock.json, or workflow files
- any migration runner change
- any generated client update
- any prototype usage
- Pilot readiness
- Production readiness
- any Patch 003 work (see PR #154)
- reusing PR #24 for any purpose

## 9. Risks if Implementation Starts Too Early

| Risk | Description |
|---|---|
| Scope creep | A skeleton file could grow to include IO, imports, or wiring before review threads close |
| Guard bypass | Starting without #155 and #156 conditions satisfied may skip required governance |
| Inertness drift | A file named "service" or "repository" can attract premature imports or logic |
| Test coupling | Prematurely added tests could reference router/server/store, coupling the skeleton to runtime |
| Review gap | Open review comments on this gate could identify naming, structure, or scope concerns before implementation is safe |

## 10. Required Review Checklist

Before a future implementation PR can open, a reviewer must confirm:

- [ ] PR #155 conditions are satisfied.
- [ ] PR #156 conditions are satisfied.
- [ ] The candidate file list in §6.1 is final and approved.
- [ ] The forbidden file list in §6.2 is accepted.
- [ ] Inertness rules in §7 are accepted.
- [ ] No open review threads remain on this gate document.
- [ ] Sprint 0 Strict Verification is confirmed to pass.

## 11. Patch 003 Separation

PR #154 is the Patch 003 backlog guard. Patch 003 is a separate, future competitive expansion track. It is not part of Nashir Slice 0 or any service/repository skeleton work. PR #24 is closed, draft, and not merged; it must not be reused.

## 12. GO / NO-GO Decision

```text
GO:     Documentation-only planning gate inspection — this PR.
GO:     Inert backend Slice 0 planning contract confirmed at src/nashir/backend-slice0-planning.js.
GO:     Focused planning contract tests confirmed at test/nashir-slice0-planning-contract.test.js.
NO-GO:  Service skeleton implementation — not approved by this PR.
NO-GO:  Repository skeleton implementation — not approved by this PR.
NO-GO:  Runtime wiring.
NO-GO:  Route exposure.
NO-GO:  SQL activation.
NO-GO:  OpenAPI activation.
NO-GO:  Package or workflow changes.
NO-GO:  Migration activation.
NO-GO:  Generated clients.
NO-GO:  Prototype usage.
NO-GO:  IO or global state mutation.
NO-GO:  Pilot readiness.
NO-GO:  Production readiness.
NO-GO:  Any implementation PR without satisfying PR #155 and PR #156 guard conditions.
NO-GO:  Treating PR #154 / Patch 003 as part of Nashir skeleton work.
NO-GO:  Reusing PR #24 for any purpose.
```
