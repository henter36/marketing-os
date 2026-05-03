# Phase 0/1 Threat Model

## Document status

Documentation-only STRIDE-style threat model for Phase 0/1. This document does not authorize implementation, runtime agents, external publishing, paid execution, SQL/OpenAPI changes, Sprint 5, Pilot, or Production.

## Executive decision

Marketing OS Phase 0/1 has the right governance posture, but its risk profile is high because it handles multi-tenant workspaces, approvals, publish evidence, usage/cost records, and future AI-assisted workflows.

Decision: **GO for threat documentation / NO-GO for Pilot or Production** until tenant isolation, RBAC, audit, evidence immutability, approval integrity, cost controls, ErrorModel, and idempotency are implemented and evidenced.

## System boundaries

### In scope

- Workspace and membership access
- RBAC and permission enforcement
- Campaign, brief, brand, template records
- MediaJob, MediaAsset, MediaAssetVersion
- ReviewTask and ApprovalDecision
- PublishJob without external auto-publishing
- ManualPublishEvidence
- TrackedLink as basic measurement only
- ClientReportSnapshot
- UsageMeter, CostEvent, CostGuardrail, quota state
- AuditLog
- SafeModeState and operations controls
- OpenAPI and ErrorModel behavior

### Out of scope / NO-GO

- Runtime agents
- External publishing connectors
- Auto-replies
- Paid ads execution
- Budget-changing agents
- Advanced attribution
- BillingProvider / ProviderUsageLog
- AgentRun
- Pilot
- Production

## STRIDE threat matrix

| ID | STRIDE | Threat | Impact | Existing / planned controls | Residual risk | Phase decision |
|---|---|---|---|---|---|---|
| TM-001 | Spoofing | User pretends to be another workspace member | Unauthorized access or writes | AuthGuard, WorkspaceContextGuard, MembershipCheck, RBAC | Depends on auth implementation strength | Must be tested before coding claims |
| TM-002 | Tampering | Request body includes different `workspace_id` than route | Cross-tenant record creation | Route/context workspace authority; body workspace_id not trusted | High if missed on any write endpoint | P0 gate |
| TM-003 | Repudiation | Sensitive write lacks AuditLog | Actor can deny action | AuditLog required for sensitive writes | Durable audit not fully proven in every slice | P0 for sensitive writes |
| TM-004 | Information disclosure | Workspace A reads Workspace B campaign, asset, usage, evidence, or report | Data breach | Tenant-scoped queries, RLS, QA-TI tests | Very high if repository/store query misses workspace filter | P0 gate |
| TM-005 | Denial of service | Repeated MediaJob creation consumes resources | Cost and availability impact | Idempotency-Key, CostGuardrail, quotas, SafeMode | Provider calls remain NO-GO; future risk material | Block real provider exposure until controls pass |
| TM-006 | Elevation of privilege | Viewer/Creator performs approval, publish, or cost action | Governance bypass | PermissionGuard, x-permission, RBAC seed | Permission seed drift risk | Add permission parity tests |
| TM-007 | Tampering | Approved MediaAssetVersion content is patched after approval | Publish unreviewed content | Immutable approved version, content_hash, ApprovalDecision | Requires DB trigger and API denial | P0 gate |
| TM-008 | Tampering | ApprovalDecision approves different version/hash than ReviewTask | Review bypass | ReviewTask version match, approved_content_hash match | High if service layer does not enforce | P0 gate |
| TM-009 | Tampering | PublishJob created from rejected decision or wrong hash | Unapproved publish workflow | Publish requires approved ApprovalDecision and matching hash | High trust failure | P0 gate |
| TM-010 | Tampering | ManualPublishEvidence proof fields are edited | Client/report/audit falsehood | No PATCH/DELETE, append-only, supersede/invalidate flow | Invalidate limited-update semantics must be tested | P0 gate |
| TM-011 | Repudiation | Manual evidence invalidation lacks reason/audit | Incomplete investigation trail | invalidated_reason and audit event | Reason quality not guaranteed | Require reason for invalidation |
| TM-012 | Information disclosure | Audit logs expose sensitive tenant data across workspaces | Privacy/security incident | audit.read permission and workspace scoping | Audit payload design may leak data | Minimize audit payload; scope reads |
| TM-013 | Tampering | ClientReportSnapshot generated from mutable live references | Historical report drift | Frozen report_snapshot_payload and evidence_snapshot_payload | Must verify no live recomputation | P0 gate |
| TM-014 | Repudiation | Correlation ID missing | Cannot investigate incident | ErrorModel and log correlation | Logging implementation must be consistent | P1/P0 depending endpoint |
| TM-015 | Tampering | UsageMeter records usage without usable output | Commercial dispute | usable_output_confirmed=true; idempotency | Very high if linked to billing later | P0 gate |
| TM-016 | Tampering | CostEvent treated as invoice/customer billing truth | Financial misstatement | Rule: CostEvent is not billing or invoice source | Future billing integration risk | Keep billing out of Phase 0/1 |
| TM-017 | Denial of service | Duplicate Idempotency-Key with different payload creates multiple records | Duplicate jobs, duplicate usage, duplicate publish | Idempotency conflict rule | Requires persistent idempotency store for DB-backed routes | P0 gate |
| TM-018 | Spoofing | Assignee or actor is not workspace member | Unauthorized review action | Assignee membership validation | Must be implemented in ReviewTask | P0/P1 |
| TM-019 | Elevation of privilege | Publisher approves content | Separation-of-duties failure | Publisher cannot approve unless approval.decide exists | Role composition must be explicit | P0 |
| TM-020 | Information disclosure | Report snapshot exposes hidden evidence or internal notes | Client trust/privacy issue | ReportTemplate, snapshot controls | Report payload review required | Before report exposure |
| TM-021 | Tampering | TrackedLink used to imply causal attribution | Misleading performance claims | Advanced attribution deferred; tracked link only | Product messaging risk | Add attribution boundary tests |
| TM-022 | Denial of service | Safe mode does not actually block risky operations | False operational control | SafeModeState and blocked operation policy | Current blocked list not normalized | Define per slice before claims |
| TM-023 | Tampering | OpenAPI endpoint added without x-permission | Unguarded action | QA-OAS-002 | Requires automated lint parity | P0 before frontend |
| TM-024 | Tampering | OpenAPI endpoint added without ErrorModel | Unhandled failures | QA-OAS and ErrorModel tests | Contract drift risk | P0 before frontend |
| TM-025 | Information disclosure | Prototype/frontend invents endpoints or fields | Data exposure / contract drift | Frontend must follow OpenAPI only | Frontend is not production | Keep frontend NO-GO until contract validation |
| TM-026 | Spoofing / Tampering | Runtime agent claims to approve/publish | Human approval bypass | Runtime agents NO-GO; approval remains human/system-recorded | Future agent risk high | Require separate RFC |
| TM-027 | Tampering | Raw AI output becomes publishable content directly | Unsafe claims, internal notes exposure | Future publishable extraction must be validated | Not yet active | Keep runtime AI/agents NO-GO |
| TM-028 | Information disclosure | Prompt or model output leaks tenant data | Cross-tenant/privacy failure | Tenant isolation, future prompt controls | Not solved in Phase 0/1 | No real provider exposure yet |
| TM-029 | Denial of service | Model/provider cost spike | Financial exposure | CostGuardrail, UsageMeter, SafeMode | Requires provider-side enforcement later | No real provider execution now |
| TM-030 | Supply chain | Dependency or generated client drift changes behavior | Build/runtime instability | package/workflow/generated files forbidden in docs PRs; OpenAPI validation | Future implementation PR risk | Require verification gate |
| TM-031 | Governance | Non-authoritative PRD/issue treated as implementation authority | Scope creep and unsafe implementation | Source-of-truth precedence | High with many planning docs | Keep precedence explicit |
| TM-032 | Governance | Draft Patch 003 leaks into Core V1 implementation | Unapproved competitive expansion | PR #24 Draft/NO-GO isolation | High until closed/merged intentionally | Exclude from unrelated PRs |

## Threats by critical domain

### Tenant isolation

Highest risk: workspace-scoped query missing `workspace_id` or trusting body workspace ID.

Required controls:

- Route/context workspace authority only.
- Membership check before entity access.
- RLS/session context where DB-backed.
- Tests for cross-workspace campaign, asset, usage, evidence, audit, report access.

Residual risk: in-memory and DB-backed paths may diverge unless every route/repository has parity tests.

### RBAC / privilege escalation

Highest risk: role has broader access than intended or endpoint lacks `x-permission`.

Required controls:

- PermissionGuard on every protected endpoint.
- OpenAPI `x-permission` parity against Permission seed.
- Separation between Reviewer and Publisher duties.
- BillingAdmin cannot modify campaign content.

Residual risk: role composition and custom roles need later governance if introduced.

### Approval integrity

Highest risk: PublishJob created from content that was not approved or hash changed after approval.

Required controls:

- ApprovalDecision must bind ReviewTask and MediaAssetVersion.
- approved_content_hash must equal MediaAssetVersion.content_hash.
- PublishJob must require approved ApprovalDecision and matching hash.
- Approved MediaAssetVersion must be immutable.

Residual risk: future agents must never approve themselves.

### Manual publish evidence

Highest risk: proof tampering after report generation.

Required controls:

- No PATCH/DELETE.
- Supersede creates new row.
- Invalidate updates limited status/reason only.
- Proof fields and content hash immutable.
- Audit event for submit/supersede/invalidate.

Residual risk: screenshot/URL authenticity is not cryptographically proven in Phase 0/1.

### Usage / cost abuse

Highest risk: usage counted without usable output or provider costs creating billing-like exposure.

Required controls:

- usable_output_confirmed=true.
- Idempotency-Key.
- Quantity > 0.
- CostEvent not invoice source.
- CostGuardrail before real generation.
- SafeMode for risky operations.

Residual risk: future provider integration requires stronger provider-level quotas and alerting.

### AI / prompt misuse

Highest risk: raw AI/model output includes unsafe, internal, or non-publishable text.

Current Phase 0/1 control: runtime agents and provider execution are NO-GO.

Future required controls before activation:

- Structured output validation.
- Publishable content extraction.
- BrandVoiceRules validation.
- Risk/compliance review.
- Human approval gate.
- Cost usage tracking.
- Raw output retention/redaction decision.

### External connectors

Highest risk: external publishing or platform API action occurs without human approval.

Current Phase 0/1 control: external publishing is NO-GO.

Future required controls:

- OAuth/token vault.
- Publishing Service separated from Agent.
- Approved hash binding.
- Publish evidence capture.
- Rollback/correction flow.
- Platform policy review.

### Audit log integrity

Highest risk: audit logs modified, missing, or treated as business state.

Required controls:

- Append-only AuditLog.
- Sensitive writes create audit events.
- Audit read is workspace-scoped and permissioned.
- Correlation ID in errors/logs.

Residual risk: audit payloads may expose more information than needed if not minimized.

## Required mitigations before implementation expansion

| Mitigation | Required before coding? | Applies to |
|---|---|---|
| Source-of-truth check | Yes | Every PR |
| Forbidden files check | Yes | Every PR |
| Permission parity check | Yes for endpoint PRs | OpenAPI/RBAC |
| Audit parity check | Yes for sensitive writes | API/service/database |
| Tenant isolation test | Yes for workspace-scoped routes | API/repository |
| Idempotency test | Yes for job/usage/publish writes | API/service |
| Manual evidence immutability test | Yes before evidence work | API/database |
| Approval hash binding test | Yes before approval/publish work | API/database |
| Usage/cost guardrail test | Yes before provider exposure | API/service |
| Threat model update | Yes for agents/connectors/paid execution | Governance |

## Final threat decision

Phase 0/1 is not production-safe by documentation alone. The contracts are strong, but the threat model confirms that any implementation slice must prove tenant isolation, RBAC, audit, idempotency, approval integrity, evidence immutability, report immutability, and usage/cost controls before any customer exposure.
