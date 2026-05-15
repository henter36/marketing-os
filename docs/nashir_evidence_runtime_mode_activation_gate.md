# Nashir Evidence Runtime Mode Activation Gate

## 1. Current Status

- Patch 003 is active in the effective migration order.
- `NashirEvidenceLifecycleRepository` evidence route wiring exists only through explicit `createApp({ evidenceRepository })` injection.
- `DATABASE_URL` alone must not activate Nashir evidence DB runtime.
- Nashir campaigns remain in-memory.
- No campaign DB persistence is approved by this gate.

## 2. Future Implementation Candidate

A future runtime PR may add an explicit runtime mode for Nashir evidence persistence.

Preferred mode name:

```text
NASHIR_EVIDENCE_RUNTIME_MODE
```

Allowed values:

```text
in_memory
repository
```

Default:

```text
in_memory
```

`repository` mode may create or use `NashirEvidenceLifecycleRepository` only when explicitly selected. `repository` mode must require `DATABASE_URL` or an existing pool. Invalid `NASHIR_EVIDENCE_RUNTIME_MODE` values must fail closed with a safe configuration error.

## 3. Future Allowed Files

Future implementation scope may include:

- `config.js` or the current `src/config.js` equivalent.
- `src/router.js`.
- `src/repositories/index.js` or the repository factory only if strictly needed.
- Test configuration/runtime mode tests.
- `test/nashir-route.test.js` or directly relevant evidence runtime mode tests.

## 4. Future Forbidden Scope

- SQL files.
- Migrations.
- OpenAPI YAML.
- Generated clients.
- Package files.
- `ui/`.
- `prototype/`.
- Campaign DB persistence.
- Broader evidence lifecycle transitions.
- Approval flow.
- Readiness scoring.
- MVP, Pilot, or Production readiness claims.

## 5. Required Future Tests

- Default mode remains `in_memory` even when `DATABASE_URL` exists.
- `repository` mode uses `NashirEvidenceLifecycleRepository`.
- `repository` mode fails closed without `DATABASE_URL` or a pool.
- Invalid `NASHIR_EVIDENCE_RUNTIME_MODE` fails closed.
- Existing in-memory tests continue passing.
- Membership, permission, and campaign guards still run before repository calls.
- No OpenAPI or SQL changes.

## 6. Required Future Verification

```text
git diff --check
npm test
npm run db:migrate:strict
npm run db:migrate:retry
npm run openapi:lint:strict
```

## 7. GO / NO-GO

```text
GO:    Future PR adds explicit Nashir evidence runtime mode activation.
NO-GO: Future PR activates Nashir evidence DB runtime implicitly from DATABASE_URL alone.
NO-GO: Future PR adds campaign DB persistence.
NO-GO: Future PR modifies SQL or migrations.
NO-GO: Future PR adds UI/API/generated-client changes.
NO-GO: Future PR adds lifecycle transitions beyond submitted evidence.
NO-GO: Future PR claims MVP, Pilot, or Production readiness.
```
