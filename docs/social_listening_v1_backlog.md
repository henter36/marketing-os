# Social Listening V1 Backlog Candidate

## Document Status

This document converts only the suitable parts of `docs/social_sentiment_github_feature_extraction_and_fit_gap.md` into a controlled V1 backlog candidate for Marketing OS.

This is **not yet an approved Sprint scope**.

This document must not be used as implementation authority until the selected stories are promoted into the approved execution chain:

1. ERD impact document.
2. SQL DDL migration plan.
3. OpenAPI contract.
4. QA test suite.
5. Sprint implementation prompt.

Until then, this backlog is a **candidate scope definition** only.

---

## Executive Decision

Social Listening can be considered for V1 only as a **bounded brand monitoring and sentiment insight module**, not as a full social intelligence platform.

Approved V1 candidate direction:

- Monitor configured keywords, brands, products, competitors, and campaign terms.
- Ingest permitted external mentions from governed connectors.
- Score sentiment using versioned providers.
- Store sentiment results with confidence and model traceability.
- Show dashboard summaries and mention feeds.
- Generate simple threshold-based alerts.
- Export governed data.

Rejected from V1:

- Trading signals.
- Stock prediction.
- BUY/SELL/HOLD language.
- Automated campaign execution.
- Unlicensed scraping.
- Large-scale real-time streaming infrastructure.
- Advanced attribution or ROI prediction.
- AI agents that act without review.

---

## Scope Boundary

### In Scope for V1 Candidate

1. Workspace-scoped monitored keywords.
2. Workspace-scoped monitored sources.
3. Governed ingestion job records.
4. Normalized social mentions.
5. Sentiment scoring results.
6. Versioned sentiment providers.
7. Trend snapshots for dashboard performance.
8. Simple alert rules and alert events.
9. CSV/JSON export.
10. Audit events for user and system actions.
11. RBAC enforcement.
12. Tenant isolation.
13. Idempotency for ingestion and scoring jobs.
14. Rate-limit and connector failure visibility.

### Out of Scope for V1 Candidate

1. Full social media management suite.
2. Auto-publishing.
3. Paid campaign execution.
4. AI campaign orchestration.
5. Advanced anomaly detection.
6. Cross-channel attribution.
7. Uplift modeling.
8. ROI prediction.
9. ClickHouse or large-scale analytics warehouse.
10. Kafka/Spark-style streaming unless separately approved.
11. Trading, stock, or investment predictions.
12. Scraping that violates platform terms.
13. Notebook-based ML execution in production.

---

## Non-Negotiable Governance Rules

1. `Workspace` remains the tenant boundary.
2. No Social Listening record may exist without `workspace_id`.
3. Sentiment output is an analytical signal, not verified truth.
4. Sentiment results must store `model_name`, `model_version`, and `confidence_score`.
5. External source data must respect platform terms and privacy obligations.
6. Connector credentials must be encrypted and never exposed to users or logs.
7. Every ingestion job must be idempotent.
8. Duplicate external mentions must not create duplicate business facts.
9. Alerts must be explainable and traceable to source snapshots or mentions.
10. AI-generated summaries must not trigger automatic publishing or paid actions.
11. Arabic sentiment must not be marketed as highly accurate until evaluated against Arabic/Saudi/Gulf data.
12. No reviewed GitHub repository becomes a source of truth for Marketing OS.
13. Any external library must pass license and security review before use.
14. VADER may be used only as an English baseline/fallback provider, not as a universal NLP engine.
15. Trading-language concepts must be transformed into marketing-safe terminology.

---

## Candidate Domain Terms

| Term | Meaning |
|---|---|
| Monitored Source | A governed external channel or platform category from which data may be ingested |
| Monitored Keyword | A brand, hashtag, product, competitor, campaign term, or search phrase tracked by the workspace |
| Social Mention | A normalized external mention or item relevant to a monitored keyword |
| Sentiment Result | A versioned analytical score generated for a mention |
| Analysis Job | A background process for ingestion, scoring, aggregation, or alerting |
| Trend Snapshot | Aggregated metrics over a defined time window |
| Alert Rule | A configured threshold or condition |
| Alert Event | A triggered alert instance derived from a rule |

---

## Candidate User Roles

The exact permission model must be aligned with the existing project RBAC model. Candidate permissions:

| Role Capability | Description |
|---|---|
| Manage monitored keywords | Create, update, deactivate tracked terms |
| Manage monitored sources | Configure allowed platforms/connectors |
| View social listening dashboard | Read aggregated metrics and mention feed |
| View raw/normalized mentions | Access permitted mention text and metadata |
| Manage alert rules | Create, update, deactivate alert thresholds |
| Acknowledge alert events | Mark alerts as reviewed |
| Export social listening data | Export filtered data under governance rules |
| View audit trail | Inspect Social Listening actions and system events |

---

# V1 Candidate Epics

## Epic 1: Monitored Keywords Management

### Objective

Allow workspace users to define what the system should monitor, without creating uncontrolled or cross-tenant tracking behavior.

### User Stories

#### Story SL-001: Create Monitored Keyword

As an authorized workspace user, I want to create a monitored keyword so the platform can track mentions relevant to my brand, product, campaign, or competitor.

**Acceptance Criteria**

- User can create a monitored keyword within the active workspace.
- Required fields include keyword text and keyword type.
- Keyword belongs to exactly one workspace.
- Duplicate active keywords within the same workspace are rejected or normalized according to a defined rule.
- Creation is recorded in the audit log.
- Unauthorized users receive the standard authorization error model.

**Affected Entities**

- `MonitoredKeyword`
- `AuditLog`

**Candidate Endpoints**

- `POST /workspaces/{workspaceId}/social-listening/keywords`

**Candidate Permissions**

- `social_listening.keyword.create`

**Audit Events**

- `social_listening.keyword.created`

**Error States**

- Workspace not found.
- User not authorized.
- Duplicate keyword.
- Invalid keyword type.
- Invalid language hint.

---

#### Story SL-002: List and Filter Monitored Keywords

As an authorized workspace user, I want to list monitored keywords so I can understand what the workspace is currently tracking.

**Acceptance Criteria**

- User can list keywords only within the active workspace.
- Filtering supports status, keyword type, language hint, and created date.
- Pagination is required.
- Response must not include other workspace records.

**Affected Entities**

- `MonitoredKeyword`

**Candidate Endpoints**

- `GET /workspaces/{workspaceId}/social-listening/keywords`

**Candidate Permissions**

- `social_listening.keyword.read`

**Audit Events**

- Optional read audit if existing governance requires read tracking.

**Error States**

- Workspace not found.
- User not authorized.
- Invalid filter.

---

#### Story SL-003: Update or Deactivate Monitored Keyword

As an authorized workspace user, I want to update or deactivate a monitored keyword so tracking remains current without deleting historical truth.

**Acceptance Criteria**

- User can update non-historical configuration fields.
- User can deactivate a keyword.
- Deactivation does not delete historical mentions, sentiment results, snapshots, or alerts.
- Changes are audit logged.
- Historical data remains associated with the original keyword identity.

**Affected Entities**

- `MonitoredKeyword`
- `AuditLog`

**Candidate Endpoints**

- `PATCH /workspaces/{workspaceId}/social-listening/keywords/{keywordId}`

**Candidate Permissions**

- `social_listening.keyword.update`

**Audit Events**

- `social_listening.keyword.updated`
- `social_listening.keyword.deactivated`

**Error States**

- Keyword not found.
- Workspace mismatch.
- User not authorized.
- Invalid status transition.

---

## Epic 2: Governed Source and Connector Tracking

### Objective

Allow the platform to track external source availability and connector health without allowing uncontrolled scraping or unmanaged credentials.

### User Stories

#### Story SL-004: Register Monitored Source

As an authorized user, I want to register a monitored source so the system knows which external platforms or channels are allowed for monitoring.

**Acceptance Criteria**

- Source must belong to a workspace.
- Source type must come from an approved enum.
- Connector credentials are referenced, not exposed.
- Source can be active, paused, or disabled.
- Creation and status changes are audit logged.

**Affected Entities**

- `MonitoredSource`
- `ConnectorCredential`
- `AuditLog`

**Candidate Endpoints**

- `POST /workspaces/{workspaceId}/social-listening/sources`
- `GET /workspaces/{workspaceId}/social-listening/sources`
- `PATCH /workspaces/{workspaceId}/social-listening/sources/{sourceId}`

**Candidate Permissions**

- `social_listening.source.create`
- `social_listening.source.read`
- `social_listening.source.update`

**Audit Events**

- `social_listening.source.created`
- `social_listening.source.updated`
- `social_listening.source.paused`
- `social_listening.source.disabled`

**Error States**

- Unsupported source type.
- Missing connector credential.
- Invalid source status transition.
- User not authorized.

---

#### Story SL-005: Track Source Rate Limit and Failure State

As the system, I want to track source rate limits and connector failures so ingestion remains governed and observable.

**Acceptance Criteria**

- Rate-limit state is recorded per workspace/source/provider.
- Connector failure events are persisted.
- The system avoids repeated uncontrolled retries.
- Failed jobs are traceable to source state.

**Affected Entities**

- `SourceRateLimitState`
- `AnalysisJob`
- `MonitoredSource`

**Candidate Endpoints**

- `GET /workspaces/{workspaceId}/social-listening/sources/{sourceId}/health`

**Candidate Permissions**

- `social_listening.source.read`

**Audit Events**

- `social_listening.source.rate_limited`
- `social_listening.source.failure_recorded`

**Error States**

- Source not found.
- Workspace mismatch.
- User not authorized.

---

## Epic 3: Mention Ingestion

### Objective

Ingest external mentions in a controlled, idempotent, and auditable manner.

### User Stories

#### Story SL-006: Create Ingestion Job

As the system or authorized user, I want to create an ingestion job so monitored data can be collected asynchronously.

**Acceptance Criteria**

- Job is workspace-scoped.
- Job type is explicit.
- Job has a deterministic idempotency key where applicable.
- Duplicate jobs are deduplicated or safely ignored.
- Job status transitions are controlled.

**Affected Entities**

- `AnalysisJob`
- `MonitoredSource`
- `MonitoredKeyword`

**Candidate Endpoints**

- `POST /workspaces/{workspaceId}/social-listening/ingestion-jobs`
- `GET /workspaces/{workspaceId}/social-listening/analysis-jobs/{jobId}`

**Candidate Permissions**

- `social_listening.ingestion.create`
- `social_listening.job.read`

**Audit Events**

- `social_listening.ingestion_job.created`
- `social_listening.ingestion_job.started`
- `social_listening.ingestion_job.completed`
- `social_listening.ingestion_job.failed`

**Error States**

- Invalid source.
- Invalid keyword scope.
- Duplicate idempotency key.
- Source disabled.
- Rate limit active.

---

#### Story SL-007: Store Normalized Social Mention

As the system, I want to store normalized mentions so downstream sentiment, dashboards, and alerts can rely on a consistent data shape.

**Acceptance Criteria**

- Each mention belongs to one workspace.
- Each mention references source and keyword matching context.
- External IDs are deduplicated per source/workspace.
- Raw payload is not blindly exposed.
- Stored text respects data retention and privacy rules.

**Affected Entities**

- `SocialMention`
- `MonitoredSource`
- `MonitoredKeyword`

**Candidate Endpoints**

- Internal worker operation only for V1 unless manual ingestion is approved.
- Optional read endpoint: `GET /workspaces/{workspaceId}/social-listening/mentions`

**Candidate Permissions**

- `social_listening.mention.read`

**Audit Events**

- `social_listening.mention.ingested`
- `social_listening.mention.duplicate_detected`

**Error States**

- Missing workspace.
- Missing source.
- Duplicate external mention.
- Unsupported payload.
- Data retention violation.

---

## Epic 4: Sentiment Scoring

### Objective

Generate governed sentiment scores with model traceability, confidence, and language handling.

### User Stories

#### Story SL-008: Score Mention Sentiment

As the system, I want to score mention sentiment so the workspace can understand brand perception signals.

**Acceptance Criteria**

- Sentiment scoring runs asynchronously or through a controlled worker path.
- Result stores label, score, confidence, language, model name, and model version.
- A mention may have multiple results across model versions if reprocessing is explicitly triggered.
- Failed scoring does not corrupt the original mention.
- Sentiment result is workspace-scoped.

**Affected Entities**

- `SocialMention`
- `SentimentResult`
- `AnalysisJob`

**Candidate Endpoints**

- Internal worker operation.
- Optional: `POST /workspaces/{workspaceId}/social-listening/mentions/{mentionId}/score`
- `GET /workspaces/{workspaceId}/social-listening/mentions/{mentionId}/sentiment-results`

**Candidate Permissions**

- `social_listening.sentiment.create`
- `social_listening.sentiment.read`

**Audit Events**

- `social_listening.sentiment.scored`
- `social_listening.sentiment.scoring_failed`
- `social_listening.sentiment.reprocessed`

**Error States**

- Mention not found.
- Workspace mismatch.
- Unsupported language.
- Provider unavailable.
- Invalid model version.

---

#### Story SL-009: Use English Baseline Sentiment Provider

As the system, I want to use a lightweight English sentiment provider so V1 can deliver a low-cost baseline for English social text.

**Acceptance Criteria**

- Provider is explicitly named and versioned.
- Provider can be disabled by configuration.
- Provider result is labeled as baseline/fallback where appropriate.
- Provider is not used for Arabic unless explicitly supported.
- License and dependency review is completed before implementation.

**Affected Entities**

- `SentimentProviderConfig`
- `SentimentResult`

**Candidate Endpoints**

- No public endpoint required for V1.
- Optional admin/config endpoint only if already aligned with project settings architecture.

**Candidate Permissions**

- `social_listening.sentiment_provider.manage` if exposed.

**Audit Events**

- `social_listening.sentiment_provider.enabled`
- `social_listening.sentiment_provider.disabled`
- `social_listening.sentiment_provider.updated`

**Error States**

- Provider disabled.
- Unsupported language.
- Dependency unavailable.

---

## Epic 5: Trend Snapshots and Dashboard

### Objective

Provide dashboard-ready aggregated metrics without forcing the UI to compute heavy analytics directly from raw mentions.

### User Stories

#### Story SL-010: Generate Trend Snapshots

As the system, I want to generate trend snapshots so dashboards can show sentiment and mention movement efficiently.

**Acceptance Criteria**

- Snapshot is workspace-scoped.
- Snapshot has a clear time window.
- Snapshot references keyword and source dimensions where applicable.
- Snapshot stores mention counts and sentiment distribution.
- Snapshot generation is idempotent per workspace/keyword/source/window.

**Affected Entities**

- `TrendSnapshot`
- `SentimentResult`
- `SocialMention`
- `AnalysisJob`

**Candidate Endpoints**

- Internal worker operation.
- Read endpoint: `GET /workspaces/{workspaceId}/social-listening/trend-snapshots`

**Candidate Permissions**

- `social_listening.dashboard.read`

**Audit Events**

- `social_listening.trend_snapshot.generated`
- `social_listening.trend_snapshot.generation_failed`

**Error States**

- Invalid time window.
- Workspace mismatch.
- No eligible data.

---

#### Story SL-011: View Social Listening Dashboard

As a workspace user, I want to view sentiment trends, mention volume, and recent mentions so I can understand brand perception quickly.

**Acceptance Criteria**

- Dashboard data is workspace-scoped.
- Filters include keyword, source, language, sentiment, and time range.
- Dashboard reads aggregated snapshots where available.
- Recent mentions are paginated.
- User cannot view data from other workspaces.

**Affected Entities**

- `TrendSnapshot`
- `SocialMention`
- `SentimentResult`

**Candidate Endpoints**

- `GET /workspaces/{workspaceId}/social-listening/dashboard/summary`
- `GET /workspaces/{workspaceId}/social-listening/mentions`

**Candidate Permissions**

- `social_listening.dashboard.read`
- `social_listening.mention.read`

**Audit Events**

- Optional read audit if required by project policy.

**Error States**

- Invalid filter.
- User not authorized.
- Workspace not found.

---

## Epic 6: Alert Rules and Alert Events

### Objective

Allow users to detect meaningful shifts in mention volume or sentiment without introducing automated campaign action.

### User Stories

#### Story SL-012: Create Alert Rule

As an authorized user, I want to define alert rules so the system can notify me about negative sentiment spikes or unusual mention volume.

**Acceptance Criteria**

- Rule belongs to one workspace.
- Rule references allowed dimensions such as keyword, source, sentiment, or volume threshold.
- Rule has severity.
- Rule can be enabled, paused, or disabled.
- Rule changes are audit logged.

**Affected Entities**

- `AlertRule`
- `MonitoredKeyword`
- `AuditLog`

**Candidate Endpoints**

- `POST /workspaces/{workspaceId}/social-listening/alert-rules`
- `GET /workspaces/{workspaceId}/social-listening/alert-rules`
- `PATCH /workspaces/{workspaceId}/social-listening/alert-rules/{alertRuleId}`

**Candidate Permissions**

- `social_listening.alert_rule.create`
- `social_listening.alert_rule.read`
- `social_listening.alert_rule.update`

**Audit Events**

- `social_listening.alert_rule.created`
- `social_listening.alert_rule.updated`
- `social_listening.alert_rule.paused`
- `social_listening.alert_rule.disabled`

**Error States**

- Invalid threshold.
- Invalid severity.
- Keyword not found.
- User not authorized.

---

#### Story SL-013: Generate Alert Event

As the system, I want to generate alert events from trend snapshots so users can act on meaningful changes.

**Acceptance Criteria**

- Alert event belongs to workspace.
- Alert event references the triggering rule.
- Alert event references the triggering snapshot or input evidence.
- Duplicate alert events are controlled by idempotency rules.
- Alert event does not trigger automatic campaign execution.

**Affected Entities**

- `AlertEvent`
- `AlertRule`
- `TrendSnapshot`
- `AnalysisJob`

**Candidate Endpoints**

- Internal worker operation.
- `GET /workspaces/{workspaceId}/social-listening/alert-events`

**Candidate Permissions**

- `social_listening.alert_event.read`

**Audit Events**

- `social_listening.alert_event.created`

**Error States**

- Rule disabled.
- Snapshot not found.
- Duplicate alert event.

---

#### Story SL-014: Acknowledge Alert Event

As an authorized user, I want to acknowledge an alert event so the team knows it has been reviewed.

**Acceptance Criteria**

- User can acknowledge only workspace alert events.
- Acknowledgement stores user and timestamp.
- Acknowledgement does not delete or mutate the original alert evidence.
- Action is audit logged.

**Affected Entities**

- `AlertEvent`
- `AuditLog`

**Candidate Endpoints**

- `POST /workspaces/{workspaceId}/social-listening/alert-events/{alertEventId}/acknowledge`

**Candidate Permissions**

- `social_listening.alert_event.acknowledge`

**Audit Events**

- `social_listening.alert_event.acknowledged`

**Error States**

- Alert event not found.
- Already acknowledged.
- User not authorized.

---

## Epic 7: Export and Reporting

### Objective

Allow governed exports for operational review without bypassing permissions or exposing raw data beyond policy.

### User Stories

#### Story SL-015: Export Social Listening Data

As an authorized user, I want to export filtered social listening data so I can share or analyze it outside the dashboard.

**Acceptance Criteria**

- Export is workspace-scoped.
- Export respects user permissions.
- Export supports CSV and JSON.
- Export filters match dashboard filters.
- Export event is audit logged.
- Raw payload is excluded unless explicitly allowed by governance.

**Affected Entities**

- `SocialMention`
- `SentimentResult`
- `TrendSnapshot`
- `AuditLog`

**Candidate Endpoints**

- `POST /workspaces/{workspaceId}/social-listening/exports`
- `GET /workspaces/{workspaceId}/social-listening/exports/{exportId}`

**Candidate Permissions**

- `social_listening.export.create`
- `social_listening.export.read`

**Audit Events**

- `social_listening.export.created`
- `social_listening.export.downloaded`

**Error States**

- Invalid export format.
- User not authorized.
- Filter too broad.
- Export expired.

---

# Candidate Entities Summary

| Entity | V1 Candidate | Notes |
|---|---:|---|
| `MonitoredSource` | Yes | Required for governed source tracking |
| `MonitoredKeyword` | Yes | Required for workspace tracking configuration |
| `SocialMention` | Yes | Required for normalized mention storage |
| `SentimentResult` | Yes | Required for model traceability |
| `AnalysisJob` | Yes | Required for async reliability |
| `TrendSnapshot` | Yes | Required for performant dashboards |
| `AlertRule` | Yes | Required for threshold alerts |
| `AlertEvent` | Yes | Required for alert history |
| `SourceRateLimitState` | Yes | Required for connector governance |
| `ConnectorCredential` | Conditional | Should reuse existing connector credential model if already present |
| `AuditLog` | Yes | Should reuse existing audit model |
| `SentimentProviderConfig` | Conditional | Needed only if provider configuration is user/admin-controlled |
| `ExportJob` | Conditional | Use if project already has async export model |

---

# Candidate API Surface Summary

These endpoints are provisional and must not be treated as approved OpenAPI until promoted.

| Method | Path | Purpose |
|---|---|---|
| POST | `/workspaces/{workspaceId}/social-listening/keywords` | Create monitored keyword |
| GET | `/workspaces/{workspaceId}/social-listening/keywords` | List monitored keywords |
| PATCH | `/workspaces/{workspaceId}/social-listening/keywords/{keywordId}` | Update/deactivate keyword |
| POST | `/workspaces/{workspaceId}/social-listening/sources` | Register monitored source |
| GET | `/workspaces/{workspaceId}/social-listening/sources` | List sources |
| PATCH | `/workspaces/{workspaceId}/social-listening/sources/{sourceId}` | Update source |
| GET | `/workspaces/{workspaceId}/social-listening/sources/{sourceId}/health` | Source health/rate-limit state |
| POST | `/workspaces/{workspaceId}/social-listening/ingestion-jobs` | Start ingestion job |
| GET | `/workspaces/{workspaceId}/social-listening/analysis-jobs/{jobId}` | Read job status |
| GET | `/workspaces/{workspaceId}/social-listening/mentions` | List mentions |
| GET | `/workspaces/{workspaceId}/social-listening/mentions/{mentionId}/sentiment-results` | Read sentiment results |
| GET | `/workspaces/{workspaceId}/social-listening/trend-snapshots` | Read trend snapshots |
| GET | `/workspaces/{workspaceId}/social-listening/dashboard/summary` | Dashboard summary |
| POST | `/workspaces/{workspaceId}/social-listening/alert-rules` | Create alert rule |
| GET | `/workspaces/{workspaceId}/social-listening/alert-rules` | List alert rules |
| PATCH | `/workspaces/{workspaceId}/social-listening/alert-rules/{alertRuleId}` | Update alert rule |
| GET | `/workspaces/{workspaceId}/social-listening/alert-events` | List alert events |
| POST | `/workspaces/{workspaceId}/social-listening/alert-events/{alertEventId}/acknowledge` | Acknowledge alert |
| POST | `/workspaces/{workspaceId}/social-listening/exports` | Create export |
| GET | `/workspaces/{workspaceId}/social-listening/exports/{exportId}` | Read/download export |

---

# Candidate Permissions Summary

| Permission | Purpose |
|---|---|
| `social_listening.keyword.create` | Create monitored keywords |
| `social_listening.keyword.read` | Read monitored keywords |
| `social_listening.keyword.update` | Update/deactivate monitored keywords |
| `social_listening.source.create` | Register monitored sources |
| `social_listening.source.read` | Read monitored sources and health |
| `social_listening.source.update` | Update monitored source status/config |
| `social_listening.ingestion.create` | Start ingestion jobs |
| `social_listening.job.read` | Read job status |
| `social_listening.mention.read` | Read normalized mentions |
| `social_listening.sentiment.create` | Trigger controlled sentiment scoring |
| `social_listening.sentiment.read` | Read sentiment results |
| `social_listening.dashboard.read` | View dashboard summary and snapshots |
| `social_listening.alert_rule.create` | Create alert rules |
| `social_listening.alert_rule.read` | Read alert rules |
| `social_listening.alert_rule.update` | Update alert rules |
| `social_listening.alert_event.read` | Read alert events |
| `social_listening.alert_event.acknowledge` | Acknowledge alert events |
| `social_listening.export.create` | Create exports |
| `social_listening.export.read` | Read/download exports |

---

# Candidate Audit Events Summary

| Event | Trigger |
|---|---|
| `social_listening.keyword.created` | Keyword created |
| `social_listening.keyword.updated` | Keyword updated |
| `social_listening.keyword.deactivated` | Keyword deactivated |
| `social_listening.source.created` | Source registered |
| `social_listening.source.updated` | Source updated |
| `social_listening.source.paused` | Source paused |
| `social_listening.source.disabled` | Source disabled |
| `social_listening.source.rate_limited` | Rate limit observed |
| `social_listening.source.failure_recorded` | Connector failure recorded |
| `social_listening.ingestion_job.created` | Ingestion job created |
| `social_listening.ingestion_job.started` | Ingestion job started |
| `social_listening.ingestion_job.completed` | Ingestion job completed |
| `social_listening.ingestion_job.failed` | Ingestion job failed |
| `social_listening.mention.ingested` | Mention stored |
| `social_listening.mention.duplicate_detected` | Duplicate mention detected |
| `social_listening.sentiment.scored` | Sentiment result created |
| `social_listening.sentiment.scoring_failed` | Sentiment scoring failed |
| `social_listening.sentiment.reprocessed` | Mention reprocessed |
| `social_listening.trend_snapshot.generated` | Trend snapshot generated |
| `social_listening.trend_snapshot.generation_failed` | Trend snapshot generation failed |
| `social_listening.alert_rule.created` | Alert rule created |
| `social_listening.alert_rule.updated` | Alert rule updated |
| `social_listening.alert_rule.paused` | Alert rule paused |
| `social_listening.alert_rule.disabled` | Alert rule disabled |
| `social_listening.alert_event.created` | Alert event generated |
| `social_listening.alert_event.acknowledged` | Alert event acknowledged |
| `social_listening.export.created` | Export created |
| `social_listening.export.downloaded` | Export downloaded |

---

# Candidate QA Coverage

This section lists what QA must cover later. It is not the QA suite itself.

## Tenant Isolation

- User cannot create keyword under another workspace.
- User cannot list another workspace's keywords, sources, mentions, snapshots, alerts, or exports.
- Worker jobs cannot write records to the wrong workspace.
- Duplicate external IDs are scoped by workspace and source.

## RBAC

- User without permission cannot manage keywords.
- User without permission cannot configure sources.
- User without permission cannot export data.
- User without permission cannot acknowledge alerts.

## Idempotency

- Duplicate ingestion job does not duplicate mentions.
- Duplicate scoring job does not create uncontrolled duplicate sentiment results.
- Duplicate snapshot generation for the same window is controlled.
- Duplicate alert event generation is controlled.

## Data Integrity

- Sentiment result cannot exist without mention and workspace.
- Trend snapshot window cannot be invalid.
- Alert event must reference rule and evidence.
- Historical mentions remain after keyword deactivation.

## Privacy and Governance

- Raw payload is not returned by default.
- Connector credentials are never exposed.
- Export respects filters and permissions.
- Audit events are recorded for changes and exports.

## Error Model

- Standard error response for authorization failure.
- Standard error response for validation failure.
- Standard error response for workspace mismatch.
- Standard error response for rate-limit state.
- Standard error response for provider failure.

---

# Promotion Checklist

Before Social Listening enters an actual Sprint, complete the following:

1. Confirm Social Listening is approved for V1.
2. Decide whether it is Core V1 or Extended V1.
3. Create `docs/social_listening_v1_erd.md`.
4. Create SQL DDL or migration design.
5. Create OpenAPI contract patch.
6. Create QA test suite.
7. Define provider strategy for English and Arabic.
8. Define connector sources allowed in V1.
9. Define data retention and privacy rules.
10. Confirm dependency/license review for any reused open-source component.

---

## Final Recommendation

Adopt Social Listening into V1 only as a controlled, bounded module focused on monitored keywords, mention ingestion, sentiment scoring, snapshots, alerts, and exports.

Do not adopt any reviewed GitHub repository as a complete subsystem.

Recommended next step if approved:

1. Convert this backlog into `docs/social_listening_v1_erd.md`.
2. Then create OpenAPI contract patch.
3. Then create QA suite.
4. Then create implementation prompt for Codex.

Decision status: **Candidate backlog prepared; implementation not yet approved.**
