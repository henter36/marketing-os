function loadConfig(env = process.env) {
  return {
    nodeEnv: env.NODE_ENV || "development",
    port: Number(env.PORT || 3000),
    databaseUrl: env.DATABASE_URL || "",
    brandRuntimeMode: resolveBrandRuntimeMode(env),
  };
}

function resolveBrandRuntimeMode(env) {
  const explicitMode = env.BRAND_RUNTIME_MODE;
  if (explicitMode) {
    if (!["in_memory", "repository"].includes(explicitMode)) {
      return "in_memory";
    }
    return explicitMode;
  }

  return env.ENABLE_DB_BACKED_BRAND_ROUTES === "true" ? "repository" : "in_memory";
}

module.exports = { loadConfig, resolveBrandRuntimeMode };
