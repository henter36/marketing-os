# Nashir User Stories

## 1. Purpose

This document is documentation-only.

This document defines planning-only Nashir Core V1 Option A reuse-only user stories that map Future User Story IDs from `docs/nashir_acceptance_criteria.md` to capabilities, roles, acceptance criteria, future QA case IDs, existing ERD reuse surfaces, existing OpenAPI reuse surfaces, and NO-GO boundaries.

This document does not approve implementation.

This document does not add or modify test files.

This document does not modify OpenAPI, generated clients, ERD, SQL, runtime, packages, workflows, or implementation.

User Story IDs are planning identifiers only.

Existing ERD and OpenAPI remain authoritative.

Option A reuse-only remains current direction.

Core V1 remains manual/export/review/approval/evidence only.

## 2. Scope

This document covers planning-only user stories for:

- Readiness Dashboard;
- Smart Wizard manual intake;
- Product / Store / Service / Offer intake;
- Campaign basics and advertised object flow;
- Landing destination;
- Creative rights confirmation;
- Idea intake and content requirements;
- Hashtags per selected channel;
- Video reference scripts;
- UTM Tracking Lite;
- human approval;
- approval lock / reapproval;
- manual publishing checklist;
- manual publishing evidence;
- manual performance review;
- role and permission boundaries;
- tenant isolation and workspace authority;
- ErrorModel and idempotency expectations;
- NO-GO negative boundaries.

The stories are not sprint-ready and are not implementation-ready by themselves. Future implementation requires a separately approved implementation readiness gate, allowed files, forbidden files, verification commands, expected CI gates, rollback/no-go criteria, and NO-GO boundaries.

## 3. Non-goals

This document does not:

- approve backlog execution;
- approve implementation planning;
- add or modify QA/test files;
- add endpoints, schemas, entities, fields, relationships, SQL migrations, generated clients, repositories, routes, stores, packages, workflows, scripts, migrations, prototype assets, frontend assets, router/store files, or implementation files;
- patch `docs/08_api_spec.md`, `docs/marketing_os_v5_6_5_phase_0_1_openapi.yaml`, `docs/06_erd.md`, SQL files, OpenAPI files, or runtime contracts;
- authorize Pilot or Production readiness;
- treat readiness as approval;
- treat evidence as publishing authorization;
- treat UTM Lite as attribution;
- treat manual performance review as analytics ingestion;
- authorize direct publishing, social OAuth, scheduling, paid ads, payment, analytics ingestion, attribution, external integrations, autonomous AI execution, or Post-V1 module implementation.

## 4. Sources inspected

- `AGENTS.md`
- `README.md`
- `docs/17_change_log.md`
- `docs/03_decision_log.md`
- `docs/02_v1_scope.md`
- `docs/04_backlog.md`
- `docs/06_erd.md`
- `docs/08_api_spec.md`
- `docs/nashir_acceptance_criteria.md`
- `docs/nashir_qa_test_planning.md`
- `docs/nashir_threat_model_update.md`
- `docs/nashir_openapi_patch_proposal.md`
- `docs/nashir_erd_patch_proposal.md`
- `docs/nashir_campaign_readiness_scoring_contract.md`
- `docs/nashir_approval_state_machine_contract.md`
- `docs/nashir_manual_publishing_evidence_contract.md`
- `docs/nashir_role_permission_matrix.md`
- `docs/marketing_os_v5_6_5_phase_0_1_erd.md`
- `docs/marketing_os_v5_6_5_phase_0_1_backlog.md`
- `docs/marketing_os_v5_6_5_phase_0_1_openapi.yaml`

## 5. Current repository authority summary

Marketing OS remains a contract-first Phase 0/1 execution repository. It is not approved for Pilot or Production.

`README.md` and `docs/17_change_log.md` identify the current baseline as verified through Sprint 4 with selected DB-backed repository slices. HTTP/runtime product routes remain limited, and broader runtime, persistence, Pilot, and Production changes remain NO-GO unless separately approved.

`docs/02_v1_scope.md` defines Nashir Core V1 as manual/export/review/approval/evidence only. It does not approve implementation by itself.

`docs/04_backlog.md` documents Nashir backlog planning boundaries only. It does not create sprint-ready implementation tasks.

`docs/06_erd.md` points to `docs/marketing_os_v5_6_5_phase_0_1_erd.md` as the approved ERD authority. The Nashir Option A reuse-only addendum maps Nashir Core V1 to existing approved entities only and adds no new entities, fields, relationships, constraints, indexes, enums, SQL changes, OpenAPI changes, QA changes, runtime changes, generated clients, tests, packages, workflows, migrations, or implementation.

`docs/08_api_spec.md` points to `docs/marketing_os_v5_6_5_phase_0_1_openapi.yaml` as the approved OpenAPI authority. Frontend and backend must not invent product endpoints outside OpenAPI. Every workspace-scoped endpoint must use route/context-derived workspace authority. `workspace_id` from request bodies must not be trusted. Error responses must follow ErrorModel. Idempotency remains required where declared by OpenAPI.

## 6. Relationship to Nashir governance documents

### Nashir Acceptance Criteria

`docs/nashir_acceptance_criteria.md` is the source for the Future User Story IDs, Acceptance Criteria IDs, Future QA Case IDs, and planning-only traceability used here. This document maps those identifiers into user story form only.

### Nashir QA/Test Planning

`docs/nashir_qa_test_planning.md` defines future QA planning categories and future QA IDs. This document references those IDs but does not create, modify, or authorize QA/test files.

### Threat Model Update

`docs/nashir_threat_model_update.md` identifies tenant isolation, workspace trust boundary, authorization, approval, evidence, UTM Lite, manual performance, AI, creative rights, claims, audit, and NO-GO bypass threats. User stories must preserve those threat boundaries.

### ERD Option A reuse-only

The approved ERD remains authoritative. Option A reuse-only maps Nashir Core V1 to existing entities only, including `Campaign`, `CampaignStateTransition`, `BriefVersion`, `MediaAsset`, `MediaAssetVersion`, `MediaJob`, `ReviewTask`, `ApprovalDecision`, `PublishJob`, `ManualPublishEvidence`, `TrackedLink`, `ClientReportSnapshot`, `Workspace`, `WorkspaceMember`, `Role`, `Permission`, `RolePermission`, `AuditLog`, `OnboardingProgress`, and limited `SetupChecklistItem` adjacency where current authority allows it.

### OpenAPI Option A reuse-only

The approved OpenAPI remains authoritative. Option A reuse-only maps Nashir Core V1 planning to existing workspace, campaign, brief-version, media asset/version, review task, approval decision, publish job, manual evidence, tracked link, client report snapshot, audit, onboarding, role, permission, ErrorModel, and idempotency surfaces only. No new path, schema, operation, generated client update, or OpenAPI patch is approved.

### Role & Permission Matrix

`docs/nashir_role_permission_matrix.md` defines planning-level actor and permission boundaries. Protected actions require explicit workspace-scoped authority and auditability. Viewers must not mutate. Editors must not approve unless explicitly granted reviewer authority. AI is advisory-only and cannot perform protected actions.

### Approval State Machine Contract

`docs/nashir_approval_state_machine_contract.md` keeps approval human, explicit, authorized, auditable, version-bound, and separate from readiness. Material changes after approval require reapproval.

### Manual Publishing Evidence Contract

`docs/nashir_manual_publishing_evidence_contract.md` keeps evidence user-provided, external to publishing execution, tied to approved content versions where accepted, and separate from analytics ingestion, attribution, or paid performance.

### Campaign Readiness Scoring Contract

`docs/nashir_campaign_readiness_scoring_contract.md` keeps readiness advisory and explainable. Readiness does not equal approval. Readiness does not authorize publishing.

## 7. User story principles

1. User Story IDs are planning identifiers only.
2. Stories are planning-only and not implementation-ready by themselves.
3. Existing ERD and OpenAPI remain authoritative.
4. Option A reuse-only remains current direction.
5. Core V1 remains manual/export/review/approval/evidence only.
6. Readiness does not equal approval.
7. Evidence does not authorize publishing.
8. Manual publishing remains external and user-operated in Core V1.
9. Manual performance review remains user-entered and is not analytics ingestion.
10. UTM Lite is not attribution.
11. AI assistant is advisory-only, not an actor with authority.
12. AI must not approve, reject, accept evidence, invalidate evidence, publish, schedule, spend, connect accounts, ingest analytics, attribute results, or change protected fields.
13. Route/context workspace authority must win over body `workspace_id`.
14. AuthGuard, WorkspaceContextGuard, MembershipCheck, PermissionGuard, and ErrorModel behavior must remain intact unless later approved contracts explicitly change them.
15. Direct publishing, social OAuth, scheduling, paid ads, payment, analytics ingestion, attribution, external integrations, autonomous AI execution, and Post-V1 module implementation remain NO-GO.

## 8. Traceability model

Future implementation planning must preserve this traceability model:

| Field | Required meaning |
|---|---|
| User Story ID | Stable planning identifier from `docs/nashir_acceptance_criteria.md`; not sprint-ready by itself. |
| Persona / actor | Human role or advisory-only AI reference associated with the story. |
| Capability | Nashir Core V1 planning capability group. |
| User story | Planning-level user value statement. |
| Acceptance Criteria IDs | IDs from `docs/nashir_acceptance_criteria.md`. |
| Future QA Case IDs | Future QA IDs from `docs/nashir_acceptance_criteria.md` and `docs/nashir_qa_test_planning.md`; no test file is created here. |
| Existing ERD reuse surface | Existing approved entity or relationship surface under Option A reuse-only. |
| Existing OpenAPI reuse surface | Existing approved path/schema surface under Option A reuse-only. |
| NO-GO guard | Boundary that must remain blocked or disallowed. |
| Status | Planning-only status; not implemented and not approved for implementation. |

No future implementation request should proceed unless each in-scope story has approved acceptance criteria, QA cases, exact UI behavior, exact route/component mapping, exact permission codes, exact error states, exact audit event names, allowed files, forbidden files, verification commands, expected CI gates, rollback/no-go criteria, and NO-GO boundaries.

## 9. Personas / actors

| Persona / actor | Planning meaning | Authority boundary |
|---|---|---|
| `owner` | Highest baseline workspace role candidate. | May be a candidate for protected actions only where future policy explicitly grants authority. |
| `admin` | Operational workspace role candidate. | May be a candidate for workspace operations and protected actions only where future policy explicitly grants authority. |
| `editor` | Campaign preparation role candidate. | May draft, edit, prepare checklist, or submit evidence where future policy permits; must not approve unless explicitly reviewer-authorized. |
| `reviewer` | Human review and approval role overlay candidate. | May approve, reject, request changes, or clear review blocks only if future policy explicitly grants authority. |
| `evidence reviewer` | Human evidence review role overlay candidate. | May accept, request correction, supersede, or invalidate evidence only if future policy explicitly grants authority. |
| `viewer` | Read-only workspace role candidate. | Must not create, edit, approve, reject, submit evidence, accept evidence, invalidate evidence, publish, schedule, or spend. |
| `AI assistant` | Advisory-only drafting, prompting, summarization, or flagging source. | Not an actor with authority. Must not approve, reject, accept evidence, invalidate evidence, publish, schedule, spend, connect accounts, ingest analytics, attribute results, or change protected fields. |

## 10. User story groups

| Group | User Story ID | Capability | Primary persona / actor | Planning summary |
|---|---|---|---|---|
| Readiness Dashboard | `NUS-READINESS-001` | Advisory readiness and warnings | owner, admin, editor, reviewer, viewer | See readiness state without treating it as approval or publishing authorization. |
| Smart Wizard manual intake | `NUS-WIZARD-001` | Manual structured intake | editor | Capture user-confirmed intake through approved reuse surfaces only. |
| Product / Store / Service / Offer intake | `NUS-OBJECT-001` | Advertised object intake | editor | Capture product, store, service, or offer details from user-provided inputs only. |
| Campaign basics and advertised object flow | `NUS-CAMPAIGN-001` | Campaign planning | editor | Prepare campaign basics and advertised-object context through campaign/brief reuse. |
| Landing destination | `NUS-DESTINATION-001` | Destination capture and review | editor, reviewer | Capture and review destination context, with material changes requiring reapproval. |
| Creative rights confirmation | `NUS-RIGHTS-001` | Rights review block | editor, reviewer | Confirm rights manually and block risk until human review where needed. |
| Idea intake and content requirements | `NUS-CONTENT-001` | Draft content planning | editor, reviewer | Capture ideas and requirements as draft/advisory inputs pending review. |
| Hashtags per selected channel | `NUS-HASHTAGS-001` | Channel hashtag drafts | editor, reviewer | Produce or manage hashtag draft recommendations without analytics or reach claims. |
| Video reference scripts | `NUS-VIDEO-001` | Reference scripts | editor, reviewer | Prepare script references only, not video production or final generation. |
| UTM Tracking Lite | `NUS-UTM-001` | Structured links | editor, reviewer | Use tracked links for structured UTM support without attribution or analytics ingestion. |
| Human approval | `NUS-APPROVAL-001` | Human review decision | reviewer | Make human, authorized, auditable, version-bound approval decisions. |
| Approval lock / reapproval | `NUS-REAPPROVAL-001` | Material-change reapproval | reviewer, editor | Require reapproval after material changes to approved content. |
| Manual publishing checklist | `NUS-CHECKLIST-001` | External publishing support | editor, reviewer | Prepare manual checklist support without direct publishing, scheduling, or spend. |
| Manual publishing evidence | `NUS-EVIDENCE-001` | User-provided proof | editor, evidence reviewer | Submit and review external manual publishing evidence without authorizing publishing. |
| Manual performance review | `NUS-PERFORMANCE-001` | User-entered review | editor, admin, owner | Record manual observations only, without analytics ingestion or attribution. |
| Role & permission boundaries | `NUS-PERMISSIONS-001` | Protected-action authority | owner, admin, reviewer, evidence reviewer, viewer | Preserve explicit permissions, viewer denial, and AI denial for protected actions. |
| Tenant isolation and workspace authority | `NUS-TENANT-001` | Workspace trust boundary | all human actors | Preserve route/context-derived workspace authority and cross-workspace denial. |
| ErrorModel and idempotency expectations | `NUS-ERRORS-001` | Failure behavior | all human actors | Preserve ErrorModel and declared idempotency behavior for future flows. |
| NO-GO negative boundaries | `NUS-NOGO-001` | Scope blocking | all human actors, AI assistant | Block direct publishing, integrations, paid/analytics/attribution, autonomous AI, and Post-V1 scope. |

## 11. Capability-to-story traceability table

| Capability | User Story ID | Persona / actor | Acceptance Criteria IDs | Future QA Case IDs | Existing ERD reuse surface | Existing OpenAPI reuse surface | NO-GO guard | Status |
|---|---|---|---|---|---|---|---|---|
| Readiness Dashboard | `NUS-READINESS-001` | owner, admin, editor, reviewer, viewer | `AC-READINESS-001` through `AC-READINESS-004` | `NQA-READINESS-001` through `NQA-READINESS-004` | `OnboardingProgress`, `SetupChecklistItem`, `Campaign`, `BriefVersion`, `ApprovalDecision`, `ManualPublishEvidence`, `AuditLog` | Onboarding, campaign, brief-version, approval, manual evidence, audit read surfaces | Readiness must not approve or publish. | Planned only; not implemented |
| Smart Wizard manual intake | `NUS-WIZARD-001` | editor | `AC-WIZARD-001`, `AC-WIZARD-002` | `NQA-WIZARD-001`, `NQA-WIZARD-002` | `Campaign`, `BriefVersion`, `AuditLog` | Campaign and brief-version paths | No `IntakeSession`, `IntakeAnswer`, Agent Mode runtime, or external integration behavior. | Planned only; not implemented |
| Product / Store / Service / Offer intake | `NUS-OBJECT-001` | editor | `AC-OBJECT-001`, `AC-OBJECT-002` | `NQA-OBJECT-001`, `NQA-OBJECT-002` | `Campaign`, `BriefVersion` | Campaign and brief-version paths | No first-class product/store/service/offer entities or external data ingestion. | Planned only; not implemented |
| Campaign basics and advertised object flow | `NUS-CAMPAIGN-001` | editor | `AC-CAMPAIGN-001`, `AC-CAMPAIGN-002` | `NQA-CAMPAIGN-001`, `NQA-CAMPAIGN-002` | `Campaign`, `CampaignStateTransition`, `BriefVersion` | Campaign, campaign state transition, and brief-version paths | No new lifecycle tables, endpoints, generated clients, SQL, or runtime behavior. | Planned only; not implemented |
| Landing destination | `NUS-DESTINATION-001` | editor, reviewer | `AC-DESTINATION-001`, `AC-DESTINATION-002` | `NQA-DESTINATION-001`, `NQA-DESTINATION-002` | `BriefVersion`, `TrackedLink`, `PublishJob`, `MediaAssetVersion`, `ApprovalDecision`, `AuditLog` | Brief-version, tracked-link, asset-version, approval decision paths | Destination and UTM must not imply attribution; material changes require reapproval. | Planned only; not implemented |
| Creative rights confirmation | `NUS-RIGHTS-001` | editor, reviewer | `AC-RIGHTS-001`, `AC-RIGHTS-002` | `NQA-RIGHTS-001`, `NQA-RIGHTS-002` | `MediaAssetVersion`, `ReviewTask`, `ApprovalDecision`, `ManualPublishEvidence`, `AuditLog` | Asset-version, review-task, approval-decision, manual evidence, audit surfaces | Missing rights must block until human review; no automated rights clearance. | Planned only; not implemented |
| Idea intake and content requirements | `NUS-CONTENT-001` | editor, reviewer, AI assistant advisory-only | `AC-CONTENT-001`, `AC-CONTENT-002` | `NQA-CONTENT-001`, `NQA-CONTENT-002` | `BriefVersion`, `MediaAssetVersion`, `ApprovalDecision`, `AuditLog` | Brief-version, asset-version, approval, audit surfaces | AI-suggested content must not change protected fields or bypass review/approval/reapproval. | Planned only; not implemented |
| Hashtags per selected channel | `NUS-HASHTAGS-001` | editor, reviewer, AI assistant advisory-only | `AC-HASHTAGS-001` | `NQA-HASHTAGS-001` | `BriefVersion`, `MediaAssetVersion` | Brief-version and asset-version paths | No reach guarantee, trend ingestion, analytics optimization, or attribution. | Planned only; not implemented |
| Video reference scripts | `NUS-VIDEO-001` | editor, reviewer, AI assistant advisory-only | `AC-VIDEO-001` | `NQA-VIDEO-001` | `BriefVersion`, `MediaAssetVersion` | Brief-version and asset-version paths | No final video generation, editing, asset procurement, automated rights clearance, or video production entities. | Planned only; not implemented |
| UTM Tracking Lite | `NUS-UTM-001` | editor, reviewer | `AC-UTM-001`, `AC-UTM-002` | `NQA-UTM-001`, `NQA-UTM-002` | `TrackedLink`, `PublishJob`, `ManualPublishEvidence`, `AuditLog` | Tracked-link and manual evidence paths | UTM Lite is not attribution, analytics ingestion, optimization, or platform reporting. | Planned only; not implemented |
| Human approval | `NUS-APPROVAL-001` | reviewer | `AC-APPROVAL-001`, `AC-APPROVAL-002` | `NQA-APPROVAL-001`, `NQA-APPROVAL-002` | `ReviewTask`, `ApprovalDecision`, `MediaAssetVersion`, `AuditLog` | Review-task and approval-decision paths | AI and readiness must not approve, reject, or bypass human review. | Planned only; not implemented |
| Approval lock / reapproval | `NUS-REAPPROVAL-001` | reviewer, editor | `AC-REAPPROVAL-001`, `AC-REAPPROVAL-002` | `NQA-REAPPROVAL-001`, `NQA-REAPPROVAL-002` | `MediaAssetVersion`, `ApprovalDecision`, `ReviewTask`, `AuditLog` | Asset-version, review-task, approval-decision, audit paths | Material changes require reapproval; `draft`/`generated` cannot move directly to `approved`. | Planned only; not implemented |
| Manual publishing checklist | `NUS-CHECKLIST-001` | editor, reviewer | `AC-CHECKLIST-001` | `NQA-CHECKLIST-001` | `PublishJob`, `ApprovalDecision`, `ManualPublishEvidence`, `AuditLog` | Publish-job and manual-evidence paths | Checklist must not publish, schedule, spend, or connect accounts. | Planned only; not implemented |
| Manual publishing evidence | `NUS-EVIDENCE-001` | editor, evidence reviewer | `AC-EVIDENCE-001` through `AC-EVIDENCE-004` | `NQA-EVIDENCE-001` through `NQA-EVIDENCE-004` | `ManualPublishEvidence`, `PublishJob`, `MediaAssetVersion`, `ApprovalDecision`, `TrackedLink`, `AuditLog` | Manual evidence, publish-job, tracked-link paths | Evidence does not authorize publishing; AI must not accept or invalidate evidence. | Planned only; not implemented |
| Manual performance review | `NUS-PERFORMANCE-001` | editor, admin, owner | `AC-PERFORMANCE-001`, `AC-PERFORMANCE-002` | `NQA-PERFORMANCE-001`, `NQA-PERFORMANCE-002` | `ClientReportSnapshot`, `ManualPublishEvidence` | Client report snapshot and manual evidence paths | User-entered only; no analytics ingestion, attribution, optimization, or paid execution. | Planned only; not implemented |
| Role & permission boundaries | `NUS-PERMISSIONS-001` | owner, admin, reviewer, evidence reviewer, editor, viewer, AI assistant advisory-only | `AC-PERMISSIONS-001` through `AC-PERMISSIONS-003` | `NQA-PERMISSIONS-001` through `NQA-PERMISSIONS-003` | `WorkspaceMember`, `Role`, `Permission`, `RolePermission`, `AuditLog` | Workspace member, role, permission, audit surfaces | Viewer/editor/AI protected-action bypass must fail. | Planned only; not implemented |
| Tenant isolation and workspace authority | `NUS-TENANT-001` | all human actors | `AC-TENANT-001`, `AC-TENANT-002` | `NQA-TENANT-001`, `NQA-TENANT-002` | All workspace-scoped entities | `/workspaces/{workspaceId}/...`, `WorkspaceId` parameter | Route/context workspace wins; body `workspace_id` is not trusted; cross-workspace access must fail. | Planned only; not implemented |
| ErrorModel and idempotency expectations | `NUS-ERRORS-001` | all human actors | `AC-ERRORS-001`, `AC-ERRORS-002` | `NQA-ERRORS-001`, `NQA-ERRORS-002` | `AuditLog`, workspace-scoped entities, `MediaJob`, `PublishJob`, `UsageMeter` idempotency constraints where existing authority declares them | `ErrorModel`, `ErrorResponse`, `Idempotency-Key` where OpenAPI declares it | Forbidden actions and retries must not produce inconsistent behavior. | Planned only; not implemented |
| NO-GO negative boundaries | `NUS-NOGO-001` | all human actors, AI assistant advisory-only | `AC-NOGO-001`, `AC-NOGO-002` | `NQA-NOGO-001`, `NQA-NOGO-002` | N/A | N/A | Direct publishing, social OAuth, scheduling, paid ads, payment, analytics ingestion, attribution, external integrations, autonomous AI execution, and Post-V1 module implementation must remain blocked. | Planned only; not implemented |

## 12. User story table

| User Story ID | Persona / actor | Story | Acceptance Criteria IDs | Future QA Case IDs | Priority | Status | Notes |
|---|---|---|---|---|---|---|---|
| `NUS-READINESS-001` | owner, admin, editor, reviewer, viewer | As a workspace user, I want to see advisory readiness, warnings, blockers, approval status, checklist status, and evidence status so I can understand what is missing before manual review and external publishing support. | `AC-READINESS-001` through `AC-READINESS-004` | `NQA-READINESS-001` through `NQA-READINESS-004` | P0 | Planned only; not implemented | Readiness does not equal approval and does not authorize publishing. |
| `NUS-WIZARD-001` | editor | As an editor, I want a manual Smart Wizard intake flow so I can confirm campaign inputs before they are reused in campaign and brief surfaces. | `AC-WIZARD-001`, `AC-WIZARD-002` | `NQA-WIZARD-001`, `NQA-WIZARD-002` | P0 | Planned only; not implemented | No intake entities, Agent Mode runtime, autonomous execution, or external integrations. |
| `NUS-OBJECT-001` | editor | As an editor, I want to capture product, store, service, or offer details from user-provided inputs so campaign drafts can reflect the advertised object. | `AC-OBJECT-001`, `AC-OBJECT-002` | `NQA-OBJECT-001`, `NQA-OBJECT-002` | P0 | Planned only; not implemented | No first-class object entities or external data ingestion under Option A. |
| `NUS-CAMPAIGN-001` | editor | As an editor, I want to define campaign basics and advertised-object context so campaign and brief records can support manual planning. | `AC-CAMPAIGN-001`, `AC-CAMPAIGN-002` | `NQA-CAMPAIGN-001`, `NQA-CAMPAIGN-002` | P0 | Planned only; not implemented | Reuse `Campaign` and `BriefVersion`; no new lifecycle contract. |
| `NUS-DESTINATION-001` | editor, reviewer | As an editor or reviewer, I want landing destination context to be captured and reviewed so approved content and evidence remain aligned to the correct destination. | `AC-DESTINATION-001`, `AC-DESTINATION-002` | `NQA-DESTINATION-001`, `NQA-DESTINATION-002` | P1 | Planned only; not implemented | Material destination changes require reapproval; UTM is not attribution. |
| `NUS-RIGHTS-001` | editor, reviewer | As a reviewer, I want creative rights confirmation to block risky content until human review so unconfirmed rights cannot become an approval shortcut. | `AC-RIGHTS-001`, `AC-RIGHTS-002` | `NQA-RIGHTS-001`, `NQA-RIGHTS-002` | P0 | Planned only; not implemented | Rights confirmation remains manual and auditable. |
| `NUS-CONTENT-001` | editor, reviewer, AI assistant advisory-only | As an editor, I want to capture ideas and content requirements as draft inputs so human review can evaluate them before approval. | `AC-CONTENT-001`, `AC-CONTENT-002` | `NQA-CONTENT-001`, `NQA-CONTENT-002` | P1 | Planned only; not implemented | AI suggestions remain advisory and cannot change protected fields. |
| `NUS-HASHTAGS-001` | editor, reviewer, AI assistant advisory-only | As an editor, I want hashtags per selected channel as draft recommendations so content can be reviewed for channel fit. | `AC-HASHTAGS-001` | `NQA-HASHTAGS-001` | P1 | Planned only; not implemented | No reach guarantee, trend ingestion, analytics optimization, or attribution. |
| `NUS-VIDEO-001` | editor, reviewer, AI assistant advisory-only | As an editor, I want video reference scripts so reviewers can evaluate draft video direction without implying final video production. | `AC-VIDEO-001` | `NQA-VIDEO-001` | P1 | Planned only; not implemented | No final video generation, editing, asset procurement, or automated rights clearance. |
| `NUS-UTM-001` | editor, reviewer | As an editor, I want UTM Tracking Lite links so manual publishing can use structured links without platform analytics ingestion or attribution. | `AC-UTM-001`, `AC-UTM-002` | `NQA-UTM-001`, `NQA-UTM-002` | P0 | Planned only; not implemented | UTM mismatch requires correction or invalidation planning. |
| `NUS-APPROVAL-001` | reviewer | As a reviewer, I want to approve or reject reviewed content versions explicitly so approval remains human, auditable, and version-bound. | `AC-APPROVAL-001`, `AC-APPROVAL-002` | `NQA-APPROVAL-001`, `NQA-APPROVAL-002` | P0 | Planned only; not implemented | AI must not approve, reject, or bypass human review. |
| `NUS-REAPPROVAL-001` | reviewer, editor | As a reviewer, I want material changes after approval to require reapproval so approved content cannot be silently changed before manual publishing support. | `AC-REAPPROVAL-001`, `AC-REAPPROVAL-002` | `NQA-REAPPROVAL-001`, `NQA-REAPPROVAL-002` | P0 | Planned only; not implemented | `draft` or `generated` cannot move directly to `approved`. |
| `NUS-CHECKLIST-001` | editor, reviewer | As an editor, I want a manual publishing checklist so approved content can be prepared for external user-operated publishing. | `AC-CHECKLIST-001` | `NQA-CHECKLIST-001` | P0 | Planned only; not implemented | Checklist must not publish, schedule, spend, or connect accounts. |
| `NUS-EVIDENCE-001` | editor, evidence reviewer | As an evidence reviewer, I want submitted manual publishing evidence to be accepted, corrected, superseded, or invalidated by authorized humans so proof remains auditable. | `AC-EVIDENCE-001` through `AC-EVIDENCE-004` | `NQA-EVIDENCE-001` through `NQA-EVIDENCE-004` | P0 | Planned only; not implemented | Evidence does not authorize publishing; AI cannot accept or invalidate evidence. |
| `NUS-PERFORMANCE-001` | editor, admin, owner | As a workspace user, I want manual performance observations to be entered by users so post-publishing review can be captured without analytics ingestion. | `AC-PERFORMANCE-001`, `AC-PERFORMANCE-002` | `NQA-PERFORMANCE-001`, `NQA-PERFORMANCE-002` | P0 | Planned only; not implemented | Manual performance review remains user-entered only and is not attribution. |
| `NUS-PERMISSIONS-001` | owner, admin, reviewer, evidence reviewer, editor, viewer, AI assistant advisory-only | As a workspace owner or admin, I want protected actions to require explicit workspace-scoped permissions so viewer, editor, and AI bypass attempts fail. | `AC-PERMISSIONS-001` through `AC-PERMISSIONS-003` | `NQA-PERMISSIONS-001` through `NQA-PERMISSIONS-003` | P0 | Planned only; not implemented | Exact permission codes remain unresolved and required before implementation readiness. |
| `NUS-TENANT-001` | all human actors | As a workspace user, I want workspace-scoped records to use route/context workspace authority so cross-workspace access and body `workspace_id` misuse fail. | `AC-TENANT-001`, `AC-TENANT-002` | `NQA-TENANT-001`, `NQA-TENANT-002` | P0 | Planned only; not implemented | Route-derived workspace context must be included in every workspace-scoped query. |
| `NUS-ERRORS-001` | all human actors | As a workspace user, I want forbidden actions, invalid transitions, invalid evidence, cross-workspace attempts, and retry conflicts to return approved ErrorModel behavior. | `AC-ERRORS-001`, `AC-ERRORS-002` | `NQA-ERRORS-001`, `NQA-ERRORS-002` | P0 | Planned only; not implemented | Exact error states and idempotency cases remain unresolved. |
| `NUS-NOGO-001` | all human actors, AI assistant advisory-only | As a governance reviewer, I want NO-GO attempts to remain blocked so Core V1 cannot expand into publishing, integrations, paid execution, analytics, attribution, autonomous AI, or Post-V1 modules. | `AC-NOGO-001`, `AC-NOGO-002` | `NQA-NOGO-001`, `NQA-NOGO-002` | P0 | Planned only; not implemented | Direct publishing, social OAuth, scheduling, paid ads, payment, analytics ingestion, attribution, external integrations, autonomous AI execution, and Post-V1 module implementation remain NO-GO. |

## 13. Missing implementation details before readiness

The following must be resolved before any implementation readiness gate can be considered:

- exact UI behavior;
- exact route/component mapping;
- exact permission codes;
- exact QA cases;
- exact error states;
- exact audit event names;
- exact allowed files / forbidden files;
- exact verification commands;
- expected CI gates;
- rollback/no-go criteria;
- explicit NO-GO boundaries;
- exact entity, endpoint, repository method, and permission scope;
- tenant isolation checks;
- ErrorModel checks;
- idempotency checks where existing OpenAPI declares idempotency.

## 14. Core NO-GO boundaries

Readiness does not equal approval.

Evidence does not authorize publishing.

Manual publishing remains external and user-operated in Core V1.

Manual performance review remains user-entered and is not analytics ingestion.

UTM Lite is not attribution.

AI must not approve, reject, accept evidence, invalidate evidence, publish, schedule, spend, connect accounts, ingest analytics, attribute results, or change protected fields.

Direct publishing, social OAuth, scheduling, paid ads, payment, analytics ingestion, attribution, external integrations, autonomous AI execution, and Post-V1 module implementation remain NO-GO.

## 15. Recommended next documentation step

The recommended next documentation step is a Nashir implementation readiness gap review that remains documentation-only and determines whether the user stories, acceptance criteria, future QA cases, permissions, audit events, UI behavior, route/component mapping, allowed files, forbidden files, verification commands, expected CI gates, rollback/no-go criteria, and NO-GO boundaries are complete enough to request a separately approved implementation readiness gate.

## 16. GO / NO-GO decision

GO:

- documentation-only Nashir Core V1 Option A reuse-only User Stories document;
- documentation-only traceability from Future User Story IDs to acceptance criteria, future QA IDs, existing ERD reuse surfaces, existing OpenAPI reuse surfaces, personas, and NO-GO boundaries;
- future documentation-only implementation readiness gap review.

NO-GO:

- implementation from this document;
- implementation planning gate today;
- QA/test implementation;
- ERD, SQL, OpenAPI, generated client, runtime, package, workflow, migration, prototype, frontend, router/store, or implementation changes;
- direct publishing, social OAuth, scheduling, paid ads, payment, analytics ingestion, attribution, external integrations, autonomous AI execution, and Post-V1 module implementation.

## 17. Safe files to edit later if approved

If separately approved, later documentation-only planning may edit narrowly scoped documentation files such as:

- `docs/nashir_user_stories.md`;
- `docs/nashir_acceptance_criteria.md`;
- `docs/nashir_qa_test_planning.md`;
- `docs/03_decision_log.md`;
- `docs/17_change_log.md`;
- future implementation readiness gap review documents;
- future implementation readiness gate documents.

Any future contract or implementation work requires its own approved allowed files, forbidden files, verification commands, expected CI gates, rollback/no-go criteria, and NO-GO boundaries.

## 18. Files that must remain forbidden

Unless a future request explicitly approves them, these must remain forbidden:

- `docs/08_api_spec.md`;
- `docs/marketing_os_v5_6_5_phase_0_1_openapi.yaml`;
- `docs/06_erd.md`;
- SQL files;
- OpenAPI files;
- generated clients;
- `src/`;
- `tests/`;
- `test/`;
- `package.json`;
- lockfiles;
- `.github/workflows/`;
- `scripts/`;
- `migrations/`;
- `prototype/`;
- frontend assets;
- runtime router/store files;
- any implementation file;
- any ERD/OpenAPI/SQL/runtime contract file unless explicitly listed in a future approved scope.
