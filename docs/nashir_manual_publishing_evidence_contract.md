# Nashir Manual Publishing Evidence Contract

## 1. Purpose

This document is documentation-only.

It defines planning-level manual publishing evidence semantics for Nashir Core V1 so future ERD, OpenAPI, SQL, QA, Threat Model, and implementation work can be scoped consistently.

This document does not approve implementation.

This document does not modify ERD, OpenAPI, SQL, QA, runtime, generated clients, tests, packages, or workflows.

This document only defines planning-level manual publishing evidence semantics.

Existing ERD and OpenAPI remain authoritative until separately patched and approved.

Manual publishing evidence does not authorize publishing.

Manual publishing evidence is user-provided proof of external manual publishing.

Manual publishing remains external and user-operated in Core V1.

Evidence does not imply direct publishing, analytics ingestion, attribution, or paid execution.

Core V1 remains manual/export/review/approval/evidence only.

Direct publishing, social OAuth, scheduling, paid ads, payment, analytics ingestion, attribution, external integrations, autonomous AI execution, and Post V1 module implementation remain NO-GO.

Any future ERD/OpenAPI/SQL/QA/Threat Model work must be separately approved with explicit allowed files, forbidden files, and verification gates.

## 2. Scope

This contract covers conceptual manual publishing evidence capture, fields, statuses, transitions, supersede and invalidation rules, audit expectations, and evidence integrity risks for Nashir Core V1.

It applies only to external, user-operated manual publishing workflows after human approval and checklist preparation where separately approved.

## 3. Non-goals

This document does not:

- approve runtime evidence capture logic;
- create ERD entities, fields, SQL migrations, OpenAPI schemas, endpoints, generated clients, QA tests, or implementation tasks;
- approve direct publishing, scheduling, social OAuth, paid execution, payment, analytics ingestion, attribution, external integrations, or autonomous AI execution;
- treat evidence as platform verification, analytics proof, paid performance proof, or attribution;
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
- `docs/nashir_approval_state_machine_contract.md`

## 5. Current repository authority summary

Marketing OS remains a contract-first Phase 0/1 execution repository. It is not approved for Pilot or Production.

`docs/02_v1_scope.md` defines Nashir Core V1 as manual/export/review/approval/evidence only and does not approve implementation by itself.

`docs/04_backlog.md` documents Nashir backlog planning boundaries only. It does not create sprint-ready implementation tasks.

`docs/nashir_erd_openapi_qa_threat_model_impact_review.md` identifies impact areas only. Existing ERD and OpenAPI remain authoritative until separately patched and approved.

`docs/nashir_campaign_readiness_scoring_contract.md` keeps readiness separate from approval, publishing authorization, analytics ingestion, and attribution.

`docs/nashir_approval_state_machine_contract.md` keeps approval human-only and separate from publishing authorization. This evidence contract depends on approved content version semantics but does not approve implementation.

Core V1 remains manual/export/review/approval/evidence only.

Direct publishing, social OAuth, scheduling, paid ads, payment, analytics ingestion, attribution, external integrations, autonomous AI execution, and Post V1 module implementation remain NO-GO.

## 6. Relationship to Prior Nashir Documents

### Nashir journey document

`docs/nashir_dual_path_customer_journey_and_campaign_flow.md` introduced manual publishing checklist support, manual publishing evidence, and manual performance review as planning concepts. This contract narrows evidence semantics to user-provided proof only.

### Nashir traceability review

`docs/nashir_journey_traceability_and_contract_impact_review.md` identified manual checklist/evidence as partially supported by existing Phase 0/1 concepts while requiring future evidence contract work before implementation.

### Nashir PRD/backlog reconciliation

`docs/nashir_prd_backlog_reconciliation.md` classified manual publishing evidence as already aligned in principle and identified the Manual Publishing Evidence Contract as a required follow-up document for Nashir-specific mapping.

### Nashir Core V1 scope patch

`docs/02_v1_scope.md` includes manual publishing checklist and manual publishing evidence as Core V1 candidates only within manual/export/review/approval/evidence boundaries.

### Nashir backlog planning patch

`docs/04_backlog.md` allows planning references for manual publishing checklist and manual publishing evidence while remaining planning-only and non-implementable by itself.

### Nashir ERD/OpenAPI/QA/Threat Model impact review

`docs/nashir_erd_openapi_qa_threat_model_impact_review.md` identifies potential evidence, checklist, QA, tenant isolation, and tamper-risk impact candidates. This document does not approve those changes.

### Nashir Campaign Readiness Scoring Contract

`docs/nashir_campaign_readiness_scoring_contract.md` states that readiness may enable checklist preparation where separately approved but does not create evidence, validate evidence, authorize publishing, ingest analytics, or provide attribution.

### Nashir Approval State Machine Contract

`docs/nashir_approval_state_machine_contract.md` defines planning-level approval state semantics. This evidence contract requires evidence to bind only to approved content versions and not to content in `requires_reapproval`, `blocked_until_review`, or `rejected` states.

## 7. Definitions

### Manual publishing

Manual publishing is an external, user-operated action performed outside the system after approved content is copied, exported, or otherwise used by a human.

### Manual publishing evidence

Manual publishing evidence is user-provided proof that external manual publishing occurred. It does not authorize publishing and does not prove analytics, attribution, or paid performance.

### Publishing checklist

Publishing checklist is a planning or workflow checklist that may help a user prepare for external manual publishing. It must not trigger direct publishing.

### Published content version

Published content version is the approved content version that the user says was manually published externally.

### Evidence record

Evidence record is a conceptual record of submitted proof for a specific workspace, campaign, approved content version, channel, and external publication.

### Evidence attachment

Evidence attachment is a user-provided screenshot, file, or reference used to support an evidence record where a URL is unavailable, insufficient, or needs supplemental proof.

### Evidence status

Evidence status is the planning-level lifecycle state of an evidence record.

### Superseded evidence

Superseded evidence is previously accepted evidence replaced by a later corrected or more complete evidence record while remaining auditable.

### Invalidated evidence

Invalidated evidence is evidence later determined to be wrong, misleading, mismatched, removed, or unsafe to rely on.

### Evidence audit trail

Evidence audit trail is the future auditable history of evidence state changes, actors, reasons, and references if implementation is separately approved.

## 8. Core V1 Evidence Principles

1. Evidence is user-provided proof of external manual publishing.
2. Evidence does not authorize publishing.
3. Evidence does not imply direct publishing, analytics ingestion, attribution, or paid execution.
4. Manual publishing remains external and user-operated in Core V1.
5. Evidence must reference an approved content version where accepted.
6. Accepted evidence should not be silently edited.
7. Material corrections should create superseding evidence rather than mutating accepted evidence.
8. Invalidated and superseded evidence must remain auditable where future implementation is approved.
9. AI may assist with summaries and missing-field prompts only where separately approved; AI must not create false evidence or accept evidence.
10. Workspace authorization, membership, permission, tenant isolation, and ErrorModel guardrails must remain intact.

## 9. Approval, Eligibility, Action, Evidence, and Performance Review

| Concept | Meaning | Boundary |
|---|---|---|
| Approval | Human decision on a reviewed content version. | Required before manual publishing support but not publishing authorization. |
| Manual publishing eligibility | Planning status that approved content can move toward checklist support. | Does not connect accounts, schedule posts, publish, or spend. |
| Manual publishing action | External user action performed outside the system. | Not performed by the system in Core V1. |
| Manual publishing evidence | User-provided proof that external manual publishing occurred. | Does not prove analytics, attribution, paid performance, or platform state. |
| Manual performance review | User-entered observations after publishing. | No analytics ingestion or attribution in Core V1. |

## 10. Evidence Prerequisites

Evidence should be accepted only when these planning prerequisites are satisfied:

- approved content version;
- approval lock satisfied;
- manual publishing checklist completed or acknowledged;
- channel selected;
- final content copied or exported;
- UTM link reviewed if applicable;
- creative rights confirmation present.

These prerequisites are planning semantics only and do not approve implementation.

## 11. Evidence Fields

Conceptual evidence fields include:

- evidence ID;
- workspace;
- campaign;
- approved content version;
- channel;
- published URL;
- screenshot / attachment reference;
- published date/time;
- submitted by;
- submitted at;
- notes;
- hashtags used;
- CTA used;
- landing destination used;
- UTM link used;
- evidence status.

## 12. Required vs Optional Evidence Fields

| Field | Requirement |
|---|---|
| channel | Required. |
| approved content version | Required. |
| published date/time | Required. |
| submitted by | Required. |
| submitted at | Required. |
| published URL | Required when platform provides a URL. |
| screenshot | Required when URL is unavailable or insufficient. |
| notes | Optional. |
| hashtags used | Optional but recommended. |
| CTA used | Optional but recommended. |
| UTM link used | Required when UTM Lite was generated and used. |

## 13. Evidence Statuses

| Status | Planning definition |
|---|---|
| `draft` | Evidence is being prepared and is not submitted. |
| `submitted` | Evidence has been submitted for acceptance review. |
| `accepted` | Evidence was accepted as sufficient user-provided proof for the referenced approved content version. |
| `needs_correction` | Evidence needs correction before it can be accepted. |
| `superseded` | Accepted evidence was replaced by a later corrected or more complete evidence record. |
| `invalidated` | Evidence was determined to be wrong, misleading, mismatched, removed, or unsafe to rely on. |
| `archived` | Evidence is retired from active use while remaining available for audit where future implementation permits. |

## 14. Allowed Evidence Transitions

The following transitions are planning-level candidates only:

| From state | Action | To state |
|---|---|---|
| `draft` | submit evidence | `submitted` |
| `submitted` | accept evidence | `accepted` |
| submitted | request correction | needs_correction |
| submitted | invalidate evidence | invalidated |
| needs_correction | resubmit corrected evidence | submitted |
| needs_correction | invalidate evidence | invalidated |
| `accepted` | supersede with corrected evidence | `superseded` |
| `accepted` | invalidate evidence | `invalidated` |
| `superseded` | archive superseded evidence | `archived` |
| `invalidated` | archive invalidated evidence | `archived` |

## 15. Disallowed Evidence Transitions

The following transitions must remain disallowed unless future repository authority explicitly changes them:

- `draft` -> `accepted`
- `submitted` -> `superseded` without acceptance
- `invalidated` -> `accepted`
- `superseded` -> `accepted`
- `archived` -> `accepted`
- any evidence state -> direct publishing
- any evidence state -> paid execution

## 16. Evidence Supersede Rules

Supersede behavior must follow these planning rules:

- accepted evidence should not be silently edited;
- material corrections should create a superseding evidence record;
- superseded evidence must remain auditable;
- superseding evidence must reference prior evidence.

Supersede does not delete prior evidence and does not authorize publishing, analytics ingestion, attribution, or paid execution.

## 17. Evidence Invalidation Rules

Evidence may require invalidation for:

- wrong channel;
- wrong URL;
- wrong content version;
- missing or false screenshot;
- publication removed;
- published content differs materially from approved content;
- rights/claims issue discovered after publication;
- UTM/landing destination mismatch.

Invalidation must remain auditable where future implementation is separately approved.

## 18. Relationship to Approval State Machine

Evidence can only reference approved content.

Evidence must bind to approved content version.

`requires_reapproval` content must not be used as accepted evidence.

`blocked_until_review` content must not be used as accepted evidence.

`rejected` content must not be used as accepted evidence.

Evidence acceptance must not override approval locks, reapproval requirements, or blocked review states.

## 19. Relationship to Campaign Readiness

Readiness may enable checklist preparation where separately approved.

Readiness does not create evidence.

Readiness does not validate evidence.

Readiness does not authorize publishing.

Readiness must not be represented as proof that external manual publishing occurred.

## 20. Relationship to Manual Performance Review

Evidence precedes manual performance review.

Performance review may reference evidence.

Performance metrics remain user-entered in Core V1.

Evidence does not imply analytics ingestion.

Evidence does not imply attribution, paid performance, billing, invoice state, or platform reporting.

## 21. Relationship to UTM Lite

UTM link used should be recorded when applicable.

UTM Lite does not collect analytics.

UTM mismatch may require correction or invalidation.

UTM fields support manual review of the link used only. They do not prove visits, conversions, attribution, or campaign performance.

## 22. Relationship to AI

AI may summarize evidence where separately approved.

AI may flag missing evidence fields where separately approved.

AI may suggest correction questions where separately approved.

AI must not create false evidence.

AI must not mark evidence accepted.

AI must not publish.

AI must not infer publishing occurred without user-provided proof.

AI must not override protected evidence, approval, rights, or audit fields.

## 23. Role and Permission Assumptions

Roles are planning-only in this document.

A future Role & Permission Matrix is required before implementation.

Viewers must not submit or accept evidence.

Editors may draft or submit evidence depending on future policy.

Admins or owners may be candidates for accepting or invalidating evidence depending on future policy.

Any future permission model must preserve AuthGuard, WorkspaceContextGuard, MembershipCheck, PermissionGuard, ErrorModel behavior, and route-derived workspace context.

## 24. Evidence Audit Requirements

Future implementation, if separately approved, should audit evidence transitions with:

- state before;
- state after;
- actor;
- timestamp;
- reason;
- associated workspace;
- associated campaign;
- associated content version;
- prior evidence reference if superseded;
- invalidation reason if invalidated;
- source action.

These are audit candidates only. They do not approve ERD, OpenAPI, SQL, QA, runtime, or generated-client changes.

## 25. Evidence Integrity Risks

Evidence integrity risks include:

- fake screenshot;
- wrong URL;
- wrong channel;
- wrong content version;
- edited published content after approval;
- missing UTM link;
- rights issue discovered after publication;
- misleading evidence notes;
- tenant isolation failure.

## 26. Conceptual Evidence Table

| Field | Required / optional | Source | Validation expectation | Risk if missing | Notes |
|---|---|---|---|---|---|
| Evidence ID | Required | System-assigned future candidate | Unique within approved future persistence model. | Evidence cannot be referenced. | No implementation approved. |
| Workspace | Required | Route/context-derived workspace | Must not trust `workspace_id` from request body. | Tenant isolation failure. | Preserve workspace guards. |
| Campaign | Required | Approved campaign context | Must belong to workspace. | Evidence could attach to wrong campaign. | No API change approved. |
| Approved content version | Required | Approval workflow | Must be approved and not reapproval/blocked/rejected. | Evidence may cite unapproved content. | Binds evidence to reviewed content. |
| Channel | Required | User selection | Must match manual publishing claim. | Wrong channel evidence. | No channel integration approved. |
| Published URL | Conditional | User-provided | Required when platform provides URL. | Harder to verify publication claim. | No scraping or ingestion. |
| Screenshot / attachment reference | Conditional | User-provided | Required when URL unavailable or insufficient. | Fake or incomplete proof risk. | Attachment contract required later. |
| Published date/time | Required | User-provided | Must be present and reviewable. | Evidence timeline unclear. | Does not prove platform timestamp. |
| Submitted by | Required | Authenticated actor future candidate | Must be authorized by future permission matrix. | Accountability gap. | Roles planning-only. |
| Submitted at | Required | Future system timestamp | Must be recorded when submitted. | Audit gap. | No runtime approved. |
| Notes | Optional | User-provided | Review for misleading claims. | Context may be missing. | Optional only. |
| Hashtags used | Optional recommended | User-provided | Compare with approved content where relevant. | Published content may differ. | No trend ingestion. |
| CTA used | Optional recommended | User-provided | Compare with approved content where relevant. | Offer/CTA mismatch risk. | Risk wording may require review. |
| Landing destination used | Recommended | User-provided | Compare with approved destination and UTM link. | Destination mismatch risk. | No hosting/tracking approval. |
| UTM link used | Conditional | User-provided/generated planning output | Required when UTM Lite was generated and used. | UTM mismatch or missing link. | No analytics or attribution. |
| Evidence status | Required | Evidence workflow | Must be one of defined planning statuses. | State ambiguity. | No implementation approved. |

## 27. Conceptual Evidence Transition Table

| From state | Action | To state | Actor | Required conditions | Audit required | Notes |
|---|---|---|---|---|---|---|
| `draft` | Submit evidence | `submitted` | Editor or allowed submitter | Required evidence fields are present enough for review. | Yes | Does not accept evidence. |
| `submitted` | Accept evidence | `accepted` | Authorized reviewer | Evidence references approved content and required proof is sufficient. | Yes | Acceptance does not publish. |
| `submitted` | Request correction | `needs_correction` | Authorized reviewer | Evidence is incomplete, mismatched, or unclear. | Yes | Correction required before acceptance. |
| `needs_correction` | Resubmit corrected evidence | `submitted` | Editor or allowed submitter | Corrected evidence is provided. | Yes | Starts another evidence review pass. |
| `accepted` | Supersede evidence | `superseded` | Authorized reviewer | Corrected or more complete evidence exists and references prior evidence. | Yes | Prior evidence remains auditable. |
| `accepted` | Invalidate evidence | `invalidated` | Authorized reviewer | Invalidation reason is present. | Yes | Does not delete evidence. |
| `superseded` | Archive evidence | `archived` | Authorized actor | Evidence is retired from active use. | Yes | Does not restore acceptance. |
| `invalidated` | Archive evidence | `archived` | Authorized actor | Evidence is retired from active use. | Yes | Does not restore acceptance. |

## 28. Example Evidence Scenarios

### Instagram post with URL and screenshot

A user manually publishes approved content externally, provides the Instagram URL, screenshot, channel, timestamp, hashtags, CTA, and UTM link used.

Expected planning result: evidence can move from `draft` to `submitted`, then to `accepted` if reviewed and sufficient.

### Story/post where URL is unavailable and screenshot is required

A user manually publishes an ephemeral story where a stable URL is unavailable.

Expected planning result: screenshot or attachment reference is required because URL is unavailable or insufficient.

### Evidence submitted for wrong content version

Evidence references a version that was not approved or was later moved to `requires_reapproval`.

Expected planning result: evidence should move to `needs_correction` or `invalidated`, depending on review context.

### Accepted evidence superseded by corrected URL

Accepted evidence has a typo in the submitted URL, and a corrected evidence record is provided.

Expected planning result: original accepted evidence moves to `superseded`; the superseding evidence references the prior evidence.

### Evidence invalidated after rights issue

A rights issue is discovered after publication.

Expected planning result: evidence may move from `accepted` to `invalidated` with an invalidation reason and audit trail.

### Evidence linked to manual performance review

After evidence is accepted, a user later enters manual performance observations.

Expected planning result: performance review may reference evidence, but metrics remain user-entered and do not imply analytics ingestion or attribution.

## 29. Future ERD Impact Candidates

Future ERD Patch review may evaluate:

- evidence status fields or state history;
- evidence attachment references;
- approved content version binding;
- evidence supersede references;
- invalidation reason fields;
- UTM link used;
- hashtags, CTA, and landing destination used;
- manual checklist completion or acknowledgment reference;
- evidence audit records.

No ERD change is approved by this document.

## 30. Future OpenAPI Impact Candidates

Future OpenAPI Patch review may evaluate:

- endpoint or response surface for evidence records;
- transition action endpoints for submit, accept, correction, supersede, invalidate, and archive;
- schemas for evidence fields, attachments, statuses, audit details, and invalidation reasons;
- ErrorModel handling for disallowed transitions and unapproved content references.

No OpenAPI change is approved by this document.

## 31. Future QA Impact Candidates

Future QA/Test Case Plan review may evaluate:

- required and conditional field tests;
- allowed evidence transition tests;
- disallowed evidence transition tests;
- accepted evidence immutability tests;
- supersede and invalidation tests;
- wrong URL/channel/content-version tests;
- UTM mismatch tests;
- evidence-to-approval-lock tests;
- role/permission tests;
- tenant isolation tests;
- negative tests for NO-GO capabilities.

No QA change is approved by this document.

## 32. Future Threat Model Impact Candidates

Future Threat Model Update review may evaluate:

- fake screenshot risk;
- false publishing claims;
- wrong URL or channel;
- wrong content version;
- edited published content after approval;
- evidence tampering;
- cross-tenant evidence access;
- rights issue discovered after publication;
- misleading evidence notes;
- AI-generated false evidence;
- attempts to trigger direct publishing, social OAuth, scheduling, paid ads, payment, analytics ingestion, attribution, external integrations, autonomous AI execution, or Post V1 module implementation.

## 33. Required Future Contracts Before Implementation

Future implementation cannot be considered until separately approved documents define the relevant contracts:

- ERD Patch
- OpenAPI Patch
- SQL Migration Plan
- QA/Test Case Plan
- Threat Model Update
- Role & Permission Matrix
- Approval State Machine Contract alignment
- Campaign Readiness Scoring Contract alignment
- AI Service Layer Specification
- AI Logging & Privacy Policy

## 34. Recommended Sequencing

1. Review and approve this documentation-only Manual Publishing Evidence Contract.
2. Align the Role & Permission Matrix for evidence submitters, reviewers, acceptors, and invalidators.
3. Align Approval State Machine and Campaign Readiness Scoring wording where needed.
4. Produce ERD Patch and OpenAPI Patch proposals for only approved Core V1 evidence concepts.
5. Produce SQL Migration Plan only after ERD approval.
6. Produce QA/Test Case Plan and Threat Model Update before implementation.
7. Produce AI Service Layer Specification and AI Logging & Privacy Policy before any AI-assisted evidence summaries or prompts are considered.
8. Only after contracts are approved, consider a separately scoped implementation request with allowed files, forbidden files, verification commands, expected CI gates, and explicit NO-GO items.

## 35. GO / NO-GO Decision

GO:

- Documentation-only Manual Publishing Evidence Contract.
- Future planning discussion.
- Future separately approved ERD/OpenAPI/SQL/QA/Threat Model contract proposals.

NO-GO:

- Implementation from this document.
- ERD, OpenAPI, SQL, QA, runtime, generated client, test, package, workflow, script, migration, prototype, frontend asset, router/store, or implementation changes.
- Treating evidence as publishing authorization.
- Treating evidence as platform verification, analytics ingestion, attribution, paid performance, payment, billing, or invoice state.
- Direct publishing, social OAuth, scheduling, paid ads, payment, analytics ingestion, attribution, external integrations, autonomous AI execution, or Post V1 module implementation.

## 36. Safe Files to Edit Later if Approved

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
- a new Approval State Machine alignment patch
- a new Campaign Readiness Scoring alignment patch
- a new AI Service Layer Specification
- a new AI Logging & Privacy Policy

Any future edit must be separately approved with explicit allowed files, forbidden files, and verification gates.

## 37. Files That Must Remain Forbidden

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
