const { WorkspaceRepository } = require("./workspace-repository");
const { MembershipRepository } = require("./membership-repository");
const { RbacRepository } = require("./rbac-repository");
const { BrandProfileRepository } = require("./brand-profile-repository");
const { BrandVoiceRuleRepository } = require("./brand-voice-rule-repository");
const { NashirCampaignRepository } = require("./nashir-campaign-repository");
const { NashirStoreProfileRepository } = require("./nashir-store-profile-repository");
const { NashirProductRepository } = require("./nashir-product-repository");
const { PromptTemplateRepository } = require("./prompt-template-repository");
const { ReportTemplateRepository } = require("./report-template-repository");
const { NashirEvidenceLifecycleRepository } = require("./nashir-evidence-lifecycle-repository");

function createRepositories({ pool }) {
  const brandProfiles = new BrandProfileRepository({ pool });

  return {
    brandProfiles,
    brandVoiceRules: new BrandVoiceRuleRepository({ pool, brandProfiles }),
    nashirCampaigns: new NashirCampaignRepository({ pool }),
    nashirStoreProfiles: new NashirStoreProfileRepository({ pool }),
    nashirProducts: new NashirProductRepository({ pool }),
    memberships: new MembershipRepository({ pool }),
    nashirEvidenceLifecycle: new NashirEvidenceLifecycleRepository({ pool }),
    promptTemplates: new PromptTemplateRepository({ pool }),
    rbac: new RbacRepository({ pool }),
    reportTemplates: new ReportTemplateRepository({ pool }),
    workspaces: new WorkspaceRepository({ pool }),
  };
}

module.exports = {
  BrandProfileRepository,
  BrandVoiceRuleRepository,
  MembershipRepository,
  NashirCampaignRepository,
  NashirStoreProfileRepository,
  NashirProductRepository,
  NashirEvidenceLifecycleRepository,
  PromptTemplateRepository,
  RbacRepository,
  ReportTemplateRepository,
  WorkspaceRepository,
  createRepositories,
};
