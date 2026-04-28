# Patch 002 Pending QA Addendum

This addendum records Patch 002 QA cases that are pending, contract-hardened, and not yet runtime-implemented.

The canonical QA suite file `docs/marketing_os_v5_6_5_phase_0_1_qa_test_suite.md` remains unchanged in this contract-hardening PR because Patch 002 runtime implementation is still NO-GO. This addendum must be reconciled into executable tests or the canonical QA suite before Patch 002 activation.

These cases are not passing evidence. They are required pending coverage before Patch 002 runtime implementation can be accepted and before Patch 002 activation can be reconsidered.

## Status Legend

```text
Pending / contract-hardened / not-yet-runtime-implemented
```

## Required Pending QA Coverage

| Test ID | Pending QA case | Status |
|---|---|---|
| QA-CON-001 | connector credentials must not store raw secrets; only `secret_ref` or an approved secret-reference equivalent may be accepted or persisted. | Pending / contract-hardened / not-yet-runtime-implemented |
| QA-CON-002 | invalid webhook signature must not change business state; any logging must be event-log only and must not mutate campaigns, contacts, publish state, evidence, usage, or billing-facing state. | Pending / contract-hardened / not-yet-runtime-implemented |
| QA-PERF-001 | performance events are isolated by workspace. | Pending / contract-hardened / not-yet-runtime-implemented |
| QA-PERF-002 | `metric_value` cannot be negative. | Pending / contract-hardened / not-yet-runtime-implemented |
| QA-PERF-003 | `campaign_metric_snapshot` is immutable. | Pending / contract-hardened / not-yet-runtime-implemented |
| QA-CRM-001 | contacts are isolated by workspace. | Pending / contract-hardened / not-yet-runtime-implemented |
| QA-CRM-002 | `contact_consent` is append-only. | Pending / contract-hardened / not-yet-runtime-implemented |
| QA-CRM-003 | `lead_capture` cannot link campaign or contact from another workspace. | Pending / contract-hardened / not-yet-runtime-implemented |
| QA-NOTIF-001 | failed notification delivery must not roll back the original operation. | Pending / contract-hardened / not-yet-runtime-implemented |
| QA-NOTIF-002 | notification delivery is isolated by workspace. | Pending / contract-hardened / not-yet-runtime-implemented |

## Expanded Contract-Hardened QA Backlog

| Area | Pending QA case | Status |
|---|---|---|
| Connector registry | connector registry tenant isolation and RBAC allow/deny for list/create. | Pending / contract-hardened / not-yet-runtime-implemented |
| Connector accounts | connector account tenant isolation and RBAC allow/deny for list/create. | Pending / contract-hardened / not-yet-runtime-implemented |
| Connector sync-runs | sync-runs endpoint is read-only metadata/history and must not execute live sync. | Pending / contract-hardened / not-yet-runtime-implemented |
| Webhook logs | webhook event logs are append-only and cannot be patched or deleted. | Pending / contract-hardened / not-yet-runtime-implemented |
| Credentials | credential response must not echo raw secrets, tokens, passwords, API keys, refresh tokens, signing secrets, or provider credentials. | Pending / contract-hardened / not-yet-runtime-implemented |
| Metrics | metric confidence score must remain between 0 and 1 inclusive. | Pending / contract-hardened / not-yet-runtime-implemented |
| Contact identifiers | contact identifier uniqueness and tenant isolation must be enforced. | Pending / contract-hardened / not-yet-runtime-implemented |
| Lead captures | lead capture must reject cross-workspace contact references and cross-workspace campaign references. | Pending / contract-hardened / not-yet-runtime-implemented |
| Notification rules | notification rule RBAC, tenant isolation, and disabled-rule behavior must be covered. | Pending / contract-hardened / not-yet-runtime-implemented |
| Notification deliveries | notification delivery failure must record failure without provider side effects or rollback of the source operation. | Pending / contract-hardened / not-yet-runtime-implemented |
| Audit | sensitive writes must create audit placeholders/events consistent with Sprint 1-4 approach. | Pending / contract-hardened / not-yet-runtime-implemented |
| ErrorModel | all Patch 002 validation, permission, tenant, and conflict failures must use the existing ErrorModel shape. | Pending / contract-hardened / not-yet-runtime-implemented |

## Explicit Non-Passing Statement

```text
No Patch 002 QA case is marked passing by this addendum.
No Patch 002 runtime endpoint is implemented by this addendum.
No Patch 002 migration activation is approved by this addendum.
```

## Decision

```text
GO: Patch 002 contract-hardening QA backlog is documented.
NO-GO: Patch 002 runtime implementation until reviewed after contract hardening.
NO-GO: Patch 002 activation until runtime implementation and CI verification pass in a later approved PR.
```
