# Conversation-Derived Proposal and Fix Priority Plan

## Document Status

```text
Document type: Documentation-only priority and scope control plan
Runtime changes: NO
SQL changes: NO
OpenAPI changes: NO
QA/test changes: NO
Migration changes: NO
Package/workflow changes: NO
Implementation authority: NO
Planning authority: YES, subject to later contract-specific PRs
```

This document extracts and consolidates proposals, warnings, fixes, deferrals, and rejection decisions discussed in the prior Marketing OS conversation and compares them against the current repository posture.

It exists to prevent scattered conversation notes from becoming uncontrolled implementation scope.

Primary project references reviewed:

- `README.md`
- `docs/17_change_log.md`
- `docs/runtime_sql_parity_matrix.md`
- `docs/db_backed_slice_1_brand_planning.md`
- `docs/brand_slice_1_implementation_gate_review.md`
- `docs/deferred_architecture_logic_remediation_execution_plan.md`
- `docs/inpactai_near_term_feature_candidates.md`
- `docs/social_listening_v1_backlog.md`
- current PR context for DB-backed Brand Slice 1 repositories

---

## 1. Executive Decision

### Are the conversation-derived proposals convertible into an execution plan?

Yes, but only after strict filtering.

The conversation contains useful and project-aligned ideas, but it also contains items that are premature, duplicated, already covered, too broad, or unsafe to implement now. The proposals are convertible into a controlled execution plan only if classified by risk, phase, dependency, and contract impact.

### What must be done first?

The first actionable path remains contract-safe DB-backed progression:

1. Reconcile current repository status after PR #37.
2. Treat open PR #36 as a repository-only Brand Slice 1 implementation candidate, not as merged truth.
3. Require PR #36 to be rebased or refreshed on current `main` and revalidated after PR #37.
4. If still clean, review PR #36 against the Brand Slice 1 gate before merge.
5. Do not expand to runtime route switching, Campaign persistence, Patch 002 persistence, Sprint 5, Pilot, or Production from PR #36.

### What must be deferred?

The following must remain deferred:

- Full DB-backed product-route persistence.
- Campaign / Brief / Media / Approval / Publish / Evidence DB write paths.
- Patch 002 DB persistence.
- Runtime route switch from in-memory to DB-backed product routes.
- JWT auth replacement.
- Rate limiting, logging, health checks, CORS, security headers, and environment validation as runtime changes.
- Dynamic templating.
- Retry logic for AI/API calls.
- Frontend MVP.
- AI integration / Brand Brain / Nashir.
- Auto-publishing.
- Billing / Stripe / ProviderUsageLog.
- Creator Marketplace implementation.
- Social Listening implementation.

### What must be rejected now?

Reject now:

- Python `validators.py` or any Python validator in the current JavaScript/Node project.
- Generic middleware without a mapped route/job and approved contract.
- Treating CodeRabbit/Qlty/GitHub Actions success as sufficient product correctness.
- Implementing external project code directly into Marketing OS.
- Implementing Creator Marketplace, automated outreach, chat, payments, or contract assistant now.
- Treating Social Listening candidate backlog as approved implementation scope.
- Treating Patch 003 / PR #24 as active while still Draft / NO-GO.

### Is there risk in merging some items early?

Yes. The main systemic risk is scope contamination: importing Extended V1, Post V1, or external-feature ideas into Core V1 before the DB-backed and contract baseline is stable.

The most dangerous premature mixes are:

- DB-backed writes plus runtime route switching in the same PR.
- SQL/OpenAPI changes plus runtime implementation in the same PR.
- AI generation plus usage/cost metering before the usage truth model is enforced.
- Auto-publishing before ApprovalDecision, PublishJob, idempotency, and evidence integrity are proven.
- Marketplace scope before deciding whether it belongs in Marketing OS or a separate product.

Final executive decision:

```text
GO NOW: documentation-only consolidation and status control.
CONDITIONAL GO: PR #36 after rebase/revalidation and strict gate review.
NO-GO NOW: any runtime expansion beyond the approved repository-only Brand Slice 1 boundary.
NO-GO NOW: Sprint 5, Pilot, Production, frontend, AI integration, auto-publishing, billing, Creator Marketplace, Social Listening implementation.
```

---

## 2. Conversation-Derived Items Register

| ID | Extracted Item | Conversation Context | Related Project Area | Classification | Priority | Phase | Dependency | Risk if Ignored | Risk if Implemented Early | Required Action | Status |
|----|----------------|---------------------|----------------------|----------------|----------|-------|------------|-----------------|---------------------------|-----------------|--------|
| CDI-001 | Runtime/SQL parity must remain a gate before DB-backed expansion | Repeated reviews emphasized that SQL/OpenAPI existence does not prove runtime parity | Runtime/SQL parity | Mandatory Fix | P0 | Core V1 | Runtime parity matrix, gap register, test plan | Runtime behavior may drift from SQL truth | Over-testing without implementation may stall progress | Preserve as mandatory gate | Already covered |
| CDI-002 | BrandProfile / BrandVoiceRule is the preferred low-risk Slice 1 candidate | Candidate selected because it avoids Campaign/Brief/Media/Approval complexity | DB-backed repositories | Runtime Implementation Candidate | P0 | Core V1 | Brand mapping addendum and gate review | Project remains stuck at Slice 0 only | If broadened, it can become accidental Sprint 5 | Continue only as repository-only candidate | Approved for planning |
| CDI-003 | Open PR #36 must be treated as candidate, not merged truth | Conversation states PR #36 exists; GitHub shows it remains open | PR review / Brand Slice 1 | Governance Fix | P0 | Core V1 | Rebase/revalidation on current main | Wrong status claims in docs | Merging stale PR can conflict with PR #37 | Rebase or refresh PR #36 and re-run strict verification | Needs validation |
| CDI-004 | No runtime route switch for Brand Slice 1 | Brand gate allows repository-only implementation, not HTTP/runtime switching | Runtime code | Architecture Alignment | P0 | Core V1 | CDI-002 / CDI-003 | Split-brain DB/in-memory behavior persists untracked | DB writes with in-memory reads can corrupt expectations | Keep route switching NO-GO | Approved for planning |
| CDI-005 | No SQL/OpenAPI changes for Brand Slice 1 unless a contract gap blocks implementation | Brand addendum resolved mappings without changing SQL/OpenAPI | SQL / OpenAPI | OpenAPI / Contract Alignment | P0 | Core V1 | Brand mapping addendum | Hidden contract mismatch | Contract drift and unreviewed API expansion | Stop implementation if SQL/OpenAPI change is needed | Approved for planning |
| CDI-006 | Patch 002 is active only for limited in-memory runtime and SQL migration order, not DB persistence | README and change log distinguish Patch 002 migration activation from DB-backed runtime | Patch 002 | Documentation Reconciliation | P0 | Core V1 | Patch 002 docs and migration order | False readiness claim | DB persistence added without privacy/consent/idempotency controls | Keep Patch 002 DB persistence NO-GO | Already covered |
| CDI-007 | Patch 003 / PR #24 remains Draft / NO-GO | Repeated conversation decision | Patch 003 / competitive features | Governance Fix | P0 | Excluded / Reject Now | PR #24 review | Accidental merge of unapproved scope | Competitive features contaminate Core V1 | Keep Draft / NO-GO until separate review | Approved for planning |
| CDI-008 | AuditLog must not be claimed durable unless implemented | Multiple plans warn current audit behavior is placeholder/event pattern | Audit Logs | Mandatory Fix | P0 | Core V1 | Audit implementation contract | False compliance/audit claims | Legal/reputational exposure | Keep durable AuditLog claim NO-GO | Approved for planning |
| CDI-009 | UsageMeter and CostEvent rules must be preserved | Conversation emphasized `usable_output_confirmed=true` and CostEvent not billing | Usage / Cost | Mandatory Fix | P0 | Core V1 | Usage/cost contract | Billing/usage disputes | AI/Billing features may record false commercial usage | Preserve rules before AI/retry/billing work | Approved for planning |
| CDI-010 | Python `validators.py` must not be implemented | Earlier recommendation proposed Python validation; rejected as wrong stack | Validation | Reject / Do Not Implement Now | P0 | Excluded / Reject Now | Current JS/Node stack | Inconsistent validation may remain | Technology drift and false safety | Reject and document JS-only validation path | Rejected for now |
| CDI-011 | Validation should be JS/Node and slice-scoped, not global at once | Deferred remediation plan allows validators only after audit | Validation | Architecture Alignment | P1 | Core V1 | Audit-first plan | Bad inputs remain under-tested | Broad validator rollout creates contract drift | Start with Brand slice only after audit/PR #36 status | Approved for planning |
| CDI-012 | `.env.example` / environment contract review is useful but not a blocker before Brand repository review | Recommendations mentioned environment completeness | Environment | Governance Fix | P2 | Core V1 | Deferred architecture plan | Onboarding confusion | Future-only variables imply unsupported features | Add later as small PR if gaps are proven | Deferred |
| CDI-013 | Dynamic templating must be deferred until token, PII, escaping, and audit rules exist | Conversation warned against uncontrolled templates | Templating | Reject / Do Not Implement Now | P2 | Extended V1 | Template contract/RFC | Weak content personalization | Injection/PII/non-reproducible outputs | Defer; create contract first if needed | Deferred |
| CDI-014 | Retry logic for AI/API calls must wait for idempotency and usage/cost rules | Conversation warned about duplicate cost and assets | AI/API reliability | Reject / Do Not Implement Now | P2 | Extended V1 | Idempotency and usage/cost policy | Provider failures remain manual | Duplicate costs, duplicate jobs, bad metrics | Defer until policy and QA exist | Deferred |
| CDI-015 | Rate limiting, logging, health checks, CORS, security headers are useful but must not be mixed with DB-backed Slice 1 | Uploaded recommendations classify these as infrastructure hardening | Security / Observability | Architecture Alignment | P2 | Core V1 | Runtime audit and separate PRs | Operational visibility and abuse controls lag | Large PR obscures DB persistence risks | Create separate small PRs after current Brand work | Deferred |
| CDI-016 | JWT auth is important but not an immediate replacement for `x-user-id` | Recommendations suggested JWT; conversation requires backward compatibility | Auth / RBAC | Architecture Alignment | P2 | Core V1 | Auth transition plan | Weak identity model persists | Breaking tests/current auth context | Defer to migration plan with compatibility | Deferred |
| CDI-017 | Fastify/Express migration must not occur during DB-backed persistence work | Recommendations proposed HTTP framework migration | Runtime architecture | Reject / Do Not Implement Now | P2 | Extended V1 | Runtime architecture RFC | Raw http limitations remain | Framework migration hides persistence defects | Defer until core persistence stable | Rejected for now |
| CDI-018 | Migration framework replacement such as Knex/node-pg-migrate must be deferred | Recommendations propose migration framework | SQL / migrations | Reject / Do Not Implement Now | P2 | Extended V1 | Migration RFC | Custom migration maintenance cost | Breaks strict migration gate | Defer; evaluate separately | Rejected for now |
| CDI-019 | Frontend MVP should not start before backend persistence stabilizes | Recommendations propose frontend; README forbids frontend now | Frontend | Reject / Do Not Implement Now | P3 | Post V1 | DB-backed core | No user UI | UI built on in-memory truth | Defer until backend core is stable | Rejected for now |
| CDI-020 | AI integration / Brand Brain / Nashir must be Post-core | Conversation and recommendations treat AI as future | AI Commerce Studio | Future Idea | P3 | Post V1 | Usage/cost, prompt versioning, guardrails | Differentiation delayed | AI scope distracts from operational core | Keep in Idea Bank / Post V1 | Deferred |
| CDI-021 | Auto-publishing must be deferred | Repeated warnings about paid/external execution and approval safety | Publishing | Reject / Do Not Implement Now | P3 | Post V1 | ApprovalDecision, PublishJob, Evidence, queue | No automated execution | Brand/reputation/platform risk | Defer until publish/evidence/idempotency mature | Rejected for now |
| CDI-022 | Billing / Stripe / ProviderUsageLog must be deferred | Conversation warned CostEvent is not billing source | Billing | Reject / Do Not Implement Now | P3 | Post V1 | Usage truth and billing contract | No monetization automation | Financial source-of-truth corruption | Defer; do not add to Core V1 | Rejected for now |
| CDI-023 | InPactAI Keyword Suggestion for Brief is the safest near-term idea, but not implementation-approved | InPactAI near-term document classifies it as Core V1 candidate | Brief enrichment | Future Idea | P2 | Core V1 | RFC, ERD/OpenAPI/QA/RBAC/AuditLog | Brief quality remains manual | AI suggestions contaminate contracts | Create RFC only, no runtime changes | Deferred |
| CDI-024 | Audience / Account Insight Snapshot is conditional | InPactAI document says only if account analysis is approved in V1 | Account insights | Future Idea | P3 | Extended V1 | Account analysis decision, privacy rules | Weak campaign evidence | Data governance overreach | Keep conditional / Extended V1 unless approved | Deferred |
| CDI-025 | Trend Signals belong to Extended V1 only | InPactAI document classifies Trend Signals as Extended V1 | Intelligence | Future Idea | P3 | Extended V1 | Source/confidence/freshness model | Less ideation support | AI trend facts may be unreliable | Keep Extended V1 | Deferred |
| CDI-026 | Creator Marketplace is discovery/RFC only, not implementation | InPactAI document explicitly forbids implementation | Marketplace | Future Idea | P3 | Idea Bank | Product strategy RFC | Strategic option remains unresolved | Two-sided marketplace scope explosion | Keep as RFC / Idea Bank only | Deferred |
| CDI-027 | Social Listening is candidate backlog only | Social Listening doc says not approved Sprint scope | Social Listening | Future Idea | P3 | Idea Bank | ERD, SQL, OpenAPI, QA, provider strategy | Potential monitoring value delayed | Adds external data/privacy/connector scope too early | Keep candidate backlog; no implementation | Deferred |
| CDI-028 | Competitive feature extraction is inspiration unless promoted through contract chain | Conversation covered external OSS/competitive features | Competitive feature extraction | Future Idea | P3 | Idea Bank | Fit-gap, RFC, contract patch | Missed product ideas | External feature creep | Keep as Idea Bank / fit-gap only | Deferred |
| CDI-029 | Social auto-bots, scraping, automated outreach, and ReplyGuy-like behavior must not be production code | Conversation rejected/idea-banked risky bots | External automation | Reject / Do Not Implement Now | P3 | Excluded / Reject Now | Platform compliance review | Some growth ideas delayed | Spam/compliance/reputation risk | Reject runtime implementation | Rejected for now |
| CDI-030 | Documentation reconciliation must remain a separate PR class | Conversation repeatedly fixed status drift | Docs / README / change log | Documentation Reconciliation | P1 | Core V1 | Current status docs | Stale status misleads implementers | Combining docs with runtime hides risk | Continue doc-only reconciliation PRs | Approved for planning |
| CDI-031 | Codex implementation instructions must continue enforcing approved-source-only execution | Repeated instructions to constrain Codex | Codex instructions | Governance Fix | P1 | Core V1 | Contract source files | Codex may invent implementation | Overly broad instructions can block progress | Update only when execution chain changes | Approved for planning |
| CDI-032 | QA must precede or accompany runtime implementation | Conversation emphasizes QA, tenant isolation, RBAC, ErrorModel | QA | QA Coverage | P1 | Core V1 | Contract and repository scope | Unsafe runtime passes review | Overbroad QA slows small PRs | Add focused QA per slice | Approved for planning |

---

## 3. Priority Execution Order

### First: P0 — must be handled before any programming expansion

1. CDI-003 — Resolve open PR #36 status: rebase/refresh on current `main`, re-run strict verification, review against gate.
2. CDI-002 — Preserve BrandProfile / BrandVoiceRule as the next allowed repository-only Slice 1 candidate.
3. CDI-004 — Keep HTTP/runtime route switch NO-GO.
4. CDI-005 — Keep SQL/OpenAPI changes NO-GO for Brand Slice 1 unless a blocking contract gap appears.
5. CDI-006 — Keep Patch 002 DB persistence NO-GO.
6. CDI-007 — Keep Patch 003 / PR #24 Draft / NO-GO.
7. CDI-008 — Do not claim durable AuditLog persistence.
8. CDI-009 — Preserve UsageMeter / CostEvent truth rules.
9. CDI-010 — Reject Python `validators.py`.
10. CDI-001 — Keep Runtime/SQL parity as a hard gate.

### Second: P1 — must be fixed before broader runtime implementation

1. CDI-030 — Keep documentation reconciliation as its own PR class.
2. CDI-031 — Keep Codex instructions aligned with approved sources.
3. CDI-032 — Add QA per slice before runtime expansion.
4. CDI-011 — Add JS validation only when scoped and contract-safe.

### Third: P2 — can happen after contracts stabilize

1. CDI-012 — Environment contract review.
2. CDI-015 — Logging, health checks, rate limiting, CORS, security headers as isolated PRs.
3. CDI-016 — JWT transition plan.
4. CDI-013 — Dynamic templating contract only.
5. CDI-014 — Retry/idempotency/usage-cost policy only.
6. CDI-023 — Keyword Suggestion RFC only.

### Fourth: P3 — future ideas / Idea Bank

1. CDI-020 — AI integration / Brand Brain / Nashir.
2. CDI-024 — Audience / Account Insight Snapshot.
3. CDI-025 — Trend Signals.
4. CDI-026 — Creator Marketplace RFC.
5. CDI-027 — Social Listening candidate backlog.
6. CDI-028 — Competitive feature extraction idea bank.

### Fifth: Rejected Now

1. CDI-017 — Framework migration now.
2. CDI-018 — Migration framework replacement now.
3. CDI-019 — Frontend MVP now.
4. CDI-021 — Auto-publishing now.
5. CDI-022 — Billing/Stripe now.
6. CDI-029 — Bots/scraping/automated outreach as production code.
7. CDI-010 — Python validators.

---

## 4. Impact Matrix

| Item ID | README | Docs | ERD | SQL | OpenAPI | QA | RBAC | Audit Logs | Runtime Code | Migration Risk |
|--------|--------|------|-----|-----|---------|----|------|------------|--------------|----------------|
| CDI-001 | Review Required | Update Required | Review Required | Review Required | Review Required | Update Required | Review Required | Review Required | Must Not Touch Now | Must Not Touch Now |
| CDI-002 | Review Required | Update Required | Review Required | No Impact | No Impact | Update Required | Review Required | Review Required | Must Not Touch Now | No Impact |
| CDI-003 | Update Required | Update Required | No Impact | No Impact | No Impact | Review Required | Review Required | Review Required | Must Not Touch Now | No Impact |
| CDI-004 | Review Required | Update Required | No Impact | No Impact | No Impact | Review Required | Review Required | Review Required | Must Not Touch Now | No Impact |
| CDI-005 | Review Required | Update Required | Review Required | Must Not Touch Now | Must Not Touch Now | Review Required | No Impact | Review Required | Must Not Touch Now | Must Not Touch Now |
| CDI-006 | Review Required | Update Required | Review Required | Review Required | Review Required | Review Required | Review Required | Review Required | Must Not Touch Now | Must Not Touch Now |
| CDI-007 | Review Required | Update Required | Review Required | Must Not Touch Now | Must Not Touch Now | Review Required | Review Required | Review Required | Must Not Touch Now | Must Not Touch Now |
| CDI-008 | Review Required | Update Required | Review Required | Review Required | Review Required | Update Required | Review Required | Update Required | Must Not Touch Now | Review Required |
| CDI-009 | Review Required | Update Required | Review Required | Review Required | Review Required | Update Required | Review Required | Review Required | Must Not Touch Now | Review Required |
| CDI-010 | No Impact | Update Required | No Impact | No Impact | No Impact | No Impact | No Impact | No Impact | Must Not Touch Now | No Impact |
| CDI-011 | Review Required | Update Required | No Impact | No Impact | Review Required | Update Required | Review Required | Review Required | Must Not Touch Now | No Impact |
| CDI-012 | Review Required | Update Required | No Impact | No Impact | No Impact | Review Required | No Impact | No Impact | Must Not Touch Now | No Impact |
| CDI-013 | Review Required | Update Required | Review Required | Must Not Touch Now | Must Not Touch Now | Review Required | Review Required | Review Required | Must Not Touch Now | Must Not Touch Now |
| CDI-014 | Review Required | Update Required | Review Required | Must Not Touch Now | Must Not Touch Now | Review Required | Review Required | Review Required | Must Not Touch Now | Must Not Touch Now |
| CDI-015 | Review Required | Update Required | No Impact | No Impact | Review Required | Update Required | Review Required | Review Required | Must Not Touch Now | No Impact |
| CDI-016 | Review Required | Update Required | No Impact | No Impact | Review Required | Update Required | Update Required | Review Required | Must Not Touch Now | No Impact |
| CDI-017 | Review Required | Update Required | No Impact | No Impact | Review Required | Update Required | Review Required | Review Required | Must Not Touch Now | No Impact |
| CDI-018 | Review Required | Update Required | Review Required | Review Required | No Impact | Update Required | No Impact | No Impact | Must Not Touch Now | Must Not Touch Now |
| CDI-019 | Review Required | Update Required | No Impact | No Impact | Review Required | Update Required | Update Required | Review Required | Must Not Touch Now | No Impact |
| CDI-020 | Review Required | Update Required | Review Required | Must Not Touch Now | Must Not Touch Now | Review Required | Review Required | Review Required | Must Not Touch Now | Must Not Touch Now |
| CDI-021 | Review Required | Update Required | Review Required | Must Not Touch Now | Must Not Touch Now | Update Required | Update Required | Update Required | Must Not Touch Now | Must Not Touch Now |
| CDI-022 | Review Required | Update Required | Review Required | Must Not Touch Now | Must Not Touch Now | Update Required | Update Required | Update Required | Must Not Touch Now | Must Not Touch Now |
| CDI-023 | Review Required | Update Required | Review Required | Must Not Touch Now | Must Not Touch Now | Review Required | Review Required | Review Required | Must Not Touch Now | Must Not Touch Now |
| CDI-024 | Review Required | Update Required | Review Required | Must Not Touch Now | Must Not Touch Now | Review Required | Review Required | Review Required | Must Not Touch Now | Must Not Touch Now |
| CDI-025 | Review Required | Update Required | Review Required | Must Not Touch Now | Must Not Touch Now | Review Required | Review Required | Review Required | Must Not Touch Now | Must Not Touch Now |
| CDI-026 | Review Required | Update Required | Review Required | Must Not Touch Now | Must Not Touch Now | Review Required | Review Required | Review Required | Must Not Touch Now | Must Not Touch Now |
| CDI-027 | Review Required | Update Required | Review Required | Must Not Touch Now | Must Not Touch Now | Review Required | Review Required | Review Required | Must Not Touch Now | Must Not Touch Now |
| CDI-028 | Review Required | Update Required | Review Required | Must Not Touch Now | Must Not Touch Now | Review Required | Review Required | Review Required | Must Not Touch Now | Must Not Touch Now |
| CDI-029 | Review Required | Update Required | No Impact | Must Not Touch Now | Must Not Touch Now | Review Required | Review Required | Review Required | Must Not Touch Now | Must Not Touch Now |
| CDI-030 | Update Required | Update Required | No Impact | No Impact | No Impact | No Impact | No Impact | No Impact | No Impact | No Impact |
| CDI-031 | Review Required | Update Required | Review Required | Review Required | Review Required | Review Required | Review Required | Review Required | No Impact | No Impact |
| CDI-032 | Review Required | Update Required | Review Required | Review Required | Review Required | Update Required | Update Required | Update Required | Must Not Touch Now | Review Required |

---

## 5. Conflict / Duplication / Scope Check

### Duplicate / already covered

- CDI-001 is already covered by `runtime_sql_parity_matrix`, gap register, and test plan.
- CDI-002, CDI-004, and CDI-005 are covered by the Brand Slice 1 planning, mapping addendum, and gate review.
- CDI-006 is covered by README, Patch 002 documentation, and change log.
- CDI-010, CDI-013, and CDI-014 are partially covered by the deferred architecture/logic remediation plan.
- CDI-023 through CDI-026 are covered by the InPactAI near-term feature candidate document.
- CDI-027 is covered by Social Listening candidate backlog.

### Conflicts with prior decisions

- Frontend MVP now conflicts with README's current forbidden next steps.
- Auto-publishing now conflicts with Patch 002 and production NO-GO decisions.
- Billing/Stripe now conflicts with the rule that CostEvent is not a billing/invoice source.
- Full framework migration now conflicts with the current requirement to avoid broad runtime refactoring during DB-backed progression.
- Migration framework replacement now conflicts with the active strict migration order and migration retry verification gate.
- Python validators conflict with the JavaScript/Node runtime stack.

### Extended V1 / Post V1 scope leaking into Core V1

- Social Listening, Creator Marketplace, Trend Signals, Audience Insight Snapshots, and AI Brand Brain are not Core V1 implementation items.
- Keyword Suggestion for Brief may be a Core V1 candidate only after RFC and contract updates.
- Auto-publishing, billing, external bots, and automated outreach must remain Post V1 or rejected now.

### Sensitive source-of-truth impact

The following touch sensitive truth boundaries and must not be changed casually:

- UsageMeter and commercial usage truth.
- CostEvent and non-billing truth.
- AuditLog append-only evidence.
- ApprovalDecision and MediaAssetVersion hash coupling.
- ManualPublishEvidence proof immutability.
- workspace_id tenant boundary.
- Patch 002 contact/consent/performance/event data.

### SQL/OpenAPI before QA rule

Any proposal requiring SQL or OpenAPI changes must follow:

```text
Contract patch -> QA suite update -> implementation prompt -> runtime implementation
```

No item in this document authorizes SQL/OpenAPI changes.

### External inspiration versus project fit

- InPactAI, external OSS, competitive feature extraction, and Social Listening documents are idea sources or candidate backlogs only.
- No external project becomes a source of truth for Marketing OS.
- Direct code adoption from external repositories requires license, security, architecture, and contract review.

---

## 6. Go / No-Go Decision Per Item

| Item ID | Decision | Reason |
|---|---|---|
| CDI-001 | GO NOW | Keep as a governance gate; already documented and needed before runtime expansion. |
| CDI-002 | GO AFTER QA COVERAGE | Brand Slice 1 is the safest next implementation candidate, but must remain repository-only and tested. |
| CDI-003 | GO NOW | PR #36 must be refreshed/revalidated against current `main` before any merge decision. |
| CDI-004 | GO NOW | Preserve runtime route switch NO-GO to avoid split-brain behavior. |
| CDI-005 | GO NOW | Keep SQL/OpenAPI untouched unless a blocking contract gap is proven. |
| CDI-006 | GO NOW | Patch 002 DB persistence must remain NO-GO. |
| CDI-007 | GO NOW | Patch 003 / PR #24 stays Draft / NO-GO. |
| CDI-008 | GO NOW | Durable AuditLog must not be claimed without implementation. |
| CDI-009 | GO NOW | Usage and cost truth rules protect later AI/billing work. |
| CDI-010 | REJECT NOW | Python validator is wrong-stack and unsafe for current architecture. |
| CDI-011 | GO AFTER CONTRACT UPDATE | JS validation should be scoped to approved slices only. |
| CDI-012 | DEFER | Useful but not the current blocker. |
| CDI-013 | DEFER | Needs token/PII/escaping/audit contract first. |
| CDI-014 | DEFER | Needs idempotency and usage/cost policy first. |
| CDI-015 | DEFER | Useful infrastructure hardening; must be isolated from DB-backed PRs. |
| CDI-016 | DEFER | JWT needs transition plan and backward compatibility. |
| CDI-017 | REJECT NOW | Framework migration is too risky during persistence stabilization. |
| CDI-018 | REJECT NOW | Migration tool replacement risks breaking strict migration gate. |
| CDI-019 | REJECT NOW | Frontend over in-memory product truth is premature. |
| CDI-020 | IDEA ONLY | AI/Brand Brain remains Post-core idea. |
| CDI-021 | REJECT NOW | Auto-publishing carries external execution and reputation risk. |
| CDI-022 | REJECT NOW | Billing before usage truth maturity is financially unsafe. |
| CDI-023 | GO AFTER CONTRACT UPDATE | Keyword Suggestion can proceed as RFC only. |
| CDI-024 | DEFER | Account insight depends on V1 account analysis approval. |
| CDI-025 | DEFER | Trend Signals are Extended V1 only. |
| CDI-026 | IDEA ONLY | Creator Marketplace is RFC/discovery only. |
| CDI-027 | IDEA ONLY | Social Listening is candidate backlog, not Sprint scope. |
| CDI-028 | IDEA ONLY | Competitive extraction remains inspiration unless promoted. |
| CDI-029 | REJECT NOW | Bots/scraping/automated outreach are compliance and brand risks. |
| CDI-030 | GO NOW | Documentation reconciliation prevents stale implementation guidance. |
| CDI-031 | GO AFTER CONTRACT UPDATE | Codex instructions should be updated only when approved sources change. |
| CDI-032 | GO AFTER QA COVERAGE | QA must be slice-focused and aligned with approved contracts. |

---

## 7. Recommended PR Strategy

### PR 1: Conversation-derived priority plan only

Current PR.

Allowed files:

```text
docs/conversation_derived_proposal_and_fix_priority_plan.md
docs/17_change_log.md
```

Forbidden:

```text
src/**
test/**
docs/*.sql
docs/*.yaml
package.json
package-lock.json
.github/**
scripts/**
prototype/**
```

### PR 2: Current status reconciliation after PR #37 and PR #36 decision

Purpose:

- If PR #36 is merged later, reconcile README and status docs.
- If PR #36 is not merged or needs rework, record the decision.

Do not mix runtime code with this PR.

### PR 3: SQL/OpenAPI/QA alignment patch only if a real contract gap is discovered

Purpose:

- Only if implementation or review finds a blocking mismatch.
- Must update QA in the same contract sequence.

Do not include runtime implementation in this PR.

### PR 4: Runtime/repository implementation only after contract approval

Likely candidate:

- PR #36 or refreshed equivalent for repository-only Brand Slice 1.

Must not include:

- HTTP/runtime route switch.
- public get/update routes.
- SQL/OpenAPI changes.
- Campaign/Brief/Media/Approval/Publish/Evidence/Patch002 persistence.
- durable AuditLog claims.

### PR 5: Future features backlog only

Purpose:

- Capture Keyword Suggestion RFC.
- Capture Creator Marketplace RFC.
- Capture Social Listening promotion checklist.
- Keep all future items non-runtime.

Do not mix future backlog with Core V1 runtime changes.

### What must not be mixed in the same PR

```text
Do not mix docs reconciliation with runtime implementation.
Do not mix SQL/OpenAPI contract changes with runtime implementation.
Do not mix Brand Slice 1 with Campaign/Brief/Media persistence.
Do not mix validation/logging/rate limiting with DB-backed repository implementation.
Do not mix AI, auto-publishing, billing, or frontend with Core V1 backend stabilization.
Do not mix external feature extraction with approved source-of-truth changes.
```

---

## 8. Required Project Updates

| Area | Required Update? | Decision |
|---|---:|---|
| README.md | Later | Update only after PR #36 final decision or future status change. |
| docs/17_change_log.md | Yes | Add this documentation-only plan entry. |
| Codex implementation instructions | Later | Update only if execution sequence changes after PR #36 or contract updates. |
| QA suite | Later | Required only for approved implementation PRs or contract patches. |
| OpenAPI | Not now | Must not be touched by this plan. |
| SQL DDL | Not now | Must not be touched by this plan. |
| Backlog | Later | Update only after an item is promoted from candidate to approved scope. |
| Feature extraction documents | Later | May need cross-reference cleanup, but no runtime authority. |
| Runtime code | No | Must not be touched now. |
| Migrations | No | Must not be touched now. |
| Tests | No | Must not be touched by this documentation-only plan. |

---

## 9. Final Executive Recommendation

### What should be approved now?

Approve this document as the controlling register for conversation-derived proposals and fixes.

This approval does not authorize code.

### What should be executed first?

First execution decision should be about PR #36:

```text
Rebase/refresh PR #36 on current main.
Re-run strict verification.
Review changed files remain limited to repository-only Brand Slice 1.
Confirm no SQL/OpenAPI/runtime route switch.
Then decide merge/no-merge.
```

### What should be deferred?

Defer:

- General infrastructure hardening until Brand Slice 1 decision is settled.
- Environment validation until a small isolated PR.
- JS validation until the slice boundary is stable.
- Logging/health/rate limiting/CORS/security headers until separate PRs.
- Dynamic templating and retry logic until contracts exist.
- AI, frontend, auto-publishing, billing, Creator Marketplace, and Social Listening implementation.

### What should be rejected now?

Reject:

- Python `validators.py`.
- Framework migration now.
- Migration framework replacement now.
- Frontend now.
- Auto-publishing now.
- Billing/Stripe now.
- Bots/scraping/automated outreach as production behavior.
- Any direct external project code adoption without license/security/architecture review.

### Is there negative impact if these notes remain unorganized?

Yes. The negative impact is material:

1. Agents may treat future ideas as Core V1 tasks.
2. PRs may mix docs, contracts, SQL, OpenAPI, QA, and runtime in unsafe bundles.
3. The project may falsely claim DB-backed persistence, audit durability, or Pilot readiness.
4. External feature inspiration may override the contract-first model.
5. Cost, usage, approval, evidence, and tenant boundaries may be weakened.

### Is the project ready for new runtime implementation?

Only narrowly.

The project is not ready for broad runtime implementation or Sprint 5. It is ready only for a tightly bounded repository-only Brand Slice 1 decision path, assuming PR #36 is refreshed against current `main`, strict verification passes, and the gate constraints remain intact.

Final decision:

```text
GO: Documentation-only consolidation in this PR.
CONDITIONAL GO: Repository-only Brand Slice 1 after PR #36 refresh/revalidation.
NO-GO: Broad runtime implementation.
NO-GO: DB-backed full persistence.
NO-GO: Patch 002 DB persistence.
NO-GO: Sprint 5.
NO-GO: Pilot.
NO-GO: Production.
```
