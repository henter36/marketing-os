# Marketing OS Phase 0/1 — UI Screen Inventory

> Source scope: Phase 0/1 only. This file maps prototype screens to approved ERD/OpenAPI/Backlog/QA concepts. It does not introduce new product scope.

## Executive Rule

The UI must not become a backdoor for forbidden Phase 0/1 behavior.

Forbidden UI behavior:

- Auto-publishing controls
- Paid ad execution controls
- AI agent controls
- Advanced attribution dashboards
- Billing provider management
- Provider usage log screens
- Any editable surface for immutable historical truth

## Screens

| Screen | Route in Prototype | Purpose | Primary Permissions | Critical Guardrail |
|---|---|---|---|---|
| Dashboard | `dashboard` | Overview of governed workflow | `workspace.read` | Shows manual publish only |
| Workspaces | `workspaces` | Workspace context and tenant boundary | `workspace.read`, `workspace.create`, `workspace.manage` | Do not trust `workspace_id` from body |
| Members & RBAC | `members` | Users, roles, permissions | `workspace.manage_members`, `rbac.read` | No action without membership and permission |
| Campaigns | `campaigns` | Campaign list and state changes | `campaign.read`, `campaign.write` | State changes create transition records |
| Brief Versions | `briefs` | Immutable campaign brief versions | `brief.read`, `brief.write` | Content changes create new version |
| Media Jobs | `media-jobs` | AI/media job request lifecycle | `media_job.read`, `media_job.create`, `media_job.update_status` | Requires cost snapshot and idempotency |
| Assets & Versions | `assets` | Media assets and content versions | `media_asset.read`, `media_asset.create`, `media_asset.version_create` | Approved version cannot be patched |
| Review Tasks | `review` | Review assignment workflow | `review.read`, `review.assign` | ReviewTask must bind exact MediaAssetVersion |
| Approval Decisions | `approval` | Approval/rejection decision | `approval.decide` | Hash must match MediaAssetVersion content hash |
| Publish Jobs | `publish` | Governed publish job creation | `publish_job.create` | No auto-publishing |
| Manual Evidence | `evidence` | Manual proof of publishing | `manual_evidence.read`, `manual_evidence.submit`, `manual_evidence.invalidate` | Supersede creates row; invalidate is limited state update |
| Report Snapshots | `reports` | Frozen client report snapshots | `report.read`, `report.generate` | Later evidence changes do not mutate old reports |
| Usage & Cost | `usage-cost` | Usage metering and cost events | `usage.read`, `usage.record`, `cost.read` | CostEvent is not billing; UsageMeter requires confirmed output |
| Audit Log | `audit` | Append-only event visibility | `audit.read` | AuditLog is not business state |
| Safe Mode & Onboarding | `operations` | Operational controls | `safe_mode.manage`, `onboarding.read` | Safe mode changes must be audited |

## Required UI States

Every implementation screen should include these states:

1. Loading state
2. Empty state
3. Permission denied state
4. Tenant mismatch state
5. Validation error state
6. Conflict/idempotency error state
7. Immutable record error state
8. Success with audit event hint

## Design Principle

The prototype is intentionally governance-first. A visually attractive UI that hides state transitions, permissions, hashes, evidence status, or audit events is not acceptable for this system.
