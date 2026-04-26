# Marketing OS V5.6.5 — Phase 0/1 QA Test Suite

> **Document type:** QA Test Suite / Test Matrix  
> **Source inputs:** ERD, PostgreSQL DDL, OpenAPI, Sprint Backlog Phase 0/1  
> **Source authority:** Section 52 only  
> **Execution status:** Required before Sprint 0 coding and mandatory before Pilot  
> **Scope:** Phase 0/1 only

---

## 1. Executive QA Decision

This QA suite defines the minimum quality gate for Marketing OS Phase 0/1.

The system must not enter Pilot or paid customer exposure if any blocking test fails.

```text
GO to Sprint 0 coding only after this QA suite is approved.
NO-GO to Pilot if any P0 test fails.
NO-GO to Frontend if OpenAPI validation fails.
NO-GO to production if tenant isolation, RBAC, approval, usage, evidence, or report snapshot integrity fails.
```

---

## 2. Test Severity Levels

| Level | Meaning | Release impact |
|---|---|---|
| P0 | Systemic / security / financial / legal / trust failure | Blocks Pilot and Production |
| P1 | Core workflow failure | Blocks Production and may block Pilot |
| P2 | Non-critical workflow defect | Can be fixed before GA if risk accepted |

---

## 3. Global Preconditions

Before running the suite:

```text
1. PostgreSQL schema migration is applied.
2. RLS baseline is enabled for workspace-scoped tables.
3. AuthGuard is active.
4. WorkspaceContextGuard is active.
5. MembershipCheck is active.
6. PermissionGuard is active.
7. OpenAPI contract is available to QA.
8. Seed data includes at least two CustomerAccounts and two Workspaces.
9. Seed users include Owner, Admin, Creator, Reviewer, Publisher, BillingAdmin, Viewer.
10. Every request returns ErrorModel on failure.
```

---

## 4. Seed Data Required

| Seed ID | Description |
|---|---|
| CA-A | CustomerAccount A |
| CA-B | CustomerAccount B |
| WS-A | Workspace A under CA-A |
| WS-B | Workspace B under CA-B |
| U-OWNER-A | Owner in WS-A |
| U-ADMIN-A | Admin in WS-A |
| U-CREATOR-A | Creator in WS-A |
| U-REVIEWER-A | Reviewer in WS-A |
| U-PUBLISHER-A | Publisher in WS-A |
| U-BILLING-A | BillingAdmin in WS-A |
| U-VIEWER-A | Viewer in WS-A |
| U-OUTSIDER | Authenticated user with no WS-A membership |
| CAMPAIGN-A | Campaign in WS-A |
| CAMPAIGN-B | Campaign in WS-B |
| BRIEF-A-V1 | BriefVersion in WS-A |
| PROMPT-A | PromptTemplate in WS-A |
| MEDIA-JOB-A | MediaJob in WS-A |
| MEDIA-ASSET-A | MediaAsset in WS-A |
| ASSET-VERSION-A | MediaAssetVersion in WS-A |
| REVIEW-TASK-A | ReviewTask in WS-A |
| APPROVAL-A | ApprovalDecision in WS-A |
| PUBLISH-JOB-A | PublishJob in WS-A |
| EVIDENCE-A | ManualPublishEvidence in WS-A |

---

## 5. Test Categories

```text
QA-TI  = Tenant Isolation
QA-RBAC = RBAC and Permissions
QA-APP = Approval Integrity
QA-USG = Usage / Cost / Quota
QA-EVD = Evidence Immutability
QA-RPT = Report Snapshot Integrity
QA-ERR = API Error Model
QA-IDM = Idempotency
QA-DB  = Database Constraint / Trigger
QA-OPS = Operational Controls
```

---

## 6. P0 No-Go Test Matrix

| Test ID | Area | Test | Severity | Blocks |
|---|---|---|---|---|
| QA-TI-001 | Tenant Isolation | WS-A user cannot read WS-B campaign | P0 | Pilot/Production |
| QA-TI-002 | Tenant Isolation | WS-A user cannot read WS-B media asset | P0 | Pilot/Production |
| QA-TI-003 | Tenant Isolation | body workspace_id mismatch is rejected/ignored | P0 | Pilot/Production |
| QA-RBAC-001 | RBAC | Viewer cannot perform write action | P0 | Pilot/Production |
| QA-RBAC-002 | RBAC | BillingAdmin cannot modify campaign content | P0 | Pilot/Production |
| QA-APP-001 | Approval | Approval requires matching content hash | P0 | Pilot/Production |
| QA-APP-002 | Publish | PublishJob cannot be created from rejected decision | P0 | Pilot/Production |
| QA-APP-003 | Publish | PublishJob blocked when approved hash differs from asset version hash | P0 | Pilot/Production |
| QA-EVD-001 | Evidence | ManualPublishEvidence cannot be PATCHed | P0 | Pilot/Production |
| QA-EVD-002 | Evidence | ManualPublishEvidence cannot be DELETEd | P0 | Pilot/Production |
| QA-USG-001 | Usage | UsageMeter rejects usable_output_confirmed=false | P0 | Pilot/Production |
| QA-USG-002 | Usage | failed provider job does not record commercial usage | P0 | Pilot/Production |
| QA-RPT-001 | Report | report snapshot does not change after evidence supersede | P0 | Pilot/Production |
| QA-ERR-001 | Error Model | all errors return code/message/user_action/correlation_id | P0 | Pilot/Production |
| QA-IDM-001 | Idempotency | duplicate Idempotency-Key does not double-create MediaJob | P0 | Pilot/Production |

---

# 7. Tenant Isolation Tests

## QA-TI-001 — Cross-workspace campaign read is denied

**Severity:** P0  
**Endpoint:** `GET /workspaces/{workspaceId}/campaigns/{campaignId}`  
**Actor:** `U-CREATOR-A`  
**Permission:** `campaign.read`  
**Setup:** `CAMPAIGN-B` exists in `WS-B`.

**Steps**

```text
1. Authenticate as U-CREATOR-A.
2. Call GET /workspaces/WS-A/campaigns/CAMPAIGN-B.
```

**Expected Result**

```text
HTTP 403 or 404 according to security policy.
Response follows ErrorModel.
No campaign data from WS-B is returned.
Audit/security log records denied cross-tenant attempt.
```

**Blocking:** Yes

---

## QA-TI-002 — Cross-workspace media asset read is denied

**Severity:** P0  
**Endpoint:** `GET /workspaces/{workspaceId}/assets/{mediaAssetId}/versions`  
**Actor:** `U-CREATOR-A`  
**Permission:** `media_asset.read`  
**Setup:** `MEDIA-ASSET-B` exists in `WS-B`.

**Steps**

```text
1. Authenticate as U-CREATOR-A.
2. Call GET /workspaces/WS-A/assets/MEDIA-ASSET-B/versions.
```

**Expected Result**

```text
HTTP 403 or 404.
No WS-B asset metadata is exposed.
ErrorModel is returned.
```

**Blocking:** Yes

---

## QA-TI-003 — Request body workspace_id mismatch is rejected or ignored

**Severity:** P0  
**Endpoint:** `POST /workspaces/{workspaceId}/campaigns`  
**Actor:** `U-CREATOR-A`  
**Permission:** `campaign.write`

**Steps**

```text
1. Authenticate as U-CREATOR-A.
2. Call POST /workspaces/WS-A/campaigns.
3. Include body.workspace_id = WS-B.
```

**Expected Result**

```text
Request is rejected with VALIDATION_FAILED or body workspace_id is ignored.
No record is created in WS-B.
If record is created, it must be in WS-A only.
ErrorModel is returned when rejected.
```

**Blocking:** Yes

---

## QA-TI-004 — RLS session context blocks direct cross-tenant DB access

**Severity:** P0  
**Layer:** Database  
**Setup:** DB session sets `app.current_workspace_id = WS-A`.

**Steps**

```text
1. Set app.current_workspace_id to WS-A.
2. Query campaigns for CAMPAIGN-B.
```

**Expected Result**

```text
0 rows returned.
RLS prevents access to WS-B row.
```

**Blocking:** Yes

---

# 8. RBAC and Permission Tests

## QA-RBAC-001 — Viewer cannot create campaign

**Severity:** P0  
**Endpoint:** `POST /workspaces/{workspaceId}/campaigns`  
**Actor:** `U-VIEWER-A`  
**Required Permission:** `campaign.write`

**Steps**

```text
1. Authenticate as U-VIEWER-A.
2. Call POST /workspaces/WS-A/campaigns with valid body.
```

**Expected Result**

```text
HTTP 403.
Error code PERMISSION_DENIED.
No campaign is created.
```

**Blocking:** Yes

---

## QA-RBAC-002 — BillingAdmin cannot modify campaign content

**Severity:** P0  
**Endpoint:** `PATCH /workspaces/{workspaceId}/campaigns/{campaignId}`  
**Actor:** `U-BILLING-A`  
**Required Permission:** `campaign.write`

**Steps**

```text
1. Authenticate as U-BILLING-A.
2. Call PATCH /workspaces/WS-A/campaigns/CAMPAIGN-A.
```

**Expected Result**

```text
HTTP 403.
Error code PERMISSION_DENIED.
Campaign remains unchanged.
```

**Blocking:** Yes

---

## QA-RBAC-003 — Creator cannot approve unless approval permission exists

**Severity:** P0  
**Endpoint:** `POST /workspaces/{workspaceId}/review-tasks/{reviewTaskId}/decisions`  
**Actor:** `U-CREATOR-A`  
**Required Permission:** `approval.decide`

**Steps**

```text
1. Authenticate as U-CREATOR-A.
2. Attempt to approve REVIEW-TASK-A.
```

**Expected Result**

```text
HTTP 403.
Error code PERMISSION_DENIED.
No ApprovalDecision is created.
```

**Blocking:** Yes

---

## QA-RBAC-004 — Publisher cannot approve content

**Severity:** P0  
**Endpoint:** `POST /workspaces/{workspaceId}/review-tasks/{reviewTaskId}/decisions`  
**Actor:** `U-PUBLISHER-A`

**Expected Result**

```text
HTTP 403.
No ApprovalDecision is created.
```

**Blocking:** Yes

---

# 9. Approval Integrity Tests

## QA-APP-001 — Approved decision requires matching content hash

**Severity:** P0  
**Endpoint:** `POST /workspaces/{workspaceId}/review-tasks/{reviewTaskId}/decisions`  
**Actor:** `U-REVIEWER-A`  
**Permission:** `approval.decide`

**Steps**

```text
1. Get ASSET-VERSION-A content_hash.
2. Submit approval decision with a different approved_content_hash.
```

**Expected Result**

```text
HTTP 409 or 422.
Error code APPROVAL_HASH_MISMATCH.
No ApprovalDecision is created.
```

**Blocking:** Yes

---

## QA-APP-002 — Approval cannot target version different from ReviewTask version

**Severity:** P0  
**Endpoint:** `POST /workspaces/{workspaceId}/review-tasks/{reviewTaskId}/decisions`

**Steps**

```text
1. Use REVIEW-TASK-A linked to ASSET-VERSION-A.
2. Submit media_asset_version_id for ASSET-VERSION-B.
```

**Expected Result**

```text
HTTP 409 or 422.
Error code REVIEW_TASK_VERSION_MISMATCH.
No ApprovalDecision is created.
```

**Blocking:** Yes

---

## QA-APP-003 — PublishJob cannot be created from rejected decision

**Severity:** P0  
**Endpoint:** `POST /workspaces/{workspaceId}/approval-decisions/{approvalDecisionId}/publish-jobs`  
**Actor:** `U-PUBLISHER-A`

**Steps**

```text
1. Create ApprovalDecision with decision=rejected.
2. Attempt to create PublishJob from rejected decision.
```

**Expected Result**

```text
HTTP 409 or 422.
Error code APPROVAL_NOT_APPROVED.
No PublishJob is created.
```

**Blocking:** Yes

---

## QA-APP-004 — PublishJob blocked when content hash changed after approval

**Severity:** P0  
**Endpoint:** `POST /workspaces/{workspaceId}/approval-decisions/{approvalDecisionId}/publish-jobs`

**Steps**

```text
1. Approve ASSET-VERSION-A with its content_hash.
2. Create a newer MediaAssetVersion with different content.
3. Attempt to publish the newer version using old ApprovalDecision.
```

**Expected Result**

```text
HTTP 409.
Error code APPROVAL_HASH_MISMATCH or ASSET_VERSION_MISMATCH.
No PublishJob is created.
```

**Blocking:** Yes

---

# 10. Usage / Cost / Quota Tests

## QA-USG-001 — UsageMeter rejects usable_output_confirmed=false

**Severity:** P0  
**Endpoint:** `POST /workspaces/{workspaceId}/usage-meter`  
**Actor:** service or authorized usage recorder  
**Permission:** `usage.record`

**Steps**

```text
1. Submit usage record with usable_output_confirmed=false.
```

**Expected Result**

```text
HTTP 422.
Error code USAGE_OUTPUT_NOT_CONFIRMED.
No UsageMeter row is created.
```

**Blocking:** Yes

---

## QA-USG-002 — Failed provider job does not create commercial usage

**Severity:** P0  
**Endpoint:** `PATCH /workspaces/{workspaceId}/media-jobs/{mediaJobId}/status` + `GET /usage-meter`

**Steps**

```text
1. Create MediaJob.
2. Mark MediaJob failed with provider_timeout.
3. Query UsageMeter for the MediaJob source_entity_id.
```

**Expected Result**

```text
MediaJob is failed.
CostEvent may exist if cost occurred.
UsageMeter must not exist for failed job without usable output.
```

**Blocking:** Yes

---

## QA-USG-003 — CostEvent does not create customer billing

**Severity:** P1  
**Endpoint:** `POST /workspaces/{workspaceId}/cost-events`

**Steps**

```text
1. Record CostEvent for failed provider call.
2. Query subscription or billing-facing state.
```

**Expected Result**

```text
CostEvent exists.
No invoice or customer billing state is created from CostEvent.
```

**Blocking:** Yes for billing exposure

---

## QA-USG-004 — Quota state is scoped by workspace/customer account

**Severity:** P0  
**Endpoint:** `GET /workspaces/{workspaceId}/quota-state`

**Steps**

```text
1. Authenticate as WS-A user.
2. Query WS-A quota state.
3. Attempt to infer or access WS-B quota state.
```

**Expected Result**

```text
Only WS-A quota data is returned.
```

**Blocking:** Yes

---

# 11. Evidence Immutability Tests

## QA-EVD-001 — ManualPublishEvidence PATCH is not available

**Severity:** P0  
**Endpoint:** `PATCH /workspaces/{workspaceId}/manual-evidence/{manualPublishEvidenceId}`

**Steps**

```text
1. Attempt PATCH on existing EVIDENCE-A.
```

**Expected Result**

```text
HTTP 404 or 405.
No evidence row is modified.
```

**Blocking:** Yes

---

## QA-EVD-002 — ManualPublishEvidence DELETE is not available

**Severity:** P0  
**Endpoint:** `DELETE /workspaces/{workspaceId}/manual-evidence/{manualPublishEvidenceId}`

**Steps**

```text
1. Attempt DELETE on existing EVIDENCE-A.
```

**Expected Result**

```text
HTTP 404 or 405.
Evidence row remains in database.
```

**Blocking:** Yes

---

## QA-EVD-003 — Direct DB update to ManualPublishEvidence is blocked

**Severity:** P0  
**Layer:** Database

**Steps**

```text
1. Attempt UPDATE manual_publish_evidence SET published_url = 'changed'.
```

**Expected Result**

```text
Database trigger rejects update.
```

**Blocking:** Yes

---

## QA-EVD-004 — Supersede creates new evidence row

**Severity:** P1  
**Endpoint:** `POST /workspaces/{workspaceId}/manual-evidence/{manualPublishEvidenceId}/supersede`

**Expected Result**

```text
New evidence row is created.
Old evidence row is not deleted.
New row has supersedes_evidence_id referencing old row.
Audit event manual_publish_evidence.superseded is recorded.
```

**Blocking:** Yes for reporting workflow

---

## QA-EVD-005 — Evidence content hash must match asset version hash

**Severity:** P0  
**Endpoint:** `POST /workspaces/{workspaceId}/publish-jobs/{publishJobId}/manual-evidence`

**Steps**

```text
1. Submit evidence with content_hash different from PublishJob MediaAssetVersion hash.
```

**Expected Result**

```text
HTTP 409 or 422.
Error code EVIDENCE_HASH_MISMATCH.
No evidence row is created.
```

**Blocking:** Yes

---

# 12. Report Snapshot Tests

## QA-RPT-001 — ClientReportSnapshot does not change after evidence supersede

**Severity:** P0  
**Endpoint:** `POST /workspaces/{workspaceId}/campaigns/{campaignId}/client-report-snapshots`

**Steps**

```text
1. Submit valid ManualPublishEvidence.
2. Generate ClientReportSnapshot.
3. Supersede the evidence.
4. Fetch the original ClientReportSnapshot.
```

**Expected Result**

```text
Original report_snapshot_payload remains unchanged.
Original evidence_snapshot_payload remains unchanged.
Original content_hash remains unchanged.
```

**Blocking:** Yes

---

## QA-RPT-002 — ClientReportSnapshot direct update is blocked

**Severity:** P0  
**Layer:** Database

**Steps**

```text
1. Attempt UPDATE client_report_snapshots SET report_snapshot_payload = '{}'.
```

**Expected Result**

```text
Database trigger blocks update to immutable fields.
```

**Blocking:** Yes

---

## QA-RPT-003 — Invalid report period is rejected

**Severity:** P1  
**Endpoint:** `POST /workspaces/{workspaceId}/campaigns/{campaignId}/client-report-snapshots`

**Steps**

```text
1. Submit report_period_end earlier than report_period_start.
```

**Expected Result**

```text
HTTP 422.
ErrorModel is returned.
No report snapshot is created.
```

**Blocking:** Yes for reporting

---

# 13. API Error Model Tests

## QA-ERR-001 — Error response shape is consistent

**Severity:** P0  
**Endpoints:** All endpoints

**Steps**

```text
1. Trigger validation error.
2. Trigger permission error.
3. Trigger not found or tenant denial.
4. Trigger idempotency conflict.
```

**Expected Result**

Every error response contains:

```json
{
  "code": "string",
  "message": "string",
  "user_action": "string",
  "correlation_id": "string"
}
```

**Blocking:** Yes

---

## QA-ERR-002 — Correlation ID is returned and logged

**Severity:** P1

**Expected Result**

```text
correlation_id exists in response.
correlation_id exists in application logs or AuditLog/security log where applicable.
```

**Blocking:** Yes for production observability

---

# 14. Idempotency Tests

## QA-IDM-001 — Duplicate MediaJob Idempotency-Key does not double-create

**Severity:** P0  
**Endpoint:** `POST /workspaces/{workspaceId}/campaigns/{campaignId}/media-jobs`

**Steps**

```text
1. Submit valid MediaJob create request with Idempotency-Key K1.
2. Repeat identical request with Idempotency-Key K1.
```

**Expected Result**

```text
Only one MediaJob exists for K1 in WS-A.
Second response returns same result or an explicit safe replay response.
```

**Blocking:** Yes

---

## QA-IDM-002 — Same Idempotency-Key with different payload returns conflict

**Severity:** P0

**Steps**

```text
1. Submit MediaJob request with Idempotency-Key K2 and payload A.
2. Submit MediaJob request with Idempotency-Key K2 and payload B.
```

**Expected Result**

```text
HTTP 409.
Error code IDEMPOTENCY_CONFLICT.
No second MediaJob is created.
```

**Blocking:** Yes

---

## QA-IDM-003 — PublishJob idempotency prevents duplicate publish job

**Severity:** P0  
**Endpoint:** `POST /workspaces/{workspaceId}/approval-decisions/{approvalDecisionId}/publish-jobs`

**Expected Result**

```text
Only one PublishJob exists for the same workspace and Idempotency-Key.
```

**Blocking:** Yes

---

## QA-IDM-004 — UsageMeter idempotency prevents double billing usage

**Severity:** P0  
**Endpoint:** `POST /workspaces/{workspaceId}/usage-meter`

**Expected Result**

```text
Only one UsageMeter record exists for the same workspace and Idempotency-Key.
Usage quantity is not doubled.
```

**Blocking:** Yes

---

# 15. Database Constraint / Trigger Tests

## QA-DB-001 — Approved MediaAssetVersion is immutable

**Severity:** P0

**Steps**

```text
1. Create MediaAssetVersion.
2. Mark version_status=approved.
3. Attempt to update content_payload/content_hash/storage_ref.
```

**Expected Result**

```text
Update is rejected.
New version must be created for any content change.
```

**Blocking:** Yes

---

## QA-DB-002 — MediaJob cannot run without approved MediaCostSnapshot

**Severity:** P0

**Steps**

```text
1. Create MediaJob.
2. Do not create approved MediaCostSnapshot.
3. Attempt to update job_status=running.
```

**Expected Result**

```text
Database trigger rejects status change.
```

**Blocking:** Yes

---

## QA-DB-003 — UsageMeter rejects invalid quantity

**Severity:** P0

**Steps**

```text
1. Attempt to insert usage_meter with quantity <= 0.
```

**Expected Result**

```text
Database constraint rejects insert.
```

**Blocking:** Yes

---

## QA-DB-004 — Workspace ownership fields are immutable

**Severity:** P0

**Steps**

```text
1. Attempt to update workspace_id or customer_account_id on workspace-scoped records.
```

**Expected Result**

```text
Update is rejected.
```

**Blocking:** Yes

---

# 16. Operational Controls Tests

## QA-OPS-001 — Safe mode can be activated by authorized admin

**Severity:** P1  
**Endpoint:** `POST /workspaces/{workspaceId}/safe-mode`

**Expected Result**

```text
safe_mode_status becomes active.
Audit event safe_mode.activated is recorded.
```

---

## QA-OPS-002 — Safe mode cannot be changed by Viewer

**Severity:** P0

**Expected Result**

```text
HTTP 403.
Error code PERMISSION_DENIED.
Safe mode state is unchanged.
```

**Blocking:** Yes

---

## QA-OPS-003 — Onboarding progress is unique per workspace

**Severity:** P1

**Expected Result**

```text
Only one OnboardingProgress record exists per workspace.
Duplicate creation is rejected by DB or service layer.
```

---

# 17. Audit Coverage Tests

## QA-AUD-001 — Sensitive writes create AuditLog

**Severity:** P0

**Sensitive writes**

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

**Expected Result**

```text
Each sensitive write creates an AuditLog record with workspace_id, actor_user_id, action, entity_type, entity_id, and correlation_id.
```

**Blocking:** Yes

---

## QA-AUD-002 — AuditLog cannot be modified or deleted

**Severity:** P0

**Expected Result**

```text
Database trigger rejects UPDATE and DELETE.
```

**Blocking:** Yes

---

# 18. OpenAPI Contract Validation Tests

## QA-OAS-001 — OpenAPI file is valid

**Severity:** P0

**File**

```text
docs/marketing_os_v5_6_5_phase_0_1_openapi.yaml
```

**Expected Result**

```text
OpenAPI passes validation using Redocly or Swagger CLI.
```

**Blocking:** Yes for frontend

---

## QA-OAS-002 — All write endpoints declare permission metadata

**Severity:** P0

**Expected Result**

```text
Every POST/PATCH endpoint has x-permission.
```

**Blocking:** Yes

---

## QA-OAS-003 — Idempotent endpoints require Idempotency-Key

**Severity:** P0

**Expected Result**

The following endpoints declare `Idempotency-Key`:

```text
POST /workspaces/{workspaceId}/campaigns/{campaignId}/media-jobs
POST /workspaces/{workspaceId}/approval-decisions/{approvalDecisionId}/publish-jobs
POST /workspaces/{workspaceId}/usage-meter
```

**Blocking:** Yes

---

# 19. Pilot Gate Checklist

Pilot must be blocked if any item is false.

```text
[ ] QA-TI-001 passed
[ ] QA-TI-002 passed
[ ] QA-TI-003 passed
[ ] QA-TI-004 passed
[ ] QA-RBAC-001 passed
[ ] QA-RBAC-002 passed
[ ] QA-RBAC-003 passed
[ ] QA-APP-001 passed
[ ] QA-APP-002 passed
[ ] QA-APP-003 passed
[ ] QA-APP-004 passed
[ ] QA-USG-001 passed
[ ] QA-USG-002 passed
[ ] QA-EVD-001 passed
[ ] QA-EVD-002 passed
[ ] QA-EVD-003 passed
[ ] QA-EVD-005 passed
[ ] QA-RPT-001 passed
[ ] QA-RPT-002 passed
[ ] QA-ERR-001 passed
[ ] QA-IDM-001 passed
[ ] QA-IDM-002 passed
[ ] QA-IDM-003 passed
[ ] QA-IDM-004 passed
[ ] QA-AUD-001 passed
[ ] QA-AUD-002 passed
[ ] QA-OAS-001 passed
[ ] QA-OAS-002 passed
[ ] QA-OAS-003 passed
```

---

# 20. Recommended Automation Mapping

| Test Area | Recommended tool |
|---|---|
| API contract validation | Redocly CLI / Swagger CLI |
| API integration tests | Jest + Supertest or Postman/Newman |
| DB trigger/constraint tests | pgTAP or Jest integration tests |
| RLS tenant isolation | PostgreSQL integration tests |
| RBAC | API integration tests |
| Idempotency | API integration tests with repeated requests |
| Report immutability | DB + API integration tests |
| Frontend smoke later | Playwright after OpenAPI validation |

---

# 21. Final QA Decision

This QA suite is sufficient to move from contract design to controlled Sprint 0 coding **only after approval**.

It is not sufficient for production launch until all P0 and required P1 tests are automated or manually evidenced.

```text
GO to Sprint 0 coding after QA suite approval.
NO-GO to Pilot until all P0 tests pass.
NO-GO to Frontend until OpenAPI validation passes.
NO-GO to paid customer exposure until Pilot Gate Checklist is complete.
```

Next required output:

```text
Create Codex implementation prompt and repository execution instructions using ERD, SQL, OpenAPI, Backlog, and QA Test Suite as the only approved sources.
```
