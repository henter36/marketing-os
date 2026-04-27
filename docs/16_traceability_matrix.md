# 16 — Traceability Matrix

## Purpose

This matrix connects execution artifacts so implementation can be audited from requirement to UI/API/database/test.

## Artifact Chain

```text
Master Document
→ V1 Scope
→ Domain Map
→ ERD
→ SQL DDL + Patch
→ OpenAPI
→ Backlog
→ Sprint Plan
→ QA Test Plan
→ Screen Map / User Flows
→ Implementation Notes
→ Change Log
```

## Phase 0/1 Traceability

| Capability | Domain | DB Source | API Source | UI Source | QA Source |
|---|---|---|---|---|---|
| Workspace isolation | workspaces/rbac | SQL + RLS | OpenAPI workspace routes | Workspaces screen | Tenant isolation tests |
| RBAC | rbac | roles, permissions, members | Roles/Permissions/Members endpoints | Members & RBAC | RBAC tests |
| Campaign management | campaigns | campaigns, campaign_state_transitions | Campaign endpoints | Campaigns screen | Backlog + QA |
| Brief versioning | briefs | brief_versions | BriefVersion endpoints | Brief Versions screen | Immutable content tests |
| Media jobs | media-jobs | media_jobs, media_cost_snapshots | MediaJob endpoints | Media Jobs screen | Idempotency/cost tests |
| Assets and versions | media-assets | media_assets, media_asset_versions | Asset endpoints | Assets & Versions | Immutability tests |
| Review tasks | review | review_tasks | Review endpoints | Review Tasks | Review/approval tests |
| Approval decisions | approval | approval_decisions + Patch 001 triggers | Approval endpoint | Approval Decisions | Approval integrity tests |
| Publish jobs | publish | publish_jobs | PublishJob endpoint | Publish Jobs | Publish governance tests |
| Manual evidence | publish | manual_publish_evidence + Patch 001 | ManualEvidence endpoints | Manual Evidence | Evidence immutability tests |
| Report snapshots | reports | client_report_snapshots | Report endpoints | Report Snapshots | Report snapshot tests |
| Usage meter | usage | usage_meter | Usage endpoints | Usage & Cost | Usage tests |
| Cost events | cost | cost_events | Cost endpoints | Usage & Cost | Cost separation tests |
| Audit log | audit | audit_logs | Audit endpoint | Audit Log | Audit immutability tests |
| Safe mode | operations | safe_mode tables/config | SafeMode endpoints | Safe Mode & Onboarding | Operations tests |

## Required Review Rule

Any implementation story must identify:

```text
- source requirement
- affected entities
- endpoint
- permission
- audit event
- error states
- QA case
```

If any item is missing, the story is not ready for implementation.
