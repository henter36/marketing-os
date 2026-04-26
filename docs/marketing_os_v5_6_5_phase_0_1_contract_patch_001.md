# Marketing OS V5.6.5 — Phase 0/1 Contract Patch 001

> **Document type:** Contract correction patch  
> **Applies to:** SQL DDL, OpenAPI, Sprint Backlog, QA Test Suite, Codex Instructions  
> **Patch SQL:** `docs/marketing_os_v5_6_5_phase_0_1_schema_patch_001.sql`  
> **Scope:** No new feature. Conflict correction only.  
> **Status:** Must be treated as binding before Sprint 0.

---

## 1. Executive Decision

This patch resolves two blocking contradictions discovered during pre-Sprint-0 review:

```text
1. ApprovalDecision / MediaAssetVersion approval flow conflict.
2. ManualPublishEvidence invalidate / append-only conflict.
```

This patch supersedes any conflicting wording in:

```text
docs/marketing_os_v5_6_5_phase_0_1_schema.sql
docs/marketing_os_v5_6_5_phase_0_1_openapi.yaml
docs/marketing_os_v5_6_5_phase_0_1_backlog.md
docs/marketing_os_v5_6_5_phase_0_1_qa_test_suite.md
docs/marketing_os_v5_6_5_codex_implementation_instructions.md
```

---

## 2. Correction A — ApprovalDecision Approves MediaAssetVersion

### Previous conflict

The original SQL validation required:

```text
MediaAssetVersion.version_status = approved
```

before an `ApprovalDecision` with `decision=approved` could be created.

This created a circular dependency:

```text
Version cannot become approved without approval.
Approval cannot be created unless version is already approved.
```

### Corrected rule

When creating an `ApprovalDecision`:

```text
1. ReviewTask.media_asset_version_id must match ApprovalDecision.media_asset_version_id.
2. If decision=approved, approved_content_hash is required.
3. approved_content_hash must equal MediaAssetVersion.content_hash.
4. After a valid approved decision is inserted, DB trigger sets MediaAssetVersion.version_status=approved.
5. The version does not need to be approved before the decision.
```

### SQL source

Implemented in:

```text
docs/marketing_os_v5_6_5_phase_0_1_schema_patch_001.sql
```

Functions:

```text
validate_approval_decision_integrity()
apply_approval_decision_effects()
prevent_approved_asset_version_update()
```

---

## 3. Correction B — ManualPublishEvidence Limited Invalidation

### Previous conflict

The original SQL treated `manual_publish_evidence` as fully append-only and blocked every `UPDATE`.

But OpenAPI/Backlog/QA require:

```text
POST /workspaces/{workspaceId}/manual-evidence/{manualPublishEvidenceId}/invalidate
```

### Corrected rule

`ManualPublishEvidence` remains protected, but a narrow invalidation update is allowed.

Allowed fields to change:

```text
evidence_status
invalidated_reason
```

Allowed transition:

```text
evidence_status -> invalidated
```

Forbidden fields remain immutable:

```text
manual_publish_evidence_id
workspace_id
publish_job_id
media_asset_version_id
published_url
screenshot_ref
external_post_id
content_hash
supersedes_evidence_id
submitted_by_user_id
submitted_at
created_at
```

DELETE remains forbidden.

### SQL source

Implemented in:

```text
docs/marketing_os_v5_6_5_phase_0_1_schema_patch_001.sql
```

Function:

```text
protect_manual_publish_evidence_update()
```

Trigger:

```text
trg_manual_publish_evidence_protect_update
```

---

## 4. OpenAPI Clarification

The existing OpenAPI endpoint remains valid:

```text
POST /workspaces/{workspaceId}/manual-evidence/{manualPublishEvidenceId}/invalidate
```

Clarified behavior:

```text
This endpoint performs a limited state update only.
It must not alter proof fields.
It must not expose PATCH.
It must not expose DELETE.
It must require invalidated_reason.
It must return ManualPublishEvidenceResponse.
```

No new endpoint is introduced.

Approval endpoint behavior remains valid:

```text
POST /workspaces/{workspaceId}/review-tasks/{reviewTaskId}/decisions
```

Clarified behavior:

```text
When decision=approved and hash validation passes, the backend/DB marks MediaAssetVersion as approved.
```

---

## 5. Backlog Clarification

### S3-02 — ApprovalDecision Integrity

Replace the relevant acceptance criterion with:

```text
- Approved decision requires approved_content_hash.
- approved_content_hash must match MediaAssetVersion.content_hash.
- Decision media_asset_version_id must match ReviewTask media_asset_version_id.
- Creating a valid approved ApprovalDecision marks MediaAssetVersion.version_status=approved through a safe DB trigger.
- ApprovalDecision remains append-only.
```

### S3-04 — ManualPublishEvidence Append-Only Submission

Clarified acceptance criteria:

```text
- No PATCH endpoint exists.
- No DELETE endpoint exists.
- Submitted proof fields are immutable.
- Supersede creates a new evidence row with supersedes_evidence_id.
- Invalidate performs a limited update to evidence_status=invalidated and invalidated_reason only.
- Invalidate must not modify published_url, screenshot_ref, external_post_id, content_hash, media_asset_version_id, submitted_by_user_id, submitted_at, or created_at.
```

---

## 6. QA Test Suite Clarification

### QA-APP-001 expected result

A valid approval with matching hash must:

```text
1. Create ApprovalDecision.
2. Set MediaAssetVersion.version_status=approved.
3. Preserve MediaAssetVersion content_hash unchanged.
```

### QA-DB-001 expected result

Corrected expected result:

```text
Approved MediaAssetVersion content and proof fields are immutable.
version_status may transition to approved via approval trigger.
After approved, version_status cannot move away from approved.
```

### QA-EVD-003 expected result

Corrected expected result:

```text
Direct DB update to proof fields is blocked.
Limited DB update to evidence_status=invalidated with invalidated_reason is allowed only through the protected invalidation path.
DELETE remains blocked.
```

### QA-EVD-004 expected result

No change:

```text
Supersede creates a new evidence row and does not delete or mutate proof fields of the old row.
```

### Additional test QA-EVD-006 — Invalidate allows only limited state update

**Severity:** P0  
**Layer:** API + Database

Steps:

```text
1. Create valid ManualPublishEvidence.
2. Call invalidate with invalidated_reason.
3. Verify evidence_status=invalidated.
4. Verify invalidated_reason is stored.
5. Verify proof fields remain unchanged.
6. Attempt to update published_url/content_hash/media_asset_version_id.
```

Expected result:

```text
Invalidation succeeds.
Proof-field update fails.
DELETE fails.
```

---

## 7. Codex Instruction Clarification

Codex must apply schema files in this order:

```text
1. docs/marketing_os_v5_6_5_phase_0_1_schema.sql
2. docs/marketing_os_v5_6_5_phase_0_1_schema_patch_001.sql
```

Codex must treat this patch as binding.

If implementation conflicts with this patch, Codex must stop and report the conflict.

---

## 8. Revised Execution Decision

After this patch:

```text
GO to OpenAPI validation.
GO to SQL migration dry-run.
GO to Codex Sprint 0 only after owner approval.
NO-GO to Sprint 1 until Sprint 0 tests pass.
NO-GO to Pilot until P0 tests pass.
```

---

## 9. Remaining Non-Blocking Risk

The SQL still requires actual PostgreSQL dry-run validation.

This patch resolves known logical contradictions, but it does not prove runtime execution until:

```text
npm run db:migrate
npm run openapi:lint
npm run test:integration
```

or equivalent commands exist and pass.
