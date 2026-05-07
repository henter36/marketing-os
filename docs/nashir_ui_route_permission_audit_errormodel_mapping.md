# Nashir UI / Route / Permission / Audit / ErrorModel Mapping Document

| Field | Value |
|---|---|
| Document type | Documentation-only mapping contract |
| Status | Draft — Pending Review |
| Scope | Nashir Core V1 only |
| Change type | Documentation-only |
| Implementation status | Not implementation-ready |
| Relationship | Follows `docs/nashir_implementation_readiness_gap_review.md` |

## 1. Purpose

This document is a documentation-only contract bridge for Nashir Core V1 before any implementation gate.

It maps UI behavior, route/component planning candidates, permission expectations, audit event candidates, ErrorModel behavior, idempotency expectations, tenant isolation, AI boundaries, manual publishing behavior, UTM Lite behavior, manual performance behavior, and NO-GO negative behavior.

It does not implement code, authorize implementation, create tests, change ERD, change OpenAPI, change SQL, change generated clients, change runtime, change packages, change workflows, or change migrations.

Existing ERD and OpenAPI remain authoritative. Option A reuse-only remains current direction. Implementation Gate remains not ready.

## 2. Governance Summary

Nashir Core V1 remains manual/export/review/approval/evidence only.

The following remain NO-GO:

- direct publishing;
- social OAuth;
- scheduling;
- paid ads;
- payment;
- analytics ingestion;
- attribution;
- external integrations;
- autonomous AI execution;
- Post-V1 module implementation.

Readiness does not equal approval.

Evidence does not authorize publishing.

Manual publishing remains external and user-operated.

Manual performance review remains user-entered only.

UTM Lite is tracked links only, not attribution.

AI remains advisory-only and cannot approve, reject, accept evidence, invalidate evidence, publish, schedule, spend, connect accounts, ingest analytics, attribute results, or change protected fields.

## 3. Source Authority Snapshot

| Authority area | Current authoritative input | Mapping impact |
|---|---|---|
| Scope | `docs/02_v1_scope.md` keeps Nashir Core V1 manual/export/review/approval/evidence only. | UI and route planning must not imply publishing, integrations, analytics, attribution, paid execution, or autonomous AI. |
| Backlog | `docs/04_backlog.md` permits Nashir planning references but not sprint-ready tasks. | This document maps planning gaps only. |
| Acceptance Criteria | `docs/nashir_acceptance_criteria.md` defines AC IDs, Future User Story IDs, Future QA IDs, reuse surfaces, and NO-GO criteria. | Traceability uses those AC and QA placeholders. |
| User Stories | `docs/nashir_user_stories.md` maps personas, story IDs, capabilities, AC IDs, QA IDs, reuse surfaces, and NO-GO guards. | All `NUS-*` IDs are included in the traceability matrix. |
| Readiness Gap Review | `docs/nashir_implementation_readiness_gap_review.md` identifies Blocker/High gaps and names this document as the next documentation-only step. | This document narrows but does not close all implementation blockers. |
| QA/Test Planning | `docs/nashir_qa_test_planning.md` defines future planning-level QA coverage. | QA IDs remain placeholders; no test files are added. |
| Threat Model | `docs/nashir_threat_model_update.md` covers tenant isolation, authorization, approval, evidence, UTM, manual performance, AI, audit, and NO-GO bypass threats. | Error, audit, tenant, and negative behavior mapping follows those threats. |
| Role/Permission Matrix | `docs/nashir_role_permission_matrix.md` defines `owner`, `admin`, `editor`, `viewer`, `reviewer`, and `evidence_reviewer` planning semantics. | Exact permission codes remain a gap before implementation. |
| ERD Option A reuse-only | ERD planning/proposal documents keep Nashir on approved entities only. | Reuse surfaces are planning references; no ERD change is made. |
| OpenAPI Option A reuse-only | OpenAPI planning/proposal documents recommend existing path/schema reuse and no actual OpenAPI patch. | Route candidates must map to existing surfaces or be marked gaps. |
| Approval State Machine | `docs/nashir_approval_state_machine_contract.md` defines human approval, approval lock, reapproval, and disallowed transitions. | Approval/reapproval UI, audit, and ErrorModel mapping follows those states. |
| Manual Publishing Evidence Contract | `docs/nashir_manual_publishing_evidence_contract.md` keeps evidence user-provided, external, append-only/supersede/invalidate, and separate from authorization. | Evidence UI and audit mapping must not imply publishing execution. |
| Campaign Readiness Scoring Contract | `docs/nashir_campaign_readiness_scoring_contract.md` keeps readiness advisory, explainable, and separate from approval/publishing. | Readiness UI must be visibly advisory and never authorization. |

## 4. Mapping Scope

This document maps:

- UI behavior;
- route/component boundaries;
- permission codes and enforcement expectations;
- audit event names;
- ErrorModel behavior;
- idempotency expectations;
- material-change reapproval triggers;
- tenant isolation verification steps;
- AI advisory boundaries;
- manual publishing checklist behavior;
- manual publishing evidence behavior;
- UTM Lite behavior;
- manual performance review behavior;
- NO-GO negative behavior;
- read-only first-slice boundaries.

## 5. UI Behavior Mapping

All UI areas below are planning candidates only. They do not approve frontend routes, components, API calls, tests, or runtime behavior.

| UI Area | User Story IDs | Acceptance Criteria IDs | Expected visible state | Allowed user actions | Forbidden user actions | Role visibility | Error/empty/loading state | Audit relevance | Implementation readiness status |
|---|---|---|---|---|---|---|---|---|---|
| Readiness Dashboard | `NUS-READINESS-001` | `AC-READINESS-001` through `AC-READINESS-004` | Advisory readiness, warnings, blockers, approval status, checklist status, evidence status, and "not approval" wording. | View readiness and blockers; navigate to missing manual inputs where allowed. | Treat readiness as approval, publishing authorization, spend authorization, analytics proof, or AI authority. | owner, admin, editor, reviewer, viewer. | Empty state shows no campaign/readiness data; loading state must not show approved/publishable labels; errors use ErrorModel wording. | View audit only if sensitive readiness recalculation or persisted explanation is approved later. | Needs clarification. |
| Smart Wizard manual intake | `NUS-WIZARD-001` | `AC-WIZARD-001`, `AC-WIZARD-002` | Manual, user-confirmed intake steps with source/provenance labels. | Enter, review, and confirm user-provided campaign inputs. | Autonomous Agent Mode runtime, external integrations, unconfirmed AI-to-fact conversion. | editor; owner/admin if future policy allows. | Missing input prompts; save errors use ErrorModel; loading cannot imply AI execution. | Saved intake is audit-relevant if persisted. | Needs clarification. |
| Product / Store / Service / Offer intake | `NUS-OBJECT-001` | `AC-OBJECT-001`, `AC-OBJECT-002` | User-provided advertised-object fields with no first-class entity claim. | Capture product, store, service, or offer details from user input, uploaded files, or explicitly allowed public links. | External data ingestion, scraping, first-class object entities, automated profile creation. | editor; reviewer read visibility if submitted for review. | Empty object state prompts manual entry; invalid public-link state blocks until correction. | Saved object context is audit-relevant if persisted. | Needs clarification. |
| Campaign basics and advertised object flow | `NUS-CAMPAIGN-001` | `AC-CAMPAIGN-001`, `AC-CAMPAIGN-002` | Campaign basics, objective, audience, channel, object context, and draft planning status. | Create or edit planning candidate campaign/brief content where future implementation permits. | New lifecycle tables, endpoints, generated clients, SQL, or runtime behavior from this document. | editor; reviewer read/review visibility; owner/admin oversight if future policy allows. | Missing required campaign fields fail or warn according to future policy. | Campaign save/edit is audit-relevant if persisted. | Needs clarification. |
| Landing destination | `NUS-DESTINATION-001` | `AC-DESTINATION-001`, `AC-DESTINATION-002` | Destination URL/context, UTM relation, and material-change warning. | Enter and review destination; flag material changes. | Treat destination/UTM as attribution or bypass reapproval after material change. | editor, reviewer. | Invalid or missing destination shows correction state; material change shows reapproval requirement. | Destination changes after approval are audit-relevant. | Needs clarification. |
| Creative rights confirmation | `NUS-RIGHTS-001` | `AC-RIGHTS-001`, `AC-RIGHTS-002` | Rights status, manual confirmation, and blocked-until-review state for missing/unclear rights. | Confirm rights manually where authorized; request review. | Automated rights clearance, AI rights confirmation, approval shortcut. | editor, reviewer. | Missing rights blocks until review; error state preserves ErrorModel. | Rights confirmation and review block are audit-relevant. | Needs clarification. |
| Idea intake and content requirements | `NUS-CONTENT-001` | `AC-CONTENT-001`, `AC-CONTENT-002` | Draft/advisory ideas, requirements, AI provenance labels, and protected-field locks. | Enter ideas, review AI suggestions, submit draft content for review where allowed. | AI changing protected fields, bypassing review, approval, or reapproval. | editor, reviewer, AI assistant advisory-only. | Empty requirements state prompts manual detail; AI unavailable state must not block manual intake. | Saved draft/provenance is audit-relevant if persisted. | Needs clarification. |
| Hashtags per selected channel | `NUS-HASHTAGS-001` | `AC-HASHTAGS-001` | Channel-specific hashtag drafts with no reach, trend, optimization, or attribution claim. | Add/edit draft hashtags for review. | Trend ingestion, reach guarantees, analytics optimization, attribution. | editor, reviewer, AI assistant advisory-only. | Empty state allows no hashtags; invalid state warns if hashtag conflicts with channel policy. | Audit only if persisted or materially changed after approval. | Needs clarification. |
| Video reference scripts | `NUS-VIDEO-001` | `AC-VIDEO-001` | Reference scripts only, not final video production. | Draft, review, and revise script references. | Final video generation, video editing, asset procurement, automated rights clearance. | editor, reviewer, AI assistant advisory-only. | Empty state shows no script; error state blocks claims of generated final video. | Audit if submitted for review or materially changed. | Needs clarification. |
| UTM Tracking Lite | `NUS-UTM-001` | `AC-UTM-001`, `AC-UTM-002` | Structured tracked-link fields and no-attribution labels. | Create/review tracked link planning surfaces if future implementation permits. | Analytics ingestion, attribution, optimization, platform reporting. | editor, reviewer. | Missing UTM warns/fails by future policy; mismatch requires correction/invalidation planning. | Tracked-link creation and mismatch resolution are audit-relevant. | Needs clarification. |
| Human approval | `NUS-APPROVAL-001` | `AC-APPROVAL-001`, `AC-APPROVAL-002` | Human review state, approve/reject/request changes controls, and version-bound warning. | Authorized human reviewer approves, rejects, or requests changes. | AI approval/rejection, readiness-as-approval, viewer/editor approval without explicit authority. | reviewer; owner/admin only if explicitly approval-authorized later. | Unauthorized action returns ErrorModel; no reviewable version blocks action. | Approval decisions are audit-required. | Needs clarification. |
| Approval lock / reapproval | `NUS-REAPPROVAL-001` | `AC-REAPPROVAL-001`, `AC-REAPPROVAL-002` | Approved content lock, material-change warning, `requires_reapproval` state. | Edit drafts; trigger reapproval when material approved content changes. | Silent approved-content mutation, direct `draft`/`generated` to `approved`. | reviewer, editor. | Material change shows reapproval required; invalid transition returns ErrorModel. | Reapproval triggers are audit-required. | Needs clarification. |
| Manual publishing checklist | `NUS-CHECKLIST-001` | `AC-CHECKLIST-001` | Checklist support for external manual publishing with no publish button or connector. | Prepare/check off manual steps if future UI-only or persisted behavior is approved. | Publish, schedule, spend, connect accounts, treat checklist as execution. | editor, reviewer. | Missing checklist shows planning gap; persisted state unavailable because OpenAPI path for `SetupChecklistItem` reuse is missing. | Checklist completion is audit-relevant if persisted. | Needs clarification; OpenAPI not clear. |
| Manual publishing evidence | `NUS-EVIDENCE-001` | `AC-EVIDENCE-001` through `AC-EVIDENCE-004` | Evidence submission/review status, correction, supersede, invalidation, and no-authorization labels. | Submit evidence; authorized evidence reviewer accepts, requests correction, supersedes, or invalidates. | Evidence authorizing publishing; AI accepting/invalidating evidence; silent evidence overwrite. | editor, evidence_reviewer. | Missing evidence shows not submitted; invalid evidence returns correction/invalidation state. | Evidence actions are audit-required. | Needs clarification. |
| Manual performance review | `NUS-PERFORMANCE-001` | `AC-PERFORMANCE-001`, `AC-PERFORMANCE-002` | User-entered observations and no-ingestion/no-attribution labels. | Enter manual observations where authorized; view frozen snapshots. | Import platform analytics, claim attribution, initiate optimization, paid execution, or retargeting. | editor, admin, owner. | Empty state shows no manual observations; invalid imported data is blocked. | Manual review entry is audit-relevant if persisted. | Needs clarification. |
| Role & permission boundaries | `NUS-PERMISSIONS-001` | `AC-PERMISSIONS-001` through `AC-PERMISSIONS-003` | Role/action visibility, disabled protected actions, and denial labels. | View allowed controls; perform only authorized actions. | Viewer mutation; editor approval without authority; AI protected action. | owner, admin, reviewer, evidence_reviewer, editor, viewer, AI assistant advisory-only. | Denials use ErrorModel and do not expose cross-workspace data. | Permission denial and protected actions are audit-relevant. | Blocked until permission codes are approved. |
| Tenant isolation and workspace authority | `NUS-TENANT-001` | `AC-TENANT-001`, `AC-TENANT-002` | Workspace-bound context and no body-workspace trust. | Access records only within route/context workspace. | Cross-workspace access or body `workspace_id` override. | all human actors. | Cross-workspace attempts return ErrorModel without data leak. | Tenant isolation denial is audit-relevant. | Blocked until verification steps are approved. |
| ErrorModel and idempotency expectations | `NUS-ERRORS-001` | `AC-ERRORS-001`, `AC-ERRORS-002` | Consistent error, retry, and idempotency feedback. | Retry declared idempotent operations according to existing OpenAPI behavior. | Duplicate side effects, inconsistent retries, custom error shapes. | all human actors. | ErrorModel category and user-facing message intent must be consistent. | Idempotency conflict and forbidden action are audit-relevant. | Blocked until operation matrix is approved. |
| NO-GO negative boundaries | `NUS-NOGO-001` | `AC-NOGO-001`, `AC-NOGO-002` | Clear blocked labels for forbidden scope. | None beyond viewing denial/explanation. | Direct publishing, OAuth, scheduling, paid ads, payment, analytics ingestion, attribution, integrations, autonomous AI, Post-V1 implementation. | all human actors, AI assistant advisory-only. | Blocked state returns ErrorModel where invoked. | NO-GO attempt is audit-relevant. | Blocked until negative behavior matrix is approved. |

## 6. Route / Component Mapping

All route and component names are planning candidates only. They are not approved runtime routes, frontend components, or API calls.

| Proposed route or UI surface | Related component boundary | User Story IDs | Acceptance Criteria IDs | Role access | Required backend surface, if any | Existing OpenAPI reuse surface | Existing ERD reuse surface | Missing detail | Implementation readiness status |
|---|---|---|---|---|---|---|---|---|---|
| `/workspaces/:workspaceId/nashir/readiness` | Readiness summary, blockers, approval/evidence rollups | `NUS-READINESS-001` | `AC-READINESS-001` through `AC-READINESS-004` | owner, admin, editor, reviewer, viewer | Read-only derived state if approved | Onboarding, campaign, brief-version, approval, evidence, audit read surfaces | `OnboardingProgress`, `SetupChecklistItem`, `Campaign`, `BriefVersion`, `ApprovalDecision`, `ManualPublishEvidence`, `AuditLog` | Exact derivation and labels. | Needs clarification. |
| `/workspaces/:workspaceId/nashir/intake/wizard` | Manual wizard steps and confirmation | `NUS-WIZARD-001` | `AC-WIZARD-001`, `AC-WIZARD-002` | editor | Campaign/brief save if approved | Campaign and brief-version paths | `Campaign`, `BriefVersion`, `AuditLog` | Exact steps and save boundaries. | Needs clarification. |
| `/workspaces/:workspaceId/nashir/intake/object` | Product/store/service/offer intake | `NUS-OBJECT-001` | `AC-OBJECT-001`, `AC-OBJECT-002` | editor | Campaign/brief content if approved | Campaign and brief-version paths | `Campaign`, `BriefVersion` | Exact fields and public-link handling. | Needs clarification. |
| `/workspaces/:workspaceId/nashir/campaigns/:campaignId/basics` | Campaign basics editor | `NUS-CAMPAIGN-001` | `AC-CAMPAIGN-001`, `AC-CAMPAIGN-002` | editor | Campaign and brief-version reuse if approved | Campaign, campaign state transition, and brief-version paths | `Campaign`, `CampaignStateTransition`, `BriefVersion` | Exact field mapping. | Needs clarification. |
| `/workspaces/:workspaceId/nashir/campaigns/:campaignId/destination` | Landing destination and UTM relation panel | `NUS-DESTINATION-001` | `AC-DESTINATION-001`, `AC-DESTINATION-002` | editor, reviewer | Brief-version/tracked-link reuse if approved | Brief-version, tracked-link, asset-version, approval decision paths | `BriefVersion`, `TrackedLink`, `PublishJob`, `MediaAssetVersion`, `ApprovalDecision`, `AuditLog` | Validation and reapproval trigger mapping. | Needs clarification. |
| `/workspaces/:workspaceId/nashir/campaigns/:campaignId/rights` | Rights confirmation panel | `NUS-RIGHTS-001` | `AC-RIGHTS-001`, `AC-RIGHTS-002` | editor, reviewer | Review/approval/evidence/audit reuse if approved | Asset-version, review-task, approval-decision, manual evidence, audit surfaces | `MediaAssetVersion`, `ReviewTask`, `ApprovalDecision`, `ManualPublishEvidence`, `AuditLog` | Rights field and block semantics. | Needs clarification. |
| `/workspaces/:workspaceId/nashir/campaigns/:campaignId/content` | Ideas, requirements, drafts, hashtags, scripts | `NUS-CONTENT-001`, `NUS-HASHTAGS-001`, `NUS-VIDEO-001` | `AC-CONTENT-001`, `AC-CONTENT-002`, `AC-HASHTAGS-001`, `AC-VIDEO-001` | editor, reviewer; AI assistant advisory-only | Brief/media version reuse if approved | Brief-version, asset-version, approval, audit surfaces | `BriefVersion`, `MediaAssetVersion`, `ApprovalDecision`, `AuditLog` | Output taxonomy and AI provenance labels. | Needs clarification. |
| `/workspaces/:workspaceId/nashir/campaigns/:campaignId/utm` | UTM Lite tracked-link panel | `NUS-UTM-001` | `AC-UTM-001`, `AC-UTM-002` | editor, reviewer | Tracked-link reuse if approved | Tracked-link and manual evidence paths | `TrackedLink`, `PublishJob`, `ManualPublishEvidence`, `AuditLog` | Exact UTM field mapping and mismatch flow. | Needs clarification. |
| `/workspaces/:workspaceId/nashir/campaigns/:campaignId/review` | Review queue and human approval controls | `NUS-APPROVAL-001`, `NUS-REAPPROVAL-001` | `AC-APPROVAL-001`, `AC-APPROVAL-002`, `AC-REAPPROVAL-001`, `AC-REAPPROVAL-002` | reviewer; owner/admin if explicitly approval-authorized later | Review task / approval decision reuse if approved | Review-task and approval-decision paths | `ReviewTask`, `ApprovalDecision`, `MediaAssetVersion`, `AuditLog` | Exact permission codes, state actions, audit payloads. | Needs clarification. |
| `/workspaces/:workspaceId/nashir/campaigns/:campaignId/manual-checklist` | Manual publishing checklist | `NUS-CHECKLIST-001` | `AC-CHECKLIST-001` | editor, reviewer | None if UI-only; gap if persisted | Publish-job and manual-evidence paths; no clear `SetupChecklistItem` OpenAPI path | `PublishJob`, `SetupChecklistItem`, `ApprovalDecision`, `ManualPublishEvidence`, `AuditLog` | UI-only vs persisted decision; OpenAPI path for `SetupChecklistItem` reuse is missing. | Needs clarification. |
| `/workspaces/:workspaceId/nashir/campaigns/:campaignId/evidence` | Evidence submit/review workflow | `NUS-EVIDENCE-001` | `AC-EVIDENCE-001` through `AC-EVIDENCE-004` | editor, evidence_reviewer | Manual evidence reuse if approved | Manual evidence, publish-job, tracked-link paths | `ManualPublishEvidence`, `PublishJob`, `MediaAssetVersion`, `ApprovalDecision`, `TrackedLink`, `AuditLog` | Attachment handling and status mapping. | Needs clarification. |
| `/workspaces/:workspaceId/nashir/campaigns/:campaignId/manual-performance` | User-entered manual performance review | `NUS-PERFORMANCE-001` | `AC-PERFORMANCE-001`, `AC-PERFORMANCE-002` | editor, admin, owner | Client report snapshot reuse if approved | Client report snapshot paths | `ClientReportSnapshot`, `ManualPublishEvidence` | Exact metrics and snapshot semantics. | Needs clarification. |
| `/workspaces/:workspaceId/nashir/permissions` | Role/action visibility matrix | `NUS-PERMISSIONS-001` | `AC-PERMISSIONS-001` through `AC-PERMISSIONS-003` | owner, admin; read if policy allows | RBAC reuse if approved | Workspace member, role, permission, audit surfaces | `WorkspaceMember`, `Role`, `Permission`, `RolePermission`, `AuditLog` | Exact permission codes. | Blocked. |
| All workspace-scoped Nashir surfaces | Route-derived workspace guardrail | `NUS-TENANT-001`, `NUS-ERRORS-001`, `NUS-NOGO-001` | `AC-TENANT-001`, `AC-TENANT-002`, `AC-ERRORS-001`, `AC-ERRORS-002`, `AC-NOGO-001`, `AC-NOGO-002` | all human actors | Existing workspace-scoped guard behavior | `/workspaces/{workspaceId}/...`, ErrorModel, ErrorResponse, Idempotency-Key where declared | All workspace-scoped entities, `AuditLog`, `MediaJob`, `PublishJob`, `UsageMeter` | Exact verification cases and error mapping. | Blocked. |

## 7. Permission Code Mapping

Exact permission codes do not exist for Nashir Core V1. Every row below has a permission code gap that must be resolved before any implementation gate.

| Capability | User Story IDs | Actor / role | Existing role/permission source | Permission expectation | Allowed action | Forbidden action | Protected action risk | Gap / decision needed |
|---|---|---|---|---|---|---|---|---|
| View readiness | `NUS-READINESS-001` | `owner`, `admin`, `editor`, `reviewer`, `viewer` | Role Matrix view permission | Read-only advisory access. | View readiness and blockers. | Approve, publish, spend, or attribute from readiness. | Readiness-as-approval. | Permission code gap - must be resolved before implementation gate. |
| Complete manual intake | `NUS-WIZARD-001`, `NUS-OBJECT-001`, `NUS-CAMPAIGN-001` | `editor`, `admin`, `owner` candidates | Draft/edit permissions | Draft and edit user-confirmed intake where policy allows. | Save draft intake/campaign context. | External ingestion, autonomous AI, first-class entity creation. | Untrusted data becoming confirmed fact. | Permission code gap - must be resolved before implementation gate. |
| Edit destination / rights / content | `NUS-DESTINATION-001`, `NUS-RIGHTS-001`, `NUS-CONTENT-001`, `NUS-HASHTAGS-001`, `NUS-VIDEO-001`, `NUS-UTM-001` | `editor`; `reviewer` for review actions | Edit and submit-for-review permissions | Edit drafts, flag review issues, submit for review. | Edit draft/reference fields and submit for review. | Approve without authority or bypass reapproval. | Protected field mutation and approval bypass. | Permission code gap - must be resolved before implementation gate. |
| Approve/reject content | `NUS-APPROVAL-001` | `reviewer`; `owner`/`admin` only if approval-authorized | Approve/reject permission | Human-only explicit approval authority. | Approve, reject, request changes. | AI approval, viewer approval, editor approval without authority. | Unauthorized approval. | Permission code gap - must be resolved before implementation gate. |
| Trigger reapproval | `NUS-REAPPROVAL-001` | `editor`, `reviewer`, `owner`, `admin` candidates | Edit permission plus approval contract | Material changes must move approved content toward reapproval. | Mark/trigger `requires_reapproval` when material change occurs. | Silent approved-content mutation. | Approval lock bypass. | Permission code gap and material-change policy needed. |
| Prepare manual checklist | `NUS-CHECKLIST-001` | `editor`, `reviewer` | Prepare manual publishing checklist capability | Checklist support only. | Complete checklist items if future behavior approved. | Publish, schedule, spend, connect accounts. | Checklist mistaken for execution. | Permission code gap and UI-only vs persisted decision needed. |
| Submit evidence | `NUS-EVIDENCE-001` | `editor`, `owner`, `admin` candidates | Evidence submit permission | Submit user-provided proof. | Submit URL/screenshot/reference where approved. | Accept or invalidate without evidence authority. | False evidence and tampering. | Permission code gap - must be resolved before implementation gate. |
| Review evidence | `NUS-EVIDENCE-001` | `evidence_reviewer`; `owner`/`admin` if evidence-authorized | Evidence accept/invalidate permission | Human-only evidence review authority. | Accept, request correction, supersede, invalidate. | AI evidence action; viewer/editor unauthorized evidence acceptance. | Evidence tampering and authorization confusion. | Permission code gap - must be resolved before implementation gate. |
| Enter manual performance | `NUS-PERFORMANCE-001` | `editor`, `admin`, `owner` | Performance review permission | User-entered observations only. | Enter manual notes/metrics. | Import analytics, attribute results, optimize spend. | Analytics/attribution creep. | Permission code gap and exact metrics needed. |
| Protected-action enforcement | `NUS-PERMISSIONS-001`, `NUS-TENANT-001`, `NUS-ERRORS-001`, `NUS-NOGO-001` | all roles; AI assistant denied | AuthGuard, WorkspaceContextGuard, MembershipCheck, PermissionGuard, ErrorModel | Explicit workspace-scoped permission and denial behavior. | Authorized actions only. | Viewer mutation, editor self-approval, AI protected actions, cross-workspace access, NO-GO actions. | Privilege escalation and tenant leak. | Permission code gap - must be resolved before implementation gate. |

## 8. Audit Event Mapping

Audit event names are proposed planning identifiers only. This document does not implement audit logging and does not modify `AuditLog` schema.

| Event area | Triggering human action | Non-triggering AI action | Proposed audit event name | Required payload fields | Related User Story IDs | Related Acceptance Criteria IDs | Tenant/workspace binding requirement | Gap / decision needed |
|---|---|---|---|---|---|---|---|---|
| readiness score viewed or recalculated | User views or future approved recalculation occurs. | AI may suggest missing fields but cannot recalculate authoritative state. | `nashir.readiness.viewed` / `nashir.readiness.recalculated` | workspace_id from route, actor_id, campaign_id, readiness_level, gate_state, source, timestamp. | `NUS-READINESS-001` | `AC-READINESS-001` through `AC-READINESS-004` | Route/context workspace only. | Decide whether viewing requires audit. |
| campaign intake saved | User saves confirmed intake/campaign context. | AI suggestions do not save confirmed facts. | `nashir.intake.saved` | workspace_id, actor_id, campaign_id, brief_version_id, changed_fields, source_provenance. | `NUS-WIZARD-001`, `NUS-OBJECT-001`, `NUS-CAMPAIGN-001` | `AC-WIZARD-001`, `AC-OBJECT-001`, `AC-CAMPAIGN-001` | Route/context workspace only. | Exact payload fields needed. |
| creative rights confirmed | Authorized human confirms rights or flags rights issue. | AI must not confirm rights. | `nashir.rights.confirmed` | workspace_id, actor_id, asset_version_id, campaign_id, rights_status, reason, timestamp. | `NUS-RIGHTS-001` | `AC-RIGHTS-001`, `AC-RIGHTS-002` | Route/context workspace only. | Rights status vocabulary needed. |
| approval submitted | User submits generated content for human review. | AI cannot submit as authority. | `nashir.approval.submitted` | workspace_id, actor_id, review_task_id, media_asset_version_id, content_hash. | `NUS-APPROVAL-001` | `AC-APPROVAL-001`, `AC-APPROVAL-002` | Route/context workspace only. | Exact review submission action name needed. |
| approval accepted/rejected | Authorized reviewer approves or rejects reviewed version. | AI cannot approve or reject. | `nashir.approval.accepted` / `nashir.approval.rejected` | workspace_id, actor_id, approval_decision_id, review_task_id, media_asset_version_id, content_hash, decision_reason. | `NUS-APPROVAL-001` | `AC-APPROVAL-001`, `AC-APPROVAL-002` | Route/context workspace only. | Final event names and decision payload needed. |
| approval invalidated by material change | Human edit or future approved detector marks approved content changed. | AI cannot invalidate approval or bypass lock. | `nashir.approval.invalidated_by_material_change` | workspace_id, actor_id, prior_approval_decision_id, prior_hash, new_hash, changed_fields, reason. | `NUS-REAPPROVAL-001` | `AC-REAPPROVAL-001`, `AC-REAPPROVAL-002` | Route/context workspace only. | Material-change field list needed. |
| manual publishing checklist completed | User completes checklist items. | AI may suggest checklist guidance only. | `nashir.manual_publish.checklist.completed` | workspace_id, actor_id, campaign_id, publish_job_id if any, checklist_items, completion_state. | `NUS-CHECKLIST-001` | `AC-CHECKLIST-001` | Route/context workspace only. | UI-only vs persisted checklist decision needed. |
| manual publishing evidence submitted | User submits evidence. | AI cannot create false evidence. | `nashir.manual_publish.evidence.submitted` | workspace_id, actor_id, manual_publish_evidence_id, publish_job_id, approved_version_id, url_or_ref, content_hash. | `NUS-EVIDENCE-001` | `AC-EVIDENCE-001` through `AC-EVIDENCE-004` | Route/context workspace only. | Attachment/reference payload needed. |
| manual publishing evidence reviewed | Authorized evidence reviewer accepts, requests correction, supersedes, or invalidates. | AI cannot accept, correct, supersede, or invalidate. | `nashir.manual_publish.evidence.reviewed` | workspace_id, actor_id, manual_publish_evidence_id, prior_status, new_status, reason. | `NUS-EVIDENCE-001` | `AC-EVIDENCE-001` through `AC-EVIDENCE-004` | Route/context workspace only. | Exact status values needed. |
| UTM Lite tracked link created | User creates or associates tracked link. | AI cannot attribute results. | `nashir.utm.tracked_link.created` | workspace_id, actor_id, tracked_link_id, publish_job_id, campaign_id, original_url, tracked_url, utm_fields. | `NUS-UTM-001` | `AC-UTM-001`, `AC-UTM-002` | Route/context workspace only. | Exact UTM fields needed. |
| manual performance review entered | User enters manual observations. | AI may summarize user-entered notes only where later approved. | `nashir.manual_performance.entered` | workspace_id, actor_id, report_snapshot_id, campaign_id, manual_metrics, notes, timestamp. | `NUS-PERFORMANCE-001` | `AC-PERFORMANCE-001`, `AC-PERFORMANCE-002` | Route/context workspace only. | Exact metrics and snapshot rules needed. |
| permission denial | User attempts unauthorized protected action. | AI cannot be authority. | `nashir.permission.denied` | workspace_id, actor_id, role, attempted_action, required_permission, entity_type, entity_id. | `NUS-PERMISSIONS-001` | `AC-PERMISSIONS-001` through `AC-PERMISSIONS-003` | Route/context workspace only. | Exact permission codes needed. |
| tenant isolation denial | User attempts cross-workspace access or body workspace override. | AI cannot override workspace. | `nashir.tenant.denied` | route_workspace_id, actor_id, attempted_workspace_id, entity_type, entity_id, denial_reason. | `NUS-TENANT-001` | `AC-TENANT-001`, `AC-TENANT-002` | Route/context workspace wins; body `workspace_id` not trusted. | Exact denial payload needed. |
| NO-GO action blocked | User attempts forbidden scope. | AI cannot execute NO-GO action. | `nashir.nogo.blocked` | workspace_id, actor_id, attempted_action, no_go_category, entity_context, reason. | `NUS-NOGO-001` | `AC-NOGO-001`, `AC-NOGO-002` | Route/context workspace where applicable. | Decide audit coverage for every NO-GO category. |
| AI advisory output generated | Human requests advisory draft/suggestion where later approved. | AI output itself has no authority. | `nashir.ai.advisory_output.generated` | workspace_id, actor_id, campaign_id, advisory_area, prompt_ref, output_ref, protected_fields_locked. | `NUS-CONTENT-001`, `NUS-HASHTAGS-001`, `NUS-VIDEO-001`, `NUS-PERMISSIONS-001`, `NUS-NOGO-001` | `AC-CONTENT-002`, `AC-NOGO-002` | Route/context workspace only. | AI logging/privacy contract still needed before AI implementation. |

## 9. ErrorModel / Idempotency Mapping

Error categories are planning expectations only. Future implementation must preserve the approved ErrorModel and existing OpenAPI-declared idempotency behavior.

| Operation or UI action | Expected ErrorModel category | Expected error condition | User-facing message intent | Retry behavior | Idempotency expectation | Existing OpenAPI reuse surface | Gap / decision needed |
|---|---|---|---|---|---|---|---|
| permission denied | authorization / forbidden | Actor lacks required permission. | You do not have permission for this action. | Retry only after permission change. | No duplicate side effects. | ErrorModel, ErrorResponse, RBAC paths. | Exact code/status needed. |
| tenant mismatch | tenant isolation / forbidden | Route workspace does not own requested record or body `workspace_id` conflicts. | Workspace mismatch or record not found. | Retry with correct route/context workspace only. | No data leak and no mutation. | Workspace-scoped paths, ErrorModel. | Exact not-found vs forbidden policy needed. |
| missing required intake field | validation | Required manual field missing. | Complete required campaign inputs before continuing. | User can correct and resubmit. | Save retry must not duplicate campaign/brief records if idempotency is declared. | Campaign and brief-version paths. | Exact required field list needed. |
| invalid landing destination | validation | URL/destination malformed, unsafe, unclear, or conflicts with approved content. | Correct destination before review or evidence. | User can correct; material changes require review. | No duplicate tracked links if idempotency is declared. | Brief-version and tracked-link paths. | Validation rules needed. |
| missing rights confirmation | blocked_until_review / validation | Rights are missing or unclear. | Rights must be confirmed or reviewed before proceeding. | Retry after human confirmation/review. | No duplicate rights state. | Asset-version, review-task, approval-decision, audit surfaces. | Rights state vocabulary needed. |
| approval blocked | invalid transition / forbidden | Draft/generated/blocked content tries to become approved without valid human review. | Human review is required before approval. | Retry only after valid review state. | Approval retry must not create duplicate decisions where idempotency is declared. | Review-task and approval-decision paths. | Exact transition errors needed. |
| reapproval required | invalid transition / conflict | Approved content was materially changed. | Material changes require reapproval. | Retry after new review cycle. | No duplicate reapproval side effects. | Asset-version and approval decision paths. | Material-change matrix needed. |
| evidence missing | validation / not found | Manual publishing evidence is absent where review requires it. | Submit evidence after external manual publishing. | Retry after evidence submission. | Evidence submission must be append-only and non-duplicating where idempotency is declared. | Manual evidence paths. | Evidence required-field rules needed. |
| evidence invalid | validation / invalid transition | Wrong URL, channel, content version, destination, or UTM link. | Evidence needs correction, supersede, or invalidation. | Retry with corrected evidence; do not overwrite prior evidence silently. | Append-only/supersede semantics preserved. | Manual evidence and tracked-link paths. | Evidence status mapping needed. |
| direct publishing attempted | forbidden / NO-GO | User or AI attempts direct publish. | Direct publishing is not available in Core V1. | Do not retry; action remains blocked. | No publish side effects. | No approved direct publishing path. | Negative behavior must be specified. |
| analytics ingestion attempted | forbidden / NO-GO | User, AI, or UI attempts platform data import. | Analytics ingestion is not available in Core V1. | Do not retry; action remains blocked. | No ingestion side effects. | No approved analytics ingestion path. | Negative behavior must be specified. |
| attribution attempted | forbidden / NO-GO | UTM/manual metrics treated as attribution. | Attribution is not available in Core V1. | Do not retry; action remains blocked. | No attribution side effects. | No approved attribution path. | Negative behavior must be specified. |
| AI protected action attempted | forbidden / NO-GO | AI attempts approve/reject/evidence/publish/schedule/spend/connect/ingest/attribute/protected-field change. | AI is advisory-only and cannot perform protected actions. | Do not retry as AI; require human authorized action where allowed. | No protected-action side effects. | Existing protected workflow paths only. | AI denial behavior and audit policy needed. |

## 10. Material-Change Reapproval Trigger Mapping

Readiness does not equal approval. Evidence does not authorize publishing. AI cannot trigger or bypass approval.

| Changed field or state | Material change? yes/no/needs decision | Reapproval required? | Existing contract source | Affected user stories | Audit requirement | Gap / decision needed |
|---|---|---|---|---|---|---|
| body text change | yes | yes | Approval State Machine Contract | `NUS-CONTENT-001`, `NUS-REAPPROVAL-001` | `nashir.approval.invalidated_by_material_change` | Exact body field mapping needed. |
| headline change | yes | yes | Approval State Machine Contract | `NUS-CONTENT-001`, `NUS-REAPPROVAL-001` | `nashir.approval.invalidated_by_material_change` | Exact headline field mapping needed. |
| CTA change | yes | yes | Approval State Machine Contract | `NUS-CAMPAIGN-001`, `NUS-REAPPROVAL-001` | `nashir.approval.invalidated_by_material_change` | Exact CTA field mapping needed. |
| Offer/CTA change | yes | yes | Approval State Machine Contract, Readiness Scoring Contract | `NUS-OBJECT-001`, `NUS-CAMPAIGN-001`, `NUS-REAPPROVAL-001` | `nashir.approval.invalidated_by_material_change` | Offer terms taxonomy needed. |
| landing destination change | yes | yes | Approval State Machine Contract | `NUS-DESTINATION-001`, `NUS-UTM-001`, `NUS-REAPPROVAL-001` | `nashir.approval.invalidated_by_material_change` | Destination normalization needed. |
| image/video/asset change | yes | yes | Approval State Machine Contract | `NUS-RIGHTS-001`, `NUS-VIDEO-001`, `NUS-REAPPROVAL-001` | `nashir.approval.invalidated_by_material_change` | Asset version/hash mapping needed. |
| hashtags change | yes | yes, unless future QA defines safe non-material criteria | Approval State Machine Contract | `NUS-HASHTAGS-001`, `NUS-REAPPROVAL-001` | `nashir.approval.invalidated_by_material_change` if approved content changed. | Channel/hash materiality policy needed. |
| channel change | yes | yes | Approval State Machine Contract | `NUS-CAMPAIGN-001`, `NUS-HASHTAGS-001`, `NUS-REAPPROVAL-001` | `nashir.approval.invalidated_by_material_change` | Channel vocabulary needed. |
| promotion terms change | yes | yes | Approval State Machine Contract, Readiness Scoring Contract | `NUS-OBJECT-001`, `NUS-CAMPAIGN-001`, `NUS-REAPPROVAL-001` | `nashir.approval.invalidated_by_material_change` | Promotion term fields needed. |
| claims/risk wording change | yes | yes | Approval State Machine Contract, Threat Model | `NUS-CONTENT-001`, `NUS-RIGHTS-001`, `NUS-REAPPROVAL-001` | `nashir.approval.invalidated_by_material_change` | Claims policy categories needed. |
| creative rights status change | yes | yes | Approval State Machine Contract | `NUS-RIGHTS-001`, `NUS-REAPPROVAL-001` | `nashir.approval.invalidated_by_material_change` | Rights state vocabulary needed. |
| UTM link change when material to destination or campaign | yes | yes | Approval State Machine Contract, UTM Lite planning | `NUS-DESTINATION-001`, `NUS-UTM-001`, `NUS-REAPPROVAL-001` | `nashir.approval.invalidated_by_material_change` | UTM materiality criteria needed. |
| formatting-only change | needs decision | needs decision | Approval State Machine Contract | `NUS-REAPPROVAL-001` | Audit if applied to approved content. | Non-material QA criteria needed. |
| typo correction with no meaning change | needs decision | needs decision | Approval State Machine Contract | `NUS-REAPPROVAL-001` | Audit if applied to approved content. | Non-material QA criteria needed. |

## 11. Tenant Isolation Verification Mapping

| Surface/action | Workspace authority source | Expected isolation behavior | Forbidden cross-workspace behavior | ErrorModel expectation | Audit requirement | Future QA placeholder | Gap / decision needed |
|---|---|---|---|---|---|---|---|
| Readiness dashboard | Route/context workspace | Derived readiness only from same-workspace records. | Display another workspace campaign/evidence/audit. | Forbidden or not found without data leak. | Audit denial if attempted. | `NQA-TENANT-001`, `NQA-TENANT-002` | Exact query checklist needed. |
| Campaign/brief intake | Route/context workspace | Save/read campaign and brief content only in route workspace. | Body `workspace_id` override or cross-workspace brief update. | ErrorModel validation/forbidden. | Audit denial and protected mutations. | `NQA-TENANT-001`, `NQA-TENANT-002` | Exact route/body conflict behavior needed. |
| Review/approval | Route/context workspace plus record ownership | Review tasks and approvals bind to workspace-scoped asset versions. | Approve another workspace asset/version. | Forbidden or not found without data leak. | Audit denial and valid approval events. | `NQA-TENANT-002` | Ownership chain verification needed. |
| Manual evidence | Route/context workspace plus publish-job ownership | Evidence binds to same-workspace publish job/content version. | Submit/review evidence for another workspace. | Forbidden or not found without data leak. | Audit denial and evidence events. | `NQA-TENANT-002` | PublishJob/evidence ownership chain needed. |
| Tracked links / UTM | Route/context workspace plus publish-job ownership | Tracked links visible only for same workspace/campaign context. | Associate another workspace tracked link with evidence. | ErrorModel validation/forbidden. | Audit mismatch/denial. | `NQA-TENANT-002`, `NQA-UTM-002` | Link ownership checks needed. |
| Manual performance review | Route/context workspace plus report snapshot ownership | User-entered observations scoped to same workspace. | View/edit another workspace report snapshot. | Forbidden or not found without data leak. | Audit denial and valid entry events. | `NQA-TENANT-002` | Snapshot ownership checks needed. |
| Permissions/audit | Route/context workspace and membership/permission guards | Permission checks are workspace-scoped. | Use role from one workspace in another workspace. | Forbidden. | Audit denial. | `NQA-PERMISSIONS-003`, `NQA-TENANT-002` | Role assignment resolution needed. |
| NO-GO attempts | Route/context workspace where applicable | Block action before any external/runtime side effect. | Use cross-workspace context to trigger forbidden action. | Forbidden / NO-GO. | Audit block where applicable. | `NQA-NOGO-001`, `NQA-NOGO-002` | Exact block points needed. |

## 12. AI Advisory Boundary Mapping

AI cannot approve, reject, accept evidence, invalidate evidence, publish, schedule, spend, connect accounts, ingest analytics, attribute results, or change protected fields.

| AI-assisted area | Allowed AI behavior | Forbidden AI behavior | Human approval requirement | Protected fields | Audit requirement | NO-GO guard |
|---|---|---|---|---|---|---|
| Smart Wizard intake | Ask scoped questions and suggest draft summaries for human confirmation if later approved. | Save confirmed facts, run autonomous Agent Mode, access external tools. | Human confirms all intake before use. | Workspace ownership, membership, permissions, legal rights, approval status, confirmed profile fields. | Advisory output audit/logging only if later approved. | Autonomous AI execution and external tools remain NO-GO. |
| Idea/content drafting | Suggest draft angles, copy, requirements, hashtags, and scripts if later approved. | Approve, reject, bypass review, change protected fields, create unsupported claims as confirmed. | Human review and approval remain mandatory. | Approval status, rights, claims clearance, protected profile fields. | Advisory output generated event candidate. | AI cannot replace human review. |
| Readiness assistance | Explain missing fields or warnings if later approved. | Treat readiness or confidence as approval. | Human approval is separate. | Approval status and protected workflow fields. | Audit only if persisted. | Readiness-as-approval blocked. |
| Review support | Summarize issues or flag risks if later approved. | Approve/reject or clear blockers. | Authorized human reviewer decides. | Approval decision, blocked_until_review, rights confirmation. | Advisory output event candidate. | AI approval/rejection blocked. |
| Evidence support | Summarize submitted evidence fields if later approved. | Accept, request correction, supersede, invalidate, fabricate evidence. | Authorized evidence reviewer decides. | Evidence status, evidence proof fields. | Advisory output event candidate. | AI evidence action blocked. |
| Manual performance summary | Summarize user-entered manual notes if later approved. | Ingest analytics, attribute results, optimize spend. | Human-entered observations remain source. | Manual metrics, report snapshot status. | Advisory output event candidate. | Analytics ingestion and attribution blocked. |

## 13. Manual Publishing Behavior Mapping

### Manual publishing checklist

| Item | Mapping |
|---|---|
| Allowed behavior | Prepare external manual publishing steps for approved content where future UI behavior is approved. |
| Forbidden behavior | Publish, schedule, spend, connect accounts, or treat checklist completion as evidence or publishing execution. |
| Existing ERD reuse surface | `PublishJob`, `SetupChecklistItem`, `ApprovalDecision`, `ManualPublishEvidence`, `AuditLog`. |
| Existing OpenAPI reuse surface | Publish-job and manual-evidence paths; OpenAPI path for `SetupChecklistItem` reuse is missing. |
| Missing path/schema risk, if any | High. UI-only vs persisted checklist behavior remains undecided and no new OpenAPI path is approved. |
| Role/permission expectation | `editor`/`reviewer` candidates may prepare checklist; exact permission code gap remains. |
| Audit event expectation | `nashir.manual_publish.checklist.completed` if persisted. |
| Readiness status | Needs clarification; not implementation-ready. |

### Manual publishing evidence

| Item | Mapping |
|---|---|
| Allowed behavior | Submit and review user-provided proof of external manual publishing tied to approved content version where accepted. |
| Forbidden behavior | Evidence authorizing publishing, direct platform publish, silent overwrite, AI evidence acceptance/invalidation. |
| Existing ERD reuse surface | `ManualPublishEvidence`, `PublishJob`, `MediaAssetVersion`, `ApprovalDecision`, `TrackedLink`, `AuditLog`. |
| Existing OpenAPI reuse surface | Manual evidence, publish-job, tracked-link paths. |
| Missing path/schema risk, if any | Attachment handling, exact statuses, and correction/supersede/invalidation mapping remain unresolved. |
| Role/permission expectation | `editor` may submit if policy allows; `evidence_reviewer` may accept/correct/supersede/invalidate if explicitly authorized. |
| Audit event expectation | `nashir.manual_publish.evidence.submitted` and `nashir.manual_publish.evidence.reviewed`. |
| Readiness status | Needs clarification; not implementation-ready. |

### UTM Lite

| Item | Mapping |
|---|---|
| Allowed behavior | Create/review structured tracked links for manual publishing support where future implementation is approved. |
| Forbidden behavior | Analytics ingestion, attribution, optimization, platform reporting, performance proof. |
| Existing ERD reuse surface | `TrackedLink`, `PublishJob`, `ManualPublishEvidence`, `AuditLog`. |
| Existing OpenAPI reuse surface | Tracked-link and manual evidence paths. |
| Missing path/schema risk, if any | Exact UTM fields, mismatch handling, and evidence relationship remain unresolved. |
| Role/permission expectation | `editor`/`reviewer` candidates; exact permission code gap remains. |
| Audit event expectation | `nashir.utm.tracked_link.created`; mismatch resolution audit if future policy approves. |
| Readiness status | Needs clarification; not implementation-ready. |

### Manual performance review

| Item | Mapping |
|---|---|
| Allowed behavior | Enter user-provided manual observations after external manual publishing where future implementation is approved. |
| Forbidden behavior | Analytics import, attribution, optimization, retargeting, paid execution, platform-verified reporting. |
| Existing ERD reuse surface | `ClientReportSnapshot`, `ManualPublishEvidence`. |
| Existing OpenAPI reuse surface | Client report snapshot and manual evidence paths. |
| Missing path/schema risk, if any | Exact manual metrics, snapshot semantics, edit/lock behavior, and no-ingestion labels remain unresolved. |
| Role/permission expectation | `editor`, `admin`, `owner` candidates; exact permission code gap remains. |
| Audit event expectation | `nashir.manual_performance.entered` if persisted. |
| Readiness status | Needs clarification; not implementation-ready. |

## 14. NO-GO Negative Behavior Mapping

| NO-GO action | How the UI should prevent or label it | Expected error or block | Audit requirement | Related threat model risk | Future QA placeholder | Status |
|---|---|---|---|---|---|---|
| direct publishing | No publish button, connector, or auto-post label. | Blocked / forbidden. | `nashir.nogo.blocked` if attempted. | NO-GO scope bypass. | `NQA-NOGO-001` | Blocked. |
| OAuth/social account connection | No connect-account UI in Core V1. | Blocked / forbidden. | `nashir.nogo.blocked` if attempted. | External integration bypass. | `NQA-NOGO-001` | Blocked. |
| scheduling | No schedule controls. | Blocked / forbidden. | `nashir.nogo.blocked` if attempted. | Publishing/scheduling creep. | `NQA-NOGO-001` | Blocked. |
| paid ads | No launch/spend/budget execution controls. | Blocked / forbidden. | `nashir.nogo.blocked` if attempted. | Paid execution bypass. | `NQA-NOGO-001` | Blocked. |
| payments | No payment, billing, invoice, refund, tax, or provider billing UI. | Blocked / forbidden. | `nashir.nogo.blocked` if attempted. | Payment scope creep. | `NQA-NOGO-001` | Blocked. |
| analytics ingestion | No import/connect/sync analytics controls. | Blocked / forbidden. | `nashir.nogo.blocked` if attempted. | Analytics ingestion creep. | `NQA-NOGO-001` | Blocked. |
| attribution | Label UTM/manual performance as non-attribution. | Blocked / forbidden if attribution is attempted. | `nashir.nogo.blocked` if attempted. | Attribution confusion. | `NQA-NOGO-001`, `NQA-UTM-001` | Blocked. |
| external integrations | No connector, API sync, external tool execution, or account link UI. | Blocked / forbidden. | `nashir.nogo.blocked` if attempted. | External integration bypass. | `NQA-NOGO-001` | Blocked. |
| autonomous AI execution | Label AI as advisory-only; no run-agent controls. | Blocked / forbidden. | `nashir.nogo.blocked` or `nashir.ai.advisory_output.generated` if applicable. | AI suggestion misuse. | `NQA-NOGO-002` | Blocked. |
| Post-V1 module implementation | Label Post-V1 modules as reference-only if mentioned. | Blocked / forbidden. | `nashir.nogo.blocked` if attempted. | Scope expansion. | `NQA-NOGO-001` | Blocked. |
| readiness-as-approval | Display readiness as advisory and separate from approval. | Error/block if readiness is used as approval. | `nashir.nogo.blocked` if attempted. | Approval bypass. | `NQA-READINESS-001` | Blocked. |
| evidence-as-authorization | Display evidence as proof only, not authorization. | Error/block if evidence triggers publishing. | `nashir.nogo.blocked` if attempted. | Evidence mistaken as authorization. | `NQA-EVIDENCE-003` | Blocked. |

## 15. Read-Only First Slice Boundary Recommendation

This recommendation does not approve implementation. A separate implementation gate is required.

| Field | Planning recommendation |
|---|---|
| Candidate slice name | Nashir Read-Only Readiness and Governance Surface Mapping Slice. |
| Allowed files, proposed only | Future implementation gate would need to name exact frontend/documentation files. No files are approved here. |
| Forbidden files | `src/`, tests, SQL, OpenAPI, generated clients, packages, workflows, migrations, runtime files, router/store files, frontend assets unless explicitly allowed by a future gate, and any implementation file not named by that gate. |
| Expected behavior | Read-only display of existing/advisory readiness, approval/evidence/checklist status labels, role-denial labels, NO-GO labels, and no-action placeholders. |
| Required verification | Future gate must define lint/test/doc checks, CI gates, screenshot/UX checks if frontend is allowed, ErrorModel expectations if any API is touched, and forbidden-file checks. |
| Rollback/no-go criteria | Stop if implementation requires new OpenAPI paths, ERD/SQL changes, generated clients, direct publishing, integrations, analytics ingestion, attribution, paid execution, autonomous AI, or protected-action behavior. |
| Unresolved blockers | Exact allowed files, route/component ownership, permission codes, QA cases, audit event approval, ErrorModel mapping, and implementation gate criteria. |

## 16. Traceability Matrix

| User Story ID | Acceptance Criteria IDs | Future QA IDs | UI surface | Route/component candidate | Permission expectation | Audit event expectation | ErrorModel expectation | ERD reuse surface | OpenAPI reuse surface | Readiness status |
|---|---|---|---|---|---|---|---|---|---|---|
| `NUS-READINESS-001` | `AC-READINESS-001` through `AC-READINESS-004` | `NQA-READINESS-001` through `NQA-READINESS-004` | Readiness Dashboard | `/workspaces/:workspaceId/nashir/readiness` | View permission; readiness grants no authority. | `nashir.readiness.viewed` / `nashir.readiness.recalculated` if persisted. | Block readiness-as-approval/publishing. | `OnboardingProgress`, `SetupChecklistItem`, `Campaign`, `BriefVersion`, `ApprovalDecision`, `ManualPublishEvidence`, `AuditLog` | Onboarding, campaign, brief-version, approval, manual evidence, audit read surfaces | Needs clarification. |
| `NUS-WIZARD-001` | `AC-WIZARD-001`, `AC-WIZARD-002` | `NQA-WIZARD-001`, `NQA-WIZARD-002` | Smart Wizard manual intake | `/workspaces/:workspaceId/nashir/intake/wizard` | Draft/edit permission; exact code gap. | `nashir.intake.saved` if persisted. | Validation errors for missing/unconfirmed fields. | `Campaign`, `BriefVersion`, `AuditLog` | Campaign and brief-version paths | Needs clarification. |
| `NUS-OBJECT-001` | `AC-OBJECT-001`, `AC-OBJECT-002` | `NQA-OBJECT-001`, `NQA-OBJECT-002` | Object intake | `/workspaces/:workspaceId/nashir/intake/object` | Draft/edit permission; exact code gap. | `nashir.intake.saved` if persisted. | Validation for invalid user-provided/public-link inputs. | `Campaign`, `BriefVersion` | Campaign and brief-version paths | Needs clarification. |
| `NUS-CAMPAIGN-001` | `AC-CAMPAIGN-001`, `AC-CAMPAIGN-002` | `NQA-CAMPAIGN-001`, `NQA-CAMPAIGN-002` | Campaign basics | `/workspaces/:workspaceId/nashir/campaigns/:campaignId/basics` | Draft/edit permission; exact code gap. | `nashir.intake.saved` if persisted. | Validation for required campaign fields. | `Campaign`, `CampaignStateTransition`, `BriefVersion` | Campaign, campaign state transition, brief-version paths | Needs clarification. |
| `NUS-DESTINATION-001` | `AC-DESTINATION-001`, `AC-DESTINATION-002` | `NQA-DESTINATION-001`, `NQA-DESTINATION-002` | Landing destination | `/workspaces/:workspaceId/nashir/campaigns/:campaignId/destination` | Edit/review permission; exact code gap. | `nashir.approval.invalidated_by_material_change` if approved content changed. | Invalid destination or reapproval required. | `BriefVersion`, `TrackedLink`, `PublishJob`, `MediaAssetVersion`, `ApprovalDecision`, `AuditLog` | Brief-version, tracked-link, asset-version, approval decision paths | Needs clarification. |
| `NUS-RIGHTS-001` | `AC-RIGHTS-001`, `AC-RIGHTS-002` | `NQA-RIGHTS-001`, `NQA-RIGHTS-002` | Creative rights | `/workspaces/:workspaceId/nashir/campaigns/:campaignId/rights` | Manual rights confirmation/review permission; exact code gap. | `nashir.rights.confirmed`. | Missing rights blocks until review. | `MediaAssetVersion`, `ReviewTask`, `ApprovalDecision`, `ManualPublishEvidence`, `AuditLog` | Asset-version, review-task, approval-decision, manual evidence, audit surfaces | Needs clarification. |
| `NUS-CONTENT-001` | `AC-CONTENT-001`, `AC-CONTENT-002` | `NQA-CONTENT-001`, `NQA-CONTENT-002` | Ideas/content requirements | `/workspaces/:workspaceId/nashir/campaigns/:campaignId/content` | Draft/edit/review permission; AI advisory-only. | `nashir.intake.saved` and `nashir.ai.advisory_output.generated` if persisted/applicable. | Protected-field/AI denial. | `BriefVersion`, `MediaAssetVersion`, `ApprovalDecision`, `AuditLog` | Brief-version, asset-version, approval, audit surfaces | Needs clarification. |
| `NUS-HASHTAGS-001` | `AC-HASHTAGS-001` | `NQA-HASHTAGS-001` | Hashtag drafts | `/workspaces/:workspaceId/nashir/campaigns/:campaignId/content` | Draft/edit/review permission; AI advisory-only. | `nashir.ai.advisory_output.generated` if applicable; `nashir.approval.invalidated_by_material_change` if approved content changed. | Block optimization/attribution claims. | `BriefVersion`, `MediaAssetVersion` | Brief-version and asset-version paths | Needs clarification. |
| `NUS-VIDEO-001` | `AC-VIDEO-001` | `NQA-VIDEO-001` | Video reference scripts | `/workspaces/:workspaceId/nashir/campaigns/:campaignId/content` | Draft/edit/review permission; AI advisory-only. | `nashir.ai.advisory_output.generated` if applicable; `nashir.approval.invalidated_by_material_change` if approved content changed. | Block final video production actions. | `BriefVersion`, `MediaAssetVersion` | Brief-version and asset-version paths | Needs clarification. |
| `NUS-UTM-001` | `AC-UTM-001`, `AC-UTM-002` | `NQA-UTM-001`, `NQA-UTM-002` | UTM Tracking Lite | `/workspaces/:workspaceId/nashir/campaigns/:campaignId/utm` | Tracked-link edit/review permission; exact code gap. | `nashir.utm.tracked_link.created`. | Block attribution/analytics; mismatch correction. | `TrackedLink`, `PublishJob`, `ManualPublishEvidence`, `AuditLog` | Tracked-link and manual evidence paths | Needs clarification. |
| `NUS-APPROVAL-001` | `AC-APPROVAL-001`, `AC-APPROVAL-002` | `NQA-APPROVAL-001`, `NQA-APPROVAL-002` | Human approval | `/workspaces/:workspaceId/nashir/campaigns/:campaignId/review` | Explicit human approval permission; exact code gap. | `nashir.approval.submitted`, `nashir.approval.accepted`, `nashir.approval.rejected`. | Unauthorized/invalid transition errors. | `ReviewTask`, `ApprovalDecision`, `MediaAssetVersion`, `AuditLog` | Review-task and approval-decision paths | Needs clarification. |
| `NUS-REAPPROVAL-001` | `AC-REAPPROVAL-001`, `AC-REAPPROVAL-002` | `NQA-REAPPROVAL-001`, `NQA-REAPPROVAL-002` | Approval lock/reapproval | `/workspaces/:workspaceId/nashir/campaigns/:campaignId/review` | Edit permission plus reapproval enforcement; exact code gap. | `nashir.approval.invalidated_by_material_change`. | Reapproval required / invalid transition. | `MediaAssetVersion`, `ApprovalDecision`, `ReviewTask`, `AuditLog` | Asset-version, review-task, approval-decision, audit paths | Needs clarification. |
| `NUS-CHECKLIST-001` | `AC-CHECKLIST-001` | `NQA-CHECKLIST-001` | Manual publishing checklist | `/workspaces/:workspaceId/nashir/campaigns/:campaignId/manual-checklist` | Prepare checklist permission; exact code gap. | `nashir.manual_publish.checklist.completed` if persisted. | Block publish/schedule/spend/connect. | `PublishJob`, `SetupChecklistItem`, `ApprovalDecision`, `ManualPublishEvidence`, `AuditLog` | Publish-job and manual-evidence paths; no clear `SetupChecklistItem` path | Needs clarification; OpenAPI not clear. |
| `NUS-EVIDENCE-001` | `AC-EVIDENCE-001` through `AC-EVIDENCE-004` | `NQA-EVIDENCE-001` through `NQA-EVIDENCE-004` | Manual publishing evidence | `/workspaces/:workspaceId/nashir/campaigns/:campaignId/evidence` | Evidence submit/review permission; exact code gap. | `nashir.manual_publish.evidence.submitted`, `nashir.manual_publish.evidence.reviewed`. | Invalid evidence, unauthorized review, no publishing authorization. | `ManualPublishEvidence`, `PublishJob`, `MediaAssetVersion`, `ApprovalDecision`, `TrackedLink`, `AuditLog` | Manual evidence, publish-job, tracked-link paths | Needs clarification. |
| `NUS-PERFORMANCE-001` | `AC-PERFORMANCE-001`, `AC-PERFORMANCE-002` | `NQA-PERFORMANCE-001`, `NQA-PERFORMANCE-002` | Manual performance review | `/workspaces/:workspaceId/nashir/campaigns/:campaignId/manual-performance` | Manual performance entry permission; exact code gap. | `nashir.manual_performance.entered`. | Block analytics import/attribution/optimization. | `ClientReportSnapshot`, `ManualPublishEvidence` | Client report snapshot and manual evidence paths | Needs clarification. |
| `NUS-PERMISSIONS-001` | `AC-PERMISSIONS-001` through `AC-PERMISSIONS-003` | `NQA-PERMISSIONS-001` through `NQA-PERMISSIONS-003` | Role & permission boundaries | `/workspaces/:workspaceId/nashir/permissions` | Exact permission codes required. | `nashir.permission.denied`. | Forbidden protected action returns ErrorModel. | `WorkspaceMember`, `Role`, `Permission`, `RolePermission`, `AuditLog` | Workspace member, role, permission, audit surfaces | Blocked. |
| `NUS-TENANT-001` | `AC-TENANT-001`, `AC-TENANT-002` | `NQA-TENANT-001`, `NQA-TENANT-002` | Tenant isolation | All workspace-scoped Nashir surfaces | Route/context workspace authority. | `nashir.tenant.denied`. | Cross-workspace access/body workspace misuse returns ErrorModel. | All workspace-scoped entities | `/workspaces/{workspaceId}/...`, `WorkspaceId` parameter | Blocked. |
| `NUS-ERRORS-001` | `AC-ERRORS-001`, `AC-ERRORS-002` | `NQA-ERRORS-001`, `NQA-ERRORS-002` | ErrorModel/idempotency | All workspace-scoped Nashir surfaces | All human actors; AI denied protected actions. | `nashir.permission.denied`, `nashir.tenant.denied`, `nashir.nogo.blocked` where applicable. | Preserve ErrorModel and declared idempotency. | `AuditLog`, workspace-scoped entities, `MediaJob`, `PublishJob`, `UsageMeter` | `ErrorModel`, `ErrorResponse`, `Idempotency-Key` where declared | Blocked. |
| `NUS-NOGO-001` | `AC-NOGO-001`, `AC-NOGO-002` | `NQA-NOGO-001`, `NQA-NOGO-002` | NO-GO boundaries | All relevant Nashir surfaces | No actor may perform NO-GO actions; AI assistant denied. | `nashir.nogo.blocked`. | Forbidden / NO-GO ErrorModel. | N/A | N/A | Blocked. |

## 17. Gap Register

### UI behavior gaps

- Exact copy, disabled states, empty/loading/error states, and no-authority wording remain unresolved.
- Readiness, approval, evidence, checklist, UTM, and manual performance labels need UX review before code.

### route/component gaps

- Route and component names in this document are planning candidates only.
- Exact component ownership, data loading, and read/write boundaries remain unresolved.

### permission code gaps

- Exact permission codes do not exist for Nashir protected actions.
- Viewer denial, editor self-approval denial, evidence reviewer authority, and AI denial need implementation-gate policy.

### audit event naming gaps

- Proposed audit event names are not approved runtime events.
- Required payload fields, before/after shape, and audit retention semantics remain unresolved.

### ErrorModel/idempotency gaps

- Exact ErrorModel category/status/body mapping remains unresolved.
- Idempotency must be preserved where existing OpenAPI declares it, but operation-specific retry outcomes remain unresolved.

### reapproval trigger gaps

- Material-change examples exist, but exact field mapping and non-material criteria require approval.

### tenant isolation gaps

- Every future query/read/write must prove route/context workspace authority and body `workspace_id` distrust.
- Exact verification cases are still future QA placeholders.

### AI advisory boundary gaps

- AI Service Layer, AI logging/privacy, prompt/output retention, and protected-field lock behavior remain unapproved.

### manual publishing checklist/evidence gaps

- Checklist UI-only vs persisted behavior remains undecided.
- OpenAPI path for `SetupChecklistItem` reuse is missing.
- Evidence attachment/status/correction semantics need exact mapping.

### UTM Lite gaps

- Exact UTM fields, validation, mismatch handling, and evidence relationship remain unresolved.

### manual performance review gaps

- Exact user-entered metrics, snapshot semantics, edit/lock behavior, and no-ingestion labels remain unresolved.

### NO-GO negative behavior gaps

- Negative behavior and audit requirements for each NO-GO category need exact future QA cases.

### implementation gate blockers

- Allowed files, forbidden files, expected changed files, verification commands, CI gates, rollback/no-go criteria, route/component boundaries, permission codes, audit event names, ErrorModel behavior, and NO-GO boundaries must be approved before code.

## 18. GO / NO-GO Decision

GO for documentation-only mapping.

NO-GO for implementation.

NO-GO for runtime, SQL, OpenAPI, generated clients, tests, packages, workflows, migrations, source changes, or Post-V1 implementation.

Implementation Gate remains not ready unless separately approved later.

## 19. Recommended Next Step

The gaps are narrower after this mapping, but implementation is still not ready.

Recommended next documentation-only step: `docs/nashir_implementation_gate_planning.md`, only if reviewers agree the remaining gaps are sufficiently bounded for a gate document.

If reviewers decide the gaps are not sufficiently bounded, resolve these first:

- exact permission code names;
- exact audit event names and payloads;
- exact ErrorModel categories/statuses;
- exact checklist UI-only vs persisted decision;
- exact material-change field mapping;
- exact future QA case definitions.
