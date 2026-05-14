# Nashir Evidence Lifecycle Flow Verification Gate

## Purpose

Define how the Nashir Evidence Lifecycle Journey should be verified after the repository-bound slice and before any further implementation.

This gate follows the Journey-based delivery model:

Journey Gate -> Journey Slice Implementation -> Journey Flow Verification -> Status Reconciliation.

This document is documentation-only. It does not implement runtime changes, routes, OpenAPI lifecycle routes, RBAC expansion, generated clients, UI/prototype, SQL/schema patches, tests, package changes, workflows, scripts, migrations, approval, publishing, Sprint 5, Pilot, or Production readiness.

## Journey Under Verification

Nashir Evidence Lifecycle Journey:

Submit evidence
-> List evidence
-> Review evidence
-> Accept / Reject evidence
-> Invalidate evidence
-> Supersede evidence
-> List updated lifecycle state

## Current Verified State

- Schema Patch 003 exists.
- Repository slice exists.
- Repository methods exist:
  - `listByCampaign`
  - `getById`
  - `createSubmittedEvidence`
- Repository reads are tenant-scoped.
- Generic not found behavior exists.
- Submission writes are transaction-bound.
- Transaction queries pass workspace context.
- Repository tests exist.

## What This Gate Does Not Approve

This gate does not approve:

- lifecycle routes
- OpenAPI lifecycle routes
- RBAC expansion
- generated clients
- UI/prototype
- approval
- publishing
- Sprint 5
- Pilot
- Production
- isolated route-by-route implementation outside the Journey model

## Verification Dimensions

Future verification must cover these dimensions before the next implementation slice:

- Repository behavior verification
- Tenant isolation verification
- Transactional write verification
- Generic not found verification
- Lifecycle event traceability verification
- Journey continuity verification
- NO-GO boundary verification

## Candidate Verification Approaches

### A. Repository-Only Journey Flow Verification Tests

Repository-only tests can verify the current implemented slice without creating routes, OpenAPI lifecycle contracts, RBAC changes, generated clients, or UI/prototype work.

This is the safest option because it proves the DB-backed repository slice in the same layer where PR #223 implemented behavior.

### B. Route-Level Lifecycle Verification

Route-level lifecycle verification would require lifecycle routes to exist or be implemented.

This is riskier because lifecycle routes are still NO-GO and require a separate Journey implementation gate.

### C. OpenAPI Lifecycle Contract Verification

OpenAPI lifecycle contract verification would require approved lifecycle paths, operation IDs, permissions, request/response schemas, and ErrorModel mappings.

This is riskier because OpenAPI lifecycle routes remain NO-GO and generated clients remain NO-GO.

### D. Full End-to-End Lifecycle Flow Verification

Full end-to-end lifecycle flow verification would require route, OpenAPI, RBAC, repository, and possibly UI or integration surfaces to be approved.

This is the riskiest option now because most lifecycle surfaces are still explicitly NO-GO.

## Safest-To-Riskiest Ranking

1. Repository-only Journey Flow Verification tests
2. Route-level lifecycle verification
3. OpenAPI lifecycle contract verification
4. Full end-to-end lifecycle flow verification

## Recommended Next Verification Slice

The safest next step is a future repository-only Journey Flow Verification tests and report PR.

That future PR must not add routes or OpenAPI lifecycle routes. It may be considered only if separately approved with explicit allowed files, forbidden files, acceptance criteria, verification commands, and NO-GO boundaries.

## Acceptance Criteria For A Future Verification PR

A future repository-only verification PR should prove:

- submit evidence creates evidence plus submitted lifecycle event atomically
- list evidence reflects submitted evidence
- get evidence returns canonical camelCase output
- cross-workspace reads return `null` for `getById` and `[]` for `listByCampaign`
- cross-campaign reads return `null` for `getById` and `[]` for `listByCampaign`
- missing `withTransaction` fails closed
- missing returned insert row produces a safe repository error
- workspace context is passed into transaction queries
- no route changes
- no OpenAPI changes
- no RBAC changes
- no UI/prototype changes
- no generated client changes

## Required Future Status Reconciliation

After any Journey Flow Verification PR, a Status Reconciliation PR is required before moving toward lifecycle route gates or OpenAPI gates.

The Status Reconciliation must confirm what was verified, what remains NO-GO, and whether the next step is another Journey Flow Verification gate, a lifecycle implementation gate, or an OpenAPI lifecycle contract gate.

## Decision

GO for documentation-only flow verification planning.

NO-GO for route implementation, OpenAPI implementation, RBAC expansion, generated clients, UI/prototype, approval, publishing, Sprint 5, Pilot, Production, and isolated route-by-route implementation outside the Journey model until a separate gate approves the next step.
