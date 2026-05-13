# Nashir Create Route Implementation Report

## 1. Status

```text
Task classification:                 Narrow runtime implementation after approved documentation gates.
Implemented route:                   POST /workspaces/{workspaceId}/nashir-campaigns
Implementation basis:                PR #189 gate and PR #190 pre-implementation constraints.
Runtime scope:                       In-memory Nashir create route only.
SQL/schema/migration changes:         None.
OpenAPI YAML changes:                 None.
RBAC expansion:                       None.
DB-backed Nashir persistence:         None.
Evidence routes:                      Not implemented.
Approval transitions:                 Not implemented.
Scoring/readiness routes:             Not implemented.
Publishing workflows:                 Not implemented.
Frontend/UI:                          Not implemented.
Generated clients:                    Not modified.
Package/workflow/script changes:      None.
Sprint 5 / Pilot / Production:        NO-GO.
```

## 2. Approved Sources Used

- `AGENTS.md`
- `README.md`
- `docs/17_change_log.md`
- `docs/03_decision_log.md`
- `docs/nashir_create_route_implementation_gate.md`
- `docs/nashir_create_route_preimplementation_constraints.md`
- `docs/nashir_openapi_patch.yaml`
- `src/router.js`
- `src/rbac.js`
- `src/guards.js`
- `src/store.js`
- `src/nashir/backend-slice0-service.js`
- `src/nashir/backend-slice0-repository.js`
- `test/nashir-route.test.js`
- `test/nashir-prewiring-contract.test.js`
- `test/nashir-service-repository-read-path.test.js`

## 3. Route Implemented

Implemented only:

```text
POST /workspaces/{workspaceId}/nashir-campaigns
```

Preserved existing routes:

```text
GET /workspaces/{workspaceId}/nashir-campaigns
GET /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}
```

No evidence, approval, scoring/readiness, publishing, update, delete, UI, DB-backed, SQL, OpenAPI YAML, RBAC expansion, generated-client, package, workflow, script, migration, Sprint 5, Pilot, or Production scope was added.

## 4. Guard And Permission Flow

The create route uses the existing Nashir non-disclosing flow:

1. Match only the approved Nashir campaign collection route.
2. Call `authGuard(req, store)`.
3. Derive `workspaceId` from the URL path.
4. Perform an active membership lookup against `store.memberships`.
5. Return `404` when active membership is missing, including unknown workspace access.
6. Call `permissionGuard(membership, "nashir.campaign.write")`.
7. Return `403` for valid active members lacking `nashir.campaign.write`.

The implementation does not call `membershipCheck` for the Nashir route because that helper returns `403` for missing membership and would disclose tenant membership state.

## 5. Request And Creation Behavior

Request behavior:

- `campaign_name` is required.
- `workspace_id` from the request body is not trusted.
- A conflicting body `workspace_id` is rejected through existing `rejectBodyWorkspaceId` behavior.
- Unsupported extra fields are rejected through existing validation conventions.

Creation behavior:

- Writes only to in-memory `store.nashirCampaigns`.
- Sets `workspace_id` from the route.
- Sets `campaign_status` to `draft`.
- Sets `created_by_user_id` from the authenticated user.
- Sets `created_at` and `updated_at`.
- Returns `{ data: campaign }` with HTTP `201`.

## 6. ID And Duplicate Submission Behavior

The repository creates a generated `nashir_campaign_id` using the existing collection length as the starting candidate, then checks existing `store.nashirCampaigns` IDs and regenerates until it finds a non-colliding ID.

Duplicate valid submissions are intentionally non-idempotent for this first narrow in-memory route. Each valid POST may create a separate campaign record. No `Idempotency-Key` support was added, and `campaign_name` is not used as a uniqueness key.

## 7. Audit Behavior

The route calls the existing in-memory audit path with:

| Field | Value |
|---|---|
| Action | `nashir_campaign.created` |
| Entity type | `NashirCampaign` |
| Entity ID | Created `nashir_campaign_id` |
| Before payload | `null` |
| After payload | Created campaign representation |

The existing audit helper was extended only to avoid reusing Patch 002 metadata for Nashir events. Nashir audit records now use metadata `{ sprint: "nashir-slice-0" }`.

Current limitation: the audit helper still uses an internal placeholder correlation ID (`nashir-slice-0-placeholder`) rather than the request correlation ID. This preserves the current in-memory audit convention and does not imply durable audit guarantees.

Runtime audit naming follows `docs/nashir_create_route_preimplementation_constraints.md` with `nashir_campaign.created`. `docs/nashir_openapi_patch.yaml` still contains `x-audit-event: nashir.campaign.created`; this PR does not modify OpenAPI YAML.

## 8. Tests Added Or Updated

Focused tests now cover:

- authorized active member with `nashir.campaign.write` receives `201`;
- created object uses route-derived `workspaceId`;
- body `workspace_id` cannot override route workspace context;
- generated `nashir_campaign_id` does not collide;
- duplicate valid POST creates separate campaign records;
- missing active membership returns `404`;
- unknown workspace returns `404`;
- valid active member without `nashir.campaign.write` returns `403`;
- `campaign_name` is required;
- create audit event is recorded;
- existing list/read-by-id behavior remains covered;
- evidence, approval, scoring/readiness, publishing, nested create, update, and delete routes remain unregistered;
- service/repository create methods write in-memory, return shallow clones, delegate correctly, and preserve inert evidence/approval/scoring methods.

## 9. Verification

Verification commands required for this PR:

```text
git diff --name-only
git diff --check
npm test
npm run verify:strict if available
npm run openapi:lint:strict if available
```

## 10. Remaining NO-GO

The following remain NO-GO:

- SQL/schema/migration changes;
- DB-backed Nashir persistence;
- OpenAPI YAML changes;
- RBAC expansion;
- evidence routes;
- approval transitions;
- scoring/readiness routes;
- publishing workflows;
- update/delete routes;
- frontend/UI;
- generated clients;
- package/workflow/script changes;
- Sprint 5;
- Pilot;
- Production.
