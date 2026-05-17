# Nashir Static UI Serving Verification

Date: 2026-05-17
PR: #263

## Current Verified Serving Status

- `GET /nashir` redirects to `/nashir/` with `301 Location: /nashir/`.
- `GET /nashir/` and `HEAD /nashir/` serve `ui/nashir/index.html`.
- `GET /nashir/app.js` and `HEAD /nashir/app.js` serve `ui/nashir/app.js`.
- `GET /nashir/styles.css` and `HEAD /nashir/styles.css` serve `ui/nashir/styles.css`.
- Root-level `/app.js` and `/styles.css` are not Nashir asset routes; they are delegated to the existing app.
- All `/v1` API requests are delegated to the existing app handler without change.
- Unknown `/nashir/...` paths return `404 text/plain`.
- Read failures return `404` for ENOENT and `500` for other read errors.
- Successful responses include `content-type`, `content-length`, and `cache-control: no-cache`.
- HEAD responses return headers without a body.
- An in-memory per-handler file cache avoids repeated disk reads after the first request.

## UI Authority Status

- `ui/nashir/` is the approved Nashir UI implementation surface.
- `prototype/` remains forbidden as design, code, data, or behavior authority.
- No generated clients are used.
- No package or build step is introduced.

## Verification Evidence

- Static serving tests pass for: HTML at `/nashir/`, JS at `/nashir/app.js`, CSS at `/nashir/styles.css`, `301` redirect from `/nashir`, unknown static asset `404`, HEAD behavior without body, read failure `500`, and existing API route delegation.
- `npm test` passes (403/403).
- `npm run openapi:lint:strict` passes.
- `git diff --check` passes with no whitespace errors.
- Changed files are limited to `src/server.js` and `test/nashir-static-serving.test.js`.
- No `prototype/` authority usage.
- No generated client usage.

## Remaining Gaps

- No automated browser or E2E UI test.
- No MVP, Pilot, or Production readiness.
- No generated client readiness.
- No OpenAPI main activation.
- No campaign update, delete, approval, publishing, or readiness mutation flows.
- Manual UX review still required before product readiness.

## Recommended Next PR

`docs: gate Nashir UI smoke/e2e verification`

The serving implementation and hardening are complete. The most conservative next step is a documentation gate for smoke or E2E verification before adding tests or making UI changes.

## GO / NO-GO

- GO for documentation verification of PR #263 serving behavior.
- NO-GO for modifying runtime, UI files, SQL, OpenAPI, generated clients, workflows, packages, or `prototype/`.
- NO-GO for MVP, Pilot, or Production readiness claims.
