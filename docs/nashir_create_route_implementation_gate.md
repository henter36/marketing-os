# Nashir Create Route Implementation Gate

## 1. Status

```text
Task classification:                 Documentation-only governance gate.
Candidate route:                     POST /workspaces/{workspaceId}/nashir-campaigns
Gate decision:                        CONDITIONAL GO for a future implementation PR only after unresolved constraints are resolved.
Implementation in this PR:            NO-GO.
Runtime changes:                      NO-GO.
Tests:                                NO-GO.
OpenAPI YAML changes:                 NO-GO unless separately gated.
SQL/schema/migration changes:         NO-GO.
RBAC expansion:                       NO-GO unless separately gated.
DB-backed Nashir persistence:         NO-GO.
Evidence routes:                      NO-GO.
Approval transitions:                 NO-GO.
Scoring/readiness:                    NO-GO.
Publishing workflow:                  NO-GO.
Frontend/UI work:                     NO-GO.
Sprint 5:                             NO-GO.
Pilot:                                NO-GO.
Production:                           NO-GO.
```

## 2. Purpose

This document is a documentation-only implementation gate for the next candidate Nashir route:

```text
POST /workspaces/{workspaceId}/nashir-campaigns
```

This gate does not implement the route, modify runtime code, modify tests, change OpenAPI YAML, change SQL, add RBAC permissions, alter `src/store.js`, update generated clients, or approve any DB-backed persistence.

## 3. Approved Sources Used

- `AGENTS.md`
- `README.md`
- `docs/17_change_log.md`
- `docs/03_decision_log.md`
- `docs/nashir_status_after_list_route.md`
- `docs/nashir_read_route_wiring_gate.md`
- `docs/nashir_list_route_gate.md`
- `docs/nashir_list_route_implementation_report.md`

No approved source conflict was identified.

## 4. Current Baseline After PR #188

The current Nashir runtime baseline is read-only:

```text
GET /workspaces/{workspaceId}/nashir-campaigns
GET /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}
```

Both routes are implemented and read-only.

Both routes use:

- `workspaceContextGuard`
- `authGuard`
- non-disclosing active membership lookup
- `permissionGuard` with `nashir.campaign.read`
- `NashirSlice0Service`
- `NashirSlice0Repository`

Current response and denial behavior:

- Missing active membership returns `404`.
- Unknown workspace returns `404`.
- Cross-workspace campaign access returns `404`.
- Valid active member without `nashir.campaign.read` returns `403`.
- List route returns `{ data: [...] }`.
- Read-by-id route returns `{ data: campaign }`.

No create, write, evidence, approval, scoring/readiness, publishing, DB-backed persistence, SQL, OpenAPI YAML, RBAC expansion, UI, Pilot, or Production scope is currently approved.

## 5. Candidate Route Scope

Candidate future route:

```text
POST /workspaces/{workspaceId}/nashir-campaigns
```

The route may be considered only as a narrowly scoped, in-memory create route over the existing `store.nashirCampaigns` collection unless a separate DB/SQL gate is approved first.

This candidate route does not include:

- update behavior
- delete behavior
- evidence behavior
- approval transitions
- scoring/readiness behavior
- publishing workflow behavior
- frontend/UI behavior
- DB-backed persistence

## 6. Required Constraints Before Implementation

Before any implementation PR may open, all of the following constraints must be resolved in the implementation request or a preceding approved gate:

1. **Permission strategy** - The create permission must be approved. Do not invent a new permission in this docs-only PR. Implementation is NO-GO until either an already-authorized existing permission is documented for create or a separate RBAC gate approves a new create permission.
2. **Idempotency strategy** - Create route implementation is blocked until duplicate submission behavior is specified. This includes whether duplicate requests are rejected, treated as idempotent replays, or handled through an approved idempotency key contract. Do not implement idempotency in this PR.
3. **Audit behavior** - Create-route audit behavior must be specified before or during implementation scope approval. The event name, actor, entity, before/after payload expectations, and failure/non-write cases must be documented. Do not implement audit in this PR.
4. **ErrorModel mapping** - Future implementation must use existing ErrorModel conventions and must not leak workspace existence, internal state, stack traces, SQL details, or configuration details.
5. **Tenant isolation** - The route must derive `workspaceId` from the URL path only and must never trust `workspace_id` from a request body.
6. **In-memory-only runtime** - The route must remain in-memory only unless a separate DB/SQL gate is approved.
7. **No OpenAPI YAML change unless separately gated** - If the implementation requires OpenAPI YAML modification, stop and open a separate OpenAPI gate.
8. **No RBAC expansion unless separately gated** - If the implementation requires a new or expanded permission, stop and open a separate RBAC gate.

## 7. Proposed Future Behavior

If the constraints in Section 6 are resolved and a future implementation PR is separately approved, the create route should behave as follows:

- Accept authenticated requests only.
- Derive `workspaceId` from the URL path only.
- Use the same non-disclosing active membership lookup pattern as the approved Nashir GET routes.
- Return `404` for unknown workspace or missing active membership.
- Return `403` for a valid active member lacking the approved create permission.
- Reject or ignore any body `workspace_id` according to the approved tenant-isolation rule; it must not override the route workspace.
- Create an in-memory Nashir campaign scoped to the route-derived `workspaceId`.
- Generate a `nashir_campaign_id` that does not collide with existing in-memory `store.nashirCampaigns`.
- Return `201` on successful create.
- Use the same Nashir campaign representation pattern already used by list/read routes where applicable.
- Preserve existing read-only list and read-by-id behavior.
- Preserve non-disclosure for unknown, missing-membership, and cross-workspace cases.

The future implementation must not add evidence, approval, scoring/readiness, publishing, DB, SQL, OpenAPI YAML, RBAC expansion, generated client, frontend/UI, package, workflow, migration, script, Pilot, or Production scope.

## 8. Future Allowed Files - Candidate Only

This section is planning guidance for a future implementation PR. It is not approval to edit these files in this documentation-only PR.

Candidate future implementation files may include only the minimum needed subset, to be confirmed by the future implementation request:

| File | Candidate future change |
|---|---|
| `src/router.js` | Register only `POST /workspaces/{workspaceId}/nashir-campaigns` with approved non-disclosing guard flow |
| `src/nashir/backend-slice0-service.js` | Add minimal create method only if explicitly approved |
| `src/nashir/backend-slice0-repository.js` | Add minimal in-memory save/create method only if explicitly approved |
| `test/nashir-route.test.js` | Add focused create route tests |
| `test/nashir-service-repository-read-path.test.js` or a new focused test file | Add focused create service/repository tests only if explicitly approved |
| `docs/nashir_create_route_implementation_report.md` | New implementation report |
| `docs/03_decision_log.md` | Add implementation decision if scope status changes |
| `docs/17_change_log.md` | Add implementation change-log entry |

The future implementation request must restate allowed files explicitly. This gate alone is not sufficient authorization to edit runtime or test files.

## 9. Forbidden Scope

The following remain NO-GO for the future create route unless separately gated:

- SQL/schema/migration changes
- DB-backed Nashir persistence
- OpenAPI YAML changes
- RBAC expansion
- evidence routes or evidence write behavior
- approval routes or approval transitions
- scoring/readiness routes or runtime scoring
- publishing routes/workflows
- frontend/UI work
- generated clients
- package or workflow changes
- scripts
- prototype changes
- Sprint 5 approval
- Pilot readiness
- Production readiness

## 10. Acceptance Criteria For A Future Implementation PR

A future implementation PR is GO only if all of the following are true:

1. This gate is merged.
2. The create permission strategy is explicitly approved.
3. Idempotency and duplicate submission behavior are explicitly specified.
4. Audit behavior is explicitly specified.
5. ErrorModel mappings are documented.
6. Allowed and forbidden files are explicitly listed in the implementation request.
7. The route remains in-memory only unless a separate DB/SQL gate is approved.
8. No SQL/schema/migration file is modified.
9. No OpenAPI YAML file is modified unless a separate OpenAPI gate is approved.
10. No RBAC file is modified unless a separate RBAC gate is approved.
11. Existing read-only list and read-by-id route behavior is preserved.
12. Create returns `201` only after route-derived workspace context, authentication, active membership, approved create permission, idempotency/duplicate rules, and validation pass.
13. Unknown workspace, missing active membership, and cross-workspace access remain non-disclosing.

## 11. Required Tests For A Future Implementation PR

The future implementation PR must include focused tests proving:

- authenticated member with approved create permission can create a Nashir campaign and receives `201`;
- created entity is scoped to the route-derived `workspaceId`;
- generated `nashir_campaign_id` does not collide with existing `store.nashirCampaigns`;
- body `workspace_id` cannot override route-derived workspace context;
- unknown workspace returns `404`;
- missing active membership returns `404`;
- valid active member without approved create permission returns `403`;
- duplicate submission behavior matches the approved idempotency strategy;
- audit behavior matches the approved audit strategy;
- list/read-by-id routes still behave as currently documented;
- evidence, approval, scoring/readiness, and publishing routes remain unregistered;
- no DB, SQL, OpenAPI YAML, generated client, package, workflow, migration, script, prototype, or frontend/UI behavior is introduced.

## 12. GO / NO-GO Decision

```text
GO:     Documentation-only create route implementation gate.
GO:     Future narrowly scoped implementation PR may be considered after this gate is merged.
GO:     Future implementation may target POST /workspaces/{workspaceId}/nashir-campaigns only after permission, idempotency, audit, and ErrorModel constraints are resolved.
NO-GO:  Implementation in this PR.
NO-GO:  Create route implementation until create permission strategy is approved.
NO-GO:  Create route implementation until idempotency / duplicate submission behavior is specified.
NO-GO:  Create route implementation until audit behavior is specified.
NO-GO:  SQL/schema/migration changes.
NO-GO:  DB-backed Nashir persistence.
NO-GO:  OpenAPI YAML changes unless separately gated.
NO-GO:  RBAC expansion unless separately gated.
NO-GO:  Evidence routes.
NO-GO:  Approval transitions.
NO-GO:  Scoring/readiness.
NO-GO:  Publishing workflow.
NO-GO:  Frontend/UI work.
NO-GO:  Generated clients.
NO-GO:  Sprint 5 approval.
NO-GO:  Pilot readiness.
NO-GO:  Production readiness.
```
