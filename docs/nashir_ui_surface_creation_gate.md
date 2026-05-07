# Nashir UI Surface Creation Gate

| Field | Value |
|---|---|
| Document type | Documentation-only UI surface creation gate |
| Status | Draft — Pending Review |
| Scope | Nashir Core V1 only |
| Change type | Documentation-only |
| Implementation status | Not approved |
| Relationship | Follows `docs/nashir_ui_surface_path_resolution_gate.md` |

## 1. Purpose

This document defines whether and how a new minimal Nashir UI surface may be created in a future implementation PR.

It preserves implementation NO-GO for now, documents that no approved existing UI surface was identified, keeps `prototype/` forbidden unless separately reclassified, and defines the conditions that must be approved before any UI implementation resumes.

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
- `docs/nashir_ui_surface_path_resolution_gate.md`

No blocking source conflict was found for this documentation-only UI surface creation gate.

## 3. Governance Summary

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

Implementation remains NO-GO until exact UI files are approved.

## 4. Problem Statement

The first implementation attempt stopped correctly.

No approved UI surface was safely identified for the read-only / UI-contract-first Nashir Core V1 shell.

`prototype/` remains forbidden. It must not be used as an implementation surface unless a later gate separately reclassifies and explicitly approves exact prototype file use.

The blocker is not Nashir business scope. Nashir Core V1 documentation defines a bounded read-only candidate slice. The blocker is the absence of an approved frontend implementation surface with exact route, page/component, navigation, layout, styling, and verification boundaries.

## 5. Gate Decision Options

| Option | Description | Risk | Required approval | Current status |
|---|---|---|---|---|
| A | Reuse an existing approved frontend surface if exact files are identified. | Lowest if exact approved files exist. | Exact route/page/component/navigation/layout/styling files and verification commands. | Preferred if exact files exist; not ready until paths are named. |
| B | Create a new minimal Nashir UI surface. | Higher because it creates a new UI surface. | Separate future implementation PR naming exact files, expected changes, forbidden files, verification, rollback, and NO-GO criteria. | Acceptable only with a future implementation PR naming exact files. |
| C | Reclassify `prototype/` as implementation surface. | High because `prototype/` is currently forbidden and is a prototype/frontend asset area. | Separate reclassification and implementation approval naming exact prototype files and verification. | NO-GO unless separately reclassified and approved. |
| D | Keep Nashir documentation-only. | Lowest technical risk but delays implementation. | No implementation approval required. | Safe fallback. |

## 6. Recommended Decision

If no approved existing UI surface exists, proceed with Option B only through a separate implementation PR.

This document does not approve Option B implementation.

A future PR must name exact files before implementation resumes.

Option C remains NO-GO unless separately reclassified and approved.

## 7. Future Minimal UI Surface Requirements

A future minimal UI surface must be:

- read-only / UI-contract-first only;
- limited to static governance labels and display-safe status sections;
- free of backend writes;
- free of API integration;
- free of persistence;
- free of publishing controls;
- free of scheduling controls;
- free of account connection controls;
- free of analytics or attribution controls;
- free of AI execution controls.

The future UI must not imply approval, publishing authorization, evidence authorization, analytics ingestion, attribution, payment, scheduling, paid execution, external integrations, autonomous AI execution, or Post-V1 implementation.

## 8. Candidate Allowed Files — Future Only

The following are candidate allowed file categories for a future implementation PR only. They are not approved by this document.

| Candidate file category | Future boundary | Status |
|---|---|---|
| One new Nashir read-only page/component file | Allowed only if exact path is approved and the file stays read-only/UI-contract-first. | Candidate only. |
| One route/navigation registration file | Allowed only if exact path is approved and no backend/API/runtime behavior is introduced. | Candidate only. |
| One implementation report document | Allowed only if exact report path is approved by the future implementation prompt. | Candidate only. |
| Backend/server files | Not allowed. | NO-GO. |
| Tests | Not allowed unless a QA gate approves exact test files and commands. | NO-GO by default. |
| Package/workflow files | Not allowed. | NO-GO. |

Exact file path gap remains a blocker until paths are named.

## 9. Forbidden Files

The following remain forbidden:

- SQL;
- OpenAPI;
- generated clients;
- migrations;
- workflows;
- packages and lockfiles;
- backend/runtime/server files;
- tests/test files unless a QA gate approves;
- `prototype/`;
- publishing integrations;
- social OAuth;
- scheduling;
- paid ads;
- payments;
- analytics ingestion;
- attribution;
- autonomous AI execution;
- Post-V1 modules.

The future implementation must also avoid router/store files (except for the exact route registration path approved per Section 8), frontend assets not explicitly approved, any implementation file not explicitly named, and any ERD/OpenAPI/SQL/runtime contract file unless a later gate explicitly allows it.

## 10. Required Inputs Before Future Implementation

Before any future implementation resumes, reviewers must approve:

- exact new UI page/component path;
- exact route/navigation path;
- exact layout dependency;
- exact styling/component conventions;
- exact allowed files;
- exact forbidden files;
- exact verification commands;
- exact rollback criteria;
- exact no-go criteria;
- exact PR title and scope;
- exact implementation report path.

If any exact path is missing, implementation must stop.

## 11. Future Implementation Prompt Guardrails

Any future implementation prompt must instruct Codex to:

- stop if exact file paths are missing;
- stop if implementation requires backend/runtime/server changes;
- stop if package install is required;
- stop if OpenAPI, SQL, or generated clients are needed;
- stop if `prototype/` is needed;
- stop if tests are requested without a QA gate.

The future prompt must preserve read-only / UI-contract-first behavior and must not authorize protected actions.

## 12. Rollback / NO-GO Criteria

Future implementation must stop or be reverted if any of the following occur:

- any forbidden file is touched;
- any protected behavior is added;
- any backend/runtime dependency is introduced;
- any package or workflow change is made;
- any `prototype/` use occurs without separate reclassification approval;
- any publishing, OAuth, scheduling, ads, payment, analytics, attribution, or AI execution behavior is introduced;
- readiness is treated as approval;
- evidence is treated as authorization.

## 13. GO / NO-GO Decision

GO for documentation-only UI surface creation gate.

NO-GO for implementation.

NO-GO for `prototype/` use.

NO-GO for runtime/server, tests, SQL, OpenAPI, generated clients, packages, workflows, migrations, or implementation files.

Future implementation requires a separately approved implementation PR with exact UI files.

## 14. Recommended Next Step

Recommended next step: either inspect repository architecture to identify exact UI file paths, approve a future minimal UI surface implementation PR with exact files, or keep implementation blocked.
