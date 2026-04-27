-- 07 — Database Schema
-- Canonical wrapper for Marketing OS Phase 0/1 schema.
--
-- IMPORTANT:
-- This file intentionally points to the approved SQL files instead of duplicating them.
-- Apply schema files in this order:
--   1. docs/marketing_os_v5_6_5_phase_0_1_schema.sql
--   2. docs/marketing_os_v5_6_5_phase_0_1_schema_patch_001.sql
--
-- If your migration runner supports psql include syntax, use:

\i docs/marketing_os_v5_6_5_phase_0_1_schema.sql
\i docs/marketing_os_v5_6_5_phase_0_1_schema_patch_001.sql

-- If your migration runner does not support \i, configure it to execute both files in the same order.
-- Do not copy/paste schema content into this wrapper unless a migration tool requires a single physical SQL file.
-- Any business-rule change must be made through a new numbered patch, not by editing historical truth silently.
