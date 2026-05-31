# Nashir SQL Schema Implementation Review Gate

| Field | Value |
|---|---|
| Gate type | SQL Schema Implementation Review Gate — documentation only |
| Status date | 2026-05-31 |
| Scope | Reviews the merged Nashir SQL Schema Implementation Slice from PR #267 before authorizing Backend Slice 0 Planning |
| Implementation reviewed | PR #267 — SQL: Implement Nashir schema patches |
| SQL added in this gate | NO |
| SQL modified in this gate | NO |
| Backend routes implemented | NO |
| Auth middleware implemented | NO |
| OpenAPI YAML changes | NO |
| UI changes | NO |
| Generated files changed | NO |
| marketing-os | Read-only in this review gate |

---

## 1. Status and Scope

This is a SQL Schema Implementation Review Gate only.

**The SQL implementation has already merged through PR #267. This gate reviews what was merged, not what to implement next.**

**No SQL is added or modified by this document.**

**No backend, runtime, auth, API, UI, or OpenAPI work is approved by this document.**

**No Pilot or Production readiness is claimed.**

**Backend Slice 0 Planning remains blocked until this review gate closes.**

This gate answers:

> Is the merged Nashir SQL Schema Implementation Slice structurally safe, idempotent, workspace-isolated, referentially complete, RBAC-aligned, and sufficiently verified to proceed to Backend Slice 0 Planning?

---

## 2. Source Inputs Reviewed

### Verified — henter36/marketing-os (local)

| Source | Finding |
|---|---|
| `README.md` | Contract-first; Pilot/Production NO-GO; Sprint 5 NO-GO; RBAC pattern operational |
| `AGENTS.md` | Documentation PRs must not touch src/rbac.js, guards.js without a gate; stop on source conflict |
| `package.json` | pg ^8.20.0; node >=20; `npm run verify:strict`, `npm run db:migrate:strict`, `npm run db:seed` confirmed present |
| `docs/17_change_log.md` | PR #267 entry is present; entry is accurate |
| `docs/07_database_schema.sql` | Includes `\i` references for patches 001–011; ordering matches `scripts/db-migrate.js`; no Patch 012 reference |
| `scripts/db-migrate.js` | `migrations` array: base schema + patches 001–011; advisory lock in place; strict mode present; no Patch 012 entry |
| `scripts/db-seed.js` | Imports roles/permissions/rolePermissions from `src/rbac.js`; builds SQL; DELETE+re-INSERT pattern for role_permissions; idempotent |
| `src/rbac.js` | 28 active V1 nashir.* permission codes; 7 workspace-scoped system roles; hasPermission function intact |
| `test/sprint0.test.js` | Migration order assertion updated to include patches 005–011; passes |
| `test/nashir-prewiring-contract.test.js` | APPROVED_NASHIR_CODES updated from 4 to 28 codes; regex updated to capture multi-segment codes; passes |
| `test/nashir-rbac-permission-mapping.test.js` | 28 codes × 7 roles = 196 per-code assertions + 14 structural tests = 210 assertions; passes |
| `test/nashir-sql-schema-patch-validation.test.js` | 84 structural SQL validation tests (no DB required); passes |
| `docs/marketing_os_v5_6_5_phase_0_1_schema_patch_001.sql` | Base approval-decision and evidence-invalidation corrections; unmodified by PR #267 |
| `docs/marketing_os_v5_6_5_phase_0_1_schema_patch_002.sql` | Patch 002 connector/contact/notification schema; unmodified by PR #267 |
| `docs/marketing_os_v5_6_5_phase_0_1_schema_patch_003.sql` | Nashir evidence/lifecycle tables; unmodified by PR #267 |
| `docs/marketing_os_v5_6_5_phase_0_1_schema_patch_004.sql` | Nashir campaigns table; unmodified by PR #267 |
| `docs/marketing_os_v5_6_5_phase_0_1_schema_patch_005.sql` | RBAC seed compatibility; BEGIN/COMMIT only; no DDL |
| `docs/marketing_os_v5_6_5_phase_0_1_schema_patch_006.sql` | Store profiles, products, assets, data sources, integration connections; store_profile_id nullable addition to nashir_campaigns |
| `docs/marketing_os_v5_6_5_phase_0_1_schema_patch_007.sql` | Campaign content items, content-asset junction, preview artifacts, content review decisions |
| `docs/marketing_os_v5_6_5_phase_0_1_schema_patch_008.sql` | Publishing queue items |
| `docs/marketing_os_v5_6_5_phase_0_1_schema_patch_009.sql` | Prompt templates and governance versions |
| `docs/marketing_os_v5_6_5_phase_0_1_schema_patch_010.sql` | Creator Studio TTL entities (9 tables) |
| `docs/marketing_os_v5_6_5_phase_0_1_schema_patch_011.sql` | AI providers, model routing rules, cost usage records |
| Patch 012 deferred | `schema_patch_012.sql` does not exist; no reference in db-migrate.js or 07_database_schema.sql |

### Verification commands run

| Command | Result |
|---|---|
| `git diff --check` | CLEAN — no whitespace errors |
| `git diff --name-only` | (empty — branch HEAD equals main post-merge) |
| `npm test` | 669 pass, 0 fail |
| `npm run test:integration` | 52 pass, 0 fail (40 skipped: DATABASE_URL absent) |
| `npm run db:seed` | Seed SQL generated correctly; roles + 28 nashir.* codes + non-nashir codes all present |
| `npm run verify:strict` | Sprint 0 baseline: PASS; OpenAPI lint strict: PASS (94 permissions checked); tests: 669 pass; db:migrate:strict: **BLOCKED** by missing DATABASE_URL |
| `npm run db:migrate:strict` | **BLOCKED** — `DATABASE_URL is required for strict Sprint 0 migration execution.` — environment not code |
| Migration list check | Patches 005–011 confirmed in runner; Patch 012 confirmed absent |

---

## 3. Review Question

**Is the merged Nashir SQL Schema Implementation Slice structurally safe, idempotent, workspace-isolated, referentially complete, RBAC-aligned, and sufficiently verified to proceed to Backend Slice 0 Planning?**

**Review verdict: YES, with watch items.**

No blocking findings prevent progression to Backend Slice 0 Planning. The single watch item of note is that `db:migrate:strict` was blocked by the absence of a local `DATABASE_URL`. This is an environment constraint, not a code defect. All other verification dimensions passed. Five non-blocking watch items are recorded.

---

## 4. Changed Files Review

PR #267 changed 15 files. All 15 are reviewed below.

| File | Purpose | Allowed by planning gate? | Review status | Notes |
|---|---|---|---|---|
| `docs/marketing_os_v5_6_5_phase_0_1_schema_patch_005.sql` | RBAC seed compatibility; documents 28 active V1 nashir.* codes; no DDL | YES | **PASS** | No stale "four Nashir codes" language; correctly notes 28 codes and deferred integration codes |
| `docs/marketing_os_v5_6_5_phase_0_1_schema_patch_006.sql` | Store profiles, products, intelligence snapshots, data sources, integration connections, assets; nullable store_profile_id on nashir_campaigns | YES | **PASS** | All workspace-scoped FKs present; vault_ref/secret_ref only; all ALTER TABLE ADD CONSTRAINT guarded |
| `docs/marketing_os_v5_6_5_phase_0_1_schema_patch_007.sql` | Campaign content items, composite-PK content-asset junction, preview artifacts, content review decisions | YES | **PASS** | Composite PK confirmed; no uuid[] columns; self-approval denial CHECK constraint present |
| `docs/marketing_os_v5_6_5_phase_0_1_schema_patch_008.sql` | Publishing queue items referencing approved review decisions | YES | **PASS** | human_confirmed_at/by_user_id present; no external publishing runtime |
| `docs/marketing_os_v5_6_5_phase_0_1_schema_patch_009.sql` | Nashir prompt templates and governance versions | YES | **PASS** | Defined before Creator Studio (Patch 010); partial unique on (prompt_template_id, version_number) excluding archived/deprecated |
| `docs/marketing_os_v5_6_5_phase_0_1_schema_patch_010.sql` | Creator Studio TTL entities: sessions, ideas, angles, audience segments, publish windows, context drafts, transfer drafts, readiness assessments | YES | **PASS** | All prompt_template_id FKs guarded; all campaign FKs workspace-scoped and guarded; expires_at on all TTL tables; no clock-predicate partial indexes |
| `docs/marketing_os_v5_6_5_phase_0_1_schema_patch_011.sql` | AI providers (no credentials), model routing rules, cost usage records | YES | **PASS** | No API key columns; model routing → AI provider FK workspace-scoped; cost usage FKs to campaign/session/provider workspace-scoped |
| `docs/07_database_schema.sql` | Schema wrapper; adds `\i` references for patches 005–011 | YES | **PASS** | Ordering matches db-migrate.js exactly; no Patch 012 reference |
| `scripts/db-migrate.js` | Migration runner; extends migrations array to include patches 005–011 | YES | **PASS** | Advisory lock preserved; strict mode preserved; Patch 012 not included |
| `src/rbac.js` | RBAC seed source; adds 24 new nashir.* codes (28 total active V1) to permissions array; extends rolePermissions for creator, reviewer, publisher, billing_admin, viewer | YES | **PASS** | Owner/admin get all via existing map/filter; 28 codes confirmed; no integration codes; no service actor |
| `test/nashir-rbac-permission-mapping.test.js` | Extended to cover all 28 nashir.* codes × 7 roles = 196 assertions + 14 structural tests = 210 assertions | YES | **PASS** | All assertions verified; structural invariants include reviewer RA pattern and creator/approval separation |
| `test/nashir-sql-schema-patch-validation.test.js` | 84 structural SQL validation tests; checks presence, idempotency, workspace_id, composite PK, FK constraints, no uuid[] arrays, no raw secrets, bare-ALTER guard | YES | **PASS** | workspace_id NOT NULL tests inspect actual table body (not just table existence); FK constraint tests present; stripDoBlocks guard test present |
| `test/sprint0.test.js` | Updated migration order assertion from 5-patch to 12-patch expected list | YES | **PASS** | Assertion matches confirmed runtime migrations array |
| `test/nashir-prewiring-contract.test.js` | APPROVED_NASHIR_CODES updated from 4 to 28; regex updated for multi-segment codes | YES | **PASS** | Guard test still active; no widening of approved route or OpenAPI scope |
| `docs/17_change_log.md` | PR #267 entry added | YES | **PASS** | Entry accurately describes all 15 changed files and explicit scope boundaries |

---

## 5. Migration Runner and Wrapper Review

**Verified: scripts/db-migrate.js**

```text
migrations = [
  base schema,
  patch_001, patch_002, patch_003, patch_004,
  patch_005, patch_006, patch_007, patch_008,
  patch_009, patch_010, patch_011
]
```

- Patches 005–011 confirmed present. ✓
- Patch 012 not referenced. ✓
- Advisory lock `pg_advisory_lock(565006, 565001)` preserved. ✓
- Strict mode guard preserved. ✓

**Verified: docs/07_database_schema.sql**

- `\i` references for patches 005–011 added. ✓
- Ordering matches `scripts/db-migrate.js` exactly. ✓
- No Patch 012 reference. ✓
- Comment block describes each patch scope correctly. ✓

**Consistency:** Runner and wrapper are aligned. No divergence. No hidden Patch 012 execution path.

---

## 6. Patch 005 Review — RBAC Seed Compatibility

**Verified facts:**

- Patch 005 consists of `BEGIN;` and `COMMIT;` only. No DDL tables, columns, or enums.
- The comment block states: *"This slice activates 28 V1 nashir.* permission codes."*
- The comment correctly notes reused non-nashir permissions are outside the nashir.* count.
- The comment correctly notes `nashir.integration.*` remains Post-V1 and must not be seeded.
- No stale "four approved Nashir codes" language appears.
- No destination service actor is mentioned or implemented.
- No backend or auth middleware is present.

**Review conclusion:** PASS. Patch 005 is a correct, minimal compatibility marker for the RBAC slice.

---

## 7. Patch 006 Review — Store/Product/Assets/Data Sources/Integrations

**Verified facts:**

**nashir_store_profiles:**
- `workspace_id uuid NOT NULL REFERENCES workspaces(workspace_id)` ✓
- Partial unique index `uq_nashir_store_profiles_active_per_workspace` on `workspace_id WHERE store_profile_status <> 'archived'` — allows soft-delete compatible 1:1 workspace→store in V1. ✓
- Composite unique `(store_profile_id, workspace_id)` enables downstream workspace-scoped FKs. ✓

**nashir_products:**
- `workspace_id uuid NOT NULL` ✓
- `CONSTRAINT fk_nashir_products_store_profile_workspace FOREIGN KEY (store_profile_id, workspace_id) REFERENCES nashir_store_profiles(store_profile_id, workspace_id)` — workspace-scoped, inline. ✓
- Composite unique `(product_id, store_profile_id, workspace_id)` covers downstream FK targets. ✓

**nashir_product_intelligence_snapshots:**
- `workspace_id uuid NOT NULL` ✓
- FK `(product_id, workspace_id) REFERENCES nashir_products(product_id, workspace_id)` — workspace-scoped, inline. ✓
- Append-only by design (no update trigger; comment documents this). ✓

**nashir_data_sources:**
- `workspace_id uuid NOT NULL REFERENCES workspaces(workspace_id)` ✓
- `store_profile_id uuid` — nullable. ✓
- Workspace-scoped FK `fk_nashir_data_sources_store_profile_workspace` on `(store_profile_id, workspace_id)` in guarded DO block. ✓
- No raw ingestion or analytics. ✓

**nashir_integration_connections:**
- `workspace_id uuid NOT NULL REFERENCES workspaces(workspace_id)` ✓
- `store_profile_id uuid` — nullable. ✓
- Workspace-scoped FK `fk_nashir_integration_connections_store_profile_workspace` in guarded DO block. ✓
- `vault_ref varchar(500)` and `secret_ref varchar(500)` only — no raw API keys, tokens, or passwords. ✓
- No `api_key`, `client_secret`, or `password` columns. ✓

**nashir_assets:**
- `workspace_id uuid NOT NULL REFERENCES workspaces(workspace_id)` ✓
- `linked_product_id uuid` — nullable (1:N product→asset). ✓
- FK `fk_nashir_assets_product_workspace` on `(linked_product_id, workspace_id)` in guarded DO block. ✓

**nashir_campaigns store_profile_id addition:**
- `ALTER TABLE nashir_campaigns ADD COLUMN IF NOT EXISTS store_profile_id uuid` — idempotent via IF NOT EXISTS. ✓
- FK `fk_nashir_campaigns_store_profile_workspace` in guarded DO block. ✓

**Review conclusion:** PASS. All workspace-scoped FKs present. No raw secrets. All ALTER TABLE ADD CONSTRAINT guarded.

---

## 8. Patch 007 Review — Campaign Content and Review

**Verified facts:**

**nashir_campaign_content_items:**
- `workspace_id uuid NOT NULL` ✓
- FK `fk_nashir_content_items_campaign_workspace` on `(nashir_campaign_id, workspace_id)` — workspace-scoped, inline. ✓

**nashir_campaign_content_assets:**
- `PRIMARY KEY (campaign_content_id, asset_id)` — composite PK, not standalone UUID. ✓
- `workspace_id uuid NOT NULL` included for tenant enforcement at join layer. ✓
- FK `fk_nashir_content_assets_content_workspace` on `(campaign_content_id, workspace_id)` — workspace-scoped. ✓
- FK `fk_nashir_content_assets_asset_workspace` on `(asset_id, workspace_id)` — workspace-scoped. ✓
- No `uuid[]` arrays anywhere in patch. ✓

**nashir_preview_artifacts:**
- No `asset_ids uuid[]` column. Each artifact is a row with FK to one content item. ✓
- FK `fk_nashir_preview_artifacts_content_workspace` on `(campaign_content_id, workspace_id)` — workspace-scoped. ✓

**nashir_content_review_decisions:**
- `content_actor_user_id uuid REFERENCES users(user_id)` — records the content creator. ✓
- `reviewer_user_id uuid NOT NULL REFERENCES users(user_id)` — records the approver. ✓
- `CONSTRAINT chk_nashir_content_review_no_self_approval CHECK (content_actor_user_id IS NULL OR reviewer_user_id <> content_actor_user_id)` — SQL-level self-approval denial when actor is known. ✓
- `CONSTRAINT chk_nashir_content_review_rejection_reason` — requires reason for rejections. ✓
- No automatic publishing of any kind. ✓

**Review conclusion:** PASS. Composite PK correct. No uuid[] patterns. Self-approval denial representable.

---

## 9. Patch 008 Review — Publishing Queue

**Verified facts:**

- `nashir_publishing_queue_items.review_decision_id` FK references `nashir_content_review_decisions(review_decision_id, workspace_id)` — requires an approved review decision before queuing. ✓
- `human_confirmed_at timestamptz` and `human_confirmed_by_user_id uuid REFERENCES users(user_id)` present. ✓
- `CONSTRAINT chk_nashir_publish_queue_confirmed_has_user CHECK (human_confirmed_at IS NULL OR human_confirmed_by_user_id IS NOT NULL)` — confirmation must have an actor. ✓
- `CONSTRAINT chk_nashir_publish_queue_published_confirmed CHECK (published_at IS NULL OR human_confirmed_at IS NOT NULL)` — published items must have been confirmed. ✓
- No external platform publishing implementation. ✓
- `idempotency_key varchar(180)` with unique constraint present. ✓

**Review conclusion:** PASS. Human confirmation fields present and constrained. No publishing automation.

---

## 10. Patch 009 Review — Prompt Templates/Governance

**Verified facts:**

- Patch 009 is defined before Patch 010 (Creator Studio) in the migration sequence. ✓
- `nashir_prompt_templates.workspace_id uuid NOT NULL REFERENCES workspaces(workspace_id)` ✓
- Unique constraint `uq_nashir_prompt_templates_workspace_name` on `(workspace_id, template_name)`. ✓
- Composite unique `(prompt_template_id, workspace_id)` enables downstream workspace-scoped FKs. ✓
- `nashir_prompt_governance_versions`:
  - `CONSTRAINT chk_nashir_prompt_governance_version_positive CHECK (version_number > 0)` ✓
  - Partial unique index `uq_nashir_prompt_governance_active_version` on `(prompt_template_id, version_number) WHERE governance_status NOT IN ('archived', 'deprecated')` — allows version number reuse for archived/deprecated entries only. ✓
  - `audit_ref uuid` — nullable, for future audit correlation. ✓
  - `approved_by_user_id` and `approved_at` fields present for governance record. ✓
- No prompt governance runtime implementation. ✓

**Review conclusion:** PASS. Prompt templates defined before Creator Studio. Partial unique correctly scoped.

---

## 11. Patch 010 Review — Creator Studio TTL Entities

**Verified facts — general:**

- All 9 Creator Studio tables (`sessions`, `content_ideas`, `campaign_angles`, `audience_segments`, `publish_windows`, `context_drafts`, `transfer_drafts`, `readiness_assessments`, plus audit/transfer composite) have `workspace_id NOT NULL`. ✓
- All 8 TTL-managed tables have `expires_at timestamptz NOT NULL`. ✓
- `CONSTRAINT chk_..._expires_after_created CHECK (expires_at > created_at)` on every TTL table. ✓
- No partial index predicate uses `WHERE expires_at > now()`. Indexes use non-terminal status predicates. ✓

**Verified facts — FK idempotency:**

- `fk_nashir_cs_session_prompt_template` on `nashir_creator_studio_sessions` — guarded DO block. ✓
- `fk_nashir_cs_session_campaign_workspace` on `nashir_creator_studio_sessions` — guarded DO block. ✓
- `fk_nashir_cs_transfer_draft_prompt_template` on `nashir_creator_transfer_drafts` — guarded DO block. ✓
- `fk_nashir_cs_transfer_draft_campaign_workspace` on `nashir_creator_transfer_drafts` — guarded DO block. ✓

**Verified facts — campaign FKs:**

- `fk_nashir_cs_idea_campaign_workspace` on `nashir_creator_content_ideas.(nashir_campaign_id, workspace_id)` → `nashir_campaigns` — guarded, nullable. ✓
- `fk_nashir_cs_angle_campaign_workspace` on `nashir_creator_campaign_angles.(nashir_campaign_id, workspace_id)` → `nashir_campaigns` — guarded, nullable. ✓
- `fk_nashir_cs_publish_window_campaign_workspace` on `nashir_creator_publish_windows.(nashir_campaign_id, workspace_id)` → `nashir_campaigns` — guarded, nullable. ✓
- `fk_nashir_cs_readiness_campaign_workspace` on `nashir_creator_readiness_assessments.(nashir_campaign_id, workspace_id)` → `nashir_campaigns` — guarded, nullable. ✓

**Verified facts — transfer draft status:**

- `nashir_cs_transfer_draft_status ENUM ('draft','pending_review','approved','rejected','expired')` — `pending_review` included. ✓
- `CONSTRAINT chk_nashir_cs_transfer_draft_review_at_status CHECK (submitted_for_review_at IS NULL OR draft_status IN ('pending_review', 'approved', 'rejected'))` ✓

**Verified facts — no 410 Gone runtime:**

- No HTTP status handling, no API error responses, no router changes. ✓

**Review conclusion:** PASS. All TTL entities have expires_at. All campaign FKs workspace-scoped and guarded. Prompt template FKs guarded. No clock-predicate partial indexes.

---

## 12. Patch 011 Review — Model Routing / AI Providers / Cost Usage

**Verified facts:**

**nashir_ai_providers:**
- `workspace_id uuid NOT NULL REFERENCES workspaces(workspace_id)` ✓
- `capabilities jsonb NOT NULL DEFAULT '{}'::jsonb` — advisory metadata only. ✓
- No `api_key`, `token`, `credential`, `secret`, or `password` columns. ✓
- `CONSTRAINT uq_nashir_ai_providers_workspace_key UNIQUE (workspace_id, provider_key)` — enables workspace-scoped FK from routing rules. ✓

**nashir_model_routing_rules:**
- `workspace_id uuid NOT NULL REFERENCES workspaces(workspace_id)` ✓
- `FK fk_nashir_routing_rules_provider_workspace` on `(workspace_id, provider_key) REFERENCES nashir_ai_providers(workspace_id, provider_key)` — workspace-scoped, guarded. ✓ Routing rules must reference a registered AI provider in the same workspace.
- No model routing runtime or provider API calls. ✓

**nashir_cost_usage_records:**
- `workspace_id uuid NOT NULL REFERENCES workspaces(workspace_id)` ✓
- `nashir_campaign_id uuid` — nullable; `FK fk_nashir_cost_usage_campaign_workspace` on `(nashir_campaign_id, workspace_id)` — workspace-scoped, guarded. ✓
- `session_id uuid` — nullable; `FK fk_nashir_cost_usage_session_workspace` on `(session_id, workspace_id)` → `nashir_creator_studio_sessions` — workspace-scoped, guarded. ✓
- `ai_provider_id uuid` — nullable; `FK fk_nashir_cost_usage_provider_workspace` on `(ai_provider_id, workspace_id)` → `nashir_ai_providers` — workspace-scoped, guarded. ✓
- Records are advisory: no billing or invoice semantics. ✓
- No API keys or credentials. ✓

**Review conclusion:** PASS. No credentials stored. All workspace-scoped FKs present and guarded.

---

## 13. Referential Integrity Review

All FKs use composite `(foreign_key, workspace_id)` columns against composite UNIQUE targets in the parent table. Nullable FKs enforce workspace match when populated.

| Relationship | Constraint name | Workspace-scoped? | Idempotent (guarded)? | Review status | Risk |
|---|---|---|---|---|---|
| nashir_products → nashir_store_profiles | `fk_nashir_products_store_profile_workspace` | YES — `(store_profile_id, workspace_id)` | YES (inline, on new table) | **PASS** | LOW |
| nashir_product_intelligence_snapshots → nashir_products | `fk_nashir_product_intelligence_product_workspace` | YES — `(product_id, workspace_id)` | YES (inline, on new table) | **PASS** | LOW |
| nashir_data_sources → nashir_store_profiles | `fk_nashir_data_sources_store_profile_workspace` | YES — `(store_profile_id, workspace_id)` | YES — DO/IF NOT EXISTS block | **PASS** | LOW — nullable FK |
| nashir_integration_connections → nashir_store_profiles | `fk_nashir_integration_connections_store_profile_workspace` | YES — `(store_profile_id, workspace_id)` | YES — DO/IF NOT EXISTS block | **PASS** | LOW — nullable FK |
| nashir_assets → nashir_products | `fk_nashir_assets_product_workspace` | YES — `(linked_product_id, workspace_id)` | YES — DO/IF NOT EXISTS block | **PASS** | LOW — nullable FK |
| nashir_campaigns → nashir_store_profiles | `fk_nashir_campaigns_store_profile_workspace` | YES — `(store_profile_id, workspace_id)` | YES — DO/IF NOT EXISTS block | **PASS** | LOW — nullable FK |
| nashir_campaign_content_items → nashir_campaigns | `fk_nashir_content_items_campaign_workspace` | YES — `(nashir_campaign_id, workspace_id)` | YES (inline, on new table) | **PASS** | LOW |
| nashir_campaign_content_assets → nashir_campaign_content_items | `fk_nashir_content_assets_content_workspace` | YES — `(campaign_content_id, workspace_id)` | YES (inline, on new table) | **PASS** | LOW |
| nashir_campaign_content_assets → nashir_assets | `fk_nashir_content_assets_asset_workspace` | YES — `(asset_id, workspace_id)` | YES (inline, on new table) | **PASS** | LOW |
| nashir_preview_artifacts → nashir_campaign_content_items | `fk_nashir_preview_artifacts_content_workspace` | YES — `(campaign_content_id, workspace_id)` | YES (inline, on new table) | **PASS** | LOW |
| nashir_content_review_decisions → nashir_campaigns | `fk_nashir_content_review_campaign_workspace` | YES — `(nashir_campaign_id, workspace_id)` | YES (inline, on new table) | **PASS** | LOW |
| nashir_content_review_decisions → nashir_campaign_content_items | `fk_nashir_content_review_content_campaign_workspace` | YES — `(campaign_content_id, nashir_campaign_id, workspace_id)` | YES (inline, on new table) | **PASS** | LOW |
| nashir_publishing_queue_items → nashir_campaigns | `fk_nashir_publish_queue_campaign_workspace` | YES — `(nashir_campaign_id, workspace_id)` | YES (inline, on new table) | **PASS** | LOW |
| nashir_publishing_queue_items → nashir_campaign_content_items | `fk_nashir_publish_queue_content_campaign_workspace` | YES — `(campaign_content_id, nashir_campaign_id, workspace_id)` | YES (inline, on new table) | **PASS** | LOW |
| nashir_publishing_queue_items → nashir_content_review_decisions | `fk_nashir_publish_queue_review_workspace` | YES — `(review_decision_id, workspace_id)` | YES (inline, on new table) | **PASS** | LOW |
| nashir_prompt_governance_versions → nashir_prompt_templates | `fk_nashir_prompt_governance_template_workspace` | YES — `(prompt_template_id, workspace_id)` | YES (inline, on new table) | **PASS** | LOW |
| nashir_creator_studio_sessions → nashir_prompt_templates | `fk_nashir_cs_session_prompt_template` | YES — `(prompt_template_id, workspace_id)` | YES — DO/IF NOT EXISTS block | **PASS** | LOW — nullable FK |
| nashir_creator_studio_sessions → nashir_campaigns | `fk_nashir_cs_session_campaign_workspace` | YES — `(nashir_campaign_id, workspace_id)` | YES — DO/IF NOT EXISTS block | **PASS** | LOW — nullable FK |
| nashir_creator_content_ideas → nashir_creator_studio_sessions | `fk_nashir_cs_idea_session_workspace` | YES — `(session_id, workspace_id)` | YES (inline, on new table) | **PASS** | LOW |
| nashir_creator_content_ideas → nashir_campaigns | `fk_nashir_cs_idea_campaign_workspace` | YES — `(nashir_campaign_id, workspace_id)` | YES — DO/IF NOT EXISTS block | **PASS** | LOW — nullable FK |
| nashir_creator_campaign_angles → nashir_campaigns | `fk_nashir_cs_angle_campaign_workspace` | YES — `(nashir_campaign_id, workspace_id)` | YES — DO/IF NOT EXISTS block | **PASS** | LOW — nullable FK |
| nashir_creator_publish_windows → nashir_campaigns | `fk_nashir_cs_publish_window_campaign_workspace` | YES — `(nashir_campaign_id, workspace_id)` | YES — DO/IF NOT EXISTS block | **PASS** | LOW — nullable FK |
| nashir_creator_transfer_drafts → nashir_prompt_templates | `fk_nashir_cs_transfer_draft_prompt_template` | YES — `(prompt_template_id, workspace_id)` | YES — DO/IF NOT EXISTS block | **PASS** | LOW — nullable FK |
| nashir_creator_transfer_drafts → nashir_campaigns | `fk_nashir_cs_transfer_draft_campaign_workspace` | YES — `(nashir_campaign_id, workspace_id)` | YES — DO/IF NOT EXISTS block | **PASS** | LOW — nullable FK |
| nashir_creator_readiness_assessments → nashir_campaigns | `fk_nashir_cs_readiness_campaign_workspace` | YES — `(nashir_campaign_id, workspace_id)` | YES — DO/IF NOT EXISTS block | **PASS** | LOW — nullable FK |
| nashir_model_routing_rules → nashir_ai_providers | `fk_nashir_routing_rules_provider_workspace` | YES — `(workspace_id, provider_key)` | YES — DO/IF NOT EXISTS block | **PASS** | MEDIUM — non-nullable; routing rules require registered provider |
| nashir_cost_usage_records → nashir_campaigns | `fk_nashir_cost_usage_campaign_workspace` | YES — `(nashir_campaign_id, workspace_id)` | YES — DO/IF NOT EXISTS block | **PASS** | LOW — nullable FK |
| nashir_cost_usage_records → nashir_creator_studio_sessions | `fk_nashir_cost_usage_session_workspace` | YES — `(session_id, workspace_id)` | YES — DO/IF NOT EXISTS block | **PASS** | LOW — nullable FK |
| nashir_cost_usage_records → nashir_ai_providers | `fk_nashir_cost_usage_provider_workspace` | YES — `(ai_provider_id, workspace_id)` | YES — DO/IF NOT EXISTS block | **PASS** | LOW — nullable FK |

**Note on `fk_nashir_routing_rules_provider_workspace`:** This FK is non-nullable (provider_key is NOT NULL on routing rules). Routing rules must reference a registered AI provider in the same workspace. This is intentional design — a routing rule without a registered provider has no execution target — but creates an insertion order dependency: AI providers must be seeded before routing rules. Backend implementation must account for this.

---

## 14. Idempotency Review

| Dimension | Status | Notes |
|---|---|---|
| `CREATE TABLE IF NOT EXISTS` on all new tables | **PASS** | Test confirms all CREATE TABLE statements use IF NOT EXISTS in patches 006–011 |
| `CREATE UNIQUE INDEX IF NOT EXISTS` / `CREATE INDEX IF NOT EXISTS` | **PASS** | All index statements use IF NOT EXISTS |
| `DO $$ BEGIN CREATE TYPE ... EXCEPTION WHEN duplicate_object` | **PASS** | All ENUM types use idempotent guard |
| `ALTER TABLE ADD COLUMN IF NOT EXISTS` | **PASS** | Only one instance (store_profile_id on nashir_campaigns); uses IF NOT EXISTS |
| `ALTER TABLE ADD CONSTRAINT` — guarded by DO/IF NOT EXISTS | **PASS** | All 14 guarded instances confirmed; `stripDoBlocks` test confirms no bare ALTER TABLE ADD CONSTRAINT in patches 006, 010, 011 |
| `BEGIN; ... COMMIT;` wrapper on all patches | **PASS** | All 7 Nashir patches have transaction wrapper |

**CodeRabbit's previous idempotency concern regarding bare `ALTER TABLE ADD CONSTRAINT` is resolved.** The fix incorporated DO/IF NOT EXISTS guards on all such statements.

---

## 15. Workspace/Tenant Isolation Review

| Check | Status | Notes |
|---|---|---|
| All persisted Nashir business tables include `workspace_id` | **PASS** | Confirmed in all tables across patches 006–011; test verifies table body |
| `workspace_id` is always `NOT NULL` on business tables | **PASS** | No nullable workspace_id in any new Nashir table |
| All inter-table FKs use composite `(foreign_key, workspace_id)` | **PASS** | 29 FKs across patches 006–011; all workspace-scoped |
| Nullable FKs enforce workspace match when populated | **PASS** | PostgreSQL composite FK skips NULL component; when populated it must match the same workspace |
| No globally unscoped Nashir business table | **PASS** | Every table carries workspace_id |
| `workspace_id` body from request: never trusted | **PASS** | No server/router/guards changes; rejectBodyWorkspaceId remains in effect |

---

## 16. RBAC Review

**Verified facts:**

- `src/rbac.js` contains exactly **28** distinct `nashir.*` permission codes. ✓ (confirmed via `grep -o "nashir\.[a-zA-Z0-9_.-]*" src/rbac.js | sort -u | wc -l`)
- Full list:

```text
nashir.admin.manage           nashir.model_routing.manage
nashir.approval.decide        nashir.model_routing.read
nashir.asset.link             nashir.product.read
nashir.asset.read             nashir.product.write
nashir.asset.write            nashir.prompt_governance.manage
nashir.campaign.read          nashir.prompt_governance.read
nashir.campaign.write         nashir.publishing.draft.receive
nashir.content.create         nashir.publishing.queue.read
nashir.content.read           nashir.store.read
nashir.content.submit_review  nashir.store.update
nashir.content.update         nashir.workflow.read
nashir.cost.manage            nashir.creator_studio.transfer.create
nashir.cost.read              nashir.creator_studio.use
nashir.evidence.manage        nashir.evidence.submit
```

- `nashir.integration.connect` and `nashir.integration.manage` are **not present** — correctly deferred as Post-V1. ✓
- Reused non-nashir codes (`workspace.read`, `workspace.manage`, `workspace.manage_members`, `rbac.read`, `audit.read`) are not counted in the nashir.* total. ✓
- No unapproved Nashir permission codes. ✓
- No destination service actor. ✓

**Role boundary verification:**

| Role | nashir.approval.decide | nashir.content.create | nashir.model_routing.read | nashir.cost.read | Reviewer RA (evidence.manage) |
|---|---|---|---|---|---|
| owner | YES | YES | YES | YES | YES |
| admin | YES | YES | YES | YES | YES |
| creator | **NO** | YES | **NO** | **NO** | **NO** |
| reviewer | YES | **NO** | **NO** | **NO** | **NO** (RA → service-layer) |
| publisher | **NO** | **NO** | **NO** | **NO** | **NO** |
| billing_admin | **NO** | **NO** | **NO** | YES | **NO** |
| viewer | **NO** | **NO** | **NO** | **NO** | **NO** |

All separation of duties confirmed:
- `creator` cannot approve content. ✓
- `reviewer` cannot create or update campaign content. ✓
- `publisher` cannot administer governance or approve. ✓
- `billing_admin` limited to `nashir.store.read`, `nashir.cost.read`, `nashir.cost.manage`. ✓
- `viewer` is read-only across all Nashir domains. ✓
- `nashir.evidence.manage` for reviewer is `false` at RBAC layer; RA is a service-layer invariant. ✓

**Review conclusion:** PASS. RBAC is correctly aligned with the approved Auth/RBAC gate.

---

## 17. Prewiring and Runtime Boundary Review

**Verified facts:**

- `test/nashir-prewiring-contract.test.js` updated APPROVED_NASHIR_CODES from 4 → 28 codes; guard test remains active. ✓
- No modifications to `src/server.js`, `src/router.js`, `src/guards.js`, or `src/error-model.js`. ✓
- No backend routes added. ✓
- No API handlers added. ✓
- No auth middleware implementation. ✓
- No UI integration files changed. ✓
- No `prototype/` changes. ✓
- No `package.json` or `package-lock.json` changes. ✓
- No OpenAPI YAML modifications. ✓
- No Pilot or Production readiness claimed. ✓
- Sprint 5 coding remains NO-GO. ✓

**Review conclusion:** PASS. All runtime boundaries are intact.

---

## 18. Test Coverage Review

**Verified facts — test/sprint0.test.js:**
- "migration wiring preserves approved SQL order" updated to expect all 12-patch chain. ✓
- Test passes. ✓

**Verified facts — test/nashir-prewiring-contract.test.js:**
- `APPROVED_NASHIR_CODES` contains all 28 codes sorted alphabetically. ✓
- Regex updated to `/"'` + `` ` `` `(nashir\.[a-z0-9_.]+)["'` + "`]` to capture multi-segment codes (e.g., `nashir.creator_studio.transfer.create`). ✓
- All NO-GO gate tests still active. ✓
- No tests weakened. ✓

**Verified facts — test/nashir-rbac-permission-mapping.test.js:**
- 28 codes × 7 roles = 196 per-code assertions. ✓
- 14 additional structural invariant tests (owner/admin coverage, creator/approval separation, reviewer separation, publisher scope, billing_admin isolation, viewer read-only, model_routing admin-only, workflow admin-only, reviewer RA semantics). ✓
- Total: 210 assertions; all pass. ✓
- `reviewer` + `nashir.evidence.manage` = false explicitly tested and documented as RA/service-layer pattern. ✓

**Verified facts — test/nashir-sql-schema-patch-validation.test.js:**
- 84 structural tests; all pass without a live database connection. ✓
- `tableBody()` helper function correctly extracts table DDL body for inspection. ✓
- workspace_id NOT NULL tests inspect actual table body (not merely table name existence). ✓ This was a specific review fix — the original tests only checked for table name presence.
- FK constraint name presence tests: data_sources store_profile FK, integration_connections store_profile FK, assets product FK, 6 Patch 010 campaign FKs, 4 Patch 011 FKs. ✓
- `stripDoBlocks()` guard test confirms no bare `ALTER TABLE ADD CONSTRAINT` remains in patches 006, 010, 011. ✓
- No tests were weakened. ✓

---

## 19. Verification Results

| Verification | Command | Result |
|---|---|---|
| Whitespace clean | `git diff --check` | **CLEAN** — no whitespace errors |
| Changed files | `git diff --name-only` | (empty — branch HEAD equals main post-merge) |
| Unit tests | `npm test` | **669 pass, 0 fail** |
| Integration tests | `npm run test:integration` | **52 pass, 0 fail** (40 skipped — DATABASE_URL absent) |
| OpenAPI lint | `npm run openapi:lint:strict` | **PASSED** — 94 declared permissions checked |
| RBAC seed | `npm run db:seed` | **OK** — seed SQL generated; all 28 nashir.* codes present |
| Strict verify | `npm run verify:strict` | **PASSED** (all non-DB steps) |
| Migration strict | `npm run db:migrate:strict` | **BLOCKED** — `DATABASE_URL is required for strict Sprint 0 migration execution.` — environment only |
| Migration list | `node scripts/db-migrate.js` | **CONFIRMED** — patches 001–011 in order; Patch 012 absent |
| Patch 012 check | grep in runner + wrapper | **CONFIRMED ABSENT** — no reference in either file |
| nashir.* count | grep rbac.js | **28** distinct codes confirmed |

**DB migration note:** `db:migrate:strict` is blocked by the absence of a `DATABASE_URL` environment variable in the local environment. This is an environment constraint, not a code defect. The migration runner correctly validates its input and refuses to proceed without credentials. This does not indicate a code error. A real PostgreSQL instance is required to execute and verify the actual migration chain before backend slice work begins.

---

## 20. Blocking Findings

**No blocking findings.** All 15 changed files pass review. All tests pass. All workspace-scoped FKs are present. All idempotency guards are in place. No forbidden files were changed.

---

## 21. Watch Items

| ID | Item | Severity | Action |
|---|---|---|---|
| W-REV01 | `db:migrate:strict` requires a real PostgreSQL instance with `DATABASE_URL` to execute the full migration chain. This has not been verified against a live database in this review cycle. | MEDIUM | A real DB migration verification run must complete before Backend Slice 0 Implementation begins (not required for planning). |
| W-REV02 | Patch 012 (workflow definitions) is deferred. The migration runner and schema wrapper correctly exclude it. If future planning approves workflow definitions, a separately gated patch must be created. | LOW | Carry to future planning. |
| W-REV03 | TTL cleanup job ownership (expiring sessions, drafts, ideas with expired `expires_at`) is not addressed by the schema alone. The expiry enforcement is a runtime/background-job responsibility. | LOW | Carry to Backend Slice 0 Planning; design cleanup worker separately. |
| W-REV04 | 410 Gone behavior for expired TTL entities is a backend/API concern, not a SQL concern. The schema supports it (status transitions + expires_at), but the HTTP response behavior must be implemented in the router/service layer. | LOW | Carry to Backend Slice 0 Planning. |
| W-REV05 | `fk_nashir_routing_rules_provider_workspace` is non-nullable, meaning AI providers must exist before routing rules can be created. Backend implementation must account for this insertion order dependency (seed providers before seeding routing rules). | MEDIUM | Carry to Backend Slice 0 Planning; document in seed/fixture strategy. |
| W-REV06 | OpenAPI migration from nashir-ui-prototype to marketing-os remains blocked by upstream gate ordering. This review does not unblock OpenAPI migration. | LOW | Carry to Nashir OpenAPI Migration Planning Gate. |
| W-REV07 | UI API integration remains blocked until backend routes exist and contract authority is settled. This review does not unblock UI integration. | LOW | Carry to Nashir UI API Integration Planning Gate. |

---

## 22. Readiness Assessment

| Dimension | Assessment | Notes |
|---|---|---|
| SQL patch structure | **READY** | All patches valid, purposeful, correctly ordered |
| Migration ordering | **READY** | Patch 009 precedes Patch 010; full sequence 005–011 confirmed |
| Idempotency | **READY** | All table creates and constraint additions guarded |
| Referential integrity | **READY** | 29 workspace-scoped FKs; all composite; all idempotent |
| Workspace isolation | **READY** | All business tables carry workspace_id NOT NULL |
| RBAC seed alignment | **READY** | 28 codes; no unapproved codes; no deferred codes activated |
| Test coverage | **READY** | 669 unit + 52 integration tests pass; structural SQL tests pass; RBAC coverage complete |
| DB verification | **READY WITH WATCH ITEM** | Non-DB tests all pass; db:migrate:strict blocked by environment; W-REV01 |
| Runtime boundary | **READY** | No runtime/backend/auth/OpenAPI/UI changes |

**Overall readiness: READY WITH WATCH ITEMS**

The implementation is structurally complete and internally consistent. The watch items (W-REV01 through W-REV07) are non-blocking for Backend Slice 0 Planning. W-REV01 (real DB verification) is the only item that should be resolved before Backend Slice 0 Implementation begins.

---

## 23. Required Follow-up Gates

| Priority | Gate | Dependency | Rationale |
|---:|---|---|---|
| 1 | **Nashir Backend Slice 0 Planning** | This review gate — READY WITH WATCH ITEMS | Plans first implementable Nashir backend slice: guard wiring, auth provider selection, route patterns, self-approval service invariant, workspace context, allowed/forbidden files |
| 2 | **DB Migration Verification** | Real PostgreSQL + DATABASE_URL | Execute `db:migrate:strict` against a live PostgreSQL instance before Slice 0 Implementation. Not required for planning. |
| 3 | **Nashir Backend Slice 0 Implementation** | Backend Slice 0 Planning | Implements first routes, guard chain, RBAC enforcement, workspace context, repository pattern |
| 4 | **Nashir Backend Slice 0 Review Gate** | Implementation | Reviews implemented routes, guards, and repository layer |
| 5 | **Nashir OpenAPI Migration Planning Gate** | Backend Slice 0 Planning | Plans movement of OpenAPI authority from nashir-ui-prototype to marketing-os |
| 6 | **Nashir Generated Types Input Update Gate** | OpenAPI Migration Planning Gate | Approves generated types update |
| 7 | **Nashir UI API Integration Planning Gate** | Backend routes exist and verified | Plans how nashir-ui-prototype calls Nashir V1 API |

No Nashir SQL Schema Implementation Fix Slice is required. No blockers exist.

---

## 24. Final Decision

### Final decision

| Area | Status |
|---|---|
| **Review result** | **READY WITH WATCH ITEMS** |
| Blocking findings | **NONE** |
| **GO to Nashir Backend Slice 0 Planning** | **GO** |
| Backend Slice 0 Implementation | **NO-GO until Backend Slice 0 Planning closes** |
| OpenAPI migration | **NO-GO** |
| UI API integration | **NO-GO** |
| Generated types update | **NO-GO** |
| Backend routes added in this gate | **NO-GO** |
| Auth middleware added in this gate | **NO-GO** |
| Runtime publishing added in this gate | **NO-GO** |
| SQL added or modified in this gate | **NO-GO** |
| Production / Pilot | **NO-GO** |
| Sprint 5 coding | **NO-GO** |

### GO / NO-GO summary

```text
GO:     Nashir Backend Slice 0 Planning.
GO:     SQL Schema Implementation Slice (PR #267) accepted as reviewed.
NO-GO:  Backend Slice 0 Implementation until planning closes.
NO-GO:  OpenAPI migration until Backend Slice 0 Planning closes.
NO-GO:  UI API integration until backend exists.
NO-GO:  Any backend route, auth middleware, or runtime publishing in this gate.
NO-GO:  Any SQL addition or modification in this gate.
NO-GO:  Production readiness.
NO-GO:  Pilot readiness.
NO-GO:  Sprint 5 coding.
WATCH:  db:migrate:strict must be run against a real PostgreSQL instance before
        Backend Slice 0 Implementation begins (not required for planning).
WATCH:  Patch 012 (workflow definitions) remains deferred.
WATCH:  TTL cleanup, 410 Gone behavior, and routing rule insertion order are
        Backend Slice 0 Planning responsibilities.
```

### Next gate

**Nashir Backend Slice 0 Planning**

That gate must:
- Identify the first implementable backend slice (which routes, which repository methods, which guard chain wiring).
- Select or confirm the auth provider strategy (currently X-User-Id header as mock; production auth requires a real decision).
- Define the self-approval service invariant for `approveCampaignContent`.
- Confirm workspace context derivation (route-derived only; never from request body).
- Name exact allowed files, forbidden files, verification commands, rollback criteria, and NO-GO boundaries.
- Address W-REV05: document AI provider insertion order dependency before any routing rule seed strategy is designed.

Until Backend Slice 0 Planning closes, no Nashir backend route, repository, guard change, or OpenAPI activation may be implemented.
