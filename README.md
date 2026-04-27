# Marketing OS

Marketing OS is a Phase 0/1 execution repository for a governed AI-assisted marketing operating system.

This repository is currently a **contract-first backend implementation package**, not yet a runnable production SaaS application.

It contains:

- Approved product and execution documents
- Phase 0/1 ERD
- PostgreSQL SQL DDL and correction patch
- OpenAPI contract and sprint patches
- Sprint backlog and QA test suite
- Codex implementation instructions
- Clickable UI prototype
- UI/API/permission mapping files
- Sprint 0/1/2/3/4 implementation reports

---

## Executive Status

```text
Current implementation status: Sprint 0/1/2/3/4 implemented and verified through strict CI gates.
Current repository status: Phase 0/1 backend baseline with governed in-memory runtime behavior.
Ready for: Hardening Sprint only.
Not ready for: Sprint 5 feature expansion, pilot, production, commercial launch, or full SaaS build.
```

### Hard decision

Do not start Sprint 5 until the hardening gates in `docs/hardening_sprint_after_sprint_4.md` are completed.

The next workstream must focus on:

- Documentation and metadata alignment
- Behavior-equivalence cleanup planning
- PostgreSQL runtime persistence plan
- Auth hardening plan
- Audit append-only hardening plan
- Safe Mode protected-write policy definition
- Pilot readiness contract clarification

---

## Implemented Sprint Scope

| Sprint | Status | Main Scope |
|---|---|---|
| Sprint 0 | Implemented | Application baseline, migration wiring, tenant isolation, RBAC, ErrorModel, OpenAPI validation, P0 tests |
| Sprint 1 | Implemented | Workspace/member completion, brand, prompt/report templates, campaigns, campaign state transitions, brief versions |
| Sprint 2 | Implemented | Cost budgets, cost guardrails, media jobs, media assets, media asset versions, usage meter, quota state, cost events |
| Sprint 3 | Implemented | ReviewTask, ApprovalDecision, PublishJob, ManualPublishEvidence |
| Sprint 4 | Implemented | ClientReportSnapshot, AuditLog read model, Safe Mode, OnboardingProgress, pilot readiness regressions |
| Cleanup after Sprint 4 | Partially completed | Sprint 3/4 wrappers moved under `src`; root Sprint 0/1/2 base router/store still intentionally retained |

---

## Current Non-Production Constraints

```text
1. Runtime persistence remains in-memory.
2. PostgreSQL schema migration is validated, but the application runtime is not yet PostgreSQL-backed.
3. AuthGuard remains a test/header-based baseline and is not production authentication.
4. Audit persistence is still implementation-surface behavior, not final append-only database enforcement.
5. Safe Mode protected-write policy is not fully defined.
6. PilotGate, AdminNotification, and SetupChecklistItem APIs are not approved in OpenAPI and must not be invented.
7. Root `router.js` and `store.js` remain as the Sprint 0/1/2 base implementation until a dedicated behavior-equivalence cleanup is performed.
```

---

## Repository Structure

```text
docs/
  00_project_instructions.md
  01_master_document.md
  02_v1_scope.md
  03_decision_log.md
  04_backlog.md
  05_domain_map.md
  06_erd.md
  07_database_schema.sql
  08_api_spec.md
  09_screen_map.md
  10_user_flows.md
  11_sprint_plan.md
  12_qa_test_plan.md
  13_risk_register.md
  14_implementation_notes.md
  15_integration_plan.md
  16_traceability_matrix.md
  17_change_log.md

  marketing_os_v5_6_5_phase_0_1_erd.md
  marketing_os_v5_6_5_phase_0_1_schema.sql
  marketing_os_v5_6_5_phase_0_1_schema_patch_001.sql
  marketing_os_v5_6_5_phase_0_1_openapi.yaml
  marketing_os_v5_6_5_phase_0_1_openapi_sprint3_patch.yaml
  marketing_os_v5_6_5_phase_0_1_backlog.md
  marketing_os_v5_6_5_phase_0_1_qa_test_suite.md
  marketing_os_v5_6_5_codex_implementation_instructions.md
  marketing_os_v5_6_5_phase_0_1_contract_patch_001.md

  sprint_1_implementation_report.md
  sprint_2_implementation_report.md
  sprint_3_implementation_report.md
  sprint_4_scope_plan.md
  sprint_4_implementation_report.md
  repository_cleanup_after_sprint_4.md
  hardening_sprint_after_sprint_4.md

src/
  server.js
  router.js
  router_sprint3.js
  store.js
  store_sprint3.js
  config.js
  error-model.js
  guards.js
  rbac.js

prototype/
  index.html
  styles.css
  app.js
  README.md
```

---

## How to Read This Repository

### 1. Governance and product authority

```text
docs/00_project_instructions.md
docs/01_master_document.md
docs/02_v1_scope.md
docs/03_decision_log.md
```

### 2. Execution contracts

```text
docs/04_backlog.md
docs/05_domain_map.md
docs/06_erd.md
docs/07_database_schema.sql
docs/08_api_spec.md
docs/marketing_os_v5_6_5_phase_0_1_openapi.yaml
docs/marketing_os_v5_6_5_phase_0_1_openapi_sprint3_patch.yaml
```

### 3. Sprint reports

```text
docs/sprint_1_implementation_report.md
docs/sprint_2_implementation_report.md
docs/sprint_3_implementation_report.md
docs/sprint_4_scope_plan.md
docs/sprint_4_implementation_report.md
docs/repository_cleanup_after_sprint_4.md
docs/hardening_sprint_after_sprint_4.md
```

### 4. UX and workflow mapping

```text
docs/09_screen_map.md
docs/10_user_flows.md
docs/ui_screen_inventory.md
docs/ui_user_flows.md
docs/ui_permission_matrix.md
docs/ui_api_mapping.md
```

### 5. QA and risk control

```text
docs/12_qa_test_plan.md
docs/13_risk_register.md
docs/16_traceability_matrix.md
```

---

## Authoritative Source Files

| Area | Authoritative File |
|---|---|
| ERD | `docs/marketing_os_v5_6_5_phase_0_1_erd.md` |
| Database schema | `docs/marketing_os_v5_6_5_phase_0_1_schema.sql` |
| Schema patch | `docs/marketing_os_v5_6_5_phase_0_1_schema_patch_001.sql` |
| API contract | `docs/marketing_os_v5_6_5_phase_0_1_openapi.yaml` |
| Sprint 3 API patch | `docs/marketing_os_v5_6_5_phase_0_1_openapi_sprint3_patch.yaml` |
| Backlog | `docs/marketing_os_v5_6_5_phase_0_1_backlog.md` |
| QA suite | `docs/marketing_os_v5_6_5_phase_0_1_qa_test_suite.md` |
| Codex instructions | `docs/marketing_os_v5_6_5_codex_implementation_instructions.md` |
| Binding correction patch | `docs/marketing_os_v5_6_5_phase_0_1_contract_patch_001.md` |
| Hardening gate | `docs/hardening_sprint_after_sprint_4.md` |

If any numbered file conflicts with the authoritative source files, stop and resolve the conflict before implementation.

---

## Database Migration Order

Apply schema files in this exact order:

```text
1. docs/marketing_os_v5_6_5_phase_0_1_schema.sql
2. docs/marketing_os_v5_6_5_phase_0_1_schema_patch_001.sql
```

Do not silently edit historical SQL to change business rules. Use a new numbered patch file for future corrections.

---

## Phase 0/1 Forbidden Scope

Do not implement the following in Phase 0/1 unless an approved OpenAPI/backlog/schema change explicitly moves it into scope:

```text
Auto-publishing
Paid execution
AI agents
Advanced attribution
BillingProvider
ProviderUsageLog
External workflow automation as source of truth
Unapproved PilotGate API
Unapproved AdminNotification API
Unapproved SetupChecklistItem API
```

---

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
16. Sprint 5 must not begin before hardening gates are closed.
```

---

## Required Quality Gates

The repository must continue to support:

```bash
npm run db:migrate
npm run db:seed
npm run openapi:lint
npm test
npm run test:integration
npm run verify
```

Strict gate:

```bash
npm run verify:strict
```

---

## Current Decision

```text
GO: Hardening Sprint after Sprint 4.
NO-GO: Sprint 5 feature expansion until hardening gates are complete.
NO-GO: Pilot until PostgreSQL runtime persistence, production authentication, audit hardening, and pilot readiness contract are resolved.
NO-GO: Production.
```
