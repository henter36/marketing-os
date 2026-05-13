# Nashir Readiness / Scoring Route Gate

## Purpose

This is a documentation-only governance gate for a future Nashir readiness/scoring route.

This PR does not implement runtime behavior, modify tests, change SQL, change OpenAPI YAML, expand RBAC, update generated clients, add UI, or approve Sprint 5, Pilot, or Production readiness.

## Task Classification

Documentation-only governance gate.

## Approved Sources Used

- `AGENTS.md`
- `README.md`
- `docs/17_change_log.md`
- `docs/03_decision_log.md`
- `docs/nashir_status_after_create_route.md`
- `docs/nashir_create_route_implementation_report.md`
- `docs/nashir_campaign_readiness_scoring_contract.md`
- `docs/nashir_openapi_patch.yaml`
- `docs/nashir_openapi_audit_naming_reconciliation_report.md`
- `src/router.js`
- `src/guards.js`
- `src/nashir/backend-slice0-service.js`
- `src/nashir/backend-slice0-repository.js`
- `test/nashir-route.test.js`
- `test/nashir-prewiring-contract.test.js`

No approved source conflict was identified.

## Current Implemented Nashir Routes

The currently implemented in-memory Nashir routes are:

```text
GET /workspaces/{workspaceId}/nashir-campaigns
GET /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}
POST /workspaces/{workspaceId}/nashir-campaigns
```

No readiness/scoring route is currently implemented.

The current runtime keeps nested readiness/scoring paths unregistered. The current service still has inert readiness/scoring behavior, and the current OpenAPI patch does not expose a readiness/scoring route.

## Candidate Future Route Options

The lowest-risk future candidate is:

```text
GET /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/readiness
```

This candidate is preferred because it is read-only, advisory, campaign-scoped, and avoids implying an action that persists a score or transitions workflow state.

Alternative route naming, such as:

```text
GET /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/score-readiness
```

remains less preferred unless a future OpenAPI/route implementation scope explicitly selects it. The current tests treat this path as unregistered, so implementing it would require a separately approved route-scope and test change.

## Gate Recommendation

GO only for considering a future narrowly scoped, read-only advisory readiness route after this gate merges and after any required OpenAPI/runtime/test implementation scope is separately approved.

The recommended future slice must remain:

- read-only;
- advisory only;
- in-memory only;
- campaign-scoped;
- non-mutating;
- non-persistent for scoring output;
- separate from approval, evidence, publishing, and AI runtime execution.

NO-GO in this PR for implementation.

## Permission Strategy

This PR does not invent or approve a new RBAC permission.

For a future read-only advisory readiness route, the preferred permission is the existing implemented permission:

```text
nashir.campaign.read
```

This is justified only if the future route returns advisory readiness information derived from the readable campaign representation and does not mutate state, persist score snapshots, expose evidence, trigger approval, or authorize publishing.

If a future implementation requires a separate readiness/scoring permission, implementation remains NO-GO until a separate RBAC gate approves that permission and role mapping.

## Future Runtime Constraints

A future implementation PR, if separately approved, must:

- remain in-memory only;
- derive `workspaceId` from the URL path only;
- derive `nashirCampaignId` from the URL path only;
- use `authGuard`;
- use `nonDisclosingMembershipCheck`;
- use `permissionGuard(membership, "nashir.campaign.read")` unless a separate RBAC gate approves a different permission;
- return non-disclosing `404` for missing active membership;
- return non-disclosing `404` for unknown workspace;
- return non-disclosing `404` for unknown or cross-workspace campaign access;
- return `403` for a valid active member without the required permission;
- preserve existing list, read-by-id, and create route behavior;
- avoid trusting body `workspace_id`;
- avoid request-body based tenant context.

## Readiness / Scoring Semantics

Readiness is advisory only.

Future readiness/scoring behavior must not:

- approve content;
- authorize publishing;
- replace manual publishing evidence;
- create or update evidence;
- trigger approval transitions;
- mark content as approved;
- persist scoring snapshots unless separately approved;
- perform external integration;
- perform autonomous AI action;
- authorize spend, payment, analytics ingestion, attribution, or direct publishing.

The future response may expose advisory readiness level, gate state, warnings, blockers, missing fields, and explanations only if the future implementation scope defines the exact response contract.

## OpenAPI

No OpenAPI YAML change is approved in this PR.

A future readiness/scoring route implementation must either:

- include an explicitly approved OpenAPI YAML change in that future implementation scope; or
- be preceded by a separate OpenAPI gate that defines path, operationId, permission extension, response schema, ErrorModel behavior, and audit extension if any.

Generated clients remain NO-GO unless separately approved.

## Audit

For the recommended read-only advisory route, audit is not required for the first future implementation slice unless the future gate decides that readiness reads must be audit logged.

If audit is required by a future implementation scope, the audit event name must follow the reconciled runtime/OpenAPI convention used after PR #195, using snake_case Nashir event naming.

No audit implementation is approved in this PR.

## Future Implementation Test Requirements

A future implementation PR must add or update focused tests proving:

- authorized active member can read readiness;
- missing active membership returns non-disclosing `404`;
- unknown workspace returns non-disclosing `404`;
- unknown or cross-workspace campaign access returns non-disclosing `404`;
- valid active member without the required permission returns `403`;
- readiness is read-only and does not mutate the campaign;
- readiness does not persist scoring output unless separately approved;
- evidence, approval, scoring mutation, publishing, update, and delete routes remain unregistered;
- existing list route behavior is unchanged;
- existing read-by-id route behavior is unchanged;
- existing create route behavior is unchanged.

Future tests must not require DB-backed persistence or `DATABASE_URL`.

## Future Allowed Files

This PR does not approve implementation. If a future implementation PR is separately approved, candidate allowed files should be explicit and minimal, likely limited to:

- `src/router.js`;
- `src/nashir/backend-slice0-service.js`;
- `src/nashir/backend-slice0-repository.js` only if needed for read-only readiness derivation;
- focused Nashir route/service tests;
- an implementation report under `docs/`;
- `docs/03_decision_log.md`;
- `docs/17_change_log.md`;
- OpenAPI YAML only if explicitly approved in that future scope.

## Explicit NO-GO

The following remain NO-GO in this PR:

- implementation;
- runtime changes;
- test changes;
- SQL/schema/migration changes;
- DB-backed Nashir persistence;
- OpenAPI YAML changes;
- RBAC expansion;
- evidence routes;
- approval transitions/routes;
- publishing workflows;
- frontend/UI;
- generated clients;
- package/workflow/script changes;
- autonomous AI runtime execution;
- scoring persistence;
- Sprint 5;
- Pilot;
- Production.

## GO / NO-GO Decision

GO: Documentation-only readiness/scoring route gate.

GO: Future consideration of a narrowly scoped, read-only, advisory, in-memory readiness route, preferably `GET /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/readiness`, after separate implementation scope approval.

GO: Preferred permission for read-only advisory readiness is existing `nashir.campaign.read`, unless a future gate determines a separate RBAC permission is required.

NO-GO: Runtime, tests, SQL, OpenAPI YAML, RBAC, DB persistence, evidence, approval, publishing, generated-client, package/workflow/script, prototype, UI, Sprint 5, Pilot, or Production changes in this PR.
