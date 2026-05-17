# Nashir UI Manual Smoke Checklist

## Purpose

Manual smoke checklist for the Nashir static UI served at `/nashir/` after PR #263.

This is not an MVP, Pilot, or Production readiness claim. It is not a substitute for future automated E2E tests. It is the first structured verification artifact recommended by the smoke/E2E gate (D-154).

## Preconditions

Before running this checklist, confirm all of the following:

- [ ] `main` branch is current and local checkout is up to date.
- [ ] `npm test` passes with no failures.
- [ ] `npm run openapi:lint:strict` passes.
- [ ] Backend server is running locally (e.g., `node src/server.js`).
- [ ] Reviewer has a known `workspaceId` and `x-user-id` to use as fixture inputs. For `in_memory` mode any non-empty values work. For `repository` mode a configured and migrated database is required.
- [ ] Browser devtools are open to the Network tab before starting.

## Checklist

### Static Serving

| # | Step | Expected Result | Pass/Fail | Notes |
|---|------|----------------|-----------|-------|
| S-01 | Navigate to `http://localhost:{port}/nashir` | Browser redirects to `/nashir/` (301) and HTML page loads | | |
| S-02 | Inspect page source or Network tab | `<title>Nashir Campaign Evidence UI</title>` is present | | |
| S-03 | Open `http://localhost:{port}/nashir/app.js` directly | 200, `application/javascript` content type | | |
| S-04 | Open `http://localhost:{port}/nashir/styles.css` directly | 200, `text/css` content type | | |
| S-05 | Open `http://localhost:{port}/app.js` directly | Not served as a Nashir asset (404 or other non-asset response) | | |
| S-06 | Open `http://localhost:{port}/styles.css` directly | Not served as a Nashir asset (404 or other non-asset response) | | |
| S-07 | Open `http://localhost:{port}/v1/health` | 200, `{ "data": { "status": "ok" } }` — existing API unaffected | | |
| S-08 | Open `http://localhost:{port}/nashir/missing.js` | 404, `text/plain` | | |

### UI Journey

| # | Step | Expected Result | Pass/Fail | Notes |
|---|------|----------------|-----------|-------|
| J-01 | Load `/nashir/`, enter `workspaceId` and `userId`, submit | Input form accepted, UI transitions to campaign list view | | |
| J-02 | Campaign list loads | Loading state appears briefly, then list renders (empty state if no campaigns) | | |
| J-03 | Create a campaign (fill name, submit) | POST fires to approved Nashir route, success state renders, new campaign appears in list | | |
| J-04 | Click campaign to read detail | GET by ID fires, campaign detail panel renders with correct data | | |
| J-05 | Submit evidence (fill required fields, submit) | POST evidence fires, success state renders | | |
| J-06 | Load evidence list for the campaign | GET evidence list fires, submitted record appears | | |
| J-07 | Click evidence to read detail | GET evidence by ID fires, evidence detail panel renders with correct data | | |

### State and Error Handling

| # | Step | Expected Result | Pass/Fail | Notes |
|---|------|----------------|-----------|-------|
| E-01 | Observe any request in flight | Loading indicator or spinner visible during fetch | | |
| E-02 | Load list with no data present | Empty state message renders (no crash, no blank screen) | | |
| E-03 | Submit campaign create with blank name | Validation error message renders without a network request (or on 400 response) | | |
| E-04 | Send request with invalid/missing `x-user-id` | 401 state renders (unauthenticated message visible) | | |
| E-05 | Use a `workspaceId` where the user lacks permission | 403 state renders (forbidden message visible) | | |
| E-06 | Request a campaign or evidence ID that does not exist | Non-disclosing 404 state renders (no workspace or data detail leaked) | | |
| E-07 | Simulate a network or server error (e.g., stop server mid-request) | Generic failure state renders (no stack trace or internal detail exposed) | | |

### Security and Governance

| # | Step | Expected Result | Pass/Fail | Notes |
|---|------|----------------|-----------|-------|
| G-01 | Use `workspaceId` of workspace A while authenticated to workspace B | No workspace A data is returned or rendered | | |
| G-02 | Inspect all network requests | UI calls only `/v1/workspaces/{workspaceId}/nashir-campaigns` and related approved evidence routes | | |
| G-03 | Inspect page source and JS | No `prototype/` directory references; no generated client imports | | |
| G-04 | Inspect all fetch responses | All responses use `{ "data": ... }` envelope | | |
| G-05 | Review rendered UI | No approval, publishing, or readiness mutation controls visible in the current slice | | |
| G-06 | Review rendered UI | No MVP, Pilot, or Production readiness claims visible | | |

## Sign-Off

| Field | Value |
|-------|-------|
| Reviewer name | |
| Date | |
| Runtime mode (`in_memory` / `repository`) | |
| Browser and version | |
| Backend port | |
| Overall result (`Pass` / `Conditional Pass` / `Fail`) | |
| Blockers (if any) | |
| Notes | |

A result of **Conditional Pass** means all steps passed except noted blockers that are documented and tracked. A result of **Fail** means the UI is not ready for further verification steps until blockers are resolved.

## Recommended Next PR

`test: add Nashir UI static serving smoke checks`

The static serving behavior is already covered by the Node.js test suite at a protocol level. The most conservative automated next step is to extend those checks (still within the existing test runner, no new packages) rather than introducing browser E2E tooling. UI improvements based on smoke findings should be separately scoped if issues are found during sign-off.
