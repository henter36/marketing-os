# External OSS High-Risk Ideas Amendment

**Document status:** Binding amendment to `docs/external_oss_feature_extraction_for_marketing_os.md`  
**Date:** 2026-04-27  
**Purpose:** Reclassify selected projects from rejection into controlled review-only ideas.

---

## Executive Decision

The following projects and behaviors must **not** be treated as rejected research inputs:

- TikTok Bot.
- Instagram Bot.
- ReplyGuy Clone behavior such as auto-reply and scraping.
- Usher Referrals.
- Twitter auto-poster.

They are reclassified as **review-only ideas**.

This means they may be studied, documented, and used to extract safer product patterns, but they are **not approved for production execution**, autonomous agents, customer-facing activation, or direct platform integration until a separate legal, platform-policy, security, privacy, and brand-safety review approves them.

---

## Binding Classification

| Source / behavior | Previous posture | Updated posture | Allowed use | Not approved |
|---|---|---|---|---|
| TikTok Bot | Reject | Review-only idea | Study growth-loop concepts, risk signals, and engagement workflow patterns | Auto-follow, auto-like, auto-comment, account automation |
| Instagram Bot | Reject | Review-only idea | Study growth-loop concepts, risk signals, and engagement workflow patterns | Auto-follow, auto-like, auto-comment, account automation |
| ReplyGuy Clone | Reject auto-reply/scraping behavior | Review-only idea | Extract social listening, reply drafting, review queue, and brand-safety patterns | Scrape-and-reply automation, unsolicited mass replies, auto-posting |
| Usher Referrals | Reject unless Web3 | Review-only idea | Study partner/referral mechanics, campaign incentives, fraud signals | Wallet custody, private-key storage, token rewards, blockchain execution |
| Twitter auto-poster | Ideas only / not production | Review-only idea | Study AI content scheduling and draft generation | Uncontrolled AI posting, auto-publishing without approval |

---

## Required Governance Rule

Any feature inspired by these projects must pass through a **Review-Only Ideas Board** before entering product backlog.

Required review dimensions:

1. Legal review.
2. Platform terms review.
3. Security review.
4. Privacy and consent review.
5. Brand-safety review.
6. Operational support review.
7. Abuse and spam-risk review.
8. Auditability review.

No feature from this group may move to implementation unless all relevant review gates are explicitly approved.

---

## Safe Extraction Patterns

### 1. Social Growth Risk Intelligence

Allowed extraction:
- Identify risky growth tactics.
- Build risk scoring for engagement strategies.
- Detect suspicious automation patterns.
- Educate users on unsafe channel behavior.

Not approved:
- Auto-follow.
- Auto-like.
- Auto-comment.
- Account farming.
- Engagement manipulation.

---

### 2. Reply Assistant Queue

Allowed extraction:
- Pull approved source context.
- Generate suggested reply drafts.
- Apply brand and policy validation.
- Route to human reviewer.
- Store decision, edit, and evidence.

Not approved:
- Unsolicited mass replies.
- Autonomous reply posting.
- Scraping without policy/legal review.
- Stealth interactions.

---

### 3. AI Content Scheduler

Allowed extraction:
- Draft generation.
- Scheduling recommendations.
- Channel-specific content variants.
- Approval workflow.
- Publish evidence.

Not approved:
- Auto-publish by default.
- Posting without campaign/asset approval.
- Posting without channel account authorization.
- Posting AI-generated claims without validation.

---

### 4. Referral and Partner Mechanics

Allowed extraction:
- Referral links.
- Partner attribution.
- Incentive design.
- Fraud signals.
- Manual reward approval.

Not approved:
- Crypto custody.
- Token reward automation.
- Wallet private-key storage.
- Automatic payout before finance/fraud controls.

---

## Required Data Model Additions

Add or extend the external source governance model with:

```text
review_only_ideas
- id
- workspace_id nullable
- source_name
- source_url
- source_category
- idea_summary
- risk_level
- legal_review_status
- platform_policy_review_status
- security_review_status
- privacy_review_status
- brand_safety_review_status
- abuse_risk_review_status
- allowed_extraction_patterns
- blocked_execution_patterns
- decision_status
- decision_reason
- reviewed_by_user_id nullable
- reviewed_at nullable
- created_at
- updated_at
```

```text
review_only_idea_decisions
- id
- review_only_idea_id
- decision_type
- decision_status
- decision_payload
- decided_by_user_id
- decided_at
```

Allowed `decision_status` values:

```text
review_only
approved_for_research
approved_for_design
approved_for_experiment
approved_for_execution
rejected
```

Default status for TikTok Bot, Instagram Bot, ReplyGuy Clone, Usher Referrals, and Twitter auto-poster must be:

```text
review_only
```

---

## Required API Additions

```yaml
POST /api/v1/review-only-ideas
GET /api/v1/review-only-ideas
GET /api/v1/review-only-ideas/{id}
POST /api/v1/review-only-ideas/{id}/risk-assessment
POST /api/v1/review-only-ideas/{id}/decision
```

---

## Required Admin View

### Review-Only Ideas Board

The admin panel must include a board for high-risk ideas with:

- Source/project name.
- Source URL.
- Risk level.
- Allowed extraction patterns.
- Blocked execution patterns.
- Legal review status.
- Platform-policy review status.
- Security review status.
- Privacy review status.
- Brand-safety review status.
- Decision history.
- Approval/rejection trail.

---

## Text Replacement Guidance for Main Document

Where the main document says:

```text
Reject social engagement bots as product features.
```

replace with:

```text
Classify high-risk social automation as review-only ideas, not executable product features.
```

Where it says:

```text
Reject
```

for TikTok Bot, Instagram Bot, ReplyGuy Clone behavior, Usher Referrals, or Twitter auto-poster as production code, interpret it as:

```text
Review-only idea; no autonomous execution or production integration without separate approval.
```

---

## Final Binding Recommendation

These projects should remain inside the project knowledge base as **ideas for review**, not rejected references.

However, they must not enter implementation as direct automation features. The acceptable product direction is:

1. Convert bots into **risk intelligence and governed assistant patterns**.
2. Convert ReplyGuy behavior into **reply suggestion queue**, not auto-reply.
3. Convert Twitter auto-poster into **approved content scheduler**, not uncontrolled auto-posting.
4. Convert Usher Referrals into **non-custodial referral design references**, not Web3 wallet/token execution.

This protects the project from losing potentially useful ideas while preventing unsafe implementation.
