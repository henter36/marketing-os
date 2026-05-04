# Approval Hash-Lock, Campaign State Machine, and Evidence Verification Protocol

**Document Type:** Governance Protocol  
**Project:** Marketing OS  
**Recommended Path:** `docs/approval_hash_lock_state_machine_and_evidence_protocol.md`  
**Status:** Draft — Pending Review  
**Version:** 1.0.0  
**Scope:** Documentation Only  
**Applies To:** Campaign lifecycle, content approvals, publishing, evidence, audit, and AI cost governance  
**Does Not Modify:** Runtime code, database schema, OpenAPI, generated clients, UI, workflows, deployment behavior, or package dependencies

---

## 1. Executive Decision

Marketing OS must not behave like a generic content generation tool. Its core value is the governed trust chain from campaign planning to content approval, publishing evidence, reporting, and learning.

Therefore, campaign lifecycle status, content approval, publishing eligibility, and evidence verification must be governed by explicit commands, immutable audit events, and hash-bound approval decisions.

Direct mutation of campaign status or approval state is prohibited.

---

## 2. Purpose

This protocol defines the non-negotiable governance rules required to prevent Marketing OS from degrading into an uncontrolled AI content studio or loose campaign tracker.

It establishes:

1. Campaign state machine.
2. Allowed and forbidden lifecycle transitions.
3. Command-based transition model.
4. Asset versioning and content hash rules.
5. ApprovalDecision binding to exact content versions.
6. Approval invalidation and revocation rules.
7. PublishJob blocking rules.
8. Evidence verification tiers.
9. Required audit events.
10. AI cost governance events.
11. ERD impact.
12. OpenAPI impact.
13. Test cases.
14. V1 / V1.5 / V2 boundaries.

---

## 3. Non-Negotiable Governance Principles

### 3.1 Marketing OS Owns Workflow Truth

Marketing OS is the source of truth for:

- Campaign workflow truth.
- Approval truth.
- Evidence truth.
- Audit truth.
- AI cost and usage truth.
- Campaign lifecycle state transitions.
- Report snapshot truth.

External systems may provide source data, execution signals, metrics, content references, or post IDs, but they must not override Marketing OS truth.

---

### 3.2 External Systems Are Not Governance Authorities

External systems may be integrated only within controlled boundaries:

| External System | Allowed Role | Forbidden Role |
|---|---|---|
| CMS / Strapi / Directus | Public content pages, landing pages, blog, FAQ | Approval truth, campaign truth, evidence truth |
| CRM / Frappe / HubSpot | Lead/contact source, consent signal, customer reference | Campaign ownership, approval state, workflow state |
| Commerce / Medusa / Shopify | Product/order reference, read-only attribution source | Payment truth, inventory truth, settlement truth inside Marketing OS |
| Social / Buffer / Meta / TikTok | Publish execution signal, external post ID, performance data | Approval truth, final report truth |
| Analytics / GA4 / PostHog | Performance event source | Immutable campaign result truth without Marketing OS normalization |
| Slack / Teams / Email | Notifications and alerts | Approval state, workflow truth, evidence truth |
| n8n / Make / Zapier | Non-critical integration middleware | Primary lifecycle engine or source of governance truth |

---

### 3.3 AI Is an Assistant, Not an Authority

AI may:

- Generate draft content.
- Suggest campaign angles.
- Summarize performance.
- Detect possible compliance issues.
- Recommend improvements.
- Estimate cost.
- Extract structured data.

AI must not:

- Approve content.
- Publish content without human-controlled policy.
- Override lifecycle state.
- Bypass RBAC.
- Change approval truth.
- Modify report snapshots.
- Replace evidence verification.
- Silently change published or approved content.

---

### 3.4 Status Is Derived, Not Freely Editable

Campaign status must be derived from validated lifecycle commands and state transitions.

The following pattern is prohibited:

```http
PATCH /campaigns/{id}
{
  "status": "approved"
}
```

The correct model is command-based:

```http
POST /campaigns/{id}/submit-for-review
POST /asset-versions/{id}/approve
POST /publish-jobs/{id}/submit-evidence
POST /publish-evidence/{id}/verify
```

---

### 3.5 Approval Must Be Bound to Exact Content

An approval is valid only for the exact approved asset version and its content hash.

If the content changes after approval, the approval becomes invalid for publishing.

---

### 3.6 Evidence Must Be Tiered

Evidence must not be designed as one heavy compliance model for all users.

Marketing OS must support evidence levels:

1. Basic.
2. Standard.
3. Automated.
4. Compliance.

This prevents V1 from becoming unusable while preserving enterprise governance capability.

---

### 3.7 Blockchain Is Explicitly Out of Scope for V1

Marketing OS does not require blockchain or mini-blockchain for V1.

The required V1 mechanism is:

- Append-only audit events.
- Content hash.
- Asset versioning.
- ApprovalDecision binding.
- Revocation event.
- Evidence record.
- Immutable report snapshot.

Future enterprise-grade hardening may consider external timestamping, KMS signing, WORM storage, or hash anchoring, but not in Core V1.

---

## 4. Core Domain Ownership

### 4.1 Marketing OS-Owned Truth

Marketing OS owns:

```text
Workspace
RBAC / user roles
Brand rules used for generation and compliance checks
Campaign lifecycle
Campaign state transitions
Brief versions
Asset versions
Content hashes
Approval decisions
Approval revocations
Publish jobs
Publish evidence
Evidence verification
Audit events
AI cost events
Report snapshots
```

---

### 4.2 External Truth Not Owned by Marketing OS

Marketing OS does not own:

```text
Payment truth
Settlement truth
Commerce order lifecycle truth
Inventory truth
CRM master customer truth
Social platform content lifecycle truth
External ad platform billing truth
External analytics raw event truth
```

Marketing OS may store references, normalized snapshots, and attribution interpretations, but must not claim ownership over external operational truth.

---

## 5. Campaign State Machine

### 5.1 Campaign States

The following states are recommended for the governed campaign lifecycle:

```text
draft
brief_ready
assets_in_progress
pending_review
approved
scheduled
published_pending_evidence
evidence_submitted
evidence_verified
completed
archived
cancelled
```

### 5.2 Optional Future States

The following may be added later if required by actual workflow behavior:

```text
blocked
changes_requested
partially_published
evidence_rejected
approval_revoked
report_locked
```

For V1, avoid excessive states unless required by real workflow behavior.

---

## 6. Campaign State Definitions

### 6.1 draft

Initial campaign state.

Allowed when:

- Campaign exists.
- Required campaign metadata may be incomplete.
- Brief may be missing or incomplete.
- Assets may not exist.

Cannot be published.

---

### 6.2 brief_ready

Campaign has a minimally valid brief.

Minimum conditions:

- Campaign objective exists.
- Audience or intended audience exists.
- Channel or channel intent exists.
- Offer/message direction exists where applicable.
- Owner exists.

---

### 6.3 assets_in_progress

Campaign has moved into content or media production.

Minimum conditions:

- Brief is ready.
- At least one asset draft or content plan exists.

---

### 6.4 pending_review

At least one asset version has been submitted for review.

Minimum conditions:

- AssetVersion exists.
- AssetVersion has content_hash.
- Review request exists.
- Approval policy is known.

---

### 6.5 approved

Campaign has one or more approved asset versions required for publishing.

Minimum conditions:

- ApprovalDecision exists.
- ApprovalDecision decision = approved.
- ApprovalDecision references asset_version_id.
- ApprovalDecision stores content_hash.
- The approved AssetVersion content_hash matches ApprovalDecision content_hash.
- ApprovalDecision is not revoked.

---

### 6.6 scheduled

Campaign has at least one PublishJob scheduled or ready to publish.

Minimum conditions:

- PublishJob exists.
- PublishJob references approved_asset_version_id.
- PublishJob stores approved_content_hash.
- ChannelAccount or manual channel context exists.
- Required evidence tier is set.

---

### 6.7 published_pending_evidence

Publishing has occurred or been marked as completed, but evidence is missing.

Minimum conditions:

- PublishJob status indicates published or manually marked published.
- Evidence requirement has not yet been fulfilled.

---

### 6.8 evidence_submitted

Evidence has been submitted but not verified.

Minimum conditions:

- PublishEvidence exists.
- Evidence is linked to PublishJob.
- Evidence type satisfies at least the configured tier input requirement.

---

### 6.9 evidence_verified

Evidence has been accepted by system verification, human verification, or both depending on tier.

Minimum conditions:

- PublishEvidence verification_status = verified.
- Verification method is recorded.
- Verified timestamp exists.
- Verified by system or authorized user.

---

### 6.10 completed

Campaign has completed its lifecycle and may have a report snapshot.

Minimum conditions:

- Required publish evidence is verified or waived by authorized policy.
- Report snapshot is created if reporting is in scope.
- No unresolved critical governance blocker exists.

---

### 6.11 archived

Campaign is no longer active but retained for history.

Minimum conditions:

- Campaign is completed, cancelled, or intentionally archived by authorized user.

---

### 6.12 cancelled

Campaign was intentionally stopped before completion.

Minimum conditions:

- Authorized cancellation command.
- Cancellation reason.
- Audit event.

---

## 7. Allowed State Transitions

| From | To | Required Command | Minimum Condition |
|---|---|---|---|
| draft | brief_ready | `markBriefReady` | Brief completeness passes minimum validation |
| brief_ready | assets_in_progress | `startAssetProduction` | Content plan or asset draft exists |
| assets_in_progress | pending_review | `submitForReview` | AssetVersion with content_hash exists |
| pending_review | approved | `approveAssetVersion` | ApprovalDecision approved and hash-bound |
| pending_review | assets_in_progress | `requestChanges` | Reviewer requests changes |
| approved | scheduled | `createPublishJob` | PublishJob references approved hash |
| scheduled | published_pending_evidence | `markPublished` or external publish success | Publishing occurred or was marked manually |
| published_pending_evidence | evidence_submitted | `submitEvidence` | Evidence record exists |
| evidence_submitted | evidence_verified | `verifyEvidence` | Evidence verification passes |
| evidence_verified | completed | `completeCampaign` | Required reporting/evidence checks pass |
| completed | archived | `archiveCampaign` | Authorized archival |
| draft / brief_ready / assets_in_progress / pending_review / approved / scheduled | cancelled | `cancelCampaign` | Authorized cancellation with reason |

---

## 8. Forbidden State Transitions

The following transitions are forbidden unless explicitly introduced later with a documented command, policy, and audit trail:

| From | To | Why Forbidden |
|---|---|---|
| draft | approved | Skips brief, asset, review, hash-lock |
| draft | scheduled | Skips approval |
| brief_ready | approved | Skips asset review |
| assets_in_progress | scheduled | Skips approval |
| pending_review | scheduled | Skips approval decision |
| approved | completed | Skips publish and evidence |
| scheduled | completed | Skips evidence |
| published_pending_evidence | completed | Skips evidence verification |
| any | approved via direct status patch | Breaks governance model |
| any | completed via direct status patch | Breaks audit and evidence chain |

---

## 9. Command-Based Transition Model

### 9.1 Required Pattern

Lifecycle changes must occur through explicit commands.

Examples:

```text
markBriefReady(campaign_id)
startAssetProduction(campaign_id)
submitForReview(asset_version_id)
approveAssetVersion(asset_version_id)
rejectAssetVersion(asset_version_id)
requestChanges(asset_version_id)
revokeApproval(approval_decision_id)
createPublishJob(campaign_id, approved_asset_version_id)
markPublished(publish_job_id)
submitEvidence(publish_job_id)
verifyEvidence(publish_evidence_id)
completeCampaign(campaign_id)
cancelCampaign(campaign_id)
archiveCampaign(campaign_id)
```

---

### 9.2 Prohibited Pattern

The following must not be allowed in API, UI, admin tools, scripts, or integrations without executing the corresponding command and validation:

```text
campaign.status = 'approved'
campaign.status = 'completed'
approval.status = 'approved'
publish_job.status = 'published'
evidence.status = 'verified'
```

---

## 10. Asset Versioning Protocol

### 10.1 Asset Entity

`Asset` represents the logical content item.

Examples:

- Instagram caption.
- Email subject line.
- Video script.
- Product visual.
- Landing page copy.

Asset alone is not approvable unless bound to an exact version.

---

### 10.2 AssetVersion Entity

`AssetVersion` represents an exact version of an asset.

Recommended fields:

```text
asset_version.id
asset_version.asset_id
asset_version.version_number
asset_version.content_body
asset_version.normalized_content
asset_version.content_hash
asset_version.content_type
asset_version.channel_context
asset_version.created_by
asset_version.created_at
asset_version.generation_job_id nullable
asset_version.model_name nullable
asset_version.model_version nullable
asset_version.status
```

---

### 10.3 Content Normalization

Before hashing, content must be normalized using a documented process.

Minimum recommended normalization:

```text
trim leading/trailing whitespace
normalize line endings
normalize unicode representation
preserve meaningful punctuation
preserve emojis
preserve hashtags
preserve URLs
preserve casing unless explicitly documented
```

Do not over-normalize content in a way that changes marketing meaning.

---

### 10.4 Content Hash

`content_hash` must be generated from `normalized_content`.

Recommended approach:

```text
content_hash = SHA-256(normalized_content)
```

For binary/media assets, hash must be calculated from the immutable stored file bytes or canonical file representation.

---

## 11. Approval Hash-Lock Rules

### 11.1 ApprovalDecision Entity

Recommended fields:

```text
approval_decision.id
approval_decision.asset_version_id
approval_decision.asset_id
approval_decision.campaign_id
approval_decision.content_hash
approval_decision.reviewer_id
approval_decision.decision
approval_decision.reason
approval_decision.created_at
approval_decision.revoked_at nullable
approval_decision.revoked_by nullable
approval_decision.revocation_reason nullable
approval_decision.approval_policy_id nullable
```

---

### 11.2 Approval Binding Rule

An ApprovalDecision is valid only when all are true:

```text
ApprovalDecision.decision = approved
ApprovalDecision.asset_version_id = PublishJob.approved_asset_version_id
ApprovalDecision.content_hash = AssetVersion.content_hash
ApprovalDecision.revoked_at is null
AssetVersion has not been superseded for the intended PublishJob unless policy allows older approved version
```

---

### 11.3 Approval Invalidation Rule

Approval becomes invalid for publishing when:

```text
AssetVersion content changes
A new AssetVersion is created and selected for publishing without approval
ApprovalDecision is revoked
ApprovalDecision content_hash does not match selected AssetVersion content_hash
ApprovalDecision asset_version_id does not match PublishJob approved_asset_version_id
Approval has expired under policy
Required reviewer policy is no longer satisfied
```

---

### 11.4 No Shadow Editing

After approval, the approved AssetVersion must be immutable.

If a user edits approved content, the system must create a new AssetVersion.

The new AssetVersion must require fresh approval before publishing.

---

## 12. Approval Revocation Protocol

### 12.1 Purpose

Revocation allows Marketing OS to invalidate a previously approved content version when risk, policy, legal, brand, or factual conditions change.

---

### 12.2 Revocation Conditions

Approval may be revoked when:

- Brand policy changes.
- Legal/compliance concern is discovered.
- Content claim becomes inaccurate.
- Product availability changes materially.
- Offer expires.
- User with authority revokes approval.
- Evidence shows published content differs materially.
- Security or abuse issue is discovered.

---

### 12.3 Revocation Command

Required command:

```text
revokeApproval(approval_decision_id, reason)
```

Minimum validation:

- User has revocation permission.
- ApprovalDecision exists.
- ApprovalDecision is currently active.
- Reason is provided.
- Audit event is recorded.

---

### 12.4 Revocation Effects

When approval is revoked:

- ApprovalDecision.revoked_at is set.
- ApprovalDecision.revoked_by is set.
- ApprovalDecision.revocation_reason is set.
- Related unsent PublishJobs are blocked.
- Related scheduled PublishJobs require revalidation.
- Related reports must show revocation context if relevant.
- Existing published content may require takedown workflow in future versions.

---

## 13. PublishJob Rules

### 13.1 PublishJob Entity

Recommended fields:

```text
publish_job.id
publish_job.campaign_id
publish_job.approved_asset_version_id
publish_job.approved_content_hash
publish_job.channel_account_id nullable
publish_job.channel
publish_job.scheduled_at nullable
publish_job.status
publish_job.evidence_tier
publish_job.created_by
publish_job.created_at
publish_job.published_at nullable
publish_job.external_post_id nullable
publish_job.failure_reason nullable
```

---

### 13.2 Publish Blocking Rule

Publishing must be blocked unless:

```text
Approved AssetVersion exists
ApprovalDecision exists
ApprovalDecision is approved
ApprovalDecision is not revoked
ApprovalDecision.content_hash matches AssetVersion.content_hash
PublishJob.approved_content_hash matches AssetVersion.content_hash
User has publish permission or self-publish is allowed by policy
Channel constraints are satisfied
Required evidence tier is defined
```

---

### 13.3 PublishJob Must Store Hash Snapshot

PublishJob must store:

```text
approved_asset_version_id
approved_content_hash
```

This prevents later ambiguity if the asset receives newer versions.

---

### 13.4 External Publishing Adapter Rule

External systems such as Buffer, Meta, TikTok, LinkedIn, Hootsuite, or manual publishing may execute publishing, but they must return or record execution signals into Marketing OS.

External publish success does not equal evidence verification.

---

## 14. Evidence Verification Tiers

### 14.1 Tier 1 — Basic Evidence

Best for:

- Solo users.
- Early MVP.
- Low-risk campaigns.
- Manual publishing.

Required:

```text
URL
submitted_by
submitted_at
publish_job_id
```

Optional:

```text
notes
channel
manual timestamp
```

Verification:

- Manual acceptance by authorized user, or
- System validates URL format and stores timestamp.

Risk:

- Low assurance.
- Acceptable only for non-regulated use cases.

---

### 14.2 Tier 2 — Standard Evidence

Best for:

- Agencies.
- Teams.
- Moderate governance needs.

Required:

```text
URL
screenshot
submitted_by
submitted_at
publish_job_id
```

Optional:

```text
external_post_id
page title
captured_at
screenshot_hash
```

Verification:

- Human or system-assisted verification.
- Screenshot stored in object storage.
- Screenshot hash recorded.

---

### 14.3 Tier 3 — Automated Evidence

Best for:

- Integrated publishing.
- Scaled workflows.
- Teams with active channel connectors.

Required:

```text
external_post_id
URL or platform permalink
platform response payload snapshot
published_at from platform when available
publish adapter identifier
```

Optional:

```text
automated screenshot
post metadata
platform content text
normalized published content hash
```

Verification:

- API or webhook-based confirmation.
- Adapter-level verification.
- Optional content comparison.

Important:

- External API response is an execution signal, not governance truth until recorded and verified inside Marketing OS.

---

### 14.4 Tier 4 — Compliance Evidence

Best for:

- Enterprise.
- Regulated industries.
- Sensitive claims.
- High-risk campaigns.

Required:

```text
URL
screenshot
external_post_id when available
published content snapshot
approved content hash
published content hash or normalized comparison
verifier_id
verified_at
verification notes
retention policy marker
```

Optional:

```text
KMS signature
external timestamp
WORM storage reference
redaction metadata
legal/compliance reviewer confirmation
```

Verification:

- System-assisted comparison.
- Human verification.
- Audit event.
- Optional compliance signoff.

---

## 15. PublishEvidence Entity

Recommended fields:

```text
publish_evidence.id
publish_evidence.publish_job_id
publish_evidence.evidence_type
publish_evidence.evidence_tier
publish_evidence.url nullable
publish_evidence.screenshot_asset_id nullable
publish_evidence.screenshot_hash nullable
publish_evidence.external_post_id nullable
publish_evidence.platform_payload_snapshot nullable
publish_evidence.published_content_snapshot nullable
publish_evidence.published_content_hash nullable
publish_evidence.verification_status
publish_evidence.verification_method
publish_evidence.submitted_by nullable
publish_evidence.submitted_at
publish_evidence.verified_by nullable
publish_evidence.verified_at nullable
publish_evidence.rejection_reason nullable
```

---

## 16. Evidence Capture Attempts

Not every evidence capture succeeds. Failures must be explicit.

Recommended fields:

```text
evidence_capture_attempt.id
evidence_capture_attempt.publish_job_id
evidence_capture_attempt.method
evidence_capture_attempt.status
evidence_capture_attempt.error_code nullable
evidence_capture_attempt.error_message nullable
evidence_capture_attempt.attempted_at
evidence_capture_attempt.completed_at nullable
```

Examples of failure:

- URL inaccessible.
- Platform requires login.
- Screenshot capture failed.
- API rate limit.
- Token expired.
- Post deleted.
- Permission denied.

---

## 17. Audit Events

### 17.1 Required Audit Event Principle

Every critical action must create an audit event.

Audit events must be append-only.

---

### 17.2 Required Audit Event Types

```text
campaign.created
campaign.brief_marked_ready
campaign.asset_production_started
campaign.submitted_for_review
campaign.state_transitioned
campaign.cancelled
campaign.archived

asset.created
asset_version.created
asset_version.content_hash_generated
asset_version.submitted_for_review

approval.approved
approval.rejected
approval.changes_requested
approval.revoked
approval.invalidated

publish_job.created
publish_job.scheduled
publish_job.blocked
publish_job.published_marked
publish_job.external_publish_succeeded
publish_job.external_publish_failed

evidence.submitted
evidence.capture_attempted
evidence.capture_failed
evidence.verified
evidence.rejected

report.snapshot_created
report.snapshot_locked

ai.generation_requested
ai.generation_completed
ai.generation_failed
ai.cost_recorded
```

---

### 17.3 Audit Event Minimum Fields

```text
audit_event.id
audit_event.workspace_id
audit_event.actor_user_id nullable
audit_event.actor_type
audit_event.entity_type
audit_event.entity_id
audit_event.event_type
audit_event.before_state nullable
audit_event.after_state nullable
audit_event.metadata jsonb
audit_event.created_at
audit_event.request_id nullable
audit_event.ip_address nullable
audit_event.user_agent nullable
```

---

## 18. AI Cost Governance

### 18.1 Required Principle

Every AI operation must be observable, attributable, and costed.

AI spend must not be invisible.

---

### 18.2 AICostEvent Entity

Recommended fields:

```text
ai_cost_event.id
ai_cost_event.workspace_id
ai_cost_event.campaign_id nullable
ai_cost_event.asset_id nullable
ai_cost_event.generation_job_id nullable
ai_cost_event.user_id nullable
ai_cost_event.provider
ai_cost_event.model_name
ai_cost_event.model_version nullable
ai_cost_event.input_tokens nullable
ai_cost_event.output_tokens nullable
ai_cost_event.image_count nullable
ai_cost_event.video_seconds nullable
ai_cost_event.estimated_cost
ai_cost_event.currency
ai_cost_event.purpose
ai_cost_event.created_at
```

---

### 18.3 Cost Controls

V1 should support at minimum:

```text
workspace monthly AI budget
cost warning threshold
cost hard stop threshold
per-generation estimated cost
cost event logging
```

Recommended thresholds:

```text
80% budget used -> warning
100% budget used -> block unless owner override
```

---

## 19. RBAC and Policy Modes

### 19.1 Recommended V1 Roles

Avoid overcomplicating V1.

Recommended minimal roles:

```text
Owner
Editor
```

Optional V1.5 / Enterprise roles:

```text
Reviewer
Publisher
Analyst
Admin
Compliance Reviewer
```

---

### 19.2 Approval Policy Modes

Recommended policy modes:

```text
self
peer
multi_reviewer
sequential
compliance
```

---

### 19.3 Self-Review Rules

Self-review is allowed in V1 for small teams, but it must not be invisible.

Self-review must require:

```text
explicit checklist confirmation
audit event
approval policy marker
content_hash binding
```

This preserves governance without blocking adoption.

---

## 20. Failure Modes and Mitigations

| Failure Mode | Risk | Mitigation |
|---|---|---|
| Direct status mutation | Breaks lifecycle integrity | Block direct status PATCH; use command endpoints |
| Asset edited after approval | Shadow editing | Immutable AssetVersion; new edit creates new version |
| Approval hash mismatch | Wrong content published | Block PublishJob |
| Approval revoked after scheduling | Invalid scheduled publish | Revalidate before publishing |
| External token expired | Publish failure | Pre-check connector, alert user |
| Evidence missing | Report not trustworthy | Keep campaign in published_pending_evidence |
| Evidence capture failed | Manual bottleneck | Record attempt, allow fallback tier |
| URL deleted or inaccessible | Cannot verify | Screenshot or platform payload required for higher tiers |
| API rate limit | Delayed automation | Queue + retry + user alert |
| AI cost spike | Unexpected billing | Cost event + budget threshold |
| AI output violates brand rules | Compliance risk | Guardrail check + review policy |
| Reviewer unavailable | Workflow delay | Escalation policy in V1.5 |
| External system sends wrong signal | False publish/evidence | Normalize and verify inside Marketing OS |

---

## 21. ERD Impact

Future ERD updates should add or confirm the following entities:

```text
campaign
campaign_state_transition
brief
asset
asset_version
review_request
approval_policy
approval_decision
approval_revocation
publish_job
publish_evidence
evidence_capture_attempt
audit_event
ai_generation_job
ai_cost_event
report_snapshot
channel_account
```

---

## 22. Suggested Relationships

```text
Workspace 1..n Campaign
Campaign 1..n BriefVersion
Campaign 1..n Asset
Asset 1..n AssetVersion
AssetVersion 1..n ApprovalDecision
Campaign 1..n PublishJob
PublishJob n..1 AssetVersion
PublishJob 1..n PublishEvidence
Campaign 1..n CampaignStateTransition
Workspace 1..n AuditEvent
Workspace 1..n AICostEvent
Campaign 1..n ReportSnapshot
```

---

## 23. OpenAPI Impact

Future OpenAPI updates should prefer command endpoints.

### 23.1 Campaign Commands

```http
POST /campaigns/{campaignId}/mark-brief-ready
POST /campaigns/{campaignId}/start-asset-production
POST /campaigns/{campaignId}/submit-for-review
POST /campaigns/{campaignId}/cancel
POST /campaigns/{campaignId}/complete
POST /campaigns/{campaignId}/archive
```

### 23.2 Asset and Approval Commands

```http
POST /assets/{assetId}/versions
POST /asset-versions/{assetVersionId}/submit-for-review
POST /asset-versions/{assetVersionId}/approve
POST /asset-versions/{assetVersionId}/reject
POST /asset-versions/{assetVersionId}/request-changes
POST /approval-decisions/{approvalDecisionId}/revoke
```

### 23.3 Publish Commands

```http
POST /campaigns/{campaignId}/publish-jobs
POST /publish-jobs/{publishJobId}/schedule
POST /publish-jobs/{publishJobId}/mark-published
POST /publish-jobs/{publishJobId}/external-result
```

### 23.4 Evidence Commands

```http
POST /publish-jobs/{publishJobId}/submit-evidence
POST /publish-jobs/{publishJobId}/capture-evidence
POST /publish-evidence/{publishEvidenceId}/verify
POST /publish-evidence/{publishEvidenceId}/reject
```

---

## 24. Forbidden OpenAPI Patterns

The following patterns should not be implemented:

```http
PATCH /campaigns/{campaignId}
{ "status": "approved" }
```

```http
PATCH /asset-versions/{assetVersionId}
{ "content_body": "edited after approval" }
```

```http
PATCH /approval-decisions/{approvalDecisionId}
{ "decision": "approved" }
```

```http
PATCH /publish-evidence/{publishEvidenceId}
{ "verification_status": "verified" }
```

Unless these are internally mapped to validated commands with strict permission checks, validation, state transition records, and audit events.

---

## 25. Required Test Cases

### 25.1 State Machine Tests

```text
cannot move draft directly to approved
cannot move brief_ready directly to scheduled
cannot move assets_in_progress directly to scheduled
cannot move pending_review to scheduled without approval
cannot complete campaign without evidence when evidence is required
can cancel campaign from draft
can cancel campaign from approved with reason
state transition creates audit event
forbidden transition returns explicit error
```

---

### 25.2 Hash-Lock Tests

```text
approval stores asset_version_id and content_hash
publishing is blocked if approved hash does not match asset version hash
editing approved content creates new asset version
new asset version is not automatically approved
revoked approval blocks publishing
expired approval blocks publishing when policy requires expiration
publish job stores approved_content_hash
```

---

### 25.3 Evidence Tests

```text
basic evidence accepts URL only when policy allows basic tier
standard evidence requires screenshot
automated evidence records external_post_id
compliance evidence requires verifier and content comparison fields
failed evidence capture creates evidence_capture_attempt
verified evidence creates audit event
rejected evidence does not complete campaign
```

---

### 25.4 AI Cost Tests

```text
AI generation creates ai_cost_event
cost event includes workspace_id, model, provider, estimated_cost
generation blocked when budget limit exceeded
warning event emitted at threshold
cost event linked to campaign where applicable
```

---

### 25.5 Permission Tests

```text
editor cannot revoke approval unless policy allows
publisher cannot approve unless reviewer role/policy allows
self-review requires explicit checklist
owner can cancel campaign with reason
unauthorized user cannot verify evidence
```

---

## 26. V1 Scope

V1 must implement the smallest useful governed lifecycle.

### Included in V1

```text
Campaign state enum
Command-based transitions
AssetVersion with content_hash
ApprovalDecision bound to asset_version_id and content_hash
Approval invalidation on content edit
Basic/Standard evidence tiers
PublishJob blocking on invalid approval
Audit events for critical actions
AI cost event logging
Basic campaign completion rules
Self-review and simple peer-review policy
```

### Excluded from V1

```text
Blockchain
Full agent orchestration
LangGraph workflows
Automated social publishing across all channels
Browser extension
Multi-touch attribution
Uplift modeling
ROI prediction
Advanced compliance signing
WORM storage
Cross-channel identity stitching
```

---

## 27. V1.5 Scope

V1.5 may add:

```text
Browser-assisted evidence capture
Buffer or Meta post_id capture
Approval expiration policies
Reviewer escalation
Advanced role separation
ChannelAccount constraints
Automated screenshot capture
Connector health checks
Budget alerts and hard stops
```

---

## 28. V2 Scope

V2 may add:

```text
API/webhook-based evidence verification
Automated publishing adapters
Content comparison between approved and published content
Compliance evidence package
KMS signing
External timestamping
Advanced AI routing
LangGraph for controlled workflows
Learning loop from performance to strategy recommendations
Multi-touch attribution
Uplift modeling
ROI prediction
```

---

## 29. Implementation Sequence Recommendation

Recommended order:

```text
1. Documentation approval for this protocol
2. PRD patch: Governed Campaign Lifecycle
3. ERD patch: lifecycle, approval, evidence, audit, cost entities
4. OpenAPI patch: command endpoints and forbidden direct mutation
5. Runtime Slice 1: state transition service + hash-lock + basic evidence
6. Runtime Slice 2: publish job blocking + audit events
7. Runtime Slice 3: cost governance and budget thresholds
8. Runtime Slice 4: assisted evidence capture
```

Do not start with AI agents, strategy room, or advanced analytics before lifecycle trust is enforced.

---

## 30. Acceptance Criteria for This Protocol

This protocol is acceptable when:

- It clearly blocks direct status edits.
- It defines command-based lifecycle transitions.
- It defines campaign states and allowed transitions.
- It defines forbidden transitions.
- It binds approval to `asset_version_id` and `content_hash`.
- It defines approval invalidation.
- It defines approval revocation.
- It defines PublishJob blocking rules.
- It defines evidence tiers.
- It separates V1 manual/assisted evidence from V1.5/V2 automation.
- It defines audit events.
- It defines AI cost event requirements.
- It lists ERD impact.
- It lists OpenAPI impact.
- It includes failure modes and mitigations.
- It excludes blockchain from V1.
- It excludes uncontrolled AI agent orchestration from V1.
- It preserves Marketing OS as workflow, approval, evidence, audit, and cost truth owner.

---

## 31. Final Governance Position

Marketing OS must compete on trust, not only generation speed.

The value is not that the system can generate captions. Many tools can do that.

The value is that Marketing OS can prove:

```text
What was planned
What was generated
What was approved
Who approved it
Which exact content hash was approved
What was published
What evidence proves publication
What performance followed
What report snapshot was locked
What AI cost was incurred
```

This trust chain is the product moat.

Any implementation that bypasses this chain turns Marketing OS into another replaceable content tool.
