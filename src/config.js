const brandRuntimeModes = ["in_memory", "repository"];
const nashirCampaignRuntimeModes = ["in_memory", "repository"];
const nashirEvidenceRuntimeModes = ["in_memory", "repository"];

class ConfigurationError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "ConfigurationError";
    this.code = code;
  }
}

function loadConfig(env = process.env) {
  return {
    nodeEnv: env.NODE_ENV || "development",
    port: Number(env.PORT || 3000),
    databaseUrl: env.DATABASE_URL || "",
    brandRuntimeMode: resolveBrandRuntimeMode(env),
    nashirCampaignRuntimeMode: resolveNashirCampaignRuntimeMode(env),
    nashirEvidenceRuntimeMode: resolveNashirEvidenceRuntimeMode(env),
  };
}

function resolveBrandRuntimeMode(env = {}) {
  const explicitMode = env.BRAND_RUNTIME_MODE;
  if (explicitMode !== undefined && explicitMode !== "") {
    if (!brandRuntimeModes.includes(explicitMode)) {
      throw new ConfigurationError(
        "INVALID_BRAND_RUNTIME_MODE",
        "Invalid BRAND_RUNTIME_MODE. Allowed values: in_memory, repository."
      );
    }
    return explicitMode;
  }

  return env.ENABLE_DB_BACKED_BRAND_ROUTES === "true" ? "repository" : "in_memory";
}

function resolveNashirCampaignRuntimeMode(env = {}) {
  const explicitMode = env.NASHIR_CAMPAIGN_RUNTIME_MODE;
  if (explicitMode !== undefined && explicitMode !== "") {
    if (!nashirCampaignRuntimeModes.includes(explicitMode)) {
      throw new ConfigurationError(
        "INVALID_NASHIR_CAMPAIGN_RUNTIME_MODE",
        "Invalid NASHIR_CAMPAIGN_RUNTIME_MODE. Allowed values: in_memory, repository."
      );
    }
    return explicitMode;
  }

  return "in_memory";
}

function resolveNashirEvidenceRuntimeMode(env = {}) {
  const explicitMode = env.NASHIR_EVIDENCE_RUNTIME_MODE;
  if (explicitMode !== undefined && explicitMode !== "") {
    if (!nashirEvidenceRuntimeModes.includes(explicitMode)) {
      throw new ConfigurationError(
        "INVALID_NASHIR_EVIDENCE_RUNTIME_MODE",
        "Invalid NASHIR_EVIDENCE_RUNTIME_MODE. Allowed values: in_memory, repository."
      );
    }
    return explicitMode;
  }

  return "in_memory";
}

module.exports = {
  ConfigurationError,
  loadConfig,
  resolveBrandRuntimeMode,
  resolveNashirCampaignRuntimeMode,
  resolveNashirEvidenceRuntimeMode
};
