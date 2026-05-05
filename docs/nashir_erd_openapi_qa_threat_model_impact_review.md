# Nashir ERD / OpenAPI / QA / Threat Model Impact Review

## 1. Purpose

This document is documentation-only.

It identifies potential ERD, OpenAPI, QA, and Threat Model impact areas for the approved Nashir Core V1 scope and backlog planning boundaries after PR #95, PR #96, PR #97, PR #98, and PR #99.

This document does not approve implementation.

This document does not modify ERD, OpenAPI, SQL, QA, runtime, generated clients, tests, packages, or workflows.

This document only identifies potential impact areas.

Existing ERD and OpenAPI remain authoritative until separately patched and approved.

## 2. Scope

This review covers the Nashir Core V1 manual/export/review/approval/evidence scope candidates documented in `docs/02_v1_scope.md` and `docs/04_backlog.md`.

The review identifies:

- current ERD and OpenAPI surfaces that may partially align;
- possible future ERD entities or fields;
- possible future OpenAPI endpoint and schema candidates;
- QA categories needed before implementation;
- Threat Model areas that must be reviewed before implementation.

## 3. Non-goals

This document does not:

- approve backlog execution;
- patch ERD, OpenAPI, SQL, QA, runtime, generated clients, tests, packages, workflows, scripts, migrations, prototype, frontend assets, routers, stores, or implementation files;
- add endpoints, database entities, SQL migrations, tests, runtime tasks, or generated-client tasks;
- create sprint-ready implementation tasks;
- approve Pilot or Production readiness;
- approve direct publishing, social OAuth, scheduling, paid ads, payment, analytics ingestion, attribution, external integrations, autonomous AI execution, or Post V1 module implementation.

## 4. Sources inspected

- `AGENTS.md`
- `README.md`
- `docs/17_change_log.md`
- `docs/02_v1_scope.md`
- `docs/03_decision_log.md`
- `docs/04_backlog.md`
- `docs/06_erd.md`
- `docs/08_api_spec.md`
- `docs/nashir_dual_path_customer_journey_and_campaign_flow.md`
- `docs/nashir_journey_traceability_and_contract_impact_review.md`
- `docs/nashir_prd_backlog_reconciliation.md`
- `docs/marketing_os_v5_6_5_phase_0_1_backlog.md`
- `docs/marketing_os_v5_6_5_phase_0_1_erd.md`
- `docs/marketing_os_v5_6_5_phase_0_1_openapi.yaml`

## 5. Current repository authority summary

Marketing OS remains a contract-first Phase 0/1 execution repository. It is not approved for Pilot or Production.

`README.md` and `docs/17_change_log.md` identify the current repository as verified through Sprint 4 with selected DB-backed repository slices, while HTTP/runtime product routes remain limited and full DB-backed persistence remains NO-GO unless separately approved.

`docs/02_v1_scope.md` is the V1 / Phase 0-1 scope authority document and now clarifies Nashir Core V1 scope boundaries. It does not approve implementation by itself.

`docs/04_backlog.md` remains the backlog/index/governance document. It points to `docs/marketing_os_v5_6_5_phase_0_1_backlog.md` as the detailed backlog source and adds Nashir Core V1 backlog planning boundaries only.

`docs/06_erd.md` points to `docs/marketing_os_v5_6_5_phase_0_1_erd.md` as the approved ERD source. `docs/08_api_spec.md` points to `docs/marketing_os_v5_6_5_phase_0_1_openapi.yaml` as the approved OpenAPI source.

Core V1 remains manual/export/review/approval/evidence only.

Direct publishing, social OAuth, scheduling, paid ads, payment, analytics ingestion, attribution, external integrations, autonomous AI execution, and Post V1 module implementation remain NO-GO.

Any future ERD/OpenAPI/SQL/QA/Threat Model work must be separately approved with explicit allowed files, forbidden files, and verification gates.

## 6. Confirmed Nashir Core V1 scope after PR #98 and #99

Nashir is the customer-facing campaign journey and publishing experience within the broader Marketing OS context. It does not rename approved repository entities, create approved ERD entities, or change approved API/SQL/runtime contracts.

Approved Core V1 Nashir planning boundaries are:

- Readiness Dashboard as a planning and visibility layer.
- Smart Wizard as manual structured intake.
- Product / Store / Service / Offer intake using user-provided data, uploaded files, or explicitly allowed public links only.
- Campaign basics and advertised object flow for manual campaign planning.
- Landing destination capture and review.
- Creative rights confirmation.
- Idea intake.
- Content requirements.
- Hashtags per selected channel as draft recommendations only.
- Video reference scripts as draft/reference outputs only.
- UTM Tracking Lite as structured link generation only.
- Human approval before manual publishing support.
- Approval lock as a scope principle.
- Manual publishing checklist.
- Manual publishing evidence.
- Manual performance review using user-entered data only.

Outside Core V1 and outside backlog implementation scope:

- Agent Mode runtime
- AI Service Layer implementation
- external integrations
- direct publishing
- social OAuth
- scheduling
- paid ads
- payment
- analytics ingestion
- attribution
- autonomous AI execution
- Post V1 Organic Publishing Module
- Post V1 Paid Campaign Execution Module

## 7. Impact review principles

1. Treat this review as impact identification only.
2. Do not treat any future candidate as approved contract work.
3. Preserve current entity naming: `MediaJob`, `MediaAsset`, `MediaAssetVersion`, `ApprovalDecision`, `ManualPublishEvidence`, `UsageMeter`, `CostEvent`, `ClientReportSnapshot`, and `AuditLog`.
4. Do not create `GenerationJob`, `Asset`, `Approval`, `BillingProvider`, `ProviderUsageLog`, `AIProvider`, `AIModelRegistry`, `AttributionDecision`, `SocialAutoPublishConnector`, `PaidExecution`, or `AgentRun`.
5. Preserve route-derived workspace context and never trust `workspace_id` from request bodies.
6. Preserve AuthGuard, WorkspaceContextGuard, MembershipCheck, PermissionGuard, and ErrorModel behavior.
7. Keep UTM Tracking Lite separate from analytics ingestion and attribution.
8. Keep manual performance review separate from platform analytics, paid reporting, and attribution.
9. Keep AI language draft, advisory, reviewable, and non-executing unless later authority explicitly changes it.

## 8. ERD impact review

### Capabilities already partially supported by existing ERD

Existing ERD concepts partially support Nashir planning through:

- `Workspace`, `WorkspaceMember`, `Role`, and `Permission` for workspace access and authorization.
- `OnboardingProgress` and `SetupChecklistItem` for limited setup/readiness adjacency.
- `BrandProfile` and `BrandVoiceRule` for brand guidance.
- `Campaign` and `CampaignStateTransition` for campaign basics and lifecycle tracking.
- `BriefVersion` for versioned draft planning content.
- `MediaAsset` and `MediaAssetVersion` for versioned content/asset approval integrity.
- `ReviewTask` and `ApprovalDecision` for human review and approval.
- `PublishJob` for approved manual publishing support.
- `ManualPublishEvidence` for user-provided evidence.
- `TrackedLink` for link records without advanced attribution.
- `ClientReportSnapshot` for frozen manual/reporting snapshots.
- `AuditLog` for sensitive write traceability where approved.

### Capabilities that may require new entities

Future ERD patch review may need to decide whether new entities are required for:

- structured Smart Wizard intake sessions and answers;
- advertised object intake if product, store, service, or offer must be first-class instead of brief content;
- readiness dashboard snapshots or checklist groupings;
- campaign readiness scoring snapshots;
- approval lock or reapproval state history if current approval/version primitives are insufficient;
- manual publishing checklist items if checklist state must persist separately from evidence;
- manual performance review records if `ClientReportSnapshot` cannot represent user-entered observations cleanly.

These are impact candidates only. No new entity is approved by this document.

### Capabilities that may require new fields

Future ERD patch review may need to evaluate fields for:

- landing destination URL/type and validation status;
- creative rights confirmation status, notes, timestamp, and confirmer;
- content requirement type, channel, and output category;
- hashtag sets per selected channel;
- video reference script type and draft status;
- UTM parameters for source, medium, campaign, content, and optional term;
- approval lock state, material-change reason, and reapproval requirement;
- manual checklist completion state;
- manual performance review user-entered metrics and notes.

These are field candidates only. No field is approved by this document.

### Capabilities that should remain conceptual

The following should remain conceptual unless a future approved ERD patch explicitly changes them:

- Readiness Dashboard as a display layer;
- profile completion and readiness scoring labels;
- Smart Wizard orchestration;
- idea intake recommendation logic;
- content requirement grouping;
- hashtag and video script categorization;
- manual performance interpretation and next-action suggestions;
- AI suggestions and draft advisory notes.

### Capabilities that must remain NO-GO

The following must remain out of ERD scope for Core V1:

- Agent Mode runtime entities;
- AI Service Layer entities;
- external integration connection/token entities;
- social OAuth entities;
- direct publishing connector entities;
- scheduling entities;
- paid ads entities;
- payment, invoice, refund, tax, or billing provider entities;
- analytics ingestion entities;
- attribution entities;
- autonomous execution entities;
- Post V1 Organic Publishing Module entities;
- Post V1 Paid Campaign Execution Module entities.

## 9. OpenAPI impact review

### Existing endpoint surfaces that may partially align

Current OpenAPI surfaces that may partially align with Nashir Core V1 planning include:

- workspace, member, and RBAC paths for workspace context and permissions;
- brand profile and brand voice rule paths for brand guidance;
- campaign and campaign state transition paths for campaign basics;
- brief version paths for versioned draft content;
- review task and approval decision paths for human review and approval;
- publish job paths for approved manual publishing support;
- manual evidence paths for append-only evidence submission, supersede, and invalidate;
- tracked link paths for link records without analytics ingestion or attribution;
- client report snapshot paths for frozen report/manual review artifacts;
- onboarding progress paths for limited readiness adjacency.

### Future endpoint candidates

Future OpenAPI patch review may need to evaluate endpoint candidates for:

- readiness dashboard read surfaces;
- Smart Wizard session and answer capture;
- structured product/store/service/offer intake;
- landing destination capture and validation;
- creative rights confirmation;
- content requirements and draft output grouping;
- hashtag and video reference script draft outputs;
- UTM Tracking Lite link generation and review;
- approval lock/reapproval workflow;
- manual publishing checklist state;
- manual performance review using user-entered data only.

These are future candidates only. No endpoint is approved by this document.

### Endpoints explicitly not approved

The following endpoint categories remain explicitly not approved:

- Agent Mode runtime or assistant execution endpoints;
- AI Service Layer/model invocation endpoints;
- external integration connection endpoints;
- social OAuth connect/callback/revocation endpoints;
- direct publishing endpoints;
- scheduling endpoints;
- paid ads or campaign submission endpoints;
- payment, invoice, tax, refund, or billing provider endpoints;
- analytics ingestion endpoints;
- attribution endpoints;
- autonomous execution endpoints;
- Post V1 Organic Publishing Module endpoints;
- Post V1 Paid Campaign Execution Module endpoints.

### Schemas likely requiring future review

Future OpenAPI patch review may need to define or extend schemas for:

- ReadinessDashboardResponse;
- SmartWizardSession and SmartWizardAnswer;
- ProductIntake, StoreIntake, ServiceIntake, OfferIntake;
- LandingDestination;
- CreativeRightsConfirmation;
- IdeaIntake;
- ContentRequirement;
- ChannelHashtagDraft;
- VideoReferenceScriptDraft;
- UtmTrackingLiteRequest/Response;
- ApprovalLockState;
- ManualPublishingChecklist;
- ManualPerformanceReview.

These names are descriptive placeholders only. They do not create approved schema names.

### Request/response governance concerns

Future OpenAPI work must preserve:

- `workspaceId` from route/context only;
- no trusted `workspace_id` in request bodies;
- ErrorModel responses;
- permission metadata for protected paths;
- audit metadata for sensitive writes;
- idempotency where the approved contract requires it;
- no endpoint outside approved OpenAPI scope;
- clear wording that UTM Lite does not ingest analytics or provide attribution;
- clear wording that manual performance review uses user-entered data only.

## 10. QA impact review

### Documentation-only QA implications

This document does not add QA cases or modify QA contracts. It identifies future QA categories that must be separately approved before implementation.

### Future test categories

Future QA/Test Case Plan work should cover:

- tenant isolation and workspace authorization;
- RBAC/permission boundaries;
- input validation and ErrorModel consistency;
- manual intake confirmation;
- readiness warning behavior;
- approval and reapproval rules;
- evidence immutability;
- UTM Lite no-ingestion/no-attribution behavior;
- manual performance review data integrity;
- negative tests for NO-GO capabilities.

### Manual workflow test areas

Future tests should verify:

- Smart Wizard captures only user-provided or explicitly allowed public-link data;
- product/store/service/offer intake remains manual and reviewable;
- campaign basics and advertised object flow preserve workspace context;
- landing destination is reviewed and validated;
- content requirements, hashtags, and video scripts remain draft/reference outputs;
- manual publishing checklist does not trigger direct publishing.

### Approval/reapproval test areas

Future tests should verify:

- human approval is required before manual publishing support;
- material changes after approval require re-review or reapproval;
- approval lock cannot be bypassed by editing text, CTA, link, hashtags, offer, channel, image/video, or other material content;
- rejected or stale approvals cannot create publish support artifacts;
- approved content hash behavior remains consistent with existing contracts.

### Evidence integrity test areas

Future tests should verify:

- ManualPublishEvidence remains append-only;
- evidence cannot be patched or deleted;
- supersede/invalidate behavior preserves history;
- evidence is tied to the approved workspace, publish job, and approved content context;
- report snapshots do not mutate after evidence changes.

### Tenant isolation test areas

Future tests should verify:

- users cannot access another workspace's readiness, intake, campaign, approval, checklist, evidence, tracked link, or manual review data;
- every workspace-scoped query filters by route-derived workspace context;
- request body `workspace_id` is ignored or rejected as a trusted source;
- unauthorized users receive ErrorModel-compatible failures.

### Negative tests for NO-GO capabilities

Future tests should explicitly reject or confirm absence of:

- Agent Mode runtime execution;
- AI Service Layer execution;
- external integration connection;
- direct publishing;
- social OAuth;
- scheduling;
- paid ad execution;
- payment or billing provider behavior;
- analytics ingestion;
- attribution;
- autonomous campaign execution;
- Post V1 module implementation.

## 11. Threat Model impact review

### Tenant isolation

Nashir planning adds more user-facing workflow surfaces. Any future implementation must prevent cross-workspace reads/writes for readiness, intake, campaign drafts, approval state, evidence, checklist, links, and manual performance review.

### Workspace authorization

Future paths must preserve AuthGuard, WorkspaceContextGuard, MembershipCheck, PermissionGuard, and ErrorModel behavior. Role and permission decisions require a separate Role & Permission Matrix.

### Approval bypass

The largest workflow risk is publishing support without valid human approval. Approval lock and reapproval rules must prevent stale, modified, rejected, or unreviewed content from moving into manual publishing support.

### Evidence tampering

Manual evidence must remain append-only. Supersede and invalidate operations must preserve history and must not mutate frozen report snapshots.

### Creative rights misuse

Rights confirmation must not imply legal verification automation. Threat review must address false confirmations, third-party assets, identifiable people, third-party marks, AI-generated assets, and misleading rights language.

### Misleading claims

Content requirements, hashtags, scripts, and campaign suggestions may produce risky claims. Threat review must cover prohibited claims, unsupported claims, restricted content, unclear offer terms, and misleading promises.

### AI suggestion misuse

AI language remains planning-only. Future AI work must prevent suggestions from becoming confirmed facts, protected field updates, approvals, publishing actions, spend actions, or external tool calls without separate approved contracts.

### UTM/tracking confusion

UTM Tracking Lite must be framed as structured link generation only. Threat review must prevent users or system copy from treating UTM links as analytics ingestion, attribution, or performance proof.

### Manual performance data integrity

Manual performance review uses user-entered data only. Threat review must address unverifiable metrics, misleading reports, incorrect attribution, paid spend confusion, and changes after snapshots.

### External integration risks

External integrations remain NO-GO. Future integration proposals would require consent, revocation, token storage, data retention, audit, failure handling, permission boundaries, and tenant isolation review.

### Paid execution/payment risks

Paid execution and payment remain NO-GO. Future proposals would require spend authorization, budget controls, fraud review, refunds, tax/VAT, invoice boundaries, billing provider governance, and platform policy review.

## 12. Capability impact matrix

| Capability | Current support | ERD impact | OpenAPI impact | QA impact | Threat model impact | Decision |
|---|---|---|---|---|---|---|
| Readiness Dashboard | Partial adjacency through OnboardingProgress and SetupChecklistItem. | May require readiness snapshot/checklist/scoring fields or entities. | May require read endpoints and response schemas. | Readiness state, warning, tenant isolation, and no-execution tests. | Misleading readiness and overreliance risk. | Impact review only; future contracts required. |
| Smart Wizard | No dedicated support; manual intake concept only. | May require session/answer/provenance entities or fields. | May require wizard session/answer endpoints. | Manual confirmation, source, validation, and protected-field tests. | Sensitive data, confirmation, and source-of-truth risk. | Core V1 candidate; future contracts required. |
| Product / Store / Service / Offer intake | Partial through Campaign and BriefVersion content. | May require structured intake entities/fields or remain brief content. | May require structured intake schemas/endpoints. | User-provided data, validation, and no-integration tests. | Scraping, claims, rights, and data-source confusion risk. | Core V1 candidate; future contracts required. |
| Campaign basics and advertised object flow | Partial through Campaign, CampaignStateTransition, and BriefVersion. | May require additional campaign/intake fields. | Existing campaign/brief paths partially align; new fields need review. | Campaign lifecycle and workspace isolation tests. | State bypass and tenant access risk. | Partially aligned; patch review required. |
| Landing destination | Partial through brief/tracked link concepts. | May require destination fields. | May require destination schema or tracked-link extension. | URL validation and no-hosting/no-tracking tests. | Phishing, unsafe URL, and tracking confusion risk. | Future contracts required. |
| Creative rights confirmation | Partial through approval/evidence workflow. | May require rights confirmation fields/entities. | May require rights confirmation request/response schema. | Rights confirmation and reapproval tests. | False rights claims and legal overclaim risk. | Future contracts required. |
| Idea intake | Partial through BriefVersion content. | May require idea/source fields if persisted. | May require idea intake schema. | Draft/review/version tests. | Inferred suggestion as fact risk. | Future contracts required. |
| Content requirements | Partial through BriefVersion, MediaAssetVersion, PromptTemplate. | May require output taxonomy fields. | May require content requirement schemas. | Draft/edit/review/approval tests. | Misleading claims and policy risk. | Future contracts required. |
| Hashtags per channel | Not first-class; possible draft content. | May require channel hashtag fields if structured. | May require hashtag draft schema. | Human review and no reach guarantee tests. | Trend/optimization/attribution confusion risk. | Draft-only; future contracts required. |
| Video reference scripts | Not first-class; possible draft content. | May require script draft fields if structured. | May require video script draft schema. | Draft/reference only and no generation/editing tests. | Rights, claims, and final-media confusion risk. | Draft-only; future contracts required. |
| UTM Tracking Lite | Partial through TrackedLink. | May require UTM parameter fields. | May require UTM request/response schema or tracked-link extension. | No analytics ingestion/no attribution tests. | Tracking and attribution confusion risk. | Future contracts required. |
| Human approval | Partial through ReviewTask and ApprovalDecision. | Existing entities partially align. | Existing review/approval endpoints partially align. | Approval required before manual publishing support. | Approval bypass risk. | Partially aligned; contract mapping required. |
| Approval lock | Partial through content hash and immutable versions. | May require lock/reapproval state fields. | May require reapproval/lock schema or endpoints. | Material-change and stale-approval tests. | Bypass and tampering risk. | Future Approval State Machine Contract required. |
| Manual publishing checklist | No dedicated support. | May remain UI-only or require checklist fields/entities. | May require checklist endpoint/schema if persisted. | Checklist cannot publish or schedule tests. | User confusion with direct publishing risk. | Future contracts required if persisted. |
| Manual publishing evidence | Partial through ManualPublishEvidence. | Existing entity partially aligns; field mapping may be needed. | Existing manual evidence endpoints partially align. | Append-only, supersede, invalidate, and hash tests. | Evidence tampering risk. | Partially aligned; Evidence Contract required. |
| Manual performance review | Partial through ClientReportSnapshot. | May require manual review fields/entity or snapshot extension. | May require manual review schema/endpoint. | User-entered data, snapshot immutability, no ingestion tests. | Metric integrity and attribution confusion risk. | Future contracts required. |
| Agent Mode runtime | Not supported. | AgentRun remains out of scope. | Assistant/runtime endpoints not approved. | Negative absence/rejection tests only. | Autonomous execution and protected-field update risk. | NO-GO. |
| AI Service Layer | Not supported. | AIProvider/AIModelRegistry remain out of scope. | AI invocation endpoints not approved. | Negative absence/rejection tests only. | Prompt, privacy, tool use, and approval bypass risk. | NO-GO. |
| External integrations | Not supported. | Connection/token entities not approved. | Integration endpoints not approved. | Negative absence/rejection tests only. | Consent, token, retention, and tenant risk. | NO-GO. |
| Direct publishing | Not supported. | SocialAutoPublishConnector remains out of scope. | Direct publish endpoints not approved. | Negative absence/rejection tests only. | Unauthorized publishing and platform risk. | NO-GO. |
| Social OAuth | Not supported. | OAuth connection/token entities not approved. | OAuth endpoints not approved. | Negative absence/rejection tests only. | Token theft, consent, and revocation risk. | NO-GO. |
| Scheduling | Not supported. | Scheduling entities not approved. | Scheduling endpoints not approved. | Negative absence/rejection tests only. | Unintended publish timing risk. | NO-GO. |
| Paid ads | Not supported. | PaidExecution remains out of scope. | Paid ad endpoints not approved. | Negative absence/rejection tests only. | Spend authorization and platform policy risk. | NO-GO. |
| Payment | Not supported. | BillingProvider and payment entities not approved. | Payment/billing endpoints not approved. | Negative absence/rejection tests only. | Fraud, tax, refund, and invoice risk. | NO-GO. |
| Analytics ingestion | Not supported. | Analytics ingestion entities not approved. | Analytics ingestion endpoints not approved. | Negative absence/rejection tests only. | Privacy, accuracy, and retention risk. | NO-GO. |
| Attribution | Not supported; TrackedLink is not attribution. | AttributionDecision remains out of scope. | Attribution endpoints not approved. | Negative absence/rejection tests only. | Misattribution and misleading performance risk. | NO-GO. |

## 13. Required future contracts before implementation

Future implementation cannot be considered until separately approved documents define the relevant contracts:

- ERD Patch
- OpenAPI Patch
- SQL Migration Plan
- QA/Test Case Plan
- Threat Model Update
- Scoring Contract
- Role & Permission Matrix
- Manual Publishing Evidence Contract
- Approval State Machine Contract
- Campaign Readiness Scoring Contract
- AI Service Layer Specification
- AI Logging & Privacy Policy
- Analysis Tools Contract

## 14. Recommended sequencing

1. Review and approve this documentation-only impact review.
2. Produce a focused ERD Patch proposal for only approved Core V1 candidates.
3. Produce a focused OpenAPI Patch proposal aligned with the ERD Patch and existing API rules.
4. Produce SQL Migration Plan only after ERD approval.
5. Produce QA/Test Case Plan and Threat Model Update before implementation.
6. Produce supporting Scoring, Role & Permission, Evidence, Approval State Machine, AI, Privacy, and Analysis Tools contracts where relevant.
7. Only after contracts are approved, consider a separately scoped implementation request with allowed files, forbidden files, verification commands, expected CI gates, and explicit NO-GO items.

## 15. GO / NO-GO decision

GO:

- Documentation-only impact review.
- Future planning discussion.
- Future separately approved ERD/OpenAPI/SQL/QA/Threat Model contract proposals.

NO-GO:

- Implementation from this document.
- ERD, OpenAPI, SQL, QA, runtime, generated client, test, package, workflow, script, migration, prototype, frontend asset, router/store, or implementation changes.
- Direct publishing, social OAuth, scheduling, paid ads, payment, analytics ingestion, attribution, external integrations, autonomous AI execution, or Post V1 module implementation.
- Treating any candidate endpoint, schema, field, entity, or test category in this document as approved.

## 16. Safe files to edit later if approved

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
- a new Scoring Contract
- a new Role & Permission Matrix
- a new Manual Publishing Evidence Contract
- a new Approval State Machine Contract
- a new Campaign Readiness Scoring Contract
- a new AI Service Layer Specification
- a new AI Logging & Privacy Policy
- a new Analysis Tools Contract

Any future edit must be separately approved with explicit allowed files, forbidden files, and verification gates.

## 17. Files that must remain forbidden

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
