const { WorkspaceRepository } = require("./workspace-repository");
const { MembershipRepository } = require("./membership-repository");
const { RbacRepository } = require("./rbac-repository");
const { BrandProfileRepository } = require("./brand-profile-repository");
const { BrandVoiceRuleRepository } = require("./brand-voice-rule-repository");
const { PromptTemplateRepository } = require("./prompt-template-repository");
const { ReportTemplateRepository } = require("./report-template-repository");

function createRepositories({ pool }) {
  const brandProfiles = new BrandProfileRepository({ pool });

  return {
    brandProfiles,
    brandVoiceRules: new BrandVoiceRuleRepository({ pool, brandProfiles }),
    memberships: new MembershipRepository({ pool }),
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
  PromptTemplateRepository,
  RbacRepository,
  ReportTemplateRepository,
  WorkspaceRepository,
  createRepositories,
};
