# Nashir OpenAPI Patch Planning Gate

## 1. Purpose

This document is documentation-only.

It creates an OpenAPI Patch Planning Gate for Nashir Core V1 after the merged ERD Option A reuse-only addendum.

This document does not approve OpenAPI changes.

This document does not approve generated client changes.

This document does not approve ERD, SQL, QA, runtime, tests, packages, workflows, or implementation.

This document only identifies OpenAPI planning candidates and decision gates.

Existing OpenAPI remains authoritative until separately patched and approved.

Existing ERD remains authoritative and the ERD Option A reuse-only addendum added no new entities or fields.

Core V1 remains manual/export/review/approval/evidence only.

Readiness does not equal approval.

Evidence does not authorize publishing.

Manual publishing remains external and user-operated in Core V1.

Direct publishing, social OAuth, scheduling, paid ads, payment, analytics ingestion, attribution, external integrations, autonomous AI execution, and Post V1 module implementation remain NO-GO.

Any future OpenAPI patch must be separately approved with explicit allowed files, forbidden files, verification commands, expected CI gates, rollback/no-go criteria, and generated-client boundaries.

## 2. Scope

This planning gate reviews Nashir Core V1 capabilities against the current approved OpenAPI authority and identifies possible endpoint reuse, schema reuse, operation-boundary, governance, and decision questions.

It is limited to planning for manual, export, review, approval, checklist, evidence, UTM Lite, and user-entered manual review workflows.

## 3. Non-goals

This document does not:

- patch `docs/08_api_spec.md` or `docs/marketing_os_v5_6_5_phase_0_1_openapi.yaml`;
- add, remove, rename, or revise OpenAPI paths, operations, schemas, parameters, responses, examples, security definitions, or generated clients;
- modify ERD, SQL, QA, runtime, tests, package files, lockfiles, workflows, scripts, migrations, prototype, frontend assets, router/store files, or implementation files;
- create sprint-ready implementation tasks;
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
- `docs/nashir_erd_patch_planning_gate.md`
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

`README.md` and `docs/17_change_log.md` identify a verified baseline through Sprint 4 with selected DB-backed repository slices. HTTP/runtime product routes remain limited, and full DB-backed persistence remains NO-GO unless separately approved.

`docs/02_v1_scope.md` defines Nashir Core V1 as manual/export/review/approval/evidence only. It does not approve implementation by itself.

`docs/04_backlog.md` documents Nashir backlog planning boundaries only. It does not create sprint-ready implementation tasks.

`docs/06_erd.md` points to `docs/marketing_os_v5_6_5_phase_0_1_erd.md` as the approved ERD authority. The merged Nashir Option A reuse-only addendum reused existing ERD entities only and added no new entities, fields, relationships, SQL-ready definitions, constraints, indexes, enums, or table changes.

`docs/08_api_spec.md` points to `docs/marketing_os_v5_6_5_phase_0_1_openapi.yaml` as the approved OpenAPI authority. Frontend and backend must not invent product endpoints outside OpenAPI, every workspace-scoped endpoint must use route/context-derived workspace authority, `workspace_id` from request bodies must not be trusted, and ErrorModel behavior must be preserved.

## 6. Relationship to prior Nashir documents

### Nashir ERD Option A reuse-only addendum

The ERD addendum maps Nashir Core V1 to existing entities only. OpenAPI planning must start from existing paths and schemas that correspond to those reused entities. No OpenAPI patch may imply ERD entities or fields that the addendum rejected, deferred, or did not add.

### Nashir ERD Patch Proposal

`docs/nashir_erd_patch_proposal.md` recommended reuse-first ERD treatment. This OpenAPI gate carries the same reuse-first rule into endpoint and schema planning.

### Nashir ERD/OpenAPI/QA/Threat Model impact review

`docs/nashir_erd_openapi_qa_threat_model_impact_review.md` identified OpenAPI impact candidates only. This gate narrows those candidates into decision questions and a planning matrix without approving a patch.

### Campaign Readiness Scoring Contract

`docs/nashir_campaign_readiness_scoring_contract.md` keeps readiness advisory, explainable, and separate from approval and publishing authorization. OpenAPI planning must not expose readiness as an approval, publish, spend, analytics, or attribution decision.

### Approval State Machine Contract

`docs/nashir_approval_state_machine_contract.md` keeps approval human, version-bound, and separate from direct publishing or paid execution. OpenAPI planning must preserve review task, approval decision, content version, hash, and audit boundaries.

### Manual Publishing Evidence Contract

`docs/nashir_manual_publishing_evidence_contract.md` keeps evidence user-provided and external to publishing execution. OpenAPI planning must reuse manual evidence surfaces before considering any new evidence path or schema.

### Role & Permission Matrix

`docs/nashir_role_permission_matrix.md` defines planning-level permission semantics. OpenAPI planning must preserve workspace-scoped authorization, explicit protected-action permissions, auditability, and current guard behavior.

## 7. OpenAPI planning principles

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
12. Keep candidate OpenAPI changes planning-only until separately approved.

## 8. Current OpenAPI support summary

### Existing paths that may partially support Nashir Core V1

Current OpenAPI surfaces that may partially support Nashir Core V1 include:

- `/workspaces`, `/workspaces/{workspaceId}`, `/workspaces/{workspaceId}/members`, `/roles`, and `/permissions` for workspace, membership, and RBAC context.
- `/workspaces/{workspaceId}/campaigns` and `/workspaces/{workspaceId}/campaigns/{campaignId}` for campaign basics.
- `/workspaces/{workspaceId}/campaigns/{campaignId}/state-transitions` for campaign lifecycle transition history.
- `/workspaces/{workspaceId}/campaigns/{campaignId}/brief-versions` for versioned manual intake, brief, and draft content.
- `/workspaces/{workspaceId}/campaigns/{campaignId}/media-jobs`, `/workspaces/{workspaceId}/media-jobs/{mediaJobId}`, `/workspaces/{workspaceId}/media-jobs/{mediaJobId}/status`, `/workspaces/{workspaceId}/media-jobs/{mediaJobId}/assets`, and `/workspaces/{workspaceId}/assets/{mediaAssetId}/versions` for media job, asset, and asset-version surfaces.
- `/workspaces/{workspaceId}/asset-versions/{mediaAssetVersionId}/review-tasks` and `/workspaces/{workspaceId}/review-tasks/{reviewTaskId}/decisions` for review and approval.
- `/workspaces/{workspaceId}/approval-decisions/{approvalDecisionId}/publish-jobs` for approval-gated manual publishing support.
- `/workspaces/{workspaceId}/publish-jobs/{publishJobId}/manual-evidence`, `/workspaces/{workspaceId}/manual-evidence/{manualPublishEvidenceId}/supersede`, and `/workspaces/{workspaceId}/manual-evidence/{manualPublishEvidenceId}/invalidate` for manual publishing evidence.
- `/workspaces/{workspaceId}/publish-jobs/{publishJobId}/tracked-links` for UTM Lite candidate reuse.
- `/workspaces/{workspaceId}/campaigns/{campaignId}/client-report-snapshots` for frozen manual review/report snapshots.
- `/workspaces/{workspaceId}/audit-logs` and `/workspaces/{workspaceId}/onboarding-progress` for audit and limited readiness/setup adjacency.

No setup checklist path is currently present in the inspected OpenAPI paths even though `SetupChecklistItem` exists in ERD authority.

### Existing schemas that may be reused

Candidate reusable schemas include `Workspace`, `WorkspaceMember`, `Role`, `Permission`, `Campaign`, `CampaignStateTransition`, `BriefVersion`, `MediaJob`, `MediaAsset`, `MediaAssetVersion`, `ReviewTask`, `ApprovalDecision`, `PublishJob`, `ManualPublishEvidence`, `TrackedLink`, `ClientReportSnapshot`, `AuditLog`, `OnboardingProgressResponse`, and their existing request/response/list wrappers where present.

`ErrorModel`, `ErrorResponse`, `WorkspaceId`, and `IdempotencyKey` remain shared governance surfaces.

### Existing operation boundaries

Existing operation families include list/create/get/update for workspace, member, campaign, brief, media, evidence, tracked link, report, cost, audit, and onboarding surfaces. Sensitive state changes already appear as explicit operations such as `createApprovalDecision`, `createPublishJob`, `submitManualPublishEvidence`, `supersedeManualPublishEvidence`, and `invalidateManualPublishEvidence`.

Manual evidence is append/supersede/invalidate oriented. The contract explicitly does not expose ManualPublishEvidence PATCH or DELETE.

### Existing ErrorModel / auth / workspace context rules

The OpenAPI contract declares bearer authentication, global guards, route-derived workspace context, `body_workspace_id_trusted: false`, ErrorModel responses, and NO-GO rules for trusting body workspace IDs or reading/writing workspace-scoped records without route/context workspace authority.

Any future OpenAPI patch must preserve these rules and must not weaken AuthGuard, WorkspaceContextGuard, MembershipCheck, PermissionGuard, tenant isolation, or ErrorModel behavior.

## 9. Existing OpenAPI surfaces to inspect and map

| Surface | Existing OpenAPI paths to inspect | Planning notes |
|---|---|---|
| Workspace / membership / RBAC | `/workspaces`, `/workspaces/{workspaceId}`, `/workspaces/{workspaceId}/members`, `/workspaces/{workspaceId}/members/{memberId}`, `/roles`, `/permissions` | Preserve route-derived workspace authority and explicit permissions. |
| Campaign paths | `/workspaces/{workspaceId}/campaigns`, `/workspaces/{workspaceId}/campaigns/{campaignId}`, `/workspaces/{workspaceId}/campaigns/{campaignId}/state-transitions` | Primary reuse candidate for campaign basics and lifecycle status. |
| Brief/version paths | `/workspaces/{workspaceId}/campaigns/{campaignId}/brief-versions` | Primary reuse candidate for Smart Wizard output, intake, requirements, hashtags, scripts, and destination notes. |
| Media job / media asset / media asset version paths | `/workspaces/{workspaceId}/campaigns/{campaignId}/media-jobs`, `/workspaces/{workspaceId}/media-jobs/{mediaJobId}`, `/workspaces/{workspaceId}/media-jobs/{mediaJobId}/status`, `/workspaces/{workspaceId}/media-jobs/{mediaJobId}/assets`, `/workspaces/{workspaceId}/assets/{mediaAssetId}/versions` | Reuse approved names; do not introduce `GenerationJob` or standalone `Asset`. |
| Review / approval paths | `/workspaces/{workspaceId}/asset-versions/{mediaAssetVersionId}/review-tasks`, `/workspaces/{workspaceId}/review-tasks/{reviewTaskId}/decisions` | Human approval and approval lock planning must bind to reviewed versions. |
| Publish job paths | `/workspaces/{workspaceId}/approval-decisions/{approvalDecisionId}/publish-jobs` | Manual publishing support only; no direct publishing or scheduling. |
| Manual publish evidence paths | `/workspaces/{workspaceId}/publish-jobs/{publishJobId}/manual-evidence`, `/workspaces/{workspaceId}/manual-evidence/{manualPublishEvidenceId}/supersede`, `/workspaces/{workspaceId}/manual-evidence/{manualPublishEvidenceId}/invalidate` | Evidence is proof only; no PATCH or DELETE. |
| Tracked link paths | `/workspaces/{workspaceId}/publish-jobs/{publishJobId}/tracked-links` | UTM Lite candidate; not analytics ingestion or attribution. |
| Client report snapshot paths | `/workspaces/{workspaceId}/campaigns/{campaignId}/client-report-snapshots` | Manual performance review candidate using user-entered/frozen snapshots only. |
| Audit / onboarding / setup checklist paths if present | `/workspaces/{workspaceId}/audit-logs`, `/workspaces/{workspaceId}/onboarding-progress`; no setup checklist path observed | Audit can support traceability; onboarding can support limited readiness adjacency. Setup checklist is not currently exposed by OpenAPI. |

## 10. Nashir capability-to-OpenAPI planning matrix

| Capability | Existing OpenAPI support | Candidate reuse | Candidate new path | Candidate schema impact | Request/response governance concern | Risk level | Decision |
|---|---|---|---|---|---|---|---|
| Readiness Dashboard | Partial through campaign, brief, approval, evidence, audit, and onboarding paths. | Reuse existing read surfaces and derive display state. | Defer `/workspaces/{workspaceId}/campaigns/{campaignId}/readiness` unless derivation is insufficient. | Defer readiness response schema unless required for explainability. | Must not imply approval or publishing eligibility. | Medium | Plan Option A reuse first; no path approved. |
| Smart Wizard | Partial through campaign and brief-version create/list. | Reuse `CreateCampaignRequest` and `CreateBriefVersionRequest` output where sufficient. | Defer wizard session/answer paths. | Defer intake schemas; prefer `BriefVersion` content. | Must distinguish user-provided/confirmed content from generated suggestions if later exposed. | Medium | Reuse brief versions first. |
| Product / Store / Service / Offer intake | Partial through campaign and brief-version paths. | Reuse campaign basics plus versioned brief content. | Defer object-specific intake paths. | Defer product/store/service/offer schemas. | Avoid first-class business object APIs not supported by ERD. | Medium | No new path unless existing content cannot represent intake. |
| Campaign basics | Supported by campaign list/create/get/update. | Reuse `/campaigns` paths. | None expected. | None expected. | Request body must not be trusted for workspace authority. | Low | Reuse existing campaign APIs. |
| Advertised object flow | Partial through campaign and brief versions. | Reuse `Campaign` and `BriefVersion`. | Defer advertised-object path. | Defer advertised-object schema. | Avoid duplicate object truth outside campaign/brief. | Medium | Keep versioned content first. |
| Landing destination | Partial through brief versions and tracked links. | Reuse `BriefVersion`, `TrackedLink`, and `PublishJob`. | Defer destination-specific path. | Defer destination schema; UTM fields only if separately approved. | Destination change may be material and require reapproval. | Medium | Reuse links/content; preserve approval lock. |
| Creative rights confirmation | Partial through review, approval, evidence, asset-version, and audit paths. | Reuse approval/evidence/audit surfaces. | Defer rights-confirmation path. | Defer rights schema. | Rights cannot be silently overwritten or treated as evidence acceptance. | High | Future patch must align with approval/evidence contracts. |
| Idea intake | Partial through brief versions. | Reuse `BriefVersion`. | None expected initially. | Defer idea-source fields. | AI/advisory language must not become confirmed fact. | Low | Reuse brief content. |
| Content requirements | Partial through brief versions and media asset versions. | Reuse versioned brief/content outputs. | Defer content-requirements path. | Defer requirements schema. | Avoid over-specifying output taxonomy before QA. | Medium | Candidate schema only if required. |
| Hashtags per channel | Partial as brief or asset-version content. | Reuse versioned content. | None expected. | Defer hashtag schema. | Must not imply trend ingestion, reach guarantee, analytics, or optimization. | Low | Keep draft/advisory. |
| Video reference scripts | Partial as brief or asset-version content. | Reuse versioned content only. | None expected. | Defer script schema. | Must not imply video generation, editing, asset procurement, or template runtime. | Low | Keep draft/reference only. |
| UTM Tracking Lite | Partial through tracked link paths. | Reuse `/publish-jobs/{publishJobId}/tracked-links`. | Defer dedicated UTM path. | Candidate UTM request fields only if current `TrackedLink` is insufficient. | Must not ingest analytics or provide attribution. | Medium | Reuse tracked links. |
| Human approval | Supported through review task and approval decision paths. | Reuse `ReviewTask` and `ApprovalDecision`. | None expected. | None expected unless state labels require clarification. | Approval must be human, explicit, version-bound, and permission-gated. | Low | Reuse existing approval APIs. |
| Approval lock | Partial through asset version, approval decision, publish job, and audit. | Reuse content hash/version and approval decision rules. | Defer lock/reapproval path. | Defer lock state schema. | Material changes after approval require re-review; readiness cannot override lock. | High | Prefer existing version/hash/audit semantics. |
| Manual publishing checklist | Partial through publish job, evidence, audit, and possibly UI-derived state. | Reuse publish job and evidence readiness; keep UI-derived if possible. | Defer checklist path. | Defer checklist schema. | Checklist must not trigger publishing. | Medium | No dedicated path unless persistence is separately approved. |
| Manual publishing evidence | Supported through evidence submit/list/supersede/invalidate. | Reuse manual evidence paths. | None expected initially. | Candidate narrow status clarification only if contract gap is proven. | Evidence does not authorize publishing and must remain append/supersede/invalidate oriented. | High | Reuse existing evidence APIs. |
| Manual performance review | Partial through client report snapshots. | Reuse `ClientReportSnapshot`. | Defer manual-review path. | Defer user-entered metric schema if current snapshot is insufficient. | Must not ingest platform analytics or imply attribution. | Medium | Reuse report snapshots. |
| Role & permission matrix | Partial through workspace member, role, permission, and audit paths. | Reuse RBAC and audit paths. | Defer Nashir-specific permission policy paths. | Candidate permission-code documentation only if separately approved. | Permissions must remain workspace-scoped and auditable. | High | Reuse existing RBAC first. |

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

## 12. Candidate OpenAPI planning options

### Option A: reuse existing endpoints and schemas only

Option A would make no OpenAPI changes. Nashir Core V1 planning would map to current campaign, brief, media, review, approval, publish job, manual evidence, tracked link, client report snapshot, onboarding, audit, workspace, membership, and RBAC surfaces.

This is the recommended option for the next actual OpenAPI step, if later approved, because the ERD addendum was reuse-only and added no new entities or fields.

### Option B: narrow schema-only clarifications

Option B would leave paths unchanged and consider narrow schema or description clarifications only where current request/response descriptions are ambiguous for approved reuse. Any schema clarification must avoid adding Post V1 modules, direct publishing, analytics ingestion, attribution, external integration, autonomous AI, or unapproved ERD concepts.

### Option C: new endpoints or schemas later

Option C would add new endpoints or schemas only after separate proof that existing surfaces cannot represent a Core V1 flow. This option requires a separately approved OpenAPI patch request, generated-client boundary decision, ERD consistency review, QA/Test Plan, Threat Model review, and implementation gate.

### Recommended option

Recommend Option A now: reuse existing endpoints and schemas only. Option B may be considered later for narrow documentation/schema clarifications if a concrete ambiguity blocks review. Option C should remain deferred until reuse gaps are proven and separately approved.

## 13. Reuse-first decision rules

- Prefer existing campaign, brief, approval, publish job, manual evidence, tracked link, report snapshot, onboarding, and audit endpoints where sufficient.
- Do not create new paths unless existing surfaces cannot represent the flow.
- Do not add schemas for Post V1 modules.
- Do not expose `workspace_id` from request bodies as trusted input.
- Preserve route/context-derived workspace authority.
- Preserve existing approved entity names in OpenAPI naming.
- Preserve ErrorModel responses and permission/audit metadata.
- Preserve manual evidence append/supersede/invalidate semantics.
- Preserve `TrackedLink` as structured link support only.
- Preserve `ClientReportSnapshot` as frozen manual/report snapshot support only.

## 14. Explicit OpenAPI NO-GO items

- direct publishing endpoints
- social OAuth endpoints
- scheduling endpoints
- paid ads execution endpoints
- payment/billing endpoints
- analytics ingestion endpoints
- attribution endpoints
- external integration connector endpoints
- autonomous AI execution endpoints
- Post V1 Organic Publishing Module endpoints
- Post V1 Paid Campaign Execution Module endpoints

## 15. OpenAPI risks

- endpoint sprawl
- duplicating existing campaign/brief/approval/evidence APIs
- exposing conceptual fields as approved schemas too early
- trusting `workspace_id` from request bodies
- weakening authorization
- readiness being confused with approval
- evidence being confused with publishing authorization
- UTM being confused with analytics or attribution
- checklist state being confused with direct publishing action
- manual review snapshots being confused with analytics ingestion or attribution

## 16. Required questions before actual OpenAPI patch

1. Which exact Nashir Core V1 user flow cannot be represented by existing paths?
2. Is the need a path gap, schema description gap, enum/status gap, request validation gap, or generated-client naming gap?
3. Can `Campaign`, `BriefVersion`, `MediaAssetVersion`, `ReviewTask`, `ApprovalDecision`, `PublishJob`, `ManualPublishEvidence`, `TrackedLink`, `ClientReportSnapshot`, `OnboardingProgress`, or `AuditLog` represent the flow without new paths?
4. Does the proposed request body avoid trusted `workspace_id`?
5. Does the route carry workspace context for every workspace-scoped operation?
6. Which permission code and audit event apply to each protected operation?
7. Does the proposal preserve ErrorModel responses?
8. Does the proposal require generated client updates, and if so which generated-client boundary is approved?
9. Does the proposal require ERD, SQL, QA, Threat Model, runtime, or test changes?
10. Does the proposal accidentally introduce direct publishing, social OAuth, scheduling, paid execution, payment, analytics ingestion, attribution, external integrations, autonomous AI execution, or Post V1 module scope?

## 17. Recommended OpenAPI patch scope, if later approved

If a later OpenAPI patch is separately approved, the safest initial scope is:

- no new paths;
- no generated-client update unless separately authorized;
- narrow description clarifications for reuse of campaign, brief, approval, publish job, manual evidence, tracked link, client report snapshot, onboarding, audit, membership, and RBAC surfaces;
- explicit reminders that readiness is advisory, evidence does not authorize publishing, and manual publishing remains external;
- preservation of route-derived workspace context, ErrorModel responses, permissions, audit metadata, and idempotency declarations.

## 18. Recommended items to defer

- dedicated readiness dashboard endpoint;
- Smart Wizard session and answer endpoints;
- product/store/service/offer intake endpoints or schemas;
- landing destination first-class endpoint;
- creative rights confirmation endpoint;
- content requirements, hashtags, or video script dedicated schemas;
- approval lock/reapproval dedicated endpoint;
- manual publishing checklist persisted endpoint;
- evidence attachment or evidence audit endpoint;
- manual performance review dedicated endpoint;
- Nashir-specific permission-policy endpoint;
- generated client updates.

## 19. Recommended items to reject for Core V1

- direct publishing APIs;
- social OAuth connect/callback/revocation APIs;
- scheduling APIs;
- paid ads execution APIs;
- payment, invoice, refund, tax, billing provider, or provider usage APIs;
- analytics ingestion APIs;
- attribution APIs;
- external integration connector APIs;
- autonomous AI execution APIs;
- Post V1 Organic Publishing Module APIs;
- Post V1 Paid Campaign Execution Module APIs.

## 20. ERD dependency notes

The merged ERD Option A reuse-only addendum added no new entities or fields. OpenAPI planning must not imply new ERD structure. Any future OpenAPI schema or path that requires new persistence structure must stop and require a separate ERD patch approval first.

## 21. SQL migration dependency notes

No SQL migration is approved by this document. If a future OpenAPI proposal requires new persisted fields, statuses, constraints, indexes, enums, or tables, it must stop until a separately approved SQL migration plan exists.

## 22. QA dependency notes

No QA update is approved by this document. Any future OpenAPI patch that changes paths, schemas, validation, permissions, idempotency, ErrorModel behavior, generated clients, or operation boundaries requires separately approved QA/Test Plan updates and verification gates.

## 23. Threat Model dependency notes

Any future OpenAPI patch must preserve tenant isolation, authorization, evidence integrity, approval lock, manual publishing boundaries, UTM/analytics separation, and no-trusted-body-workspace rules. New path or schema proposals require threat-model review before implementation.

## 24. Recommended sequencing after this planning gate

1. Review this planning gate for source alignment and NO-GO boundaries.
2. If OpenAPI work is still needed, approve a narrow OpenAPI patch request with explicit allowed files, forbidden files, verification commands, expected CI gates, rollback/no-go criteria, and generated-client boundaries.
3. Prefer Option A reuse-only mapping before any schema or path change.
4. If schema clarification is necessary, handle it as a separate narrow contract patch.
5. Run QA and Threat Model planning before runtime, generated-client, or implementation work.

## 25. GO / NO-GO decision for actual OpenAPI patch

NO-GO for actual OpenAPI patch in this document.

GO only for documentation-only OpenAPI patch planning and reuse-first decision review.

Existing OpenAPI remains authoritative until separately patched and approved.

## 26. Safe files to edit later if approved

If a later OpenAPI patch is explicitly approved, safe files must be listed in that future request. Candidate safe files may include only the approved OpenAPI contract or approved documentation files named by that request.

Generated clients, runtime files, tests, SQL, package files, workflows, scripts, migrations, prototype, frontend assets, and implementation files must remain forbidden unless explicitly allowed by a later approved request.

## 27. Files that must remain forbidden

The following remain forbidden for this planning gate and for any later work unless separately and explicitly approved:

- `docs/08_api_spec.md`
- `docs/marketing_os_v5_6_5_phase_0_1_openapi.yaml`
- OpenAPI files
- SQL files
- generated clients
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
