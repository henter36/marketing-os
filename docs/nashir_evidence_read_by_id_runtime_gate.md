# Nashir Evidence Read-By-ID Runtime Gate

## 1. Status

```text
Task classification:           Documentation-only / implementation gate / verification-only.
Target future route:           GET /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/evidence/{evidenceId}
Current verified gap:          OpenAPI documents the route; runtime does not implement it.
This PR implementation status: NO runtime implementation.
DB wiring:                     NO-GO.
Patch 003 activation:          NO-GO.
UI/prototype changes:          NO-GO.
OpenAPI YAML changes:          NO-GO.
Generated client changes:      NO-GO.
Pilot:                         NO-GO.
Production:                    NO-GO.
```

## 2. Purpose

Close OpenAPI/runtime drift for GET evidence-by-id by authorizing and constraining a future runtime PR for only:

```text
GET /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/evidence/{evidenceId}
```

This document does not implement the route.

## 3. Current Verified Gap

- `docs/nashir_openapi_patch.yaml` documents the GET evidence-by-id route.
- Runtime does not implement the GET evidence-by-id route.
- This PR does not implement the route.

## 4. Future Implementation Scope

The future implementation PR may:

- Add only the GET evidence-by-id runtime route.
- Use existing in-memory Nashir Slice 0 behavior only.
- Preserve the existing router -> service -> repository layering.
- Preserve tenant isolation through route-derived workspace and campaign scope.
- Preserve generic `404 Not Found` non-disclosure for missing evidence, cross-workspace evidence, and cross-campaign evidence.
- Preserve current permission behavior.

The future implementation PR must not:

- Add DB wiring.
- Activate Patch 003.
- Add UI or prototype work.
- Modify OpenAPI YAML.
- Modify generated clients.
- Add broader evidence lifecycle transitions.

## 5. Allowed Files for Future Implementation PR

- `src/router.js`
- `test/nashir-route.test.js`
- `src/nashir/backend-slice0-service.js`
- `src/nashir/backend-slice0-repository.js`

The future implementation must preserve the established router → service → repository layering and tenant isolation. It must not bypass the service/repository boundary by reading store internals directly from the router.

## 6. Forbidden Files for Future Implementation PR

- SQL files
- migrations
- OpenAPI YAML files
- workflows
- package files
- generated clients
- `ui/`
- `prototype/`

## 7. Required Tests for Future PR

- `200` for existing evidence.
- `404` for missing evidence.
- `404` for cross-workspace evidence.
- `404` for cross-campaign evidence.
- `404` for unknown workspace (non-disclosure).
- `404` for missing active membership (non-disclosure).
- `403` for valid active member without `nashir.campaign.read` permission.
- `401` for unauthenticated caller.
- `401` for invalid user.
- Permission behavior remains unchanged.

## 8. Verification Commands

```text
npm test
npm run openapi:lint:strict
git diff --name-only
git diff --check
```

## 9. GO / NO-GO

```text
GO:    Future PR adds only the listed GET evidence-by-id route within the listed files and behavior.
NO-GO: Future PR attempts DB wiring.
NO-GO: Future PR activates Patch 003.
NO-GO: Future PR adds UI work.
NO-GO: Future PR edits OpenAPI YAML.
NO-GO: Future PR updates generated clients.
NO-GO: Future PR adds broader lifecycle transitions.
```
