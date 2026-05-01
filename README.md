# Marketing OS

Marketing OS is a Phase 0/1 execution repository for a governed AI-assisted marketing operating system.

This repository remains a contract-first implementation package. It contains a verified backend baseline through Sprint 4, a limited Patch 002 in-memory runtime baseline with strict SQL migration activation, DB-backed Slice 0 repository verification for Workspace/Membership/RBAC read paths, repository-only DB-backed Brand Slice 1 modules for BrandProfileRepository and BrandVoiceRuleRepository, and later documentation-only governance records for consolidated PRD intake, agent runtime portability, source-of-truth precedence, and progressive automation / governed agentic execution. HTTP/runtime product routes still default to the in-memory runtime. It is not approved for Pilot or Production.

## Verified Status

```text
Sprint 0: Passed
Sprint 1: Passed
Sprint 2: Passed
Sprint 3: Passed
Sprint 4: Passed
Repository cleanup after Sprint 4: Passed
Patch 002 runtime baseline: Passed as limited in-memory runtime
Patch 002 SQL migration activation: Passed for strict migration order
Migration retry verification: Passed under CI
InPactAI fit-gap study: Merged as documentation only
DB-backed Repository Architecture Contract: Passed
DB-backed Repository Slice 0 Plan: Passed
DB-backed Repository Slice 0 Implementation: Passed as Workspace/Membership/RBAC repository read-path verification only
pg Adapter Implementation: Passed for DB-backed Slice 0 only
Runtime/SQL Parity Planning: Passed as documentation only
Runtime/SQL Parity Matrix artifacts: Passed as documentation only
DB-backed Slice 1 BrandProfile / BrandVoiceRule Planning: Passed as documentation only
Brand Runtime/SQL Mapping Addendum: Passed and merged as documentation only in PR #33
DB-backed Brand Slice 1 repository-only implementation: Passed and merged
DB-backed Brand Slice 1 post-merge verification: Passed and merged
BrandProfileRepository and BrandVoiceRuleRepository: Present as repository-only modules
ChatGPT discussion idea intake source: Merged as non-authoritative intake only
Consolidated expanded PRD: Merged as documentation-only strategic blueprint
Current repository status after consolidated PRD: Merged as governance/status reconciliation
Agent runtime constraints and portability governance: Merged as documentation-only adapter/setup-data governance
Progressive Automation and Governed Agentic Execution Strategy: Merged as documentation-only strategy in PR #79
Source-of-Truth Precedence Decision Record: Added as documentation-only governance record in the current reconciliation PR
Latest merged main commit: 9e81f12
PR #24 / Patch 003 competitive feature contract reconciliation: Draft / NO-GO / not part of main
Current HTTP/runtime product routes: In-memory unless explicitly switched by a future approved PR
Brand runtime route switch: NO-GO
Public Brand get/update routes: NO-GO
DB-backed full persistence: NO-GO
Runtime agents: NO-GO
External publishing: NO-GO
Auto-replies: NO-GO
Paid ads execution: NO-GO
Budget-changing agents: NO-GO
Brand Slice 1 repository-only implementation: GO / merged / verified
Sprint 5 coding: NO-GO
Pilot: NO-GO
Production: NO-GO
```

The latest merged main commit after PR #79 is `9e81f127b91c911373972efc4baf1960a344a617`.

## Current Repository Structure

```text
.github/workflows/
  sprint0-verify.yml

docs/
  00_project_instructions.md through 20_sprint_0_report_template.md
  sprint_0_implementation_report.md through sprint_4_implementation_report.md
  repository_cleanup_after_sprint_4.md
  patch_002_runtime_implementation_report.md
  patch_002_activation_report.md
  migration_retry_verification_report.md
  db_backed_repository_architecture_contract.md
  db_backed_repository_slice_0_plan.md
  db_backed_repository_slice_0_implementation_report.md
  db_backed_slice_0_post_merge_verification_report.md
  pg_adapter_planning.md
  pg_adapter_implementation_report.md
  pg_adapter_post_merge_verification_report.md
  runtime_sql_parity_*.md
  db_backed_slice_1_candidate_selection.md
  db_backed_slice_1_brand_planning.md
  db_backed_slice_1_brand_implementation_report.md
  db_backed_slice_1_brand_post_merge_verification_report.md
  brand_runtime_sql_mapping_addendum.md
  current_repository_status_after_brand_slice_1.md
  current_repository_status_after_pr_33.md
  chatgpt_discussion_idea_intake_source.md
  marketing_os_consolidated_prd_expanded.md
  current_repository_status_after_consolidated_prd.md
  agent_runtime_constraints_and_portability.md
  progressive_automation_and_governed_agentic_execution_strategy.md
  source_of_truth_precedence_decision_record.md
  inpactai_*.md
  marketing_os_v5_6_5_phase_0_1_*.md/sql/yaml
  marketing_os_v5_6_5_codex_implementation_instructions.md
  ui_*.md

prototype/
  Static clickable prototype reference.

scripts/
  Migration, seed, OpenAPI lint, and verification scripts.

src/
  Current Sprint 4 plus Patch 002 in-memory backend entrypoints, pg Slice 0 adapter, Workspace/Membership/RBAC repositories, guards, error model, config, server, router, and store layers.

test/
  Node test suites for migrations, tenant isolation, RBAC, ErrorModel, Sprint 1-4 behavior, Patch 002 runtime behavior, DB-backed Slice 0 repository verification, OpenAPI alignment, and regression checks.

root files
  AGENTS.md
  README.md
  package.json
  package-lock.json
  .env.example
  router.js
  store.js
```

## Architecture Note

Current router/store layering after Sprint 4 cleanup:

```text
src/router.js
src/store.js
```

These are the current Sprint 4 plus Patch 002 in-memory HTTP/runtime product entrypoints. Product-domain routes still run on the in-memory store unless explicitly switched by a future approved PR.

```text
src/repositories/
src/db.js
```

These provide DB-backed Slice 0 verification only. Slice 0 covers Workspace/Membership/RBAC repository read paths and pg adapter behavior. It does not make Campaign, Brief, Brand, Media, Approval, Publish, Evidence, Report, Patch 002, Usage/Cost, Audit, or other product domains DB-backed.

```text
src/router_sprint3.js
src/store_sprint3.js
```

These remain as the Sprint 3 layer.

```text
router.js
store.js
```

These root files remain as the retained Sprint 0/1/2 base implementation.

```text
router_sprint4.js
store_sprint4.js
```

These were removed by the repository cleanup after Sprint 4.

## Authoritative Evidence

Completed implementation and verification evidence lives in:

```text
docs/sprint_0_implementation_report.md
docs/sprint_1_implementation_report.md
docs/sprint_2_implementation_report.md
docs/sprint_3_implementation_report.md
docs/sprint_4_implementation_report.md
docs/repository_cleanup_after_sprint_4.md
docs/patch_002_runtime_implementation_report.md
docs/patch_002_activation_report.md
docs/migration_retry_verification_report.md
docs/db_backed_repository_architecture_contract.md
docs/db_backed_repository_slice_0_plan.md
docs/db_backed_repository_slice_0_implementation_report.md
docs/db_backed_slice_0_post_merge_verification_report.md
docs/pg_adapter_planning.md
docs/pg_adapter_implementation_report.md
docs/pg_adapter_post_merge_verification_report.md
docs/runtime_sql_parity_planning.md
docs/runtime_sql_parity_matrix.md
docs/runtime_sql_parity_gap_register.md
docs/runtime_sql_parity_test_plan.md
docs/db_backed_slice_1_candidate_selection.md
docs/db_backed_slice_1_brand_planning.md
docs/brand_runtime_sql_mapping_addendum.md
docs/db_backed_slice_1_brand_implementation_report.md
docs/db_backed_slice_1_brand_post_merge_verification_report.md
docs/current_repository_status_after_brand_slice_1.md
docs/current_repository_status_after_pr_33.md
docs/current_repository_status_after_consolidated_prd.md
docs/source_of_truth_precedence_decision_record.md
```

The current post-Sprint 4 status summary lives in:

```text
docs/project_status_after_sprint_4.md
```

## Authoritative Contracts

The following remain the implementation authority for Phase 0/1 work:

| Area | Authoritative File |
|---|---|
| ERD | `docs/marketing_os_v5_6_5_phase_0_1_erd.md` |
| Database schema | `docs/marketing_os_v5_6_5_phase_0_1_schema.sql` |
| Schema patch 001 | `docs/marketing_os_v5_6_5_phase_0_1_schema_patch_001.sql` |
| Schema patch 002 | `docs/marketing_os_v5_6_5_phase_0_1_schema_patch_002.sql` |
| API contract | `docs/marketing_os_v5_6_5_phase_0_1_openapi.yaml` |
| OpenAPI patch 002 | `docs/marketing_os_v5_6_5_phase_0_1_openapi_patch_002.yaml` |
| Backlog | `docs/marketing_os_v5_6_5_phase_0_1_backlog.md` |
| QA suite | `docs/marketing_os_v5_6_5_phase_0_1_qa_test_suite.md` |
| Codex instructions | `AGENTS.md` and `docs/marketing_os_v5_6_5_codex_implementation_instructions.md` |
| Contract patch 001 | `docs/marketing_os_v5_6_5_phase_0_1_contract_patch_001.md` |
| DB-backed architecture contract | `docs/db_backed_repository_architecture_contract.md` |
| DB-backed Slice 0 plan | `docs/db_backed_repository_slice_0_plan.md` |
| Brand runtime/SQL mapping addendum | `docs/brand_runtime_sql_mapping_addendum.md` |
| Brand Slice 1 implementation evidence | `docs/db_backed_slice_1_brand_implementation_report.md` |
| Brand Slice 1 post-merge verification | `docs/db_backed_slice_1_brand_post_merge_verification_report.md` |
| Source-of-truth precedence | `docs/source_of_truth_precedence_decision_record.md` |
| Progressive automation strategy | `docs/progressive_automation_and_governed_agentic_execution_strategy.md` |

If a numbered file conflicts with one of these source files, stop and resolve the conflict before implementation.

## Source-of-Truth Precedence

The current source-of-truth precedence decision is documented in:

```text
docs/source_of_truth_precedence_decision_record.md
```

The consolidated expanded PRD, ChatGPT discussion intake source, future fit-gap documents, proposal registers, GitHub Issues, and agent-runtime portability notes may inform planning, but do not authorize implementation by themselves.

The root `AGENTS.md` exists and governs Codex operating discipline and repository task execution. It is not a product-level governed agent architecture contract. If a product-level agent contract is later needed, create a separate file such as:

```text
docs/governed_agent_architecture_contract.md
```

Do not create another `docs/AGENTS.md` that could conflict with root `AGENTS.md`.

## Database Migration Order

The active strict migration order is:

```text
1. docs/marketing_os_v5_6_5_phase_0_1_schema.sql
2. docs/marketing_os_v5_6_5_phase_0_1_schema_patch_001.sql
3. docs/marketing_os_v5_6_5_phase_0_1_schema_patch_002.sql
```

Patch 002 is active in strict migration order only. Migration retry verification is included in GitHub Actions and runs the strict migration sequence twice against the same database.

This does not imply DB-backed product-route persistence, Pilot readiness, or Production readiness.

## Patch 002 Status

Patch 002 runtime baseline is present on main for the limited connector, performance, contact, consent, lead capture, notification rule, and notification delivery baseline. It uses the existing in-memory runtime/store pattern.

Patch 002 SQL migration is included in strict migration order after the base schema and Patch 001. Migration retry verification passed under CI.

Patch 002 does not mean:

```text
Patch 002 DB persistence.
External provider execution.
Live sync execution.
Advanced attribution.
Auto-publishing.
Paid execution.
AI agents.
BillingProvider.
ProviderUsageLog.
Pilot readiness.
Production readiness.
DB-backed full persistence.
```

Patch 002 competitive expansion remains NO-GO. PR #24, the Patch 003 competitive feature contract reconciliation, is still Draft / NO-GO and is not part of main.

## DB-backed Repository Status

```text
DB-backed Repository Architecture Contract: Passed
DB-backed Repository Slice 0 Plan: Passed
DB-backed Repository Slice 0 Implementation: Passed as Workspace/Membership/RBAC repository read-path verification only
pg Adapter Implementation: Passed for Slice 0 only
DB-backed Brand Slice 1 repository-only implementation: Passed and merged
DB-backed Brand Slice 1 post-merge verification: Passed and merged
Current HTTP/runtime product routes: In-memory
DB-backed full persistence: NO-GO
Brand runtime route switch: NO-GO
Public Brand get/update routes: NO-GO
```

Slice 0 proves a limited repository/test read path for Workspace/Membership/RBAC. Brand Slice 1 now proves repository-only BrandProfileRepository and BrandVoiceRuleRepository methods plus repository-only integration tests. These slices do not replace the full in-memory store, do not switch HTTP/runtime product routes to DB-backed persistence, and do not authorize Campaign, Brief, Media, Approval, Publish, Evidence, Report, Patch 002, Usage/Cost, Audit, or broader write-path persistence.

## Brand Slice 1 Status

The Brand Runtime/SQL Mapping Addendum from PR #33 is merged as documentation only:

```text
docs/brand_runtime_sql_mapping_addendum.md
```

The repository-only Brand Slice 1 implementation and post-merge verification are merged:

```text
docs/db_backed_slice_1_brand_implementation_report.md
docs/db_backed_slice_1_brand_post_merge_verification_report.md
```

Brand Slice 1 now includes repository-only BrandProfileRepository and BrandVoiceRuleRepository methods and repository-only integration tests. It does not add public Brand get/update routes, does not change SQL/OpenAPI, does not implement durable AuditLog persistence, does not switch HTTP/runtime product routes to DB-backed persistence, and does not implement DB-backed full persistence.

## Governance and Agentic Strategy Status

The following documents are documentation-only planning or governance references:

```text
docs/chatgpt_discussion_idea_intake_source.md
docs/marketing_os_consolidated_prd_expanded.md
docs/current_repository_status_after_consolidated_prd.md
docs/agent_runtime_constraints_and_portability.md
docs/progressive_automation_and_governed_agentic_execution_strategy.md
docs/source_of_truth_precedence_decision_record.md
```

They do not authorize runtime agents, external providers, external publishing, auto-replies, paid execution, AI provider implementation, SQL/OpenAPI changes, runtime changes, package changes, workflow changes, Pilot, or Production.

## InPactAI Status

The InPactAI fit-gap study and near-term candidates are documentation only. They do not approve InPactAI implementation, Creator Marketplace implementation, ERD changes, SQL changes, OpenAPI changes, QA changes, runtime changes, or direct code adoption.

## Current Allowed Direction

```text
Documentation-only reconciliation: GO.
Runtime changes: NO-GO.
Brand Slice 1 repository-only implementation: GO / merged / verified.
Brand runtime route switch: NO-GO until separately planned and approved.
Patch 002 DB persistence: NO-GO.
Patch 003 / PR #24 competitive track: Draft / NO-GO / not part of main.
DB-backed full persistence: NO-GO.
Runtime agents: NO-GO.
External publishing: NO-GO.
Auto-replies: NO-GO.
Paid ads execution: NO-GO.
Budget-changing agents: NO-GO.
Sprint 5 coding: NO-GO.
Pilot: NO-GO.
Production: NO-GO.
```

This README does not authorize coding, endpoint changes, SQL/OpenAPI changes, or runtime behavior changes.

## Forbidden Next Steps

```text
No Sprint 5 coding.
No Pilot.
No Production.
No frontend.
No auto-publishing.
No auto-replies.
No external publishing.
No paid execution.
No AI agents.
No runtime agent implementation.
No advanced attribution.
No BillingProvider.
No ProviderUsageLog.
No Creator Marketplace implementation.
No InPactAI implementation.
No Patch 002 DB persistence.
No Patch 003 activation or merge while PR #24 remains Draft / NO-GO.
No Brand runtime route switch without separate review and approval.
No public Brand get/update routes without separate contract approval.
```

## Non-Negotiable Implementation Rules

```text
1. Section 52 relationship contract is the relationship authority.
2. Do not create tables named GenerationJob, Asset, or Approval.
3. Use MediaJob, MediaAsset, MediaAssetVersion, and ApprovalDecision.
4. Do not trust workspace_id from request body.
5. Every workspace-scoped query must include workspace context.
6. ManualPublishEvidence proof fields are protected.
7. ManualPublishEvidence invalidate is a limited state update only.
8. ApprovalDecision approves MediaAssetVersion through validated trigger flow.
9. Approved MediaAssetVersion must not be patched.
10. PublishJob requires approved ApprovalDecision and matching content hash.
11. UsageMeter must not record commercial usage unless usable_output_confirmed=true.
12. CostEvent is not billing or invoice source.
13. AuditLog is append-only and not business state.
14. Frontend must not invent endpoints outside OpenAPI.
15. Missing requirements must be reported as gaps, not implemented by assumption.
```
