# DB-backed Slice 2 Template Runtime/SQL Mapping Addendum

## 1. Executive decision

- Template Runtime/SQL Mapping Addendum: GO.
- Slice 2 Template implementation: NO-GO until this addendum is reviewed.
- Scope candidate: PromptTemplate / ReportTemplate only.
- Repository-only first remains required.
- Template runtime switch: NO-GO.
- SQL/OpenAPI changes: NO-GO unless a gap is found and a separate contract PR is approved.
- DB-backed full persistence: NO-GO.
- Campaign persistence: NO-GO.
- BriefVersion persistence: NO-GO.
- Patch002 DB persistence: NO-GO.
- Sprint 5 coding: NO-GO.
- Pilot: NO-GO.
- Production: NO-GO.

## 2. Purpose

PR #61 found that SQL and OpenAPI support a narrow PromptTemplate / ReportTemplate repository-only candidate. PR #61 also found that runtime behavior for create/list/defaults/duplicates/version handling was not fully mapped because the active `src/router.js` delegates template behavior to the base runtime.

This addendum resolves or documents those mapping gaps before any Slice 2 implementation decision. It does not authorize implementation, repository creation, tests, runtime switching, SQL changes, OpenAPI changes, Sprint 5, Pilot, or Production readiness.

## 3. Governance linkage

This addendum follows PR #54, PR #55, and PR #61. It complies with `AGENTS.md` and the intake and triage operating model by treating this as a planning/mapping artifact only.

An issue, proposal, fit/gap document, planning document, or mapping addendum does not authorize implementation. Any future implementation PR still requires approved scope, allowed files, forbidden files, and verification gates.

## 4. Files inspected

Authoritative status/governance files inspected:

- `README.md`
- `AGENTS.md`
- `docs/marketing_os_intake_and_triage_operating_model.md`
- `docs/17_change_log.md`
- `docs/db_backed_slice_2_candidate_planning.md`
- `docs/db_backed_slice_2_template_planning.md`
- `docs/db_backed_repository_architecture_contract.md`
- `docs/runtime_sql_parity_matrix.md`
- `docs/runtime_sql_parity_gap_register.md`
- `docs/runtime_sql_parity_test_plan.md`

SQL/OpenAPI/QA contract files inspected:

- `docs/marketing_os_v5_6_5_phase_0_1_schema.sql`
- `docs/marketing_os_v5_6_5_phase_0_1_schema_patch_001.sql`
- `docs/marketing_os_v5_6_5_phase_0_1_schema_patch_002.sql`
- `docs/marketing_os_v5_6_5_phase_0_1_openapi.yaml`
- `docs/marketing_os_v5_6_5_phase_0_1_openapi_patch_002.yaml`
- `docs/marketing_os_v5_6_5_phase_0_1_qa_test_suite.md`

Runtime/store files inspected for mapping only:

- `src/router.js`
- `src/store.js`
- `src/config.js`
- `src/repositories/index.js`
- `package.json`
- `.github/workflows/sprint0-verify.yml`

Delegated base runtime/store files found and inspected:

- `src/router_sprint3.js`
- `src/store_sprint3.js`
- `router.js`
- `store.js`

## 5. Runtime route mapping

| Route | Status | Handler location | Workspace source | Body fields accepted | Body workspace_id | RBAC guard | Success shape | Error/audit behavior |
|---|---|---|---|---|---|---|---|---|
| PromptTemplate list | Present: `GET /workspaces/{workspaceId}/prompt-templates` | Base `router.js`, `routeSprint1` | Path `workspaceId` through workspace context guard | None | Not applicable | `prompt_template.read` | `{ data: store.promptTemplates filtered by workspace_id }` | Existing guard/ErrorModel behavior; no audit event for list |
| PromptTemplate create | Present: `POST /workspaces/{workspaceId}/prompt-templates` | Base `router.js`, `routeSprint1` | Path `workspaceId` through workspace context guard | `template_name`, `template_type`, `template_body`, `version_number`, optional `variables` | Rejected by `rejectBodyWorkspaceId` | `prompt_template.write` | `201 { data: template }` with `variables` field | Missing fields map to `VALIDATION_FAILED`; duplicate workspace/name/version maps to `DUPLICATE_TEMPLATE_VERSION`; audit placeholder `prompt_template.created` |
| PromptTemplate get | Absent | Not present in inspected runtime or OpenAPI path list | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable | Public get remains NO-GO; internal repository `getById` only if needed later |
| PromptTemplate update | Absent | Not present in inspected runtime or OpenAPI path list | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable | Public update remains NO-GO |
| ReportTemplate list | Present: `GET /workspaces/{workspaceId}/report-templates` | Base `router.js`, `routeSprint1` | Path `workspaceId` through workspace context guard | None | Not applicable | `report_template.read` | `{ data: store.reportTemplates filtered by workspace_id }` | Existing guard/ErrorModel behavior; no audit event for list |
| ReportTemplate create | Present: `POST /workspaces/{workspaceId}/report-templates` | Base `router.js`, `routeSprint1` | Path `workspaceId` through workspace context guard | `template_name`, `report_type`, `template_body` | Rejected by `rejectBodyWorkspaceId` | `report_template.write` | `201 { data: template }` with `report_type` field | Missing fields map to `VALIDATION_FAILED`; no runtime duplicate check; audit placeholder `report_template.created` |
| ReportTemplate get | Absent as public route | `src/router.js` has internal `findReportTemplate` for client report snapshot validation only | Path `workspaceId` when validating snapshot input | Not applicable | Not applicable | Not public | Not public | Internal missing template maps to `REPORT_TEMPLATE_NOT_FOUND` |
| ReportTemplate update | Absent | Not present in inspected runtime or OpenAPI path list | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable | Public update remains NO-GO |

## 6. Store behavior mapping

PromptTemplate in-memory behavior:

- Collection name: `store.promptTemplates`.
- Seed data: `prompt-template-a` in `workspace-a` and `prompt-template-b` in `workspace-b`.
- List behavior: filters by `workspace_id` exactly.
- Create behavior: appends a new object to `store.promptTemplates`.
- Get behavior: no public prompt template get route; helper `findPromptTemplate` exists for MediaJob validation.
- Update behavior: absent.
- Default values: `variables` defaults to an empty array when omitted.
- Status handling: no runtime `template_status` field is set or exposed.
- Version handling: `version_number` is required from request body; runtime does not derive or increment it.
- Duplicate behavior: duplicate `(workspace_id, template_name, version_number)` is rejected with `DUPLICATE_TEMPLATE_VERSION`.
- Workspace scoping: path workspace only; body `workspace_id` is rejected.
- System/global template behavior: not found in inspected runtime seed or routes.
- Audit placeholder: create writes `prompt_template.created` to the in-memory audit log.

ReportTemplate in-memory behavior:

- Collection name: `store.reportTemplates`.
- Seed data: `report-template-a` in `workspace-a` only.
- List behavior: filters by `workspace_id` exactly.
- Create behavior: appends a new object to `store.reportTemplates`.
- Get behavior: no public route; internal `findReportTemplate` validates `report_template_id` in client report snapshot creation.
- Update behavior: absent.
- Default values: no runtime default beyond storing fields supplied by the request.
- Status handling: no runtime `template_status` field is set or exposed.
- Version handling: no runtime version field for report templates.
- Duplicate behavior: no runtime duplicate check was found.
- Workspace scoping: path workspace only; body `workspace_id` is rejected.
- System/global template behavior: not found in inspected runtime seed or routes.
- Audit placeholder: create writes `report_template.created` to the in-memory audit log.

## 7. Runtime vs OpenAPI parity

| Area | Classification | Evidence / note |
|---|---|---|
| PromptTemplate list endpoint | Confirmed parity | Runtime and OpenAPI expose `GET /workspaces/{workspaceId}/prompt-templates`. |
| PromptTemplate create endpoint | Confirmed parity with field gap | Runtime and OpenAPI expose `POST /workspaces/{workspaceId}/prompt-templates`, but runtime uses optional `variables` while OpenAPI/SQL naming is `template_variables`. |
| PromptTemplate get/update endpoints | Confirmed parity | Public get/update routes were not found in runtime or OpenAPI. |
| PromptTemplate required fields | Confirmed parity | Runtime requires `template_name`, `template_type`, `template_body`, and `version_number`, matching the create-version contract shape. |
| PromptTemplate `template_type` validation | Runtime gap | OpenAPI documents allowed template type values; runtime accepts any `template_type` before persistence. Future DB-backed create must validate before insert. |
| PromptTemplate status | Runtime gap | OpenAPI/SQL expose a template status concept; runtime does not set or expose `template_status`. |
| PromptTemplate body `workspace_id` | Confirmed parity | Runtime rejects body `workspace_id`; OpenAPI global rules do not trust body workspace IDs. |
| PromptTemplate permissions | Confirmed parity | Runtime uses `prompt_template.read` and `prompt_template.write`; OpenAPI documents the same permission names. |
| PromptTemplate audit event | Confirmed parity | Runtime create uses `prompt_template.created`, matching OpenAPI audit event. |
| ReportTemplate list endpoint | Confirmed parity | Runtime and OpenAPI expose `GET /workspaces/{workspaceId}/report-templates`. |
| ReportTemplate create endpoint | Implementation blocker | Runtime requires and returns `report_type`; OpenAPI create/response contract does not establish `report_type` as an approved field. |
| ReportTemplate get/update endpoints | Confirmed parity | Public get/update routes were not found in runtime or OpenAPI. |
| ReportTemplate duplicate behavior | Runtime gap | Runtime has no duplicate check; OpenAPI does not settle conflict behavior, while SQL has a uniqueness constraint. |
| ReportTemplate status | Runtime gap | OpenAPI/SQL expose `template_status`; runtime does not set or expose it. |
| ReportTemplate body `workspace_id` | Confirmed parity | Runtime rejects body `workspace_id`; OpenAPI global rules do not trust body workspace IDs. |
| ReportTemplate permissions | Confirmed parity | Runtime uses `report_template.read` and `report_template.write`; OpenAPI documents the same permission names. |
| ReportTemplate audit event | Confirmed parity | Runtime create uses `report_template.created`, matching OpenAPI audit event. |

## 8. Runtime vs SQL parity

| Area | Classification | Evidence / note |
|---|---|---|
| `prompt_templates` table | Confirmed parity | SQL table exists with `prompt_template_id`, `workspace_id`, `template_name`, `template_type`, `template_body`, `template_variables`, `template_status`, `version_number`, `created_by_user_id`, timestamps, uniqueness, indexes, and RLS. |
| PromptTemplate core fields | Confirmed parity with mapping decision | Runtime core fields align except `variables` vs SQL `template_variables`. |
| PromptTemplate `template_variables` | SQL/runtime gap | SQL uses `template_variables jsonb NOT NULL DEFAULT '{}'`; runtime uses `variables` array. |
| PromptTemplate `template_status` | Non-blocking gap if internal only | SQL defaults `template_status` to `draft`; runtime does not expose it. Future repository create can rely on SQL default internally, but public response mapping must avoid contract drift. |
| PromptTemplate `template_type` | SQL/runtime gap | SQL enum values are `caption`, `ad_copy`, `image_prompt`, `video_script`, `report`, `reply`; runtime does not validate enum before insert. |
| PromptTemplate version | Confirmed parity | Runtime requires `version_number`; SQL requires `version_number`; duplicate uniqueness is `(workspace_id, template_name, version_number)`. |
| PromptTemplate ownership | Confirmed parity | SQL is workspace scoped and RLS protected; runtime filters by workspace path. |
| `report_templates` table | Confirmed parity | SQL table exists with `report_template_id`, `workspace_id`, `template_name`, `template_body`, `template_status`, `created_by_user_id`, timestamps, uniqueness, indexes, and RLS. |
| ReportTemplate `report_type` | Implementation blocker | Runtime requires and returns `report_type`; SQL has no `report_type` column. |
| ReportTemplate `template_status` | Non-blocking gap if internal only | SQL defaults `template_status` to `draft`; runtime does not expose it. |
| ReportTemplate duplicate behavior | SQL/runtime gap | SQL uniqueness is `(workspace_id, template_name)`; runtime does not reject duplicates before persistence. |
| ReportTemplate ownership | Confirmed parity | SQL is workspace scoped and RLS protected; runtime filters by workspace path. |
| System/global templates | Confirmed absent in current evidence | No inspected runtime seed/routes or SQL fields establish system/global template ownership. |
| Timestamps | Non-blocking gap | SQL owns timestamps; runtime seed/create objects do not expose timestamps. |
| `created_by_user_id` | Confirmed implementation requirement | SQL requires it; runtime has authenticated `user.user_id` available at create time. |

## 9. PromptTemplate repository-readiness decision

| Candidate method | Decision | Reason | Required input | Expected output | Workspace isolation rule | ErrorModel mapping | Transaction requirement | Tests required | SQL/OpenAPI change needed first |
|---|---|---|---|---|---|---|---|---|---|
| `listByWorkspace` | CONDITIONAL GO | Runtime/OpenAPI/SQL list shape exists, but response field mapping must settle `variables` vs `template_variables` and status exposure. | `{ workspaceId }` | Public-compatible prompt template rows for the workspace only. | Filter by `workspace_id`; do not trust body data. | DB failure maps to sanitized internal error. | Read via pool is sufficient. | workspace-a/workspace-b isolation; response shape parity; no raw DB details. | No, if public mapping decision is documented before implementation. |
| `getById` | CONDITIONAL GO internal only | No public get route exists, but internal validation may need workspace-scoped lookup. | `{ workspaceId, promptTemplateId }` | Prompt template or null/not found for same workspace only. | Filter by both `workspace_id` and `prompt_template_id`. | Missing/cross-workspace template maps to existing not-found behavior without leakage. | Read via pool is sufficient. | same-workspace hit, cross-workspace miss, missing ID. | No. |
| `create` | CONDITIONAL GO | Runtime/OpenAPI/SQL mostly align, but implementation must resolve `variables` -> `template_variables`, validate `template_type`, use request `version_number`, set `created_by_user_id`, and rely on SQL `template_status` default internally. | `{ workspaceId, input, actorUserId }` with `template_name`, `template_type`, `template_body`, `version_number`, optional variables/template variables. | Public-compatible created prompt template. | Insert explicit `workspace_id`; reject body `workspace_id` at route/service boundary if a future runtime switch is planned. | Duplicate maps to `DUPLICATE_TEMPLATE_VERSION`; invalid type maps to `VALIDATION_FAILED`; DB failure sanitized. | Transaction recommended for validation plus insert and any audit placeholder coupling; durable AuditLog remains out of scope. | create mapping, duplicate version, invalid enum before insert, tenant isolation, created_by_user_id, status not exposed unless approved. | No, if variable/status mapping is decided first. |
| `update` | NO-GO | No public update route or approved mutation/version policy exists. | Not approved. | Not approved. | Not approved. | Not approved. | Not approved. | Not approved. | Yes, would require separate contract/runtime decision. |

## 10. ReportTemplate repository-readiness decision

| Candidate method | Decision | Reason | Required input | Expected output | Workspace isolation rule | ErrorModel mapping | Transaction requirement | Tests required | SQL/OpenAPI change needed first |
|---|---|---|---|---|---|---|---|---|---|
| `listByWorkspace` | CONDITIONAL GO | Runtime/OpenAPI/SQL list route/table exists, but runtime seed exposes `report_type`, which SQL/OpenAPI do not support. | `{ workspaceId }` | Public-compatible report templates for the workspace only. | Filter by `workspace_id`. | DB failure maps to sanitized internal error. | Read via pool is sufficient. | workspace-a/workspace-b isolation; response shape parity; no raw DB details. | No for SQL list fields, but `report_type` response policy must be resolved. |
| `getById` | CONDITIONAL GO internal only | No public get route exists; internal validation already exists for client report snapshot creation. | `{ workspaceId, reportTemplateId }` | Report template or null/not found for same workspace only. | Filter by both `workspace_id` and `report_template_id`. | Missing/cross-workspace template maps to `REPORT_TEMPLATE_NOT_FOUND` or existing not-found behavior without leakage. | Read via pool is sufficient. | same-workspace hit, cross-workspace miss, missing ID. | No. |
| `create` | NO-GO | Runtime requires `report_type`, while SQL/OpenAPI do not define `report_type`; persisting create without a decision would either drop a runtime field or invent storage. | Not approved until `report_type` is resolved. | Not approved. | Insert must eventually use explicit `workspace_id`. | Duplicate and validation mapping must be defined before implementation. | Transaction recommended after mapping is approved. | report_type decision tests, duplicate behavior, status default, tenant isolation, no raw DB details. | A separate runtime/contract decision is needed first. |
| `update` | NO-GO | No public update route or approved mutation policy exists. | Not approved. | Not approved. | Not approved. | Not approved. | Not approved. | Not approved. | Yes, would require separate contract/runtime decision. |

## 11. Blocking gaps

The following gaps block immediate Slice 2 Template implementation:

1. ReportTemplate create requires and returns `report_type` in runtime, but SQL and OpenAPI do not define `report_type`.
2. PromptTemplate create/list uses runtime field `variables`, while SQL/OpenAPI use `template_variables`.
3. PromptTemplate runtime does not validate `template_type` against SQL/OpenAPI enum values before persistence.
4. Runtime does not set or expose `template_status` for prompt or report templates, while SQL/OpenAPI define status fields/defaults.
5. ReportTemplate runtime duplicate behavior is absent, while SQL has a unique `(workspace_id, template_name)` constraint.
6. Public get/update routes are absent for both template domains; update must remain NO-GO and get must remain internal-only unless a separate contract decision approves public routes.

## 12. Non-blocking gaps

The following gaps are non-blocking if explicitly handled in a future repository-only implementation plan:

1. SQL timestamps can remain DB-owned and need not be exposed unless already public contract fields require them.
2. SQL `created_by_user_id` can be populated from the authenticated actor passed to repository create methods.
3. SQL RLS exists but remains defense in depth; repository filters must still explicitly constrain `workspace_id`.
4. No system/global templates were found, so repository-only Slice 2 can remain workspace-scoped unless a future contract adds system/global behavior.
5. Durable AuditLog persistence remains out of scope; current audit behavior is placeholder/runtime-only.

## 13. Required decisions before implementation

Before any implementation PR, the project must decide:

1. Whether ReportTemplate `report_type` should be removed from runtime behavior, added through a separate SQL/OpenAPI contract patch, or mapped through another approved contract field.
2. Whether PromptTemplate public compatibility should expose `variables`, `template_variables`, or an explicit mapper between them.
3. Whether `template_status` remains internal/DB-default-only for repository methods or becomes part of public response shape through approved contract alignment.
4. Whether PromptTemplate repository create should validate template type values `caption`, `ad_copy`, `image_prompt`, `video_script`, `report`, and `reply` before DB insert.
5. Which ErrorModel code should represent ReportTemplate duplicate conflicts if repository create is later approved.
6. Whether `getById` remains internal-only for both repositories.
7. Whether updates remain fully deferred until a separate contract/runtime planning decision.
8. Whether durable audit remains explicitly out of scope for Slice 2, as this addendum recommends.

## 14. Future implementation boundary

If a future implementation is approved, likely allowed files are:

- `src/repositories/prompt-template-repository.js`
- `src/repositories/report-template-repository.js`
- `src/repositories/index.js`
- `test/integration/db-backed-slice2-template.integration.test.js`
- `docs/db_backed_slice_2_template_implementation_report.md`
- `docs/17_change_log.md`

Likely forbidden future files unless a separate contract/runtime-switch PR approves them:

- `src/router.js`
- `src/store.js`
- SQL files
- OpenAPI files
- package files
- workflows
- migrations
- scripts

## 15. Updated Go / No-Go recommendation

Recommendation: Create a runtime behavior patch first.

Reason: ReportTemplate create currently has a direct runtime vs SQL/OpenAPI mismatch around `report_type`. A repository-only implementation should not silently drop that field, persist it in an invented location, or broaden SQL/OpenAPI scope without a separate approved contract decision.

A future approved runtime/contract alignment PR should resolve `report_type`, the PromptTemplate `variables` vs `template_variables` mapping, and template status exposure/default policy. After that, the project can reconsider a repository-only Slice 2 Template implementation with narrower approved methods.

## 16. Final decision

- Template Runtime/SQL Mapping Addendum: GO.
- Slice 2 Template implementation: NO-GO based on evidence.
- Repository-only first: required.
- Template runtime switch: NO-GO.
- SQL/OpenAPI changes: NO-GO based on evidence.
- DB-backed full persistence: NO-GO.
- Campaign persistence: NO-GO.
- BriefVersion persistence: NO-GO.
- Patch002 DB persistence: NO-GO.
- Sprint 5 coding: NO-GO.
- Pilot: NO-GO.
- Production: NO-GO.
