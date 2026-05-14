# Nashir Evidence Lifecycle Schema Patch Target Decision

## Purpose

This document records the schema patch target decision for future Nashir evidence lifecycle SQL/schema work.

This document does not implement SQL/schema/migrations, runtime behavior, tests, OpenAPI YAML, RBAC, generated clients, UI, Sprint 5, Pilot, or Production readiness.

## Current State

- Evidence submit exists in-memory only.
- Internal MVP Campaign Proof Flow is verified in-memory.
- DB-backed evidence lifecycle persistence is not implemented.
- `nashir_evidence` table does not exist.
- `nashir_evidence_lifecycle_events` table does not exist.
- SQL/schema/migrations are not implemented.
- Evidence lifecycle routes are not implemented.

## Prior Authority

- PR #217 proposed `nashir_evidence` and `nashir_evidence_lifecycle_events`.
- PR #218 recommended preserving base schema and using a new explicit schema patch if Patch 003 is available.

## Decision

Select:

`docs/marketing_os_v5_6_5_phase_0_1_schema_patch_003.sql`

as the candidate future schema patch target.

This decision does not create the file.
This decision does not authorize SQL implementation.
The future implementation PR must verify Patch 003 availability before creating or editing the target.

## Why Patch 003

- Avoids modifying base schema directly.
- Preserves prior patch order discipline.
- Keeps evidence lifecycle changes isolated.
- Makes migration order explicit.
- Simplifies review and rollback.
- Aligns with schema authority reconciliation from PR #218.

## Required Future Schema Patch Scope

Candidate allowed files for a future implementation PR:

- `docs/marketing_os_v5_6_5_phase_0_1_schema_patch_003.sql`
- `docs/07_database_schema.sql`
- `docs/nashir_evidence_lifecycle_schema_patch_implementation_report.md`
- `docs/03_decision_log.md`
- `docs/17_change_log.md`

These are candidate future files only and are not authorized by this PR.

## Required Future Verification

A future schema patch PR must run or document:

- `git diff --name-only`
- `git diff --check`
- `npm run db:migrate:strict`
- `npm run verify:strict`
- CI Sprint 0 Strict Verification

If some command is not applicable, the PR must explain why.

## Required Future Checks Before Creating Patch 003

A future implementation PR must verify:

- no existing `docs/marketing_os_v5_6_5_phase_0_1_schema_patch_003.sql` exists
- migration order includes base schema, Patch 001, Patch 002, then future Patch 003 only if approved
- `docs/07_database_schema.sql` reflects the active migration order after patch creation
- strict migration runner recognizes the patch only after explicit implementation approval
- no generated clients are changed

## What This PR Does Not Authorize

This PR does not authorize:

- creating Patch 003
- editing base schema
- editing Patch 001
- editing Patch 002
- editing `docs/07_database_schema.sql`
- SQL/schema/migrations
- runtime changes
- OpenAPI YAML changes
- RBAC expansion
- generated clients
- evidence lifecycle implementation
- approval routes
- publishing workflows
- UI
- Sprint 5
- Pilot
- Production

## Recommended Next Step

After this decision:

- create a narrowly scoped schema patch implementation PR only if Patch 003 availability is verified; or
- create a patch-numbering reconciliation PR if Patch 003 availability is ambiguous.

Do not implement SQL directly from this document.

## GO / NO-GO Recommendation

GO for documentation-only patch target decision.

NO-GO for implementation.
