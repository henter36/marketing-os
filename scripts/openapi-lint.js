const { existsSync, readFileSync } = require("fs");
const path = require("path");
const { permissions } = require("../src/rbac");
const { implementedRoutes } = require("../src/router");

const specPath = path.resolve(__dirname, "..", "docs", "marketing_os_v5_6_5_phase_0_1_openapi.yaml");
const sprint3PatchPath = path.resolve(__dirname, "..", "docs", "marketing_os_v5_6_5_phase_0_1_openapi_sprint3_patch.yaml");
const patch002Path = path.resolve(__dirname, "..", "docs", "marketing_os_v5_6_5_phase_0_1_openapi_patch_002.yaml");
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

const baseSpec = readFileSync(specPath, "utf8");
const sprint3Patch = existsSync(sprint3PatchPath) ? readFileSync(sprint3PatchPath, "utf8") : "";
const patch002 = strict && existsSync(patch002Path) ? readFileSync(patch002Path, "utf8") : "";
const spec = `${baseSpec}\n${sprint3Patch}\n${patch002}`;
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
  console.warn("No real OpenAPI validator package is installed; strict lint completed contract checks only.");
}

console.log(`OpenAPI ${strict ? "strict" : "lightweight"} lint passed: ${declaredPermissions.length} declared permissions checked.`);

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
      // Optional validator is not installed in this dependency-free baseline.
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

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
