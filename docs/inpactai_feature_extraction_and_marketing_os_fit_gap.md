# InPactAI Feature Extraction and Marketing OS Fit/Gap Study

Status: Study and classification only  
Repository studied: `AOSSIE-Org/InPactAI`  
Target project: `Marketing OS`  
Decision scope: Documentation only  
Implementation status: Not approved  
ERD changes: Not applied  
SQL changes: Not applied  
OpenAPI changes: Not applied  
QA changes: Not applied  

---

## 1. Executive Summary

The decisive recommendation is: **Use InPactAI as inspiration only. Do not adopt its code directly into Marketing OS.**

InPactAI is useful as a product-pattern reference for creator/brand sponsorship matching, audience insight capture, creator collaboration, trend/niche signals, and influencer-style campaign discovery. However, it is not suitable for direct code adoption into Marketing OS because the repository appears materially less mature than its README-level product promise.

The most relevant reusable ideas for Marketing OS are:

1. Creator/brand or account/campaign matching.
2. Audience insight snapshots.
3. Trend/niche signals.
4. External channel diagnostics, especially YouTube-style account diagnostics.
5. Partnership opportunity workflow as a future optional domain.

The strongest blockers against direct adoption are:

1. **GPL-3.0 license risk** for direct code incorporation into a commercial/proprietary product.
2. No Workspace/Tenant isolation model visible in the studied code.
3. No production-grade RBAC or permission enforcement model.
4. No audit log discipline.
5. No UsageMeter or CostEvent tracking for AI/API usage.
6. AI logic is simple, hardcoded, and not governed by prompt versioning, guardrails, quality evaluation, or cost controls.
7. Several features described in the README are placeholders or mock UI rather than implemented production functionality.
8. The project risks pulling Marketing OS toward a creator marketplace before the current Phase 0/1 foundation is fully reconciled.

**Executive decision:** Do not merge code. Do not create ERD/SQL/OpenAPI/QA patches now. Record the findings only and treat any future adoption as a separately approved Partnership Intelligence or Channel Intelligence RFC.

---

## 2. Extracted Feature Inventory

| # | Extracted feature | Observed implementation level | Fit for Marketing OS | Classification | Rationale |
|---:|---|---|---|---|---|
| 1 | AI-driven sponsorship matchmaking | Basic matching between creators and sponsorships using audience overlap, engagement, and budget | Useful conceptually | Extended V1 / Idea Only | Relevant to future partnership intelligence, but not Core V1 and not mature enough as code |
| 2 | Audience insights | Age group, location, engagement rate, average views, attention time, and price expectation | Useful after redesign | Extended V1 | Fits account/campaign diagnostics if converted into governed snapshots |
| 3 | Sponsorship opportunities | Brand sponsorship records with budget, required audience, and status | Partially useful | Idea Only | Similar to partnership opportunity, not equivalent to Marketing OS Campaign |
| 4 | Sponsorship applications | Creator applies to sponsorship with proposal/status | Partially useful | Extended V1 / Post V1 | Requires approval workflow, state history, audit, and workspace ownership |
| 5 | Creator collaboration hub | Creator-to-creator collaboration concept | Weak near-term fit | Post V1 | Opens marketplace/social-network scope; should not enter Core V1 |
| 6 | Chat/messaging | WebSocket + Redis + DB chat | Low fit now | Post V1 / Reject as code | Potentially useful later, but current security/identity model is not sufficient |
| 7 | Trending niches | Gemini-generated daily list of trending content niches | Useful after redesign | Extended V1 | Strong fit with Trend & Season Engine if governed |
| 8 | YouTube channel info proxy | Backend fetch of YouTube channel snippet/statistics | Useful after redesign | Extended V1 | Fits account diagnostics if rate-limited, audited, normalized, and cost-controlled |
| 9 | Contract assistant | Described in README, but not materially implemented in reviewed files | Not usable | Reject | Do not treat placeholder as implemented capability |
| 10 | Pricing/deal optimization | Described in README; actual logic is simple budget/price comparison | Weak | Idea Only | Could inspire future pricing model but not usable now |
| 11 | ROI/performance analytics | Mostly placeholder/mock UI | Not usable | Reject as code / Idea Only | Marketing OS requires PerformanceEvent and report snapshots, not mock dashboards |
| 12 | Supabase Auth integration | Basic frontend auth and public/private routes | Weak fit | Idea Only | Marketing OS requires workspace-scoped RBAC and server-side enforcement |
| 13 | Protected routes | Authentication-only frontend guard | Not sufficient | Reject as code | Authentication is not authorization |
| 14 | Brand/creator dashboards | Useful UI references, many hardcoded values | Useful for UX inspiration | Idea Only | Visual ideas only; no source-of-truth value |
| 15 | Seed/sample data | Manual SQL seed and startup seed behavior | Not suitable | Reject | Unsafe for production patterns in governed SaaS |

---

## 3. Fit / Gap Table

| Domain | InPactAI observed capability | Marketing OS required capability | Fit / Gap | Decision |
|---|---|---|---|---|
| AI Workflow | Direct Gemini call for trending niches | Model registry, routing, prompt versioning, guardrails, cost tracking, evaluation | Major gap | Redesign only |
| Campaign Workflow | Sponsorship objects and applications | Campaign, Brief, MediaAsset, ChannelVariant, ApprovalDecision, PublishJob, PerformanceEvent | Major gap | Do not map directly |
| Content Generation | Not materially present | Core content generation and asset workflows | Gap | No adoption |
| Asset Management | Not present | MediaAsset and MediaAssetVersion governance | Gap | No adoption |
| User Roles | Simple creator/brand role | Workspace users, RBAC, permission scopes, role bindings | Major gap | Redesign only |
| Approval Workflow | Not present | Human-in-the-loop approvals with immutable decision records | Major gap | No adoption |
| Analytics | Placeholder/mock dashboards | PerformanceEvent, report snapshots, attribution discipline | Major gap | Reject as code |
| External Integrations | Supabase, Gemini, YouTube, Redis | Connector registry, credential security, webhook reliability, audit, cost controls | Partial conceptual fit | Redesign only |
| Governance | Minimal | AuditLog, consent, retention, immutable evidence, error model | Major gap | No adoption |
| Privacy | Not clearly modeled | Privacy & Consent Domain | Major gap | No adoption |
| Cost Control | Not present | UsageMeter and CostEvent | Major gap | No adoption |
| Scalability | Redis chat exists, but connection handling appears application-local | Multi-tenant SaaS scalability | Partial and insufficient | Post V1 only |
| Licensing | GPL-3.0 | Commercial-safe source integration | Legal gap | No direct code adoption |

---

## 4. What Fits Core V1

No InPactAI feature should be moved directly into Core V1.

The only narrow concept that may be considered for Core V1, if already aligned with the approved Marketing OS scope, is:

### 4.1 External Channel Diagnostics Concept

**Candidate concept:** Read-only channel/account diagnostics, such as a YouTube channel statistics snapshot.

**Condition for inclusion:** Only if Marketing OS Core V1 already includes account analysis before campaign creation.

**Required governance before inclusion:**

- Workspace-scoped connector account.
- Read-only permission model.
- Source attribution.
- Rate limiting.
- UsageMeter integration.
- CostEvent where applicable.
- AuditLog on fetch and view.
- Normalized ChannelDiagnosticSnapshot model.
- No campaign decision automation from raw external metrics.

**Decision:** Do not add now. Keep as a candidate concept only.

---

## 5. What Fits Extended V1

The following concepts may be appropriate after the Phase 0/1 foundation is reconciled and after Patch 002 status is resolved:

### 5.1 Trend / Niche Signal

A governed version of InPactAI's trending niches idea could support Marketing OS Trend & Season Engine.

**Required redesign:**

- `TrendSignal` or `NicheTrendSignal` entity.
- Source type: AI-generated, external API, manual, or hybrid.
- Prompt version ID.
- Model name/version.
- Confidence score.
- Workspace visibility policy.
- Cache/freshness policy.
- CostEvent linkage.
- AuditLog for generation and refresh.

### 5.2 Audience Insight Snapshot

InPactAI's audience fields can inspire a governed snapshot model.

**Potential Marketing OS model:** `ChannelAudienceSnapshot` or `ExternalAccountAudienceSnapshot`.

**Required fields:**

- `workspace_id`
- `external_account_id`
- `source_platform`
- `snapshot_at`
- `audience_age_distribution`
- `audience_location_distribution`
- `engagement_rate`
- `average_views`
- `attention_metric`
- `source_confidence_score`
- `consent_basis`
- `created_by`
- `created_at`

### 5.3 Partnership Match Recommendation

InPactAI's matching logic can inspire future campaign-to-creator or campaign-to-partner matching.

**Required redesign:**

- Explicit scoring policy.
- Explainable match reasons.
- Confidence score.
- No automatic outreach.
- Approval before use.
- Audit log on generation/view/export.

### 5.4 YouTube Channel Diagnostic

The YouTube channel info proxy concept may fit account analysis.

**Required redesign:**

- Connector security layer.
- Credential isolation.
- Normalized response schema.
- Rate limiting.
- Error model.
- Audit log.
- Usage/cost metering.

---

## 6. What Should Be Deferred to Post V1

The following ideas should not enter Core V1 or Extended V1 unless there is a separate approved business case:

| Feature | Reason for deferral |
|---|---|
| Creator/brand marketplace | Shifts Marketing OS from marketing operations system to marketplace platform |
| Creator collaboration hub | Adds social-network/partner-network complexity |
| In-app chat | Requires security, moderation, retention, legal discovery, abuse handling, and availability planning |
| Contract negotiation assistant | Legal and reputational risk; requires controlled templates, jurisdiction, review gates, and audit |
| Pricing/deal optimization | Requires real performance history and defensible pricing model |
| Sponsorship payment tracking | Introduces financial workflows outside current Phase 0/1 scope |
| Automated negotiation | High legal and brand-risk exposure |
| Creator payout logic | Financial source-of-truth and compliance risk |

---

## 7. Source-of-Ideas Only

The following are useful only as product inspiration:

1. Match score badges.
2. Campaign/brand discovery cards.
3. Creator/brand role split in user experience.
4. Sponsorship opportunity cards.
5. Basic creator dashboard layout.
6. Brand dashboard layout.
7. Trending niches section.
8. Simple partnership pipeline vocabulary.
9. Audience demographic fields.
10. Candidate creator shortlist UX.

These must not be copied as code or treated as implementation evidence.

---

## 8. What Must Be Rejected

The following must be rejected for Marketing OS adoption in their current form:

| Item | Rejection reason |
|---|---|
| Direct source-code adoption | GPL-3.0 license and architectural mismatch |
| Current chat implementation | Identity, authorization, moderation, and scaling gaps |
| Current contract module | Placeholder, not a real contract assistant |
| Current analytics module | Placeholder/mock, not real analytics |
| Current frontend protected route pattern | Authentication-only; not RBAC |
| Startup table creation and seed behavior | Unsafe production pattern |
| Raw AI response logging | Privacy and security risk |
| Public CRUD-style routes without visible RBAC | Not acceptable for governed SaaS |
| Supabase direct table writes from route handlers as a pattern | Bypasses domain/service governance |
| Sponsorship payment model as financial basis | Not compatible with Marketing OS ledger/cost/billing discipline |
| Unversioned AI prompts | Not acceptable for governed AI product |
| Unmetered AI/API calls | Not acceptable for commercial SaaS |

---

## 9. Risk Register

| Risk | Probability | Impact | Mitigation | Blocks adoption? |
|---|---:|---:|---|---|
| GPL-3.0 contamination risk | High | Very high | Do not copy code; use clean-room redesign or obtain alternative license | Yes |
| Scope drift into marketplace | High | High | Keep partnership intelligence outside Core V1 | Yes for Core V1 |
| Missing workspace isolation | High | Very high | Require workspace context in all future models and APIs | Yes |
| Missing RBAC | High | Very high | Require permission scopes and server-side checks | Yes |
| Missing AuditLog | High | High | Add audit event mapping before any feature activation | Yes |
| AI cost exposure | Medium | High | UsageMeter and CostEvent required before AI calls | Yes |
| Unvalidated AI output | Medium | High | Add prompt version, guardrails, evaluator, confidence score | Yes |
| External API abuse or quota exhaustion | Medium | Medium/high | Rate limiting and connector state required | Yes |
| Privacy risk in audience analytics | High | High | Consent basis and retention policy required | Yes |
| Mock analytics mistaken for real reporting | High | High | Do not import analytics UI/code; require PerformanceEvent source | Yes |
| Chat abuse/compliance risk | Medium | High | Defer to Post V1 with moderation and retention policy | Yes now |
| Financial workflow contamination | Medium | Very high | Keep sponsorship payments out of current finance model | Yes |

---

## 10. Feature Impact Matrix: ERD / OpenAPI / QA / RBAC / Audit Logs

| Feature | ERD impact | OpenAPI impact | QA impact | RBAC impact | Audit Logs impact | Decision |
|---|---|---|---|---|---|---|
| Trend / Niche Signal | Add `TrendSignal` or `NicheTrendSignal` later | `GET /v1/intelligence/trends/niches` later | Freshness, cache, fallback, cost, confidence tests | Who can generate/view trends | `trend.generated`, `trend.refreshed`, `trend.viewed` | Extended V1 candidate |
| Audience Insight Snapshot | Add `ChannelAudienceSnapshot` later | Endpoints for read/create/import snapshots later | Schema validation, source confidence, tenant isolation | Workspace analyst/admin access | `audience_snapshot.created/viewed` | Extended V1 candidate |
| YouTube Channel Diagnostic | Add `ExternalChannelDiagnosticSnapshot` later | `GET /v1/connectors/youtube/channel-diagnostics` later | Rate limits, errors, quota, auth, normalization | Connector read permission | `connector.youtube.diagnostic_fetched` | Extended V1 candidate |
| Partnership Match Recommendation | Add `MatchRecommendation`, `MatchExplanation` later | `POST /v1/partnerships/matches` later | Determinism, scoring, explainability, no cross-tenant leakage | Campaign owner / analyst | `match.generated`, `match.viewed`, `match.exported` | Extended V1 / Post V1 |
| Sponsorship Opportunity | Add `PartnershipOpportunity` later | CRUD only after approval | Status, ownership, approval, idempotency | Partnership manager role | `partnership_opportunity.created/updated` | Post V1 unless approved |
| Sponsorship Application | Add `PartnershipApplication` later | Application submit/review endpoints later | Workflow transitions, rejection/approval, audit | Submitter/reviewer roles | `partnership_application.submitted/reviewed` | Post V1 |
| Creator Collaboration | Add collaboration entities later | Collaboration endpoints later | Invite, accept, reject, visibility | Creator/partner roles | `collaboration.invited/accepted/rejected` | Post V1 |
| Chat | Add message/conversation entities later | REST/WebSocket contract later | Auth, privacy, moderation, retention, delivery | Conversation participants only | `message.sent/read/deleted` | Post V1 / reject now |
| Contract Assistant | Add only after legal design | Contract draft endpoints later | Template control, legal disclaimers, approval | Legal/reviewer roles | `contract.drafted/reviewed/approved` | Reject now |
| Pricing Optimization | Add pricing model only with data | Pricing recommendation endpoint later | Explainability, bias, historical validity | Finance/manager roles | `pricing.recommended/viewed` | Post V1 |
| ROI Analytics | No reuse; Marketing OS already needs PerformanceEvent/report snapshots | No reuse | Existing QA should govern | Existing RBAC should govern | Existing report audit should govern | Reject InPactAI implementation |

---

## 11. Required Future RFC Before Any Adoption

Before implementing any InPactAI-inspired feature, create a separate RFC with the following minimum structure:

```text
Title: Partnership Intelligence / Channel Intelligence RFC

Required sections:
1. Problem statement.
2. User persona.
3. Business value.
4. Explicit non-goals.
5. Core V1 / Extended V1 / Post V1 classification.
6. Data model proposal.
7. API contract proposal.
8. RBAC model.
9. Audit event list.
10. Usage/cost model.
11. Privacy and consent basis.
12. QA scenarios.
13. Go / No-Go decision.
```

No implementation should start before this RFC is approved.

---

## 12. Final Executive Decision

**Final decision: Use as inspiration only.**

### Add now

Add this document only as a study artifact.

### Do not add now

Do not add ERD changes.  
Do not add SQL changes.  
Do not add OpenAPI changes.  
Do not add QA changes.  
Do not activate any InPactAI-inspired feature.  
Do not treat InPactAI as implementation evidence for Marketing OS readiness.

### Defer

Defer partnership matching, creator marketplace, chat, contract assistance, sponsorship applications, and pricing optimization until after the current Phase 0/1 foundation and Patch 002 reconciliation are completed.

### Reject

Reject direct code adoption, direct API reuse, direct schema reuse, and direct UI reuse.

### First safe next step

If leadership wants to proceed, the only safe next step is a standalone RFC for either:

1. `Channel Intelligence` focused on external account diagnostics; or
2. `Partnership Intelligence` focused on campaign-to-creator matching.

Both must remain outside Core V1 unless explicitly approved through contract-first documentation.
