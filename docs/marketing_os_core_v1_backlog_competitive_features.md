# Marketing OS Core V1 Backlog — Competitive Features

## Epic 1: Campaign Workspace

### User Story
كمستخدم تسويقي، أريد إنشاء حملة مركزية تحتوي الهدف والجمهور والقنوات والأصول حتى أستطيع إدارة دورة الحملة كاملة.

### Acceptance Criteria
- يمكن إنشاء Campaign داخل Workspace.
- يمكن إضافة CampaignBrief.
- يمكن تحديد Objective وAudience.
- يمكن تحديد Channel Plan.
- يمكن ربط Media Assets بالحملة.
- يظهر Activity Timeline للحملة.
- كل تغيير مهم يسجل في AuditLog.

### Affected Entities
- Campaign
- CampaignBrief
- CampaignObjective
- CampaignAudience
- CampaignChannelPlan
- CampaignActivity
- CampaignStatusHistory
- AuditLog

### Permissions
- campaign:create
- campaign:read
- campaign:update
- campaign:archive

### Audit Events
- campaign.created
- campaign.updated
- campaign.status_changed
- campaign.archived

---

## Epic 2: Brand & Content Governance

### User Story
كمسؤول علامة تجارية، أريد تعريف قواعد المحتوى حتى لا يتم توليد أو نشر محتوى مخالف.

### Acceptance Criteria
- يمكن إنشاء BrandRuleSet.
- يمكن إضافة قواعد tone/language/claims/disclaimers.
- كل GenerationJob يخضع لفحص guardrails.
- يتم منع إرسال المحتوى المخالف للموافقة.
- يتم إرجاع أسباب الرفض للمستخدم.
- كل تعديل على القواعد يسجل في AuditLog.

### Affected Entities
- BrandRuleSet
- BrandRule
- ContentGuardrail
- ForbiddenClaim
- RequiredDisclaimer
- GenerationReview
- AuditLog

### Permissions
- brand_rules:create
- brand_rules:update
- brand_rules:read
- content:validate

### Audit Events
- brand_rule_set.created
- brand_rule_set.updated
- content.validation_failed
- content.validation_passed

---

## Epic 3: Content Template System

### User Story
كمستخدم، أريد استخدام قوالب محتوى مع متغيرات حتى أنتج محتوى متسقًا وقابلًا للحوكمة.

### Acceptance Criteria
- يمكن إنشاء ContentTemplate.
- يمكن إنشاء TemplateVersion.
- يمكن تعريف TemplateVariables.
- يمكن استخدام القالب داخل GenerationJob.
- يتم تسجيل TemplateUsageLog.
- لا يجوز استخدام قالب معطل.

### Affected Entities
- ContentTemplate
- TemplateVersion
- TemplateVariable
- TemplateUsageLog

### Permissions
- template:create
- template:update
- template:read
- template:use

### Audit Events
- template.created
- template.version_created
- template.used
- template.disabled

---

## Epic 4: AI Generation Job System

### User Story
كمسؤول نظام، أريد تتبع كل عملية توليد لمعرفة النموذج والتكلفة والنتيجة وحالة القبول.

### Acceptance Criteria
- كل طلب توليد ينشئ GenerationJob.
- يتم تسجيل model_provider وmodel_name وmodel_version.
- يتم تسجيل prompt/input_context/output.
- يتم تسجيل latency وcost estimate.
- يتم تسجيل guardrail score.
- لا يتم احتساب استخدام تجاري عند فشل job.
- يتم ربط output بالحملة والأصل عند القبول.

### Affected Entities
- GenerationJob
- GenerationInput
- GenerationOutput
- ModelProvider
- ModelRoutingDecision
- GenerationCostEvent
- GenerationReview
- UsageMeter

### Permissions
- generation:create
- generation:read
- generation:review

### Audit Events
- generation.requested
- generation.completed
- generation.failed
- generation.rejected_by_guardrail
- generation.accepted_by_user

---

## Epic 5: Asset Library with Versioning

### User Story
كمراجع محتوى، أريد إدارة نسخ الأصول حتى لا يتم نشر أصل غير صحيح أو غير معتمد.

### Acceptance Criteria
- يمكن إنشاء MediaAsset.
- كل تعديل ينشئ MediaAssetVersion.
- لا يمكن تعديل نسخة معتمدة.
- يمكن إرسال نسخة للمراجعة.
- يمكن ربط النسخة بالحملة.
- لا يسمح PublishJob إلا بنسخة approved.

### Affected Entities
- MediaAsset
- MediaAssetVersion
- AssetMetadata
- AssetTag
- AssetUsage
- AssetApprovalState

### Permissions
- asset:create
- asset:read
- asset:update
- asset:submit_review
- asset:archive

### Audit Events
- asset.created
- asset.version_created
- asset.submitted_for_review
- asset.archived

---

## Epic 6: Approval Workflow

### User Story
كمراجع، أريد الموافقة أو الرفض أو طلب تعديل على نسخة أصل محددة قبل النشر.

### Acceptance Criteria
- يمكن إنشاء ApprovalRequest لنسخة أصل.
- القرار مرتبط بـ MediaAssetVersion.
- يمكن approve / reject / request changes.
- لا يمكن نشر أصل دون موافقة.
- لا يمكن تغيير النسخة بعد الموافقة إلا بإصدار جديد.
- كل قرار يسجل في AuditLog.

### Affected Entities
- ApprovalPolicy
- ApprovalRequest
- ApprovalStep
- ApprovalDecision
- ApprovalComment
- MediaAssetVersion

### Permissions
- approval:request
- approval:approve
- approval:reject
- approval:comment

### Audit Events
- approval.requested
- approval.approved
- approval.rejected
- approval.changes_requested

---

## Epic 7: Publishing Evidence

### User Story
كمسؤول حملة، أريد حفظ دليل النشر حتى أستطيع إثبات ما نُشر ومتى وأين.

### Acceptance Criteria
- يمكن إنشاء PublishJob.
- يرتبط PublishJob بـ Campaign وChannel وMediaAssetVersion.
- لا يمكن إنشاء PublishJob لأصل غير approved.
- يمكن إضافة ManualPublishEvidence.
- لا يمكن تعديل evidence بعد الحفظ.
- يمكن invalidation فقط بسبب واضح.
- كل invalidation يسجل في AuditLog.

### Affected Entities
- PublishJob
- PublishingChannel
- ManualPublishEvidence
- PublishingStatusHistory
- TrackingLink
- UTMParameterSet
- EvidenceHash

### Permissions
- publish:create
- publish:read
- publish:evidence_create
- publish:evidence_invalidate

### Audit Events
- publish_job.created
- publish_job.completed
- publish_evidence.created
- publish_evidence.invalidated

---

## Epic 8: Basic Connector Layer

### User Story
كمسؤول تكامل، أريد ربط أدوات خارجية بشكل آمن دون كشف المفاتيح أو كسر مصدر الحقيقة.

### Acceptance Criteria
- يمكن تعريف Connector.
- يمكن ربط ConnectorAccount.
- credentials لا تخزن كنص مكشوف.
- يتم تسجيل كل webhook event.
- يتم تسجيل كل sync run.
- يتم تسجيل أخطاء connector.
- لا يسمح connector بتعديل campaign truth مباشرة.

### Affected Entities
- Connector
- ConnectorAccount
- ConnectorCredential
- WebhookEndpoint
- WebhookEventLog
- ConnectorSyncRun
- ConnectorErrorLog

### Permissions
- connector:create
- connector:update
- connector:read
- connector:rotate_secret
- webhook:receive

### Audit Events
- connector.created
- connector.account_linked
- connector.secret_rotated
- connector.sync_failed

---

## Epic 9: Performance Event Tracking

### User Story
كمحلل تسويق، أريد قياس أداء الحملة حسب القناة والأصل حتى أعرف ما يجب تحسينه.

### Acceptance Criteria
- يمكن تسجيل PerformanceEvent.
- يمكن ربط الحدث بحملة وقناة وأصل.
- يمكن إنشاء CampaignMetricSnapshot.
- يتم حساب MetricConfidenceScore.
- يتم تمييز البيانات اليدوية عن الآلية.
- لا تعتمد الأرقام غير الموثقة كحقيقة نهائية.

### Affected Entities
- PerformanceEvent
- PerformanceMetric
- CampaignMetricSnapshot
- ChannelPerformanceSnapshot
- AttributionEvent
- MetricConfidenceScore

### Permissions
- performance:read
- performance:event_create
- performance:snapshot_create

### Audit Events
- performance_event.created
- metric_snapshot.created
- metric_confidence.updated

---

## Epic 10: CRM-lite Contacts

### User Story
كمسؤول حملة، أريد ربط الاستجابات التسويقية بجهات اتصال دون بناء CRM كامل.

### Acceptance Criteria
- يمكن إنشاء Contact.
- يمكن إضافة ContactIdentifier.
- يمكن تسجيل ContactConsent.
- يمكن إنشاء LeadCapture من حملة.
- يمكن ربط contact بحملة عبر CampaignContactAttribution.
- لا توجد deals/pipeline/forecasting في Core V1.

### Affected Entities
- Contact
- ContactIdentifier
- ContactConsent
- LeadCapture
- ContactSegment
- CampaignContactAttribution

### Permissions
- contact:create
- contact:read
- contact:update
- contact:consent_update

### Audit Events
- contact.created
- contact.consent_updated
- lead_capture.created
- contact.attributed_to_campaign

---

## Epic 11: Notifications

### User Story
كمستخدم، أريد تلقي تنبيهات عند وجود موافقة أو فشل نشر أو انتهاء صلاحية تكامل.

### Acceptance Criteria
- يمكن إنشاء NotificationRule.
- يمكن إرسال in-app notification.
- يمكن إرسال email notification.
- يمكن لاحقًا إرسال webhook notification.
- فشل التنبيه لا يوقف العملية الأساسية.
- كل delivery يسجل حالته.

### Affected Entities
- Notification
- NotificationRule
- NotificationDelivery
- NotificationChannel
- AlertEvent

### Permissions
- notification:read
- notification_rule:create
- notification_rule:update

### Audit Events
- notification_rule.created
- notification.sent
- notification.failed
