"use strict";

class NashirSlice0Service {
  constructor({ repository } = {}) {
    this.repository = repository || null;
  }

  async createCampaign({ workspaceId, campaignName, actorUserId, timestamp } = {}) {
    if (!this.repository) {
      throw new Error("not implemented");
    }
    return this.repository.createCampaign({ workspaceId, campaignName, actorUserId, timestamp });
  }

  async getCampaignById({ workspaceId, nashirCampaignId } = {}) {
    if (!this.repository) {
      return null;
    }
    return this.repository.findCampaignById({ workspaceId, nashirCampaignId });
  }

  async listCampaigns({ workspaceId } = {}) {
    if (!this.repository) {
      return [];
    }
    return this.repository.listCampaigns({ workspaceId });
  }

  async scoreReadiness(id) {
    throw new Error("not implemented");
  }

  async submitForApproval(id) {
    throw new Error("not implemented");
  }

  async recordManualEvidence(id, evidenceData) {
    throw new Error("not implemented");
  }
}

function createNashirSlice0Service({ repository } = {}) {
  return new NashirSlice0Service({ repository });
}

module.exports = {
  NashirSlice0Service,
  createNashirSlice0Service
};
