# Template Slice 2 Repository-Only Implementation Gate

## Document status

Documentation-only implementation gate.

This document evaluates whether Template Slice 2 can proceed from runtime behavior alignment into a repository-only DB-backed implementation plan.

It does not authorize implementation by itself. It does not modify runtime code, repositories, SQL, OpenAPI, tests, workflows, packages, generated clients, migrations, Sprint 5, Pilot, or Production.

## 1. Executive decision

Template Slice 2 repository-only implementation is now a valid next candidate **only after this gate is reviewed and approved**.

Current decision:

```text
Template Slice 2 Repository-Only Implementation Gate: GO as documentation-only.
PromptTemplateRepository implementation: CONDITIONAL GO after this gate.
ReportTemplateRepository implementation: CONDITIONAL GO after this gate.
Template runtime switch: NO-GO.
SQL changes: NO-GO.
OpenAPI changes: NO-GO.
Generated client changes: NO-GO.
DB-backed full persistence: NO-GO.
Campaign/Brief/Media/Approval/Publish/Evidence/Usage/Cost persistence expansion: NO-GO.
Sprint 5: NO-GO.
Pilot: NO-GO.
Production: NO-GO.
```

The purpose of the next implementation, if separately approved, is **repository-only persistence verification** for PromptTemplate and ReportTemplate. It must not change public runtime behavior.

## 2. Why this gate is now possible

Earlier Slice 2 planning found implementation blockers:

```text
ReportTemplate runtime used report_type while SQL/OpenAPI did not.
PromptTemplate runtime used variables while SQL/OpenAPI used template_variables.
Runtime did not expose template_status.
ReportTemplate lacked duplicate handling.
PromptTemplate did not validate template_type.
```

PR #85 resolved the runtime behavior blocker for the limited root in-memory runtime scope:

```text
PromptTemplate accepts template_variables and serializes template_variables.
PromptTemplate rejects conflicting variables/template_variables.
PromptTemplate validates template_type.
PromptTemplate exposes template_status=draft.
ReportTemplate accepts legacy report_type input but does not serialize report_type as canonical output.
ReportTemplate accepts create without report_type.
ReportTemplate rejects duplicate template_name within a workspace.
ReportTemplate exposes template_status=draft.
```

Therefore, repository-only implementation can now be planned as a narrow persistence slice, provided it does not switch routes to DB-backed mode.

## 3. Authoritative source inputs

| Source | Role |
|---|---|
| `README.md` | Current repository status and top-level GO/NO-GO boundary |
| `docs/source_of_truth_precedence_decision_record.md` | Source precedence and conflict rule |
| `docs/current_repository_status_after_pr_82.md` | Documentation authority package status |
| `docs/current_repository_status_after_template_runtime_patch.md` | Post-PR #85 status marker |
| `docs/template_slice_2_implementation_gate.md` | Runtime behavior patch gate and repository NO-GO before PR #85 |
| `docs/template_runtime_behavior_patch_implementation_report.md` | Runtime alignment implementation evidence |
| `docs/db_backed_slice_2_template_planning.md` | Original Template Slice 2 planning |
| `docs/db_backed_slice_2_template_runtime_sql_mapping_addendum.md` | Runtime/SQL mapping evidence |
| `docs/db_backed_slice_2_template_runtime_contract_alignment_planning.md` | Runtime/contract alignment decision |
| `docs/db_backed_slice_2_template_runtime_behavior_patch_planning.md` | Runtime behavior patch strategy |
| `docs/marketing_os_v5_6_5_phase_0_1_erd.md` | ERD authority |
| `docs/marketing_os_v5_6_5_phase_0_1_schema.sql` | SQL authority |
| `docs/marketing_os_v5_6_5_phase_0_1_openapi.yaml` | OpenAPI authority |
| `docs/marketing_os_v5_6_5_phase_0_1_qa_test_suite.md` | QA authority |

If this gate conflicts with an authoritative source, stop and correct this gate.

## 4. In scope for future repository-only implementation

A future implementation PR may be considered only for:

```text
src/repositories/prompt-template-repository.js
src/repositories/report-template-repository.js
src/repositories/index.js
test/integration/db-backed-slice2-template.integration.test.js
docs/db_backed_slice_2_template_implementation_report.md
docs/17_change_log.md
```

The implementation must remain repository-only. No public route may be switched to use these repositories.

## 5. Out of scope for future repository-only implementation

The future implementation PR must not include:

```text
src/router.js
src/store.js
router.js
store.js
guards.js
SQL files
OpenAPI files
generated clients
package.json
package-lock.json
.github/workflows/**
scripts/**
migrations/**
prototype/**
Patch 003 files
Campaign persistence
BriefVersion persistence
Media persistence
Approval persistence
Publish persistence
Evidence persistence
Usage/Cost persistence expansion
Template runtime switch
public get/update/delete template routes
runtime agents
external publishing
auto-replies
paid ads execution
budget-changing agents
Sprint 5
Pilot
Production
```

## 6. Approved repository methods

### 6.1 PromptTemplateRepository

| Method | Status | Purpose |
|---|---|---|
| `listByWorkspace({ workspaceId })` | CONDITIONAL GO | List prompt templates for one workspace only |
| `getById({ workspaceId, promptTemplateId })` | CONDITIONAL GO, internal-only | Internal validation lookup, no public route |
| `create({ workspaceId, input, actorUserId })` | CONDITIONAL GO | Create a prompt template using SQL/OpenAPI-aligned fields |
| `update(...)` | NO-GO | No approved public update route or versioning mutation policy |
| `delete(...)` | NO-GO | No approved delete route or lifecycle policy |

### 6.2 ReportTemplateRepository

| Method | Status | Purpose |
|---|---|---|
| `listByWorkspace({ workspaceId })` | CONDITIONAL GO | List report templates for one workspace only |
| `getById({ workspaceId, reportTemplateId })` | CONDITIONAL GO, internal-only | Internal validation lookup, no public route |
| `create({ workspaceId, input, actorUserId })` | CONDITIONAL GO | Create a report template using SQL/OpenAPI-aligned fields |
| `update(...)` | NO-GO | No approved public update route or mutation policy |
| `delete(...)` | NO-GO | No approved delete route or lifecycle policy |

## 7. Field mapping requirements

### 7.1 PromptTemplate

| Runtime/OpenAPI concept | SQL column | Required behavior |
|---|---|---|
| `prompt_template_id` | `prompt_template_id` | Returned from DB |
| `workspace_id` | `workspace_id` | Always explicit workspace filter/insert |
| `template_name` | `template_name` | Required input |
| `template_type` | `template_type` | Validate against canonical enum before insert |
| `template_body` | `template_body` | Required input |
| `template_variables` | `template_variables` | Canonical repository field; do not persist legacy `variables` separately |
| `template_status` | `template_status` | Default `draft` if omitted; no lifecycle mutation in this slice |
| `version_number` | `version_number` | Required input; duplicate uniqueness enforced |
| `created_by_user_id` | `created_by_user_id` | Must be actor user ID passed to repository |
| timestamps | `created_at`, `updated_at` | DB-owned timestamps |

### 7.2 ReportTemplate

| Runtime/OpenAPI concept | SQL column | Required behavior |
|---|---|---|
| `report_template_id` | `report_template_id` | Returned from DB |
| `workspace_id` | `workspace_id` | Always explicit workspace filter/insert |
| `template_name` | `template_name` | Required input; unique per workspace |
| `template_body` | `template_body` | Required input as JSON payload |
| `template_status` | `template_status` | Default `draft` if omitted; no lifecycle mutation in this slice |
| `created_by_user_id` | `created_by_user_id` | Must be actor user ID passed to repository |
| timestamps | `created_at`, `updated_at` | DB-owned timestamps |
| `report_type` | N/A | Must not be persisted or exposed as repository canonical field |

## 8. ErrorModel requirements

A future implementation must map repository errors safely:

| Scenario | Required ErrorModel behavior |
|---|---|
| PromptTemplate duplicate `(workspace_id, template_name, version_number)` | `DUPLICATE_TEMPLATE_VERSION` |
| ReportTemplate duplicate `(workspace_id, template_name)` | `DUPLICATE_REPORT_TEMPLATE` |
| Invalid PromptTemplate `template_type` | `VALIDATION_FAILED` |
| Missing PromptTemplate | `PROMPT_TEMPLATE_NOT_FOUND` or existing safe not-found mapping if already used |
| Missing ReportTemplate | `REPORT_TEMPLATE_NOT_FOUND` |
| Cross-workspace lookup | Same as not found / no existence leakage |
| Raw DB failure | Sanitized internal error; no SQL/constraint/secret leakage |

No implementation may expose:

```text
SQL text
constraint names
enum type names
stack traces
connection strings
hostnames
usernames
passwords
secrets
workspace existence hints
```

## 9. Tenant isolation requirements

Every repository method must:

```text
Accept workspaceId explicitly.
Filter reads by workspace_id.
Insert explicit workspace_id from the caller context.
Never trust workspace_id from input body.
Return no cross-workspace data.
Treat cross-workspace lookup as not found.
Use SQL RLS as defense in depth, not the only guard.
```

## 10. Audit boundary

The future repository-only implementation must not claim durable AuditLog persistence.

Allowed:

```text
Repository methods return rows.
Implementation report states audit is still runtime placeholder unless another slice implements durable audit.
```

Not allowed:

```text
Claiming durable audit write coupling.
Changing audit behavior.
Adding AuditLog persistence.
```

## 11. Runtime boundary

The future implementation must not change public runtime behavior.

Specifically:

```text
No route switching.
No config flag for templates.
No public get/update/delete endpoints.
No changes to root router/store behavior.
No change to PR #85 runtime alignment behavior.
```

The only acceptable use of the repositories in the future implementation PR is direct repository integration tests.

## 12. Required tests for future implementation

Minimum required integration tests:

### PromptTemplateRepository

```text
listByWorkspace returns only workspace rows.
getById returns same-workspace row.
getById returns null/not found for cross-workspace row.
create persists template_name, template_type, template_body, template_variables, version_number, created_by_user_id.
create defaults template_status to draft.
create rejects duplicate workspace/name/version with safe mapping.
create rejects invalid template_type before raw DB error leaks.
```

### ReportTemplateRepository

```text
listByWorkspace returns only workspace rows.
getById returns same-workspace row.
getById returns null/not found for cross-workspace row.
create persists template_name, template_body, created_by_user_id.
create defaults template_status to draft.
create rejects duplicate workspace/name with safe mapping.
create does not accept, persist, or expose report_type as canonical repository field.
```

### Regression checks

```text
Existing DB-backed Slice 0 and Brand Slice 1 integration tests still pass.
Existing runtime tests still pass.
PR #85 template runtime tests still pass.
Strict migration still passes.
OpenAPI lint remains unaffected.
```

## 13. Required verification commands for future implementation

A future implementation PR must run or report the result of:

```text
git diff --name-only
npm test
npm run test:integration
npm run db:migrate:strict
npm run db:migrate:retry
npm run openapi:lint:strict
npm run verify:strict
```

If any command cannot be run locally, the PR must explain why and require GitHub Actions strict verification.

## 14. Future implementation PR title

Recommended title for the next implementation PR, if this gate is approved:

```text
Repository: Implement Template Slice 2 repositories
```

Do not use a title implying runtime switch or DB-backed product route completion.

## 15. Future implementation PR required summary

The future implementation PR body must explicitly state:

```text
Repository-only implementation.
No public runtime route switch.
No SQL changes.
No OpenAPI changes.
No generated client changes.
No package/workflow changes.
No Patch 003 activation.
No Sprint 5 / Pilot / Production.
```

## 16. GO / NO-GO checklist

Future repository-only implementation is GO only if:

```text
[ ] This gate is merged or explicitly approved.
[ ] Implementation touches only approved repository/test/report/changelog files.
[ ] PromptTemplateRepository methods are limited to list/get/create.
[ ] ReportTemplateRepository methods are limited to list/get/create.
[ ] No public runtime routes are switched.
[ ] No SQL/OpenAPI changes are required.
[ ] Tenant isolation tests pass.
[ ] Duplicate behavior tests pass.
[ ] Invalid enum behavior tests pass.
[ ] PR #85 runtime behavior tests pass.
[ ] GitHub Actions strict verification passes.
```

Future repository-only implementation is NO-GO if:

```text
[ ] It needs SQL changes.
[ ] It needs OpenAPI changes.
[ ] It changes public runtime routes.
[ ] It adds get/update/delete public template routes.
[ ] It touches Campaign, Brief, Media, Approval, Publish, Evidence, Usage, Cost, Patch 002, or Patch 003 behavior.
[ ] It claims DB-backed full persistence.
[ ] It claims Pilot or Production readiness.
[ ] It weakens tenant isolation, RBAC, ErrorModel, or audit boundaries.
```

## 17. Final decision

```text
Template Slice 2 Repository-Only Implementation Gate: GO as documentation-only.
PromptTemplateRepository list/get/create: CONDITIONAL GO after this gate.
ReportTemplateRepository list/get/create: CONDITIONAL GO after this gate.
Template runtime switch: NO-GO.
SQL changes: NO-GO.
OpenAPI changes: NO-GO.
Generated client changes: NO-GO.
Package/workflow changes: NO-GO.
DB-backed full persistence: NO-GO.
Sprint 5: NO-GO.
Pilot: NO-GO.
Production: NO-GO.
```
