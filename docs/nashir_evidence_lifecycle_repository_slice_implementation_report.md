# Nashir Evidence Lifecycle Repository Slice Implementation Report

## Journey Served

Nashir Evidence Lifecycle Journey.

This implementation follows the approved model:

Journey Gate -> Journey Slice Implementation -> Journey Flow Verification -> Status Reconciliation.

## Slice Implemented

DB-backed persistence read/write plumbing behind repository boundaries for the existing Nashir evidence lifecycle model.

## Files Changed

- `src/repositories/nashir-evidence-lifecycle-repository.js`
- `src/repositories/index.js`
- `test/nashir-evidence-lifecycle-repository.test.js`
- `docs/nashir_evidence_lifecycle_repository_slice_implementation_report.md`
- `docs/03_decision_log.md`
- `docs/17_change_log.md`

## What Was Implemented

- Added `NashirEvidenceLifecycleRepository`.
- Added repository methods:
  - `listByCampaign({ workspaceId, nashirCampaignId })`
  - `getById({ workspaceId, nashirCampaignId, evidenceId })`
  - `createSubmittedEvidence({ workspaceId, nashirCampaignId, evidenceType, channel, submittedByUserId, publishedAt, url, notes, externalReference, submittedAt })`
- Reads and writes target Patch 003 tables:
  - `nashir_evidence`
  - `nashir_evidence_lifecycle_events`
- `createSubmittedEvidence` inserts a submitted evidence record and a `nashir_evidence.submitted` lifecycle event.
- `createSubmittedEvidence` requires transactional writes through `pool.withTransaction`.
- JSDoc documents the injected pool adapter contract (`query` / `withTransaction` signatures and `workspaceId` in options) without runtime arity checks.
- Non-transactional fallback writes are intentionally forbidden.
- If `pool.withTransaction` is unavailable, the repository fails closed before any insert is attempted.
- The repository constructor validates that a pool is provided.
- `createSubmittedEvidence` treats a missing `INSERT ... RETURNING` row as a safe repository failure before lifecycle event insertion.
- Repository query result normalization handles null, undefined, and missing `rows` defensively.
- Returned evidence records use canonical camelCase fields and do not expose internal snake_case fields.
- Export wiring was added through `src/repositories/index.js`.
- Review remediation PRRT_kwDOSM7nxM6B-nlD addressed the non-atomic fallback finding by requiring transactional submission writes.

## What Was Not Implemented

- No lifecycle routes.
- No OpenAPI lifecycle routes.
- No RBAC expansion.
- No generated clients.
- No UI/prototype.
- No approval.
- No publishing.
- No accept/reject/invalidate/supersede repository methods.
- No Sprint 5, Pilot, or Production readiness.
- No isolated route implementation outside the Journey model.

## Tenant-Safety Behavior

Repository reads are scoped by `workspaceId` and `nashirCampaignId`. The repository uses workspace context options for direct pool queries and transaction options where transactions are available.

Inside `pool.withTransaction`, both the `nashir_evidence` and `nashir_evidence_lifecycle_events` `INSERT` statements invoke the transactional client with `client.query(sql, params, { workspaceId })` so workspace context is preserved on each statement the same way as non-transactional `pool.query` calls.

Submission writes are transaction-bound. Evidence record insertion and submitted lifecycle event insertion must occur inside the same `pool.withTransaction` call, or the repository returns a safe failure before writing.

## Generic Not Found Behavior

`getById` returns `null` when the evidence ID does not exist, belongs to another workspace, or belongs to another Nashir campaign. This preserves generic not found behavior and does not disclose whether evidence exists outside the caller-supplied workspace/campaign context.

## Verification Results

- `git status --short`: showed only the approved changed files for this Journey Slice.
- `git diff --name-only`: showed tracked changes in `docs/03_decision_log.md`, `docs/17_change_log.md`, and `src/repositories/index.js`; untracked approved files were visible in `git status --short`.
- `git diff --check`: passed.
- `npm test -- test/nashir-evidence-lifecycle-repository.test.js`: passed. The repository test script expands to `node --test test/*.test.js test/nashir-evidence-lifecycle-repository.test.js`, so it ran the full current test set plus the targeted repository test; 338 tests passed.
- `npm run verify:strict`: partially completed. Sprint 0 baseline checks, OpenAPI strict lint, and the full test suite passed before the command stopped at `npm run db:migrate:strict` because `DATABASE_URL` was not set. Exact terminal output: `DATABASE_URL is required for strict Sprint 0 migration execution.`

## Remaining NO-GO List

- lifecycle routes
- OpenAPI lifecycle routes
- RBAC expansion
- generated clients
- UI/prototype
- approval
- publishing
- Sprint 5
- Pilot
- Production
- isolated route implementation outside Journey model

## Required Next Step

The required next step is Journey Flow Verification or Status Reconciliation, not route-by-route implementation.
