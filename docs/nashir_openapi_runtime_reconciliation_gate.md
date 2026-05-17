# Nashir OpenAPI Runtime Reconciliation Gate

Date: 2026-05-17

## Current Verified Status

- Nashir campaign and evidence repository modes exist.
- Both runtime modes default to `in_memory`.
- Repository modes are explicit only; `DATABASE_URL` alone must not activate them.
- Existing `docs/nashir_openapi_patch.yaml` documents the Nashir campaign and evidence route surfaces.
- Main OpenAPI activation remains not approved unless separately gated.
- Generated clients remain NO-GO unless separately gated.

## Reconciliation Questions

- Does current OpenAPI need to document runtime mode behavior?
- Does current OpenAPI need to document repository-mode persistence semantics?
- Should repository-mode behavior be documented as implementation detail rather than API contract?
- Is the current `docs/nashir_openapi_patch.yaml` still accurate after PR #251?
- Does the main OpenAPI remain intentionally unchanged?
- Are response schemas still accurate for both `in_memory` and `repository` modes?
- Are error responses still accurate for non-disclosure 404, 401, and 403?
- Does OpenAPI need repository-mode examples, or should examples remain mode-agnostic?

## Candidate Future Scopes

1. Option A: Documentation-only reconciliation report.
2. Option B: Update `docs/nashir_openapi_patch.yaml` only.
3. Option C: Gate main OpenAPI activation separately.
4. Option D: Gate generated clients separately.

Recommended immediate next PR: Option A, documentation-only reconciliation report.

## NO-GO For This PR

- No OpenAPI YAML changes.
- No generated clients.
- No runtime changes.
- No SQL/migrations.
- No UI/prototype.
- No package/workflow changes.
- No MVP, Pilot, or Production readiness claims.

## Future Allowed Files

- Documentation-only reconciliation: docs only.
- OpenAPI patch reconciliation: `docs/nashir_openapi_patch.yaml` plus logs.
- Main OpenAPI activation: separate gate required.
- Generated clients: separate gate required.

## Required Future Verification

- `git diff --check`
- `npm test`
- `npm run openapi:lint:strict`
- If OpenAPI YAML is changed later, verify strict lint and route/spec consistency.

## GO / NO-GO

- GO only for documenting the reconciliation decision path.
- NO-GO for changing contracts in this PR.
- NO-GO for claiming API activation or client readiness.
