# Marketing OS Rejected and Deferred Features

## Executive Rule

الرفض هنا ليس نقصًا في الطموح؛ بل حماية للمشروع من التحول إلى منتج غير قابل للتنفيذ.

---

## Rejected in Current Scope

### 1. Full ERP / Accounting

**Decision:** Reject

**Reason:**
- خارج نطاق Marketing OS.
- يخلق التزامات محاسبية ومالية لا يحتاجها المنتج.
- يمكن التكامل مع أدوات خارجية لاحقًا عند الحاجة.

---

### 2. Internal Chat System

**Decision:** Reject

**Reason:**
- تقليد Mattermost خطأ تنفيذي.
- قيمة المشروع ليست في المحادثات.
- يكفي Notification + Webhook Integration.

---

### 3. Copying erxes Architecture

**Decision:** Reject

**Reason:**
- Microservices وGraphQL federation وmicro-frontends وplugin complexity أكبر من حاجة V1.
- يزيد زمن التنفيذ والتشغيل.
- يخلق صعوبة testing وdebugging.
- توجد مخاطر قانونية وترخيصية.

---

### 4. Full Bidirectional Sync

**Decision:** Reject in V1

**Reason:**
- يخلق تضاربًا في مصدر الحقيقة.
- صعب المعالجة عند اختلاف الحالة بين الأنظمة.

**Allowed alternative:**
```text
Read-only sync
Append-only events
Manual reconciliation
Explicit ownership rules
```

---

### 5. Full CRM

**Decision:** Post V1

**Reason:**
- يغير هوية المنتج.
- Marketing OS يحتاج CRM-lite فقط في البداية:
  - Contact
  - Consent
  - Lead Capture
  - Campaign Attribution

---

### 6. Full Commerce Core

**Decision:** Post V1 or separate service

**Reason:**
- Commerce Core يتطلب product/order/payment/settlement domains.
- هذا يخلق تعقيدًا ماليًا وتشغيليًا.
- إذا احتجنا التجارة، الأفضل Medusa كخدمة مستقلة أو Connector.

---

### 7. Full CMS Inside Marketing OS

**Decision:** Reject

**Reason:**
- Marketing OS ليس CMS عامًا.
- يمكن استخدام Strapi خارجيًا عند الحاجة.
- المحتوى التشغيلي للحملات يبقى داخل Marketing OS.

---

### 8. Plugin Marketplace

**Decision:** Post V1

**Reason:**
- يحتاج security sandboxing.
- يحتاج version compatibility.
- يحتاج permissions model.
- يحتاج review/approval للplugins.
- غير ضروري قبل إثبات المنتج.

---

### 9. Omnichannel Inbox

**Decision:** Post V1

**Reason:**
- قد يحول المنتج إلى customer support platform.
- يحتاج إدارة رسائل، SLA، routing، privacy، moderation.
- لا يدخل قبل إثبات أن الردود جزء أساسي من القيمة.

---

### 10. Workflow Automation Builder

**Decision:** Post V1

**Reason:**
- يحتاج engine، retries، DLQ، visual builder، permissions.
- في Core V1 يكفي predefined workflows.

---

## Deferred but Acceptable Later

| الخاصية | المرحلة المحتملة | شرط العودة |
|---|---|---|
| Strapi CMS Integration | Extended V1 | حاجة محتوى عامة |
| Mattermost/Slack Alerts | Extended V1 | حاجة تنبيهات خارجية |
| CRM Sync | Extended V1 | حوكمة consent/contact ownership |
| Commerce Connector | Extended/Post V1 | وجود use case campaign-to-order |
| Asset Performance Comparison | Extended V1 | توفر بيانات أداء |
| Experiment Lite | Extended V1 | وجود traffic كافٍ |
| Full Plugin System | Post V1 | وجود ecosystem وteam |
| Advanced Attribution | Post V1 | نضج البيانات |
| MMM/Uplift | Post V1 | حجم بيانات وتجارب كافٍ |

---

## Governance Warning

أي محاولة لإدخال الخصائص المرفوضة داخل Core V1 يجب أن تمر بقرار معماري جديد، لأن أثرها ليس إضافة شاشة فقط، بل تغيير في الدومين والتشغيل والمخاطر القانونية.
