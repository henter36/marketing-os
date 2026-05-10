"use strict";

const NASHIR_SLICE0_SCOPE = Object.freeze({
  name: "Nashir Backend Slice 0 planning contract skeleton",
  status: "inert_planning_contract",
  implementationReadiness: false,
  routeExposure: false,
  sqlRequired: false,
  openApiRequired: false,
  testsApproved: false,
  productionReadiness: false,
  pilotReadiness: false,
  importedByRuntime: false,
  mutatesGlobalState: false,
  performsIo: false,
  usesDatabase: false,
  definesRoutes: false,
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

const NASHIR_SLICE0_AUDIT_EVENTS = Object.freeze([
  "nashir.idempotency.conflict",
  "nashir.process.blocked"
]);

const NASHIR_SLICE0_ERROR_CODES = Object.freeze([
  "PERMISSION_DENIED",
  "WORKSPACE_ACCESS_DENIED",
  "TENANT_CONTEXT_MISMATCH",
  "NASHIR_IDEMPOTENCY_CONFLICT",
  "NASHIR_INVALID_STATE_TRANSITION"
]);

const NASHIR_SLICE0_READINESS_BOUNDARIES = Object.freeze({
  readinessIsApproval: false,
  evidenceIsPublishingAuthorization: false,
  utmLiteIsAnalyticsAttribution: false,
  aiMayPerformProtectedActions: false,
  publishingApproved: false,
  analyticsApproved: false,
  attributionApproved: false,
  paymentApproved: false,
  autonomousAiApproved: false,
  pilotApproved: false,
  productionApproved: false
});

function getNashirSlice0PlanningContract() {
  return Object.freeze({
    scope: NASHIR_SLICE0_SCOPE,
    allowedCapabilities: NASHIR_SLICE0_ALLOWED_CAPABILITIES,
    forbiddenCapabilities: NASHIR_SLICE0_FORBIDDEN_CAPABILITIES,
    auditEvents: NASHIR_SLICE0_AUDIT_EVENTS,
    errorCodes: NASHIR_SLICE0_ERROR_CODES,
    readinessBoundaries: NASHIR_SLICE0_READINESS_BOUNDARIES
  });
}

module.exports = {
  NASHIR_SLICE0_ALLOWED_CAPABILITIES,
  NASHIR_SLICE0_AUDIT_EVENTS,
  NASHIR_SLICE0_ERROR_CODES,
  NASHIR_SLICE0_FORBIDDEN_CAPABILITIES,
  NASHIR_SLICE0_READINESS_BOUNDARIES,
  NASHIR_SLICE0_SCOPE,
  getNashirSlice0PlanningContract
};
