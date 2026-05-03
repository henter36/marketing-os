const { AppError } = require("./error-model");
const { hasPermission } = require("./rbac");

const promptTemplateTypes = ["caption", "ad_copy", "image_prompt", "video_script", "report", "reply"];

function authGuard(req, store) {
  const userId = req.headers["x-user-id"];
  if (!userId) {
    throw new AppError(401, "AUTH_REQUIRED", "Authentication is required.", "Sign in and retry the request.");
  }

  const user = store.users.find((candidate) => candidate.user_id === userId);
  if (!user) {
    throw new AppError(401, "AUTH_REQUIRED", "Authenticated user was not found.", "Use a valid test user.");
  }

  return user;
}

function workspaceContextGuard(params) {
  if (!params.workspaceId) {
    throw new AppError(400, "TENANT_CONTEXT_MISSING", "Workspace context is required.", "Use a workspace-scoped route.");
  }
  return params.workspaceId;
}

function rejectBodyWorkspaceId(body, workspaceId) {
  if (body && Object.hasOwn(body, "workspace_id") && body.workspace_id !== workspaceId) {
    throw new AppError(
      422,
      "TENANT_CONTEXT_MISMATCH",
      "workspace_id in the request body does not match the route workspace.",
      "Remove workspace_id from the body and use the route workspace."
    );
  }

  alignTemplateRuntimeBody(body);
}

function alignTemplateRuntimeBody(body) {
  if (!body || !Object.hasOwn(body, "template_name") || !Object.hasOwn(body, "template_body")) {
    return;
  }

  if (Object.hasOwn(body, "template_variables") && Object.hasOwn(body, "variables")) {
    if (!sameJson(body.template_variables, body.variables)) {
      throw new AppError(
        422,
        "VALIDATION_FAILED",
        "variables and template_variables must match when both are provided.",
        "Send only template_variables, or send matching variables and template_variables during compatibility migration."
      );
    }
  }

  if (Object.hasOwn(body, "template_variables") && !Object.hasOwn(body, "variables")) {
    body.variables = body.template_variables;
  }

  if (Object.hasOwn(body, "variables") && !Object.hasOwn(body, "template_variables")) {
    body.template_variables = body.variables;
  }

  if (Object.hasOwn(body, "template_type") && !promptTemplateTypes.includes(body.template_type)) {
    throw new AppError(
      422,
      "VALIDATION_FAILED",
      "Prompt template type is invalid.",
      "Use caption, ad_copy, image_prompt, video_script, report, or reply."
    );
  }

  if (!Object.hasOwn(body, "template_type") && !Object.hasOwn(body, "report_type")) {
    body.report_type = "legacy_compatibility_input";
  }
}

function sameJson(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function membershipCheck(user, workspaceId, store) {
  const membership = store.memberships.find(
    (candidate) =>
      candidate.user_id === user.user_id &&
      candidate.workspace_id === workspaceId &&
      candidate.member_status === "active"
  );

  if (!membership) {
    throw new AppError(403, "WORKSPACE_ACCESS_DENIED", "User is not a member of this workspace.", "Switch workspace or request access.");
  }

  return membership;
}

function permissionGuard(membership, permission) {
  if (!hasPermission(membership.role_code, permission)) {
    throw new AppError(403, "PERMISSION_DENIED", "User does not have the required permission.", "Ask a workspace admin for the right role.");
  }
}

module.exports = {
  authGuard,
  membershipCheck,
  permissionGuard,
  rejectBodyWorkspaceId,
  workspaceContextGuard
};
