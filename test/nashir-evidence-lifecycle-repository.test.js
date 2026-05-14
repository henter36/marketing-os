const test = require("node:test");
const assert = require("node:assert/strict");

const { AppError } = require("../src/error-model");
const { NashirEvidenceLifecycleRepository } = require("../src/repositories/nashir-evidence-lifecycle-repository");

const ids = {
  actor: "00000000-0000-4000-8000-000000000101",
  campaignA: "00000000-0000-4000-8000-00000000c001",
  campaignB: "00000000-0000-4000-8000-00000000c002",
  evidenceA: "00000000-0000-4000-8000-00000000e001",
  evidenceMissing: "00000000-0000-4000-8000-00000000eeee",
  workspaceA: "00000000-0000-4000-8000-00000000000a",
  workspaceB: "00000000-0000-4000-8000-00000000000b",
};

test("constructor requires a pool", () => {
  assert.throws(
    () => new NashirEvidenceLifecycleRepository(),
    /NashirEvidenceLifecycleRepository requires a pool/
  );
});

test("listByCampaign queries by workspaceId and nashirCampaignId", async () => {
  const pool = createFakePool();
  const repository = new NashirEvidenceLifecycleRepository({ pool });

  const listed = await repository.listByCampaign({
    workspaceId: ids.workspaceA,
    nashirCampaignId: ids.campaignA,
  });

  assert.equal(listed.length, 1);
  assert.equal(listed[0].id, ids.evidenceA);

  const query = pool.calls[0];
  assert.match(query.sql, /FROM nashir_evidence/);
  assert.match(query.sql, /WHERE workspace_id = \$1\s+AND nashir_campaign_id = \$2/);
  assert.deepEqual(query.params, [ids.workspaceA, ids.campaignA]);
  assert.deepEqual(query.options, { workspaceId: ids.workspaceA });
});

test("listByCampaign treats null query results as an empty list", async () => {
  const repository = new NashirEvidenceLifecycleRepository({
    pool: {
      query: async () => null,
    },
  });

  const listed = await repository.listByCampaign({
    workspaceId: ids.workspaceA,
    nashirCampaignId: ids.campaignA,
  });

  assert.deepEqual(listed, []);
});

test("listByCampaign treats missing rows as an empty list", async () => {
  const repository = new NashirEvidenceLifecycleRepository({
    pool: {
      query: async () => ({}),
    },
  });

  const listed = await repository.listByCampaign({
    workspaceId: ids.workspaceA,
    nashirCampaignId: ids.campaignA,
  });

  assert.deepEqual(listed, []);
});

test("getById returns an evidence record when workspaceId, campaignId, and evidenceId all match", async () => {
  const repository = new NashirEvidenceLifecycleRepository({ pool: createFakePool() });

  const found = await repository.getById({
    workspaceId: ids.workspaceA,
    nashirCampaignId: ids.campaignA,
    evidenceId: ids.evidenceA,
  });

  assert.equal(found.id, ids.evidenceA);
  assert.equal(found.workspaceId, ids.workspaceA);
  assert.equal(found.nashirCampaignId, ids.campaignA);
  assert.equal(found.status, "submitted");
});

test("getById returns null for a non-existent evidenceId", async () => {
  const repository = new NashirEvidenceLifecycleRepository({ pool: createFakePool() });

  const found = await repository.getById({
    workspaceId: ids.workspaceA,
    nashirCampaignId: ids.campaignA,
    evidenceId: ids.evidenceMissing,
  });

  assert.equal(found, null);
});

test("getById returns null for cross-workspace evidence", async () => {
  const repository = new NashirEvidenceLifecycleRepository({ pool: createFakePool() });

  const found = await repository.getById({
    workspaceId: ids.workspaceB,
    nashirCampaignId: ids.campaignA,
    evidenceId: ids.evidenceA,
  });

  assert.equal(found, null);
});

test("getById returns null for cross-campaign evidence", async () => {
  const repository = new NashirEvidenceLifecycleRepository({ pool: createFakePool() });

  const found = await repository.getById({
    workspaceId: ids.workspaceA,
    nashirCampaignId: ids.campaignB,
    evidenceId: ids.evidenceA,
  });

  assert.equal(found, null);
});

test("createSubmittedEvidence inserts into nashir_evidence and nashir_evidence_lifecycle_events", async () => {
  const pool = createFakePool();
  const repository = new NashirEvidenceLifecycleRepository({ pool });

  await repository.createSubmittedEvidence(createInput());

  assert.equal(pool.transactionCalls.length, 1);
  assert.equal(pool.calls.length, 2);
  assert.match(pool.calls[0].sql, /INSERT INTO nashir_evidence/);
  assert.match(pool.calls[1].sql, /INSERT INTO nashir_evidence_lifecycle_events/);
});

test("createSubmittedEvidence uses submitted status", async () => {
  const pool = createFakePool();
  const repository = new NashirEvidenceLifecycleRepository({ pool });

  const created = await repository.createSubmittedEvidence(createInput());

  assert.equal(created.status, "submitted");
  assert.equal(pool.calls[0].params[4], "submitted");
  assert.equal(pool.calls[1].params[3], "nashir_evidence.submitted");
  assert.equal(pool.calls[1].params[4], "submitted");
});

test("createSubmittedEvidence returns canonical camelCase output", async () => {
  const repository = new NashirEvidenceLifecycleRepository({ pool: createFakePool() });

  const created = await repository.createSubmittedEvidence(createInput());

  assert.deepEqual(Object.keys(created).sort(), [
    "channel",
    "createdAt",
    "evidenceType",
    "externalReference",
    "id",
    "nashirCampaignId",
    "notes",
    "publishedAt",
    "status",
    "submittedAt",
    "submittedByUserId",
    "updatedAt",
    "url",
    "workspaceId",
  ].sort());
});

test("returned records do not expose snake_case internal fields", async () => {
  const repository = new NashirEvidenceLifecycleRepository({ pool: createFakePool() });

  const listed = await repository.listByCampaign({
    workspaceId: ids.workspaceA,
    nashirCampaignId: ids.campaignA,
  });
  const created = await repository.createSubmittedEvidence(createInput());

  for (const record of [listed[0], created]) {
    assert.equal(Object.hasOwn(record, "evidence_id"), false);
    assert.equal(Object.hasOwn(record, "workspace_id"), false);
    assert.equal(Object.hasOwn(record, "nashir_campaign_id"), false);
    assert.equal(Object.hasOwn(record, "submitted_by_user_id"), false);
  }
});

test("createSubmittedEvidence fails closed without transactional writes and performs no inserts", async () => {
  const originalConsoleError = console.error;
  console.error = () => {};

  const calls = [];
  const repository = new NashirEvidenceLifecycleRepository({
    pool: {
      query: async (sql, params, options) => {
        calls.push({ sql, params, options });
        return [];
      },
    },
  });

  try {
    await assert.rejects(
      () => repository.createSubmittedEvidence(createInput()),
      (error) => {
        assert(error instanceof AppError);
        assert.equal(error.status, 500);
        assert.equal(error.code, "INTERNAL_ERROR");
        assert.equal(error.message, "Database operation failed.");
        assert.equal(String(error.message).includes("transactional writes"), false);
        return true;
      }
    );
    assert.equal(calls.length, 0);
  } finally {
    console.error = originalConsoleError;
  }
});

test("createSubmittedEvidence converts missing inserted row to a safe repository error", async () => {
  const originalConsoleError = console.error;
  console.error = () => {};

  const calls = [];
  const repository = new NashirEvidenceLifecycleRepository({
    pool: {
      withTransaction: async (callback) => callback({
        query: async (sql, params) => {
          calls.push({ sql, params });
          return [];
        },
      }),
    },
  });

  try {
    await assert.rejects(
      () => repository.createSubmittedEvidence(createInput()),
      (error) => {
        assert(error instanceof AppError);
        assert.equal(error.status, 500);
        assert.equal(error.code, "INTERNAL_ERROR");
        assert.equal(error.message, "Database operation failed.");
        assert.equal(String(error.message).includes("no row returned"), false);
        return true;
      }
    );
    assert.equal(calls.length, 1);
    assert.match(calls[0].sql, /INSERT INTO nashir_evidence/);
  } finally {
    console.error = originalConsoleError;
  }
});

test("database errors are converted to safe repository errors", async () => {
  const originalConsoleError = console.error;
  console.error = () => {};

  const repository = new NashirEvidenceLifecycleRepository({
    pool: {
      query: async () => {
        throw new Error("duplicate key value violates constraint secret_constraint");
      },
    },
  });

  try {
    await assert.rejects(
      () => repository.listByCampaign({ workspaceId: ids.workspaceA, nashirCampaignId: ids.campaignA }),
      (error) => {
        assert(error instanceof AppError);
        assert.equal(error.status, 500);
        assert.equal(error.code, "INTERNAL_ERROR");
        assert.equal(error.message, "Database operation failed.");
        assert.equal(String(error.message).includes("secret_constraint"), false);
        return true;
      }
    );
  } finally {
    console.error = originalConsoleError;
  }
});

function createInput(overrides = {}) {
  return {
    workspaceId: ids.workspaceA,
    nashirCampaignId: ids.campaignA,
    evidenceType: "manual_publish_proof",
    channel: "linkedin",
    submittedByUserId: ids.actor,
    publishedAt: "2026-05-13T10:00:00.000Z",
    url: "https://example.test/post",
    notes: "Published manually.",
    externalReference: "post-123",
    submittedAt: "2026-05-13T10:05:00.000Z",
    ...overrides,
  };
}

function createFakePool() {
  const calls = [];
  const transactionCalls = [];
  const insertedEvidenceId = "00000000-0000-4000-8000-00000000e100";

  const seedRows = [
    {
      evidence_id: ids.evidenceA,
      workspace_id: ids.workspaceA,
      nashir_campaign_id: ids.campaignA,
      evidence_type: "manual_publish_proof",
      channel: "linkedin",
      status: "submitted",
      submitted_by_user_id: ids.actor,
      submitted_at: "2026-05-13T10:05:00.000Z",
      published_at: "2026-05-13T10:00:00.000Z",
      url: "https://example.test/post",
      notes: "Published manually.",
      external_reference: "post-123",
      created_at: "2026-05-13T10:05:00.000Z",
      updated_at: "2026-05-13T10:05:00.000Z",
    },
  ];

  const pool = {
    calls,
    transactionCalls,
    query: async (sql, params, options) => runQuery({ calls, seedRows, insertedEvidenceId }, sql, params, options),
    withTransaction: async (callback, options) => {
      transactionCalls.push(options);
      return callback({
        query: async (sql, params) => runQuery({ calls, seedRows, insertedEvidenceId }, sql, params, undefined),
      });
    },
  };

  return pool;
}

function runQuery({ calls, seedRows, insertedEvidenceId }, sql, params, options) {
  calls.push({ sql, params, options });

  if (/INSERT INTO nashir_evidence_lifecycle_events/.test(sql)) {
    return [];
  }

  if (/INSERT INTO nashir_evidence/.test(sql)) {
    return [{
      evidence_id: insertedEvidenceId,
      workspace_id: params[0],
      nashir_campaign_id: params[1],
      evidence_type: params[2],
      channel: params[3],
      status: params[4],
      submitted_by_user_id: params[6],
      submitted_at: params[5] || "2026-05-13T10:05:00.000Z",
      published_at: params[7],
      url: params[8],
      notes: params[9],
      external_reference: params[10],
      created_at: "2026-05-13T10:05:01.000Z",
      updated_at: "2026-05-13T10:05:01.000Z",
    }];
  }

  if (/FROM nashir_evidence/.test(sql) && /AND evidence_id = \$3/.test(sql)) {
    return seedRows.filter((row) => (
      row.workspace_id === params[0]
      && row.nashir_campaign_id === params[1]
      && row.evidence_id === params[2]
    ));
  }

  if (/FROM nashir_evidence/.test(sql)) {
    return seedRows.filter((row) => (
      row.workspace_id === params[0]
      && row.nashir_campaign_id === params[1]
    ));
  }

  return [];
}
