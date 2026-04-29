# Future Technical and Business Ideas Fit / Gap

## Document Status

```text
Document type: Future idea fit/gap register
Runtime changes: NO
SQL changes: NO
OpenAPI changes: NO
QA/test changes: NO
Migration changes: NO
Package/workflow changes: NO
Current implementation authority: NO
Future planning authority: YES, subject to RFC/contract approval
```

This document captures technical, business, AI, security, compliance, DevOps, and marketplace ideas raised after the conversation-derived priority plan.

It must not be used to add features to the current implementation stream. It exists to preserve the ideas while preventing premature scope expansion into Core V1.

---

## 1. Executive Decision

The submitted ideas are valuable as a future roadmap and competitive idea bank. They are not safe to implement in the current execution path.

Current project priority remains:

```text
1. Resolve current documentation/status control after PR #38.
2. Rebase/revalidate PR #36 if it remains the Brand Slice 1 implementation candidate.
3. Keep Brand Slice 1 repository-only unless separately approved.
4. Do not switch HTTP/runtime product routes.
5. Do not add SQL/OpenAPI/QA/runtime changes from this document.
```

Final decision:

```text
GO: Preserve these ideas in this fit/gap document.
GO: Use this document later to create RFCs.
NO-GO: Add these ideas to current execution.
NO-GO: Merge these ideas into PR #38 or any active implementation PR.
NO-GO: Treat any item here as Core V1 without contract evidence.
```

---

## 2. Fit / Gap Classification Summary

| Category | Overall Decision | Reason |
|---|---|---|
| Event-driven architecture | Needs RFC | Useful later, but must use governed domain events and outbox rather than unreliable in-memory eventing. |
| Webhooks/events | Needs RFC | Requires idempotency, signing, retry, delivery logs, and outbox. |
| GraphQL | Reject now | Adds a second API contract before REST/OpenAPI/runtime stability. |
| Bulk operations | Defer | Requires idempotency, partial failure model, transaction policy, and rate controls. |
| Async export | Future candidate | Useful once job model, storage, permissions, and audit are stable. |
| Read replicas / PgBouncer | Defer | Operational scaling concern after DB-backed runtime load exists. |
| CDN for assets | Defer | Requires storage contract and asset lifecycle maturity. |
| Smart Brief Generator | Idea / RFC later | Valuable, but must wait for Brand/Brief DB truth, UsageMeter, CostEvent, PromptVersion, and review controls. |
| Content Variants AI | Post V1 | Requires asset/versioning, A/B data, metering, and approval workflow. |
| Auto-Compliance Checker | Future candidate | Better governance fit, but depends on DB-backed MediaAssetVersion and BrandVoiceRules. |
| Predictive Budgeting | Post V1 | Requires reliable historical cost/performance data. |
| Sentiment Analysis | Idea only | Overlaps Social Listening and requires data/provider governance. |
| @Mentions / comments | Defer | Collaboration feature after ReviewTask/notification maturity. |
| Multi-step approvals | Defer | Requires workflow model and approval state machine contract. |
| Campaign Calendar | Defer | UI/workflow feature after backend truth stabilizes. |
| Version Diff | Future candidate | Governance-aligned, but depends on BriefVersion/MediaAssetVersion persistence. |
| Real-time dashboard | Defer | No live metrics before stable performance data truth. |
| Cohort analysis / attribution | Post V1 | Requires reliable LeadCapture, PerformanceEvent, and attribution contracts. |
| Forecasting | Post V1 | Requires historical data and model governance. |
| CRM / ad platform integrations | Defer | Requires connector credentials, OAuth, provider policies, rate limits, and audit. |
| Design tool integrations | Idea only | Useful later after DAM/storage model. |
| Slack / Teams notifications | Future candidate | Narrow outbound notification may be useful later, but not current scope. |
| Data retention | Needs governance RFC | Must not delete or mutate AuditLog truth casually. |
| PII detection/masking | Future candidate | Useful compliance layer after data domains are stable. |
| Encryption / mTLS / TDE | Infrastructure future | Deployment/security architecture later. |
| SOC 2 kit | Documentation future | Useful for compliance readiness, not current code. |
| Consent Management Platform | Defer | Large privacy domain; current consent models must mature first. |
| OpenAPI code generation | Defer | Useful after OpenAPI contracts stabilize. |
| API Playground | Future candidate | Docs/developer experience item, lower risk if isolated. |
| Feature flags | Future candidate | Useful, but not before runtime paths are controlled. |
| Chaos engineering | Reject now | Premature before production-grade deployment. |
| OpenTelemetry / Prometheus | Defer | Useful after stable runtime and deployment target. |
| Marketing OS Marketplace | Idea Bank only | Major business-model expansion; must be separate RFC and likely Post V1. |

---

## 3. Detailed Item Register

| ID | Idea | Fit | Gap / Risk | Required Future Action | Decision |
|---|---|---|---|---|---|
| FTB-001 | Event Bus / Event-driven architecture | Strong architectural fit later | In-memory or Redis Pub/Sub alone cannot guarantee audit-grade reliability | Create `domain_events_and_outbox_rfc.md` | Needs RFC |
| FTB-002 | Redis Pub/Sub for internal events | Limited operational fit | Message loss and no transactional guarantee if used as source of truth | Use only as delivery optimization after outbox | Reject now |
| FTB-003 | MediaJob.succeeded -> auto-create MediaAsset | Logical domain event | Requires MediaJob and MediaAssetVersion DB-backed truth and idempotency | Defer until media persistence | Defer |
| FTB-004 | ApprovalDecision.approved -> notify reviewers | Reasonable event | Requires approval persistence, notification rules, and audit trail | Defer until approval/notification maturity | Defer |
| FTB-005 | Campaign.state_changed -> update metrics | Reasonable event | Requires campaign state transition persistence and metric snapshot policy | Defer until campaign persistence | Defer |
| FTB-006 | Customer webhooks | Valuable platform feature | Requires signing, retries, delivery logs, endpoint verification, secret management | Webhooks RFC after outbox | Needs RFC |
| FTB-007 | Workspace Templates | Agency value | Risk of copying historical truth and tenant-sensitive data | RFC separating config templates from historical records | Defer |
| FTB-008 | Cross-workspace reporting | Enterprise/admin value | High tenant isolation and privacy risk | Super-admin reporting RFC with aggregated snapshots only | Defer strict |
| FTB-009 | GraphQL endpoint beside REST | Frontend flexibility | Second contract surface before REST/OpenAPI stability | Revisit after frontend and stable REST | Reject now |
| FTB-010 | Bulk media job operations | Productivity feature | Needs batch idempotency, partial failure model, limits, and transactional policy | Bulk operations RFC | Defer |
| FTB-011 | Async audit export | Good fit later | Needs job model, storage_ref, permissions, audit trail | Export job RFC | Future candidate |
| FTB-012 | Read replicas | Scalability | No proven read load yet; product routes not fully DB-backed | Defer to ops scaling plan | Defer |
| FTB-013 | PgBouncer | Scalability | Infra dependency before operational need | Defer to deployment architecture | Defer |
| FTB-014 | CDN for assets | Good future DAM/storage fit | Requires storage contract, asset lifecycle, and signed URL policy | Storage/CDN RFC | Defer |
| FTB-015 | Smart Brief Generator | Strong product value | Too broad before Brand/Brief DB truth and AI cost governance | Start with brief keyword/angle suggestion RFC, not full generator | Idea / RFC later |
| FTB-016 | Content Variants AI | Strong marketing value | Needs A/B data, asset versioning, review, metering | Post V1 AI content RFC | Post V1 |
| FTB-017 | Auto-Compliance Checker | Strong governance fit | Needs DB-backed BrandVoiceRules and MediaAssetVersion | Future compliance checker RFC | Future candidate |
| FTB-018 | Predictive Budgeting | Business value | Needs historical spend/performance truth | Post V1 forecasting RFC | Post V1 |
| FTB-019 | Sentiment Analysis | Useful intelligence | Overlaps Social Listening; provider/language accuracy concerns | Fold into Social Listening or analytics RFC | Idea only |
| FTB-020 | @Mentions in ReviewTasks | Collaboration value | Requires notification and comment model | Collaboration RFC | Defer |
| FTB-021 | Multi-step approval workflows | Enterprise value | Requires workflow state machine, RBAC, audit, SLA rules | Approval workflow RFC | Defer |
| FTB-022 | Campaign Calendar | UX value | Requires stable campaign/publish timelines | Frontend/workflow backlog later | Defer |
| FTB-023 | Version Diff | Governance value | Depends on BriefVersion/MediaAssetVersion persistence and immutable snapshots | Version diff RFC after versioned domains are DB-backed | Future candidate |
| FTB-024 | Real-time dashboard | Competitive differentiation | Live UI before reliable DB metrics creates false truth | Defer until metrics snapshots are stable | Defer |
| FTB-025 | Cohort analysis | Analytics value | Needs LeadCapture and identity/event model maturity | Post V1 analytics RFC | Post V1 |
| FTB-026 | Attribution modeling | Strategic value | Must not be introduced before performance and lead data contracts are mature | Post V1 attribution RFC | Post V1 |
| FTB-027 | Forecasting | Strategic value | Requires enough historical data and model governance | Post V1 analytics/model RFC | Post V1 |
| FTB-028 | CRM connectors | Commercial value | OAuth/secrets/rate limits/provider terms/audit required | Connector RFC after credential model maturity | Defer |
| FTB-029 | Ad platform connectors | Commercial value | High external execution/reporting risk | Defer until reporting and connector governance mature | Defer |
| FTB-030 | Canva/Figma integrations | UX value | Asset ownership/storage/versioning unresolved | Idea bank | Idea only |
| FTB-031 | Slack/Teams notifications | Narrow integration candidate | Requires notification delivery policy | Future notification RFC | Future candidate |
| FTB-032 | Data retention policies | Compliance need | AuditLog deletion may violate append-only truth | Legal retention/archival/redaction RFC | Needs RFC |
| FTB-033 | PII detection and masking | Strong compliance value | Requires data classification and field policy | PII policy RFC | Future candidate |
| FTB-034 | Encryption at rest / transit | Security value | Deployment/infrastructure concern | Security architecture plan | Defer |
| FTB-035 | SOC 2 compliance kit | Compliance value | Documentation/control evidence work, not product runtime | Compliance docs backlog | Future documentation |
| FTB-036 | Consent Management Platform | Privacy value | Large domain, overlaps Patch 002 consent models | Consent strategy RFC | Defer |
| FTB-037 | OpenAPI code generation | DevEx value | Should wait until contracts stabilize | Later DX task | Defer |
| FTB-038 | API Playground | Low-risk DevEx | Could be docs-only or dev-only later | Isolated docs/dev PR later | Future candidate |
| FTB-039 | Feature flags | Operational value | Must not be used to hide unapproved runtime paths | Feature flag RFC after runtime paths stabilize | Future candidate |
| FTB-040 | Chaos engineering | Resilience value much later | Premature for current repo stage | Revisit after staging/production environment exists | Reject now |
| FTB-041 | OpenTelemetry / Prometheus | Observability value | Needs stable deployment and runtime surfaces | Observability RFC later | Defer |
| FTB-042 | Marketing OS Marketplace | Potential revenue stream | Major product/business-model expansion and marketplace risk | Separate marketplace strategy RFC | Idea Bank only |
| FTB-043 | Templates Marketplace | Possible marketplace subdomain | Requires marketplace, payments, moderation, licensing | Marketplace RFC only | Idea Bank only |
| FTB-044 | AI Prompts Marketplace | Possible revenue stream | Prompt IP, quality, abuse, payment risks | Marketplace RFC only | Idea Bank only |
| FTB-045 | Connector Marketplace | Platform ecosystem idea | Requires external developer program and security review | Marketplace/platform RFC only | Idea Bank only |
| FTB-046 | Analytics Plugins | Platform idea | Requires plugin sandbox, security, schema boundaries | Marketplace/platform RFC only | Idea Bank only |

---

## 4. Priority Order

### Near-term documentation only

1. Preserve this fit/gap document.
2. Do not merge these ideas into active implementation PRs.
3. Use this document only to create future RFCs.

### First possible RFCs later

1. `domain_events_and_outbox_rfc.md`
2. `brief_keyword_angle_suggestion_rfc.md`
3. `template_system_scope_rfc.md`
4. `async_export_job_rfc.md`
5. `notification_delivery_integration_rfc.md`

### Hard deferrals

1. GraphQL.
2. Real-time dashboard.
3. Full AI content generation.
4. Marketplace.
5. Auto-publishing and paid execution.
6. Billing/invoicing.
7. Advanced attribution / forecasting.

---

## 5. Scope Controls

These ideas must not be added to current Core V1 implementation unless a later approved RFC explicitly promotes them.

```text
No runtime implementation from this file.
No SQL changes from this file.
No OpenAPI changes from this file.
No QA changes from this file.
No package/dependency changes from this file.
No workflow changes from this file.
No deployment changes from this file.
```

Any future implementation must follow:

```text
RFC -> Contract impact -> ERD/SQL/OpenAPI if needed -> QA plan -> Implementation prompt -> Runtime PR
```

---

## 6. Rejected-Now Items

| Item | Reason |
|---|---|
| GraphQL now | Adds a second API contract before REST/OpenAPI and DB-backed runtime are stable. |
| Redis Pub/Sub as event source of truth | Not audit-grade and not transactionally reliable. |
| Framework/runtime architecture expansion inside current stream | Would hide DB persistence defects. |
| Full marketplace implementation | Business-model expansion, trust/safety, payments, moderation, and compliance risks. |
| Auto-publishing now | External execution and brand/reputation risk before approval/publish/evidence maturity. |
| Billing/invoicing now | Financial source-of-truth risk before usage/cost truth is mature. |
| Chaos engineering now | Premature before staging/production infrastructure exists. |
| AuditLog deletion as simple retention | Conflicts with append-only audit truth unless legally governed archival/redaction is designed. |
| Bulk operations now | Unsafe without idempotency, rate limits, and partial failure model. |
| Real-time editing now | Collaboration subsystem too broad for current execution phase. |

---

## 7. Final Recommendation

Approve this file only as a future ideas register.

Do not execute these items now. The correct current path remains:

```text
1. Keep PR #38 as merged planning control.
2. Rebase/revalidate PR #36 if it remains active.
3. Decide Brand Slice 1 repository-only merge readiness.
4. Reconcile documentation after PR #36 decision.
5. Only then consider the first future RFC, preferably domain events/outbox or brief keyword suggestion.
```

Final decision:

```text
GO: Future ideas fit/gap documentation.
NO-GO: Current implementation.
NO-GO: Core V1 promotion without RFC and contract approval.
NO-GO: Mixing these ideas with Brand Slice 1, Patch 002, Patch 003, or Sprint 5.
```
