# 10 — User Flows

## Status

Canonical user-flow index for Marketing OS Phase 0/1.

## Authoritative Source

Use the detailed UI flow file:

```text
docs/ui_user_flows.md
```

## Core Flows

1. Workspace and Access
2. Campaign to Brief
3. Media Job and Asset
4. Review and Approval
5. Publish Job and Manual Evidence
6. Report Snapshot
7. Usage and Cost
8. Safe Mode

## Flow Control Rules

```text
Workspace Context → MembershipCheck → PermissionGuard → Screen/Action
Campaign → BriefVersion → MediaJob → MediaAssetVersion → ReviewTask → ApprovalDecision → PublishJob → ManualPublishEvidence → ClientReportSnapshot
```

## No-Go Flow Violations

1. Creating PublishJob without approved ApprovalDecision.
2. Creating UsageMeter without usable output confirmation.
3. Updating ManualPublishEvidence proof fields.
4. Patching approved MediaAssetVersion.
5. Rendering auto-publish as Phase 0/1 behavior.
6. Showing paid execution as Phase 0/1 behavior.
