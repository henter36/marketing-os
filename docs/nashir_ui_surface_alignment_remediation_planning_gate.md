# Nashir UI Surface Alignment Remediation Planning Gate

| Field | Value |
|---|---|
| Gate type | UI surface alignment remediation planning gate — documentation only |
| Status | Draft |
| Date | 2026-06-01 |
| Scope | Plans remediation after manual browser inspection found that `marketing-os /nashir/` is materially different from the desired Nashir UI experience |
| Triggered by | Manual browser inspection after PR #282 / PR #283 / PR #284 |
| UI changes in this PR | NO |
| API changes in this PR | NO |
| Backend/package/generated/OpenAPI/SQL/workflow changes | NO |
| Pilot or production readiness | NO |

---

## 1. Status

This is a documentation-only remediation planning gate.

**Triggered by manual browser inspection of `marketing-os /nashir/` after PR #282 implemented the first read-only API integration.**

**The issue is not only technical loading. The issue is UI/source-of-truth misalignment.**

**No UI changes are approved in this PR.**

**No API changes are approved in this PR.**

**No backend, package, generated, OpenAPI YAML, SQL, or workflow changes are approved in this PR.**

**No pilot or production readiness is approved.**

---

## 2. Triggering Observation

| Dimension | Result |
|---|---|
| `marketing-os /nashir/` loaded technically (HTTP 200) | YES |
| The rendered UI matched the desired Nashir UI experience | **NO — materially different** |
| Manual browser smoke may be recorded as full PASS for product acceptance | **NO** |

### Consequence

Manual browser smoke must **not** be recorded as a product UI acceptance PASS. The current state must be treated as:

| Dimension | Status |
|---|---|
| Technical HTTP load | Partial — observable but not accepted |
| Product UI alignment | **FAIL** |
| Further UI/API expansion on current surface | **NO-GO until alignment is resolved** |

The current `ui/nashir/` surface may function as a technical static API harness for development-time smoke verification, but it is not an acceptable product UI surface until it matches the approved Nashir UI direction.

---

## 3. Source of Truth Rule

The following rule is established and must be preserved across all future gates:

| Principle | Rule |
|---|---|
| Nashir product screens and journey | **Functional and UX source of truth** |
| `marketing-os` role | Backend, governance, OpenAPI, generated types, auth/RBAC, infrastructure |
| `marketing-os` product journey authority | **NOT PERMITTED** — marketing-os must not impose a different product journey or UI experience on Nashir |
| `ui/nashir/` inside marketing-os | Must either: (a) match the approved Nashir UI direction, or (b) be explicitly labeled as a temporary internal technical verification harness, not product UI |
| `nashir-ui-prototype` | Remains read-only UX/reference unless a future gate explicitly authorizes a migration or porting strategy |

---

## 4. Current Surface Assessment

| Assessment | Finding |
|---|---|
| `ui/nashir/` is being served from `marketing-os` | YES — HTTP 200 confirmed |
| `ui/nashir/` matches approved Nashir UI screens | **NO** |
| `ui/nashir/` may be used as a technical static API integration harness | YES — but must be clearly labeled and bounded, not presented as product UI |
| `ui/nashir/` is acceptable as the user-facing Nashir product UI in its current state | **NO** |
| Existing API integration in `ui/nashir/` should be expanded on current surface | **NO — NO-GO until surface role is clarified** |

The `ui/nashir/` surface introduced in PRs #259 and #263 (static serving) and extended in PR #282 (API integration) may be retained as a development-time smoke harness. It must not be treated as product UI acceptance until it is either replaced with an aligned surface or explicitly reclassified as a permanent technical harness with a separate product UI surface defined elsewhere.

---

## 5. Decision Questions

| Question | Planning answer |
|---|---|
| Is `ui/nashir/` intended to be the future user-facing Nashir product UI? | **Unresolved — requires explicit decision in a future gate** |
| Is `ui/nashir/` only a temporary static API smoke harness? | **YES — this is the safe default classification until otherwise approved** |
| Should the actual Nashir UI be rebuilt inside `marketing-os` to match approved screens? | **CONDITIONAL — only if a separately approved implementation gate authorizes it** |
| Should the actual Nashir UI remain in `nashir-ui-prototype` until a later migration plan? | **YES — safe holding position** |
| Should future API integration target the approved Nashir UI surface? | **YES — once that surface is defined and approved** |
| What exact UI surface should be eligible for the next implementation gate? | **To be determined in the UI Surface Alignment Implementation Gate** |

---

## 6. Options

### Option A — Treat `ui/nashir/` as temporary technical smoke harness only

Keep `ui/nashir/` as-is but explicitly classify it as a static API smoke harness for development-time verification only. Do not expand it as product UI. Plan a separate approved product UI surface for the actual Nashir experience.

### Option B — Rebuild/replace `ui/nashir/` to match approved Nashir screens

Replace or significantly rework `ui/nashir/` to match the approved Nashir UI direction. Requires a dedicated UI Surface Alignment Implementation Gate. Must define exact source screens, allowed files, and acceptance criteria. Must not import React/Vite code or any build tooling unless separately approved.

### Option C — Keep `nashir-ui-prototype` as active UI source; defer marketing-os UI surface replacement

`marketing-os` remains backend/governance/infrastructure. The approved product UI continues to develop in `nashir-ui-prototype` as a reference. A later integration/migration strategy defines when and how the approved UI moves to or integrates with marketing-os.

### Option D — Continue expanding current `ui/nashir/` despite the UI mismatch

Accept the current surface as-is and continue adding API integration without alignment.

### Option E — Freeze UI expansion; proceed with backend planning only

Stop all UI/API expansion. Continue backend planning (next backend slice, OpenAPI, RBAC, etc.) while UI surface alignment is resolved separately.

---

## 7. Option Evaluation

| Criterion | Option A | Option B | Option C | Option D | Option E |
|---|---|---|---|---|---|
| Source-of-truth alignment | MODERATE — harness acceptable if labeled | STRONG — aligned surface | STRONG — prototype remains authority | **WEAK — mismatch compounds** | STRONG — deferred safely |
| Product UX fidelity | LOW — harness is not product UI | HIGH — if rebuilt correctly | HIGH — prototype tracks UX | **VERY LOW** | N/A — deferred |
| Governance safety | STRONG — bounded harness | STRONG | STRONG | **WEAK** | STRONG |
| Technical risk | LOW | MEDIUM — rebuild effort | LOW | **HIGH — drift increases** | LOW |
| Scope control | STRONG | MODERATE | STRONG | **WEAK** | STRONG |
| Implementation effort | LOW | MEDIUM/HIGH | LOW | LOW now, HIGH later | LOW |
| Reuse of approved screens | NO | YES — if implemented correctly | YES — reference | **NO** | N/A |
| Risk of duplicated product journeys | LOW if labeled | LOW if done right | LOW | **HIGH** | LOW |
| Risk of misleading stakeholders | LOW if labeled | LOW | LOW | **HIGH** | LOW |
| Future API integration path | CLEAR — separate surface | CLEAR — aligned surface | CLEAR — prototype route | **UNCLEAR** | CLEAR — deferred |
| **Verdict** | **RECOMMENDED short-term** | **CONDITIONAL** | **ACCEPTABLE** | **REJECTED** | **ACCEPTABLE fallback** |

---

## 8. Recommended Decision

**Recommend a combination of Option A (immediate) and Option B or C (deferred future gate):**

### Immediate actions (this gate)

1. **Reclassify `ui/nashir/` as a temporary technical smoke/API harness** — not product UI.
2. **Stop further API integration on current `ui/nashir/` as product UI.**
3. **Do not claim manual browser smoke PASS for product UI acceptance.**
4. **Preserve all backend, OpenAPI, generated types, and technical integration work** — these remain valid and should not be rolled back.
5. **Prepare a later UI Surface Alignment Implementation Gate** to either replace/rework `ui/nashir/` to match approved Nashir screens, or define a migration path.

### What is NOT recommended

- **Reject Option D** — continuing to expand a misaligned surface compounds product drift.
- Do not claim `ui/nashir/` is the product UI surface until a UI Surface Alignment Implementation Gate approves an aligned replacement.

### Clarifications

- PR #282 technical read-only API integration may remain as harness-level work.
- It must not be presented as product UI acceptance or used as the basis for pilot/production readiness claims.
- `nashir-ui-prototype` remains read-only reference.
- Backend/OpenAPI/generated types remain valid and accepted.

---

## 9. Immediate NO-GO Boundaries

```text
NO-GO: Product Detail UI planning until UI surface role is resolved.
NO-GO: Store/Product write planning until UI surface role and backend/OpenAPI/RBAC are separately planned.
NO-GO: Runtime client planning until target UI surface is settled.
NO-GO: Further API integration in current ui/nashir/ as product UI expansion.
NO-GO: Pilot or production readiness.
NO-GO: nashir-ui-prototype modification in this gate.
NO-GO: Copying or porting any UI files in this gate.
```

---

## 10. Required Corrections Before Any Further UI/API Expansion

Before any further UI/API expansion, the project must decide:

| Decision required | Options |
|---|---|
| Role of `ui/nashir/` | (a) Product UI surface — must be aligned with approved Nashir screens; or (b) Internal static harness — must be explicitly labeled; future product UI integration targets a different approved surface |
| Source of approved Nashir screens | Must be explicitly named in a future implementation gate |
| Acceptance criteria for UI alignment | Visual criteria + smoke checklist required before product UI acceptance |

A future implementation gate must list:

- Exact target UI surface (file names and paths)
- Exact screens to align (with references or screenshots)
- Whether current `ui/nashir/` is replaced, refactored, or re-labeled as harness
- Whether `nashir-ui-prototype` content is used only as visual reference or migrated
- Visual acceptance criteria
- Updated smoke checklist

---

## 11. Future Implementation Gate Requirements

A later **UI Surface Alignment Implementation Gate** must specify:

| Requirement | Detail |
|---|---|
| Exact target surface | Named files in an approved directory |
| Exact screens to align | Names, references, or screenshots from approved Nashir UI |
| Current `ui/nashir/` disposition | Replace / refactor / re-label as harness |
| Prototype content usage | Visual reference only or explicit migration |
| Visual acceptance criteria | Defined before implementation begins |
| Smoke checklist | Updated or new checklist scoped to aligned surface |
| Backend/OpenAPI expansion | Only if separately approved in that gate |
| Runtime client | Only if separately approved in that gate |
| Product by-id / write routes | Only if separately approved in that gate |
| Build tooling | Only if separately approved in that gate |

---

## 12. Risks

| Risk | Severity | Mitigation |
|---|---|---|
| Continuing on wrong UI creates product drift | **HIGH** | Option D rejected; UI expansion frozen until alignment |
| Stakeholders may believe a technically working harness is the final Nashir UI | **HIGH** | Explicit reclassification as harness in this gate |
| API integration becomes coupled to a rejected UI surface | **MEDIUM** | API integration on current surface frozen as product UI |
| Rebuilding later becomes expensive if expansion continues now | **MEDIUM** | No further expansion authorized until alignment gate |
| Copying prototype code without migration planning may create stack/build conflicts | **MEDIUM** | No copy/port in this gate; migration planning gate required |
| Two UI surfaces without source-of-truth decision creates long-term maintenance risk | **MEDIUM** | This gate establishes the harness/product distinction clearly |

---

## 13. Decision

| Dimension | Decision |
|---|---|
| **This planning gate (documentation only)** | **GO** |
| Further UI/API expansion on current `ui/nashir/` as product UI | **NO-GO** |
| Product by-id implementation | **NO-GO** |
| Store/Product write routes | **NO-GO** |
| Runtime client | **NO-GO** |
| Generated client | **NO-GO** |
| Backend expansion without its own planning gate | **NO-GO** |
| Pilot/production readiness | **NO-GO** |
| **CONDITIONAL GO: UI Surface Alignment Implementation Gate** | After source-of-truth decision and required corrections |
| Backend/OpenAPI/generated types validity | **PRESERVED — not rolled back** |
| Current PR #282 integration as harness-level work | **PRESERVED — not product UI acceptance** |

---

## 14. NO-GO Boundaries

```text
NO-GO: UI changes in this PR.
NO-GO: API call changes in this PR.
NO-GO: Fetch helper changes in this PR.
NO-GO: Runtime client in this PR.
NO-GO: Generated client in this PR.
NO-GO: generated/nashir-api-types/ changes in this PR.
NO-GO: package.json or package-lock.json changes.
NO-GO: npm dependency additions.
NO-GO: OpenAPI YAML changes.
NO-GO: Backend runtime changes.
NO-GO: src/router.js changes.
NO-GO: scripts/openapi-lint.js changes.
NO-GO: Tests changed.
NO-GO: SQL or migrations.
NO-GO: Workflows.
NO-GO: Any change to nashir-ui-prototype.
NO-GO: Store/Product write routes.
NO-GO: Product by-id UI integration.
NO-GO: Creator Studio backend.
NO-GO: Publishing, integrations, model/provider runtime.
NO-GO: Analytics runtime.
NO-GO: Pilot or production readiness.
```

---

## 15. Verification

| Command | Result |
|---|---|
| `npm run generate:nashir-types:check` | **PASSED** — Nashir generated types are current |
| `npm test` | **736 pass, 0 fail** |
| `npm run openapi:lint` | **PASSED** — 97 declared permissions checked |
| `npm run openapi:lint:strict` | **PASSED** — 104 declared permissions checked |
| `npm run verify:strict` (non-DB) | **PASSED** |
| `npm run db:migrate:strict` | **BLOCKED** — `DATABASE_URL is required` — environment constraint, not code |
| `git status --short` | Only new docs files untracked; `docs/03_decision_log.md` and `docs/17_change_log.md` modified |
| Forbidden files check | **PASS** — no UI, generated, generator, package, OpenAPI YAML, src/, test/, SQL, or prototype files modified |

---

## 16. GO / NO-GO Result

| Decision | Status |
|---|---|
| **Planning gate complete** | **GO** |
| Further UI/API expansion on current `ui/nashir/` as product UI | **NO-GO** |
| Product by-id implementation | **NO-GO** |
| Store/Product write routes | **NO-GO** |
| Runtime client | **NO-GO** |
| Generated client | **NO-GO** |
| Backend expansion without planning gate | **NO-GO** |
| Pilot/production readiness | **NO-GO** |
| **CONDITIONAL GO: UI Surface Alignment Implementation Gate** | After source-of-truth decision and required corrections in Section 10 |
