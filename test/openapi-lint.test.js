"use strict";

const assert = require("assert");
const { test } = require("node:test");
const fs = require("fs");
const path = require("path");

// Mirrors the routeExistsInSpec and escapeRegExp logic from scripts/openapi-lint.js
// so we can test spec-coverage behavior without running the script as a child process.

const ROOT = path.join(__dirname, "..");
const BASE_SPEC_PATH = path.join(ROOT, "docs", "marketing_os_v5_6_5_phase_0_1_openapi.yaml");
const NASHIR_PATCH_PATH = path.join(ROOT, "docs", "nashir_openapi_patch.yaml");
const PATCH002_PATH = path.join(ROOT, "docs", "marketing_os_v5_6_5_phase_0_1_openapi_patch_002.yaml");

const NASHIR_ROUTE = "GET /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}";

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function routeExistsInSpec(spec, route) {
  const [method, routePath] = route.split(" ");
  const normalizedSpec = `\n${spec}`;
  const pathRegex = new RegExp(`\\n  ${escapeRegExp(routePath)}:`, "g");
  let match;
  while ((match = pathRegex.exec(normalizedSpec)) !== null) {
    const pathIndex = match.index;
    const nextPathIndex = normalizedSpec.indexOf("\n  /", pathIndex + 1);
    const pathBlock = nextPathIndex === -1 ? normalizedSpec.slice(pathIndex) : normalizedSpec.slice(pathIndex, nextPathIndex);
    if (pathBlock.includes(`    ${method.toLowerCase()}:`)) {
      return true;
    }
  }
  return false;
}

// ─── Nashir patch existence — strict lint exits with code 1 when absent ──────

test("docs/nashir_openapi_patch.yaml exists — strict lint exits with code 1 when absent", () => {
  assert.ok(
    fs.existsSync(NASHIR_PATCH_PATH),
    "docs/nashir_openapi_patch.yaml must exist — strict lint calls process.exit(1) when this file is missing"
  );
});

// ─── Route coverage: base spec does NOT contain the nashir route ─────────────

test("nashir read-by-id route is absent from base spec alone", () => {
  const baseSpec = fs.readFileSync(BASE_SPEC_PATH, "utf8");
  assert.ok(
    !routeExistsInSpec(baseSpec, NASHIR_ROUTE),
    "The nashir read-by-id route must not be in the base spec — it lives in the approved patch file"
  );
});

// ─── Route coverage: nashir patch DOES contain the route ─────────────────────

test("nashir read-by-id route is present in docs/nashir_openapi_patch.yaml", () => {
  const patch = fs.readFileSync(NASHIR_PATCH_PATH, "utf8");
  assert.ok(
    routeExistsInSpec(patch, NASHIR_ROUTE),
    "docs/nashir_openapi_patch.yaml must declare the nashir read-by-id route with GET method"
  );
});

// ─── Route coverage: combined spec satisfies the route ───────────────────────

test("nashir route is satisfied when nashir_openapi_patch.yaml is appended to base spec (strict mode behavior)", () => {
  const baseSpec = fs.readFileSync(BASE_SPEC_PATH, "utf8");
  const nashirPatch = fs.readFileSync(NASHIR_PATCH_PATH, "utf8");
  const combined = `${baseSpec}\n${nashirPatch}`;
  assert.ok(
    routeExistsInSpec(combined, NASHIR_ROUTE),
    "Combined spec (base + nashir patch) must satisfy the nashir read-by-id route check"
  );
});

// ─── Existing spec coverage still works (no regression) ─────────────────────

test("routeExistsInSpec returns true for a route known to be in the base spec", () => {
  const baseSpec = fs.readFileSync(BASE_SPEC_PATH, "utf8");
  // The workspace list route is a well-established base spec route.
  assert.ok(
    routeExistsInSpec(baseSpec, "GET /workspaces"),
    "A known base-spec route must still be recognized after logic reuse"
  );
});

test("routeExistsInSpec returns false for a completely unknown route", () => {
  const baseSpec = fs.readFileSync(BASE_SPEC_PATH, "utf8");
  assert.ok(
    !routeExistsInSpec(baseSpec, "DELETE /workspaces/{workspaceId}/nashir-campaigns/nonexistent"),
    "A nonexistent route must not be found in the spec"
  );
});

// ─── Permission codes from nashir patch are known to RBAC ───────────────────

test("x-permission values declared in nashir_openapi_patch.yaml are all present in src/rbac.js permissions", () => {
  const { permissions } = require("../src/rbac");
  const permissionCodes = new Set(permissions.map((p) => p.permission_code));
  const patch = fs.readFileSync(NASHIR_PATCH_PATH, "utf8");
  const declaredPermissions = [
    ...patch.matchAll(/x-permission:\s*["']?([A-Za-z0-9_.-]+)["']?/g),
  ].map((m) => m[1].toLowerCase());
  assert.ok(
    declaredPermissions.length > 0,
    "Expected at least one x-permission declaration in nashir_openapi_patch.yaml"
  );
  const unknown = declaredPermissions.filter((code) => !permissionCodes.has(code));
  assert.deepStrictEqual(
    unknown,
    [],
    `nashir_openapi_patch.yaml declares unknown permission codes: ${unknown.join(", ")}`
  );
});

// ─── patch002 route coverage still works (no regression) ────────────────────

test("patch002 routes are still recognized when patch002 spec is appended to base spec", () => {
  assert.ok(fs.existsSync(PATCH002_PATH), "docs/marketing_os_v5_6_5_phase_0_1_openapi_patch_002.yaml must exist");
  const baseSpec = fs.readFileSync(BASE_SPEC_PATH, "utf8");
  const patch002 = fs.readFileSync(PATCH002_PATH, "utf8");
  const combined = `${baseSpec}\n${patch002}`;
  // Connector list is a representative patch002 route
  assert.ok(
    routeExistsInSpec(combined, "GET /workspaces/{workspaceId}/connectors"),
    "patch002 routes must still be recognized in combined spec"
  );
});
