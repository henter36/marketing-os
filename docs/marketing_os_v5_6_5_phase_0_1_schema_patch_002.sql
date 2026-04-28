-- Marketing OS V5.6.5 — Phase 0/1 Schema Patch 002
-- Purpose: Add additive contract tables for selected competitive features.
-- Authority: docs/marketing_os_v5_6_5_phase_0_1_contract_patch_002_competitive_features.md
-- Status: Pending / not-yet-activated.
-- Scope: Attribution Backbone, Brief Intelligence, Creator Marketplace Lite, Governed Publishing, Video-Planning Outputs.
-- Explicitly excluded: payments, escrow, commissions, contract automation, bots, autonomous social publishing, paid execution, full video rendering.

BEGIN;

-- =========================================================
-- 1) ENUMS
-- =========================================================

DO $$ BEGIN CREATE TYPE suggestion_status AS ENUM ('generated','accepted','rejected','ignored'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE suggestion_type AS ENUM ('keyword','brief_refinement','messaging_angle','brand_fit','audience_insight'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE tracking_domain_status AS ENUM ('pending_verification','active','disabled'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE tracking_event_source AS ENUM ('server','client','manual_import','webhook'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE creator_status AS ENUM ('draft','active','inactive','archived'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE creator_channel_type AS ENUM ('instagram','tiktok','youtube','x','linkedin','snapchat','website','other'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE creator_match_status AS ENUM ('generated','shortlisted','rejected','archived'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE outreach_draft_status AS ENUM ('generated','approved','rejected','sent_manually','archived'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE creator_collaboration_status AS ENUM ('draft','outreach_planned','outreach_sent_manually','interested','not_interested','shortlisted','approved','completed','canceled'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE publish_intent_status AS ENUM ('draft','ready_for_review','approved','rejected','canceled'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE publish_attempt_status AS ENUM ('planned','submitted_manually','succeeded','failed','canceled'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE video_planning_status AS ENUM ('draft','generated','in_review','approved','rejected','archived'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- =========================================================
-- 2) ATTRIBUTION BACKBONE
-- =========================================================

CREATE TABLE IF NOT EXISTS tracking_domains (
  tracking_domain_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(workspace_id),
  domain_name varchar(255) NOT NULL,
  status tracking_domain_status NOT NULL DEFAULT 'pending_verification',
  verification_token varchar(180) NOT NULL,
  verified_at timestamptz,
  created_by_user_id uuid NOT NULL REFERENCES users(user_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_tracking_domains_workspace_domain UNIQUE (workspace_id, domain_name),
  CONSTRAINT uq_tracking_domains_id_workspace UNIQUE (tracking_domain_id, workspace_id)
);

CREATE INDEX IF NOT EXISTS idx_tracking_domains_workspace ON tracking_domains(workspace_id);
CREATE INDEX IF NOT EXISTS idx_tracking_domains_status ON tracking_domains(workspace_id, status);

CREATE TABLE IF NOT EXISTS campaign_utm_templates (
  campaign_utm_template_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  campaign_id uuid NOT NULL,
  template_name varchar(255) NOT NULL,
  utm_source varchar(120) NOT NULL,
  utm_medium varchar(120) NOT NULL,
  utm_campaign varchar(180) NOT NULL,
  utm_content varchar(180),
  utm_term varchar(180),
  policy_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by_user_id uuid NOT NULL REFERENCES users(user_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_campaign_utm_templates_campaign_workspace FOREIGN KEY (campaign_id, workspace_id) REFERENCES campaigns(campaign_id, workspace_id),
  CONSTRAINT uq_campaign_utm_templates_campaign_name UNIQUE (campaign_id, template_name),
  CONSTRAINT uq_campaign_utm_templates_id_workspace UNIQUE (campaign_utm_template_id, workspace_id)
);

CREATE INDEX IF NOT EXISTS idx_campaign_utm_templates_workspace ON campaign_utm_templates(workspace_id);
CREATE INDEX IF NOT EXISTS idx_campaign_utm_templates_campaign ON campaign_utm_templates(campaign_id);

CREATE TABLE IF NOT EXISTS tracking_links (
  tracking_link_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  campaign_id uuid NOT NULL,
  tracking_domain_id uuid,
  campaign_utm_template_id uuid,
  destination_url text NOT NULL,
  short_path varchar(180) NOT NULL,
  link_status link_status NOT NULL DEFAULT 'active',
  attribution_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by_user_id uuid NOT NULL REFERENCES users(user_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_tracking_links_campaign_workspace FOREIGN KEY (campaign_id, workspace_id) REFERENCES campaigns(campaign_id, workspace_id),
  CONSTRAINT fk_tracking_links_domain_workspace FOREIGN KEY (tracking_domain_id, workspace_id) REFERENCES tracking_domains(tracking_domain_id, workspace_id),
  CONSTRAINT fk_tracking_links_utm_workspace FOREIGN KEY (campaign_utm_template_id, workspace_id) REFERENCES campaign_utm_templates(campaign_utm_template_id, workspace_id),
  CONSTRAINT uq_tracking_links_workspace_short_path UNIQUE (workspace_id, short_path),
  CONSTRAINT uq_tracking_links_id_workspace UNIQUE (tracking_link_id, workspace_id)
);

CREATE INDEX IF NOT EXISTS idx_tracking_links_workspace ON tracking_links(workspace_id);
CREATE INDEX IF NOT EXISTS idx_tracking_links_campaign ON tracking_links(campaign_id);
CREATE INDEX IF NOT EXISTS idx_tracking_links_status ON tracking_links(workspace_id, link_status);

CREATE TABLE IF NOT EXISTS click_events (
  click_event_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  tracking_link_id uuid NOT NULL,
  campaign_id uuid NOT NULL,
  event_source tracking_event_source NOT NULL DEFAULT 'server',
  occurred_at timestamptz NOT NULL,
  visitor_hash varchar(180),
  request_id varchar(180),
  referrer_url text,
  user_agent_hash varchar(180),
  ip_hash varchar(180),
  event_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_click_events_tracking_link_workspace FOREIGN KEY (tracking_link_id, workspace_id) REFERENCES tracking_links(tracking_link_id, workspace_id),
  CONSTRAINT fk_click_events_campaign_workspace FOREIGN KEY (campaign_id, workspace_id) REFERENCES campaigns(campaign_id, workspace_id)
);

CREATE INDEX IF NOT EXISTS idx_click_events_workspace ON click_events(workspace_id, occurred_at);
CREATE INDEX IF NOT EXISTS idx_click_events_tracking_link ON click_events(tracking_link_id, occurred_at);
CREATE INDEX IF NOT EXISTS idx_click_events_campaign ON click_events(campaign_id, occurred_at);

CREATE TABLE IF NOT EXISTS conversion_events (
  conversion_event_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  tracking_link_id uuid,
  campaign_id uuid NOT NULL,
  idempotency_key varchar(180) NOT NULL,
  event_source tracking_event_source NOT NULL DEFAULT 'server',
  occurred_at timestamptz NOT NULL,
  conversion_type varchar(120) NOT NULL,
  conversion_value numeric(18,6) CHECK (conversion_value IS NULL OR conversion_value >= 0),
  currency char(3),
  external_reference varchar(180),
  event_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_conversion_events_tracking_link_workspace FOREIGN KEY (tracking_link_id, workspace_id) REFERENCES tracking_links(tracking_link_id, workspace_id),
  CONSTRAINT fk_conversion_events_campaign_workspace FOREIGN KEY (campaign_id, workspace_id) REFERENCES campaigns(campaign_id, workspace_id),
  CONSTRAINT uq_conversion_events_idempotency UNIQUE (workspace_id, idempotency_key)
);

CREATE INDEX IF NOT EXISTS idx_conversion_events_workspace ON conversion_events(workspace_id, occurred_at);
CREATE INDEX IF NOT EXISTS idx_conversion_events_campaign ON conversion_events(campaign_id, occurred_at);
CREATE INDEX IF NOT EXISTS idx_conversion_events_tracking_link ON conversion_events(tracking_link_id, occurred_at);

CREATE TABLE IF NOT EXISTS attribution_snapshots (
  attribution_snapshot_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  campaign_id uuid NOT NULL,
  tracking_link_id uuid,
  snapshot_reason varchar(120) NOT NULL,
  attribution_model varchar(120) NOT NULL,
  snapshot_payload jsonb NOT NULL,
  generated_by_user_id uuid REFERENCES users(user_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_attribution_snapshots_campaign_workspace FOREIGN KEY (campaign_id, workspace_id) REFERENCES campaigns(campaign_id, workspace_id),
  CONSTRAINT fk_attribution_snapshots_tracking_link_workspace FOREIGN KEY (tracking_link_id, workspace_id) REFERENCES tracking_links(tracking_link_id, workspace_id)
);

CREATE INDEX IF NOT EXISTS idx_attribution_snapshots_workspace ON attribution_snapshots(workspace_id, created_at);
CREATE INDEX IF NOT EXISTS idx_attribution_snapshots_campaign ON attribution_snapshots(campaign_id, created_at);

-- =========================================================
-- 3) BRIEF INTELLIGENCE
-- =========================================================

CREATE TABLE IF NOT EXISTS brief_suggestions (
  brief_suggestion_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  campaign_id uuid NOT NULL,
  brief_version_id uuid NOT NULL,
  suggestion_type suggestion_type NOT NULL,
  suggestion_status suggestion_status NOT NULL DEFAULT 'generated',
  suggestion_payload jsonb NOT NULL,
  model_name varchar(120) NOT NULL,
  model_version varchar(120) NOT NULL,
  prompt_version varchar(120) NOT NULL,
  confidence_score numeric(5,4) CHECK (confidence_score IS NULL OR (confidence_score >= 0 AND confidence_score <= 1)),
  generated_by_user_id uuid NOT NULL REFERENCES users(user_id),
  accepted_by_user_id uuid REFERENCES users(user_id),
  accepted_at timestamptz,
  rejected_by_user_id uuid REFERENCES users(user_id),
  rejected_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_brief_suggestions_brief_campaign_workspace FOREIGN KEY (brief_version_id, campaign_id, workspace_id) REFERENCES brief_versions(brief_version_id, campaign_id, workspace_id),
  CONSTRAINT fk_brief_suggestions_campaign_workspace FOREIGN KEY (campaign_id, workspace_id) REFERENCES campaigns(campaign_id, workspace_id),
  CONSTRAINT uq_brief_suggestions_id_workspace UNIQUE (brief_suggestion_id, workspace_id)
);

CREATE INDEX IF NOT EXISTS idx_brief_suggestions_workspace ON brief_suggestions(workspace_id, created_at);
CREATE INDEX IF NOT EXISTS idx_brief_suggestions_brief ON brief_suggestions(brief_version_id);
CREATE INDEX IF NOT EXISTS idx_brief_suggestions_status ON brief_suggestions(workspace_id, suggestion_status);

CREATE TABLE IF NOT EXISTS campaign_brief_keywords (
  campaign_brief_keyword_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  campaign_id uuid NOT NULL,
  brief_version_id uuid,
  brief_suggestion_id uuid,
  keyword varchar(180) NOT NULL,
  keyword_source varchar(80) NOT NULL,
  created_by_user_id uuid NOT NULL REFERENCES users(user_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_campaign_brief_keywords_campaign_workspace FOREIGN KEY (campaign_id, workspace_id) REFERENCES campaigns(campaign_id, workspace_id),
  CONSTRAINT fk_campaign_brief_keywords_brief_workspace FOREIGN KEY (brief_version_id, workspace_id) REFERENCES brief_versions(brief_version_id, workspace_id),
  CONSTRAINT fk_campaign_brief_keywords_suggestion_workspace FOREIGN KEY (brief_suggestion_id, workspace_id) REFERENCES brief_suggestions(brief_suggestion_id, workspace_id),
  CONSTRAINT uq_campaign_brief_keywords_campaign_keyword UNIQUE (campaign_id, keyword)
);

CREATE INDEX IF NOT EXISTS idx_campaign_brief_keywords_workspace ON campaign_brief_keywords(workspace_id);
CREATE INDEX IF NOT EXISTS idx_campaign_brief_keywords_campaign ON campaign_brief_keywords(campaign_id);

CREATE TABLE IF NOT EXISTS audience_insight_snapshots (
  audience_insight_snapshot_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  campaign_id uuid,
  source_type varchar(80) NOT NULL,
  source_reference varchar(255),
  freshness_at timestamptz NOT NULL,
  insight_payload jsonb NOT NULL,
  model_name varchar(120),
  model_version varchar(120),
  prompt_version varchar(120),
  created_by_user_id uuid NOT NULL REFERENCES users(user_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_audience_insight_snapshots_campaign_workspace FOREIGN KEY (campaign_id, workspace_id) REFERENCES campaigns(campaign_id, workspace_id)
);

CREATE INDEX IF NOT EXISTS idx_audience_insight_snapshots_workspace ON audience_insight_snapshots(workspace_id, created_at);
CREATE INDEX IF NOT EXISTS idx_audience_insight_snapshots_campaign ON audience_insight_snapshots(campaign_id, created_at);

CREATE TABLE IF NOT EXISTS brand_fit_signals (
  brand_fit_signal_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  campaign_id uuid NOT NULL,
  brief_version_id uuid,
  signal_payload jsonb NOT NULL,
  confidence_score numeric(5,4) CHECK (confidence_score IS NULL OR (confidence_score >= 0 AND confidence_score <= 1)),
  model_name varchar(120),
  model_version varchar(120),
  prompt_version varchar(120),
  created_by_user_id uuid NOT NULL REFERENCES users(user_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_brand_fit_signals_campaign_workspace FOREIGN KEY (campaign_id, workspace_id) REFERENCES campaigns(campaign_id, workspace_id),
  CONSTRAINT fk_brand_fit_signals_brief_workspace FOREIGN KEY (brief_version_id, workspace_id) REFERENCES brief_versions(brief_version_id, workspace_id)
);

CREATE INDEX IF NOT EXISTS idx_brand_fit_signals_workspace ON brand_fit_signals(workspace_id, created_at);
CREATE INDEX IF NOT EXISTS idx_brand_fit_signals_campaign ON brand_fit_signals(campaign_id, created_at);

-- =========================================================
-- 4) CREATOR MARKETPLACE LITE
-- =========================================================

CREATE TABLE IF NOT EXISTS creator_profiles (
  creator_profile_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(workspace_id),
  display_name varchar(255) NOT NULL,
  creator_status creator_status NOT NULL DEFAULT 'draft',
  primary_locale varchar(20),
  country_code char(2),
  niche_tags jsonb NOT NULL DEFAULT '[]'::jsonb,
  profile_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by_user_id uuid NOT NULL REFERENCES users(user_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_creator_profiles_workspace_name UNIQUE (workspace_id, display_name),
  CONSTRAINT uq_creator_profiles_id_workspace UNIQUE (creator_profile_id, workspace_id)
);

CREATE INDEX IF NOT EXISTS idx_creator_profiles_workspace ON creator_profiles(workspace_id);
CREATE INDEX IF NOT EXISTS idx_creator_profiles_status ON creator_profiles(workspace_id, creator_status);

CREATE TABLE IF NOT EXISTS creator_channels (
  creator_channel_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  creator_profile_id uuid NOT NULL,
  channel_type creator_channel_type NOT NULL,
  channel_handle varchar(180) NOT NULL,
  channel_url text,
  channel_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_creator_channels_profile_workspace FOREIGN KEY (creator_profile_id, workspace_id) REFERENCES creator_profiles(creator_profile_id, workspace_id),
  CONSTRAINT uq_creator_channels_workspace_type_handle UNIQUE (workspace_id, channel_type, channel_handle),
  CONSTRAINT uq_creator_channels_id_workspace UNIQUE (creator_channel_id, workspace_id)
);

CREATE INDEX IF NOT EXISTS idx_creator_channels_workspace ON creator_channels(workspace_id);
CREATE INDEX IF NOT EXISTS idx_creator_channels_profile ON creator_channels(creator_profile_id);

CREATE TABLE IF NOT EXISTS creator_audience_snapshots (
  creator_audience_snapshot_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  creator_profile_id uuid NOT NULL,
  creator_channel_id uuid,
  source_type varchar(80) NOT NULL,
  freshness_at timestamptz NOT NULL,
  audience_payload jsonb NOT NULL,
  model_name varchar(120),
  model_version varchar(120),
  prompt_version varchar(120),
  created_by_user_id uuid NOT NULL REFERENCES users(user_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_creator_audience_snapshots_profile_workspace FOREIGN KEY (creator_profile_id, workspace_id) REFERENCES creator_profiles(creator_profile_id, workspace_id),
  CONSTRAINT fk_creator_audience_snapshots_channel_workspace FOREIGN KEY (creator_channel_id, workspace_id) REFERENCES creator_channels(creator_channel_id, workspace_id)
);

CREATE INDEX IF NOT EXISTS idx_creator_audience_snapshots_workspace ON creator_audience_snapshots(workspace_id, created_at);
CREATE INDEX IF NOT EXISTS idx_creator_audience_snapshots_profile ON creator_audience_snapshots(creator_profile_id, created_at);

CREATE TABLE IF NOT EXISTS creator_campaign_matches (
  creator_campaign_match_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  campaign_id uuid NOT NULL,
  creator_profile_id uuid NOT NULL,
  brief_version_id uuid,
  match_status creator_match_status NOT NULL DEFAULT 'generated',
  fit_score numeric(5,4) CHECK (fit_score IS NULL OR (fit_score >= 0 AND fit_score <= 1)),
  match_reason jsonb NOT NULL DEFAULT '{}'::jsonb,
  model_name varchar(120),
  model_version varchar(120),
  prompt_version varchar(120),
  generated_by_user_id uuid NOT NULL REFERENCES users(user_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_creator_campaign_matches_campaign_workspace FOREIGN KEY (campaign_id, workspace_id) REFERENCES campaigns(campaign_id, workspace_id),
  CONSTRAINT fk_creator_campaign_matches_profile_workspace FOREIGN KEY (creator_profile_id, workspace_id) REFERENCES creator_profiles(creator_profile_id, workspace_id),
  CONSTRAINT fk_creator_campaign_matches_brief_workspace FOREIGN KEY (brief_version_id, workspace_id) REFERENCES brief_versions(brief_version_id, workspace_id),
  CONSTRAINT uq_creator_campaign_matches_campaign_creator UNIQUE (campaign_id, creator_profile_id),
  CONSTRAINT uq_creator_campaign_matches_id_workspace UNIQUE (creator_campaign_match_id, workspace_id)
);

CREATE INDEX IF NOT EXISTS idx_creator_campaign_matches_workspace ON creator_campaign_matches(workspace_id, created_at);
CREATE INDEX IF NOT EXISTS idx_creator_campaign_matches_campaign ON creator_campaign_matches(campaign_id);
CREATE INDEX IF NOT EXISTS idx_creator_campaign_matches_creator ON creator_campaign_matches(creator_profile_id);

CREATE TABLE IF NOT EXISTS creator_outreach_drafts (
  creator_outreach_draft_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  campaign_id uuid NOT NULL,
  creator_profile_id uuid NOT NULL,
  creator_campaign_match_id uuid,
  draft_status outreach_draft_status NOT NULL DEFAULT 'generated',
  draft_payload jsonb NOT NULL,
  model_name varchar(120) NOT NULL,
  model_version varchar(120) NOT NULL,
  prompt_version varchar(120) NOT NULL,
  generated_by_user_id uuid NOT NULL REFERENCES users(user_id),
  approved_by_user_id uuid REFERENCES users(user_id),
  approved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_creator_outreach_drafts_campaign_workspace FOREIGN KEY (campaign_id, workspace_id) REFERENCES campaigns(campaign_id, workspace_id),
  CONSTRAINT fk_creator_outreach_drafts_profile_workspace FOREIGN KEY (creator_profile_id, workspace_id) REFERENCES creator_profiles(creator_profile_id, workspace_id),
  CONSTRAINT fk_creator_outreach_drafts_match_workspace FOREIGN KEY (creator_campaign_match_id, workspace_id) REFERENCES creator_campaign_matches(creator_campaign_match_id, workspace_id),
  CONSTRAINT uq_creator_outreach_drafts_id_workspace UNIQUE (creator_outreach_draft_id, workspace_id)
);

CREATE INDEX IF NOT EXISTS idx_creator_outreach_drafts_workspace ON creator_outreach_drafts(workspace_id, created_at);
CREATE INDEX IF NOT EXISTS idx_creator_outreach_drafts_campaign ON creator_outreach_drafts(campaign_id);
CREATE INDEX IF NOT EXISTS idx_creator_outreach_drafts_creator ON creator_outreach_drafts(creator_profile_id);

CREATE TABLE IF NOT EXISTS creator_collaborations (
  creator_collaboration_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  campaign_id uuid NOT NULL,
  creator_profile_id uuid NOT NULL,
  creator_campaign_match_id uuid,
  creator_outreach_draft_id uuid,
  collaboration_status creator_collaboration_status NOT NULL DEFAULT 'draft',
  collaboration_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by_user_id uuid NOT NULL REFERENCES users(user_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_creator_collaborations_campaign_workspace FOREIGN KEY (campaign_id, workspace_id) REFERENCES campaigns(campaign_id, workspace_id),
  CONSTRAINT fk_creator_collaborations_profile_workspace FOREIGN KEY (creator_profile_id, workspace_id) REFERENCES creator_profiles(creator_profile_id, workspace_id),
  CONSTRAINT fk_creator_collaborations_match_workspace FOREIGN KEY (creator_campaign_match_id, workspace_id) REFERENCES creator_campaign_matches(creator_campaign_match_id, workspace_id),
  CONSTRAINT fk_creator_collaborations_outreach_workspace FOREIGN KEY (creator_outreach_draft_id, workspace_id) REFERENCES creator_outreach_drafts(creator_outreach_draft_id, workspace_id),
  CONSTRAINT uq_creator_collaborations_campaign_creator UNIQUE (campaign_id, creator_profile_id),
  CONSTRAINT uq_creator_collaborations_id_workspace UNIQUE (creator_collaboration_id, workspace_id)
);

CREATE INDEX IF NOT EXISTS idx_creator_collaborations_workspace ON creator_collaborations(workspace_id, created_at);
CREATE INDEX IF NOT EXISTS idx_creator_collaborations_campaign ON creator_collaborations(campaign_id);
CREATE INDEX IF NOT EXISTS idx_creator_collaborations_status ON creator_collaborations(workspace_id, collaboration_status);

CREATE TABLE IF NOT EXISTS creator_collaboration_status_history (
  creator_collaboration_status_history_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  creator_collaboration_id uuid NOT NULL,
  from_status creator_collaboration_status,
  to_status creator_collaboration_status NOT NULL,
  reason text,
  changed_by_user_id uuid NOT NULL REFERENCES users(user_id),
  changed_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_creator_collaboration_status_history_collaboration_workspace FOREIGN KEY (creator_collaboration_id, workspace_id) REFERENCES creator_collaborations(creator_collaboration_id, workspace_id)
);

CREATE INDEX IF NOT EXISTS idx_creator_collaboration_status_history_workspace ON creator_collaboration_status_history(workspace_id, changed_at);
CREATE INDEX IF NOT EXISTS idx_creator_collaboration_status_history_collaboration ON creator_collaboration_status_history(creator_collaboration_id, changed_at);

-- =========================================================
-- 5) GOVERNED PUBLISHING
-- =========================================================

CREATE TABLE IF NOT EXISTS channel_variants (
  channel_variant_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  campaign_id uuid NOT NULL,
  media_asset_version_id uuid NOT NULL,
  channel varchar(80) NOT NULL,
  variant_payload jsonb NOT NULL,
  content_hash char(64) NOT NULL,
  created_by_user_id uuid NOT NULL REFERENCES users(user_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_channel_variants_campaign_workspace FOREIGN KEY (campaign_id, workspace_id) REFERENCES campaigns(campaign_id, workspace_id),
  CONSTRAINT fk_channel_variants_asset_version_workspace FOREIGN KEY (media_asset_version_id, workspace_id) REFERENCES media_asset_versions(media_asset_version_id, workspace_id),
  CONSTRAINT uq_channel_variants_id_workspace UNIQUE (channel_variant_id, workspace_id),
  CONSTRAINT uq_channel_variants_asset_channel_hash UNIQUE (media_asset_version_id, channel, content_hash)
);

CREATE INDEX IF NOT EXISTS idx_channel_variants_workspace ON channel_variants(workspace_id, created_at);
CREATE INDEX IF NOT EXISTS idx_channel_variants_campaign ON channel_variants(campaign_id);
CREATE INDEX IF NOT EXISTS idx_channel_variants_asset_version ON channel_variants(media_asset_version_id);

CREATE TABLE IF NOT EXISTS publish_intents (
  publish_intent_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  campaign_id uuid NOT NULL,
  channel_variant_id uuid NOT NULL,
  media_asset_version_id uuid NOT NULL,
  publish_job_id uuid,
  intent_status publish_intent_status NOT NULL DEFAULT 'draft',
  requested_by_user_id uuid NOT NULL REFERENCES users(user_id),
  approved_by_user_id uuid REFERENCES users(user_id),
  approved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_publish_intents_campaign_workspace FOREIGN KEY (campaign_id, workspace_id) REFERENCES campaigns(campaign_id, workspace_id),
  CONSTRAINT fk_publish_intents_channel_variant_workspace FOREIGN KEY (channel_variant_id, workspace_id) REFERENCES channel_variants(channel_variant_id, workspace_id),
  CONSTRAINT fk_publish_intents_asset_version_workspace FOREIGN KEY (media_asset_version_id, workspace_id) REFERENCES media_asset_versions(media_asset_version_id, workspace_id),
  CONSTRAINT fk_publish_intents_publish_job_workspace FOREIGN KEY (publish_job_id, workspace_id) REFERENCES publish_jobs(publish_job_id, workspace_id),
  CONSTRAINT uq_publish_intents_id_workspace UNIQUE (publish_intent_id, workspace_id)
);

CREATE INDEX IF NOT EXISTS idx_publish_intents_workspace ON publish_intents(workspace_id, created_at);
CREATE INDEX IF NOT EXISTS idx_publish_intents_campaign ON publish_intents(campaign_id);
CREATE INDEX IF NOT EXISTS idx_publish_intents_status ON publish_intents(workspace_id, intent_status);

CREATE TABLE IF NOT EXISTS publish_attempts (
  publish_attempt_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  publish_intent_id uuid NOT NULL,
  publish_job_id uuid,
  attempt_status publish_attempt_status NOT NULL DEFAULT 'planned',
  attempt_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  failure_code varchar(120),
  failure_message text,
  attempted_by_user_id uuid NOT NULL REFERENCES users(user_id),
  attempted_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_publish_attempts_intent_workspace FOREIGN KEY (publish_intent_id, workspace_id) REFERENCES publish_intents(publish_intent_id, workspace_id),
  CONSTRAINT fk_publish_attempts_job_workspace FOREIGN KEY (publish_job_id, workspace_id) REFERENCES publish_jobs(publish_job_id, workspace_id)
);

CREATE INDEX IF NOT EXISTS idx_publish_attempts_workspace ON publish_attempts(workspace_id, attempted_at);
CREATE INDEX IF NOT EXISTS idx_publish_attempts_intent ON publish_attempts(publish_intent_id, attempted_at);
CREATE INDEX IF NOT EXISTS idx_publish_attempts_status ON publish_attempts(workspace_id, attempt_status);

CREATE TABLE IF NOT EXISTS publish_status_history (
  publish_status_history_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  publish_intent_id uuid NOT NULL,
  from_status publish_intent_status,
  to_status publish_intent_status NOT NULL,
  reason text,
  changed_by_user_id uuid NOT NULL REFERENCES users(user_id),
  changed_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_publish_status_history_intent_workspace FOREIGN KEY (publish_intent_id, workspace_id) REFERENCES publish_intents(publish_intent_id, workspace_id)
);

CREATE INDEX IF NOT EXISTS idx_publish_status_history_workspace ON publish_status_history(workspace_id, changed_at);
CREATE INDEX IF NOT EXISTS idx_publish_status_history_intent ON publish_status_history(publish_intent_id, changed_at);

-- =========================================================
-- 6) VIDEO-PLANNING OUTPUTS
-- =========================================================

CREATE TABLE IF NOT EXISTS video_scripts (
  video_script_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  campaign_id uuid NOT NULL,
  brief_version_id uuid,
  media_job_id uuid,
  script_status video_planning_status NOT NULL DEFAULT 'generated',
  script_payload jsonb NOT NULL,
  model_name varchar(120),
  model_version varchar(120),
  prompt_version varchar(120),
  created_by_user_id uuid NOT NULL REFERENCES users(user_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_video_scripts_campaign_workspace FOREIGN KEY (campaign_id, workspace_id) REFERENCES campaigns(campaign_id, workspace_id),
  CONSTRAINT fk_video_scripts_brief_workspace FOREIGN KEY (brief_version_id, workspace_id) REFERENCES brief_versions(brief_version_id, workspace_id),
  CONSTRAINT fk_video_scripts_media_job_workspace FOREIGN KEY (media_job_id, workspace_id) REFERENCES media_jobs(media_job_id, workspace_id),
  CONSTRAINT uq_video_scripts_id_workspace UNIQUE (video_script_id, workspace_id)
);

CREATE INDEX IF NOT EXISTS idx_video_scripts_workspace ON video_scripts(workspace_id, created_at);
CREATE INDEX IF NOT EXISTS idx_video_scripts_campaign ON video_scripts(campaign_id);

CREATE TABLE IF NOT EXISTS storyboards (
  storyboard_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  campaign_id uuid NOT NULL,
  brief_version_id uuid,
  video_script_id uuid,
  storyboard_status video_planning_status NOT NULL DEFAULT 'generated',
  storyboard_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  model_name varchar(120),
  model_version varchar(120),
  prompt_version varchar(120),
  created_by_user_id uuid NOT NULL REFERENCES users(user_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_storyboards_campaign_workspace FOREIGN KEY (campaign_id, workspace_id) REFERENCES campaigns(campaign_id, workspace_id),
  CONSTRAINT fk_storyboards_brief_workspace FOREIGN KEY (brief_version_id, workspace_id) REFERENCES brief_versions(brief_version_id, workspace_id),
  CONSTRAINT fk_storyboards_video_script_workspace FOREIGN KEY (video_script_id, workspace_id) REFERENCES video_scripts(video_script_id, workspace_id),
  CONSTRAINT uq_storyboards_id_workspace UNIQUE (storyboard_id, workspace_id)
);

CREATE INDEX IF NOT EXISTS idx_storyboards_workspace ON storyboards(workspace_id, created_at);
CREATE INDEX IF NOT EXISTS idx_storyboards_campaign ON storyboards(campaign_id);

CREATE TABLE IF NOT EXISTS storyboard_scenes (
  storyboard_scene_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  storyboard_id uuid NOT NULL,
  scene_number integer NOT NULL CHECK (scene_number > 0),
  scene_payload jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_storyboard_scenes_storyboard_workspace FOREIGN KEY (storyboard_id, workspace_id) REFERENCES storyboards(storyboard_id, workspace_id),
  CONSTRAINT uq_storyboard_scenes_storyboard_scene UNIQUE (storyboard_id, scene_number),
  CONSTRAINT uq_storyboard_scenes_id_workspace UNIQUE (storyboard_scene_id, workspace_id)
);

CREATE INDEX IF NOT EXISTS idx_storyboard_scenes_workspace ON storyboard_scenes(workspace_id);
CREATE INDEX IF NOT EXISTS idx_storyboard_scenes_storyboard ON storyboard_scenes(storyboard_id, scene_number);

CREATE TABLE IF NOT EXISTS shot_plans (
  shot_plan_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  storyboard_id uuid NOT NULL,
  storyboard_scene_id uuid,
  shot_plan_payload jsonb NOT NULL,
  created_by_user_id uuid NOT NULL REFERENCES users(user_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_shot_plans_storyboard_workspace FOREIGN KEY (storyboard_id, workspace_id) REFERENCES storyboards(storyboard_id, workspace_id),
  CONSTRAINT fk_shot_plans_scene_workspace FOREIGN KEY (storyboard_scene_id, workspace_id) REFERENCES storyboard_scenes(storyboard_scene_id, workspace_id),
  CONSTRAINT uq_shot_plans_id_workspace UNIQUE (shot_plan_id, workspace_id)
);

CREATE INDEX IF NOT EXISTS idx_shot_plans_workspace ON shot_plans(workspace_id, created_at);
CREATE INDEX IF NOT EXISTS idx_shot_plans_storyboard ON shot_plans(storyboard_id);

CREATE TABLE IF NOT EXISTS voiceover_scripts (
  voiceover_script_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL,
  video_script_id uuid,
  storyboard_id uuid,
  voiceover_payload jsonb NOT NULL,
  model_name varchar(120),
  model_version varchar(120),
  prompt_version varchar(120),
  created_by_user_id uuid NOT NULL REFERENCES users(user_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_voiceover_scripts_video_script_workspace FOREIGN KEY (video_script_id, workspace_id) REFERENCES video_scripts(video_script_id, workspace_id),
  CONSTRAINT fk_voiceover_scripts_storyboard_workspace FOREIGN KEY (storyboard_id, workspace_id) REFERENCES storyboards(storyboard_id, workspace_id),
  CONSTRAINT chk_voiceover_scripts_parent CHECK (video_script_id IS NOT NULL OR storyboard_id IS NOT NULL),
  CONSTRAINT uq_voiceover_scripts_id_workspace UNIQUE (voiceover_script_id, workspace_id)
);

CREATE INDEX IF NOT EXISTS idx_voiceover_scripts_workspace ON voiceover_scripts(workspace_id, created_at);
CREATE INDEX IF NOT EXISTS idx_voiceover_scripts_video_script ON voiceover_scripts(video_script_id);
CREATE INDEX IF NOT EXISTS idx_voiceover_scripts_storyboard ON voiceover_scripts(storyboard_id);

-- =========================================================
-- 7) IMMUTABILITY AND UPDATED_AT TRIGGERS
-- =========================================================

DROP TRIGGER IF EXISTS trg_tracking_domains_updated_at ON tracking_domains;
CREATE TRIGGER trg_tracking_domains_updated_at BEFORE UPDATE ON tracking_domains FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_campaign_utm_templates_updated_at ON campaign_utm_templates;
CREATE TRIGGER trg_campaign_utm_templates_updated_at BEFORE UPDATE ON campaign_utm_templates FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_tracking_links_updated_at ON tracking_links;
CREATE TRIGGER trg_tracking_links_updated_at BEFORE UPDATE ON tracking_links FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_brief_suggestions_updated_at ON brief_suggestions;
CREATE TRIGGER trg_brief_suggestions_updated_at BEFORE UPDATE ON brief_suggestions FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_creator_profiles_updated_at ON creator_profiles;
CREATE TRIGGER trg_creator_profiles_updated_at BEFORE UPDATE ON creator_profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_creator_channels_updated_at ON creator_channels;
CREATE TRIGGER trg_creator_channels_updated_at BEFORE UPDATE ON creator_channels FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_creator_campaign_matches_updated_at ON creator_campaign_matches;
CREATE TRIGGER trg_creator_campaign_matches_updated_at BEFORE UPDATE ON creator_campaign_matches FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_creator_outreach_drafts_updated_at ON creator_outreach_drafts;
CREATE TRIGGER trg_creator_outreach_drafts_updated_at BEFORE UPDATE ON creator_outreach_drafts FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_creator_collaborations_updated_at ON creator_collaborations;
CREATE TRIGGER trg_creator_collaborations_updated_at BEFORE UPDATE ON creator_collaborations FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_publish_intents_updated_at ON publish_intents;
CREATE TRIGGER trg_publish_intents_updated_at BEFORE UPDATE ON publish_intents FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_video_scripts_updated_at ON video_scripts;
CREATE TRIGGER trg_video_scripts_updated_at BEFORE UPDATE ON video_scripts FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_storyboards_updated_at ON storyboards;
CREATE TRIGGER trg_storyboards_updated_at BEFORE UPDATE ON storyboards FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_storyboard_scenes_updated_at ON storyboard_scenes;
CREATE TRIGGER trg_storyboard_scenes_updated_at BEFORE UPDATE ON storyboard_scenes FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_shot_plans_updated_at ON shot_plans;
CREATE TRIGGER trg_shot_plans_updated_at BEFORE UPDATE ON shot_plans FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_voiceover_scripts_updated_at ON voiceover_scripts;
CREATE TRIGGER trg_voiceover_scripts_updated_at BEFORE UPDATE ON voiceover_scripts FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_click_events_append_only ON click_events;
CREATE TRIGGER trg_click_events_append_only BEFORE UPDATE OR DELETE ON click_events FOR EACH ROW EXECUTE FUNCTION prevent_update_delete();

DROP TRIGGER IF EXISTS trg_conversion_events_append_only ON conversion_events;
CREATE TRIGGER trg_conversion_events_append_only BEFORE UPDATE OR DELETE ON conversion_events FOR EACH ROW EXECUTE FUNCTION prevent_update_delete();

DROP TRIGGER IF EXISTS trg_attribution_snapshots_append_only ON attribution_snapshots;
CREATE TRIGGER trg_attribution_snapshots_append_only BEFORE UPDATE OR DELETE ON attribution_snapshots FOR EACH ROW EXECUTE FUNCTION prevent_update_delete();

DROP TRIGGER IF EXISTS trg_creator_audience_snapshots_append_only ON creator_audience_snapshots;
CREATE TRIGGER trg_creator_audience_snapshots_append_only BEFORE UPDATE OR DELETE ON creator_audience_snapshots FOR EACH ROW EXECUTE FUNCTION prevent_update_delete();

DROP TRIGGER IF EXISTS trg_creator_collaboration_status_history_append_only ON creator_collaboration_status_history;
CREATE TRIGGER trg_creator_collaboration_status_history_append_only BEFORE UPDATE OR DELETE ON creator_collaboration_status_history FOR EACH ROW EXECUTE FUNCTION prevent_update_delete();

DROP TRIGGER IF EXISTS trg_publish_attempts_append_only ON publish_attempts;
CREATE TRIGGER trg_publish_attempts_append_only BEFORE UPDATE OR DELETE ON publish_attempts FOR EACH ROW EXECUTE FUNCTION prevent_update_delete();

DROP TRIGGER IF EXISTS trg_publish_status_history_append_only ON publish_status_history;
CREATE TRIGGER trg_publish_status_history_append_only BEFORE UPDATE OR DELETE ON publish_status_history FOR EACH ROW EXECUTE FUNCTION prevent_update_delete();

COMMIT;

-- End of Patch 002
