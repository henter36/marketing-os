# DB-backed Slice 2 Template Runtime/Contract Alignment Planning

## 1. Executive decision

- Runtime/Contract Alignment Planning: GO.
- Slice 2 Template implementation: NO-GO.
- Scope candidate: PromptTemplate / ReportTemplate only.
- Alignment planning only.
- Runtime behavior change: NO-GO in this PR.
- SQL/OpenAPI changes: NO-GO in this PR.
- Repository implementation: NO-GO in this PR.
- Template runtime switch: NO-GO.
- DB-backed full persistence: NO-GO.
- Campaign persistence: NO-GO.
- BriefVersion persistence: NO-GO.
- Patch002 DB persistence: NO-GO.
- Sprint 5 coding: NO-GO.
- Pilot: NO-GO.
- Production: NO-GO.

## 2. Purpose

PR #62 proved that immediate DB-backed Slice 2 Template implementation is blocked by runtime/contract alignment gaps. This document decides the safest alignment strategy before any future repository implementation decision.

This document compares runtime-patch, contract-patch, repository-only internal mapping, and defer/reselect options. It does not authorize implementation, runtime behavior changes, SQL changes, OpenAPI changes, test changes, repository creation, template runtime switching, Sprint 5, Pilot, or Production readiness.

## 3. Governance linkage

This plan follows:

- PR #54: Plan DB-backed Slice 2 candidate.
- PR #55: Add intake and triage governance model.
- PR #61: Plan DB-backed Slice 2 templates.
- PR #62: Add DB-backed Slice 2 template mapping addendum.
- Issue #60: Issue-first triage operating model adoption.

This planning artifact must comply with AGENTS.md and the intake/triage operating model. An Issue, Proposal, Fit/Gap document, mapping addendum, or planning PR does not authorize implementation. No implementation authority is created here.

## 4. Alignment problem statement

| Problem | Source of evidence | Affected layer | Severity | Blocks repository-only implementation? |
|---|---|---|---|---|
| ReportTemplate runtime requires `report_type`. | Root `router.js` `POST /workspaces/{workspaceId}/report-templates` requires `template_name`, `report_type`, and `template_body`; root `store.js` seeds `report_type: "monthly"`; PR #62 documents the same. | Runtime, store, repository, QA. | blocker | Yes, blocks ReportTemplate create because persistence has no approved storage or contract mapping for the field. |
| SQL/OpenAPI do not define `report_type`. | Base SQL defines `report_templates` without `report_type`; base OpenAPI defines ReportTemplate endpoints/schemas without `report_type`; Patch 002 OpenAPI does not add template fields. | SQL, OpenAPI, QA, repository. | blocker | Yes, unless runtime is aligned to contract or a separate contract patch approves the field. |
| PromptTemplate runtime uses `variables`. | Root `router.js` stores `variables: body.variables || []`; root `store.js` seeds `variables`; PR #62 documents runtime response shape. | Runtime, store, repository, QA. | high | Yes for create/list response parity until mapping to `template_variables` is approved. |
| SQL/OpenAPI use `template_variables`. | SQL `prompt_templates.template_variables jsonb NOT NULL DEFAULT '{}'::jsonb`; OpenAPI uses `template_variables`; PR #62 identifies this as canonical contract naming. | SQL, OpenAPI, repository. | high | Yes unless the repository boundary has an approved public/internal mapping. |
| Runtime does not expose or set `template_status`. | Root `router.js` and root `store.js` PromptTemplate/ReportTemplate objects omit `template_status`; SQL/OpenAPI define status/defaults. | Runtime, SQL, OpenAPI, repository, QA. | medium | Maybe. DB defaults can support inserts, but public response parity and route-switch behavior remain unresolved. |
| ReportTemplate runtime lacks duplicate check. | Root `router.js` ReportTemplate create does not check duplicates; SQL has unique `(workspace_id, template_name)`. | Runtime, SQL, ErrorModel, QA. | high | Yes for ReportTemplate create until duplicate ErrorModel behavior is defined. |
| Public get/update routes are absent. | Runtime implemented routes and OpenAPI expose list/create only for PromptTemplate and ReportTemplate. | Runtime, OpenAPI, repository. | blocker for public get/update | No for internal `getById`; yes for public get/update, which must remain absent. |

## 5. Option analysis

| Option | Benefit | Risk | Files likely affected later | SQL change? | OpenAPI change? | Runtime change? | Preserves repository-only-first? | QA impact | Effect on future implementation | Recommendation |
|---|---|---|---|---|---|---|---|---|---|---|
| Option A: Runtime behavior patch first | Aligns runtime behavior with existing SQL/OpenAPI before persistence; treats SQL/OpenAPI as current authority unless product intent proves otherwise. | Could break callers that currently rely on `report_type` or `variables`; requires careful compatibility planning. | First planning doc only; later, if approved, runtime/store/tests/docs may be affected. | No, if aligning runtime to existing contract. | No, if aligning runtime to existing contract. | Yes, later only after separate approval. | Yes, after runtime behavior is aligned and then repository-only implementation is separately planned. | Requires route and ErrorModel regression tests if later implemented. | Clears the current blocker before repository work. | Preferred next planning path. |
| Option B: Contract patch first | Preserves runtime behavior if `report_type` is a real product concept. | Opens SQL/OpenAPI scope and may expand product contract prematurely. | First planning doc only; later SQL/OpenAPI/QA/docs if approved. | Yes, if `report_type` is approved. | Yes, if `report_type` is approved. | Possibly later. | Only after contract patch is reviewed and repository remains separate. | Requires strict OpenAPI, migration, and QA updates. | Creates a new contract baseline before repository work. | Conditional only if product intent proves `report_type` is required. |
| Option C: Repository-only implementation with internal mapping | Fastest path if all gaps were simple aliases. | Unsafe for `report_type`; risks data loss, invented storage, OpenAPI drift, and source-of-truth conflict. | Repository/test/docs only if ever allowed. | No. | No. | No. | Yes in shape, but not safe with current evidence. | Would need tests proving no data loss or raw DB leakage. | Cannot safely persist ReportTemplate create today. | Reject for immediate next step. |
| Option D: Defer Slice 2 and revisit candidate selection | Avoids ambiguous template contract work. | Delays template persistence and may churn candidate selection. | Candidate planning docs only. | No. | No. | No. | Not applicable. | Returns to Slice 2 candidate planning. | Avoids current blockers but loses the selected conservative candidate. | Defer only if Option A/B is rejected or becomes too broad. |

## 6. ReportTemplate `report_type` decision analysis

- Is `report_type` a real product concept or runtime-only artifact based on current evidence? Current evidence shows it is a runtime/store artifact; SQL and OpenAPI do not approve it.
- Is it present in SQL? No.
- Is it present in OpenAPI? No.
- Is it present in QA? No direct QA contract evidence was found beyond runtime behavior coverage requirements.
- Is it required by runtime create? Yes, root `router.js` requires it for ReportTemplate create.
- Is it returned in runtime response? Yes, root `router.js` returns the created object and root `store.js` seed includes it.
- Would dropping it break current public runtime behavior? Yes, changing required request fields or response shape would be a runtime behavior change.
- Would adding it to SQL/OpenAPI open contract scope? Yes.
- Could it be mapped safely without contract changes? No. There is no approved SQL column or OpenAPI field for durable storage, and silently dropping it would change semantics.
- Safest decision: treat `report_type` as a blocking decision and plan a runtime behavior patch first unless a separate contract patch planning PR proves `report_type` is product-critical.

## 7. PromptTemplate `variables` vs `template_variables` decision analysis

- Is `variables` runtime-only? Yes, current runtime/store use `variables` while SQL/OpenAPI use `template_variables`.
- Is `template_variables` SQL/OpenAPI canonical? Yes, based on SQL and OpenAPI evidence.
- Is request/response shape aligned? No.
- Can a mapper safely preserve public compatibility? Maybe, but only after an explicit alignment decision. A repository could map public `variables` to internal `template_variables`, but that would preserve a runtime shape that differs from OpenAPI.
- Would implementation need contract change? Not if runtime is aligned to the current OpenAPI field name. A contract change would be needed only if `variables` is intentionally approved as public API.
- What should a future repository use internally? `template_variables`, because that is the SQL/OpenAPI canonical field.
- What should a public response expose? The existing public runtime shape until a reviewed runtime behavior patch or contract patch says otherwise.
- Tests needed: request mapping, response mapping, default empty variables behavior, no body `workspace_id`, workspace isolation, and ErrorModel consistency.

## 8. Template status decision analysis

- Are status fields present in SQL? Yes. `prompt_templates.template_status` and `report_templates.template_status` have defaults.
- Are status fields present in OpenAPI? Yes, OpenAPI defines template status fields/default expectations.
- Are status fields present in runtime? No evidence was found that runtime create/list exposes or sets `template_status` for PromptTemplate or ReportTemplate.
- Should repository create rely on DB defaults? Only internally and only after response-shape behavior is approved.
- Should public response expose status? Not without runtime/contract alignment approval, because current runtime responses omit it.
- Is status required for V1 behavior? SQL/OpenAPI suggest it is part of the contract, but runtime behavior does not currently prove it.
- Does missing runtime status block implementation or only response parity? It blocks route-switch parity and may block repository create/list response mapping; DB insert itself could rely on defaults.
- Tests needed: DB default status, response shape policy, no premature status exposure, invalid status handling if status becomes input, and OpenAPI drift checks.

## 9. Duplicate behavior decision analysis

- PromptTemplate duplicate behavior in runtime: duplicate `(workspace_id, template_name, version_number)` is rejected with `DUPLICATE_TEMPLATE_VERSION`.
- PromptTemplate duplicate behavior in SQL: unique `(workspace_id, template_name, version_number)`, which matches runtime at a high level.
- ReportTemplate duplicate behavior in runtime: no duplicate check was found.
- ReportTemplate duplicate behavior in SQL: unique `(workspace_id, template_name)`.
- Required ErrorModel mapping for duplicates: duplicate PromptTemplate should preserve `DUPLICATE_TEMPLATE_VERSION`; duplicate ReportTemplate needs an approved ErrorModel decision before DB persistence.
- Are DB unique constraints enough? No. Repositories must pre-check or catch unique violations and map them to sanitized ErrorModel responses without constraint names or raw SQL.
- Does duplicate behavior require contract change? Not necessarily, but it requires runtime/contract alignment because current runtime does not reject ReportTemplate duplicates.
- Tests needed: same-workspace duplicate rejection, cross-workspace duplicate allowance, sanitized DB conflict handling, and no raw constraint leak.

## 10. Repository implementation eligibility after alignment

### PromptTemplateRepository

| Method | Decision | Reason | Required alignment decision first | SQL/OpenAPI change needed? | Runtime patch needed? | Tests required |
|---|---|---|---|---|---|---|
| `listByWorkspace` | CONDITIONAL GO | SQL table and OpenAPI endpoint exist, but response field mapping for `variables`/`template_variables` and `template_status` must be decided. | Public response field policy. | No, if runtime aligns to OpenAPI. | Yes, if current runtime shape changes. | Workspace isolation, response shape, status/default handling, RBAC. |
| `getById` internal only | CONDITIONAL GO | Internal validation can query by `workspace_id` and `prompt_template_id`; no public route is approved. | Internal-only boundary. | No. | No public runtime patch if internal only. | Cross-workspace not found, no existence leakage. |
| `create` | CONDITIONAL GO | SQL/OpenAPI support create, but field mapping, status default behavior, and enum validation must be aligned. | `variables` vs `template_variables`, status exposure, template type validation. | No, if runtime aligns to OpenAPI. | Yes, if request/response shape changes. | Duplicate version, enum validation, defaults, ErrorModel, tenant isolation. |
| `update` | NO-GO | No public update route is approved. | Separate contract/runtime decision. | Yes if public update is desired. | Yes if public update is desired. | Not applicable until approved. |

### ReportTemplateRepository

| Method | Decision | Reason | Required alignment decision first | SQL/OpenAPI change needed? | Runtime patch needed? | Tests required |
|---|---|---|---|---|---|---|
| `listByWorkspace` | CONDITIONAL GO | SQL table and OpenAPI endpoint exist, but runtime response currently includes `report_type`. | Response policy for `report_type` and status. | No if runtime aligns to OpenAPI; yes if `report_type` is approved. | Yes if removing or changing `report_type`. | Workspace isolation, response shape, status/default handling, RBAC. |
| `getById` internal only | CONDITIONAL GO | Internal validation can query by `workspace_id` and `report_template_id`; no public route is approved. | Internal-only boundary. | No. | No public runtime patch if internal only. | Cross-workspace not found, no existence leakage. |
| `create` | NO-GO | Runtime requires `report_type`, while SQL/OpenAPI do not define it; duplicate behavior also differs. | `report_type` product decision and duplicate ErrorModel decision. | No if runtime aligns to OpenAPI; yes if `report_type` is approved. | Yes if runtime aligns to OpenAPI. | Duplicate behavior, sanitized ErrorModel, status default, response shape, tenant isolation. |
| `update` | NO-GO | No public update route is approved. | Separate contract/runtime decision. | Yes if public update is desired. | Yes if public update is desired. | Not applicable until approved. |

## 11. Required follow-up path

Recommended next path: A. Runtime behavior patch planning PR.

Rationale:

- SQL/OpenAPI appear to be the current canonical contract for templates.
- Runtime is the outlier for `report_type` and `variables` naming.
- Product intent for `report_type` is not sufficiently proven by SQL/OpenAPI/QA evidence.
- Repository implementation should not proceed while a public runtime field cannot be safely stored or contract-mapped.
- Contract patch planning remains conditional only if runtime behavior patch planning proves `report_type` is product-critical.

## 12. Proposed next PR scope

For the recommended Runtime behavior patch planning PR, likely allowed files should be planning-only first:

- `docs/db_backed_slice_2_template_runtime_behavior_patch_planning.md`
- `docs/17_change_log.md`

Likely forbidden files for that planning PR:

- `src/`
- `test/` or `tests/`
- repository files
- SQL files
- OpenAPI files
- package files
- workflows
- migrations
- scripts
- router/store behavior
- config behavior
- endpoints
- runtime behavior changes

A later runtime behavior patch implementation, if separately approved, must have its own allowed files, forbidden files, verification gates, and PR decision. It must not authorize repository implementation, runtime switch, SQL/OpenAPI changes, Sprint 5, Pilot, or Production by implication.

If runtime behavior patch planning concludes that `report_type` is product-critical, the next path should shift to a SQL/OpenAPI contract patch planning PR before any implementation.

## 13. Risks

- Accidentally treating a runtime artifact as product contract.
- Silently dropping `report_type`.
- Adding `report_type` without business approval.
- Breaking existing runtime response shape.
- SQL/OpenAPI drift.
- ErrorModel inconsistency.
- Duplicate behavior inconsistency.
- Exposing status fields prematurely.
- Implementing repositories before contract alignment.
- Accidentally opening template runtime switch.
- False DB-backed full persistence claim.

## 14. Updated Go / No-Go recommendation

- Future Slice 2 Template implementation is not allowed now.
- Runtime behavior patch planning is required next.
- SQL/OpenAPI contract patch planning is conditional only if `report_type` is proven product-critical.
- Candidate reselection is not required yet.
- A bounded Gap Report issue should be created or linked for the template runtime/contract blocker unless the next PR explicitly relies on this approved governance decision and the existing Issue #60 governance path.

## 15. Final decision

- Runtime/Contract Alignment Planning: GO.
- Slice 2 Template implementation: NO-GO based on evidence.
- Runtime behavior patch: GO as next planning step.
- SQL/OpenAPI contract patch: CONDITIONAL GO as next planning step only if runtime behavior patch planning proves `report_type` is product-critical.
- Repository-only first: required if implementation later becomes approved.
- Template runtime switch: NO-GO.
- DB-backed full persistence: NO-GO.
- Campaign persistence: NO-GO.
- BriefVersion persistence: NO-GO.
- Patch002 DB persistence: NO-GO.
- Sprint 5 coding: NO-GO.
- Pilot: NO-GO.
- Production: NO-GO.
