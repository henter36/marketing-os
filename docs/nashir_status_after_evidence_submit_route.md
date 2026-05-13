# Nashir Status After Evidence Submit Route

## Purpose

This is a documentation-only post-merge status reconciliation after PR #208: `feat: wire Nashir evidence submit route`.

This document does not implement runtime behavior, modify tests, change SQL, change OpenAPI YAML, expand RBAC, update generated clients, add UI, or approve Sprint 5, Pilot, or Production readiness.

## Task Classification

Documentation-only / post-merge status reconciliation.

## Approved Sources Used

- `AGENTS.md`
- `README.md`
- `docs/17_change_log.md`
- `docs/03_decision_log.md`
- `docs/nashir_evidence_submit_route_implementation_report.md`
- `docs/nashir_evidence_submit_implementation_path_decision.md`
- `docs/nashir_internal_mvp_journey_contract.md`
- `docs/nashir_openapi_patch.yaml`
- `src/router.js`
- `src/store.js`
- `src/nashir/backend-slice0-service.js`
- `src/nashir/backend-slice0-repository.js`
- `test/nashir-route.test.js`
- `test/nashir-prewiring-contract.test.js`
- `test/nashir-openapi-contract.test.js`
- `test/nashir-store-entities.test.js`
- `test/nashir-service-repository-read-path.test.js`

## Current Implemented Nashir Routes

- `GET /workspaces/{workspaceId}/nashir-campaigns`
- `GET /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}`
- `POST /workspaces/{workspaceId}/nashir-campaigns`
- `GET /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/readiness`
- `GET /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/evidence`
- `POST /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/evidence`

## Evidence Submit Route Behavior Confirmed

- `POST` evidence is implemented.
- The implementation is in-memory only.
- The implementation is non-durable.
- The implementation is not DB-backed.
- It uses route-derived `workspaceId`.
- It uses route-derived `nashirCampaignId`.
- It uses `authGuard`.
- It uses `nonDisclosingMembershipCheck`.
- It uses `nashir.campaign.write`.
- It validates `evidenceType`.
- It validates `channel`.
- It requires at least one proof locator: `url`, `externalReference`, or `notes`.
- It creates evidence with `status: submitted`.
- It emits the candidate audit event `nashir_evidence.submitted`.
- It does not implement `campaignVersionId` binding.
- It does not implement `assetVersionId` binding.
- It does not implement evidence review, acceptance, invalidation, or supersession.

## Evidence List Behavior Confirmed

- Before submit, evidence list may return `{ data: [] }`.
- After submit within the same runtime process, evidence list returns submitted in-memory evidence for the route-derived campaign.
- The list response remains scoped by route-derived `workspaceId` and `nashirCampaignId`.
- This is not durable evidence.

## Journey State Confirmed

The Nashir Internal MVP Campaign Proof Flow is now implementable in-memory:

```text
Create campaign
-> List campaigns
-> Read campaign
-> Check readiness
-> Submit manual evidence
-> List evidence
```

This is internal MVP journey verification only and does not imply Pilot or Production readiness.

## OpenAPI State Confirmed

- `docs/nashir_openapi_patch.yaml` now exposes `submitNashirCampaignEvidence`.
- The submit route uses `nashir.campaign.write`.
- The patch declares `SubmitNashirCampaignEvidenceRequest`.
- The patch declares `NashirCampaignEvidence`.
- The patch declares `NashirCampaignEvidenceResponse`.
- Generated clients were not updated.

## Preserved NO-GO

The following remain NO-GO:

- DB-backed evidence persistence
- SQL/schema/migrations
- RBAC expansion
- generated clients
- evidence review
- evidence acceptance
- evidence invalidation
- evidence supersession
- approval routes/transitions
- publishing workflows
- scoring persistence
- frontend/UI
- package/workflow/script changes
- Sprint 5
- Pilot
- Production

## Recommended Next Step

Do not add approval or publishing next.

The next safe step is either:

- add or confirm full journey flow verification test or runbook, if not already sufficient; or
- create a documentation-only evidence lifecycle gate for review, acceptance, invalidation, and supersession.

Prefer full journey verification first if it is not yet explicitly documented after PR #208.

## GO / NO-GO Recommendation

GO for documentation-only status reconciliation limited to:

- `docs/nashir_status_after_evidence_submit_route.md`
- `docs/17_change_log.md`

NO-GO for runtime, tests, SQL, OpenAPI YAML, RBAC, generated clients, UI, package/workflow/script changes, migrations, DB-backed persistence, review, approval, publishing, Sprint 5, Pilot, or Production changes in this PR.
