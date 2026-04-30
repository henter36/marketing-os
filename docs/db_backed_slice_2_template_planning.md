# DB-backed Slice 2 Template Planning

## 1. Executive Decision

- DB-backed Slice 2 Template Planning: GO.
- Slice 2 Template implementation: NO-GO until this plan is reviewed.
- Scope candidate: PromptTemplate / ReportTemplate only.
- Repository-only first: required.
- Runtime switch: NO-GO until separately planned.
- SQL/OpenAPI changes: NO-GO unless a gap is found and a contract PR is approved.
- DB-backed full persistence: NO-GO.
- Campaign persistence: NO-GO.
- BriefVersion persistence: NO-GO.
- Patch002 DB persistence: NO-GO.
- Sprint 5 coding: NO-GO.
- Pilot: NO-GO.
- Production: NO-GO.

## 2. Purpose

Slice 2 candidate planning selected PromptTemplate / ReportTemplate as the conservative next DB-backed persistence candidate. This planning PR maps runtime behavior, SQL, OpenAPI, repository boundaries, tests, rollback, and Go/No-Go requirements before any implementation work starts.

This PR does not implement repository code, tests, SQL, OpenAPI, runtime switching, Sprint 5, Pilot, or Production readiness.

## 3. Governance Linkage

This plan follows PR #54 as the approved planning recommendation for the next DB-backed slice candidate. It also follows PR #55 as the intake and triage governance model.

This plan does not create implementation authorization. It is a planning artifact only. A future implementation PR still requires reviewed scope, allowed files, forbidden files, verification gates, and explicit Go/No-Go boundaries.

## 4. Current Architecture Baseline

The current product runtime remains mostly in-memory. Brand routes have gated repository mode only, and the default runtime remains in-memory.

Templates are not yet proven DB-backed. PromptTemplate / ReportTemplate behavior must be mapped from current runtime delegation, SQL, and OpenAPI before implementation. Durable AuditLog persistence is not implemented. DB-backed full persistence is not implemented.

## 5. Runtime Behavior Mapping To Inspect

Current top-level runtime evidence from `src/router.js`:

- `src/router.js` creates a `baseApp` from `router_sprint3` and delegates non-Brand, non-Sprint4, and non-Patch002 paths to that base app.
- PromptTemplate and ReportTemplate routes are not directly handled in the top-level `src/router.js` switch layer.
- Brand repository mode is explicitly scoped to Brand paths only and must not be copied into templates without separate runtime-switch planning.
- Sprint 4 `ClientReportSnapshot` creation directly uses `findReportTemplate(store, workspaceId, body.report_template_id)` to validate a report template by both `workspace_id` and `report_template_id`.
- `findReportTemplate` returns `REPORT_TEMPLATE_NOT_FOUND` for missing or cross-workspace report templates.
- Sprint 4 report snapshot generation uses a report template but does not make ReportTemplate persistence DB-backed.

Current store evidence from `src/store.js`:

- `src/store.js` extends the base `store_sprint3` seed store.
- It does not define PromptTemplate or ReportTemplate seed collections directly in this layer.
- Template collections and direct template route behavior appear to be inherited from the base Sprint 3 store/router layer, which is outside this PR's minimum inspected file set.

Runtime mapping status:

| Area | Current finding | Planning decision |
|---|---|---|
| PromptTemplate routes | OpenAPI exposes list/create, but top-level `src/router.js` delegates direct handling to the base app. | Map exact base runtime behavior before implementation. |
| ReportTemplate routes | OpenAPI exposes list/create, and Sprint 4 report snapshot creation validates report template by workspace. | Map exact direct list/create behavior before implementation. |
| Get/update behavior | No public template get/update route is approved by the OpenAPI evidence inspected for this plan. | Public get/update methods are deferred. |
| Workspace scoping | Report snapshot lookup scopes by `workspaceId`; direct template route scoping must be confirmed in base runtime. | Required implementation gate. |
| System/global templates | SQL tables inspected here are workspace-scoped; no system/global ownership column is present. Runtime/system behavior must be verified before implementation. | Potential blocking gap if runtime expects global templates. |
| Status handling | SQL and OpenAPI expose `draft`, `active`, `retired`; runtime default/mutation behavior is not visible in the top-level files. | Mapping addendum recommended before implementation. |
| Version behavior | SQL and OpenAPI include `version_number` for PromptTemplate; runtime increment/conflict semantics are not visible in the top-level files. | Blocking implementation gap. |
| Duplicate behavior | SQL defines uniqueness, but runtime conflict shape is not confirmed. | Blocking implementation gap. |
| RBAC | OpenAPI declares `prompt_template.read`, `prompt_template.write`, `report_template.read`, and `report_template.write`. Runtime guard behavior is delegated to the base app. | Must be proven in future tests. |
| ErrorModel | `REPORT_TEMPLATE_NOT_FOUND` exists for report snapshot use; direct template route errors need mapping. | Required before implementation. |
| Audit placeholder | OpenAPI marks create operations with audit events; durable AuditLog persistence is not implemented. | Placeholder only; no durable audit claim. |

## 6. SQL Mapping To Inspect

Authoritative SQL evidence from `docs/marketing_os_v5_6_5_phase_0_1_schema.sql`:

### `prompt_templates`

| SQL item | Exact mapping found |
|---|---|
| Primary key | `prompt_template_id uuid PRIMARY KEY DEFAULT gen_random_uuid()` |
| Workspace ownership | `workspace_id uuid NOT NULL REFERENCES workspaces(workspace_id)` |
| Name/title field | `template_name varchar(255) NOT NULL` |
| Template type/category | `template_type template_type NOT NULL` |
| Body/content field | `template_body text NOT NULL` |
| Variables | `template_variables jsonb NOT NULL DEFAULT '{}'::jsonb` |
| Status | `template_status template_status NOT NULL DEFAULT 'draft'` |
| Version | `version_number integer NOT NULL` |
| Actor | `created_by_user_id uuid NOT NULL REFERENCES users(user_id)` |
| Timestamps | `created_at timestamptz NOT NULL DEFAULT now()`, `updated_at timestamptz NOT NULL DEFAULT now()` |
| Uniqueness | `UNIQUE (workspace_id, template_name, version_number)`, `UNIQUE (prompt_template_id, workspace_id)` |
| Indexes | `idx_prompt_templates_workspace`, `idx_prompt_templates_type`, `idx_prompt_templates_status` |
| RLS | Tenant isolation policy applies through `workspace_id = app_current_workspace_id()` |
| Updated-at trigger | Included in the `set_updated_at` trigger loop |

The SQL enum `template_type` allows `caption`, `ad_copy`, `image_prompt`, `video_script`, `report`, and `reply`. The SQL enum `template_status` allows `draft`, `active`, and `retired`.

### `report_templates`

| SQL item | Exact mapping found |
|---|---|
| Primary key | `report_template_id uuid PRIMARY KEY DEFAULT gen_random_uuid()` |
| Workspace ownership | `workspace_id uuid NOT NULL REFERENCES workspaces(workspace_id)` |
| Name/title field | `template_name varchar(255) NOT NULL` |
| Body/content field | `template_body jsonb NOT NULL` |
| Status | `template_status report_template_status NOT NULL DEFAULT 'draft'` |
| Actor | `created_by_user_id uuid NOT NULL REFERENCES users(user_id)` |
| Timestamps | `created_at timestamptz NOT NULL DEFAULT now()`, `updated_at timestamptz NOT NULL DEFAULT now()` |
| Uniqueness | `UNIQUE (workspace_id, template_name)`, `UNIQUE (report_template_id, workspace_id)` |
| Indexes | `idx_report_templates_workspace`, `idx_report_templates_status` |
| RLS | Tenant isolation policy applies through `workspace_id = app_current_workspace_id()` |
| Updated-at trigger | Included in the `set_updated_at` trigger loop |

The SQL enum `report_template_status` allows `draft`, `active`, and `retired`.

SQL mapping observations:

- Both tables are workspace-scoped.
- No system/global ownership field is present.
- No locale/language field is present.
- No `updated_by_user_id` column is present.
- SQL allows updates structurally through updated-at triggers, but public update routes are not approved by the inspected OpenAPI evidence.
- Durable AuditLog write coupling is not present in these table definitions and must not be claimed by a template slice.

## 7. OpenAPI Mapping To Inspect

Authoritative OpenAPI evidence from `docs/marketing_os_v5_6_5_phase_0_1_openapi.yaml`:

### PromptTemplate endpoints

| Endpoint | Method | Operation | Permission | Audit event | Contract status |
|---|---|---|---|---|---|
| `/workspaces/{workspaceId}/prompt-templates` | GET | `listPromptTemplates` | `prompt_template.read` | Not specified | Approved contract route |
| `/workspaces/{workspaceId}/prompt-templates` | POST | `createPromptTemplate` | `prompt_template.write` | `prompt_template.created` | Approved contract route |

PromptTemplate contract evidence:

- The workspace path parameter is the source of workspace context.
- `CreatePromptTemplateRequest` is the create request schema.
- `PromptTemplateResponse` and `PromptTemplateListResponse` are the response schemas.
- The contract exposes list and create; no public get/update route is approved by the inspected path list.
- OpenAPI template type/status values align with SQL values at a high level, but exact runtime behavior still needs mapping.

### ReportTemplate endpoints

| Endpoint | Method | Operation | Permission | Audit event | Contract status |
|---|---|---|---|---|---|
| `/workspaces/{workspaceId}/report-templates` | GET | `listReportTemplates` | `report_template.read` | Not specified | Approved contract route |
| `/workspaces/{workspaceId}/report-templates` | POST | `createReportTemplate` | `report_template.write` | `report_template.created` | Approved contract route |

ReportTemplate contract evidence:

- The workspace path parameter is the source of workspace context.
- `CreateReportTemplateRequest` is the create request schema.
- `ReportTemplateResponse` and `ReportTemplateListResponse` are the response schemas.
- The contract exposes list and create; no public get/update route is approved by the inspected path list.
- ReportTemplate status values align with SQL values at a high level, but runtime defaults and conflict behavior still need mapping.

OpenAPI mapping gaps:

- Direct get/update endpoints are absent from the inspected contract and must not be implemented in Slice 2.
- If future implementation needs get-by-id, it must remain internal validation/test support only unless a contract PR approves a public route.
- If runtime behavior expects system/global templates but SQL/OpenAPI remain workspace-only, implementation must stop for a contract/gap decision.

## 8. Proposed Repository Modules

Future modules, not created by this PR:

- `PromptTemplateRepository`
- `ReportTemplateRepository`

Candidate methods are limited by existing runtime/OpenAPI evidence.

### PromptTemplateRepository

| Method | Allowed now or deferred | Inputs | Workspace isolation | Output | ErrorModel mapping | Transaction requirement | Audit expectation | Tests required |
|---|---|---|---|---|---|---|---|---|
| `listByWorkspace({ workspaceId })` | Candidate for future repository-only implementation after review | `workspaceId` | Filter by `workspace_id` | Public-compatible PromptTemplate list | DB failure sanitized; no leakage | Pool read acceptable | None durable | list, workspace isolation, response shape |
| `getById({ workspaceId, promptTemplateId })` | Internal only if needed; no public route | `workspaceId`, `promptTemplateId` | Filter by both IDs | Public-compatible PromptTemplate or null | Missing/cross-workspace maps to not found/null | Pool read acceptable | None durable | not found, cross-workspace rejection |
| `create({ workspaceId, input, actorUserId })` | Candidate after version/duplicate/status mapping is resolved | `workspaceId`, public input, `actorUserId` | Insert with path workspace only | Public-compatible PromptTemplate | duplicate, invalid type/status, DB failure sanitized | Transaction recommended due duplicate/version/status checks | Placeholder only, no durable AuditLog claim | create, duplicate, status/type validation, response shape |
| `update({ workspaceId, promptTemplateId, input, actorUserId })` | Deferred / NO-GO unless an approved route/contract supports update | `workspaceId`, ID, input, actor | Filter by both IDs | Public-compatible PromptTemplate | not found, invalid status/version conflict | Transaction required if ever approved | Placeholder only | Not planned now |

### ReportTemplateRepository

| Method | Allowed now or deferred | Inputs | Workspace isolation | Output | ErrorModel mapping | Transaction requirement | Audit expectation | Tests required |
|---|---|---|---|---|---|---|---|---|
| `listByWorkspace({ workspaceId })` | Candidate for future repository-only implementation after review | `workspaceId` | Filter by `workspace_id` | Public-compatible ReportTemplate list | DB failure sanitized; no leakage | Pool read acceptable | None durable | list, workspace isolation, response shape |
| `getById({ workspaceId, reportTemplateId })` | Internal only if needed for validation/tests; no public route | `workspaceId`, `reportTemplateId` | Filter by both IDs | Public-compatible ReportTemplate or null | `REPORT_TEMPLATE_NOT_FOUND` or safe not found mapping | Pool read acceptable | None durable | not found, cross-workspace rejection |
| `create({ workspaceId, input, actorUserId })` | Candidate after duplicate/status mapping is resolved | `workspaceId`, public input, `actorUserId` | Insert with path workspace only | Public-compatible ReportTemplate | duplicate, invalid status, DB failure sanitized | Transaction recommended due duplicate/status checks | Placeholder only, no durable AuditLog claim | create, duplicate, status validation, response shape |
| `update({ workspaceId, reportTemplateId, input, actorUserId })` | Deferred / NO-GO unless an approved route/contract supports update | `workspaceId`, ID, input, actor | Filter by both IDs | Public-compatible ReportTemplate | not found, invalid status | Transaction required if ever approved | Placeholder only | Not planned now |

## 9. Tenant Isolation Policy

- Every workspace-scoped repository method must accept `workspaceId` explicitly.
- Every query must filter by `workspace_id` unless a table is explicitly system/global.
- SQL evidence for PromptTemplate / ReportTemplate is workspace-only; if system/global template behavior exists in runtime, it must be mapped before implementation.
- Body `workspace_id` must not be trusted.
- Cross-workspace access must return not found or access denied without existence leakage.
- Tests must include `workspace-a` and `workspace-b`.
- RLS remains defense in depth, not a substitute for repository-level workspace filters.

## 10. Version / Status / Duplicate Behavior

Behavior that must be mapped before implementation:

- PromptTemplate status values: `draft`, `active`, `retired`.
- ReportTemplate status values: `draft`, `active`, `retired`.
- Runtime status defaults and whether status is accepted in create requests must be confirmed.
- PromptTemplate version behavior is a blocking mapping concern because SQL requires `version_number` and enforces uniqueness on `(workspace_id, template_name, version_number)`.
- PromptTemplate implementation must decide whether callers provide `version_number`, the repository derives it, or a mapping addendum/contract decision is required.
- Update behavior is NO-GO because public update routes are not approved by the inspected OpenAPI evidence.
- If updates are ever approved, the plan must decide whether updates mutate a row or create a new version.
- ReportTemplate duplicate behavior appears to be unique per `(workspace_id, template_name)` in SQL.
- PromptTemplate duplicate behavior appears to be unique per `(workspace_id, template_name, version_number)` in SQL.
- Duplicate behavior across different workspaces should be allowed.
- System/global duplicate rules are not applicable to inspected SQL tables, but must be mapped if runtime has global templates.
- Soft delete versus status update is not approved for public runtime behavior in this slice.
- ErrorModel mappings for duplicate, invalid status, version conflict, and not found must be explicit before implementation.

Because exact runtime duplicate/version/default behavior is not visible from the minimum inspected top-level runtime files, this plan treats the ambiguity as a blocking implementation gap and recommends a Template Runtime/SQL Mapping Addendum before implementation.

## 11. Transaction Policy

- Reads may use the pg pool with explicit workspace filters.
- Creates should be transaction-scoped if they validate duplicate, version, status, or audit placeholder behavior.
- Updates are NO-GO unless an existing contract supports update and mutation/version behavior is mapped.
- No durable AuditLog persistence claim is allowed unless an AuditLog slice is implemented.
- No idempotency requirement should be assumed unless existing runtime/OpenAPI requires it.
- If PromptTemplate version behavior is implemented, transaction handling is mandatory to avoid duplicate or skipped version races.

## 12. ErrorModel Mapping Policy

Future implementation must define mappings for:

- missing prompt template.
- missing report template.
- duplicate template.
- invalid template type/category.
- invalid status.
- version conflict if applicable.
- cross-workspace access.
- permission denied.
- validation error.
- DB failure.

Rules:

- No raw SQL.
- No constraint names.
- No enum type names.
- No stack traces.
- No connection strings, hostnames, usernames, passwords, or secrets.
- No workspace existence leakage.

## 13. Required Tests For Future Implementation

Plan tests only. This PR does not implement tests.

Required future tests:

- repository list/create/get behavior as applicable.
- workspace isolation.
- system/global template access rules if present.
- duplicate behavior.
- status validation.
- version behavior if present.
- response shape parity.
- ErrorModel consistency.
- no raw DB details exposed.
- RBAC allow/deny.
- body `workspace_id` rejection if a route accepts body.
- existing Sprint 0/1/2/3/4/Patch002/Brand/config tests still pass.
- migration and migration retry still pass.

## 14. Files Likely Changed In Future Implementation

Likely files for a future repository-only implementation PR, not created now:

- `src/repositories/prompt-template-repository.js`
- `src/repositories/report-template-repository.js`
- `src/repositories/index.js`
- `test/integration/db-backed-slice2-template.integration.test.js`
- `docs/db_backed_slice_2_template_implementation_report.md`
- `docs/17_change_log.md`

Expected not to change:

- `src/router.js` should not change in repository-only first implementation.
- `src/store.js` should not change.
- SQL/OpenAPI files should not change unless a contract gap blocks implementation.
- package files, workflow files, and migration runner scripts should not change.

## 15. Runtime Switch Policy

- Slice 2 Template implementation must be repository-only first.
- No runtime switch is allowed in the implementation PR.
- Runtime switch for templates requires separate planning after repository-only verification.
- Do not switch template routes, Campaign routes, or report routes in the same PR.
- Do not mix DB writes with in-memory reads.

## 16. Rollback Strategy

- Keep implementation small and reversible.
- Repository-only means no public runtime behavior change.
- If SQL/OpenAPI mismatch appears, stop and open a gap/contract PR.
- If tenant isolation fails, do not merge.
- If ErrorModel mapping fails, do not merge.
- If migration/retry breaks, do not merge.
- If tests require broad router/store changes, stop.

## 17. Risks

- Runtime behavior unclear.
- SQL/OpenAPI mismatch.
- Template versioning ambiguity.
- Status enum mismatch.
- System/global versus workspace ownership ambiguity.
- Duplicate behavior mismatch.
- Audit placeholder mistaken for durable audit.
- Accidentally implementing runtime switch.
- Accidental Campaign/Brief/Patch002 expansion.
- False DB-backed full persistence claim.
- Test flakiness from DB state.
- Breaking Brand runtime/config behavior while unrelated.

## 18. Go / No-Go For Future Implementation

GO only if:

- this plan is reviewed.
- runtime behavior is mapped.
- SQL mapping is confirmed.
- OpenAPI mapping is confirmed.
- repository methods are approved.
- version/status/duplicate behavior is clear.
- tests are defined.
- no SQL/OpenAPI mismatch blocks the slice.
- implementation remains repository-only.

NO-GO if:

- behavior is unclear and not documented.
- SQL table/column mismatch blocks repository methods.
- OpenAPI endpoints/schemas are absent or inconsistent.
- implementation needs runtime switch.
- implementation needs SQL/OpenAPI changes without contract PR.
- implementation mixes Campaign/Brief/Patch002 persistence.
- tenant isolation cannot be proven.
- durable audit is claimed.
- Sprint 5 scope is mixed in.

## 19. Recommended Next Step

Recommended next step: Create Template Runtime/SQL Mapping Addendum first.

Reason: SQL and OpenAPI evidence supports a narrow PromptTemplate / ReportTemplate repository-only candidate, but the exact direct runtime behavior for create/list/defaults/duplicates/version handling is delegated to the base runtime and is not fully mapped by the minimum inspected files for this planning PR. The addendum should resolve that mapping before implementation.

Do not proceed directly to implementation until the addendum confirms that repository-only implementation can proceed without SQL/OpenAPI changes, runtime switch, public get/update routes, or broader product persistence.

## 20. Final Decision

- DB-backed Slice 2 Template Planning: GO.
- Slice 2 Template implementation: NO-GO until reviewed.
- Repository-only first: required.
- Template runtime switch: NO-GO.
- DB-backed full persistence: NO-GO.
- Campaign persistence: NO-GO.
- BriefVersion persistence: NO-GO.
- Patch002 DB persistence: NO-GO.
- Sprint 5 coding: NO-GO.
- Pilot: NO-GO.
- Production: NO-GO.
