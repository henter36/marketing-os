const assert = require("assert");
const { test } = require("node:test");

const {
  ConfigurationError,
  loadConfig,
  resolveBrandRuntimeMode,
  resolveNashirCampaignRuntimeMode,
  resolveNashirEvidenceRuntimeMode
} = require("../src/config");

test("missing BRAND_RUNTIME_MODE defaults to in_memory", () => {
  assert.equal(resolveBrandRuntimeMode({}), "in_memory");
  assert.equal(loadConfig({}).brandRuntimeMode, "in_memory");
});

test("explicit BRAND_RUNTIME_MODE values resolve directly", () => {
  assert.equal(resolveBrandRuntimeMode({ BRAND_RUNTIME_MODE: "in_memory" }), "in_memory");
  assert.equal(resolveBrandRuntimeMode({ BRAND_RUNTIME_MODE: "repository" }), "repository");
});

test("invalid BRAND_RUNTIME_MODE throws a safe configuration error", () => {
  assert.throws(
    () => resolveBrandRuntimeMode({
      BRAND_RUNTIME_MODE: "bad",
      DATABASE_URL: "postgres://user:password@db.example.test:5432/marketing_os",
      SECRET_TOKEN: "super-secret-token",
    }),
    (error) => {
      assert(error instanceof ConfigurationError);
      assert.equal(error.name, "ConfigurationError");
      assert.equal(error.code, "INVALID_BRAND_RUNTIME_MODE");
      assert.equal(error.message, "Invalid BRAND_RUNTIME_MODE. Allowed values: in_memory, repository.");
      assert.match(error.message, /in_memory/);
      assert.match(error.message, /repository/);
      assert.doesNotMatch(error.message, /bad/);
      assert.doesNotMatch(error.message, /DATABASE_URL|postgres|password|db\.example|user|SECRET_TOKEN|super-secret-token/i);
      return true;
    }
  );
});

test("ENABLE_DB_BACKED_BRAND_ROUTES enables repository only when BRAND_RUNTIME_MODE is absent", () => {
  assert.equal(resolveBrandRuntimeMode({ ENABLE_DB_BACKED_BRAND_ROUTES: "true" }), "repository");
  assert.equal(
    resolveBrandRuntimeMode({ BRAND_RUNTIME_MODE: "in_memory", ENABLE_DB_BACKED_BRAND_ROUTES: "true" }),
    "in_memory"
  );
  assert.equal(
    resolveBrandRuntimeMode({ BRAND_RUNTIME_MODE: "repository", ENABLE_DB_BACKED_BRAND_ROUTES: "true" }),
    "repository"
  );
});

test("empty BRAND_RUNTIME_MODE preserves missing-mode compatibility", () => {
  assert.equal(resolveBrandRuntimeMode({ BRAND_RUNTIME_MODE: "" }), "in_memory");
  assert.equal(resolveBrandRuntimeMode({ BRAND_RUNTIME_MODE: "", ENABLE_DB_BACKED_BRAND_ROUTES: "true" }), "repository");
});

test("missing NASHIR_CAMPAIGN_RUNTIME_MODE defaults to in_memory", () => {
  assert.equal(resolveNashirCampaignRuntimeMode({}), "in_memory");
  assert.equal(loadConfig({}).nashirCampaignRuntimeMode, "in_memory");
});

test("DATABASE_URL alone does not activate Nashir campaign repository mode", () => {
  const config = loadConfig({
    DATABASE_URL: "postgres://user:password@db.example.test:5432/marketing_os"
  });

  assert.equal(config.databaseUrl, "postgres://user:password@db.example.test:5432/marketing_os");
  assert.equal(config.nashirCampaignRuntimeMode, "in_memory");
});

test("explicit NASHIR_CAMPAIGN_RUNTIME_MODE values resolve directly", () => {
  assert.equal(resolveNashirCampaignRuntimeMode({ NASHIR_CAMPAIGN_RUNTIME_MODE: "in_memory" }), "in_memory");
  assert.equal(resolveNashirCampaignRuntimeMode({ NASHIR_CAMPAIGN_RUNTIME_MODE: "repository" }), "repository");
});

test("invalid NASHIR_CAMPAIGN_RUNTIME_MODE throws a safe configuration error", () => {
  assert.throws(
    () => resolveNashirCampaignRuntimeMode({
      NASHIR_CAMPAIGN_RUNTIME_MODE: "bad",
      DATABASE_URL: "postgres://user:password@db.example.test:5432/marketing_os",
      SECRET_TOKEN: "super-secret-token",
    }),
    (error) => {
      assert(error instanceof ConfigurationError);
      assert.equal(error.name, "ConfigurationError");
      assert.equal(error.code, "INVALID_NASHIR_CAMPAIGN_RUNTIME_MODE");
      assert.equal(error.message, "Invalid NASHIR_CAMPAIGN_RUNTIME_MODE. Allowed values: in_memory, repository.");
      assert.match(error.message, /in_memory/);
      assert.match(error.message, /repository/);
      assert.doesNotMatch(error.message, /bad/);
      assert.doesNotMatch(error.message, /DATABASE_URL|postgres|password|db\.example|user|SECRET_TOKEN|super-secret-token/i);
      return true;
    }
  );
});

test("empty NASHIR_CAMPAIGN_RUNTIME_MODE preserves default in_memory behavior", () => {
  assert.equal(resolveNashirCampaignRuntimeMode({ NASHIR_CAMPAIGN_RUNTIME_MODE: "" }), "in_memory");
  assert.equal(loadConfig({ NASHIR_CAMPAIGN_RUNTIME_MODE: "" }).nashirCampaignRuntimeMode, "in_memory");
});

test("missing NASHIR_EVIDENCE_RUNTIME_MODE defaults to in_memory", () => {
  assert.equal(resolveNashirEvidenceRuntimeMode({}), "in_memory");
  assert.equal(loadConfig({}).nashirEvidenceRuntimeMode, "in_memory");
});

test("DATABASE_URL alone does not activate Nashir evidence repository mode", () => {
  const config = loadConfig({
    DATABASE_URL: "postgres://user:password@db.example.test:5432/marketing_os"
  });

  assert.equal(config.databaseUrl, "postgres://user:password@db.example.test:5432/marketing_os");
  assert.equal(config.nashirEvidenceRuntimeMode, "in_memory");
});

test("explicit NASHIR_EVIDENCE_RUNTIME_MODE values resolve directly", () => {
  assert.equal(resolveNashirEvidenceRuntimeMode({ NASHIR_EVIDENCE_RUNTIME_MODE: "in_memory" }), "in_memory");
  assert.equal(resolveNashirEvidenceRuntimeMode({ NASHIR_EVIDENCE_RUNTIME_MODE: "repository" }), "repository");
});

test("invalid NASHIR_EVIDENCE_RUNTIME_MODE throws a safe configuration error", () => {
  assert.throws(
    () => resolveNashirEvidenceRuntimeMode({
      NASHIR_EVIDENCE_RUNTIME_MODE: "bad",
      DATABASE_URL: "postgres://user:password@db.example.test:5432/marketing_os",
      SECRET_TOKEN: "super-secret-token",
    }),
    (error) => {
      assert(error instanceof ConfigurationError);
      assert.equal(error.name, "ConfigurationError");
      assert.equal(error.code, "INVALID_NASHIR_EVIDENCE_RUNTIME_MODE");
      assert.equal(error.message, "Invalid NASHIR_EVIDENCE_RUNTIME_MODE. Allowed values: in_memory, repository.");
      assert.match(error.message, /in_memory/);
      assert.match(error.message, /repository/);
      assert.doesNotMatch(error.message, /bad/);
      assert.doesNotMatch(error.message, /DATABASE_URL|postgres|password|db\.example|user|SECRET_TOKEN|super-secret-token/i);
      return true;
    }
  );
});

test("empty NASHIR_EVIDENCE_RUNTIME_MODE preserves default in_memory behavior", () => {
  assert.equal(resolveNashirEvidenceRuntimeMode({ NASHIR_EVIDENCE_RUNTIME_MODE: "" }), "in_memory");
  assert.equal(loadConfig({ NASHIR_EVIDENCE_RUNTIME_MODE: "" }).nashirEvidenceRuntimeMode, "in_memory");
});
