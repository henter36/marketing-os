-- Marketing OS V5.6.5 — Phase 0/1 Schema Patch 005
-- Purpose: Nashir RBAC and permission seed compatibility.
-- Authority: docs/nashir_sql_schema_implementation_planning_gate.md
-- Scope: No DDL changes required at this patch level.
--        The existing roles, permissions, and role_permissions tables in the base schema
--        already support Nashir permission codes. RBAC seeding is handled by
--        scripts/db-seed.js driving from src/rbac.js. No permission-row duplication needed.
-- Explicitly out of scope: routes/runtime, OpenAPI, generated clients, UI,
--        additional permission codes beyond the four approved Nashir codes
--        (nashir.campaign.read, nashir.campaign.write, nashir.evidence.submit,
--        nashir.approval.decide), Pilot, Production.

BEGIN;

-- RBAC seed compatibility note:
-- nashir.campaign.read, nashir.campaign.write, nashir.evidence.submit, and
-- nashir.approval.decide are seeded by db-seed.js from src/rbac.js.
-- The base schema roles/permissions/role_permissions schema is sufficient.
-- No additional schema-level DDL is required for Nashir RBAC seed compatibility.

COMMIT;

-- End of Patch 005
