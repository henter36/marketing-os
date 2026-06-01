"use strict";

const { toRepositoryError } = require("./repository-error-logging");

class NashirStoreProfileRepository {
  constructor({ pool } = {}) {
    if (!pool) {
      throw new Error("NashirStoreProfileRepository requires a pool");
    }

    this.pool = pool;
  }

  async findStoreProfileByWorkspace({ workspaceId } = {}) {
    if (!workspaceId) {
      return null;
    }

    try {
      const rows = rowsFromQueryResult(await this.pool.query(
        `
          SELECT
            store_profile_id,
            workspace_id,
            store_name,
            store_url,
            store_profile_status::text AS store_profile_status,
            created_by_user_id,
            created_at,
            updated_at
          FROM nashir_store_profiles
          WHERE workspace_id = $1
            AND store_profile_status <> 'archived'
          ORDER BY created_at
          LIMIT 1
        `,
        [workspaceId],
        { workspaceId }
      ));

      return rows[0] ? toPublicStoreProfile(rows[0]) : null;
    } catch (error) {
      throw toRepositoryError("NashirStoreProfileRepository", error);
    }
  }
}

function toPublicStoreProfile(row) {
  return {
    storeProfileId: row.store_profile_id,
    workspaceId: row.workspace_id,
    storeName: row.store_name,
    storeUrl: row.store_url || null,
    storeProfileStatus: row.store_profile_status,
    createdByUserId: row.created_by_user_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function rowsFromQueryResult(result) {
  if (!result) {
    return [];
  }

  return Array.isArray(result) ? result : result.rows || [];
}

module.exports = {
  NashirStoreProfileRepository,
};
