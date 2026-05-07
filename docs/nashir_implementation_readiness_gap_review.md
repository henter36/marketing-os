# Nashir Implementation Readiness Gap Review

| Field | Value |
|---|---|
| Document type | Documentation-only readiness gap review |
| Status | Draft — Pending Review |
| Scope | Nashir Core V1 only |
| Implementation status | Not implementation-ready |
| Change type | Documentation-only |

## 1. Purpose

This document is documentation-only.

It identifies what remains unresolved before Nashir Core V1 can enter an implementation planning gate.

It does not approve implementation.

No ERD, OpenAPI, SQL, QA/test files, runtime, generated clients, packages, workflows, migrations, frontend assets, router/store files, or implementation files are modified by this review.

Existing ERD and OpenAPI remain authoritative. Option A reuse-only remains current direction.

## 2. Sources inspected

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

No blocking source conflict was found for this documentation-only readiness gap review.

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

Implementation Gate is not ready.

## 4. Current Authority Snapshot

| Area | Current documented state | Current authority boundary |
|---|---|---|
| Scope | `docs/02_v1_scope.md` limits Nashir Core V1 to manual/export/review/approval/evidence. | Scope does not approve implementation by itself. |
| Backlog | `docs/04_backlog.md` records Nashir backlog planning boundaries. | No sprint-ready implementation tasks are created. |
| Acceptance Criteria | `docs/nashir_acceptance_criteria.md` defines planning-level AC IDs, future QA placeholders, and Future User Story IDs. | Acceptance criteria do not approve implementation or tests. |
| User Stories | `docs/nashir_user_stories.md` maps Future User Story IDs to personas, capabilities, AC IDs, future QA IDs, reuse surfaces, and NO-GO guards. | User Story IDs are planning identifiers only. |
| QA/Test Planning | `docs/nashir_qa_test_planning.md` defines planning-level QA categories and future QA IDs. | No QA/test implementation is approved. |
| Threat Model | `docs/nashir_threat_model_update.md` identifies tenant, authorization, approval, evidence, AI, audit, and NO-GO bypass threats. | Runtime controls are not approved. |
| Role/Permission Matrix | `docs/nashir_role_permission_matrix.md` defines conceptual roles and protected-action boundaries. | Exact permission codes remain unresolved. |
| ERD Option A reuse-only | ERD planning and proposal documents keep Nashir on existing approved entities only. | No ERD, SQL, field, enum, relationship, or migration change is approved. |
| OpenAPI Option A reuse-only | OpenAPI planning and proposal documents recommend existing path/schema reuse only. | No OpenAPI patch or generated client update is approved. |
| Approval State Machine | `docs/nashir_approval_state_machine_contract.md` defines planning-level human approval, approval lock, and reapproval semantics. | Runtime state handling and exact error/audit mapping remain unresolved. |
| Manual Publishing Evidence Contract | `docs/nashir_manual_publishing_evidence_contract.md` defines planning-level evidence fields, statuses, transitions, and integrity risks. | Exact implementation mapping remains unresolved. |
| Campaign Readiness Scoring Contract | `docs/nashir_campaign_readiness_scoring_contract.md` defines planning-level readiness scoring semantics. | Runtime scoring logic and UI display behavior are not approved. |

## 5. Readiness Gap Matrix

Note: Where the matrix references mapping documents, these references are intended as sections within the Nashir UI / Route / Permission / Audit / ErrorModel Mapping Document unless a later approved gate explicitly splits them into separate documents.

| Area | Current documented state | Missing implementation detail | Risk if unresolved | Required decision before implementation | Blocking level | Recommended next document or gate |
|---|---|---|---|---|---|---|
| UI behavior | Scope, AC, and stories describe user-facing concepts. | Exact screens, controls, states, copy boundaries, disabled states, warnings, and no-authority wording. | UI may imply approval, publishing, attribution, or automation. | Approve a UI behavior map for each story. | Blocker | Nashir UI / Route / Permission / Audit / ErrorModel Mapping Document — UI behavior section. |
| route/component mapping | OpenAPI reuse is planned, but no UI route/component map exists. | Exact route names, component ownership, data-loading boundaries, and read/write surfaces. | Frontend may invent endpoints or touch forbidden runtime surfaces. | Approve route/component mapping before code. | Blocker | Nashir UI / Route / Permission / Audit / ErrorModel Mapping Document — route/component section. |
| permission codes | Role Matrix defines conceptual permissions. | Exact permission code names and protected-action mapping. | Unauthorized approval/evidence/action bypass. | Approve permission-code matrix tied to current RBAC. | Blocker | Nashir UI / Route / Permission / Audit / ErrorModel Mapping Document — permission/audit section. |
| QA case IDs | Future QA placeholders exist. | Final QA case definitions, automated/manual split, and file ownership. | Implementation cannot be verified. | Approve QA cases and test scope. | Blocker | Nashir QA case specification. |
| error states | ErrorModel must be preserved. | Exact error codes/responses for invalid transitions, missing permissions, invalid evidence, and NO-GO attempts. | Inconsistent failure behavior or guard weakening. | Approve ErrorModel mapping. | Blocker | Nashir UI / Route / Permission / Audit / ErrorModel Mapping Document — ErrorModel/idempotency section. |
| idempotency expectations | Existing OpenAPI idempotency must be preserved where declared. | Which future operations touch idempotent surfaces and retry outcomes. | Duplicate publish jobs, media jobs, usage records, or inconsistent side effects. | Approve idempotency matrix. | Blocker | Nashir UI / Route / Permission / Audit / ErrorModel Mapping Document — ErrorModel/idempotency section. |
| audit event names | Auditability is required for sensitive actions. | Exact audit event names, actor, reason, before/after, and entity references. | Protected actions become unauditable. | Approve audit event catalog. | Blocker | Nashir UI / Route / Permission / Audit / ErrorModel Mapping Document — permission/audit section. |
| readiness score display behavior | Scoring contract defines levels/gates as planning-only. | Exact display states, score visibility, warning wording, and blocked behavior. | Readiness may be treated as approval or publishing authorization. | Approve display rules and labels. | Blocker | Nashir UI / Route / Permission / Audit / ErrorModel Mapping Document — UI behavior section. |
| approval state display behavior | Approval states and transitions are planning-level. | Exact UI state labels, allowed actions, disabled actions, and reviewer views. | Users may bypass review or misread state. | Approve approval state UI map. | High | Nashir UI / Route / Permission / Audit / ErrorModel Mapping Document — UI behavior section. |
| reapproval trigger behavior | Material-change examples exist. | Exact material/non-material field list and reapproval trigger handling. | Approved content may be silently changed. | Approve material-change policy. | Blocker | Nashir UI / Route / Permission / Audit / ErrorModel Mapping Document — approval/reapproval section. |
| manual publishing checklist behavior | Checklist is planning-level and likely UI-derived. | UI-only vs persisted decision, checklist items, completion semantics, relation to evidence, and missing OpenAPI path for SetupChecklistItem reuse. | Checklist may be mistaken for publishing execution. | Approve checklist behavior and persistence decision. | High | Nashir UI / Route / Permission / Audit / ErrorModel Mapping Document — manual publishing checklist section. |
| manual publishing evidence behavior | Evidence fields/statuses/transitions are planning-level. | Exact request/response reuse, acceptance/correction/invalidation rules, and attachment handling if any. | Evidence tampering or evidence-as-authorization. | Approve evidence implementation mapping. | High | Nashir UI / Route / Permission / Audit / ErrorModel Mapping Document — manual publishing evidence section. |
| UTM Lite behavior | TrackedLink reuse is planned. | Exact UTM fields, validation, display, mismatch handling, and evidence relationship. | UTM Lite may become analytics ingestion or attribution. | Approve UTM Lite field/wording mapping. | High | Nashir UI / Route / Permission / Audit / ErrorModel Mapping Document — UTM Lite section. |
| manual performance review behavior | User-entered review only is documented. | Exact user-entered metrics, snapshot wording, edit/lock behavior, and report surface. | Manual observations may be treated as analytics or attribution. | Approve manual performance review semantics. | High | Nashir UI / Route / Permission / Audit / ErrorModel Mapping Document — manual performance review section. |
| tenant isolation checks | Threat model and QA plan require route/context workspace authority. | Exact workspace-scoped query checklist and cross-workspace test plan. | Cross-tenant data leakage. | Approve tenant isolation verification plan. | Blocker | Nashir UI / Route / Permission / Audit / ErrorModel Mapping Document — tenant isolation section. |
| role/permission enforcement expectations | Conceptual roles and boundaries exist. | Exact guard expectations per route/component/action and actor. | Viewer/editor/AI protected-action bypass. | Approve enforcement matrix. | Blocker | Nashir UI / Route / Permission / Audit / ErrorModel Mapping Document — permission/audit section. |
| AI advisory boundaries | AI assistant is advisory-only. | Exact UI labels, data provenance, protected-field locks, and denied actions. | AI may be treated as actor with authority. | Approve AI advisory boundary map. | Blocker | Nashir UI / Route / Permission / Audit / ErrorModel Mapping Document — AI advisory boundaries section. |
| NO-GO negative tests | QA planning names negative areas. | Exact negative test cases and review gates for each NO-GO item. | Scope creep into publishing, integrations, paid, analytics, attribution, or autonomous AI. | Approve NO-GO negative test matrix. | Blocker | Nashir UI / Route / Permission / Audit / ErrorModel Mapping Document — NO-GO negative behavior section. |
| allowed files for first implementation slice | No implementation slice is approved. | Exact allowed files and ownership. | Overbroad edits or forbidden file changes. | Approve implementation gate with file list. | Blocker | Future implementation gate only. |
| forbidden files for first implementation slice | Global forbidden categories are known. | Slice-specific forbidden file list. | Runtime, SQL, OpenAPI, test, package, workflow, or migration drift. | Approve implementation gate with forbidden list. | Blocker | Future implementation gate only. |
| verification commands | No implementation verification commands are approved. | Exact lint/test/doc checks and CI commands. | Work cannot be fully verified. | Approve verification commands. | Blocker | Future implementation gate only. |
| CI gates | Current CI exists for baseline repo, but no Nashir slice CI is approved. | Expected CI gate list and required pass criteria. | Incomplete merge confidence. | Approve expected CI gates. | Blocker | Future implementation gate only. |
| rollback/no-go criteria | NO-GO boundaries exist. | Slice-specific rollback criteria and stop conditions. | Unsafe continuation after guardrail failure. | Approve rollback/no-go criteria. | Blocker | Future implementation gate only. |

## 6. User Story Readiness Review

No story is marked ready for implementation. "Needs clarification" means the story has enough planning traceability to continue documentation work, but not enough detail to approve code. "Blocked" means the item is a guardrail or cross-cutting requirement that must be settled before any implementation gate.

| User Story ID | Capability | Is acceptance criteria available? | Is QA placeholder available? | Is role mapping available? | Is ERD reuse surface clear? | Is OpenAPI reuse surface clear? | Missing detail before implementation | Readiness status |
|---|---|---|---|---|---|---|---|---|
| `NUS-READINESS-001` | Readiness Dashboard | Yes | Yes | Yes | Mostly clear | Mostly clear | UI display rules, score derivation, blocked/warning states, and no-approval wording. | Needs clarification |
| `NUS-WIZARD-001` | Smart Wizard manual intake | Yes | Yes | Yes | Mostly clear | Mostly clear | Exact wizard steps, confirmation rules, draft/source provenance, and component mapping. | Needs clarification |
| `NUS-OBJECT-001` | Product / Store / Service / Offer intake | Yes | Yes | Yes | Mostly clear | Mostly clear | Exact intake fields, allowed public-link handling, validation, and first-class entity rejection wording. | Needs clarification |
| `NUS-CAMPAIGN-001` | Campaign basics and advertised object flow | Yes | Yes | Yes | Mostly clear | Mostly clear | Exact Campaign/BriefVersion field mapping and lifecycle/status UI behavior. | Needs clarification |
| `NUS-DESTINATION-001` | Landing destination | Yes | Yes | Yes | Mostly clear | Mostly clear | Destination validation, material-change rules, UTM relation, and reapproval trigger mapping. | Needs clarification |
| `NUS-RIGHTS-001` | Creative rights confirmation | Yes | Yes | Yes | Mostly clear | Mostly clear | Exact rights fields, review block behavior, audit events, and permission checks. | Needs clarification |
| `NUS-CONTENT-001` | Idea intake and content requirements | Yes | Yes | Yes | Mostly clear | Mostly clear | Output taxonomy, AI assistant provenance labels, protected-field locks, and review submission behavior. | Needs clarification |
| `NUS-HASHTAGS-001` | Hashtags per selected channel | Yes | Yes | Yes | Mostly clear | Mostly clear | Channel-specific display/edit behavior and no-optimization/no-attribution wording. | Needs clarification |
| `NUS-VIDEO-001` | Video reference scripts | Yes | Yes | Yes | Mostly clear | Mostly clear | Script field placement, draft/reference wording, and video-production denial behavior. | Needs clarification |
| `NUS-UTM-001` | UTM Tracking Lite | Yes | Yes | Yes | Mostly clear | Mostly clear | Exact UTM fields, tracked-link reuse, mismatch correction, and evidence relationship. | Needs clarification |
| `NUS-APPROVAL-001` | Human approval | Yes | Yes | Yes | Mostly clear | Mostly clear | Exact permission codes, state/action UI, ErrorModel mapping, and audit events. | Needs clarification |
| `NUS-REAPPROVAL-001` | Approval lock / reapproval | Yes | Yes | Yes | Mostly clear | Mostly clear | Exact material-change criteria, reapproval triggers, transition display, and audit event names. | Needs clarification |
| `NUS-CHECKLIST-001` | Manual publishing checklist | Yes | Yes | Yes | Partially clear | Not clear | OpenAPI path for SetupChecklistItem reuse is missing; UI-only vs persisted checklist behavior remains undecided; checklist items and non-publishing enforcement need approval. | Needs clarification |
| `NUS-EVIDENCE-001` | Manual publishing evidence | Yes | Yes | Yes | Mostly clear | Mostly clear | Exact evidence status mapping, attachment handling, correction flow, permission codes, and audit events. | Needs clarification |
| `NUS-PERFORMANCE-001` | Manual performance review | Yes | Yes | Yes | Mostly clear | Mostly clear | Exact manual metrics, snapshot semantics, edit/lock behavior, and no-ingestion labels. | Needs clarification |
| `NUS-PERMISSIONS-001` | Role & permission boundaries | Yes | Yes | Yes | Mostly clear | Mostly clear | Exact permission code list, enforcement matrix, and protected-action audit mapping. | Blocked |
| `NUS-TENANT-001` | Tenant isolation and workspace authority | Yes | Yes | Yes | Clear | Clear | Exact workspace-scoped query checklist and cross-workspace verification cases. | Blocked |
| `NUS-ERRORS-001` | ErrorModel and idempotency expectations | Yes | Yes | Yes | Mostly clear | Mostly clear | Exact ErrorModel states, retry behavior, idempotency conflict cases, and operation scope. | Blocked |
| `NUS-NOGO-001` | NO-GO negative boundaries | Yes | Yes | Yes | N/A | N/A | Exact negative tests and review gates for each forbidden category. | Blocked |

## 7. Contract Gap Register

### UI/UX gaps

- Exact screen inventory is missing.
- Exact component, control, disabled-state, warning, and empty-state behavior is missing.
- Readiness, approval, evidence, UTM, and manual performance labels must be written to avoid implying execution authority.

### API contract gaps

- Option A reuse-only is current direction, but exact endpoint-to-story mapping remains planning-level.
- No new OpenAPI paths, schemas, operations, generated clients, or schema clarifications are approved.
- SetupChecklistItem exists in ERD authority but no setup checklist path is currently identified in OpenAPI planning.

### ERD/reuse-surface gaps

- Option A reuse-only is current direction.
- Exact placement for wizard answers, advertised object details, rights confirmation, UTM details, checklist state, and manual performance observations remains unresolved.
- Existing ERD surfaces must be proven insufficient before any future ERD patch is proposed.

### permission gaps

- Exact permission codes are missing.
- Exact role/action matrix for owner, admin, editor, reviewer, evidence reviewer, viewer, and AI assistant denial is missing.
- Protected-action guard expectations are not mapped to routes/components.

### QA planning gaps

- Future QA placeholders exist but executable QA cases do not.
- Negative QA cases for all NO-GO boundaries need exact expected behavior.
- Automated vs manual QA split remains unresolved.

### error/idempotency gaps

- Exact ErrorModel responses for each invalid state and forbidden action are missing.
- Idempotency behavior must be mapped only where existing OpenAPI declares it.
- Retry conflict behavior and duplicate side-effect prevention are not yet specified for a slice.

### auditability gaps

- Audit event names are missing.
- Required actor, timestamp, reason, before/after, entity reference, workspace reference, and content-version reference fields are not mapped.
- Audit sufficiency for reapproval, evidence correction, and NO-GO attempts remains unresolved.

### security/threat model gaps

- Tenant isolation checks need story-by-story route/context mapping.
- Body `workspace_id` distrust must be mapped to each future write/read flow.
- Evidence tampering, approval bypass, AI misuse, and UTM/attribution confusion need implementation-specific controls before code.

### implementation sequencing gaps

- No first implementation slice is approved.
- Allowed files, forbidden files, expected changed files, verification commands, CI gates, rollback criteria, and no-go criteria are missing.
- Implementation Gate remains not ready.

### NO-GO enforcement gaps

- NO-GO boundaries are documented, but exact negative tests and review gates remain unresolved.
- Direct publishing, social OAuth, scheduling, paid ads, payments, analytics ingestion, attribution, external integrations, autonomous AI execution, and Post-V1 module implementation must remain blocked in any future gate.

## 8. Proposed Implementation Gate Inputs

A future implementation gate must include all the following before any code:

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

## 9. Suggested First Implementation Slice — Planning Only

The safest future first implementation slice appears to be a read-only UI route/component mapping slice that displays derived Nashir Core V1 planning state from existing approved surfaces without adding ERD, SQL, OpenAPI, generated client, runtime, package, workflow, migration, or test changes.

This is a recommendation only. It does not approve implementation.

Before that slice can be implemented, a separately approved implementation gate must define exact UI behavior, route/component boundaries, allowed files, forbidden files, expected changed files, verification commands, CI gates, rollback/no-go criteria, permission codes, ErrorModel behavior, audit behavior if any, and NO-GO boundaries.

## 10. NO-GO Enforcement

The following remain explicitly forbidden:

- direct publishing;
- OAuth/social account connection;
- scheduling;
- paid ads;
- payments;
- analytics ingestion;
- attribution;
- external integrations;
- autonomous AI execution;
- Post-V1 module implementation;
- readiness-as-approval;
- evidence-as-authorization.

Any future document or implementation request that attempts one of these items must be treated as NO-GO unless a later approved repository authority explicitly changes the boundary.

## 11. GO / NO-GO Decision

GO:

- documentation-only readiness gap review;
- documentation-only identification of missing implementation gate inputs;
- documentation-only gap grouping for future planning.

NO-GO:

- implementation;
- implementation planning gate today;
- runtime, SQL, OpenAPI, generated clients, tests, packages, workflows, migrations, source, frontend, router/store, or implementation changes;
- Pilot or Production readiness;
- direct publishing, social OAuth, scheduling, paid ads, payment, analytics ingestion, attribution, external integrations, autonomous AI execution, or Post-V1 module implementation.

Implementation Gate remains not ready.

## 12. Recommended Next Step

The readiness gaps are not yet sufficiently bounded for `docs/nashir_implementation_gate_planning.md`.

The recommended next documentation-only step is the Nashir UI / Route / Permission / Audit / ErrorModel Mapping Document that resolves the major Blocker and High gaps without approving implementation:

- exact UI behavior including readiness, approval, and manual publishing states;
- exact route/component mapping;
- exact permission codes and enforcement matrix;
- exact audit event names;
- exact ErrorModel and idempotency responses;
- exact material-change reapproval triggers;
- exact tenant isolation verification steps;
- exact AI advisory boundaries;
- exact manual publishing checklist behavior;
- exact manual publishing evidence behavior;
- exact UTM Lite behavior;
- exact manual performance review behavior;
- exact NO-GO negative behavior;
- exact read-only first-slice boundaries.

After that mapping is reviewed, a later documentation-only `docs/nashir_implementation_gate_planning.md` may be considered if the remaining gaps are bounded enough.

## 13. Safe files to edit later if approved

If separately approved, later documentation-only planning may edit narrowly scoped documentation files such as:

- `docs/nashir_implementation_readiness_gap_review.md`;
- `docs/nashir_user_stories.md`;
- `docs/nashir_acceptance_criteria.md`;
- `docs/nashir_qa_test_planning.md`;
- `docs/03_decision_log.md`;
- `docs/17_change_log.md`;
- Nashir UI / Route / Permission / Audit / ErrorModel Mapping Document;
- future implementation gate planning document.

Any future contract or implementation work requires its own approved allowed files, forbidden files, verification commands, expected CI gates, rollback/no-go criteria, and NO-GO boundaries.

## 14. Files that must remain forbidden

Unless a future request explicitly approves them, these must remain forbidden:

- `src/`;
- `tests/`;
- `test/`;
- SQL files;
- OpenAPI files;
- generated clients;
- packages;
- workflows;
- migrations;
- runtime files;
- router/store files;
- frontend assets;
- any implementation file;
- any ERD/OpenAPI/SQL/runtime contract file unless explicitly listed in an approved future scope.
