# Nashir Threat Model Update

## 1. Purpose

This document is documentation-only.

This document creates a planning-level Threat Model Update for Nashir Core V1 Option A reuse-only after the merged QA/Test Planning document.

This document does not approve implementation.

This document does not modify ERD, OpenAPI, SQL, QA, runtime, generated clients, tests, packages, workflows, or implementation.

Existing ERD and OpenAPI remain authoritative.

Option A reuse-only remains the current ERD/OpenAPI direction.

Core V1 remains manual/export/review/approval/evidence only.

## 2. Scope

This threat model covers Nashir Core V1 planning risks for manual campaign intake, readiness, human review and approval, approval lock, manual publishing evidence, UTM Lite, manual performance review, AI-assisted suggestions, creative rights, claims governance, tenant isolation, authorization, auditability, and NO-GO boundaries.

## 3. Non-goals

This document does not:

- approve runtime threat controls;
- add ERD entities, fields, SQL migrations, OpenAPI paths, schemas, generated clients, QA tests, packages, workflows, migrations, scripts, prototype assets, frontend assets, router/store behavior, or implementation files;
- change approved entity, endpoint, permission, ErrorModel, idempotency, or guard behavior;
- authorize Pilot or Production readiness;
- authorize direct publishing, social OAuth, scheduling, paid ads, payment, analytics ingestion, attribution, external integrations, autonomous AI execution, or Post-V1 module implementation.

## 4. Sources inspected

- `AGENTS.md`
- `README.md`
- `docs/17_change_log.md`
- `docs/03_decision_log.md`
- `docs/02_v1_scope.md`
- `docs/04_backlog.md`
- `docs/06_erd.md`
- `docs/08_api_spec.md`
- `docs/nashir_qa_test_planning.md`
- `docs/nashir_openapi_patch_proposal.md`
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

`README.md` and `docs/17_change_log.md` identify a verified baseline through Sprint 4 with selected DB-backed repository slices. HTTP/runtime product routes remain limited, and broader runtime, persistence, Pilot, and Production changes remain NO-GO unless separately approved.

`docs/02_v1_scope.md` defines Nashir Core V1 as manual/export/review/approval/evidence only and does not approve implementation by itself.

`docs/04_backlog.md` documents Nashir backlog planning boundaries only and does not create sprint-ready implementation tasks.

`docs/06_erd.md` points to `docs/marketing_os_v5_6_5_phase_0_1_erd.md` as the approved ERD authority. The Nashir Option A reuse-only addendum maps Nashir Core V1 to existing approved entities only and adds no new entities, fields, relationships, constraints, indexes, enums, SQL changes, OpenAPI changes, QA changes, runtime changes, generated clients, tests, packages, workflows, migrations, or implementation.

`docs/08_api_spec.md` points to `docs/marketing_os_v5_6_5_phase_0_1_openapi.yaml` as the approved OpenAPI authority. Frontend and backend must not invent product endpoints outside OpenAPI. Every workspace-scoped endpoint must use route/context-derived workspace authority. `workspace_id` from request bodies must not be trusted. Error responses must follow ErrorModel. Idempotency remains required where declared by OpenAPI.

## 6. Relationship to Nashir governance documents

### Nashir ERD Option A reuse-only addendum

The ERD addendum keeps Nashir Core V1 on existing entities only: `Campaign`, `BriefVersion`, `MediaAsset`, `MediaAssetVersion`, `ReviewTask`, `ApprovalDecision`, `PublishJob`, `ManualPublishEvidence`, `TrackedLink`, `ClientReportSnapshot`, workspace/RBAC entities, and `AuditLog`. Threat controls must protect those reused records rather than assume new Nashir-specific entities.

### Nashir OpenAPI Patch Proposal

The OpenAPI Patch Proposal accepts Option A reuse-only for now. Existing OpenAPI remains authoritative, no actual OpenAPI patch is needed now, and no generated client update is required. Threat controls must preserve existing workspace path/context, guard, ErrorModel, idempotency, manual evidence, tracked link, approval, publish job, and report snapshot boundaries.

### Nashir QA/Test Planning

The QA/Test Planning document defines future planning-level test areas for tenant isolation, workspace trust boundaries, permissions, readiness, approval, evidence, UTM Lite, manual performance review, ErrorModel behavior, idempotency, and NO-GO negative tests. This threat model identifies the security and governance threats those future tests should cover.

### Campaign Readiness Scoring Contract

Readiness is advisory and explainable. Readiness does not equal approval. Readiness does not authorize publishing, spend, payment, analytics ingestion, attribution, external integrations, or autonomous AI execution.

### Approval State Machine Contract

Approval is human, explicit, authorized, version-bound, and auditable. Approval locks reviewed content versions. Material changes after approval require re-review or reapproval. Approval does not authorize direct publishing or paid execution.

### Manual Publishing Evidence Contract

Manual publishing evidence is user-provided proof of external manual publishing. Evidence does not authorize publishing. Manual publishing remains external and user-operated in Core V1. Evidence should be bound to approved content versions and handled through append-only, supersede, and invalidate semantics.

### Role & Permission Matrix

Roles and permissions are workspace-scoped. Protected actions require explicit authority and auditability. Viewers must not mutate. Editors must not approve unless explicitly reviewer-authorized. AI must not approve, reject, accept evidence, invalidate evidence, publish, schedule, spend, or change protected fields.

## 7. Threat modeling principles

1. Treat route-derived workspace context as the tenant authority.
2. Never trust `workspace_id` from request bodies.
3. Preserve AuthGuard, WorkspaceContextGuard, MembershipCheck, PermissionGuard, and ErrorModel behavior.
4. Reuse existing ERD and OpenAPI surfaces before proposing new contracts.
5. Treat readiness as advisory only.
6. Treat approval as human, version-bound, explicit, authorized, and auditable.
7. Treat evidence as user-provided proof only.
8. Preserve manual publishing as external and user-operated in Core V1.
9. Treat UTM Lite as structured link support only, not attribution.
10. Treat manual performance review as user-entered only, not analytics ingestion.
11. Treat AI suggestions as advisory, reviewable, and non-executing.
12. Include negative controls for every NO-GO boundary.

## 8. Trust boundaries

| Boundary | Trust assumption | Threat focus |
|---|---|---|
| user/browser | User-entered content, files, URLs, screenshots, metrics, and AI prompts are untrusted until validated and authorized. | Tampering, false evidence, unsupported claims, protected-field changes. |
| authenticated API user | Authentication identifies a user but does not grant workspace access or protected-action authority. | Membership, role, and permission bypass. |
| workspace route/context | Route/context workspace is authoritative for workspace-scoped operations. | Body `workspace_id` mismatch and cross-tenant access. |
| workspace-scoped records | Campaigns, briefs, assets, approvals, evidence, links, reports, and audit logs must stay scoped to the route/context workspace. | Cross-workspace read/write. |
| campaign/brief/content versions | Reviewable content must preserve version and content hash integrity. | Approval bypass, wrong evidence version, material-change bypass. |
| approval decisions | Approval is a human protected action bound to a reviewed version. | Readiness or AI treated as approval. |
| manual publishing evidence | Evidence is user-provided proof after external manual publishing. | Fake, wrong, edited, reused, or silently mutated evidence. |
| tracked links / UTM Lite | Tracked links are structured links tied to publish jobs. | Attribution confusion, UTM mismatch, analytics creep. |
| manual performance review | Manual metrics are user-entered observations. | Platform analytics or attribution claims inferred from manual data. |
| AI-assisted suggestions | AI may draft or suggest only where later approved. | Unsupported claims, protected-field mutation, autonomous execution. |

## 9. Assets to protect

- workspace data;
- campaign briefs;
- content versions;
- approved content hashes;
- manual publishing evidence;
- screenshots / evidence references;
- tracked links;
- audit logs;
- role/permission data;
- user-entered manual performance data.

## 10. Threat categories

- tenant isolation bypass;
- `workspace_id` trust boundary violation;
- authorization bypass;
- approval bypass;
- evidence tampering;
- false evidence submission;
- wrong content version evidence;
- UTM/tracked link confusion;
- manual performance data manipulation;
- readiness mistaken as approval;
- evidence mistaken as publishing authorization;
- AI suggestion misuse;
- creative rights misuse;
- prohibited claims / regulated claims;
- audit log insufficiency;
- NO-GO scope bypass.

## 11. Threat matrix

| Threat | Scenario | Affected asset | Existing control / contract | Required future control | Severity | Decision |
|---|---|---|---|---|---|---|
| Tenant isolation bypass | User accesses another workspace campaign, approval, evidence, link, report, or audit record. | Workspace data | Route workspace paths, AuthGuard, WorkspaceContextGuard, MembershipCheck, PermissionGuard. | Future tests must prove every reused query and repository path filters by route/context workspace. | Critical | Block before implementation. |
| Body workspace trust violation | Request body includes `workspace_id` for a different workspace. | Workspace-scoped records | API rules and OpenAPI `body_workspace_id_trusted: false`. | Reject or ignore body workspace identifiers; route/context workspace must win. | Critical | Block before implementation. |
| Authorization bypass | Viewer or editor performs approval/evidence/protected action without explicit authority. | Role/permission data, approvals, evidence | Role & Permission Matrix, PermissionGuard. | Protected-action permission checks and negative tests for each role. | High | Block before implementation. |
| Approval bypass | Generated or ready content is approved without human review. | Content versions, approved content hashes | Approval State Machine Contract. | Human-only approval workflow bound to review task, media asset version, and content hash. | Critical | Block before implementation. |
| Approval lock bypass | Approved content is materially changed without reapproval. | Approved content hashes, content versions | Approval State Machine Contract, ERD hash/version primitives. | Material-change detection, reapproval trigger, and audit coverage. | Critical | Block before implementation. |
| Evidence tampering | Accepted evidence is edited, deleted, or overwritten silently. | Manual publishing evidence, audit logs | Manual evidence contract; OpenAPI forbids PATCH/DELETE. | Append-only persistence, supersede/invalidate semantics, audit events. | High | Block before implementation. |
| False evidence submission | User submits fake screenshot, wrong URL, wrong channel, or wrong external post. | Evidence, screenshots, evidence references | Manual Publishing Evidence Contract. | Evidence review authority, required fields, correction/invalidation states, audit trail. | High | Block before implementation. |
| Wrong content version evidence | Evidence references a content version that was not approved or no longer matches approved hash. | Approved content hashes, evidence | ApprovalDecision and ManualPublishEvidence content hash controls. | Evidence must bind to approved content version and matching hash. | High | Block before implementation. |
| UTM/tracked link confusion | UTM link is treated as attribution or platform analytics. | Tracked links, manual performance data | Scope, OpenAPI Proposal, QA/Test Planning. | UI/API wording and negative tests must preserve UTM Lite as structured links only. | Medium | Keep NO-GO boundary. |
| Manual performance manipulation | User-entered metrics are treated as platform analytics, attribution, or paid performance proof. | Manual performance data, report snapshots | Scope, Evidence Contract, ClientReportSnapshot reuse. | Label as user-entered; avoid ingestion/import/attribution claims. | Medium | Future QA coverage required. |
| Readiness mistaken as approval | High readiness, pass, or soft_pass unlocks approval or publishing support. | Approval decisions, content versions | Readiness Scoring Contract. | State and permission controls must keep readiness advisory only. | High | Block before implementation. |
| Evidence mistaken as authorization | Evidence submission or acceptance is treated as permission to publish. | Evidence, publish job state | Evidence Contract. | Evidence workflow must remain after external manual publishing and must not trigger publishing. | High | Keep NO-GO boundary. |
| AI suggestion misuse | AI creates unsupported claims, updates protected fields, or performs approval/evidence actions. | Briefs, approvals, evidence, protected fields | Role Matrix, Approval Contract, Scoring Contract. | AI boundary tests; human confirmation and protected-field locks. | High | Block autonomous actions. |
| Creative rights misuse | Missing rights confirmation or third-party asset misuse proceeds to approval/evidence. | Content versions, rights notes, evidence | Scoring and Evidence contracts. | Rights confirmation gate, review reason, audit coverage. | High | Block before implementation. |
| Prohibited or regulated claims | Unsupported medical, financial, legal, discount, urgency, or absolute claims pass review. | Campaign briefs, content versions | Scoring Contract blocking conditions. | Human review, blocked_until_review flow, claim-risk tests. | High | Block until review. |
| Audit insufficiency | Protected state changes lack actor, timestamp, reason, or before/after trace. | Audit logs, approvals, evidence | AuditLog reuse, role/evidence/approval contracts. | Audit coverage matrix before implementation. | Medium | Future contract/test gate required. |
| NO-GO scope bypass | Direct publishing, social OAuth, scheduling, paid ads, payment, analytics ingestion, attribution, external integrations, autonomous AI execution, or Post-V1 module implementation is introduced. | Product scope, contracts, runtime | Scope, ERD/OpenAPI Option A, QA/Test Planning. | Negative tests and review gates for each NO-GO item. | Critical | NO-GO. |

## 12. Tenant isolation threats

- cross-workspace campaign access: campaigns and brief versions must be read/written only within route/context workspace;
- cross-workspace evidence access: `ManualPublishEvidence` must be listed, submitted, superseded, or invalidated only for publish jobs in the route/context workspace;
- cross-workspace approval access: review tasks and approval decisions must be bound to workspace-scoped asset versions and review tasks;
- body `workspace_id` mismatch: request-body workspace identifiers must not override route/context workspace;
- route/context workspace must win: every workspace-scoped query must include route-derived workspace context.

## 13. Authorization threats

- viewer attempts to approve: must fail because view permission does not imply mutation or approval authority;
- editor attempts to accept/invalidate evidence without authority: must fail unless explicit future evidence authority is approved;
- AI attempts approval/evidence action: must fail; AI is not a protected-action actor;
- unauthorized member changes protected fields: must fail and return approved ErrorModel behavior.

## 14. Approval threats

- generated content approved without human review;
- `blocked_until_review` content approved directly;
- rejected content approved without new review cycle;
- material change after approval not requiring reapproval.

Required control: approval remains human, version-bound, explicit, authorized, auditable, and locked to reviewed content hash.

## 15. Evidence threats

- fake screenshot;
- wrong URL;
- wrong channel;
- wrong content version;
- accepted evidence edited silently;
- invalidated evidence reused;
- superseded evidence losing audit trace.

Required control: evidence remains user-provided proof only, tied to approved content version and content hash, with append-only / supersede / invalidate semantics and audit coverage.

## 16. UTM / tracked link threats

- UTM mistaken for attribution;
- UTM mismatch between approved content and evidence;
- tracked link treated as analytics ingestion.

Required control: UTM Lite is structured link support only. It must not ingest platform analytics, infer attribution, or create advanced attribution decisions.

## 17. Manual performance threats

- user-entered metrics treated as platform analytics;
- manual metrics used as attribution;
- false performance claims.

Required control: manual performance review remains user-entered and is not analytics ingestion. Report snapshots must not imply platform-verified results, attribution, or paid performance proof.

## 18. AI threats

- AI-generated content treated as approved;
- AI creates unsupported claims;
- AI suggests publishing or spend;
- AI updates protected fields;
- AI infers evidence or performance without user proof.

AI must not approve, publish, schedule, spend, accept evidence, invalidate evidence, or change protected fields.

## 19. Creative rights / claims threats

- missing rights confirmation;
- third-party asset misuse;
- unsupported medical/financial/legal claims;
- misleading urgency or discount terms;
- unsupported absolute claims.

Required control: rights and claims concerns must trigger human review, `blocked_until_review`, correction, rejection, or reapproval paths where future implementation is separately approved.

## 20. NO-GO bypass threats

The following remain NO-GO:

- direct publishing;
- social OAuth;
- scheduling;
- paid ads;
- payment;
- analytics ingestion;
- attribution;
- external integrations;
- autonomous AI execution;
- Post-V1 module implementation.

## 21. Required mitigations

- route-derived workspace context;
- membership and permission checks;
- ErrorModel consistency;
- human approval;
- approval lock;
- content version binding;
- append-only / supersede / invalidate evidence semantics;
- audit log coverage;
- NO-GO negative tests.

## 22. Residual risks

- Existing Option A contracts rely on reused entities and may require future clarification if implementation needs more explicit readiness, rights, evidence, or audit fields.
- Manual evidence can reduce but not eliminate false-proof risk because Core V1 does not connect to external platforms.
- Manual performance review can be misunderstood unless UI/API wording clearly labels data as user-entered.
- UTM Lite can be confused with attribution unless contract and QA language stays explicit.
- AI-assisted suggestions can introduce unsupported claims unless human review, protected-field controls, and claim-risk handling are defined before implementation.

## 23. Future ERD impact candidates

Future ERD candidates, if separately approved, may include persisted readiness snapshots, rights confirmation fields, evidence attachment metadata, approval transition history, or manual performance fields only after Option A reuse is proven insufficient.

No ERD change is approved by this document.

## 24. Future OpenAPI impact candidates

Future OpenAPI candidates, if separately approved, may include narrow schema descriptions, readiness response clarification, evidence status clarification, UTM wording, manual performance wording, or protected-action permission documentation only after existing OpenAPI reuse is proven insufficient.

No OpenAPI change is approved by this document.

## 25. Future QA/test impact candidates

Future QA/test planning should cover tenant isolation, body `workspace_id` mismatch, role denial, human approval transitions, approval lock, evidence hash/version binding, evidence supersede/invalidate behavior, UTM no-attribution behavior, manual performance user-entered labeling, AI NO-GO actions, ErrorModel behavior, idempotency where declared, and NO-GO negative tests.

No QA or test implementation is approved by this document.

## 26. Future implementation gates

Any future implementation must be separately approved with:

- explicit scope;
- approved sources;
- allowed files;
- forbidden files;
- exact endpoints/entities/repository methods;
- verification commands;
- expected CI gates;
- rollback/no-go criteria;
- tenant isolation and ErrorModel expectations;
- NO-GO boundaries.

## 27. Required future contracts before implementation

Before implementation, separate approved contracts or patches may be required for:

- final readiness representation and explanation behavior;
- approval lock and material-change detection details;
- evidence field/status/review authority details;
- creative rights confirmation;
- prohibited and regulated claims handling;
- manual performance review wording and data provenance;
- audit event coverage;
- permission codes and protected-action mapping;
- QA/test cases and negative NO-GO coverage.

## 28. Recommended sequencing

1. Review and approve this documentation-only Threat Model Update.
2. Decide whether Option A reuse-only still needs any narrow ERD/OpenAPI clarification; default remains no change.
3. Create a QA/Test Case Contract only if separately approved.
4. Create implementation contracts only after ERD/OpenAPI/QA/threat boundaries are approved.
5. Implement only under a separate scoped implementation request.

## 29. GO / NO-GO decision

GO: Documentation-only Threat Model Update for Nashir Core V1 Option A reuse-only.

NO-GO: Implementation, ERD changes, OpenAPI changes, SQL changes, QA/test implementation, generated client updates, runtime changes, package changes, workflow changes, migrations, scripts, prototype/frontend changes, direct publishing, social OAuth, scheduling, paid ads, payment, analytics ingestion, attribution, external integrations, autonomous AI execution, and Post-V1 module implementation.

Readiness does not equal approval.

Evidence does not authorize publishing.

Manual publishing remains external and user-operated in Core V1.

Manual performance review remains user-entered and is not analytics ingestion.

UTM Lite is not attribution.

Any future implementation or contract patch must be separately approved with explicit allowed files, forbidden files, verification commands, expected CI gates, rollback/no-go criteria, and NO-GO boundaries.

## 30. Safe files to edit later if approved

If separately approved, later documentation-only work may edit purpose-specific Nashir planning, QA, threat model, decision log, and change log files named in the future request.

If separately approved as a contract patch, later work may edit the exact ERD, OpenAPI, QA, SQL, or governance files named in that future request only.

## 31. Files that must remain forbidden

Unless a later request explicitly approves them with exact scope, the following remain forbidden:

- `docs/08_api_spec.md`
- `docs/marketing_os_v5_6_5_phase_0_1_openapi.yaml`
- `docs/06_erd.md`
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
- any ERD/OpenAPI/SQL/runtime contract file unless explicitly listed in a future approved request.
