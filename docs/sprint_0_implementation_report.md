# Sprint 0 Implementation Report

## Scope Completed

- Application/backend baseline in Node.js CommonJS with no frontend shell.
- Package manager setup with `package.json` and `package-lock.json`.
- Environment configuration through `.env.example` and `src/config.js`.
- Separate local and strict gate commands for migration, OpenAPI lint, and verification.
- PostgreSQL migration wiring for the approved SQL order:
  1. `docs/marketing_os_v5_6_5_phase_0_1_schema.sql`
  2. `docs/marketing_os_v5_6_5_phase_0_1_schema_patch_001.sql`
- AuthGuard, WorkspaceContextGuard, MembershipCheck, and PermissionGuard.
- Unified ErrorModel response envelope.
- RBAC seed data for roles and permissions.
- Basic OpenAPI Sprint 0 endpoints for workspaces, members, roles, and permissions.
- Internal health/readiness endpoints allowed by the API spec.
- Sprint 0 tests for migrations, tenant isolation, RBAC, ErrorModel, Patch 001 ApprovalDecision behavior, and Patch 001 ManualPublishEvidence behavior.

## Files Changed

- `.env.example`
- `package.json`
- `package-lock.json`
- `README_SPRINT_0.md`
- `src/config.js`
- `src/error-model.js`
- `src/guards.js`
- `src/integrity.js`
- `src/rbac.js`
- `src/router.js`
- `src/server.js`
- `src/store.js`
- `scripts/db-migrate.js`
- `scripts/db-seed.js`
- `scripts/openapi-lint.js`
- `scripts/verify-sprint0.js`
- `test/helpers.js`
- `test/sprint0.test.js`
- `test/integration/sprint0.integration.test.js`
- `docs/sprint_0_implementation_report.md`

## Commands Added

```bash
npm run db:migrate
npm run db:migrate:local
npm run db:migrate:strict
npm run db:seed
npm run openapi:lint
npm run openapi:lint:local
npm run openapi:lint:strict
npm test
npm run test:integration
npm run verify:local
npm run verify:strict
npm run verify
```

## Migration Result

Migration wiring preserves the approved execution order. `db:migrate:local` validates wiring and exits with a warning when the SQL files or `DATABASE_URL` are unavailable. `db:migrate:strict` fails if approved SQL files are missing or `DATABASE_URL` is not set, and applies both approved SQL files through `psql` when prerequisites are present.

## OpenAPI Lint Result

`openapi:lint:local` checks Sprint 0 contract fragments and RBAC permission alignment, exiting with a warning when the OpenAPI file is absent. `openapi:lint:strict` fails when the OpenAPI file is absent. If a real validator package such as `@redocly/cli` or `swagger-cli` is installed, strict lint invokes it; otherwise it clearly reports that only Sprint 0 contract checks were completed.

## Tests Added

- Migration wiring and approved order.
- Strict migration failure when SQL prerequisites are unavailable.
- Environment configuration loading.
- Tenant isolation across workspace-scoped reads.
- RBAC allow/deny behavior.
- Unified ErrorModel shape.
- ApprovalDecision Patch 001 behavior.
- ManualPublishEvidence Patch 001 immutable proof/invalidation behavior.
- Health/readiness endpoint behavior.

## Tests Passed / Failed

- Unit tests: passed locally.
- Integration tests: passed locally.
- Sprint 0 local verification: passed locally.
- Strict migration/OpenAPI gates: fail as expected in this slim local mirror because authoritative docs and `DATABASE_URL` are absent.
- Failures: none observed locally outside expected strict prerequisite failures.

## Unresolved Gaps

- Strict execution did not apply PostgreSQL migrations because this local mirror does not include the authoritative SQL docs or a `DATABASE_URL`.
- Strict OpenAPI lint did not parse the full OpenAPI contract because this local mirror does not include the authoritative OpenAPI doc.
- No production database connectivity was verified in this environment.

## Deviations From Approved Contracts

- No intentional deviations.
- Campaign and asset route behavior is limited to guarded, non-business test surfaces and does not create Sprint 1+ entities.

## Readiness Decision For Sprint 1

Conditional go: Sprint 0 is ready for Sprint 1 handoff after the full repository environment confirms:

- PostgreSQL migrations apply successfully against a real database.
- OpenAPI lint runs against the authoritative OpenAPI YAML.
- `npm run verify:strict` passes in CI.
