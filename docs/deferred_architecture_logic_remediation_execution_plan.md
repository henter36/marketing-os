# Deferred Architecture / Logic Remediation Execution Plan

## Executive Summary

This document converts the recent architecture and logic observations into a controlled execution plan for Marketing OS.

This is **not** an immediate coding authorization.

The plan is intentionally deferred until the current repair stream is completed, merged, and verified. Its purpose is to prevent generic architecture notes from becoming unsafe runtime changes, scope creep, or technology drift.

## Current Decision

```text
DECISION: DEFERRED / CONDITIONAL GO ONLY

GO: Preserve this plan as an execution reference.
GO: Use this plan after the current active remediation work is closed and verified.
GO: Start with evidence-based audit before any implementation.
NO-GO: Do not implement Python validators.py.
NO-GO: Do not add runtime middleware without a mapped request path and approved contract.
NO-GO: Do not add dynamic templating or retry logic before idempotency, usage accounting, and guardrail decisions are confirmed.
NO-GO: Do not modify SQL, OpenAPI, package files, workflows, or production runtime behavior under this plan unless a later audit PR explicitly authorizes it.
```

## Why This Plan Exists

Recent technical notes raised valid themes:

1. Separation of concerns.
2. Validation location and consistency.
3. Environment configuration completeness.
4. Dynamic template handling.
5. Retry behavior for external AI/API calls.
6. Runtime guardrails and content/data validation.

However, the notes were too generic to execute directly. Some suggestions also conflict with the current repository direction, especially the proposal to add a Python `validators.py` file while the current implementation uses JavaScript/Node runtime files.

This document therefore translates the notes into a governed execution sequence.

## Execution Timing

This plan must only be used after all of the following are true:

1. The current active repair PRs are merged or explicitly closed.
2. `main` has passed strict verification after those repairs.
3. Current repository status documentation is updated.
4. There is no open PR changing the same areas of `src/`, `docs/17_change_log.md`, SQL contracts, OpenAPI contracts, or QA gates.
5. A documentation-only architecture/logic audit PR has been completed first.

## Required First Step: Audit-Only PR

Before coding, create a documentation-only audit PR.

### Required File

```text
docs/architecture_logic_audit_after_current_repairs.md
```

### Allowed Files

```text
docs/architecture_logic_audit_after_current_repairs.md
docs/17_change_log.md
```

### Forbidden Changes

```text
src/**
test/**
prototype/**
package.json
package-lock.json
.github/**
docs/*.sql
docs/*.yaml
OpenAPI files
SQL migration files
runtime router/store files
```

### Required Audit Sections

The audit file must include:

1. Executive Summary.
2. Files inspected.
3. Evidence-based findings.
4. Accepted notes.
5. Modified notes.
6. Rejected notes.
7. Current risk level.
8. Remediation plan ordered by priority.
9. What must not be implemented.
10. Go / No-Go decision for coding fixes.
11. Exact next PR sequence if remediation is approved.

## Remediation Sequence

The following sequence is mandatory. Do not combine phases unless the audit proves they are inseparable.

## Phase 1 — Environment Contract Review

### Objective

Verify that the repository exposes a safe, complete, non-secret environment contract.

### Scope

Check whether `.env.example` exists and whether it covers only required non-secret placeholders.

### Potential Allowed Changes

```text
.env.example
docs/17_change_log.md
```

### Must Not Include

- Real API keys.
- Real tokens.
- Real database credentials.
- Production secrets.
- Unused future variables.

### Acceptance Criteria

- `.env.example` exists.
- All required runtime and test variables are represented as placeholders.
- No sensitive values are committed.
- The file matches current runtime needs, not speculative future integrations.

### Risk If Mishandled

A poor `.env.example` can either break onboarding or leak operational assumptions. Adding future API variables too early can also imply unsupported integrations.

## Phase 2 — Validation Layer Audit and Minimal JS Validators

### Objective

Determine whether validation is missing, duplicated, or incorrectly mixed with repository/API logic.

### Scope

Start only with the currently approved slice, especially BrandProfile and BrandVoiceRule if they remain the active repository-backed candidate.

### Technology Rule

Validation must follow the project runtime stack.

```text
Use JavaScript/Node-compatible validators only.
Do not introduce Python validators.py.
```

### Potential File Pattern

Only if approved by the audit:

```text
src/validators/brand-profile-validator.js
src/validators/brand-voice-rule-validator.js
```

### Validation Must Cover

- Required fields.
- Empty string behavior.
- Workspace / tenant context requirements.
- Status values if applicable.
- Duplicate-sensitive inputs if applicable.
- ErrorModel consistency.

### Acceptance Criteria

- Validation behavior is deterministic.
- Validation errors map to the existing ErrorModel.
- No business rules are silently changed.
- No SQL/OpenAPI contract drift occurs unless separately approved.

### Risk If Mishandled

Validation added in the wrong layer can create duplicated logic, inconsistent errors, hidden contract changes, or route behavior that diverges from SQL/OpenAPI documentation.

## Phase 3 — Separation of Concerns Review

### Objective

Confirm whether router/API code, service/domain logic, repository logic, and validation are properly separated.

### Scope

Do not perform a broad refactor. Only address confirmed mixing that affects maintainability, testability, or correctness.

### Required Evidence

Any proposed refactor must identify:

1. Current file.
2. Mixed responsibility.
3. Target file/layer.
4. Minimal safe movement.
5. Tests affected.
6. Runtime behavior impact.

### Acceptance Criteria

- No broad restructuring without proof.
- No route behavior changes unless explicitly documented.
- No repository interface changes unless all callers/tests are updated in the same PR.
- Strict verification passes.

### Risk If Mishandled

A premature refactor can destabilize a project that is still moving from in-memory/runtime behavior toward DB-backed slices.

## Phase 4 — Runtime Guardrails / Content and Data Policy Validation

### Objective

Separate code-quality checks from runtime content/data validation.

### Non-Negotiable Distinction

```text
Code quality checks = lint/tests/CI/static checks.
Runtime guardrails = request/content/data policy validation.
```

A runtime middleware must not be described as a code-quality checker.

### Scope

Runtime guardrails may only be introduced when tied to a specific approved request path or generation workflow.

### Must Define Before Coding

1. What input is being validated.
2. Which route/job uses the validator.
3. Whether the validation blocks, warns, or records a finding.
4. ErrorModel mapping.
5. Audit/event logging behavior.
6. Whether user-visible messages are affected.

### Acceptance Criteria

- Guardrail behavior is explicit.
- No generic middleware is added without a consumer.
- No automatic blocking of content without documented rule source.
- Audit behavior is honest and not claimed durable unless backed by persistence.

### Risk If Mishandled

Poor guardrails can create false positives, block legitimate workflows, generate reputational issues, or imply compliance guarantees the system does not yet provide.

## Phase 5 — Retry Logic for AI/API Calls

### Objective

Add retry logic only after idempotency, usage accounting, and failure semantics are clear.

### Stop Conditions

Do not implement retry logic if any of the following are unresolved:

1. Idempotency key behavior.
2. GenerationJob uniqueness / replay behavior.
3. UsageMeter counting rules.
4. CostEvent creation timing.
5. Failed request status model.
6. External provider timeout classification.
7. Maximum retry count and backoff policy.

### Required Policy Before Implementation

```text
Failed technical attempts must not be counted as successful commercial usage unless the contract explicitly states otherwise.
Retries must not create duplicate user-visible assets.
Retries must not create duplicate billable usage records.
Retries must be observable in logs or job history.
```

### Acceptance Criteria

- Retry behavior is bounded.
- Retries are idempotent.
- Failed provider calls do not create duplicate commercial usage.
- Error states remain explainable.
- Tests cover timeout, provider error, partial failure, and duplicate prevention.

### Risk If Mishandled

Retry logic can silently multiply AI cost, duplicate generation results, corrupt usage metrics, and create customer billing disputes.

## Phase 6 — Dynamic Templating System

### Objective

Do not implement templating unless it is confirmed as Core V1 or explicitly approved as the next bounded slice.

### Required Contract Before Coding

A dynamic templating system must define:

1. Allowed token whitelist.
2. Token ownership and source of truth.
3. Missing token behavior.
4. Escaping rules.
5. PII restrictions.
6. Link safety validation.
7. Auditability of rendered output.
8. Whether rendered content is snapshot or regenerated dynamically.

### Example Safe Token Policy

```text
Allowed: {{product_name}}, {{product_link}}, {{campaign_name}}
Conditionally allowed: {{customer_first_name}} only if consent/PII policy exists
Rejected: arbitrary object traversal, raw HTML injection, unbounded user-defined tokens
```

### Acceptance Criteria

- No arbitrary template evaluation.
- Only whitelisted tokens are rendered.
- Missing tokens have deterministic behavior.
- Rendered content can be audited.
- Output snapshot rules are clear.

### Risk If Mishandled

Templating can introduce injection risks, broken campaigns, PII exposure, link abuse, and non-reproducible marketing outputs.

## Explicitly Rejected Implementation

The following must not be implemented:

```python
def validate_marketing_payload(payload):
    required_fields = ['campaign_name', 'target_audience', 'content_body']
    for field in required_fields:
        if field not in payload or not payload[field]:
            print(f"[ERROR] الحقل المفقود: {field}")
            return False
    print("[SUCCESS] جميع البيانات سليمة ومنطقية.")
    return True
```

### Rejection Reasons

1. Wrong runtime language for the current codebase.
2. Uses `print` instead of structured error handling.
3. Does not map to ErrorModel.
4. Does not include tenant/workspace context.
5. Uses generic fields not proven to match current contracts.
6. Does not distinguish user error, system error, provider failure, or policy rejection.
7. Encourages bypassing repository/API boundaries.

## Recommended Future PR Sequence

Only after the current active repairs are done:

1. `architecture-logic-audit-after-current-repairs`
   - Documentation-only.
   - Produces evidence and Go/No-Go.

2. `env-example-contract-alignment`
   - Only if `.env.example` is missing or incomplete.
   - No runtime behavior changes.

3. `brand-validation-layer-js`
   - Only if audit proves validation gaps.
   - JS validators only.
   - Tests required.

4. `separation-of-concerns-minimal-refactor`
   - Only if audit proves actual mixing.
   - Minimal file movement.
   - No broad restructure.

5. `guardrail-validator-contract`
   - Documentation first.
   - Defines route/job, ErrorModel, audit behavior.

6. `retry-idempotency-policy`
   - Documentation and tests first.
   - Runtime implementation only after usage/cost rules are locked.

7. `dynamic-template-contract`
   - Documentation-only first.
   - Implementation only if Core V1 or approved bounded slice.

## Final Governance Rule

Do not convert general best practices into code without repository-specific evidence.

For this project, the correct order is:

```text
Evidence -> Contract -> Test Plan -> Minimal PR -> Strict Verification -> Status Reconciliation
```

Any step that skips this order is a NO-GO.
