# Config Validation Hardening Implementation Report

## Executive Status

```text
Config Validation Hardening Implementation: GO only if GitHub Actions passes.
Default runtime remains in-memory.
Brand runtime switch remains gated.
DB-backed full persistence: NO-GO.
Sprint 5/Pilot/Production: NO-GO.
```

This implementation is limited to config validation hardening for Brand runtime mode. It does not change Brand route behavior, router/store behavior, repository behavior, SQL, OpenAPI, package files, workflows, scripts, migration runner, endpoints, DB-backed full persistence, Sprint 5, Pilot, or Production scope.

## Files Changed

```text
src/config.js
test/config.test.js
docs/config_validation_hardening_implementation_report.md
docs/17_change_log.md
```

## Behavior Implemented

| Scenario | Result |
| --- | --- |
| Missing `BRAND_RUNTIME_MODE` | `in_memory` |
| `BRAND_RUNTIME_MODE=in_memory` | `in_memory` |
| `BRAND_RUNTIME_MODE=repository` | `repository` |
| Invalid explicit `BRAND_RUNTIME_MODE` | safe `ConfigurationError` |
| `ENABLE_DB_BACKED_BRAND_ROUTES=true` with absent `BRAND_RUNTIME_MODE` | `repository` |
| Explicit `BRAND_RUNTIME_MODE=in_memory` with enable flag | `in_memory` |
| Explicit `BRAND_RUNTIME_MODE=repository` with enable flag | `repository` |

Invalid explicit `BRAND_RUNTIME_MODE` now throws:

```text
ConfigurationError
code: INVALID_BRAND_RUNTIME_MODE
message: Invalid BRAND_RUNTIME_MODE. Allowed values: in_memory, repository.
```

Empty `BRAND_RUNTIME_MODE` is treated as absent for compatibility with missing environment values.

## Safety Controls

- No secret exposure in the config error message.
- No environment dump in the config error message.
- No `DATABASE_URL`, connection string, hostname, username, password, token, or secret value in the config error message.
- No route behavior change.
- No router/store behavior change.
- No repository behavior change.
- No repository mode default activation.
- Missing `BRAND_RUNTIME_MODE` still defaults to `in_memory`.
- Repository mode remains explicit through valid `BRAND_RUNTIME_MODE=repository` or the backward-compatible enable flag when `BRAND_RUNTIME_MODE` is absent.
- Existing repository-mode `DATABASE_URL` requirement is preserved.

## Tests Added

Added `test/config.test.js` covering:

- Missing `BRAND_RUNTIME_MODE` defaults to `in_memory`.
- `BRAND_RUNTIME_MODE=in_memory` resolves to `in_memory`.
- `BRAND_RUNTIME_MODE=repository` resolves to `repository`.
- Invalid `BRAND_RUNTIME_MODE` throws `ConfigurationError`.
- Invalid-mode error message includes only allowed values and safe text.
- Invalid-mode error message does not expose `DATABASE_URL` or secret-like values.
- `ENABLE_DB_BACKED_BRAND_ROUTES=true` resolves to `repository` when `BRAND_RUNTIME_MODE` is absent.
- Explicit `BRAND_RUNTIME_MODE=in_memory` overrides `ENABLE_DB_BACKED_BRAND_ROUTES=true`.
- Explicit `BRAND_RUNTIME_MODE=repository` overrides `ENABLE_DB_BACKED_BRAND_ROUTES=true`.
- Empty `BRAND_RUNTIME_MODE` preserves missing-mode compatibility.

Existing Brand runtime switch tests remain part of `npm run test:integration`.

## Commands Run

Required verification commands for the PR gate:

```text
npm run openapi:lint:strict
npm test
npm run test:integration
npm run db:seed
npm run db:migrate:strict
npm run db:migrate:retry
npm run verify:strict
```

Because this workspace is not a local git checkout, command execution is expected through GitHub Actions strict verification on the PR head.

## GitHub Actions Result

Pending until the PR head strict verification run completes.

## Explicitly Not Implemented

```text
NO-GO: route behavior changes.
NO-GO: router/store behavior changes.
NO-GO: repository behavior changes.
NO-GO: public Brand get/update routes.
NO-GO: SQL changes.
NO-GO: OpenAPI changes.
NO-GO: package/workflow changes.
NO-GO: migration runner changes.
NO-GO: scripts changes.
NO-GO: DB-backed full persistence.
NO-GO: Campaign/Brief/Patch002 persistence.
NO-GO: Sprint 5.
NO-GO: Pilot.
NO-GO: Production.
```

## Remaining Blockers

- DB-backed Slice 2 candidate not selected.
- Durable AuditLog persistence not implemented.
- Other product domains remain in-memory.
- Production auth, observability, and deployment are not complete.
- Pilot readiness review is not complete.

## Final Decision

```text
Config Validation Hardening Implementation: GO if strict verification passes.
Brand runtime switch remains gated.
Default runtime remains in-memory.
DB-backed full persistence: NO-GO.
Sprint 5/Pilot/Production: NO-GO.
```
