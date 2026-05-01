# Source-of-Truth Precedence Decision Record

## Purpose

This document resolves the source-of-truth precedence gap created by the growing number of Marketing OS governance, PRD, planning, intake, runtime, SQL, OpenAPI, QA, and verification documents.

It is documentation-only. It does not authorize implementation, SQL changes, OpenAPI changes, runtime changes, package changes, workflow changes, migrations, endpoint changes, Sprint 5, Pilot, or Production.

## Executive Decision

Marketing OS remains contract-first and current-status governed.

When documents conflict, current-state and implementation authority must be resolved in this order:

1. `README.md` for the visible current repository status and top-level GO / NO-GO boundaries.
2. `docs/17_change_log.md` for chronological change history and explicit GO / NO-GO state changes.
3. Post-merge verification reports and current repository status documents for verified merged state.
4. ERD / SQL / OpenAPI / QA contracts for implementation authority within their specific domains.
5. Specific planning documents explicitly named by the user request for scoped planning only.
6. Consolidated PRD, future fit-gap documents, idea intake documents, and discussion-derived documents as strategic input only.
7. GitHub Issues as triage and planning records only unless a later merged PR makes their content authoritative.

## Non-Authoritative Sources

The following sources may inform planning, but do not authorize implementation by themselves:

- `docs/chatgpt_discussion_idea_intake_source.md`
- `docs/marketing_os_consolidated_prd_expanded.md`
- future fit-gap documents
- proposal registers
- GitHub Issues
- discussion-derived ideas
- agent runtime portability notes
- strategic roadmap documents

## Consolidated PRD Status

The consolidated expanded PRD is a strategic blueprint and product-direction reference. It does not supersede:

- `README.md`
- `docs/17_change_log.md`
- current repository status documents
- ERD
- SQL schema files
- OpenAPI contracts
- QA suite
- implementation reports
- post-merge verification reports
- later merged planning documents

## Agent Runtime and Portability Status

Agent runtime portability and setup-data governance documents are adapter-governance and future-readiness references only. They do not authorize runtime agents, external providers, auto-publishing, auto-replies, paid execution, or external tool execution.

## Progressive Automation Status

`docs/progressive_automation_and_governed_agentic_execution_strategy.md` establishes the strategic direction that Marketing OS is automation-first by design and governed-by-default in execution.

It does not authorize runtime agent implementation, external publishing, auto-replies, paid ads execution, budget-changing agents, SQL changes, OpenAPI changes, package changes, or workflow changes.

## Root AGENTS.md Status

The root `AGENTS.md` exists and governs Codex operating discipline, repository scope control, and task execution behavior.

It is not the same as a product-level governed agent architecture contract. If the project later needs a product-level agent contract, create a separate documentation file, such as:

`docs/governed_agent_architecture_contract.md`

Do not create another `docs/AGENTS.md` that could conflict with the root `AGENTS.md`.

## Conflict Rule

If approved sources conflict, work must stop and report the conflict. Do not resolve source conflicts by assumption.

## Current NO-GO Boundaries Preserved

This decision record preserves the current NO-GO boundaries:

- Sprint 5 coding remains NO-GO unless separately approved.
- Pilot remains NO-GO.
- Production remains NO-GO.
- DB-backed full persistence remains NO-GO.
- Runtime agents remain NO-GO.
- External publishing remains NO-GO.
- Auto-replies remain NO-GO.
- Paid ads execution remains NO-GO.
- Budget-changing agents remain NO-GO.
- SQL/OpenAPI/runtime/package/workflow changes remain NO-GO unless separately approved.

## Relationship to Issues

This document is intended to resolve the governance question raised in Issue #71.

It does not close or supersede Issue #69 or Issue #70, which separately track README reconciliation and change-log reconciliation.

## Final Decision

GO: Use this document as the source-of-truth precedence decision record.

NO-GO: Treating PRD, intake, future fit-gap, agent-runtime, or Issue text as implementation authority.

NO-GO: Any runtime, SQL, OpenAPI, QA, package, workflow, endpoint, migration, or persistence change from this decision record.
