# Sprint 3 Implementation Report

## Scope Completed

- ReviewTask list/create/get/update-status workflows.
- ApprovalDecision list/create workflows.
- ApprovalDecision validation against ReviewTask and MediaAssetVersion.
- `approved_content_hash` required when `decision=approved`.
- `approved_content_hash` must match `MediaAssetVersion.content_hash`.
- Approved ApprovalDecision marks MediaAssetVersion as `approved` using Patch 001 service-equivalent behavior.
- PublishJob list/create/get/status workflows.
- PublishJob creation requires approved ApprovalDecision.
- PublishJob asset version must match ApprovalDecision and matching content hash.
- PublishJob creation uses `Idempotency-Key`.
- ManualPublishEvidence list/submit/get/invalidate/supersede workflows.
- ManualPublishEvidence proof fields remain immutable through API behavior.
- ManualPublishEvidence invalidate updates only `evidence_status` and `invalidated_reason`.
- ManualPublishEvidence supersede creates a new record and preserves historical proof.
- Audit placeholders for Sprint 3 sensitive writes.

## Files Changed

- `router_sprint3.js`
- `store_sprint3.js`
- `src/router.js`
- `src/store.js`
- `test/integration/sprint3.integration.test.js`
- `docs/sprint_3_implementation_report.md`

## Endpoints Implemented

```text
GET /workspaces/{workspaceId}/asset-versions/{mediaAssetVersionId}/review-tasks
POST /workspaces/{workspaceId}/asset-versions/{mediaAssetVersionId}/review-tasks
GET /workspaces/{workspaceId}/review-tasks/{reviewTaskId}
PATCH /workspaces/{workspaceId}/review-tasks/{reviewTaskId}/status
GET /workspaces/{workspaceId}/review-tasks/{reviewTaskId}/decisions
POST /workspaces/{workspaceId}/review-tasks/{reviewTaskId}/decisions
GET /workspaces/{workspaceId}/approval-decisions/{approvalDecisionId}/publish-jobs
POST /workspaces/{workspaceId}/approval-decisions/{approvalDecisionId}/publish-jobs
GET /workspaces/{workspaceId}/publish-jobs/{publishJobId}
PATCH /workspaces/{workspaceId}/publish-jobs/{publishJobId}/status
GET /workspaces/{workspaceId}/publish-jobs/{publishJobId}/manual-evidence
POST /workspaces/{workspaceId}/publish-jobs/{publishJobId}/manual-evidence
GET /workspaces/{workspaceId}/manual-evidence/{manualPublishEvidenceId}
POST /workspaces/{workspaceId}/manual-evidence/{manualPublishEvidenceId}/invalidate
POST /workspaces/{workspaceId}/manual-evidence/{manualPublishEvidenceId}/supersede
```

Existing Sprint 0, Sprint 1, and Sprint 2 endpoints remain intact.

## Tests Added

- Sprint 3 route alignment.
- ReviewTask create/list/get/update-status behavior.
- ReviewTask tenant isolation for cross-workspace MediaAssetVersion references.
- ReviewTask RBAC deny for viewer and assignee membership validation.
- ApprovalDecision create/list behavior.
- ApprovalDecision RBAC deny for creator.
- ApprovalDecision rejects missing `approved_content_hash` when approved.
- ApprovalDecision rejects mismatched `approved_content_hash`.
- Approved ApprovalDecision marks MediaAssetVersion approved.
- ApprovalDecision cannot approve a version outside the ReviewTask assignment.
- PublishJob create/list/get/status behavior.
- PublishJob requires approved ApprovalDecision.
- PublishJob idempotency replay and conflict behavior.
- ManualPublishEvidence submit/list/get behavior.
- ManualPublishEvidence content hash validation.
- ManualPublishEvidence proof immutability through invalidation.
- ManualPublishEvidence invalidation requires `invalidated_reason`.
- ManualPublishEvidence supersede creates a new evidence record.
- ManualPublishEvidence PATCH and DELETE are not exposed.
- Sprint 3 ErrorModel consistency.

## Commands Run Locally

```bash
node --test test/*.test.js test/integration/*.test.js
node scripts/verify-sprint0.js
node scripts/openapi-lint.js --strict
node scripts/db-seed.js
node scripts/db-migrate.js --strict
npm test
npm run test:integration
npm run verify:strict
```

## Local Test Results

```text
Unit and integration tests via bundled Node: passed locally, 41/41
Sprint 0 static verification: passed locally
RBAC seed generation: passed locally
Strict OpenAPI lint: not runnable in slim local mirror because the authoritative OpenAPI file is absent
Strict DB migration: not runnable in slim local mirror because the authoritative SQL files are absent
npm commands: not runnable in desktop shell because npm is not on PATH
```

## GitHub Actions Strict Verification Result

Not available at report creation time for the Sprint 3 changes.

Hard gate remains active: do not mark GO to Sprint 4 unless GitHub Actions strict verification passes after these Sprint 3 changes.

## OpenAPI Deviations

No intentional forbidden-scope deviations. Implementation remains limited to Sprint 3 ReviewTask, ApprovalDecision, PublishJob, and ManualPublishEvidence behavior requested for this sprint.

TrackedLink is approved in the broader Sprint 3 backlog, but was not included in the requested Sprint 3 implementation/test list for this task and was not implemented.

## Unresolved Gaps

- GitHub Actions strict verification was not available for the Sprint 3 changes at report creation time.
- TrackedLink remains unimplemented in this Sprint 3 task despite being listed as a Sprint 3 backlog story, because the requested implementation scope stopped at ManualPublishEvidence.
- Persistence remains the existing in-memory implementation surface; PostgreSQL persistence hardening remains outside this Sprint 3 change.
- Audit persistence remains represented by in-memory placeholder events; Sprint 4 audit read workflows remain unimplemented.

## Explicitly Not Implemented

```text
Sprint 4+
ClientReportSnapshot workflows
AuditLog read workflows beyond existing placeholders
Safe Mode / Onboarding workflows beyond existing Sprint 0 baseline
TrackedLink workflows
frontend shell
auto-publishing
paid execution
AI agents
advanced attribution
BillingProvider
ProviderUsageLog
GenerationJob, Asset, or Approval entities
repository cleanup / file restructuring
external provider publishing
```

## Readiness Decision For Sprint 4

```text
CONDITIONAL GO to Sprint 4.
```

Conditions:

```text
1. GitHub Actions strict verification must pass after Sprint 3 changes.
2. npm test must pass in the full repository environment.
3. npm run test:integration must pass in the full repository environment.
4. npm run openapi:lint:strict must pass with the authoritative OpenAPI file.
5. npm run db:seed must pass.
6. npm run db:migrate:strict must pass with the authoritative SQL files and PostgreSQL.
7. npm run verify:strict must pass.
```

Pilot and production remain blocked.
