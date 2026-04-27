# 13 — Risk Register

## Purpose

This document captures execution, technical, operational, and governance risks for Marketing OS Phase 0/1.

## Risk Register

| ID | Risk | Severity | Impact | Mitigation | Gate |
|---|---|---:|---|---|---|
| R-001 | Tenant isolation failure | Critical | Cross-customer data exposure | RLS, WorkspaceContextGuard, integration tests | Sprint 0 |
| R-002 | RBAC bypass | Critical | Unauthorized actions | PermissionGuard, backend enforcement, negative tests | Sprint 0 |
| R-003 | SQL migration fails at runtime | High | Blocks implementation | PostgreSQL dry-run, migration tests | Sprint 0 |
| R-004 | OpenAPI/code drift | High | Frontend/backend mismatch | OpenAPI lint and contract tests | Every sprint |
| R-005 | ApprovalDecision circular logic returns | High | Approval flow blocked | Apply Patch 001 and test approval trigger | Sprint 3 |
| R-006 | ManualPublishEvidence proof mutation | Critical | Evidence integrity loss | Patch 001, immutable fields, negative tests | Sprint 3 |
| R-007 | Usage counted for failed output | High | Commercial dispute | Require usable_output_confirmed=true | Sprint 2 |
| R-008 | CostEvent treated as billing | High | Financial/legal misrepresentation | UI/API naming, docs, tests | Sprint 2 |
| R-009 | Auto-publishing sneaks into Phase 0/1 | High | Scope and compliance risk | UI prohibition, API prohibition, backlog gate | All sprints |
| R-010 | Beautiful UI hides governance states | Medium | Wrong operational decisions | Show permissions, audit hints, hashes, states | Frontend shell |
| R-011 | AuditLog used as business state | High | Corrupted source of truth | Append-only audit, separate state tables | Sprint 4 |
| R-012 | Report snapshot mutates after evidence change | High | Client reporting dispute | Frozen snapshot payloads and regression tests | Sprint 4 |
| R-013 | Idempotency not enforced | High | Duplicate jobs/usage/publish records | Workspace-scoped idempotency table/logic | Sprint 2/3 |
| R-014 | Codex infers missing scope | High | Architecture drift | Approved-source-only instruction | Every sprint |

## Current Risk Position

The repository is ready for Codex Sprint 0 as a documentation contract, but not ready for product implementation beyond Sprint 0 until runtime validation exists.

## No-Go Conditions

1. Sprint 1 starts before Sprint 0 tests pass.
2. Any P0 tenant isolation failure remains unresolved.
3. Any P0 RBAC failure remains unresolved.
4. SQL migration has not been dry-run.
5. OpenAPI has not been linted.
6. UI adds forbidden Phase 0/1 features.
