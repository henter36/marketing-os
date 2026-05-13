# Nashir Status After Create Route

## Purpose

This document is a documentation-only post-merge status reconciliation after PR #191:

```text
feat: wire Nashir create route
```

This status record does not implement runtime behavior, modify tests, change SQL, change OpenAPI YAML, expand RBAC, update generated clients, add UI, or approve Sprint 5, Pilot, or Production readiness.

## Task Classification

Documentation-only / post-merge status reconciliation.

## Approved Sources Used

- `AGENTS.md`
- `README.md`
- `docs/17_change_log.md`
- `docs/03_decision_log.md`
- `docs/nashir_create_route_implementation_report.md`
- `docs/nashir_create_route_implementation_gate.md`
- `docs/nashir_create_route_preimplementation_constraints.md`
- `docs/nashir_status_after_list_route.md`
- `docs/nashir_openapi_patch.yaml`
- `src/router.js`
- `src/nashir/backend-slice0-service.js`
- `src/nashir/backend-slice0-repository.js`
- `test/nashir-route.test.js`
- `test/nashir-prewiring-contract.test.js`
- `test/nashir-service-repository-read-path.test.js`

No approved source conflict was identified.

## Current Implemented Nashir Routes

After PR #191, the implemented Nashir routes are:

```text
GET /workspaces/{workspaceId}/nashir-campaigns
GET /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}
POST /workspaces/{workspaceId}/nashir-campaigns
```

The create route is the only Nashir write route currently implemented.

## Create Route Behavior Confirmed

`POST /workspaces/{workspaceId}/nashir-campaigns` is implemented as an in-memory-only create route.

Confirmed behavior:

- derives `workspaceId` from the route path only;
- does not trust body `workspace_id`;
- rejects body `workspace_id` override through existing tenant-context handling;
- requires `campaign_name`;
- uses `nashir.campaign.write`;
- uses non-disclosing active membership lookup;
- returns `404` for missing active membership;
- returns `404` for unknown workspace;
- returns `403` for a valid active member without `nashir.campaign.write`;
- creates a draft Nashir campaign;
- writes only to in-memory `store.nashirCampaigns`;
- returns `201` with `{ data: campaign }`;
- treats duplicate valid submissions as non-idempotent, so each valid POST may create a separate campaign record;
- checks generated `nashir_campaign_id` collisions and regenerates a non-colliding ID;
- emits runtime audit event `nashir_campaign.created`;
- uses entity type `NashirCampaign`;
- records before payload as `null` and after payload as the created campaign representation.

The route includes a defensive failure path if `NashirSlice0Service.createCampaign(...)` returns no campaign.

## Preserved Read Behavior

The following routes remain read-only:

```text
GET /workspaces/{workspaceId}/nashir-campaigns
GET /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}
```

Confirmed read behavior:

- both routes use `nashir.campaign.read`;
- both derive workspace context from the route;
- missing active membership returns non-disclosing `404`;
- unknown workspace returns non-disclosing `404`;
- unknown or cross-workspace read-by-id access returns non-disclosing `404`;
- valid active member without `nashir.campaign.read` returns `403`;
- list route returns `{ data: [...] }`;
- read-by-id route returns `{ data: campaign }`.

## Remaining NO-GO

The following remain NO-GO:

- evidence routes;
- approval transitions/routes;
- scoring/readiness routes;
- publishing workflows;
- update/delete routes;
- DB-backed Nashir persistence;
- SQL/schema/migration changes;
- OpenAPI YAML changes;
- RBAC expansion;
- frontend/UI;
- generated clients;
- package/workflow/script changes;
- Sprint 5;
- Pilot;
- Production.

## Known Divergence / Follow-Up

Runtime audit naming and OpenAPI audit naming currently diverge:

- Runtime emits `nashir_campaign.created`.
- `docs/nashir_openapi_patch.yaml` currently declares `x-audit-event: nashir.campaign.created`.
- PR #191 intentionally did not modify OpenAPI YAML.

Future implementation must not silently ignore this divergence. A separate OpenAPI/audit naming reconciliation gate is required before changing OpenAPI YAML, generated clients, or related audit contract surfaces.

## Follow-Up Candidates

- Issue #187: refactor non-disclosing membership lookup into a reusable guard.
- Issue #183: refactor OpenAPI lint combined-spec helpers.
- Optional future gate: OpenAPI/audit naming reconciliation.
- Optional future gate: evidence route planning.
- Optional future gate: readiness/scoring route planning.
- Optional future gate: approval route planning.

## Recommendation

The next best step after this status PR should be either:

```text
Issue #187 guard refactor
```

or:

```text
docs-only OpenAPI/audit naming reconciliation gate
```

Do not proceed directly to evidence, approval, or scoring implementation. Each of those areas still requires a separate documentation gate before implementation can be considered.

## GO / NO-GO Recommendation

GO for opening a documentation-only post-merge status reconciliation PR limited to:

```text
docs/nashir_status_after_create_route.md
docs/17_change_log.md
```

NO-GO for runtime, tests, SQL, OpenAPI YAML, RBAC, generated clients, UI, package/workflow/script changes, migrations, evidence, approval, scoring/readiness, publishing, update/delete routes, Sprint 5, Pilot, or Production changes in this PR.
