# DB-backed Slice 1 BrandProfile / BrandVoiceRule Planning

## 1. Executive Decision

- DB-backed Slice 1 BrandProfile / BrandVoiceRule Planning: GO.
- Slice 1 implementation: NO-GO until this plan is reviewed.
- Scope candidate: BrandProfile / BrandVoiceRule only.
- DB-backed full persistence: NO-GO.
- Campaign persistence: NO-GO.
- BriefVersion persistence: NO-GO.
- Patch 002 persistence: NO-GO.
- Sprint 5 coding: NO-GO.
- Pilot: NO-GO.
- Production: NO-GO.

## 2. Purpose

DB-backed Slice 1 BrandProfile / BrandVoiceRule is a candidate product-domain persistence slice. Runtime/SQL parity candidate selection ranked this domain as the lowest-risk next candidate because it is narrower than Campaign lifecycle persistence and avoids BriefVersion hash, append-only, and immutability risk.

This slice should prove product-domain repository boundaries after Slice 0 without touching high-risk lifecycle, hash, approval, publish, media, evidence, usage, cost, AuditLog, or Patch 002 persistence domains.

This document is planning only. It does not approve implementation, does not add runtime behavior, and does not change the current in-memory default runtime.

## 3. Current Runtime Behavior To Map

Current runtime entrypoints are `src/router.js` and `src/store.js`. The BrandProfile and BrandVoiceRule behavior is served through the retained Sprint 0/1/2 base router/store layer that remains behind the current entrypoints. This plan records the observed current behavior without changing it.

### BrandProfile Runtime Behavior

| Behavior | Current runtime observation | Planning note |
|---|---|---|
| List | `GET /workspaces/{workspaceId}/brand-profiles` lists brand profiles filtered by `workspace_id`. | Candidate `listByWorkspace` aligns with current route behavior. |
| Create | `POST /workspaces/{workspaceId}/brand-profiles` creates a profile from `brand_name` and optional `brand_description`. | SQL uses different column names and additional required fields; mapping is required before implementation. |
| Get by id | No individual BrandProfile get route is currently exposed in the OpenAPI/runtime behavior reviewed for this slice. | Candidate repository `getById` may be useful internally, but route wiring is not approved here. |
| Update | No BrandProfile update route is currently exposed in the OpenAPI/runtime behavior reviewed for this slice. | Candidate repository `update` is a future method candidate only and needs contract review before route wiring. |
| Workspace scoping | Runtime scopes list/create by path workspace and rejects body `workspace_id`. | Repository methods must accept `workspaceId` explicitly and must not trust request bodies. |
| Status handling | Runtime BrandProfile objects do not currently expose or validate a status field. | SQL has `brand_status`; this is a parity gap. |
| Duplicate handling | Runtime rejects duplicate `brand_name` within the same workspace with `DUPLICATE_BRAND_PROFILE`. | SQL unique constraint is on `(workspace_id, profile_name)`; canonical mapping is required. |
| RBAC | List uses `brand.read`; create uses `brand.write`. | Preserve PermissionGuard behavior and permission metadata. |
| ErrorModel | Duplicate creates return conflict shape with `DUPLICATE_BRAND_PROFILE`; validation and permission failures use existing ErrorModel patterns. | DB conflicts must map to the same safe shapes without constraint names. |
| Audit placeholder | Create records `brand_profile.created` in the runtime audit placeholder path. | Durable AuditLog is not implemented by this slice. Do not claim audit persistence. |

### BrandVoiceRule Runtime Behavior

| Behavior | Current runtime observation | Planning note |
|---|---|---|
| List | `GET /workspaces/{workspaceId}/brand-profiles/{brandProfileId}/rules` validates the parent BrandProfile in the same workspace and lists matching rules. | Candidate `listByBrandProfile` aligns with current route behavior. |
| Create | `POST /workspaces/{workspaceId}/brand-profiles/{brandProfileId}/rules` validates the parent BrandProfile in the same workspace and creates a rule. | Future repository create must validate parent ownership and insert in one transaction. |
| Get by id | No individual BrandVoiceRule get route is currently exposed in the OpenAPI/runtime behavior reviewed for this slice. | Candidate `getById` may be useful internally, but route wiring is not approved here. |
| Update | No BrandVoiceRule update route is currently exposed in the OpenAPI/runtime behavior reviewed for this slice. | Candidate `update` is a future method candidate only and needs contract review before route wiring. |
| Workspace scoping | Runtime checks the parent BrandProfile by `workspaceId` before listing or creating rules. | Rule access must constrain through either `workspace_id` directly or a parent join constrained by workspace. |
| Rule relationship | Rules are stored with `brand_profile_id` and `workspace_id`; parent must belong to the same workspace. | SQL composite FK supports this relationship. |
| Severity handling | Runtime accepts `severity` values `info`, `warning`, and `blocker`; invalid severity returns `VALIDATION_FAILED`. | SQL `rule_severity` enum aligns with these values. |
| Rule type handling | Runtime requires `rule_type` but does not currently validate it against the SQL enum. | SQL `brand_rule_type` is stricter; this is a parity gap. |
| Rule status handling | Runtime BrandVoiceRule objects do not currently expose or validate `rule_status`. | SQL has `rule_status`; this is a parity gap. |
| Duplicate handling | No duplicate BrandVoiceRule behavior was found in current runtime behavior. | Do not invent duplicate semantics; document as a gap. |
| RBAC | List uses `brand.read`; create uses `brand.write`. | Preserve PermissionGuard behavior and permission metadata. |
| ErrorModel | Missing parent returns `BRAND_PROFILE_NOT_FOUND`; invalid severity returns `VALIDATION_FAILED`. | DB-backed behavior must preserve no cross-workspace existence leakage. |
| Audit placeholder | Create records `brand_voice_rule.created` in the runtime audit placeholder path. | Durable AuditLog is not implemented by this slice. Do not claim audit persistence. |

### Current Behavior Gaps

- BrandProfile runtime names use `brand_name` and `brand_description`; SQL names use `profile_name` and `brand_summary`.
- SQL `brand_profiles.language` is `NOT NULL`, but current runtime create behavior does not require or expose `language`.
- SQL supports `tone` and `brand_status`; current runtime BrandProfile behavior does not expose those fields.
- SQL constrains `brand_rule_type`; current runtime only requires `rule_type` and does not validate it against the enum.
- SQL supports `rule_status`; current runtime BrandVoiceRule behavior does not expose it.
- Current OpenAPI/runtime behavior reviewed here does not expose individual get/update routes for BrandProfile or BrandVoiceRule.
- Durable AuditLog persistence is not implemented; current audit behavior is a placeholder/runtime event pattern only.

## 4. SQL Mapping To Inspect

Authoritative SQL mapping is in `docs/marketing_os_v5_6_5_phase_0_1_schema.sql`.

### brand_profiles

| SQL element | Exact schema observation | Planning implication |
|---|---|---|
| Table | `brand_profiles` | Candidate BrandProfileRepository target table. |
| Primary key | `brand_profile_id uuid PRIMARY KEY DEFAULT gen_random_uuid()` | DB-backed create should let SQL generate IDs unless contract requires otherwise. |
| Workspace | `workspace_id uuid NOT NULL REFERENCES workspaces(workspace_id)` | Every query must filter by `workspace_id`. |
| Name | `profile_name varchar(255) NOT NULL` | Must map from runtime/OpenAPI `brand_name` before implementation. |
| Summary | `brand_summary text` | Must map from runtime/OpenAPI `brand_description` before implementation. |
| Language | `language varchar(20) NOT NULL` | Runtime does not currently require this; blocking mapping gap. |
| Tone | `tone varchar(100)` | Runtime does not currently expose this; mapping needed. |
| Status | `brand_status brand_status NOT NULL DEFAULT 'draft'` | Runtime does not currently expose this; status parity required. |
| Created by | `created_by_user_id uuid NOT NULL REFERENCES users(user_id)` | Create methods need `actorUserId`. |
| Timestamps | `created_at`, `updated_at` | `updated_at` trigger is attached to `brand_profiles`. |
| Uniqueness | `UNIQUE (workspace_id, profile_name)` and `UNIQUE (brand_profile_id, workspace_id)` | Duplicate behavior must map to `DUPLICATE_BRAND_PROFILE` without leaking constraint names. |
| Indexes | Workspace and `(workspace_id, brand_status)` indexes | Supports workspace-scoped list and status filtering if approved later. |
| RLS | Included in tenant isolation policy loop | Defense in depth only; repository filters remain mandatory. |

### brand_voice_rules

| SQL element | Exact schema observation | Planning implication |
|---|---|---|
| Table | `brand_voice_rules` | Candidate BrandVoiceRuleRepository target table. |
| Primary key | `brand_voice_rule_id uuid PRIMARY KEY DEFAULT gen_random_uuid()` | DB-backed create should let SQL generate IDs unless contract requires otherwise. |
| Parent | `brand_profile_id uuid NOT NULL` | Parent ownership must be validated in the same workspace. |
| Workspace | `workspace_id uuid NOT NULL` | Every query must filter by `workspace_id` or join to `brand_profiles` constrained by workspace. |
| Type | `rule_type brand_rule_type NOT NULL` | Runtime type validation must be reconciled with SQL enum. |
| Text | `rule_text text NOT NULL` | Aligns with current runtime required input. |
| Severity | `severity rule_severity NOT NULL DEFAULT 'warning'` | Aligns with runtime allowed values. |
| Status | `rule_status rule_status NOT NULL DEFAULT 'active'` | Runtime does not currently expose this; status parity required. |
| Created at | `created_at` | No `updated_at` was observed for this table. |
| FK | `(brand_profile_id, workspace_id)` references `brand_profiles(brand_profile_id, workspace_id)` | Supports parent-child workspace isolation. |
| Indexes | On `brand_profile_id`, `workspace_id`, and `(workspace_id, rule_type)` | Supports parent and workspace reads. |
| RLS | Included in tenant isolation policy loop | Defense in depth only; repository filters remain mandatory. |

### SQL Status And Enum Values

- `brand_status`: `draft`, `active`, `archived`.
- `brand_rule_type`: `tone`, `banned_claim`, `required_phrase`, `style`, `legal`, `locale`.
- `rule_severity`: `info`, `warning`, `blocker`.
- `rule_status`: `active`, `disabled`.

## 5. Proposed Repository Modules

Future implementation may add these modules, but this planning PR does not create them:

- `BrandProfileRepository`
- `BrandVoiceRuleRepository`

Exact filenames and module exports must be reviewed during implementation. SQL/OpenAPI changes are not expected for the preferred slice. If SQL/OpenAPI mismatch blocks the slice, implementation must stop and open a contract or gap PR instead.

### BrandProfileRepository Candidate Methods

| Method | Inputs | Workspace isolation rule | Expected output | ErrorModel mapping | Transaction requirement | Audit expectation | Tests required |
|---|---|---|---|---|---|---|---|
| `listByWorkspace({ workspaceId })` | `workspaceId` | Query `brand_profiles` with explicit `workspace_id = $1`. | Array of profiles mapped to current runtime/API shape. | DB failure maps to generic internal error; no raw SQL details. | Read may use pg pool with workspace context. | None for read, unless audit policy changes later. | List parity, tenant isolation, no cross-workspace leakage. |
| `getById({ workspaceId, brandProfileId })` | `workspaceId`, `brandProfileId` | Query by both `workspace_id` and `brand_profile_id`. | Profile object or `null`. | Missing or cross-workspace profile maps to current not-found behavior. | Read may use pg pool with workspace context. | None for read. | Found, missing, cross-workspace rejection. |
| `create({ workspaceId, input, actorUserId })` | `workspaceId`, validated input, `actorUserId` | Insert with path workspace only; ignore/reject body `workspace_id`. | Created profile mapped to current runtime/API shape. | Duplicate maps to `DUPLICATE_BRAND_PROFILE`; validation maps to `VALIDATION_FAILED`; DB failure maps to generic internal error. | Transaction recommended, required if audit/event coupling is added. | Current runtime audit placeholder is `brand_profile.created`; durable AuditLog is not included. | Create parity, duplicate behavior, invalid status or missing required fields, RBAC allow/deny, no raw DB errors. |
| `update({ workspaceId, brandProfileId, input, actorUserId })` | `workspaceId`, `brandProfileId`, validated patch input, `actorUserId` | Update by both `workspace_id` and `brand_profile_id`. | Updated profile or not found. | Missing/cross-workspace maps to not found; invalid status maps to validation error; DB failure maps to generic internal error. | Transaction recommended, required if audit/event coupling is added. | Audit placeholder only unless durable AuditLog is separately implemented. | Update parity only if route/contract approval exists; status mapping; cross-workspace rejection. |

Planning note: current reviewed OpenAPI/runtime behavior does not expose individual BrandProfile get/update routes. `getById` may be needed internally for validation, but public route wiring is not approved by this plan.

### BrandVoiceRuleRepository Candidate Methods

| Method | Inputs | Workspace isolation rule | Expected output | ErrorModel mapping | Transaction requirement | Audit expectation | Tests required |
|---|---|---|---|---|---|---|---|
| `listByBrandProfile({ workspaceId, brandProfileId })` | `workspaceId`, `brandProfileId` | Validate parent by workspace and query rules by both `workspace_id` and `brand_profile_id`. | Array of rules mapped to current runtime/API shape. | Missing/cross-workspace parent maps to `BRAND_PROFILE_NOT_FOUND`; DB failure maps to generic internal error. | Read may use pg pool with workspace context. | None for read. | List parity, parent workspace validation, cross-workspace rejection. |
| `getById({ workspaceId, brandVoiceRuleId })` | `workspaceId`, `brandVoiceRuleId` | Query rule by both `workspace_id` and `brand_voice_rule_id`. | Rule object or `null`. | Missing/cross-workspace rule maps to not found without leakage. | Read may use pg pool with workspace context. | None for read. | Found, missing, cross-workspace rejection. |
| `create({ workspaceId, brandProfileId, input, actorUserId })` | `workspaceId`, `brandProfileId`, validated input, `actorUserId` | Validate parent BrandProfile in same workspace and insert rule with same `workspace_id` in one transaction. | Created rule mapped to current runtime/API shape. | Missing parent maps to `BRAND_PROFILE_NOT_FOUND`; invalid severity/type maps to validation error; DB failure maps to generic internal error. | Required transaction for parent validation plus insert; audit coupling if added. | Current runtime audit placeholder is `brand_voice_rule.created`; durable AuditLog is not included. | Create parity, invalid severity, invalid type after reconciliation, parent workspace rejection, RBAC allow/deny. |
| `update({ workspaceId, brandVoiceRuleId, input, actorUserId })` | `workspaceId`, `brandVoiceRuleId`, validated patch input, `actorUserId` | Update by both `workspace_id` and `brand_voice_rule_id`. | Updated rule or not found. | Missing/cross-workspace maps to not found; invalid status/type/severity maps to validation error; DB failure maps to generic internal error. | Transaction recommended, required if audit/event coupling is added. | Audit placeholder only unless durable AuditLog is separately implemented. | Update parity only if route/contract approval exists; status mapping; cross-workspace rejection. |

Planning note: current reviewed OpenAPI/runtime behavior does not expose individual BrandVoiceRule get/update routes. `getById` may be useful internally, but public route wiring is not approved by this plan.

## 6. Tenant Isolation Rules

- Every repository method must accept `workspaceId` explicitly.
- No repository method may trust `workspace_id` from a request body.
- Every BrandProfile query must filter by `brand_profiles.workspace_id`.
- Every BrandVoiceRule query must filter by `brand_voice_rules.workspace_id` or join through `brand_profiles` constrained by `brand_profiles.workspace_id`.
- BrandVoiceRule access must validate that the parent BrandProfile belongs to the same workspace.
- Cross-workspace BrandProfile and BrandVoiceRule access must return not found or access denied without leaking whether the object exists elsewhere.
- Tests must include `workspace-a` and `workspace-b` fixtures.
- Database RLS remains defense in depth; explicit repository filters remain mandatory.

## 7. Status And Duplicate Behavior

Before implementation, the following must be mapped and approved:

- Allowed BrandProfile status values: SQL has `draft`, `active`, and `archived`; current runtime does not expose BrandProfile status.
- Allowed BrandVoiceRule status values: SQL has `active` and `disabled`; current runtime does not expose rule status.
- Allowed BrandVoiceRule type values: SQL has `tone`, `banned_claim`, `required_phrase`, `style`, `legal`, and `locale`; current runtime requires `rule_type` but does not validate the enum.
- BrandProfile duplicate behavior: current runtime rejects duplicate `brand_name` per workspace; SQL rejects duplicate `profile_name` per workspace. The canonical field mapping must be confirmed.
- BrandVoiceRule duplicate behavior: no duplicate rule behavior was found in current runtime behavior and no uniqueness constraint was observed for rules. Do not invent duplicate semantics.
- Active/inactive behavior: current runtime has no active/inactive filtering; SQL has `brand_status` and `rule_status`. Default SQL behavior must be mapped to runtime response behavior.
- Soft delete behavior: no soft delete route or runtime behavior was found for this domain. Do not add soft delete in Slice 1 unless separately approved.
- Duplicate and invalid status ErrorModel shapes must preserve existing conflict/validation behavior and must not expose SQL constraint names.

## 8. Transaction Policy

- Reads may use the pg pool with explicit workspace filters and workspace context for RLS defense in depth.
- Creating a BrandProfile may be a single-row transaction unless audit/event coupling is added.
- Creating a BrandVoiceRule must validate the parent BrandProfile and insert the rule in one transaction.
- Updating a BrandProfile or BrandVoiceRule must be transaction-scoped if audit placeholder or durable audit persistence is included.
- If durable AuditLog is not implemented, audit must remain documented as a placeholder only and must not be claimed as persistence.
- No idempotency requirement should be assumed unless existing runtime/OpenAPI behavior requires it. No idempotency behavior was identified for this domain in the current reviewed behavior.
- Future transaction helpers must not expose raw pg driver internals to route handlers.

## 9. ErrorModel Mapping

Future implementation must map the following without leaking raw database details:

| Condition | Required mapping |
|---|---|
| Missing BrandProfile | Existing not-found shape, using `BRAND_PROFILE_NOT_FOUND` where that is current route behavior. |
| Missing BrandVoiceRule | Existing not-found shape if an individual rule route is approved later; no existence leakage. |
| Duplicate BrandProfile | Conflict shape compatible with `DUPLICATE_BRAND_PROFILE`. |
| Duplicate BrandVoiceRule | No behavior currently defined; record as gap unless contract clarifies it. |
| Invalid BrandProfile status | Validation error if status becomes part of an approved route/input. |
| Invalid BrandVoiceRule status/type/severity | Validation error; severity already maps to current `VALIDATION_FAILED` behavior. |
| Cross-workspace access | Not found or access denied without leaking existence in another workspace. |
| DB failure | Generic internal error with correlation ID where the existing ErrorModel provides it. |
| Permission denied | Preserve existing PermissionGuard denial shape. |
| Validation error | Preserve existing validation shape and field-safe messages. |

Rules:

- No raw SQL errors.
- No constraint names.
- No stack traces.
- No connection strings, hostnames, usernames, passwords, or secrets.
- No workspace existence leakage.
- Preserve the current ErrorModel shape.

## 10. Required Parity Tests For Future Implementation

These tests are planned only and are not implemented in this PR:

- BrandProfile create/list/get/update parity, with get/update limited to approved internal repository behavior unless route approval exists.
- BrandProfile workspace isolation.
- BrandProfile duplicate behavior.
- BrandProfile invalid status behavior if status input is approved.
- BrandVoiceRule create/list/get/update parity, with get/update limited to approved internal repository behavior unless route approval exists.
- BrandVoiceRule parent BrandProfile workspace validation.
- BrandVoiceRule cross-workspace rejection.
- BrandVoiceRule invalid severity and invalid type behavior after enum reconciliation.
- RBAC allow/deny for brand operations.
- ErrorModel consistency.
- No raw DB error leakage.
- Existing Sprint 0/1/2/3/4/Patch 002 tests still pass.
- Migration and migration retry still pass.

## 11. Files Likely Changed In A Future Implementation PR

Likely future implementation files, not created by this PR:

- `src/repositories/brand-profile-repository.js`
- `src/repositories/brand-voice-rule-repository.js`
- `src/repositories/index.js`
- optionally `src/router.js` only if narrow adapter wiring is explicitly approved
- optionally `src/store.js` only if coexistence adapter metadata is explicitly required
- `test/integration/db-backed-slice1-brand.integration.test.js`
- `docs/db_backed_slice_1_brand_implementation_report.md`

SQL/OpenAPI changes are not expected. If a SQL/OpenAPI mismatch is discovered during implementation, the implementation must stop and open a contract/gap PR instead.

## 12. Coexistence Strategy

- The in-memory runtime remains default unless separately approved.
- Slice 1 may be a repository/test slice first before any runtime switch.
- Do not mix DB-backed writes with in-memory reads for the same route unless a reviewed adapter mode defines the active path clearly.
- Avoid split-brain behavior.
- No public API behavior change is allowed without explicit approval.
- Do not claim DB-backed full persistence from this slice.

## 13. Rollback Strategy

- Keep any future implementation small and reversible.
- Avoid wholesale router/store rewrites.
- Keep repository methods narrow.
- If tenant isolation fails, do not merge.
- If ErrorModel mapping fails, do not merge.
- If migration or migration retry breaks, do not merge.
- If SQL/OpenAPI mismatch appears, stop and document the gap before implementation continues.

## 14. Risks

- Duplicate behavior mismatch between runtime `brand_name` and SQL `profile_name`.
- Status enum mismatch because SQL has `brand_status` and `rule_status` while runtime does not expose them.
- Rule type mismatch because SQL constrains `brand_rule_type` while runtime currently does not validate it.
- Parent-child workspace leak if BrandVoiceRule queries do not validate parent BrandProfile ownership.
- Audit placeholder mistaken for durable audit persistence.
- Broad router/store rewrite.
- Split-brain runtime behavior if DB writes and in-memory reads are mixed.
- Raw DB error leakage through duplicate, enum, or FK failures.
- Test flakiness from shared DB state.
- Accidental Campaign/Brief/Patch002 scope creep.
- False Pilot/Production readiness claim.

## 15. Go / No-Go For Future Implementation

GO only if:

- This plan is reviewed.
- Runtime behavior is mapped.
- SQL mapping is confirmed.
- Duplicate/status/type behavior is clear.
- Repository methods are approved.
- Tests are defined.
- No SQL/OpenAPI mismatch blocks the slice.

NO-GO if:

- Behavior is unclear and not documented.
- SQL table/column mismatch blocks repository methods.
- Implementation needs OpenAPI changes.
- Implementation mixes Campaign/Brief/Patch002 persistence.
- Tenant isolation cannot be proven.
- Audit persistence is claimed without AuditLog implementation.
- Sprint 5 scope is mixed in.

## 16. Recommended Next Step

Recommended next step: create a smaller Brand runtime/SQL mapping addendum first.

Reason: this planning pass found concrete gaps that should be reconciled before implementation:

- Runtime/OpenAPI field names `brand_name` and `brand_description` need a canonical mapping to SQL `profile_name` and `brand_summary`.
- SQL requires `language`, but current runtime create behavior does not.
- SQL has BrandProfile and BrandVoiceRule status fields that current runtime does not expose.
- SQL constrains `brand_rule_type`, while current runtime currently only requires `rule_type`.
- Current reviewed routes do not expose individual get/update behavior for BrandProfile or BrandVoiceRule, while candidate repository methods include them.

After the mapping addendum is reviewed, proceed to DB-backed Slice 1 BrandProfile / BrandVoiceRule implementation only if the gaps are resolved without SQL/OpenAPI changes or scope expansion.

## 17. Final Decision

- DB-backed Slice 1 BrandProfile / BrandVoiceRule Planning: GO.
- Slice 1 implementation: NO-GO until reviewed.
- DB-backed full persistence: NO-GO.
- Campaign persistence: NO-GO.
- BriefVersion persistence: NO-GO.
- Patch 002 persistence: NO-GO.
- Sprint 5 coding: NO-GO.
- Pilot: NO-GO.
- Production: NO-GO.
