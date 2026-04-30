# Marketing OS Consolidated PRD — Expanded Product, Governance, and Future Capability Blueprint

> **Document type:** Consolidated PRD / strategic product blueprint / governance reference  
> **Scope:** Documentation-only  
> **Repository:** `henter36/marketing-os`  
> **Status:** Reviewable product consolidation document  
> **Runtime impact:** None  
> **SQL/OpenAPI impact:** None  
> **Test impact:** None  
> **Sprint 5:** NO-GO  
> **Pilot:** NO-GO  
> **Production:** NO-GO

---

## 0. Executive Control Statement

This document consolidates the agreed Marketing OS direction, current implementation state, Phase 0/1 scope, governance constraints, technical boundaries, and future capability candidates documented across the repository and prior planning work.

It is intentionally broad. It captures both current scope and future candidates, but it does **not** authorize implementation of every item it mentions.

The existing `docs/prd_phase_0_1_reconciliation_after_brand_slice_1.md` remains a binding correction layer for PRD interpretation. This PRD must not override it. Where this document is broader, the reconciliation document constrains execution. Where this document describes future capabilities, they remain future candidates unless separate approved RFC / contract / QA / implementation gates exist.

### Executive decision

```text
GO: Use this PRD as a consolidated product and governance blueprint.
GO: Use it to align teams, agents, future PRDs, RFCs, and backlog decisions.
NO-GO: Treat this PRD as a direct coding instruction.
NO-GO: Treat future ideas as approved Core V1 implementation.
NO-GO: Runtime route switch from this PRD alone.
NO-GO: SQL/OpenAPI changes from this PRD alone.
NO-GO: Sprint 5, Pilot, or Production claims from this PRD alone.
```

### Upload governance note

This document is intentionally broad and strategic. It does **not** supersede the latest `README.md`, `docs/17_change_log.md`, current status documents, `docs/prd_phase_0_1_reconciliation_after_brand_slice_1.md`, ERD, SQL, OpenAPI, QA, implementation reports, post-merge verification reports, or any later merged planning documents. If repository state has advanced after this PRD was drafted, the latest repository source-of-truth documents prevail.

---

## 1. Source-of-Truth and Precedence Model

Marketing OS is contract-first. The PRD sits above implementation planning as a product-alignment document, but below binding technical contracts when implementation starts.

When documents conflict, apply this order:

```text
1. README.md — current repository execution status.
2. docs/current_repository_status_after_brand_slice_1.md and later current-status docs.
3. docs/17_change_log.md — accepted historical and current changes.
4. docs/prd_phase_0_1_reconciliation_after_brand_slice_1.md — PRD correction layer for Phase 0/1 execution.
5. docs/marketing_os_v5_6_5_phase_0_1_erd.md — relationship and entity authority.
6. docs/marketing_os_v5_6_5_phase_0_1_schema.sql and approved schema patches — database authority.
7. docs/marketing_os_v5_6_5_phase_0_1_openapi.yaml and approved OpenAPI patches — API authority.
8. docs/marketing_os_v5_6_5_phase_0_1_qa_test_suite.md — QA gate authority.
9. Runtime/SQL parity matrix, gap register, and test plan — implementation readiness evidence.
10. Implementation reports and post-merge verification reports — factual implementation evidence.
11. This consolidated PRD — product intent, scope classification, and strategic alignment.
12. Future fit/gap documents — idea banks, not implementation approval.
```

If this PRD conflicts with an authoritative implementation contract:

```text
Stop.
Do not implement by assumption.
Preserve the stricter contract.
Open a reconciliation PR or gap register entry.
```

A broad PRD can damage a disciplined repository if it blurs product ambition with implementation authority. This PRD must preserve the discipline already established through documentation gates, strict verification, post-merge reports, and explicit No-Go decisions.

---

## 2. Product Definition

### 2.1 What Marketing OS is

Marketing OS is a governance-first marketing operating system for planning, producing, reviewing, approving, publishing, evidencing, measuring, and eventually optimizing marketing work across controlled workflows.

It is designed to connect:

```text
Workspace governance
Brand rules
Campaign planning
Brief versioning
Content and media production
Review and approval
Publishing jobs
Manual publishing evidence
Tracked links
Reports and snapshots
Usage, cost, quota, and guardrail controls
Audit and operational safety
Future AI-assisted marketing operations
```

Marketing OS is not just a content generator. It is not a marketplace. It is not an uncontrolled social automation tool. It is not an AI agent that can approve or publish by itself. It is not production-ready unless future verified gates explicitly state so.

### 2.2 What problem it solves

Marketing execution fails when campaign planning, content generation, brand review, approval, publishing proof, and reporting are disconnected. Marketing OS addresses this by making every major marketing operation traceable, permissioned, versioned, and auditable.

Core problems addressed:

- Campaign briefs drift from final assets.
- Brand voice rules are not consistently enforced.
- Approval decisions are disconnected from published content.
- Publishing proof is weak or mutable.
- Performance reports lack reliable evidence chains.
- AI-generated content can bypass governance if uncontrolled.
- Usage and cost can be misread as billing truth.
- External channel activity can become operational truth without proper boundaries.

---

## 3. Product Vision

The vision is a governed marketing operating system that turns fragmented marketing work into a controlled chain:

```text
Workspace → Brand Profile → Brand Rules → Campaign → Brief Version → Media Job → Media Asset Version → Review Task → Approval Decision → Publish Job → Manual Evidence → Report Snapshot
```

Future AI capabilities should assist the chain, not replace governance:

```text
AI proposes.
Humans approve.
Evidence proves.
Reports summarize.
Contracts govern.
```

The intended long-term product is a system where marketing teams, agencies, reviewers, publishers, and analysts can operate campaigns with traceability, brand consistency, controlled automation, and measurable outcomes.

---

## 4. Current Implementation Reality

The current repository has progressed through verified backend baselines, repository slices, planning gates, and strict verification. However, the product is not Pilot-ready or Production-ready.

### 4.1 Current status summary

```text
Sprint 0 through Sprint 4: completed and passed.
Patch 002: limited in-memory runtime baseline plus strict SQL migration activation.
DB-backed Slice 0: Workspace / Membership / RBAC repository read-path verification only.
pg adapter: present for DB-backed Slice 0.
Brand Slice 1: repository-only BrandProfile / BrandVoiceRule implementation merged and verified.
Brand runtime switch: planned as documentation, but implementation remains gated.
Config validation hardening: implemented for Brand runtime mode safety.
DB-backed Slice 2 Template planning and mapping: documented, implementation remains NO-GO.
ChatGPT discussion idea intake source: added as non-authoritative intake material.
```

### 4.2 Still not approved

```text
NO-GO: DB-backed full persistence.
NO-GO: Sprint 5 coding unless separately gated.
NO-GO: Pilot.
NO-GO: Production.
NO-GO: SQL/OpenAPI changes from this PRD.
NO-GO: AI implementation.
NO-GO: Campaign Canvas implementation.
NO-GO: External provider execution.
NO-GO: Auto-publishing.
NO-GO: Patch 003 activation while draft / unapproved.
```

### 4.3 Repository-only versus runtime truth

A repository-only implementation proves database access and behavior for a narrow domain. It does not automatically make HTTP/runtime product routes DB-backed. Runtime route switching requires a separate gate, explicit tests, rollback plan, and strict verification.

---

## 5. Product Principles

Marketing OS must preserve these principles:

1. **Contract-first** — ERD, SQL, OpenAPI, QA, and status docs govern implementation.
2. **Governance-first** — automation is allowed only after permission, review, and evidence rules are defined.
3. **Tenant isolation first** — every workspace-scoped operation must be isolated by workspace context.
4. **RBAC before exposure** — no route or feature should be exposed before permission behavior is explicit.
5. **Auditability before automation** — sensitive actions must be traceable before they are automated.
6. **Human-in-the-loop** — AI cannot approve itself or bypass reviewers.
7. **Evidence before reporting** — reports must be based on snapshots/evidence, not mutable UI state.
8. **No hidden contract changes** — SQL/OpenAPI changes must never be hidden inside implementation PRs.
9. **Small verified slices** — implement narrow slices, verify, then proceed.
10. **No false readiness** — migrations, tests, or PRD text do not equal Pilot or Production readiness.

---

## 6. Target Users and Personas

### 6.1 Workspace Owner / Admin

Responsibilities:
- Configure workspace, team members, and permissions.
- Own operational and governance settings.
- Control access to brand, campaign, publishing, reporting, and cost views.

Pain points:
- Unclear ownership of marketing workflows.
- Poor permission boundaries.
- Lack of reliable audit trails.

Permission sensitivity:
- Highest.
- Can alter workspace-level configuration and membership.

### 6.2 Marketing Manager

Responsibilities:
- Plan campaigns.
- Own briefs and campaign objectives.
- Coordinate creators, reviewers, and publishers.
- Monitor performance and reporting.

Pain points:
- Fragmented planning tools.
- No single source of truth for campaign lifecycle.
- Weak connection between brief, content, approval, and publish evidence.

### 6.3 Content Creator

Responsibilities:
- Create copy, media, variants, and campaign assets.
- Use brand rules and brief context.
- Submit work for review.

Pain points:
- Brand feedback comes late.
- Rework caused by unclear approval rules.
- AI output may not match brand/legal constraints.

### 6.4 Reviewer / Approver

Responsibilities:
- Review asset versions.
- Approve, reject, or request changes.
- Ensure final approved content matches rules.

Pain points:
- Approval decisions are often detached from exact asset versions.
- Approved content may later be changed without clear history.

### 6.5 Publisher

Responsibilities:
- Prepare approved assets for publication.
- Record manual publish evidence.
- Submit URLs, screenshots, external post IDs, and content hashes.

Pain points:
- Publishing proof is often informal.
- Reports cannot reliably prove what was actually published.

### 6.6 Analyst / Reporting User

Responsibilities:
- Review performance, snapshots, evidence, and outcomes.
- Connect marketing work to measurable results.

Pain points:
- Reports often lack immutable basis.
- Data sources vary in reliability.

### 6.7 Future AI-assisted Operator

Responsibilities:
- Use AI to draft, remix, score, summarize, and recommend.
- Operate within human approval and brand governance gates.

Status:
- Future only.
- Requires RFC, contracts, QA, cost governance, and safety review.

### 6.8 Future Agency / Multi-workspace Operator

Responsibilities:
- Manage multiple brands/workspaces.
- Coordinate campaign governance across clients.

Status:
- Future or Extended V1 candidate.
- Requires multi-workspace reporting and stronger boundary controls.

---

## 7. Scope Classification

### 7.1 Current foundation

| Capability | Status | Rationale |
|---|---|---|
| Workspace | Current foundation | Tenant boundary root. |
| Membership | Current foundation | User-workspace relationship. |
| RBAC | Current foundation | Permission enforcement basis. |
| ErrorModel | Current foundation | Safe error behavior. |
| SQL migrations | Current foundation | Base schema and patches. |
| OpenAPI contract | Current foundation | API authority. |
| QA suite | Current foundation | Verification gate. |
| Runtime/SQL parity docs | Current foundation | Readiness and risk evidence. |
| BrandProfile repository | Implemented repository-only | DB-backed Brand Slice 1. |
| BrandVoiceRule repository | Implemented repository-only | DB-backed Brand Slice 1. |
| Brand runtime switch | Planned / gated | Not broadly authorized by this PRD. |
| Config validation hardening | Implemented | Protects runtime mode configuration. |

### 7.2 Core V1 / Phase 0-1 product domains

| Domain | Capability | Core reason |
|---|---|---|
| Tenant / Identity | CustomerAccount, Workspace, User, WorkspaceMember | System boundary and access control. |
| RBAC | Role, Permission, RolePermission | Permissioned workflows. |
| Subscription / Entitlement | SubscriptionPlan, PlanVersion, EntitlementVersion, CustomerSubscription, Snapshot | Commercial and usage boundaries. |
| Brand Governance | BrandProfile, BrandVoiceRule | Brand consistency and AI guardrails. |
| Campaign | Campaign, CampaignStateTransition | Marketing work container. |
| Brief | BriefVersion | Versioned campaign truth. |
| Templates | PromptTemplate, ReportTemplate | Controlled reusable content/report logic. |
| Media | MediaJob, MediaCostSnapshot, MediaAsset, MediaAssetVersion, CreativePackage | Content production and versioning. |
| Review / Approval | ReviewTask, ApprovalDecision | Human approval source of truth. |
| Publishing / Evidence | PublishJob, ManualPublishEvidence, TrackedLink | Publish and proof chain. |
| Reporting | ClientReportSnapshot | Frozen report truth. |
| Usage / Cost | UsageMeter, UsageQuotaState, CostEvent, CostBudget, CostGuardrail, MediaCostPolicy | Cost/usage governance. |
| Audit / Ops | AuditLog, AdminNotification, SafeModeState, OnboardingProgress, SetupChecklistItem | Operational safety and traceability. |

### 7.3 Extended V1 candidates

Extended V1 ideas may be valuable, but require explicit gates:

- Keyword Suggestion for Brief.
- Audience / Account Insight Snapshot.
- Trend Signals.
- Reply Assistant.
- Content remixing and channel variants.
- Basic A/B testing.
- Basic performance views.
- Limited Smart Publisher with approval gates.
- Template runtime behavior alignment.
- Narrow DB-backed template repository planning.

### 7.4 Post V1 / future strategic candidates

- Brand Brain.
- Brief-to-Content Agent.
- Brand Compliance Scorer.
- Competitive Intelligence Feed.
- Campaign Canvas.
- Social Listening.
- Advanced attribution.
- Multi-touch attribution.
- Uplift modeling.
- ROI prediction.
- Automated campaign orchestration.
- Cross-channel identity stitching.
- Explainability views.
- External integrations at scale.
- Model routing / model registry.
- Provider usage logs.
- Billing provider integration.

### 7.5 Rejected now / explicitly blocked

```text
Auto-publishing without approval.
Marketplace expansion as current scope.
TikTok / Instagram bots.
Scraping-style automation.
ReplyGuy-style automated outreach.
Full DB persistence in one PR.
Runtime route switch without gate.
Redis / BullMQ before idempotency and cost policy.
pgvector before AI RFC.
Frontend rewrite before backend truth.
Production or Pilot claims.
SQL/OpenAPI expansion hidden inside implementation PR.
```

---

## 8. Functional Requirements by Domain

### 8.1 Workspace and Tenant Boundary

Purpose:
- Define the operational container for teams, campaigns, brand settings, evidence, and reports.

Requirements:
- Every sensitive operational table must include `workspace_id`.
- `workspace_id` must be sourced from route/context, not trusted from body.
- Cross-workspace access must be rejected without existence leakage.
- Workspace membership and RBAC must gate access.

Open concerns:
- Full DB-backed runtime across product domains remains incomplete.

### 8.2 Identity and Membership

Purpose:
- Associate users with workspaces and roles.

Requirements:
- WorkspaceMember controls membership state.
- User status and membership status must be distinct.
- Removed/disabled members must not retain effective permissions.

### 8.3 RBAC

Purpose:
- Authorize domain actions.

Requirements:
- Permissions must map to domain operations.
- Routes and repository slices must enforce permission expectations.
- Tests must cover allow and deny paths.

### 8.4 Brand Governance

Purpose:
- Define brand identity, language, voice, tone, and rule boundaries.

Current repository-only capabilities:
- `BrandProfileRepository.listByWorkspace`.
- `BrandProfileRepository.create`.
- internal `BrandProfileRepository.getById`.
- `BrandVoiceRuleRepository.listByBrandProfile`.
- `BrandVoiceRuleRepository.create`.

Requirements:
- `brand_name` maps to SQL `profile_name`.
- `brand_description` maps to SQL `brand_summary`.
- `language` comes from `workspaces.default_locale` and remains internal unless contract-approved.
- `brand_status` and `rule_status` remain internal/default-only unless contract-approved.
- `rule_type` allowed values: `tone`, `banned_claim`, `required_phrase`, `style`, `legal`, `locale`.
- `severity` allowed values: `info`, `warning`, `blocker`.
- Duplicate same-workspace BrandProfile maps to `DUPLICATE_BRAND_PROFILE`.
- Duplicate names across different workspaces are allowed.

Open concerns:
- HTTP/runtime Brand routes are gated and must remain controlled by current runtime-switch governance.
- Durable AuditLog persistence is not claimed.

### 8.5 Campaign and Brief

Purpose:
- Manage campaign objectives, lifecycle, and versioned briefs.

Requirements:
- Campaign state transitions must preserve history.
- BriefVersion must be versioned and content-hash controlled.
- Brief changes create new versions; approved/locked content cannot be silently mutated.

Open concerns:
- DB-backed campaign and brief runtime persistence remains NO-GO until separately planned and tested.

### 8.6 Content / Media lifecycle

Purpose:
- Manage content generation jobs and asset versions.

Requirements:
- MediaJob must track job type, status, idempotency, input payload, requested output, and actor.
- MediaCostSnapshot must capture cost decision context.
- MediaAssetVersion content hash must be immutable.
- Approved content must not be patched; content changes create a new version.

Open concerns:
- AI/provider execution remains future-only.
- DB-backed media write path is high-risk and deferred.

### 8.7 Review and Approval

Purpose:
- Create an auditable human approval chain.

Requirements:
- ReviewTask assigns review work.
- ApprovalDecision is source of approval truth.
- `approved_content_hash` must match the MediaAssetVersion hash.
- Approval cannot be substituted by asset status alone.
- AI cannot approve itself.

### 8.8 Publishing and Evidence

Purpose:
- Control publishing and prove what was published.

Requirements:
- PublishJob requires approved ApprovalDecision and matching content hash.
- ManualPublishEvidence is append-only or correction-controlled.
- Evidence correction must use supersede or invalidate patterns.
- Proof fields must not be directly patched.

### 8.9 Reporting and Snapshots

Purpose:
- Produce reliable reporting outputs from stable evidence and snapshots.

Requirements:
- Report snapshots must preserve historical truth.
- Reports must not be rebuilt from mutable UI state alone.
- Evidence and approved content must be traceable from report output.

### 8.10 Usage / Cost / Billing Governance

Purpose:
- Track usage and cost without misrepresenting billing truth.

Requirements:
- UsageMeter records usable outputs only when confirmed.
- CostEvent is not invoice or billing truth.
- CostBudget and CostGuardrail define operational limits.
- Provider cost does not become customer billing source without billing contract.

Open concerns:
- ProviderUsageLog and BillingProvider are future contract-patch candidates only.

### 8.11 Audit and Compliance

Purpose:
- Preserve who did what, when, and under which context.

Requirements:
- AuditLog is append-only.
- Sensitive writes need durable audit design before production-readiness claims.
- Audit logs must not become business state.

Open concerns:
- Durable audit coupling is not fully implemented.

---

## 9. Non-Functional Requirements

### 9.1 Security

- No raw SQL errors in API responses.
- No stack traces, secrets, connection strings, enum names, or constraint names exposed.
- Secret references must not store plaintext secrets.
- External provider credentials require a security contract before implementation.

### 9.2 Tenant isolation

- Every workspace-scoped query must include workspace context.
- RLS is defense-in-depth only; application checks remain required.
- Cross-workspace tests are mandatory for DB-backed slices.

### 9.3 RBAC

- Permission checks must precede sensitive actions.
- Tests must cover allow and deny paths.

### 9.4 Immutability and append-only truth

- Content hash fields must be immutable.
- Evidence proof fields must be protected.
- Snapshots must preserve historical truth.

### 9.5 Idempotency

- MediaJob and PublishJob require idempotency discipline.
- Retry behavior must not create duplicate business truth.

### 9.6 Migration safety

- Strict migration order must remain explicit.
- Migration retry must remain part of CI.
- Migration success does not prove runtime persistence.

### 9.7 Performance

- Performance optimization must follow measurement.
- Redis/caching is not approved until real bottlenecks and idempotency policy exist.

### 9.8 Observability

Future requirements:
- Structured logging.
- Correlation IDs.
- Health checks.
- Slow query detection.
- Safe error reporting.

### 9.9 AI safety and cost control

Future AI features require:
- Prompt/response safety policy.
- Provider error sanitization.
- Model cost metering.
- Human review gates.
- Abuse prevention.
- Explainability where relevant.

---

## 10. AI and Automation Requirements

AI is strategically important, but currently future-gated.

### 10.1 Future AI candidates

- AI Commerce Studio.
- Brand Brain.
- Brief-to-Content Agent.
- Brand Compliance Scorer.
- Competitive Intelligence Feed.
- Keyword Suggestion for Brief.
- Audience / Account Insight Snapshot.
- Trend Signals.
- Reply Assistant.
- Content Remixing.
- Channel variants.
- AI-assisted review suggestions.
- Explainability views.
- Model routing / registry.
- AI asset performance comparison.

### 10.2 AI guardrails

```text
NO-GO: AI implementation from this PRD.
NO-GO: LLM provider integration without RFC.
NO-GO: pgvector without AI/storage RFC.
NO-GO: AI output auto-approval.
NO-GO: AI bypassing ApprovalDecision.
NO-GO: Auto-publishing from AI.
NO-GO: Exposing provider errors, prompts, secrets, or tokens.
```

AI must assist, not govern.

---

## 11. Campaign Canvas / UX Future Direction

Campaign Canvas is a future visualization and workflow capability, not a current implementation item.

Possible future capabilities:
- Read-only campaign graph.
- Campaign workflow visualization.
- Asset Kanban.
- Content calendar.
- Drag/drop planning.
- React Flow / `@xyflow/react` candidate.
- `dnd-kit` candidate for Kanban/calendar.

Required gates:
- DB-backed Campaign, Brief, Media, Review, Approval, Publish, and Evidence relationships must be stable.
- No drag/drop status mutation until state transitions are contract-approved.
- No frontend package installation without frontend architecture approval.
- No UI redesign before backend truth.

---

## 12. Social, Competitive, and External Channel Scope

### 12.1 Future candidates

- Social Listening.
- Competitive Intelligence.
- Trend Signals.
- External channel integrations.
- Meta CAPI.
- Google Enhanced Conversions.
- Webhooks.
- Connector accounts.
- Performance events.
- Campaign metric snapshots.
- Metric confidence scoring.
- Lead capture.
- Contact and consent tracking.
- Notification rules and deliveries.

### 12.2 Rejected now

```text
NO-GO: TikTok / Instagram bots.
NO-GO: Scraping-style automation.
NO-GO: Twitter/X auto-posting as production code.
NO-GO: ReplyGuy-style auto-reply/scraping.
NO-GO: Auto-publish.
NO-GO: External provider execution before governance.
NO-GO: Patch 003 activation while Draft / NO-GO.
```

---

## 13. Analytics, Attribution, and Optimization

### 13.1 Current and near-term concepts

- ReportSnapshot.
- Campaign metrics.
- Manual evidence-based reports.
- Asset performance views.
- Confidence-scored metrics.

### 13.2 Future analytics

- Last-qualified-click baseline.
- Attribution layer.
- Performance Brain.
- AI asset performance comparison.
- Multi-touch attribution.
- Uplift modeling.
- ROI prediction.
- A/B testing.
- Automated campaign orchestration.
- Cross-channel identity stitching.

### 13.3 Boundary

Analytics are not financial truth unless a separate billing/finance contract defines that role. Performance insight, usage metering, cost governance, and billing/invoicing must remain separated.

---

## 14. Architecture and Implementation Model

### 14.1 Current architecture posture

- Backend-first.
- Contract-first.
- In-memory runtime remains part of current product route behavior.
- DB-backed repositories are introduced by verified slices.
- Runtime switches are gated.
- SQL/OpenAPI/QA changes require explicit PRs.

### 14.2 Approved implementation pattern

```text
1. Planning / mapping document.
2. Gap register update if needed.
3. Gate review.
4. Repository-only implementation where appropriate.
5. Integration tests.
6. Post-merge verification.
7. Runtime switch planning.
8. Runtime switch implementation only if separately approved.
```

### 14.3 Future architecture ideas

- Domain events.
- Outbox where needed.
- Event-driven architecture.
- Redis/BullMQ later only after idempotency and retry policy.
- Observability.
- Correlation IDs.
- Rate limiting.
- API hardening.
- Feature flags / gated runtime modes.

---

## 15. Workflow Requirements

### 15.1 Workspace setup

Current role:
- Establish tenant and operational boundary.

Required controls:
- Tenant isolation.
- Member setup.
- RBAC seed and enforcement.

### 15.2 Brand setup

Workflow:
```text
Create BrandProfile → Create BrandVoiceRule → Use rules in future content workflows
```

Current status:
- Repository-only DB-backed BrandProfile / BrandVoiceRule exists.
- Runtime route switching remains gated.

### 15.3 Campaign setup

Workflow:
```text
Create Campaign → Track state transitions → Create BriefVersion
```

Current status:
- Runtime exists in current backend baseline.
- DB-backed persistence requires future slice.

### 15.4 Content lifecycle

Workflow:
```text
BriefVersion → MediaJob → MediaAsset → MediaAssetVersion
```

Required controls:
- Idempotency.
- Cost snapshot.
- Content hash.
- Version immutability.

### 15.5 Review and approval

Workflow:
```text
MediaAssetVersion → ReviewTask → ApprovalDecision
```

Required controls:
- Human approval.
- Hash matching.
- No AI auto-approval.

### 15.6 Publish and evidence

Workflow:
```text
ApprovalDecision → PublishJob → ManualPublishEvidence → TrackedLink
```

Required controls:
- Approved hash enforcement.
- Evidence immutability.
- Supersede/invalidate only.

### 15.7 Reporting

Workflow:
```text
Evidence + Metrics + Snapshots → ClientReportSnapshot
```

Required controls:
- Snapshot immutability.
- Evidence traceability.

---

## 16. Risk Register

| Risk | Severity | Impact | Mitigation |
|---|---:|---|---|
| PRD treated as implementation authorization | Critical | Scope explosion | Precedence model and reconciliation layer. |
| In-memory runtime mistaken for production readiness | Critical | False readiness | Current status docs and No-Go statements. |
| Repository-only slices mistaken for full persistence | High | Misleading architecture | Runtime switch gates and post-merge verification. |
| Runtime/SQL drift | High | Incorrect persistence behavior | Parity matrix, gap register, test plan. |
| Tenant leakage | Critical | Security and trust failure | Workspace filters and cross-workspace tests. |
| RBAC bypass | High | Unauthorized actions | Permission tests and route guards. |
| AuditLog not durable | High | Weak compliance evidence | Future audit transaction design. |
| Evidence mutation | Critical | Reporting truth compromised | Append-only/supersede/invalidate policy. |
| AI scope creep | High | Unsafe automation | RFC and human-in-the-loop gates. |
| External integration overreach | High | Core truth corruption | Integration boundary lock. |
| Patch 002 persistence confusion | High | Premature DB claims | Explicit Patch 002 status. |
| Frontend premature integration | Medium | UI drift from backend truth | Backend-first gating. |
| Future docs misread as approved scope | High | Wrong implementation | Fit/gap classification and No-Go blocks. |

---

## 17. Traceability Matrix

| PRD area | Source documents / evidence | Implementation authority | Status |
|---|---|---|---|
| Current status | README, current status docs, change log | README / change log | Authoritative over this PRD. |
| ERD / relationships | Phase 0/1 ERD | ERD | Contract authority. |
| SQL schema | Base schema and patches | SQL files | Contract authority. |
| API contract | OpenAPI and patches | OpenAPI files | Contract authority. |
| QA gates | QA suite and CI | QA files / workflows | Verification authority. |
| Brand repository slice | Brand implementation and post-merge reports | repository files / tests | Implemented repository-only. |
| Brand runtime switch | runtime switch planning | future implementation PR | Gated. |
| Templates Slice 2 | template planning and mapping docs | future gate | Planning only. |
| AI and Canvas | future fit/gap docs | future RFC | Future only. |
| Social / external channels | fit/gap / Patch 002 docs | future contract | Future or limited baseline. |

---

## 18. Recommended Execution Sequence

Recommended next sequence remains governed by current repository status, not this PRD alone:

```text
1. Keep PRD as documentation-only blueprint.
2. Use prd_phase_0_1_reconciliation_after_brand_slice_1.md as binding correction layer.
3. Validate current main status before each new planning or implementation PR.
4. Complete required post-merge verification for any implementation PR.
5. Continue DB-backed slices only through candidate selection, mapping, gate review, tests, implementation, and post-merge verification.
6. Do not start broad Sprint 5 coding without explicit gate.
7. Do not implement AI, Campaign Canvas, social automation, or external provider execution without RFC and contract impact review.
```

Potential next planning tracks:

- Brand runtime switch verification and any remaining hardening.
- DB-backed Slice 2 Template runtime behavior patch planning and implementation only if separately approved.
- Next DB-backed slice candidate selection after templates are resolved.
- Governance/tooling improvements.
- PRD master rewrite only after reconciliation and source precedence remain intact.

---

## 19. Go / No-Go Summary

### GO

```text
GO: Use this document as a consolidated product blueprint.
GO: Use it to classify current, Core V1, Extended V1, Post V1, and future ideas.
GO: Use it to prevent loss of product intent across many planning files.
GO: Use it to guide future RFCs and backlog planning.
```

### NO-GO

```text
NO-GO: Treat this PRD as direct implementation authorization.
NO-GO: Runtime route switch from this PRD.
NO-GO: Public Brand get/update routes from this PRD.
NO-GO: SQL/OpenAPI changes from this PRD.
NO-GO: Durable AuditLog claim from this PRD.
NO-GO: DB-backed full persistence from this PRD.
NO-GO: Sprint 5 from this PRD.
NO-GO: Pilot from this PRD.
NO-GO: Production from this PRD.
NO-GO: AI implementation from this PRD.
NO-GO: Campaign Canvas implementation from this PRD.
NO-GO: External provider execution from this PRD.
NO-GO: Auto-publishing from this PRD.
```

---

## 20. Final Executive Decision

This consolidated PRD is valuable because it collects the product ambition, current scope, future ideas, and governance model into one readable artifact.

It is safe for the project only if treated as a **strategic consolidation document**, not a direct execution contract.

Final decision:

```text
PRD consolidation: GO.
Implementation authorization: NO-GO.
Source-of-truth override: NO-GO.
Future capability promotion: NO-GO without RFC / contract / QA / gate.
```

Marketing OS should continue to advance through narrow, verified, contract-governed slices. The PRD must support that discipline, not weaken it.
