# DB-backed Slice 1 Brand Implementation Report

## Executive Status

```text
GO: repository-only Brand Slice 1.
NO-GO: HTTP/runtime route switch.
NO-GO: public get/update routes.
NO-GO: SQL/OpenAPI changes.
NO-GO: durable AuditLog persistence.
NO-GO: DB-backed full persistence.
NO-GO: Sprint 5.
NO-GO: Pilot.
NO-GO: Production.
```

DB-backed Slice 1 is implemented only as repository modules and repository-only integration tests for BrandProfile and BrandVoiceRule. The HTTP/runtime product routes continue to use the existing in-memory runtime unless a future approved PR explicitly switches them.

## Scope Implemented

Implemented repository-only methods:

- `BrandProfileRepository.listByWorkspace({ workspaceId })`
- `BrandProfileRepository.create({ workspaceId, input, actorUserId })`
- `BrandProfileRepository.getById({ workspaceId, brandProfileId })` for internal validation and tests only
- `BrandVoiceRuleRepository.listByBrandProfile({ workspaceId, brandProfileId })`
- `BrandVoiceRuleRepository.create({ workspaceId, brandProfileId, input })`

No public get/update routes were added. No router/store behavior changed.

## Files Changed

```text
src/repositories/brand-profile-repository.js
src/repositories/brand-voice-rule-repository.js
src/repositories/index.js
test/integration/db-backed-slice1-brand.integration.test.js
docs/db_backed_slice_1_brand_implementation_report.md
docs/17_change_log.md
```

## Repository Behavior

BrandProfile repository behavior:

- Filters every workspace-scoped query with explicit `workspace_id` constraints.
- Maps public `brand_name` to SQL `profile_name`.
- Maps public `brand_description` to SQL `brand_summary`.
- Reads `workspaces.default_locale` using workspace context and stores it in SQL `language`.
- Relies on SQL `brand_status` default internally.
- Returns only public-compatible fields: `brand_profile_id`, `workspace_id`, `brand_name`, and `brand_description`.
- Maps same-workspace duplicate brand names to `DUPLICATE_BRAND_PROFILE`.
- Allows the same brand name across different workspaces.

BrandVoiceRule repository behavior:

- Validates the parent BrandProfile belongs to the same workspace before listing or creating rules.
- Filters rule queries by `workspace_id` and `brand_profile_id`.
- Validates `rule_type` before DB insert against: `tone`, `banned_claim`, `required_phrase`, `style`, `legal`, `locale`.
- Validates `severity` before DB insert against: `info`, `warning`, `blocker`.
- Relies on SQL `rule_status` default internally.
- Returns only public-compatible fields: `brand_voice_rule_id`, `brand_profile_id`, `workspace_id`, `rule_type`, `rule_text`, and `severity`.

## Tenant Isolation Controls

- BrandProfile reads and creates require an explicit `workspaceId` input.
- BrandProfile `getById` queries by both `workspace_id` and `brand_profile_id`.
- BrandVoiceRule access validates parent BrandProfile ownership in the same workspace before rule access.
- Cross-workspace BrandProfile and BrandVoiceRule parent access returns not found behavior without leaking existence.
- Repository-level workspace filters remain mandatory even with RLS context as defense in depth.

## ErrorModel Mapping

- Duplicate BrandProfile in the same workspace maps to `DUPLICATE_BRAND_PROFILE`.
- Invalid `rule_type` maps to `VALIDATION_FAILED` before DB insert.
- Invalid `severity` maps to `VALIDATION_FAILED` before DB insert.
- Missing or cross-workspace parent BrandProfile maps to `BRAND_PROFILE_NOT_FOUND`.
- Unexpected DB failures map to sanitized `INTERNAL_ERROR`.
- Public errors do not expose raw SQL text, SQL constraint names, enum type names, stack traces, connection strings, or secrets.

## Tests Added

Added repository-only integration coverage in `test/integration/db-backed-slice1-brand.integration.test.js` for:

- BrandProfile list by workspace.
- BrandProfile create mapping `brand_name` to `profile_name`.
- BrandProfile create mapping `brand_description` to `brand_summary`.
- BrandProfile `language` populated from `workspaces.default_locale`.
- `language` and `brand_status` not exposed publicly.
- Same-workspace duplicate BrandProfile rejection.
- Cross-workspace duplicate BrandProfile allowance.
- Internal BrandProfile `getById` workspace scoping.
- BrandVoiceRule list by parent profile.
- BrandVoiceRule create with parent workspace validation.
- Invalid `rule_type` rejected before DB insert.
- Invalid `severity` rejected before DB insert.
- Accepted severity values: `info`, `warning`, `blocker`.
- `rule_status` not exposed publicly.
- Cross-workspace BrandProfile and BrandVoiceRule parent access rejected without leakage.
- RBAC `brand.read` / `brand.write` allow-deny behavior through existing RBAC repository patterns.
- Sanitized ErrorModel behavior for DB failures.

## Verification

Required verification commands for the PR gate:

```text
npm run openapi:lint:strict
npm test
npm run test:integration
npm run db:migrate:strict
npm run db:migrate:retry
npm run verify:strict
```

GitHub Actions strict verification is required on the PR head before merge.

## Explicitly Not Implemented

```text
NO-GO: HTTP/runtime route switch.
NO-GO: public get/update routes.
NO-GO: SQL changes.
NO-GO: OpenAPI changes.
NO-GO: durable AuditLog persistence.
NO-GO: DB-backed full persistence.
NO-GO: Campaign persistence.
NO-GO: BriefVersion persistence.
NO-GO: Media persistence.
NO-GO: Approval/Publish/Evidence persistence.
NO-GO: Patch 002 persistence.
NO-GO: Usage/Cost persistence.
NO-GO: Audit persistence.
NO-GO: Sprint 5.
NO-GO: Pilot.
NO-GO: Production.
```

## Remaining Blockers

- HTTP/runtime product routes still default to in-memory behavior.
- Runtime route switching requires a separate reviewed PR.
- Durable AuditLog persistence remains unimplemented.
- Product-domain repository parity beyond BrandProfile / BrandVoiceRule remains unproven.
- DB-backed full persistence remains NO-GO.
- Pilot and Production readiness remain NO-GO.

## Final Decision

```text
GO: repository-only Brand Slice 1.
NO-GO: HTTP/runtime route switch.
NO-GO: public get/update routes.
NO-GO: SQL/OpenAPI changes.
NO-GO: durable AuditLog persistence.
NO-GO: DB-backed full persistence.
NO-GO: Sprint 5.
NO-GO: Pilot.
NO-GO: Production.
```
