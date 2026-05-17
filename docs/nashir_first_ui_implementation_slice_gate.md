# Nashir First UI Implementation Slice Gate

Date: 2026-05-17

## Current Verified Status

- `ui/nashir/` is selected as the future Nashir UI implementation surface.
- `ui/nashir/` remains not product-ready.
- `ui/nashir/` is not currently API-connected.
- `prototype/` remains forbidden as product UI authority.
- Backend routes exist for campaign and evidence list/create/read-by-id.
- `NASHIR_CAMPAIGN_RUNTIME_MODE` and `NASHIR_EVIDENCE_RUNTIME_MODE` default to `in_memory`.

## First UI Slice Objective

Future implementation should be limited to:

- Campaign list.
- Campaign create.
- Campaign read-by-id/detail.
- Evidence list for selected campaign.
- Evidence submit for selected campaign.
- Evidence read-by-id/detail.
- Loading state.
- Empty state.
- Error state for 401.
- Error state for 403.
- Error state for non-disclosing 404.

## Future Allowed Files

- `ui/nashir/index.html`
- `ui/nashir/app.js`
- `ui/nashir/styles.css`
- `docs/03_decision_log.md`
- `docs/17_change_log.md`
- optional `docs/nashir_static_ui_usage_instructions.md` only if usage instructions need to be updated.

## Future Forbidden Scope

- `prototype/`.
- backend runtime changes.
- SQL/migrations.
- OpenAPI YAML.
- generated clients.
- package changes.
- workflows.
- campaign update/delete.
- approval flow.
- publishing flow.
- readiness scoring changes.
- lifecycle expansion beyond submitted evidence.
- MVP, Pilot, or Production readiness claims.

## API Usage Constraints

- UI may call only approved Nashir routes.
- UI must use route-derived `workspaceId`, `nashirCampaignId`, and `evidenceId`.
- UI must not hardcode cross-workspace data.
- UI must not use generated clients.
- UI must not require package installation.
- UI must not require backend route changes.
- UI must work with the existing `{ data: ... }` response envelope.
- UI must be compatible with `in_memory` and `repository` runtime modes.

## State and Error Handling

Future UI implementation must handle:

- loading;
- empty;
- success;
- validation error;
- 401 unauthenticated;
- 403 forbidden;
- non-disclosing 404;
- generic failure.

## Future Verification

- `git diff --check`
- `npm test`
- `npm run openapi:lint:strict`
- manual static UI review if no automated UI test exists.
- verify no `prototype/` references.
- verify no generated client usage.
- verify changed files are limited to approved UI/docs files.

## GO / NO-GO

- GO only for documenting the first UI implementation slice.
- NO-GO for implementing UI in this PR.
- NO-GO for touching `ui/` or `prototype/` in this PR.
- NO-GO for backend/runtime/OpenAPI/generated-client/package changes.
- NO-GO for claiming UI readiness, MVP, Pilot, or Production readiness.

## Recommended Next PR

Recommended next PR: ui: implement Nashir first static UI slice.

That implementation may proceed only after this gate is merged and must stay within the allowed files, API constraints, and verification listed here.
