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

  async listCampaigns({ workspaceId } = {}) {
    if (!this.store || !Array.isArray(this.store.nashirCampaigns)) {
      return [];
    }
    if (!workspaceId) {
      return [];
    }
    return this.store.nashirCampaigns
      .filter((campaign) => campaign && campaign.workspace_id === workspaceId)
      .map((campaign) => ({ ...campaign }));
  }

  async createCampaign({ workspaceId, campaignName, actorUserId, timestamp } = {}) {
    if (!this.store || !Array.isArray(this.store.nashirCampaigns)) {
      return null;
    }
    if (!workspaceId || !campaignName || !actorUserId || !timestamp) {
      return null;
    }

    const campaign = {
      nashir_campaign_id: nextNashirCampaignId(this.store.nashirCampaigns),
      workspace_id: workspaceId,
      campaign_name: campaignName,
      campaign_status: "draft",
      created_by_user_id: actorUserId,
      created_at: timestamp,
      updated_at: timestamp
    };
    this.store.nashirCampaigns.push(campaign);
    return { ...campaign };
  }

  async listCampaignEvidence({ workspaceId, nashirCampaignId } = {}) {
    if (!workspaceId || !nashirCampaignId) {
      return [];
    }
    if (!this.store || !Array.isArray(this.store.nashirEvidence)) {
      return [];
    }
    return this.store.nashirEvidence
      .filter(
        (evidence) =>
          evidence &&
          evidence.workspace_id === workspaceId &&
          evidence.nashir_campaign_id === nashirCampaignId
      )
      .map((evidence) => ({ ...evidence }));
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

function nextNashirCampaignId(campaigns) {
  const existing = new Set(
    campaigns
      .filter(Boolean)
      .map((campaign) => campaign.nashir_campaign_id)
  );
  let index = campaigns.length + 1;
  let candidate = `nashir-campaign-${index}`;
  while (existing.has(candidate)) {
    index += 1;
    candidate = `nashir-campaign-${index}`;
  }
  return candidate;
}

module.exports = {
  NashirSlice0Repository,
  createNashirSlice0Repository
};
