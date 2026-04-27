# 15 — Integration Plan

## Purpose

This document defines integration boundaries for Marketing OS Phase 0/1.

## Phase 0/1 Integration Position

Phase 0/1 is governance-first and contract-first. External integrations must not expand scope.

## Allowed Integration Categories in Phase 0/1

| Category | Allowed? | Notes |
|---|---:|---|
| PostgreSQL | Yes | Core persistence and migration validation |
| Auth Provider Placeholder | Yes | AuthGuard baseline may be placeholder until provider selected |
| OpenAPI Tooling | Yes | Linting and contract validation required |
| Internal Cost Tracking | Yes | CostEvent and CostGuardrail only |
| Manual Publish Evidence | Yes | Manual proof record only |
| Audit Logging | Yes | Append-only internal audit |

## Not Allowed in Phase 0/1

```text
Social auto-publishing connectors
Paid ad platform execution
Meta CAPI / Google Enhanced Conversions as production attribution
Advanced attribution platform
AI agents orchestration
Billing provider integration
ProviderUsageLog
External workflow automation as source of truth
```

## Future Integration Candidates

These are not Phase 0/1 implementation items:

```text
Meta APIs
Google Ads APIs
TikTok APIs
Metricool / Buffer / Hootsuite connectors
Stripe / Paddle / Lemon Squeezy billing
Advanced attribution / MMM / uplift modeling
n8n / Temporal orchestration
ClickHouse analytics warehouse
```

## Integration Governance Rules

1. External systems must not become source of truth for core business state.
2. External publish status must not override ManualPublishEvidence without approved contract change.
3. External cost data must not become customer billing unless Billing domain is approved.
4. All webhooks require idempotency, signature validation, retry policy, and dead-letter strategy before production use.
5. Any integration touching customer data requires privacy/consent review.

## Sprint 0 Integration Tasks

```text
- PostgreSQL local connection
- Migration runner
- OpenAPI lint command
- Test database setup
- Environment variables template
- Health/readiness endpoints only
```
