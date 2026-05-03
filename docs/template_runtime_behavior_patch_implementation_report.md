# Template Runtime Behavior Patch Implementation Report

## Document status

Implementation report for a narrow runtime behavior patch.

This report records the implementation performed after the Template Slice 2 Implementation Gate.

## 1. Executive decision

Template Runtime Behavior Patch Implementation: **completed as a narrow runtime alignment patch**.

This implementation does **not** approve DB-backed Template repository implementation, Template runtime switch, SQL changes, OpenAPI changes, generated client changes, package/workflow changes, Sprint 5, Pilot, or Production.

## 2. Scope implemented

Implemented only the approved runtime behavior alignment scope:

```text
PromptTemplate variables/template_variables compatibility.
PromptTemplate template_type validation.
PromptTemplate canonical response shape with template_variables.
PromptTemplate default template_status response.
ReportTemplate report_type compatibility input.
ReportTemplate canonical response shape without report_type.
ReportTemplate default template_status response.
ReportTemplate duplicate template_name handling per workspace.
Runtime tests for the above behavior.
```

## 3. Files changed

```text
guards.js
store.js
test/template-runtime-behavior.test.js
docs/template_runtime_behavior_patch_implementation_report.md
```

## 4. Explicitly unchanged

```text
src/repositories/**
docs/*schema*.sql
docs/*openapi*.yaml
package.json
package-lock.json
.github/workflows/**
scripts/**
migrations/**
prototype/**
generated clients
Patch 003 files
DB-backed repository implementation files
Template runtime switch files
Campaign / Brief / Media / Approval / Publish / Evidence / Usage / Cost persistence files
```

## 5. Behavior changes

### PromptTemplate

- `template_variables` is accepted as the canonical input field.
- legacy `variables` remains accepted as temporary compatibility input.
- if both `variables` and `template_variables` are supplied and differ, runtime returns `VALIDATION_FAILED`.
- invalid `template_type` values are rejected before storage.
- serialized responses use `template_variables`, not `variables`.
- serialized responses include `template_status`, defaulting to `draft`.

### ReportTemplate

- `report_type` may still be accepted as legacy compatibility input.
- runtime no longer treats `report_type` as canonical response state.
- serialized responses omit `report_type`.
- serialized responses include `template_status`, defaulting to `draft`.
- duplicate `(workspace_id, template_name)` creates a safe `DUPLICATE_REPORT_TEMPLATE` conflict.

## 6. Tenant isolation and RBAC

No tenant isolation or RBAC weakening was introduced.

Existing route behavior remains:

```text
workspace_id comes from route/context.
body workspace_id mismatch is rejected.
prompt_template.read / prompt_template.write are preserved.
report_template.read / report_template.write are preserved.
```

## 7. Public route boundary

No public routes were added.

Still allowed:

```text
GET /workspaces/{workspaceId}/prompt-templates
POST /workspaces/{workspaceId}/prompt-templates
GET /workspaces/{workspaceId}/report-templates
POST /workspaces/{workspaceId}/report-templates
```

Still not added:

```text
GET/PATCH/DELETE prompt-template by ID
GET/PATCH/DELETE report-template by ID
```

## 8. Tests added

Added `test/template-runtime-behavior.test.js` covering:

```text
PromptTemplate create with canonical template_variables.
PromptTemplate conflicting variables/template_variables rejection.
PromptTemplate invalid template_type rejection.
ReportTemplate create with compatibility report_type but canonical response.
ReportTemplate create without report_type.
ReportTemplate duplicate template_name rejection.
Template list canonical response and workspace scoping.
```

## 9. Verification status

Local tests were not run in this GitHub connector environment because there is no local repository checkout with dependencies available through the connector session.

Required verification in GitHub Actions:

```text
Sprint 0 Strict Verification
npm test
npm run test:integration
openapi lint should remain unaffected
strict migration should remain unaffected
```

## 10. Remaining NO-GO boundaries

```text
DB-backed Template Repository Implementation: NO-GO.
Template Runtime Switch: NO-GO.
SQL changes: NO-GO.
OpenAPI changes: NO-GO.
Generated client changes: NO-GO.
Package/workflow changes: NO-GO.
Patch 003 activation: NO-GO.
Runtime agents: NO-GO.
External publishing: NO-GO.
Auto-replies: NO-GO.
Paid ads execution: NO-GO.
Budget-changing agents: NO-GO.
Sprint 5: NO-GO.
Pilot: NO-GO.
Production: NO-GO.
```

## 11. Next recommended step

If this runtime behavior patch passes strict verification and is merged, the next step should be a post-merge verification/status note.

Only after that should the project reconsider a repository-only Template Slice 2 plan.

The repository-only plan must be reissued and must not proceed directly from this PR.
