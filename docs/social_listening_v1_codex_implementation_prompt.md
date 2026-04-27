# Social Listening V1 Codex Implementation Prompt

## Purpose

Use this prompt with Codex or an implementation agent to implement **Social Listening V1 only** inside `henter36/marketing-os`.

This prompt is intentionally strict. It prevents scope expansion, protects existing guardrails, and forces implementation to follow the approved documentation chain.

---

## Implementation Authority

Codex must treat the following files as the **only approved sources** for Social Listening V1:

1. `docs/social_sentiment_github_feature_extraction_and_fit_gap.md`
2. `docs/social_listening_v1_backlog.md`
3. `docs/social_listening_v1_erd.md`
4. `docs/social_listening_v1_sql_ddl.md`
5. `docs/social_listening_v1_openapi_patch.yaml`
6. `docs/social_listening_v1_qa_suite.md`

If any conflict exists between files, use this priority order:

1. `docs/social_listening_v1_openapi_patch.yaml`
2. `docs/social_listening_v1_sql_ddl.md`
3. `docs/social_listening_v1_erd.md`
4. `docs/social_listening_v1_backlog.md`
5. `docs/social_sentiment_github_feature_extraction_and_fit_gap.md`

The GitHub feature extraction document is advisory only. It is not implementation authority unless a capability is also present in the backlog, ERD, SQL DDL, OpenAPI, and QA suite.

---

## Hard Scope Rule

Implement **Social Listening V1 only**.

Do not implement Sprint 4+, Post V1, Extended V1, or any unrelated feature.

Do not refactor the repository outside the minimum required Social Listening changes.

Do not move root files, restructure unrelated modules, replace the application framework, introduce a new architecture style, or perform cleanup unrelated to this implementation.

---

## Mandatory Pre-Coding Steps

Before writing code, Codex must:

1. Read the existing repository structure.
2. Read the current README, but do not treat it as authoritative if it conflicts with approved docs.
3. Read all approved Social Listening documents listed above.
4. Inspect existing patterns for:
   - routes/controllers
   - services
   - database migrations
   - models/entities
   - auth middleware
   - RBAC/permissions
   - audit logging
   - error model
   - background jobs/workers
   - tests
5. Identify whether the project already has:
   - `workspaces`
   - `users`
   - `audit_logs`
   - `connector_credentials`
   - generic background jobs
   - existing ErrorModel
   - existing idempotency handling
6. Produce a short implementation plan before changing code.

The implementation plan must list:

- files expected to change
- migrations to add
- endpoints to implement
- tests to add
- assumptions
- any missing core platform dependency

If a required core dependency does not exist, Codex must stop and report the gap instead of inventing an incompatible replacement.

---

## Approved V1 Capabilities

Codex may implement only the following:

1. Monitored keywords.
2. Monitored sources.
3. Source health and rate-limit state.
4. Ingestion job records.
5. Normalized social mentions.
6. Mention-to-keyword matches.
7. Sentiment provider configuration.
8. Sentiment result records.
9. Trend snapshots.
10. Dashboard summary read model.
11. Alert rules.
12. Alert events.
13. Alert acknowledgement.
14. Export job records.
15. RBAC permissions for Social Listening.
16. Audit events for write and sensitive actions.
17. Idempotency handling for approved write operations.
18. Standard ErrorModel handling.
19. Tests required by the QA suite.

---

## Explicitly Forbidden Scope

Codex must not implement:

1. Auto-publishing.
2. Paid campaign execution.
3. AI agents.
4. Autonomous actions.
5. Stock prediction.
6. Trading recommendations.
7. BUY/SELL/HOLD signals.
8. Advanced attribution.
9. ROI prediction.
10. Uplift modeling.
11. MMM.
12. ClickHouse.
13. Kafka/Spark/streaming warehouse.
14. Vector embeddings.
15. Cross-channel identity stitching.
16. Full social media management suite.
17. Unlicensed scraping.
18. Notebook-based ML execution in production.
19. Direct dependency on any reviewed GitHub repository as a subsystem.
20. Any table or endpoint not present in the approved docs.

If Codex thinks a forbidden feature is necessary, it must stop and explain why instead of implementing it.

---

## Approved Database Tables

Implement database support only for the tables approved in `docs/social_listening_v1_sql_ddl.md`:

1. `social_monitored_sources`
2. `social_source_rate_limit_states`
3. `social_analysis_jobs`
4. `social_source_failure_events`
5. `social_monitored_keywords`
6. `social_mentions`
7. `social_mention_keyword_matches`
8. `social_sentiment_provider_configs`
9. `social_sentiment_results`
10. `social_trend_snapshots`
11. `social_alert_rules`
12. `social_alert_events`
13. `social_export_jobs`

Do not create additional Social Listening tables without explicit approval.

If the repository already has equivalent generic tables for jobs, exports, connector credentials, or audit logs, reuse or integrate with them instead of duplicating responsibilities, but preserve the approved data requirements.

---

## Migration Rules

Codex must:

1. Follow the repository's existing migration style.
2. Use PostgreSQL-compatible schema.
3. Preserve `workspace_id` on every Social Listening business table.
4. Include constraints from the SQL DDL where supported.
5. Include indexes needed for tenant isolation, lookups, idempotency, and dashboards.
6. Avoid storing raw external payloads directly in primary tables.
7. Avoid storing secrets in Social Listening tables.
8. Preserve historical records when sources or keywords are disabled.

Required migration order:

1. `social_monitored_sources`
2. `social_source_rate_limit_states`
3. `social_analysis_jobs`
4. `social_source_failure_events`
5. `social_monitored_keywords`
6. FK from `social_analysis_jobs.monitored_keyword_id`
7. `social_mentions`
8. `social_mention_keyword_matches`
9. `social_sentiment_provider_configs`
10. `social_sentiment_results`
11. `social_trend_snapshots`
12. `social_alert_rules`
13. `social_alert_events`
14. `social_export_jobs`

If the framework cannot express a specific constraint directly, implement it at service level and document the limitation.

---

## Tenant Isolation Rules

Every endpoint, service method, repository query, worker, and export must enforce tenant isolation.

Minimum requirements:

1. All Social Listening records must include `workspace_id`.
2. All read queries must filter by `workspace_id`.
3. All write operations must use workspace context from the authenticated route/session, not from user-supplied body fields.
4. Child records must belong to the same workspace as parent records.
5. Cross-workspace resource references must return a safe `404` or policy-approved `403`.
6. Export jobs must never include another workspace's data.
7. Worker payloads must include and validate workspace context.

Tenant isolation failures are release blockers.

---

## RBAC Rules

Implement or register the following permissions according to existing platform conventions:

- `social_listening.keyword.create`
- `social_listening.keyword.read`
- `social_listening.keyword.update`
- `social_listening.source.create`
- `social_listening.source.read`
- `social_listening.source.update`
- `social_listening.ingestion.create`
- `social_listening.job.read`
- `social_listening.mention.read`
- `social_listening.sentiment.create`
- `social_listening.sentiment.read`
- `social_listening.dashboard.read`
- `social_listening.alert_rule.create`
- `social_listening.alert_rule.read`
- `social_listening.alert_rule.update`
- `social_listening.alert_event.read`
- `social_listening.alert_event.acknowledge`
- `social_listening.export.create`
- `social_listening.export.read`

If the platform uses roles rather than raw permissions, map these permissions into the existing role model without weakening access control.

---

## Approved API Surface

Implement endpoints from `docs/social_listening_v1_openapi_patch.yaml` only.

Required endpoints:

1. `POST /workspaces/{workspaceId}/social-listening/keywords`
2. `GET /workspaces/{workspaceId}/social-listening/keywords`
3. `PATCH /workspaces/{workspaceId}/social-listening/keywords/{keywordId}`
4. `POST /workspaces/{workspaceId}/social-listening/sources`
5. `GET /workspaces/{workspaceId}/social-listening/sources`
6. `PATCH /workspaces/{workspaceId}/social-listening/sources/{sourceId}`
7. `GET /workspaces/{workspaceId}/social-listening/sources/{sourceId}/health`
8. `POST /workspaces/{workspaceId}/social-listening/ingestion-jobs`
9. `GET /workspaces/{workspaceId}/social-listening/analysis-jobs/{jobId}`
10. `GET /workspaces/{workspaceId}/social-listening/mentions`
11. `GET /workspaces/{workspaceId}/social-listening/mentions/{mentionId}/sentiment-results`
12. `GET /workspaces/{workspaceId}/social-listening/trend-snapshots`
13. `GET /workspaces/{workspaceId}/social-listening/dashboard/summary`
14. `POST /workspaces/{workspaceId}/social-listening/alert-rules`
15. `GET /workspaces/{workspaceId}/social-listening/alert-rules`
16. `PATCH /workspaces/{workspaceId}/social-listening/alert-rules/{alertRuleId}`
17. `GET /workspaces/{workspaceId}/social-listening/alert-events`
18. `POST /workspaces/{workspaceId}/social-listening/alert-events/{alertEventId}/acknowledge`
19. `POST /workspaces/{workspaceId}/social-listening/exports`
20. `GET /workspaces/{workspaceId}/social-listening/exports`
21. `GET /workspaces/{workspaceId}/social-listening/exports/{exportId}`

Do not add endpoints for:

- publish actions
- paid execution
- autonomous actions
- trading signals
- raw scraping controls
- direct AI agent execution

---

## Error Model Rules

All errors must follow the existing project ErrorModel. If no project ErrorModel exists, implement the shape defined in OpenAPI:

```json
{
  "code": "ERROR_CODE",
  "message": "Human-readable message",
  "traceId": "request-trace-id",
  "details": {}
}
```

Required error coverage:

- invalid request
- unauthorized
- forbidden
- workspace not found
- resource not found
- duplicate resource
- validation error
- rate limited
- expired export
- provider failure
- workspace mismatch

Do not expose secrets, raw provider payloads, or foreign workspace resource details in error responses.

---

## Audit Rules

Use the existing audit system. If it does not exist, stop and report the missing dependency.

Minimum audit events:

- `social_listening.keyword.created`
- `social_listening.keyword.updated`
- `social_listening.keyword.deactivated`
- `social_listening.source.created`
- `social_listening.source.updated`
- `social_listening.source.paused`
- `social_listening.source.disabled`
- `social_listening.source.rate_limited`
- `social_listening.source.failure_recorded`
- `social_listening.ingestion_job.created`
- `social_listening.ingestion_job.started`
- `social_listening.ingestion_job.completed`
- `social_listening.ingestion_job.failed`
- `social_listening.mention.ingested`
- `social_listening.mention.duplicate_detected`
- `social_listening.sentiment.scored`
- `social_listening.sentiment.scoring_failed`
- `social_listening.sentiment.reprocessed`
- `social_listening.trend_snapshot.generated`
- `social_listening.trend_snapshot.generation_failed`
- `social_listening.alert_rule.created`
- `social_listening.alert_rule.updated`
- `social_listening.alert_rule.paused`
- `social_listening.alert_rule.disabled`
- `social_listening.alert_event.created`
- `social_listening.alert_event.acknowledged`
- `social_listening.export.created`
- `social_listening.export.downloaded`

Audit payloads must include:

- workspace ID
- actor user ID where available
- entity type
- entity ID
- action
- timestamp
- request correlation or trace ID
- safe before/after summary for configuration changes

---

## Idempotency Rules

Codex must implement idempotency for write operations where specified.

Minimum idempotency requirements:

| Operation | Required Behavior |
|---|---|
| Create keyword | No duplicate active normalized keyword per workspace/type |
| Create source | No duplicate source display name per workspace/type unless intentionally soft-deleted |
| Create ingestion job | Unique per workspace/job type/idempotency key |
| Insert mention | Unique per workspace/source/external ID |
| Match mention to keyword | Unique per workspace/mention/keyword |
| Score sentiment | Unique per workspace/mention/model/version/input hash |
| Generate trend snapshot | Unique per workspace/keyword/source/window/grain |
| Generate alert event | Unique per workspace/rule/dedupe key |
| Create export | Safe retry behavior using idempotency key or deterministic filter hash |

Repeated requests must not create duplicate business facts.

---

## Privacy and Security Rules

Codex must ensure:

1. No Social Listening API response includes access tokens, refresh tokens, API keys, secrets, raw provider payloads, passwords, or unredacted sensitive credentials.
2. `raw_payload_ref` may be stored as a controlled reference only; raw payload must not be returned by default.
3. Author identifiers should use hashed fields unless existing policy explicitly allows raw handles.
4. Exports must exclude raw payload by default.
5. Provider failure messages must be sanitized.
6. Logs must not include secrets or raw payloads.
7. Connector credentials must be referenced, not copied into Social Listening tables.

---

## Sentiment Provider Rules

Codex may implement the data model for sentiment providers.

Codex may add a stub/provider interface for sentiment scoring if needed.

Codex must not overclaim Arabic accuracy.

Codex must not implement a full ML pipeline, model training flow, notebook execution, or external AI agent.

If VADER is added:

1. Use it only as an English baseline/fallback.
2. Store `model_name`, `model_version`, `is_baseline`, and `confidence_score`.
3. Ensure dependency license/security review is documented or left as a pending implementation note.
4. Do not use it for Arabic unless explicitly configured and justified.

---

## Worker and Job Rules

If existing background job infrastructure exists, use it.

If not, implement only job records and synchronous placeholders where necessary, but do not introduce a new heavy queue system without approval.

Worker operations must validate:

1. workspace context
2. parent-child workspace match
3. source status
4. terms policy status
5. rate-limit state
6. idempotency key
7. retry attempts

Worker failures must:

- not corrupt source or mention records
- not leak secrets
- update job status safely
- create failure state/event where required

---

## Dashboard Rules

Dashboard endpoints must prefer trend snapshots where available.

Dashboard must not perform expensive raw aggregation across all mentions unless bounded by date filters and pagination.

Required filters:

- keyword
- source
- language
- sentiment label where relevant
- date range

Dashboard data must never include another workspace's records.

---

## Export Rules

Export implementation must:

1. Require export permission.
2. Use workspace-scoped filters.
3. Store filters or filter hash.
4. Exclude raw payload by default.
5. Exclude connector secrets always.
6. Create audit event on export creation.
7. Create audit event on export download/access.
8. Expire export references if the platform supports expiry.

If export generation is not implemented in this sprint, the API may create export job records only if OpenAPI and QA expectations are updated accordingly. Do not fake completed exports.

---

## Required Tests

Codex must implement tests derived from `docs/social_listening_v1_qa_suite.md`.

Minimum required test groups:

1. Tenant isolation tests.
2. RBAC tests.
3. Idempotency tests.
4. Data integrity tests.
5. Privacy and security tests.
6. ErrorModel tests.
7. Audit event tests.
8. API contract tests.
9. Worker/job tests if worker behavior is implemented.
10. Database constraint tests.
11. Export governance tests.
12. Domain guardrail tests.

Release blocker examples:

- user can access another workspace data
- user without permission can write
- duplicate external mention can be inserted
- sentiment result overwrites historical score
- export includes raw payload or another workspace data
- source secrets appear in response/log/error
- alert event triggers auto-publish or paid action
- trading terminology appears in API or UI

---

## Suggested Implementation Sequence

Implement in this order:

1. Inspect existing repository structure and platform patterns.
2. Add/verify permissions.
3. Add migrations for approved tables.
4. Add models/entities/repositories.
5. Add service layer with workspace validation.
6. Add keyword endpoints and tests.
7. Add source endpoints and tests.
8. Add job endpoints and tests.
9. Add mention read endpoints and tests.
10. Add sentiment result read support and tests.
11. Add trend snapshot read/dashboard summary and tests.
12. Add alert rule/event endpoints and tests.
13. Add export job endpoints and tests.
14. Add audit events.
15. Add idempotency handling.
16. Run all tests.
17. Report final implementation summary and gaps.

Do not start with UI. Backend contract and tests must come first.

---

## Implementation Reporting Requirement

After implementation, Codex must produce a report containing:

1. Files changed.
2. Migrations added.
3. Endpoints implemented.
4. Permissions added.
5. Audit events implemented.
6. Tests added.
7. Tests passing/failing.
8. Any approved scope not completed.
9. Any assumptions made.
10. Any blocked items due to missing core dependencies.

The report should be saved as:

`docs/social_listening_v1_implementation_report.md`

---

## Acceptance Criteria

Implementation is acceptable only if:

1. All approved endpoints are implemented or explicitly documented as deferred with reason.
2. All Social Listening tables have workspace isolation.
3. RBAC is enforced.
4. Idempotency behavior is implemented for write paths.
5. Audit events exist for sensitive/write actions.
6. Error responses follow ErrorModel.
7. QA suite is converted to tests.
8. Tests pass.
9. No forbidden scope is introduced.
10. No unrelated repository cleanup or architecture rewrite is performed.

---

## Final Instruction to Codex

Implement Social Listening V1 only from the approved documents.

Do not guess missing product scope.

Do not expand into Post V1.

Do not introduce auto-execution, trading, or AI agents.

If the repository lacks a required core dependency, stop and report the dependency gap instead of building an incompatible substitute.

Protect tenant isolation, RBAC, auditability, idempotency, privacy, and historical truth above all else.
