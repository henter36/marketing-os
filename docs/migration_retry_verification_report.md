# Migration Retry Verification Report

## Executive Status

```text
Migration retry verification: CONDITIONAL GO pending GitHub Actions retry step on PR head.
Patch 002 SQL activation: GO for strict migration order only.
DB-backed runtime persistence: NO-GO.
Sprint 5 coding: NO-GO.
Pilot: NO-GO.
Production: NO-GO.
```

This PR implements migration retry verification only. It does not modify SQL, OpenAPI, runtime behavior, router/store files, endpoints, DB-backed runtime persistence, Sprint 5, Pilot logic, or Production logic.

## Files Changed

```text
scripts/db-migrate-retry.js
package.json
.github/workflows/sprint0-verify.yml
docs/migration_retry_verification_report.md
```

## Retry Verification Method

The retry helper uses the same `DATABASE_URL` for both strict migration runs.

Method:

1. Validate `DATABASE_URL` is present.
2. Validate `psql` is available.
3. Run `node scripts/db-migrate.js --strict` for the first strict run.
4. Run `node scripts/db-migrate.js --strict` for the second strict run.
5. Do not reset, drop, recreate, truncate, or manually clean the database between runs.
6. Fail non-zero if either strict run fails.

The helper prints these phase markers:

```text
Migration retry verification: first strict run
Migration retry verification: second strict run
Migration retry verification: passed
```

## Migration Sequence Verified

The helper reuses the existing strict migration runner. The current strict migration order is therefore inherited from `scripts/db-migrate.js`:

1. `docs/marketing_os_v5_6_5_phase_0_1_schema.sql`
2. `docs/marketing_os_v5_6_5_phase_0_1_schema_patch_001.sql`
3. `docs/marketing_os_v5_6_5_phase_0_1_schema_patch_002.sql`

Patch 002 remains after Patch 001.

## Commands Run

GitHub-connected repository changes were made directly on the branch. Local command execution is not used as acceptance evidence for this PR.

Required verification commands for the PR are:

```bash
npm run db:migrate:retry
npm run db:migrate:strict
npm run verify:strict
npm run openapi:lint:strict
npm test
npm run test:integration
npm run db:seed
```

The GitHub Actions workflow now includes `npm run db:migrate:retry` after the existing strict database migration step and before the aggregate strict verification step.

## GitHub Actions Result

```text
Pending at report creation.
```

This report must be read with the PR head GitHub Actions result. Migration retry verification is GO only if the GitHub Actions retry step passes on the PR head.

## What This Proves

If GitHub Actions passes on the PR head, this proves under the CI verification environment that:

- The strict migration sequence can run twice on the same database.
- No duplicate trigger failure occurred during retry.
- No duplicate type failure occurred during retry.
- No duplicate table or index failure occurred during retry.
- No duplicate RLS or policy failure occurred during retry.
- Patch 002 migration is retry-safe under the CI verification environment.

## What This Does Not Prove

This does not prove:

- DB-backed runtime persistence.
- Production authentication.
- Pilot readiness.
- Production readiness.
- Runtime/SQL parity.
- Production observability, security, or deployment readiness.

## Remaining Blockers

```text
DB-backed repository layer.
Production authentication.
Runtime/SQL parity verification.
Production observability/security/deployment.
Pilot readiness review.
```

## Final Decision

```text
Migration retry verification: GO only if GitHub Actions retry step passes on PR head.
Patch 002 SQL activation: GO for strict migration order only.
DB-backed runtime persistence: NO-GO.
Sprint 5 coding: NO-GO.
Pilot: NO-GO.
Production: NO-GO.
```
