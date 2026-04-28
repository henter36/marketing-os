const { spawnSync } = require("child_process");
const path = require("path");

const root = path.resolve(__dirname, "..");
const migrationRunner = path.join(__dirname, "db-migrate.js");

function runCommand(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: root,
    env: options.env || process.env,
    stdio: options.stdio || "inherit"
  });

  if (result.error) {
    console.error(result.error.message);
    return 1;
  }

  return result.status || 0;
}

function run() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is required for migration retry verification.");
    return 1;
  }

  const psqlStatus = runCommand("psql", ["--version"], { stdio: "ignore" });
  if (psqlStatus !== 0) {
    console.error("psql is required for migration retry verification.");
    return 1;
  }

  console.log("Migration retry verification: first strict run");
  const firstStatus = runCommand(process.execPath, [migrationRunner, "--strict"]);
  if (firstStatus !== 0) {
    return firstStatus;
  }

  console.log("Migration retry verification: second strict run");
  const secondStatus = runCommand(process.execPath, [migrationRunner, "--strict"]);
  if (secondStatus !== 0) {
    return secondStatus;
  }

  console.log("Migration retry verification: passed");
  return 0;
}

if (require.main === module) {
  process.exit(run());
}

module.exports = { run };
