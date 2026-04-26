# Marketing OS Phase 0/1 — Codex UI Implementation Prompt

Use this prompt only after Sprint 0 backend guardrails are implemented and passing.

## Prompt

```text
You are implementing the Marketing OS Phase 0/1 frontend shell.

Approved sources only:
- docs/marketing_os_v5_6_5_phase_0_1_erd.md
- docs/marketing_os_v5_6_5_phase_0_1_schema.sql
- docs/marketing_os_v5_6_5_phase_0_1_schema_patch_001.sql
- docs/marketing_os_v5_6_5_phase_0_1_openapi.yaml
- docs/marketing_os_v5_6_5_phase_0_1_backlog.md
- docs/marketing_os_v5_6_5_phase_0_1_qa_test_suite.md
- docs/marketing_os_v5_6_5_codex_implementation_instructions.md
- docs/marketing_os_v5_6_5_phase_0_1_contract_patch_001.md
- prototype/index.html
- prototype/styles.css
- prototype/app.js
- docs/ui_screen_inventory.md
- docs/ui_user_flows.md
- docs/ui_permission_matrix.md
- docs/ui_api_mapping.md

Task:
Implement the Phase 0/1 frontend shell using the approved OpenAPI contract and UI mapping.

Required behavior:
1. Use route/context workspaceId only.
2. Do not trust workspace_id from request body.
3. Implement role-aware navigation.
4. Hide or disable unauthorized actions, but still rely on backend authorization.
5. Render ErrorModel consistently.
6. Show audit-event hints for sensitive write actions.
7. Represent immutable entities as versioned records.
8. Never add auto-publishing controls.
9. Never add paid execution controls.
10. Never add AI agent controls.
11. Never add advanced attribution screens.
12. Never create BillingProvider or ProviderUsageLog UI.

Screens to implement:
- Dashboard
- Workspaces
- Members & RBAC
- Campaigns
- Brief Versions
- Media Jobs
- Assets & Versions
- Review Tasks
- Approval Decisions
- Publish Jobs
- Manual Evidence
- Report Snapshots
- Usage & Cost
- Audit Log
- Safe Mode & Onboarding

Quality gates:
- Every screen maps to an approved OpenAPI path or documented gap.
- Every sensitive action maps to an audit event.
- Every workspace-scoped data call includes workspace context.
- Unauthorized actions produce ErrorModel-style feedback.
- No forbidden Phase 0/1 scope appears in navigation or forms.

Output required:
- Files changed
- Screens implemented
- API mappings used
- Permissions applied
- Error states implemented
- Gaps found
- Tests added or recommended
```

## No-Go Conditions

Codex must stop if:

1. A screen requires an endpoint not in OpenAPI.
2. Backend Sprint 0 guardrails are missing.
3. Tenant context behavior is unclear.
4. UI needs to mutate immutable fields.
5. Product scope drifts into Post V1 capabilities.
