"use strict";

const assert = require("assert");
const { test } = require("node:test");
const fs = require("fs");
const path = require("path");

// Reads docs/nashir_openapi_patch.yaml as text only.
// No src/router.js, src/store.js, src/nashir, or runtime modules are imported.
// All assertions are text-based checks on the YAML contract document.

const ROOT = path.join(__dirname, "..");
const PATCH_PATH = path.join(ROOT, "docs", "nashir_openapi_patch.yaml");

let _patch;
function patchText() {
  if (_patch === undefined) _patch = fs.readFileSync(PATCH_PATH, "utf8");
  return _patch;
}

// ─── Existence ───────────────────────────────────────────────────────────────

test("docs/nashir_openapi_patch.yaml exists", () => {
  assert.ok(fs.existsSync(PATCH_PATH), "docs/nashir_openapi_patch.yaml must exist");
});

// ─── Required paths ──────────────────────────────────────────────────────────

const REQUIRED_PATHS = [
  "/workspaces/{workspaceId}/nashir-campaigns",
  "/workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}"
];

for (const p of REQUIRED_PATHS) {
  test(`nashir_openapi_patch.yaml declares path ${p}`, () => {
    assert.ok(
      patchText().includes(p),
      `docs/nashir_openapi_patch.yaml must declare path: ${p}`
    );
  });
}

// ─── Required operationIds ───────────────────────────────────────────────────

const REQUIRED_OPERATION_IDS = [
  "listNashirCampaigns",
  "createNashirCampaign",
  "getNashirCampaign"
];

for (const id of REQUIRED_OPERATION_IDS) {
  test(`nashir_openapi_patch.yaml declares operationId: ${id}`, () => {
    assert.ok(
      patchText().includes(id),
      `docs/nashir_openapi_patch.yaml must declare operationId: ${id}`
    );
  });
}

// ─── Required x-permission values ────────────────────────────────────────────

test("nashir_openapi_patch.yaml declares x-permission: nashir.campaign.read", () => {
  assert.ok(
    patchText().includes("x-permission: nashir.campaign.read"),
    "docs/nashir_openapi_patch.yaml must declare x-permission: nashir.campaign.read"
  );
});

test("nashir_openapi_patch.yaml declares x-permission: nashir.campaign.write", () => {
  assert.ok(
    patchText().includes("x-permission: nashir.campaign.write"),
    "docs/nashir_openapi_patch.yaml must declare x-permission: nashir.campaign.write"
  );
});

// ─── Deferred permissions must not appear as x-permission values ─────────────

const DEFERRED_PERMISSIONS = [
  "nashir.evidence.submit",
  "nashir.approval.decide",
  "nashir.evidence.read",
  "nashir.approval.read",
  "nashir.intake.create"
];

for (const code of DEFERRED_PERMISSIONS) {
  test(`nashir_openapi_patch.yaml does not declare x-permission: ${code}`, () => {
    assert.ok(
      !patchText().includes(`x-permission: ${code}`),
      `docs/nashir_openapi_patch.yaml must not expose deferred permission: ${code}`
    );
  });
}

// ─── workspace_id must not be a property in CreateNashirCampaignRequest ──────

test("CreateNashirCampaignRequest schema does not include workspace_id property", () => {
  const yaml = patchText();
  const schemaStart = yaml.indexOf("CreateNashirCampaignRequest:");
  assert.ok(schemaStart !== -1, "CreateNashirCampaignRequest schema must be defined");
  // Extract until the next sibling schema key at the same indentation level (4 spaces).
  // Sibling keys match /\n    \S/ — a newline followed by exactly 4 spaces then a non-space.
  const rest = yaml.slice(schemaStart + "CreateNashirCampaignRequest:".length);
  const siblingMatch = rest.match(/\n    \S/);
  const schemaBlock = siblingMatch
    ? rest.slice(0, siblingMatch.index)
    : rest;
  assert.ok(
    !schemaBlock.includes("workspace_id:"),
    "CreateNashirCampaignRequest must not include workspace_id as a property"
  );
});

// ─── ErrorModel / ErrorResponse must be referenced ───────────────────────────

test("nashir_openapi_patch.yaml references ErrorModel", () => {
  assert.ok(
    patchText().includes("ErrorModel"),
    "docs/nashir_openapi_patch.yaml must reference ErrorModel schema"
  );
});

test("nashir_openapi_patch.yaml references ErrorResponse", () => {
  assert.ok(
    patchText().includes("ErrorResponse"),
    "docs/nashir_openapi_patch.yaml must reference ErrorResponse"
  );
});

// ─── Required Nashir error codes documented ───────────────────────────────────

const REQUIRED_ERROR_CODES = [
  "PERMISSION_DENIED",
  "WORKSPACE_ACCESS_DENIED",
  "TENANT_CONTEXT_MISMATCH",
  "NASHIR_IDEMPOTENCY_CONFLICT",
  "NASHIR_PROCESS_BLOCKED",
  "NASHIR_INVALID_STATE_TRANSITION"
];

for (const code of REQUIRED_ERROR_CODES) {
  test(`nashir_openapi_patch.yaml documents error code: ${code}`, () => {
    assert.ok(
      patchText().includes(code),
      `docs/nashir_openapi_patch.yaml must document error code: ${code}`
    );
  });
}

// ─── Audit event for POST create ─────────────────────────────────────────────

test("nashir_openapi_patch.yaml declares nashir.campaign.created audit event", () => {
  assert.ok(
    patchText().includes("nashir.campaign.created"),
    "docs/nashir_openapi_patch.yaml must declare nashir.campaign.created audit event"
  );
});

// ─── Required schemas declared ───────────────────────────────────────────────

const REQUIRED_SCHEMAS = [
  "NashirCampaign:",
  "CreateNashirCampaignRequest:",
  "NashirCampaignResponse:",
  "NashirCampaignListResponse:"
];

for (const schema of REQUIRED_SCHEMAS) {
  test(`nashir_openapi_patch.yaml declares schema ${schema.replace(":", "")}`, () => {
    assert.ok(
      patchText().includes(schema),
      `docs/nashir_openapi_patch.yaml must declare schema: ${schema.replace(":", "")}`
    );
  });
}

// ─── NashirCampaignId parameter declared ─────────────────────────────────────

test("nashir_openapi_patch.yaml declares NashirCampaignId parameter", () => {
  assert.ok(
    patchText().includes("NashirCampaignId"),
    "docs/nashir_openapi_patch.yaml must declare NashirCampaignId parameter"
  );
});
