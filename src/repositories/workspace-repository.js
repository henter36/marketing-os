const { AppError } = require("../error-model");

class WorkspaceRepository {
  constructor({ pool }) {
    this.pool = pool;
  }

  async getWorkspaceById({ workspaceId }) {
    try {
      const rows = this.pool.query(
        `
          SELECT
            workspace_id,
            customer_account_id,
            workspace_name,
            workspace_slug,
            workspace_status,
            default_locale,
            timezone,
            created_by_user_id,
            created_at::text AS created_at,
            updated_at::text AS updated_at
          FROM workspaces
          WHERE workspace_id = $1
          LIMIT 1
        `,
        [workspaceId]
      );

      return rows[0] || null;
    } catch (error) {
      throw toInternalReadError(error);
    }
  }

  async workspaceExists({ workspaceId }) {
    const workspace = await this.getWorkspaceById({ workspaceId });
    return Boolean(workspace);
  }
}

function toInternalReadError(error) {
  if (error instanceof AppError) {
    return error;
  }

  return new AppError(500, "INTERNAL_ERROR", "Database read failed.", "Retry or contact support.");
}

module.exports = {
  WorkspaceRepository,
};
