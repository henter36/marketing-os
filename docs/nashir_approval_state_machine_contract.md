# Nashir Approval State Machine Contract

## 1. Purpose

This document is documentation-only.

It defines planning-level approval state semantics for Nashir Core V1 so future ERD, OpenAPI, SQL, QA, Threat Model, and implementation work can be scoped consistently.

This document does not approve implementation.

This document does not modify ERD, OpenAPI, SQL, QA, runtime, generated clients, tests, packages, or workflows.

This document only defines planning-level approval state semantics.

Existing ERD and OpenAPI remain authoritative until separately patched and approved.

Approval is human and separate from readiness.

Readiness score does not equal approval.

Approval does not authorize direct publishing.

Approval does not authorize paid execution.

Core V1 remains manual/export/review/approval/evidence only.

Direct publishing, social OAuth, scheduling, paid ads, payment, analytics ingestion, attribution, external integrations, autonomous AI execution, and Post V1 module implementation remain NO-GO.

Any future ERD/OpenAPI/SQL/QA/Threat Model work must be separately approved with explicit allowed files, forbidden files, and verification gates.

## 2. Scope

This contract covers conceptual approval states, transitions, locks, material-change behavior, manual publishing eligibility, audit expectations, and NO-GO boundaries for Nashir Core V1 campaign content.

It applies only to manual/export/review/approval/evidence workflows and only as a planning contract for later review.

## 3. Non-goals

This document does not:

- approve runtime approval logic;
- create ERD entities, fields, SQL migrations, OpenAPI schemas, endpoints, generated clients, QA tests, or implementation tasks;
- replace the approved ERD or OpenAPI authority;
- approve direct publishing, scheduling, paid execution, payment, analytics ingestion, attribution, external integrations, or autonomous AI execution;
- make readiness a substitute for human approval;
- make approval a publishing or spend authorization;
- authorize Pilot or Production readiness.

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

## 5. Current repository authority summary

Marketing OS remains a contract-first Phase 0/1 execution repository. It is not approved for Pilot or Production.

`docs/02_v1_scope.md` defines Nashir Core V1 as manual/export/review/approval/evidence only and does not approve implementation by itself.

`docs/04_backlog.md` documents Nashir backlog planning boundaries only. It does not create sprint-ready implementation tasks.

`docs/nashir_erd_openapi_qa_threat_model_impact_review.md` identifies impact areas only. Existing ERD and OpenAPI remain authoritative until separately patched and approved.

`docs/nashir_campaign_readiness_scoring_contract.md` defines planning-level readiness semantics only. Readiness is advisory and does not approve content or authorize publishing.

Core V1 remains manual/export/review/approval/evidence only.

Direct publishing, social OAuth, scheduling, paid ads, payment, analytics ingestion, attribution, external integrations, autonomous AI execution, and Post V1 module implementation remain NO-GO.

Any future implementation requires separately approved ERD, OpenAPI, SQL, QA, Threat Model, permission, evidence, approval, and AI governance work with explicit allowed files, forbidden files, and verification gates.

## 6. Relationship to Prior Nashir Documents

### Nashir journey document

`docs/nashir_dual_path_customer_journey_and_campaign_flow.md` introduced human approval, approval lock, material-change awareness, manual publishing checklist support, and manual publishing evidence as planning concepts.

### Nashir traceability review

`docs/nashir_journey_traceability_and_contract_impact_review.md` identified rights, policy, approval lock, content versioning, and reapproval behavior as partially aligned with current contracts but requiring a future Approval State Machine Contract.

### Nashir PRD/backlog reconciliation

`docs/nashir_prd_backlog_reconciliation.md` classified human approval as already aligned in principle, approval lock as a Core V1 candidate requiring PRD/backlog patch, and the Approval State Machine Contract as a required follow-up document.

### Nashir Core V1 scope patch

`docs/02_v1_scope.md` limits Nashir Core V1 to manual/export/review/approval/evidence and includes human approval, approval lock, manual publishing checklist, manual publishing evidence, and manual performance review as Core V1 candidates.

### Nashir backlog planning patch

`docs/04_backlog.md` allows planning references for human approval, approval lock, manual publishing checklist, and manual publishing evidence while remaining planning-only and non-implementable by itself.

### Nashir ERD/OpenAPI/QA/Threat Model impact review

`docs/nashir_erd_openapi_qa_threat_model_impact_review.md` identifies future approval lock, reapproval, evidence, QA, and threat-model impact candidates. This document does not approve those changes.

### Nashir Campaign Readiness Scoring Contract

`docs/nashir_campaign_readiness_scoring_contract.md` keeps readiness separate from approval and publishing authorization. This approval contract preserves that separation and defines planning-level approval states independently from readiness scores.

## 7. Definitions

### Approval

Approval is a recorded human decision that a reviewed content version or variant may proceed toward manual publishing support under approved governance.

### Human approval

Human approval means an authorized person has reviewed the content and made the approval decision. AI, readiness scores, generated output, or automated rules must not approve content.

### Approval state

Approval state is the planning-level status of a content item, version, or reviewed variant within the approval lifecycle.

### Approval transition

Approval transition is a movement from one approval state to another after an allowed action and required conditions are satisfied.

### Approval lock

Approval lock means approved content is bound to the reviewed content version and reviewed variant. Material edits after approval must invalidate approval or move the item to `requires_reapproval`.

### Material change

Material change is a change that may affect meaning, offer, claim, channel fit, destination, rights, policy risk, or what a human previously reviewed.

### Requires reapproval

Requires reapproval means previously approved content has changed materially or has new risk and cannot remain eligible for manual publishing support until a new human review cycle approves it.

### Rejection

Rejection is a human decision that content is not acceptable for approval in its reviewed form.

### Changes requested

Changes requested means a reviewer has identified revisions needed before approval can be considered.

### Manual publishing eligibility

Manual publishing eligibility means approved content may proceed to manual checklist preparation or user-operated publishing support where separately approved. It does not authorize direct publishing or paid execution.

## 8. Core V1 Approval Principles

1. Approval is human and separate from readiness.
2. Readiness score does not equal approval.
3. Approval must bind to a content version and reviewed variant.
4. Material changes after approval must trigger re-review or reapproval.
5. Approval does not authorize direct publishing.
6. Approval does not authorize paid execution, spend, payment, analytics ingestion, attribution, external integrations, or autonomous AI execution.
7. Manual publishing support remains external, user-operated, approval-gated, and evidence-based.
8. AI may assist drafting or flagging only where separately approved; AI must not approve, reject, bypass review, publish, schedule, or spend.
9. Approval state changes must be auditable in any future implementation.
10. Workspace authorization, membership, permission, tenant isolation, and ErrorModel guardrails must remain intact.

## 9. Readiness, Generation, Review, Approval, Publishing Eligibility, and Evidence

| Concept | Meaning | Boundary |
|---|---|---|
| Readiness | Advisory status about whether inputs are complete, coherent, and safe enough to proceed. | Does not approve content and does not authorize publishing. |
| Generation | Draft creation or draft update from user-provided or allowed inputs. | Produces reviewable material only. |
| Review | Human assessment of generated or edited content. | May request changes, reject, approve, or block until review issues are resolved. |
| Approval | Human decision on a reviewed version or variant. | Required before manual publishing support but not publishing authorization. |
| Manual publishing eligibility | Planning status indicating approved content can move toward manual checklist support. | No direct publishing, scheduling, paid execution, or external account action. |
| Manual publishing evidence | User-provided proof that external manual publishing occurred. | Does not prove platform analytics, attribution, or paid performance. |

## 10. Approval States

| State | Planning definition |
|---|---|
| `draft` | User-provided or partially prepared content exists but has not been generated into a reviewable output. |
| `generated` | Draft content has been generated or assembled and is available for review. |
| `in_review` | Content has entered human review. |
| `changes_requested` | A reviewer requested edits before approval can be considered. |
| `approved` | An authorized human approved a specific reviewed content version or variant. |
| `rejected` | An authorized human rejected the reviewed content. |
| `requires_reapproval` | Previously approved content has a material change or new risk and needs a new review cycle. |
| `blocked_until_review` | Risk, rights, policy, governance, prohibited claims, unsupported regulated claims, or attempted NO-GO actions require human review before proceeding. |
| `archived` | Content is retired from the active approval workflow. |

## 11. Allowed State Transitions

The following transitions are planning-level candidates only:

| From state | Action | To state |
|---|---|---|
| `draft` | generate draft content | `generated` |
| `generated` | submit for human review | `in_review` |
| `in_review` | request changes | `changes_requested` |
| `changes_requested` | revise and generate updated reviewable version | `generated` |
| `in_review` | approve reviewed version | `approved` |
| `in_review` | reject reviewed version | `rejected` |
| `approved` | detect material change or new risk | `requires_reapproval` |
| `requires_reapproval` | revise and generate updated reviewable version | `generated` |
| `generated` | detect blocking risk | `blocked_until_review` |
| `blocked_until_review` | Human review of blocking condition | `in_review` |
| `rejected` | revise and generate updated reviewable version | `generated` |
| `approved` | archive approved content | `archived` |
| `rejected` | archive rejected content | `archived` |
| `blocked_until_review` | archive blocked content | `archived` |
| `requires_reapproval` | archive content | `archived` |

`requires_reapproval` revisions move to `generated`, then follow the standard `generated` -> `in_review` path. Reapproval requires a new human review cycle. `blocked_until_review` cannot move directly to `approved`. `rejected` cannot move directly to `approved` without revision and a new review cycle.

## 12. Disallowed Transitions

The following transitions must remain disallowed unless future repository authority explicitly changes them:

- `draft` -> `approved`
- `generated` -> `approved` without review
- `blocked_until_review` -> `approved` without human review
- `rejected` -> `approved` without a new review cycle
- `approved` -> published automatically
- any state -> direct publishing
- any state -> paid execution

## 13. Material Changes That Trigger `requires_reapproval`

Material changes include:

- body text change;
- headline change;
- CTA change;
- Offer/CTA change;
- landing destination change;
- image/video/asset change;
- hashtags change;
- channel change;
- promotion terms change;
- claims/risk wording change;
- creative rights status change;
- UTM link change when material to destination or campaign.

## 14. Non-material Changes

The following may be non-material if a future QA/Test Case Plan defines safe criteria:

- formatting-only changes;
- typo correction with no meaning change;
- whitespace changes;
- internal note update.

These examples are planning-only and require future QA definition before implementation. This document does not approve automated non-material change handling.

## 15. Approval Lock Behavior

Approval lock behavior must follow these planning rules:

- approved content must bind to a content version;
- approved content must bind to the reviewed variant;
- material edits invalidate approval or move content to `requires_reapproval`;
- readiness score must not override approval lock;
- AI output must not override approval lock.

Approval lock does not authorize direct publishing, scheduling, paid execution, payment, analytics ingestion, attribution, external integrations, or autonomous AI execution.

## 16. Relationship to Campaign Readiness

Readiness does not equal approval.

`pass` or `soft_pass` does not approve content.

`fail` prevents generation/export readiness where operational inputs are missing.

`blocked_until_review` prevents approval until reviewed.

Readiness may recommend review preparation, but the approval state must remain human-controlled and separately auditable.

## 17. Relationship to Policy and Brand Review

Approval review may need to consider:

- claims review;
- rights review;
- brand tone review;
- channel fit review;
- prohibited claims review;
- regulated claims review.

Policy and brand review remain planning-level requirements in this document. Any future policy automation, brand review rules, or regulated-claims workflow requires separate contract and QA approval.

## 18. Relationship to Manual Publishing

Only approved content can be eligible for manual publishing checklist preparation.

Manual publishing remains external and user-operated.

Approval does not authorize direct publishing.

Approval does not authorize paid execution.

Manual publishing evidence remains user-provided.

Manual publishing eligibility does not connect social accounts, schedule posts, submit ads, ingest analytics, attribute performance, or spend money.

## 19. Relationship to AI

AI may draft, summarize, suggest, and flag where separately approved.

AI must not approve.

AI must not reject.

AI must not bypass human review.

AI must not change protected fields.

AI must not publish, schedule, or spend.

AI must not override approval lock, rights confirmation, approval state, or material-change classification without separately approved contracts.

## 20. Relationship to Roles and Permissions

Roles are planning-only in this document.

A future Role & Permission Matrix is required before implementation.

Approval actor must be authorized.

Viewers must not approve.

Editors may draft or edit depending on future policy.

Admins or owners may be approval candidates depending on future policy.

Any future permission model must preserve AuthGuard, WorkspaceContextGuard, MembershipCheck, PermissionGuard, ErrorModel behavior, and route-derived workspace context.

## 21. Approval Audit Requirements

Future implementation, if separately approved, should audit approval transitions with:

- state before;
- state after;
- actor;
- timestamp;
- reason;
- content version;
- risk flags;
- material change indicator;
- source action;
- workspace.

These are audit candidates only. They do not approve ERD, OpenAPI, SQL, QA, runtime, or generated-client changes.

## 22. Conceptual Approval Transition Table

| From state | Action | To state | Actor | Required conditions | Audit required | Notes |
|---|---|---|---|---|---|---|
| `draft` | Generate draft | `generated` | Editor or allowed creator | Required operational inputs are sufficient; no active blocking condition. | Yes | Generation remains draft-only. |
| `generated` | Submit for review | `in_review` | Editor or allowed submitter | Reviewable version exists. | Yes | Readiness may inform submission but cannot approve. |
| `in_review` | Request changes | `changes_requested` | Authorized reviewer | Reviewer supplies reason or requested change. | Yes | Does not reject permanently. |
| `changes_requested` | Revise content | `generated` | Editor or allowed creator | Updated version exists. | Yes | New version must be reviewable. |
| `in_review` | Approve | `approved` | Authorized approver | Human review complete; no unresolved blocker; reviewed version is bound. | Yes | Approval does not publish. |
| `in_review` | Reject | `rejected` | Authorized reviewer | Human review complete with rejection reason. | Yes | Resubmission requires a new review cycle. |
| `approved` | Material edit detected | `requires_reapproval` | Editor, system-detected future rule, or reviewer | Material change or new risk is identified. | Yes | Approval lock must not be bypassed. |
| `requires_reapproval` | Revise and generate | `generated` | Editor or allowed creator | Material changes are resolved and a reviewable version exists. | Yes | Reapproval requires a new human review cycle through the standard `generated` -> `in_review` path. |
| `generated` | Blocking risk detected | `blocked_until_review` | Reviewer or future approved risk check | Blocking condition exists. | Yes | Human review required before approval can proceed. |
| `blocked_until_review` | Human review of blocking condition | `in_review` | Authorized reviewer | Blocking condition is reviewed, resolved, or explicitly cleared under policy. | Yes | Blocked content cannot become approved directly. |
| `rejected` | Revise and generate | `generated` | Editor or allowed creator | Rejected content has been revised into a new reviewable version. | Yes | Resubmission starts a new review cycle through the standard `generated` -> `in_review` path. |
| `approved` | Archive | `archived` | Authorized actor | Content is retired from active use. | Yes | Does not delete evidence obligations. |
| `rejected` | Archive | `archived` | Authorized actor | Rejected content is retired. | Yes | Does not convert rejection to approval. |
| `blocked_until_review` | Archive | `archived` | Authorized actor | Blocked content is retired. | Yes | Does not resolve the blocking condition. |
| `requires_reapproval` | Archive | `archived` | Authorized actor | Content is retired from active use. | Yes | Does not resolve the reapproval requirement. |

## 23. Blocking Conditions

The following conditions block approval or require human review:

- prohibited claims;
- unsupported regulated claims;
- missing creative rights confirmation;
- misleading urgency;
- unclear promotion terms;
- deceptive discount language;
- unsupported absolute claims;
- attempted direct publishing;
- social OAuth;
- scheduling;
- paid ads;
- payment;
- analytics ingestion;
- attribution;
- external integrations;
- autonomous AI execution;
- Post V1 module implementation.

Blocking conditions override readiness and cannot be resolved by AI output or numeric scoring alone.

## 24. Example Approval Scenarios

### Normal draft -> review -> approval

A user provides campaign inputs, draft content is generated, the draft enters human review, and an authorized human approves the reviewed version.

Expected planning result: `draft` -> `generated` -> `in_review` -> `approved`.

### Approved content with CTA change

Approved content is edited to change the CTA or offer language.

Expected planning result: `approved` -> `requires_reapproval` until a new review cycle approves the changed version.

### Approved content with typo-only change

Approved content receives a typo correction with no meaning change.

Expected planning result: future QA must define whether this can remain approved or requires reapproval. This document does not approve automated classification.

### Blocked content with regulated claim

Generated content includes unsupported medical, financial, legal, health, weight-loss, guaranteed-result, or regulated claims.

Expected planning result: `generated` -> `blocked_until_review`; approval cannot proceed until human review addresses the issue.

### Rejected content resubmitted after edits

Content is rejected, then edited and resubmitted as a new reviewable version.

Expected planning result: rejected content does not move directly to approved. A new review cycle is required through `generated` and `in_review`.

### Approved content moved to manual publishing evidence

Approved content becomes eligible for manual publishing checklist preparation. The user later provides manual publishing evidence after external manual publishing.

Expected planning result: approval supports manual checklist eligibility only. Evidence remains user-provided and does not imply direct publishing, analytics ingestion, attribution, or paid execution.

## 25. Future ERD Impact Candidates

Future ERD Patch review may evaluate:

- approval state field or state history;
- approval transition audit records;
- content version binding;
- reviewed variant binding;
- material-change indicator;
- reapproval requirement;
- rejection reason;
- changes-requested reason;
- approval lock metadata;
- risk flags and blocker reasons;
- manual publishing eligibility status.

No ERD change is approved by this document.

## 26. Future OpenAPI Impact Candidates

Future OpenAPI Patch review may evaluate:

- endpoint or response surface for approval state;
- transition action endpoints for review, changes requested, approve, reject, reapproval, and archive;
- schemas for approval state, transition reason, content version, reviewed variant, risk flags, blockers, and material-change indicators;
- ErrorModel handling for disallowed transitions and blocked states.

No OpenAPI change is approved by this document.

## 27. Future QA Impact Candidates

Future QA/Test Case Plan review may evaluate:

- allowed transition tests;
- disallowed transition tests;
- approval lock tests;
- material-change and reapproval tests;
- non-material change classification tests;
- blocked-until-review tests;
- role/permission tests;
- tenant isolation tests;
- audit completeness tests;
- evidence handoff tests;
- negative tests for NO-GO capabilities.

No QA change is approved by this document.

## 28. Future Threat Model Impact Candidates

Future Threat Model Update review may evaluate:

- approval bypass;
- unauthorized approver;
- viewer approving content;
- workspace authorization failure;
- cross-tenant approval state access;
- approval lock bypass;
- material-change misclassification;
- evidence tampering after approval;
- creative rights misuse;
- misleading claims;
- AI suggestions being treated as approval;
- attempts to trigger direct publishing, social OAuth, scheduling, paid ads, payment, analytics ingestion, attribution, external integrations, autonomous AI execution, or Post V1 module implementation.

## 29. Required Future Contracts Before Implementation

Future implementation cannot be considered until separately approved documents define the relevant contracts:

- ERD Patch
- OpenAPI Patch
- SQL Migration Plan
- QA/Test Case Plan
- Threat Model Update
- Role & Permission Matrix
- Manual Publishing Evidence Contract
- Campaign Readiness Scoring Contract alignment
- AI Service Layer Specification
- AI Logging & Privacy Policy

## 30. Recommended Sequencing

1. Review and approve this documentation-only Approval State Machine Contract.
2. Produce or align the Role & Permission Matrix for approval actors and reviewer permissions.
3. Produce the Manual Publishing Evidence Contract for evidence handoff after approval.
4. Produce ERD Patch and OpenAPI Patch proposals for only approved Core V1 approval concepts.
5. Produce SQL Migration Plan only after ERD approval.
6. Produce QA/Test Case Plan and Threat Model Update before implementation.
7. Produce AI Service Layer Specification and AI Logging & Privacy Policy before any AI-assisted drafting, flagging, or review assistance is considered.
8. Only after contracts are approved, consider a separately scoped implementation request with allowed files, forbidden files, verification commands, expected CI gates, and explicit NO-GO items.

## 31. GO / NO-GO Decision

GO:

- Documentation-only Approval State Machine Contract.
- Future planning discussion.
- Future separately approved ERD/OpenAPI/SQL/QA/Threat Model contract proposals.

NO-GO:

- Implementation from this document.
- ERD, OpenAPI, SQL, QA, runtime, generated client, test, package, workflow, script, migration, prototype, frontend asset, router/store, or implementation changes.
- Treating readiness score as approval.
- Treating approval as publishing authorization.
- Treating approval as paid execution or spend authorization.
- Direct publishing, social OAuth, scheduling, paid ads, payment, analytics ingestion, attribution, external integrations, autonomous AI execution, or Post V1 module implementation.

## 32. Safe Files to Edit Later if Approved

If separately approved, later documentation-only or contract patches may edit narrowly scoped files such as:

- `docs/17_change_log.md`
- `docs/03_decision_log.md`
- `docs/06_erd.md`
- `docs/08_api_spec.md`
- `docs/marketing_os_v5_6_5_phase_0_1_erd.md`
- `docs/marketing_os_v5_6_5_phase_0_1_openapi.yaml`
- `docs/marketing_os_v5_6_5_phase_0_1_schema.sql`
- `docs/marketing_os_v5_6_5_phase_0_1_qa_test_suite.md`
- a new ERD Patch document
- a new OpenAPI Patch document
- a new SQL Migration Plan
- a new QA/Test Case Plan
- a new Threat Model Update
- a new Role & Permission Matrix
- a new Manual Publishing Evidence Contract
- a new AI Service Layer Specification
- a new AI Logging & Privacy Policy

Any future edit must be separately approved with explicit allowed files, forbidden files, and verification gates.

## 33. Files That Must Remain Forbidden

Unless a future approved request explicitly permits them, the following must remain forbidden:

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
- any ERD/OpenAPI/SQL/QA contract file not explicitly listed in a future approved scope
