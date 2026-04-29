const { AppError } = require("../error-model");

class BrandProfileRepository {
  constructor({ pool }) {
    this.pool = pool;
  }

  async listByWorkspace({ workspaceId }) {
    try {
      const rows = await this.pool.query(
        `
          SELECT
            brand_profile_id,
            workspace_id,
            profile_name AS brand_name,
            COALESCE(brand_summary, '') AS brand_description
          FROM brand_profiles
          WHERE workspace_id = $1
          ORDER BY created_at, brand_profile_id
        `,
        [workspaceId],
        { workspaceId }
      );

      return rows.map(toPublicBrandProfile);
    } catch (error) {
      throw toRepositoryError(error);
    }
  }

  async getById({ workspaceId, brandProfileId }) {
    try {
      const rows = await this.pool.query(
        `
          SELECT
            brand_profile_id,
            workspace_id,
            profile_name AS brand_name,
            COALESCE(brand_summary, '') AS brand_description
          FROM brand_profiles
          WHERE workspace_id = $1
            AND brand_profile_id = $2
          LIMIT 1
        `,
        [workspaceId, brandProfileId],
        { workspaceId }
      );

      return rows[0] ? toPublicBrandProfile(rows[0]) : null;
    } catch (error) {
      throw toRepositoryError(error);
    }
  }

  async create({ workspaceId, input, actorUserId }) {
    try {
      validateBrandProfileInput(input);

      return await this.pool.withTransaction(
        async (client) => {
          const existing = await client.query(
            `
              SELECT brand_profile_id
              FROM brand_profiles
              WHERE workspace_id = $1
                AND profile_name = $2
              LIMIT 1
            `,
            [workspaceId, input.brand_name]
          );

          if (existing.rows.length > 0) {
            throw duplicateBrandProfileError();
          }

          const workspaceResult = await client.query(
            `
              SELECT default_locale
              FROM workspaces
              WHERE workspace_id = $1
              LIMIT 1
            `,
            [workspaceId]
          );

          const workspace = workspaceResult.rows[0];
          if (!workspace) {
            throw new AppError(404, "NOT_FOUND", "Workspace was not found.", "Check the workspace ID.");
          }

          if (!workspace.default_locale) {
            throw new AppError(422, "VALIDATION_FAILED", "Workspace default locale is required.", "Configure a workspace default locale.");
          }

          const inserted = await client.query(
            `
              INSERT INTO brand_profiles (
                workspace_id,
                profile_name,
                brand_summary,
                language,
                created_by_user_id
              )
              VALUES ($1, $2, $3, $4, $5)
              RETURNING
                brand_profile_id,
                workspace_id,
                profile_name AS brand_name,
                COALESCE(brand_summary, '') AS brand_description
            `,
            [workspaceId, input.brand_name, input.brand_description || "", workspace.default_locale, actorUserId]
          );

          return toPublicBrandProfile(inserted.rows[0]);
        },
        { workspaceId }
      );
    } catch (error) {
      throw toRepositoryError(error);
    }
  }
}

function validateBrandProfileInput(input = {}) {
  if (!input.brand_name) {
    throw new AppError(422, "VALIDATION_FAILED", "Missing required field(s): brand_name.", "Provide all required fields.");
  }
}

function toPublicBrandProfile(row) {
  return {
    brand_profile_id: row.brand_profile_id,
    workspace_id: row.workspace_id,
    brand_name: row.brand_name,
    brand_description: row.brand_description || "",
  };
}

function duplicateBrandProfileError() {
  return new AppError(
    409,
    "DUPLICATE_BRAND_PROFILE",
    "Brand profile already exists in this workspace.",
    "Use a different brand name."
  );
}

function toRepositoryError(error) {
  if (error instanceof AppError) {
    return error;
  }

  return new AppError(500, "INTERNAL_ERROR", "Database read failed.", "Retry or contact support.");
}

module.exports = {
  BrandProfileRepository,
};
