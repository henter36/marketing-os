# Nashir Backend Slice 0 Implementation Scope

| Field | Value |
|---|---|
| Document type | Documentation-only backend Slice 0 implementation scope |
| Status date | 2026-05-10 |
| Scope | Future Nashir Backend Slice 0 implementation PR scope definition |
| Implementation approved | NO |
| Executable tests approved | NO |

## 1. Purpose

This is a Documentation-only scope definition for a future Nashir Backend Slice 0 implementation PR.

It follows PR #138, PR #139, PR #140, and PR #141.

It does not authorize implementation, executable tests, runtime behavior, backend behavior, API behavior, UI behavior, SQL changes, OpenAPI changes, generated-client updates, package changes, workflow changes, migration changes, route readiness, serve readiness, link readiness, Pilot readiness, or Production readiness.

No implementation is approved by this document.

## 2. Current Authority

- PR #138: Nashir audit event payload, ErrorModel mapping, material-change specification, evidence handling, UTM Lite, and readiness behavior planning.
- PR #139: post-merge status after PR #138.
- PR #140: implementation-readiness gate.
- PR #141: backend planning-to-contract alignment gate.

No runtime/API/SQL/OpenAPI/tests/package/workflow/migration implementation has been approved.

## 3. Slice 0 Objective

The safest future implementation slice is a backend-only planning-to-contract alignment skeleton.

Slice 0 must preserve:

- No route exposure.
- No external API behavior.
- No SQL/schema changes.
- No OpenAPI changes.
- No UI/prototype changes.
- No publishing, analytics, attribution, payment, autonomous AI, or production readiness.

Slice 0 must not create route, serve, or link readiness and must not imply any runtime behavior beyond the separately approved future scope.

## 4. Candidate Allowed Files for the Future Implementation PR

The following are candidate paths or categories only. They are not approved by this documentation PR.

- Existing backend repository index or repository-adjacent files found during inspection, such as `src/repositories/index.js`, only if the future gate approves exact edits.
- Existing ErrorModel or guard-adjacent files found during inspection, such as `src/error-model.js`, `src/guards.js`, or `src/rbac.js`, only if strictly required and explicitly approved.
- A new isolated Nashir planning/service module only if reviewers approve the exact path before implementation starts.
- Tests only in a separate test-approved PR or if explicitly approved by the future implementation gate.

This PR must not itself modify any candidate implementation file.

## 5. Explicit Forbidden Files for the Future Implementation PR Unless Separately Approved

- SQL/schema/migrations.
- OpenAPI specs.
- Generated clients.
- Package files.
- Workflows.
- `prototype/`.
- UI routes/components.
- Deployment files.
- `scripts/`.
- Unrelated runtime files.

## 6. Required Pre-Implementation Checks

The future implementation PR must declare:

- Exact allowed files.
- Exact forbidden files.
- Route impact.
- SQL impact.
- OpenAPI impact.
- ErrorModel impact.
- RBAC impact.
- Audit event mapping impact.
- Idempotency impact.
- Evidence handling impact.
- UTM Lite impact.
- Readiness behavior impact.
- Test strategy.
- Rollback/no-go criteria.
- Strict Verification expectations.

## 7. GO/NO-GO

GO for a future implementation PR only if:

- Scope is exact.
- Allowed files are exact.
- Forbidden files are exact.
- No reviewers' threads are unresolved.
- CI is green.
- No runtime behavior beyond approved scope is implied.

NO-GO if:

- Route/serve/link/Pilot/Production readiness appears or is implied.
- SQL/OpenAPI/tests/package/workflow/migration/script/deployment changes appear without explicit approval.
- `prototype/` or UI routes/components are used.
- Generated clients or unrelated runtime files are modified.
- Publishing/analytics/attribution/payment/autonomous AI readiness is implied.
- Implementation exceeds Slice 0.

## 8. Recommendation

The next PR after this one may be the first actual implementation PR only if reviewers approve this Slice 0 scope.

That future PR must remain backend-only, exact-file scoped, and explicitly bounded by the approved verification expectations and rollback/no-go criteria.
