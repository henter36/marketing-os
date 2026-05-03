const runtimeModes = ["in_memory", "repository"];
const brandRuntimeModes = runtimeModes;
const templateRuntimeModes = runtimeModes;

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
    templateRuntimeMode: resolveTemplateRuntimeMode(env),
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

function resolveTemplateRuntimeMode(env = {}) {
  const explicitMode = env.TEMPLATE_RUNTIME_MODE;
  if (explicitMode !== undefined && explicitMode !== "") {
    if (!templateRuntimeModes.includes(explicitMode)) {
      throw new ConfigurationError(
        "INVALID_TEMPLATE_RUNTIME_MODE",
        "Invalid TEMPLATE_RUNTIME_MODE. Allowed values: in_memory, repository."
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
  resolveTemplateRuntimeMode,
};
