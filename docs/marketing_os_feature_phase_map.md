# Marketing OS Feature Phase Map

## Executive Phase Decision

يتم توزيع الخصائص على مراحل صارمة حتى لا يتحول Marketing OS إلى مشروع متضخم.

---

## Phase 0 — Foundation & Governance

### الهدف
تثبيت الأساس الذي يمنع الفوضى قبل بناء الخصائص.

### يدخل في Phase 0

| العنصر | سبب إدخاله مبكرًا |
|---|---|
| Workspace Context | أساس عزل المستأجرين |
| Users / Roles / RBAC | منع تضارب الصلاحيات |
| Audit Logs | إثبات كل فعل مؤثر |
| Error Model | توحيد أخطاء API |
| Feature Gates | التحكم في الخصائص حسب الخطة |
| Usage Metering Base | قياس الاستخدام من البداية |
| Connector Security Model | منع تخزين الأسرار بشكل خاطئ |
| Evidence Immutability Rules | حماية أدلة النشر |
| Source of Truth Register | تحديد من يملك كل نوع بيانات |

### مخرجات Phase 0

- جداول workspaces/users/roles/permissions/audit_logs.
- سياسات RBAC.
- ErrorModel موحد.
- قواعد immutable evidence.
- قرار واضح بشأن مصادر الحقيقة.
- أساس connector credentials المشفر.

---

## Core V1 — Executable Marketing Loop

### الهدف
إطلاق دورة تسويق كاملة قابلة للتشغيل والقياس.

```text
Understand → Plan → Generate → Review → Publish → Measure → Learn
```

### يدخل في Core V1

| الخاصية | سبب الإدخال |
|---|---|
| Campaign Workspace | لا توجد حملة دون مركز تشغيل |
| Campaign Brief | مدخل التخطيط |
| Brand Rule Set | حماية المحتوى |
| Content Templates | توحيد إنتاج المحتوى |
| AI Generation Jobs | تتبع التوليد والتكلفة |
| Media Asset Library | حفظ وإدارة الأصول |
| Asset Versioning | منع نشر نسخة خاطئة |
| Approval Workflow | منع النشر غير المعتمد |
| Publishing Evidence | إثبات النشر |
| Basic Connectors | التكامل المنضبط |
| Tracking Links / UTM | قياس المصدر |
| Performance Events | قياس الأداء |
| Metric Confidence Score | تمييز جودة الرقم |
| CRM-lite Contacts | ربط الاستجابات بالحملة دون CRM كامل |
| Notifications | تنبيهات الموافقة والفشل |
| Audit Events | إثبات تشغيلي وقانوني |

### لا يدخل في Core V1

- Full CRM
- Full Commerce
- Full CMS
- Plugin Marketplace
- Workflow Builder
- Omnichannel Inbox
- Full Chat
- ERP/Accounting

---

## Extended V1 — Controlled Integrations & Optimization

### الهدف
توسيع النواة بعد إثبات عمل Core V1.

### يدخل في Extended V1

| الخاصية | شرط الإدخال |
|---|---|
| Strapi CMS Integration | وجود حاجة فعلية لمحتوى صفحات/مقالات/landing pages |
| Mattermost/Slack Alerts | إذا احتاج الفريق تنبيهات خارج التطبيق |
| CRM Sync | بعد تثبيت contact ownership وconsent |
| Commerce Connector | إذا كانت الحملات مرتبطة بمنتجات وطلبات |
| Asset Performance Comparison | بعد توفر بيانات أداء كافية |
| Experiment Lite | بعد وجود traffic وvariants قابلة للمقارنة |
| Connector Retry/DLQ Advanced | بعد زيادة التكاملات الخارجية |

---

## Post V1 — Strategic Expansion

### يدخل لاحقًا فقط

| الخاصية | سبب التأجيل |
|---|---|
| Full Plugin System | يحتاج أمن وإصدارات وعقود امتداد |
| Omnichannel Inbox | يغير نطاق المنتج |
| Full CRM | يتطلب sales domain كامل |
| Full Commerce Core | يتطلب order/payment/settlement governance |
| Advanced Attribution | يحتاج بيانات كبيرة |
| MMM / Uplift Modeling | يحتاج نضج قياس وتجارب |
| Workflow Automation Builder | يحتاج engine كامل |
| Custom Mattermost App | لا حاجة قبل إثبات alert integration |

---

## Rejected for Current Project Scope

| الخاصية | القرار |
|---|---|
| ERP / Accounting | Reject |
| Internal Chat System | Reject |
| Shared DB with External Tools | Reject |
| Copy erxes Architecture | Reject |
| Full Bidirectional Sync | Reject |
| Strapi as Operational Core | Reject |
| CRM as Campaign Core | Reject |
| Commerce as Marketing Core | Reject |

---

## Phase Gate Rules

### Phase 0 Go Criteria

- تم تعريف RBAC.
- تم تعريف ErrorModel.
- تم تعريف audit_logs.
- تم تعريف source of truth لكل دومين.
- تم تعريف connector secret policy.
- تم تعريف immutable evidence policy.

### Core V1 Go Criteria

- يمكن إنشاء حملة.
- يمكن توليد محتوى.
- يمكن فحصه حوكميًا.
- يمكن اعتماده.
- يمكن نشره أو تسجيل دليل نشره.
- يمكن قياس أدائه.
- يمكن تتبع كل خطوة audit.

### Extended V1 Go Criteria

- Core V1 يعمل دون اختراقات مصدر الحقيقة.
- توجد حاجة تشغيلية مثبتة للتكامل.
- يوجد owner واضح للتكامل.
- يوجد rollback/retry/error handling.

### Post V1 Go Criteria

- وجود بيانات كافية.
- وجود فريق تشغيل وصيانة.
- وجود مراجعة أمنية.
- وجود مراجعة قانونية.
- وجود مبرر ربحي أو تشغيلي واضح.
