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
    {
      campaign_id: "campaign-a",
      workspace_id: "workspace-a",
      customer_account_id: "customer-a",
      campaign_name: "Campaign A",
      campaign_objective: "Launch product A",
      campaign_status: "draft"
    },
    {
      campaign_id: "campaign-b",
      workspace_id: "workspace-b",
      customer_account_id: "customer-b",
      campaign_name: "Campaign B",
      campaign_objective: "Launch product B",
      campaign_status: "draft"
    }
  ];

  const mediaAssets = [
    { media_asset_id: "asset-a", workspace_id: "workspace-a", asset_type: "text" },
    { media_asset_id: "asset-b", workspace_id: "workspace-b", asset_type: "text" }
  ];

  return {
    users,
    workspaces,
    memberships,
    brandProfiles: [
      {
        brand_profile_id: "brand-profile-a",
        workspace_id: "workspace-a",
        brand_name: "Brand A",
        brand_description: "Workspace A brand"
      },
      {
        brand_profile_id: "brand-profile-b",
        workspace_id: "workspace-b",
        brand_name: "Brand B",
        brand_description: "Workspace B brand"
      }
    ],
    brandVoiceRules: [
      {
        brand_voice_rule_id: "brand-rule-a",
        brand_profile_id: "brand-profile-a",
        workspace_id: "workspace-a",
        rule_type: "tone",
        rule_text: "Use clear language.",
        severity: "info"
      }
    ],
    promptTemplates: [
      {
        prompt_template_id: "prompt-template-a",
        workspace_id: "workspace-a",
        template_name: "Caption Prompt",
        template_type: "caption",
        template_body: "Write a caption for {{product}}.",
        variables: ["product"],
        version_number: 1
      }
    ],
    reportTemplates: [
      {
        report_template_id: "report-template-a",
        workspace_id: "workspace-a",
        template_name: "Monthly Report",
        report_type: "monthly",
        template_body: { sections: ["summary"] }
      }
    ],
    campaigns,
    campaignStateTransitions: [
      {
        campaign_state_transition_id: "campaign-transition-a",
        campaign_id: "campaign-a",
        workspace_id: "workspace-a",
        from_status: null,
        to_status: "draft",
        reason: "Seed state",
        changed_at: "2026-04-27T00:00:00.000Z"
      }
    ],
    briefVersions: [
      {
        brief_version_id: "brief-version-a",
        workspace_id: "workspace-a",
        campaign_id: "campaign-a",
        version_number: 1,
        brief_title: "Seed Brief",
        brief_content: { goal: "Launch product A" },
        content_hash: "a".repeat(64),
        status: "draft"
      }
    ],
    mediaAssets,
    roles,
    permissions,
    rolePermissions,
    auditLogs: []
  };
}

module.exports = { createSeedStore };
