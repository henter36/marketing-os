const assert = require("assert");
const { spawnSync } = require("child_process");
const path = require("path");
const { before, test } = require("node:test");

const { createPool, closePool } = require("../../src/db");
const { errorBody, AppError } = require("../../src/error-model");
const { createRepositories, WorkspaceRepository } = require("../../src/repositories");

const repoRoot = path.resolve(__dirname, "../..");
const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);

const ids = {
  customerAccountA: "00000000-0000-4000-8000-0000000000a1",
  customerAccountB: "00000000-0000-4000-8000-0000000000b1",
  ownerA: "00000000-0000-4000-8000-000000000101",
  viewerA: "00000000-0000-4000-8000-000000000102",
  ownerB: "00000000-0000-4000-8000-000000000201",
  outsider: "00000000-0000-4000-8000-000000000999",
  workspaceA: "00000000-0000-4000-8000-00000000000a",
  workspaceB: "00000000-0000-4000-8000-00000000000b",
};

let pool;
let repositories;

before(() => {
  if (!hasDatabaseUrl) {
    return;
  }

  runStrictMigrations();
  pool = createPool({ requireDatabaseUrl: true });
  seedSlice0Data(pool);
  repositories = createRepositories({ pool });
});

test("DB-backed Slice 0 requires DATABASE_URL when strict mode asks for it", () => {
  assert.throws(
    () => createPool({ env: {}, requireDatabaseUrl: true }),
    (error) => error.code === "DATABASE_URL_REQUIRED"
  );
});

test("WorkspaceRepository reads an existing workspace", { skip: !hasDatabaseUrl }, async () => {
  const workspace = await repositories.workspaces.getWorkspaceById({ workspaceId: ids.workspaceA });

  assert.equal(workspace.workspace_id, ids.workspaceA);
  assert.equal(workspace.workspace_slug, "slice0-workspace-a");
  assert.equal(await repositories.workspaces.workspaceExists({ workspaceId: ids.workspaceA }), true);
});

test("WorkspaceRepository returns not found without leaking another workspace", { skip: !hasDatabaseUrl }, async () => {
  const missingWorkspaceId = "00000000-0000-4000-8000-0000000000ff";

  assert.equal(await repositories.workspaces.getWorkspaceById({ workspaceId: missingWorkspaceId }), null);
  assert.equal(await repositories.workspaces.workspaceExists({ workspaceId: missingWorkspaceId }), false);
});

test("MembershipRepository allows active membership in the scoped workspace", { skip: !hasDatabaseUrl }, async () => {
  const membership = await repositories.memberships.getMembership({
    workspaceId: ids.workspaceA,
    userId: ids.ownerA,
  });

  assert.equal(membership.workspace_id, ids.workspaceA);
  assert.equal(membership.user_id, ids.ownerA);
  assert.equal(membership.role_code, "owner");
});

test("MembershipRepository denies missing membership", { skip: !hasDatabaseUrl }, async () => {
  const membership = await repositories.memberships.getMembership({
    workspaceId: ids.workspaceA,
    userId: ids.outsider,
  });

  assert.equal(membership, null);
});

test("MembershipRepository rejects cross-workspace membership lookup", { skip: !hasDatabaseUrl }, async () => {
  const membership = await repositories.memberships.getMembership({
    workspaceId: ids.workspaceB,
    userId: ids.ownerA,
  });

  assert.equal(membership, null);
});

test("RbacRepository allows a permission through scoped membership", { skip: !hasDatabaseUrl }, async () => {
  assert.equal(
    await repositories.rbac.hasPermission({
      workspaceId: ids.workspaceA,
      userId: ids.ownerA,
      permission: "workspace.manage",
    }),
    true
  );
});

test("RbacRepository denies a permission missing from the scoped role", { skip: !hasDatabaseUrl }, async () => {
  assert.equal(
    await repositories.rbac.hasPermission({
      workspaceId: ids.workspaceA,
      userId: ids.viewerA,
      permission: "workspace.manage",
    }),
    false
  );
});

test("RbacRepository treats missing roles as safe denial", { skip: !hasDatabaseUrl }, async () => {
  const permissions = await repositories.rbac.getRolePermissions({
    workspaceId: ids.workspaceA,
    roleName: "slice0-missing-role",
  });

  assert.deepEqual(permissions, []);
});

test("RbacRepository treats missing permissions as safe denial", { skip: !hasDatabaseUrl }, async () => {
  assert.equal(
    await repositories.rbac.hasPermission({
      workspaceId: ids.workspaceA,
      userId: ids.ownerA,
      permission: "slice0.missing.permission",
    }),
    false
  );
});

test("DB-backed repository failures map to ErrorModel without raw SQL details", { skip: !hasDatabaseUrl }, async () => {
  const brokenPool = createPool({
    databaseUrl: "postgres://slice0:slice0@127.0.0.1:1/slice0",
    requireDatabaseUrl: true,
  });
  const brokenRepository = new WorkspaceRepository({ pool: brokenPool });

  await assert.rejects(
    () => brokenRepository.getWorkspaceById({ workspaceId: ids.workspaceA }),
    (error) => {
      assert(error instanceof AppError);
      const body = errorBody(error, "slice0-correlation");

      assert.equal(body.code, "INTERNAL_ERROR");
      assert.equal(body.correlation_id, "slice0-correlation");
      assert.doesNotMatch(body.message, /select|workspace_id|postgres|DATABASE_URL|ECONNREFUSED|psql|connection/i);
      assert.doesNotMatch(body.recovery, /select|workspace_id|postgres|DATABASE_URL|ECONNREFUSED|psql|connection/i);

      return true;
    }
  );
});

test("DB-backed Slice 0 pool can be closed for test isolation", { skip: !hasDatabaseUrl }, () => {
  closePool();
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

function seedSlice0Data(activePool) {
  activePool.exec(`
    DELETE FROM workspace_members
    WHERE workspace_id IN ('${ids.workspaceA}', '${ids.workspaceB}')
       OR user_id IN ('${ids.ownerA}', '${ids.viewerA}', '${ids.ownerB}', '${ids.outsider}');

    DELETE FROM workspaces
    WHERE workspace_id IN ('${ids.workspaceA}', '${ids.workspaceB}');

    DELETE FROM users
    WHERE user_id IN ('${ids.ownerA}', '${ids.viewerA}', '${ids.ownerB}', '${ids.outsider}');

    DELETE FROM customer_accounts
    WHERE customer_account_id IN ('${ids.customerAccountA}', '${ids.customerAccountB}');

    INSERT INTO customer_accounts (customer_account_id, account_name, account_slug, account_status)
    VALUES
      ('${ids.customerAccountA}', 'Slice 0 Account A', 'slice0-account-a', 'active'),
      ('${ids.customerAccountB}', 'Slice 0 Account B', 'slice0-account-b', 'active')
    ON CONFLICT (account_slug) DO UPDATE
      SET account_name = EXCLUDED.account_name,
          account_status = EXCLUDED.account_status;

    INSERT INTO users (user_id, email, display_name, auth_subject, user_status)
    VALUES
      ('${ids.ownerA}', 'slice0-owner-a@example.test', 'Slice 0 Owner A', 'slice0-owner-a', 'active'),
      ('${ids.viewerA}', 'slice0-viewer-a@example.test', 'Slice 0 Viewer A', 'slice0-viewer-a', 'active'),
      ('${ids.ownerB}', 'slice0-owner-b@example.test', 'Slice 0 Owner B', 'slice0-owner-b', 'active'),
      ('${ids.outsider}', 'slice0-outsider@example.test', 'Slice 0 Outsider', 'slice0-outsider', 'active')
    ON CONFLICT (email) DO UPDATE
      SET display_name = EXCLUDED.display_name,
          auth_subject = EXCLUDED.auth_subject,
          user_status = EXCLUDED.user_status;

    INSERT INTO roles (role_code, role_name, role_scope)
    VALUES
      ('owner', 'Owner', 'workspace'),
      ('viewer', 'Viewer', 'workspace'),
      ('slice0_empty', 'Slice 0 Empty', 'workspace')
    ON CONFLICT (role_code) DO UPDATE
      SET role_name = EXCLUDED.role_name,
          role_scope = EXCLUDED.role_scope;

    INSERT INTO permissions (permission_code, permission_name, permission_domain)
    VALUES
      ('workspace.read', 'Read workspace', 'workspace'),
      ('workspace.manage', 'Manage workspace', 'workspace'),
      ('rbac.read', 'Read RBAC', 'rbac')
    ON CONFLICT (permission_code) DO UPDATE
      SET permission_name = EXCLUDED.permission_name,
          permission_domain = EXCLUDED.permission_domain;

    INSERT INTO role_permissions (role_id, permission_id)
    SELECT r.role_id, p.permission_id
    FROM roles r
    JOIN permissions p ON p.permission_code IN ('workspace.read', 'workspace.manage', 'rbac.read')
    WHERE r.role_code = 'owner'
    ON CONFLICT (role_id, permission_id) DO NOTHING;

    INSERT INTO role_permissions (role_id, permission_id)
    SELECT r.role_id, p.permission_id
    FROM roles r
    JOIN permissions p ON p.permission_code = 'workspace.read'
    WHERE r.role_code = 'viewer'
    ON CONFLICT (role_id, permission_id) DO NOTHING;

    DELETE FROM role_permissions
    WHERE role_id = (SELECT role_id FROM roles WHERE role_code = 'slice0_empty');

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
      ('${ids.workspaceA}', '${ids.customerAccountA}', 'Slice 0 Workspace A', 'slice0-workspace-a', 'active', 'en-US', 'UTC', '${ids.ownerA}'),
      ('${ids.workspaceB}', '${ids.customerAccountB}', 'Slice 0 Workspace B', 'slice0-workspace-b', 'active', 'en-US', 'UTC', '${ids.ownerB}')
    ON CONFLICT (customer_account_id, workspace_slug) DO UPDATE
      SET workspace_name = EXCLUDED.workspace_name,
          workspace_status = EXCLUDED.workspace_status,
          default_locale = EXCLUDED.default_locale,
          timezone = EXCLUDED.timezone,
          created_by_user_id = EXCLUDED.created_by_user_id;

    INSERT INTO workspace_members (workspace_id, user_id, role_id, member_status, invited_by_user_id)
    SELECT '${ids.workspaceA}', '${ids.ownerA}', r.role_id, 'active', '${ids.ownerA}'
    FROM roles r
    WHERE r.role_code = 'owner'
    ON CONFLICT (workspace_id, user_id) DO UPDATE
      SET role_id = EXCLUDED.role_id,
          member_status = EXCLUDED.member_status,
          invited_by_user_id = EXCLUDED.invited_by_user_id;

    INSERT INTO workspace_members (workspace_id, user_id, role_id, member_status, invited_by_user_id)
    SELECT '${ids.workspaceA}', '${ids.viewerA}', r.role_id, 'active', '${ids.ownerA}'
    FROM roles r
    WHERE r.role_code = 'viewer'
    ON CONFLICT (workspace_id, user_id) DO UPDATE
      SET role_id = EXCLUDED.role_id,
          member_status = EXCLUDED.member_status,
          invited_by_user_id = EXCLUDED.invited_by_user_id;

    INSERT INTO workspace_members (workspace_id, user_id, role_id, member_status, invited_by_user_id)
    SELECT '${ids.workspaceB}', '${ids.ownerB}', r.role_id, 'active', '${ids.ownerB}'
    FROM roles r
    WHERE r.role_code = 'owner'
    ON CONFLICT (workspace_id, user_id) DO UPDATE
      SET role_id = EXCLUDED.role_id,
          member_status = EXCLUDED.member_status,
          invited_by_user_id = EXCLUDED.invited_by_user_id;
  `);
}
