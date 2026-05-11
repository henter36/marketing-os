const assert = require("assert");
const { test } = require("node:test");

const { buildMigrationDriver, escapePsqlIncludePath, migrations, migrationLockKey, runMigrationsWithLock } = require("../scripts/db-migrate");
const { runCommand } = require("../scripts/db-migrate-retry");

test("migration driver serializes approved SQL files behind advisory lock", () => {
  const driver = buildMigrationDriver("/repo/root");

  assert.match(driver, new RegExp(`SELECT pg_advisory_lock\\(${migrationLockKey[0]}, ${migrationLockKey[1]}\\);`));
  assert.match(driver, new RegExp(`SELECT pg_advisory_unlock\\(${migrationLockKey[0]}, ${migrationLockKey[1]}\\);`));

  const lockIndex = driver.indexOf("pg_advisory_lock");
  const unlockIndex = driver.indexOf("pg_advisory_unlock");
  assert(lockIndex >= 0);
  assert(unlockIndex > lockIndex);

  let lastMigrationIndex = lockIndex;
  for (const migration of migrations) {
    const migrationIndex = driver.indexOf(migration);
    assert(migrationIndex > lastMigrationIndex);
    assert(migrationIndex < unlockIndex);
    lastMigrationIndex = migrationIndex;
  }
});

test("migration runner returns non-zero for signal-terminated psql", () => {
  const status = runMigrationsWithLock({
    root: "/repo/root",
    env: { DATABASE_URL: "postgres://example/db" },
    spawnSyncRunner: () => ({ status: null, signal: "SIGTERM" }),
  });

  assert.equal(status, 1);
});

test("missing DATABASE_URL returns 1", () => {
  const status = runMigrationsWithLock({
    root: "/repo/root",
    env: {},
    spawnSyncRunner: () => ({ status: 0 }),
  });

  assert.equal(status, 1);
});

test("psql argv does not contain DATABASE_URL, PGDATABASE equals original URL, DATABASE_URL and DATABASE_URI excluded from child env", () => {
  let capturedArgs;
  let capturedOptions;

  const status = runMigrationsWithLock({
    root: "/repo/root",
    env: { DATABASE_URL: "postgres://user:secret@localhost:5432/mydb", DATABASE_URI: "postgres://other/db", PGSSLMODE: "require" },
    spawnSyncRunner: (command, args, options) => {
      capturedArgs = args;
      capturedOptions = options;
      return { status: 0 };
    },
  });

  assert.equal(status, 0);
  // DATABASE_URL must not appear in psql argv
  assert.ok(!capturedArgs.some(arg => arg.includes("postgres://")), "DSN must not appear in argv");
  assert.ok(!capturedArgs.some(arg => arg.includes("secret")), "password must not appear in argv");
  // core psql args are present
  assert.deepStrictEqual(capturedArgs.slice(0, 3), ["-v", "ON_ERROR_STOP=1", "-f"]);
  assert.equal(capturedArgs.length, 4);
  assert.equal(capturedArgs[2], "-f");
  assert.equal(typeof capturedArgs[3], "string");
  assert.ok(capturedArgs[3].length > 0, "psql must receive a generated migration driver path after -f");
  assert.ok(capturedArgs[3].endsWith(".sql"), "generated migration driver path must be a SQL file");
  // PGDATABASE must equal the original DATABASE_URL (libpq accepts full connection strings)
  assert.equal(capturedOptions.env.PGDATABASE, "postgres://user:secret@localhost:5432/mydb");
  // DATABASE_URL must not be in child env
  assert.equal(capturedOptions.env.DATABASE_URL, undefined);
  // DATABASE_URI must not be in child env
  assert.equal(capturedOptions.env.DATABASE_URI, undefined);
  // safe env vars are forwarded
  assert.equal(capturedOptions.env.PGSSLMODE, "require");
});

test("psql include path escaping normalizes backslashes and escapes single quotes", () => {
  assert.equal(escapePsqlIncludePath("C:\\repo\\O'Brien\\schema.sql"), "C:/repo/O''Brien/schema.sql");
});

test("db-migrate-retry runCommand returns non-zero when spawnSync status is null", () => {
  const exitCode = runCommand("irrelevant", [], {
    _spawnSync: () => ({ status: null, signal: "SIGTERM" }),
    stdio: "ignore",
  });

  assert.notEqual(exitCode, 0);
});
