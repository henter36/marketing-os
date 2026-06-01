# Nashir OpenAPI Canonical Source Migration Review Gate

| Field | Value |
|---|---|
| Gate type | OpenAPI canonical source migration review gate — documentation only |
| Status | Review complete |
| Date | 2026-06-01 |
| Scope | Reviews and closes PR #274 (Nashir canonical OpenAPI source migration/update) before any Generated Types Input Update Gate or UI API Integration Planning Gate begins |
| Prerequisite gates | `docs/nashir_openapi_migration_review_gate.md` — merged (PR #273); `docs/nashir_openapi_migration_planning_gate.md` — merged (PR #272) |
| Implementation reviewed | PR #274 — openapi: establish Nashir canonical source |
| OpenAPI YAML changes in this PR | NO |
| Generated types in this PR | NO |
| UI integration in this PR | NO |
| Runtime changes in this PR | NO |
| src/router.js changes in this PR | NO |

---

## 1. Status

This is a documentation-only review gate.

**This gate reviews PR #274 canonical OpenAPI migration/update. It does not perform or approve any further implementation.**

**No OpenAPI YAML changes are approved by this document.**

**No generated types are approved by this document.**

**No UI API integration is approved by this document.**

**No runtime code, test, SQL, package, or workflow changes are made by this document.**

This gate answers:

> Is the Nashir OpenAPI Canonical Source Migration/Update (PR #274) correct, complete, safe, and ready to unblock the Generated Types Input Update Gate?

---

## 2. Reviewed Inputs

### Verified — henter36/marketing-os (local)

| Source | Finding |
|---|---|
| `docs/nashir_v1_openapi.yaml` | **Present** — 887-line canonical Nashir V1 OpenAPI file created by PR #274; `openapi: 3.1.0`; describes itself as authoritative marketing-os canonical; explicitly states nashir-ui-prototype is read-only reference and nashir_openapi_patch.yaml is historical only |
| `scripts/openapi-lint.js` | **Updated by PR #274** — `nashirCanonicalPath` added; strict mode requires canonical file existence; canonical file loaded whenever it exists (both strict and non-strict); patch002 also loaded when present (Gemini remediation included) |
| `src/router.js` implementedRoutes | **Updated by PR #274** — 3 store/product GET route strings added to `nashirRoutes`/`implementedRoutes`; no handler, auth, permission, repository, or response logic changed; confirmed via `git show 787dabe -- src/router.js` diff |
| `test/nashir-prewiring-contract.test.js` | **Updated by PR #274** — whitelist updated to include `nashir_v1_openapi.yaml`; two new strips added for `nashir_v1_openapi\.yaml` and `canonical Nashir`; all existing prewiring protections intact |
| `docs/03_decision_log.md` — D-158 | **Present** — date 2026-06-01; establishes docs/nashir_v1_openapi.yaml as canonical; lists all 6 changed files accurately; correctly records no generated types, UI integration, write routes, or runtime behavior changes |
| `docs/17_change_log.md` — 2026-06-01 row | **Present** — entry accurately describes PR #274 scope; records db:migrate:strict DATABASE_URL note |

### PR #274 — 6 files changed (including Gemini lint remediation)

| File | Change | Relevant to review |
|---|---|---|
| `docs/nashir_v1_openapi.yaml` | Created (887 lines) | PRIMARY — canonical source |
| `scripts/openapi-lint.js` | +11, -1 | Lint alignment |
| `src/router.js` | +7, -4 | implementedRoutes list only |
| `test/nashir-prewiring-contract.test.js` | +8, -1 | Whitelist + strips |
| `docs/03_decision_log.md` | +1 | D-158 decision record |
| `docs/17_change_log.md` | +1 | Change log entry |

### Verification results (run during this review)

| Command | Result |
|---|---|
| `npm test` | **719 pass, 0 fail** |
| `npm run openapi:lint` | **PASSED** — OpenAPI lightweight lint passed: 97 declared permissions checked |
| `npm run openapi:lint:strict` | **PASSED** — OpenAPI strict lint passed: 104 declared permissions checked |
| `npm run verify:strict` (non-DB) | **PASSED** — Sprint 0 baseline present; OpenAPI strict lint passed; all tests pass |
| `npm run db:migrate:strict` | **BLOCKED** — `DATABASE_URL is required for strict Sprint 0 migration execution.` — environment constraint, not code |

---

## 3. Review Criteria Assessment

| Criterion | Status | Evidence |
|---|---|---|
| `docs/nashir_v1_openapi.yaml` exists in marketing-os | **PASS** | File present at expected canonical path |
| `docs/nashir_v1_openapi.yaml` is treated as canonical Nashir V1 OpenAPI source | **PASS** | File header explicitly states authority; D-158 records it; lint requires it in strict mode |
| `scripts/openapi-lint.js` requires canonical Nashir spec in strict mode | **PASS** | `if (strict && !existsSync(nashirCanonicalPath)) { process.exit(1); }` present at line 29 |
| `scripts/openapi-lint.js` loads canonical Nashir spec in non-strict mode when present | **PASS** | `const nashirCanonical = existsSync(nashirCanonicalPath) ? readFileSync(...) : "";` — loads whenever file exists |
| nashir-ui-prototype is not used as a contract source | **PASS** | nashirCanonicalPath points to `docs/nashir_v1_openapi.yaml` in marketing-os; no reference to nashir-ui-prototype path in lint |
| `docs/nashir_openapi_patch.yaml` is not treated as a competing canonical source | **PASS** | File header of canonical explicitly states `nashir_openapi_patch.yaml` is historical only; patch is still loaded in strict mode for backward compat but is not described as canonical |
| All 8 implemented Nashir paths are covered (10 operations) | **PASS** | 8 paths confirmed in canonical YAML: `/nashir-store-profile`, `/nashir-products`, `/nashir-products/{productId}`, `/nashir-campaigns`, `/nashir-campaigns/{id}`, `/nashir-campaigns/{id}/readiness`, `/nashir-campaigns/{id}/evidence`, `/nashir-campaigns/{id}/evidence/{evidenceId}` |
| Store/Profile and Product routes are GET-only | **PASS** | No `post:`, `put:`, `patch:`, or `delete:` under `/nashir-store-profile` or `/nashir-products` paths; confirmed by inspection |
| No Store/Product write routes exist in OpenAPI | **PASS** | POST operations are only under `/nashir-campaigns` (createNashirCampaign) and `/nashir-campaigns/{id}/evidence` (submitNashirCampaignEvidence) |
| operationIds are unique and stable | **PASS** | 10 operationIds: getNashirStoreProfile, listNashirProducts, getNashirProduct, listNashirCampaigns, createNashirCampaign, getNashirCampaign, getNashirCampaignReadiness, listNashirCampaignEvidence, submitNashirCampaignEvidence, getNashirCampaignEvidence — all unique |
| x-permission values align with current RBAC | **PASS** | All 10 x-permission values are in `src/rbac.js`: `nashir.store.read`, `nashir.product.read`, `nashir.campaign.read`, `nashir.campaign.write` — all are active V1 codes |
| No new nashir.* permissions were introduced | **PASS** | Only 4 distinct permission codes used; all pre-exist in `src/rbac.js` |
| Store/Profile route uses nashir.store.read | **PASS** | `getNashirStoreProfile` — `x-permission: nashir.store.read` ✓ |
| Product list/by-id routes use nashir.product.read | **PASS** | `listNashirProducts` and `getNashirProduct` — both `x-permission: nashir.product.read` ✓ |
| ProductId is UUID-format; invalid UUID is non-disclosing 404/null, not PostgreSQL 500 | **PASS** | `NashirProductId` parameter: `schema.type: string, format: uuid`; `x-generic-404` note documents non-disclosing 404 for invalid UUID productId |
| GET routes have no request bodies | **PASS** | `x-no-request-body: true` on all GET operations; no `requestBody` field in any GET operation |
| Response schemas use public camelCase fields | **PASS** | `NashirStoreProfile` and `NashirProduct` schemas use camelCase (storeProfileId, storeName, productId, productName, etc.) matching repository output |
| Internal DB snake_case fields are not exposed | **PASS** | No `store_profile_id`, `product_id`, `product_name`, etc. in new schemas; campaign/evidence schemas retain existing snake_case for backward compat (unchanged from patch) |
| Secrets, tokens, raw credentials, or vault refs are not exposed | **PASS** | No credential-related fields in any schema; file header explicitly excludes vault refs and raw integration data |
| ErrorModel/ErrorResponse behavior is consistent | **PASS** | ErrorModel schema matches existing definition; ErrorResponse uses same shape; error codes are consistent with `src/error-model.js` |
| `src/router.js` changed only implementedRoutes/list metadata and comments | **PASS** | `git show` diff confirms only: (a) comment updated, (b) comma added, (c) 3 route strings appended to nashirRoutes array — no function bodies touched |
| No route handlers changed | **PASS** | `routeNashirStore`, `isNashirStorePath`, all guard/auth/membership/permission/error/response logic untouched |
| No auth, membership, RBAC, repository, service, error, or response behavior changed | **PASS** | Only files changed are YAML, lint script, router list, prewiring test, decision log, change log |
| No generated clients/types were created | **PASS** | No generated files in PR #274 diff |
| No UI integration occurred | **PASS** | No `ui/` files changed |
| No SQL/migration/package/workflow changes occurred | **PASS** | No SQL, migrations, package.json, package-lock.json, or workflow files in PR #274 diff |
| No pilot or production readiness was claimed | **PASS** | No such claims in canonical YAML description or decision log entry |

**All 28 criteria: PASS.**

---

## 4. Findings

**Finding 1 — Canonical Nashir V1 OpenAPI source is now established in marketing-os.**

`docs/nashir_v1_openapi.yaml` exists, is referenced by `scripts/openapi-lint.js` as the canonical source, and is described correctly in its own header. D-158 records the decision accurately.

**Finding 2 — Store/Profile and Product GET routes are now contract-covered.**

The three Backend Slice 0 routes (`getNashirStoreProfile`, `listNashirProducts`, `getNashirProduct`) are declared in the canonical YAML with correct permissions, correct response shapes (camelCase matching repository output), correct non-disclosing 404 documentation, and no write operations.

**Finding 3 — OpenAPI lint now validates against canonical Nashir source in both strict and non-strict modes.**

The Gemini non-strict lint issue was correctly remediated: `nashirCanonical` and `patch002` are now loaded based on file existence rather than strict-mode flag. Both `npm run openapi:lint` and `npm run openapi:lint:strict` pass.

**Finding 4 — src/router.js alignment remained list-only.**

The PR touches only the `nashirRoutes` array and a comment. No handler logic, guard chain, auth, membership, permission, error model, or response behavior was modified.

**Finding 5 — No generated types or UI integration are authorized yet.**

The canonical YAML explicitly states both are separate future gates. D-158 records the same boundary.

---

## 5. Risks

| Risk | Severity | Mitigation |
|---|---|---|
| Generated types begin before this review gate merges | **HIGH** — unreviewed contract errors become client-facing | Resolved by merging this gate before Generated Types Input Update Gate |
| `docs/nashir_openapi_patch.yaml` is later treated as canonical | **MEDIUM** — duplicate authority risk returns | Canonical YAML header and D-158 explicitly state patch is historical only; lint now loads canonical as primary source |
| UI integrates before generated types readiness | **HIGH** — UI may invent fields or call wrong paths | Section 12 prerequisites in D-156 planning gate require types gate before UI integration |
| `src/router.js` is edited beyond implementedRoutes in future OpenAPI PRs | **MEDIUM** — runtime behavior could change inside contract work | D-158 records the constraint; src/router.js boundary check confirmed for this PR |
| OpenAPI expands beyond implemented routes | **LOW** — may falsely imply backend readiness for unimplemented paths | Canonical YAML out-of-scope section explicitly lists forbidden route categories; review process provides the guard |

---

## 6. Required Corrections Before Generated Types

**No blocking corrections are required.**

All 28 review criteria pass. The canonical source is correctly established, lint validation is aligned, implementedRoutes alignment is list-only, and no forbidden changes were introduced.

**Note:** The canonical YAML campaign/evidence schemas retain the snake_case field style from the existing `nashir_openapi_patch.yaml` (e.g., `nashir_campaign_id`, `workspace_id`). The new Store/Profile and Product schemas use camelCase to match repository output. This style difference is non-blocking — it mirrors the existing codebase pattern where campaign repository returns snake_case and evidence/store/product repositories return camelCase. Future schema harmonization may be desirable but is not required before Generated Types Input Update Gate.

---

## 7. Review Decision

| Dimension | Decision |
|---|---|
| `docs/nashir_v1_openapi.yaml` established as canonical | **ACCEPT** |
| OpenAPI lint alignment correct | **ACCEPT** |
| Store/Profile and Product GET route coverage | **ACCEPT** |
| implementedRoutes list alignment only | **ACCEPT** |
| No generated types or UI integration | **CONFIRMED** |
| No blocking corrections required | **CONFIRMED** |
| **GO to prepare Generated Types Input Update Gate** | **GO** |
| OpenAPI YAML changes in this PR | **NO-GO** |
| Generated types in this PR | **NO-GO** |
| UI API integration in this PR | **NO-GO** |
| Runtime behavior changes | **NO-GO** |

---

## 8. Next Gate Authorization

This review gate authorizes the preparation of:

**Generated Types Input Update Gate**

That gate may plan and, if approved within its own scope:

| Item | Authorized? |
|---|---|
| Exact generated types destination path | YES — pending gate |
| Generation command or script targeting `docs/nashir_v1_openapi.yaml` | YES — pending gate |
| Source input for generation = `docs/nashir_v1_openapi.yaml` | YES |
| `package.json` generation script update | CANDIDATE — requires explicit approval in that gate |
| `docs/03_decision_log.md` and `docs/17_change_log.md` | YES |

This review gate itself does **not** authorize generated types, UI integration, or any runtime changes.

---

## 9. NO-GO Boundaries

```text
NO-GO: Any OpenAPI YAML changes in this PR.
NO-GO: Generated clients or types in this PR.
NO-GO: UI API integration.
NO-GO: Runtime route or handler changes.
NO-GO: src/router.js changes beyond implementedRoutes alignment.
NO-GO: scripts/openapi-lint.js changes in this PR.
NO-GO: Store/Product write routes.
NO-GO: Creator Studio backend.
NO-GO: Publishing, integrations, model/provider runtime.
NO-GO: Analytics runtime.
NO-GO: SQL/migrations.
NO-GO: Package or workflow changes.
NO-GO: Any change to nashir-ui-prototype.
NO-GO: Pilot or production readiness claims.
NO-GO: Any change to src/, test/, or scripts/ in this PR.
```

---

## 10. Verification

| Command | Result |
|---|---|
| `npm test` | **719 pass, 0 fail** |
| `npm run openapi:lint` | **PASSED** — OpenAPI lightweight lint passed: 97 declared permissions checked |
| `npm run openapi:lint:strict` | **PASSED** — OpenAPI strict lint passed: 104 declared permissions checked |
| `npm run verify:strict` (non-DB) | **PASSED** — Sprint 0 baseline present; OpenAPI strict lint passed; 719 unit tests pass; 52 integration tests pass |
| `npm run db:migrate:strict` | **BLOCKED** — `DATABASE_URL is required for strict Sprint 0 migration execution.` — environment constraint, not code |
| `git status --short` | Only new docs files: `docs/nashir_openapi_canonical_source_migration_review_gate.md` untracked; `docs/03_decision_log.md` and `docs/17_change_log.md` modified |
| Forbidden files check | **PASS** — no OpenAPI YAML, src/, test/, SQL, package, generated, or prototype files modified in this review gate PR |

---

## 11. GO / NO-GO Result

| Decision | Status |
|---|---|
| **Review gate complete** | **GO** |
| **CONDITIONAL GO: Generated Types Input Update Gate** | After this review gate merges |
| UI API integration | **NO-GO** (until Generated Types Input Update Gate and UI API Integration Planning Gate) |
| Generated clients/types in this PR | **NO-GO** |
| Runtime behavior changes | **NO-GO** |
| OpenAPI YAML changes | **NO-GO** |
| Production/pilot readiness | **NO-GO** |
