# Migration Retry Verification Plan

## 1. Executive Decision

- Migration retry verification planning: GO.
- Migration retry verification implementation: NO-GO until this plan is reviewed.
- Patch 002 SQL activation: GO for strict migration order only.
- DB-backed runtime persistence: NO-GO.
- Sprint 5 coding: NO-GO.
- Pilot: NO-GO.
- Production: NO-GO.

This document is planning only. It does not implement a retry helper, change migration order, change SQL, modify runtime behavior, or claim retry verification is complete.

## 2. Problem Statement

Current GitHub Actions strict verification proves that the strict migration sequence can run once on a clean PostgreSQL database. It does not prove that the same strict migration sequence can be rerun safely on the same already-migrated database.

Patch 002 was contract-hardened before activation. It includes trigger idempotency guards, `CREATE TABLE IF NOT EXISTS`, `CREATE INDEX IF NOT EXISTS`, `CREATE TYPE` guarded by duplicate-object handling, and `DROP POLICY IF EXISTS` plus `CREATE POLICY` patterns. Those patterns are designed to support retry safety, but retry safety still must be proven with an actual same-database repeat run.

Migration retry verification is required before Pilot or Production readiness and should be completed before broadening scope into DB-backed runtime persistence or Sprint 5 coding.

## 3. Current Migration Sequence

The current strict migration order is:

1. `docs/marketing_os_v5_6_5_phase_0_1_schema.sql`
2. `docs/marketing_os_v5_6_5_phase_0_1_schema_patch_001.sql`
3. `docs/marketing_os_v5_6_5_phase_0_1_schema_patch_002.sql`

Patch 002 must remain after Patch 001. Retry verification must run this exact same order twice against the same database. Manual database edits, manual cleanup, dropping objects between runs, or resetting the database between runs must not count as retry evidence.

## 4. Retry Verification Objective

Retry verification succeeds only when all of the following are true:

- The strict migration sequence runs once on a clean database.
- The same strict migration sequence runs again on the same database.
- The second run exits successfully.
- No duplicate trigger errors occur.
- No duplicate type errors occur.
- No duplicate table or index errors occur.
- No RLS or policy creation errors occur.
- No permission seed conflict errors occur.
- No destructive schema changes are required.
- No manual cleanup occurs between the first and second run.

## 5. Proposed Implementation Options

### Option A: Dedicated Retry Verification Script

Add a dedicated helper, for example `scripts/db-migrate-retry.js`, that invokes the existing strict migration behavior twice against the same `DATABASE_URL`.

Pros:
- Keeps normal `db:migrate:strict` semantics unchanged.
- Creates a reusable local and CI verification entrypoint.
- Makes retry intent explicit and auditable.
- Keeps retry behavior isolated from the existing migration runner.

Cons:
- Requires a new script file.
- May require a new `package.json` script such as `db:migrate:retry`.
- Must be careful to reuse the same database without dropping or resetting it.

### Option B: Extend Existing Migration Runner With A Retry Flag

Add a flag such as `--retry-twice` to `scripts/db-migrate.js` so the same runner can execute the strict migration sequence twice.

Pros:
- Avoids duplicating migration-order logic.
- Keeps retry behavior close to the existing migration runner.
- Can share the same strict-mode validation paths directly.

Cons:
- Higher risk of accidentally weakening or complicating normal strict migration behavior.
- Adds conditional behavior to a critical script that already gates CI.
- Requires careful review to ensure the default strict path remains unchanged.

### Option C: Add A GitHub Actions Retry Step

Add a workflow step that runs `npm run db:migrate:strict` twice against the same PostgreSQL service database.

Pros:
- Minimal scripting if the existing command is safe to call twice.
- Directly proves retry behavior in CI against the same service database.
- Simple to understand in the workflow log.

Cons:
- Does not provide a dedicated local retry command unless paired with a package script.
- Can be fragile if another verification step mutates or resets the database before the second run.
- Provides less structured failure reporting than a purpose-built helper.

Recommended option: Option A, with an optional CI workflow step that calls the dedicated retry command after it is reviewed. Option A is the safest default because it keeps normal migration semantics unchanged while creating explicit retry evidence.

## 6. Recommended Approach

Proceed with a later Migration Retry Verification implementation PR that adds a dedicated retry verification helper. The helper should run the existing strict migration sequence twice against the same `DATABASE_URL` without changing `db:migrate:strict`, without changing migration order, and without adding app runtime behavior.

The implementation should be conservative:

- Do not weaken `db:migrate:strict`.
- Do not change the current migration order.
- Do not add runtime handlers or endpoints.
- Do not alter SQL unless the retry run exposes a real blocking idempotency defect.
- Do not claim Pilot or Production readiness from retry success alone.

## 7. Future Allowed File Changes For Implementation PR

A future retry verification implementation PR may modify:

- `scripts/db-migrate-retry.js` or an equivalent new retry helper.
- `package.json` only if adding a script such as `db:migrate:retry`.
- `.github/workflows/sprint0-verify.yml` only to add a retry verification step.
- `docs/migration_retry_verification_report.md`.

A future retry verification implementation PR must not modify:

- SQL files unless retry exposes a real blocking defect.
- OpenAPI files.
- `src/router.js`.
- `src/store.js`.
- Runtime handlers.
- Endpoints.
- Patch 002 runtime behavior.

## 8. Required Verification Commands For Implementation PR

A future implementation PR must run and report:

- `npm run db:migrate:strict`
- `npm run db:migrate:retry`, if added
- `npm run verify:strict`
- `npm run openapi:lint:strict`
- `npm test`
- `npm run test:integration`
- `npm run db:seed`
- GitHub Actions strict verification

The retry command must prove same-database repeat execution. A clean one-time migration is not sufficient retry evidence.

## 9. Failure Policy

- If retry verification fails, do not merge the retry implementation PR.
- If retry exposes a SQL idempotency defect, create a separate minimal SQL fix PR unless the approved implementation scope explicitly allows the fix.
- Do not hide, suppress, or downgrade retry failures.
- Do not reset, drop, or recreate the database between the first and second migration run.
- Do not manually edit database state as acceptance evidence.
- Do not mark Pilot or Production ready based only on clean strict migration or retry migration success.

## 10. Risk Register

- False confidence from clean-only migration.
- Hidden duplicate trigger or policy errors.
- Destructive migration risk.
- Inconsistent local versus CI database behavior.
- Accidental weakening of strict migration checks.
- Accidental production-readiness claim.
- Scope creep into DB-backed runtime persistence.
- Scope creep into Sprint 5 coding.

## 11. Readiness Matrix

| Area | Status |
| --- | --- |
| Clean strict migration | GO |
| Retry migration verification | Pending |
| Patch 002 SQL activation | GO for strict migration order only |
| DB-backed runtime persistence | NO-GO |
| Sprint 5 coding | NO-GO |
| Pilot | NO-GO |
| Production | NO-GO |

## 12. Final Recommendation

Recommendation: Proceed to Migration Retry Verification implementation PR.

Reasoning: Patch 002 is already included in the strict migration order, and CI has proven a clean migration run. The next narrow gate is same-database retry proof. Completing that gate before DB-backed repository planning or Sprint 5 planning reduces migration uncertainty without expanding runtime scope, changing product behavior, or implying Pilot or Production readiness.

Final status:

- Migration retry verification planning: GO.
- Migration retry verification implementation: NO-GO until this plan is reviewed.
- Retry verification completion: not complete.
- Patch 002 SQL activation: GO for strict migration order only.
- DB-backed runtime persistence: NO-GO.
- Sprint 5 coding: NO-GO.
- Pilot: NO-GO.
- Production: NO-GO.
