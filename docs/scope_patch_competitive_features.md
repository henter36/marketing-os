# Scope Patch: Competitive Feature Candidates Within Current Marketing OS Scope

**Project:** Marketing OS  
**Document type:** Scope Patch / controlled candidate intake  
**Status:** Proposed scope patch — documentation only  
**Code impact:** No code changes authorized by this document  
**Source reference:** `docs/competitive_feature_extraction_and_fit_gap.md`  

---

## 1. Executive Decision

This patch identifies the competitive-reference features that can fit within the current Marketing OS direction without turning the product into a CRM, CMS, Commerce platform, ERP, collaboration suite, or autonomous agent system.

**Decisive conclusion:** the acceptable additions are not broad product expansions. They are governance, context, and execution-control improvements around existing Marketing OS domains:

1. Campaigns.
2. Briefs.
3. Generation jobs.
4. Media assets and versions.
5. Channel variants.
6. Approval decisions.
7. Publish jobs.
8. Manual publish evidence.
9. Performance events.
10. Report snapshots.
11. Usage and cost governance.
12. Tenant isolation, RBAC, audit, and immutable evidence.

No feature in this patch authorizes code implementation. Any accepted candidate must first be translated into the approved implementation chain:

```text
Scope Patch -> ERD/Data Contract -> SQL DDL -> OpenAPI -> Backlog -> QA Suite -> Implementation
```

---

## 2. Patch Boundary

## 2.1 Allowed intent

This patch may be used to strengthen:

- Review governance.
- Approval integrity.
- Campaign context quality.
- Channel-specific content validation.
- Product context snapshots.
- Provider/connector credential governance.
- Auditability and historical truth.
- Usage/cost visibility.

## 2.2 Explicitly disallowed intent

This patch must not be used to introduce:

- Full CRM.
- Full CMS builder.
- Full commerce backend.
- Full ERP/accounting.
- Embedded chat/collaboration platform.
- Auto-publishing.
- Paid media execution.
- Autonomous AI agents.
- MCP server/tool access.
- Visual workflow builder.
- Browser research agents.
- New unapproved provider integrations that write to external systems.

---

## 3. Candidate Feature Summary

| Priority | Candidate feature | Scope decision | Implementation posture |
|---:|---|---|---|
| 1 | Activity Timeline | In-scope as governance/read model | Add after audit/status model review |
| 2 | Approval Comments | In-scope as approval integrity support | Add with immutability/audit controls |
| 3 | Approval Checklist | In-scope if bound to ApprovalPolicy | Add as configurable review aid |
| 4 | Marketing Channel Profile | In-scope if limited to generation/validation | Add as channel constraint reference only |
| 5 | Channel Variant Quality Checks | In-scope as pre-review validation | Add as non-approval guardrail result |
| 6 | Commerce Product Snapshot | In-scope if read-only and historical | Add as campaign context snapshot only |
| 7 | Connector Readiness Layer | In-scope only as readiness metadata | Add without external writes/sync expansion |
| 8 | Provider Credential Governance | In-scope and security-critical | Add with encryption, RBAC, audit, rotation metadata |
| 9 | Generation Quality Score | In-scope if advisory only | Add with defined signals and no auto-approval |
| 10 | Report Snapshot Strengthening | In-scope and governance-critical | Add immutability/hash/source-period fields |

---

## 4. Candidate 1 — Activity Timeline

## 4.1 Decision

**Decision:** Add to scope as a governance/read-model capability.

This is not a new business module. It is a consolidated operational view over already-authorized events, status transitions, and audit records.

## 4.2 Purpose

Provide a chronological view of what happened to key Marketing OS entities.

Applicable entities:

- Campaign.
- Brief.
- GenerationJob.
- MediaAsset.
- MediaAssetVersion.
- ChannelVariant.
- ApprovalDecision.
- PublishJob.
- ManualPublishEvidence.
- PerformanceEvent.
- ReportSnapshot.

## 4.3 Expected timeline events

Examples:

- Campaign created.
- Brief submitted.
- Generation job started.
- AI provider selected.
- Usage/cost recorded.
- Guardrail check completed.
- Media asset version created.
- Channel variant generated.
- Approval requested.
- Approval accepted/rejected.
- Publish job prepared.
- Manual publish evidence attached.
- Manual publish evidence invalidated.
- Performance event ingested.
- Report snapshot generated.

## 4.4 Guardrails

- Timeline must not become a new source of truth.
- Timeline must read from authoritative audit/status/event records.
- Timeline entries must always be tenant-scoped.
- Sensitive fields must respect RBAC.
- Timeline must not expose cross-tenant actor names, payloads, or metadata.

## 4.5 Required future contract changes

### Proposed entities / views

| Object | Type | Status |
|---|---|---|
| ActivityTimelineEvent | Read model/view or derived table | Proposed |

### Proposed API shape

```text
GET /workspaces/{workspaceId}/timeline?entity_type=&entity_id=
GET /workspaces/{workspaceId}/campaigns/{campaignId}/timeline
GET /workspaces/{workspaceId}/media-assets/{assetId}/timeline
GET /workspaces/{workspaceId}/publish-jobs/{publishJobId}/timeline
```

### Required QA

- Tenant isolation: timeline must not leak events across workspaces.
- RBAC: actor/payload visibility must match permission level.
- Ordering: timeline must be deterministic by occurred_at and stable tie-breaker.
- Immutability: timeline entries derived from immutable events must not be editable.

---

## 5. Candidate 2 — Approval Comments

## 5.1 Decision

**Decision:** Add to scope as approval integrity support.

Approval comments are allowed only when attached to approval decisions or review steps. They must not become a general chat/threading system.

## 5.2 Purpose

Capture the reviewer rationale behind approval, rejection, or required changes.

Examples:

- Brand mismatch.
- Unsupported claim.
- Wrong tone.
- Channel length violation.
- Missing tracking link.
- Image not aligned with approved asset version.
- Legal/privacy risk.

## 5.3 Guardrails

- Comments attached to final ApprovalDecision should be immutable after decision creation.
- If editing is allowed for draft review notes, edits must be audited.
- Comment author, timestamp, workspace_id, entity reference, and decision reference must be preserved.
- Comments must not be used to bypass structured rejection reasons.

## 5.4 Required future contract changes

### Proposed entity

| Field | Description |
|---|---|
| id | Approval comment identifier |
| workspace_id | Tenant boundary |
| approval_decision_id | Linked decision |
| entity_type | Reviewed entity type |
| entity_id | Reviewed entity identifier |
| comment_body | Reviewer comment |
| comment_type | note / rejection_reason / change_request |
| created_by | Actor |
| created_at | Creation timestamp |
| immutable_after_decision | Whether locked after decision |

### Proposed API shape

```text
POST /workspaces/{workspaceId}/approval-decisions/{decisionId}/comments
GET /workspaces/{workspaceId}/approval-decisions/{decisionId}/comments
```

### Required QA

- Cannot comment on cross-tenant decisions.
- Final decision comments cannot be modified without audit policy.
- Rejection comment must not replace required rejection_reason where required.
- Unauthorized users cannot read sensitive comments.

---

## 6. Candidate 3 — Approval Checklist

## 6.1 Decision

**Decision:** Add to scope if bound to ApprovalPolicy and kept configurable.

This must be implemented as a review aid, not as a generic task management module.

## 6.2 Purpose

Reduce subjective approvals by forcing reviewers to verify defined checks before final approval.

Example checklist items:

- Brand tone matches BrandRuleSet.
- No unsupported health/legal/financial claims.
- Correct channel format.
- Required tracking link exists.
- Approved media asset version is used.
- No unauthorized third-party logo/image/reference.
- Manual publish evidence requirement is understood.

## 6.3 Guardrails

- Checklist completion must not equal final approval by itself.
- ApprovalDecision remains the final source of approval truth.
- Checklist templates must be controlled by ApprovalPolicy.
- Checklist item changes must be versioned or snapshotted at review time.

## 6.4 Required future contract changes

### Proposed entities

| Entity | Purpose |
|---|---|
| ApprovalChecklistTemplate | Defines checklist items under ApprovalPolicy |
| ApprovalChecklistResult | Captures checklist state for a specific review |

### Proposed API shape

```text
GET /workspaces/{workspaceId}/approval-policies/{policyId}/checklist-template
POST /workspaces/{workspaceId}/approval-decisions/{decisionId}/checklist-results
GET /workspaces/{workspaceId}/approval-decisions/{decisionId}/checklist-results
```

### Required QA

- Checklist template version must be preserved for historical decisions.
- Cannot approve if mandatory checklist items are incomplete when policy requires them.
- Checklist results must be tenant-scoped and RBAC-protected.

---

## 7. Candidate 4 — Marketing Channel Profile

## 7.1 Decision

**Decision:** Add to scope as a limited channel-constraint reference.

This must not introduce auto-publishing, external platform execution, or paid media management.

## 7.2 Purpose

Define channel-specific constraints used during content generation, validation, and review.

Supported early examples:

- Instagram.
- TikTok.
- Snapchat.
- X/Twitter.
- Email.
- Landing page.
- WhatsApp/manual message draft.

## 7.3 Suggested fields

| Field | Description |
|---|---|
| id | Profile identifier |
| workspace_id | Tenant boundary, nullable only for system defaults if approved |
| channel_key | instagram / tiktok / email / landing_page / etc. |
| display_name | Human-readable name |
| max_text_length | Optional text limit |
| allowed_asset_types | image / video / text / carousel / etc. |
| recommended_dimensions | Structured dimensions metadata |
| hashtag_policy | Allowed/required/disallowed hashtag guidance |
| link_policy | Link allowed / required / disallowed |
| requires_manual_publish_evidence | Whether evidence is required |
| approval_policy_id | Optional policy mapping |
| is_active | Active/inactive |

## 7.4 Guardrails

- MarketingChannelProfile must not store platform credentials.
- It must not trigger publishing.
- It must not represent paid ad accounts.
- It must not override ApprovalPolicy.
- It only informs generation, validation, and review.

## 7.5 Proposed API shape

```text
GET /workspaces/{workspaceId}/marketing-channel-profiles
POST /workspaces/{workspaceId}/marketing-channel-profiles
PATCH /workspaces/{workspaceId}/marketing-channel-profiles/{profileId}
GET /workspaces/{workspaceId}/marketing-channel-profiles/{profileId}
```

## 7.6 Required QA

- Channel profile cannot be read/modified across tenants.
- Invalid channel constraints must return standard ErrorModel.
- Updating a channel profile must not retroactively alter historical ChannelVariant decisions unless explicit snapshot model exists.

---

## 8. Candidate 5 — Channel Variant Quality Checks

## 8.1 Decision

**Decision:** Add to scope as pre-review validation.

Quality checks support reviewers; they are not approval decisions.

## 8.2 Purpose

Validate generated ChannelVariant content against channel, brand, and safety constraints before review.

Potential checks:

- Text length fits channel profile.
- Required CTA exists.
- Required tracking link exists where applicable.
- Unsupported claims are flagged.
- Prohibited words or phrases are detected.
- Asset type is allowed for channel.
- Language/locale is consistent.
- Hashtag policy is followed.
- Brand tone is within acceptable range.

## 8.3 Guardrails

- A passing quality check must not automatically approve content.
- A failing quality check must not delete or mutate the original asset.
- Results must be auditable and linked to the checked variant version.
- Re-running checks must preserve old results or record versioned results.

## 8.4 Proposed entity

| Field | Description |
|---|---|
| id | Check result identifier |
| workspace_id | Tenant boundary |
| channel_variant_id | Checked variant |
| check_type | length / cta / link / brand / risk / asset_type / locale |
| status | pass / warn / fail |
| severity | low / medium / high / critical |
| message | Human-readable result |
| rule_version | Rule or profile version used |
| created_at | Timestamp |

## 8.5 Proposed API shape

```text
POST /workspaces/{workspaceId}/channel-variants/{variantId}/quality-checks:run
GET /workspaces/{workspaceId}/channel-variants/{variantId}/quality-checks
```

## 8.6 Required QA

- Cannot run checks on cross-tenant variants.
- Quality check output cannot create ApprovalDecision.
- Repeated check runs must be idempotent or versioned.
- ErrorModel must distinguish validation failure from system failure.

---

## 9. Candidate 6 — Commerce Product Snapshot

## 9.1 Decision

**Decision:** Add to scope only as historical campaign context.

This is not a product master table and not a commerce backend.

## 9.2 Purpose

Preserve product context used at campaign/brief/generation time.

This protects historical truth when the external product later changes.

## 9.3 Suggested fields

| Field | Description |
|---|---|
| id | Snapshot identifier |
| workspace_id | Tenant boundary |
| source_connector_type | medusa / shopify / woocommerce / custom |
| external_product_id | External source product ID |
| external_variant_id | Optional external variant ID |
| product_title | Title at capture time |
| product_description | Description at capture time |
| image_url | Image URL at capture time |
| price_at_capture | Price at capture time |
| currency | Currency |
| availability_status | in_stock / out_of_stock / unknown |
| captured_at | Capture timestamp |
| captured_by | Actor/system |
| linked_campaign_id | Optional campaign link |
| linked_brief_id | Optional brief link |

## 9.4 Guardrails

- Must be read-only historical context.
- Must not update external product data.
- Must not serve as current price/inventory truth.
- Must be clearly labeled as snapshot in UI and API.
- Must not affect financial, checkout, settlement, or accounting logic.

## 9.5 Proposed API shape

```text
POST /workspaces/{workspaceId}/commerce-product-snapshots
GET /workspaces/{workspaceId}/commerce-product-snapshots/{snapshotId}
GET /workspaces/{workspaceId}/campaigns/{campaignId}/commerce-product-snapshots
```

## 9.6 Required QA

- Snapshot cannot be mutated after capture except limited metadata if approved.
- Snapshot is tenant-scoped.
- Snapshot cannot be used as a live product source.
- Snapshot creation from connector failure must not create false product truth.

---

## 10. Candidate 7 — Connector Readiness Layer

## 10.1 Decision

**Decision:** Add to scope only as connector metadata/readiness tracking.

This does not authorize full external integration or sync implementation.

## 10.2 Purpose

Prepare the system to manage future connectors safely by tracking status, scope, and failure state.

## 10.3 Suggested fields

| Field | Description |
|---|---|
| id | Connector config identifier |
| workspace_id | Tenant boundary |
| connector_type | medusa / shopify / woocommerce / metricool / canva / etc. |
| connection_status | draft / configured / verified / failed / disabled |
| sync_scope | read_products / read_metrics / read_assets / etc. |
| read_only_mode | Must default true for early scope |
| last_verified_at | Last verification timestamp |
| last_sync_at | Last sync timestamp if sync exists later |
| failure_reason | Latest failure summary |
| created_by | Actor |
| created_at | Created timestamp |

## 10.4 Guardrails

- No external writes in current scope.
- No product/order/payment mutation.
- No paid platform execution.
- No auto-publishing.
- Connector secrets must use Provider Credential Governance, not plain fields.

## 10.5 Proposed API shape

```text
POST /workspaces/{workspaceId}/connector-configs
GET /workspaces/{workspaceId}/connector-configs
PATCH /workspaces/{workspaceId}/connector-configs/{connectorConfigId}
POST /workspaces/{workspaceId}/connector-configs/{connectorConfigId}:verify
```

## 10.6 Required QA

- Connector config cannot leak across tenants.
- Failed verification must not create active connector state.
- Connector status transitions must be audited.
- Read-only mode must be enforced in API and worker layer.

---

## 11. Candidate 8 — Provider Credential Governance

## 11.1 Decision

**Decision:** Add to scope as security-critical SaaS infrastructure.

If Marketing OS uses AI providers or external connectors, credential governance is not optional.

## 11.2 Purpose

Securely manage provider and connector credentials at workspace level.

Examples:

- OpenAI.
- Anthropic.
- Canva.
- Metricool.
- Medusa.
- Shopify.
- WooCommerce.
- Custom API connector.

## 11.3 Suggested fields

| Field | Description |
|---|---|
| id | Credential reference identifier |
| workspace_id | Tenant boundary |
| provider_key | openai / anthropic / canva / medusa / etc. |
| secret_ref | Reference to encrypted secret, not raw value |
| display_name | Human-readable label |
| status | active / disabled / rotation_required |
| scopes | Allowed usage scopes |
| created_by | Actor |
| created_at | Created timestamp |
| updated_at | Updated timestamp |
| last_used_at | Last usage timestamp |
| rotation_due_at | Optional rotation metadata |

## 11.4 Guardrails

- Never store raw secrets in plaintext.
- Never return raw secret after creation.
- Credential access must be RBAC-protected.
- Credential use must be audited.
- Credential failure must not expose secret material in logs or errors.
- Workspace credentials must not be usable by another workspace.

## 11.5 Proposed API shape

```text
POST /workspaces/{workspaceId}/provider-credentials
GET /workspaces/{workspaceId}/provider-credentials
PATCH /workspaces/{workspaceId}/provider-credentials/{credentialId}
DELETE /workspaces/{workspaceId}/provider-credentials/{credentialId}
POST /workspaces/{workspaceId}/provider-credentials/{credentialId}:test
```

## 11.6 Required QA

- Secret value cannot be read after save.
- Cross-tenant credential use must fail.
- Credential lifecycle actions must create audit events.
- Logs and ErrorModel must not leak secrets.
- Disabled credentials cannot be used by GenerationJob or Connector.

---

## 12. Candidate 9 — Generation Quality Score

## 12.1 Decision

**Decision:** Add to scope only as an advisory score.

It must not approve, publish, or reject content automatically.

## 12.2 Purpose

Help users and reviewers rank generated outputs and identify risky or weak assets.

Potential sub-signals:

- brand_match_score.
- channel_fit_score.
- risk_score.
- completeness_score.
- readability_score.
- cost_efficiency_score.
- guardrail_confidence_score.

## 12.3 Guardrails

- Must be displayed as advisory.
- Must not be marketed as objective truth.
- Must not replace human approval.
- Must store formula/version used.
- Must support explanation or reason codes.

## 12.4 Proposed entity

| Field | Description |
|---|---|
| id | Quality score identifier |
| workspace_id | Tenant boundary |
| generation_job_id | Related generation job |
| media_asset_version_id | Optional related asset version |
| channel_variant_id | Optional related variant |
| overall_score | Composite score |
| risk_score | Risk score |
| brand_match_score | Brand alignment |
| channel_fit_score | Channel suitability |
| formula_version | Scoring formula version |
| reason_codes | Structured explanation |
| created_at | Timestamp |

## 12.5 Proposed API shape

```text
GET /workspaces/{workspaceId}/generation-jobs/{generationJobId}/quality-scores
GET /workspaces/{workspaceId}/channel-variants/{variantId}/quality-scores
```

## 12.6 Required QA

- Score cannot create approval decision.
- Score formula version must be recorded.
- Score visibility must respect RBAC.
- Missing score must not block normal workflow unless policy explicitly requires a check result.

---

## 13. Candidate 10 — Report Snapshot Strengthening

## 13.1 Decision

**Decision:** Add to scope as governance-critical.

Report snapshots protect historical reporting truth.

## 13.2 Purpose

Ensure reports generated at a point in time can be reviewed later without being silently changed by new events or backfilled data.

## 13.3 Suggested additional fields

| Field | Description |
|---|---|
| source_period_start | Report source window start |
| source_period_end | Report source window end |
| included_campaign_ids | Campaigns included in snapshot |
| included_publish_job_ids | Publish jobs included in snapshot |
| metrics_version | Metric calculation version |
| generated_by | Actor/system |
| generated_at | Timestamp |
| snapshot_hash | Integrity hash |
| immutable_after_generation | Lock flag |
| invalidated_at | Optional invalidation timestamp |
| invalidation_reason | Optional reason, without mutating original snapshot content |

## 13.4 Guardrails

- Snapshot content must not be overwritten after generation.
- Invalidation must not mutate original metrics payload.
- Live dashboards must be clearly separated from report snapshots.
- Snapshot hash must be calculated from stable canonical content.

## 13.5 Proposed API shape

```text
POST /workspaces/{workspaceId}/report-snapshots
GET /workspaces/{workspaceId}/report-snapshots/{snapshotId}
POST /workspaces/{workspaceId}/report-snapshots/{snapshotId}:invalidate
```

## 13.6 Required QA

- Snapshot immutability.
- Snapshot hash stability.
- Invalidation does not alter original snapshot payload.
- Tenant isolation for snapshot retrieval.
- Metrics version preserved.

---

## 14. Recommended Intake Order

The following order minimizes implementation risk:

| Order | Candidate | Reason |
|---:|---|---|
| 1 | Provider Credential Governance | Security foundation for AI/providers/connectors |
| 2 | Activity Timeline | Improves auditability without expanding domain scope |
| 3 | Approval Comments + Checklist | Strengthens approval integrity |
| 4 | Marketing Channel Profile | Enables better ChannelVariant validation |
| 5 | Channel Variant Quality Checks | Adds pre-review quality control |
| 6 | Report Snapshot Strengthening | Protects historical reporting truth |
| 7 | Commerce Product Snapshot | Adds product context safely if connector scope is ready |
| 8 | Connector Readiness Layer | Prepares for integrations without committing to full sync |
| 9 | Generation Quality Score | Useful after guardrail and quality signals are defined |

---

## 15. Required Backlog Translation Template

Before any candidate becomes an implementation task, create a backlog entry with the following fields:

```text
Feature:
Scope classification: Core V1 / Extended V1 / Post V1
Decision: Adopt / Adapt / Integrate / Defer / Reject
Business value:
Operational value:
Governance value:
Affected entities:
New/changed endpoints:
Permissions:
Audit events:
Error states:
Idempotency rules:
Tenant isolation rules:
Immutability rules:
Usage/cost impact:
Acceptance criteria:
QA cases:
Out-of-scope exclusions:
```

---

## 16. Required QA Themes

Any implementation based on this patch must include QA coverage for:

1. Tenant isolation.
2. RBAC.
3. Audit event creation.
4. Approval integrity.
5. Evidence immutability.
6. Snapshot immutability.
7. Idempotency where actions can be retried.
8. ErrorModel consistency.
9. Secret leakage prevention.
10. Historical truth preservation.
11. No external write behavior unless explicitly approved.
12. No auto-publishing.
13. No paid execution.
14. No autonomous agent actions.

---

## 17. No-Go Conditions

A candidate must be blocked if it causes any of the following:

- Adds CRM ownership instead of CRM integration.
- Adds commerce source-of-truth behavior.
- Adds ERP/accounting responsibilities.
- Adds a generic CMS builder.
- Adds chat/collaboration product surface.
- Enables publishing without manual/human approval.
- Enables paid campaign execution.
- Lets AI agents act autonomously.
- Stores secrets insecurely.
- Weakens tenant isolation.
- Allows approved assets/evidence/snapshots to be edited without strict controls.
- Introduces entities or endpoints not reflected in ERD/OpenAPI/Backlog/QA.

---

## 18. Final Patch Decision

**Accepted for controlled scope consideration:**

1. Activity Timeline.
2. Approval Comments.
3. Approval Checklist.
4. Marketing Channel Profile.
5. Channel Variant Quality Checks.
6. Commerce Product Snapshot.
7. Connector Readiness Layer.
8. Provider Credential Governance.
9. Generation Quality Score.
10. Report Snapshot Strengthening.

**Not authorized by this patch:** implementation, database changes, endpoint changes, or code changes.

**Next required step:** convert the accepted candidates into an ERD/Data Contract patch and OpenAPI/Backlog/QA updates before coding.
