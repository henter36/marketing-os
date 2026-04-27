# Marketing OS Competitive Feature Documents Index

## Purpose

This documentation package adds governed competitive feature analysis outputs to Marketing OS based on selected open-source projects:

- erxes
- Medusa
- Strapi
- IDURAR ERP CRM
- Frappe CRM
- NextCRM
- Mattermost

The intent is not to copy these projects. The intent is to extract suitable feature patterns and place them inside a controlled Marketing OS scope.

## Documents

| File | Purpose | Phase |
|---|---|---|
| `marketing_os_competitive_features_scope.md` | Defines approved, deferred, and rejected competitive features | Reference / Phase 0 |
| `marketing_os_feature_phase_map.md` | Maps features to Phase 0, Core V1, Extended V1, Post V1, and Rejected | Phase governance |
| `marketing_os_core_v1_backlog_competitive_features.md` | Adds executable Core V1 backlog items inspired by the reviewed projects | Core V1 |
| `marketing_os_integration_boundaries.md` | Defines integration boundaries with CMS, CRM, commerce, and chat tools | Phase 0 + Core V1 |
| `marketing_os_risk_register_competitive_features.md` | Registers risks caused by adopting external project patterns | Phase 0 + Core V1 |
| `marketing_os_data_model_additions.md` | Lists data model additions required for the approved scope | Phase 0 + Core V1 |
| `marketing_os_api_surface_additions.md` | Lists candidate API surface additions for approved Core V1 features | Core V1 |
| `marketing_os_rejected_features.md` | Documents rejected and deferred features to prevent scope drift | Phase 0 Governance |

## Executive Decision

Start with Phase 0 governance and Core V1 marketing execution loop only.

Do not implement all extracted features at once.

The approved Core V1 loop is:

```text
Understand → Plan → Generate → Review → Publish → Measure → Learn
```

Any feature that does not directly support this loop must be deferred or rejected.

## Implementation Warning

These documents do not authorize immediate code implementation. They define controlled scope additions that must be reconciled with the existing ERD, SQL DDL, OpenAPI, backlog, QA suite, and Codex implementation instructions before execution.
