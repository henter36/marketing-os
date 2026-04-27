const { roles, permissions, rolePermissions } = require("./rbac");

function createSeedStore() {
  const users = [
    { user_id: "user-owner-a", email: "owner-a@example.com", full_name: "Owner A" },
    { user_id: "user-admin-a", email: "admin-a@example.com", full_name: "Admin A" },
    { user_id: "user-creator-a", email: "creator-a@example.com", full_name: "Creator A" },
    { user_id: "user-reviewer-a", email: "reviewer-a@example.com", full_name: "Reviewer A" },
    { user_id: "user-publisher-a", email: "publisher-a@example.com", full_name: "Publisher A" },
    { user_id: "user-billing-a", email: "billing-a@example.com", full_name: "Billing A" },
    { user_id: "user-viewer-a", email: "viewer-a@example.com", full_name: "Viewer A" },
    { user_id: "user-outsider", email: "outsider@example.com", full_name: "Outsider" }
  ];

  const workspaces = [
    { workspace_id: "workspace-a", customer_account_id: "customer-a", workspace_name: "Workspace A" },
    { workspace_id: "workspace-b", customer_account_id: "customer-b", workspace_name: "Workspace B" }
  ];

  const memberships = [
    ["user-owner-a", "workspace-a", "owner"],
    ["user-admin-a", "workspace-a", "admin"],
    ["user-creator-a", "workspace-a", "creator"],
    ["user-reviewer-a", "workspace-a", "reviewer"],
    ["user-publisher-a", "workspace-a", "publisher"],
    ["user-billing-a", "workspace-a", "billing_admin"],
    ["user-viewer-a", "workspace-a", "viewer"],
    ["user-owner-a", "workspace-b", "owner"]
  ].map(([user_id, workspace_id, role_code], index) => ({
    workspace_member_id: `member-${index + 1}`,
    user_id,
    workspace_id,
    role_code,
    member_status: "active"
  }));

  const campaigns = [
    { campaign_id: "campaign-a", workspace_id: "workspace-a", campaign_name: "Campaign A" },
    { campaign_id: "campaign-b", workspace_id: "workspace-b", campaign_name: "Campaign B" }
  ];

  const mediaAssets = [
    { media_asset_id: "asset-a", workspace_id: "workspace-a", asset_type: "text" },
    { media_asset_id: "asset-b", workspace_id: "workspace-b", asset_type: "text" }
  ];

  return {
    users,
    workspaces,
    memberships,
    campaigns,
    mediaAssets,
    roles,
    permissions,
    rolePermissions,
    auditLogs: []
  };
}

module.exports = { createSeedStore };
