# AI Features and Campaign Canvas Future Fit / Gap

## Document Status

```text
Document type: Future feature fit/gap register
Runtime changes: NO
SQL changes: NO
OpenAPI changes: NO
QA/test changes: NO
Migration changes: NO
Package/workflow changes: NO
Frontend implementation: NO
AI implementation: NO
Current implementation authority: NO
Future planning authority: YES, subject to RFC/contract approval
```

This document evaluates the submitted AI feature proposals and Campaign Canvas library proposals against the current Marketing OS execution posture.

It does not approve implementation. It preserves the ideas as future candidates and defines what must be true before any of them can enter an implementation chain.

---

## 1. Executive Decision

The submitted ideas are directionally valuable, but they are not safe for the current implementation stream.

### Current decision

```text
GO: Preserve AI and Campaign Canvas proposals as future fit/gap references.
GO: Use them later to create focused RFCs.
NO-GO: Implement any AI feature now.
NO-GO: Add pgvector, Redis/BullMQ, LLM clients, campaign canvas libraries, or frontend packages now.
NO-GO: Add SQL/OpenAPI/QA/runtime changes from this document.
NO-GO: Promote these features into Core V1 without contract evidence and approved dependencies.
```

### Main reason

The current project still prioritizes DB-backed repository progression and contract stabilization. AI features and Campaign Canvas both depend on stable DB-backed truth for Brand, Brief, Campaign, MediaAsset, ApprovalDecision, PublishJob, UsageMeter, CostEvent, AuditLog, RBAC, and frontend authentication/workspace UI.

---

## 2. Source Proposal Summary

### AI proposal package

Submitted AI ideas:

1. Brand Brain.
2. Brief-to-Content Agent.
3. Brand Compliance Scorer.
4. Competitive Intelligence Feed.

The proposal frames these as differentiating AI capabilities but also identifies prerequisites such as DB-backed BrandProfile/BrandVoiceRule, frontend maturity, Redis/BullMQ, LLM environment variables, usage metering, audit logging, and no bypass of the approval workflow.

### Campaign Canvas proposal package

Submitted Campaign Canvas ideas:

1. `@xyflow/react` for visual Campaign workflow graph.
2. `@dnd-kit/core` and `@dnd-kit/sortable` for Asset Kanban and Content Calendar drag/drop.
3. Reject `react-beautiful-dnd` / `hello-pangea/dnd` for new work.
4. Require Sprint 5-7 prerequisites before building the canvas.

---

## 3. AI Feature Fit / Gap Register

| ID | Feature | Fit | Gap / Risk | Required Prerequisites | Decision |
|---|---|---|---|---|---|
| AI-001 | Brand Brain with embeddings / pgvector | Strong future fit | Requires SQL change, vector dimension choice, model/vendor policy, re-ingestion strategy, cost metering, and quality evaluation | DB-backed BrandProfile/BrandVoiceRule, AI usage policy, schema RFC, QA plan | Needs RFC |
| AI-002 | BrandVoiceRule embeddings | Useful for semantic matching | Directly altering `brand_voice_rules` may conflict with existing mapping/gate unless contract-approved | Brand mapping review, SQL migration plan, OpenAPI/no-public-shape decision | Needs contract update |
| AI-003 | Brand ingestion service | Useful internal service | Requires eventing/reprocessing policy when rules change | Brand repository stability, job policy, retry/idempotency | Defer |
| AI-004 | Brand similarity search | Useful internal query | Needs deterministic thresholds, explainability, and fallback when embeddings unavailable | Embedding store, quality tests, no raw model leakage | Defer |
| AI-005 | Brief-to-Content Agent | High product value | Too broad now; creates MediaAssets and invokes LLM/queue/cost/audit paths | Brief/Campaign/MediaAsset DB-backed, UsageMeter, CostEvent, PromptVersion, queue, approvals | Post-core RFC |
| AI-006 | BullMQ/Redis generation queue | Operationally useful later | Adds infrastructure and retry semantics before idempotency/cost policy | Job model, idempotency, usage/cost policy, docker/devops plan | Defer |
| AI-007 | LLM client integration | Required for AI generation | External provider cost, privacy, retries, prompt injection, data retention risks | Provider policy, secret management, metering, audit | Defer |
| AI-008 | Channel prompt templates | Useful after brief generation | Template/versioning and localization issues | PromptVersion contract, approval review, QA | Defer |
| AI-009 | AI-created MediaAsset | High value | Must not bypass content hash, review, approval, or audit rules | MediaAsset/MediaAssetVersion DB-backed and approval workflow maturity | Defer |
| AI-010 | Brand Compliance Scorer | Best governance-aligned AI candidate | Depends on Brand Brain and MediaAssetVersion; must be advisory only | Brand Brain RFC, MediaAssetVersion DB-backed, threshold policy, reviewer UI | Future candidate |
| AI-011 | Compliance score saved on MediaAsset | Useful | Adds data model/change-history risk and may imply false truth if mutable | SQL/OpenAPI/QA contract and snapshot policy | Needs contract update |
| AI-012 | Compliance check endpoint | Useful | New API surface; must not imply automatic approval/denial | OpenAPI patch, RBAC, audit, QA | Defer |
| AI-013 | Competitive Intelligence Feed | Potential strategic value | External data collection, privacy, platform terms, competitor entity, new reports, cron jobs, AI summary risk | Social listening/intelligence strategy, connector policy, SQL/OpenAPI/QA | Idea Bank / Post V1 |
| AI-014 | Competitor entity | Possible future domain | New schema and tenant boundary; not Core V1 | Product decision and ERD/SQL/RBAC/Audit RFC | Post V1 |
| AI-015 | CompetitiveReport entity | Possible reporting domain | New schema and report truth/evidence issue | Reporting/evidence contract | Post V1 |
| AI-016 | RSS/public data collection | Possible low-risk source | Still requires platform terms, dedupe, retention, and source evidence | Data collection policy and connector governance | Defer |
| AI-017 | AI environment variables in `.env.example` | Necessary later | Adding now implies unsupported runtime features | Add only in implementation PR after RFC approval | Reject now |

---

## 4. Campaign Canvas Fit / Gap Register

| ID | Feature / Library | Fit | Gap / Risk | Required Prerequisites | Decision |
|---|---|---|---|---|---|
| CC-001 | Campaign Canvas concept | Strong UX value later | Visualizes workflows that are not yet fully DB-backed | Campaign/Brief/Media/Approval/Publish DB-backed and frontend auth/workspace UI | Defer |
| CC-002 | `@xyflow/react` for workflow graph | Good technical fit for relationship graph | License/pro plan review required for commercial usage; package should not be added now | Frontend MVP, legal/license review, API relationship endpoints | Needs RFC |
| CC-003 | `@dnd-kit/core` / sortable for Kanban/calendar | Good fit for drag/drop | Drag/drop state changes require reliable PATCH endpoints and permission checks | MediaAsset/PublishJob DB-backed, validation, optimistic update policy | Future candidate |
| CC-004 | Asset Kanban Draft -> In Review -> Approved -> Published | Useful workflow UI | Current lifecycle and approval rules must not be bypassed by drag/drop | Approval workflow contract, RBAC, status transition validation | Defer |
| CC-005 | Content Calendar drag/drop for PublishJob | Useful planning UI | Scheduling changes affect publish truth and may require audit/state history | PublishJob DB-backed, scheduling policy, audit events | Defer |
| CC-006 | Campaign graph nodes Campaign/Brief/Asset/Approval | Good mental model | Needs stable relationship API/read models | DB-backed relationships and frontend data contract | Defer |
| CC-007 | Reject `react-beautiful-dnd` / `hello-pangea/dnd` | Sensible technical guardrail | None for current repo if no frontend packages are added | Preserve as future library note | Approved as guidance |
| CC-008 | React Flow Pro/license check | Mandatory governance | Commercial license ambiguity can create legal/operational risk | Legal/license review before package adoption | Must validate |

---

## 5. Fit / Gap Decisions by Phase

### Not now / current stream NO-GO

```text
Brand Brain implementation.
pgvector migration.
Embedding columns.
LLM client installation.
BullMQ/Redis queue installation.
AI content generation.
Compliance scoring endpoint.
Competitive Intelligence schema.
Campaign Canvas frontend implementation.
React Flow/dnd-kit package installation.
```

### First possible future RFCs

Recommended RFC order:

1. `brand_brain_semantic_memory_rfc.md`
2. `brand_compliance_scorer_rfc.md`
3. `brief_keyword_angle_suggestion_rfc.md`
4. `campaign_canvas_frontend_rfc.md`
5. `competitive_intelligence_feed_rfc.md`

### Best near-term AI candidate

The best AI candidate is not full Brief-to-Content generation. It is a smaller advisory path:

```text
Brand Compliance Scorer as advisory-only, after Brand Brain and MediaAssetVersion are DB-backed.
```

Reason: it strengthens governance and review quality without bypassing human ApprovalDecision.

### Best near-term UI candidate

The best UI candidate is not full Campaign Canvas. It is a later bounded read-only visualization first:

```text
Read-only Campaign Workflow Graph after Campaign/Brief/Media/Approval/Publish relationships are DB-backed.
```

Do not begin with drag/drop state mutation.

---

## 6. Governance Requirements Before Any AI Implementation

Any AI implementation must define:

1. Provider and model policy.
2. Secret handling and environment contract.
3. Prompt versioning.
4. Input/output data retention.
5. PII and sensitive-content rules.
6. UsageMeter behavior.
7. CostEvent behavior.
8. AuditLog append-only behavior.
9. Workspace isolation.
10. Human-in-the-loop review gates.
11. ErrorModel mapping.
12. Retry/idempotency behavior.
13. Abuse and prompt-injection handling.
14. QA coverage with provider failure/fallback tests.

Rules:

```text
No AI output becomes approved content automatically.
No generated MediaAsset bypasses ApprovalDecision.
No commercial usage is recorded unless usable_output_confirmed=true.
No raw provider errors, prompts, secrets, or unsafe user data may leak.
```

---

## 7. Governance Requirements Before Campaign Canvas

Any Campaign Canvas implementation must define:

1. Frontend stack and routing.
2. Auth/workspace UI dependency.
3. Read model or API endpoint for campaign graph relationships.
4. Status transition rules.
5. RBAC for node actions.
6. Audit events for state changes.
7. Optimistic update/revert behavior.
8. Accessibility requirements.
9. Library license review, especially React Flow commercial/pro requirements.
10. Performance target for large campaigns.
11. No drag/drop transition that bypasses backend validation.

Recommended first version:

```text
Read-only Campaign Canvas.
No drag/drop mutation.
No status change from UI until backend status transition policy is proven.
```

---

## 8. Rejected-Now Items

| Item | Reason |
|---|---|
| pgvector migration now | SQL change before approved AI RFC and Brand DB truth is premature. |
| Embedding column on BrandVoiceRule now | Contract and migration impact not approved. |
| BullMQ/Redis now | Queue and retry semantics before idempotency/cost policy are unsafe. |
| LLM env vars now | Implies unsupported AI runtime. |
| Brief-to-Content Agent now | Too broad; creates assets and costs before core truth is stable. |
| Competitive Intelligence schema now | New external data domain and SQL/OpenAPI scope expansion. |
| React Flow/dnd-kit install now | Frontend implementation is still NO-GO in current stream. |
| Drag/drop PATCH mutations now | Backend lifecycle/status transitions are not ready. |
| Auto compliance blocking now | AI scorer must be advisory only, not approval authority. |

---

## 9. Final Recommendation

Approve this document only as a future fit/gap register.

Do not implement the submitted AI or Campaign Canvas features now.

Recommended next action after current Brand Slice and documentation work stabilizes:

```text
1. Create Brand Brain RFC.
2. Create advisory Brand Compliance Scorer RFC.
3. Create read-only Campaign Canvas RFC.
4. Only after RFC approval, draft ERD/SQL/OpenAPI/QA impacts.
5. Only then create implementation prompts.
```

Final decision:

```text
GO: Preserve AI and Campaign Canvas proposals as future candidates.
NO-GO: Current implementation.
NO-GO: SQL/OpenAPI/QA/runtime/package changes.
NO-GO: Core V1 promotion without RFC and contract approval.
```
