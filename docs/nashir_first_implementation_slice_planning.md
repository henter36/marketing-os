# Nashir First Implementation Slice Planning

| Field | Value |
|---|---|
| Document type | Documentation-only first implementation slice planning |
| Status | Draft — Pending Review |
| Scope | Nashir Core V1 only |
| Change type | Documentation-only |
| Implementation status | Not approved |
| Relationship | Follows `docs/nashir_implementation_gate_planning.md` |

## 1. Purpose

This document selects and bounds the first possible Nashir Core V1 implementation slice candidate.

It defines exact planning boundaries, proposed allowed file categories, forbidden file categories, verification requirements, rollback/no-go criteria, and unresolved blockers before implementation can start.

This document does not approve implementation. It does not write code, create tests, modify ERD, modify OpenAPI, modify SQL, modify generated clients, modify runtime, modify packages, modify workflows, or modify migrations.

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
- `docs/nashir_implementation_gate_planning.md`

No blocking source conflict was found for this documentation-only first implementation slice planning document.

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

## 4. Source Authority Snapshot

| Authority | Current control | Slice planning impact |
|---|---|---|
| Scope | `docs/02_v1_scope.md` keeps Nashir Core V1 manual/export/review/approval/evidence only. | First slice must not introduce execution, integration, analytics, attribution, payment, or autonomous AI. |
| Backlog | `docs/04_backlog.md` keeps Nashir backlog references planning-only. | No sprint-ready implementation task exists from backlog alone. |
| Acceptance Criteria | `docs/nashir_acceptance_criteria.md` defines planning `AC-*`, `NUS-*`, and `NQA-*` traceability. | Candidate slice must trace to AC IDs but cannot implement without a later gate. |
| User Stories | `docs/nashir_user_stories.md` maps planning story IDs to actors, AC IDs, QA IDs, reuse surfaces, and NO-GO guards. | Candidate slice references all stories as planning IDs only. |
| Readiness Gap Review | `docs/nashir_implementation_readiness_gap_review.md` identifies implementation blockers. | Remaining blockers must be preserved before implementation. |
| UI / Route / Permission / Audit / ErrorModel Mapping | `docs/nashir_ui_route_permission_audit_errormodel_mapping.md` is the latest Nashir mapping authority for UI, route candidates, permissions, audit, ErrorModel, idempotency, tenant isolation, AI, manual publishing, UTM Lite, and NO-GO behavior. | Candidate slice must remain read-only/UI-contract-first and treat all routes/components as planning candidates. |
| Implementation Gate Planning | `docs/nashir_implementation_gate_planning.md` defines future gate inputs and candidate first-slice boundaries. | This document narrows the first slice candidate but does not open the gate. |
| QA/Test Planning | `docs/nashir_qa_test_planning.md` defines future QA categories and placeholders. | No test files are approved by this document. |
| Threat Model | `docs/nashir_threat_model_update.md` covers tenant, authorization, approval, evidence, UTM, manual performance, AI, audit, and NO-GO bypass risks. | Candidate slice must avoid controls that weaken tenant or protected-action boundaries. |
| Role/Permission Matrix | `docs/nashir_role_permission_matrix.md` defines conceptual roles and protected-action authority. | Exact permission codes remain unresolved. |
| ERD Option A reuse-only | ERD planning/proposal documents keep Nashir on existing entities only. | No ERD, SQL, migration, field, enum, or relationship change is allowed. |
| OpenAPI Option A reuse-only | OpenAPI planning/proposal documents keep Nashir on existing paths/schemas and no generated client update. | No OpenAPI or generated client change is allowed. |
| Approval State Machine | `docs/nashir_approval_state_machine_contract.md` keeps approval human, version-bound, and separate from readiness. | Candidate slice may show approval labels only; no approval actions. |
| Manual Publishing Evidence Contract | `docs/nashir_manual_publishing_evidence_contract.md` keeps evidence user-provided proof only. | Candidate slice may show evidence labels only; no evidence submission or review actions. |
| Campaign Readiness Scoring Contract | `docs/nashir_campaign_readiness_scoring_contract.md` keeps readiness advisory and explainable. | Candidate slice may show advisory readiness labels only. |

## 5. Candidate Slice Decision

Safest first slice candidate: Read-only / UI-contract-first Nashir Core V1 shell.

This is the safest candidate because it has the lowest runtime risk, requires no SQL, requires no OpenAPI change, requires no generated clients, introduces no publishing behavior, introduces no external integrations, introduces no analytics, introduces no autonomous AI, and can validate UX/governance labels before any write behavior is considered.

This recommendation does not approve implementation.

## 6. Slice Objective

The objective is to expose a read-only or UI-contract-first Nashir shell that shows planned states, labels, and boundaries for Nashir Core V1 without enabling protected actions.

The shell must show or preserve these boundaries:

- readiness is advisory;
- approval is separate;
- evidence is proof only;
- manual publishing is external;
- UTM Lite is not attribution;
- AI is advisory-only;
- NO-GO actions are absent or clearly blocked.

## 7. Included Capabilities

| Capability | Included in first slice? | User Story IDs | Acceptance Criteria IDs | Future QA IDs | UI expectation | Permission expectation | Audit expectation | ErrorModel expectation | Implementation readiness |
|---|---|---|---|---|---|---|---|---|---|
| Readiness Dashboard | yes | `NUS-READINESS-001` | `AC-READINESS-001` through `AC-READINESS-004` | `NQA-READINESS-001` through `NQA-READINESS-004` | Display advisory readiness, blockers, warnings, and no-approval wording. | View-only; readiness grants no authority. | No audit implementation; `nashir.readiness.viewed` only if future gate approves persisted audit. | Block readiness-as-approval/publishing. | Needs clarification; not approved. |
| Campaign/intake status labels | label-only | `NUS-WIZARD-001`, `NUS-OBJECT-001`, `NUS-CAMPAIGN-001` | `AC-WIZARD-001`, `AC-WIZARD-002`, `AC-OBJECT-001`, `AC-OBJECT-002`, `AC-CAMPAIGN-001`, `AC-CAMPAIGN-002` | `NQA-WIZARD-*`, `NQA-OBJECT-*`, `NQA-CAMPAIGN-*` | Display planned/manual/user-confirmed status labels only. | No draft/edit controls unless later approved. | `nashir.intake.saved` is not implemented in this slice. | Missing-field errors are not implemented unless future gate approves behavior. | Needs clarification; not approved. |
| Approval status labels | label-only | `NUS-APPROVAL-001` | `AC-APPROVAL-001`, `AC-APPROVAL-002` | `NQA-APPROVAL-001`, `NQA-APPROVAL-002` | Display human-only, version-bound approval status labels. | No approve/reject/request-change controls. | Approval audit events are not implemented. | Invalid transition behavior remains future. | Needs clarification; not approved. |
| Reapproval-required labels | label-only | `NUS-REAPPROVAL-001` | `AC-REAPPROVAL-001`, `AC-REAPPROVAL-002` | `NQA-REAPPROVAL-001`, `NQA-REAPPROVAL-002` | Display material-change/reapproval warning labels. | No state transition controls. | `nashir.approval.invalidated_by_material_change` is not implemented. | Reapproval ErrorModel behavior remains future. | Needs clarification; not approved. |
| Manual checklist labels | label-only | `NUS-CHECKLIST-001` | `AC-CHECKLIST-001` | `NQA-CHECKLIST-001` | Display external manual checklist support labels only. | No checklist completion or persistence controls. | Checklist audit is not implemented. | Publishing/scheduling/spend/connect controls absent. | Needs clarification; OpenAPI path gap remains. |
| Manual evidence labels | label-only | `NUS-EVIDENCE-001` | `AC-EVIDENCE-001` through `AC-EVIDENCE-004` | `NQA-EVIDENCE-001` through `NQA-EVIDENCE-004` | Display evidence-as-proof-only labels and status placeholders. | No submit/review/correct/supersede/invalidate controls. | Evidence audit events are not implemented. | Evidence authorization confusion must be blocked by wording. | Needs clarification; not approved. |
| UTM Lite labels | label-only | `NUS-UTM-001` | `AC-UTM-001`, `AC-UTM-002` | `NQA-UTM-001`, `NQA-UTM-002` | Display tracked-link/no-attribution labels only. | No tracked-link creation controls. | `nashir.utm.tracked_link.created` is not implemented. | Attribution/analytics attempts remain blocked. | Needs clarification; not approved. |
| Manual performance labels | label-only | `NUS-PERFORMANCE-001` | `AC-PERFORMANCE-001`, `AC-PERFORMANCE-002` | `NQA-PERFORMANCE-001`, `NQA-PERFORMANCE-002` | Display user-entered-only/no-ingestion labels. | No metric entry controls. | `nashir.manual_performance.entered` is not implemented. | Analytics/attribution/optimization remain blocked. | Needs clarification; not approved. |
| Permission boundary labels | label-only | `NUS-PERMISSIONS-001` | `AC-PERMISSIONS-001` through `AC-PERMISSIONS-003` | `NQA-PERMISSIONS-001` through `NQA-PERMISSIONS-003` | Display protected-action boundary labels and omit disabled controls. | Exact permission codes unresolved; no protected actions. | Permission denial audit is not implemented. | Forbidden protected action behavior remains future. | Blocked. |
| Tenant isolation labels | label-only | `NUS-TENANT-001` | `AC-TENANT-001`, `AC-TENANT-002` | `NQA-TENANT-001`, `NQA-TENANT-002` | Display workspace authority labels if applicable. | Route/context workspace authority must remain future gate input. | Tenant denial audit is not implemented. | Cross-workspace behavior remains future verification. | Blocked. |
| AI advisory-only labels | label-only | `NUS-CONTENT-001`, `NUS-HASHTAGS-001`, `NUS-VIDEO-001`, `NUS-PERMISSIONS-001`, `NUS-NOGO-001` | `AC-CONTENT-002`, `AC-NOGO-002` | `NQA-CONTENT-002`, `NQA-NOGO-002` | Display AI advisory-only labels only. | AI has no authority. | AI advisory audit is not implemented. | AI protected-action attempted behavior remains future. | Blocked for implementation; label-only candidate. |
| NO-GO blocked labels | yes | `NUS-NOGO-001` | `AC-NOGO-001`, `AC-NOGO-002` | `NQA-NOGO-001`, `NQA-NOGO-002` | Display blocked/absent controls for NO-GO actions. | No actor may perform NO-GO actions. | `nashir.nogo.blocked` is not implemented. | Forbidden/NO-GO ErrorModel remains future behavior. | Blocked for implementation; label-only candidate. |

## 8. Excluded Capabilities

| Capability | Reason excluded | Risk if included too early | Future gate required |
|---|---|---|---|
| write behavior | Exact files, permissions, ErrorModel, audit, and QA are unresolved. | Runtime drift and unverified protected state changes. | Separately approved implementation gate. |
| approval actions | Exact permission codes and transition handling remain unresolved. | Human approval bypass or unauthorized approval. | Approval implementation gate with permission and audit mapping. |
| evidence submission/review actions | Exact evidence status, attachment, correction, and authority mapping remain unresolved. | Evidence tampering or evidence-as-authorization. | Evidence implementation gate plus QA approval. |
| checklist persistence | UI-only vs persisted decision and SetupChecklistItem OpenAPI path gap remain unresolved. | Checklist may be mistaken for publishing execution. | Checklist persistence decision and OpenAPI/QA gate if persistence is needed. |
| UTM link creation | Exact UTM fields and mismatch behavior remain unresolved. | UTM may be treated as analytics or attribution. | UTM Lite implementation gate. |
| manual performance entry | Exact manual metrics and snapshot semantics remain unresolved. | Manual data may be treated as analytics ingestion or attribution. | Manual performance implementation gate. |
| backend routes | First slice is UI-contract-first and no backend write/read route changes are approved. | Runtime/API drift. | Separately approved backend implementation gate. |
| SQL | Option A reuse-only and this slice forbid SQL changes. | Schema drift and migration risk. | ERD/SQL gate only. |
| OpenAPI | Option A reuse-only and this slice forbid OpenAPI changes. | Endpoint/schema drift and generated-client churn. | OpenAPI gate only. |
| generated clients | No OpenAPI change is approved. | Client drift from authoritative OpenAPI. | OpenAPI/generated-client gate only. |
| tests unless QA gate approves | QA placeholders are planning-only. | Unapproved test surface and CI expectations. | QA/test gate. |
| publishing | Direct publishing is NO-GO. | External posting behavior. | Post-V1 approval only. |
| OAuth | Social OAuth is NO-GO. | External account connection and token risk. | Future integration/OAuth gate only. |
| scheduling | Scheduling is NO-GO. | Publishing execution creep. | Post-V1 approval only. |
| paid ads | Paid execution is NO-GO. | Spend authorization risk. | Post-V1 paid execution gate only. |
| payments | Payment is NO-GO. | Billing/payment scope creep. | Payment/billing gate only. |
| analytics ingestion | Analytics ingestion is NO-GO. | Platform data ingestion and privacy risk. | Future analytics gate only. |
| attribution | Attribution is NO-GO. | UTM/manual metrics misrepresented as attribution. | Future attribution gate only. |
| autonomous AI | Autonomous AI execution is NO-GO. | Protected-action bypass. | Future AI governance and implementation gate only. |
| Post-V1 modules | Post-V1 modules are reference-only. | Scope expansion beyond Core V1. | Separate Post-V1 PRD/RFC/gate. |

## 9. Proposed UI Surfaces — Planning Only

All routes and components are planning candidates only. This document does not approve actual route files, component files, navigation registration, API calls, or runtime behavior.

| Proposed UI surface | Candidate route label | Related User Story IDs | Related Acceptance Criteria IDs | Display-only behavior | Forbidden controls | Role visibility expectation | Error/empty/loading label expectation | Implementation readiness status |
|---|---|---|---|---|---|---|---|---|
| Nashir shell overview | `/workspaces/:workspaceId/nashir` | All `NUS-*` IDs as labels | All related `AC-*` IDs as labels | Show Core V1 manual/export/review/approval/evidence boundaries and status groups. | Publish, connect, schedule, spend, import analytics, attribute, run AI. | owner, admin, editor, reviewer, evidence reviewer, viewer if future policy allows view. | Empty/loading labels must not imply approval or publishability. | Planning candidate only. |
| Readiness dashboard | `/workspaces/:workspaceId/nashir/readiness` | `NUS-READINESS-001` | `AC-READINESS-001` through `AC-READINESS-004` | Show advisory readiness and warnings. | Approval, publish, schedule, spend, analytics, attribution. | View-only where allowed. | Error/empty/loading labels preserve ErrorModel wording intent. | Planning candidate only. |
| Campaign status panel | `/workspaces/:workspaceId/nashir/campaigns/:campaignId/status` | `NUS-WIZARD-001`, `NUS-OBJECT-001`, `NUS-CAMPAIGN-001`, `NUS-DESTINATION-001`, `NUS-RIGHTS-001` | Related intake, campaign, destination, and rights AC IDs | Show status labels for manual intake, campaign basics, destination, and rights. | Save/edit/confirm controls. | View-only where allowed. | Missing state labels must not imply automated intake. | Planning candidate only. |
| Approval governance panel | `/workspaces/:workspaceId/nashir/campaigns/:campaignId/review` | `NUS-APPROVAL-001`, `NUS-REAPPROVAL-001` | `AC-APPROVAL-*`, `AC-REAPPROVAL-*` | Show human approval and reapproval-required labels. | Approve, reject, request changes, force approval. | reviewer/editor visibility depends on future policy. | Invalid transition labels only; no transition action. | Planning candidate only. |
| Manual publishing panel | `/workspaces/:workspaceId/nashir/campaigns/:campaignId/manual-publishing` | `NUS-CHECKLIST-001`, `NUS-EVIDENCE-001`, `NUS-UTM-001`, `NUS-PERFORMANCE-001` | `AC-CHECKLIST-001`, `AC-EVIDENCE-*`, `AC-UTM-*`, `AC-PERFORMANCE-*` | Show checklist/evidence/UTM/manual performance labels and no-authority warnings. | Checklist completion, evidence submit/review, UTM creation, metric entry, publish. | editor, reviewer, evidence reviewer, owner/admin candidates. | Empty states must say no user-entered evidence/performance yet, not platform status. | Planning candidate only. |
| Permissions and NO-GO panel | `/workspaces/:workspaceId/nashir/governance` | `NUS-PERMISSIONS-001`, `NUS-TENANT-001`, `NUS-ERRORS-001`, `NUS-NOGO-001` | `AC-PERMISSIONS-*`, `AC-TENANT-*`, `AC-ERRORS-*`, `AC-NOGO-*` | Show protected-action, workspace authority, ErrorModel/idempotency, and NO-GO labels. | Any protected-action execution. | All human roles as view-only where future policy allows; AI assistant advisory-only. | Denial labels must not expose cross-workspace data. | Planning candidate only. |

## 10. Proposed Allowed Files — Candidate Only

Candidate allowed files requiring separate implementation approval:

| Candidate file category | Proposed boundary | Status |
|---|---|---|
| implementation report document | A future implementation report may be allowed if named by the implementation prompt. | Candidate only. |
| limited UI route/component files | Only if exact paths are approved later and stay UI-contract-first/read-only. | Exact file path gap — must be resolved before implementation. |
| limited navigation registration | Only if exact path is approved later and no runtime/API behavior changes are introduced. | Exact file path gap — must be resolved before implementation. |
| backend route files | No backend route files by default. | Not candidate allowed unless separately approved. |
| tests | No tests unless QA gate approves exact files and commands. | Not candidate allowed by default. |
| OpenAPI | Not allowed. | NO-GO. |
| SQL | Not allowed. | NO-GO. |
| generated clients | Not allowed. | NO-GO. |
| runtime/server files | Not allowed. | NO-GO. |

This document does not approve any file for implementation. Exact file path gap — must be resolved before implementation.

## 11. Forbidden Files

The first implementation slice must forbid:

- SQL files;
- OpenAPI files;
- generated clients;
- migrations;
- workflows;
- packages and lockfiles;
- backend/runtime/server files;
- tests/test files unless QA gate approves;
- publishing integrations;
- social OAuth;
- scheduling;
- paid ads;
- payments;
- analytics ingestion;
- attribution;
- autonomous AI execution;
- Post-V1 modules.

Unless a future implementation prompt explicitly approves otherwise, `src/`, `tests/`, `test/`, SQL files, OpenAPI files, generated clients, package files, workflows, migrations, runtime files, router/store files, frontend assets, and implementation files remain forbidden.

## 12. Verification Plan

| Verification area | Command/check | Expected result | Blocking level | Notes |
|---|---|---|---|---|
| git branch check | `git branch --show-current` | Expected implementation branch is shown. | Blocker | Future implementation prompt must name branch. |
| git status clean | `git status --short` | Only approved files changed; no unrelated files. | Blocker | Check before and after edits. |
| changed files whitelist | `git diff --name-only` | Only files allowed by the future gate. | Blocker | Any unapproved file is NO-GO. |
| forbidden file check | Compare changed files against forbidden categories. | No SQL, OpenAPI, generated client, workflow, package, migration, runtime/server, test, or unapproved frontend asset changes. | Blocker | Future gate may add exact commands. |
| documentation diff review | Review docs/report changes manually. | Wording remains documentation-only and preserves NO-GO boundaries. | Blocker | Required for docs-only or UI-contract-first slices. |
| existing CI gates | Future gate names expected CI gates and pass criteria. | All named gates pass. | Blocker | No Nashir slice CI is approved here. |
| OpenAPI/codegen checks | Do not run unless OpenAPI touched, which should be forbidden. | N/A. | Blocker if OpenAPI changed. | OpenAPI/codegen drift is NO-GO. |
| SQL migration checks | Do not run unless SQL touched, which should be forbidden. | N/A. | Blocker if SQL changed. | SQL/migration drift is NO-GO. |
| broad tests | Do not run unless QA gate approves. | N/A. | Medium | Future QA gate must define test scope. |

## 13. Rollback Plan

Rollback for a future approved first slice must use a normal revert PR strategy that removes only the approved slice changes.

No data rollback is needed if SQL remains forbidden.

No generated client rollback is needed if OpenAPI and generated clients remain forbidden.

No runtime rollback is needed if the future slice remains UI/documentation-only and avoids runtime/server behavior.

Immediate revert is required if a future PR:

- touches forbidden files;
- adds runtime/server behavior without approval;
- modifies SQL, OpenAPI, generated clients, packages, workflows, migrations, router/store files, or tests without approval;
- introduces publishing, OAuth, scheduling, ads, payments, analytics ingestion, attribution, external integrations, autonomous AI, or Post-V1 behavior;
- treats readiness as approval;
- treats evidence as publishing authorization;
- weakens tenant isolation, permissions, auditability, ErrorModel, or idempotency behavior.

## 14. NO-GO Criteria

Implementation remains NO-GO if:

- any SQL is touched;
- any OpenAPI is touched;
- any generated clients are touched;
- any tests are added without QA gate;
- any runtime/server behavior is touched;
- publishing, OAuth, scheduling, ads, payments, analytics, or attribution is introduced;
- any AI protected action is introduced;
- readiness is treated as approval;
- evidence is treated as authorization;
- cross-tenant risk is unresolved;
- permission code gap is unresolved;
- audit event gap is unresolved;
- ErrorModel/idempotency gap is unresolved.

## 15. Remaining Blockers Before Implementation

Remaining blockers:

- exact UI file paths;
- exact route/component paths;
- exact permission codes;
- exact audit payload fields;
- exact ErrorModel responses;
- idempotency matrix;
- tenant isolation verification steps;
- future QA case finalization;
- manual checklist UI-only vs persisted decision;
- SetupChecklistItem OpenAPI path gap;
- protected-action enforcement criteria.

## 16. Gate Decision

GO for documentation-only first slice planning.

NO-GO for implementation.

NO-GO for runtime/code/test/schema/OpenAPI/generated-client/workflow/package/migration changes.

Future implementation requires separately approved implementation PR.

## 17. Recommended Next Step

The next step is a separately approved implementation prompt for the read-only / UI-contract-first Nashir Core V1 shell, only if reviewers approve:

- exact file list;
- exact verification commands;
- exact rollback/no-go criteria;
- exact CI expectations;
- exact excluded behaviors.

Do not use this document as implementation instructions.

## 18. Traceability Appendix

| User Story ID | Included in candidate slice? | UI surface | Permission expectation | Audit expectation | ErrorModel expectation | NO-GO relevance | Ready for implementation? |
|---|---|---|---|---|---|---|---|
| `NUS-READINESS-001` | yes | Readiness dashboard | View-only; readiness grants no authority. | No audit implementation; future `nashir.readiness.viewed` if approved. | Block readiness-as-approval/publishing. | Readiness must not approve or publish. | needs clarification |
| `NUS-WIZARD-001` | label-only | Campaign status panel | No write controls. | No intake audit implementation. | Missing-field behavior remains future. | No Agent Mode runtime or autonomous intake. | needs clarification |
| `NUS-OBJECT-001` | label-only | Campaign status panel | No write controls. | No object-intake audit implementation. | Validation remains future. | No first-class object entities or external ingestion. | needs clarification |
| `NUS-CAMPAIGN-001` | label-only | Campaign status panel | No write controls. | No campaign-save audit implementation. | Required-field behavior remains future. | No lifecycle/API/schema expansion. | needs clarification |
| `NUS-DESTINATION-001` | label-only | Campaign status panel | No destination edit controls. | No material-change audit implementation. | Invalid destination/reapproval behavior remains future. | Destination/UTM must not imply attribution. | needs clarification |
| `NUS-RIGHTS-001` | label-only | Campaign status panel | No rights confirmation controls. | No rights audit implementation. | Missing-rights behavior remains future. | AI rights confirmation and approval shortcuts blocked. | needs clarification |
| `NUS-CONTENT-001` | label-only | Campaign status panel | No draft/edit/AI protected controls. | No intake or AI audit implementation. | Protected-field/AI denial remains future. | AI advisory-only; no protected-field changes. | needs clarification |
| `NUS-HASHTAGS-001` | label-only | Campaign status panel | No hashtag edit controls. | No AI/material-change audit implementation. | Optimization/attribution block remains future. | No trend ingestion, reach, optimization, attribution. | needs clarification |
| `NUS-VIDEO-001` | label-only | Campaign status panel | No script edit or production controls. | No AI/material-change audit implementation. | Video production block remains future. | No final video generation, editing, procurement. | needs clarification |
| `NUS-UTM-001` | label-only | Manual publishing panel | No tracked-link creation controls. | No UTM audit implementation. | Attribution/analytics block remains future. | UTM Lite is not attribution. | needs clarification |
| `NUS-APPROVAL-001` | label-only | Approval governance panel | No approve/reject/request-change controls. | No approval audit implementation. | Invalid transition behavior remains future. | AI/readiness must not approve. | needs clarification |
| `NUS-REAPPROVAL-001` | label-only | Approval governance panel | No reapproval transition controls. | No material-change audit implementation. | Reapproval ErrorModel behavior remains future. | Silent approved-content mutation blocked. | needs clarification |
| `NUS-CHECKLIST-001` | label-only | Manual publishing panel | No checklist completion controls. | No checklist audit implementation. | Publish/schedule/spend/connect blocked by absent controls. | Checklist must not publish or connect accounts. | needs clarification |
| `NUS-EVIDENCE-001` | label-only | Manual publishing panel | No evidence submit/review controls. | No evidence audit implementation. | Evidence validation/review behavior remains future. | Evidence does not authorize publishing; AI evidence actions blocked. | needs clarification |
| `NUS-PERFORMANCE-001` | label-only | Manual publishing panel | No manual metric entry controls. | No manual performance audit implementation. | Analytics/attribution block remains future. | User-entered only; no ingestion or attribution. | needs clarification |
| `NUS-PERMISSIONS-001` | label-only | Permissions and NO-GO panel | Exact permission codes unresolved; no protected controls. | No permission denial audit implementation. | Protected-action ErrorModel remains future. | Viewer/editor/AI bypass must fail. | no |
| `NUS-TENANT-001` | label-only | Permissions and NO-GO panel | Route/context workspace authority remains required. | No tenant denial audit implementation. | Cross-workspace ErrorModel remains future. | Body `workspace_id` distrust and cross-workspace denial. | no |
| `NUS-ERRORS-001` | label-only | Permissions and NO-GO panel | No protected controls. | No denial audit implementation. | ErrorModel/idempotency matrix unresolved. | Forbidden actions and retries must not duplicate side effects. | no |
| `NUS-NOGO-001` | yes | Permissions and NO-GO panel | No NO-GO controls. | No NO-GO audit implementation. | Forbidden/NO-GO ErrorModel remains future. | Publishing, OAuth, scheduling, paid, payment, analytics, attribution, integrations, autonomous AI, and Post-V1 remain blocked. | no |
