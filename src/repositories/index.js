const { WorkspaceRepository } = require("./workspace-repository");
const { MembershipRepository } = require("./membership-repository");
const { RbacRepository } = require("./rbac-repository");

function createRepositories({ pool }) {
  return {
    memberships: new MembershipRepository({ pool }),
    rbac: new RbacRepository({ pool }),
    workspaces: new WorkspaceRepository({ pool }),
  };
}

module.exports = {
  MembershipRepository,
  RbacRepository,
  WorkspaceRepository,
  createRepositories,
};
