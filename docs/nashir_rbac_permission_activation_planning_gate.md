# Nashir RBAC Permission Activation Planning Gate

## 1. Status

```text
Documentation status:       GO — documentation-only RBAC planning gate.
RBAC planning (docs only):  GO — candidate codes and role mapping defined for future review.
src/rbac.js modification:   NO-GO.
Route exposure:             NO-GO.
Runtime wiring:             NO-GO.
OpenAPI activation:         NO-GO.
SQL / DB access:            NO-GO.
Audit runtime:              NO-GO.
ErrorModel runtime:         NO-GO.
Pilot:                      NO-GO.
Production:                 NO-GO.
```

## 2. Purpose

This document is a documentation-only RBAC permission activation planning gate. It records the unresolved future question of whether and which Nashir permission codes should be added to `src/rbac.js`, proposes candidate codes and role mappings as NOT APPROVED planning references, and defines the prerequisites that must be satisfied before any future implementation PR may modify `src/rbac.js`.

This document does not:
- Implement any RBAC permission code.
- Modify `src/rbac.js`.
- Approve runtime wiring or route exposure.
- Approve OpenAPI activation.
- Approve SQL or DB access.
- Approve audit runtime, ErrorModel runtime, Pilot readiness, or Production readiness.

## 3. Context and Runtime Blockers

PR #161 (Nashir runtime wiring readiness gate) identified four simultaneous hard blockers preventing any runtime wiring PR from opening:

| # | Blocker | Location | State |
|---|---|---|---|
| 1 | No Nashir permission codes | `src/rbac.js` | Missing — any Nashir route call to `permissionGuard(membership, "nashir.*")` denies all users |
| 2 | No Nashir store entities | `src/store.js` | Missing — no `nashirCampaigns` or `nashirEvidence` collections exist |
| 3 | No Nashir OpenAPI path | OpenAPI contract | Missing — no `/nashir/` paths in approved OpenAPI files |
| 4 | Service/repository methods inert | `src/nashir/backend-slice0-service.js`, `src/nashir/backend-slice0-repository.js` | All methods throw `"not implemented"` |

This gate addresses Blocker 1. Blockers 2, 3, and 4 remain for separate future gates.

## 4. Unresolved Future Question

> **Should Nashir permission codes be added to `src/rbac.js`, and if so, which exact codes and role mappings?**

This question is not resolved by this document. It is recorded here as an open question requiring a separately approved implementation gate before any modification to `src/rbac.js` may proceed.

## 5. Inspection of Existing `src/rbac.js` Style

This section records observations from reading `src/rbac.js`. No modification is made.

### 5.1 Permission Code Style

All existing permission codes follow the pattern `<domain>.<action>`:

```
campaign.read           campaign.write
brand.read              brand.write
manual_evidence.read    manual_evidence.submit    manual_evidence.invalidate
approval.decide
audit.read
connector.read          connector.write           connector.rotate_secret
performance.read        performance.event_create  performance.snapshot_create
contact.read            contact.create            contact.update    contact.consent_update
lead_capture.read       lead_capture.create
notification_rule.read  notification_rule.write
notification_delivery.read
```

The domain prefix is always the resource name (singular or underscore-separated). The action suffix uses verbs: `read`, `write`, `create`, `update`, `submit`, `invalidate`, `decide`, `generate`, `assign`, `record`, `rotate_secret`, `event_create`, `snapshot_create`, `consent_update`.

### 5.2 Role Names

Seven system roles exist:
`owner`, `admin`, `creator`, `reviewer`, `publisher`, `billing_admin`, `viewer`

### 5.3 Role Grant Pattern

- `owner` and `admin` receive all (or nearly all) permission codes.
- `creator` receives authoring and content creation codes.
- `reviewer` receives read and approval decision codes.
- `publisher` receives read, publish, and evidence submission codes.
- `billing_admin` receives billing, usage, and cost codes only — no product authoring.
- `viewer` receives read-only codes across all product domains.

### 5.4 `hasPermission` Mechanism

`hasPermission(roleCode, permissionCode)` returns `true` only if `permissionCode` is explicitly listed in `rolePermissions[roleCode]`. An unregistered permission code returns `false` for all roles, causing `permissionGuard` to throw `PERMISSION_DENIED` (403) for every request. This confirms that adding a Nashir route before adding Nashir permission codes to `src/rbac.js` would deny all users regardless of role.

## 6. Candidate Nashir Permission Codes (NOT APPROVED)

The following codes are candidate future additions to `src/rbac.js`. They are proposed for review only. None are approved. Each requires a separately approved implementation gate before it may be added.

| Candidate Code | Proposed Action | Rationale |
|---|---|---|
| `nashir.campaign.read` | Read Nashir campaign records, readiness state, and scoring | Required for any GET route; aligns with existing `campaign.read` pattern |
| `nashir.campaign.write` | Create or update a Nashir campaign intake record | Required for POST/PATCH routes; aligns with `campaign.write` pattern |
| `nashir.evidence.submit` | Submit manual publishing evidence for a Nashir campaign | Scoped to evidence submission; aligns with `manual_evidence.submit` precedent |
| `nashir.approval.decide` | Approve or reject a Nashir campaign for manual publishing | Restricted to reviewer/approver actors; aligns with `approval.decide` precedent |

Additional candidate codes that may be needed depending on final Nashir Core V1 scope:

| Candidate Code | Proposed Action | Rationale |
|---|---|---|
| `nashir.evidence.read` | Read submitted evidence records | Separate read gate if evidence is access-controlled beyond campaign read |
| `nashir.approval.read` | Read approval state and history | Separate read gate if approval state is access-controlled beyond campaign read |
| `nashir.intake.create` | Create a new Nashir campaign intake record | Candidate if intake creation is scoped separately from campaign write (see Q4 in 7.2) |

These additional codes are lower-priority candidates. They should be resolved alongside the primary four in the same implementation gate.

## 7. Candidate Role Mapping (NOT APPROVED)

The following table proposes how candidate codes might map to existing roles. This is planning-level only. No mapping is approved. The final mapping must be reviewed against the approved Nashir Role & Permission Matrix (`docs/nashir_role_permission_matrix.md`) before any implementation PR opens.

Primary candidates (NOT APPROVED):

| Role | `nashir.campaign.read` | `nashir.campaign.write` | `nashir.evidence.submit` | `nashir.approval.decide` |
|---|---|---|---|---|
| `owner` | YES | YES | YES | YES |
| `admin` | YES | YES | YES | YES |
| `creator` | YES | YES | NO | NO |
| `reviewer` | YES | NO | NO | YES |
| `publisher` | YES | NO | YES | NO |
| `billing_admin` | NO | NO | NO | NO |
| `viewer` | YES | NO | NO | NO |

Secondary candidates (NOT APPROVED):

| Role | `nashir.evidence.read` | `nashir.approval.read` | `nashir.intake.create` |
|---|---|---|---|
| `owner` | YES | YES | YES |
| `admin` | YES | YES | YES |
| `creator` | YES | YES | YES |
| `reviewer` | YES | YES | NO |
| `publisher` | YES | YES | NO |
| `billing_admin` | NO | NO | NO |
| `viewer` | YES | YES | NO |

### 7.1 Rationale

- `creator` can read and create Nashir campaign intake records but cannot submit evidence or decide approvals — matching how `creator` has `campaign.write` but not `approval.decide`.
- `reviewer` can read campaigns and decide approvals but cannot author or submit evidence — matching existing `reviewer` grants.
- `publisher` can read campaigns and submit evidence but cannot author campaigns or decide approvals — matching existing `publisher` grants for `manual_evidence.submit` and `publish_job.create`.
- `billing_admin` has no product authoring scope — consistent with existing pattern.
- `viewer` has read-only access — consistent with existing `viewer` pattern across all product domains.

### 7.2 Open Questions for Future Gate

Before any implementation PR may add these codes to `src/rbac.js`, the following questions must be resolved:

1. Should `nashir.campaign.read` be separate from the existing `campaign.read` permission? If Nashir campaigns reuse the same `Campaign` entity, the existing `campaign.read` code may suffice. If Nashir campaigns are a distinct concept, a separate code is needed.
2. Should `nashir.evidence.submit` align with `manual_evidence.submit` or be a new code? If Nashir evidence maps to the existing `ManualPublishEvidence` entity, the existing permission code may suffice.
3. Should `nashir.approval.decide` align with the existing `approval.decide` or be a new code? This depends on whether Nashir approval state is the same entity as `ApprovalDecision` or a new Nashir-specific approval record.
4. Is `nashir.campaign.write` sufficient for intake creation, or should intake creation be a separate `nashir.intake.create` code?
5. Are tenant isolation rules for Nashir RBAC identical to existing workspace-scoped guards, or do they require additional constraints?

These open questions must be documented and resolved in a future implementation gate. This planning document does not resolve them.

## 8. Prerequisites Before Any `src/rbac.js` Implementation PR

Before any PR that adds Nashir permission codes to `src/rbac.js` may open, all of the following must be satisfied and documented in a separately approved gate:

1. **Exact permission codes finalized** — the complete list of Nashir permission codes, with names confirmed against the entity and action naming conventions in `src/rbac.js`, must be approved. The open questions in Section 7.2 must be resolved.

2. **Exact role mapping approved** — the mapping of each Nashir permission code to each of the seven system roles must be reviewed against `docs/nashir_role_permission_matrix.md` and approved explicitly.

3. **Denial behavior specified** — the expected HTTP status, error code, and error message for each denial scenario must be specified. These must align with the existing `PERMISSION_DENIED` (403) behavior in `src/guards.js`.

4. **Tests for allowed and denied roles** — a proposed test plan covering both the allowed and denied roles for each permission code must be approved before implementation. Tests must verify that `hasPermission(roleCode, permissionCode)` returns the expected boolean for every `(role, code)` pair.

5. **No route exposure before OpenAPI** — adding Nashir permission codes to `src/rbac.js` does not itself expose routes. Route exposure requires a separately approved OpenAPI activation gate. These two gates are independent but both must be approved before any route is added to `src/router.js`.

6. **No runtime wiring before both RBAC and OpenAPI gates are approved** — neither this gate nor any future RBAC implementation PR authorizes runtime wiring. A separate runtime wiring implementation gate must explicitly name the allowed files, verification commands, and rollback/no-go criteria.

7. **Latest Strict Verification success** — the most recent Strict Verification run on main must pass before any implementation PR for `src/rbac.js` opens.

## 9. Candidate Future Allowed Files (NOT APPROVED)

The following files are candidate future modification targets for RBAC implementation. They are listed for planning reference only. None are approved for modification by this document.

| File | Change Category | Status |
|---|---|---|
| `src/rbac.js` | Add Nashir permission codes to `permissions` array; add codes to `rolePermissions` mapping | NOT APPROVED |
| `test/nashir-rbac-permission-mapping.test.js` | New focused test file verifying Nashir permission grants and denials per role | NOT APPROVED |

No other files are in scope for the RBAC implementation PR. In particular:
- `src/router.js` is NOT in scope for the RBAC PR.
- `src/nashir/backend-slice0-service.js` is NOT in scope for the RBAC PR.
- `src/nashir/backend-slice0-repository.js` is NOT in scope for the RBAC PR.
- `src/store.js` is NOT in scope for the RBAC PR.
- OpenAPI files are NOT in scope for the RBAC PR.

## 10. Explicit NO-GO List

The following are explicitly NO-GO for this PR and for any future PR until a separately approved gate document permits each item:

- `src/rbac.js` modification of any kind.
- Route exposure — no Nashir route may be registered in `src/router.js`.
- Runtime wiring of any kind (router, server, store, DB, guards, config).
- OpenAPI activation — no Nashir path or schema added to the active OpenAPI contract.
- SQL — no SQL schema change, migration, or query.
- DB access — no connection, pool, or query in any Nashir file.
- Audit runtime — no audit event emitted at runtime.
- ErrorModel runtime — no ErrorModel response constructed for Nashir at runtime.
- Generated clients — no generated client update.
- Package changes — no `package.json` or lockfile modification.
- Workflow changes — no CI/CD workflow modification.
- Migration changes — no migration file added or modified.
- Prototype — no `prototype/` file usage or modification.
- Pilot readiness — not approved.
- Production readiness — not approved.

## 11. Required Guards

### 11.1 Active Roadmap Guard — PR #155

PR #155 is the required Nashir active roadmap guard. No new Nashir PR may proceed without satisfying the conditions established in PR #155.

### 11.2 Repository-Level Guard — PR #156

PR #156 is the required repository roadmap index and governance guard. No PR of any kind may proceed without satisfying the conditions established in PR #156.

## 12. GO / NO-GO Decision

```text
GO:     Documentation-only RBAC permission activation planning gate.
GO:     Existing src/rbac.js style inspected and recorded — no modification made.
GO:     Unresolved future question recorded — RBAC codes not answered YES or NO.
GO:     Candidate Nashir permission codes defined as NOT APPROVED.
GO:     Candidate role mapping defined as NOT APPROVED.
GO:     Open questions for future gate recorded.
GO:     Prerequisites for any future src/rbac.js implementation PR defined.
GO:     Candidate future allowed files listed as NOT APPROVED.
GO:     Explicit NO-GO list recorded.
NO-GO:  src/rbac.js modification.
NO-GO:  Route exposure.
NO-GO:  Runtime wiring.
NO-GO:  OpenAPI activation.
NO-GO:  SQL or DB access.
NO-GO:  Audit runtime.
NO-GO:  ErrorModel runtime.
NO-GO:  Generated clients.
NO-GO:  Package, workflow, or migration changes.
NO-GO:  Prototype usage.
NO-GO:  Pilot readiness.
NO-GO:  Production readiness.
NO-GO:  Any next Nashir PR without satisfying PR #155 and PR #156 guard conditions.
NO-GO:  Any src/rbac.js change without a separately approved implementation gate.
NO-GO:  Any route exposure before both RBAC and OpenAPI gates are approved.
```
