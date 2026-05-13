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
  "/workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}",
  "/workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/readiness",
  "/workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/evidence"
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
  "getNashirCampaign",
  "getNashirCampaignReadiness",
  "listNashirCampaignEvidence",
  "submitNashirCampaignEvidence"
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

test("nashir_openapi_patch.yaml declares nashir_campaign.created audit event", () => {
  assert.ok(
    patchText().includes("nashir_campaign.created"),
    "docs/nashir_openapi_patch.yaml must declare nashir_campaign.created audit event"
  );
});

// ─── Required schemas declared ───────────────────────────────────────────────

const REQUIRED_SCHEMAS = [
  "NashirCampaign:",
  "CreateNashirCampaignRequest:",
  "NashirCampaignResponse:",
  "NashirCampaignListResponse:",
  "NashirCampaignReadiness:",
  "NashirCampaignReadinessResponse:",
  "NashirCampaignEvidenceListResponse:",
  "SubmitNashirCampaignEvidenceRequest:",
  "NashirCampaignEvidence:",
  "NashirCampaignEvidenceResponse:",
  "ReadinessIssue:",
  "ReadinessMissingField:",
  "ReadinessExplanation:"
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

test("nashir_openapi_patch.yaml declares readiness route with read permission", () => {
  const yaml = patchText();
  const pathStart = yaml.indexOf("/workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/readiness:");
  assert.ok(pathStart !== -1, "readiness path must be declared");
  const rest = yaml.slice(pathStart);
  const nextPath = rest.slice(1).match(/\n  \/workspaces\//);
  const block = nextPath ? rest.slice(0, nextPath.index + 1) : rest;

  assert.ok(block.includes("operationId: getNashirCampaignReadiness"));
  assert.ok(block.includes("x-permission: nashir.campaign.read"));
  assert.ok(block.includes("NashirCampaignReadinessResponse"));
  assert.ok(block.includes("ErrorResponse"));
});

test("nashir readiness schema declares required advisory fields and enums", () => {
  const yaml = patchText();
  for (const field of [
    "nashir_campaign_id",
    "workspace_id",
    "readiness_level",
    "gate_state",
    "blockers",
    "warnings",
    "missing_fields",
    "explanations",
    "evaluated_at"
  ]) {
    assert.ok(yaml.includes(field), `readiness schema must include ${field}`);
  }
  for (const value of ["pass", "soft_pass", "fail", "blocked_until_review", "advisory_only", "ready_for_human_review"]) {
    assert.ok(yaml.includes(value), `readiness schema must include enum value ${value}`);
  }
});

test("nashir_openapi_patch.yaml declares evidence route with read list and write submit", () => {
  const yaml = patchText();
  const pathStart = yaml.indexOf("/workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/evidence:");
  assert.ok(pathStart !== -1, "evidence path must be declared");
  const rest = yaml.slice(pathStart);
  const nextPath = rest.slice(1).match(/\n  \/workspaces\//);
  const block = nextPath ? rest.slice(0, nextPath.index + 1) : rest;

  assert.ok(block.includes("get:"));
  assert.ok(block.includes("operationId: listNashirCampaignEvidence"));
  assert.ok(block.includes("x-permission: nashir.campaign.read"));
  assert.ok(block.includes("NashirCampaignEvidenceListResponse"));
  assert.ok(block.includes("post:"));
  assert.ok(block.includes("operationId: submitNashirCampaignEvidence"));
  assert.ok(block.includes("x-permission: nashir.campaign.write"));
  assert.ok(block.includes("x-audit-event: nashir_evidence.submitted"));
  assert.ok(block.includes("SubmitNashirCampaignEvidenceRequest"));
  assert.ok(block.includes("NashirCampaignEvidenceResponse"));
  assert.ok(block.includes("ErrorResponse"));
  assert.ok(!block.includes("x-permission: nashir.evidence.submit"));
});

test("nashir evidence list response schema declares evidence item array", () => {
  const yaml = patchText();
  const schemaStart = yaml.indexOf("NashirCampaignEvidenceListResponse:");
  assert.ok(schemaStart !== -1, "NashirCampaignEvidenceListResponse schema must be defined");
  const rest = yaml.slice(schemaStart);
  const siblingMatch = rest.slice(1).match(/\n    \S/);
  const block = siblingMatch ? rest.slice(0, siblingMatch.index + 1) : rest;

  assert.ok(block.includes("required: [data]"));
  assert.ok(block.includes("type: array"));
  assert.ok(block.includes("NashirCampaignEvidence"));
  assert.ok(!block.includes("maxItems: 0"));
});

test("nashir evidence submit request schema declares required fields and proof locator rule", () => {
  const yaml = patchText();
  const schemaStart = yaml.indexOf("SubmitNashirCampaignEvidenceRequest:");
  assert.ok(schemaStart !== -1, "SubmitNashirCampaignEvidenceRequest schema must be defined");
  const rest = yaml.slice(schemaStart);
  const siblingMatch = rest.slice(1).match(/\n    \S/);
  const block = siblingMatch ? rest.slice(0, siblingMatch.index + 1) : rest;

  assert.ok(block.includes("- evidenceType"));
  assert.ok(block.includes("- channel"));
  assert.ok(block.includes("additionalProperties: false"));
  assert.ok(block.includes("publishedAt"));
  assert.ok(block.includes("url"));
  assert.ok(block.includes("notes"));
  assert.ok(block.includes("externalReference"));
  assert.ok(block.includes("anyOf:"));
});

test("nashir evidence schema declares submitted in-memory response fields", () => {
  const yaml = patchText();
  for (const field of [
    "id",
    "workspaceId",
    "nashirCampaignId",
    "evidenceType",
    "channel",
    "status",
    "submittedAt",
    "submittedBy",
    "publishedAt",
    "url",
    "notes",
    "externalReference"
  ]) {
    assert.ok(yaml.includes(field), `evidence schema must include ${field}`);
  }
  assert.ok(yaml.includes("submitted"), "evidence schema must include submitted status");
});
