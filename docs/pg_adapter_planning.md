# pg Adapter Planning

## 1. Executive Decision

- pg Adapter Planning: GO.
- pg adapter implementation: NO-GO until this plan is reviewed.
- DB-backed Slice 0: GO as limited repository/test read-path slice.
- DB-backed full persistence: NO-GO.
- Slice 1 planning/implementation: NO-GO until adapter approach is approved.
- Sprint 5 coding: NO-GO.
- Pilot: NO-GO.
- Production: NO-GO.

This is a documentation-only planning document. It does not implement `pg`, node-postgres, dependencies, DB-backed full persistence, Slice 1, Sprint 5, Pilot, Production, endpoint changes, SQL changes, OpenAPI changes, workflow changes, migration runner changes, router/store changes, or runtime behavior changes.

## 2. Problem Statement

DB-backed Repository Slice 0 introduced a minimal `psql`/spawn-based DB adapter. That adapter is acceptable for limited repository/test verification only because Slice 0 proves a narrow Workspace/Membership/RBAC read path without changing runtime persistence.

The current adapter is not appropriate as long-term runtime DB infrastructure. Before Slice 1 or broader DB-backed persistence, the project needs an approved DB client, pool lifecycle, transaction interface, workspace context handling, ErrorModel mapping, and test isolation strategy.

The goal of this planning track is to replace or supersede `psql`/spawn with a real PostgreSQL client approach without changing product behavior, public API contracts, router/store behavior, or the in-memory runtime default.

## 3. Current Adapter Assessment

Current `src/db.js`:

- Uses `spawnSync` and the `psql` binary.
- Performs string-based parameter substitution through `quoteSqlLiteral`.
- Wraps SELECT results into JSON through `psql` output.
- Sets `app.current_workspace_id` for RLS defense in depth.
- Provides a close function and singleton pattern.
- Is good enough for proof/verification.
- Is not acceptable as a production runtime DB adapter.

Identified risks:

- Process spawn per query creates large runtime overhead.
- Performance is unsuitable for long-lived application traffic.
- Error fidelity is lost because driver-level error details are collapsed too early.
- Transaction support is limited and awkward.
- SQL wrapping is brittle and read-shape dependent.
- Type handling is limited compared with a native PostgreSQL client.
- Runtime depends on the external `psql` binary being installed.
- The approach is not suitable for long-lived application runtime infrastructure.

## 4. Candidate DB Client Options

### Option A: node-postgres / pg

Pros:

- Mature and widely used PostgreSQL client for Node.js.
- CommonJS-compatible and fits the current project style.
- Provides `Pool`, pooled clients, parameterized queries, and explicit transactions.
- Does not impose ORM schema ownership over the contract-first SQL files.
- Easy to wrap behind the existing repository interfaces.

Cons:

- Lower-level than an ORM or query builder.
- Requires disciplined repository-level SQL ownership.
- Requires explicit error-code mapping for constraints and driver failures.
- Type conversion and result shaping remain application responsibilities.

Fit for this project:

- Strong fit for the current CommonJS, contract-first repository architecture.
- Recommended initial adapter choice.

### Option B: postgres.js

Pros:

- Lightweight and ergonomic PostgreSQL client.
- Supports pooled connections and parameterized tagged-template queries.
- Good performance profile.
- Smaller API surface than an ORM.

Cons:

- Tagged-template query style may require more refactoring than `pg` for the current SQL string pattern.
- CommonJS integration must be checked carefully depending on package/module setup.
- Team familiarity and operational conventions may be lower than `pg`.
- Error mapping still requires explicit project wrappers.

Fit for this project:

- Plausible, but less conservative than `pg` for the immediate next step.

### Option C: Query Builder Or ORM

Examples include Kysely, Knex, Prisma, and Drizzle.

Pros:

- Can improve query composition and type safety depending on the tool.
- Can centralize schema-ish definitions and reduce some SQL string handling.
- Some tools provide migration, model, or type-generation workflows.

Cons:

- Risks imposing schema ownership that conflicts with the existing contract-first SQL authority.
- May add abstraction before repository patterns and SQL/runtime parity are proven.
- Larger dependency and learning footprint.
- ORM-generated migrations must not supersede approved SQL files without a separate governance decision.
- Can make exact SQL, RLS context, and transaction behavior less transparent if adopted too early.

Fit for this project:

- Defer for now. A query builder or ORM can be reconsidered after the repository boundaries, DB parity expectations, and operational constraints are proven with a direct adapter.

### Recommendation

Use `node-postgres` / `pg` initially because it is mature, direct, CommonJS-compatible, and supports `Pool` and transaction clients without imposing ORM schema ownership.

Defer ORM/query builder adoption until repository patterns and runtime/SQL parity are proven.

## 5. Proposed Adapter Architecture

Future implementation should define an adapter such as `src/db/pool.js` or an equivalent narrow module.

Candidate API:

```text
createPgPool({ databaseUrl })
getPgPool()
closePgPool()
withTransaction(pool, callback)
query(clientOrPool, sql, params, options)
setWorkspaceContext(client, workspaceId)
```

Rules:

- One pool per process.
- No pool per request.
- `DATABASE_URL` comes from existing config/environment plumbing.
- Use parameterized queries only.
- No string interpolation for values.
- Workspace context must be set safely.
- Repositories receive a pool or transaction client through dependency injection.
- Existing repository interfaces should remain stable where possible.
- Existing in-memory runtime remains default unless separately approved.

Workspace context approach:

- For transaction-scoped work, use `SET LOCAL app.current_workspace_id = $workspaceId` after `BEGIN` and before workspace-scoped queries.
- For one-off read queries that require RLS context, use a safe client checkout, set context, run the query, and reset/release in a `finally` block, or route those reads through `withTransaction` for deterministic `SET LOCAL` behavior.
- Do not allow workspace context to leak across pooled clients.

## 6. Transaction Strategy

- Read-only repositories may use pool query where RLS context is not required.
- Workspace-scoped reads that rely on RLS should use a safe workspace context helper.
- Future write slices must use an explicit transaction client.
- `SET LOCAL app.current_workspace_id` should be used inside transactions where RLS context is required.
- Idempotency key lookup, protected write, and audit event creation must occur in one transaction for future write slices.
- Transaction rollback maps to the existing ErrorModel.
- No transaction API should expose raw driver internals to route handlers.

Future write transaction pattern:

```text
BEGIN
SET LOCAL app.current_workspace_id = <route workspace id>
validate membership/ownership constraints
look up idempotency key where applicable
perform protected write
write audit event where required
commit or rollback
```

## 7. ErrorModel Mapping Strategy

Database outcomes must map at the repository/service boundary to the existing ErrorModel surface.

| Condition | Required Mapping |
| --- | --- |
| Connection failure | Generic `INTERNAL_ERROR` with correlation ID; no host, user, password, connection string, or driver text. |
| Query syntax or driver error | Generic `INTERNAL_ERROR`; log internally only if approved logging exists. |
| Unique constraint conflict | Existing conflict shape, such as idempotency or duplicate-resource conflict where the repository/service can identify the business meaning. |
| Foreign key conflict | Existing not-found or validation shape without cross-tenant existence leakage. |
| Check constraint violation | Existing validation shape when business meaning is known; otherwise generic validation/internal mapping without constraint internals. |
| Timeout | Generic retryable internal/service unavailable style response if supported by existing ErrorModel conventions. |
| Transaction rollback | Map to the triggering business error when known; otherwise generic `INTERNAL_ERROR`. |
| Not found | Existing not-found shape or repository `null`/typed outcome for caller mapping. |
| Permission denial | Existing guard/RBAC `PERMISSION_DENIED` or `WORKSPACE_ACCESS_DENIED`; never a raw DB error. |

Rules:

- No SQL text in API responses.
- No constraint internals in API responses.
- No stack traces in API responses.
- No connection strings, hostnames, usernames, passwords, or secrets in API responses.
- Repository/service boundary maps database errors to existing ErrorModel.
- Tests must assert no raw DB details are exposed.

## 8. Test Isolation Strategy

Acceptable strategy:

- Use the dedicated test database per CI job already provided by GitHub Actions service.
- Use deterministic seed for repository tests.
- Prefer transaction-per-test rollback where feasible for future write-path tests.
- Use explicit setup/teardown owned by the test harness where transaction rollback is not practical.
- Do not rely on manual DB edits.
- Do not reset the database between migration retry first and second run.
- Keep migration and retry gates passing.

For the pg adapter implementation, keep tests focused on the existing Slice 0 Workspace/Membership/RBAC read path and existing ErrorModel behavior.

## 9. Migration Compatibility

- Existing migration runner remains `psql`-based for schema application unless separately changed.
- The pg adapter does not replace the migration runner in this plan.
- Migration retry verification remains unchanged.
- Adapter tests must run after strict migrations or must perform strict migration setup in the test harness as Slice 0 does today.
- Do not weaken `db:migrate:strict`.
- Do not weaken `db:migrate:retry`.

## 10. Slice 0 Adapter Migration Strategy

Future implementation should move from `psql`/spawn to the approved pg adapter as follows:

1. Introduce the pg adapter behind the same repository-facing interface.
2. Keep current repository method names stable.
3. Replace adapter internals without changing public API behavior.
4. Keep tests focused on Workspace/Membership/RBAC read path.
5. Do not expand into Campaign, Brief, Media, Patch 002, Usage/Cost, Audit, or write-path persistence.
6. Keep the in-memory runtime default.
7. Document whether the `psql`/spawn adapter is removed or retained temporarily for comparison.

Preferred migration stance:

- Supersede the `psql`/spawn adapter for Slice 0 repository tests once pg parity is proven.
- Retain migration runner behavior separately because schema migration remains psql-based under the existing gates.

## 11. Future Implementation PR Allowed Changes

A future pg adapter implementation PR may modify:

- `package.json` only to add an approved dependency such as `pg`.
- `package-lock.json` if generated by the dependency addition.
- `src/db.js` or new `src/db/pool.js`.
- Repository files only if required to use parameterized pg queries.
- `test/integration/db-backed-slice0.integration.test.js`.
- `docs/pg_adapter_implementation_report.md`.

It must not modify:

- SQL files.
- OpenAPI files.
- Migration runner.
- Workflows unless a CI dependency/setup change is strictly required.
- Router/store behavior.
- Endpoints.
- Product domains.
- Sprint 5 files.

## 12. Verification Gates For Future Implementation

Future implementation must run and report:

```bash
npm install
npm test
npm run test:integration
npm run openapi:lint:strict
npm run db:seed
npm run db:migrate:strict
npm run db:migrate:retry
npm run verify:strict
```

GitHub Actions strict verification must pass before merge.

If a dependency is added, the lockfile update must be included and reviewed. Verification must not weaken existing strict gates.

## 13. Risk Register

| Risk | Impact | Required Control |
| --- | --- | --- |
| Dependency introduction risk | New package may add maintenance, security, or compatibility burden | Review dependency choice and lockfile changes. |
| Pool lifecycle leaks | Exhausted connections or hung tests/runtime | One pool per process, close hook, no pool per request. |
| Transaction misuse | Partial writes or inconsistent audit/idempotency behavior | Central `withTransaction` helper and write-slice tests. |
| Workspace context leakage between pooled clients | Cross-tenant data exposure | Use `SET LOCAL` inside transactions or guaranteed reset/release patterns. |
| Raw DB error leakage | Security and implementation detail exposure | ErrorModel mapping tests and no raw driver errors in responses. |
| Performance regression | Slow repository tests or runtime reads | Avoid process spawning; measure pg adapter behavior if needed. |
| Test flakiness | CI instability and false confidence | Deterministic seed and isolated test setup/teardown. |
| Accidental runtime behavior switch | Unreviewed DB-backed runtime path | Keep in-memory runtime default unless separately approved. |
| Accidental Slice 1/Sprint 5 scope creep | Product persistence before adapter proof | Limit implementation to Slice 0 adapter replacement. |
| False production-readiness claim | Governance failure | Keep DB-backed full persistence, Pilot, and Production NO-GO. |

## 14. Go / No-Go Criteria For Future pg Adapter Implementation

### GO Only If

- This plan is reviewed.
- Dependency choice is approved.
- Existing repository interfaces remain narrow.
- No product behavior changes are mixed in.
- Tests prove Slice 0 still works.
- Migration and retry verification remain passing.
- Existing in-memory runtime remains default.
- ErrorModel mapping remains compatible.

### NO-GO If

- Implementation expands into product persistence.
- Router/store behavior changes.
- Endpoints change.
- Raw DB details leak.
- Workspace context can bleed between queries.
- CI requires weakening gates.
- Sprint 5 scope is mixed in.
- Pilot or Production readiness is claimed.

## 15. Recommended Next Step

Recommendation: Proceed to pg Adapter Implementation PR after this planning PR is reviewed, limited to replacing/superseding the `psql`/spawn adapter for Slice 0 only.

This is conservative because Slice 0 already proved the repository/test read-path shape, while the current adapter is intentionally not suitable as long-term runtime DB infrastructure. The next implementation should prove the approved adapter without expanding into Slice 1, product persistence, router/store switching, or Sprint 5.

## 16. Final Decision

- pg Adapter Planning: GO.
- pg adapter implementation: NO-GO until reviewed.
- DB-backed Slice 0: GO as limited repository/test read-path slice.
- DB-backed full persistence: NO-GO.
- Slice 1: NO-GO.
- Sprint 5 coding: NO-GO.
- Pilot: NO-GO.
- Production: NO-GO.
