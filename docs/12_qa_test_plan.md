# 12 — QA Test Plan

## Status

Canonical QA test plan index for Marketing OS Phase 0/1.

## Authoritative Source

Use this approved QA suite:

```text
docs/marketing_os_v5_6_5_phase_0_1_qa_test_suite.md
```

## P0 Test Families

```text
Tenant isolation
RBAC
Approval integrity
Usage and cost
Evidence immutability
Report snapshots
API ErrorModel
Idempotency behavior
OpenAPI validation
Audit immutability
Safe mode and operations
```

## Execution Requirements

1. P0 tests must be automated where possible.
2. Manual evidence is acceptable only when automation is not yet possible, and must be documented.
3. Failed P0 tests block pilot.
4. Failed tenant isolation or RBAC tests block Sprint 1.
5. Failed approval/evidence/usage tests block Sprint 4 and pilot.

## Required Commands After Implementation

```bash
npm run db:migrate
npm run db:seed
npm run openapi:lint
npm test
npm run test:integration
npm run verify
```

If the package manager is not npm, adapt commands but preserve the gates.
