"use strict";

class NashirSlice0Repository {
  constructor({ store } = {}) {
    this.store = store || null;
  }

  async findCampaignById({ workspaceId, nashirCampaignId } = {}) {
    if (!this.store || !Array.isArray(this.store.nashirCampaigns)) {
      return null;
    }
    if (!workspaceId || !nashirCampaignId) {
      return null;
    }
    const campaign = this.store.nashirCampaigns.find(
      (c) => c && c.workspace_id === workspaceId && c.nashir_campaign_id === nashirCampaignId
    );
    return campaign ? { ...campaign } : null;
  }

  async saveCampaign(campaign) {
    throw new Error("not implemented");
  }

  async findEvidenceById(id) {
    throw new Error("not implemented");
  }

  async saveEvidence(evidence) {
    throw new Error("not implemented");
  }
}

function createNashirSlice0Repository({ store } = {}) {
  return new NashirSlice0Repository({ store });
}

module.exports = {
  NashirSlice0Repository,
  createNashirSlice0Repository
};
