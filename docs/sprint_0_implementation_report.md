# Sprint 0 Implementation Report

## Scope Completed

- Application/backend baseline in Node.js CommonJS with no frontend shell.
- Package manager setup with `package.json` and `package-lock.json`.
- Environment variables documented for `PORT` and `DATABASE_URL`.
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

- `package.json`
- `package-lock.json`
- `README_SPRINT_0.md`
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
npm run db:seed
npm run openapi:lint
npm test
npm run test:integration
npm run verify
```

## Migration Result

Migration wiring preserves the approved execution order. In the local slim mirror, the SQL files are absent, so `db:migrate` validates wiring and exits with a warning. In the full repository, setting `DATABASE_URL` runs both approved SQL files through `psql`.

## OpenAPI Lint Result

`openapi:lint` checks that implemented backend routes are limited to allowed internal routes and OpenAPI-defined routes. In the local slim mirror, the OpenAPI source file is absent, so the command exits successfully with a warning. In the full repository, it validates against `docs/marketing_os_v5_6_5_phase_0_1_openapi.yaml`.

## Tests Added

- Migration wiring and approved order.
- Tenant isolation across workspace-scoped reads.
- RBAC allow/deny behavior.
- Unified ErrorModel shape.
- ApprovalDecision Patch 001 behavior.
- ManualPublishEvidence Patch 001 immutable proof/invalidation behavior.
- Health/readiness endpoint behavior.

## Tests Passed / Failed

- Unit tests: passed locally.
- Integration tests: passed locally.
- Sprint 0 verification: passed locally.
- Failures: none observed locally.

## Unresolved Gaps

- Local execution did not apply PostgreSQL migrations because this local mirror does not include the authoritative SQL docs.
- Local OpenAPI lint did not parse the full OpenAPI contract because this local mirror does not include the authoritative OpenAPI doc.
- No production database connectivity was verified in this environment.
- `.env.example` and `src/config.js` were prepared locally, but the GitHub connector blocked creation of those two new files without an additional explicit repository-write confirmation.

## Deviations From Approved Contracts

- No product-scope deviations.
- Campaign and asset route behavior is limited to guarded, non-business test surfaces and does not create Sprint 1+ entities.

## Readiness Decision For Sprint 1

Conditional go: Sprint 0 is ready for Sprint 1 handoff after the full repository environment confirms:

- PostgreSQL migrations apply successfully against a real database.
- OpenAPI lint runs against the authoritative OpenAPI YAML.
- The same unit, integration, and verification commands pass in CI.
- The environment template/config helper creation is approved or completed in the target repo workflow.
