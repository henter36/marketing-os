# DB-backed Repository Architecture Contract

## Executive status

- DB-backed Repository Architecture Contract: GO.
- DB-backed implementation: NO-GO.
- Sprint 5 coding: NO-GO.
- Pilot: NO-GO.
- Production: NO-GO.

This document defines the architecture contract that must be reviewed before any DB-backed repository implementation begins. It is documentation-only and does not authorize runtime changes, feature expansion, workflow changes, or repository implementation.

## 1. Repository interface boundaries

Repository modules must expose narrow, domain-specific methods rather than raw database access from route handlers. Route handlers and guards may call services or repositories, but they must not embed SQL directly.

Required initial repository boundaries:

- `WorkspaceRepository`: workspace reads and workspace existence checks.
- `MembershipRepository`: workspace membership and role lookup.
- `RbacRepository`: permission read path and role permission resolution if permissions move to database-backed reads.
- Later slices may define campaign, brief, brand, media, approval, publish, evidence, report, audit, usage/cost, and Patch 002 repositories only after separate approval.

Repository methods must return domain results or typed not-found/conflict/validation outcomes that can be mapped to the existing ErrorModel. They must not return raw driver errors to route handlers.

## 2. DB connection lifecycle

The DB connection lifecycle must be explicit and centralized.

- Create one database pool per application process.
- Do not create a new pool per request.
- Provide a shutdown hook that closes the pool cleanly.
- Repository instances must receive a pool or transaction client through dependency injection.
- Tests must be able to construct isolated app instances with isolated database configuration.
- Connection configuration must come from environment/config plumbing, not hard-coded credentials.
- Missing database configuration must fail clearly in strict DB-backed test modes.

The first implementation slice may introduce connection scaffolding only if it is necessary for the Workspace/Membership/RBAC read path. It must not switch unrelated runtime state from in-memory to DB-backed persistence.

## 3. Transaction policy

Transactions are mandatory when a repository operation spans multiple rows, performs an idempotent write, or must preserve an all-or-nothing business invariant.

Repository methods must support transaction clients for future write slices. The first allowed implementation slice is read-only, so it should not require write transactions except for test setup outside runtime behavior.

Future write slices must use transactions for:

- multi-row creates or updates;
- idempotency key lookup plus protected write;
- audit event creation tied to a sensitive write;
- cross-resource state transitions such as approvals, publishing, evidence supersession, report snapshots, usage/cost recording, or Patch 002 lead capture validation.

Transaction failures must roll back all partial business state and map to the existing ErrorModel at the service/router boundary.

## 4. Mandatory workspaceId handling

Every workspace-scoped repository method must accept `workspaceId` explicitly as a required argument. The route workspace context is the authoritative workspace source.

Repository method signatures should make workspace scope visible, for example:

```text
getMembership({ workspaceId, userId })
listCampaigns({ workspaceId, filters })
getMediaAssetVersion({ workspaceId, mediaAssetVersionId })
```

Repository methods must not infer workspace scope from request bodies or unscoped IDs.

## 5. Never trust workspace_id from request body

Request body `workspace_id` must never be trusted for persistence decisions. If a body includes `workspace_id`, existing guard policy must reject it or require it to match the route workspace context according to the existing runtime behavior.

DB-backed repositories must not use body-provided `workspace_id` for inserts, updates, filters, ownership checks, or audit events. The route-derived `workspaceId` must be passed down explicitly.

## 6. Tenant isolation enforcement per repository method

Tenant isolation is mandatory at the repository layer, not only at router/guard level.

Every workspace-scoped query must include `workspace_id = $workspaceId` or an equivalent ownership join constrained by `workspaceId`. Every write must validate that related IDs belong to the same workspace before commit.

Required enforcement rules:

- Workspace-scoped reads filter by `workspace_id`.
- Workspace-scoped writes insert the route-derived `workspaceId`.
- Cross-workspace foreign references must fail before commit.
- Not-found responses must not reveal whether an ID exists in another workspace.
- Repository tests must include `workspace-a` and `workspace-b` fixtures for each implemented slice.

## 7. ErrorModel mapping policy

DB-backed implementation must preserve the existing ErrorModel. Repository and service layers must map database outcomes consistently:

- missing rows -> existing not-found ErrorModel shape;
- validation failures -> existing validation ErrorModel shape;
- permission failures remain guard/RBAC failures, not repository driver errors;
- uniqueness/idempotency conflicts -> existing conflict ErrorModel shape;
- unexpected database failures -> generic internal error shape without leaking SQL details.

Raw SQL errors, constraint names, connection strings, secrets, and stack traces must not be exposed in API responses.

## 8. Idempotency inside DB transactions

Idempotency must be enforced inside the same database transaction as the protected write.

Required pattern for future write slices:

1. Begin transaction.
2. Look up the idempotency key scoped by workspace, endpoint, actor, and operation where applicable.
3. Compare stored payload hash with the incoming payload hash.
4. If the same key and same payload already succeeded, return the recorded safe result.
5. If the same key has a different payload hash, return `IDEMPOTENCY_CONFLICT` using the existing ErrorModel.
6. If no key exists, perform the write and record the idempotency result in the same transaction.
7. Commit.

No idempotent write may record the key outside the transaction that performs the business write.

## 9. Audit event writing policy

Sensitive writes must create audit placeholder/events consistent with Sprint 1-4 and Patch 002 behavior. Audit events tied to business writes must be written in the same transaction as the business mutation unless the approved behavior explicitly requires independent evidence logging.

Audit events must include:

- workspace scope from the route context;
- actor/user where available;
- event type using the existing event naming style;
- target resource identifiers;
- non-secret metadata only.

Audit events remain evidence only and must not become business state or billing/invoice state.

## 10. Test isolation strategy

DB-backed tests must isolate database state so one test cannot affect another.

Acceptable strategies for later implementation PRs:

- transaction-per-test with rollback;
- isolated schema/database per test worker;
- deterministic setup and teardown owned by the test harness.

Required guarantees:

- no manual database edits count as test evidence;
- tests must run in CI;
- migration and migration retry verification must keep passing;
- workspace isolation fixtures must include at least two workspaces;
- tests must prove ErrorModel consistency, tenant isolation, and RBAC compatibility for each migrated slice.

The first read-path slice must not destabilize existing Sprint 0/1/2/3/4 or Patch 002 tests.

## 11. First allowed implementation slice

The first allowed implementation slice is limited to Workspace/Membership/RBAC read path only.

Allowed in that slice after review:

- DB connection scaffolding required for read access.
- `WorkspaceRepository` read methods.
- `MembershipRepository` read methods.
- `RbacRepository` or equivalent permission read methods if needed.
- Tests proving DB-backed read behavior, tenant isolation, membership allow/deny, and ErrorModel compatibility.

Not allowed in the first slice:

- campaign persistence;
- brief persistence;
- media persistence;
- approval/publish/evidence persistence;
- report persistence;
- Patch 002 runtime persistence;
- write-path replacement;
- new endpoints;
- feature expansion;
- Sprint 5 work.

The first slice must be reversible and must coexist with the current in-memory runtime baseline unless a separate reviewed plan approves switching the read path.

## 12. Rollback strategy per slice

Every DB-backed implementation slice must include a rollback strategy before merge.

Minimum rollback requirements:

- Keep slice changes small and domain-bounded.
- Avoid wholesale `src/router.js` or `src/store.js` rewrites.
- Keep migration order unchanged unless the slice explicitly requires a reviewed migration change.
- Use adapter boundaries so a slice can be reverted without changing unrelated domains.
- Document any runtime switch or feature flag used during transition.
- If tenant isolation, ErrorModel compatibility, or migration retry fails, do not merge the slice.

Rollback is not a substitute for correctness; it is a containment mechanism for incremental migration.

## 13. Explicit NO-GO boundaries

The following remain explicitly NO-GO under this contract:

- Pilot.
- Production.
- Sprint 5 coding.
- Frontend implementation.
- AI providers or AI-agent execution.
- Auto-publishing.
- Paid execution.
- Feature expansion.
- External provider execution.
- Live sync execution.
- DB-backed persistence beyond the reviewed first slice.

This contract does not approve any new product scope.

## 14. CI hygiene note: Node.js 20 deprecation warning

The CI warning about Node.js 20 deprecation is acknowledged as CI hygiene debt. It does not change the DB-backed repository architecture contract.

Do not change the GitHub Actions workflow in this PR. Any workflow/runtime version update must be handled in a separate CI hygiene PR with its own verification.

## Final decision

- DB-backed Repository Architecture Contract: GO.
- DB-backed implementation: NO-GO.
- First allowed implementation slice: Workspace/Membership/RBAC read path only, after review.
- Sprint 5 coding: NO-GO.
- Pilot: NO-GO.
- Production: NO-GO.
