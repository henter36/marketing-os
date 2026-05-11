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
  if (hi === -1) { _cache[key] = docText(file); return _cache[key]; }
  const ni = lines.findIndex((l, i) => i > hi && /^##\s/.test(l));
  _cache[key] = lines.slice(hi, ni === -1 ? undefined : ni).join("\n");
  return _cache[key];
}

// ─── Group 1: src/router.js — no Nashir keyword ────────────────────────────

test("src/router.js has no nashir keyword", () => {
  assert.ok(
    !/nashir/i.test(srcText("router.js")),
    "src/router.js must not reference nashir in any form"
  );
});

// ─── Group 2: src/rbac.js — no Nashir keyword ──────────────────────────────

test("src/rbac.js has no nashir keyword", () => {
  assert.ok(
    !/nashir/i.test(srcText("rbac.js")),
    "src/rbac.js must not reference nashir in any form"
  );
});

// ─── Group 3: src/store.js — no Nashir keyword ─────────────────────────────

test("src/store.js has no nashir keyword", () => {
  assert.ok(
    !/nashir/i.test(srcText("store.js")),
    "src/store.js must not reference nashir in any form"
  );
});

// ─── Group 4: OpenAPI YAML files — no Nashir paths or schemas ───────────────

const OPENAPI_DOCS = [
  "marketing_os_v5_6_5_phase_0_1_openapi.yaml",
  "marketing_os_v5_6_5_phase_0_1_openapi_patch_002.yaml"
];

for (const yamlFile of OPENAPI_DOCS) {
  test(`${yamlFile} has no nashir path or schema`, () => {
    assert.ok(
      !/nashir/i.test(docText(yamlFile)),
      `${yamlFile} must not contain nashir paths or schemas`
    );
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
