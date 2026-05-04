# PRD Patch — Campaign Creation Minimum Viable V1

**Document Type:** PRD Patch  
**Project:** Marketing OS  
**Recommended Path:** `docs/prd_patch_campaign_creation_minimum_viable_v1.md`  
**Status:** Draft — Pending Review  
**Version:** 0.1.0  
**Scope:** Documentation Only  
**Runtime Impact:** None  
**Schema Impact:** Future only  
**OpenAPI Impact:** Future only  
**Related Governance Protocol:** `docs/approval_hash_lock_state_machine_and_evidence_protocol.md`  
**Related PR:** PR #93 — Approval Hash-Lock, Campaign State Machine, and Evidence Verification Protocol

---

## 1. Executive Decision

This document is the implementation authority for Campaign Creation V1 Core.

The broader campaign creation and ad package generation direction may inform future planning, but it does not authorize V1 implementation beyond the scope defined here.

Marketing OS V1 must focus on a small, usable, governed campaign creation flow that produces a basic but real ad package from structured manual inputs.

V1 must not attempt full URL scraping, automated image understanding, video analysis, social listening, trend APIs, automated publishing, or multi-product campaign complexity.

---

## 2. Purpose

The purpose of this PRD patch is to define the minimum viable campaign creation workflow for Marketing OS.

The V1 goal is:

```text
Structured commercial input
→ Basic ad package generation
→ Draft asset output
→ Hash-lock approval handoff
→ Manual publish/evidence path
```

The V1 goal is not to create a full social intelligence platform, creative suite, media analysis pipeline, or autonomous publishing system.

---

## 3. Product Rationale

Most AI marketing tools fail because they start with a generic prompt such as:

```text
Write me an ad.
```

Marketing OS must start with the more precise question:

```text
What are you advertising?
```

For V1, the answer must be one of:

```text
Specific Product
Store / Brand
```

This keeps the user flow simple while solving the main cause of generic outputs: missing commercial context.

---

## 4. Authority and Precedence

This document is subordinate to:

```text
docs/approval_hash_lock_state_machine_and_evidence_protocol.md
```

If this document conflicts with the hash-lock, state machine, approval, evidence, audit, or AI cost governance protocol, the governance protocol takes precedence.

This document does not authorize:

- Runtime changes.
- Schema changes.
- OpenAPI changes.
- Generated client changes.
- External publishing.
- Runtime agents.
- Pilot readiness.
- Production readiness.

---

## 5. V1 Campaign Entry Point

The campaign builder must begin with:

```text
What are you advertising?
```

V1 options:

```text
Specific Product
Store / Brand
```

Future disabled or deferred options may be displayed but must not be executable in V1:

```text
Product Collection — Coming later
Offer / Discount — Coming later as dedicated flow
Event / Launch — Coming later
Content Awareness — Coming later
```

---

## 6. V1 Campaign Types

### 6.1 Specific Product

Used when the user wants to advertise one product only.

V1 must support only one product per product campaign.

Adding a second product is out of scope for V1.

If the user attempts to add a second product, the system should show:

```text
Product campaigns in V1 support one product only. Create a separate campaign or use Product Collection when it becomes available.
```

---

### 6.2 Store / Brand

Used when the user wants to advertise a store, brand, or general catalog presence rather than one product.

The output should focus on:

- Store positioning.
- Brand promise.
- Main categories.
- Visit / shop CTA.
- Basic trust-building message.

---

## 7. Product Campaign V1 Inputs

### 7.1 Required Inputs

Product campaign V1 requires:

```text
product_name
short_product_description
cta_or_product_url
image_reference_or_image_description
target_audience
primary_channel
cta
language_or_tone
```

### 7.2 Optional Inputs

Product campaign V1 may accept:

```text
price
offer
discount
shipping_note
customer_proof_text
single_image_upload_or_reference
brand_restrictions
forbidden_claims
```

### 7.3 Product URL Handling in V1

In V1, product URL is used as:

```text
CTA destination
Reference link
Manual confirmation aid
```

V1 must not depend on automatic URL scraping or full product page analysis.

The user is responsible for confirming:

```text
product name
product description
price
offer
CTA
availability if mentioned
```

### 7.4 Product Image Handling in V1

In V1, product image is handled as:

```text
Uploaded/reference asset or manual image description
```

V1 must not require automated image understanding.

The system may ask the user for a short manual description such as:

```text
Describe what appears in the product image and whether the product is clearly visible.
```

### 7.5 Product Video Handling in V1

Product video analysis is out of scope for V1.

V1 may allow an optional video reference or manual note, but it must not perform:

```text
first-3-seconds analysis
shot detection
automated pacing analysis
automated overlay extraction
automated video score
```

---

## 8. Store / Brand Campaign V1 Inputs

### 8.1 Required Inputs

Store / Brand campaign V1 requires:

```text
store_name
store_or_cta_url
store_category
short_store_description
main_categories
brand_promise
target_audience
primary_channel
cta
language_or_tone
```

### 8.2 Optional Inputs

Store / Brand campaign V1 may accept:

```text
logo_reference
store_image_reference
hero_products_text
customer_proof_text
shipping_or_delivery_promise
return_or_guarantee_note
brand_restrictions
forbidden_claims
```

### 8.3 Store URL Handling in V1

In V1, store URL is used as:

```text
CTA destination
Reference link
Manual confirmation aid
```

V1 must not depend on automatic store crawling, catalog extraction, or category scraping.

---

## 9. V1 Input Quality Handling

V1 uses a simplified input quality model.

Supported levels:

```text
Below Minimum
Minimum
Good
```

Premium level is out of scope for V1 and may be introduced in V1.5/V2.

---

### 9.1 Below Minimum

Inputs are below minimum when one or more critical required inputs are missing.

Critical inputs:

```text
what is being advertised
description or benefit
target audience
primary channel
CTA
language/tone
```

System behavior:

- Do not generate publish-ready ads.
- Ask the user to complete the missing required inputs.
- Optionally allow an exploratory draft only if clearly labeled.

Exploratory draft label:

```text
Exploratory Draft — Not Ready for Publishing
```

Exploratory drafts must not be submitted for approval or publishing.

---

### 9.2 Minimum

Inputs are sufficient to generate a limited draft, but output quality may be weaker.

System behavior:

- Generate limited ad package.
- Show quality warning.
- Rank missing inputs by impact.
- Avoid unsupported claims.
- Avoid invented proof.
- Avoid pretending the system has verified product details.

Warning example:

```text
Input quality: Minimum. The ad can be generated, but quality may be limited because some commercial or creative details are missing.
```

---

### 9.3 Good

Inputs are sufficient to generate a normal V1 ad package.

System behavior:

- Generate standard V1 ad package.
- Show limited warnings only where relevant.
- Allow draft output to proceed to review workflow.

---

## 10. Simplified Readiness Behavior

V1 should avoid complex scoring formulas that imply false precision.

The UI may display:

```text
Input Quality: Below Minimum / Minimum / Good
```

It may also show a simple readiness indicator, but V1 must not depend on unvalidated weighted scoring.

If a numeric readiness score is shown in V1, it must be clearly treated as a simple completeness indicator, not a performance prediction.

Required missing input behavior:

```text
Show what is missing.
Rank missing inputs by impact.
Explain why each missing item matters.
```

Example:

```text
To improve output quality, add:
1. Offer details — improves conversion strength
2. Product image description — improves visual relevance
3. Customer proof — improves trust
```

---

## 11. Fallback Behavior

| Input Level | Publish-Ready Generation | Output Quality | System Behavior |
|---|---|---|---|
| Below Minimum | No | Insufficient | Ask for required inputs; exploratory draft only if clearly labeled |
| Minimum | Yes | Limited | Warning + ranked missing inputs |
| Good | Yes | Normal V1 | Generate standard V1 ad package |

---

## 12. V1 Generation Outputs

V1 must generate a basic ad package, not a massive multi-channel package.

### 12.1 Product Campaign Output

```text
campaign_brief
core_message
2_to_3_caption_variants
1_hook
cta_variants
1_basic_hashtag_pack
review_checklist
publish_checklist
evidence_requirement
estimated_ai_cost
```

### 12.2 Store / Brand Campaign Output

```text
store_positioning_message
2_to_3_caption_variants
1_store_awareness_hook
cta_variants
1_basic_hashtag_pack
review_checklist
publish_checklist
evidence_requirement
estimated_ai_cost
```

---

## 13. V1 Hashtag Handling

V1 must include one basic hashtag pack.

The hashtag pack should be appropriate to:

```text
campaign type
product/store category
language
target market
primary channel
```

For Arabic campaigns, hashtags should be Arabic-first.

The system must not overstate hashtag impact or claim that hashtags guarantee reach.

V1 does not include:

```text
multiple hashtag packs
trend-based hashtag scoring
hashtag analytics API
real-time trend detection
```

---

## 14. Arabic-First and Local Market Handling

V1 must support Arabic-first campaign generation.

### 14.1 Language Defaults

For Arabic users or Arabic input, default output language should be Arabic.

The system may support English product names or brand names inside Arabic output.

### 14.2 RTL

Generated Arabic content and UI preview must support right-to-left display.

### 14.3 Hashtags

For Arabic campaigns:

```text
Hashtags should be Arabic-first.
English hashtags may be included only when commercially relevant.
No automatic transliteration unless explicitly requested.
```

### 14.4 Tone

V1 may support simple tone options:

```text
formal
friendly
direct
premium
youthful
Gulf/local tone
```

### 14.5 Privacy and Personal Data

V1 must avoid advanced audience profiling or personal-data-heavy targeting.

If future versions introduce customer-level targeting, consent source, retention, and privacy governance must be handled in a separate privacy/PDPL-aware design.

---

## 15. Offer Handling in V1

Offer is optional but should be used carefully when provided.

Supported offer examples:

| Offer Type | V1 Behavior |
|---|---|
| Percentage discount | Mention the percentage only if user provided it |
| Fixed discount | Mention the amount only if user provided it |
| Free shipping | Use as supporting selling point |
| Gift with purchase | Mention only as provided |
| Vague offer | Ask for clarification or avoid exaggeration |

The system must not invent:

```text
discounts
scarcity
expiry dates
stock limits
free shipping
guarantees
customer proof
```

---

## 16. Regeneration in V1

V1 may support limited regeneration.

Allowed regeneration intents:

```text
different angle
shorter copy
stronger CTA
different tone
```

Each successful regeneration must:

```text
create or reference a GenerationJob
create a new draft output or AssetVersion where applicable
create an AICostEvent
preserve the prior output
not auto-approve the new output
```

---

## 17. AI Cost Governance

V1 must include cost awareness before and after generation.

### 17.1 Before Generation

Before generation, the system should show:

```text
estimated_ai_cost
```

### 17.2 After Successful Generation

After successful generation, the system must record:

```text
AICostEvent
```

Minimum fields:

```text
workspace_id
campaign_id nullable
user_id nullable
provider
model_name
estimated_cost
actual_cost if available
purpose
created_at
```

### 17.3 Budget Thresholds

Recommended V1 budget rules:

```text
80% of workspace AI budget used -> warning
100% of workspace AI budget used -> block generation unless Owner override
```

No regeneration button should be unlimited or cost-blind.

---

## 18. Simplified Campaign Edit Mode

V1 user-facing edit modes should be simple.

Display only:

```text
Draft
In Review
Published / Completed
```

Internal states may remain more detailed under the governance protocol.

### 18.1 Draft

User may edit freely.

Material edits should be recorded and may create a new BriefVersion later when schema support exists.

### 18.2 In Review

Material edits must cancel, reset, or supersede the current review.

The user should see:

```text
Editing this campaign will require review again.
```

### 18.3 Published / Completed

Material edits must not alter the already published or completed truth.

The user should be directed to:

```text
Duplicate campaign
Create new version
Create follow-up campaign
```

---

## 19. Governance Handoff

All generated outputs are Draft by default.

No generated output is approved automatically.

Generated outputs must hand off to the lifecycle defined in:

```text
docs/approval_hash_lock_state_machine_and_evidence_protocol.md
```

Required future handoff concepts:

```text
BriefVersion
AssetVersion
content_hash
ApprovalDecision
PublishJob
PublishEvidence
AuditEvent
AICostEvent
```

V1 must preserve the principle:

```text
No approved content without hash-bound approval.
```

---

## 20. Review Checklist — V1

Generated output should include a basic review checklist:

```text
Content matches campaign brief
CTA is clear
Offer details are accurate if mentioned
No invented discount or scarcity
No invented customer proof
Language and tone match requested style
Hashtags are relevant
No forbidden claim is present
```

---

## 21. Publish Checklist — V1

Generated output should include a basic publish checklist:

```text
Selected asset is approved before publishing
CTA URL is correct
Offer is still valid if mentioned
Primary channel is selected
Evidence requirement is known
Publisher understands manual evidence requirement
```

---

## 22. Evidence Requirement — V1

V1 campaign creation must identify evidence requirement for later publish flow.

Default V1 options:

```text
Basic evidence: published URL
Standard evidence: published URL + screenshot
```

The campaign creation flow does not verify evidence itself. It only prepares the requirement for the publish/evidence lifecycle.

---

## 23. Generation Failure Handling — V1

V1 must define basic failure behavior.

| Failure Type | System Behavior |
|---|---|
| AI timeout / server error | Show retry option; no successful output recorded |
| Budget exceeded | Block generation; show budget message |
| Low-quality generation | Allow manual edit or regeneration with cost visibility |
| Partial generation | Show successful parts and allow retry for failed parts |
| Policy refusal | Show safe explanation and ask user to revise input |

Failed generations should not create approved outputs.

Cost should not be charged unless a generation actually succeeded or provider billing occurred.

---

## 24. V1 Non-Goals

V1 explicitly excludes:

```text
URL scraping
Automated product page extraction
Automated store crawling
Automated image analysis
Automated video analysis
Product collection campaigns
Adding a second product
Premium input level
A/B variant engine
Multiple hashtag packs
Keyword pack
Trend-fit score
Algorithm-fit notes
TikTok Creative Center integration
Meta Ads Library integration
Google Trends integration
Canva integration
CapCut integration
Buffer / Later integration
GA4 integration
Meta Insights integration
Social listening
Automated publishing
External publishing adapters
Browser extension
Advanced attribution
ROI prediction
Uplift modeling
Virality guarantees
Blockchain
Runtime AI agents
```

---

## 25. Deferred V1.5 / V2 Enhancements

The following should be captured in a separate future document:

```text
docs/prd_patch_ad_package_enhancements_v1_5_and_v2.md
```

Candidate enhancements:

```text
URL analysis
Image analysis
Video analysis
Product collection
Add second product
ChannelVariant advanced behavior
Multiple hashtag packs
Keyword pack
Trend APIs
Competitor research workflow
Tool cost matrix
Canva / CapCut workflow
Buffer / Later publishing integration
GA4 / Meta Insights integration
Social listening
Automated evidence capture
```

---

## 26. User Stories

### 26.1 Product Campaign

As a marketer, I want to enter basic product information so that Marketing OS can generate a usable draft ad package.

Acceptance:

- User selects Specific Product.
- User enters required product inputs.
- System generates basic ad package.
- Output remains draft.
- User can proceed to review/approval lifecycle.

---

### 26.2 Store Campaign

As a store owner, I want to enter basic store information so that Marketing OS can generate a store/brand ad package.

Acceptance:

- User selects Store / Brand.
- User enters required store inputs.
- System generates store positioning message and captions.
- Output includes one hashtag pack.
- Output remains draft.

---

### 26.3 Minimum Input Warning

As a user with limited information, I want the system to warn me when output quality may be limited.

Acceptance:

- Minimum input level allows limited generation.
- System shows quality warning.
- System lists missing inputs by impact.

---

### 26.4 Below Minimum Blocking

As a user who has not provided enough data, I want the system to tell me what is missing instead of generating a misleading ad.

Acceptance:

- Below Minimum blocks publish-ready generation.
- System asks for required fields.
- Exploratory draft, if allowed, is labeled not ready for publishing.

---

### 26.5 Regeneration With Cost Visibility

As a user, I want to regenerate copy with a different angle while seeing the cost impact.

Acceptance:

- System shows estimated cost before regeneration.
- Successful regeneration creates cost event.
- Previous version remains available.
- New output is not automatically approved.

---

## 27. Acceptance Criteria

This PRD patch is acceptable when:

- It defines Campaign Creation V1 Core only.
- It starts with "What are you advertising?".
- It supports Specific Product and Store / Brand only.
- It clearly excludes URL scraping, image analysis, and video analysis from V1.
- It defines required and optional V1 inputs.
- It defines basic V1 outputs.
- It defines input quality levels: Below Minimum, Minimum, Good.
- It defines fallback behavior.
- It includes Arabic-first and RTL behavior.
- It includes cost governance for generation and regeneration.
- It includes simplified edit modes.
- It defines governance handoff to hash-lock approval lifecycle.
- It includes V1 review and publish checklists.
- It includes V1 evidence requirement preparation.
- It lists explicit V1 non-goals.
- It separates V1.5/V2 enhancements.
- It does not authorize runtime changes.

---

## 28. Recommended Next Sequence

After this document is reviewed and merged, the recommended sequence is:

```text
1. PRD Patch: Governed Campaign Lifecycle
2. ERD Patch: campaign creation, brief/version, asset/version, cost, evidence preparation
3. OpenAPI Patch: minimum campaign creation and generation endpoints
4. QA Patch: input quality, fallback, cost guard, hash-lock handoff
5. Runtime Slice 1: product/store campaign creation with basic ad package generation
```

Do not proceed to ERD, OpenAPI, or runtime implementation until this V1 Core scope is accepted.
