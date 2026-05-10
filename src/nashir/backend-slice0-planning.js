"use strict";

const NASHIR_SLICE0_SCOPE = Object.freeze({
  name: "Nashir Backend Slice 0 planning contract skeleton",
  status: "inert_planning_contract"
});

const NASHIR_SLICE0_BOUNDARIES = Object.freeze({
  routeExposure: false,
  sqlRequired: false,
  openApiRequired: false,
  testsApproved: false,
  pilotReadiness: false,
  productionReadiness: false,
  runtimeWiring: false,
  mutatesGlobalState: false,
  performsIo: false,
  usesExternalPackages: false
});

const NASHIR_SLICE0_ALLOWED_CAPABILITIES = Object.freeze([
  "planning_contract_constants",
  "backend_scope_alignment_metadata",
  "audit_event_candidate_names",
  "errormodel_candidate_codes",
  "readiness_boundary_metadata"
]);

const NASHIR_SLICE0_FORBIDDEN_CAPABILITIES = Object.freeze([
  "route_exposure",
  "server_wiring",
  "database_or_storage_access",
  "sql_or_schema_changes",
  "openapi_changes",
  "generated_client_changes",
  "executable_tests",
  "prototype_or_ui_usage",
  "publishing",
  "analytics_ingestion",
  "attribution",
  "payment_or_billing",
  "autonomous_ai",
  "pilot_readiness",
  "production_readiness"
]);

const NASHIR_SLICE0_AUDIT_EVENTS = Object.freeze({
  IDEMPOTENCY_CONFLICT: "nashir.idempotency.conflict",
  PROCESS_BLOCKED: "nashir.process.blocked"
});

const NASHIR_SLICE0_ERROR_CODES = Object.freeze({
  PERMISSION_DENIED: "PERMISSION_DENIED",
  WORKSPACE_ACCESS_DENIED: "WORKSPACE_ACCESS_DENIED",
  TENANT_CONTEXT_MISMATCH: "TENANT_CONTEXT_MISMATCH",
  IDEMPOTENCY_CONFLICT: "NASHIR_IDEMPOTENCY_CONFLICT",
  INVALID_STATE_TRANSITION: "NASHIR_INVALID_STATE_TRANSITION"
});

const NASHIR_SLICE0_ERROR_HTTP_STATUS = Object.freeze({
  [NASHIR_SLICE0_ERROR_CODES.PERMISSION_DENIED]: 403,
  [NASHIR_SLICE0_ERROR_CODES.WORKSPACE_ACCESS_DENIED]: 403,
  [NASHIR_SLICE0_ERROR_CODES.TENANT_CONTEXT_MISMATCH]: 422,
  [NASHIR_SLICE0_ERROR_CODES.IDEMPOTENCY_CONFLICT]: 409,
  [NASHIR_SLICE0_ERROR_CODES.INVALID_STATE_TRANSITION]: 409
});

const NASHIR_SLICE0_READINESS_RULES = Object.freeze({
  readinessIsApproval: false,
  evidenceIsPublishingAuthorization: false,
  utmLiteIsAnalyticsAttribution: false,
  aiMayPerformProtectedActions: false
});

const NASHIR_SLICE0_PLANNING_CONTRACT = Object.freeze({
  scope: NASHIR_SLICE0_SCOPE,
  boundaries: NASHIR_SLICE0_BOUNDARIES,
  allowedCapabilities: NASHIR_SLICE0_ALLOWED_CAPABILITIES,
  forbiddenCapabilities: NASHIR_SLICE0_FORBIDDEN_CAPABILITIES,
  auditEvents: NASHIR_SLICE0_AUDIT_EVENTS,
  errorCodes: NASHIR_SLICE0_ERROR_CODES,
  errorHttpStatus: NASHIR_SLICE0_ERROR_HTTP_STATUS,
  readinessRules: NASHIR_SLICE0_READINESS_RULES
});

/**
 * Return the inert Nashir Slice 0 planning contract.
 */
function getNashirSlice0PlanningContract() {
  return NASHIR_SLICE0_PLANNING_CONTRACT;
}

module.exports = {
  NASHIR_SLICE0_PLANNING_CONTRACT,
  getNashirSlice0PlanningContract
};
