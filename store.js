const { AppError } = require("./error-model");
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

  const promptTemplates = [
    {
      prompt_template_id: "prompt-template-a",
      workspace_id: "workspace-a",
      template_name: "Caption Prompt",
      template_type: "caption",
      template_body: "Write a caption for {{product}}.",
      variables: ["product"],
      version_number: 1
    },
    {
      prompt_template_id: "prompt-template-b",
      workspace_id: "workspace-b",
      template_name: "Caption Prompt B",
      template_type: "caption",
      template_body: "Write a caption for workspace B.",
      variables: [],
      version_number: 1
    }
  ];

  const briefVersions = [
    {
      brief_version_id: "brief-version-a",
      workspace_id: "workspace-a",
      campaign_id: "campaign-a",
      version_number: 1,
      brief_title: "Seed Brief",
      brief_content: { goal: "Launch product A" },
      content_hash: "a".repeat(64),
      status: "draft"
    },
    {
      brief_version_id: "brief-version-b",
      workspace_id: "workspace-b",
      campaign_id: "campaign-b",
      version_number: 1,
      brief_title: "Seed Brief B",
      brief_content: { goal: "Launch product B" },
      content_hash: "b".repeat(64),
      status: "draft"
    }
  ];

  const mediaCostPolicies = [
    { media_cost_policy_id: "media-cost-policy-a", workspace_id: "workspace-a", policy_status: "active" },
    { media_cost_policy_id: "media-cost-policy-b", workspace_id: "workspace-b", policy_status: "active" }
  ];

  const mediaCostSnapshots = [
    {
      media_cost_snapshot_id: "media-cost-snapshot-a",
      workspace_id: "workspace-a",
      customer_account_id: "customer-a",
      campaign_id: "campaign-a",
      brief_version_id: "brief-version-a",
      prompt_template_id: "prompt-template-a",
      job_type: "text",
      estimated_amount: 5,
      currency: "USD",
      cost_check_result: "approved"
    },
    {
      media_cost_snapshot_id: "media-cost-snapshot-b",
      workspace_id: "workspace-b",
      customer_account_id: "customer-b",
      campaign_id: "campaign-b",
      brief_version_id: "brief-version-b",
      prompt_template_id: "prompt-template-b",
      job_type: "text",
      estimated_amount: 5,
      currency: "USD",
      cost_check_result: "approved"
    }
  ];

  const mediaJobs = [
    {
      media_job_id: "media-job-a",
      workspace_id: "workspace-a",
      customer_account_id: "customer-a",
      campaign_id: "campaign-a",
      brief_version_id: "brief-version-a",
      prompt_template_id: "prompt-template-a",
      media_cost_snapshot_id: "media-cost-snapshot-a",
      job_type: "text",
      job_status: "succeeded",
      input_payload: { topic: "Seed" },
      requested_output_format: "text/plain",
      idempotency_key: "seed-media-job-a",
      failure_code: null
    },
    {
      media_job_id: "media-job-b",
      workspace_id: "workspace-b",
      customer_account_id: "customer-b",
      campaign_id: "campaign-b",
      brief_version_id: "brief-version-b",
      prompt_template_id: "prompt-template-b",
      media_cost_snapshot_id: "media-cost-snapshot-b",
      job_type: "text",
      job_status: "succeeded",
      input_payload: { topic: "Seed B" },
      requested_output_format: "text/plain",
      idempotency_key: "seed-media-job-b",
      failure_code: null
    }
  ];

  const mediaAssets = [
    {
      media_asset_id: "asset-a",
      workspace_id: "workspace-a",
      customer_account_id: "customer-a",
      media_job_id: "media-job-a",
      campaign_id: "campaign-a",
      asset_type: "text",
      asset_status: "draft"
    },
    {
      media_asset_id: "asset-b",
      workspace_id: "workspace-b",
      customer_account_id: "customer-b",
      media_job_id: "media-job-b",
      campaign_id: "campaign-b",
      asset_type: "text",
      asset_status: "draft"
    }
  ];

  const mediaAssetVersions = [
    {
      media_asset_version_id: "asset-version-a",
      workspace_id: "workspace-a",
      customer_account_id: "customer-a",
      media_asset_id: "asset-a",
      version_number: 1,
      content_payload: { text: "Approved seed output" },
      content_hash: "c".repeat(64),
      storage_ref: null,
      version_status: "approved"
    },
    {
      media_asset_version_id: "asset-version-b",
      workspace_id: "workspace-b",
      customer_account_id: "customer-b",
      media_asset_id: "asset-b",
      version_number: 1,
      content_payload: { text: "Workspace B output" },
      content_hash: "d".repeat(64),
      storage_ref: null,
      version_status: "draft"
    }
  ];

  const store = {
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
    promptTemplates,
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
    briefVersions,
    mediaCostPolicies,
    mediaCostSnapshots,
    mediaJobs,
    mediaAssets,
    mediaAssetVersions,
    usageMeters: [],
    usageQuotaStates: [
      {
        workspace_id: "workspace-a",
        customer_account_id: "customer-a",
        quota_code: "media_outputs",
        period_start: "2026-04-01T00:00:00.000Z",
        period_end: "2026-05-01T00:00:00.000Z",
        used_quantity: 0,
        limit_quantity: 100
      },
      {
        workspace_id: "workspace-b",
        customer_account_id: "customer-b",
        quota_code: "media_outputs",
        period_start: "2026-04-01T00:00:00.000Z",
        period_end: "2026-05-01T00:00:00.000Z",
        used_quantity: 0,
        limit_quantity: 50
      }
    ],
    costBudgets: [
      {
        cost_budget_id: "cost-budget-a",
        workspace_id: "workspace-a",
        customer_account_id: "customer-a",
        budget_name: "Seed Budget",
        budget_amount: 1000,
        currency: "USD",
        period_start: "2026-04-01T00:00:00.000Z",
        period_end: "2026-05-01T00:00:00.000Z",
        budget_status: "active"
      }
    ],
    costGuardrails: [
      {
        cost_guardrail_id: "cost-guardrail-a",
        workspace_id: "workspace-a",
        customer_account_id: "customer-a",
        guardrail_name: "Seed Per Job Guardrail",
        guardrail_type: "per_job",
        threshold_amount: 100,
        currency: "USD",
        action: "block",
        guardrail_status: "active"
      }
    ],
    costEvents: [],
    idempotencyRecords: [],
    roles,
    permissions,
    rolePermissions,
    auditLogs: []
  };

  return normalizeTemplateRuntimeStore(store);
}

function normalizeTemplateRuntimeStore(store) {
  store.promptTemplates.forEach(attachPromptTemplateSerializer);
  store.reportTemplates.forEach(attachReportTemplateSerializer);

  const originalPromptPush = store.promptTemplates.push.bind(store.promptTemplates);
  store.promptTemplates.push = (...items) => originalPromptPush(...items.map(attachPromptTemplateSerializer));

  const originalReportPush = store.reportTemplates.push.bind(store.reportTemplates);
  store.reportTemplates.push = (...items) => {
    for (const item of items) {
      if (store.reportTemplates.some((candidate) => candidate.workspace_id === item.workspace_id && candidate.template_name === item.template_name)) {
        throw new AppError(
          409,
          "DUPLICATE_REPORT_TEMPLATE",
          "Report template already exists in this workspace.",
          "Use a different template_name."
        );
      }
    }
    return originalReportPush(...items.map(attachReportTemplateSerializer));
  };

  return store;
}

function attachPromptTemplateSerializer(template) {
  template.template_variables ??= template.variables ?? [];
  template.variables = template.template_variables;
  template.template_status ??= "draft";
  Object.defineProperty(template, "toJSON", {
    configurable: true,
    enumerable: false,
    value() {
      return {
        prompt_template_id: this.prompt_template_id,
        workspace_id: this.workspace_id,
        template_name: this.template_name,
        template_type: this.template_type,
        template_body: this.template_body,
        template_variables: this.template_variables ?? this.variables ?? [],
        template_status: this.template_status ?? "draft",
        version_number: this.version_number
      };
    }
  });
  return template;
}

function attachReportTemplateSerializer(template) {
  template.template_status ??= "draft";
  Object.defineProperty(template, "toJSON", {
    configurable: true,
    enumerable: false,
    value() {
      return {
        report_template_id: this.report_template_id,
        workspace_id: this.workspace_id,
        template_name: this.template_name,
        template_body: this.template_body,
        template_status: this.template_status ?? "draft"
      };
    }
  });
  return template;
}

module.exports = { createSeedStore };
