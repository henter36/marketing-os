# Marketing OS Phase 0/1 — UI User Flows

> These flows are UI interpretation of the approved Phase 0/1 contracts. They do not expand scope.

## Flow 1 — Workspace and Access

```text
Authenticated User
→ Select Workspace Context
→ MembershipCheck
→ PermissionGuard
→ Allowed Screen
```

No screen may rely on workspace_id sent inside request body.

Failure states:

- `AUTH_REQUIRED`
- `TENANT_CONTEXT_MISSING`
- `WORKSPACE_ACCESS_DENIED`
- `PERMISSION_DENIED`

## Flow 2 — Campaign to Brief

```text
Create Campaign
→ CampaignStateTransition recorded when status changes
→ Create BriefVersion
→ Server generates content_hash
→ BriefVersion becomes historical source for media generation
```

Rules:

- Do not patch historical brief content.
- Brief edits create new versions.

## Flow 3 — Media Job and Asset

```text
Create MediaJob with Idempotency-Key
→ Evaluate CostGuardrail
→ Create MediaCostSnapshot
→ If approved, job may run
→ If usable output exists, create MediaAsset
→ Create MediaAssetVersion with content_hash
```

Rules:

- Failed provider output does not create commercial usage.
- No UsageMeter entry unless `usable_output_confirmed=true`.
- Same idempotency key with different payload must return `IDEMPOTENCY_CONFLICT`.

## Flow 4 — Review and Approval

```text
Create ReviewTask for exact MediaAssetVersion
→ Reviewer creates ApprovalDecision
→ If decision=approved, approved_content_hash is required
→ approved_content_hash must match MediaAssetVersion.content_hash
→ DB marks MediaAssetVersion as approved
```

Rules:

- ApprovalDecision is append-only.
- ReviewTask and ApprovalDecision must reference the same MediaAssetVersion.
- Approved MediaAssetVersion cannot be patched.

## Flow 5 — Publish Job and Manual Evidence

```text
Approved ApprovalDecision
→ Create PublishJob with Idempotency-Key
→ User manually publishes outside platform
→ Submit ManualPublishEvidence
→ Evidence proof fields become protected
```

Rules:

- No auto-publishing in Phase 0/1.
- Manual evidence cannot be patched or deleted.
- Supersede creates a new evidence row.
- Invalidate only updates `evidence_status=invalidated` and `invalidated_reason`.

## Flow 6 — Report Snapshot

```text
Campaign
→ Approved/valid evidence selected
→ Create ClientReportSnapshot
→ Freeze report_snapshot_payload
→ Freeze evidence_snapshot_payload
```

Rules:

- Later evidence invalidation or supersede must not mutate old reports.
- A new report snapshot may reflect newer state.

## Flow 7 — Usage and Cost

```text
MediaJob output confirmed usable
→ UsageMeter recorded with idempotency
→ CostEvent records internal/provider cost
```

Rules:

- CostEvent is not invoice.
- CostEvent is not billing provider.
- UsageMeter is commercial usage only after usable output confirmation.

## Flow 8 — Safe Mode

```text
Authorized Operator
→ Activate Safe Mode
→ AuditLog record created
→ Sensitive actions blocked or constrained
→ Deactivate Safe Mode
→ AuditLog record created
```

Rules:

- SafeMode changes require permission.
- SafeMode changes must be audited.
