# 11 — Sprint Plan

## Status

Canonical sprint plan for Marketing OS Phase 0/1.

## Authoritative Sources

```text
docs/marketing_os_v5_6_5_phase_0_1_backlog.md
docs/marketing_os_v5_6_5_codex_implementation_instructions.md
```

## Execution Order

```text
Sprint 0 — Foundation
Sprint 1 — Workspace, Brand, Campaign, Brief
Sprint 2 — Cost, Media Jobs, Assets, Usage
Sprint 3 — Review, Approval, Publish, Manual Evidence
Sprint 4 — Reports, Audit, Safe Mode, Pilot Gate
```

## Sprint 0 Mandatory Scope

```text
repository structure
dependency baseline
database migration wiring
environment configuration
AuthGuard baseline
WorkspaceContextGuard
MembershipCheck
PermissionGuard
Unified ErrorModel
RBAC seed data
Sprint 0 API endpoints
migration tests
tenant isolation tests
RBAC tests
ErrorModel tests
```

## Sprint Gates

| Gate | Required Condition |
|---|---|
| Sprint 0 → Sprint 1 | Migration, tenant isolation, RBAC, ErrorModel tests pass |
| Sprint 1 → Sprint 2 | Campaign/Brief tests pass and no cross-tenant access |
| Sprint 2 → Sprint 3 | Usage, cost, idempotency, asset immutability tests pass |
| Sprint 3 → Sprint 4 | Approval, publish, manual evidence tests pass |
| Sprint 4 → Pilot | All P0 QA tests pass |

## No-Go Rule

Do not begin Sprint 1 until Sprint 0 has a working application baseline and passing tests.
