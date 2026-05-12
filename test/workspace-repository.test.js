const test = require("node:test");
const assert = require("node:assert/strict");

const { WorkspaceRepository } = require("../src/repositories/workspace-repository");

test("WorkspaceRepository.getWorkspaceById passes workspace context to pool query", async () => {
  const workspaceId = "00000000-0000-4000-8000-000000000001";

  let capturedSql;
  let capturedParams;
  let capturedOptions;

  const pool = {
    query: async (sql, params, options) => {
      capturedSql = sql;
      capturedParams = params;
      capturedOptions = options;

      return {
        rows: [
          {
            workspace_id: workspaceId,
            workspace_name: "Test Workspace",
            default_locale: "en",
          },
        ],
      };
    },
  };

  const repository = new WorkspaceRepository(pool);
  const result = await repository.getWorkspaceById(workspaceId);

  assert.equal(result.workspaceId, workspaceId);
  assert.deepEqual(capturedParams, [workspaceId]);
  assert.deepEqual(capturedOptions, { workspaceId });
  assert.match(capturedSql, /WHERE workspace_id = \$1/);
});

test("WorkspaceRepository.getWorkspaceById returns null when workspace is missing", async () => {
  const workspaceId = "00000000-0000-4000-8000-000000000002";

  let capturedOptions;

  const pool = {
    query: async (_sql, _params, options) => {
      capturedOptions = options;
      return { rows: [] };
    },
  };

  const repository = new WorkspaceRepository(pool);
  const result = await repository.getWorkspaceById(workspaceId);

  assert.equal(result, null);
  assert.deepEqual(capturedOptions, { workspaceId });
});
