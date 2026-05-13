# Nashir Internal MVP Journey Contract

## Purpose

This document defines a documentation-only journey contract for:

```text
Nashir Internal MVP Campaign Proof Flow
```

This document does not implement runtime behavior, tests, OpenAPI YAML, SQL, RBAC, generated clients, UI, package/workflow/script changes, migrations, Sprint 5, Pilot, or Production readiness.

## Why Journey Now

Nashir should shift from route-by-route delivery to journey-based delivery because the following foundational routes now exist:

- create campaign;
- list campaigns;
- read campaign;
- readiness advisory;
- evidence list.

Continuing route-by-route risks producing disconnected API surfaces rather than a usable product flow. The next planning unit should describe the internal MVP journey those routes are meant to support.

## Journey Name

Nashir Internal MVP Campaign Proof Flow

## Happy Path

Target internal journey:

1. Create campaign.
2. List campaigns.
3. Read campaign.
4. Check readiness.
5. Submit manual evidence.
6. List evidence.

## Current Implemented Steps

Implemented:

- Create campaign.
- List campaigns.
- Read campaign.
- Check readiness.
- List evidence.

Missing:

- Submit manual evidence.

## Current Route Mapping

| Journey Step | Route | Status |
|---|---|---|
| Create campaign | `POST /workspaces/{workspaceId}/nashir-campaigns` | Implemented |
| List campaigns | `GET /workspaces/{workspaceId}/nashir-campaigns` | Implemented |
| Read campaign | `GET /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}` | Implemented |
| Check readiness | `GET /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/readiness` | Implemented |
| Submit manual evidence | `POST /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/evidence` | Missing / not implemented |
| List evidence | `GET /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/evidence` | Implemented; returns `{ data: [] }` until evidence submit/persistence exists |

## Critical Decision Before Implementation

Future evidence submit implementation must choose one of:

### Option A: In-Memory Submit

Implement in-memory submit only for narrow contract/testing journey completion.

Option A is acceptable only if explicitly scoped as internal MVP / contract verification, not Production or durable evidence.

### Option B: DB-Backed Persistence First

Approve DB-backed evidence persistence before submit implementation.

Option B is stronger for product truth but heavier and requires SQL/schema/migration/persistence gates.

This PR does not authorize either implementation path.

## Journey Acceptance Criteria

Planning-level acceptance criteria:

- A user can create a campaign.
- The created campaign appears in list.
- The campaign can be read by ID.
- Readiness can be checked.
- Manual evidence can be submitted after the future submit route exists.
- Evidence list returns submitted evidence after future submit exists.
- The flow remains in-memory unless a later DB-backed gate is approved.
- No approval, publishing, analytics, attribution, external integration, Pilot, or Production claim is implied.

## Future Flow Verification

Future verification expectation:

```text
Create -> List -> Read -> Readiness -> Submit Evidence -> List Evidence
```

This PR does not add tests.

A later implementation PR must include route/service tests or a dedicated flow verification test proving the full journey, not only the route.

## NO-GO Boundaries

The following remain NO-GO:

- implementation of `POST` evidence;
- OpenAPI YAML changes;
- SQL/schema/migrations;
- RBAC expansion;
- generated clients;
- evidence persistence;
- evidence review;
- evidence acceptance;
- evidence invalidation;
- evidence supersession;
- approval routes/transitions;
- publishing workflows;
- scoring persistence;
- DB-backed Nashir persistence;
- frontend/UI;
- package/workflow/script changes;
- Sprint 5;
- Pilot;
- Production.

## Recommended Next Step

After this journey contract is merged, open a separate implementation planning/approval step deciding whether evidence submit should be:

- in-memory internal MVP slice; or
- DB-backed persistence-first slice.

Do not implement `POST` evidence directly from this document.

## GO / NO-GO Recommendation

GO for documentation-only journey contract.

NO-GO for implementation of `POST` evidence, runtime behavior, tests, OpenAPI YAML, SQL/schema/migrations, RBAC expansion, generated clients, evidence persistence/review/acceptance/invalidation/supersession, approval routes/transitions, publishing workflows, scoring persistence, DB-backed Nashir persistence, frontend/UI, package/workflow/script changes, Sprint 5, Pilot, or Production.
