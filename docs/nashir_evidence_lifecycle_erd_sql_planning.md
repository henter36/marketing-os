# Nashir Evidence Lifecycle ERD/SQL Planning

## Purpose

This document records an ERD/SQL planning gate for the future DB-backed Nashir evidence lifecycle persistence model.

This document does not implement runtime behavior, modify tests, change SQL/schema/migrations, change OpenAPI YAML, expand RBAC, update generated clients, add UI, or approve Sprint 5, Pilot, or Production readiness.

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

## Selected Persistence Model

PR #215 selected Option C:

- evidence record table
- evidence lifecycle event table

This planning gate does not create either table.

## Candidate ERD Entities

Candidate future entities:

- `NashirEvidence`
- `NashirEvidenceLifecycleEvent`

Names are planning candidates only. Final ERD naming must be decided in a later ERD/SQL patch PR.

## Candidate NashirEvidence Fields

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
- `replacement_evidence_id`
- `created_at`
- `updated_at`

No SQL/schema change is authorized.

## Candidate NashirEvidenceLifecycleEvent Fields

Planning-level fields:

- `lifecycle_event_id`
- `evidence_id`
- `workspace_id`
- `nashir_campaign_id`
- `event_type`
- `prior_status`
- `next_status`
- `actor_user_id`
- `reason_code`
- `reviewer_notes`
- `replacement_evidence_id`
- `occurred_at`
- `audit_event_id`
- `created_at`

No SQL/schema change is authorized.

## Candidate Relationships

Candidate relationships:

- `NashirEvidence.workspace_id` -> `Workspace.workspace_id`
- `NashirEvidence.nashir_campaign_id` -> `NashirCampaign.nashir_campaign_id` or equivalent existing campaign table if separately approved
- `NashirEvidence.replacement_evidence_id` -> `NashirEvidence.evidence_id` nullable self-reference
- `NashirEvidenceLifecycleEvent.evidence_id` -> `NashirEvidence.evidence_id`
- `NashirEvidenceLifecycleEvent.replacement_evidence_id` -> `NashirEvidence.evidence_id` nullable
- `NashirEvidenceLifecycleEvent.audit_event_id` -> `AuditLog`/audit event equivalent if separately approved

Exact FK targets must be reconciled with the authoritative ERD/schema before implementation.

## Candidate Status Values

Planning-level status values:

- `submitted`
- `accepted`
- `rejected`
- `invalidated`
- `superseded`

Only `submitted` exists in current in-memory runtime. The other values are future lifecycle candidates only.

## Candidate Lifecycle Event Types

Planning-level `event_type` values following current entity/domain plus dotted action pattern:

- `nashir_evidence.submitted`
- `nashir_evidence.reviewed`
- `nashir_evidence.invalidated`
- `nashir_evidence.superseded`

Accept/reject are review outcomes, not separate event types unless a later audit/event decision changes this.

## Candidate Constraints

Planning-level constraints:

- `evidence_id` required and unique.
- `workspace_id` required.
- `nashir_campaign_id` required.
- `evidence_type` required.
- `channel` required.
- `status` required.
- `submitted_at` required.
- `submitted_by` required.
- `lifecycle_event_id` required and unique.
- lifecycle event `evidence_id` required.
- lifecycle event `event_type` required.
- lifecycle event `prior_status` and `next_status` required for state-changing events.
- invalidation requires `reason_code`.
- supersession requires `replacement_evidence_id`.
- `replacement_evidence_id` must not equal `evidence_id`.
- `replacement_evidence_id` must belong to same `workspace_id` and `nashir_campaign_id`.
- tenant scoped lookups must include `workspace_id` and `nashir_campaign_id`.

## Candidate Indexes

Planning-level indexes:

- `workspace_id`, `nashir_campaign_id`
- `workspace_id`, `nashir_campaign_id`, `evidence_id`
- `workspace_id`, `nashir_campaign_id`, `status`
- `evidence_id` on lifecycle event table
- `workspace_id`, `nashir_campaign_id`, `evidence_id` on lifecycle event table
- `replacement_evidence_id` where not null
- `audit_event_id` where not null if adopted

## Tenant Isolation / Non-Disclosure

Future implementation must preserve:

- missing membership returns non-disclosing `404`
- unknown workspace returns non-disclosing `404`
- unknown campaign returns non-disclosing `404`
- unknown evidence returns non-disclosing `404`
- cross-workspace evidence returns non-disclosing `404`
- cross-campaign evidence returns non-disclosing `404`
- unknown or cross-context lifecycle event returns non-disclosing `404`
- all evidence and lifecycle event lookups must be route-derived workspace/campaign scoped

## Migration Planning Questions

Future ERD/SQL implementation gate must decide:

- table names
- column names
- FK targets
- nullable fields
- check constraints
- enum/check strategy for status and `event_type`
- default timestamps
- migration order
- rollback strategy
- whether existing in-memory evidence is ignored, backfilled, or explicitly non-migrated
- whether base schema or schema patch file is the correct target
- whether `docs/07_database_schema.sql` wrapper needs update

## Runtime / Repository Implications

- Runtime changes are not authorized here.
- Future implementation may require repository support for DB-backed evidence records and lifecycle events.
- Future implementation must preserve current in-memory internal MVP behavior until a DB-backed switch is separately approved.
- Runtime switch behavior must be gated separately if needed.

## OpenAPI Relationship

- OpenAPI changes are not authorized here.
- Future OpenAPI changes may be needed for lifecycle routes and DB-backed response semantics.
- Generated clients remain NO-GO unless separately gated.

## Testing Strategy

Future implementation should include:

- migration tests
- repository persistence tests
- route tests
- lifecycle transition tests
- tenant isolation tests
- non-disclosing `404` tests
- supersession linkage tests
- invalidation reason tests
- audit correlation tests
- full internal MVP flow regression tests

## NO-GO Boundaries

The following remain NO-GO:

- SQL/schema/migrations
- DB-backed implementation
- runtime changes
- OpenAPI YAML changes
- RBAC expansion
- generated clients
- evidence lifecycle route implementation
- approval routes/transitions
- publishing workflows
- frontend/UI
- package/workflow/script changes
- Sprint 5
- Pilot
- Production

## Recommended Next Step

After this planning gate:

- create a documentation-only ERD/SQL patch proposal for `NashirEvidence` and `NashirEvidenceLifecycleEvent`, or
- create a schema authority reconciliation PR if current ERD/schema targets are ambiguous.

Do not implement SQL/schema/migrations directly from this document.

## GO / NO-GO Recommendation

GO for documentation-only ERD/SQL planning.

NO-GO for implementation.
