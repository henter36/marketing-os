# External OSS Feature Extraction Backlog for Marketing OS

**Document status:** Execution-ready feature intake document  
**Target location:** `docs/external_oss_feature_extraction_for_marketing_os.md`  
**Prepared for:** Marketing OS / AI Commerce Studio style product  
**Decision posture:** Extract, redesign, and govern. Do not copy whole products unless explicitly approved legally and architecturally.  
**Date:** 2026-04-27

---

## 0. Executive Decision

The reviewed repositories should not be treated as ready-made building blocks for direct insertion into the Marketing OS core. The correct approach is:

1. **Integrate only where the external product has a clean bounded context and can remain outside our source-of-truth model.**
   - Primary candidate: Dub, as a separate attribution/link tracking service or as a conceptual reference.

2. **Extract product patterns, not code, from projects with license, maturity, or operational risk.**
   - Primary sources: Parcelvoy, Chaskiq, RefRef, if-this-then-ad, short-video-factory, MultiPost, PostBot.

3. **Reject social engagement bots as product features.**
   - TikTok Bot, Instagram Bot, ReplyGuy-like auto-reply behavior, and uncontrolled AI posting should not enter the project backlog.

4. **Protect canonical truth.**
   - Marketing OS owns Campaign, Content Asset, Approval, Publish Job, Tracking Event, Conversion Event, Attribution Snapshot, Usage/Cost, and Audit truth.
   - External tools may execute, enrich, or sync events, but may not redefine financial, operational, or compliance truth.

**Recommended immediate backlog:**
- Attribution & Tracking Core.
- Governed Publishing Pipeline.
- Channel Adapter Registry.
- Rule Engine with dry-run and approvals.
- Segmentation v1.
- Journey v1, linear only.
- AI Media Job Pipeline.
- Referral Domain v1, non-financial first.
- Consent, Audit, RBAC, Webhook reliability, and Usage/Cost controls.

---

## 1. Source Review Summary

| Source project | Main value | Recommended use | Reason |
|---|---|---|---|
| Dub | Link attribution, short links, conversions, affiliate links | Separate service or rebuild concepts internally | Strong product fit, but AGPL/Open-Core risk if code is copied into commercial proprietary core |
| MultiPost-Extension | Browser-assisted multi-platform publishing | Companion extension concept / partial adapter | Useful publishing UX and extension API pattern; must be sandboxed and governed |
| PostBot | Multi-platform content sync, reader, platform adapters, plugin/API vision | Ideas only | Broad publishing concepts; license has added restrictions and browser permissions are broad |
| Parcelvoy | Journeys, campaigns, segmentation, messaging channels | Ideas only | Strong domain fit, but should not become core dependency; use as reference for journeys and segmentation |
| Chaskiq | Live chat, help center, consent, audit, roles, GraphQL, webhooks | Separate service only if support/chat is in scope; otherwise extract concepts | Useful engagement/support governance; operational and license complexity |
| RefRef | Referral attribution, rewards, fraud monitoring, approval/dispersal | Rebuild domain internally | Good referral domain model; alpha and AGPL make direct use risky |
| if-this-then-ad | Rule-based campaign automation based on external signals | Rebuild as governed rule engine | Excellent pattern for source/condition/target agents; execution must be approval-gated |
| short-video-factory | AI short video generation pipeline | Ideas only | Useful media-generation workflow; desktop/Electron and AGPL make direct integration unsuitable |
| InPactAI | Influencer/creator-brand workflow | Post V1 ideas only | Interesting market workflow; GPL and early maturity make it unsuitable for core |
| Vanjaro | Website builder/CMS/store UX | UX reference only | Different stack and domain; high risk of duplicate CMS/store source of truth |
| Usher Referrals | Web3 referral platform | Reject for normal Marketing OS; reference only if Web3 becomes explicit | Wallet/custody/blockchain complexity is outside sane V1 scope |
| TikTok Bot | Auto follow/like/comment | Reject | Account, platform-policy, and reputation risk |
| Instagram Bot | Auto follow/like/comment | Reject | Account, platform-policy, and reputation risk |
| Twitter auto poster | Simple AI posting automation | Ideas only, not code | Weak repository depth; automation needs approval and governance |
| ReplyGuy Clone | AI generated replies to scraped posts | Reject auto-reply behavior; retain review-queue idea only | Spam/reputation risk; use human-in-the-loop response assistant instead |

---

## 2. Non-Negotiable Architecture Rules

These rules must govern any feature extracted from the reviewed projects:

1. **Campaign source of truth remains internal.**
   - External platforms cannot own campaign state.

2. **Publishing is never financially authoritative.**
   - A published post may influence attribution but cannot define revenue, settlement, billing, or usage truth.

3. **AI output is never auto-approved by default.**
   - AI can generate drafts, variants, replies, scripts, and recommendations.
   - Human approval is required before publishing or external execution.

4. **Browser extension actions must be treated as client-side assisted execution.**
   - They are not backend truth.
   - They must return signed evidence to the backend.

5. **Attribution is a snapshot, not absolute truth.**
   - Keep immutable attribution snapshots per conversion.
   - Do not retroactively rewrite historical conversion attribution after rule/policy changes.

6. **No AGPL/GPL code copying into proprietary core without legal approval.**
   - Use API integration, clean-room redesign, or commercial license if needed.

7. **No social manipulation automation.**
   - Auto follow, auto like, auto comment, stealth scraping, or mass unsolicited replies are rejected.

8. **Every external execution must have idempotency, audit, retry, and rollback behavior where applicable.**

9. **Usage and cost must be metered at job/action level.**
   - AI generation, rendering, webhooks, publish attempts, and tracking events must be measurable.

10. **Tenant/workspace isolation is mandatory.**
    - Every table introduced by this document must include `workspace_id` unless it is a global catalog table explicitly approved as global.

---

## 3. Feature Backlog by Phase

## Phase 0 — Governance / Must Exist Before Feature Expansion

### F-001 External Source Catalog

**Purpose:** Maintain a controlled internal registry of external tools, channels, APIs, and open-source references.

**Inspired by:** All reviewed projects.

**Why now:** Prevent ad-hoc integrations and undocumented external dependencies.

**Core entities:**
- `external_sources`
- `external_source_versions`
- `external_source_risk_assessments`
- `external_source_license_reviews`

**Key fields:**
- `workspace_id` nullable only for global catalog entries.
- `source_name`
- `source_type`: `oss_reference`, `api_service`, `browser_extension`, `channel_platform`, `ai_model`, `analytics_service`
- `repository_url`
- `license_type`
- `license_risk_level`
- `operational_risk_level`
- `security_risk_level`
- `approved_usage`: `ideas_only`, `api_integration`, `separate_service`, `fork_allowed`, `rejected`
- `decision_reason`
- `reviewed_at`
- `reviewed_by_user_id`

**Acceptance criteria:**
- No new external integration may be added without a source record.
- Each source must have license and operational risk classification.
- Rejected sources cannot be selected in integration configuration.

---

### F-002 Canonical Audit Log Extension

**Purpose:** Expand audit logging to cover generation, approval, publishing, tracking, integration configuration, and rule execution.

**Inspired by:** Chaskiq audit concepts and overall governance need.

**Core entities:**
- `audit_logs`
- `audit_subjects`
- `audit_evidence_refs`

**Events to support:**
- `content.generated`
- `content.edited`
- `asset.versioned`
- `approval.requested`
- `approval.approved`
- `approval.rejected`
- `publish.scheduled`
- `publish.attempted`
- `publish.succeeded`
- `publish.failed`
- `publish.evidence_uploaded`
- `tracking_link.created`
- `conversion.received`
- `attribution.snapshot_created`
- `rule.dry_run_completed`
- `rule.execution_approved`
- `rule.execution_blocked`
- `integration.connected`
- `integration.revoked`

**Acceptance criteria:**
- Every sensitive action emits an audit event.
- Audit logs are append-only.
- Audit log payloads must include `workspace_id`, actor, subject type, subject id, event type, timestamp, and request id.

---

### F-003 Integration Credential Vault Interface

**Purpose:** Define how API keys, OAuth tokens, browser extension tokens, webhook secrets, and channel credentials are stored and rotated.

**Inspired by:** Dub, Chaskiq, if-this-then-ad, MultiPost/PostBot.

**Core entities:**
- `integration_connections`
- `integration_credentials`
- `integration_scopes`
- `credential_rotation_events`

**Rules:**
- Never store plaintext tokens in ordinary tables.
- Store encrypted references or vault identifiers.
- Support token revocation and rotation.
- Map credential ownership to workspace and channel.

**Acceptance criteria:**
- Credentials are never returned by API responses.
- Rotation emits audit log.
- Revoked credentials cannot run background jobs.

---

### F-004 Webhook Reliability Foundation

**Purpose:** Create reliable inbound and outbound webhook handling before adding external channel execution.

**Inspired by:** Chaskiq webhooks, Dub conversion/event ingestion, Parcelvoy integrations.

**Core entities:**
- `webhook_endpoints`
- `webhook_inbox_events`
- `webhook_delivery_attempts`
- `dead_letter_queue`
- `webhook_signing_keys`

**Capabilities:**
- Signature verification.
- Idempotency key handling.
- Retry with exponential backoff.
- Dead-letter handling.
- Replay with audit record.

**Acceptance criteria:**
- Duplicate webhook events do not create duplicate business events.
- Failed events go to DLQ after configured attempts.
- Replay requires permission and emits audit log.

---

## Phase 1 — Core Marketing OS Value

### F-101 Attribution & Tracking Core

**Inspired by:** Dub, RefRef, Usher, if-this-then-ad.

**Purpose:** Provide owned tracking links, click events, conversion event ingestion, and immutable attribution snapshots.

**Core entities:**
- `tracking_links`
- `tracking_link_destinations`
- `click_events`
- `conversion_events`
- `attribution_snapshots`
- `utm_templates`
- `bot_suspicion_signals`

**Capabilities:**
- Create branded short/tracking links.
- Attach link to campaign, asset version, channel variant, and publish job.
- Ingest click events.
- Ingest conversion events via API/webhook.
- Generate immutable attribution snapshot at conversion time.
- Support last-qualified-click initially.

**Required fields:**
- `workspace_id`
- `campaign_id`
- `content_asset_version_id`
- `channel_variant_id`
- `publish_job_id`
- `tracking_code`
- `destination_url`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`
- `created_by_user_id`
- `status`

**Acceptance criteria:**
- A conversion event must not mutate a prior attribution snapshot.
- Attribution method must be recorded per snapshot.
- Bot suspicion must not delete events; it must flag confidence.
- Reporting must separate raw clicks from qualified clicks.

**Rejected behavior:**
- Do not let Dub or any external link tool own the canonical conversion event.
- Do not retroactively rewrite attribution when campaign config changes.

---

### F-102 Governed Publishing Pipeline

**Inspired by:** MultiPost, PostBot, Parcelvoy, Chaskiq.

**Purpose:** Allow content to be prepared, adapted, approved, scheduled, published, and evidenced in a governed workflow.

**Core entities:**
- `content_assets`
- `media_asset_versions`
- `channel_variants`
- `publish_jobs`
- `publish_job_attempts`
- `manual_publish_evidence`
- `publish_status_history`

**Capabilities:**
- Create per-channel variant from a source asset.
- Validate variant against platform constraints.
- Require approval before scheduling/publishing.
- Track publish attempts and failures.
- Store manual publish evidence when publishing is done outside API.

**Approval gates:**
- AI-generated content cannot publish without approval.
- High-risk claims require special reviewer role.
- Failed policy validation blocks scheduling.

**Acceptance criteria:**
- Publish job references immutable asset version.
- Scheduling cannot occur without approval.
- Manual evidence cannot modify the original asset content.
- Publish state changes are append-only through status history.

---

### F-103 Channel Adapter Registry

**Inspired by:** MultiPost, PostBot, Parcelvoy, Chaskiq integrations, if-this-then-ad Target Agents.

**Purpose:** Provide a controlled registry of supported channels and their capabilities.

**Core entities:**
- `channel_platforms`
- `channel_adapters`
- `channel_adapter_capabilities`
- `channel_accounts`
- `channel_policy_constraints`

**Capabilities:**
- Define whether a channel supports API publishing, browser-assisted publishing, manual evidence, analytics import, comments import, or webhooks.
- Define content limits per channel.
- Define required scopes.
- Define whether publishing needs extra governance.

**Example capability flags:**
- `supports_api_publish`
- `supports_browser_publish`
- `supports_scheduled_publish`
- `supports_media_upload`
- `supports_analytics_import`
- `supports_comments_import`
- `requires_manual_evidence`

**Acceptance criteria:**
- UI cannot show unsupported actions.
- Each publish job validates channel capability before execution.
- Channel constraints are snapshotted into publish job at schedule time.

---

### F-104 AI Generation Job Governance

**Inspired by:** short-video-factory, InPactAI, ReplyGuy Clone, Twitter auto poster, Parcelvoy.

**Purpose:** Create a governed AI generation layer for copy, captions, variants, scripts, reply suggestions, image/video prompts, and video scripts.

**Core entities:**
- `generation_jobs`
- `generation_job_inputs`
- `generation_job_outputs`
- `generation_model_decisions`
- `generation_policy_results`
- `generation_cost_events`
- `generation_feedback`

**Capabilities:**
- Store prompt, input asset refs, model/provider/version, routing decision, and output refs.
- Validate output against brand rules, compliance rules, and prohibited claims.
- Meter cost and usage.
- Capture user acceptance/rejection and rejection reason.

**Acceptance criteria:**
- Generated output is a draft until approved.
- Failed generation does not count as billable commercial usage unless explicitly configured.
- Every generation has model/provider/version stored.
- Cost event links to workspace, user, job, provider, and model.

---

### F-105 Content Variant Validation

**Inspired by:** MultiPost/PostBot platform adaptation.

**Purpose:** Validate platform-specific channel variants before approval or scheduling.

**Core entities:**
- `channel_variant_validations`
- `platform_content_constraints`
- `policy_validation_results`

**Validation checks:**
- Character limit.
- Media count/type/dimensions.
- Link policy.
- Hashtag count.
- Required disclosure labels.
- Restricted claims.
- Missing image/video alt text where relevant.

**Acceptance criteria:**
- Blocker validation result prevents publish job scheduling.
- Warning validation result requires user acknowledgement.
- Validation is snapshotted per asset version and channel.

---

## Phase 1 Extended — Controlled Growth Features

### F-201 Segmentation v1

**Inspired by:** Parcelvoy, Chaskiq.

**Purpose:** Create rule-based segments for campaign targeting and reporting.

**Core entities:**
- `segments`
- `segment_conditions`
- `segment_snapshots`
- `segment_membership_events`

**V1 scope:**
- Rule-based segments.
- Manual refresh or scheduled refresh.
- Snapshot before campaign/journey execution.
- No complex real-time streaming dependency in V1.

**Acceptance criteria:**
- Segment snapshot must be immutable once used by campaign/journey.
- Segment condition changes do not alter prior campaign truth.
- Segment membership must be workspace-scoped.

---

### F-202 Journey v1 — Linear Only

**Inspired by:** Parcelvoy journeys.

**Purpose:** Support simple campaign journeys without a full visual builder.

**Core entities:**
- `journeys`
- `journey_steps`
- `journey_runs`
- `journey_step_runs`
- `journey_exit_conditions`

**V1 scope:**
- Linear sequence.
- Delays.
- Send/publish action.
- Wait for event.
- Basic branch only if strictly needed.

**Out of scope:**
- Full drag-and-drop builder.
- Complex multi-path orchestration.
- Real-time high-volume event streaming.

**Acceptance criteria:**
- Journey execution uses segment snapshot.
- Every step run has status and audit trail.
- Failed steps are retryable or manually skipped based on permission.

---

### F-203 Rule Engine Dry-Run

**Inspired by:** if-this-then-ad.

**Purpose:** Allow marketing decisions based on external/internal conditions, but start with dry-run and approvals.

**Core entities:**
- `rules`
- `rule_sources`
- `rule_conditions`
- `rule_actions`
- `rule_runs`
- `rule_run_results`
- `rule_execution_approvals`

**V1 scope:**
- Dry-run only by default.
- External actions require approval.
- Support source adapters and target adapters.
- Store evaluated input snapshot and result.

**Example use cases:**
- Suggest pausing a campaign if stock is low.
- Suggest increasing visibility if weather/seasonal signal matches.
- Suggest content variant based on performance threshold.

**Rejected in V1:**
- Automatic ad budget changes.
- Automatic campaign pause/resume without approval.
- Direct mutation of Google Ads/DV360 without dry-run evidence.

---

### F-204 Consent and Suppression Domain

**Inspired by:** Chaskiq GDPR consent, Parcelvoy messaging governance.

**Purpose:** Ensure outbound messaging, targeting, and tracking respect consent and suppression rules.

**Core entities:**
- `consent_records`
- `suppression_lists`
- `suppression_entries`
- `communication_preferences`
- `consent_audit_events`

**Acceptance criteria:**
- No journey or campaign message can target suppressed identity.
- Consent status must be checked before message execution.
- Consent changes are auditable and time-bound.

---

## Post V1 / Optional

### F-301 Browser Companion Extension

**Inspired by:** MultiPost, PostBot.

**Purpose:** Provide browser-assisted publishing where official APIs are unavailable or insufficient.

**Rules:**
- Extension must use least-privilege permissions.
- Extension receives workspace-bound short-lived action token.
- User must explicitly confirm action.
- Extension returns publish evidence.
- Backend remains source of truth for job and evidence.

**Out of scope until security review:**
- Continuous page scraping.
- Background autonomous publishing.
- Credential capture.
- Auto comments, auto follows, auto likes.

---

### F-302 Referral Domain v1

**Inspired by:** Dub, RefRef, Usher without Web3 custody.

**Purpose:** Support referral links and referral attribution before financial reward automation.

**Core entities:**
- `referral_programs`
- `referral_codes`
- `referral_events`
- `referral_reward_policies`
- `referral_fraud_signals`
- `referral_reward_approvals`

**V1 scope:**
- Referral link creation.
- Referral event tracking.
- Manual reward approval.
- Fraud signal tagging.
- No automatic payout initially.

**Rejected:**
- Crypto reward custody.
- Wallet private-key storage.
- Automatic reward payment before fraud and finance controls exist.

---

### F-303 Reply Assistant Queue

**Inspired by:** ReplyGuy Clone, Chaskiq quick replies.

**Purpose:** Provide AI-suggested replies for social/community/customer interactions without auto-posting.

**Core entities:**
- `reply_sources`
- `reply_suggestions`
- `reply_review_queue`
- `reply_decisions`
- `reply_publish_evidence`

**Rules:**
- AI may suggest.
- Human must approve.
- No stealth scraping or unsolicited mass replies.
- Each reply must link to source context and approved asset/version.

---

### F-304 AI Video Pipeline

**Inspired by:** short-video-factory.

**Purpose:** Add short-form video generation as a media pipeline after text/content governance stabilizes.

**Core entities:**
- `video_projects`
- `video_scripts`
- `video_storyboards`
- `voice_render_jobs`
- `subtitle_jobs`
- `video_render_jobs`
- `render_outputs`

**V1 style:**
- Script generation.
- Storyboard generation.
- Voice-over job.
- Subtitle job.
- Render job.
- Human approval before publish.

**Operational controls:**
- Storage limits.
- Render queue.
- Cost metering.
- Retry and cancel.
- Content policy validation.

---

## 4. Suggested Data Model Additions

### 4.1 External Source Governance

```text
external_sources
- id
- workspace_id nullable
- source_name
- source_type
- repository_url
- website_url
- license_type
- license_risk_level
- security_risk_level
- operational_risk_level
- approved_usage
- decision_reason
- reviewed_by_user_id
- reviewed_at
- created_at
- updated_at

external_source_license_reviews
- id
- external_source_id
- license_name
- commercial_use_allowed
- copyleft_risk
- network_use_obligation
- notes
- reviewed_by_user_id
- reviewed_at

external_source_risk_assessments
- id
- external_source_id
- risk_category
- risk_level
- risk_reason
- mitigation
- status
- created_at
```

### 4.2 Tracking and Attribution

```text
tracking_links
- id
- workspace_id
- campaign_id
- content_asset_version_id nullable
- channel_variant_id nullable
- publish_job_id nullable
- code
- destination_url
- status
- utm_source
- utm_medium
- utm_campaign
- utm_content
- utm_term
- created_by_user_id
- created_at

click_events
- id
- workspace_id
- tracking_link_id
- occurred_at
- request_id
- visitor_id_hash nullable
- session_id_hash nullable
- ip_hash nullable
- user_agent_hash nullable
- referrer_url nullable
- bot_suspicion_score
- raw_event_ref nullable

conversion_events
- id
- workspace_id
- external_event_id nullable
- occurred_at
- conversion_type
- conversion_value nullable
- currency nullable
- customer_ref_hash nullable
- source
- idempotency_key
- raw_payload_ref nullable

attribution_snapshots
- id
- workspace_id
- conversion_event_id
- attribution_method
- tracking_link_id nullable
- campaign_id nullable
- content_asset_version_id nullable
- channel_variant_id nullable
- publish_job_id nullable
- confidence_score
- snapshot_payload
- created_at
```

### 4.3 Publishing

```text
channel_platforms
- id
- name
- category
- status
- default_policy

channel_adapters
- id
- platform_id
- adapter_type
- version
- supports_api_publish
- supports_browser_publish
- supports_scheduled_publish
- supports_analytics_import
- supports_comments_import
- status

channel_accounts
- id
- workspace_id
- platform_id
- account_display_name
- external_account_ref
- connection_id
- status
- connected_by_user_id
- connected_at

channel_variants
- id
- workspace_id
- content_asset_version_id
- platform_id
- variant_body
- media_refs
- validation_status
- created_by_user_id
- created_at

publish_jobs
- id
- workspace_id
- campaign_id
- channel_variant_id
- channel_account_id
- scheduled_at nullable
- status
- approval_decision_id nullable
- idempotency_key
- created_by_user_id
- created_at

publish_job_attempts
- id
- workspace_id
- publish_job_id
- attempt_number
- started_at
- finished_at nullable
- status
- error_code nullable
- error_message nullable
- external_publish_ref nullable

manual_publish_evidence
- id
- workspace_id
- publish_job_id
- evidence_type
- evidence_url nullable
- evidence_payload
- status
- invalidation_reason nullable
- created_by_user_id
- created_at
```

### 4.4 AI Generation and Cost

```text
generation_jobs
- id
- workspace_id
- job_type
- input_asset_id nullable
- campaign_id nullable
- status
- requested_by_user_id
- provider
- model_name
- model_version
- prompt_hash
- created_at
- completed_at nullable

generation_job_outputs
- id
- workspace_id
- generation_job_id
- output_type
- output_ref
- policy_status
- accepted_status
- created_at

generation_cost_events
- id
- workspace_id
- generation_job_id
- provider
- model_name
- input_units
- output_units
- estimated_cost
- currency
- billable_status
- created_at

generation_feedback
- id
- workspace_id
- generation_job_output_id
- feedback_type
- rejection_reason nullable
- edited_output_ref nullable
- created_by_user_id
- created_at
```

### 4.5 Segments, Journeys, Rules

```text
segments
- id
- workspace_id
- name
- description
- status
- created_by_user_id
- created_at

segment_conditions
- id
- workspace_id
- segment_id
- condition_group
- field_name
- operator
- value_json

segment_snapshots
- id
- workspace_id
- segment_id
- snapshot_version
- member_count
- snapshot_ref
- created_at

journeys
- id
- workspace_id
- name
- status
- entry_segment_id nullable
- created_by_user_id
- created_at

journey_steps
- id
- workspace_id
- journey_id
- sequence_number
- step_type
- config_json

rules
- id
- workspace_id
- name
- status
- execution_mode
- created_by_user_id
- created_at

rule_runs
- id
- workspace_id
- rule_id
- mode
- started_at
- finished_at nullable
- result_status
- input_snapshot
- output_snapshot
```

---

## 5. Proposed API Surface

### Tracking

```yaml
POST /api/v1/tracking-links
GET /api/v1/tracking-links/{id}
POST /api/v1/events/click
POST /api/v1/events/conversion
GET /api/v1/conversions/{id}/attribution
```

### Publishing

```yaml
POST /api/v1/content-assets
POST /api/v1/content-assets/{id}/versions
POST /api/v1/channel-variants
POST /api/v1/channel-variants/{id}/validate
POST /api/v1/publish-jobs
POST /api/v1/publish-jobs/{id}/schedule
POST /api/v1/publish-jobs/{id}/cancel
POST /api/v1/publish-jobs/{id}/evidence
GET /api/v1/publish-jobs/{id}/timeline
```

### Channel Adapters

```yaml
GET /api/v1/channel-platforms
GET /api/v1/channel-adapters
GET /api/v1/channel-adapters/{id}/capabilities
POST /api/v1/channel-accounts/connect
POST /api/v1/channel-accounts/{id}/revoke
```

### AI Generation

```yaml
POST /api/v1/generation-jobs
GET /api/v1/generation-jobs/{id}
POST /api/v1/generation-jobs/{id}/cancel
GET /api/v1/generation-jobs/{id}/outputs
```

### Segments & Journeys

```yaml
POST /api/v1/segments
POST /api/v1/segments/{id}/snapshot
POST /api/v1/journeys
POST /api/v1/journeys/{id}/activate
POST /api/v1/journeys/{id}/pause
GET /api/v1/journeys/{id}/runs
```

### Rule Engine

```yaml
POST /api/v1/rules
POST /api/v1/rules/{id}/dry-run
POST /api/v1/rules/{id}/request-execution
POST /api/v1/rule-executions/{id}/approve
POST /api/v1/rule-executions/{id}/reject
GET /api/v1/rule-runs/{id}
```

### Webhooks

```yaml
POST /api/v1/webhooks/inbound/{sourceKey}
POST /api/v1/webhook-endpoints
POST /api/v1/webhook-endpoints/{id}/rotate-secret
POST /api/v1/webhook-events/{id}/replay
```

---

## 6. Admin Panel Requirements

### Required Admin Views for Core V1

1. **External Source Registry**
   - View approved/rejected external sources.
   - View license risk.
   - View approved usage mode.

2. **Integration Connections**
   - Connected platforms.
   - Token status.
   - Last successful sync.
   - Last failure.
   - Revoke/rotate credentials.

3. **Publish Operations Center**
   - Scheduled jobs.
   - Failed jobs.
   - Jobs requiring evidence.
   - Jobs blocked by approval/policy.

4. **Webhook Inbox/DLQ**
   - Failed events.
   - Replay controls.
   - Signature verification failures.

5. **AI Cost & Usage Monitor**
   - Cost by workspace.
   - Cost by model/provider.
   - Failed vs successful jobs.
   - Quota warnings.

6. **Attribution Monitor**
   - Click volume.
   - Conversion volume.
   - Unattributed conversions.
   - Suspected bot traffic.

7. **Rule Engine Console**
   - Rules in dry-run.
   - Rules awaiting approval.
   - Rules blocked by policy.
   - Historical runs.

---

## 7. Reporting / Analytics Requirements

### Core V1 Reports

1. Campaign Performance Summary.
2. Asset Variant Performance.
3. Channel Performance.
4. Tracking Link Performance.
5. Conversion Attribution Summary.
6. Publish Success/Failure Report.
7. AI Generation Acceptance Rate.
8. AI Rejection Reasons.
9. Cost per Campaign/Workspace.
10. Unattributed Conversion Report.

### Extended V1 Reports

1. Journey Funnel Report.
2. Segment Performance Report.
3. Referral Performance Report.
4. Fraud Signal Report.
5. Reply Assistant Acceptance Report.
6. Video Asset Performance Report.

---

## 8. Security and Compliance Controls

| Area | Required control |
|---|---|
| Browser extension | Least privilege, explicit user action, workspace token, signed publish evidence |
| OAuth/API credentials | Encrypted vault references, rotation, revocation, audit |
| Webhooks | Signature verification, replay prevention, DLQ |
| AI generation | Prompt/output logging, policy validation, no auto-publish |
| Tracking | Consent checks, bot suspicion fields, retention policies |
| Publishing | Approval before dispatch, immutable evidence, platform account mapping |
| Rules | Dry-run first, approval for external actions, execution snapshots |
| Referral | Fraud signals, manual approval before rewards |
| Reporting | Use snapshots, not mutable live config |
| Licensing | No GPL/AGPL copy into proprietary core without legal approval |

---

## 9. Rejected Features and Rationale

| Rejected feature | Source inspiration | Reason |
|---|---|---|
| Auto follow | TikTok Bot / Instagram Bot | Violates governance posture; high platform-policy and account-ban risk |
| Auto like | TikTok Bot / Instagram Bot | Low-quality growth tactic; reputational risk |
| Auto comment | TikTok Bot / Instagram Bot / ReplyGuy | Spam risk; brand safety issue |
| Unsolicited AI auto-replies | ReplyGuy Clone | Must become reply suggestion queue, not auto execution |
| Direct code fork of AGPL/GPL projects | Dub, RefRef, short-video-factory, Usher, InPactAI | Legal risk for proprietary/commercial product |
| Web3 wallet custody | Usher | Financial/security/compliance burden outside Marketing OS V1 |
| Full DNN/IIS CMS integration | Vanjaro | Stack and source-of-truth conflict |
| Direct ad budget mutation in V1 | if-this-then-ad | High financial risk; must start with dry-run recommendations |

---

## 10. Implementation Priority

### Must Build First

1. `External Source Catalog`.
2. `Webhook Reliability Foundation`.
3. `Integration Credential Vault Interface`.
4. `Audit Log Extension`.
5. `Tracking Links + Click Events + Conversion Events`.
6. `Attribution Snapshots`.
7. `Content Asset Versioning`.
8. `Channel Variants`.
9. `Publish Jobs + Approval + Evidence`.
10. `Usage/Cost Metering`.

### Build Second

1. `Channel Adapter Registry`.
2. `Segmentation v1`.
3. `Linear Journey v1`.
4. `Rule Engine Dry Run`.
5. `Consent & Suppression`.

### Build After Validation

1. Browser companion extension.
2. Referral program v1.
3. Reply assistant queue.
4. Video pipeline.
5. Help center.

### Do Not Build Now

1. Full journey visual builder.
2. Automatic ad controls.
3. Automatic reward payout.
4. Influencer marketplace.
5. Web3 referral/token rewards.
6. Social manipulation bots.

---

## 11. Suggested Sprint Mapping

### Sprint 0 — Governance & Contracts

- Add external source registry.
- Add integration risk fields.
- Confirm canonical audit events.
- Confirm license policy.
- Confirm source-of-truth boundaries.

### Sprint 1 — Tracking Foundation

- Tracking links.
- Click events.
- Conversion event API.
- Attribution snapshot.
- UTM template.

### Sprint 2 — Content & Publishing Foundation

- Content asset versions.
- Channel variants.
- Platform format validation.
- Publish jobs.
- Approval decision integration.
- Manual publish evidence.

### Sprint 3 — Integration Reliability

- Credential vault interface.
- Webhook inbox.
- Webhook delivery attempts.
- DLQ.
- Idempotency behavior.

### Sprint 4 — AI Governance & Cost

- Generation jobs.
- Model routing decision records.
- AI cost events.
- Policy validation result.
- Acceptance/rejection reporting.

### Sprint 5 — Segments, Journeys, Rules

- Segments.
- Segment snapshots.
- Linear journeys.
- Rule engine dry-run.
- Rule approval flow.

### Sprint 6 — Optional Growth Extensions

- Referral v1.
- Browser companion extension design.
- Reply assistant queue.
- Help center domain.

---

## 12. Go / No-Go Criteria Before Coding

### Go

Proceed if:
- Workspace/RBAC/Audit foundation already exists.
- ApprovalDecision and MediaAssetVersion are stable.
- ErrorModel is standardized.
- Idempotency pattern is defined.
- Usage/cost model is defined.
- Webhook reliability model is approved.
- License policy for external code is approved.

### No-Go

Do not proceed if:
- The team intends to copy AGPL/GPL code into proprietary core.
- Publishing can bypass approval.
- Attribution is mutable after conversion.
- External service can become source of truth for campaign, conversion, or financial state.
- Browser extension is allowed broad permissions without threat model.
- AI content can auto-publish.
- Social bots are proposed as growth features.

---

## 13. Final Recommendation

For Marketing OS, the highest-return path is not to install these repositories. The best path is to turn them into a governed feature backlog:

1. **Adopt Dub conceptually first** for attribution, links, conversions, and partner tracking.
2. **Adopt MultiPost/PostBot conceptually** for channel adapters and browser-assisted publishing, but only after the publish governance layer exists.
3. **Adopt Parcelvoy concepts** for segmentation and journeys, starting with linear journeys only.
4. **Adopt if-this-then-ad concepts** for rule automation, starting with dry-run recommendations only.
5. **Adopt Chaskiq concepts** for consent, audit, roles, help center, and engagement workflows.
6. **Adopt RefRef concepts** for referral tracking, fraud signals, and manual reward approval.
7. **Adopt short-video-factory concepts** for AI video pipeline, not its desktop code.
8. **Reject social manipulation bots** as product features.
9. **Reject Web3/custody patterns** unless the product strategy explicitly changes.

The immediate implementation package should be:

```text
1. Attribution & Tracking Core
2. Governed Publishing Pipeline
3. Channel Adapter Registry
4. Content Variant Validation
5. AI Generation Job Governance
6. Webhook Reliability
7. Credential Vault Interface
8. Usage & Cost Metering
9. Consent & Privacy Domain
10. Rule Engine Dry Run
```

This gives the project measurable marketing value without importing unsafe automation, licensing exposure, or source-of-truth conflict.

---

## 14. Source References

- short-video-factory: https://github.com/YILS-LIN/short-video-factory
- MultiPost-Extension: https://github.com/leaperone/MultiPost-Extension
- PostBot: https://github.com/gitcoffee-os/postbot
- Dub: https://github.com/dubinc/dub
- Dub self-hosting: https://dub.co/docs/self-hosting
- Parcelvoy platform: https://github.com/parcelvoy/platform
- Parcelvoy journeys: https://docs.parcelvoy.com/how-to/journeys/
- Chaskiq: https://github.com/chaskiq/chaskiq
- RefRef: https://github.com/refrefhq/refref
- if-this-then-ad: https://github.com/google/if-this-then-ad
- InPactAI: https://github.com/AOSSIE-Org/InPactAI
- Vanjaro.Platform: https://github.com/vanjarosoftware/Vanjaro.Platform
- Usher Referrals: https://github.com/usherlabs/usher-referrals
- TikTok Bot: https://github.com/somiibo/tiktok-bot
- Instagram Bot: https://github.com/somiibo/instagram-bot
- Twitter auto poster: https://github.com/VishwaGauravIn/twitter-auto-poster-bot-ai
- ReplyGuy Clone: https://github.com/cameronking4/ReplyGuy-clone
