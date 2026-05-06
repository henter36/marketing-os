# Nashir Acceptance Criteria

## 1. Purpose

This document is documentation-only.

This document defines acceptance criteria only for Nashir Core V1 Option A reuse-only before any implementation planning gate.

This document defines acceptance criteria only.

This document does not approve implementation.

This document does not add or modify test files.

This document does not modify OpenAPI, generated clients, ERD, SQL, runtime, packages, workflows, or implementation.

Existing ERD and OpenAPI remain authoritative.

Option A reuse-only remains current direction.

Core V1 remains manual/export/review/approval/evidence only.

## 2. Scope

This document covers acceptance criteria for Nashir Core V1 manual campaign intake, readiness, draft preparation, human review, approval, approval lock, manual publishing checklist support, manual publishing evidence, UTM Tracking Lite, manual performance review, role and permission boundaries, tenant isolation, workspace authority, ErrorModel expectations, idempotency expectations, and NO-GO negative boundaries.

The criteria are planning-level acceptance criteria for future separately approved user stories and QA cases. They do not create sprint-ready implementation tasks.

## 3. Non-goals

This document does not:

- approve backlog execution;
- approve implementation planning;
- create or modify automated tests or manual QA scripts;
- add endpoints, schemas, entities, fields, relationships, SQL migrations, generated clients, repositories, routes, stores, packages, workflows, scripts, migrations, prototype assets, frontend assets, or implementation files;
- patch `docs/08_api_spec.md`, `docs/marketing_os_v5_6_5_phase_0_1_openapi.yaml`, `docs/06_erd.md`, SQL files, or runtime contracts;
- authorize Pilot or Production readiness;
- treat readiness as approval;
- treat evidence as publishing authorization;
- treat UTM Lite as attribution;
- treat manual performance review as analytics ingestion;
- approve direct publishing, social OAuth, scheduling, paid ads, payment, analytics ingestion, attribution, external integrations, autonomous AI execution, or Post-V1 module implementation.

## 4. Sources inspected

- `AGENTS.md`
- `README.md`
- `docs/17_change_log.md`
- `docs/03_decision_log.md`
- `docs/02_v1_scope.md`
- `docs/04_backlog.md`
- `docs/06_erd.md`
- `docs/08_api_spec.md`
- `docs/nashir_dual_path_customer_journey_and_campaign_flow.md`
- `docs/nashir_journey_traceability_and_contract_impact_review.md`
- `docs/nashir_prd_backlog_reconciliation.md`
- `docs/nashir_erd_openapi_qa_threat_model_impact_review.md`
- `docs/nashir_campaign_readiness_scoring_contract.md`
- `docs/nashir_approval_state_machine_contract.md`
- `docs/nashir_manual_publishing_evidence_contract.md`
- `docs/nashir_role_permission_matrix.md`
- `docs/nashir_erd_patch_proposal.md`
- `docs/nashir_openapi_patch_proposal.md`
- `docs/nashir_qa_test_planning.md`
- `docs/nashir_threat_model_update.md`
- `docs/marketing_os_v5_6_5_phase_0_1_erd.md`
- `docs/marketing_os_v5_6_5_phase_0_1_backlog.md`
- `docs/marketing_os_v5_6_5_phase_0_1_openapi.yaml`

## 5. Current repository authority summary

Marketing OS remains a contract-first Phase 0/1 repository. It is not approved for Pilot or Production.

`README.md` and `docs/17_change_log.md` identify the current baseline as verified through Sprint 4 with selected DB-backed repository slices. HTTP/runtime product routes remain limited, and broader runtime, persistence, Pilot, and Production changes remain NO-GO unless separately approved.

`docs/02_v1_scope.md` defines Nashir Core V1 as manual/export/review/approval/evidence only. It does not approve implementation by itself.

`docs/04_backlog.md` documents Nashir backlog planning boundaries only. It does not create sprint-ready implementation tasks.

`docs/06_erd.md` points to `docs/marketing_os_v5_6_5_phase_0_1_erd.md` as the approved ERD authority. The Nashir Option A reuse-only addendum maps Nashir Core V1 to existing approved entities only and adds no new entities, fields, relationships, constraints, indexes, enums, SQL changes, OpenAPI changes, QA changes, runtime changes, generated clients, tests, packages, workflows, migrations, or implementation.

`docs/08_api_spec.md` points to `docs/marketing_os_v5_6_5_phase_0_1_openapi.yaml` as the approved OpenAPI authority. Frontend and backend must not invent product endpoints outside OpenAPI. Every workspace-scoped endpoint must use route/context-derived workspace authority. `workspace_id` from request bodies must not be trusted. Error responses must follow ErrorModel. Idempotency remains required where declared by OpenAPI.

No SQL, OpenAPI, generated client, runtime, test, package, workflow, migration, prototype, frontend, router/store, or implementation change is approved by this document.

## 6. Relationship to Nashir governance documents

### Nashir Core V1 scope

Nashir Core V1 remains manual/export/review/approval/evidence only. Acceptance criteria must preserve manual intake, draft outputs, human review, human approval, approval lock, manual checklist support, user-provided evidence, and user-entered manual review. They must not expand Core V1 into direct publishing, paid execution, analytics ingestion, attribution, external integrations, or autonomous AI.

### Backlog planning boundaries

The backlog wrapper permits planning references for Nashir Core V1 candidates but does not create sprint-ready work. These acceptance criteria are inputs for future user story drafting only.

### ERD Option A reuse-only

Acceptance criteria must map to existing ERD reuse surfaces only: `Campaign`, `BriefVersion`, `MediaAsset`, `MediaAssetVersion`, `ReviewTask`, `ApprovalDecision`, `PublishJob`, `ManualPublishEvidence`, `TrackedLink`, `ClientReportSnapshot`, `Workspace`, `WorkspaceMember`, `Role`, `Permission`, `RolePermission`, `AuditLog`, `OnboardingProgress`, and `SetupChecklistItem` where the ERD addendum allows them.

### OpenAPI Option A reuse-only

Acceptance criteria must map to existing OpenAPI paths and schemas only. No new path, schema, operation, generated client update, or OpenAPI patch is approved.

### QA/Test Planning

This document refines future acceptance criteria that future QA cases must trace to. It does not add or modify QA or test files.

### Threat Model Update

Acceptance criteria must include tenant isolation, body `workspace_id` distrust, role/permission boundaries, approval bypass prevention, evidence tampering prevention, UTM no-attribution boundaries, manual performance no-ingestion boundaries, AI protected-action prohibitions, and NO-GO bypass negative coverage.

### Scoring Contract

Readiness is advisory and explainable. Readiness does not equal approval. Readiness does not authorize publishing. Low readiness may allow draft generation with warning only where future policy permits and no blocking risk is active. `blocked_until_review` prevents approval until human review clears the blocking condition.

### Approval State Machine Contract

Approval is human, explicit, authorized, auditable, version-bound, and separate from readiness. Material content changes after approval require reapproval. AI must not approve or reject.

### Manual Publishing Evidence Contract

Evidence is user-provided proof of external manual publishing. Evidence requires an approved content version where accepted. Wrong URL, channel, or content version requires correction or invalidation. Evidence does not authorize publishing.

### Role & Permission Matrix

Protected actions require explicit authority. Viewers cannot perform protected actions. Editors cannot approve unless granted explicit reviewer authority. AI cannot approve, reject, accept evidence, invalidate evidence, publish, schedule, spend, or change protected fields.

## 7. Acceptance criteria principles

1. Existing ERD and OpenAPI remain authoritative.
2. Option A reuse-only remains current direction.
3. Acceptance criteria define reviewable future behavior but do not approve implementation.
4. Every future criterion must trace to a future user story and future QA case before implementation planning can be considered.
5. Readiness does not equal approval.
6. Readiness does not authorize publishing.
7. Approval is human, explicit, authorized, version-bound, and auditable.
8. Manual publishing remains external and user-operated in Core V1.
9. Evidence does not authorize publishing.
10. Manual performance review remains user-entered and is not analytics ingestion.
11. UTM Lite is structured link support only and is not attribution.
12. AI must not approve, reject, accept evidence, invalidate evidence, publish, schedule, spend, or change protected fields.
13. Route/context workspace wins over request-body `workspace_id`.
14. Cross-workspace access must fail.
15. Error responses must preserve approved ErrorModel behavior.
16. Idempotency expectations must remain aligned with existing OpenAPI-declared idempotent operations.
17. Direct publishing, social OAuth, scheduling, paid ads, payment, analytics ingestion, attribution, external integrations, autonomous AI execution, and Post-V1 module implementation remain NO-GO.

## 8. Traceability model

Future implementation planning must preserve this traceability model:

| Traceability field | Required meaning |
|---|---|
| Capability ID | Stable ID for the Nashir Core V1 capability group, such as `CAP-READINESS`. |
| Acceptance Criteria ID | Stable ID for an acceptance criterion, such as `AC-READINESS-001`. |
| Future User Story ID | Placeholder or future story ID, such as `NUS-READINESS-001`; not sprint-ready until separately approved. |
| Future QA Case ID | Placeholder or future QA ID, such as `NQA-READINESS-001`; no test file is created here. |
| Existing ERD/OpenAPI reuse surface | Existing approved entity/path/schema that may support the future criterion under Option A. |
| NO-GO guard | Explicit boundary that must fail or block if attempted. |

No future implementation request should proceed unless each in-scope criterion has approved user stories, QA cases, allowed files, forbidden files, verification commands, expected CI gates, rollback/no-go criteria, and NO-GO boundaries.

## 9. Capability groups

| Capability ID | Capability group | Existing ERD reuse surface | Existing OpenAPI reuse surface | NO-GO guard |
|---|---|---|---|---|
| CAP-READINESS | Readiness Dashboard | `OnboardingProgress`, `SetupChecklistItem`, `Campaign`, `BriefVersion`, `ApprovalDecision`, `ManualPublishEvidence`, `AuditLog` | Onboarding, campaign, brief, approval, manual evidence, audit read surfaces | Readiness must not approve or publish. |
| CAP-WIZARD | Smart Wizard manual intake | `Campaign`, `BriefVersion`, `AuditLog` | Campaign and brief-version paths | Wizard output must be manual/user-confirmed. |
| CAP-OBJECT | Product / Store / Service / Offer intake | `Campaign`, `BriefVersion` | Campaign and brief-version paths | No product/store/service/offer entities or external integrations. |
| CAP-CAMPAIGN | Campaign basics and advertised object flow | `Campaign`, `CampaignStateTransition`, `BriefVersion` | Campaign, campaign state transition, and brief-version paths | No new lifecycle tables or endpoints. |
| CAP-DESTINATION | Landing destination | `BriefVersion`, `TrackedLink`, `PublishJob` | Brief-version and tracked-link paths | Destination/UTM must not imply attribution. |
| CAP-RIGHTS | Creative rights confirmation | `MediaAssetVersion`, `ReviewTask`, `ApprovalDecision`, `ManualPublishEvidence`, `AuditLog` | Asset version, review task, approval decision, manual evidence, and audit paths | Missing rights must block until human review. |
| CAP-CONTENT | Idea intake and content requirements | `BriefVersion`, `MediaAssetVersion` | Brief-version and asset-version paths | Draft content only; no autonomous AI execution. |
| CAP-HASHTAGS | Hashtags per selected channel | `BriefVersion`, `MediaAssetVersion` | Brief-version and asset-version paths | No reach guarantee, trend ingestion, analytics optimization, or attribution. |
| CAP-VIDEO | Video reference scripts | `BriefVersion`, `MediaAssetVersion` | Brief-version and asset-version paths | No final video generation, editing, asset procurement, or video production entities. |
| CAP-UTM | UTM Tracking Lite | `TrackedLink`, `PublishJob`, `ManualPublishEvidence` | Tracked-link and manual evidence paths | UTM Lite is not attribution or analytics ingestion. |
| CAP-APPROVAL | Human approval | `ReviewTask`, `ApprovalDecision`, `MediaAssetVersion`, `AuditLog` | Review task and approval decision paths | AI/readiness must not approve or reject. |
| CAP-REAPPROVAL | Approval lock / reapproval | `MediaAssetVersion`, `ApprovalDecision`, `AuditLog` | Asset-version, review-task, approval-decision, and audit paths | Material changes require reapproval. |
| CAP-CHECKLIST | Manual publishing checklist | `PublishJob`, `ApprovalDecision`, `ManualPublishEvidence`, `AuditLog` | Publish job, manual evidence, and audit paths | Checklist must not publish, schedule, or spend. |
| CAP-EVIDENCE | Manual publishing evidence | `ManualPublishEvidence`, `PublishJob`, `MediaAssetVersion`, `AuditLog` | Manual evidence paths | Evidence does not authorize publishing. |
| CAP-PERFORMANCE | Manual performance review | `ClientReportSnapshot`, `ManualPublishEvidence` | Client report snapshot and manual evidence paths | User-entered only; no analytics ingestion or attribution. |
| CAP-PERMISSIONS | Role & permission boundaries | `WorkspaceMember`, `Role`, `Permission`, `RolePermission`, `AuditLog` | Workspace member, role, permission, and audit paths | Viewer/editor/AI protected-action bypass must fail. |
| CAP-TENANT | Tenant isolation and workspace authority | Workspace-scoped entities with `workspace_id` | `/workspaces/{workspaceId}/...` paths and `WorkspaceId` parameter | Route/context workspace wins; body `workspace_id` is not trusted. |
| CAP-ERRORS | ErrorModel and idempotency expectations | Workspace-scoped idempotency constraints where existing ERD declares them | `ErrorModel`, `ErrorResponse`, `Idempotency-Key` where OpenAPI declares it | Forbidden actions and retries must not produce inconsistent behavior. |
| CAP-NOGO | NO-GO negative boundaries | N/A | N/A | Direct publishing, social OAuth, scheduling, paid ads, payment, analytics ingestion, attribution, external integrations, autonomous AI execution, and Post-V1 module implementation must remain blocked. |

## 10. Acceptance criteria table

| Capability | AC ID | Acceptance criterion | Existing ERD reuse | Existing OpenAPI reuse | Future QA case ID | Priority | Status |
|---|---|---|---|---|---|---|---|
| Readiness Dashboard | AC-READINESS-001 | Readiness must remain advisory and must not equal human approval. | `Campaign`, `BriefVersion`, `ApprovalDecision`, `ManualPublishEvidence`, `AuditLog` | Campaign, brief-version, approval, manual evidence, audit surfaces | NQA-READINESS-001 | P0 | Planned only; not implemented |
| Readiness Dashboard | AC-READINESS-002 | Readiness must not authorize publishing, scheduling, paid execution, payment, analytics ingestion, attribution, external integrations, or autonomous AI execution. | Same as above | Same as above | NQA-READINESS-002 | P0 | Planned only; not implemented |
| Readiness Dashboard | AC-READINESS-003 | Low readiness may allow draft generation with a visible warning only where future policy permits and no blocking risk exists. | `BriefVersion`, `MediaAssetVersion`, `AuditLog` | Brief-version and asset-version surfaces | NQA-READINESS-003 | P1 | Planned only; not implemented |
| Readiness Dashboard | AC-READINESS-004 | `blocked_until_review` prevents approval until a human review cycle resolves the blocking risk. | `ReviewTask`, `ApprovalDecision`, `AuditLog` | Review task and approval decision paths | NQA-READINESS-004 | P0 | Planned only; not implemented |
| Smart Wizard manual intake | AC-WIZARD-001 | Smart Wizard output must be manual, user-confirmed, and stored only through approved reuse surfaces if future implementation is approved. | `Campaign`, `BriefVersion`, `AuditLog` | Campaign and brief-version paths | NQA-WIZARD-001 | P0 | Planned only; not implemented |
| Smart Wizard manual intake | AC-WIZARD-002 | Smart Wizard must not create `IntakeSession`, `IntakeAnswer`, Agent Mode runtime, autonomous execution, or external integration behavior under Option A. | `BriefVersion` | Brief-version paths | NQA-WIZARD-002 | P0 | Planned only; not implemented |
| Product / Store / Service / Offer intake | AC-OBJECT-001 | Product, store, service, and offer intake must use user-provided data, uploaded files, or explicitly allowed public links only. | `Campaign`, `BriefVersion` | Campaign and brief-version paths | NQA-OBJECT-001 | P0 | Planned only; not implemented |
| Product / Store / Service / Offer intake | AC-OBJECT-002 | Product, store, service, and offer intake must not create first-class profile/offer entities or external data ingestion under Option A. | `Campaign`, `BriefVersion` | Campaign and brief-version paths | NQA-OBJECT-002 | P0 | Planned only; not implemented |
| Campaign basics and advertised object flow | AC-CAMPAIGN-001 | Campaign basics and advertised object flow must reuse `Campaign` and `BriefVersion` for manual intake and draft planning. | `Campaign`, `BriefVersion` | Campaign and brief-version paths | NQA-CAMPAIGN-001 | P0 | Planned only; not implemented |
| Campaign basics and advertised object flow | AC-CAMPAIGN-002 | Campaign/BriefVersion reuse must not introduce new campaign lifecycle tables, endpoints, generated clients, SQL, or runtime behavior. | `Campaign`, `CampaignStateTransition`, `BriefVersion` | Campaign, campaign state transition, and brief-version paths | NQA-CAMPAIGN-002 | P0 | Planned only; not implemented |
| Landing destination | AC-DESTINATION-001 | Landing destination must be captured and reviewed as manual campaign context before approval and evidence workflows. | `BriefVersion`, `TrackedLink`, `PublishJob` | Brief-version and tracked-link paths | NQA-DESTINATION-001 | P1 | Planned only; not implemented |
| Landing destination | AC-DESTINATION-002 | Landing destination changes that materially affect approved content must require reapproval. | `MediaAssetVersion`, `ApprovalDecision`, `AuditLog` | Asset-version and approval decision paths | NQA-DESTINATION-002 | P0 | Planned only; not implemented |
| Creative rights confirmation | AC-RIGHTS-001 | Missing or unconfirmed creative rights must block until human review and must not proceed as an approval shortcut. | `MediaAssetVersion`, `ReviewTask`, `ApprovalDecision`, `AuditLog` | Asset-version, review-task, approval-decision, audit surfaces | NQA-RIGHTS-001 | P0 | Planned only; not implemented |
| Creative rights confirmation | AC-RIGHTS-002 | Rights confirmation must remain manual and auditable where future implementation is approved. | `ApprovalDecision`, `ManualPublishEvidence`, `AuditLog` | Approval, manual evidence, audit surfaces | NQA-RIGHTS-002 | P0 | Planned only; not implemented |
| Idea intake and content requirements | AC-CONTENT-001 | Ideas and content requirements must remain draft/advisory inputs until user confirmation and human review. | `BriefVersion`, `MediaAssetVersion` | Brief-version and asset-version paths | NQA-CONTENT-001 | P1 | Planned only; not implemented |
| Idea intake and content requirements | AC-CONTENT-002 | AI-suggested content must not change protected fields or bypass review, approval, or reapproval. | `BriefVersion`, `MediaAssetVersion`, `ApprovalDecision`, `AuditLog` | Brief-version, asset-version, approval, audit surfaces | NQA-CONTENT-002 | P0 | Planned only; not implemented |
| Hashtags per selected channel | AC-HASHTAGS-001 | Hashtags per selected channel must remain draft recommendations only and must not imply reach, optimization, analytics ingestion, or attribution. | `BriefVersion`, `MediaAssetVersion` | Brief-version and asset-version paths | NQA-HASHTAGS-001 | P1 | Planned only; not implemented |
| Video reference scripts | AC-VIDEO-001 | Video reference scripts must remain draft/reference outputs only and must not imply final video generation, editing, asset procurement, or automated rights clearance. | `BriefVersion`, `MediaAssetVersion` | Brief-version and asset-version paths | NQA-VIDEO-001 | P1 | Planned only; not implemented |
| UTM Tracking Lite | AC-UTM-001 | UTM Lite must use tracked links only and must not imply analytics ingestion, attribution, optimization, or platform reporting. | `TrackedLink`, `PublishJob` | Tracked-link paths | NQA-UTM-001 | P0 | Planned only; not implemented |
| UTM Tracking Lite | AC-UTM-002 | UTM mismatch against evidence, destination, channel, or content version must require correction or invalidation planning. | `TrackedLink`, `ManualPublishEvidence`, `AuditLog` | Tracked-link and manual evidence paths | NQA-UTM-002 | P1 | Planned only; not implemented |
| Human approval | AC-APPROVAL-001 | Approval must be human, explicit, authorized, auditable, and bound to a reviewed content version. | `ReviewTask`, `ApprovalDecision`, `MediaAssetVersion`, `AuditLog` | Review task and approval decision paths | NQA-APPROVAL-001 | P0 | Planned only; not implemented |
| Human approval | AC-APPROVAL-002 | AI must not approve, reject, or bypass human review under any Core V1 acceptance criterion. | `ReviewTask`, `ApprovalDecision`, `AuditLog` | Review task and approval decision paths | NQA-APPROVAL-002 | P0 | Planned only; not implemented |
| Approval lock / reapproval | AC-REAPPROVAL-001 | Approved content material changes must require reapproval before manual publishing support continues. | `MediaAssetVersion`, `ApprovalDecision`, `AuditLog` | Asset-version and approval decision paths | NQA-REAPPROVAL-001 | P0 | Planned only; not implemented |
| Approval lock / reapproval | AC-REAPPROVAL-002 | `draft` or `generated` content must not move directly to `approved` without a human review decision. | `ReviewTask`, `ApprovalDecision` | Review task and approval decision paths | NQA-REAPPROVAL-002 | P0 | Planned only; not implemented |
| Manual publishing checklist | AC-CHECKLIST-001 | Manual publishing checklist support must remain UI-derived or reuse existing surfaces and must not publish, schedule, spend, or connect accounts. | `PublishJob`, `ApprovalDecision`, `ManualPublishEvidence`, `AuditLog` | Publish job and manual evidence paths | NQA-CHECKLIST-001 | P0 | Planned only; not implemented |
| Manual publishing evidence | AC-EVIDENCE-001 | Evidence requires an approved content version where accepted. | `ManualPublishEvidence`, `PublishJob`, `MediaAssetVersion`, `ApprovalDecision` | Manual evidence and publish job paths | NQA-EVIDENCE-001 | P0 | Planned only; not implemented |
| Manual publishing evidence | AC-EVIDENCE-002 | Wrong evidence URL, channel, content version, destination, or UTM link must require correction, supersede, or invalidation. | `ManualPublishEvidence`, `TrackedLink`, `AuditLog` | Manual evidence supersede/invalidate and tracked-link paths | NQA-EVIDENCE-002 | P0 | Planned only; not implemented |
| Manual publishing evidence | AC-EVIDENCE-003 | Evidence submission, acceptance, supersede, or invalidation must not authorize publishing. | `ManualPublishEvidence`, `PublishJob`, `AuditLog` | Manual evidence paths | NQA-EVIDENCE-003 | P0 | Planned only; not implemented |
| Manual publishing evidence | AC-EVIDENCE-004 | AI must not accept evidence, invalidate evidence, create false evidence, or perform evidence protected actions. | `ManualPublishEvidence`, `AuditLog` | Manual evidence paths | NQA-EVIDENCE-004 | P0 | Planned only; not implemented |
| Manual performance review | AC-PERFORMANCE-001 | Manual performance data must be user-entered only and must not be treated as analytics ingestion, attribution, or platform-verified reporting. | `ClientReportSnapshot`, `ManualPublishEvidence` | Client report snapshot paths | NQA-PERFORMANCE-001 | P0 | Planned only; not implemented |
| Manual performance review | AC-PERFORMANCE-002 | Manual performance review must not initiate optimization, paid execution, retargeting, analytics import, or attribution workflows. | `ClientReportSnapshot` | Client report snapshot paths | NQA-PERFORMANCE-002 | P0 | Planned only; not implemented |
| Role & permission boundaries | AC-PERMISSIONS-001 | Viewer must not create, edit, approve, reject, submit evidence, accept evidence, invalidate evidence, publish, schedule, or spend. | `WorkspaceMember`, `Role`, `Permission`, `RolePermission`, `AuditLog` | Workspace member, role, permission, audit surfaces | NQA-PERMISSIONS-001 | P0 | Planned only; not implemented |
| Role & permission boundaries | AC-PERMISSIONS-002 | Editor may draft or edit only where future policy permits and must not approve unless explicitly granted approval authority. | `Role`, `Permission`, `RolePermission`, `AuditLog` | Role and permission paths | NQA-PERMISSIONS-002 | P0 | Planned only; not implemented |
| Role & permission boundaries | AC-PERMISSIONS-003 | Protected actions must require explicit workspace-scoped permission and auditability where future implementation is approved. | `WorkspaceMember`, `Permission`, `RolePermission`, `AuditLog` | Permission and audit paths | NQA-PERMISSIONS-003 | P0 | Planned only; not implemented |
| Tenant isolation and workspace authority | AC-TENANT-001 | Route/context workspace must win over body `workspace_id`; body `workspace_id` must not be trusted. | All workspace-scoped entities | `/workspaces/{workspaceId}/...`, `WorkspaceId` parameter | NQA-TENANT-001 | P0 | Planned only; not implemented |
| Tenant isolation and workspace authority | AC-TENANT-002 | Cross-workspace access to campaigns, briefs, assets, approvals, publish jobs, evidence, tracked links, reports, permissions, or audit records must fail. | All workspace-scoped entities | Workspace-scoped paths | NQA-TENANT-002 | P0 | Planned only; not implemented |
| ErrorModel and idempotency expectations | AC-ERRORS-001 | Authorization failures, invalid transitions, invalid evidence, cross-workspace access, idempotency conflicts, and NO-GO attempts must preserve approved ErrorModel behavior. | `AuditLog`, workspace-scoped entities | `ErrorModel`, `ErrorResponse` | NQA-ERRORS-001 | P0 | Planned only; not implemented |
| ErrorModel and idempotency expectations | AC-ERRORS-002 | Existing OpenAPI-declared idempotency expectations must remain preserved for idempotent operations and must not create duplicate side effects. | `MediaJob`, `PublishJob`, `UsageMeter` idempotency constraints | `Idempotency-Key` on declared paths | NQA-ERRORS-002 | P1 | Planned only; not implemented |
| NO-GO negative boundaries | AC-NOGO-001 | Direct publishing, social OAuth, scheduling, paid ads, payment, analytics ingestion, attribution, external integrations, autonomous AI execution, and Post-V1 module implementation must remain blocked. | N/A | N/A | NQA-NOGO-001 | P0 | Planned only; not implemented |
| NO-GO negative boundaries | AC-NOGO-002 | AI must not approve, reject, accept evidence, invalidate evidence, publish, schedule, spend, connect accounts, ingest analytics, attribute results, or change protected fields. | `AuditLog`, protected workflow entities | Existing protected workflow paths only | NQA-NOGO-002 | P0 | Planned only; not implemented |

## 11. Missing areas that remain non-implementation-ready

The following remain non-implementation-ready:

- approved future user stories;
- approved future QA cases;
- exact permission code mapping for any new protected Nashir behavior;
- audit event mapping for any new protected Nashir behavior;
- final material-change criteria and reapproval handling;
- final evidence correction, supersede, acceptance, and invalidation policy;
- final UTM Lite field semantics if existing `TrackedLink` wording is insufficient;
- final manual performance review wording and snapshot structure if existing surfaces are insufficient;
- any proof that existing ERD/OpenAPI surfaces are insufficient;
- allowed files, forbidden files, verification commands, expected CI gates, rollback/no-go criteria, and NO-GO boundaries for future implementation;
- runtime design and implementation scope, which remain unapproved.

## 12. Required future user stories

Future implementation planning must first create separately approved user stories for at least:

- NUS-READINESS-001: advisory readiness dashboard and warnings;
- NUS-WIZARD-001: manual Smart Wizard intake and user confirmation;
- NUS-OBJECT-001: product/store/service/offer intake through approved reuse surfaces;
- NUS-CAMPAIGN-001: campaign basics and advertised object flow;
- NUS-DESTINATION-001: landing destination capture and material-change handling;
- NUS-RIGHTS-001: creative rights confirmation and review blocking;
- NUS-CONTENT-001: idea intake and content requirements;
- NUS-HASHTAGS-001: hashtags per selected channel as draft recommendations;
- NUS-VIDEO-001: video reference scripts as draft/reference outputs;
- NUS-UTM-001: UTM Tracking Lite through tracked links only;
- NUS-APPROVAL-001: human approval and version-bound decision behavior;
- NUS-REAPPROVAL-001: approval lock and material-change reapproval;
- NUS-CHECKLIST-001: manual publishing checklist support without publishing execution;
- NUS-EVIDENCE-001: manual publishing evidence submission, correction, supersede, and invalidation;
- NUS-PERFORMANCE-001: manual performance review using user-entered data only;
- NUS-PERMISSIONS-001: role and protected-action boundaries;
- NUS-TENANT-001: tenant isolation and workspace authority;
- NUS-ERRORS-001: ErrorModel and idempotency preservation;
- NUS-NOGO-001: negative boundaries for all NO-GO categories.

These IDs are placeholders and do not create approved backlog stories.

## 13. Required future QA test cases

Future QA/test planning must define separately approved QA cases for:

- readiness is not approval;
- readiness is not publishing authorization;
- low readiness draft with warning where allowed;
- `blocked_until_review` preventing approval until human review;
- manual/user-confirmed Smart Wizard output;
- `Campaign` and `BriefVersion` reuse for manual intake;
- approved content material changes requiring reapproval;
- AI protected-action denials;
- evidence requiring approved content version;
- wrong evidence URL/channel/content version requiring correction or invalidation;
- evidence not authorizing publishing;
- UTM Lite tracked links not implying analytics or attribution;
- manual performance user-entered-only behavior;
- viewer protected-action denial;
- editor approval denial without explicit authority;
- route/context workspace winning over body `workspace_id`;
- cross-workspace access failure;
- ErrorModel responses for forbidden actions;
- idempotency preservation where OpenAPI declares it;
- negative blocking for direct publishing, social OAuth, scheduling, paid ads, payment, analytics ingestion, attribution, external integrations, autonomous AI execution, and Post-V1 modules.

No QA or test file is created or modified by this document.

## 14. Required future implementation readiness gate

Future implementation requires a separately approved implementation readiness gate that names:

- approved sources;
- exact user stories and acceptance criteria in scope;
- exact QA cases in scope;
- exact entities, endpoints, repository methods, and permissions in scope;
- allowed files;
- forbidden files;
- verification commands;
- expected CI gates;
- rollback/no-go criteria;
- tenant isolation checks;
- ErrorModel checks;
- idempotency checks where applicable;
- explicit NO-GO boundaries.

Without that gate, implementation remains NO-GO.

## 15. GO / NO-GO decision

GO:

- documentation-only acceptance criteria for Nashir Core V1 Option A reuse-only;
- future user story and QA planning based on this document;
- continued Option A reuse-only analysis using existing ERD and OpenAPI surfaces.

NO-GO:

- implementation planning gate today;
- implementation from this document;
- QA/test implementation;
- ERD, SQL, OpenAPI, generated client, runtime, package, workflow, migration, prototype, frontend, router/store, or implementation changes;
- direct publishing, social OAuth, scheduling, paid ads, payment, analytics ingestion, attribution, external integrations, autonomous AI execution, and Post-V1 module implementation.

## 16. Safe files to edit later if approved

If separately approved, later documentation-only planning may edit narrowly scoped documentation files such as:

- `docs/nashir_acceptance_criteria.md`;
- `docs/03_decision_log.md`;
- `docs/17_change_log.md`;
- future user story planning documents;
- future QA planning documents;
- future implementation readiness gate documents.

Any future contract or implementation work requires its own approved allowed files, forbidden files, verification commands, expected CI gates, rollback/no-go criteria, and NO-GO boundaries.

## 17. Files that must remain forbidden

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
