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
GO: Patch 002 reconciliation planning only.
NO-GO: Patch 002 activation until reconciliation is complete.
NO-GO: Sprint 5 coding without an approved scoped plan.
NO-GO: Pilot.
NO-GO: Production.
```
