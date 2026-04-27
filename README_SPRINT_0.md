# Sprint 0 Backend Baseline

This implementation adds only the Sprint 0 technical foundation:

- Node/npm application baseline
- AuthGuard, WorkspaceContextGuard, MembershipCheck, PermissionGuard
- unified ErrorModel responses
- RBAC role and permission seed data
- approved SQL migration wiring in the required order
- OpenAPI contract lint checks
- Sprint 0 guard, tenant isolation, RBAC, ErrorModel, approval, and evidence protection tests

It intentionally does not implement Sprint 1+ business workflows. Campaign and asset routes are guarded placeholders used to prove tenant isolation and permission behavior.

## Commands

```bash
npm run db:migrate
npm run db:seed
npm run openapi:lint
npm test
npm run test:integration
npm run verify
```

`npm run db:migrate` validates the approved migration order by default. Set `DATABASE_URL` to apply the approved SQL files with `psql`.
