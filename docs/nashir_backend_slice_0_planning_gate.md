# Nashir Backend Slice 0 Planning Gate

| Field | Value |
|---|---|
| Gate type | Backend Slice 0 Planning Gate — documentation only |
| Status date | 2026-05-31 |
| Scope | Plans the first Nashir backend implementation slice in marketing-os after SQL schema readiness; defines candidate options, recommended slice, exact future scope, allowed files, forbidden files, guard requirements, error model, test plan, and verification commands before any backend implementation begins |
| Prerequisite gates | `docs/nashir_sql_schema_implementation_review_gate.md` — merged, GO; PR #267 SQL schema implementation — merged |
| Backend implementation approved | NO |
| Routes added in this gate | NO |
| Auth/RBAC implementation | NO — no changes to src/rbac.js or guards.js |
| OpenAPI YAML changes | NO |
| SQL patches | NO — no changes to any SQL patch file |
| UI changes | NO |
| Generated files | NO |
| marketing-os | Read-only in this gate |
| nashir-ui-prototype | Read-only source for current Nashir V1 OpenAPI authority |

---

## 1. Status and Scope

This is a Backend Slice 0 Planning Gate only.

**No backend implementation is done in this gate.**

**No routes, API handlers, auth middleware, OpenAPI YAML, generated client updates, or UI integration work is approved in this gate.**

**No SQL patches are modified or created in this gate.**

**marketing-os is the future backend implementation target. All implementation must happen in marketing-os only.**

**nashir-ui-prototype remains the read-only source of truth for the current Nashir V1 OpenAPI contract (`docs/nashir_v1_openapi.yaml`). Its OpenAPI authority has not yet migrated to marketing-os.**

**No production or pilot readiness is claimed.**

**Backend Slice 0 Implementation remains blocked until this planning gate merges and the conditions in Section 18 are satisfied.**

This gate answers:

> What is the safest first backend implementation slice for Nashir after SQL schema readiness, and what exact implementation boundaries must be approved before code changes?

---

## 2. Source Inputs Reviewed

### Verified — henter36/marketing-os (local)

| Source | Finding |
|---|---|
| `README.md` | Contract-first; Pilot/Production NO-GO; Sprint 5 NO-GO; RBAC pattern operational; in-memory default with explicit gated repository modes for campaigns and evidence |
| `AGENTS.md` | Stop on source conflict; documentation PRs must not modify src/rbac.js or guards.js without a gate; edit limit ≤3 files enforced |
| `package.json` | pg ^8.20.0; node >=20; `npm run verify:strict` confirmed present; no new packages needed for standard repository implementation |
| `server.js` | Thin wrapper: `http.createServer(createApp())`; loads config; no route logic |
| `src/router.js` | Sprint 4 + Patch 002 + Nashir routes; uses `src/guards.js`, `src/error-model.js`, `src/db.js`, `src/repositories/`; `routeNashir()` function demonstrates established route pattern |
| `src/guards.js` | **Verified** — six functions: `authGuard` (X-User-Id header + store lookup), `workspaceContextGuard` (workspaceId from path), `membershipCheck` (403 on non-member), `nonDisclosingMembershipCheck` (404 on non-member, prevents enumeration), `permissionGuard` (hasPermission check → 403), `rejectBodyWorkspaceId` (422 on mismatch) |
| `src/error-model.js` (root + src) | `AppError(status, code, message, userAction)`; `correlationId(req)`; `errorBody(error, id)`; `sendJson(res, status, body)` |
| `src/db.js` | `PgPoolAdapter` with `pool.query(sql, params, options)`, `pool.withTransaction(callback, options)`, `setWorkspaceContext` (sets `app.current_workspace_id` per session); `createPool()`, `getPool()` |
| `src/rbac.js` | 28 active V1 nashir.* codes; hasPermission function intact; no changes permitted without Auth/RBAC Implementation Gate |
| `scripts/db-seed.js` | Imports roles/permissions/rolePermissions from `src/rbac.js`; idempotent DELETE+re-INSERT |
| `src/repositories/index.js` | `createRepositories({ pool })` returns {brandProfiles, brandVoiceRules, nashirCampaigns, memberships, nashirEvidenceLifecycle, promptTemplates, rbac, reportTemplates, workspaces}; pattern for adding new repositories |
| `src/repositories/nashir-campaign-repository.js` | **Reference pattern:** constructor requires pool; `listCampaigns`, `findCampaignById`, `createCampaign`; workspace_id always in WHERE; passes `{ workspaceId }` as options to pool.query; uses `toRepositoryError` for error mapping |
| `src/repositories/nashir-evidence-lifecycle-repository.js` | **Reference pattern:** `listByCampaign`, `getById`, `createSubmittedEvidence`; transactional write via `pool.withTransaction`; workspace-scoped queries |
| `src/repositories/repository-error-logging.js` | `toRepositoryError(repositoryName, error)` — wraps DB errors as AppError(500, INTERNAL_ERROR); sanitizes DB internals |
| `src/nashir/backend-slice0-repository.js` | In-memory implementation of findCampaignById, listCampaigns, createCampaign, listCampaignEvidence, findEvidenceById, createCampaignEvidence; `saveCampaign`/`saveEvidence` throw "not implemented" |
| `src/nashir/backend-slice0-service.js` | Service layer over repository; campaign list/get/create/readiness/evidence methods |
| `src/router.js` routeNashir | Guard chain: authGuard → workspaceContextGuard → nonDisclosingMembershipCheck → permissionGuard; returns created() or ok(); audit() called on writes |
| `docs/nashir_sql_schema_implementation_review_gate.md` | READY WITH WATCH ITEMS; GO to Backend Slice 0 Planning; db:migrate:strict blocked by DATABASE_URL absence in local environment |
| `docs/marketing_os_v5_6_5_phase_0_1_schema_patch_006.sql` | nashir_store_profiles, nashir_products, nashir_assets, nashir_data_sources, nashir_integration_connections; composite workspace-scoped FKs; vault_ref/secret_ref only |
| `docs/marketing_os_v5_6_5_phase_0_1_schema_patch_007.sql` | nashir_campaign_content_items, nashir_campaign_content_assets (composite PK), nashir_preview_artifacts, nashir_content_review_decisions |
| `docs/marketing_os_v5_6_5_phase_0_1_schema_patch_008.sql` | nashir_publishing_queue_items; human confirmation required |
| `docs/marketing_os_v5_6_5_phase_0_1_schema_patch_009.sql` | nashir_prompt_templates, nashir_prompt_governance_versions |
| `docs/marketing_os_v5_6_5_phase_0_1_schema_patch_010.sql` | 9 Creator Studio TTL tables; expires_at required |
| `docs/marketing_os_v5_6_5_phase_0_1_schema_patch_011.sql` | nashir_ai_providers, nashir_model_routing_rules (→ ai_providers FK), nashir_cost_usage_records |
| `test/sprint0.test.js` | Migration order assertion covers patches 001–011 |
| `test/nashir-prewiring-contract.test.js` | Guards unapproved Nashir route and OpenAPI scope changes; APPROVED_NASHIR_CODES = 28 codes |
| `test/nashir-rbac-permission-mapping.test.js` | 210 assertions; 28 codes × 7 roles; structural invariants |
| `test/nashir-sql-schema-patch-validation.test.js` | 84 structural SQL tests; workspace isolation, FK constraints, idempotency |

### Verified — henter36/nashir-ui-prototype (read-only)

| Source | Finding |
|---|---|
| `docs/nashir_v1_openapi.yaml` | OpenAPI 3.1.0 v0.1.0; 35 operations across 5 tags; server URL placeholder `https://api.example.invalid`; workspace-scoped paths (`/workspaces/{workspaceId}/...`); includes Products (4 ops), Assets (5 ops), Campaign Content (8 ops), AI Readiness (5 ops), Creator Studio (13 ops) |
| `docs/nashir_openapi_security_yaml_patch_review_gate.md` | Post-PR #55; 34 `x-permission` fields (excluding getHealth); 35 `x-audit-required` fields; 35 `x-guard-chain` or `x-membership-check` fields; `x-self-action-denied` on approveCampaignContent + rejectCampaignContent; nonDisclosingMembershipCheck on Creator Studio GET-by-id operations |
| `docs/nashir_openapi_security_mapping_gate.md` | All 35 ops mapped; productRead/write, assetRead/write/link, contentRead/create/update/submitReview, approval.decide, creator_studio.use, creator_studio.transfer.create, publishing.queue.read, publishing.draft.receive guard chains documented |
| `docs/nashir_auth_rbac_review_gate.md` | READY WITH WATCH ITEMS; creator confirmed as canonical role_code; B-RBAC02 resolved; 28 active nashir.* codes confirmed |
| `docs/nashir_auth_rbac_workspace_identity_gate.md` | 7 roles; dot notation permissions; guard chain model; workspace_id from path only; rejectBodyWorkspaceId enforced |
| `docs/nashir_sql_schema_implementation_planning_gate.md` | Confirmed: src/rbac.js is the RBAC source; db-seed.js drives seed; repository pattern confirmed viable |
| `docs/nashir_openapi_source_of_truth_gate.md` | Current authority: `nashir_v1_openapi.yaml` in nashir-ui-prototype; migration to marketing-os requires Backend Slice 0 Planning + OpenAPI Migration Planning Gate |

### Blocked verification

| Item | Reason |
|---|---|
| `db:migrate:strict` | DATABASE_URL not set in local environment; confirmed as environment constraint, not a code defect |
| Nashir V1 OpenAPI route path adoption | OpenAPI authority migration from nashir-ui-prototype to marketing-os is not yet planned or executed; route paths from nashir_v1_openapi.yaml cannot be adopted as canonical until OpenAPI Migration Planning Gate closes |

---

## 3. Planning Question

**What is the safest first backend implementation slice for Nashir after SQL schema readiness, and what exact implementation boundaries must be approved before code changes?**

**Recommendation: Backend Slice 0 is a Store Profile and Product read-only repository + route extension, using tables from Patch 006, following the established NashirCampaignRepository pattern, with nashir.store.read and nashir.product.read permissions.**

---

## 4. Backend Slice 0 Candidate Options

### Option A — Store Profile and Product Read-Only Repository + Route Slice

**Description:** Implement `NashirStoreProfileRepository` and `NashirProductRepository` in `src/repositories/`. Wire read-only GET routes for store profile (one per workspace) and product list/get. Use existing Nashir route pattern from routeNashir().

**Required SQL tables:** `nashir_store_profiles` (Patch 006), `nashir_products` (Patch 006).

**Required permissions:** `nashir.store.read`, `nashir.product.read` — both already in `src/rbac.js`.

**Operational risk:** LOW. Read-only paths. No approval decisions. No TTL. No business state mutations. No publishing.

**Dependency on OpenAPI migration:** LOW. Routes can use marketing-os-internal path naming (like `/nashir-store-profile`, `/nashir-products`) following the existing `/nashir-campaigns` pattern, without waiting for OpenAPI migration. OpenAPI migration adopts these routes later.

**Dependency on UI integration:** NONE. Routes can be tested without UI.

**Test burden:** MEDIUM-LOW. Repository tests (double pattern from nashir-campaign-repository.test.js), route tests (from nashir-route.test.js), workspace isolation tests.

**Verdict: RECOMMENDED.** Lowest risk, proven pattern, avoids all complex business logic, proves workspace isolation at new table layer.

---

### Option B — Store/Profile + Product Read/Write Repository Slice

**Description:** Implement `NashirStoreProfileRepository` and `NashirProductRepository` with full CRUD. Wire POST/PUT routes for store profile creation and product creation/update.

**Required SQL tables:** `nashir_store_profiles`, `nashir_products`, `nashir_product_intelligence_snapshots` (Patch 006).

**Required permissions:** `nashir.store.read`, `nashir.store.update`, `nashir.product.read`, `nashir.product.write`.

**Operational risk:** MEDIUM. Write paths add idempotency, validation, and audit event complexity. Partial unique constraint on store profile requires care. The non-nullable model_routing_rules→ai_providers FK adds ordering concerns for seeding.

**Dependency on OpenAPI migration:** LOW for internal paths; MEDIUM if canonical OpenAPI paths are required.

**Verdict: DEFER after Option A.** Write paths should follow after read paths are verified. Implement as Backend Slice 1 after Slice 0 is verified.

---

### Option C — Creator Studio Session and Context Draft Slice

**Description:** Implement Creator Studio session creation and context draft backend. Wire POST/GET routes for sessions and context drafts.

**Required SQL tables:** `nashir_creator_studio_sessions`, `nashir_creator_context_drafts`, `nashir_prompt_templates` (Patches 009, 010).

**Required permissions:** `nashir.creator_studio.use`, `nashir.creator_studio.transfer.create`.

**Operational risk:** HIGH. TTL-managed entities require expiry behavior. `expires_at` semantics must be handled at service layer. `prompt_template_id` FK dependency requires prompt templates to exist. 410 Gone behavior for expired sessions is a separate concern. Session creation must not auto-create on page load (creator_studio_api_boundary_gate.md constraint).

**Dependency on OpenAPI migration:** HIGH. Creator Studio paths in nashir_v1_openapi.yaml use specific operationId patterns that must be preserved.

**Verdict: DEFER.** TTL complexity, session lifecycle, and prompt template dependency make this higher risk for a first slice. Implement after read-only foundation is proven.

---

### Option D — Campaign Content and Review Slice

**Description:** Implement campaign content items list/get, content submission, and content review decision routes.

**Required SQL tables:** `nashir_campaign_content_items`, `nashir_campaign_content_assets`, `nashir_preview_artifacts`, `nashir_content_review_decisions` (Patch 007).

**Required permissions:** `nashir.content.read`, `nashir.content.create`, `nashir.content.update`, `nashir.content.submit_review`, `nashir.approval.decide`.

**Operational risk:** HIGH. Self-approval denial invariant (`content_actor_user_id ≠ reviewer_user_id`) requires service-layer enforcement. Approval decisions are auditable protected actions. Content status state machine requires careful implementation.

**Verdict: DEFER.** Approval logic and self-approval enforcement are non-trivial service-layer invariants. Implement after store/product pattern is proven and a separate content/approval planning gate is written.

---

### Option E — Evidence Repository Lifecycle Extension Slice

**Description:** Extend existing evidence lifecycle to add evidence read-by-id route to the current nashir-campaigns evidence paths, or add accepted/rejected/superseded status transitions.

**Required SQL tables:** `nashir_evidence` (Patch 003), `nashir_evidence_lifecycle_events` (Patch 003) — no new tables.

**Required permissions:** `nashir.campaign.read` (existing), `nashir.evidence.manage` (for status updates).

**Operational risk:** LOW for read-only; MEDIUM for status transitions (evidence management is a protected action).

**Verdict: LOWER PRIORITY.** Evidence read-by-id route was already implemented (GET `/nashir-campaigns/{id}/evidence/{evidenceId}`). Lifecycle status transitions require `nashir.evidence.manage` which has reviewer RA semantics. This is more complex than Option A.

---

## 5. Recommended Slice 0

**Recommended: Option A — Nashir Store Profile and Product Read-Only Repository + Route Extension**

### Rationale

1. **Established pattern.** The `NashirCampaignRepository` + `routeNashir()` implementation in `src/repositories/` and `src/router.js` provides a proven template. `NashirStoreProfileRepository` and `NashirProductRepository` follow the same pool injection, workspace-scoped query, and error mapping patterns.

2. **No complex business logic.** Read-only paths avoid approval decisions, TTL expiry, publishing confirmations, and evidence management. The workspace isolation test surface is sufficient to prove the pattern.

3. **All required permissions already in src/rbac.js.** `nashir.store.read` and `nashir.product.read` are both active V1 codes in the current permission map. No RBAC gate is required before implementation.

4. **No OpenAPI migration dependency for the implementation slice.** Routes can use marketing-os-internal path naming (following the existing `/nashir-campaigns` convention) without waiting for the OpenAPI Migration Planning Gate. The `/nashir-products` and `/nashir-store-profile` paths can be reconciled with the nashir_v1_openapi.yaml `/products` and `/assets` paths later.

5. **Lowest risk for DB verification.** The `nashir_store_profiles` and `nashir_products` tables have simple read queries (`WHERE workspace_id = $1`). The store profile partial unique constraint and product store_profile FK enforce workspace correctness at the DB layer.

6. **Audit requirement is LOW for reads.** GET routes do not require audit event writes. The slice avoids the audit complexity introduced by create/update/delete operations.

### Scope summary

| Component | Scope |
|---|---|
| SQL tables | `nashir_store_profiles`, `nashir_products` (read only; from Patch 006) |
| Permissions | `nashir.store.read`, `nashir.product.read` |
| Guard chain | authGuard → workspaceContextGuard → nonDisclosingMembershipCheck → permissionGuard |
| New repositories | `NashirStoreProfileRepository`, `NashirProductRepository` |
| New service | None needed for read-only; routes call repository directly or via thin service wrapper |
| Route additions | GET `/workspaces/{workspaceId}/nashir-store-profile` (workspace active store profile), GET `/workspaces/{workspaceId}/nashir-products` (product list), GET `/workspaces/{workspaceId}/nashir-products/{productId}` (product by id) |
| Audit events | NOT REQUIRED for read-only paths |
| Self-action denial | NOT APPLICABLE |
| OpenAPI migration | NOT REQUIRED for this slice |

---

## 6. Operation / Endpoint Candidate Mapping

The following operations are drawn from the current Nashir V1 OpenAPI authority (`docs/nashir_v1_openapi.yaml` in nashir-ui-prototype, read-only) for reference. Exact route path adoption from nashir_v1_openapi.yaml must wait for OpenAPI Migration Planning Gate. Interim marketing-os-internal paths are defined here.

| Future operationId (nashir_v1_openapi.yaml) | Interim path (marketing-os) | HTTP | Required permission | SQL tables | Guard chain | Audit required | Self-action denied | Included in Slice 0 |
|---|---|---|---|---|---|---|---|---|
| `listProducts` → nashir internal | GET /workspaces/{workspaceId}/nashir-products | GET | nashir.product.read | nashir_products | authGuard → workspaceContextGuard → nonDisclosingMembershipCheck → permissionGuard | NO | NO | **YES** |
| `getProduct` → nashir internal | GET /workspaces/{workspaceId}/nashir-products/{productId} | GET | nashir.product.read | nashir_products | authGuard → workspaceContextGuard → nonDisclosingMembershipCheck → permissionGuard | NO | NO | **YES** |
| *(store profile — not in nashir_v1_openapi.yaml explicitly)* | GET /workspaces/{workspaceId}/nashir-store-profile | GET | nashir.store.read | nashir_store_profiles | authGuard → workspaceContextGuard → nonDisclosingMembershipCheck → permissionGuard | NO | NO | **YES** |
| `createProduct` | POST /workspaces/{workspaceId}/nashir-products | POST | nashir.product.write | nashir_products, nashir_store_profiles | + rejectBodyWorkspaceId | YES | NO | **DEFER (Slice 1)** |
| `listAssets` | GET /workspaces/{workspaceId}/nashir-assets | GET | nashir.asset.read | nashir_assets | standard | NO | NO | **DEFER (Slice 1)** |
| `listCampaignContents` | GET /workspaces/{workspaceId}/nashir-campaign-contents | GET | nashir.content.read | nashir_campaign_content_items | standard | NO | NO | **DEFER (Slice 1)** |
| `approveCampaignContent` | POST .../approve | POST | nashir.approval.decide | nashir_content_review_decisions | standard + self-action | YES | YES | **DEFER (Slice 2+)** |
| `createCreatorStudioSession` | POST .../nashir-creator-studio/sessions | POST | nashir.creator_studio.use | nashir_creator_studio_sessions | + rejectBodyWorkspaceId | YES | NO | **DEFER (Slice 2+)** |
| All other operations | — | — | — | — | — | — | — | **DEFER** |

**OpenAPI path adoption note:** The paths above prefixed with `nashir-` are marketing-os internal names that follow the existing Nashir campaign convention. When the Nashir OpenAPI Migration Planning Gate executes, the canonical nashir_v1_openapi.yaml paths (`/products`, `/assets`, etc.) will be reconciled with these internal paths or aliases will be established. Do not implement routes at nashir_v1_openapi.yaml canonical paths until OpenAPI migration is planned.

---

## 7. Repository Pattern Plan

*No code is written here. This section describes the future implementation pattern.*

### Existing pattern reference

`src/repositories/nashir-campaign-repository.js` is the authoritative reference:

```text
class NashirCampaignRepository {
  constructor({ pool }) {  // throws if pool is missing
    this.pool = pool;
  }

  async listCampaigns({ workspaceId }) {
    rows = await this.pool.query(SQL, [workspaceId], { workspaceId });
    return rows.map(toPublicCampaign);
  }

  async findCampaignById({ workspaceId, nashirCampaignId }) {
    rows = await this.pool.query(SQL, [workspaceId, nashirCampaignId], { workspaceId });
    return rows[0] ? toPublicCampaign(rows[0]) : null;
  }
}
```

Key pattern elements:
- Constructor requires pool; throws on missing pool.
- All queries pass `{ workspaceId }` as options to pool.query.
- `pool.query` with `workspaceId` option triggers `setWorkspaceContext` → `SET app.current_workspace_id`.
- All rows mapped through a `toPublic*` function that returns only approved fields.
- Errors are caught and re-thrown via `toRepositoryError(repositoryName, error)` from `repository-error-logging.js`.
- findById returns null (not throws) when not found.

### Future file candidates (not approved yet — pending implementation PR)

| File | Category | Pattern | Status |
|---|---|---|---|
| `src/repositories/nashir-store-profile-repository.js` | Repository | NashirCampaignRepository pattern | Candidate — TBD |
| `src/repositories/nashir-product-repository.js` | Repository | NashirCampaignRepository pattern | Candidate — TBD |
| `src/repositories/index.js` | Repository index | Add nashirStoreProfiles + nashirProducts | Candidate — TBD |
| `src/router.js` | Route wiring | routeNashirStore() or extend routeNashir() | Candidate — TBD |
| `test/nashir-store-profile-repository.test.js` | Repository test | nashir-campaign-repository.test.js pattern | Candidate — TBD |
| `test/nashir-product-repository.test.js` | Repository test | nashir-campaign-repository.test.js pattern | Candidate — TBD |
| `test/nashir-store-product-route.test.js` | Route test | nashir-route.test.js pattern | Candidate — TBD |
| `docs/17_change_log.md` | Change log | Standard entry | Candidate |

**TBD note:** File paths and exact naming are candidates. Implementation PR must confirm against actual src/ directory before final edit.

### Workspace scoping verification

Both repositories must:
- Include `WHERE workspace_id = $1` in all queries.
- Pass `{ workspaceId }` as options to every `pool.query` call.
- Return null (not throw) for not-found records.
- Never return records from a different workspace.

### Transaction handling

Read-only paths do not require `pool.withTransaction`. If write paths are added in a future slice, they must use `pool.withTransaction(callback, { workspaceId })`.

---

## 8. Future Allowed Files for Backend Slice 0 Implementation

The following files are candidates for the Backend Slice 0 Implementation PR. All are subject to final confirmation in the implementation planning/review.

| File | Category | Rationale | Status |
|---|---|---|---|
| `src/repositories/nashir-store-profile-repository.js` | Repository | New repository for nashir_store_profiles | **CANDIDATE** |
| `src/repositories/nashir-product-repository.js` | Repository | New repository for nashir_products | **CANDIDATE** |
| `src/repositories/index.js` | Repository index | Add nashirStoreProfiles + nashirProducts to createRepositories | **CANDIDATE** |
| `src/router.js` | Route wiring | Add GET /nashir-store-profile and GET /nashir-products routes; extend nashirRoutes array | **CANDIDATE** |
| `test/nashir-store-profile-repository.test.js` | Repository test | Pool-double pattern from nashir-campaign-repository.test.js | **CANDIDATE** |
| `test/nashir-product-repository.test.js` | Repository test | Pool-double pattern from nashir-campaign-repository.test.js | **CANDIDATE** |
| `test/nashir-store-product-route.test.js` | Route test | Pattern from nashir-route.test.js | **CANDIDATE** |
| `docs/17_change_log.md` | Change log | Standard repository practice | **CANDIDATE** |

**No other src/ files are approved for Backend Slice 0 Implementation unless a separately approved gate explicitly names them.**

---

## 9. Future Forbidden Files

The following files must NOT be modified in Backend Slice 0 Implementation unless a separately approved gate explicitly names them:

| File / Category | Reason |
|---|---|
| Any SQL patch file (`docs/marketing_os_v5_6_5_phase_0_1_schema_patch_*.sql`) | SQL schema is closed; no new migrations unless a separate fix/extension slice is approved |
| `scripts/db-migrate.js` | Migration runner is locked; any new patch requires a separate gate |
| `docs/07_database_schema.sql` | Schema wrapper is locked with patches 001–011 |
| `src/rbac.js` | Permission codes locked at 28 active V1 codes; any change requires Auth/RBAC Implementation Gate |
| `guards.js` (root), `src/guards.js` | Guard logic is operational; no changes permitted without a separate guard implementation gate |
| `error-model.js` (root), `src/error-model.js` | Error model is operational; no changes permitted |
| `package.json`, `package-lock.json` | No new packages unless explicitly approved and justified |
| `docs/nashir_v1_openapi.yaml` (in nashir-ui-prototype) | OpenAPI authority not migrated; do not touch |
| `docs/marketing_os_v5_6_5_phase_0_1_openapi.yaml` | Base marketing-os OpenAPI; no Nashir paths may be added without OpenAPI Migration Planning Gate |
| `docs/marketing_os_v5_6_5_phase_0_1_openapi_patch_002.yaml` | Patch 002 OpenAPI; same rule |
| `src/generated/creator-studio-openapi-types/index.d.ts` | Generated artifact in nashir-ui-prototype; do not touch |
| `prototype/`, `ui/` | Not source of truth; not backend implementation targets |
| `.env`, `.env.*` | Never committed |
| Any CI/CD workflow file | Not in scope |
| `store.js`, `src/store.js`, `src/store_sprint3.js` | In-memory store is preserved; no store changes unless separately gated |
| `server.js`, `src/server.js` | Server entry points; no changes permitted |

---

## 10. RBAC and Guard Plan

*No implementation here. This section defines the implementation requirements.*

### Guard chain for Slice 0 routes (read-only GET paths)

```text
authGuard(req, store)
  → workspaceContextGuard({ workspaceId: workspaceMatch[1] })
  → nonDisclosingMembershipCheck(user, workspaceId, store)
  → permissionGuard(membership, "nashir.store.read")   // or "nashir.product.read"
```

**`nonDisclosingMembershipCheck` is required** (not `membershipCheck`). Consistent with existing routeNashir() behavior. Returns 404 NOT_FOUND for non-members to prevent workspace enumeration.

**`rejectBodyWorkspaceId` is NOT required** for read-only GET paths. Required for write paths (future slices).

### Permission requirements

| Route | Permission | Already in rbac.js? |
|---|---|---|
| GET /nashir-store-profile | `nashir.store.read` | YES |
| GET /nashir-products | `nashir.product.read` | YES |
| GET /nashir-products/{productId} | `nashir.product.read` | YES |

No new permission codes are needed. No changes to src/rbac.js are permitted.

### RBAC restrictions enforced

- **No new permission codes.** The 28 active V1 codes cover Slice 0 requirements.
- **No service actor.** All actions are human-actor requests with X-User-Id header.
- **No `nashir.integration.*` activation.** These remain Post-V1 and must not appear.
- **No broadening of owner/admin/creator/reviewer/publisher role grants.** Existing rolePermissions map is authoritative.

### 404 vs 403 non-disclosure

- `nonDisclosingMembershipCheck` returns 404 (NOT_FOUND) when the user is not a workspace member.
- `permissionGuard` returns 403 (PERMISSION_DENIED) when the user is a member but lacks the required permission.
- Resource not found (e.g., product not in workspace) returns 404 via `notFound()` helper.
- Cross-workspace record isolation is enforced by `WHERE workspace_id = $1` in the repository query.

### Self-approval denial

NOT APPLICABLE for Slice 0. Read-only store profile and product routes do not involve approval decisions. Self-approval denial is reserved for content review routes in a future slice.

---

## 11. Workspace/Tenant Isolation Plan

*No implementation here. This section defines the implementation requirements.*

| Requirement | Implementation rule |
|---|---|
| Source of workspaceId | Route path parameter only: `workspaceMatch[1]` from path regex |
| Body workspaceId rejection | rejectBodyWorkspaceId enforced on write routes; not needed for GET routes |
| SQL WHERE workspace_id | Every query must include `WHERE workspace_id = $1` as the first filter |
| Options to pool.query | All calls must pass `{ workspaceId }` to trigger setWorkspaceContext |
| Composite FK assumptions | Product queries return only products belonging to workspace's store profile; store_profile_id ties products to workspace |
| Cross-workspace isolation test | Repository test must confirm that a record from workspace B is not visible when querying workspace A |
| Non-disclosing 404 | Not-found on store profile (workspace has no active store profile) or product (ID not in workspace) returns null from repository; route sends 404 NOT_FOUND |

---

## 12. Error Model Plan

*No implementation here. This section defines the implementation requirements.*

All error responses use `AppError(status, code, message, userAction)` from `src/error-model.js`.

| Scenario | HTTP status | Code | Notes |
|---|---|---|---|
| Missing X-User-Id header | 401 | `AUTH_REQUIRED` | authGuard |
| User not found in store | 401 | `AUTH_REQUIRED` | authGuard |
| User not workspace member | 404 | `NOT_FOUND` | nonDisclosingMembershipCheck (prevents enumeration) |
| Missing permission | 403 | `PERMISSION_DENIED` | permissionGuard |
| Product/profile not in workspace | 404 | `NOT_FOUND` | notFound() helper in route handler |
| DB query failure | 500 | `INTERNAL_ERROR` | toRepositoryError() in repository; raw DB error never surfaced |
| Validation failure | 422 | `VALIDATION_FAILED` | requireFields() / requireOnlyFields() if write paths added |
| Body workspace_id mismatch | 422 | `TENANT_CONTEXT_MISMATCH` | rejectBodyWorkspaceId() on write paths only |
| Workspace context missing | 400 | `TENANT_CONTEXT_MISSING` | workspaceContextGuard |
| Internal/unexpected | 500 | `INTERNAL_ERROR` | Catch-all in createApp() |

**Gone/410:** Not applicable for Slice 0. TTL-expired entity handling is a Creator Studio concern deferred to a later slice.

---

## 13. Audit/Evidence Plan

**Audit is NOT required for Slice 0 read-only paths.**

Rationale:
- GET requests to list or read store profiles and products do not create, update, or delete records.
- The existing audit pattern in `src/router.js` is `audit(store, workspaceId, user, action, entityType, entityId, before, after)` — this is called only on mutations.
- The `audit_logs` table in the base schema stores audit entries; no new audit schema is needed.
- Reading product or store profile data does not constitute a sensitive operation per the Nashir Auth/RBAC gate.

**If write paths are added in a future slice (Option B):** `nashir_product.created`, `nashir_store_profile.created`, and `nashir_store_profile.updated` audit events must be written using the existing `audit()` helper pattern.

---

## 14. Data Access and SQL Readiness Plan

### Required tables — Slice 0

| Table | Patch | Key columns for reads | Key indexes |
|---|---|---|---|
| `nashir_store_profiles` | 006 | workspace_id, store_profile_id, store_name, store_url, store_profile_status, created_at | idx_nashir_store_profiles_workspace; uq_nashir_store_profiles_active_per_workspace (partial unique) |
| `nashir_products` | 006 | workspace_id, product_id, store_profile_id, product_name, product_url, product_status, created_at | idx_nashir_products_workspace; idx_nashir_products_workspace_status |

### Status/lifecycle columns

- `store_profile_status`: ENUM ('active','suspended','archived'). Read-only path returns all; no status filter enforced at DB layer by default. Implementation should decide whether to filter archived records at service layer.
- `product_status`: ENUM ('draft','active','archived'). Implementation should consider whether archived products appear in list results.

### Soft-delete filters

Store profiles use `store_profile_status` rather than a `deleted_at` column. Products use `product_status`. Service layer must decide whether to filter `archived` records from list results; this is a product decision to be confirmed in the implementation PR.

### TTL considerations

NOT APPLICABLE for Slice 0. Store profiles and products have no TTL/expiry mechanism.

### Migration verification dependency

The `nashir_store_profiles` and `nashir_products` tables are created by Patch 006. This patch runs after Patches 001–005. Before Backend Slice 0 Implementation can be verified against a real database:

1. `DATABASE_URL` must be set to a live PostgreSQL instance.
2. `npm run db:migrate:strict` must complete without errors.
3. The nashir_store_profiles and nashir_products tables must be confirmed present.

**This is watch item W-BSLICE01 below.** It is not required to write the implementation PR, but it must be resolved before the implementation is merged.

---

## 15. Test Plan

*No tests are written here. This section defines the future test requirements.*

### Repository tests

File candidates: `test/nashir-store-profile-repository.test.js`, `test/nashir-product-repository.test.js`

Pattern: `test/nashir-campaign-repository.test.js` (pool-double pattern; synchronous mock; no live DB required).

Required coverage:
- Constructor requires pool; throws on missing pool.
- `listByWorkspace({ workspaceId })` returns only records matching workspaceId.
- `listByWorkspace({ workspaceId })` returns empty array when workspaceId matches no records.
- `findById({ workspaceId, id })` returns null for non-existent IDs.
- `findById({ workspaceId, id })` returns null for IDs from a different workspace (cross-workspace isolation).
- `findById({ workspaceId, id })` returns the matching record with correct fields.
- All queries pass `{ workspaceId }` as pool.query options.
- DB failures are caught and surfaced as AppError(500, INTERNAL_ERROR) via toRepositoryError.

### Route tests

File candidate: `test/nashir-store-product-route.test.js` or extend `test/nashir-route.test.js`

Pattern: `test/nashir-route.test.js` (HTTP handler with mocked nashir service/repository; no live DB required).

Required coverage:
- GET /nashir-store-profile returns 404 for non-member user (nonDisclosingMembershipCheck).
- GET /nashir-store-profile returns 403 for member without nashir.store.read permission.
- GET /nashir-store-profile returns 200 with store profile data for authorized member.
- GET /nashir-store-profile returns 404 when workspace has no active store profile.
- GET /nashir-products returns 200 with product list for authorized member.
- GET /nashir-products returns 200 with empty array when no products exist.
- GET /nashir-products/{productId} returns 404 for non-existent product.
- GET /nashir-products/{productId} returns 404 for product belonging to different workspace.
- Correlation ID appears in error responses.

### RBAC permission tests

No new entries in `test/nashir-rbac-permission-mapping.test.js` are required because `nashir.store.read` and `nashir.product.read` are already tested in the 210-assertion RBAC test suite.

### Workspace isolation tests

Repository tests must assert that `pool.queries[0].options` equals `{ workspaceId }` (confirming workspace context is passed). This pattern is established in `test/nashir-campaign-repository.test.js` line 86.

### Reject body workspaceId tests

NOT REQUIRED for GET routes. Required for future write routes.

### Non-disclosure tests

Route test must confirm that GET requests from a non-member user receive 404 NOT_FOUND (not 403 PERMISSION_DENIED), confirming nonDisclosingMembershipCheck behavior.

---

## 16. Verification Plan for Implementation Slice

When the Backend Slice 0 Implementation PR is submitted, the following verification commands must all pass:

```bash
git diff --check                             # No whitespace errors
npm test                                     # All unit tests pass (including new repo/route tests)
npm run db:seed                              # RBAC seed generates cleanly
npm run verify:strict                        # Full strict verification passes
# If DATABASE_URL is set:
npm run db:migrate:strict                    # Full migration chain succeeds
# Targeted test runs:
node --test test/nashir-store-profile-repository.test.js
node --test test/nashir-product-repository.test.js
node --test test/nashir-store-product-route.test.js  # or applicable file
# Forbidden file grep:
git diff --name-only | grep -E "server\.js|router\.js(?!.*nashir)|guards\.js|error-model\.js|rbac\.js|prototype/|package\.json|openapi\.yaml|patch_\d{3}\.sql"
# Patch 012 guard:
grep -c "schema_patch_012" scripts/db-migrate.js docs/07_database_schema.sql
# Status:
git status --short
```

**Note on `db:migrate:strict`:** If DATABASE_URL is unavailable in CI, the migration verification step fails with exit code 1 as a known environment constraint. This must be resolved before merge by running against a real PostgreSQL instance.

---

## 17. Rollback Plan

| Scenario | Rollback action |
|---|---|
| Implementation PR introduces a failing test | Revert the implementation PR; SQL patches are not affected |
| Route causes unexpected behavior in production-like testing | Revert the implementation PR; in-memory runtime is the default and unaffected |
| Repository introduces a query regression | Revert the implementation PR; no DB state is altered by a read-only repository slice |
| Package changes needed unexpectedly | Stop and report; do not add packages without a separately approved gate |
| Migration chain breaks | SQL patches are not modified by Backend Slice 0; this cannot occur as a result of Slice 0 implementation |
| Production/pilot data impact | NOT APPLICABLE — repository is NO-GO for production/pilot |

**No migration rollback is needed.** Backend Slice 0 must not modify SQL patch files.

---

## 18. Blocking Findings Before Backend Implementation

| Blocker | Description | Resolution |
|---|---|---|
| **B-BS01** | This planning gate must merge before implementation begins. | Merge this document. |
| **B-BS02** | Exact allowed file list must be confirmed against actual `src/` directory before implementation PR opens. File candidates in Section 8 are TBD and must be verified. | Implementation PR author reads `src/` structure before editing. |
| **B-BS03** | `db:migrate:strict` must succeed against a real PostgreSQL instance before implementation PR is merged. If DATABASE_URL is absent, migration verification is environment-blocked. | Set DATABASE_URL and run `npm run db:migrate:strict` against a live PostgreSQL instance with fresh schema. Confirm `nashir_store_profiles` and `nashir_products` tables exist. |
| **B-BS04** | OpenAPI canonical path adoption is blocked until Nashir OpenAPI Migration Planning Gate closes. Route paths for Slice 0 must use marketing-os-internal naming (`/nashir-store-profile`, `/nashir-products`) consistent with existing `/nashir-campaigns` convention, not the nashir_v1_openapi.yaml canonical paths (`/products`, `/assets`). | Implementation PR must use internal naming; note the future reconciliation path. |
| **B-BS05** | `test/nashir-prewiring-contract.test.js` currently blocks unapproved Nashir routes. The implementation PR must ensure the prewiring contract test still passes with any new route additions. | Add new route path strings to the `nashirRoutes` array in `src/router.js` and the corresponding approved list in `test/nashir-prewiring-contract.test.js` (if that test checks for route list coverage). |

---

## 19. Watch Items

| ID | Item | Severity | Action |
|---|---|---|---|
| W-BSLICE01 | `db:migrate:strict` requires real PostgreSQL + DATABASE_URL before implementation can be verified end-to-end at DB layer. | MEDIUM | Resolve before implementation PR merge; not required to open the PR. |
| W-BSLICE02 | Nashir V1 OpenAPI authority remains in nashir-ui-prototype. Route path reconciliation (internal `/nashir-products` vs canonical `/products`) is deferred to Nashir OpenAPI Migration Planning Gate. | LOW | Carry to OpenAPI Migration Planning Gate. |
| W-BSLICE03 | `nashir_store_profiles` partial unique constraint (`WHERE store_profile_status <> 'archived'`) means a workspace may have no active store profile. Read route must handle this gracefully (return 404 or empty when no active profile exists). | LOW | Confirm behavior in implementation: return 404 for GET /nashir-store-profile when no active store profile exists. |
| W-BSLICE04 | `fk_nashir_routing_rules_provider_workspace` is non-nullable. AI providers must be registered before routing rules can be created. This is a Backend Slice 2+ concern but must be noted in any seed/fixture strategy. | LOW | Carry to model routing implementation slice. |
| W-BSLICE05 | Creator Studio TTL cleanup (expiry enforcement for sessions, drafts) is not addressed by schema alone. Runtime behavior must be planned separately. | LOW | Carry to Creator Studio implementation slice. |
| W-BSLICE06 | 410 Gone behavior for expired TTL entities is a backend/API concern deferred to Creator Studio slice. | LOW | Carry to Creator Studio slice. |
| W-BSLICE07 | Patch 012 (workflow definitions) remains deferred. The migration runner and schema wrapper correctly exclude it. | LOW | No action; carry if future planning approves. |
| W-BSLICE08 | OpenAPI migration planning and generated client update gates remain after Backend Slice 0. | LOW | Carry to Nashir OpenAPI Migration Planning Gate. |
| W-BSLICE09 | UI API integration remains blocked until backend routes exist and auth provider strategy is confirmed. | LOW | Carry to Nashir UI API Integration Planning Gate. |

---

## 20. Readiness Assessment

| Dimension | Assessment | Notes |
|---|---|---|
| Repository pattern | **READY** | NashirCampaignRepository pattern is established and clean |
| Route pattern | **READY** | routeNashir() is the proven template; guard chain confirmed |
| Guard pattern | **READY** | All 6 guard functions available in src/guards.js; nonDisclosingMembershipCheck confirmed for Nashir |
| RBAC readiness | **READY** | nashir.store.read and nashir.product.read already in src/rbac.js; no permission gate needed |
| SQL readiness | **READY WITH WATCH ITEM** | Patch 006 tables pass structural validation; db:migrate:strict blocked by DATABASE_URL (W-BSLICE01) |
| OpenAPI dependency | **WATCH ITEM** | Slice 0 uses internal path naming; not blocked; reconciliation deferred to OpenAPI gate (W-BSLICE02) |
| DB verification | **WATCH ITEM** | Non-DB tests all pass; real DB migration required before merge (W-BSLICE01) |
| Test readiness | **READY** | Pool-double pattern established; route test pattern established; no live DB needed for unit tests |
| Runtime boundary safety | **READY** | No runtime changes in this planning gate; implementation scope is strictly limited |

**Overall readiness for Backend Slice 0 Implementation: READY WITH WATCH ITEMS**

The planning gate is complete. W-BSLICE01 (DATABASE_URL) must be resolved before the implementation PR merges. All other watch items are non-blocking for implementation.

---

## 21. Required Follow-up Gates

| Priority | Gate | Dependency | Rationale |
|---:|---|---|---|
| 1 | **Nashir Backend Slice 0 Implementation** | This planning gate merged; B-BS01 through B-BS05 resolved | Implements NashirStoreProfileRepository + NashirProductRepository + read-only GET routes |
| 2 | **Nashir Backend Slice 0 Review Gate** | Slice 0 Implementation | Reviews implemented repositories, routes, tests, guard chain, workspace isolation |
| 3 | **Nashir Backend Slice 1 Planning Gate** | Slice 0 verified | Plans write paths (create product, update product, asset library) and any content read-only extension |
| 4 | **Nashir OpenAPI Migration Planning Gate** | Backend Slice 0 Planning + Slice 0 Implementation | Plans movement of OpenAPI authority from nashir-ui-prototype to marketing-os; route path reconciliation |
| 5 | **Nashir Generated Types Input Update Gate** | OpenAPI Migration Planning Gate | Approves update to generated types input |
| 6 | **Nashir UI API Integration Planning Gate** | Backend routes exist and verified | Plans how nashir-ui-prototype calls Nashir V1 API |

No Backend Slice 0 Planning Fix Gate is required. No blocking issues were found in the planning gate itself. B-BS01 through B-BS05 are implementation-time conditions, not planning blockers.

---

## 22. Final Decision

### Final decision

| Area | Status |
|---|---|
| **Review result** | **READY WITH WATCH ITEMS** |
| Blocking findings (in this planning gate) | **NONE** |
| **GO to Nashir Backend Slice 0 Implementation** | **CONDITIONAL GO — resolve B-BS01 through B-BS05 before merge** |
| Backend Slice 0 Implementation | **CONDITIONAL GO — see blocker list in Section 18** |
| OpenAPI migration | **NO-GO until Nashir OpenAPI Migration Planning Gate closes** |
| UI API integration | **NO-GO until backend routes exist and are verified** |
| Production / Pilot | **NO-GO** |
| External publishing runtime | **NO-GO** |
| AI provider API calls | **NO-GO** |
| Creator Studio TTL implementation | **NO-GO in Slice 0** |
| Campaign content/approval implementation | **NO-GO in Slice 0** |
| Publishing queue implementation | **NO-GO in Slice 0** |
| Model routing runtime | **NO-GO** |
| New SQL patches | **NO-GO unless separately gated** |
| Changes to src/rbac.js | **NO-GO unless Auth/RBAC Implementation Gate approves** |
| Changes to guards.js or error-model.js | **NO-GO** |
| Sprint 5 coding beyond slice scope | **NO-GO** |

### GO / NO-GO summary

```text
CONDITIONAL GO:  Nashir Backend Slice 0 Implementation with conditions:
                 - This planning gate merges (B-BS01).
                 - Allowed file list confirmed against src/ (B-BS02).
                 - db:migrate:strict verified against real PostgreSQL before merge (B-BS03).
                 - Route paths use internal /nashir-* naming, not OpenAPI canonical paths (B-BS04).
                 - Prewiring contract test confirmed to still pass with new routes (B-BS05).
NO-GO:  OpenAPI migration until Nashir OpenAPI Migration Planning Gate closes.
NO-GO:  UI API integration until backend routes exist and auth provider is confirmed.
NO-GO:  Creator Studio, content review/approval, publishing queue, model routing.
NO-GO:  New SQL patches without a separately gated fix/extension slice.
NO-GO:  Production readiness. Pilot readiness. Sprint 5 coding beyond slice scope.
WATCH:  db:migrate:strict requires DATABASE_URL; resolve before implementation PR merge.
WATCH:  OpenAPI path reconciliation deferred to OpenAPI Migration Planning Gate.
WATCH:  Store profile absence (workspace has no active store) → 404 behavior must be confirmed.
```

### Recommended Slice 0 — explicit selection

**Nashir Store Profile and Product Read-Only Repository + Route Extension**

- Repositories: `NashirStoreProfileRepository`, `NashirProductRepository`
- Routes: `GET /workspaces/{workspaceId}/nashir-store-profile`, `GET /workspaces/{workspaceId}/nashir-products`, `GET /workspaces/{workspaceId}/nashir-products/{productId}`
- Permissions: `nashir.store.read`, `nashir.product.read`
- Guard chain: authGuard → workspaceContextGuard → nonDisclosingMembershipCheck → permissionGuard
- Audit events: None (read-only)
- Self-action denial: Not applicable
- New packages: None
- SQL changes: None

### Next gate

**Nashir Backend Slice 0 Implementation**

That implementation PR must:
- Create `NashirStoreProfileRepository` and `NashirProductRepository` following `NashirCampaignRepository` pattern.
- Register both in `src/repositories/index.js`.
- Add GET route handlers for `/nashir-store-profile` and `/nashir-products` following `routeNashir()` pattern in `src/router.js`.
- Pass `{ workspaceId }` to all pool.query calls.
- Add repository tests using pool-double pattern.
- Add route tests using existing nashir-route.test.js pattern.
- Confirm `db:migrate:strict` passes against real PostgreSQL (B-BS03).
- Not modify src/rbac.js, guards.js, error-model.js, SQL patches, schema wrapper, migration runner, OpenAPI files, or package files.
- Pass `npm run verify:strict` (with DATABASE_URL for the migration step).
