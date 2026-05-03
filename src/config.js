const runtimeModes = ["in_memory", "repository"];

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
    validateRuntimeMode("BRAND_RUNTIME_MODE", "INVALID_BRAND_RUNTIME_MODE", explicitMode);
    return explicitMode;
  }

  return env.ENABLE_DB_BACKED_BRAND_ROUTES === "true" ? "repository" : "in_memory";
}

function resolveTemplateRuntimeMode(env = {}) {
  const explicitMode = env.TEMPLATE_RUNTIME_MODE;
  if (explicitMode !== undefined && explicitMode !== "") {
    validateRuntimeMode("TEMPLATE_RUNTIME_MODE", "INVALID_TEMPLATE_RUNTIME_MODE", explicitMode);
    return explicitMode;
  }

  return "in_memory";
}

function validateRuntimeMode(name, code, value) {
  if (!runtimeModes.includes(value)) {
    throw new ConfigurationError(code, `Invalid ${name}. Allowed values: in_memory, repository.`);
  }
}

module.exports = { ConfigurationError, loadConfig, resolveBrandRuntimeMode, resolveTemplateRuntimeMode };
