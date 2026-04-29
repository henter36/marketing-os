# 17 - Change Log

## Purpose

This document records major documentation and contract changes for Marketing OS.

## Change Log

| Date | Change | Files / Area | Impact |
|---|---|---|---|
| 2026-04-26 | Initial repository setup | README, docs | Repository created |
| 2026-04-26 | Added project instructions | `docs/00_project_instructions.md` | Established execution guidance |
| 2026-04-26 | Added master document | `docs/01_master_document.md` | Established main reference document |
| 2026-04-26 | Added V1 scope and decision log | `docs/02_v1_scope.md`, `docs/03_decision_log.md` | Defined initial scope and decisions |
| 2026-04-26 | Added Phase 0/1 ERD | `docs/marketing_os_v5_6_5_phase_0_1_erd.md` | Data model source added |
| 2026-04-26 | Added Phase 0/1 SQL schema | `docs/marketing_os_v5_6_5_phase_0_1_schema.sql` | Database contract added |
| 2026-04-26 | Added Phase 0/1 OpenAPI contract | `docs/marketing_os_v5_6_5_phase_0_1_openapi.yaml` | API contract added |
| 2026-04-26 | Added Sprint Backlog | `docs/marketing_os_v5_6_5_phase_0_1_backlog.md` | Sprint execution source added |
| 2026-04-26 | Added QA Test Suite | `docs/marketing_os_v5_6_5_phase_0_1_qa_test_suite.md` | QA gate source added |
| 2026-04-26 | Added Codex implementation instructions | `docs/marketing_os_v5_6_5_codex_implementation_instructions.md` | Codex execution guardrails added |
| 2026-04-26 | Added Schema Patch 001 | `docs/marketing_os_v5_6_5_phase_0_1_schema_patch_001.sql` | Fixed ApprovalDecision and ManualPublishEvidence conflicts |
| 2026-04-26 | Added Contract Patch 001 | `docs/marketing_os_v5_6_5_phase_0_1_contract_patch_001.md` | Made patch binding across docs |
| 2026-04-26 | Added clickable prototype | `prototype/` | Visual and interactive UI review model added |
| 2026-04-26 | Added UI mapping docs | `docs/ui_*` | Linked screens, flows, permissions, and API mapping |
| 2026-04-26 | Added canonical docs structure 04-17 | `docs/04_backlog.md` through `docs/17_change_log.md` | Completed ordered documentation skeleton |
| 2026-04-27 | Sprint 0 completed and passed strict verification | `docs/sprint_0_implementation_report.md` | Established backend baseline, migration wiring, guards, ErrorModel, RBAC seed data, basic workspace/member/roles/permissions endpoints, OpenAPI validation, and Sprint 0 tests |
| 2026-04-27 | Sprint 1 completed and passed strict verification | `docs/sprint_1_implementation_report.md` | Completed workspace/member management and Sprint 1 resource endpoints within OpenAPI scope |
| 2026-04-27 | Sprint 2 completed and passed strict verification | `docs/sprint_2_implementation_report.md` | Completed Sprint 2 implementation scope and retained Pilot/Production NO-GO |
| 2026-04-27 | Sprint 3 completed and passed strict verification | `docs/sprint_3_implementation_report.md` | Completed Sprint 3 implementation scope and retained Pilot/Production NO-GO |
| 2026-04-27 | Sprint 4 completed and passed strict verification | `docs/sprint_4_implementation_report.md` | Completed Sprint 4 implementation scope and retained Pilot/Production NO-GO |
| 2026-04-28 | Repository cleanup after Sprint 4 completed and merged | `docs/repository_cleanup_after_sprint_4.md`, router/store layering | Consolidated Sprint 4 entrypoints to `src/router.js` and `src/store.js`, retained Sprint 3 and Sprint 0/1/2 layers, removed Sprint 4 root wrappers |
| 2026-04-28 | README/Codex documentation reconciliation performed | `README.md`, `docs/marketing_os_v5_6_5_codex_implementation_instructions.md`, `docs/project_status_after_sprint_4.md` | Updated repository status from Sprint 0-only to post-Sprint 4 verified state |
| 2026-04-28 | Patch 002 noted as existing but pending reconciliation before activation | Patch 002 docs, QA suite, reconciliation notes | Patch 002 must not be added to migration order or treated as implemented until naming, QA, and migration idempotency are reconciled |
| 2026-04-28 | DB-backed Slice 0 post-merge verification documented | `docs/db_backed_slice_0_post_merge_verification_report.md` | Confirmed PR #25 merged and passed main strict verification while DB-backed runtime/full persistence, Sprint 5, Pilot, and Production remain NO-GO |
| 2026-04-28 | pg adapter planning documented | `docs/pg_adapter_planning.md` | Planned replacement/supersession path for the Slice 0 `psql`/spawn adapter while pg implementation, Slice 1, Sprint 5, Pilot, and Production remain NO-GO |
| 2026-04-28 | pg adapter implemented for DB-backed Slice 0 repositories | `src/db.js`, Slice 0 repositories/tests, `docs/pg_adapter_implementation_report.md` | Replaced the Slice 0 `psql`/spawn query adapter with node-postgres for Workspace/Membership/RBAC read-path verification only; full DB-backed persistence, Slice 1, Sprint 5, Pilot, and Production remain NO-GO |
| 2026-04-28 | pg adapter post-merge verification documented | `docs/pg_adapter_post_merge_verification_report.md` | Confirmed PR #28 merged and passed main strict verification while pg remains limited to Slice 0 and full DB-backed persistence, Slice 1, Sprint 5, Pilot, and Production remain NO-GO |
| 2026-04-28 | Runtime/SQL parity planning documented | `docs/runtime_sql_parity_planning.md` | Planned parity matrix, gap register, test plan, and Slice 1 candidate selection before implementation while Runtime/SQL parity implementation, Slice 1, Sprint 5, Pilot, and Production remain NO-GO |
| 2026-04-29 | Runtime/SQL parity matrix artifacts added | `docs/runtime_sql_parity_matrix.md`, `docs/runtime_sql_parity_gap_register.md`, `docs/runtime_sql_parity_test_plan.md`, `docs/db_backed_slice_1_candidate_selection.md` | Added documentation-only parity matrix, gap register, test plan, and Slice 1 candidate recommendation while Runtime/SQL parity implementation, Slice 1, Sprint 5, Pilot, and Production remain NO-GO |
| 2026-04-29 | DB-backed Slice 1 BrandProfile / BrandVoiceRule planning documented | `docs/db_backed_slice_1_brand_planning.md` | Added documentation-only planning for the BrandProfile / BrandVoiceRule candidate slice; Slice 1 implementation, DB-backed full persistence, Campaign/Brief/Patch 002 persistence, Sprint 5, Pilot, and Production remain NO-GO |
| 2026-04-29 | Brand Runtime/SQL mapping addendum documented | `docs/brand_runtime_sql_mapping_addendum.md` | Resolved documentation-only BrandProfile / BrandVoiceRule field, default, status, route, duplicate, response shape, tenant isolation, and ErrorModel mapping decisions; Slice 1 implementation, full DB-backed persistence, Sprint 5, Pilot, and Production remain NO-GO |
| 2026-04-29 | Current repository status reconciled after PR #33 | `README.md`, `docs/project_status_after_sprint_4.md`, `docs/17_change_log.md`, `docs/current_repository_status_after_pr_33.md` | Reconciled current-state documentation after the Brand mapping addendum; DB-backed Slice 0 and pg are limited to Workspace/Membership/RBAC repository read-path verification, product routes remain in-memory, PR #24 / Patch 003 remains Draft / NO-GO, and Slice 1, Sprint 5, Pilot, and Production remain NO-GO |
| 2026-04-29 | Brand Slice 1 implementation gate reviewed | `docs/brand_slice_1_implementation_gate_review.md`, `docs/17_change_log.md` | Locked a documentation-only CONDITIONAL GO for a future repository-only BrandProfile / BrandVoiceRule implementation preparation while runtime route switching, get/update routes, SQL/OpenAPI changes, durable AuditLog claims, DB-backed full persistence, Sprint 5, Pilot, and Production remain NO-GO |
| 2026-04-29 | DB-backed Brand Slice 1 repositories implemented | `src/repositories/brand-profile-repository.js`, `src/repositories/brand-voice-rule-repository.js`, `src/repositories/index.js`, `test/integration/db-backed-slice1-brand.integration.test.js`, `docs/db_backed_slice_1_brand_implementation_report.md` | Added repository-only BrandProfile / BrandVoiceRule DB-backed list/create/internal validation slice with integration tests; HTTP/runtime route switching, public get/update routes, SQL/OpenAPI changes, durable AuditLog persistence, DB-backed full persistence, Sprint 5, Pilot, and Production remain NO-GO |
| 2026-04-29 | Deferred architecture / logic remediation execution plan added | `docs/deferred_architecture_logic_remediation_execution_plan.md`, `docs/17_change_log.md` | Added a documentation-only deferred execution plan for architecture, validation, environment, guardrail, retry, and templating remediation after current repairs; no runtime, SQL, OpenAPI, package, workflow, or test changes are authorized by this plan |
| 2026-04-29 | Conversation-derived proposal and fix priority plan added | `docs/conversation_derived_proposal_and_fix_priority_plan.md`, `docs/17_change_log.md` | Consolidated conversation-derived proposals, fixes, deferrals, rejection decisions, impact matrix, and PR strategy into a documentation-only priority plan; no runtime, SQL, OpenAPI, QA, package, workflow, or migration changes are authorized |
| 2026-04-29 | Future technical and business ideas fit-gap added | `docs/future_technical_and_business_ideas_fit_gap.md`, `docs/17_change_log.md` | Captured eventing, AI, analytics, marketplace, integration, security, DevOps, and collaboration ideas as a future fit/gap register only; no current runtime, SQL, OpenAPI, QA, package, workflow, migration, or Core V1 implementation changes are authorized |
| 2026-04-29 | AI features and Campaign Canvas future fit-gap added | `docs/ai_and_campaign_canvas_future_fit_gap.md`, `docs/17_change_log.md` | Captured Brand Brain, Brief-to-Content Agent, Brand Compliance Scorer, Competitive Intelligence, React Flow, and dnd-kit Campaign Canvas proposals as future fit/gap only; no runtime, SQL, OpenAPI, QA, package, workflow, frontend, AI, migration, or Core V1 implementation changes are authorized |

## Change Governance

1. Do not silently edit historical contract files to change business rules.
2. Use new numbered patch files for contract corrections.
3. Update this change log whenever a source-of-truth document changes.
4. If a patch supersedes prior wording, state the superseded scope explicitly.
5. Codex must treat unresolved contract conflicts as stop conditions.

## Current Execution Decision

```text
GO: Sprint 0, Sprint 1, Sprint 2, Sprint 3, and Sprint 4 are completed and passed.
GO: Repository cleanup after Sprint 4 is completed and merged to main.
GO: Patch 002 limited in-memory runtime baseline is present on main.
GO: Patch 002 SQL migration activation is active in strict migration order.
GO: Migration retry verification remains part of the strict gate.
GO: DB-backed Slice 0 exists for Workspace/Membership/RBAC repository read-path verification only.
GO: pg adapter exists for DB-backed Slice 0 only.
GO: Brand Runtime/SQL Mapping Addendum from PR #33 is merged as documentation only.
GO: Brand Slice 1 implementation gate review is complete as documentation only.
GO: repository-only Brand Slice 1 is implemented for BrandProfile / BrandVoiceRule list/create/internal validation methods.
CONDITIONAL GO: deferred architecture / logic remediation planning is documented for later use after current repairs and a dedicated audit.
CONDITIONAL GO: conversation-derived proposal consolidation is documented for planning and scope-control only.
CONDITIONAL GO: future technical and business ideas are documented as future fit/gap only.
CONDITIONAL GO: AI and Campaign Canvas proposals are documented as future fit/gap only.
NO-GO: Runtime changes from this reconciliation.
NO-GO: HTTP/runtime product route switch.
NO-GO: HTTP/runtime product routes are DB-backed by default.
NO-GO: public Brand get/update routes.
NO-GO: SQL/OpenAPI changes.
NO-GO: durable AuditLog persistence claims.
NO-GO: DB-backed full persistence.
NO-GO: Campaign persistence.
NO-GO: BriefVersion persistence.
NO-GO: Media, Approval, Publish, Evidence, Patch 002, Usage/Cost, or Audit persistence.
NO-GO: PR #24 / Patch 003 competitive feature contract reconciliation while draft; it is not part of main.
NO-GO: immediate implementation of Python validators.py, generic middleware, retry logic, or dynamic templating under the deferred remediation plan.
NO-GO: execution of conversation-derived P2/P3 future ideas without separate contract/RFC/QA approval.
NO-GO: execution of future technical/business ideas without separate RFC, contract impact review, and QA approval.
NO-GO: execution of AI or Campaign Canvas proposals without separate RFC, contract impact review, QA approval, and prerequisite DB-backed/runtime/frontend maturity.
NO-GO: Sprint 5 coding.
NO-GO: Pilot.
NO-GO: Production.
```
