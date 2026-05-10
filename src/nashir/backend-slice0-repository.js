"use strict";

class NashirSlice0Repository {
  async findCampaignById(id) {
    throw new Error("not implemented");
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

function createNashirSlice0Repository() {
  return new NashirSlice0Repository();
}

module.exports = {
  NashirSlice0Repository,
  createNashirSlice0Repository
};
