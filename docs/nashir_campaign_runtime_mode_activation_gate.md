# Nashir Campaign Runtime Mode Activation Gate

## 1. Current Verified Status

- Patch 004 SQL artifact exists at `docs/marketing_os_v5_6_5_phase_0_1_schema_patch_004.sql`.
- Patch 004 is active in the effective migration order.
- The `nashir_campaigns` table is available through the schema path.
- Runtime Nashir campaigns still use in-memory Slice 0 behavior.
- No `NashirCampaignRepository` is implemented.
- No `NASHIR_CAMPAIGN_RUNTIME_MODE` exists yet.
- Nashir evidence runtime mode remains separate.

## 2. Future Runtime Mode Candidate

A future separately approved runtime PR may add an explicit Nashir campaign runtime mode:

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

`DATABASE_URL` alone must not activate campaign repository mode. `repository` mode must require `DATABASE_URL`, an existing pool, or approved injected repositories. Invalid `NASHIR_CAMPAIGN_RUNTIME_MODE` values must fail closed with a safe `ConfigurationError`.

## 3. Candidate Runtime Scope

Future campaign repository mode may cover only these existing Nashir campaign routes:

- `GET /workspaces/{workspaceId}/nashir-campaigns`
- `POST /workspaces/{workspaceId}/nashir-campaigns`
- `GET /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}`

## 4. Explicitly Out of Scope

- Campaign update/delete routes.
- Approval flow.
- Publishing flow.
- Readiness scoring changes.
- Lifecycle expansion.
- `ui/`.
- `prototype/`.
- OpenAPI YAML.
- Generated clients.
- SQL or migration changes.
- MVP, Pilot, or Production readiness claims.

## 5. Relationship to Evidence

- If campaign repository mode is enabled, evidence routes must use the approved campaign source consistently for campaign existence checks.
- Evidence routes must remain non-disclosing for missing or cross-workspace campaigns.
- `NASHIR_EVIDENCE_RUNTIME_MODE` and `NASHIR_CAMPAIGN_RUNTIME_MODE` must remain independently controlled unless a later gate explicitly changes that.
- Campaign repository mode must not implicitly activate evidence repository mode.

## 6. Future Allowed Files

Future implementation scope may include:

- `src/config.js`.
- `src/router.js`.
- `src/nashir/backend-slice0-service.js` or equivalent service layer.
- `src/repositories/nashir-campaign-repository.js` or equivalent.
- `src/repositories/index.js`.
- `test/config.test.js`.
- `test/nashir-route.test.js`.
- Directly relevant repository or integration tests.
- `docs/03_decision_log.md`.
- `docs/17_change_log.md`.

## 7. Future Forbidden Files

- SQL files.
- Migrations.
- OpenAPI YAML.
- Generated clients.
- Package files.
- Workflows unless strictly required by existing DB test execution.
- `ui/`.
- `prototype/`.
- Approval, publishing, or readiness changes.
- Campaign update/delete routes.
- MVP, Pilot, or Production readiness claims.

## 8. Required Future Tests

- Missing `NASHIR_CAMPAIGN_RUNTIME_MODE` defaults to `in_memory`.
- `DATABASE_URL` alone does not activate campaign repository mode.
- Explicit `in_memory` keeps existing in-memory behavior even when `DATABASE_URL` exists.
- `repository` mode uses `NashirCampaignRepository`.
- `repository` mode fails closed without `DATABASE_URL`, pool, or approved injected repositories.
- Invalid `NASHIR_CAMPAIGN_RUNTIME_MODE` fails closed.
- List/create/read campaign work in `repository` mode.
- Campaign read-by-id returns non-disclosing `404` for non-existent campaign IDs.
- Campaign read-by-id returns non-disclosing `404` for cross-workspace campaign IDs.
- Unknown workspace returns non-disclosing `404`.
- Missing membership returns non-disclosing `404`.
- User without `nashir.campaign.read` gets `403` for `GET` routes.
- User without `nashir.campaign.write` gets `403` for `POST`.
- Existing in-memory behavior remains unchanged.
- Evidence routes remain consistent with the approved campaign source.

## 9. Required Future Verification

```text
git diff --check
npm test
npm run db:migrate:strict
npm run db:migrate:retry
npm run openapi:lint:strict
```

## 10. GO / NO-GO

```text
GO:    This PR documents the future Nashir campaign runtime mode activation path.
NO-GO: This PR implements campaign runtime mode.
NO-GO: This PR implements a campaign repository.
NO-GO: This PR modifies SQL, migrations, OpenAPI, UI, or generated clients.
NO-GO: This PR claims MVP, Pilot, or Production readiness.
```
