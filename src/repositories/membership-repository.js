const { AppError } = require("../error-model");

class MembershipRepository {
  constructor({ pool }) {
    this.pool = pool;
  }

  async getMembership({ workspaceId, userId }) {
    try {
      const rows = await this.pool.query(
        `
          SELECT
            wm.workspace_member_id,
            wm.workspace_id,
            wm.user_id,
            wm.role_id,
            r.role_code,
            r.role_name,
            wm.member_status,
            wm.invited_by_user_id,
            wm.joined_at::text AS joined_at,
            wm.created_at::text AS created_at,
            wm.updated_at::text AS updated_at
          FROM workspace_members wm
          JOIN roles r ON r.role_id = wm.role_id
          WHERE wm.workspace_id = $1
            AND wm.user_id = $2
            AND wm.member_status = 'active'
          LIMIT 1
        `,
        [workspaceId, userId],
        { workspaceId }
      );

      return rows[0] || null;
    } catch (error) {
      throw toInternalReadError(error);
    }
  }

  async listMembershipRoles({ workspaceId, userId }) {
    const membership = await this.getMembership({ workspaceId, userId });
    return membership ? [membership.role_code] : [];
  }
}

function toInternalReadError(error) {
  if (error instanceof AppError) {
    return error;
  }

  return new AppError(500, "INTERNAL_ERROR", "Database read failed.", "Retry or contact support.");
}

module.exports = {
  MembershipRepository,
};
