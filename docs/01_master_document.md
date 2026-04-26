
Marketing OS V5.6.5 — Corrective Implementation Build-Ready Lock Sheet
> الحالة: Corrective Implementation Lock Sheet / Phase 0-1 Build-Ready After Patch / Tenant Isolation Hardened / Approval Integrity Hardened / Cost Governance Hardened / Provider-Abstraction Ready  
> العلاقة مع V5.6.2: هذه الوثيقة لا تستبدل V5.6.2، بل تقفل قرارات التنفيذ وتضيف تغطية كاملة لقدرات النص والصور والفيديو والنماذج والمزودين قبل ERD / SQL / API / Backlog.  
> الغرض: منع تضخم التنفيذ مع ضمان أن التصميم يغطي كامل قدرات المنتج المستهدفة، بما فيها إنتاج الصور والفيديو عبر API Providers أو نماذج مستضافة.
---

Execution Lock Notice — V5.6.5
This version is approved for Phase 0/1 implementation only after applying the Corrective Implementation Patch contained in sections 51–65.
The following are mandatory before ERD/SQL:
Final Data Relationship Contract must be the only source of truth.
Campaign, BriefVersion, BrandProfile, BrandVoiceRule, PromptTemplate, CampaignTemplate, ReportTemplate, and ClientReportSnapshot must have Field Lock definitions.
Queue Stack, Secret Manager, Billing Provider, and Object Storage must be decided before implementation.
MediaCostPolicy and MediaCostSnapshot are mandatory in Phase 0/1.
No commercial usage is recorded unless usable output criteria are met.
No publishing is allowed unless ApprovalDecision is bound to the exact MediaAssetVersion and content_hash.
All tenant-owned tables must include workspace_id; commercial ownership tables must include customer_account_id.
WorkspaceContextGuard, PermissionGuard, AuditLog, and IDOR tests are mandatory.
OpenAPI, User Stories, Acceptance Criteria, and NFR Matrix are required before Frontend/QA execution.
Any previous relationship contract conflicting with the Final Data Relationship Contract is superseded.

1) الخلاصة الحاسمة
V5.6.5 تعتمد كامل نطاق Marketing OS كمنتج متعدد الوسائط، وليس كمنتج نصي فقط، مع اعتماد هذه النسخة كمصدر حاكم لمرحلة Phase 0/1 فقط قبل ERD/SQL/API.
المنتج يجب أن يغطي رسميًا:
توليد النصوص التسويقية.
توليد الصور.
تحسين الصور.
تحويل النص إلى صورة.
تحويل النص إلى فيديو.
تحويل الصورة إلى فيديو.
توليد Storyboard.
توليد نسخ متعددة حسب القناة.
إدارة مزودين ونماذج مختلفة.
ربط API مع مزودين خارجيين.
دعم نماذج مستضافة ذاتيًا لاحقًا.
ضبط تكلفة كل نوع توليد.
مراجعة واعتماد المحتوى قبل الاستخدام أو النشر.
تتبع أصل كل Asset وتحولاته.
حوكمة الحقوق والامتثال والمخاطر.
لكن القرار التنفيذي الحاكم هو:
> **تغطية كل القدرات في الوثيقة لا تعني تنفيذ كل القدرات في أول مرحلة.**
لذلك تعتمد V5.6.5 قاعدة:
Full Scope Covered في التصميم.
Execution Still Phased في البناء.
Provider-Abstraction First في التكامل.
Cost/Governance First خصوصًا للصور والفيديو.
لا يبدأ ERD/SQL/API قبل اعتماد هذه الوثيقة.
---
2) قرارات غير قابلة للنقاش
القرار	الحكم
المنتج	Marketing OS متعدد الوسائط، وليس Content Writer فقط
ICP الأول	وكالات تسويق صغيرة/متوسطة تدير 5–30 عميلًا
نطاق الوثيقة	كامل القدرات: نص، صورة، فيديو، قياس، حوكمة، تكلفة
نطاق البناء الأول	Phase 0 + Phase 1 فقط مع تأسيس Provider Abstraction
الصور والفيديو	داخل النطاق الرسمي، لكن Phase-Gated
النشر	Manual Publish Evidence أولًا، لا auto-publishing في Phase 0/1
الفوترة	Billing Provider First
مصدر الفاتورة الرسمية	Billing Provider
مصدر الاستخدام التجاري	UsageMeter
مصدر التكلفة الداخلية	CostEvent + ProviderUsageLog
مصدر صلاحيات المستخدم	RBAC backend enforcement
Source of Truth للتقارير	ClientReportSnapshot
Source of Truth للنشر	PublishJob + ManualPublishEvidence / PublishedPostSnapshot لاحقًا
الذكاء الاصطناعي	Provider/Model abstraction، لا ربط مغلق بمزود واحد
Auto decisioning	ممنوع في V1
Paid Execution	خارج V1
Advanced Attribution	Phase 2 وما بعده
AI Agents	Post V1
---
3) مبدأ التغطية مقابل التنفيذ
3.1 القاعدة الحاكمة
كل قدرة استراتيجية لازمة للمنتج يجب أن تكون ممثلة في الوثيقة من حيث:
الدومين.
الكيانات.
التكلفة.
الصلاحيات.
الحوكمة.
الأخطاء.
واجهات API.
تجربة المستخدم.
شروط التفعيل.
لكن لا يشترط تنفيذها في أول إصدار.
3.2 تصنيف القدرات
التصنيف	المعنى
Build Now	يبنى في Phase 0/1
Build Next	يبنى بعد استقرار Core مباشرة
Schema-Ready / API-Ready	يصمم في ERD/API دون تشغيل إنتاجي
Controlled Launch	يفعّل على نطاق محدود وبحدود تكلفة ومخاطر
Post V1	مؤجل استراتيجيًا ولا يدخل البناء الأول
---
4) Capability Coverage Matrix
القدرة	التغطية في الوثيقة	الجاهزية التنفيذية	قرار التنفيذ
Text generation	كاملة	عالية	Build Now
Campaign brief generation	كاملة	عالية	Build Now
Channel captions	كاملة	عالية	Build Now
Report narrative	كاملة	عالية	Build Now
Image generation via API	كاملة	متوسطة	Build Next
Image enhancement	كاملة	متوسطة	Build Next
Text-to-image	كاملة	متوسطة	Build Next
Text-to-video	كاملة	متوسطة/منخفضة	Controlled Launch
Image-to-video	كاملة	متوسطة/منخفضة	Controlled Launch
Storyboard generation	كاملة	عالية	Build Now كنص / Next كوسائط
Video script generation	كاملة	عالية	Build Now كنص
Voiceover script	كاملة	عالية	Build Now كنص
Subtitle/caption package	كاملة	متوسطة	Build Next
Media templates/presets	كاملة	متوسطة	Build Next
Provider registry	كاملة	عالية	Build Now
Model registry	كاملة	عالية	Build Now
Provider credentials	كاملة	متوسطة	Build Now للهيكل / Next للتكامل
Provider fallback	كاملة	متوسطة	Build Next
Model routing	كاملة	متوسطة	Schema-Ready ثم Build
Media storage	كاملة	عالية	Build Next
Media review	كاملة	عالية	Build Now كنموذج عام
Media compliance	كاملة	متوسطة	Build Now baseline / Next automation
Media rights	كاملة	عالية	Build Now policy / Next entities كاملة
Usage and cost guardrails	كاملة	عالية	Build Now
Advanced attribution	مغطاة	متوسطة	Phase 2
Social API publishing	مغطاة	منخفضة	Later
Paid execution	مغطاة كمستقبل	منخفضة	Post V1
AI agents	مغطاة كمستقبل	منخفضة	Post V1
---
5) Scope Lock — ما يتم بناؤه الآن
5.1 Phase 0 — Foundation + Commercial + Governance Base
يدخل في Phase 0:
CustomerAccount.
Workspace.
User.
WorkspaceMember.
Role.
Permission.
RolePermission.
RBAC backend enforcement.
AuditLog.
SubscriptionPlan.
SubscriptionPlanVersion.
PlanEntitlementVersion.
CustomerSubscription.
CustomerSubscriptionSnapshot.
FeatureGate.
FeatureAccessDecision.
UsageMeter.
UsageQuotaState.
CostEvent.
CostBudget.
CostGuardrail.
MarginGuardrail baseline.
SafeModeState.
AdminNotification baseline.
OnboardingProgress.
SetupChecklistItem.
Provider abstraction foundation.
AIProvider.
AIModelRegistry.
ModelRoutingPolicy baseline.
ProviderUsageLog baseline.
ProviderFailureEvent baseline.
Workspace Settings shell.
Members & Roles screen.
Billing & Usage shell.
Operations Health shell.
5.2 Phase 1 — Sellable Core + Text + Media-Ready Domain
يدخل في Phase 1:
BrandProfile baseline.
BrandVoiceRule baseline.
Campaign.
CampaignTemplate.
CampaignStateTransition.
BriefVersion.
Brief Builder UX.
PromptTemplate.
GenerationJob / MediaJob للنص.
MediaAsset / Asset للنص.
ReviewTask عام لكل الأصول.
Approval عام لكل الأصول.
RejectionReason baseline.
CreativePackage baseline.
Storyboard كنص وهيكل.
VideoScript كنص.
VoiceoverScript كنص.
ChannelVariant.
TrackedLink.
PublishJob manual status.
ManualPublishEvidence.
ClientReportSnapshot basic.
ReportTemplate baseline.
Integrations Catalog shell.
IntegrationConnection shell.
IntegrationHealthSnapshot shell.
Content Studio: Text Studio + Media placeholders.
Role-based dashboards.
Empty states.
Error model.
---
6) Build Next — الصور والفيديو والتخزين
يدخل بعد اكتمال Phase 0/1 واختبار end-to-end:
6.1 Image Layer
Image generation via API provider.
Text-to-image.
Image enhancement.
Image variation generation.
Image resizing/cropping for channels.
Image asset storage.
Image preview UI.
Image review and approval.
Image compliance baseline.
Image cost governance.
6.2 Video Layer
Text-to-video jobs.
Image-to-video jobs.
Short video generation.
Video duration control.
Video resolution control.
Video render lifecycle.
Video preview UI.
Video review and approval.
Video cost governance.
Provider quota tracking.
Render failure handling.
6.3 Provider Layer
Real provider credentials.
Provider health checks.
Provider fallback.
Provider quota enforcement.
Provider usage reconciliation.
Model selection by use case.
Cost-per-job enforcement.
---
7) Schema-Ready / API-Ready
هذه العناصر تصمم في الدومين ولا تفعّل إنتاجيًا إلا لاحقًا:
Dynamic model routing.
Automated provider selection.
Multi-step media pipelines.
Storyboard-to-video orchestration.
Voiceover generation.
Avatar generation.
Lipsync.
Automated moderation.
Media experimentation.
Creative performance learning loop.
AI-assisted creative scoring.
Advanced media quality scoring.
Full content repurposing engine.
---
8) Post V1
تبقى خارج V1:
AI Agents.
Full automated campaign orchestration.
Direct paid media execution.
Budget auto-allocation.
Advanced multi-touch attribution.
Uplift modeling.
MMM.
ROI prediction.
Enterprise-grade white-label.
Full creative optimization loop.
---
9) Explicit Non-Scope — ما لا يبنى الآن
الصور والفيديو ليست خارج النطاق. لكنها ليست كلها Build Now.
العناصر غير المشمولة في Phase 0/1 تحديدًا:
العنصر	القرار	السبب
Production image generation	Build Next	يحتاج storage + cost + rights
Production video generation	Controlled Launch	تكلفة وتعقيد وفشل أعلى
Social API auto-publishing	Later	صلاحيات ومنصات ومخاطر تشغيلية
Full webhook reliability للمنصات	Phase 4	لا حاجة له قبل تكاملات فعلية
Full billing ledger	Later	المزود الخارجي مصدر التحصيل
AttributionDecision	Phase 2	يحتاج بيانات أداء
Advanced Consent flows	Phase 3	مع baseline block rules مبكرًا
CRM connector	V1.2	ليس ضروريًا لإثبات القيمة الأولى
Experimentation	V1.2+	يحتاج عينة وقياس موثوق
White-label	بعد 3–5 وكالات مدفوعة	لا يبنى على افتراض
AI Agents	Post V1	خطر تضخيم ومخرجات غير محكومة
Paid execution	خارج V1	مخاطر مالية وتشغيلية
---
10) Pricing & Entitlement Matrix
> الأسعار أرقام افتراضية للتصميم وليست قرار تسعير نهائي. الغرض منها تمكين بناء FeatureGate وUsageMeter وPlan Snapshot وMedia Cost Controls. يجب اختبارها في Pilot.
10.1 الباقات الأولية
الخطة	العميل المناسب	السعر الشهري المقترح	Workspaces	Users	Text Jobs	Image Jobs	Video Jobs	Reports	Tracked Links	AI Cost Cap	Overage
Starter Agency	وكالة صغيرة	79–129 USD	3	5	500	50	5	10	100	25 USD	محدود / hard block للفيديو
Growth Agency	وكالة نامية	249–399 USD	10	15	3,000	300	30	50	1,000	120 USD	نعم بضوابط
Pro Agency	وكالة متوسطة	699–1,199 USD	30	50	10,000	1,500	150	200	5,000	450 USD	نعم مع margin guardrails
Enterprise	مؤجل	مخصص	مخصص	مخصص	مخصص	مخصص	مخصص	مخصص	مخصص	مخصص	خارج V1
10.2 قواعد مهمة
Video jobs أغلى من image jobs ويجب أن تكون لها حدود مستقلة.
Image/video overage لا يفتح تلقائيًا إلا إذا الهامش آمن.
Starter لا يسمح له بتجاوز الفيديو إلا بترقية.
كل خطة لها AI Cost Cap.
يمكن إيقاف الفيديو حتى لو بقيت النصوص مفعلة.
لا تربط الباقة بعدد jobs فقط؛ اربطها أيضًا بالتكلفة الفعلية.
10.3 الاستخدامات القابلة للفوترة
الاستخدام	مصدر القياس	قابل للفوترة؟	قاعدة المنع
Text job succeeded	UsageMeter	نعم	عند تجاوز Text limit
Image job succeeded	UsageMeter	نعم	عند تجاوز Image limit أو Cost cap
Video job succeeded	UsageMeter	نعم	عند تجاوز Video limit أو Cost cap
Failed job without usable output	CostEvent فقط	لا	لا يحسب على العميل
Campaign creation	UsageMeter	نعم	block عند تجاوز active campaigns
Workspace creation	UsageMeter	نعم	block عند تجاوز limit
User seat	UsageMeter	نعم	block عند تجاوز seats
Report snapshot	UsageMeter	نعم	block أو upgrade
TrackedLink	UsageMeter	نعم	block عند تجاوز limit
ManualPublishEvidence	غير مفوتر في البداية	لا	مسموح
---
11) Billing Provider Decision
11.1 القرار
يعتمد V1 على Billing Provider First.
لا يتم بناء نظام فوترة رسمي داخلي في Phase 0/1.
11.2 الخيارات
الخيار	الحكم	السبب
Paddle	الأفضل كبداية عالمية	يخفف عبء الضريبة والفوترة الدولية
Stripe Billing	جيد إذا كان الفريق جاهزًا لإدارة الضرائب	مرن وقوي لكنه يتطلب ضبطًا أكبر
Lemon Squeezy	بديل بسيط	مناسب للبداية لكنه أقل ملاءمة للتوسع المؤسسي
مزود محلي فقط	غير مفضل كبداية عالمية	قد يقيد التوسع والعملات
11.3 قرار V5.6.3 التنفيذي
التصميم يجب أن يكون provider-agnostic عبر BillingProviderConfig، لكن يجب اختيار مزود واحد قبل بدء التكامل الفعلي.
11.4 قواعد الفصل
BillingProvider = مصدر الفاتورة الرسمية والتحصيل.
CustomerSubscriptionSnapshot = مصدر حقوق العميل داخل النظام.
UsageMeter = مصدر الاستخدام التجاري.
CostEvent = مصدر التكلفة الداخلية.
ProviderUsageLog = مصدر استخدام المزودين.
MarginSnapshot = مصدر مراقبة الهامش.
لا يتم توليد فاتورة من CostEvent.
---
12) AI / Media Provider Strategy
12.1 القرار
يعتمد النظام على Provider Abstraction Layer تسمح بربط أكثر من مزود أو نموذج دون قفل النظام على طرف واحد.
12.2 أوضاع التشغيل
الوضع	الوصف	القرار
Managed Provider Mode	استخدام APIs خارجية	البداية الأفضل
Self-Hosted Model Mode	تشغيل نماذج مفتوحة المصدر	لاحقًا عند الحاجة أو لتقليل التكلفة
Hybrid Mode	مزيج بين APIs ونماذج مستضافة	الهدف طويل المدى
12.3 أمثلة مزودين محتملين
المجال	مزودون/API	نماذج أو مسارات مفتوحة المصدر محتملة
Text	OpenAI / Anthropic / Google	Qwen / Llama / Gemma
Image	OpenAI Images / Stability / Ideogram / Replicate / Fal	FLUX / SDXL / ComfyUI pipelines
Image enhancement	Topaz APIs إن وجدت / Replicate / Fal	Real-ESRGAN / SUPIR / ComfyUI
Text-to-video	Runway / Pika / Luma / Kling / Replicate	Wan / HunyuanVideo / CogVideoX
Image-to-video	Runway / Kling / Luma / Pika	Wan / I2V pipelines
Voiceover لاحقًا	ElevenLabs / PlayHT / OpenAI Audio	Piper / Coqui variants
12.4 قاعدة حاكمة
لا تضع أي من هؤلاء كمصدر دائم وحيد. التصميم يجب أن يسمح بالتبديل، fallback، ومقارنة التكلفة والجودة.
---
13) AI Provider Registry — كيانات إلزامية
13.1 AIProvider
ai_provider_id
provider_name
provider_type: api / self_hosted / hybrid
category_support_json
status: active / disabled / degraded
base_url nullable
auth_method
created_at
updated_at
13.2 AIProviderCredential
credential_id
ai_provider_id
workspace_id nullable
secret_ref
credential_scope
status
created_at
قاعدة: لا تخزن الأسرار كنص صريح.
13.3 AIModelRegistry
model_registry_id
ai_provider_id
model_name
model_version
modality: text / image / video / image_edit / image_to_video / audio / analysis
input_type_json
output_type_json
pricing_unit
estimated_unit_cost
quality_tier
latency_tier
active
created_at
13.4 ModelRoutingPolicy
routing_policy_id
workspace_id nullable
use_case
preferred_model_id
fallback_model_id nullable
max_cost_per_job
max_latency_ms nullable
allow_fallback
active
created_at
13.5 ProviderUsageLog
provider_usage_id
workspace_id
provider_id
model_registry_id
media_job_id nullable
usage_type
request_count
input_units
output_units
internal_cost
billable_units
created_at
13.6 ProviderQuotaState
quota_state_id
workspace_id nullable
provider_id
quota_type
used_value
limit_value
reset_at
status: normal / near_limit / exceeded / blocked
13.7 ProviderFailureEvent
failure_event_id
provider_id
model_registry_id nullable
media_job_id nullable
failure_type
error_code
severity
retryable
occurred_at
---
14) Media Generation Domain
14.1 MediaJob
MediaJob هو الكيان العام لكل توليد أو تحويل أو تحسين مرتبط بالذكاء الاصطناعي.
media_job_id
workspace_id
campaign_id nullable
brief_version_id nullable
job_type: text / image / video / image_edit / image_to_video / upscale / enhancement / storyboard / subtitle / audio
provider_id
model_registry_id
routing_policy_id nullable
input_snapshot_json
prompt_template_id nullable
status: queued / running / succeeded / failed / blocked / cancelled
output_asset_id nullable
cost_event_id nullable
error_code nullable
created_by_user_id
created_at
completed_at
14.2 MediaAsset
media_asset_id
workspace_id
campaign_id nullable
media_job_id nullable
asset_type: text / image / video / thumbnail / storyboard / subtitle / audio / document
storage_ref nullable
content_text nullable
preview_ref nullable
mime_type nullable
duration_seconds nullable
width nullable
height nullable
language nullable
status: draft / in_review / approved / rejected / archived
risk_level: low / medium / high
created_at
updated_at
14.3 AssetLineage
lineage_id
parent_asset_id
child_asset_id
transformation_type
media_job_id nullable
created_at
أمثلة lineage:
brief → caption.
caption → image prompt.
prompt → image.
image → enhanced image.
image → video.
brief → storyboard.
storyboard → video.
14.4 MediaPreset
preset_id
workspace_id nullable
modality: text / image / video / audio
preset_name
preset_config_json
use_case
active
14.5 MediaRenderVariant
render_variant_id
media_asset_id
variant_type
channel
format
aspect_ratio
resolution
duration_seconds nullable
variant_ref
created_at
14.6 MediaQualityReview
media_quality_review_id
media_asset_id
reviewer_user_id
review_type
quality_score nullable
decision: approved / rejected / changes_requested
notes
reviewed_at
14.7 MediaComplianceCheck
compliance_check_id
media_asset_id
check_type
result: passed / warning / blocked
flagged_issues_json
risk_level
checked_at
---
15) Content, Rights & Compliance Domain
15.1 القواعد
لا يتم استخدام أصول العميل لتدريب مزود خارجي دون موافقة واضحة.
المحتوى المولد للعميل يستخدم وفق شروط الخدمة والباقة.
العميل مسؤول عن ملكية المواد التي يرفعها.
المنصة مسؤولة عن guardrails وaudit، وليست مستشارًا قانونيًا نهائيًا.
المحتوى عالي المخاطر يحتاج مراجعة بشرية.
أي claim صحي/مالي/تعليمي/ربحي يجب أن يمر عبر check أو review.
15.2 MediaRightsDeclaration
declaration_id
media_asset_id
source_type: generated / uploaded / stock / customer_provided / third_party
rights_status: owned / licensed / unknown / restricted
notes
created_at
15.3 GeneratedMediaPolicyVersion
policy_version_id
policy_name
policy_json
effective_from
active
15.4 TrainingDataOptOut
opt_out_id
workspace_id
provider_id nullable
status: opted_out / opted_in / unknown
created_at
15.5 ContentPolicy
content_policy_id
workspace_id
policy_name
regulated_category
active
15.6 ClaimCheckResult
claim_check_id
media_asset_id
policy_id
result
risk_level
flagged_claims_json
checked_at
15.7 Rejection Reasons
أسباب الرفض يجب أن تشمل:
off_brand.
inaccurate.
weak_copy.
prohibited_claim.
legal_risk.
claim_risk.
repetitive.
wrong_language.
hallucinated_detail.
low_visual_quality.
bad_render.
wrong_format.
wrong_aspect_ratio.
unusable_duration.
visual_inconsistency.
rights_unclear.
---
16) Data Relationship Contract
أي ERD يجب أن يلتزم بهذا العقد.
```text
CustomerAccount 1──N Workspace
CustomerAccount 1──N CustomerSubscription
CustomerSubscription 1──N CustomerSubscriptionSnapshot
SubscriptionPlan 1──N SubscriptionPlanVersion
SubscriptionPlanVersion 1──N PlanEntitlementVersion

Workspace 1──N WorkspaceMember
User 1──N WorkspaceMember
WorkspaceMember N──1 Role
Role M──N Permission through RolePermission

Workspace 1──N Campaign
Workspace 1──N BrandProfile
BrandProfile 1──N BrandVoiceRule
Campaign 1──N BriefVersion
Campaign 1──N CampaignStateTransition
Campaign 1──N MediaJob
BriefVersion 1──N MediaJob
MediaJob 1──0..1 MediaAsset
Campaign 1──N MediaAsset
Workspace 1──N MediaAsset

MediaAsset 1──N ReviewTask
ReviewTask 1──N Approval
MediaAsset 1──N Approval
MediaAsset 1──N MediaRenderVariant
MediaAsset 1──N MediaQualityReview
MediaAsset 1──N MediaComplianceCheck
MediaAsset 1──N MediaRightsDeclaration
MediaAsset 1──N AssetLineage as parent
MediaAsset 1──N AssetLineage as child

MediaAsset 1──N ChannelVariant
ChannelVariant 1──N TrackedLink
ChannelVariant 1──N PublishJob
PublishJob 1──N ManualPublishEvidence

AIProvider 1──N AIModelRegistry
AIProvider 1──N AIProviderCredential
AIProvider 1──N ProviderUsageLog
AIProvider 1──N ProviderFailureEvent
AIModelRegistry 1──N MediaJob
AIModelRegistry 1──N ProviderUsageLog
Workspace 1──N ModelRoutingPolicy

Workspace 1──N UsageMeter
Workspace 1──N UsageQuotaState
Workspace 1──N FeatureAccessDecision
Workspace 1──N CostEvent
Workspace 1──N CostBudget
Workspace 1──N SafeModeState
Workspace 1──N AdminNotification
Workspace 1──N AuditLog

Campaign 1──N ClientReportSnapshot
ReportTemplate 1──N ClientReportSnapshot
```
16.1 قواعد العلاقات
لا يوجد MediaAsset دون Workspace.
لا يوجد MediaJob دون Workspace.
لا يوجد Campaign دون Workspace.
لا يوجد Approval دون ReviewTask.
لا يعتبر PublishJob مكتملًا دون ManualPublishEvidence في Phase 1.
لا يقرأ المستخدم أي entity دون Workspace context.
أي entity قابل للمشاركة أو التقرير يجب أن يرتبط بـ workspace_id.
أي media output يجب أن يكون له lineage أو source declaration.
---
17) MVP Screen Map
17.1 Phase 0 Screens
الشاشة	المستخدم الأساسي	الغرض	شرط الاكتمال
Account Setup	Owner	إنشاء حساب وكالة	إنشاء CustomerAccount
Workspace Setup	Owner/Admin	إنشاء أول عميل	إنشاء Workspace
Members & Roles	Owner/Admin	دعوة وتعيين صلاحيات	RBAC + AuditLog
Billing & Usage Shell	Owner/BillingAdmin	عرض الخطة والاستخدام	Snapshot + Usage
Provider Settings Shell	Admin	عرض المزودين والنماذج	Provider registry baseline
Setup Checklist	Owner/Admin	توجيه أول تشغيل	تقدم واضح وحالات مكتملة
17.2 Phase 1 Screens
الشاشة	المستخدم الأساسي	الغرض	شرط الاكتمال
Dashboard	كل دور حسب الصلاحية	عرض ما يهم الدور	لا تعرض إجراءات غير مسموحة
Campaigns	Creator/Admin	إنشاء وإدارة الحملات	حملة من template أو brief
Brief Builder	Creator	تحويل المدخلات إلى BriefVersion	حفظ نسخة brief
Content Studio — Text	Creator	تشغيل text generation	MediaJob + MediaAsset
Content Studio — Image Placeholder	Creator	عرض أن الصور قادمة ومحكومة	لا تشغيل إنتاجي قبل Build Next
Content Studio — Video Placeholder	Creator	عرض أن الفيديو قادم ومحكوم	لا تشغيل إنتاجي قبل Controlled Launch
Review Queue	Reviewer	مراجعة كل أنواع الأصول	Approval decision
Publish Queue	Publisher	تسجيل النشر اليدوي	ManualPublishEvidence
Tracking Links	Creator/Publisher	إنشاء روابط تتبع	TrackedLink
Reports	Viewer/Admin	تقرير بسيط للعميل	ClientReportSnapshot
Integrations Shell	Admin	عرض الربط المستقبلي	Catalog + status shell
Operations Health Shell	Admin	عرض تنبيهات التشغيل	AdminNotification + SafeMode
17.3 Build Next Screens
الشاشة	الغرض
Image Studio	توليد/تحسين الصور وإدارة presets
Video Studio	توليد فيديو قصير من نص أو صورة
Media Library	إدارة الأصول النصية والبصرية والفيديو
Provider Health	صحة المزودين، الحصص، الفشل
Media Cost Dashboard	تكلفة النص/الصورة/الفيديو حسب Workspace
Media Compliance Queue	مراجعة حقوق ومخاطر المحتوى المرئي
---
18) Content Studio Requirements
18.1 Text Studio
campaign-aware generation.
brand voice aware.
channel variants.
hooks.
captions.
offers.
report narrative.
approval workflow.
18.2 Image Studio
prompt input.
style/preset selection.
aspect ratio.
variation count.
provider/model selection إذا كانت الخطة تسمح.
cost estimate قبل التوليد.
image preview.
review queue.
rights declaration.
compliance warning.
18.3 Video Studio
text-to-video.
image-to-video.
duration selection.
resolution selection.
platform target.
cost estimate.
queue state.
render progress.
preview.
approval قبل الاستخدام أو النشر.
failure explanation.
18.4 Brand Safety UX
warning if prompt violates policy.
warning if claim risk high.
warning if media style conflicts with brand.
warning if output rights are unclear.
---
19) Role-Based UX Lock
الدور	يسمح له	يمنع عنه
Owner	كل شيء	لا شيء إلا التفاصيل السرية غير اللازمة
Admin	Workspace, members, campaigns, providers, reports, integrations	الدفع الحساس إذا لم يكن BillingAdmin
Creator	briefs, generation, drafts, media assets	billing, publishing final, role management
Reviewer	review queue, approve/reject	billing, integrations, provider credentials
Publisher	publish queue, manual evidence	publish before approval, billing
BillingAdmin	plans, invoices, usage, cost, limits	content edit, publishing
Viewer	reports read-only	أي write action
19.1 قاعدة الواجهة
لا تعرض أزرار تنفيذية لدور لا يملك الصلاحية.
إذا ظهر منع، يجب أن يوضح السبب: permission / plan / quota / consent / safe_mode / provider_unavailable / cost_cap.
كل منع تجاري يسجل في FeatureAccessDecision.
كل منع أمني أو حساس يسجل في AuditLog.
---
20) API Priority List
20.1 Phase 0 APIs
POST /customer-accounts
GET /me
POST /workspaces
GET /workspaces
GET /workspaces/{id}
PATCH /workspaces/{id}
POST /workspaces/{id}/members
PATCH /workspace-members/{id}/role
GET /roles
GET /permissions
GET /plans
GET /subscriptions/current
GET /usage/current
POST /feature-access/check
GET /audit-log
GET /onboarding/progress
PATCH /onboarding/progress
GET /setup-checklist
PATCH /setup-checklist/{id}
GET /ai-providers
GET /ai-models
GET /provider-health
20.2 Phase 1 APIs
POST /campaigns
GET /campaigns
GET /campaigns/{id}
PATCH /campaigns/{id}
POST /campaigns/{id}/brief-versions
GET /campaigns/{id}/brief-versions
GET /campaign-templates
POST /media-jobs
GET /media-jobs/{id}
GET /media-assets
GET /media-assets/{id}
PATCH /media-assets/{id}
POST /review-tasks
GET /review-tasks
POST /review-tasks/{id}/decision
POST /channel-variants
GET /channel-variants
POST /tracked-links
GET /tracked-links
POST /publish-jobs
PATCH /publish-jobs/{id}
POST /manual-publish-evidence
POST /client-report-snapshots
GET /client-report-snapshots
GET /integration-catalog
GET /integration-connections
GET /operations-health
20.3 Build Next Media APIs
POST /media-jobs/image
POST /media-jobs/video
POST /media-jobs/image-enhancement
POST /media-assets/{id}/variants
GET /media-presets
POST /media-presets
POST /provider-connections/test
GET /provider-usage
GET /provider-quota
POST /media-quality-reviews
POST /media-compliance-checks
POST /media-rights-declarations
20.4 API Rules
كل API يجب أن يلتزم بالآتي:
workspace context إلزامي.
RBAC check قبل write.
FeatureGate check عند الميزات التجارية.
CostGuardrail check قبل image/video jobs.
Provider health check قبل jobs المعتمدة على مزود.
UsageMeter update عند الاستخدام القابل للفوترة.
CostEvent عند التكلفة الداخلية.
ProviderUsageLog عند استهلاك مزود.
AuditLog عند الإجراءات الحساسة.
idempotency key للعمليات القابلة للتكرار.
error response موحد.
20.5 Error Model
```json
{
  "code": "video_cost_cap_exceeded",
  "message": "This video generation exceeds the allowed cost limit for your current plan.",
  "user_action": "Reduce duration/resolution, wait for quota reset, or upgrade your plan.",
  "correlation_id": "req_123"
}
```
---
21) Storage & Asset Policy
21.1 Phase 1
Text assets تخزن في content_text.
Storyboards/scripts تخزن كنص أو JSON.
report snapshots تخزن كـ JSON ونص ملخص.
لا تخزين فيديو إنتاجي في Phase 1.
لا تخزين صور إنتاجية في Phase 1 إلا إذا تم تفعيل Build Next.
21.2 Build Next Storage
عند إدخال الصور أو الفيديو:
S3-compatible object storage.
signed URLs.
file metadata in DB.
preview variants.
thumbnails.
virus/malware scan للملفات المرفوعة.
retention policy.
workspace-based access control.
soft delete ثم hard delete وفق السياسة.
CDN اختياري حسب الاستخدام.
21.3 قواعد التخزين
لا تخزن أصول العملاء في public bucket.
لا تعرض asset دون authorization.
لا تشارك report أو media link دون token أو صلاحية.
كل حذف حساس يسجل في AuditLog.
---
22) Media Cost Governance
22.1 القاعدة
إنتاج الصور والفيديو ليس مجرد AI feature؛ هو financial risk domain.
لذلك يجب أن توجد سياسة تكلفة قبل التشغيل.
22.2 MediaCostPolicy
policy_id
workspace_id nullable
plan_id nullable
modality: text / image / video / audio
max_cost_per_job
max_monthly_cost
overage_allowed
action_on_exceed: warn / block / require_upgrade / require_admin_approval
active
22.3 MediaCostSnapshot
snapshot_id
workspace_id
period_start
period_end
text_cost
image_cost
video_cost
audio_cost
total_cost
gross_margin_estimate
created_at
22.4 Cost Rules
video job requires pre-check.
long duration video requires stronger warning or approval.
high resolution video may require higher plan.
failed job without usable output does not count as billable usage.
provider cost still records internally even when non-billable.
repeated failed provider jobs trigger SafeMode advisory or restricted.
---
23) AI Provider Matrix
23.1 Phase 1
Use Case	Provider مبدئي	Fallback	Cost Unit	Quality Signal
Campaign hooks	OpenAI أو Anthropic	cheaper model	tokens	approval rate
Captions Arabic/English	OpenAI أو Anthropic	Qwen hosted لاحقًا	tokens	edit distance + acceptance
Brief expansion	OpenAI أو Anthropic	same provider cheaper model	tokens	accepted_with_edit
Storyboard text	OpenAI أو Anthropic	template fallback	tokens	reviewer approval
Video script	OpenAI أو Anthropic	template fallback	tokens	approval rate
Report narrative	OpenAI أو Anthropic	template fallback	tokens	reviewer approval
23.2 Build Next
Use Case	Provider/API محتمل	OSS لاحق	Cost Unit	Quality Signal
Text-to-image	OpenAI Images / Stability / Ideogram / Fal / Replicate	FLUX / SDXL	image/job	approval + visual score
Image enhancement	Replicate / Fal / external APIs	Real-ESRGAN / SUPIR	image/job	before/after approval
Text-to-video	Runway / Kling / Luma / Pika / Replicate	Wan / HunyuanVideo / CogVideoX	video seconds/job	usable render rate
Image-to-video	Runway / Kling / Luma / Pika	Wan I2V pipelines	video seconds/job	approval + failure rate
23.3 قواعد AI
كل prompt له PromptTemplate version.
كل MediaJob يحفظ provider/model/version.
لا تعتبر مخرجات AI حقيقة.
لا نشر دون Approval.
لا احتساب استخدام قابل للفوترة إذا فشل job دون output مفيد.
عند فشل provider: retry محدود ثم fallback أو رسالة واضحة.
لا يتم تشغيل نموذج عالي التكلفة دون cost pre-check.
---
24) Review & Approval Model
24.1 ReviewTask يجب أن يدعم
text assets.
image assets.
video assets.
storyboard.
subtitle.
audio لاحقًا.
24.2 قواعد الموافقة
لا publish دون approved asset.
لا يستخدم video asset في تقرير أو نشر دون approval.
high-risk media يحتاج reviewer مناسب.
كل decision يسجل في Approval وAuditLog.
24.3 أسباب الرفض
off_brand.
low_quality.
legal_risk.
claim_risk.
wrong_format.
wrong_channel.
wrong_aspect_ratio.
unusable_duration.
bad_render.
hallucinated_visual_detail.
rights_unclear.
violates_policy.
---
25) Sprint 0–6 Build Plan
Sprint 0 — Technical Setup & Architecture Guardrails
المخرجات:
Repo structure.
Auth baseline.
Database migration system.
Workspace context middleware.
Error model.
Audit logging foundation.
Queue foundation.
Seed roles/permissions.
Provider abstraction skeleton.
معيار الخروج:
API skeleton يعمل.
workspace isolation middleware موجود.
audit event يمكن تسجيله.
provider registry موجود كهيكل.
Sprint 1 — Account, Workspace, RBAC
المخرجات:
CustomerAccount.
Workspace.
User.
WorkspaceMember.
Roles/Permissions.
Members & Roles UI.
معيار الخروج:
إنشاء وكالة وWorkspace.
دعوة عضو.
منع صلاحيات غير مسموحة.
Sprint 2 — Commercial + Provider Gate
المخرجات:
Plans.
Entitlements.
SubscriptionSnapshot.
FeatureGate.
UsageMeter.
UsageQuotaState.
CostEvent baseline.
AIProvider.
AIModelRegistry.
ProviderUsageLog baseline.
Billing & Usage shell.
معيار الخروج:
ميزة يمكن السماح بها أو منعها حسب الخطة.
usage يسجل.
provider/model يظهران في النظام.
block يظهر بسبب واضح.
Sprint 3 — Campaign & Brief
المخرجات:
Campaign.
CampaignTemplate.
BriefVersion.
Brief Builder.
Campaign dashboard.
Setup checklist integration.
معيار الخروج:
إنشاء حملة من template.
إنشاء brief.
checklist يتحدث تلقائيًا.
Sprint 4 — Text Generation + Review + Manual Publish
المخرجات:
PromptTemplate.
MediaJob text.
MediaAsset text.
ReviewTask.
Approval.
ChannelVariant.
TrackedLink.
PublishJob manual.
ManualPublishEvidence.
Basic ClientReportSnapshot.
معيار الخروج:
end-to-end flow كامل:
إنشاء Workspace.
إنشاء حملة.
إدخال Brief.
توليد محتوى نصي.
مراجعته.
اعتماده.
إنشاء رابط.
تسجيل نشر يدوي.
إصدار تقرير.
Sprint 5 — Image Generation Controlled Build
المخرجات:
Image MediaJob.
Image MediaAsset storage.
Image Studio.
Image presets.
Image cost policy.
Image review.
Provider health for image provider.
معيار الخروج:
يمكن توليد صورة عبر API في بيئة controlled.
يتم تسجيل التكلفة والاستخدام.
لا يتم الاستخدام دون approval.
Sprint 6 — Video Generation Controlled Build
المخرجات:
Video MediaJob.
Video asset lifecycle.
Text-to-video.
Image-to-video.
Video cost pre-check.
Video preview.
Video review.
Provider failure handling.
معيار الخروج:
يمكن توليد فيديو قصير ضمن حدود تكلفة واضحة.
يمكن فشل job دون كسر تجربة المستخدم.
لا يتم اعتماد الفيديو دون مراجعة.
---
26) QA Acceptance Matrix
الاختبار	معيار النجاح
Tenant isolation	مستخدم Workspace A لا يصل إلى B
RBAC Creator	Creator لا ينشر
RBAC Publisher	Publisher لا ينشر دون Approval
RBAC BillingAdmin	لا يعدل المحتوى
FeatureGate	تجاوز حد الخطة يعطي block واضح
UsageMeter	job ناجح يسجل مرة واحدة فقط
Failed AI job	لا يحسب usage قابل للفوترة
Provider failure	يسجل failure ولا يكسر النظام
Cost cap	يمنع image/video job عند تجاوز التكلفة
AuditLog	approval / role change / block تسجل
BriefVersion	لا يتم تعديله تاريخيًا
Media lineage	التحويلات تحفظ lineage
Manual Publish	لا يكتمل دون evidence
Report Snapshot	التقرير محفوظ ولا يتغير بعد توليده
SafeMode	restricted يمنع generation المكلف
Empty states	كل شاشة فارغة فيها إجراء واضح
Error model	كل خطأ يحتوي code/user_action/correlation_id
Media rights	media asset له source/rights status عند الحاجة
Video failure	فشل render يظهر برسالة قابلة للإجراء
---
27) Pilot Success / Failure Metrics
27.1 شروط دخول Pilot النصي
RBAC فعال.
FeatureGate فعال.
UsageMeter فعال.
AuditLog فعال.
Plan Snapshot فعال.
Text generation يعمل.
Review/Approval يعمل.
Manual Publish Evidence يعمل.
Basic Report Snapshot يعمل.
Tenant isolation test ناجح.
Backup path موجود.
Error model موحد.
27.2 شروط دخول Pilot الصور
Image provider connected.
Image cost cap فعال.
Image usage metering فعال.
Image storage policy فعال.
Image review فعال.
Rights declaration baseline.
Provider failure handling.
27.3 شروط دخول Pilot الفيديو
Video provider connected.
Video cost pre-check فعال.
Video duration/resolution limits.
Video storage policy.
Video review فعال.
Render failure handling.
SafeMode for runaway spend.
27.4 مؤشرات نجاح Pilot
المؤشر	الهدف
Time to First Campaign	أقل من 30 دقيقة
First Content Generated	خلال أول جلسة
Text Asset Approval Rate	40% فأعلى
Image Asset Approval Rate	30% فأعلى في controlled pilot
Video Usable Render Rate	50% فأعلى في controlled pilot
Manual Publish Evidence Adoption	60% فأعلى
TrackedLink Adoption	70% فأعلى
Report Snapshot Created	لكل حملة منشورة يدويًا
Cost per Accepted Asset	ضمن حد الخطة
Block Explanation Clarity	100% من حالات block واضحة
Critical Bugs	صفر في العزل والصلاحيات
27.5 مؤشرات فشل Pilot
يعتبر Pilot فاشلًا أو يحتاج إعادة تصميم إذا:
الوكالة لا تكمل أول حملة دون دعم مباشر.
أقل من 30% من الأصول النصية يتم اعتمادها.
الصور المنتجة غير قابلة للاستخدام تجاريًا بنسبة عالية.
الفيديو يفشل أو يكلف أكثر من القيمة المتوقعة.
المستخدمون يتجاوزون النظام ويستخدمون أدوات خارجية للتقرير.
تكلفة AI لكل أصل معتمد تتجاوز الهامش المتوقع.
تتكرر أخطاء الصلاحيات أو العزل.
لا تستخدم الوكالة TrackedLinks.
التقرير لا يضيف قيمة للعميل النهائي.
---
28) Go / No-Go Gate
28.1 Go إلى ERD
يسمح بالانتقال إلى ERD إذا تم اعتماد:
Scope Lock.
Full Capability Matrix.
Pricing Matrix تشمل النص والصور والفيديو.
Relationship Contract.
Provider Registry.
MediaJob / MediaAsset domain.
Phase 0/1 فقط كبناء أول.
API Priority List.
Storage Policy.
AI Provider Matrix.
Media Cost Policy.
28.2 Go إلى Build
يسمح بالبناء إذا توفر:
ERD Phase 0/1 مع media-ready design.
SQL migrations plan.
API contract.
Sprint 0–4 backlog.
QA acceptance matrix.
Definition of Done.
Provider abstraction skeleton.
28.3 Go إلى Image Production
لا يسمح بتفعيل الصور إنتاجيًا إلا إذا توفر:
Provider connected.
Cost cap.
Feature entitlement.
Usage metering.
Media storage.
Review/approval.
Rights baseline.
Provider health monitoring.
SafeMode.
28.4 Go إلى Video Production
لا يسمح بتفعيل الفيديو إنتاجيًا إلا إذا توفر:
Video provider connected.
Cost pre-check.
Duration/resolution limits.
Video storage.
Render failure handling.
Review/approval.
Usage and cost metering.
Provider health.
SafeMode for runaway spend.
28.5 No-Go
يمنع البناء إذا:
لم تحسم الباقات.
لم يحسم مصدر الفوترة.
لم تثبت علاقات البيانات.
لم يعرف الفريق ما هو خارج النطاق.
لم توجد اختبارات tenant isolation.
لم يعرف كل Epic متى يعتبر مكتملًا.
لم توجد سياسة تكلفة للصور والفيديو.
لم توجد طبقة Provider Abstraction.
---
29) الحكم النهائي
V5.6.3 بهذه الصيغة تجعل Marketing OS منتجًا متعدد الوسائط فعليًا، لا مجرد كاتب محتوى.
القيمة التنفيذية للوثيقة أنها تمنع خطأين متعاكسين:
تصغير المنتج أكثر من اللازم وتحويله إلى Text Generator.
تضخيم البناء أكثر من اللازم ومحاولة تنفيذ النص والصور والفيديو والتكاملات دفعة واحدة.
القرار التنفيذي النهائي:
تغطية كل القدرات في الوثيقة.
بناء Phase 0/1 أولًا.
تأسيس Provider Abstraction من البداية.
تشغيل النص أولًا.
إدخال الصور Controlled بعد استقرار Core.
إدخال الفيديو Controlled بعد ثبوت تكلفة وجودة مقبولة.
عدم فتح النشر الآلي أو Paid Execution أو AI Agents قبل قياس الاستخدام الحقيقي.
المسار التالي:
ERD Phase 0/1 مع Media-Ready Domain.
SQL Schema Phase 0/1.
API Contracts Phase 0/1 + Media API placeholders.
Sprint Backlog 0–4.
Internal Prototype للنص والتقارير.
Controlled Image Pilot.
Controlled Video Pilot.
مراجعة التسعير والاستخدام والهامش.
فتح Phase 2 للقياس المتقدم فقط بعد ثبوت استخدام فعلي.
---
30) Build-Readiness Patch — تصحيحات ملزمة قبل ERD/SQL/API
> هذا القسم ملزم ومقدّم على أي صياغة سابقة داخل الوثيقة إذا ظهر تعارض. الغرض منه تحويل V5.6.3 إلى وثيقة جاهزة للبناء، عبر تصحيح Relationship Contract، وإكمال دورة Review & Approval، وتثبيت قواعد Tenant Isolation.
---
30.1 الحكم التنفيذي للتصحيح
لا يبدأ ERD/SQL/API قبل اعتماد التصحيحات التالية:
اعتماد MediaJob ككيان التوليد الوحيد بدل أي استخدام مستقل لـ GenerationJob.
اعتماد MediaAsset ككيان الأصول الوحيد بدل أي استخدام مستقل لـ Asset.
تصحيح العلاقة إلى: MediaJob 1──0..N MediaAsset.
استبدال كيان Approval العام بكيان أوضح: ApprovalDecision.
إضافة الكيانات الناقصة لدورة المراجعة: ReviewAssignment, ReviewComment, ReviewPolicy, ApprovalStateTransition.
إلزام `workspace_id` مباشرة في كل الجداول التشغيلية الحساسة.
اعتماد الأدوار في Sprint 0/1 كـ Global System Roles دون Custom Roles.
تثبيت الاشتراك على مستوى CustomerAccount مع نسب الاستخدام والتكلفة إلى Workspace.
---
30.2 إزالة الازدواجية بين GenerationJob / MediaJob و Asset / MediaAsset
القرار
في V5.6.3 لا يتم بناء جداول مستقلة باسم:
GenerationJob
Asset
وتستخدم بدلًا منها:
MediaJob
MediaAsset
القاعدة
أي إشارة قديمة إلى GenerationJob في V5.5/V5.6.2/V5.6.3 تُترجم تنفيذيًا إلى MediaJob.
أي إشارة قديمة إلى Asset تُترجم تنفيذيًا إلى MediaAsset.
يمكن استعمال كلمة Asset في الواجهة أو اللغة العامة، لكن جدول قاعدة البيانات المعتمد هو MediaAsset.
السبب
وجود GenerationJob وMediaJob معًا سيخلق ازدواجية في التوليد والتكلفة والحالة. ووجود Asset وMediaAsset معًا سيخلق ازدواجية في المراجعة والنشر والتقارير.
---
30.3 Relationship Contract المصحح والملزم
أي ERD يجب أن يلتزم بالعلاقات التالية:
```text
CustomerAccount 1──N Workspace
CustomerAccount 1──N CustomerSubscription
CustomerSubscription 1──N CustomerSubscriptionSnapshot
SubscriptionPlan 1──N SubscriptionPlanVersion
SubscriptionPlanVersion 1──N PlanEntitlementVersion

Workspace 1──N WorkspaceMember
User 1──N WorkspaceMember
WorkspaceMember N──1 Role
Role M──N Permission through RolePermission

Workspace 1──N Campaign
Workspace 1──N BrandProfile
BrandProfile 1──N BrandVoiceRule
Campaign 1──N BriefVersion
Campaign 1──N CampaignStateTransition
Campaign 1──N MediaJob
BriefVersion 1──N MediaJob
MediaJob 1──0..N MediaAsset
Campaign 1──N MediaAsset
Workspace 1──N MediaAsset

MediaAsset 1──N ReviewTask
ReviewTask 1──N ReviewAssignment
ReviewTask 1──N ReviewComment
ReviewTask 1──0..1 ApprovalDecision
Workspace 1──N ReviewPolicy
MediaAsset 1──N ApprovalStateTransition

MediaAsset 1──N MediaRenderVariant
MediaAsset 1──N MediaQualityReview
MediaAsset 1──N MediaComplianceCheck
MediaAsset 1──N MediaRightsDeclaration
MediaAsset 1──N AssetLineage as parent
MediaAsset 1──N AssetLineage as child

MediaAsset 1──N ChannelVariant
ChannelVariant 1──N TrackedLink
ChannelVariant 1──N PublishJob
PublishJob 1──N ManualPublishEvidence

AIProvider 1──N AIModelRegistry
AIProvider 1──N AIProviderCredential
AIProvider 1──N ProviderUsageLog
AIProvider 1──N ProviderFailureEvent
AIModelRegistry 1──N MediaJob
AIModelRegistry 1──N ProviderUsageLog
Workspace 1──N ModelRoutingPolicy

Workspace 1──N UsageMeter
Workspace 1──N UsageQuotaState
Workspace 1──N FeatureAccessDecision
Workspace 1──N CostEvent
Workspace 1──N CostBudget
Workspace 1──N SafeModeState
Workspace 1──N AdminNotification
Workspace 1──N AuditLog

Campaign 1──N ClientReportSnapshot
ReportTemplate 1──N ClientReportSnapshot
```
---
30.4 تصحيح علاقة MediaJob وMediaAsset
العلاقة المعتمدة
```text
MediaJob 1──0..N MediaAsset
```
السبب
مهمة توليد واحدة قد تنتج:
عدة captions.
عدة image variations.
فيديو + thumbnail.
فيديو + subtitle.
storyboard + shot list.
image enhancement variants.
لذلك العلاقة القديمة `MediaJob 1──0..1 MediaAsset` غير صالحة للبناء لأنها ستجبر الفريق على إنشاء job جديد لكل variation، وهذا يضر التكلفة والتتبع وتجربة المستخدم.
---
30.5 MediaJob — الحقول المقفلة
media_job_id
workspace_id
customer_account_id nullable
campaign_id nullable
brief_version_id nullable
job_type: text / image / video / image_edit / image_to_video / upscale / enhancement / storyboard / subtitle / audio
provider_id
model_registry_id
routing_policy_id nullable
input_snapshot_json
prompt_template_id nullable
status: queued / running / succeeded / failed / blocked / cancelled
cost_event_id nullable
error_code nullable
created_by_user_id
created_at
completed_at
قواعد
لا يوجد MediaJob دون `workspace_id`.
أي MediaJob مكلف يمر عبر FeatureGate + CostGuardrail.
أي MediaJob يعتمد على مزود خارجي يسجل ProviderUsageLog عند النجاح أو ProviderFailureEvent عند الفشل.
MediaJob الفاشل دون output مفيد لا يحتسب كاستخدام قابل للفوترة، لكنه يسجل CostEvent إذا ترتبت تكلفة داخلية.
---
30.6 MediaAsset — الحقول المقفلة
media_asset_id
workspace_id
customer_account_id nullable
campaign_id nullable
media_job_id nullable
asset_type: text / image / video / thumbnail / storyboard / subtitle / audio / document
storage_ref nullable
content_text nullable
preview_ref nullable
mime_type nullable
duration_seconds nullable
width nullable
height nullable
language nullable
status: draft / in_review / approved / rejected / archived
risk_level: low / medium / high
created_by_user_id nullable
created_at
updated_at
قواعد
لا يوجد MediaAsset دون `workspace_id`.
`media_job_id` يمكن أن يكون nullable إذا كان الأصل مرفوعًا يدويًا من المستخدم.
`MediaAsset.status` حالة تشغيلية، لكنها ليست مصدر الحقيقة الوحيد للاعتماد.
مصدر الحقيقة للاعتماد هو ApprovalDecision المرتبط بـ ReviewTask.
---
30.7 Review & Approval Domain — الكيانات الملزمة
دورة Review & Approval لا تكتمل بوجود status على MediaAsset فقط. يجب أن تكون دورة مراجعة مستقلة قابلة للتدقيق وتدعم النص والصورة والفيديو.
---
30.7.1 ReviewTask
review_task_id
workspace_id
media_asset_id
campaign_id nullable
requested_by_user_id
assigned_to_user_id nullable
status: pending / in_review / approved / rejected / changes_requested / cancelled
priority: low / normal / high
due_at nullable
created_at
completed_at nullable
قواعد
لا يوجد ReviewTask دون `workspace_id`.
كل أصل يدخل المراجعة يجب أن ينشئ ReviewTask.
يمكن إنشاء ReviewTask جديدة عند تعديل الأصل بعد changes_requested.
---
30.7.2 ReviewAssignment
الغرض: دعم التعيين وإعادة التعيين والتصعيد، حتى لو بدأ Sprint 4 بتعيين واحد بسيط.
review_assignment_id
workspace_id
review_task_id
assigned_to_user_id
assigned_by_user_id
assignment_type: primary / secondary / compliance / quality
status: assigned / accepted / skipped / reassigned / completed
assigned_at
completed_at nullable
قواعد
يمكن استخدام assigned_to_user_id داخل ReviewTask كبداية بسيطة.
لكن ReviewAssignment هو الكيان المعتمد عند الحاجة إلى تعدد المراجعين أو التصعيد أو مراجعة الامتثال.
---
30.7.3 ReviewComment
الغرض: تسجيل ملاحظات المراجع قبل القرار أو عند طلب التعديل.
review_comment_id
workspace_id
review_task_id
media_asset_id
commenter_user_id
comment_text
comment_type: general / change_request / compliance / quality
created_at
قواعد
changes_requested يجب أن يحتوي ReviewComment واحدًا على الأقل.
ReviewComment لا يستبدل ApprovalDecision.
---
30.7.4 ApprovalDecision
ApprovalDecision هو مصدر الحقيقة لقرار الاعتماد أو الرفض.
approval_decision_id
workspace_id
review_task_id
media_asset_id
approver_user_id
decision: approved / rejected / changes_requested
reason_code nullable
notes nullable
decided_at
قواعد
ReviewTask 1──0..1 ApprovalDecision.
لا يسمح بتعدد قرارات نهائية لنفس ReviewTask.
عند changes_requested يمكن إنشاء ReviewTask جديدة بعد التعديل.
ApprovalDecision لا يستبدل AuditLog؛ كلاهما مطلوب.
Publisher لا يستطيع استخدام أو نشر MediaAsset إلا إذا كان آخر ApprovalDecision = approved.
---
30.7.5 ReviewPolicy
الغرض: منع دفن قواعد المراجعة داخل الكود.
review_policy_id
workspace_id
asset_type: text / image / video / storyboard / subtitle / audio / any
risk_level: low / medium / high / any
required_role
min_approvals
allow_self_approval
active
قواعد
high-risk media يجب أن يمر على Reviewer أو Compliance reviewer حسب السياسة.
self-approval ممنوع افتراضيًا إلا إذا سمحت السياسة صراحة.
يمكن البدء بسياسة واحدة بسيطة لكل Workspace ثم التوسع لاحقًا.
---
30.7.6 ApprovalStateTransition
الغرض: تتبع حالة الأصل تشغيليًا، وليس فقط تدقيقيًا.
transition_id
workspace_id
media_asset_id
review_task_id nullable
from_status
to_status
changed_by_user_id
reason_code nullable
created_at
قواعد
كل انتقال جوهري في حالة الأصل يجب أن يسجل هنا أو في AuditLog على الأقل.
الأفضل تسجيله هنا لأغراض التشغيل، وفي AuditLog لأغراض التدقيق.
---
30.8 AssetLineage — التصحيح المرحلي
النموذج المعتمد في Phase 0/1
lineage_id
workspace_id
parent_asset_id nullable
child_asset_id
media_job_id nullable
transformation_type
created_at
القاعدة
هذا النموذج مقبول في Phase 0/1 لأنه يغطي:
brief → caption.
caption → image prompt.
prompt → image.
image → enhanced image.
image → video.
storyboard → video.
تحذير معماري
قبل Video Studio المتقدم أو multi-input pipelines، يجب تقييم الانتقال إلى:
```text
AssetLineageGroup 1──N AssetLineageInput
AssetLineageGroup 1──N AssetLineageOutput
MediaJob 1──0..1 AssetLineageGroup
```
السبب: بعض الفيديوهات قد تعتمد على عدة مدخلات: صورة + prompt + brand preset + audio.
---
30.9 Tenant Isolation Fields Matrix
الجداول التالية يجب أن تحتوي `workspace_id` مباشرة:
الجدول	سبب الإلزام
Campaign	كيان عميل مباشر
BriefVersion	أمان واستعلام مباشر
CampaignStateTransition	تشغيل وتدقيق
MediaJob	تكلفة واستخدام وعزل
MediaAsset	أصل حساس
ReviewTask	Queue حسب Workspace
ReviewAssignment	تعيين مراجعين
ReviewComment	تعليقات داخلية
ApprovalDecision	قرار حساس
ApprovalStateTransition	تتبع حالة الأصل
ChannelVariant	محتوى قابل للنشر
TrackedLink	تتبع وأداء
PublishJob	نشر
ManualPublishEvidence	إثبات نشر
ClientReportSnapshot	تقرير عميل
MediaRenderVariant	أصل مشتق
MediaQualityReview	مراجعة جودة
MediaComplianceCheck	امتثال
MediaRightsDeclaration	حقوق وملكية
AssetLineage	تتبع أصل المحتوى
ProviderUsageLog	تكلفة لكل عميل
ProviderFailureEvent	عند ارتباط الفشل بعميل أو MediaJob
ProviderQuotaState	عند كون الحصة حسب Workspace
ModelRoutingPolicy	عند تخصيص السياسة للعميل
FeatureAccessDecision	منع/سماح تجاري
UsageMeter	فوترة
UsageQuotaState	حدود
CostEvent	تكلفة
CostBudget	ميزانية
SafeModeState	قفل Workspace
AdminNotification	تنبيهات تشغيلية
AuditLog	تدقيق
---
30.10 الجداول العالمية التي لا تحتاج workspace_id في Sprint 0/1
الجدول	السبب
AIProvider	كتالوج عام للمزودين
AIModelRegistry	كتالوج عام للنماذج
SubscriptionPlan	خطة عامة
SubscriptionPlanVersion	نسخة خطة عامة
PlanEntitlementVersion	استحقاقات خطة عامة
Permission	صلاحيات عامة
Role	أدوار نظامية عامة في Sprint 0/1
قاعدة مهمة
إذا تحولت أي من هذه الجداول لاحقًا إلى تخصيص على مستوى عميل أو Workspace، تتم إضافة `workspace_id nullable` أو `customer_account_id nullable` حسب المستوى الصحيح.
---
30.11 مستوى الاشتراك والفوترة
بما أن ICP هو وكالة تدير عدة عملاء، فإن الاشتراك يكون في البداية على مستوى:
```text
CustomerAccount
```
وليس على مستوى Workspace.
القاعدة
CustomerSubscription يرتبط بـ CustomerAccount.
CustomerSubscriptionSnapshot يرتبط بـ CustomerSubscription.
UsageMeter ينسب الاستخدام إلى Workspace.
CostEvent ينسب التكلفة إلى Workspace.
ProviderUsageLog ينسب استخدام المزود إلى Workspace.
التقارير والهامش يمكن تجميعها على مستوى CustomerAccount لاحقًا.
السبب
الوكالة تدفع كحساب واحد، لكن استهلاك كل عميل/Workspace يجب أن يبقى واضحًا لأغراض الهامش والتشغيل والتسعير.
---
30.12 Role Model Lock لـ Sprint 0/1
في Sprint 0/1، تعتمد الأدوار كـ global system roles:
Owner.
Admin.
Creator.
Reviewer.
Publisher.
BillingAdmin.
Viewer.
القواعد
لا يتم دعم Custom Roles في Sprint 0/1.
WorkspaceMember يرتبط بدور نظامي.
RolePermission يحدد صلاحيات كل دور.
دعم Custom Roles يؤجل حتى ثبوت الحاجة من Pilot.
السبب
Custom Roles في البداية تضيف تعقيدًا عاليًا على RBAC والاختبارات والواجهة دون قيمة مباشرة للـ Pilot.
---
30.13 Tenant Isolation Implementation Rules
قواعد قاعدة البيانات
إضافة index على `workspace_id` في الجداول التشغيلية الكبيرة.
إضافة composite indexes مثل:
workspace_id + campaign_id.
workspace_id + media_asset_id.
workspace_id + review_task_id.
workspace_id + publish_job_id.
منع الاعتماد على id فقط في endpoints.
استخدام UUID أو identifiers غير قابلة للتخمين.
قواعد API
كل endpoint تشغيلي يستنتج أو يستقبل workspace context.
لا يسمح بقراءة entity إذا لم تكن ضمن Workspaces المصرح بها للمستخدم.
لا يسمح بتغيير workspace_id بعد إنشاء الكيان.
أي محاولة وصول مرفوضة على كيان حساس تسجل في AuditLog أو SecurityLog لاحقًا.
اختبارات إلزامية
مستخدم في Workspace A لا يستطيع قراءة Campaign من Workspace B.
مستخدم في Workspace A لا يستطيع قراءة MediaAsset من Workspace B.
مستخدم في Workspace A لا يستطيع اتخاذ ApprovalDecision على ReviewTask من Workspace B.
Publisher لا يستطيع نشر أصل من Workspace آخر حتى لو عرف id.
BillingAdmin لا يستطيع تعديل محتوى حتى داخل Workspace مصرح به.
---
30.14 Sprint 0 — شروط الجاهزية بعد التصحيح
Sprint 0 قابل للتنفيذ بشرط أن يتضمن:
Workspace context middleware.
Global system roles.
Permission seed.
AuditLog foundation.
Provider registry skeleton.
Tenant isolation test harness.
Error model موحد.
معيار الخروج المعدل
API skeleton يعمل.
workspace isolation middleware موجود.
audit event يمكن تسجيله.
provider registry موجود كهيكل.
test يثبت أن Workspace A لا يقرأ بيانات Workspace B.
Role model محكوم كـ global system roles دون custom roles.
---
30.15 Sprint 1 — شروط الجاهزية بعد التصحيح
Sprint 1 قابل للتنفيذ بشرط أن يتضمن:
CustomerAccount.
Workspace.
User.
WorkspaceMember.
Role.
Permission.
RolePermission.
Members & Roles UI.
Workspace-scoped authorization middleware.
معيار الخروج المعدل
إنشاء وكالة وWorkspace.
دعوة عضو.
تعيين دور نظامي.
منع صلاحيات غير مسموحة.
منع IDOR بين Workspaces.
AuditLog يسجل تغييرات العضويات والصلاحيات.
---
30.16 Go / No-Go المعدل للبناء
Go إلى ERD
يسمح بالانتقال إلى ERD إذا تم اعتماد:
Relationship Contract المصحح.
MediaJob 1──0..N MediaAsset.
MediaJob وMediaAsset بدل GenerationJob وAsset.
ReviewTask / ReviewAssignment / ReviewComment / ApprovalDecision / ReviewPolicy.
Tenant Isolation Fields Matrix.
Role model كـ global system roles في Sprint 0/1.
CustomerAccount-level subscription مع Workspace-level usage attribution.
No-Go
يمنع ERD/SQL/API إذا:
بقيت علاقة MediaJob 1──0..1 MediaAsset.
بقي Approval ككيان عام دون ApprovalDecision.
لم تتم إضافة ReviewComment.
لم تتم إضافة ReviewPolicy.
لم يوضع workspace_id في جداول المراجعة والنشر والأصول والتكلفة.
بقي GenerationJob وMediaJob كجدولين منفصلين.
بقي Asset وMediaAsset كجدولين منفصلين.
لم توجد اختبارات Tenant Isolation قبل Sprint 1.
---
30.17 الحكم النهائي بعد التصحيح
بعد هذا التصحيح، تصبح V5.6.3 جاهزة للتحويل إلى:
ERD Phase 0/1.
SQL Schema Phase 0/1.
API Contracts Phase 0/1.
Sprint Backlog 0–4.
ولا يوجد مانع تقني جوهري لتنفيذ Sprint 0 وSprint 1 إذا التزم الفريق بما يلي:
Global system roles فقط في البداية.
Subscription على CustomerAccount.
Usage/Cost على Workspace.
MediaJob وMediaAsset ككيانات موحدة.
Review & Approval كدورة مستقلة.
workspace_id في كل الجداول التشغيلية الحساسة.
اختبارات عزل إلزامية قبل أي Pilot.
---
31) Phase 0/1 Consistency Patch — تصحيحات نهائية قبل البناء
> هذا القسم ملزم ومكمّل للقسم 30. الغرض منه إزالة أي تعارض متبقٍ بين الجداول، علاقات البيانات، الفوترة، صلاحيات الأدوار، واجهات API، وحدود Non-Scope داخل Phase 0/1.
---
31.1 الحكم التنفيذي
لا يتم إصدار ERD/SQL/API Contracts لـ Phase 0/1 إلا بعد الالتزام الصريح بهذه التصحيحات:
توحيد كل الكيانات التنفيذية حول `MediaJob` و`MediaAsset` فقط.
تعريف الحقول التجارية الحرجة لـ `UsageMeter`, `CostEvent`, `BillingProviderConfig`.
إضافة مصفوفة صلاحيات API إلزامية.
منع أي تشغيل إنتاجي للصور والفيديو داخل Phase 0/1.
إبقاء Provider Abstraction داخل Phase 0/1 كهيكل تحكّم، لا كتشغيل كامل للوسائط.
حصر التقرير الأساسي في Phase 1 دون Attribution أو ROI أو winner/scaling recommendations.
---
31.2 تصحيح تطابق الجداول مع Relationship Contract
القرار الملزم
أي جدول أو API أو ERD يشير إلى `GenerationJob` أو `Asset` كجداول مستقلة يعتبر غير معتمد في V5.6.3.
التسمية المعتمدة
المفهوم	الاسم التنفيذي المعتمد
مهمة توليد أو تحويل أو تحسين	MediaJob
أصل نصي أو صورة أو فيديو أو ملف مشتق	MediaAsset
قرار مراجعة	ApprovalDecision
تعليق مراجعة	ReviewComment
سياسة مراجعة	ReviewPolicy
قاعدة الترجمة
أي ذكر قديم	يترجم إلى
GenerationJob	MediaJob
Asset	MediaAsset
Approval	ApprovalDecision إذا كان المقصود قرار مراجعة
Publish Asset	Publish approved MediaAsset
---
31.3 Phase 0/1 Table Lock
الجداول المسموح ببنائها في Phase 0/1 فقط هي التالية.
31.3.1 Identity / Tenant / RBAC
CustomerAccount
Workspace
User
WorkspaceMember
Role
Permission
RolePermission
AuditLog
31.3.2 Commercial / Billing / Usage
SubscriptionPlan
SubscriptionPlanVersion
PlanEntitlementVersion
CustomerSubscription
CustomerSubscriptionSnapshot
BillingProviderConfig shell
FeatureGate
FeatureAccessDecision
UsageMeter
UsageQuotaState
CostEvent
CostBudget
CostGuardrail
MarginGuardrail baseline
SafeModeState
AdminNotification
31.3.3 Provider Foundation
AIProvider
AIModelRegistry
AIProviderCredential shell
ModelRoutingPolicy baseline
ProviderUsageLog
ProviderQuotaState baseline
ProviderFailureEvent
31.3.4 Campaign / Content / Review
BrandProfile
BrandVoiceRule
Campaign
CampaignTemplate
CampaignStateTransition
BriefVersion
PromptTemplate
MediaJob
MediaAsset
AssetLineage baseline
ReviewTask
ReviewAssignment
ReviewComment
ApprovalDecision
ReviewPolicy
ApprovalStateTransition
ChannelVariant
TrackedLink
PublishJob manual only
ManualPublishEvidence
ClientReportSnapshot basic
ReportTemplate baseline
31.3.5 UX / Setup / Integration Shells
OnboardingProgress
SetupChecklistItem
IntegrationCatalogItem shell
IntegrationConnection shell
IntegrationHealthSnapshot shell
---
31.4 جداول ممنوعة في Phase 0/1
لا تدخل الجداول التالية في Phase 0/1:
الجدول/الدومين	سبب المنع
AttributionDecision	خارج Phase 0/1 ويحتاج بيانات أداء
Advanced MetricConfidenceScore tables	Phase 2
CRM connector tables	V1.2 أو لاحقًا
Experiment tables	يحتاج sample size وقياس موثوق
PaidCampaign / AdAccount execution	Paid execution خارج V1
AI Agent tables	Post V1
WebhookEventInbox / DLQ للمنصات الاجتماعية	Phase 4، لا حاجة له قبل تكاملات حقيقية
WhiteLabelConfig	بعد ثبوت طلب تجاري
Advanced Media Pipeline tables	بعد Controlled Image/Video Pilot
استثناء محدود
يمكن بناء Provider foundation وMediaJob/MediaAsset كتصميم عام في Phase 0/1، لكن لا يتم تفعيل image/video production jobs.
---
32) Billing & Usage Field Lock
32.1 UsageMeter — الحقول المقفلة
`UsageMeter` هو مصدر الاستخدام التجاري القابل للفوترة أو الخاضع للحدود.
usage_meter_id
workspace_id
customer_account_id
subscription_id nullable
plan_version_id nullable
usage_type: text_job / image_job / video_job / report_snapshot / tracked_link / campaign / workspace / seat / api_call
quantity
billable_units
source_entity_type: media_job / report_snapshot / tracked_link / campaign / workspace_member / api_request
source_entity_id
period_start
period_end
recorded_at
idempotency_key
billing_status: pending / included / overage / non_billable / reversed
قواعد UsageMeter
كل job ناجح ينتج output مفيد يسجل UsageMeter مرة واحدة فقط.
الفشل دون output مفيد لا يسجل usage قابل للفوترة.
يجب استخدام `idempotency_key` لمنع التكرار.
كل UsageMeter يجب أن يحتوي `workspace_id` و`customer_account_id`.
الاستخدام ينسب إلى Workspace، حتى لو كان الاشتراك على مستوى CustomerAccount.
---
32.2 CostEvent — الحقول المقفلة
`CostEvent` هو مصدر التكلفة الداخلية، وليس مصدر الفاتورة الرسمية.
cost_event_id
workspace_id
customer_account_id
provider_id nullable
model_registry_id nullable
media_job_id nullable
cost_type: ai_text / ai_image / ai_video / storage / provider_api / internal_compute / other
internal_cost
currency
units
unit_type: token / image / second / minute / request / mb / gb / other
is_billable_to_customer
related_usage_meter_id nullable
created_at
قواعد CostEvent
CostEvent لا يعني أن العميل سيُفوتر مباشرة.
Billing لا يبنى من CostEvent.
عند فشل MediaJob مع تكلفة من المزود، يسجل CostEvent مع `is_billable_to_customer = false` إذا لم ينتج output مفيد.
يستخدم CostEvent لحماية الهامش، لا لإصدار الفاتورة.
---
32.3 BillingProviderConfig — الحقول المقفلة
`BillingProviderConfig` يربط حساب الوكالة بمزود الفوترة.
billing_provider_config_id
customer_account_id
workspace_id nullable
provider: paddle / stripe / lemon_squeezy / other
provider_account_ref
supported_currencies_json
tax_handling_mode: provider_managed / platform_managed / manual / not_applicable
webhook_secret_ref
status: active / disabled / failed / pending_setup
created_at
updated_at
قواعد BillingProviderConfig
في Phase 0/1 يكون الاشتراك على مستوى CustomerAccount.
`workspace_id` يبقى nullable لدعم حالات مستقبلية فقط.
الأسرار لا تخزن كنص صريح.
الفاتورة الرسمية تأتي من Billing Provider.
النظام الداخلي يحتفظ بالـ snapshot والusage والreconciliation لاحقًا، لكنه لا يصدر الفاتورة الرسمية في Phase 0/1.
---
32.4 CustomerSubscription — مستوى الاشتراك
customer_subscription_id
customer_account_id
billing_provider_config_id nullable
external_subscription_ref nullable
status: trial / active / past_due / cancelled / suspended
current_plan_version_id
current_period_start
current_period_end
created_at
updated_at
القاعدة
CustomerSubscription يرتبط بـ CustomerAccount لا Workspace في Phase 0/1.
---
32.5 CustomerSubscriptionSnapshot — مصدر الحقوق
snapshot_id
customer_subscription_id
customer_account_id
plan_version_id
entitlement_snapshot_json
pricing_snapshot_json
captured_at
القاعدة
FeatureGate يقرأ من CustomerSubscriptionSnapshot وPlanEntitlementVersion، وليس من اسم الخطة الحالي فقط.
---
32.6 قاعدة الفصل التجاري
العنصر	مصدر الحقيقة
الفاتورة الرسمية	BillingProvider
الاشتراك الحالي	CustomerSubscription
الحقوق والحدود	CustomerSubscriptionSnapshot + PlanEntitlementVersion
الاستخدام التجاري	UsageMeter
التكلفة الداخلية	CostEvent
استخدام المزود	ProviderUsageLog
حماية الهامش	CostGuardrail + MarginGuardrail
---
33) API Permission Matrix — Phase 0/1
> لا يعتمد الأمان على Role-Based UX فقط. كل endpoint يجب أن يملك Permission صريحًا، ويطبق RBAC في الخلفية.
33.1 Phase 0 APIs
API	الصلاحية المطلوبة	الأدوار المسموحة	FeatureGate	AuditLog
POST /customer-accounts	account.create	Owner أثناء التسجيل	لا	نعم
GET /me	self.read	كل الأدوار	لا	لا
POST /workspaces	workspace.create	Owner / Admin	نعم	نعم
GET /workspaces	workspace.read	كل الأدوار حسب العضوية	لا	لا
GET /workspaces/{id}	workspace.read	كل الأدوار حسب العضوية	لا	لا
PATCH /workspaces/{id}	workspace.update	Owner / Admin	لا	نعم
POST /workspaces/{id}/members	workspace.manage_members	Owner / Admin	نعم عند seat limit	نعم
PATCH /workspace-members/{id}/role	workspace.manage_members	Owner / Admin	لا	نعم
GET /roles	role.read	Owner / Admin	لا	لا
GET /permissions	permission.read	Owner / Admin	لا	لا
GET /plans	billing.read	Owner / BillingAdmin	لا	لا
GET /subscriptions/current	billing.read	Owner / BillingAdmin	لا	لا
GET /usage/current	usage.read	Owner / Admin / BillingAdmin	لا	لا
POST /feature-access/check	feature.check	النظام / Owner / Admin	لا	نعم عند block
GET /audit-log	audit.read	Owner / Admin	لا	نعم عند export لاحقًا
GET /onboarding/progress	onboarding.read	Owner / Admin	لا	لا
PATCH /onboarding/progress	onboarding.update	Owner / Admin	لا	نعم
GET /setup-checklist	onboarding.read	Owner / Admin	لا	لا
PATCH /setup-checklist/{id}	onboarding.update	Owner / Admin	لا	نعم
GET /ai-providers	provider.read	Owner / Admin	لا	لا
GET /ai-models	provider.read	Owner / Admin	لا	لا
GET /provider-health	provider.health.read	Owner / Admin	لا	لا
---
33.2 Phase 1 APIs
API	الصلاحية المطلوبة	الأدوار المسموحة	FeatureGate	AuditLog
POST /campaigns	campaign.create	Owner / Admin / Creator	نعم	نعم
GET /campaigns	campaign.read	كل الأدوار حسب العضوية	لا	لا
GET /campaigns/{id}	campaign.read	كل الأدوار حسب العضوية	لا	لا
PATCH /campaigns/{id}	campaign.update	Owner / Admin / Creator	لا	نعم
POST /campaigns/{id}/brief-versions	brief.create	Owner / Admin / Creator	لا	نعم
GET /campaigns/{id}/brief-versions	brief.read	Owner / Admin / Creator / Reviewer / Viewer	لا	لا
GET /campaign-templates	campaign_template.read	Owner / Admin / Creator	لا	لا
POST /media-jobs	media_job.create	Owner / Admin / Creator	نعم	نعم
GET /media-jobs/{id}	media_job.read	Owner / Admin / Creator / Reviewer	لا	لا
GET /media-assets	media_asset.read	كل الأدوار حسب العضوية	لا	لا
GET /media-assets/{id}	media_asset.read	كل الأدوار حسب العضوية	لا	لا
PATCH /media-assets/{id}	media_asset.update	Owner / Admin / Creator	لا	نعم
POST /review-tasks	review_task.create	Owner / Admin / Creator	لا	نعم
GET /review-tasks	review_task.read	Owner / Admin / Reviewer	لا	لا
POST /review-tasks/{id}/assignments	review_task.assign	Owner / Admin	لا	نعم
POST /review-tasks/{id}/comments	review_comment.create	Owner / Admin / Reviewer	لا	نعم
POST /review-tasks/{id}/decision	approval_decision.create	Owner / Admin / Reviewer	لا	نعم
GET /review-policies	review_policy.read	Owner / Admin / Reviewer	لا	لا
POST /review-policies	review_policy.manage	Owner / Admin	لا	نعم
POST /channel-variants	channel_variant.create	Owner / Admin / Creator	لا	نعم
GET /channel-variants	channel_variant.read	كل الأدوار حسب العضوية	لا	لا
POST /tracked-links	tracked_link.create	Owner / Admin / Creator / Publisher	نعم	نعم
GET /tracked-links	tracked_link.read	Owner / Admin / Creator / Publisher / Viewer	لا	لا
POST /publish-jobs	publish_job.create	Owner / Admin / Publisher	نعم	نعم
PATCH /publish-jobs/{id}	publish_job.update	Owner / Admin / Publisher	لا	نعم
POST /manual-publish-evidence	manual_publish_evidence.create	Owner / Admin / Publisher	لا	نعم
POST /client-report-snapshots	report_snapshot.create	Owner / Admin	نعم	نعم
GET /client-report-snapshots	report_snapshot.read	Owner / Admin / Viewer / BillingAdmin حسب الصلاحية	لا	لا
GET /integration-catalog	integration.read	Owner / Admin	لا	لا
GET /integration-connections	integration.read	Owner / Admin	لا	لا
GET /operations-health	operations_health.read	Owner / Admin	لا	لا
---
33.3 قواعد خاصة للأدوار
Creator
يسمح له بإنشاء Campaign وBrief وMediaJob وMediaAsset.
لا يسمح له بالنشر النهائي.
لا يسمح له بإدارة Billing أو Provider Credentials.
لا يسمح له باتخاذ ApprovalDecision إلا إذا كان أيضًا Reviewer بدور منفصل.
Reviewer
يسمح له بقراءة Review Queue.
يسمح له بالتعليق واتخاذ ApprovalDecision حسب ReviewPolicy.
لا يسمح له بإنشاء MediaJob.
لا يسمح له بالنشر أو الفوترة.
Publisher
يسمح له بإنشاء PublishJob وManualPublishEvidence.
لا يسمح له بالنشر إلا إذا كان آخر ApprovalDecision = approved.
لا يسمح له بتعديل المحتوى أو الفوترة.
BillingAdmin
يسمح له بقراءة الخطط والاستخدام والفوترة.
لا يسمح له بإنشاء Campaign أو MediaJob أو تعديل MediaAsset أو نشر المحتوى.
Viewer
read-only فقط.
لا يسمح له بأي POST/PATCH/DELETE.
---
33.4 قواعد API عامة
كل API تشغيلي يطبق Workspace Context.
كل write endpoint يطبق RBAC.
كل media/campaign/report endpoint يطبق Tenant Isolation.
كل job مكلف يطبق FeatureGate + CostGuardrail.
كل endpoint حساس ينتج AuditLog.
كل endpoint قد يتكرر يستخدم idempotency key.
---
34) Explicit Non-Scope Enforcement — Phase 0/1
34.1 القاعدة
القسم 4 Explicit Non-Scope يبقى حاكمًا على Phase 0/1. أي عنصر مذكور فيه لا يتم بناؤه إنتاجيًا في Phase 0/1.
---
34.2 الصور والفيديو في Phase 0/1
الصور والفيديو داخل الرؤية العامة لكن لا يتم تشغيلهما إنتاجيًا في Phase 0/1.
المسموح في Phase 0/1
MediaJob عام يدعم job_type كتصميم.
MediaAsset عام يدعم asset_type كتصميم.
Provider abstraction foundation.
AIProvider.
AIModelRegistry.
ModelRoutingPolicy baseline.
ProviderUsageLog baseline.
ProviderFailureEvent baseline.
CostGuardrail وMediaCostPolicy design.
Image Studio placeholder.
Video Studio placeholder.
الممنوع في Phase 0/1
تشغيل image generation production.
تشغيل video generation production.
تفعيل `POST /media-jobs/image` إنتاجيًا.
تفعيل `POST /media-jobs/video` إنتاجيًا.
تخزين فيديوهات إنتاجية.
video rendering lifecycle production.
image/video provider retries production.
image/video overage billing production.
قاعدة Feature Flag
أي API أو UI متعلق بإنتاج الصور والفيديو في Phase 0/1 يجب أن يكون:
```text
feature_flag = disabled
```
أو يعمل في بيئة داخلية فقط وليس لعميل Pilot.
---
34.3 النشر في Phase 0/1
المسموح
PublishJob manual فقط.
ManualPublishEvidence.
published_url يدويًا.
notes أو evidence بسيط.
الممنوع
Social API auto-publishing.
TikTok/Instagram/X/LinkedIn API publishing.
token lifecycle للإرسال الآلي.
retry publishing jobs.
platform webhook publishing confirmation.
---
34.4 القياس والتقارير في Phase 0/1
المسموح
ClientReportSnapshot basic.
campaign summary.
generated vs approved assets.
tracked links.
manual publish evidence.
basic usage/cost summary.
الممنوع
AttributionDecision.
ROI prediction.
MMM.
winner declaration.
scaling recommendation.
advanced MetricConfidenceScore.
conversion attribution claims.
قاعدة التقرير
أي تقرير في Phase 1 يجب أن يحتوي تحذيرًا ضمنيًا في التصميم:
> التقرير تشغيلي أولي ولا يثبت ROI أو attribution متقدم.
---
34.5 التكاملات في Phase 0/1
المسموح
Integration Catalog shell.
IntegrationConnection shell.
IntegrationHealthSnapshot shell.
Provider Health shell.
الممنوع
CRM connector production.
Social webhook reliability الكامل.
DLQ للمنصات الاجتماعية.
external sync production.
full connector credential lifecycle باستثناء provider skeleton عند الحاجة.
---
35) Phase 0/1 Build-Ready Decision
35.1 الحكم النهائي
بعد هذه التصحيحات، تعتبر V5.6.3 جاهزة للانتقال إلى:
ERD Phase 0/1.
SQL Schema Phase 0/1.
API Contracts Phase 0/1.
Sprint Backlog 0–4.
بشرط أن تكون الأقسام 30–35 حاكمة على أي تعارض سابق.
---
35.2 شروط عدم الانحراف
يمنع بدء البناء إذا حدث أحد الآتي:
استخدام GenerationJob كجدول مستقل.
استخدام Asset كجدول مستقل بدل MediaAsset.
تجاهل `workspace_id` في أي جدول تشغيلي حساس.
بناء image/video production داخل Phase 0/1.
بناء social API publishing داخل Phase 0/1.
بناء AttributionDecision داخل Phase 0/1.
السماح لـ Publisher بالنشر دون ApprovalDecision approved.
السماح لـ BillingAdmin بتعديل المحتوى.
السماح لـ Viewer بأي write action.
بناء Billing logic من CostEvent بدل UsageMeter وBillingProvider.
---
35.3 القرار التنفيذي النهائي المحدث
V5.6.3 الآن Build-Ready لمرحلة Phase 0/1 فقط.
لكن هذا الاعتماد مشروط بالالتزام الصارم بما يلي:
MediaJob وMediaAsset هما الكيانان المعتمدان للتوليد والأصول.
UsageMeter هو مصدر الاستخدام التجاري.
CostEvent هو مصدر التكلفة الداخلية.
BillingProvider هو مصدر الفاتورة الرسمية.
ApprovalDecision هو مصدر قرار الاعتماد.
workspace_id إلزامي في كل جداول التشغيل الحساسة.
الصور والفيديو مصممة في المعمارية لكنها غير مفعلة إنتاجيًا في Phase 0/1.
التقرير في Phase 1 تشغيلي أولي، وليس تقرير ROI أو Attribution.
---
36) Phase 0/1 Technical Architecture Patch — NestJS + PostgreSQL + Next.js/React
> هذا القسم ملزم عند تنفيذ Phase 0/1 باستخدام NestJS + PostgreSQL + Next.js/React. الغرض منه تحويل قرارات V5.6.3 إلى ضوابط هندسية تمنع تسريب بيانات Workspaces، وتمنع احتساب الاستخدام الفاشل، وتحمي أدلة النشر اليدوي من التلاعب.
---
36.1 الحكم التنفيذي التقني
اختيار NestJS + PostgreSQL + Next.js/React مناسب جدًا لـ Phase 0/1 بشرط ألا يتم التنفيذ كـ CRUD تقليدي.
يجب تنفيذ Phase 0/1 كـ Governed SaaS Core يعتمد على:
Workspace Context إلزامي في DB/API/UI.
RBAC backend enforcement.
FeatureGate قبل أي استخدام تجاري.
UsageMeter بعد النجاح فقط، وليس عند إنشاء الطلب.
CostEvent منفصل عن الفوترة التجارية.
AI generation عبر queue/worker لا request blocking.
ManualPublishEvidence بنمط append-only.
ClientReportSnapshot غير قابل للتغيير بعد الإصدار.
---
36.2 المخطط التقني المعتمد
```text
Next.js / React
│
│  Workspace-aware UI
│  Role-based navigation
│  Feature availability display
│  Block reason display
│
▼
NestJS API
│
├── AuthGuard
├── WorkspaceContextGuard
├── Membership Check
├── RBAC Permission Guard
├── FeatureGate Guard
├── CostGuardrail Check
├── Idempotency Middleware
├── AuditLog Interceptor
│
▼
Domain Services
│
├── Workspace Service
├── Campaign Service
├── MediaJob Service
├── MediaAsset Service
├── Review Service
├── Publishing Service
├── Usage Service
├── Cost Service
├── Billing Service
├── Provider Registry Service
│
▼
PostgreSQL
│
├── workspace_id enforced operational tables
├── composite indexes
├── optional RLS for high-risk tables
├── immutable evidence constraints
├── audit/event tables
│
▼
Queue Worker
│
├── AI generation jobs
├── Provider calls
├── CostEvent recording
├── ProviderUsageLog / ProviderFailureEvent
├── UsageMeter only after usable success
├── UsageQuotaState update
```
---
37) Tenant Isolation Engineering Rules
37.1 قاعدة العزل
لا يكفي عزل المستأجر في الواجهة. يجب فرض العزل عبر ثلاث طبقات:
```text
UI visibility
+ API authorization
+ DB-level workspace constraints
```
أي endpoint أو query لا يستخدم `workspace_id` في الجداول التشغيلية الحساسة يعتبر غير مقبول في Phase 0/1.
---
37.2 PostgreSQL Rules
37.2.1 workspace_id إلزامي
كل جدول تشغيلي حساس يجب أن يحتوي:
```sql
workspace_id UUID NOT NULL
```
ويشمل ذلك:
campaigns
brief_versions
campaign_state_transitions
media_jobs
media_assets
review_tasks
review_assignments
review_comments
approval_decisions
approval_state_transitions
channel_variants
tracked_links
publish_jobs
manual_publish_evidence
client_report_snapshots
usage_meter
cost_events
provider_usage_logs
feature_access_decisions
audit_logs
safe_mode_states
admin_notifications
---
37.2.2 الفهارس الإلزامية
يجب إضافة فهارس مركبة للجداول التشغيلية الكبيرة:
```sql
CREATE INDEX idx_campaigns_workspace_id
ON campaigns(workspace_id);

CREATE INDEX idx_media_assets_workspace_campaign
ON media_assets(workspace_id, campaign_id);

CREATE INDEX idx_media_jobs_workspace_status
ON media_jobs(workspace_id, status);

CREATE INDEX idx_review_tasks_workspace_asset
ON review_tasks(workspace_id, media_asset_id);

CREATE INDEX idx_approval_decisions_workspace_task
ON approval_decisions(workspace_id, review_task_id);

CREATE INDEX idx_publish_jobs_workspace_channel_variant
ON publish_jobs(workspace_id, channel_variant_id);

CREATE INDEX idx_manual_publish_evidence_workspace_publish_job
ON manual_publish_evidence(workspace_id, publish_job_id);

CREATE INDEX idx_usage_meter_workspace_period
ON usage_meter(workspace_id, period_start, period_end);

CREATE INDEX idx_cost_events_workspace_created_at
ON cost_events(workspace_id, created_at);
```
---
37.2.3 Row-Level Security
RLS ليس شرطًا لإطلاق أولي إذا كانت API enforcement قوية ومختبرة، لكنه موصى به للجداول الأعلى حساسية.
الجداول المرشحة لـ RLS مبكرًا:
media_assets
media_jobs
review_tasks
approval_decisions
manual_publish_evidence
client_report_snapshots
usage_meter
cost_events
مثال سياسة:
```sql
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY workspace_isolation_policy
ON media_assets
USING (workspace_id = current_setting('app.current_workspace_id')::uuid);
```
وفي NestJS داخل transaction:
```sql
SET LOCAL app.current_workspace_id = '<workspace-id>';
```
القرار
Phase 0/1 minimum: API-level enforcement + indexes + IDOR tests.
Recommended hardening: RLS للجداول الحساسة إذا كان الفريق متمكنًا.
---
37.3 NestJS Workspace Context Guard
كل request تشغيلي يجب أن يمر بالتسلسل التالي:
```text
Request
→ AuthGuard
→ WorkspaceContextGuard
→ Membership Check
→ RBAC Permission Guard
→ FeatureGate Guard when needed
→ Controller
→ Service
→ Repository with workspace_id filter
```
قاعدة الاستعلام
ممنوع:
```sql
SELECT * FROM campaigns WHERE campaign_id = $1;
```
المعتمد:
```sql
SELECT * FROM campaigns
WHERE campaign_id = $1
AND workspace_id = $2;
```
قاعدة الخدمة
أي service method لقراءة أو تعديل كيان تشغيلي يجب أن يستقبل `workspaceId` صراحة أو يأخذه من WorkspaceContext المعتمد.
---
37.4 Next.js / React Workspace-Aware UI
الواجهة لا تعتبر طبقة أمان نهائية، لكنها يجب أن تقلل أخطاء التشغيل.
المتطلبات
Workspace switcher واضح.
currentWorkspaceId محفوظ في application context.
كل API call تشغيلي يرسل workspace context أو route scoped workspace.
إخفاء الإجراءات غير المسموحة حسب الدور.
إظهار سبب المنع: permission / plan / quota / safe_mode / provider_unavailable / cost_cap.
منع عرض بيانات Workspace غير نشط أو غير مصرح.
قاعدة حاكمة
حتى إذا أخفت الواجهة زرًا، يجب أن يرفض NestJS الطلب غير المصرح به.
---
38) FeatureGate + UsageMeter Performance Architecture
38.1 المشكلة التي يجب منعها
لا يجوز أن يتحول كل request إلى سلسلة استعلامات ثقيلة على:
subscription
plan
entitlements
live usage counts
quota
cost budget
safe mode
هذا سيضعف الأداء ويجعل Content Studio بطيئًا.
---
38.2 التصميم المعتمد
```text
UsageMeter = سجل أحداث الاستخدام
UsageQuotaState = الحالة المجمعة السريعة
FeatureGateService = قرار السماح/المنع
FeatureAccessDecision = سجل القرار
```
القاعدة
FeatureGate لا يحسب usage live عبر COUNT على MediaJobs أو Reports. بل يقرأ من UsageQuotaState.
ممنوع:
```sql
SELECT COUNT(*) FROM media_jobs WHERE workspace_id = ...
```
داخل كل request.
المعتمد:
```text
Read UsageQuotaState by workspace_id + usage_type + period
```
---
38.3 FeatureGateService
مصادر القرار:
CustomerSubscriptionSnapshot
PlanEntitlementVersion
UsageQuotaState
SafeModeState
CostGuardrail
MediaCostPolicy عند الوسائط المكلفة
نتائج القرار:
allowed
warned
blocked
upgrade_required
approval_required
---
38.4 تدفق طلب MediaJob
```text
POST /media-jobs
│
├── AuthGuard
├── WorkspaceContextGuard
├── RBAC Guard: media_job.create
├── FeatureGate check
├── CostGuardrail pre-check
├── Idempotency check
├── Create MediaJob(status=queued)
├── Enqueue worker job
└── Return 202 Accepted
```
قاعدة مهمة
لا يتم تسجيل UsageMeter عند إنشاء MediaJob. يتم تسجيله فقط بعد نجاح job وإنتاج output مفيد.
---
38.5 تحديث UsageQuotaState
عند نجاح job:
```text
MediaJob succeeded
+ usable MediaAsset created
+ billable_result = true
→ create UsageMeter
→ increment UsageQuotaState transactionally
```
منع race condition
عند تحديث UsageQuotaState يجب استخدام transaction مع row-level lock:
```sql
SELECT * FROM usage_quota_state
WHERE workspace_id = $1
AND usage_type = $2
AND period_start = $3
FOR UPDATE;
```
ثم تحديث العداد داخل نفس transaction.
---
38.6 FeatureAccessDecision Logging
القرار	التسجيل
blocked	دائمًا
upgrade_required	دائمًا
approval_required	دائمًا
warned	للميزات التجارية الحساسة
allowed	للعمليات التجارية الحساسة فقط مثل media generation, report, tracked link
---
39) AI Generation Failure Handling
39.1 القاعدة الحاكمة
فشل AI Generation لا يجوز أن يؤدي إلى احتساب استخدام تجاري على العميل إذا لم ينتج output مفيد.
لكن إذا ترتبت تكلفة داخلية من المزود، يجب تسجيل CostEvent لحماية الهامش.
---
39.2 Worker Flow
```text
Worker starts
│
├── Load MediaJob by media_job_id + workspace_id
├── Verify status = queued
├── Set status = running
├── Re-check SafeMode
├── Re-check CostGuardrail for expensive jobs
├── Call provider
│
├── Provider success with usable output?
│   ├── yes
│   │   ├── Create MediaAsset
│   │   ├── Create CostEvent
│   │   ├── Create ProviderUsageLog
│   │   ├── Create UsageMeter
│   │   ├── Update UsageQuotaState
│   │   └── Set MediaJob = succeeded
│   │
│   └── no
│       ├── Set MediaJob = failed
│       ├── Create ProviderFailureEvent
│       ├── Create CostEvent if provider charged
│       ├── Do not create UsageMeter
│       └── Do not update UsageQuotaState
```
---
39.3 حالات الفشل والفوترة
الحالة	CostEvent	UsageMeter	الحكم
FeatureGate blocked before job	لا	لا	لا استخدام
Job cancelled before provider call	لا	لا	لا استخدام
Provider timeout before execution	لا غالبًا	لا	فشل غير مفوتر
Provider charged but no usable output	نعم	لا	تكلفة داخلية فقط
Corrupted render	نعم إن وجدت تكلفة	لا	لا يحتسب على العميل
Output generated and usable	نعم	نعم	استخدام تجاري
Output usable but reviewer rejected	نعم	نعم	تم إنتاج أصل قابل للمراجعة
Output failed compliance automatically	نعم	حسب السياسة	إذا كان output غير قابل للاستخدام بسبب خلل تقني فلا UsageMeter
---
39.4 حقول إضافية في MediaJob
لضبط الفوترة عند الفشل أو النجاح، تضاف الحقول التالية إلى MediaJob:
billable_result: boolean nullable
non_billable_reason nullable
provider_request_id nullable
retry_count default 0
last_failure_event_id nullable
قيم non_billable_reason
provider_timeout
no_usable_output
corrupted_render
cancelled_before_execution
blocked_by_feature_gate
blocked_by_cost_guardrail
provider_error
---
39.5 Idempotency
كل إنشاء MediaJob يجب أن يدعم `idempotency_key` لمنع:
تكرار jobs.
تكرار usage.
تكرار cost events.
قاعدة
`idempotency_key` يكون unique داخل:
```text
workspace_id + operation_type + idempotency_key
```
---
40) ManualPublishEvidence Immutability
40.1 الحكم التنفيذي
`ManualPublishEvidence` يجب أن يكون append-only أو شبه immutable. لا يسمح بتعديله مباشرة بعد حفظه.
السبب: هذا الكيان يمثل دليل نشر يدوي يدخل لاحقًا في ClientReportSnapshot وقد يستخدم في نزاع مع العميل.
---
40.2 ManualPublishEvidence — الحقول المعدلة
manual_publish_evidence_id
workspace_id
publish_job_id
channel_variant_id
submitted_by_user_id
published_url nullable
screenshot_ref nullable
external_post_id nullable
evidence_note nullable
content_hash nullable
submitted_at
locked_at nullable
superseded_by_evidence_id nullable
status: active / superseded / invalidated
---
40.3 القواعد
لا يسمح بتحديث published_url بعد الإنشاء.
لا يسمح بتحديث screenshot_ref بعد الإنشاء.
لا يسمح بتحديث external_post_id بعد الإنشاء.
لا يسمح بتحديث submitted_by_user_id بعد الإنشاء.
لا يسمح بتحديث submitted_at بعد الإنشاء.
التصحيح يتم عبر supersede لا update.
الإلغاء يتم عبر invalidate لا delete.
---
40.4 API المعتمد
مسموح:
POST /manual-publish-evidence
POST /manual-publish-evidence/{id}/supersede
POST /manual-publish-evidence/{id}/invalidate
GET /manual-publish-evidence/{id}
ممنوع في Phase 0/1:
PATCH /manual-publish-evidence/{id}
DELETE /manual-publish-evidence/{id}
---
40.5 Database Guard
يجب إضافة trigger يمنع تعديل الحقول الجوهرية.
```sql
CREATE TRIGGER prevent_manual_publish_evidence_mutation
BEFORE UPDATE ON manual_publish_evidence
FOR EACH ROW
EXECUTE FUNCTION prevent_immutable_evidence_fields_update();
```
الحقول المحمية:
published_url
screenshot_ref
external_post_id
submitted_by_user_id
submitted_at
content_hash
---
40.6 AuditLog
كل عملية على ManualPublishEvidence يجب أن تسجل:
create
supersede
invalidate
view_sensitive
export
---
40.7 ربط ClientReportSnapshot
عند إنشاء ClientReportSnapshot، يجب حفظ مرجع evidence وحالته وقت الإصدار:
```json
{
  "publish_job_id": "...",
  "manual_publish_evidence_id": "...",
  "published_url": "...",
  "submitted_at": "...",
  "evidence_hash": "...",
  "evidence_status_at_snapshot": "active"
}
```
القاعدة
لا يتغير التقرير القديم إذا تم supersede أو invalidate للـ evidence لاحقًا. يتم إنشاء تقرير جديد إذا لزم الأمر.
---
41) NestJS Module Architecture Lock
41.1 الهيكل المعتمد
```text
src/
├── auth/
├── workspace/
│   ├── workspace-context.guard.ts
│   ├── workspace.decorator.ts
│   └── membership.service.ts
│
├── rbac/
│   ├── permissions.guard.ts
│   ├── require-permission.decorator.ts
│   └── permission.service.ts
│
├── billing/
│   ├── feature-gate.service.ts
│   ├── usage-meter.service.ts
│   ├── quota-state.service.ts
│   ├── cost-event.service.ts
│   └── billing-provider-config.service.ts
│
├── ai-provider/
│   ├── provider-registry.service.ts
│   ├── model-registry.service.ts
│   ├── provider-health.service.ts
│   └── provider-usage.service.ts
│
├── media/
│   ├── media-job.service.ts
│   ├── media-asset.service.ts
│   ├── media-worker.processor.ts
│   └── asset-lineage.service.ts
│
├── review/
│   ├── review-task.service.ts
│   ├── review-assignment.service.ts
│   ├── review-comment.service.ts
│   ├── approval-decision.service.ts
│   └── review-policy.service.ts
│
├── publishing/
│   ├── publish-job.service.ts
│   └── manual-publish-evidence.service.ts
│
├── audit/
├── reports/
└── common/
    ├── idempotency/
    ├── errors/
    ├── interceptors/
    └── database/
```
---
41.2 Request Control Points
كل request تشغيلي يمر عبر:
```text
1. AuthGuard
2. WorkspaceContextGuard
3. Membership Check
4. RBAC Permission Guard
5. FeatureGate Guard when needed
6. CostGuardrail Check when needed
7. Idempotency Check when needed
8. Domain Service Validation
9. AuditLog Interceptor for sensitive actions
```
---
41.3 Worker Control Points
كل AI worker job يمر عبر:
```text
1. Load MediaJob by workspace_id
2. Re-check job status
3. Re-check SafeMode
4. Re-check CostGuardrail for expensive jobs
5. Call provider
6. Record ProviderUsageLog or ProviderFailureEvent
7. Record CostEvent if charged
8. Create MediaAsset if usable output
9. Record UsageMeter only if billable
10. Update UsageQuotaState transactionally
```
---
41.4 Publishing Control Points
كل PublishJob في Phase 1 يمر عبر:
```text
1. User must have publish_job.create
2. MediaAsset must belong to same workspace
3. Latest ApprovalDecision must be approved
4. Publish mode must be manual
5. ManualPublishEvidence is append-only
6. ClientReportSnapshot freezes evidence state
```
---
42) Phase 0/1 Technical Weakness Register
نقطة الضعف	الخطر	التغطية الهندسية الملزمة
نسيان workspace_id في query	تسريب بيانات بين Workspaces	WorkspaceContextGuard + repository filters + IDOR tests + RLS للجداول الحساسة إن أمكن
الاعتماد على UI لإخفاء الأزرار	تجاوز الصلاحيات عبر API	RBAC Guard على كل endpoint
FeatureGate باستعلامات live ثقيلة	بطء الطلبات	UsageQuotaState + FeatureGateService + cache قصير
احتساب usage عند إنشاء job	فوترة على jobs فاشلة	UsageMeter بعد success + usable output فقط
AI provider يفشل بعد تكلفة	خسارة داخلية أو نزاع	CostEvent داخلي + لا UsageMeter إذا لا يوجد output مفيد
تكرار request	duplicate jobs/usage	idempotency_key
race condition في quota	تجاوز حدود الخطة	transaction + row-level lock على UsageQuotaState
SafeMode لا يطبق في worker	توليد مكلف رغم الحظر	worker يعيد فحص SafeMode قبل provider call
Publisher ينشر أصلًا غير معتمد	خطر حوكمة وسمعة	التحقق من ApprovalDecision approved
ManualPublishEvidence قابل للتعديل	تزوير تقارير أو نزاع	append-only + trigger + supersede/invalidate
ClientReportSnapshot يتغير	نزاع مع العميل	immutable snapshot
BillingAdmin يعدل محتوى	خلط صلاحيات	API Permission Matrix
Viewer ينفذ write action	خلل أمني	read-only permissions + tests
Provider secrets تتسرب	خطر أمني كبير	secret_ref فقط + Secret Manager/KMS
---
43) Phase 0/1 Technical Go / No-Go
43.1 Go
يسمح بالانتقال إلى بناء Phase 0/1 إذا تحقق الآتي:
PostgreSQL schema يحتوي workspace_id في كل الجداول التشغيلية الحساسة.
NestJS يحتوي WorkspaceContextGuard.
كل endpoint له permission واضح.
UsageQuotaState موجود ولا يتم الاعتماد على live COUNT في FeatureGate.
MediaJob async queue جاهزة.
AI failure لا يسجل UsageMeter دون output مفيد.
ManualPublishEvidence append-only.
ClientReportSnapshot immutable.
IDOR tests موجودة لـ Workspaces.
---
43.2 No-Go
يمنع البناء أو Pilot إذا حدث أحد الآتي:
أي query تشغيلي يعتمد على entity id دون workspace_id.
FeatureGate يحسب الاستخدام من جداول الأحداث مباشرة في كل request.
UsageMeter يسجل عند إنشاء MediaJob بدل النجاح.
Worker لا يعيد فحص SafeMode/CostGuardrail.
ManualPublishEvidence يسمح بـ PATCH/DELETE.
Publisher يستطيع إنشاء PublishJob لأصل غير approved.
BillingAdmin يملك صلاحية تعديل MediaAsset.
Viewer يستطيع تنفيذ POST/PATCH/DELETE.
---
43.3 الحكم النهائي التقني
مع هذه التصحيحات، تصبح V5.6.3 قابلة للتنفيذ هندسيًا باستخدام:
NestJS للـ API والـ Guards والـ Workers.
PostgreSQL للعلاقات، العزل، الفهارس، وسجلات التدقيق.
Next.js/React للواجهة القائمة على Workspace والدور.
لكن الاعتماد مشروط بأن يتم بناء النظام كـ SaaS محكوم، لا CRUD تقليدي.
---
END
44) Phase 0 Core Entity Field Lock — Tenant Isolation Patch
> هذا القسم ملزم ومقدم على أي جدول أو علاقة سابقة إذا ظهر تعارض. الغرض منه إغلاق الفجوة التنفيذية التي قد تظهر عند تحويل الوثيقة إلى ERD/SQL بسبب ذكر بعض جداول Phase 0 كأسماء دون Field Lock تفصيلي.
44.1 الحكم التنفيذي
لا يسمح بالانتقال إلى ERD/SQL/API قبل قفل الحقول التالية في Core Entities الخاصة بالمرحلة 0/1.
القاعدة الحاكمة:
```text
CustomerAccount = مستوى الوكالة / الحساب التجاري الدافع
Workspace = مستوى العميل أو المساحة التشغيلية داخل الوكالة
كل كيان تشغيلي حساس يجب أن يحمل workspace_id مباشرة
كل كيان تجاري أو تكلفة أو استخدام يجب أن يحمل customer_account_id مباشرة أو بقيد مشتق غير قابل للكسر
```
أي جدول تشغيلي حساس لا يحتوي `workspace_id` يعتبر No-Go.
أي جدول استخدام/تكلفة/فوترة/حصة لا يحتوي `customer_account_id` يعتبر No-Go إلا إذا كان جدولًا عالميًا صريحًا مثل `SubscriptionPlan` أو `AIProvider`.
---
44.2 CustomerAccount — الحقول المقفلة
`CustomerAccount` هو جذر الحساب التجاري للوكالة.
customer_account_id
account_name
account_type: agency / brand / enterprise / internal
status: active / suspended / cancelled / pending_setup
primary_owner_user_id nullable
billing_email nullable
default_currency nullable
created_at
updated_at
قواعد
لا يوجد اشتراك في Phase 0/1 دون `customer_account_id`.
لا يوجد Workspace دون `customer_account_id`.
يمكن أن يسبق CustomerAccount إنشاء أول Workspace.
أي تعطيل لـ CustomerAccount يجب أن ينعكس على Workspaces التابعة عبر SafeMode أو access block.
---
44.3 Workspace — الحقول المقفلة
`Workspace` يمثل العميل أو المساحة التشغيلية داخل حساب الوكالة.
workspace_id
customer_account_id NOT NULL
workspace_name
workspace_type: client / internal / demo / sandbox
status: active / archived / suspended / pending_setup
default_locale nullable
default_timezone nullable
created_by_user_id nullable
created_at
updated_at
قواعد
`customer_account_id` إلزامي في Workspace.
لا يسمح بتغيير `customer_account_id` بعد إنشاء Workspace.
كل قراءة أو كتابة لكيان تشغيلي يجب أن تمر عبر `workspace_id`.
حذف Workspace في Phase 0/1 يكون soft delete أو archive فقط، وليس hard delete.
قيود قاعدة البيانات
```sql
ALTER TABLE workspaces
ADD CONSTRAINT fk_workspaces_customer_account
FOREIGN KEY (customer_account_id) REFERENCES customer_accounts(customer_account_id);

CREATE INDEX idx_workspaces_customer_account
ON workspaces(customer_account_id);
```
---
44.4 User — الحقول المقفلة
`User` كيان هوية عام. لا يحمل `workspace_id` لأنه قد يكون عضوًا في أكثر من Workspace.
user_id
email
display_name nullable
status: active / invited / disabled
last_login_at nullable
created_at
updated_at
قواعد
لا تعتمد الصلاحيات على User وحده.
صلاحية المستخدم داخل النظام تأتي من `WorkspaceMember` و`RolePermission`.
أي endpoint تشغيلي يجب أن يتحقق من عضوية المستخدم في Workspace المطلوب.
---
44.5 WorkspaceMember — الحقول المقفلة
`WorkspaceMember` هو مصدر عضوية المستخدم داخل Workspace.
workspace_member_id
customer_account_id NOT NULL
workspace_id NOT NULL
user_id NOT NULL
role_id NOT NULL
status: invited / active / disabled / removed
invited_by_user_id nullable
joined_at nullable
created_at
updated_at
قواعد
يجب أن يحمل `workspace_id` و`customer_account_id` معًا.
يمكن اشتقاق `customer_account_id` من Workspace، لكن تخزينه هنا إلزامي لتقليل أخطاء الاستعلامات وتسهيل التدقيق.
يجب منع إدخال `customer_account_id` لا يطابق CustomerAccount الخاص بالـ Workspace.
لا يسمح بتعيين Role غير نظامي في Sprint 0/1.
قيود قاعدة البيانات
```sql
CREATE UNIQUE INDEX uq_workspace_member_user
ON workspace_members(workspace_id, user_id)
WHERE status IN ('invited', 'active');

CREATE INDEX idx_workspace_members_customer_workspace
ON workspace_members(customer_account_id, workspace_id);
```
قيد تطابق CustomerAccount
يجب تطبيق أحد الخيارين:
Composite FK بين `(workspace_id, customer_account_id)` و`workspaces(workspace_id, customer_account_id)`.
Trigger يمنع اختلاف `customer_account_id` في `workspace_members` عن Workspace المالكة.
---
44.6 Role / Permission / RolePermission — الحقول المقفلة
في Sprint 0/1، هذه جداول نظامية عامة وليست مخصصة لكل Workspace.
Role
role_id
role_key: owner / admin / creator / reviewer / publisher / billing_admin / viewer
role_name
is_system_role default true
active
created_at
updated_at
Permission
permission_id
permission_key
description nullable
category nullable
active
created_at
updated_at
RolePermission
role_permission_id
role_id
permission_id
created_at
قواعد
لا تضف `workspace_id` لهذه الجداول في Sprint 0/1.
لا تدعم Custom Roles في Sprint 0/1.
إذا أضيفت Custom Roles لاحقًا، يجب إنشاء `WorkspaceRole` منفصل أو إضافة `workspace_id nullable` مع قواعد صارمة تمنع خلط النظامي بالمخصص.
---
44.7 AuditLog — الحقول المقفلة
`AuditLog` هو سجل تدقيق، وليس بديلًا عن جداول الحالة التشغيلية.
audit_log_id
customer_account_id nullable
workspace_id nullable
actor_user_id nullable
actor_workspace_member_id nullable
action
target_entity_type
target_entity_id nullable
target_workspace_id nullable
risk_level: low / medium / high / critical
ip_address nullable
user_agent nullable
before_snapshot_json nullable
after_snapshot_json nullable
metadata_json nullable
correlation_id nullable
created_at
قواعد
أي حدث تشغيلي داخل Workspace يجب أن يحتوي `workspace_id NOT NULL`.
أي حدث متعلق بالفوترة أو الاشتراك يجب أن يحتوي `customer_account_id NOT NULL`.
أحداث النظام العامة يمكن أن تكون `workspace_id nullable` بشرط وجود سبب واضح في `metadata_json`.
محاولات الوصول المرفوضة بين Workspaces يجب أن تسجل كـ high أو critical حسب الحساسية.
---
44.8 FeatureAccessDecision — الحقول المقفلة
feature_access_decision_id
customer_account_id NOT NULL
workspace_id NOT NULL
subscription_id nullable
plan_version_id nullable
feature_key
decision: allowed / warned / blocked / upgrade_required / approval_required
reason_code
source_entity_type nullable
source_entity_id nullable
requested_by_user_id nullable
correlation_id nullable
created_at
قواعد
كل block تجاري يجب أن يسجل.
كل allow لعملية مكلفة مثل MediaJob أو Report Snapshot يجب أن يسجل.
لا يسمح بسجل FeatureAccessDecision دون `workspace_id` في العمليات التشغيلية.
---
44.9 UsageQuotaState — الحقول المقفلة
usage_quota_state_id
customer_account_id NOT NULL
workspace_id NOT NULL
subscription_id nullable
plan_version_id nullable
usage_type: text_job / image_job / video_job / report_snapshot / tracked_link / campaign / workspace / seat / api_call
period_start
period_end
used_quantity
included_limit nullable
overage_limit nullable
status: normal / near_limit / exceeded / blocked
last_usage_meter_id nullable
updated_at
قواعد
FeatureGate يقرأ من UsageQuotaState، لا من `COUNT(*)` على الجداول التشغيلية.
تحديث UsageQuotaState يجب أن يكون transactionally مع UsageMeter.
يجب استخدام row-level lock عند تحديث الحصة.
`customer_account_id` إلزامي لأن الاشتراك على مستوى CustomerAccount.
`workspace_id` إلزامي لأن الاستهلاك منسوب إلى Workspace.
---
44.10 CostBudget / CostGuardrail / MarginGuardrail — الحقول المقفلة
CostBudget
cost_budget_id
customer_account_id NOT NULL
workspace_id nullable
scope: customer_account / workspace
budget_type: monthly / weekly / campaign / media_type
currency
limit_amount
used_amount_snapshot nullable
status: active / exceeded / disabled
created_at
updated_at
CostGuardrail
cost_guardrail_id
customer_account_id NOT NULL
workspace_id nullable
scope: customer_account / workspace
modality: text / image / video / audio / all
max_cost_per_job nullable
max_period_cost nullable
action_on_exceed: warn / block / require_upgrade / require_admin_approval
active
created_at
updated_at
MarginGuardrail
margin_guardrail_id
customer_account_id NOT NULL
workspace_id nullable
scope: customer_account / workspace
min_gross_margin_percent
action_on_breach: warn / block / require_upgrade / require_admin_approval
active
created_at
updated_at
قواعد
إذا كان `scope = workspace` فيجب أن يكون `workspace_id NOT NULL`.
إذا كان `scope = customer_account` يمكن أن يكون `workspace_id nullable`.
لا يسمح بتشغيل video/image job مكلف دون CostGuardrail فعال.
---
44.11 SafeModeState — الحقول المقفلة
safe_mode_state_id
customer_account_id NOT NULL
workspace_id nullable
scope: customer_account / workspace
status: normal / restricted / blocked
reason_code
applied_by_user_id nullable
applied_at
expires_at nullable
created_at
updated_at
قواعد
إذا كان SafeMode على Workspace، يجب أن يحمل `workspace_id`.
إذا كان SafeMode على CustomerAccount، يطبق على كل Workspaces التابعة.
Worker يجب أن يعيد فحص SafeMode قبل أي Provider Call مكلف.
---
44.12 AdminNotification — الحقول المقفلة
admin_notification_id
customer_account_id nullable
workspace_id nullable
severity: info / warning / critical
category: billing / usage / provider / security / review / publishing / system
title
message
source_entity_type nullable
source_entity_id nullable
status: unread / read / dismissed / resolved
created_at
resolved_at nullable
قواعد
تنبيهات Workspace التشغيلية يجب أن تحمل `workspace_id`.
تنبيهات الاشتراك أو التعليق على مستوى الوكالة يجب أن تحمل `customer_account_id`.
---
44.13 ProviderUsageLog — التصحيح الملزم
يضاف `customer_account_id` إلى ProviderUsageLog.
provider_usage_id
customer_account_id NOT NULL
workspace_id NOT NULL
provider_id
model_registry_id
media_job_id nullable
usage_type
request_count
input_units
output_units
internal_cost
currency nullable
billable_units
created_at
السبب
استخدام المزود يحدث داخل Workspace، لكن تحليل الهامش والتكلفة يتم أيضًا على مستوى CustomerAccount. عدم وجود `customer_account_id` سيضعف مراقبة الهامش للوكالة كحساب دافع واحد.
---
44.14 ProviderFailureEvent — التصحيح الملزم
failure_event_id
customer_account_id nullable
workspace_id nullable
provider_id
model_registry_id nullable
media_job_id nullable
failure_type
error_code
severity
retryable
occurred_at
قواعد
إذا كان الفشل مرتبطًا بـ MediaJob، يجب أن يكون `customer_account_id` و`workspace_id` غير فارغين.
إذا كان الفشل عامًا للمزود ولا يرتبط بعميل، يمكن تركهما nullable.
أي فشل أدى إلى CostEvent يجب أن يمكن ربطه بـ Workspace وCustomerAccount.
---
45) Tenant Isolation Constraints & Query Contract
45.1 قاعدة الاستعلام الصارمة
ممنوع في أي repository أو service:
```sql
SELECT * FROM media_assets WHERE media_asset_id = $1;
```
المعتمد:
```sql
SELECT * FROM media_assets
WHERE media_asset_id = $1
AND workspace_id = $2;
```
وللجداول التجارية/الحصص:
```sql
SELECT * FROM usage_quota_state
WHERE workspace_id = $1
AND customer_account_id = $2
AND usage_type = $3
AND period_start = $4;
```
---
45.2 قاعدة المفاتيح المركبة
عند وجود `workspace_id` و`customer_account_id` في جدول تشغيلي، يجب استخدامهما معًا في عمليات القراءة والكتابة الحساسة.
أمثلة فهارس إلزامية:
```sql
CREATE INDEX idx_usage_quota_state_customer_workspace_period
ON usage_quota_state(customer_account_id, workspace_id, usage_type, period_start, period_end);

CREATE INDEX idx_feature_access_decisions_customer_workspace
ON feature_access_decisions(customer_account_id, workspace_id, created_at);

CREATE INDEX idx_provider_usage_logs_customer_workspace
ON provider_usage_logs(customer_account_id, workspace_id, created_at);

CREATE INDEX idx_audit_logs_customer_workspace
ON audit_logs(customer_account_id, workspace_id, created_at);
```
---
45.3 قاعدة منع تغيير الملكية
يمنع تغيير الحقول التالية بعد الإنشاء في الجداول التشغيلية:
customer_account_id
workspace_id
created_by_user_id في الجداول التي تمثل إجراءً تاريخيًا
submitted_by_user_id في ManualPublishEvidence
source ownership fields
أي تصحيح ملكية يتم عبر migration إدارية موثقة، وليس عبر API عادي.
---
45.4 Tenant Isolation Test Cases إلزامية
يجب أن يحتوي test suite قبل Sprint 1 على الأقل على الاختبارات التالية:
مستخدم في Workspace A لا يقرأ Campaign من Workspace B.
مستخدم في Workspace A لا يقرأ MediaAsset من Workspace B.
مستخدم في Workspace A لا ينشئ ReviewTask على أصل في Workspace B.
Reviewer في Workspace A لا يصدر ApprovalDecision على ReviewTask في Workspace B.
Publisher في Workspace A لا ينشئ PublishJob على ChannelVariant في Workspace B.
BillingAdmin لا يقرأ UsageQuotaState إلا للـ Workspaces التابعة لحسابه.
FeatureGate لا يسمح بتجاوز حدود Workspace عبر تغيير workspace_id في الطلب.
محاولة IDOR تسجل في AuditLog كحدث أمني.
---
46) Approval Integrity Patch — MediaAssetVersion Lock
> هذا القسم يعالج الثغرة المنطقية الأخطر: اعتماد أصل ثم تعديله لاحقًا ونشره بناءً على ApprovalDecision قديم لا يطابق المحتوى المنشور.
46.1 الحكم التنفيذي
لا يكفي أن يرتبط `ApprovalDecision` بـ `media_asset_id` فقط. يجب أن يرتبط الاعتماد بنسخة محددة من المحتوى.
لذلك تعتمد V5.6.4 كيانًا خفيفًا إلزاميًا:
```text
MediaAsset 1──N MediaAssetVersion
ReviewTask N──1 MediaAssetVersion
ApprovalDecision N──1 MediaAssetVersion
ChannelVariant N──1 MediaAssetVersion
PublishJob N──1 MediaAssetVersion
```
---
46.2 MediaAssetVersion — كيان إلزامي في Phase 1
media_asset_version_id
customer_account_id NOT NULL
workspace_id NOT NULL
media_asset_id NOT NULL
version_number
content_hash NOT NULL
content_text nullable
storage_ref nullable
preview_ref nullable
metadata_snapshot_json nullable
created_by_user_id nullable
created_at
superseded_at nullable
status: draft / in_review / approved / rejected / superseded / archived
قواعد
لا يسمح بمراجعة أو نشر MediaAsset دون MediaAssetVersion.
كل تعديل جوهري على `content_text`, `storage_ref`, `preview_ref`, أو media metadata ينتج نسخة جديدة.
النسخة المعتمدة لا تعدل.
إذا تغير المحتوى بعد الاعتماد، ينشأ `media_asset_version_id` جديد وتعود الدورة إلى review.
`content_hash` يجب أن يحسب من المحتوى الفعلي أو مرجع التخزين والميتا الحرجة.
---
46.3 تعديل MediaAsset
يبقى `MediaAsset` كحاوية عامة للأصل، لكنه لا يمثل وحده النسخة القابلة للنشر.
تضاف أو تؤكد الحقول التالية:
current_version_id nullable
latest_approved_version_id nullable
status: draft / in_review / approved / rejected / archived
updated_at
قواعد
`MediaAsset.status` حالة تشغيلية مجمعة.
مصدر الحقيقة للنشر هو `latest_approved_version_id` أو ApprovalDecision المرتبط بالنسخة.
لا يسمح لـ Publisher بالنشر اعتمادًا على `MediaAsset.status` وحده.
---
46.4 تعديل ReviewTask
تضاف الحقول التالية:
media_asset_version_id NOT NULL
القاعدة
`ReviewTask` يجب أن يراجع نسخة محددة، لا أصلًا عامًا قابلًا للتعديل.
---
46.5 تعديل ApprovalDecision
تضاف الحقول التالية:
media_asset_version_id NOT NULL
approved_content_hash nullable
قواعد
عند `decision = approved` يجب تعبئة `approved_content_hash` من `MediaAssetVersion.content_hash`.
لا يسمح بتعدد قرارات نهائية لنفس `review_task_id`.
لا يسمح باستخدام ApprovalDecision لنشر نسخة يختلف `content_hash` الخاص بها عن `approved_content_hash`.
---
46.6 تعديل ChannelVariant
تضاف الحقول التالية:
media_asset_version_id NOT NULL
source_content_hash NOT NULL
قواعد
ChannelVariant يجب أن يشتق من نسخة محددة.
إذا تغيرت النسخة، يجب إنشاء ChannelVariant جديد أو إعادة مراجعته.
---
46.7 تعديل PublishJob
تضاف الحقول التالية:
media_asset_version_id NOT NULL
approved_content_hash NOT NULL
قواعد
لا يسمح بإنشاء PublishJob إلا إذا كانت النسخة المشار إليها approved.
يجب التحقق من أن `approved_content_hash = MediaAssetVersion.content_hash`.
يجب التحقق من أن النسخة تنتمي لنفس `workspace_id`.
---
46.8 تعديل ManualPublishEvidence
يبقى ManualPublishEvidence append-only، وتؤكد الحقول التالية:
media_asset_version_id NOT NULL
content_hash NOT NULL
قواعد
evidence يجب أن يشير إلى النسخة المنشورة فعليًا.
لا يسمح بتغيير `content_hash` بعد الإنشاء.
عند إنشاء ClientReportSnapshot يتم تجميد `media_asset_version_id` و`content_hash` وبيانات evidence.
---
46.9 قاعدة PATCH /media-assets
إذا كان `PATCH /media-assets/{id}` يغير محتوى جوهريًا:
```text
1. إنشاء MediaAssetVersion جديدة
2. تحديث current_version_id
3. عدم تغيير latest_approved_version_id
4. تحويل MediaAsset.status إلى draft أو in_review حسب العملية
5. إنشاء ApprovalStateTransition
6. تسجيل AuditLog
7. منع النشر حتى ApprovalDecision جديد
```
ممنوع أن يؤدي PATCH إلى تعديل النسخة المعتمدة نفسها.
---
47) Updated Relationship Contract — V5.6.4
أي ERD بعد هذه النسخة يجب أن يعتمد العقد التالي:
```text
CustomerAccount 1──N Workspace
CustomerAccount 1──N CustomerSubscription
CustomerAccount 1──N BillingProviderConfig
CustomerAccount 1──N WorkspaceMember
CustomerAccount 1──N UsageMeter
CustomerAccount 1──N UsageQuotaState
CustomerAccount 1──N CostEvent
CustomerAccount 1──N ProviderUsageLog

CustomerSubscription 1──N CustomerSubscriptionSnapshot
SubscriptionPlan 1──N SubscriptionPlanVersion
SubscriptionPlanVersion 1──N PlanEntitlementVersion

Workspace 1──N WorkspaceMember
User 1──N WorkspaceMember
WorkspaceMember N──1 Role
Role M──N Permission through RolePermission

Workspace 1──N Campaign
Workspace 1──N BrandProfile
BrandProfile 1──N BrandVoiceRule
Campaign 1──N BriefVersion
Campaign 1──N CampaignStateTransition
Campaign 1──N MediaJob
BriefVersion 1──N MediaJob
MediaJob 1──0..N MediaAsset
MediaAsset 1──N MediaAssetVersion
Campaign 1──N MediaAsset
Workspace 1──N MediaAsset
Workspace 1──N MediaAssetVersion

MediaAssetVersion 1──N ReviewTask
ReviewTask 1──N ReviewAssignment
ReviewTask 1──N ReviewComment
ReviewTask 1──0..1 ApprovalDecision
ApprovalDecision N──1 MediaAssetVersion
Workspace 1──N ReviewPolicy
MediaAsset 1──N ApprovalStateTransition

MediaAsset 1──N MediaRenderVariant
MediaAsset 1──N MediaQualityReview
MediaAsset 1──N MediaComplianceCheck
MediaAsset 1──N MediaRightsDeclaration
MediaAsset 1──N AssetLineage as parent
MediaAsset 1──N AssetLineage as child

MediaAssetVersion 1──N ChannelVariant
ChannelVariant 1──N TrackedLink
ChannelVariant 1──N PublishJob
PublishJob N──1 MediaAssetVersion
PublishJob 1──N ManualPublishEvidence
ManualPublishEvidence N──1 MediaAssetVersion

AIProvider 1──N AIModelRegistry
AIProvider 1──N AIProviderCredential
AIProvider 1──N ProviderUsageLog
AIProvider 1──N ProviderFailureEvent
AIModelRegistry 1──N MediaJob
AIModelRegistry 1──N ProviderUsageLog
Workspace 1──N ModelRoutingPolicy

Workspace 1──N UsageMeter
Workspace 1──N UsageQuotaState
Workspace 1──N FeatureAccessDecision
Workspace 1──N CostEvent
Workspace 1──N CostBudget
Workspace 1──N CostGuardrail
Workspace 1──N SafeModeState
Workspace 1──N AdminNotification
Workspace 1──N AuditLog

Campaign 1──N ClientReportSnapshot
ReportTemplate 1──N ClientReportSnapshot
ClientReportSnapshot freezes ManualPublishEvidence + MediaAssetVersion state
```
---
48) Updated Phase 0/1 Table Lock
48.1 الجداول المضافة إلى Phase 1
يضاف إلى Phase 1:
MediaAssetVersion
السبب
بدونه لا يمكن ضمان أن ApprovalDecision يطابق المحتوى المنشور فعليًا.
---
48.2 الجداول التي يجب أن تحمل customer_account_id وworkspace_id
الجدول	customer_account_id	workspace_id	الحكم
Workspace	نعم	لا، هو نفسه الجذر	إلزامي
WorkspaceMember	نعم	نعم	إلزامي
AuditLog	حسب الحدث	حسب الحدث	إلزامي تشغيليًا
FeatureAccessDecision	نعم	نعم	إلزامي
UsageMeter	نعم	نعم	إلزامي
UsageQuotaState	نعم	نعم	إلزامي
CostEvent	نعم	نعم	إلزامي
CostBudget	نعم	nullable حسب scope	إلزامي
CostGuardrail	نعم	nullable حسب scope	إلزامي
MarginGuardrail	نعم	nullable حسب scope	إلزامي
SafeModeState	نعم	nullable حسب scope	إلزامي
AdminNotification	حسب الحدث	حسب الحدث	إلزامي تشغيليًا
ProviderUsageLog	نعم	نعم	إلزامي
ProviderFailureEvent	nullable	nullable	إلزامي إذا ارتبط بـ MediaJob
MediaAssetVersion	نعم	نعم	إلزامي
ReviewTask	نعم	نعم	إلزامي
ApprovalDecision	نعم	نعم	إلزامي
ChannelVariant	نعم	نعم	إلزامي
PublishJob	نعم	نعم	إلزامي
ManualPublishEvidence	نعم	نعم	إلزامي
ClientReportSnapshot	نعم	نعم	إلزامي
---
49) Updated API Rules — Approval Version Integrity
49.1 POST /review-tasks
يجب أن يستقبل أو يستنتج:
media_asset_version_id
workspace_id
ويرفض الطلب إذا:
النسخة لا تنتمي إلى Workspace.
النسخة archived أو superseded.
المستخدم لا يملك `review_task.create`.
---
49.2 POST /review-tasks/{id}/decision
يجب أن:
يقرأ ReviewTask مع `workspace_id`.
يقرأ MediaAssetVersion المرتبطة.
يحفظ `approved_content_hash` عند الاعتماد.
يحدث `latest_approved_version_id` في MediaAsset عند الاعتماد.
يسجل ApprovalStateTransition وAuditLog.
---
49.3 POST /publish-jobs
يجب أن يرفض الطلب إذا:
لا توجد نسخة معتمدة.
`media_asset_version_id` لا يطابق آخر ApprovalDecision approved.
`content_hash` تغير أو لا يطابق `approved_content_hash`.
ChannelVariant لا ينتمي لنفس Workspace.
المستخدم لا يملك `publish_job.create`.
---
49.4 POST /manual-publish-evidence
يجب أن:
يربط evidence بـ `media_asset_version_id`.
يحفظ `content_hash`.
يمنع PATCH/DELETE.
يسجل AuditLog.
يضمن أن PublishJob وMediaAssetVersion وWorkspace كلها متطابقة.
---
50) Updated Go / No-Go — V5.6.4
50.1 Go إلى ERD
يسمح بالانتقال إلى ERD إذا تحقق الآتي:
`Workspace.customer_account_id` مقفل.
`WorkspaceMember.customer_account_id + workspace_id` مقفلان.
`AuditLog` يدعم `customer_account_id` و`workspace_id` حسب نوع الحدث.
`FeatureAccessDecision`, `UsageMeter`, `UsageQuotaState`, `CostEvent` تحمل `customer_account_id` و`workspace_id`.
`ProviderUsageLog.customer_account_id` مضاف.
`ProviderFailureEvent` يدعم `customer_account_id/workspace_id` عند ارتباطه بـ MediaJob.
`MediaAssetVersion` مضاف إلى Phase 1.
`ApprovalDecision` يرتبط بـ `media_asset_version_id` وليس `media_asset_id` فقط.
`PublishJob` و`ManualPublishEvidence` يرتبطان بالنسخة المعتمدة.
كل query تشغيلي يستخدم `workspace_id`.
---
50.2 No-Go
يمنع ERD/SQL/API إذا حدث أحد الآتي:
Workspace لا يحتوي `customer_account_id`.
WorkspaceMember لا يحتوي `workspace_id`.
UsageQuotaState لا يحتوي `customer_account_id` و`workspace_id`.
FeatureAccessDecision لا يحتوي `customer_account_id` و`workspace_id`.
ProviderUsageLog لا يحتوي `customer_account_id`.
ApprovalDecision يعتمد على `media_asset_id` فقط.
PublishJob يعتمد على `MediaAsset.status = approved` دون نسخة معتمدة.
ManualPublishEvidence لا يحفظ `media_asset_version_id` و`content_hash`.
PATCH على MediaAsset يعدل محتوى معتمدًا بدل إنشاء نسخة جديدة.
أي endpoint تشغيلي يقرأ بالـ id فقط دون `workspace_id`.
---
50.3 الحكم النهائي المحدث قبل التصحيح النهائي
بعد هذا التصحيح، تصبح الوثيقة Build-Ready بشكل أقوى من V5.6.3 لأنها تعالج فجوتين كانتا قد تتحولان إلى مخاطر إنتاجية:
فجوة Field Lock في جداول Phase 0 الهيكلية، خصوصًا `customer_account_id` و`workspace_id`.
فجوة نشر محتوى تم تعديله بعد الاعتماد بسبب غياب version/hash binding بين الاعتماد والنشر.
القرار التنفيذي:
```text
V5.6.5 هي النسخة المرجعية للتحويل إلى ERD/SQL/API بعد تطبيق القسم 51 وما بعده.
الأقسام 44–50 ملزمة ومقدمة على أي تعارض سابق.
لا يسمح بالبناء كـ CRUD تقليدي.
لا يسمح بالنشر أو التقرير على أصل غير مربوط بنسخة معتمدة ومجمّدة.
```
---
---
51) V5.6.5 Corrective Implementation Patch — حاكم قبل ERD/SQL/API
51.1 القرار المعتمد
تعتمد هذه الوثيقة كمخطط تنفيذي لـ Phase 0/1 فقط بعد التصحيح، ولا تُعتمد كوثيقة جاهزة للمنتج الكامل.
نسبة الجاهزية بعد هذا التصحيح:
النطاق	الحكم
Phase 0/1	93–95% جاهزية للتحويل إلى ERD/SQL/API/Backlog
المنتج الكامل	غير جاهز للتنفيذ الكامل؛ Phase 2 وما بعدها استراتيجية وليست تنفيذية
القرار التنفيذي: لا يبدأ التنفيذ قبل إغلاق 6 ثغرات حرجة:
توحيد عقد العلاقات.
قفل حقول Phase 1.
حسم Queue / Secret Manager / Billing Provider / Object Storage.
إدخال MediaCostPolicy وMediaCostSnapshot.
تعريف usable output.
تثبيت NFR / API / User Stories قبل Frontend وQA.
---
52) Final Data Relationship Contract — Source of Truth
52.1 قاعدة الحسم
```md
All previous Relationship Contract sections are superseded by this section.
No ERD, migration, API contract, or QA test may rely on any earlier relationship contract.
```
أي علاقة سابقة في الأقسام القديمة تعتبر مرجعية تاريخية فقط، وليست مصدرًا للتنفيذ إذا تعارضت مع هذا القسم.
52.2 العلاقات المعتمدة
```txt
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
52.3 الأسماء التنفيذية المعتمدة
لا يوجد كيان مستقل باسم:
`Asset`
`GenerationJob`
`Approval`
الأسماء الرسمية الملزمة هي:
`MediaJob`
`MediaAsset`
`MediaAssetVersion`
`ApprovalDecision`
`ManualPublishEvidence`
---
53) Phase 1 Core Entity Field Lock
53.1 Campaign
```txt
campaign_id
workspace_id
customer_account_id
brand_profile_id
created_by_user_id
campaign_name
objective
status
start_date
end_date
default_channels_json
campaign_brief_summary
created_at
updated_at
archived_at nullable
```
قيود:
`workspace_id` إلزامي.
`customer_account_id` إلزامي لعزل العميل التجاري.
لا يجوز إنشاء Campaign دون Workspace صحيح.
`status` محصور في: `draft`, `active`, `paused`, `completed`, `archived`.
53.2 BriefVersion
```txt
brief_version_id
campaign_id
workspace_id
customer_account_id
version_number
brief_payload_json
objective
target_audience
offer
channels_json
constraints_json
created_by_user_id
created_at
locked_at nullable
superseded_by_version_id nullable
```
قيود:
كل `MediaJob` يجب أن يرتبط بـ `brief_version_id`.
لا يجوز تعديل BriefVersion بعد `locked_at`.
أي تعديل ينتج نسخة جديدة، لا تعديلًا رجعيًا.
53.3 BrandProfile
```txt
brand_profile_id
workspace_id
customer_account_id
name
primary_language
secondary_language nullable
tone
target_audience
brand_positioning
forbidden_terms_json
approved_terms_json
competitors_json nullable
visual_guidelines_json nullable
compliance_notes_json nullable
status
created_at
updated_at
archived_at nullable
```
قيود:
لا يستخدم في التوليد إلا إذا كان `status = active`.
أي تغيير جوهري بعد اعتماد حملة لا يغيّر محتوى سابقًا.
53.4 BrandVoiceRule
```txt
brand_voice_rule_id
brand_profile_id
workspace_id
customer_account_id
rule_type
rule_text
severity
active
created_at
updated_at
```
القيم:
```txt
rule_type:
- tone
- wording
- banned_claim
- preferred_claim
- style
- compliance

severity:
- advisory
- warning
- blocking
```
53.5 PromptTemplate
```txt
prompt_template_id
workspace_id nullable
template_code
template_name
template_version
task_type
input_schema_json
prompt_body
model_family
active
created_by_user_id
created_at
deprecated_at nullable
```
قيود:
كل `MediaJob` يجب أن يسجل `prompt_template_id` و`template_version`.
تغيير القالب لا يؤثر على Jobs سابقة.
لا يجوز حذف PromptTemplate مستخدم في MediaJob؛ فقط `deprecated_at`.
53.6 CampaignTemplate
```txt
campaign_template_id
workspace_id nullable
template_code
industry
objective
name
description
brief_schema_json
default_channels_json
default_review_policy_json
active
created_at
updated_at
```
53.7 ReportTemplate
```txt
report_template_id
workspace_id
template_name
sections_json
metric_rules_json
narrative_rules_json
active
created_at
updated_at
```
الأقسام الافتراضية:
```txt
campaign_summary
published_content
generated_vs_approved
tracked_links
basic_engagement
conversions_if_available
metric_confidence
safe_recommendations
improvement_notes
```
53.8 ClientReportSnapshot
```txt
report_snapshot_id
workspace_id
customer_account_id
campaign_id
report_template_id
report_payload_json
metrics_snapshot_json
narrative_summary
generated_by_user_id
generated_at
exported_at nullable
superseded_by_snapshot_id nullable
```
قاعدة حاكمة:
أي تقرير يُرسل للعميل يجب أن يكون Snapshot مجمدًا. لا يجوز أن يعتمد التقرير على بيانات حية تتغير لاحقًا دون أثر تدقيقي.
53.9 OnboardingProgress
```txt
onboarding_id
workspace_id
customer_account_id
current_step
completed_steps_json
skipped_steps_json
completion_percentage
completed_at nullable
updated_at
```
53.10 SetupChecklistItem
```txt
checklist_item_id
workspace_id
customer_account_id
item_code
title
description
status
required_for_launch
completed_by_user_id nullable
completed_at nullable
created_at
updated_at
```
status:
```txt
pending
in_progress
completed
skipped
blocked
```
---
54) MediaCostPolicy وMediaCostSnapshot في Phase 0/1
54.1 الحكم
وجود CostGuardrail وحده لا يكفي. يجب وجود سياسة تكلفة قبل إرسال أي Job لمزود AI، وإلا يصبح التحكم المالي نظريًا لا تنفيذيًا.
54.2 MediaCostPolicy
```txt
media_cost_policy_id
workspace_id
customer_account_id
task_type
provider
model_name
max_cost_per_job
max_daily_cost
max_monthly_cost
currency
hard_block_on_exceed
active
created_at
updated_at
```
54.3 MediaCostSnapshot
```txt
media_cost_snapshot_id
media_job_id
workspace_id
customer_account_id
policy_id
estimated_cost
actual_cost nullable
currency
cost_check_result
blocked_reason nullable
captured_at
```
54.4 قاعدة تنفيذية
لا يبدأ `MediaJob` قبل إنشاء `MediaCostSnapshot` بنتيجة:
```txt
cost_check_result = approved
```
---
55) Usable Output Definition
55.1 القاعدة الحاكمة
لا يُسجل usage تجاري قابل للفوترة إلا إذا تحققت الشروط التالية:
```txt
MediaJob.status = succeeded
MediaAssetVersion.content_hash exists
MediaAssetVersion.content_text or storage_ref exists
provider_response_completed = true
system_error = false
blocked_by_policy = false
```
55.2 الحالات التي لا تُحتسب كاستخدام تجاري
```txt
provider_timeout
provider_error
rate_limit_failure
policy_block_before_generation
cost_guardrail_block
empty_output
malformed_output
system_exception
```
55.3 الحالات التي تُحتسب
```txt
valid_output_generated
output_sent_to_review
output_rejected_by_human_for_quality
output_edited_by_user_after_generation
```
55.4 المنطق
رفض المستخدم للمحتوى بسبب الذوق أو الجودة لا يلغي التكلفة التشغيلية إذا كان المزود أنتج مخرجًا صالحًا تقنيًا. أما فشل النظام أو المزود فلا يُحمّل على العميل.
---
56) Content Hash & Approval Integrity Policy
56.1 حساب content_hash للنصوص
```txt
content_hash = SHA-256(normalized_content_payload)
```
حيث `normalized_content_payload` يتضمن:
```json
{
  "content_text": "...",
  "content_type": "text",
  "language": "ar",
  "channel": "instagram",
  "format": "caption"
}
```
56.2 حساب content_hash للملفات
```txt
content_hash = SHA-256(binary_file)
```
56.3 قاعدة الاعتماد
لا يجوز إنشاء `PublishJob` إلا إذا:
```txt
PublishJob.media_asset_version_id = ApprovalDecision.media_asset_version_id
ApprovalDecision.status = approved
ApprovalDecision.approved_content_hash = MediaAssetVersion.content_hash
MediaAssetVersion.status = approved
```
56.4 عند تعديل المحتوى بعد الاعتماد
```txt
- إنشاء MediaAssetVersion جديدة
- إلغاء صلاحية الاعتماد السابق للنشر
- إعادة ReviewTask
- منع النشر حتى ApprovalDecision جديد
```
---
57) قرارات تقنية مقفلة قبل البناء
القرار	التوصية العملية	السبب
Queue Stack	BullMQ + Redis	مناسب مع NestJS، سريع لـ Phase 0/1، أقل تعقيدًا من RabbitMQ
Secret Manager	AWS Secrets Manager أو Doppler كبداية	لا أسرار داخل DB، فقط `secret_ref`
Billing Provider	Stripe عالميًا، Paddle إذا أولوية merchant-of-record	يجب حسمه قبل webhooks وFeatureGate
Object Storage	S3-compatible storage	مناسب لـ MediaAssetVersion وManualPublishEvidence
Observability	Sentry + OpenTelemetry + Grafana/Prometheus لاحقًا	Sentry أسرع للبداية، OpenTelemetry يحمي التوسع
API Spec	OpenAPI/Swagger إلزامي	يمنع اختلاف Backend/Frontend
---
58) Minimum API Contracts قبل Frontend
58.1 المسارات الدنيا المطلوبة
```txt
POST   /workspaces
GET    /workspaces/:id

POST   /campaigns
GET    /campaigns
GET    /campaigns/:id
PATCH  /campaigns/:id

POST   /campaigns/:id/brief-versions
GET    /campaigns/:id/brief-versions

POST   /media-jobs
GET    /media-jobs/:id
POST   /media-jobs/:id/cancel

GET    /media-assets/:id
GET    /media-assets/:id/versions

POST   /review-tasks
GET    /review-tasks
POST   /review-tasks/:id/approve
POST   /review-tasks/:id/reject

POST   /publish-jobs
GET    /publish-jobs/:id

POST   /manual-publish-evidence
GET    /manual-publish-evidence/:id

POST   /tracked-links
GET    /tracked-links/:id

POST   /client-report-snapshots
GET    /client-report-snapshots/:id

GET    /feature-gates/check
GET    /usage/quota-state

POST   /billing/webhooks/provider
```
58.2 قواعد API إلزامية
```txt
- كل request يجب أن يمر عبر WorkspaceContextGuard.
- لا يقبل workspace_id من body كمصدر ثقة.
- workspace_id يؤخذ من المسار/السياق المصرح.
- كل response لقائمة يجب أن يدعم pagination.
- كل عملية حساسة يجب أن تنتج AuditLog.
```
---
59) NFR Matrix المعتمدة
المجال	الحد الأدنى Phase 0/1
API P95 latency	أقل من 500ms للعمليات غير AI
AI Job submission	أقل من 800ms لأن التنفيذ عبر Queue
Text generation completion	حسب المزود، لكن لا يحجب request
Availability Pilot	99.0% مقبول
Backup	يومي في Pilot، كل 6 ساعات قبل Production
RPO	24 ساعة Pilot، 6 ساعات Production
RTO	8 ساعات Pilot، 2–4 ساعات Production
AuditLog retention	12 شهرًا كحد أدنى
ManualPublishEvidence retention	مدة الاشتراك + 12 شهرًا
Max report payload	يحدد حد أقصى، مع pagination للأصول
Tenant Isolation tests	إلزامية في CI
IDOR tests	إلزامية قبل كل release
---
60) Domain Events المعتمدة
يجب إضافة Domain Events دون Event Sourcing كامل.
```txt
workspace.created
workspace.member_added

campaign.created
campaign.status_changed

brief_version.created
brief_version.locked

media_job.requested
media_job.cost_checked
media_job.started
media_job.succeeded
media_job.failed
media_job.cancelled

media_asset.created
media_asset_version.created
media_asset_version.hash_computed

review_task.created
review_task.assigned
approval_decision.approved
approval_decision.rejected

publish_job.created
publish_job.blocked
publish_job.ready
publish_job.completed

manual_publish_evidence.submitted
manual_publish_evidence.verified
manual_publish_evidence.superseded

usage_meter.recorded
usage_quota.exceeded
cost_guardrail.triggered

billing.webhook_received
billing.subscription_updated
billing.payment_failed

safe_mode.activated
safe_mode.resolved
```
60.1 قاعدة Outbox
أي حدث يؤثر على الفوترة، النشر، الاعتماد، أو Evidence يجب أن يستخدم Outbox Pattern أو بديل موثوق.
---
61) User Stories المطلوبة قبل Backlog
61.1 Brief → Generation
```txt
As a Creator,
I want to create a campaign brief from a template,
so that I can generate content aligned with the client’s objective.
```
Acceptance Criteria:
```txt
- لا يمكن إنشاء BriefVersion دون Campaign.
- يتم حفظ BriefVersion كنسخة مستقلة.
- لا يمكن تعديل BriefVersion بعد استخدامه في MediaJob إلا بإنشاء نسخة جديدة.
```
61.2 Generation → Review
```txt
As a Creator,
I want generated content to be sent to review,
so that it cannot be published without approval.
```
Acceptance Criteria:
```txt
- كل MediaAssetVersion يجب أن تحمل content_hash.
- لا يمكن إنشاء ReviewTask دون MediaAssetVersion.
- لا تظهر النسخة للمراجعة إذا فشل hash computation.
```
61.3 Approval → Publish
```txt
As a Reviewer,
I want to approve a specific version,
so that only the approved version can be published.
```
Acceptance Criteria:
```txt
- ApprovalDecision يرتبط بـ MediaAssetVersion محددة.
- approved_content_hash يجب أن يطابق content_hash عند النشر.
- أي تعديل بعد الاعتماد يمنع النشر حتى اعتماد جديد.
```
61.4 Manual Publish Evidence
```txt
As an Operator,
I want to upload manual publish evidence,
so that the system can prove external publishing without direct platform integration.
```
Acceptance Criteria:
```txt
- لا يمكن تعديل Evidence بعد رفعه.
- التصحيح يتم عبر supersede فقط.
- كل Evidence يجب أن يرتبط بـ PublishJob.
- كل Evidence ينتج AuditLog.
```
---
62) Security & Privacy Patch
62.1 Tenant Isolation
```txt
DB:
- workspace_id mandatory on tenant-owned tables.
- customer_account_id mandatory where commercial ownership matters.
- composite indexes on workspace_id + entity_id.
- optional RLS before Production, mandatory for high-risk tables.

API:
- WorkspaceContextGuard mandatory.
- PermissionGuard mandatory.
- Repository-level workspace filter mandatory.
- No direct findById without workspace scope.

UI:
- workspace switcher لا يغير الصلاحية وحده.
- كل شاشة تُحمّل بيانات workspace الحالي فقط.
```
62.2 Session Management
```txt
access_token_ttl = 15 minutes
refresh_token_ttl = 7–30 days
MFA required for:
- Admin
- Billing settings
- Provider credentials
- SafeMode override
```
62.3 PDPL / Privacy Data Classification
يجب إضافة جدول تصنيف بيانات:
```txt
data_category
contains_personal_data
legal_basis
retention_period
deletion_method
processor_or_controller
third_party_provider
cross_border_transfer
```
قاعدة:
أي بيانات مستوردة من متجر أو حساب اجتماعي تخص عملاء نهائيين يجب معاملتها كبيانات شخصية محتملة.
---
63) External Provider Failure Policy
63.1 Retry Policy
```txt
timeout:
- text generation: 60–120s worker timeout
- image/video: Post V1 only unless explicitly enabled

retry:
- max 3 attempts
- exponential backoff
- no retry on policy_block
- no retry on quota_exceeded
- retry on timeout/rate_limit/transient_provider_error
```
63.2 Circuit Breaker
```txt
Open circuit if:
- provider error rate > 25% within 10 minutes
- average latency exceeds threshold
- repeated rate limit failure

Actions:
- stop sending new jobs
- mark provider degraded
- activate fallback provider if configured
- notify AdminNotification
```
---
64) Scope Cleanup — ما يؤجل وما يحذف أو يعاد تسميته
64.1 ما يجب تأجيله
لا يُبنى الآن:
```txt
Custom Roles
Full Multi-Approver Workflow
Advanced Attribution
ROI Prediction
MMM
AI Agents
Automated Publishing
Automated Budget Scaling
Full Video Generation
Cross-channel Identity Stitching
Admin Internal Advanced Dashboard
CRM Connector
Penetration Test execution
```
لكن: يجب ترك Hooks معمارية لها دون تنفيذ كامل.
64.2 ما يجب حذفه أو إعادة تسميته
```txt
- حذف أو تعطيل §16 كعقد علاقات مستقل.
- حذف أي استخدام لكلمة Approval ككيان مستقل، واستبدالها بـ ApprovalDecision.
- حذف أي استخدام لكلمة GenerationJob كجدول مستقل، واستبدالها بـ MediaJob.
- حذف أي استخدام لكلمة Asset كجدول مستقل، واستبدالها بـ MediaAsset.
- دمج تكرار قوائم Phase 0/1 في جدول واحد فقط.
```
---
65) V5.6.5 Execution Start List
65.1 أول 10 مهام تنفيذية معتمدة
#	المهمة	المسؤول	لا يبدأ قبلها
1	توحيد Relationship Contract واعتماد النسخة النهائية	Tech Lead + PM	ERD
2	إضافة Field Lock لكيانات Phase 1	PM + Backend Lead	SQL
3	حسم Billing Provider	Founder + PM	FeatureGate/Billing
4	حسم Queue Stack وSecret Manager وStorage	Tech Lead	Worker/Media
5	إدخال MediaCostPolicy وMediaCostSnapshot	Backend Lead	AI Jobs
6	تعريف content_hash strategy	Backend Lead	Approval
7	كتابة OpenAPI أولي	Backend + Frontend	Frontend
8	بناء Tenant Isolation Test Suite	QA + Backend	Sprint 1
9	بناء Mock AI Provider + Mock Billing Webhook	Backend	End-to-End testing
10	كتابة User Stories + Acceptance Criteria للرحلات الحرجة	PM + QA	Backlog
65.2 Go / No-Go النهائي لـ V5.6.5
Go إلى ERD/SQL/API
يسمح بالانتقال إذا تحقق الآتي:
اعتماد القسم 52 كمصدر علاقات وحيد.
قفل Field Lock لكيانات Phase 1 في القسم 53.
إضافة MediaCostPolicy وMediaCostSnapshot في Phase 0/1.
اعتماد usable output definition.
ربط ApprovalDecision بالنسخة والـ content_hash.
حسم Queue Stack وSecret Manager وBilling Provider وObject Storage.
اعتماد NFR Matrix.
اعتماد Minimum API Contracts.
إدخال User Stories الأساسية في Backlog.
تفعيل اختبارات Tenant Isolation وIDOR في CI.
No-Go
يمنع التنفيذ إذا حدث أحد الآتي:
وجود أكثر من Relationship Contract مستخدم للتنفيذ.
أي ERD يعتمد على §16 أو أي عقد سابق متعارض.
غياب `customer_account_id` في كيانات الملكية التجارية.
غياب `workspace_id` في أي جدول مملوك للمستأجر.
بدء MediaJob دون MediaCostSnapshot approved.
تسجيل UsageMeter قبل تحقق usable output.
إنشاء PublishJob دون ApprovalDecision مربوط بنفس MediaAssetVersion والـ content_hash.
قبول `workspace_id` من body كمصدر ثقة.
عدم وجود OpenAPI قبل Frontend.
عدم وجود User Stories وAcceptance Criteria قبل Backlog.
65.3 الحكم النهائي
V5.6.5 هي النسخة المرجعية المعتمدة كـ Corrective Implementation Build-Ready Lock Sheet لمرحلة Phase 0/1.
هذه النسخة لا تغيّر جوهر المشروع، لكنها تمنع الأخطاء البنيوية التي قد تؤدي إلى:
إعادة بناء قاعدة البيانات لاحقًا.
تسريب بيانات بين العملاء.
نزاعات على النسخ المعتمدة.
تكلفة AI غير مسيطر عليها.
تضارب بين Backend وFrontend وQA.
الخطأ التنفيذي الآن هو البدء بالبرمجة قبل تحويل هذه الوثيقة إلى:
```txt
ERD → SQL DDL → OpenAPI → Backlog → QA Test Suite
```
---
END V5.6.5
