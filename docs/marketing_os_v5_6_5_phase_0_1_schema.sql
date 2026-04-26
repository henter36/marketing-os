-- Marketing OS V5.6.5 — Phase 0/1 PostgreSQL DDL
-- Source authority: Section 52 only
-- Purpose: Execution schema for ERD-to-SQL conversion review
-- Build status: NOT a direct production deployment script before OpenAPI, Backlog, QA Matrix, and infra decisions are approved.

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =========================================================
-- 1) ENUMS
-- =========================================================

DO $$ BEGIN CREATE TYPE account_status AS ENUM ('active','suspended','closed'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE workspace_status AS ENUM ('active','suspended','archived'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE user_status AS ENUM ('invited','active','disabled'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE role_scope AS ENUM ('system','workspace'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE member_status AS ENUM ('invited','active','disabled','removed'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE plan_status AS ENUM ('draft','active','retired'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE billing_interval AS ENUM ('monthly','yearly'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE subscription_status AS ENUM ('trialing','active','past_due','canceled','expired'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE subscription_snapshot_reason AS ENUM ('created','renewed','changed','canceled','period_closed','manual_correction'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE campaign_status AS ENUM ('draft','active','paused','completed','archived'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE brief_status AS ENUM ('draft','locked','superseded'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE template_type AS ENUM ('caption','ad_copy','image_prompt','video_script','report','reply'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE template_status AS ENUM ('draft','active','retired'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE media_job_type AS ENUM ('text','image','video','image_enhancement','variant','report_asset'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE media_job_status AS ENUM ('queued','running','succeeded','failed','canceled'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE cost_check_result AS ENUM ('approved','rejected','requires_review'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE media_asset_type AS ENUM ('text','image','video','mixed','report'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE media_asset_status AS ENUM ('draft','in_review','approved','rejected','archived'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE media_asset_version_status AS ENUM ('draft','in_review','approved','rejected','superseded','archived'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE creative_package_status AS ENUM ('draft','ready','archived'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE review_status AS ENUM ('open','in_review','completed','canceled'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE review_type AS ENUM ('brand','legal','quality','final'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE approval_decision AS ENUM ('approved','rejected','changes_requested'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE publish_status AS ENUM ('draft','ready','submitted','published','failed','canceled'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE evidence_status AS ENUM ('valid','superseded','invalidated'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE link_status AS ENUM ('active','disabled','expired'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE brand_status AS ENUM ('draft','active','archived'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE brand_rule_type AS ENUM ('tone','banned_claim','required_phrase','style','legal','locale'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE severity AS ENUM ('info','warning','critical'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE rule_severity AS ENUM ('info','warning','blocker'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE rule_status AS ENUM ('active','disabled'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE report_template_status AS ENUM ('draft','active','retired'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE cost_event_status AS ENUM ('estimated','actual','reversed'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE cost_budget_status AS ENUM ('active','paused','expired'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE cost_guardrail_type AS ENUM ('daily','monthly','per_job','per_campaign'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE cost_guardrail_action AS ENUM ('warn','block','require_review'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE cost_guardrail_status AS ENUM ('active','disabled'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE media_cost_policy_status AS ENUM ('draft','active','retired'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE safe_mode_status AS ENUM ('inactive','active'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE onboarding_status AS ENUM ('not_started','in_progress','completed','skipped'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE setup_item_status AS ENUM ('pending','completed','skipped','blocked'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- =========================================================
-- 2) COMMON FUNCTIONS
-- =========================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION prevent_column_update()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  col text;
BEGIN
  FOREACH col IN ARRAY TG_ARGV LOOP
    IF (to_jsonb(OLD)->col) IS DISTINCT FROM (to_jsonb(NEW)->col) THEN
      RAISE EXCEPTION 'Immutable column %.% cannot be updated', TG_TABLE_NAME, col;
    END IF;
  END LOOP;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION prevent_update_delete()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'Table % is append-only; UPDATE/DELETE is not allowed', TG_TABLE_NAME;
END;
$$;

CREATE OR REPLACE FUNCTION app_current_workspace_id()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT NULLIF(current_setting('app.current_workspace_id', true), '')::uuid;
$$;

-- =========================================================
-- 3) IDENTITY / TENANT / RBAC
-- =========================================================

CREATE TABLE IF NOT EXISTS customer_accounts (
  customer_account_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_name varchar(255) NOT NULL,
  legal_name varchar(255),
  billing_email varchar(320) NOT NULL,
  account_status account_status NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_customer_accounts_billing_email UNIQUE (billing_email)
);

CREATE INDEX IF NOT EXISTS idx_customer_accounts_status ON customer_accounts(account_status);

CREATE TABLE IF NOT EXISTS users (
  user_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email varchar(320) NOT NULL,
  full_name varchar(255) NOT NULL,
  user_status user_status NOT NULL DEFAULT 'invited',
  last_login_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_users_email UNIQUE (email)
);

CREATE INDEX IF NOT EXISTS idx_users_status ON users(user_status);

CREATE TABLE IF NOT EXISTS roles (
  role_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_code varchar(100) NOT NULL,
  role_name varchar(255) NOT NULL,
  role_scope role_scope NOT NULL,
  is_system_role boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_roles_code UNIQUE (role_code)
);

CREATE INDEX IF NOT EXISTS idx_roles_scope ON roles(role_scope);

CREATE TABLE IF NOT EXISTS permissions (
  permission_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  permission_code varchar(150) NOT NULL,
  permission_name varchar(255) NOT NULL,
  domain varchar(100) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_permissions_code UNIQUE (permission_code)
);

CREATE INDEX IF NOT EXISTS idx_permissions_domain ON permissions(domain);

CREATE TABLE IF NOT EXISTS workspaces (
  workspace_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_account_id uuid NOT NULL REFERENCES customer_accounts(customer_account_id),
  workspace_name varchar(255) NOT NULL,
  workspace_slug varchar(160) NOT NULL,
  workspace_status workspace_status NOT NULL DEFAULT 'active',
  default_locale varchar(20) NOT NULL DEFAULT 'en',
  timezone varchar(80) NOT NULL DEFAULT 'UTC',
  created_by_user_id uuid NOT NULL REFERENCES users(user_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_workspace_slug_per_customer UNIQUE (customer_account_id, workspace_slug),
  CONSTRAINT uq_workspaces_id_customer UNIQUE (workspace_id, customer_account_id)
);

CREATE INDEX IF NOT EXISTS idx_workspaces_customer_account ON workspaces(customer_account_id);
CREATE INDEX IF NOT EXISTS idx_workspaces_status ON workspaces(workspace_status);

CREATE TABLE IF NOT EXISTS role_permissions (
  role_permission_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id uuid NOT NULL REFERENCES roles(role_id),
  permission_id uuid NOT NULL REFERENCES permissions(permission_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_role_permissions_role_permission UNIQUE (role_id, permission_id)
);

CREATE INDEX IF NOT EXISTS idx_role_permissions_role ON role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission ON role_permissions(permission_id);

CREATE TABLE IF NOT EXISTS workspace_members (
  workspace_member_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(workspace_id),
  user_id uuid NOT NULL REFERENCES users(user_id),
  role_id uuid NOT NULL REFERENCES roles(role_id),
  member_status member_status NOT NULL DEFAULT 'invited',
  invited_by_user_id uuid REFERENCES users(user_id),
  joined_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_workspace_members_workspace_user UNIQUE (workspace_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_workspace_members_workspace ON workspace_members(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_user ON workspace_members(user_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_role ON workspace_members(role_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_status ON workspace_members(workspace_id, member_status);

-- =========================================================
-- 4) COMMERCIAL SUBSCRIPTION
-- =========================================================

CREATE TABLE IF NOT EXISTS subscription_plans (
  subscription_plan_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_code varchar(100) NOT NULL,
  plan_name varchar(255) NOT NULL,
  plan_status plan_status NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_subscription_plans_code UNIQUE (plan_code)
);

CREATE TABLE IF NOT EXISTS subscription_plan_versions (
  subscription_plan_version_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_plan_id uuid NOT NULL REFERENCES subscription_plans(subscription_plan_id),
  version_number integer NOT NULL,
  status plan_status NOT NULL DEFAULT 'draft',
  price_amount numeric(18,6) NOT NULL CHECK (price_amount >= 0),
  currency char(3) NOT NULL,
  billing_interval billing_interval NOT NULL,
  effective_from timestamptz NOT NULL,
  effective_to timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_subscription_plan_versions_plan_version UNIQUE (subscription_plan_id, version_number)
);

CREATE INDEX IF NOT EXISTS idx_plan_versions_plan ON subscription_plan_versions(subscription_plan_id);
CREATE INDEX IF NOT EXISTS idx_plan_versions_active ON subscription_plan_versions(subscription_plan_id, status);

CREATE TABLE IF NOT EXISTS plan_entitlement_versions (
  plan_entitlement_version_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_plan_version_id uuid NOT NULL REFERENCES subscription_plan_versions(subscription_plan_version_id),
  entitlement_code varchar(150) NOT NULL,
  entitlement_value jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_plan_entitlement_versions_code UNIQUE (subscription_plan_version_id, entitlement_code)
);

CREATE INDEX IF NOT EXISTS idx_entitlements_plan_version ON plan_entitlement_versions(subscription_plan_version_id);
CREATE INDEX IF NOT EXISTS idx_entitlements_code ON plan_entitlement_versions(entitlement_code);

CREATE TABLE IF NOT EXISTS customer_subscriptions (
  customer_subscription_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_account_id uuid NOT NULL REFERENCES customer_accounts(customer_account_id),
  subscription_plan_version_id uuid NOT NULL REFERENCES subscription_plan_versions(subscription_plan_version_id),
  subscription_status subscription_status NOT NULL,
  started_at timestamptz NOT NULL,
  current_period_start timestamptz NOT NULL,
  current_period_end timestamptz NOT NULL,
  canceled_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_customer_subscriptions_period CHECK (current_period_end > current_period_start)
);

CREATE INDEX IF NOT EXISTS idx_customer_subscriptions_customer ON customer_subscriptions(customer_account_id);
CREATE INDEX IF NOT EXISTS idx_customer_subscriptions_status ON customer_subscriptions(customer_account_id, subscription_status);
CREATE INDEX IF NOT EXISTS idx_customer_subscriptions_period ON customer_subscriptions(customer_account_id, current_period_start, current_period_end);

CREATE TABLE IF NOT EXISTS customer_subscription_snapshots (
  customer_subscription_snapshot_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_subscription_id uuid NOT NULL REFERENCES customer_subscriptions(customer_subscription_id),
  customer_account_id uuid NOT NULL REFERENCES customer_accounts(customer_account_id),
  subscription_plan_version_id uuid NOT NULL REFERENCES subscription_plan_versions(subscription_plan_version_id),
  snapshot_reason subscription_snapshot_reason NOT NULL,
  plan_snapshot jsonb NOT NULL,
  entitlement_snapshot jsonb NOT NULL,
  billing_period_snapshot jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_subscription_snapshots_subscription ON customer_subscription_snapshots(customer_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscription_snapshots_customer ON customer_subscription_snapshots(customer_account_id);
CREATE INDEX IF NOT EXISTS idx_subscription_snapshots_created ON customer_subscription_snapshots(created_at);

-- =========================================================
-- 5) BRAND / TEMPLATE / SETTINGS PRE-REQUISITES
-- =========================================================

CREATE TABLE IF NOT EXISTS brand_profiles (
  brand_profile_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(workspace_id),
  profile_name varchar(255) NOT NULL,
  brand_summary text,
  language varchar(20) NOT NULL,
  tone varchar(100),
  brand_status brand_status NOT NULL DEFAULT 'draft',
  created_by_user_id uuid NOT NULL REFERENCES users(user_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_brand_profiles_workspace_name UNIQUE (workspace_id, profile_name),
  CONSTRAINT uq_brand_profiles_id_workspace UNIQUE (brand_profile_id, workspace_id)
);

CREATE INDEX IF NOT EXISTS idx_brand_profiles_workspace ON brand_profiles(workspace_id);
CREATE INDEX IF NOT EXISTS idx_brand_profiles_status ON brand_profiles(workspace_id, brand_status);

CREATE TABLE IF NOT EXISTS brand_voice_rules (
  brand_voice_rule_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_profile_id uuid NOT NULL,
  workspace_id uuid NOT NULL,
  rule_type brand_rule_type NOT NULL,
  rule_text text NOT NULL,
  severity rule_severity NOT NULL DEFAULT 'warning',
  rule_status rule_status NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_brand_voice_rules_profile_workspace FOREIGN KEY (brand_profile_id, workspace_id) REFERENCES brand_profiles(brand_profile_id, workspace_id)
);

CREATE INDEX IF NOT EXISTS idx_brand_voice_rules_profile ON brand_voice_rules(brand_profile_id);
CREATE INDEX IF NOT EXISTS idx_brand_voice_rules_workspace ON brand_voice_rules(workspace_id);
CREATE INDEX IF NOT EXISTS idx_brand_voice_rules_type ON brand_voice_rules(workspace_id, rule_type);

CREATE TABLE IF NOT EXISTS prompt_templates (
  prompt_template_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(workspace_id),
  template_name varchar(255) NOT NULL,
  template_type template_type NOT NULL,
  template_body text NOT NULL,
  template_variables jsonb NOT NULL DEFAULT '{}'::jsonb,
  template_status template_status NOT NULL DEFAULT 'draft',
  version_number integer NOT NULL,
  created_by_user_id uuid NOT NULL REFERENCES users(user_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_prompt_templates_name_version UNIQUE (workspace_id, template_name, version_number),
  CONSTRAINT uq_prompt_templates_id_workspace UNIQUE (prompt_template_id, workspace_id)
);

CREATE INDEX IF NOT EXISTS idx_prompt_templates_workspace ON prompt_templates(workspace_id);
CREATE INDEX IF NOT EXISTS idx_prompt_templates_type ON prompt_templates(workspace_id, template_type);
CREATE INDEX IF NOT EXISTS idx_prompt_templates_status ON prompt_templates(workspace_id, template_status);

CREATE TABLE IF NOT EXISTS report_templates (
  report_template_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(workspace_id),
  template_name varchar(255) NOT NULL,
  template_body jsonb NOT NULL,
  template_status report_template_status NOT NULL DEFAULT 'draft',
  created_by_user_id uuid NOT NULL REFERENCES users(user_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_report_templates_workspace_name UNIQUE (workspace_id, template_name),
  CONSTRAINT uq_report_templates_id_workspace UNIQUE (report_template_id, workspace_id)
);

CREATE INDEX IF NOT EXISTS idx_report_templates_workspace ON report_templates(workspace_id);
CREATE INDEX IF NOT EXISTS idx_report_templates_status ON report_templates(workspace_id, template_status);

CREATE TABLE IF NOT EXISTS media_cost_policies (
  media_cost_policy_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  customer_account_id uuid NOT NULL,
  policy_name varchar(255) NOT NULL,
  policy_rules jsonb NOT NULL,
  policy_status media_cost_policy_status NOT NULL DEFAULT 'draft',
  effective_from timestamptz NOT NULL,
  effective_to timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_media_cost_policies_workspace_customer FOREIGN KEY (workspace_id, customer_account_id) REFERENCES workspaces(workspace_id, customer_account_id),
  CONSTRAINT uq_media_cost_policies_id_workspace_customer UNIQUE (media_cost_policy_id, workspace_id, customer_account_id)
);

CREATE INDEX IF NOT EXISTS idx_media_cost_policies_workspace ON media_cost_policies(workspace_id);
CREATE INDEX IF NOT EXISTS idx_media_cost_policies_status ON media_cost_policies(workspace_id, policy_status);
CREATE INDEX IF NOT EXISTS idx_media_cost_policies_effective ON media_cost_policies(workspace_id, effective_from, effective_to);

-- =========================================================
-- 6) CAMPAIGN / CREATIVE PRODUCTION
-- =========================================================

CREATE TABLE IF NOT EXISTS campaigns (
  campaign_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  customer_account_id uuid NOT NULL,
  campaign_name varchar(255) NOT NULL,
  campaign_objective varchar(255) NOT NULL,
  campaign_status campaign_status NOT NULL DEFAULT 'draft',
  created_by_user_id uuid NOT NULL REFERENCES users(user_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_campaigns_workspace_customer FOREIGN KEY (workspace_id, customer_account_id) REFERENCES workspaces(workspace_id, customer_account_id),
  CONSTRAINT uq_campaigns_id_workspace UNIQUE (campaign_id, workspace_id),
  CONSTRAINT uq_campaigns_id_workspace_customer UNIQUE (campaign_id, workspace_id, customer_account_id)
);

CREATE INDEX IF NOT EXISTS idx_campaigns_workspace ON campaigns(workspace_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_customer ON campaigns(customer_account_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(workspace_id, campaign_status);
CREATE INDEX IF NOT EXISTS idx_campaigns_created ON campaigns(workspace_id, created_at);

CREATE TABLE IF NOT EXISTS campaign_state_transitions (
  campaign_state_transition_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  campaign_id uuid NOT NULL,
  from_status campaign_status,
  to_status campaign_status NOT NULL,
  reason text,
  changed_by_user_id uuid NOT NULL REFERENCES users(user_id),
  changed_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_campaign_transitions_campaign_workspace FOREIGN KEY (campaign_id, workspace_id) REFERENCES campaigns(campaign_id, workspace_id)
);

CREATE INDEX IF NOT EXISTS idx_campaign_transitions_campaign ON campaign_state_transitions(campaign_id, changed_at);
CREATE INDEX IF NOT EXISTS idx_campaign_transitions_workspace ON campaign_state_transitions(workspace_id, changed_at);

CREATE TABLE IF NOT EXISTS brief_versions (
  brief_version_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  campaign_id uuid NOT NULL,
  version_number integer NOT NULL,
  brief_title varchar(255) NOT NULL,
  brief_content jsonb NOT NULL,
  content_hash char(64) NOT NULL,
  status brief_status NOT NULL DEFAULT 'draft',
  created_by_user_id uuid NOT NULL REFERENCES users(user_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_brief_versions_campaign_workspace FOREIGN KEY (campaign_id, workspace_id) REFERENCES campaigns(campaign_id, workspace_id),
  CONSTRAINT uq_brief_versions_campaign_version UNIQUE (campaign_id, version_number),
  CONSTRAINT uq_brief_versions_hash UNIQUE (campaign_id, content_hash),
  CONSTRAINT uq_brief_versions_id_workspace UNIQUE (brief_version_id, workspace_id),
  CONSTRAINT uq_brief_versions_id_campaign_workspace UNIQUE (brief_version_id, campaign_id, workspace_id)
);

CREATE INDEX IF NOT EXISTS idx_brief_versions_campaign ON brief_versions(campaign_id);
CREATE INDEX IF NOT EXISTS idx_brief_versions_workspace ON brief_versions(workspace_id);

CREATE TABLE IF NOT EXISTS media_jobs (
  media_job_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  customer_account_id uuid NOT NULL,
  campaign_id uuid NOT NULL,
  brief_version_id uuid NOT NULL,
  prompt_template_id uuid NOT NULL,
  job_type media_job_type NOT NULL,
  job_status media_job_status NOT NULL DEFAULT 'queued',
  input_payload jsonb NOT NULL,
  requested_output_format varchar(100) NOT NULL,
  idempotency_key varchar(180) NOT NULL,
  requested_by_user_id uuid NOT NULL REFERENCES users(user_id),
  started_at timestamptz,
  completed_at timestamptz,
  failed_at timestamptz,
  failure_code varchar(120),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_media_jobs_campaign_workspace_customer FOREIGN KEY (campaign_id, workspace_id, customer_account_id) REFERENCES campaigns(campaign_id, workspace_id, customer_account_id),
  CONSTRAINT fk_media_jobs_brief_campaign_workspace FOREIGN KEY (brief_version_id, campaign_id, workspace_id) REFERENCES brief_versions(brief_version_id, campaign_id, workspace_id),
  CONSTRAINT fk_media_jobs_prompt_workspace FOREIGN KEY (prompt_template_id, workspace_id) REFERENCES prompt_templates(prompt_template_id, workspace_id),
  CONSTRAINT uq_media_jobs_idempotency UNIQUE (workspace_id, idempotency_key),
  CONSTRAINT uq_media_jobs_id_workspace UNIQUE (media_job_id, workspace_id),
  CONSTRAINT uq_media_jobs_id_workspace_customer UNIQUE (media_job_id, workspace_id, customer_account_id)
);

CREATE INDEX IF NOT EXISTS idx_media_jobs_workspace ON media_jobs(workspace_id);
CREATE INDEX IF NOT EXISTS idx_media_jobs_campaign ON media_jobs(campaign_id);
CREATE INDEX IF NOT EXISTS idx_media_jobs_brief_version ON media_jobs(brief_version_id);
CREATE INDEX IF NOT EXISTS idx_media_jobs_status ON media_jobs(workspace_id, job_status);
CREATE INDEX IF NOT EXISTS idx_media_jobs_created ON media_jobs(workspace_id, created_at);

CREATE TABLE IF NOT EXISTS media_cost_snapshots (
  media_cost_snapshot_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  customer_account_id uuid NOT NULL,
  media_job_id uuid NOT NULL,
  media_cost_policy_id uuid NOT NULL,
  estimated_cost_amount numeric(18,6) NOT NULL CHECK (estimated_cost_amount >= 0),
  estimated_cost_currency char(3) NOT NULL,
  quota_snapshot jsonb NOT NULL,
  policy_snapshot jsonb NOT NULL,
  cost_check_result cost_check_result NOT NULL,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_media_cost_snapshots_job UNIQUE (media_job_id),
  CONSTRAINT fk_media_cost_snapshots_job_workspace_customer FOREIGN KEY (media_job_id, workspace_id, customer_account_id) REFERENCES media_jobs(media_job_id, workspace_id, customer_account_id),
  CONSTRAINT fk_media_cost_snapshots_policy_workspace_customer FOREIGN KEY (media_cost_policy_id, workspace_id, customer_account_id) REFERENCES media_cost_policies(media_cost_policy_id, workspace_id, customer_account_id)
);

CREATE INDEX IF NOT EXISTS idx_media_cost_snapshots_workspace ON media_cost_snapshots(workspace_id);
CREATE INDEX IF NOT EXISTS idx_media_cost_snapshots_result ON media_cost_snapshots(workspace_id, cost_check_result);

CREATE TABLE IF NOT EXISTS media_assets (
  media_asset_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  customer_account_id uuid NOT NULL,
  media_job_id uuid NOT NULL,
  campaign_id uuid NOT NULL,
  asset_type media_asset_type NOT NULL,
  asset_status media_asset_status NOT NULL DEFAULT 'draft',
  created_by_user_id uuid NOT NULL REFERENCES users(user_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_media_assets_job_workspace_customer FOREIGN KEY (media_job_id, workspace_id, customer_account_id) REFERENCES media_jobs(media_job_id, workspace_id, customer_account_id),
  CONSTRAINT fk_media_assets_campaign_workspace_customer FOREIGN KEY (campaign_id, workspace_id, customer_account_id) REFERENCES campaigns(campaign_id, workspace_id, customer_account_id),
  CONSTRAINT uq_media_assets_id_workspace UNIQUE (media_asset_id, workspace_id),
  CONSTRAINT uq_media_assets_id_workspace_customer UNIQUE (media_asset_id, workspace_id, customer_account_id)
);

CREATE INDEX IF NOT EXISTS idx_media_assets_workspace ON media_assets(workspace_id);
CREATE INDEX IF NOT EXISTS idx_media_assets_campaign ON media_assets(campaign_id);
CREATE INDEX IF NOT EXISTS idx_media_assets_job ON media_assets(media_job_id);
CREATE INDEX IF NOT EXISTS idx_media_assets_status ON media_assets(workspace_id, asset_status);

CREATE TABLE IF NOT EXISTS media_asset_versions (
  media_asset_version_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  customer_account_id uuid NOT NULL,
  media_asset_id uuid NOT NULL,
  version_number integer NOT NULL,
  content_payload jsonb NOT NULL,
  content_hash char(64) NOT NULL,
  storage_ref text,
  version_status media_asset_version_status NOT NULL DEFAULT 'draft',
  created_by_user_id uuid NOT NULL REFERENCES users(user_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_asset_versions_asset_workspace_customer FOREIGN KEY (media_asset_id, workspace_id, customer_account_id) REFERENCES media_assets(media_asset_id, workspace_id, customer_account_id),
  CONSTRAINT uq_asset_versions_asset_version UNIQUE (media_asset_id, version_number),
  CONSTRAINT uq_asset_versions_asset_hash UNIQUE (media_asset_id, content_hash),
  CONSTRAINT uq_asset_versions_id_workspace UNIQUE (media_asset_version_id, workspace_id),
  CONSTRAINT uq_asset_versions_id_workspace_customer UNIQUE (media_asset_version_id, workspace_id, customer_account_id)
);

CREATE INDEX IF NOT EXISTS idx_asset_versions_workspace ON media_asset_versions(workspace_id);
CREATE INDEX IF NOT EXISTS idx_asset_versions_asset ON media_asset_versions(media_asset_id);
CREATE INDEX IF NOT EXISTS idx_asset_versions_status ON media_asset_versions(workspace_id, version_status);
CREATE INDEX IF NOT EXISTS idx_asset_versions_hash ON media_asset_versions(content_hash);

CREATE TABLE IF NOT EXISTS creative_packages (
  creative_package_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  campaign_id uuid NOT NULL,
  package_name varchar(255) NOT NULL,
  package_status creative_package_status NOT NULL DEFAULT 'draft',
  package_payload jsonb NOT NULL,
  created_by_user_id uuid NOT NULL REFERENCES users(user_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_creative_packages_campaign_workspace FOREIGN KEY (campaign_id, workspace_id) REFERENCES campaigns(campaign_id, workspace_id)
);

CREATE INDEX IF NOT EXISTS idx_creative_packages_workspace ON creative_packages(workspace_id);
CREATE INDEX IF NOT EXISTS idx_creative_packages_campaign ON creative_packages(campaign_id);
CREATE INDEX IF NOT EXISTS idx_creative_packages_status ON creative_packages(workspace_id, package_status);

-- =========================================================
-- 7) REVIEW / APPROVAL / PUBLISH
-- =========================================================

CREATE TABLE IF NOT EXISTS review_tasks (
  review_task_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  media_asset_version_id uuid NOT NULL,
  assigned_to_user_id uuid REFERENCES users(user_id),
  review_status review_status NOT NULL DEFAULT 'open',
  review_type review_type NOT NULL,
  due_at timestamptz,
  created_by_user_id uuid NOT NULL REFERENCES users(user_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_review_tasks_asset_version_workspace FOREIGN KEY (media_asset_version_id, workspace_id) REFERENCES media_asset_versions(media_asset_version_id, workspace_id),
  CONSTRAINT uq_review_tasks_id_workspace UNIQUE (review_task_id, workspace_id)
);

CREATE INDEX IF NOT EXISTS idx_review_tasks_workspace ON review_tasks(workspace_id);
CREATE INDEX IF NOT EXISTS idx_review_tasks_asset_version ON review_tasks(media_asset_version_id);
CREATE INDEX IF NOT EXISTS idx_review_tasks_assignee ON review_tasks(workspace_id, assigned_to_user_id);
CREATE INDEX IF NOT EXISTS idx_review_tasks_status ON review_tasks(workspace_id, review_status);

CREATE TABLE IF NOT EXISTS approval_decisions (
  approval_decision_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  review_task_id uuid NOT NULL,
  media_asset_version_id uuid NOT NULL,
  decision approval_decision NOT NULL,
  approved_content_hash char(64),
  decision_reason text,
  decided_by_user_id uuid NOT NULL REFERENCES users(user_id),
  decided_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_approval_decisions_review_task_workspace FOREIGN KEY (review_task_id, workspace_id) REFERENCES review_tasks(review_task_id, workspace_id),
  CONSTRAINT fk_approval_decisions_asset_version_workspace FOREIGN KEY (media_asset_version_id, workspace_id) REFERENCES media_asset_versions(media_asset_version_id, workspace_id),
  CONSTRAINT chk_approval_decisions_hash_required CHECK (decision <> 'approved' OR approved_content_hash IS NOT NULL),
  CONSTRAINT uq_approval_decisions_id_workspace UNIQUE (approval_decision_id, workspace_id)
);

CREATE INDEX IF NOT EXISTS idx_approval_decisions_workspace ON approval_decisions(workspace_id);
CREATE INDEX IF NOT EXISTS idx_approval_decisions_review_task ON approval_decisions(review_task_id);
CREATE INDEX IF NOT EXISTS idx_approval_decisions_asset_version ON approval_decisions(media_asset_version_id);
CREATE INDEX IF NOT EXISTS idx_approval_decisions_decision ON approval_decisions(workspace_id, decision);

CREATE TABLE IF NOT EXISTS publish_jobs (
  publish_job_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  customer_account_id uuid NOT NULL,
  approval_decision_id uuid NOT NULL,
  media_asset_version_id uuid NOT NULL,
  campaign_id uuid NOT NULL,
  channel varchar(80) NOT NULL,
  publish_status publish_status NOT NULL DEFAULT 'draft',
  scheduled_at timestamptz,
  published_at timestamptz,
  idempotency_key varchar(180) NOT NULL,
  created_by_user_id uuid NOT NULL REFERENCES users(user_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_publish_jobs_approval_workspace FOREIGN KEY (approval_decision_id, workspace_id) REFERENCES approval_decisions(approval_decision_id, workspace_id),
  CONSTRAINT fk_publish_jobs_asset_version_workspace_customer FOREIGN KEY (media_asset_version_id, workspace_id, customer_account_id) REFERENCES media_asset_versions(media_asset_version_id, workspace_id, customer_account_id),
  CONSTRAINT fk_publish_jobs_campaign_workspace_customer FOREIGN KEY (campaign_id, workspace_id, customer_account_id) REFERENCES campaigns(campaign_id, workspace_id, customer_account_id),
  CONSTRAINT uq_publish_jobs_idempotency UNIQUE (workspace_id, idempotency_key),
  CONSTRAINT uq_publish_jobs_id_workspace UNIQUE (publish_job_id, workspace_id)
);

CREATE INDEX IF NOT EXISTS idx_publish_jobs_workspace ON publish_jobs(workspace_id);
CREATE INDEX IF NOT EXISTS idx_publish_jobs_campaign ON publish_jobs(campaign_id);
CREATE INDEX IF NOT EXISTS idx_publish_jobs_status ON publish_jobs(workspace_id, publish_status);
CREATE INDEX IF NOT EXISTS idx_publish_jobs_approval ON publish_jobs(approval_decision_id);

CREATE TABLE IF NOT EXISTS manual_publish_evidence (
  manual_publish_evidence_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  publish_job_id uuid NOT NULL,
  media_asset_version_id uuid NOT NULL,
  published_url text,
  screenshot_ref text,
  external_post_id varchar(255),
  content_hash char(64) NOT NULL,
  evidence_status evidence_status NOT NULL DEFAULT 'valid',
  supersedes_evidence_id uuid REFERENCES manual_publish_evidence(manual_publish_evidence_id),
  invalidated_reason text,
  submitted_by_user_id uuid NOT NULL REFERENCES users(user_id),
  submitted_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_manual_evidence_publish_job_workspace FOREIGN KEY (publish_job_id, workspace_id) REFERENCES publish_jobs(publish_job_id, workspace_id),
  CONSTRAINT fk_manual_evidence_asset_version_workspace FOREIGN KEY (media_asset_version_id, workspace_id) REFERENCES media_asset_versions(media_asset_version_id, workspace_id)
);

CREATE INDEX IF NOT EXISTS idx_manual_evidence_workspace ON manual_publish_evidence(workspace_id);
CREATE INDEX IF NOT EXISTS idx_manual_evidence_publish_job ON manual_publish_evidence(publish_job_id);
CREATE INDEX IF NOT EXISTS idx_manual_evidence_asset_version ON manual_publish_evidence(media_asset_version_id);
CREATE INDEX IF NOT EXISTS idx_manual_evidence_status ON manual_publish_evidence(workspace_id, evidence_status);

CREATE TABLE IF NOT EXISTS tracked_links (
  tracked_link_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  publish_job_id uuid NOT NULL,
  original_url text NOT NULL,
  tracked_url text NOT NULL,
  tracking_code varchar(180) NOT NULL,
  link_status link_status NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_tracked_links_publish_job_workspace FOREIGN KEY (publish_job_id, workspace_id) REFERENCES publish_jobs(publish_job_id, workspace_id),
  CONSTRAINT uq_tracked_links_code UNIQUE (workspace_id, tracking_code)
);

CREATE INDEX IF NOT EXISTS idx_tracked_links_workspace ON tracked_links(workspace_id);
CREATE INDEX IF NOT EXISTS idx_tracked_links_publish_job ON tracked_links(publish_job_id);

-- =========================================================
-- 8) REPORT SNAPSHOTS
-- =========================================================

CREATE TABLE IF NOT EXISTS client_report_snapshots (
  client_report_snapshot_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  customer_account_id uuid NOT NULL,
  campaign_id uuid NOT NULL,
  report_template_id uuid NOT NULL,
  report_period_start timestamptz NOT NULL,
  report_period_end timestamptz NOT NULL,
  report_snapshot_payload jsonb NOT NULL,
  evidence_snapshot_payload jsonb NOT NULL,
  generated_by_user_id uuid NOT NULL REFERENCES users(user_id),
  generated_at timestamptz NOT NULL DEFAULT now(),
  content_hash char(64) NOT NULL,
  CONSTRAINT chk_client_reports_period CHECK (report_period_end > report_period_start),
  CONSTRAINT fk_client_reports_campaign_workspace_customer FOREIGN KEY (campaign_id, workspace_id, customer_account_id) REFERENCES campaigns(campaign_id, workspace_id, customer_account_id),
  CONSTRAINT fk_client_reports_template_workspace FOREIGN KEY (report_template_id, workspace_id) REFERENCES report_templates(report_template_id, workspace_id)
);

CREATE INDEX IF NOT EXISTS idx_client_reports_workspace ON client_report_snapshots(workspace_id);
CREATE INDEX IF NOT EXISTS idx_client_reports_campaign ON client_report_snapshots(campaign_id);
CREATE INDEX IF NOT EXISTS idx_client_reports_period ON client_report_snapshots(workspace_id, report_period_start, report_period_end);
CREATE INDEX IF NOT EXISTS idx_client_reports_generated ON client_report_snapshots(workspace_id, generated_at);

-- =========================================================
-- 9) USAGE / QUOTA / COST / GUARDRAILS
-- =========================================================

CREATE TABLE IF NOT EXISTS usage_meter (
  usage_meter_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  customer_account_id uuid NOT NULL,
  usage_type varchar(120) NOT NULL,
  quantity numeric(18,6) NOT NULL CHECK (quantity > 0),
  unit varchar(50) NOT NULL,
  source_entity_type varchar(100) NOT NULL,
  source_entity_id uuid NOT NULL,
  usable_output_confirmed boolean NOT NULL CHECK (usable_output_confirmed = true),
  metered_at timestamptz NOT NULL DEFAULT now(),
  idempotency_key varchar(180) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_usage_meter_workspace_customer FOREIGN KEY (workspace_id, customer_account_id) REFERENCES workspaces(workspace_id, customer_account_id),
  CONSTRAINT uq_usage_meter_idempotency UNIQUE (workspace_id, idempotency_key)
);

CREATE INDEX IF NOT EXISTS idx_usage_meter_workspace ON usage_meter(workspace_id, metered_at);
CREATE INDEX IF NOT EXISTS idx_usage_meter_customer ON usage_meter(customer_account_id, metered_at);
CREATE INDEX IF NOT EXISTS idx_usage_meter_type ON usage_meter(workspace_id, usage_type);

CREATE TABLE IF NOT EXISTS usage_quota_state (
  usage_quota_state_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  customer_account_id uuid NOT NULL,
  quota_code varchar(150) NOT NULL,
  period_start timestamptz NOT NULL,
  period_end timestamptz NOT NULL,
  used_quantity numeric(18,6) NOT NULL DEFAULT 0 CHECK (used_quantity >= 0),
  limit_quantity numeric(18,6) NOT NULL CHECK (limit_quantity >= 0),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_quota_state_workspace_customer FOREIGN KEY (workspace_id, customer_account_id) REFERENCES workspaces(workspace_id, customer_account_id),
  CONSTRAINT chk_quota_state_period CHECK (period_end > period_start),
  CONSTRAINT uq_quota_state_scope UNIQUE (workspace_id, quota_code, period_start, period_end)
);

CREATE INDEX IF NOT EXISTS idx_quota_state_workspace ON usage_quota_state(workspace_id);
CREATE INDEX IF NOT EXISTS idx_quota_state_customer ON usage_quota_state(customer_account_id);
CREATE INDEX IF NOT EXISTS idx_quota_state_period ON usage_quota_state(workspace_id, period_start, period_end);

CREATE TABLE IF NOT EXISTS cost_events (
  cost_event_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  customer_account_id uuid NOT NULL,
  media_job_id uuid,
  cost_type varchar(120) NOT NULL,
  provider_name varchar(120),
  amount numeric(18,6) NOT NULL CHECK (amount >= 0),
  currency char(3) NOT NULL,
  event_status cost_event_status NOT NULL,
  source_entity_type varchar(100) NOT NULL,
  source_entity_id uuid NOT NULL,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_cost_events_workspace_customer FOREIGN KEY (workspace_id, customer_account_id) REFERENCES workspaces(workspace_id, customer_account_id),
  CONSTRAINT fk_cost_events_media_job_workspace_customer FOREIGN KEY (media_job_id, workspace_id, customer_account_id) REFERENCES media_jobs(media_job_id, workspace_id, customer_account_id)
);

CREATE INDEX IF NOT EXISTS idx_cost_events_workspace ON cost_events(workspace_id, occurred_at);
CREATE INDEX IF NOT EXISTS idx_cost_events_customer ON cost_events(customer_account_id, occurred_at);
CREATE INDEX IF NOT EXISTS idx_cost_events_media_job ON cost_events(media_job_id);
CREATE INDEX IF NOT EXISTS idx_cost_events_type ON cost_events(workspace_id, cost_type);

CREATE TABLE IF NOT EXISTS cost_budgets (
  cost_budget_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  customer_account_id uuid NOT NULL,
  budget_name varchar(255) NOT NULL,
  budget_amount numeric(18,6) NOT NULL CHECK (budget_amount >= 0),
  currency char(3) NOT NULL,
  period_start timestamptz NOT NULL,
  period_end timestamptz NOT NULL,
  budget_status cost_budget_status NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_cost_budgets_workspace_customer FOREIGN KEY (workspace_id, customer_account_id) REFERENCES workspaces(workspace_id, customer_account_id),
  CONSTRAINT chk_cost_budgets_period CHECK (period_end > period_start)
);

CREATE INDEX IF NOT EXISTS idx_cost_budgets_workspace ON cost_budgets(workspace_id);
CREATE INDEX IF NOT EXISTS idx_cost_budgets_period ON cost_budgets(workspace_id, period_start, period_end);

CREATE TABLE IF NOT EXISTS cost_guardrails (
  cost_guardrail_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  customer_account_id uuid NOT NULL,
  guardrail_name varchar(255) NOT NULL,
  guardrail_type cost_guardrail_type NOT NULL,
  threshold_amount numeric(18,6) NOT NULL CHECK (threshold_amount >= 0),
  currency char(3) NOT NULL,
  action cost_guardrail_action NOT NULL,
  guardrail_status cost_guardrail_status NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_cost_guardrails_workspace_customer FOREIGN KEY (workspace_id, customer_account_id) REFERENCES workspaces(workspace_id, customer_account_id)
);

CREATE INDEX IF NOT EXISTS idx_cost_guardrails_workspace ON cost_guardrails(workspace_id);
CREATE INDEX IF NOT EXISTS idx_cost_guardrails_status ON cost_guardrails(workspace_id, guardrail_status);

-- =========================================================
-- 10) OPERATIONS / AUDIT / ADMIN
-- =========================================================

CREATE TABLE IF NOT EXISTS audit_logs (
  audit_log_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(workspace_id),
  customer_account_id uuid REFERENCES customer_accounts(customer_account_id),
  actor_user_id uuid REFERENCES users(user_id),
  action varchar(160) NOT NULL,
  entity_type varchar(120) NOT NULL,
  entity_id uuid NOT NULL,
  before_snapshot jsonb,
  after_snapshot jsonb,
  metadata jsonb,
  correlation_id varchar(180) NOT NULL,
  occurred_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_workspace ON audit_logs(workspace_id, occurred_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs(actor_user_id, occurred_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_correlation ON audit_logs(correlation_id);

CREATE TABLE IF NOT EXISTS admin_notifications (
  admin_notification_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(workspace_id),
  notification_type varchar(120) NOT NULL,
  severity severity NOT NULL DEFAULT 'info',
  title varchar(255) NOT NULL,
  message text NOT NULL,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_notifications_workspace ON admin_notifications(workspace_id, created_at);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_unread ON admin_notifications(workspace_id, read_at);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_severity ON admin_notifications(workspace_id, severity);

CREATE TABLE IF NOT EXISTS safe_mode_states (
  safe_mode_state_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(workspace_id),
  safe_mode_status safe_mode_status NOT NULL DEFAULT 'inactive',
  reason text,
  activated_by_user_id uuid REFERENCES users(user_id),
  activated_at timestamptz,
  deactivated_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_safe_mode_workspace ON safe_mode_states(workspace_id);
CREATE INDEX IF NOT EXISTS idx_safe_mode_status ON safe_mode_states(workspace_id, safe_mode_status);

CREATE TABLE IF NOT EXISTS onboarding_progress (
  onboarding_progress_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(workspace_id),
  onboarding_status onboarding_status NOT NULL DEFAULT 'not_started',
  current_step varchar(150) NOT NULL,
  progress_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  completed_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_onboarding_progress_workspace UNIQUE (workspace_id)
);

CREATE INDEX IF NOT EXISTS idx_onboarding_workspace ON onboarding_progress(workspace_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_status ON onboarding_progress(onboarding_status);

CREATE TABLE IF NOT EXISTS setup_checklist_items (
  setup_checklist_item_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(workspace_id),
  item_code varchar(150) NOT NULL,
  item_title varchar(255) NOT NULL,
  item_status setup_item_status NOT NULL DEFAULT 'pending',
  completed_by_user_id uuid REFERENCES users(user_id),
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_setup_items_workspace_code UNIQUE (workspace_id, item_code)
);

CREATE INDEX IF NOT EXISTS idx_setup_items_workspace ON setup_checklist_items(workspace_id);
CREATE INDEX IF NOT EXISTS idx_setup_items_status ON setup_checklist_items(workspace_id, item_status);

-- =========================================================
-- 11) BUSINESS INTEGRITY TRIGGERS
-- =========================================================

CREATE OR REPLACE FUNCTION validate_media_job_start()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  approved_exists boolean;
BEGIN
  IF NEW.job_status IN ('running','succeeded') THEN
    SELECT EXISTS (
      SELECT 1
      FROM media_cost_snapshots mcs
      WHERE mcs.media_job_id = NEW.media_job_id
        AND mcs.workspace_id = NEW.workspace_id
        AND mcs.customer_account_id = NEW.customer_account_id
        AND mcs.cost_check_result = 'approved'
    ) INTO approved_exists;

    IF NOT approved_exists THEN
      RAISE EXCEPTION 'MediaJob % cannot start or succeed without approved MediaCostSnapshot', NEW.media_job_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_validate_media_job_start ON media_jobs;
CREATE TRIGGER trg_validate_media_job_start
BEFORE INSERT OR UPDATE OF job_status ON media_jobs
FOR EACH ROW EXECUTE FUNCTION validate_media_job_start();

CREATE OR REPLACE FUNCTION validate_approval_decision_integrity()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  v_content_hash char(64);
  v_version_status media_asset_version_status;
  v_review_asset_version_id uuid;
BEGIN
  SELECT media_asset_version_id
    INTO v_review_asset_version_id
  FROM review_tasks
  WHERE review_task_id = NEW.review_task_id
    AND workspace_id = NEW.workspace_id;

  IF v_review_asset_version_id IS DISTINCT FROM NEW.media_asset_version_id THEN
    RAISE EXCEPTION 'ApprovalDecision review_task_id does not match media_asset_version_id';
  END IF;

  SELECT content_hash, version_status
    INTO v_content_hash, v_version_status
  FROM media_asset_versions
  WHERE media_asset_version_id = NEW.media_asset_version_id
    AND workspace_id = NEW.workspace_id;

  IF NEW.decision = 'approved' THEN
    IF NEW.approved_content_hash IS NULL THEN
      RAISE EXCEPTION 'approved_content_hash is required for approved decision';
    END IF;

    IF NEW.approved_content_hash IS DISTINCT FROM v_content_hash THEN
      RAISE EXCEPTION 'approved_content_hash does not match MediaAssetVersion.content_hash';
    END IF;

    IF v_version_status IS DISTINCT FROM 'approved'::media_asset_version_status THEN
      RAISE EXCEPTION 'MediaAssetVersion must be approved before ApprovalDecision can approve it';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_validate_approval_decision_integrity ON approval_decisions;
CREATE TRIGGER trg_validate_approval_decision_integrity
BEFORE INSERT OR UPDATE ON approval_decisions
FOR EACH ROW EXECUTE FUNCTION validate_approval_decision_integrity();

CREATE OR REPLACE FUNCTION validate_publish_job_integrity()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  v_decision approval_decision;
  v_decision_asset_version_id uuid;
  v_approved_hash char(64);
  v_current_hash char(64);
BEGIN
  SELECT decision, media_asset_version_id, approved_content_hash
    INTO v_decision, v_decision_asset_version_id, v_approved_hash
  FROM approval_decisions
  WHERE approval_decision_id = NEW.approval_decision_id
    AND workspace_id = NEW.workspace_id;

  IF v_decision IS DISTINCT FROM 'approved'::approval_decision THEN
    RAISE EXCEPTION 'PublishJob requires approved ApprovalDecision';
  END IF;

  IF v_decision_asset_version_id IS DISTINCT FROM NEW.media_asset_version_id THEN
    RAISE EXCEPTION 'PublishJob media_asset_version_id must match ApprovalDecision.media_asset_version_id';
  END IF;

  SELECT content_hash
    INTO v_current_hash
  FROM media_asset_versions
  WHERE media_asset_version_id = NEW.media_asset_version_id
    AND workspace_id = NEW.workspace_id
    AND customer_account_id = NEW.customer_account_id;

  IF v_approved_hash IS DISTINCT FROM v_current_hash THEN
    RAISE EXCEPTION 'PublishJob content hash mismatch: approved hash differs from current asset version hash';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_validate_publish_job_integrity ON publish_jobs;
CREATE TRIGGER trg_validate_publish_job_integrity
BEFORE INSERT OR UPDATE ON publish_jobs
FOR EACH ROW EXECUTE FUNCTION validate_publish_job_integrity();

CREATE OR REPLACE FUNCTION validate_manual_publish_evidence_integrity()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  v_asset_version_id uuid;
  v_content_hash char(64);
BEGIN
  SELECT media_asset_version_id
    INTO v_asset_version_id
  FROM publish_jobs
  WHERE publish_job_id = NEW.publish_job_id
    AND workspace_id = NEW.workspace_id;

  IF v_asset_version_id IS DISTINCT FROM NEW.media_asset_version_id THEN
    RAISE EXCEPTION 'ManualPublishEvidence media_asset_version_id must match PublishJob.media_asset_version_id';
  END IF;

  SELECT content_hash
    INTO v_content_hash
  FROM media_asset_versions
  WHERE media_asset_version_id = NEW.media_asset_version_id
    AND workspace_id = NEW.workspace_id;

  IF NEW.content_hash IS DISTINCT FROM v_content_hash THEN
    RAISE EXCEPTION 'ManualPublishEvidence content_hash must match MediaAssetVersion.content_hash';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_validate_manual_publish_evidence_integrity ON manual_publish_evidence;
CREATE TRIGGER trg_validate_manual_publish_evidence_integrity
BEFORE INSERT ON manual_publish_evidence
FOR EACH ROW EXECUTE FUNCTION validate_manual_publish_evidence_integrity();

CREATE OR REPLACE FUNCTION prevent_approved_asset_version_update()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF OLD.version_status = 'approved'::media_asset_version_status THEN
    RAISE EXCEPTION 'Approved MediaAssetVersion is immutable; create a new version instead';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_approved_asset_version_update ON media_asset_versions;
CREATE TRIGGER trg_prevent_approved_asset_version_update
BEFORE UPDATE ON media_asset_versions
FOR EACH ROW EXECUTE FUNCTION prevent_approved_asset_version_update();

-- =========================================================
-- 12) IMMUTABILITY / APPEND-ONLY TRIGGERS
-- =========================================================

-- Updated-at triggers
DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'customer_accounts','users','workspaces','workspace_members','subscription_plans','customer_subscriptions',
    'brand_profiles','prompt_templates','report_templates','media_cost_policies','campaigns','media_jobs',
    'media_assets','creative_packages','review_tasks','publish_jobs','cost_budgets','cost_guardrails',
    'safe_mode_states','setup_checklist_items'
  ] LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS trg_%I_set_updated_at ON %I', t, t);
    EXECUTE format('CREATE TRIGGER trg_%I_set_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION set_updated_at()', t, t);
  END LOOP;
END $$;

-- Core ownership immutability
DROP TRIGGER IF EXISTS trg_workspaces_immutable ON workspaces;
CREATE TRIGGER trg_workspaces_immutable BEFORE UPDATE ON workspaces
FOR EACH ROW EXECUTE FUNCTION prevent_column_update('workspace_id','customer_account_id','created_by_user_id');

DROP TRIGGER IF EXISTS trg_campaigns_immutable ON campaigns;
CREATE TRIGGER trg_campaigns_immutable BEFORE UPDATE ON campaigns
FOR EACH ROW EXECUTE FUNCTION prevent_column_update('workspace_id','customer_account_id','created_by_user_id');

DROP TRIGGER IF EXISTS trg_media_jobs_immutable ON media_jobs;
CREATE TRIGGER trg_media_jobs_immutable BEFORE UPDATE ON media_jobs
FOR EACH ROW EXECUTE FUNCTION prevent_column_update('workspace_id','customer_account_id','campaign_id','brief_version_id','prompt_template_id','requested_by_user_id');

DROP TRIGGER IF EXISTS trg_media_assets_immutable ON media_assets;
CREATE TRIGGER trg_media_assets_immutable BEFORE UPDATE ON media_assets
FOR EACH ROW EXECUTE FUNCTION prevent_column_update('workspace_id','customer_account_id','media_job_id','campaign_id','created_by_user_id');

DROP TRIGGER IF EXISTS trg_media_asset_versions_immutable ON media_asset_versions;
CREATE TRIGGER trg_media_asset_versions_immutable BEFORE UPDATE ON media_asset_versions
FOR EACH ROW EXECUTE FUNCTION prevent_column_update('workspace_id','customer_account_id','media_asset_id','version_number','content_payload','content_hash','storage_ref','created_by_user_id');

DROP TRIGGER IF EXISTS trg_brief_versions_immutable ON brief_versions;
CREATE TRIGGER trg_brief_versions_immutable BEFORE UPDATE ON brief_versions
FOR EACH ROW EXECUTE FUNCTION prevent_column_update('workspace_id','campaign_id','version_number','brief_content','content_hash','created_by_user_id');

DROP TRIGGER IF EXISTS trg_client_report_snapshots_immutable ON client_report_snapshots;
CREATE TRIGGER trg_client_report_snapshots_immutable BEFORE UPDATE ON client_report_snapshots
FOR EACH ROW EXECUTE FUNCTION prevent_column_update('workspace_id','customer_account_id','campaign_id','report_template_id','report_snapshot_payload','evidence_snapshot_payload','generated_by_user_id','generated_at','content_hash');

-- Append-only tables
DROP TRIGGER IF EXISTS trg_audit_logs_append_only ON audit_logs;
CREATE TRIGGER trg_audit_logs_append_only BEFORE UPDATE OR DELETE ON audit_logs
FOR EACH ROW EXECUTE FUNCTION prevent_update_delete();

DROP TRIGGER IF EXISTS trg_customer_subscription_snapshots_append_only ON customer_subscription_snapshots;
CREATE TRIGGER trg_customer_subscription_snapshots_append_only BEFORE UPDATE OR DELETE ON customer_subscription_snapshots
FOR EACH ROW EXECUTE FUNCTION prevent_update_delete();

DROP TRIGGER IF EXISTS trg_media_cost_snapshots_append_only ON media_cost_snapshots;
CREATE TRIGGER trg_media_cost_snapshots_append_only BEFORE UPDATE OR DELETE ON media_cost_snapshots
FOR EACH ROW EXECUTE FUNCTION prevent_update_delete();

DROP TRIGGER IF EXISTS trg_manual_publish_evidence_append_only ON manual_publish_evidence;
CREATE TRIGGER trg_manual_publish_evidence_append_only BEFORE UPDATE OR DELETE ON manual_publish_evidence
FOR EACH ROW EXECUTE FUNCTION prevent_update_delete();

DROP TRIGGER IF EXISTS trg_usage_meter_append_only ON usage_meter;
CREATE TRIGGER trg_usage_meter_append_only BEFORE UPDATE OR DELETE ON usage_meter
FOR EACH ROW EXECUTE FUNCTION prevent_update_delete();

DROP TRIGGER IF EXISTS trg_cost_events_append_only ON cost_events;
CREATE TRIGGER trg_cost_events_append_only BEFORE UPDATE OR DELETE ON cost_events
FOR EACH ROW EXECUTE FUNCTION prevent_update_delete();

DROP TRIGGER IF EXISTS trg_approval_decisions_append_only ON approval_decisions;
CREATE TRIGGER trg_approval_decisions_append_only BEFORE UPDATE OR DELETE ON approval_decisions
FOR EACH ROW EXECUTE FUNCTION prevent_update_delete();

-- =========================================================
-- 13) TENANT ISOLATION RLS BASELINE
-- =========================================================

-- Application must set: SET app.current_workspace_id = '<workspace_uuid>' after authentication and membership validation.
-- This RLS layer is a defense-in-depth control and must not replace WorkspaceContextGuard/PermissionGuard.

DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'workspace_members','brand_profiles','brand_voice_rules','prompt_templates','report_templates','media_cost_policies',
    'campaigns','campaign_state_transitions','brief_versions','media_jobs','media_cost_snapshots','media_assets',
    'media_asset_versions','creative_packages','review_tasks','approval_decisions','publish_jobs','manual_publish_evidence',
    'tracked_links','client_report_snapshots','usage_meter','usage_quota_state','cost_events','cost_budgets','cost_guardrails',
    'audit_logs','admin_notifications','safe_mode_states','onboarding_progress','setup_checklist_items'
  ] LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('DROP POLICY IF EXISTS tenant_isolation_policy ON %I', t);
    EXECUTE format(
      'CREATE POLICY tenant_isolation_policy ON %I USING (workspace_id = app_current_workspace_id()) WITH CHECK (workspace_id = app_current_workspace_id())',
      t
    );
  END LOOP;
END $$;

COMMIT;

-- =========================================================
-- 14) KNOWN NON-BLOCKING GAPS BEFORE FINAL IMPLEMENTATION
-- =========================================================
-- 1. BillingProvider is intentionally not modeled because it is not part of Section 52.
-- 2. ProviderUsageLog is intentionally not modeled because it is not part of Section 52.
-- 3. MediaJob/PublishJob/ReviewTask dedicated state transition tables are not added; use AuditLog in Phase 0/1.
-- 4. CreativePackage remains package_payload because Section 52 does not link it directly to MediaAssetVersion.
-- 5. Backend must still enforce AuthGuard, WorkspaceContextGuard, Membership Check, PermissionGuard, FeatureGate, CostGuardrail, and AuditLog.
