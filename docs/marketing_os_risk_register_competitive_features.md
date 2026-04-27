# Marketing OS Competitive Features Risk Register

## Executive Risk Position

الخطر الأكبر ليس نقص الخصائص، بل تضخم النطاق وتعدد مصادر الحقيقة. يجب أن يظل Marketing OS مالكًا للحملة، الموافقة، الأصل، النشر، القياس، والتدقيق.

---

| ID | الخطر | السبب | الأثر | المرحلة | المعالجة |
|---|---|---|---|---|---|
| R-001 | تضارب مصدر الحقيقة | دمج CMS/CRM/Commerce دون ownership | نزاعات بيانات وفشل تدقيق | Phase 0 | Source of Truth Register |
| R-002 | تضخم V1 | إدخال CRM/ERP/Chat/Commerce كامل | تأخير الإطلاق وفشل التنفيذ | Phase 0 | Phase Map صارم |
| R-003 | مخاطر AGPL | نسخ كود erxes/IDURAR/Frappe | التزامات قانونية على المنتج | Phase 0 | عدم نسخ الكود ومراجعة قانونية |
| R-004 | نشر محتوى غير معتمد | غياب approval workflow | ضرر سمعة وقانوني | Core V1 | Approval required before publish |
| R-005 | تعديل الأدلة بعد النشر | evidence قابل للتعديل | فقدان الثقة والتحقيق | Core V1 | Immutable evidence + invalidation event |
| R-006 | تسريب credentials | تخزين مفاتيح التكامل كنص | اختراق حسابات خارجية | Phase 0/Core V1 | Encryption/secret manager |
| R-007 | webhook spoofing | قبول webhooks دون توقيع | بيانات مزيفة أو تنفيذ ضار | Core V1 | Signature validation |
| R-008 | احتساب استخدام AI فاشل | Metering غير محكوم | فوترة خاطئة ونزاعات | Core V1 | Count successful billable events فقط |
| R-009 | صلاحيات غير متسقة | اختلاف RBAC بين الأنظمة | وصول غير مصرح | Phase 0 | Permissions mapping |
| R-010 | اعتماد مفرط على أدوات خارجية | جعل Strapi/CRM/Mattermost operational core | صعوبة صيانة وخروج | Extended V1 | API boundary + no shared DB |
| R-011 | جودة قياس ضعيفة | الاعتماد على أرقام يدوية أو ناقصة | قرارات تسويق خاطئة | Core V1 | MetricConfidenceScore |
| R-012 | تضارب consent | CRM وMarketing OS يختلفان على الموافقة | مخالفة خصوصية | Core/Extended V1 | ContactConsent source rule |
| R-013 | فشل التكاملات بصمت | لا توجد logs/retry | ضياع بيانات | Core V1 | ConnectorErrorLog + SyncRun |
| R-014 | نقص audit | عدم تسجيل قرارات الموافقة والنشر | ضعف الإثبات | Phase 0/Core V1 | AuditLog إلزامي |
| R-015 | تحويل المنتج إلى CRM | إدخال deals/pipeline/forecasting مبكرًا | فقدان تركيز المنتج | Core V1 | CRM-lite فقط |
| R-016 | تحويل المنتج إلى CMS | الاعتماد على Strapi كقلب | ضعف التسويق التشغيلي | Extended V1 | Strapi للمحتوى فقط |
| R-017 | تحويل المنتج إلى Commerce | إدخال الطلبات والمدفوعات | تعقيد مالي وتشغيلي | Extended/Post V1 | Commerce connector فقط |
| R-018 | بناء chat داخلي | تقليد Mattermost | هدر وقت ومخاطر أمنية | Core V1 | Notifications only |
| R-019 | تكامل ثنائي غير مضبوط | Sync باتجاهين | overwrite وبيانات متناقضة | Extended V1 | Append-only/read-only first |
| R-020 | Microservices مبكرًا | نسخ erxes architecture | تعقيد نشر وتشغيل | Phase 0 | Modular monolith أو boundaries بسيطة |
