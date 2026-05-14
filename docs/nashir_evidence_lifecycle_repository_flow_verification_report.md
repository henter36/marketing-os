# Nashir Evidence Lifecycle Repository Flow Verification Report

## Journey Served

This report verifies the repository-only slice of the Nashir Evidence Lifecycle Journey:

Submit evidence -> List evidence -> Review evidence -> Accept / Reject evidence -> Invalidate evidence -> Supersede evidence -> List updated lifecycle state.

This PR verifies repository behavior only. It does not approve lifecycle routes, OpenAPI lifecycle routes, RBAC expansion, generated clients, UI/prototype, approval, publishing, Sprint 5, Pilot, Production, or isolated route-by-route implementation outside the Journey model.

## Verification Slice Implemented

The implemented verification slice is repository-only Journey Flow Verification for `NashirEvidenceLifecycleRepository`.

The slice uses a fake in-memory pool and does not require a live database, `DATABASE_URL`, routes, OpenAPI, RBAC, generated clients, UI, SQL/schema patches, package changes, workflow changes, scripts, or migrations.

## Files Changed

- `test/nashir-evidence-lifecycle-repository-flow-verification.test.js`
- `docs/nashir_evidence_lifecycle_repository_flow_verification_report.md`
- `docs/03_decision_log.md`
- `docs/17_change_log.md`

## What Was Verified

- `createSubmittedEvidence` creates one evidence record and one submitted lifecycle event.
- Evidence and lifecycle event writes execute inside a transaction.
- `listByCampaign` reflects submitted evidence after `createSubmittedEvidence`.
- `getById` returns submitted evidence after `createSubmittedEvidence`.
- Returned repository output is canonical camelCase.
- Returned repository output does not expose internal snake_case fields.
- Missing transactional support fails closed before any insert executes.
- Missing inserted evidence row is converted to a safe repository error and does not attempt lifecycle event insertion.
- Transaction queries pass workspace context options.
- Submitted lifecycle event traceability includes evidence ID, workspace ID, campaign ID, event type, prior status, next status, actor user ID, and occurred-at timestamp.

## What Was Not Verified

- Lifecycle routes.
- OpenAPI lifecycle routes or schemas.
- RBAC expansion.
- Generated clients.
- UI/prototype behavior.
- Approval or publishing behavior.
- Sprint 5, Pilot, or Production readiness.
- Live database execution.
- SQL/schema patch execution.
- Evidence review, accept, reject, invalidate, or supersede behavior.

## Tenant Isolation Verification

Repository reads are verified as tenant-scoped by `workspaceId` and `nashirCampaignId`.

`getById` returns `null` for:

- non-existent evidence IDs;
- cross-workspace evidence IDs;
- cross-campaign evidence IDs.

`listByCampaign` returns `[]` for cross-workspace and cross-campaign reads.

This verifies the generic not found behavior required by the Journey Flow Verification Gate without disclosing whether evidence exists outside the requested workspace/campaign context.

## Transactional Write Verification

The verification test confirms:

- submitted evidence insert and submitted lifecycle event insert occur inside `withTransaction`;
- both transaction insert queries receive `{ workspaceId }`;
- missing `withTransaction` returns a safe repository error before any insert executes;
- missing evidence insert return row returns a safe repository error before lifecycle event insertion.

## Lifecycle Event Traceability Verification

The submitted lifecycle event is verified with:

- `evidence_id`;
- `workspace_id`;
- `nashir_campaign_id`;
- `event_type = nashir_evidence.submitted`;
- `prior_status = null`;
- `next_status = submitted`;
- `actor_user_id`;
- `occurred_at` matching the submitted evidence timestamp.

## NO-GO List

The following remain NO-GO:

- lifecycle routes;
- OpenAPI lifecycle routes;
- RBAC expansion;
- generated clients;
- UI/prototype;
- approval;
- publishing;
- Sprint 5;
- Pilot;
- Production;
- isolated route-by-route implementation outside the Journey model;
- SQL/schema patch changes;
- package, workflow, script, or migration changes.

## Verification Results

- `git status --short`: showed only the allowed modified and untracked files for this PR.
- `git diff --name-only`: reported `docs/03_decision_log.md` and `docs/17_change_log.md`; untracked new files are visible in `git status --short`.
- `git diff --check`: passed with no output.
- `npm test -- test/nashir-evidence-lifecycle-repository-flow-verification.test.js`: passed. The project test script expands `test/*.test.js`, so this command ran the full test suite plus the explicit flow verification target: 342 tests passed, 0 failed.
- `npm run verify:strict`: did not fully pass locally. It completed baseline, OpenAPI strict lint, and test phases, then stopped at `npm run db:migrate:strict` because `DATABASE_URL` is not configured.

Exact strict verification blocker:

```text
DATABASE_URL is required for strict Sprint 0 migration execution.
```

This is not represented as a full strict verification pass.

## Required Next Step

After this verification PR, the required next step is Status Reconciliation.

The next step must not be route-by-route implementation. Lifecycle routes, OpenAPI lifecycle routes, RBAC, generated clients, UI/prototype, approval, publishing, Sprint 5, Pilot, and Production remain separately gated.
