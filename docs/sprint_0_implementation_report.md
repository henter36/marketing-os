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
- GitHub Actions strict verification workflow: `.github/workflows/sprint0-verify.yml`.

## Files Changed

- `.env.example`
- `.github/workflows/sprint0-verify.yml`
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
- `docs/marketing_os_v5_6_5_phase_0_1_schema_patch_001.sql`
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

Migration wiring preserves the approved execution order. `db:migrate:strict` now fails if approved SQL files are missing, if `DATABASE_URL` is not set, or if `psql` is unavailable.

GitHub Actions strict verification successfully applied the approved SQL order against PostgreSQL 16:

```text
1. docs/marketing_os_v5_6_5_phase_0_1_schema.sql
2. docs/marketing_os_v5_6_5_phase_0_1_schema_patch_001.sql
```

Patch 001 was corrected to be migration-retry safe by dropping `trg_manual_publish_evidence_protect_update` before recreating it.

## OpenAPI Lint Result

`openapi:lint:strict` runs in GitHub Actions as part of `npm run verify:strict` and passed during Sprint 0 CI verification.

Current strict lint behavior:

- fails if the authoritative OpenAPI file is absent
- checks required Sprint 0 OpenAPI fragments
- checks declared `x-permission` values against RBAC seed permissions
- invokes `@redocly/cli` or `swagger-cli` if installed

Future hardening recommendation: add a real OpenAPI validator dependency before or during Sprint 1.

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

GitHub Actions result for commit `b081bb4a8ce169ae79f2df0fccb25f732103ebba`:

```text
Status: Success
Workflow: Sprint 0 Strict Verification
Job: Verify Sprint 0 Gates
Duration: 53s
```

Gate status:

```text
Unit tests: passed
Integration tests: passed
Sprint 0 static verification: passed
Strict OpenAPI lint: passed
RBAC seed generation: passed
Strict PostgreSQL migration: passed
Full strict verification aggregate: passed
```

Remaining warning:

```text
Node.js 20 deprecation warning for actions/checkout@v4 and actions/setup-node@v4 being forced to run on Node.js 24.
```

This is a GitHub Actions runtime warning, not a Sprint 0 gate failure.

## Unresolved Gaps

No Sprint 0 blocking gaps remain after successful GitHub Actions strict verification.

Non-blocking hardening items before or during Sprint 1:

- Add `@redocly/cli` or equivalent as a development dependency for stronger OpenAPI validation.
- Consider branch protection requiring `Sprint 0 Strict Verification` to pass before merging.
- Keep frontend implementation blocked until backend Sprint 1 APIs are implemented and tested.

## Deviations From Approved Contracts

- No intentional product-scope deviations.
- No Sprint 1+ implementation was added.
- No frontend shell was added.
- No auto-publishing, paid execution, AI agents, advanced attribution, BillingProvider, ProviderUsageLog, GenerationJob, Asset, or Approval entities were added.
- Campaign and asset route behavior remains limited to guarded, non-business test surfaces and does not create Sprint 1+ entities.

## Readiness Decision For Sprint 1

```text
GO to Sprint 1.
```

Conditions for Sprint 1 execution:

```text
1. Implement Sprint 1 only.
2. Do not implement Sprint 2+.
3. Do not build frontend shell yet unless explicitly scoped as non-production review UI.
4. Preserve tenant isolation, RBAC, ErrorModel, and OpenAPI alignment.
5. Keep GitHub Actions strict verification passing.
6. Add Sprint 1 tests before considering Sprint 1 complete.
```

## Pilot / Production Decision

```text
NO-GO to Pilot.
NO-GO to Production.
```

Pilot remains blocked until all P0 QA gates pass after later sprints.
