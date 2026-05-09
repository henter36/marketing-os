# Project Instructions

This project must follow the approved V1 scope.

## Rules

- Do not add features outside docs/02_v1_scope.md.
- Do not change database design without approval.
- Do not create APIs not listed in docs/08_api_spec.md unless required for infrastructure.
- Do not create UI screens not listed in docs/09_screen_map.md.
- Every protected action must include authorization.
- Every important data change must include audit logging.
- Every implemented feature must include tests.
- Any assumption must be documented before coding.
- If a conflict exists between files, stop and report it.

## Source of Truth

- Scope: docs/02_v1_scope.md
- Backlog: docs/04_backlog.md
- Domain boundaries: docs/05_domain_map.md
- Database: docs/06_erd.md and docs/07_database_schema.sql
- APIs: docs/08_api_spec.md
- Screens: docs/09_screen_map.md
- Sprint execution: docs/11_sprint_plan.md
- Tests: docs/12_qa_test_plan.md

The numbered docs above remain navigation and governance sources. Where a numbered doc explicitly defers to a `docs/marketing_os_v5_6_5_phase_0_1_*` file, the deferred file is the executable contract source for that area. In particular, the Phase 0/1 ERD, SQL schema, OpenAPI contract, backlog, and QA contract files remain the executable sources for implementation details where referenced by their numbered wrappers.

Agents must not treat a wrapper/index document as permission to invent implementation details. If a wrapper and its deferred contract source conflict, stop and report the conflict before planning or coding.

## Execution Policy

Codex or any coding agent must not implement the full system at once.

Implementation must proceed by approved sprint only.

Before coding any module, the agent must:
1. Read the relevant docs.
2. Summarize the implementation plan.
3. List files to create or modify.
4. List assumptions.
5. Wait for approval if scope, database, API, or permissions are unclear.
