const roles = [
  ["owner", "Owner"],
  ["admin", "Admin"],
  ["creator", "Creator"],
  ["reviewer", "Reviewer"],
  ["publisher", "Publisher"],
  ["billing_admin", "BillingAdmin"],
  ["viewer", "Viewer"]
].map(([role_code, role_name]) => ({ role_code, role_name, role_scope: "workspace", is_system_role: true }));

const permissions = [
  "workspace.read",
  "workspace.create",
  "workspace.manage",
  "workspace.manage_members",
  "rbac.read",
  "billing.read",
  "brand.read",
  "brand.write",
  "prompt_template.read",
  "prompt_template.write",
  "report_template.read",
  "report_template.write",
  "campaign.read",
  "campaign.write",
  "brief.read",
  "brief.write",
  "media_job.read",
  "media_job.create",
  "media_job.update_status",
  "media_asset.read",
  "media_asset.create",
  "media_asset.version_create",
  "review.read",
  "review.assign",
  "approval.decide",
  "publish_job.create",
  "manual_evidence.read",
  "manual_evidence.submit",
  "manual_evidence.invalidate",
  "tracked_link.read",
  "tracked_link.create",
  "report.read",
  "report.generate",
  "usage.read",
  "usage.record",
  "cost.read",
  "cost.record",
  "cost_budget.read",
  "cost_budget.write",
  "cost_guardrail.read",
  "cost_guardrail.write",
  "audit.read",
  "operations.read",
  "operations.safe_mode",
  "onboarding.read",
  "onboarding.write"
].map((permission_code) => ({
  permission_code,
  permission_name: permission_code,
  domain: permission_code.split(".")[0]
}));

const rolePermissions = {
  owner: permissions.map((permission) => permission.permission_code),
  admin: permissions
    .map((permission) => permission.permission_code)
    .filter((code) => !["usage.record", "cost.record"].includes(code)),
  creator: [
    "workspace.read",
    "rbac.read",
    "brand.read",
    "brand.write",
    "prompt_template.read",
    "prompt_template.write",
    "report_template.read",
    "campaign.read",
    "campaign.write",
    "brief.read",
    "brief.write",
    "media_job.read",
    "media_job.create",
    "media_asset.read",
    "media_asset.create",
    "media_asset.version_create",
    "review.read",
    "review.assign"
  ],
  reviewer: ["workspace.read", "rbac.read", "campaign.read", "brief.read", "media_asset.read", "review.read", "approval.decide"],
  publisher: [
    "workspace.read",
    "rbac.read",
    "campaign.read",
    "media_job.read",
    "media_asset.read",
    "review.read",
    "publish_job.create",
    "manual_evidence.read",
    "manual_evidence.submit",
    "manual_evidence.invalidate",
    "tracked_link.read",
    "tracked_link.create"
  ],
  billing_admin: [
    "workspace.read",
    "rbac.read",
    "billing.read",
    "usage.read",
    "cost.read",
    "cost_budget.read",
    "cost_budget.write",
    "cost_guardrail.read",
    "cost_guardrail.write"
  ],
  viewer: [
    "workspace.read",
    "rbac.read",
    "brand.read",
    "prompt_template.read",
    "report_template.read",
    "campaign.read",
    "brief.read",
    "media_job.read",
    "media_asset.read",
    "review.read",
    "manual_evidence.read",
    "tracked_link.read",
    "report.read",
    "usage.read",
    "cost.read",
    "cost_budget.read",
    "cost_guardrail.read",
    "operations.read",
    "onboarding.read"
  ]
};

function hasPermission(roleCode, permissionCode) {
  return Boolean(rolePermissions[roleCode]?.includes(permissionCode));
}

module.exports = {
  hasPermission,
  permissions,
  rolePermissions,
  roles
};
