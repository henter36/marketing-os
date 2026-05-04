# PRD Patch — Campaign Creation Minimum Viable V1

**Document Type:** PRD Patch / V1 Scope Control  
**Project:** Marketing OS  
**Recommended Path:** `docs/prd_patch_campaign_creation_minimum_viable_v1.md`  
**Status:** Draft — Pending Review  
**Version:** 1.0.0  
**Scope:** Documentation Only  
**Runtime Impact:** None  
**Schema Impact:** None in this PR  
**OpenAPI Impact:** None in this PR  
**Related Governance Protocol:** `docs/approval_hash_lock_state_machine_and_evidence_protocol.md`  
**Depends On:** PR #93 — Approval Hash-Lock, Campaign State Machine, and Evidence Verification Protocol

---

## 1. Executive Decision

This document is the implementation authority for Campaign Creation V1 Core.

The broader campaign creation and ad package generation direction may inform future planning, but it does not authorize V1 implementation beyond the scope defined here.

Marketing OS V1 must support a narrow, usable, governed campaign creation flow. It must not attempt to implement full product intelligence, URL scraping, video analysis, social listening, automated publishing, or advanced distribution intelligence in the first implementation slice.

The V1 goal is simple:

```text
Create a real product or store campaign from structured manual inputs,
generate a small useful ad package,
show cost and quality warnings,
and hand generated outputs into the approval hash-lock lifecycle.
```

---

## 2. Purpose

This PRD patch narrows Campaign Creation V1 to a practical implementation scope.

It defines:

1. V1 campaign entry point.
2. V1 campaign types.
3. Product campaign required and optional inputs.
4. Store / Brand campaign required and optional inputs.
5. V1 generation outputs.
6. Input quality handling.
7. Fallback behavior.
8. Arabic-first and local market behavior.
9. Regeneration cost governance.
10. Simplified edit mode.
11. Governance handoff to approval hash-lock lifecycle.
12. Explicit V1 non-goals.
13. Acceptance criteria.
14. Future V1.5 / V2 references.

---

## 3. Product Rationale

Campaign creation must start from a commercial question:

```text
What are you advertising?
```

A generic form produces generic outputs. A product campaign requires different information from a store or brand campaign.

V1 should prove that Marketing OS can reliably turn structured inputs into a usable, reviewable, governed ad package without overbuilding automation that is expensive, fragile, or legally ambiguous.

---

## 4. Governing Source

The lifecycle, approval, evidence, audit, and hash-lock rules are governed by:

```text
docs/approval_hash_lock_state_machine_and_evidence_protocol.md
```

This PRD patch is subordinate to that protocol.

If this document conflicts with the protocol, the protocol wins.

---

## 5. V1 Campaign Entry Point

The Campaign Builder must begin with:

```text
What are you advertising?
```

V1 options:

```text
Specific Product
Store / Brand
```

Future options may be displayed as disabled or hidden until approved:

```text
Product Collection
Offer / Discount
Event / Launch
Content Awareness
```

If future options are displayed, they must be clearly marked as not available in V1.

---

## 6. V1 Campaign Types

### 6.1 Specific Product

Used when the user wants to advertise one product.

V1 supports one product only.

Adding a second product is explicitly out of scope for V1.

---

### 6.2 Store / Brand

Used when the user wants to advertise a store, brand, or general business presence.

V1 supports a single store or brand campaign with simple category and brand-promise inputs.

---

## 7. Product Campaign Inputs — V1

### 7.1 Required Inputs

A product campaign must collect:

```text
product_name
short_product_description
cta_or_product_url
image_reference_or_image_description
target_audience
primary_channel
cta_text
language
tone
```

### 7.2 Required Input Definitions

| Field | Purpose |
|---|---|
| `product_name` | Identifies the advertised product |
| `short_product_description` | Explains what the product is and why it matters |
| `cta_or_product_url` | Defines where the user should go or what they should do |
| `image_reference_or_image_description` | Provides creative context without requiring automated image analysis |
| `target_audience` | Defines who the ad is for |
| `primary_channel` | Defines where the ad will be used |
| `cta_text` | Defines the desired action |
| `language` | Defines output language |
| `tone` | Defines writing style |

---

### 7.3 Optional Inputs

```text
price
offer
discount
image_upload_or_reference
customer_proof_text
shipping_note
availability_note
brand_restrictions
forbidden_claims
```

### 7.4 Product URL Rule

In V1, the product URL is stored as a CTA/reference field only.

V1 must not perform automatic scraping, full URL analysis, price extraction, image extraction, or risk extraction from the product URL.

The user must manually confirm product name, description, offer, price, and CTA.

---

### 7.5 Product Image Rule

In V1, the system may accept an image upload/reference or an image description.

V1 must not perform automated image understanding, product visibility scoring, background scoring, or image quality scoring.

Image context is used as user-provided creative context only.

---

### 7.6 Product Video Rule

Product video analysis is out of scope for V1.

V1 may allow a user to add a manual video note, but must not perform:

```text
first 3 seconds analysis
shot detection
hook extraction from video
overlay recommendation from video
video suitability scoring
15s / 30s cut recommendations
```

---

## 8. Store / Brand Campaign Inputs — V1

### 8.1 Required Inputs

A store or brand campaign must collect:

```text
store_name
store_or_cta_url
store_category
short_store_description
main_categories
brand_promise
target_audience
primary_channel
cta_text
language
tone
```

### 8.2 Required Input Definitions

| Field | Purpose |
|---|---|
| `store_name` | Identifies the advertised store or brand |
| `store_or_cta_url` | Defines the destination for the ad |
| `store_category` | Defines business category |
| `short_store_description` | Explains what the store offers |
| `main_categories` | Defines the main product/service categories |
| `brand_promise` | Explains why customers should choose this store |
| `target_audience` | Defines who the ad is for |
| `primary_channel` | Defines where the ad will be used |
| `cta_text` | Defines the desired action |
| `language` | Defines output language |
| `tone` | Defines writing style |

---

### 8.3 Optional Inputs

```text
logo_reference
store_image_reference
hero_products_text
customer_proof_text
offer
branch_or_location_note
whatsapp_link
social_account_link
brand_restrictions
forbidden_claims
```

### 8.4 Store URL Rule

In V1, the store URL is stored as a CTA/reference field only.

V1 must not perform automatic store scraping, product catalog extraction, price extraction, or category extraction.

The user must manually confirm store description, main categories, brand promise, and CTA.

---

## 9. Primary Channel — V1

V1 may support a limited set of primary channels.

Recommended V1 channels:

```text
Instagram
Email
WhatsApp / DM
```

TikTok / Reels may be documented as future or optional if no video analysis is required.

If TikTok / Reels is selectable in V1, output must remain text/script-based and must not depend on automated video understanding.

---

## 10. V1 Generation Outputs

V1 must generate a small, useful ad package.

### 10.1 Product Campaign Outputs

```text
campaign_brief
core_message
2_to_3_caption_variants
one_hook
cta_variants
one_basic_hashtag_pack
review_checklist
publish_checklist
evidence_requirement
estimated_ai_cost
```

### 10.2 Store / Brand Campaign Outputs

```text
campaign_brief
store_positioning_message
2_to_3_caption_variants
one_store_awareness_hook
cta_variants
one_basic_hashtag_pack
review_checklist
publish_checklist
evidence_requirement
estimated_ai_cost
```

---

## 11. Hashtag Output — V1

V1 must generate one basic hashtag pack only.

The hashtag pack should include:

```text
category hashtags
audience hashtags
local/market hashtags where applicable
seasonal hashtag only if explicitly relevant
```

V1 must not generate multiple hashtag packs such as Safe / Reach / Niche / Seasonal / Branded unless separately approved in a later enhancement document.

V1 must not claim that hashtags guarantee reach, virality, or ranking.

---

## 12. CTA Variants — V1

The system should generate simple CTA variants based on the campaign type and channel.

Examples:

```text
اطلب الآن
تسوق المنتج
اكتشف المتجر
راسلنا على واتساب
احجز الآن
شاهد التفاصيل
```

The system must not invent discounts, urgency, stock scarcity, guarantees, or claims unless the user provided them.

---

## 13. Review Checklist — V1

Each generated ad package should include a simple review checklist:

```text
Content matches the campaign brief
CTA is clear
Offer details are accurate if mentioned
No invented discount or proof
No forbidden brand claims
Language and tone match user selection
Hashtags are relevant
Output is still Draft and not approved
```

---

## 14. Publish Checklist — V1

Each generated ad package should include a simple publish checklist:

```text
Selected asset has been reviewed
Approval required before publishing
CTA destination is correct
Offer is still valid if mentioned
Required evidence tier is known
Manual publishing responsibility is clear
```

Publishing remains manual in V1.

---

## 15. Evidence Requirement — V1

V1 should use Basic or Standard evidence only.

Basic evidence:

```text
Published URL
```

Standard evidence:

```text
Published URL
Screenshot
```

Automated evidence is out of scope for V1.

---

## 16. Input Quality Handling — V1

V1 uses simple quality states:

```text
Below Minimum
Minimum
Good
```

Premium is out of scope for V1.

---

### 16.1 Below Minimum

Inputs are insufficient to generate publish-ready ads.

Below Minimum applies when one or more essential inputs are missing:

```text
what is being advertised
target audience
primary channel
CTA
basic description
```

System behavior:

```text
Do not generate publish-ready output
Ask for missing required fields
May offer exploratory draft only if clearly labeled
Exploratory draft cannot be submitted for review
Exploratory draft cannot be treated as approved content
```

Label:

```text
Exploratory Draft — Not Ready for Publishing
```

---

### 16.2 Minimum

Minimum means all required inputs exist, but useful optional inputs are missing.

System behavior:

```text
Generate limited ad package
Show quality warning
Rank missing inputs by impact
Avoid unsupported claims
Avoid fake social proof
Avoid complex video/storyboard outputs
```

Warning:

```text
Input quality: Minimum. Output can be generated, but quality and specificity may be limited because some commercial or creative context is missing.
```

---

### 16.3 Good

Good means required inputs exist and at least some optional commercial or creative context exists.

System behavior:

```text
Generate normal V1 ad package
Show limited warnings only
Allow review-ready draft
Track AI cost
Hand off generated outputs to lifecycle governance
```

---

## 17. Missing Input Ranking — V1

When inputs are Minimum or Below Minimum, the system should rank missing inputs by impact.

Example product campaign ranking:

```text
1. Offer or price — improves conversion clarity
2. Customer proof — improves trust
3. Image reference or better image description — improves creative relevance
4. Brand restrictions — reduces compliance risk
```

Example store campaign ranking:

```text
1. Brand promise — improves differentiation
2. Main categories — improves message relevance
3. Customer proof — improves trust
4. Store image/logo reference — improves creative direction
```

---

## 18. Arabic-First and Local Market Handling — V1

V1 must support Arabic-first campaign creation.

### 18.1 UI and Text Direction

Arabic outputs must support RTL rendering.

### 18.2 Default Output Language

For Arabic users and Arabic inputs, Arabic should be the default output language.

### 18.3 Product Names in English

The system may preserve English product names inside Arabic copy when appropriate.

### 18.4 Hashtags

For Arabic campaigns, the basic hashtag pack should be primarily Arabic.

Mixed Arabic/English hashtags may be generated only when useful for the product category or local market.

### 18.5 Transliteration

The system must not automatically transliterate Arabic into English or English into Arabic unless the user explicitly asks.

### 18.6 Tone

V1 should support simple tone options:

```text
Professional Arabic
Friendly Arabic
Direct Sales Arabic
Gulf Local Tone
Luxury Tone
Youthful Tone
```

### 18.7 Privacy / PDPL Note

V1 must not implement heavy audience profiling.

If future versions use identifiable customer data, consent source, retention, and PDPL-related handling must be addressed in a separate privacy/compliance design.

---

## 19. Regeneration — V1

V1 may support limited regeneration.

Allowed regeneration intents:

```text
Different angle
Shorter copy
Stronger CTA
Different tone
```

Regeneration must not overwrite existing generated output.

Each regeneration should create a new draft output or new version reference.

No regenerated output is approved by default.

---

## 20. Regeneration Cost Governance — V1

Every generation and regeneration must show an estimated cost before execution.

Every successful generation must create or plan for an AI cost event consistent with the governance protocol.

Minimum required cost behavior:

```text
Show estimated cost before generation
Record estimated and actual cost after successful generation
Associate cost with workspace and campaign where applicable
Warn when workspace monthly AI budget reaches 80%
Block generation when budget reaches 100% unless Owner override is allowed
Do not charge for failed generation where no output is produced
```

Regeneration must not be unlimited or invisible.

---

## 21. Simplified Edit Mode — V1

The user-facing edit model should be simple.

Expose only:

```text
Draft
In Review
Published / Completed
```

Internal lifecycle may remain more detailed under the governance protocol.

### 21.1 Draft

User can freely edit campaign inputs.

Material edits may create a new BriefVersion internally when needed.

### 21.2 In Review

Material edits cancel, supersede, or restart review.

The user must see a warning:

```text
Changing this campaign now will require a new review before publishing.
```

### 21.3 Published / Completed

Edits do not modify the already published truth.

The user may:

```text
Duplicate campaign
Create a new version
Create a follow-up campaign
```

---

## 22. BriefVersion — V1

V1 must recognize the concept of BriefVersion.

A new BriefVersion may be required when changing:

```text
campaign type
target audience
offer
CTA
primary channel
advertised product/store
brand restrictions
```

V1 does not need to expose complex version management UI.

---

## 23. Governance Handoff

All generated outputs are Draft.

No generated output is approved by default.

Generated outputs must hand off into the approval lifecycle defined by:

```text
docs/approval_hash_lock_state_machine_and_evidence_protocol.md
```

Future implementation should map generated outputs to:

```text
AssetVersion
content_hash
ApprovalDecision
PublishJob
PublishEvidence
AuditEvent
AICostEvent
```

V1 PRD does not implement these entities directly; it defines the product requirement and handoff expectation.

---

## 24. AI Behavior Rules — V1

AI may:

```text
generate draft captions
generate a basic hook
generate CTA variants
generate a basic hashtag pack
summarize campaign brief
rank missing inputs by impact
warn about unsupported claims
```

AI must not:

```text
approve content
publish content
invent discounts
invent fake reviews
invent stock availability
invent delivery promises
invent guarantees
claim algorithm certainty
guarantee reach or virality
scrape product/store pages automatically in V1
analyze images or video automatically in V1
```

---

## 25. Generation Failure Handling — V1

V1 must define basic failure handling.

### 25.1 API or model error

Behavior:

```text
Show generation failed message
Allow retry
Do not create approved output
Do not charge if no output was produced
Log failure where applicable
```

### 25.2 Budget exceeded

Behavior:

```text
Block generation
Show budget status
Require Owner override if supported
Do not call AI provider
```

### 25.3 Low quality output

Behavior:

```text
Allow manual edit
Allow limited regenerate if budget permits
Keep output as Draft
Do not submit automatically for review
```

### 25.4 Content policy or unsafe request

Behavior:

```text
Do not generate unsafe content
Explain that the request cannot be generated as written
Suggest safer wording where appropriate
Keep audit/cost handling consistent with policy
```

---

## 26. Explicit V1 Non-Goals

The following are not part of V1:

```text
automatic URL scraping
product page analysis
store catalog extraction
automated image analysis
automated video analysis
first 3 seconds video scoring
product collection
adding second product
bundle logic
comparison logic
premium input level
multiple hashtag packs
keyword pack
trend-fit score
algorithm-fit notes
social listening
TikTok Creative Center integration
Meta Ads Library integration
Google Trends integration
GA4 integration
Meta Insights integration
Canva integration
CapCut integration
Buffer / Later integration
automated publishing
automated evidence
browser extension
multi-touch attribution
uplift modeling
ROI prediction
LangGraph agent workflows
blockchain
virality guarantees
```

---

## 27. Future V1.5 / V2 References

Future documents may define:

```text
URL extraction and confirmation pipeline
image understanding
video understanding
premium input level
A/B variants
multiple hashtag packs
keyword pack
product collection
add second product behavior
channel variants
trend and competitor research workflows
publishing integrations
analytics integrations
social listening
owned account learning loop
```

Recommended future document:

```text
docs/prd_patch_ad_package_enhancements_v1_5_and_v2.md
```

---

## 28. User Stories — V1

### 28.1 Create a product campaign

As a marketer, I want to enter product details manually so that Marketing OS can generate a small ad package for review.

Acceptance:

```text
User selects Specific Product
User enters required product inputs
System generates brief, captions, hook, CTA variants, basic hashtag pack
Output remains Draft
Estimated AI cost is visible
```

---

### 28.2 Create a store campaign

As a store owner, I want to enter store details manually so that Marketing OS can generate a store-focused ad package.

Acceptance:

```text
User selects Store / Brand
User enters required store inputs
System generates positioning message, captions, hook, CTA variants, basic hashtag pack
Output remains Draft
Estimated AI cost is visible
```

---

### 28.3 Generate with minimum inputs

As a user with limited information, I want to generate a limited draft while understanding quality limitations.

Acceptance:

```text
System allows generation if all required fields exist
System shows quality warning
System ranks missing optional inputs
System avoids unsupported claims
```

---

### 28.4 Prevent generation below minimum

As a user with incomplete inputs, I want the system to tell me what is missing instead of generating weak publish-ready ads.

Acceptance:

```text
System blocks publish-ready generation if essential inputs are missing
System lists required missing fields
System may offer exploratory draft only with clear label
```

---

### 28.5 Regenerate safely

As a marketer, I want to regenerate a different version without overwriting the prior draft.

Acceptance:

```text
Regeneration shows cost estimate
Regeneration creates a new draft/version reference
Previous output remains available
No regenerated output is approved automatically
```

---

## 29. Acceptance Criteria

This PRD patch is acceptable when:

- It defines V1 as a narrow product/store campaign creation flow.
- It clearly separates V1 from V1.5/V2.
- It avoids unsupported URL scraping in V1.
- It avoids automated image/video analysis in V1.
- It defines required product campaign inputs.
- It defines required store campaign inputs.
- It defines V1 generation outputs.
- It includes basic hashtag generation.
- It includes simplified input quality states.
- It includes fallback behavior.
- It includes Arabic-first behavior.
- It includes generation and regeneration cost governance.
- It includes simplified edit mode.
- It includes generation failure handling.
- It hands generated outputs to the hash-lock approval lifecycle.
- It does not authorize runtime changes.
- It does not authorize schema changes.
- It does not authorize OpenAPI changes.
- It does not authorize external publishing.
- It does not claim virality, reach, or algorithmic certainty.

---

## 30. Recommended Next Sequence

After this PRD patch is reviewed and merged, the recommended sequence is:

```text
1. PRD Patch: Governed Campaign Lifecycle
2. ERD Patch: Campaign creation V1 entities and handoff entities
3. OpenAPI Patch: campaign creation and generation skeleton
4. QA Patch: input quality, fallback, generation, cost, and hash-lock handoff tests
5. Runtime Slice 1: narrow product/store campaign creation only
```

Do not start runtime implementation before this PRD patch is merged and reconciled with the governance protocol.
