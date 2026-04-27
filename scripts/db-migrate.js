const { existsSync } = require("fs");
const { spawnSync } = require("child_process");
const path = require("path");

const root = path.resolve(__dirname, "..");
const migrations = [
  "docs/marketing_os_v5_6_5_phase_0_1_schema.sql",
  "docs/marketing_os_v5_6_5_phase_0_1_schema_patch_001.sql"
];

function validateMigrationFiles() {
  return migrations.filter((file) => !existsSync(path.join(root, file)));
}

function isStrictMode(options = {}) {
  return Boolean(options.strict || process.argv.includes("--strict") || process.env.CI === "true" || process.env.STRICT_GATES === "true");
}

function run(options = {}) {
  const strict = isStrictMode(options);
  const missing = validateMigrationFiles();
  if (missing.length > 0) {
    const message = `Migration files not present in this checkout: ${missing.join(", ")}`;
    if (strict) {
      console.error(message);
      console.error("Strict Sprint 0 migration gate requires the approved SQL files to be present.");
      return 1;
    }
    console.warn(message);
    console.warn("Local migration gate validated wiring only; full repository checkouts include these approved SQL files.");
    return 0;
  }

  if (!process.env.DATABASE_URL) {
    if (strict) {
      console.error("DATABASE_URL is required for strict Sprint 0 migration execution.");
      return 1;
    }
    console.log(`Validated migration order:\n${migrations.map((file, index) => `${index + 1}. ${file}`).join("\n")}`);
    console.log("Set DATABASE_URL to apply migrations with psql.");
    return 0;
  }

  for (const migration of migrations) {
    const result = spawnSync("psql", [process.env.DATABASE_URL, "-v", "ON_ERROR_STOP=1", "-f", path.join(root, migration)], {
      stdio: "inherit"
    });

    if (result.status !== 0) {
      return result.status || 1;
    }
  }

  return 0;
}

if (require.main === module) {
  process.exit(run());
}

module.exports = {
  isStrictMode,
  migrations,
  run,
  validateMigrationFiles
};
