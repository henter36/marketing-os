# Marketing OS Intake and Triage Operating Model

## Executive Status

```text
Marketing OS intake and triage operating model: GO.
Implementation authorization from this document: NO-GO.
Product scope changes from this document: NO-GO.
Runtime behavior changes from this document: NO-GO.
```

This operating model prevents ideas, proposals, bugs, gaps, and governance issues from being lost while preventing premature implementation.

## Intake Path

```text
Conversation Intake -> AI Triage -> GitHub Issue or Parking Lot -> Triage Decision -> PR -> Verification -> Merge / No-Go
```

Definitions:

- Conversation Intake: an idea, issue, gap, bug, question, or proposal raised in chat, review, planning, or docs.
- AI Triage: classify the item, detect scope risk, identify affected contracts/docs/code areas, and decide whether it needs an issue, parking lot entry, or rejection.
- GitHub Issue or Parking Lot: capture actionable items as issues; park broad, speculative, duplicate, or premature ideas in docs until ready.
- Triage Decision: decide GO / CONDITIONAL GO / NO-GO for planning, implementation, QA, or documentation.
- PR: make changes only after scope is approved and bounded.
- Verification: run the approved verification gates for the PR type.
- Merge / No-Go: merge only if verification and review pass; otherwise close, defer, or revise.

## Non-Authorization Rules

```text
An Issue does not authorize implementation.
A Proposal does not authorize implementation.
A Fit/Gap document does not authorize implementation.
A Parking Lot item does not authorize implementation.
A PR must link to an approved Issue or approved governance decision.
Implementation requires approved scope, allowed files, forbidden files, and verification gates.
```

A PR that lacks approved scope must remain documentation-only or be treated as NO-GO.

## When To Create An Issue

Create a GitHub Issue when the item is concrete enough to be tracked and one of the following is true:

- A reproducible bug exists.
- A contract/runtime/SQL/OpenAPI/test gap is identified.
- A proposal needs review before planning or implementation.
- A QA gap needs a future test or acceptance criterion.
- A governance rule or operating model needs a decision.
- A future implementation could be valid but needs scope, files, and gates.

Every issue should identify the expected next decision: document, plan, implement, defer, reject, or investigate.

## When Not To Create An Issue

Do not create an issue when:

- The idea is too vague to classify.
- The idea duplicates an existing issue, plan, or fit/gap entry.
- The item is explicitly forbidden by current governance.
- The item would imply Sprint 5, Pilot, Production, frontend, DB-backed full persistence, Patch 002 DB persistence, AI agents, paid execution, or other NO-GO scope without approval.
- The issue would be used as a shortcut around contract review.

In these cases, use the Parking Lot or reject/defer with a reason.

## When To Use Parking Lot

Use Parking Lot treatment for ideas that are worth preserving but not ready for issues or PRs.

Parking Lot candidates include:

- Broad product ideas without clear acceptance criteria.
- Future-fit ideas from docs or conversations.
- Scope-expansion proposals that need RFC or contract review.
- Ideas blocked by existing NO-GO decisions.
- Suggestions that need customer, legal, security, or architecture validation before issue creation.

Parking Lot items should record enough context to recover the idea later, but they do not create implementation authority.

## When To Create A PR

Create a PR only when the work has a bounded approved scope.

Implementation PRs require:

- An approved issue or governance decision.
- Explicit allowed files.
- Explicit forbidden files.
- Verification gates.
- A GO / CONDITIONAL GO / NO-GO decision.
- No conflict with current NO-GO boundaries.

Documentation-only PRs may be created for reconciliation, planning, reports, and governance, but they must clearly state that they do not authorize implementation unless that is the explicit approved governance decision.

## When To Reject Or Defer

Reject or defer when:

- The proposal conflicts with current contracts or NO-GO boundaries.
- The work would change runtime behavior without approval.
- The work requires SQL/OpenAPI changes but no contract PR is approved.
- The work would create false Pilot or Production readiness.
- Verification gates are missing or cannot prove the claimed outcome.
- The idea is desirable but premature.

Rejected/deferred items should include a short reason and a possible unblock condition where useful.

## How To Classify Ideas From Existing Docs

Use this classification flow for ideas found in fit/gap docs, planning docs, reports, and conversation-derived notes:

| Source type | Default classification | Next action |
| --- | --- | --- |
| Verified implementation report | Evidence | Link from future issues/PRs; do not reinterpret scope. |
| Post-merge verification report | Evidence | Use as current-state proof; do not expand scope. |
| Fit/gap document | Proposal or Parking Lot | Create issue only when a specific bounded next step exists. |
| Candidate planning document | Planning evidence | Create next planning issue/PR only if recommendation is explicit. |
| Gap register | Gap Report or QA Gap | Create issue when resolution path is concrete. |
| QA suite/addendum | QA Gap or test planning | Create issue for missing/failed coverage. |
| Governance model | Governance Change | Create issue for changes to process or authority. |
| Conversation note | Conversation Intake | Triage before issue creation. |

## Required Issue Types

Use the repository issue templates for:

- Bug Report.
- Gap Report.
- Proposal.
- Governance Change.
- QA Gap.

## Triage Decision Labels

Recommended decision language:

```text
GO: approved for the stated bounded action.
CONDITIONAL GO: may proceed only after listed conditions are met.
NO-GO: blocked, rejected, or deferred.
PARKING LOT: preserve for future review; no implementation authority.
```

## PR Body Minimums

Every implementation PR should include:

- Linked approved issue or governance decision.
- Exact files changed.
- Confirmation no forbidden files changed.
- Scope implemented.
- Explicitly not implemented.
- Verification results.
- GO / NO-GO recommendation.

Every documentation-only PR should include:

- Exact files changed.
- Confirmation no forbidden files changed.
- Whether GitHub Actions ran.
- Statement that no implementation/runtime/product scope changed.

## Current NO-GO Boundaries

Unless separately approved, the following remain NO-GO:

```text
Runtime behavior changes from intake governance.
Product scope changes from intake governance.
SQL/OpenAPI changes from intake governance.
DB-backed full persistence.
Patch 002 DB persistence.
Sprint 5 coding.
Pilot.
Production.
```

## Final Decision

```text
GO: lightweight idea and issue intake governance.
GO: issue templates and decision log structure.
NO-GO: implementation work.
NO-GO: product scope changes.
NO-GO: runtime behavior changes.
```
