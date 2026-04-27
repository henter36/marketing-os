# 14 — Implementation Notes

## Purpose

This document captures implementation constraints for Marketing OS Phase 0/1.

## Current Repository State

The repository currently contains execution contracts and a clickable prototype. It is not yet a runnable backend/frontend application.

## Required Stack Baseline

Unless an existing stack is introduced before implementation:

```text
Backend: NestJS / TypeScript
Database: PostgreSQL
API Contract: OpenAPI 3.1
Testing: Jest + Supertest
Database Tests: Integration tests or pgTAP
Frontend: Next.js or React after backend Sprint 0
Styling: Tailwind or equivalent design system
```

## Implementation Order

```text
1. Create application baseline
2. Wire PostgreSQL migration files
3. Add environment configuration
4. Add AuthGuard baseline
5. Add WorkspaceContextGuard
6. Add MembershipCheck
7. Add PermissionGuard
8. Add ErrorModel
9. Add RBAC seed data
10. Implement Sprint 0 endpoints
11. Add P0 tests
12. Validate OpenAPI
13. Produce implementation report
```

## SQL Migration Order

```text
1. docs/marketing_os_v5_6_5_phase_0_1_schema.sql
2. docs/marketing_os_v5_6_5_phase_0_1_schema_patch_001.sql
```

## Frontend Rule

The prototype is a UX reference, not a data authority. The real frontend must call only approved OpenAPI endpoints.

## Codex Rule

Codex must not infer missing scope. If a requirement is missing, Codex must report a gap.

## Production Warning

Do not treat the current static prototype as production application code. It is for review, communication, and frontend-shell guidance only.
