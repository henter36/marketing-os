# Nashir ERD Patch Planning Gate

## 1. Purpose

This document is documentation-only.

It creates an ERD Patch Planning Gate for Nashir Core V1 before any actual ERD, SQL, OpenAPI, QA, runtime, or implementation work is proposed.

This document does not approve ERD changes.

This document does not approve SQL changes.

This document does not approve OpenAPI changes.

This document does not approve QA, runtime, generated clients, tests, packages, workflows, or implementation.

This document only identifies ERD planning candidates and decision gates.

Existing ERD remains authoritative until separately patched and approved.

Core V1 remains manual/export/review/approval/evidence only.

Readiness does not equal approval.

Evidence does not authorize publishing.

Manual publishing remains external and user-operated in Core V1.

Direct publishing, social OAuth, scheduling, paid ads, payment, analytics ingestion, attribution, external integrations, autonomous AI execution, and Post V1 module implementation remain NO-GO.

Any future ERD patch must be separately approved with explicit allowed files, forbidden files, verification commands, expected CI gates, and rollback/no-go criteria.

## 2. Scope

This planning gate reviews Nashir Core V1 capabilities against the current approved Phase 0/1 ERD authority and identifies possible reuse, field, entity, relationship, risk, and decision questions.

It is limited to planning for manual/export/review/approval/evidence workflows.

## 3. Non-goals

This document does not:

- patch `docs/06_erd.md` or `docs/marketing_os_v5_6_5_phase_0_1_erd.md`;
- create SQL migrations, OpenAPI schemas, endpoints, QA cases, generated clients, runtime tasks, repositories, routes, stores, package changes, workflows, scripts, prototype assets, or implementation tasks;
- approve new entities, fields, relationships, constraints, indexes, enum values, permissions, or audit behavior;
- rename approved entities;
- approve Pilot or Production readiness;
- approve direct publishing, social OAuth, scheduling, paid ads, payment, analytics ingestion, attribution, external integrations, autonomous AI execution, or Post V1 module implementation.

## 4. Sources inspected

- `AGENTS.md`
- `README.md`
- `docs/17_change_log.md`
- `docs/03_decision_log.md`
- `docs/02_v1_scope.md`
- `docs/04_backlog.md`
- `docs/06_erd.md`
- `docs/08_api_spec.md`
- `docs/nashir_dual_path_customer_journey_and_campaign_flow.md`
- `docs/nashir_journey_traceability_and_contract_impact_review.md`
- `docs/nashir_prd_backlog_reconciliation.md`
- `docs/nashir_erd_openapi_qa_threat_model_impact_review.md`
- `docs/nashir_campaign_readiness_scoring_contract.md`
- `docs/nashir_approval_state_machine_contract.md`
- `docs/nashir_manual_publishing_evidence_contract.md`
- `docs/nashir_role_permission_matrix.md`
- `docs/marketing_os_v5_6_5_phase_0_1_erd.md`
- `docs/marketing_os_v5_6_5_phase_0_1_backlog.md`
- `docs/marketing_os_v5_6_5_phase_0_1_openapi.yaml`

## 5. Current repository authority summary

Marketing OS remains a contract-first Phase 0/1 execution repository. It is not approved for Pilot or Production.

`docs/02_v1_scope.md` defines Nashir Core V1 as manual/export/review/approval/evidence only and does not approve implementation by itself.

`docs/04_backlog.md` documents Nashir backlog planning boundaries only and does not create sprint-ready implementation tasks.

`docs/06_erd.md` is the ERD index and governance wrapper. It points to `docs/marketing_os_v5_6_5_phase_0_1_erd.md` as the detailed ERD authority and preserves approved entity naming.

`docs/08_api_spec.md` points to `docs/marketing_os_v5_6_5_phase_0_1_openapi.yaml` as the approved OpenAPI authority and forbids endpoints outside OpenAPI scope.

The approved ERD is Section 52 only. It says the build status is not ready for direct coding, disallows legacy standalone `GenerationJob`, `Asset`, and `Approval`, and maps them to `MediaJob`, `MediaAsset`, and `ApprovalDecision`.

`CostEvent` does not mean customer billing, invoice state, payment, or paid execution.

## 6. Relationship to prior Nashir documents

### Nashir journey document

`docs/nashir_dual_path_customer_journey_and_campaign_flow.md` introduced the Nashir journey, readiness, dual intake, campaign drafting, human approval, manual publishing support, manual evidence, and manual review concepts. This gate converts only the ERD-relevant questions into planning candidates.

### Traceability review

`docs/nashir_journey_traceability_and_contract_impact_review.md` traced Nashir concepts to current V1/backlog/ERD/OpenAPI authority and identified partial alignment with workspace, campaign, brief, media, approval, publish, evidence, tracked link, report, onboarding, and audit concepts.

### PRD/backlog reconciliation

`docs/nashir_prd_backlog_reconciliation.md` classified Nashir Core V1 candidates and kept external integrations, paid execution, payment, analytics ingestion, and attribution as explicit NO-GO items.

### Core V1 scope patch

`docs/02_v1_scope.md` limits Nashir Core V1 to manual/export/review/approval/evidence and states that Nashir does not rename approved repository entities or change approved API/SQL/runtime contracts.

### Backlog planning patch

`docs/04_backlog.md` permits Nashir backlog planning references only and requires separate ERD, OpenAPI, QA, Threat Model, scoring, evidence, approval, and permission contracts before development.

### ERD/OpenAPI/QA/Threat impact review

`docs/nashir_erd_openapi_qa_threat_model_impact_review.md` identified possible ERD entities, fields, endpoint candidates, QA categories, and threat-model risks. This planning gate narrows the ERD decision questions without approving a patch.

### Campaign Readiness Scoring Contract

`docs/nashir_campaign_readiness_scoring_contract.md` defines readiness as advisory and separate from approval. Any readiness ERD candidate must preserve that boundary.

### Approval State Machine Contract

`docs/nashir_approval_state_machine_contract.md` defines planning-level approval states, transitions, approval lock, material-change behavior, and audit requirements. Any ERD candidate must keep approval human, version-bound, and separate from publishing authorization.

### Manual Publishing Evidence Contract

`docs/nashir_manual_publishing_evidence_contract.md` defines evidence as user-provided proof of external manual publishing. Any ERD candidate must keep evidence separate from publishing execution, analytics ingestion, attribution, and paid performance.

### Role & Permission Matrix

`docs/nashir_role_permission_matrix.md` defines planning-level role and permission semantics. Any ERD candidate must preserve workspace-scoped authorization, explicit protected-action authority, and auditability.

## 7. ERD planning principles

1. Reuse approved Phase 0/1 entities before proposing new entities.
2. Do not rename approved entities.
3. Do not create standalone `GenerationJob`, `Asset`, or `Approval`.
4. Do not create direct publishing, social OAuth, scheduling, paid ads, payment, analytics ingestion, attribution, external integration, autonomous AI, or Post V1 module entities.
5. Treat readiness as advisory and not approval.
6. Treat manual publishing evidence as user-provided proof and not publishing authorization.
7. Preserve route-derived workspace context and tenant isolation.
8. Preserve AuthGuard, WorkspaceContextGuard, MembershipCheck, PermissionGuard, and ErrorModel assumptions.
9. Use `AuditLog` for sensitive transition planning unless a later approved ERD patch explicitly adds a transition table.
10. Keep candidate fields and entities planning-only until a separately approved ERD patch exists.

## 8. Current ERD support summary

### Existing entities that may partially support Nashir

Existing ERD entities that may partially support Nashir include `User`, `Workspace`, `WorkspaceMember`, `Role`, `Permission`, `Campaign`, `BriefVersion`, `MediaJob`, `MediaAsset`, `MediaAssetVersion`, `ReviewTask`, `ApprovalDecision`, `PublishJob`, `ManualPublishEvidence`, `TrackedLink`, `ClientReportSnapshot`, `AuditLog`, `OnboardingProgress`, `SetupChecklistItem`, `UsageMeter`, and `CostEvent`.

### Existing relationships that may be reused

Candidate reuse should start from these approved relationships:

- `Workspace` -> `WorkspaceMember`, `Campaign`, `BrandProfile`, `PromptTemplate`, `ReportTemplate`, `UsageMeter`, `CostEvent`, `AuditLog`, `OnboardingProgress`, and `SetupChecklistItem`.
- `Role` -> `RolePermission` and `Permission` -> `RolePermission`.
- `Campaign` -> `BriefVersion`, `CampaignStateTransition`, `MediaJob`, and `ClientReportSnapshot`.
- `BriefVersion` -> `MediaJob`.
- `MediaAsset` -> `MediaAssetVersion`.
- `MediaAssetVersion` -> `ReviewTask`.
- `ReviewTask` -> `ApprovalDecision`.
- `ApprovalDecision` -> `PublishJob`.
- `PublishJob` -> `ManualPublishEvidence` and `TrackedLink`.

### Existing entities that must not be renamed

The following names must remain authoritative unless a later approved ERD patch explicitly changes them:

- `MediaJob`
- `MediaAsset`
- `MediaAssetVersion`
- `ApprovalDecision`
- `ManualPublishEvidence`
- `UsageMeter`
- `CostEvent`
- `ClientReportSnapshot`
- `AuditLog`

Do not replace them with `GenerationJob`, `Asset`, `Approval`, `BillingProvider`, `ProviderUsageLog`, `AttributionDecision`, `SocialAutoPublishConnector`, `PaidExecution`, or `AgentRun`.

### Existing approved ERD authority

`docs/marketing_os_v5_6_5_phase_0_1_erd.md` remains the approved detailed ERD source. `docs/06_erd.md` remains the ERD index and governance wrapper. This planning gate does not supersede either file.

## 9. Existing ERD entities to inspect and map

Any later ERD patch proposal must inspect and map the following entities before proposing new structure:

| Entity | Current planning relevance for Nashir |
|---|---|
| `User` | Actor identity for workspace membership, approvals, evidence submission, and audit. |
| `Workspace` | Tenant and operational boundary for all Nashir Core V1 records. |
| `WorkspaceMember` | Workspace membership context for permission and role enforcement. |
| `Role` | Existing RBAC role anchor. |
| `Permission` | Existing RBAC permission anchor. |
| `Campaign` | Primary candidate for campaign basics and advertised object context. |
| `BriefVersion` | Primary candidate for versioned intake, brief, draft, and content requirement content. |
| `MediaJob` | Existing generation/work item name; must not be renamed to `GenerationJob`. |
| `MediaAsset` | Existing asset name; must not be renamed to `Asset`. |
| `MediaAssetVersion` | Candidate for version-bound approved content and content hash integrity. |
| `ReviewTask` | Candidate for human review work. |
| `ApprovalDecision` | Existing approval authority; must not be renamed to `Approval`. |
| `PublishJob` | Candidate for approved manual publishing support only, not direct publishing. |
| `ManualPublishEvidence` | Candidate for user-provided external manual publishing proof. |
| `TrackedLink` | Candidate for UTM Lite structured links only, not analytics or attribution. |
| `ClientReportSnapshot` | Candidate for frozen manual performance review snapshots. |
| `AuditLog` | Candidate audit surface for sensitive writes and transition history. |
| `OnboardingProgress` | Candidate adjacency for readiness/setup progress. |
| `SetupChecklistItem` | Candidate adjacency for readiness/checklist display. |
| `UsageMeter` | Usage foundation; must not become analytics ingestion. |
| `CostEvent` | Internal cost state only; must not become billing, payment, invoice, or paid execution state. |

## 10. Nashir capability-to-ERD planning matrix

| Capability | Existing ERD support | Candidate reuse | Candidate new field | Candidate new entity | Candidate relationship impact | Risk level | Decision |
|---|---|---|---|---|---|---|---|
| Readiness Dashboard | Partial via `OnboardingProgress`, `SetupChecklistItem`, `Campaign`, `ReviewTask`, `ApprovalDecision`, `ManualPublishEvidence`. | Reuse checklist, onboarding, campaign, approval, evidence, and audit records for display where sufficient. | Readiness status fields only if display cannot be derived. | `CampaignReadinessSnapshot`, `CampaignReadinessSignal` planning-only candidates. | May relate readiness snapshots to `Workspace` and `Campaign`. | Medium | Plan reuse-first; no ERD change approved. |
| Smart Wizard | Partial via `BriefVersion` generic content. | Reuse `BriefVersion` for manual structured intake content where sufficient. | Intake source, step, confirmation, or provenance fields if needed. | `IntakeSession`, `IntakeAnswer` planning-only candidates. | May relate intake to `Workspace`, `Campaign`, and `BriefVersion`. | Medium | Candidate only; prove `BriefVersion` is insufficient before new entities. |
| Product / Store / Service / Offer intake | Partial via `Campaign` and `BriefVersion`. | Reuse `Campaign` for campaign basics and `BriefVersion` for structured brief content. | Advertised object type, offer/CTA, source, confirmation, and user-provided flags if needed. | `IntakeSession`, `IntakeAnswer` only if structured answers cannot fit existing versioning. | May relate advertised-object content to `Campaign` and `BriefVersion`. | Medium | Candidate fields before candidate entities. |
| Campaign basics | Partial via `Campaign` and `CampaignStateTransition`. | Reuse `Campaign`. | Nashir-specific objective/channel fields only if approved. | None expected. | Existing `Workspace` -> `Campaign` relationship likely sufficient. | Low | Reuse existing `Campaign`; no rename. |
| Advertised object flow | Partial via `Campaign` and `BriefVersion`. | Reuse `BriefVersion` for object detail unless first-class persistence is required. | Advertised object type and selected object fields if needed. | No first-class object entity unless future evidence proves need. | May remain embedded/versioned under `BriefVersion`. | Medium | Defer first-class entities. |
| Landing destination | Partial via `BriefVersion`, `PublishJob`, and `TrackedLink`. | Reuse `BriefVersion` and `TrackedLink`. | Destination URL/type/review status fields if needed. | None expected initially. | May link `TrackedLink` to approved publishing support only. | Medium | Candidate field review only. |
| Creative rights confirmation | Partial via `ReviewTask`, `ApprovalDecision`, `MediaAssetVersion`, and evidence. | Reuse approval and evidence surfaces. | Rights status, confirmer, timestamp, scope, and notes if needed. | None expected initially. | May bind rights confirmation to content version. | High | Future ERD patch must align with approval/evidence contracts. |
| Idea intake | Partial via `BriefVersion`. | Reuse `BriefVersion`. | Idea source and user confirmation if needed. | `IntakeSession`, `IntakeAnswer` only if wizard structure requires. | May relate idea intake to `Campaign`. | Low | Keep as draft/versioned content first. |
| Content requirements | Partial via `BriefVersion`, `MediaJob`, `MediaAssetVersion`. | Reuse versioned brief/media content. | Requirement type, channel, output category if needed. | None expected initially. | May remain under `BriefVersion` or `MediaAssetVersion`. | Medium | Candidate fields only if structured output is required. |
| Hashtags per channel | Partial as draft content in `BriefVersion` or `MediaAssetVersion`. | Reuse versioned content. | Channel and hashtag set fields if needed. | None expected initially. | May bind to content version. | Low | Keep draft/advisory; no optimization entity. |
| Video reference scripts | Partial as draft content in `BriefVersion` or `MediaAssetVersion`. | Reuse versioned content. | Script type/status/reference fields if needed. | None expected initially. | May bind to content version. | Low | Draft/reference only; no video generation entity. |
| UTM Tracking Lite | Partial via `TrackedLink`. | Reuse `TrackedLink`. | UTM source/medium/campaign/content/term and used flag if existing fields insufficient. | None expected initially. | Existing `PublishJob` -> `TrackedLink` may be reused. | Medium | Structured links only; no analytics/attribution. |
| Human approval | Partial via `ReviewTask` and `ApprovalDecision`. | Reuse `ApprovalDecision`. | Approval actor or state fields only if existing fields insufficient. | None expected initially. | Existing `ReviewTask` -> `ApprovalDecision` should remain anchor. | Low | Reuse existing approval authority. |
| Approval lock | Partial via `ApprovalDecision`, approved content hash, and `MediaAssetVersion`. | Reuse content hash and version relationships. | Lock state, material change indicator, reapproval reason if needed. | `ApprovalStateTransition` planning-only candidate if `AuditLog` is insufficient. | May relate transition/audit to content version and approval decision. | High | Prefer `AuditLog`; no transition table unless justified. |
| Manual publishing checklist | Partial via `PublishJob`, `ManualPublishEvidence`, `SetupChecklistItem`. | Reuse `PublishJob` and checklist adjacency if possible. | Checklist status/completed/acknowledged fields if persisted. | `ManualPublishingChecklist`, `ManualPublishingChecklistItem` planning-only candidates. | May relate checklist to `Campaign`, `ApprovalDecision`, or `PublishJob`. | Medium | Decide UI-only vs persisted before ERD patch. |
| Manual publishing evidence | Partial via `ManualPublishEvidence`. | Reuse `ManualPublishEvidence`. | Evidence status, URL, screenshot reference, UTM used, invalidation reason if missing. | `EvidenceAttachment`, `EvidenceAuditEvent` planning-only candidates. | May relate attachments/audit to `ManualPublishEvidence`. | High | Reuse existing evidence first; preserve append-only semantics. |
| Manual performance review | Partial via `ClientReportSnapshot`. | Reuse `ClientReportSnapshot` for frozen user-entered review snapshots where sufficient. | User-entered metric and observation fields if needed. | None expected initially. | May relate to `Campaign` and evidence references. | Medium | No analytics ingestion or attribution. |
| Role & permission matrix | Partial via `WorkspaceMember`, `Role`, `Permission`, `RolePermission`, and `AuditLog`. | Reuse existing RBAC concepts. | Permission assignment or actor role snapshot fields if needed. | `RolePermissionPolicy`, `PermissionAssignment` planning-only candidates. | May relate policy/assignment to workspace roles and audit. | High | Prefer existing RBAC; explicit authority must remain auditable. |

## 11. Required capability coverage

The matrix above covers:

- Readiness Dashboard
- Smart Wizard
- Product / Store / Service / Offer intake
- Campaign basics
- Advertised object flow
- Landing destination
- Creative rights confirmation
- Idea intake
- Content requirements
- Hashtags per channel
- Video reference scripts
- UTM Tracking Lite
- Human approval
- Approval lock
- Manual publishing checklist
- Manual publishing evidence
- Manual performance review
- Role & permission matrix

## 12. Candidate new entities

The following candidate new entities are planning-only and are not approved:

| Candidate entity | Planning use | Gate before ERD patch |
|---|---|---|
| `IntakeSession` | Group Smart Wizard or manual intake activity. | Prove `BriefVersion` cannot preserve intake state and provenance. |
| `IntakeAnswer` | Store structured answer-level intake data. | Prove answer-level persistence is required and cannot live in versioned brief content. |
| `CampaignReadinessSnapshot` | Store point-in-time readiness output. | Prove derived display is insufficient and scoring semantics are approved. |
| `CampaignReadinessSignal` | Store component-level readiness signals. | Prove signal-level audit/explanation is required. |
| `ManualPublishingChecklist` | Persist checklist header state. | Decide persisted checklist versus UI-only checklist. |
| `ManualPublishingChecklistItem` | Persist checklist item state. | Decide item-level audit, ownership, and lifecycle requirements. |
| `EvidenceAttachment` | Store evidence attachment metadata. | Prove existing evidence fields cannot reference attachments sufficiently. |
| `EvidenceAuditEvent` | Store evidence state history. | Prove `AuditLog` cannot support evidence audit needs. |
| `ApprovalStateTransition` | Store approval lifecycle transitions. | Prove `AuditLog` cannot support approval transition history. |
| `RolePermissionPolicy` | Store policy overlays for protected actions. | Prove existing `Role`, `Permission`, and `RolePermission` are insufficient. |
| `PermissionAssignment` | Store explicit per-actor permission assignment. | Prove role-based permissions cannot satisfy explicit authority requirements. |

## 13. Candidate new fields

The following candidate fields are planning-only and are not approved:

- readiness status fields;
- evidence status fields;
- approval lock fields;
- content version binding fields;
- UTM link usage fields;
- creative rights status fields;
- material change indicator fields;
- risk flag fields.

Any future ERD patch must specify exact entity placement, field names, types, constraints, immutability rules, indexes, audit needs, and migration implications.

## 14. Reuse-first decision rules

- Prefer existing `Campaign`, `BriefVersion`, `ApprovalDecision`, `ManualPublishEvidence`, `TrackedLink`, `ClientReportSnapshot`, and `AuditLog` where sufficient.
- Do not create new entities unless evidence shows existing contracts cannot support the concept.
- Do not rename existing entities.
- Do not widen ERD scope to Post V1 modules.
- Prefer candidate fields over candidate entities when versioned content or existing relationships can carry the concept safely.
- Prefer `AuditLog` for sensitive transition history unless a future approved patch proves a dedicated table is required.

## 15. Explicit ERD NO-GO items

The following must not enter a Core V1 ERD patch:

- direct publishing entities;
- social OAuth connector entities;
- scheduling entities;
- paid ads execution entities;
- payment/billing provider entities;
- analytics ingestion entities;
- attribution model entities;
- external integration connector entities;
- autonomous AI execution entities;
- Post V1 Organic Publishing Module entities;
- Post V1 Paid Campaign Execution Module entities.

## 16. ERD risks

- Entity explosion.
- Duplicating existing approved entities.
- Turning conceptual profiles into premature tables.
- Confusing readiness with approval.
- Confusing evidence with publishing authorization.
- Confusing user-entered performance with analytics ingestion.
- Breaking tenant isolation.
- Weakening auditability.
- Treating `CostEvent` as billing, payment, invoice, or paid execution state.
- Creating state transition tables where `AuditLog` is sufficient under current ERD guidance.

## 17. Required questions before actual ERD patch

1. Which Nashir concepts can be derived from existing entities without new fields?
2. Which concepts require persisted state rather than UI-only display or versioned brief content?
3. Can Smart Wizard intake be represented in `BriefVersion`, or does it require session/answer persistence?
4. Does readiness need snapshots, or can it be computed from existing workflow state?
5. Does approval lock need fields, or can content hash plus `ApprovalDecision` and `AuditLog` satisfy the contract?
6. Is manual publishing checklist UI-only, persisted as `SetupChecklistItem`, or a new checklist concept?
7. Can evidence attachments be references on `ManualPublishEvidence`, or do they need separate metadata?
8. Does role/permission authority require new policy tables, or can existing `RolePermission` support it?
9. What immutability and append-only constraints are required?
10. What tenant isolation, audit, and ErrorModel behavior must be represented in future ERD/OpenAPI/SQL/QA patches?

## 18. Recommended ERD patch scope, if later approved

A future ERD patch, if separately approved, should be narrow and reuse-first:

- map Nashir manual intake to `Campaign` and `BriefVersion` first;
- map readiness to derived state first, then consider `CampaignReadinessSnapshot` only if persistence is justified;
- map human approval and approval lock to `ReviewTask`, `ApprovalDecision`, `MediaAssetVersion`, content hash, and `AuditLog` first;
- map manual checklist to UI-only or existing checklist concepts before adding checklist entities;
- map evidence to `ManualPublishEvidence` first, then consider attachment or audit candidates only if required;
- map manual performance review to `ClientReportSnapshot` first;
- map protected action authority to existing `Role`, `Permission`, `RolePermission`, `WorkspaceMember`, and `AuditLog` first.

## 19. Recommended items to defer

- Dedicated intake session/answer tables until structured intake persistence is proven necessary.
- Dedicated readiness snapshot/signal tables until scoring persistence and explanation requirements are approved.
- Dedicated checklist tables until persisted checklist behavior is approved.
- Dedicated evidence attachment/audit tables until existing evidence and audit surfaces are proven insufficient.
- Dedicated approval transition tables until `AuditLog` is proven insufficient.
- Dedicated permission policy/assignment tables until existing RBAC is proven insufficient.

## 20. Recommended items to reject for Core V1

- Any entity that performs, schedules, tracks, or confirms direct platform publishing.
- Any social OAuth, token, connector, or external account entity.
- Any paid execution, ad account, campaign spend, bid, budget-changing, payment, invoice, refund, tax, or billing provider entity.
- Any analytics ingestion or attribution model entity.
- Any autonomous AI execution, agent run, AI provider, model registry, or external tool execution entity.
- Any Post V1 Organic Publishing Module or Post V1 Paid Campaign Execution Module entity.

## 21. OpenAPI dependency notes

No OpenAPI change is approved by this document.

If a future ERD patch is approved, matching OpenAPI review must determine whether any new entity or field requires endpoint, schema, permission, ErrorModel, idempotency, or response-shape changes. No frontend or runtime feature may begin without matching approved OpenAPI authority.

## 22. SQL migration dependency notes

No SQL change is approved by this document.

If a future ERD patch is approved, a SQL Migration Plan must define tables, fields, constraints, indexes, enum changes, immutability rules, append-only rules, RLS/session context, migration order, rollback/no-go criteria, and verification commands.

## 23. QA dependency notes

No QA change is approved by this document.

If a future ERD patch is approved, QA planning must cover tenant isolation, workspace context, permission enforcement, approval lock, readiness not approval, evidence not publishing authorization, evidence immutability, UTM no attribution, manual performance no analytics ingestion, and negative tests for NO-GO capabilities.

## 24. Threat Model dependency notes

No Threat Model change is approved by this document.

If a future ERD patch is approved, Threat Model review must cover entity expansion risk, tenant isolation, approval bypass, evidence tampering, creative rights misuse, misleading claims, AI suggestion misuse, role escalation, UTM/tracking confusion, manual performance data integrity, external integration risks, and paid execution/payment risks.

## 25. Recommended sequencing after this planning gate

1. Review and approve this ERD Patch Planning Gate.
2. Decide the minimum ERD patch candidate set using reuse-first rules.
3. Draft a separately approved ERD Patch request with explicit allowed files, forbidden files, verification commands, expected CI gates, and rollback/no-go criteria.
4. Only after ERD patch approval, draft matching SQL Migration Plan, OpenAPI Patch, QA/Test Case Plan, and Threat Model Update requests.
5. Consider implementation only after all required contracts are approved and a separate implementation request defines allowed files, forbidden files, verification gates, and NO-GO items.

## 26. GO / NO-GO decision for actual ERD patch

GO: Use this document as a planning gate to evaluate future ERD patch scope.

NO-GO: Do not patch ERD, SQL, OpenAPI, QA, runtime, generated clients, tests, packages, workflows, scripts, migrations, prototype, frontend assets, router/store files, or implementation files from this document.

NO-GO: Do not add direct publishing, social OAuth, scheduling, paid ads, payment, analytics ingestion, attribution, external integrations, autonomous AI execution, or Post V1 module entities to Core V1.

## 27. Safe files to edit later if approved

Future separately approved documentation or contract requests may list safe files such as:

- `docs/nashir_erd_patch_planning_gate.md`
- `docs/03_decision_log.md`
- `docs/17_change_log.md`
- a future ERD patch document;
- a future SQL Migration Plan;
- a future OpenAPI Patch;
- a future QA/Test Case Plan;
- a future Threat Model Update.

These files are safe only when a later request explicitly lists them as allowed.

## 28. Files that must remain forbidden

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
