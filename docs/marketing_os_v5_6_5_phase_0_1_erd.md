# Marketing OS V5.6.5 — Phase 0/1 ERD

> **Document type:** Execution ERD / Phase 0-1  
> **Source authority:** Section 52 only  
> **Status:** Ready for SQL DDL conversion after review  
> **Build status:** Not ready for direct coding  
> **Legacy relationship contracts:** Superseded when conflicting with Section 52  

---

## 1. Executive Decision

This ERD converts **Section 52 only** into a Phase 0/1 data model.

It does **not** use older relationship contracts from Section 16, Section 30.3, or Section 47.

The following legacy entities are not allowed as standalone tables:

```text
GenerationJob
Asset
Approval
```

They are translated as follows:

| Legacy name | Approved execution name |
|---|---|
| GenerationJob | MediaJob |
| Asset | MediaAsset |
| Approval | ApprovalDecision |
| Approved Asset | Approved MediaAssetVersion |
| Publish Asset | Publish approved MediaAssetVersion |

**Decision:**

```text
GO to SQL DDL Phase 0/1.
NO-GO to direct coding.
NO-GO to frontend before OpenAPI.
NO-GO to detailed QA before Acceptance Criteria and Test Matrix.
```

---

## 2. ERD Scope

### 2.1 In Scope

- Customer / Workspace / Users / RBAC
- Subscription / Plan / Entitlements
- Campaign / Brief / Media Job / Asset / Review / Approval / Publish
- Manual Publish Evidence
- Brand Profile / Brand Rules / Prompt Templates / Report Templates
- Usage / Quota / Cost / Budget / Guardrails / Media Cost Snapshot
- Audit / Notifications / Safe Mode / Onboarding / Setup Checklist
- Snapshots and versioned historical truth

### 2.2 Out of Scope for this ERD

The following are not included because they are not part of Section 52 as approved relationships:

```text
BillingProvider
ProviderUsageLog
AIProvider
AIModelRegistry
AttributionDecision
SocialAutoPublishConnector
PaidExecution
AgentRun
```

These may be added later only through an explicit approved change.

---

## 3. Section 52 Relationship Contract

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

## 4. Global ERD Rules

### 4.1 Tenant Isolation Rule

Every sensitive operational table must include:

```text
workspace_id NOT NULL
```

### 4.2 Commercial Ownership Rule

Every usage, cost, subscription, quota, or commercial ownership table must include:

```text
customer_account_id NOT NULL
```

### 4.3 API Trust Boundary Rule

`workspace_id` must not be accepted from request body as a trusted source.

It must come from route/context after authorization.

### 4.4 Historical Immutability Rule

The following fields must not be mutated after record creation:

```text
workspace_id
customer_account_id
created_by_user_id
submitted_by_user_id
content_hash
media_asset_version_id in ManualPublishEvidence
```

---

## 5. Identity / Tenant / RBAC Domain

### 5.1 CustomerAccount

Represents the paying commercial account.

| Field | Type | Constraint |
|---|---|---|
| customer_account_id | UUID | PK |
| account_name | varchar | NOT NULL |
| legal_name | varchar | NULL |
| billing_email | varchar | NOT NULL |
| account_status | enum | NOT NULL |
| created_at | timestamptz | NOT NULL |
| updated_at | timestamptz | NOT NULL |

Constraints:

```text
account_status IN ('active','suspended','closed')
```

Indexes:

```text
idx_customer_accounts_status(account_status)
uq_customer_accounts_billing_email(billing_email)
```

---

### 5.2 Workspace

Operational workspace inside a CustomerAccount.

| Field | Type | Constraint |
|---|---|---|
| workspace_id | UUID | PK |
| customer_account_id | UUID | FK → CustomerAccount |
| workspace_name | varchar | NOT NULL |
| workspace_slug | varchar | NOT NULL |
| workspace_status | enum | NOT NULL |
| default_locale | varchar | NOT NULL |
| timezone | varchar | NOT NULL |
| created_by_user_id | UUID | FK → User |
| created_at | timestamptz | NOT NULL |
| updated_at | timestamptz | NOT NULL |

Constraints:

```text
customer_account_id NOT NULL
workspace_status IN ('active','suspended','archived')
customer_account_id immutable after insert
```

Indexes:

```text
idx_workspaces_customer_account(customer_account_id)
uq_workspace_slug_per_customer(customer_account_id, workspace_slug)
idx_workspaces_status(workspace_status)
```

---

### 5.3 User

Global user account.

| Field | Type | Constraint |
|---|---|---|
| user_id | UUID | PK |
| email | varchar | NOT NULL UNIQUE |
| full_name | varchar | NOT NULL |
| user_status | enum | NOT NULL |
| last_login_at | timestamptz | NULL |
| created_at | timestamptz | NOT NULL |
| updated_at | timestamptz | NOT NULL |

Constraints:

```text
user_status IN ('invited','active','disabled')
```

Indexes:

```text
uq_users_email(email)
idx_users_status(user_status)
```

---

### 5.4 Role

Access role.

| Field | Type | Constraint |
|---|---|---|
| role_id | UUID | PK |
| role_code | varchar | NOT NULL UNIQUE |
| role_name | varchar | NOT NULL |
| role_scope | enum | NOT NULL |
| is_system_role | boolean | NOT NULL DEFAULT false |
| created_at | timestamptz | NOT NULL |

Phase 0/1 roles:

```text
Owner
Admin
Creator
Reviewer
Publisher
BillingAdmin
Viewer
```

Constraints:

```text
role_scope IN ('system','workspace')
```

Indexes:

```text
uq_roles_code(role_code)
idx_roles_scope(role_scope)
```

---

### 5.5 Permission

Fine-grained permission.

| Field | Type | Constraint |
|---|---|---|
| permission_id | UUID | PK |
| permission_code | varchar | NOT NULL UNIQUE |
| permission_name | varchar | NOT NULL |
| domain | varchar | NOT NULL |
| created_at | timestamptz | NOT NULL |

Examples:

```text
campaign.read
campaign.write
media_job.create
review.assign
approval.decide
publish_job.create
manual_evidence.submit
billing.read
billing.manage
workspace.manage_members
report.generate
```

Indexes:

```text
uq_permissions_code(permission_code)
idx_permissions_domain(domain)
```

---

### 5.6 RolePermission

Maps roles to permissions.

| Field | Type | Constraint |
|---|---|---|
| role_permission_id | UUID | PK |
| role_id | UUID | FK → Role |
| permission_id | UUID | FK → Permission |
| created_at | timestamptz | NOT NULL |

Constraints:

```text
UNIQUE(role_id, permission_id)
```

Indexes:

```text
idx_role_permissions_role(role_id)
idx_role_permissions_permission(permission_id)
```

---

### 5.7 WorkspaceMember

User membership inside a Workspace.

| Field | Type | Constraint |
|---|---|---|
| workspace_member_id | UUID | PK |
| workspace_id | UUID | FK → Workspace |
| user_id | UUID | FK → User |
| role_id | UUID | FK → Role |
| member_status | enum | NOT NULL |
| invited_by_user_id | UUID | FK → User NULL |
| joined_at | timestamptz | NULL |
| created_at | timestamptz | NOT NULL |
| updated_at | timestamptz | NOT NULL |

Constraints:

```text
UNIQUE(workspace_id, user_id)
member_status IN ('invited','active','disabled','removed')
```

Indexes:

```text
idx_workspace_members_workspace(workspace_id)
idx_workspace_members_user(user_id)
idx_workspace_members_role(role_id)
idx_workspace_members_status(workspace_id, member_status)
```

---

## 6. Commercial Subscription Domain

### 6.1 SubscriptionPlan

Global subscription plan.

| Field | Type | Constraint |
|---|---|---|
| subscription_plan_id | UUID | PK |
| plan_code | varchar | NOT NULL UNIQUE |
| plan_name | varchar | NOT NULL |
| plan_status | enum | NOT NULL |
| created_at | timestamptz | NOT NULL |
| updated_at | timestamptz | NOT NULL |

Constraints:

```text
plan_status IN ('draft','active','retired')
```

---

### 6.2 SubscriptionPlanVersion

Versioned commercial plan.

| Field | Type | Constraint |
|---|---|---|
| subscription_plan_version_id | UUID | PK |
| subscription_plan_id | UUID | FK → SubscriptionPlan |
| version_number | int | NOT NULL |
| status | enum | NOT NULL |
| price_amount | numeric | NOT NULL |
| currency | char(3) | NOT NULL |
| billing_interval | enum | NOT NULL |
| effective_from | timestamptz | NOT NULL |
| effective_to | timestamptz | NULL |
| created_at | timestamptz | NOT NULL |

Constraints:

```text
UNIQUE(subscription_plan_id, version_number)
status IN ('draft','active','retired')
billing_interval IN ('monthly','yearly')
price_amount >= 0
```

Indexes:

```text
idx_plan_versions_plan(subscription_plan_id)
idx_plan_versions_active(subscription_plan_id, status)
```

---

### 6.3 PlanEntitlementVersion

Entitlements attached to a plan version.

| Field | Type | Constraint |
|---|---|---|
| plan_entitlement_version_id | UUID | PK |
| subscription_plan_version_id | UUID | FK → SubscriptionPlanVersion |
| entitlement_code | varchar | NOT NULL |
| entitlement_value | jsonb | NOT NULL |
| created_at | timestamptz | NOT NULL |

Examples:

```text
monthly_media_jobs_limit
monthly_publish_jobs_limit
brand_profiles_limit
team_members_limit
manual_publish_evidence_limit
```

Constraints:

```text
UNIQUE(subscription_plan_version_id, entitlement_code)
```

Indexes:

```text
idx_entitlements_plan_version(subscription_plan_version_id)
idx_entitlements_code(entitlement_code)
```

---

### 6.4 CustomerSubscription

Customer account subscription.

| Field | Type | Constraint |
|---|---|---|
| customer_subscription_id | UUID | PK |
| customer_account_id | UUID | FK → CustomerAccount |
| subscription_plan_version_id | UUID | FK → SubscriptionPlanVersion |
| subscription_status | enum | NOT NULL |
| started_at | timestamptz | NOT NULL |
| current_period_start | timestamptz | NOT NULL |
| current_period_end | timestamptz | NOT NULL |
| canceled_at | timestamptz | NULL |
| created_at | timestamptz | NOT NULL |
| updated_at | timestamptz | NOT NULL |

Constraints:

```text
customer_account_id NOT NULL
subscription_status IN ('trialing','active','past_due','canceled','expired')
current_period_end > current_period_start
```

Indexes:

```text
idx_customer_subscriptions_customer(customer_account_id)
idx_customer_subscriptions_status(customer_account_id, subscription_status)
idx_customer_subscriptions_period(customer_account_id, current_period_start, current_period_end)
```

---

### 6.5 CustomerSubscriptionSnapshot

Immutable subscription snapshot.

| Field | Type | Constraint |
|---|---|---|
| customer_subscription_snapshot_id | UUID | PK |
| customer_subscription_id | UUID | FK → CustomerSubscription |
| customer_account_id | UUID | FK → CustomerAccount |
| subscription_plan_version_id | UUID | FK → SubscriptionPlanVersion |
| snapshot_reason | enum | NOT NULL |
| plan_snapshot | jsonb | NOT NULL |
| entitlement_snapshot | jsonb | NOT NULL |
| billing_period_snapshot | jsonb | NOT NULL |
| created_at | timestamptz | NOT NULL |

Rules:

```text
Append-only
plan_snapshot immutable
entitlement_snapshot immutable
```

Indexes:

```text
idx_subscription_snapshots_subscription(customer_subscription_id)
idx_subscription_snapshots_customer(customer_account_id)
idx_subscription_snapshots_created(created_at)
```

---

## 7. Campaign / Creative Production Domain

### 7.1 Campaign

Marketing campaign.

| Field | Type | Constraint |
|---|---|---|
| campaign_id | UUID | PK |
| workspace_id | UUID | FK → Workspace |
| customer_account_id | UUID | FK → CustomerAccount |
| campaign_name | varchar | NOT NULL |
| campaign_objective | varchar | NOT NULL |
| campaign_status | enum | NOT NULL |
| created_by_user_id | UUID | FK → User |
| created_at | timestamptz | NOT NULL |
| updated_at | timestamptz | NOT NULL |

Constraints:

```text
workspace_id NOT NULL
customer_account_id NOT NULL
campaign_status IN ('draft','active','paused','completed','archived')
```

Indexes:

```text
idx_campaigns_workspace(workspace_id)
idx_campaigns_customer(customer_account_id)
idx_campaigns_status(workspace_id, campaign_status)
idx_campaigns_created(workspace_id, created_at)
```

---

### 7.2 CampaignStateTransition

Campaign status history.

| Field | Type | Constraint |
|---|---|---|
| campaign_state_transition_id | UUID | PK |
| workspace_id | UUID | FK → Workspace |
| campaign_id | UUID | FK → Campaign |
| from_status | enum | NULL |
| to_status | enum | NOT NULL |
| reason | text | NULL |
| changed_by_user_id | UUID | FK → User |
| changed_at | timestamptz | NOT NULL |

Constraints:

```text
workspace_id NOT NULL
to_status IN ('draft','active','paused','completed','archived')
```

Indexes:

```text
idx_campaign_transitions_campaign(campaign_id, changed_at)
idx_campaign_transitions_workspace(workspace_id, changed_at)
```

---

### 7.3 BriefVersion

Versioned campaign brief.

| Field | Type | Constraint |
|---|---|---|
| brief_version_id | UUID | PK |
| workspace_id | UUID | FK → Workspace |
| campaign_id | UUID | FK → Campaign |
| version_number | int | NOT NULL |
| brief_title | varchar | NOT NULL |
| brief_content | jsonb | NOT NULL |
| content_hash | char(64) | NOT NULL |
| status | enum | NOT NULL |
| created_by_user_id | UUID | FK → User |
| created_at | timestamptz | NOT NULL |

Constraints:

```text
UNIQUE(campaign_id, version_number)
status IN ('draft','locked','superseded')
content_hash immutable
```

Indexes:

```text
idx_brief_versions_campaign(campaign_id)
idx_brief_versions_workspace(workspace_id)
uq_brief_versions_hash(campaign_id, content_hash)
```

---

### 7.4 PromptTemplate

Generation prompt template.

| Field | Type | Constraint |
|---|---|---|
| prompt_template_id | UUID | PK |
| workspace_id | UUID | FK → Workspace |
| template_name | varchar | NOT NULL |
| template_type | enum | NOT NULL |
| template_body | text | NOT NULL |
| template_variables | jsonb | NOT NULL |
| template_status | enum | NOT NULL |
| version_number | int | NOT NULL |
| created_by_user_id | UUID | FK → User |
| created_at | timestamptz | NOT NULL |
| updated_at | timestamptz | NOT NULL |

Constraints:

```text
UNIQUE(workspace_id, template_name, version_number)
template_type IN ('caption','ad_copy','image_prompt','video_script','report','reply')
template_status IN ('draft','active','retired')
```

Indexes:

```text
idx_prompt_templates_workspace(workspace_id)
idx_prompt_templates_type(workspace_id, template_type)
idx_prompt_templates_status(workspace_id, template_status)
```

---

### 7.5 MediaJob

Approved generation/transformation job entity.

| Field | Type | Constraint |
|---|---|---|
| media_job_id | UUID | PK |
| workspace_id | UUID | FK → Workspace |
| customer_account_id | UUID | FK → CustomerAccount |
| campaign_id | UUID | FK → Campaign |
| brief_version_id | UUID | FK → BriefVersion |
| prompt_template_id | UUID | FK → PromptTemplate |
| job_type | enum | NOT NULL |
| job_status | enum | NOT NULL |
| input_payload | jsonb | NOT NULL |
| requested_output_format | varchar | NOT NULL |
| idempotency_key | varchar | NOT NULL |
| requested_by_user_id | UUID | FK → User |
| started_at | timestamptz | NULL |
| completed_at | timestamptz | NULL |
| failed_at | timestamptz | NULL |
| failure_code | varchar | NULL |
| created_at | timestamptz | NOT NULL |
| updated_at | timestamptz | NOT NULL |

Constraints:

```text
workspace_id NOT NULL
customer_account_id NOT NULL
UNIQUE(workspace_id, idempotency_key)
job_status IN ('queued','running','succeeded','failed','canceled')
job_type IN ('text','image','video','image_enhancement','variant','report_asset')
```

Governing rule:

```text
MediaJob must not start before MediaCostSnapshot.cost_check_result = 'approved'
```

Indexes:

```text
idx_media_jobs_workspace(workspace_id)
idx_media_jobs_campaign(campaign_id)
idx_media_jobs_brief_version(brief_version_id)
idx_media_jobs_status(workspace_id, job_status)
idx_media_jobs_created(workspace_id, created_at)
uq_media_jobs_idempotency(workspace_id, idempotency_key)
```

---

### 7.6 MediaCostSnapshot

Cost snapshot linked 1:1 to MediaJob.

| Field | Type | Constraint |
|---|---|---|
| media_cost_snapshot_id | UUID | PK |
| workspace_id | UUID | FK → Workspace |
| customer_account_id | UUID | FK → CustomerAccount |
| media_job_id | UUID | FK → MediaJob UNIQUE |
| media_cost_policy_id | UUID | FK → MediaCostPolicy |
| estimated_cost_amount | numeric | NOT NULL |
| estimated_cost_currency | char(3) | NOT NULL |
| quota_snapshot | jsonb | NOT NULL |
| policy_snapshot | jsonb | NOT NULL |
| cost_check_result | enum | NOT NULL |
| reason | text | NULL |
| created_at | timestamptz | NOT NULL |

Constraints:

```text
UNIQUE(media_job_id)
cost_check_result IN ('approved','rejected','requires_review')
estimated_cost_amount >= 0
```

Indexes:

```text
idx_media_cost_snapshots_workspace(workspace_id)
idx_media_cost_snapshots_job(media_job_id)
idx_media_cost_snapshots_result(workspace_id, cost_check_result)
```

---

### 7.7 MediaAsset

General asset produced by MediaJob.

| Field | Type | Constraint |
|---|---|---|
| media_asset_id | UUID | PK |
| workspace_id | UUID | FK → Workspace |
| customer_account_id | UUID | FK → CustomerAccount |
| media_job_id | UUID | FK → MediaJob |
| campaign_id | UUID | FK → Campaign |
| asset_type | enum | NOT NULL |
| asset_status | enum | NOT NULL |
| created_by_user_id | UUID | FK → User |
| created_at | timestamptz | NOT NULL |
| updated_at | timestamptz | NOT NULL |

Constraints:

```text
workspace_id NOT NULL
customer_account_id NOT NULL
asset_type IN ('text','image','video','mixed','report')
asset_status IN ('draft','in_review','approved','rejected','archived')
```

Governing rule:

```text
MediaAsset.asset_status = 'approved' is not enough for publishing.
Publishing truth = ApprovalDecision + MediaAssetVersion.content_hash.
```

Indexes:

```text
idx_media_assets_workspace(workspace_id)
idx_media_assets_campaign(campaign_id)
idx_media_assets_job(media_job_id)
idx_media_assets_status(workspace_id, asset_status)
```

---

### 7.8 MediaAssetVersion

Reviewable and publishable asset version.

| Field | Type | Constraint |
|---|---|---|
| media_asset_version_id | UUID | PK |
| workspace_id | UUID | FK → Workspace |
| customer_account_id | UUID | FK → CustomerAccount |
| media_asset_id | UUID | FK → MediaAsset |
| version_number | int | NOT NULL |
| content_payload | jsonb | NOT NULL |
| content_hash | char(64) | NOT NULL |
| storage_ref | text | NULL |
| version_status | enum | NOT NULL |
| created_by_user_id | UUID | FK → User |
| created_at | timestamptz | NOT NULL |

Constraints:

```text
UNIQUE(media_asset_id, version_number)
UNIQUE(media_asset_id, content_hash)
content_hash immutable
version_status IN ('draft','in_review','approved','rejected','superseded','archived')
```

Rule:

```text
Approved content must not be patched.
Any content change creates a new MediaAssetVersion.
```

Indexes:

```text
idx_asset_versions_workspace(workspace_id)
idx_asset_versions_asset(media_asset_id)
idx_asset_versions_status(workspace_id, version_status)
idx_asset_versions_hash(content_hash)
```

---

### 7.9 CreativePackage

Creative package connected to Campaign.

| Field | Type | Constraint |
|---|---|---|
| creative_package_id | UUID | PK |
| workspace_id | UUID | FK → Workspace |
| campaign_id | UUID | FK → Campaign |
| package_name | varchar | NOT NULL |
| package_status | enum | NOT NULL |
| package_payload | jsonb | NOT NULL |
| created_by_user_id | UUID | FK → User |
| created_at | timestamptz | NOT NULL |
| updated_at | timestamptz | NOT NULL |

Constraints:

```text
package_status IN ('draft','ready','archived')
```

Indexes:

```text
idx_creative_packages_workspace(workspace_id)
idx_creative_packages_campaign(campaign_id)
idx_creative_packages_status(workspace_id, package_status)
```

---

## 8. Review / Approval / Publish Domain

### 8.1 ReviewTask

Review task for MediaAssetVersion.

| Field | Type | Constraint |
|---|---|---|
| review_task_id | UUID | PK |
| workspace_id | UUID | FK → Workspace |
| media_asset_version_id | UUID | FK → MediaAssetVersion |
| assigned_to_user_id | UUID | FK → User NULL |
| review_status | enum | NOT NULL |
| review_type | enum | NOT NULL |
| due_at | timestamptz | NULL |
| created_by_user_id | UUID | FK → User |
| created_at | timestamptz | NOT NULL |
| updated_at | timestamptz | NOT NULL |

Constraints:

```text
review_status IN ('open','in_review','completed','canceled')
review_type IN ('brand','legal','quality','final')
```

Indexes:

```text
idx_review_tasks_workspace(workspace_id)
idx_review_tasks_asset_version(media_asset_version_id)
idx_review_tasks_assignee(workspace_id, assigned_to_user_id)
idx_review_tasks_status(workspace_id, review_status)
```

---

### 8.2 ApprovalDecision

Source of approval truth.

| Field | Type | Constraint |
|---|---|---|
| approval_decision_id | UUID | PK |
| workspace_id | UUID | FK → Workspace |
| review_task_id | UUID | FK → ReviewTask |
| media_asset_version_id | UUID | FK → MediaAssetVersion |
| decision | enum | NOT NULL |
| approved_content_hash | char(64) | NULL |
| decision_reason | text | NULL |
| decided_by_user_id | UUID | FK → User |
| decided_at | timestamptz | NOT NULL |
| created_at | timestamptz | NOT NULL |

Constraints:

```text
decision IN ('approved','rejected','changes_requested')
```

When `decision = 'approved'`:

```text
approved_content_hash NOT NULL
approved_content_hash = MediaAssetVersion.content_hash
MediaAssetVersion.version_status = 'approved'
```

Indexes:

```text
idx_approval_decisions_workspace(workspace_id)
idx_approval_decisions_review_task(review_task_id)
idx_approval_decisions_asset_version(media_asset_version_id)
idx_approval_decisions_decision(workspace_id, decision)
```

---

### 8.3 PublishJob

Manual or semi-manual publish job.

| Field | Type | Constraint |
|---|---|---|
| publish_job_id | UUID | PK |
| workspace_id | UUID | FK → Workspace |
| customer_account_id | UUID | FK → CustomerAccount |
| approval_decision_id | UUID | FK → ApprovalDecision |
| media_asset_version_id | UUID | FK → MediaAssetVersion |
| campaign_id | UUID | FK → Campaign |
| channel | varchar | NOT NULL |
| publish_status | enum | NOT NULL |
| scheduled_at | timestamptz | NULL |
| published_at | timestamptz | NULL |
| idempotency_key | varchar | NOT NULL |
| created_by_user_id | UUID | FK → User |
| created_at | timestamptz | NOT NULL |
| updated_at | timestamptz | NOT NULL |

Constraints:

```text
workspace_id NOT NULL
customer_account_id NOT NULL
UNIQUE(workspace_id, idempotency_key)
publish_status IN ('draft','ready','submitted','published','failed','canceled')
```

Governing rule:

```text
ApprovalDecision.decision = 'approved'
ApprovalDecision.media_asset_version_id = PublishJob.media_asset_version_id
ApprovalDecision.approved_content_hash = MediaAssetVersion.content_hash
```

Indexes:

```text
idx_publish_jobs_workspace(workspace_id)
idx_publish_jobs_campaign(campaign_id)
idx_publish_jobs_status(workspace_id, publish_status)
idx_publish_jobs_approval(approval_decision_id)
uq_publish_jobs_idempotency(workspace_id, idempotency_key)
```

---

### 8.4 ManualPublishEvidence

Manual publishing evidence.

| Field | Type | Constraint |
|---|---|---|
| manual_publish_evidence_id | UUID | PK |
| workspace_id | UUID | FK → Workspace |
| publish_job_id | UUID | FK → PublishJob |
| media_asset_version_id | UUID | FK → MediaAssetVersion |
| published_url | text | NULL |
| screenshot_ref | text | NULL |
| external_post_id | varchar | NULL |
| content_hash | char(64) | NOT NULL |
| evidence_status | enum | NOT NULL |
| supersedes_evidence_id | UUID | FK → ManualPublishEvidence NULL |
| invalidated_reason | text | NULL |
| submitted_by_user_id | UUID | FK → User |
| submitted_at | timestamptz | NOT NULL |
| created_at | timestamptz | NOT NULL |

Constraints:

```text
evidence_status IN ('valid','superseded','invalidated')
```

Forbidden operations:

```text
PATCH
DELETE
Update submitted_by_user_id
Update submitted_at
Update content_hash
Update media_asset_version_id
```

Corrections must use:

```text
supersede
invalidate
```

Indexes:

```text
idx_manual_evidence_workspace(workspace_id)
idx_manual_evidence_publish_job(publish_job_id)
idx_manual_evidence_asset_version(media_asset_version_id)
idx_manual_evidence_status(workspace_id, evidence_status)
```

---

### 8.5 TrackedLink

Tracked link connected to PublishJob.

| Field | Type | Constraint |
|---|---|---|
| tracked_link_id | UUID | PK |
| workspace_id | UUID | FK → Workspace |
| publish_job_id | UUID | FK → PublishJob |
| original_url | text | NOT NULL |
| tracked_url | text | NOT NULL |
| tracking_code | varchar | NOT NULL |
| link_status | enum | NOT NULL |
| created_at | timestamptz | NOT NULL |

Constraints:

```text
UNIQUE(workspace_id, tracking_code)
link_status IN ('active','disabled','expired')
```

Indexes:

```text
idx_tracked_links_workspace(workspace_id)
idx_tracked_links_publish_job(publish_job_id)
uq_tracked_links_code(workspace_id, tracking_code)
```

---

## 9. Brand / Template / Report Settings Domain

### 9.1 BrandProfile

Workspace brand profile.

| Field | Type | Constraint |
|---|---|---|
| brand_profile_id | UUID | PK |
| workspace_id | UUID | FK → Workspace |
| profile_name | varchar | NOT NULL |
| brand_summary | text | NULL |
| language | varchar | NOT NULL |
| tone | varchar | NULL |
| brand_status | enum | NOT NULL |
| created_by_user_id | UUID | FK → User |
| created_at | timestamptz | NOT NULL |
| updated_at | timestamptz | NOT NULL |

Constraints:

```text
UNIQUE(workspace_id, profile_name)
brand_status IN ('draft','active','archived')
```

Indexes:

```text
idx_brand_profiles_workspace(workspace_id)
idx_brand_profiles_status(workspace_id, brand_status)
```

---

### 9.2 BrandVoiceRule

Brand voice and governance rules.

| Field | Type | Constraint |
|---|---|---|
| brand_voice_rule_id | UUID | PK |
| brand_profile_id | UUID | FK → BrandProfile |
| workspace_id | UUID | FK → Workspace |
| rule_type | enum | NOT NULL |
| rule_text | text | NOT NULL |
| severity | enum | NOT NULL |
| rule_status | enum | NOT NULL |
| created_at | timestamptz | NOT NULL |

Constraints:

```text
rule_type IN ('tone','banned_claim','required_phrase','style','legal','locale')
severity IN ('info','warning','blocker')
rule_status IN ('active','disabled')
```

Indexes:

```text
idx_brand_voice_rules_profile(brand_profile_id)
idx_brand_voice_rules_workspace(workspace_id)
idx_brand_voice_rules_type(workspace_id, rule_type)
```

---

### 9.3 ReportTemplate

Report template.

| Field | Type | Constraint |
|---|---|---|
| report_template_id | UUID | PK |
| workspace_id | UUID | FK → Workspace |
| template_name | varchar | NOT NULL |
| template_body | jsonb | NOT NULL |
| template_status | enum | NOT NULL |
| created_by_user_id | UUID | FK → User |
| created_at | timestamptz | NOT NULL |
| updated_at | timestamptz | NOT NULL |

Constraints:

```text
UNIQUE(workspace_id, template_name)
template_status IN ('draft','active','retired')
```

Indexes:

```text
idx_report_templates_workspace(workspace_id)
idx_report_templates_status(workspace_id, template_status)
```

---

### 9.4 ClientReportSnapshot

Frozen client report.

| Field | Type | Constraint |
|---|---|---|
| client_report_snapshot_id | UUID | PK |
| workspace_id | UUID | FK → Workspace |
| customer_account_id | UUID | FK → CustomerAccount |
| campaign_id | UUID | FK → Campaign |
| report_template_id | UUID | FK → ReportTemplate |
| report_period_start | timestamptz | NOT NULL |
| report_period_end | timestamptz | NOT NULL |
| report_snapshot_payload | jsonb | NOT NULL |
| evidence_snapshot_payload | jsonb | NOT NULL |
| generated_by_user_id | UUID | FK → User |
| generated_at | timestamptz | NOT NULL |
| content_hash | char(64) | NOT NULL |

Constraints:

```text
report_period_end > report_period_start
content_hash immutable
```

Rule:

```text
Later ManualPublishEvidence changes must not mutate old ClientReportSnapshot records.
```

Indexes:

```text
idx_client_reports_workspace(workspace_id)
idx_client_reports_campaign(campaign_id)
idx_client_reports_period(workspace_id, report_period_start, report_period_end)
idx_client_reports_generated(workspace_id, generated_at)
```

---

## 10. Usage / Quota / Cost / Guardrail Domain

### 10.1 UsageMeter

Commercial usage source of truth.

| Field | Type | Constraint |
|---|---|---|
| usage_meter_id | UUID | PK |
| workspace_id | UUID | FK → Workspace |
| customer_account_id | UUID | FK → CustomerAccount |
| usage_type | varchar | NOT NULL |
| quantity | numeric | NOT NULL |
| unit | varchar | NOT NULL |
| source_entity_type | varchar | NOT NULL |
| source_entity_id | UUID | NOT NULL |
| usable_output_confirmed | boolean | NOT NULL |
| metered_at | timestamptz | NOT NULL |
| idempotency_key | varchar | NOT NULL |
| created_at | timestamptz | NOT NULL |

Constraints:

```text
customer_account_id NOT NULL
workspace_id NOT NULL
quantity > 0
usable_output_confirmed = true
UNIQUE(workspace_id, idempotency_key)
```

Indexes:

```text
idx_usage_meter_workspace(workspace_id, metered_at)
idx_usage_meter_customer(customer_account_id, metered_at)
idx_usage_meter_type(workspace_id, usage_type)
uq_usage_meter_idempotency(workspace_id, idempotency_key)
```

---

### 10.2 UsageQuotaState

Current quota state.

| Field | Type | Constraint |
|---|---|---|
| usage_quota_state_id | UUID | PK |
| workspace_id | UUID | FK → Workspace |
| customer_account_id | UUID | FK → CustomerAccount |
| quota_code | varchar | NOT NULL |
| period_start | timestamptz | NOT NULL |
| period_end | timestamptz | NOT NULL |
| used_quantity | numeric | NOT NULL DEFAULT 0 |
| limit_quantity | numeric | NOT NULL |
| updated_at | timestamptz | NOT NULL |

Constraints:

```text
UNIQUE(workspace_id, quota_code, period_start, period_end)
used_quantity >= 0
limit_quantity >= 0
```

Indexes:

```text
idx_quota_state_workspace(workspace_id)
idx_quota_state_customer(customer_account_id)
idx_quota_state_period(workspace_id, period_start, period_end)
```

---

### 10.3 CostEvent

Internal cost source of truth.

| Field | Type | Constraint |
|---|---|---|
| cost_event_id | UUID | PK |
| workspace_id | UUID | FK → Workspace |
| customer_account_id | UUID | FK → CustomerAccount |
| media_job_id | UUID | FK → MediaJob NULL |
| cost_type | varchar | NOT NULL |
| provider_name | varchar | NULL |
| amount | numeric | NOT NULL |
| currency | char(3) | NOT NULL |
| event_status | enum | NOT NULL |
| source_entity_type | varchar | NOT NULL |
| source_entity_id | UUID | NOT NULL |
| occurred_at | timestamptz | NOT NULL |
| created_at | timestamptz | NOT NULL |

Constraints:

```text
amount >= 0
event_status IN ('estimated','actual','reversed')
```

Rule:

```text
CostEvent does not mean customer billing.
```

Indexes:

```text
idx_cost_events_workspace(workspace_id, occurred_at)
idx_cost_events_customer(customer_account_id, occurred_at)
idx_cost_events_media_job(media_job_id)
idx_cost_events_type(workspace_id, cost_type)
```

---

### 10.4 CostBudget

Workspace cost budget.

| Field | Type | Constraint |
|---|---|---|
| cost_budget_id | UUID | PK |
| workspace_id | UUID | FK → Workspace |
| customer_account_id | UUID | FK → CustomerAccount |
| budget_name | varchar | NOT NULL |
| budget_amount | numeric | NOT NULL |
| currency | char(3) | NOT NULL |
| period_start | timestamptz | NOT NULL |
| period_end | timestamptz | NOT NULL |
| budget_status | enum | NOT NULL |
| created_at | timestamptz | NOT NULL |
| updated_at | timestamptz | NOT NULL |

Constraints:

```text
budget_amount >= 0
period_end > period_start
budget_status IN ('active','paused','expired')
```

Indexes:

```text
idx_cost_budgets_workspace(workspace_id)
idx_cost_budgets_period(workspace_id, period_start, period_end)
```

---

### 10.5 CostGuardrail

Cost control guardrail.

| Field | Type | Constraint |
|---|---|---|
| cost_guardrail_id | UUID | PK |
| workspace_id | UUID | FK → Workspace |
| customer_account_id | UUID | FK → CustomerAccount |
| guardrail_name | varchar | NOT NULL |
| guardrail_type | enum | NOT NULL |
| threshold_amount | numeric | NOT NULL |
| currency | char(3) | NOT NULL |
| action | enum | NOT NULL |
| guardrail_status | enum | NOT NULL |
| created_at | timestamptz | NOT NULL |
| updated_at | timestamptz | NOT NULL |

Constraints:

```text
guardrail_type IN ('daily','monthly','per_job','per_campaign')
action IN ('warn','block','require_review')
guardrail_status IN ('active','disabled')
```

Indexes:

```text
idx_cost_guardrails_workspace(workspace_id)
idx_cost_guardrails_status(workspace_id, guardrail_status)
```

---

### 10.6 MediaCostPolicy

Media cost policy.

| Field | Type | Constraint |
|---|---|---|
| media_cost_policy_id | UUID | PK |
| workspace_id | UUID | FK → Workspace |
| customer_account_id | UUID | FK → CustomerAccount |
| policy_name | varchar | NOT NULL |
| policy_rules | jsonb | NOT NULL |
| policy_status | enum | NOT NULL |
| effective_from | timestamptz | NOT NULL |
| effective_to | timestamptz | NULL |
| created_at | timestamptz | NOT NULL |
| updated_at | timestamptz | NOT NULL |

Constraints:

```text
policy_status IN ('draft','active','retired')
```

Indexes:

```text
idx_media_cost_policies_workspace(workspace_id)
idx_media_cost_policies_status(workspace_id, policy_status)
idx_media_cost_policies_effective(workspace_id, effective_from, effective_to)
```

---

## 11. Operations / Audit / Admin Domain

### 11.1 AuditLog

Append-only audit trail.

| Field | Type | Constraint |
|---|---|---|
| audit_log_id | UUID | PK |
| workspace_id | UUID | FK → Workspace |
| customer_account_id | UUID | FK → CustomerAccount NULL |
| actor_user_id | UUID | FK → User NULL |
| action | varchar | NOT NULL |
| entity_type | varchar | NOT NULL |
| entity_id | UUID | NOT NULL |
| before_snapshot | jsonb | NULL |
| after_snapshot | jsonb | NULL |
| metadata | jsonb | NULL |
| correlation_id | varchar | NOT NULL |
| occurred_at | timestamptz | NOT NULL |

Rules:

```text
Append-only
No delete through API
No update through API
AuditLog is not a business state source
```

Indexes:

```text
idx_audit_logs_workspace(workspace_id, occurred_at)
idx_audit_logs_entity(entity_type, entity_id)
idx_audit_logs_actor(actor_user_id, occurred_at)
idx_audit_logs_correlation(correlation_id)
```

Required audit events:

```text
workspace.created
member.invited
member.role_changed
campaign.created
campaign.status_changed
brief.version_created
media_job.created
media_job.completed
media_job.failed
media_asset.version_created
review_task.created
approval_decision.created
publish_job.created
manual_publish_evidence.submitted
manual_publish_evidence.superseded
manual_publish_evidence.invalidated
usage_meter.recorded
cost_event.recorded
client_report_snapshot.generated
safe_mode.activated
safe_mode.deactivated
```

---

### 11.2 AdminNotification

Administrative notification.

| Field | Type | Constraint |
|---|---|---|
| admin_notification_id | UUID | PK |
| workspace_id | UUID | FK → Workspace |
| notification_type | varchar | NOT NULL |
| severity | enum | NOT NULL |
| title | varchar | NOT NULL |
| message | text | NOT NULL |
| read_at | timestamptz | NULL |
| created_at | timestamptz | NOT NULL |

Constraints:

```text
severity IN ('info','warning','critical')
```

Indexes:

```text
idx_admin_notifications_workspace(workspace_id, created_at)
idx_admin_notifications_unread(workspace_id, read_at)
idx_admin_notifications_severity(workspace_id, severity)
```

---

### 11.3 SafeModeState

Workspace safe mode state.

| Field | Type | Constraint |
|---|---|---|
| safe_mode_state_id | UUID | PK |
| workspace_id | UUID | FK → Workspace |
| safe_mode_status | enum | NOT NULL |
| reason | text | NULL |
| activated_by_user_id | UUID | FK → User NULL |
| activated_at | timestamptz | NULL |
| deactivated_at | timestamptz | NULL |
| created_at | timestamptz | NOT NULL |
| updated_at | timestamptz | NOT NULL |

Constraints:

```text
safe_mode_status IN ('inactive','active')
```

Indexes:

```text
idx_safe_mode_workspace(workspace_id)
idx_safe_mode_status(workspace_id, safe_mode_status)
```

---

### 11.4 OnboardingProgress

Workspace onboarding status.

| Field | Type | Constraint |
|---|---|---|
| onboarding_progress_id | UUID | PK |
| workspace_id | UUID | FK → Workspace |
| onboarding_status | enum | NOT NULL |
| current_step | varchar | NOT NULL |
| progress_payload | jsonb | NOT NULL |
| completed_at | timestamptz | NULL |
| updated_at | timestamptz | NOT NULL |

Constraints:

```text
UNIQUE(workspace_id)
onboarding_status IN ('not_started','in_progress','completed','skipped')
```

Indexes:

```text
idx_onboarding_workspace(workspace_id)
idx_onboarding_status(onboarding_status)
```

---

### 11.5 SetupChecklistItem

Onboarding/setup checklist item.

| Field | Type | Constraint |
|---|---|---|
| setup_checklist_item_id | UUID | PK |
| workspace_id | UUID | FK → Workspace |
| item_code | varchar | NOT NULL |
| item_title | varchar | NOT NULL |
| item_status | enum | NOT NULL |
| completed_by_user_id | UUID | FK → User NULL |
| completed_at | timestamptz | NULL |
| created_at | timestamptz | NOT NULL |
| updated_at | timestamptz | NOT NULL |

Constraints:

```text
UNIQUE(workspace_id, item_code)
item_status IN ('pending','completed','skipped','blocked')
```

Indexes:

```text
idx_setup_items_workspace(workspace_id)
idx_setup_items_status(workspace_id, item_status)
```

---

## 12. Approved Permission Tables

```text
User
Role
Permission
RolePermission
WorkspaceMember
```

### Suggested Phase 0/1 Role Mapping

| Role | Core permissions |
|---|---|
| Owner | All permissions |
| Admin | Workspace, members, settings |
| Creator | Campaign / Brief / MediaJob creation |
| Reviewer | MediaAssetVersion review |
| Publisher | PublishJob and ManualPublishEvidence |
| BillingAdmin | Subscription, quotas, costs |
| Viewer | Read-only |

Every API must pass through:

```text
AuthGuard
WorkspaceContextGuard
Membership Check
PermissionGuard
```

---

## 13. Settings Tables

The following tables act as settings in Phase 0/1:

```text
BrandProfile
BrandVoiceRule
PromptTemplate
ReportTemplate
MediaCostPolicy
CostBudget
CostGuardrail
SafeModeState
OnboardingProgress
SetupChecklistItem
```

Settings changes must not mutate historical records.

Snapshots must be taken when creating or generating:

```text
MediaJob
MediaCostSnapshot
ClientReportSnapshot
BriefVersion
MediaAssetVersion
```

---

## 14. Status History

Approved explicit state history table:

```text
CampaignStateTransition
```

The following are not added in this ERD because they are not part of Section 52:

```text
MediaJobStateTransition
PublishJobStateTransition
ReviewTaskStateTransition
```

For Phase 0/1, use `AuditLog` for these transitions unless a later approved change adds dedicated transition tables.

---

## 15. Required Snapshots

### 15.1 Explicit Snapshots

```text
CustomerSubscriptionSnapshot
MediaCostSnapshot
ClientReportSnapshot
```

### 15.2 Versioned Historical Records

```text
BriefVersion
MediaAssetVersion
SubscriptionPlanVersion
PlanEntitlementVersion
```

### 15.3 Snapshot Purpose

| Snapshot | Purpose |
|---|---|
| CustomerSubscriptionSnapshot | Protect historical subscription/plan truth |
| MediaCostSnapshot | Prevent MediaJob execution without cost approval |
| ClientReportSnapshot | Freeze reports against later evidence changes |
| BriefVersion | Prevent historical brief mutation |
| MediaAssetVersion | Prevent publishing changed content after approval |
| SubscriptionPlanVersion | Protect billing from plan changes |
| PlanEntitlementVersion | Protect quota entitlement history |

---

## 16. SQL DDL Relationship Requirements

```text
workspaces.customer_account_id → customer_accounts.customer_account_id

workspace_members.workspace_id → workspaces.workspace_id
workspace_members.user_id → users.user_id
workspace_members.role_id → roles.role_id

role_permissions.role_id → roles.role_id
role_permissions.permission_id → permissions.permission_id

customer_subscriptions.customer_account_id → customer_accounts.customer_account_id
customer_subscriptions.subscription_plan_version_id → subscription_plan_versions.subscription_plan_version_id

campaigns.workspace_id → workspaces.workspace_id
campaigns.customer_account_id → customer_accounts.customer_account_id

brief_versions.campaign_id → campaigns.campaign_id

media_jobs.workspace_id → workspaces.workspace_id
media_jobs.campaign_id → campaigns.campaign_id
media_jobs.brief_version_id → brief_versions.brief_version_id
media_jobs.prompt_template_id → prompt_templates.prompt_template_id

media_cost_snapshots.media_job_id → media_jobs.media_job_id UNIQUE

media_assets.media_job_id → media_jobs.media_job_id
media_assets.campaign_id → campaigns.campaign_id

media_asset_versions.media_asset_id → media_assets.media_asset_id

review_tasks.media_asset_version_id → media_asset_versions.media_asset_version_id

approval_decisions.review_task_id → review_tasks.review_task_id
approval_decisions.media_asset_version_id → media_asset_versions.media_asset_version_id

publish_jobs.approval_decision_id → approval_decisions.approval_decision_id
publish_jobs.media_asset_version_id → media_asset_versions.media_asset_version_id

manual_publish_evidence.publish_job_id → publish_jobs.publish_job_id
manual_publish_evidence.media_asset_version_id → media_asset_versions.media_asset_version_id

tracked_links.publish_job_id → publish_jobs.publish_job_id
```

---

## 17. Critical SQL Constraints

These constraints must not be dropped during SQL conversion:

```text
1. Every sensitive operational table must include workspace_id.
2. Every commercial/usage/cost table must include customer_account_id.
3. MediaJob must not start without approved MediaCostSnapshot.
4. UsageMeter must not record unless usable_output_confirmed = true.
5. PublishJob must not be created without approved ApprovalDecision.
6. approved_content_hash must equal MediaAssetVersion.content_hash.
7. ManualPublishEvidence must be append-only.
8. Approved MediaAssetVersion must not be updated.
9. content_hash must be immutable.
10. workspace_id must not change after insert.
```

---

## 18. Critical Indexes

### 18.1 Tenant Isolation Indexes

```text
idx_campaigns_workspace(workspace_id)
idx_media_jobs_workspace(workspace_id)
idx_media_assets_workspace(workspace_id)
idx_asset_versions_workspace(workspace_id)
idx_review_tasks_workspace(workspace_id)
idx_approval_decisions_workspace(workspace_id)
idx_publish_jobs_workspace(workspace_id)
idx_manual_evidence_workspace(workspace_id)
idx_usage_meter_workspace(workspace_id)
idx_cost_events_workspace(workspace_id)
idx_audit_logs_workspace(workspace_id)
```

### 18.2 Idempotency Indexes

```text
uq_media_jobs_idempotency(workspace_id, idempotency_key)
uq_publish_jobs_idempotency(workspace_id, idempotency_key)
uq_usage_meter_idempotency(workspace_id, idempotency_key)
```

### 18.3 Integrity Indexes

```text
idx_approval_decisions_asset_version(media_asset_version_id)
idx_publish_jobs_approval(approval_decision_id)
idx_manual_evidence_publish_job(publish_job_id)
idx_client_reports_campaign(campaign_id)
idx_media_cost_snapshots_job(media_job_id)
```

---

## 19. Gaps Before SQL DDL

These gaps do not block ERD approval, but they must be explicitly handled before final SQL or implementation.

### 19.1 BillingProvider Missing from Section 52

The lock sheet says `BillingProvider` is the source of official invoices, but it is not part of Section 52.

Required decision:

```text
Add later as an approved proposed entity, or keep outside Phase 0/1 SQL.
```

### 19.2 ProviderUsageLog Missing from Section 52

The rules mention `CostEvent + ProviderUsageLog`, but Section 52 does not include `ProviderUsageLog`.

Required decision:

```text
Link to MediaJob later, or defer.
```

### 19.3 No State Transition Tables for MediaJob / PublishJob / ReviewTask

Section 52 includes only `CampaignStateTransition`.

Conservative Phase 0/1 decision:

```text
Use AuditLog for these transitions.
Do not add new transition tables without approval.
```

### 19.4 CreativePackage Has No Direct Link to MediaAssetVersion

Section 52 only defines:

```text
Campaign 1──N CreativePackage
```

Risk:

```text
CreativePackage may become a broad JSON container.
```

Conservative decision:

```text
Keep CreativePackage as package_payload in Phase 0/1.
Do not expand without approval.
```

---

## 20. Final Transition Decision

This document has converted Section 52 into:

- ERD entities
- Relationships
- Core fields
- PK/FK
- Constraints
- Indexes
- Permission tables
- Audit logs
- Settings tables
- Status history
- Snapshots
- Pre-SQL gaps

Final decision:

```text
GO to SQL DDL Phase 0/1.
NO-GO to direct coding.
NO-GO to frontend.
NO-GO to detailed QA before OpenAPI and Acceptance Criteria.
```

Next required output:

```text
Convert this approved ERD into PostgreSQL SQL DDL with tables, enums, foreign keys, indexes, unique constraints, immutable triggers, append-only rules, idempotency constraints, and tenant isolation constraints.
```
