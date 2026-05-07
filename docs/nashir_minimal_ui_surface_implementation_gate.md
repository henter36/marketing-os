# Nashir Minimal UI Surface Implementation Gate

| Field | Value |
|---|---|
| Document type | Documentation-only implementation gate |
| Status | Draft — Pending Review |
| Scope | Nashir Core V1 only |
| Change type | Documentation-only |
| Implementation status | Not approved |
| Relationship | Follows `docs/nashir_ui_surface_creation_gate.md` |

## 1. Purpose

This document defines the conditions for a future minimal Nashir UI surface implementation PR.

It responds to the confirmed absence of an approved frontend UI surface, preserves implementation NO-GO for now, defines exact candidate files for a future PR, and records allowed files, forbidden files, verification commands, rollback/no-go criteria, and report requirements.

This document does not approve implementation, create UI files, create code, create tests, modify `prototype/`, modify `src/`, modify runtime/server files, modify router/store files, modify SQL, modify OpenAPI, modify generated clients, modify packages, modify workflows, or modify migrations.

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
- `docs/nashir_ui_surface_creation_gate.md`

No blocking source conflict was found for this documentation-only minimal UI surface implementation gate.

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

Manual performance review remains user-entered only.

AI remains advisory-only and cannot approve, reject, accept evidence, invalidate evidence, publish, schedule, spend, connect accounts, ingest analytics, attribute results, or change protected fields.

Implementation remains NO-GO until a separate implementation PR is explicitly approved.

## 4. Confirmed Architecture Finding

A read-only architectural inspection found no approved frontend app surface for a Nashir read-only UI shell.

No `app/`, `apps/`, `frontend/`, `web/`, `pages/`, `components/`, Vite, Next, React, Vue, Svelte, or frontend app configuration was found.

`prototype/` is the only browser-facing surface, but it remains forbidden unless a later gate separately reclassifies and explicitly approves exact prototype file use.

Backend/runtime/router/store files are not UI substitutes. `src/`, root `server.js`, root `router.js`, root `store.js`, scripts, tests, SQL, OpenAPI, generated clients, workflows, packages, migrations, and runtime/server files are not acceptable Nashir UI surfaces.

Therefore Option A cannot proceed now. The only viable implementation path is Option B: create a new minimal UI surface through a future implementation PR.

## 5. Gate Decision

This gate does not approve implementation. It defines candidate boundaries for a future implementation PR.

| Option | Decision | Current status |
|---|---|---|
| Option A: reuse an existing approved frontend surface | Unavailable because no approved UI surface was found. | Cannot proceed now. |
| Option B: create a new minimal Nashir UI surface | Candidate path only. | Not approved until a separate implementation PR. |
| Option C: use or reclassify `prototype/` | Remains NO-GO. | Not approved. |
| Option D: keep Nashir documentation-only | Safe fallback. | Available if implementation is deferred. |

## 6. Candidate Minimal UI Surface

Future candidate surface: Read-only / UI-contract-first Nashir Core V1 static UI shell.

Candidate file paths for a future implementation PR:

- `ui/nashir/index.html`
- `ui/nashir/app.js`
- `ui/nashir/styles.css`
- `docs/nashir_minimal_ui_surface_implementation_report.md`
- `docs/03_decision_log.md`
- `docs/17_change_log.md`

These paths are candidate allowed files only for a future separately approved implementation PR. They are not created or approved for editing by this document.

## 7. Candidate UI Requirements

The future minimal UI surface must:

- be static/read-only;
- require no build system;
- require no npm install;
- require no `package.json` changes;
- require no backend/server/runtime changes;
- require no API calls;
- require no persistence;
- require no external integrations;
- require no tests unless a QA gate separately approves them;
- clearly label all Nashir Core V1 governance boundaries.

## 8. Required UI Content

A future UI implementation must visibly communicate:

- Readiness is advisory - not approval.
- Approval is separate from readiness.
- Evidence records proof only - it does not authorize publishing.
- Manual publishing remains external and user-operated.
- UTM Lite supports tracked links only - not attribution.
- Manual performance review is user-entered only - not analytics ingestion.
- AI assistant is advisory-only.
- NO-GO actions are blocked in Core V1.

## 9. Forbidden UI Affordances

A future UI implementation must not include controls that imply:

- publish;
- schedule;
- connect account;
- launch ad;
- spend budget;
- pay;
- ingest analytics;
- attribute performance;
- auto-optimize;
- AI approval;
- evidence authorization;
- direct external integration.

## 10. Candidate Allowed Files - Future Implementation PR Only

| Candidate file path | Purpose | Allowed behavior | Forbidden behavior | Verification expectation | Gate status |
|---|---|---|---|---|---|
| `ui/nashir/index.html` | Static entry page for the Nashir read-only shell. | Markup for governance labels and read-only sections only. | Forms, external scripts, API calls, publish/schedule/connect/pay/analytics/AI execution controls. | Inspect diff and open as a static local file if future gate allows. | Candidate only; not approved here. |
| `ui/nashir/app.js` | Static local UI behavior for display-only section rendering, if needed. | Client-side read-only rendering from local constants only. | Network calls, persistence, package imports, generated clients, runtime coupling, protected actions. | Inspect for no `fetch`, no storage writes, no external integrations, and no forbidden controls. | Candidate only; not approved here. |
| `ui/nashir/styles.css` | Static styles for the read-only shell. | Layout, typography, badges, labels, and responsive display. | Frontend asset imports not explicitly approved, generated assets, package dependencies. | Inspect diff and static rendering if future gate allows. | Candidate only; not approved here. |
| `docs/nashir_minimal_ui_surface_implementation_report.md` | Future implementation report. | Document files changed, source docs, verification, limitations, and NO-GO preservation. | Runtime claims, implementation expansion, Pilot/Production readiness claims. | Review report for exact changed files and verification evidence. | Candidate only; not approved here. |
| `docs/03_decision_log.md` | Future decision log update. | Document the future implementation decision/change only. | Scope expansion, implementation approval beyond the future PR, or runtime/product claims. | Review wording for documentation-only decision/change boundaries. | Candidate only; not approved here. |
| `docs/17_change_log.md` | Future change log update. | Document the future implementation change only. | Scope expansion, implementation approval beyond the future PR, or runtime/product claims. | Review wording for documentation-only decision/change boundaries. | Candidate only; not approved here. |

## 11. Forbidden Files

The following remain forbidden for the future minimal UI surface unless a later approved gate explicitly changes that boundary:

- `src/`;
- root `server.js`;
- root `router.js`;
- root `store.js`;
- runtime/server files;
- API route files;
- database/schema files;
- SQL files;
- OpenAPI files;
- generated clients;
- migrations;
- workflows;
- `package.json`;
- lockfiles;
- `scripts/`;
- `tests/`;
- `test/`;
- `prototype/`;
- external integrations;
- analytics/attribution files;
- payment/billing files;
- AI runtime/autonomous agent files.

## 12. Future Implementation Verification Steps

A future implementation PR must run and verify:

- `git branch --show-current`
- `git status --short`
- `git diff --name-only`
- `git diff --stat`
- `git diff --check`
- verify no forbidden files are changed;
- perform static file inspection for forbidden words/controls;
- verify no package install is required;
- verify no build command is required unless a future gate explicitly adds one.

Expected changed files exactly:

- `ui/nashir/index.html`
- `ui/nashir/app.js`
- `ui/nashir/styles.css`
- `docs/nashir_minimal_ui_surface_implementation_report.md`
- `docs/03_decision_log.md`
- `docs/17_change_log.md`

`docs/03_decision_log.md` and `docs/17_change_log.md` are allowed only to document the future implementation decision/change. They must not authorize scope expansion.

Any additional changed file is a NO-GO unless the future implementation prompt explicitly approved it before work began.

## 13. Rollback Plan

Rollback for a future approved implementation must revert the future implementation PR.

No data rollback is needed because SQL remains forbidden.

No generated client rollback is needed because OpenAPI and generated clients remain forbidden.

No runtime rollback is needed because server/runtime behavior remains forbidden.

No dependency rollback is needed because package changes remain forbidden.

## 14. NO-GO Criteria

A future implementation PR is NO-GO if:

- any file outside the exact allowed list is changed;
- `prototype/` is used;
- `src/` is touched;
- runtime/server/router/store files are touched;
- tests are added without a QA gate;
- `package.json` or lockfiles are touched;
- SQL, OpenAPI, or generated clients are touched;
- workflows, migrations, or scripts are touched;
- any forbidden UI affordance is added;
- any publishing, OAuth, scheduling, ads, payment, analytics, attribution, or AI execution behavior is introduced;
- readiness is treated as approval;
- evidence is treated as authorization.

## 15. Implementation Prompt Requirements

A future implementation prompt must:

- name the exact allowed files;
- forbid all other files;
- require stopping if more files are needed;
- require stopping if package install or build tooling is needed;
- require stopping if backend/runtime/API behavior is needed;
- require stopping if `prototype/` is needed;
- require a documentation report;
- require verification results before commit.

## 16. GO / NO-GO Decision

GO for documentation-only minimal UI surface implementation gate.

NO-GO for implementation.

NO-GO for `prototype/` use.

NO-GO for `src/`, runtime/server, tests, SQL, OpenAPI, generated clients, packages, workflows, migrations, or implementation files.

Future implementation requires a separately approved implementation PR with exact allowed files.

## 17. Recommended Next Step

After this document is reviewed and merged, prepare a tightly scoped future implementation prompt for: Read-only / UI-contract-first Nashir Core V1 static UI shell.

That prompt should proceed only if reviewers accept these candidate files:

- `ui/nashir/index.html`
- `ui/nashir/app.js`
- `ui/nashir/styles.css`
- `docs/nashir_minimal_ui_surface_implementation_report.md`
