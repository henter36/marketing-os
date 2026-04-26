# Marketing OS Phase 0/1 — UI Permission Matrix

> This matrix is a UI-level projection of Phase 0/1 RBAC. Backend permissions remain the source of enforcement.

## Roles Used in Prototype

| Role | Intended Use |
|---|---|
| Workspace Admin | Tenant, members, roles, safe mode, all operational controls |
| Creator | Campaign, brief, media job, asset creation |
| Reviewer | Review tasks and approval decisions |
| Publisher | Publish job creation, manual evidence, tracked links, reports |
| Viewer | Read-only operational visibility |

## Screen Access

| Screen | Admin | Creator | Reviewer | Publisher | Viewer |
|---|---:|---:|---:|---:|---:|
| Dashboard | Yes | Yes | Yes | Yes | Yes |
| Workspaces | Yes | Read | Read | Read | Read |
| Members & RBAC | Yes | No | No | No | No |
| Campaigns | Yes | Yes | Read | Read | Read |
| Brief Versions | Yes | Yes | Read | Read | Read |
| Media Jobs | Yes | Yes | Read | No | Read |
| Assets & Versions | Yes | Yes | Read | Read | Read |
| Review Tasks | Yes | No | Yes | No | Read |
| Approval Decisions | Yes | No | Yes | No | No |
| Publish Jobs | Yes | No | No | Yes | No |
| Manual Evidence | Yes | No | No | Yes | Read |
| Report Snapshots | Yes | No | No | Yes | Read |
| Usage & Cost | Yes | Read | No | No | Read |
| Audit Log | Yes | No | Read | No | Read |
| Safe Mode & Onboarding | Yes | No | No | No | No |

## UI Enforcement Rules

1. Hidden controls are not enough. Backend must enforce permissions.
2. Disabled controls should show the required permission and ErrorModel code.
3. Each sensitive write must display the expected audit event.
4. Every workspace-scoped screen must show current workspace context.
5. No form should accept trusted `workspace_id` from body.

## Critical Permissions by Domain

```text
workspace.read
workspace.create
workspace.manage
workspace.manage_members
rbac.read
campaign.read
campaign.write
brief.read
brief.write
media_job.read
media_job.create
media_job.update_status
media_asset.read
media_asset.create
media_asset.version_create
review.read
review.assign
approval.decide
publish_job.create
manual_evidence.read
manual_evidence.submit
manual_evidence.invalidate
tracked_link.read
tracked_link.create
report.read
report.generate
usage.read
usage.record
cost.read
audit.read
safe_mode.manage
```

## Risk Note

If the real implementation allows UI actions without matching backend permission checks, the system is not ready for pilot even if the screens look correct.
