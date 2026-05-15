# Nashir Evidence DB Runtime Wiring Gate

## 1. Current Verified Status

- PR #239 implemented `GET /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/evidence/{evidenceId}` using existing in-memory Slice 0 behavior.
- PR #241 activated Patch 003 in the effective migration runner order.
- Patch 003 provides Nashir evidence persistence tables.
- `NashirEvidenceLifecycleRepository` remains repository-only and is not wired to runtime routes.
- Nashir campaign runtime remains in-memory.
- No DB-backed campaign persistence is approved by this gate.

## 2. Future Implementation Candidate

A future runtime PR may wire `NashirEvidenceLifecycleRepository` only for evidence persistence on these routes:

- `POST /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/evidence`
- `GET /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/evidence`
- `GET /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/evidence/{evidenceId}`

The future PR must preserve campaign existence and workspace membership checks through the existing route/service guard path. Evidence persistence may use the DB-backed repository only after campaign, workspace, membership, and permission checks pass.

## 3. Hybrid Transitional State

- Campaigns remain in-memory.
- Evidence may become DB-backed.
- This is not MVP-ready, Pilot-ready, or Production-ready.
- This does not approve campaign DB persistence.

## 4. Future Allowed Files

Future implementation scope may include:

- `src/router.js`
- `src/nashir/backend-slice0-service.js`
- `src/repositories/nashir-evidence-lifecycle-repository.js`, only if integration/wiring requires a small adapter-safe change
- `test/nashir-route.test.js`
- `test/integration/` or directly relevant DB-backed evidence route tests
- `src/store.js`, only if dependency injection requires it; prefer not to modify store shape

## 5. Future Forbidden Files and Scope

- SQL files.
- Migrations.
- OpenAPI YAML.
- Generated clients.
- Package files.
- Workflows unless explicitly needed for already-existing DB test commands.
- `ui/`.
- `prototype/`.
- Campaign DB persistence.
- Broader evidence lifecycle transitions.
- Approval flow.
- Readiness scoring changes.
- MVP, Pilot, or Production readiness claims.

## 6. Required Future Tests

- `POST` evidence persists through `NashirEvidenceLifecycleRepository`.
- `GET` evidence list reads from the DB-backed evidence repository.
- `GET` evidence by ID reads from the DB-backed evidence repository.
- `404` for missing evidence.
- `404` for cross-workspace evidence.
- `404` for cross-campaign evidence.
- `404` for missing campaign.
- `404` for unknown workspace.
- `404` for missing active membership.
- `403` for member without `nashir.campaign.read` on `GET` routes.
- `403` for member without `nashir.campaign.write` on `POST`.
- `401` for unauthenticated and invalid users.
- No audit/logging regression for submitted evidence.
- No runtime route bypass of permission or membership guards.

## 7. Required Future Verification

```text
git diff --check
npm test
npm run db:migrate:strict
npm run db:migrate:retry
npm run openapi:lint:strict
```

## 8. GO / NO-GO

```text
GO:    Future PR wires DB-backed evidence persistence only after campaign, workspace, membership, and permission checks.
NO-GO: Future PR adds campaign DB persistence.
NO-GO: Future PR modifies SQL or migrations.
NO-GO: Future PR adds UI/API/generated-client changes.
NO-GO: Future PR adds lifecycle transitions beyond submitted evidence.
NO-GO: Future PR claims MVP, Pilot, or Production readiness.
```
