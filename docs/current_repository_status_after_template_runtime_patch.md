# Current Repository Status After Template Runtime Behavior Patch

## Document status

Documentation-only post-merge status note.

This file records the repository state after PR #85 was merged and verified. It does not replace `README.md`, `docs/17_change_log.md`, `docs/source_of_truth_precedence_decision_record.md`, the ERD, SQL, OpenAPI, backlog, QA suite, implementation reports, or post-merge verification reports.

It does not authorize runtime implementation beyond the already merged PR #85 scope, DB-backed Template repository implementation, Template runtime switch, SQL changes, OpenAPI changes, generated client changes, package/workflow changes, migrations, Sprint 5, Pilot, or Production.

## 1. Executive decision

PR #85 successfully completed the narrow Template Runtime Behavior Patch.

Decision:

```text
GO: Treat Template runtime create/list behavior as aligned for the specific PR #85 scope.
GO: Use this status note as the post-merge marker after PR #85.
CONDITIONAL GO: Prepare a Template Slice 2 Repository-Only Implementation Gate next.
NO-GO: Start DB-backed Template repository implementation directly from PR #85.
NO-GO: Switch Template runtime to DB-backed persistence.
NO-GO: Modify SQL/OpenAPI based on PR #85.
NO-GO: Claim Sprint 5, Pilot, or Production readiness.
```

## 2. PR #85 merge status

| Item | Status |
|---|---|
| PR | #85 |
| Title | `Runtime: Align template runtime behavior with contract` |
| Merge commit | `ef91151e4e06c9321a874bda384a4920666f5e7b` |
| Verification | Sprint 0 Strict Verification passed, run #220 |
| Runtime impact | Narrow root runtime template behavior patch only |
| SQL impact | None |
| OpenAPI impact | None |
| Repository impact | None |
| Generated client impact | None |
| Package/workflow impact | None |
| Patch 003 impact | None |
| Pilot / Production impact | None |

## 3. Files changed by PR #85

```text
guards.js
store.js
test/template-runtime-behavior.test.js
docs/template_runtime_behavior_patch_implementation_report.md
```

## 4. Behavior now aligned

### PromptTemplate

```text
Accepted canonical input: template_variables.
Temporarily accepted legacy input: variables.
Conflicting variables/template_variables: rejected with VALIDATION_FAILED.
Invalid template_type: rejected with VALIDATION_FAILED.
Canonical response field: template_variables.
Legacy response field variables: no longer serialized as canonical output.
Default response status: template_status = draft.
```

Allowed template types remain:

```text
caption
ad_copy
image_prompt
video_script
report
reply
```

### ReportTemplate

```text
Legacy report_type input: temporarily accepted for compatibility.
Canonical create request without report_type: accepted.
Canonical response field report_type: not serialized.
Default response status: template_status = draft.
Duplicate template_name within the same workspace: rejected with DUPLICATE_REPORT_TEMPLATE.
```

## 5. Tests added by PR #85

`test/template-runtime-behavior.test.js` covers:

```text
PromptTemplate template_variables compatibility.
PromptTemplate variables/template_variables conflict rejection.
PromptTemplate template_type validation.
PromptTemplate canonical serialization.
ReportTemplate report_type compatibility input.
ReportTemplate canonical serialization without report_type.
ReportTemplate duplicate template_name rejection.
Workspace-scoped canonical serialization.
```

## 6. Important interpretation boundaries

### 6.1 Runtime alignment is not repository persistence

PR #85 aligned root in-memory runtime behavior. It does not create DB-backed Template repositories and does not switch template routes to repositories.

### 6.2 SQL/OpenAPI remain unchanged

PR #85 intentionally did not modify SQL or OpenAPI. Current SQL/OpenAPI contracts remain authoritative.

### 6.3 Compatibility is transitional

`variables` and `report_type` compatibility handling should be treated as transitional runtime compatibility only, not as renewed product-contract authority.

### 6.4 Public route surface remains unchanged

Allowed public template routes remain:

```text
GET /workspaces/{workspaceId}/prompt-templates
POST /workspaces/{workspaceId}/prompt-templates
GET /workspaces/{workspaceId}/report-templates
POST /workspaces/{workspaceId}/report-templates
```

Still not approved:

```text
GET/PATCH/DELETE prompt-template by ID
GET/PATCH/DELETE report-template by ID
```

## 7. Current GO boundaries after PR #85

```text
GO: Template runtime behavior patch is merged and verified.
GO: PromptTemplate runtime input/output alignment is available for the PR #85 scope.
GO: ReportTemplate runtime input/output alignment is available for the PR #85 scope.
GO: Template runtime behavior tests exist for the PR #85 scope.
CONDITIONAL GO: Prepare a Template Slice 2 Repository-Only Implementation Gate as a documentation-only next step.
```

## 8. Current NO-GO boundaries preserved after PR #85

```text
NO-GO: DB-backed Template Repository Implementation from PR #85 alone.
NO-GO: Template runtime switch.
NO-GO: SQL changes.
NO-GO: OpenAPI changes.
NO-GO: Generated client changes.
NO-GO: Package/workflow changes.
NO-GO: Patch 003 activation.
NO-GO: Campaign persistence.
NO-GO: BriefVersion persistence.
NO-GO: Media/Approval/Publish/Evidence persistence.
NO-GO: Usage/Cost persistence expansion.
NO-GO: Runtime agents.
NO-GO: External publishing.
NO-GO: Auto-replies.
NO-GO: Paid ads execution.
NO-GO: Budget-changing agents.
NO-GO: Sprint 5.
NO-GO: Pilot.
NO-GO: Production.
```

## 9. Required before Template repository-only implementation

Before any DB-backed Template repository implementation PR, create and review a separate implementation gate covering:

```text
Selected Epic / Feature / Story IDs.
Authoritative source files.
Exact repository methods allowed.
Exact public runtime behavior not changed.
Allowed files.
Forbidden files.
ERD impact.
SQL impact.
OpenAPI impact.
QA impact.
Permissions.
Audit events.
Error states.
Tenant isolation behavior.
Response-shape parity.
Verification commands.
Rollback / NO-GO criteria.
Pilot and Production NO-GO confirmation.
```

## 10. Recommended next step

Recommended next PR:

```text
Docs: Add Template Slice 2 repository-only implementation gate
```

Purpose:

```text
Reassess whether PromptTemplateRepository and ReportTemplateRepository can now be implemented repository-only after PR #85 runtime alignment.
Define methods, allowed files, forbidden files, tests, and exact NO-GO boundaries.
```

## 11. Final decision

This status note confirms that PR #85 resolved the runtime behavior blocker for the limited template runtime scope. It does not authorize DB-backed Template repository implementation. The next step is a repository-only implementation gate, not direct code.
