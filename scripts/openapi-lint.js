const { existsSync, readFileSync } = require("fs");
const path = require("path");
const { permissions } = require("../src/rbac");

const specPath = path.resolve(__dirname, "..", "docs", "marketing_os_v5_6_5_phase_0_1_openapi.yaml");

if (!existsSync(specPath)) {
  console.warn("OpenAPI contract file is not present in this checkout; full repository checkouts include docs/marketing_os_v5_6_5_phase_0_1_openapi.yaml.");
  process.exit(0);
}

const spec = readFileSync(specPath, "utf8");
const requiredFragments = [
  "openapi: 3.1.0",
  "ErrorModel:",
  "code:",
  "message:",
  "user_action:",
  "correlation_id:",
  "Idempotency-Key",
  "x-permission:"
];

const missingFragments = requiredFragments.filter((fragment) => !spec.includes(fragment));
if (missingFragments.length > 0) {
  console.error(`OpenAPI contract is missing required fragments: ${missingFragments.join(", ")}`);
  process.exit(1);
}

const permissionCodes = new Set(permissions.map((permission) => permission.permission_code));
const declaredPermissions = [...spec.matchAll(/x-permission:\s*([a-z0-9_.-]+)/g)].map((match) => match[1]);
const unknown = declaredPermissions.filter((permission) => !permissionCodes.has(permission));

if (unknown.length > 0) {
  console.error(`OpenAPI declares permissions absent from Sprint 0 seed: ${[...new Set(unknown)].join(", ")}`);
  process.exit(1);
}

console.log(`OpenAPI Sprint 0 lint passed: ${declaredPermissions.length} declared permissions checked.`);
