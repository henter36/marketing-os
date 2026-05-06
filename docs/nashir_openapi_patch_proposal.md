# Nashir OpenAPI Patch Proposal

## 1. Purpose

This document is documentation-only.

This document creates a reuse-first OpenAPI Patch Proposal for Nashir Core V1 based on the merged OpenAPI Planning Gate and the OpenAPI Gate Decision Review outcome supplied for this task.

This document does not approve actual OpenAPI changes.

This document does not approve generated client changes.

This document does not approve ERD, SQL, QA, runtime, tests, packages, workflows, or implementation.

This document only proposes future OpenAPI patch options.

Existing OpenAPI remains authoritative until separately patched and approved.

Reuse-first is mandatory.

Candidate paths and schemas are planning-only.

No generated client updates are approved.

Core V1 remains manual/export/review/approval/evidence only.

Readiness does not equal approval.

Evidence does not authorize publishing.

Manual publishing remains external and user-operated in Core V1.

Direct publishing, social OAuth, scheduling, paid ads, payment, analytics ingestion, attribution, external integrations, autonomous AI execution, and Post V1 module implementation remain NO-GO.

Any actual OpenAPI patch must be separately approved with explicit allowed files, forbidden files, verification commands, expected CI gates, rollback criteria, generated-client boundaries, and NO-GO boundaries.

## 2. Scope

This proposal maps Nashir Core V1 planning capabilities to current approved OpenAPI reuse candidates and identifies minimum viable future patch options.

It is limited to OpenAPI planning for:

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

- patch `docs/08_api_spec.md` or `docs/marketing_os_v5_6_5_phase_0_1_openapi.yaml`;
- add, remove, rename, or revise OpenAPI paths, operations, schemas, parameters, responses, examples, security definitions, or generated clients;
- modify ERD, SQL, QA, runtime, tests, package files, lockfiles, workflows, scripts, migrations, prototype, frontend assets, router/store files, or implementation files;
- create sprint-ready implementation tasks;
- authorize Pilot or Production readiness;
- treat readiness as approval;
- treat evidence as publishing authorization;
- treat UTM Tracking Lite as analytics ingestion or attribution;
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
- `docs/nashir_openapi_patch_planning_gate.md`
- `docs/nashir_erd_patch_proposal.md`
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

`README.md` and `docs/17_change_log.md` identify the repository as verified through Sprint 4 with selected DB-backed repository slices. HTTP/runtime product routes remain limited, and full DB-backed persistence remains NO-GO unless separately approved.

`docs/02_v1_scope.md` defines Nashir Core V1 as manual/export/review/approval/evidence only. It does not approve implementation by itself.

`docs/04_backlog.md` documents Nashir backlog planning boundaries only. It does not create sprint-ready implementation tasks.

`docs/06_erd.md` points to `docs/marketing_os_v5_6_5_phase_0_1_erd.md` as the approved ERD authority. The Nashir Option A reuse-only addendum reused existing ERD entities only and added no new entities, fields, relationships, SQL-ready definitions, constraints, indexes, enums, or table changes.

`docs/08_api_spec.md` points to `docs/marketing_os_v5_6_5_phase_0_1_openapi.yaml` as the approved OpenAPI authority. Frontend and backend must not invent product endpoints outside OpenAPI, every workspace-scoped endpoint must use route/context-derived workspace authority, `workspace_id` from request bodies must not be trusted, and ErrorModel behavior must be preserved.

## 6. Relationship to Nashir governance documents

### Nashir OpenAPI Patch Planning Gate

`docs/nashir_openapi_patch_planning_gate.md` established a documentation-only planning gate and concluded that actual OpenAPI patching remained NO-GO. This proposal narrows that planning into a reuse-first OpenAPI patch proposal without changing OpenAPI.

### OpenAPI Gate Decision Review

The OpenAPI Gate Decision Review outcome for this task is treated as governance input: NO-GO for actual OpenAPI patch now, GO only for documentation-only OpenAPI patch proposal / reuse-first decision documentation, existing OpenAPI remains authoritative, OpenAPI proposal must begin with existing paths/schemas, no generated client update is approved, and no SQL, QA, runtime, or implementation is approved.

### Nashir ERD Option A reuse-only addendum

The ERD addendum maps Nashir Core V1 to existing entities only. OpenAPI planning must start from existing paths and schemas that correspond to those reused entities. No OpenAPI patch may imply ERD entities or fields that the addendum rejected, deferred, or did not add.

### Campaign Readiness Scoring Contract

`docs/nashir_campaign_readiness_scoring_contract.md` keeps readiness advisory, explainable, and separate from approval and publishing authorization. OpenAPI planning must not expose readiness as an approval, publish, spend, analytics, or attribution decision.

### Approval State Machine Contract

`docs/nashir_approval_state_machine_contract.md` keeps approval human, version-bound, and separate from direct publishing or paid execution. OpenAPI planning must preserve review task, approval decision, content version, hash, and audit boundaries.

### Manual Publishing Evidence Contract

`docs/nashir_manual_publishing_evidence_contract.md` keeps evidence user-provided and external to publishing execution. OpenAPI planning must reuse manual evidence surfaces before considering any new evidence path or schema.

### Role & Permission Matrix

`docs/nashir_role_permission_matrix.md` defines planning-level permission semantics. OpenAPI planning must preserve workspace-scoped authorization, explicit protected-action permissions, auditability, and current guard behavior.

## 7. Reuse-first OpenAPI proposal principles

1. Reuse approved Phase 0/1 paths and schemas before proposing new paths or schemas.
2. Do not add endpoints unless existing surfaces cannot represent the Core V1 flow.
3. Do not add schemas for Post V1 modules.
4. Do not expose `workspace_id` in request bodies as trusted input.
5. Preserve route/context-derived workspace authority.
6. Preserve AuthGuard, WorkspaceContextGuard, MembershipCheck, PermissionGuard, and ErrorModel behavior.
7. Preserve idempotency where declared by OpenAPI.
8. Treat readiness as advisory and not approval.
9. Treat evidence as user-provided proof and not publishing authorization.
10. Treat UTM Lite as structured link support only, not analytics ingestion or attribution.
11. Keep manual publishing external and user-operated.
12. Keep candidate OpenAPI paths and schemas planning-only until separately approved.

## 8. Existing OpenAPI reuse candidates

| Surface | Existing OpenAPI reuse candidates | Proposal note |
|---|---|---|
| workspace / membership / RBAC paths | `/workspaces`, `/workspaces/{workspaceId}`, `/workspaces/{workspaceId}/members`, `/workspaces/{workspaceId}/members/{memberId}`, `/roles`, `/permissions` | Reuse for tenant context, membership, role, and permission discovery. Preserve route-derived workspace authority. |
| campaign paths | `/workspaces/{workspaceId}/campaigns`, `/workspaces/{workspaceId}/campaigns/{campaignId}` | Reuse for campaign basics and campaign-level grouping. |
| campaign state transition paths | `/workspaces/{workspaceId}/campaigns/{campaignId}/state-transitions` | Reuse for existing campaign lifecycle transition history where current semantics are sufficient. |
| brief version paths | `/workspaces/{workspaceId}/campaigns/{campaignId}/brief-versions` | Reuse for Smart Wizard output, manual intake, advertised object detail, landing destination notes, idea intake, content requirements, hashtags, video reference scripts, and versioned campaign brief content. |
| media job / media asset / media asset version paths | `/workspaces/{workspaceId}/campaigns/{campaignId}/media-jobs`, `/workspaces/{workspaceId}/media-jobs/{mediaJobId}`, `/workspaces/{workspaceId}/media-jobs/{mediaJobId}/status`, `/workspaces/{workspaceId}/media-jobs/{mediaJobId}/assets`, `/workspaces/{workspaceId}/assets/{mediaAssetId}/versions` | Reuse approved names; do not introduce `GenerationJob` or standalone `Asset`. |
| review task / approval decision paths | `/workspaces/{workspaceId}/asset-versions/{mediaAssetVersionId}/review-tasks`, `/workspaces/{workspaceId}/review-tasks/{reviewTaskId}/decisions` | Reuse for human review, approval, rejection, and version-bound decision records. |
| publish job paths | `/workspaces/{workspaceId}/approval-decisions/{approvalDecisionId}/publish-jobs` | Reuse only for manual publishing support after approval. No direct publishing or scheduling. |
| manual evidence paths | `/workspaces/{workspaceId}/publish-jobs/{publishJobId}/manual-evidence`, `/workspaces/{workspaceId}/manual-evidence/{manualPublishEvidenceId}/supersede`, `/workspaces/{workspaceId}/manual-evidence/{manualPublishEvidenceId}/invalidate` | Reuse for user-provided evidence. Evidence is proof only and does not authorize publishing. |
| tracked link paths | `/workspaces/{workspaceId}/publish-jobs/{publishJobId}/tracked-links` | Reuse for UTM Tracking Lite. Do not treat as analytics ingestion or attribution. |
| client report snapshot paths | `/workspaces/{workspaceId}/campaigns/{campaignId}/client-report-snapshots` | Reuse for frozen manual review/report snapshots using user-entered observations. |
| audit log paths | `/workspaces/{workspaceId}/audit-logs` | Reuse for traceability where current audit semantics are sufficient. Do not make audit logs the business state source. |
| onboarding-progress paths | `/workspaces/{workspaceId}/onboarding-progress` | Reuse for limited readiness/setup adjacency only. No setup checklist path was observed in the inspected OpenAPI paths. |

## 9. Existing schema reuse candidates

| Existing schema | Reuse proposal |
|---|---|
| `Workspace` | Reuse as the tenant/workspace surface. |
| `WorkspaceMember` | Reuse for membership and workspace actor context. |
| `Role` | Reuse for baseline workspace role authority. |
| `Permission` | Reuse for protected-action permission codes. |
| `Campaign` | Reuse for campaign basics, objective, status, and campaign-level grouping. |
| `CampaignStateTransition` | Reuse for existing campaign lifecycle transition history. |
| `BriefVersion` | Reuse for versioned intake, brief, content requirements, hashtags, video scripts, advertised object details, and landing destination notes where current shape is sufficient. |
| `MediaJob` | Reuse for existing media generation/job tracking surfaces without introducing autonomous AI execution. |
| `MediaAsset` | Reuse as approved asset grouping. |
| `MediaAssetVersion` | Reuse for version-bound reviewable variants, content hash, and approval lock integrity. |
| `ReviewTask` | Reuse for human review workflow records. |
| `ApprovalDecision` | Reuse as approval truth for reviewed content versions. |
| `PublishJob` | Reuse only for manual/semi-manual publishing support after approval; not direct publishing. |
| `ManualPublishEvidence` | Reuse for append/supersede/invalidate user-provided evidence. |
| `TrackedLink` | Reuse for structured links and UTM Lite, not analytics ingestion or attribution. |
| `ClientReportSnapshot` | Reuse for frozen manual performance review/report snapshots using user-entered data. |
| `AuditLog` | Reuse for sensitive write traceability. |
| `OnboardingProgressResponse` | Reuse for limited readiness/setup adjacency. |
| `ErrorModel` / `ErrorResponse` | Reuse for all future error responses; preserve ErrorModel behavior. |
| `WorkspaceId` | Reuse as route/context workspace identifier; do not trust body `workspace_id`. |
| `IdempotencyKey` | Reuse where OpenAPI declares idempotent operations. |

## 10. Nashir capability-to-OpenAPI proposal matrix

| Nashir capability | Existing OpenAPI reuse surface | Proposed OpenAPI action | New path needed? yes/no/defer | Schema change needed? yes/no/defer | Generated client impact | Risk | Decision |
|---|---|---|---|---|---|---|---|
| Readiness Dashboard | Campaign, brief version, approval, evidence, audit, and onboarding-progress paths. | Reuse existing read surfaces and derive display state. | defer | defer | None approved. | Readiness could be mistaken for approval. | Defer dedicated readiness path and schema. |
| Smart Wizard | Campaign and brief-version paths. | Reuse `CreateCampaignRequest` and brief-version content where sufficient. | defer | defer | None approved. | Wizard sessions could duplicate brief truth. | Reuse brief versions first. |
| Product / Store / Service / Offer intake | Campaign and brief-version paths. | Reuse campaign basics plus versioned brief content. | defer | defer | None approved. | Object-specific APIs could imply unapproved ERD entities. | Defer object-specific intake paths and schemas. |
| Campaign basics | Campaign paths. | Reuse existing campaign list/create/get/update surfaces. | no | no | None. | Low. | Reuse existing campaign APIs. |
| Advertised object flow | Campaign and brief-version paths. | Represent in campaign/brief content first. | defer | defer | None approved. | Duplicate advertised-object truth. | Defer first-class advertised-object API. |
| Landing destination | Brief-version and tracked-link paths. | Reuse content and tracked links. | defer | defer | None approved. | Destination changes may require reapproval. | Reuse existing surfaces; defer dedicated destination path. |
| Creative rights confirmation | Media asset version, review task, approval decision, manual evidence, and audit paths. | Reuse approval/evidence/audit surfaces first. | defer | defer | None approved. | Rights gaps can create unsafe manual publishing support. | Defer rights endpoint and schema. |
| Idea intake | Brief-version paths. | Reuse versioned brief content. | no | defer | None approved. | AI/advisory content could become confirmed fact. | Reuse brief content; no dedicated path initially. |
| Content requirements | Brief-version and media asset version paths. | Reuse versioned content where sufficient. | defer | defer | None approved. | Output taxonomy could be over-specified too early. | Defer dedicated requirements path/schema. |
| Hashtags per channel | Brief-version and media asset version paths. | Reuse draft/versioned content. | no | defer | None approved. | Trend, reach, analytics, or optimization creep. | Keep draft/advisory. |
| Video reference scripts | Brief-version and media asset version paths. | Reuse draft/versioned content only. | no | defer | None approved. | Could imply video generation/editing or template runtime. | Keep draft/reference only. |
| UTM Tracking Lite | Tracked-link paths. | Reuse publish-job tracked links. | defer | defer | None approved. | UTM could be misread as attribution. | Reuse `TrackedLink`; defer dedicated UTM path. |
| Human approval | Review-task and approval-decision paths. | Reuse existing review and approval operations. | no | no | None. | Approval bypass if readiness is conflated. | Reuse existing approval APIs. |
| Approval lock | Media asset version, approval decision, publish job, and audit paths. | Reuse version/hash/audit semantics first. | defer | defer | None approved. | Material-change reapproval gaps. | Defer lock/reapproval endpoint unless proven necessary. |
| Manual publishing checklist | Publish job, manual evidence, and audit paths. | Keep UI-derived or reuse existing state where sufficient. | defer | defer | None approved. | Checklist could be mistaken for publishing action. | Defer persisted checklist endpoint. |
| Manual publishing evidence | Manual evidence paths. | Reuse submit/list/supersede/invalidate surfaces. | no | defer | None approved. | Evidence could be mistaken for publishing authorization. | Reuse existing evidence APIs. |
| Manual performance review | Client report snapshot paths. | Reuse frozen snapshots with user-entered observations. | defer | defer | None approved. | Analytics ingestion/attribution creep. | Reuse snapshots; defer manual-review path. |
| Role & permission matrix | Workspace, member, role, permission, and audit paths. | Reuse RBAC and audit surfaces. | defer | defer | None approved. | Policy overlays can duplicate authority. | Reuse existing RBAC first. |

## 11. Minimum viable OpenAPI proposal

The minimum viable OpenAPI proposal is Option A reuse-first:

- reuse existing endpoints as-is;
- use existing schemas where sufficient;
- defer new paths;
- defer generated client updates;
- reject Post V1 endpoints.

This path preserves the merged ERD Option A reuse-only addendum and avoids creating duplicate APIs or schema surfaces before concrete gaps are proven.

## 12. Candidate schema clarifications, planning-only

The following clarifications are planning-only and are not approved OpenAPI changes:

| Candidate clarification | Candidate placement to evaluate | Boundary |
|---|---|---|
| readiness response/explanation wording | Existing descriptions around campaign, brief, onboarding, approval, evidence, or a future deferred readiness response | Readiness remains advisory and does not equal approval. |
| `TrackedLink` UTM Lite descriptions | `TrackedLink` request/response descriptions if existing wording is insufficient | UTM Lite is structured link support only, not analytics ingestion or attribution. |
| `ManualPublishEvidence` wording | `ManualPublishEvidence` descriptions if existing wording is insufficient | Evidence is user-provided proof and does not authorize publishing. |
| approval/reapproval wording | `ReviewTask`, `ApprovalDecision`, `MediaAssetVersion`, or operation descriptions if existing wording is insufficient | Approval is human, version-bound, and separate from readiness. |
| `ClientReportSnapshot` user-entered manual performance wording | `ClientReportSnapshot` descriptions if existing wording is insufficient | Manual performance review uses user-entered data only and does not ingest platform analytics. |
| permission-code documentation | `Permission`, operation `x-permission`, or descriptive notes if existing wording is insufficient | Permission semantics must preserve workspace-scoped authorization and current guard behavior. |

## 13. Candidate new paths, deferred

The following candidate paths are deferred and not approved:

- campaign readiness endpoint;
- wizard session/answer endpoints;
- product/store/service/offer intake endpoints;
- landing destination endpoint;
- creative rights endpoint;
- content requirement/hashtag/video script endpoints;
- approval lock/reapproval endpoint;
- manual publishing checklist endpoint;
- manual performance review endpoint;
- Nashir-specific permission policy endpoint.

## 14. Explicit OpenAPI NO-GO

The following endpoint categories remain explicitly NO-GO:

- direct publishing endpoints;
- social OAuth endpoints;
- scheduling endpoints;
- paid ads execution endpoints;
- payment/billing endpoints;
- analytics ingestion endpoints;
- attribution endpoints;
- external integration connector endpoints;
- autonomous AI execution endpoints;
- Post V1 Organic Publishing Module endpoints;
- Post V1 Paid Campaign Execution Module endpoints.

## 15. Open questions before actual OpenAPI patch

1. Which exact Nashir Core V1 user flow cannot be represented by existing paths?
2. Is the need a path gap, schema description gap, enum/status gap, request validation gap, or generated-client naming gap?
3. Can `Campaign`, `BriefVersion`, `MediaAssetVersion`, `ReviewTask`, `ApprovalDecision`, `PublishJob`, `ManualPublishEvidence`, `TrackedLink`, `ClientReportSnapshot`, `OnboardingProgressResponse`, or `AuditLog` represent the flow without new paths?
4. Does the proposed request body avoid trusted `workspace_id`?
5. Does the route carry workspace context for every workspace-scoped operation?
6. Which permission code and audit event apply to each protected operation?
7. Does the proposal preserve ErrorModel responses?
8. Does the proposal require generated client updates, and if so which generated-client boundary is approved?
9. Does the proposal require ERD, SQL, QA, Threat Model, runtime, or test changes?
10. Does the proposal accidentally introduce direct publishing, social OAuth, scheduling, paid execution, payment, analytics ingestion, attribution, external integrations, autonomous AI execution, or Post V1 module scope?

## 16. Proposed actual OpenAPI patch options

| Option | Description | Benefit | Risk | Decision |
|---|---|---|---|---|
| Option A: reuse-only / no new paths or schemas | Make no OpenAPI changes. Map Nashir Core V1 to existing paths and schemas only. | Lowest blast radius; preserves current authority; avoids duplicate state and generated-client churn. | May leave some semantics in narrative docs rather than OpenAPI descriptions. | Recommended first. |
| Option B: narrow schema description clarifications only | Leave paths unchanged and consider narrow schema or operation description clarifications only where current reuse wording is ambiguous. | Keeps API surface stable while improving review clarity. | Still touches OpenAPI and may require lint/QA review and generated-client boundary decision. | Conditional later step only if concrete ambiguity blocks review. |
| Option C: limited new paths/schemas later | Add new endpoints or schemas only after separate proof that existing surfaces cannot represent a Core V1 flow. | Can address proven gaps. | Highest scope risk; likely requires ERD, SQL, QA, Threat Model, generated-client, and implementation planning. | Defer. |

Recommended option: Option A. The OpenAPI Gate Decision Review says NO-GO for actual OpenAPI patch now and GO only for documentation-only proposal / reuse-first decision documentation. If actual OpenAPI work is later approved, existing paths and schemas should be exhausted before schema descriptions or new paths are considered.

## 17. Risk assessment

| Risk | Severity | Mitigation |
|---|---|---|
| endpoint sprawl | High if Nashir concepts become first-class paths too early. | Reuse existing campaign, brief, review, approval, publish job, evidence, tracked link, report, onboarding, audit, and RBAC paths first. |
| schema sprawl | High if planning concepts become schemas before ERD/QA proof. | Prefer existing schemas and narrow descriptions only after proven ambiguity. |
| duplicate APIs | High if wizard, readiness, checklist, evidence, or manual review paths duplicate existing surfaces. | Require proof that existing surfaces cannot represent the flow. |
| workspace_id trust boundary violation | High. | Future request bodies must not trust `workspace_id`; route/context workspace authority remains mandatory. |
| readiness vs approval confusion | High. | State that readiness is advisory and never approval or publishing authorization. |
| evidence vs publishing authorization confusion | High. | State that evidence is proof of external user action only and does not authorize or execute publishing. |
| UTM vs attribution confusion | Medium. | Keep UTM Lite as structured link support only, with no analytics ingestion or attribution. |
| generated client churn | Medium. | Defer generated-client updates unless separately approved with explicit boundaries. |
| Post V1 scope creep | High. | Reject direct publishing, social OAuth, scheduling, paid execution, analytics ingestion, attribution, integrations, autonomous AI execution, and Post V1 module endpoints. |

## 18. Dependencies

- ERD dependency: the merged ERD Option A reuse-only addendum added no new entities or fields. Any future OpenAPI path or schema requiring new persisted structure must stop until a separately approved ERD patch exists.
- SQL dependency: no SQL migration is approved. Any future OpenAPI proposal requiring new persisted fields, statuses, constraints, indexes, enums, or tables must stop until a separately approved SQL migration plan exists.
- QA dependency: no QA update is approved. Any future OpenAPI patch that changes paths, schemas, validation, permissions, idempotency, ErrorModel behavior, generated clients, or operation boundaries requires separately approved QA/Test Plan updates and verification gates.
- Threat Model dependency: future OpenAPI patches must preserve tenant isolation, authorization, evidence integrity, approval lock, manual publishing boundaries, UTM/analytics separation, and no-trusted-body-workspace rules.
- generated client dependency: no generated client updates are approved. Any generated-client change requires explicit approval, boundaries, verification commands, expected CI gates, and rollback criteria.

## 19. Verification expectations for any future actual OpenAPI patch

Any future actual OpenAPI patch should, at minimum, verify:

- changed files are exactly within the approved files for that future request;
- no forbidden OpenAPI-adjacent, SQL, QA, runtime, generated client, test, package, workflow, script, migration, prototype, frontend, router/store, or implementation files changed unless explicitly approved;
- OpenAPI syntax parses;
- OpenAPI lint passes with repository-approved commands;
- route-derived workspace context is preserved;
- request bodies do not trust `workspace_id`;
- ErrorModel / ErrorResponse behavior remains documented;
- permissions and idempotency declarations remain intact where applicable;
- generated-client boundaries are honored;
- NO-GO endpoint categories are absent.

## 20. Rollback / NO-GO criteria for future actual OpenAPI patch

Future actual OpenAPI patch work must stop or roll back if:

- it requires an unapproved ERD, SQL, QA, Threat Model, runtime, generated-client, test, package, workflow, script, migration, prototype, frontend, router/store, or implementation change;
- it introduces direct publishing, social OAuth, scheduling, paid ads, payment, analytics ingestion, attribution, external integration, autonomous AI execution, or Post V1 module endpoints;
- it trusts `workspace_id` from request bodies;
- it weakens AuthGuard, WorkspaceContextGuard, MembershipCheck, PermissionGuard, tenant isolation, or ErrorModel behavior;
- it treats readiness as approval;
- it treats evidence as publishing authorization;
- it treats UTM Lite as analytics ingestion or attribution;
- it creates duplicate APIs for flows already represented by existing paths without approved justification;
- it requires generated client updates without explicit generated-client approval.

## 21. Recommended sequencing

1. Review this proposal for source alignment and NO-GO boundaries.
2. Decide whether Option A reuse-only is enough for Nashir Core V1 API planning.
3. If schema clarification is still needed, approve a narrow Option B request with explicit allowed files, forbidden files, verification commands, expected CI gates, generated-client boundaries, rollback criteria, and NO-GO boundaries.
4. If new paths or schemas are still needed, require ERD, SQL, QA, Threat Model, generated-client, and implementation planning before any Option C OpenAPI patch.
5. Keep runtime, generated clients, tests, packages, workflows, migrations, prototype/frontend, and implementation files forbidden until separately approved.

## 22. GO / NO-GO decision

GO: Add this documentation-only OpenAPI Patch Proposal.

GO: Recommend Option A, reuse-only / no new paths or schemas, as the first candidate actual OpenAPI path if separately approved later.

CONDITIONAL GO: Option B narrow schema description clarifications only if concrete ambiguity blocks review and a later request explicitly approves OpenAPI files, verification commands, expected CI gates, generated-client boundaries, rollback criteria, and NO-GO boundaries.

NO-GO: Actual OpenAPI patch in this document.

NO-GO: Generated client updates.

NO-GO: New paths or schemas in this document.

NO-GO: ERD, SQL, QA, Threat Model, runtime, tests, packages, workflows, scripts, migrations, prototype, frontend assets, router/store files, or implementation changes.

NO-GO: Direct publishing, social OAuth, scheduling, paid ads, payment, analytics ingestion, attribution, external integrations, autonomous AI execution, and Post V1 module implementation.

Existing OpenAPI remains authoritative until separately patched and approved.

## 23. Safe files to edit later if approved

If a later OpenAPI patch is explicitly approved, safe files must be listed in that future request. Candidate safe files may include only the approved OpenAPI contract or approved documentation files named by that request.

Generated clients, runtime files, tests, SQL, package files, workflows, scripts, migrations, prototype, frontend assets, and implementation files must remain forbidden unless explicitly allowed by a later approved request.

## 24. Files that must remain forbidden

The following remain forbidden for this proposal and for any later work unless separately and explicitly approved:

- `docs/08_api_spec.md`
- `docs/marketing_os_v5_6_5_phase_0_1_openapi.yaml`
- OpenAPI files
- generated clients
- SQL files
- ERD files
- `src/`
- tests
- `test/`
- `package.json`
- lockfiles
- `.github/workflows/`
- `scripts/`
- migrations
- `prototype/`
- frontend assets
- runtime router/store files
- any implementation file
- any ERD/OpenAPI/SQL/QA contract file unless explicitly listed by the later approved request
