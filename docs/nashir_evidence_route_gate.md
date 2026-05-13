# Nashir Evidence Route Gate

## Purpose

This is a documentation-only governance gate for future Nashir evidence routes.

This PR does not implement runtime behavior, modify tests, change SQL, change OpenAPI YAML, expand RBAC, update generated clients, add UI, or approve Sprint 5, Pilot, or Production readiness.

## Task Classification

Documentation-only governance gate.

## Approved Sources Used

- `AGENTS.md`
- `README.md`
- `docs/17_change_log.md`
- `docs/03_decision_log.md`
- `docs/nashir_status_after_readiness_route.md`
- `docs/nashir_manual_publishing_evidence_contract.md`
- `docs/nashir_audit_errormodel_material_change_specification.md`
- `docs/nashir_permission_codes_and_qa_case_specification.md`
- `docs/nashir_openapi_patch.yaml`
- `src/router.js`
- `src/guards.js`
- `src/rbac.js`
- `src/nashir/backend-slice0-service.js`
- `src/nashir/backend-slice0-repository.js`
- `test/nashir-route.test.js`
- `test/nashir-prewiring-contract.test.js`

No approved source conflict was identified.

## Current Implemented Nashir Routes

The currently implemented Nashir routes are:

```text
GET /workspaces/{workspaceId}/nashir-campaigns
GET /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}
POST /workspaces/{workspaceId}/nashir-campaigns
GET /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/readiness
```

Readiness is advisory only. It does not approve content, authorize publishing, create evidence, update evidence, or persist scoring output.

No Nashir evidence route is currently implemented.

## Candidate Future Evidence Routes

Future evidence route options may be considered only after separate approval:

```text
GET /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/evidence
POST /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/evidence
```

This document does not approve implementation of either route.

The future `GET` route would be a read-only evidence list candidate. The future `POST` route would be a submit-evidence candidate only after audit, version, self-review, validation, and ErrorModel constraints are resolved.

## Recommended Sequencing

Lowest-risk sequencing:

1. Complete this docs-only evidence route gate.
2. Consider a separate docs-only evidence contract or implementation gate that defines exact payloads, response schema, audit events, permissions, version binding, and denial behavior.
3. Consider a read-only evidence list route first, if the read permission strategy and OpenAPI contract are resolved.
4. Consider evidence submission only after audit, version binding, self-review, proof boundary, and validation constraints are approved.

Do not implement evidence submission directly from this gate.

## Permission Strategy

This PR does not invent or approve a new RBAC permission.

Existing permission candidates:

- `nashir.evidence.submit` for future evidence submission behavior.
- `nashir.campaign.read` for future evidence read behavior only if the future route returns evidence status that is already safe for campaign readers.
- `nashir.evidence.submit` or a separately approved evidence-specific permission for evidence read behavior if evidence details are sensitive or submission-linked.

If read evidence requires a new permission, implementation remains NO-GO until a separate RBAC gate approves that permission and role mapping.

Any future implementation must preserve that valid active members lacking the required permission receive `403`.

## Evidence Semantics

Evidence is proof only.

Evidence does not:

- authorize publishing;
- approve content;
- prove analytics;
- prove attribution;
- prove reach;
- prove conversion;
- prove performance;
- perform direct publishing;
- perform social OAuth, scheduling, paid ads, payment, analytics ingestion, attribution, external integration, or autonomous AI execution.

Future evidence must be tied to route-derived `workspaceId` and route-derived `nashirCampaignId`.

If a future implementation supports content or asset versions, evidence must reference the correct approved content/version. Wrong-version evidence must not be accepted.

Submission alone is not acceptance.

## Self-Review And Four-Eyes

No actor may accept, invalidate, supersede, or review their own submitted evidence unless a future approved policy explicitly allows that behavior.

Evidence submission alone does not prove sufficiency, acceptance, approval, publishing authorization, analytics, attribution, reach, conversion, or performance.

Future implementation must separate evidence submitter authority from evidence review or acceptance authority where the approved policy requires four-eyes control.

## Audit Requirements

Future evidence submission must be audited.

Candidate event names should follow the current reconciled Nashir snake_case convention. Candidate examples:

```text
nashir_evidence.submitted
nashir_evidence.reviewed
nashir_evidence.invalidated
```

Exact event names must be approved before implementation.

No audit implementation is approved in this PR.

Future audit payloads should include route-derived workspace context, campaign context, actor, evidence state before/after where applicable, version reference where applicable, reason, source action, and timestamp.

## ErrorModel And Denial Behavior

Future evidence route implementation must preserve non-disclosing tenant behavior:

- missing membership returns `404`;
- unknown workspace returns `404`;
- cross-workspace campaign access returns `404`;
- valid active member lacking the required permission returns `403`;
- invalid evidence payload returns a validation error according to existing ErrorModel conventions;
- wrong-version evidence should be conflict or validation only after a future contract decides the exact mapping.

Body-provided `workspace_id` must not override route workspace context.

## Runtime Constraints For Future Implementation

A future implementation PR, if separately approved, must:

- remain in-memory only unless a separate DB-backed Nashir persistence gate is approved;
- derive `workspaceId` from the route path only;
- derive `nashirCampaignId` from the route path only;
- use `authGuard`;
- use `nonDisclosingMembershipCheck`;
- use the approved permission strategy;
- preserve existing list, read-by-id, create, and readiness route behavior;
- avoid adding approval, publishing, scoring persistence, update/delete, UI, generated-client, SQL, migration, package, workflow, or script behavior.

## OpenAPI

No OpenAPI YAML change is approved in this PR.

A future evidence route implementation must define or be preceded by an approved OpenAPI change covering:

- path;
- method;
- `operationId`;
- `x-permission`;
- request schema where applicable;
- response schema;
- `ErrorResponse`;
- audit extension where applicable.

Generated clients remain NO-GO unless separately approved.

## Future Implementation Test Requirements

A future implementation PR must add focused tests proving, where applicable:

- authorized actor can list evidence;
- authorized actor can submit evidence;
- missing membership returns `404`;
- unknown workspace returns `404`;
- cross-workspace campaign access returns `404`;
- valid active member without the required permission returns `403`;
- body `workspace_id` cannot override route workspace;
- evidence submission does not approve content;
- evidence submission does not authorize publishing;
- evidence submission creates the approved audit event if submit route is implemented;
- readiness route behavior remains unchanged;
- list route behavior remains unchanged;
- read-by-id route behavior remains unchanged;
- create route behavior remains unchanged;
- approval, publishing, and scoring mutation/persistence routes remain unregistered.

Future tests must not require DB-backed persistence unless a separate DB gate approves it.

## Explicit NO-GO

The following remain NO-GO in this PR:

- implementation;
- runtime changes;
- test changes;
- SQL/schema/migration changes;
- DB-backed Nashir persistence;
- OpenAPI YAML changes;
- RBAC expansion;
- approval routes/transitions;
- publishing workflows;
- scoring persistence;
- UI;
- generated clients;
- package/workflow/script changes;
- Sprint 5;
- Pilot;
- Production.

## GO / NO-GO Decision

GO: Documentation-only evidence route gate.

GO: Future consideration of narrowly scoped Nashir evidence routes only after a separately approved implementation scope defines exact route, permission, audit, version, self-review, OpenAPI, ErrorModel, and verification requirements.

NO-GO: Evidence route implementation, SQL/schema/migration changes, DB-backed persistence, OpenAPI YAML changes, RBAC expansion, approval routes/transitions, publishing workflows, scoring persistence, UI, generated clients, package/workflow/script changes, Sprint 5, Pilot, or Production in this PR.
