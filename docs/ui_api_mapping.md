# Marketing OS Phase 0/1 — UI to API Mapping

> This file maps prototype screens to approved OpenAPI paths. It must not create new endpoints.

## Mapping Table

| UI Screen | Primary OpenAPI Paths | Notes |
|---|---|---|
| Workspaces | `GET /workspaces`, `POST /workspaces`, `GET/PATCH /workspaces/{workspaceId}` | Workspace context must come from route/context |
| Members & RBAC | `GET/POST /workspaces/{workspaceId}/members`, `PATCH /workspaces/{workspaceId}/members/{memberId}`, `GET /roles`, `GET /permissions` | Role changes must be audited |
| Campaigns | `GET/POST /workspaces/{workspaceId}/campaigns`, `GET/PATCH /workspaces/{workspaceId}/campaigns/{campaignId}`, `POST /workspaces/{workspaceId}/campaigns/{campaignId}/state-transitions` | State changes create transition rows |
| Brief Versions | `GET/POST /workspaces/{workspaceId}/campaigns/{campaignId}/brief-versions` | Do not patch brief content |
| Media Jobs | `GET/POST /workspaces/{workspaceId}/campaigns/{campaignId}/media-jobs`, `GET /workspaces/{workspaceId}/media-jobs/{mediaJobId}`, `PATCH /workspaces/{workspaceId}/media-jobs/{mediaJobId}/status` | Requires idempotency and cost guardrail |
| Assets & Versions | `GET/POST /workspaces/{workspaceId}/media-jobs/{mediaJobId}/assets`, `GET/POST /workspaces/{workspaceId}/assets/{mediaAssetId}/versions` | Approved versions immutable |
| Review Tasks | `GET/POST /workspaces/{workspaceId}/asset-versions/{mediaAssetVersionId}/review-tasks` | Must bind exact asset version |
| Approval Decisions | `POST /workspaces/{workspaceId}/review-tasks/{reviewTaskId}/decisions` | Approval hash must match asset version hash |
| Publish Jobs | `POST /workspaces/{workspaceId}/approval-decisions/{approvalDecisionId}/publish-jobs` | Manual-publish-only governance |
| Manual Evidence | `GET/POST /workspaces/{workspaceId}/publish-jobs/{publishJobId}/manual-evidence`, `POST /workspaces/{workspaceId}/manual-evidence/{manualPublishEvidenceId}/supersede`, `POST /workspaces/{workspaceId}/manual-evidence/{manualPublishEvidenceId}/invalidate` | No PATCH/DELETE exposed |
| Tracked Links | `GET/POST /workspaces/{workspaceId}/publish-jobs/{publishJobId}/tracked-links` | Tracking only, not advanced attribution |
| Report Snapshots | `GET/POST /workspaces/{workspaceId}/campaigns/{campaignId}/client-report-snapshots` | Snapshot payloads are frozen |
| Usage & Cost | `GET/POST /workspaces/{workspaceId}/usage-meter`, cost endpoints from OpenAPI | Usage requires usable output; CostEvent not billing |
| Audit Log | Audit read endpoint from OpenAPI | Append-only; not business state |
| Safe Mode & Onboarding | SafeMode and OnboardingProgress endpoints from OpenAPI | Permission-gated and audited |

## ErrorModel Mapping

Every UI error state should render:

```json
{
  "code": "string",
  "message": "string",
  "user_action": "string",
  "correlation_id": "string"
}
```

Important UI error codes:

```text
AUTH_REQUIRED
TENANT_CONTEXT_MISSING
TENANT_CONTEXT_MISMATCH
WORKSPACE_ACCESS_DENIED
PERMISSION_DENIED
VALIDATION_FAILED
CONFLICT
IDEMPOTENCY_KEY_REQUIRED
IDEMPOTENCY_CONFLICT
APPROVAL_HASH_REQUIRED
APPROVAL_HASH_MISMATCH
APPROVAL_NOT_APPROVED
ASSET_VERSION_MISMATCH
USAGE_OUTPUT_NOT_CONFIRMED
EVIDENCE_HASH_MISMATCH
EVIDENCE_APPEND_ONLY
IMMUTABLE_FIELD_UPDATE
SAFE_MODE_ACTIVE
```

## UI Implementation Warning

The frontend must not invent endpoints outside OpenAPI. If a screen requires data that has no approved endpoint, this is a backlog/API gap and must be reported rather than implemented by assumption.
