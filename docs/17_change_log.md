# 17 — Change Log

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
| 2026-04-26 | Added canonical docs structure 04–17 | `docs/04_backlog.md` through `docs/17_change_log.md` | Completed ordered documentation skeleton |

## Change Governance

1. Do not silently edit historical contract files to change business rules.
2. Use new numbered patch files for contract corrections.
3. Update this change log whenever a source-of-truth document changes.
4. If a patch supersedes prior wording, state the superseded scope explicitly.
5. Codex must treat unresolved contract conflicts as stop conditions.

## Current Execution Decision

```text
GO: Codex Sprint 0 after owner approval.
NO-GO: Sprint 1 until Sprint 0 tests pass.
NO-GO: Pilot until all P0 QA tests pass.
```
