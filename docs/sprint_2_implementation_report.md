# Sprint 2 Implementation Report

## Scope Completed

- CostBudget list/create endpoints.
- CostGuardrail list/create endpoints.
- Internal MediaCostPolicy presence check for MediaJob creation, with no public MediaCostPolicy API.
- MediaJob create/list/get/status endpoints.
- MediaCostSnapshot enforcement for MediaJob creation, running, and success.
- MediaAsset list-by-job/create endpoints.
- MediaAssetVersion list/create endpoints with server-generated `content_hash`.
- UsageMeter list/record endpoints.
- UsageQuotaState read endpoint.
- CostEvent list/record endpoints.
- Idempotency for MediaJob creation.
- Idempotency for UsageMeter recording.
- Audit placeholders for Sprint 2 sensitive writes.

## Files Changed

- `src/router.js`
- `src/store.js`
- `src/rbac.js`
- `test/integration/sprint1.integration.test.js`
- `test/integration/sprint2.integration.test.js`
- `docs/sprint_2_implementation_report.md`

## Endpoints Implemented

```text
GET /workspaces/{workspaceId}/cost-budgets
POST /workspaces/{workspaceId}/cost-budgets
GET /workspaces/{workspaceId}/cost-guardrails
POST /workspaces/{workspaceId}/cost-guardrails
GET /workspaces/{workspaceId}/campaigns/{campaignId}/media-jobs
POST /workspaces/{workspaceId}/campaigns/{campaignId}/media-jobs
GET /workspaces/{workspaceId}/media-jobs/{mediaJobId}
PATCH /workspaces/{workspaceId}/media-jobs/{mediaJobId}/status
GET /workspaces/{workspaceId}/media-jobs/{mediaJobId}/assets
POST /workspaces/{workspaceId}/media-jobs/{mediaJobId}/assets
GET /workspaces/{workspaceId}/assets/{mediaAssetId}/versions
POST /workspaces/{workspaceId}/assets/{mediaAssetId}/versions
GET /workspaces/{workspaceId}/usage-meter
POST /workspaces/{workspaceId}/usage-meter
GET /workspaces/{workspaceId}/quota-state
GET /workspaces/{workspaceId}/cost-events
POST /workspaces/{workspaceId}/cost-events
```

Existing Sprint 0 and Sprint 1 endpoints remain intact.

## Tests Added

- Sprint 2 route alignment against the implemented OpenAPI surface.
- CostBudget create/list, RBAC deny, tenant scope, and negative amount rejection.
- CostGuardrail create/list, RBAC, audit placeholder, and block enforcement.
- MediaJob create/list/get/status behavior.
- MediaJob idempotency replay and conflict behavior.
- MediaCostSnapshot required before MediaJob creation, running, and success.
- Failed MediaJob does not create commercial UsageMeter entries.
- MediaAsset create/list behavior.
- MediaAssetVersion create/list behavior, duplicate version rejection, and approved-version no-patch immutability.
- UsageMeter `usable_output_confirmed=true` requirement.
- UsageMeter idempotency replay and conflict behavior.
- UsageQuotaState read behavior.
- CostEvent create/list behavior and negative amount rejection.
- CostEvent does not create billing provider or invoice state.
- Sprint 2 ErrorModel consistency.

## Commands Run Locally

```bash
node --test test/*.test.js
node --test test/integration/*.test.js
node scripts/verify-sprint0.js
node scripts/openapi-lint.js
node scripts/db-seed.js
node scripts/db-migrate.js
```

## Local Test Results

```text
Unit tests: passed locally, 8/8
Integration tests: passed locally, 27/27
Sprint 0 static verification: passed locally
Local OpenAPI lint: passed locally with expected missing-doc warning in the slim local mirror
Local migration gate: passed locally with expected missing-SQL warning in the slim local mirror
RBAC seed generation: passed locally
```

Local `npm run verify:strict` was not run because this desktop shell does not have a usable `npm` on PATH and the local mirror does not contain the large authoritative SQL/OpenAPI files. The same underlying Node commands were run directly where possible.

## GitHub Actions Strict Verification Result

Not available at report creation time for the Sprint 2 changes.

Hard gate remains active: do not mark GO to Sprint 3 unless GitHub Actions strict verification passes after these Sprint 2 changes.

## OpenAPI Deviations

No intentional endpoint deviations. Sprint 2 implementation is limited to OpenAPI/backlog-approved CostBudget, CostGuardrail, MediaJob, MediaAsset, MediaAssetVersion, UsageMeter, UsageQuotaState, and CostEvent routes.

MediaCostPolicy and MediaCostSnapshot are handled as internal governed Sprint 2 state only. No public MediaCostPolicy or MediaCostSnapshot endpoint was added.

## Unresolved Gaps

- GitHub Actions strict verification was not yet available for the Sprint 2 changes at report creation time.
- Persistence remains the existing Sprint 0/1 in-memory implementation surface; PostgreSQL persistence hardening remains outside this Sprint 2 code change.
- Audit persistence remains represented by in-memory placeholder events; Sprint 4 audit read workflows remain unimplemented.

## Explicitly Not Implemented

```text
Sprint 3+
ReviewTask workflows
ApprovalDecision API beyond existing Sprint 0 checks
PublishJob
ManualPublishEvidence APIs
ClientReportSnapshot
frontend shell
auto-publishing
paid execution
AI agents
advanced attribution
BillingProvider
ProviderUsageLog
GenerationJob, Asset, or Approval entities
external provider execution beyond mocked/governed Sprint 2 behavior
```

## Readiness Decision For Sprint 3

```text
CONDITIONAL GO to Sprint 3.
```

Conditions:

```text
1. GitHub Actions strict verification must pass after Sprint 2 changes.
2. No OpenAPI route alignment failures may remain.
3. Sprint 2 tenant isolation, RBAC, idempotency, usage, cost, and asset immutability tests must remain passing.
```

Pilot and production remain blocked.
