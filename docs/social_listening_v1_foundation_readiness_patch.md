# Social Listening V1 Foundation Readiness Patch

## Document Status

This document defines the mandatory foundation patch that must be completed before implementing Social Listening V1.

It is not a request to implement Social Listening itself.

It is a readiness gate to verify and complete the minimum platform foundations required by:

- `docs/social_listening_v1_backlog.md`
- `docs/social_listening_v1_erd.md`
- `docs/social_listening_v1_sql_ddl.md`
- `docs/social_listening_v1_openapi_patch.yaml`
- `docs/social_listening_v1_qa_suite.md`
- `docs/social_listening_v1_codex_implementation_prompt.md`

---

## Executive Decision

Social Listening V1 must not start until this foundation patch is completed or each unresolved dependency is explicitly documented as deferred with a safe fallback.

Current repository inspection shows that the project has early runnable foundations for:

- workspace context
- users
- membership checks
- RBAC guard pattern
- ErrorModel
- in-memory audit behavior
- migration wiring

But Social Listening still requires a readiness patch because:

1. `social_listening.*` permissions are not yet registered in RBAC.
2. `connector_credentials` is referenced by Social Listening design but is not confirmed as an implemented platform dependency.
3. ErrorModel naming differs between the existing implementation and the Social Listening OpenAPI patch.
4. Audit behavior exists in seed/store flow but must be confirmed against the migration/database model before Social Listening writes depend on it.

Decision: **Foundation patch required before Social Listening implementation.**

---

## Scope of This Patch

This patch may change only platform readiness files required for Social Listening.

Allowed changes:

1. Add Social Listening permissions to RBAC.
2. Map Social Listening permissions to existing roles.
3. Update RBAC seed behavior if needed.
4. Add tests for Social Listening permissions and guard behavior.
5. Verify whether connector credentials exist.
6. Decide and document the V1 connector fallback if connector credentials do not exist.
7. Align or document ErrorModel field naming compatibility.
8. Verify audit persistence path or document the minimum implementation dependency.
9. Produce a foundation readiness report.

Forbidden changes:

1. Do not implement Social Listening endpoints.
2. Do not create Social Listening tables.
3. Do not implement ingestion workers.
4. Do not implement sentiment scoring.
5. Do not implement dashboard endpoints.
6. Do not implement alerting.
7. Do not implement exports.
8. Do not add AI agents.
9. Do not add auto-publishing.
10. Do not add paid execution.
11. Do not add stock prediction or trading signals.
12. Do not refactor unrelated repository structure.

---

## Required Pre-Coding Inspection

Before editing files, Codex must inspect:

1. `README.md`
2. `package.json`
3. `src/server.js`
4. `src/router.js`
5. `router_sprint3.js`
6. `guards.js`
7. `src/guards.js` if present
8. `rbac.js`
9. `src/rbac.js`
10. `error-model.js`
11. `src/error-model.js` if present
12. `store.js`
13. `store_sprint3.js`
14. `scripts/db-seed.js`
15. `scripts/db-migrate.js`
16. Existing tests under `test/` and `test/integration/`
17. Existing SQL schema files under `docs/`

Codex must report:

- whether source files under root and `src/` are duplicated or intentionally mirrored
- which RBAC file is actually imported by the runtime
- which ErrorModel file is actually imported by the runtime
- whether `connector_credentials` exists in SQL or runtime store
- whether database-level `audit_logs` exists in approved SQL
- whether audit behavior is runtime-only or database-backed

---

## Required RBAC Permissions

Add the following permissions using the repository's existing RBAC convention:

```text
social_listening.keyword.create
social_listening.keyword.read
social_listening.keyword.update
social_listening.source.create
social_listening.source.read
social_listening.source.update
social_listening.ingestion.create
social_listening.job.read
social_listening.mention.read
social_listening.sentiment.create
social_listening.sentiment.read
social_listening.dashboard.read
social_listening.alert_rule.create
social_listening.alert_rule.read
social_listening.alert_rule.update
social_listening.alert_event.read
social_listening.alert_event.acknowledge
social_listening.export.create
social_listening.export.read
```

Do not add broad wildcard permissions unless the current RBAC model already supports and tests wildcards.

---

## Required Role Mapping

Map permissions conservatively.

### Owner

Owner receives all Social Listening permissions.

### Admin

Admin receives all Social Listening permissions unless the platform has a stricter separation for exports or connector management.

### Creator

Creator may receive:

```text
social_listening.keyword.create
social_listening.keyword.read
social_listening.keyword.update
social_listening.source.read
social_listening.job.read
social_listening.mention.read
social_listening.sentiment.read
social_listening.dashboard.read
social_listening.alert_rule.read
social_listening.alert_event.read
```

Creator should not receive export creation by default unless explicitly approved.

### Reviewer

Reviewer may receive read-oriented permissions only:

```text
social_listening.keyword.read
social_listening.source.read
social_listening.job.read
social_listening.mention.read
social_listening.sentiment.read
social_listening.dashboard.read
social_listening.alert_rule.read
social_listening.alert_event.read
```

### Publisher

Publisher may receive:

```text
social_listening.keyword.read
social_listening.source.read
social_listening.job.read
social_listening.mention.read
social_listening.sentiment.read
social_listening.dashboard.read
social_listening.alert_rule.read
social_listening.alert_event.read
social_listening.alert_event.acknowledge
```

Publisher should not receive source creation or keyword creation by default unless approved.

### Billing Admin

Billing admin should not receive Social Listening operational permissions by default.

Optional read-only access may be added only if the product owner approves usage/cost visibility ties.

### Viewer

Viewer may receive read-only permissions:

```text
social_listening.keyword.read
social_listening.source.read
social_listening.job.read
social_listening.mention.read
social_listening.sentiment.read
social_listening.dashboard.read
social_listening.alert_rule.read
social_listening.alert_event.read
```

Viewer must not receive create, update, acknowledge, ingestion, or export-create permissions.

---

## Connector Credentials Readiness Decision

Social Listening DDL references `connector_credentials` through `connector_credential_id`.

Codex must determine one of the following:

### Option A — Existing Connector Credential Domain Found

If `connector_credentials` or an equivalent secure connector credential domain already exists:

1. Reuse it.
2. Do not duplicate secrets.
3. Do not store raw tokens in Social Listening tables.
4. Document the mapping in the readiness report.

### Option B — Not Found, Safe V1 Fallback

If connector credentials do not exist, do not invent a full connector domain during this patch.

Use the following fallback decision:

1. Social Listening V1 starts with `manual_import`, `reviews`, or non-credential source records only.
2. `connector_credential_id` remains nullable.
3. Source creation requiring credentials must be blocked until connector credentials are implemented.
4. OpenAPI and QA notes must reflect this limitation before implementation.

### Option C — Connector Credential Domain Required Before V1

If the product owner decides that X/Instagram/YouTube API ingestion is mandatory in V1, Social Listening must remain blocked until a secure Connector Credential domain is designed and approved.

This patch must not create a rushed secret-storage model.

---

## ErrorModel Compatibility Decision

The current code may use fields such as:

```json
{
  "code": "ERROR_CODE",
  "message": "Message",
  "user_action": "Action",
  "correlation_id": "correlation-id"
}
```

The Social Listening OpenAPI patch may use:

```json
{
  "code": "ERROR_CODE",
  "message": "Message",
  "traceId": "trace-id",
  "details": {}
}
```

Codex must not leave this mismatch unresolved.

Allowed decisions:

1. Update Social Listening OpenAPI to match current platform ErrorModel.
2. Extend platform ErrorModel to include compatible aliases without breaking existing tests.
3. Document that Social Listening implementation must use the current platform ErrorModel and update contract accordingly.

Do not create a second ErrorModel just for Social Listening.

---

## Audit Readiness Decision

Codex must verify whether audit is:

1. database-backed through an approved `audit_logs` table, or
2. in-memory/store-only for current sprint tests.

If database-backed audit does not exist yet, Social Listening implementation must not claim production-grade audit persistence.

Minimum acceptable readiness for this patch:

- audit API/helper pattern exists or can be reused
- audit event names are known
- audit tests can assert write events in current test mode
- readiness report clearly states whether DB audit persistence exists

Do not create a parallel Social Listening audit table.

---

## Required Tests for This Patch

Add tests that prove the foundation is ready without implementing Social Listening endpoints.

Minimum test coverage:

1. `owner` has all `social_listening.*` permissions.
2. `admin` has approved Social Listening permissions.
3. `viewer` has read-only Social Listening permissions and no write/export-create permissions.
4. `creator` cannot create exports unless explicitly approved.
5. `publisher` cannot create sources unless explicitly approved.
6. `billing_admin` does not receive Social Listening operational permissions by default.
7. RBAC seed includes Social Listening permissions.
8. No Social Listening permission is missing from the approved list.
9. Runtime imports the expected RBAC file.
10. ErrorModel compatibility decision is documented.
11. Connector credential readiness decision is documented.
12. Audit readiness decision is documented.

If the current test framework cannot inspect DB seed output directly, add a script-level test that validates generated seed SQL contains all Social Listening permissions.

---

## Files Likely to Change

Expected files:

```text
src/rbac.js
rbac.js
scripts/db-seed.js         # only if required by existing pattern
test/*.test.js             # exact path depends on current test structure
docs/social_listening_v1_foundation_readiness_report.md
```

Do not change unrelated files.

If both `src/rbac.js` and root `rbac.js` exist, Codex must determine whether duplication is intentional. If both are used by different runtime paths, update both consistently. If one is stale, report it instead of silently diverging.

---

## Required Readiness Report

After completing the patch, create:

```text
docs/social_listening_v1_foundation_readiness_report.md
```

The report must include:

1. Files inspected.
2. Files changed.
3. RBAC permissions added.
4. Role mapping applied.
5. Tests added.
6. Test results.
7. Connector credentials decision.
8. ErrorModel decision.
9. Audit readiness decision.
10. Remaining blockers, if any.
11. Final Go/No-Go decision for Social Listening implementation.

---

## Acceptance Criteria

This foundation patch is accepted only if:

1. Social Listening permissions exist in RBAC.
2. Role mappings are conservative and explicit.
3. RBAC seed output includes Social Listening permissions.
4. Tests prove read/write separation for key roles.
5. Connector credential dependency is resolved or safely deferred.
6. ErrorModel mismatch is resolved or contract update is explicitly required.
7. Audit readiness is documented honestly.
8. No Social Listening endpoints or tables are implemented in this patch.
9. No forbidden Post V1 features are introduced.
10. Readiness report gives a clear Go/No-Go decision.

---

## Final Instruction to Codex

Implement this foundation readiness patch only.

Do not implement Social Listening V1 yet.

Do not create Social Listening API endpoints.

Do not create Social Listening database tables.

Do not add connector secret storage unless a secure connector credential domain already exists and is approved.

Complete RBAC readiness, connector dependency decision, ErrorModel compatibility decision, audit readiness decision, and tests first.

Only after this patch passes should Social Listening V1 implementation begin.
