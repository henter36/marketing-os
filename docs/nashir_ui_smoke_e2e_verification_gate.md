# Nashir UI Smoke and E2E Verification Gate

Date: 2026-05-17

## Current Verified Status

- `ui/nashir/` is the approved Nashir UI implementation surface (PR #259).
- `GET /nashir` redirects to `/nashir/`; `GET /nashir/` serves `ui/nashir/index.html` (PR #263).
- Static assets are served at `/nashir/app.js` and `/nashir/styles.css` (PR #263).
- The UI uses direct `fetch` calls to approved Nashir routes only.
- No generated clients are used.
- `prototype/` remains forbidden as design, code, data, or behavior authority.
- No MVP, Pilot, or Production readiness is claimed.

## Verification Problem

The UI is now served but has no approved smoke or E2E verification plan:

- No automated browser or E2E test exists.
- `npm test` covers static serving behavior and backend route contracts; it does not exercise the UI in a browser.
- Manual review alone is insufficient to gate later product readiness.

## Candidate Verification Approaches

**Option A — Manual smoke checklist only**
A structured docs-only checklist: reviewer opens `/nashir`, works through the first journey, and signs off manually. No packages, no browser driver. Lowest friction, no automation, no CI signal.

**Option B — Automated static serving smoke tests only**
Extend the existing Node.js test suite to assert that each `/nashir/...` URL returns the expected status and content-type. Does not exercise the browser or JavaScript. No new packages required if confined to the existing test runner.

**Option C — Browser-level E2E test for the first UI journey**
Add a browser automation test (e.g., Playwright or Puppeteer) that opens `/nashir`, fills in workspace/user IDs, and walks the full campaign/evidence journey. Provides the strongest signal. Requires new dev-dependency packages and a running server, so a separate package gate is needed first.

**Option D — Staged approach: documentation checklist now, automated E2E later**
Gate a manual smoke checklist first (no packages), then gate automated E2E in a subsequent separately approved PR. Provides an immediate verification artifact without a package or CI change now.

**Ranking:** D > B > A > C

Option D is recommended: it delivers a verifiable artifact immediately without package changes, and defers the riskier E2E tooling decision to a subsequent gate where the environment and package impact can be approved explicitly.

## Required Journey to Verify

Any future smoke or E2E verification must cover:

1. Open `/nashir` — confirm redirect to `/nashir/` and HTML loads.
2. Enter `workspaceId` and `x-user-id` — confirm inputs accepted.
3. Load campaign list — confirm list request fires, empty state renders.
4. Create campaign — confirm POST fires, success state renders, campaign appears in list.
5. Read campaign detail — confirm GET by ID fires, detail panel renders.
6. Submit evidence — confirm POST evidence fires, success state renders.
7. List evidence — confirm GET evidence list fires, submitted record appears.
8. Read evidence detail — confirm GET evidence by ID fires, detail panel renders.
9. Loading state — confirm spinner or loading indicator appears while requests are in flight.
10. Empty state — confirm empty message renders when no campaigns or evidence exist.
11. Validation error state — confirm client-side and server-side validation errors render.
12. 401 unauthenticated state — confirm unauthenticated requests surface the 401 state.
13. 403 forbidden state — confirm insufficient-permission responses surface the 403 state.
14. Non-disclosing 404 state — confirm missing workspace/campaign/evidence returns 404 without data leakage.
15. Generic failure state — confirm unexpected errors render the generic failure message.
16. No cross-workspace data exposure — confirm workspace-scoped requests do not leak other workspace data.
17. `in_memory` and `repository` runtime mode compatibility — confirm UI behavior is the same regardless of backend mode.

## Future Allowed Files

Depending on which option is selected in the next PR:

- `docs/nashir_ui_smoke_checklist.md` — if Option A or D (manual checklist).
- `test/smoke/` or `test/e2e/` — only if automated tests are later approved in a separate gate.
- `docs/03_decision_log.md`.
- `docs/17_change_log.md`.
- No `ui/nashir/` changes unless separately scoped as a UI improvement PR.

## Future Forbidden Scope

- `prototype/`
- Generated clients
- OpenAPI YAML modification
- SQL/migrations
- Backend API behavior changes
- Package changes unless separately gated (required if browser E2E tooling is added)
- UI feature expansion beyond the current first slice
- Campaign update/delete routes
- Approval flow
- Publishing flow
- Readiness scoring changes
- Evidence lifecycle expansion
- MVP, Pilot, or Production readiness claims

## Required Future Verification

All future PRs in this gate must pass:

- `git diff --check`
- `npm test`
- `npm run openapi:lint:strict`

If browser/E2E automation is added later:

- Define the exact start command (e.g., `npm run test:e2e`) and required environment (server must be running, `in_memory` mode, no database required for first run).
- Document expected pass/fail signal in CI.

If a manual checklist is used:

- Define exact checklist steps and expected results per step.
- Require a named reviewer sign-off before the gate is considered complete.

## GO / NO-GO

- GO for documenting the verification decision path.
- NO-GO for adding tests, browser automation, or package changes in this PR.
- NO-GO for modifying `ui/`, `prototype/`, runtime code, SQL, OpenAPI YAML, generated clients, workflows, or packages in this PR.
- NO-GO for MVP, Pilot, or Production readiness claims.

## Recommended Next PR

`docs: add Nashir UI smoke checklist`

This is the conservative next step. A documentation-only checklist delivers an immediate structured verification artifact without requiring package changes, a running browser, or CI infrastructure changes. Automated E2E can follow in a separately gated PR once the checklist has been validated and the package impact has been approved.
