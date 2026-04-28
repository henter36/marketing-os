# pg Adapter Implementation Report

## Executive Status

- pg Adapter Implementation: GO after GitHub Actions strict verification passed on the PR head.
- Scope: Slice 0 Workspace/Membership/RBAC read path only.
- DB-backed full persistence: NO-GO.
- Slice 1: NO-GO.
- Sprint 5: NO-GO.
- Pilot: NO-GO.
- Production: NO-GO.

## Files Changed

- `package.json`
- `package-lock.json`
- `src/db.js`
- `src/repositories/workspace-repository.js`
- `src/repositories/membership-repository.js`
- `src/repositories/rbac-repository.js`
- `test/integration/db-backed-slice0.integration.test.js`
- `docs/pg_adapter_implementation_report.md`
- `docs/17_change_log.md`

## Dependency Decision

- Added `pg` as the only new runtime dependency.
- No ORM/query builder was added.
- No Kysely, Knex, Prisma, Drizzle, postgres.js, or unrelated package was added.

## Adapter Behavior

- `src/db.js` now uses `Pool` from `pg` through a narrow `PgPoolAdapter`.
- One pool is created per adapter instance and the existing singleton helpers remain available.
- No pool is created per request.
- `DATABASE_URL` continues to come from existing config/environment loading.
- Missing `DATABASE_URL` fails with `DatabaseConfigurationError` when strict DB-backed mode requires a connection.
- Repository reads use parameterized pg queries instead of string-substituted SQL.
- Workspace-scoped queries run inside a short transaction and set `app.current_workspace_id` with `set_config($1, $2, true)` before executing the query.
- Repository-level `workspace_id` filters remain mandatory; RLS context is defense in depth only.
- `close()` and `closePool()` are available for test isolation.
- Existing in-memory runtime remains the default. No router/store runtime switch was made.

## Repository Compatibility

- `WorkspaceRepository` method names and signatures were preserved.
- `MembershipRepository` method names and signatures were preserved.
- `RbacRepository` method names and signatures were preserved.
- Repository implementations now await pg adapter reads while returning the same domain results to callers.
- No public API routes or response contracts were changed.

## Tests Added/Updated

Updated `test/integration/db-backed-slice0.integration.test.js` to cover the pg adapter while preserving Slice 0 scope:

- DB connection required in strict DB-backed mode.
- Workspace exists/read path.
- Workspace not found behavior.
- Membership allow.
- Membership deny.
- Cross-workspace membership rejection.
- RBAC permission allow.
- RBAC permission deny.
- Missing role safe denial.
- Missing permission safe denial.
- Raw SQL/connection details not exposed through ErrorModel bodies.
- Pool close behavior.
- pg adapter identity for repository reads.

## Commands Run

Local command execution was not used as acceptance evidence because the repository changes were made through the GitHub-connected branch. GitHub Actions strict verification run #127 executed the required command coverage:

- `npm test`
- `npm run test:integration`
- `npm run openapi:lint:strict`
- `npm run db:seed`
- `npm run db:migrate:strict`
- `npm run db:migrate:retry`
- `npm run verify:strict`

## GitHub Actions Result

Passed: `Sprint 0 Strict Verification` run #127 completed successfully on PR #28 head `cc5df081ff76ae3a8ba2858c3241764056072d2f`.

This report update creates a follow-up documentation commit; GitHub Actions must remain passing on the latest PR head before merge.

## Explicitly Not Implemented

- DB-backed full persistence.
- Campaign persistence.
- Brief persistence.
- Brand persistence.
- Media persistence.
- Approval/publish/evidence persistence.
- Report persistence.
- Patch 002 persistence.
- Usage/Cost persistence.
- Audit persistence.
- Write-path replacement.
- New endpoints.
- Router/store runtime replacement.
- Slice 1.
- Sprint 5.
- Pilot.
- Production.

## Remaining Blockers

- Runtime/SQL parity for product domains.
- DB-backed write-path strategy.
- Production auth.
- Root/src cleanup.
- Production observability/security/deployment.
- Pilot readiness review.

## Final Decision

- pg Adapter Implementation: GO only if GitHub Actions passes on the latest PR head.
- DB-backed Slice 0 remains limited repository/test read-path slice.
- DB-backed full persistence: NO-GO.
- Slice 1: NO-GO.
- Sprint 5: NO-GO.
- Pilot: NO-GO.
- Production: NO-GO.
