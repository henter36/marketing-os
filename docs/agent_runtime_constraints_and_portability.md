# Agent Runtime Constraints and Portability

> **Document type:** Governance / runtime portability constraint  
> **Scope:** Documentation-only  
> **Repository:** `henter36/marketing-os`  
> **Status date:** 2026-04-30  
> **Runtime impact:** None  
> **SQL/OpenAPI impact:** None  
> **Pilot:** NO-GO  
> **Production:** NO-GO

---

## Purpose

This document records the governance position for agent runtime selection, Claude Code usage, MCP-style integrations, local file automation, and setup-data governance in Marketing OS.

It is documentation-only. It does not authorize runtime changes, implementation changes, SQL changes, OpenAPI changes, QA changes, package changes, workflow changes, migrations, external provider execution, auto-publishing, Pilot, or Production readiness.

---

## Executive Decision

Marketing OS may use Claude Code or a similar coding-agent environment as an initial development and execution adapter, but the product architecture must remain platform-portable.

Claude Code-specific capabilities such as local file access, hooks, subagents, MCP integrations, command execution, and repository automation are implementation conveniences. They must not be treated as product-level architectural dependencies unless a future approved architecture contract explicitly makes them so.

---

## Runtime Boundary

The system concept is:

```text
research -> strategy -> content generation -> review -> approval -> publishing support -> performance learning
```

This workflow may be orchestrated through different execution adapters over time, including coding agents, hosted LLM products, custom backend orchestration, connector frameworks, or future internal agent runtimes.

Therefore, repository documents must avoid wording that implies Marketing OS only works on one vendor platform.

---

## Allowed Position

```text
GO: Claude Code or equivalent agent tooling as a development / execution adapter.
GO: MCP-style integrations as possible adapter-level capabilities.
GO: local file automation for development workflows where explicitly approved.
GO: documentation of runtime constraints and setup-data governance.
```

---

## Prohibited Position

```text
NO-GO: treating Claude Code as a mandatory product dependency.
NO-GO: describing the Marketing OS product as exclusive to Claude Code.
NO-GO: using adapter-specific capabilities to bypass repository governance.
NO-GO: adding AI agents, external provider execution, auto-publishing, or runtime orchestration without a separately approved implementation request.
NO-GO: SQL, OpenAPI, QA, runtime, package, workflow, migration, endpoint, or persistence changes from this document.
```

---

## Setup Data Governance

Setup files and seed knowledge such as brand voice, campaign brief, audience profiles, channel rules, product facts, claims, and examples must be treated as governed inputs, not casual prompt material.

Weak setup data creates weak outputs. Incorrect setup data can compound across research, strategy, copy generation, approval recommendations, and reporting.

Each approved setup artifact should define, at minimum:

```text
Owner
Source
Last updated date
Confidence level
Approved examples
Rejected examples
Claims / compliance restrictions
Review status
Change history
```

---

## Brand Voice and Campaign Brief Rule

A `brand-voice.md`, `campaign-brief.md`, or equivalent setup artifact must not be treated as authoritative merely because it exists.

It becomes usable only when its source, owner, review state, and confidence are clear. If these are missing, the system must treat the artifact as draft input and surface a governance gap instead of silently relying on it.

---

## Product Architecture Implication

Marketing OS should preserve this separation:

```text
Product capability != agent runtime adapter
Governed setup data != casual prompt memory
Adapter convenience != architecture dependency
Generated content != approved content
Assistant suggestion != publication approval
```

This protects the product from vendor lock-in, setup-data drift, hallucinated audience assumptions, unapproved marketing claims, and premature AI-agent implementation.

---

## Current Scope Impact

This document does not change current repository status after PR #67.

```text
Runtime changes: NO-GO
SQL changes: NO-GO
OpenAPI changes: NO-GO
QA changes: NO-GO
External provider execution: NO-GO
Auto-publishing: NO-GO
AI agent implementation: NO-GO
DB-backed full persistence: NO-GO
Sprint 5 coding: NO-GO
Pilot: NO-GO
Production: NO-GO
```

---

## Required Future Review Before Implementation

Before implementing any agent runtime adapter, MCP connector, multi-agent orchestration, local memory automation, or setup-data workflow, a future PR must define:

```text
Approved issue or governance decision
Exact runtime adapter scope
Allowed files
Forbidden files
Security model
Data access model
Audit logging model
Approval gates
Failure and fallback behavior
Cost controls
QA coverage
Rollback plan
```

---

## Final Decision

```text
GO: document Claude Code / agent runtime portability and setup-data governance.
NO-GO: vendor lock-in as a product rule.
NO-GO: treating setup files as authoritative without governance metadata.
NO-GO: implementation or runtime change from this document.
```
