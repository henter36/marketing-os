# Competitive Feature Extraction and Fit-Gap

**Project:** Marketing OS  
**Document type:** Competitive feature extraction + controlled fit-gap matrix  
**Status:** Reference document only — not an approved implementation backlog  
**Created for:** Marketing OS execution governance  

---

## 1. Executive Decision

This document converts the extracted features from the reviewed open-source projects into a controlled fit-gap matrix for Marketing OS.

**Decisive conclusion:** these projects validate the strategic direction of Marketing OS, but they also expose a major scope-risk: Marketing OS can easily drift into a broad CRM + CMS + Commerce + ERP + Collaboration suite. That drift must be rejected for V1.

Marketing OS must remain focused on:

1. Campaign creation and preparation.
2. AI-assisted content and asset generation.
3. Approval integrity and governed publishing preparation.
4. Usage and cost governance.
5. Attribution and performance evidence.
6. Tenant isolation, RBAC, auditability, and immutable evidence.

Any feature that does not strengthen those six areas must be deferred, integrated externally, or rejected.

---

## 2. Sources Reviewed

The following projects were used as reference inputs:

| Project | Repository | Product Family |
|---|---|---|
| erxes | https://github.com/erxes/erxes | Experience Operating System / CRM / Marketing / Support / Automation |
| Medusa | https://github.com/medusajs/medusa.git | Headless Commerce / Commerce Modules |
| Strapi | https://github.com/strapi/strapi.git | Headless CMS / Content Operations |
| IDURAR ERP CRM | https://github.com/idurar/idurar-erp-crm.git | ERP / CRM / Invoicing |
| Frappe CRM | https://github.com/frappe/crm.git | CRM / Pipeline / Sales Operations |
| NextCRM | https://github.com/pdovhomilja/nextcrm-app.git | CRM / AI Enrichment / Vector Search / Audit |
| Mattermost | https://github.com/mattermost/mattermost.git | Secure Collaboration / ChatOps / Playbooks |

---

## 3. Governance Boundary

This document is not an implementation approval.

### 3.1 What this document is

- A structured extraction of useful competitive patterns.
- A fit-gap assessment against Marketing OS.
- A decision filter for future backlog grooming.
- A risk-control layer to prevent uncontrolled scope expansion.

### 3.2 What this document is not

- It is not a Sprint 3 scope document.
- It is not an API contract.
- It is not an ERD source of truth.
- It is not a license approval for copying code.
- It does not authorize new entities, endpoints, or workflows.

### 3.3 Non-negotiable implementation rule

No feature from this document may enter code unless it is later approved in:

1. Scope document.
2. Backlog.
3. ERD/data contract.
4. OpenAPI contract.
5. QA test suite.

---

## 4. Classification Model

Each extracted capability is classified using one of five decisions:

| Decision | Meaning | Implementation posture |
|---|---|---|
| Adopt | Directly valuable and aligned with Marketing OS core | Candidate for approved backlog after contract update |
| Adapt | Valuable pattern, but must be redesigned for Marketing OS governance | Requires controlled redesign before backlog entry |
| Integrate | Should remain outside Marketing OS core and be connected through an integration layer | Connector/interface only |
| Defer | Valuable but premature for V1 | Extended V1 or Post V1 |
| Reject | Misaligned, high-risk, or scope-expanding | Do not implement |

---

## 5. Project-Level Feature Extraction

## 5.1 erxes

**Product family:** Experience Operating System combining CRM, marketing, support, operations, automation, and extensibility.

### Extracted feature groups

| Area | Features |
|---|---|
| Core platform | Workspace graph, plugins, permissions, notifications, contacts, products, segments, documents |
| Omnichannel support | Unified inbox, web chat, WhatsApp, Messenger, Instagram, email, routing, SLA, canned replies |
| Sales | Pipelines, deal stages, Kanban/list/calendar/timeline views, forecasting, lead capture, follow-up sequences |
| Marketing | Segmentation, campaign tracking, automation, growth workflows |
| Operations | Tasks, projects, workflow monitoring, resource coordination |
| Content | Knowledge base, help center, content publishing patterns |
| AI | Agent-like drafting, classification, summarization, model-agnostic provider thinking |
| Automation | Triggers, conditions, actions, branching, delays, versioning, workflow observability |

### Fit-gap for Marketing OS

| Feature / pattern | Decision | Fit | Risk if copied directly | Recommended use |
|---|---|---|---|---|
| Workspace graph | Adapt | High | Can become too broad and hard to govern | Use only for Marketing OS entities: Workspace, Campaign, Brief, Asset, Variant, Approval, PublishJob, ReportSnapshot |
| Plugin architecture | Adapt | Medium | Premature extensibility can destabilize V1 | Use internal modular boundaries, not public plugin marketplace |
| Omnichannel inbox | Defer | Medium | Turns Marketing OS into support platform | Post V1 or external integration |
| Segmentation | Adapt | High | May conflict with consent/privacy if rushed | Add only after Privacy & Consent and data-source governance |
| Workflow automation | Adopt/Adapt | Very high | Unsafe automation can bypass approvals | Use governed workflows with approval gates and audit events |
| AI agents | Defer | Medium | Operational and reputational risk | Post V1 behind strict FeatureGate |
| Customer 360 | Adapt | High | Can over-collect data | Build Campaign/Customer context view with privacy boundaries |

### Executive conclusion

Use erxes as a reference for **workspace graph, automation, and customer/campaign context**, not as a model for expanding Marketing OS into a full XOS.

---

## 5.2 Medusa

**Product family:** Headless commerce framework and commerce module system.

### Extracted feature groups

| Area | Features |
|---|---|
| Commerce core | Products, carts, orders, payments, customers, inventory, promotions, tax |
| Product catalog | Products, variants, categories, collections, product availability |
| Pricing | Multi-currency, price lists, customer groups, regional pricing, dynamic/context pricing |
| Inventory | Multi-warehouse, stock locations, reservations, inventory by channel |
| Fulfillment | Shipping methods, fulfillment providers, fulfillment workflows |
| Sales channels | Product availability and order context per channel |
| Workflows | Durable workflows, custom flows, third-party integration flows |
| Integrations | ERP sync, analytics, external modules |

### Fit-gap for Marketing OS

| Feature / pattern | Decision | Fit | Risk if copied directly | Recommended use |
|---|---|---|---|---|
| Product catalog model | Integrate | High | Marketing OS becomes commerce source of truth | Read-only Commerce Connector |
| Variant/pricing/inventory model | Integrate | High | Price/inventory truth conflict | Store snapshots only for campaign context |
| Sales channels | Adapt | High | Confusion between commerce channel and marketing channel | Convert to Marketing Channel Profile |
| Durable workflows | Adapt | Very high | Workflow engine scope creep | Use pattern for CampaignGenerationWorkflow and approval-safe operations |
| Orders/payments/fulfillment | Reject for Marketing OS core | Low | Turns product into commerce backend | Keep outside Marketing OS |
| Promotions | Adapt | Medium | Promotional liability and pricing truth risk | Use as campaign input only, not financial source |

### Executive conclusion

Medusa is valuable as a **Commerce Connector reference**. Marketing OS should read commerce data, not own commerce truth.

---

## 5.3 Strapi

**Product family:** Headless CMS and content operations system.

### Extracted feature groups

| Area | Features |
|---|---|
| Content modeling | Visual content type builder, structured content schemas |
| APIs | Auto-generated REST/GraphQL APIs |
| Permissions | Granular roles and permissions |
| Media | Media library and asset management |
| Localization | i18n and multi-language content |
| Publishing | Draft and publish lifecycle |
| Extensibility | Plugin system and customizable admin |
| AI support | AI-assisted modeling, translation, alt text patterns |

### Fit-gap for Marketing OS

| Feature / pattern | Decision | Fit | Risk if copied directly | Recommended use |
|---|---|---|---|---|
| Content modeling | Adapt | High | Generic CMS scope creep | Use only for campaign templates, brand content, channel variants |
| Media library | Adopt/Adapt | Very high | If mutable, can break asset evidence | Must be versioned and immutable after approval/evidence |
| Draft/publish | Adapt | High | Can conflict with approval integrity | Replace with Marketing OS approval states |
| i18n | Defer/Adapt | Medium | Adds complexity early | Arabic-first + locale field; deeper i18n later |
| Plugin system | Defer | Medium | Premature platformization | Not for V1 |
| Auto-generated APIs | Reject | Low | Conflicts with controlled OpenAPI contract | Do not use as contract model |

### Executive conclusion

Strapi is useful as a **content and media governance reference**, but Marketing OS must not become a generic CMS.

---

## 5.4 IDURAR ERP CRM

**Product family:** ERP/CRM with invoicing, quotes, payments, customer records, and basic accounting patterns.

### Extracted feature groups

| Area | Features |
|---|---|
| CRM | Customer management |
| Sales documents | Quotes and invoices |
| Payments | Payment tracking and status |
| Accounting basics | Simple ERP/accounting flows |
| UI | Admin-style screens for invoices, customers, and payments |
| Deployment | Self-hosted MERN stack pattern |

### Fit-gap for Marketing OS

| Feature / pattern | Decision | Fit | Risk if copied directly | Recommended use |
|---|---|---|---|---|
| Customer management | Defer/Integrate | Medium | Duplicates CRM systems | Integrate with CRM connector later |
| Quotes/invoices | Reject for core | Low | Expands into ERP | Not part of Marketing OS core |
| Payment tracking | Reject for core | Low | Billing/accounting scope creep | Only use SaaS subscription billing later if approved |
| Simple admin UI patterns | Adapt | Medium | UI may not match governance model | Use as visual reference only |
| ERP/accounting | Reject | Low | Major compliance and operational burden | Exclude from Marketing OS |

### License warning

IDURAR uses AGPL-3.0. Do not copy code or integrate it into a proprietary commercial product without legal review.

### Executive conclusion

IDURAR is weak fit for Marketing OS core. It is useful only as a simple UI/ERP reference and should not shape V1 architecture.

---

## 5.5 Frappe CRM

**Product family:** CRM focused on leads, deals, pipeline management, communications, and ERPNext integration.

### Extracted feature groups

| Area | Features |
|---|---|
| Lead management | Lead records, lead stages, lead details |
| Deal management | Pipelines, stages, Kanban |
| Record page | All-in-one page for activities, comments, notes, tasks |
| Views | Custom filters, sorting, columns, saved views |
| Communications | Calls, WhatsApp, comments, activity tracking |
| ERP integration | ERPNext integration for downstream commercial operations |

### Fit-gap for Marketing OS

| Feature / pattern | Decision | Fit | Risk if copied directly | Recommended use |
|---|---|---|---|---|
| All-in-one record page | Adopt/Adapt | Very high | Low if scoped correctly | Use for Campaign, Brief, Asset, PublishJob, ReportSnapshot pages |
| Activity timeline | Adopt | Very high | Low | Core governance UX pattern |
| Kanban pipeline | Adapt | Medium | Could oversimplify approval state machine | Use for campaign status views, not as source of truth |
| Custom views | Defer/Adapt | Medium | Query complexity and permissions risk | Extended V1 after RBAC is mature |
| Calls/WhatsApp | Defer | Low/Medium | Turns product into CRM communications tool | External integration only |
| ERPNext integration | Reject for core | Low | ERP scope creep | Not part of Marketing OS |

### Executive conclusion

Frappe CRM contributes strong UX patterns: **record page, timeline, custom views, and Kanban**. These are valuable if mapped to Marketing OS entities, not CRM entities.

---

## 5.6 NextCRM

**Product family:** Modern CRM with activities, audit history, invoicing, documents, AI enrichment, vector search, MCP, and self-hosting.

### Extracted feature groups

| Area | Features |
|---|---|
| CRM entities | Accounts, contacts, leads, opportunities, contracts, targets |
| Activities | Notes, calls, emails, meetings, tasks linked to entities |
| Audit/history | Field-level history, soft delete, restore, global audit log, before/after diffs |
| Documents | Upload, download, link/unlink, document storage |
| Email | IMAP/SMTP client, templated email delivery |
| Invoicing | Multi-currency invoices, receipts, credit notes, PDF, payment status |
| AI enrichment | Browser research, AI confidence scoring, enriched profiles |
| API key hierarchy | Environment, admin, and user-level API keys, encrypted at rest |
| Vector search | pgvector, semantic search, keyword + semantic search |
| MCP server | AI tools exposed to agents |
| Projects/campaigns | Boards, steps, stats, reports |

### Fit-gap for Marketing OS

| Feature / pattern | Decision | Fit | Risk if copied directly | Recommended use |
|---|---|---|---|---|
| Global audit log | Adopt | Very high | Low; required | Core governance requirement |
| Field-level history | Adapt | High | Storage and noise if overused | Apply to sensitive entities only |
| Before/after diffs | Adopt/Adapt | High | PII/data leakage if logs are not controlled | Use for approval, asset metadata, config changes |
| Soft delete/restore | Adapt | Medium | Can conflict with immutability | Use only for non-evidence objects |
| AI confidence scoring | Adopt/Adapt | Very high | False precision if not defined | Use confidence_score with clear calculation/meaning |
| Encrypted API key hierarchy | Adopt | Very high | Low; security-critical | Required for provider/connector credentials |
| Vector search | Defer/Adapt | Medium/High | Premature complexity | Extended V1 for campaigns/assets/search |
| MCP server | Defer | Medium | Agent access risk | Post V1 behind strict scopes |
| AI browser research | Defer | Medium | Cost/legal/safety risk | Post V1 only |
| Invoicing | Reject for core | Low | ERP/billing scope creep | Not part of Marketing OS except SaaS billing later |

### Executive conclusion

NextCRM is one of the closest references for Marketing OS governance patterns. The strongest transferable ideas are **audit history, confidence scoring, encrypted keys, vector search, and controlled AI access**.

---

## 5.7 Mattermost

**Product family:** Secure collaboration, messaging, ChatOps, playbooks, workflows, and enterprise collaboration governance.

### Extracted feature groups

| Area | Features |
|---|---|
| Messaging | Channels, private channels, direct messages, threaded conversations |
| Access control | RBAC, audit logs, need-to-know collaboration |
| Notifications | Mentions, alerts, muting, channel notifications |
| ChatOps | Slash commands, bots, webhooks, system alerts |
| Knowledge continuity | Search, pinned posts, bookmarks |
| Playbooks | Checklists, tasks, due dates, status updates, retrospectives, metrics |
| Calls | Voice calls, screen sharing, transcription patterns |
| Boards | Kanban boards, cards, assignments, labels, checklists |
| AI | Thread summarization, action extraction, RAG, semantic search |
| Integrations | GitHub, GitLab, Jira, ServiceNow, Jenkins, PagerDuty, calendar, Zoom, webhooks |
| Compliance | Export, retention, legal hold, auditability |

### Fit-gap for Marketing OS

| Feature / pattern | Decision | Fit | Risk if copied directly | Recommended use |
|---|---|---|---|---|
| Playbooks | Adapt | High | Can become generic task manager | Use as campaign review/publish checklist pattern |
| Comments/review notes | Adopt | High | Low if auditable | Add to approvals and assets |
| Notifications | Adapt | Medium/High | Noise and permission leakage | Use event-based notifications with RBAC checks |
| Chat platform | Reject for core | Low | Massive scope expansion | Integrate with Mattermost/Slack/Teams later |
| ChatOps | Defer | Medium | Unsafe operational commands | Post V1 with strict scopes |
| Boards | Defer/Adapt | Medium | Duplicates project management | Optional status view, not core |
| Compliance patterns | Adopt/Adapt | High | Implementation cost | Apply audit/export/retention concepts where relevant |
| AI summarization | Defer | Medium | Hallucination and governance risk | Later, only for internal summaries |

### Executive conclusion

Mattermost should influence **operational collaboration and playbooks**, not become an embedded chat platform inside Marketing OS.

---

## 6. Consolidated Capability Map

## 6.1 CRM and Customer Operations

### Extracted capabilities

- Contacts.
- Accounts.
- Leads.
- Deals/opportunities.
- Customers.
- Targets.
- Pipelines.
- Kanban.
- Activity timelines.
- Notes, calls, emails, meetings, tasks.
- Customer 360.
- Lead capture forms.
- Landing pages and popups.
- Sequences.
- Forecasting.
- Win probability.

### Fit decision

| Capability | Decision | Reason |
|---|---|---|
| Activity timeline | Adopt | Directly supports auditability and review context |
| Campaign/Customer context view | Adapt | Useful but must respect privacy and consent |
| Leads/deals CRM | Integrate/Defer | Better handled by CRM connector |
| Full CRM | Reject for core | Dilutes Marketing OS scope |
| Forecasting/win probability | Defer | Not needed before reliable performance and attribution data |

---

## 6.2 Marketing and Growth

### Extracted capabilities

- Campaign management.
- Campaign tracking.
- Segments.
- Automation.
- Lead routing.
- Outbound sequences.
- Forms.
- Landing pages.
- Popups.
- Performance tracking.
- AI-drafted follow-ups.
- Content planning.
- Reports and statistics.

### Fit decision

| Capability | Decision | Reason |
|---|---|---|
| Campaign management | Adopt | Core to Marketing OS |
| Campaign tracking | Adopt | Core to attribution/performance layer |
| Segments | Adapt | Must be governed by privacy/consent |
| Automation | Adapt | Must not bypass approval gates |
| Landing pages/forms | Defer/Integrate | Useful but not required for controlled V1 |
| AI follow-ups | Defer | Risky without communication consent and review flow |

---

## 6.3 Content and Media

### Extracted capabilities

- Content-type builder.
- Headless CMS.
- Media library.
- Draft and publish lifecycle.
- i18n.
- Knowledge base.
- Document storage.
- PDF generation.
- Email templates.
- AI alt text.
- AI translation.
- AI content modeling.

### Fit decision

| Capability | Decision | Reason |
|---|---|---|
| Media library | Adopt/Adapt | Essential, but must be versioned and evidence-safe |
| Draft workflow | Adapt | Must map to approval workflow, not generic CMS publishing |
| Content templates | Adopt/Adapt | Useful for brand and channel consistency |
| i18n | Defer | Arabic-first is enough for early controlled scope |
| Generic CMS | Reject for core | Too broad |
| Knowledge base | Defer | Not core to campaign generation |

---

## 6.4 Commerce

### Extracted capabilities

- Product catalog.
- Variants.
- Categories.
- Pricing.
- Multi-currency.
- Promotions.
- Cart.
- Checkout.
- Orders.
- Inventory.
- Reservations.
- Stock locations.
- Fulfillment.
- Shipping.
- Payments.
- Tax.
- Regions.
- Sales channels.
- Product availability by channel.
- ERP integration.

### Fit decision

| Capability | Decision | Reason |
|---|---|---|
| Product catalog read | Integrate | Required for product-to-campaign generation |
| Variants/prices/inventory read | Integrate | Useful campaign context; not source of truth |
| Product snapshot for campaigns | Adopt/Adapt | Needed to preserve historical campaign context |
| Orders/payments/fulfillment | Reject for core | Commerce platform responsibility |
| Sales channels | Adapt | Convert to Marketing Channel Profile |
| ERP integration | Defer/Reject | Not part of Marketing OS V1 |

---

## 6.5 Workflow and Automation

### Extracted capabilities

- Visual workflows.
- Triggers.
- Conditions.
- Actions.
- Branching.
- Delays.
- SLA guards.
- Workflow versioning.
- Workflow observability.
- Durable execution.
- Checklists.
- Playbooks.
- Automated status updates.
- Retrospectives.
- Metrics.
- Integration triggers.

### Fit decision

| Capability | Decision | Reason |
|---|---|---|
| Governed campaign workflow | Adopt/Adapt | Directly supports system integrity |
| Approval-safe triggers | Adopt/Adapt | Must preserve human-in-the-loop |
| Visual workflow builder | Defer | Premature complexity |
| Playbooks/checklists | Adapt | Useful for review and publish readiness |
| Automated publishing | Reject for V1 | Explicitly outside current approved guardrails |
| Workflow observability | Adopt/Adapt | Supports debugging and audit |

### Recommended Marketing OS workflow pattern

```text
Brief
  -> GenerationJob
  -> Provider call
  -> Usage/cost event
  -> Guardrail evaluation
  -> MediaAssetVersion
  -> ApprovalDecision
  -> ChannelVariant
  -> PublishJob preparation
  -> ManualPublishEvidence
  -> PerformanceEvent
  -> ReportSnapshot
```

This pattern is a conceptual reference only. It must match the approved ERD, SQL DDL, OpenAPI, Backlog, and QA suite before implementation.

---

## 6.6 AI, Agents, and Search

### Extracted capabilities

- AI agents.
- AI draft suggestions.
- Summarization.
- Classification.
- Decisioning.
- Tool-use loops.
- Browser sandbox research.
- Company/contact enrichment.
- Confidence scoring.
- API key hierarchy.
- Model-agnostic providers.
- Local/cloud LLM support.
- Semantic search.
- Vector embeddings.
- RAG.
- MCP server.
- AI-accessible business tools.

### Fit decision

| Capability | Decision | Reason |
|---|---|---|
| AI generation jobs | Adopt | Core capability already aligned with Marketing OS |
| Model routing | Adapt | Must be cost-aware, auditable, and deterministic enough for operations |
| Confidence scoring | Adopt/Adapt | Useful for approval and QA; formula must be defined |
| Semantic search | Defer/Adapt | Useful later for campaign/asset retrieval |
| RAG | Defer | Requires knowledge governance and data isolation |
| MCP server | Defer | Agent access risk; Post V1 only |
| Autonomous agents | Reject for V1 | High governance and reputation risk |
| Browser research agents | Defer | Legal, cost, and reliability concerns |

---

## 6.7 Collaboration and Operations

### Extracted capabilities

- Channels.
- Threads.
- Direct messages.
- Notifications.
- Mentions.
- Bookmarks.
- Pinned items.
- Boards.
- Tasks.
- Due dates.
- Assignments.
- Status updates.
- Calls.
- Screen sharing.
- Incident workflows.
- Team resources.
- Projects.
- Cycles.

### Fit decision

| Capability | Decision | Reason |
|---|---|---|
| Comments/review notes | Adopt | Needed for approval context |
| Assignments | Adapt | Useful if tied to review/publish workflow |
| Notifications | Adapt | Must respect tenant/RBAC boundaries |
| Boards | Defer | Nice to have; not launch-critical |
| Chat platform | Reject for core | Massive non-core scope |
| Calls/screen sharing | Reject | Outside product purpose |

---

## 6.8 Governance, Security, and Compliance

### Extracted capabilities

- RBAC.
- Audit logs.
- Permissions.
- Legal hold.
- Export.
- Data retention.
- API tokens.
- Encrypted API keys.
- Soft delete.
- Restore.
- Field-level history.
- Compliance exports.
- Self-hosting.
- Air-gapped deployment.
- Secure webhooks.
- Admin settings.

### Fit decision

| Capability | Decision | Reason |
|---|---|---|
| RBAC | Adopt | Non-negotiable |
| Tenant isolation | Adopt | Non-negotiable |
| Audit logs | Adopt | Non-negotiable |
| Immutable evidence | Adopt | Non-negotiable |
| Encrypted API keys | Adopt | Required for commercial SaaS connectors/providers |
| Field-level history | Adapt | Apply to critical entities only |
| Soft delete | Adapt | Must not apply to immutable evidence/content snapshots |
| Compliance export | Defer/Adapt | Valuable for enterprise readiness |
| Legal hold | Defer | Enterprise feature, not V1 unless required |

---

## 7. Adopt / Adapt / Integrate / Defer / Reject Matrix

## 7.1 Adopt

These are directly aligned with Marketing OS and can become backlog candidates after contract review.

| Capability | Inspired by | Why it matters |
|---|---|---|
| Activity timeline | Frappe CRM, NextCRM | Gives reviewers and admins full operational context |
| Global audit log | NextCRM, Mattermost | Required for governance and dispute protection |
| Approval comments/review notes | Frappe CRM, Mattermost | Supports approval integrity |
| Media asset library with versioning | Strapi, NextCRM | Required for reusable assets and approved versions |
| Campaign management | erxes, NextCRM | Core product capability |
| Report snapshots | Marketing OS internal need; supported by audit/report patterns | Protects historical truth |
| Encrypted provider/connector keys | NextCRM | Required for commercial-grade security |
| Usage/cost visibility | Marketing OS internal need; supported by platform governance patterns | Prevents uncontrolled AI spend |

## 7.2 Adapt

These are valuable but must be redesigned for Marketing OS governance.

| Capability | Inspired by | Adaptation required |
|---|---|---|
| Workflow automation | erxes, Medusa, Mattermost | Must preserve approval gates, idempotency, audit, and error model |
| Workspace graph | erxes | Limit to Marketing OS entities only |
| Campaign/customer context view | erxes, Frappe CRM | Apply privacy and consent boundaries |
| Sales channel model | Medusa | Convert to Marketing Channel Profile |
| Draft/publish lifecycle | Strapi | Convert to approval-driven states |
| Kanban/status views | Frappe CRM, Mattermost | View only; not source of truth |
| Field-level history | NextCRM | Apply to sensitive entities only |
| Playbooks/checklists | Mattermost | Use for review and publish readiness only |
| Confidence scoring | NextCRM | Define clear formula and avoid false precision |
| Notifications | Mattermost | Must be RBAC/tenant safe |

## 7.3 Integrate

These should stay outside the Marketing OS core.

| Capability | Source type | Integration posture |
|---|---|---|
| Commerce product catalog | Medusa, Shopify, WooCommerce, custom stores | Read-only connector |
| Product variants/prices/inventory | Commerce systems | Read-only connector with campaign snapshot |
| CRM contacts/leads | erxes, Frappe CRM, NextCRM, external CRMs | Connector only |
| Support inbox data | erxes/Mattermost/external support tools | Optional connector later |
| ERP/accounting records | IDURAR/Frappe/ERP systems | Connector only if commercial reporting requires it later |

## 7.4 Defer

These are useful but premature.

| Capability | Reason for deferral |
|---|---|
| Visual workflow builder | Heavy complexity before core workflows stabilize |
| Omnichannel inbox | Converts product into support/CRM platform |
| Semantic/vector search | Useful after enough campaign/assets data exists |
| RAG over workspace data | Requires mature data governance and isolation |
| MCP server | Agent access creates high permission risk |
| AI browser research | Cost, legal, reliability, and hallucination risk |
| Custom views at scale | RBAC/query complexity must mature first |
| Legal hold/compliance export | Enterprise feature; later unless required by buyer |
| Landing page builder | Useful, but not required for controlled V1 |

## 7.5 Reject

These should not enter Marketing OS core.

| Capability | Reason for rejection |
|---|---|
| Full ERP | Not Marketing OS; creates accounting/compliance burden |
| Full commerce backend | Marketing OS should integrate with commerce, not become commerce |
| Full chat/collaboration platform | Massive non-core product expansion |
| Automated publishing in V1 | Violates human-in-the-loop and approved guardrails |
| Paid media execution in V1 | Explicitly outside current approved scope |
| Autonomous agents in V1 | High operational and reputational risk |
| Auto-generated API model | Conflicts with controlled OpenAPI governance |
| Generic CMS platform | Dilutes focus from governed marketing execution |

---

## 8. Recommended Marketing OS Feature Candidates

The following are the strongest candidates for future backlog consideration.

| Priority | Candidate | Decision | Required before implementation |
|---:|---|---|---|
| 1 | Activity Timeline for Campaign/Asset/Approval/PublishJob | Adopt | ERD + API + audit event definitions |
| 2 | Commerce Connector Layer | Integrate | Connector contract + snapshot model + tenant isolation tests |
| 3 | Brand/Content Media Layer | Adapt | MediaAssetVersion immutability + approval workflow |
| 4 | Campaign Workflow Orchestration | Adapt | Idempotency, ErrorModel, audit, retries, QA cases |
| 5 | Encrypted Provider/Connector Credential Store | Adopt | Security model + RBAC + audit + rotation policy |
| 6 | AI Confidence Score | Adapt | Score definition + display rules + no false precision |
| 7 | Review Playbook / Approval Checklist | Adapt | ApprovalPolicy mapping + UI states |
| 8 | Marketing Channel Profile | Adapt | Channel constraints + variant rules + no auto-publish |
| 9 | Report Snapshot Export | Adopt | Snapshot schema + immutability + evidence linkage |
| 10 | Semantic Search for Campaigns/Assets | Defer/Adapt | Data volume + pgvector design + tenant isolation |

---

## 9. Proposed Future Entities — Not Approved Yet

The following are proposed concepts only. They must not be added to code until approved through ERD/OpenAPI/Backlog.

| Proposed concept | Purpose | Status |
|---|---|---|
| MarketingChannelProfile | Define platform/channel constraints and variant rules | Proposed |
| CommerceConnector | Represent external commerce source configuration | Proposed |
| CommerceProductSnapshot | Preserve product/price/inventory context at campaign creation time | Proposed |
| ActivityTimelineEvent | Consolidated event stream for UI timeline | Proposed |
| ReviewChecklistItem | Structured approval/playbook checks | Proposed |
| CredentialSecretRef | Reference encrypted connector/provider keys without exposing values | Proposed |
| AIConfidenceSignal | Store confidence sub-signals, not only a single score | Proposed |
| SearchEmbeddingIndex | Semantic search index for campaigns/assets | Proposed / Deferred |

---

## 10. Risk Register

| Risk | Severity | Description | Control |
|---|---:|---|---|
| Scope explosion | Critical | CRM + CMS + Commerce + ERP + Collaboration features can consume the product | Adopt strict V1 boundaries and reject non-core features |
| Source-of-truth conflict | Critical | Commerce price/inventory/order truth may conflict with Marketing OS snapshots | Read-only connectors and immutable campaign snapshots |
| Approval bypass | Critical | Automation can publish or approve without human control | Human-in-the-loop, approval gates, audit events |
| Evidence mutability | Critical | Manual publish evidence or report snapshots can be altered after the fact | Immutable content/evidence model with limited invalidation metadata only |
| License contamination | High | Some repos may use licenses incompatible with proprietary reuse | Do not copy code without legal review |
| Data privacy overreach | High | Customer 360 and segmentation can over-collect personal data | Consent boundaries, minimization, RBAC, retention controls |
| AI hallucination | High | AI-generated suggestions may be treated as factual or compliant | Confidence score, guardrails, review, audit trail |
| Cost leakage | High | AI/model/connectors can create uncontrolled usage cost | UsageMeter, CostEvent, FeatureGate, quota enforcement |
| Permission leakage | High | Notifications/search/timelines can expose cross-tenant data | Tenant isolation tests and RBAC checks at API/query level |
| Operational complexity | Medium/High | Visual workflows, agents, and integrations increase failure modes | Defer advanced automation; add workflow observability later |

---

## 11. Explicit Exclusions for Current Implementation

The following must remain excluded unless separately approved:

1. Full CRM.
2. Full ERP.
3. Full commerce backend.
4. Full CMS platform.
5. Full chat/collaboration platform.
6. Autonomous AI agents.
7. MCP server access.
8. Paid execution.
9. Auto-publishing.
10. AI browser research agents.
11. Visual workflow builder.
12. Accounting, invoicing, and settlement logic.
13. Generic plugin marketplace.

---

## 12. Sprint Impact Guidance

This document must not change the current sprint scope by itself.

### 12.1 Current sprint rule

If Sprint 3 is in progress, do not add any feature from this document unless it is already present in the approved Sprint 3 sources.

Approved Sprint source hierarchy remains:

1. Authoritative OpenAPI.
2. Approved Backlog.
3. QA suite.
4. ERD/SQL DDL.
5. Contract patch files.
6. Implementation reports only as status references, not scope authority.

### 12.2 Future backlog grooming rule

Before moving any feature into backlog, produce:

- Business value statement.
- Governance risk statement.
- Affected entities.
- API endpoints.
- Permissions.
- Audit events.
- Error states.
- QA cases.
- Explicit V1/Extended V1/Post V1 classification.

---

## 13. Recommended Next Actions

1. Keep this document as a reference, not an implementation instruction.
2. Create a separate backlog grooming document for only the top 5 candidates:
   - Activity Timeline.
   - Commerce Connector Layer.
   - Marketing Channel Profile.
   - Review Playbook / Approval Checklist.
   - Encrypted Provider/Connector Credential Store.
3. Do not touch code until those candidates are mapped to ERD, OpenAPI, Backlog, and QA.
4. For any repo with AGPL or unclear licensing, perform legal review before reuse.
5. Add a rule to future implementation prompts: competitive references may inform design but may not override approved sources.

---

## 14. Final Decision

**Decision:** Use these projects as controlled design references only.

**Go condition for using any extracted feature:** the feature must strengthen Marketing OS core execution without expanding the product into CRM, CMS, Commerce, ERP, or Collaboration as standalone systems.

**No-Go condition:** any feature that requires new unapproved entities, endpoints, autonomous actions, paid execution, auto-publishing, or financial/commercial source-of-truth behavior must be rejected or deferred.

**Transition decision:** The next valid step is backlog grooming for selected candidates, not coding.
