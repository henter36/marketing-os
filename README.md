# Marketing OS

Marketing OS is a Phase 0/1 execution repository for a governed AI-assisted marketing operating system.

This repository remains a contract-first implementation package. It contains a verified backend baseline through Sprint 4 with limited Patch 002 runtime baseline and strict migration activation, but it is not approved for Pilot or Production.

## Verified Status

```text
Sprint 0: Passed
Sprint 1: Passed
Sprint 2: Passed
Sprint 3: Passed
Sprint 4: Passed
Repository cleanup after Sprint 4: Passed
Patch 002 runtime baseline: Passed as in-memory runtime
Patch 002 SQL migration activation: Passed for strict migration order
Migration retry verification: Passed under CI
InPactAI fit-gap study: Merged as documentation only
DB-backed Repository Architecture Contract: Passed
DB-backed Repository Slice 0 Plan: Passed
Latest verified main commit: 4ae6af2
GitHub Actions strict verification: Passed on main
DB-backed full persistence: NO-GO
Sprint 5 coding: NO-GO
Pilot: NO-GO
Production: NO-GO
```

The latest verified main commit is `4ae6af2e888c207aa0acfff2406c37ce116f3da4`.

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
  patch_002_runtime_implementation_report.md
  patch_002_activation_report.md
  migration_retry_verification_report.md
  db_backed_repository_architecture_contract.md
  db_backed_repository_slice_0_plan.md
  inpactai_*.md
  marketing_os_v5_6_5_phase_0_1_*.md/sql/yaml
  marketing_os_v5_6_5_codex_implementation_instructions.md
  ui_*.md

prototype/
  Static clickable prototype reference.

scripts/
  Migration, seed, OpenAPI lint, and verification scripts.

src/
  Current Sprint 4 plus Patch 002 in-memory backend entrypoints and supporting guards, error model, config, server, router, and store layers.

test/
  Node test suites for migrations, tenant isolation, RBAC, ErrorModel, Sprint 1-4 behavior, Patch 002 runtime behavior, OpenAPI alignment, and regression checks.

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

These are the current Sprint 4 plus Patch 002 in-memory runtime entrypoints.

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

No DB-backed runtime repository layer exists yet. The current runtime still uses the in-memory store.

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
docs/inpactai_feature_extraction_and_marketing_os_fit_gap.md
docs/inpactai_near_term_feature_candidates.md
docs/db_backed_repository_architecture_contract.md
docs/db_backed_repository_slice_0_plan.md
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
| Codex instructions | `docs/marketing_os_v5_6_5_codex_implementation_instructions.md` |
| Contract patch 001 | `docs/marketing_os_v5_6_5_phase_0_1_contract_patch_001.md` |
| DB-backed architecture contract | `docs/db_backed_repository_architecture_contract.md` |
| DB-backed Slice 0 plan | `docs/db_backed_repository_slice_0_plan.md` |

If a numbered file conflicts with one of these source files, stop and resolve the conflict before implementation.

## Database Migration Order

The active strict migration order is:

```text
1. docs/marketing_os_v5_6_5_phase_0_1_schema.sql
2. docs/marketing_os_v5_6_5_phase_0_1_schema_patch_001.sql
3. docs/marketing_os_v5_6_5_phase_0_1_schema_patch_002.sql
```

Patch 002 is active in strict migration order only. Migration retry verification is included in GitHub Actions and runs the strict migration sequence twice against the same database.

This does not imply DB-backed runtime persistence, Pilot readiness, or Production readiness.

## Patch 002 Status

Patch 002 runtime baseline is present on main for the limited connector, performance, contact, consent, lead capture, notification rule, and notification delivery baseline. It uses the existing in-memory runtime/store pattern.

Patch 002 SQL migration is included in strict migration order after the base schema and Patch 001. Migration retry verification passed under CI.

Patch 002 does not mean:

```text
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
DB-backed runtime persistence.
```

Patch 002 competitive expansion remains NO-GO and must be handled as a separate future expansion track, preferably Patch 003 or a separately named competitive expansion track.

## DB-backed Repository Status

```text
DB-backed Repository Architecture Contract: Passed
DB-backed Repository Slice 0 Plan: Passed
DB-backed full persistence: NO-GO
DB-backed Slice 0 implementation: CONDITIONAL GO only after status reconciliation, limited to Workspace/Membership/RBAC read path
```

The first allowed DB-backed implementation track is Workspace/Membership/RBAC read path only. Campaign, Brief, Brand, Media, Approval, Publish, Evidence, Report, Patch 002, and write-path persistence remain out of scope for Slice 0.

## InPactAI Status

The InPactAI fit-gap study and near-term candidates are documentation only. They do not approve InPactAI implementation, Creator Marketplace implementation, ERD changes, SQL changes, OpenAPI changes, QA changes, runtime changes, or direct code adoption.

## Next Allowed Steps

```text
DB-backed Repository Slice 0 implementation planning/implementation may proceed after this reconciliation, limited to Workspace/Membership/RBAC read path.
DB-backed full persistence remains NO-GO.
Sprint 5 planning remains deferred until the DB-backed persistence path is reviewed.
```

## Forbidden Next Steps

```text
No Sprint 5 coding.
No Pilot.
No Production.
No frontend.
No auto-publishing.
No paid execution.
No AI agents.
No advanced attribution.
No BillingProvider.
No ProviderUsageLog.
No Creator Marketplace implementation.
No InPactAI implementation.
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
