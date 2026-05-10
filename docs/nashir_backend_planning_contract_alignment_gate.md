# Nashir Backend Planning-to-Contract Alignment Gate

| Field | Value |
|---|---|
| Document type | Documentation-only backend planning-to-contract alignment gate |
| Status date | 2026-05-10 |
| Scope | Nashir backend-only planning-to-contract alignment after PR #140 |
| Implementation approved | NO |
| Executable tests approved | NO |

## 1. Purpose

This is a Documentation-only gate after PR #140.

It refines the recommended next path: backend-only planning-to-contract alignment.

It does not authorize implementation, executable tests, runtime behavior, backend behavior, API behavior, UI behavior, SQL changes, OpenAPI changes, generated-client updates, package changes, workflow changes, migration changes, route readiness, serve readiness, link readiness, Pilot readiness, or Production readiness.

No implementation is approved by this document.

## 2. Current Authority

PR #138 established documentation-only Nashir audit event payload, ErrorModel mapping, material-change specification, evidence handling, UTM Lite, and readiness behavior.

PR #139 documented post-merge status after PR #138.

PR #140 established implementation-readiness preconditions and recommended backend-only planning-to-contract alignment as the next safest path.

No runtime/API/SQL/OpenAPI/tests/package/workflow/migration implementation is approved.

## 3. Alignment Target

Before implementation can be considered, the following must be aligned:

- Nashir planning concepts to existing backend contracts.
- ErrorModel candidates to existing canonical errors.
- RBAC and permission expectations.
- Audit event candidates.
- Idempotency expectations.
- Evidence handling.
- UTM Lite boundaries.
- Readiness behavior and gate-state semantics.

Alignment must preserve route-derived workspace context and must not trust `workspace_id` from request bodies. It must also preserve AuthGuard, WorkspaceContextGuard, MembershipCheck, PermissionGuard, and ErrorModel behavior unless a later approved contract explicitly changes them.

## 4. Required Outputs of a Future Implementation PR

A future implementation PR must include:

- Exact allowed files.
- Exact forbidden files.
- Route impact declaration.
- SQL impact declaration.
- OpenAPI impact declaration.
- ErrorModel impact declaration.
- Test strategy.
- Rollback criteria.
- Strict Verification expectations.

Any future implementation PR must also name expected CI gates, reviewer acceptance criteria, and explicit NO-GO conditions before work begins.

## 5. Explicit NO-GO

- No runtime changes in this PR.
- No SQL.
- No OpenAPI.
- No tests.
- No route/serve/link readiness.
- No prototype usage.
- No publishing.
- No analytics.
- No attribution.
- No payment/billing.
- No autonomous AI.
- No production readiness.

This gate does not approve backend behavior, API behavior, UI behavior, persistence, generated clients, package changes, workflows, migrations, executable tests, route registration, server wiring, links from existing surfaces, external integrations, paid execution, billing, invoice state, autonomous execution, Pilot readiness, or Production readiness.

## 6. Recommended Next Implementation Slice

Recommend a later, separate PR for backend repository/service skeleton or contract-alignment implementation only if reviewers approve exact allowed files and verification commands.

Do not implement it here.

That later PR should remain backend-only, avoid route exposure, avoid schema or persistence approval unless separately authorized, avoid OpenAPI approval unless separately authorized, and include rollback/no-go criteria before implementation starts.
