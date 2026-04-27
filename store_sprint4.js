const base = require("./store_sprint3");

function createSeedStore() {
  const store = base.createSeedStore();

  store.clientReportSnapshots ||= [];
  store.safeModeStates ||= [];
  store.onboardingProgress ||= [];

  return store;
}

module.exports = { createSeedStore };
