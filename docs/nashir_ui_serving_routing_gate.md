# Nashir UI Serving and Routing Gate

Date: 2026-05-17

## Current Verified Status

- `ui/nashir/` is the approved future Nashir UI surface.
- The first static UI slice exists.
- The UI is not currently served or routed by backend.
- The UI uses direct `fetch` calls to approved Nashir API routes.
- `prototype/` remains forbidden as design, code, data, or behavior authority.
- No generated clients are used.

## Serving / Routing Decision Problem

This gate documents the decision path for whether `ui/nashir/` should remain local/static only, be served from the backend in a future PR, require a separate frontend hosting path, or first receive smoke/static checks.

This PR does not implement serving or routing and does not approve a concrete route.

## Candidate Serving Options

1. Option B: serve `ui/nashir/` from backend under a controlled static route in a separately approved implementation PR.
2. Option C: defer serving and add smoke/static checks first.
3. Option A: keep `ui/nashir/` local/static only.
4. Option D: create a separate frontend app/surface later.

Recommended next PR: docs: gate Nashir UI static serving implementation.

This is conservative because serving requires backend changes; the next PR should define the exact static route, allowed runtime files, tests, and rollback/NO-GO boundaries before implementation.

## Future Route Candidates

If serving is later approved, candidate routes may include:

- `/nashir`
- `/ui/nashir`
- `/workspaces/{workspaceId}/nashir`

No route is approved by this PR.

## Future Allowed Files

Future implementation may include:

- `src/server.js` (modification) only if serving implementation is later approved.
- `src/router.js` (modification) only if route handling is required and separately justified.
- `ui/nashir/index.html` (modification)
- `ui/nashir/app.js` (modification)
- `ui/nashir/styles.css` (modification)
- tests or smoke tests directly related to static serving.
- `docs/03_decision_log.md`
- `docs/17_change_log.md`

## Future Forbidden Scope

- `prototype/`.
- SQL/migrations.
- OpenAPI YAML.
- generated clients.
- package changes unless separately justified and gated.
- campaign update/delete.
- approval flow.
- publishing flow.
- readiness scoring changes.
- lifecycle expansion.
- MVP, Pilot, or Production readiness claims.

## Required Future Checks

- Static route returns `index.html` if serving is approved.
- Static assets load correctly if serving is approved.
- UI continues to call only approved Nashir API routes.
- No `prototype/` references.
- No generated client usage.
- 401/403/non-disclosing 404 behavior remains represented.
- No backend API route behavior changes unless separately approved.
- No main OpenAPI or generated-client changes.

## GO / NO-GO

- GO only for documenting the serving/routing decision path.
- NO-GO for implementing serving/routing in this PR.
- NO-GO for modifying `ui/` or `prototype/` in this PR.
- NO-GO for claiming UI readiness, MVP, Pilot, or Production readiness.
