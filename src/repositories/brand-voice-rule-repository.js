const { AppError } = require("../error-model");

const ALLOWED_RULE_TYPES = ["tone", "banned_claim", "required_phrase", "style", "legal", "locale"];
const ALLOWED_SEVERITIES = ["info", "warning", "blocker"];

class BrandVoiceRuleRepository {
  constructor({ pool, brandProfiles }) {
    this.pool = pool;
    this.brandProfiles = brandProfiles;
  }

  async listByBrandProfile({ workspaceId, brandProfileId }) {
    try {
      await this.requireParentBrandProfile({ workspaceId, brandProfileId });

      const rows = await this.pool.query(
        `
          SELECT
            brand_voice_rule_id,
            brand_profile_id,
            workspace_id,
            rule_type,
            rule_text,
            severity
          FROM brand_voice_rules
          WHERE workspace_id = $1
            AND brand_profile_id = $2
          ORDER BY created_at, brand_voice_rule_id
        `,
        [workspaceId, brandProfileId],
        { workspaceId }
      );

      return rows.map(toPublicBrandVoiceRule);
    } catch (error) {
      throw toRepositoryError(error);
    }
  }

  async create({ workspaceId, brandProfileId, input }) {
    try {
      validateBrandVoiceRuleInput(input);

      return await this.pool.withTransaction(
        async (client) => {
          await requireParentBrandProfileWithClient(client, { workspaceId, brandProfileId });

          const inserted = await client.query(
            `
              INSERT INTO brand_voice_rules (
                workspace_id,
                brand_profile_id,
                rule_type,
                rule_text,
                severity
              )
              VALUES ($1, $2, $3, $4, $5)
              RETURNING
                brand_voice_rule_id,
                brand_profile_id,
                workspace_id,
                rule_type,
                rule_text,
                severity
            `,
            [workspaceId, brandProfileId, input.rule_type, input.rule_text, input.severity]
          );

          return toPublicBrandVoiceRule(inserted.rows[0]);
        },
        { workspaceId }
      );
    } catch (error) {
      throw toRepositoryError(error);
    }
  }

  async requireParentBrandProfile({ workspaceId, brandProfileId }) {
    if (this.brandProfiles) {
      const parent = await this.brandProfiles.getById({ workspaceId, brandProfileId });
      if (!parent) {
        throw brandProfileNotFoundError();
      }
      return parent;
    }

    const rows = await this.pool.query(
      `
        SELECT brand_profile_id
        FROM brand_profiles
        WHERE workspace_id = $1
          AND brand_profile_id = $2
        LIMIT 1
      `,
      [workspaceId, brandProfileId],
      { workspaceId }
    );

    if (!rows[0]) {
      throw brandProfileNotFoundError();
    }

    return rows[0];
  }
}

async function requireParentBrandProfileWithClient(client, { workspaceId, brandProfileId }) {
  const parent = await client.query(
    `
      SELECT brand_profile_id
      FROM brand_profiles
      WHERE workspace_id = $1
        AND brand_profile_id = $2
      LIMIT 1
    `,
    [workspaceId, brandProfileId]
  );

  if (parent.rows.length === 0) {
    throw brandProfileNotFoundError();
  }
}

function validateBrandVoiceRuleInput(input = {}) {
  const missing = ["rule_type", "rule_text", "severity"].filter((field) => input[field] === undefined || input[field] === null || input[field] === "");
  if (missing.length > 0) {
    throw new AppError(422, "VALIDATION_FAILED", `Missing required field(s): ${missing.join(", ")}.`, "Provide all required fields.");
  }

  if (!ALLOWED_RULE_TYPES.includes(input.rule_type)) {
    throw new AppError(422, "VALIDATION_FAILED", "Brand voice rule type is invalid.", "Use an approved value.");
  }

  if (!ALLOWED_SEVERITIES.includes(input.severity)) {
    throw new AppError(422, "VALIDATION_FAILED", "Brand voice rule severity is invalid.", "Use info, warning, or blocker.");
  }
}

function toPublicBrandVoiceRule(row) {
  return {
    brand_voice_rule_id: row.brand_voice_rule_id,
    brand_profile_id: row.brand_profile_id,
    workspace_id: row.workspace_id,
    rule_type: row.rule_type,
    rule_text: row.rule_text,
    severity: row.severity,
  };
}

function brandProfileNotFoundError() {
  return new AppError(
    404,
    "BRAND_PROFILE_NOT_FOUND",
    "Brand profile was not found in this workspace.",
    "Check the brand profile and workspace IDs."
  );
}

function toRepositoryError(error) {
  if (error instanceof AppError) {
    return error;
  }

  return new AppError(500, "INTERNAL_ERROR", "Database read failed.", "Retry or contact support.");
}

module.exports = {
  ALLOWED_RULE_TYPES,
  ALLOWED_SEVERITIES,
  BrandVoiceRuleRepository,
};
