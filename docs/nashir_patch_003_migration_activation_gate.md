# Nashir Patch 003 Migration Activation Record

## 1. Status

```text
Task classification:           SQL/schema/migration activation + documentation correction.
Patch 003 schema artifact:     Present as documentation/schema artifact.
Patch 003 migration activation: Activated by PR #241 in the effective migration runner order.
Runtime route wiring:          NO-GO.
DB repository wiring to router:    NO-GO.
UI/prototype changes:          NO-GO.
OpenAPI YAML changes:          NO-GO.
Generated client changes:      NO-GO.
MVP:                           NO-GO.
Pilot:                         NO-GO.
Production:                    NO-GO.
```

## 2. Current Verified Status

- PR #239 closed the GET evidence-by-id OpenAPI/runtime drift using existing in-memory Nashir Slice 0 behavior.
- Patch 003 exists as the schema artifact for future Nashir evidence lifecycle persistence.
- PR #241 activates Patch 003 in `scripts/db-migrate.js` after Patch 002 in the effective migration runner order.
- `test/sprint0.test.js` verifies the approved migration order includes:
  - `docs/marketing_os_v5_6_5_phase_0_1_schema.sql`
  - `docs/marketing_os_v5_6_5_phase_0_1_schema_patch_001.sql`
  - `docs/marketing_os_v5_6_5_phase_0_1_schema_patch_002.sql`
  - `docs/marketing_os_v5_6_5_phase_0_1_schema_patch_003.sql`
- `NashirEvidenceLifecycleRepository` remains repository-only and is not wired to runtime routes.

This PR activates Patch 003 in the migration order only. It does not modify SQL content, runtime code, OpenAPI YAML, generated clients, UI, prototype files, or package files.

## 3. Implementation Scope

PR #241:

- Adds Patch 003 to the approved migration execution order after Patch 002.
- Updates migration verification tests so the expected order includes Patch 003.
- Leaves migration retry behavior unchanged.

PR #241 does not wire DB-backed Nashir evidence persistence into runtime routes. Runtime DB wiring remains separately gated and NO-GO in this PR.

## 4. Files In Scope

This activation scope is limited to:

- `scripts/db-migrate.js`
- `test/sprint0.test.js`
- `docs/nashir_patch_003_migration_activation_gate.md`
- `docs/03_decision_log.md`
- `docs/17_change_log.md`

## 5. Explicit NO-GO

- Runtime route wiring.
- DB repository wiring to router.
- UI or prototype work.
- OpenAPI YAML changes.
- Generated client changes.
- Broader evidence lifecycle transitions.
- Campaign DB persistence unless separately gated.
- MVP, Pilot, or Production readiness claims.

## 6. Verification

Required verification for PR #241:

```text
npm test
npm run db:migrate:strict
npm run db:migrate:retry
npm run openapi:lint:strict
git diff --check
```

If strict or retry migration execution cannot run because the environment lacks `DATABASE_URL`, the PR must not claim full migration execution verification from that local run.

## 7. GO / NO-GO

```text
GO:    PR #241 activates Patch 003 in migration order and verifies Patch 003 order/presence in migration tests.
NO-GO: PR #241 attempts runtime DB wiring.
NO-GO: PR #241 attempts DB repository wiring to router.
NO-GO: PR #241 adds UI/API/generated-client connection work.
NO-GO: PR #241 adds broader evidence lifecycle transitions.
NO-GO: PR #241 claims MVP, Pilot, or Production readiness.
```
