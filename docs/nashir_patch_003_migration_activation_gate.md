# Nashir Patch 003 Migration Activation Gate

## 1. Status

```text
Task classification:           Documentation-only / migration activation gate.
Patch 003 schema artifact:     Present as documentation/schema artifact.
Patch 003 migration activation: NO-GO until a separately approved implementation PR.
Runtime route wiring:          NO-GO.
DB repository route wiring:    NO-GO.
UI/prototype changes:          NO-GO.
OpenAPI YAML changes:          NO-GO.
Generated client changes:      NO-GO.
Pilot:                         NO-GO.
Production:                    NO-GO.
```

## 2. Current Verified Status

- PR #239 closed the GET evidence-by-id OpenAPI/runtime drift using existing in-memory Nashir Slice 0 behavior.
- Patch 003 exists as a documentation/schema artifact for future Nashir evidence lifecycle persistence.
- Patch 003 is not yet activated in the effective migration runner or CI migration chain.
- `NashirEvidenceLifecycleRepository` remains repository-only and is not wired to runtime routes.

This document does not activate Patch 003 and does not modify SQL, migration scripts, CI workflows, runtime code, tests, OpenAPI YAML, generated clients, UI, or prototype files.

## 3. Future Implementation Scope

A future separately approved implementation PR may:

- Activate Patch 003 in the approved migration order.
- Update migration verification tests as required to verify Patch 003 presence and order.
- Update CI checks only if strictly necessary to verify Patch 003 presence and order.
- Reconcile documented migration order only if needed to keep documentation consistent with the effective runner order.

The future implementation PR must preserve Patch 003 as migration activation work only. It must not wire DB-backed Nashir evidence persistence into runtime routes.

## 4. Future Allowed Files

Future implementation PR file scope may include:

- `scripts/db-migrate.js`
- `test/sprint0.test.js` or other directly relevant migration verification tests
- `.github/workflows/sprint0-verify.yml`, only if strictly necessary
- `docs/07_database_schema.sql`, only if needed to reconcile documented order

Any additional file requires a separate gate before implementation.

## 5. Explicit NO-GO

- Runtime route wiring.
- DB repository wiring to router.
- UI or prototype work.
- OpenAPI YAML changes.
- Generated client changes.
- Broader evidence lifecycle transitions.
- Campaign DB persistence unless separately gated.
- MVP, Pilot, or Production readiness claims.

## 6. Required Verification for Future PR

```text
npm test
npm run db:migrate:strict
npm run db:migrate:retry
npm run openapi:lint:strict
git diff --check
```

If any required verification cannot run, the future implementation PR must not be marked fully verified.

## 7. GO / NO-GO

```text
GO:    Future PR activates Patch 003 in migration order and verifies migration presence/order.
NO-GO: Future PR attempts runtime DB wiring.
NO-GO: Future PR wires NashirEvidenceLifecycleRepository to router/service runtime routes.
NO-GO: Future PR adds UI/API/generated-client connection work.
NO-GO: Future PR adds broader evidence lifecycle transitions.
NO-GO: Future PR claims MVP, Pilot, or Production readiness.
```
