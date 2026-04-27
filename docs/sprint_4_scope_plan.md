# Sprint 4 Scope Plan

## Source Review

Approved sources inspected on branch `sprint-4-plan`:

- `README.md`
- `docs/sprint_0_implementation_report.md`
- `docs/sprint_1_implementation_report.md`
- `docs/sprint_2_implementation_report.md`
- `docs/sprint_3_implementation_report.md`
- `docs/11_sprint_plan.md`
- `docs/marketing_os_v5_6_5_phase_0_1_openapi.yaml`
- `docs/marketing_os_v5_6_5_phase_0_1_openapi_sprint3_patch.yaml`
- `docs/marketing_os_v5_6_5_phase_0_1_backlog.md`
- `docs/marketing_os_v5_6_5_phase_0_1_qa_test_suite.md`
- `docs/marketing_os_v5_6_5_phase_0_1_schema.sql`
- `docs/marketing_os_v5_6_5_phase_0_1_schema_patch_001.sql`

`README.md` is treated as outdated for current sprint status, but its contract rules remain binding. The Sprint 0, Sprint 1, Sprint 2, and Sprint 3 implementation reports record strict verification passing and explicitly allow progression through Sprint 4 planning. This document is a planning artifact only; it does not implement Sprint 4.

## 1. Confirmed Sprint 4 Scope From Approved Sources

Sprint 4 is defined in `docs/11_sprint_plan.md` as: Reports, Audit, Safe Mode, Pilot Gate.

The approved backlog breaks Sprint 4 into these scope items:

- `S4-01` ClientReportSnapshot Generation.
- `S4-02` AuditLog Read Model.
- `S4-03` Safe Mode Operations.
- `S4-04` Onboarding Progress.
- `S4-05` Pilot Readiness Gate.

Sprint 4 coding must be limited to OpenAPI-approved API surface plus tests required to prove the backlog and QA suite. Backlog-only ideas that are not present in OpenAPI must be treated as gaps, not silently implemented as endpoints.

## 2. Exact Entities

`S4-01` ClientReportSnapshot Generation:

- `ClientReportSnapshot`
- `Campaign`
- `ReportTemplate`
- `ManualPublishEvidence`
- `AuditLog`

`S4-02` AuditLog Read Model:

- `AuditLog`

`S4-03` Safe Mode Operations:

- `SafeModeState`
- `AuditLog`
- `AdminNotification`

`S4-04` Onboarding Progress:

- `OnboardingProgress`
- `SetupChecklistItem`
- `AuditLog`

`S4-05` Pilot Readiness Gate:

- `Workspace`
- `Campaign`
- `MediaJob`
- `MediaAssetVersion`
- `ApprovalDecision`
- `PublishJob`
- `ManualPublishEvidence`
- `UsageMeter`
- `ClientReportSnapshot`
- `AuditLog`

Approved SQL confirms the corresponding storage tables: `client_report_snapshots`, `audit_logs`, `admin_notifications`, `safe_mode_states`, `onboarding_progress`, and `setup_checklist_items`. The Sprint 3 schema patch is approval/evidence-specific and does not add additional Sprint 4 entities.

## 3. Exact Endpoints

OpenAPI-approved Sprint 4 endpoints:

- `GET /workspaces/{workspaceId}/campaigns/{campaignId}/client-report-snapshots`
- `POST /workspaces/{workspaceId}/campaigns/{campaignId}/client-report-snapshots`
- `GET /workspaces/{workspaceId}/audit-logs`
- `GET /workspaces/{workspaceId}/safe-mode`
- `POST /workspaces/{workspaceId}/safe-mode`
- `GET /workspaces/{workspaceId}/onboarding-progress`
- `PATCH /workspaces/{workspaceId}/onboarding-progress`

There is no approved dedicated Pilot Readiness Gate endpoint in the inspected OpenAPI sources. `S4-05` must therefore be implemented as verification coverage over all Phase 0/1 endpoints, unless a future approved OpenAPI patch adds a dedicated route.

No Sprint 4 implementation may add endpoints outside the approved OpenAPI contract.

## 4. Exact Permissions

`S4-01` ClientReportSnapshot Generation:

- `report.read` for list/read behavior.
- `report.generate` for snapshot generation.

`S4-02` AuditLog Read Model:

- `audit.read` for audit log listing.

`S4-03` Safe Mode Operations:

- `operations.read` for reading safe mode state.
- `operations.safe_mode` for activating or deactivating safe mode.

`S4-04` Onboarding Progress:

- `onboarding.read` for reading onboarding progress.
- `onboarding.write` for updating onboarding progress.

`S4-05` Pilot Readiness Gate:

- All Phase 0/1 permissions already introduced in Sprints 0, 1, 2, and 3 remain in force.

All Sprint 4 routes must preserve `AuthGuard`, `WorkspaceContextGuard`, membership validation, and `PermissionGuard`. They must not trust `workspace_id` from request bodies, and every workspace-scoped query must include the workspace context.

## 5. Exact Audit Events

Sprint 4 audit events required by approved backlog and QA sources:

- `client_report_snapshot.generated`
- `safe_mode.activated`
- `safe_mode.deactivated`
- `onboarding.updated`
- `pilot_gate.evaluated`
- `pilot_gate.failed`
- `pilot_gate.passed`

Audit log reads have no required audit event unless the security policy later requires read auditing. Existing Sprint 0/1/2/3 sensitive-write audit behavior must remain unchanged.

## 6. Required Tests

ClientReportSnapshot tests:

- Generate report snapshot for a campaign.
- List campaign report snapshots.
- Enforce workspace tenant isolation.
- Enforce `report.read` and `report.generate` allow/deny behavior.
- Reject invalid report periods.
- Supersede manual publish evidence after report generation and verify the old report payload does not change.
- Block direct update of ClientReportSnapshot, including DB immutability where applicable.
- Validate ErrorModel consistency.

AuditLog tests:

- Admin or permitted user can read audit logs with `audit.read`.
- Viewer without `audit.read` cannot read audit logs.
- Workspace A cannot read Workspace B audit logs.
- AuditLog cannot be updated or deleted, including DB append-only behavior where applicable.
- AuditLog remains audit evidence only, not business state.

Safe Mode tests:

- Read safe mode state with `operations.read`.
- Activate safe mode with `operations.safe_mode`.
- Deactivate safe mode with `operations.safe_mode`.
- Viewer or user without `operations.safe_mode` cannot change safe mode.
- Sensitive writes create `safe_mode.activated` and `safe_mode.deactivated` audit events.
- Protected writes are blocked while safe mode is active only where the approved implementation policy explicitly defines the protected write set.
- Validate ErrorModel consistency and tenant isolation.

Onboarding Progress tests:

- Read onboarding progress with `onboarding.read`.
- Patch onboarding progress with `onboarding.write`.
- Enforce one onboarding progress row per workspace.
- Unauthorized update fails.
- Workspace A cannot read or update Workspace B onboarding progress.
- Sensitive writes create `onboarding.updated` audit events.
- Validate ErrorModel consistency.

Pilot Readiness Gate tests:

- All Sprint 0/1/2/3 P0 tests continue passing.
- Workspace A cannot read Workspace B data across all major entities.
- Publisher cannot publish an unapproved version.
- Wrong content hash blocks publish.
- ManualPublishEvidence proof fields cannot be patched or deleted.
- Failed MediaJob does not record commercial usage.
- Report snapshot does not change after evidence supersede.
- Sensitive writes create required AuditLog rows.
- AuditLog cannot be modified or deleted.
- CostEvent remains not billing, not invoice, and not BillingProvider behavior.
- OpenAPI alignment passes for all implemented Sprint 4 routes.

## 7. Backlog Items Missing From OpenAPI

The following approved-backlog items are not exposed as dedicated endpoints in the inspected OpenAPI sources and must not be implemented as API routes without an approved contract patch:

- `S4-05` Pilot Readiness Gate has audit events but no dedicated PilotGate endpoint or schema.
- `pilot_gate.evaluated`, `pilot_gate.failed`, and `pilot_gate.passed` are backlog audit events, but there is no dedicated OpenAPI operation that produces them.
- `AdminNotification` exists in approved SQL and backlog entity lists, but no dedicated AdminNotification API endpoint is approved in the inspected OpenAPI files.
- `SetupChecklistItem` exists in approved SQL and backlog entity lists, but no dedicated SetupChecklistItem API endpoint is approved in the inspected OpenAPI files.
- Safe Mode protected-write behavior is referenced by QA conditionally, but the exact protected write set is not enumerated in OpenAPI. Sprint 4 coding must define this narrowly from approved policy, or record it as a gap.

## 8. OpenAPI Items Missing Tests

The QA suite covers Sprint 4 outcomes, but coding should add explicit tests for the following OpenAPI route-level behavior where not already covered by named QA cases:

- `GET /workspaces/{workspaceId}/campaigns/{campaignId}/client-report-snapshots` list response, pagination/filter behavior if present, RBAC, and tenant scoping.
- `GET /workspaces/{workspaceId}/audit-logs` query behavior, RBAC, tenant scoping, and response schema validation.
- `GET /workspaces/{workspaceId}/safe-mode` default state creation/read behavior, RBAC, and tenant scoping.
- `POST /workspaces/{workspaceId}/safe-mode` request validation and idempotent/safe repeated state transitions if the service supports them.
- `GET /workspaces/{workspaceId}/onboarding-progress` behavior before a row exists, RBAC, and tenant scoping.
- `PATCH /workspaces/{workspaceId}/onboarding-progress` request validation, uniqueness behavior, RBAC, tenant scoping, and audit creation.

OpenAPI lint tests must also verify that every Sprint 4 route uses the expected ErrorModel and permission metadata.

## 9. Dependencies On Sprint 0/1/2/3

Sprint 0 dependencies:

- Authentication and workspace context baseline.
- Membership and permission guard behavior.
- ErrorModel consistency.
- AuditLog append-only behavior.
- Tenant isolation and workspace-scoped query rules.

Sprint 1 dependencies:

- Campaigns for ClientReportSnapshot scope.
- ReportTemplate support for report generation.
- Brand, brief, and template behavior must remain unchanged.

Sprint 2 dependencies:

- MediaJob, MediaAsset, MediaAssetVersion, UsageMeter, UsageQuotaState, CostEvent, CostBudget, CostGuardrail behavior must remain unchanged.
- Approved MediaAssetVersion immutability must remain enforced.
- UsageMeter commercial-use safeguards must remain enforced.
- CostEvent must remain non-billing and non-invoice.

Sprint 3 dependencies:

- ApprovalDecision, PublishJob, and ManualPublishEvidence behavior must remain unchanged.
- `S3-04` ManualPublishEvidence must be available before `S4-01` report snapshots.
- PublishJob approval and content hash guards must remain enforced.
- ManualPublishEvidence proof fields must remain immutable, invalidation-limited, and supersede-by-new-record.

Repository cleanup is explicitly out of scope for Sprint 4 planning and coding.

## 10. Forbidden Items

Sprint 4 planning and coding must not include:

- Sprint 5 or later scope.
- Repository cleanup or root file restructuring.
- Frontend shell work.
- Auto-publishing.
- Paid execution.
- AI agents.
- Advanced attribution.
- BillingProvider.
- ProviderUsageLog.
- GenerationJob.
- Asset.
- Approval entity.
- External provider execution.
- Unapproved endpoints.
- ManualPublishEvidence DELETE.
- ManualPublishEvidence proof-field mutation.
- Customer billing or invoice behavior derived from CostEvent.
- Trusting `workspace_id` from request bodies.
- Any router or `src` file changes on this planning branch.

## 11. Implementation Sequence

Recommended Sprint 4 coding sequence after this planning branch is accepted:

1. Confirm OpenAPI route list and permission metadata for all Sprint 4 endpoints.
2. Implement ClientReportSnapshot list and generate behavior, using immutable report and evidence snapshots.
3. Implement AuditLog read model with strict workspace scoping and `audit.read` permission.
4. Implement Safe Mode read and state changes, including `safe_mode.activated` and `safe_mode.deactivated` audit events.
5. Define the approved safe-mode protected-write policy before enforcing write blocks; treat undefined protected writes as a gap.
6. Implement OnboardingProgress read and patch behavior, preserving workspace uniqueness and audit logging.
7. Add Pilot Readiness Gate test coverage across all Phase 0/1 P0 scenarios without adding a dedicated endpoint unless OpenAPI is patched first.
8. Add route-level RBAC, tenant isolation, ErrorModel, and OpenAPI alignment tests for every Sprint 4 endpoint.
9. Run the full strict command set and GitHub Actions strict verification.
10. Create `docs/sprint_4_implementation_report.md` only during the future implementation sprint, not in this planning branch.

## 12. GO / NO-GO Decision For Sprint 4 Coding

Decision: `CONDITIONAL GO` for Sprint 4 coding.

Coding may proceed for the OpenAPI-approved Sprint 4 endpoints listed in this plan, while preserving all Sprint 0/1/2/3 guardrails. Coding is `NO-GO` for any dedicated PilotGate API, AdminNotification API, SetupChecklistItem API, or unlisted route until an approved OpenAPI contract patch exists.

This branch does not implement Sprint 4 and does not claim Sprint 4 completion.
