const assert = require("assert");
const { spawnSync } = require("child_process");
const path = require("path");
const { Readable } = require("stream");
const { after, before, test } = require("node:test");

const { createPool } = require("../../src/db");
const { createApp } = require("../../src/router");
const { createSeedStore } = require("../../src/store");

const repoRoot = path.resolve(__dirname, "../..");
const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);

const ids = {
  customerAccountA: "00000000-0000-4300-8300-0000000000a1",
  customerAccountB: "00000000-0000-4300-8300-0000000000b1",
  creatorA: "00000000-0000-4300-8300-000000000101",
  viewerA: "00000000-0000-4300-8300-000000000102",
  creatorB: "00000000-0000-4300-8300-000000000201",
  workspaceA: "00000000-0000-4300-8300-00000000000a",
  workspaceB: "00000000-0000-4300-8300-00000000000b",
};

let pool;
let repositoryServer;
let repositoryStore;

test("Brand runtime switch defaults to in-memory Brand routes", async () => {
  const server = createRuntimeServer({ store: createSeedStore() });

  const response = await server.request("GET", "/workspaces/workspace-a/brand-profiles", {
    userId: "user-viewer-a",
  });

  assert.equal(response.status, 200);
  assert(response.body.data.some((profile) => profile.brand_profile_id === "brand-profile-a"));
  assert(response.body.data.every((profile) => profile.workspace_id === "workspace-a"));
});

test("repository mode requires DATABASE_URL when no pool is injected", () => {
  assert.throws(
    () => createApp({ store: createSeedStore(), brandRuntimeMode: "repository", env: {} }),
    (error) => error.code === "DATABASE_URL_REQUIRED"
  );
});

before(async () => {
  if (!hasDatabaseUrl) {
    return;
  }

  runStrictMigrations();
  pool = createPool({ requireDatabaseUrl: true });
  await seedRuntimeSwitchData(pool);
  repositoryStore = createRuntimeSwitchStore();
  repositoryServer = createRuntimeServer({ store: repositoryStore, pool, brandRuntimeMode: "repository" });
});

after(async () => {
  if (pool) {
    await pool.close();
  }
});

test("repository mode lists BrandProfiles from DB without exposing SQL-only fields", { skip: !hasDatabaseUrl }, async () => {
  const response = await repositoryServer.request("GET", `/workspaces/${ids.workspaceA}/brand-profiles`, {
    userId: ids.viewerA,
  });

  assert.equal(response.status, 200);
  assert(response.body.data.some((profile) => profile.brand_name === "Runtime Switch DB Brand A"));
  assert(!response.body.data.some((profile) => profile.brand_name === "In-memory Runtime Brand A"));
  for (const profile of response.body.data) {
    assert(!Object.hasOwn(profile, "language"));
    assert(!Object.hasOwn(profile, "brand_status"));
  }
});

test("repository mode creates BrandProfiles through DB and preserves public response shape", { skip: !hasDatabaseUrl }, async () => {
  const response = await repositoryServer.request("POST", `/workspaces/${ids.workspaceA}/brand-profiles`, {
    userId: ids.creatorA,
    body: {
      brand_name: "Runtime Switch Created Brand",
      brand_description: "Created through repository mode",
    },
  });

  assert.equal(response.status, 201);
  assert.equal(response.body.data.workspace_id, ids.workspaceA);
  assert.equal(response.body.data.brand_name, "Runtime Switch Created Brand");
  assert.equal(response.body.data.brand_description, "Created through repository mode");
  assert(!Object.hasOwn(response.body.data, "language"));
  assert(!Object.hasOwn(response.body.data, "brand_status"));
  assert(!repositoryStore.brandProfiles.some((profile) => profile.brand_name === "Runtime Switch Created Brand"));

  const rows = await pool.query(
    `
      SELECT profile_name, brand_summary, language, brand_status::text AS brand_status
      FROM brand_profiles
      WHERE workspace_id = $1
        AND brand_profile_id = $2
    `,
    [ids.workspaceA, response.body.data.brand_profile_id],
    { workspaceId: ids.workspaceA }
  );

  assert.equal(rows[0].profile_name, "Runtime Switch Created Brand");
  assert.equal(rows[0].brand_summary, "Created through repository mode");
  assert.equal(rows[0].language, "en-US");
  assert.equal(rows[0].brand_status, "draft");
});

test("repository mode preserves duplicate and tenant behavior for BrandProfile", { skip: !hasDatabaseUrl }, async () => {
  const duplicate = await repositoryServer.request("POST", `/workspaces/${ids.workspaceA}/brand-profiles`, {
    userId: ids.creatorA,
    body: { brand_name: "Runtime Switch DB Brand A" },
  });
  assert.equal(duplicate.status, 409);
  assert.equal(duplicate.body.code, "DUPLICATE_BRAND_PROFILE");
  assertNoRawDatabaseDetails(duplicate.body);

  const sharedA = await repositoryServer.request("POST", `/workspaces/${ids.workspaceA}/brand-profiles`, {
    userId: ids.creatorA,
    body: { brand_name: "Runtime Switch Shared Brand" },
  });
  const sharedB = await repositoryServer.request("POST", `/workspaces/${ids.workspaceB}/brand-profiles`, {
    userId: ids.creatorB,
    body: { brand_name: "Runtime Switch Shared Brand" },
  });

  assert.equal(sharedA.status, 201);
  assert.equal(sharedB.status, 201);
  assert.notEqual(sharedA.body.data.workspace_id, sharedB.body.data.workspace_id);
});

test("repository mode lists and creates BrandVoiceRules through DB", { skip: !hasDatabaseUrl }, async () => {
  const parent = await findSeedBrandProfile(ids.workspaceA, "Runtime Switch DB Brand A");

  const list = await repositoryServer.request("GET", `/workspaces/${ids.workspaceA}/brand-profiles/${parent.brand_profile_id}/rules`, {
    userId: ids.viewerA,
  });
  assert.equal(list.status, 200);
  assert.equal(list.body.data.length, 1);
  assert.equal(list.body.data[0].rule_type, "tone");
  assert(!Object.hasOwn(list.body.data[0], "rule_status"));

  const created = await repositoryServer.request("POST", `/workspaces/${ids.workspaceA}/brand-profiles/${parent.brand_profile_id}/rules`, {
    userId: ids.creatorA,
    body: {
      rule_type: "required_phrase",
      rule_text: "Include the approved tagline.",
      severity: "blocker",
    },
  });

  assert.equal(created.status, 201);
  assert.equal(created.body.data.workspace_id, ids.workspaceA);
  assert.equal(created.body.data.brand_profile_id, parent.brand_profile_id);
  assert.equal(created.body.data.severity, "blocker");
  assert(!Object.hasOwn(created.body.data, "rule_status"));
});

test("repository mode rejects invalid BrandVoiceRule values before DB insert", { skip: !hasDatabaseUrl }, async () => {
  const parent = await findSeedBrandProfile(ids.workspaceA, "Runtime Switch DB Brand A");

  const invalidRuleType = await repositoryServer.request("POST", `/workspaces/${ids.workspaceA}/brand-profiles/${parent.brand_profile_id}/rules`, {
    userId: ids.creatorA,
    body: {
      rule_type: "unsupported_type",
      rule_text: "Do not insert this rule.",
      severity: "warning",
    },
  });
  assert.equal(invalidRuleType.status, 422);
  assert.equal(invalidRuleType.body.code, "VALIDATION_FAILED");
  assertNoRawDatabaseDetails(invalidRuleType.body);

  const invalidSeverity = await repositoryServer.request("POST", `/workspaces/${ids.workspaceA}/brand-profiles/${parent.brand_profile_id}/rules`, {
    userId: ids.creatorA,
    body: {
      rule_type: "style",
      rule_text: "Do not insert this rule.",
      severity: "critical",
    },
  });
  assert.equal(invalidSeverity.status, 422);
  assert.equal(invalidSeverity.body.code, "VALIDATION_FAILED");
  assertNoRawDatabaseDetails(invalidSeverity.body);
});

test("repository mode preserves RBAC and body workspace guards", { skip: !hasDatabaseUrl }, async () => {
  const viewerWrite = await repositoryServer.request("POST", `/workspaces/${ids.workspaceA}/brand-profiles`, {
    userId: ids.viewerA,
    body: { brand_name: "Viewer Should Not Write" },
  });
  assert.equal(viewerWrite.status, 403);
  assert.equal(viewerWrite.body.code, "PERMISSION_DENIED");

  const bodyWorkspace = await repositoryServer.request("POST", `/workspaces/${ids.workspaceA}/brand-profiles`, {
    userId: ids.creatorA,
    body: { workspace_id: ids.workspaceB, brand_name: "Body Workspace Rejected" },
  });
  assert.equal(bodyWorkspace.status, 422);
  assert.equal(bodyWorkspace.body.code, "TENANT_CONTEXT_MISMATCH");
});

test("repository mode rejects cross-workspace BrandVoiceRule parent access", { skip: !hasDatabaseUrl }, async () => {
  const parent = await findSeedBrandProfile(ids.workspaceA, "Runtime Switch DB Brand A");

  const list = await repositoryServer.request("GET", `/workspaces/${ids.workspaceB}/brand-profiles/${parent.brand_profile_id}/rules`, {
    userId: ids.creatorB,
  });
  assert.equal(list.status, 404);
  assert.equal(list.body.code, "BRAND_PROFILE_NOT_FOUND");
  assertNoRawDatabaseDetails(list.body);

  const create = await repositoryServer.request("POST", `/workspaces/${ids.workspaceB}/brand-profiles/${parent.brand_profile_id}/rules`, {
    userId: ids.creatorB,
    body: {
      rule_type: "tone",
      rule_text: "Cross workspace should fail.",
      severity: "info",
    },
  });
  assert.equal(create.status, 404);
  assert.equal(create.body.code, "BRAND_PROFILE_NOT_FOUND");
  assertNoRawDatabaseDetails(create.body);
});

function createRuntimeServer({ store, pool: serverPool, brandRuntimeMode = "in_memory" }) {
  const app = createApp({ store, pool: serverPool, brandRuntimeMode });

  async function request(method, requestPath, options = {}) {
    const req = Readable.from(options.body ? [Buffer.from(JSON.stringify(options.body))] : []);
    req.method = method;
    req.url = `/v1${requestPath}`;
    req.headers = {
      "content-type": "application/json",
      ...(options.userId ? { "x-user-id": options.userId } : {}),
      ...(options.headers || {}),
    };

    return new Promise((resolve) => {
      const res = {
        statusCode: 200,
        headers: {},
        writeHead(status, headers) {
          this.statusCode = status;
          this.headers = headers;
        },
        end(payload) {
          resolve({
            status: this.statusCode,
            body: payload ? JSON.parse(payload) : null,
          });
        },
      };

      app(req, res);
    });
  }

  return { request };
}

function createRuntimeSwitchStore() {
  const store = createSeedStore();
  store.users.push(
    { user_id: ids.creatorA, email: "runtime-switch-creator-a@example.test", full_name: "Runtime Switch Creator A" },
    { user_id: ids.viewerA, email: "runtime-switch-viewer-a@example.test", full_name: "Runtime Switch Viewer A" },
    { user_id: ids.creatorB, email: "runtime-switch-creator-b@example.test", full_name: "Runtime Switch Creator B" }
  );
  store.workspaces.push(
    { workspace_id: ids.workspaceA, customer_account_id: ids.customerAccountA, workspace_name: "Runtime Switch Workspace A" },
    { workspace_id: ids.workspaceB, customer_account_id: ids.customerAccountB, workspace_name: "Runtime Switch Workspace B" }
  );
  store.memberships.push(
    { workspace_member_id: "runtime-switch-member-a-creator", user_id: ids.creatorA, workspace_id: ids.workspaceA, role_code: "creator", member_status: "active" },
    { workspace_member_id: "runtime-switch-member-a-viewer", user_id: ids.viewerA, workspace_id: ids.workspaceA, role_code: "viewer", member_status: "active" },
    { workspace_member_id: "runtime-switch-member-b-creator", user_id: ids.creatorB, workspace_id: ids.workspaceB, role_code: "creator", member_status: "active" }
  );
  store.brandProfiles.push({
    brand_profile_id: "runtime-switch-memory-brand-a",
    workspace_id: ids.workspaceA,
    brand_name: "In-memory Runtime Brand A",
    brand_description: "This should not appear in repository mode.",
  });
  return store;
}

function runStrictMigrations() {
  const result = spawnSync(process.execPath, [path.join(repoRoot, "scripts/db-migrate.js"), "--strict"], {
    cwd: repoRoot,
    encoding: "utf8",
    env: process.env,
    maxBuffer: 10 * 1024 * 1024,
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);
}

async function seedRuntimeSwitchData(activePool) {
  await activePool.exec("DELETE FROM brand_voice_rules WHERE workspace_id IN ($1, $2)", [ids.workspaceA, ids.workspaceB]);
  await activePool.exec("DELETE FROM brand_profiles WHERE workspace_id IN ($1, $2)", [ids.workspaceA, ids.workspaceB]);
  await activePool.exec("DELETE FROM workspace_members WHERE workspace_id IN ($1, $2) OR user_id IN ($3, $4, $5)", [
    ids.workspaceA,
    ids.workspaceB,
    ids.creatorA,
    ids.viewerA,
    ids.creatorB,
  ]);
  await activePool.exec("DELETE FROM workspaces WHERE workspace_id IN ($1, $2)", [ids.workspaceA, ids.workspaceB]);
  await activePool.exec("DELETE FROM users WHERE user_id IN ($1, $2, $3)", [ids.creatorA, ids.viewerA, ids.creatorB]);
  await activePool.exec("DELETE FROM customer_accounts WHERE customer_account_id IN ($1, $2)", [ids.customerAccountA, ids.customerAccountB]);

  await activePool.exec(
    `
      INSERT INTO customer_accounts (customer_account_id, account_name, billing_email, account_status)
      VALUES
        ($1, 'Runtime Switch Account A', 'runtime-switch-account-a@example.test', 'active'),
        ($2, 'Runtime Switch Account B', 'runtime-switch-account-b@example.test', 'active')
    `,
    [ids.customerAccountA, ids.customerAccountB]
  );

  await activePool.exec(
    `
      INSERT INTO users (user_id, email, full_name, user_status)
      VALUES
        ($1, 'runtime-switch-creator-a@example.test', 'Runtime Switch Creator A', 'active'),
        ($2, 'runtime-switch-viewer-a@example.test', 'Runtime Switch Viewer A', 'active'),
        ($3, 'runtime-switch-creator-b@example.test', 'Runtime Switch Creator B', 'active')
    `,
    [ids.creatorA, ids.viewerA, ids.creatorB]
  );

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
        ($1, $3, 'Runtime Switch Workspace A', 'runtime-switch-workspace-a', 'active', 'en-US', 'UTC', $5),
        ($2, $4, 'Runtime Switch Workspace B', 'runtime-switch-workspace-b', 'active', 'ar-SA', 'UTC', $6)
    `,
    [ids.workspaceA, ids.workspaceB, ids.customerAccountA, ids.customerAccountB, ids.creatorA, ids.creatorB]
  );

  await activePool.exec(
    `
      INSERT INTO brand_profiles (workspace_id, profile_name, brand_summary, language, created_by_user_id)
      VALUES
        ($1, 'Runtime Switch DB Brand A', 'DB brand A summary', 'en-US', $3),
        ($2, 'Runtime Switch DB Brand B', 'DB brand B summary', 'ar-SA', $4)
    `,
    [ids.workspaceA, ids.workspaceB, ids.creatorA, ids.creatorB]
  );

  const parent = await findSeedBrandProfile(ids.workspaceA, "Runtime Switch DB Brand A");
  await activePool.exec(
    `
      INSERT INTO brand_voice_rules (workspace_id, brand_profile_id, rule_type, rule_text, severity)
      VALUES ($1, $2, 'tone', 'Use clear runtime switch language.', 'info')
    `,
    [ids.workspaceA, parent.brand_profile_id],
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

function assertNoRawDatabaseDetails(body) {
  assert.doesNotMatch(body.code, /23505|brand_rule_type|rule_severity|uq_|fk_|postgres|DATABASE_URL|SELECT|INSERT/i);
  assert.doesNotMatch(body.message, /23505|brand_rule_type|rule_severity|uq_|fk_|postgres|DATABASE_URL|SELECT|INSERT|workspace_id|profile_name/i);
  assert.doesNotMatch(body.user_action, /23505|brand_rule_type|rule_severity|uq_|fk_|postgres|DATABASE_URL|SELECT|INSERT|workspace_id|profile_name/i);
}
