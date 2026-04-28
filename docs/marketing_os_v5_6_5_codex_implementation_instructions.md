# Marketing OS V5.6.5 - Codex Implementation Instructions

> **Document type:** Codex execution instructions / implementation guardrails  
> **Scope:** Phase 0/1 only  
> **Repository:** `henter36/marketing-os`  
> **Status:** Post-Sprint 4 verified baseline  
> **Latest verified main commit:** `8e7e4b1`  
> **GitHub Actions strict verification:** Passed on main  
> **Pilot:** NO-GO  
> **Production:** NO-GO

---

## 1. Executive Instruction

Codex must implement Marketing OS Phase 0/1 only, and only inside an explicitly approved sprint or reconciliation branch.

The repository is no longer Sprint 0-only. The verified baseline includes Sprint 0, Sprint 1, Sprint 2, Sprint 3, Sprint 4, and repository cleanup after Sprint 4.

Future work must begin with a scoped planning branch before code changes. Sprint 5 coding is not allowed without an approved Sprint 5 plan.

Codex must not infer product scope, add features, rename entities, introduce new domains, or implement deferred functionality.

If approved files conflict, Codex must stop and report the conflict instead of guessing.

---

## 2. Verified Historical Evidence

Treat these reports as completed historical evidence:

```text
docs/sprint_0_implementation_report.md
docs/sprint_1_implementation_report.md
docs/sprint_2_implementation_report.md
docs/sprint_3_implementation_report.md
docs/sprint_4_implementation_report.md
docs/repository_cleanup_after_sprint_4.md
```

The current status summary is:

```text
docs/project_status_after_sprint_4.md
```

---

## 3. Mandatory Approved Sources

Codex must read and obey these files before future implementation planning or code changes:

```text
README.md

docs/00_project_instructions.md
docs/01_master_document.md
docs/02_v1_scope.md
docs/03_decision_log.md
docs/04_backlog.md
docs/05_domain_map.md
docs/06_erd.md
docs/07_database_schema.sql
docs/08_api_spec.md
docs/09_screen_map.md
docs/10_user_flows.md
docs/11_sprint_plan.md
docs/12_qa_test_plan.md
docs/13_risk_register.md
docs/14_implementation_notes.md
docs/15_integration_plan.md
docs/16_traceability_matrix.md
docs/17_change_log.md
docs/18_sprint_0_execution_lock.md
docs/19_implementation_readiness_checklist.md
docs/20_sprint_0_report_template.md

docs/marketing_os_v5_6_5_phase_0_1_erd.md
docs/marketing_os_v5_6_5_phase_0_1_schema.sql
docs/marketing_os_v5_6_5_phase_0_1_schema_patch_001.sql
docs/marketing_os_v5_6_5_phase_0_1_openapi.yaml
docs/marketing_os_v5_6_5_phase_0_1_backlog.md
docs/marketing_os_v5_6_5_phase_0_1_qa_test_suite.md
docs/marketing_os_v5_6_5_phase_0_1_contract_patch_001.md

docs/ui_screen_inventory.md
docs/ui_user_flows.md
docs/ui_permission_matrix.md
docs/ui_api_mapping.md
docs/ui_codex_prompt.md
```

Patch 001 remains mandatory and binding.

---

## 4. Current Migration Order

The active SQL migration order is still:

```text
1. docs/marketing_os_v5_6_5_phase_0_1_schema.sql
2. docs/marketing_os_v5_6_5_phase_0_1_schema_patch_001.sql
```

`docs/07_database_schema.sql` is a wrapper/index file. If a migration runner does not support `\i`, configure the runner to execute the two SQL files directly in the order above.

Codex must not add Patch 002 to migration order until Patch 002 reconciliation is complete.

---

## 5. Patch 002 Status

Patch 002 files exist:

```text
docs/marketing_os_v5_6_5_phase_0_1_competitive_patch_002.md
docs/marketing_os_v5_6_5_phase_0_1_contract_patch_002_competitive_features.md
docs/marketing_os_v5_6_5_phase_0_1_schema_patch_002.sql
docs/marketing_os_v5_6_5_phase_0_1_openapi_patch_002.yaml
```

Patch 002 is not fully activated and must not be claimed as implemented.

Before activation, Patch 002 requires:

```text
1. Naming consistency review.
2. QA addendum review and implementation planning.
3. Migration idempotency review.
```

Known reconciliation concerns:

```text
The contract may reference connector_credential_refs while SQL uses connector_credentials.
Patch wording references notifications, but SQL has notification_rules and notification_deliveries without a standalone notifications table.
Patch 002 CREATE TRIGGER statements may need DROP TRIGGER IF EXISTS before activation.
```

Decision:

```text
NO-GO: Patch 002 activation until reconciliation is complete.
GO: Patch 002 reconciliation planning only.
```

---

## 6. Current Architecture Note

Current Sprint 4 entrypoints:

```text
src/router.js
src/store.js
```

Sprint 3 layer:

```text
src/router_sprint3.js
src/store_sprint3.js
```

Retained Sprint 0/1/2 base implementation:

```text
router.js
store.js
```

Removed by repository cleanup after Sprint 4:

```text
router_sprint4.js
store_sprint4.js
```

---

## 7. Patch 001 Binding Corrections

Patch 001 resolves two blocking contract conflicts.

### ApprovalDecision / MediaAssetVersion

Correct behavior:

```text
1. ApprovalDecision must validate ReviewTask to MediaAssetVersion match.
2. If decision=approved, approved_content_hash is required.
3. approved_content_hash must equal MediaAssetVersion.content_hash.
4. After valid approved decision insert, DB trigger sets MediaAssetVersion.version_status=approved.
5. The version does not need to be approved before the decision.
```

### ManualPublishEvidence invalidate

Correct behavior:

```text
1. ManualPublishEvidence proof fields remain immutable.
2. DELETE remains forbidden.
3. PATCH endpoint remains forbidden.
4. Invalidate is allowed only as a limited state update.
5. Allowed fields for invalidation: evidence_status and invalidated_reason.
6. Supersede creates a new row; it does not mutate proof fields.
```

---

## 8. Non-Negotiable Rules

```text
1. Section 52 relationship contract is the only relationship authority.
2. Do not create tables named GenerationJob, Asset, or Approval.
3. Use MediaJob, MediaAsset, MediaAssetVersion, and ApprovalDecision.
4. Do not implement auto-publishing in Phase 0/1.
5. Do not implement paid execution in Phase 0/1.
6. Do not implement advanced attribution in Phase 0/1.
7. Do not implement AI Agents in Phase 0/1.
8. Do not implement BillingProvider or ProviderUsageLog unless a new approved contract adds them.
9. Do not trust workspace_id from request body.
10. Every workspace-scoped query must include workspace context.
11. ManualPublishEvidence proof fields must remain protected.
12. Approved MediaAssetVersion must not be patched.
13. PublishJob must require approved ApprovalDecision and matching content_hash.
14. UsageMeter must not record usage unless usable_output_confirmed=true.
15. CostEvent must not create customer billing.
16. AuditLog must be append-only.
17. Frontend must not invent endpoints outside OpenAPI.
18. Any missing requirement must be reported as a gap, not implemented by assumption.
```

---

## 9. Allowed Future Work Pattern

Future work must follow this sequence:

```text
1. Create a scoped planning branch.
2. Re-read README, current status, sprint reports, contracts, OpenAPI, QA suite, and change log.
3. Produce an explicit plan and gap list.
4. Implement only the approved scope after plan approval.
5. Preserve AuthGuard, WorkspaceContextGuard, MembershipCheck, PermissionGuard, ErrorModel, tenant isolation, and RBAC behavior.
6. Run strict verification before readiness decisions.
7. Update the appropriate implementation report and change log.
```

---

## 10. Guards

All workspace-scoped endpoints must use:

```text
AuthGuard
WorkspaceContextGuard
MembershipCheck
PermissionGuard
```

Expected behavior:

```text
AuthGuard validates authenticated user.
WorkspaceContextGuard extracts workspaceId from route/context only.
MembershipCheck verifies user membership in workspace.
PermissionGuard checks required permission declared by endpoint metadata.
```

---

## 11. Error Model

Every error must return:

```json
{
  "code": "string",
  "message": "string",
  "user_action": "string",
  "correlation_id": "string"
}
```

---

## 12. Final Execution Gate

```text
GO: Sprint 0 through Sprint 4 completed and passed.
GO: Repository cleanup after Sprint 4 completed and merged.
GO: Patch 002 reconciliation planning only.
NO-GO: Patch 002 activation until reconciliation is complete.
NO-GO: Sprint 5 coding without approved scoped plan.
NO-GO: Pilot.
NO-GO: Production.
```

Codex must not hide failed tests or unresolved gaps.
