---
name: runtime-sql-openapi-parity
description: Review Marketing OS runtime, SQL, OpenAPI, QA, and repository behavior for parity gaps without authorizing feature expansion or unapproved implementation.
---

# Runtime / SQL / OpenAPI Parity Review

Use this skill for parity audits, repository-slice reviews, contract comparisons, and gap analysis across runtime behavior, SQL, OpenAPI, QA, and docs.

## Source order

1. `README.md`
2. `docs/17_change_log.md`
3. Relevant runtime/SQL/OpenAPI/QA plans, reports, contracts, and implementation files named by the user.

If approved sources conflict, stop and report the conflict.

## Parity dimensions

Check for alignment across:

- runtime request/response behavior;
- repository method behavior;
- SQL table, column, constraint, trigger, RLS, and migration behavior;
- OpenAPI paths, schemas, permissions, and ErrorModel;
- QA suite and executable tests;
- current implementation reports and NO-GO status.

## Required questions

- Is the route/entity/repository method approved?
- Does runtime use route-derived workspace context?
- Does SQL enforce or support the same tenant boundary?
- Does OpenAPI expose the same public shape?
- Do tests cover allow, deny, tenant isolation, ErrorModel, and edge cases?
- Are append-only, immutability, idempotency, and audit rules preserved?
- Does the document or PR accidentally imply Pilot, Production, full DB-backed persistence, provider execution, auto-publishing, paid execution, AI agents, or feature expansion?

## Output

Separate findings into:

- confirmed parity;
- parity gaps;
- contract conflicts;
- implementation gaps;
- test gaps;
- forbidden-scope risks;
- recommended next approved step.
