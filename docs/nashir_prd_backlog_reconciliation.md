# Nashir PRD / Backlog Reconciliation

## 1. Purpose

This document is documentation-only.

It reconciles the Nashir dual-path customer journey and the Nashir traceability review against current Marketing OS PRD/backlog authority so a future PRD patch and backlog patch can be scoped before any implementation or contract patch.

This document does not approve implementation. This document does not modify PRD, ERD, OpenAPI, SQL, QA, runtime, generated clients, tests, or packages. This document does not itself update V1 scope or backlog. It only recommends what future PRD/backlog patches should include.

## 2. Scope

This review covers Nashir customer journey capabilities from registration through readiness, dual intake, campaign drafting, human approval, manual publishing support, manual evidence, and manual performance review.

It classifies each capability as:

- already aligned with current Phase 0/1 contracts;
- Core V1 candidate requiring PRD/backlog patch;
- documentation-only / planning-only;
- Extended V1 candidate;
- Post V1;
- explicit NO-GO.

## 3. Non-goals

This document does not:

- approve coding or implementation;
- update `docs/02_v1_scope.md`;
- update `docs/04_backlog.md` or the Phase 0/1 backlog;
- change ERD, SQL, OpenAPI, QA, runtime, generated clients, tests, packages, workflows, scripts, migrations, prototype, frontend assets, routers, or stores;
- create endpoints, tables, migrations, repositories, routes, stores, workflow changes, or package changes;
- approve direct publishing, social OAuth, scheduling, paid ads, payment, analytics ingestion, attribution, external integrations, or autonomous AI execution.

## 4. Sources inspected

- `AGENTS.md`
- `README.md`
- `docs/17_change_log.md`
- `docs/02_v1_scope.md`
- `docs/04_backlog.md`
- `docs/06_erd.md`
- `docs/08_api_spec.md`
- `docs/nashir_dual_path_customer_journey_and_campaign_flow.md`
- `docs/nashir_journey_traceability_and_contract_impact_review.md`
- `docs/marketing_os_v5_6_5_phase_0_1_backlog.md`
- `docs/marketing_os_v5_6_5_phase_0_1_erd.md`
- `docs/marketing_os_v5_6_5_phase_0_1_openapi.yaml`

## 5. Current repository authority summary

Marketing OS remains a contract-first Phase 0/1 execution repository. It is not approved for Pilot or Production.

`README.md` and `docs/17_change_log.md` identify a verified baseline through Sprint 4 with selected DB-backed repository slices, while HTTP/runtime product routes remain limited and full DB-backed persistence remains NO-GO unless separately approved.

Since `docs/02_v1_scope.md` remains draft, implementation readiness cannot be inferred from Nashir journey documents alone.

`docs/04_backlog.md` points to `docs/marketing_os_v5_6_5_phase_0_1_backlog.md` as the canonical Phase 0/1 execution backlog and preserves the no auto-publishing, no paid execution, no AI agents, no advanced attribution, no `BillingProvider`, and no `ProviderUsageLog` boundary.

`docs/06_erd.md` points to `docs/marketing_os_v5_6_5_phase_0_1_erd.md` and preserves approved entity naming. `docs/08_api_spec.md` points to `docs/marketing_os_v5_6_5_phase_0_1_openapi.yaml` and forbids endpoints outside OpenAPI scope.

Core V1 remains manual/export/review/approval/evidence only unless later repository authority explicitly changes that.

Direct publishing, social OAuth, scheduling, paid ads, payment, analytics ingestion, attribution, external integrations, and autonomous AI execution remain NO-GO.

Post V1 modules remain reference-only and non-implementable without separate approval.

## 6. Relationship to approved documents

### Nashir journey document

`docs/nashir_dual_path_customer_journey_and_campaign_flow.md` is a documentation-only customer journey and capability scope artifact. It describes desired planning concepts for registration, readiness, dual intake, campaign drafting, approval, manual publishing support, evidence, manual review, AI governance, and Post V1 modules. It does not approve implementation or contract changes.

### Nashir traceability review

`docs/nashir_journey_traceability_and_contract_impact_review.md` traced Nashir concepts against current V1/backlog/ERD/OpenAPI authority and recommended PRD/backlog reconciliation before implementation or contract patches. This document performs that next planning step.

### V1 scope

`docs/02_v1_scope.md` remains draft and does not provide implementation-ready Core V1 authority. A future PRD/scope patch must explicitly decide which Nashir capabilities enter Core V1, Extended V1, Post V1, or NO-GO.

### Phase 0/1 backlog

The current backlog already supports workspace/membership/RBAC, campaign and brief basics, brand profile/rules, templates, media job and versioned asset foundations, approval decisions, publish jobs, manual evidence, tracked links, reports, audit, onboarding, and setup checklist concepts. It does not authorize Nashir-specific readiness dashboards, dual intake runtime, analysis tools, AI service layers, external integrations, direct publishing, paid execution, payment, analytics ingestion, attribution, or autonomous agents.

### ERD

The current ERD partially aligns through `User`, `Workspace`, `WorkspaceMember`, `Role`, `Permission`, `OnboardingProgress`, `SetupChecklistItem`, `BrandProfile`, `BrandVoiceRule`, `Campaign`, `BriefVersion`, `MediaJob`, `MediaAsset`, `MediaAssetVersion`, `ReviewTask`, `ApprovalDecision`, `PublishJob`, `ManualPublishEvidence`, `TrackedLink`, `ClientReportSnapshot`, and `AuditLog`.

Conceptual Nashir profile, readiness, scoring, intake, AI, integration, publishing, payment, analytics, and attribution entities are not approved ERD entities.

### OpenAPI

The current OpenAPI partially aligns through workspace, member, RBAC, brand, template, campaign, brief, media job, asset, review, approval, publish job, manual evidence, tracked link, report, usage, cost, audit, operations, and onboarding paths.

No Google/email sign-in, OTP, readiness dashboard, dual intake, analysis tool, AI, external integration, direct publishing, paid execution, payment, analytics ingestion, or attribution endpoints are approved.

## 7. Reconciliation principles

1. Keep Nashir journey language subordinate to current repository authority.
2. Do not infer implementation readiness from planning documents.
3. Preserve route-derived workspace context and never trust `workspace_id` from request bodies.
4. Preserve AuthGuard, WorkspaceContextGuard, MembershipCheck, PermissionGuard, and ErrorModel behavior.
5. Treat AI outputs as draft, advisory, reviewable, and human-approved only.
6. Treat readiness scores as guidance, not execution authority.
7. Treat UTM Lite as structured link generation only, not analytics ingestion or attribution.
8. Treat manual performance review as user-entered observations only.
9. Treat `CostEvent` as internal cost state only, not billing, invoice, payment, or paid execution state.
10. Keep Post V1 modules reference-only until separate approval.

## 8. Capability classification table

| Capability | Nashir journey source | Traceability decision | PRD status | Backlog status | Recommended classification | Rationale | Required follow-up document |
|---|---|---|---|---|---|---|---|
| Registration / workspace / membership | Sections 6, 7, 35.1 | Partial support through workspace, user, membership, RBAC, guards, and ErrorModel. | Needs Nashir onboarding clarification. | Existing Sprint 0 and Sprint 1 partially align. | Already aligned with current Phase 0/1 contracts | Workspace and membership foundations exist, but Nashir onboarding language must preserve current guardrails. | Role & Permission Matrix |
| Google/email sign-in | Sections 6, 35.1 | Journey context only; no Google auth endpoints approved. | Needs auth journey decision if pursued. | Not in current backlog as Google auth. | Documentation-only / planning-only | May describe sign-in UX, but cannot authorize implementation or external account access. | Threat Model Update |
| Mobile OTP | Sections 6, 35.1 | Journey context only; no OTP endpoints approved. | Needs auth journey decision if pursued. | Not in current backlog. | Extended V1 candidate | Could be future auth scope, but it is not required for manual/export/review/evidence Core V1. | Threat Model Update |
| Readiness Dashboard | Sections 8, 14, 17, 35.2, 35.8 | Requires future contracts; no dashboard contract. | Needs readiness dimensions and user-visible states. | Requires backlog patch if pursued. | Core V1 candidate requiring PRD/backlog patch | Useful for manual campaign readiness, but current authority only has onboarding/setup checklist foundations. | Scoring Contract |
| Agent Mode | Sections 9, 10, 35.3, 35.4, 35.15 | Planning-only; autonomous execution NO-GO. | Needs guided intake and AI boundaries. | AI agents remain NO-GO. | Documentation-only / planning-only | Conversational intake may be planned, but AI execution, protected-field updates, and external tool use are forbidden. | AI Service Layer specification |
| Smart Wizard Mode | Sections 9, 11, 35.3, 35.5 | Intake concept only. | Needs structured manual intake definition. | Requires backlog patch if pursued. | Core V1 candidate requiring PRD/backlog patch | A manual wizard can fit Core V1 if it remains review/confirmation only. | Role & Permission Matrix |
| Intake Orchestration | Sections 12, 35.6 | Conceptual only; no runtime layer approved. | Needs source-of-truth and provenance decisions. | Requires backlog patch. | Core V1 candidate requiring PRD/backlog patch | Normalizing Agent/Wizard inputs is useful, but field source, confidence, and review rules need contracts. | ERD Impact Review |
| Product / Store / Service / Offer intake | Sections 15, 35.5, 35.9, 35.10 | Partial through generic Campaign and BriefVersion content; structured intake not approved. | Needs intake object definitions and data-source limits. | Requires backlog patch for structured fields. | Core V1 candidate requiring PRD/backlog patch | Manual user-provided intake can fit Core V1; automated integrations remain NO-GO. | ERD Impact Review |
| Profile concepts | Sections 13, 14, 35.7, 35.8 | BrandProfile partially aligns; other profiles conceptual only. | Needs profile taxonomy reconciliation. | Requires backlog patch. | Core V1 candidate requiring PRD/backlog patch | Brand profile exists, but StrategicProfile, BusinessIdentity, AudienceProfile, ProductProfile, ServiceProfile, StoreProfile, and GovernanceProfile are not approved entities. | ERD Impact Review |
| Profile Completion | Sections 14, 35.2, 35.8 | Planning-only beyond onboarding/setup checklist. | Needs completion criteria and warning language. | Requires backlog patch if persisted. | Core V1 candidate requiring PRD/backlog patch | Can support manual readiness if it does not auto-approve execution. | Scoring Contract |
| Data Readiness | Sections 14, 35.2, 35.8 | No approved scoring contract. | Needs score semantics and user impact. | Requires backlog patch. | Core V1 candidate requiring PRD/backlog patch | Readiness can guide draft quality, but must not replace review or approval. | Campaign Readiness Scoring Contract |
| Strategy Readiness | Sections 35.2, 35.8 | No approved scoring contract. | Needs dimensions, thresholds, and confidence wording. | Requires backlog patch. | Extended V1 candidate | Strategy scoring may be valuable but exceeds the existing manual evidence foundation. | Scoring Contract |
| Campaign Readiness | Sections 17, 35.2, 35.8, 35.10 | Future scoring/gate contract required. | Needs gate states and blocking semantics. | Requires backlog patch. | Core V1 candidate requiring PRD/backlog patch | A manual readiness gate can align with approval/evidence workflows if separately defined. | Campaign Readiness Scoring Contract |
| Analysis tools | Sections 15, 35.9 | Planning-only; external ingestion NO-GO. | Needs tool-by-tool scope and data-source limits. | Requires backlog patch per tool. | Extended V1 candidate | User-provided-data analysis may be future scope, but tool contracts and threat review are missing. | Analysis Tools Contract |
| Campaign basics | Sections 16, 35.10 | Partial support through Campaign and CampaignStateTransition. | Needs mapping of Nashir fields to current Campaign model. | Existing Sprint 1 partially aligns. | Already aligned with current Phase 0/1 contracts | Campaign name/objective/status exist; additional Nashir fields need patch decisions. | ERD Impact Review |
| Advertised object flow | Section 35.10 | Partial through BriefVersion generic content only. | Needs product/store/service/offer flow decision. | Requires backlog patch. | Core V1 candidate requiring PRD/backlog patch | Manual advertised-object intake fits campaign drafting, but structured objects are not approved. | ERD Impact Review |
| Landing destination | Sections 22, 35.10 | Partial through campaign/brief/tracked-link concepts. | Needs destination field and validation decision. | Requires backlog patch if first-class. | Core V1 candidate requiring PRD/backlog patch | Destination review supports manual publishing and UTM Lite without approving hosting or tracking. | OpenAPI Impact Review |
| Creative rights | Sections 21, 35.10 | Partial through approval and evidence integrity; rights contract missing. | Needs rights confirmation wording and required fields. | Requires backlog patch. | Core V1 candidate requiring PRD/backlog patch | Rights confirmation is essential before manual publishing support, but not fully contracted. | Manual Publishing Evidence Contract |
| Idea intake | Sections 35.10, 35.15 | Draft/advisory planning only. | Needs idea source and confirmation rules. | Requires backlog patch if persisted. | Core V1 candidate requiring PRD/backlog patch | Manual idea intake can feed BriefVersion if reviewed and versioned. | Approval State Machine Contract |
| Content requirements | Sections 18, 35.10, 35.13 | Partial through BriefVersion, MediaAssetVersion, PromptTemplate. | Needs output taxonomy and versioning rules. | Existing Sprints 1-3 partially align. | Core V1 candidate requiring PRD/backlog patch | Draft content outputs fit Core V1 only with human review and approval locks. | Approval State Machine Contract |
| Hashtags per channel | Sections 19, 35.10, 35.15 | Advisory draft content only. | Needs whether first-class or brief content. | Requires backlog patch if structured. | Core V1 candidate requiring PRD/backlog patch | Hashtags can be draft content; no reach guarantee, trend ingestion, or optimization. | QA/Test Cases |
| Video reference scripts | Sections 20, 35.10, 35.15 | Advisory draft content only. | Needs output taxonomy and limitations. | Requires backlog patch if structured. | Core V1 candidate requiring PRD/backlog patch | Scripts are draft/reference outputs only; final video generation/editing remains out of scope. | QA/Test Cases |
| UTM Tracking Lite | Sections 23, 35.12 | Partial support through TrackedLink; no analytics or attribution. | Needs UTM field semantics and no-attribution wording. | Existing Sprint 3 partially aligns. | Core V1 candidate requiring PRD/backlog patch | Structured links support manual publishing, but ingestion and attribution remain NO-GO. | OpenAPI Impact Review |
| Content versioning | Sections 24, 35.13 | Partial through BriefVersion and MediaAssetVersion. | Needs mapping to existing version entities. | Existing Sprints 1-3 partially align. | Already aligned with current Phase 0/1 contracts | Versioned brief/media foundations exist, but Nashir-specific content fields require patch decisions. | Approval State Machine Contract |
| Human approval | Sections 25, 35.10 | Partial support through ReviewTask and ApprovalDecision. | Needs Nashir approval flow mapping. | Existing Sprint 3 aligns partially. | Already aligned with current Phase 0/1 contracts | Human approval is a current Phase 0/1 foundation and must remain mandatory. | Approval State Machine Contract |
| Approval lock | Sections 25, 35.10, 35.13 | Partial through content hash and immutable versions; full lock semantics missing. | Needs material-change and reapproval rules. | Requires backlog patch. | Core V1 candidate requiring PRD/backlog patch | Approval hash integrity exists, but requires_reapproval behavior needs explicit contract. | Approval State Machine Contract |
| Manual publishing checklist | Sections 26, 35.10 | Checklist not separately contracted. | Needs UI-only vs persisted decision. | Requires backlog patch if persisted. | Core V1 candidate requiring PRD/backlog patch | Manual checklist fits Core V1 if it does not trigger direct publishing. | Manual Publishing Evidence Contract |
| Manual publishing evidence | Sections 27, 35.10 | Partial support through ManualPublishEvidence append-only flow. | Needs Nashir evidence field mapping. | Existing Sprint 3 partially aligns. | Already aligned with current Phase 0/1 contracts | User-provided evidence is approved in principle; Nashir-specific fields need mapping. | Manual Publishing Evidence Contract |
| Manual performance review | Sections 28, 35.10 | Partial through ClientReportSnapshot; analytics ingestion NO-GO. | Needs manual observation semantics. | Existing Sprint 4 partially aligns. | Core V1 candidate requiring PRD/backlog patch | User-entered outcomes can fit; automated metrics, attribution, and paid reporting remain forbidden. | QA/Test Cases |
| External integrations | Sections 30, 35.14 | Not supported; NO-GO in Core V1. | Requires separate RFC/PRD. | Not in current backlog. | Explicit NO-GO | Integrations imply OAuth/API access, consent, data retention, and threat model work not approved. | Threat Model Update |
| AI tools and model governance | Sections 31, 35.15 | Planning-only; AI agents forbidden by current authority. | Requires AI governance, logging, privacy, and model rules. | Requires separate backlog. | Documentation-only / planning-only | Draft/advisory AI may be discussed, but no AI runtime or autonomous execution is approved. | AI Logging & Privacy Policy |
| Organic publishing | Sections 32, 35.16 | Post V1 reference-only; direct publishing/OAuth/scheduling NO-GO. | Requires Post V1 PRD/RFC. | Not in Core V1 backlog. | Post V1 | Publishing integrations exceed manual/export/review/evidence Core V1. | OpenAPI Impact Review |
| Paid campaign execution | Sections 33, 35.17 | Post V1 reference-only; paid execution NO-GO. | Requires Post V1 PRD/RFC. | Not in Core V1 backlog. | Explicit NO-GO | Spend, bidding, ad submission, and paid platform status are forbidden. | Threat Model Update |
| Payment | Sections 33, 35.17 | Post V1 reference-only; payment NO-GO. | Requires Post V1 payment/billing PRD/RFC. | Not in Core V1 backlog. | Explicit NO-GO | Billing, invoices, VAT/tax, refunds, and payment providers are not Phase 0/1 scope. | Threat Model Update |
| Analytics ingestion | Sections 28, 30, 35.14, 35.17 | NO-GO; manual observations only. | Requires future analytics PRD/RFC. | Not in Core V1 backlog. | Explicit NO-GO | Current reports are snapshots/manual evidence; ingestion is not approved. | OpenAPI Impact Review |
| Attribution | Sections 23, 28, 30, 35.14, 35.17 | NO-GO; TrackedLink is not attribution. | Requires future attribution PRD/RFC. | Advanced attribution forbidden. | Explicit NO-GO | AttributionDecision is outside approved ERD and OpenAPI. | ERD Impact Review |

## 9. Classification summary

Already aligned with current Phase 0/1 contracts:

- Registration / workspace / membership
- Campaign basics
- Content versioning
- Human approval
- Manual publishing evidence

Core V1 candidate requiring PRD/backlog patch:

- Readiness Dashboard
- Smart Wizard Mode
- Intake Orchestration
- Product / Store / Service / Offer intake
- Profile concepts
- Profile Completion
- Data Readiness
- Campaign Readiness
- Advertised object flow
- Landing destination
- Creative rights
- Idea intake
- Content requirements
- Hashtags per channel
- Video reference scripts
- UTM Tracking Lite
- Approval lock
- Manual publishing checklist
- Manual performance review

Documentation-only / planning-only:

- Google/email sign-in
- Agent Mode
- AI tools and model governance

Extended V1 candidate:

- Mobile OTP
- Strategy Readiness
- Analysis tools

Post V1:

- Organic publishing

Explicit NO-GO:

- External integrations
- Paid campaign execution
- Payment
- Analytics ingestion
- Attribution

## 10. Recommended PRD patch scope

A future PRD patch should:

1. Define Nashir's relationship to Marketing OS as a customer-facing journey unless superseded by later authority.
2. Keep Core V1 manual/export/review/approval/evidence only.
3. Define manual onboarding and workspace/membership prerequisites.
4. Decide whether Readiness Dashboard, Smart Wizard Mode, Intake Orchestration, structured intake, and manual campaign readiness enter Core V1.
5. Define profile concepts without treating conceptual names as ERD entities.
6. Define draft content outputs, hashtag recommendations, video reference scripts, landing destination, UTM Lite, rights confirmation, approval lock, checklist, evidence, and manual performance review boundaries.
7. State that AI and Agent Mode remain planning-only unless separately approved.
8. State that direct publishing, social OAuth, scheduling, paid ads, payment, analytics ingestion, attribution, external integrations, and autonomous AI execution remain NO-GO.

## 11. Recommended backlog patch scope

A future backlog patch should:

1. Map approved Nashir Core V1 candidates to existing Sprint 0-4 stories where possible.
2. Add or refine backlog stories only for manual, reviewable, approval-gated workflows.
3. Define acceptance criteria for readiness warnings, intake confirmation, profile completion, campaign readiness, rights confirmation, approval lock, checklist, UTM Lite, evidence, and manual review.
4. Add explicit QA gates before any implementation request.
5. Preserve existing workspace, membership, permission, tenant isolation, ErrorModel, approval hash, append-only evidence, and report immutability rules.
6. Avoid adding AI agents, external integrations, paid execution, payment, analytics ingestion, attribution, or Post V1 publishing work.

## 12. Items that must not enter Core V1

- Direct publishing
- Social OAuth
- Scheduling
- Paid ads
- Paid campaign execution
- Payment
- Billing provider integration
- Provider usage logs
- Analytics ingestion
- Attribution
- External integrations
- Autonomous AI execution
- AI external tool access
- AI publishing, scheduling, spending, or protected-field updates
- Post V1 Organic Publishing Module implementation
- Post V1 Paid Campaign Execution Module implementation

## 13. Items that require separate contracts before implementation

- Scoring Contract
- Role & Permission Matrix
- Manual Publishing Evidence Contract
- Approval State Machine Contract
- Campaign Readiness Scoring Contract
- AI Service Layer specification
- AI Logging & Privacy Policy
- Analysis Tools Contract
- ERD Impact Review
- OpenAPI Impact Review
- QA/Test Cases
- Threat Model Update

## 14. Recommended sequencing

1. Review and approve this documentation-only reconciliation.
2. Patch `docs/02_v1_scope.md` only if a future approved PR explicitly allows it.
3. Patch the Phase 0/1 backlog only if a future approved PR explicitly allows it.
4. Produce the required scoring, evidence, approval, AI, analysis, ERD, OpenAPI, QA, and threat-model documents for only approved Core V1 items.
5. Only after approved contracts exist, consider a separately scoped implementation request with allowed files, forbidden files, verification commands, expected CI gates, and explicit NO-GO items.

## 15. GO / NO-GO decision

GO:

- Documentation-only PRD/backlog reconciliation.
- Future planning and governance discussion.
- Future PRD/backlog patch proposal limited to manual/export/review/approval/evidence Core V1 candidates.

NO-GO:

- Implementation from this document.
- PRD, ERD, OpenAPI, SQL, QA, runtime, generated client, test, package, workflow, script, migration, prototype, or frontend asset changes.
- Treating Nashir journey documents as implementation-ready while `docs/02_v1_scope.md` remains draft.
- Direct publishing, social OAuth, scheduling, paid ads, payment, analytics ingestion, attribution, external integrations, or autonomous AI execution.
- Treating Post V1 modules as implementable without separate approval.

## 16. Safe files to edit later if approved

If separately approved, later documentation-only patches may edit:

- `docs/17_change_log.md`
- `docs/02_v1_scope.md`
- `docs/04_backlog.md`
- `docs/marketing_os_v5_6_5_phase_0_1_backlog.md`
- a new Scoring Contract document
- a new Role & Permission Matrix document
- a new Manual Publishing Evidence Contract document
- a new Approval State Machine Contract document
- a new Campaign Readiness Scoring Contract document
- a new AI Service Layer specification
- a new AI Logging & Privacy Policy
- a new Analysis Tools Contract document
- a new ERD Impact Review document
- a new OpenAPI Impact Review document
- a new QA/Test Cases document
- a new Threat Model Update document

Any later edit must be separately approved with explicit allowed files, forbidden files, and verification gates.

## 17. Files that must remain forbidden

Unless a future approved request explicitly permits them, the following must remain forbidden:

- `src/`
- `tests/`
- `test/`
- SQL files
- OpenAPI files
- generated clients
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
