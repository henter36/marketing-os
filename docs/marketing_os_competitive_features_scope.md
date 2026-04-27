# Marketing OS Competitive Features Scope

## Executive Decision

القرار الحاسم: يتم اعتماد الخصائص المناسبة من المشاريع المفتوحة المصدر كأنماط تصميم ومعمارية، وليس كنسخ أو دمج مباشر للكود.

Marketing OS يجب أن يبقى نظام تشغيل تسويقي، وليس:
- CRM كامل
- ERP
- Commerce Core
- Chat Platform
- CMS عام
- Plugin Marketplace

الدورة الحاكمة للمشروع:

```text
Understand → Plan → Generate → Review → Publish → Measure → Learn
```

أي خاصية لا تخدم هذه الدورة بشكل مباشر لا تدخل Core V1.

---

## 1. Features Approved for Core V1

| الخاصية | مصدر الإلهام | سبب الاعتماد | القرار |
|---|---|---|---|
| Campaign Workspace | erxes / Frappe CRM / NextCRM | مركز تشغيل الحملة وربط الأهداف والأصول والقنوات | Core V1 |
| Brand & Content Governance | Strapi / erxes | منع المحتوى المخالف قانونيًا أو تجاريًا أو سمعةً | Core V1 |
| Content Template System | Strapi | إنتاج محتوى قابل للتكرار والحوكمة | Core V1 |
| Asset Library with Versioning | Strapi / NextCRM | ضبط نسخ الأصول وربطها بالموافقة والنشر | Core V1 |
| AI Generation Job System | NextCRM / erxes patterns | تتبع التوليد والتكلفة والنموذج والنتيجة | Core V1 |
| Approval Workflow | Mattermost / Frappe CRM | منع النشر غير المعتمد | Core V1 |
| Publishing Evidence Layer | Mattermost / Medusa eventing pattern | إثبات النشر وربطه بالأصل والقناة | Core V1 |
| Basic Connector Layer | Strapi / Medusa / Mattermost | تكامل خارجي آمن دون تضخم | Core V1 |
| Performance Event Tracking | Medusa / erxes analytics pattern | قياس أثر الحملة | Core V1 |
| CRM-lite Contact Layer | Frappe CRM / NextCRM | ربط الاستجابات التسويقية بجهات اتصال دون CRM كامل | Core V1 محدود |
| Notifications | Mattermost | تنبيهات تشغيلية وموافقات وفشل النشر | Core V1 |
| Audit Logs & Evidence Integrity | Governance pattern | حماية قانونية وتشغيلية | Core V1 |

---

## 2. Features Approved for Extended V1

| الخاصية | مصدر الإلهام | سبب التأجيل |
|---|---|---|
| Strapi CMS Integration | Strapi | مفيدة للمحتوى، لكنها ليست شرطًا لإطلاق النواة |
| Mattermost / Slack Alert Integration | Mattermost | يمكن البدء بتنبيهات داخلية ثم ربط خارجي لاحقًا |
| CRM Sync | Frappe CRM | يحتاج قواعد ownership وconsent وsource of truth |
| Commerce Connector | Medusa | لا يدخل إلا إذا كان الربط بين الحملة والطلب مطلوبًا فعليًا |
| Asset Performance Comparison | NextCRM / analytics patterns | مفيد للتحسين، لكنه ليس شرطًا لتشغيل الدورة الأساسية |
| Experiment Lite | Growth/analytics pattern | يؤجل حتى تتوفر بيانات أداء كافية |

---

## 3. Features Approved for Post V1

| الخاصية | سبب التأجيل |
|---|---|
| Full Plugin System | يحتاج عقود امتداد وأمن sandboxing وإدارة إصدارات |
| Omnichannel Inbox | يحول المنتج إلى support/customer engagement platform |
| Full CRM | يغير هوية المنتج إلى CRM/Revenue OS |
| Full Commerce Core | يخلق تضاربًا في المنتج والطلب والدفع والتسوية |
| Workflow Automation Builder | يحتاج engine متقدم وretry وdead letters واختبارات |
| Advanced Attribution / MMM / Uplift Modeling | يحتاج بيانات كبيرة ونضج قياس قبل الاعتماد |
| Custom Mattermost Plugin | غير ضروري قبل إثبات حاجة التنبيهات الخارجية |

---

## 4. Rejected Features

| الخاصية | سبب الرفض |
|---|---|
| Full ERP / Accounting | خارج نطاق Marketing OS |
| Internal Chat System | لا يبنى؛ يستخدم تكامل خارجي عند الحاجة |
| Copying erxes Architecture | تعقيد زائد ورخصة ومخاطر تشغيلية |
| Full Bidirectional Sync | يخلق تضارب مصدر الحقيقة |
| Shared Database with External Systems | خطر أمني وتشغيلي ويفسد حدود الدومين |
| Strapi as Campaign Source of Truth | Strapi للمحتوى فقط وليس للحملات والموافقات |
| CRM as Campaign Source of Truth | CRM للمبيعات أو العملاء، وليس لحقيقة الحملة |
| Commerce as Marketing Source of Truth | Commerce مصدر الطلبات فقط، وليس تشغيل التسويق |

---

## 5. Non-Negotiable Boundaries

1. Marketing OS هو مصدر الحقيقة للحملات والأصول والموافقات والنشر والقياس التسويقي.
2. Strapi إن استخدم فهو مصدر محتوى خارجي فقط.
3. Medusa إن استخدم فهو مصدر حقيقة للتجارة والطلبات فقط.
4. CRM إن استخدم فهو مصدر مبيعات/جهات اتصال فقط.
5. Mattermost/Slack إن استخدما فهما قنوات تنبيه فقط.
6. لا يتم نشر أي أصل دون نسخة معتمدة.
7. لا يتم تعديل دليل النشر بعد تسجيله؛ فقط invalidation بحدث جديد.
8. audit logs لا تعدل.
9. لا يتم احتساب استخدام تجاري ناجح عند فشل توليد AI أو فشل فني مثبت.
