# Marketing OS

Marketing OS is a Phase 0/1 execution repository for a governed AI-assisted marketing operating system.

This repository remains a contract-first implementation package. It now contains a verified backend baseline through Sprint 4, but it is not approved for Pilot or Production.

## Verified Status

```text
Sprint 0: Passed
Sprint 1: Passed
Sprint 2: Passed
Sprint 3: Passed
Sprint 4: Passed
Repository cleanup after Sprint 4: Passed
Latest verified main commit: 8e7e4b1
GitHub Actions strict verification: Passed on main
Pilot: NO-GO
Production: NO-GO
```

The latest verified main commit is `8e7e4b1dfc9c25ee2517b163a5f1762dffcea7e7`.

## Current Repository Structure

```text
.github/workflows/
  sprint0-verify.yml

docs/
  00_project_instructions.md through 20_sprint_0_report_template.md
  sprint_0_implementation_report.md
  sprint_1_implementation_report.md
  sprint_2_implementation_report.md
  sprint_3_implementation_report.md
  sprint_4_implementation_report.md
  repository_cleanup_after_sprint_4.md
  marketing_os_v5_6_5_phase_0_1_*.md/sql/yaml
  marketing_os_v5_6_5_codex_implementation_instructions.md
  ui_*.md

prototype/
  Static clickable prototype reference.

scripts/
  Migration, seed, OpenAPI lint, and verification scripts.

src/
  Sprint 4 backend entrypoints and supporting guards, error model, config, server, router, and store layers.

test/
  Node test suites for migrations, tenant isolation, RBAC, ErrorModel, Sprint 1-4 behavior, OpenAPI alignment, and regression checks.

root files
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

These are the current Sprint 4 entrypoints.

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

Completed implementation evidence lives in:

```text
docs/sprint_0_implementation_report.md
docs/sprint_1_implementation_report.md
docs/sprint_2_implementation_report.md
docs/sprint_3_implementation_report.md
docs/sprint_4_implementation_report.md
docs/repository_cleanup_after_sprint_4.md
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
| API contract | `docs/marketing_os_v5_6_5_phase_0_1_openapi.yaml` |
| Backlog | `docs/marketing_os_v5_6_5_phase_0_1_backlog.md` |
| QA suite | `docs/marketing_os_v5_6_5_phase_0_1_qa_test_suite.md` |
| Codex instructions | `docs/marketing_os_v5_6_5_codex_implementation_instructions.md` |
| Contract patch 001 | `docs/marketing_os_v5_6_5_phase_0_1_contract_patch_001.md` |

If a numbered file conflicts with one of these source files, stop and resolve the conflict before implementation.

## Database Migration Order

The active migration order remains:

```text
1. docs/marketing_os_v5_6_5_phase_0_1_schema.sql
2. docs/marketing_os_v5_6_5_phase_0_1_schema_patch_001.sql
```

Do not add Patch 002 to the migration order until Patch 002 reconciliation is complete.

## Patch 002 Status

Patch 002 files exist in the repository:

```text
docs/marketing_os_v5_6_5_phase_0_1_competitive_patch_002.md
docs/marketing_os_v5_6_5_phase_0_1_contract_patch_002_competitive_features.md
docs/marketing_os_v5_6_5_phase_0_1_schema_patch_002.sql
docs/marketing_os_v5_6_5_phase_0_1_openapi_patch_002.yaml
```

Patch 002 is not fully activated and must not be treated as implemented. It requires contract naming reconciliation, QA coverage reconciliation, and migration idempotency review before activation.

Current Patch 002 reconciliation notes live in:

```text
docs/patch_002_reconciliation_notes.md
```

## Next Allowed Steps

```text
Patch 002 reconciliation only.
Sprint 5 planning only after documentation reconciliation.
Optional second cleanup for root router.js/store.js only as a separate branch.
```

## Forbidden Next Steps

```text
No Sprint 5 coding without an approved plan.
No Patch 002 implementation until reconciled.
No Pilot.
No Production.
No frontend.
No auto-publishing.
No paid execution.
No AI agents.
No advanced attribution.
No BillingProvider.
No ProviderUsageLog.
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
