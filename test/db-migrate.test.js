const assert = require("assert");
const { test } = require("node:test");

const { buildMigrationDriver, migrations, migrationLockKey } = require("../scripts/db-migrate");

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
