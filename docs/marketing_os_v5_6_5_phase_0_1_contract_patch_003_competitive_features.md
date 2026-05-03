# Marketing OS V5.6.5 Phase 0/1 — Contract Patch 003: Competitive Features

## 1. Patch Status

Status: `Draft / NO-GO / not-yet-activated`

Patch 003 is a future competitive expansion contract. It is not Patch 002. Patch 002 is already active on `main` for the limited connector/performance/contact/notification baseline.

This file defines candidate boundaries only. It does not authorize implementation.

## 2. Approved Planning Groups

Patch 003 may be studied under the following planning groups:

1. Attribution Backbone Expansion.
2. Brief Intelligence.
3. Creator Marketplace Lite.
4. Governed Publishing Expansion.
5. Video-Planning Outputs.

## 3. Contract Rules

Patch 003 must preserve these existing non-negotiable rules:

- `workspace_id` must never be trusted from a request body.
- Every workspace-scoped query must use workspace context.
- AI output must remain human-reviewable.
- Suggestions must not overwrite source records automatically.
- Approval, publish, evidence, and attribution records must be auditable.
- Historical snapshots must preserve historical truth.
- No autonomous publishing or paid execution is allowed.
- No social bot behavior is allowed.
- Financial ownership, billing, settlement, and evidence must remain separate.

## 4. Candidate Entity Families

The following are candidate families only and must not be treated as activated schema:

### 4.1 Attribution

- `tracking_domains`
- `campaign_utm_templates`
- `tracking_links`
- `click_events`
- `conversion_events`
- `attribution_snapshots`

### 4.2 Brief Intelligence

- `brief_suggestions`
- `campaign_brief_keywords`
- `audience_insight_snapshots`
- `brand_fit_signals`

### 4.3 Creator Marketplace Lite

- `creator_profiles`
- `creator_channels`
- `creator_audience_snapshots`
- `creator_campaign_matches`
- `creator_outreach_drafts`
- `creator_collaborations`
- `creator_collaboration_status_history`

### 4.4 Governed Publishing Expansion

- `channel_variants`
- `publish_intents`
- `publish_attempts`
- `publish_status_history`

These must not bypass existing canonical tables:

- `approval_decisions`
- `publish_jobs`
- `manual_publish_evidence`
- `audit_logs`

### 4.5 Video Planning

- `video_scripts`
- `storyboards`
- `storyboard_scenes`
- `shot_plans`
- `voiceover_scripts`

## 5. Required RBAC Planning

Candidate permission codes must be reconciled before implementation:

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

## 6. Required Audit Planning

Candidate audit events must be reconciled before implementation:

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

## 7. No-Go Boundaries

Patch 003 is `NO-GO` if any of the following appear as implementation scope:

- creator payment tables;
- escrow tables;
- commission tables;
- contract automation tables;
- automated negotiation workflows;
- auto-follow endpoints;
- auto-like endpoints;
- auto-comment endpoints;
- autonomous social publishing endpoints;
- paid budget mutation endpoints;
- full video rendering jobs;
- batch video generation jobs;
- scraping-based creator enrichment without separate policy approval.

## 8. Activation Decision

Patch 003 remains inactive until separate, approved, reconciled files exist for:

```text
docs/marketing_os_v5_6_5_phase_0_1_schema_patch_003.sql
docs/marketing_os_v5_6_5_phase_0_1_openapi_patch_003.yaml
docs/patch_003_pending_qa_addendum.md
```

These files, if created, must remain out of strict migration and OpenAPI activation until explicit approval.

## 9. Final Contract Decision

```text
GO: Patch 003 contract planning only.
NO-GO: Implementation.
NO-GO: Migration activation.
NO-GO: API activation.
NO-GO: Sprint 5.
NO-GO: Pilot/Production.
```
