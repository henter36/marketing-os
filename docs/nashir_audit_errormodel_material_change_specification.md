# Nashir Audit Event Payload, ErrorModel Mapping, and Material-Change Specification

| Field | Value |
|---|---|
| Document type | Documentation-only planning/specification |
| Status | Draft - Pending Review |
| Scope | Nashir Core V1 audit event payload, ErrorModel mapping, and material-change criteria planning |
| Change type | Documentation-only |
| Implementation status | Not approved |
| Executable tests approved | NO |

## 1. Purpose and Authority

This document is documentation-only and planning/specification only.

It does not approve implementation, executable tests, audit logging implementation, ErrorModel runtime implementation, RBAC enforcement, route readiness, serve readiness, link readiness, or production readiness.

It does not approve runtime, backend, UI, API, SQL, OpenAPI, generated-client, package, workflow, migration, script, prototype, routing, serving, linking, external integration, analytics, attribution, payment, billing, AI runtime, autonomous agent, or implementation-file changes.

All event names, fields, mappings, codes, states, transitions, criteria, and examples below are planning candidates only. A future implementation gate must separately approve exact allowed files, forbidden files, verification commands, CI gates, rollback/no-go criteria, and implementation scope.

## 2. Governance Summary

- Nashir Core V1 remains manual/export/review/approval/evidence only.
- Readiness is advisory and is not approval.
- Evidence records proof only and is not publishing authorization.
- Manual publishing remains external and user-operated.
- UTM Lite supports tracked-link planning only and is not analytics ingestion or attribution.
- AI assistant behavior remains advisory-only and cannot perform protected actions.
- Body-provided `workspace_id` must not be trusted; future implementation must use route-derived workspace context.
- Current AuthGuard, WorkspaceContextGuard, MembershipCheck, PermissionGuard, and ErrorModel behavior must be preserved unless a later approved contract explicitly changes them.

## 3. Planning-Only Audit Event Catalog

The following catalog defines candidate event names and planning-only payload fields. It does not create durable audit logging, persistence, schemas, APIs, or runtime behavior.

Common candidate payload fields:

- `workspace_id`: route-derived workspace context; never trusted from request body.
- `actor_id`: authenticated actor candidate.
- `actor_role_or_persona`: planning persona or role label.
- `entity_type`: workspace-scoped entity category such as campaign, brief_version, media_asset_version, approval, evidence, tracked_link, readiness, or no_go_boundary.
- `entity_id`: entity identifier where applicable.
- `campaign_id`: included where the event is campaign-scoped.
- `brief_version_id`: included where the event is brief/content-version-scoped.
- `media_asset_version_id`: included where evidence or approval is asset-version-scoped.
- `content_hash`: included where version integrity is relevant.
- `previous_state`: prior planning state where applicable.
- `new_state`: resulting planning state where applicable.
- `changed_fields`: field names or categories changed.
- `reason`: human or system reason label.
- `source_action`: originating action candidate.
- `denial_category`: included for permission, tenant, protected-action, or policy denials.
- `no_go_category`: included for NO-GO attempts.
- `correlation_id` / `idempotency_key`: included where request tracing or duplicate side-effect prevention is relevant.
- `occurred_at`: event timestamp candidate.
- `notes`: optional planning notes; must not replace structured fields.

| Event | Planning-only purpose | Payload field expectations |
|---|---|---|
| `nashir.readiness.viewed` | Readiness panel or status viewed. | Common fields plus `campaign_id`, `brief_version_id` where applicable, `new_state` as viewed readiness status, `source_action`, `occurred_at`, `notes`. |
| `nashir.readiness.recalculated` | Readiness recalculation candidate recorded. | Common fields plus `campaign_id`, `brief_version_id`, `content_hash` where applicable, `previous_state`, `new_state`, `changed_fields`, `reason`, `correlation_id` / `idempotency_key`, `occurred_at`. |
| `nashir.intake.saved` | Manual intake saved. | Common fields plus `campaign_id`, `brief_version_id` where applicable, `previous_state`, `new_state`, `changed_fields`, `source_action`, `correlation_id` / `idempotency_key`, `occurred_at`. |
| `nashir.rights.confirmed` | Human rights confirmation candidate. | Common fields plus `campaign_id`, `media_asset_version_id`, `content_hash` where applicable, `previous_state`, `new_state`, `changed_fields`, `reason`, `occurred_at`. |
| `nashir.approval.submitted` | Version submitted for human review. | Common fields plus `campaign_id`, `brief_version_id`, `media_asset_version_id` where applicable, `content_hash`, `previous_state`, `new_state`, `source_action`, `idempotency_key`, `occurred_at`. |
| `nashir.approval.accepted` | Authorized human approval candidate. | Common fields plus `campaign_id`, `brief_version_id`, `media_asset_version_id` where applicable, `content_hash`, `previous_state`, `new_state`, `reason`, `source_action`, `occurred_at`. |
| `nashir.approval.rejected` | Authorized human rejection candidate. | Common fields plus `campaign_id`, `brief_version_id`, `content_hash`, `previous_state`, `new_state`, `reason`, `source_action`, `occurred_at`. |
| `nashir.approval.request_changes` | Authorized request for changes candidate. | Common fields plus `campaign_id`, `brief_version_id`, `content_hash`, `previous_state`, `new_state`, `changed_fields`, `reason`, `occurred_at`. |
| `nashir.approval.invalidated_by_material_change` | Prior approval invalidated by material change candidate. | Common fields plus `campaign_id`, `brief_version_id`, `media_asset_version_id` where applicable, `content_hash`, `previous_state`, `new_state`, `changed_fields`, `reason`, `source_action`, `occurred_at`. |
| `nashir.manual_publish.checklist.completed` | Manual checklist completion candidate. | Common fields plus `campaign_id`, `brief_version_id`, `content_hash`, `previous_state`, `new_state`, `changed_fields`, `source_action`, `occurred_at`. |
| `nashir.manual_publish.evidence.submitted` | User-provided evidence submitted. | Common fields plus `campaign_id`, `brief_version_id`, `media_asset_version_id` where applicable, `content_hash`, `previous_state`, `new_state`, `source_action`, `idempotency_key`, `occurred_at`, `notes`. |
| `nashir.manual_publish.evidence.reviewed` | Evidence reviewed, corrected, accepted, superseded, or invalidated candidate. | Common fields plus `campaign_id`, `brief_version_id`, `media_asset_version_id`, `content_hash`, `previous_state`, `new_state`, `changed_fields`, `reason`, `source_action`, `occurred_at`. |
| `nashir.utm.tracked_link.created` | UTM Lite tracked link candidate created. | Common fields plus `campaign_id`, `brief_version_id`, `previous_state`, `new_state`, `changed_fields`, `source_action`, `idempotency_key`, `occurred_at`. |
| `nashir.manual_performance.entered` | User-entered manual performance observation candidate. | Common fields plus `campaign_id`, `brief_version_id` where applicable, `changed_fields`, `source_action`, `occurred_at`, `notes`. |
| `nashir.permission.denied` | Permission denial candidate. | Common fields plus `campaign_id` where applicable, `source_action`, `denial_category`, `reason`, `correlation_id`, `occurred_at`. |
| `nashir.tenant.denied` | Tenant/workspace boundary denial candidate. | Common fields plus `entity_type`, `entity_id`, `source_action`, `denial_category`, `reason`, `correlation_id`, `occurred_at`; body `workspace_id` conflict must be captured only as untrusted input context. |
| `nashir.nogo.blocked` | NO-GO attempt blocked candidate. | Common fields plus `campaign_id` where applicable, `source_action`, `no_go_category`, `reason`, `correlation_id`, `occurred_at`. |
| `nashir.idempotency.conflict` | Idempotency conflict candidate. | Common fields plus `source_action`, `correlation_id`, `idempotency_key` where applicable, `occurred_at`, `notes`. |
| `nashir.ai.advisory_output.generated` | Advisory AI output generated candidate. | Common fields plus `campaign_id`, `brief_version_id` where applicable, `content_hash` where applicable, `source_action`, `correlation_id`, `occurred_at`, `notes`; must not imply protected action execution. |

## 4. Planning-Only ErrorModel Mapping

The following mapping is a planning candidate only. It does not implement ErrorModel behavior or alter existing runtime responses.

| Condition | Suggested code | Suggested HTTP status | User-facing message intent | Actor-facing action | Audit event candidate | Implementation approval status |
|---|---|---:|---|---|---|---|
| Permission denied | `PERMISSION_DENIED` | 403 | The actor is not allowed to perform this action. | Request access or use an authorized actor. | `nashir.permission.denied` | NO |
| Tenant mismatch | `WORKSPACE_ACCESS_DENIED` | 403 | The requested item is not available in this workspace. | Use route-derived workspace context. | `nashir.tenant.denied` | NO |
| Body `workspace_id` conflict | `TENANT_CONTEXT_MISMATCH` | 422 | Workspace context is invalid for this request. | Remove or correct untrusted body workspace data. | `nashir.tenant.denied` | NO |
| Missing intake fields | `NASHIR_INTAKE_REQUIRED_FIELDS_MISSING` | 422 | Required intake information is missing. | Complete the required manual fields. | `nashir.readiness.recalculated` | NO |
| Invalid destination | `NASHIR_INVALID_DESTINATION` | 422 | The landing destination cannot be used as entered. | Correct the destination. | `nashir.readiness.recalculated` | NO |
| Missing rights confirmation | `NASHIR_RIGHTS_CONFIRMATION_REQUIRED` | 409 | Creative rights must be confirmed before proceeding. | Confirm rights or route for review. | `nashir.rights.confirmed` or `nashir.nogo.blocked` | NO |
| Approval blocked | `NASHIR_APPROVAL_BLOCKED` | 409 | This item cannot be approved in its current state. | Resolve blockers and resubmit for review. | `nashir.nogo.blocked` | NO |
| Reapproval required | `NASHIR_REAPPROVAL_REQUIRED` | 409 | Material changes require reapproval. | Submit the changed version for review. | `nashir.approval.invalidated_by_material_change` | NO |
| Evidence missing | `NASHIR_EVIDENCE_REQUIRED` | 422 | Publishing evidence is missing. | Submit user-provided evidence. | `nashir.manual_publish.evidence.submitted` | NO |
| Evidence invalid | `NASHIR_EVIDENCE_INVALID` | 422 | Evidence does not satisfy the review expectation. | Correct or replace the evidence. | `nashir.manual_publish.evidence.reviewed` | NO |
| Evidence self-review denied | `NASHIR_EVIDENCE_SELF_REVIEW_DENIED` | 403 | The submitter cannot review their own evidence. | Route evidence to a different authorized reviewer. | `nashir.permission.denied` | NO |
| Wrong content version evidence | `NASHIR_EVIDENCE_VERSION_MISMATCH` | 409 | Evidence does not match the approved content version. | Submit evidence for the correct version. | `nashir.manual_publish.evidence.reviewed` | NO |
| UTM mismatch | `NASHIR_UTM_MISMATCH` | 409 | The tracked link does not match the expected UTM plan. | Correct the UTM fields or invalidate affected evidence. | `nashir.manual_publish.evidence.reviewed` | NO |
| AI protected-action attempt | `NASHIR_AI_PROTECTED_ACTION_DENIED` | 403 | AI output is advisory and cannot perform this action. | Use an authorized human actor. | `nashir.nogo.blocked` | NO |
| Readiness-as-approval attempt | `NASHIR_READINESS_IS_NOT_APPROVAL` | 409 | Readiness does not approve content. | Request explicit human approval. | `nashir.nogo.blocked` | NO |
| Evidence-as-authorization attempt | `NASHIR_EVIDENCE_IS_NOT_AUTHORIZATION` | 409 | Evidence does not authorize publishing. | Use the approved manual process. | `nashir.nogo.blocked` | NO |
| NO-GO attempt | `NASHIR_NOGO_BLOCKED` | 403 | This capability is outside approved Nashir Core V1 scope. | Stop and request a separate approved gate. | `nashir.nogo.blocked` | NO |
| Invalid state transition | `NASHIR_INVALID_STATE_TRANSITION` | 409 | This state change is not allowed. | Follow the approved review/evidence flow. | `nashir.permission.denied` or `nashir.nogo.blocked` | NO |
| Idempotency conflict | `NASHIR_IDEMPOTENCY_CONFLICT` | 409 | This request conflicts with an earlier request key. | Use a new key or reconcile the prior request. | `nashir.idempotency.conflict` | NO |

## 5. Invalid Transition Mapping

These are planning-only invalid transition candidates. They do not create state machine code or tests.

| Invalid transition or attempt | Expected planning outcome | ErrorModel candidate | Audit event candidate |
|---|---|---|---|
| Draft to approved | Block. | `NASHIR_INVALID_STATE_TRANSITION` | `nashir.permission.denied` |
| Generated to approved without review | Block. | `NASHIR_INVALID_STATE_TRANSITION` | `nashir.permission.denied` |
| Blocked_until_review to approved | Block until human review clears blocker. | `NASHIR_APPROVAL_BLOCKED` | `nashir.permission.denied` |
| Rejected to approved | Block; revised content must return through generated and in_review. | `NASHIR_INVALID_STATE_TRANSITION` | `nashir.permission.denied` |
| Requires_reapproval bypass | Block; submit changed version for review. | `NASHIR_REAPPROVAL_REQUIRED` | `nashir.permission.denied` |
| Invalid evidence state transition | Block. | `NASHIR_INVALID_STATE_TRANSITION` | `nashir.permission.denied` |
| Unauthorized evidence acceptance | Block. | `NASHIR_PERMISSION_DENIED` | `nashir.permission.denied` |
| Unauthorized evidence invalidation | Block. | `NASHIR_PERMISSION_DENIED` | `nashir.permission.denied` |
| Direct publishing attempt | Block as NO-GO. | `NASHIR_NOGO_BLOCKED` | `nashir.nogo.blocked` |
| Social OAuth attempt | Block as NO-GO. | `NASHIR_NOGO_BLOCKED` | `nashir.nogo.blocked` |
| Scheduling attempt | Block as NO-GO. | `NASHIR_NOGO_BLOCKED` | `nashir.nogo.blocked` |
| Paid ads attempt | Block as NO-GO. | `NASHIR_NOGO_BLOCKED` | `nashir.nogo.blocked` |
| Analytics ingestion attempt | Block as NO-GO. | `NASHIR_NOGO_BLOCKED` | `nashir.nogo.blocked` |
| Attribution attempt | Block as NO-GO. | `NASHIR_NOGO_BLOCKED` | `nashir.nogo.blocked` |
| Autonomous AI execution attempt | Block as NO-GO. | `NASHIR_AI_PROTECTED_ACTION_DENIED` | `nashir.nogo.blocked` |

## 6. Material-Change Criteria

Material-change criteria are planning candidates only. No material-change automation is implemented or approved.

Candidate material changes:

- body text meaning change;
- headline;
- offer or CTA;
- landing destination;
- image, video, or asset;
- hashtags unless later narrowed;
- channel;
- promotion terms;
- claims or risk wording;
- creative rights status;
- UTM link changes when material to destination or campaign.

Planning effect:

- material changes after approval should invalidate the prior approval candidate;
- changed content should move to a reapproval-required planning state;
- the candidate audit event is `nashir.approval.invalidated_by_material_change`;
- the candidate ErrorModel code for bypass attempts is `NASHIR_REAPPROVAL_REQUIRED`;
- future implementation must preserve version-bound approval and content integrity.

## 7. Non-Material Candidates

The following are non-material planning candidates when they do not alter user-visible meaning, rights, claims, destination, channel, approval integrity, or evidence integrity:

- formatting-only changes;
- typo corrections with no meaning change;
- whitespace changes;
- internal note updates;
- non-user-visible metadata changes;
- display-only reordering that does not change meaning.

Future implementation, if approved, must define who may classify a change as non-material and how disputes are reviewed.

## 8. Evidence Handling

Evidence remains user-provided proof only. Evidence does not authorize publishing, prove analytics, prove attribution, or replace human approval.

Planning evidence cases:

- evidence correction: preserves the prior submitted evidence candidate and records a corrected replacement or updated review note;
- evidence supersede: marks earlier evidence as superseded with reason and version reference;
- evidence invalidation: marks evidence invalid with reason, actor, version reference, and review authority;
- wrong-version evidence: blocks acceptance when evidence does not match the approved `brief_version_id`, `media_asset_version_id`, or `content_hash`;
- four-eyes / self-submission denial: blocks acceptance, correction approval, supersede, or invalidation by the same actor who submitted the evidence;
- attachment/screenshot reference expectations: candidate references should include URL, screenshot/attachment identifier, captured-at time where applicable, platform label entered by user, and content/version linkage.

Audit payload expectations:

- evidence submission should use `nashir.manual_publish.evidence.submitted`;
- evidence review, correction, supersede, invalidation, wrong-version findings, and UTM findings should use `nashir.manual_publish.evidence.reviewed`;
- payloads should include route-derived `workspace_id`, `actor_id`, `actor_role_or_persona`, `campaign_id`, applicable version IDs, `content_hash`, `previous_state`, `new_state`, `changed_fields`, `reason`, `source_action`, `occurred_at`, and notes.

ErrorModel mapping expectations:

- missing evidence: `NASHIR_EVIDENCE_REQUIRED`;
- invalid evidence: `NASHIR_EVIDENCE_INVALID`;
- self-review denial: `NASHIR_EVIDENCE_SELF_REVIEW_DENIED`;
- wrong-version evidence: `NASHIR_EVIDENCE_VERSION_MISMATCH`;
- evidence-as-authorization attempt: `NASHIR_EVIDENCE_IS_NOT_AUTHORIZATION`.

## 9. UTM Lite Handling

UTM Lite is planning-only tracked-link handling. It does not approve analytics ingestion or attribution.

Exact UTM field candidates:

- `utm_source`;
- `utm_medium`;
- `utm_campaign`;
- `utm_content`;
- `utm_term`.

UTM mismatch categories:

- missing required UTM field;
- unexpected UTM field value;
- destination URL mismatch;
- campaign identifier mismatch;
- content or creative identifier mismatch;
- stale tracked link after material destination or campaign change;
- evidence URL does not match expected tracked link.

Correction versus invalidation planning:

- correct minor UTM field mismatch before evidence acceptance where no material destination or campaign impact exists;
- invalidate or supersede affected evidence where the evidence URL proves a different destination, campaign, or content version;
- require reapproval when a UTM link change is material to destination, campaign, offer, claims, or user-facing meaning.

Relation to evidence:

- evidence should reference the expected tracked link candidate where applicable;
- UTM mismatch may require evidence correction, supersede, or invalidation;
- UTM match does not prove delivery, performance, conversion, analytics, attribution, or publishing authorization.

## 10. Readiness Handling

Readiness is advisory-only and cannot approve content, authorize publishing, or replace evidence.

Planning readiness states:

- `pass`: required readiness checks appear satisfied at the planning layer; no approval or publishing authorization is implied.
- `soft_pass`: non-blocking warnings exist; no approval or publishing authorization is implied.
- `fail`: required fields or validation expectations are missing or invalid; action should return to completion or review.
- `blocked_until_review`: governance, rights, claims, safety, or NO-GO-adjacent risk requires human review before proceeding.

Warning behavior:

- warnings should be visible to authorized actors;
- warnings should not silently approve, publish, schedule, spend, ingest analytics, attribute performance, or connect integrations.

No approval behavior:

- readiness cannot set approval state to approved;
- readiness cannot bypass reviewer authority;
- readiness cannot satisfy reapproval after material change.

No publishing authorization behavior:

- readiness cannot authorize direct publishing;
- readiness cannot authorize manual publishing outside the approved human process;
- readiness cannot authorize social OAuth, scheduling, paid ads, payment, analytics ingestion, attribution, external integrations, or autonomous AI execution.

## 11. NO-GO Negative Behavior

Future planning and verification must preserve blocking behavior for:

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

These are negative planning categories only and do not approve executable tests.

## 12. Allowed Files For This Documentation-Only Specification

This documentation-only specification may change only:

- `docs/nashir_audit_errormodel_material_change_specification.md`
- `docs/03_decision_log.md`
- `docs/17_change_log.md`

## 13. Forbidden Files

The following remain forbidden:

- `src/**`
- `test/**`
- `tests/**`
- `ui/**`
- `docs/*schema*.sql`
- `docs/*openapi*.yaml`
- generated clients
- `package.json`
- `package-lock.json`
- `.github/workflows/**`
- `migrations/**`
- `scripts/**`
- `prototype/**`
- `src/router.js`
- `src/store.js`
- `src/server.js`
- runtime files
- external integrations
- analytics/attribution files
- payment/billing files
- AI runtime/autonomous agent files
- any implementation file

## 14. GO / NO-GO Decision

GO for documentation-only Nashir audit event payload, ErrorModel mapping, and material-change criteria specification.

NO-GO for implementation, executable tests, audit logging implementation, ErrorModel runtime implementation, RBAC enforcement, route/serve/link readiness, production readiness, SQL/OpenAPI/runtime/UI/API/generated-client/package/workflow/migration changes, and all NO-GO capabilities listed above.
