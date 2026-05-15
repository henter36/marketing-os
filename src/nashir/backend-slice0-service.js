"use strict";

class NashirSlice0Service {
  constructor({ repository, evidenceRepository } = {}) {
    this.repository = repository || null;
    this.evidenceRepository = evidenceRepository || null;
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

  async listCampaignEvidence({ workspaceId, nashirCampaignId } = {}) {
    const campaign = await this.getCampaignById({ workspaceId, nashirCampaignId });
    if (!campaign) {
      return null;
    }
    if (this.evidenceRepository) {
      const evidence = await this.evidenceRepository.listByCampaign({ workspaceId, nashirCampaignId });
      return evidence.map(toRuntimeEvidence);
    }
    return this.repository.listCampaignEvidence({ workspaceId, nashirCampaignId });
  }

  async getCampaignEvidenceById({ workspaceId, nashirCampaignId, evidenceId } = {}) {
    const campaign = await this.getCampaignById({ workspaceId, nashirCampaignId });
    if (!campaign) {
      return null;
    }
    if (this.evidenceRepository) {
      const evidence = await this.evidenceRepository.getById({ workspaceId, nashirCampaignId, evidenceId });
      return evidence ? toRuntimeEvidence(evidence) : null;
    }
    return this.repository.findEvidenceById({ workspaceId, nashirCampaignId, evidenceId });
  }

  async createCampaignEvidence({
    workspaceId,
    nashirCampaignId,
    evidenceType,
    channel,
    submittedAt,
    submittedBy,
    publishedAt,
    url,
    notes,
    externalReference
  } = {}) {
    const campaign = await this.getCampaignById({ workspaceId, nashirCampaignId });
    if (!campaign) {
      return null;
    }
    if (this.evidenceRepository) {
      const evidence = await this.evidenceRepository.createSubmittedEvidence({
        workspaceId,
        nashirCampaignId,
        evidenceType,
        channel,
        submittedAt,
        submittedByUserId: submittedBy,
        publishedAt,
        url,
        notes,
        externalReference
      });
      return evidence ? toRuntimeEvidence(evidence) : null;
    }
    return this.repository.createCampaignEvidence({
      workspaceId,
      nashirCampaignId,
      evidenceType,
      channel,
      submittedAt,
      submittedBy,
      publishedAt,
      url,
      notes,
      externalReference
    });
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

function createNashirSlice0Service({ repository, evidenceRepository } = {}) {
  return new NashirSlice0Service({ repository, evidenceRepository });
}

function toRuntimeEvidence(evidence) {
  const {
    submittedByUserId,
    submitted_by_user_id: submittedByUserIdLegacy,
    ...rest
  } = evidence;
  return {
    ...rest,
    submittedBy: evidence.submittedBy || submittedByUserId || submittedByUserIdLegacy
  };
}

module.exports = {
  NashirSlice0Service,
  createNashirSlice0Service
};
