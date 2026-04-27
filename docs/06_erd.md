# 06 — ERD

## Status

Canonical ERD index for Marketing OS Phase 0/1.

## Authoritative Source

Use this approved file as the detailed ERD source:

```text
docs/marketing_os_v5_6_5_phase_0_1_erd.md
```

## Rule

This file is an index and governance wrapper only. It does not override the approved ERD.

## Relationship Authority

Section 52 relationship contract remains the relationship authority for Phase 0/1.

## Entity Naming Rules

Use:

```text
MediaJob
MediaAsset
MediaAssetVersion
ApprovalDecision
ManualPublishEvidence
UsageMeter
CostEvent
ClientReportSnapshot
AuditLog
```

Do not create:

```text
GenerationJob
Asset
Approval
BillingProvider
ProviderUsageLog
```

## Related Files

```text
docs/05_domain_map.md
docs/07_database_schema.sql
docs/08_api_spec.md
docs/16_traceability_matrix.md
```
