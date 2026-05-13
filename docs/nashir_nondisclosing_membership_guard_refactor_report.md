# Nashir Non-Disclosing Membership Guard Refactor Report

## 1. Status

```text
Task classification:                 Narrow runtime refactor for Issue #187.
Issue addressed:                      Issue #187.
Runtime behavior change:              None intended.
Routes added:                         None.
OpenAPI YAML changes:                 None.
SQL/schema/migration changes:         None.
RBAC changes:                         None.
DB-backed persistence changes:         None.
Package/workflow/script changes:      None.
Generated clients:                    Not modified.
Prototype/UI:                         Not modified.
Sprint 5 / Pilot / Production:        NO-GO.
```

## 2. Approved Sources Used

- `AGENTS.md`
- `README.md`
- `docs/17_change_log.md`
- `docs/03_decision_log.md`
- `docs/nashir_status_after_create_route.md`
- `docs/nashir_create_route_implementation_report.md`
- `src/router.js`
- `src/guards.js`
- `test/nashir-route.test.js`
- `test/nashir-prewiring-contract.test.js`

## 3. Refactor Summary

Issue #187 asked to refactor the Nashir non-disclosing active membership lookup into a reusable guard/helper.

This PR adds:

```text
nonDisclosingMembershipCheck(user, workspaceId, store)
```

in `src/guards.js`, then uses that helper in `routeNashir` for all approved Nashir routes:

```text
GET /workspaces/{workspaceId}/nashir-campaigns
GET /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}
POST /workspaces/{workspaceId}/nashir-campaigns
```

No routes were added.

## 4. Behavior Preserved

The helper preserves the existing Nashir non-disclosure behavior:

- accepts `user`, `workspaceId`, and `store`;
- finds active membership in `store.memberships`;
- returns the active membership when found;
- throws a `404` ErrorModel response when active membership is missing;
- does not call `membershipCheck`, because that generic helper returns `403` for missing membership;
- preserves non-disclosure for missing membership, unknown workspace, and cross-workspace access.

Permission behavior is unchanged:

- GET routes use `permissionGuard(membership, "nashir.campaign.read")`;
- POST route uses `permissionGuard(membership, "nashir.campaign.write")`;
- valid active members without the required permission continue to receive `403`.

## 5. Scope Not Changed

This refactor does not change:

- route list;
- response shapes;
- audit event names;
- create behavior;
- ID generation;
- duplicate submission behavior;
- ErrorModel shapes;
- OpenAPI contract;
- RBAC permissions;
- SQL or DB behavior.

## 6. Remaining NO-GO

The following remain NO-GO:

- evidence routes;
- approval transitions/routes;
- scoring/readiness routes;
- publishing workflows;
- update/delete routes;
- DB-backed Nashir persistence;
- SQL/schema/migration changes;
- OpenAPI YAML changes;
- RBAC expansion;
- frontend/UI;
- generated clients;
- package/workflow/script changes;
- Sprint 5;
- Pilot;
- Production.

## 7. Verification

Required verification for this refactor:

```text
git diff --name-only
git diff --check
node --test test/nashir-route.test.js
node --test test/nashir-prewiring-contract.test.js
npm test
npm run openapi:lint:strict
```

## 8. GO / NO-GO Recommendation

GO for a narrow Issue #187 refactor PR if verification passes and changed files remain within the approved list.

NO-GO for any feature expansion, new route, SQL/OpenAPI/RBAC/package/workflow/script/migration/generated-client/prototype/UI change, Sprint 5, Pilot, or Production claim.
