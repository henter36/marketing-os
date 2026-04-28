const { AppError } = require("../error-model");

class RbacRepository {
  constructor({ pool }) {
    this.pool = pool;
  }

  async getRolePermissions({ workspaceId, roleId, roleName }) {
    if (!roleId && !roleName) {
      return [];
    }

    try {
      const roleFilter = roleId ? "r.role_id = $2" : "r.role_code = $2";
      const roleValue = roleId || roleName;
      const rows = await this.pool.query(
        `
          SELECT p.permission_code
          FROM roles r
          JOIN role_permissions rp ON rp.role_id = r.role_id
          JOIN permissions p ON p.permission_id = rp.permission_id
          WHERE $1::uuid IS NOT NULL
            AND ${roleFilter}
          ORDER BY p.permission_code
        `,
        [workspaceId, roleValue],
        { workspaceId }
      );

      return rows.map((row) => row.permission_code);
    } catch (error) {
      throw toInternalReadError(error);
    }
  }

  async resolveUserPermissions({ workspaceId, userId }) {
    try {
      const rows = await this.pool.query(
        `
          SELECT DISTINCT p.permission_code
          FROM workspace_members wm
          JOIN roles r ON r.role_id = wm.role_id
          JOIN role_permissions rp ON rp.role_id = r.role_id
          JOIN permissions p ON p.permission_id = rp.permission_id
          WHERE wm.workspace_id = $1
            AND wm.user_id = $2
            AND wm.member_status = 'active'
          ORDER BY p.permission_code
        `,
        [workspaceId, userId],
        { workspaceId }
      );

      return rows.map((row) => row.permission_code);
    } catch (error) {
      throw toInternalReadError(error);
    }
  }

  async hasPermission({ workspaceId, userId, permission }) {
    const permissions = await this.resolveUserPermissions({ workspaceId, userId });
    return permissions.includes(permission);
  }
}

function toInternalReadError(error) {
  if (error instanceof AppError) {
    return error;
  }

  return new AppError(500, "INTERNAL_ERROR", "Database read failed.", "Retry or contact support.");
}

module.exports = {
  RbacRepository,
};
