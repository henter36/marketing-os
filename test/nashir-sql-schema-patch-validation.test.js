"use strict";

const assert = require("assert");
const { test } = require("node:test");
const fs = require("fs");
const path = require("path");

// Validates structural properties of Nashir SQL schema patches 005–011.
// These tests are file-content checks; no live database connection is required.

const DOCS_DIR = path.resolve(__dirname, "../docs");
const SCRIPTS_DIR = path.resolve(__dirname, "../scripts");

function readPatch(num) {
  const padded = String(num).padStart(3, "0");
  const fp = path.join(DOCS_DIR, `marketing_os_v5_6_5_phase_0_1_schema_patch_${padded}.sql`);
  return fs.readFileSync(fp, "utf8");
}

const NASHIR_PATCHES = [5, 6, 7, 8, 9, 10, 11];

// =========================================================
// FILE PRESENCE
// =========================================================

for (const num of NASHIR_PATCHES) {
  test(`patch ${String(num).padStart(3, "0")} file exists`, () => {
    const padded = String(num).padStart(3, "0");
    const fp = path.join(DOCS_DIR, `marketing_os_v5_6_5_phase_0_1_schema_patch_${padded}.sql`);
    assert.ok(fs.existsSync(fp), `patch_${padded}.sql must exist`);
  });
}

test("patch 012 is deferred and must not exist", () => {
  const fp = path.join(DOCS_DIR, "marketing_os_v5_6_5_phase_0_1_schema_patch_012.sql");
  assert.ok(!fs.existsSync(fp), "patch_012.sql must be deferred (file must not exist)");
});

// =========================================================
// BEGIN / COMMIT WRAPPERS (idempotency/transactional safety)
// =========================================================

for (const num of NASHIR_PATCHES) {
  test(`patch ${String(num).padStart(3, "0")} has BEGIN and COMMIT`, () => {
    const sql = readPatch(num);
    assert.ok(sql.includes("BEGIN;"), `patch_${num}: must have BEGIN;`);
    assert.ok(sql.includes("COMMIT;"), `patch_${num}: must have COMMIT;`);
  });
}

// =========================================================
// NO uuid[] FK-LIKE ARRAYS IN ANY NASHIR PATCH
// =========================================================

for (const num of NASHIR_PATCHES) {
  test(`patch ${String(num).padStart(3, "0")} has no uuid[] arrays`, () => {
    const sql = readPatch(num);
    assert.ok(
      !sql.includes("uuid[]"),
      `patch_${num}: must not use uuid[] for FK-like associations`
    );
  });
}

// =========================================================
// workspace_id PRESENT WHERE REQUIRED (inspects actual table body)
// =========================================================

function tableBody(sql, tableName) {
  const startMarker = `CREATE TABLE IF NOT EXISTS ${tableName}`;
  const startIdx = sql.indexOf(startMarker);
  if (startIdx === -1) return null;
  // Find the closing ); of the CREATE TABLE block
  const endIdx = sql.indexOf(");", startIdx);
  return endIdx === -1 ? null : sql.slice(startIdx, endIdx + 2);
}

test("patch 006 nashir_store_profiles has workspace_id NOT NULL", () => {
  const sql = readPatch(6);
  const body = tableBody(sql, "nashir_store_profiles");
  assert.ok(body, "nashir_store_profiles must be defined in patch 006");
  assert.ok(
    body.includes("workspace_id uuid NOT NULL"),
    "nashir_store_profiles must have workspace_id uuid NOT NULL"
  );
});

test("patch 006 nashir_products has workspace_id NOT NULL", () => {
  const sql = readPatch(6);
  const body = tableBody(sql, "nashir_products");
  assert.ok(body, "nashir_products table must be defined in patch 006");
  assert.ok(
    body.includes("workspace_id uuid NOT NULL"),
    "nashir_products must have workspace_id uuid NOT NULL"
  );
});

test("patch 007 nashir_campaign_content_items has workspace_id NOT NULL", () => {
  const sql = readPatch(7);
  const body = tableBody(sql, "nashir_campaign_content_items");
  assert.ok(body, "nashir_campaign_content_items must be defined in patch 007");
  assert.ok(
    body.includes("workspace_id uuid NOT NULL"),
    "nashir_campaign_content_items must have workspace_id uuid NOT NULL"
  );
});

test("patch 009 nashir_prompt_templates has workspace_id NOT NULL", () => {
  const sql = readPatch(9);
  const body = tableBody(sql, "nashir_prompt_templates");
  assert.ok(body, "nashir_prompt_templates must be defined in patch 009");
  assert.ok(
    body.includes("workspace_id uuid NOT NULL"),
    "nashir_prompt_templates must have workspace_id uuid NOT NULL"
  );
});

test("patch 010 nashir_creator_studio_sessions has workspace_id NOT NULL", () => {
  const sql = readPatch(10);
  const body = tableBody(sql, "nashir_creator_studio_sessions");
  assert.ok(body, "nashir_creator_studio_sessions must be defined in patch 010");
  assert.ok(
    body.includes("workspace_id uuid NOT NULL"),
    "nashir_creator_studio_sessions must have workspace_id uuid NOT NULL"
  );
});

test("patch 011 nashir_model_routing_rules has workspace_id NOT NULL", () => {
  const sql = readPatch(11);
  const body = tableBody(sql, "nashir_model_routing_rules");
  assert.ok(body, "nashir_model_routing_rules must be defined in patch 011");
  assert.ok(
    body.includes("workspace_id uuid NOT NULL"),
    "nashir_model_routing_rules must have workspace_id uuid NOT NULL"
  );
});

test("patch 011 nashir_cost_usage_records has workspace_id NOT NULL", () => {
  const sql = readPatch(11);
  const body = tableBody(sql, "nashir_cost_usage_records");
  assert.ok(body, "nashir_cost_usage_records must be defined in patch 011");
  assert.ok(
    body.includes("workspace_id uuid NOT NULL"),
    "nashir_cost_usage_records must have workspace_id uuid NOT NULL"
  );
});

// =========================================================
// PATCH 007: COMPOSITE PK ON nashir_campaign_content_assets
// =========================================================

test("patch 007 nashir_campaign_content_assets uses composite PK (campaign_content_id, asset_id)", () => {
  const sql = readPatch(7);
  assert.ok(
    sql.includes("PRIMARY KEY (campaign_content_id, asset_id)"),
    "nashir_campaign_content_assets must define PRIMARY KEY (campaign_content_id, asset_id)"
  );
});

test("patch 007 nashir_campaign_content_assets has no standalone uuid PK column", () => {
  const sql = readPatch(7);
  const assetTableIdx = sql.indexOf("CREATE TABLE IF NOT EXISTS nashir_campaign_content_assets");
  assert.ok(assetTableIdx >= 0, "nashir_campaign_content_assets table must exist");
  // The junction table should use composite PK, not a standalone UUID PK
  const tableBody = sql.slice(assetTableIdx, sql.indexOf(");", assetTableIdx) + 2);
  assert.ok(
    !tableBody.includes("uuid PRIMARY KEY DEFAULT gen_random_uuid()"),
    "nashir_campaign_content_assets must not have a standalone UUID primary key column"
  );
});

// =========================================================
// PATCH 006: STORE PROFILE CONSTRAINTS
// =========================================================

test("patch 006 has partial unique index for non-archived store profile per workspace", () => {
  const sql = readPatch(6);
  assert.ok(
    sql.includes("uq_nashir_store_profiles_active_per_workspace"),
    "patch 006 must define partial unique index uq_nashir_store_profiles_active_per_workspace"
  );
  assert.ok(
    sql.includes("store_profile_status <> 'archived'"),
    "partial unique index must use WHERE store_profile_status <> 'archived'"
  );
});

test("patch 006 adds nullable store_profile_id to nashir_campaigns", () => {
  const sql = readPatch(6);
  assert.ok(
    sql.includes("ALTER TABLE nashir_campaigns") && sql.includes("store_profile_id uuid"),
    "patch 006 must add nullable store_profile_id to nashir_campaigns"
  );
});

// =========================================================
// PATCH 009: PROMPT GOVERNANCE PARTIAL UNIQUE
// =========================================================

test("patch 009 has partial unique index on (prompt_template_id, version_number)", () => {
  const sql = readPatch(9);
  assert.ok(
    sql.includes("uq_nashir_prompt_governance_active_version"),
    "patch 009 must define uq_nashir_prompt_governance_active_version partial unique index"
  );
  assert.ok(
    sql.includes("prompt_template_id, version_number"),
    "partial unique index must cover (prompt_template_id, version_number)"
  );
});

test("patch 009 partial unique excludes archived/deprecated governance status", () => {
  const sql = readPatch(9);
  assert.ok(
    sql.includes("governance_status NOT IN") &&
      (sql.includes("'archived'") || sql.includes("archived")) &&
      (sql.includes("'deprecated'") || sql.includes("deprecated")),
    "patch 009 partial unique must exclude 'archived' and 'deprecated' governance_status values"
  );
});

// =========================================================
// PATCH 010: TTL COLUMNS (expires_at) ON ALL TTL ENTITIES
// =========================================================

const TTL_TABLES = [
  "nashir_creator_studio_sessions",
  "nashir_creator_content_ideas",
  "nashir_creator_campaign_angles",
  "nashir_creator_audience_segments",
  "nashir_creator_publish_windows",
  "nashir_creator_context_drafts",
  "nashir_creator_transfer_drafts",
  "nashir_creator_readiness_assessments"
];

for (const tableName of TTL_TABLES) {
  test(`patch 010 ${tableName} has expires_at column`, () => {
    const sql = readPatch(10);
    const tableIdx = sql.indexOf(`CREATE TABLE IF NOT EXISTS ${tableName}`);
    assert.ok(tableIdx >= 0, `${tableName} must be defined in patch 010`);
    const tableBody = sql.slice(tableIdx, sql.indexOf(");", tableIdx) + 2);
    assert.ok(
      tableBody.includes("expires_at timestamptz NOT NULL"),
      `${tableName} must have expires_at timestamptz NOT NULL`
    );
  });
}

test("patch 010 does NOT use WHERE expires_at > now() in any partial index", () => {
  const sql = readPatch(10);
  assert.ok(
    !sql.includes("expires_at > now()"),
    "patch 010 must not use partial index predicate WHERE expires_at > now() (forbidden)"
  );
});

test("patch 010 creator_transfer_drafts includes pending_review status", () => {
  const sql = readPatch(10);
  assert.ok(
    sql.includes("pending_review"),
    "nashir_cs_transfer_draft_status must include 'pending_review'"
  );
});

// =========================================================
// PATCH 010: prompt_template_id FK REFERENCES PATCH 009
// =========================================================

test("patch 010 creator_studio_sessions references nashir_prompt_templates (patch 009)", () => {
  const sql = readPatch(10);
  assert.ok(
    sql.includes("fk_nashir_cs_session_prompt_template") &&
      sql.includes("REFERENCES nashir_prompt_templates"),
    "nashir_creator_studio_sessions must reference nashir_prompt_templates via FK"
  );
});

test("patch 010 creator_transfer_drafts references nashir_prompt_templates (patch 009)", () => {
  const sql = readPatch(10);
  assert.ok(
    sql.includes("fk_nashir_cs_transfer_draft_prompt_template") &&
      sql.includes("REFERENCES nashir_prompt_templates"),
    "nashir_creator_transfer_drafts must reference nashir_prompt_templates via FK"
  );
});

// =========================================================
// NO RAW SECRET COLUMNS
// =========================================================

const SECRET_PATTERNS = ["api_key", "token varchar", "api_token", "client_secret", "password varchar"];

for (const num of NASHIR_PATCHES) {
  test(`patch ${String(num).padStart(3, "0")} has no raw secret column names`, () => {
    const sql = readPatch(num).toLowerCase();
    for (const pattern of SECRET_PATTERNS) {
      assert.ok(
        !sql.includes(pattern),
        `patch_${num}: must not have raw secret column matching pattern '${pattern}'`
      );
    }
  });
}

test("patch 006 integration_connections uses vault_ref/secret_ref (not raw credentials)", () => {
  const sql = readPatch(6);
  assert.ok(
    sql.includes("nashir_integration_connections"),
    "patch 006 must define nashir_integration_connections"
  );
  assert.ok(
    sql.includes("vault_ref") || sql.includes("secret_ref"),
    "nashir_integration_connections must use vault_ref or secret_ref (not raw credentials)"
  );
  const lcSql = sql.toLowerCase();
  assert.ok(
    !lcSql.includes("api_key") && !lcSql.includes("client_secret"),
    "nashir_integration_connections must not have raw api_key or client_secret columns"
  );
});

test("patch 011 ai_providers has no credential or API key columns", () => {
  const sql = readPatch(11);
  const providerIdx = sql.indexOf("CREATE TABLE IF NOT EXISTS nashir_ai_providers");
  assert.ok(providerIdx >= 0, "nashir_ai_providers must be defined");
  const tableBody = sql.slice(providerIdx, sql.indexOf(");", providerIdx) + 2).toLowerCase();
  assert.ok(!tableBody.includes("api_key"), "nashir_ai_providers must not have api_key column");
  assert.ok(!tableBody.includes("credential"), "nashir_ai_providers must not have credential column");
  assert.ok(!tableBody.includes("token"), "nashir_ai_providers must not have token column");
});

// =========================================================
// MIGRATION RUNNER INCLUDES PATCHES 005–011
// =========================================================

test("db-migrate.js migration list includes patches 005 through 011", () => {
  const runnerPath = path.join(SCRIPTS_DIR, "db-migrate.js");
  const runner = fs.readFileSync(runnerPath, "utf8");
  for (let n = 5; n <= 11; n++) {
    const padded = String(n).padStart(3, "0");
    assert.ok(
      runner.includes(`schema_patch_${padded}.sql`),
      `db-migrate.js must include schema_patch_${padded}.sql in migrations array`
    );
  }
});

test("db-migrate.js does not reference patch 012", () => {
  const runnerPath = path.join(SCRIPTS_DIR, "db-migrate.js");
  const runner = fs.readFileSync(runnerPath, "utf8");
  assert.ok(
    !runner.includes("schema_patch_012.sql"),
    "db-migrate.js must not reference deferred patch_012"
  );
});

// =========================================================
// SCHEMA WRAPPER INCLUDES PATCHES 005–011
// =========================================================

test("07_database_schema.sql wrapper includes \\i references for patches 005 through 011", () => {
  const wrapperPath = path.join(DOCS_DIR, "07_database_schema.sql");
  const wrapper = fs.readFileSync(wrapperPath, "utf8");
  for (let n = 5; n <= 11; n++) {
    const padded = String(n).padStart(3, "0");
    assert.ok(
      wrapper.includes(`schema_patch_${padded}.sql`),
      `07_database_schema.sql must include reference to schema_patch_${padded}.sql`
    );
  }
});

// =========================================================
// ORDERING: PATCH 009 DEFINES TABLES BEFORE PATCH 010 USES THEM
// =========================================================

test("patch 009 defines nashir_prompt_templates (required by patch 010 FKs)", () => {
  const sql009 = readPatch(9);
  assert.ok(
    sql009.includes("CREATE TABLE IF NOT EXISTS nashir_prompt_templates"),
    "patch 009 must define nashir_prompt_templates before patch 010 references it"
  );
});

test("patch 009 defines nashir_prompt_governance_versions", () => {
  const sql009 = readPatch(9);
  assert.ok(
    sql009.includes("CREATE TABLE IF NOT EXISTS nashir_prompt_governance_versions"),
    "patch 009 must define nashir_prompt_governance_versions"
  );
});

test("patch 010 references nashir_prompt_templates (not base prompt_templates)", () => {
  const sql010 = readPatch(10);
  const hasNashirRef = sql010.includes("REFERENCES nashir_prompt_templates");
  assert.ok(
    hasNashirRef,
    "patch 010 Creator Studio FKs must reference nashir_prompt_templates (patch 009), not base prompt_templates"
  );
});

// =========================================================
// PATCH 006: WORKSPACE-SCOPED FK CONSTRAINTS
// =========================================================

test("patch 006 nashir_data_sources has guarded workspace-scoped store_profile FK", () => {
  const sql = readPatch(6);
  assert.ok(
    sql.includes("fk_nashir_data_sources_store_profile_workspace"),
    "patch 006 must define fk_nashir_data_sources_store_profile_workspace"
  );
  assert.ok(
    sql.includes("REFERENCES nashir_store_profiles(store_profile_id, workspace_id)"),
    "nashir_data_sources store_profile FK must reference nashir_store_profiles(store_profile_id, workspace_id)"
  );
});

test("patch 006 nashir_integration_connections has guarded workspace-scoped store_profile FK", () => {
  const sql = readPatch(6);
  assert.ok(
    sql.includes("fk_nashir_integration_connections_store_profile_workspace"),
    "patch 006 must define fk_nashir_integration_connections_store_profile_workspace"
  );
});

test("patch 006 nashir_assets has guarded workspace-scoped product FK", () => {
  const sql = readPatch(6);
  assert.ok(
    sql.includes("fk_nashir_assets_product_workspace"),
    "patch 006 must define fk_nashir_assets_product_workspace"
  );
});

// =========================================================
// PATCH 010: WORKSPACE-SCOPED CAMPAIGN FK CONSTRAINTS
// =========================================================

const PATCH010_CAMPAIGN_FK_TABLES = [
  { table: "nashir_creator_content_ideas",     constraint: "fk_nashir_cs_idea_campaign_workspace" },
  { table: "nashir_creator_campaign_angles",    constraint: "fk_nashir_cs_angle_campaign_workspace" },
  { table: "nashir_creator_publish_windows",    constraint: "fk_nashir_cs_publish_window_campaign_workspace" },
  { table: "nashir_creator_readiness_assessments", constraint: "fk_nashir_cs_readiness_campaign_workspace" },
  { table: "nashir_creator_transfer_drafts",    constraint: "fk_nashir_cs_transfer_draft_campaign_workspace" },
  { table: "nashir_creator_studio_sessions",    constraint: "fk_nashir_cs_session_campaign_workspace" }
];

for (const { table, constraint } of PATCH010_CAMPAIGN_FK_TABLES) {
  test(`patch 010 ${table} has workspace-scoped campaign FK (${constraint})`, () => {
    const sql = readPatch(10);
    assert.ok(
      sql.includes(constraint),
      `patch 010 must define ${constraint} for ${table}`
    );
    assert.ok(
      sql.includes("REFERENCES nashir_campaigns(nashir_campaign_id, workspace_id)"),
      `${constraint} must reference nashir_campaigns(nashir_campaign_id, workspace_id)`
    );
  });
}

// =========================================================
// PATCH 011: WORKSPACE-SCOPED FK CONSTRAINTS
// =========================================================

test("patch 011 nashir_model_routing_rules has workspace-scoped provider FK", () => {
  const sql = readPatch(11);
  assert.ok(
    sql.includes("fk_nashir_routing_rules_provider_workspace"),
    "patch 011 must define fk_nashir_routing_rules_provider_workspace"
  );
  assert.ok(
    sql.includes("REFERENCES nashir_ai_providers(workspace_id, provider_key)"),
    "routing rules provider FK must reference nashir_ai_providers(workspace_id, provider_key)"
  );
});

test("patch 011 nashir_cost_usage_records has workspace-scoped campaign FK", () => {
  const sql = readPatch(11);
  assert.ok(
    sql.includes("fk_nashir_cost_usage_campaign_workspace"),
    "patch 011 must define fk_nashir_cost_usage_campaign_workspace"
  );
});

test("patch 011 nashir_cost_usage_records has workspace-scoped session FK", () => {
  const sql = readPatch(11);
  assert.ok(
    sql.includes("fk_nashir_cost_usage_session_workspace"),
    "patch 011 must define fk_nashir_cost_usage_session_workspace"
  );
  assert.ok(
    sql.includes("REFERENCES nashir_creator_studio_sessions(session_id, workspace_id)"),
    "cost usage session FK must reference nashir_creator_studio_sessions(session_id, workspace_id)"
  );
});

test("patch 011 nashir_cost_usage_records has workspace-scoped ai_provider FK", () => {
  const sql = readPatch(11);
  assert.ok(
    sql.includes("fk_nashir_cost_usage_provider_workspace"),
    "patch 011 must define fk_nashir_cost_usage_provider_workspace"
  );
  assert.ok(
    sql.includes("REFERENCES nashir_ai_providers(ai_provider_id, workspace_id)"),
    "cost usage provider FK must reference nashir_ai_providers(ai_provider_id, workspace_id)"
  );
});

// =========================================================
// NO BARE ALTER TABLE ADD CONSTRAINT (idempotency guard)
// =========================================================
// A bare "ALTER TABLE ... ADD CONSTRAINT" is not idempotent and will fail on re-run.
// All such statements must be wrapped in a DO $$ ... END $$; block with an IF NOT EXISTS guard.

function stripDoBlocks(sql) {
  // Remove content inside DO $$ ... END $$; blocks (including the ALTER TABLE statements within)
  return sql.replace(/DO\s+\$\$[\s\S]*?END\s+\$\$\s*;/g, "/* DO_BLOCK_REMOVED */");
}

for (const num of [6, 10, 11]) {
  test(`patch ${String(num).padStart(3, "0")} has no bare ALTER TABLE ADD CONSTRAINT outside DO blocks`, () => {
    const sql = stripDoBlocks(readPatch(num));
    // After stripping DO blocks, no ALTER TABLE ... ADD CONSTRAINT should remain
    const bareMatches = sql.match(/ALTER\s+TABLE\s+\S+[\s\S]{0,200}?ADD\s+CONSTRAINT/i);
    assert.ok(
      !bareMatches,
      `patch_${num}: all ALTER TABLE ADD CONSTRAINT must be inside DO $$ IF NOT EXISTS blocks. ` +
      `Found bare: ${bareMatches ? bareMatches[0].slice(0, 80) : ""}`
    );
  });
}

// =========================================================
// IF NOT EXISTS PATTERNS (idempotency)
// =========================================================

for (const num of NASHIR_PATCHES) {
  if (num === 5) continue; // patch 005 has no CREATE TABLE
  test(`patch ${String(num).padStart(3, "0")} uses IF NOT EXISTS on table creates`, () => {
    const sql = readPatch(num);
    const createTableCalls = (sql.match(/CREATE TABLE /gi) || []).length;
    const ifNotExistsCalls = (sql.match(/CREATE TABLE IF NOT EXISTS /gi) || []).length;
    assert.strictEqual(
      createTableCalls,
      ifNotExistsCalls,
      `patch_${num}: all CREATE TABLE statements must use IF NOT EXISTS for idempotency`
    );
  });
}
