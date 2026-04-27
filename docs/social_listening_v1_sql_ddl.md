# Social Listening V1 SQL DDL Design

## Document Status

This document converts `docs/social_listening_v1_erd.md` into PostgreSQL-oriented SQL DDL for review.

This is **not a migration file** and must not be applied directly without adapting it to the repository migration framework, naming conventions, existing core tables, and deployment process.

Implementation authority still requires:

1. SQL DDL review.
2. OpenAPI contract patch.
3. QA test suite.
4. Sprint implementation prompt.
5. Actual migration files.

---

## Executive Decision

The SQL design implements Social Listening as a bounded module inside Marketing OS. It deliberately avoids:

- Auto-publishing.
- Paid execution.
- AI agents.
- Stock prediction.
- BUY/SELL/HOLD concepts.
- Large-scale streaming infrastructure.
- Notebook-based ML execution.
- Raw credential storage.

Every Social Listening business table includes `workspace_id` to protect tenant isolation. Historical analytical records are append-safe where required, especially sentiment results, trend snapshots, and alert events.

---

## Assumptions

This DDL assumes the core platform already has:

- `workspaces(id uuid)`
- `users(id uuid)`
- `connector_credentials(id uuid)` or equivalent
- `audit_logs` or equivalent
- A UUID generation strategy

If the project uses a different UUID function, replace `gen_random_uuid()` with the project standard.

```sql
-- Required if not already enabled by the platform.
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

---

## Design Notes

1. Status values are implemented as `CHECK` constraints instead of PostgreSQL native enums to reduce migration friction.
2. `workspace_id` is included in all tables even where it could be inferred through joins.
3. Cross-table workspace consistency should be reinforced in application/service code and, where practical, through composite foreign keys in final migrations.
4. Nullable FK fields are intentional for broader snapshots, system jobs, global/default provider configs, or optional evidence references.
5. Raw external payloads are not stored directly in primary tables.
6. `jsonb` is used only for metadata, filters, or sanitized diagnostic structures.

---

# SQL DDL

## 1. `social_monitored_sources`

```sql
CREATE TABLE social_monitored_sources (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id uuid NOT NULL REFERENCES workspaces(id),
    source_type text NOT NULL,
    display_name text NOT NULL,
    connector_credential_id uuid NULL REFERENCES connector_credentials(id),
    status text NOT NULL DEFAULT 'active',
    terms_policy_status text NOT NULL DEFAULT 'pending_review',
    last_health_status text NULL,
    last_checked_at timestamptz NULL,
    created_by_user_id uuid NOT NULL REFERENCES users(id),
    updated_by_user_id uuid NULL REFERENCES users(id),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    deleted_at timestamptz NULL,

    CONSTRAINT chk_social_monitored_sources_source_type
        CHECK (source_type IN ('x', 'instagram', 'youtube', 'reviews', 'news', 'manual_import', 'other')),

    CONSTRAINT chk_social_monitored_sources_status
        CHECK (status IN ('active', 'paused', 'disabled')),

    CONSTRAINT chk_social_monitored_sources_terms_policy_status
        CHECK (terms_policy_status IN ('approved', 'pending_review', 'rejected')),

    CONSTRAINT chk_social_monitored_sources_last_health_status
        CHECK (last_health_status IS NULL OR last_health_status IN ('healthy', 'degraded', 'rate_limited', 'failed')),

    CONSTRAINT chk_social_monitored_sources_no_active_rejected_policy
        CHECK (NOT (status = 'active' AND terms_policy_status = 'rejected'))
);

CREATE INDEX idx_social_sources_workspace_status
    ON social_monitored_sources (workspace_id, status);

CREATE INDEX idx_social_sources_workspace_type
    ON social_monitored_sources (workspace_id, source_type);

CREATE INDEX idx_social_sources_workspace_credential
    ON social_monitored_sources (workspace_id, connector_credential_id);

CREATE UNIQUE INDEX uq_social_sources_active_name
    ON social_monitored_sources (workspace_id, source_type, lower(display_name))
    WHERE deleted_at IS NULL;
```

---

## 2. `social_source_rate_limit_states`

```sql
CREATE TABLE social_source_rate_limit_states (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id uuid NOT NULL REFERENCES workspaces(id),
    monitored_source_id uuid NOT NULL REFERENCES social_monitored_sources(id),
    provider_key text NOT NULL,
    limit_scope text NOT NULL,
    limit_remaining integer NULL,
    reset_at timestamptz NULL,
    backoff_until timestamptz NULL,
    last_rate_limited_at timestamptz NULL,
    metadata jsonb NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT chk_social_rate_limit_remaining_nonnegative
        CHECK (limit_remaining IS NULL OR limit_remaining >= 0),

    CONSTRAINT uq_social_rate_limit_scope
        UNIQUE (workspace_id, monitored_source_id, provider_key, limit_scope)
);

CREATE INDEX idx_social_rate_limits_workspace_source
    ON social_source_rate_limit_states (workspace_id, monitored_source_id);

CREATE INDEX idx_social_rate_limits_workspace_backoff
    ON social_source_rate_limit_states (workspace_id, backoff_until);

CREATE INDEX idx_social_rate_limits_provider_reset
    ON social_source_rate_limit_states (provider_key, reset_at);
```

---

## 3. `social_analysis_jobs`

> This table is defined before failure events because failure events can reference it.

```sql
CREATE TABLE social_analysis_jobs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id uuid NOT NULL REFERENCES workspaces(id),
    job_type text NOT NULL,
    status text NOT NULL DEFAULT 'queued',
    idempotency_key text NOT NULL,
    requested_by_user_id uuid NULL REFERENCES users(id),
    monitored_source_id uuid NULL REFERENCES social_monitored_sources(id),
    monitored_keyword_id uuid NULL,
    input_ref text NULL,
    progress_percent integer NOT NULL DEFAULT 0,
    attempt_count integer NOT NULL DEFAULT 0,
    max_attempts integer NOT NULL DEFAULT 3,
    error_code text NULL,
    error_message text NULL,
    started_at timestamptz NULL,
    completed_at timestamptz NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT chk_social_jobs_type
        CHECK (job_type IN ('ingestion', 'sentiment_scoring', 'trend_snapshot', 'alert_evaluation', 'export')),

    CONSTRAINT chk_social_jobs_status
        CHECK (status IN ('queued', 'running', 'succeeded', 'failed', 'cancelled', 'skipped')),

    CONSTRAINT chk_social_jobs_progress
        CHECK (progress_percent BETWEEN 0 AND 100),

    CONSTRAINT chk_social_jobs_attempts
        CHECK (attempt_count >= 0 AND max_attempts >= 1 AND attempt_count <= max_attempts),

    CONSTRAINT chk_social_jobs_completion_time
        CHECK (completed_at IS NULL OR started_at IS NULL OR completed_at >= started_at),

    CONSTRAINT uq_social_jobs_idempotency
        UNIQUE (workspace_id, job_type, idempotency_key)
);

CREATE INDEX idx_social_jobs_workspace_type_status
    ON social_analysis_jobs (workspace_id, job_type, status);

CREATE INDEX idx_social_jobs_workspace_created
    ON social_analysis_jobs (workspace_id, created_at DESC);

CREATE INDEX idx_social_jobs_workspace_idempotency
    ON social_analysis_jobs (workspace_id, idempotency_key);

CREATE INDEX idx_social_jobs_source_created
    ON social_analysis_jobs (monitored_source_id, created_at DESC);

CREATE INDEX idx_social_jobs_keyword_created
    ON social_analysis_jobs (monitored_keyword_id, created_at DESC);
```

`monitored_keyword_id` is temporarily declared without FK above because `social_monitored_keywords` is created below. Add FK after creating keywords:

```sql
-- Added after social_monitored_keywords exists.
-- ALTER TABLE social_analysis_jobs
-- ADD CONSTRAINT fk_social_jobs_monitored_keyword
-- FOREIGN KEY (monitored_keyword_id) REFERENCES social_monitored_keywords(id);
```

---

## 4. `social_source_failure_events`

```sql
CREATE TABLE social_source_failure_events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id uuid NOT NULL REFERENCES workspaces(id),
    monitored_source_id uuid NOT NULL REFERENCES social_monitored_sources(id),
    analysis_job_id uuid NULL REFERENCES social_analysis_jobs(id),
    failure_type text NOT NULL,
    error_code text NULL,
    error_message text NULL,
    occurred_at timestamptz NOT NULL DEFAULT now(),
    metadata jsonb NULL,

    CONSTRAINT chk_social_source_failure_type
        CHECK (failure_type IN ('auth', 'rate_limit', 'timeout', 'provider_error', 'payload_error', 'policy_blocked', 'unknown'))
);

CREATE INDEX idx_social_source_failures_source_time
    ON social_source_failure_events (workspace_id, monitored_source_id, occurred_at DESC);

CREATE INDEX idx_social_source_failures_type_time
    ON social_source_failure_events (workspace_id, failure_type, occurred_at DESC);

CREATE INDEX idx_social_source_failures_job
    ON social_source_failure_events (analysis_job_id);
```

---

## 5. `social_monitored_keywords`

```sql
CREATE TABLE social_monitored_keywords (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id uuid NOT NULL REFERENCES workspaces(id),
    keyword text NOT NULL,
    normalized_keyword text NOT NULL,
    keyword_type text NOT NULL,
    language_hint text NULL,
    match_mode text NOT NULL DEFAULT 'contains',
    status text NOT NULL DEFAULT 'active',
    created_by_user_id uuid NOT NULL REFERENCES users(id),
    updated_by_user_id uuid NULL REFERENCES users(id),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    disabled_at timestamptz NULL,

    CONSTRAINT chk_social_keywords_keyword_not_blank
        CHECK (length(trim(keyword)) > 0),

    CONSTRAINT chk_social_keywords_normalized_not_blank
        CHECK (length(trim(normalized_keyword)) > 0),

    CONSTRAINT chk_social_keywords_type
        CHECK (keyword_type IN ('brand', 'product', 'campaign', 'competitor', 'hashtag', 'topic', 'custom')),

    CONSTRAINT chk_social_keywords_language_hint
        CHECK (language_hint IS NULL OR language_hint IN ('ar', 'en', 'mixed', 'unknown')),

    CONSTRAINT chk_social_keywords_match_mode
        CHECK (match_mode IN ('exact', 'contains', 'hashtag', 'phrase', 'regex_limited')),

    CONSTRAINT chk_social_keywords_status
        CHECK (status IN ('active', 'paused', 'disabled')),

    CONSTRAINT chk_social_keywords_disabled_at
        CHECK ((status = 'disabled' AND disabled_at IS NOT NULL) OR status <> 'disabled')
);

CREATE UNIQUE INDEX uq_social_keywords_active
    ON social_monitored_keywords (workspace_id, normalized_keyword, keyword_type)
    WHERE status IN ('active', 'paused');

CREATE INDEX idx_social_keywords_workspace_status
    ON social_monitored_keywords (workspace_id, status);

CREATE INDEX idx_social_keywords_workspace_type
    ON social_monitored_keywords (workspace_id, keyword_type);

CREATE INDEX idx_social_keywords_workspace_normalized
    ON social_monitored_keywords (workspace_id, normalized_keyword);

ALTER TABLE social_analysis_jobs
    ADD CONSTRAINT fk_social_jobs_monitored_keyword
    FOREIGN KEY (monitored_keyword_id) REFERENCES social_monitored_keywords(id);
```

---

## 6. `social_mentions`

```sql
CREATE TABLE social_mentions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id uuid NOT NULL REFERENCES workspaces(id),
    monitored_source_id uuid NOT NULL REFERENCES social_monitored_sources(id),
    ingestion_job_id uuid NULL REFERENCES social_analysis_jobs(id),
    source_type text NOT NULL,
    external_id text NOT NULL,
    external_url text NULL,
    author_handle_hash text NULL,
    author_display_name_hash text NULL,
    text_excerpt text NOT NULL,
    text_hash text NOT NULL,
    language text NOT NULL DEFAULT 'unknown',
    published_at timestamptz NULL,
    ingested_at timestamptz NOT NULL DEFAULT now(),
    raw_payload_ref text NULL,
    retention_policy_key text NOT NULL DEFAULT 'default_social_listening_v1',
    visibility_status text NOT NULL DEFAULT 'visible',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT chk_social_mentions_source_type
        CHECK (source_type IN ('x', 'instagram', 'youtube', 'reviews', 'news', 'manual_import', 'other')),

    CONSTRAINT chk_social_mentions_external_id_not_blank
        CHECK (length(trim(external_id)) > 0),

    CONSTRAINT chk_social_mentions_text_not_blank
        CHECK (length(trim(text_excerpt)) > 0),

    CONSTRAINT chk_social_mentions_text_hash_not_blank
        CHECK (length(trim(text_hash)) > 0),

    CONSTRAINT chk_social_mentions_language
        CHECK (language IN ('ar', 'en', 'mixed', 'unknown', 'other')),

    CONSTRAINT chk_social_mentions_visibility
        CHECK (visibility_status IN ('visible', 'hidden_policy', 'deleted_source', 'redacted')),

    CONSTRAINT uq_social_mentions_external
        UNIQUE (workspace_id, monitored_source_id, external_id)
);

CREATE INDEX idx_social_mentions_source_published
    ON social_mentions (workspace_id, monitored_source_id, published_at DESC);

CREATE INDEX idx_social_mentions_type_published
    ON social_mentions (workspace_id, source_type, published_at DESC);

CREATE INDEX idx_social_mentions_language_published
    ON social_mentions (workspace_id, language, published_at DESC);

CREATE INDEX idx_social_mentions_text_hash
    ON social_mentions (workspace_id, text_hash);

CREATE INDEX idx_social_mentions_ingestion_job
    ON social_mentions (ingestion_job_id);

CREATE INDEX idx_social_mentions_visibility
    ON social_mentions (workspace_id, visibility_status, published_at DESC);
```

Optional full-text index, only if V1 explicitly approves text search:

```sql
-- CREATE INDEX idx_social_mentions_text_search
--     ON social_mentions
--     USING gin (to_tsvector('simple', text_excerpt));
```

---

## 7. `social_mention_keyword_matches`

```sql
CREATE TABLE social_mention_keyword_matches (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id uuid NOT NULL REFERENCES workspaces(id),
    social_mention_id uuid NOT NULL REFERENCES social_mentions(id),
    monitored_keyword_id uuid NOT NULL REFERENCES social_monitored_keywords(id),
    matched_text text NULL,
    match_mode text NOT NULL,
    match_confidence numeric(6,5) NULL,
    created_at timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT chk_social_match_mode
        CHECK (match_mode IN ('exact', 'contains', 'hashtag', 'phrase', 'regex_limited')),

    CONSTRAINT chk_social_match_confidence
        CHECK (match_confidence IS NULL OR (match_confidence >= 0 AND match_confidence <= 1)),

    CONSTRAINT uq_social_mention_keyword_match
        UNIQUE (workspace_id, social_mention_id, monitored_keyword_id)
);

CREATE INDEX idx_social_matches_keyword_created
    ON social_mention_keyword_matches (workspace_id, monitored_keyword_id, created_at DESC);

CREATE INDEX idx_social_matches_mention
    ON social_mention_keyword_matches (workspace_id, social_mention_id);

CREATE INDEX idx_social_matches_keyword_mention
    ON social_mention_keyword_matches (workspace_id, monitored_keyword_id, social_mention_id);
```

---

## 8. `social_sentiment_provider_configs`

```sql
CREATE TABLE social_sentiment_provider_configs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id uuid NULL REFERENCES workspaces(id),
    provider_key text NOT NULL,
    provider_name text NOT NULL,
    model_name text NOT NULL,
    model_version text NOT NULL,
    supported_languages jsonb NOT NULL,
    status text NOT NULL DEFAULT 'pending_review',
    is_fallback boolean NOT NULL DEFAULT false,
    configuration_ref text NULL,
    created_by_user_id uuid NULL REFERENCES users(id),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT chk_social_provider_status
        CHECK (status IN ('enabled', 'disabled', 'pending_review')),

    CONSTRAINT chk_social_provider_key_not_blank
        CHECK (length(trim(provider_key)) > 0),

    CONSTRAINT chk_social_provider_model_not_blank
        CHECK (length(trim(model_name)) > 0 AND length(trim(model_version)) > 0),

    CONSTRAINT chk_social_provider_supported_languages_array
        CHECK (jsonb_typeof(supported_languages) = 'array'),

    CONSTRAINT uq_social_provider_version
        UNIQUE (workspace_id, provider_key, model_name, model_version)
);

CREATE INDEX idx_social_providers_workspace_status
    ON social_sentiment_provider_configs (workspace_id, status);

CREATE INDEX idx_social_providers_key_model
    ON social_sentiment_provider_configs (provider_key, model_name, model_version);

CREATE INDEX idx_social_providers_workspace_key
    ON social_sentiment_provider_configs (workspace_id, provider_key);
```

Seed suggestion for English baseline after license/security review:

```sql
-- INSERT INTO social_sentiment_provider_configs (
--     workspace_id,
--     provider_key,
--     provider_name,
--     model_name,
--     model_version,
--     supported_languages,
--     status,
--     is_fallback
-- ) VALUES (
--     NULL,
--     'vader',
--     'VADER English Baseline',
--     'vaderSentiment',
--     'reviewed-version-placeholder',
--     '["en"]'::jsonb,
--     'pending_review',
--     true
-- );
```

---

## 9. `social_sentiment_results`

```sql
CREATE TABLE social_sentiment_results (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id uuid NOT NULL REFERENCES workspaces(id),
    social_mention_id uuid NOT NULL REFERENCES social_mentions(id),
    analysis_job_id uuid NULL REFERENCES social_analysis_jobs(id),
    provider_config_id uuid NULL REFERENCES social_sentiment_provider_configs(id),
    model_name text NOT NULL,
    model_version text NOT NULL,
    sentiment_label text NOT NULL,
    sentiment_score numeric(8,6) NOT NULL,
    confidence_score numeric(8,6) NOT NULL,
    language text NOT NULL,
    is_baseline boolean NOT NULL DEFAULT false,
    explanation_summary text NULL,
    input_text_hash text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT chk_social_sentiment_label
        CHECK (sentiment_label IN ('positive', 'neutral', 'negative', 'mixed', 'unknown')),

    CONSTRAINT chk_social_sentiment_score_range
        CHECK (sentiment_score >= -1 AND sentiment_score <= 1),

    CONSTRAINT chk_social_sentiment_confidence_range
        CHECK (confidence_score >= 0 AND confidence_score <= 1),

    CONSTRAINT chk_social_sentiment_language
        CHECK (language IN ('ar', 'en', 'mixed', 'unknown', 'other')),

    CONSTRAINT chk_social_sentiment_model_not_blank
        CHECK (length(trim(model_name)) > 0 AND length(trim(model_version)) > 0),

    CONSTRAINT chk_social_sentiment_input_hash_not_blank
        CHECK (length(trim(input_text_hash)) > 0),

    CONSTRAINT uq_social_sentiment_result_version
        UNIQUE (workspace_id, social_mention_id, model_name, model_version, input_text_hash)
);

CREATE INDEX idx_social_sentiment_mention_created
    ON social_sentiment_results (workspace_id, social_mention_id, created_at DESC);

CREATE INDEX idx_social_sentiment_label_created
    ON social_sentiment_results (workspace_id, sentiment_label, created_at DESC);

CREATE INDEX idx_social_sentiment_language_created
    ON social_sentiment_results (workspace_id, language, created_at DESC);

CREATE INDEX idx_social_sentiment_model_version
    ON social_sentiment_results (workspace_id, model_name, model_version);

CREATE INDEX idx_social_sentiment_job
    ON social_sentiment_results (analysis_job_id);
```

---

## 10. `social_trend_snapshots`

```sql
CREATE TABLE social_trend_snapshots (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id uuid NOT NULL REFERENCES workspaces(id),
    monitored_keyword_id uuid NULL REFERENCES social_monitored_keywords(id),
    monitored_source_id uuid NULL REFERENCES social_monitored_sources(id),
    analysis_job_id uuid NULL REFERENCES social_analysis_jobs(id),
    window_start timestamptz NOT NULL,
    window_end timestamptz NOT NULL,
    window_grain text NOT NULL,
    mention_count integer NOT NULL DEFAULT 0,
    positive_count integer NOT NULL DEFAULT 0,
    neutral_count integer NOT NULL DEFAULT 0,
    negative_count integer NOT NULL DEFAULT 0,
    mixed_count integer NOT NULL DEFAULT 0,
    unknown_count integer NOT NULL DEFAULT 0,
    average_sentiment_score numeric(8,6) NULL,
    confidence_average numeric(8,6) NULL,
    top_terms jsonb NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT chk_social_snapshots_window_order
        CHECK (window_end > window_start),

    CONSTRAINT chk_social_snapshots_grain
        CHECK (window_grain IN ('hour', 'day', 'week', 'month')),

    CONSTRAINT chk_social_snapshots_counts_nonnegative
        CHECK (
            mention_count >= 0 AND
            positive_count >= 0 AND
            neutral_count >= 0 AND
            negative_count >= 0 AND
            mixed_count >= 0 AND
            unknown_count >= 0
        ),

    CONSTRAINT chk_social_snapshots_score_range
        CHECK (average_sentiment_score IS NULL OR (average_sentiment_score >= -1 AND average_sentiment_score <= 1)),

    CONSTRAINT chk_social_snapshots_confidence_range
        CHECK (confidence_average IS NULL OR (confidence_average >= 0 AND confidence_average <= 1))
);

-- Uses expression indexes to normalize NULL dimensions into deterministic uniqueness.
CREATE UNIQUE INDEX uq_social_snapshots_window
    ON social_trend_snapshots (
        workspace_id,
        COALESCE(monitored_keyword_id, '00000000-0000-0000-0000-000000000000'::uuid),
        COALESCE(monitored_source_id, '00000000-0000-0000-0000-000000000000'::uuid),
        window_start,
        window_end,
        window_grain
    );

CREATE INDEX idx_social_snapshots_workspace_window
    ON social_trend_snapshots (workspace_id, window_start, window_end);

CREATE INDEX idx_social_snapshots_keyword_window
    ON social_trend_snapshots (workspace_id, monitored_keyword_id, window_start DESC);

CREATE INDEX idx_social_snapshots_source_window
    ON social_trend_snapshots (workspace_id, monitored_source_id, window_start DESC);

CREATE INDEX idx_social_snapshots_grain_window
    ON social_trend_snapshots (workspace_id, window_grain, window_start DESC);
```

---

## 11. `social_alert_rules`

```sql
CREATE TABLE social_alert_rules (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id uuid NOT NULL REFERENCES workspaces(id),
    name text NOT NULL,
    rule_type text NOT NULL,
    monitored_keyword_id uuid NULL REFERENCES social_monitored_keywords(id),
    monitored_source_id uuid NULL REFERENCES social_monitored_sources(id),
    metric_key text NOT NULL,
    comparison_operator text NOT NULL,
    threshold_value numeric(12,6) NOT NULL,
    window_grain text NOT NULL,
    severity text NOT NULL,
    status text NOT NULL DEFAULT 'active',
    cooldown_minutes integer NOT NULL DEFAULT 60,
    created_by_user_id uuid NOT NULL REFERENCES users(id),
    updated_by_user_id uuid NULL REFERENCES users(id),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT chk_social_alert_rules_name_not_blank
        CHECK (length(trim(name)) > 0),

    CONSTRAINT chk_social_alert_rules_type
        CHECK (rule_type IN ('negative_sentiment_spike', 'mention_volume_spike', 'positive_sentiment_spike', 'keyword_activity', 'custom_threshold')),

    CONSTRAINT chk_social_alert_rules_metric_key
        CHECK (metric_key IN ('negative_count', 'positive_count', 'neutral_count', 'mixed_count', 'unknown_count', 'mention_count', 'average_sentiment_score', 'confidence_average')),

    CONSTRAINT chk_social_alert_rules_operator
        CHECK (comparison_operator IN ('gt', 'gte', 'lt', 'lte', 'eq')),

    CONSTRAINT chk_social_alert_rules_grain
        CHECK (window_grain IN ('hour', 'day', 'week')),

    CONSTRAINT chk_social_alert_rules_severity
        CHECK (severity IN ('low', 'medium', 'high', 'critical')),

    CONSTRAINT chk_social_alert_rules_status
        CHECK (status IN ('active', 'paused', 'disabled')),

    CONSTRAINT chk_social_alert_rules_cooldown
        CHECK (cooldown_minutes >= 0)
);

CREATE INDEX idx_social_alert_rules_workspace_status
    ON social_alert_rules (workspace_id, status);

CREATE INDEX idx_social_alert_rules_workspace_type
    ON social_alert_rules (workspace_id, rule_type);

CREATE INDEX idx_social_alert_rules_keyword
    ON social_alert_rules (workspace_id, monitored_keyword_id);

CREATE INDEX idx_social_alert_rules_source
    ON social_alert_rules (workspace_id, monitored_source_id);
```

---

## 12. `social_alert_events`

```sql
CREATE TABLE social_alert_events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id uuid NOT NULL REFERENCES workspaces(id),
    alert_rule_id uuid NOT NULL REFERENCES social_alert_rules(id),
    triggered_snapshot_id uuid NULL REFERENCES social_trend_snapshots(id),
    analysis_job_id uuid NULL REFERENCES social_analysis_jobs(id),
    severity text NOT NULL,
    metric_key text NOT NULL,
    observed_value numeric(12,6) NOT NULL,
    threshold_value numeric(12,6) NOT NULL,
    message text NOT NULL,
    status text NOT NULL DEFAULT 'open',
    dedupe_key text NOT NULL,
    triggered_at timestamptz NOT NULL DEFAULT now(),
    acknowledged_by_user_id uuid NULL REFERENCES users(id),
    acknowledged_at timestamptz NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT chk_social_alert_events_severity
        CHECK (severity IN ('low', 'medium', 'high', 'critical')),

    CONSTRAINT chk_social_alert_events_metric_key
        CHECK (metric_key IN ('negative_count', 'positive_count', 'neutral_count', 'mixed_count', 'unknown_count', 'mention_count', 'average_sentiment_score', 'confidence_average')),

    CONSTRAINT chk_social_alert_events_status
        CHECK (status IN ('open', 'acknowledged', 'dismissed')),

    CONSTRAINT chk_social_alert_events_message_not_blank
        CHECK (length(trim(message)) > 0),

    CONSTRAINT chk_social_alert_events_dedupe_not_blank
        CHECK (length(trim(dedupe_key)) > 0),

    CONSTRAINT chk_social_alert_events_ack_state
        CHECK (
            (status = 'acknowledged' AND acknowledged_by_user_id IS NOT NULL AND acknowledged_at IS NOT NULL)
            OR status <> 'acknowledged'
        ),

    CONSTRAINT uq_social_alert_events_dedupe
        UNIQUE (workspace_id, alert_rule_id, dedupe_key)
);

CREATE INDEX idx_social_alert_events_status_time
    ON social_alert_events (workspace_id, status, triggered_at DESC);

CREATE INDEX idx_social_alert_events_rule_time
    ON social_alert_events (workspace_id, alert_rule_id, triggered_at DESC);

CREATE INDEX idx_social_alert_events_severity_time
    ON social_alert_events (workspace_id, severity, triggered_at DESC);

CREATE INDEX idx_social_alert_events_snapshot
    ON social_alert_events (triggered_snapshot_id);
```

---

## 13. `social_export_jobs`

```sql
CREATE TABLE social_export_jobs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id uuid NOT NULL REFERENCES workspaces(id),
    analysis_job_id uuid NULL REFERENCES social_analysis_jobs(id),
    requested_by_user_id uuid NOT NULL REFERENCES users(id),
    export_type text NOT NULL,
    format text NOT NULL,
    filter_hash text NOT NULL,
    filters_json jsonb NOT NULL,
    status text NOT NULL DEFAULT 'queued',
    file_ref text NULL,
    expires_at timestamptz NULL,
    row_count integer NULL,
    error_code text NULL,
    error_message text NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    completed_at timestamptz NULL,

    CONSTRAINT chk_social_export_type
        CHECK (export_type IN ('mentions', 'sentiment_results', 'trend_snapshots', 'alerts', 'summary')),

    CONSTRAINT chk_social_export_format
        CHECK (format IN ('csv', 'json')),

    CONSTRAINT chk_social_export_status
        CHECK (status IN ('queued', 'running', 'succeeded', 'failed', 'expired')),

    CONSTRAINT chk_social_export_filter_hash_not_blank
        CHECK (length(trim(filter_hash)) > 0),

    CONSTRAINT chk_social_export_filters_json_object
        CHECK (jsonb_typeof(filters_json) = 'object'),

    CONSTRAINT chk_social_export_row_count
        CHECK (row_count IS NULL OR row_count >= 0),

    CONSTRAINT chk_social_export_completion
        CHECK (completed_at IS NULL OR completed_at >= created_at)
);

CREATE INDEX idx_social_exports_user_created
    ON social_export_jobs (workspace_id, requested_by_user_id, created_at DESC);

CREATE INDEX idx_social_exports_status_created
    ON social_export_jobs (workspace_id, status, created_at DESC);

CREATE INDEX idx_social_exports_type_created
    ON social_export_jobs (workspace_id, export_type, created_at DESC);

CREATE INDEX idx_social_exports_expires
    ON social_export_jobs (workspace_id, expires_at);
```

---

# Optional Timestamp Trigger

If the platform does not already provide timestamp automation, use one standard trigger function across these tables.

```sql
CREATE OR REPLACE FUNCTION set_updated_at_timestamp()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

Apply only to tables that have `updated_at`:

```sql
CREATE TRIGGER trg_social_monitored_sources_updated_at
BEFORE UPDATE ON social_monitored_sources
FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

CREATE TRIGGER trg_social_rate_limit_states_updated_at
BEFORE UPDATE ON social_source_rate_limit_states
FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

CREATE TRIGGER trg_social_analysis_jobs_updated_at
BEFORE UPDATE ON social_analysis_jobs
FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

CREATE TRIGGER trg_social_monitored_keywords_updated_at
BEFORE UPDATE ON social_monitored_keywords
FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

CREATE TRIGGER trg_social_mentions_updated_at
BEFORE UPDATE ON social_mentions
FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

CREATE TRIGGER trg_social_sentiment_provider_configs_updated_at
BEFORE UPDATE ON social_sentiment_provider_configs
FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

CREATE TRIGGER trg_social_trend_snapshots_updated_at
BEFORE UPDATE ON social_trend_snapshots
FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

CREATE TRIGGER trg_social_alert_rules_updated_at
BEFORE UPDATE ON social_alert_rules
FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

CREATE TRIGGER trg_social_alert_events_updated_at
BEFORE UPDATE ON social_alert_events
FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();
```

---

# Tenant Consistency Enforcement

## Minimum Required Application-Level Checks

Every write must validate:

1. Child `workspace_id` equals parent `workspace_id`.
2. Job `workspace_id` equals output record `workspace_id`.
3. Source `workspace_id` equals mention `workspace_id`.
4. Keyword `workspace_id` equals match `workspace_id`.
5. Alert rule `workspace_id` equals event `workspace_id`.
6. Snapshot `workspace_id` equals alert event `workspace_id`.

## Optional Composite FK Hardening

Final migrations may add composite unique keys and composite FKs to enforce tenant consistency at database level. Example pattern:

```sql
-- Example only; apply systematically if adopted.
-- ALTER TABLE social_monitored_sources
--     ADD CONSTRAINT uq_social_sources_id_workspace UNIQUE (id, workspace_id);
--
-- ALTER TABLE social_mentions
--     ADD CONSTRAINT fk_social_mentions_source_workspace
--     FOREIGN KEY (monitored_source_id, workspace_id)
--     REFERENCES social_monitored_sources(id, workspace_id);
```

This is stronger but increases DDL verbosity. Use it if the platform standard favors DB-level tenant integrity.

---

# Immutability and Historical Truth Rules

## Tables That Should Be Append-Safe

- `social_sentiment_results`
- `social_alert_events`
- `social_source_failure_events`
- `social_export_jobs` history rows

## Tables That May Be Updated

- `social_monitored_sources`
- `social_monitored_keywords`
- `social_source_rate_limit_states`
- `social_analysis_jobs`
- `social_trend_snapshots` for same idempotent window if regeneration is allowed
- `social_alert_rules`
- `social_alert_events` only for acknowledgement/dismissal state

## Prohibited Mutations

1. Do not overwrite historical sentiment result values.
2. Do not delete mentions when a keyword is disabled.
3. Do not delete mentions when a source is disabled.
4. Do not mutate alert evidence after trigger.
5. Do not expose or store raw secrets in any Social Listening table.

---

# Audit Event Mapping

The DDL does not create a new audit table. Use existing `audit_logs`.

Minimum audited actions:

| Action | Entity |
|---|---|
| `social_listening.keyword.created` | `social_monitored_keywords` |
| `social_listening.keyword.updated` | `social_monitored_keywords` |
| `social_listening.keyword.deactivated` | `social_monitored_keywords` |
| `social_listening.source.created` | `social_monitored_sources` |
| `social_listening.source.updated` | `social_monitored_sources` |
| `social_listening.source.paused` | `social_monitored_sources` |
| `social_listening.source.disabled` | `social_monitored_sources` |
| `social_listening.source.rate_limited` | `social_source_rate_limit_states` |
| `social_listening.source.failure_recorded` | `social_source_failure_events` |
| `social_listening.ingestion_job.created` | `social_analysis_jobs` |
| `social_listening.sentiment.scored` | `social_sentiment_results` |
| `social_listening.alert_rule.created` | `social_alert_rules` |
| `social_listening.alert_rule.updated` | `social_alert_rules` |
| `social_listening.alert_event.created` | `social_alert_events` |
| `social_listening.alert_event.acknowledged` | `social_alert_events` |
| `social_listening.export.created` | `social_export_jobs` |
| `social_listening.export.downloaded` | `social_export_jobs` |

---

# Migration Order

Recommended migration order:

1. Enable UUID extension if needed.
2. Create `social_monitored_sources`.
3. Create `social_source_rate_limit_states`.
4. Create `social_analysis_jobs` without keyword FK.
5. Create `social_source_failure_events`.
6. Create `social_monitored_keywords`.
7. Add FK from `social_analysis_jobs.monitored_keyword_id`.
8. Create `social_mentions`.
9. Create `social_mention_keyword_matches`.
10. Create `social_sentiment_provider_configs`.
11. Create `social_sentiment_results`.
12. Create `social_trend_snapshots`.
13. Create `social_alert_rules`.
14. Create `social_alert_events`.
15. Create `social_export_jobs`.
16. Add timestamp triggers if not already standardized.
17. Add optional composite FK hardening if approved.

---

# Rollback Considerations

Rollback must be deliberate because these tables may contain historical analytical records.

For development rollback only:

```sql
DROP TABLE IF EXISTS social_export_jobs;
DROP TABLE IF EXISTS social_alert_events;
DROP TABLE IF EXISTS social_alert_rules;
DROP TABLE IF EXISTS social_trend_snapshots;
DROP TABLE IF EXISTS social_sentiment_results;
DROP TABLE IF EXISTS social_sentiment_provider_configs;
DROP TABLE IF EXISTS social_mention_keyword_matches;
DROP TABLE IF EXISTS social_mentions;
ALTER TABLE IF EXISTS social_analysis_jobs DROP CONSTRAINT IF EXISTS fk_social_jobs_monitored_keyword;
DROP TABLE IF EXISTS social_monitored_keywords;
DROP TABLE IF EXISTS social_source_failure_events;
DROP TABLE IF EXISTS social_analysis_jobs;
DROP TABLE IF EXISTS social_source_rate_limit_states;
DROP TABLE IF EXISTS social_monitored_sources;
```

Production rollback should prefer feature disabling and data preservation unless legal/privacy requirements require deletion.

---

# DDL Review Checklist

Before converting this document to actual migration files, verify:

1. Core table names match repository implementation.
2. UUID generation strategy matches repository standard.
3. `connector_credentials` exists or equivalent is mapped.
4. Existing audit system can store required events.
5. Existing RBAC system can add Social Listening permissions.
6. Existing job system should not replace `social_analysis_jobs`.
7. PII handling for author identifiers is approved.
8. Raw payload storage policy is approved.
9. VADER or any dependency passes license/security review.
10. Arabic sentiment provider strategy is not overclaimed.
11. Composite tenant FK hardening is either adopted or explicitly deferred.
12. Final OpenAPI uses the same entity names and statuses.
13. QA suite covers tenant isolation, RBAC, idempotency, audit, and error model.

---

# Final Recommendation

This SQL DDL is structurally ready for OpenAPI and QA design review, but it should not be applied as-is until repository conventions and existing core tables are verified.

Recommended next artifacts:

1. `docs/social_listening_v1_openapi_patch.yaml`
2. `docs/social_listening_v1_qa_suite.md`

Decision status: **SQL DDL design prepared; implementation migration not yet approved.**
