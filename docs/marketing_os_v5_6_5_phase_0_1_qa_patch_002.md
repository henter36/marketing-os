# Marketing OS V5.6.5 — Phase 0/1 QA Patch 002

> **Document type:** QA addendum / Patch 002 test cases  
> **Applies to:** `docs/marketing_os_v5_6_5_phase_0_1_qa_test_suite.md`  
> **Patch authority:** `docs/marketing_os_v5_6_5_phase_0_1_competitive_patch_002.md`  
> **SQL:** `docs/marketing_os_v5_6_5_phase_0_1_schema_patch_002.sql`  
> **OpenAPI:** `docs/marketing_os_v5_6_5_phase_0_1_openapi_patch_002.yaml`  
> **Scope:** Patch 002 only  
> **Extended V1:** Not opened

---

## 1. Executive QA Decision

This file adds only the QA cases required by Patch 002.

It does not replace the original QA suite. It must be executed **in addition to**:

```text
docs/marketing_os_v5_6_5_phase_0_1_qa_test_suite.md
```

Patch 002 QA is required before any Sprint implementation touches:

```text
connectors
webhook_event_logs
performance_events
campaign_metric_snapshots
metric_confidence_scores
contacts
contact_identifiers
contact_consents
lead_captures
campaign_contact_attributions
notification_rules
notification_deliveries
```

---

## 2. Additional Test Categories

```text
QA-CON   = Connector Security / Webhook Logging
QA-PERF  = Performance Events / Metric Confidence
QA-CRM   = CRM-lite Contacts / Consent / Lead Capture
QA-NOTIF = Notification Rule / Delivery Tracking
QA-SCOPE = Extended V1 scope prevention
```

---

## 3. Patch 002 P0/P1 Matrix

| Test ID | Area | Test | Severity | Blocks |
|---|---|---|---|---|
| QA-CON-001 | Connector Security | Raw connector secret is never stored | P0 | Pilot/Production |
| QA-CON-002 | Webhooks | Invalid webhook signature cannot mutate business state | P0 | Pilot/Production |
| QA-CON-003 | Tenant Isolation | Connector rows are workspace-scoped | P0 | Pilot/Production |
| QA-CON-004 | Database | WebhookEventLog is append-only | P0 | Pilot/Production |
| QA-PERF-001 | Performance | PerformanceEvent is workspace-scoped | P0 | Pilot/Production |
| QA-PERF-002 | Performance | Metric snapshots and confidence scores are immutable | P0 | Pilot/Production |
| QA-PERF-003 | Performance | Negative metric values are rejected | P0 | Pilot/Production |
| QA-PERF-004 | Scope | Advanced attribution entities/endpoints are absent | P0 | Pilot/Production |
| QA-CRM-001 | Consent | ContactConsent is append-only | P0 | Pilot/Production |
| QA-CRM-002 | Scope | Full CRM entities/endpoints are absent | P0 | Pilot/Production |
| QA-CRM-003 | Privacy | ContactIdentifier stores hash, not raw value | P0 | Pilot/Production |
| QA-CRM-004 | Tenant Isolation | Contact and lead capture rows are workspace-scoped | P0 | Pilot/Production |
| QA-NOTIF-001 | Notifications | Notification failure does not rollback source transaction | P1 | Production |
| QA-NOTIF-002 | Scope | Mattermost/Slack delivery is not implemented in Core V1 | P0 | Pilot/Production |
| QA-SCOPE-001 | Scope | Extended V1 integrations are not exposed by API | P0 | Pilot/Production |

---

# 4. Connector Security / Webhook Logging Tests

## QA-CON-001 — Raw connector secret is never stored

**Severity:** P0  
**Layer:** API + Database  
**Endpoint:** `POST /workspaces/{workspaceId}/connectors/{connectorId}/accounts/{connectorAccountId}/credentials`  
**Actor:** Workspace Admin  
**Permission:** `connector.rotate_secret`

### Steps

```text
1. Create Connector metadata.
2. Create ConnectorAccount metadata.
3. Submit credential reference with secret_ref='vault://marketing-os/ws-a/connector/example'.
4. Query connector_credentials.
5. Search connector tables for raw API key/token-like test value.
```

### Expected Result

```text
connector_credentials.secret_ref stores only the secret-manager reference.
No raw access token, API key, refresh token, signing secret, or OAuth secret is stored in connector tables.
Audit event connector.credential_reference_created is recorded.
```

**Blocking:** Yes

---

## QA-CON-002 — Invalid webhook signature cannot mutate business state

**Severity:** P0  
**Layer:** API + Database  
**Endpoint:** `POST /workspaces/{workspaceId}/webhooks/{endpointKey}`  
**Permission:** `webhook.receive`

### Steps

```text
1. Create active WebhookEndpoint.
2. Send webhook payload with invalid signature.
3. Verify WebhookEventLog is recorded with signature_valid=false.
4. Check Campaign, PublishJob, ManualPublishEvidence, UsageMeter, Contact, and PerformanceEvent tables.
```

### Expected Result

```text
WebhookEventLog exists.
signature_valid=false.
No business state is mutated.
No Campaign, PublishJob, ManualPublishEvidence, UsageMeter, Contact, LeadCapture, or PerformanceEvent is created or updated by the invalid webhook.
```

**Blocking:** Yes

---

## QA-CON-003 — Connector rows are workspace-scoped

**Severity:** P0  
**Layer:** API + Database  
**Endpoints:** Connector endpoints  
**Actor:** WS-A user

### Steps

```text
1. Create Connector in WS-B.
2. Authenticate as WS-A user.
3. Attempt to read WS-B Connector by ID through WS-A route/context.
4. Attempt direct DB query with app.current_workspace_id=WS-A.
```

### Expected Result

```text
API returns 403 or 404.
No WS-B connector data is returned.
RLS returns 0 rows when workspace context is WS-A.
```

**Blocking:** Yes

---

## QA-CON-004 — WebhookEventLog is append-only

**Severity:** P0  
**Layer:** Database

### Steps

```text
1. Insert valid WebhookEventLog row.
2. Attempt UPDATE webhook_event_logs SET received_payload='{}'.
3. Attempt DELETE FROM webhook_event_logs.
```

### Expected Result

```text
UPDATE is rejected.
DELETE is rejected.
Original payload_hash and received_payload remain unchanged.
```

**Blocking:** Yes

---

# 5. Performance Events / Metric Confidence Tests

## QA-PERF-001 — PerformanceEvent is workspace-scoped

**Severity:** P0  
**Layer:** API + Database  
**Endpoint:** `POST /workspaces/{workspaceId}/campaigns/{campaignId}/performance-events`

### Steps

```text
1. Create CAMPAIGN-B in WS-B.
2. Authenticate as WS-A user.
3. Attempt to create PerformanceEvent for CAMPAIGN-B through WS-A route.
4. Attempt to read WS-B PerformanceEvent from WS-A context.
```

### Expected Result

```text
Create is rejected with TENANT_CONTEXT_MISMATCH or NOT_FOUND.
Read returns no WS-B data.
No cross-workspace performance event is created.
```

**Blocking:** Yes

---

## QA-PERF-002 — Metric snapshots and confidence scores are immutable

**Severity:** P0  
**Layer:** API + Database  
**Endpoint:** `POST /workspaces/{workspaceId}/campaigns/{campaignId}/metric-snapshots`

### Steps

```text
1. Create CampaignMetricSnapshot with MetricConfidenceScore.
2. Attempt UPDATE campaign_metric_snapshots SET snapshot_payload='{}'.
3. Attempt DELETE FROM campaign_metric_snapshots.
4. Attempt UPDATE metric_confidence_scores SET confidence_score=0.1.
5. Attempt DELETE FROM metric_confidence_scores.
```

### Expected Result

```text
All UPDATE/DELETE attempts are rejected.
Corrections require creating a new snapshot.
Historical snapshot and confidence score remain unchanged.
```

**Blocking:** Yes

---

## QA-PERF-003 — Negative metric values are rejected

**Severity:** P0  
**Layer:** API + Database  
**Endpoint:** `POST /workspaces/{workspaceId}/campaigns/{campaignId}/performance-events`

### Steps

```text
1. Submit PerformanceEvent with metric_value=-1.
```

### Expected Result

```text
HTTP 422 or DB constraint failure mapped to ErrorModel.
No PerformanceEvent row is created.
```

**Blocking:** Yes

---

## QA-PERF-004 — Advanced attribution entities/endpoints are absent

**Severity:** P0  
**Layer:** Repository + API contract

### Steps

```text
1. Search SQL schema and OpenAPI for advanced attribution entities/endpoints.
2. Verify no advanced attribution model/table/path exists in Phase 0/1.
```

### Expected Result

```text
No advanced attribution table is present.
No /attribution/advanced/* endpoint is present.
Only basic PerformanceEvent, CampaignMetricSnapshot, MetricConfidenceScore are present.
```

**Blocking:** Yes

---

# 6. CRM-lite Contacts / Consent / Lead Capture Tests

## QA-CRM-001 — ContactConsent is append-only

**Severity:** P0  
**Layer:** API + Database  
**Endpoint:** `POST /workspaces/{workspaceId}/contacts/{contactId}/consents`

### Steps

```text
1. Create Contact.
2. Append ContactConsent with consent_status=granted.
3. Attempt UPDATE contact_consents SET consent_status='revoked'.
4. Attempt DELETE FROM contact_consents.
5. Append a new ContactConsent with consent_status=revoked.
```

### Expected Result

```text
UPDATE is rejected.
DELETE is rejected.
Consent change is represented by a new ContactConsent row.
Original consent row remains unchanged.
```

**Blocking:** Yes

---

## QA-CRM-002 — Full CRM entities/endpoints are absent

**Severity:** P0  
**Layer:** Repository + API contract

### Steps

```text
1. Search SQL/OpenAPI/source for deals, pipelines, forecasts, quotes, CRM activities, support tickets.
2. Verify none are introduced by Patch 002.
```

### Expected Result

```text
No deals table.
No pipeline table.
No sales forecast table.
No quote table.
No CRM activity table.
No support ticket table.
No full CRM endpoints.
```

**Blocking:** Yes

---

## QA-CRM-003 — ContactIdentifier stores hash, not raw value

**Severity:** P0  
**Layer:** API + Database

### Steps

```text
1. Create Contact with email/phone represented as hashed identifier_value_hash.
2. Query contact_identifiers.
3. Search for raw email/phone test value in contact identifier table.
```

### Expected Result

```text
identifier_value_hash is stored as 64-character hash.
Raw email/phone is not stored in contact_identifiers.
```

**Blocking:** Yes

---

## QA-CRM-004 — Contact and lead capture rows are workspace-scoped

**Severity:** P0  
**Layer:** API + Database

### Steps

```text
1. Create Contact and LeadCapture in WS-B.
2. Authenticate as WS-A user.
3. Attempt to read or create attribution against WS-B Contact/Campaign from WS-A route.
```

### Expected Result

```text
Cross-workspace access is denied.
No cross-workspace LeadCapture or CampaignContactAttribution is created.
RLS returns 0 rows for WS-B data from WS-A context.
```

**Blocking:** Yes

---

# 7. Notification Rule / Delivery Tracking Tests

## QA-NOTIF-001 — Notification failure does not rollback source transaction

**Severity:** P1  
**Layer:** API + Service behavior

### Steps

```text
1. Trigger a business event that should create NotificationDelivery.
2. Force notification delivery failure.
3. Verify the source business transaction remains committed.
4. Verify NotificationDelivery records delivery_status=failed and failure_code.
```

### Expected Result

```text
Source event remains committed.
Notification failure is isolated.
NotificationDelivery records failed state.
No rollback of Campaign, ApprovalDecision, PublishJob, ManualPublishEvidence, or MetricSnapshot occurs due to notification failure.
```

**Blocking:** Yes for production; may not block early local dry-run if notification worker is not implemented yet.

---

## QA-NOTIF-002 — Mattermost/Slack delivery is not implemented in Core V1

**Severity:** P0  
**Layer:** Repository + API contract

### Steps

```text
1. Search OpenAPI for /mattermost, /slack, external chat integration paths.
2. Search source for Mattermost/Slack connector implementation.
```

### Expected Result

```text
No Mattermost integration endpoint.
No Slack integration endpoint.
No external chat delivery implementation in Core V1.
Only notification_rules and notification_deliveries are present.
```

**Blocking:** Yes

---

# 8. Extended V1 Scope Prevention Tests

## QA-SCOPE-001 — Extended V1 integrations are not exposed by API

**Severity:** P0  
**Layer:** OpenAPI + Repository

### Steps

```text
1. Validate OpenAPI Patch 002.
2. Search for forbidden paths:
   - /strapi/*
   - /medusa/*
   - /mattermost/*
   - /slack/*
   - /crm-sync/*
   - /commerce/*
   - /plugins/*
   - /inbox/*
   - /workflows/builder/*
   - /attribution/advanced/*
```

### Expected Result

```text
No forbidden path exists.
No implementation module exists for Extended V1 integrations.
Patch 002 remains limited to connector metadata/logging, performance, CRM-lite, and notification tracking.
```

**Blocking:** Yes

---

# 9. Pilot Gate Additions

Patch 002 adds these required gate checks before any Pilot that includes connector/performance/contact/notification capabilities:

```text
[ ] QA-CON-001 passed
[ ] QA-CON-002 passed
[ ] QA-CON-003 passed
[ ] QA-CON-004 passed
[ ] QA-PERF-001 passed
[ ] QA-PERF-002 passed
[ ] QA-PERF-003 passed
[ ] QA-PERF-004 passed
[ ] QA-CRM-001 passed
[ ] QA-CRM-002 passed
[ ] QA-CRM-003 passed
[ ] QA-CRM-004 passed
[ ] QA-NOTIF-001 passed or explicitly deferred with risk acceptance if delivery worker is not implemented
[ ] QA-NOTIF-002 passed
[ ] QA-SCOPE-001 passed
```

---

# 10. Final QA Patch Decision

```text
GO: Add Patch 002 QA to the execution gate.
GO: Validate connector secrets, webhook signature behavior, performance immutability, contact consent immutability, and scope prevention.
NO-GO: Treat Patch 002 as permission to implement external integrations.
NO-GO: Pilot if any Patch 002 P0 test fails.
```
