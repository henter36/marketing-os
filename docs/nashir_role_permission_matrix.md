# Nashir Role & Permission Matrix

## 1. Purpose

This document is documentation-only.

It defines planning-level role and permission semantics for Nashir Core V1 so future ERD, OpenAPI, SQL, QA, Threat Model, and implementation work can be scoped consistently.

This document does not approve implementation.

This document does not modify ERD, OpenAPI, SQL, QA, runtime, generated clients, tests, packages, or workflows.

This document only defines planning-level role and permission semantics.

Existing ERD and OpenAPI remain authoritative until separately patched and approved.

Approval is human and requires an authorized actor.

Evidence acceptance and invalidation require authorized actors.

AI must not approve, reject, accept evidence, invalidate evidence, publish, schedule, spend, or change protected fields.

Core V1 remains manual/export/review/approval/evidence only.

Direct publishing, social OAuth, scheduling, paid ads, payment, analytics ingestion, attribution, external integrations, autonomous AI execution, and Post V1 module implementation remain NO-GO.

Any future ERD/OpenAPI/SQL/QA/Threat Model work must be separately approved with explicit allowed files, forbidden files, and verification gates.

## 2. Scope

This matrix covers conceptual workspace roles, permission boundaries, protected actions, approval authority, evidence authority, manual performance review permissions, audit expectations, and NO-GO role boundaries for Nashir Core V1.

It applies only to manual/export/review/approval/evidence workflows and only as a planning contract for later review.

## 3. Non-goals

This document does not:

- approve runtime authorization logic;
- create ERD entities, fields, SQL migrations, OpenAPI schemas, endpoints, generated clients, QA tests, or implementation tasks;
- replace approved repository guards, workspace context, membership checks, permission checks, or ErrorModel behavior;
- approve direct publishing, social OAuth, scheduling, paid execution, payment, analytics ingestion, attribution, external integrations, or autonomous AI execution;
- authorize Pilot or Production readiness;
- define final commercial, finance, integration, or Post V1 permissions.

## 4. Sources inspected

- `AGENTS.md`
- `README.md`
- `docs/17_change_log.md`
- `docs/03_decision_log.md`
- `docs/02_v1_scope.md`
- `docs/04_backlog.md`
- `docs/nashir_dual_path_customer_journey_and_campaign_flow.md`
- `docs/nashir_journey_traceability_and_contract_impact_review.md`
- `docs/nashir_prd_backlog_reconciliation.md`
- `docs/nashir_erd_openapi_qa_threat_model_impact_review.md`
- `docs/nashir_campaign_readiness_scoring_contract.md`
- `docs/nashir_approval_state_machine_contract.md`
- `docs/nashir_manual_publishing_evidence_contract.md`

## 5. Current repository authority summary

Marketing OS remains a contract-first Phase 0/1 execution repository. It is not approved for Pilot or Production.

`docs/02_v1_scope.md` defines Nashir Core V1 as manual/export/review/approval/evidence only and does not approve implementation by itself.

`docs/04_backlog.md` documents Nashir backlog planning boundaries only. It does not create sprint-ready implementation tasks.

`docs/nashir_erd_openapi_qa_threat_model_impact_review.md` identifies impact areas only. Existing ERD and OpenAPI remain authoritative until separately patched and approved.

`docs/nashir_campaign_readiness_scoring_contract.md` keeps readiness separate from approval and publishing authorization.

`docs/nashir_approval_state_machine_contract.md` keeps approval human-only, version-bound, and separate from publishing authorization.

`docs/nashir_manual_publishing_evidence_contract.md` keeps evidence user-provided, external to publishing execution, and separate from analytics ingestion, attribution, or paid performance.

Direct publishing, social OAuth, scheduling, paid ads, payment, analytics ingestion, attribution, external integrations, autonomous AI execution, and Post V1 module implementation remain NO-GO.

## 6. Relationship to prior Nashir documents

### Nashir journey document

`docs/nashir_dual_path_customer_journey_and_campaign_flow.md` introduced the customer-facing readiness, intake, campaign, approval, checklist, evidence, and manual review journey. This matrix defines planning-level actor boundaries for those concepts.

### Nashir traceability review

`docs/nashir_journey_traceability_and_contract_impact_review.md` identified role, membership, permission, approval, and evidence authority as areas that must preserve current guardrails before implementation.

### Nashir PRD/backlog reconciliation

`docs/nashir_prd_backlog_reconciliation.md` identified the Role & Permission Matrix as a required follow-up before any role-sensitive implementation.

### Nashir Core V1 scope patch

`docs/02_v1_scope.md` limits Nashir Core V1 to manual/export/review/approval/evidence and keeps Agent Mode runtime, external integrations, direct publishing, paid execution, analytics ingestion, attribution, and Post V1 modules outside Core V1.

### Nashir backlog planning patch

`docs/04_backlog.md` permits planning references for Nashir manual workflows but does not approve sprint-ready tasks, endpoints, entities, tests, or runtime work.

### Nashir ERD/OpenAPI/QA/Threat Model impact review

`docs/nashir_erd_openapi_qa_threat_model_impact_review.md` identifies future permission, audit, tenant isolation, approval bypass, evidence tampering, and external integration risk areas. This matrix does not approve those changes.

### Nashir Campaign Readiness Scoring Contract

`docs/nashir_campaign_readiness_scoring_contract.md` states that readiness score does not equal approval and does not authorize publishing. This matrix preserves that separation through explicit approval authority.

### Nashir Approval State Machine Contract

`docs/nashir_approval_state_machine_contract.md` requires human approval, approval locks, material-change reapproval, and auditable transitions. This matrix defines planning-level actor candidates for those protected actions.

### Nashir Manual Publishing Evidence Contract

`docs/nashir_manual_publishing_evidence_contract.md` requires accepted evidence to be user-provided, tied to approved content versions, and handled by authorized actors. This matrix defines planning-level evidence submitter and acceptor boundaries.

## 7. Definitions

### Workspace role

A workspace role is a planning-level role assigned within a workspace context. Future implementation must preserve route-derived workspace context and must not trust `workspace_id` from request bodies.

### Permission

A permission is a discrete authorization to view, draft, edit, submit, approve, reject, accept evidence, invalidate evidence, or perform another controlled action.

### Actor

An actor is the human user or system source associated with an action. Protected Core V1 actions require a human actor.

### Owner

Owner is the highest baseline workspace role candidate. Owners may be candidates for workspace management and protected actions depending on future approved policy.

### Admin

Admin is a baseline workspace role candidate for workspace operations and protected actions depending on future approved policy.

### Editor

Editor is a baseline workspace role candidate for intake, drafting, editing, generation preparation, review submission, checklist preparation, and evidence submission depending on future approved policy.

### Viewer

Viewer is a baseline workspace role candidate for read-only access. Viewers must not create, edit, approve, reject, submit evidence, accept evidence, invalidate evidence, publish, schedule, or spend.

### Reviewer

Reviewer is an optional conceptual role overlay for human review, request changes, approve, or reject actions depending on future approved policy.

### Evidence submitter

Evidence submitter is a conceptual authority to submit user-provided manual publishing evidence.

### Evidence acceptor

Evidence acceptor is a conceptual authority to accept, request correction for, supersede, or invalidate evidence.

### Approval authority

Approval authority is explicit, auditable permission for a human actor to approve or reject reviewed content.

### Protected action

Protected action is an action that changes approval, evidence, policy, publishing boundary, integration, payment, or other sensitive state and requires explicit authority and audit treatment.

### Archive

Archiving is a planning-level status change for content or evidence that removes it from active workflows while preserving its record and audit history for governance purposes.

## 8. Core V1 role principles

1. Permissions are workspace-scoped and must preserve tenant isolation.
2. Protected actions require explicit authority and auditability.
3. Approval is human and requires an authorized actor.
4. Evidence acceptance and invalidation require authorized actors.
5. View permission must not imply edit, approval, evidence, or performance-review edit permission.
6. Editors may draft and edit depending on future policy but must not approve unless explicitly granted reviewer authority.
7. Readiness score must not grant permissions.
8. AI suggestions must not grant permissions or perform protected actions.
9. No Core V1 role may directly publish, schedule, spend, pay, ingest analytics, attribute results, connect external accounts, or run autonomous AI execution.
10. AuthGuard, WorkspaceContextGuard, MembershipCheck, PermissionGuard, and ErrorModel behavior must remain intact unless later approved contracts explicitly change them.

## 9. Permission types

| Permission type | Planning meaning | Boundary |
|---|---|---|
| View permission | Read allowed workspace, campaign, content, evidence, readiness, audit, or performance review information. | Does not imply mutation authority. |
| Draft permission | Create initial intake, campaign, brief, or content draft records where future implementation is approved. | Does not imply approval or evidence acceptance. |
| Edit permission | Modify draft or generated reviewable material where future implementation is approved. | Material edits after approval require reapproval semantics. |
| Submit for review permission | Move reviewable content toward human review. | Does not approve content. |
| Approve/reject permission | Human-only authority to approve, reject, or request changes. | Must be explicit, auditable, and version-bound. |
| Evidence submit permission | Submit user-provided proof of external manual publishing. | Does not accept evidence or authorize publishing. |
| Evidence accept/invalidate permission | Accept, mark correction, supersede, or invalidate evidence. | Must be explicit and auditable. |
| Performance review permission | View or enter user-provided manual performance observations. | Does not ingest analytics or create attribution. |
| Integration/admin permission | Manage external integrations or commercial capabilities. | Post V1 only or NO-GO in Core V1. |

## 10. Baseline roles

| Role | Planning description |
|---|---|
| `owner` | Highest baseline workspace role candidate; may manage members, settings, audit access, and protected actions depending on future policy. |
| `admin` | Operational management role candidate; may manage workspace operations and selected protected actions depending on future policy. |
| `editor` | Campaign preparation role candidate; may draft, edit, submit for review, prepare checklist, and submit evidence depending on future policy. |
| `viewer` | Read-only role candidate; must not mutate, approve, reject, submit evidence, accept evidence, invalidate evidence, publish, schedule, or spend. |

## 11. Optional conceptual role overlays

| Overlay | Planning status | Boundary |
|---|---|---|
| `reviewer` | Optional Core V1 overlay candidate. | May approve, reject, request changes, or clear review blocks only if future policy explicitly grants authority. |
| `evidence_reviewer` | Optional Core V1 overlay candidate. | May accept, request correction, supersede, or invalidate evidence only if future policy explicitly grants authority. |
| `finance_admin` | Post V1 only. | Must not initiate payment, billing, paid execution, or spend in Core V1. |
| `integration_admin` | Post V1 only. | Must not connect external accounts, social OAuth, publishing connectors, analytics connectors, or attribution connectors in Core V1. |

## 12. Role capability matrix

The following matrix is planning-only. Candidate permissions require future approved ERD, OpenAPI, SQL, QA, Threat Model, and implementation work before they can be implemented.

| Capability | Owner | Admin | Editor | Viewer | Future reviewer/evidence reviewer | Audit required | Notes |
|---|---|---|---|---|---|---|---|
| workspace setup | Candidate | Candidate | No unless future policy allows | View only if allowed | No | Yes | Workspace authorization must remain route-derived. |
| invite/manage members | Candidate | Candidate | No | No | No | Yes | Requires future approved membership policy. |
| view readiness dashboard | Candidate | Candidate | Candidate | Candidate | Candidate | No, unless sensitive data is exposed | Readiness is advisory only. |
| complete Smart Wizard intake | Candidate | Candidate | Candidate | No | No | Yes if saved | Manual structured intake only. |
| create campaign draft | Candidate | Candidate | Candidate | No | No | Yes | User-provided data only. |
| edit campaign draft | Candidate | Candidate | Candidate | No | No | Yes | Material changes after approval trigger approval contract rules. |
| generate draft content | Candidate | Candidate | Candidate | No | No | Yes | Generation creates reviewable material only. |
| edit generated draft content | Candidate | Candidate | Candidate | No | No | Yes | Protected fields must not be overwritten by AI. |
| submit content for review | Candidate | Candidate | Candidate | No | Candidate if future policy allows | Yes | Submission does not approve. |
| request changes | Candidate if reviewer-authorized | Candidate if reviewer-authorized | No unless reviewer-authorized | No | Candidate | Yes | Human review action. |
| approve content | Candidate if approval-authorized | Candidate if approval-authorized | No unless reviewer-authorized | No | Candidate | Yes | Human-only, version-bound protected action. |
| reject content | Candidate if approval-authorized | Candidate if approval-authorized | No unless reviewer-authorized | No | Candidate | Yes | Human-only protected action. |
| trigger requires_reapproval | Candidate | Candidate | Candidate when editing approved material | No | Candidate | Yes | Material changes require a new review cycle. |
| archive content | Candidate | Candidate | Candidate if policy allows | No | Candidate if policy allows | Yes | Must not erase audit history. |
| prepare manual publishing checklist | Candidate | Candidate | Candidate | No | No | Yes if persisted | Checklist does not publish. |
| submit manual publishing evidence | Candidate | Candidate | Candidate if policy allows | No | Candidate if evidence policy allows | Yes | Evidence is user-provided proof only. |
| accept manual publishing evidence | Candidate if evidence-authorized | Candidate if evidence-authorized | No unless evidence-authorized | No | Candidate | Yes | Human-only evidence acceptance. |
| mark evidence needs_correction | Candidate if evidence-authorized | Candidate if evidence-authorized | No unless evidence-authorized | No | Candidate | Yes | Does not publish or validate analytics. |
| supersede evidence | Candidate if evidence-authorized | Candidate if evidence-authorized | No unless evidence-authorized | No | Candidate | Yes | Prior evidence remains auditable. |
| invalidate evidence | Candidate if evidence-authorized | Candidate if evidence-authorized | No unless evidence-authorized | No | Candidate | Yes | Elevated protected action. |
| archive evidence | Candidate | Candidate | Candidate if policy allows | No | Candidate | Yes | Must preserve audit trail where future implementation permits. |
| enter manual performance review | Candidate | Candidate | Candidate if policy allows | No | No | Yes | User-entered data only. |
| view manual performance review | Candidate | Candidate | Candidate | No | Candidate | No, unless sensitive data is exposed | Not analytics ingestion or attribution. |
| export/copy approved content | Candidate | Candidate | Candidate if policy allows | No | Candidate if policy allows | Yes if persisted | Copy/export only; no direct publishing. |
| access audit trail | Candidate | Candidate if policy allows | No unless policy allows scoped audit | No unless policy allows scoped read | Candidate if policy allows | Yes | Audit access may expose sensitive governance data. |

## 13. Required Core V1 permission rules

- Viewers must not create, edit, approve, submit evidence, accept evidence, invalidate evidence, or publish.
- Editors may draft and edit depending on future policy but must not approve unless explicitly granted reviewer authority.
- Admins/owners may manage workspace-level settings depending on future policy.
- Approval authority must be explicit and auditable.
- Evidence acceptance/invalidation authority must be explicit and auditable.
- No role may perform direct publishing, paid execution, payment, analytics ingestion, attribution, or autonomous AI execution in Core V1.
- No role may use social OAuth, scheduling, external integrations, or Post V1 module implementation in Core V1.

## 14. Approval permission rules

- Approval is human-only.
- Approval requires an authorized actor.
- Approval actor must be recorded.
- Approval must bind to content version.
- Approval must not be performed by AI.
- Approval must not be bypassed by readiness score.
- Approval does not authorize direct publishing, paid execution, payment, analytics ingestion, attribution, external integrations, or autonomous AI execution.

## 15. Evidence permission rules

- Evidence submission may be allowed for authorized editors/admins depending on future policy.
- Evidence acceptance must require reviewer/admin/owner authority depending on future policy.
- Invalidation must require elevated authority.
- Supersede must preserve prior evidence and audit trail.
- Evidence must not imply publishing authorization.
- Evidence acceptance does not prove analytics, attribution, paid performance, or platform state.

## 16. Manual performance review permission rules

- Manual performance data remains user-entered.
- View and edit permissions must be separate.
- Performance data must not be treated as analytics ingestion.
- Performance review must not create attribution decisions.
- Performance review must not authorize paid execution, budget spend, payment, or campaign optimization automation.

## 17. Protected actions

Protected actions include:

- approve content;
- reject content;
- accept evidence;
- invalidate evidence;
- supersede evidence;
- change approval policy;
- change forbidden claims;
- change publishing permissions;
- connect external accounts, Post V1 only;
- initiate direct publishing, NO-GO;
- initiate paid execution, NO-GO;
- initiate payment, NO-GO.

## 18. AI permission boundaries

- AI may draft, summarize, flag, and suggest.
- AI must not approve.
- AI must not reject.
- AI must not accept or invalidate evidence.
- AI must not publish.
- AI must not schedule.
- AI must not spend.
- AI must not change protected fields.
- AI confidence must not replace human approval, evidence authority, or permission checks.

## 19. External integration and Post V1 role boundaries

- Social OAuth remains NO-GO in Core V1.
- Direct publishing remains NO-GO in Core V1.
- Scheduling remains NO-GO in Core V1.
- Paid ads remain NO-GO in Core V1.
- Payment remains NO-GO in Core V1.
- Analytics ingestion and attribution remain NO-GO in Core V1.
- External integrations remain NO-GO in Core V1.
- Post V1 module implementation remains NO-GO in Core V1.

## 20. Conceptual permission matrix table

| Capability | Owner | Admin | Editor | Viewer | Future reviewer/evidence reviewer | Audit required | Notes |
|---|---|---|---|---|---|---|---|
| View workspace/campaign/readiness data | Candidate | Candidate | Candidate | Candidate | Candidate | No by default | Tenant isolation still required. |
| Draft and edit intake/campaign/content | Candidate | Candidate | Candidate | No | No unless separately granted | Yes | Drafting does not approve. |
| Submit content for review | Candidate | Candidate | Candidate | No | Candidate if policy allows | Yes | Starts or continues human review workflow. |
| Approve/reject/request changes | Candidate with authority | Candidate with authority | No unless reviewer-authorized | No | Candidate | Yes | Human-only protected action. |
| Prepare manual checklist | Candidate | Candidate | Candidate | No | No | Yes if persisted | Checklist does not publish. |
| Submit manual evidence | Candidate | Candidate | Candidate if policy allows | No | Candidate if policy allows | Yes | User-provided evidence only. |
| Accept/correct/supersede/invalidate evidence | Candidate with authority | Candidate with authority | No unless evidence-authorized | No | Candidate | Yes | Evidence authority must be explicit. |
| Enter manual performance review | Candidate | Candidate | Candidate if policy allows | No | No | Yes | User-entered data only. |
| View audit trail | Candidate | Candidate if policy allows | Scoped view only if policy allows | No unless policy allows | Candidate if policy allows | Yes | Audit access is sensitive. |
| Manage integrations/payments/paid execution | No in Core V1 | No in Core V1 | No | No | No | Not applicable | Post V1 or NO-GO only. |

## 21. Conceptual protected-action table

| Action | Allowed role candidate | Requires human action | AI allowed? | Audit required | Core V1 status | Notes |
|---|---|---|---|---|---|---|
| Approve content | Owner/admin/reviewer with explicit approval authority | Yes | No | Yes | Planning-only candidate | Must bind to content version. |
| Reject content | Owner/admin/reviewer with explicit approval authority | Yes | No | Yes | Planning-only candidate | Must record actor and reason. |
| Request changes | Owner/admin/reviewer with explicit review authority | Yes | No | Yes | Planning-only candidate | Does not approve. |
| Trigger requires_reapproval | Authorized editor/admin/owner or reviewer depending on policy | Yes | AI may flag only | Yes | Planning-only candidate | Material edits require review cycle. |
| Accept evidence | Owner/admin/evidence reviewer with explicit authority | Yes | No | Yes | Planning-only candidate | Evidence is user-provided proof only. |
| Mark evidence needs_correction | Owner/admin/evidence reviewer with explicit authority | Yes | AI may flag missing fields only | Yes | Planning-only candidate | Does not invalidate by itself. |
| Supersede evidence | Owner/admin/evidence reviewer with explicit authority | Yes | No | Yes | Planning-only candidate | Prior evidence remains auditable. |
| Invalidate evidence | Owner/admin/evidence reviewer with elevated authority | Yes | No | Yes | Planning-only candidate | Requires reason. |
| Change approval policy | Owner/admin candidate only | Yes | No | Yes | Future contract required | Not implemented by this document. |
| Change forbidden claims | Owner/admin candidate only | Yes | No | Yes | Future contract required | Requires policy and QA definition. |
| Change publishing permissions | Owner/admin candidate only | Yes | No | Yes | Future contract required | Must not enable direct publishing in Core V1. |
| Connect external accounts | Integration admin, Post V1 only | Yes | No | Yes | NO-GO in Core V1 | Social OAuth and integrations remain NO-GO. |
| Initiate direct publishing | None | Not allowed | No | Not applicable | NO-GO | Forbidden in Core V1. |
| Initiate paid execution | None | Not allowed | No | Not applicable | NO-GO | Forbidden in Core V1. |
| Initiate payment | None | Not allowed | No | Not applicable | NO-GO | Forbidden in Core V1. |

## 22. Example permission scenarios

### Viewer attempts to approve content

The action must be denied. Viewer is read-only and has no approval authority.

### Editor submits content for review

The action may be allowed if future policy grants submit permission. It must not approve content.

### Admin approves content

The action may be allowed only if the admin has explicit approval authority. The approval must be human, auditable, and bound to the reviewed content version.

### Editor submits manual evidence

The action may be allowed if future policy grants evidence submit permission. Submission does not accept evidence and does not authorize publishing.

### Viewer attempts to submit evidence

The action must be denied. Viewer must not submit evidence.

### Evidence reviewer invalidates wrong evidence

The action may be allowed only with explicit evidence authority and must record reason, actor, timestamp, workspace, campaign, content version, and evidence record.

### AI suggests approval but cannot approve

AI may suggest that content appears ready for review, but AI must not approve, reject, bypass review, or change protected fields.

### Owner views audit trail

The action may be allowed depending on future policy. Audit access remains sensitive and workspace-scoped.

## 23. Audit requirements

Future implementation, if separately approved, must evaluate audit capture for:

- actor;
- role at time of action;
- workspace;
- campaign;
- content version;
- evidence record, if applicable;
- action;
- state before;
- state after;
- timestamp;
- reason;
- source action.

Audit requirements must preserve tenant isolation and must not trust body-provided workspace identifiers.

## 24. Future ERD impact candidates

Future ERD review may need to evaluate:

- role and permission mapping to existing `WorkspaceMember`, `Role`, and `Permission` concepts;
- explicit approval authority, reviewer overlays, and evidence reviewer overlays;
- actor role snapshot at time of protected action;
- audit records for approval, evidence, policy, checklist, export, and manual performance actions;
- evidence authority fields if existing concepts are insufficient.

These are impact candidates only. No ERD change is approved by this document.

## 25. Future OpenAPI impact candidates

Future OpenAPI review may need to evaluate:

- permission checks and response shapes for role-sensitive Nashir workflow actions;
- explicit error behavior for unauthorized approval, evidence, audit, and protected actions;
- role/permission read surfaces for workspace users if already within approved scope;
- audit-facing response governance for protected actions.

These are endpoint and schema candidates only. No OpenAPI change is approved by this document.

## 26. Future QA impact candidates

Future QA planning may need to cover:

- viewer denial for create, edit, approve, evidence, and protected actions;
- editor draft/edit permissions without implicit approval authority;
- explicit reviewer approval and rejection authorization;
- evidence submit versus evidence accept/invalidate separation;
- role snapshot and audit assertions for protected actions;
- tenant isolation and route-derived workspace context;
- negative tests for direct publishing, social OAuth, scheduling, paid ads, payment, analytics ingestion, attribution, external integrations, autonomous AI execution, and Post V1 module implementation.

No QA test is approved by this document.

## 27. Future Threat Model impact candidates

Future threat-model review must evaluate:

- tenant isolation and cross-workspace role confusion;
- unauthorized approval or evidence acceptance;
- viewer-to-editor privilege escalation;
- editor self-approval if future policy forbids it;
- evidence tampering or false proof;
- audit trail manipulation;
- AI suggestion misuse as implied authorization;
- external integration privilege expansion;
- payment, paid execution, analytics ingestion, and attribution risks if future Post V1 work is proposed.

No Threat Model update is approved by this document.

## 28. Required future contracts before implementation

Before any implementation, the following must be separately approved where applicable:

- ERD Patch;
- OpenAPI Patch;
- SQL Migration Plan;
- QA/Test Case Plan;
- Threat Model Update;
- Approval State Machine Contract alignment;
- Manual Publishing Evidence Contract alignment;
- AI Service Layer Specification;
- AI Logging & Privacy Policy.

Each future request must include explicit allowed files, forbidden files, and verification gates.

## 29. Recommended sequencing

1. Review and approve this documentation-only Role & Permission Matrix.
2. Reconcile it with the Approval State Machine Contract and Manual Publishing Evidence Contract.
3. Draft ERD/OpenAPI impact patches only after explicit approval.
4. Draft SQL Migration Plan, QA/Test Case Plan, and Threat Model Update only after explicit approval.
5. Consider implementation only after all required contracts are approved and a separate implementation request defines allowed files, forbidden files, and verification gates.

## 30. GO / NO-GO decision

GO: Use this document as planning-level role and permission semantics for Nashir Core V1 discussions.

NO-GO: Do not implement role logic, permission checks, ERD changes, OpenAPI changes, SQL migrations, QA tests, runtime behavior, generated clients, package changes, workflow changes, direct publishing, social OAuth, scheduling, paid ads, payment, analytics ingestion, attribution, external integrations, autonomous AI execution, or Post V1 module implementation from this document.

## 31. Safe files to edit later if approved

Future documentation-only or contract work may explicitly approve edits to:

- `docs/nashir_role_permission_matrix.md`
- `docs/03_decision_log.md`
- `docs/17_change_log.md`
- a future ERD patch document;
- a future OpenAPI patch document;
- a future SQL Migration Plan;
- a future QA/Test Case Plan;
- a future Threat Model Update;
- future AI governance documents.

These files are safe only when a later request explicitly lists them as allowed.

## 32. Files that must remain forbidden

Unless a future request explicitly approves them with separate scope and verification gates, the following remain forbidden:

- `docs/06_erd.md`
- `docs/08_api_spec.md`
- SQL files
- OpenAPI files
- generated clients
- `src/`
- `tests/`
- `test/`
- `package.json`
- lockfiles
- `.github/workflows/`
- `scripts/`
- `migrations/`
- `prototype/`
- frontend assets
- runtime router/store files
- any implementation file
- any ERD/OpenAPI/SQL/QA contract file unless explicitly listed as approved
