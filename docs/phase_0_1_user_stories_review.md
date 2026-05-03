# Phase 0/1 User Stories Review

## Document status

Documentation-only review of existing Phase 0/1 backlog stories. This document normalizes and reviews the approved backlog; it does not replace the backlog and does not add implementation authority.

## Executive decision

The existing backlog is sufficient as the primary user-story authority for Phase 0/1, but it benefits from a normalized review format before any next coding slice. No new Core V1 capability is introduced here.

Decision: **GO for review / NO-GO for direct implementation from this document alone**.

## Review principles

1. Existing backlog story IDs remain the source references.
2. Entity names must remain aligned with the approved ERD: `MediaJob`, `MediaAsset`, `MediaAssetVersion`, `ApprovalDecision`, `ManualPublishEvidence`, `ClientReportSnapshot`.
3. Legacy names `GenerationJob`, `Asset`, and `Approval` must not be introduced as standalone tables or implementation concepts.
4. Extended V1 and Post V1 ideas must remain deferred unless separately approved.
5. User stories are not executable until ERD, SQL, OpenAPI, permissions, audit, error states, and QA coverage are confirmed for the selected slice.

---

## 1. Foundation / Tenant / RBAC stories

### S0-01 — Initialize PostgreSQL Schema

| Field | Review |
|---|---|
| Actor | Backend engineer / platform maintainer |
| Goal | Apply the approved database foundation in a controlled migration |
| Business value | Prevents implementation against undocumented or unstable schema |
| Affected entities | All Phase 0/1 tables, enums, constraints, indexes, triggers |
| Affected endpoints | N/A |
| Permissions | N/A |
| Audit events | N/A |
| Test coverage | QA-DB, QA-TI, QA-AUD |
| Status | Complete as contract |
| Gap | Requires selected implementation environment verification before each DB-backed slice |

### S0-02 — AuthGuard and WorkspaceContextGuard

| Field | Review |
|---|---|
| Actor | Workspace member |
| Goal | Ensure workspace-scoped access only |
| Business value | Prevents cross-tenant data leakage |
| Affected entities | User, Workspace, WorkspaceMember, AuditLog |
| Affected endpoints | All `/workspaces/{workspaceId}/...` endpoints |
| Permissions | All workspace permissions depend on membership |
| Audit events | security.workspace_access_denied |
| Test coverage | QA-TI-001 to QA-TI-004 |
| Status | Complete as contract |
| Gap | Runtime must prove body `workspace_id` is rejected or ignored in every write |

### S0-03 — RBAC roles and permissions

| Field | Review |
|---|---|
| Actor | Admin / platform maintainer |
| Goal | Seed roles and enforce permission boundaries |
| Business value | Prevents privilege escalation and incorrect operational ownership |
| Affected entities | Role, Permission, RolePermission, WorkspaceMember |
| Affected endpoints | `GET /roles`, `GET /permissions` |
| Permissions | rbac.read, workspace.manage_members |
| Audit events | rbac.seeded, member.role_changed |
| Test coverage | QA-RBAC-001 to QA-RBAC-004 |
| Status | Complete as contract |
| Gap | Permission seed must be rechecked whenever OpenAPI gains new `x-permission` values |

### S0-04 — Unified ErrorModel

| Field | Review |
|---|---|
| Actor | Frontend engineer / API consumer |
| Goal | Receive predictable error responses |
| Business value | Enables safe UI handling, support, and incident tracing |
| Affected entities | N/A |
| Affected endpoints | All endpoints |
| Permissions | N/A |
| Audit events | security.permission_denied, security.validation_failed where applicable |
| Test coverage | QA-ERR-001, QA-ERR-002 |
| Status | Complete as contract |
| Gap | Every new endpoint must include ErrorResponse and correlation_id behavior |

---

## 2. Workspace / Brand / Template / Campaign / Brief stories

### S1-01 — Workspace and Member Management

| Field | Review |
|---|---|
| Actor | Workspace admin |
| Goal | Manage workspace settings and members |
| Business value | Enables controlled team setup without cross-tenant leakage |
| Affected entities | Workspace, WorkspaceMember, User, Role, AuditLog |
| Affected endpoints | `/workspaces`, `/workspaces/{workspaceId}`, `/members` |
| Permissions | workspace.read, workspace.create, workspace.manage, workspace.manage_members |
| Audit events | workspace.created, workspace.updated, member.invited, member.role_changed |
| Test coverage | QA-TI, QA-RBAC |
| Status | Complete as contract |
| Gap | Role-change audit integrity must remain append-only |

### S1-02 — Brand Profile and Brand Voice Rules

| Field | Review |
|---|---|
| Actor | Creator / brand admin |
| Goal | Define brand profile and rules for generated content governance |
| Business value | Prevents off-brand and high-risk content before review |
| Affected entities | BrandProfile, BrandVoiceRule, AuditLog |
| Affected endpoints | `/brand-profiles`, `/brand-profiles/{brandProfileId}/rules` |
| Permissions | brand.read, brand.write |
| Audit events | brand_profile.created, brand_voice_rule.created |
| Test coverage | Backlog QA and Brand Slice 1 repository tests |
| Status | Partial |
| Gap | Repository-only Brand Slice 1 exists, but HTTP/runtime route switching remains NO-GO |

### S1-03 — Prompt Template and Report Template Management

| Field | Review |
|---|---|
| Actor | Admin / creator |
| Goal | Manage prompt and report templates with controlled versions |
| Business value | Prevents uncontrolled generation/reporting inputs |
| Affected entities | PromptTemplate, ReportTemplate, AuditLog |
| Affected endpoints | `/prompt-templates`, `/report-templates` |
| Permissions | prompt_template.read/write, report_template.read/write |
| Audit events | prompt_template.created, report_template.created |
| Test coverage | Backlog QA |
| Status | Partial |
| Gap | Slice 2 planning exists; implementation requires separate approval and verification |

### S1-04 — Campaign Lifecycle

| Field | Review |
|---|---|
| Actor | Creator |
| Goal | Create campaigns and record status transitions |
| Business value | Establishes campaign operational truth |
| Affected entities | Campaign, CampaignStateTransition, AuditLog |
| Affected endpoints | `/campaigns`, `/campaigns/{campaignId}`, `/state-transitions` |
| Permissions | campaign.read, campaign.write |
| Audit events | campaign.created, campaign.updated, campaign.status_changed |
| Test coverage | QA-TI-001, QA-RBAC-001 plus backlog QA |
| Status | Partial |
| Gap | Campaign DB-backed persistence remains NO-GO; runtime is not full DB-backed source of truth |

### S1-05 — Brief Versioning

| Field | Review |
|---|---|
| Actor | Creator |
| Goal | Create immutable campaign brief versions |
| Business value | Preserves generation inputs and later accountability |
| Affected entities | BriefVersion, Campaign, AuditLog |
| Affected endpoints | `/campaigns/{campaignId}/brief-versions` |
| Permissions | brief.read, brief.write |
| Audit events | brief.version_created |
| Test coverage | Backlog QA |
| Status | Partial |
| Gap | No PATCH behavior should be introduced; content change must create new version |

---

## 3. Media / Cost / Usage stories

### S2-01 — Cost Policy and Guardrails

| Field | Review |
|---|---|
| Actor | Admin / BillingAdmin |
| Goal | Set cost budgets and guardrails before generation |
| Business value | Prevents cost abuse and uncontrolled AI/provider spend |
| Affected entities | MediaCostPolicy, CostBudget, CostGuardrail, AuditLog |
| Affected endpoints | `/cost-budgets`, `/cost-guardrails` |
| Permissions | cost_budget.read/write, cost_guardrail.read/write |
| Audit events | cost_budget.created, cost_guardrail.created |
| Test coverage | QA-USG and backlog QA |
| Status | Partial |
| Gap | Must be completed before real AI/provider cost exposure |

### S2-02 — MediaJob with Approved MediaCostSnapshot

| Field | Review |
|---|---|
| Actor | Creator |
| Goal | Create media job only after approved cost snapshot |
| Business value | Enables governed generation workflow without uncontrolled usage |
| Affected entities | MediaJob, MediaCostSnapshot, Campaign, BriefVersion, PromptTemplate, AuditLog |
| Affected endpoints | `/campaigns/{campaignId}/media-jobs`, `/media-jobs/{mediaJobId}`, `/status` |
| Permissions | media_job.create, media_job.read, media_job.update_status |
| Audit events | media_job.created, media_job.completed, media_job.failed |
| Test coverage | QA-IDM-001, QA-IDM-002, QA-DB-002 |
| Status | Partial |
| Gap | Runtime provider execution and external AI calls remain NO-GO |

### S2-03 — Media Asset and Asset Version Creation

| Field | Review |
|---|---|
| Actor | Creator |
| Goal | Store generated outputs as versioned immutable assets |
| Business value | Makes review, approval, and publishing traceable |
| Affected entities | MediaAsset, MediaAssetVersion, MediaJob, Campaign, AuditLog |
| Affected endpoints | `/media-jobs/{mediaJobId}/assets`, `/assets/{mediaAssetId}/versions` |
| Permissions | media_asset.read, media_asset.create, media_asset.version_create |
| Audit events | media_asset.created, media_asset.version_created |
| Test coverage | QA-TI-002, QA-DB-001 |
| Status | Partial |
| Gap | Approved version immutability must be enforced before publish workflow becomes trusted |

### S2-04 — UsageMeter Recording

| Field | Review |
|---|---|
| Actor | Platform service / authorized usage recorder |
| Goal | Record commercial usage only for usable output |
| Business value | Prevents false billing-like usage and customer disputes |
| Affected entities | UsageMeter, UsageQuotaState, MediaJob, AuditLog |
| Affected endpoints | `/usage-meter`, `/quota-state` |
| Permissions | usage.read, usage.record |
| Audit events | usage_meter.recorded |
| Test coverage | QA-USG-001, QA-USG-002, QA-IDM-004 |
| Status | Complete as contract |
| Gap | Usage remains not invoice truth; billing exposure remains NO-GO |

### S2-05 — CostEvent Recording

| Field | Review |
|---|---|
| Actor | Platform service |
| Goal | Record internal provider cost without billing side effects |
| Business value | Enables cost governance without financial misstatement |
| Affected entities | CostEvent, MediaJob, AuditLog |
| Affected endpoints | `/cost-events` |
| Permissions | cost.read, cost.record |
| Audit events | cost_event.recorded |
| Test coverage | QA-USG-003 |
| Status | Partial |
| Gap | Must never create invoice/customer billing state |

---

## 4. Review / Approval / Publish / Evidence stories

### S3-01 — Review Task Creation

| Field | Review |
|---|---|
| Actor | Creator / Admin |
| Goal | Assign review tasks for a specific MediaAssetVersion |
| Business value | Supports human-in-the-loop approval governance |
| Affected entities | ReviewTask, MediaAssetVersion, AuditLog |
| Affected endpoints | `/asset-versions/{mediaAssetVersionId}/review-tasks` |
| Permissions | review.read, review.assign |
| Audit events | review_task.created |
| Test coverage | Backlog QA |
| Status | Partial |
| Gap | Assignee membership must be validated strictly |

### S3-02 — ApprovalDecision Integrity

| Field | Review |
|---|---|
| Actor | Reviewer |
| Goal | Approve or reject the exact asset version under review |
| Business value | Prevents publishing content that was not approved |
| Affected entities | ApprovalDecision, ReviewTask, MediaAssetVersion, AuditLog |
| Affected endpoints | `/review-tasks/{reviewTaskId}/decisions` |
| Permissions | approval.decide |
| Audit events | approval_decision.created |
| Test coverage | QA-APP-001 to QA-APP-004 |
| Status | Complete as contract |
| Gap | No self-approval automation; runtime agents cannot approve |

### S3-03 — PublishJob Creation from Approved Decision

| Field | Review |
|---|---|
| Actor | Publisher |
| Goal | Create publish job only from approved content |
| Business value | Prevents review bypass and publish integrity failure |
| Affected entities | PublishJob, ApprovalDecision, MediaAssetVersion, Campaign, AuditLog |
| Affected endpoints | `/approval-decisions/{approvalDecisionId}/publish-jobs` |
| Permissions | publish_job.create |
| Audit events | publish_job.created |
| Test coverage | QA-APP-003, QA-APP-004, QA-IDM-003 |
| Status | Complete as contract |
| Gap | External publishing remains NO-GO |

### S3-04 — ManualPublishEvidence Append-Only Submission

| Field | Review |
|---|---|
| Actor | Publisher |
| Goal | Submit tamper-resistant manual publish evidence |
| Business value | Protects reporting, client trust, and auditability |
| Affected entities | ManualPublishEvidence, PublishJob, MediaAssetVersion, AuditLog |
| Affected endpoints | `/manual-evidence`, `/supersede`, `/invalidate` |
| Permissions | manual_evidence.read, manual_evidence.submit, manual_evidence.invalidate |
| Audit events | manual_publish_evidence.submitted, superseded, invalidated |
| Test coverage | QA-EVD-001 to QA-EVD-005 |
| Status | Complete as contract |
| Gap | Invalidate must not mutate proof fields or content hash |

### S3-05 — TrackedLink Creation

| Field | Review |
|---|---|
| Actor | Publisher |
| Goal | Create tracked links tied to PublishJob |
| Business value | Enables basic measurement without advanced attribution claims |
| Affected entities | TrackedLink, PublishJob, AuditLog |
| Affected endpoints | `/tracked-links` |
| Permissions | tracked_link.read, tracked_link.create |
| Audit events | tracked_link.created |
| Test coverage | Backlog QA |
| Status | Partial |
| Gap | Advanced attribution is explicitly deferred |

---

## 5. Reports / Audit / Operations stories

### S4-01 — ClientReportSnapshot Generation

| Field | Review |
|---|---|
| Actor | Workspace user |
| Goal | Generate frozen client report snapshots |
| Business value | Prevents historical report tampering after evidence changes |
| Affected entities | ClientReportSnapshot, Campaign, ReportTemplate, ManualPublishEvidence, AuditLog |
| Affected endpoints | `/client-report-snapshots` |
| Permissions | report.read, report.generate |
| Audit events | client_report_snapshot.generated |
| Test coverage | QA-RPT-001 to QA-RPT-003 |
| Status | Complete as contract |
| Gap | Report payload must not be derived from mutable live evidence at read time |

### S4-02 — AuditLog Read Model

| Field | Review |
|---|---|
| Actor | Admin |
| Goal | Read audit logs for governance and investigation |
| Business value | Supports accountability and incident review |
| Affected entities | AuditLog |
| Affected endpoints | `/audit-logs` |
| Permissions | audit.read |
| Audit events | N/A for read unless policy requires read auditing |
| Test coverage | QA-AUD-001, QA-AUD-002 |
| Status | Complete as contract |
| Gap | AuditLog must remain append-only and not business state |

### S4-03 — Safe Mode Operations

| Field | Review |
|---|---|
| Actor | Admin |
| Goal | Activate/deactivate safe mode during risk events |
| Business value | Provides operational kill-switch for risky operations |
| Affected entities | SafeModeState, AdminNotification, AuditLog |
| Affected endpoints | `/safe-mode` |
| Permissions | operations.read, operations.safe_mode |
| Audit events | safe_mode.activated, safe_mode.deactivated |
| Test coverage | QA-OPS-001, QA-OPS-002 |
| Status | Partial |
| Gap | Implementation must define which operations are blocked in safe mode |

### S4-04 — Onboarding Progress

| Field | Review |
|---|---|
| Actor | Workspace admin |
| Goal | Track setup progress before pilot readiness |
| Business value | Reduces onboarding ambiguity and operational risk |
| Affected entities | OnboardingProgress, SetupChecklistItem, AuditLog |
| Affected endpoints | `/onboarding-progress` |
| Permissions | onboarding.read, onboarding.write |
| Audit events | onboarding.updated if implemented as sensitive write |
| Test coverage | QA-OPS-003 |
| Status | Partial |
| Gap | Completion must not imply Pilot or Production approval |

## Final recommendation

The backlog is structurally strong and should remain authoritative. The highest-risk stories before future implementation are:

1. MediaJob / MediaCostSnapshot / UsageMeter because they can create cost and commercial disputes.
2. ApprovalDecision / PublishJob / ManualPublishEvidence because they create trust and audit exposure.
3. Tenant isolation / RBAC because failure is systemic.
4. Source-of-truth ambiguity because future PRD and agentic documents may be misused as implementation authority.
