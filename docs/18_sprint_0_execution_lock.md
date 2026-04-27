# 18 — Sprint 0 Execution Lock

## Executive Decision

Sprint 0 is approved for foundation implementation only.

This file locks the execution boundary so Codex or any developer cannot expand scope before the technical baseline is proven.

## Sprint 0 Goal

Create a runnable technical baseline that proves:

```text
- application structure
- database migration wiring
- Patch 001 applied
- tenant isolation
- RBAC
- ErrorModel
- OpenAPI validation
- foundational tests
```

Sprint 0 is not a product feature sprint.

## Mandatory Files to Read First

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
docs/11_sprint_plan.md
docs/12_qa_test_plan.md
docs/13_risk_register.md
docs/14_implementation_notes.md
docs/16_traceability_matrix.md
docs/17_change_log.md
docs/18_sprint_0_execution_lock.md
docs/19_implementation_readiness_checklist.md
docs/20_sprint_0_report_template.md

docs/marketing_os_v5_6_5_phase_0_1_erd.md
docs/marketing_os_v5_6_5_phase_0_1_schema.sql
docs/marketing_os_v5_6_5_phase_0_1_schema_patch_001.sql
docs/marketing_os_v5_6_5_phase_0_1_openapi.yaml
docs/marketing_os_v5_6_5_phase_0_1_backlog.md
docs/marketing_os_v5_6_5_phase_0_1_qa_test_suite.md
docs/marketing_os_v5_6_5_phase_0_1_contract_patch_001.md
docs/marketing_os_v5_6_5_codex_implementation_instructions.md
```

## Allowed Sprint 0 Work

Codex may implement only:

```text
1. Repository/application baseline
2. Package manager setup
3. TypeScript/NestJS or equivalent backend structure
4. PostgreSQL connection configuration
5. Migration runner
6. SQL migration order:
   - schema.sql
   - schema_patch_001.sql
7. Environment variable template
8. AuthGuard baseline
9. WorkspaceContextGuard
10. MembershipCheck
11. PermissionGuard
12. Unified ErrorModel
13. RBAC seed data
14. Basic workspace/member/roles/permissions endpoints from OpenAPI
15. Health/readiness endpoints
16. Tests for migration, tenant isolation, RBAC, ErrorModel, Patch 001 behavior
17. Local run instructions
18. Sprint 0 implementation report
```

## Forbidden Sprint 0 Work

Codex must not implement:

```text
Sprint 1 business features
BrandProfile workflows
Campaign management beyond baseline if not required by Sprint 0
BriefVersion workflows
MediaJob execution
MediaAsset workflows
ReviewTask workflows
ApprovalDecision API beyond tests required for Patch 001 validation
PublishJob workflows
ManualPublishEvidence API beyond tests required for Patch 001 validation
ClientReportSnapshot workflows
UsageMeter commercial logic beyond guardrail tests
CostEvent business workflows beyond guardrail tests
Frontend application shell
Auto-publishing
Paid execution
AI agents
Advanced attribution
BillingProvider
ProviderUsageLog
```

## Required Tests Before Sprint 0 Completion

```text
- database migration runs successfully
- schema_patch_001 runs successfully after base schema
- tenant context required for workspace-scoped access
- cross-workspace access is blocked
- RBAC permission denied returns ErrorModel
- workspace_id in body is ignored or rejected as trusted context
- ApprovalDecision approved hash mismatch fails
- valid ApprovalDecision marks MediaAssetVersion approved through trigger
- ManualPublishEvidence proof-field update fails
- ManualPublishEvidence delete fails
- ManualPublishEvidence invalidation allows only evidence_status and invalidated_reason
- OpenAPI lint or equivalent validation runs
```

## Required Commands

The implementation must provide equivalent commands:

```bash
npm run db:migrate
npm run db:seed
npm run openapi:lint
npm test
npm run test:integration
npm run verify
```

If using pnpm or yarn, adapt names but keep the same quality gates.

## Stop Conditions

Codex must stop and report if:

```text
- SQL migration cannot run without changing business rules
- Patch 001 conflicts with base SQL in a way that cannot be resolved mechanically
- OpenAPI endpoint required for Sprint 0 is missing
- Tenant context rules are unclear
- RBAC seed requirements are incomplete
- A test fails and cannot be fixed without contract change
- Implementation requires forbidden Phase 0/1 scope
```

## Sprint 0 Exit Criteria

Sprint 0 is complete only when:

```text
1. application baseline exists
2. migration command exists
3. seed command exists
4. OpenAPI validation command exists
5. test commands exist
6. migration passes
7. Patch 001 behavior is tested
8. tenant isolation tests pass
9. RBAC tests pass
10. ErrorModel tests pass
11. Sprint 0 report is completed using docs/20_sprint_0_report_template.md
12. readiness decision for Sprint 1 is explicit
```

## Final Rule

No Sprint 1 work is allowed until Sprint 0 report states:

```text
GO to Sprint 1
```

with evidence of passing gates.
