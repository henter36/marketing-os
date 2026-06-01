# Nashir UI API Integration Planning Gate

| Field | Value |
|---|---|
| Gate type | UI API integration planning gate — documentation only |
| Status | Draft |
| Date | 2026-06-01 |
| Scope | Plans how Nashir UI API integration should proceed after canonical OpenAPI (PR #274) and generated TypeScript types (PR #278) are established, without implementing any UI or API integration in this PR |
| Prerequisite gates | `docs/nashir_generated_types_implementation_review_gate.md` — merged (PR #279) |
| UI implementation | NO |
| API integration | NO |
| Runtime client | NO |
| Generated client | NO |
| Backend runtime changes | NO |
| Package changes | NO |

---

## 1. Status

This is a documentation-only planning gate.

**No UI implementation is approved in this PR.**

**No API integration is approved in this PR.**

**No runtime client is approved in this PR.**

**No generated client is approved in this PR.**

**No backend runtime changes are approved in this PR.**

**No package, SQL, migration, workflow, or production/pilot changes are made.**

This gate answers:

> How should Nashir UI API integration proceed, against which endpoints, in which UI surface, using which contract inputs, and with what explicit out-of-scope boundaries?

---

## 2. Current Approved Inputs

### Verified facts

| Input | Status |
|---|---|
| `docs/nashir_v1_openapi.yaml` | Canonical Nashir V1 OpenAPI source — established by PR #274, reviewed by PR #275 |
| `generated/nashir-api-types/` | Reviewed types-only contract artifact — implemented by PR #278, reviewed by PR #279 |
| Store Profile GET route (`GET /workspaces/{workspaceId}/nashir-store-profile`) | Implemented, tested, workspace-isolated |
| Products list GET route (`GET /workspaces/{workspaceId}/nashir-products`) | Implemented, tested, workspace-isolated |
| Products by-id GET route (`GET /workspaces/{workspaceId}/nashir-products/{productId}`) | Implemented, tested, workspace-isolated |
| `ui/nashir/` in marketing-os | Exists: `index.html`, `app.js`, `styles.css` — static, standalone, currently not API-connected |
| nashir-ui-prototype | Read-only reference for screens, flows, and UX intent only — not contract authority |
| Runtime API client | Does not exist |
| UI API integration | Has not started |
| Store/Product write routes | NO-GO — not implemented |
| Backend campaign routes | Implemented but not in current first integration scope |

---

## 3. Problem Statement

1. **Field drift risk.** Without a planning gate, UI integration may start from nashir-ui-prototype screen fields that differ from the canonical API contract, causing backend/UI mismatch that is not caught until runtime.

2. **Runtime assumptions.** Generated types are compile-time declarations only. They do not provide fetch or client behavior. Directly calling endpoints without planning may introduce unsafe runtime assumptions about response shapes or error handling.

3. **UI prototype authority confusion.** nashir-ui-prototype is a read-only UX reference. If UI integration starts there, it may reinstate nashir-ui-prototype as an authority source, contradicting D-156 through D-163.

4. **Scope expansion risk.** Without explicit endpoint scoping, UI affordances for write operations (create product, update profile) may be accidentally wired before write routes are approved.

5. **Implementation target ambiguity.** marketing-os has an existing static `ui/nashir/` surface. Without planning, a developer may implement integration in either the wrong surface or the wrong repo, splitting implementation authority.

---

## 4. Decision Questions

| Question | Planning answer |
|---|---|
| Should first UI API integration happen in `ui/nashir/` (marketing-os) or nashir-ui-prototype? | `ui/nashir/` in marketing-os — see Section 7 |
| Which UI screens are eligible for first integration? | Store Profile display, Products list, Product detail read — see Section 9 |
| Which endpoints are eligible? | The three approved Backend Slice 0 GET routes — see Section 8 |
| How should generated types be consumed without runtime client? | As compile-time type imports in the UI; direct `fetch` calls for the three GET routes |
| Should runtime client be implemented now? | Deferred — not required for read-only slice |
| What is the minimum integration slice? | Store Profile GET + Products list GET as the first slice |
| What verification is required? | See Section 12 |
| What remains out of scope? | See Section 8 (not eligible endpoints) and Section 15 (NO-GO list) |

---

## 5. Integration Target Options

### Option A — Integrate API into `ui/nashir/` in marketing-os only

Implement API calls in the existing `ui/nashir/app.js` targeting the three eligible GET routes, consuming `generated/nashir-api-types/` as a type reference.

### Option B — Integrate API into nashir-ui-prototype

Implement API calls in nashir-ui-prototype, calling marketing-os backend routes from the prototype UI.

### Option C — Keep nashir-ui-prototype as reference and implement in `ui/nashir/` later

Document the plan but defer any file changes to a separately approved implementation gate.

### Option D — Generate runtime client first, then integrate UI

Implement a generated runtime API client before touching any UI files.

### Option E — Defer UI API integration entirely

Make no implementation plans at this time.

---

## 6. Option Evaluation

| Criterion | Option A | Option B | Option C | Option D | Option E |
|---|---|---|---|---|---|
| Governance safety | HIGH — marketing-os owns both backend and UI surface | LOW — splits authority | HIGH — deferred safely | MEDIUM — client-first risk | HIGH — deferred safely |
| Contract alignment | HIGH — uses canonical types and OpenAPI | MEDIUM — prototype may drift | HIGH | MEDIUM | DEFERRED |
| Repo ownership clarity | STRONG — single repo | WEAK — split repos | STRONG | MODERATE | N/A |
| Implementation risk | LOW for read-only GET slice | MEDIUM — cross-repo | NONE | MEDIUM — runtime client risk | NONE |
| UI readiness | `ui/nashir/` exists and is served | Prototype has screens but not governance authority | BLOCKED until later gate | BLOCKED on client first | BLOCKED |
| Backend readiness | GET routes are implemented and tested | Same | Same | Same | Same |
| Generated types readiness | Types exist and are reviewed | Not applicable | Types available for later | Types available | Types available |
| Runtime client risk | NONE — direct fetch only | NONE — but prototype risk | NONE | MEDIUM — new client behavior | NONE |
| V1 scope control | STRONG — read-only only | WEAK — write affordances in prototype | STRONG | MODERATE | STRONG |
| Reviewability | STRONG — single PR, single repo | WEAK — cross-repo | STRONG | MODERATE | N/A |
| Long-term maintainability | STRONG — contract and UI in same repo | WEAK — divergence risk | STRONG | MODERATE | DEFERRED |
| **Verdict** | **RECOMMENDED** | **REJECTED** | **ACCEPTABLE (conservative)** | **DEFER** | **REJECTED** |

---

## 7. Recommended Decision

**Recommend Option A with Option C sequencing: plan first integration for `ui/nashir/` in marketing-os, implemented in a later gate.**

### Rationale

1. `ui/nashir/` already exists as a serving-verified static surface in marketing-os (PRs #259, #263). It is the correct implementation target.
2. marketing-os owns the backend, canonical OpenAPI, generated types, and serving infrastructure. Keeping UI integration in the same repo avoids split authority.
3. nashir-ui-prototype screens inform the UX intent but must not be the implementation target.
4. A read-only first slice (Store Profile + Products) is achievable with three `fetch` calls and the existing `{ data: ... }` response envelope pattern already handled in `ui/nashir/app.js`.
5. A dedicated implementation gate must approve exact files, test strategy, and fetch helper scope before any code is written.

### Clarifications — this planning gate does NOT

- Write or modify any `ui/nashir/` file.
- Add any API call, fetch wrapper, or HTTP client.
- Modify any backend route, service, repository, or runtime file.
- Change `generated/nashir-api-types/`, `scripts/generate-nashir-types.js`, or `docs/nashir_v1_openapi.yaml`.
- Authorize integration implementation.

---

## 8. First Eligible API Scope

### Eligible future endpoints (Backend Slice 0 GET routes only)

| Endpoint | Method | Permission | Response schema |
|---|---|---|---|
| `/workspaces/{workspaceId}/nashir-store-profile` | GET | `nashir.store.read` | `NashirStoreProfileResponse` → `{ data: NashirStoreProfile }` |
| `/workspaces/{workspaceId}/nashir-products` | GET | `nashir.product.read` | `NashirProductListResponse` → `{ data: NashirProduct[] }` |
| `/workspaces/{workspaceId}/nashir-products/{productId}` | GET | `nashir.product.read` | `NashirProductResponse` → `{ data: NashirProduct }` |

### Explicitly not eligible in first slice

| Category | Reason |
|---|---|
| Store Profile write routes | Not implemented; NO-GO |
| Product create/update/delete | Not implemented; NO-GO |
| Campaign write/generation routes | Out of scope for UI integration first slice |
| Nashir campaign read routes | Eligible in a later slice; not in first slice |
| Creator Studio backend | Not implemented; NO-GO |
| Publishing queue runtime | Not implemented; NO-GO |
| External integrations | Not implemented; NO-GO |
| Provider/model routing runtime | Not implemented; NO-GO |
| Analytics runtime | NO-GO |
| Pilot/production readiness behavior | NO-GO |

---

## 9. First Eligible UI Scope

The following UI surfaces in `ui/nashir/` are candidates for the first integration slice. **No file is approved by this planning gate.** Exact files and implementation approach must be approved in a later gate.

| UI Surface | Candidate integration | Notes |
|---|---|---|
| Store Setup / Store Profile display | Fetch store profile; display `storeName`, `storeUrl`, `storeProfileStatus` | First priority; most foundational |
| Product Catalog / Products list | Fetch product list; display `productName`, `productStatus`, `productUrl` | Second priority after store profile |
| Product detail read-only | Fetch product by id if screen exists | Only if a product detail screen exists in `ui/nashir/` |
| Dashboard summary | Depends on store + product count data | Defer to a later slice |

### Constraints

- UI must not invent API contract fields outside `generated/nashir-api-types/`.
- UI must not expose user-facing fields not backed by the API contract unless clearly marked as static/placeholder.
- UI must handle 401, 403, 404, and generic error states using `ErrorModel` shape.
- UI must use the `{ data: ... }` response envelope pattern already present in `ui/nashir/app.js`.
- UI must not add write affordances (create/update/delete) for store or products in the first integration slice.

---

## 10. Generated Types Consumption Boundary

**Important: `ui/nashir/` is a static, no-build, vanilla JavaScript environment.** There is no bundler, transpiler, or TypeScript compilation step. Normal `import` statements for TypeScript declaration files (`.d.ts`) do not function at runtime in this environment and must not be used in `ui/nashir/app.js`.

| Rule | Detail |
|---|---|
| `generated/nashir-api-types/` is a type reference only | May be referenced via JSDoc type comments for compile-time/editor annotations in the static no-build `ui/nashir/app.js` environment; does not provide runtime fetch behavior |
| JSDoc type comments are the only permitted consumption pattern | Example: `/** @type {import("../../generated/nashir-api-types").NashirStoreProfile} */` — this is a comment only; no runtime import occurs |
| JSDoc references must remain comments | Must not introduce `import`/`require` statements, bundling, transpilation, TypeScript compilation, or build steps in `ui/nashir/` |
| No runtime client exists | No `fetch`, `axios`, or generated SDK client; future UI calls must use direct `fetch` against approved endpoints |
| Any fetch helper must be separately approved | If a lightweight fetch utility is proposed, it must be: explicit, typed (via JSDoc), read-only, scoped to the three eligible GET endpoints, and approved in the implementation gate |
| No broad API SDK is approved | A full API client SDK is not approved for V1 |
| Any future build step requires a separate gate | Any bundler, TypeScript compiler, or transpiler for `ui/nashir/` requires an explicit separate gate before it may be introduced |
| Freshness check must pass | `npm run generate:nashir-types:check` must pass before any integration references the generated types |

---

## 11. Future Implementation Gate Candidate Files

For a future Nashir UI API Integration Implementation Gate, candidate allowed files may include:

| File | Purpose | Status |
|---|---|---|
| `ui/nashir/app.js` | Add fetch calls for eligible GET routes | CANDIDATE — exact changes to be reviewed |
| `ui/nashir/index.html` | Any structural or markup changes needed | CANDIDATE — only if required |
| `ui/nashir/styles.css` | Any style changes for loaded states | CANDIDATE — only if required |
| `generated/nashir-api-types/` | Imported as type source only; must not be modified | READ-ONLY reference |
| A small `ui/nashir/api.js` or similar fetch helper | Only if explicitly approved as separate file | CANDIDATE — requires explicit gate approval |
| `docs/03_decision_log.md` | Record the integration implementation | CANDIDATE |
| `docs/17_change_log.md` | Record integration completion | CANDIDATE |

**Not approved now:** All of the above are candidates only. The implementation gate must re-approve exact allowed files. nashir-ui-prototype files are not approved.

---

## 12. Required Future Verification

The future implementation gate must run:

```bash
npm run generate:nashir-types:check
npm test
npm run openapi:lint
npm run openapi:lint:strict
npm run verify:strict
git status --short
```

Additionally, if static serving tests exist:

```bash
node --test test/nashir-static-serving.test.js
```

If `DATABASE_URL` is missing:

```text
db:migrate:strict blocked by missing DATABASE_URL — environment constraint, not code
```

---

## 13. Risks

| Risk | Severity | Mitigation |
|---|---|---|
| UI integration without scope approval turns mock screens into misleading live behavior | **HIGH** | Implementation gate must approve exact scope before any code changes |
| Consuming generated types without freshness checks can cause drift | **MEDIUM** | `generate:nashir-types:check` required in implementation gate verification |
| Adding a runtime client too early creates unsupported API surface | **MEDIUM** | Runtime client is explicitly deferred; direct `fetch` for GET routes only in first slice |
| Integrating with nashir-ui-prototype splits implementation authority | **HIGH** | Option B rejected; Option A (marketing-os `ui/nashir/`) is the only approved target |
| Store/Product write affordances may be accidentally wired | **HIGH** | Section 8 explicitly prohibits write routes; implementation gate must verify absence |
| Dashboard integration creates aggregation assumptions | **MEDIUM** | Dashboard is explicitly deferred to a later slice |
| Using prototype screen fields as API fields breaks contract governance | **HIGH** | Section 9 constrains UI to fields in `generated/nashir-api-types/` only |

---

## 14. Required Corrections Before Implementation

No corrections are required before the UI API Integration Planning Review Gate proceeds.

The following conditions must be resolved before any UI API Integration Implementation Gate:

1. This planning gate and a review gate must merge first.
2. Exact `ui/nashir/` files to be modified must be explicitly listed and approved.
3. Any proposed fetch helper approach must be described and approved.
4. `npm run generate:nashir-types:check` must pass.
5. The integration must remain read-only (GET routes only); no write affordances.

If any of these conditions is not met, the implementation gate must remain NO-GO.

---

## 15. NO-GO Boundaries

```text
NO-GO: UI implementation in this PR.
NO-GO: API calls in this PR.
NO-GO: Runtime client in this PR.
NO-GO: Generated client in this PR.
NO-GO: generated/nashir-api-types/ changes in this PR.
NO-GO: package.json changes in this PR.
NO-GO: package-lock.json changes.
NO-GO: npm dependency additions.
NO-GO: OpenAPI YAML changes.
NO-GO: Backend runtime changes.
NO-GO: src/router.js changes.
NO-GO: scripts/openapi-lint.js changes.
NO-GO: SQL or migrations.
NO-GO: Workflows.
NO-GO: Any changes to nashir-ui-prototype.
NO-GO: Store/Product write routes.
NO-GO: Creator Studio backend.
NO-GO: Publishing, integrations, model/provider runtime.
NO-GO: Analytics runtime.
NO-GO: Pilot or production readiness.
```

---

## 16. GO / NO-GO Result

| Decision | Status |
|---|---|
| **This planning gate (documentation only)** | **GO** |
| UI implementation in this PR | **NO-GO** |
| API calls in this PR | **NO-GO** |
| Runtime client in this PR | **NO-GO** |
| Package/tooling changes in this PR | **NO-GO** |
| Backend runtime changes | **NO-GO** |
| **CONDITIONAL GO later: UI API Integration Planning Review Gate** | After this planning gate merges |
| **CONDITIONAL GO later: UI API Integration Implementation Gate** | After review gate merges and all conditions in Section 14 are met |

---

## 17. Recommended Next Gates

| Priority | Gate | Dependency | Purpose |
|---:|---|---|---|
| 1 | **Nashir UI API Integration Planning Review Gate** | This planning gate | Reviews and closes this planning decision before implementation begins |
| 2 | **Nashir UI API Integration Implementation Gate** | Review gate closed + Section 14 conditions met | Implements read-only fetch calls in `ui/nashir/` for Store Profile + Products GET routes |
| 3 | **Nashir UI API Integration Implementation Review Gate** | Implementation gate | Reviews implemented API calls, response handling, type usage, and no write route leakage |
