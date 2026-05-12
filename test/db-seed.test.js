const assert = require("assert");
const { test } = require("node:test");

const { buildSeedSql, escapeSql, validateSeedValue } = require("../scripts/db-seed");
const { permissions, rolePermissions, roles } = require("../src/rbac");

test("seed SQL is wrapped in a transaction", () => {
  const sql = buildSeedSql();
  assert.ok(sql.includes("BEGIN;"), "must open a transaction");
  assert.ok(sql.includes("COMMIT;"), "must commit a transaction");
  assert.ok(sql.indexOf("BEGIN;") < sql.indexOf("COMMIT;"), "BEGIN must precede COMMIT");
});

test("role upserts are present for all system roles", () => {
  const sql = buildSeedSql();
  for (const role of roles) {
    assert.ok(
      sql.includes(`'${role.role_code}'`),
      `role_code '${role.role_code}' must appear in seed SQL`
    );
    assert.ok(
      sql.includes("ON CONFLICT (role_code) DO UPDATE SET role_name = EXCLUDED.role_name"),
      "role INSERT must use upsert"
    );
  }
});

test("permission upserts are present for all permissions", () => {
  const sql = buildSeedSql();
  for (const perm of permissions) {
    assert.ok(
      sql.includes(`'${perm.permission_code}'`),
      `permission_code '${perm.permission_code}' must appear in seed SQL`
    );
  }
  assert.ok(
    sql.includes("ON CONFLICT (permission_code) DO UPDATE SET permission_name = EXCLUDED.permission_name"),
    "permission INSERT must use upsert"
  );
});

test("stale role_permissions are removed: DELETE scoped to system roles precedes INSERT", () => {
  const sql = buildSeedSql();
  const deleteIdx = sql.indexOf("DELETE FROM role_permissions");
  const insertIdx = sql.indexOf("INSERT INTO role_permissions");

  assert.ok(deleteIdx >= 0, "DELETE FROM role_permissions must be present");
  assert.ok(insertIdx >= 0, "INSERT INTO role_permissions must be present");
  assert.ok(deleteIdx < insertIdx, "DELETE must appear before INSERT for role_permissions");
  assert.ok(
    sql.includes("WHERE role_id IN (SELECT role_id FROM roles WHERE is_system_role = true)"),
    "DELETE must be scoped to is_system_role = true only"
  );
});

test("ON CONFLICT DO NOTHING is absent from role_permissions section", () => {
  const sql = buildSeedSql();
  const afterDelete = sql.slice(sql.indexOf("DELETE FROM role_permissions"));
  assert.ok(
    !afterDelete.includes("ON CONFLICT (role_id, permission_id) DO NOTHING"),
    "role_permissions must not use ON CONFLICT DO NOTHING — delete/reinsert guarantees determinism"
  );
});

test("every rolePermissions entry from src/rbac.js is present in seed SQL", () => {
  const sql = buildSeedSql();
  for (const [roleCode, permCodes] of Object.entries(rolePermissions)) {
    for (const permCode of permCodes) {
      assert.ok(
        sql.includes(`r.role_code = '${roleCode}'`) && sql.includes(`p.permission_code = '${permCode}'`),
        `role_permission ${roleCode} → ${permCode} must be seeded`
      );
    }
  }
});

test("validateSeedValue rejects CR character", () => {
  assert.throws(
    () => validateSeedValue("bad\rvalue"),
    /Unsafe seed value rejected/
  );
});

test("validateSeedValue rejects LF character", () => {
  assert.throws(
    () => validateSeedValue("bad\nvalue"),
    /Unsafe seed value rejected/
  );
});

test("validateSeedValue rejects NUL character", () => {
  assert.throws(
    () => validateSeedValue("bad\0value"),
    /Unsafe seed value rejected/
  );
});

test("validateSeedValue accepts normal seed identifier values", () => {
  assert.doesNotThrow(() => validateSeedValue("owner"));
  assert.doesNotThrow(() => validateSeedValue("workspace.read"));
  assert.doesNotThrow(() => validateSeedValue("billing_admin"));
  assert.doesNotThrow(() => validateSeedValue("nashir.approval.decide"));
});

test("escapeSql escapes single quotes", () => {
  assert.equal(escapeSql("O'Brien"), "O''Brien");
  assert.equal(escapeSql("it's fine"), "it''s fine");
  assert.equal(escapeSql("no quotes"), "no quotes");
});

test("escapeSql rejects values containing CR/LF/NUL", () => {
  assert.throws(() => escapeSql("val\rue"), /Unsafe seed value rejected/);
  assert.throws(() => escapeSql("val\nue"), /Unsafe seed value rejected/);
  assert.throws(() => escapeSql("val\0ue"), /Unsafe seed value rejected/);
});
