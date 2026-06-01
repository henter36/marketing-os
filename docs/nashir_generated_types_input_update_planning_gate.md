# Nashir Generated Types Input Update Planning Gate

| Field | Value |
|---|---|
| Gate type | Generated types input update planning gate — documentation only |
| Status | Draft |
| Date | 2026-06-01 |
| Scope | Plans the future generated types input/update step after the canonical Nashir V1 OpenAPI source was established in PR #274 and reviewed in PR #275 |
| Prerequisite gates | `docs/nashir_openapi_canonical_source_migration_review_gate.md` — merged (PR #275); `docs/nashir_v1_openapi.yaml` — established (PR #274) |
| Generated types created | NO |
| Generated clients created | NO |
| Package changes | NO |
| UI integration | NO |
| Runtime changes | NO |

---

## 1. Status

This is a documentation-only planning gate.

**No generated types are approved in this PR.**

**No generated clients are approved in this PR.**

**No package changes (package.json, package-lock.json, or npm dependencies) are approved in this PR.**

**No UI integration is approved in this PR.**

**No runtime behavior changes are approved in this PR.**

This gate answers:

> How should the future Nashir generated types be produced, from what source, to what destination, using what tooling, and with what governance constraints?

---

## 2. Current Approved Inputs

### Verified facts

| Fact | Status |
|---|---|
| `docs/nashir_v1_openapi.yaml` is canonical Nashir V1 OpenAPI source | **CONFIRMED** — established by D-158 / PR #274 |
| PR #274 established canonical source | **CONFIRMED** — merged |
| PR #275 reviewed and accepted canonical source migration (D-159) | **CONFIRMED** — merged |
| OpenAPI lint passes in strict and non-strict modes | **CONFIRMED** — 97 (non-strict) and 104 (strict) declared permissions checked |
| No generated type artifacts exist | **CONFIRMED** — no `generated/`, `src/generated/nashir-api*`, or equivalent path in repository |
| No generated clients exist | **CONFIRMED** |
| `package.json` has no OpenAPI generation dependency or script | **CONFIRMED** — only `pg` runtime dependency; no devDependencies; no generation script in `scripts` block |
| Current scripts: `openapi:lint`, `openapi:lint:strict`, `test`, `test:integration`, `db:seed`, `db:migrate:*`, `verify:*` | **CONFIRMED** — no generation entrypoint exists |

---

## 3. Problem Statement

1. **Generated types are required before safe UI API integration.** Without canonical TypeScript types derived from `docs/nashir_v1_openapi.yaml`, the UI may invent field names, invent request/response shapes, or drift from the implemented contract. Any UI call that invents fields outside the canonical OpenAPI is a governance violation.

2. **Generating a full runtime client too early introduces risk.** A runtime client (fetch, axios, etc.) is behavioral code that executes at runtime, not just type annotations. Adding a runtime client before backend/UI integration gates are ready can create untested runtime paths and implicit contract assumptions.

3. **Adding generator tooling without planning alters project governance.** The current repository has one runtime dependency (`pg`) and no devDependencies. Adding a generator package changes the dependency surface, CI behavior, and repository conventions in ways that require explicit governance review.

4. **The generated artifact destination must be stable before any generated file is committed.** Placing generated files under `src/` implies runtime co-ownership. Placing them under `docs/` is non-standard for type artifacts. A clear, reviewable path is required.

5. **Using any source other than `docs/nashir_v1_openapi.yaml` reintroduces duplicate-contract risk.** D-156 through D-159 resolved this risk specifically by establishing a single canonical source. Using nashir-ui-prototype YAML or `nashir_openapi_patch.yaml` as generation input would undo that resolution.

---

## 4. Decision Options

### Option A — Generate types only from `docs/nashir_v1_openapi.yaml`

Add a TypeScript type generation script targeting the canonical Nashir V1 OpenAPI source. Output: type annotation file only. No fetch/client behavior. No UI integration.

### Option B — Generate full client + types

Generate both TypeScript types and a runtime fetch client from `docs/nashir_v1_openapi.yaml`. Output: type file + client module.

### Option C — Do not generate types; keep manual contracts

Skip generation entirely. UI and backend continue to share contracts via documentation, the OpenAPI YAML, and manual type annotations only.

### Option D — Generate types inside nashir-ui-prototype

Run generation inside nashir-ui-prototype from its own YAML. marketing-os does not own the generated output.

### Option E — Defer all generated artifacts

Defer the decision until UI integration planning is further along. Keep generated types as a future open item.

---

## 5. Option Evaluation

| Criterion | Option A | Option B | Option C | Option D | Option E |
|---|---|---|---|---|---|
| Contract safety | HIGH — single source, types only | MEDIUM — client adds runtime behavior | LOW — manual drift risk | LOW — wrong source | LOW — growing drift |
| Backend governance | STRONG — owned by marketing-os | STRONG | N/A | WEAK — UI repo owns | N/A |
| UI readiness | ENABLES safely | ENABLES — but premature client | NO GUARANTEE | WRONG AUTHORITY | DEFERRED |
| CI impact | LOW — type generation is lightweight | MEDIUM — client adds build step | NONE | NONE in marketing-os | NONE |
| Runtime risk | NONE — types are compile-time | MEDIUM — client has runtime behavior | NONE | NONE in marketing-os | NONE |
| Package/dependency impact | LOW — one devDependency | MEDIUM — heavier client generator | NONE | NONE in marketing-os | NONE |
| Maintainability | HIGH — regenerate on YAML change | MEDIUM — more surface to maintain | LOW — manual effort | LOW — diverges from backend | LOW — growing gap |
| V1 scope control | STRONG | OVERREACH for V1 | ACCEPTABLE | OUT OF SCOPE | ACCEPTABLE |
| Duplicate contract risk | LOW — canonical source only | LOW — canonical source only | MEDIUM | HIGH — wrong source | MEDIUM — deferred |
| **Verdict** | **RECOMMENDED** | **DEFER** | **REJECTED** | **REJECTED** | **REJECTED** |

---

## 6. Recommended Decision

**Recommend Option A: Generate TypeScript types only from `docs/nashir_v1_openapi.yaml`.**

Rationale:
1. Types are compile-time annotations only; they introduce no runtime behavior.
2. A single canonical source (`docs/nashir_v1_openapi.yaml`) eliminates duplicate-contract risk.
3. marketing-os owns the generation — keeping the generated artifact under backend governance.
4. The scope is minimal and reviewable in a dedicated implementation gate.
5. Runtime client generation is premature in V1 and is explicitly deferred.

### Clarifications — this planning gate does NOT

- Generate any types.
- Modify `package.json` or add any npm dependency.
- Write or run any generator script.
- Change any OpenAPI YAML, runtime file, test, or configuration.

---

## 7. Future Generated Types Source

| Source | Authorized as generation input? | Notes |
|---|---|---|
| `docs/nashir_v1_openapi.yaml` in marketing-os | **YES — only approved input** | Single canonical source established by D-158 |
| `docs/nashir_openapi_patch.yaml` in marketing-os | **NO** | Historical Slice 0 patch; not canonical |
| `nashir-ui-prototype/docs/nashir_v1_openapi.yaml` | **NO** | Read-only reference only after D-156; must not be used as generation input |
| Any other OpenAPI source | **NO** | Only the canonical marketing-os file is approved |

**Single-source rule:** The generated artifact must be reproducible by running the generation tool against `docs/nashir_v1_openapi.yaml` with no other OpenAPI input. If the output differs, the artifact must be regenerated.

---

## 8. Future Generated Types Destination Strategy

### Candidate paths

| Path | Assessment |
|---|---|
| `src/generated/nashir-api-types/` | Keeps generated files near implementation; but placing under `src/` implies runtime ownership too early |
| `generated/nashir-api-types/` | Top-level `generated/` clearly separates from runtime src; reviewable; conventional for generated artifacts |
| `packages/nashir-api-types/` | Suitable for publishable packages; premature for V1 |
| `docs/generated/` | Non-standard for type artifacts; not recommended |

### Recommended future destination

```text
generated/nashir-api-types/
```

**Reason:**
- Clearly separates generated artifacts from runtime source files.
- A top-level `generated/` directory is reviewable and conventional.
- Does not imply runtime client behavior or UI integration.
- Easy to gitignore, regenerate, or relocate without touching `src/`.

**Note:** The exact destination is subject to confirmation in the implementation gate. If repository conventions disagree, the implementation gate must resolve the path before any file is committed.

---

## 9. Future Tooling Strategy

### Current state (verified)

- `package.json`: one runtime dependency (`pg`), no devDependencies, no generation script.
- No OpenAPI TypeScript generator is installed.

### Future implementation gate must choose exactly one strategy

| Strategy | Notes |
|---|---|
| Add a devDependency + `npm run generate:nashir-types` script | Explicit, reviewable, CI-safe; preferred approach |
| Use a minimal checked-in generator script if justified | Only if a dependency-free approach is approved in the gate; must not be ad hoc |
| Use an existing internal script if one exists | No such script exists today |

### Requirements for tooling choice

- Tool class: **TypeScript type generation only** in the first implementation step.
- No runtime client generation in the first step.
- Generation must be deterministic: same YAML in → same types out.
- Generator must not introduce broad new `devDependencies` beyond what is required for type generation.
- The chosen tool must be explicitly named and justified in the implementation gate.

### Not approved in this planning gate

- Package changes of any kind.
- Generator scripts of any kind.
- Any generation tool installation.

---

## 10. Future Implementation Gate Allowed Files

When the Generated Types Input Update Implementation Gate is opened, candidate files may include:

| File / Path | Purpose | Status |
|---|---|---|
| `generated/nashir-api-types/` | Generated TypeScript type artifact(s) | CANDIDATE — destination pending implementation gate confirmation |
| `package.json` | Add devDependency + generation script | CANDIDATE — requires explicit gate approval; must list exact package name and version |
| `package-lock.json` | Updated lock file | CANDIDATE — follows package.json change |
| `scripts/generate-nashir-types.*` | Optional generation script if devDependency-free approach is approved | CANDIDATE — only if explicitly justified |
| `docs/03_decision_log.md` | Record the generation decision | CANDIDATE |
| `docs/17_change_log.md` | Record generation implementation | CANDIDATE |
| A focused test file (if needed) | Verify generated artifact is current/not stale | CANDIDATE — only if clearly required |

**Not approved now:**
- `package.json` changes are not approved in this planning gate.
- Generated files are not approved in this planning gate.
- The future gate must re-approve exact allowed files before implementation.

---

## 11. Required Future Verification

The future implementation gate must verify:

```bash
npm run openapi:lint
npm run openapi:lint:strict
npm test
npm run verify:strict
# Generation freshness check (if implemented):
# e.g., regenerate types and confirm no diff against committed artifact
```

If `DATABASE_URL` is missing:
```text
db:migrate:strict blocked by missing DATABASE_URL — environment constraint, not code
```

---

## 12. Generated Artifact Rules

Future generated artifacts must satisfy all of the following:

1. **Source:** derived only from `docs/nashir_v1_openapi.yaml` — no other input.
2. **Scope:** TypeScript type annotations only in the first slice; no runtime fetch/client behavior.
3. **No secrets:** must not include credentials, vault references, API keys, or tokens.
4. **No internal DB fields:** must not expose snake_case DB-only fields (e.g., `store_profile_id`, `product_id` — use camelCase contract fields only).
5. **No write operations:** must not introduce Store/Product POST/PUT/PATCH/DELETE type contracts.
6. **No forbidden routes:** must not introduce Creator Studio, publishing, integration, model/provider runtime, analytics runtime, pilot, or production contracts.
7. **Deterministic:** the same input YAML must produce the same output types; stale artifacts must fail the freshness check.
8. **Reviewable:** generated output must be committed, diffable, and reviewable in a standard PR.

---

## 13. UI Integration Boundary

- **UI API Integration remains NO-GO in this planning gate.**
- The UI API Integration Planning Gate must happen after generated types planning and implementation are reviewed.
- nashir-ui-prototype remains a read-only reference for screens and user journey — not contract authority.
- UI must not consume generated types until the Generated Types Input Update Gate is complete and reviewed.
- UI integration before generated types review may cause field drift, missing fields, or incorrect response shape assumptions.

---

## 14. Risks

| Risk | Severity | Mitigation |
|---|---|---|
| Generating full clients too early introduces runtime behavior | **HIGH** | Option A limits first step to types only |
| Adding tooling without explicit approval affects CI and governance | **MEDIUM** | This planning gate does not add tooling; implementation gate must approve exactly |
| Generating from stale or non-canonical OpenAPI reintroduces duplicate-contract risk | **HIGH** | Section 7 single-source rule; canonical YAML is the only approved input |
| Placing generated files under `src/` implies runtime ownership too early | **MEDIUM** | Recommended destination is `generated/nashir-api-types/` (top-level) |
| UI integrating before generated types review causes field drift | **HIGH** | Section 13 explicitly prohibits UI integration in this gate |
| Generated files hide schema errors if not reviewed against OpenAPI and routes | **MEDIUM** | Freshness check + PR review required in implementation gate |

---

## 15. NO-GO Boundaries

```text
NO-GO: Generated types in this PR.
NO-GO: Generated clients in this PR.
NO-GO: package.json changes in this PR.
NO-GO: package-lock.json changes in this PR.
NO-GO: npm dependency additions in this PR.
NO-GO: Generator scripts in this PR.
NO-GO: UI integration.
NO-GO: Runtime behavior changes.
NO-GO: OpenAPI YAML changes.
NO-GO: src/router.js changes.
NO-GO: scripts/openapi-lint.js changes.
NO-GO: Tests added unless separately justified; no new tests in this PR.
NO-GO: SQL or migrations.
NO-GO: Workflows.
NO-GO: Any change to nashir-ui-prototype.
NO-GO: Store/Product write routes.
NO-GO: Creator Studio backend.
NO-GO: Publishing, integrations, model/provider runtime.
NO-GO: Analytics runtime.
NO-GO: Pilot or production readiness.
```

---

## 16. GO / NO-GO Result

| Decision | Status |
|---|---|
| **This planning gate (documentation only)** | **GO** |
| Generated types in this PR | **NO-GO** |
| Generated clients in this PR | **NO-GO** |
| Package changes in this PR | **NO-GO** |
| UI integration in this PR | **NO-GO** |
| Runtime changes in this PR | **NO-GO** |
| **CONDITIONAL GO later: Generated Types Input Update Implementation Gate** | After this planning gate and a review gate are merged |
| UI API Integration Planning Gate | **NO-GO until generated types gate is complete** |

---

## 17. Recommended Next Gates

| Priority | Gate | Dependency | Purpose |
|---:|---|---|---|
| 1 | **Nashir Generated Types Input Update Review Gate** | This planning gate | Reviews this planning decision before implementation begins |
| 2 | **Nashir Generated Types Input Update Implementation Gate** | Review gate closed | Adds devDependency, generation script, and commits first generated type artifact to `generated/nashir-api-types/` |
| 3 | **Nashir Generated Types Implementation Review Gate** | Implementation gate | Reviews the generated artifact, source integrity, destination, tooling, and freshness check |
| 4 | **Nashir UI API Integration Planning Gate** | Generated types gate complete or intentionally deferred | Plans how nashir-ui-prototype UI calls marketing-os backend using canonical types |
