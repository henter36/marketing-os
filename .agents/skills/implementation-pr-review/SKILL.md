---
name: implementation-pr-review
description: Review scoped implementation PRs in henter36/marketing-os against approved contracts, allowed files, forbidden files, guardrails, ErrorModel, tenant isolation, and verification gates.
---

# Implementation PR Review

Use this skill only when implementation is explicitly approved. Do not use a fit-gap, proposal, or planning document as implementation authorization by itself.

## Required source order

1. Read `README.md`.
2. Read `docs/17_change_log.md`.
3. Read the implementation plan/report and approved contract files named by the user.

`docs/marketing_os_v5_6_5_codex_implementation_instructions.md` remains useful but must not override newer status in `README.md` or `docs/17_change_log.md`.

If sources conflict, stop and report the conflict before editing.

## Scope checklist

- Confirm implementation is separately approved.
- Identify allowed files and forbidden files.
- Identify exact entities, routes, repository methods, or tests in scope.
- Confirm no Sprint, Patch, Pilot, Production, frontend, provider, auto-publishing, paid execution, AI, or feature expansion is mixed in unless explicitly approved.

## Guardrail checklist

- Preserve AuthGuard, WorkspaceContextGuard, MembershipCheck, PermissionGuard, and ErrorModel.
- Do not trust `workspace_id` from request bodies.
- Every workspace-scoped query must include route-derived workspace context.
- Do not add endpoints outside OpenAPI-approved scope.
- Do not leak raw SQL details, constraint names, enum names, stack traces, connection strings, or secrets.
- Sensitive writes must follow the current audit placeholder/event pattern when in scope.

## Verification checklist

Prefer the request's explicit gates. If not specified, run the closest relevant subset and report blockers clearly.

Expected strict gates usually include:

- `npm run openapi:lint:strict`
- `npm test`
- `npm run test:integration`
- `npm run db:migrate:strict`
- `npm run db:migrate:retry`
- `npm run verify:strict`

Do not mark GO if the user's hard gate requires CI and CI is unavailable or failing.
