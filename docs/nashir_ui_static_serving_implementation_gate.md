# Nashir UI Static Serving Implementation Gate

Date: 2026-05-17

## Current Verified Status

- `ui/nashir/` is approved as the future Nashir UI implementation surface.
- The first static UI slice exists.
- `ui/nashir/` is not currently served or routed by backend.
- The UI calls approved Nashir API routes through `fetch`.
- `prototype/` remains forbidden as product authority.
- No generated clients are used.

## Serving Decision

Future implementation may serve `ui/nashir/` from backend.

Recommended route: `/nashir`.

`/ui/nashir` and `/workspaces/{workspaceId}/nashir` are not selected for the first serving implementation unless separately gated.

Serving must be static asset serving only and must not change Nashir API route behavior.

## Future Implementation Scope

- Serve `ui/nashir/index.html` at `/nashir`.
- Serve `ui/nashir/app.js` and `ui/nashir/styles.css` as static assets.
- Keep the UI files unchanged unless a separate UI PR approves changes.
- Do not add authentication to the static HTML route in the first serving slice unless separately gated.
- Do not add generated clients.
- Do not add a frontend build step.

## Future Allowed Files

- `src/server.js`
- tests directly related to static serving.
- `docs/03_decision_log.md`
- `docs/17_change_log.md`
- `docs/nashir_static_ui_usage_instructions.md` only if serving instructions need update.

## Future Forbidden Scope

- `prototype/`.
- SQL/migrations.
- OpenAPI YAML.
- generated clients.
- package changes.
- workflow changes unless strictly required by existing test execution.
- campaign/evidence API behavior changes.
- backend route behavior changes beyond static serving.
- UI feature changes.
- campaign update/delete.
- approval flow.
- publishing flow.
- readiness scoring changes.
- lifecycle expansion.
- MVP, Pilot, or Production readiness claims.

## Required Future Tests / Checks

- `GET /nashir` returns HTML.
- Static JS asset loads.
- Static CSS asset loads.
- Existing API routes still work.
- Unknown static asset returns appropriate 404.
- No `prototype/` references.
- No generated client usage.
- No package changes.
- `npm test`.
- `npm run openapi:lint:strict`.
- `git diff --check`.

## GO / NO-GO

- GO only for documenting the static serving implementation gate.
- NO-GO for implementing serving in this PR.
- NO-GO for touching `src/server.js` in this PR.
- NO-GO for touching `ui/` or `prototype/` in this PR.
- NO-GO for MVP, Pilot, or Production readiness claims.

## Recommended Next PR

Recommended next PR: runtime: serve Nashir static UI.

That PR must stay limited to `src/server.js`, directly relevant static serving tests, and documentation/log updates.
