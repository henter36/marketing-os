const { toRepositoryError: toUnexpectedRepositoryError } = require("./repository-error-logging");

const SUBMITTED_STATUS = "submitted";
const SUBMITTED_EVENT_TYPE = "nashir_evidence.submitted";

/**
 * DB-backed Nashir evidence lifecycle persistence.
 *
 * Injected `pool` must satisfy the repository adapter contract used in this codebase:
 * - `pool.query(sql, params, options)` — `options` may include `workspaceId` for workspace-scoped context.
 * - `pool.withTransaction(callback, options)` — `options` may include `workspaceId` and are used with transactional writes.
 */
class NashirEvidenceLifecycleRepository {
  constructor({ pool } = {}) {
    if (!pool) {
      throw new Error("NashirEvidenceLifecycleRepository requires a pool");
    }

    this.pool = pool;
  }

  async listByCampaign({ workspaceId, nashirCampaignId }) {
    try {
      const rows = rowsFromQueryResult(await this.pool.query(
        `
          SELECT
            evidence_id,
            workspace_id,
            nashir_campaign_id,
            evidence_type,
            channel,
            status::text AS status,
            submitted_by_user_id,
            submitted_at,
            published_at,
            url,
            notes,
            external_reference,
            created_at,
            updated_at
          FROM nashir_evidence
          WHERE workspace_id = $1
            AND nashir_campaign_id = $2
          ORDER BY submitted_at, evidence_id
        `,
        [workspaceId, nashirCampaignId],
        { workspaceId }
      ));

      return rows.map(toPublicEvidence);
    } catch (error) {
      throw toRepositoryError(error);
    }
  }

  async getById({ workspaceId, nashirCampaignId, evidenceId }) {
    try {
      const rows = rowsFromQueryResult(await this.pool.query(
        `
          SELECT
            evidence_id,
            workspace_id,
            nashir_campaign_id,
            evidence_type,
            channel,
            status::text AS status,
            submitted_by_user_id,
            submitted_at,
            published_at,
            url,
            notes,
            external_reference,
            created_at,
            updated_at
          FROM nashir_evidence
          WHERE workspace_id = $1
            AND nashir_campaign_id = $2
            AND evidence_id = $3
          LIMIT 1
        `,
        [workspaceId, nashirCampaignId, evidenceId],
        { workspaceId }
      ));

      return rows[0] ? toPublicEvidence(rows[0]) : null;
    } catch (error) {
      throw toRepositoryError(error);
    }
  }

  async createSubmittedEvidence({
    workspaceId,
    nashirCampaignId,
    evidenceType,
    channel,
    submittedByUserId,
    publishedAt,
    url,
    notes,
    externalReference,
    submittedAt,
  }) {
    try {
      const writeEvidence = async (client) => {
        const evidenceRows = rowsFromQueryResult(await client.query(
          `
            INSERT INTO nashir_evidence (
              workspace_id,
              nashir_campaign_id,
              evidence_type,
              channel,
              status,
              submitted_at,
              submitted_by_user_id,
              published_at,
              url,
              notes,
              external_reference,
              updated_at
            )
            VALUES ($1, $2, $3, $4, $5::nashir_evidence_status, COALESCE($6::timestamptz, now()), $7, $8::timestamptz, $9, $10, $11, now())
            RETURNING
              evidence_id,
              workspace_id,
              nashir_campaign_id,
              evidence_type,
              channel,
              status::text AS status,
              submitted_by_user_id,
              submitted_at,
              published_at,
              url,
              notes,
              external_reference,
              created_at,
              updated_at
          `,
          [
            workspaceId,
            nashirCampaignId,
            evidenceType,
            channel,
            SUBMITTED_STATUS,
            submittedAt || null,
            submittedByUserId,
            publishedAt || null,
            url || null,
            notes || null,
            externalReference || null,
          ],
          { workspaceId }
        ));

        const evidence = evidenceRows[0];
        if (!evidence) {
          throw new Error("Failed to create Nashir evidence record: no row returned");
        }

        await client.query(
          `
            INSERT INTO nashir_evidence_lifecycle_events (
              evidence_id,
              workspace_id,
              nashir_campaign_id,
              event_type,
              prior_status,
              next_status,
              actor_user_id,
              occurred_at
            )
            VALUES ($1, $2, $3, $4::nashir_evidence_lifecycle_event_type, NULL, $5::nashir_evidence_status, $6, $7)
          `,
          [
            evidence.evidence_id,
            workspaceId,
            nashirCampaignId,
            SUBMITTED_EVENT_TYPE,
            SUBMITTED_STATUS,
            submittedByUserId,
            evidence.submitted_at,
          ],
          { workspaceId }
        );

        return toPublicEvidence(evidence);
      };

      if (typeof this.pool.withTransaction !== "function") {
        throw toRepositoryError(new Error("Nashir evidence lifecycle repository requires transactional writes"));
      }

      return await this.pool.withTransaction(writeEvidence, { workspaceId });
    } catch (error) {
      throw toRepositoryError(error);
    }
  }
}

function toPublicEvidence(row) {
  return {
    id: row.evidence_id,
    workspaceId: row.workspace_id,
    nashirCampaignId: row.nashir_campaign_id,
    evidenceType: row.evidence_type,
    channel: row.channel,
    status: row.status || SUBMITTED_STATUS,
    submittedByUserId: row.submitted_by_user_id,
    submittedAt: row.submitted_at,
    publishedAt: row.published_at || null,
    url: row.url || null,
    notes: row.notes || null,
    externalReference: row.external_reference || null,
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

function toRepositoryError(error) {
  return toUnexpectedRepositoryError("NashirEvidenceLifecycleRepository", error);
}

module.exports = {
  NashirEvidenceLifecycleRepository,
};
