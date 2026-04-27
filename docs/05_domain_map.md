# 05 — Domain Map

## Purpose

This document defines the implementation domains for Marketing OS Phase 0/1 and prevents mixing separate responsibilities.

## Approved Domains

```text
identity
workspaces
rbac
subscriptions
brand
templates
campaigns
briefs
media-jobs
media-assets
review
approval
publish
reports
usage
cost
audit
operations
```

## Forbidden Phase 0/1 Domains

```text
agents
paid-execution
auto-publishing
advanced-attribution
billing-provider
provider-usage-log
```

## Domain Boundaries

| Domain | Owns | Must Not Own |
|---|---|---|
| identity | users and authenticated actor identity | workspace authorization rules |
| workspaces | tenant context and workspace records | trusting workspace_id from body |
| rbac | roles, permissions, membership checks | business state |
| campaigns | campaign records and state transitions | media asset content |
| briefs | versioned campaign briefs and hashes | patching historical brief content |
| media-jobs | generation request lifecycle and idempotency | commercial billing |
| media-assets | assets and immutable versions | approval decision logic |
| review | review task assignment | final approval effect |
| approval | append-only decision and hash validation | asset content mutation |
| publish | publish job record and manual-publish governance | external auto-publishing |
| reports | frozen client report snapshots | live mutable dashboards as evidence |
| usage | commercial usage records after confirmed output | provider cost or invoice logic |
| cost | cost events, budgets, guardrails | billing provider integration |
| audit | append-only audit events | source of business state |
| operations | safe mode and onboarding | bypassing permissions |

## Non-Negotiable Separations

```text
UsageMeter != CostEvent
CostEvent != BillingProvider
PublishJob != AutoPublishConnector
ManualPublishEvidence != Editable Proof
ApprovalDecision != Mutable Approval State
AuditLog != Business State
Workspace Context != Request Body Input
ReportSnapshot != Live Report View
```

## Related Files

```text
docs/06_erd.md
docs/07_database_schema.sql
docs/08_api_spec.md
docs/16_traceability_matrix.md
```
