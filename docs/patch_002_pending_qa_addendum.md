# Patch 002 Pending QA Addendum

This temporary addendum records Patch 002 QA cases that are pending and not yet implemented.

The canonical QA suite file `docs/marketing_os_v5_6_5_phase_0_1_qa_test_suite.md` is intentionally not modified in this connector pass because safe append is not guaranteed and full-file replacement of the large canonical QA suite is unsafe.

These cases are not passing evidence. They are required pending coverage before Patch 002 activation.

## 1. Previously Pending Patch 002 Coverage

| Test ID | Pending QA case | Status |
|---|---|---|
| QA-CON-001 | Connector credentials must not store raw secrets. | Pending / not-yet-implemented |
| QA-CON-002 | Invalid webhook signature must not change business state. | Pending / not-yet-implemented |
| QA-PERF-001 | Performance events are isolated by workspace. | Pending / not-yet-implemented |
| QA-PERF-002 | metric_value cannot be negative. | Pending / not-yet-implemented |
| QA-PERF-003 | campaign_metric_snapshot is immutable. | Pending / not-yet-implemented |
| QA-CRM-001 | Contacts are isolated by workspace. | Pending / not-yet-implemented |
| QA-CRM-002 | contact_consent is append-only. | Pending / not-yet-implemented |
| QA-CRM-003 | lead_capture cannot link campaign from another workspace. | Pending / not-yet-implemented |
| QA-NOTIF-001 | Failed notification delivery must not roll back original operation. | Pending / not-yet-implemented |
| QA-NOTIF-002 | Notification delivery is isolated by workspace. | Pending / not-yet-implemented |

## 2. Competitive Feature Patch 002 Pending Coverage

The following QA cases are required by:

```text
docs/marketing_os_v5_6_5_phase_0_1_competitive_patch_002.md
docs/marketing_os_v5_6_5_phase_0_1_contract_patch_002_competitive_features.md
docs/marketing_os_v5_6_5_phase_0_1_schema_patch_002.sql
docs/marketing_os_v5_6_5_phase_0_1_openapi_patch_002.yaml
```

| Test ID | Pending QA case | Status |
|---|---|---|
| QA-COMP-TENANT-001 | Workspace A cannot access tracking links, click events, conversion events, attribution snapshots, brief suggestions, creators, publish intents, or video-planning outputs from Workspace B. | Pending / not-yet-implemented |
| QA-COMP-RBAC-001 | User without `brief.ai_suggest` cannot generate brief suggestions. | Pending / not-yet-implemented |
| QA-COMP-RBAC-002 | User without `tracking_link.create` cannot create tracking links. | Pending / not-yet-implemented |
| QA-COMP-RBAC-003 | User without `creator.match` cannot generate creator matches. | Pending / not-yet-implemented |
| QA-COMP-RBAC-004 | User without `publish.intent.approve` cannot approve publish intents. | Pending / not-yet-implemented |
| QA-COMP-BRIEF-001 | Brief suggestions must store model_name, model_version, prompt_version, suggestion_type, and suggestion_status. | Pending / not-yet-implemented |
| QA-COMP-BRIEF-002 | Accepting a suggestion must not automatically overwrite the source brief_version. | Pending / not-yet-implemented |
| QA-COMP-BRIEF-003 | Rejecting a suggestion must preserve the original suggestion payload for auditability. | Pending / not-yet-implemented |
| QA-COMP-BRIEF-004 | Campaign brief keyword cannot link to a campaign in another workspace. | Pending / not-yet-implemented |
| QA-COMP-ATTR-001 | Tracking link cannot be created for a campaign outside the active workspace context. | Pending / not-yet-implemented |
| QA-COMP-ATTR-002 | Tracking link short_path must be unique within a workspace. | Pending / not-yet-implemented |
| QA-COMP-ATTR-003 | Click events are append-only and cannot be updated or deleted. | Pending / not-yet-implemented |
| QA-COMP-ATTR-004 | Conversion events with the same workspace idempotency key cannot double count. | Pending / not-yet-implemented |
| QA-COMP-ATTR-005 | Attribution snapshots are append-only and cannot be updated or deleted. | Pending / not-yet-implemented |
| QA-COMP-ATTR-006 | Conversion value must be null or non-negative. | Pending / not-yet-implemented |
| QA-COMP-CREATOR-001 | Creator profiles are isolated by workspace. | Pending / not-yet-implemented |
| QA-COMP-CREATOR-002 | Creator campaign match cannot link campaign and creator from different workspaces. | Pending / not-yet-implemented |
| QA-COMP-CREATOR-003 | Creator fit score must remain advisory and cannot create payment, contract, commission, or approval state. | Pending / not-yet-implemented |
| QA-COMP-CREATOR-004 | Creator outreach drafts must not be sent automatically. | Pending / not-yet-implemented |
| QA-COMP-CREATOR-005 | Creator collaboration status changes must create status history. | Pending / not-yet-implemented |
| QA-COMP-CREATOR-006 | Creator audience snapshots are append-only and cannot be updated or deleted. | Pending / not-yet-implemented |
| QA-COMP-PUBLISH-001 | Publish intent creation must not execute publishing. | Pending / not-yet-implemented |
| QA-COMP-PUBLISH-002 | Publish intent approval must not perform direct social publishing. | Pending / not-yet-implemented |
| QA-COMP-PUBLISH-003 | Channel variant must reference a media_asset_version from the same workspace. | Pending / not-yet-implemented |
| QA-COMP-PUBLISH-004 | Publish attempt records are append-only and cannot be updated or deleted. | Pending / not-yet-implemented |
| QA-COMP-PUBLISH-005 | Publish status history is append-only and records from_status, to_status, changed_by_user_id, and changed_at. | Pending / not-yet-implemented |
| QA-COMP-PUBLISH-006 | Patch 001 ManualPublishEvidence protections remain valid after Patch 002 schema is applied. | Pending / not-yet-implemented |
| QA-COMP-VIDEO-001 | Video script generation creates a planning artifact only and does not trigger video rendering. | Pending / not-yet-implemented |
| QA-COMP-VIDEO-002 | Storyboard generation creates a planning artifact only and does not trigger video rendering. | Pending / not-yet-implemented |
| QA-COMP-VIDEO-003 | Storyboard scenes enforce positive scene_number and uniqueness within a storyboard. | Pending / not-yet-implemented |
| QA-COMP-VIDEO-004 | Voiceover script must reference at least one parent: video_script or storyboard. | Pending / not-yet-implemented |
| QA-COMP-NOGO-001 | No API endpoint may implement auto-follow, auto-like, or auto-comment behavior. | Pending / not-yet-implemented |
| QA-COMP-NOGO-002 | No API endpoint may implement autonomous social publishing. | Pending / not-yet-implemented |
| QA-COMP-NOGO-003 | No API endpoint may implement automated paid campaign execution or budget mutation. | Pending / not-yet-implemented |
| QA-COMP-NOGO-004 | No SQL table may introduce creator payments, escrow, commissions, contract automation, or automated negotiation. | Pending / not-yet-implemented |
| QA-COMP-NOGO-005 | No SQL table or endpoint may introduce full AI video rendering or batch video generation in Core V1. | Pending / not-yet-implemented |

## 3. Required Reconciliation Before Activation

Patch 002 must not be activated until:

1. The canonical QA suite includes the pending cases above.
2. SQL Patch 002 passes strict migration verification after base schema and Patch 001.
3. OpenAPI Patch 002 passes strict OpenAPI lint.
4. RBAC permission codes are reconciled with roles and authorization checks.
5. Audit events are reconciled with canonical audit logging behavior.
6. Implementation backlog maps every endpoint and table to an explicit feature slice.
7. The No-Go cases are converted into regression tests.

## Decision

```text
NO-GO: Patch 002 activation until pending QA cases are reconciled into canonical QA coverage and implemented in the approved Patch 002 scope.
GO: Patch 002 reconciliation planning only.
NO-GO: Programming or Sprint 5 implementation until SQL/OpenAPI/QA/RBAC/Audit reconciliation is complete.
```
