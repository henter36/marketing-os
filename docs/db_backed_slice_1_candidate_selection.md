# DB-backed Slice 1 Candidate Selection

## Executive Decision

- DB-backed Slice 1 Candidate Selection: GO as recommendation only.
- Slice 1 implementation: NO-GO until separately approved.
- Sprint 5/Pilot/Production: NO-GO.

This document recommends a conservative next planning target. It does not approve or implement DB-backed Slice 1.

## Candidate Evaluation Criteria

Candidates are evaluated against:

- Foundational value.
- Low write complexity.
- SQL coverage clarity.
- Runtime test coverage.
- Tenant isolation proof.
- Immutability/idempotency risk.
- OpenAPI impact.
- Rollback simplicity.
- No Patch 002 expansion.
- No Sprint 5 scope.

## Candidate Evaluations

### BrandProfile / BrandVoiceRule

Pros:

- Narrow workspace-scoped domain.
- Existing Sprint 1 runtime tests cover access and basic behavior.
- Lower lifecycle complexity than Campaign or BriefVersion.
- Good first proof for product-domain repository boundaries.

Cons:

- Duplicate behavior and active/inactive status parity must be mapped carefully.
- Brand voice rule relationships must remain workspace-scoped.
- Audit persistence is not yet durable, so sensitive write audit coupling needs an explicit placeholder or deferred policy.

Risk: Low to medium.

Required parity tests:

- Workspace isolation.
- Duplicate constraint behavior.
- Active/inactive status parity.
- Brand voice rules cannot leak across workspaces.
- ErrorModel mapping for duplicate, not found, access denied, and DB failures.

Required repository methods:

- BrandProfileRepository listByWorkspace({ workspaceId }).
- BrandProfileRepository getById({ workspaceId, brandProfileId }).
- BrandProfileRepository create({ workspaceId, input, actorUserId }).
- BrandProfileRepository update({ workspaceId, brandProfileId, input, actorUserId }).
- BrandVoiceRuleRepository listByBrandProfile({ workspaceId, brandProfileId }).
- BrandVoiceRuleRepository getById({ workspaceId, brandVoiceRuleId }).
- BrandVoiceRuleRepository create({ workspaceId, brandProfileId, input, actorUserId }).
- BrandVoiceRuleRepository update({ workspaceId, brandVoiceRuleId, input, actorUserId }).

Required transaction policy:

- Reads may use pool queries with explicit workspace_id filters.
- Writes should use explicit transactions if coupled audit persistence is included.
- If durable audit remains out of scope, document the Sprint 1 audit placeholder status and do not claim audit persistence.

OpenAPI impact:

- No OpenAPI change expected if existing endpoints and response shapes are preserved.

Recommendation:

- Recommended for DB-backed Slice 1 Planning only, after this PR is reviewed.

### PromptTemplate / ReportTemplate

Pros:

- Foundational for content and reporting workflows.
- Existing Sprint 1 and Sprint 4 behavior gives test evidence.
- Repository methods can remain narrower than campaign lifecycle persistence.

Cons:

- System/workspace template boundary must be explicit.
- Version/status behavior must be mapped against SQL.
- ReportTemplate is tied to ClientReportSnapshot generation evidence later, so write expansion should be cautious.

Risk: Medium.

Required parity tests:

- Template creation/listing.
- Version/status parity.
- Workspace/system template boundaries.
- No cross-workspace leakage.
- ErrorModel mapping for forbidden system-template writes.

Required repository methods:

- PromptTemplateRepository listVisible({ workspaceId }).
- PromptTemplateRepository getById({ workspaceId, promptTemplateId }).
- PromptTemplateRepository createWorkspaceTemplate({ workspaceId, input, actorUserId }).
- PromptTemplateRepository updateWorkspaceTemplate({ workspaceId, promptTemplateId, input, actorUserId }).
- ReportTemplateRepository listVisible({ workspaceId }).
- ReportTemplateRepository getById({ workspaceId, reportTemplateId }).
- ReportTemplateRepository createWorkspaceTemplate({ workspaceId, input, actorUserId }).
- ReportTemplateRepository updateWorkspaceTemplate({ workspaceId, reportTemplateId, input, actorUserId }).

Required transaction policy:

- Reads may use explicit workspace/system visibility filters.
- Writes should be transaction-scoped if versions or audit entries are created.

OpenAPI impact:

- No OpenAPI change expected if existing contracts are preserved.

Recommendation:

- Good second candidate after BrandProfile / BrandVoiceRule, or a separate Slice 1b planning target.

### Campaign

Pros:

- High foundational value.
- Existing Sprint 1+ tests cover create/list/get/update and campaign-scoped downstream behavior.
- Strong tenant isolation value if proven early.

Cons:

- Campaign state transitions add write-path coupling risk.
- Many later domains depend on Campaign, increasing blast radius.
- Status enum and transition history parity must be exact.
- Mistakes could affect Patch 002 performance and lead-capture campaign-scoped routes later.

Risk: Medium to high.

Required parity tests:

- Create/list/get/update parity.
- Workspace isolation.
- Status enum parity.
- CampaignStateTransition creation consistency.
- ErrorModel consistency.

Required repository methods:

- CampaignRepository listByWorkspace({ workspaceId }).
- CampaignRepository getById({ workspaceId, campaignId }).
- CampaignRepository create({ workspaceId, input, actorUserId }).
- CampaignRepository update({ workspaceId, campaignId, input, actorUserId }).
- CampaignStateTransitionRepository listByCampaign({ workspaceId, campaignId }).
- CampaignStateTransitionRepository createForCampaignStateChange({ workspaceId, campaignId, fromState, toState, actorUserId }).

Required transaction policy:

- Campaign state change plus transition record must occur in one transaction if state transitions are included.
- Idempotency and audit coupling must be explicit before broader campaign writes.

OpenAPI impact:

- No OpenAPI change expected if existing endpoints remain unchanged.

Recommendation:

- Defer until after a narrower product-domain slice proves repository write patterns.

### BriefVersion

Pros:

- Important foundation for generation and approval flows.
- Existing Sprint 1 tests cover create/list and immutability rule.
- Clear server-side content_hash requirement.

Cons:

- Hash immutability and append-only behavior are safety-critical.
- Latest-version behavior must be deterministic under concurrency.
- Downstream approval/publish/evidence flows depend on brief and content hash integrity.

Risk: High.

Required parity tests:

- Version creation.
- Hash immutability.
- Append-only behavior.
- Latest-version behavior.
- Workspace isolation.
- ErrorModel mapping for attempted content patching.

Required repository methods:

- BriefVersionRepository listByCampaign({ workspaceId, campaignId }).
- BriefVersionRepository getById({ workspaceId, briefVersionId }).
- BriefVersionRepository create({ workspaceId, campaignId, input, actorUserId }).
- BriefVersionRepository getLatestForCampaign({ workspaceId, campaignId }).

Required transaction policy:

- Create must generate content_hash server-side inside the repository/service boundary.
- No patch method for content should exist.
- Version numbering and latest-version selection need transaction-safe behavior.

OpenAPI impact:

- No OpenAPI change expected if existing immutability behavior is preserved.

Recommendation:

- Defer until after lower-risk write-path patterns and hash/immutability parity tests are reviewed.

## Candidate Ranking

Safest to riskiest:

1. BrandProfile / BrandVoiceRule.
2. PromptTemplate / ReportTemplate.
3. Campaign.
4. BriefVersion.

Reasoning:

- Brand and template domains are narrower than campaign lifecycle and brief hash immutability.
- Campaign is foundational, but lifecycle/state transition risks are higher.
- BriefVersion has hash, append-only, and immutability risk and should not be first unless parity evidence becomes stronger.

## Final Recommendation

- Proceed to DB-backed Slice 1 Planning for BrandProfile / BrandVoiceRule only after this PR is reviewed.
- Do not implement Slice 1 in this PR.
- Keep Campaign, BriefVersion, Media, Patch 002, Audit, Usage/Cost deferred.
- Keep Sprint 5, Pilot, and Production NO-GO.

## Final Status

- DB-backed Slice 1 Candidate Selection: GO as recommendation only.
- Slice 1 implementation: NO-GO until separately approved.
- DB-backed full persistence: NO-GO.
- Sprint 5 coding: NO-GO.
- Pilot: NO-GO.
- Production: NO-GO.
