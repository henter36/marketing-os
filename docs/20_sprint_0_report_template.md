# 20 — Sprint 0 Report Template

## Purpose

Codex or the implementing developer must complete this report at the end of Sprint 0.

A Sprint 0 delivery is not accepted without this report.

---

# Sprint 0 Implementation Report

## 1. Sprint Implemented

```text
Sprint: Sprint 0 — Foundation
Date:
Implemented by:
Repository:
Branch:
Commit(s):
```

## 2. Executive Result

Select one:

```text
[ ] GO to Sprint 1
[ ] CONDITIONAL GO to Sprint 1 after listed fixes
[ ] NO-GO to Sprint 1
```

Reason:

```text

```

## 3. Files Changed

List every changed file:

```text

```

## 4. Application Baseline

| Item | Status | Notes |
|---|---|---|
| package manager selected |  |  |
| backend framework created |  |  |
| TypeScript configured |  |  |
| lint/format configured |  |  |
| environment template added |  |  |
| local run instructions added |  |  |

## 5. Database Migration

| Item | Status | Evidence |
|---|---|---|
| migration runner added |  |  |
| base schema applied |  |  |
| Patch 001 applied after base schema |  |  |
| migration command added |  |  |
| migration command passed |  |  |

Required command:

```bash
npm run db:migrate
```

Actual command used if different:

```bash

```

Migration result:

```text

```

## 6. Seed Data

| Item | Status | Notes |
|---|---|---|
| roles seeded |  |  |
| permissions seeded |  |  |
| role_permissions seeded |  |  |
| seed command added |  |  |

Required command:

```bash
npm run db:seed
```

Actual command used if different:

```bash

```

## 7. Guards Implemented

| Guard | Status | Notes |
|---|---|---|
| AuthGuard baseline |  |  |
| WorkspaceContextGuard |  |  |
| MembershipCheck |  |  |
| PermissionGuard |  |  |

## 8. ErrorModel

Required shape:

```json
{
  "code": "string",
  "message": "string",
  "user_action": "string",
  "correlation_id": "string"
}
```

Implementation status:

```text

```

## 9. Endpoints Implemented

List only Sprint 0 endpoints from OpenAPI:

```text

```

Do not list Sprint 1+ endpoints.

## 10. Tests Added

| Test Area | Test File(s) | Passed? | Notes |
|---|---|---:|---|
| migration |  |  |  |
| Patch 001 ApprovalDecision trigger |  |  |  |
| Patch 001 ManualPublishEvidence protection |  |  |  |
| tenant isolation |  |  |  |
| RBAC |  |  |  |
| ErrorModel |  |  |  |
| OpenAPI validation |  |  |  |

## 11. Required Quality Gate Results

| Command | Required | Actual Result |
|---|---:|---|
| `npm run db:migrate` | Yes |  |
| `npm run db:seed` | Yes |  |
| `npm run openapi:lint` | Yes |  |
| `npm test` | Yes |  |
| `npm run test:integration` | Yes |  |
| `npm run verify` | Yes |  |

If command names differ, document equivalents:

```text

```

## 12. Patch 001 Verification

### ApprovalDecision verification

Expected:

```text
- approved_content_hash required when decision=approved
- approved_content_hash must match MediaAssetVersion.content_hash
- valid approved decision marks MediaAssetVersion.version_status=approved
- ApprovalDecision remains append-only
```

Result:

```text

```

### ManualPublishEvidence verification

Expected:

```text
- proof fields are immutable
- DELETE is blocked
- PATCH endpoint is not exposed
- invalidate allows only evidence_status and invalidated_reason
- supersede creates new row
```

Result:

```text

```

## 13. Tenant Isolation Verification

Required checks:

```text
- workspace context required
- cross-workspace read blocked
- cross-workspace write blocked
- workspace_id from body ignored/rejected as trusted context
- app.current_workspace_id or equivalent context is enforced
```

Result:

```text

```

## 14. RBAC Verification

Required checks:

```text
- missing permission returns PERMISSION_DENIED
- unauthorized member cannot access workspace-scoped records
- role permission seed works
- endpoint permission metadata enforced
```

Result:

```text

```

## 15. OpenAPI Validation

Result:

```text

```

Deviations from OpenAPI:

```text

```

## 16. Deviations from Approved Contracts

List any deviation:

```text

```

If none:

```text
No deviations.
```

## 17. Unresolved Gaps

List gaps that remain after Sprint 0:

```text

```

## 18. Risks Introduced

List new risks introduced by implementation:

```text

```

## 19. Recommendation

Select one:

```text
[ ] Proceed to Sprint 1
[ ] Fix listed Sprint 0 gaps first
[ ] Stop and revise contracts
```

Rationale:

```text

```

## 20. Owner Approval

```text
Reviewed by:
Decision:
Date:
```
