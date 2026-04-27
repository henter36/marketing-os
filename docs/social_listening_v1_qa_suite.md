# Social Listening V1 QA Test Suite

## Document Status

This QA suite validates the Social Listening V1 candidate scope defined across:

- `docs/social_listening_v1_backlog.md`
- `docs/social_listening_v1_erd.md`
- `docs/social_listening_v1_sql_ddl.md`
- `docs/social_listening_v1_openapi_patch.yaml`

This is a **contract-level QA suite**, not a specific test framework implementation. It must be converted into integration tests, API contract tests, database constraint tests, and worker/job tests before implementation is considered complete.

---

## Executive QA Decision

Social Listening must not pass QA unless it proves the following:

1. Tenant isolation is enforced at API, database, worker, and export layers.
2. RBAC blocks unauthorized actions.
3. Idempotency prevents duplicate jobs, mentions, scores, snapshots, alerts, and unsafe exports.
4. Sentiment results are versioned and append-safe.
5. Historical truth is preserved when keywords, sources, or alert rules change.
6. Raw connector secrets and raw payloads are not exposed.
7. Alert events remain evidence-backed and do not trigger auto-publishing or paid execution.
8. Errors use the standard `ErrorModel`.
9. No trading/stock prediction semantics are introduced.
10. Social Listening remains a bounded V1 module.

---

## QA Scope

### In Scope

- Monitored keywords.
- Monitored sources.
- Source health and rate-limit state.
- Ingestion jobs.
- Normalized mentions.
- Sentiment results.
- Trend snapshots.
- Dashboard summary.
- Alert rules.
- Alert events.
- Alert acknowledgement.
- Export jobs.
- Audit events.
- Error model.
- Worker write safety.

### Out of Scope

The following must not be tested as V1 features because they must not exist in V1:

- Auto-publishing.
- Paid campaign execution.
- Autonomous AI agents.
- Stock prediction.
- BUY/SELL/HOLD signals.
- Advanced attribution.
- ROI prediction.
- Uplift modeling.
- ClickHouse/streaming warehouse behavior.
- Notebook-based production ML execution.

---

## Test Data Baseline

Use deterministic test data:

| Object | Value |
|---|---|
| Workspace A | `workspace_a` |
| Workspace B | `workspace_b` |
| Admin User A | User with all Social Listening permissions in Workspace A |
| Viewer User A | User with read-only Social Listening permissions in Workspace A |
| No Access User A | User authenticated but without Social Listening permissions |
| User B | User with permissions only in Workspace B |
| Source A | Active source under Workspace A |
| Source B | Active source under Workspace B |
| Keyword A | Active keyword under Workspace A |
| Keyword B | Active keyword under Workspace B |
| Mention A | Mention under Workspace A |
| Mention B | Mention under Workspace B |

All tests must avoid relying on random ordering.

---

# 1. Tenant Isolation Tests

## SL-QA-TENANT-001: Create keyword only in active workspace

**Purpose:** Ensure keyword creation cannot target another workspace.

**Preconditions:**

- Admin User A is authenticated.
- Admin User A belongs to Workspace A only.

**Steps:**

1. Send `POST /workspaces/{workspaceB}/social-listening/keywords` using Admin User A.

**Expected Result:**

- Response is `403` or `404` according to platform policy.
- No keyword is created in Workspace B.
- Error follows `ErrorModel`.

---

## SL-QA-TENANT-002: List keywords excludes other workspaces

**Purpose:** Ensure list endpoints are workspace-scoped.

**Preconditions:**

- Keyword A exists in Workspace A.
- Keyword B exists in Workspace B.
- Admin User A is authenticated.

**Steps:**

1. Send `GET /workspaces/{workspaceA}/social-listening/keywords`.

**Expected Result:**

- Response `200`.
- Keyword A is present.
- Keyword B is not present.

---

## SL-QA-TENANT-003: Cross-workspace source cannot be referenced by ingestion job

**Purpose:** Prevent workers and APIs from mixing workspace context.

**Preconditions:**

- Source B exists in Workspace B.
- Admin User A has permissions in Workspace A only.

**Steps:**

1. Send `POST /workspaces/{workspaceA}/social-listening/ingestion-jobs` with `sourceId = Source B`.

**Expected Result:**

- Response is `404`, `403`, or `422` according to platform policy.
- No job is created.
- No mention is ingested.

---

## SL-QA-TENANT-004: Mention listing cannot leak cross-tenant records

**Preconditions:**

- Mention A exists in Workspace A.
- Mention B exists in Workspace B.

**Steps:**

1. Send `GET /workspaces/{workspaceA}/social-listening/mentions` as Admin User A.

**Expected Result:**

- Only Mention A records are returned.
- No `workspaceId` from Workspace B appears anywhere in response.

---

## SL-QA-TENANT-005: Alert events are workspace-scoped

**Preconditions:**

- Alert Event A exists in Workspace A.
- Alert Event B exists in Workspace B.

**Steps:**

1. Send `GET /workspaces/{workspaceA}/social-listening/alert-events`.

**Expected Result:**

- Only Workspace A alert events are returned.

---

## SL-QA-TENANT-006: Export cannot include another workspace data

**Preconditions:**

- Mentions exist in Workspace A and Workspace B.
- Admin User A requests export from Workspace A.

**Steps:**

1. Create export with broad filters.
2. Retrieve export metadata/content reference.

**Expected Result:**

- Export row count reflects Workspace A only.
- Workspace B data is excluded.
- Audit event is recorded for Workspace A only.

---

# 2. RBAC Tests

## SL-QA-RBAC-001: User without keyword create permission is blocked

**Steps:**

1. Auth as No Access User A.
2. Send `POST /workspaces/{workspaceA}/social-listening/keywords`.

**Expected Result:**

- Response `403`.
- No keyword created.
- Error follows `ErrorModel`.

---

## SL-QA-RBAC-002: Read-only user cannot update keyword

**Steps:**

1. Auth as Viewer User A.
2. Send `PATCH /workspaces/{workspaceA}/social-listening/keywords/{keywordA}`.

**Expected Result:**

- Response `403`.
- Keyword remains unchanged.

---

## SL-QA-RBAC-003: Read-only user can list dashboard summary if permission exists

**Preconditions:**

- Viewer User A has `social_listening.dashboard.read`.

**Steps:**

1. Send `GET /workspaces/{workspaceA}/social-listening/dashboard/summary`.

**Expected Result:**

- Response `200`.
- No write-side audit event is created.

---

## SL-QA-RBAC-004: Export requires explicit export permission

**Steps:**

1. Auth as Viewer User A without `social_listening.export.create`.
2. Send `POST /workspaces/{workspaceA}/social-listening/exports`.

**Expected Result:**

- Response `403`.
- No export job created.

---

## SL-QA-RBAC-005: Alert acknowledgement requires acknowledgement permission

**Steps:**

1. Auth as Viewer User A without `social_listening.alert_event.acknowledge`.
2. Send `POST /workspaces/{workspaceA}/social-listening/alert-events/{eventId}/acknowledge`.

**Expected Result:**

- Response `403`.
- Alert event remains `open`.

---

# 3. Idempotency Tests

## SL-QA-IDEMP-001: Duplicate create keyword request does not create duplicate active keyword

**Steps:**

1. Send `POST /keywords` with keyword `Acme` and idempotency key `idem-key-1`.
2. Repeat the same request with the same idempotency key.

**Expected Result:**

- First response `201`.
- Second response returns same resource or `409` according to platform idempotency policy.
- Only one active keyword exists.

---

## SL-QA-IDEMP-002: Duplicate active normalized keyword is rejected

**Steps:**

1. Create keyword `Acme`.
2. Create keyword ` acme ` with same keyword type.

**Expected Result:**

- Second request returns `409` or `422`.
- Only one active/paused normalized keyword exists.

---

## SL-QA-IDEMP-003: Duplicate ingestion job is deduplicated

**Steps:**

1. Send `POST /ingestion-jobs` with a fixed idempotency key.
2. Repeat same request.

**Expected Result:**

- Only one job is created for the same workspace, job type, and idempotency key.

---

## SL-QA-IDEMP-004: Duplicate external mention is not inserted twice

**Preconditions:**

- Source A exists.

**Steps:**

1. Worker attempts to insert mention with `externalId = ext-123`.
2. Worker repeats insertion with same workspace/source/externalId.

**Expected Result:**

- One mention row exists.
- Duplicate detection is recorded or safely ignored.

---

## SL-QA-IDEMP-005: Duplicate sentiment scoring is version-safe

**Steps:**

1. Score Mention A with `modelName = vaderSentiment`, `modelVersion = v1`, `inputTextHash = h1`.
2. Repeat the same scoring.

**Expected Result:**

- Only one sentiment result exists for the same model/version/hash.

---

## SL-QA-IDEMP-006: Reprocessing with a new model version creates a new result

**Steps:**

1. Score Mention A with `modelVersion = v1`.
2. Score Mention A with `modelVersion = v2`.

**Expected Result:**

- Two results exist.
- Historical v1 result is preserved.

---

## SL-QA-IDEMP-007: Duplicate trend snapshot window is controlled

**Steps:**

1. Generate trend snapshot for Workspace A, Keyword A, Source A, same window and grain.
2. Generate same snapshot again.

**Expected Result:**

- Either the same snapshot is updated idempotently or duplicate is rejected.
- No duplicate snapshot rows for the same unique window dimensions.

---

## SL-QA-IDEMP-008: Duplicate alert event is controlled

**Steps:**

1. Trigger alert for same rule and snapshot.
2. Retry alert generation with same dedupe key.

**Expected Result:**

- Only one alert event exists.

---

# 4. Data Integrity Tests

## SL-QA-DATA-001: Keyword deactivation preserves history

**Preconditions:**

- Keyword A has mentions, matches, sentiment results, snapshots, and alert events.

**Steps:**

1. Deactivate Keyword A.
2. Query historical mentions and snapshots.

**Expected Result:**

- Keyword status becomes `disabled`.
- Historical records remain queryable subject to permissions.
- No cascade delete occurs.

---

## SL-QA-DATA-002: Source disabling preserves history

**Steps:**

1. Disable Source A.
2. Query mentions previously ingested from Source A.

**Expected Result:**

- Source status becomes `disabled`.
- Historical mentions remain.
- New ingestion job against disabled source is rejected.

---

## SL-QA-DATA-003: Active source cannot have rejected terms policy

**Steps:**

1. Attempt to create or update source with `status = active` and `termsPolicyStatus = rejected`.

**Expected Result:**

- Response `422`.
- Source is not active with rejected policy.

---

## SL-QA-DATA-004: Sentiment score bounds are enforced

**Steps:**

1. Attempt to create sentiment result with `sentimentScore = 2`.
2. Attempt with `confidenceScore = 1.5`.

**Expected Result:**

- Both are rejected at service and/or DB level.

---

## SL-QA-DATA-005: Trend snapshot window must be valid

**Steps:**

1. Attempt to create snapshot with `windowEnd <= windowStart`.

**Expected Result:**

- Snapshot is rejected.

---

## SL-QA-DATA-006: Alert acknowledgement does not mutate evidence

**Preconditions:**

- Alert Event A references a snapshot and has observed/threshold values.

**Steps:**

1. Acknowledge Alert Event A.
2. Re-read Alert Event A.

**Expected Result:**

- `status = acknowledged`.
- `acknowledgedByUserId` and `acknowledgedAt` are set.
- `observedValue`, `thresholdValue`, `metricKey`, and `triggeredSnapshotId` are unchanged.

---

# 5. Privacy and Security Tests

## SL-QA-PRIV-001: Source responses do not expose connector secrets

**Steps:**

1. Create source with `connectorCredentialId`.
2. Retrieve source.

**Expected Result:**

- Response may include `connectorCredentialId` if policy allows.
- Response never includes access tokens, refresh tokens, API keys, secrets, or secret metadata.

---

## SL-QA-PRIV-002: Mention list does not expose raw payload

**Steps:**

1. Retrieve mentions.

**Expected Result:**

- Response includes normalized allowed fields only.
- `rawPayload`, full provider response, or secret fields are absent.

---

## SL-QA-PRIV-003: Export excludes raw payload by default

**Steps:**

1. Create export for mentions.
2. Inspect exported fields.

**Expected Result:**

- Raw payload is excluded.
- Connector secrets are excluded.
- Author identifiers are hashed or policy-safe.

---

## SL-QA-PRIV-004: Failure events sanitize provider error messages

**Steps:**

1. Simulate provider failure containing an access token in raw error text.
2. Persist failure event.
3. Retrieve source health/failure summary.

**Expected Result:**

- Token is not persisted or returned.
- Error message is sanitized.

---

# 6. ErrorModel Tests

## SL-QA-ERROR-001: Validation errors follow ErrorModel

**Steps:**

1. Send invalid keyword creation request with empty keyword.

**Expected Result:**

- Response `422`.
- Body includes `code`, `message`, `traceId`.
- Body may include `details`.

---

## SL-QA-ERROR-002: Authorization errors follow ErrorModel

**Steps:**

1. Send source create request without required permission.

**Expected Result:**

- Response `403`.
- Body follows `ErrorModel`.

---

## SL-QA-ERROR-003: Workspace mismatch errors do not reveal foreign resource existence

**Steps:**

1. Auth as User A.
2. Request resource ID belonging to Workspace B under Workspace A route.

**Expected Result:**

- Response is `404` or safe `403` according to policy.
- Response does not reveal Workspace B details.

---

## SL-QA-ERROR-004: Rate-limited source returns controlled error

**Steps:**

1. Set Source A backoff state.
2. Attempt ingestion job against Source A.

**Expected Result:**

- Response `429` or `422` according to platform policy.
- Error code indicates rate limit/backoff.
- No job runs uncontrolled.

---

# 7. Audit Tests

## SL-QA-AUDIT-001: Keyword creation writes audit log

**Steps:**

1. Create keyword.
2. Query audit logs for the action.

**Expected Result:**

- Audit event `social_listening.keyword.created` exists.
- Audit contains workspace ID, actor ID, entity type, entity ID, and timestamp.

---

## SL-QA-AUDIT-002: Source status change writes audit log

**Steps:**

1. Pause or disable source.

**Expected Result:**

- Audit event is recorded.
- Before/after status is captured or summarized.

---

## SL-QA-AUDIT-003: Alert acknowledgement writes audit log

**Steps:**

1. Acknowledge alert event.

**Expected Result:**

- Audit event `social_listening.alert_event.acknowledged` is recorded.

---

## SL-QA-AUDIT-004: Export create and download are audited

**Steps:**

1. Create export.
2. Retrieve/download export reference.

**Expected Result:**

- `social_listening.export.created` exists.
- `social_listening.export.downloaded` exists if download/access endpoint is called.

---

# 8. API Contract Tests

## SL-QA-API-001: OpenAPI paths exist

**Expected Paths:**

- `POST /workspaces/{workspaceId}/social-listening/keywords`
- `GET /workspaces/{workspaceId}/social-listening/keywords`
- `PATCH /workspaces/{workspaceId}/social-listening/keywords/{keywordId}`
- `POST /workspaces/{workspaceId}/social-listening/sources`
- `GET /workspaces/{workspaceId}/social-listening/sources`
- `PATCH /workspaces/{workspaceId}/social-listening/sources/{sourceId}`
- `GET /workspaces/{workspaceId}/social-listening/sources/{sourceId}/health`
- `POST /workspaces/{workspaceId}/social-listening/ingestion-jobs`
- `GET /workspaces/{workspaceId}/social-listening/analysis-jobs/{jobId}`
- `GET /workspaces/{workspaceId}/social-listening/mentions`
- `GET /workspaces/{workspaceId}/social-listening/mentions/{mentionId}/sentiment-results`
- `GET /workspaces/{workspaceId}/social-listening/trend-snapshots`
- `GET /workspaces/{workspaceId}/social-listening/dashboard/summary`
- `POST /workspaces/{workspaceId}/social-listening/alert-rules`
- `GET /workspaces/{workspaceId}/social-listening/alert-rules`
- `PATCH /workspaces/{workspaceId}/social-listening/alert-rules/{alertRuleId}`
- `GET /workspaces/{workspaceId}/social-listening/alert-events`
- `POST /workspaces/{workspaceId}/social-listening/alert-events/{alertEventId}/acknowledge`
- `POST /workspaces/{workspaceId}/social-listening/exports`
- `GET /workspaces/{workspaceId}/social-listening/exports`
- `GET /workspaces/{workspaceId}/social-listening/exports/{exportId}`

**Expected Result:**

- Implementation must match approved OpenAPI paths and response shapes.

---

## SL-QA-API-002: Response schemas do not include forbidden fields

**Forbidden Fields:**

- `accessToken`
- `refreshToken`
- `apiKey`
- `secret`
- `rawPayload`
- `providerRawResponse`
- `password`

**Expected Result:**

- No Social Listening response includes forbidden fields.

---

## SL-QA-API-003: Write operations honor Idempotency-Key

**Covered Endpoints:**

- Keyword creation.
- Source creation.
- Ingestion job creation.
- Alert rule creation.
- Export creation.

**Expected Result:**

- Duplicate requests are handled safely and predictably.

---

# 9. Worker and Background Job Tests

## SL-QA-WORKER-001: Worker cannot write mention to wrong workspace

**Steps:**

1. Worker receives job for Workspace A.
2. Worker attempts to write mention with Source B from Workspace B.

**Expected Result:**

- Write is rejected.
- Failure is logged safely.

---

## SL-QA-WORKER-002: Failed ingestion does not partially corrupt data

**Steps:**

1. Simulate ingestion failure mid-batch.

**Expected Result:**

- Successfully inserted records remain valid.
- Failed records are retried or logged safely.
- Job status is `failed` or partially handled according to final policy.
- No duplicate mentions after retry.

---

## SL-QA-WORKER-003: Provider unavailable does not corrupt mention

**Steps:**

1. Mention exists.
2. Sentiment provider fails.

**Expected Result:**

- Mention remains unchanged.
- No invalid sentiment result is inserted.
- Job failure is recorded.

---

## SL-QA-WORKER-004: Snapshot generation is deterministic

**Steps:**

1. Generate snapshot for fixed data set and time window.
2. Re-run snapshot generation.

**Expected Result:**

- Same counts and scores are produced.
- No duplicate snapshot row is created.

---

# 10. Domain Guardrail Tests

## SL-QA-GUARD-001: Trading language is not exposed

**Forbidden Terms in API schema and UI response labels:**

- `BUY`
- `SELL`
- `HOLD`
- `trading_signal`
- `stock_prediction`
- `investment_advice`

**Expected Result:**

- None of these appear in Social Listening API contracts or user-facing responses.

---

## SL-QA-GUARD-002: Alert event cannot trigger auto-publish

**Steps:**

1. Trigger negative sentiment alert.

**Expected Result:**

- Alert event is created.
- No publish job is created.
- No paid campaign job is created.
- No external channel action is executed.

---

## SL-QA-GUARD-003: AI summaries, if later introduced, must not auto-execute

**Status:** Future-proof guardrail.

**Expected Result:**

- Any generated insight must be advisory and require human approval before any action.

---

# 11. Database Constraint Tests

## SL-QA-DB-001: Duplicate source display name per workspace/type is blocked

**Expected Result:**

- Unique partial index prevents duplicate active/non-deleted source with same workspace/type/display name.

---

## SL-QA-DB-002: Duplicate mention external ID per workspace/source is blocked

**Expected Result:**

- Unique constraint prevents duplicate `(workspace_id, monitored_source_id, external_id)`.

---

## SL-QA-DB-003: Sentiment result uniqueness is enforced

**Expected Result:**

- Unique constraint prevents duplicate `(workspace_id, mention_id, model_name, model_version, input_text_hash)`.

---

## SL-QA-DB-004: Trend snapshot uniqueness is enforced

**Expected Result:**

- Unique snapshot window prevents duplicate workspace/keyword/source/window/grain combinations.

---

## SL-QA-DB-005: Alert event dedupe is enforced

**Expected Result:**

- Unique `(workspace_id, alert_rule_id, dedupe_key)` prevents duplicate alert events.

---

# 12. Export Tests

## SL-QA-EXPORT-001: Export filters match dashboard filters

**Steps:**

1. Query dashboard using keyword/source/date filters.
2. Create export with same filters.

**Expected Result:**

- Exported data corresponds to the same filter scope.

---

## SL-QA-EXPORT-002: Export too broad is rejected or queued safely

**Steps:**

1. Request export without date filter if policy requires date range.

**Expected Result:**

- Request rejected with `422`, or accepted only if capped and governed.

---

## SL-QA-EXPORT-003: Expired export returns Gone

**Steps:**

1. Create export.
2. Mark export as expired.
3. Retrieve export.

**Expected Result:**

- Response `410` or platform equivalent.
- Error follows `ErrorModel`.

---

# 13. Acceptance Gate

Social Listening V1 cannot be marked complete unless all gates below pass:

| Gate | Required Result |
|---|---|
| Tenant isolation | All pass |
| RBAC | All pass |
| Idempotency | All pass |
| Data integrity | All pass |
| Privacy/security | All pass |
| ErrorModel | All pass |
| Audit | All write/sensitive actions audited |
| API contract | Implementation matches OpenAPI patch |
| Worker safety | No cross-tenant or corrupt writes |
| Domain guardrails | No trading, auto-publish, or paid execution leakage |
| Database constraints | Unique and check constraints enforced |
| Export governance | No raw payload or cross-tenant export leakage |

---

## Final QA Recommendation

Do not proceed to implementation until this QA suite is converted into actual tests.

Recommended implementation split:

1. API contract tests.
2. Service integration tests.
3. Database constraint tests.
4. Worker/job tests.
5. RBAC and tenant isolation tests.
6. Export/privacy tests.
7. Audit-event tests.

Decision status: **QA suite prepared; implementation tests not yet generated.**
