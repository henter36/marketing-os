# Marketing OS V5.6.5 - Codex Implementation Instructions

> **Document type:** Codex execution instructions / implementation guardrails  
> **Scope:** Phase 0/1 only  
> **Repository:** `henter36/marketing-os`  
> **Status:** Current-status reconciliation after Sprint 4, Patch 002 activation, DB-backed Slice 0, and repository-only Brand Slice 1  
> **Runtime impact:** Documentation-only  
> **SQL/OpenAPI impact:** None  
> **Pilot:** NO-GO  
> **Production:** NO-GO

---

## 1. Executive Instruction

Codex must implement Marketing OS Phase 0/1 only, and only inside an explicitly approved planning or implementation branch.

This repository is a contract-first execution package. It contains:

```text
Sprint 0 through Sprint 4 verified backend baseline.
Repository cleanup after Sprint 4.
Patch 002 limited in-memory runtime baseline.
Patch 002 SQL migration activation in strict migration order.
Migration retry verification under CI.
DB-backed Slice 0 repository verification for Workspace / Membership / RBAC read paths.
pg adapter implementation for DB-backed Slice 0 only.
Repository-only DB-backed Brand Slice 1 modules for BrandProfileRepository and BrandVoiceRuleRepository.
```

Current HTTP/runtime product routes still default to the in-memory runtime unless a future approved PR explicitly switches a route.

Codex must not infer product scope, add features, rename entities, introduce new domains, or implement deferred functionality.

If approved files conflict, Codex must stop and report the conflict instead of guessing.

---

## 2. Current Repository Reality

Codex must treat the following as the current execution reality:

```text
GO: Sprint 0 completed and verified.
GO: Sprint 1 completed and verified.
GO: Sprint 2 completed and verified.
GO: Sprint 3 completed and verified.
GO: Sprint 4 completed and verified.
GO: Repository cleanup after Sprint 4 completed and merged.
GO: Patch 002 limited in-memory runtime baseline is present on main.
GO: Patch 002 SQL migration activation is active in strict migration order.
GO: Migration retry verification remains part of the strict gate.
GO: DB-backed Slice 0 exists for Workspace / Membership / RBAC repository read-path verification only.
GO: pg adapter exists for DB-backed Slice 0 only.
GO: Brand Runtime / SQL Mapping Addendum is merged as documentation only.
GO: repository-only Brand Slice 1 is implemented and verified for BrandProfileRepository and BrandVoiceRuleRepository.
NO-GO: HTTP/runtime product routes are DB-backed by default.
NO-GO: Brand runtime route switch.
NO-GO: public Brand get/update routes.
NO-GO: durable AuditLog persistence claims.
NO-GO: DB-backed full persistence.
NO-GO: Campaign persistence.
NO-GO: BriefVersion persistence.
NO-GO: Media, Approval, Publish, Evidence, Usage/Cost, Patch 002, or Audit persistence.
NO-GO: Sprint 5 coding without an approved scoped plan.
NO-GO: Pilot.
NO-GO: Production.
```

---

## 3. Source-of-Truth Precedence

Codex must use this precedence when files conflict:

```text
1. README.md for current repository execution status.
2. docs/current_repository_status_after_brand_slice_1.md for post-Brand-Slice-1 status.
3. docs/17_change_log.md for accepted historical/current changes.
4. docs/marketing_os_v5_6_5_phase_0_1_erd.md for Phase 0/1 relationship authority.
5. docs/marketing_os_v5_6_5_phase_0_1_schema.sql and approved schema patches for database authority.
6. docs/marketing_os_v5_6_5_phase_0_1_openapi.yaml and approved OpenAPI patches for API authority.
7. docs/marketing_os_v5_6_5_phase_0_1_backlog.md for sprint/story intent.
8. docs/marketing_os_v5_6_5_phase_0_1_qa_test_suite.md for QA gates.
9. docs/marketing_os_v5_6_5_codex_implementation_instructions.md for Codex operating discipline.
10. docs/01_master_document.md as PRD/product vision only, not as an implementation override.
```

If a PRD reconciliation addendum exists, Codex must treat it as a binding correction layer for interpreting PRD ambition, but it still must not override ERD, SQL, OpenAPI, QA, README, or current status.

Hard stop rule:

```text
If source files conflict and precedence does not resolve the conflict, stop and report the conflict. Do not implement by assumption.
```

---

## 4. Mandatory Approved Sources

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
docs/marketing_os_v5_6_5_phase_0_1_schema_patch_002.sql
docs/marketing_os_v5_6_5_phase_0_1_openapi.yaml
docs/marketing_os_v5_6_5_phase_0_1_openapi_patch_002.yaml
docs/marketing_os_v5_6_5_phase_0_1_backlog.md
docs/marketing_os_v5_6_5_phase_0_1_qa_test_suite.md
docs/marketing_os_v5_6_5_phase_0_1_contract_patch_001.md

docs/db_backed_repository_architecture_contract.md
docs/db_backed_repository_slice_0_plan.md
docs/db_backed_repository_slice_0_implementation_report.md
docs/db_backed_slice_0_post_merge_verification_report.md
docs/pg_adapter_implementation_report.md
docs/runtime_sql_parity_matrix.md
docs/runtime_sql_parity_gap_register.md
docs/runtime_sql_parity_test_plan.md
docs/db_backed_slice_1_candidate_selection.md
docs/db_backed_slice_1_brand_planning.md
docs/brand_runtime_sql_mapping_addendum.md
docs/db_backed_slice_1_brand_implementation_report.md
docs/db_backed_slice_1_brand_post_merge_verification_report.md
docs/current_repository_status_after_brand_slice_1.md

docs/ui_screen_inventory.md
docs/ui_user_flows.md
docs/ui_permission_matrix.md
docs/ui_api_mapping.md
docs/ui_codex_prompt.md
```

Patch 001 and Patch 002 remain mandatory and binding only within their approved scope.

---

## 5. Current Migration Order

The active strict SQL migration order is:

```text
1. docs/marketing_os_v5_6_5_phase_0_1_schema.sql
2. docs/marketing_os_v5_6_5_phase_0_1_schema_patch_001.sql
3. docs/marketing_os_v5_6_5_phase_0_1_schema_patch_002.sql
```

Patch 002 is active in strict migration order only.

This does not imply:

```text
Patch 002 DB persistence.
Product-route DB persistence.
Pilot readiness.
Production readiness.
```

`docs/07_database_schema.sql` is a wrapper/index file. If a migration runner does not support `\i`, configure the runner to execute the three SQL files directly in the order above.

Codex must not add new SQL patches, reorder migrations, or activate additional migration files without a separate approved contract and migration plan.

---

## 6. Patch 002 Status

Patch 002 status is:

```text
GO: limited in-memory runtime baseline.
GO: SQL migration activation in strict migration order.
GO: migration retry verification under CI.
NO-GO: Patch 002 DB persistence.
NO-GO: external provider execution.
NO-GO: live sync execution.
NO-GO: advanced attribution.
NO-GO: auto-publishing.
NO-GO: paid execution.
NO-GO: AI agents.
NO-GO: BillingProvider implementation.
NO-GO: ProviderUsageLog implementation.
NO-GO: Pilot readiness.
NO-GO: Production readiness.
```

Codex must not describe Patch 002 as fully implemented, DB-backed, production-ready, or pilot-ready.

Patch 002 competitive expansion remains NO-GO while PR #24 / Patch 003 remains Draft / NO-GO and not part of main.

---

## 7. Current Architecture Note

Current Sprint 4 plus Patch 002 in-memory HTTP/runtime product entrypoints:

```text
src/router.js
src/store.js
```

DB-backed Slice 0 repository and pg adapter path:

```text
src/repositories/
src/db.js
```

This path is limited to Workspace / Membership / RBAC repository read-path verification and does not make product domains DB-backed.

Repository-only Brand Slice 1 modules:

```text
src/repositories/brand-profile-repository.js
src/repositories/brand-voice-rule-repository.js
```

Brand Slice 1 is repository-only. It does not switch HTTP/runtime product routes.

Sprint 3 retained layer:

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

## 8. Brand Slice 1 Status

Brand Slice 1 is approved only as repository-only persistence verification.

Current GO scope:

```text
BrandProfileRepository.listByWorkspace({ workspaceId })
BrandProfileRepository.create({ workspaceId, input, actorUserId })
BrandProfileRepository.getById({ workspaceId, brandProfileId }) for internal validation and tests
BrandVoiceRuleRepository.listByBrandProfile({ workspaceId, brandProfileId })
BrandVoiceRuleRepository.create({ workspaceId, brandProfileId, input })
BrandVoiceRule internal parent BrandProfile validation
Repository-only integration tests
```

Current NO-GO scope:

```text
HTTP/runtime route switch.
Public Brand get/update routes.
SQL/OpenAPI changes.
Durable AuditLog persistence claims.
DB-backed full persistence.
Campaign persistence.
BriefVersion persistence.
Media persistence.
Approval persistence.
Publish persistence.
Evidence persistence.
Patch 002 DB persistence.
Usage/Cost persistence.
Audit persistence.
Sprint 5.
Pilot.
Production.
```

Recommended next step is planning only:

```text
Brand Slice 1 Runtime Switch Planning.
```

No runtime switch may be implemented until the plan defines allowed files, forbidden files, tests, rollback strategy, and CI gates.

---

## 9. Patch 001 Binding Corrections

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

## 10. PRD Interpretation Rule

Codex must read the PRD / master document as product vision and strategic direction, not as a standalone implementation contract.

PRD statements about future strategic capabilities do not authorize implementation unless those capabilities are also present in the approved ERD, SQL, OpenAPI, QA, and execution plan.

Strategic future capabilities that remain NO-GO without separate contract patches include:

```text
AIProvider
AIProviderCredential
AIModelRegistry
ModelRoutingPolicy
ProviderUsageLog
ProviderQuotaState
ProviderFailureEvent
BillingProvider
BillingProviderConfig
PublishedPostSnapshot
AttributionDecision
SocialAutoPublishConnector
PaidExecution
AgentRun
Full AI agents
Advanced attribution
Automated campaign orchestration
External provider execution
Live sync execution
```

---

## 11. Non-Negotiable Rules

```text
1. Section 52 relationship contract is the relationship authority.
2. Do not create tables named GenerationJob, Asset, or Approval.
3. Use MediaJob, MediaAsset, MediaAssetVersion, and ApprovalDecision.
4. Do not implement auto-publishing in Phase 0/1.
5. Do not implement paid execution in Phase 0/1.
6. Do not implement advanced attribution in Phase 0/1.
7. Do not implement AI agents in Phase 0/1.
8. Do not implement BillingProvider or ProviderUsageLog unless a new approved contract adds them.
9. Do not implement AIProvider, AIModelRegistry, or external provider execution unless a new approved contract adds them.
10. Do not trust workspace_id from request body.
11. Every workspace-scoped query must include workspace context.
12. ManualPublishEvidence proof fields must remain protected.
13. ManualPublishEvidence invalidate is a limited state update only.
14. Approved MediaAssetVersion must not be patched.
15. PublishJob must require approved ApprovalDecision and matching content_hash.
16. UsageMeter must not record usage unless usable_output_confirmed=true.
17. CostEvent must not create customer billing.
18. AuditLog must be append-only and must not be treated as business state.
19. Frontend must not invent endpoints outside OpenAPI.
20. Any missing requirement must be reported as a gap, not implemented by assumption.
```

---

## 12. Allowed Future Work Pattern

Future work must follow this sequence:

```text
1. Create a scoped planning branch.
2. Re-read README, current status, sprint reports, contracts, OpenAPI, QA suite, change log, and relevant reconciliation docs.
3. Produce an explicit plan and gap list.
4. State allowed files and forbidden files.
5. State whether SQL, OpenAPI, runtime, tests, package files, scripts, or workflows are allowed or forbidden.
6. Implement only the approved scope after plan approval.
7. Preserve AuthGuard, WorkspaceContextGuard, MembershipCheck, PermissionGuard, ErrorModel, tenant isolation, RBAC, idempotency, and audit behavior.
8. Run strict verification before readiness decisions.
9. Update the appropriate implementation report and change log when the change is accepted.
```

---

## 13. Guards

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

## 14. Error Model

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

## 15. Final Execution Gate

```text
GO: Sprint 0 through Sprint 4 completed and passed.
GO: Repository cleanup after Sprint 4 completed and merged.
GO: Patch 002 limited in-memory runtime baseline.
GO: Patch 002 SQL migration activation in strict migration order.
GO: Migration retry verification under CI.
GO: DB-backed Slice 0 repository verification only.
GO: pg adapter for DB-backed Slice 0 only.
GO: repository-only Brand Slice 1 implementation and verification.
GO: Documentation-only reconciliation.
NO-GO: Runtime changes from this document.
NO-GO: SQL/OpenAPI changes from this document.
NO-GO: Brand runtime route switch without separate approved plan.
NO-GO: public Brand get/update routes without separate approved contract.
NO-GO: DB-backed full persistence.
NO-GO: Patch 002 DB persistence.
NO-GO: Sprint 5 coding without approved scoped plan.
NO-GO: Pilot.
NO-GO: Production.
```

Codex must not hide failed tests, unresolved gaps, stale documentation, or source-of-truth conflicts.
