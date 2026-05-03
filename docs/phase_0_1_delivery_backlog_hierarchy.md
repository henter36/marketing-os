# Phase 0/1 Delivery Backlog Hierarchy

## Document status

Documentation-only delivery hierarchy. This file organizes existing Phase 0/1 backlog content into an implementation-planning hierarchy.

It does not replace the canonical backlog, ERD, SQL, OpenAPI, QA suite, source-of-truth precedence record, or PR #82 review documents.

It does not authorize runtime implementation, SQL changes, OpenAPI changes, test changes, workflow changes, package changes, generated code changes, Sprint 5, Pilot, or Production.

## Executive decision

Decision: **GO for delivery planning / NO-GO for implementation from this document alone**.

The current backlog already contains story-level implementation material, but it is organized primarily by sprint. This document adds a product-delivery view:

```text
Epic → Feature → User Story → Acceptance Criteria → Test Case → Priority → Dependencies → Readiness
```

This hierarchy is intended to help select the next bounded implementation slice without re-opening scope.

## Source boundaries

| Source | Role in this document |
|---|---|
| `docs/marketing_os_v5_6_5_phase_0_1_backlog.md` | Primary source for story IDs, user stories, acceptance criteria, permissions, audit events, error states, and QA references |
| `docs/marketing_os_v5_6_5_phase_0_1_erd.md` | Entity and relationship authority |
| `docs/marketing_os_v5_6_5_phase_0_1_openapi.yaml` | Endpoint and permission contract authority |
| `docs/marketing_os_v5_6_5_phase_0_1_qa_test_suite.md` | Test case authority |
| `docs/source_of_truth_precedence_decision_record.md` | Conflict resolution authority |
| `docs/phase_0_1_traceability_matrix.md` | Supporting traceability review in PR #82 |
| `docs/phase_0_1_gap_review.md` | Supporting gap register in PR #82 |

If this document conflicts with an authoritative source, the authoritative source wins and this document must be corrected.

## Delivery hierarchy status legend

| Status | Meaning |
|---|---|
| Contract ready | ERD/OpenAPI/backlog/QA exist; implementation still requires a bounded PR |
| Implementation partial | Some implementation exists, but not complete runtime/product-grade behavior |
| Repository-only | Repository methods/tests exist, but public runtime route switching remains gated |
| Planning only | Planning exists; no implementation approval |
| Blocked | Must not be implemented before prerequisite controls or separate approval |
| Deferred | Explicitly out of Phase 0/1 or not approved for current implementation |

## Priority legend

| Priority | Meaning |
|---|---|
| P0 | Systemic, security, financial, legal, tenant, approval, evidence, audit, or readiness blocker |
| P1 | Core workflow requirement, blocks complete product readiness |
| P2 | Useful operational support, can follow after P0/P1 foundations |
| P3 | Deferred / future / not part of current implementation scope |

---

# Epic 0 — Repository Governance and Source-of-Truth Control

## Goal

Prevent implementation from non-authoritative documents and preserve current GO/NO-GO boundaries.

| Feature | Stories / documents | Priority | Dependencies | Readiness | Decision |
|---|---|---:|---|---|---|
| Source-of-truth precedence | `source_of_truth_precedence_decision_record.md` | P0 | README, change log, contracts | Contract ready | Must be checked before every PR |
| Documentation authority review | `phase_0_1_documentation_authority_review.md` | P0 | README, ERD, SQL, OpenAPI, QA, backlog | Draft in PR #82 | Review before merge |
| Traceability matrix | `phase_0_1_traceability_matrix.md` | P0 | Backlog, ERD, SQL, OpenAPI, QA | Draft in PR #82 | Required before next implementation slice |
| Gap register | `phase_0_1_gap_review.md` | P0 | Existing gap docs and PR #82 review | Draft in PR #82 | Required before next implementation slice |
| Permission/audit matrix | `phase_0_1_permission_and_audit_matrix.md` | P0 | OpenAPI, RBAC, audit events, QA | Draft in PR #82 | Required before endpoint work |
| Threat model | `phase_0_1_threat_model.md` | P0 | QA, ERD, OpenAPI, governance docs | Draft in PR #82 | Required before sensitive runtime expansion |

## Acceptance criteria

- Every implementation PR states the authoritative source.
- Every implementation PR states allowed and forbidden files.
- No strategic PRD, intake document, or GitHub Issue is treated as implementation authority by itself.
- PR #24 / Patch 003 remains isolated unless separately approved.
- Runtime agents, external publishing, auto-replies, paid ads execution, budget-changing agents, Sprint 5, Pilot, and Production remain NO-GO.

## Recommended test / verification controls

- Documentation-only PR diff contains docs-only files.
- No `src/**`, `test/**`, SQL, OpenAPI, workflow, package, lockfile, generated client, migration, or prototype files change in governance PRs.
- PR body includes GO/NO-GO scope.

---

# Epic 1 — Foundation, Tenant Isolation, RBAC, and Error Model

## Goal

Establish the minimum platform safety baseline before any product workflow is trusted.

| Feature | Story ID | User value | Priority | Key dependencies | Test cases | Readiness | Decision |
|---|---|---|---:|---|---|---|---|
| PostgreSQL schema baseline | S0-01 | Platform has approved data foundation | P0 | Base schema, patches 001/002, migration order | QA-DB-001 to QA-DB-004, QA-AUD-002 | Contract ready / partially implemented historically | Use only through approved migration gate |
| Auth and workspace context | S0-02 | Workspace users cannot cross tenant boundaries | P0 | AuthGuard, WorkspaceContextGuard, MembershipCheck, PermissionGuard | QA-TI-001 to QA-TI-004 | Contract ready / baseline exists | Required for all workspace routes |
| RBAC seed and enforcement | S0-03 | Roles and permissions are enforceable | P0 | Role, Permission, RolePermission, WorkspaceMember, OpenAPI `x-permission` | QA-RBAC-001 to QA-RBAC-004 | Contract ready / baseline exists | Permission parity required for endpoint work |
| Unified ErrorModel | S0-04 | UI and operators receive predictable failures | P0 | ErrorModel, correlation ID behavior | QA-ERR-001, QA-ERR-002 | Contract ready / baseline exists | Required for all endpoints |

## Dependencies

```text
ERD identity/tenant/RBAC domain
SQL migration order
OpenAPI security and error components
QA-TI / QA-RBAC / QA-ERR / QA-DB
```

## Acceptance criteria summary

- `workspace_id` comes from route/context only.
- Body-provided `workspace_id` is rejected or ignored.
- Every workspace-scoped query is scoped by workspace.
- Viewer cannot write.
- BillingAdmin cannot modify campaign content by default.
- All errors return `code`, `message`, `user_action`, and `correlation_id`.

## Implementation readiness

Foundation is the safest area for controlled implementation and verification, but only if every route and repository path proves tenant isolation, permission enforcement, and ErrorModel behavior.

---

# Epic 2 — Workspace, Brand, Templates, Campaign, and Brief Setup

## Goal

Enable controlled workspace setup and planning artifacts before media generation, approval, publishing, or reporting.

| Feature | Story ID | User value | Priority | Key dependencies | Test cases | Readiness | Decision |
|---|---|---|---:|---|---|---|---|
| Workspace and member management | S1-01 | Admin can manage workspace setup and members | P0 | Workspace, WorkspaceMember, User, Role, AuditLog | QA-TI, QA-RBAC, backlog QA | Contract ready / baseline exists | Continue only with tenant/RBAC evidence |
| Brand profile and brand voice rules | S1-02 | Creators can govern brand constraints | P1 | BrandProfile, BrandVoiceRule, AuditLog | Backlog QA, Brand Slice 1 repository tests | Repository-only partial | Runtime switch remains gated |
| Prompt and report templates | S1-03 | Admin/creator can manage controlled templates | P1 | PromptTemplate, ReportTemplate, AuditLog | Backlog QA | Planning only / Slice 2 candidate | Best next bounded planning candidate |
| Campaign lifecycle | S1-04 | Creator can create and transition campaigns | P1 | Campaign, CampaignStateTransition, AuditLog | QA-TI-001, QA-RBAC-001, backlog QA | In-memory runtime / DB-backed NO-GO | Do not claim DB-backed persistence |
| Brief versioning | S1-05 | Campaign inputs remain historically protected | P1 | Campaign, BriefVersion, content_hash | Backlog QA | In-memory/runtime partial | DB-backed implementation requires parity gate |

## Dependencies

```text
Epic 1 foundation
BrandProfile / BrandVoiceRule ERD
PromptTemplate / ReportTemplate ERD
Campaign / BriefVersion ERD
OpenAPI workspace, brand, template, campaign, brief endpoints
```

## Acceptance criteria summary

- Workspace and customer ownership are immutable where required.
- Brand profiles are unique per workspace.
- Brand rules are linked to the same workspace as the profile.
- Template `template_name + version_number` uniqueness is enforced.
- Campaign transitions are recorded.
- Brief content changes create new versions; historical content is not patched.

## Implementation readiness

The safest next candidate in this epic is **PromptTemplate / ReportTemplate Slice 2**, because it is narrower than Campaign/Brief and lower risk than Media/Approval/Publish. However, implementation must still be separately approved with allowed files, forbidden files, QA subset, and rollback/verification gates.

---

# Epic 3 — Media Generation Control, Cost Guardrails, Assets, and Usage

## Goal

Enable controlled generation workflow without uncontrolled AI/provider cost, false usage recording, or mutable generated outputs.

| Feature | Story ID | User value | Priority | Key dependencies | Test cases | Readiness | Decision |
|---|---|---|---:|---|---|---|---|
| Cost policy and guardrails | S2-01 | Admin can prevent uncontrolled generation spend | P0 | MediaCostPolicy, CostBudget, CostGuardrail, AuditLog | QA-USG, backlog QA | Contract ready only | Required before provider exposure |
| MediaJob with MediaCostSnapshot | S2-02 | Creator can request media job only after cost approval | P0 | Campaign, BriefVersion, PromptTemplate, MediaCostSnapshot, Idempotency-Key | QA-IDM-001, QA-IDM-002, QA-DB-002 | Blocked for real provider execution | Provider calls remain NO-GO |
| MediaAsset and MediaAssetVersion | S2-03 | Generated output is versioned and reviewable | P0 | MediaJob, MediaAsset, MediaAssetVersion, content_hash | QA-TI-002, QA-DB-001 | Contract ready only | Requires approval/evidence integrity planning |
| UsageMeter | S2-04 | Usage is counted only for usable output | P0 | MediaJob, UsageMeter, UsageQuotaState, Idempotency-Key | QA-USG-001, QA-USG-002, QA-IDM-004 | Contract ready only | Must not become invoice truth |
| CostEvent | S2-05 | Internal provider cost can be tracked safely | P1 | CostEvent, MediaJob, AuditLog | QA-USG-003 | Contract ready only | Must not create customer billing state |

## Dependencies

```text
Epic 1 foundation
Epic 2 campaign/brief/template readiness
Cost and quota contracts
Idempotency enforcement
Audit events
```

## Acceptance criteria summary

- MediaJob creation requires `Idempotency-Key`.
- MediaJob cannot run without approved MediaCostSnapshot.
- Failed provider job does not create UsageMeter unless usable output exists.
- UsageMeter requires `usable_output_confirmed=true`.
- CostEvent is internal cost evidence only, not invoice or billing truth.
- Approved MediaAssetVersion must be immutable.

## Implementation readiness

This epic is **not the next recommended implementation target**. It carries cost, AI/provider, idempotency, approval, asset versioning, and commercial interpretation risk.

---

# Epic 4 — Review, Approval, Publish Job, Evidence, and Basic Tracking

## Goal

Protect the human approval chain and ensure that only approved, hash-bound content can be published or evidenced.

| Feature | Story ID | User value | Priority | Key dependencies | Test cases | Readiness | Decision |
|---|---|---|---:|---|---|---|---|
| Review task creation | S3-01 | Creator/admin can request review for an asset version | P1 | MediaAssetVersion, ReviewTask, workspace member validation | Backlog QA | Contract ready only | Requires MediaAssetVersion readiness |
| ApprovalDecision integrity | S3-02 | Reviewer approves or rejects exact asset version | P0 | ReviewTask, MediaAssetVersion, content_hash | QA-APP-001 to QA-APP-004, QA-RBAC-003/004 | Contract ready only | High-risk; no self-approval or agent approval |
| PublishJob from approved decision | S3-03 | Publisher creates publish job only from approved content | P0 | ApprovalDecision, MediaAssetVersion, Idempotency-Key | QA-APP-003/004, QA-IDM-003 | Contract ready only | External publishing remains NO-GO |
| ManualPublishEvidence | S3-04 | Publisher submits tamper-resistant manual evidence | P0 | PublishJob, MediaAssetVersion, ManualPublishEvidence | QA-EVD-001 to QA-EVD-005 | Contract ready only | Invalidate limited-update regression needed |
| TrackedLink | S3-05 | Publisher can create basic tracked links | P1 | PublishJob, TrackedLink | Backlog QA | Contract ready only | No advanced attribution claims |

## Dependencies

```text
Epic 3 MediaAssetVersion readiness
Approval hash binding
Manual evidence immutability
AuditLog append-only behavior
Idempotency enforcement
```

## Acceptance criteria summary

- ReviewTask must target a MediaAssetVersion in the same workspace.
- ApprovalDecision must match ReviewTask MediaAssetVersion.
- Approved content hash must match MediaAssetVersion content_hash.
- PublishJob requires approved ApprovalDecision and matching hash.
- ManualPublishEvidence has no PATCH or DELETE route.
- Supersede creates a new row.
- Invalidate does not delete or mutate proof fields.
- TrackedLink does not imply advanced attribution.

## Implementation readiness

This epic is **blocked until Epic 3 asset/version foundations are implemented and verified**. It is a high-trust area and must not be implemented broadly or partially without strict QA.

---

# Epic 5 — Reports, Audit, Operations, and Readiness Gates

## Goal

Freeze reporting truth, expose auditability, and define operational controls without implying Pilot or Production readiness.

| Feature | Story ID | User value | Priority | Key dependencies | Test cases | Readiness | Decision |
|---|---|---|---:|---|---|---|---|
| ClientReportSnapshot | S4-01 | Client reports remain historically stable | P0 | Campaign, ReportTemplate, ManualPublishEvidence, content_hash | QA-RPT-001 to QA-RPT-003 | Contract ready only | Requires evidence immutability first |
| AuditLog read model | S4-02 | Admin can investigate governance activity | P0 | AuditLog, audit.read permission | QA-AUD-001, QA-AUD-002 | Contract ready / partial baseline | AuditLog not business state |
| Safe mode | S4-03 | Admin can stop risky operations during incidents | P1 | SafeModeState, AdminNotification, AuditLog | QA-OPS-001, QA-OPS-002 | Partial | Blocked-operation list must be defined per slice |
| Onboarding progress | S4-04 | Admin can track setup readiness | P2 | OnboardingProgress, SetupChecklistItem | QA-OPS-003 | Partial | Completion does not imply Pilot readiness |

## Dependencies

```text
Epic 1 foundation
Epic 4 evidence readiness
Audit append-only behavior
Report snapshot immutability
Operational policy for safe mode
```

## Acceptance criteria summary

- ClientReportSnapshot freezes report payload and evidence snapshot.
- Later evidence supersede/invalidate does not mutate old reports.
- AuditLog is append-only and workspace-scoped.
- Safe mode activation/deactivation creates audit events.
- Safe mode blocked operations are explicitly defined before claims.
- Onboarding completion does not approve Pilot or Production.

## Implementation readiness

Audit and report snapshots are high-trust. They should not be implemented before evidence and approval integrity foundations are reliable.

---

# Epic 6 — Deferred / Future Capabilities

## Goal

Preserve future product direction without accidentally promoting it into Core V1 implementation.

| Capability | Current source | Priority | Status | Decision |
|---|---|---:|---|---|
| Runtime agents | Agentic strategy docs / Issues #73, #76, #80 | P3 | Deferred | NO-GO without RFC, ERD/SQL/OpenAPI/QA, threat model, cost controls |
| External publishing connectors | Agentic strategy / future publishing concepts | P3 | Deferred | NO-GO |
| Auto-replies | Future agent ideas | P3 | Deferred | NO-GO |
| Paid ads execution | Future strategy | P3 | Deferred | NO-GO |
| Budget-changing agents | Future strategy | P3 | Deferred | NO-GO |
| Advanced attribution | TrackedLink boundary / future strategy | P3 | Deferred | NO-GO |
| Patch 003 competitive features | PR #24 | P3 | Draft / NO-GO | Keep isolated |
| Creator marketplace / InPactAI execution | Fit-gap docs | P3 | Proposal only | NO-GO |

## Acceptance criteria

- Deferred items are not implemented from PRD, issue, or strategy text alone.
- Each future item requires a separate RFC or approved issue.
- Each future item requires ERD/SQL/OpenAPI/QA/security/cost review before implementation.
- Any future automation preserves: human approval, auditability, tenant isolation, and cost governance.

---

# Recommended implementation sequencing

## Current safest sequence

| Order | Candidate | Why | Decision |
|---:|---|---|---|
| 1 | Review and merge/adjust PR #82 documentation package | Establishes governance review layer | GO after review |
| 2 | Index PR #82 in README and change log | Makes repository status discoverable | GO after PR #82 decision |
| 3 | Prepare Template Slice 2 implementation gate | Narrower than Campaign/Media/Approval | Conditional GO |
| 4 | Implement Template Slice 2 only if approved | Lower-risk DB-backed continuation candidate | Not authorized by this doc |
| 5 | Reassess Campaign/Brief parity | Higher risk, broader domain | Planning only |
| 6 | Defer Media/Approval/Publish/Evidence until foundations are stronger | High trust/cost/compliance risk | NO-GO now |

## Why Template Slice 2 is the best next candidate

PromptTemplate / ReportTemplate is narrower and lower-risk than Campaign, Brief, MediaJob, MediaAssetVersion, ApprovalDecision, PublishJob, ManualPublishEvidence, UsageMeter, CostEvent, or ClientReportSnapshot.

It still requires:

```text
Allowed files
Forbidden files
Repository methods
Runtime mode decision
SQL/OpenAPI impact check
QA subset
Tenant isolation tests
RBAC tests
Audit behavior decision
ErrorModel tests
Verification commands
Rollback/no-go criteria
```

---

# Global dependency map

```text
Epic 0 Governance
  → Epic 1 Foundation / Tenant / RBAC / ErrorModel
    → Epic 2 Workspace / Brand / Templates / Campaign / Brief
      → Epic 3 MediaJob / Assets / Usage-Cost
        → Epic 4 Review / Approval / Publish / Evidence
          → Epic 5 Reports / Audit / Operations

Epic 6 Deferred capabilities remain outside the current chain.
```

## Blocking dependency rules

1. Epic 3 must not proceed before Epic 1 and the relevant Epic 2 dependencies are verified.
2. Epic 4 must not proceed before MediaAssetVersion and content hash integrity are verified.
3. Epic 5 report snapshots must not proceed before ManualPublishEvidence immutability is verified.
4. No future agent/external publishing capability may bypass ApprovalDecision, AuditLog, UsageMeter/CostEvent controls, or human approval.

---

# Minimum PR template for the next implementation slice

Any next implementation PR must include:

```text
1. Selected Epic / Feature / Story IDs.
2. Authoritative source files.
3. In-scope behavior.
4. Out-of-scope behavior.
5. Allowed files.
6. Forbidden files.
7. ERD impact: none / patch required.
8. SQL impact: none / patch required.
9. OpenAPI impact: none / patch required.
10. QA impact: existing IDs / new QA patch required.
11. Permissions.
12. Audit events.
13. Error states.
14. Tenant isolation behavior.
15. Idempotency behavior if applicable.
16. Verification commands.
17. Rollback or NO-GO criteria.
18. Confirmation that Pilot and Production remain NO-GO.
```

---

# Final decision

This hierarchy is sufficient to support next-slice selection and execution planning.

It is not sufficient to authorize coding.

```text
GO: Use this document to choose and scope the next bounded implementation slice.
GO: Keep Epic/Feature/Story/Test/Priority/Dependency mapping visible.
NO-GO: Treat this document as direct implementation authorization.
NO-GO: Add new Core V1 capabilities from this document.
NO-GO: Start Media/Approval/Publish/Evidence/Usage/Cost runtime work without stronger gates.
NO-GO: Start agents, external publishing, paid execution, or Sprint 5.
```
