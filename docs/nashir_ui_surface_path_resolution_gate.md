# Nashir UI Surface Path Resolution Gate

| Field | Value |
|---|---|
| Document type | Documentation-only path resolution gate |
| Status | Draft — Pending Review |
| Scope | Nashir Core V1 only |
| Change type | Documentation-only |
| Implementation status | Not approved |
| Relationship | Follows `docs/nashir_first_implementation_slice_planning.md` |

## 1. Purpose

This document records the UI surface path blocker that stopped the first read-only / UI-contract-first Nashir Core V1 shell implementation attempt.

It defines documentation-only options for resolving the exact UI file path gap before any Nashir UI implementation can proceed.

This document does not approve implementation, create code, modify UI files, modify `prototype/`, modify runtime/server files, modify tests, modify SQL, modify OpenAPI, modify generated clients, modify packages, modify workflows, or modify migrations.

## 2. Sources Inspected

- `AGENTS.md`
- `README.md`
- `docs/02_v1_scope.md`
- `docs/04_backlog.md`
- `docs/03_decision_log.md`
- `docs/17_change_log.md`
- `docs/nashir_acceptance_criteria.md`
- `docs/nashir_user_stories.md`
- `docs/nashir_implementation_readiness_gap_review.md`
- `docs/nashir_ui_route_permission_audit_errormodel_mapping.md`
- `docs/nashir_implementation_gate_planning.md`
- `docs/nashir_first_implementation_slice_planning.md`

No blocking source conflict was found for this documentation-only UI surface path resolution gate.

## 3. Stop Reason Summary

The first implementation attempt stopped correctly.

No files were changed.

Exact UI paths were not safely identified.

The repository appeared to expose browser-facing files only under `prototype/`, which remains forbidden for the first implementation slice unless a later approval explicitly reclassifies and allows it.

Runtime/server files, tests, scripts, package/workflow files, and documentation files are not acceptable substitutes for an approved frontend UI route/component surface.

Implementation remains NO-GO.

## 4. Governance Summary

Nashir Core V1 remains manual/export/review/approval/evidence only.

The following remain NO-GO:

- no direct publishing;
- no social OAuth;
- no scheduling;
- no paid ads;
- no payment;
- no analytics ingestion;
- no attribution;
- no external integrations;
- no autonomous AI execution;
- no Post-V1 module implementation.

Readiness does not equal approval.

Evidence does not authorize publishing.

Manual publishing remains external and user-operated.

UTM Lite is not attribution.

AI remains advisory-only and cannot approve, reject, accept evidence, invalidate evidence, publish, schedule, spend, connect accounts, ingest analytics, attribute results, or change protected fields.

## 5. Current Gap

The Nashir documentation set is sufficient to define the first slice as a read-only / UI-contract-first Nashir Core V1 shell.

The repository implementation surface is not yet approved for that shell because exact frontend UI route/component files were not safely identified.

The blocker is exact UI path approval, not Nashir scope. Nashir Core V1 scope, acceptance criteria, user stories, readiness review, UI mapping, implementation gate planning, and first slice planning define a bounded candidate. They do not identify a safe existing implementation surface that can be edited without touching forbidden areas.

Until exact UI files are approved, implementation must remain blocked.

## 6. Options

| Option | Description | Risk | Condition | Status |
|---|---|---|---|---|
| Option A | Use an existing approved frontend app surface if one can be identified. | Lowest if an existing surface exists. | Exact route, page/component, navigation/sidebar, layout, and styling files must be named. | Not ready until exact paths are identified. |
| Option B | Approve creation of a new minimal frontend UI surface for Nashir. | Higher because it introduces a new UI surface. | Exact path, route, component, navigation, styling conventions, and verification commands must be approved. | Requires separate implementation gate. |
| Option C | Use `prototype/` as a temporary UI surface. | High because `prototype/` was explicitly forbidden in the first implementation prompt and remains a prototype/frontend asset area. | Would require separate reclassification, explicit approval, and exact file list. | NO-GO unless separately reclassified and approved. |
| Option D | Keep Nashir as documentation-only until the main frontend architecture is clarified. | Lowest technical risk but delays implementation. | No implementation files are touched. | Safe fallback. |

## 7. Recommended Decision

Recommended decision: choose Option A if exact approved frontend files can be identified.

If Option A cannot be satisfied, recommend Option B only after a separate UI surface creation gate names exact files, route/component boundaries, styling conventions, verification commands, rollback criteria, and NO-GO criteria.

This document does not approve Option B.

This document does not approve `prototype/`.

## 8. Required Inputs Before Implementation Resumes

Before any Nashir UI implementation resumes, a separately approved implementation prompt must provide:

- exact route file path;
- exact page/component file path;
- exact navigation/sidebar file path, if any;
- exact layout/shell dependency;
- exact styling/component conventions;
- exact verification commands;
- allowed files;
- forbidden files;
- rollback criteria;
- no-go criteria.

If any exact path remains missing, implementation must stop again with `Exact UI file path gap — implementation not safe.`

## 9. Candidate Future Implementation Gate

A future implementation prompt must include:

- exact file list;
- expected changed files;
- explicit forbidden files;
- verification commands;
- what to do if paths are missing;
- no backend/runtime writes;
- no tests unless a QA gate approves exact test files and commands;
- no SQL;
- no OpenAPI;
- no generated clients;
- no packages;
- no workflows;
- no migrations.

The future prompt must preserve the read-only / UI-contract-first boundary and must not introduce protected actions, backend writes, external integrations, analytics ingestion, attribution, direct publishing, scheduling, paid execution, payment, autonomous AI execution, or Post-V1 module implementation.

## 10. GO / NO-GO Decision

GO for documentation-only UI surface path resolution.

NO-GO for implementation.

NO-GO for `prototype/` use.

NO-GO for runtime/server, tests, SQL, OpenAPI, generated clients, packages, workflows, migrations, or any implementation file.

Future implementation requires a separately approved implementation prompt with exact UI files.

## 11. Recommended Next Step

Recommended next step: inspect and identify exact approved frontend UI files if they exist.

If no existing approved frontend UI files can be identified, create a separate UI surface creation gate before any implementation attempt.

If neither path is approved, keep implementation blocked.
