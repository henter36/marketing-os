# 08 — API Spec

## Status

Canonical API specification index for Marketing OS Phase 0/1.

## Authoritative Source

Use this approved OpenAPI contract:

```text
docs/marketing_os_v5_6_5_phase_0_1_openapi.yaml
```

## API Rules

1. Frontend must not invent endpoints outside OpenAPI.
2. Backend must not implement product endpoints outside OpenAPI unless explicitly internal health/readiness endpoints.
3. Every workspace-scoped endpoint must use workspace context from route/context.
4. `workspace_id` from request body must not be trusted.
5. Error responses must follow ErrorModel.
6. Idempotency is required where declared by OpenAPI.

## Allowed Internal Endpoints

```text
GET /health
GET /ready
```

They must not expose tenant data.

## Forbidden API Scope

```text
auto-publishing
paid execution
AI agents
advanced attribution
BillingProvider
ProviderUsageLog
```

## Related Files

```text
docs/09_screen_map.md
docs/10_user_flows.md
docs/16_traceability_matrix.md
```
