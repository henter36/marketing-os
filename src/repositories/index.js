const { WorkspaceRepository } = require("./workspace-repository");
const { MembershipRepository } = require("./membership-repository");
const { RbacRepository } = require("./rbac-repository");
const { BrandProfileRepository } = require("./brand-profile-repository");
const { BrandVoiceRuleRepository } = require("./brand-voice-rule-repository");

function createRepositories({ pool }) {
  const brandProfiles = new BrandProfileRepository({ pool });

  return {
    brandProfiles,
    brandVoiceRules: new BrandVoiceRuleRepository({ pool, brandProfiles }),
    memberships: new MembershipRepository({ pool }),
    rbac: new RbacRepository({ pool }),
    workspaces: new WorkspaceRepository({ pool }),
  };
}

module.exports = {
  BrandProfileRepository,
  BrandVoiceRuleRepository,
  MembershipRepository,
  RbacRepository,
  WorkspaceRepository,
  createRepositories,
};
