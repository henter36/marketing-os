# Sprint 0 Backend Baseline

This implementation adds only the Sprint 0 technical foundation:

- Node/npm application baseline
- environment configuration through `.env.example` and `src/config.js`
- AuthGuard, WorkspaceContextGuard, MembershipCheck, PermissionGuard
- unified ErrorModel responses
- RBAC role and permission seed data
- approved SQL migration wiring in the required order
- internal health and readiness endpoints
- OpenAPI contract lint checks
- Sprint 0 guard, tenant isolation, RBAC, ErrorModel, approval, and evidence protection tests

It intentionally does not implement Sprint 1+ business workflows. Campaign and asset routes are guarded placeholders used to prove tenant isolation and permission behavior.

## Commands

```bash
npm run db:migrate
npm run db:migrate:local
npm run db:migrate:strict
npm run db:seed
npm run openapi:lint
npm run openapi:lint:local
npm run openapi:lint:strict
npm test
npm run test:integration
npm run verify:local
npm run verify:strict
npm run verify
```

Local commands validate Sprint 0 wiring and warn when authoritative docs or database settings are absent. Strict commands fail when the OpenAPI file, approved SQL files, or `DATABASE_URL` are missing.

## Environment

Copy `.env.example` values into the local runtime environment as needed:

```bash
NODE_ENV=development
PORT=3000
DATABASE_URL=postgres://marketing_os:marketing_os@localhost:5432/marketing_os
```

The application uses `PORT` for the HTTP server and `DATABASE_URL` for PostgreSQL migration execution.
