# Marketing OS V5.6.5 — Codex Implementation Prompt & Repository Execution Instructions

> **Document type:** Codex execution instructions / implementation guardrails  
> **Scope:** Phase 0/1 only  
> **Source authority:** Approved ERD, SQL DDL, OpenAPI, Sprint Backlog, and QA Test Suite only  
> **Repository:** `henter36/marketing-os`  
> **Status:** Ready to guide Sprint 0 implementation after owner approval

---

## 1. Executive Instruction

Codex must implement **Marketing OS Phase 0/1 only**.

Codex must not infer product scope, add features, rename entities, introduce new domains, or implement deferred functionality.

The only approved sources are:

```text
docs/marketing_os_v5_6_5_phase_0_1_erd.md
docs/marketing_os_v5_6_5_phase_0_1_schema.sql
docs/marketing_os_v5_6_5_phase_0_1_openapi.yaml
docs/marketing_os_v5_6_5_phase_0_1_backlog.md
docs/marketing_os_v5_6_5_phase_0_1_qa_test_suite.md
```

If these files conflict, Codex must stop and report the conflict instead of guessing.

---

## 2. Non-Negotiable Rules

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
11. ManualPublishEvidence must be append-only.
12. Approved MediaAssetVersion must not be patched.
13. PublishJob must require approved ApprovalDecision and matching content_hash.
14. UsageMeter must not record usage unless usable_output_confirmed=true.
15. CostEvent must not create customer billing.
16. AuditLog must be append-only.
17. Frontend must not invent endpoints outside OpenAPI.
18. Any missing requirement must be reported as a gap, not implemented by assumption.
```

---

## 3. Required Implementation Order

Codex must implement in this order:

```text
1. Repository structure and dependency baseline
2. Database migration using approved SQL DDL
3. Environment configuration
4. AuthGuard placeholder/baseline
5. WorkspaceContextGuard
6. MembershipCheck
7. PermissionGuard
8. Unified ErrorModel
9. RBAC seed data
10. Sprint 0 API endpoints
11. Sprint 1 API endpoints
12. Sprint 2 API endpoints
13. Sprint 3 API endpoints
14. Sprint 4 API endpoints
15. QA tests from QA Test Suite
16. OpenAPI validation
17. Final implementation report
```

Do not skip foundational guardrails to implement business endpoints earlier.

---

## 4. Recommended Stack Boundary

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

## 5. Repository Files Codex Must Read First

Before writing code, Codex must inspect:

```text
README.md
package.json
pnpm-lock.yaml / package-lock.json / yarn.lock if present
tsconfig.json if present
src/ if present
docs/marketing_os_v5_6_5_phase_0_1_erd.md
docs/marketing_os_v5_6_5_phase_0_1_schema.sql
docs/marketing_os_v5_6_5_phase_0_1_openapi.yaml
docs/marketing_os_v5_6_5_phase_0_1_backlog.md
docs/marketing_os_v5_6_5_phase_0_1_qa_test_suite.md
```

Codex must summarize discovered structure before major implementation.

---

## 6. Sprint 0 Implementation Prompt

Use this prompt for Codex Sprint 0:

```text
You are implementing Marketing OS V5.6.5 Phase 0/1 in repository henter36/marketing-os.

Approved sources only:
- docs/marketing_os_v5_6_5_phase_0_1_erd.md
- docs/marketing_os_v5_6_5_phase_0_1_schema.sql
- docs/marketing_os_v5_6_5_phase_0_1_openapi.yaml
- docs/marketing_os_v5_6_5_phase_0_1_backlog.md
- docs/marketing_os_v5_6_5_phase_0_1_qa_test_suite.md

Task: Implement Sprint 0 only.

Sprint 0 includes:
- database migration baseline from the approved SQL file
- environment configuration
- unified ErrorModel
- AuthGuard baseline
- WorkspaceContextGuard
- MembershipCheck
- PermissionGuard
- RBAC seed data
- basic workspace/member/roles/permissions endpoints required by OpenAPI
- tests for tenant isolation, RBAC, ErrorModel, and migration constraints

Hard rules:
- Do not implement Sprint 1+ features.
- Do not add new product domains.
- Do not trust workspace_id from request body.
- Do not bypass workspace membership checks.
- Do not rename approved entities.
- Do not create GenerationJob, Asset, or Approval entities.

Output required:
- code changes
- migration wiring
- seed wiring
- test coverage
- clear README instructions to run locally
- implementation report listing completed stories and unresolved gaps
```

---

## 7. Sprint 1 Implementation Prompt

```text
Implement Sprint 1 only after Sprint 0 tests pass.

Sprint 1 includes:
- workspace and member management completion
- BrandProfile endpoints
- BrandVoiceRule endpoints
- PromptTemplate endpoints
- ReportTemplate endpoints
- Campaign endpoints
- CampaignStateTransition endpoints
- BriefVersion endpoints

Use only approved OpenAPI paths and schemas.

Hard rules:
- BriefVersion content must not be patched.
- content_hash must be generated server-side.
- Campaign state changes must create CampaignStateTransition.
- Every sensitive write must create AuditLog.
- Cross-workspace access must fail.

Required tests:
- QA-TI-001
- QA-TI-003
- QA-RBAC-001
- S1 campaign and brief QA cases
- ErrorModel consistency
```

---

## 8. Sprint 2 Implementation Prompt

```text
Implement Sprint 2 only after Sprint 1 tests pass.

Sprint 2 includes:
- CostBudget endpoints
- CostGuardrail endpoints
- MediaCostPolicy handling if needed by MediaJob creation
- MediaJob create/list/get/status endpoints
- MediaCostSnapshot enforcement
- MediaAsset endpoints
- MediaAssetVersion endpoints
- UsageMeter endpoints
- UsageQuotaState read endpoint
- CostEvent endpoints

Hard rules:
- MediaJob cannot run or succeed without approved MediaCostSnapshot.
- Idempotency-Key is required for MediaJob creation.
- Asset versions are immutable once approved.
- UsageMeter requires usable_output_confirmed=true.
- Failed provider job does not create commercial usage.
- CostEvent does not create customer billing.

Required tests:
- QA-USG-001
- QA-USG-002
- QA-USG-003
- QA-IDM-001
- QA-IDM-002
- QA-DB-001
- QA-DB-002
```

---

## 9. Sprint 3 Implementation Prompt

```text
Implement Sprint 3 only after Sprint 2 tests pass.

Sprint 3 includes:
- ReviewTask endpoints
- ApprovalDecision endpoint
- PublishJob endpoint
- ManualPublishEvidence endpoints
- Supersede evidence endpoint
- Invalidate evidence endpoint
- TrackedLink endpoints

Hard rules:
- ApprovalDecision must be append-only.
- approved_content_hash must match MediaAssetVersion.content_hash.
- PublishJob requires approved ApprovalDecision.
- PublishJob media_asset_version_id must match ApprovalDecision.media_asset_version_id.
- ManualPublishEvidence must not expose PATCH or DELETE.
- ManualPublishEvidence content_hash must match MediaAssetVersion.content_hash.
- Supersede creates a new row; invalidate does not delete.
- Do not implement social auto-publishing.

Required tests:
- QA-APP-001
- QA-APP-002
- QA-APP-003
- QA-APP-004
- QA-EVD-001
- QA-EVD-002
- QA-EVD-003
- QA-EVD-004
- QA-EVD-005
- QA-IDM-003
```

---

## 10. Sprint 4 Implementation Prompt

```text
Implement Sprint 4 only after Sprint 3 tests pass.

Sprint 4 includes:
- ClientReportSnapshot endpoints
- AuditLog read endpoint
- SafeMode endpoints
- OnboardingProgress endpoint
- Pilot Gate checks
- OpenAPI validation
- final QA suite execution

Hard rules:
- ClientReportSnapshot must freeze report_snapshot_payload and evidence_snapshot_payload.
- Later evidence supersede/invalidate must not mutate old reports.
- AuditLog must be append-only.
- SafeMode changes must be permission-gated and audited.
- Pilot Gate must fail if any P0 test fails.

Required tests:
- QA-RPT-001
- QA-RPT-002
- QA-RPT-003
- QA-AUD-001
- QA-AUD-002
- QA-OPS-001
- QA-OPS-002
- QA-OAS-001
- QA-OAS-002
- QA-OAS-003
```

---

## 11. Implementation Architecture Requirements

### 11.1 Backend Modules

Codex should create modules aligned with the approved domains:

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

Do not create modules for:

```text
agents
paid-execution
auto-publishing
advanced-attribution
billing-provider
provider-usage-log
```

---

### 11.2 Guards

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

### 11.3 Error Model

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

### 11.4 Idempotency

Codex must implement idempotency for:

```text
POST /workspaces/{workspaceId}/campaigns/{campaignId}/media-jobs
POST /workspaces/{workspaceId}/approval-decisions/{approvalDecisionId}/publish-jobs
POST /workspaces/{workspaceId}/usage-meter
```

Rules:

```text
1. Idempotency-Key is required.
2. Key is scoped by workspace_id.
3. Same key + same payload returns same/safe result.
4. Same key + different payload returns IDEMPOTENCY_CONFLICT.
5. Operation must not double-create records.
```

---

### 11.5 Audit

Every sensitive write must create AuditLog.

Required events:

```text
workspace.created
member.invited
member.role_changed
campaign.created
campaign.status_changed
brief.version_created
media_job.created
media_job.completed
media_job.failed
media_asset.version_created
review_task.created
approval_decision.created
publish_job.created
manual_publish_evidence.submitted
manual_publish_evidence.superseded
manual_publish_evidence.invalidated
usage_meter.recorded
cost_event.recorded
client_report_snapshot.generated
safe_mode.activated
safe_mode.deactivated
```

AuditLog must not be used as business state.

---

## 12. Database Implementation Requirements

Codex must wire the approved SQL file as a migration or baseline schema.

Approved SQL file:

```text
docs/marketing_os_v5_6_5_phase_0_1_schema.sql
```

Required DB behavior:

```text
1. RLS enabled for workspace-scoped tables.
2. app.current_workspace_id must be set by request context.
3. ManualPublishEvidence rejects UPDATE and DELETE.
4. AuditLog rejects UPDATE and DELETE.
5. UsageMeter rejects UPDATE and DELETE.
6. CostEvent rejects UPDATE and DELETE.
7. ApprovalDecision rejects UPDATE and DELETE.
8. Approved MediaAssetVersion rejects updates.
9. MediaJob cannot run/succeed without approved MediaCostSnapshot.
10. PublishJob cannot be created without approved decision and matching hash.
```

If the SQL file fails to run, Codex must fix only syntax/integration issues without changing business rules.

Any change to rules must be reported for approval.

---

## 13. API Implementation Requirements

Approved OpenAPI file:

```text
docs/marketing_os_v5_6_5_phase_0_1_openapi.yaml
```

Codex must not create endpoints outside this OpenAPI contract unless explicitly marked as internal health/dev-only.

Allowed internal endpoints:

```text
GET /health
GET /ready
```

These must not expose tenant data.

---

## 14. Test Implementation Requirements

Approved QA source:

```text
docs/marketing_os_v5_6_5_phase_0_1_qa_test_suite.md
```

Codex must implement tests in this order:

```text
1. OpenAPI validation tests
2. DB migration and trigger tests
3. Tenant isolation tests
4. RBAC tests
5. ErrorModel tests
6. Idempotency tests
7. Approval integrity tests
8. Evidence immutability tests
9. Usage/cost tests
10. Report snapshot tests
11. Pilot Gate checklist test/report
```

P0 tests must be automated or explicitly documented with manual evidence before Pilot.

---

## 15. Commands Codex Should Provide

Codex must add or document commands equivalent to:

```bash
# install dependencies
npm install

# run database migration
npm run db:migrate

# seed roles and permissions
npm run db:seed

# validate OpenAPI
npm run openapi:lint

# run unit tests
npm test

# run integration tests
npm run test:integration

# run all quality gates
npm run verify
```

If the repository uses pnpm/yarn, Codex must adapt commands to the repository package manager.

---

## 16. Required Output After Each Sprint

After each sprint implementation, Codex must produce an implementation report:

```text
1. Sprint implemented
2. Stories completed
3. Files changed
4. Endpoints implemented
5. Database migrations added/changed
6. Tests added
7. Tests passing/failing
8. Open gaps
9. Deviations from approved contracts
10. Next recommended step
```

Codex must not hide failed tests.

---

## 17. Forbidden Implementation Patterns

Codex must not do the following:

```text
1. Add workspace_id to request body as trusted input.
2. Query records by entity ID alone.
3. Implement generic CRUD for sensitive entities without business rules.
4. Patch approved MediaAssetVersion content.
5. Patch or delete ManualPublishEvidence.
6. Update AuditLog rows.
7. Count commercial usage on failed/empty/malformed output.
8. Treat CostEvent as invoice or billing source.
9. Add auto-publishing connectors.
10. Add paid execution workflows.
11. Add advanced attribution tables.
12. Add AI Agent modules.
13. Rename approved entities.
14. Ignore OpenAPI error model.
15. Skip tests for P0 paths.
```

---

## 18. First Codex Task to Run

Use this as the first Codex task:

```text
Inspect the repository henter36/marketing-os and implement Sprint 0 only.

Before writing code:
1. Read README/package files and existing structure.
2. Read all approved docs in docs/.
3. Report the current repository structure.
4. Identify whether a backend framework already exists.
5. Identify the package manager.
6. Propose the minimal Sprint 0 implementation plan.

Then implement only Sprint 0:
- database migration wiring for docs/marketing_os_v5_6_5_phase_0_1_schema.sql
- environment configuration
- unified ErrorModel
- AuthGuard baseline
- WorkspaceContextGuard
- MembershipCheck
- PermissionGuard
- RBAC seed data
- roles/permissions/workspaces/members baseline endpoints from OpenAPI
- tests for migration, tenant isolation, RBAC, and ErrorModel

Do not implement Sprint 1+.
Do not add deferred features.
Do not create unapproved entities.
Do not trust workspace_id from body.

At the end, provide:
- files changed
- commands to run
- tests added
- tests passed/failed
- unresolved gaps
```

---

## 19. Final Execution Gate

Codex may start Sprint 0 only when the repository owner approves these instruction files as binding.

Current state:

```text
ERD: approved source exists
SQL DDL: approved source exists
OpenAPI: approved source exists
Backlog: approved source exists
QA Test Suite: approved source exists
Codex Instructions: this file
```

Execution decision:

```text
GO to Codex Sprint 0 after owner approval.
NO-GO to Sprint 1 until Sprint 0 tests pass.
NO-GO to Pilot until all P0 QA tests pass.
```
