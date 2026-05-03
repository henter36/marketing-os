const { AppError } = require("../error-model");

class ReportTemplateRepository {
  constructor({ pool }) {
    this.pool = pool;
  }

  async listByWorkspace({ workspaceId }) {
    try {
      const rows = await this.pool.query(
        `
          SELECT
            report_template_id,
            workspace_id,
            template_name,
            template_body,
            template_status::text AS template_status
          FROM report_templates
          WHERE workspace_id = $1
          ORDER BY created_at, report_template_id
        `,
        [workspaceId],
        { workspaceId }
      );

      return rows.map(toPublicReportTemplate);
    } catch (error) {
      throw toRepositoryError(error);
    }
  }

  async getById({ workspaceId, reportTemplateId }) {
    try {
      const rows = await this.pool.query(
        `
          SELECT
            report_template_id,
            workspace_id,
            template_name,
            template_body,
            template_status::text AS template_status
          FROM report_templates
          WHERE workspace_id = $1
            AND report_template_id = $2
          LIMIT 1
        `,
        [workspaceId, reportTemplateId],
        { workspaceId }
      );

      return rows[0] ? toPublicReportTemplate(rows[0]) : null;
    } catch (error) {
      throw toRepositoryError(error);
    }
  }

  async create({ workspaceId, input, actorUserId }) {
    try {
      validateReportTemplateInput(input);

      const inserted = await this.pool.query(
        `
          INSERT INTO report_templates (
            workspace_id,
            template_name,
            template_body,
            created_by_user_id
          )
          VALUES ($1, $2, $3::jsonb, $4)
          ON CONFLICT (workspace_id, template_name) DO NOTHING
          RETURNING
            report_template_id,
            workspace_id,
            template_name,
            template_body,
            template_status::text AS template_status
        `,
        [workspaceId, input.template_name, JSON.stringify(input.template_body), actorUserId],
        { workspaceId }
      );

      if (!inserted[0]) {
        throw duplicateReportTemplateError();
      }

      return toPublicReportTemplate(inserted[0]);
    } catch (error) {
      throw toRepositoryError(error);
    }
  }
}

function validateReportTemplateInput(input = {}) {
  const missing = ["template_name", "template_body"].filter(
    (field) => input[field] === undefined || input[field] === null || input[field] === ""
  );

  if (missing.length > 0) {
    throw new AppError(422, "VALIDATION_FAILED", `Missing required field(s): ${missing.join(", ")}.`, "Provide all required fields.");
  }
}

function toPublicReportTemplate(row) {
  return {
    report_template_id: row.report_template_id,
    workspace_id: row.workspace_id,
    template_name: row.template_name,
    template_body: row.template_body,
    template_status: row.template_status || "draft",
  };
}

function duplicateReportTemplateError() {
  return new AppError(
    409,
    "DUPLICATE_REPORT_TEMPLATE",
    "Report template already exists in this workspace.",
    "Use a different template_name."
  );
}

function toRepositoryError(error) {
  if (error instanceof AppError) {
    return error;
  }

  return new AppError(500, "INTERNAL_ERROR", "Database read failed.", "Retry or contact support.");
}

module.exports = {
  ReportTemplateRepository,
};
