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

test("OpenAPI phase 0/1 YAML has no nashir path or schema", () => {
  assert.ok(
    !/nashir/i.test(docText("marketing_os_v5_6_5_phase_0_1_openapi.yaml")),
    "marketing_os_v5_6_5_phase_0_1_openapi.yaml must not contain nashir paths or schemas"
  );
});

test("OpenAPI Patch 002 YAML has no nashir path or schema", () => {
  assert.ok(
    !/nashir/i.test(docText("marketing_os_v5_6_5_phase_0_1_openapi_patch_002.yaml")),
    "marketing_os_v5_6_5_phase_0_1_openapi_patch_002.yaml must not contain nashir paths or schemas"
  );
});

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
// All patterns require NO-GO to appear before the guarded phrase.
// [\s\S]*? crosses newlines so layout changes in the doc don't break assertions.

const NO_GO_CHECKS = [
  // Runtime wiring readiness gate
  { doc: "nashir_runtime_wiring_readiness_gate.md",            phrase: "runtime wiring",           re: /NO-GO[\s\S]*?runtime wiring/i },
  { doc: "nashir_runtime_wiring_readiness_gate.md",            phrase: "route exposure",            re: /NO-GO[\s\S]*?route exposure/i },
  { doc: "nashir_runtime_wiring_readiness_gate.md",            phrase: "OpenAPI activation",        re: /NO-GO[\s\S]*?OpenAPI/i },
  { doc: "nashir_runtime_wiring_readiness_gate.md",            phrase: "SQL or DB access",          re: /NO-GO[\s\S]*?(?:SQL|DB access)/i },
  { doc: "nashir_runtime_wiring_readiness_gate.md",            phrase: "Pilot readiness",           re: /NO-GO[\s\S]*?pilot/i },
  { doc: "nashir_runtime_wiring_readiness_gate.md",            phrase: "Production readiness",      re: /NO-GO[\s\S]*?production/i },
  // RBAC permission activation gate
  { doc: "nashir_rbac_permission_activation_planning_gate.md", phrase: "rbac.js modification",      re: /NO-GO[\s\S]*?rbac/i },
  { doc: "nashir_rbac_permission_activation_planning_gate.md", phrase: "route exposure",            re: /NO-GO[\s\S]*?route exposure/i },
  { doc: "nashir_rbac_permission_activation_planning_gate.md", phrase: "runtime wiring",            re: /NO-GO[\s\S]*?runtime wiring/i },
  { doc: "nashir_rbac_permission_activation_planning_gate.md", phrase: "OpenAPI activation",        re: /NO-GO[\s\S]*?OpenAPI/i },
  { doc: "nashir_rbac_permission_activation_planning_gate.md", phrase: "Pilot readiness",           re: /NO-GO[\s\S]*?pilot/i },
  { doc: "nashir_rbac_permission_activation_planning_gate.md", phrase: "Production readiness",      re: /NO-GO[\s\S]*?production/i },
  // OpenAPI activation planning gate
  { doc: "nashir_openapi_activation_planning_gate.md",         phrase: "OpenAPI YAML modification", re: /NO-GO[\s\S]*?OpenAPI YAML/i },
  { doc: "nashir_openapi_activation_planning_gate.md",         phrase: "route exposure",            re: /NO-GO[\s\S]*?route exposure/i },
  { doc: "nashir_openapi_activation_planning_gate.md",         phrase: "runtime wiring",            re: /NO-GO[\s\S]*?runtime wiring/i },
  { doc: "nashir_openapi_activation_planning_gate.md",         phrase: "RBAC implementation",       re: /NO-GO[\s\S]*?RBAC/i },
  { doc: "nashir_openapi_activation_planning_gate.md",         phrase: "SQL or DB access",          re: /NO-GO[\s\S]*?(?:SQL|DB access)/i },
  { doc: "nashir_openapi_activation_planning_gate.md",         phrase: "Pilot readiness",           re: /NO-GO[\s\S]*?pilot/i },
  { doc: "nashir_openapi_activation_planning_gate.md",         phrase: "Production readiness",      re: /NO-GO[\s\S]*?production/i },
];

for (const { doc, phrase, re } of NO_GO_CHECKS) {
  test(`${doc} preserves NO-GO for ${phrase}`, () => {
    assert.ok(re.test(docText(doc)), `${doc} must preserve NO-GO for ${phrase}`);
  });
}
