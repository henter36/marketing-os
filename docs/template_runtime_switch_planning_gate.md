# Template Runtime Switch Planning Gate

## Document status

Documentation-only planning gate.

This document evaluates whether public Template runtime routes may later be switched from the in-memory store path to the DB-backed Template repositories introduced in PR #88.

It does not authorize runtime switch implementation. It does not modify runtime code, repositories, SQL, OpenAPI, tests, workflows, packages, generated clients, migrations, Sprint 5, Pilot, or Production.

## 1. Executive decision

Template Runtime Switch Planning Gate: **GO as documentation-only**.

Template Runtime Switch Implementation: **NO-GO until this gate is reviewed and a separate implementation PR is approved**.

Current decision:

```text
Template Runtime Switch Planning Gate: GO as documentation-only.
Template Runtime Switch Implementation: NO-GO.
Template DB-backed repositories: already implemented repository-only in PR #88.
SQL changes: NO-GO.
OpenAPI changes: NO-GO.
Generated client changes: NO-GO.
Package/workflow changes: NO-GO.
Public get/update/delete template routes: NO-GO.
DB-backed full persistence: NO-GO.
Sprint 5: NO-GO.
Pilot: NO-GO.
Production: NO-GO.
```

## 2. Current state after PR #89

The current verified state is:

```text
PromptTemplateRepository exists and is verified through integration tests.
ReportTemplateRepository exists and is verified through integration tests.
Root Template runtime behavior was aligned in PR #85.
Public Template routes still use the existing runtime path.
No Template runtime switch exists.
No DB-backed full persistence exists.
```

Correct status:

```text
Template DB-backed repositories exist and are verified.
```

Incorrect status:

```text
Template runtime routes are DB-backed.
DB-backed full persistence is enabled.
Pilot or Production is approved.
```

## 3. Authoritative inputs

| Source | Role |
|---|---|
| `README.md` | Current repository status and top-level GO/NO-GO boundary |
| `docs/source_of_truth_precedence_decision_record.md` | Source precedence and conflict rule |
| `docs/current_repository_status_after_template_slice_2_repository.md` | Post-PR #88 status marker |
| `docs/template_slice_2_repository_only_implementation_gate.md` | Repository-only gate |
| `docs/db_backed_slice_2_template_implementation_report.md` | Repository-only implementation report |
| `docs/template_runtime_behavior_patch_implementation_report.md` | Runtime behavior alignment report |
| `docs/marketing_os_v5_6_5_phase_0_1_openapi.yaml` | Public API contract authority |
| `docs/marketing_os_v5_6_5_phase_0_1_schema.sql` | SQL contract authority |
| `docs/marketing_os_v5_6_5_phase_0_1_qa_test_suite.md` | QA authority |
| `AGENTS.md` | Repository execution discipline |

If this document conflicts with an authoritative source, the authoritative source wins and this document must be corrected.

## 4. Runtime switch objective

The future runtime switch, if separately approved, should only route the existing public Template list/create endpoints through the already implemented repositories.

Allowed public route surface remains:

```text
GET /workspaces/{workspaceId}/prompt-templates
POST /workspaces/{workspaceId}/prompt-templates
GET /workspaces/{workspaceId}/report-templates
POST /workspaces/{workspaceId}/report-templates
```

No new public endpoints may be added.

## 5. Public routes still forbidden

The following remain NO-GO:

```text
GET /workspaces/{workspaceId}/prompt-templates/{promptTemplateId}
PATCH /workspaces/{workspaceId}/prompt-templates/{promptTemplateId}
DELETE /workspaces/{workspaceId}/prompt-templates/{promptTemplateId}
GET /workspaces/{workspaceId}/report-templates/{reportTemplateId}
PATCH /workspaces/{workspaceId}/report-templates/{reportTemplateId}
DELETE /workspaces/{workspaceId}/report-templates/{reportTemplateId}
```

Internal repository `getById` may remain internal-only for validation and tests.

## 6. Runtime switch mode strategy

A future implementation must choose one of the following strategies before code is written.

| Option | Description | Risk | Decision |
|---|---|---|---|
| Option A | Add a Template-specific runtime mode flag similar to Brand runtime mode | Adds config surface but allows rollback | Preferred candidate if implemented carefully |
| Option B | Reuse Brand runtime mode for templates | Confuses domains and creates hidden coupling | NO-GO |
| Option C | Switch templates to repositories unconditionally | No safe rollback and changes runtime behavior globally | NO-GO |
| Option D | Keep repository-only forever | Safest but delays DB-backed runtime validation | Valid fallback |

Recommended planning decision:

```text
Use a Template-specific gated runtime mode if implementation proceeds.
Default must remain in-memory.
Repository mode must be explicit.
Missing mode must not change current behavior.
Invalid explicit mode must fail safely.
```

Candidate configuration name, if approved later:

```text
TEMPLATE_RUNTIME_MODE=in_memory|repository
```

Do not implement this config in this planning PR.

## 7. Allowed files for a future runtime switch implementation

Likely allowed files for a later implementation PR:

```text
src/config.js
src/router.js
src/store.js only if necessary for wiring or test fixture compatibility
test/config.test.js only if TEMPLATE_RUNTIME_MODE is added
test/integration/template-runtime-switch.integration.test.js
docs/template_runtime_switch_implementation_report.md
```

Potentially allowed only if required by existing project conventions:

```text
docs/17_change_log.md
README.md
```

## 8. Forbidden files for future runtime switch implementation

Unless a separate approved contract decision allows it, the future runtime switch implementation must not modify:

```text
docs/*schema*.sql
docs/*openapi*.yaml
generated clients
package.json
package-lock.json
.github/workflows/**
scripts/**
migrations/**
prototype/**
Patch 003 files
PromptTemplateRepository method set beyond list/get/create
ReportTemplateRepository method set beyond list/get/create
Campaign / Brief / Media / Approval / Publish / Evidence / Usage / Cost persistence files
```

## 9. Required runtime behavior parity

A future implementation must prove that repository mode preserves current approved behavior.

### PromptTemplate parity

```text
GET list returns workspace-scoped templates only.
POST create accepts canonical template_variables.
Legacy variables compatibility remains as approved by PR #85 behavior.
Conflicting variables/template_variables remains rejected.
Invalid template_type remains rejected.
Duplicate workspace/template_name/version_number maps to DUPLICATE_TEMPLATE_VERSION.
Response exposes template_variables and template_status.
Response does not expose legacy variables.
```

### ReportTemplate parity

```text
GET list returns workspace-scoped templates only.
POST create accepts canonical input without report_type.
Legacy report_type input remains compatibility-only if still needed.
Response does not expose report_type.
Duplicate workspace/template_name maps to DUPLICATE_REPORT_TEMPLATE.
Response exposes template_status.
```

## 10. Tenant isolation and RBAC requirements

A future implementation must prove:

```text
workspace_id still comes from route/context only.
body workspace_id mismatch is still rejected.
MembershipCheck is still required.
PermissionGuard is still required.
prompt_template.read and prompt_template.write remain enforced.
report_template.read and report_template.write remain enforced.
Workspace A cannot list/read/create into Workspace B.
Cross-workspace IDs are not leaked.
```

## 11. Audit boundary

The future runtime switch must not claim durable AuditLog persistence unless a separate AuditLog persistence slice exists.

Allowed:

```text
Existing runtime audit placeholder behavior remains.
Repository create returns DB-backed template rows.
Runtime layer records existing audit placeholder if already part of route behavior.
```

Not allowed:

```text
Claiming durable audit coupling.
Changing AuditLog persistence.
Treating AuditLog as business state.
```

## 12. ErrorModel requirements

A future implementation must preserve safe ErrorModel behavior:

```text
DUPLICATE_TEMPLATE_VERSION for prompt duplicate version.
DUPLICATE_REPORT_TEMPLATE for report duplicate name.
VALIDATION_FAILED for invalid template_type or invalid field compatibility.
PERMISSION_DENIED for missing write/read permission.
WORKSPACE_ACCESS_DENIED for non-members.
TENANT_CONTEXT_MISMATCH for body workspace mismatch.
INTERNAL_ERROR for sanitized DB failures.
```

No response may expose:

```text
SQL text
constraint names
enum names
stack traces
connection strings
hostnames
usernames
passwords
secrets
workspace existence hints
```

## 13. Rollback strategy

A future implementation must preserve rollback:

```text
Default mode remains in-memory.
Repository mode is explicit.
If repository mode fails, switch back to in-memory mode.
No SQL rollback should be required because no SQL changes are allowed.
No OpenAPI rollback should be required because no OpenAPI changes are allowed.
```

## 14. Required tests for future runtime switch implementation

Minimum required tests:

```text
missing TEMPLATE_RUNTIME_MODE defaults to in_memory.
explicit TEMPLATE_RUNTIME_MODE=in_memory preserves current behavior.
explicit TEMPLATE_RUNTIME_MODE=repository routes template list/create through repositories.
invalid TEMPLATE_RUNTIME_MODE fails safely.
repository mode requires DATABASE_URL or injected pool/repositories.
PromptTemplate list/create parity in repository mode.
ReportTemplate list/create parity in repository mode.
body workspace_id mismatch still rejected.
RBAC read/write deny paths remain enforced.
ErrorModel remains safe.
Existing Brand runtime mode behavior remains unchanged.
Existing Sprint 0-4 and Patch 002 tests remain passing.
```

## 15. Verification requirements for future implementation

A future implementation PR must run or report:

```text
git diff --name-only
npm test
npm run test:integration
npm run openapi:lint:strict
npm run db:migrate:strict
npm run db:migrate:retry
npm run verify:strict
```

If any command cannot be run locally, the PR must explain why and rely on GitHub Actions strict verification.

## 16. Future implementation PR title

Recommended title if this gate is approved:

```text
Runtime: Add gated Template repository mode
```

Do not use titles implying full DB-backed persistence or production readiness.

## 17. GO / NO-GO checklist for future implementation

Future runtime switch implementation is GO only if:

```text
[ ] This planning gate is merged or explicitly approved.
[ ] Template-specific runtime mode is selected.
[ ] Default mode remains in-memory.
[ ] Repository mode is explicit.
[ ] Allowed and forbidden files are stated.
[ ] No SQL/OpenAPI changes are needed.
[ ] No new public template routes are added.
[ ] No repository method expansion is needed.
[ ] Tenant isolation tests are included.
[ ] RBAC tests are included.
[ ] ErrorModel tests are included.
[ ] Rollback to in-memory is documented.
[ ] Strict verification passes.
```

Future runtime switch implementation is NO-GO if:

```text
[ ] It requires SQL changes.
[ ] It requires OpenAPI changes.
[ ] It adds public get/update/delete routes.
[ ] It changes repository method scope beyond list/get/create.
[ ] It changes Campaign, Brief, Media, Approval, Publish, Evidence, Usage, Cost, Patch 002, or Patch 003 behavior.
[ ] It claims DB-backed full persistence.
[ ] It claims Sprint 5, Pilot, or Production readiness.
[ ] It weakens tenant isolation, RBAC, ErrorModel, or audit boundaries.
```

## 18. Final decision

```text
Template Runtime Switch Planning Gate: GO as documentation-only.
Template Runtime Switch Implementation: NO-GO from this document alone.
Template-specific repository mode: CONDITIONAL GO after this gate.
Default in-memory mode: required.
SQL changes: NO-GO.
OpenAPI changes: NO-GO.
DB-backed full persistence: NO-GO.
Sprint 5: NO-GO.
Pilot: NO-GO.
Production: NO-GO.
```
