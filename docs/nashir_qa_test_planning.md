# Nashir QA/Test Planning

## 1. Purpose

This document is documentation-only.

This document creates planning-level QA/test coverage for Nashir Core V1 Option A reuse-only after the OpenAPI Proposal Decision Review concluded that no actual OpenAPI patch and no generated client update is needed now.

This document does not approve implementation.

This document does not add or modify test files.

This document does not modify OpenAPI, generated clients, ERD, SQL, runtime, packages, workflows, or implementation.

This document only defines planning-level QA/test coverage.

Option A reuse-only means no actual OpenAPI patch and no generated client update is needed now.

Existing OpenAPI remains authoritative.

Existing ERD remains authoritative.

Core V1 remains manual/export/review/approval/evidence only.

Readiness does not equal approval.

Evidence does not authorize publishing.

Manual publishing remains external and user-operated in Core V1.

Direct publishing, social OAuth, scheduling, paid ads, payment, analytics ingestion, attribution, external integrations, autonomous AI execution, and Post-V1 module implementation remain NO-GO.

Any future QA/test implementation must be separately approved with explicit allowed files, forbidden files, verification commands, expected CI gates, rollback/no-go criteria, and NO-GO boundaries.

## 2. Scope

This plan covers future QA and test planning for Nashir Core V1 reuse of existing ERD and OpenAPI surfaces, including:

- documentation and contract consistency;
- role and permission boundaries;
- readiness, approval, approval lock, and reapproval semantics;
- manual publishing evidence;
- UTM Lite without analytics ingestion or attribution;
- manual performance review using user-entered data only;
- tenant isolation, workspace authority, ErrorModel behavior, and idempotency;
- required negative test areas and NO-GO boundaries.

## 3. Non-goals

This document does not:

- create automated tests;
- create manual QA scripts as executable gates;
- modify QA suites, test files, runtime code, routers, stores, SQL, ERD, OpenAPI, generated clients, packages, workflows, scripts, migrations, prototype, or frontend assets;
- authorize any Nashir implementation;
- authorize Pilot or Production readiness;
- add endpoints, schemas, entities, fields, migrations, permission codes, generated clients, or repositories;
- approve direct publishing, social OAuth, scheduling, paid ads, payment, analytics ingestion, attribution, external integrations, autonomous AI execution, or Post-V1 modules.

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
- `docs/nashir_openapi_patch_proposal.md`
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

`README.md` and `docs/17_change_log.md` describe a verified baseline through Sprint 4 with selected DB-backed repository slices. HTTP/runtime product routes remain limited, and broader runtime, persistence, Pilot, and Production changes remain NO-GO unless separately approved.

`docs/02_v1_scope.md` defines Nashir Core V1 as manual/export/review/approval/evidence only and does not approve implementation by itself.

`docs/04_backlog.md` documents Nashir backlog planning boundaries only and does not create sprint-ready implementation tasks.

`docs/06_erd.md` points to `docs/marketing_os_v5_6_5_phase_0_1_erd.md` as the approved ERD authority. The Nashir Option A reuse-only addendum adds no new entities, fields, relationships, constraints, indexes, enums, SQL changes, OpenAPI changes, QA changes, runtime changes, generated clients, tests, packages, workflows, migrations, or implementation.

`docs/08_api_spec.md` points to `docs/marketing_os_v5_6_5_phase_0_1_openapi.yaml` as the approved OpenAPI authority. Frontend and backend must not invent product endpoints outside OpenAPI. Every workspace-scoped endpoint must use route/context-derived workspace authority. `workspace_id` from request bodies must not be trusted. Error responses must follow ErrorModel. Idempotency remains required where declared by OpenAPI.

## 6. Relationship to Nashir governance documents

### Nashir OpenAPI Patch Proposal

`docs/nashir_openapi_patch_proposal.md` recommends Option A reuse-only / no new paths or schemas as the safest current OpenAPI path. This QA plan tests that future work preserves reuse of existing paths and schemas before any new OpenAPI work is proposed.

### OpenAPI Proposal Decision Review

The OpenAPI Proposal Decision Review concluded that Option A reuse-only is accepted, no actual OpenAPI patch is needed now, no generated client update is required, and existing paths and schemas are sufficient for Nashir Core V1 planning reuse. This document is the next documentation-only QA/Test Planning step.

### Nashir ERD Option A reuse-only addendum

The ERD addendum in `docs/marketing_os_v5_6_5_phase_0_1_erd.md` maps Nashir Core V1 to existing entities only. Future QA must test that implementation, if later approved, does not depend on unapproved entities, fields, relationships, or SQL changes.

### Campaign Readiness Scoring Contract

Readiness is advisory and explainable. QA must test that readiness never approves content, authorizes publishing, authorizes spend, ingests analytics, creates attribution, or bypasses human review.

### Approval State Machine Contract

Approval is human, version-bound, auditable, and separate from readiness. QA must test allowed and disallowed transitions, material-change reapproval, and approval lock behavior.

### Manual Publishing Evidence Contract

Evidence is user-provided proof of external manual publishing. QA must test that evidence requires approved content version context, remains auditable, can be superseded or invalidated, and never authorizes publishing.

### Role & Permission Matrix

Roles and permissions are workspace-scoped planning semantics. QA must test viewer denial, editor limitations, explicit approval/evidence authority, AI boundaries, protected-action auditability, and tenant isolation.

## 7. QA planning principles

1. Treat current ERD and OpenAPI as authoritative.
2. Test Option A reuse-only before proposing any new contract surface.
3. Test that planning concepts do not imply implemented runtime behavior.
4. Test readiness as advisory only.
5. Test approval as human, explicit, authorized, version-bound, and auditable.
6. Test evidence as user-provided proof only, not publishing authorization.
7. Test UTM Lite as structured link support only.
8. Test manual performance review as user-entered only.
9. Test route-derived workspace context and reject trusted request-body `workspace_id`.
10. Test ErrorModel and declared idempotency behavior.
11. Include negative tests for every NO-GO boundary.
12. Require separate approval before any automated or manual QA implementation.

## 8. Test categories

### Documentation/contract consistency tests

Future reviews should verify that Nashir QA, scope, backlog, ERD, OpenAPI, scoring, approval, evidence, and role documents all preserve Option A reuse-only and do not imply runtime implementation.

### Permission and role tests

Future tests should cover viewer denial, editor draft/edit limits, explicit approval authority, explicit evidence acceptance/invalidation authority, AI boundaries, protected-action audit requirements, and workspace-scoped permission checks.

### Readiness vs approval tests

Future tests should confirm that readiness levels and gate states can warn, fail, or block but cannot approve content, unlock publishing, authorize spend, or bypass review.

### Approval lock / reapproval tests

Future tests should confirm disallowed direct approval transitions, generated-to-review-to-approval flow, material-change reapproval, and blocked/rejected paths returning through review.

### Manual publishing evidence tests

Future tests should cover approved content version requirements, evidence submission, acceptance, correction, supersede, invalidation, wrong version rejection/invalidation, URL and screenshot requirements, and auditability.

### UTM Lite no-attribution tests

Future tests should confirm that UTM links are structured links only, do not ingest analytics, do not imply attribution, and can trigger correction or invalidation planning when mismatched.

### Manual performance review tests

Future tests should confirm that metrics are user-entered, report snapshots are frozen/manual review surfaces only, and no analytics ingestion, attribution, optimization automation, or paid execution is implied.

### Tenant isolation tests

Future tests should confirm that workspace-scoped records cannot be read or written across workspaces and that audit records remain workspace-scoped.

### Workspace context trust boundary tests

Future tests should confirm route-derived workspace authority, body `workspace_id` distrust, and failure when body workspace identifiers conflict with route/context.

### ErrorModel behavior tests

Future tests should confirm that authorization failures, invalid transitions, cross-workspace access, invalid evidence, invalid idempotency, and NO-GO attempts return approved ErrorModel behavior.

### NO-GO negative tests

Future tests should explicitly cover attempts to introduce or invoke direct publishing, social OAuth, scheduling, paid ads, payment, analytics ingestion, attribution, autonomous AI execution, external integrations, Post-V1 modules, and generated client updates under Option A.

## 9. Test matrix

| Area | Scenario | Expected behavior | Existing API/contract reuse | Risk covered | Future test type | Implementation status |
|---|---|---|---|---|---|---|
| Documentation consistency | New Nashir QA wording references OpenAPI patching. | Must state no actual OpenAPI patch and no generated client update needed now. | OpenAPI Patch Proposal, API Spec. | OpenAPI scope creep. | Documentation review. | Planning only; not implemented. |
| ERD consistency | Future plan adds readiness entity or evidence attachment. | Must stop unless separately approved. | ERD Option A addendum. | Entity/field creep. | Contract review. | Planning only; not implemented. |
| OpenAPI consistency | Future plan adds a readiness endpoint. | Must prove existing APIs insufficient and obtain separate approval. | Existing Campaign, BriefVersion, ApprovalDecision, ManualPublishEvidence, AuditLog paths. | Endpoint sprawl. | Contract review. | Planning only; not implemented. |
| Generated clients | Future change claims client regeneration is required under Option A. | Must be rejected for current Option A scope. | OpenAPI Proposal Decision Review. | Generated-client churn. | Negative documentation review. | Planning only; not implemented. |
| Permissions | Viewer attempts create/edit/approve/submit evidence/accept evidence. | Must fail. | Role & Permission Matrix, PermissionGuard. | Privilege escalation. | Automated authorization test candidate. | Planning only; not implemented. |
| Permissions | Editor drafts or edits but attempts approval without authority. | Draft/edit may be allowed if future policy approves; approval must fail. | Role & Permission Matrix. | Editor self-approval. | Automated authorization test candidate. | Planning only; not implemented. |
| Permissions | Approval actor lacks explicit authority. | Approval must fail with ErrorModel behavior. | Approval Contract, Role Matrix. | Unauthorized approval. | Automated authorization test candidate. | Planning only; not implemented. |
| Permissions | Evidence acceptor/invalidator lacks explicit authority. | Accept/invalidate must fail with ErrorModel behavior. | Evidence Contract, Role Matrix. | Evidence tampering. | Automated authorization test candidate. | Planning only; not implemented. |
| AI boundary | AI attempts approve/reject/accept evidence/publish/schedule/spend. | Must remain blocked. | Role Matrix, Approval Contract, Evidence Contract. | Autonomous AI execution. | Negative test candidate. | Planning only; not implemented. |
| Readiness | High readiness is treated as approval. | Must fail; readiness does not equal approval. | Scoring Contract, Approval Contract. | Approval bypass. | Automated state test candidate. | Planning only; not implemented. |
| Readiness | Low readiness draft with warning. | Low readiness may allow draft only where future policy permits and no blocking risk exists. | Scoring Contract. | Overblocking or unsafe generation. | Manual and automated candidate. | Planning only; not implemented. |
| Readiness | Blocking risk appears. | Gate must become `blocked_until_review`. | Scoring Contract, Approval Contract. | Risk bypass. | Automated state test candidate. | Planning only; not implemented. |
| Readiness | Readiness authorizes publishing. | Must fail; readiness must not authorize publishing. | Scoring Contract. | Publishing authorization creep. | Negative test candidate. | Planning only; not implemented. |
| Approval | `draft` moves directly to `approved`. | Must fail. | Approval State Machine Contract. | Review bypass. | Automated transition test candidate. | Planning only; not implemented. |
| Approval | `generated` moves to `approved` without review. | Must fail. | Approval State Machine Contract. | Human review bypass. | Automated transition test candidate. | Planning only; not implemented. |
| Approval | Approved content is materially changed. | Must require reapproval. | Approval State Machine Contract. | Approval lock bypass. | Automated transition test candidate. | Planning only; not implemented. |
| Approval | `blocked_until_review` moves directly to `approved`. | Must fail. | Approval State Machine Contract. | Block bypass. | Automated transition test candidate. | Planning only; not implemented. |
| Approval | `rejected` moves directly to `approved`. | Must fail; revision and new review cycle required. | Approval State Machine Contract. | Rejection bypass. | Automated transition test candidate. | Planning only; not implemented. |
| Evidence | Evidence references unapproved content version. | Reject or invalidate according to future flow. | Manual Publishing Evidence Contract. | False evidence. | Automated evidence test candidate. | Planning only; not implemented. |
| Evidence | Evidence is treated as publishing authorization. | Must fail; evidence does not authorize publishing. | Manual Publishing Evidence Contract. | Publishing execution creep. | Negative test candidate. | Planning only; not implemented. |
| Evidence | Accepted evidence is corrected. | Supersede, preserving prior evidence as auditable. | ManualPublishEvidence, Evidence Contract. | Evidence mutation/tampering. | Automated evidence test candidate. | Planning only; not implemented. |
| Evidence | Evidence is wrong URL/channel/content version. | Needs correction or invalidation. | Evidence Contract. | Wrong proof accepted. | Automated/manual evidence test candidate. | Planning only; not implemented. |
| Evidence | URL unavailable. | Screenshot/attachment reference required by evidence contract planning. | ManualPublishEvidence. | Incomplete proof. | Manual QA candidate. | Planning only; not implemented. |
| UTM Lite | Tracked link is treated as attribution. | Must fail; structured link only. | TrackedLink, Scoring Contract, Evidence Contract. | Attribution creep. | Negative test candidate. | Planning only; not implemented. |
| UTM Lite | UTM mismatch against evidence. | Correction or invalidation planning should trigger. | TrackedLink, Evidence Contract. | Wrong destination/reporting. | Automated/manual candidate. | Planning only; not implemented. |
| Manual review | User enters manual metrics. | Allowed only as user-entered manual review if future implementation approved. | ClientReportSnapshot. | Analytics ingestion confusion. | Manual QA candidate. | Planning only; not implemented. |
| Manual review | Metrics are imported from platform analytics. | Must remain blocked. | ClientReportSnapshot, Scope. | Analytics ingestion. | Negative test candidate. | Planning only; not implemented. |
| Tenant isolation | User accesses another workspace campaign/evidence/audit. | Must fail. | AuthGuard, WorkspaceContextGuard, MembershipCheck, PermissionGuard. | Cross-tenant access. | Automated integration test candidate. | Planning only; not implemented. |
| Workspace authority | Body `workspace_id` conflicts with route workspace. | Route/context wins; body workspace is not trusted; likely fail. | API Spec, OpenAPI contract. | Tenant boundary bypass. | Automated integration test candidate. | Planning only; not implemented. |
| ErrorModel | Invalid transition or forbidden action occurs. | Must return approved ErrorModel response. | API Spec, ErrorModel. | Inconsistent failure behavior. | Automated API test candidate. | Planning only; not implemented. |
| Idempotency | Idempotent publish-job creation is retried. | Must preserve declared idempotency behavior if future work touches it. | OpenAPI `IdempotencyKey`. | Duplicate side effects. | Automated API test candidate. | Planning only; not implemented. |
| NO-GO | Direct publishing endpoint/action attempted. | Must remain blocked. | Scope, API Spec, OpenAPI no-go. | Direct publishing. | Negative test candidate. | Planning only; not implemented. |
| NO-GO | Social OAuth, scheduling, paid ads, payment, analytics ingestion, attribution, autonomous AI execution, or external integration attempted. | Must remain blocked. | Scope, Role Matrix, OpenAPI Proposal. | Scope expansion. | Negative test candidate. | Planning only; not implemented. |

## 10. Required negative test areas

Future QA/test implementation, if separately approved, must include negative coverage for:

- direct publishing attempt must remain blocked;
- social OAuth attempt must remain blocked;
- scheduling attempt must remain blocked;
- paid ads/payment attempt must remain blocked;
- analytics ingestion attempt must remain blocked;
- attribution attempt must remain blocked;
- autonomous AI execution attempt must remain blocked;
- generated client update not required under Option A.

## 11. Readiness test planning

- Readiness does not equal approval.
- Low readiness may still allow draft with warning where future policy permits and no blocking risk exists.
- Blocking risk triggers `blocked_until_review`.
- Readiness must not authorize publishing.
- `pass` and `soft_pass` must not approve content.
- `fail` must reflect missing required operational inputs.
- `blocked_until_review` must reflect risk, rights, policy, governance, prohibited claims, unsupported regulated claims, or attempted NO-GO actions.

## 12. Approval test planning

- `draft` cannot become `approved` directly.
- `generated` requires review before approval.
- Approved content material changes require reapproval.
- `blocked_until_review` cannot become `approved` directly.
- Rejected content requires revision and a new review cycle.
- Approval must remain human, explicit, authorized, auditable, and bound to a content version.
- Approval must not authorize direct publishing, scheduling, paid execution, payment, analytics ingestion, attribution, external integrations, or autonomous AI execution.

## 13. Manual Publishing Evidence test planning

- Evidence requires approved content version.
- Evidence does not authorize publishing.
- Invalid evidence can be invalidated.
- Superseded evidence remains auditable.
- Wrong content version evidence is rejected/invalidated.
- Screenshot/URL requirements follow the evidence contract.
- Published URL is required when the platform provides a URL.
- Screenshot is required when URL is unavailable or insufficient.
- UTM link used is required when a UTM link was generated for the referenced content version.
- Evidence acceptance must not override approval locks, reapproval requirements, or blocked review states.

## 14. Role & Permission test planning

- Viewer cannot create, edit, approve, submit evidence, accept evidence, invalidate evidence, publish, schedule, or spend.
- Editor can draft/edit but cannot approve unless granted authority.
- Approval actor must be authorized.
- Evidence acceptance/invalidation actor must be authorized.
- AI cannot approve, reject, accept evidence, publish, schedule, or spend.
- AI cannot change protected fields or replace permission checks.
- Protected approval, evidence, policy, and audit-sensitive actions must be auditable where future implementation is approved.

## 15. UTM Lite test planning

- UTM links are structured links only.
- UTM does not ingest analytics.
- UTM does not imply attribution.
- UTM mismatch triggers correction/invalidation planning.
- UTM links must not prove visits, conversions, attribution, campaign performance, or platform state.

## 16. Manual Performance Review test planning

- Manual metrics are user-entered.
- Manual metrics are not analytics ingestion.
- Client report snapshots are frozen/manual review surfaces only.
- Manual review must not create attribution decisions.
- Manual review must not authorize paid execution, budget spend, payment, or campaign optimization automation.

## 17. Tenant isolation and workspace authority

- Route-derived workspace context remains mandatory.
- Request body `workspace_id` must not be trusted.
- Cross-workspace access must fail.
- Audit records are workspace-scoped.
- Workspace-scoped queries must include route-derived workspace context.
- Future tests should cover mismatched route/body workspace identifiers and record ownership mismatches.

## 18. ErrorModel and idempotency expectations

Future QA/test implementation must preserve:

- ErrorModel behavior for unauthorized actions, forbidden transitions, invalid evidence, cross-workspace access, malformed requests, and NO-GO attempts;
- declared idempotency behavior where OpenAPI requires `IdempotencyKey`;
- append-only evidence semantics where current OpenAPI forbids ManualPublishEvidence PATCH or DELETE;
- route-derived workspace context on all workspace-scoped operations.

## 19. Future QA impact candidates

Future QA impact candidates include:

- contract consistency review for Option A reuse-only;
- permission and role coverage;
- approval/reapproval state transition coverage;
- evidence transition, supersede, invalidation, and audit coverage;
- UTM Lite no-attribution coverage;
- manual performance review no-ingestion coverage;
- tenant isolation and workspace trust-boundary coverage;
- ErrorModel and idempotency coverage;
- NO-GO negative coverage.

No QA changes are approved by this document.

## 20. Future automated test candidates

Future automated tests may be proposed for:

- unauthorized viewer/editor protected-action denials;
- approval transition rules;
- readiness gate behavior;
- approved-content material-change reapproval;
- evidence required fields and wrong-version handling;
- supersede/invalidate behavior;
- UTM mismatch handling;
- cross-workspace access denial;
- body `workspace_id` distrust;
- ErrorModel response consistency;
- declared idempotency behavior.

These are candidates only. They do not approve test files or implementation.

## 21. Future manual test candidates

Future manual QA may be proposed for:

- evidence screenshot and URL review;
- manual publishing checklist preparation without publishing execution;
- UTM link review and mismatch correction;
- manual performance review entry and frozen snapshot review;
- reviewer/evidence reviewer workflow review;
- documentation consistency checks before any implementation request.

These are candidates only. They do not approve manual test files, QA suites, or implementation.

## 22. Threat Model handoff notes

Future Threat Model review should evaluate:

- tenant isolation and cross-workspace evidence or approval attachment;
- body `workspace_id` trust boundary failures;
- unauthorized approval or evidence acceptance;
- editor self-approval where future policy forbids it;
- fake, wrong, or mismatched evidence;
- evidence tampering and audit trail manipulation;
- readiness being misused as approval;
- UTM being misused as attribution;
- manual metrics being misused as analytics ingestion;
- AI suggestion misuse as authorization;
- external integration, publishing, scheduling, paid execution, payment, analytics ingestion, and attribution expansion.

No Threat Model update is approved by this document.

## 23. Required future contracts before implementation

Before any implementation, the following must be separately approved where applicable:

- QA/Test Case Plan or executable QA scope;
- Threat Model Update;
- implementation request with explicit allowed files, forbidden files, verification commands, expected CI gates, rollback/no-go criteria, and NO-GO boundaries;
- ERD, SQL, OpenAPI, or generated-client patch only if a concrete approved gap requires it;
- permission policy details;
- evidence attachment policy if screenshots/files require structured handling;
- AI governance if AI assistance is later proposed.

## 24. Recommended sequencing

1. Review and approve this documentation-only QA/Test Planning document.
2. Keep Option A reuse-only as the current ERD/OpenAPI decision.
3. Prepare Threat Model handoff notes only if separately approved.
4. Prepare a future QA/Test Case Plan only if separately approved.
5. Consider implementation only after all required contracts and QA gates are separately approved.

## 25. GO / NO-GO decision

GO: Use this document as planning-level QA/test coverage for Nashir Core V1 Option A reuse-only.

GO: Continue treating existing ERD and OpenAPI as authoritative.

GO: Continue treating no actual OpenAPI patch and no generated client update as the accepted current Option A decision.

NO-GO: Implementation from this document.

NO-GO: Adding or modifying test files from this document.

NO-GO: ERD, OpenAPI, SQL, runtime, generated client, package, workflow, migration, prototype, frontend, router/store, or implementation changes from this document.

NO-GO: Direct publishing, social OAuth, scheduling, paid ads, payment, analytics ingestion, attribution, external integrations, autonomous AI execution, and Post-V1 module implementation.

## 26. Safe files to edit later if approved

Future documentation-only or contract work may explicitly approve edits to:

- `docs/nashir_qa_test_planning.md`
- `docs/03_decision_log.md`
- `docs/17_change_log.md`
- a future QA/Test Case Plan document;
- a future Threat Model Update document;
- future governance documents named by an approved request.

These files are safe only when a later request explicitly lists them as allowed.

## 27. Files that must remain forbidden

Unless a future request explicitly approves them with separate scope and verification gates, the following remain forbidden:

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
- migrations
- `prototype/`
- frontend assets
- runtime router/store files
- any implementation file
- any ERD/OpenAPI/SQL/runtime contract file unless explicitly listed by a later approved request.
