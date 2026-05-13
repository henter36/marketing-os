# Nashir OpenAPI / Audit Naming Reconciliation Gate

## Purpose

This is a documentation-only governance gate for the Nashir audit event naming divergence between runtime behavior and the OpenAPI patch.

This PR does not implement runtime behavior, modify tests, change OpenAPI YAML, change SQL, expand RBAC, update generated clients, add routes, add UI, or approve Sprint 5, Pilot, or Production readiness.

## Task Classification

Documentation-only governance gate.

## Approved Sources Used

- `AGENTS.md`
- `README.md`
- `docs/17_change_log.md`
- `docs/03_decision_log.md`
- `docs/nashir_status_after_create_route.md`
- `docs/nashir_create_route_implementation_report.md`
- `docs/nashir_create_route_preimplementation_constraints.md`
- `docs/nashir_nondisclosing_membership_guard_refactor_report.md`
- `docs/nashir_openapi_patch.yaml`
- `src/router.js`
- `test/nashir-route.test.js`
- `test/nashir-prewiring-contract.test.js`

No approved source conflict was identified. The runtime/OpenAPI audit naming difference is a known divergence that this gate records and constrains before any future implementation change.

## Current Divergence

After PR #191 and PR #193, the current state is:

| Surface | Current value |
|---|---|
| Runtime audit event | `nashir_campaign.created` |
| OpenAPI patch audit extension | `x-audit-event: nashir.campaign.created` |

`docs/nashir_openapi_patch.yaml` is not modified by this PR.

## Why This Matters

This divergence must be resolved or explicitly accepted before related implementation continues because:

- future implementation could silently follow the wrong source;
- audit logs, OpenAPI documentation, implementation reports, tests, and generated clients may diverge;
- evidence, approval, scoring/readiness, and publishing-adjacent planning will likely need audit event names too;
- inconsistent audit naming makes future ErrorModel, QA, and compliance review harder to trace.

## Options Evaluated

### Option A: Align Future OpenAPI To Runtime Snake Case

Future OpenAPI/audit reconciliation would change the OpenAPI audit extension from `nashir.campaign.created` to `nashir_campaign.created`.

Benefits:

- aligns OpenAPI with currently implemented and tested runtime behavior;
- avoids route/runtime behavior changes;
- follows the create route implementation report and pre-implementation constraints;
- gives future generated-client and audit consumers one canonical value.

Risks:

- requires a separately approved OpenAPI YAML change;
- requires strict OpenAPI lint and focused review to confirm only the audit extension changed.

### Option B: Keep OpenAPI Dotted Naming And Map Runtime Separately

Future implementation would keep `x-audit-event: nashir.campaign.created` and add a mapping layer between OpenAPI naming and runtime audit naming.

Benefits:

- preserves the current OpenAPI patch text.

Risks:

- adds indirection for a single known divergence;
- creates two canonical-looking audit names;
- may require runtime or generated-client mapping changes;
- increases the chance that future evidence, approval, and scoring audit events copy the wrong convention.

### Option C: Adopt A Nashir-Specific Dotted Event Convention

Future implementation would move Nashir runtime audit events toward dotted names such as `nashir.campaign.created`.

Benefits:

- aligns runtime with the existing OpenAPI patch value.

Risks:

- changes already implemented and tested runtime audit behavior;
- could invalidate current implementation reports and status records;
- may require route/test/runtime edits outside an OpenAPI-only reconciliation;
- increases scope before any evidence, approval, or scoring route gate.

## Recommendation

Prefer Option A.

A future narrow OpenAPI/audit reconciliation PR should align the OpenAPI audit extension with the implemented runtime snake_case audit event `nashir_campaign.created`, subject to a separate implementation request with exact allowed files, forbidden files, and verification gates.

This PR is not that implementation PR. It does not modify OpenAPI YAML.

## Future Implementation Gate Requirements

A future OpenAPI/audit naming reconciliation PR may be considered only after this gate merges and only with explicit scope.

Candidate allowed files for that future PR:

- `docs/nashir_openapi_patch.yaml`;
- a focused OpenAPI/audit naming implementation report under `docs/`;
- `docs/03_decision_log.md`;
- `docs/17_change_log.md`;
- focused tests, including `test/nashir-prewiring-contract.test.js` where needed, only if the future PR explicitly requires test updates to assert the OpenAPI audit extension.

Candidate forbidden files for that future PR unless separately approved:

- `src/`;
- route behavior files;
- `test/` files unrelated to OpenAPI/audit naming checks;
- SQL/schema/migration files;
- `src/rbac.js`;
- DB-backed persistence files;
- generated clients;
- package files and lockfiles;
- `.github/workflows/`;
- `scripts/`;
- `prototype/`;
- UI files.

Required verification for that future PR:

- `git diff --name-only`;
- `git diff --check`;
- `git status --short`;
- strict OpenAPI lint, expected command: `npm run openapi:lint:strict`;
- focused OpenAPI/audit naming tests if the future PR updates or adds them;
- no route behavior change check through diff review and, if runtime tests are in scope, `node --test test/nashir-route.test.js` and `node --test test/nashir-prewiring-contract.test.js`.

Required acceptance checks for that future PR:

- only the approved OpenAPI/audit naming surface changes;
- no Nashir route behavior changes;
- no runtime audit event change unless separately approved;
- no generated-client update unless separately gated;
- strict OpenAPI lint passes;
- documentation records whether the divergence was reconciled or intentionally accepted.

## Remaining NO-GO

The following remain NO-GO in this PR:

- route changes;
- runtime behavior changes;
- SQL/schema/migration changes;
- RBAC expansion;
- DB-backed Nashir persistence;
- evidence route implementation;
- approval transition or route implementation;
- scoring/readiness route implementation;
- publishing workflow implementation;
- generated-client changes;
- package/workflow changes;
- Sprint 5;
- Pilot;
- Production.

## Recommended Next Step

After this gate merges, open a narrow OpenAPI/audit naming reconciliation PR only if needed.

Do not proceed to evidence, approval, scoring/readiness, or publishing implementation until this naming divergence is reconciled or explicitly accepted by a separate gate.

## GO / NO-GO Decision

GO: Documentation-only governance gate for the Nashir OpenAPI/audit naming divergence.

GO: Future recommendation to align OpenAPI with runtime `nashir_campaign.created` only through a separately approved OpenAPI/audit reconciliation PR.

NO-GO: OpenAPI YAML modification in this PR.

NO-GO: Runtime, route, test, SQL, RBAC, DB persistence, generated-client, package, workflow, script, migration, prototype, UI, evidence, approval, scoring/readiness, publishing, Sprint 5, Pilot, or Production changes in this PR.
