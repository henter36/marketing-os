# Nashir API Types

Generated TypeScript declaration types for the Nashir V1 API.

## Source

**`docs/nashir_v1_openapi.yaml`** (canonical Nashir V1 OpenAPI — marketing-os)

This is the only valid generation input. Do not use `docs/nashir_openapi_patch.yaml`
or `nashir-ui-prototype/docs/nashir_v1_openapi.yaml` as generation inputs.

## Regenerate

```bash
npm run generate:nashir-types
```

## Check freshness

```bash
npm run generate:nashir-types:check
```

Exits non-zero if the committed types are stale (i.e., the source YAML has changed
since the types were last generated).

## Scope

- Nashir store profile and product read-only surface (Backend Slice 0)
- Nashir campaign / readiness / evidence surface
- Error model

## Excluded

- No runtime client is generated.
- No fetch, axios, or HTTP helper functions are included.
- No UI integration is implied by these types.
- No Store/Product write operations are represented.
- No Creator Studio, publishing, integrations, or provider/model runtime types.
- No secrets, credentials, tokens, or vault references are included.

## Maintainer note — hardcoded template

This generator uses a **zero-dependency hardcoded declaration template**. It is
**not** a dynamic OpenAPI-to-TypeScript parser.

`--check` detects a stale source hash but does **not** automatically infer new
TypeScript declarations from changed YAML content.

If `docs/nashir_v1_openapi.yaml` is updated (new schemas, changed fields, or new
operations), maintainers must **also update the template output** in
`scripts/generate-nashir-types.js` to reflect those changes, then run:

```bash
npm run generate:nashir-types
```

Failure to update the template means `--check` will fail (stale hash), and the
generated types will not reflect the new contract.

## Governance

These types are generated from `docs/nashir_v1_openapi.yaml` and reviewed under
`docs/nashir_generated_types_input_update_planning_gate.md` (D-160) and
`docs/nashir_generated_types_input_update_review_gate.md` (D-161).

Regeneration is required whenever `docs/nashir_v1_openapi.yaml` changes.
