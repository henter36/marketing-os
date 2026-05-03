# Phase 0/1 Traceability Matrix

## Document status

Documentation-only. This matrix maps existing Phase 0/1 authority sources. It does not add approved capabilities and does not authorize implementation.

## Legend

| Status | Meaning |
|---|---|
| Complete | Story has ERD, OpenAPI, permission, audit, and QA mapping |
| Partial | Material exists but one or more links require strengthening before coding |
| Missing | Required link is absent |
| Conflict | Sources disagree and implementation must stop |
| Deferred | Explicitly out of Phase 0/1 or not approved |

## Matrix

| Capability | Story | ERD entities | SQL tables | OpenAPI endpoints | Permission/RBAC | Audit event | QA coverage | Error states | Status | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| Database baseline | S0-01 | All Phase 0/1 entities | All base schema + patches 001/002 | N/A | N/A | N/A | QA-DB, QA-TI, QA-AUD | migration_failed, constraint_creation_failed | Complete | Coding must follow strict migration order only |
| Auth and workspace context | S0-02 | User, Workspace, WorkspaceMember, AuditLog | users, workspaces, workspace_members, audit_logs | All `/workspaces/{workspaceId}` routes | AuthGuard, WorkspaceContextGuard, MembershipCheck, PermissionGuard | security.workspace_access_denied | QA-TI-001 to QA-TI-004 | AUTH_REQUIRED, WORKSPACE_ACCESS_DENIED, TENANT_CONTEXT_MISMATCH | Complete | Body workspace_id must not be trusted |
| RBAC seed | S0-03 | Role, Permission, RolePermission, WorkspaceMember | roles, permissions, role_permissions, workspace_members | `GET /roles`, `GET /permissions` | rbac.read, workspace.manage_members | rbac.seeded, member.role_changed | QA-RBAC-001 to QA-RBAC-004 | PERMISSION_DENIED, ROLE_NOT_FOUND | Complete | Role mapping still needs implementation-specific seed verification per slice |
| Error model | S0-04 | N/A | N/A | All endpoints | N/A | security.validation_failed, security.permission_denied | QA-ERR-001, QA-ERR-002 | ErrorModel codes | Complete | Correlation ID is mandatory |
| Workspace/member management | S1-01 | Workspace, WorkspaceMember, User, Role, AuditLog | workspaces, workspace_members, users, roles, audit_logs | `/workspaces`, `/workspaces/{workspaceId}`, `/members` | workspace.read/create/manage/manage_members | workspace.created, workspace.updated, member.invited, member.role_changed | QA-RBAC, QA-TI | MEMBER_ALREADY_EXISTS, IMMUTABLE_FIELD_UPDATE | Complete | Customer account immutability must be preserved |
| Brand profile/rules | S1-02 | BrandProfile, BrandVoiceRule, AuditLog | brand_profiles, brand_voice_rules, audit_logs | `/brand-profiles`, `/brand-profiles/{id}/rules` | brand.read, brand.write | brand_profile.created, brand_voice_rule.created | Backlog QA; repository slice tests | DUPLICATE_BRAND_PROFILE, TENANT_CONTEXT_MISMATCH | Partial | Repository-only Brand Slice 1 exists; runtime route switch remains NO-GO |
| Prompt/report templates | S1-03 | PromptTemplate, ReportTemplate, AuditLog | prompt_templates, report_templates, audit_logs | `/prompt-templates`, `/report-templates` | prompt_template.*, report_template.* | prompt_template.created, report_template.created | Backlog QA | DUPLICATE_TEMPLATE_VERSION, INVALID_TEMPLATE_TYPE | Partial | Slice 2 planning exists; implementation remains gated |
| Campaign lifecycle | S1-04 | Campaign, CampaignStateTransition, AuditLog | campaigns, campaign_state_transitions, audit_logs | `/campaigns`, `/campaigns/{id}`, `/state-transitions` | campaign.read, campaign.write | campaign.created, campaign.updated, campaign.status_changed | QA-TI-001, QA-RBAC-001 | CAMPAIGN_NOT_FOUND, INVALID_CAMPAIGN_STATE | Partial | Runtime exists mainly in-memory; DB-backed campaign persistence is NO-GO |
| Brief versioning | S1-05 | BriefVersion, Campaign, AuditLog | brief_versions, campaigns, audit_logs | `/campaigns/{id}/brief-versions` | brief.read, brief.write | brief.version_created | Backlog QA | DUPLICATE_BRIEF_VERSION, IMMUTABLE_FIELD_UPDATE | Partial | Must remain create-new-version, not patch historical content |
| Cost policy/guardrails | S2-01 | MediaCostPolicy, CostBudget, CostGuardrail, AuditLog | media_cost_policies, cost_budgets, cost_guardrails, audit_logs | `/cost-budgets`, `/cost-guardrails` | cost_budget.*, cost_guardrail.* | cost_budget.created, cost_guardrail.created | QA-USG, backlog QA | COST_POLICY_MISSING, COST_GUARDRAIL_BLOCKED | Partial | Commercial controls are high-risk; must be verified before real AI costs |
| MediaJob with cost snapshot | S2-02 | MediaJob, MediaCostSnapshot, Campaign, BriefVersion, PromptTemplate | media_jobs, media_cost_snapshots | `/campaigns/{id}/media-jobs`, `/media-jobs/{id}`, `/status` | media_job.create/read/update_status | media_job.created/completed/failed | QA-IDM-001, QA-DB-002 | MEDIA_COST_SNAPSHOT_REQUIRED, IDEMPOTENCY_CONFLICT | Partial | Runtime AI/provider execution remains NO-GO |
| Media asset/version | S2-03 | MediaAsset, MediaAssetVersion, MediaJob | media_assets, media_asset_versions | `/media-jobs/{id}/assets`, `/assets/{id}/versions` | media_asset.read/create/version_create | media_asset.created, media_asset.version_created | QA-TI-002, QA-DB-001 | DUPLICATE_ASSET_VERSION, IMMUTABLE_APPROVED_VERSION | Partial | Approval/publish integrity depends on content_hash |
| UsageMeter | S2-04 | UsageMeter, UsageQuotaState, MediaJob | usage_meter, usage_quota_state | `/usage-meter`, `/quota-state` | usage.read, usage.record | usage_meter.recorded | QA-USG-001, QA-IDM-004 | USAGE_OUTPUT_NOT_CONFIRMED, INVALID_USAGE_QUANTITY | Complete as contract | Billing exposure remains NO-GO; usage is not invoice truth |
| CostEvent | S2-05 | CostEvent, MediaJob, AuditLog | cost_events | `/cost-events` | cost.read, cost.record | cost_event.recorded | QA-USG-003 | INVALID_COST_AMOUNT | Partial | CostEvent is not billing/invoice source |
| Review task | S3-01 | ReviewTask, MediaAssetVersion, AuditLog | review_tasks, media_asset_versions | `/asset-versions/{id}/review-tasks` | review.read, review.assign | review_task.created | Backlog QA | ASSIGNEE_NOT_WORKSPACE_MEMBER | Partial | Assignee must be workspace member |
| Approval decision | S3-02 | ApprovalDecision, ReviewTask, MediaAssetVersion | approval_decisions, review_tasks, media_asset_versions | `/review-tasks/{id}/decisions` | approval.decide | approval_decision.created | QA-APP-001 to QA-APP-004 | APPROVAL_HASH_REQUIRED, APPROVAL_HASH_MISMATCH | Complete as contract | ApprovalDecision is approval truth, not MediaAsset.asset_status alone |
| PublishJob | S3-03 | PublishJob, ApprovalDecision, MediaAssetVersion, Campaign | publish_jobs, approval_decisions, media_asset_versions | `/approval-decisions/{id}/publish-jobs` | publish_job.create | publish_job.created | QA-APP-003, QA-IDM-003 | APPROVAL_NOT_APPROVED, ASSET_VERSION_MISMATCH | Complete as contract | External publishing remains NO-GO |
| Manual evidence | S3-04 | ManualPublishEvidence, PublishJob, MediaAssetVersion | manual_publish_evidence | `/manual-evidence`, `/supersede`, `/invalidate` | manual_evidence.read/submit/invalidate | manual_publish_evidence.* | QA-EVD-001 to QA-EVD-005 | EVIDENCE_HASH_MISMATCH, EVIDENCE_APPEND_ONLY | Complete as contract | Invalidate is limited state update only; content proof remains immutable |
| Tracked links | S3-05 | TrackedLink, PublishJob | tracked_links, publish_jobs | `/publish-jobs/{id}/tracked-links` | tracked_link.read/create | tracked_link.created | Backlog QA | DUPLICATE_TRACKING_CODE, INVALID_URL | Partial | Advanced attribution is not approved |
| Client report snapshot | S4-01 | ClientReportSnapshot, Campaign, ReportTemplate, ManualPublishEvidence | client_report_snapshots | `/client-report-snapshots` | report.read/generate | client_report_snapshot.generated | QA-RPT-001 to QA-RPT-003 | SNAPSHOT_IMMUTABILITY_VIOLATION | Complete as contract | Snapshot must freeze evidence and payload truth |
| Audit read model | S4-02 | AuditLog | audit_logs | `/audit-logs` | audit.read | N/A for read | QA-AUD-001, QA-AUD-002 | AUDIT_LOG_APPEND_ONLY | Complete as contract | AuditLog is append-only, not business state |
| Safe mode | S4-03 | SafeModeState, AdminNotification, AuditLog | safe_mode_states, admin_notifications | `/safe-mode` | operations.read, operations.safe_mode | safe_mode.activated/deactivated | QA-OPS-001, QA-OPS-002 | SAFE_MODE_ACTIVE | Partial | Must define which operations are blocked per implementation slice |
| Onboarding | S4-04 | OnboardingProgress, SetupChecklistItem | onboarding_progress, setup_checklist_items | `/onboarding-progress` | onboarding.read/write | onboarding.updated if implemented | QA-OPS-003 | INVALID_ONBOARDING_STATE | Partial | Operational readiness only; does not approve Pilot |
| External publishing | Deferred | Not in Phase 0/1 as active connector | N/A | N/A | N/A | N/A | N/A | AUTO_PUBLISHING_NOT_SUPPORTED_PHASE_0_1 | Deferred | NO-GO |
| Runtime agents | Deferred | AgentRun explicitly out of ERD | N/A | N/A | N/A | N/A | N/A | N/A | Deferred | NO-GO |
| Paid ads execution | Deferred | PaidExecution explicitly out of ERD | N/A | N/A | N/A | N/A | N/A | N/A | Deferred | NO-GO |
| Advanced attribution | Deferred | AttributionDecision out of ERD | N/A | N/A | N/A | N/A | N/A | ADVANCED_ATTRIBUTION_NOT_SUPPORTED_PHASE_0_1 | Deferred | NO-GO |

## Required before coding any next slice

1. Convert every `Partial` row in the selected slice to a precise implementation plan.
2. Confirm SQL/OpenAPI impact is none or produce a separate proposed patch.
3. Confirm QA test IDs or add a QA addendum before coding.
4. Confirm permission and audit events.
5. Preserve all deferred NO-GO rows.
