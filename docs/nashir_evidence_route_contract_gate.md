# Nashir Evidence Route Contract Gate

## Purpose

This is a documentation-only route/response/OpenAPI contract gate for possible future Nashir evidence routes after PR #200. It does not implement evidence routes, modify runtime behavior, update tests, change OpenAPI YAML, expand RBAC, add SQL/schema/migrations, update generated clients, or change package, workflow, script, prototype, or UI files.

## Current State

No Nashir evidence route is currently implemented.

Currently implemented Nashir routes are:

- `GET /workspaces/{workspaceId}/nashir-campaigns`
- `GET /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}`
- `POST /workspaces/{workspaceId}/nashir-campaigns`
- `GET /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/readiness`

Readiness remains read-only, advisory, in-memory, non-persistent, non-mutating, and does not approve content, authorize publishing, create evidence, update evidence, trigger approval transitions, or persist scoring output.

## Future Route Candidates

This gate adopts these candidate route paths for future consideration only:

- `GET /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/evidence`
- `POST /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/evidence`

These candidates are not approved for implementation by this PR.

## Recommended Sequencing

The lowest-risk sequence is:

1. Implement a read-only evidence list route first, if a future implementation PR is separately approved.
2. Consider a submit evidence route only after submit payload, audit payload, version binding, content-hash behavior, and self-review/four-eyes constraints are fully resolved.

Approval, publishing, review, acceptance, invalidation, and supersession routes remain out of scope for this gate.

## Evidence Definition

Evidence is proof only.

Evidence is not:

- approval;
- publishing authorization;
- analytics proof;
- attribution proof;
- performance proof.

Evidence must be tied to route-derived `workspaceId` and route-derived `nashirCampaignId`. Future version-aware implementations must bind evidence to the correct content version through `version_ref`, `content_hash`, or another separately approved version contract.

## Permission Strategy

This PR does not invent or add any RBAC permission.

Candidate read permission:

- Use existing `nashir.campaign.read` only if the returned evidence data is safe for all campaign readers.
- If evidence read requires a separate evidence-specific permission, implementation remains NO-GO until a separate RBAC gate approves that permission.

Candidate submit permission:

- Use existing `nashir.evidence.submit` only if the future submit implementation remains aligned with current RBAC.

No RBAC expansion is authorized by this PR.

## Candidate Read Response

The candidate `GET /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/evidence` response shape is:

```json
{
  "data": [
    {
      "evidence_id": "evidence_123",
      "workspace_id": "workspace_123",
      "nashir_campaign_id": "nashir_campaign_123",
      "evidence_status": "submitted",
      "evidence_type": "url",
      "evidence_url": "https://example.com/evidence",
      "evidence_note": "Manual proof note",
      "submitted_by_user_id": "user_123",
      "submitted_at": "2026-05-13T00:00:00.000Z",
      "reviewed_by_user_id": null,
      "reviewed_at": null,
      "version_ref": "content_version_123",
      "content_hash": "sha256:example",
      "created_at": "2026-05-13T00:00:00.000Z",
      "updated_at": "2026-05-13T00:00:00.000Z"
    }
  ]
}
```

The response must not allow request-body or query-string workspace/campaign values to override route-derived `workspaceId` or `nashirCampaignId`.

## Candidate Submit Request

The candidate `POST /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/evidence` request body is:

```json
{
  "evidence_type": "url",
  "evidence_url": "https://example.com/evidence",
  "evidence_note": "Manual proof note",
  "version_ref": "content_version_123",
  "content_hash": "sha256:example"
}
```

The request body must not include trusted `workspace_id` or `nashir_campaign_id` fields. Future implementation must derive workspace and campaign identity only from the route.

## Evidence Status Values

Candidate `evidence_status` values are:

- `submitted`
- `accepted`
- `correction_requested`
- `superseded`
- `invalidated`

## Evidence Type Values

Candidate `evidence_type` values are:

- `url`
- `screenshot_ref`
- `manual_note`
- `external_reference`

## Status Semantics

- `submitted` does not mean accepted.
- `accepted` does not authorize publishing.
- `correction_requested` does not delete prior evidence.
- `superseded` preserves history.
- `invalidated` requires a reason in a future review workflow.

Acceptance, correction requests, supersession, invalidation, and review workflows are not approved by this gate.

## Self-Review And Four-Eyes

The submitter must not accept, invalidate, supersede, or review their own submitted evidence unless a future approved policy explicitly allows it.

A future submit route must store `submitted_by_user_id` from the authenticated actor. Future review and acceptance routes are not approved by this gate.

## Audit Requirements

Future `POST` evidence submission must be audited.

Candidate submit audit event:

- `nashir_evidence.submitted`

Future review-related audit events remain separate candidates:

- `nashir_evidence.reviewed`
- `nashir_evidence.invalidated`
- `nashir_evidence.superseded`

The exact audit payload must include route-derived `workspaceId`, route-derived `nashirCampaignId`, actor, evidence id, status, `version_ref` and `content_hash` where applicable, and before/after values where applicable.

No audit implementation is authorized by this PR.

## ErrorModel And Denial Behavior

- Authentication failures use existing auth behavior.
- Missing membership, unknown workspace, and cross-workspace campaign access return non-disclosing `404`.
- A valid member without the required permission returns `403`.
- Invalid evidence payload returns a validation error using existing ErrorModel conventions.
- Wrong version or content-hash conflict requires a future explicit ErrorModel/status-code mapping before implementation.

## Runtime Constraints

Any future evidence route implementation must:

- remain in-memory only unless a DB-backed Nashir persistence gate is separately approved;
- use route-derived `workspaceId` only;
- use route-derived `nashirCampaignId` only;
- use `authGuard`;
- use `nonDisclosingMembershipCheck`;
- preserve existing Nashir list, read-by-id, create, and readiness route behavior.

## Future OpenAPI Requirements

This PR does not modify OpenAPI YAML.

A future implementation PR must add OpenAPI paths, `operationId` values, `x-permission`, request schemas, response schemas, default `ErrorResponse`, and audit extension metadata where applicable.

Generated clients remain NO-GO.

## Future Implementation Candidate Allowed Files

If a future implementation PR is separately approved, candidate allowed files may include only:

- `src/router.js`
- `src/nashir/backend-slice0-service.js`
- `src/nashir/backend-slice0-repository.js` if needed
- `docs/nashir_openapi_patch.yaml` if explicitly in future scope
- `test/nashir-route.test.js`
- `test/nashir-prewiring-contract.test.js`
- `test/nashir-openapi-contract.test.js` if OpenAPI is changed
- `docs/nashir_evidence_route_implementation_report.md`
- `docs/03_decision_log.md`
- `docs/17_change_log.md`

This list is not implementation approval.

## Explicit NO-GO

The following remain NO-GO:

- implementation in this PR;
- SQL/schema/migrations;
- DB-backed persistence;
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

## Decision

GO for documentation-only route/response/OpenAPI contract gating.

NO-GO for evidence route implementation, OpenAPI YAML edits, RBAC expansion, SQL/schema/migration changes, generated clients, UI, package/workflow/script changes, Sprint 5, Pilot, and Production.
