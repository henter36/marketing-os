# Marketing OS Competitive Features Scope

## Executive Decision

The approved decision is to use the reviewed open-source projects as sources of product, workflow, integration, and governance patterns only. They must not be copied or embedded as full systems inside Marketing OS.

Marketing OS must remain a governed marketing operating system, not a CRM, ERP, commerce core, chat platform, generic CMS, or plugin marketplace.

The controlling product loop is:

```text
Understand → Plan → Generate → Review → Publish → Measure → Learn
```

Any feature that does not directly support this loop is deferred or rejected.

---

## 1. Features Approved for Core V1

| Feature | Inspiration | Reason | Decision |
|---|---|---|---|
| Campaign Workspace | erxes / Frappe CRM / NextCRM | Central operating space for campaign, brief, channels, assets, approvals, and metrics | Core V1 |
| Brand & Content Governance | Strapi / erxes | Prevent unlawful, misleading, off-brand, or reputationally risky content | Core V1 |
| Content Template System | Strapi | Reusable controlled content structures | Core V1 |
| Asset Library with Versioning | Strapi / NextCRM | Ensure approved and published assets are traceable by version | Core V1 |
| AI Generation Job System | NextCRM / erxes patterns | Track prompt, model, provider, result, cost, latency, guardrails, and acceptance | Core V1 |
| Approval Workflow | Mattermost / Frappe CRM | Prevent unapproved publishing | Core V1 |
| Publishing Evidence Layer | Mattermost / Medusa eventing pattern | Prove what was published, where, when, by whom, and from which asset version | Core V1 |
| Basic Connector Layer | Strapi / Medusa / Mattermost | Enable safe integrations without allowing external systems to own Marketing OS state | Core V1 |
| Performance Event Tracking | Medusa / erxes analytics pattern | Measure campaign results and asset/channel performance | Core V1 |
| CRM-lite Contact Layer | Frappe CRM / NextCRM | Link campaign responses to contacts without building a full CRM | Core V1 limited |
| Notifications | Mattermost | Operational notifications for approvals, publishing failures, and connector problems | Core V1 |
| Audit Logs & Evidence Integrity | Governance pattern | Protect legal, operational, and reputational accountability | Core V1 |

---

## 2. Features Approved for Extended V1

| Feature | Inspiration | Reason for Deferral |
|---|---|---|
| Strapi CMS Integration | Strapi | Useful for public content, but not required to launch the marketing execution core |
| Mattermost / Slack Alert Integration | Mattermost | External alerting is useful after internal notification rules exist |
| CRM Sync | Frappe CRM | Requires contact ownership, consent, and source-of-truth rules |
| Commerce Connector | Medusa | Required only if campaign-to-order attribution becomes a real use case |
| Asset Performance Comparison | NextCRM / analytics patterns | Useful after enough performance data exists |
| Experiment Lite | Analytics pattern | Requires variants, traffic, and measurable outcomes |

---

## 3. Features Approved for Post V1

| Feature | Reason for Deferral |
|---|---|
| Full Plugin System | Requires extension contracts, security sandboxing, versioning, marketplace governance, and plugin permissions |
| Omnichannel Inbox | Would shift the product toward support/customer engagement |
| Full CRM | Would shift the product toward CRM/Revenue OS |
| Full Commerce Core | Would introduce product, inventory, order, payment, and settlement domains |
| Workflow Automation Builder | Requires engine, retry, error handling, DLQ, visual builder, monitoring, and permissions |
| Advanced Attribution / MMM / Uplift Modeling | Requires mature data volume and experimentation discipline |
| Custom Mattermost Plugin | Not justified before simple alert integration proves value |

---

## 4. Rejected Features

| Feature | Reason |
|---|---|
| Full ERP / Accounting | Outside Marketing OS scope |
| Internal Chat System | Build notifications and integrate with Mattermost/Slack instead |
| Copying erxes Architecture | Excessive complexity and licensing/operational risk for V1 |
| Full Bidirectional Sync | Creates source-of-truth conflicts |
| Shared Database with External Systems | Breaks domain boundaries and increases security risk |
| Strapi as Campaign Source of Truth | Strapi may own public content, not campaign operations |
| CRM as Campaign Source of Truth | CRM may own sales/contact context, not campaign operations |
| Commerce as Marketing Source of Truth | Commerce may own orders, not marketing execution state |

---

## 5. Non-Negotiable Boundaries

1. Marketing OS is the source of truth for campaigns, briefs, generated outputs, assets, approvals, publishing jobs, publishing evidence, performance normalization, and audit logs.
2. Strapi, if used, is a content service only.
3. Medusa, if used, is a commerce/order reference service only.
4. CRM, if used, is a contact/sales reference service only.
5. Mattermost or Slack, if used, are notification channels only.
6. No asset may be published unless the exact asset version is approved.
7. Publishing evidence must be append-only; corrections use invalidation/supersede events.
8. Audit logs must be append-only.
9. AI usage must not be counted as successful commercial usage when generation fails or produces unusable output.
10. No external system may directly mutate approval, evidence, or audit truth.
