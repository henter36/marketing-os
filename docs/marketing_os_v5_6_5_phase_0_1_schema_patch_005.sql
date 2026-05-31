-- Marketing OS V5.6.5 — Phase 0/1 Schema Patch 005
-- Purpose: Nashir RBAC and permission seed compatibility.
-- Authority: docs/nashir_sql_schema_implementation_planning_gate.md
-- Scope: No DDL changes required at this patch level.
--        The existing roles, permissions, and role_permissions tables in the base schema
--        already support Nashir permission codes. RBAC seeding is handled by
--        scripts/db-seed.js driving from src/rbac.js. No permission-row duplication needed.
-- Explicitly out of scope: routes/runtime, OpenAPI, generated clients, UI,
--        unapproved Nashir permission codes, deferred Post-V1 integration permissions
--        (nashir.integration.*), destination service actors, Pilot, Production.

BEGIN;

-- RBAC seed compatibility note:
-- The active V1 Nashir-specific RBAC surface is seeded by db-seed.js from src/rbac.js.
-- This slice activates 28 V1 nashir.* permission codes.
-- Reused non-nashir permissions remain outside the nashir.* count.
-- Deferred nashir.integration.* permissions remain Post-V1 and must not be seeded here.
-- The base schema roles/permissions/role_permissions schema is sufficient.
-- No additional schema-level DDL is required for Nashir RBAC seed compatibility.

COMMIT;

-- End of Patch 005
