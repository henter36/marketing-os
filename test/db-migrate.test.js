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

test("migration runner passes env overrides to psql", () => {
  let capturedArgs;
  let spawnOptions;

  const status = runMigrationsWithLock({
    root: "/repo/root",
    env: { DATABASE_URL: "postgres://example/db", PGSSLMODE: "require" },
    spawnSyncRunner: (command, args, options) => {
      capturedArgs = args;
      spawnOptions = options;
      return { status: 0 };
    },
  });

  assert.equal(status, 0);
  // env forwarding still works
  assert.equal(spawnOptions.env.DATABASE_URL, "postgres://example/db");
  assert.equal(spawnOptions.env.PGSSLMODE, "require");
  // parsed PG vars are injected into env
  assert.equal(spawnOptions.env.PGHOST, "example");
  assert.equal(spawnOptions.env.PGDATABASE, "db");
  // DATABASE_URL must not appear as a positional argv argument
  assert.ok(!capturedArgs.some(arg => arg.includes("postgres://example/db")), "DATABASE_URL must not be in argv");
  // core psql options are present
  assert.ok(capturedArgs.includes("-v"));
  assert.ok(capturedArgs.includes("ON_ERROR_STOP=1"));
  assert.ok(capturedArgs.includes("-f"));
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

test("psql argv does not contain DATABASE_URL and credentials are in env", () => {
  let capturedArgs;
  let capturedOptions;

  const status = runMigrationsWithLock({
    root: "/repo/root",
    env: { DATABASE_URL: "postgres://user:secret@localhost:5432/mydb" },
    spawnSyncRunner: (command, args, options) => {
      capturedArgs = args;
      capturedOptions = options;
      return { status: 0 };
    },
  });

  assert.equal(status, 0);
  // DATABASE_URL must not appear in argv
  assert.ok(!capturedArgs.some(arg => arg.includes("secret")), "password must not appear in argv");
  assert.ok(!capturedArgs.some(arg => arg.includes("postgres://")), "DSN must not appear in argv");
  // psql core options are present
  assert.deepStrictEqual(capturedArgs.slice(0, 3), ["-v", "ON_ERROR_STOP=1", "-f"]);
  // credentials are forwarded via env
  assert.equal(capturedOptions.env.PGHOST, "localhost");
  assert.equal(capturedOptions.env.PGPORT, "5432");
  assert.equal(capturedOptions.env.PGDATABASE, "mydb");
  assert.equal(capturedOptions.env.PGUSER, "user");
  assert.equal(capturedOptions.env.PGPASSWORD, "secret");
});
