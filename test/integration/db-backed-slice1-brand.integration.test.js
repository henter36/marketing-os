const assert = require("assert");
const { spawnSync } = require("child_process");
const path = require("path");
const { after, before, test } = require("node:test");

const { createPool } = require("../../src/db");
const { AppError, errorBody } = require("../../src/error-model");
const { createRepositories } = require("../../src/repositories");

const repoRoot = path.resolve(__dirname, "../..");
const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);

const ids = {
  customerAccountA: "00000000-0000-4100-8100-0000000000a1",
  customerAccountB: "00000000-0000-4100-8100-0000000000b1",
  ownerA: "00000000-0000-4100-8100-000000000101",
  viewerA: "00000000-0000-4100-8100-000000000102",
  ownerB: "00000000-0000-4100-8100-000000000201",
  workspaceA: "00000000-0000-4100-8100-00000000000a",
  workspaceB: "00000000-0000-4100-8100-00000000000b",
};

let pool;
let repositories;

before(async () => {
  if (!hasDatabaseUrl) {
    return;
  }

  runStrictMigrations();
  pool = createPool({ requireDatabaseUrl: true });
  await seedSlice1BrandData(pool);
  repositories = createRepositories({ pool });
});

after(async () => {
  if (pool) {
    await pool.close();
  }
});

test("BrandProfileRepository lists profiles by workspace", { skip: !hasDatabaseUrl }, async () => {
  const workspaceAProfiles = await repositories.brandProfiles.listByWorkspace({ workspaceId: ids.workspaceA });
  const workspaceBProfiles = await repositories.brandProfiles.listByWorkspace({ workspaceId: ids.workspaceB });

  assert(workspaceAProfiles.some((profile) => profile.brand_name === "Slice 1 Seed Brand A"));
  assert(workspaceBProfiles.some((profile) => profile.brand_name === "Slice 1 Seed Brand B"));
  assert(!workspaceAProfiles.some((profile) => profile.workspace_id === ids.workspaceB));
});

test("BrandProfileRepository creates with public field mapping and internal SQL defaults", { skip: !hasDatabaseUrl }, async () => {
  const createdProfile = await createBrandProfile({
    workspaceId: ids.workspaceA,
    actorUserId: ids.ownerA,
    brandName: "Slice 1 Created Mapping Brand",
    brandDescription: "Created mapping description",
  });

  assert.equal(createdProfile.workspace_id, ids.workspaceA);
  assert.equal(createdProfile.brand_name, "Slice 1 Created Mapping Brand");
  assert.equal(createdProfile.brand_description, "Created mapping description");
  assert(!Object.hasOwn(createdProfile, "language"));
  assert(!Object.hasOwn(createdProfile, "brand_status"));

  const rows = await pool.query(
    `
      SELECT
        profile_name,
        brand_summary,
        language,
        brand_status::text AS brand_status
      FROM brand_profiles
      WHERE workspace_id = $1
        AND brand_profile_id = $2
    `,
    [ids.workspaceA, createdProfile.brand_profile_id],
    { workspaceId: ids.workspaceA }
  );

  assert.equal(rows[0].profile_name, "Slice 1 Created Mapping Brand");
  assert.equal(rows[0].brand_summary, "Created mapping description");
  assert.equal(rows[0].language, "en-US");
  assert.equal(rows[0].brand_status, "draft");
});

test("BrandProfileRepository rejects duplicate profile names within the same workspace", { skip: !hasDatabaseUrl }, async () => {
  await createBrandProfile({
    workspaceId: ids.workspaceA,
    actorUserId: ids.ownerA,
    brandName: "Slice 1 Duplicate Brand",
    brandDescription: "Original duplicate test brand",
  });

  await assert.rejects(
    () => repositories.brandProfiles.create({
      workspaceId: ids.workspaceA,
      actorUserId: ids.ownerA,
      input: {
        brand_name: "Slice 1 Duplicate Brand",
        brand_description: "Duplicate attempt",
      },
    }),
    (error) => {
      assert(error instanceof AppError);
      assert.equal(error.status, 409);
      assert.equal(error.code, "DUPLICATE_BRAND_PROFILE");
      assertNoRawDatabaseDetails(error);
      return true;
    }
  );
});

test("BrandProfileRepository maps concurrent same-workspace duplicate creates to safe duplicate errors", { skip: !hasDatabaseUrl }, async () => {
  const brandName = "Slice 1 Concurrent Duplicate Brand";
  const attempts = await Promise.allSettled([
    createBrandProfile({
      workspaceId: ids.workspaceA,
      actorUserId: ids.ownerA,
      brandName,
      brandDescription: "Concurrent duplicate first",
    }),
    createBrandProfile({
      workspaceId: ids.workspaceA,
      actorUserId: ids.ownerA,
      brandName,
      brandDescription: "Concurrent duplicate second",
    }),
  ]);

  const fulfilled = attempts.filter((attempt) => attempt.status === "fulfilled");
  const rejected = attempts.filter((attempt) => attempt.status === "rejected");

  assert.equal(fulfilled.length, 1);
  assert.equal(rejected.length, 1);
  assert.equal(fulfilled[0].value.brand_name, brandName);

  const error = rejected[0].reason;
  assert(error instanceof AppError);
  assert.equal(error.status, 409);
  assert.equal(error.code, "DUPLICATE_BRAND_PROFILE");
  assertNoRawDatabaseDetails(error);
});

test("BrandProfileRepository allows duplicate profile names across different workspaces", { skip: !hasDatabaseUrl }, async () => {
  const brandName = "Slice 1 Shared Brand";
  const profileA = await createBrandProfile({
    workspaceId: ids.workspaceA,
    actorUserId: ids.ownerA,
    brandName,
    brandDescription: "Workspace A shared",
  });
  const profileB = await createBrandProfile({
    workspaceId: ids.workspaceB,
    actorUserId: ids.ownerB,
    brandName,
    brandDescription: "Workspace B shared",
  });

  assert.equal(profileA.brand_name, brandName);
  assert.equal(profileB.brand_name, brandName);
  assert.notEqual(profileA.workspace_id, profileB.workspace_id);
});

test("BrandProfileRepository getById is workspace-scoped and does not leak cross-workspace existence", { skip: !hasDatabaseUrl }, async () => {
  const createdProfile = await createBrandProfile({
    workspaceId: ids.workspaceA,
    actorUserId: ids.ownerA,
    brandName: "Slice 1 Workspace Scoped Brand",
    brandDescription: "Workspace scoped brand",
  });

  const found = await repositories.brandProfiles.getById({
    workspaceId: ids.workspaceA,
    brandProfileId: createdProfile.brand_profile_id,
  });
  const crossWorkspace = await repositories.brandProfiles.getById({
    workspaceId: ids.workspaceB,
    brandProfileId: createdProfile.brand_profile_id,
  });

  assert.equal(found.brand_profile_id, createdProfile.brand_profile_id);
  assert.equal(crossWorkspace, null);
});

test("BrandVoiceRuleRepository lists rules by parent profile", { skip: !hasDatabaseUrl }, async () => {
  const seedProfile = await findSeedBrandProfile(ids.workspaceA, "Slice 1 Seed Brand A");
  const rules = await repositories.brandVoiceRules.listByBrandProfile({
    workspaceId: ids.workspaceA,
    brandProfileId: seedProfile.brand_profile_id,
  });

  assert.equal(rules.length, 1);
  assert.equal(rules[0].rule_type, "tone");
  assert.equal(rules[0].severity, "info");
  assert(!Object.hasOwn(rules[0], "rule_status"));
});

test("BrandVoiceRuleRepository creates after validating parent workspace", { skip: !hasDatabaseUrl }, async () => {
  const parentProfile = await createBrandProfile({
    workspaceId: ids.workspaceA,
    actorUserId: ids.ownerA,
    brandName: "Slice 1 Rule Parent Brand",
    brandDescription: "Rule parent brand",
  });

  const rule = await repositories.brandVoiceRules.create({
    workspaceId: ids.workspaceA,
    brandProfileId: parentProfile.brand_profile_id,
    input: {
      rule_type: "required_phrase",
      rule_text: "Always include the approved tagline.",
      severity: "warning",
    },
  });

  assert.equal(rule.workspace_id, ids.workspaceA);
  assert.equal(rule.brand_profile_id, parentProfile.brand_profile_id);
  assert.equal(rule.rule_type, "required_phrase");
  assert.equal(rule.rule_text, "Always include the approved tagline.");
  assert.equal(rule.severity, "warning");
  assert(!Object.hasOwn(rule, "rule_status"));

  const rows = await pool.query(
    `
      SELECT rule_status::text AS rule_status
      FROM brand_voice_rules
      WHERE workspace_id = $1
        AND brand_voice_rule_id = $2
    `,
    [ids.workspaceA, rule.brand_voice_rule_id],
    { workspaceId: ids.workspaceA }
  );

  assert.equal(rows[0].rule_status, "active");
});

test("BrandVoiceRuleRepository rejects invalid rule_type before DB insert", { skip: !hasDatabaseUrl }, async () => {
  const parentProfile = await createBrandProfile({
    workspaceId: ids.workspaceA,
    actorUserId: ids.ownerA,
    brandName: "Slice 1 Invalid Rule Type Parent Brand",
    brandDescription: "Invalid rule type parent brand",
  });

  await assert.rejects(
    () => repositories.brandVoiceRules.create({
      workspaceId: ids.workspaceA,
      brandProfileId: parentProfile.brand_profile_id,
      input: {
        rule_type: "unsupported_type",
        rule_text: "Do not insert this rule.",
        severity: "warning",
      },
    }),
    (error) => {
      assert(error instanceof AppError);
      assert.equal(error.status, 422);
      assert.equal(error.code, "VALIDATION_FAILED");
      assertNoRawDatabaseDetails(error);
      return true;
    }
  );
});

test("BrandVoiceRuleRepository accepts only approved severity values", { skip: !hasDatabaseUrl }, async () => {
  const parentProfile = await createBrandProfile({
    workspaceId: ids.workspaceA,
    actorUserId: ids.ownerA,
    brandName: "Slice 1 Severity Parent Brand",
    brandDescription: "Severity parent brand",
  });

  for (const severity of ["info", "warning", "blocker"]) {
    const rule = await repositories.brandVoiceRules.create({
      workspaceId: ids.workspaceA,
      brandProfileId: parentProfile.brand_profile_id,
      input: {
        rule_type: "style",
        rule_text: `Severity ${severity} is accepted.`,
        severity,
      },
    });
    assert.equal(rule.severity, severity);
  }

  for (const severity of ["low", "medium", "high", "critical"]) {
    await assert.rejects(
      () => repositories.brandVoiceRules.create({
        workspaceId: ids.workspaceA,
        brandProfileId: parentProfile.brand_profile_id,
        input: {
          rule_type: "style",
          rule_text: `Severity ${severity} is rejected.`,
          severity,
        },
      }),
      (error) => {
        assert(error instanceof AppError);
        assert.equal(error.status, 422);
        assert.equal(error.code, "VALIDATION_FAILED");
        assertNoRawDatabaseDetails(error);
        return true;
      }
    );
  }
});

test("BrandVoiceRuleRepository rejects cross-workspace parent access without leakage", { skip: !hasDatabaseUrl }, async () => {
  const parentProfile = await createBrandProfile({
    workspaceId: ids.workspaceA,
    actorUserId: ids.ownerA,
    brandName: "Slice 1 Cross Workspace Parent Brand",
    brandDescription: "Cross workspace parent brand",
  });

  await assert.rejects(
    () => repositories.brandVoiceRules.listByBrandProfile({
      workspaceId: ids.workspaceB,
      brandProfileId: parentProfile.brand_profile_id,
    }),
    (error) => {
      assert(error instanceof AppError);
      assert.equal(error.status, 404);
      assert.equal(error.code, "BRAND_PROFILE_NOT_FOUND");
      assertNoRawDatabaseDetails(error);
      return true;
    }
  );

  await assert.rejects(
    () => repositories.brandVoiceRules.create({
      workspaceId: ids.workspaceB,
      brandProfileId: parentProfile.brand_profile_id,
      input: {
        rule_type: "tone",
        rule_text: "Cross workspace insert must fail.",
        severity: "info",
      },
    }),
    (error) => {
      assert(error instanceof AppError);
      assert.equal(error.status, 404);
      assert.equal(error.code, "BRAND_PROFILE_NOT_FOUND");
      assertNoRawDatabaseDetails(error);
      return true;
    }
  );
});

test("RbacRepository resolves Brand read/write permissions for repository Slice 1 users", { skip: !hasDatabaseUrl }, async () => {
  assert.equal(await repositories.rbac.hasPermission({ workspaceId: ids.workspaceA, userId: ids.ownerA, permission: "brand.read" }), true);
  assert.equal(await repositories.rbac.hasPermission({ workspaceId: ids.workspaceA, userId: ids.ownerA, permission: "brand.write" }), true);
  assert.equal(await repositories.rbac.hasPermission({ workspaceId: ids.workspaceA, userId: ids.viewerA, permission: "brand.read" }), true);
  assert.equal(await repositories.rbac.hasPermission({ workspaceId: ids.workspaceA, userId: ids.viewerA, permission: "brand.write" }), false);
});

test("Brand repositories map database failures to ErrorModel without raw details", { skip: !hasDatabaseUrl }, async () => {
  const brokenPool = createPool({
    databaseUrl: "postgres://slice1:slice1@127.0.0.1:1/slice1",
    requireDatabaseUrl: true,
  });
  const brokenRepositories = createRepositories({ pool: brokenPool });

  await assert.rejects(
    () => brokenRepositories.brandProfiles.listByWorkspace({ workspaceId: ids.workspaceA }),
    (error) => {
      assert(error instanceof AppError);
      assert.equal(error.status, 500);
      assert.equal(error.code, "INTERNAL_ERROR");
      assertNoRawDatabaseDetails(error);
      return true;
    }
  );

  await brokenPool.close();
});

function runStrictMigrations() {
  const result = spawnSync(process.execPath, [path.join(repoRoot, "scripts/db-migrate.js"), "--strict"], {
    cwd: repoRoot,
    encoding: "utf8",
    env: process.env,
    maxBuffer: 10 * 1024 * 1024,
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);
}

async function createBrandProfile({ workspaceId, actorUserId, brandName, brandDescription }) {
  return repositories.brandProfiles.create({
    workspaceId,
    actorUserId,
    input: {
      brand_name: brandName,
      brand_description: brandDescription,
    },
  });
}

async function seedSlice1BrandData(activePool) {
  await activePool.exec("DELETE FROM brand_voice_rules WHERE workspace_id IN ($1, $2)", [ids.workspaceA, ids.workspaceB]);
  await activePool.exec("DELETE FROM brand_profiles WHERE workspace_id IN ($1, $2)", [ids.workspaceA, ids.workspaceB]);
  await activePool.exec(
    `
      DELETE FROM workspace_members
      WHERE workspace_id IN ($1, $2)
         OR user_id IN ($3, $4, $5)
    `,
    [ids.workspaceA, ids.workspaceB, ids.ownerA, ids.viewerA, ids.ownerB]
  );
  await activePool.exec("DELETE FROM workspaces WHERE workspace_id IN ($1, $2)", [ids.workspaceA, ids.workspaceB]);
  await activePool.exec("DELETE FROM users WHERE user_id IN ($1, $2, $3)", [ids.ownerA, ids.viewerA, ids.ownerB]);
  await activePool.exec("DELETE FROM customer_accounts WHERE customer_account_id IN ($1, $2)", [
    ids.customerAccountA,
    ids.customerAccountB,
  ]);

  await activePool.exec(
    `
      INSERT INTO customer_accounts (customer_account_id, account_name, billing_email, account_status)
      VALUES
        ($1, 'Slice 1 Brand Account A', 'slice1-brand-account-a@example.test', 'active'),
        ($2, 'Slice 1 Brand Account B', 'slice1-brand-account-b@example.test', 'active')
      ON CONFLICT (billing_email) DO UPDATE
        SET account_name = EXCLUDED.account_name,
            account_status = EXCLUDED.account_status
    `,
    [ids.customerAccountA, ids.customerAccountB]
  );

  await activePool.exec(
    `
      INSERT INTO users (user_id, email, full_name, user_status)
      VALUES
        ($1, 'slice1-brand-owner-a@example.test', 'Slice 1 Brand Owner A', 'active'),
        ($2, 'slice1-brand-viewer-a@example.test', 'Slice 1 Brand Viewer A', 'active'),
        ($3, 'slice1-brand-owner-b@example.test', 'Slice 1 Brand Owner B', 'active')
      ON CONFLICT (email) DO UPDATE
        SET full_name = EXCLUDED.full_name,
            user_status = EXCLUDED.user_status
    `,
    [ids.ownerA, ids.viewerA, ids.ownerB]
  );

  await activePool.exec(`
    INSERT INTO roles (role_code, role_name, role_scope)
    VALUES
      ('owner', 'Owner', 'workspace'),
      ('viewer', 'Viewer', 'workspace')
    ON CONFLICT (role_code) DO UPDATE
      SET role_name = EXCLUDED.role_name,
          role_scope = EXCLUDED.role_scope
  `);

  await activePool.exec(`
    INSERT INTO permissions (permission_code, permission_name, domain)
    VALUES
      ('brand.read', 'Read brand', 'brand'),
      ('brand.write', 'Write brand', 'brand')
    ON CONFLICT (permission_code) DO UPDATE
      SET permission_name = EXCLUDED.permission_name,
          domain = EXCLUDED.domain
  `);

  await activePool.exec(`
    INSERT INTO role_permissions (role_id, permission_id)
    SELECT r.role_id, p.permission_id
    FROM roles r
    JOIN permissions p ON p.permission_code IN ('brand.read', 'brand.write')
    WHERE r.role_code = 'owner'
    ON CONFLICT (role_id, permission_id) DO NOTHING
  `);

  await activePool.exec(`
    INSERT INTO role_permissions (role_id, permission_id)
    SELECT r.role_id, p.permission_id
    FROM roles r
    JOIN permissions p ON p.permission_code = 'brand.read'
    WHERE r.role_code = 'viewer'
    ON CONFLICT (role_id, permission_id) DO NOTHING
  `);

  await activePool.exec(
    `
      INSERT INTO workspaces (
        workspace_id,
        customer_account_id,
        workspace_name,
        workspace_slug,
        workspace_status,
        default_locale,
        timezone,
        created_by_user_id
      )
      VALUES
        ($1, $3, 'Slice 1 Brand Workspace A', 'slice1-brand-workspace-a', 'active', 'en-US', 'UTC', $5),
        ($2, $4, 'Slice 1 Brand Workspace B', 'slice1-brand-workspace-b', 'active', 'ar-SA', 'UTC', $6)
      ON CONFLICT (customer_account_id, workspace_slug) DO UPDATE
        SET workspace_name = EXCLUDED.workspace_name,
            workspace_status = EXCLUDED.workspace_status,
            default_locale = EXCLUDED.default_locale,
            timezone = EXCLUDED.timezone,
            created_by_user_id = EXCLUDED.created_by_user_id
    `,
    [ids.workspaceA, ids.workspaceB, ids.customerAccountA, ids.customerAccountB, ids.ownerA, ids.ownerB]
  );

  await activePool.exec(
    `
      INSERT INTO workspace_members (workspace_id, user_id, role_id, member_status, invited_by_user_id)
      SELECT $1, $2, r.role_id, 'active', $2
      FROM roles r
      WHERE r.role_code = 'owner'
      ON CONFLICT (workspace_id, user_id) DO UPDATE
        SET role_id = EXCLUDED.role_id,
            member_status = EXCLUDED.member_status,
            invited_by_user_id = EXCLUDED.invited_by_user_id
    `,
    [ids.workspaceA, ids.ownerA]
  );

  await activePool.exec(
    `
      INSERT INTO workspace_members (workspace_id, user_id, role_id, member_status, invited_by_user_id)
      SELECT $1, $2, r.role_id, 'active', $3
      FROM roles r
      WHERE r.role_code = 'viewer'
      ON CONFLICT (workspace_id, user_id) DO UPDATE
        SET role_id = EXCLUDED.role_id,
            member_status = EXCLUDED.member_status,
            invited_by_user_id = EXCLUDED.invited_by_user_id
    `,
    [ids.workspaceA, ids.viewerA, ids.ownerA]
  );

  await activePool.exec(
    `
      INSERT INTO workspace_members (workspace_id, user_id, role_id, member_status, invited_by_user_id)
      SELECT $1, $2, r.role_id, 'active', $2
      FROM roles r
      WHERE r.role_code = 'owner'
      ON CONFLICT (workspace_id, user_id) DO UPDATE
        SET role_id = EXCLUDED.role_id,
            member_status = EXCLUDED.member_status,
            invited_by_user_id = EXCLUDED.invited_by_user_id
    `,
    [ids.workspaceB, ids.ownerB]
  );

  await activePool.exec(
    `
      INSERT INTO brand_profiles (
        workspace_id,
        profile_name,
        brand_summary,
        language,
        created_by_user_id
      )
      VALUES
        ($1, 'Slice 1 Seed Brand A', 'Seed brand A summary', 'en-US', $3),
        ($2, 'Slice 1 Seed Brand B', 'Seed brand B summary', 'ar-SA', $4)
    `,
    [ids.workspaceA, ids.workspaceB, ids.ownerA, ids.ownerB]
  );

  const seedProfileA = await activePool.query(
    `
      SELECT brand_profile_id
      FROM brand_profiles
      WHERE workspace_id = $1
        AND profile_name = 'Slice 1 Seed Brand A'
      LIMIT 1
    `,
    [ids.workspaceA],
    { workspaceId: ids.workspaceA }
  );

  await activePool.exec(
    `
      INSERT INTO brand_voice_rules (
        workspace_id,
        brand_profile_id,
        rule_type,
        rule_text,
        severity
      )
      VALUES ($1, $2, 'tone', 'Use clear language.', 'info')
    `,
    [ids.workspaceA, seedProfileA[0].brand_profile_id],
    { workspaceId: ids.workspaceA }
  );
}

async function findSeedBrandProfile(workspaceId, brandName) {
  const rows = await pool.query(
    `
      SELECT brand_profile_id
      FROM brand_profiles
      WHERE workspace_id = $1
        AND profile_name = $2
      LIMIT 1
    `,
    [workspaceId, brandName],
    { workspaceId }
  );

  return rows[0];
}

function assertNoRawDatabaseDetails(error) {
  const body = errorBody(error, "slice1-correlation");
  assert.doesNotMatch(body.code, /23505|brand_rule_type|rule_severity|uq_|fk_|postgres|DATABASE_URL|SELECT|INSERT/i);
  assert.doesNotMatch(body.message, /23505|brand_rule_type|rule_severity|uq_|fk_|postgres|DATABASE_URL|SELECT|INSERT|workspace_id|profile_name/i);
  assert.doesNotMatch(body.user_action, /23505|brand_rule_type|rule_severity|uq_|fk_|postgres|DATABASE_URL|SELECT|INSERT|workspace_id|profile_name/i);
}
