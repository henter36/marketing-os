# Nashir Journey Traceability and Contract Impact Review

## 1. Purpose

This document is documentation-only.

It traces the newly merged Nashir dual-path customer journey and campaign flow against current Marketing OS repository authority and identifies contract impact areas before any future documentation patch or implementation request.

This document does not approve implementation.

This document does not modify PRD, ERD, OpenAPI, SQL, QA, runtime, generated clients, tests, or packages.

## 2. Scope

This review covers traceability from `docs/nashir_dual_path_customer_journey_and_campaign_flow.md` to the current V1 scope wrapper, backlog wrapper, Phase 0/1 backlog, ERD, and OpenAPI authority.

The review classifies Nashir capabilities as:

- already supported by existing V1 contracts;
- partially aligned with existing V1 contracts;
- planning-only concepts requiring future contracts;
- Post V1 / NO-GO concepts.

Nashir remains a customer-facing campaign journey and publishing experience within the broader Marketing OS context unless repository authority later defines otherwise.

## 3. Non-goals

This review does not:

- approve implementation;
- introduce product scope;
- modify PRD, Backlog, ERD, OpenAPI, SQL, QA, runtime, generated clients, tests, or packages;
- add endpoints, tables, migrations, repositories, routes, stores, workflow changes, or package changes;
- approve direct publishing, social OAuth, scheduling, paid ads, payment, analytics ingestion, attribution, external integrations, or autonomous AI execution;
- infer implementation readiness from the Nashir journey document alone.

## 4. Sources inspected

- `AGENTS.md`
- `README.md`
- `docs/17_change_log.md`
- `docs/02_v1_scope.md`
- `docs/04_backlog.md`
- `docs/06_erd.md`
- `docs/08_api_spec.md`
- `docs/nashir_dual_path_customer_journey_and_campaign_flow.md`
- `docs/marketing_os_v5_6_5_phase_0_1_backlog.md`
- `docs/marketing_os_v5_6_5_phase_0_1_erd.md`
- `docs/marketing_os_v5_6_5_phase_0_1_openapi.yaml`

## 5. Current repository authority summary

The repository is contract-first and not approved for Pilot or Production.

`README.md` and `docs/17_change_log.md` identify the current repository as a verified Phase 0/1 baseline with selected DB-backed repository slices, while HTTP/runtime product routes remain limited and broader DB-backed persistence remains NO-GO unless separately approved.

`docs/02_v1_scope.md` remains draft. Since `docs/02_v1_scope.md` remains draft, implementation readiness cannot be inferred from the Nashir journey document alone.

`docs/04_backlog.md` points to `docs/marketing_os_v5_6_5_phase_0_1_backlog.md` as the canonical execution backlog and reiterates no auto-publishing, no paid execution, no AI agents, no advanced attribution, no `BillingProvider`, and no `ProviderUsageLog`.

`docs/06_erd.md` points to `docs/marketing_os_v5_6_5_phase_0_1_erd.md` and preserves approved entity names such as `MediaJob`, `MediaAsset`, `MediaAssetVersion`, `ApprovalDecision`, `ManualPublishEvidence`, `UsageMeter`, `CostEvent`, `ClientReportSnapshot`, and `AuditLog`.

`docs/08_api_spec.md` points to `docs/marketing_os_v5_6_5_phase_0_1_openapi.yaml` and forbids endpoints outside OpenAPI scope.

Core V1 remains manual/export/review/approval/evidence only.

Direct publishing, social OAuth, scheduling, paid ads, payment, analytics ingestion, attribution, external integrations, and autonomous AI execution remain NO-GO.

Any PRD, Backlog, ERD, OpenAPI, QA, Threat Model, Scoring, AI Governance, or Evidence work must be separately approved.

## 6. Confirmed facts

- The Nashir journey document is documentation-only.
- The Nashir journey document does not approve implementation.
- The Nashir journey document describes customer-facing journey concepts, not approved ERD entities, API endpoints, SQL, QA, runtime, or generated-client changes.
- Some Nashir concepts partially align with existing Phase 0/1 contracts for workspace, membership, onboarding/setup, campaigns, brief versions, media assets, approval decisions, publish jobs, manual publish evidence, tracked links, and client report snapshots.
- Existing Phase 0/1 contracts do not authorize Nashir-specific readiness dashboards, intake orchestration, conceptual profile entities, readiness scoring, analysis tools, AI service layers, external integrations, direct publishing, analytics ingestion, paid execution, payment, or autonomous agents.
- `CostEvent` does not mean customer billing, invoice state, payment, or paid execution.
- Manual performance review can align only with user-entered observations or frozen report snapshots; analytics ingestion and attribution remain NO-GO.

## 7. Nashir capability traceability matrix

| Capability | Nashir document source | Existing V1 support status | PRD impact | Backlog impact | ERD impact | OpenAPI impact | QA impact | Threat model impact | Decision |
|---|---|---|---|---|---|---|---|---|---|
| Registration / workspace / membership | Sections 6, 7, 35.1 | Partial support through workspace, user, membership, RBAC, AuthGuard, WorkspaceContextGuard, MembershipCheck, PermissionGuard, and ErrorModel guardrails. Google/email and OTP remain journey context only. | Needs PRD clarification for Nashir onboarding/auth journey. | Existing Sprint 0 workspace/RBAC and Sprint 4 onboarding partially align; auth method specifics would need backlog patch. | Existing `User`, `Workspace`, `WorkspaceMember`, `Role`, `Permission`, `OnboardingProgress`, and `SetupChecklistItem` partially align; no new auth entities approved. | Existing workspace/member/RBAC/onboarding paths partially align; no Google/OTP endpoints approved. | Needs cases for any future onboarding/auth journey patch. | Needs auth, membership, invitation, tenant isolation, and abuse review if expanded. | Planning-only beyond existing workspace/membership contracts. |
| Readiness Dashboard | Sections 8, 14, 17, 35.2, 35.8 | Partial conceptual overlap with onboarding/setup checklist; no dashboard contract. | Requires PRD definition of readiness dimensions and user-visible states. | Requires backlog patch if dashboard behavior is pursued. | May require scoring/checklist entities or reuse of existing setup/onboarding entities; not approved. | Requires OpenAPI impact review before any endpoint. | Needs readiness state, warning, and tenant isolation tests. | Needs review for misleading readiness, privacy, and overclaim risk. | Requires future contracts; no implementation. |
| Agent Mode / Smart Wizard | Sections 9, 10, 11, 35.3, 35.4, 35.5 | Not supported as runtime capability; intake concept only. | Requires PRD definition of guided intake, confirmations, and protected fields. | Requires backlog patch; AI agents remain NO-GO. | May require intake/session/answer concepts; not approved. | No approved intake or assistant endpoints. | Needs confirmation, source, inference, and protected-field tests. | Needs prompt injection, consent, data minimization, and protected-field threat review. | Planning-only; autonomous execution NO-GO. |
| Intake Orchestration | Sections 12, 35.6 | Not supported as architecture or runtime layer. | Requires PRD decision whether orchestration is product workflow or internal service. | Requires backlog patch before any implementation. | Possible field provenance/review metadata impact; not approved. | No approved endpoints or schemas. | Needs consistency and source-of-truth tests. | Needs data provenance and tamper-risk review. | Conceptual only. |
| Product / Store / Service / Offer intake | Sections 15, 35.5, 35.9, 35.10 | Partial support through Campaign and BriefVersion as generic campaign/brief content; no dedicated product/store/service/offer contracts. | Requires PRD definition of intake objects and allowed data sources. | Requires backlog patch if structured intake fields are needed. | May need new entities or structured JSON decisions; not approved. | Existing campaign/brief endpoints may carry generic content only; no dedicated endpoints. | Needs validation and source/confirmation tests. | Needs review for public-link use, scraping boundaries, claims, and rights. | Partial only through manual brief content; structured intake requires future contracts. |
| Profile concepts | Sections 13, 14, 35.7, 35.8 | Partial support only for existing BrandProfile/BrandVoiceRule; other profiles are conceptual only. | Requires PRD reconciliation of StrategicProfile, BusinessIdentity, AudienceProfile, ProductProfile, ServiceProfile, StoreProfile, GovernanceProfile, and related concepts. | Requires backlog patch before execution. | Existing BrandProfile aligns partially; other profile concepts have no approved ERD status. | Existing brand profile/rule paths only; no profile family endpoints. | Needs profile confirmation, mutation, and access tests if approved. | Needs protected-field and inference-to-confirmed-fact review. | Keep conceptual until PRD/backlog/ERD reconciliation. |
| Readiness scoring | Sections 14, 17, 35.2, 35.8 | Not supported as approved scoring contract. | Requires scoring definitions, thresholds, confidence wording, and user impact. | Requires backlog patch. | May require scoring signal/snapshot entities; not approved. | No scoring endpoints approved. | Needs deterministic score, warning, and non-blocking/blocking tests. | Needs fairness, explainability, and overreliance review. | Requires future Scoring Contract. |
| Analysis tools | Sections 15, 35.9 | Not supported except as possible manual, user-provided-data planning. | Requires PRD definition of each analysis tool and data-source limits. | Requires backlog patch per tool. | May require analysis run/output records; not approved. | No approved analysis endpoints. | Needs input-source, consent, and no-ingestion tests. | Needs scraping, privacy, and external-source risk review. | Planning-only; external ingestion NO-GO. |
| Campaign basics and lifecycle | Sections 16, 17, 29, 35.10, 35.11 | Partial support through Campaign, CampaignStateTransition, BriefVersion, MediaJob, ReviewTask, ApprovalDecision, PublishJob, ManualPublishEvidence, TrackedLink, and ClientReportSnapshot. Nashir states do not match approved runtime states. | Requires PRD reconciliation of Nashir journey groups and states to existing campaign lifecycle. | Existing Sprints 1-4 partially align; state changes require backlog patch. | Existing campaign and related entities align partially; new state machine values are not approved. | Existing campaign/brief/review/approval/publish/evidence/tracked-link/report paths partially align. | Needs lifecycle, approval gate, and evidence tests for any reconciled patch. | Needs state bypass, approval bypass, and tenant isolation review. | Partial alignment; no state-machine implementation from Nashir doc. |
| Draft brief and content outputs | Sections 18, 24, 25, 35.7, 35.13 | Partial support through BriefVersion, MediaJob, MediaAsset, MediaAssetVersion, PromptTemplate, ReviewTask, and ApprovalDecision. | Requires PRD clarification for content output types and approval lock behavior. | Existing Sprint 1-3 partially align; output expansion requires backlog patch. | Existing versioned brief/media entities partially align; content output fields are not expanded. | Existing brief/media/asset/review/approval paths partially align. | Needs versioning, hash integrity, review, and reapproval tests. | Needs claims, rights, prompt/output retention, and content tampering review. | Partial alignment; future content-output contract required for new fields. |
| Hashtags / video scripts / creative direction | Sections 18, 19, 20, 35.10 | Partial support only as draft content inside BriefVersion/MediaAssetVersion or PromptTemplate types; no dedicated feature contract. | Requires PRD definition if these become first-class outputs. | Requires backlog patch if structured separately. | No dedicated hashtag/script/creative-direction entities approved. | No dedicated endpoints approved. | Needs review/edit/approval tests if structured. | Needs rights, claims, platform policy, and AI-output review. | Advisory draft content only unless future contracts approve more. |
| Rights / policy / approval lock | Sections 21, 25, 35.10, 35.15 | Partial support through ReviewTask, ApprovalDecision, approved content hash, and MediaAssetVersion immutability; no full rights/policy contract. | Requires PRD definition of rights confirmation, policy checks, and material-change reapproval. | Existing Sprint 3 partially aligns; lock behavior needs backlog patch. | Existing ApprovalDecision and MediaAssetVersion support hash-based approval integrity; rights fields are not approved. | Existing review/approval/publish paths partially align. | Needs rights confirmation, material-change, and reapproval tests. | Needs legal claims, content rights, protected approval state, and audit review. | Partial alignment; future Evidence/Approval State Machine contract needed. |
| Manual checklist / evidence | Sections 26, 27, 35.10 | Partial support through PublishJob, ManualPublishEvidence, append-only evidence, supersede, and invalidate. Checklist itself is not separately contracted. | Requires PRD decision whether checklist is UI-only, evidence metadata, or setup entity. | Existing Sprint 3 partially aligns; checklist needs backlog patch if persisted. | ManualPublishEvidence aligns; checklist persistence not approved. | Existing manual evidence paths align partially; no checklist endpoint approved. | Needs append-only, supersede, invalidate, hash, and tenant tests. | Needs evidence tampering and audit review. | Evidence partially supported; checklist requires future contract if persisted. |
| UTM Lite / tracked links | Sections 23, 35.12 | Partial support through TrackedLink tied to PublishJob; no analytics ingestion or attribution. | Requires PRD definition of UTM fields and no-attribution wording. | Existing Sprint 3 tracked links partially align. | Existing TrackedLink aligns partially. | Existing tracked-link paths align partially. | Needs link creation and no-ingestion tests if expanded. | Needs URL validation and tracking/privacy review. | Partial alignment; analytics and attribution remain NO-GO. |
| Manual performance review | Sections 28, 35.10 | Partial support through ClientReportSnapshot and manual evidence references; no analytics ingestion. | Requires PRD definition of user-entered metrics and report semantics. | Existing Sprint 4 reports partially align. | ClientReportSnapshot aligns partially; no performance review entity approved. | Existing client report snapshot paths partially align. | Needs manual-entry and snapshot immutability tests if expanded. | Needs misleading metrics, attribution, and privacy review. | Manual observations only; ingestion/attribution NO-GO. |
| External integrations | Sections 30, 35.14 | Not supported; external integrations are NO-GO in Core V1. | Requires separate RFC/PRD and integration policy. | Requires separately approved backlog. | May require consent, connection, token, audit, and retention entities; not approved. | No integration endpoints approved. | Needs consent, revocation, failure, permission, and tenant tests. | Requires full integration threat model. | NO-GO. |
| AI tools and governance | Sections 31, 35.15 | Not supported as implementation; AI agents are forbidden by current backlog/API authority. Draft/advisory discussion only. | Requires AI Service Layer, model governance, logging/privacy, claims/safety, and human approval PRD. | Requires separately approved backlog. | May require prompt/output/audit/governance entities; not approved. | No AI endpoints approved. | Needs AI safety, logging, protected-field, and approval-bypass tests. | Requires AI-specific threat model and governance review. | Planning-only; autonomous AI execution NO-GO. |
| Post V1 organic publishing | Sections 32, 35.16 | Not supported; direct publishing, OAuth, scheduling, and platform status capture are NO-GO. | Requires Post V1 PRD/RFC. | Requires future backlog after approval. | May require connector/account/publish status entities; not approved. | No publishing integration endpoints approved. | Needs platform, failure, consent, and audit tests if ever approved. | Requires OAuth/token/platform threat model. | Post V1 reference-only / NO-GO. |
| Post V1 paid execution and payment | Sections 33, 35.17 | Not supported; paid execution and payment are NO-GO. `CostEvent` is internal cost state only, not billing or invoice state. | Requires Post V1 PRD/RFC covering paid media, payment, tax, refund, and billing boundaries. | Requires future backlog after approval. | `BillingProvider`, `ProviderUsageLog`, `PaidExecution`, and attribution concepts are out of scope. | No paid execution, payment, or billing provider endpoints approved. | Needs spend, billing, reconciliation, refund, and audit tests if ever approved. | Requires payment, spend authorization, fraud, tax, and platform threat model. | Post V1 reference-only / NO-GO. |

## 8. Capability groups

The matrix above covers these required capability groups:

- Registration / workspace / membership
- Readiness Dashboard
- Agent Mode / Smart Wizard
- Intake Orchestration
- Product / Store / Service / Offer intake
- Profile concepts
- Readiness scoring
- Analysis tools
- Campaign basics and lifecycle
- Draft brief and content outputs
- Hashtags / video scripts / creative direction
- Rights / policy / approval lock
- Manual checklist / evidence
- UTM Lite / tracked links
- Manual performance review
- External integrations
- AI tools and governance
- Post V1 organic publishing
- Post V1 paid execution and payment

## 9. Cross-document conflicts

No blocking source conflict was found among the approved sources for this documentation-only review.

The main tension is authority level, not contradiction:

- `docs/nashir_dual_path_customer_journey_and_campaign_flow.md` is a planning artifact with expanded journey concepts.
- `docs/02_v1_scope.md` remains draft and does not supply implementation-ready Core V1 scope.
- `docs/marketing_os_v5_6_5_phase_0_1_backlog.md`, `docs/marketing_os_v5_6_5_phase_0_1_erd.md`, and `docs/marketing_os_v5_6_5_phase_0_1_openapi.yaml` remain the binding Phase 0/1 contract sources for execution scope.

Therefore Nashir concepts that exceed existing contracts must stay planning-only until future approved documents explicitly reconcile and authorize them.

## 10. Execution risks

- Treating Nashir planning language as implementation approval.
- Treating conceptual profile names as ERD entities.
- Creating endpoints outside the approved OpenAPI contract.
- Accepting `workspace_id` from request bodies instead of route/context.
- Weakening AuthGuard, WorkspaceContextGuard, MembershipCheck, PermissionGuard, or ErrorModel behavior.
- Treating readiness scores as approval or execution authority.
- Treating AI suggestions as confirmed facts or allowing AI to update protected fields.
- Treating UTM Lite as analytics ingestion or attribution.
- Treating user-entered budget/cost observations as spend, payment, billing, or invoice state.
- Treating Post V1 organic or paid modules as Core V1 scope.

## 11. Missing contracts

Future implementation cannot be considered until separately approved documents define the relevant missing contracts, including:

- PRD reconciliation for Nashir within Marketing OS;
- backlog reconciliation;
- ERD impact review;
- OpenAPI impact review;
- SQL impact review;
- QA/test plan;
- Threat Model update;
- Campaign Readiness Scoring Contract;
- AI Governance / AI Service Layer specification;
- Manual Publishing Evidence Contract;
- Approval State Machine Contract;
- Analysis Tools Contract;
- Integration Policy;
- Evidence and audit traceability rules.

## 12. Recommended sequencing of future documentation patches

1. Review and approve this traceability document.
2. Perform PRD/backlog reconciliation to decide which Nashir concepts remain Core V1, which are Build Next, and which are Post V1.
3. Produce an ERD/OpenAPI/SQL impact review for only the approved Core V1 concepts.
4. Produce QA, Threat Model, Evidence, Approval State Machine, Scoring, and AI Governance patches as needed.
5. Only after approved contracts exist, consider a separately scoped implementation request with allowed files, forbidden files, verification commands, and explicit NO-GO items.

## 13. Recommended next documentation patch

The next safe documentation patch should be a PRD/backlog reconciliation only after this traceability document is reviewed and approved.

## 14. GO / NO-GO decision

GO:

- Documentation-only traceability review.
- Future planning discussion.
- Future PRD/backlog reconciliation after review and approval.

NO-GO:

- Implementation from this document.
- PRD, ERD, OpenAPI, SQL, QA, runtime, generated client, test, package, workflow, script, migration, prototype, or frontend asset changes.
- Direct publishing, social OAuth, scheduling, paid ads, payment, analytics ingestion, attribution, external integrations, or autonomous AI execution.
- Treating Nashir as implementation-ready while `docs/02_v1_scope.md` remains draft.

## 15. Safe files to edit later if approved

If separately approved, later documentation-only patches may edit narrowly scoped documentation files such as:

- `docs/17_change_log.md`
- `docs/02_v1_scope.md`
- `docs/04_backlog.md`
- a new PRD/backlog reconciliation document;
- a new ERD impact review document;
- a new OpenAPI impact review document;
- a new QA impact review document;
- a new Threat Model update document;
- a new Scoring Contract document;
- a new AI Governance document;
- a new Evidence or Approval State Machine contract document.

Any such edits must be separately approved with explicit allowed files, forbidden files, and verification gates.

## 16. Files that must remain forbidden

Unless a future implementation or contract patch explicitly approves them, the following must remain forbidden:

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
- any PRD/ERD/API/QA contract file not explicitly listed in a future approved scope
