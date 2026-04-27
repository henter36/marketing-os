# Social Sentiment GitHub Feature Extraction and Fit-Gap Analysis

## Document Status

This document is an advisory architecture and product reference for Marketing OS. It extracts useful ideas, reusable components, and integration risks from selected open-source GitHub repositories related to sentiment analysis, social media monitoring, brand tracking, and trading-style signal analysis.

This document is **not** an implementation backlog by itself. No feature in this document should be implemented unless it is later promoted into the approved OpenAPI, ERD, SQL DDL, Sprint Backlog, and QA Test Suite.

---

## Executive Decision

The reviewed repositories should **not** be adopted as complete production systems.

The correct decision is to use them selectively as:

1. Small reusable NLP components.
2. UI and dashboard references.
3. Pipeline and workflow references.
4. Research references for Arabic sentiment analysis.
5. Explicit rejection examples where architecture, security, or licensing risk is high.

The strongest usable component is `vaderSentiment` as a lightweight English sentiment scoring library.

The strongest workflow reference is `ai-trading-agent-gemini`, but only after removing trading-specific logic and adapting the job workflow pattern to brand and marketing intelligence.

The strongest UI reference is `social-media-sentiment-tracker`, but it should be treated as a mock/dashboard inspiration only unless independently hardened.

The strongest Arabic sentiment research seed is `sentiment-analysis-arabic`, but it is not production-ready.

---

## Reviewed Repositories

| # | Repository | Main Theme | Executive Decision |
|---:|---|---|---|
| 1 | https://github.com/cjhutto/vaderSentiment | English sentiment scoring | Use as a limited embedded NLP component |
| 2 | https://github.com/abdulfatir/twitter-sentiment-analysis | Twitter sentiment ML research | Extract ideas only |
| 3 | https://github.com/shirosaidev/stocksight | Twitter/news sentiment for stocks | Extract pipeline ideas only |
| 4 | https://github.com/kaushikjadhav01/Stock-Market-Prediction-Web-App-using-Machine-Learning-And-Sentiment-Analysis | Stock prediction app | Reject for implementation |
| 5 | https://github.com/Chulong-Li/Real-time-Sentiment-Tracking-on-Twitter-for-Brand-Improvement-and-Trend-Recognition | Brand sentiment tracking | Extract dashboard and trend ideas only |
| 6 | https://github.com/Lissy93/twitter-sentiment-visualisation | Twitter sentiment visualization | Extract UI/data-flow ideas only |
| 7 | https://github.com/nikoma/social_media_monitoring | Ruby wrapper for social monitoring | Reject for integration; extract conceptual ideas only |
| 8 | https://github.com/danilobatson/ai-trading-agent-gemini | AI trading analysis agent | Adapt workflow pattern only; remove trading domain |
| 9 | https://github.com/harshkhairnar63/social-media-sentiment-tracker | Social sentiment dashboard | Use as UI reference only |
| 10 | https://github.com/jeffreybreen/twitter-sentiment-analysis-tutorial-201107 | Historical R sentiment tutorial | Extract reporting idea only |
| 11 | https://github.com/Harshvardhan2164/Social-Media-Sentiment-Analysis-Minor-Project | Academic sentiment project | Reject as code; extract high-level idea only |
| 12 | https://github.com/zdmc23/sentiment-analysis-arabic | Arabic sentiment LSTM research | Use as research seed only |

---

## Classification Model

| Code | Meaning | Usage Rule |
|---|---|---|
| A | Use as-is | Production-ready or near-production; no reviewed repository qualifies |
| B | Integrate as separate service | Acceptable only if the service is maintained, isolated, secured, and governed |
| C | Use as partial component | Small, bounded component with clear input/output and low domain conflict |
| D | Extract ideas only | Useful conceptually but not suitable for direct integration |
| E | Reject | Security, licensing, age, architecture, or domain risk is too high |

---

## Project-by-Project Analysis

### 1. cjhutto/vaderSentiment

**Classification:** C — Partial component.

**Purpose:** Lightweight rule/lexicon-based sentiment scoring for short English social text.

**Useful Features:**

- Fast positive/neutral/negative/compound scoring.
- Low-cost baseline for English content.
- Simple Python package integration.
- Suitable for short-form social text, reviews, and comments.

**What Can Be Used:**

- Embed as a scoring component inside a controlled NLP worker.
- Store output as one model version, not as final truth.
- Use as fallback when LLM/NLP provider fails.

**What Must Not Be Assumed:**

- It is not sufficient for Arabic.
- It is not sufficient for sarcasm, dialects, or brand-specific nuance.
- It is not a governance, API, dashboard, or SaaS module.

**Recommended Integration:**

- `NLP Worker -> SentimentProvider: VADER`
- Persist `model_name`, `model_version`, `score`, `confidence`, and `language`.

---

### 2. abdulfatir/twitter-sentiment-analysis

**Classification:** D — Ideas only.

**Purpose:** Academic/research-style Twitter sentiment classification using multiple ML approaches.

**Useful Features:**

- Model comparison approach.
- Preprocessing and feature extraction patterns.
- Benchmark mindset across classical ML and neural models.

**What Can Be Extracted:**

- Evaluation methodology.
- Model comparison table pattern.
- Preprocessing pipeline ideas.

**Why Not Use Directly:**

- Not an operational service.
- No production API.
- No tenant isolation.
- No modern connector governance.
- Dataset limitations and aging Twitter dependency.

---

### 3. shirosaidev/stocksight

**Classification:** D / limited B for proof of concept only.

**Purpose:** Collect Twitter/news sentiment around stocks and visualize via Elasticsearch/Kibana.

**Useful Features:**

- Ingestion-to-dashboard pipeline.
- Keyword/symbol monitoring.
- Search-index-oriented analytics.
- Sentiment aggregation over time.

**What Can Be Extracted:**

- `ingest -> normalize -> score -> index -> visualize` pattern.
- Use of search index for large text/mention analysis.
- Time-series sentiment aggregation.

**Why Not Use Directly:**

- Domain is stock/trading, not marketing governance.
- Stack is dated.
- No SaaS governance.
- No RBAC, audit logs, workspace isolation, or approval workflow.

**Recommended Use:**

- Reference only for analytics pipeline shape.
- Do not deploy as a production component.

---

### 4. Stock Market Prediction Web App using ML and Sentiment Analysis

**Classification:** E — Reject.

**Purpose:** Educational stock prediction and sentiment analysis web app.

**Useful Ideas Only:**

- Combining news/social sentiment with dashboard views.
- Admin/user separation concept.
- Confidence/forecast presentation pattern.

**Critical Risks:**

- Security posture is not acceptable for production reuse.
- Trading/stock prediction introduces legal and reputational risk.
- Architecture is not aligned with Marketing OS.
- Mixed stack increases maintenance risk.

**Decision:**

Do not install, fork, or integrate. Extract only high-level conceptual ideas if needed.

---

### 5. Chulong-Li Real-time Sentiment Tracking for Brand Improvement

**Classification:** D — Ideas only.

**Purpose:** Real-time Twitter sentiment tracking for brand improvement and trend recognition.

**Useful Features:**

- Brand keyword monitoring.
- Trend recognition.
- Real-time dashboard concept.
- Sentiment over time.
- Potential spike/anomaly detection idea.

**What Can Be Extracted:**

- Brand health dashboard structure.
- Tracked keyword configuration.
- Trend snapshot and alert concepts.

**Why Not Use Directly:**

- Notebook/research orientation.
- Not a hardened backend.
- No clear SaaS governance.
- Real-time streaming stack may be overkill for V1.

---

### 6. Lissy93/twitter-sentiment-visualisation

**Classification:** D — UX and data-flow ideas only.

**Purpose:** Visualize Twitter sentiment and related real-time data.

**Useful Features:**

- Live dashboard design.
- Visual sentiment distribution.
- Real-time feed concept.
- D3-style visualizations.
- Use cases around competition, brand, and public perception.

**What Can Be Extracted:**

- UI concepts.
- Dashboard structure.
- Mention stream and chart patterns.

**Why Not Use Directly:**

- Twitter/X API changes reduce operational relevance.
- Older frontend/backend stack.
- No modern governance layer.
- Not aligned to current Marketing OS architecture.

---

### 7. nikoma/social_media_monitoring

**Classification:** E for integration, D for concept.

**Purpose:** Ruby wrapper around social monitoring capabilities such as keywords, sentiment, competitors, and reviews.

**Useful Ideas:**

- Keyword tracking.
- Competitor monitoring.
- Review tracking.
- External monitoring API abstraction.

**Why Reject Direct Integration:**

- Old wrapper around an external service.
- Unclear current operational viability.
- High dependency risk.
- Not aligned to Marketing OS technical stack.

---

### 8. danilobatson/ai-trading-agent-gemini

**Classification:** B/C — Adapt workflow pattern only.

**Purpose:** AI trading analysis agent using Gemini, market data, jobs, and dashboards.

**Useful Features:**

- Background analysis jobs.
- Progress tracking.
- AI reasoning output.
- Confidence score.
- PostgreSQL-backed state.
- Modern web app structure.

**What Can Be Adapted:**

- `analysis_jobs` lifecycle.
- Async AI evaluation workflow.
- AI insight generation pattern.
- Dashboard progress and result views.

**What Must Be Removed:**

- BUY/SELL/HOLD signals.
- Trading recommendations.
- Financial decision language.
- Any domain logic tied to investment decisions.

**Marketing OS Replacement Concepts:**

| Trading Concept | Marketing OS Replacement |
|---|---|
| BUY/SELL/HOLD | Opportunity / Risk / Neutral |
| Market signal | Brand signal |
| Trading confidence | Insight confidence |
| Asset ticker | Brand / campaign / keyword |
| Price movement | Sentiment movement / engagement movement |
| Trading recommendation | Marketing action suggestion requiring approval |

---

### 9. harshkhairnar63/social-media-sentiment-tracker

**Classification:** C/D — UI reference only.

**Purpose:** Social media sentiment dashboard with charts, mentions, alerts, and exports.

**Useful Features:**

- Dashboard card layout.
- Mention feed.
- Platform filter.
- Sentiment trend chart.
- Alerts panel.
- Export functions.
- Keyword/hashtag monitoring UI.

**What Can Be Used:**

- Frontend inspiration.
- Possible UI scaffolding after legal/license review.

**What Cannot Be Assumed:**

- Real backend exists.
- Real NLP exists.
- Auth/RBAC exists.
- Tenant isolation exists.
- Data is production-grade.

---

### 10. jeffreybreen/twitter-sentiment-analysis-tutorial-201107

**Classification:** D/E — Historical tutorial only.

**Purpose:** R-based Twitter sentiment tutorial.

**Useful Ideas:**

- Report generation.
- Comparative sentiment analysis.
- Lexicon-based scoring explanation.

**Why Not Use Directly:**

- Old tutorial format.
- No service layer.
- No production backend.
- No modern connector model.

---

### 11. Harshvardhan2164 Social Media Sentiment Analysis Minor Project

**Classification:** E for code, D for concept.

**Purpose:** Academic/minor project for social sentiment analysis.

**Useful Ideas:**

- Multi-source concept: social, reviews, video comments.
- Basic sentiment categories.
- Confidence field concept.

**Why Not Use Directly:**

- Not production-ready.
- Unclear license posture.
- Likely insufficient architecture and governance.
- Should not be treated as a deployable module.

---

### 12. zdmc23/sentiment-analysis-arabic

**Classification:** C/D — Arabic research seed only.

**Purpose:** Arabic sentiment analysis using LSTM and Arabic Twitter data.

**Useful Features:**

- Arabic preprocessing reference.
- Arabic stop words/normalization ideas.
- LSTM-based sentiment classification pattern.
- Arabic dataset experiment reference.

**What Can Be Extracted:**

- Arabic NLP baseline design.
- Evaluation and preprocessing concepts.
- Starting point for Arabic sentiment domain work.

**Why Not Use Directly:**

- Not an API.
- Not production-ready.
- Small/limited research orientation.
- Does not sufficiently cover Saudi/Gulf dialects.
- No model monitoring or governance.

---

## Feature Extraction Matrix

| Feature / Capability | Best Source | V1 Decision | Implementation Guidance |
|---|---|---|---|
| English sentiment scoring | vaderSentiment | Include | Use as fallback/simple baseline |
| Arabic sentiment baseline | sentiment-analysis-arabic | Include only if Arabic is core | Rebuild as governed NLP provider |
| Monitored keywords | Chulong-Li, social-media-sentiment-tracker, nikoma | Include | Build first-class entity |
| Mentions feed | social-media-sentiment-tracker, Lissy93 | Include | Store normalized mentions |
| Trend charts | Lissy93, Chulong-Li, social-media-sentiment-tracker | Include | Build time-series snapshots |
| Alert rules | Chulong-Li, social-media-sentiment-tracker | Include | Threshold-based V1 alerts |
| Background analysis jobs | ai-trading-agent-gemini | Include | Required for reliability |
| Live progress tracking | ai-trading-agent-gemini | Include if simple | Use polling/SSE before complex streaming |
| AI-generated reasoning | ai-trading-agent-gemini | Defer or tightly govern | Requires audit and review gates |
| Search index analytics | stocksight | Defer | Use PostgreSQL first unless scale proves need |
| Competitor monitoring | nikoma, Chulong-Li | Defer | Add after core monitoring works |
| Review tracking | nikoma | Defer | Add through source connectors |
| CSV/JSON export | social-media-sentiment-tracker | Include | Useful low-risk V1 capability |
| Stock prediction | stocksight, stock prediction app | Reject | Outside Marketing OS scope |
| Trading signals | ai-trading-agent-gemini, stock apps | Reject | Legal/reputational risk |
| Notebook-based ML | multiple repos | Reject for production | Convert into governed services only |

---

## Recommended Marketing OS Scope Impact

### Add to Core V1

The following should be considered candidates for Core V1 if Social Listening is part of the approved V1 scope:

1. `monitored_keywords`
2. `monitored_sources`
3. `social_mentions`
4. `sentiment_results`
5. `analysis_jobs`
6. `alert_rules`
7. `alert_events`
8. `trend_snapshots`
9. `source_rate_limits`
10. `connector_credentials`
11. `audit_logs`
12. Export endpoint for CSV/JSON

### Add to Extended V1

1. AI insight summaries.
2. Simple topic grouping.
3. Competitor watchlist.
4. Mention classification by campaign/product.
5. Arabic sentiment calibration workflow.
6. Human correction feedback loop.

### Push to Post V1

1. Advanced anomaly detection.
2. Real-time event streaming at scale.
3. ClickHouse/large-scale analytics store.
4. Full social intelligence suite.
5. Predictive brand risk scoring.
6. Automated campaign orchestration based on sentiment.
7. Multi-model routing for NLP quality optimization.

### Explicitly Exclude

1. Trading recommendations.
2. Stock prediction.
3. BUY/SELL/HOLD outputs.
4. Unlicensed scraping.
5. Twitter-only architecture.
6. Running notebooks in production.
7. Projects with embedded API keys or default admin credentials.
8. Direct use of unmaintained wrappers.

---

## Proposed Domain Model Additions

### Entity: MonitoredSource

Purpose: Defines external source categories for monitored data.

Suggested fields:

- `id`
- `workspace_id`
- `source_type`
- `display_name`
- `status`
- `connector_config_id`
- `created_by`
- `created_at`
- `updated_at`

### Entity: MonitoredKeyword

Purpose: Tracks keywords, hashtags, brands, competitors, products, or campaign terms.

Suggested fields:

- `id`
- `workspace_id`
- `keyword`
- `keyword_type`
- `language_hint`
- `source_scope`
- `is_active`
- `created_by`
- `created_at`
- `updated_at`

### Entity: SocialMention

Purpose: Stores normalized external mention metadata and allowed text excerpt.

Suggested fields:

- `id`
- `workspace_id`
- `source_type`
- `external_id`
- `author_handle_hash`
- `text_excerpt`
- `language`
- `published_at`
- `url`
- `raw_payload_ref`
- `ingested_at`

### Entity: SentimentResult

Purpose: Stores sentiment scoring output with model traceability.

Suggested fields:

- `id`
- `workspace_id`
- `social_mention_id`
- `model_name`
- `model_version`
- `sentiment_label`
- `sentiment_score`
- `confidence_score`
- `language`
- `explanation_summary`
- `created_at`

### Entity: AnalysisJob

Purpose: Tracks asynchronous analysis workflow.

Suggested fields:

- `id`
- `workspace_id`
- `job_type`
- `status`
- `input_ref`
- `progress_percent`
- `attempt_count`
- `error_code`
- `error_message`
- `started_at`
- `completed_at`
- `created_by`

### Entity: TrendSnapshot

Purpose: Stores aggregated time-window metrics for dashboard performance.

Suggested fields:

- `id`
- `workspace_id`
- `keyword_id`
- `source_type`
- `window_start`
- `window_end`
- `mention_count`
- `positive_count`
- `neutral_count`
- `negative_count`
- `average_sentiment_score`
- `created_at`

### Entity: AlertRule

Purpose: Defines threshold rules for notifying users of sentiment or volume changes.

Suggested fields:

- `id`
- `workspace_id`
- `name`
- `rule_type`
- `keyword_id`
- `threshold_value`
- `comparison_operator`
- `severity`
- `is_active`
- `created_by`
- `created_at`

### Entity: AlertEvent

Purpose: Stores triggered alert events.

Suggested fields:

- `id`
- `workspace_id`
- `alert_rule_id`
- `triggered_by_snapshot_id`
- `severity`
- `message`
- `status`
- `created_at`
- `acknowledged_by`
- `acknowledged_at`

---

## Integration Feasibility

| Repository | Integration Method | Feasibility | Decision |
|---|---|---|---|
| vaderSentiment | Embedded Python component | High | Accept as limited NLP provider |
| sentiment-analysis-arabic | Research-to-service rewrite | Medium | Rebuild, do not embed directly |
| ai-trading-agent-gemini | Workflow pattern adaptation | Medium | Extract job architecture only |
| social-media-sentiment-tracker | UI reference | Medium | Use for UX inspiration only |
| stocksight | Separate PoC or pattern extraction | Low/Medium | Do not depend on it |
| Chulong-Li project | Concept extraction | Low | Use dashboard/trend ideas only |
| Lissy93 project | UX reference | Low | Do not integrate |
| abdulfatir project | Research reference | Low | Do not integrate |
| jeffreybreen project | Historical report reference | Low | Do not integrate |
| nikoma project | External wrapper | Low | Reject |
| Stock Prediction Web App | Direct deployment | Very low | Reject |
| Minor Project | Direct deployment | Very low | Reject |

---

## Architecture Recommendation

Recommended architecture for adding sentiment and social listening capabilities:

```text
Marketing OS Core Application
- Workspace / Tenant isolation
- RBAC
- Audit logging
- Connector management
- API layer
- PostgreSQL source of truth

NLP Worker / Service
- VADER provider for English baseline
- Arabic provider later
- LLM provider only for governed explanations
- Model versioning
- Retry and fallback logic

Ingestion Layer
- Source adapters
- Queue jobs
- Rate limit tracking
- Dead letter queue
- Raw payload storage policy

Analytics Layer
- Mention normalization
- Sentiment result storage
- Trend snapshots
- Alert events

Frontend
- Social listening dashboard
- Mentions feed
- Trend charts
- Alerts panel
- Export controls
```

---

## Governance Rules

The following rules are mandatory before implementation:

1. Sentiment output is an analytical signal, not verified truth.
2. AI-generated recommendations must not auto-execute campaigns.
3. Sentiment results must store model name and version.
4. Every connector must have rate-limit and failure tracking.
5. Raw platform data must respect platform terms and privacy rules.
6. Arabic sentiment must be evaluated against local dialect data before production claims.
7. Tenant isolation must be enforced at database, API, and UI layers.
8. All alert rules and generated insights must be auditable.
9. No trading, financial prediction, or investment-style signals should enter Marketing OS.
10. No external repository should become a source of truth for Marketing OS data.

---

## Risk Register

| Risk | Cause | Impact | Mitigation |
|---|---|---|---|
| Twitter/X dependency risk | Many repositories depend on old Twitter API assumptions | Product failure or unexpected cost | Use connector abstraction and multiple sources |
| Security leakage | Some projects expose poor credential practices | Credential compromise | Reject unsafe repositories and enforce secret scanning |
| Weak Arabic accuracy | Arabic repo is research-grade and limited | Wrong insights for Saudi/Gulf content | Build local evaluation dataset |
| Model over-trust | Sentiment score may be treated as truth | Bad business decisions | Display confidence and audit trail |
| Over-engineering | Kafka/Spark/streaming introduced too early | V1 delay and operational complexity | Start with queue + PostgreSQL snapshots |
| Legal/platform risk | Scraping or API misuse | Account bans/legal exposure | Terms-aware connector governance |
| Domain contamination | Trading logic enters marketing system | Reputational and legal risk | Reject BUY/SELL/HOLD concepts |
| Unclear licenses | Some repos lack clear license posture | Commercial usage risk | Do not reuse code without license review |
| Mock UI mistaken for product | Frontend-only repos look complete | False delivery confidence | Require real APIs and QA tests |
| No tenant isolation | Reviewed repos are mostly single-user/single-purpose | Cross-tenant data leakage | Build isolation in core platform |

---

## Implementation Promotion Criteria

A feature from this document can be promoted into implementation only if all conditions below are met:

1. It is added to the approved backlog.
2. It has an ERD impact section.
3. It has OpenAPI endpoints.
4. It has RBAC rules.
5. It has audit events.
6. It has QA test cases.
7. It has privacy and data retention rules.
8. It does not create a new source-of-truth conflict.
9. It does not bypass approval workflows.
10. It fits the approved Sprint scope.

---

## Recommended V1 Backlog Candidates

### Story 1: Manage Monitored Keywords

As a workspace user, I want to define monitored keywords, hashtags, products, brands, and competitors so the platform can track relevant social and market signals.

Acceptance Criteria:

- User can create, update, deactivate, and list monitored keywords.
- Each keyword belongs to one workspace.
- RBAC controls who can manage keywords.
- Audit log records all changes.

### Story 2: Ingest Social Mentions

As the system, I want to ingest mentions from configured sources so they can be analyzed and visualized.

Acceptance Criteria:

- Each mention is linked to workspace and source.
- Duplicate external IDs are handled idempotently.
- Source rate limits are tracked.
- Failed ingestion goes to retry/dead-letter path.

### Story 3: Score Sentiment

As the system, I want to generate sentiment scores for ingested mentions so users can understand brand perception.

Acceptance Criteria:

- Sentiment result stores label, score, confidence, model name, and model version.
- English baseline provider can use VADER.
- Arabic provider must be versioned separately.
- Failures do not corrupt mention records.

### Story 4: Display Sentiment Dashboard

As a user, I want to view mention volume, sentiment trend, and recent mentions so I can understand brand health quickly.

Acceptance Criteria:

- Dashboard supports workspace-level filtering.
- User can filter by keyword, source, language, and time period.
- Dashboard reads from snapshots where possible.
- No cross-tenant data exposure.

### Story 5: Configure Alert Rules

As a user, I want to create alert rules for negative sentiment spikes or mention volume changes so I can respond quickly.

Acceptance Criteria:

- Alert rules are workspace-scoped.
- Alert events are generated from snapshots.
- Alert events can be acknowledged.
- Audit logs capture rule changes.

---

## Final Recommendation

Do not add any reviewed repository as a direct dependency except for small, bounded NLP utilities after license and security review.

Recommended immediate action:

1. Add VADER as an optional English sentiment provider.
2. Define the Social Listening domain model internally.
3. Add async analysis jobs before adding dashboards.
4. Build dashboard using project-native React/Next.js conventions.
5. Treat Arabic sentiment as a separate governed provider requiring evaluation.
6. Reject trading prediction and stock signal concepts entirely.

Final decision:

- `vaderSentiment`: Use as bounded component.
- `ai-trading-agent-gemini`: Extract workflow pattern only.
- `social-media-sentiment-tracker`: Extract UI ideas only.
- `sentiment-analysis-arabic`: Use as Arabic research seed only.
- All stock prediction/trading repositories: Reject for Marketing OS implementation.
- All old Twitter-only projects: Extract concepts only; do not integrate.
