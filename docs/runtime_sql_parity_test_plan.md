# Runtime/SQL Parity Test Plan

## Executive Status

- Runtime/SQL Parity Test Plan: GO.
- Tests not implemented in this PR.
- DB-backed Slice 1: NO-GO.
- Sprint 5/Pilot/Production: NO-GO.

## Test Strategy

Future Runtime/SQL parity testing should use layered evidence rather than treating any single gate as proof of persistence readiness.

Planned layers:

- Existing runtime behavior tests: preserve Sprint 0/1/2/3/4 and Patch 002 in-memory behavior expectations.
- SQL constraint tests: prove table constraints, enums, check constraints, foreign keys, triggers, and RLS behavior.
- Repository tests: prove repository methods return the same domain outcomes expected by runtime behavior.
- Parity tests comparing runtime expectation to DB behavior: verify runtime validation and SQL constraints agree.
- ErrorModel mapping tests: prove database failures map to existing ErrorModel shapes without raw SQL or driver leakage.
- Tenant isolation tests: prove workspace-a and workspace-b cannot leak through repository queries.
- RBAC tests: prove permission allow/deny behavior matches runtime expectations.
- Immutability/append-only tests: prove protected records cannot be patched or replaced when runtime forbids mutation.
- Idempotency tests: prove duplicate requests do not create duplicate durable effects.
- Audit coupling tests: prove sensitive writes create durable audit events in the same policy boundary.
- OpenAPI drift tests: prove implemented repository-backed behavior remains inside approved contracts.

## Candidate Slice 1 Tests

### Campaign

Future parity tests should cover:

- Create/list/get/update parity.
- Workspace isolation.
- Status enum parity.
- Transition history consistency.
- ErrorModel consistency.

Required evidence before implementation:

- Campaign status values accepted by runtime match SQL constraints or enums.
- Campaign updates cannot bypass workspace_id filtering.
- CampaignStateTransition creation is transactionally coupled to state change if the slice includes state transitions.
- ErrorModel responses do not expose database internals.

### BrandProfile / BrandVoiceRule

Future parity tests should cover:

- Workspace isolation.
- Duplicate constraint behavior.
- Active/inactive status parity.
- No cross-workspace leakage.

Required evidence before implementation:

- Brand profile and voice rule names/keys behave consistently between runtime and SQL.
- Duplicate records fail with the expected ErrorModel response.
- Active/inactive status rules match SQL allowed values.
- All reads and writes are constrained to the request workspace context.

### BriefVersion

Future parity tests should cover:

- Version creation.
- Hash immutability.
- Append-only behavior.
- Latest-version behavior.
- Workspace isolation.

Required evidence before implementation:

- content_hash is generated server-side and cannot be patched by request body.
- brief content cannot be patched after creation.
- latest-version selection is deterministic.
- Append-only behavior is enforced both by runtime and SQL protections.

### PromptTemplate / ReportTemplate

Future parity tests should cover:

- Template creation/listing.
- Version/status parity.
- Workspace/system template boundaries.

Required evidence before implementation:

- System templates and workspace templates cannot leak or be mutated outside approved permissions.
- Template status values match SQL and runtime expectations.
- Version behavior is deterministic and testable.

## High-Risk Domain Tests To Defer

The following domains should not be first Slice 1 candidates. Their parity tests should be planned after lower-risk product-domain repository patterns are proven:

- MediaJob.
- MediaCostSnapshot.
- MediaAssetVersion.
- ApprovalDecision.
- PublishJob.
- ManualPublishEvidence.
- UsageMeter.
- CostEvent.
- Patch 002 persistence.
- Audit persistence.

## Acceptance Gates

Before any DB-backed Slice 1 implementation PR:

- Parity matrix reviewed.
- Gap register reviewed.
- Slice 1 candidate approved.
- No OpenAPI changes unless a contract PR is approved.
- `npm run db:migrate:strict` passes.
- `npm run db:migrate:retry` passes.
- Existing tests still pass.
- No Sprint 5 scope is included.
- No Pilot or Production readiness is claimed.

## Final Status

- This test plan is documentation-only.
- No tests are added or modified by this PR.
- DB-backed Slice 1 remains NO-GO.
- Runtime/SQL parity implementation remains NO-GO.
- Sprint 5, Pilot, and Production remain NO-GO.
