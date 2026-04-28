# Patch 002 Activation Plan

## 1. Executive Decision

- Patch 002 activation planning: GO.
- Patch 002 activation: NO-GO until this plan is reviewed and an activation PR is explicitly approved.
- Patch 002 runtime baseline: GO as in-memory baseline.
- Sprint 5 coding: NO-GO.
- Pilot: NO-GO.
- Production: NO-GO.

This is a documentation-only activation plan. It does not activate Patch 002, modify migration order, change runtime behavior, add endpoints, or claim Pilot or Production readiness.

Current verified baseline used for this plan:

- Sprint 0/1/2/3/4 passed.
- Repository cleanup after Sprint 4 passed and merged.
- Documentation reconciliation after Sprint 4 passed and merged.
- Patch 002 reconciliation plan, implementation plan, contract hardening, runtime implementation plan, runtime baseline, and post-merge verification passed and merged.
- Latest verified main commit: `0e83cc6`.
- GitHub Actions strict verification passed on main.

## 2. Activation Scope Definition

Patch 002 activation means all of the following, and only the following:

- Add `docs/marketing_os_v5_6_5_phase_0_1_schema_patch_002.sql` to the strict migration sequence.
- Update migration verification so Patch 002 SQL is actually executed after the base schema and Patch 001.
- Prove Patch 002 migration execution is retry-safe.
- Prove Patch 002 SQL activation does not imply production DB-backed runtime readiness.

Patch 002 activation does not include:

- DB-backed repository layer.
- Production authentication.
- External provider execution.
- Live sync execution.
- Pilot.
- Production.

Patch 002 activation is therefore a database contract activation step, not a product readiness or production persistence milestone.

## 3. Current Migration State

- `scripts/db-migrate.js` currently executes base schema and Patch 001 only.
- The current strict migration order is:

```text
1. docs/marketing_os_v5_6_5_phase_0_1_schema.sql
2. docs/marketing_os_v5_6_5_phase_0_1_schema_patch_001.sql
```

- `docs/marketing_os_v5_6_5_phase_0_1_schema_patch_002.sql` exists and is contract-hardened, but it is not active in the migration runner.
- Strict migration verification currently does not prove Patch 002 activation.
- Patch 002 runtime behavior is currently an in-memory baseline only.

## 4. Preconditions Before Activation PR

A future Patch 002 activation PR must not begin until these preconditions are satisfied:

- This Patch 002 activation plan is reviewed.
- `docs/marketing_os_v5_6_5_phase_0_1_schema_patch_002.sql` already has trigger idempotency guards.
- Patch 002 OpenAPI and RBAC alignment already passed strict verification.
- Patch 002 runtime baseline passed CI.
- The activation PR modifies `scripts/db-migrate.js` only for migration order, plus report/docs if needed.
- The activation PR does not modify runtime behavior unless explicitly approved.
- The activation PR includes migration retry verification evidence.

## 5. Proposed Activation PR File Changes

A future activation PR may modify:

- `scripts/db-migrate.js`
- `docs/patch_002_activation_report.md`
- A package/script verification helper only if it is needed and explicitly justified for migration retry testing.

A future activation PR must not modify:

- `src/router.js`
- `src/store.js`
- Runtime handlers.
- OpenAPI files.
- `docs/marketing_os_v5_6_5_phase_0_1_schema_patch_002.sql`, unless a blocking migration defect is discovered and documented.
- `package.json`, unless a retry-test script is explicitly justified.
- Frontend files.

## 6. Migration Order Proposal

The proposed strict migration order for a future activation PR is:

```text
1. docs/marketing_os_v5_6_5_phase_0_1_schema.sql
2. docs/marketing_os_v5_6_5_phase_0_1_schema_patch_001.sql
3. docs/marketing_os_v5_6_5_phase_0_1_schema_patch_002.sql
```

Rules:

- Patch 002 must never run before Patch 001.
- If Patch 002 fails, activation is NO-GO.
- If retry execution fails, activation is NO-GO.

## 7. Migration Retry Test Plan

A future activation PR must provide evidence for this retry sequence:

1. Run strict migration on a clean database.
2. Run the same strict migration sequence again on the same database or an equivalent retry environment.
3. Confirm Patch 002 trigger creation does not fail on retry.
4. Confirm `CREATE TYPE`, `CREATE TABLE IF NOT EXISTS`, `CREATE INDEX IF NOT EXISTS`, and policy creation patterns remain retry-safe.
5. Confirm no duplicate trigger error occurs.
6. Confirm no duplicate permission seed failure occurs.
7. Confirm no RLS or policy creation failure occurs.

Expected activation evidence:

- `npm run db:migrate:strict` passes for the activation order.
- Retry execution of the same activation order passes.
- GitHub Actions strict verification passes on the activation PR head.

## 8. Data Model Activation Checks

Patch 002 SQL activation must preserve:

- Workspace scoping for all workspace-scoped Patch 002 tables.
- `connector_credentials` with `secret_ref` only.
- No raw secret columns.
- No standalone `notifications` table.
- `notification_rules` + `notification_deliveries` notification model.
- Append-only protections for `webhook_event_logs`, `performance_events`, `campaign_metric_snapshots`, `metric_confidence_scores`, and `contact_consents`.
- Connector credential immutability.
- `notification_deliveries.admin_notification_id` as nullable metadata unless an approved foreign key is explicitly added later.

## 9. Runtime / DB Parity Risk

- Existing Patch 002 runtime uses the in-memory store baseline.
- Activating Patch 002 SQL does not make runtime DB-backed.
- Runtime/SQL parity must be reviewed before Pilot.
- A DB-backed repository layer remains a separate future track.
- Passing migration activation does not mean production persistence readiness.

Activation should be treated as database contract readiness only. It must not be used to claim production authentication, production persistence, Pilot readiness, or Production readiness.

## 10. Rollback And Failure Policy

- If Patch 002 migration fails in CI, do not merge the activation PR.
- If retry migration fails, do not merge the activation PR.
- If Patch 002 breaks base schema or Patch 001 migration, revert the activation PR.
- Do not partially activate Patch 002.
- Do not manually edit database state as acceptance evidence.
- Do not claim activation success unless GitHub Actions strict verification and retry evidence both pass.

## 11. Verification Gates For Future Activation PR

A future activation PR must pass:

- `npm run db:migrate:strict`
- `npm run verify:strict`
- `npm run openapi:lint:strict`
- `npm test`
- `npm run test:integration`
- `npm run db:seed`
- GitHub Actions strict verification.
- Migration retry verification.

## 12. Readiness Matrix

| Area | Status |
| --- | --- |
| Patch 002 runtime baseline | GO |
| Patch 002 SQL contract | hardened |
| Patch 002 migration activation | pending plan approval |
| DB-backed runtime persistence | NO-GO |
| Production auth | NO-GO |
| Sprint 5 coding | NO-GO |
| Pilot | NO-GO |
| Production | NO-GO |

## 13. Recommended Next Step

Recommendation: Proceed to Patch 002 Activation PR after this plan is reviewed.

Reasoning:

- Patch 002 SQL has already been contract-hardened for trigger retry safety.
- Patch 002 runtime baseline has already passed as an in-memory baseline.
- Activation is narrowly defined as migration-order and retry-proof work, not runtime expansion.
- The proposed activation PR can remain conservative by changing only migration order plus activation reporting, while keeping DB-backed persistence, production auth, Pilot, and Production explicitly NO-GO.

If reviewers determine that DB-backed repository planning must precede SQL activation, activation should remain NO-GO and a separate DB-backed repository planning branch should be created.

## 14. Final Decision

- Patch 002 activation planning: GO.
- Patch 002 activation: NO-GO.
- Patch 002 runtime baseline: GO as in-memory baseline.
- Sprint 5 coding: NO-GO.
- Pilot: NO-GO.
- Production: NO-GO.

No Patch 002 activation is complete in this planning branch.
