"use strict";

const assert = require("assert");
const { test } = require("node:test");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");

// Simple read-once memoization — avoids redundant disk reads across tests
const _cache = Object.create(null);

function srcText(file) {
  const key = "src:" + file;
  if (_cache[key] === undefined) _cache[key] = fs.readFileSync(path.join(ROOT, "src", file), "utf8");
  return _cache[key];
}

function docText(file) {
  const key = "doc:" + file;
  if (_cache[key] === undefined) _cache[key] = fs.readFileSync(path.join(ROOT, "docs", file), "utf8");
  return _cache[key];
}

// Extracts the "GO / NO-GO Decision" section from a gate document.
// Matches the heading containing "GO / NO-GO" (not just any NO-GO heading)
// so sections like "Explicit NO-GO List" are not confused with the decision block.
function noGoSection(file) {
  const key = "nogo:" + file;
  if (_cache[key] !== undefined) return _cache[key];
  const lines = docText(file).split("\n");
  const hi = lines.findIndex(l => /^##\s.*go\s*\/\s*no-go/i.test(l));
  if (hi === -1) { _cache[key] = ""; return ""; }
  const ni = lines.findIndex((l, i) => i > hi && /^#{1,2}\s/.test(l));
  _cache[key] = lines.slice(hi, ni === -1 ? undefined : ni).join("\n");
  return _cache[key];
}

// ─── Group 1: src/router.js — approved Nashir read route patterns only ───────
// PR #180 approved GET /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}.
// PR #185 approved GET /workspaces/{workspaceId}/nashir-campaigns.
// PR #191 approved POST /workspaces/{workspaceId}/nashir-campaigns.
// PR #197 approved GET /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/readiness.
// PR #201 approved GET /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/evidence.
// PR #207 approved POST /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/evidence.
// Strip only the approved identifiers before checking for unauthorized Nashir references.

test("src/router.js exposes only the approved nashir route patterns", () => {
  const withoutApproved = srcText("router.js")
    // Class names (PR #180 approved constructor injection)
    .replace(/\bNashirSlice0Repository\b/g, "")
    .replace(/\bNashirSlice0Service\b/g, "")
    .replace(/\bNashirCampaign\b/g, "")
    .replace(/\bNashirEvidence\b/g, "")
    // Module require paths
    .replace(/\.\/nashir\/backend-slice0-(?:repository|service)/g, "")
    // Collection and URL identifiers
    .replace(/\bnashirCampaigns\b/g, "")
    .replace(/\bnashirCampaignId\b/g, "")
    .replace(/\bnashir_campaign_id\b/g, "")
    .replace(/\bnashir-campaigns\b/gi, "")
    .replace(/\breadinessPath\b/g, "")
    .replace(/\bevidencePath\b/g, "")
    .replace(/\bgetCampaignReadiness\b/g, "")
    .replace(/\blistCampaignEvidence\b/g, "")
    .replace(/\bcreateCampaignEvidence\b/g, "")
    .replace(/\bReadiness\b/g, "")
    .replace(/\breadiness\b/g, "")
    .replace(/\bEvidence\b/g, "")
    .replace(/\bevidence\b/g, "")
    .replace(/\bevaluatedAt\b/g, "")
    .replace(/\bevaluated_at\b/g, "")
    .replace(/\bevidenceType\b/g, "")
    .replace(/\bexternalReference\b/g, "")
    .replace(/\bpublishedAt\b/g, "")
    .replace(/\bsubmittedAt\b/g, "")
    .replace(/\bsubmittedBy\b/g, "")
    .replace(/Readiness is advisory and does not approve content or authorize publishing\./g, "")
    .replace(/At least one proof locator is required\./g, "")
    .replace(/Provide url, externalReference, or notes\./g, "")
    .replace(/\bNASHIR_READINESS_ADVISORY_ONLY\b/g, "")
    .replace(/\badvisory_only\b/g, "")
    // Permission code
    .replace(/\bnashir\.campaign\.read\b/g, "")
    .replace(/\bnashir\.campaign\.write\b/g, "")
    // Audit event
    .replace(/\bnashir_campaign\.created\b/g, "")
    .replace(/\bnashir_evidence\.submitted\b/g, "")
    .replace(/\bisNashirAction\b/g, "")
    .replace(/\bnashir_\b/g, "")
    .replace(/\bnashir-slice-0\b/g, "")
    .replace(/Failed to create Nashir campaign\./g, "")
    // Router function and variable names introduced by the approved wiring
    .replace(/\bnashirRoutes\b/g, "")
    .replace(/\brouteNashir\b/g, "")
    .replace(/\bisNashirPath\b/g, "")
    // Local variables inside the approved route handler
    .replace(/\bnashirRepository\b/g, "")
    .replace(/\bnashirService\b/g, "");

  assert.ok(
    !/nashir/i.test(withoutApproved),
    "src/router.js must not reference nashir beyond the approved read route patterns"
  );
});

test("src/router.js registers only approved POST nashir evidence route", () => {
  assert.ok(
    srcText("router.js").includes("POST /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/evidence"),
    "POST evidence must be listed as an implemented Nashir route"
  );
});

// ─── Group 2: src/rbac.js — approved Nashir permission codes only ───────────

const APPROVED_NASHIR_CODES = [
  "nashir.campaign.read",
  "nashir.campaign.write",
  "nashir.evidence.submit",
  "nashir.approval.decide"
];

function nashirCodesInRbac() {
  const rbac = srcText("rbac.js");
  return new Set(
    [...rbac.matchAll(/["'`](nashir\.[a-z_]+\.[a-z_]+)["'`]/g)].map((m) => m[1])
  );
}

test("src/rbac.js contains only approved Nashir permission codes", () => {
  const actual = [...nashirCodesInRbac()].sort();
  const expected = [...APPROVED_NASHIR_CODES].sort();
  assert.deepStrictEqual(
    actual,
    expected,
    "src/rbac.js must include only approved Nashir codes"
  );
});

// ─── Group 3: src/store.js — only the approved nashirCampaigns collection ──────
// The Nashir store entities implementation gate approved adding nashirCampaigns to
// src/store.js. The in-memory evidence submit gate later approved nashirEvidence.
// All other Nashir references in src/store.js remain unauthorized.

test("src/store.js and src/store_sprint3.js reference nashir only via approved store entities", () => {
  // Approved by the Nashir store entities gate:
  // - nashirCampaigns collection
  // - nashir_campaign_id field
  // - nashirEvidence collection
  // Any other Nashir reference in store files remains unauthorized.
  for (const file of ["store.js", "store_sprint3.js"]) {
    const withoutApproved = srcText(file)
      .replace(/\bnashirCampaigns\b/gi, "")
      .replace(/\bnashirEvidence\b/gi, "")
      .replace(/\bnashir_campaign_id\b/gi, "");

    const remainingMatch = withoutApproved.match(/nashir/i);

    assert.equal(
      remainingMatch,
      null,
      "src/" + file + " must not reference nashir beyond the approved nashirCampaigns store entities"
    );
  }
});

// ─── Group 4: OpenAPI YAML files — content-based classification ──────────────
// A YAML is OpenAPI if its content contains a top-level `openapi:` key.
// A Nashir OpenAPI file is an OpenAPI file whose content also contains "nashir".

function isOpenApiSpec(f) {
  return /^\s*openapi\s*:/m.test(docText(f));
}

const ALL_YAML_FILES = fs
  .readdirSync(path.join(ROOT, "docs"))
  .filter(f => f.endsWith(".yaml"));

const OPENAPI_DOCS = ALL_YAML_FILES.filter(
  f => isOpenApiSpec(f) && !/\bnashir\b/i.test(docText(f))
);

const NASHIR_OPENAPI_DOCS = ALL_YAML_FILES.filter(
  f => isOpenApiSpec(f) && /\bnashir\b/i.test(docText(f))
);

const NASHIR_OPENAPI_WHITELIST = ["nashir_openapi_patch.yaml"];

assert.ok(OPENAPI_DOCS.length > 0, "At least one non-Nashir OpenAPI specification must be present for verification");
assert.deepStrictEqual(
  [...NASHIR_OPENAPI_DOCS].sort(),
  [...NASHIR_OPENAPI_WHITELIST].sort(),
  "Nashir OpenAPI docs must exactly match the approved whitelist"
);

for (const yamlFile of OPENAPI_DOCS) {
  test(`${yamlFile} has no nashir path or schema`, () => {
    assert.ok(
      !/nashir/i.test(docText(yamlFile)),
      `${yamlFile} must not contain nashir paths or schemas`
    );
  });
}

const DEFERRED_NASHIR_PERMISSIONS = [
  "nashir.evidence.submit",
  "nashir.approval.decide",
  "nashir.evidence.read",
  "nashir.approval.read",
  "nashir.intake.create"
];

// Regex-based x-permission check — tolerates optional whitespace and quotes.
function matchesXPermission(yaml, code) {
  const escaped = code.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`^\\s*x-permission\\s*:\\s*["']?${escaped}["']?\\s*$`, "m").test(yaml);
}

for (const yamlFile of NASHIR_OPENAPI_DOCS) {
  test(`${yamlFile} contains nashir content`, () => {
    assert.ok(
      /nashir/i.test(docText(yamlFile)),
      `${yamlFile} must contain Nashir paths or schemas`
    );
  });

  test(`${yamlFile} does not expose deferred Nashir permission codes`, () => {
    const yaml = docText(yamlFile);
    for (const code of DEFERRED_NASHIR_PERMISSIONS) {
      assert.ok(
        !matchesXPermission(yaml, code),
        `${yamlFile} must not expose deferred permission: ${code}`
      );
    }
  });
}

// ─── Group 5: Planning gate documents exist ─────────────────────────────────

test("docs/nashir_runtime_wiring_readiness_gate.md exists", () => {
  assert.ok(
    fs.existsSync(path.join(ROOT, "docs", "nashir_runtime_wiring_readiness_gate.md")),
    "nashir_runtime_wiring_readiness_gate.md must exist"
  );
});

test("docs/nashir_rbac_permission_activation_planning_gate.md exists", () => {
  assert.ok(
    fs.existsSync(path.join(ROOT, "docs", "nashir_rbac_permission_activation_planning_gate.md")),
    "nashir_rbac_permission_activation_planning_gate.md must exist"
  );
});

test("docs/nashir_openapi_activation_planning_gate.md exists", () => {
  assert.ok(
    fs.existsSync(path.join(ROOT, "docs", "nashir_openapi_activation_planning_gate.md")),
    "nashir_openapi_activation_planning_gate.md must exist"
  );
});

// ─── Groups 6-9: NO-GO language preserved in gate documents ─────────────────
// Each pattern checks the extracted "GO / NO-GO Decision" section only.
// ^NO-GO[^\n]* requires the phrase on the same line as a NO-GO prefix (m flag).

const NO_GO_CHECKS = [
  // Runtime wiring readiness gate
  { doc: "nashir_runtime_wiring_readiness_gate.md",            phrase: "runtime wiring",           re: /^NO-GO[^\n]*runtime wiring/im },
  { doc: "nashir_runtime_wiring_readiness_gate.md",            phrase: "route exposure",            re: /^NO-GO[^\n]*route exposure/im },
  { doc: "nashir_runtime_wiring_readiness_gate.md",            phrase: "OpenAPI activation",        re: /^NO-GO[^\n]*OpenAPI/im },
  { doc: "nashir_runtime_wiring_readiness_gate.md",            phrase: "SQL or DB access",          re: /^NO-GO[^\n]*(?:SQL|DB access)/im },
  { doc: "nashir_runtime_wiring_readiness_gate.md",            phrase: "Pilot readiness",           re: /^NO-GO[^\n]*pilot/im },
  { doc: "nashir_runtime_wiring_readiness_gate.md",            phrase: "Production readiness",      re: /^NO-GO[^\n]*production/im },
  // RBAC permission activation gate
  { doc: "nashir_rbac_permission_activation_planning_gate.md", phrase: "rbac.js modification",      re: /^NO-GO[^\n]*rbac/im },
  { doc: "nashir_rbac_permission_activation_planning_gate.md", phrase: "route exposure",            re: /^NO-GO[^\n]*route exposure/im },
  { doc: "nashir_rbac_permission_activation_planning_gate.md", phrase: "runtime wiring",            re: /^NO-GO[^\n]*runtime wiring/im },
  { doc: "nashir_rbac_permission_activation_planning_gate.md", phrase: "OpenAPI activation",        re: /^NO-GO[^\n]*OpenAPI/im },
  { doc: "nashir_rbac_permission_activation_planning_gate.md", phrase: "Pilot readiness",           re: /^NO-GO[^\n]*pilot/im },
  { doc: "nashir_rbac_permission_activation_planning_gate.md", phrase: "Production readiness",      re: /^NO-GO[^\n]*production/im },
  // OpenAPI activation planning gate
  { doc: "nashir_openapi_activation_planning_gate.md",         phrase: "OpenAPI YAML modification", re: /^NO-GO[^\n]*OpenAPI YAML/im },
  { doc: "nashir_openapi_activation_planning_gate.md",         phrase: "route exposure",            re: /^NO-GO[^\n]*route exposure/im },
  { doc: "nashir_openapi_activation_planning_gate.md",         phrase: "runtime wiring",            re: /^NO-GO[^\n]*runtime wiring/im },
  { doc: "nashir_openapi_activation_planning_gate.md",         phrase: "RBAC implementation",       re: /^NO-GO[^\n]*RBAC/im },
  { doc: "nashir_openapi_activation_planning_gate.md",         phrase: "SQL or DB access",          re: /^NO-GO[^\n]*(?:SQL|DB access)/im },
  { doc: "nashir_openapi_activation_planning_gate.md",         phrase: "Pilot readiness",           re: /^NO-GO[^\n]*pilot/im },
  { doc: "nashir_openapi_activation_planning_gate.md",         phrase: "Production readiness",      re: /^NO-GO[^\n]*production/im },
];

for (const { doc, phrase, re } of NO_GO_CHECKS) {
  test(`${doc} preserves NO-GO for ${phrase}`, () => {
    assert.ok(re.test(noGoSection(doc)), `${doc} must preserve NO-GO for ${phrase}`);
  });
}
