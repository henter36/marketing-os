# Runtime/SQL Parity Gap Register

## Executive Status

- Gap register: GO.
- Runtime/SQL parity implementation: NO-GO.
- DB-backed Slice 1: NO-GO.
- Sprint 5: NO-GO.
- Pilot/Production: NO-GO.

## Gap Categories

- Field mismatch.
- Missing SQL constraint.
- Missing runtime validation.
- Status enum mismatch.
- Immutability mismatch.
- Append-only mismatch.
- Idempotency gap.
- Tenant isolation gap.
- RBAC gap.
- ErrorModel gap.
- Audit gap.
- OpenAPI mismatch.
- Test coverage gap.
- Patch 002 governance gap.
- Production-readiness false signal.

## Initial Gap Register

| Gap ID | Domain | Gap category | Description | Risk | Impact | Required resolution | Blocks Slice 1? | Blocks Pilot/Production? |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| GAP-001 | Product domains | Production-readiness false signal | Product domains still use in-memory runtime behavior by default. | Critical | DB-backed persistence cannot be claimed. | Keep runtime status explicit and require domain-specific repository slices. | Maybe | Yes |
| GAP-002 | Campaign | Test coverage gap | Runtime/SQL parity is not proven for Campaign create/list/get/update behavior. | High | Campaign persistence could drift from OpenAPI and runtime behavior. | Create campaign parity tests before implementation. | Maybe | Yes |
| GAP-003 | CampaignStateTransition | Idempotency gap | Campaign state changes are runtime-tested, but transactionally coupled DB state transition persistence is not proven. | High | State history could diverge from campaign state. | Define transaction policy and parity tests. | Maybe | Yes |
| GAP-004 | BriefVersion | Immutability mismatch | Runtime/SQL parity is not proven for BriefVersion content_hash generation and content immutability. | High | Mutable or mismatched brief content could break approval evidence. | Map hash generation, append-only behavior, and SQL protections. | Maybe | Yes |
| GAP-005 | MediaAssetVersion | Immutability mismatch | Runtime/SQL parity is not proven for MediaAssetVersion approval immutability. | High | Approved content could be mutated or detached from approvals. | Defer until approval/hash write-path policy exists. | No | Yes |
| GAP-006 | UsageMeter | Idempotency gap | Runtime/SQL parity is not proven for UsageMeter commercial usage rule transactionally. | High | Failed or unusable outputs could be metered incorrectly. | Define transactional source validation before DB-backed usage writes. | No | Yes |
| GAP-007 | CostEvent | Production-readiness false signal | Runtime/SQL parity is not proven for CostEvent financial non-source-of-truth behavior. | High | Cost event persistence could be mistaken for billing implementation. | Preserve non-billing language and add parity tests. | No | Yes |
| GAP-008 | PublishJob | Idempotency gap | Runtime/SQL parity is not proven for PublishJob approved hash and idempotency checks. | High | Unsafe publish records could be created. | Require atomic approved-hash/idempotency transaction design. | No | Yes |
| GAP-009 | ManualPublishEvidence | Immutability mismatch | Runtime/SQL parity is not proven for ManualPublishEvidence limited invalidation. | High | Evidence could be over-mutated or invalidated incorrectly. | Map Patch 001 invalidation rules to SQL/runtime tests. | No | Yes |
| GAP-010 | Patch 002 Credential | Patch 002 governance gap | Credential secret_ref-only behavior is not DB-runtime proven. | High | Raw secrets could be persisted or exposed if implemented incorrectly. | Add DB-runtime tests proving no raw secret storage or echo. | No | Yes |
| GAP-011 | Patch 002 ContactConsent | Append-only mismatch | Contact consent append-only behavior is not DB-runtime proven. | High | Consent/legal history could be mutated. | Add append-only DB-runtime tests before persistence. | No | Yes |
| GAP-012 | Patch 002 Notification | Idempotency gap | Notification failure isolation is not DB-runtime proven. | High | Failed delivery writes could roll back original operations. | Define transaction and failure isolation tests. | No | Yes |
| GAP-013 | AuditLog | Audit gap | AuditLog persistence/write coupling is not implemented. | High | Sensitive writes may not have durable audit evidence. | Define audit transaction coupling before write-path slices. | Maybe | Yes |
| GAP-014 | Write path | Idempotency gap | DB-backed write-path transaction policy is not implemented. | Critical | Multiple domains could persist partial or inconsistent state. | Approve write transaction/idempotency/audit policy. | Maybe | Yes |
| GAP-015 | Auth | Production-readiness false signal | Production authentication is not implemented. | Critical | Runtime cannot support Pilot or Production. | Implement and verify production auth in a later approved track. | No | Yes |
| GAP-016 | Root/src architecture | Production-readiness false signal | Root/src cleanup remains pending. | Medium | Architecture remains harder to reason about. | Plan separate cleanup branch after persistence direction is stable. | No | Yes |
| GAP-017 | Runtime mode | Production-readiness false signal | In-memory runtime remains default. | Critical | DB-backed full persistence cannot be claimed. | Keep status explicit and gate any runtime switch separately. | Maybe | Yes |
| GAP-018 | OpenAPI | OpenAPI mismatch | OpenAPI route presence does not prove repository persistence. | Medium | Contract coverage may be misread as persistence readiness. | Tie each route to runtime, SQL, repository, and test evidence. | Maybe | Yes |
| GAP-019 | Migration | Production-readiness false signal | Migration success does not prove runtime persistence. | Medium | SQL readiness may be over-interpreted. | Keep migration gates separate from repository/runtime parity gates. | No | Yes |
| GAP-020 | pg Adapter Slice 0 | Production-readiness false signal | pg adapter Slice 0 does not prove product-domain parity. | High | Slice 0 could be misread as full DB-backed runtime. | Keep Slice 0 limited to Workspace/Membership/RBAC reads. | Maybe | Yes |
| GAP-021 | Sprint 5 | Production-readiness false signal | Sprint 5 remains blocked until persistence/parity path is reviewed. | High | Scope could move ahead of persistence safety. | Review matrix, gap register, test plan, and Slice 1 candidate selection first. | Maybe | Yes |
| GAP-022 | BrandProfile / BrandVoiceRule | Missing runtime validation | Duplicate and active/inactive behavior must be compared to SQL constraints before persistence. | Medium | Narrow domain could still drift in duplicate or status handling. | Add parity tests if selected for Slice 1 planning. | Yes | Yes |
| GAP-023 | PromptTemplate / ReportTemplate | RBAC gap | System/workspace template boundaries and permissions are not DB-runtime proven. | Medium | Templates could leak across workspace/system boundaries. | Map template ownership and permission tests. | Maybe | Yes |
| GAP-024 | Patch 002 Performance | Immutability mismatch | Campaign metric snapshot immutability is runtime-tested but not DB-runtime proven. | High | Snapshot evidence could be mutated after capture. | Defer and add immutable DB-runtime tests before Patch 002 persistence. | No | Yes |
| GAP-025 | ErrorModel | ErrorModel gap | Product-domain DB errors are not yet mapped to ErrorModel because product repositories do not exist. | High | Raw SQL or driver errors could leak in future slices. | Require ErrorModel mapping tests in each repository slice. | Maybe | Yes |
| GAP-026 | Tenant isolation | Tenant isolation gap | Product-domain repository-level workspace filters are not implemented beyond Slice 0. | Critical | Cross-workspace leakage risk in future DB-backed domains. | Require explicit workspace filters and cross-workspace tests per domain. | Maybe | Yes |

## Final Status

- Initial gap register created.
- No gaps are marked resolved by this document.
- Runtime/SQL parity implementation remains NO-GO.
- DB-backed Slice 1 remains NO-GO until a candidate plan is reviewed.
- Sprint 5, Pilot, and Production remain NO-GO.
