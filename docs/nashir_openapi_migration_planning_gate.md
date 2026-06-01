# Nashir OpenAPI Migration Planning Gate

| Field | Value |
|---|---|
| Gate type | OpenAPI migration planning gate — documentation only |
| Status | Draft |
| Date | 2026-06-01 |
| Scope | Plans the ownership and migration path for the Nashir OpenAPI canonical source between nashir-ui-prototype and marketing-os; no YAML change approved |
| Prerequisite gates | `docs/nashir_backend_slice_0_implementation_review_gate.md` — merged (PR #271); Backend Slice 0 GO |
| OpenAPI YAML changes | NO |
| Generated types changes | NO |
| File moves | NO |
| UI integration | NO |
| Backend routes | NO |
| SQL changes | NO |
| Tests changed | NO |
| Package changes | NO |

---

## 1. Status

This is a documentation-only planning gate.

**No OpenAPI YAML change is approved by this document.**

**No generated types change is approved by this document.**

**No file is moved or copied by this document.**

**No UI integration is approved by this document.**

**No backend routes, SQL patches, tests, or package changes are made by this document.**

This gate answers:

> Where should the canonical Nashir V1 OpenAPI source live, and what must happen before a migration/update can be executed?

---

## 2. Current Approved State

### SQL and schema

- SQL schema patches 005–011 merged in PR #267. Patch 012 deferred.
- Active V1 RBAC subset = 28 nashir.* permission codes.
- nashir_store_profiles and nashir_products tables exist in Patch 006.

### Backend implementation

- Backend Slice 0 (PR #270) implemented read-only Store Profile and Product repositories and GET routes.
- Guard chain: authGuard → workspaceContextGuard → nonDisclosingMembershipCheck → permissionGuard.
- Response envelope: `{ data: ... }` for all success responses.
- Product-by-id with invalid UUID returns null/404; no PostgreSQL 500.
- Product-by-id with missing repository returns 404; product list with missing repository returns 200 with `[]`.

### Current OpenAPI sources — verified facts

| File | Location | Lines | operationIds | x-permission fields | Status |
|---|---|---|---|---|---|
| `docs/nashir_v1_openapi.yaml` | henter36/nashir-ui-prototype | 4041 | 35 | 34 | Current canonical authority per `docs/nashir_openapi_source_of_truth_gate.md` |
| `docs/nashir_openapi_patch.yaml` | marketing-os | 634 | campaign/evidence routes only | campaign + evidence subset | Historical Slice 0 patch; covers nashir-campaigns and evidence paths only |

### Existing internal Nashir routes in marketing-os (from `src/router.js`)

| Route | Method | Status | In nashir_openapi_patch.yaml? | In nashir_v1_openapi.yaml? |
|---|---|---|---|---|
| /workspaces/{workspaceId}/nashir-campaigns | GET, POST | Implemented | YES | NO — canonical uses different path |
| /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId} | GET | Implemented | YES | NO |
| /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/readiness | GET | Implemented | YES | NO |
| /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/evidence | GET, POST | Implemented | YES | NO |
| /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/evidence/{evidenceId} | GET | Implemented | YES | NO |
| /workspaces/{workspaceId}/nashir-store-profile | GET | Implemented | NO | NO — not yet in any OpenAPI |
| /workspaces/{workspaceId}/nashir-products | GET | Implemented | NO | NO |
| /workspaces/{workspaceId}/nashir-products/{productId} | GET | Implemented | NO | NO |

**Key finding:** The three store profile and product routes added in Backend Slice 0 are not yet in any OpenAPI spec. They are excluded from `implementedRoutes` in `src/router.js` specifically to avoid failing the OpenAPI lint until a canonical OpenAPI source is established in marketing-os.

---

## 3. Problem Statement

There is a contract ownership risk if the Nashir OpenAPI canonical source remains split across nashir-ui-prototype and marketing-os.

### Current split

- `nashir_v1_openapi.yaml` in nashir-ui-prototype: 35 operations, full V1 coverage, approved security metadata, x-permission fields, guard chain metadata.
- `nashir_openapi_patch.yaml` in marketing-os: covers only the subset of Nashir campaign and evidence routes currently implemented there; uses `/nashir-campaigns` internal paths that do not match the canonical nashir_v1_openapi.yaml paths.
- Backend Slice 0 store/product routes: not covered by either OpenAPI file.

### Duplicate authority risks

1. **Path divergence.** marketing-os uses `/nashir-campaigns` while nashir_v1_openapi.yaml uses conceptually different paths. This creates route-to-contract mismatch that blocks generated types and UI integration.
2. **Generated type mismatch.** If generated types are produced from nashir-ui-prototype's YAML and backend routes diverge, clients will call wrong paths with wrong shapes.
3. **Unsafe route expansion.** Adding routes against a stale or divergent YAML can introduce behavioral gaps that reviewers cannot catch without comparing two repos.
4. **Reviewer ambiguity.** PRs in marketing-os cannot be reviewed against the canonical contract without referencing a separate repository.
5. **Accidental implementation from stale YAML.** If nashir-ui-prototype YAML is updated independently after backend migration begins, it may contradict implemented behavior.
6. **UI drift.** UI screens built against nashir-ui-prototype YAML will call endpoints that don't exist in marketing-os under those paths.

---

## 4. Decision Options

### Option A — Keep canonical OpenAPI in nashir-ui-prototype

The UI prototype repo retains authority over `nashir_v1_openapi.yaml`. marketing-os maintains `nashir_openapi_patch.yaml` as a secondary operational patch.

| Criterion | Assessment |
|---|---|
| Governance safety | WEAK — backend governance repo does not own the API contract |
| Backend alignment | WEAK — routes implemented in marketing-os are not authoritative in the contract |
| UI alignment | MODERATE — UI prototype authors control the contract |
| Generated types readiness | WEAK — generated types must be produced from nashir-ui-prototype, disconnected from backend verification |
| Duplicate-contract risk | HIGH — two repos, two YAML files, growing divergence as backend expands |
| Future maintainability | POOR — every route addition requires cross-repo contract sync |
| Reviewability | POOR — PR reviewers cannot check contract compliance within one repo |
| V1 execution risk | HIGH — mismatch errors appear only during integration, not during backend PR review |

### Option B — Move canonical OpenAPI to marketing-os

marketing-os becomes the authoritative owner of the Nashir V1 OpenAPI contract. nashir-ui-prototype YAML becomes a read-only historical reference.

| Criterion | Assessment |
|---|---|
| Governance safety | STRONG — backend governance repo owns the contract it implements |
| Backend alignment | STRONG — route changes and contract changes happen in the same PR/review cycle |
| UI alignment | STRONG — UI screens reference a contract that the backend verifiably implements |
| Generated types readiness | STRONG — generated types produced from marketing-os pass the same lint that guards routes |
| Duplicate-contract risk | LOW — single source of truth after migration |
| Future maintainability | STRONG — contract and implementation evolve together |
| Reviewability | STRONG — single-repo review for contract and behavior |
| V1 execution risk | LOW — divergence is caught by CI lint before merge |

### Option C — Keep both and rely on manual sync

Both files remain authoritative. Teams manually keep them in sync.

| Criterion | Assessment |
|---|---|
| Governance safety | VERY WEAK — no machine-enforced consistency |
| Duplicate-contract risk | VERY HIGH — sync failures accumulate silently |
| All other criteria | POOR |

### Option D — Do not define canonical source yet

Defer the decision until a later milestone.

| Criterion | Assessment |
|---|---|
| Governance safety | WEAK — ambiguity grows as backend expands |
| Duplicate-contract risk | INCREASING — each new route adds to the mismatch |
| V1 execution risk | INCREASING — deferral cost rises with each implementation slice |

---

## 5. Option Evaluation Summary

| Option | Governance | Backend align | UI align | Types readiness | Dup. risk | Maintainability | Verdict |
|---|---|---|---|---|---|---|---|
| A — Keep in UI prototype | WEAK | WEAK | MODERATE | WEAK | HIGH | POOR | **REJECTED** |
| B — Move to marketing-os | STRONG | STRONG | STRONG | STRONG | LOW | STRONG | **RECOMMENDED** |
| C — Keep both, manual sync | VERY WEAK | WEAK | WEAK | WEAK | VERY HIGH | POOR | **REJECTED** |
| D — Defer | WEAK | WEAK | WEAK | WEAK | INCREASING | POOR | **REJECTED** |

---

## 6. Recommended Decision

**Recommend Option B: future canonical Nashir OpenAPI source should be owned by marketing-os.**

### Rationale

- marketing-os owns backend runtime, repositories, routes, RBAC, SQL schema, guard patterns, verification CI, and governance. The API contract belongs with the system that implements and verifies it.
- nashir-ui-prototype is a read-only functional reference for UI screens and behavior. It must not become or remain the API contract authority once a backend implementation exists.
- Keeping OpenAPI canonical in the UI prototype creates compounding duplicate-contract risk with every backend implementation PR.
- The existing `openapi-lint.js` in marketing-os is already structured to lint against a marketing-os OpenAPI file. Moving the canonical source makes machine-enforced contract compliance straightforward.

### Clarifications — this planning gate does NOT

- Move or copy `nashir_v1_openapi.yaml`.
- Edit any OpenAPI YAML file.
- Activate any new routes in marketing-os.
- Update generated types.
- Change any source file, test, SQL, or package file.

This planning gate only authorizes a future migration/update gate to proceed once the listed prerequisites are satisfied.

---

## 7. Future Canonical Path

**Recommended future canonical file in marketing-os:**

```
docs/nashir_v1_openapi.yaml
```

### Handling of existing files

| File | Action after migration |
|---|---|
| `docs/nashir_v1_openapi.yaml` in nashir-ui-prototype | Becomes read-only historical reference; must not be treated as authoritative after migration completes; a note may be added in a future UI repo PR if separately approved |
| `docs/nashir_openapi_patch.yaml` in marketing-os | Historical Slice 0 patch; to be reconciled with or superseded by the canonical `docs/nashir_v1_openapi.yaml` once migration completes; kept as reference until explicitly retired |
| `docs/nashir_v1_openapi.yaml` in marketing-os (future) | Single canonical Nashir V1 OpenAPI source; governs lint checks, generated types, and UI integration |

### Single-authority rule

Only one canonical Nashir V1 OpenAPI source may exist at any time. After migration:
- Only `docs/nashir_v1_openapi.yaml` in marketing-os is authoritative.
- No other file may claim to define Nashir V1 API contracts.
- nashir-ui-prototype YAML may inform UI behavior reference only.

---

## 8. Duplicate Contract Prevention Rules

These rules apply once migration completes:

1. No generated client or type artifact may be produced from nashir-ui-prototype YAML after migration is complete.
2. No implementation in marketing-os may cite nashir-ui-prototype OpenAPI as authoritative after migration.
3. Any divergence between UI prototype YAML and the canonical marketing-os YAML must be resolved in marketing-os before generated types are produced.
4. UI prototype screens may inform screen behavior but not API contract authority.
5. If nashir-ui-prototype YAML is updated after migration, those changes must be explicitly reviewed against marketing-os canonical YAML before any implementation action is taken.
6. A deprecation note or header in nashir-ui-prototype YAML may be added in a future PR only if separately approved and scoped.

---

## 9. Future OpenAPI Migration/Update Gate Requirements

Before any YAML is created or modified in marketing-os as `docs/nashir_v1_openapi.yaml`, all of the following must be satisfied:

**Route comparison**
- Compare nashir-ui-prototype `nashir_v1_openapi.yaml` paths against actual marketing-os routes in `src/router.js`.
- Confirm Store Profile GET route (`/workspaces/{workspaceId}/nashir-store-profile`).
- Confirm Product list GET route (`/workspaces/{workspaceId}/nashir-products`).
- Confirm Product by-id GET route (`/workspaces/{workspaceId}/nashir-products/{productId}`).
- Confirm campaign/evidence routes from `nashir_openapi_patch.yaml`.
- Confirm any divergent path naming is resolved.

**Contract content verification**
- Confirm RBAC permission names match implemented `nashir.store.read` and `nashir.product.read`.
- Confirm ErrorModel shape (`code`, `message`, `user_action`, `correlation_id`) is referenced.
- Confirm non-disclosing 404 behavior is documented in affected operation descriptions.
- Confirm invalid UUID behavior is documented where applicable.
- Confirm response envelopes use `{ data: ... }` shape consistently.
- Confirm operationIds are unique and consistent with existing naming.
- Confirm no write routes are included.
- Confirm no Creator Studio, publishing, model routing, provider runtime, or integration operations are included beyond what is currently implemented.

**Boundaries confirmed**
- Confirm no generated types are changed in the same PR as the YAML migration.
- Confirm `openapi-lint.js` in marketing-os will pass with the migrated file.
- Confirm `nashir_openapi_patch.yaml` retirement/reconciliation strategy is documented.

---

## 10. Generated Types Input Update Gate Prerequisites

Before generated types may be updated, all of the following must be true:

1. Canonical OpenAPI file exists at `docs/nashir_v1_openapi.yaml` in marketing-os.
2. `npm run openapi:lint:strict` passes against the canonical file.
3. Backend route tests pass against all routes declared in the canonical file.
4. RBAC permissions declared in the canonical file are aligned with `src/rbac.js`.
5. Store Profile and Product route schemas are reviewed and correct.
6. Generated types destination path is approved (see Section 11).
7. nashir-ui-prototype YAML is explicitly marked non-authoritative (or a note is added in a separate approved PR).
8. No client generation occurs before this gate is formally approved.
9. A separately approved Generated Types Input Update Gate document must exist before any package change to generate types.

---

## 11. Generated Types Destination Strategy

This section is planning-only. No destination path is approved by this document.

### Recommendation

Generated types should be created in marketing-os as a backend-contract artifact, ensuring types and their source contract live in the same repo and pass the same CI verification.

### Candidate paths (evaluation pending)

| Candidate path | Notes |
|---|---|
| `src/generated/nashir-api-types/` | Consistent with existing `src/generated/` pattern in nashir-ui-prototype; keeps types close to implementation |
| `generated/nashir-api/` | Top-level generated directory; separates from src |
| `packages/nashir-api-client/` | Suitable if a client package is needed; requires package.json change |

### Decision rule

Exact destination remains pending the Generated Types Input Update Gate. That gate must explicitly approve the destination path, generation command, package change if required, and CI integration. No candidate path above is approved by this document.

---

## 12. UI API Integration Planning Gate Prerequisites

Before UI API integration planning may begin, all of the following must be true:

1. Canonical OpenAPI lives in marketing-os at `docs/nashir_v1_openapi.yaml`.
2. Generated types gate is completed or intentionally deferred with a documented and approved reason.
3. UI screens and routes are mapped to backend endpoints at the planning level.
4. Store Setup and Product screens use Store Profile + Products read-only endpoints only in the first integration slice.
5. UI must not invent request or response fields outside the canonical contract.
6. UI must not send write operations (POST/PUT/PATCH/DELETE) to store profile or product endpoints in Slice 0 integration.
7. UI must not connect Creator Studio, publishing queue, model routing, AI provider runtime, analytics ingestion, attribution, external integrations, or production/pilot behavior in the first integration slice.
8. nashir-ui-prototype remains a read-only functional reference; it must not serve as a design-time API contract source after canonical OpenAPI migrates.
9. A separately approved UI API Integration Planning Gate document must exist before any UI file is modified to call backend routes.

---

## 13. Allowed Future Files

### For the future OpenAPI Migration/Update Gate PR

| File | Purpose | Status |
|---|---|---|
| `docs/nashir_v1_openapi.yaml` | Future canonical Nashir V1 OpenAPI source | CANDIDATE — requires migration gate to authorize |
| `docs/03_decision_log.md` | Record the migration decision | CANDIDATE |
| `docs/17_change_log.md` | Record migration completion | CANDIDATE |
| `scripts/openapi-lint.js` or related validation | Only if an existing validation reference must be updated to point to new canonical path | CANDIDATE — only if explicitly required; must not add new packages |

### For the future Generated Types Input Update Gate PR

| File | Purpose | Status |
|---|---|---|
| Generated types destination (TBD path) | Future generated type artifact | PENDING — destination pending gate |
| `package.json` | Only if generation script requires update | PENDING — requires explicit approval in that gate |
| `docs/03_decision_log.md` | Record the types decision | CANDIDATE |
| `docs/17_change_log.md` | Record types update | CANDIDATE |

### For the future UI API Integration Planning Gate PR

No files are approved for UI integration by this gate. UI integration requires a separately approved planning gate that explicitly names allowed files, forbidden files, and verification commands.

---

## 14. NO-GO Boundaries

The following are explicitly NO-GO in this PR and in any future PR unless a separately approved gate document explicitly permits each item:

```text
NO-GO: Any OpenAPI YAML change in this PR.
NO-GO: Moving or copying nashir_v1_openapi.yaml from nashir-ui-prototype.
NO-GO: Editing docs/nashir_openapi_patch.yaml in this PR.
NO-GO: Creating or modifying docs/nashir_v1_openapi.yaml in this PR.
NO-GO: Generated client creation or update.
NO-GO: Generated type creation or update.
NO-GO: UI integration of any kind.
NO-GO: Store Profile or Product write routes (POST/PUT/PATCH/DELETE).
NO-GO: Creator Studio backend implementation.
NO-GO: Publishing queue backend implementation.
NO-GO: Integration runtime or external provider calls.
NO-GO: Model routing runtime implementation.
NO-GO: AI runtime or autonomous execution.
NO-GO: Analytics ingestion or attribution.
NO-GO: Production or pilot readiness claims.
NO-GO: SQL schema patch 012.
NO-GO: RBAC expansion beyond the approved 28 nashir.* permission codes.
NO-GO: Any change to nashir-ui-prototype.
NO-GO: Any change to src/, test/, scripts/, or workflow files in this PR.
```

---

## 15. Verification Commands

The following commands must be run and pass (or the blocking reason recorded) before this PR is merged:

```bash
npm test
npm run db:seed
npm run verify:strict
git status --short
```

If `DATABASE_URL` is available:

```bash
npm run db:migrate:strict
```

If `DATABASE_URL` is missing, record:

```text
db:migrate:strict blocked by missing DATABASE_URL — environment constraint, not code defect
```

### Verification results (this PR)

| Command | Result |
|---|---|
| `npm test` | **717 pass, 0 fail** |
| `npm run db:seed` | OK |
| `npm run verify:strict` (non-DB steps) | **PASSED** — Sprint 0 baseline present; OpenAPI strict lint passed: 94 declared permissions checked; 717 pass, 0 fail; 52 integration tests pass |
| `npm run db:migrate:strict` | **BLOCKED** — `DATABASE_URL is required for strict Sprint 0 migration execution.` — environment constraint |
| `git status --short` | Two untracked files: `docs/nashir_openapi_migration_planning_gate.md`, modified `docs/03_decision_log.md` and `docs/17_change_log.md` |
| Forbidden files changed | **NONE** — no OpenAPI, SQL, src/, test/, package, generated, or prototype files modified |

---

## 16. GO / NO-GO Result

| Decision | Status |
|---|---|
| **This planning gate (documentation only)** | **GO** |
| OpenAPI YAML change in this PR | **NO-GO** |
| File migration in this PR | **NO-GO** |
| Generated types in this PR | **NO-GO** |
| UI integration in this PR | **NO-GO** |
| **CONDITIONAL GO later: OpenAPI Migration/Update Gate** | After prerequisites in Section 9 are satisfied |
| **CONDITIONAL GO later: Generated Types Input Update Gate** | After prerequisites in Section 10 are satisfied |
| **CONDITIONAL GO later: UI API Integration Planning Gate** | After prerequisites in Section 12 are satisfied |

---

## 17. Recommended Next Gates

| Priority | Gate | Dependency | Purpose |
|---:|---|---|---|
| 1 | **Nashir OpenAPI Migration Review Gate** | This planning gate merged | Reviews this planning decision before YAML work begins; may be combined with migration/update gate if reviewers agree |
| 2 | **Nashir OpenAPI Canonical Source Migration/Update Gate** | Migration review gate + Section 9 prerequisites | Creates or migrates `docs/nashir_v1_openapi.yaml` in marketing-os; reconciles `nashir_openapi_patch.yaml`; verifies all implemented routes are correctly reflected |
| 3 | **Generated Types Input Update Gate** | Canonical OpenAPI established + Section 10 prerequisites | Approves generated types destination, generation command, package change if required |
| 4 | **UI API Integration Planning Gate** | Canonical OpenAPI established + Section 12 prerequisites | Plans how nashir-ui-prototype UI calls marketing-os backend routes; first slice covers Store Profile + Products read-only only |
| 5 | **Store/Product Write Backend Planning Gate** | Read-only integration stable | Plans create/update routes for store profiles and products |
| 6 | **Creator Studio Backend Planning Gate** | Store/Product foundation stable | Plans Creator Studio session, context draft, and transfer draft backend |
