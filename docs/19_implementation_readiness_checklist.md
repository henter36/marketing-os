# 19 — Implementation Readiness Checklist

## Purpose

This checklist determines whether the repository is ready to start Codex Sprint 0.

It does not approve Sprint 1, pilot, or production.

## Current Decision

```text
GO: Codex Sprint 0 if all Sprint 0 readiness items are checked.
NO-GO: Sprint 1 until Sprint 0 tests pass.
NO-GO: Pilot until all P0 QA tests pass.
```

## Documentation Readiness

| Item | Required | Status |
|---|---:|---|
| README explains repository status and execution order | Yes | Ready |
| docs/00_project_instructions.md exists | Yes | Ready |
| docs/01_master_document.md exists | Yes | Ready |
| docs/02_v1_scope.md exists | Yes | Ready |
| docs/03_decision_log.md exists | Yes | Ready |
| docs/04_backlog.md exists | Yes | Ready |
| docs/05_domain_map.md exists | Yes | Ready |
| docs/06_erd.md exists | Yes | Ready |
| docs/07_database_schema.sql exists | Yes | Ready |
| docs/08_api_spec.md exists | Yes | Ready |
| docs/09_screen_map.md exists | Yes | Ready |
| docs/10_user_flows.md exists | Yes | Ready |
| docs/11_sprint_plan.md exists | Yes | Ready |
| docs/12_qa_test_plan.md exists | Yes | Ready |
| docs/13_risk_register.md exists | Yes | Ready |
| docs/14_implementation_notes.md exists | Yes | Ready |
| docs/15_integration_plan.md exists | Yes | Ready |
| docs/16_traceability_matrix.md exists | Yes | Ready |
| docs/17_change_log.md exists | Yes | Ready |
| docs/18_sprint_0_execution_lock.md exists | Yes | Ready |
| docs/19_implementation_readiness_checklist.md exists | Yes | Ready |
| docs/20_sprint_0_report_template.md exists | Yes | Ready after creation |

## Authoritative Source Readiness

| Source | Required | Status |
|---|---:|---|
| ERD source | Yes | `docs/marketing_os_v5_6_5_phase_0_1_erd.md` |
| SQL base schema | Yes | `docs/marketing_os_v5_6_5_phase_0_1_schema.sql` |
| SQL Patch 001 | Yes | `docs/marketing_os_v5_6_5_phase_0_1_schema_patch_001.sql` |
| OpenAPI contract | Yes | `docs/marketing_os_v5_6_5_phase_0_1_openapi.yaml` |
| Backlog | Yes | `docs/marketing_os_v5_6_5_phase_0_1_backlog.md` |
| QA Test Suite | Yes | `docs/marketing_os_v5_6_5_phase_0_1_qa_test_suite.md` |
| Contract Patch 001 | Yes | `docs/marketing_os_v5_6_5_phase_0_1_contract_patch_001.md` |
| Codex Instructions | Yes | `docs/marketing_os_v5_6_5_codex_implementation_instructions.md` |

## Prototype Readiness

| Item | Required | Status |
|---|---:|---|
| Clickable prototype exists | Yes | `prototype/index.html` |
| Prototype README exists | Yes | `prototype/README.md` |
| UI screen inventory exists | Yes | `docs/ui_screen_inventory.md` |
| UI user flows exist | Yes | `docs/ui_user_flows.md` |
| UI permission matrix exists | Yes | `docs/ui_permission_matrix.md` |
| UI API mapping exists | Yes | `docs/ui_api_mapping.md` |
| UI Codex prompt exists | Yes | `docs/ui_codex_prompt.md` |

## Sprint 0 Technical Readiness

These items are not expected to exist before Sprint 0. They are the required output of Sprint 0.

| Item | Required Before Sprint 1 | Current Status |
|---|---:|---|
| package.json | Yes | Not yet — Sprint 0 output |
| backend framework baseline | Yes | Not yet — Sprint 0 output |
| database migration runner | Yes | Not yet — Sprint 0 output |
| environment template | Yes | Not yet — Sprint 0 output |
| RBAC seed command | Yes | Not yet — Sprint 0 output |
| OpenAPI lint command | Yes | Not yet — Sprint 0 output |
| unit/integration test commands | Yes | Not yet — Sprint 0 output |
| CI quality gate | Recommended | Not yet — can be Sprint 0/early Sprint 1 |

## Pre-Sprint 0 Go Checklist

Before giving Codex the Sprint 0 task, confirm:

```text
[ ] README reviewed
[ ] Codex Instructions reviewed
[ ] Patch 001 included in Codex Instructions
[ ] Sprint 0 Execution Lock reviewed
[ ] SQL migration order understood
[ ] Forbidden Phase 0/1 scope understood
[ ] Sprint 0 report template ready
[ ] Owner approves Sprint 0 only
```

## No-Go Conditions

Do not start Sprint 0 if:

```text
- Patch 001 is not treated as binding
- Codex is asked to implement Sprint 1+ features
- Codex is asked to build frontend before backend guardrails
- Codex is allowed to invent endpoints outside OpenAPI
- Codex is allowed to trust workspace_id from body
```

## Readiness Verdict

```text
Ready for Codex Sprint 0: YES, after owner approval.
Ready for Sprint 1: NO.
Ready for Pilot: NO.
Ready for Production: NO.
```
