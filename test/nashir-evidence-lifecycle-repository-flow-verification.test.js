const test = require("node:test");
const assert = require("node:assert/strict");

const { AppError } = require("../src/error-model");
const { NashirEvidenceLifecycleRepository } = require("../src/repositories/nashir-evidence-lifecycle-repository");

const ids = {
  actor: "00000000-0000-4000-8000-000000000101",
  campaignA: "00000000-0000-4000-8000-00000000c001",
  campaignB: "00000000-0000-4000-8000-00000000c002",
  evidenceMissing: "00000000-0000-4000-8000-00000000eeee",
  workspaceA: "00000000-0000-4000-8000-00000000000a",
  workspaceB: "00000000-0000-4000-8000-00000000000b",
};

test("repository-only Journey Flow Verification submits, lists, reads, and traces submitted evidence", async () => {
  const pool = createJourneyFlowPool();
  const repository = new NashirEvidenceLifecycleRepository({ pool });

  const created = await repository.createSubmittedEvidence(createInput());

  assert.equal(pool.transactionCalls.length, 1);
  assert.deepEqual(pool.transactionCalls[0], { workspaceId: ids.workspaceA });

  assert.equal(pool.evidenceRows.length, 1);
  assert.equal(pool.lifecycleEventRows.length, 1);
  assert.equal(pool.transactionQueryCalls.length, 2);
  assert.match(pool.transactionQueryCalls[0].sql, /INSERT INTO\s+nashir_evidence\s*\(/);
  assert.match(pool.transactionQueryCalls[1].sql, /INSERT INTO\s+nashir_evidence_lifecycle_events\s*\(/);
  assert.deepEqual(pool.transactionQueryCalls[0].options, { workspaceId: ids.workspaceA });
  assert.deepEqual(pool.transactionQueryCalls[1].options, { workspaceId: ids.workspaceA });

  assertCanonicalEvidence(created);
  assert.equal(created.status, "submitted");
  assert.equal(created.workspaceId, ids.workspaceA);
  assert.equal(created.nashirCampaignId, ids.campaignA);

  const listed = await repository.listByCampaign({
    workspaceId: ids.workspaceA,
    nashirCampaignId: ids.campaignA,
  });

  assert.equal(listed.length, 1);
  assert.deepEqual(listed[0], created);
  assertCanonicalEvidence(listed[0]);

  const found = await repository.getById({
    workspaceId: ids.workspaceA,
    nashirCampaignId: ids.campaignA,
    evidenceId: created.id,
  });

  assert.deepEqual(found, created);
  assertCanonicalEvidence(found);

  const lifecycleEvent = pool.lifecycleEventRows[0];
  assert.equal(lifecycleEvent.evidence_id, created.id);
  assert.equal(lifecycleEvent.workspace_id, ids.workspaceA);
  assert.equal(lifecycleEvent.nashir_campaign_id, ids.campaignA);
  assert.equal(lifecycleEvent.event_type, "nashir_evidence.submitted");
  assert.equal(lifecycleEvent.prior_status, null);
  assert.equal(lifecycleEvent.next_status, "submitted");
  assert.equal(lifecycleEvent.actor_user_id, ids.actor);
  assert.equal(lifecycleEvent.occurred_at, pool.evidenceRows[0].submitted_at);
});

test("repository-only Journey Flow Verification preserves non-disclosing read behavior", async () => {
  const pool = createJourneyFlowPool();
  const repository = new NashirEvidenceLifecycleRepository({ pool });
  const created = await repository.createSubmittedEvidence(createInput());

  assert.equal(await repository.getById({
    workspaceId: ids.workspaceA,
    nashirCampaignId: ids.campaignA,
    evidenceId: ids.evidenceMissing,
  }), null);

  assert.equal(await repository.getById({
    workspaceId: ids.workspaceB,
    nashirCampaignId: ids.campaignA,
    evidenceId: created.id,
  }), null);

  assert.equal(await repository.getById({
    workspaceId: ids.workspaceA,
    nashirCampaignId: ids.campaignB,
    evidenceId: created.id,
  }), null);

  assert.deepEqual(await repository.listByCampaign({
    workspaceId: ids.workspaceB,
    nashirCampaignId: ids.campaignA,
  }), []);

  assert.deepEqual(await repository.listByCampaign({
    workspaceId: ids.workspaceA,
    nashirCampaignId: ids.campaignB,
  }), []);
});

test("repository-only Journey Flow Verification fails closed when transactions are unavailable", async () => {
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

test("repository-only Journey Flow Verification handles missing inserted evidence row safely", async () => {
  const originalConsoleError = console.error;
  console.error = () => {};

  const pool = createJourneyFlowPool({ omitEvidenceReturningRow: true });
  const repository = new NashirEvidenceLifecycleRepository({ pool });

  try {
    await assert.rejects(
      () => repository.createSubmittedEvidence(createInput()),
      (error) => {
        assert(error instanceof AppError);
        assert.equal(error.status, 500);
        assert.equal(error.code, "INTERNAL_ERROR");
        assert.equal(error.message, "Database operation failed.");
        assert.equal(String(error.message).includes("no row returned"), false);
        assert.equal(String(error.message).includes("nashir_evidence"), false);
        return true;
      }
    );

    assert.equal(pool.evidenceRows.length, 0);
    assert.equal(pool.lifecycleEventRows.length, 0);
    assert.equal(pool.transactionQueryCalls.length, 1);
    assert.match(pool.transactionQueryCalls[0].sql, /INSERT INTO\s+nashir_evidence\s*\(/);
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

function createJourneyFlowPool({ omitEvidenceReturningRow = false } = {}) {
  const state = {
    calls: [],
    evidenceRows: [],
    lifecycleEventRows: [],
    nextEvidenceId: 1,
    omitEvidenceReturningRow,
    transactionCalls: [],
    transactionQueryCalls: [],
  };

  return {
    ...state,
    query: async (sql, params, options) => runQuery(state, sql, params, options, false),
    withTransaction: async (callback, options) => {
      state.transactionCalls.push(options);
      return callback({
        query: async (sql, params, queryOptions) => runQuery(state, sql, params, queryOptions, true),
      });
    },
  };
}

function runQuery(state, sql, params, options, insideTransaction) {
  const call = { sql, params, options, insideTransaction };
  state.calls.push(call);
  if (insideTransaction) {
    state.transactionQueryCalls.push(call);
  }

  if (/INSERT INTO\s+nashir_evidence_lifecycle_events\s*\(/.test(sql)) {
    const row = {
      lifecycle_event_id: `00000000-0000-4000-8000-00000000f${String(state.lifecycleEventRows.length + 1).padStart(3, "0")}`,
      evidence_id: params[0],
      workspace_id: params[1],
      nashir_campaign_id: params[2],
      event_type: params[3],
      prior_status: null,
      next_status: params[4],
      actor_user_id: params[5],
      occurred_at: params[6],
      created_at: params[6],
    };
    state.lifecycleEventRows.push(row);
    return [];
  }

  if (/INSERT INTO\s+nashir_evidence\s*\(/.test(sql)) {
    if (state.omitEvidenceReturningRow) {
      return { rows: [] };
    }

    const submittedAt = params[5] || "2026-05-13T10:05:00.000Z";
    const row = {
      evidence_id: `00000000-0000-4000-8000-00000000e${String(state.nextEvidenceId++).padStart(3, "0")}`,
      workspace_id: params[0],
      nashir_campaign_id: params[1],
      evidence_type: params[2],
      channel: params[3],
      status: params[4],
      submitted_at: submittedAt,
      submitted_by_user_id: params[6],
      published_at: params[7],
      url: params[8],
      notes: params[9],
      external_reference: params[10],
      created_at: "2026-05-13T10:05:01.000Z",
      updated_at: "2026-05-13T10:05:01.000Z",
    };
    state.evidenceRows.push(row);
    return { rows: [row] };
  }

  if (/FROM\s+nashir_evidence/.test(sql) && /AND evidence_id = \$3/.test(sql)) {
    return {
      rows: state.evidenceRows.filter((row) => (
        row.workspace_id === params[0]
        && row.nashir_campaign_id === params[1]
        && row.evidence_id === params[2]
      )),
    };
  }

  if (/FROM\s+nashir_evidence/.test(sql)) {
    return {
      rows: state.evidenceRows.filter((row) => (
        row.workspace_id === params[0]
        && row.nashir_campaign_id === params[1]
      )),
    };
  }

  return { rows: [] };
}

function assertCanonicalEvidence(record) {
  assert.deepEqual(Object.keys(record).sort(), [
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

  assert.equal(Object.hasOwn(record, "evidence_id"), false);
  assert.equal(Object.hasOwn(record, "workspace_id"), false);
  assert.equal(Object.hasOwn(record, "nashir_campaign_id"), false);
  assert.equal(Object.hasOwn(record, "submitted_by_user_id"), false);
}
