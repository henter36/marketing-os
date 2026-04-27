# Sprint 4 Implementation Report

## Scope Completed

- Implemented ClientReportSnapshot list and generation workflows.
- Implemented AuditLog workspace-scoped read model.
- Implemented Safe Mode state read/change workflows without inventing a broad protected-write policy.
- Implemented OnboardingProgress read/update workflows with one-record-per-workspace service behavior.
- Added Pilot readiness regression coverage across Phase 0/1 controls without adding a PilotGate API.
- Preserved Sprint 0/1/2/3 guardrails, wrappers, and deferred repository cleanup.

## Files Changed

- `router_sprint4.js`
- `store_sprint4.js`
- `src/router.js`
- `src/store.js`
- `test/integration/sprint4.integration.test.js`
- `docs/sprint_4_implementation_report.md`

## Endpoints Implemented

```text
GET /workspaces/{workspaceId}/campaigns/{campaignId}/client-report-snapshots
POST /workspaces/{workspaceId}/campaigns/{campaignId}/client-report-snapshots
GET /workspaces/{workspaceId}/audit-logs
GET /workspaces/{workspaceId}/safe-mode
POST /workspaces/{workspaceId}/safe-mode
GET /workspaces/{workspaceId}/onboarding-progress
PATCH /workspaces/{workspaceId}/onboarding-progress
```

No PilotGate API, AdminNotification API, SetupChecklistItem API, frontend route, or unapproved endpoint was added.

## Tests Added

- Sprint 4 route alignment against the OpenAPI-approved surface.
- ClientReportSnapshot generate/list behavior.
- ClientReportSnapshot tenant isolation and RBAC allow/deny behavior.
- Invalid report period rejection.
- Report snapshot immutability after ManualPublishEvidence supersede.
- Report snapshot immutability after ManualPublishEvidence invalidate.
- AuditLog read with `audit.read`.
- AuditLog denied without `audit.read`.
- AuditLog tenant isolation.
- AuditLog PATCH/DELETE routes unavailable.
- Safe Mode read, activate, and deactivate behavior.
- Safe Mode RBAC allow/deny behavior.
- Safe Mode audit events.
- OnboardingProgress read before row exists.
- OnboardingProgress patch behavior.
- OnboardingProgress one-row-per-workspace behavior.
- OnboardingProgress RBAC allow/deny and tenant isolation.
- OnboardingProgress audit event.
- Pilot readiness regressions for tenant isolation, publish approval gates, content hash mismatch, unavailable ManualPublishEvidence PATCH/DELETE, failed MediaJob usage protection, CostEvent non-billing behavior, and sensitive-write audit events.
- Sprint 4 ErrorModel consistency.

## Commands Run

Local desktop shell:

```text
node --version
npm --version
```

Result:

```text
node.exe failed with Access is denied.
npm was not available on PATH.
```

Bundled workspace runtime discovered:

```text
C:\Users\alqud\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe
```

Attempted to download a temporary GitHub branch archive for local verification:

```text
https://github.com/henter36/marketing-os/archive/refs/heads/sprint-4-implementation.zip
```

Result:

```text
GitHub returned 404 from the local desktop shell, so local verification could not be completed from an archive snapshot.
```

GitHub Actions strict verification ran the required gates:

```bash
npm test
npm run test:integration
npm run openapi:lint:strict
npm run db:seed
npm run db:migrate:strict
npm run verify:strict
```

## GitHub Actions Strict Verification Result

```text
Workflow: Sprint 0 Strict Verification
Run: 48
Commit: afedcc487d414b6503a028cae56aa7c65a901060
Branch: sprint-4-implementation
Status: Success
Job: Verify Sprint 0 Gates
Conclusion: success
```

Successful workflow steps included:

```text
Run strict OpenAPI lint: success
Run unit tests: success
Run integration tests: success
Run RBAC seed generation: success
Run strict database migration: success
Run full strict verification aggregate: success
```

A docs-only report update was made after this run to record the CI result; that update must also pass the same pull request workflow before merge.

## OpenAPI Deviations

No intentional OpenAPI endpoint deviations.

Sprint 4 implementation is limited to the OpenAPI-approved routes listed above. Backlog-only PilotGate audit events remain test/planning scope only because no dedicated PilotGate endpoint is approved in OpenAPI.

## Unresolved Gaps

- No dedicated PilotGate API exists in the approved OpenAPI contract; no such endpoint was implemented.
- `AdminNotification` exists in approved SQL/backlog but has no approved API endpoint; no AdminNotification API was implemented.
- `SetupChecklistItem` exists in approved SQL/backlog but has no approved API endpoint; no SetupChecklistItem API was implemented.
- Safe Mode protected-write set is not explicitly approved; Sprint 4 implements only state read/change and records the protected-write policy as a gap.
- Persistence remains the existing in-memory Sprint implementation surface; PostgreSQL persistence hardening remains outside Sprint 4.

## Explicitly Not Implemented

```text
Sprint 5+
PilotGate API
AdminNotification API
SetupChecklistItem API
frontend shell
auto-publishing
paid execution
AI agents
advanced attribution
BillingProvider
ProviderUsageLog
GenerationJob, Asset, or Approval entities
external provider execution
repository cleanup
root file restructuring
moving duplicate root files into src
unapproved endpoints
```

## Readiness Decision

```text
CONDITIONAL GO to next step after the current pull request head passes GitHub Actions strict verification.
```

Sprint 4 implementation itself passed strict verification on commit `afedcc487d414b6503a028cae56aa7c65a901060`. The hard GO gate should be evaluated against the latest pull request head before merge.
