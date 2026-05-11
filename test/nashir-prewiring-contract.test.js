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
  if (!_cache[key]) _cache[key] = fs.readFileSync(path.join(ROOT, "src", file), "utf8");
  return _cache[key];
}

function docText(file) {
  const key = "doc:" + file;
  if (!_cache[key]) _cache[key] = fs.readFileSync(path.join(ROOT, "docs", file), "utf8");
  return _cache[key];
}

// ─── Group 1: src/router.js — no Nashir route surface ──────────────────────

test("src/router.js has no isNashirPath predicate", () => {
  assert.ok(
    !/isNashirPath/.test(srcText("router.js")),
    "src/router.js must not define an isNashirPath route predicate"
  );
});

test("src/router.js has no routeNashir handler", () => {
  assert.ok(
    !/routeNashir/.test(srcText("router.js")),
    "src/router.js must not define a routeNashir handler function"
  );
});

test("src/router.js has no /nashir or /nashir/ route path segment", () => {
  assert.ok(
    !/\/nashir(?:\/|['"`?]|$)/i.test(srcText("router.js")),
    "src/router.js must not contain a /nashir or /nashir/ route path segment"
  );
});

test("src/router.js has no require of nashir modules", () => {
  assert.ok(
    !/require\([^)]*nashir/.test(srcText("router.js")),
    "src/router.js must not require any nashir module"
  );
});

// ─── Group 2: src/rbac.js — no Nashir permission codes ─────────────────────
// One broad check catches all current and future nashir.* codes.

test("src/rbac.js has no nashir.* permission codes", () => {
  assert.ok(
    !/\bnashir\./i.test(srcText("rbac.js")),
    "src/rbac.js must not contain any nashir.* permission code"
  );
});

// ─── Group 3: src/store.js — no Nashir store entities ──────────────────────

test("src/store.js has no nashirCampaigns collection", () => {
  assert.ok(
    !/nashirCampaigns?/.test(srcText("store.js")),
    "src/store.js must not contain a nashirCampaigns store collection"
  );
});

test("src/store.js has no nashirEvidence collection", () => {
  assert.ok(
    !/nashirEvidence/.test(srcText("store.js")),
    "src/store.js must not contain a nashirEvidence store collection"
  );
});

test("src/store.js has no nashir keyword", () => {
  assert.ok(
    !/nashir/i.test(srcText("store.js")),
    "src/store.js must not reference nashir in any form"
  );
});

// ─── Group 4: OpenAPI YAML files — no Nashir paths or schemas ───────────────

test("OpenAPI phase 0/1 YAML has no nashir path or schema", () => {
  const yaml = fs.readFileSync(
    path.join(ROOT, "docs", "marketing_os_v5_6_5_phase_0_1_openapi.yaml"),
    "utf8"
  );
  assert.ok(
    !/nashir/i.test(yaml),
    "marketing_os_v5_6_5_phase_0_1_openapi.yaml must not contain nashir paths or schemas"
  );
});

test("OpenAPI Patch 002 YAML has no nashir path or schema", () => {
  const yaml = fs.readFileSync(
    path.join(ROOT, "docs", "marketing_os_v5_6_5_phase_0_1_openapi_patch_002.yaml"),
    "utf8"
  );
  assert.ok(
    !/nashir/i.test(yaml),
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

// ─── Group 6: NO-GO language preserved in runtime wiring readiness gate ─────
// [\s\S]*? matches across newlines so layout changes in the doc don't break assertions.

test("runtime wiring gate preserves NO-GO for runtime wiring", () => {
  const doc = docText("nashir_runtime_wiring_readiness_gate.md");
  assert.ok(
    /NO-GO[\s\S]*?[Rr]untime wiring|[Rr]untime wiring[\s\S]*?NO-GO/.test(doc),
    "nashir_runtime_wiring_readiness_gate.md must preserve NO-GO for runtime wiring"
  );
});

test("runtime wiring gate preserves NO-GO for route exposure", () => {
  const doc = docText("nashir_runtime_wiring_readiness_gate.md");
  assert.ok(
    /NO-GO[\s\S]*?[Rr]oute exposure|[Rr]oute exposure[\s\S]*?NO-GO/.test(doc),
    "nashir_runtime_wiring_readiness_gate.md must preserve NO-GO for route exposure"
  );
});

test("runtime wiring gate preserves NO-GO for OpenAPI activation", () => {
  const doc = docText("nashir_runtime_wiring_readiness_gate.md");
  assert.ok(
    /NO-GO[\s\S]*?OpenAPI|OpenAPI[\s\S]*?NO-GO/.test(doc),
    "nashir_runtime_wiring_readiness_gate.md must preserve NO-GO for OpenAPI activation"
  );
});

test("runtime wiring gate preserves NO-GO for SQL or DB access", () => {
  const doc = docText("nashir_runtime_wiring_readiness_gate.md");
  assert.ok(
    /NO-GO[\s\S]*?SQL|SQL[\s\S]*?NO-GO|NO-GO[\s\S]*?DB access|DB access[\s\S]*?NO-GO/i.test(doc),
    "nashir_runtime_wiring_readiness_gate.md must preserve NO-GO for SQL/DB access"
  );
});

// ─── Group 7: NO-GO language preserved in RBAC permission activation gate ───

test("RBAC gate preserves NO-GO for src/rbac.js modification", () => {
  const doc = docText("nashir_rbac_permission_activation_planning_gate.md");
  assert.ok(
    /NO-GO[\s\S]*?rbac|rbac[\s\S]*?NO-GO/i.test(doc),
    "nashir_rbac_permission_activation_planning_gate.md must preserve NO-GO for src/rbac.js modification"
  );
});

test("RBAC gate preserves NO-GO for route exposure", () => {
  const doc = docText("nashir_rbac_permission_activation_planning_gate.md");
  assert.ok(
    /NO-GO[\s\S]*?[Rr]oute exposure|[Rr]oute exposure[\s\S]*?NO-GO/.test(doc),
    "nashir_rbac_permission_activation_planning_gate.md must preserve NO-GO for route exposure"
  );
});

test("RBAC gate preserves NO-GO for runtime wiring", () => {
  const doc = docText("nashir_rbac_permission_activation_planning_gate.md");
  assert.ok(
    /NO-GO[\s\S]*?[Rr]untime wiring|[Rr]untime wiring[\s\S]*?NO-GO/.test(doc),
    "nashir_rbac_permission_activation_planning_gate.md must preserve NO-GO for runtime wiring"
  );
});

test("RBAC gate preserves NO-GO for OpenAPI activation", () => {
  const doc = docText("nashir_rbac_permission_activation_planning_gate.md");
  assert.ok(
    /NO-GO[\s\S]*?OpenAPI|OpenAPI[\s\S]*?NO-GO/.test(doc),
    "nashir_rbac_permission_activation_planning_gate.md must preserve NO-GO for OpenAPI activation"
  );
});

// ─── Group 8: NO-GO language preserved in OpenAPI activation planning gate ──

test("OpenAPI gate preserves NO-GO for OpenAPI YAML modification", () => {
  const doc = docText("nashir_openapi_activation_planning_gate.md");
  assert.ok(
    /NO-GO[\s\S]*?OpenAPI YAML|OpenAPI YAML[\s\S]*?NO-GO/.test(doc),
    "nashir_openapi_activation_planning_gate.md must preserve NO-GO for OpenAPI YAML modification"
  );
});

test("OpenAPI gate preserves NO-GO for route exposure", () => {
  const doc = docText("nashir_openapi_activation_planning_gate.md");
  assert.ok(
    /NO-GO[\s\S]*?[Rr]oute exposure|[Rr]oute exposure[\s\S]*?NO-GO/.test(doc),
    "nashir_openapi_activation_planning_gate.md must preserve NO-GO for route exposure"
  );
});

test("OpenAPI gate preserves NO-GO for runtime wiring", () => {
  const doc = docText("nashir_openapi_activation_planning_gate.md");
  assert.ok(
    /NO-GO[\s\S]*?[Rr]untime wiring|[Rr]untime wiring[\s\S]*?NO-GO/.test(doc),
    "nashir_openapi_activation_planning_gate.md must preserve NO-GO for runtime wiring"
  );
});

test("OpenAPI gate preserves NO-GO for RBAC implementation", () => {
  const doc = docText("nashir_openapi_activation_planning_gate.md");
  assert.ok(
    /NO-GO[\s\S]*?RBAC|RBAC[\s\S]*?NO-GO/.test(doc),
    "nashir_openapi_activation_planning_gate.md must preserve NO-GO for RBAC implementation"
  );
});

test("OpenAPI gate preserves NO-GO for SQL or DB access", () => {
  const doc = docText("nashir_openapi_activation_planning_gate.md");
  assert.ok(
    /NO-GO[\s\S]*?SQL|SQL[\s\S]*?NO-GO|NO-GO[\s\S]*?DB access|DB access[\s\S]*?NO-GO/i.test(doc),
    "nashir_openapi_activation_planning_gate.md must preserve NO-GO for SQL/DB access"
  );
});

// ─── Group 9: Pilot and Production NO-GO preserved in all three gate docs ───

const GATE_DOCS = [
  "nashir_runtime_wiring_readiness_gate.md",
  "nashir_rbac_permission_activation_planning_gate.md",
  "nashir_openapi_activation_planning_gate.md"
];

for (const doc of GATE_DOCS) {
  test(`${doc} preserves NO-GO for Pilot readiness`, () => {
    const content = docText(doc);
    assert.ok(
      /NO-GO[\s\S]*?[Pp]ilot|[Pp]ilot[\s\S]*?NO-GO/.test(content),
      `${doc} must preserve NO-GO for Pilot readiness`
    );
  });

  test(`${doc} preserves NO-GO for Production readiness`, () => {
    const content = docText(doc);
    assert.ok(
      /NO-GO[\s\S]*?[Pp]roduction|[Pp]roduction[\s\S]*?NO-GO/.test(content),
      `${doc} must preserve NO-GO for Production readiness`
    );
  });
}
