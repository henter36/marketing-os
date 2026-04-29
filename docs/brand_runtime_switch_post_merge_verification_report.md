# Brand Runtime Switch Post-Merge Verification Report

## 1. Executive Status

```text
Brand Runtime Switch Post-Merge Verification: GO.
PR #48 Brand Slice 1 Runtime Switch: merged and verified.
Main merge commit after PR #48: c71f574.
Latest verified main after PR #49: 05a1fef.
Brand runtime switch: GO as gated Brand-only mode.
Default runtime: in-memory.
Repository mode: explicit config only.
Config validation implementation: NO-GO.
DB-backed full persistence: NO-GO.
Public Brand get/update routes: NO-GO.
SQL/OpenAPI changes: NO-GO.
Sprint 5/Pilot/Production: NO-GO.
```

This report is documentation-only. It does not implement runtime changes, config changes, repository changes, SQL changes, OpenAPI changes, tests, workflows, scripts, endpoint changes, DB-backed full persistence, Sprint 5, Pilot, or Production readiness.

## 2. What Was Verified

- PR #48 was merged to `main`.
- GitHub Actions strict verification passed after the PR #48 merge.
- PR #49 Config Validation Hardening Planning was merged after PR #48.
- GitHub Actions strict verification passed after the PR #49 merge.
- The Brand runtime switch remains gated.
- Default runtime remains in-memory.
- Only the four approved Brand routes are eligible for repository mode:
  - `GET /workspaces/{workspaceId}/brand-profiles`
  - `POST /workspaces/{workspaceId}/brand-profiles`
  - `GET /workspaces/{workspaceId}/brand-profiles/{brandProfileId}/rules`
  - `POST /workspaces/{workspaceId}/brand-profiles/{brandProfileId}/rules`
- No public Brand get/update routes were added.
- No SQL/OpenAPI/package/workflow/migration runner changes were introduced by PR #48.
- No DB-backed full persistence was introduced.
- No Sprint 5, Pilot, or Production readiness was introduced.

## 3. Files Changed By PR #48

```text
src/config.js
src/router.js
test/integration/db-backed-brand-runtime-switch.integration.test.js
docs/brand_slice_1_runtime_switch_implementation_report.md
```

## 4. Current Behavior After PR #48

Current config behavior observed from `src/config.js` and the Brand runtime switch implementation:

| Configuration state | Current behavior |
| --- | --- |
| `BRAND_RUNTIME_MODE` missing | `in_memory`, unless the legacy enable flag is set. |
| `BRAND_RUNTIME_MODE=in_memory` | `in_memory`. |
| `BRAND_RUNTIME_MODE=repository` | `repository`. |
| `ENABLE_DB_BACKED_BRAND_ROUTES=true` and `BRAND_RUNTIME_MODE` absent | `repository`. |
| `ENABLE_DB_BACKED_BRAND_ROUTES=true` and explicit `BRAND_RUNTIME_MODE=in_memory` | `in_memory`; explicit `BRAND_RUNTIME_MODE` wins. |
| Invalid explicit `BRAND_RUNTIME_MODE` | Falls back to `in_memory`. |

The invalid-mode fallback is safe from accidental DB activation because it does not silently turn on repository mode. However, it may hide misconfiguration in CI, staging, or future production-like environments.

`docs/config_validation_hardening_planning.md` exists to address this later. Config validation hardening has not been implemented.

Repository mode still requires a usable DB connection when repository mode needs to create the DB pool. Missing `DATABASE_URL` fails clearly in that path.

## 5. Scope Confirmed

Confirmed current scope:

- Brand runtime route switch is limited to gated mode.
- In-memory remains default.
- Repository mode uses existing `BrandProfileRepository` and `BrandVoiceRuleRepository`.
- Repository mode applies only to the four approved Brand list/create routes.
- Response shape remains public-compatible.
- SQL-only fields such as `language`, `brand_status`, and `rule_status` are not exposed.
- Body `workspace_id` is rejected.
- RBAC and tenant isolation are preserved.
- DB failures are sanitized through the existing ErrorModel path.
- Durable AuditLog persistence is not implemented.

## 6. Explicitly Still Not Implemented

```text
NO-GO: public Brand get/update routes.
NO-GO: new endpoints.
NO-GO: SQL changes.
NO-GO: OpenAPI changes.
NO-GO: package/workflow changes.
NO-GO: migration runner changes.
NO-GO: durable AuditLog persistence.
NO-GO: DB-backed full persistence.
NO-GO: Campaign persistence.
NO-GO: BriefVersion persistence.
NO-GO: Media/Approval/Publish/Evidence persistence.
NO-GO: Patch002 DB persistence.
NO-GO: Sprint 5.
NO-GO: Pilot.
NO-GO: Production.
```

## 7. Risks Remaining

- Invalid `BRAND_RUNTIME_MODE` fallback may hide misconfiguration.
- Repository mode still depends on `DATABASE_URL` and DB availability.
- Brand runtime switch does not prove DB-backed full persistence.
- Other product domains remain in-memory.
- Durable audit remains placeholder-only.
- Patch 002 DB persistence remains NO-GO.
- Pilot/Production readiness remains unproven.

## 8. Recommended Next Step

Recommended next step: proceed to Config Validation Hardening Implementation first, after review and approval.

Reasoning:

- Invalid explicit `BRAND_RUNTIME_MODE` currently falls back to `in_memory`.
- The fallback is safe from accidental DB activation, but it can hide misconfiguration.
- Config behavior should be explicit before expanding DB-backed runtime switching further.

Do not start DB-backed Slice 2 until config behavior is hardened. Do not start Sprint 5.

## 9. Final Decision

```text
Brand Runtime Switch Post-Merge Verification: GO.
Brand runtime switch: GO as gated Brand-only mode.
Default runtime: in-memory.
Config validation implementation: NO-GO until separately implemented.
DB-backed full persistence: NO-GO.
Sprint 5 coding: NO-GO.
Pilot: NO-GO.
Production: NO-GO.
```
