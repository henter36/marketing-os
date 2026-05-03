# Template Slice 2 Implementation Gate

## Document status

Documentation-only implementation gate.

This document decides what may and may not proceed after the Phase 0/1 documentation authority package and the existing DB-backed Slice 2 Template planning documents.

It does not authorize runtime implementation, repository implementation, SQL changes, OpenAPI changes, test changes, workflow changes, package changes, generated code changes, migrations, Sprint 5, Pilot, or Production.

## 1. Executive decision

Template Slice 2 remains a valid next candidate area, but **direct DB-backed PromptTemplate / ReportTemplate repository implementation is not yet approved**.

The current safe next implementation candidate is narrower:

```text
Template Runtime Behavior Patch Gate: CONDITIONAL GO for planning-to-implementation review.
DB-backed Template Repository Implementation: NO-GO until runtime/contract mismatches are resolved and verified.
Template Runtime Switch: NO-GO.
SQL/OpenAPI changes: NO-GO in this gate.
Sprint 5: NO-GO.
Pilot: NO-GO.
Production: NO-GO.
```

Reason:

The prior mapping and alignment documents found blocking runtime/contract mismatches:

1. ReportTemplate runtime requires/returns `report_type`, but SQL/OpenAPI do not define `report_type`.
2. PromptTemplate runtime uses `variables`, while SQL/OpenAPI use `template_variables`.
3. Runtime does not set/expose `template_status`, while SQL/OpenAPI define status/defaults.
4. ReportTemplate runtime lacks duplicate handling, while SQL has uniqueness on `(workspace_id, template_name)`.
5. PromptTemplate runtime accepts `template_type` without enum validation, while SQL/OpenAPI define allowed values.
6. Public get/update routes are absent and must remain absent.

Therefore, repository implementation must not start until the runtime behavior patch path is explicitly scoped and verified.

## 2. Authoritative source inputs

| Source | Role |
|---|---|
| `README.md` | Current repository status and top-level GO/NO-GO boundary |
| `docs/source_of_truth_precedence_decision_record.md` | Conflict-resolution authority |
| `docs/current_repository_status_after_pr_82.md` | Status index after PR #82 |
| `docs/phase_0_1_delivery_backlog_hierarchy.md` | Delivery hierarchy and Template Slice 2 candidate context |
| `docs/phase_0_1_traceability_matrix.md` | Capability-to-contract traceability |
| `docs/phase_0_1_gap_review.md` | Gap register and before-coding blockers |
| `docs/phase_0_1_permission_and_audit_matrix.md` | Permission/audit mapping |
| `docs/phase_0_1_test_case_coverage_review.md` | QA coverage review |
| `docs/db_backed_slice_2_template_planning.md` | Original Template Slice 2 planning |
| `docs/db_backed_slice_2_template_runtime_sql_mapping_addendum.md` | Runtime/SQL mapping and blocking gaps |
| `docs/db_backed_slice_2_template_runtime_contract_alignment_planning.md` | Runtime/contract alignment decision path |
| `docs/db_backed_slice_2_template_runtime_behavior_patch_planning.md` | Runtime behavior patch planning and conditional path |
| `docs/marketing_os_v5_6_5_phase_0_1_erd.md` | Entity authority |
| `docs/marketing_os_v5_6_5_phase_0_1_schema.sql` | SQL authority |
| `docs/marketing_os_v5_6_5_phase_0_1_openapi.yaml` | API authority |
| `docs/marketing_os_v5_6_5_phase_0_1_qa_test_suite.md` | QA authority |

If this document conflicts with an authoritative source, the authoritative source wins and this document must be corrected.

## 3. Gate scope

### 3.1 In scope for this gate

This gate covers only planning and authorization criteria for a future narrow Template Runtime Behavior Patch.

In scope for the future candidate patch, if separately approved:

```text
PromptTemplate runtime request/response alignment.
ReportTemplate runtime request/response alignment.
PromptTemplate `variables` / `template_variables` compatibility policy.
ReportTemplate `report_type` compatibility policy.
Template status default/response policy.
ReportTemplate duplicate handling policy.
PromptTemplate `template_type` enum validation.
Template-specific ErrorModel behavior.
Template-specific RBAC preservation.
Template-specific tenant isolation preservation.
Runtime tests for the approved alignment behavior.
```

### 3.2 Out of scope for this gate

```text
DB-backed Template repository implementation.
Template runtime switch to DB.
Public get/update routes.
SQL changes.
OpenAPI changes.
Generated client changes.
Migration changes.
Package changes.
Workflow changes.
Campaign persistence.
BriefVersion persistence.
MediaJob persistence.
MediaAsset persistence.
ApprovalDecision persistence.
PublishJob persistence.
ManualPublishEvidence persistence.
Usage/Cost persistence expansion.
Patch 002 DB persistence.
Patch 003 activation.
Runtime agents.
External publishing.
Auto-replies.
Paid ads execution.
Budget-changing agents.
Sprint 5.
Pilot.
Production.
```

## 4. Selected delivery hierarchy mapping

| Epic | Feature | Story | Current gate decision |
|---|---|---|---|
| Epic 2 — Workspace, Brand, Templates, Campaign, and Brief Setup | Prompt and report templates | S1-03 — Prompt Template and Report Template Management | Conditional GO for runtime behavior alignment gate only |
| Epic 0 — Repository Governance and Source-of-Truth Control | Traceability / Gap / Permission / Threat controls | PR #82 package | Must be used before any implementation PR |
| Epic 1 — Foundation, Tenant Isolation, RBAC, and Error Model | Tenant/RBAC/ErrorModel baseline | S0-02, S0-03, S0-04 | Required guardrails for the runtime patch |

## 5. Candidate future patch name

If approved later, the next implementation PR should be named approximately:

```text
Template Runtime Behavior Patch Implementation
```

Not:

```text
DB-backed Slice 2 Template Implementation
```

Reason: the next safe patch should align existing runtime behavior with the existing SQL/OpenAPI contract. It should not introduce DB-backed Template persistence.

## 6. Proposed future patch objectives

A future runtime behavior patch may proceed only if it limits itself to:

1. ReportTemplate `report_type` handling.
2. PromptTemplate `variables` / `template_variables` handling.
3. Template status default/response behavior.
4. ReportTemplate duplicate behavior.
5. PromptTemplate `template_type` validation.
6. ErrorModel safety for the above.
7. Runtime test updates for the above.

It must not introduce or imply DB-backed persistence.

## 7. ReportTemplate `report_type` gate decision

### Current problem

Runtime currently treats `report_type` as required/returned behavior, but SQL/OpenAPI do not define it.

### Gate decision

A future runtime behavior patch may be conditionally allowed to align runtime away from treating `report_type` as canonical product state, but only if it documents and tests compatibility behavior.

Preferred future patch policy:

```text
Accept legacy `report_type` temporarily if needed for compatibility.
Do not treat `report_type` as canonical persisted product state.
Do not add `report_type` to SQL.
Do not add `report_type` to OpenAPI in this path.
Do not return `report_type` as canonical response unless a separate contract decision approves it.
```

### Stop condition

If reviewers decide `report_type` is product-critical, this runtime patch path must stop and move to a separate SQL/OpenAPI contract patch planning path.

## 8. PromptTemplate variables gate decision

### Current problem

Runtime uses `variables`; SQL/OpenAPI use `template_variables`.

### Gate decision

Preferred future patch policy:

```text
Accept canonical `template_variables`.
Temporarily accept legacy `variables` if needed for request compatibility.
If both are sent with conflicting values, return validation failure.
Move response shape toward canonical `template_variables` unless a separate compatibility decision requires dual output.
Do not change SQL/OpenAPI for this issue.
```

## 9. Template status gate decision

### Current problem

SQL/OpenAPI define template status/defaults; runtime does not set/expose `template_status`.

### Gate decision

A future patch may set runtime defaults to `draft` only if response-shape compatibility is explicitly tested.

Rules:

```text
Do not accept `template_status` as input unless OpenAPI request schema already approves it.
Do not introduce archive/delete/update behavior.
Do not imply lifecycle management beyond list/create.
Use `draft` default only for contract alignment.
```

## 10. Duplicate and validation gate decision

A future runtime behavior patch should:

```text
Preserve PromptTemplate duplicate `(workspace_id, template_name, version_number)` behavior.
Add ReportTemplate duplicate `(workspace_id, template_name)` behavior only if a safe ErrorModel code is chosen.
Validate PromptTemplate `template_type` against: caption, ad_copy, image_prompt, video_script, report, reply.
Return sanitized validation/conflict errors.
Never expose SQL constraint names, enum names, stack traces, or secrets.
```

Recommended ErrorModel additions or mappings must be documented before implementation.

## 11. Public route boundary

Public routes allowed to remain in scope:

```text
GET /workspaces/{workspaceId}/prompt-templates
POST /workspaces/{workspaceId}/prompt-templates
GET /workspaces/{workspaceId}/report-templates
POST /workspaces/{workspaceId}/report-templates
```

Public routes explicitly forbidden:

```text
GET /workspaces/{workspaceId}/prompt-templates/{promptTemplateId}
PATCH /workspaces/{workspaceId}/prompt-templates/{promptTemplateId}
DELETE /workspaces/{workspaceId}/prompt-templates/{promptTemplateId}
GET /workspaces/{workspaceId}/report-templates/{reportTemplateId}
PATCH /workspaces/{workspaceId}/report-templates/{reportTemplateId}
DELETE /workspaces/{workspaceId}/report-templates/{reportTemplateId}
```

Internal lookup helpers may be planned later only if needed for validation, and must not be exposed as public API without OpenAPI approval.

## 12. Allowed files for a future runtime behavior patch implementation

Likely allowed files, subject to final PR scope:

```text
router.js
store.js
test/** or existing relevant runtime test files only if the selected patch requires them
docs/template_runtime_behavior_patch_implementation_report.md
docs/17_change_log.md
```

Because this current PR is documentation-only, it does not modify any of those files.

## 13. Forbidden files for the future runtime behavior patch implementation

Unless a separate approved contract/runtime decision explicitly allows them, the following must remain forbidden:

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

## 14. Required test coverage for a future runtime behavior patch

Minimum future test coverage:

| Area | Required test |
|---|---|
| ReportTemplate `report_type` | Create behavior with approved compatibility policy |
| ReportTemplate response | Does not expose unapproved canonical `report_type` unless separately approved |
| ReportTemplate duplicate | Same workspace duplicate rejected; cross-workspace duplicate allowed if fixtures support it |
| PromptTemplate variables | `template_variables` accepted |
| PromptTemplate legacy variables | legacy `variables` accepted only if compatibility policy approves |
| PromptTemplate conflict | both fields with conflicting values return validation failure |
| PromptTemplate response | canonical `template_variables` response if approved |
| PromptTemplate type | invalid `template_type` rejected safely |
| Template status | default/response behavior verified if introduced |
| Tenant isolation | body `workspace_id` remains rejected; workspace A cannot see workspace B templates |
| RBAC | read/write permission allow/deny paths remain intact |
| ErrorModel | validation/conflict errors return safe ErrorModel |
| Regression | Sprint 0/1/2/3/4, Patch 002, Brand/config behavior remains unchanged |

## 15. Required verification commands for a future runtime behavior patch

A future implementation PR should run the repository's available strict verification commands. At minimum, it must report:

```text
git diff --name-only
npm test or the repository's strict verification command if available
OpenAPI parity/check-codegen-fresh only if OpenAPI or generated code are affected; they should not be affected in this patch
```

If tests cannot be run locally, the PR must explain why and rely on GitHub Actions strict verification.

## 16. Runtime behavior patch GO / NO-GO checklist

A future runtime behavior patch implementation is GO only if:

```text
[ ] This gate is merged or explicitly approved.
[ ] Exact report_type policy is approved.
[ ] Exact variables/template_variables policy is approved.
[ ] Exact template_status policy is approved.
[ ] Duplicate/ErrorModel behavior is approved.
[ ] Allowed and forbidden files are stated.
[ ] Runtime tests are updated or added.
[ ] No SQL/OpenAPI changes are needed.
[ ] No repository implementation is included.
[ ] No template runtime switch is included.
[ ] No unrelated domain is changed.
[ ] Sprint 5, Pilot, and Production remain NO-GO.
```

A future runtime behavior patch implementation is NO-GO if:

```text
[ ] It requires SQL or OpenAPI changes.
[ ] It silently drops meaningful report_type semantics without an approved compatibility policy.
[ ] It exposes unapproved response fields.
[ ] It weakens tenant isolation.
[ ] It weakens RBAC.
[ ] It leaks raw SQL or internal details.
[ ] It touches repository implementation.
[ ] It touches Template runtime switch.
[ ] It touches Campaign, Brief, Media, Approval, Publish, Evidence, Usage, Cost, Patch 002, or Patch 003 behavior.
```

## 17. DB-backed Template repository implementation gate

DB-backed Template repository implementation remains **NO-GO** until after a future runtime behavior patch is implemented and verified, or until a separate contract patch proves a different path is required.

Repository implementation may be reconsidered only after:

```text
Runtime template create/list behavior is aligned.
ReportTemplate report_type decision is resolved.
PromptTemplate variables/template_variables decision is resolved.
Status behavior is resolved.
Duplicate behavior is resolved.
PromptTemplate template_type validation is resolved.
Template runtime tests pass.
No SQL/OpenAPI mismatch remains.
A repository-only implementation plan is reissued with allowed files, forbidden files, and verification gates.
```

## 18. Relationship to Patch 003

Patch 003 remains separate and Draft / NO-GO.

This gate must not include:

```text
Patch 003 files.
Competitive feature contract reconciliation.
Creator marketplace features.
External publishing.
Paid execution.
Agentic execution.
Advanced attribution.
```

## 19. Recommended next step after this gate

After this gate is reviewed and merged, the next recommended PR is:

```text
Template Runtime Behavior Patch Implementation
```

Only if the reviewer accepts the conditional runtime patch path.

If the reviewer rejects the compatibility approach for `report_type`, the next step must shift to:

```text
Template ReportType Contract Decision / SQL-OpenAPI Patch Planning
```

not runtime implementation.

## 20. Final decision

```text
Template Slice 2 Implementation Gate: GO as documentation-only.
Template Runtime Behavior Patch Implementation: CONDITIONAL GO after this gate is reviewed.
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
