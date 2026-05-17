# Nashir UI Surface After Backend Modes Gate

Date: 2026-05-17

## Current Verified Backend Status

- Campaign list/create/read-by-id routes exist.
- Evidence submit/list/read-by-id routes exist.
- Campaign and evidence repository modes exist and default to `in_memory`.
- Repository modes are explicit only and independently controlled.
- `docs/nashir_openapi_patch.yaml` wording is mode-agnostic.
- No Nashir UI surface is currently approved for product use.

## UI Surface Decision

`prototype/` remains deprecated/experimental and must not be used as product UI authority.

An existing standalone static read-only Nashir shell exists under `ui/nashir/`, but it is not routed, not served by backend, has no API behavior, and is not approved as a product UI surface. A future implementation PR must explicitly create or designate the approved UI surface before product UI work proceeds.

This PR does not approve UI implementation.

## Candidate First UI Scope

- Campaign list.
- Campaign create.
- Campaign read-by-id / campaign detail.
- Evidence submit.
- Evidence list.
- Evidence read-by-id.
- Basic loading, empty, and error states.
- 401/403/404 display behavior consistent with backend.
- No campaign update/delete.
- No approval, publishing, or readiness mutation flows.

## Future Allowed Files

Future implementation may include:

- a new approved UI surface directory if separately implemented;
- route/page/component files for Nashir campaign/evidence views;
- minimal UI tests or smoke tests;
- `docs/03_decision_log.md`;
- `docs/17_change_log.md`.

If `ui/nashir/` is reused, a future PR must explicitly designate it as the approved implementation surface and define exact files, boundaries, and verification.

## Future Forbidden Scope

- `prototype/` usage as product authority.
- SQL/migrations.
- OpenAPI YAML.
- generated clients unless separately gated.
- package changes unless separately justified and gated.
- backend runtime changes unless separately scoped.
- campaign update/delete.
- approval flow.
- publishing flow.
- readiness scoring changes.
- lifecycle expansion beyond submitted evidence.
- MVP, Pilot, or Production readiness claims.

## Required Future Tests / Checks

- UI can list campaigns.
- UI can create campaign.
- UI can read campaign detail.
- UI can submit evidence.
- UI can list evidence.
- UI can read evidence detail.
- UI handles loading state.
- UI handles empty state.
- UI handles 401 unauthenticated.
- UI handles 403 forbidden.
- UI handles non-disclosing 404.
- UI does not expose cross-workspace data.
- UI does not use `prototype/` as authority.

## GO / NO-GO

- GO only for documenting the future UI surface path.
- NO-GO for implementing UI in this PR.
- NO-GO for modifying `prototype/`.
- NO-GO for claiming MVP, Pilot, or Production readiness.

## Recommended Next PR

Recommended next PR: documentation-only UI surface creation/selection.

That PR should decide whether to designate `ui/nashir/` as the approved future implementation surface or create a new approved UI surface, and it must name exact files and verification before any UI implementation slice begins.
