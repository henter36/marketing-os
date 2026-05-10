"use strict";

const assert = require("assert");
const { test } = require("node:test");

const {
  NASHIR_SLICE0_PLANNING_CONTRACT,
  getNashirSlice0PlanningContract
} = require("../src/nashir/backend-slice0-planning");

test("getNashirSlice0PlanningContract returns the exact NASHIR_SLICE0_PLANNING_CONTRACT reference", () => {
  assert.strictEqual(getNashirSlice0PlanningContract(), NASHIR_SLICE0_PLANNING_CONTRACT);
});

test("boundaries are all false", () => {
  const { boundaries } = NASHIR_SLICE0_PLANNING_CONTRACT;

  const expectedBoundaryKeys = [
    "routeExposure",
    "sqlRequired",
    "openApiRequired",
    "testsApproved",
    "pilotReadiness",
    "productionReadiness",
    "runtimeWiring",
    "mutatesGlobalState",
    "performsIo",
    "usesExternalPackages"
  ].sort();

  assert.deepStrictEqual(Object.keys(boundaries).sort(), expectedBoundaryKeys);

  for (const [key, value] of Object.entries(boundaries)) {
    assert.strictEqual(value, false, "Boundary " + key + " should be false");
  }
});

test("audit events match planned string identifiers", () => {
  const { auditEvents } = NASHIR_SLICE0_PLANNING_CONTRACT;
  assert.strictEqual(auditEvents.IDEMPOTENCY_CONFLICT, "nashir.idempotency.conflict");
  assert.strictEqual(auditEvents.PROCESS_BLOCKED, "nashir.process.blocked");
});

test("error codes match planned string values", () => {
  const { errorCodes } = NASHIR_SLICE0_PLANNING_CONTRACT;
  assert.strictEqual(errorCodes.PERMISSION_DENIED, "PERMISSION_DENIED");
  assert.strictEqual(errorCodes.WORKSPACE_ACCESS_DENIED, "WORKSPACE_ACCESS_DENIED");
  assert.strictEqual(errorCodes.TENANT_CONTEXT_MISMATCH, "TENANT_CONTEXT_MISMATCH");
  assert.strictEqual(errorCodes.IDEMPOTENCY_CONFLICT, "NASHIR_IDEMPOTENCY_CONFLICT");
  assert.strictEqual(errorCodes.INVALID_STATE_TRANSITION, "NASHIR_INVALID_STATE_TRANSITION");
});

test("error HTTP status map covers all error codes with intended status codes", () => {
  const { errorCodes, errorHttpStatus } = NASHIR_SLICE0_PLANNING_CONTRACT;

  assert.deepStrictEqual(
    Object.keys(errorHttpStatus).sort(),
    Object.values(errorCodes).sort()
  );

  assert.strictEqual(errorHttpStatus[errorCodes.PERMISSION_DENIED], 403);
  assert.strictEqual(errorHttpStatus[errorCodes.WORKSPACE_ACCESS_DENIED], 403);
  assert.strictEqual(errorHttpStatus[errorCodes.TENANT_CONTEXT_MISMATCH], 422);
  assert.strictEqual(errorHttpStatus[errorCodes.IDEMPOTENCY_CONFLICT], 409);
  assert.strictEqual(errorHttpStatus[errorCodes.INVALID_STATE_TRANSITION], 409);
});
