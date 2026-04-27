# Marketing OS Integration Boundaries

## Executive Rule

أي تكامل خارجي يجب أن يكون محكومًا بحدود واضحة. لا يسمح لأي نظام خارجي أن يصبح مصدر حقيقة للحملات، الموافقات، الأصول، النشر، أو القياس التسويقي داخل Marketing OS.

---

## 1. Source of Truth Register

| Domain | Source of Truth | External Systems Allowed? | Rule |
|---|---|---|---|
| Workspace | Marketing OS | No | داخلي فقط |
| Users/RBAC | Marketing OS / SSO | Yes, via SSO | لا صلاحيات تشغيلية خارجية دون mapping |
| Campaigns | Marketing OS | No | لا CRM ولا CMS يملك حقيقة الحملة |
| Campaign Briefs | Marketing OS | No | داخلي |
| Brand Rules | Marketing OS | No | داخلي |
| Content Templates | Marketing OS | Optional CMS read | النسخة التشغيلية داخل Marketing OS |
| Media Assets | Marketing OS | Optional external storage | metadata والنسخ داخل Marketing OS |
| Approval Decisions | Marketing OS | No | داخلي وغير قابل للتجاوز |
| Publish Jobs | Marketing OS | External publish APIs allowed | القرار والحالة داخل Marketing OS |
| Publish Evidence | Marketing OS | External URL allowed | الدليل محفوظ داخليًا |
| Performance Events | Marketing OS | External sources allowed | يتم ingest ثم normalize |
| Contacts | Marketing OS CRM-lite | CRM sync later | ownership واضح |
| Orders | Commerce System such as Medusa | Read-only into Marketing OS | لا يصبح Marketing OS مصدر order truth |
| CMS Content | Strapi if used | Yes | Strapi للمحتوى العام فقط |
| Notifications | Marketing OS + external channel | Yes | Mattermost/Slack قنوات فقط |

---

## 2. Strapi Boundary

### Allowed
- Landing pages
- Blog posts
- FAQ
- Static content
- Public campaign pages
- Media delivery when needed

### Not Allowed
- Campaign truth
- Approval truth
- Performance truth
- Billing truth
- User permission truth
- Evidence truth

### Integration Pattern
- API Integration
- Optional webhook on content publish
- Read-only import into Marketing OS where needed

### Phase
- Extended V1

---

## 3. Medusa Boundary

### Allowed
- Product reference
- Order reference
- Commerce attribution reference
- Campaign-to-order analytics
- Read-only product/order data for reporting

### Not Allowed
- Marketing OS must not own inventory
- Marketing OS must not own payment
- Marketing OS must not own settlement
- Marketing OS must not own order lifecycle

### Integration Pattern
- API Integration
- Webhook Integration for order events
- Data Sync read-only or append-only events

### Phase
- Extended V1 if commerce is required
- Post V1 if commerce is not part of early product

---

## 4. Frappe CRM / External CRM Boundary

### Allowed
- Push qualified leads
- Pull contact status
- Sync consent status if needed
- Campaign source attribution

### Not Allowed
- CRM cannot approve content
- CRM cannot rewrite campaign state
- CRM cannot override consent without audit
- CRM cannot become campaign source of truth

### Integration Pattern
- API Integration
- Data Sync
- Permissions Mapping
- Consent Mapping

### Phase
- Extended V1

---

## 5. Mattermost / Slack Boundary

### Allowed
- Approval requested notification
- Publishing failed alert
- Connector token expired alert
- Campaign performance anomaly alert
- Operational incident channel

### Not Allowed
- No workflow state in Mattermost
- No approvals as source of truth via chat only
- No sensitive asset leak to public channels
- No chat system inside Marketing OS

### Integration Pattern
- Webhook Integration
- Bot token if necessary
- Signed payloads

### Phase
- Extended V1 for external alerts
- Core V1 only supports internal notification model

---

## 6. erxes Boundary

### Allowed
- Source of design ideas only:
  - unified inbox pattern
  - customer timeline pattern
  - plugin architecture pattern
  - modular admin pattern

### Not Allowed
- No direct adoption in V1
- No shared DB
- No copying architecture
- No micro-frontend/federation adoption in Core V1
- No erxes as CRM core without legal and operational review

### Phase
- Ideas only / Post V1 reconsideration

---

## 7. IDURAR Boundary

### Allowed
- Invoice UI ideas
- Quote flow ideas
- Customer/payment status ideas

### Not Allowed
- No production dependency
- No ERP/accounting import into Marketing OS
- No AGPL code copy without legal review

### Phase
- Ideas only

---

## 8. Integration Technical Requirements

Every integration must define:

- Auth method
- Credential storage
- API rate limits
- Retry policy
- Failure mode
- Webhook signature validation
- Dead letter handling
- Permissions mapping
- Audit events
- Monitoring
- Data ownership
- Delete/deactivation policy
- Tenant isolation

---

## 9. Forbidden Integration Patterns

- Shared database with external systems
- Direct foreign keys to external system tables
- Bidirectional sync without ownership rules
- Treating webhook payload as trusted without signature
- Storing API secrets unencrypted
- External system writing directly to approval/evidence tables
- Using external status as final status without validation
