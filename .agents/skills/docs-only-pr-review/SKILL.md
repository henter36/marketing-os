---
name: docs-only-pr-review
description: Review or prepare documentation-only PRs in henter36/marketing-os while preventing accidental runtime, SQL, OpenAPI, QA, package, workflow, migration, or product-scope changes.
---

# Documentation-only PR Review

Use this skill when a task is explicitly documentation-only or governance-only.

## Required source order

1. Read `README.md`.
2. Read `docs/17_change_log.md`.
3. Read any docs named by the user request.

`docs/marketing_os_v5_6_5_codex_implementation_instructions.md` is useful context, but newer `README.md` and `docs/17_change_log.md` win. If approved sources conflict, stop and report the conflict.

## Scope rules

Documentation-only PRs must not modify:

- `src/`;
- router/store files;
- `test/`;
- SQL files;
- OpenAPI files;
- `package.json` or lockfiles;
- `.github/workflows/`;
- `scripts/`;
- migrations;
- `prototype/`;
- runtime behavior;
- product features.

Fit-gap documents and idea documents do not authorize implementation.

## Review checklist

- Confirm changed files are docs/instruction files only.
- Confirm no runtime, SQL, OpenAPI, QA, package, workflow, migration, script, or prototype file changed.
- Confirm wording does not imply implementation, activation, Pilot, or Production readiness.
- Confirm any new plan has explicit NO-GO boundaries.
- Confirm `docs/17_change_log.md` is updated only if the request allows it.

## Output

Report:

- changed files;
- forbidden files changed: yes/no;
- checks run;
- CI status if available;
- risk assessment;
- safe to merge: yes/no.
