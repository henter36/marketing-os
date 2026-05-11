const assert = require("assert");
const { readFileSync } = require("fs");
const { test } = require("node:test");

const { buildMigrationDriver, escapePsqlIncludePath, migrations, migrationLockKey, parseDatabaseUrl, runMigrationsWithLock } = require("../scripts/db-migrate");
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

test("invalid DATABASE_URL returns 1 safely", () => {
  const status = runMigrationsWithLock({
    root: "/repo/root",
    env: { DATABASE_URL: "not-a-valid-url" },
    spawnSyncRunner: () => { throw new Error("psql must not be called for an invalid DATABASE_URL"); },
  });

  assert.equal(status, 1);
});

test("psql argv does not expose DSN; service file contains decomposed fields; DATABASE_URL/DATABASE_URI excluded from child env", () => {
  let capturedArgs;
  let capturedOptions;
  let serviceFileContent;

  const status = runMigrationsWithLock({
    root: "/repo/root",
    env: { DATABASE_URL: "postgres://user:secret@localhost:5432/mydb", DATABASE_URI: "postgres://other/db", PGSSLMODE: "require" },
    spawnSyncRunner: (command, args, options) => {
      capturedArgs = args;
      capturedOptions = options;
      // Read service file while temp dir still exists (before finally cleanup)
      serviceFileContent = readFileSync(options.env.PGSERVICEFILE, "utf8");
      return { status: 0 };
    },
  });

  assert.equal(status, 0);
  // psql argv must not contain the DSN or password
  assert.ok(!capturedArgs.some(arg => arg.includes("postgres://")), "DSN must not appear in argv");
  assert.ok(!capturedArgs.some(arg => arg.includes("secret")), "password must not appear in argv");
  // argv is exactly ["-v", "ON_ERROR_STOP=1", "-f", driverPath]
  assert.deepStrictEqual(capturedArgs.slice(0, 3), ["-v", "ON_ERROR_STOP=1", "-f"]);
  assert.equal(capturedArgs.length, 4);
  assert.equal(typeof capturedArgs[3], "string");
  assert.ok(capturedArgs[3].length > 0, "psql must receive a generated migration driver path after -f");
  assert.ok(capturedArgs[3].endsWith(".sql"), "generated migration driver path must be a SQL file");
  // DATABASE_URL must not be in child env
  assert.equal(capturedOptions.env.DATABASE_URL, undefined);
  // DATABASE_URI must not be in child env
  assert.equal(capturedOptions.env.DATABASE_URI, undefined);
  // PGDATABASE must not carry the full DSN
  assert.notEqual(capturedOptions.env.PGDATABASE, "postgres://user:secret@localhost:5432/mydb");
  // PGSERVICE and PGSERVICEFILE must be present
  assert.equal(capturedOptions.env.PGSERVICE, "marketing_os_migration");
  assert.ok(capturedOptions.env.PGSERVICEFILE, "PGSERVICEFILE must be set in child env");
  // service file must contain decomposed connection fields — not the full URI
  assert.ok(serviceFileContent.includes("[marketing_os_migration]"), "service file must contain the service stanza");
  assert.ok(serviceFileContent.includes("host=localhost"), "service file must contain host");
  assert.ok(serviceFileContent.includes("port=5432"), "service file must contain port");
  assert.ok(serviceFileContent.includes("dbname=mydb"), "service file must contain dbname");
  assert.ok(serviceFileContent.includes("user=user"), "service file must contain user");
  assert.ok(serviceFileContent.includes("password=secret"), "service file must contain password");
  assert.ok(!serviceFileContent.includes("postgres://"), "service file must not contain the full DSN URI");
  // safe env vars are forwarded
  assert.equal(capturedOptions.env.PGSSLMODE, "require");
});

test("sslmode in DATABASE_URL is preserved in service file", () => {
  let serviceFileContent;

  const status = runMigrationsWithLock({
    root: "/repo/root",
    env: { DATABASE_URL: "postgres://user:pass@db.example.com:5432/mydb?sslmode=require" },
    spawnSyncRunner: (command, args, options) => {
      serviceFileContent = readFileSync(options.env.PGSERVICEFILE, "utf8");
      return { status: 0 };
    },
  });

  assert.equal(status, 0);
  assert.ok(serviceFileContent.includes("sslmode=require"), "service file must contain sslmode from DATABASE_URL query param");
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
