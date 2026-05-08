# Nashir Permission Codes and QA Case Specification

| Field | Value |
|---|---|
| Document type | Documentation-only planning/specification |
| Status | Draft - Pending Review |
| Scope | Nashir Core V1 permission codes and QA case planning identifiers |
| Change type | Documentation-only |
| Implementation status | Not approved |
| Relationship | Follows `docs/nashir_role_permission_matrix.md`, `docs/nashir_qa_test_planning.md`, `docs/nashir_acceptance_criteria.md`, `docs/nashir_user_stories.md`, `docs/nashir_implementation_readiness_gap_review.md`, and `docs/nashir_ui_route_permission_audit_errormodel_mapping.md` |

## 1. Purpose

This document is documentation-only.

It defines planning/specification-only Nashir permission code identifiers and QA case identifiers for future review.

It does not approve implementation.

It does not create executable tests.

It does not add or modify runtime, backend, UI, API, SQL, OpenAPI, generated-client, package, workflow, migration, script, prototype, routing, serving, linking, integration, analytics, attribution, payment, billing, AI runtime, autonomous agent, or production behavior.

Permission codes in this document are proposed planning identifiers only. They are not implemented RBAC permissions and do not imply that RBAC enforcement exists for Nashir.

QA case IDs in this document are planning identifiers only. They are not executable tests and do not approve test files.

## 2. Governance Summary

Nashir Core V1 remains manual/export/review/approval/evidence only.

Readiness is advisory and is not approval.

Approval is separate from readiness.

Evidence records proof only and is not publishing authorization.

Manual publishing remains external and user-operated.

UTM Lite supports tracked links only and is not attribution.

Manual performance review is user-entered only and is not analytics ingestion.

AI assistant behavior is advisory-only.

Direct publishing, publishing authorization bypass, social OAuth, scheduling, paid ads, payment, billing, analytics ingestion, attribution, external integrations, autonomous AI execution, Post-V1 module implementation, production readiness, generated client drift, OpenAPI drift, and SQL drift remain NO-GO.

## 3. Proposed Permission Codes

These codes are planning identifiers only. They do not create permissions, seed permissions, modify roles, or approve RBAC enforcement.

The `nashir.*.*` identifiers are planning identifiers only. They are not final seeded RBAC permission codes and do not modify current RBAC. A future implementation gate must reconcile them with the repository's existing `domain.action` permission convention before any RBAC enforcement. Examples of existing-style permissions include `campaign.read`, `performance.read`, and `rbac.read`; these examples do not approve implementation.

| Proposed code | Planning meaning | Boundary |
|---|---|---|
| `nashir.readiness.view` | View campaign readiness, blockers, warnings, approval status, checklist status, evidence status, and associated intake/content material. | Readiness does not approve or authorize publishing. |
| `nashir.intake.draft` | Draft manual intake and advertised-object inputs. | Manual/user-confirmed only; no external ingestion. |
| `nashir.intake.submit_review` | Submit intake-derived material for human review. | Submission does not approve. |
| `nashir.content.edit` | Edit draft content, requirements, hashtags, scripts, destinations, or related planning fields. | Material changes after approval require reapproval. |
| `nashir.content.submit_review` | Submit content for human review. | Does not approve or publish. |
| `nashir.approval.review` | View and participate in human review where authorized. | Review authority is not approval authority by itself. |
| `nashir.approval.approve` | Human approval of reviewed content version. | Must be explicit, authorized, auditable, and version-bound. |
| `nashir.approval.reject` | Human rejection of reviewed content version. | Must be explicit, authorized, auditable, and version-bound. |
| `nashir.approval.request_changes` | Human request for changes during review. | Does not approve. |
| `nashir.approval.reapproval_trigger` | Trigger or record reapproval requirement after material change. | Does not approve the changed content. |
| `nashir.checklist.view` | View manual publishing checklist status. | Checklist does not publish, schedule, spend, or connect accounts. |
| `nashir.checklist.prepare` | Prepare manual publishing checklist steps where future implementation is approved. | External user-operated publishing remains outside the system. |
| `nashir.evidence.submit` | Submit user-provided manual publishing evidence. | Submission does not accept evidence or authorize publishing. |
| `nashir.evidence.review` | Review submitted manual publishing evidence. | Review alone does not accept, supersede, or invalidate. |
| `nashir.evidence.accept` | Accept evidence as proof record where authorized. | Evidence acceptance does not authorize publishing or prove analytics. |
| `nashir.evidence.request_correction` | Request correction for incomplete or mismatched evidence. | Does not overwrite prior evidence silently. |
| `nashir.evidence.supersede` | Supersede evidence while preserving prior evidence history. | Requires explicit evidence authority. |
| `nashir.evidence.invalidate` | Invalidate incorrect evidence with reason. | Requires elevated evidence authority. |
| `nashir.utm.view` | View UTM Lite tracked-link planning/status. | UTM Lite is not analytics ingestion or attribution. |
| `nashir.utm.prepare` | Prepare tracked links where future implementation is approved. | Does not prove visits, conversions, or performance. |
| `nashir.performance.view` | View user-entered manual performance observations. | Not platform analytics. |
| `nashir.performance.enter` | Enter manual performance observations where future implementation is approved. | User-entered only; no ingestion, optimization, or attribution. |
| `nashir.audit.view` | View Nashir governance/audit information where future policy allows. | Audit access remains sensitive and workspace-scoped. |
| `nashir.nogo.view` | View NO-GO boundary labels and blocked capability explanations. | Does not authorize any NO-GO action. |
| `nashir.permission.view` | View role/permission boundary labels where future policy allows. | Does not mutate roles or permissions. |

## 4. Role / Action Matrix

This matrix is planning-only. "Candidate" means a future policy may grant the permission. "Denied" means the role must not perform the action under Core V1 unless an explicitly named future authorization changes the role boundary.

Role names in this matrix are Nashir planning personas, not final current `role_code` values. A future implementation gate must reconcile these personas with existing repository roles before enforcement. Existing role examples include `owner`, `admin`, `creator`, `reviewer`, `publisher`, `viewer`, and `billing_admin`. `billing_admin` is not granted Nashir operational authority by this document unless a future policy explicitly allows it.

| Action group | Owner | Admin | Editor | Reviewer | Evidence reviewer | Viewer | AI assistant advisory-only |
|---|---|---|---|---|---|---|---|
| View readiness/status | Candidate | Candidate | Candidate | Candidate | Candidate | Candidate | Advisory display only |
| Draft/edit intake or content | Candidate | Candidate | Candidate | Denied unless separately granted | Denied unless separately granted | Denied | Denied as actor |
| Submit for review | Candidate | Candidate | Candidate | Candidate if policy allows | Denied unless separately granted | Denied | Denied |
| Review/approve/reject/request changes | Candidate with explicit approval authority | Candidate with explicit approval authority | Denied unless reviewer-authorized | Candidate with explicit approval authority | Denied unless reviewer-authorized | Denied | Denied |
| Trigger reapproval after material change | Candidate | Candidate | Candidate when editing approved content | Candidate if policy allows | Denied unless separately authorized | Denied | Denied |
| View/prepare manual checklist | Candidate | Candidate | Candidate | Candidate if policy allows | Denied unless separately authorized | Denied | Denied |
| Submit evidence | Candidate | Candidate | Candidate if policy allows | Denied unless separately granted | Candidate if policy allows | Denied | Denied |
| Review/accept/correct/supersede/invalidate evidence | Candidate with explicit evidence authority | Candidate with explicit evidence authority | Denied unless evidence-authorized | Denied unless evidence-authorized | Candidate with explicit evidence authority | Denied | Denied |
| View/prepare UTM Lite | Candidate | Candidate | Candidate if policy allows | Candidate if policy allows | Denied unless separately authorized | Denied | Denied |
| View/enter manual performance | Candidate | Candidate | Candidate if policy allows | Denied unless separately granted | Denied unless separately granted | Denied | Denied |
| View audit / permissions / NO-GO boundaries | Candidate | Candidate if policy allows | Scoped view only if policy allows | Candidate if policy allows | Candidate if policy allows | Denied | Denied |
| NO-GO action attempts | Denied | Denied | Denied | Denied | Denied | Denied | Denied |

## 5. Explicit Denials

- Viewer is denied all mutations.
- Editor is denied approval unless explicitly reviewer-authorized.
- Reviewer is denied evidence acceptance, correction, supersede, or invalidation unless evidence-authorized.
- Evidence reviewer is denied approval, rejection, and request-changes decisions unless reviewer-authorized.
- AI assistant is denied all protected actions.
- All roles are denied NO-GO actions.
- No role may directly publish, authorize publishing, use social OAuth, schedule, launch paid ads, pay, bill, ingest analytics, attribute performance, connect external integrations, run autonomous AI execution, implement Post-V1 modules, or claim production readiness from this specification.

## 6. QA Case Identifier Rules

QA case IDs below are planning identifiers only.

Executable tests are approved now: NO.

No test file may be created or modified from this document.

Future automated tests require a separate QA/test implementation gate with exact allowed files, forbidden files, commands, expected CI gates, rollback/no-go criteria, and NO-GO boundaries.

## 7. QA Case Specification

| QA category | Purpose | Manual documentation-only cases | Future automated test candidates | Expected denial/allowed behavior | Related User Story IDs | Related Acceptance Criteria IDs | Executable tests approved now |
|---|---|---|---|---|---|---|---|
| `NQA-READINESS` | Verify readiness remains advisory. | Review wording that readiness is not approval and does not authorize publishing. | Readiness-as-approval denial; blocked_until_review behavior. | View allowed; approval/publishing bypass denied. | `NUS-READINESS-001` | `AC-READINESS-001` through `AC-READINESS-004` | NO |
| `NQA-INTAKE` | Verify manual/user-confirmed intake. | Review wizard/intake copy for manual confirmation and no autonomous execution. | Required-field validation; unconfirmed input denial. | Draft allowed where authorized; autonomous intake denied. | `NUS-WIZARD-001` | `AC-WIZARD-001`, `AC-WIZARD-002` | NO |
| `NQA-OBJECT` | Verify advertised-object intake boundaries. | Review product/store/service/offer wording for user-provided data only. | External data ingestion and first-class object creation denial. | Manual capture allowed where authorized; external ingestion denied. | `NUS-OBJECT-001` | `AC-OBJECT-001`, `AC-OBJECT-002` | NO |
| `NQA-CAMPAIGN` | Verify campaign/brief reuse and no lifecycle expansion. | Review campaign basics wording for reuse-only boundaries. | New endpoint/table/generated-client drift checks if future gate approves. | Campaign planning allowed where authorized; lifecycle expansion denied. | `NUS-CAMPAIGN-001` | `AC-CAMPAIGN-001`, `AC-CAMPAIGN-002` | NO |
| `NQA-DESTINATION` | Verify destination capture and material-change handling. | Review destination/UTM wording for no attribution and reapproval warnings. | Invalid destination; material destination change requiring reapproval. | Destination review allowed where authorized; attribution and bypass denied. | `NUS-DESTINATION-001` | `AC-DESTINATION-001`, `AC-DESTINATION-002` | NO |
| `NQA-RIGHTS` | Verify creative rights remain manual and review-blocking. | Review rights labels for manual confirmation and blocked-until-review behavior. | Missing/unclear rights block; AI rights confirmation denial. | Human review allowed where authorized; automated clearance denied. | `NUS-RIGHTS-001` | `AC-RIGHTS-001`, `AC-RIGHTS-002` | NO |
| `NQA-CONTENT` | Verify content, hashtags, and scripts remain draft/advisory. | Review AI provenance and protected-field wording. | AI protected-field denial; final video production denial. | Draft/edit allowed where authorized; protected AI action denied. | `NUS-CONTENT-001`, `NUS-HASHTAGS-001`, `NUS-VIDEO-001` | `AC-CONTENT-001`, `AC-CONTENT-002`, `AC-HASHTAGS-001`, `AC-VIDEO-001` | NO |
| `NQA-UTM` | Verify UTM Lite is tracked links only. | Review no-attribution/no-analytics labels. | UTM mismatch correction/invalidation; attribution attempt denial. | Tracked-link preparation allowed where authorized; analytics/attribution denied. | `NUS-UTM-001` | `AC-UTM-001`, `AC-UTM-002` | NO |
| `NQA-APPROVAL` | Verify human authorized approval only. | Review approval copy for human, explicit, version-bound authority. | Unauthorized approval; AI approval; readiness approval bypass. | Authorized human review actions allowed; viewer/editor/AI approval denied. | `NUS-APPROVAL-001` | `AC-APPROVAL-001`, `AC-APPROVAL-002` | NO |
| `NQA-REAPPROVAL` | Verify approval lock and material-change handling. | Review reapproval-required wording and material-change examples. | Draft/generated direct-to-approved denial; material change requires reapproval. | Reapproval labels allowed; silent approved-content mutation denied. | `NUS-REAPPROVAL-001` | `AC-REAPPROVAL-001`, `AC-REAPPROVAL-002` | NO |
| `NQA-CHECKLIST` | Verify manual publishing checklist remains non-executing. | Review checklist wording for no publish/schedule/spend/connect controls. | Checklist completion not publishing; forbidden control absence. | Checklist view/prepare allowed where authorized; execution denied. | `NUS-CHECKLIST-001` | `AC-CHECKLIST-001` | NO |
| `NQA-EVIDENCE` | Verify evidence remains proof only. | Review URL/screenshot/version/UTM evidence expectations. | Wrong version evidence; accept/correct/supersede/invalidate authorization; AI evidence denial. | Evidence submit/review allowed where authorized; authorization bypass denied. | `NUS-EVIDENCE-001` | `AC-EVIDENCE-001` through `AC-EVIDENCE-004` | NO |
| `NQA-PERFORMANCE` | Verify manual performance remains user-entered only. | Review manual observation wording for no platform verification. | Analytics import denial; attribution/optimization denial. | Manual entry allowed where authorized; ingestion/attribution denied. | `NUS-PERFORMANCE-001` | `AC-PERFORMANCE-001`, `AC-PERFORMANCE-002` | NO |
| `NQA-PERMISSIONS` | Verify role and protected-action boundaries. | Review proposed codes, denials, and role/action matrix. | Viewer mutation denial; editor approval denial; reviewer/evidence-reviewer separation; AI denial. | Authorized actions allowed only where explicit; all unauthorized protected actions denied. | `NUS-PERMISSIONS-001` | `AC-PERMISSIONS-001` through `AC-PERMISSIONS-003` | NO |
| `NQA-TENANT` | Verify workspace trust boundary. | Review route/context workspace authority requirements. | Cross-workspace denial; body `workspace_id` distrust. | Same-workspace access only where authorized; cross-workspace access denied. | `NUS-TENANT-001` | `AC-TENANT-001`, `AC-TENANT-002` | NO |
| `NQA-ERRORS` | Verify ErrorModel and idempotency expectations. | Review expected ErrorModel consistency and idempotency scope. | Forbidden action ErrorModel; invalid transition ErrorModel; idempotency conflict behavior where applicable. | Denials must be consistent; duplicate side effects denied. | `NUS-ERRORS-001` | `AC-ERRORS-001`, `AC-ERRORS-002` | NO |
| `NQA-NOGO` | Verify all NO-GO boundaries remain blocked. | Review labels and absence of wording that implies forbidden capabilities. | Direct publishing, OAuth, scheduling, paid, billing, analytics, attribution, integration, AI, Post-V1, production, SQL/OpenAPI/client drift denials. | Viewing boundaries allowed; all NO-GO action attempts denied. | `NUS-NOGO-001` | `AC-NOGO-001`, `AC-NOGO-002` | NO |

## 8. NO-GO Negative Test Categories

Future QA planning must include negative coverage for:

- direct publishing;
- publishing authorization bypass;
- readiness-as-approval;
- evidence-as-authorization;
- social OAuth;
- scheduling;
- paid ads;
- payment/billing;
- analytics ingestion;
- attribution;
- external integrations;
- autonomous AI execution;
- Post-V1 module implementation;
- production readiness claims;
- generated client/OpenAPI/SQL drift.

These are planning categories only and do not approve executable tests.

## 9. Future Verification Requirements

Future implementation or QA gates, if separately approved, must define exact checks for:

- permission denial behavior for viewer, editor, reviewer, evidence reviewer, and AI assistant;
- tenant isolation checks for all workspace-scoped surfaces;
- body `workspace_id` distrust and route/context workspace authority;
- ErrorModel consistency for forbidden actions, invalid transitions, invalid evidence, cross-workspace access, idempotency conflicts, and NO-GO attempts;
- idempotency behavior where existing OpenAPI declares it;
- no protected AI action;
- no publishing behavior;
- no analytics ingestion behavior;
- no attribution behavior;
- no external integration behavior;
- no generated client/OpenAPI/SQL drift.

## 10. Allowed Files For This Documentation-Only Specification

This documentation-only specification may change only:

- `docs/nashir_permission_codes_and_qa_case_specification.md`
- `docs/03_decision_log.md`
- `docs/17_change_log.md`

## 11. Forbidden Files

The following remain forbidden:

- `src/**`
- `test/**`
- `tests/**`
- `ui/**`
- SQL files
- OpenAPI files
- generated clients
- `package.json`
- `package-lock.json`
- `.github/workflows/**`
- `migrations/**`
- `scripts/**`
- `prototype/**`
- `router.js`
- `store.js`
- `server.js`
- runtime files
- external integrations
- analytics/attribution files
- payment/billing files
- AI runtime/autonomous agent files
- any implementation file

## 12. GO / NO-GO Decision

GO for documentation-only Nashir permission codes and QA case specification.

GO for using the proposed permission codes and QA case IDs as planning identifiers in later documentation review.

NO-GO for implementation.

NO-GO for executable tests.

NO-GO for runtime/backend/UI/API/SQL/OpenAPI/generated-client/package/workflow/migration changes.

NO-GO for RBAC enforcement claims.

NO-GO for route/serve/link readiness, production readiness, AI action authority, publishing, analytics ingestion, attribution, external integrations, payment, billing, or Post-V1 implementation.

## 13. Recommended Next Step

Manually review this documentation-only specification for permission-code naming consistency, QA traceability, denial wording, and NO-GO coverage.

If reviewers approve it, a later documentation-only gate may decide whether exact audit event payloads, ErrorModel mappings, and material-change criteria are ready for a separate specification.
