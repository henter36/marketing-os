# Nashir Implementation Gate Planning

| Field | Value |
|---|---|
| Document type | Documentation-only implementation gate planning |
| Status | Draft — Pending Review |
| Scope | Nashir Core V1 only |
| Change type | Documentation-only |
| Implementation status | Not approved |
| Relationship | Follows `docs/nashir_ui_route_permission_audit_errormodel_mapping.md` |

## 1. Purpose

This document defines the future implementation gate for a separately approved Nashir Core V1 implementation slice.

It defines what must be true before implementation can begin, proposed allowed and forbidden boundaries, verification gates, rollback/no-go criteria, and expected implementation boundaries.

This document does not approve implementation. It does not create code, create tests, modify ERD, modify OpenAPI, modify SQL, modify generated clients, modify runtime, modify packages, modify workflows, or modify migrations.

## 2. Sources Inspected

- `AGENTS.md`
- `README.md`
- `docs/02_v1_scope.md`
- `docs/04_backlog.md`
- `docs/03_decision_log.md`
- `docs/17_change_log.md`
- `docs/nashir_dual_path_customer_journey_and_campaign_flow.md`
- `docs/nashir_journey_traceability_and_contract_impact_review.md`
- `docs/nashir_prd_backlog_reconciliation.md`
- `docs/nashir_erd_openapi_qa_threat_model_impact_review.md`
- `docs/nashir_campaign_readiness_scoring_contract.md`
- `docs/nashir_approval_state_machine_contract.md`
- `docs/nashir_manual_publishing_evidence_contract.md`
- `docs/nashir_role_permission_matrix.md`
- `docs/nashir_erd_patch_planning_gate.md`
- `docs/nashir_erd_patch_proposal.md`
- `docs/nashir_openapi_patch_planning_gate.md`
- `docs/nashir_openapi_patch_proposal.md`
- `docs/nashir_qa_test_planning.md`
- `docs/nashir_threat_model_update.md`
- `docs/nashir_acceptance_criteria.md`
- `docs/nashir_user_stories.md`
- `docs/nashir_implementation_readiness_gap_review.md`
- `docs/nashir_ui_route_permission_audit_errormodel_mapping.md`

No blocking source conflict was found for this documentation-only implementation gate planning document.

## 3. Governance Summary

Nashir Core V1 remains manual/export/review/approval/evidence only.

The following remain NO-GO:

- no direct publishing;
- no social OAuth;
- no scheduling;
- no paid ads;
- no payment;
- no analytics ingestion;
- no attribution;
- no external integrations;
- no autonomous AI execution;
- no Post-V1 module implementation.

Readiness does not equal approval.

Evidence does not authorize publishing.

Manual publishing remains external and user-operated.

Manual performance review remains user-entered only.

UTM Lite is tracked links only, not attribution.

AI remains advisory-only and cannot approve, reject, accept evidence, invalidate evidence, publish, schedule, spend, connect accounts, ingest analytics, attribute results, or change protected fields.

## 4. Current Authority Snapshot

| Authority | Controls | Gate impact |
|---|---|---|
| Scope | `docs/02_v1_scope.md` limits Nashir Core V1 to manual/export/review/approval/evidence. | Implementation cannot exceed manual, review, approval, evidence, and external user-operated publishing support. |
| Backlog | `docs/04_backlog.md` records Nashir backlog planning boundaries only. | No sprint-ready implementation task exists yet. |
| Acceptance Criteria | `docs/nashir_acceptance_criteria.md` defines planning-level `AC-*`, `NUS-*`, and `NQA-*` traceability. | Future implementation must name exact in-scope AC IDs. |
| User Stories | `docs/nashir_user_stories.md` maps `NUS-*` IDs to actors, capabilities, reuse surfaces, and NO-GO guards. | Future implementation must name exact user stories and preserve planning-only IDs until approved. |
| Readiness Gap Review | `docs/nashir_implementation_readiness_gap_review.md` identifies remaining blockers before an implementation gate. | This gate document responds to that next-step recommendation but does not open the gate. |
| UI / Route / Permission / Audit / ErrorModel Mapping | `docs/nashir_ui_route_permission_audit_errormodel_mapping.md` maps planning UI behavior, route candidates, permissions, audit events, ErrorModel, idempotency, tenant isolation, AI, manual publishing, UTM Lite, and NO-GO behavior. | Latest Nashir mapping authority for future gate boundaries. |
| QA/Test Planning | `docs/nashir_qa_test_planning.md` defines future QA categories and placeholders. | No test files are approved; future QA gate must define executable cases if tests are in scope. |
| Threat Model | `docs/nashir_threat_model_update.md` identifies tenant, authorization, approval, evidence, UTM, manual performance, AI, audit, and NO-GO bypass threats. | Future implementation must prove controls for tenant isolation and protected actions. |
| Role/Permission Matrix | `docs/nashir_role_permission_matrix.md` defines conceptual role and protected-action boundaries. | Exact permission codes remain a blocker before implementation. |
| ERD Option A reuse-only | ERD planning/proposal documents keep Nashir on existing approved entities only. | No ERD, SQL, migration, field, enum, relationship, or schema change is allowed by this gate plan. |
| OpenAPI Option A reuse-only | OpenAPI planning/proposal documents recommend existing path/schema reuse and no generated client update. | No OpenAPI or generated client change is allowed by this gate plan. |
| Approval State Machine | `docs/nashir_approval_state_machine_contract.md` defines human approval, approval lock, and material-change reapproval semantics. | Future implementation must keep approval human, version-bound, and separate from readiness/publishing. |
| Manual Publishing Evidence Contract | `docs/nashir_manual_publishing_evidence_contract.md` defines evidence as user-provided proof only. | Future implementation must keep evidence separate from publishing authorization. |
| Campaign Readiness Scoring Contract | `docs/nashir_campaign_readiness_scoring_contract.md` defines readiness as advisory. | Future UI must not label readiness as approval or publishing authorization. |

## 5. Gate Purpose

This is a planning gate only. It defines the conditions, scope controls, verification requirements, rollback/no-go criteria, and remaining blockers for a future implementation PR.

It does not authorize code, tests, runtime behavior, frontend behavior, API behavior, SQL, generated clients, packages, workflows, migrations, or product scope changes.

A future implementation PR still requires a separate approved request with exact scope, exact allowed files, exact forbidden files, exact verification commands, expected CI gates, rollback criteria, and NO-GO criteria.

## 6. Candidate First Implementation Slice

Recommended candidate slice: Read-only / UI-contract-first Nashir Core V1 shell and mapping slice.

This is a recommendation only. It is not implementation approval.

The candidate should focus on:

- route/UI surface scaffolding if already compatible with existing app architecture;
- visible manual states for readiness, approval, checklist, evidence, UTM Lite, manual performance, permissions, tenant isolation, and NO-GO labels;
- no backend write behavior unless separately approved;
- no schema changes;
- no OpenAPI changes;
- no tests unless separately approved in the implementation gate.

If a future implementation request cannot name exact UI file paths, route/component boundaries, permission codes, audit event handling, ErrorModel behavior, verification commands, and rollback/no-go criteria, the slice must remain NO-GO.

## 7. Slice Scope

| Slice name | Included capability | Excluded capability | Related User Story IDs | Related Acceptance Criteria IDs | Related Future QA IDs | Existing ERD reuse surface | Existing OpenAPI reuse surface | Required permission expectation | Required audit expectation | ErrorModel expectation | Implementation readiness status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Read-only / UI-contract-first Nashir Core V1 shell and mapping slice | Advisory display shell for readiness, intake status, approval/evidence/checklist status, UTM/manual performance labels, permission denial labels, tenant isolation labels, and NO-GO labels. | Writes, publishing, scheduling, account connection, paid execution, analytics ingestion, attribution, AI execution, schema changes, OpenAPI changes, generated clients, SQL, migrations, runtime/server changes. | `NUS-READINESS-001`, `NUS-PERMISSIONS-001`, `NUS-TENANT-001`, `NUS-ERRORS-001`, `NUS-NOGO-001` plus read-only references to other `NUS-*` IDs if approved. | `AC-READINESS-001` through `AC-READINESS-004`, `AC-PERMISSIONS-001` through `AC-PERMISSIONS-003`, `AC-TENANT-001`, `AC-TENANT-002`, `AC-ERRORS-001`, `AC-ERRORS-002`, `AC-NOGO-001`, `AC-NOGO-002`. | `NQA-READINESS-*`, `NQA-PERMISSIONS-*`, `NQA-TENANT-*`, `NQA-ERRORS-*`, `NQA-NOGO-*` placeholders only. | `OnboardingProgress`, `SetupChecklistItem`, `Campaign`, `BriefVersion`, `ApprovalDecision`, `ManualPublishEvidence`, `TrackedLink`, `ClientReportSnapshot`, `WorkspaceMember`, `Role`, `Permission`, `RolePermission`, `AuditLog`. | Existing onboarding, campaign, brief-version, approval, manual evidence, tracked-link, client report snapshot, audit, workspace, role, and permission surfaces where read-only reuse is approved. | View-only permission expectation; protected actions disabled or absent; exact permission code gap remains. | No audit logging implementation approved; if persisted views or denials are later approved, use mapped events from the mapping document. | Existing ErrorModel behavior must be preserved for denied/forbidden surfaces; no custom error shape. | Not approved; needs exact file paths, route/component boundaries, permission codes, QA cases, and verification commands. |

## 8. Allowed Files — Proposed Only

All entries below are candidate allowed file categories requiring separate implementation approval. They are not approved by this document.

| Candidate category | Proposed boundary | Gate status |
|---|---|---|
| Documentation file for implementation report | A future implementation report or slice report may be allowed if the implementation gate names it. | Candidate only. |
| Limited UI route/component files | Only if the future gate names exact existing UI route/component files and proves compatibility with existing app architecture. | Exact file path gap — must be resolved before implementation. |
| Limited frontend navigation registration | Only if required for the approved UI shell and exact files are named. | Exact file path gap — must be resolved before implementation. |
| Backend route files | Not allowed for the candidate first slice unless separately justified and explicitly approved. | NO-GO by default. |
| Generated clients | Not allowed unless a future OpenAPI gate is reopened and explicitly approves OpenAPI/client work. | NO-GO. |
| SQL or migrations | Not allowed unless a future ERD/SQL gate is reopened and explicitly approves SQL work. | NO-GO. |
| Tests | Not allowed unless a future QA/test gate explicitly approves exact test files and commands. | NO-GO by default. |

Do not list or edit exact `src/` files until a future implementation request identifies them as allowed. Exact file path gap — must be resolved before implementation.

## 9. Forbidden Files

The future first slice must forbid:

- SQL;
- OpenAPI;
- generated clients;
- migrations;
- workflows;
- packages;
- runtime/server code;
- publishing integrations;
- social OAuth;
- scheduling;
- paid ads;
- payments;
- analytics ingestion;
- attribution;
- autonomous AI execution;
- Post-V1 modules.

Unless a future implementation request explicitly approves otherwise, the forbidden repository areas include `src/`, `tests/`, `test/`, SQL files, OpenAPI files, generated clients, `package.json`, lockfiles, `.github/workflows/`, scripts, migrations, runtime files, router/store files, frontend assets, and any implementation file not named by the approved gate.

## 10. Required Inputs Before Implementation

A future implementation gate must include all of the following before any code:

- exact scope;
- allowed files;
- forbidden files;
- expected changed files;
- verification commands;
- CI gates;
- rollback criteria;
- no-go criteria;
- acceptance criteria IDs;
- future QA IDs;
- user story IDs;
- exact UI behavior;
- route/component boundaries;
- permission codes;
- audit event names;
- ErrorModel behavior;
- idempotency behavior where existing OpenAPI declares idempotency;
- material-change reapproval triggers;
- AI advisory boundaries;
- manual publishing checklist behavior;
- manual publishing evidence behavior;
- UTM Lite behavior;
- manual performance review behavior;
- tenant isolation checks;
- protected-action enforcement expectations;
- explicit NO-GO boundaries.

Without those inputs, implementation remains NO-GO.

## 11. Verification Plan

| Verification area | Required command or check | Expected result | Blocking level | Notes |
|---|---|---|---|---|
| Branch confirmation | `git branch --show-current` | Expected implementation branch is shown. | Blocker | Future gate must name the required branch. |
| Git status clean check | `git status --short` before and after edits | No unrelated files changed; only approved files modified. | Blocker | Dirty worktree must be reviewed before implementation. |
| Changed files whitelist | `git diff --name-only` | Output contains only approved files. | Blocker | Any unapproved file is NO-GO. |
| Forbidden files check | Review `git diff --name-only` against forbidden categories. | No SQL, OpenAPI, generated client, package, workflow, migration, runtime/server, router/store, test, or unapproved frontend asset changes. | Blocker | Future gates may add exact grep/check commands. |
| Markdown/doc check if available | Repository-approved markdown/doc command, if one exists and is named by the gate. | Pass. | Medium | Do not invent broad checks without gate approval. |
| Existing CI gates | Future gate must list expected CI gates and required pass criteria. | All required gates pass. | Blocker | No Nashir slice CI is approved today. |
| Broad tests | Do not run unless future implementation gate requires them. | N/A. | Medium | Broad tests are not required for this planning document. |
| OpenAPI/codegen checks | Do not run unless OpenAPI is touched, which should be forbidden for the candidate slice. | N/A. | Blocker if OpenAPI changed. | Any OpenAPI/client drift is NO-GO. |
| SQL migration checks | Do not run unless SQL is touched, which should be forbidden for the candidate slice. | N/A. | Blocker if SQL changed. | Any SQL/migration drift is NO-GO. |

## 12. Rollback Plan

Rollback for a future approved first slice must use a normal revert PR strategy that removes only the approved slice changes.

No data migration rollback should be needed if SQL remains forbidden.

No generated client rollback should be needed if OpenAPI and generated clients remain forbidden.

No runtime rollback should be needed if implementation remains UI/doc-only and avoids server/runtime behavior.

Immediate revert is required if a future PR:

- touches forbidden files;
- changes runtime/server behavior without approval;
- modifies SQL, OpenAPI, generated clients, packages, workflows, migrations, router/store files, or tests without approval;
- introduces direct publishing, social OAuth, scheduling, paid ads, payments, analytics ingestion, attribution, external integrations, autonomous AI execution, or Post-V1 module behavior;
- treats readiness as approval;
- treats evidence as publishing authorization;
- weakens tenant isolation, permissions, ErrorModel, or idempotency behavior.

## 13. NO-GO Criteria

Implementation remains NO-GO if any of the following occur:

- any SQL is touched;
- any OpenAPI is touched;
- any generated client is touched;
- any tests are added without a QA gate;
- any runtime/server behavior is touched without approval;
- any publishing, OAuth, scheduling, paid ads, payment, analytics, or attribution behavior is added;
- any AI protected action is introduced;
- readiness is treated as approval;
- evidence is treated as publishing authorization;
- cross-tenant risk is unresolved;
- permission code gap is unresolved;
- audit event gap is unresolved;
- ErrorModel/idempotency gap is unresolved.

## 14. Implementation Gate Decision

GO for documentation-only implementation gate planning.

NO-GO for implementation.

NO-GO for runtime/code/test/schema/OpenAPI/generated-client/workflow/package/migration changes.

Future implementation requires a separately approved implementation PR with exact allowed files and verification commands.

## 15. Recommended Next Step

The next step should be a separately approved first implementation slice planning prompt only after reviewers approve:

- exact implementation slice;
- exact file list;
- exact verification commands;
- rollback criteria;
- CI requirements.

Do not use this document as actual implementation instructions. It defines gate requirements only.

## 16. Traceability Appendix

| User Story ID | Acceptance Criteria IDs | Future QA IDs | Candidate slice relevance | Permission expectation | Audit expectation | ErrorModel expectation | NO-GO relevance | Ready for implementation gate? |
|---|---|---|---|---|---|---|---|---|
| `NUS-READINESS-001` | `AC-READINESS-001` through `AC-READINESS-004` | `NQA-READINESS-001` through `NQA-READINESS-004` | Read-only advisory readiness display candidate. | View permission only; readiness grants no authority. | `nashir.readiness.viewed` / `nashir.readiness.recalculated` only if future gate approves persisted audit. | Block readiness-as-approval/publishing. | Readiness-as-approval remains blocked. | Needs clarification |
| `NUS-WIZARD-001` | `AC-WIZARD-001`, `AC-WIZARD-002` | `NQA-WIZARD-001`, `NQA-WIZARD-002` | Reference-only in first slice unless read-only intake status is approved. | Draft/edit permission gap. | `nashir.intake.saved` only if future write behavior is approved. | Missing/unconfirmed fields must preserve ErrorModel if writes are approved. | Autonomous intake and external integrations remain blocked. | Needs clarification |
| `NUS-OBJECT-001` | `AC-OBJECT-001`, `AC-OBJECT-002` | `NQA-OBJECT-001`, `NQA-OBJECT-002` | Reference-only status/labels candidate. | Draft/edit permission gap. | `nashir.intake.saved` only if persisted. | Validation for invalid user-provided/public-link inputs. | No first-class object entities or external ingestion. | Needs clarification |
| `NUS-CAMPAIGN-001` | `AC-CAMPAIGN-001`, `AC-CAMPAIGN-002` | `NQA-CAMPAIGN-001`, `NQA-CAMPAIGN-002` | Read-only campaign planning status candidate. | Draft/edit permission gap for any write. | `nashir.intake.saved` only if persisted. | Required campaign field validation if writes are approved. | No new lifecycle tables/endpoints. | Needs clarification |
| `NUS-DESTINATION-001` | `AC-DESTINATION-001`, `AC-DESTINATION-002` | `NQA-DESTINATION-001`, `NQA-DESTINATION-002` | Read-only destination/material-change labels candidate. | Edit/review permission gap. | `nashir.approval.invalidated_by_material_change` if approved content changed under future gate. | Invalid destination or reapproval required. | Destination/UTM must not imply attribution. | Needs clarification |
| `NUS-RIGHTS-001` | `AC-RIGHTS-001`, `AC-RIGHTS-002` | `NQA-RIGHTS-001`, `NQA-RIGHTS-002` | Read-only rights status and blocked-until-review labels candidate. | Manual rights confirmation permission gap. | `nashir.rights.confirmed` only if future write approved. | Missing rights blocks until review. | AI rights confirmation remains blocked. | Needs clarification |
| `NUS-CONTENT-001` | `AC-CONTENT-001`, `AC-CONTENT-002` | `NQA-CONTENT-001`, `NQA-CONTENT-002` | Read-only content requirement/advisory labels candidate. | Draft/edit/review permission gap; AI advisory-only. | `nashir.intake.saved` and `nashir.ai.advisory_output.generated` if applicable and approved. | Protected-field/AI denial. | Autonomous AI and protected-field changes remain blocked. | Needs clarification |
| `NUS-HASHTAGS-001` | `AC-HASHTAGS-001` | `NQA-HASHTAGS-001` | Read-only draft hashtag label candidate. | Draft/edit/review permission gap; AI advisory-only. | `nashir.ai.advisory_output.generated` if applicable; material-change audit if approved content changed. | Block optimization/attribution claims. | Trend ingestion, analytics, optimization, attribution remain blocked. | Needs clarification |
| `NUS-VIDEO-001` | `AC-VIDEO-001` | `NQA-VIDEO-001` | Read-only script/reference label candidate. | Draft/edit/review permission gap; AI advisory-only. | `nashir.ai.advisory_output.generated` if applicable; material-change audit if approved content changed. | Block final video production actions. | Final video generation/editing/procurement remains blocked. | Needs clarification |
| `NUS-UTM-001` | `AC-UTM-001`, `AC-UTM-002` | `NQA-UTM-001`, `NQA-UTM-002` | Read-only UTM Lite/no-attribution labels candidate. | Tracked-link edit/review permission gap. | `nashir.utm.tracked_link.created` only if future write approved. | Block attribution/analytics; mismatch correction. | UTM Lite is not attribution. | Needs clarification |
| `NUS-APPROVAL-001` | `AC-APPROVAL-001`, `AC-APPROVAL-002` | `NQA-APPROVAL-001`, `NQA-APPROVAL-002` | Read-only approval status candidate; no approve/reject controls unless gate approves. | Explicit human approval permission gap. | `nashir.approval.submitted`, `nashir.approval.accepted`, `nashir.approval.rejected` if future write approved. | Unauthorized/invalid transition errors. | AI/readiness must not approve. | Needs clarification |
| `NUS-REAPPROVAL-001` | `AC-REAPPROVAL-001`, `AC-REAPPROVAL-002` | `NQA-REAPPROVAL-001`, `NQA-REAPPROVAL-002` | Read-only reapproval-required labels candidate. | Edit permission plus reapproval enforcement gap. | `nashir.approval.invalidated_by_material_change` if material change handling approved. | Reapproval required / invalid transition. | Silent approved-content mutation remains blocked. | Needs clarification |
| `NUS-CHECKLIST-001` | `AC-CHECKLIST-001` | `NQA-CHECKLIST-001` | Read-only/manual checklist label candidate only. | Prepare checklist permission gap. | `nashir.manual_publish.checklist.completed` only if future persistence approved. | Block publish/schedule/spend/connect. | Checklist must not publish or connect accounts. | Needs clarification |
| `NUS-EVIDENCE-001` | `AC-EVIDENCE-001` through `AC-EVIDENCE-004` | `NQA-EVIDENCE-001` through `NQA-EVIDENCE-004` | Read-only evidence status labels candidate. | Evidence submit/review permission gap. | `nashir.manual_publish.evidence.submitted`, `nashir.manual_publish.evidence.reviewed` if future write approved. | Invalid evidence, unauthorized review, no publishing authorization. | Evidence-as-authorization and AI evidence action remain blocked. | Needs clarification |
| `NUS-PERFORMANCE-001` | `AC-PERFORMANCE-001`, `AC-PERFORMANCE-002` | `NQA-PERFORMANCE-001`, `NQA-PERFORMANCE-002` | Read-only manual performance labels candidate. | Manual performance entry permission gap. | `nashir.manual_performance.entered` only if future write approved. | Block analytics import/attribution/optimization. | Manual performance remains user-entered only. | Needs clarification |
| `NUS-PERMISSIONS-001` | `AC-PERMISSIONS-001` through `AC-PERMISSIONS-003` | `NQA-PERMISSIONS-001` through `NQA-PERMISSIONS-003` | Permission boundary labels and disabled/absent protected controls candidate. | Exact permission codes required. | `nashir.permission.denied` if future protected denial behavior is implemented. | Forbidden protected action returns ErrorModel. | Viewer/editor/AI protected-action bypass must fail. | No |
| `NUS-TENANT-001` | `AC-TENANT-001`, `AC-TENANT-002` | `NQA-TENANT-001`, `NQA-TENANT-002` | Workspace authority labels and route/context boundary candidate. | Route/context workspace authority. | `nashir.tenant.denied` if future denial behavior is implemented. | Cross-workspace/body workspace misuse returns ErrorModel. | Cross-workspace access remains blocked. | No |
| `NUS-ERRORS-001` | `AC-ERRORS-001`, `AC-ERRORS-002` | `NQA-ERRORS-001`, `NQA-ERRORS-002` | Error/idempotency labels only unless future gate approves behavior. | All human actors; AI denied protected actions. | `nashir.permission.denied`, `nashir.tenant.denied`, `nashir.nogo.blocked` where applicable. | Preserve ErrorModel and declared idempotency. | Retry conflicts and forbidden actions must not duplicate side effects. | No |
| `NUS-NOGO-001` | `AC-NOGO-001`, `AC-NOGO-002` | `NQA-NOGO-001`, `NQA-NOGO-002` | NO-GO labels and absence of forbidden controls candidate. | No actor may perform NO-GO actions; AI assistant denied. | `nashir.nogo.blocked` if attempted. | Forbidden / NO-GO ErrorModel. | All NO-GO categories remain blocked. | No |

## 17. Open Gaps

Remaining gaps that block implementation approval:

- exact UI file paths;
- exact route/component paths;
- exact permission codes;
- exact audit payload fields;
- exact ErrorModel response names if not already in OpenAPI;
- idempotency matrix;
- future QA case finalization;
- tenant isolation verification steps;
- manual publishing checklist UI-only vs persisted decision;
- SetupChecklistItem OpenAPI path gap, if still unresolved;
- protected-action enforcement criteria.

## 18. Files That Must Remain Forbidden

Unless separately approved, these must remain forbidden for future implementation:

- `src/`;
- `tests/`;
- `test/`;
- SQL files;
- OpenAPI files;
- generated clients;
- packages and lockfiles;
- workflows;
- migrations;
- runtime files;
- router/store files;
- frontend assets;
- any implementation file not explicitly listed by a future gate.
