"use strict";

class NashirSlice0Repository {
  findCampaignById(id) {
    throw new Error("not implemented");
  }

  saveCampaign(campaign) {
    throw new Error("not implemented");
  }

  findEvidenceById(id) {
    throw new Error("not implemented");
  }

  saveEvidence(evidence) {
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
