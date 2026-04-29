# Brand Slice 1 Runtime Switch Implementation Report

## Executive Status

```text
GO: Brand Slice 1 Runtime Switch implementation for gated Brand-only repository mode.
NO-GO: HTTP/runtime product routes are DB-backed by default.
NO-GO: public Brand get/update routes.
NO-GO: SQL/OpenAPI changes.
NO-GO: DB-backed full persistence.
NO-GO: Campaign persistence.
NO-GO: BriefVersion persistence.
NO-GO: Patch 002 DB persistence.
NO-GO: Sprint 5.
NO-GO: Pilot.
NO-GO: Production.
```

## Scope Implemented

This PR adds a gated Brand-only runtime mode. The default remains in-memory. Repository mode must be explicitly enabled with configuration.

Only these existing routes can switch when repository mode is enabled:

```text
GET /workspaces/{workspaceId}/brand-profiles
POST /workspaces/{workspaceId}/brand-profiles
GET /workspaces/{workspaceId}/brand-profiles/{brandProfileId}/rules
POST /workspaces/{workspaceId}/brand-profiles/{brandProfileId}/rules
```

No public Brand get/update routes were added. No endpoints were added or removed.

## Files Changed

```text
src/config.js
src/router.js
test/integration/db-backed-brand-runtime-switch.integration.test.js
docs/brand_slice_1_runtime_switch_implementation_report.md
```

## Configuration Behavior

Brand runtime mode is controlled by configuration:

```text
BRAND_RUNTIME_MODE=in_memory|repository
ENABLE_DB_BACKED_BRAND_ROUTES=true
```

Default behavior is `in_memory`. `ENABLE_DB_BACKED_BRAND_ROUTES=true` enables repository mode only when `BRAND_RUNTIME_MODE` is not set. Missing `DATABASE_URL` fails clearly when repository mode needs to create a DB pool.

## Runtime Behavior

When Brand repository mode is disabled:

- Existing Brand routes continue through the in-memory runtime path.
- Existing Sprint 0/1/2/3/4 and Patch 002 behavior remains unchanged.

When Brand repository mode is enabled:

- The four approved Brand list/create routes are intercepted in `src/router.js`.
- AuthGuard, WorkspaceContextGuard, MembershipCheck, PermissionGuard, and request-body workspace rejection are preserved.
- BrandProfile and BrandVoiceRule operations use the existing DB-backed repositories.
- Repository responses preserve public-compatible response fields.
- Runtime store audit remains a placeholder only; durable AuditLog persistence is not implemented or claimed.

## Response Shape

BrandProfile responses remain limited to:

```text
brand_profile_id
workspace_id
brand_name
brand_description
```

BrandVoiceRule responses remain limited to:

```text
brand_voice_rule_id
brand_profile_id
workspace_id
rule_type
rule_text
severity
```

SQL-only fields such as `language`, `brand_status`, and `rule_status` are not exposed.

## Tenant Isolation and ErrorModel

- Path `workspaceId` remains the source of truth.
- `workspace_id` in request bodies is rejected.
- Brand repository methods retain explicit workspace filters.
- Cross-workspace BrandVoiceRule parent access returns `BRAND_PROFILE_NOT_FOUND` without existence leakage.
- Duplicate same-workspace BrandProfile creation maps to `DUPLICATE_BRAND_PROFILE`.
- Invalid `rule_type` and `severity` map to `VALIDATION_FAILED`.
- Raw SQL, constraint names, enum type names, stack traces, connection strings, and secrets are not exposed in API responses.

## Tests Added

Added `test/integration/db-backed-brand-runtime-switch.integration.test.js` covering:

- Default in-memory Brand route behavior when the switch is off.
- Repository mode requiring `DATABASE_URL` when no pool is injected.
- Repository-mode BrandProfile list/create behavior.
- Public response shape preservation.
- SQL-only fields not exposed.
- Duplicate same-workspace BrandProfile conflict.
- Duplicate BrandProfile names across workspaces allowed.
- BrandVoiceRule list/create behavior.
- Invalid `rule_type` and invalid `severity` rejection.
- RBAC allow/deny behavior.
- Request-body workspace rejection.
- Cross-workspace BrandVoiceRule parent rejection without leakage.

## Verification

Required verification commands:

```text
npm run openapi:lint:strict
npm test
npm run test:integration
npm run db:seed
npm run db:migrate:strict
npm run db:migrate:retry
npm run verify:strict
```

GitHub Actions strict verification is required on the PR head before merge.

## Explicitly Not Implemented

```text
NO-GO: public Brand get/update routes.
NO-GO: new endpoints.
NO-GO: SQL changes.
NO-GO: OpenAPI changes.
NO-GO: workflow changes.
NO-GO: migration runner changes.
NO-GO: Campaign persistence.
NO-GO: BriefVersion persistence.
NO-GO: Patch 002 DB persistence.
NO-GO: DB-backed full persistence.
NO-GO: Sprint 5.
NO-GO: Pilot.
NO-GO: Production.
```

## Final Decision

```text
GO: gated Brand-only runtime switch implementation.
GO: default in-memory behavior preserved.
NO-GO: HTTP/runtime product routes are DB-backed by default.
NO-GO: public Brand get/update routes.
NO-GO: SQL/OpenAPI changes.
NO-GO: durable AuditLog persistence.
NO-GO: DB-backed full persistence.
NO-GO: Sprint 5 / Pilot / Production.
```
