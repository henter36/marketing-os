# Nashir DB-Backed Evidence Lifecycle Persistence Planning

## Purpose

This document records a planning-only gate for future DB-backed Nashir evidence lifecycle persistence.

This document does not implement runtime behavior, modify tests, change SQL, change OpenAPI YAML, expand RBAC, update generated clients, add UI, or approve Sprint 5, Pilot, or Production readiness.

## Current State

- Evidence submit exists in-memory only.
- Evidence list returns in-memory submitted evidence.
- Internal MVP Campaign Proof Flow is verified in-memory.
- Evidence lifecycle review does not exist.
- Evidence acceptance does not exist.
- Evidence rejection does not exist.
- Evidence invalidation does not exist.
- Evidence supersession does not exist.
- DB-backed evidence lifecycle persistence does not exist.
- Approval and publishing do not exist.

## Planning Objective

Prepare a DB-backed persistence model for evidence and evidence lifecycle states before any lifecycle route implementation.

The planning must support:

- durable evidence records
- durable lifecycle states
- actor traceability
- review outcomes
- invalidation reasons
- supersession links
- audit relationship
- tenant isolation
- rollback and migration safety

## Candidate Persistence Model Options

### Option A: Dedicated Evidence Table With Lifecycle Fields

Create a dedicated `nashir_evidence` table and include lifecycle fields directly on each evidence record.

Benefits:

- Simple read model for current evidence state.
- Direct mapping from evidence route responses to one table.
- Lower initial query complexity.

Risks:

- History can be lost or under-modeled if lifecycle changes overwrite prior state.
- Supersession and invalidation auditability may require additional structures anyway.
- Review history may become hard to inspect if only latest fields are stored.

Implementation complexity:

- Moderate for current state persistence.
- Higher if full state history is required later.

Suitability for Nashir lifecycle review:

- Suitable only if paired with durable audit/history strategy.

### Option B: Reuse Or Extend Existing Evidence-Related Entities

Reuse or extend existing approved evidence-related entities if any exist in authoritative schema.

Benefits:

- May reduce schema duplication.
- May align Nashir with existing evidence concepts.
- Could simplify shared audit/reporting if existing entities already have lifecycle semantics.

Risks:

- Existing entities may not represent Nashir-specific route-derived workspace/campaign context.
- Reuse can blur boundaries between manual publishing proof and unrelated evidence concepts.
- Schema coupling may make future Nashir lifecycle behavior harder to evolve.

Implementation complexity:

- Unknown until authoritative schema is inspected and mapped.
- Potentially high if existing evidence entities require semantic adaptation.

Suitability for Nashir lifecycle review:

- Suitable only if the existing schema already supports Nashir tenant isolation, lifecycle states, and traceability without semantic mismatch.

### Option C: Evidence Record Table Plus Lifecycle Event Table

Create a durable evidence record table and a separate evidence lifecycle event table.

Benefits:

- Strong history and traceability.
- Natural fit for review, invalidation, and supersession events.
- Preserves current state while retaining prior state transitions.
- Easier to audit and reason about governance actions.

Risks:

- More tables and joins.
- More implementation and verification scope.
- Requires clear current-state derivation rules.

Implementation complexity:

- Higher than a single-table model.
- More suitable for governance-grade lifecycle state.

Suitability for Nashir lifecycle review:

- Strong candidate because lifecycle states are governance states and require durable history.

Recommendation:

Do not choose final schema in this PR. A later ERD/SQL planning gate must decide.

## Candidate Core Fields

Planning-level fields:

- `evidence_id`
- `workspace_id`
- `nashir_campaign_id`
- `evidence_type`
- `channel`
- `status`
- `submitted_at`
- `submitted_by`
- `published_at`
- `url`
- `notes`
- `external_reference`
- `reviewed_at`
- `reviewed_by`
- `review_action`
- `reviewer_notes`
- `reason_code`
- `invalidated_at`
- `invalidated_by`
- `superseded_at`
- `superseded_by`
- `replacement_evidence_id`
- `prior_status`
- `next_status`
- `created_at`
- `updated_at`

These are planning candidates only and do not authorize SQL/schema changes.

## Version Binding Questions

Unresolved questions:

- Should evidence bind to campaign version?
- Should evidence bind to asset/content version?
- Should evidence bind only to current campaign?
- Should supersession require version linkage?
- Should invalidation be required when campaign content materially changes?

## Tenant Isolation Requirements

Future DB-backed design must enforce:

- `workspace_id` scoping
- `nashir_campaign_id` scoping
- `evidence_id` must never be resolved outside route-derived workspace/campaign context
- missing membership returns non-disclosing `404`
- unknown workspace returns non-disclosing `404`
- unknown campaign returns `404`
- unknown evidence returns `404`
- cross-workspace evidence returns `404`
- cross-campaign evidence returns `404`

## Audit Relationship

- Lifecycle persistence must define relationship to audit events.
- Evidence submit, review, invalidate, and supersede should be auditable.
- Audit alone is not a substitute for lifecycle persistence.
- Lifecycle table/event table must preserve state history or support traceability.

## Migration And Rollback Planning

A later implementation planning gate must define:

- migration order
- backfill/default strategy
- rollback behavior
- idempotency strategy
- strict verification commands
- local and CI verification
- data loss avoidance
- whether in-memory evidence remains supported during transition

## OpenAPI / Runtime Relationship

- OpenAPI changes are not authorized here.
- Runtime changes are not authorized here.
- Future DB-backed lifecycle persistence must be reconciled with current OpenAPI route contracts.
- Generated clients remain NO-GO unless separately gated.

## Testing Strategy Candidates

Future implementation must consider:

- migration tests
- repository tests
- route tests
- tenant isolation tests
- non-disclosing `404` tests
- lifecycle state transition tests
- supersession linkage tests
- invalidation reason tests
- audit event tests
- full journey regression tests

## NO-GO Boundaries

The following remain NO-GO:

- SQL/schema/migrations
- DB-backed implementation
- runtime changes
- OpenAPI YAML changes
- RBAC expansion
- generated clients
- evidence lifecycle review implementation
- evidence acceptance implementation
- evidence rejection implementation
- evidence invalidation implementation
- evidence supersession implementation
- approval routes/transitions
- publishing workflows
- frontend/UI
- package/workflow/script changes
- Sprint 5
- Pilot
- Production

## Recommended Next Step

After this planning gate:

- create an ERD/SQL planning gate for DB-backed evidence lifecycle persistence, or
- create a persistence model decision PR choosing between the candidate persistence options.

Do not implement SQL/schema/migrations directly from this document.

## GO / NO-GO Recommendation

GO for documentation-only planning.

NO-GO for implementation.
