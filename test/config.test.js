const assert = require("assert");
const { test } = require("node:test");

const { ConfigurationError, loadConfig, resolveBrandRuntimeMode } = require("../src/config");

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
