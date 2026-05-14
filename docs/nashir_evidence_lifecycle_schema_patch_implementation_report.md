# Nashir Evidence Lifecycle Schema Patch 003 Implementation Report

## Purpose

Document the implementation of documentation-contained SQL Patch 003 for future DB-backed Nashir evidence lifecycle persistence.

## Files Changed

- `docs/marketing_os_v5_6_5_phase_0_1_schema_patch_003.sql`
- `docs/07_database_schema.sql`
- `docs/nashir_evidence_lifecycle_schema_patch_implementation_report.md`
- `docs/03_decision_log.md`
- `docs/17_change_log.md`

## Patch 003 Summary

Patch 003 adds DB-backed persistence tables for Nashir evidence records and evidence lifecycle events only. It does not wire runtime usage, routes, OpenAPI, RBAC, generated clients, UI, evidence lifecycle actions, approval, publishing, Sprint 5, Pilot, or Production readiness.

## Tables Added

- `nashir_evidence`
- `nashir_evidence_lifecycle_events`

## Constraints / Indexes Summary

Patch 003 adds scoped enum values for Nashir evidence status and lifecycle event type, creates both tables with tenant/campaign scope fields, adds user/workspace references where authoritative targets are clear, adds replacement self-reference constraints, requires rejection and invalidation reasons on lifecycle events, requires replacement evidence for supersession events, and adds workspace/campaign/evidence/status/event/audit-correlation indexes.

## Unresolved FK / Audit Correlation Notes

- `nashir_campaign_id` has no FK in Patch 003 because an authoritative DB-backed Nashir campaign table target is not established by this patch.
- `audit_event_id` remains nullable without an FK because exact audit table/column correlation is separately gated.
- Runtime/repository code must enforce route-derived workspace/campaign scoping and non-disclosing tenant behavior before any DB-backed Nashir evidence usage is enabled.

## Explicit Non-Goals

- no runtime
- no OpenAPI
- no RBAC
- no generated clients
- no UI
- no evidence lifecycle routes
- no approval/publishing
- no Sprint 5/Pilot/Production

## Verification Commands Run

- `git diff --name-only` passed and listed the tracked documentation/schema wrapper changes.
- `git diff --check` passed.
- `npm run db:migrate:strict --if-present` failed because the local environment does not provide `DATABASE_URL`.
- `npm run verify:strict --if-present` ran baseline checks, OpenAPI strict lint, and tests, then failed when its final strict migration step required `DATABASE_URL`.
- `git status --short` remains required after final checks.

Failure output:

```text
> marketing-os@0.0.0-phase-0-1-sprint-4-patch-002 db:migrate:strict
> node scripts/db-migrate.js --strict

DATABASE_URL is required for strict Sprint 0 migration execution.
```

## GO / NO-GO Statement

GO for documentation-contained SQL Patch 003 and schema wrapper/status documentation only.

NO-GO remains for runtime usage, OpenAPI changes, RBAC expansion, generated clients, UI, evidence lifecycle routes, approval, publishing, Sprint 5, Pilot, and Production.
