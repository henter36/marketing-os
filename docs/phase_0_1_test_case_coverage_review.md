# Phase 0/1 Test Case Coverage Review

## Document status

Documentation-only QA coverage review. This file does not replace the canonical QA suite and does not modify runtime tests.

## Executive decision

The existing QA suite is strong for Phase 0/1 governance-critical areas: tenant isolation, RBAC, approval integrity, evidence immutability, report snapshot immutability, ErrorModel, idempotency, database triggers, audit, and OpenAPI validation.

Decision: **GO with warnings** for continued controlled planning. **NO-GO** for Pilot, Production, runtime agents, external publishing, paid execution, or budget-changing automation.

## Coverage summary

| Area | Existing coverage | Status | Risk if ignored |
|---|---|---|---|
| Tenant isolation | QA-TI-001 to QA-TI-004 | Strong | Cross-tenant data leakage |
| RBAC | QA-RBAC-001 to QA-RBAC-004 | Strong | Privilege escalation |
| Approval integrity | QA-APP-001 to QA-APP-004 | Strong | Publishing unapproved content |
| Usage / cost | QA-USG-001 to QA-USG-004 | Good | Cost disputes and false billing-like usage |
| Evidence immutability | QA-EVD-001 to QA-EVD-005 | Strong | Tampered publish proof |
| Report snapshots | QA-RPT-001 to QA-RPT-003 | Strong | Historical report drift |
| ErrorModel | QA-ERR-001 to QA-ERR-002 | Good | Unpredictable frontend/support behavior |
| Idempotency | QA-IDM-001 to QA-IDM-004 | Strong | Duplicate jobs, duplicate usage, duplicate publish jobs |
| DB constraints/triggers | QA-DB-001 to QA-DB-004 | Strong | Contract bypass through direct DB mutation |
| Operational controls | QA-OPS-001 to QA-OPS-003 | Partial | Safe mode ambiguity |
| Audit coverage | QA-AUD-001 to QA-AUD-002 | Strong as contract | Lost accountability |
| OpenAPI validation | QA-OAS-001 to QA-OAS-003 | Strong | Frontend/runtime contract drift |
| Threat modeling validation | Not a canonical QA category | Partial | Abuse cases not systematically tested |
| Source-of-truth governance | Not a canonical QA category | Partial | Agents may implement from non-authoritative docs |
| Patch 003 isolation | Not canonical in QA | Partial | Draft/NO-GO scope leaks into implementation |

## Story-to-test mapping review

| Story | Main QA IDs | Coverage status | Notes |
|---|---|---|---|
| S0-01 Schema baseline | QA-DB-001 to QA-DB-004, QA-AUD-002 | Strong | Add migration-order regression where needed for patches |
| S0-02 Auth/workspace context | QA-TI-001 to QA-TI-004 | Strong | Must be repeated for every new workspace-scoped route |
| S0-03 RBAC | QA-RBAC-001 to QA-RBAC-004 | Strong | Add seed parity test for new `x-permission` values |
| S0-04 ErrorModel | QA-ERR-001 to QA-ERR-002 | Good | Correlation ID logging should be verified per implementation |
| S1-01 Workspace/member | QA-TI, QA-RBAC | Good | Member lifecycle status edge cases can be expanded later |
| S1-02 Brand profile/rules | Backlog QA plus repository tests | Partial | Runtime route switch is NO-GO; repository-only tests are acceptable for current slice |
| S1-03 Templates | Backlog QA | Partial | Slice 2 needs dedicated repository/runtime contract tests before implementation |
| S1-04 Campaign lifecycle | QA-TI-001, QA-RBAC-001, backlog QA | Partial | DB-backed campaign persistence remains NO-GO |
| S1-05 Brief versioning | Backlog QA | Partial | Add explicit test that no PATCH endpoint exists for historical brief content |
| S2-01 Cost policies | QA-USG, backlog QA | Partial | Cost guardrail threshold and safe-mode interaction need explicit tests |
| S2-02 MediaJob | QA-IDM-001, QA-IDM-002, QA-DB-002 | Good as contract | Real provider execution remains out of scope |
| S2-03 MediaAssetVersion | QA-TI-002, QA-DB-001 | Good as contract | Add hash-generation determinism test when implementation begins |
| S2-04 UsageMeter | QA-USG-001, QA-USG-002, QA-IDM-004 | Strong | Critical before any paid/customer exposure |
| S2-05 CostEvent | QA-USG-003 | Partial | Need explicit non-billing regression per implementation |
| S3-01 ReviewTask | Backlog QA | Partial | Assignee workspace membership test should be canonicalized |
| S3-02 ApprovalDecision | QA-APP-001 to QA-APP-004 | Strong | Approval remains human-governed; no runtime agent approval |
| S3-03 PublishJob | QA-APP-003, QA-APP-004, QA-IDM-003 | Strong | External publishing stays NO-GO |
| S3-04 ManualPublishEvidence | QA-EVD-001 to QA-EVD-005 | Strong | Invalidate limited-update semantics must be regression tested |
| S3-05 TrackedLink | Backlog QA | Partial | Explicit test must reject advanced attribution claims |
| S4-01 ClientReportSnapshot | QA-RPT-001 to QA-RPT-003 | Strong | Must freeze evidence snapshot payload |
| S4-02 AuditLog | QA-AUD-001, QA-AUD-002 | Strong | AuditLog must not be used as business state |
| S4-03 SafeMode | QA-OPS-001, QA-OPS-002 | Partial | Blocked-operation list must be defined per implementation slice |
| S4-04 Onboarding | QA-OPS-003 | Partial | Completion must not approve Pilot or Production |

## Missing or recommended QA addenda

These are proposed test backlog items only. They do not modify runtime tests in this PR.

| Proposed ID | Area | Test | Severity | Required before coding? | Rationale |
|---|---|---|---|---|---|
| QA-GOV-001 | Source-of-truth | Documentation-only PRs must not change runtime, SQL, OpenAPI, package, workflow, or generated files | P0 | Yes for governance PRs | Prevents accidental contract/runtime drift |
| QA-GOV-002 | Source-of-truth | Consolidated PRD and intake docs are not treated as implementation authority | P0 | Yes before feature expansion | Prevents scope creep |
| QA-GOV-003 | Patch isolation | Draft/NO-GO Patch 003 files are not included in unrelated PRs | P0 | Yes while PR #24 remains open | Prevents unapproved competitive expansion |
| QA-RBAC-005 | Permission parity | Every OpenAPI `x-permission` exists in Permission seed/mapping | P0 | Yes before endpoint implementation | Prevents hidden inaccessible or unguarded endpoints |
| QA-AUD-003 | Audit parity | Every sensitive OpenAPI `x-audit-event` is implemented and tested | P0 | Yes before write endpoint implementation | Prevents lost accountability |
| QA-SAFE-001 | Safe mode | Safe mode blocks explicitly listed risky operations | P0/P1 by operation | Yes before safe mode claims | Current safe mode blocking list is not normalized |
| QA-COST-001 | Cost guardrail | Block/warn/require_review behavior is enforced consistently | P0 | Yes before provider spend | Prevents uncontrolled spend |
| QA-EVD-006 | Evidence invalidate | Invalidate updates only allowed status/reason fields and preserves proof fields | P0 | Yes before evidence implementation | Protects evidence immutability while allowing correction workflow |
| QA-BRIEF-001 | Brief immutability | Historical brief content cannot be PATCHed; content change creates new version | P1 | Yes before brief DB implementation | Protects generation-input history |
| QA-ATTR-001 | Attribution boundary | TrackedLink does not create advanced AttributionDecision or causal ROI claims | P1 | Yes before reporting expansion | Prevents misleading analytics |
| QA-AGENT-001 | Agent boundary | Runtime agents cannot approve, publish, mutate budgets, or call external platforms | P0 | Yes before any agent work | Preserves human approval and external execution boundaries |

## Coverage warnings

### 1. QA is stronger than runtime maturity

The canonical QA suite is broader and stricter than current runtime maturity. This is acceptable for contract-first development, but any implementation PR must state which QA subset was actually run and which remains future gate coverage.

### 2. In-memory runtime is not equivalent to DB-backed truth

Passing in-memory runtime tests does not prove DB-backed persistence, RLS, trigger, or migration integrity. DB-backed claims require database integration tests.

### 3. Repository-only slices must not be described as runtime route completion

Brand Slice 1 and similar repository-only slices prove repository behavior, not public HTTP runtime behavior.

### 4. Pilot gate remains closed

The QA suite defines Pilot gates, but existence of the QA suite is not evidence that Pilot gates are passed.

## Final QA recommendation

1. Keep the canonical QA suite as the primary Phase 0/1 test authority.
2. Add the proposed governance/security addenda only through a separate QA patch if implementation planning requires them.
3. Do not proceed to frontend, Pilot, Production, agents, external publishing, or paid execution until the relevant P0 gates are implemented and evidenced.
4. For the next implementation slice, require a mini coverage table listing exact QA IDs run, skipped, deferred, and newly required.
