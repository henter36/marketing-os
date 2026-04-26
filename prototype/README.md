# Marketing OS Phase 0/1 Clickable Prototype

This prototype is a lightweight, static, clickable UX model for Marketing OS Phase 0/1.

It is based only on the approved Phase 0/1 execution contracts:

- ERD
- SQL DDL
- SQL Patch 001
- OpenAPI
- Sprint Backlog
- QA Test Suite
- Codex Implementation Instructions
- Contract Patch 001

## Purpose

The prototype clarifies the system vision before full implementation. It is not production code and must not be treated as backend behavior.

It demonstrates:

- workspace context behavior
- role-based screen access
- campaign to brief to media job flow
- asset version immutability
- review and approval decision flow
- manual publish evidence flow
- report snapshot behavior
- usage/cost separation
- audit log visibility
- safe mode/onboarding screens
- OpenAPI-aligned screen boundaries

## How to view

Open this file locally in a browser:

```text
prototype/index.html
```

No build step is required.

## Important Phase 0/1 constraints represented

```text
- No auto-publishing
- No paid execution
- No AI agents
- No advanced attribution
- No BillingProvider
- No ProviderUsageLog
- workspace_id is not trusted from request body
- ManualPublishEvidence is protected
- ApprovalDecision approves MediaAssetVersion through validated decision flow
- UsageMeter requires usable_output_confirmed=true
- CostEvent is not customer billing
```

## Suggested next step

After stakeholder review, use this prototype and docs/UI mapping as input to Codex for frontend implementation only after Sprint 0 backend guardrails pass.
