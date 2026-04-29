# Brand Slice 1 Runtime Switch Planning

## 1. Executive decision

- Brand Slice 1 Runtime Switch Planning: GO.
- Brand runtime switch implementation: NO-GO until this plan is reviewed.
- Scope candidate: switch existing approved Brand list/create routes only.
- Public Brand get/update routes: NO-GO.
- SQL/OpenAPI changes: NO-GO.
- DB-backed full persistence: NO-GO.
- Campaign persistence: NO-GO.
- BriefVersion persistence: NO-GO.
- Patch 002 DB persistence: NO-GO.
- Sprint 5 coding: NO-GO.
- Pilot: NO-GO.
- Production: NO-GO.

This planning document is documentation only. It does not implement runtime switching, change routing, change repository behavior, add endpoints, alter contracts, or authorize broader DB-backed persistence.

## 2. Purpose

Repository-only Brand Slice 1 is now implemented and verified for DB-backed BrandProfile and BrandVoiceRule repository methods. Current HTTP/runtime Brand routes still use the in-memory runtime store path.

The purpose of this plan is to define how a later, separately approved implementation PR could switch only the already-approved Brand list/create routes to repository-backed behavior safely. This plan does not approve implementation, endpoint changes, OpenAPI changes, SQL changes, full persistence, Pilot readiness, or Production readiness.

## 3. Current approved route scope

Only these existing approved routes are candidates for a later runtime switch:

- `GET /workspaces/{workspaceId}/brand-profiles`
- `POST /workspaces/{workspaceId}/brand-profiles`
- `GET /workspaces/{workspaceId}/brand-profiles/{brandProfileId}/rules`
- `POST /workspaces/{workspaceId}/brand-profiles/{brandProfileId}/rules`

No public Brand get/update routes are approved. No new endpoints are approved. No route path changes are approved.

## 4. Existing repository capabilities

Current repository-only Brand Slice 1 capabilities:

- `BrandProfileRepository.listByWorkspace`
- `BrandProfileRepository.create`
- `BrandProfileRepository.getById` for internal parent validation only
- `BrandVoiceRuleRepository.listByBrandProfile`
- `BrandVoiceRuleRepository.create`

These repositories preserve public-compatible response fields. They validate tenant isolation through explicit `workspaceId` handling, validate BrandVoiceRule `rule_type` and `severity`, map same-workspace duplicate BrandProfile creation to `DUPLICATE_BRAND_PROFILE`, and do not expose update routes.

The repositories do not implement durable AuditLog persistence. Sensitive-write audit behavior for HTTP runtime remains governed by the current approved runtime behavior until a separate durable audit slice is planned and approved.

## 5. Switch strategy options

### Option A: Hard switch Brand routes to repositories

This option would immediately route the four approved Brand endpoints to DB-backed repositories.

Pros:

- Simple runtime path once merged.
- Quickly exercises the repository implementation through the existing HTTP surface.
- Avoids long-lived mode branching.

Cons:

- Higher rollback risk if response shape, DB availability, or test isolation differs from the in-memory runtime.
- Increases chance of accidentally treating Brand as proof of DB-backed full persistence.
- Makes local and CI behavior more dependent on database availability.

### Option B: Gated Brand-only runtime mode

This option would add a narrow configuration switch for Brand routes only, with in-memory as the default and repository mode explicitly enabled for tests or reviewed environments.

Pros:

- Preserves current default behavior.
- Allows focused tests for both in-memory and repository-backed Brand route behavior.
- Provides clear rollback by disabling the gate.
- Keeps the switch limited to the four approved Brand routes.

Cons:

- Adds a small amount of configuration and routing complexity.
- Requires tests to prevent split-brain reads/writes when repository mode is enabled.
- Requires clear documentation so the gate is not mistaken for full DB-backed persistence.

### Option C: Shadow-read or dual-read verification mode

This option would keep the public write path unchanged while comparing in-memory and repository reads in a non-authoritative verification mode.

Pros:

- Low risk to public runtime behavior.
- Useful for parity discovery before an active switch.
- Can identify response-shape differences before repository mode is authoritative.

Cons:

- Does not prove repository-backed write behavior through HTTP.
- Can create noisy or inconclusive parity results if in-memory and DB seed state are not intentionally aligned.
- Dual-read/shadow behavior can grow into complex operational logic if not tightly bounded.

Recommended strategy: use a gated Brand-only runtime switch, default OFF, with tests proving both the current in-memory default and DB-backed gated mode. Do not use dual-write unless a separate strategy is approved. Do not switch all product routes.

## 6. Active path policy

In-memory remains the default runtime path unless explicit configuration enables Brand DB-backed mode.

If Brand DB-backed mode is enabled, all four approved Brand list/create routes must use repositories consistently:

- BrandProfile list
- BrandProfile create
- BrandVoiceRule list
- BrandVoiceRule create

Do not mix DB writes with in-memory reads for the same Brand routes. Do not dual-write in this phase. Do not change public response shape. Do not change SQL or OpenAPI.

## 7. Configuration policy

The future implementation PR should propose one reviewed configuration name, such as:

- `BRAND_RUNTIME_MODE=in_memory|repository`
- `ENABLE_DB_BACKED_BRAND_ROUTES=false|true`

Default behavior must preserve current in-memory runtime behavior. Missing `DATABASE_URL` in repository mode must fail safely and clearly. Repository mode must not activate accidentally in tests or production. Config naming must be reviewed in the implementation PR before merge.

## 8. Response shape policy

Existing Brand public response shape must be preserved.

BrandProfile responses must keep public names:

- `brand_profile_id`
- `workspace_id`
- `brand_name`
- `brand_description`

BrandVoiceRule responses must keep public names:

- `brand_voice_rule_id`
- `brand_profile_id`
- `workspace_id`
- `rule_type`
- `rule_text`
- `severity`

Do not expose `language`, `tone`, `brand_status`, `rule_status`, `created_by_user_id`, timestamps, or SQL-only fields unless already approved by the OpenAPI contract. No OpenAPI drift is permitted.

## 9. ErrorModel and validation policy

The runtime switch must preserve existing ErrorModel behavior.

Required mappings:

- Duplicate BrandProfile in the same workspace returns `DUPLICATE_BRAND_PROFILE`.
- Invalid `rule_type` returns `VALIDATION_FAILED`.
- Invalid `severity` returns `VALIDATION_FAILED`.
- Missing parent BrandProfile returns `BRAND_PROFILE_NOT_FOUND`.
- Cross-workspace access returns not found or access denied without existence leakage.
- DB failures return sanitized internal errors.

Responses must not expose raw SQL, constraint names, enum type names, stack traces, connection strings, hostnames, usernames, passwords, or secrets.

## 10. Tenant isolation policy

Path `workspaceId` remains the source of truth. Body `workspace_id` is never trusted.

Required enforcement:

- BrandProfile routes filter by `workspace_id`.
- BrandVoiceRule routes validate parent BrandProfile in the same workspace.
- Tests cover `workspace-a` and `workspace-b`.
- Cross-workspace IDs must not leak existence.
- RLS remains defense in depth only and must not replace route, guard, or repository-level tenant checks.

## 11. Test plan for future implementation

Future implementation tests must cover:

- Current in-memory Brand route behavior remains default when the switch is OFF.
- Repository-backed Brand route behavior works when the switch is ON.
- BrandProfile list/create response shape parity.
- BrandProfile duplicate same-workspace conflict parity.
- BrandProfile duplicate cross-workspace allowed.
- BrandVoiceRule list/create response shape parity.
- BrandVoiceRule missing parent rejection.
- BrandVoiceRule cross-workspace parent rejection.
- Invalid `rule_type` rejected before DB insert.
- Invalid `severity` rejected.
- RBAC `brand.read` and `brand.write` behavior preserved.
- ErrorModel consistency.
- No raw DB details exposed.
- No SQL/OpenAPI drift.
- Existing Sprint 0/1/2/3/4/Patch 002 tests still pass.
- Migration and migration retry still pass.

## 12. Files likely changed in future implementation

Likely future implementation files:

- `src/config.js`
- `src/router.js`
- `src/store.js` only if adapter plumbing is unavoidable; prefer not to change store behavior
- `src/repositories/index.js` only if needed
- `test/integration/db-backed-brand-runtime-switch.integration.test.js`
- `docs/brand_slice_1_runtime_switch_implementation_report.md`

SQL/OpenAPI files should not change. Package files should not change unless a blocker is discovered. Workflows should not change. The migration runner should not change. Public endpoint files/contracts should not change.

## 13. Rollback strategy

The switch must be reversible by configuration. Default OFF means existing in-memory behavior remains safe.

Do not merge if:

- repository mode fails CI;
- repository mode changes public response shape;
- tenant isolation fails;
- DB failures leak raw details;
- implementation requires SQL/OpenAPI changes.

If SQL/OpenAPI changes are required, stop and open a contract/gap PR instead of expanding the runtime switch PR.

## 14. Risk register

- Split-brain behavior between DB and in-memory.
- Accidental default switch to repository mode.
- Response shape drift.
- Duplicate behavior mismatch.
- Missing workspace `default_locale` causing create failure.
- DB failures surfacing raw details.
- RBAC drift.
- Tenant leakage.
- Test flakiness from DB state.
- Implementation expanding into public get/update routes.
- Implementation expanding into Campaign/Brief/Patch 002 persistence.
- False DB-backed full persistence claim.
- False Pilot/Production readiness claim.

## 15. Go / No-Go for future implementation

Future implementation is GO only if:

- this plan is reviewed;
- switch scope is limited to the existing approved four Brand routes;
- default remains in-memory;
- repository mode is explicitly gated;
- response shape parity tests are defined;
- tenant isolation and ErrorModel tests are defined;
- no SQL/OpenAPI changes are required;
- rollback by config is clear.

Future implementation is NO-GO if:

- new endpoints are needed;
- public Brand get/update routes are added;
- SQL/OpenAPI changes are required;
- implementation mixes Campaign/Brief/Patch 002 persistence;
- repository mode becomes default without approval;
- public response shape changes;
- tenant isolation cannot be proven;
- Sprint 5 scope is mixed in;
- Pilot/Production readiness is claimed.

## 16. Recommended next step

Proceed to Brand Slice 1 Runtime Switch Implementation PR only after this plan is reviewed, limited to gated repository mode for the four approved Brand routes, default OFF.

Do not start Slice 2 before proving runtime switching for Brand.

## 17. Final decision

- Brand Slice 1 Runtime Switch Planning: GO.
- Brand runtime switch implementation: NO-GO until reviewed.
- Brand repository-only Slice 1: GO / merged / verified.
- Brand runtime route switch: NO-GO.
- Public Brand get/update routes: NO-GO.
- DB-backed full persistence: NO-GO.
- Campaign persistence: NO-GO.
- BriefVersion persistence: NO-GO.
- Patch 002 DB persistence: NO-GO.
- Sprint 5 coding: NO-GO.
- Pilot: NO-GO.
- Production: NO-GO.
