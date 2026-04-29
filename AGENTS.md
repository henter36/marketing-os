# Codex Operating Instructions

## Purpose

This repository is contract-first. Codex must preserve the verified Marketing OS guardrails, distinguish planning from implementation, and stop when approved sources conflict.

## Current-state authorities

Read current-state sources in this order before planning or implementation work:

1. `README.md`
2. `docs/17_change_log.md`
3. The specific implementation report, plan, contract, SQL, OpenAPI, QA, or backlog files named by the user request.

`docs/marketing_os_v5_6_5_codex_implementation_instructions.md` remains useful historical and guardrail context, but it must not override newer `README.md` or `docs/17_change_log.md` status decisions.

If approved sources conflict, Codex must stop and report the conflict. Do not resolve source conflicts by assumption.

## Fit-gap and proposal documents

Future fit-gap documents, proposal documents, and idea registers do not authorize implementation. They may inform discovery, RFCs, planning, or scope discussions only.

Implementation requires a separately approved implementation request with explicit scope, allowed files, forbidden files, and verification gates.

## Documentation-only PR discipline

Documentation-only PRs must not modify:

- runtime behavior;
- `src/`;
- router/store files;
- tests;
- SQL;
- OpenAPI;
- `package.json` or lockfiles;
- workflows;
- scripts;
- migrations;
- prototype/frontend assets;
- product scope.

Documentation-only PRs must not imply runtime, SQL, OpenAPI, QA, package, workflow, migration, or product behavior changes.

## Implementation PR discipline

Implementation PRs must be separately approved and scoped. Codex must identify:

- approved sources;
- exact entities/endpoints or repository methods in scope;
- allowed files;
- forbidden files;
- verification commands;
- expected CI gates;
- explicit NO-GO items.

If the request does not explicitly approve implementation, default to documentation/planning only.

## Non-negotiable guardrails

- Do not trust `workspace_id` from request bodies.
- Every workspace-scoped query must include route-derived workspace context.
- Preserve AuthGuard, WorkspaceContextGuard, MembershipCheck, PermissionGuard, and ErrorModel behavior unless a later approved contract explicitly changes them.
- Do not add endpoints outside approved OpenAPI scope.
- Do not claim Pilot or Production readiness without explicit verified approval.
- Do not treat CostEvent as billing or invoice state.
- Do not implement auto-publishing, paid execution, AI agents/providers, advanced attribution, BillingProvider, ProviderUsageLog, or feature expansion from fit-gap documents without separate approval.

## Cost-controlled Codex mode

Codex must minimize context, file reads, and tool use.

For broad, ambiguous, or repository-wide requests:

- default to inspect-only;
- do not modify files;
- identify the minimum files needed;
- stop and report if more files are required.

Codex must not scan the entire repository unless the user explicitly requests a repository-wide audit.

Before editing, Codex must classify the task as one of:

- documentation-only;
- planning/governance;
- contract patch;
- implementation;
- verification;
- conflict resolution.

If the task classification is unclear, Codex must stop and ask for scope clarification instead of editing.

## Edit limits

Codex must make the smallest safe change.

If a task requires modifying more than 3 files, Codex must stop and report:

- why more files are required;
- which files are affected;
- whether the task is still within approved scope.

Codex must not add dependencies, modify package files, or change workflows unless explicitly approved.

## Default execution behavior

For every task, Codex must report:

- task classification;
- approved sources used;
- allowed files;
- forbidden files;
- changed files;
- verification commands run;
- remaining risks;
- GO / NO-GO recommendation.

If verification cannot be run, Codex must not mark the task as fully verified.

## Skills

Use local skills under `.agents/skills/` when they match the task:

- `docs-only-pr-review` for documentation-only changes and reviews.
- `implementation-pr-review` for scoped implementation PRs.
- `runtime-sql-openapi-parity` for parity review across runtime behavior, SQL, OpenAPI, and QA.
