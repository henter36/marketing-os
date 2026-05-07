const assert = require("assert");
const { test } = require("node:test");

const { buildMigrationDriver, escapePsqlIncludePath, migrations, migrationLockKey, runMigrationsWithLock } = require("../scripts/db-migrate");

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
    spawn: () => ({ status: null, signal: "SIGTERM" }),
  });

  assert.equal(status, 1);
});

test("migration runner passes env overrides to psql", () => {
  let spawnOptions;

  const status = runMigrationsWithLock({
    root: "/repo/root",
    env: { DATABASE_URL: "postgres://example/db", PGSSLMODE: "require" },
    spawn: (command, args, options) => {
      spawnOptions = options;
      return { status: 0 };
    },
  });

  assert.equal(status, 0);
  assert.equal(spawnOptions.env.DATABASE_URL, "postgres://example/db");
  assert.equal(spawnOptions.env.PGSSLMODE, "require");
});

test("psql include path escaping normalizes backslashes and escapes single quotes", () => {
  assert.equal(escapePsqlIncludePath("C:\\repo\\O'Brien\\schema.sql"), "C:/repo/O''Brien/schema.sql");
});
