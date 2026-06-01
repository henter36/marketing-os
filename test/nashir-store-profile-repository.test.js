"use strict";

const assert = require("assert");
const { test } = require("node:test");
const { NashirStoreProfileRepository } = require("../src/repositories/nashir-store-profile-repository");

const WORKSPACE_A = "workspace-a";
const WORKSPACE_B = "workspace-b";
const PROFILE_A_ID = "00000000-0000-4000-8000-000000000a10";
const PROFILE_B_ID = "00000000-0000-4000-8000-000000000b10";

function createPoolDouble(records = []) {
  return {
    records: records.map((record) => ({ ...record })),
    queries: [],
    async query(sql, params, options) {
      this.queries.push({ sql, params, options });

      if (sql.includes("FROM nashir_store_profiles")) {
        const workspaceId = params[0];
        const matching = this.records.filter(
          (r) => r.workspace_id === workspaceId && r.store_profile_status !== "archived"
        );
        return matching.slice(0, 1);
      }

      return [];
    }
  };
}

function seedProfiles() {
  return [
    {
      store_profile_id: PROFILE_A_ID,
      workspace_id: WORKSPACE_A,
      store_name: "Store A",
      store_url: "https://store-a.example",
      store_profile_status: "active",
      created_by_user_id: "user-owner-a",
      created_at: "2026-05-31T00:00:00.000Z",
      updated_at: "2026-05-31T00:00:00.000Z"
    },
    {
      store_profile_id: PROFILE_B_ID,
      workspace_id: WORKSPACE_B,
      store_name: "Store B",
      store_url: null,
      store_profile_status: "active",
      created_by_user_id: "user-owner-b",
      created_at: "2026-05-31T00:00:00.000Z",
      updated_at: "2026-05-31T00:00:00.000Z"
    }
  ];
}

test("constructor requires a pool", () => {
  assert.throws(
    () => new NashirStoreProfileRepository(),
    /NashirStoreProfileRepository requires a pool/
  );
});

test("findStoreProfileByWorkspace returns matching profile for workspace", async () => {
  const pool = createPoolDouble(seedProfiles());
  const repository = new NashirStoreProfileRepository({ pool });

  const profile = await repository.findStoreProfileByWorkspace({ workspaceId: WORKSPACE_A });

  assert.ok(profile, "profile must be found");
  assert.strictEqual(profile.storeProfileId, PROFILE_A_ID);
  assert.strictEqual(profile.workspaceId, WORKSPACE_A);
  assert.strictEqual(profile.storeName, "Store A");
  assert.strictEqual(profile.storeUrl, "https://store-a.example");
  assert.strictEqual(profile.storeProfileStatus, "active");
  assert.strictEqual(profile.createdByUserId, "user-owner-a");
  assert.ok(profile.createdAt);
  assert.ok(profile.updatedAt);
});

test("findStoreProfileByWorkspace returns null when workspace has no active profile", async () => {
  const pool = createPoolDouble([]);
  const repository = new NashirStoreProfileRepository({ pool });

  const profile = await repository.findStoreProfileByWorkspace({ workspaceId: WORKSPACE_A });

  assert.strictEqual(profile, null);
});

test("findStoreProfileByWorkspace does not leak cross-workspace profiles", async () => {
  const pool = createPoolDouble(seedProfiles());
  const repository = new NashirStoreProfileRepository({ pool });

  const profileForA = await repository.findStoreProfileByWorkspace({ workspaceId: WORKSPACE_A });
  const profileForB = await repository.findStoreProfileByWorkspace({ workspaceId: WORKSPACE_B });

  assert.ok(profileForA);
  assert.ok(profileForB);
  assert.strictEqual(profileForA.storeProfileId, PROFILE_A_ID);
  assert.strictEqual(profileForB.storeProfileId, PROFILE_B_ID);
  assert.notStrictEqual(profileForA.storeProfileId, profileForB.storeProfileId);
});

test("findStoreProfileByWorkspace returns null for missing workspaceId", async () => {
  const pool = createPoolDouble(seedProfiles());
  const repository = new NashirStoreProfileRepository({ pool });

  const result = await repository.findStoreProfileByWorkspace({ workspaceId: null });

  assert.strictEqual(result, null);
  assert.strictEqual(pool.queries.length, 0, "no query must be issued for missing workspaceId");
});

test("findStoreProfileByWorkspace excludes archived profiles", async () => {
  const archivedProfile = {
    store_profile_id: "00000000-0000-4000-8000-000000000a11",
    workspace_id: WORKSPACE_A,
    store_name: "Archived Store",
    store_url: null,
    store_profile_status: "archived",
    created_by_user_id: "user-owner-a",
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z"
  };
  const pool = createPoolDouble([archivedProfile]);
  const repository = new NashirStoreProfileRepository({ pool });

  const profile = await repository.findStoreProfileByWorkspace({ workspaceId: WORKSPACE_A });

  assert.strictEqual(profile, null, "archived profile must not be returned");
});

test("findStoreProfileByWorkspace passes workspaceId to pool.query options", async () => {
  const pool = createPoolDouble(seedProfiles());
  const repository = new NashirStoreProfileRepository({ pool });

  await repository.findStoreProfileByWorkspace({ workspaceId: WORKSPACE_A });

  assert.strictEqual(pool.queries.length, 1);
  assert.deepStrictEqual(pool.queries[0].params, [WORKSPACE_A]);
  assert.deepStrictEqual(pool.queries[0].options, { workspaceId: WORKSPACE_A });
});

test("findStoreProfileByWorkspace returns null storeUrl when null in DB", async () => {
  const pool = createPoolDouble(seedProfiles());
  const repository = new NashirStoreProfileRepository({ pool });

  const profile = await repository.findStoreProfileByWorkspace({ workspaceId: WORKSPACE_B });

  assert.ok(profile);
  assert.strictEqual(profile.storeUrl, null);
});

test("findStoreProfileByWorkspace maps database error to safe repository error", async () => {
  const failPool = {
    async query() {
      throw new Error("connection refused");
    }
  };
  const repository = new NashirStoreProfileRepository({ pool: failPool });

  await assert.rejects(
    () => repository.findStoreProfileByWorkspace({ workspaceId: WORKSPACE_A }),
    (err) => {
      assert.ok(err.code === "INTERNAL_ERROR" || err.status === 500, "must surface as safe repository error");
      return true;
    }
  );
});
