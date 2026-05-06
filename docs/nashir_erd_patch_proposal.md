# Nashir ERD Patch Proposal

## 1. Purpose

This document is documentation-only.

This document creates a reuse-first ERD Patch Proposal for Nashir Core V1 based on the merged Nashir ERD Patch Planning Gate and the ERD Gate Decision Review outcome supplied for this task.

This document does not approve actual ERD changes.

This document does not approve SQL changes.

This document does not approve OpenAPI changes.

This document does not approve QA, runtime, generated clients, tests, packages, workflows, or implementation.

This document only proposes future ERD patch options.

Existing ERD remains authoritative until separately patched and approved.

Reuse-first is mandatory.

Candidate entities and fields are planning-only.

Core V1 remains manual/export/review/approval/evidence only.

Direct publishing, social OAuth, scheduling, paid ads, payment, analytics ingestion, attribution, external integrations, autonomous AI execution, and Post V1 module implementation remain NO-GO.

OpenAPI, SQL, QA, Threat Model, runtime, and implementation remain NO-GO.

Any actual ERD patch must be separately approved with explicit allowed files, forbidden files, verification commands, expected CI gates, rollback criteria, and NO-GO boundaries.

## 2. Scope

This proposal maps Nashir Core V1 planning capabilities to current approved ERD reuse candidates and identifies minimal future patch options.

It is limited to ERD planning for:

- manual campaign intake and campaign preparation;
- readiness as advisory status only;
- human review and approval;
- approval lock and material-change awareness;
- manual publishing checklist support;
- user-provided manual publishing evidence;
- UTM Tracking Lite without analytics ingestion or attribution;
- manual performance review using user-entered data only;
- workspace-scoped roles, permissions, and audit expectations.

## 3. Non-goals

This document does not:

- patch `docs/06_erd.md` or `docs/marketing_os_v5_6_5_phase_0_1_erd.md`;
- modify SQL, OpenAPI, QA, runtime, generated clients, tests, package files, workflows, scripts, migrations, prototype, frontend assets, router/store files, or implementation files;
- approve new tables, fields, enum values, indexes, constraints, endpoints, schemas, migrations, repositories, routes, stores, or tests;
- authorize Pilot or Production readiness;
- treat readiness as approval;
- treat evidence as publishing authorization;
- treat `TrackedLink` as analytics ingestion or attribution;
- treat `CostEvent` as billing, invoice, payment, or paid execution state;
- authorize direct publishing, social OAuth, scheduling, paid ads, payment, analytics ingestion, attribution, external integrations, autonomous AI execution, or Post V1 module implementation.

## 4. Sources inspected

- `AGENTS.md`
- `README.md`
- `docs/17_change_log.md`
- `docs/03_decision_log.md`
- `docs/02_v1_scope.md`
- `docs/04_backlog.md`
- `docs/06_erd.md`
- `docs/08_api_spec.md`
- `docs/nashir_erd_patch_planning_gate.md`
- `docs/nashir_erd_openapi_qa_threat_model_impact_review.md`
- `docs/nashir_prd_backlog_reconciliation.md`
- `docs/nashir_campaign_readiness_scoring_contract.md`
- `docs/nashir_approval_state_machine_contract.md`
- `docs/nashir_manual_publishing_evidence_contract.md`
- `docs/nashir_role_permission_matrix.md`
- `docs/marketing_os_v5_6_5_phase_0_1_erd.md`
- `docs/marketing_os_v5_6_5_phase_0_1_backlog.md`
- `docs/marketing_os_v5_6_5_phase_0_1_openapi.yaml`

## 5. Current repository authority summary

Marketing OS remains a contract-first Phase 0/1 execution repository. It is not approved for Pilot or Production.

`README.md` and `docs/17_change_log.md` identify a verified baseline through Sprint 4 with selected DB-backed repository slices. HTTP/runtime product routes remain limited, and full DB-backed persistence remains NO-GO unless separately approved.

`docs/02_v1_scope.md` defines Nashir Core V1 as manual/export/review/approval/evidence only. It does not approve implementation by itself.

`docs/04_backlog.md` documents Nashir backlog planning boundaries only. It does not create sprint-ready implementation tasks.

`docs/06_erd.md` points to `docs/marketing_os_v5_6_5_phase_0_1_erd.md` as the approved ERD authority. Section 52 remains the relationship authority.

`docs/08_api_spec.md` points to `docs/marketing_os_v5_6_5_phase_0_1_openapi.yaml` as the approved OpenAPI authority and forbids endpoints outside OpenAPI scope.

The approved ERD uses `MediaJob`, `MediaAsset`, `MediaAssetVersion`, `ApprovalDecision`, `ManualPublishEvidence`, `UsageMeter`, `CostEvent`, `ClientReportSnapshot`, and `AuditLog`. It forbids standalone `GenerationJob`, `Asset`, `Approval`, `BillingProvider`, and `ProviderUsageLog` under current authority.

The approved ERD includes `RolePermission`. Therefore RBAC reuse must start with `WorkspaceMember`, `Role`, `Permission`, and `RolePermission` before any policy or assignment table is proposed.

## 6. Relationship to approved Nashir documents

### Nashir ERD Patch Planning Gate

`docs/nashir_erd_patch_planning_gate.md` established the reuse-first planning gate. This proposal is the next documentation-only step and narrows the future ERD patch options without changing the ERD.

### ERD Gate Decision Review

The ERD Gate Decision Review outcome for this task is treated as governance input: GO only for an ERD patch proposal, NO-GO for an actual ERD patch now, current ERD remains authoritative, existing entities must be reused first, candidate entities and fields remain planning-only until proven necessary, and OpenAPI, SQL, QA, Threat Model, runtime, and implementation remain NO-GO.

### Campaign Readiness Scoring Contract

`docs/nashir_campaign_readiness_scoring_contract.md` keeps readiness advisory, explainable, and separate from approval and publishing authorization. ERD proposals must not make readiness a source of approval truth or publishing eligibility.

### Approval State Machine Contract

`docs/nashir_approval_state_machine_contract.md` keeps approval human, version-bound, auditable, and separate from direct publishing or paid execution. ERD proposals must preserve approval lock and material-change reapproval boundaries.

### Manual Publishing Evidence Contract

`docs/nashir_manual_publishing_evidence_contract.md` keeps evidence user-provided, external to publishing execution, and separate from analytics ingestion, attribution, or paid performance. ERD proposals must reuse `ManualPublishEvidence` first.

### Role & Permission Matrix

`docs/nashir_role_permission_matrix.md` keeps permissions workspace-scoped and requires protected actions to be explicit and auditable. ERD proposals must reuse existing RBAC before adding policy overlays.

## 7. Reuse-first ERD proposal principles

1. Reuse existing approved Phase 0/1 entities before proposing new entities.
2. Do not rename approved entities.
3. Prefer versioned JSON content in `BriefVersion` or `MediaAssetVersion` before first-class Nashir tables.
4. Prefer existing status, notes, hashes, immutable records, and `AuditLog` before new transition tables.
5. Treat readiness as advisory and not approval.
6. Treat manual publishing evidence as user-provided proof and not publishing authorization.
7. Treat UTM Tracking Lite as structured link support only, not analytics ingestion or attribution.
8. Preserve route-derived workspace context and tenant isolation.
9. Preserve AuthGuard, WorkspaceContextGuard, MembershipCheck, PermissionGuard, and ErrorModel behavior.
10. Do not introduce Post V1 scope through ERD structure.

## 8. Existing ERD reuse candidates

| Existing entity | Reuse proposal |
|---|---|
| `Campaign` | Reuse for campaign basics, objective, status, workspace/customer ownership, and campaign-level grouping. |
| `BriefVersion` | Reuse for versioned manual intake, advertised object detail, landing destination notes, idea intake, content requirements, hashtags, video reference scripts, and structured-but-not-first-class Nashir content. |
| `ApprovalDecision` | Reuse as approval truth for reviewed `MediaAssetVersion`; do not create `Approval`. |
| `ManualPublishEvidence` | Reuse for append-only user-provided proof of external manual publishing. |
| `TrackedLink` | Reuse for UTM Tracking Lite records tied to `PublishJob`; do not treat as attribution. |
| `ClientReportSnapshot` | Reuse for frozen manual performance review snapshots using user-entered observations. |
| `AuditLog` | Reuse for sensitive transition history where it is enough; do not make it a business state source. |
| `Workspace` | Reuse as tenant boundary. |
| `WorkspaceMember` | Reuse for workspace membership and role assignment context. |
| `Role` | Reuse for baseline workspace role authority. |
| `Permission` | Reuse for protected-action authorization codes. |
| `RolePermission` | Reuse because it is present in the approved ERD authority. |
| `MediaAsset` | Reuse as the asset grouping for generated/reviewable campaign material. |
| `MediaAssetVersion` | Reuse for version-bound content, content hash, reviewable variants, and approval lock integrity. |
| `PublishJob` | Reuse only for manual or semi-manual publishing support gated by approved `ApprovalDecision`; do not treat as direct publishing. |
| `OnboardingProgress` | Reuse for limited workspace readiness/setup adjacency where appropriate. |
| `SetupChecklistItem` | Reuse for setup/checklist adjacency before proposing a dedicated manual checklist. |

## 9. Candidate decisions table

| Nashir capability | Current ERD reuse candidate | Proposed ERD action | New entity needed? | New field needed? | Reason | Risk | Decision |
|---|---|---|---|---|---|---|---|
| Readiness Dashboard | `OnboardingProgress`, `SetupChecklistItem`, `Campaign`, `ApprovalDecision`, `ManualPublishEvidence`, `AuditLog` | Reuse derived display first. | defer | defer | Readiness may be computed from existing workflow state. | Readiness could be mistaken for approval. | Defer persisted readiness unless derivation is insufficient. |
| Smart Wizard intake | `BriefVersion`, `Campaign`, `AuditLog` | Store confirmed intake in versioned brief content first. | defer | defer | Existing versioned JSON can preserve manual intake content. | Entity explosion and duplicate brief truth. | Reuse `BriefVersion`; prove insufficiency before `IntakeSession` or `IntakeAnswer`. |
| Product / Store / Service / Offer intake | `Campaign`, `BriefVersion` | Reuse campaign basics and versioned brief content. | no | defer | First-class object tables are not required for Core V1 proof yet. | Premature profile/entity taxonomy. | Candidate fields only if exact placement is approved later. |
| Campaign basics | `Campaign`, `CampaignStateTransition` | Reuse as-is. | no | no | Existing campaign model covers name/objective/status. | Low. | Reuse as-is. |
| Advertised object flow | `BriefVersion`, `Campaign` | Represent as versioned brief content first. | defer | defer | Structured object flow can remain content unless lifecycle demands first-class state. | Duplicate product/store/service/offer truth. | Defer new entity. |
| Landing destination | `BriefVersion`, `TrackedLink`, `PublishJob` | Reuse brief content and tracked links. | no | defer | Destination can be captured in content or link records. | UTM could be misread as attribution. | Candidate fields only if existing link fields are insufficient. |
| Creative rights confirmation | `MediaAssetVersion`, `ReviewTask`, `ApprovalDecision`, `ManualPublishEvidence`, `AuditLog` | Reuse approval/evidence/audit surfaces first. | no | defer | Rights should bind to content version and review/evidence context. | Rights gaps can create unsafe manual publishing support. | Candidate status fields only if required by future contract. |
| Idea intake | `BriefVersion` | Reuse versioned brief content. | no | defer | Ideas are draft/advisory inputs. | AI/advisory content could become confirmed fact. | Reuse first; record source/provenance only if approved. |
| Content requirements | `BriefVersion`, `MediaAssetVersion` | Reuse versioned content. | no | defer | Requirements can live in brief/content payloads. | Weak output taxonomy if over-embedded. | Defer structured fields until output taxonomy is approved. |
| Hashtags per channel | `BriefVersion`, `MediaAssetVersion` | Reuse draft/versioned content. | no | defer | Hashtags are advisory draft content only. | Trend/optimization scope creep. | Reuse; reject optimization entities. |
| Video reference scripts | `BriefVersion`, `MediaAssetVersion`, `PromptTemplate` | Reuse draft/versioned content and templates. | no | defer | Scripts are reference outputs, not final video generation. | Could imply video generation/editing scope. | Reuse; reject video production entities. |
| UTM Tracking Lite | `TrackedLink`, `PublishJob` | Reuse tracked links. | no | defer | Existing link entity can carry structured link records if fields fit. | Attribution confusion. | Reuse; candidate UTM fields only if needed. |
| Human approval | `ReviewTask`, `ApprovalDecision`, `MediaAssetVersion` | Reuse as-is. | no | no | Current ERD already defines approval truth and hash binding. | Approval bypass if readiness is conflated. | Reuse as-is. |
| Approval lock | `ApprovalDecision`, `MediaAssetVersion`, `AuditLog` | Reuse content hash and immutable versions first. | defer | defer | Approval lock may be represented by existing hash/version rules. | Material-change reapproval gaps. | Prefer `AuditLog`; consider fields only if lock cannot be derived. |
| Manual publishing checklist | `PublishJob`, `SetupChecklistItem`, `AuditLog` | Decide UI-only or reuse checklist adjacency before persistence. | defer | defer | Checklist may not need first-class ERD structure. | Checklist could be mistaken for publishing action. | Defer dedicated checklist entity. |
| Manual publishing evidence | `ManualPublishEvidence`, `PublishJob`, `MediaAssetVersion`, `AuditLog` | Reuse existing evidence entity. | defer | defer | Evidence entity exists and is append-only. | Evidence tampering or authorization confusion. | Reuse first; attachments only if references are insufficient. |
| Manual performance review | `ClientReportSnapshot`, `ManualPublishEvidence` | Reuse frozen snapshots with user-entered observations. | no | defer | Snapshot model already freezes evidence/report content. | Analytics ingestion/attribution creep. | Reuse; reject ingestion entities. |
| Role & permission matrix | `WorkspaceMember`, `Role`, `Permission`, `RolePermission`, `AuditLog` | Reuse existing RBAC. | defer | defer | Approved ERD includes role-permission mapping. | Policy overlays can duplicate authority. | Reuse; defer `RolePermissionPolicy` and `PermissionAssignment`. |

## 10. Minimum viable ERD proposal

### Reuse as-is

- `Campaign` for campaign basics.
- `BriefVersion` for versioned intake and campaign brief content.
- `MediaAsset` and `MediaAssetVersion` for content and content version integrity.
- `ReviewTask` and `ApprovalDecision` for human review and approval truth.
- `PublishJob` only for manual/semi-manual publishing support gated by approval.
- `ManualPublishEvidence` for user-provided evidence.
- `TrackedLink` for UTM Lite records.
- `ClientReportSnapshot` for frozen manual performance review snapshots.
- `Workspace`, `WorkspaceMember`, `Role`, `Permission`, and `RolePermission` for workspace-scoped access control.
- `AuditLog` for sensitive write traceability.
- `OnboardingProgress` and `SetupChecklistItem` for limited readiness/setup adjacency.

### Represent through existing notes/status/audit where possible

- Readiness labels and warnings should be derived from existing state before persisted fields are added.
- Smart Wizard answers should live in `BriefVersion.brief_content` before new intake tables are added.
- Rights, risk, and material-change notes should use versioned content, approval reasons, evidence reasons, and `AuditLog` where sufficient.
- Manual checklist progress should be UI-only or reuse `SetupChecklistItem` where sufficient.
- Evidence corrections should use existing supersede/invalidate semantics before new evidence audit entities are added.

### Defer

- Persisted readiness snapshots.
- Dedicated intake session/answer tables.
- Dedicated manual publishing checklist tables.
- Dedicated evidence attachment metadata.
- Dedicated approval transition tables.
- Dedicated permission policy or assignment overlays.

### Reject for Core V1

- Direct publishing entities.
- Social OAuth entities.
- Scheduling entities.
- Paid ads/payment/billing entities.
- Analytics ingestion entities.
- Attribution entities.
- External integration connector entities.
- Autonomous AI execution entities.
- Post V1 module entities.

## 11. Candidate field proposals, planning-only

These fields are planning-only and are not approved.

| Candidate field group | Candidate placement to evaluate | Planning notes |
|---|---|---|
| Approval lock / content version binding candidates | `ApprovalDecision`, `MediaAssetVersion`, `AuditLog` metadata | Evaluate lock state, approved variant reference, reapproval reason, and actor metadata only if hash/version rules are insufficient. |
| Readiness status candidates | derived from `Campaign`, `BriefVersion`, `OnboardingProgress`, `SetupChecklistItem`, approval/evidence state, or future `CampaignReadinessSnapshot` | Prefer derived state. Persist only if snapshots are required for explanation or audit. |
| Evidence status candidates | `ManualPublishEvidence` | Existing ERD has `valid`, `superseded`, and `invalidated`; Nashir statuses such as draft/submitted/accepted/needs_correction need separate proof before ERD change. |
| UTM usage candidates | `TrackedLink`, `ManualPublishEvidence`, `BriefVersion` | Evaluate UTM source, medium, campaign, content, term, and used flag only for structured links; no analytics or attribution. |
| Creative rights status candidates | `MediaAssetVersion`, `ApprovalDecision`, `ManualPublishEvidence`, `AuditLog` metadata | Evaluate rights status, confirmer, timestamp, scope, and notes only if future rights contract requires persistence. |
| Material change indicator candidates | `MediaAssetVersion`, `ApprovalDecision`, `AuditLog` metadata | Evaluate material-change flag, reason, prior version, and reapproval requirement only if existing hashes and immutable versions are insufficient. |
| Risk flag candidates | `BriefVersion`, `ReviewTask`, `ApprovalDecision`, `AuditLog` metadata | Evaluate rights, claims, policy, governance, safety, and blocked-until-review flags only if future QA/Threat Model approves them. |

## 12. Candidate entity proposals, planning-only

These entities are planning-only and are not approved. They should be considered only if existing entities are insufficient.

| Candidate entity | Use only if | Reuse-first alternative |
|---|---|---|
| `CampaignReadinessSnapshot` | Derived readiness cannot satisfy explanation, audit, or point-in-time review requirements. | Derive from `Campaign`, `BriefVersion`, `OnboardingProgress`, `SetupChecklistItem`, approval/evidence records, and `AuditLog`. |
| `ManualPublishingChecklist` | Checklist must be persisted as a lifecycle object rather than UI-only or setup-adjacent state. | UI-only checklist, `SetupChecklistItem`, `PublishJob`, and `AuditLog`. |
| `EvidenceAttachment` | `ManualPublishEvidence.published_url`, `screenshot_ref`, notes, and external references cannot represent required attachment metadata. | Existing evidence URL/screenshot/reference fields. |
| `ApprovalStateTransition` | `AuditLog` cannot satisfy transition history, query, immutability, or compliance requirements. | `ApprovalDecision`, `MediaAssetVersion`, and `AuditLog`. |

## 13. Defer or reject

| Item | Decision | Reason |
|---|---|---|
| `IntakeSession` | Defer | Prove `BriefVersion` cannot preserve manual wizard state and provenance first. |
| `IntakeAnswer` | Defer | Prove answer-level persistence is required beyond versioned brief content. |
| `CampaignReadinessSignal` | Defer | Prove signal-level persistence is required beyond derived explanations. |
| `ManualPublishingChecklistItem` | Defer | Decide whether checklist is UI-only, `SetupChecklistItem`, or a persisted checklist. |
| `EvidenceAuditEvent` | Defer / reject if `AuditLog` is enough | Existing `AuditLog` is the preferred audit surface. |
| `RolePermissionPolicy` | Defer | Reuse `Role`, `Permission`, and `RolePermission` first. |
| `PermissionAssignment` | Defer | Prove role-based permission mapping cannot satisfy explicit authority requirements. |
| direct publishing entities | Reject for Core V1 | Direct publishing is NO-GO. |
| social OAuth entities | Reject for Core V1 | Social OAuth and external account connection are NO-GO. |
| scheduling entities | Reject for Core V1 | Scheduling is NO-GO. |
| paid ads/payment/billing entities | Reject for Core V1 | Paid execution, payment, billing, invoice, and provider usage scope are NO-GO. |
| analytics ingestion entities | Reject for Core V1 | Manual performance review is user-entered only. |
| attribution entities | Reject for Core V1 | UTM Lite is not attribution. |
| autonomous AI execution entities | Reject for Core V1 | Autonomous AI execution is NO-GO. |

## 14. Open questions before actual ERD patch

1. Which Nashir readiness values can be fully derived from existing entities?
2. Does Smart Wizard require recoverable session state, or can confirmed output live in `BriefVersion.brief_content`?
3. Which exact fields, if any, are missing from `Campaign` and `BriefVersion` for campaign basics and advertised object content?
4. Can approval lock be enforced through `MediaAssetVersion.content_hash`, immutable versions, `ApprovalDecision`, and `AuditLog` alone?
5. Does creative rights confirmation need a field, review type, approval reason, evidence note, or separate future contract?
6. Can manual publishing checklist remain UI-only or reuse `SetupChecklistItem`?
7. Are `ManualPublishEvidence.published_url`, `screenshot_ref`, `external_post_id`, and `content_hash` enough for Nashir evidence?
8. Should evidence planning statuses map to current `valid`, `superseded`, and `invalidated`, or require a separate future status patch?
9. Are UTM parameters required as structured fields on `TrackedLink`, or can they be represented in `original_url`, `tracked_url`, and `tracking_code`?
10. Can manual performance observations be represented in `ClientReportSnapshot.report_snapshot_payload`?
11. Which protected actions need explicit permission codes under existing `Permission` and `RolePermission`?
12. What tenant isolation, immutability, append-only, and audit constraints must be specified before SQL work?

## 15. Proposed actual ERD patch options

| Option | Description | Benefits | Costs / risks | Recommendation |
|---|---|---|---|---|
| Option A: reuse-only / no new entities | Update ERD notes only, if separately approved, to map Nashir Core V1 to existing entities and reject/defer new entities. | Lowest blast radius; preserves current authority; avoids duplicate state. | May leave some semantics in narrative rather than explicit fields. | Recommended first. |
| Option B: minimal fields on existing entities | Add only proven fields to existing entities such as `BriefVersion`, `TrackedLink`, `ManualPublishEvidence`, or `MediaAssetVersion`. | Keeps entity count stable while making needed state explicit. | Requires SQL/OpenAPI/QA follow-up and migration risk. | Conditional next step only after Option A proves insufficient. |
| Option C: limited new entities | Add tightly scoped entities such as `CampaignReadinessSnapshot`, `ManualPublishingChecklist`, `EvidenceAttachment`, or `ApprovalStateTransition`. | Supports stronger lifecycle/query/audit requirements where reuse fails. | Highest risk of entity explosion, duplicate state, and contract expansion. | Not recommended for first actual patch. |

Recommended option: Option A. The ERD Gate Decision Review says GO only for proposal and NO-GO for actual ERD patch now. If an actual ERD patch is later approved, reuse-only notes and mappings should be exhausted before adding fields or entities.

## 16. Risk assessment

| Risk | Assessment | Mitigation |
|---|---|---|
| Entity explosion | High if Nashir concepts become first-class tables too early. | Reuse existing ERD entities and require proof of insufficiency. |
| Duplicate sources of truth | High for readiness, approval, evidence, and permissions. | Preserve `ApprovalDecision`, `ManualPublishEvidence`, `RolePermission`, and `AuditLog` boundaries. |
| Readiness vs approval confusion | High. | State repeatedly that readiness is advisory and does not approve content. |
| Evidence vs publishing authorization confusion | High. | Evidence is user-provided proof after external manual action and does not authorize publishing. |
| Audit gaps | Medium. | Use `AuditLog` for sensitive writes unless a dedicated transition entity is separately justified. |
| Tenant isolation | High. | Every workspace-scoped record must include route-derived workspace context and must not trust `workspace_id` from request bodies. |
| Premature Post V1 scope | High. | Reject direct publishing, OAuth, scheduling, paid ads, payment, analytics ingestion, attribution, integrations, autonomous AI, and Post V1 modules. |

## 17. Dependencies

- OpenAPI patch dependency: no OpenAPI change is approved. Any future ERD field or entity change must be matched by separately approved OpenAPI schema/path review where exposed.
- SQL migration dependency: no SQL change is approved. Any future ERD patch requiring persistence needs a separate SQL migration plan with constraints, indexes, migration order, rollback, and verification.
- QA/test plan dependency: no QA/test change is approved. Any future patch must define tenant isolation, permission, approval lock, evidence immutability, readiness-not-approval, evidence-not-authorization, UTM-no-attribution, and NO-GO negative tests.
- Threat Model dependency: no Threat Model change is approved. Any future patch must review entity expansion, tenant isolation, approval bypass, evidence tampering, rights misuse, role escalation, UTM confusion, external integration risks, and paid execution/payment risks.

## 18. Verification expectations for any future actual ERD patch

Any future actual ERD patch must verify:

- only explicitly allowed files changed;
- no SQL/OpenAPI/QA/runtime/test/package/workflow/implementation files changed unless separately approved;
- approved ERD naming is preserved;
- every workspace-scoped proposal includes route-derived workspace context;
- `workspace_id` is not trusted from request bodies;
- readiness remains separate from approval;
- evidence remains separate from publishing authorization;
- UTM remains separate from analytics ingestion and attribution;
- direct publishing, OAuth, scheduling, paid ads, payment, analytics ingestion, attribution, integrations, autonomous AI, and Post V1 implementation remain NO-GO;
- future SQL/OpenAPI/QA/Threat Model dependencies are explicitly listed.

## 19. Rollback / NO-GO criteria for future actual ERD patch

Future actual ERD patch work must stop or roll back if:

- approved sources conflict;
- more than the approved files are required;
- the patch adds SQL/OpenAPI/QA/runtime/test/package/workflow/implementation changes without approval;
- new entities are proposed before reuse insufficiency is proven;
- readiness becomes approval or publishing authorization;
- evidence becomes publishing authorization, analytics proof, attribution, or paid performance proof;
- `TrackedLink` becomes analytics ingestion or attribution;
- `CostEvent` becomes billing, payment, invoice, or paid execution state;
- tenant isolation, workspace context, membership, permission, or ErrorModel guardrails are weakened;
- any NO-GO Core V1 or Post V1 item enters the ERD.

## 20. Recommended sequencing

1. Review and approve or reject this documentation-only proposal.
2. Decide whether Option A reuse-only ERD notes are enough for the next actual ERD patch request.
3. If more than reuse notes are required, answer the open questions and identify exact fields/entities.
4. Submit a separate actual ERD patch request with explicit allowed files, forbidden files, verification commands, expected CI gates, rollback criteria, and NO-GO boundaries.
5. Only after ERD patch approval, prepare matching SQL migration, OpenAPI patch, QA/test plan, and Threat Model requests.
6. Consider implementation only after all required contracts are approved and a separate implementation request defines allowed files, forbidden files, verification gates, expected CI gates, rollback criteria, and NO-GO items.

## 21. GO / NO-GO decision

GO: Use this document as a documentation-only ERD Patch Proposal for future scope discussion.

GO: Recommend Option A, reuse-only / no new entities, as the first candidate actual ERD patch path if separately approved later.

NO-GO: Do not patch actual ERD now.

NO-GO: Do not change SQL, OpenAPI, QA, Threat Model, runtime, generated clients, tests, package files, workflows, scripts, migrations, prototype, frontend assets, router/store files, or implementation from this document.

NO-GO: Do not add direct publishing, social OAuth, scheduling, paid ads, payment, analytics ingestion, attribution, external integrations, autonomous AI execution, or Post V1 module implementation to Core V1.

## 22. Safe files to edit later if approved

Future separately approved documentation or contract requests may list safe files such as:

- `docs/nashir_erd_patch_proposal.md`;
- `docs/03_decision_log.md`;
- `docs/17_change_log.md`;
- a future ERD patch document;
- a future SQL Migration Plan;
- a future OpenAPI Patch;
- a future QA/Test Case Plan;
- a future Threat Model Update.

These files are safe only when a later request explicitly lists them as allowed.

## 23. Files that must remain forbidden

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
