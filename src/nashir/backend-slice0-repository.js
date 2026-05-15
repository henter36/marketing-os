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
          (evidence.workspaceId || evidence.workspace_id) === workspaceId &&
          (evidence.nashirCampaignId || evidence.nashir_campaign_id) === nashirCampaignId
      )
      .map((evidence) => normalizeEvidenceRecord(evidence));
  }

  async findEvidenceById(input = {}) {
    const { workspaceId, nashirCampaignId, evidenceId } = input && typeof input === "object" ? input : {};
    if (!workspaceId || !nashirCampaignId || !evidenceId) {
      return null;
    }
    if (!this.store || !Array.isArray(this.store.nashirEvidence)) {
      return null;
    }

    const evidence = this.store.nashirEvidence.find(
      (candidate) =>
        candidate &&
        (candidate.workspaceId || candidate.workspace_id) === workspaceId &&
        (candidate.nashirCampaignId || candidate.nashir_campaign_id) === nashirCampaignId &&
        (candidate.id || candidate.evidence_id) === evidenceId
    );
    return evidence ? normalizeEvidenceRecord(evidence) : null;
  }

  async createCampaignEvidence({
    workspaceId,
    nashirCampaignId,
    evidenceType,
    channel,
    submittedAt,
    submittedBy,
    publishedAt = null,
    url = null,
    notes = null,
    externalReference = null
  } = {}) {
    if (!this.store || !Array.isArray(this.store.nashirEvidence)) {
      return null;
    }
    if (!workspaceId || !nashirCampaignId || !evidenceType || !channel || !submittedAt || !submittedBy) {
      return null;
    }

    const evidence = {
      id: nextNashirEvidenceId(this.store.nashirEvidence),
      workspaceId,
      nashirCampaignId,
      evidenceType,
      channel,
      status: "submitted",
      submittedAt,
      submittedBy,
      publishedAt,
      url,
      notes,
      externalReference
    };
    this.store.nashirEvidence.push(evidence);
    return { ...evidence };
  }

  async saveCampaign(campaign) {
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

function nextNashirEvidenceId(evidenceRecords) {
  const existing = new Set(
    evidenceRecords
      .filter(Boolean)
      .map((evidence) => evidence.id || evidence.evidence_id)
      .filter(Boolean)
  );
  let index = evidenceRecords.length + 1;
  let candidate = `nashir-evidence-${index}`;
  while (existing.has(candidate)) {
    index += 1;
    candidate = `nashir-evidence-${index}`;
  }
  return candidate;
}

function normalizeEvidenceRecord(evidence) {
  const {
    workspace_id: legacyWorkspaceId,
    nashir_campaign_id: legacyNashirCampaignId,
    ...rest
  } = evidence;
  return {
    ...rest,
    workspaceId: evidence.workspaceId || legacyWorkspaceId,
    nashirCampaignId: evidence.nashirCampaignId || legacyNashirCampaignId
  };
}

module.exports = {
  NashirSlice0Repository,
  createNashirSlice0Repository
};
