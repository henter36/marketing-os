const { AppError } = require("../error-model");

const ALLOWED_TEMPLATE_TYPES = ["caption", "ad_copy", "image_prompt", "video_script", "report", "reply"];

class PromptTemplateRepository {
  constructor({ pool }) {
    this.pool = pool;
  }

  async listByWorkspace({ workspaceId }) {
    try {
      const rows = await this.pool.query(
        `
          SELECT
            prompt_template_id,
            workspace_id,
            template_name,
            template_type::text AS template_type,
            template_body,
            template_variables,
            template_status::text AS template_status,
            version_number
          FROM prompt_templates
          WHERE workspace_id = $1
          ORDER BY created_at, prompt_template_id
        `,
        [workspaceId],
        { workspaceId }
      );

      return rows.map(toPublicPromptTemplate);
    } catch (error) {
      throw toRepositoryError(error);
    }
  }

  async getById({ workspaceId, promptTemplateId }) {
    try {
      const rows = await this.pool.query(
        `
          SELECT
            prompt_template_id,
            workspace_id,
            template_name,
            template_type::text AS template_type,
            template_body,
            template_variables,
            template_status::text AS template_status,
            version_number
          FROM prompt_templates
          WHERE workspace_id = $1
            AND prompt_template_id = $2
          LIMIT 1
        `,
        [workspaceId, promptTemplateId],
        { workspaceId }
      );

      return rows[0] ? toPublicPromptTemplate(rows[0]) : null;
    } catch (error) {
      throw toRepositoryError(error);
    }
  }

  async create({ workspaceId, input, actorUserId }) {
    try {
      validatePromptTemplateInput(input);

      const inserted = await this.pool.query(
        `
          INSERT INTO prompt_templates (
            workspace_id,
            template_name,
            template_type,
            template_body,
            template_variables,
            version_number,
            created_by_user_id
          )
          VALUES ($1, $2, $3, $4, $5::jsonb, $6, $7)
          ON CONFLICT (workspace_id, template_name, version_number) DO NOTHING
          RETURNING
            prompt_template_id,
            workspace_id,
            template_name,
            template_type::text AS template_type,
            template_body,
            template_variables,
            template_status::text AS template_status,
            version_number
        `,
        [
          workspaceId,
          input.template_name,
          input.template_type,
          input.template_body,
          JSON.stringify(input.template_variables || []),
          input.version_number,
          actorUserId,
        ],
        { workspaceId }
      );

      if (!inserted[0]) {
        throw duplicatePromptTemplateError();
      }

      return toPublicPromptTemplate(inserted[0]);
    } catch (error) {
      throw toRepositoryError(error);
    }
  }
}

function validatePromptTemplateInput(input = {}) {
  const missing = ["template_name", "template_type", "template_body", "version_number"].filter(
    (field) => input[field] === undefined || input[field] === null || input[field] === ""
  );

  if (missing.length > 0) {
    throw new AppError(422, "VALIDATION_FAILED", `Missing required field(s): ${missing.join(", ")}.`, "Provide all required fields.");
  }

  if (!ALLOWED_TEMPLATE_TYPES.includes(input.template_type)) {
    throw new AppError(
      422,
      "VALIDATION_FAILED",
      "Prompt template type is invalid.",
      "Use caption, ad_copy, image_prompt, video_script, report, or reply."
    );
  }

  if (!Number.isInteger(input.version_number) || input.version_number <= 0) {
    throw new AppError(422, "VALIDATION_FAILED", "Prompt template version_number is invalid.", "Use a positive integer version_number.");
  }

  if (input.template_variables !== undefined && !Array.isArray(input.template_variables) && typeof input.template_variables !== "object") {
    throw new AppError(422, "VALIDATION_FAILED", "template_variables must be JSON-compatible.", "Send template_variables as a JSON object or array.");
  }
}

function toPublicPromptTemplate(row) {
  return {
    prompt_template_id: row.prompt_template_id,
    workspace_id: row.workspace_id,
    template_name: row.template_name,
    template_type: row.template_type,
    template_body: row.template_body,
    template_variables: row.template_variables || [],
    template_status: row.template_status || "draft",
    version_number: row.version_number,
  };
}

function duplicatePromptTemplateError() {
  return new AppError(
    409,
    "DUPLICATE_TEMPLATE_VERSION",
    "Prompt template version already exists.",
    "Use a new version number."
  );
}

function toRepositoryError(error) {
  if (error instanceof AppError) {
    return error;
  }

  return new AppError(500, "INTERNAL_ERROR", "Database read failed.", "Retry or contact support.");
}

module.exports = {
  ALLOWED_TEMPLATE_TYPES,
  PromptTemplateRepository,
};
