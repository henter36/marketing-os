# Deferred Architecture / Logic Remediation Execution Plan

## Executive Decision

```text
Decision: DOCUMENTATION-ONLY GO.
Execution status: DEFERRED.
Implementation authorization: NO-GO until current DB-backed Slice 1 and active remediation work are completed, merged, and verified.
Runtime behavior changes: NO-GO.
Source code changes from this document: NO-GO.
SQL changes: NO-GO.
OpenAPI changes: NO-GO.
Python validators.py: REJECTED.
Future implementation language: JavaScript/Node only, unless the repository stack formally changes in a separate approved architecture decision.
```

This document converts the external architecture and logic notes into a controlled future execution plan. It is not an implementation patch. It must be used only after the current repair stream is complete and the repository is stable.

## Why This Document Exists

The received notes contain useful themes, but they are too generic to be executed directly. Some points are valid only after evidence is gathered from the repository. One point is structurally unsafe: adding a Python `validators.py` file to a JavaScript/Node repository would introduce stack inconsistency and governance drift.

This document exists to prevent unreviewed scope expansion while preserving the useful remediation ideas for later execution.

## Current Risk Assessment

| Area | Risk | Decision |
|---|---:|---|
| Separation of concerns | Medium | Audit first; refactor only if file-level evidence proves leakage. |
| Validation organization | Medium | Future JS validation modules may be allowed after audit; Python validator is rejected. |
| Environment management | Medium | `.env.example` may be safely remediated if incomplete. |
| Dynamic templating | High | Defer. Requires token whitelist, missing-token behavior, injection controls, auditability, and PII rules. |
| AI/API retry logic | High | Defer. Requires idempotency, cost accounting, failure states, and no double-charging. |
| Middleware / guardrails | Medium to High | Must be split into CI quality checks and runtime data/content guardrails. Do not add generic middleware. |

## Non-Negotiable Rules

1. Do not implement these notes while the active DB-backed Slice 1 / current remediation stream is still in progress.
2. Do not add `validators.py` or any Python runtime dependency for validation.
3. Do not mix code-quality checks with runtime content validation.
4. Do not introduce dynamic templating unless it is explicitly approved as Core V1 or a narrowly scoped future slice.
5. Do not add retry logic for AI or external APIs before idempotency and usage/cost accounting are proven.
6. Do not alter SQL, OpenAPI, or package dependencies unless a later audit proves the need and a separate PR authorizes it.
7. Do not treat GitHub Actions success as proof of architecture correctness.
8. Do not make broad refactors without file-level evidence and minimal-change justification.

## Preconditions Before Any Future Remediation

Future remediation may start only after all of the following are true:

- The current active repair/implementation PRs are merged or explicitly closed.
- Main branch strict verification passes after those merges.
- No open PR is modifying the same source areas proposed for remediation.
- The current execution state is updated in `docs/17_change_log.md`.
- A separate audit confirms the exact files and risks.

## Required First Step: Evidence-Based Audit PR

The first future PR must be documentation-only.

### PR Title

```text
Architecture and logic audit for deferred remediation
```

### Allowed Files

```text
docs/architecture_logic_audit_for_deferred_remediation.md
docs/17_change_log.md
```

### Forbidden Files

```text
src/**
test/**
tests/**
package.json
package-lock.json
*.sql
*.yaml
.github/**
prototype/**
```

### Audit Questions

The audit must answer the following with file-level evidence:

1. Is there actual mixing between router/API concerns and business/repository logic?
2. Where is validation currently implemented?
3. Is validation missing, duplicated, or leaking raw database errors?
4. Does `.env.example` exist and does it contain the required non-secret variables?
5. Does the repository already contain any templating logic, or is templating only a future concept?
6. Does the repository contain retry logic for AI/external calls?
7. Are idempotency, usage accounting, and failure states sufficient to permit retries safely?
8. Are runtime guardrails needed now, or should the issue remain in future backlog?

### Required Audit Output

The audit document must contain:

- Executive Summary
- Findings with evidence
- Accepted / Modified / Rejected notes
- Current affected files
- Risk level by area
- Remediation sequence
- Explicit NO-GO list
- Go / No-Go decision for each future remediation PR

## Future PR Sequence

### PR 1 — Audit Only

```text
Status: Required first.
Type: Documentation only.
Runtime change: NO.
```

Purpose:

- Validate whether the generic notes apply to the actual repository.
- Prevent unnecessary refactor.
- Produce a precise remediation map.

Allowed changes:

- Add audit document.
- Update change log.

Forbidden:

- Code changes.
- Tests.
- SQL.
- OpenAPI.
- Dependencies.

### PR 2 — Environment Example Remediation

```text
Status: Allowed only if PR 1 proves .env.example is missing or incomplete.
Type: Safe configuration documentation/runtime-support patch.
Runtime behavior change: NO.
```

Possible allowed files:

```text
.env.example
README.md
docs/17_change_log.md
```

Rules:

- Use placeholder values only.
- Do not include secrets.
- Do not add new provider requirements unless already used by the repository.
- Do not add OpenAI, Stripe, or social-platform keys unless the repository currently requires them.

### PR 3 — JavaScript Validation Layer

```text
Status: Conditional.
Type: Minimal code patch.
Runtime behavior change: YES, but validation-only.
```

Allowed only if PR 1 proves validation is missing, duplicated, or unsafe.

Possible allowed direction:

```text
src/validators/*.js
src/repositories/* only if needed to call validators safely
test/** validation or repository tests only
docs/17_change_log.md
```

Rules:

- Use JavaScript/Node, not Python.
- Preserve existing ErrorModel.
- Do not leak SQL errors, enum names, constraint names, connection strings, stack traces, or secrets.
- Keep validation close to the slice being remediated.
- No broad global middleware unless explicitly proven necessary.

### PR 4 — External/API Retry Readiness Audit

```text
Status: Audit before implementation.
Type: Documentation or tests-first.
Runtime retry implementation: NO until idempotency/cost/failure rules pass.
```

Required proof before retry implementation:

- idempotency key exists or is introduced safely;
- failure states are explicit;
- usage/cost events are not counted as successful commercial usage on failed calls;
- retry attempts are capped;
- timeout and backoff rules are defined;
- repeated GenerationJob execution cannot duplicate billable work or publish duplicate content.

### PR 5 — Retry Implementation

```text
Status: Conditional future work.
Type: Narrow runtime patch.
```

Allowed only after PR 4 passes.

Rules:

- Retry must be provider-scoped.
- Retry must be idempotent.
- Retry must be observable.
- Retry must not alter financial or usage truth incorrectly.

### PR 6 — Dynamic Templating Contract

```text
Status: Deferred.
Type: Contract first, no runtime implementation initially.
```

Required contract decisions before implementation:

- allowed token whitelist;
- missing-token behavior;
- escaping/injection handling;
- PII restrictions;
- audit log expectations;
- preview vs publish behavior;
- template versioning;
- whether templates belong to Brand, Campaign, Brief, ChannelVariant, or a separate Template domain.

### PR 7 — Dynamic Templating Implementation

```text
Status: Post-contract only.
Type: Runtime implementation.
```

Forbidden until PR 6 is approved.

## Explicit Rejection: Python validators.py

The proposed Python function is rejected for this repository.

Reasons:

- The current repository uses JavaScript/Node conventions in `src/`.
- A Python validator would create a second runtime stack without architectural approval.
- The proposed function uses `print`, which is not acceptable for governed error handling.
- It returns only boolean values and loses structured ErrorModel detail.
- It does not support tenant isolation, RBAC, audit context, or field-level error reporting.

Correct future direction, if needed:

```text
src/validators/<slice-name>-validator.js
```

with structured errors mapped to the existing ErrorModel.

## Separation of Concerns Remediation Rules

A future refactor must follow these rules:

- Router/API layer handles request parsing, response formatting, auth context, and ErrorModel mapping.
- Service/domain layer handles workflow-level business rules only if such a layer already exists or is approved.
- Repository layer handles persistence and DB mapping only.
- Validators handle input and contract validation, not database persistence.
- No broad restructuring unless it reduces concrete, proven risk.

## Guardrails vs Middleware Decision

Do not create a generic middleware called `LogicValidator`.

Use the correct mechanism:

| Concern | Correct mechanism |
|---|---|
| Code quality | ESLint, tests, CI, strict verification |
| Payload shape | JS validators or route validation |
| DB constraint safety | repository-level mapping and ErrorModel handling |
| Content claims / prohibited wording | guardrail service, policy validator, review workflow |
| AI output quality | generation evaluation / approval workflow |
| Security | auth/RBAC/tenant isolation middleware or guards |

## Go / No-Go Gates

### GO

- Documentation-only audit after current fixes are complete.
- `.env.example` remediation if incomplete.
- JS validation layer if evidence proves it is needed.

### CONDITIONAL GO

- Retry logic after idempotency, failure, and cost accounting proof.
- Templating contract after scope approval.
- Templating implementation after contract approval.

### NO-GO

- Python validator.
- Generic runtime middleware without clear route/domain ownership.
- Retry logic before idempotency and usage/cost controls.
- Dynamic templating before contract approval.
- SQL/OpenAPI/dependency changes inside the audit PR.
- Broad architecture refactor without file-level evidence.

## Codex Execution Prompt For Later Use

Use this prompt only after the current active fixes are completed and main is verified:

```text
You are a strict Senior Product Architect + Solution Architect + Technical Auditor.

Repository:
https://github.com/henter36/marketing-os

Task:
Perform the deferred architecture and logic remediation audit described in:
docs/deferred_architecture_logic_remediation_execution_plan.md

Rules:
- Audit only.
- Do not modify src, tests, SQL, OpenAPI, package files, workflows, or prototype files.
- Do not implement validators.
- Do not add Python files.
- Do not add middleware.
- Do not add retry logic.
- Do not add templating.
- Do not treat generic notes as evidence.
- Use only actual repository files as evidence.

Create exactly:
- docs/architecture_logic_audit_for_deferred_remediation.md

Update exactly:
- docs/17_change_log.md

The audit must include:
- Executive Summary
- Evidence-based findings
- Accepted / Modified / Rejected notes
- Files inspected
- Risk level
- Remediation PR sequence
- Explicit NO-GO list
- Go / No-Go decision

Open a documentation-only PR titled:
Architecture and logic audit for deferred remediation
```

## Final Decision

```text
This plan is accepted as a future execution-control document only.
It must not interrupt or expand the current repair stream.
The next action is still to complete and verify the active fixes.
After that, this plan may be used to start a documentation-only architecture and logic audit PR.
```