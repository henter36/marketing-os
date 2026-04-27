# Marketing OS V5.6.5 — Codex Implementation Prompt & Repository Execution Instructions

> **Document type:** Codex execution instructions / implementation guardrails  
> **Scope:** Phase 0/1 only  
> **Repository:** `henter36/marketing-os`  
> **Status:** Binding Sprint 0 execution instruction after owner approval  
> **Last hardening update:** Patch 001 is mandatory and binding

---

## 1. Executive Instruction

Codex must implement **Marketing OS Phase 0/1 only**.

Codex must not infer product scope, add features, rename entities, introduce new domains, or implement deferred functionality.

Codex must treat this repository as a **contract-first execution package**, not as a free-form product brief.

If any approved files conflict, Codex must stop and report the conflict instead of guessing.

---

## 2. Mandatory Approved Sources

Codex must read and obey these files before writing code:

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
docs/09_screen_map.md
docs/10_user_flows.md
docs/11_sprint_plan.md
docs/12_qa_test_plan.md
docs/13_risk_register.md
docs/14_implementation_notes.md
docs/15_integration_plan.md
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

docs/ui_screen_inventory.md
docs/ui_user_flows.md
docs/ui_permission_matrix.md
docs/ui_api_mapping.md
docs/ui_codex_prompt.md
```

Patch 001 is not optional. It supersedes conflicting behavior in the original SQL/OpenAPI/Backlog/QA/Codex wording.

---

## 3. Mandatory SQL Migration Order

Codex must apply SQL in this exact order:

```text
1. docs/marketing_os_v5_6_5_phase_0_1_schema.sql
2. docs/marketing_os_v5_6_5_phase_0_1_schema_patch_001.sql
```

`docs/07_database_schema.sql` is a wrapper/index file. If the selected migration runner does not support `\i`, Codex must configure the migration runner to execute the two SQL files directly in the order above.

Codex must not silently merge, rewrite, or weaken Patch 001.

---

## 4. Patch 001 Binding Corrections

Patch 001 resolves two blocking contract conflicts:

### 4.1 ApprovalDecision / MediaAssetVersion

Correct behavior:

```text
1. ApprovalDecision must validate ReviewTask ↔ MediaAssetVersion match.
2. If decision=approved, approved_content_hash is required.
3. approved_content_hash must equal MediaAssetVersion.content_hash.
4. After valid approved decision insert, DB trigger sets MediaAssetVersion.version_status=approved.
5. The version does not need to be approved before the decision.
```

### 4.2 ManualPublishEvidence invalidate

Correct behavior:

```text
1. ManualPublishEvidence proof fields remain immutable.
2. DELETE remains forbidden.
3. PATCH endpoint remains forbidden.
4. Invalidate is allowed only as a limited state update.
5. Allowed fields for invalidation: evidence_status and invalidated_reason.
6. Supersede creates a new row; it does not mutate proof fields.
```

---

## 5. Non-Negotiable Rules

```text
1. Section 52 relationship contract is the only relationship authority.
2. Do not create tables named GenerationJob, Asset, or Approval.
3. Use MediaJob, MediaAsset, MediaAssetVersion, and ApprovalDecision.
4. Do not implement auto-publishing in Phase 0/1.
5. Do not implement paid execution in Phase 0/1.
6. Do not implement advanced attribution in Phase 0/1.
7. Do not implement AI Agents in Phase 0/1.
8. Do not implement BillingProvider or ProviderUsageLog unless a new approved contract adds them.
9. Do not trust workspace_id from request body.
10. Every workspace-scoped query must include workspace context.
11. ManualPublishEvidence proof fields must remain protected.
12. Approved MediaAssetVersion must not be patched.
13. PublishJob must require approved ApprovalDecision and matching content_hash.
14. UsageMeter must not record usage unless usable_output_confirmed=true.
15. CostEvent must not create customer billing.
16. AuditLog must be append-only.
17. Frontend must not invent endpoints outside OpenAPI.
18. Any missing requirement must be reported as a gap, not implemented by assumption.
```

---

## 6. Required Implementation Order

Codex must implement in this order:

```text
1. Repository structure and dependency baseline
2. Database migration using approved SQL + Patch 001
3. Environment configuration
4. AuthGuard placeholder/baseline
5. WorkspaceContextGuard
6. MembershipCheck
7. PermissionGuard
8. Unified ErrorModel
9. RBAC seed data
10. Sprint 0 API endpoints only
11. Sprint 0 tests
12. OpenAPI validation
13. Final Sprint 0 implementation report
```

Do not skip foundational guardrails to implement business endpoints earlier.

---

## 7. Recommended Stack Boundary

Unless the repository already defines a different stack, Codex may use:

```text
Backend: Node.js / NestJS or equivalent TypeScript API framework
Database: PostgreSQL
Validation: Zod or class-validator
OpenAPI: generated/maintained from docs OpenAPI contract
Testing: Jest + Supertest
DB tests: Jest integration or pgTAP
Linting: ESLint
Formatting: Prettier
```

If the repository already has a framework, Codex must follow the existing structure and not replace it.

---

## 8. Sprint 0 Implementation Prompt

```text
You are implementing Marketing OS V5.6.5 Phase 0/1 in repository henter36/marketing-os.

Task: Implement Sprint 0 only.

Before writing code:
1. Read README.md.
2. Read docs/00_project_instructions.md through docs/20_sprint_0_report_template.md.
3. Read all mandatory approved sources listed in Codex instructions.
4. Report the current repository structure.
5. Confirm whether a backend framework exists.
6. Identify package manager.
7. Propose the minimal Sprint 0 implementation plan.

Sprint 0 includes:
- application baseline
- database migration wiring for schema.sql + schema_patch_001.sql
- environment configuration
- unified ErrorModel
- AuthGuard baseline
- WorkspaceContextGuard
- MembershipCheck
- PermissionGuard
- RBAC seed data
- basic workspace/member/roles/permissions endpoints required by OpenAPI
- tests for migration, tenant isolation, RBAC, ErrorModel, ApprovalDecision trigger, ManualPublishEvidence protection

Hard rules:
- Do not implement Sprint 1+ features.
- Do not add new product domains.
- Do not trust workspace_id from request body.
- Do not bypass workspace membership checks.
- Do not rename approved entities.
- Do not create GenerationJob, Asset, or Approval entities.
- Do not implement auto-publishing, paid execution, AI agents, or advanced attribution.

Output required:
- code changes
- migration wiring
- seed wiring
- test coverage
- README/local run instructions
- Sprint 0 implementation report using docs/20_sprint_0_report_template.md
```

---

## 9. Sprint 1+ Rule

Codex must not implement Sprint 1, Sprint 2, Sprint 3, or Sprint 4 until Sprint 0 has:

```text
1. working application baseline
2. successful database migration
3. passing tenant isolation tests
4. passing RBAC tests
5. passing ErrorModel tests
6. OpenAPI validation
7. Sprint 0 report completed
8. explicit readiness decision for Sprint 1
```

---

## 10. Backend Modules Allowed Later by Sprint

Approved module families:

```text
identity
workspaces
rbac
subscriptions
brand
templates
campaigns
briefs
media-jobs
media-assets
review
approval
publish
reports
usage
cost
audit
operations
```

Forbidden modules in Phase 0/1:

```text
agents
paid-execution
auto-publishing
advanced-attribution
billing-provider
provider-usage-log
```

---

## 11. Guards

All workspace-scoped endpoints must use:

```text
AuthGuard
WorkspaceContextGuard
MembershipCheck
PermissionGuard
```

Expected behavior:

```text
AuthGuard validates authenticated user.
WorkspaceContextGuard extracts workspaceId from route/context only.
MembershipCheck verifies user membership in workspace.
PermissionGuard checks required permission declared by endpoint metadata.
```

---

## 12. Error Model

Every error must return:

```json
{
  "code": "string",
  "message": "string",
  "user_action": "string",
  "correlation_id": "string"
}
```

Common error codes:

```text
AUTH_REQUIRED
WORKSPACE_ACCESS_DENIED
TENANT_CONTEXT_MISSING
TENANT_CONTEXT_MISMATCH
PERMISSION_DENIED
VALIDATION_FAILED
NOT_FOUND
CONFLICT
IDEMPOTENCY_KEY_REQUIRED
IDEMPOTENCY_CONFLICT
APPROVAL_HASH_REQUIRED
APPROVAL_HASH_MISMATCH
APPROVAL_NOT_APPROVED
ASSET_VERSION_MISMATCH
USAGE_OUTPUT_NOT_CONFIRMED
EVIDENCE_HASH_MISMATCH
EVIDENCE_APPEND_ONLY
IMMUTABLE_FIELD_UPDATE
SAFE_MODE_ACTIVE
```

---

## 13. Sprint 0 Required Commands

Codex must add or document commands equivalent to:

```bash
npm install
npm run db:migrate
npm run db:seed
npm run openapi:lint
npm test
npm run test:integration
npm run verify
```

If the repository uses pnpm/yarn, Codex must adapt commands to the selected package manager.

---

## 14. Final Execution Gate

```text
GO: Codex Sprint 0 after owner approval.
NO-GO: Sprint 1 until Sprint 0 tests pass.
NO-GO: Pilot until all P0 QA tests pass.
```

Codex must not hide failed tests or unresolved gaps.
