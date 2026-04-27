const { roles, permissions, rolePermissions } = require("../src/rbac");

function escapeSql(value) {
  return String(value).replaceAll("'", "''");
}

const lines = [];
lines.push("-- Marketing OS Sprint 0 RBAC seed data");
lines.push("BEGIN;");

for (const role of roles) {
  lines.push(
    `INSERT INTO roles (role_code, role_name, role_scope, is_system_role) VALUES ('${escapeSql(role.role_code)}', '${escapeSql(role.role_name)}', '${role.role_scope}', ${role.is_system_role}) ON CONFLICT (role_code) DO UPDATE SET role_name = EXCLUDED.role_name;`
  );
}

for (const permission of permissions) {
  lines.push(
    `INSERT INTO permissions (permission_code, permission_name, domain) VALUES ('${escapeSql(permission.permission_code)}', '${escapeSql(permission.permission_name)}', '${escapeSql(permission.domain)}') ON CONFLICT (permission_code) DO UPDATE SET permission_name = EXCLUDED.permission_name, domain = EXCLUDED.domain;`
  );
}

for (const [roleCode, permissionCodes] of Object.entries(rolePermissions)) {
  for (const permissionCode of permissionCodes) {
    lines.push(`INSERT INTO role_permissions (role_id, permission_id)
SELECT r.role_id, p.permission_id
FROM roles r, permissions p
WHERE r.role_code = '${escapeSql(roleCode)}' AND p.permission_code = '${escapeSql(permissionCode)}'
ON CONFLICT (role_id, permission_id) DO NOTHING;`);
  }
}

lines.push("COMMIT;");

console.log(lines.join("\n"));
