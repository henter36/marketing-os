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
  customerAccountA: "00000000-0000-4200-8200-0000000000a1",
  customerAccountB: "00000000-0000-4200-8200-0000000000b1",
  ownerA: "00000000-0000-4200-8200-000000000101",
  ownerB: "00000000-0000-4200-8200-000000000201",
  workspaceA: "00000000-0000-4200-8200-00000000000a",
  workspaceB: "00000000-0000-4200-8200-00000000000b",
};

let pool;
let repositories;

before(async () => {
  if (!hasDatabaseUrl) return;
  runStrictMigrations();
  pool = createPool({ requireDatabaseUrl: true });
  await seedSlice2TemplateData(pool);
  repositories = createRepositories({ pool });
});

after(async () => {
  if (pool) await pool.close();
});

test("PromptTemplateRepository lists prompt templates by workspace", { skip: !hasDatabaseUrl }, async () => {
  const workspaceA = await repositories.promptTemplates.listByWorkspace({ workspaceId: ids.workspaceA });
  const workspaceB = await repositories.promptTemplates.listByWorkspace({ workspaceId: ids.workspaceB });

  assert(workspaceA.some((template) => template.template_name === "Slice 2 Prompt A"));
  assert(workspaceB.some((template) => template.template_name === "Slice 2 Prompt B"));
  assert(!workspaceA.some((template) => template.workspace_id === ids.workspaceB));
  assert(!workspaceA.some((template) => Object.hasOwn(template, "variables")));
});

test("PromptTemplateRepository creates with canonical field mapping and DB defaults", { skip: !hasDatabaseUrl }, async () => {
  const created = await repositories.promptTemplates.create({
    workspaceId: ids.workspaceA,
    actorUserId: ids.ownerA,
    input: {
      template_name: "Slice 2 Created Prompt",
      template_type: "caption",
      template_body: "Write about {{product}}.",
      template_variables: ["product"],
      version_number: 1,
    },
  });

  assert.equal(created.workspace_id, ids.workspaceA);
  assert.equal(created.template_name, "Slice 2 Created Prompt");
  assert.equal(created.template_type, "caption");
  assert.deepEqual(created.template_variables, ["product"]);
  assert.equal(created.template_status, "draft");
  assert.equal(created.version_number, 1);
  assert(!Object.hasOwn(created, "variables"));

  const rows = await pool.query(
    `
      SELECT created_by_user_id, template_status::text AS template_status
      FROM prompt_templates
      WHERE workspace_id = $1
        AND prompt_template_id = $2
      LIMIT 1
    `,
    [ids.workspaceA, created.prompt_template_id],
    { workspaceId: ids.workspaceA }
  );

  assert.equal(rows[0].created_by_user_id, ids.ownerA);
  assert.equal(rows[0].template_status, "draft");
});

test("PromptTemplateRepository getById is workspace-scoped", { skip: !hasDatabaseUrl }, async () => {
  const created = await repositories.promptTemplates.create({
    workspaceId: ids.workspaceA,
    actorUserId: ids.ownerA,
    input: {
      template_name: "Slice 2 Scoped Prompt",
      template_type: "reply",
      template_body: "Reply to {{question}}.",
      template_variables: ["question"],
      version_number: 1,
    },
  });

  const found = await repositories.promptTemplates.getById({
    workspaceId: ids.workspaceA,
    promptTemplateId: created.prompt_template_id,
  });
  const crossWorkspace = await repositories.promptTemplates.getById({
    workspaceId: ids.workspaceB,
    promptTemplateId: created.prompt_template_id,
  });

  assert.equal(found.prompt_template_id, created.prompt_template_id);
  assert.equal(crossWorkspace, null);
});

test("PromptTemplateRepository rejects duplicate versions and invalid template types", { skip: !hasDatabaseUrl }, async () => {
  await repositories.promptTemplates.create({
    workspaceId: ids.workspaceA,
    actorUserId: ids.ownerA,
    input: {
      template_name: "Slice 2 Duplicate Prompt",
      template_type: "caption",
      template_body: "First body.",
      template_variables: [],
      version_number: 1,
    },
  });

  await assert.rejects(
    () => repositories.promptTemplates.create({
      workspaceId: ids.workspaceA,
      actorUserId: ids.ownerA,
      input: {
        template_name: "Slice 2 Duplicate Prompt",
        template_type: "caption",
        template_body: "Duplicate body.",
        template_variables: [],
        version_number: 1,
      },
    }),
    (error) => {
      assert(error instanceof AppError);
      assert.equal(error.status, 409);
      assert.equal(error.code, "DUPLICATE_TEMPLATE_VERSION");
      assertNoRawDatabaseDetails(error);
      return true;
    }
  );

  await assert.rejects(
    () => repositories.promptTemplates.create({
      workspaceId: ids.workspaceA,
      actorUserId: ids.ownerA,
      input: {
        template_name: "Slice 2 Invalid Prompt",
        template_type: "unsupported",
        template_body: "Invalid body.",
        template_variables: [],
        version_number: 1,
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

test("ReportTemplateRepository lists and creates report templates by workspace", { skip: !hasDatabaseUrl }, async () => {
  const listed = await repositories.reportTemplates.listByWorkspace({ workspaceId: ids.workspaceA });
  assert(listed.some((template) => template.template_name === "Slice 2 Report A"));
  assert(!listed.some((template) => template.workspace_id === ids.workspaceB));
  assert(!listed.some((template) => Object.hasOwn(template, "report_type")));

  const created = await repositories.reportTemplates.create({
    workspaceId: ids.workspaceA,
    actorUserId: ids.ownerA,
    input: {
      template_name: "Slice 2 Created Report",
      template_body: { sections: ["summary", "evidence"] },
    },
  });

  assert.equal(created.workspace_id, ids.workspaceA);
  assert.equal(created.template_name, "Slice 2 Created Report");
  assert.deepEqual(created.template_body, { sections: ["summary", "evidence"] });
  assert.equal(created.template_status, "draft");
  assert(!Object.hasOwn(created, "report_type"));
});

test("ReportTemplateRepository getById is workspace-scoped and duplicate-safe", { skip: !hasDatabaseUrl }, async () => {
  const created = await repositories.reportTemplates.create({
    workspaceId: ids.workspaceA,
    actorUserId: ids.ownerA,
    input: {
      template_name: "Slice 2 Scoped Report",
      template_body: { sections: ["summary"] },
    },
  });

  const found = await repositories.reportTemplates.getById({
    workspaceId: ids.workspaceA,
    reportTemplateId: created.report_template_id,
  });
  const crossWorkspace = await repositories.reportTemplates.getById({
    workspaceId: ids.workspaceB,
    reportTemplateId: created.report_template_id,
  });

  assert.equal(found.report_template_id, created.report_template_id);
  assert.equal(crossWorkspace, null);

  await assert.rejects(
    () => repositories.reportTemplates.create({
      workspaceId: ids.workspaceA,
      actorUserId: ids.ownerA,
      input: {
        template_name: "Slice 2 Scoped Report",
        template_body: { sections: ["duplicate"] },
      },
    }),
    (error) => {
      assert(error instanceof AppError);
      assert.equal(error.status, 409);
      assert.equal(error.code, "DUPLICATE_REPORT_TEMPLATE");
      assertNoRawDatabaseDetails(error);
      return true;
    }
  );
});

test("ReportTemplateRepository does not persist or expose report_type as canonical field", { skip: !hasDatabaseUrl }, async () => {
  const created = await repositories.reportTemplates.create({
    workspaceId: ids.workspaceA,
    actorUserId: ids.ownerA,
    input: {
      template_name: "Slice 2 No Report Type",
      template_body: { sections: ["summary"] },
      report_type: "monthly",
    },
  });

  assert(!Object.hasOwn(created, "report_type"));

  const rows = await pool.query(
    `
      SELECT *
      FROM report_templates
      WHERE workspace_id = $1
        AND report_template_id = $2
      LIMIT 1
    `,
    [ids.workspaceA, created.report_template_id],
    { workspaceId: ids.workspaceA }
  );

  assert(!Object.hasOwn(rows[0], "report_type"));
});

test("Template repositories map database failures to ErrorModel without raw details", { skip: !hasDatabaseUrl }, async () => {
  const brokenPool = createPool({
    databaseUrl: "postgres://slice2:slice2@127.0.0.1:1/slice2",
    requireDatabaseUrl: true,
  });
  const brokenRepositories = createRepositories({ pool: brokenPool });

  await assert.rejects(
    () => brokenRepositories.promptTemplates.listByWorkspace({ workspaceId: ids.workspaceA }),
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

async function seedSlice2TemplateData(activePool) {
  await activePool.exec("DELETE FROM prompt_templates WHERE workspace_id IN ($1, $2)", [ids.workspaceA, ids.workspaceB]);
  await activePool.exec("DELETE FROM report_templates WHERE workspace_id IN ($1, $2)", [ids.workspaceA, ids.workspaceB]);
  await activePool.exec("DELETE FROM workspace_members WHERE workspace_id IN ($1, $2) OR user_id IN ($3, $4)", [
    ids.workspaceA,
    ids.workspaceB,
    ids.ownerA,
    ids.ownerB,
  ]);
  await activePool.exec("DELETE FROM workspaces WHERE workspace_id IN ($1, $2)", [ids.workspaceA, ids.workspaceB]);
  await activePool.exec("DELETE FROM users WHERE user_id IN ($1, $2)", [ids.ownerA, ids.ownerB]);
  await activePool.exec("DELETE FROM customer_accounts WHERE customer_account_id IN ($1, $2)", [
    ids.customerAccountA,
    ids.customerAccountB,
  ]);

  await activePool.exec(
    `
      INSERT INTO customer_accounts (customer_account_id, account_name, billing_email, account_status)
      VALUES
        ($1, 'Slice 2 Template Account A', 'slice2-template-account-a@example.test', 'active'),
        ($2, 'Slice 2 Template Account B', 'slice2-template-account-b@example.test', 'active')
    `,
    [ids.customerAccountA, ids.customerAccountB]
  );

  await activePool.exec(
    `
      INSERT INTO users (user_id, email, full_name, user_status)
      VALUES
        ($1, 'slice2-template-owner-a@example.test', 'Slice 2 Template Owner A', 'active'),
        ($2, 'slice2-template-owner-b@example.test', 'Slice 2 Template Owner B', 'active')
    `,
    [ids.ownerA, ids.ownerB]
  );

  await activePool.exec(`
    INSERT INTO roles (role_code, role_name, role_scope)
    VALUES ('owner', 'Owner', 'workspace')
    ON CONFLICT (role_code) DO UPDATE
      SET role_name = EXCLUDED.role_name,
          role_scope = EXCLUDED.role_scope
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
        ($1, $3, 'Slice 2 Template Workspace A', 'slice2-template-workspace-a', 'active', 'en-US', 'UTC', $5),
        ($2, $4, 'Slice 2 Template Workspace B', 'slice2-template-workspace-b', 'active', 'en-US', 'UTC', $6)
    `,
    [ids.workspaceA, ids.workspaceB, ids.customerAccountA, ids.customerAccountB, ids.ownerA, ids.ownerB]
  );

  await activePool.exec(
    `
      INSERT INTO workspace_members (workspace_id, user_id, role_id, member_status, invited_by_user_id)
      SELECT $1, $2, role_id, 'active', $2
      FROM roles
      WHERE role_code = 'owner'
    `,
    [ids.workspaceA, ids.ownerA]
  );
  await activePool.exec(
    `
      INSERT INTO workspace_members (workspace_id, user_id, role_id, member_status, invited_by_user_id)
      SELECT $1, $2, role_id, 'active', $2
      FROM roles
      WHERE role_code = 'owner'
    `,
    [ids.workspaceB, ids.ownerB]
  );

  await activePool.exec(
    `
      INSERT INTO prompt_templates (
        workspace_id,
        template_name,
        template_type,
        template_body,
        template_variables,
        version_number,
        created_by_user_id
      )
      VALUES
        ($1, 'Slice 2 Prompt A', 'caption', 'Write about {{product}}.', '["product"]'::jsonb, 1, $3),
        ($2, 'Slice 2 Prompt B', 'caption', 'Write about workspace B.', '[]'::jsonb, 1, $4)
    `,
    [ids.workspaceA, ids.workspaceB, ids.ownerA, ids.ownerB]
  );

  await activePool.exec(
    `
      INSERT INTO report_templates (
        workspace_id,
        template_name,
        template_body,
        created_by_user_id
      )
      VALUES
        ($1, 'Slice 2 Report A', '{"sections":["summary"]}'::jsonb, $3),
        ($2, 'Slice 2 Report B', '{"sections":["summary"]}'::jsonb, $4)
    `,
    [ids.workspaceA, ids.workspaceB, ids.ownerA, ids.ownerB]
  );
}

function assertNoRawDatabaseDetails(error) {
  const body = errorBody(error, "slice2-correlation");
  assert.doesNotMatch(body.code, /23505|template_type|template_status|report_template_status|uq_|fk_|postgres|DATABASE_URL|SELECT|INSERT/i);
  assert.doesNotMatch(body.message, /23505|template_type|template_status|report_template_status|uq_|fk_|postgres|DATABASE_URL|SELECT|INSERT|workspace_id|template_name/i);
  assert.doesNotMatch(body.user_action, /23505|template_type|template_status|report_template_status|uq_|fk_|postgres|DATABASE_URL|SELECT|INSERT|workspace_id|template_name/i);
}
