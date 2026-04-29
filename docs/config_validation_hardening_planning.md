# Config Validation Hardening Planning

## Executive Decision

- Config Validation Hardening Planning: GO.
- Config validation implementation: NO-GO until this plan is reviewed.
- Brand runtime switch remains gated.
- Default runtime remains in-memory.
- DB-backed full persistence: NO-GO.
- Public Brand get/update routes: NO-GO.
- SQL/OpenAPI changes: NO-GO.
- Sprint 5 coding: NO-GO.
- Pilot: NO-GO.
- Production: NO-GO.

## Problem Statement

`BRAND_RUNTIME_MODE` currently supports `in_memory` and `repository`. Invalid values may fall back to `in_memory`.

That conservative fallback prevents accidental DB-backed activation, which is operationally safe for the current project state. However, silent fallback can hide misconfiguration in CI, staging, or future production-like environments. A documented hardening decision is required before changing runtime behavior.

This document is planning only. It does not change config behavior, router behavior, repository behavior, SQL, OpenAPI, tests, workflows, or runtime mode defaults.

## Current Config Behavior

Observed from `src/config.js` and current Brand runtime switch wiring:

| Scenario | Current behavior | Notes |
| --- | --- | --- |
| `BRAND_RUNTIME_MODE` missing and `ENABLE_DB_BACKED_BRAND_ROUTES` missing | resolves to `in_memory` | Default runtime remains in-memory. |
| `BRAND_RUNTIME_MODE=in_memory` | resolves to `in_memory` | Explicit in-memory mode is honored. |
| `BRAND_RUNTIME_MODE=repository` | resolves to `repository` | Repository mode is explicitly requested. |
| `BRAND_RUNTIME_MODE` has an invalid value | resolves to `in_memory` | Current fallback is safe but silent. |
| `ENABLE_DB_BACKED_BRAND_ROUTES=true` and `BRAND_RUNTIME_MODE` missing | resolves to `repository` | Backward-compatible activation path for the gated Brand route switch. |
| `ENABLE_DB_BACKED_BRAND_ROUTES=true` and `BRAND_RUNTIME_MODE=in_memory` | resolves to `in_memory` | Explicit `BRAND_RUNTIME_MODE` wins. |
| `ENABLE_DB_BACKED_BRAND_ROUTES=true` and `BRAND_RUNTIME_MODE=repository` | resolves to `repository` | Explicit `BRAND_RUNTIME_MODE` wins. |
| Repository mode without `DATABASE_URL` | fails clearly when repository mode creates the DB pool | `DATABASE_URL` is read from config/environment; the repository pool path requires it. |

Current priority:

1. Explicit `BRAND_RUNTIME_MODE` is evaluated first.
2. If it is valid, it determines mode.
3. If it is invalid, current behavior falls back to `in_memory`.
4. If it is absent, `ENABLE_DB_BACKED_BRAND_ROUTES=true` enables `repository`; otherwise the mode is `in_memory`.

## Risk Analysis

- Silent invalid config risk: an operator can set `BRAND_RUNTIME_MODE=repositry` and believe repository mode is active while the app silently runs in-memory.
- Accidental repository activation risk: hardening must not make repository mode easier to activate accidentally.
- Accidental production behavior change risk: future implementation must not change the default from `in_memory`.
- CI/test environment drift: invalid values in CI could silently exercise the wrong path.
- Local developer confusion: local `.env` mistakes may appear as missing DB-backed behavior rather than config errors.
- Backward compatibility risk: existing workflows may rely on absent `BRAND_RUNTIME_MODE` defaulting to `in_memory`.
- Over-hardening risk: failing on absent mode would break current safe local defaults.
- False DB-backed full persistence signal: stricter config validation must not be interpreted as production DB-backed persistence readiness.

## Candidate Hardening Options

### Option A: Keep Current Behavior

Invalid `BRAND_RUNTIME_MODE` continues to fall back to `in_memory`.

Pros:

- Lowest implementation risk.
- Preserves current behavior exactly.
- Prevents accidental DB-backed activation.
- Does not break existing local workflows.

Cons:

- Continues to hide typos and deployment misconfiguration.
- CI/staging can report green while exercising the wrong runtime path.
- Makes repository-mode rollout harder to reason about.

### Option B: Fail Fast On Invalid `BRAND_RUNTIME_MODE`

Missing `BRAND_RUNTIME_MODE` still defaults to `in_memory`, but an explicit invalid value causes a safe configuration error.

Pros:

- Makes explicit misconfiguration visible.
- Preserves safe default for missing config.
- Prevents false confidence that repository mode is active.
- Keeps repository mode explicit.

Cons:

- Could break environments that currently set arbitrary or stale values.
- Requires tests for error behavior and secret-safe messaging.
- Needs clear documentation so local developers understand the failure.

### Option C: Warn While Falling Back To `in_memory`

Invalid `BRAND_RUNTIME_MODE` emits a warning or diagnostic and falls back to `in_memory`.

Pros:

- Preserves runtime continuity.
- Gives some visibility into misconfiguration.
- Lower operational breakage than fail-fast.

Cons:

- Warnings may be missed in CI or hosted logs.
- Runtime still starts in a mode different from the operator intent.
- Requires a warning/reporting surface that does not currently exist as a formal contract.

### Option D: Strict Mode In CI/Staging, Fallback Locally

Invalid `BRAND_RUNTIME_MODE` fails in strict environments but falls back locally.

Pros:

- Catches CI/staging mistakes.
- Keeps local development forgiving.
- Can be introduced progressively.

Cons:

- Environment-dependent behavior is more complex.
- Requires defining which environment flags trigger strict mode.
- Can still surprise developers when local and CI behavior differ.
- Adds policy surface beyond the current simple config resolver.

## Recommendation

Recommended future behavior: Option B, fail fast on invalid explicit `BRAND_RUNTIME_MODE`.

The conservative recommendation is:

- Missing `BRAND_RUNTIME_MODE` still defaults to `in_memory`.
- `BRAND_RUNTIME_MODE=in_memory` resolves to `in_memory`.
- `BRAND_RUNTIME_MODE=repository` resolves to `repository`.
- Invalid explicit `BRAND_RUNTIME_MODE` raises a safe configuration error.
- `ENABLE_DB_BACKED_BRAND_ROUTES=true` remains backward-compatible, but only when `BRAND_RUNTIME_MODE` is absent.
- Explicit `BRAND_RUNTIME_MODE` always wins over `ENABLE_DB_BACKED_BRAND_ROUTES`.
- Repository mode still requires `DATABASE_URL` when the repository route path needs a database connection.

This approach catches intentional-but-invalid configuration while preserving the safe no-config default.

## Proposed Future Behavior

| Scenario | Proposed behavior |
| --- | --- |
| Missing `BRAND_RUNTIME_MODE` | `in_memory` |
| `BRAND_RUNTIME_MODE=in_memory` | `in_memory` |
| `BRAND_RUNTIME_MODE=repository` | `repository` |
| Invalid explicit `BRAND_RUNTIME_MODE` | safe configuration error |
| `ENABLE_DB_BACKED_BRAND_ROUTES=true` with no `BRAND_RUNTIME_MODE` | `repository` |
| `ENABLE_DB_BACKED_BRAND_ROUTES=true` with explicit `BRAND_RUNTIME_MODE=in_memory` | `in_memory` |
| `ENABLE_DB_BACKED_BRAND_ROUTES=true` with explicit `BRAND_RUNTIME_MODE=repository` | `repository` |
| Repository mode without `DATABASE_URL` | clear database configuration failure when repository mode is used |

No automatic production activation is approved by this plan.

## Error Handling Policy

Future implementation should follow these rules:

- Invalid config should produce a safe configuration error.
- Error text may mention the config key and allowed values only.
- Error text must not expose secrets or an environment dump.
- Error text must not include connection strings, hostnames, usernames, passwords, tokens, or full process environment output.
- Runtime behavior must not partially start in an ambiguous mode.
- Config errors must not be framed as DB-backed full persistence readiness.

Example allowed information:

```text
Invalid BRAND_RUNTIME_MODE. Allowed values: in_memory, repository.
```

## Test Plan For Future Implementation

Tests are not implemented in this PR. A future implementation PR should cover:

- missing `BRAND_RUNTIME_MODE` defaults to `in_memory`.
- `BRAND_RUNTIME_MODE=in_memory` returns `in_memory`.
- `BRAND_RUNTIME_MODE=repository` returns `repository`.
- invalid `BRAND_RUNTIME_MODE` throws a safe configuration error.
- `ENABLE_DB_BACKED_BRAND_ROUTES=true` returns `repository` only when `BRAND_RUNTIME_MODE` is absent.
- explicit `BRAND_RUNTIME_MODE=in_memory` overrides `ENABLE_DB_BACKED_BRAND_ROUTES=true`.
- explicit `BRAND_RUNTIME_MODE=repository` requires `DATABASE_URL` when repository route behavior is used.
- config errors do not expose secrets, connection strings, usernames, passwords, hostnames, stack traces, or environment dumps.
- existing Brand runtime switch tests still pass.
- existing Sprint 0/1/2/3/4/Patch 002 tests still pass.

## Files Likely Changed In Future Implementation

Likely changed:

- `src/config.js`
- `test/integration/db-backed-brand-runtime-switch.integration.test.js` or a new config-focused test file
- `docs/config_validation_hardening_implementation_report.md`
- `docs/17_change_log.md`

Likely not changed:

- SQL files
- OpenAPI files
- package files
- workflow files
- migration runner
- router/store behavior
- endpoints

Any future implementation that needs to change SQL, OpenAPI, endpoints, package files, workflows, migration runner, router/store behavior, or product runtime behavior should stop and open a separate reviewed plan.

## Go / No-Go For Future Implementation

GO only if:

- this plan is reviewed.
- behavior is limited to config validation.
- default remains `in_memory`.
- repository mode remains explicit.
- tests cover invalid config.
- no SQL/OpenAPI changes are needed.
- no route behavior changes are mixed in.

NO-GO if:

- implementation changes route behavior.
- repository mode becomes default.
- implementation expands into DB-backed full persistence.
- implementation requires package/workflow changes without justification.
- implementation touches SQL/OpenAPI.
- Sprint 5 scope is mixed in.
- Pilot/Production readiness is claimed.

## Recommended Next Step

Preferred sequence:

1. Create a Brand Runtime Switch Post-Merge Verification Report first if one has not already been merged.
2. Proceed to Config Validation Hardening Implementation PR only after this plan is reviewed.
3. Do not start DB-backed Slice 2 until Brand runtime config behavior is explicit.

If the post-merge verification report is already merged before implementation begins, the next step may be the Config Validation Hardening Implementation PR, limited to config validation only.

## Final Decision

```text
Config Validation Hardening Planning: GO.
Config validation implementation: NO-GO until reviewed.
Brand runtime switch remains gated.
Default runtime remains in-memory.
DB-backed full persistence: NO-GO.
Sprint 5 coding: NO-GO.
Pilot: NO-GO.
Production: NO-GO.
```
