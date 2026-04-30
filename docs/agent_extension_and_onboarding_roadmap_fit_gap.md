# Agent Extension and Onboarding Roadmap Fit-Gap

> **Document type:** Future fit-gap / development roadmap candidate  
> **Scope:** Documentation-only  
> **Repository:** `henter36/marketing-os`  
> **Status date:** 2026-04-30  
> **Runtime impact:** None  
> **SQL/OpenAPI impact:** None  
> **Pilot:** NO-GO  
> **Production:** NO-GO

---

## Purpose

This document evaluates proposed agent extension, skill extension, proofreader, brand-memory, lite-pack, starter-template, SEO extension, and CLI dashboard ideas for possible inclusion in the Marketing OS development plan.

The proposals are useful as roadmap input, but they must not be copied into implementation as-is. Several items assume Claude Code-specific `.claude/agents`, `.claude/skills`, local scripts, local memory files, and orchestrator behavior. Current repository governance requires platform portability and prohibits treating any agent runtime as a mandatory product dependency.

This document turns those ideas into safe, phased development candidates.

---

## Executive Decision

```text
GO: preserve the proposals as future roadmap input.
GO: add a fit-gap plan for extension/onboarding capabilities.
GO: accept starter examples, setup-data governance, and lite-pack concepts as future documentation/product-enablement candidates.
CONDITIONAL GO: proofreader / content QA as a future governed quality gate, not as an immediate Claude-specific agent.
CONDITIONAL GO: SEO extension as a future governed capability after connector, evidence, and source governance exist.
NO-GO: immediate creation of .claude/agents, .claude/skills, scripts, orchestrator runtime changes, or auto-updating memory files.
NO-GO: treating these proposals as implementation authorization.
```

---

## Current Governance Constraints

The current repository position requires this separation:

```text
Product capability != agent runtime adapter
Governed setup data != casual prompt memory
Adapter convenience != architecture dependency
Generated content != approved content
Assistant suggestion != publication approval
```

Therefore, any extension or agent feature must be designed as a platform-portable product capability first, and only later mapped to specific execution adapters.

---

## Source Proposal Summary

The submitted proposals include two broad groups.

### 1. Extension Toolkit Proposal

The proposal recommends:

```text
EXTENDING.md
scripts/create-agent.sh
scripts/validate.sh
extensions/seo/agents/seo-specialist.md
extensions/seo/skills/seo-audit.md
orchestrator growth-awareness rule
```

Intent:

```text
Make Marketing OS easy to extend with new specialized agents and slash-command skills.
Provide a ready SEO extension pack.
Validate agent and skill files.
Let the orchestrator suggest new agents when repeated unhandled patterns appear.
```

### 2. Improvement Roadmap Proposal

The proposal recommends:

```text
Proofreader Agent
Automatic brand-voice.md updates
Lite pack for ChatGPT / non-Claude platforms
Starter brand examples
scripts/dashboard.sh terminal dashboard
```

Intent:

```text
Improve output quality.
Make brand memory improve over time.
Increase portability and accessibility.
Reduce onboarding friction.
Show operational state from the terminal.
```

---

## Fit / Gap Matrix

| Proposal | Fit | Gap / Risk | Decision |
|---|---:|---|---|
| Extension guide (`EXTENDING.md`) | Medium | Root-level extension doc may imply current implementation support that does not exist | Reframe as future docs under `docs/` first |
| `scripts/create-agent.sh` | Low now | Adds executable script and Claude-specific file layout; forbidden for current docs-only scope | Defer to Post-RFC implementation |
| `scripts/validate.sh` | Low now | Adds script behavior and assumes `.claude/agents` / `.claude/skills` as source of truth | Defer; later replace with platform-portable validator design |
| SEO Specialist extension pack | Medium later | Requires search provider governance, evidence capture, SERP/source rules, and avoids hallucinated volume claims | Future candidate only |
| Orchestrator self-growth rule | Medium later | High risk of uncontrolled scope expansion and auto-created agents | Post V1 only, human-approved only |
| Proofreader Agent | High conceptually | Must not become auto-publish approval; must be QA gate with audit and human-in-loop | Convert to Content QA Gate candidate |
| Auto-update `brand-voice.md` | Dangerous as written | Violates setup-data governance; may compound bad phrasing and unapproved claims | Reject auto-write; replace with suggestion queue |
| Lite pack for other platforms | High | Must be clearly non-authoritative and manual; avoid claiming parity with runtime | Good future documentation candidate |
| Starter brand examples | High | Must be synthetic, clearly labeled, and not implementation evidence | Good near-term documentation candidate |
| CLI dashboard script | Medium later | Adds script and assumes local file layout; may conflict with product dashboard direction | Future developer utility only |

---

## Recommended Development Plan

### Phase A — Safe Documentation / Planning

Status:

```text
GO as documentation-only.
```

Recommended artifacts:

```text
docs/agent_extension_and_onboarding_roadmap_fit_gap.md
```

Scope:

```text
Preserve the proposals.
Classify each idea.
Prevent immediate Claude-specific implementation.
Convert risky automation into governed product capabilities.
```

Non-goals:

```text
No .claude/agents files.
No .claude/skills files.
No scripts.
No orchestrator changes.
No runtime behavior.
No SQL/OpenAPI/QA changes.
```

---

### Phase B — Setup Data Governance and Starter Examples

Status:

```text
CONDITIONAL GO after a focused docs-only PR.
```

Recommended scope:

```text
Create a governed setup-data template specification.
Create synthetic starter-brand examples.
Define metadata required for brand voice, campaign brief, audience profiles, channel rules, claims, and examples.
```

Potential files:

```text
docs/setup_data_governance_template.md
docs/starter_brand_example_spec.md
examples/starter-brand/README.md
```

Guardrails:

```text
Examples must be clearly synthetic.
Examples must not be treated as implementation evidence.
Examples must not authorize runtime or AI behavior.
No auto-writing to setup files.
```

Why this should come early:

```text
It improves onboarding without changing architecture.
It directly supports the PR #68 setup-data governance rule.
It reduces weak-input risk before adding agent features.
```

---

### Phase C — Brand Voice Suggestion Queue

Status:

```text
CONDITIONAL GO after setup-data governance is approved.
```

Replace this rejected idea:

```text
Auto-append successful phrases directly to brand-voice.md.
```

With this safer capability:

```text
Generate candidate suggestions into a review queue.
Require human approval before promotion into canonical brand voice.
Record source, reason, confidence, reviewer, and date.
```

Potential product capability:

```text
BrandVoiceSuggestion
BrandVoiceSuggestionReview
Promotion into governed BrandVoiceRule only after approval
```

Required before implementation:

```text
ERD review
SQL review
OpenAPI review
RBAC review
Audit logging model
QA suite
```

---

### Phase D — Content QA Gate / Proofreader Capability

Status:

```text
CONDITIONAL GO as a future governed quality gate.
```

Do not implement as:

```text
.claude/agents/proofreader.md
Mandatory Claude-specific local agent
Final hidden auto-approval layer
```

Implement later as:

```text
Content QA Gate
Copy review result
Brand compliance check
Repetition check
Claims-risk flagging
Human approval handoff
```

Required controls:

```text
The QA gate must not publish.
The QA gate must not override human approval.
The QA gate must record findings, not silently rewrite high-risk claims.
The QA gate must distinguish correction, recommendation, and compliance risk.
```

Recommended timing:

```text
After setup-data governance and brand-rule evidence are stable.
Before auto-publishing or external provider execution.
```

---

### Phase E — Lite Pack / Platform-Portability Pack

Status:

```text
CONDITIONAL GO as documentation-only enablement first.
```

Recommended contents:

```text
docs/lite_pack_usage_guide.md
docs/lite_pack_prompt_templates.md
docs/lite_pack_limitations.md
```

Rules:

```text
Must state that lite usage is manual.
Must state that it does not equal production runtime.
Must require user-provided setup data.
Must preserve governance warnings around claims, approvals, and brand memory.
```

Why this fits:

```text
It supports platform portability.
It reduces vendor lock-in perception.
It gives users a low-friction way to understand the workflow.
```

Risk:

```text
If written poorly, it may make users believe ChatGPT/Gemini manual workflows are equivalent to governed Marketing OS runtime. The docs must explicitly reject that equivalence.
```

---

### Phase F — Extension Framework RFC

Status:

```text
NO-GO until agent runtime architecture is formally reviewed.
```

The extension framework should not begin with `.claude/agents` and `.claude/skills` as canonical structure. That would create vendor/runtime lock-in.

Future RFC should define:

```text
Extension manifest format
Capability registry
Adapter mapping layer
Required permissions
Tool access model
Evidence and source logging
Cost controls
Failure handling
Human approval requirements
Validation rules
Security boundaries
```

Potential future abstraction:

```text
extensions/{extension_slug}/manifest.yaml
extensions/{extension_slug}/README.md
extensions/{extension_slug}/capabilities/*.md
```

Only after the product-level extension model exists should Claude-specific adapters be considered.

---

### Phase G — SEO Capability

Status:

```text
Future candidate only.
```

SEO is valuable, but the proposed implementation overclaims because it assumes actual search-volume data from a generic search tool.

Required before adoption:

```text
Search/SERP provider policy
Evidence capture model
Citation/source model
Keyword confidence scoring
Jurisdiction/language handling
Claims and compliance guardrails
No invented search volume
No scraped data without provider terms review
```

Safer first version:

```text
SEO Brief Assistant
Keyword hypothesis generation
On-page checklist
Metadata suggestion
Manual evidence fields
```

Rejected for now:

```text
Automated SERP claims
Automated search-volume claims without a licensed/provider-backed source
Auto-writing SEO changes into campaign assets
```

---

### Phase H — CLI Dashboard / Developer Utility

Status:

```text
Post V1 / developer utility only.
```

The dashboard idea is useful for local developer visibility, but the proposed script assumes a local file-based runtime and modifies `scripts/`.

Defer until:

```text
Runtime state source is clear.
Setup-data files are governed.
Execution logs exist.
Usage/cost/event data model is stable.
```

Possible later version:

```text
Read-only developer diagnostics command.
No production telemetry claims.
No business dashboard substitution.
No mutation.
```

---

## Rejections and Reframes

### Rejected Now

```text
Immediate `.claude/agents/*` files
Immediate `.claude/skills/*` files
Immediate `scripts/create-agent.sh`
Immediate `scripts/validate.sh`
Immediate `scripts/dashboard.sh`
Immediate orchestrator self-extension behavior
Automatic writes to `brand-voice.md`
SEO claims based on unsupported search-volume data
Any runtime change from these proposals
```

### Reframed for Roadmap

```text
Proofreader Agent -> Content QA Gate
Auto-update Brand Voice -> Brand Voice Suggestion Queue
Claude-specific extension pack -> Platform-portable Extension Framework RFC
SEO Specialist -> SEO Brief Assistant / SEO Evidence-backed Capability
Lite folder -> Manual Lite Pack documentation with limitations
Dashboard script -> Future read-only developer diagnostics
```

---

## Proposed Issue Candidates

The following issues can be created later after this roadmap fit-gap is reviewed.

### Issue 1 — Define Governed Setup Data Templates

```text
Type: Governance / documentation
Priority: High
Scope: metadata requirements for brand voice, campaign brief, audience profiles, channel rules, claims, and examples
Implementation: NO
```

### Issue 2 — Add Synthetic Starter Brand Examples

```text
Type: Documentation / onboarding
Priority: High
Scope: example brand profile, campaign brief, audience profile, approved/rejected copy examples
Implementation: NO initially
```

### Issue 3 — Design Brand Voice Suggestion Queue

```text
Type: Product planning / contract impact review
Priority: Medium
Scope: replace auto-write behavior with human-approved suggestion queue
Requires: ERD / SQL / OpenAPI / RBAC / Audit / QA review before implementation
```

### Issue 4 — Design Content QA Gate

```text
Type: Product planning
Priority: Medium
Scope: proofing, brand adherence, repetition detection, claims-risk flags
Requires: governed setup data and approval model
```

### Issue 5 — Draft Lite Pack Usage Guide

```text
Type: Documentation / platform portability
Priority: Medium
Scope: manual prompts and usage warnings for non-runtime environments
Implementation: NO
```

### Issue 6 — Extension Framework RFC

```text
Type: Architecture RFC
Priority: Later
Scope: platform-portable extension model and adapter boundaries
Implementation: NO until approved
```

### Issue 7 — SEO Capability RFC

```text
Type: Product / integration RFC
Priority: Later
Scope: SEO brief assistant with evidence and provider governance
Implementation: NO until source and connector governance exists
```

### Issue 8 — Developer Diagnostics Dashboard

```text
Type: Developer utility planning
Priority: Post V1
Scope: read-only diagnostics, not product dashboard
Implementation: NO now
```

---

## Dependency Order

```text
1. Setup Data Governance
2. Starter Brand Examples
3. Brand Voice Suggestion Queue design
4. Content QA Gate design
5. Lite Pack documentation
6. Extension Framework RFC
7. SEO Capability RFC
8. Developer Diagnostics Dashboard
```

Reason:

```text
Do not build agents before input governance exists.
Do not build extension mechanisms before adapter boundaries exist.
Do not build SEO automation before source/evidence governance exists.
Do not build dashboards before durable runtime/event sources exist.
```

---

## Final GO / NO-GO Decision

```text
GO: add this roadmap fit-gap as documentation-only planning.
GO: preserve useful concepts for later triage.
CONDITIONAL GO: setup-data templates and starter examples as the safest near-term follow-up.
CONDITIONAL GO: Content QA Gate and Brand Voice Suggestion Queue after governance review.
NO-GO: immediate scripts, .claude agents/skills, orchestrator changes, runtime changes, SEO automation, or auto-updating brand memory.
NO-GO: Sprint 5 / Pilot / Production authorization from these proposals.
```
