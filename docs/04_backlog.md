# 04 — Backlog

## Status

Canonical execution backlog for Phase 0/1.

## Authoritative Source

Use this approved file as the detailed backlog source:

```text
docs/marketing_os_v5_6_5_phase_0_1_backlog.md
```

## Scope Rule

This file does not introduce new scope. It exists to preserve the ordered documentation structure.

## Nashir Core V1 Backlog Planning Reference

This Nashir backlog reference is documentation-only. It does not approve implementation and does not create sprint-ready implementation tasks.

Nashir is the customer-facing campaign journey and publishing experience within the broader Marketing OS context. Backlog planning for Nashir must remain subordinate to `docs/02_v1_scope.md`, the approved Phase 0/1 backlog source, ERD, OpenAPI, SQL, QA, and current repository authority.

Nashir Core V1 backlog planning may reference only manual/export/review/approval/evidence scope candidates:

- Readiness Dashboard as a planning and visibility layer.
- Smart Wizard as manual structured intake.
- Product / Store / Service / Offer intake using user-provided data, uploaded files, or explicitly allowed public links only.
- Campaign basics and advertised object flow for manual campaign planning.
- Landing destination capture and review.
- Creative rights confirmation.
- Idea intake.
- Content requirements.
- Hashtags per selected channel as draft recommendations only.
- Video reference scripts as draft/reference outputs only.
- UTM Tracking Lite as structured link generation only.
- Human approval before manual publishing support.
- Approval lock as a scope principle.
- Manual publishing checklist.
- Manual publishing evidence.
- Manual performance review using user-entered data only.

This section does not add API endpoints, database entities, SQL, OpenAPI schemas, generated-client work, QA cases, runtime tasks, tests, package changes, migrations, workflow changes, or implementation work.

Before any Nashir Core V1 implementation can be considered, separate ERD impact review, OpenAPI impact review, QA/Test Cases, Threat Model Update, and any required evidence, approval, scoring, or permission contracts must be reviewed and approved.

This backlog patch is planning-only and must be followed by separate contracts before development.

### Nashir Backlog NO-GO Items

The following remain outside backlog implementation scope:

- Agent Mode runtime
- AI Service Layer implementation
- external integrations
- direct publishing
- social OAuth
- scheduling
- paid ads
- payment
- analytics ingestion
- attribution
- autonomous AI execution
- Post V1 Organic Publishing Module
- Post V1 Paid Campaign Execution Module

## Execution Boundary

Backlog implementation must follow:

1. Phase 0/1 only.
2. No auto-publishing.
3. No paid execution.
4. No AI agents.
5. No advanced attribution.
6. No BillingProvider or ProviderUsageLog.
7. No frontend endpoint outside OpenAPI.

## Sprint Dependency

```text
Sprint 0 must pass before Sprint 1.
Sprint 1 must pass before Sprint 2.
Sprint 2 must pass before Sprint 3.
Sprint 3 must pass before Sprint 4.
Pilot is blocked until all P0 QA tests pass.
```

## Related Files

```text
docs/11_sprint_plan.md
docs/12_qa_test_plan.md
docs/16_traceability_matrix.md
docs/marketing_os_v5_6_5_codex_implementation_instructions.md
```
