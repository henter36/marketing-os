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
- `docs/marketing_os_v5_6_5_phase_0_1_openapi_sprint3_patch.yaml`
- `scripts/openapi-lint.js`
- `error-model.js`
- `src/error-model.js`

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

GitHub Actions strict verification passed after Sprint 3 implementation and fixes.

```text
Workflow: Sprint 0 Strict Verification
Commit: b8bee547acdef1ef99ad79131323cb1f2d8a2a69
Branch: main
Status: Success
Duration: 51s
```

The remaining Node.js 20 deprecation message is a GitHub Actions runtime warning while actions are forced to Node 24. It is not a Sprint 3 gate failure.

## Sprint 3 Fixes Applied Before Passing CI

- Added `docs/marketing_os_v5_6_5_phase_0_1_openapi_sprint3_patch.yaml` for Sprint 3 route contract coverage.
- Updated `scripts/openapi-lint.js` to read the base OpenAPI contract plus the Sprint 3 patch.
- Updated `scripts/openapi-lint.js` to detect duplicate OpenAPI path blocks across patches instead of checking only the first path occurrence.
- Added missing `crypto` import in `error-model.js` and `src/error-model.js` for ErrorModel correlation IDs.
- Fixed `router_sprint3.js` to preserve route status codes, including `201` for creation endpoints.

## OpenAPI Deviations

No intentional forbidden-scope deviations. Implementation remains limited to Sprint 3 ReviewTask, ApprovalDecision, PublishJob, and ManualPublishEvidence behavior requested for this sprint.

TrackedLink is approved in the broader Sprint 3 backlog, but was not included in the requested Sprint 3 implementation/test list for this task and was not implemented.

## Unresolved Gaps

No Sprint 3 blocking gap remains after successful GitHub Actions strict verification.

Known non-blocking gaps:

- TrackedLink remains unimplemented in this Sprint 3 task despite being listed as a Sprint 3 backlog story, because the requested implementation scope stopped at ManualPublishEvidence.
- Persistence remains the existing in-memory implementation surface; PostgreSQL persistence hardening remains outside this Sprint 3 change.
- Audit persistence remains represented by in-memory placeholder events; Sprint 4 audit read workflows remain unimplemented.
- Repository cleanup remains intentionally deferred and must not be mixed with Sprint 4.

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
GO to Sprint 4.
```

Conditions for Sprint 4 execution:

```text
1. Implement Sprint 4 only.
2. Do not implement Sprint 5+.
3. Do not perform repository cleanup as part of Sprint 4.
4. Preserve Sprint 0/1/2/3 guardrails.
5. Keep tenant isolation, RBAC, ErrorModel, idempotency, cost/usage, asset immutability, approval, publishing, and evidence tests passing.
6. Add Sprint 4 tests before considering Sprint 4 complete.
7. Keep GitHub Actions strict verification passing.
```

## Pilot / Production

```text
NO-GO to Pilot.
NO-GO to Production.
```

Pilot remains blocked until all P0 QA gates pass after later sprints.
