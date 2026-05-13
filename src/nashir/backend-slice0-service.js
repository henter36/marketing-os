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

  async getCampaignReadiness({ workspaceId, nashirCampaignId, evaluatedAt } = {}) {
    const campaign = await this.getCampaignById({ workspaceId, nashirCampaignId });
    if (!campaign) {
      return null;
    }

    return {
      nashir_campaign_id: campaign.nashir_campaign_id,
      workspace_id: workspaceId,
      readiness_level: "pass",
      gate_state: "advisory_only",
      blockers: [],
      warnings: [],
      missing_fields: [],
      explanations: [
        {
          code: "NASHIR_READINESS_ADVISORY_ONLY",
          message: "Readiness is advisory and does not approve content or authorize publishing.",
          related_fields: []
        }
      ],
      evaluated_at: evaluatedAt
    };
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
