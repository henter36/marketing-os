# Nashir Create Route Pre-Implementation Constraints

## 1. Status

```text
Task classification:                 Documentation-only pre-implementation constraint resolution.
Candidate route:                     POST /workspaces/{workspaceId}/nashir-campaigns
Implementation in this PR:            NO-GO.
Runtime changes:                      NO-GO.
Tests:                                NO-GO.
OpenAPI YAML changes:                 NO-GO.
SQL/schema/migration changes:         NO-GO.
RBAC expansion:                       NO-GO.
DB-backed Nashir persistence:         NO-GO.
Evidence routes:                      NO-GO.
Approval transitions:                 NO-GO.
Scoring/readiness routes:             NO-GO.
Publishing workflows:                 NO-GO.
Frontend/UI work:                     NO-GO.
Sprint 5:                             NO-GO.
Pilot:                                NO-GO.
Production:                           NO-GO.
```

This document resolves the pre-implementation constraints required by `docs/nashir_create_route_implementation_gate.md` before any future implementation of:

```text
POST /workspaces/{workspaceId}/nashir-campaigns
```

This document does not implement the create route, modify runtime code, modify tests, change OpenAPI YAML, change SQL, add or rename RBAC permissions, alter `src/store.js`, update generated clients, or approve DB-backed persistence.

## 2. Approved Sources Used

- `AGENTS.md`
- `README.md`
- `docs/17_change_log.md`
- `docs/03_decision_log.md`
- `docs/nashir_create_route_implementation_gate.md`
- `docs/nashir_openapi_patch.yaml`
- `docs/nashir_audit_errormodel_material_change_specification.md`
- `docs/nashir_permission_codes_and_qa_case_specification.md`
- `src/rbac.js`
- `src/router.js`
- `src/nashir/backend-slice0-service.js`
- `src/nashir/backend-slice0-repository.js`

No approved source conflict was identified. Runtime, OpenAPI, and RBAC files were inspected only to resolve documentation constraints; they are not modified by this PR.

## 3. Current Baseline After PR #189

PR #189 merged the documentation-only create route implementation gate. The runtime baseline still implements only these Nashir routes:

```text
GET /workspaces/{workspaceId}/nashir-campaigns
GET /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}
```

Both implemented routes are read-only. They use route-derived workspace context, authentication, a non-disclosing active membership lookup, and `permissionGuard` with `nashir.campaign.read`.

Current denial behavior remains:

- missing active membership returns `404`;
- unknown workspace returns `404`;
- cross-workspace campaign access returns `404`;
- valid active member without `nashir.campaign.read` returns `403`.

`POST /workspaces/{workspaceId}/nashir-campaigns` is still not implemented.

## 4. Constraint Resolution Summary

| Constraint | Resolution |
|---|---|
| Create permission | Use existing implemented RBAC permission `nashir.campaign.write`; no RBAC expansion is approved. |
| Duplicate submissions | The first narrow in-memory create route is non-idempotent; each valid POST may create a separate campaign record. |
| Idempotency keys | NO-GO unless a separate OpenAPI/runtime idempotency gate approves a header and contract. |
| Audit behavior | Future implementation must use the existing audit path if available, with `nashir.campaign.created` and `NashirCampaign`. |
| ErrorModel behavior | Preserve existing guard conventions, non-disclosure, validation handling, and safe error output. |
| Runtime scope | Future implementation may be considered only for the in-memory create route after this gate is merged. |

## 5. Permission Strategy Resolved

The future create route must use the existing implemented RBAC permission:

```text
nashir.campaign.write
```

The future implementation must call:

```text
permissionGuard(membership, "nashir.campaign.write")
```

No new RBAC permission is approved. No RBAC permission may be renamed. No RBAC expansion is approved.

Expected future route behavior:

- authenticated request required;
- non-disclosing active membership lookup required before permission enforcement;
- missing active membership returns `404`;
- unknown workspace returns `404`;
- valid active member without `nashir.campaign.write` returns `403`;
- successful create may proceed only after membership and permission checks pass.

## 6. Idempotency And Duplicate Submission Resolved

The current OpenAPI patch does not define an `Idempotency-Key` header or request idempotency contract for this create route. Therefore, the first implementation must not claim full idempotency.

For the first narrow in-memory create route, duplicate submissions are explicitly defined as non-idempotent:

- each valid `POST /workspaces/{workspaceId}/nashir-campaigns` may create a separate campaign record;
- the implementation must prevent generated `nashir_campaign_id` collisions with existing in-memory `store.nashirCampaigns` before insertion;
- the implementation must not rely solely on collection length or append-only assumptions for ID safety;
- if a generated `nashir_campaign_id` collides, the implementation must regenerate a non-colliding ID or fail safely without writing a duplicate identifier;
- `campaign_name` must not be used as a uniqueness key unless separately approved;
- idempotency keys must not be implemented unless a separate OpenAPI/runtime idempotency gate is approved;
- the future implementation report must document this non-idempotent duplicate-submission limitation.

## 7. Audit Behavior Resolved

The future implementation must call the existing audit path if available in `src/router.js`.

Create-route audit behavior must use:

| Field | Required future value |
|---|---|
| Event name | `nashir.campaign.created` |
| Entity type | `NashirCampaign` |
| Entity ID | Generated `nashir_campaign_id` |
| Before payload | `null` |
| After payload | Created Nashir campaign representation |
| Metadata | `{ sprint: "nashir-slice-0" }` unless the future implementation gate approves a more specific Nashir metadata object |
| Correlation ID | Existing request correlation ID where available; otherwise the implementation report must explicitly document the current audit helper limitation and must not silently reuse Patch 002-specific defaults for Nashir events |

Audit behavior must not imply DB-backed persistence, durable audit guarantees, external audit infrastructure, or any guarantees beyond the current in-memory/runtime audit conventions.

## 8. ErrorModel And Tenant Behavior Resolved

Future implementation must use existing ErrorModel and guard conventions.

Required future behavior:

- authentication failures continue to use existing auth guard behavior;
- missing active membership returns non-disclosing `404`;
- unknown workspace returns non-disclosing `404`;
- cross-workspace access returns non-disclosing `404`;
- valid active member without `nashir.campaign.write` returns `403` through existing permission guard conventions;
- body `workspace_id` conflict must be rejected using existing tenant/workspace context handling;
- missing required `campaign_name` must use existing validation conventions;
- route-derived `workspaceId` is the only trusted workspace context;
- future implementation must not leak workspace existence, membership state, internal stack traces, SQL details, or configuration details.

## 9. Future Implementation Scope

After this constraint-resolution PR is merged, a future implementation PR may be considered only for:

```text
POST /workspaces/{workspaceId}/nashir-campaigns
```

Candidate implementation remains in-memory only. Candidate implementation may touch only the minimum runtime, test, and report files explicitly approved in that future PR.

This PR does not approve editing runtime files, test files, SQL files, OpenAPI YAML files, RBAC files, package files, workflow files, scripts, migrations, generated clients, prototype files, or UI files.

## 10. Explicit NO-GO

The following remain NO-GO:

- SQL/schema/migration changes;
- DB-backed Nashir persistence;
- OpenAPI YAML changes;
- RBAC expansion;
- evidence routes;
- approval transitions;
- scoring/readiness routes;
- publishing workflows;
- frontend/UI;
- generated clients;
- package/workflow/script changes;
- Sprint 5 approval;
- Pilot readiness;
- Production readiness.

## 11. GO / NO-GO Decision

```text
GO:     Documentation-only resolution of create-route pre-implementation constraints.
GO:     Future implementation PR may be considered only after this gate is merged.
GO:     Future implementation may use existing nashir.campaign.write permission.
GO:     Future implementation may define duplicate submissions as non-idempotent for this narrow in-memory route.
GO:     Future implementation may call existing audit path with nashir.campaign.created for NashirCampaign.

NO-GO:  Runtime changes in this PR.
NO-GO:  Test changes in this PR.
NO-GO:  SQL/schema/migration changes.
NO-GO:  DB-backed Nashir persistence.
NO-GO:  OpenAPI YAML changes.
NO-GO:  RBAC expansion.
NO-GO:  Idempotency-Key implementation without a separate OpenAPI/runtime idempotency gate.
NO-GO:  campaign_name uniqueness enforcement unless separately approved.
NO-GO:  Evidence routes.
NO-GO:  Approval transitions.
NO-GO:  Scoring/readiness routes.
NO-GO:  Publishing workflows.
NO-GO:  Frontend/UI.
NO-GO:  Generated clients.
NO-GO:  Package/workflow/script changes.
NO-GO:  Sprint 5.
NO-GO:  Pilot.
NO-GO:  Production.
```
