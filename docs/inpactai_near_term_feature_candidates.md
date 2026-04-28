# InPactAI Near-Term Feature Candidates for Marketing OS

Status: Scope recommendation only  
Source study: `docs/inpactai_feature_extraction_and_marketing_os_fit_gap.md`  
Implementation status: Not approved  
ERD changes: Not applied  
SQL changes: Not applied  
OpenAPI changes: Not applied  
QA changes: Not applied  
Runtime changes: Not applied  
Marketplace implementation: Not approved  
Creator Marketplace status: Near-term discovery/RFC candidate only  
Direct code adoption from InPactAI: Prohibited  

---

## 1. Executive Decision

Only four InPactAI-inspired ideas are acceptable for near-term consideration in Marketing OS:

1. `Keyword Suggestion for Brief` - closest candidate for Core V1.
2. `Audience / Account Insight Snapshot` - candidate only if account analysis is already approved within V1.
3. `Trend Signals` - Extended V1 only, not now.
4. `Creator Marketplace` - near-term discovery/RFC candidate only; not implementation and not Core V1.

Everything else from InPactAI must remain inspiration only, deferred, or rejected.

This document does not activate implementation. It is a controlled scope note to prevent accidental expansion into chat, sponsorship payments, contract automation, automated outreach, or ungoverned AI features.

Creator Marketplace is included in the near-term list only to force structured discovery and decision-making. It is not approved as a build item.

---

## 2. Non-Negotiable Boundaries

```text
1. Do not copy InPactAI code.
2. Do not import GPL-3.0 code or derivative implementation into Marketing OS.
3. Do not implement creator marketplace from this document.
4. Creator Marketplace may only proceed as a near-term discovery/RFC item.
5. Do not add creator/brand chat.
6. Do not add sponsorship payments.
7. Do not add contract negotiation assistant.
8. Do not add automated outreach.
9. Do not bypass existing Marketing OS RBAC, AuditLog, UsageMeter, or CostEvent rules.
10. Do not change ERD, SQL, OpenAPI, or QA from this document alone.
11. Any future implementation must be contract-first and separately approved.
```

---

## 3. Candidate 1 - Keyword Suggestion for Brief

### Classification

```text
Phase: Core V1 candidate
Status: Suitable for near-term design
Implementation: Not approved yet
Risk level: Medium-low if governed
```

### Purpose

Assist the user while preparing a campaign brief by suggesting relevant keywords, message angles, audience phrases, CTA alternatives, and content themes.

This improves brief quality before content generation and reduces weak or incomplete campaign inputs.

### Why It Fits Marketing OS

This feature strengthens the existing campaign and brief flow without opening a new marketplace or external collaboration domain. It supports content quality at the earliest controlled step.

### Required Product Behavior

The system may suggest:

- Primary keywords.
- Secondary keywords.
- Audience phrases.
- Messaging angles.
- CTA options.
- Negative keywords or terms to avoid.
- Risk notes if the brief is vague, exaggerated, or legally sensitive.

The system must not:

- Auto-approve the brief.
- Auto-generate publishable content without review.
- Replace human approval.
- Create campaign facts not provided by the user.

### Suggested Domain Concept

```text
BriefKeywordSuggestion
BriefEnrichmentSuggestion
BriefQualityHint
```

### ERD Impact

Potential future options:

1. Store suggestions as a JSON snapshot linked to `Brief`.
2. Add a separate `BriefSuggestion` table if suggestions require review, reuse, or audit granularity.

No ERD change is approved by this document.

### OpenAPI Impact

Possible future endpoint examples:

```text
POST /v1/briefs/{brief_id}/keyword-suggestions
GET  /v1/briefs/{brief_id}/keyword-suggestions
```

No OpenAPI change is approved by this document.

### QA Impact

Future QA must cover:

- Workspace isolation.
- RBAC permission enforcement.
- Empty/weak brief handling.
- Prompt injection resistance.
- Sensitive claim detection.
- No commercial usage counted unless usable output is confirmed.
- Stable error model.
- Audit log creation.

### RBAC Impact

Potential permissions:

```text
brief:suggestion:generate
brief:suggestion:view
brief:suggestion:accept
brief:suggestion:reject
```

Only authorized campaign owners, workspace admins, or assigned reviewers should access suggestions.

### AuditLog Impact

Potential audit events:

```text
brief.keyword_suggestions.generated
brief.keyword_suggestions.viewed
brief.keyword_suggestions.accepted
brief.keyword_suggestions.rejected
```

### UsageMeter / CostEvent Impact

If AI is used, the feature must create governed metering events consistent with existing Marketing OS rules:

```text
UsageMeter: only when usable_output_confirmed=true
CostEvent: record provider/model/token/API cost but do not treat as billing source
```

### Recommendation

Proceed only as a Core V1 candidate RFC or backlog item. Do not implement from this document alone.

---

## 4. Candidate 2 - Audience / Account Insight Snapshot

### Classification

```text
Phase: Core V1 candidate only if account analysis is already within V1; otherwise Extended V1
Status: Useful but requires stricter data governance
Implementation: Not approved yet
Risk level: Medium
```

### Purpose

Capture a governed snapshot of account, audience, or channel insights to support campaign planning.

This may include audience distribution, engagement metrics, content themes, platform signals, and diagnostic notes.

### Why It Fits Marketing OS

Marketing OS requires strong campaign preparation. A campaign brief is materially better when supported by account/audience evidence rather than assumptions.

### Required Product Behavior

The system may capture:

- Source platform.
- Connected account or manually entered account reference.
- Audience demographics.
- Audience geography.
- Engagement rate.
- Average views/reach.
- Frequent themes or keywords.
- Content format performance.
- Snapshot date.
- Source confidence score.
- Data freshness status.

The system must not:

- Treat external metrics as financial truth.
- Use stale data without warning.
- Mix data across workspaces.
- Collect audience data without a consent basis or permitted source.
- Auto-publish or auto-change campaign strategy.

### Suggested Domain Concept

```text
AccountInsightSnapshot
AudienceInsightSnapshot
ChannelDiagnosticSnapshot
```

### ERD Impact

Potential future fields:

```text
id
workspace_id
external_account_id nullable
campaign_id nullable
source_platform
source_type
snapshot_at
audience_age_distribution jsonb
audience_location_distribution jsonb
engagement_rate numeric nullable
average_views numeric nullable
content_themes jsonb nullable
source_confidence_score numeric
freshness_status
consent_basis
created_by
created_at
```

No ERD change is approved by this document.

### OpenAPI Impact

Possible future endpoint examples:

```text
POST /v1/account-insights/snapshots
GET  /v1/account-insights/snapshots/{snapshot_id}
GET  /v1/campaigns/{campaign_id}/account-insights
```

No OpenAPI change is approved by this document.

### QA Impact

Future QA must cover:

- Tenant isolation.
- Workspace-scoped reads and writes.
- Consent basis requirement.
- Source confidence validation.
- Stale data warning.
- External API failure handling.
- Manual vs connector-provided data distinction.
- No mutation of historical snapshots.

### RBAC Impact

Potential permissions:

```text
account_insight:snapshot:create
account_insight:snapshot:view
account_insight:snapshot:attach_to_campaign
account_insight:snapshot:invalidate
```

### AuditLog Impact

Potential audit events:

```text
account_insight.snapshot.created
account_insight.snapshot.viewed
account_insight.snapshot.attached_to_campaign
account_insight.snapshot.invalidated
```

### UsageMeter / CostEvent Impact

If external APIs or AI analysis are used:

```text
UsageMeter: record governed usage only after valid usable output
CostEvent: record external API/model cost
Connector audit: record provider, endpoint class, status, and failure reason
```

### Recommendation

Proceed only if Marketing OS V1 already includes account analysis. If not, classify as Extended V1 and do not change current Phase 0/1 contracts now.

---

## 5. Candidate 3 - Trend Signals

### Classification

```text
Phase: Extended V1 only
Status: Useful later, not now
Implementation: Not approved
Risk level: Medium
```

### Purpose

Provide campaign planners with governed trend, niche, seasonal, and content opportunity signals.

This supports future campaign ideation but is not required for the first commercially governed launch.

### Why It Is Not Core V1

Trend signals can improve ideation, but they are not foundational. Adding them too early risks distracting from core campaign, brief, asset, approval, publishing, performance, RBAC, audit, and cost-control foundations.

### Required Product Behavior

The system may provide:

- Trend name.
- Niche/category.
- Region or market relevance.
- Seasonality.
- Source type.
- Confidence score.
- Freshness date.
- Suggested campaign use.
- Risk notes.

The system must not:

- Treat AI-generated trend output as fact without source/confidence labeling.
- Auto-create campaigns from trends.
- Auto-publish trend-based content.
- Bypass human review.
- Record usage without metering.

### Suggested Domain Concept

```text
TrendSignal
NicheTrendSignal
SeasonalOpportunity
```

### ERD Impact

Potential future fields:

```text
id
workspace_id nullable
source_type
source_name
trend_name
niche
region nullable
language nullable
confidence_score
freshness_date
valid_from nullable
valid_until nullable
suggested_usage jsonb
risk_notes jsonb nullable
model_name nullable
model_version nullable
prompt_version nullable
created_at
```

No ERD change is approved by this document.

### OpenAPI Impact

Possible future endpoint examples:

```text
GET  /v1/intelligence/trends
POST /v1/intelligence/trends/generate
POST /v1/intelligence/trends/{trend_id}/attach-to-brief
```

No OpenAPI change is approved by this document.

### QA Impact

Future QA must cover:

- Trend freshness and expiration.
- AI fallback behavior.
- Confidence score boundaries.
- Provider failure.
- Cost metering.
- Prompt version traceability.
- No auto-campaign creation.
- No auto-publishing.

### RBAC Impact

Potential permissions:

```text
trend_signal:view
trend_signal:generate
trend_signal:attach_to_brief
trend_signal:invalidate
```

### AuditLog Impact

Potential audit events:

```text
trend_signal.generated
trend_signal.viewed
trend_signal.attached_to_brief
trend_signal.invalidated
```

### UsageMeter / CostEvent Impact

If AI or external trend APIs are used:

```text
UsageMeter: governed use only
CostEvent: provider/model/API cost record
PromptVersion: required for AI-generated trend signals
```

### Recommendation

Keep as Extended V1. Do not implement during current Phase 0/1 reconciliation.

---

## 6. Candidate 4 - Creator Marketplace

### Classification

```text
Phase: Near-term discovery/RFC candidate only
Status: Added to near-term candidates for structured evaluation
Implementation: Not approved
Core V1: No
Extended V1: No, unless separately approved after RFC
Risk level: High
```

### Purpose

Evaluate whether Marketing OS should eventually support a controlled creator marketplace or partner marketplace that helps brands discover creators, influencers, affiliates, or content partners for campaigns.

This is a business-model and product-scope question before it is a technical feature.

### Why It Is Included in Near-Term Candidates

Creator Marketplace is included in the near-term list because the decision materially affects product positioning, data model boundaries, pricing, governance, and go-to-market strategy. Deferring the decision without structured discovery may create hidden rework later.

Near-term inclusion means:

```text
Discovery now.
RFC now.
No implementation now.
No ERD/SQL/OpenAPI/QA changes now.
No marketplace runtime now.
```

### Why It Must Not Be Implemented Now

Creator Marketplace can turn Marketing OS from a governed marketing operations system into a two-sided marketplace. That shift creates major new obligations:

- Creator onboarding.
- Creator verification.
- Brand/creator trust and safety.
- Marketplace search and ranking.
- Dispute handling.
- Messaging or communication governance.
- Contracting or engagement terms.
- Payment or commission questions.
- Platform abuse controls.
- Privacy and consent controls.
- Compliance and reputational risk.

### Required Discovery Questions

A near-term RFC must answer:

1. Is Creator Marketplace part of Marketing OS, or a separate product?
2. Is the target customer the brand, the agency, the creator, or the platform operator?
3. Does the marketplace create revenue, or only support campaign planning?
4. Is the first version a directory, a recommendation engine, or a transaction marketplace?
5. Will creators self-register, be imported, or be curated by admins?
6. Are payments, commissions, contracts, and disputes in scope?
7. Are communications allowed inside the platform, or only external links?
8. What minimum trust and safety controls are required?
9. What data can be collected about creators and audiences?
10. What consent basis is required?
11. How will ranking/recommendation be explained and audited?
12. How will marketplace scope avoid weakening current Phase 0/1 execution?

### Allowed Near-Term Scope

The only allowed short-term scope is documentation and validation:

```text
Creator Marketplace RFC
Creator/Partner Directory concept note
Creator discovery user journey
Marketplace risk register
Build-vs-separate-product decision matrix
```

### Explicitly Forbidden Near-Term Scope

```text
No creator signup implementation.
No creator profiles implementation.
No marketplace search implementation.
No chat implementation.
No payment implementation.
No contract implementation.
No commission model implementation.
No creator ranking algorithm implementation.
No automated outreach implementation.
No ERD/SQL/OpenAPI/QA patch from this document.
```

### Suggested Future Domain Concepts

Only if the RFC is approved later:

```text
CreatorProfile
PartnerProfile
CreatorAudienceSnapshot
CreatorCapabilityTag
CreatorMarketplaceListing
CreatorMatchRecommendation
MarketplaceTrustSignal
MarketplaceConsentRecord
```

### ERD Impact

Potential future ERD impact is high and must be isolated from Core V1. It may require:

- Creator/partner profile tables.
- Marketplace listing tables.
- Consent records.
- Trust/safety records.
- Recommendation snapshots.
- Status history tables.
- Audit trail mappings.

No ERD change is approved by this document.

### OpenAPI Impact

Potential future endpoint examples:

```text
GET  /v1/creator-marketplace/listings
POST /v1/creator-marketplace/recommendations
GET  /v1/creator-marketplace/profiles/{creator_id}
POST /v1/creator-marketplace/profiles/{creator_id}/shortlist
```

No OpenAPI change is approved by this document.

### QA Impact

Future QA must cover:

- Tenant isolation.
- Creator data visibility.
- Permission boundaries.
- Consent enforcement.
- Ranking explainability.
- Search/filter correctness.
- Shortlist ownership.
- No cross-workspace leakage.
- Abuse and spam controls.
- Stale audience data warnings.

### RBAC Impact

Potential permissions:

```text
creator_marketplace:view
creator_marketplace:shortlist
creator_marketplace:recommend
creator_marketplace:admin_curate
creator_marketplace:trust_review
```

### AuditLog Impact

Potential audit events:

```text
creator_marketplace.profile_viewed
creator_marketplace.creator_shortlisted
creator_marketplace.recommendations_generated
creator_marketplace.listing_curated
creator_marketplace.trust_signal_updated
```

### UsageMeter / CostEvent Impact

If AI matching or external creator analytics are used:

```text
UsageMeter: required for AI recommendation generation
CostEvent: required for provider/model/API costs
PromptVersion: required for AI-generated recommendations
Connector audit: required for external platform data collection
```

### Recommendation

Add Creator Marketplace to near-term planning only as a discovery/RFC candidate. Do not implement until there is an explicit product decision that it belongs inside Marketing OS rather than being a separate product.

---

## 7. Rejected or Deferred InPactAI Ideas

| Idea | Decision | Reason |
|---|---|---|
| Creator marketplace implementation | Defer / RFC required | Added as near-term discovery candidate only; implementation is not approved |
| Creator-brand chat | Defer to Post V1 | Security, privacy, moderation, and retention complexity |
| Contract assistant | Reject now | Legal and reputational risk |
| Sponsorship payments | Reject now | Financial source-of-truth and compliance risk |
| Sponsorship applications | Defer | Requires partnership domain, approval workflow, and audit maturity |
| Creator collaboration hub | Defer to Post V1 | Social/collaboration scope expansion |
| Direct InPactAI code | Reject | GPL-3.0 and architecture mismatch |
| InPactAI analytics UI | Idea only | Not reliable as performance source of truth |
| Direct API/schema reuse | Reject | Not aligned with Marketing OS contract-first model |
| Automated outreach | Reject | High spam, platform compliance, and brand-risk exposure |

---

## 8. Recommended Next Documentation Step

If these candidates are accepted, create controlled RFCs in this order:

```text
1. docs/brief_enrichment_keyword_suggestion_rfc.md
2. docs/creator_marketplace_discovery_rfc.md
3. docs/audience_account_insight_snapshot_rfc.md
4. docs/trend_signals_extended_v1_rfc.md
```

The safest first candidate remains `Keyword Suggestion for Brief` because it improves the existing Brief workflow without expanding Marketing OS into marketplace, chat, or partner payment domains.

Creator Marketplace must be handled by its own RFC because its product-scope risk is materially higher than the other candidates.

Only after an RFC is approved should ERD/OpenAPI/QA/RBAC/AuditLog patches be drafted.

---

## 9. Final Decision

Near-term consideration is limited to:

```text
1. Keyword Suggestion for Brief - Core V1 candidate.
2. Audience / Account Insight Snapshot - V1 only if account analysis is approved; otherwise Extended V1.
3. Trend Signals - Extended V1 only, not now.
4. Creator Marketplace - near-term discovery/RFC candidate only; no implementation now.
```

Everything else remains inspiration only, deferred, or rejected.

This document is not an implementation authority. It is a scope-control document to prevent ungoverned expansion from InPactAI into Marketing OS.
