# Marketing OS V5.6.6 — ERD / SQL / API Conversion Lock Sheet

> الحالة: **Corrective Conversion Lock Sheet / Phase 0-1 ERD-SQL-API Ready / Relationship Contract Unified / Legacy Relationship Contracts Superseded / No-Code-Before-Contracts**  
> العلاقة مع V5.6.5: هذه الوثيقة لا توسّع نطاق المنتج ولا تضيف خصائص جديدة. الغرض منها معالجة الملاحظات التنفيذية الأخيرة على V5.6.5، وتثبيت مرجعية التحويل إلى ERD/SQL/API، وإزالة أي لبس ناتج عن تكرار عقود العلاقات أو بقايا تسميات قديمة.  
> نطاق الاعتماد: **Phase 0/1 فقط**. لا تعتمد هذه الوثيقة لتنفيذ المنتج الكامل أو Phase 2 وما بعدها.

---

## 0) Executive Lock Notice — إشعار القفل التنفيذي

هذه الوثيقة تصدر لمعالجة الملاحظات التالية:

1. حسم هل V5.6.5 جاهزة للتحويل إلى ERD/SQL/API.
2. تثبيت شروط Go / No-Go.
3. استخراج القرارات غير القابلة للتغيير ووضعها كقواعد تنفيذية.
4. تحديد العلاقات أو التسميات القديمة التي يجب تجاهلها.
5. اعتماد القسم 52 كمصدر علاقات وحيد.
6. منع بدء البرمجة قبل وجود ERD وSQL DDL وOpenAPI وBacklog وQA Test Suite.

**القرار التنفيذي:**

```text
V5.6.5 جاهزة للتحويل إلى ERD/SQL/API لمرحلة Phase 0/1 فقط.
ليست جاهزة للبناء البرمجي المباشر.
ليست جاهزة لتنفيذ المنتج الكامل.
القسم 52 هو مصدر علاقات البيانات الوحيد.
أي Relationship Contract سابق يعتبر ملغى تنفيذيًا إذا تعارض مع القسم 52.
```

---

# 1) الخلاصة الحاسمة

## 1.1 الحكم النهائي

**جاهزة للتحويل إلى ERD/SQL/API — بشرط الالتزام بهذه الوثيقة كقفل تحويلي.**

لكن بدقة تنفيذية:

| المجال | الحكم |
|---|---|
| ERD Phase 0/1 | جاهزة للتحويل |
| SQL DDL Phase 0/1 | جاهزة بعد الالتزام بـ Field Locks والقيود |
| API Contracts Phase 0/1 | جاهزة للتحويل إلى OpenAPI أولي |
| Sprint Backlog 0–4 | جاهز للاشتقاق بعد User Stories وAcceptance Criteria |
| Frontend/QA | لا يبدأان قبل OpenAPI وQA Matrix |
| Coding مباشر | ممنوع |
| المنتج الكامل | غير جاهز للتنفيذ الكامل |

## 1.2 سبب الحكم

الوثيقة الأصلية V5.6.5 أغلقت أغلب الثغرات التنفيذية، لكنها تحتوي بقايا تاريخية من أقسام سابقة مثل V5.6.3 وV5.6.4 وعقود علاقات قديمة. هذه الوثيقة تعالج ذلك بوضع قاعدة واحدة:

```text
Section 52 First.
No earlier relationship contract may be used.
```

---

# 2) نطاق هذه الوثيقة

## 2.1 داخل النطاق

هذه الوثيقة تحكم فقط:

- تحويل V5.6.5 إلى ERD Phase 0/1.
- تحويل ERD إلى SQL DDL.
- تحويل Minimum API Surface إلى OpenAPI.
- تحويل User Stories إلى Sprint Backlog.
- تحويل QA Acceptance Matrix إلى Test Suite.
- إزالة الالتباس بين العلاقات القديمة والقسم 52.
- تثبيت Go / No-Go.

## 2.2 خارج النطاق

هذه الوثيقة لا تعتمد:

- بناء المنتج كاملًا.
- Phase 2 Measurement المتقدم.
- AttributionDecision المتقدم.
- Paid Execution.
- Social API Auto-Publishing.
- AI Agents.
- Advanced Media Pipeline.
- Full Video Production.
- Full Image Production.
- Enterprise White-label.

---

# 3) ما ورد في الوثيقة مقابل التصحيح المضاف

## 3.1 ما ورد في V5.6.5

ورد في V5.6.5 أن:

- النسخة معتمدة لـ Phase 0/1 فقط بعد تطبيق التصحيحات.
- Final Data Relationship Contract يجب أن يكون المصدر الوحيد للحقيقة.
- Field Locks مطلوبة قبل ERD/SQL.
- Queue Stack وSecret Manager وBilling Provider وObject Storage يجب حسمها قبل التنفيذ.
- MediaCostPolicy وMediaCostSnapshot إلزاميان في Phase 0/1.
- لا يسجل استخدام تجاري دون usable output.
- لا يسمح بالنشر دون ApprovalDecision مربوط بـ MediaAssetVersion وcontent_hash.
- كل جداول المستأجر يجب أن تحتوي workspace_id.
- جداول الملكية التجارية يجب أن تحتوي customer_account_id.
- OpenAPI وUser Stories وAcceptance Criteria وNFR Matrix مطلوبة قبل Frontend/QA.

## 3.2 التصحيح المضاف في هذه الوثيقة

هذه الوثيقة تضيف فقط:

- تسمية تنفيذية جديدة: **V5.6.6 Conversion Lock Sheet**.
- قاعدة تفسير: أي إشارة إلى V5.6.3 أو V5.6.4 داخل النص تعتبر تاريخية.
- منع استخدام أي Relationship Contract سابق في ERD.
- توجيه واضح لفريق Database وBackend وProduct وQA حول الترتيب الصحيح.
- جدول تحكيم بين العلاقات والأسماء القديمة والجديدة.

---

# 4) القرارات غير القابلة للتغيير

| القرار | الحكم التنفيذي |
|---|---|
| نطاق التحويل الحالي | Phase 0/1 فقط |
| البناء المباشر قبل ERD/SQL/API | ممنوع |
| القسم 52 | مصدر العلاقات الوحيد |
| أي عقد علاقات سابق | ملغى عند التعارض |
| GenerationJob | لا يبنى كجدول مستقل |
| Asset | لا يبنى كجدول مستقل |
| Approval | لا يستخدم ككيان قرار اعتماد |
| MediaJob | كيان التوليد والتحويل المعتمد |
| MediaAsset | كيان الأصل العام المعتمد |
| MediaAssetVersion | مصدر النسخة القابلة للمراجعة والنشر |
| ApprovalDecision | مصدر قرار الاعتماد |
| ManualPublishEvidence | append-only ولا يعدل مباشرة |
| UsageMeter | مصدر الاستخدام التجاري |
| CostEvent | مصدر التكلفة الداخلية |
| BillingProvider | مصدر الفاتورة الرسمية |
| ClientReportSnapshot | مصدر التقرير المجمّد |
| workspace_id | إلزامي في الجداول التشغيلية الحساسة |
| customer_account_id | إلزامي في الملكية التجارية والاستخدام والتكلفة |
| Auto-publishing | خارج Phase 0/1 |
| Paid Execution | خارج V1 |
| Advanced Attribution | بعد Phase 0/1 |
| AI Agents | Post V1 |

---

# 5) Final Relationship Authority

## 5.1 القاعدة الحاكمة

القسم 52 من V5.6.5 هو المصدر الوحيد لعلاقات البيانات.

```text
All previous relationship contracts are superseded.
No ERD, migration, API contract, or QA test may rely on an earlier relationship contract.
```

## 5.2 الأقسام القديمة التي لا يعتمد عليها تنفيذيًا

| القسم أو العلاقة القديمة | الحكم |
|---|---|
| Section 16 Data Relationship Contract | تاريخي فقط؛ لا يستخدم عند التعارض |
| Section 30.3 Relationship Contract | تاريخي فقط؛ لا يستخدم عند التعارض |
| Section 47 Updated Relationship Contract | تاريخي فقط؛ لا يستخدم عند التعارض |
| أي علاقة `MediaJob 1──0..1 MediaAsset` | ملغاة |
| أي علاقة Approval مباشرة مع MediaAsset دون MediaAssetVersion | ملغاة |
| أي اعتماد على MediaAsset.status وحده للنشر | ملغى |
| أي ذكر GenerationJob كجدول مستقل | يترجم إلى MediaJob |
| أي ذكر Asset كجدول مستقل | يترجم إلى MediaAsset |
| أي ذكر Approval كقرار اعتماد | يترجم إلى ApprovalDecision |

---

# 6) Final Data Relationship Contract — Section 52 Adopted

> هذا هو العقد الوحيد المسموح بتحويله إلى ERD.

```text
CustomerAccount 1──N Workspace
Workspace 1──N WorkspaceMember
User 1──N WorkspaceMember
Role 1──N WorkspaceMember
Role 1──N RolePermission
Permission 1──N RolePermission

CustomerAccount 1──N CustomerSubscription
CustomerSubscription 1──N CustomerSubscriptionSnapshot
SubscriptionPlan 1──N SubscriptionPlanVersion
SubscriptionPlanVersion 1──N PlanEntitlementVersion

Workspace 1──N Campaign
Campaign 1──N BriefVersion
Campaign 1──N CampaignStateTransition
Campaign 1──N MediaJob
Campaign 1──N CreativePackage
Campaign 1──N ClientReportSnapshot

BriefVersion 1──N MediaJob
PromptTemplate 1──N MediaJob
MediaJob 1──0..N MediaAsset
MediaAsset 1──N MediaAssetVersion
MediaAssetVersion 1──N ReviewTask
ReviewTask 1──N ApprovalDecision
ApprovalDecision 1──0..N PublishJob
PublishJob 1──0..N ManualPublishEvidence
PublishJob 1──0..N TrackedLink

BrandProfile 1──N BrandVoiceRule
Workspace 1──N BrandProfile
Workspace 1──N PromptTemplate
Workspace 1──N ReportTemplate

Workspace 1──N UsageMeter
Workspace 1──N UsageQuotaState
Workspace 1──N CostEvent
Workspace 1──N CostBudget
Workspace 1──N CostGuardrail
Workspace 1──N MediaCostPolicy
MediaJob 1──1 MediaCostSnapshot

Workspace 1──N AuditLog
Workspace 1──N AdminNotification
Workspace 1──N SafeModeState
Workspace 1──N OnboardingProgress
Workspace 1──N SetupChecklistItem
```

---

# 7) أسماء الكيانات التنفيذية المعتمدة

## 7.1 أسماء ممنوعة كجداول مستقلة

لا يتم إنشاء جداول بهذه الأسماء:

```text
Asset
GenerationJob
Approval
```

## 7.2 أسماء معتمدة

```text
MediaJob
MediaAsset
MediaAssetVersion
ApprovalDecision
ManualPublishEvidence
```

## 7.3 قاعدة الترجمة التنفيذية

| أي ذكر قديم | يترجم تنفيذيًا إلى |
|---|---|
| GenerationJob | MediaJob |
| Asset | MediaAsset |
| Approval | ApprovalDecision |
| Approved Asset | Approved MediaAssetVersion |
| Publish Asset | Publish approved MediaAssetVersion |
| Report Asset | Snapshot of MediaAssetVersion state |

---

# 8) Go / No-Go

## 8.1 Go إلى ERD

يسمح بالانتقال إلى ERD إذا تحقق الآتي:

- اعتماد القسم 52 كمصدر علاقات وحيد.
- عدم استخدام أي Relationship Contract سابق.
- قفل Field Locks لكيانات Phase 1.
- إدخال MediaCostPolicy وMediaCostSnapshot.
- اعتماد Usable Output Definition.
- ربط ApprovalDecision بـ MediaAssetVersion وcontent_hash.
- تثبيت customer_account_id وworkspace_id حسب القاعدة.
- تثبيت ManualPublishEvidence كـ append-only.
- توثيق العلاقات المؤجلة خارج Phase 0/1.

## 8.2 Go إلى SQL DDL

يسمح بالانتقال إلى SQL إذا توفر:

- ERD معتمد من القسم 52 فقط.
- قائمة Primary Keys وForeign Keys.
- قيود NOT NULL للحقول الحاكمة.
- قيود تمنع تعديل الملكية التاريخية.
- فهارس tenant isolation.
- قيود idempotency للعمليات القابلة للتكرار.
- trigger أو policy يمنع تعديل ManualPublishEvidence مباشرة.
- تصميم يمنع تعديل MediaAssetVersion المعتمدة.

## 8.3 Go إلى API Contracts

يسمح بالانتقال إلى OpenAPI إذا توفر:

- WorkspaceContextGuard محدد.
- PermissionGuard محدد.
- Error Model موحد.
- FeatureGate points محددة.
- CostGuardrail points محددة.
- Idempotency requirements محددة.
- AuditLog events محددة.
- Request/response payloads لكل endpoint.
- منع قبول workspace_id من body كمصدر ثقة.

## 8.4 No-Go

يمنع التحويل أو التنفيذ إذا حدث أحد الآتي:

- وجود أكثر من Relationship Contract مستخدم في ERD.
- اعتماد أي علاقة من Section 16 أو 30 أو 47 بدل Section 52.
- غياب workspace_id في جدول تشغيلي حساس.
- غياب customer_account_id في جدول تجاري أو تكلفة أو استخدام.
- استخدام GenerationJob أو Asset أو Approval كجداول مستقلة.
- بدء MediaJob دون MediaCostSnapshot approved.
- تسجيل UsageMeter قبل تحقق usable output.
- إنشاء PublishJob دون ApprovalDecision approved لنفس MediaAssetVersion.
- نشر نسخة يختلف content_hash الخاص بها عن approved_content_hash.
- PATCH يعدل محتوى معتمدًا بدل إنشاء MediaAssetVersion جديدة.
- ManualPublishEvidence يسمح بـ PATCH أو DELETE.
- Frontend يبدأ قبل OpenAPI.
- QA يبدأ دون Acceptance Criteria وTest Matrix.

---

# 9) قواعد Field Lock العليا

## 9.1 قاعدة الملكية

```text
CustomerAccount = الحساب التجاري الدافع.
Workspace = العميل أو المساحة التشغيلية داخل الحساب.
```

## 9.2 قاعدة العزل

كل جدول تشغيلي حساس يجب أن يحتوي:

```text
workspace_id NOT NULL
```

## 9.3 قاعدة الملكية التجارية

كل جدول استخدام أو تكلفة أو اشتراك أو حصة يجب أن يحتوي:

```text
customer_account_id NOT NULL
```

إلا إذا كان جدولًا عالميًا صريحًا مثل:

```text
SubscriptionPlan
SubscriptionPlanVersion
PlanEntitlementVersion
AIProvider
AIModelRegistry
Permission
Role
```

## 9.4 قاعدة منع تغيير الملكية

بعد إنشاء السجل، يمنع تغيير:

```text
workspace_id
customer_account_id
created_by_user_id في السجلات التاريخية
submitted_by_user_id في ManualPublishEvidence
content_hash في MediaAssetVersion وManualPublishEvidence
```

أي تصحيح يتم عبر migration إدارية موثقة وليس عبر API عادي.

---

# 10) Approval Integrity Rules

## 10.1 القاعدة

لا يكفي أن يكون `MediaAsset.status = approved`.

مصدر الحقيقة للنشر هو:

```text
ApprovalDecision linked to MediaAssetVersion
+ approved_content_hash
+ MediaAssetVersion.status = approved
```

## 10.2 إنشاء PublishJob

لا يسمح بإنشاء PublishJob إلا إذا تحقق:

```text
PublishJob.media_asset_version_id = ApprovalDecision.media_asset_version_id
ApprovalDecision.decision = approved
ApprovalDecision.approved_content_hash = MediaAssetVersion.content_hash
MediaAssetVersion.status = approved
```

## 10.3 تعديل محتوى بعد الاعتماد

إذا تغير المحتوى بعد الاعتماد:

```text
1. إنشاء MediaAssetVersion جديدة.
2. إبقاء النسخة السابقة كما هي.
3. منع النشر حتى ReviewTask جديد.
4. إنشاء ApprovalDecision جديد.
5. تسجيل AuditLog.
```

---

# 11) Usage / Cost / Billing Rules

## 11.1 مصدر الاستخدام التجاري

```text
UsageMeter
```

لا يتم تسجيل UsageMeter إلا إذا تحقق usable output.

## 11.2 مصدر التكلفة الداخلية

```text
CostEvent + ProviderUsageLog
```

CostEvent لا يعني فوترة العميل.

## 11.3 مصدر الفاتورة الرسمية

```text
BillingProvider
```

لا تبنى الفاتورة من CostEvent.

## 11.4 MediaCostSnapshot

لا يبدأ MediaJob قبل:

```text
MediaCostSnapshot.cost_check_result = approved
```

## 11.5 فشل المزود

| الحالة | CostEvent | UsageMeter |
|---|---:|---:|
| provider_timeout | حسب التكلفة الفعلية | لا |
| provider_error | حسب التكلفة الفعلية | لا |
| empty_output | نعم إن وجدت تكلفة | لا |
| malformed_output | نعم إن وجدت تكلفة | لا |
| valid_output_generated | نعم | نعم |
| rejected_by_human_for_quality | نعم | نعم |

---

# 12) ManualPublishEvidence Integrity

## 12.1 القاعدة

ManualPublishEvidence يمثل دليلًا تشغيليًا قد يدخل في تقرير عميل أو نزاع. لذلك:

```text
لا PATCH.
لا DELETE.
التصحيح عبر supersede.
الإلغاء عبر invalidate.
```

## 12.2 الحقول المحمية

لا تعدل بعد الإنشاء:

```text
published_url
screenshot_ref
external_post_id
submitted_by_user_id
submitted_at
content_hash
media_asset_version_id
```

## 12.3 التقرير

ClientReportSnapshot يجب أن يجمّد حالة evidence وقت الإصدار.

أي تغيير لاحق في evidence لا يغير التقرير القديم.

---

# 13) Technical Decisions Pending Before Implementation

هذه قرارات يجب حسمها قبل التنفيذ البرمجي، لكنها لا تمنع تحويل ERD/SQL/API:

| القرار | الوضع | الأثر إذا لم يحسم قبل الكود |
|---|---|---|
| Queue Stack | يجب حسمه قبل workers | اضطراب AI job processing |
| Secret Manager | يجب حسمه قبل credentials | خطر تسريب أسرار |
| Billing Provider | يجب حسمه قبل webhooks | تضارب في subscription state |
| Object Storage | يجب حسمه قبل media/evidence files | إعادة بناء storage model |
| Observability | يجب حسم baseline | صعوبة اكتشاف الأعطال |
| OpenAPI tooling | يجب حسمه قبل Frontend | اختلاف Backend/Frontend |

التوصية التنفيذية غير الملزمة:

```text
Queue: BullMQ + Redis
Secret Manager: AWS Secrets Manager أو Doppler
Billing Provider: Stripe أو Paddle حسب السوق
Object Storage: S3-compatible
Observability: Sentry + OpenTelemetry baseline
```

---

# 14) API Conversion Rules

## 14.1 قاعدة Workspace Context

ممنوع قبول `workspace_id` من body كمصدر ثقة.

المعتمد:

```text
workspace_id يأتي من route أو context مصرح.
كل query تشغيلي يستخدم workspace_id.
كل write endpoint يمر عبر RBAC.
```

## 14.2 قاعدة الاستعلام

ممنوع:

```sql
SELECT * FROM media_assets WHERE media_asset_id = $1;
```

المعتمد:

```sql
SELECT * FROM media_assets
WHERE media_asset_id = $1
AND workspace_id = $2;
```

## 14.3 Error Model

كل خطأ يجب أن يحتوي:

```json
{
  "code": "string",
  "message": "string",
  "user_action": "string",
  "correlation_id": "string"
}
```

---

# 15) QA Conversion Rules

## 15.1 اختبارات إلزامية قبل Sprint 1

- مستخدم في Workspace A لا يقرأ Campaign من Workspace B.
- مستخدم في Workspace A لا يقرأ MediaAsset من Workspace B.
- Reviewer في Workspace A لا يصدر ApprovalDecision على ReviewTask من Workspace B.
- Publisher لا ينشئ PublishJob على نسخة غير معتمدة.
- PublishJob يرفض content_hash غير مطابق.
- ManualPublishEvidence لا يقبل PATCH/DELETE.
- UsageMeter لا يسجل عند فشل مزود دون usable output.
- FeatureGate لا يعتمد على COUNT live.
- BillingAdmin لا يعدل المحتوى.
- Viewer لا ينفذ أي write action.

## 15.2 اختبارات No-Go قبل Pilot

- Tenant isolation failed.
- IDOR succeeded.
- Approval bypass succeeded.
- Manual evidence mutation succeeded.
- Usage counted on failed job.
- Report changed after snapshot.
- workspace_id accepted from body as trusted.

أي حالة من هذه تعني:

```text
No Pilot.
No Production.
No paid customer exposure.
```

---

# 16) مخرجات التحويل المطلوبة الآن

## 16.1 المخرج الأول: ERD Phase 0/1

يجب أن يحتوي:

- Entities من Section 52 فقط.
- Relationships من Section 52 فقط.
- PK/FK.
- nullable rules.
- ownership fields.
- tenant fields.
- immutable entities.
- deferred entities.

## 16.2 المخرج الثاني: SQL DDL

يجب أن يحتوي:

- tables.
- enums أو check constraints.
- foreign keys.
- indexes.
- unique constraints.
- immutable triggers.
- idempotency constraints.
- audit-related indexes.

## 16.3 المخرج الثالث: OpenAPI

يجب أن يحتوي:

- paths.
- request bodies.
- responses.
- error model.
- permissions.
- workspace context rules.
- idempotency headers.
- pagination.

## 16.4 المخرج الرابع: Sprint Backlog

يجب أن يحتوي لكل Story:

- User Story.
- Acceptance Criteria.
- affected entities.
- API endpoints.
- permissions.
- FeatureGate impact.
- AuditLog requirement.
- error states.
- QA cases.

## 16.5 المخرج الخامس: QA Test Suite

يجب أن يحتوي:

- tenant isolation tests.
- RBAC tests.
- approval integrity tests.
- usage/cost tests.
- evidence immutability tests.
- report snapshot tests.
- API error model tests.

---

# 17) تعليمات مباشرة للفريق

## 17.1 لفريق Database

ابدأ من Section 52 فقط. لا تستخدم أي علاقة من Section 16 أو 30 أو 47.

## 17.2 لفريق Backend

لا تبنِ CRUD عاديًا. كل endpoint يجب أن يمر عبر:

```text
AuthGuard
WorkspaceContextGuard
Membership Check
PermissionGuard
FeatureGate عند الحاجة
CostGuardrail عند الحاجة
AuditLog للأحداث الحساسة
```

## 17.3 لفريق Frontend

لا تبدأ قبل OpenAPI. الواجهة لا تعتبر طبقة أمن. أي زر مخفي يجب أن يقابله رفض backend.

## 17.4 لفريق QA

اكتب الاختبارات من Go/No-Go قبل اختبار الشاشات. أخطر اختبار هو العزل وليس جمال الواجهة.

## 17.5 لفريق Product

لا تضف خصائص جديدة قبل إنجاز ERD/SQL/API. أي توسع في الصور والفيديو أو النشر الآلي أو القياس المتقدم يذهب إلى Build Next أو Post V1.

---

# 18) المدخلات والمخرجات والفجوات وقرار الانتقال

## 18.1 المدخلات

- وثيقة Marketing OS V5.6.5.
- الملاحظات التنفيذية الأخيرة حول الجاهزية.
- الحاجة إلى حسم القسم 52 كمصدر علاقات وحيد.
- الحاجة إلى منع تضارب العلاقات القديمة.

## 18.2 المخرجات

- وثيقة قفل تحويلي V5.6.6.
- قرار جاهزية واضح.
- Go / No-Go محكم.
- Relationship Authority نهائي.
- تعليمات مباشرة للتحويل إلى ERD/SQL/API.

## 18.3 الفجوات المتبقية

هذه الفجوات لا تمنع التحويل، لكنها تمنع البناء البرمجي المباشر:

- لم يتم إنتاج ERD بعد.
- لم يتم إنتاج SQL DDL بعد.
- لم يتم إنتاج OpenAPI بعد.
- لم يتم تحويل User Stories إلى Backlog كامل بعد.
- لم يتم إنتاج QA Test Suite بعد.
- لم يتم حسم Queue/Secret/Billing/Object Storage كقرارات تنفيذية فعلية.

## 18.4 قرار الانتقال

```text
يسمح بالانتقال الآن إلى ERD Phase 0/1.
لا يسمح بالانتقال إلى coding.
لا يسمح ببدء Frontend.
لا يسمح ببدء QA التفصيلي قبل OpenAPI وAcceptance Criteria.
```

---

# 19) القرار التنفيذي النهائي

**V5.6.6 تعتمد V5.6.5 كوثيقة جاهزة للتحويل إلى ERD/SQL/API لمرحلة Phase 0/1 فقط، مع قفل القسم 52 كمصدر علاقات وحيد وإلغاء أي علاقة أقدم عند التعارض.**

الخطوة التالية الوحيدة الصحيحة:

```text
حوّل Section 52 إلى ERD Phase 0/1.
ثم SQL DDL.
ثم OpenAPI.
ثم Backlog.
ثم QA Test Suite.
بعدها فقط يبدأ Sprint 0.
```

**END V5.6.6**
