# Nashir OpenAPI Runtime Reconciliation Report

Date: 2026-05-17

## Current Contract / Runtime Status

- `docs/nashir_openapi_patch.yaml` documents the Nashir campaign and evidence route surface.
- Main OpenAPI activation remains separately gated.
- Generated clients remain NO-GO.
- Repository modes are runtime configuration behavior, not automatic API activation.
- Default runtime remains `in_memory`.

## Reconciliation Findings

- Route paths remain accurate for campaign list/create/read-by-id and evidence list/create/read-by-id.
- Request and response envelopes remain accurate: current Nashir responses continue to use `{ data: ... }`.
- Response schemas remain mode-agnostic for the public API shape.
- Repository mode changes persistence behavior, but it does not change the public API shape.
- Non-disclosure 404 behavior remains accurate for missing, cross-workspace, and cross-campaign resources.
- 401 and 403 behavior remains accurate for unauthenticated/invalid users and missing permissions.
- Examples should remain mode-agnostic; repository-mode examples would risk documenting implementation detail as contract.

## Risks / Gaps

- Some OpenAPI wording still references in-memory evidence behavior and could imply a specific persistence mode.
- No known public schema field differs between `in_memory` and `repository` outputs for the covered routes.
- Audit/event behavior remains route-level behavior; repository lifecycle events are persistence internals and should not become public API contract without a separate gate.
- Generated-client risk remains because the Nashir patch is not a generated-client activation.
- Route/spec drift risk is low for current paths but should be checked if wording is updated.
- Main OpenAPI activation remains a separate risk and must stay gated.

## Recommended Next PR

Recommended next PR: docs: reconcile Nashir OpenAPI patch wording for mode-agnostic behavior.

## GO / NO-GO

- GO only for documentation reconciliation.
- NO-GO for OpenAPI YAML changes in this PR.
- NO-GO for generated clients.
- NO-GO for runtime changes.
- NO-GO for MVP, Pilot, or Production readiness claims.
