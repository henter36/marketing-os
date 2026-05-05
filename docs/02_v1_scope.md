# V1 Scope

> Status: Scope authority document for V1 / Phase 0-1. This file defines scope boundaries only and does not approve implementation by itself.

## Purpose

This file defines the approved execution scope boundaries for V1/Phase 0-1.

This scope authority must be read with current repository authority in `README.md`, `docs/17_change_log.md`, and the approved Phase 0/1 backlog, ERD, OpenAPI, SQL, and QA contracts. A capability listed here still requires matching backlog, ERD, OpenAPI, SQL, QA, runtime, and implementation approval before it can be built.

This Nashir patch is documentation-only. It does not approve backlog, ERD, OpenAPI, SQL, QA, runtime, tests, generated clients, package, workflow, migration, prototype, frontend, router/store, or implementation changes.

Nashir is the customer-facing campaign journey and publishing experience within the broader Marketing OS context unless later repository authority explicitly defines it differently. Nashir does not rename approved repository entities, supersede current entity naming, create new ERD concepts as approved entities, or change approved API/SQL/runtime contracts.

## Core V1 / Phase 0-1

Core V1 remains manual/export/review/approval/evidence only.

Core V1 may include Nashir scope candidates only where they stay within manual, user-confirmed, reviewable, approval-gated, and evidence-based workflows:

- Readiness Dashboard as a planning and visibility layer for missing inputs, manual readiness warnings, review status, approval status, checklist status, and evidence status.
- Smart Wizard as manual structured intake with explicit user confirmation.
- Product / Store / Service / Offer intake using user-provided data, uploaded files, or explicitly allowed public links only.
- Campaign basics and advertised object flow for manual campaign planning and draft brief preparation.
- Landing destination capture and review.
- Creative rights confirmation as a manual governance checkpoint.
- Idea intake as user-provided or draft planning input.
- Content requirements for draft campaign materials.
- Hashtags per selected channel as draft recommendations only, with no reach guarantee, trend ingestion, analytics optimization, or attribution claim.
- Video reference scripts as draft/reference outputs only, with no final video generation, video editing, asset procurement, or automated rights clearance.
- UTM Tracking Lite as structured link generation only, with no analytics ingestion or attribution.
- Human approval before manual publishing support.
- Approval lock as a scope principle: material changes after approval require re-review or reapproval before manual publishing support.
- Manual publishing checklist for user-operated publishing outside the system.
- Manual publishing evidence as user-provided proof of external manual publishing.
- Manual performance review using user-entered data only.

Core V1 Nashir scope does not authorize direct publishing, scheduling, paid execution, payment, analytics ingestion, attribution, external integrations, or autonomous AI execution.

## Extended V1 / Build Next

Extended V1 remains unapproved for implementation until a later scope patch, backlog patch, contract impact review, QA approval, and implementation request explicitly approve it.

Potential Nashir Extended V1 discussion topics may include Mobile OTP, Strategy Readiness, and Analysis Tools, but these are not Core V1 implementation scope from this patch.

## Post V1

Post V1 modules are reference-only and non-implementable without separate approval.

The Post V1 Organic Publishing Module and Post V1 Paid Campaign Execution Module remain outside Core V1. They may be discussed for future planning only and require separate PRD/RFC, backlog, ERD/OpenAPI/SQL/QA impact review, threat model, allowed files, forbidden files, verification gates, and implementation approval before any work.

## Excluded from Current Build

The following are outside Core V1 and must not be implemented from this scope patch:

- Agent Mode runtime
- AI Service Layer implementation
- external integrations
- direct publishing
- social OAuth
- scheduling
- paid ads
- payment
- analytics ingestion
- attribution
- autonomous AI execution
- Post V1 Organic Publishing Module
- Post V1 Paid Campaign Execution Module

Agent Mode may remain planning-only journey language. AI outputs, if discussed in later documents, must remain draft, advisory, reviewable, and human-approved unless later authority explicitly changes that boundary.

Budget, cost, and performance fields in Nashir planning are user-entered planning observations only. They do not authorize spend, payment, billing, invoice state, paid execution, analytics ingestion, or attribution.

## Approval Notes

- No coding agent may implement features not listed as approved Core V1 / Phase 0-1.
- Any change to this file must update `docs/03_decision_log.md` and `docs/17_change_log.md`.
- This file does not override current Phase 0/1 backlog, ERD, OpenAPI, SQL, QA, runtime, or verification authority.
- A backlog patch is the next possible documentation step after this scope patch is reviewed and approved.
- Any backlog, ERD, OpenAPI, SQL, QA, runtime, test, or implementation change requires separate explicit approval.
