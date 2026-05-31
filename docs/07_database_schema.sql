-- 07 — Database Schema
-- Canonical wrapper for Marketing OS Phase 0/1 schema.
--
-- IMPORTANT:
-- This file intentionally points to the approved SQL files instead of duplicating them.
-- Apply schema files in this order:
--   1. docs/marketing_os_v5_6_5_phase_0_1_schema.sql
--   2. docs/marketing_os_v5_6_5_phase_0_1_schema_patch_001.sql
--   3. docs/marketing_os_v5_6_5_phase_0_1_schema_patch_002.sql
--   4. docs/marketing_os_v5_6_5_phase_0_1_schema_patch_003.sql
--   5. docs/marketing_os_v5_6_5_phase_0_1_schema_patch_004.sql
--   6. docs/marketing_os_v5_6_5_phase_0_1_schema_patch_005.sql
--   7. docs/marketing_os_v5_6_5_phase_0_1_schema_patch_006.sql
--   8. docs/marketing_os_v5_6_5_phase_0_1_schema_patch_007.sql
--   9. docs/marketing_os_v5_6_5_phase_0_1_schema_patch_008.sql
--  10. docs/marketing_os_v5_6_5_phase_0_1_schema_patch_009.sql
--  11. docs/marketing_os_v5_6_5_phase_0_1_schema_patch_010.sql
--  12. docs/marketing_os_v5_6_5_phase_0_1_schema_patch_011.sql
--
-- Patch 003 adds Nashir evidence lifecycle persistence tables only:
-- nashir_evidence and nashir_evidence_lifecycle_events.
-- It does not implement runtime routes, OpenAPI, RBAC, generated clients, approval, publishing, Sprint 5, Pilot, or Production readiness.
--
-- Patch 004 adds the Nashir campaign persistence table only:
-- nashir_campaigns.
-- It does not implement runtime routes, repositories, campaign runtime mode, OpenAPI, generated clients, UI, approval, publishing, readiness scoring, campaign update/delete routes, MVP, Pilot, or Production readiness.
--
-- Patch 005 confirms RBAC/permission seed compatibility. No DDL changes (base schema covers roles/permissions).
--
-- Patch 006 adds Nashir store profiles, products, product intelligence snapshots, data sources,
-- integration connections (vault_ref/secret_ref only), assets, and a nullable store_profile_id
-- on nashir_campaigns. Schema-only; no routes, runtime, or external publishing.
--
-- Patch 007 adds Nashir campaign content items, content-asset composite-PK junction table,
-- preview artifacts, and content review decisions. Schema-only; no automatic publishing.
--
-- Patch 008 adds Nashir publishing queue items referencing approved content.
-- Schema-only; no external platform publishing implementation.
--
-- Patch 009 adds Nashir prompt templates and prompt governance versions with partial unique index
-- on (prompt_template_id, version_number) for non-archived/deprecated versions.
-- Must be applied before Patch 010 (Creator Studio FK references).
--
-- Patch 010 adds Nashir Creator Studio TTL entities: sessions, content ideas, campaign angles,
-- audience segments, publish windows, context drafts, transfer drafts, and readiness assessments.
-- All TTL entities have expires_at. No partial index predicates using expires_at > now().
--
-- Patch 011 adds Nashir model routing rules, AI provider registry (metadata only, no API keys),
-- and cost usage records. Schema-only; no provider calls or runtime routing.
--
-- Patch 012 is deferred: advisory workflow definitions are not in scope for V1 schema.
--
-- If your migration runner supports psql include syntax, use:

\i docs/marketing_os_v5_6_5_phase_0_1_schema.sql
\i docs/marketing_os_v5_6_5_phase_0_1_schema_patch_001.sql
\i docs/marketing_os_v5_6_5_phase_0_1_schema_patch_002.sql
\i docs/marketing_os_v5_6_5_phase_0_1_schema_patch_003.sql
\i docs/marketing_os_v5_6_5_phase_0_1_schema_patch_004.sql
\i docs/marketing_os_v5_6_5_phase_0_1_schema_patch_005.sql
\i docs/marketing_os_v5_6_5_phase_0_1_schema_patch_006.sql
\i docs/marketing_os_v5_6_5_phase_0_1_schema_patch_007.sql
\i docs/marketing_os_v5_6_5_phase_0_1_schema_patch_008.sql
\i docs/marketing_os_v5_6_5_phase_0_1_schema_patch_009.sql
\i docs/marketing_os_v5_6_5_phase_0_1_schema_patch_010.sql
\i docs/marketing_os_v5_6_5_phase_0_1_schema_patch_011.sql

-- If your migration runner does not support \i, configure it to execute all files in the same order.
-- Do not copy/paste schema content into this wrapper unless a migration tool requires a single physical SQL file.
-- Any business-rule change must be made through a new numbered patch, not by editing historical truth silently.
