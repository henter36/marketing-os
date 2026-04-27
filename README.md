# Marketing OS

Marketing OS is a Phase 0/1 execution repository for a governed AI-assisted marketing operating system.

This repository is currently a **contract-first implementation package**, not yet a runnable production application.

It contains:

- Approved product and execution documents
- Phase 0/1 ERD
- PostgreSQL SQL DDL
- SQL correction patch
- OpenAPI contract
- Sprint backlog
- QA test suite
- Codex implementation instructions
- Clickable UI prototype
- UI/API/permission mapping files

---

## Executive Status

```text
Current status: Ready for Codex Sprint 0 only
Not ready for: Sprint 1, pilot, production, or full product build
```

Sprint 0 must establish the runnable technical baseline, including:

- Backend framework baseline
- PostgreSQL migration wiring
- Tenant isolation
- RBAC
- ErrorModel
- OpenAPI validation
- P0 tests

Do not start Sprint 1 until Sprint 0 passes its quality gates.

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
  marketing_os_v5_6_5_phase_0_1_backlog.md
  marketing_os_v5_6_5_phase_0_1_qa_test_suite.md
  marketing_os_v5_6_5_codex_implementation_instructions.md
  marketing_os_v5_6_5_phase_0_1_contract_patch_001.md

  ui_screen_inventory.md
  ui_user_flows.md
  ui_permission_matrix.md
  ui_api_mapping.md
  ui_codex_prompt.md

prototype/
  index.html
  styles.css
  app.js
  README.md
```

---

## How to Read This Repository

Read files in this order:

### 1. Project governance

```text
docs/00_project_instructions.md
docs/01_master_document.md
docs/02_v1_scope.md
docs/03_decision_log.md
```

Purpose:

- Understand the product intent
- Understand Phase 0/1 scope
- Understand binding decisions
- Avoid reopening already-settled scope decisions

### 2. Execution structure

```text
docs/04_backlog.md
docs/05_domain_map.md
docs/06_erd.md
docs/07_database_schema.sql
docs/08_api_spec.md
```

Purpose:

- Understand backlog source
- Understand domain boundaries
- Understand database model
- Understand SQL migration order
- Understand OpenAPI as the frontend/backend contract

### 3. UX and workflow mapping

```text
docs/09_screen_map.md
docs/10_user_flows.md
docs/ui_screen_inventory.md
docs/ui_user_flows.md
docs/ui_permission_matrix.md
docs/ui_api_mapping.md
```

Purpose:

- Understand screens
- Understand user flows
- Understand role-based access
- Understand API-to-screen mapping
- Validate UI without expanding scope

### 4. Sprint execution and QA

```text
docs/11_sprint_plan.md
docs/12_qa_test_plan.md
docs/13_risk_register.md
docs/14_implementation_notes.md
docs/15_integration_plan.md
docs/16_traceability_matrix.md
docs/17_change_log.md
```

Purpose:

- Understand sprint sequence
- Understand QA gates
- Understand major risks
- Understand integration boundaries
- Trace requirements to DB/API/UI/tests
- Track contract changes

### 5. Codex execution package

```text
docs/marketing_os_v5_6_5_codex_implementation_instructions.md
docs/ui_codex_prompt.md
```

Purpose:

- Give Codex strict implementation boundaries
- Prevent scope drift
- Prevent invented features
- Enforce Sprint 0 first

---

## Authoritative Source Files

The numbered files provide structure, but the following files are the detailed approved sources for implementation:

| Area | Authoritative File |
|---|---|
| ERD | `docs/marketing_os_v5_6_5_phase_0_1_erd.md` |
| Database schema | `docs/marketing_os_v5_6_5_phase_0_1_schema.sql` |
| Schema patch | `docs/marketing_os_v5_6_5_phase_0_1_schema_patch_001.sql` |
| API contract | `docs/marketing_os_v5_6_5_phase_0_1_openapi.yaml` |
| Backlog | `docs/marketing_os_v5_6_5_phase_0_1_backlog.md` |
| QA suite | `docs/marketing_os_v5_6_5_phase_0_1_qa_test_suite.md` |
| Codex instructions | `docs/marketing_os_v5_6_5_codex_implementation_instructions.md` |
| Binding correction patch | `docs/marketing_os_v5_6_5_phase_0_1_contract_patch_001.md` |

If a numbered file conflicts with one of these detailed source files, stop and resolve the conflict before implementation.

---

## Database Migration Order

Apply schema files in this exact order:

```text
1. docs/marketing_os_v5_6_5_phase_0_1_schema.sql
2. docs/marketing_os_v5_6_5_phase_0_1_schema_patch_001.sql
```

The wrapper file is:

```text
docs/07_database_schema.sql
```

Do not silently edit historical SQL to change business rules. Use a new numbered patch file for future corrections.

---

## Clickable Prototype

A static clickable UI prototype exists here:

```text
prototype/index.html
```

Open it directly in a browser.

The prototype demonstrates:

- Workspace context
- Role-based navigation
- Permission-protected screens
- Campaign and brief flow
- Media job flow
- Asset version immutability
- Review and approval flow
- Manual publish evidence flow
- Report snapshots
- Usage/cost separation
- Audit visibility
- Safe mode/onboarding

The prototype is a UX reference only. It is not production application code.

---

## Phase 0/1 Forbidden Scope

Do not implement the following in Phase 0/1:

```text
Auto-publishing
Paid execution
AI agents
Advanced attribution
BillingProvider
ProviderUsageLog
External workflow automation as source of truth
```

Any attempt to introduce these into backend, frontend, API, DB, or UI prototype must be treated as scope drift.

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
```

---

## Codex Sprint 0 Start Command

Use this prompt when starting implementation:

```text
Inspect repository henter36/marketing-os and implement Sprint 0 only.

Before writing code:
1. Read README.md.
2. Read docs/00_project_instructions.md through docs/17_change_log.md.
3. Read the authoritative Phase 0/1 source files.
4. Report current repository structure.
5. Confirm whether a backend framework already exists.
6. Identify package manager.
7. Propose minimal Sprint 0 implementation plan.

Then implement only Sprint 0:
- application baseline
- database migration wiring
- environment configuration
- AuthGuard baseline
- WorkspaceContextGuard
- MembershipCheck
- PermissionGuard
- unified ErrorModel
- RBAC seed data
- Sprint 0 endpoints from OpenAPI
- tests for migration, tenant isolation, RBAC, ErrorModel, ApprovalDecision trigger, ManualPublishEvidence protection

Do not implement Sprint 1+.
Do not add deferred features.
Do not create unapproved entities.
Do not trust workspace_id from body.
```

---

## Required Quality Gates

After Sprint 0 implementation, the repository must support equivalent commands:

```bash
npm run db:migrate
npm run db:seed
npm run openapi:lint
npm test
npm run test:integration
npm run verify
```

If another package manager is used, adapt the commands but preserve the gates.

Sprint 1 is blocked until Sprint 0 gates pass.

---

## Current Decision

```text
GO: Codex Sprint 0 after owner approval.
NO-GO: Sprint 1 until Sprint 0 tests pass.
NO-GO: Pilot until all P0 QA tests pass.
```
