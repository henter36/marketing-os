# Nashir Campaign DB Persistence Gate

## 1. Current Verified Status

- Nashir evidence DB persistence exists and is explicitly gated by `NASHIR_EVIDENCE_RUNTIME_MODE`.
- Nashir campaign runtime remains in-memory.
- Evidence may be DB-backed while campaigns remain in-memory only as a transitional hybrid state.
- No campaign DB persistence is currently approved.

## 2. Future Implementation Candidate

A future separately approved implementation PR may add DB persistence for Nashir campaigns.

Candidate table:

```text
nashir_campaigns
```

Candidate repository:

```text
NashirCampaignRepository
```

An equivalent repository name is acceptable if it preserves the existing router -> service -> repository layering and tenant isolation.

Candidate runtime mode:

```text
NASHIR_CAMPAIGN_RUNTIME_MODE
```

Allowed values:

```text
in_memory
repository
```

Default:

```text
in_memory
```

`DATABASE_URL` alone must not activate campaign repository mode. `repository` mode must be explicit and must fail closed if required DB configuration, an existing pool, or an approved injected repository set is missing.

## 3. Candidate Route Scope

Future campaign DB persistence may cover only these existing Nashir campaign routes:

- `GET /workspaces/{workspaceId}/nashir-campaigns`
- `POST /workspaces/{workspaceId}/nashir-campaigns`
- `GET /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}`

This gate does not approve campaign update/delete routes. It does not approve approval flow, publishing flow, scoring mutation, or lifecycle expansion.

## 4. Relationship to Evidence

- Future campaign DB persistence must preserve workspace isolation.
- Evidence routes must not expose evidence for missing or cross-workspace campaigns.
- If campaigns become DB-backed, evidence checks must use the approved campaign source consistently.
- Do not introduce foreign key assumptions unless SQL is explicitly approved in a later implementation PR.

## 5. Future Allowed Files

Future implementation scope may include:

- A docs SQL schema patch file for `nashir_campaigns`, if implementation is later approved.
- `scripts/db-migrate.js`, only in a later migration activation PR.
- `src/router.js`.
- `src/config.js`.
- `src/repositories/` campaign repository file.
- `src/nashir/backend-slice0-service.js` or equivalent service layer.
- Route, config, repository, or integration tests directly relevant to campaign DB persistence.
- `docs/07_database_schema.sql`, if needed to reconcile migration order.

## 6. Future Forbidden Scope

- `ui/`.
- `prototype/`.
- OpenAPI YAML unless separately gated.
- Generated clients.
- Package changes.
- Approval flow.
- Publishing flow.
- Readiness scoring changes.
- Campaign update/delete routes.
- Broader lifecycle transitions.
- MVP, Pilot, or Production readiness claims.

## 7. Required Future Tests

- Default campaign runtime remains `in_memory`.
- `DATABASE_URL` alone does not activate campaign repository mode.
- `repository` mode requires explicit `NASHIR_CAMPAIGN_RUNTIME_MODE=repository`.
- Invalid campaign runtime mode fails closed.
- `repository` mode fails closed without `DATABASE_URL`, pool, repositories, or approved injected repository.
- Create/list/read campaign work in `repository` mode.
- Workspace isolation is preserved.
- Unknown workspace returns non-disclosing `404`.
- Missing membership returns non-disclosing `404`.
- User without `nashir.campaign.read` gets `403` for `GET` routes.
- User without `nashir.campaign.write` gets `403` for `POST` route.
- Evidence routes remain non-disclosing for missing or cross-workspace campaigns.
- Existing in-memory behavior remains unchanged.

## 8. Required Future Verification

```text
git diff --check
npm test
npm run db:migrate:strict
npm run db:migrate:retry
npm run openapi:lint:strict
```

## 9. GO / NO-GO

```text
GO:    This PR defines a future Nashir campaign DB persistence path.
NO-GO: This PR implements runtime, SQL, migrations, OpenAPI, UI, or generated clients.
NO-GO: This PR claims MVP, Pilot, or Production readiness.
```
