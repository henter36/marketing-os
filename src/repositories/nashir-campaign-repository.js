const { toRepositoryError: toUnexpectedRepositoryError } = require("./repository-error-logging");

class NashirCampaignRepository {
  constructor({ pool } = {}) {
    if (!pool) {
      throw new Error("NashirCampaignRepository requires a pool");
    }

    this.pool = pool;
  }

  async listCampaigns({ workspaceId } = {}) {
    if (!workspaceId) {
      return [];
    }

    try {
      const rows = rowsFromQueryResult(await this.pool.query(
        `
          SELECT
            nashir_campaign_id,
            workspace_id,
            campaign_name,
            campaign_status::text AS campaign_status,
            created_by_user_id,
            created_at,
            updated_at
          FROM nashir_campaigns
          WHERE workspace_id = $1
          ORDER BY created_at, nashir_campaign_id
        `,
        [workspaceId],
        { workspaceId }
      ));

      return rows.map(toPublicCampaign);
    } catch (error) {
      throw toRepositoryError(error);
    }
  }

  async findCampaignById({ workspaceId, nashirCampaignId } = {}) {
    if (!workspaceId || !nashirCampaignId) {
      return null;
    }

    try {
      const rows = rowsFromQueryResult(await this.pool.query(
        `
          SELECT
            nashir_campaign_id,
            workspace_id,
            campaign_name,
            campaign_status::text AS campaign_status,
            created_by_user_id,
            created_at,
            updated_at
          FROM nashir_campaigns
          WHERE workspace_id = $1
            AND nashir_campaign_id = $2
          LIMIT 1
        `,
        [workspaceId, nashirCampaignId],
        { workspaceId }
      ));

      return rows[0] ? toPublicCampaign(rows[0]) : null;
    } catch (error) {
      throw toRepositoryError(error);
    }
  }

  async createCampaign({ workspaceId, campaignName, actorUserId, timestamp } = {}) {
    if (!workspaceId || !campaignName || !actorUserId) {
      return null;
    }

    try {
      const rows = rowsFromQueryResult(await this.pool.query(
        `
          INSERT INTO nashir_campaigns (
            workspace_id,
            campaign_name,
            created_by_user_id,
            created_at,
            updated_at
          )
          VALUES ($1, $2, $3, COALESCE($4::timestamptz, now()), COALESCE($4::timestamptz, now()))
          RETURNING
            nashir_campaign_id,
            workspace_id,
            campaign_name,
            campaign_status::text AS campaign_status,
            created_by_user_id,
            created_at,
            updated_at
        `,
        [workspaceId, campaignName, actorUserId, timestamp || null],
        { workspaceId }
      ));

      return rows[0] ? toPublicCampaign(rows[0]) : null;
    } catch (error) {
      throw toRepositoryError(error);
    }
  }
}

function toPublicCampaign(row) {
  return {
    nashir_campaign_id: row.nashir_campaign_id,
    workspace_id: row.workspace_id,
    campaign_name: row.campaign_name,
    campaign_status: row.campaign_status || "draft",
    created_by_user_id: row.created_by_user_id,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function rowsFromQueryResult(result) {
  if (!result) {
    return [];
  }

  return Array.isArray(result) ? result : result.rows || [];
}

function toRepositoryError(error) {
  return toUnexpectedRepositoryError("NashirCampaignRepository", error);
}

module.exports = {
  NashirCampaignRepository,
};
