# Nashir Campaign Readiness Scoring Contract

## 1. Purpose

This document is documentation-only.

It defines planning-level Campaign Readiness scoring semantics for Nashir Core V1 so future ERD, OpenAPI, SQL, QA, Threat Model, and implementation work can be scoped consistently.

This document does not approve implementation.

This document does not modify ERD, OpenAPI, SQL, QA, runtime, generated clients, tests, packages, or workflows.

This document only defines planning-level scoring semantics.

Existing ERD and OpenAPI remain authoritative until separately patched and approved.

## 2. Scope

This contract covers conceptual readiness scoring for Nashir Core V1 campaign preparation, including completeness, confidence, risk gates, readiness levels, gate states, blocking conditions, soft warning conditions, and explanation requirements.

The scoring model applies only to manual/export/review/approval/evidence workflows. It may inform whether a user should improve a campaign brief, generate a draft anyway, switch to guided intake, or pause until human review.

## 3. Non-goals

This document does not:

- approve runtime scoring logic;
- create ERD entities, fields, SQL migrations, OpenAPI schemas, endpoints, generated clients, QA tests, or implementation tasks;
- approve automated publishing, scheduling, paid execution, payment, analytics ingestion, attribution, external integrations, or autonomous AI execution;
- make readiness a substitute for human approval;
- make readiness a prerequisite for direct publishing;
- authorize Pilot or Production readiness.

## 4. Sources inspected

- `AGENTS.md`
- `README.md`
- `docs/17_change_log.md`
- `docs/02_v1_scope.md`
- `docs/03_decision_log.md`
- `docs/04_backlog.md`
- `docs/nashir_dual_path_customer_journey_and_campaign_flow.md`
- `docs/nashir_journey_traceability_and_contract_impact_review.md`
- `docs/nashir_prd_backlog_reconciliation.md`
- `docs/nashir_erd_openapi_qa_threat_model_impact_review.md`

## 5. Current repository authority summary

Marketing OS remains a contract-first Phase 0/1 execution repository. It is not approved for Pilot or Production.

`docs/02_v1_scope.md` defines Nashir Core V1 as manual/export/review/approval/evidence only and does not approve implementation by itself.

`docs/04_backlog.md` documents Nashir backlog planning boundaries only. It does not create sprint-ready implementation tasks.

`docs/nashir_erd_openapi_qa_threat_model_impact_review.md` identifies impact areas only. Existing ERD and OpenAPI remain authoritative until separately patched and approved.

Readiness score does not equal approval.

Readiness score does not authorize publishing.

Core V1 remains manual/export/review/approval/evidence only.

Direct publishing, social OAuth, scheduling, paid ads, payment, analytics ingestion, attribution, external integrations, autonomous AI execution, and Post V1 module implementation remain NO-GO.

Any future ERD/OpenAPI/SQL/QA/Threat Model work must be separately approved with explicit allowed files, forbidden files, and verification gates.

## 6. Relationship to prior Nashir documents

### Nashir journey document

`docs/nashir_dual_path_customer_journey_and_campaign_flow.md` introduced the conceptual readiness dashboard, readiness dimensions, gate states, warnings, approval lock, UTM Lite, and manual publishing boundaries. This contract narrows those ideas into planning-level scoring semantics only.

### Nashir traceability review

`docs/nashir_journey_traceability_and_contract_impact_review.md` identified readiness scoring as unsupported by current contracts and requiring future scoring documentation before implementation.

### Nashir PRD/backlog reconciliation

`docs/nashir_prd_backlog_reconciliation.md` classified Campaign Readiness as a Core V1 candidate requiring PRD/backlog patch and a Campaign Readiness Scoring Contract.

### Nashir Core V1 scope patch

`docs/02_v1_scope.md` limits Nashir Core V1 to manual/export/review/approval/evidence and explicitly states that readiness does not authorize direct publishing, paid execution, analytics ingestion, attribution, integrations, or autonomous execution.

### Nashir backlog planning patch

`docs/04_backlog.md` allows backlog planning references for the Readiness Dashboard, Smart Wizard, user-provided intake, UTM Lite, human approval, approval lock, manual publishing checklist, evidence, and manual performance review, while remaining planning-only.

### Nashir ERD/OpenAPI/QA/Threat Model impact review

`docs/nashir_erd_openapi_qa_threat_model_impact_review.md` identifies potential future scoring impact areas such as readiness snapshots, scoring fields, endpoint candidates, QA categories, and threat-model risks. This scoring contract does not approve those changes.

## 7. Definitions

### Profile Completion

Profile Completion measures whether expected business, brand, audience, product, service, store, offer, channel, and governance inputs have been supplied or confirmed.

### Data Readiness

Data Readiness measures whether available inputs are specific, current, trusted, user-provided or explicitly allowed, and sufficient for draft generation and review.

### Strategy Readiness

Strategy Readiness measures whether objective, audience, geography, language, offer, positioning, channel fit, CTA, constraints, and content requirements are coherent enough to produce useful draft campaign materials.

### Campaign Readiness

Campaign Readiness measures whether a specific campaign has enough confirmed inputs, acceptable risk posture, and manual workflow preparation to proceed to draft generation, human review, approval preparation, manual publishing checklist preparation, or manual follow-up.

### Campaign Readiness Gate

The Campaign Readiness Gate is a planning-level decision point that combines scoring, warnings, and blocking conditions to recommend whether to proceed, warn, fail, or block until review.

### Blocked Until Review

Blocked Until Review means scoring cannot safely recommend draft generation, approval preparation, or manual publishing checklist preparation until a human addresses a blocking issue.

## 8. Scoring principles

1. Readiness is advisory and explainable.
2. Readiness must not approve content.
3. Readiness must not authorize publishing.
4. Readiness must not authorize spend, payment, analytics ingestion, attribution, external integrations, or autonomous AI execution.
5. Scoring must distinguish missing information from high-risk information.
6. Blocking conditions override numeric scores.
7. User-entered and AI-suggested information must be distinguishable if future implementation is approved.
8. Protected fields, rights confirmations, and approval status must not be overwritten by AI suggestions.
9. Every future scoring output should be explainable through missing fields, warnings, blocking reasons, and user action taken.

## 9. Completeness, confidence, risk gate, and approval status

| Concept | Meaning | What it can do | What it cannot do |
|---|---|---|---|
| Completeness score | Measures whether expected inputs are present. | Identify missing fields and readiness gaps. | Prove the campaign is safe, accurate, approved, or publishable. |
| Confidence score | Measures likely input quality and usefulness based on specificity, recency, trust, and consistency. | Warn that outputs may be weak or speculative. | Replace review, legal judgment, or human approval. |
| Risk gate | Checks blocking or high-risk conditions. | Stop or route work to human review even if completeness is high. | Approve content or authorize publishing. |
| Approval status | Human review decision under approved approval workflows. | Determine whether content can move toward manual publishing support. | Be inferred from readiness score. |

Readiness score does not equal approval.

Readiness score does not authorize publishing.

## 10. Campaign Readiness Score components

Campaign Readiness may consider:

- Campaign basics.
- Advertised object completeness.
- Audience and geography clarity.
- Offer / CTA clarity.
- Landing destination.
- Creative assets.
- Creative rights confirmation.
- Brand tone / governance constraints.
- Content requirements.
- Channel selection.
- UTM Tracking Lite readiness.
- Human approval readiness.
- Manual publishing checklist readiness.

## 11. Suggested scoring weights

The following weights are planning-only. They are not implementation rules and do not create approved ERD, OpenAPI, SQL, QA, runtime, or generated-client requirements.

| Component | Planning-only weight |
|---|---:|
| Campaign basics | 10% |
| Advertised object | 15% |
| Audience/geography/language | 10% |
| Offer/CTA | 10% |
| Landing destination | 10% |
| Creative assets | 10% |
| Creative rights | 10% |
| Brand/governance constraints | 10% |
| Content/channel requirements | 10% |
| UTM/manual publishing readiness | 5% |

## 12. Readiness levels

| Level | Planning definition | Typical guidance |
|---|---|---|
| Low | Many required inputs are missing or unconfirmed, or confidence is poor. | Improve brief first or switch to guided wizard. |
| Medium | Enough information exists for a rough draft, but important gaps remain. | Generate draft anyway with warnings or improve brief first. |
| Good | Most required inputs are present, coherent, and reviewable. | Generate draft and proceed to review preparation. |
| High | Inputs are specific, confirmed, coherent, and suitable for stronger draft confidence. | Generate draft, prepare human review, and prepare checklist where separately approved. |

## 13. Gate states

| Gate state | Meaning |
|---|---|
| pass | Inputs are sufficient and no blocking condition is active. |
| soft_pass | Inputs are usable, but warnings should be shown. |
| fail | Inputs are insufficient for useful draft generation or checklist preparation. |
| blocked_until_review | A blocking risk requires human review before proceeding. |

## 14. Blocking conditions

Blocking conditions override numeric readiness. Blocking conditions include:

- missing creative rights confirmation;
- prohibited claims;
- unsupported medical/financial/legal claims;
- unclear landing destination for conversion objective;
- unapproved material changes after approval;
- high-risk content category;
- attempt to use direct publishing, paid ads, payment, analytics ingestion, attribution, or autonomous AI execution.

## 15. Soft warning conditions

Soft warnings may reduce confidence, downgrade gate state to `soft_pass`, or recommend improvement before draft generation:

- low budget clarity;
- broad audience;
- missing social proof;
- missing video/visual reference;
- weak offer;
- incomplete product/service details;
- low data readiness.

Budget clarity is planning-only. It does not authorize spend, paid execution, payment, billing, invoice state, or attribution.

## 16. Output behavior by readiness

| Readiness/gate result | Allowed planning behavior |
|---|---|
| High / pass | Generate draft anyway, prepare human review, and prepare checklist only where separately approved. |
| Good / pass | Generate draft anyway and show any minor gaps. |
| Medium / soft_pass | Generate draft anyway with warnings, improve brief first, ask assistant to complete missing fields, or switch to guided wizard. |
| Low / fail | Improve brief first or switch to guided wizard. |
| Any score / blocked_until_review | Block until review. |

The phrase "ask assistant to complete missing fields" means planning-level assistance only. AI must not approve, publish, spend, update protected fields, or convert suggestions into confirmed facts.

## 17. Relationship to Human Approval

Readiness does not equal approval.

Readiness does not authorize publishing.

Approval remains human and separate.

Human approval must remain a distinct workflow governed by approved approval contracts. A high readiness score may indicate that the campaign is prepared for review; it must not mark content as approved.

## 18. Relationship to Manual Publishing

Readiness may enable checklist preparation where separately approved.

Manual publishing evidence remains user-provided.

No direct publishing is authorized.

Manual publishing support must remain outside-platform, user-operated, approval-gated, and evidence-based.

## 19. Relationship to UTM Lite

UTM readiness only checks structured link availability.

UTM Lite may check whether required UTM fields are present and reviewable.

UTM Lite does not collect, ingest, or attribute analytics.

UTM readiness must not be represented as performance proof or attribution.

## 20. Relationship to AI

AI may suggest missing fields and draft warnings where separately approved.

AI must not approve, publish, spend, or override protected fields.

AI confidence must not replace human approval.

AI must not access external tools, update legal rights confirmations, update approval status, or convert inferred suggestions into confirmed facts without separately approved contracts.

## 21. Example scoring scenarios

### Product campaign with full data

Inputs include campaign basics, product details, target audience, geography, language, offer, CTA, landing destination, creative assets, rights confirmation, channel selection, content requirements, and UTM fields. No blocking condition is active.

Expected planning result: `High` readiness and `pass`, with draft generation and human review preparation recommended.

### Product campaign missing image and offer

Inputs include campaign basics and product description, but no visual reference and no clear offer.

Expected planning result: `Medium` or `Low` readiness depending on other data, likely `soft_pass` or `fail`, with recommendations to improve brief first, add visual reference, define offer, or switch to guided wizard.

### Service campaign with risky claims

Inputs include service details and CTA, but include unsupported medical, financial, legal, or outcome guarantee claims.

Expected planning result: numeric completeness may be high, but risk gate returns `blocked_until_review`.

### Store campaign without landing destination

Inputs include store category, audience, offer, and channels, but no landing destination for a conversion objective.

Expected planning result: `fail` or `blocked_until_review` depending on objective, with required action to clarify landing destination.

### Campaign after approved content is materially edited

Previously approved content is changed after approval, such as headline, CTA, link, offer, channel, body text, image/video, or hashtags.

Expected planning result: `blocked_until_review` until re-review or reapproval occurs under a future approved Approval State Machine Contract.

## 22. Conceptual scoring table

| Input area | Required / optional | Weight | Example missing condition | Impact on gate | Notes |
|---|---|---:|---|---|---|
| Campaign basics | Required | 10% | Missing objective or campaign name. | fail or soft_pass | Planning-only fields. |
| Advertised object | Required | 15% | Product/service/store/offer unclear. | fail | User-provided data only. |
| Audience/geography/language | Required | 10% | Audience too broad or geography missing. | soft_pass or fail | May affect confidence. |
| Offer/CTA | Required for conversion | 10% | Weak or missing CTA. | soft_pass or fail | Unsupported claims may block. |
| Landing destination | Required for conversion | 10% | Destination unclear or absent. | fail or blocked_until_review | No hosting/tracking approval. |
| Creative assets | Optional or required by format | 10% | Missing image/video/reference. | soft_pass | May reduce output quality. |
| Creative rights | Required before publishing support | 10% | Rights not confirmed. | blocked_until_review | Manual confirmation only. |
| Brand/governance constraints | Required where available | 10% | Prohibited claims unknown. | soft_pass or blocked_until_review | High-risk claims block. |
| Content/channel requirements | Required for draft outputs | 10% | No channels selected or content type unclear. | fail or soft_pass | Hashtags/scripts are draft only. |
| UTM/manual publishing readiness | Optional unless needed | 5% | Missing UTM fields or checklist status. | soft_pass | No analytics or attribution. |

## 23. Audit and explanation requirements

Future implementation, if separately approved, should explain each readiness output with:

- score timestamp;
- input snapshot;
- missing fields;
- warnings;
- blocking reasons;
- user action taken.

These are audit/explanation candidates only. They do not approve ERD, OpenAPI, SQL, QA, runtime, or generated-client changes.

## 24. Future ERD impact candidates

Future ERD Patch review may evaluate:

- readiness score snapshot records;
- score component records or JSON structure;
- missing field and warning records;
- blocking reason records;
- input snapshot reference;
- user action taken;
- approval lock and reapproval state;
- checklist readiness status.

No ERD change is approved by this document.

## 25. Future OpenAPI impact candidates

Future OpenAPI Patch review may evaluate:

- endpoint or response surface for campaign readiness score;
- schema for component scores, readiness level, gate state, warnings, and blockers;
- schema for user actions such as improve brief first or switch to guided wizard;
- schema for explanation/audit metadata;
- ErrorModel handling for blocked states.

No OpenAPI change is approved by this document.

## 26. Future QA impact candidates

Future QA/Test Case Plan review may evaluate:

- deterministic scoring component tests;
- readiness level boundary tests;
- gate override tests for blocking conditions;
- soft warning tests;
- approval/reapproval separation tests;
- UTM Lite no-ingestion/no-attribution tests;
- tenant isolation tests for readiness data;
- negative tests for NO-GO capabilities.

No QA change is approved by this document.

## 27. Future Threat Model impact candidates

Future Threat Model Update review may evaluate:

- misleading readiness as approval;
- approval bypass;
- false creative rights confirmation;
- unsupported claims;
- AI suggestions becoming confirmed facts;
- UTM/tracking confusion;
- manual performance data integrity;
- attempts to trigger direct publishing, paid execution, payment, analytics ingestion, attribution, integrations, or autonomous execution;
- cross-workspace access to readiness data.

## 28. Required future contracts before implementation

Future implementation cannot be considered until separately approved documents define the relevant contracts:

- ERD Patch
- OpenAPI Patch
- SQL Migration Plan
- QA/Test Case Plan
- Threat Model Update
- Role & Permission Matrix
- Manual Publishing Evidence Contract
- Approval State Machine Contract
- AI Service Layer Specification
- AI Logging & Privacy Policy

## 29. Recommended sequencing

1. Review and approve this documentation-only scoring contract.
2. Produce Role & Permission Matrix, Approval State Machine Contract, and Manual Publishing Evidence Contract where needed.
3. Produce ERD Patch and OpenAPI Patch proposals for only approved Core V1 scoring concepts.
4. Produce SQL Migration Plan only after ERD approval.
5. Produce QA/Test Case Plan and Threat Model Update before implementation.
6. Produce AI Service Layer Specification and AI Logging & Privacy Policy before any AI-assisted scoring behavior is considered.
7. Only after contracts are approved, consider a separately scoped implementation request with allowed files, forbidden files, verification commands, expected CI gates, and explicit NO-GO items.

## 30. GO / NO-GO decision

GO:

- Documentation-only Campaign Readiness Scoring Contract.
- Future planning discussion.
- Future separately approved ERD/OpenAPI/SQL/QA/Threat Model contract proposals.

NO-GO:

- Implementation from this document.
- ERD, OpenAPI, SQL, QA, runtime, generated client, test, package, workflow, script, migration, prototype, frontend asset, router/store, or implementation changes.
- Treating readiness score as approval.
- Treating readiness score as publishing authorization.
- Direct publishing, social OAuth, scheduling, paid ads, payment, analytics ingestion, attribution, external integrations, autonomous AI execution, or Post V1 module implementation.

## 31. Safe files to edit later if approved

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
- a new Approval State Machine Contract
- a new AI Service Layer Specification
- a new AI Logging & Privacy Policy

Any future edit must be separately approved with explicit allowed files, forbidden files, and verification gates.

## 32. Files that must remain forbidden

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
