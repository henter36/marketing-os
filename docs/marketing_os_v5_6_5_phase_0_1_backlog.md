# Marketing OS V5.6.5 — Phase 0/1 Sprint Backlog

> **Document type:** Execution Sprint Backlog  
> **Source inputs:** Approved ERD, PostgreSQL DDL, OpenAPI Phase 0/1  
> **Source authority:** Section 52 only  
> **Build status:** Ready for Sprint planning after QA Test Suite is produced  
> **No-code-before-contracts:** ERD, SQL DDL, OpenAPI, Backlog, and QA Matrix must exist before coding.

---

## 1. Executive Decision

This backlog converts the approved Phase 0/1 contracts into implementation stories.

It does **not** introduce new product capabilities outside Phase 0/1.

Final implementation order:

```text
Sprint 0: Foundation / Auth / Workspace / RBAC / Database baseline
Sprint 1: Campaign / Brief / Brand / Templates
Sprint 2: MediaJob / Cost Snapshot / Asset Versioning / Usage-Cost foundations
Sprint 3: Review / Approval / Publish / Manual Evidence / Tracked Links
Sprint 4: Reports / Audit / Safe Mode / Onboarding / Hardening / Pilot Gate
```

Hard rule:

```text
No frontend feature is accepted unless the matching OpenAPI path, permission, audit event, and QA case exist.
```

---

## 2. Global Acceptance Rules

These rules apply to every story.

### 2.1 Workspace Context

- `workspace_id` must come from route/context.
- `workspace_id` must not be trusted from request body.
- Every workspace-scoped query must filter by `workspace_id`.
- Entity ID alone is never sufficient for read/write.

### 2.2 Permission Enforcement

Every protected endpoint must pass:

```text
AuthGuard
WorkspaceContextGuard
MembershipCheck
PermissionGuard
```

### 2.3 Audit

Every sensitive write must create an `AuditLog` event.

### 2.4 Idempotency

The following write operations require `Idempotency-Key`:

```text
POST /workspaces/{workspaceId}/campaigns/{campaignId}/media-jobs
POST /workspaces/{workspaceId}/approval-decisions/{approvalDecisionId}/publish-jobs
POST /workspaces/{workspaceId}/usage-meter
```

### 2.5 No-Go Rules

Implementation must stop if any of these are true:

```text
Tenant isolation fails.
Workspace ID is accepted from body as trusted source.
PublishJob is created without approved ApprovalDecision.
Approval hash does not match MediaAssetVersion.content_hash.
UsageMeter is recorded without usable_output_confirmed=true.
ManualPublishEvidence exposes PATCH or DELETE.
Approved MediaAssetVersion is patched instead of creating a new version.
Frontend begins without matching OpenAPI contract.
```

---

## 3. Sprint 0 — Foundation / Database / Tenant / RBAC

### Goal

Establish the technical and data foundation required before any business workflow starts.

### Output

- Database migration baseline
- Auth and workspace context baseline
- RBAC seed baseline
- Error model baseline
- Audit baseline
- RLS/session context baseline

---

### Story S0-01 — Initialize PostgreSQL Schema

**User Story**  
As a backend engineer, I need the approved PostgreSQL DDL applied in a controlled migration so the system has the Phase 0/1 data foundation.

**Affected entities**

```text
All Phase 0/1 tables, enums, triggers, indexes, constraints
```

**Endpoints**

```text
N/A
```

**Permissions**

```text
N/A
```

**Acceptance Criteria**

- Migration creates all enums.
- Migration creates all tables from approved SQL DDL.
- Foreign keys are active.
- Unique constraints are active.
- Immutable triggers are active.
- Append-only triggers are active.
- RLS policies are enabled for workspace-scoped tables.
- Migration can run on a clean local PostgreSQL database.

**Audit Events**

```text
N/A
```

**Error States**

```text
migration_failed
constraint_creation_failed
trigger_creation_failed
rls_policy_failed
```

**QA Cases**

- Apply migration to empty DB.
- Re-run migration in CI-safe mode where supported.
- Verify `manual_publish_evidence` rejects UPDATE.
- Verify `audit_logs` rejects UPDATE/DELETE.
- Verify `usage_meter` rejects `usable_output_confirmed=false`.

---

### Story S0-02 — Implement AuthGuard and WorkspaceContextGuard

**User Story**  
As a workspace member, I need access to be scoped to my authorized workspace so no cross-tenant access is possible.

**Affected entities**

```text
User
Workspace
WorkspaceMember
AuditLog
```

**Endpoints**

```text
All /workspaces/{workspaceId}/... endpoints
```

**Permissions**

```text
All permissions depend on workspace membership
```

**Acceptance Criteria**

- Unauthorized requests return `AUTH_REQUIRED`.
- Authenticated user without workspace membership returns `WORKSPACE_ACCESS_DENIED`.
- Request body `workspace_id` is ignored/rejected if present.
- DB session variable `app.current_workspace_id` is set after workspace validation.
- Entity reads use workspace-scoped filtering.

**Audit Events**

```text
security.workspace_access_denied
```

**Error States**

```text
AUTH_REQUIRED
WORKSPACE_ACCESS_DENIED
TENANT_CONTEXT_MISSING
TENANT_CONTEXT_MISMATCH
```

**QA Cases**

- User in Workspace A cannot read Workspace B campaign.
- User in Workspace A cannot read Workspace B media asset.
- Request with body `workspace_id` different from route is rejected.
- Missing workspace context rejects workspace-scoped endpoint.

---

### Story S0-03 — Seed RBAC Roles and Permissions

**User Story**  
As an admin, I need predefined roles and permissions so access can be controlled consistently.

**Affected entities**

```text
Role
Permission
RolePermission
WorkspaceMember
```

**Endpoints**

```text
GET /roles
GET /permissions
```

**Permissions**

```text
rbac.read
workspace.manage_members
```

**Acceptance Criteria**

- Roles are seeded: Owner, Admin, Creator, Reviewer, Publisher, BillingAdmin, Viewer.
- Permissions are seeded according to OpenAPI `x-permission` values.
- RolePermission mappings exist.
- Viewer cannot execute write endpoints.
- BillingAdmin cannot edit campaign content.
- Publisher cannot approve unless also has `approval.decide`.

**Audit Events**

```text
rbac.seeded
member.role_changed
```

**Error States**

```text
PERMISSION_DENIED
ROLE_NOT_FOUND
PERMISSION_NOT_FOUND
```

**QA Cases**

- Viewer write attempt is rejected.
- Creator can create Campaign but cannot approve.
- Reviewer can create approval decision only if assigned permission exists.
- BillingAdmin can read billing/usage/cost but cannot write campaign.

---

### Story S0-04 — Implement Unified Error Model

**User Story**  
As a frontend engineer, I need a consistent error response so the UI can handle failures predictably.

**Affected entities**

```text
N/A
```

**Endpoints**

```text
All endpoints
```

**Permissions**

```text
N/A
```

**Acceptance Criteria**

Every error response returns:

```json
{
  "code": "string",
  "message": "string",
  "user_action": "string",
  "correlation_id": "string"
}
```

**Audit Events**

```text
security.permission_denied
security.validation_failed
```

**Error States**

```text
VALIDATION_FAILED
PERMISSION_DENIED
NOT_FOUND
CONFLICT
IDEMPOTENCY_CONFLICT
APPROVAL_HASH_MISMATCH
USAGE_OUTPUT_NOT_CONFIRMED
```

**QA Cases**

- Validation failure returns full ErrorModel.
- Permission failure returns full ErrorModel.
- Idempotency conflict returns full ErrorModel.
- Correlation ID exists in response and logs.

---

## 4. Sprint 1 — Workspace Operations / Brand / Templates / Campaign / Brief

### Goal

Enable workspace setup and creation of campaign planning artifacts without starting AI/media generation.

---

### Story S1-01 — Workspace and Member Management

**User Story**  
As a workspace admin, I need to manage workspace settings and members.

**Affected entities**

```text
Workspace
WorkspaceMember
User
Role
AuditLog
```

**Endpoints**

```text
GET /workspaces
POST /workspaces
GET /workspaces/{workspaceId}
PATCH /workspaces/{workspaceId}
GET /workspaces/{workspaceId}/members
POST /workspaces/{workspaceId}/members
PATCH /workspaces/{workspaceId}/members/{memberId}
```

**Permissions**

```text
workspace.read
workspace.create
workspace.manage
workspace.manage_members
```

**Acceptance Criteria**

- Admin can invite a member.
- Admin can change member role/status.
- Non-admin cannot manage members.
- `customer_account_id` cannot be changed after workspace creation.
- `workspace_id` is not accepted from body.

**Audit Events**

```text
workspace.created
workspace.updated
member.invited
member.role_changed
```

**Error States**

```text
WORKSPACE_ACCESS_DENIED
PERMISSION_DENIED
MEMBER_ALREADY_EXISTS
ROLE_NOT_FOUND
IMMUTABLE_FIELD_UPDATE
```

**QA Cases**

- Member invite creates WorkspaceMember.
- Duplicate member invite fails.
- Viewer cannot invite member.
- Attempt to update `customer_account_id` fails.

---

### Story S1-02 — Brand Profile and Brand Voice Rules

**User Story**  
As a creator, I need brand profiles and rules so generated content follows brand constraints.

**Affected entities**

```text
BrandProfile
BrandVoiceRule
AuditLog
```

**Endpoints**

```text
GET /workspaces/{workspaceId}/brand-profiles
POST /workspaces/{workspaceId}/brand-profiles
GET /workspaces/{workspaceId}/brand-profiles/{brandProfileId}/rules
POST /workspaces/{workspaceId}/brand-profiles/{brandProfileId}/rules
```

**Permissions**

```text
brand.read
brand.write
```

**Acceptance Criteria**

- User can create brand profile in own workspace.
- Brand profile names are unique per workspace.
- Rules are linked to the same workspace as the brand profile.
- Rule severity supports info/warning/blocker.
- Cross-workspace rule creation is rejected.

**Audit Events**

```text
brand_profile.created
brand_voice_rule.created
```

**Error States**

```text
BRAND_PROFILE_NOT_FOUND
DUPLICATE_BRAND_PROFILE
TENANT_CONTEXT_MISMATCH
PERMISSION_DENIED
```

**QA Cases**

- Workspace A cannot add rule to Workspace B brand profile.
- Duplicate profile name in same workspace fails.
- Same profile name in another workspace is allowed.

---

### Story S1-03 — Prompt Template and Report Template Management

**User Story**  
As an admin or creator, I need templates so generation and reporting have controlled inputs.

**Affected entities**

```text
PromptTemplate
ReportTemplate
AuditLog
```

**Endpoints**

```text
GET /workspaces/{workspaceId}/prompt-templates
POST /workspaces/{workspaceId}/prompt-templates
GET /workspaces/{workspaceId}/report-templates
POST /workspaces/{workspaceId}/report-templates
```

**Permissions**

```text
prompt_template.read
prompt_template.write
report_template.read
report_template.write
```

**Acceptance Criteria**

- Prompt template has type, body, variables, and version number.
- Duplicate `template_name + version_number` in same workspace is rejected.
- Report template can be created and listed.
- Templates cannot be created across workspace context.

**Audit Events**

```text
prompt_template.created
report_template.created
```

**Error States**

```text
DUPLICATE_TEMPLATE_VERSION
INVALID_TEMPLATE_TYPE
PERMISSION_DENIED
TENANT_CONTEXT_MISMATCH
```

**QA Cases**

- Create caption prompt template.
- Duplicate prompt template version fails.
- Viewer cannot create template.

---

### Story S1-04 — Campaign Lifecycle

**User Story**  
As a creator, I need to create and update campaigns and track state transitions.

**Affected entities**

```text
Campaign
CampaignStateTransition
AuditLog
```

**Endpoints**

```text
GET /workspaces/{workspaceId}/campaigns
POST /workspaces/{workspaceId}/campaigns
GET /workspaces/{workspaceId}/campaigns/{campaignId}
PATCH /workspaces/{workspaceId}/campaigns/{campaignId}
GET /workspaces/{workspaceId}/campaigns/{campaignId}/state-transitions
POST /workspaces/{workspaceId}/campaigns/{campaignId}/state-transitions
```

**Permissions**

```text
campaign.read
campaign.write
```

**Acceptance Criteria**

- Campaign is always linked to workspace and customer account.
- Campaign state transitions are recorded.
- Campaign status cannot be changed without transition record.
- Cross-workspace campaign access is rejected.

**Audit Events**

```text
campaign.created
campaign.updated
campaign.status_changed
```

**Error States**

```text
CAMPAIGN_NOT_FOUND
INVALID_CAMPAIGN_STATE
TENANT_ACCESS_DENIED
PERMISSION_DENIED
```

**QA Cases**

- Create campaign as Creator.
- Viewer cannot create campaign.
- State transition creates history row.
- Workspace A cannot read Workspace B campaign by ID.

---

### Story S1-05 — Brief Versioning

**User Story**  
As a creator, I need brief versions so campaign inputs remain historically protected.

**Affected entities**

```text
BriefVersion
Campaign
AuditLog
```

**Endpoints**

```text
GET /workspaces/{workspaceId}/campaigns/{campaignId}/brief-versions
POST /workspaces/{workspaceId}/campaigns/{campaignId}/brief-versions
```

**Permissions**

```text
brief.read
brief.write
```

**Acceptance Criteria**

- Creating a brief creates a new version.
- `content_hash` is generated server-side from content.
- Brief content is not patched after creation.
- `version_number` is unique per campaign.

**Audit Events**

```text
brief.version_created
```

**Error States**

```text
DUPLICATE_BRIEF_VERSION
CAMPAIGN_NOT_FOUND
IMMUTABLE_FIELD_UPDATE
TENANT_ACCESS_DENIED
```

**QA Cases**

- Create brief version 1.
- Create brief version 2.
- Duplicate version number fails.
- Attempt to patch brief content is not exposed or rejected.

---

## 5. Sprint 2 — MediaJob / Cost Snapshot / Asset Versioning / Usage-Cost

### Goal

Enable controlled generation workflow with cost guardrails, usable output rules, asset creation, and commercial usage recording.

---

### Story S2-01 — Media Cost Policy and Guardrail Baseline

**User Story**  
As an admin, I need cost policies and guardrails so generation cannot run without cost control.

**Affected entities**

```text
MediaCostPolicy
CostBudget
CostGuardrail
AuditLog
```

**Endpoints**

```text
GET /workspaces/{workspaceId}/cost-budgets
POST /workspaces/{workspaceId}/cost-budgets
GET /workspaces/{workspaceId}/cost-guardrails
POST /workspaces/{workspaceId}/cost-guardrails
```

**Permissions**

```text
cost_budget.read
cost_budget.write
cost_guardrail.read
cost_guardrail.write
```

**Acceptance Criteria**

- Cost budget can be created per workspace/customer account.
- Cost guardrail supports warn/block/require_review.
- Guardrail values cannot be negative.
- Cost policy must exist before MediaJob creation flow is accepted.

**Audit Events**

```text
cost_budget.created
cost_guardrail.created
```

**Error States**

```text
COST_POLICY_MISSING
COST_GUARDRAIL_BLOCKED
INVALID_COST_THRESHOLD
PERMISSION_DENIED
```

**QA Cases**

- Negative budget rejected.
- Guardrail with block action prevents MediaJob creation when threshold exceeded.
- BillingAdmin can read cost controls but cannot create campaign unless permitted.

---

### Story S2-02 — Create MediaJob with Approved MediaCostSnapshot

**User Story**  
As a creator, I need to create a media job only after cost approval so uncontrolled generation cannot occur.

**Affected entities**

```text
MediaJob
MediaCostSnapshot
Campaign
BriefVersion
PromptTemplate
AuditLog
```

**Endpoints**

```text
POST /workspaces/{workspaceId}/campaigns/{campaignId}/media-jobs
GET /workspaces/{workspaceId}/campaigns/{campaignId}/media-jobs
GET /workspaces/{workspaceId}/media-jobs/{mediaJobId}
PATCH /workspaces/{workspaceId}/media-jobs/{mediaJobId}/status
```

**Permissions**

```text
media_job.create
media_job.read
media_job.update_status
```

**Acceptance Criteria**

- `Idempotency-Key` is required for create.
- MediaJob cannot start without `MediaCostSnapshot.cost_check_result=approved`.
- MediaJob links to campaign, brief version, and prompt template in same workspace.
- Duplicate idempotency key returns prior result or conflict according to implementation policy.
- Failed provider job does not create UsageMeter automatically.

**Audit Events**

```text
media_job.created
media_job.completed
media_job.failed
```

**Error States**

```text
IDEMPOTENCY_KEY_REQUIRED
IDEMPOTENCY_CONFLICT
MEDIA_COST_SNAPSHOT_REQUIRED
COST_GUARDRAIL_BLOCKED
BRIEF_VERSION_NOT_FOUND
PROMPT_TEMPLATE_NOT_FOUND
TENANT_CONTEXT_MISMATCH
```

**QA Cases**

- Create media job with valid brief/template.
- Create media job without idempotency key fails.
- Attempt running status without approved MediaCostSnapshot fails.
- Same idempotency key replay is safe.

---

### Story S2-03 — Media Asset and Asset Version Creation

**User Story**  
As a creator, I need generated outputs stored as assets and immutable versions.

**Affected entities**

```text
MediaAsset
MediaAssetVersion
MediaJob
Campaign
AuditLog
```

**Endpoints**

```text
GET /workspaces/{workspaceId}/media-jobs/{mediaJobId}/assets
POST /workspaces/{workspaceId}/media-jobs/{mediaJobId}/assets
GET /workspaces/{workspaceId}/assets/{mediaAssetId}/versions
POST /workspaces/{workspaceId}/assets/{mediaAssetId}/versions
```

**Permissions**

```text
media_asset.read
media_asset.create
media_asset.version_create
```

**Acceptance Criteria**

- Asset is created under same workspace/customer account as MediaJob.
- Asset version stores server-generated `content_hash`.
- Approved version cannot be updated.
- Any content change creates a new version.
- `version_number` is unique per asset.

**Audit Events**

```text
media_asset.created
media_asset.version_created
```

**Error States**

```text
MEDIA_JOB_NOT_FOUND
MEDIA_ASSET_NOT_FOUND
DUPLICATE_ASSET_VERSION
IMMUTABLE_APPROVED_VERSION
TENANT_CONTEXT_MISMATCH
```

**QA Cases**

- Create asset after succeeded MediaJob.
- Create asset version with content.
- Duplicate version number fails.
- Attempt to patch approved version content is not exposed or rejected.

---

### Story S2-04 — UsageMeter Recording

**User Story**  
As the platform, I need to record commercial usage only when usable output exists.

**Affected entities**

```text
UsageMeter
UsageQuotaState
MediaJob
AuditLog
```

**Endpoints**

```text
GET /workspaces/{workspaceId}/usage-meter
POST /workspaces/{workspaceId}/usage-meter
GET /workspaces/{workspaceId}/quota-state
```

**Permissions**

```text
usage.read
usage.record
```

**Acceptance Criteria**

- `usable_output_confirmed=true` is required.
- `Idempotency-Key` is required.
- Quantity must be greater than zero.
- Provider failure without usable output does not record usage.
- Usage is scoped to workspace and customer account.

**Audit Events**

```text
usage_meter.recorded
```

**Error States**

```text
USAGE_OUTPUT_NOT_CONFIRMED
IDEMPOTENCY_KEY_REQUIRED
INVALID_USAGE_QUANTITY
SOURCE_ENTITY_NOT_FOUND
TENANT_CONTEXT_MISMATCH
```

**QA Cases**

- Record usage for valid usable output.
- Reject usage with usable_output_confirmed=false.
- Reject quantity zero or negative.
- Idempotency replay is safe.

---

### Story S2-05 — CostEvent Recording

**User Story**  
As the platform, I need to record internal provider cost without treating it as customer billing.

**Affected entities**

```text
CostEvent
MediaJob
AuditLog
```

**Endpoints**

```text
GET /workspaces/{workspaceId}/cost-events
POST /workspaces/{workspaceId}/cost-events
```

**Permissions**

```text
cost.read
cost.record
```

**Acceptance Criteria**

- CostEvent amount cannot be negative.
- CostEvent can be linked to MediaJob if applicable.
- CostEvent does not create invoice or customer billing state.
- Provider timeout/error may create CostEvent but not UsageMeter unless usable output exists.

**Audit Events**

```text
cost_event.recorded
```

**Error States**

```text
INVALID_COST_AMOUNT
MEDIA_JOB_NOT_FOUND
TENANT_CONTEXT_MISMATCH
PERMISSION_DENIED
```

**QA Cases**

- Record provider cost for failed job.
- Ensure failed job does not create usage.
- Negative cost rejected.

---

## 6. Sprint 3 — Review / Approval / Publish / Manual Evidence

### Goal

Enable human-in-the-loop review and safe publishing workflow without auto-publishing.

---

### Story S3-01 — Review Task Creation

**User Story**  
As a creator or admin, I need to assign review tasks for asset versions.

**Affected entities**

```text
ReviewTask
MediaAssetVersion
AuditLog
```

**Endpoints**

```text
GET /workspaces/{workspaceId}/asset-versions/{mediaAssetVersionId}/review-tasks
POST /workspaces/{workspaceId}/asset-versions/{mediaAssetVersionId}/review-tasks
```

**Permissions**

```text
review.read
review.assign
```

**Acceptance Criteria**

- ReviewTask is linked to MediaAssetVersion in same workspace.
- Assignee must be a member of the workspace if provided.
- Review type is one of brand/legal/quality/final.
- Viewer cannot create review task.

**Audit Events**

```text
review_task.created
```

**Error States**

```text
ASSET_VERSION_NOT_FOUND
ASSIGNEE_NOT_WORKSPACE_MEMBER
INVALID_REVIEW_TYPE
PERMISSION_DENIED
```

**QA Cases**

- Create review task for asset version.
- Assign to non-member fails.
- Cross-workspace review task creation fails.

---

### Story S3-02 — ApprovalDecision Integrity

**User Story**  
As a reviewer, I need to approve or reject an exact asset version so publishing cannot bypass review.

**Affected entities**

```text
ApprovalDecision
ReviewTask
MediaAssetVersion
AuditLog
```

**Endpoints**

```text
POST /workspaces/{workspaceId}/review-tasks/{reviewTaskId}/decisions
```

**Permissions**

```text
approval.decide
```

**Acceptance Criteria**

- Approved decision requires `approved_content_hash`.
- `approved_content_hash` must match `MediaAssetVersion.content_hash`.
- Decision media_asset_version_id must match ReviewTask media_asset_version_id.
- ApprovalDecision is append-only.
- Rejected and changes_requested decisions may include reason.

**Audit Events**

```text
approval_decision.created
```

**Error States**

```text
APPROVAL_HASH_REQUIRED
APPROVAL_HASH_MISMATCH
REVIEW_TASK_VERSION_MISMATCH
PERMISSION_DENIED
APPROVAL_DECISION_IMMUTABLE
```

**QA Cases**

- Approve with matching hash succeeds.
- Approve without hash fails.
- Approve with wrong hash fails.
- Update/delete ApprovalDecision fails.

---

### Story S3-03 — PublishJob Creation from Approved Decision

**User Story**  
As a publisher, I need to create a PublishJob only from approved content.

**Affected entities**

```text
PublishJob
ApprovalDecision
MediaAssetVersion
Campaign
AuditLog
```

**Endpoints**

```text
POST /workspaces/{workspaceId}/approval-decisions/{approvalDecisionId}/publish-jobs
```

**Permissions**

```text
publish_job.create
```

**Acceptance Criteria**

- `Idempotency-Key` is required.
- ApprovalDecision must be `approved`.
- PublishJob media_asset_version_id must match ApprovalDecision media_asset_version_id.
- Approved hash must match current MediaAssetVersion content_hash.
- No auto-publishing connector is invoked in Phase 0/1.

**Audit Events**

```text
publish_job.created
```

**Error States**

```text
IDEMPOTENCY_KEY_REQUIRED
APPROVAL_NOT_APPROVED
APPROVAL_HASH_MISMATCH
ASSET_VERSION_MISMATCH
AUTO_PUBLISHING_NOT_SUPPORTED_PHASE_0_1
```

**QA Cases**

- Create PublishJob from approved decision.
- Rejected decision cannot create PublishJob.
- Hash mismatch blocks PublishJob.
- Idempotency replay is safe.

---

### Story S3-04 — ManualPublishEvidence Append-Only Submission

**User Story**  
As a publisher, I need to submit proof of manual publishing without allowing later tampering.

**Affected entities**

```text
ManualPublishEvidence
PublishJob
MediaAssetVersion
AuditLog
```

**Endpoints**

```text
GET /workspaces/{workspaceId}/publish-jobs/{publishJobId}/manual-evidence
POST /workspaces/{workspaceId}/publish-jobs/{publishJobId}/manual-evidence
POST /workspaces/{workspaceId}/manual-evidence/{manualPublishEvidenceId}/supersede
POST /workspaces/{workspaceId}/manual-evidence/{manualPublishEvidenceId}/invalidate
```

**Permissions**

```text
manual_evidence.read
manual_evidence.submit
manual_evidence.invalidate
```

**Acceptance Criteria**

- No PATCH endpoint exists.
- No DELETE endpoint exists.
- Submitted content_hash must match MediaAssetVersion.content_hash.
- Supersede creates a new evidence row with `supersedes_evidence_id`.
- Invalidate does not delete the row.
- Evidence is append-only at DB level.

**Audit Events**

```text
manual_publish_evidence.submitted
manual_publish_evidence.superseded
manual_publish_evidence.invalidated
```

**Error States**

```text
EVIDENCE_HASH_MISMATCH
PUBLISH_JOB_NOT_FOUND
EVIDENCE_APPEND_ONLY
EVIDENCE_NOT_FOUND
PERMISSION_DENIED
```

**QA Cases**

- Submit evidence with matching hash succeeds.
- Submit evidence with wrong hash fails.
- PATCH route does not exist.
- DELETE route does not exist.
- Supersede creates new row.
- Invalidate preserves original row.

---

### Story S3-05 — TrackedLink Creation

**User Story**  
As a publisher, I need tracked links tied to PublishJob so basic campaign measurement can exist without advanced attribution.

**Affected entities**

```text
TrackedLink
PublishJob
AuditLog
```

**Endpoints**

```text
GET /workspaces/{workspaceId}/publish-jobs/{publishJobId}/tracked-links
POST /workspaces/{workspaceId}/publish-jobs/{publishJobId}/tracked-links
```

**Permissions**

```text
tracked_link.read
tracked_link.create
```

**Acceptance Criteria**

- TrackedLink belongs to PublishJob in same workspace.
- Tracking code is unique per workspace.
- Original URL is preserved.
- No advanced attribution decision is created in Phase 0/1.

**Audit Events**

```text
tracked_link.created
```

**Error States**

```text
PUBLISH_JOB_NOT_FOUND
DUPLICATE_TRACKING_CODE
INVALID_URL
ADVANCED_ATTRIBUTION_NOT_SUPPORTED_PHASE_0_1
```

**QA Cases**

- Create tracked link for PublishJob.
- Duplicate tracking code fails.
- Workspace A cannot create tracked link for Workspace B publish job.

---

## 7. Sprint 4 — Reports / Audit / Operations / Pilot Gate

### Goal

Freeze report truth, expose auditability, finalize operational controls, and prepare for pilot readiness.

---

### Story S4-01 — ClientReportSnapshot Generation

**User Story**  
As a workspace user, I need client reports to be frozen so later evidence changes do not alter historical reports.

**Affected entities**

```text
ClientReportSnapshot
Campaign
ReportTemplate
ManualPublishEvidence
AuditLog
```

**Endpoints**

```text
GET /workspaces/{workspaceId}/campaigns/{campaignId}/client-report-snapshots
POST /workspaces/{workspaceId}/campaigns/{campaignId}/client-report-snapshots
```

**Permissions**

```text
report.read
report.generate
```

**Acceptance Criteria**

- Report snapshot includes frozen report payload.
- Evidence snapshot is copied into the report snapshot.
- Later evidence supersede/invalidate does not mutate old report.
- `content_hash` is generated server-side.

**Audit Events**

```text
client_report_snapshot.generated
```

**Error States**

```text
REPORT_TEMPLATE_NOT_FOUND
INVALID_REPORT_PERIOD
CAMPAIGN_NOT_FOUND
SNAPSHOT_IMMUTABILITY_VIOLATION
```

**QA Cases**

- Generate report snapshot.
- Supersede evidence after report generation.
- Verify old report payload does not change.
- Attempt to update report snapshot fails.

---

### Story S4-02 — AuditLog Read Model

**User Story**  
As an admin, I need to view audit logs for governance and investigation.

**Affected entities**

```text
AuditLog
```

**Endpoints**

```text
GET /workspaces/{workspaceId}/audit-logs
```

**Permissions**

```text
audit.read
```

**Acceptance Criteria**

- Audit logs are append-only.
- Audit list is scoped by workspace.
- Correlation ID is searchable/filterable in implementation.
- AuditLog is not used as business state source.

**Audit Events**

```text
N/A for read, unless security policy requires read auditing
```

**Error States**

```text
PERMISSION_DENIED
TENANT_ACCESS_DENIED
AUDIT_LOG_APPEND_ONLY
```

**QA Cases**

- Admin can read audit logs.
- Viewer cannot read audit logs unless permission granted.
- Workspace A cannot read Workspace B audit logs.
- Update/delete audit log fails at DB level.

---

### Story S4-03 — Safe Mode Operations

**User Story**  
As an admin, I need to activate safe mode to stop risky operations during incidents.

**Affected entities**

```text
SafeModeState
AuditLog
AdminNotification
```

**Endpoints**

```text
GET /workspaces/{workspaceId}/safe-mode
POST /workspaces/{workspaceId}/safe-mode
```

**Permissions**

```text
operations.read
operations.safe_mode
```

**Acceptance Criteria**

- Admin can activate/deactivate safe mode.
- Safe mode activation creates audit event.
- Safe mode blocks configured risky operations in implementation policy.
- Non-admin cannot change safe mode.

**Audit Events**

```text
safe_mode.activated
safe_mode.deactivated
```

**Error States**

```text
PERMISSION_DENIED
SAFE_MODE_ACTIVE
INVALID_SAFE_MODE_STATE
```

**QA Cases**

- Activate safe mode.
- Deactivate safe mode.
- Verify protected write operation is blocked while active if policy says so.

---

### Story S4-04 — Onboarding Progress

**User Story**  
As a workspace admin, I need onboarding progress so setup can be tracked before pilot.

**Affected entities**

```text
OnboardingProgress
SetupChecklistItem
AuditLog
```

**Endpoints**

```text
GET /workspaces/{workspaceId}/onboarding-progress
PATCH /workspaces/{workspaceId}/onboarding-progress
```

**Permissions**

```text
onboarding.read
onboarding.write
```

**Acceptance Criteria**

- Onboarding progress exists per workspace.
- Only one progress record per workspace.
- Progress payload can be updated by authorized user.
- Completion does not bypass required pilot checks.

**Audit Events**

```text
onboarding.updated
```

**Error States**

```text
ONBOARDING_NOT_FOUND
INVALID_ONBOARDING_STATE
PERMISSION_DENIED
```

**QA Cases**

- Create/update onboarding progress.
- Duplicate onboarding progress per workspace is rejected.
- Unauthorized update fails.

---

### Story S4-05 — Pilot Readiness Gate

**User Story**  
As the product owner, I need a pilot readiness gate so no paid customer exposure happens with broken isolation, approval, or evidence controls.

**Affected entities**

```text
Workspace
Campaign
MediaJob
MediaAssetVersion
ApprovalDecision
PublishJob
ManualPublishEvidence
UsageMeter
ClientReportSnapshot
AuditLog
```

**Endpoints**

```text
All Phase 0/1 endpoints
```

**Permissions**

```text
All Phase 0/1 permissions
```

**Acceptance Criteria**

Pilot is blocked if any of the following fails:

```text
Tenant isolation
RBAC enforcement
Approval hash integrity
PublishJob approval gate
Manual evidence append-only behavior
UsageMeter usable output rule
Report snapshot immutability
Error model consistency
Idempotency behavior
Audit event coverage
```

**Audit Events**

```text
pilot_gate.evaluated
pilot_gate.failed
pilot_gate.passed
```

**Error States**

```text
PILOT_GATE_FAILED
TENANT_ISOLATION_FAILED
RBAC_FAILED
APPROVAL_BYPASS_DETECTED
EVIDENCE_MUTATION_DETECTED
USAGE_COUNTED_ON_FAILED_JOB
REPORT_SNAPSHOT_MUTATED
```

**QA Cases**

- User in Workspace A cannot read Workspace B data across all major entities.
- Publisher cannot publish unapproved version.
- Wrong content hash blocks publish.
- Manual evidence cannot be patched or deleted.
- Failed AI job does not record commercial usage.
- Report snapshot does not change after evidence supersede.

---

## 8. Cross-Sprint QA Matrix

| Risk | Required Test | Blocking? |
|---|---|---|
| Tenant data leakage | Cross-workspace read/write attempts | Yes |
| RBAC bypass | Role-based write attempts | Yes |
| Approval bypass | Publish without approved decision | Yes |
| Hash mismatch | Publish with stale/changed content hash | Yes |
| Evidence tampering | PATCH/DELETE ManualPublishEvidence | Yes |
| Incorrect billing usage | UsageMeter on failed output | Yes |
| Report mutation | Evidence changes after snapshot | Yes |
| Idempotency failure | Duplicate Idempotency-Key behavior | Yes |
| Error inconsistency | Missing ErrorModel fields | Yes |
| Audit gap | Sensitive write without AuditLog | Yes |

---

## 9. Backlog Dependency Map

```text
S0-01 must finish before all stories.
S0-02 must finish before any workspace endpoint.
S0-03 must finish before permission-gated endpoints.
S1-02 and S1-03 must finish before meaningful MediaJob creation.
S1-04 and S1-05 must finish before S2-02.
S2-01 must finish before S2-02.
S2-02 must finish before S2-03.
S2-03 must finish before S3-01.
S3-01 must finish before S3-02.
S3-02 must finish before S3-03.
S3-03 must finish before S3-04 and S3-05.
S3-04 must finish before S4-01.
S4-05 must pass before pilot exposure.
```

---

## 10. Explicitly Deferred Items

The following are not part of this backlog:

```text
BillingProvider implementation
ProviderUsageLog
Paid Execution
Social API Auto-Publishing
Advanced Attribution
AttributionDecision
AI Agents
Advanced Media Pipeline
Full Video Production
Enterprise White-label
```

Adding any of these requires a new approved backlog after Phase 0/1 contracts are complete.

---

## 11. Final Transition Decision

This backlog is ready to be converted into either:

```text
1. GitHub Issues grouped by Sprint 0–4
2. QA Test Suite / Test Matrix
3. Codex implementation tasks after QA Matrix is approved
```

Current decision:

```text
GO to QA Test Suite / Test Matrix.
NO-GO to coding until QA Test Suite exists.
NO-GO to frontend until OpenAPI is validated.
```

Next required output:

```text
Create QA Test Suite Phase 0/1 covering tenant isolation, RBAC, approval integrity, usage/cost, evidence immutability, report snapshots, API error model, and idempotency behavior.
```
