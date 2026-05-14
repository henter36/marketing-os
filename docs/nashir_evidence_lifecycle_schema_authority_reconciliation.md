# Nashir Evidence Lifecycle Schema Authority Reconciliation

## Purpose

This document records a schema authority reconciliation before any future Nashir evidence lifecycle SQL/schema/migration work.

This document does not implement SQL/schema/migrations, runtime behavior, tests, OpenAPI YAML, RBAC, generated clients, UI, Sprint 5, Pilot, or Production readiness.

## Current State

- Evidence submit exists in-memory only.
- Internal MVP Campaign Proof Flow is verified in-memory.
- DB-backed evidence lifecycle persistence is not implemented.
- `nashir_evidence` table does not exist.
- `nashir_evidence_lifecycle_events` table does not exist.
- Evidence lifecycle review, acceptance, rejection, invalidation, and supersession are not implemented.
- SQL/schema/migrations are not implemented.

## Proposal Source

PR #217 proposed future DB-backed Nashir evidence lifecycle persistence tables:

- `nashir_evidence`
- `nashir_evidence_lifecycle_events`

This reconciliation does not approve SQL implementation yet.

## Schema Authority Questions

Before any SQL/schema/migration implementation, the project must resolve:

- Should the future patch be `docs/marketing_os_v5_6_5_phase_0_1_schema_patch_003.sql`?
- Is Patch 003 available or already reserved?
- Should base schema remain unchanged?
- Should `docs/07_database_schema.sql` be updated to document migration order?
- Should strict migration scripts be changed?
- Should OpenAPI be updated in the same PR or separate PR?
- Should runtime remain untouched until SQL patch is merged and verified?

## Recommended Authority Decision

- Do not modify the base schema directly.
- Prefer a new explicit schema patch file if Patch 003 is available.
- If Patch 003 is ambiguous, first create a patch-numbering reconciliation PR.
- Update `docs/07_database_schema.sql` only in the future schema patch PR if migration order documentation changes.
- Keep OpenAPI/runtime separate unless explicitly approved by a later gate.
- Keep generated clients NO-GO.

## Candidate Future Schema Patch Scope

Candidate allowed files for a future schema patch PR only:

- `docs/marketing_os_v5_6_5_phase_0_1_schema_patch_003.sql`
- `docs/07_database_schema.sql`
- `docs/03_decision_log.md`
- `docs/17_change_log.md`
- `docs/nashir_evidence_lifecycle_schema_patch_implementation_report.md`

These are candidate files only and are not authorized by this PR.

## Future Schema Patch NO-GO

A future schema patch PR should still forbid unless separately approved:

- `src/`
- runtime
- OpenAPI YAML
- RBAC
- generated clients
- package/workflow/script changes
- prototype/UI
- evidence lifecycle routes
- approval routes
- publishing workflows
- Sprint 5
- Pilot
- Production

## Migration Order Considerations

- Current strict migration order must be inspected before implementation.
- New patch must be added only after approved existing patches.
- Migration runner expectations must be verified before SQL patch.
- Rollback/idempotency expectations must be documented.
- Strict verification must pass after schema patch.

## Verification Expectations For Future Patch

A future schema patch PR should run or document:

- `git diff --name-only`
- `git diff --check`
- `npm run db:migrate:strict` if applicable
- `npm run verify:strict` if applicable
- any existing migration order verification command
- CI Sprint 0 Strict Verification

## What This PR Does Not Authorize

This PR does not authorize:

- creating Patch 003
- editing base schema
- editing `docs/07_database_schema.sql`
- SQL/schema/migrations
- runtime changes
- OpenAPI YAML changes
- RBAC expansion
- generated clients
- evidence lifecycle implementation
- approval or publishing
- UI
- Sprint 5
- Pilot
- Production

## Recommended Next Step

After this reconciliation:

- create a documentation-only patch numbering / schema target decision if Patch 003 availability is unclear; or
- create the actual schema patch PR only if patch target is confirmed and allowed files are explicitly approved.

Do not implement SQL directly from this reconciliation.

## GO / NO-GO Recommendation

GO for documentation-only schema authority reconciliation.

NO-GO for implementation.
