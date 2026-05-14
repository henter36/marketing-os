# Nashir Evidence Lifecycle ERD/SQL Patch Proposal

## Purpose

This document records a proposal-only ERD/SQL patch for future DB-backed Nashir evidence lifecycle persistence.

This document does not implement runtime behavior, modify tests, change SQL/schema/migrations, change OpenAPI YAML, expand RBAC, update generated clients, add UI, or approve Sprint 5, Pilot, or Production readiness.

## Current State

- Evidence submit exists in-memory only.
- Evidence list returns in-memory submitted evidence.
- Internal MVP Campaign Proof Flow is verified in-memory.
- DB-backed evidence lifecycle persistence is not implemented.
- Evidence lifecycle routes are not implemented.
- SQL/schema/migrations are not implemented.
- Approval and publishing are not implemented.

## Proposal Summary

Propose a future ERD/SQL patch based on Option C:

- `nashir_evidence`
- `nashir_evidence_lifecycle_events`

These are proposed future table names only. This PR does not add them to schema.

## Proposed Table: nashir_evidence

Proposed columns:

- `evidence_id`
- `workspace_id`
- `nashir_campaign_id`
- `evidence_type`
- `channel`
- `status`
- `submitted_at`
- `submitted_by_user_id`
- `published_at`
- `url`
- `notes`
- `external_reference`
- `replacement_evidence_id`
- `created_at`
- `updated_at`

Column group purposes:

- Identity: `evidence_id` provides stable evidence identity.
- Tenant/campaign scope: `workspace_id` and `nashir_campaign_id` preserve route-derived tenant context.
- Evidence payload: `evidence_type`, `channel`, `published_at`, `url`, `notes`, and `external_reference` store submitted proof metadata.
- Actor: `submitted_by_user_id` identifies the user who submitted the evidence.
- Current lifecycle state: `status` stores the current evidence lifecycle state.
- Supersession pointer: `replacement_evidence_id` can reference replacement evidence when superseded.
- Timestamps: `submitted_at`, `created_at`, and `updated_at` preserve submission and row timing.

## Proposed Table: nashir_evidence_lifecycle_events

Proposed columns:

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

Column group purposes:

- Lifecycle event identity: `lifecycle_event_id` identifies a lifecycle event record.
- Evidence linkage: `evidence_id` links the event to the evidence record.
- Tenant/campaign scope: `workspace_id` and `nashir_campaign_id` preserve route-derived tenant context.
- Transition fields: `event_type`, `prior_status`, and `next_status` describe state movement.
- Actor/reason fields: `actor_user_id`, `reason_code`, and `reviewer_notes` record who acted and why.
- Supersession linkage: `replacement_evidence_id` links to replacement evidence where applicable.
- Audit correlation: `audit_event_id` may link to an audit log equivalent if separately approved.
- Timestamps: `occurred_at` and `created_at` preserve event timing.

## Proposed Status Values

Planning-level status values:

- `submitted`
- `accepted`
- `rejected`
- `invalidated`
- `superseded`

These are proposal values only and do not update schema.

## Proposed Event Types

Planning-level `event_type` values:

- `nashir_evidence.submitted`
- `nashir_evidence.accepted`
- `nashir_evidence.rejected`
- `nashir_evidence.invalidated`
- `nashir_evidence.superseded`

These are proposed lifecycle event types only. Any audit naming convention change remains separately gated.

## Proposed Relationships

Candidate relationships:

- `nashir_evidence.workspace_id` -> workspaces/workspace equivalent
- `nashir_evidence.nashir_campaign_id` -> nashir campaign equivalent
- `nashir_evidence.replacement_evidence_id` -> `nashir_evidence.evidence_id` nullable self-reference
- `nashir_evidence_lifecycle_events.evidence_id` -> `nashir_evidence.evidence_id`
- `nashir_evidence_lifecycle_events.workspace_id` -> workspaces/workspace equivalent
- `nashir_evidence_lifecycle_events.nashir_campaign_id` -> nashir campaign equivalent
- `nashir_evidence_lifecycle_events.replacement_evidence_id` -> `nashir_evidence.evidence_id` nullable
- `nashir_evidence_lifecycle_events.audit_event_id` -> audit log equivalent nullable if separately approved

Exact FK targets must be reconciled with authoritative ERD/schema before implementation.

## Proposed Constraints

Planning-level constraints:

- `evidence_id` unique and required
- `workspace_id` required
- `nashir_campaign_id` required
- `evidence_type` required
- `channel` required
- `status` required
- `submitted_at` required
- `submitted_by_user_id` required
- `replacement_evidence_id` must not equal `evidence_id`
- `replacement_evidence_id` must belong to same `workspace_id` and `nashir_campaign_id`
- `lifecycle_event_id` unique and required
- lifecycle event `evidence_id` required
- lifecycle event `event_type` required
- lifecycle event `actor_user_id` required
- lifecycle event `workspace_id` and `nashir_campaign_id` must match the linked `nashir_evidence` record
- lifecycle event `replacement_evidence_id` must belong to the same `workspace_id` and `nashir_campaign_id`
- `prior_status` and `next_status` required for state-changing lifecycle events
- rejection requires `reason_code`
- invalidation requires `reason_code`
- supersession requires `replacement_evidence_id`

## Proposed Indexes

Planning-level indexes:

- `nashir_evidence(workspace_id, nashir_campaign_id)`
- `nashir_evidence(workspace_id, nashir_campaign_id, evidence_id)`
- `nashir_evidence(workspace_id, nashir_campaign_id, status)`
- `nashir_evidence(replacement_evidence_id)` where `replacement_evidence_id` is not null
- `nashir_evidence_lifecycle_events(evidence_id)`
- `nashir_evidence_lifecycle_events(workspace_id, nashir_campaign_id, evidence_id)`
- `nashir_evidence_lifecycle_events(event_type)`
- `nashir_evidence_lifecycle_events(audit_event_id)` where `audit_event_id` is not null

## Schema Patch Target Options

Options:

- Option A: add a new schema patch file, such as `docs/marketing_os_v5_6_5_phase_0_1_schema_patch_003.sql`
- Option B: modify base schema directly
- Option C: add separate Nashir-specific schema patch

Recommendation:

Prefer a new explicit schema patch file rather than editing base schema directly, subject to migration order governance and existing patch numbering authority.

## Required Wrapper / Authority Updates

Future implementation may need updates to:

- `docs/07_database_schema.sql`
- `docs/17_change_log.md`
- `docs/03_decision_log.md`
- migration order documentation
- strict verification references

This proposal does not modify those files except decision/change log.

## Tenant Isolation / Non-Disclosure

Future implementation must preserve:

- missing membership returns non-disclosing `404`
- unknown workspace returns non-disclosing `404`
- unknown campaign returns non-disclosing `404`
- unknown evidence returns non-disclosing `404`
- cross-workspace evidence returns non-disclosing `404`
- cross-campaign evidence returns non-disclosing `404`
- unknown or cross-context lifecycle event returns non-disclosing `404`
- all queries must be route-derived workspace/campaign scoped

## Runtime / OpenAPI / Test Impact

Future implementation would likely require:

- repository persistence tests
- migration tests
- route tests
- OpenAPI contract updates
- strict migration verification
- full internal MVP regression tests

Runtime, OpenAPI, and tests are not changed in this PR.

## NO-GO Boundaries

The following remain NO-GO:

- SQL/schema/migrations
- DB-backed implementation
- runtime changes
- OpenAPI YAML changes
- RBAC expansion
- generated clients
- lifecycle route implementation
- approval routes/transitions
- publishing workflows
- frontend/UI
- package/workflow/script changes
- Sprint 5
- Pilot
- Production

## Recommended Next Step

After this proposal:

- create a schema authority reconciliation PR if patch numbering or migration order is ambiguous, or
- create a documentation-only SQL patch planning gate for the selected patch target.

Do not implement SQL/schema/migrations directly from this proposal.

## GO / NO-GO Recommendation

GO for documentation-only ERD/SQL patch proposal.

NO-GO for implementation.
