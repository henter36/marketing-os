# Brand Runtime/SQL Mapping Addendum

## 1. Executive Decision

- Brand Runtime/SQL Mapping Addendum: GO.
- DB-backed Slice 1 Brand implementation: NO-GO until this addendum is reviewed.
- Scope: mapping only for BrandProfile / BrandVoiceRule.
- DB-backed full persistence: NO-GO.
- Campaign persistence: NO-GO.
- BriefVersion persistence: NO-GO.
- Patch 002 persistence: NO-GO.
- Sprint 5 coding: NO-GO.
- Pilot: NO-GO.
- Production: NO-GO.

## 2. Purpose

This addendum resolves BrandProfile / BrandVoiceRule runtime-to-SQL mapping decisions before any DB-backed Slice 1 implementation. It exists to prevent implicit field translation during implementation and to state exactly where SQL fields may be used internally without changing the public API contract.

This addendum identifies that Brand Slice 1 can proceed without SQL or OpenAPI changes only if implementation is limited to currently approved Brand list/create routes and internal validation helpers. It does not approve new endpoints, route changes, update behavior, DB-backed runtime switching, DB-backed full persistence, Pilot, or Production.

## 3. Runtime/OpenAPI To SQL Canonical Mapping Table

Direction legend:

- Public to SQL: request or route input maps into SQL storage.
- SQL to public: SQL row maps into public response shape.
- Internal only: SQL value may be used inside repository/service code but must not appear in public responses unless already approved.

### BrandProfile Mapping

| Runtime/API field | SQL table | SQL column | Direction | Default rule | Validation rule | ErrorModel mapping | Notes |
|---|---|---|---|---|---|---|---|
| `brand_profile_id` | `brand_profiles` | `brand_profile_id` | SQL to public | Let SQL generate ID on create. | Must be scoped with `workspace_id` for reads. | Missing or cross-workspace profile maps to `BRAND_PROFILE_NOT_FOUND` where current route behavior uses it. | Public response may keep `brand_profile_id`. |
| `workspaceId` from path | `brand_profiles` | `workspace_id` | Public to SQL | Use route workspace only. | Reject or ignore body `workspace_id` according to existing guard behavior; never trust body. | Body mismatch maps to existing `TENANT_CONTEXT_MISMATCH`; cross-workspace access maps to not found/access denied without leakage. | Required for every query. |
| `brand_name` | `brand_profiles` | `profile_name` | Public to SQL and SQL to public | No default; required by current runtime behavior. | Required non-empty value; duplicate within workspace conflicts. | Missing maps to `VALIDATION_FAILED`; duplicate maps to `DUPLICATE_BRAND_PROFILE`. | Canonical field translation: public `brand_name` equals SQL `profile_name`. |
| `brand_description` | `brand_profiles` | `brand_summary` | Public to SQL and SQL to public | Default to empty string in public response when absent, matching current runtime behavior. | Optional string. | Invalid type, if validated, maps to `VALIDATION_FAILED`. | Canonical field translation: public `brand_description` equals SQL `brand_summary`; SQL null should map to public empty string for compatibility. |
| `language` | `brand_profiles` | `language` | Internal only unless OpenAPI later approves public field | Use `workspaces.default_locale` as the DB-backed compatibility default. | Must be a non-empty locale string when persisted. | Missing workspace locale or invalid locale maps to `VALIDATION_FAILED` or safe internal error according to boundary. | Do not expose in public response unless OpenAPI/runtime already approves it. |
| `tone` | `brand_profiles` | `tone` | Internal only unless OpenAPI later approves public field | Default SQL value is null. | Optional if contract later exposes it. | Invalid value, if exposed later, maps to `VALIDATION_FAILED`. | Current runtime/OpenAPI behavior reviewed for this slice does not expose `tone`; do not add it to responses. |
| `brand_status` | `brand_profiles` | `brand_status` | Internal only unless OpenAPI later approves public field | Rely on SQL default `draft` for create. | Values are SQL enum `draft`, `active`, `archived`; do not accept public input unless contract-approved. | Invalid status maps to `VALIDATION_FAILED` only if status becomes contract-approved input. | Do not add `brand_status` to public response in Slice 1. |
| `created_by_user_id` / `actorUserId` | `brand_profiles` | `created_by_user_id` | Public context to SQL internal | Use authenticated actor from AuthGuard/MembershipCheck context. | Must be an existing user. | Missing/invalid actor maps to safe guard-compatible denial or generic internal error; no FK details. | Not public input. |
| timestamps | `brand_profiles` | `created_at`, `updated_at` | SQL internal unless already public | Let SQL defaults/triggers set timestamps. | Do not trust client-provided timestamps. | DB failures map to generic internal error. | Do not add timestamps to public response unless OpenAPI/runtime already approves them. |

### BrandVoiceRule Mapping

| Runtime/API field | SQL table | SQL column | Direction | Default rule | Validation rule | ErrorModel mapping | Notes |
|---|---|---|---|---|---|---|---|
| `brand_voice_rule_id` | `brand_voice_rules` | `brand_voice_rule_id` | SQL to public | Let SQL generate ID on create. | Must be scoped with `workspace_id` for reads. | Missing or cross-workspace rule maps to not found without leakage if an internal lookup is used. | Public response may keep `brand_voice_rule_id`. |
| `brand_profile_id` | `brand_voice_rules` | `brand_profile_id` | Public path to SQL | Use path parent BrandProfile only. | Parent BrandProfile must exist in the same workspace. | Missing/cross-workspace parent maps to `BRAND_PROFILE_NOT_FOUND`. | Validate parent before listing or creating rules. |
| `workspaceId` from path | `brand_voice_rules` | `workspace_id` | Public to SQL | Use route workspace only. | Reject or ignore body `workspace_id` according to existing guard behavior; never trust body. | Body mismatch maps to existing `TENANT_CONTEXT_MISMATCH`; cross-workspace access maps to not found/access denied without leakage. | Required for every query. |
| `rule_type` | `brand_voice_rules` | `rule_type` | Public to SQL and SQL to public | No default; required by current runtime behavior. | Must be one of `tone`, `banned_claim`, `required_phrase`, `style`, `legal`, `locale`. | Unsupported value maps to existing validation shape, not raw DB enum error. | This is a DB-backed validation parity requirement. |
| `rule_text` | `brand_voice_rules` | `rule_text` | Public to SQL and SQL to public | No default; required by current runtime behavior. | Required non-empty value. | Missing maps to `VALIDATION_FAILED`. | Aligns with current runtime behavior. |
| `severity` | `brand_voice_rules` | `severity` | Public to SQL and SQL to public | Current runtime requires it; SQL default is `warning`, but Slice 1 should preserve current requirement. | Must be one of `info`, `warning`, `blocker`. | Unsupported value maps to `VALIDATION_FAILED`. | Preserve current public behavior instead of relying on SQL default. |
| `rule_status` | `brand_voice_rules` | `rule_status` | Internal only unless OpenAPI later approves public field | Rely on SQL default `active` for create. | Values are SQL enum `active`, `disabled`; do not accept public input unless contract-approved. | Invalid status maps to `VALIDATION_FAILED` only if status becomes contract-approved input. | Do not add `rule_status` to public response in Slice 1. |
| created_at | `brand_voice_rules` | `created_at` | SQL internal unless already public | Let SQL default set timestamp. | Do not trust client-provided timestamp. | DB failures map to generic internal error. | Do not add `created_at` to public response unless OpenAPI/runtime already approves it. |

## 4. Decision On `language`

Decision: use Option B.

DB-backed Slice 1 Brand implementation should populate `brand_profiles.language` from the existing workspace default locale stored as `workspaces.default_locale`. This is already present in the authoritative SQL schema and lets the implementation satisfy `language NOT NULL` without adding a new request field, changing OpenAPI, or changing public runtime behavior.

Rules:

- Do not require public `language` input in Slice 1 unless existing OpenAPI evidence is updated in a separate contract PR.
- Do not add `language` to public BrandProfile responses in Slice 1.
- On BrandProfile create, repository code should read the current workspace's `default_locale` inside the same operation or transaction boundary used for the insert.
- If the workspace is missing, cross-workspace, or has no usable default locale, return the existing safe not-found/validation/internal-error mapping without leaking SQL details.
- If a future contract exposes `language`, that must be handled by a separate OpenAPI/runtime mapping PR before implementation changes public behavior.

This resolves the `language NOT NULL` gap for Slice 1 without SQL/OpenAPI changes.

## 5. Decision On `brand_status`

If runtime/API does not expose `brand_status`, DB-backed create should rely on SQL default `draft`.

Rules:

- Do not accept public `brand_status` input in Slice 1.
- Do not add `brand_status` to BrandProfile public responses in Slice 1 unless OpenAPI/runtime already approves it.
- Repository rows may include `brand_status` internally for future filtering or diagnostics, but route/service mapping must explicitly select the existing public response fields only.
- If future status filtering or active/inactive behavior is needed, it requires a separate contract/runtime decision.

## 6. Decision On `rule_status`

If runtime/API does not expose `rule_status`, DB-backed create should rely on SQL default `active`.

Rules:

- Do not accept public `rule_status` input in Slice 1.
- Do not add `rule_status` to BrandVoiceRule public responses in Slice 1 unless OpenAPI/runtime already approves it.
- Repository rows may include `rule_status` internally only if needed for later filtering, but public response mapping must preserve the existing contract.
- Do not silently filter out disabled rules in Slice 1 unless current runtime/OpenAPI behavior already requires that filtering.

## 7. Decision On `rule_type`

SQL enum values for `brand_voice_rules.rule_type` are:

- `tone`
- `banned_claim`
- `required_phrase`
- `style`
- `legal`
- `locale`

Decision: DB-backed runtime/API behavior must reject unsupported `rule_type` values before DB insert.

Rules:

- Validate `rule_type` in repository/service logic before insert.
- Map unsupported values to the existing validation ErrorModel shape, using `VALIDATION_FAILED` unless a more specific existing code is already approved.
- Do not rely on PostgreSQL enum errors for public validation.
- Do not expose SQL enum type names, raw SQL text, driver messages, or constraint internals in API responses.
- If OpenAPI already documents enum values, use those values. If OpenAPI does not document them, treat the SQL enum as DB-backed validation parity for Slice 1 and flag OpenAPI alignment as a future documentation/contract cleanup item, not an implementation blocker for the existing list/create routes.

## 8. Decision On Get/Update Routes

No new public get/update routes may be added in Slice 1 implementation unless they already exist in OpenAPI.

Rules:

- Slice 1 implementation must not add public `GET /workspaces/{workspaceId}/brand-profiles/{brandProfileId}`.
- Slice 1 implementation must not add public `PATCH /workspaces/{workspaceId}/brand-profiles/{brandProfileId}`.
- Slice 1 implementation must not add public `GET /workspaces/{workspaceId}/brand-profiles/{brandProfileId}/rules/{brandVoiceRuleId}`.
- Slice 1 implementation must not add public `PATCH /workspaces/{workspaceId}/brand-profiles/{brandProfileId}/rules/{brandVoiceRuleId}`.
- Repository `getById` may exist internally for parent validation and tests.
- Repository `update` methods should not be implemented unless existing runtime/OpenAPI exposes update behavior or a separate contract PR approves it.
- Slice 1 implementation should prefer only methods required by existing approved routes.

Current approved route scope for Slice 1 is:

- `GET /workspaces/{workspaceId}/brand-profiles`
- `POST /workspaces/{workspaceId}/brand-profiles`
- `GET /workspaces/{workspaceId}/brand-profiles/{brandProfileId}/rules`
- `POST /workspaces/{workspaceId}/brand-profiles/{brandProfileId}/rules`

## 9. Duplicate Behavior

- BrandProfile duplicate conflict maps public `brand_name` to SQL `profile_name`.
- Duplicate within the same workspace must return the existing `DUPLICATE_BRAND_PROFILE` ErrorModel shape.
- Duplicate across different workspaces must be allowed.
- SQL uniqueness on `(workspace_id, profile_name)` is the DB constraint counterpart for the existing runtime duplicate behavior.
- Do not expose SQL constraint names in public errors.
- Do not invent duplicate BrandVoiceRule behavior unless SQL/runtime contract requires it.
- Since no BrandVoiceRule uniqueness constraint was observed and current runtime does not define duplicate rule rejection, Slice 1 must not invent duplicate BrandVoiceRule conflicts.

## 10. Response Shape Policy

- DB-backed implementation must preserve existing public response shape.
- SQL-only fields must not appear in API responses unless already present in OpenAPI/runtime behavior.
- Internal repository rows may contain additional SQL fields, but router/service mapping must explicitly select public fields.
- Public BrandProfile responses should keep current public fields such as `brand_profile_id`, `workspace_id`, `brand_name`, and `brand_description`.
- Public BrandVoiceRule responses should keep current public fields such as `brand_voice_rule_id`, `brand_profile_id`, `workspace_id`, `rule_type`, `rule_text`, and `severity`.
- Do not add `language`, `tone`, `brand_status`, `rule_status`, `created_by_user_id`, `created_at`, or `updated_at` to public responses unless a separate OpenAPI/runtime approval exists.
- No OpenAPI drift is allowed.

## 11. Tenant Isolation Policy

- BrandProfile queries must filter by `brand_profiles.workspace_id`.
- BrandVoiceRule queries must filter by `brand_voice_rules.workspace_id` and validate the parent `brand_profile_id` belongs to the same workspace.
- Parent BrandProfile validation for BrandVoiceRule list/create must happen before rule records are returned or inserted.
- Cross-workspace profile/rule access must return not found or access denied without existence leakage.
- Body `workspace_id` must not be trusted for any BrandProfile or BrandVoiceRule persistence decision.
- Tests must include `workspace-a` and `workspace-b`.
- RLS remains defense in depth and does not replace explicit repository filters.

## 12. ErrorModel Mapping Policy

| Condition | Required ErrorModel mapping |
|---|---|
| Missing brand profile | Existing not-found shape; use `BRAND_PROFILE_NOT_FOUND` where current route behavior uses it. |
| Cross-workspace brand profile | Same as missing brand profile or access denied, without existence leakage. |
| Duplicate brand profile | `DUPLICATE_BRAND_PROFILE` conflict shape. |
| Missing parent brand profile for rule creation | `BRAND_PROFILE_NOT_FOUND`. |
| Invalid `rule_type` | `VALIDATION_FAILED` or existing approved validation shape; no SQL enum error. |
| Invalid `severity` | Existing `VALIDATION_FAILED` shape. |
| Invalid `language` if applicable | Validation or safe internal mapping; no SQL details. |
| DB failure | Generic internal error with existing correlation behavior; no SQL details. |
| Permission denied | Existing PermissionGuard `PERMISSION_DENIED` shape. |
| Validation error | Existing validation shape with field-safe message. |

Rules:

- No SQL text.
- No enum type names in public errors.
- No constraint names.
- No stack traces.
- No connection strings, hostnames, usernames, passwords, or secrets.
- No workspace existence leakage.

## 13. Updated Implementation Recommendation

Recommendation: proceed to DB-backed Slice 1 Brand implementation only after this addendum is reviewed.

This recommendation is conditional and narrow:

- Mapping is resolved without SQL/OpenAPI changes by translating public fields to SQL columns explicitly.
- `language` is resolved through `workspaces.default_locale` and remains internal.
- `brand_status` and `rule_status` rely on SQL defaults and remain internal.
- `rule_type` must be validated before insert.
- Implementation is limited to existing approved Brand routes.
- Update methods are deferred unless separately approved.
- Public response shape is preserved.

If implementation discovers that OpenAPI requires fields not represented here, or that SQL cannot satisfy the route behavior without contract changes, implementation must stop and open a contract/gap PR first.

## 14. Future Implementation Scope Allowed After Addendum

If proceeding after review, future implementation should be limited to:

- `BrandProfileRepository.listByWorkspace`
- `BrandProfileRepository.create`
- internal `BrandProfileRepository.getById` for parent validation if needed
- `BrandVoiceRuleRepository.listByBrandProfile`
- `BrandVoiceRuleRepository.create`
- no update unless contract-approved
- no new endpoints
- no SQL changes
- no OpenAPI changes
- tests for mapping, tenant isolation, duplicates, invalid enum/type, invalid severity, and ErrorModel behavior

Explicitly not allowed in the future Brand Slice 1 implementation:

- Campaign persistence.
- BriefVersion persistence.
- Media/Approval/Publish/Evidence persistence.
- Patch 002 persistence.
- DB-backed full persistence.
- Router/store wholesale rewrite.
- New endpoints.
- Sprint 5.
- Pilot.
- Production.

## 15. Final Decision

- Brand Runtime/SQL Mapping Addendum: GO.
- DB-backed Slice 1 Brand implementation: NO-GO until reviewed.
- DB-backed full persistence: NO-GO.
- Campaign persistence: NO-GO.
- BriefVersion persistence: NO-GO.
- Patch 002 persistence: NO-GO.
- Sprint 5 coding: NO-GO.
- Pilot: NO-GO.
- Production: NO-GO.
