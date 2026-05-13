# Nashir Readiness Route Contract Gate

## Purpose

This is a documentation-only route, response, and OpenAPI contract gate for a future Nashir readiness route.

This PR does not implement runtime behavior, modify tests, change SQL, change OpenAPI YAML, expand RBAC, update generated clients, add UI, or approve Sprint 5, Pilot, or Production readiness.

## Task Classification

Documentation-only route contract gate.

## Approved Sources Used

- `AGENTS.md`
- `README.md`
- `docs/17_change_log.md`
- `docs/03_decision_log.md`
- `docs/nashir_readiness_scoring_route_gate.md`
- `docs/nashir_campaign_readiness_scoring_contract.md`
- `docs/nashir_status_after_create_route.md`
- `docs/nashir_openapi_patch.yaml`
- `src/router.js`
- `src/nashir/backend-slice0-service.js`
- `src/nashir/backend-slice0-repository.js`
- `test/nashir-route.test.js`
- `test/nashir-prewiring-contract.test.js`

No approved source conflict was identified.

## Current State

No Nashir readiness route is currently implemented.

The currently implemented in-memory Nashir routes remain:

```text
GET /workspaces/{workspaceId}/nashir-campaigns
GET /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}
POST /workspaces/{workspaceId}/nashir-campaigns
```

The current OpenAPI patch does not expose a readiness route, and this PR does not modify OpenAPI YAML.

## Adopted Future Route

This gate adopts the future route path recommended by `docs/nashir_readiness_scoring_route_gate.md`:

```text
GET /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/readiness
```

This route may be considered in a future implementation PR only after the future PR explicitly scopes runtime, tests, and OpenAPI impact.

## Route Classification

The future route must be:

- read-only;
- advisory only;
- in-memory only;
- non-mutating;
- non-persistent;
- no approval;
- no evidence;
- no publishing;
- no external integration;
- no autonomous AI runtime.

The route must not create, update, or delete Nashir campaign records. It must not persist readiness snapshots or scoring records.

## Permission

The future route must use the existing permission:

```text
nashir.campaign.read
```

No RBAC expansion is approved. If a future scope determines that a separate readiness permission is required, implementation remains NO-GO until a separate RBAC gate approves that permission and role mapping.

## Tenant And Security Behavior

A future implementation must preserve the existing Nashir non-disclosure pattern:

- call `authGuard`;
- use `nonDisclosingMembershipCheck`;
- derive `workspaceId` from the route path only;
- derive `nashirCampaignId` from the route path only;
- return non-disclosing `404` for missing active membership;
- return non-disclosing `404` for unknown workspace;
- return non-disclosing `404` for unknown or cross-workspace campaign access;
- return `403` for a valid active member without `nashir.campaign.read`;
- avoid trusting request body `workspace_id`;
- preserve existing list, read-by-id, and create behavior.

## Candidate Response Contract

The future response shape should be:

```json
{
  "data": {
    "nashir_campaign_id": "nashir-campaign-1",
    "workspace_id": "workspace-a",
    "readiness_level": "pass",
    "gate_state": "advisory_only",
    "blockers": [],
    "warnings": [],
    "missing_fields": [],
    "explanations": [],
    "evaluated_at": "2026-05-13T00:00:00.000Z"
  }
}
```

Field requirements:

| Field | Requirement |
|---|---|
| `nashir_campaign_id` | Route-derived campaign identifier for the evaluated campaign. |
| `workspace_id` | Route-derived workspace identifier. |
| `readiness_level` | One of the allowed readiness values below. |
| `gate_state` | One of the allowed gate state values below. |
| `blockers` | Array of advisory or operational blockers. |
| `warnings` | Array of advisory warnings. |
| `missing_fields` | Array of missing field identifiers or descriptions. |
| `explanations` | Array of human-readable explanation objects or strings, as finalized by the future implementation scope. |
| `evaluated_at` | Runtime evaluation timestamp. It must not imply persisted score history. |

## Readiness Level Values

Allowed `readiness_level` values:

- `pass`;
- `soft_pass`;
- `fail`;
- `blocked_until_review`.

These values are advisory route output values only. They do not approve content, authorize publishing, or create evidence.

## Gate State Values

Allowed `gate_state` values:

- `advisory_only`;
- `blocked_until_review`;
- `ready_for_human_review`.

`gate_state` must not authorize publishing. `ready_for_human_review` may only mean the campaign can be reviewed by a human in a separately approved workflow; it must not mark content as approved.

## Advisory Boundaries

Readiness output must preserve these boundaries:

- `readiness_level` does not approve content;
- `gate_state` does not authorize publishing;
- blockers are advisory or operational only;
- warnings are advisory or operational only;
- missing fields are advisory or operational only;
- explanations must not be represented as legal, compliance, approval, publishing, or evidence decisions.

## Audit Decision

No audit event is required for the first future read-only readiness route.

If a future implementation scope requires audit for readiness reads, it needs a separate explicit audit decision before implementation. Any future audit event name must follow the reconciled Nashir runtime/OpenAPI convention after PR #195.

No audit implementation is approved in this PR.

## Future OpenAPI Requirements

A future implementation must update `docs/nashir_openapi_patch.yaml` in the same implementation PR or in a preceding OpenAPI PR.

The future OpenAPI change must define:

- path: `/workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/readiness`;
- method: `GET`;
- `operationId`;
- `x-permission: nashir.campaign.read`;
- response schema for the candidate response contract;
- `ErrorResponse` handling;
- no generated clients.

This PR does not modify OpenAPI YAML.

## Future Implementation Candidate Allowed Files

This PR does not approve implementation. A future implementation PR may be considered only with explicit scope, likely limited to:

- `src/router.js`;
- `src/nashir/backend-slice0-service.js`;
- `src/nashir/backend-slice0-repository.js` only if needed;
- `test/nashir-route.test.js`;
- `test/nashir-prewiring-contract.test.js`;
- `test/nashir-openapi-contract.test.js` if OpenAPI is changed or added;
- `docs/nashir_readiness_route_implementation_report.md`;
- `docs/03_decision_log.md`;
- `docs/17_change_log.md`;
- `docs/nashir_openapi_patch.yaml` only if explicitly in scope.

## Future Implementation Acceptance Criteria

A future implementation PR must prove:

- authorized active member can read readiness;
- missing active membership returns non-disclosing `404`;
- unknown workspace returns non-disclosing `404`;
- unknown or cross-workspace campaign returns non-disclosing `404`;
- valid active member without `nashir.campaign.read` returns `403`;
- response shape is `{ data: readiness }`;
- response includes the required readiness fields;
- readiness output is read-only and does not mutate the campaign;
- readiness output is non-persistent;
- no audit event is emitted unless separately approved;
- existing list, read-by-id, and create behavior remains unchanged;
- evidence, approval, publishing, update, delete, and scoring-persistence routes remain unregistered.

## Explicit NO-GO

The following remain NO-GO in this PR:

- implementation;
- runtime changes;
- test changes;
- SQL/schema/migration changes;
- DB persistence;
- RBAC expansion;
- OpenAPI YAML changes;
- evidence routes;
- approval routes/transitions;
- publishing;
- scoring persistence;
- UI;
- generated clients;
- package/workflow/script changes;
- autonomous AI runtime;
- Sprint 5;
- Pilot;
- Production.

## GO / NO-GO Decision

GO: Documentation-only route/response/OpenAPI contract gate for the future Nashir readiness route.

GO: Future implementation may be considered only for `GET /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/readiness` after a separate implementation request explicitly scopes runtime, tests, and OpenAPI impact.

NO-GO: Runtime, tests, SQL, OpenAPI YAML, RBAC, DB persistence, evidence, approval, publishing, scoring persistence, UI, generated-client, package/workflow/script, autonomous AI runtime, Sprint 5, Pilot, or Production changes in this PR.
