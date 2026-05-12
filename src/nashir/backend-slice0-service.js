"use strict";

class NashirSlice0Service {
  constructor({ repository } = {}) {
    this.repository = repository || null;
  }

  async createCampaign(campaignData) {
    throw new Error("not implemented");
  }

  async getCampaignById({ workspaceId, nashirCampaignId }) {
    if (!this.repository) {
      return null;
    }
    return this.repository.findCampaignById({ workspaceId, nashirCampaignId });
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
