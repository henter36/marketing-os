const { existsSync, readFileSync } = require("fs");
const path = require("path");
const { permissions } = require("../src/rbac");
const { implementedRoutes } = require("../src/router");

const specPath = path.resolve(__dirname, "..", "docs", "marketing_os_v5_6_5_phase_0_1_openapi.yaml");
const strict = process.argv.includes("--strict") || process.env.CI === "true" || process.env.STRICT_GATES === "true";

if (!existsSync(specPath)) {
  const message = "OpenAPI contract file is not present in this checkout; full repository checkouts include docs/marketing_os_v5_6_5_phase_0_1_openapi.yaml.";
  if (strict) {
    console.error(message);
    console.error("Strict Sprint 0 OpenAPI lint requires the authoritative OpenAPI file.");
    process.exit(1);
  }
  console.warn(message);
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

if (Array.isArray(implementedRoutes)) {
  const missingRoutes = implementedRoutes.filter((route) => !routeExistsInSpec(spec, route));
  if (missingRoutes.length > 0) {
    console.error(`Implemented routes are absent from OpenAPI: ${missingRoutes.join(", ")}`);
    process.exit(1);
  }
}

const validator = loadValidator();
if (validator) {
  const result = validator();
  if (result.status !== 0) {
    process.exit(result.status);
  }
  console.log(`OpenAPI strict validator passed using ${result.name}.`);
} else if (strict) {
  console.warn("No real OpenAPI validator package is installed; strict lint completed Sprint 0 contract checks only.");
}

console.log(`OpenAPI Sprint 0 ${strict ? "strict" : "lightweight"} lint passed: ${declaredPermissions.length} declared permissions checked.`);

function loadValidator() {
  const candidates = [
    {
      name: "@redocly/cli",
      bin: "redocly",
      args: ["lint", specPath],
      moduleName: "@redocly/cli"
    },
    {
      name: "swagger-cli",
      bin: "swagger-cli",
      args: ["validate", specPath],
      moduleName: "swagger-cli"
    }
  ];

  for (const candidate of candidates) {
    try {
      require.resolve(candidate.moduleName);
      return () => runNodeBin(candidate);
    } catch {
      // Optional validator is not installed in this dependency-free Sprint 0 baseline.
    }
  }

  return null;
}

function runNodeBin(candidate) {
  const { spawnSync } = require("child_process");
  const result = spawnSync(candidate.bin, candidate.args, { stdio: "inherit" });
  return {
    name: candidate.name,
    status: result.status || 0
  };
}

function routeExistsInSpec(spec, route) {
  const [method, routePath] = route.split(" ");
  const pathIndex = spec.indexOf(`  ${routePath}:`);
  if (pathIndex === -1) {
    return false;
  }
  const nextPathIndex = spec.indexOf("\n  /", pathIndex + 1);
  const pathBlock = nextPathIndex === -1 ? spec.slice(pathIndex) : spec.slice(pathIndex, nextPathIndex);
  return pathBlock.includes(`    ${method.toLowerCase()}:`);
}
