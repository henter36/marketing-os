# Decision Log

> Status: Draft — every approved architectural, product, operational, or commercial decision must be recorded here.

| ID | Date | Decision | Reason | Impact | Status | Affected Files |
|---|---|---|---|---|---|---|
| D-001 | TBD | Use phased execution: Phase 0/1 first | Prevent scope explosion and implementation risk | Codex must implement by approved sprint only | Draft | `docs/02_v1_scope.md`, `docs/11_sprint_plan.md` |
| D-002 | 2026-05-05 | Clarify Nashir Core V1 scope as manual/export/review/approval/evidence only | PR #95, PR #96, and PR #97 established Nashir journey, traceability, and reconciliation guidance requiring a scope patch before backlog or contract work | Adds Nashir as a customer-facing campaign journey within Marketing OS while keeping Agent Mode runtime, AI Service Layer implementation, external integrations, direct publishing, social OAuth, scheduling, paid ads, payment, analytics ingestion, attribution, autonomous AI execution, and Post V1 publishing/paid modules outside Core V1 | Approved documentation-only scope clarification | `docs/02_v1_scope.md`, `docs/03_decision_log.md`, `docs/17_change_log.md` |
| D-003 | 2026-05-05 | Add Nashir Core V1 backlog planning boundaries | PR #98 clarified Nashir Core V1 scope and identified backlog planning as the next documentation-only step | Records Nashir backlog planning as manual/export/review/approval/evidence only and keeps Agent Mode runtime, AI Service Layer implementation, external integrations, direct publishing, social OAuth, scheduling, paid ads, payment, analytics ingestion, attribution, autonomous AI execution, and Post V1 publishing/paid modules outside backlog implementation scope | Approved documentation-only backlog planning clarification | `docs/03_decision_log.md`, `docs/04_backlog.md`, `docs/17_change_log.md` |
| D-004 | 2026-05-05 | Define Nashir Campaign Readiness scoring semantics as planning-only | PR #100 identified Campaign Readiness scoring as a required future contract before implementation | Records planning-level completeness, confidence, risk gate, readiness level, and gate-state semantics while keeping readiness separate from human approval and publishing authorization; direct publishing, social OAuth, scheduling, paid ads, payment, analytics ingestion, attribution, external integrations, autonomous AI execution, and Post V1 modules remain NO-GO | Approved documentation-only scoring contract | `docs/nashir_campaign_readiness_scoring_contract.md`, `docs/03_decision_log.md`, `docs/17_change_log.md` |

## Rules

- Every scope change must create or update a decision entry.
- Every ERD/API-impacting decision must mention affected files.
- Do not rely on chat memory as the source of truth.
