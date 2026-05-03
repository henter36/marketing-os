# Phase 0/1 Permission and Audit Matrix

## Document status

Documentation-only matrix. This file reviews existing Phase 0/1 permission and audit expectations. It does not replace OpenAPI, RBAC seed files, QA, or implementation tests.

## Executive decision

Permission and audit coverage is sufficient as a contract foundation, but every implementation PR must prove parity between OpenAPI `x-permission`, seeded permissions, guard enforcement, audit events, ErrorModel responses, and QA coverage.

Decision: **GO as review matrix / NO-GO as standalone implementation authority**.

## Role posture

| Role | Intended posture | Key allowed actions | Key denied actions | Risk note |
|---|---|---|---|---|
| Owner | Full workspace governance | Manage workspace, members, roles where allowed, read audit, operate campaigns | Cannot bypass immutable evidence, approval hash, tenant isolation, or audit | Owner is powerful but not above system integrity |
| Admin | Workspace operations | Manage workspace, members, safe mode, read audit if permitted | Cannot publish or approve unless explicitly granted | Avoid role overreach |
| Creator | Content/campaign creation | Create campaign, brief, media job, assets, templates if permitted | Cannot approve, publish, manage billing/cost unless granted | Creator must not become reviewer by default |
| Reviewer | Review and approval | Create approval decisions if `approval.decide` exists | Cannot publish unless also Publisher | Separation of duties protects approval workflow |
| Publisher | Publish workflow | Create PublishJob, submit/supersede/invalidate manual evidence | Cannot approve unless also Reviewer with approval.decide | Publisher cannot create approval truth alone |
| BillingAdmin | Cost and usage visibility/control | Read/manage usage/cost/guardrails where permitted | Cannot modify campaign content by default | Prevent financial role from editing marketing truth |
| Viewer | Read-only | View permitted records | All writes denied | Baseline RBAC negative test |

## Permission and audit matrix

| Domain | Action | Endpoint / entity | Required permission | Required audit event | Denied examples | Error states | QA coverage | Status |
|---|---|---|---|---|---|---|---|---|
| Workspaces | List workspaces | `GET /workspaces` | workspace.read | Optional / workspace.listed if policy requires | Unauthenticated user | AUTH_REQUIRED | QA-ERR, QA-RBAC | Complete as contract |
| Workspaces | Create workspace | `POST /workspaces` | workspace.create | workspace.created | Viewer, unauthenticated | AUTH_REQUIRED, PERMISSION_DENIED | QA-RBAC, backlog QA | Complete as contract |
| Workspaces | Update workspace | `PATCH /workspaces/{workspaceId}` | workspace.manage | workspace.updated | Non-admin, cross-workspace actor | PERMISSION_DENIED, WORKSPACE_ACCESS_DENIED, IMMUTABLE_FIELD_UPDATE | QA-TI, QA-RBAC | Complete as contract |
| Members | List members | `GET /workspaces/{workspaceId}/members` | workspace.manage_members | Optional | Viewer unless granted | PERMISSION_DENIED | QA-RBAC | Complete as contract |
| Members | Invite member | `POST /members` | workspace.manage_members | member.invited | Viewer, non-member | PERMISSION_DENIED, MEMBER_ALREADY_EXISTS | QA-RBAC | Complete as contract |
| Members | Change role/status | `PATCH /members/{memberId}` | workspace.manage_members | member.role_changed | Viewer, self-escalation if not allowed | PERMISSION_DENIED, ROLE_NOT_FOUND | QA-RBAC, QA-AUD | Complete as contract |
| RBAC | List roles | `GET /roles` | rbac.read | Optional | Unauthenticated | AUTH_REQUIRED, PERMISSION_DENIED | QA-RBAC | Complete as contract |
| RBAC | List permissions | `GET /permissions` | rbac.read | Optional | Unauthenticated | AUTH_REQUIRED, PERMISSION_DENIED | QA-RBAC | Complete as contract |
| Brand | List profiles | `GET /brand-profiles` | brand.read | Optional | Cross-workspace actor | WORKSPACE_ACCESS_DENIED | QA-TI | Partial runtime maturity |
| Brand | Create profile | `POST /brand-profiles` | brand.write | brand_profile.created | Viewer, cross-workspace actor | PERMISSION_DENIED, DUPLICATE_BRAND_PROFILE | Backlog QA / repository tests | Partial runtime maturity |
| Brand | List rules | `GET /brand-profiles/{id}/rules` | brand.read | Optional | Cross-workspace profile access | BRAND_PROFILE_NOT_FOUND, TENANT_CONTEXT_MISMATCH | Backlog QA | Partial runtime maturity |
| Brand | Create rule | `POST /brand-profiles/{id}/rules` | brand.write | brand_voice_rule.created | Viewer, cross-workspace profile access | PERMISSION_DENIED, TENANT_CONTEXT_MISMATCH | Backlog QA | Partial runtime maturity |
| Templates | List prompt templates | `GET /prompt-templates` | prompt_template.read | Optional | Cross-workspace actor | WORKSPACE_ACCESS_DENIED | Backlog QA | Partial |
| Templates | Create prompt template | `POST /prompt-templates` | prompt_template.write | prompt_template.created | Viewer | DUPLICATE_TEMPLATE_VERSION, INVALID_TEMPLATE_TYPE, PERMISSION_DENIED | Backlog QA | Partial |
| Templates | List report templates | `GET /report-templates` | report_template.read | Optional | Cross-workspace actor | WORKSPACE_ACCESS_DENIED | Backlog QA | Partial |
| Templates | Create report template | `POST /report-templates` | report_template.write | report_template.created | Viewer | PERMISSION_DENIED | Backlog QA | Partial |
| Campaigns | List campaigns | `GET /campaigns` | campaign.read | Optional | Cross-workspace actor | WORKSPACE_ACCESS_DENIED | QA-TI | Complete as contract |
| Campaigns | Create campaign | `POST /campaigns` | campaign.write | campaign.created | Viewer, BillingAdmin by default | PERMISSION_DENIED, TENANT_CONTEXT_MISMATCH | QA-RBAC-001/002, QA-TI-003 | Complete as contract |
| Campaigns | Update campaign | `PATCH /campaigns/{id}` | campaign.write | campaign.updated | Viewer, BillingAdmin by default | CAMPAIGN_NOT_FOUND, PERMISSION_DENIED | QA-RBAC-002 | Complete as contract |
| Campaigns | Change state | `POST /state-transitions` | campaign.write | campaign.status_changed | Viewer | INVALID_CAMPAIGN_STATE, PERMISSION_DENIED | Backlog QA | Partial |
| Briefs | List brief versions | `GET /brief-versions` | brief.read | Optional | Cross-workspace actor | CAMPAIGN_NOT_FOUND, TENANT_ACCESS_DENIED | Backlog QA | Partial |
| Briefs | Create brief version | `POST /brief-versions` | brief.write | brief.version_created | Viewer | DUPLICATE_BRIEF_VERSION, IMMUTABLE_FIELD_UPDATE | Backlog QA | Partial |
| Cost | Read budgets | `GET /cost-budgets` | cost_budget.read | Optional | Viewer if not granted | PERMISSION_DENIED | QA-USG | Partial |
| Cost | Create budget | `POST /cost-budgets` | cost_budget.write | cost_budget.created | Creator by default | INVALID_COST_THRESHOLD, PERMISSION_DENIED | Backlog QA | Partial |
| Cost | Read guardrails | `GET /cost-guardrails` | cost_guardrail.read | Optional | Viewer if not granted | PERMISSION_DENIED | QA-USG | Partial |
| Cost | Create guardrail | `POST /cost-guardrails` | cost_guardrail.write | cost_guardrail.created | Creator by default | INVALID_COST_THRESHOLD, PERMISSION_DENIED | Backlog QA | Partial |
| Media Jobs | List/create media jobs | `GET/POST /media-jobs` | media_job.read/create | media_job.created | Viewer, no idempotency key | IDEMPOTENCY_KEY_REQUIRED, COST_GUARDRAIL_BLOCKED | QA-IDM-001/002, QA-DB-002 | Partial runtime maturity |
| Media Jobs | Update status | `PATCH /media-jobs/{id}/status` | media_job.update_status | media_job.completed or media_job.failed | Unauthorized actor | MEDIA_COST_SNAPSHOT_REQUIRED, PERMISSION_DENIED | QA-DB-002, QA-USG-002 | Partial |
| Assets | Create asset | `POST /media-jobs/{id}/assets` | media_asset.create | media_asset.created | Viewer, wrong workspace | MEDIA_JOB_NOT_FOUND, TENANT_CONTEXT_MISMATCH | QA-TI-002 | Partial |
| Assets | Create asset version | `POST /assets/{id}/versions` | media_asset.version_create | media_asset.version_created | Viewer | DUPLICATE_ASSET_VERSION, IMMUTABLE_APPROVED_VERSION | QA-DB-001 | Partial |
| Review | Create review task | `POST /asset-versions/{id}/review-tasks` | review.assign | review_task.created | Viewer, non-member assignee | ASSIGNEE_NOT_WORKSPACE_MEMBER, PERMISSION_DENIED | Backlog QA | Partial |
| Approval | Create decision | `POST /review-tasks/{id}/decisions` | approval.decide | approval_decision.created | Creator without approval permission, Publisher by default | APPROVAL_HASH_REQUIRED, APPROVAL_HASH_MISMATCH, REVIEW_TASK_VERSION_MISMATCH | QA-APP-001/002, QA-RBAC-003/004 | Complete as contract |
| Publish | Create PublishJob | `POST /approval-decisions/{id}/publish-jobs` | publish_job.create | publish_job.created | Reviewer-only user, rejected decision, missing idempotency | APPROVAL_NOT_APPROVED, APPROVAL_HASH_MISMATCH, IDEMPOTENCY_KEY_REQUIRED | QA-APP-003/004, QA-IDM-003 | Complete as contract |
| Evidence | List evidence | `GET /publish-jobs/{id}/manual-evidence` | manual_evidence.read | Optional | Cross-workspace actor | PUBLISH_JOB_NOT_FOUND, PERMISSION_DENIED | QA-EVD | Complete as contract |
| Evidence | Submit evidence | `POST /manual-evidence` | manual_evidence.submit | manual_publish_evidence.submitted | Viewer, wrong hash | EVIDENCE_HASH_MISMATCH, PERMISSION_DENIED | QA-EVD-005 | Complete as contract |
| Evidence | Supersede evidence | `POST /manual-evidence/{id}/supersede` | manual_evidence.submit | manual_publish_evidence.superseded | Viewer | EVIDENCE_NOT_FOUND, PERMISSION_DENIED | QA-EVD-004 | Complete as contract |
| Evidence | Invalidate evidence | `POST /manual-evidence/{id}/invalidate` | manual_evidence.invalidate | manual_publish_evidence.invalidated | Publisher without invalidate permission | EVIDENCE_NOT_FOUND, PERMISSION_DENIED | Proposed QA-EVD-006 | Partial test gap |
| Tracked links | Create tracked link | `POST /tracked-links` | tracked_link.create | tracked_link.created | Viewer, duplicate code | DUPLICATE_TRACKING_CODE, INVALID_URL | Backlog QA | Partial |
| Reports | Generate snapshot | `POST /client-report-snapshots` | report.generate | client_report_snapshot.generated | Viewer if not granted | REPORT_TEMPLATE_NOT_FOUND, SNAPSHOT_IMMUTABILITY_VIOLATION | QA-RPT-001/002/003 | Complete as contract |
| Audit | Read logs | `GET /audit-logs` | audit.read | Usually no read audit unless policy requires | Viewer if not granted, cross-workspace actor | PERMISSION_DENIED, TENANT_ACCESS_DENIED | QA-AUD-001/002 | Complete as contract |
| Usage | Read usage | `GET /usage-meter` | usage.read | Optional | Unauthorized actor | PERMISSION_DENIED | QA-USG | Complete as contract |
| Usage | Record usage | `POST /usage-meter` | usage.record | usage_meter.recorded | Missing idempotency, no usable output | USAGE_OUTPUT_NOT_CONFIRMED, IDEMPOTENCY_KEY_REQUIRED | QA-USG-001/002, QA-IDM-004 | Complete as contract |
| Cost events | Read costs | `GET /cost-events` | cost.read | Optional | Unauthorized actor | PERMISSION_DENIED | QA-USG | Partial |
| Cost events | Record cost | `POST /cost-events` | cost.record | cost_event.recorded | Negative amount, unauthorized actor | INVALID_COST_AMOUNT, PERMISSION_DENIED | QA-USG-003 | Partial |
| Operations | Read safe mode | `GET /safe-mode` | operations.read | Optional | Unauthorized actor | PERMISSION_DENIED | QA-OPS | Partial |
| Operations | Change safe mode | `POST /safe-mode` | operations.safe_mode | safe_mode.activated/deactivated | Viewer | SAFE_MODE_ACTIVE, INVALID_SAFE_MODE_STATE, PERMISSION_DENIED | QA-OPS-001/002 | Partial |
| Onboarding | Read/update progress | `GET/PATCH /onboarding-progress` | onboarding.read/write | onboarding.updated if implemented | Viewer write attempt | PERMISSION_DENIED, INVALID_ONBOARDING_STATE | QA-OPS-003 | Partial |

## Non-negotiable audit rules

1. Sensitive writes must create audit events.
2. AuditLog must be append-only.
3. AuditLog must not become business state.
4. Audit reads must be workspace-scoped and permissioned.
5. Audit payloads should avoid unnecessary sensitive data.
6. Correlation ID must connect ErrorModel, request logs, and audit/security logs where applicable.

## Non-negotiable denial rules

| Denial case | Required behavior |
|---|---|
| Missing auth | `AUTH_REQUIRED` ErrorModel |
| No workspace membership | `WORKSPACE_ACCESS_DENIED` or equivalent safe 403/404 policy |
| Missing permission | `PERMISSION_DENIED` ErrorModel |
| Workspace body mismatch | Reject or ignore body workspace_id; never create in body workspace |
| Approval hash mismatch | Reject; no ApprovalDecision/PublishJob side effect |
| Evidence hash mismatch | Reject; no evidence side effect |
| Missing Idempotency-Key | Reject idempotent write |
| Duplicate key with different payload | `IDEMPOTENCY_CONFLICT` |
| Usage without usable output | `USAGE_OUTPUT_NOT_CONFIRMED` |
| Manual evidence PATCH/DELETE | 404/405; no mutation |

## Required before next endpoint implementation

1. Confirm the endpoint exists in OpenAPI.
2. Confirm `x-permission` exists for writes and protected reads.
3. Confirm the permission exists in seed/mapping.
4. Confirm the audit event exists for sensitive writes.
5. Confirm ErrorModel coverage.
6. Confirm tenant isolation behavior.
7. Confirm QA test ID or add a QA patch.
8. Confirm no role can bypass immutable evidence, approved content hash, or report snapshot rules.

## Final decision

This matrix is adequate to support implementation planning. It is not adequate to authorize implementation by itself. Every implementation PR must include its own permission/audit/QA evidence subset.
