# Marketing OS V5.6.5 Phase 0/1 — Competitive Pattern Adoption Scope

## 1. Executive Decision

Marketing OS may incorporate selected competitive patterns from creator collaboration, attribution, multi-channel publishing, AI content-generation, and marketing automation projects.

The approved adoption scope is deliberately constrained. The objective is to strengthen Marketing OS as a governed marketing operating system, not to convert it into a full influencer marketplace, autonomous social bot platform, video rendering system, or paid advertising execution engine.

## 2. Source Pattern Categories

The following project categories are treated as competitive pattern sources only. They are not approved as direct code dependencies unless a separate legal, security, architecture, and license review is completed.

| Category | Example Sources | Permitted Use |
|---|---|---|
| Attribution and link tracking | Dub-like platforms | Architecture and data model reference |
| Creator collaboration | InPactAI-like platforms | Product pattern reference |
| Creator discovery and matching | CreatorMatch / CreatorBrief-like projects | Matching and brief intelligence reference |
| AI content generation | short-video-factory-like projects | Workflow and planning reference |
| Multi-channel publishing | MultiPost / PostBot-like projects | Channel variant and publishing governance reference |
| Marketing automation | Parcelvoy-like systems | Segmentation and event-trigger ideas only |
| Referral and affiliate systems | RefRef-like systems | Future referral model reference |
| Rule-based campaign triggers | if-this-then-ad-like systems | Recommendation pattern reference only |
| Bots / auto-engagement tools | TikTok / Instagram / ReplyGuy-style bots | Policy review ideas only; not production scope |

## 3. Approved Core V1 Adoption Scope

Core V1 adoption is strictly limited to the following capability groups.

### 3.1 Attribution Backbone

Approved for Core V1:

- Tracking links.
- UTM governance.
- Click event capture.
- Conversion event capture.
- Attribution source snapshots.
- Campaign-level attribution reporting baseline.

Purpose:

- Establish measurable campaign impact.
- Prevent uncontrolled campaign naming and UTM drift.
- Preserve historical attribution context.
- Support future referral, creator, and channel performance analysis.

Non-negotiable constraints:

- Tracking links must be workspace-scoped.
- Conversion events must support idempotency.
- Attribution snapshots must preserve historical truth.
- UI totals must not become the financial or attribution source of truth.

### 3.2 Brief Intelligence

Approved for Core V1:

- Keyword suggestions for campaign briefs.
- Audience or account insight snapshots, only if account analysis is already within V1 scope.
- Brief refinement suggestions.
- Messaging angle recommendations.
- Brand fit notes.

Purpose:

- Improve campaign brief quality before content generation.
- Reduce generic AI outputs.
- Keep recommendations advisory and reviewable.

Non-negotiable constraints:

- AI-generated suggestions must not overwrite the brief automatically.
- Every suggestion must be accepted, rejected, or ignored by a human user.
- Every AI suggestion must store model name, model version, prompt version, and generation metadata.
- Accepted suggestions must be auditable.

### 3.3 Creator Marketplace Lite

Approved for near-term Core V1 scope only as a lite collaboration layer.

Approved capabilities:

- Creator directory.
- Creator profiles.
- Creator channels.
- Creator niche/category tags.
- Campaign-to-creator matching.
- Advisory creator fit score.
- Outreach draft generation.
- Collaboration status tracking.
- Collaboration status history.

Purpose:

- Allow brands to discover and shortlist creators.
- Support campaign-to-creator fit analysis.
- Enable governed outreach drafting without automating deals or payments.

Non-negotiable constraints:

- Creator fit score is advisory only.
- Creator matching must not create contractual, payment, or legal obligations.
- Creator data must be workspace-scoped unless explicitly designed as a governed shared directory.
- Outreach drafts must not be sent automatically.
- No scraping-based creator enrichment is approved in Core V1.

### 3.4 Governed Publishing

Approved for Core V1:

- Channel-specific content variants.
- Platform-specific preview.
- Publish intent tracking.
- Manual approval workflow.
- Manual publish evidence.
- Audit logging for publish-related actions.

Purpose:

- Separate content generation from approval and publishing.
- Prevent accidental or unauthorized posting.
- Preserve evidence of manual publication.

Non-negotiable constraints:

- No direct social publishing without human approval.
- No autonomous publishing in Core V1.
- Publish evidence must be protected from unrestricted modification.
- Any invalidation of publish evidence must be a limited state update and must not rewrite proof content.

### 3.5 Video-Planning Outputs

Approved for Core V1 or Extended V1 depending on implementation capacity:

- Video scripts.
- Storyboards.
- Storyboard scenes.
- Shot lists.
- Voiceover scripts.
- Short-form content planning.

Purpose:

- Prepare campaign-ready video concepts without introducing full video rendering complexity.

Non-negotiable constraints:

- Full AI video rendering is not approved for Core V1.
- Batch video generation is not approved for Core V1.
- Generated video-planning outputs must remain reviewable and versioned.

## 4. Extended V1 Candidates

The following may be considered for Extended V1 only after Core V1 contracts, QA, RBAC, audit logs, and migration safety are reconciled.

| Capability | Rationale | Condition for Promotion |
|---|---|---|
| Trend signals | Useful for timely content and campaign planning | Requires governed data sources and freshness metadata |
| Rule-based recommendations | Useful for campaign suggestions | Must remain recommendation-only, not auto-execution |
| Smart publisher queue | Useful after approval workflow matures | Requires retry, rate-limit, and failure-state governance |
| Referral link concepts | Useful after attribution backbone exists | Requires clear reward and liability boundaries |
| Reply assistant | Useful for human-in-the-loop response drafting | Must not send replies automatically |
| Basic creator performance snapshot | Useful after tracking links exist | Must not become payment or commission source of truth |
| Subtitles and captions planning | Useful for video workflow | Must not require full rendering engine |

## 5. Post V1 / Requires Separate Governance Approval

The following are explicitly excluded from Core V1 and Extended V1 unless a separate RFC is approved.

- Full marketplace operations.
- Creator payments.
- Escrow handling.
- Commission handling.
- Creator payout settlement.
- Contract generation.
- Legal agreement automation.
- Automated negotiation.
- Sponsorship pricing engine.
- Automated paid campaign execution.
- Automated budget changes.
- Autonomous social engagement bots.
- Auto-follow behavior.
- Auto-like behavior.
- Auto-comment behavior.
- Scraping-based engagement workflows.
- Direct social publishing without human approval.
- Full AI video rendering.
- Batch AI video generation.
- Journey builder as a full marketing automation engine.
- Lifecycle email/SMS/push automation beyond controlled V1 messaging primitives.

## 6. Rejected as Production Code in Current Scope

The following patterns must not be imported, copied, or implemented as production behavior in the current project scope.

| Pattern | Decision | Reason |
|---|---|---|
| TikTok/Instagram auto-follow bots | Reject as production behavior | High platform-policy, spam, and reputation risk |
| Auto-like systems | Reject as production behavior | Low business defensibility and high account risk |
| Auto-comment systems | Reject as production behavior | Spam, brand safety, and platform enforcement risk |
| ReplyGuy-style autonomous replies | Reject as production behavior | Uncontrolled brand voice and policy risk |
| Browser-session publishing automation | Not Core V1 | Weak SaaS governance without explicit connector and audit controls |
| Scraping-based creator enrichment | Not Core V1 | Consent, platform-policy, and data reliability risk |

These patterns may remain in research notes under `Ideas for Policy Review Only`, but they must not be treated as approved implementation scope.

## 7. Fit / Gap Summary

| Source Pattern | Fit for Marketing OS | Approved Stage | Main Gap / Risk |
|---|---:|---|---|
| Attribution platforms | Very High | Core V1 | Must preserve event integrity and idempotency |
| Creator collaboration platforms | High | Core V1 Lite only | Full marketplace would create legal/financial scope |
| Creator brief/matching tools | High | Core V1 | Matching must remain advisory |
| AI short-video generation tools | Medium | Extended V1 / planning only | Rendering and batch generation are too heavy for Core V1 |
| Multi-channel posting tools | Medium | Core V1 governance only | Auto-publishing creates policy and operational risk |
| Marketing automation systems | Medium | Extended/Post V1 | Full journey builder is scope-heavy |
| Referral platforms | Medium | Extended/Post V1 | Requires attribution backbone first |
| Rule-based trigger systems | Medium | Extended V1 | Must remain recommendation-only |
| Social bots | Low / Risky | Policy Review Only | Platform, spam, and reputation risk |

## 8. Required ERD Impact

The following entities are candidates for Patch 002 reconciliation. They are not implementation authority until added to the canonical ERD, SQL, OpenAPI, QA, and RBAC contracts.

### 8.1 Core V1 Candidate Entities

- `TrackingLink`
- `TrackingDomain`
- `CampaignUtmTemplate`
- `ClickEvent`
- `ConversionEvent`
- `AttributionSnapshot`
- `BriefSuggestion`
- `CampaignBriefKeyword`
- `AudienceInsightSnapshot`
- `BrandFitSignal`
- `CreatorProfile`
- `CreatorChannel`
- `CreatorAudienceSnapshot`
- `CreatorCampaignMatch`
- `CreatorOutreachDraft`
- `CreatorCollaboration`
- `CreatorCollaborationStatusHistory`
- `ChannelVariant`
- `PublishIntent`
- `PublishApproval`
- `ManualPublishEvidence`
- `PublishAttempt`
- `PublishStatusHistory`
- `Storyboard`
- `StoryboardScene`
- `ShotPlan`
- `VideoScript`
- `VoiceoverScript`

### 8.2 Extended V1 Candidate Entities

- `TrendSignal`
- `RuleSignal`
- `RecommendationRule`
- `ReferralProgram`
- `ReferralLink`
- `CreatorPerformanceSnapshot`
- `ReplyAssistantSuggestion`

## 9. Required OpenAPI Impact

Candidate endpoints must be added only through a reconciled OpenAPI Patch 002.

### 9.1 Brief Intelligence

- `POST /briefs/{briefId}/keyword-suggestions`
- `POST /briefs/{briefId}/audience-insight-snapshots`
- `GET /briefs/{briefId}/suggestions`
- `POST /briefs/{briefId}/suggestions/{suggestionId}/accept`
- `POST /briefs/{briefId}/suggestions/{suggestionId}/reject`

### 9.2 Attribution

- `POST /campaigns/{campaignId}/tracking-links`
- `GET /campaigns/{campaignId}/tracking-links`
- `GET /tracking-links/{trackingLinkId}`
- `POST /events/click`
- `POST /events/conversion`

### 9.3 Creator Marketplace Lite

- `POST /creators`
- `GET /creators`
- `GET /creators/{creatorId}`
- `PATCH /creators/{creatorId}`
- `POST /campaigns/{campaignId}/creator-matches`
- `POST /campaigns/{campaignId}/creator-outreach-drafts`
- `POST /creator-collaborations`
- `PATCH /creator-collaborations/{collaborationId}/status`

### 9.4 Governed Publishing

- `POST /content/{contentId}/channel-variants`
- `POST /publish-intents`
- `POST /publish-intents/{publishIntentId}/approve`
- `POST /manual-publish-evidence`
- `POST /manual-publish-evidence/{evidenceId}/invalidate`

### 9.5 Video Planning

- `POST /campaigns/{campaignId}/video-scripts`
- `POST /campaigns/{campaignId}/storyboards`
- `POST /storyboards/{storyboardId}/scenes`
- `POST /storyboards/{storyboardId}/shot-plans`

## 10. Required RBAC Impact

The following permissions must be introduced or reconciled before implementation.

- `brief.view`
- `brief.edit`
- `brief.ai_suggest`
- `brief.suggestion.accept`
- `brief.suggestion.reject`
- `tracking_link.create`
- `tracking_link.view`
- `tracking_event.ingest`
- `tracking_event.view`
- `creator.view`
- `creator.create`
- `creator.edit`
- `creator.match`
- `creator.outreach.generate`
- `creator.collaboration.create`
- `creator.collaboration.update_status`
- `content.variant.create`
- `content.variant.view`
- `publish.intent.create`
- `publish.approve`
- `publish.evidence.create`
- `publish.evidence.invalidate`
- `video_planning.generate`
- `trend_signal.view`
- `recommendation_rule.view`

## 11. Required Audit Events

Every adopted pattern must be covered by audit logs.

Required audit events include:

- `brief_suggestion.generated`
- `brief_suggestion.accepted`
- `brief_suggestion.rejected`
- `audience_insight_snapshot.created`
- `tracking_link.created`
- `tracking_link.updated`
- `click_event.ingested`
- `conversion_event.ingested`
- `creator_profile.created`
- `creator_profile.updated`
- `creator_match.generated`
- `creator_outreach_draft.generated`
- `creator_collaboration.created`
- `creator_collaboration.status_changed`
- `channel_variant.created`
- `publish_intent.created`
- `publish_intent.approved`
- `manual_publish_evidence.created`
- `manual_publish_evidence.invalidated`
- `video_script.generated`
- `storyboard.generated`
- `shot_plan.generated`

## 12. Required QA Impact

Patch 002 must not be activated until QA covers at least the following scenarios.

| Area | Required QA Case |
|---|---|
| Tenant isolation | Workspace A cannot access creators, links, events, suggestions, or publish evidence from Workspace B |
| RBAC | Users without permissions cannot generate suggestions, create links, approve publish intents, or update collaboration status |
| AI metadata | AI suggestions must store model name, model version, prompt version, and generation metadata |
| Human-in-the-loop | AI suggestions and outreach drafts do not modify or send anything automatically |
| Tracking link integrity | Tracking links are created only under valid campaign and workspace context |
| Conversion idempotency | Duplicate conversion events with the same idempotency key do not double count |
| UTM governance | Invalid or uncontrolled UTM values are rejected or normalized according to policy |
| Attribution snapshots | Historical attribution snapshots do not change after campaign execution |
| Creator fit score | Fit score remains advisory and cannot create payment, contract, or approval state |
| Publish approval | Manual publish evidence cannot be created before required approval state |
| Manual evidence immutability | Proof content cannot be edited after creation; invalidation is state-limited |
| Auto-engagement prohibition | No endpoint or workflow allows auto-follow, auto-like, or auto-comment behavior |
| Paid execution prohibition | No workflow allows automatic paid campaign execution or budget changes |
| Video scope control | Video planning endpoints do not trigger rendering or batch generation |

## 13. Required RFC Rule for Any Expansion

Any future expansion beyond this approved scope must be introduced through a separate RFC covering:

- Product rationale.
- ERD impact.
- SQL and migration impact.
- OpenAPI impact.
- RBAC impact.
- Audit log impact.
- QA coverage.
- Legal risk.
- Platform policy risk.
- Data privacy and consent impact.
- Operational ownership.
- Failure states.
- Rollback plan.
- Explicit Go / No-Go decision.

No implementation may begin before the RFC is approved and reconciled with the canonical contracts.

## 14. Go / No-Go Conditions

### Go Conditions

The selected patterns may proceed to contract reconciliation if:

- Scope remains limited to Core V1 capabilities listed in this document.
- Full marketplace, payments, contracts, bots, and paid execution remain excluded.
- ERD, SQL, OpenAPI, QA, RBAC, and audit logs are updated consistently.
- Patch 002 naming and contract reconciliation is completed.
- Migration idempotency review is completed.
- Canonical QA coverage includes all Patch 002 cases.

### No-Go Conditions

Implementation must stop if any of the following occurs:

- Creator Marketplace Lite expands into creator payments, escrow, commissions, or contracts.
- Publishing scope expands into autonomous social posting.
- Recommendation scope expands into automated paid campaign execution.
- Video-planning scope expands into full rendering or batch generation.
- Bot-style auto-follow, auto-like, or auto-comment features are introduced.
- ERD, SQL, OpenAPI, QA, RBAC, and audit logs are inconsistent.
- Any feature relies on scraping or platform behavior that has not passed policy review.

## 15. Final Executive Decision

Adopt the following patterns into Marketing OS planning scope:

1. Attribution Backbone.
2. Brief Intelligence.
3. Creator Marketplace Lite.
4. Governed Publishing.
5. Video-Planning Outputs.

Defer the following:

1. Trend Signals to Extended V1.
2. Rule-based Recommendations to Extended V1.
3. Referral/Affiliate concepts to Extended or Post V1 after attribution is stable.
4. Reply Assistant to Extended V1 with human approval only.

Reject as production behavior in the current scope:

1. Autonomous social engagement bots.
2. Auto-follow, auto-like, and auto-comment workflows.
3. Scraping-based engagement systems.
4. Automated paid campaign execution.
5. Full marketplace payments, escrow, commissions, and contract automation.

This document is a scope-control and reconciliation input only. It does not activate Patch 002 implementation by itself.
