# 09 — Screen Map

## Status

Canonical UI screen map for Marketing OS Phase 0/1.

## Authoritative UI Sources

```text
prototype/index.html
prototype/styles.css
prototype/app.js
prototype/README.md
docs/ui_screen_inventory.md
docs/ui_api_mapping.md
docs/ui_permission_matrix.md
```

## Screens

```text
Dashboard
Workspaces
Members & RBAC
Campaigns
Brief Versions
Media Jobs
Assets & Versions
Review Tasks
Approval Decisions
Publish Jobs
Manual Evidence
Report Snapshots
Usage & Cost
Audit Log
Safe Mode & Onboarding
```

## UI Guardrails

1. Every workspace-scoped screen must show current workspace context.
2. Every sensitive action must expose expected audit event.
3. Unauthorized actions must show ErrorModel-style feedback.
4. Immutable records must not have edit controls.
5. Manual Evidence must not expose PATCH or DELETE.
6. Publish screen must not imply auto-publishing.
7. Usage and Cost must remain separated from billing.

## Implementation Rule

The screen map is not an API source. If a UI interaction needs backend data, it must map to `docs/08_api_spec.md` and approved OpenAPI.
