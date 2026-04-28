# Marketing OS V5.6.5 Phase 0/1 — Contract Patch 002: Competitive Features

## 1. Patch Status

Status: `Pending / not-yet-activated`

This file is a contract reconciliation patch for selected competitive patterns identified in `docs/marketing_os_v5_6_5_phase_0_1_competitive_patch_002.md`.

This patch does not authorize implementation by itself. It defines the minimum contract boundaries that must be reconciled into ERD, SQL, OpenAPI, QA, RBAC, and audit logging before Patch 002 can be activated.

## 2. Executive Decision

Marketing OS will adopt only the competitive patterns that strengthen its position as a governed marketing operating system.

Approved adoption groups:

1. Attribution Backbone.
2. Brief Intelligence.
3. Creator Marketplace Lite.
4. Governed Publishing.
5. Video-Planning Outputs.

Excluded from Core V1:

- Full marketplace operations.
- Creator payments.
- Escrow.
- Commissions.
- Contract automation.
- Automated negotiation.
- Autonomous social engagement bots.
- Direct social publishing without human approval.
- Automated paid campaign execution.
- Full AI video rendering.
- Batch AI video generation.

## 3. Scope-Control Rule

Patch 002 is a controlled extension patch. It must not alter the current non-negotiable Phase 0/1 rules:

- `workspace_id` must never be trusted from a request body.
- Every workspace-scoped query must use workspace context.
- AI output must remain human-reviewable.
- Generated suggestions must not overwrite source records automatically.
- Approval, publish, evidence, and attribution records must be auditable.
- Historical snapshots must preserve historical truth.
- No autonomous publishing or paid execution is allowed.
- No social bot behavior is allowed.

## 4. Canonical Naming Decision

The conceptual feature names in the competitive extraction document must be implemented using repository-consistent snake_case table and endpoint naming.

| Conceptual Name | Canonical SQL Table Name |
|---|---|
| TrackingLink | `tracking_links` |
| TrackingDomain | `tracking_domains` |
| CampaignUtmTemplate | `campaign_utm_templates` |
| ClickEvent | `click_events` |
| ConversionEvent | `conversion_events` |
| AttributionSnapshot | `attribution_snapshots` |
| BriefSuggestion | `brief_suggestions` |
| CampaignBriefKeyword | `campaign_brief_keywords` |
| AudienceInsightSnapshot | `audience_insight_snapshots` |
| BrandFitSignal | `brand_fit_signals` |
| CreatorProfile | `creator_profiles` |
| CreatorChannel | `creator_channels` |
| CreatorAudienceSnapshot | `creator_audience_snapshots` |
| CreatorCampaignMatch | `creator_campaign_matches` |
| CreatorOutreachDraft | `creator_outreach_drafts` |
| CreatorCollaboration | `creator_collaborations` |
| CreatorCollaborationStatusHistory | `creator_collaboration_status_history` |
| ChannelVariant | `channel_variants` |
| PublishIntent | `publish_intents` |
| PublishAttempt | `publish_attempts` |
| PublishStatusHistory | `publish_status_history` |
| VideoScript | `video_scripts` |
| Storyboard | `storyboards` |
| StoryboardScene | `storyboard_scenes` |
| ShotPlan | `shot_plans` |
| VoiceoverScript | `voiceover_scripts` |

## 5. Existing Contract Preservation

Patch 002 must not replace or rename these existing canonical concepts:

| Existing Concept | Rule |
|---|---|
| `media_jobs` | Remains the source of AI generation execution metadata. |
| `media_assets` | Remains the media asset container. |
| `media_asset_versions` | Remains the versioned content source. |
| `approval_decisions` | Remains the canonical approval decision table. |
| `publish_jobs` | Remains the canonical publishing job table. |
| `manual_publish_evidence` | Remains the canonical manual publication proof table. |
| `audit_logs` | Remains append-only audit evidence, not business state. |

Patch 002 may add `publish_intents`, `channel_variants`, `publish_attempts`, and `publish_status_history`, but these must not bypass `approval_decisions`, `publish_jobs`, or `manual_publish_evidence`.

## 6. Feature Group Contracts

### 6.1 Attribution Backbone

Approved Core V1 capabilities:

- Tracking links.
- Tracking domains.
- UTM templates.
- Click event ingestion.
- Conversion event ingestion.
- Attribution snapshots.

Required contract rules:

- Every tracking link must belong to one workspace and one campaign.
- Every click event must reference one tracking link.
- Every conversion event must support idempotency.
- Attribution snapshots are historical records and must not be overwritten.
- Attribution data is analytical evidence, not billing, settlement, or financial truth.

Required canonical entities:

- `tracking_domains`
- `campaign_utm_templates`
- `tracking_links`
- `click_events`
- `conversion_events`
- `attribution_snapshots`

### 6.2 Brief Intelligence

Approved Core V1 capabilities:

- Keyword suggestions.
- Brief refinement suggestions.
- Messaging angle suggestions.
- Audience/account insight snapshots.
- Brand fit signals.

Required contract rules:

- Suggestions are advisory until explicitly accepted.
- Suggestions must not overwrite `brief_versions` automatically.
- Accepted suggestions must produce audit events.
- AI metadata must be stored with every suggestion.
- Audience/account snapshots must include source metadata and freshness metadata.

Required canonical entities:

- `brief_suggestions`
- `campaign_brief_keywords`
- `audience_insight_snapshots`
- `brand_fit_signals`

### 6.3 Creator Marketplace Lite

Approved Core V1 near-term capabilities:

- Creator directory.
- Creator profiles.
- Creator channels.
- Creator audience snapshots.
- Campaign-to-creator matching.
- Creator outreach draft generation.
- Creator collaboration status tracking.

Required contract rules:

- This is not a financial marketplace.
- Creator fit score is advisory only.
- Creator matching must not create a payment, contract, commission, or legal obligation.
- Outreach drafts must not be sent automatically.
- Creator data must be isolated by workspace unless a future shared-directory governance model is approved.
- Scraping-based enrichment is not approved in Core V1.

Required canonical entities:

- `creator_profiles`
- `creator_channels`
- `creator_audience_snapshots`
- `creator_campaign_matches`
- `creator_outreach_drafts`
- `creator_collaborations`
- `creator_collaboration_status_history`

### 6.4 Governed Publishing

Approved Core V1 capabilities:

- Channel-specific content variants.
- Publish intent tracking.
- Publish approval linkage.
- Publish attempts.
- Publish status history.
- Manual publish evidence linkage.

Required contract rules:

- Channel variants must be linked to approved or reviewable media asset versions.
- Publish intent does not equal publish execution.
- Publish execution must remain governed by approval state and publish job rules.
- Manual publish evidence must remain protected from unrestricted edits.
- No endpoint may support autonomous social posting in Core V1.

Required canonical entities:

- `channel_variants`
- `publish_intents`
- `publish_attempts`
- `publish_status_history`

Existing canonical entities retained:

- `approval_decisions`
- `publish_jobs`
- `manual_publish_evidence`

### 6.5 Video-Planning Outputs

Approved capabilities:

- Video scripts.
- Storyboards.
- Storyboard scenes.
- Shot plans.
- Voiceover scripts.

Required contract rules:

- Video-planning outputs are content planning artifacts only.
- Full AI video rendering is excluded from Core V1.
- Batch video generation is excluded from Core V1.
- Every output must be workspace-scoped, campaign-scoped, and generated under traceable AI metadata.

Required canonical entities:

- `video_scripts`
- `storyboards`
- `storyboard_scenes`
- `shot_plans`
- `voiceover_scripts`

## 7. Required RBAC Additions

Patch 002 must introduce or reconcile the following permission codes:

```text
brief.ai_suggest
brief.suggestion.accept
brief.suggestion.reject
tracking_link.create
tracking_link.view
tracking_event.ingest
tracking_event.view
creator.view
creator.create
creator.edit
creator.match
creator.outreach.generate
creator.collaboration.create
creator.collaboration.update_status
content.variant.create
content.variant.view
publish.intent.create
publish.intent.approve
publish.attempt.create
publish.status.view
video_planning.generate
video_planning.view
```

## 8. Required Audit Events

Patch 002 must introduce audit events for:

```text
brief_suggestion.generated
brief_suggestion.accepted
brief_suggestion.rejected
campaign_brief_keyword.created
audience_insight_snapshot.created
brand_fit_signal.created
tracking_domain.created
campaign_utm_template.created
tracking_link.created
click_event.ingested
conversion_event.ingested
attribution_snapshot.created
creator_profile.created
creator_profile.updated
creator_channel.created
creator_audience_snapshot.created
creator_match.generated
creator_outreach_draft.generated
creator_collaboration.created
creator_collaboration.status_changed
channel_variant.created
publish_intent.created
publish_intent.approved
publish_attempt.created
publish_status.changed
video_script.generated
storyboard.generated
storyboard_scene.created
shot_plan.generated
voiceover_script.generated
```

## 9. Required QA Gates

Patch 002 must not be activated until QA validates:

- Tenant isolation across all new tables and endpoints.
- RBAC on every new endpoint.
- AI metadata preservation.
- Human-in-the-loop enforcement.
- Conversion idempotency.
- Attribution snapshot immutability.
- Creator fit score advisory-only behavior.
- No creator payments, escrow, commissions, or contracts.
- Publish intent cannot bypass approval.
- Manual publish evidence protections remain intact.
- No auto-follow, auto-like, auto-comment, or autonomous social publishing.
- No automated paid campaign execution.
- Video-planning outputs do not trigger rendering.

## 10. OpenAPI Patch Rules

The OpenAPI Patch 002 file may define candidate endpoints, but those endpoints remain inactive until:

1. SQL Patch 002 is reviewed.
2. RBAC permission mappings are reconciled.
3. QA cases are implemented.
4. ErrorModel alignment is verified.
5. Sprint planning explicitly includes the feature slice.

## 11. SQL Patch Rules

The SQL Patch 002 file must be additive and idempotent.

Rules:

- Use `CREATE TYPE ... EXCEPTION WHEN duplicate_object THEN NULL` for new enums.
- Use `CREATE TABLE IF NOT EXISTS`.
- Use `CREATE INDEX IF NOT EXISTS`.
- Preserve existing canonical table names.
- Do not alter existing production-critical behavior unless explicitly reconciled.
- Do not create payment, contract, escrow, or commission tables.
- Do not create autonomous social engagement tables.

## 12. Explicit No-Go Boundaries

Patch 002 is `NO-GO` if any of the following appear in SQL, OpenAPI, backlog, tests, or implementation:

- Creator payment tables.
- Escrow tables.
- Commission tables.
- Contract automation tables.
- Automated negotiation workflows.
- Auto-follow endpoints.
- Auto-like endpoints.
- Auto-comment endpoints.
- Autonomous social publishing endpoints.
- Paid budget mutation endpoints.
- Full video rendering jobs.
- Batch video generation jobs.
- Scraping-based creator enrichment without separate policy approval.

## 13. Activation Decision

Patch 002 remains inactive until all dependent files are reconciled:

```text
docs/marketing_os_v5_6_5_phase_0_1_competitive_patch_002.md
docs/marketing_os_v5_6_5_phase_0_1_contract_patch_002_competitive_features.md
docs/marketing_os_v5_6_5_phase_0_1_schema_patch_002.sql
docs/marketing_os_v5_6_5_phase_0_1_openapi_patch_002.yaml
docs/patch_002_pending_qa_addendum.md
```

## 14. Final Contract Decision

```text
GO: Contract reconciliation for selected competitive patterns.
GO: Documentation-only Patch 002 planning.
NO-GO: Implementation before SQL/OpenAPI/QA/RBAC/Audit reconciliation.
NO-GO: Full marketplace, payments, contracts, bots, paid execution, or full video rendering in Core V1.
```
