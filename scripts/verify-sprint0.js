const { existsSync } = require("fs");
const path = require("path");

const requiredFiles = [
  "package.json",
  "package-lock.json",
  ".env.example",
  "src/router.js",
  "src/config.js",
  "src/guards.js",
  "src/error-model.js",
  "src/rbac.js",
  "scripts/db-migrate.js",
  "scripts/db-seed.js",
  "scripts/openapi-lint.js",
  "test/sprint0.test.js",
  "test/integration/sprint0.integration.test.js"
];

const missing = requiredFiles.filter((file) => !existsSync(path.resolve(__dirname, "..", file)));
if (missing.length > 0) {
  console.error(`Missing Sprint 0 baseline files: ${missing.join(", ")}`);
  process.exit(1);
}

console.log("Sprint 0 baseline files are present.");
