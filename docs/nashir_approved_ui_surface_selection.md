# Nashir Approved UI Surface Selection

Date: 2026-05-17

## Current Verified Status

- Backend campaign/evidence routes exist for list/create/read-by-id behavior.
- `NASHIR_CAMPAIGN_RUNTIME_MODE` and `NASHIR_EVIDENCE_RUNTIME_MODE` exist and default to `in_memory`.
- Repository modes are explicit only and independently controlled.
- `prototype/` remains deprecated/experimental and is not product authority.
- `ui/nashir/` exists as a static/read-only surface, but it is not backend-routed, not API-connected, and not product-ready.

## Decision

Selected: Option A, approve `ui/nashir/` as the future Nashir UI implementation surface with strict constraints.

This approval is only for future implementation scoping. It does not approve current product use, UI readiness, routing/serving, API wiring, generated clients, or backend changes.

`ui/nashir/` may become the approved Nashir UI implementation surface because it is separate from `prototype/` and can be converted without inheriting prototype behavior. It must not rely on `prototype/` as design, code, data, or behavior authority. Future implementation must be separately scoped and verified.

## Candidate First UI Implementation Scope

- Campaign list.
- Campaign create.
- Campaign read-by-id/detail.
- Evidence submit.
- Evidence list.
- Evidence read-by-id/detail.
- Loading state.
- Empty state.
- Error states for 401/403/non-disclosing 404.
- No campaign update/delete.
- No approval, publishing, or readiness mutation flows.

## Future Allowed Files

If `ui/nashir/` is selected for a future implementation PR, allowed files may include:

- `ui/nashir/index.html`
- `ui/nashir/app.js`
- `ui/nashir/styles.css`
- `docs/03_decision_log.md`
- `docs/17_change_log.md`
- a future usage/verification doc if needed.

## Future Forbidden Scope

- `prototype/`.
- backend runtime changes unless separately gated.
- SQL/migrations.
- OpenAPI YAML.
- generated clients unless separately gated.
- package changes unless separately justified and gated.
- campaign update/delete.
- approval flow.
- publishing flow.
- readiness scoring changes.
- lifecycle expansion beyond submitted evidence.
- MVP, Pilot, or Production readiness claims.

## Required Future Checks

- UI does not reference `prototype/`.
- UI calls only approved Nashir routes.
- UI uses route-derived workspace/campaign/evidence IDs.
- UI handles loading, empty, and error states.
- UI handles 401, 403, and non-disclosing 404.
- UI does not expose cross-workspace data.
- UI remains compatible with `in_memory` and `repository` runtime modes.
- UI must not claim generated-client readiness.

## Recommended Next PR

Recommended next PR: docs: gate first Nashir UI implementation slice.

That gate should name the exact `ui/nashir/` files, define the first implementation slice, preserve `prototype/` NO-GO, and list verification before any UI code changes begin.

## GO / NO-GO

- GO only for selecting `ui/nashir/` as the future Nashir UI implementation surface.
- NO-GO for implementing UI in this PR.
- NO-GO for modifying `ui/` or `prototype/` in this PR.
- NO-GO for claiming UI readiness, generated-client readiness, MVP, Pilot, or Production readiness.
