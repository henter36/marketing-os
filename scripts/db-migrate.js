const { existsSync } = require("fs");
const { spawnSync } = require("child_process");
const path = require("path");

const root = path.resolve(__dirname, "..");
const migrations = [
  "docs/marketing_os_v5_6_5_phase_0_1_schema.sql",
  "docs/marketing_os_v5_6_5_phase_0_1_schema_patch_001.sql"
];

const missing = migrations.filter((file) => !existsSync(path.join(root, file)));
if (missing.length > 0) {
  console.warn(`Migration files not present in this checkout: ${missing.join(", ")}`);
  console.warn("Sprint 0 migration order is still wired; full repository checkouts include these approved SQL files.");
  process.exit(0);
}

if (!process.env.DATABASE_URL) {
  console.log(`Validated migration order:\n${migrations.map((file, index) => `${index + 1}. ${file}`).join("\n")}`);
  console.log("Set DATABASE_URL to apply migrations with psql.");
  process.exit(0);
}

for (const migration of migrations) {
  const result = spawnSync("psql", [process.env.DATABASE_URL, "-v", "ON_ERROR_STOP=1", "-f", path.join(root, migration)], {
    stdio: "inherit"
  });

  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}
