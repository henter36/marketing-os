# DB-backed Slice 2 Template Runtime Behavior Patch Planning

## 1. Executive Decision

- Runtime Behavior Patch Planning: GO.
- Runtime behavior implementation: NO-GO until this plan is reviewed.
- Slice 2 Template implementation: NO-GO.
- Scope candidate: PromptTemplate / ReportTemplate only.
- Runtime patch planning only.
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

PR #63 recommended Runtime behavior patch planning as the next conservative step after the Template Runtime/SQL Mapping Addendum and runtime/contract alignment review confirmed that immediate Slice 2 Template implementation remains blocked.

Current runtime behavior diverges from the existing SQL/OpenAPI template contract in several narrow places: ReportTemplate uses `report_type`, PromptTemplate uses `variables`, runtime does not expose or set `template_status`, ReportTemplate lacks duplicate handling, and PromptTemplate accepts `template_type` without enum validation.

This document defines a safe future runtime behavior patch strategy only. It does not authorize runtime implementation, repository implementation, SQL changes, OpenAPI changes, tests, template runtime switch, Sprint 5, Pilot, or Production readiness.

## 3. Governance Linkage

This planning artifact follows these approved governance sources:

- PR #54: Plan DB-backed Slice 2 candidate.
- PR #55: Add intake and triage governance model.
- PR #61: Plan DB-backed Slice 2 templates.
- PR #62: Add DB-backed Slice 2 template mapping addendum.
- PR #63: Plan DB-backed Slice 2 template runtime/contract alignment.
- Issue #60: Issue-first triage operating model adoption.

It must comply with `AGENTS.md` and `docs/marketing_os_intake_and_triage_operating_model.md`. An issue, proposal, fit-gap document, or planning document does not authorize implementation. Any future implementation PR still requires approved scope, allowed files, forbidden files, and verification gates.

## 4. Current Mismatch Summary

| Mismatch | Current runtime behavior | SQL/OpenAPI canonical behavior | Future patch direction | Breaking or non-breaking | Staged compatibility required | Blocks repository implementation |
| --- | --- | --- | --- | --- | --- | --- |
| ReportTemplate `report_type` | `POST /workspaces/{workspaceId}/report-templates` requires `report_type`; seeded report templates include and return it. | SQL `report_templates` and OpenAPI ReportTemplate schemas do not define `report_type`. | Align runtime away from treating `report_type` as canonical. Prefer temporarily accepting it for compatibility while not treating it as persisted product state. | Removing it immediately would be breaking for existing runtime callers. | Yes. A future patch should avoid silent data loss and document compatibility behavior. | Yes, until create/response behavior is aligned. |
| PromptTemplate `variables` | Runtime accepts and returns `variables`, defaulting to `[]`. | SQL/OpenAPI use `template_variables`; SQL stores it as jsonb with default `{}`. | Align toward canonical `template_variables`, with a temporary request mapper for legacy `variables` if approved. | A direct rename would be breaking. | Yes. Accepting both request fields can reduce compatibility risk. | Yes, until request/response mapping is explicit. |
| `template_status` | Runtime does not expose or set `template_status` for PromptTemplate or ReportTemplate. | SQL/OpenAPI define template status fields and defaults. | Define runtime default/status response behavior against the existing contract before repository work. | Additive response fields may be low risk, but strict clients/tests may still break. | Maybe. Response-shape tests must decide whether status is introduced immediately or staged. | Partially; create/list mapping needs a status decision. |
| ReportTemplate duplicate handling | Runtime has no duplicate check for `(workspace_id, template_name)`. | SQL has uniqueness on `(workspace_id, template_name)`. | Add runtime duplicate handling with a safe ErrorModel before repository persistence. | Breaking for duplicate requests that currently succeed. | Yes, because existing runtime callers may rely on permissive behavior. | Yes, because DB-backed create would reject duplicates. |
| PromptTemplate `template_type` validation | Runtime accepts any `template_type` string. | SQL/OpenAPI define allowed values: `caption`, `ad_copy`, `image_prompt`, `video_script`, `report`, `reply`. | Validate before runtime insert using the canonical enum values. | Breaking for invalid callers, but aligns to contract. | Maybe; implementation should add focused tests and clear ErrorModel. | Yes, because DB enum rejection must not leak through repository errors. |
| Public get/update routes | PromptTemplate and ReportTemplate public get/update routes are absent. | OpenAPI exposes list/create only for both template resources. | Keep absent. No public get/update routes should be introduced by runtime patch or repository work. | Non-breaking. | No. | Blocks public get/update implementation, but not list/create alignment. |

## 5. Runtime Behavior Patch Objectives

A future runtime behavior patch should:

- Align runtime behavior with existing SQL/OpenAPI where SQL/OpenAPI are canonical.
- Avoid adding `report_type` to the public contract unless a separate contract decision approves it.
- Standardize PromptTemplate variables handling toward `template_variables` or an explicitly approved compatibility mapper.
- Define whether `template_status` appears in runtime responses or remains DB/default/internal until a contract path is approved.
- Add or plan duplicate behavior alignment for ReportTemplate.
- Add or plan enum validation for PromptTemplate `template_type`.
- Preserve the current route set: list/create only.
- Preserve no public get/update routes.
- Preserve path-derived workspace authority.
- Preserve body `workspace_id` rejection.
- Preserve RBAC permissions.
- Preserve ErrorModel safety.
- Preserve in-memory default runtime unless separately changed.
- Avoid introducing DB-backed runtime behavior.

## 6. Proposed Future Runtime Patch Scope

This planning PR does not modify runtime files. If separately reviewed and approved later, a Runtime Behavior Patch Implementation PR may likely change only:

- `router.js`.
- `store.js`.
- Relevant runtime tests if they exist or are required.
- `docs/runtime_behavior_patch_implementation_report.md`.
- `docs/17_change_log.md`.

Likely forbidden future files unless separately approved:

- `src/repositories/`.
- SQL files.
- OpenAPI files.
- package files.
- workflow files.
- migrations.
- scripts.
- DB-backed repository behavior.
- template runtime switch.
- DB-backed full persistence.

Any future implementation that needs SQL/OpenAPI changes must stop and use a separate contract planning/contract PR path first.

## 7. ReportTemplate `report_type` Future Patch Strategy

| Option | Benefit | Risk | Backward compatibility impact | Contract impact | Repository impact | QA impact | Recommendation |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A. Remove `report_type` from runtime create requirement and response to match SQL/OpenAPI. | Cleanly aligns runtime with the canonical SQL/OpenAPI contract. | Immediate break for callers/tests that send or expect `report_type`. | High if done without compatibility staging. | No SQL/OpenAPI change required. | Unblocks repository mapping after tests prove response shape. | Requires runtime tests for create without `report_type` and response shape. | Conditional target state, but not preferred as an abrupt first step. |
| B. Keep accepting `report_type` temporarily but ignore/deprecate it with no persistence claim. | Reduces caller breakage while moving runtime toward contract alignment. | Could silently drop meaningful product intent if not documented and tested. | Lower than Option A; request compatibility can be preserved temporarily. | No SQL/OpenAPI change required if response remains canonical and docs state no persistence claim. | Can unblock repository-only list/create once canonical storage/response is proven. | Requires tests for accepted legacy input, canonical response, and no `report_type` persistence claim. | Preferred, provided the implementation explicitly documents compatibility and does not return `report_type` as canonical. |
| C. Preserve `report_type` and require a future SQL/OpenAPI contract patch before repository work. | Protects `report_type` if it is a real product concept. | Opens contract scope based on insufficient current evidence. | Preserves current runtime behavior. | Requires SQL/OpenAPI planning and contract review. | Repository work remains blocked until contract changes land. | Requires contract, QA, and migration review. | Defer unless product governance proves `report_type` is required. |
| D. Defer ReportTemplate repository implementation and proceed only with PromptTemplate later. | Isolates the unresolved ReportTemplate decision. | Splits Slice 2 and may reduce value of the template slice. | Avoids breaking ReportTemplate callers for now. | No immediate SQL/OpenAPI change. | Allows PromptTemplate-only path if approved separately. | Requires separate PromptTemplate-only tests and planning. | Fallback only if compatibility strategy for `report_type` is rejected. |

Conservative recommendation: prefer Option B for a future runtime behavior patch. The future patch should keep accepting `report_type` temporarily, not treat it as persisted product state, and move responses toward the existing SQL/OpenAPI contract. If reviewers decide `report_type` is product-critical, switch to a separate SQL/OpenAPI contract patch planning path instead.

## 8. PromptTemplate Variables Future Patch Strategy

| Option | Benefit | Risk | Backward compatibility impact | Contract impact | Repository impact | QA impact | Recommendation |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A. Rename runtime public field from `variables` to `template_variables`. | Directly aligns runtime naming to SQL/OpenAPI. | Abruptly breaks callers/tests using `variables`. | High. | No SQL/OpenAPI change required. | Clear repository mapping after breakage is handled. | Requires broad runtime test updates. | Reject as an abrupt first step. |
| B. Accept both `variables` and `template_variables` temporarily, output canonical `template_variables`. | Preserves request compatibility while aligning responses and future repository shape. | If both fields are sent, conflict behavior must be explicit. | Medium-low if staged. | No SQL/OpenAPI change required. | Best path for repository readiness because canonical storage uses `template_variables`. | Requires tests for legacy input, canonical input, conflict handling, and response shape. | Preferred. |
| C. Keep public `variables` and map internally to `template_variables`. | Preserves current runtime response shape. | Continues OpenAPI drift and may hide contract mismatch. | Low short term, higher long term. | May require contract tolerance or drift documentation. | Repository could map internally, but public drift remains. | Requires tests proving no SQL detail leaks, but still leaves contract ambiguity. | Reject for canonical alignment unless reviewers explicitly preserve legacy response shape. |
| D. Require a contract patch to formalize `variables`. | Preserves runtime naming if desired. | Opens contract scope without evidence that `variables` is the intended canonical name. | Low for runtime, high governance cost. | Requires SQL/OpenAPI planning and review. | Blocks repository until contract changes land. | Requires contract/QA update. | Reject based on current evidence; SQL/OpenAPI already define `template_variables`. |

Conservative recommendation: prefer Option B. A future runtime patch should accept `template_variables` and temporarily accept legacy `variables`. If both are provided and conflict, return the existing validation ErrorModel shape. Public responses should move to canonical `template_variables` unless reviewers explicitly require a staged dual-response period.

## 9. Template Status Future Patch Strategy

Current SQL/OpenAPI define status fields/defaults for templates, while runtime does not set or expose `template_status`.

Future patch recommendations:

- Runtime create should default `template_status` to `draft` for PromptTemplate and ReportTemplate if status is represented in runtime objects.
- Create requests should not accept `template_status` unless the existing OpenAPI request schemas already approve that input.
- List/create responses may include `template_status` only as canonical contract alignment, and tests must prove no response-shape regression surprises strict clients.
- Repository implementation should later rely on SQL defaults only after runtime behavior is explicitly aligned or a repository mapper is approved.
- Status should not be used to introduce archive/delete/update behavior.

Status does not require SQL/OpenAPI changes based on current evidence. It does require reviewer approval for response compatibility before implementation.

## 10. Duplicate And Validation Future Patch Strategy

Future patch direction:

- ReportTemplate duplicate name per workspace should be checked in runtime before insertion, matching SQL uniqueness on `(workspace_id, template_name)`.
- ReportTemplate duplicate errors should map to a safe conflict ErrorModel, likely a dedicated code such as `DUPLICATE_REPORT_TEMPLATE` if approved.
- PromptTemplate duplicate `(workspace_id, template_name, version_number)` behavior already exists and should be preserved.
- PromptTemplate `template_type` should validate against the canonical values: `caption`, `ad_copy`, `image_prompt`, `video_script`, `report`, `reply`.
- ReportTemplate status validation should not be introduced unless status input becomes approved; current recommended status behavior is default-only.
- Error responses must not expose raw SQL, constraint names, enum type names, stack traces, connection strings, hostnames, usernames, passwords, secrets, or workspace existence.

Duplicate handling and enum validation should be tested before any repository implementation is reconsidered.

## 11. Compatibility And Migration Strategy

No SQL or data migration is allowed for this planning track. Runtime compatibility should therefore be staged through request/response policy and tests:

- `report_type`: prefer accepting the old request field temporarily while not treating it as canonical or persisted product state. Response should move toward canonical SQL/OpenAPI shape after review.
- `variables`: prefer accepting both legacy `variables` and canonical `template_variables` temporarily. If both are provided with different values, return validation failure.
- Output shape: prefer canonical SQL/OpenAPI fields, with any legacy alias decision explicitly approved before implementation.
- Deprecation warnings, if any, should be documentation-only unless a separate logging/telemetry decision approves runtime warning behavior.
- Existing tests should be updated in the future implementation PR only to reflect the approved compatibility policy.
- Existing Sprint 0/1/2/3/4, Patch002, Brand, and config behavior must remain unchanged.
- No unrelated routes should be modified.

## 12. Required Tests For A Future Runtime Behavior Patch

Future tests should be planned and implemented only in a separately approved implementation PR. Required coverage may include:

- ReportTemplate create without `report_type` if removal/canonical behavior is approved.
- ReportTemplate create with `report_type` if temporary compatibility is approved.
- ReportTemplate response shape does not expose unapproved `report_type` as canonical.
- ReportTemplate duplicate handling within a workspace.
- ReportTemplate duplicate name allowed across different workspaces if runtime fixtures support it.
- PromptTemplate create with `template_variables`.
- PromptTemplate create with legacy `variables` if compatibility is approved.
- PromptTemplate create with both fields and conflicting values returns validation failure.
- PromptTemplate response shape exposes canonical `template_variables` if approved.
- PromptTemplate invalid `template_type` returns safe validation ErrorModel.
- Status default/response behavior for PromptTemplate and ReportTemplate.
- Body `workspace_id` rejection remains unchanged.
- RBAC allow/deny remains unchanged for `prompt_template.*` and `report_template.*` permissions.
- ErrorModel consistency.
- No raw internal details are exposed.
- Existing strict verification gates still pass.

## 13. Runtime Patch Go / No-Go Criteria

Future runtime behavior patch implementation is GO only if:

- This planning PR is reviewed.
- Exact request/response compatibility policy is approved.
- `report_type` decision is approved.
- `variables` vs `template_variables` decision is approved.
- Status behavior is approved.
- Duplicate/ErrorModel behavior is approved.
- Allowed files and forbidden files are explicit.
- Tests are defined.
- No SQL/OpenAPI changes are needed for the selected patch.
- No repository implementation is mixed in.

Future runtime behavior patch implementation is NO-GO if:

- The selected path requires SQL/OpenAPI changes.
- The selected path would silently drop meaningful `report_type`.
- Response shape would break without staged compatibility.
- ErrorModel mapping is unclear.
- The patch requires repository implementation.
- The patch requires a runtime switch.
- The patch affects Campaign, BriefVersion, Patch002, Brand, or config behavior.
- Sprint 5, Pilot, or Production claims appear.

## 14. Updated Go / No-Go Recommendation

Recommended next path: A. Proceed to Runtime Behavior Patch Implementation PR, but only after this planning PR is reviewed and only as a narrow runtime behavior alignment patch.

Reasoning:

- Current evidence shows SQL/OpenAPI are canonical for template fields.
- `report_type` is not proven product-critical by SQL/OpenAPI/QA evidence.
- The runtime can likely be aligned without SQL/OpenAPI changes by accepting `report_type` temporarily as compatibility input while removing it as canonical state.
- PromptTemplate can likely be aligned by accepting both `variables` and `template_variables` temporarily while moving toward canonical `template_variables`.
- Status defaults, duplicate handling, and enum validation can be added in runtime without repository implementation if tests and compatibility policy are approved.

This is not approval for Slice 2 Template implementation, repository implementation, template runtime switch, SQL/OpenAPI changes, DB-backed full persistence, Sprint 5, Pilot, or Production readiness.

## 15. Final Decision

- Runtime Behavior Patch Planning: GO.
- Runtime Behavior Patch Implementation: CONDITIONAL GO based on evidence.
- Slice 2 Template implementation: NO-GO.
- PromptTemplate runtime alignment: CONDITIONAL GO based on evidence.
- ReportTemplate runtime alignment: CONDITIONAL GO based on evidence.
- SQL/OpenAPI contract patch: NO-GO based on evidence.
- Repository-only first: required if implementation later becomes approved.
- Template runtime switch: NO-GO.
- DB-backed full persistence: NO-GO.
- Campaign persistence: NO-GO.
- BriefVersion persistence: NO-GO.
- Patch002 DB persistence: NO-GO.
- Sprint 5 coding: NO-GO.
- Pilot: NO-GO.
- Production: NO-GO.
