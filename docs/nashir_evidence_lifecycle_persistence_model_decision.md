# Nashir Evidence Lifecycle Persistence Model Decision

## Purpose

This document records the persistence model decision for future DB-backed Nashir evidence lifecycle persistence.

This document does not implement runtime behavior, modify tests, change SQL, change OpenAPI YAML, expand RBAC, update generated clients, add UI, or approve Sprint 5, Pilot, or Production readiness.

## Current State

- Evidence submit exists in-memory only.
- Evidence list returns in-memory submitted evidence.
- Internal MVP Campaign Proof Flow is verified in-memory.
- DB-backed evidence lifecycle persistence is not implemented.
- Evidence review does not exist.
- Evidence acceptance does not exist.
- Evidence rejection does not exist.
- Evidence invalidation does not exist.
- Evidence supersession does not exist.
- Approval and publishing do not exist.

## Options Considered

### Option A

Dedicated evidence table with lifecycle fields.

### Option B

Reuse or extend existing evidence-related entities if suitable.

### Option C

Evidence record table plus evidence lifecycle event table.

## Decision

Choose Option C.

Future ERD/SQL planning should be based on a durable evidence record table and a separate lifecycle event table.

## Why Option C Wins

Option C wins because it:

- preserves transition history;
- avoids overwriting governance states;
- supports invalidation reason traceability;
- supports supersession linkage;
- separates current evidence state from lifecycle event history;
- allows audit correlation without relying on audit alone;
- better supports tenant isolation and forensic review.

## Candidate Table Responsibilities

Evidence record table should hold:

- stable evidence identity;
- route-derived workspace/campaign relationship;
- submitted evidence fields;
- current lifecycle status;
- current replacement/supersession pointer if needed;
- created/updated timestamps.

Lifecycle event table should hold:

- evidence lifecycle event identity;
- `evidence_id`;
- `workspace_id`;
- `nashir_campaign_id`;
- `event_type` following the current entity/domain plus dotted action pattern;
- `prior_status`;
- `next_status`;
- `actor_user_id`;
- `reason_code`;
- `reviewer_notes`;
- `replacement_evidence_id` if superseded;
- `occurred_at`;
- `audit_event_id` or audit correlation if later adopted.

## Candidate Field Families

Planning-level field families:

- identity fields;
- tenant scope fields;
- submitted evidence fields;
- current state fields;
- lifecycle event fields;
- actor/reviewer fields;
- supersession linkage fields;
- audit correlation fields;
- created/updated timestamp fields.

Do not define final SQL here.

## Tenant Isolation Requirements

Future ERD/SQL planning must enforce:

- `workspace_id` and `nashir_campaign_id` scoping on both tables;
- `evidence_id` lookup only inside route-derived workspace/campaign context;
- `lifecycle_event_id` lookup only inside route-derived workspace/campaign/evidence context if exposed;
- unknown workspace returns non-disclosing `404`;
- unknown campaign returns non-disclosing `404`;
- unknown evidence returns non-disclosing `404`;
- cross-workspace evidence returns non-disclosing `404`;
- cross-campaign evidence returns non-disclosing `404`;
- unknown or cross-context lifecycle event returns non-disclosing `404`;
- no query should disclose whether evidence exists in another tenant.

## Supersession Requirements

- Supersession must not delete original evidence.
- `replacement_evidence_id` must belong to the same workspace and campaign.
- Original evidence should remain queryable for traceability.
- Supersession should create a lifecycle event.
- Supersession should update current state only through controlled service logic later.

## Invalidation Requirements

- Invalidation must require actor and reason.
- Invalidation should preserve prior status.
- Invalidation should create a lifecycle event.
- Invalidation should not delete evidence.
- Invalidated evidence should remain queryable for traceability.

## Audit Relationship

- Audit events are still required for lifecycle actions.
- Audit events are not a substitute for lifecycle event persistence.
- Lifecycle event records may link to audit event IDs later.
- Exact audit relationship remains for later ERD/SQL planning.

## What This Does Not Authorize

This PR does not authorize:

- SQL/schema/migrations;
- DB-backed implementation;
- runtime changes;
- OpenAPI YAML changes;
- RBAC expansion;
- generated clients;
- evidence lifecycle route implementation;
- approval routes/transitions;
- publishing workflows;
- frontend/UI;
- package/workflow/script changes;
- Sprint 5;
- Pilot;
- Production.

## Recommended Next Step

Open a documentation-only ERD/SQL planning gate for the Option C evidence record plus lifecycle event model.

Do not implement SQL/schema/migrations directly from this decision.

## GO / NO-GO Recommendation

GO for documentation-only persistence model decision.

NO-GO for implementation.
