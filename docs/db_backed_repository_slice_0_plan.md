# DB-backed Repository Slice 0 Plan

## 1. Executive Decision

- DB-backed Repository Slice 0 Planning: GO.
- Slice 0 implementation: NO-GO until this plan is reviewed.
- Scope allowed later: Workspace/Membership/RBAC read path only.
- Sprint 5 coding: NO-GO.
- Pilot: NO-GO.
- Production: NO-GO.

This is a documentation-only planning document. It does not implement DB-backed repositories, database connection code, runtime behavior changes, migration runner changes, workflows, tests, SQL, OpenAPI, endpoints, Sprint 5, Pilot readiness, or Production readiness.

Current verified state for this plan:

- Sprint 0/1/2/3/4 passed.
- Patch 002 runtime baseline passed as in-memory runtime.
- Patch 002 SQL migration activation passed and is included in strict migration order.
- Migration retry verification passed and is included in GitHub Actions.
- InPactAI fit-gap study passed and merged as documentation only.
- DB-backed Repository Architecture Contract passed and merged.
- Latest verified main commit: `a36394e`.
- GitHub Actions strict verification passed on main.
- Current runtime still uses in-memory store.
- DB-backed implementation: NO-GO.
- First allowed implementation slice: Workspace/Membership/RBAC read path only.
- Sprint 5 coding: NO-GO.
- Pilot: NO-GO.
- Production: NO-GO.

## 2. Purpose Of Slice 0

Slice 0 is not full DB-backed persistence. It is the safest first DB-backed read path and exists to prove the repository structure before wider persistence work begins.

The target is Workspace/Membership/RBAC read behavior only:

- Workspace lookup and workspace existence checks.
- Membership lookup and role resolution for a user inside a workspace.
- RBAC permission resolution needed by the existing guards.

No Campaign, Brief, Brand, Media, Approval, Publish, Evidence, Report, Patch 002, or write-path persistence is allowed in Slice 0. Slice 0 must not replace broader runtime state with PostgreSQL. It must not introduce Sprint 5 behavior.

The purpose is to prove:

- repository boundaries;
- connection lifecycle;
- tenant isolation at the repository layer;
- ErrorModel-compatible mapping of repository outcomes;
- deterministic DB test isolation;
- compatibility with the current AuthGuard, WorkspaceContextGuard, MembershipCheck, and PermissionGuard behavior.

## 3. Current Runtime Baseline

- `src/router.js` is the current runtime route entrypoint.
- `src/store.js` remains the in-memory source for current runtime behavior, including Sprint 4 and Patch 002 in-memory collections.
- `src/rbac.js` contains runtime permission seed/mappings.
- `src/guards.js` contains AuthGuard, WorkspaceContextGuard, MembershipCheck, PermissionGuard, and body workspace guard behavior.
- `src/config.js` currently loads `DATABASE_URL` from config/environment but no runtime DB pool exists.
- `scripts/db-migrate.js` runs the base schema plus Patch 001 plus Patch 002.
- `scripts/db-migrate-retry.js` verifies same-database retry by running strict migration twice without resetting the database.
- `.github/workflows/sprint0-verify.yml` includes strict migration, migration retry verification, strict OpenAPI lint, tests, integration tests, seed generation, and aggregate strict verification.
- No DB-backed runtime repository layer exists yet.

## 4. Slice 0 Scope

### In Scope For Later Slice 0 Implementation

- DB connection scaffolding only if needed.
- WorkspaceRepository read methods.
- MembershipRepository read methods.
- RbacRepository read methods if needed.
- Repository interface contracts.
- Read-only repository tests.
- Tenant isolation tests.
- ErrorModel compatibility tests.
- Membership allow/deny tests.
- RBAC permission resolution compatibility tests.

### Out Of Scope

- Campaign persistence.
- Brief persistence.
- Brand persistence.
- Media persistence.
- Approval, publish, and evidence persistence.
- Report persistence.
- Patch 002 persistence.
- Write-path replacement.
- New endpoints.
- Runtime behavior expansion.
- Sprint 5.
- Pilot.
- Production.

## 5. Proposed Files For Future Slice 0 Implementation

Likely future files, not created by this planning PR:

- `src/db.js` or `src/db/pool.js`
- `src/repositories/workspace-repository.js`
- `src/repositories/membership-repository.js`
- `src/repositories/rbac-repository.js`
- `src/repositories/index.js`
- `test/integration/db-backed-slice0.integration.test.js`
- `docs/db_backed_repository_slice_0_implementation_report.md`

Exact filenames may be adjusted during implementation, but the implementation must remain narrow, reviewed, and limited to Workspace/Membership/RBAC read path behavior.

## 6. DB Connection Plan

Future Slice 0 implementation should use this connection policy:

- One pool per application process.
- No pool per request.
- `DATABASE_URL` must come from `src/config.js` and environment only.
- No hard-coded credentials.
- A clean shutdown hook is required later if runtime code owns a pool.
- Tests must use isolated database setup.
- Missing `DATABASE_URL` in strict DB-backed tests must fail clearly.
- Existing in-memory runtime must remain available unless a later reviewed switch is approved.
- DB-backed read mode should be explicit in test/runtime configuration.

Slice 0 may introduce connection scaffolding only if needed for the read path. It must not add provider connection code, external integration connection code, or persistence for unrelated domains.

## 7. Repository Interface Design

Repository methods must return domain results or typed outcomes that route/guard code can map to the existing ErrorModel. They must not expose raw SQL errors, constraint names, connection strings, stack traces, or secrets.

### WorkspaceRepository Candidate Methods

| Method | Required Inputs | Workspace Scope Rule | Expected Output | Not-Found Behavior | ErrorModel Mapping | Tenant Isolation Rule |
| --- | --- | --- | --- | --- | --- | --- |
| `getWorkspaceById({ workspaceId })` | `workspaceId` from route context | Query by `workspaces.workspace_id = workspaceId` | Workspace domain object with approved fields only | Return null or typed not-found outcome | Existing not-found shape, for example `NOT_FOUND` with correlation ID | Must not reveal whether a workspace exists to a user without membership; caller must combine with membership check before returning data. |
| `workspaceExists({ workspaceId })` | `workspaceId` from route context | Query by `workspaces.workspace_id = workspaceId` | Boolean or typed existence result | False | Existing not-found or safe denial according to caller guard behavior | Used only as a guard helper; must not create a workspace enumeration side channel. |

### MembershipRepository Candidate Methods

| Method | Required Inputs | Workspace Scope Rule | Expected Output | Not-Found Behavior | ErrorModel Mapping | Tenant Isolation Rule |
| --- | --- | --- | --- | --- | --- | --- |
| `getMembership({ workspaceId, userId })` | `workspaceId` from route context, authenticated `userId` | Query by both `workspace_id` and `user_id`, and require active membership | Membership domain object with role identifier/code and member status | Return null or typed access-denied outcome | Existing guard-compatible `WORKSPACE_ACCESS_DENIED` or not-found policy | Cross-workspace membership lookup must not reveal whether the user or workspace exists elsewhere. |
| `listMembershipRoles({ workspaceId, userId })` if needed | `workspaceId` from route context, authenticated `userId` | Join membership roles constrained by `workspace_id` and `user_id` | Array of role identifiers/codes for active memberships in that workspace | Empty array | Safe denial by caller if empty | Must never list roles from another workspace or infer global memberships. |

### RbacRepository Candidate Methods

| Method | Required Inputs | Workspace Scope Rule | Expected Output | Not-Found Behavior | ErrorModel Mapping | Tenant Isolation Rule |
| --- | --- | --- | --- | --- | --- | --- |
| `getRolePermissions({ roleId })` or `getRolePermissions({ roleName })` | Role identifier or role code resolved from membership | Role lookup must use approved roles and role_permissions tables or the existing seed-compatible mapping | Array of permission codes | Empty array or typed missing role outcome | Safe denial, not raw DB error | Must not grant permissions when role is missing, disabled, or unmapped. |
| `hasPermission({ workspaceId, userId, permission })` if needed | `workspaceId`, `userId`, requested permission code | Resolve active membership inside workspace before checking role permissions | Boolean | False | Existing `PERMISSION_DENIED` through PermissionGuard/caller | Must constrain membership by workspace and user before resolving permissions. |
| `resolveUserPermissions({ workspaceId, userId })` if needed | `workspaceId`, `userId` | Resolve permissions only through active membership in the route workspace | Array or set of permission codes | Empty set | Safe denial by caller | Must not include permissions from memberships in other workspaces. |

### Interface Rules For Every Method

- Inputs must be explicit objects, not positional request objects.
- `workspaceId` must be required for workspace-scoped methods.
- Methods must not read `workspace_id` from request bodies.
- Methods must return a domain result, null, boolean, or typed outcome; not raw database driver rows unless wrapped at the repository boundary.
- Unexpected database failures must be caught above the driver and mapped to a generic internal ErrorModel with `correlation_id`.

## 8. Tenant Isolation Rules

Slice 0 implementation must require:

- Every method accepts `workspaceId` explicitly where workspace-scoped.
- No method trusts `workspace_id` from request body.
- All membership queries constrain by `workspaceId` and `userId`.
- RBAC checks resolve permissions only after a membership is found for the route workspace.
- Cross-workspace membership lookup fails as not found or access denied without leaking existence.
- Tests must include `workspace-a` and `workspace-b`.
- Tests must prove a user with access to workspace A cannot use workspace B membership or role data.
- Repository methods must treat database RLS as defense in depth, not as a replacement for WorkspaceContextGuard and MembershipCheck.

## 9. ErrorModel Mapping

Future Slice 0 implementation must preserve the existing ErrorModel surface:

| Condition | Required Mapping |
| --- | --- |
| Missing workspace | Existing not-found shape with `code`, `message`, `user_action`, and `correlation_id`. |
| Missing membership | Existing guard behavior: access denied or not found according to current policy, without cross-tenant existence leak. |
| Missing role | Safe denial, not raw DB error and not implicit allow. |
| Missing permission | Safe denial, not raw DB error and not implicit allow. |
| DB connection failure | Generic internal error without SQL details, connection strings, hostnames, or credentials. |
| Unexpected DB error | Generic internal error with `correlation_id`; no SQL text, constraint internals, stack trace, or secret material in response. |

Repository code should preserve the current guard-facing errors where possible:

- `AUTH_REQUIRED` remains AuthGuard behavior.
- `TENANT_CONTEXT_MISSING` remains WorkspaceContextGuard behavior.
- `WORKSPACE_ACCESS_DENIED` remains MembershipCheck-compatible behavior.
- `PERMISSION_DENIED` remains PermissionGuard-compatible behavior.

## 10. Coexistence Strategy

Recommendation:

- Do not replace all in-memory store behavior at once.
- Use repository adapter boundaries.
- Slice 0 may run in DB-backed read mode only under explicit test/runtime configuration.
- Existing in-memory tests must continue to pass.
- Avoid split-brain by clearly documenting which read path is active.
- Do not claim production persistence from Slice 0.

Coexistence rules:

- In-memory runtime remains the default unless a reviewed switch is approved.
- DB-backed Slice 0 tests may exercise the repository directly or an explicitly configured read adapter.
- Do not mix DB-backed reads with in-memory writes for the same behavior without a written test-mode contract.
- Do not replace `src/store.js` wholesale.
- Do not rewrite `src/router.js` wholesale.

## 11. Test Strategy For Future Implementation

Future implementation must include tests for:

- DB connection required in DB-backed mode.
- Workspace exists/read path.
- Membership allow.
- Membership deny.
- RBAC permission allow.
- RBAC permission deny.
- Cross-workspace membership rejection.
- ErrorModel consistency.
- No raw DB errors exposed.
- Migration plus migration retry still pass.
- All existing Sprint 0/1/2/3/4 and Patch 002 tests still pass.

Additional expectations:

- Tests must use deterministic setup.
- Tests must include `workspace-a` and `workspace-b`.
- Tests must include users with different roles.
- Tests must not depend on manual DB edits.
- Tests must not require external providers.
- Tests must not add endpoints.

No tests are implemented in this planning PR.

## 12. Data Seed Strategy

- Current in-memory seed is not production data.
- DB test seed must be deterministic.
- Test seed must include at least `workspace-a` and `workspace-b`.
- Test seed must include users with different roles.
- Test seed must include membership allow and deny cases.
- Test seed must include enough role/permission data to prove compatibility with `src/rbac.js` behavior.
- No manual DB edits count as acceptance evidence.
- Production data migration is out of scope.

The first implementation should prefer a narrow DB test seed for Workspace/Membership/RBAC rather than broad product-domain fixtures.

## 13. Rollback Strategy

Slice 0 must be reversible.

Rollback requirements:

- Avoid wholesale router/store rewrites.
- Keep DB-backed code behind narrow interfaces.
- Keep the existing in-memory runtime path available.
- Keep migration order unchanged unless a separate reviewed migration plan approves a change.
- If DB-backed read path fails tenant isolation tests, do not merge.
- If DB-backed read path fails ErrorModel tests, do not merge.
- If migration retry breaks, do not merge.
- If implementation destabilizes existing tests, revert or split smaller.

Rollback must be simple enough to remove the new DB-backed read slice without changing unrelated Campaign, Brief, Media, Approval, Publish, Evidence, Report, or Patch 002 behavior.

## 14. Verification Gates For Future Slice 0 Implementation

Future Slice 0 implementation must pass:

```bash
npm run db:migrate:strict
npm run db:migrate:retry
npm run db:seed
npm test
npm run test:integration
npm run openapi:lint:strict
npm run verify:strict
```

GitHub Actions strict verification must pass before merge.

The workflow currently runs strict verification gates, including strict database migration and migration retry verification. Future implementation must not weaken those gates.

## 15. Risk Register

| Risk | Impact | Required Control |
| --- | --- | --- |
| Tenant leakage from incomplete `WHERE workspace_id` filters | Cross-customer data exposure | Every workspace-scoped query must include workspace context and tests must include workspace A/B rejection. |
| DB connection lifecycle mistakes | Pool exhaustion, flaky tests, hung process shutdown | One pool per process, no pool per request, explicit shutdown hook when runtime owns the pool. |
| Inconsistent in-memory vs DB behavior | Guard, RBAC, and route regressions | Repository compatibility tests plus existing in-memory test suite must pass. |
| Raw SQL error leakage | Security and implementation detail exposure | Map DB errors to generic ErrorModel; never expose SQL text, constraint internals, or stack traces. |
| Unstable tests due to shared DB state | CI flakes and false confidence | Deterministic seed and isolated DB setup per test strategy. |
| Premature replacement of runtime store | Broad regressions and hard rollback | Keep Slice 0 behind narrow interfaces and avoid wholesale router/store rewrites. |
| Over-expansion beyond Workspace/Membership/RBAC | Scope drift into product persistence or Sprint 5 | Hard block Campaign, Brief, Brand, Media, Approval, Publish, Evidence, Report, and Patch 002 persistence. |
| False Pilot/Production readiness claim | Governance failure | State DB-backed full persistence, Pilot, and Production remain NO-GO. |
| Accidental Sprint 5 scope creep | Feature expansion before persistence boundary is proven | Keep Slice 0 read-only and do not add endpoints or new product behavior. |

## 16. Go / No-Go Criteria For Future Slice 0 Implementation

### GO Only If

- This plan is reviewed.
- Implementation is limited to Workspace/Membership/RBAC read path.
- No new endpoints are added.
- No write-path replacement occurs.
- Migration retry remains passing.
- Tenant isolation tests are included.
- ErrorModel mapping is preserved.
- Existing Sprint 0/1/2/3/4 and Patch 002 tests continue passing.
- In-memory runtime remains available unless a later reviewed switch is approved.

### NO-GO If

- Implementation touches Campaign persistence.
- Implementation touches Brief persistence.
- Implementation touches Media persistence.
- Implementation touches Patch 002 persistence.
- Router/store are rewritten wholesale.
- Production readiness is claimed.
- Tests cannot prove workspace isolation.
- Database migration or retry verification fails.
- Sprint 5 scope is mixed in.
- New endpoints are added or removed.

## 17. Recommended Next Step

Recommendation: Proceed to DB-backed Repository Slice 0 Implementation PR only after this plan is reviewed, limited to Workspace/Membership/RBAC read path.

This is the conservative next step because the architecture contract has already approved the first allowed implementation slice, but the runtime still needs a narrow proof of DB-backed read behavior before broader persistence or Sprint 5 planning. A smaller DB connection contract is not necessary unless reviewers disagree with the connection lifecycle rules in this plan. Sprint 5 planning should remain deferred while DB-backed runtime persistence is still NO-GO.

## 18. Final Decision

- DB-backed Repository Slice 0 Planning: GO.
- Slice 0 implementation: NO-GO until reviewed.
- DB-backed full persistence: NO-GO.
- Sprint 5 coding: NO-GO.
- Pilot: NO-GO.
- Production: NO-GO.
