# Marketing OS API Surface Additions

## Purpose

هذه الوثيقة تحدد واجهات API المقترحة للخصائص التي تدخل Core V1.

---

## Campaign APIs

```http
POST /api/campaigns
GET /api/campaigns
GET /api/campaigns/{campaignId}
PATCH /api/campaigns/{campaignId}
POST /api/campaigns/{campaignId}/brief
POST /api/campaigns/{campaignId}/channels
GET /api/campaigns/{campaignId}/activity
POST /api/campaigns/{campaignId}/archive
```

---

## Brand Governance APIs

```http
POST /api/brand-rule-sets
GET /api/brand-rule-sets
GET /api/brand-rule-sets/{ruleSetId}
PATCH /api/brand-rule-sets/{ruleSetId}
POST /api/brand-rule-sets/{ruleSetId}/rules
POST /api/content/validate
```

---

## Template APIs

```http
POST /api/content-templates
GET /api/content-templates
GET /api/content-templates/{templateId}
POST /api/content-templates/{templateId}/versions
POST /api/content-templates/{templateId}/use
POST /api/content-templates/{templateId}/disable
```

---

## Generation APIs

```http
POST /api/generation-jobs
GET /api/generation-jobs
GET /api/generation-jobs/{jobId}
POST /api/generation-jobs/{jobId}/cancel
POST /api/generation-jobs/{jobId}/review
GET /api/generation-jobs/{jobId}/cost
```

---

## Asset APIs

```http
POST /api/assets
GET /api/assets
GET /api/assets/{assetId}
POST /api/assets/{assetId}/versions
GET /api/assets/{assetId}/versions
POST /api/assets/{assetId}/versions/{versionId}/submit-review
POST /api/assets/{assetId}/archive
```

---

## Approval APIs

```http
POST /api/approval-requests
GET /api/approval-requests
GET /api/approval-requests/{approvalRequestId}
POST /api/approval-requests/{approvalRequestId}/approve
POST /api/approval-requests/{approvalRequestId}/reject
POST /api/approval-requests/{approvalRequestId}/request-changes
POST /api/approval-requests/{approvalRequestId}/comments
```

---

## Publishing APIs

```http
POST /api/publish-jobs
GET /api/publish-jobs
GET /api/publish-jobs/{publishJobId}
POST /api/publish-jobs/{publishJobId}/manual-evidence
POST /api/publish-jobs/{publishJobId}/invalidate-evidence
GET /api/campaigns/{campaignId}/publishing-status
```

---

## Connector APIs

```http
POST /api/connectors
GET /api/connectors
GET /api/connectors/{connectorId}
PATCH /api/connectors/{connectorId}
POST /api/connectors/{connectorId}/accounts
POST /api/connectors/{connectorId}/rotate-secret
POST /api/webhooks/{connectorKey}
GET /api/connectors/{connectorId}/sync-runs
GET /api/connectors/{connectorId}/errors
```

---

## Performance APIs

```http
POST /api/performance-events
GET /api/campaigns/{campaignId}/performance
POST /api/campaigns/{campaignId}/metric-snapshot
GET /api/campaigns/{campaignId}/metric-snapshots
GET /api/assets/{assetId}/performance
```

---

## CRM-lite APIs

```http
POST /api/contacts
GET /api/contacts
GET /api/contacts/{contactId}
PATCH /api/contacts/{contactId}
POST /api/contacts/{contactId}/consents
POST /api/lead-captures
GET /api/campaigns/{campaignId}/leads
```

---

## Notification APIs

```http
POST /api/notification-rules
GET /api/notification-rules
PATCH /api/notification-rules/{ruleId}
GET /api/notifications
POST /api/notifications/{notificationId}/mark-read
```

---

## API Governance Requirements

Every API must support:
- Workspace context.
- RBAC permission check.
- Audit event where applicable.
- Standard ErrorModel.
- Idempotency key for mutation APIs where duplication is dangerous.
- Pagination for list endpoints.
- Rate limiting for webhook and generation APIs.
- Validation errors with structured codes.

---

## Standard ErrorModel

```json
{
  "error": {
    "code": "STRING_CODE",
    "message": "Human readable message",
    "details": {},
    "request_id": "uuid",
    "timestamp": "ISO-8601"
  }
}
```

---

## High-Risk Mutation APIs Requiring Idempotency

```text
POST /api/generation-jobs
POST /api/approval-requests
POST /api/approval-requests/{id}/approve
POST /api/publish-jobs
POST /api/publish-jobs/{id}/manual-evidence
POST /api/performance-events
POST /api/webhooks/{connectorKey}
```
