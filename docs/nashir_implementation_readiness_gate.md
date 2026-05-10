# Nashir Implementation-Readiness Gate

| Field | Value |
|---|---|
| Document type | Documentation-only implementation-readiness gate |
| Status date | 2026-05-10 |
| Scope | Nashir implementation-readiness gate after PR #138 and PR #139 |
| Implementation approved | NO |
| Executable tests approved | NO |

## 1. Purpose

This is a Documentation-only readiness gate after PR #138 and PR #139.

It determines what must be true before any Nashir implementation PR can start.

It does not authorize implementation, executable tests, runtime behavior, backend behavior, UI behavior, API behavior, SQL changes, OpenAPI changes, generated-client updates, package changes, workflow changes, migration changes, routing, serving, linking, Pilot readiness, or Production readiness.

No implementation is approved by this document.

## 2. Current Authority

PR #138 merged Nashir audit event payload, ErrorModel mapping, material-change specification, evidence handling, UTM Lite, and readiness behavior as documentation-only planning.

PR #139 documented post-merge repository status after PR #138.

No runtime/API/SQL/OpenAPI/tests/package/workflow/migration implementation has been approved.

The accepted planning context includes `nashir.process.blocked`, `nashir.idempotency.conflict`, route-derived workspace context expectations, evidence handling, UTM Lite scope, readiness behavior, and preservation of AuthGuard, WorkspaceContextGuard, MembershipCheck, PermissionGuard, and ErrorModel behavior unless a later approved contract explicitly changes them.

## 3. Candidate First Implementation Slice

The safest candidate first implementation slice remains pending and must be separately approved before any file changes outside documentation:

- Nashir backend contract alignment gate, or repository/service skeleton gate only if separately approved.
- No UI surface implementation unless a separate UI surface gate identifies exact approved routes/components.
- No `prototype/` usage for production implementation.
- No route, serve, or link readiness unless separately approved.

Recommended pending slice: Backend-only planning-to-contract alignment gate, followed by a repository/service skeleton only if the alignment gate produces explicit allowed files, forbidden files, verification commands, and rollback/no-go criteria.

## 4. Preconditions Before Implementation

All of the following are required before any Nashir implementation PR can start:

- Exact allowed files list.
- Exact forbidden files list.
- API contract impact assessment.
- SQL/schema impact assessment.
- ErrorModel alignment check.
- RBAC/permission check.
- Audit event mapping check.
- Idempotency expectation check.
- Evidence handling check.
- UTM Lite scope check.
- Readiness behavior check.
- Test strategy defined before executable tests are added.
- Rollback/no-go criteria.
- Sprint 0 Strict Verification expected to pass.

## 5. Proposed Implementation Options Ranked

| Rank | Option | Risk | Rationale |
|---:|---|---|---|
| 1 | Option A: Backend-only planning-to-contract alignment gate | Safest | Keeps work in contract alignment and readiness review before runtime behavior exists; can verify allowed/forbidden files, ErrorModel, RBAC, audit, idempotency, evidence, UTM Lite, and readiness expectations without exposing routes or changing persistence. |
| 2 | Option B: Repository/service skeleton with no route exposure | Low to moderate | Can establish internal structure only after exact files and boundaries are approved, but it starts implementation and therefore requires stricter verification and rollback criteria. |
| 3 | Option C: API/OpenAPI contract gate | Moderate to high | Touches external contract authority and may imply generated-client, runtime, or test follow-up unless tightly constrained; must be preceded by explicit API impact assessment and approval. |
| 4 | Option D: UI surface creation gate | Riskiest | UI work is most likely to imply route, serve, link, workflow, or production-readiness behavior; it must wait for exact routes/components and must not use `prototype/` as an implementation surface. |

## 6. GO/NO-GO

GO only for a future separate implementation PR if:

- Scope is explicit.
- Allowed files are explicit.
- Forbidden files are explicit.
- Reviewers accept this gate.
- CI is green.
- No unresolved Gemini/CodeRabbit threads remain.

NO-GO if:

- Runtime/API/SQL/OpenAPI/tests/package/workflow/migration changes appear without explicit approval.
- `prototype/` is used as an implementation surface.
- Route/serve/link readiness is implied.
- AI protected actions, publishing, analytics, attribution, payment, autonomous AI, or production readiness are implied.

Additional NO-GO boundaries:

- Do not trust `workspace_id` from request bodies.
- Do not weaken AuthGuard, WorkspaceContextGuard, MembershipCheck, PermissionGuard, or ErrorModel behavior.
- Do not treat readiness as approval.
- Do not treat evidence as publishing authorization, analytics proof, or attribution proof.
- Do not treat UTM Lite as analytics ingestion or attribution.
- Do not treat CostEvent as billing or invoice state.

## 7. Recommendation

The next actual PR after this gate should be a separate implementation PR for Option A: Backend-only planning-to-contract alignment gate.

That future PR should not implement routes, route serving, UI surfaces, SQL, OpenAPI, generated clients, executable tests, package changes, workflow changes, migrations, prototype assets, publishing, analytics ingestion, attribution, payment, autonomous AI, or production readiness.

It should be approved only after reviewers accept exact scope, allowed files, forbidden files, verification commands, expected CI gates, and rollback/no-go criteria.
