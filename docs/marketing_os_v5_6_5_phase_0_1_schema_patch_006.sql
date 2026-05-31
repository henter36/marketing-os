-- Marketing OS V5.6.5 — Phase 0/1 Schema Patch 006
-- Purpose: Nashir store profiles, products, assets, data sources, and integration connection schema.
-- Authority: docs/nashir_sql_schema_implementation_planning_gate.md
-- Scope: Schema-only foundation for Nashir store/product/asset/data-source/integration entities.
-- Explicitly out of scope: routes/runtime, OpenAPI, generated clients, UI, AI provider
--        implementation, raw secret storage, external publishing, Pilot, Production.
-- Tenant isolation must be enforced by runtime using route-derived workspace context.
-- Product → Assets is 1:N via linked_product_id (no junction table unless separately approved).
-- vault_ref / secret_ref are external references only — no raw tokens or API keys.

BEGIN;

-- =========================================================
-- 1) ENUMS — PATCH 006 ONLY
-- =========================================================

DO $$ BEGIN CREATE TYPE nashir_store_profile_status AS ENUM ('active','suspended','archived'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE nashir_product_status AS ENUM ('draft','active','archived'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE nashir_asset_type AS ENUM ('image','video','copy','document','audio','other'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE nashir_asset_status AS ENUM ('active','archived'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE nashir_data_source_status AS ENUM ('active','disabled','archived'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE nashir_integration_connection_status AS ENUM ('active','disabled','revoked','archived'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- =========================================================
-- 2) NASHIR STORE PROFILES
-- =========================================================
-- One non-archived store profile per workspace enforced by partial unique index below.
-- store_profile_id is nullable on campaign tables; store_profile is not required.

CREATE TABLE IF NOT EXISTS nashir_store_profiles (
  store_profile_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(workspace_id),
  store_name varchar(255) NOT NULL,
  store_url text,
  store_profile_status nashir_store_profile_status NOT NULL DEFAULT 'active',
  created_by_user_id uuid NOT NULL REFERENCES users(user_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_nashir_store_profiles_id_workspace UNIQUE (store_profile_id, workspace_id),
  CONSTRAINT chk_nashir_store_profiles_name_not_empty CHECK (length(trim(store_name)) > 0)
);

-- Partial unique: only one non-archived store profile per workspace (active or suspended)
CREATE UNIQUE INDEX IF NOT EXISTS uq_nashir_store_profiles_active_per_workspace
  ON nashir_store_profiles(workspace_id)
  WHERE store_profile_status <> 'archived';

CREATE INDEX IF NOT EXISTS idx_nashir_store_profiles_workspace ON nashir_store_profiles(workspace_id);
CREATE INDEX IF NOT EXISTS idx_nashir_store_profiles_workspace_status ON nashir_store_profiles(workspace_id, store_profile_status);

-- =========================================================
-- 3) NASHIR PRODUCTS
-- =========================================================
-- Products belong to a store profile (and workspace).
-- store_profile_id is required for products (they have no meaning without a store).

CREATE TABLE IF NOT EXISTS nashir_products (
  product_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  store_profile_id uuid NOT NULL,
  product_name varchar(255) NOT NULL,
  product_description text,
  product_url text,
  product_status nashir_product_status NOT NULL DEFAULT 'active',
  created_by_user_id uuid NOT NULL REFERENCES users(user_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_nashir_products_store_profile_workspace FOREIGN KEY (store_profile_id, workspace_id) REFERENCES nashir_store_profiles(store_profile_id, workspace_id),
  CONSTRAINT uq_nashir_products_id_workspace UNIQUE (product_id, workspace_id),
  CONSTRAINT uq_nashir_products_id_store_workspace UNIQUE (product_id, store_profile_id, workspace_id),
  CONSTRAINT chk_nashir_products_name_not_empty CHECK (length(trim(product_name)) > 0)
);

CREATE INDEX IF NOT EXISTS idx_nashir_products_workspace ON nashir_products(workspace_id);
CREATE INDEX IF NOT EXISTS idx_nashir_products_store_profile ON nashir_products(store_profile_id);
CREATE INDEX IF NOT EXISTS idx_nashir_products_workspace_status ON nashir_products(workspace_id, product_status);

-- =========================================================
-- 4) NASHIR PRODUCT INTELLIGENCE SNAPSHOTS
-- =========================================================
-- Advisory intelligence snapshots for products (analysis, suggestions).
-- Append-only; no update trigger.

CREATE TABLE IF NOT EXISTS nashir_product_intelligence_snapshots (
  snapshot_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  product_id uuid NOT NULL,
  snapshot_payload jsonb NOT NULL,
  generated_source varchar(120) NOT NULL DEFAULT 'user',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_nashir_product_intelligence_product_workspace FOREIGN KEY (product_id, workspace_id) REFERENCES nashir_products(product_id, workspace_id),
  CONSTRAINT uq_nashir_product_intelligence_id_workspace UNIQUE (snapshot_id, workspace_id),
  CONSTRAINT chk_nashir_product_intelligence_source_not_empty CHECK (length(trim(generated_source)) > 0)
);

CREATE INDEX IF NOT EXISTS idx_nashir_product_intelligence_workspace ON nashir_product_intelligence_snapshots(workspace_id);
CREATE INDEX IF NOT EXISTS idx_nashir_product_intelligence_product ON nashir_product_intelligence_snapshots(product_id);
CREATE INDEX IF NOT EXISTS idx_nashir_product_intelligence_created ON nashir_product_intelligence_snapshots(product_id, created_at);

-- =========================================================
-- 5) NASHIR DATA SOURCES
-- =========================================================
-- Metadata-only data source registry; no ingestion or analytics.

CREATE TABLE IF NOT EXISTS nashir_data_sources (
  data_source_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(workspace_id),
  store_profile_id uuid,
  source_name varchar(255) NOT NULL,
  source_type varchar(120) NOT NULL,
  data_source_status nashir_data_source_status NOT NULL DEFAULT 'active',
  source_config jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by_user_id uuid NOT NULL REFERENCES users(user_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_nashir_data_sources_id_workspace UNIQUE (data_source_id, workspace_id),
  CONSTRAINT chk_nashir_data_sources_name_not_empty CHECK (length(trim(source_name)) > 0),
  CONSTRAINT chk_nashir_data_sources_type_not_empty CHECK (length(trim(source_type)) > 0)
);

CREATE INDEX IF NOT EXISTS idx_nashir_data_sources_workspace ON nashir_data_sources(workspace_id);
CREATE INDEX IF NOT EXISTS idx_nashir_data_sources_workspace_status ON nashir_data_sources(workspace_id, data_source_status);

-- Workspace-scoped FK for optional store profile association (nullable; only enforced when non-NULL)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'nashir_data_sources'
      AND constraint_name = 'fk_nashir_data_sources_store_profile_workspace'
  ) THEN
    ALTER TABLE nashir_data_sources
      ADD CONSTRAINT fk_nashir_data_sources_store_profile_workspace
      FOREIGN KEY (store_profile_id, workspace_id)
      REFERENCES nashir_store_profiles(store_profile_id, workspace_id);
  END IF;
END $$;

-- =========================================================
-- 6) NASHIR INTEGRATION CONNECTIONS
-- =========================================================
-- vault_ref / secret_ref are external secret manager references only.
-- No raw API keys, tokens, passwords, or credentials stored in this table.
-- Admin/owner visibility governed by RBAC; no public exposure of vault_ref.

CREATE TABLE IF NOT EXISTS nashir_integration_connections (
  connection_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(workspace_id),
  store_profile_id uuid,
  connection_name varchar(255) NOT NULL,
  provider_key varchar(120) NOT NULL,
  connection_status nashir_integration_connection_status NOT NULL DEFAULT 'active',
  vault_ref varchar(500),
  secret_ref varchar(500),
  config_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by_user_id uuid NOT NULL REFERENCES users(user_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_nashir_integration_connections_id_workspace UNIQUE (connection_id, workspace_id),
  CONSTRAINT chk_nashir_integration_connections_name_not_empty CHECK (length(trim(connection_name)) > 0),
  CONSTRAINT chk_nashir_integration_connections_provider_not_empty CHECK (length(trim(provider_key)) > 0)
);

CREATE INDEX IF NOT EXISTS idx_nashir_integration_connections_workspace ON nashir_integration_connections(workspace_id);
CREATE INDEX IF NOT EXISTS idx_nashir_integration_connections_workspace_status ON nashir_integration_connections(workspace_id, connection_status);

-- Workspace-scoped FK for optional store profile association (nullable; only enforced when non-NULL)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'nashir_integration_connections'
      AND constraint_name = 'fk_nashir_integration_connections_store_profile_workspace'
  ) THEN
    ALTER TABLE nashir_integration_connections
      ADD CONSTRAINT fk_nashir_integration_connections_store_profile_workspace
      FOREIGN KEY (store_profile_id, workspace_id)
      REFERENCES nashir_store_profiles(store_profile_id, workspace_id);
  END IF;
END $$;

-- =========================================================
-- 7) NASHIR ASSETS
-- =========================================================
-- Assets linked 1:N from products via linked_product_id (nullable).
-- No typed-array FK associations; all product-to-asset links use a proper FK column.

CREATE TABLE IF NOT EXISTS nashir_assets (
  asset_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(workspace_id),
  asset_type nashir_asset_type NOT NULL,
  asset_name varchar(255) NOT NULL,
  asset_url text,
  storage_ref text,
  linked_product_id uuid,
  asset_status nashir_asset_status NOT NULL DEFAULT 'active',
  created_by_user_id uuid NOT NULL REFERENCES users(user_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_nashir_assets_id_workspace UNIQUE (asset_id, workspace_id),
  CONSTRAINT chk_nashir_assets_name_not_empty CHECK (length(trim(asset_name)) > 0)
);

CREATE INDEX IF NOT EXISTS idx_nashir_assets_workspace ON nashir_assets(workspace_id);
CREATE INDEX IF NOT EXISTS idx_nashir_assets_workspace_type ON nashir_assets(workspace_id, asset_type);
CREATE INDEX IF NOT EXISTS idx_nashir_assets_workspace_status ON nashir_assets(workspace_id, asset_status);
CREATE INDEX IF NOT EXISTS idx_nashir_assets_linked_product ON nashir_assets(linked_product_id) WHERE linked_product_id IS NOT NULL;

-- FK: linked_product_id → nashir_products (workspace-scoped, nullable 1:N)
-- Added after the products table is established above. Guarded for idempotency.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'nashir_assets'
      AND constraint_name = 'fk_nashir_assets_product_workspace'
  ) THEN
    ALTER TABLE nashir_assets
      ADD CONSTRAINT fk_nashir_assets_product_workspace
      FOREIGN KEY (linked_product_id, workspace_id)
      REFERENCES nashir_products(product_id, workspace_id);
  END IF;
END $$;

-- =========================================================
-- 8) ADD store_profile_id TO nashir_campaigns (nullable)
-- =========================================================
-- Adds optional store profile association to existing Nashir campaign records.
-- store_profile_id is nullable; campaigns do not require a store profile.

ALTER TABLE nashir_campaigns
  ADD COLUMN IF NOT EXISTS store_profile_id uuid;

-- Only add the FK if it doesn't already exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'nashir_campaigns'
      AND constraint_name = 'fk_nashir_campaigns_store_profile_workspace'
  ) THEN
    ALTER TABLE nashir_campaigns
      ADD CONSTRAINT fk_nashir_campaigns_store_profile_workspace
      FOREIGN KEY (store_profile_id, workspace_id)
      REFERENCES nashir_store_profiles(store_profile_id, workspace_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_nashir_campaigns_store_profile
  ON nashir_campaigns(store_profile_id) WHERE store_profile_id IS NOT NULL;

COMMIT;

-- End of Patch 006
