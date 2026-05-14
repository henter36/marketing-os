# Nashir Evidence Lifecycle Persistence Path Decision

## Purpose

This document records the implementation path decision for future Nashir evidence lifecycle review.

This document does not implement runtime behavior, modify tests, change SQL, change OpenAPI YAML, expand RBAC, update generated clients, add UI, or approve Sprint 5, Pilot, or Production readiness.

## Current State

- Evidence submit exists in-memory only.
- Evidence list returns submitted in-memory evidence.
- The full internal MVP campaign proof flow is verified in-memory.
- Evidence review does not exist.
- Evidence acceptance does not exist.
- Evidence rejection does not exist.
- Evidence invalidation does not exist.
- Evidence supersession does not exist.
- DB-backed evidence persistence does not exist.
- Approval and publishing do not exist.

## Options Considered

### Option A

In-memory lifecycle review for internal MVP verification only.

### Option B

DB-backed evidence lifecycle persistence first before lifecycle implementation.

## Decision

Choose Option B.

The project should not implement evidence lifecycle review, acceptance, rejection, invalidation, or supersession until DB-backed evidence lifecycle persistence is planned and gated.

## Why Option B Wins Now

Option B wins now because:

- lifecycle states are governance states;
- acceptance, rejection, invalidation, and supersession require durable traceability;
- in-memory lifecycle review risks misleading operators;
- invalidation and supersession require reliable history;
- audit usefulness is limited without durable lifecycle records;
- DB-backed first avoids temporary behavior that will be reworked later.

## What This Does Not Authorize

This PR does not authorize:

- SQL/schema/migrations;
- DB-backed implementation;
- runtime changes;
- OpenAPI YAML changes;
- RBAC expansion;
- generated clients;
- evidence review implementation;
- evidence acceptance implementation;
- evidence rejection implementation;
- evidence invalidation implementation;
- evidence supersession implementation;
- approval routes/transitions;
- publishing workflows;
- frontend/UI;
- package/workflow/script changes;
- Sprint 5;
- Pilot;
- Production.

## Future DB-Backed Planning Requirements

Before implementation, a later DB-backed evidence lifecycle planning gate must define:

- evidence table or reuse strategy;
- lifecycle state fields;
- audit/event persistence relationship;
- version binding;
- invalidation reason fields;
- supersession linkage fields;
- actor fields;
- workspace/campaign/evidence tenant isolation;
- migration strategy;
- rollback strategy;
- test strategy;
- ErrorModel behavior including non-disclosing `404` expectations for unknown workspace, unknown campaign, unknown evidence, cross-workspace evidence, and cross-campaign evidence;
- route contract/OpenAPI relationship.

## Recommended Next Step

Open a documentation-only DB-backed evidence lifecycle persistence planning gate.

Do not implement lifecycle routes yet. Do not implement SQL/schema/migrations directly from this decision.

## GO / NO-GO Recommendation

GO for documentation-only path decision.

NO-GO for implementation.
