# Nashir Backend Status After Campaign Runtime Mode

Date: 2026-05-16

## Current Backend Status

- Patch 003 is active in the migration chain for Nashir evidence persistence.
- Patch 004 is active in the migration chain for Nashir campaign persistence.
- `NASHIR_EVIDENCE_RUNTIME_MODE` exists and defaults to `in_memory`.
- `NASHIR_CAMPAIGN_RUNTIME_MODE` exists and defaults to `in_memory`.
- `DATABASE_URL` alone must not activate either repository mode.
- Evidence and campaign runtime modes are independently controlled.

## Explicit Repository Modes

When explicitly enabled, repository mode can back:

- Evidence list/create/read-by-id routes.
- Campaign list/create/read routes.

## Still In-Memory Or Not Implemented

- Default runtime remains `in_memory`.
- Campaign update/delete routes are not implemented.
- Approval flow is not implemented.
- Publishing flow is not implemented.
- Readiness scoring remains limited to current advisory behavior.
- UI is not ready.
- Generated clients are not updated.
- OpenAPI activation beyond the current Nashir patch status is not approved.

## Governance Status

- No MVP, Pilot, or Production readiness is claimed.
- No UI readiness is claimed.
- No OpenAPI main-spec activation is approved unless separately gated.
- No campaign update/delete scope is approved.
- No lifecycle expansion is approved.

## Next Options

1. OpenAPI/runtime reconciliation for repository-mode behavior.
2. Integration/smoke verification for repository modes.
3. UI surface gate.
4. Campaign lifecycle/approval expansion.
5. Documentation consolidation.

Recommended next PR: OpenAPI/runtime reconciliation for repository-mode behavior.
