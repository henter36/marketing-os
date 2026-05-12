const { roles, permissions, rolePermissions } = require("../src/rbac");

// Reject values containing control characters that could corrupt the SQL output
// even after single-quote escaping (CR/LF can break statement boundaries; NUL
// is undefined behaviour in most SQL drivers).
const UNSAFE_RE = /[\r\n\0]/;

function validateSeedValue(value) {
  if (UNSAFE_RE.test(String(value))) {
    throw new Error(`Unsafe seed value rejected (contains CR/LF/NUL): ${JSON.stringify(value)}`);
  }
}

function escapeSql(value) {
  const str = String(value);
  validateSeedValue(str);
  return str.replaceAll("'", "''");
}

function buildSeedSql() {
  const lines = [];
  lines.push("-- Marketing OS Sprint 0 RBAC seed data");
  lines.push("BEGIN;");

  for (const role of roles) {
    lines.push(
      `INSERT INTO roles (role_code, role_name, role_scope, is_system_role) VALUES ('${escapeSql(role.role_code)}', '${escapeSql(role.role_name)}', '${escapeSql(role.role_scope)}', ${role.is_system_role}) ON CONFLICT (role_code) DO UPDATE SET role_name = EXCLUDED.role_name;`
    );
  }

  for (const permission of permissions) {
    lines.push(
      `INSERT INTO permissions (permission_code, permission_name, domain) VALUES ('${escapeSql(permission.permission_code)}', '${escapeSql(permission.permission_name)}', '${escapeSql(permission.domain)}') ON CONFLICT (permission_code) DO UPDATE SET permission_name = EXCLUDED.permission_name, domain = EXCLUDED.domain;`
    );
  }

  // Delete all role_permissions rows for system roles before reinserting so
  // that the final set exactly matches src/rbac.js rolePermissions. Scoped to
  // is_system_role = true to leave custom/tenant role grants untouched.
  lines.push(
    `DELETE FROM role_permissions\nWHERE role_id IN (SELECT role_id FROM roles WHERE is_system_role = true);`
  );

  for (const [roleCode, permissionCodes] of Object.entries(rolePermissions)) {
    for (const permissionCode of permissionCodes) {
      lines.push(
        `INSERT INTO role_permissions (role_id, permission_id)\nSELECT r.role_id, p.permission_id\nFROM roles r, permissions p\nWHERE r.role_code = '${escapeSql(roleCode)}' AND p.permission_code = '${escapeSql(permissionCode)}';`
      );
    }
  }

  lines.push("COMMIT;");
  return lines.join("\n");
}

module.exports = { buildSeedSql, escapeSql, validateSeedValue };

if (require.main === module) {
  console.log(buildSeedSql());
}
