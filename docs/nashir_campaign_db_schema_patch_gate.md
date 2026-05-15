# Nashir Campaign DB Schema Patch Gate

## 1. Current Verified Status

- PR #246 documented the Nashir Campaign DB Persistence Gate.
- Nashir campaigns remain in-memory.
- No `nashir_campaigns` table is active.
- No campaign repository mode is implemented.
- No campaign DB runtime switch is implemented.
- Evidence DB runtime mode remains separate and does not imply campaign DB persistence.

## 2. Future Schema Patch Candidate

Candidate future patch name:

```text
docs/marketing_os_v5_6_5_phase_0_1_schema_patch_004.sql
```

Candidate table:

```text
nashir_campaigns
```

This PR must not create the SQL file. Patch 004 must be separately implemented in a future PR.

## 3. Candidate Fields

Candidate fields for `nashir_campaigns`:

- `nashir_campaign_id` as primary identifier.
- `workspace_id`.
- `campaign_name`.
- `campaign_status`.
- `created_by_user_id`.
- `created_at`.
- `updated_at`.
- Optional fields only if already consistent with the existing in-memory Nashir campaign shape.

Do not invent unrelated marketing fields.

## 4. Candidate Constraints

- Workspace scoping must be mandatory.
- Primary key or uniqueness on `nashir_campaign_id`.
- Timestamps are required.
- `campaign_status` must be constrained to approved values.
- `created_by_user_id` must be preserved.
- No cross-workspace campaign leakage.
- No campaign update/delete scope is approved in this schema gate.

## 5. Relationship to Evidence

- Evidence DB persistence already exists through Patch 003.
- Campaign schema patch work must not break existing evidence routes.
- Do not introduce foreign key assumptions unless explicitly approved.
- If a foreign key to `nashir_evidence` or from evidence to campaigns is proposed, mark it as a decision requiring separate approval.
- Evidence non-disclosure for missing or cross-workspace campaigns must remain required.

## 6. Future Allowed Files

Future schema patch implementation scope may include:

- `docs/marketing_os_v5_6_5_phase_0_1_schema_patch_004.sql`
- `docs/07_database_schema.sql`, only if documenting future order
- `docs/03_decision_log.md`
- `docs/17_change_log.md`

## 7. Future Forbidden Scope

- Runtime code.
- Router/service/repository implementation.
- Migration activation in `scripts/db-migrate.js`.
- Workflow changes.
- OpenAPI YAML.
- Generated clients.
- Package files.
- `ui/`.
- `prototype/`.
- Campaign runtime mode implementation.
- Campaign repository implementation.
- Approval, publishing, or readiness changes.
- Update/delete campaign routes.
- MVP, Pilot, or Production readiness claims.

## 8. Required Future Tests or Verification

- SQL syntax or migration parse coverage if available.
- `npm test`.
- `npm run db:migrate:strict`, once patch activation is separately approved.
- `npm run db:migrate:retry`, once patch activation is separately approved.
- `npm run openapi:lint:strict`.
- `git diff --check`.

## 9. GO / NO-GO

```text
GO:    This PR defines the future Nashir campaign DB schema patch gate.
NO-GO: This PR adds Patch 004 SQL.
NO-GO: This PR activates Patch 004 in the migration chain.
NO-GO: This PR wires runtime behavior.
NO-GO: This PR implements a campaign repository.
NO-GO: This PR changes OpenAPI, UI, or generated clients.
NO-GO: This PR claims MVP, Pilot, or Production readiness.
```
