# Nashir Static UI Usage Instructions

| Field | Value |
|---|---|
| Document type | Documentation-only usage guide |
| Status | Draft — Pending Review |
| Scope | Nashir Core V1 static UI only |
| Change type | Documentation-only |
| Implementation status | Static UI exists; not routed or served by backend |
| Relationship | Follows `docs/nashir_minimal_ui_surface_implementation_report.md` |

## 1. Governance Summary

This document does not approve further implementation.

This document does not route or serve the UI.

This document does not add backend/runtime behavior.

This document does not approve tests, deployment, packages, workflows, SQL, OpenAPI, generated clients, integrations, or prototype use.

Nashir Core V1 remains manual/export/review/approval/evidence only.

Manual publishing remains external and user-operated.

Readiness is not approval.

Evidence is not publishing authorization.

UTM Lite is not attribution.

AI assistant is advisory-only.

## 2. Existing Static UI Files

The existing static UI files are:

- `ui/nashir/index.html`
- `ui/nashir/app.js`
- `ui/nashir/styles.css`

These files were created by Slice A and documented by Slice B.

## 3. How to Open Locally

### Option A: Open the file directly

Open `ui/nashir/index.html` directly in a browser from the local repository checkout.

From Finder, navigate to the repository folder, open `ui/nashir/`, and open `index.html` with a browser.

From a browser, use the browser's file-open option and select `ui/nashir/index.html`.

No server is required for this option.

### Option B: Use a temporary local static server

Use a temporary local static server only if one is already available on the machine and only as a local viewing convenience.

Example from the repository root:

```sh
python3 -m http.server
```

Then open:

```text
http://localhost:8000/ui/nashir/
```

This is not backend integration. It must not modify repository files, add scripts, add packages, add workflows, add backend routes, or change runtime behavior.

Do not run `npm install`.

Do not modify `package.json`.

Do not add scripts.

Do not add workflows.

Do not add backend routes.

## 4. What This UI Does

The static UI:

- displays a read-only Nashir governance/status shell;
- shows advisory readiness and planning labels;
- shows NO-GO boundaries;
- shows the AI advisory-only boundary;
- shows manual publishing, evidence, UTM Lite, and manual performance labels.

## 5. What This UI Does Not Do

The static UI:

- does not publish;
- does not schedule;
- does not connect accounts;
- does not launch ads;
- does not spend budget;
- does not process payments;
- does not ingest analytics;
- does not perform attribution;
- does not call APIs;
- does not persist data;
- does not authenticate users;
- does not enforce permissions;
- does not enforce tenant isolation;
- does not execute AI actions;
- does not modify backend/runtime.

## 6. Review Checklist

Use this checklist for manual local review:

- page opens locally;
- Arabic/RTL layout is readable;
- governance labels are visible;
- NO-GO actions are clearly blocked;
- no actionable publish, schedule, connect, pay, or analyze controls are present;
- no API/network dependency is expected;
- no backend behavior is expected.

## 7. Known Limitations

- Not wired into an application route.
- Not served by backend.
- No persistence.
- No API behavior.
- No authorization enforcement.
- No tenant isolation enforcement.
- No tests.
- No deployment.

## 8. Future Gates Required

Separate future gates are required for:

- serving or linking the static UI;
- QA/testing;
- routing/navigation integration;
- authorization enforcement;
- audit logging;
- ErrorModel behavior;
- tenant isolation enforcement.

## 9. GO / NO-GO Decision

GO for documentation-only usage instructions.

NO-GO for implementation.

NO-GO for routing/serving/backend/runtime.

NO-GO for package/workflow/test/schema/API/generated client changes.

## 10. Recommended Next Step

Recommended next step: manually review the static UI locally using this guide, then decide whether to keep it standalone or create a separate serve/link gate.
