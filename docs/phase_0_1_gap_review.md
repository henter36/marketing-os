# Phase 0/1 Gap Review

## Document status

Documentation-only gap register. This file does not authorize implementation, SQL changes, OpenAPI changes, generated code changes, package changes, workflow changes, Sprint 5, Pilot, or Production.

## Executive decision

The project has the required core Phase 0/1 authority documents, but several governance and execution-readiness gaps remain. The highest-risk gaps are not missing product ideas; they are source-of-truth ambiguity, partial DB-backed/runtime maturity, permission/audit parity, threat coverage, and unsafe interpretation of future strategy documents.

Decision: **GO for documentation review / NO-GO for broad implementation**.

## Gap register

| Gap ID | Area | Source document(s) | Description | Severity | Type | Impact | Recommended action | Owner suggestion | Required before coding? | Status |
|---|---|---|---|---|---|---|---|---|---|---|
| GAP-001 | Source-of-truth | README, source precedence, PRD docs | Multiple strategic and intake documents exist; future material may be mistaken for implementation authority | High | Governance | Scope creep, unsafe implementation, contradiction between docs | Use source precedence before every PR; cite authoritative source in PR body | Product/Solution Architect | Yes | Open / controlled by this package |
| GAP-002 | Change history | `docs/17_change_log.md`, Issues #69/#70 | Change-log and README reconciliation are high-churn and may lag recent governance PRs | Medium | Documentation | Misleading current status for future agents | Reconcile through separate low-risk docs-only PR if needed | Maintainer | No, unless status docs are touched | Open |
| GAP-003 | Traceability | Backlog, ERD, OpenAPI, QA | No single matrix previously mapped story to entity/API/permission/audit/test | High | Governance / QA | Story may proceed without complete controls | Maintain traceability matrix and update per approved slice | Product + QA | Yes for next slice | Addressed by this package |
| GAP-004 | Threat modeling | QA suite, governance docs | QA exists, but abuse/security risks were not consolidated in a Phase 0/1 threat model | High | Security | Missed abuse paths around tenant isolation, evidence, approval, cost, agents | Use threat model before coding sensitive flows | Security / Architect | Yes for sensitive flows | Addressed by this package |
| GAP-005 | Permission/audit matrix | OpenAPI, RBAC, QA | Permissions and audit events existed across docs but lacked one review matrix | High | Security / Governance | Unguarded endpoints or unaudited writes | Use permission/audit matrix before any endpoint PR | Backend + Security | Yes for endpoint work | Addressed by this package |
| GAP-006 | Governance QA | QA suite | QA suite lacks explicit tests for source-of-truth misuse, docs-only PR forbidden files, and Patch 003 isolation | Medium | QA / Governance | Non-authoritative docs may leak into implementation | Add QA-GOV addendum in a future QA patch | QA / Maintainer | Yes for broad governance automation | Proposed follow-up |
| GAP-007 | Patch 003 isolation | PR #24 | Patch 003 remains Draft / NO-GO and could be accidentally mixed into this or future PRs | High | Governance | Unapproved competitive expansion or contract activation | Keep Patch 003 files out of unrelated branches | Maintainer | Yes | Open |
| GAP-008 | Runtime maturity | README, implementation reports | HTTP/runtime product routes still default to in-memory unless separately switched | High | Technical | Overclaiming DB-backed truth or production readiness | State runtime mode in every implementation PR | Backend lead | Yes for runtime work | Open |
| GAP-009 | Brand Slice 1 status | Brand Slice 1 reports | Brand Slice 1 is repository-only; risk of describing it as full runtime route completion | Medium | Documentation / Technical | Misleading readiness claims | Preserve repository-only wording | Backend lead | Yes for Brand work | Open |
| GAP-010 | Template Slice 2 | Slice 2 planning docs | Template planning exists, but implementation is not automatically approved | Medium | Governance | Premature coding of PromptTemplate/ReportTemplate routes/repositories | Require specific implementation issue/allowed files/QA | Product + Backend | Yes for Slice 2 | Open |
| GAP-011 | Campaign/Brief DB persistence | README, backlog, ERD | Campaign and Brief contracts exist, but full DB-backed persistence remains gated | High | Technical | Data truth ambiguity if implemented piecemeal | Use bounded DB-backed slice planning | Backend lead | Yes for DB-backed work | Open |
| GAP-012 | Media/Approval/Publish DB maturity | ERD, OpenAPI, QA | Media, Approval, Publish, Evidence are contractually strong but not fully product-grade DB-backed flows | Blocker | Technical / Governance | Approval/publish/evidence trust failure | Implement only through sequential slices after contract/QA parity | Backend + QA | Yes | Open |
| GAP-013 | Usage/cost controls | ERD, QA, backlog | Usage/cost contracts exist; real provider spend requires stronger guardrail verification | Blocker before provider exposure | Financial / Technical | Cost spikes, disputes, false billing-like records | Do not enable real provider calls until cost/usage P0 gates pass | Backend + Finance/Product | Yes before provider | Open |
| GAP-014 | Audit durability | ERD, QA | AuditLog is append-only contractually; durable audit behavior must be proven per runtime/DB slice | High | Governance / Security | Lost accountability | Add audit parity checks for every sensitive write | Backend + QA | Yes for sensitive writes | Open |
| GAP-015 | Safe mode semantics | Backlog, QA | Safe mode exists but blocked-operation list is not normalized per implementation slice | Medium | Operational | False sense of incident control | Define blocked operations in each relevant implementation plan | Operations + Backend | Yes before safe mode claims | Open |
| GAP-016 | Client report truth | ERD, QA | Report snapshots must not recompute from mutable live evidence; implementation must prove frozen payload | High | Trust / QA | Historical report drift | Enforce immutable snapshot payload tests | Backend + QA | Yes for report work | Open |
| GAP-017 | Manual evidence invalidate | Patch 001, QA, ERD | Invalidate must update limited status/reason only without mutating proof fields | High | Trust / Security | Evidence tampering | Add explicit invalidate limited-update regression | Backend + QA | Yes for evidence work | Proposed follow-up |
| GAP-018 | OpenAPI/permission parity | OpenAPI, QA | New endpoints can drift unless every write declares permission and is seeded | High | Security / QA | Unauthorized access or unusable endpoints | Add permission seed parity verification | Backend + QA | Yes for endpoint PRs | Proposed follow-up |
| GAP-019 | Frontend/prototype boundary | README, OpenAPI | Prototype/frontend must not invent endpoints or treat non-contract fields as backend truth | Medium | Product / Technical | Contract drift and false UX readiness | Frontend remains blocked until OpenAPI parity and backend readiness | Frontend + Product | Yes before frontend | Open |
| GAP-020 | Agentic strategy interpretation | Agent strategy docs, Issues #73/#76/#80 | Agentic strategy is valuable but may be misread as runtime agent approval | High | Governance / Legal / Operational | Auto-publishing, self-approval, unsafe external execution | Preserve runtime agents NO-GO; require separate RFC | Product + Security | Yes before agent work | Open |
| GAP-021 | External publishing boundary | OpenAPI PublishJob, strategy docs | PublishJob/manual evidence could be misread as external publishing connector approval | High | Legal / Platform / Reputation | Platform policy breach or unapproved posts | Keep external publishing NO-GO; require approved Publishing Service design later | Product + Legal/Security | Yes before connector work | Open |
| GAP-022 | Advanced attribution boundary | TrackedLink story | TrackedLink may be overstated as advanced attribution or ROI truth | Medium | Product / Legal | Misleading analytics claims | Add attribution boundary test and wording | Product + QA | Before reporting expansion | Proposed follow-up |
| GAP-023 | PRD duplication risk | PRD docs, source precedence | Creating new PRD/ERD/OpenAPI replacements would create authority conflicts | High | Governance | Conflicting source of truth | Do not create replacement contract docs; add review docs only | Product/Solution Architect | Yes | Addressed by this package |
| GAP-024 | Pilot readiness language | README, QA | QA documents define pilot gates, but existence of docs does not mean gates passed | High | Governance / Reputation | Premature customer exposure | Keep Pilot and Production NO-GO until evidenced | Maintainer | Yes before exposure | Open |
| GAP-025 | Supply-chain / generated code | Package/scripts/generated clients | Docs work must not change packages/workflows/generated clients; implementation PRs need separate verification | Medium | Technical / Security | Build instability, unreviewed dependency change | Keep forbidden files list in PR templates | Maintainer | Yes for implementation PRs | Open |

## Blockers before any broad implementation

1. No selected next slice may proceed without a traceability row.
2. No endpoint may proceed without OpenAPI permission, ErrorModel, and audit mapping.
3. No DB-backed claim may proceed without migration/RLS/trigger tests.
4. No approval/publish/evidence flow may proceed without hash/version/evidence immutability tests.
5. No provider/AI cost exposure may proceed without cost guardrail and UsageMeter P0 tests.
6. No agent/external publishing/paid execution may proceed without separate RFC and explicit approval.

## Recommended next actions

| Priority | Action | Reason |
|---|---|---|
| 1 | Review and approve/reject this documentation authority package | Establishes a clean governance baseline |
| 2 | Decide whether to run a separate change-log reconciliation PR | Avoids high-churn file conflict in this package |
| 3 | Select one bounded next implementation slice | Prevents broad implementation risk |
| 4 | For selected slice, produce mini ERD/SQL/OpenAPI/QA impact table | Prevents coding by assumption |
| 5 | Keep PR #24 Patch 003 isolated | Prevents unapproved expansion |

## Final decision

The project is not missing a replacement PRD/ERD/OpenAPI. It is missing implementation-safe linkage, threat coverage, gap ownership, and parity discipline. This package closes the documentation-linkage gap but does not make the repository Pilot-ready or Production-ready.
