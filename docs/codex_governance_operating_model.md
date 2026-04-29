# Codex Governance Operating Model

## Executive status

```text
GO: Codex governance documentation.
NO-GO: runtime behavior changes.
NO-GO: SQL changes.
NO-GO: OpenAPI changes.
NO-GO: QA/test changes.
NO-GO: package/workflow/migration changes.
NO-GO: product feature implementation.
NO-GO: Sprint 5.
NO-GO: Pilot.
NO-GO: Production.
```

This document explains how Codex should operate in this repository. It is governance-only and does not authorize implementation.

## Authority model

The first current-state authorities are:

1. `README.md`
2. `docs/17_change_log.md`

After those, Codex should read the approved sources named in the user request, such as sprint reports, implementation reports, architecture contracts, SQL files, OpenAPI files, QA files, or planning documents.

`docs/marketing_os_v5_6_5_codex_implementation_instructions.md` remains useful as historical implementation guidance, but it must not override newer status decisions in `README.md` or `docs/17_change_log.md`.

If approved sources conflict, Codex must stop and report the conflict. It must not silently choose one source, infer new scope, or implement through ambiguity.

## Fit-gap and proposal handling

Fit-gap documents are discovery artifacts. They may identify possible future value, risks, dependencies, or candidate RFCs. They do not authorize implementation.

The same rule applies to:

- idea registers;
- future feature proposals;
- InPactAI fit-gap documents;
- Creator Marketplace discovery notes;
- AI/Campaign Canvas proposals;
- deferred remediation plans unless a later request explicitly approves implementation.

Any implementation needs a separately approved request with scoped files, behavior, tests, and verification gates.

## Documentation-only PR discipline

For documentation-only PRs, Codex must keep the diff limited to approved documentation or instruction files. Documentation-only PRs must not modify:

- `src/`;
- router/store files;
- `test/`;
- SQL files;
- OpenAPI files;
- `package.json`;
- `package-lock.json`;
- `.github/workflows/`;
- `scripts/`;
- migrations;
- `prototype/`;
- runtime behavior;
- product features.

Documentation-only wording must not imply that runtime behavior, SQL, OpenAPI, QA, package, workflow, migration, Pilot, Production, or product scope changed.

## Implementation PR discipline

Implementation PRs must be separately approved and scoped. Before coding, Codex must identify:

- current-state authority from `README.md` and `docs/17_change_log.md`;
- approved source files;
- exact implementation surface;
- allowed files;
- forbidden files;
- verification commands;
- CI hard gates;
- explicitly not implemented items.

If the request is unclear, Codex should stop and ask or report the ambiguity instead of broadening scope.

## Conflict policy

Codex must stop and report a conflict when:

- `README.md` and `docs/17_change_log.md` disagree about current status;
- a plan authorizes work that a newer current-state source marks NO-GO;
- OpenAPI, SQL, QA, and runtime documents disagree on an entity or endpoint;
- a documentation-only request requires a code, SQL, package, workflow, migration, test, or runtime change;
- a fit-gap document is presented as if it authorizes implementation.

Conflict reports should name the files, quote or summarize the conflicting statuses, and recommend a documentation reconciliation PR before implementation.

## Local skills

This repository includes local Codex skills under `.agents/skills/`:

- `docs-only-pr-review`: for documentation-only and governance-only PRs.
- `implementation-pr-review`: for separately approved implementation PRs.
- `runtime-sql-openapi-parity`: for parity review across runtime, SQL, OpenAPI, QA, and repository behavior.

Codex should use these skills when the task matches their scope.

## PR review expectations

Every PR summary should report:

- branch name;
- PR link;
- latest commit SHA;
- files changed;
- whether forbidden files changed;
- checks run;
- GitHub Actions status if available;
- risk assessment;
- safe to merge: yes/no.

For implementation PRs, Codex must also report any unresolved gaps and avoid GO decisions when a hard gate requires CI that has not passed.

## Permanent NO-GO boundaries unless separately approved

```text
NO-GO: Sprint 5 coding without an approved Sprint 5 plan.
NO-GO: Pilot.
NO-GO: Production.
NO-GO: frontend implementation from governance or fit-gap documents.
NO-GO: AI providers or AI-agent execution from governance or fit-gap documents.
NO-GO: auto-publishing.
NO-GO: paid execution.
NO-GO: advanced attribution.
NO-GO: BillingProvider / ProviderUsageLog.
NO-GO: feature expansion from fit-gap documents.
```

## Final decision

```text
GO: Codex operating discipline improvement.
NO-GO: runtime behavior changes.
NO-GO: product feature implementation.
NO-GO: Sprint 5.
NO-GO: Pilot.
NO-GO: Production.
```
