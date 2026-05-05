# Nashir Dual-Path Customer Journey and Campaign Flow

## 1. Purpose

This document is documentation-only. It describes a draft customer-facing Nashir journey and campaign flow for future planning, governance review, and scope discussion inside the broader Marketing OS context.

It does not approve implementation. It does not modify PRD, ERD, OpenAPI, SQL, QA, runtime, or generated clients.

This is a customer journey and capability scope artifact. It is pre-implementation and exists to make future planning reviewable before any contract, runtime, data model, API, QA, or client work is proposed.

## 2. Scope

This artifact covers a dual-path customer journey from registration through campaign intake, readiness review, draft content generation, human approval, manual publishing support, manual evidence capture, and manual performance review.

Nashir is treated in this document as the customer-facing campaign journey and publishing experience within the broader Marketing OS context, unless later repository authority defines it differently.

Core V1 is manual/export/review/approval/evidence only.

Post V1 modules described here are reference-only. They are non-implementable without separate approval, contract impact review, allowed files, forbidden files, verification commands, and explicit NO-GO boundaries.

## 3. Non-goals

This document does not authorize:

- runtime route changes;
- new endpoints;
- SQL or ERD changes;
- OpenAPI changes;
- QA changes;
- generated client changes;
- frontend implementation;
- direct publishing;
- social OAuth;
- scheduling;
- paid ads;
- payment;
- analytics ingestion;
- attribution;
- autonomous AI execution.

This document also does not authorize renaming approved repository entities, superseding repository authority, creating new ERD concepts as approved entities, or treating conceptual journey states as runtime, API, database, QA, or generated-client changes.

## 4. Phase classification

The journey is classified as planning/governance only.

Core V1 concepts may be considered only where they fit the current manual/export/review/approval/evidence boundary. Post V1 concepts are reference-only and non-implementable without separate approval.

| Capability | Classification | Core V1 boundary |
|---|---|---|
| Google/email sign-in | Planning only | May be discussed as authentication journey context only; no implementation approval. |
| Mobile OTP | Planning only | May be discussed as authentication journey context only; no implementation approval. |
| Workspace creation | Core V1 concept if already authorized elsewhere | Must preserve workspace context, membership, permissions, and ErrorModel guardrails. |
| Readiness Dashboard | Planning only | Manual readiness summary only; no analytics ingestion or automated external connection. |
| Agent Mode intake | Planning only | Advisory intake only; no autonomous execution. |
| Smart Wizard intake | Planning only | Structured manual intake only; no autonomous execution. |
| Intake Orchestration Layer | Conceptual only | Normalizes inputs for review; no runtime, API, or DB approval. |
| Product-first intake | Planning only | User-provided product details only. |
| Store-first intake | Planning only | User-provided or explicitly allowed public store data only. |
| Service-first intake, lightweight | Planning only | User-provided service details only. |
| Offer / Promotion intake | Planning only | Planning input only; no spend, publishing, or payment approval. |
| Data Readiness Score | Conceptual only | Confidence signal only; no implementation approval. |
| Campaign Readiness Gate | Conceptual only | Manual/export/review gate only; no automated execution. |
| Draft Campaign Brief | Core V1 concept | Draft, advisory, reviewable output only. |
| AI-generated ad drafts | Planning only | Draft, advisory, reviewable outputs only. |
| Hashtags per selected channel | Planning only | Draft recommendations only; no reach guarantee. |
| Video reference scripts | Planning only | Script drafts only; no video editing or final video generation. |
| Creative Rights Confirmation | Core V1 concept | Manual confirmation only. |
| UTM Tracking Lite | Planning only | Structured link generation only; no analytics ingestion or attribution. |
| Human Approval | Core V1 concept | Required before manual publishing support. |
| Manual Publishing Checklist | Core V1 concept | Manual checklist only; no direct publishing. |
| Manual Publishing Evidence | Core V1 concept | User-provided evidence only. |
| Manual Performance Review | Core V1 concept | Manual entered observations only. |
| Organic direct publishing | Post V1 reference-only | NO-GO in Core V1. |
| Paid campaign execution | Post V1 reference-only | NO-GO in Core V1. |
| Payment | Post V1 reference-only | NO-GO in Core V1. |
| Automated performance review | Post V1 reference-only | NO-GO in Core V1. |

## 5. Relationship between Nashir and Marketing OS

Marketing OS remains the contract-first repository and authority for implementation readiness. Nashir, as described here, is the customer-facing campaign journey and publishing experience that may sit within or on top of Marketing OS workflows.

This document does not rename entities, create product scope, or supersede current repository status. If later repository authority defines Nashir differently, that authority must explicitly supersede this document.

## 6. Registration Journey

The registration journey starts with a user creating or joining an account context. The intended planning flow is:

1. user registers or is invited;
2. user accepts required terms;
3. user reaches a workspace selection or creation step;
4. user is routed to readiness review before campaign execution.

Registration planning must preserve authentication, workspace context, membership, permission, and ErrorModel guardrails from current Marketing OS authority.

## 7. Workspace creation

Workspace creation is the point where the user establishes the operating context for campaign work. Workspace-scoped activity must use route-derived or context-derived workspace authority. `workspace_id` from request bodies must not be trusted.

Core V1 planning should treat workspace setup as a prerequisite for campaign drafting, approval, evidence, and review flows.

## 8. Readiness Dashboard

The readiness dashboard is a planning concept for showing whether enough user-provided information exists to begin a campaign journey.

It may summarize:

- workspace setup status;
- profile completion status;
- available campaign inputs;
- missing manual approvals;
- manual publishing checklist status;
- manual evidence status.

The readiness dashboard must not imply analytics ingestion, external account connection, direct publishing, automated scheduling, or paid campaign execution in Core V1.

## 9. Dual Intake Modes

Nashir planning uses two intake modes:

- Agent Mode: a guided conversational intake that helps collect structured campaign inputs.
- Smart Wizard Mode: a step-based form intake that collects the same governed inputs through explicit fields and review checkpoints.

Both modes are intake experiences only. Neither mode authorizes autonomous execution.

## 10. Agent Mode

Agent Mode may ask questions, summarize user-provided answers, and draft campaign inputs for human review.

AI outputs are draft, advisory, reviewable, and must not bypass human approval.

AI must not publish, schedule, spend, update protected profile fields, or access external tools without explicit consent and approved contracts.

## 11. Smart Wizard Mode

Smart Wizard Mode is a structured manual intake path. It should collect campaign objective, audience, offer, channels, content requirements, approval needs, publishing plan, and evidence expectations.

The wizard should make human confirmation explicit before any campaign material is considered ready for export or manual publishing.

## 12. Intake Orchestration Layer

The intake orchestration layer is a conceptual planning layer that normalizes inputs from Agent Mode and Smart Wizard Mode into one reviewable campaign brief.

It does not define runtime architecture, service boundaries, queue behavior, database schema, or API endpoints.

## 13. Profile entities as conceptual only, not ERD

Profile concepts in this document are conceptual only and are not ERD definitions.

Conceptual profiles may include:

- company profile;
- brand profile;
- audience profile;
- offer profile;
- channel profile;
- campaign preference profile.

These concepts do not create entities, tables, relationships, migrations, or repository obligations.

## 14. Profile Completion and Data Readiness

Profile completion is a planning concept for assessing whether the user has provided enough information for campaign drafting and review.

Data readiness should distinguish:

- required manual inputs;
- optional supporting inputs;
- missing review decisions;
- missing rights confirmations;
- missing manual publishing evidence.

Profile completion must not automatically update protected profile fields or approve campaign execution.

## 15. Analysis Tools with Core V1 limitations

Any Core V1 analysis tool must operate only on user-provided data, uploaded files, or explicitly allowed public links.

Core V1 analysis tools may produce draft summaries, risks, channel suggestions, content angles, and readiness notes. They must not collect analytics, connect to external accounts, scrape private sources, perform attribution, or execute campaigns.

## 16. Campaign Journey grouped into 8 groups

The campaign journey is grouped into eight planning groups:

1. Setup and readiness: workspace, profile completion, and missing input review.
2. Objective and audience: campaign goal, segment, market, and desired action.
3. Offer and message: value proposition, proof points, objections, and call to action.
4. Channel selection: manual selection of channels and channel-specific constraints.
5. Content drafting: draft copy, creative notes, hashtags, and video reference scripts.
6. Governance review: rights confirmation, human approval, and readiness gate checks.
7. Manual publishing support: checklist, exports, structured links, and publishing evidence.
8. Manual performance review: user-entered observations, outcome notes, and next-step recommendations.

## 17. Campaign Readiness Gate

The campaign readiness gate determines whether campaign materials are ready for manual export and human-approved manual publishing.

The gate should check:

- required intake fields;
- selected channels;
- landing destination;
- UTM Lite links where applicable;
- creative rights confirmation;
- human approval status;
- manual publishing checklist status.

Passing this gate does not authorize direct publishing, scheduling, paid execution, or autonomous AI action.

## 18. Content Generation Outputs

Content generation outputs are drafts only. They may include:

- campaign brief summary;
- channel-specific copy;
- image or creative direction notes;
- headline options;
- call-to-action options;
- hashtag sets;
- video reference scripts;
- manual publishing checklist items.

Outputs must remain reviewable and editable by a human.

## 19. Hashtags per selected channel

Hashtags may be generated per selected channel as draft recommendations.

Channel hashtag behavior must remain advisory in Core V1. No external trend ingestion, social account connection, automated optimization, or analytics-based attribution is approved by this document.

## 20. Video Reference Scripts

Video reference scripts may describe suggested scenes, talking points, voiceover drafts, timing notes, and creative requirements.

Video scripts are planning outputs only. They do not authorize video generation, automated publishing, external asset procurement, or rights clearance automation.

## 21. Creative Rights Confirmation

Creative rights confirmation is a required governance checkpoint before manual publishing support.

The user must confirm that supplied images, videos, audio, logos, claims, and third-party references are permitted for the intended use. This document does not define legal review automation or rights verification integrations.

## 22. Landing Destination

A landing destination is the manually selected destination URL or destination instruction for the campaign.

Core V1 planning may require the user to provide and confirm the landing destination before export. The system must not infer authority to create, edit, host, or track landing pages from this document.

## 23. UTM Tracking Lite with no analytics ingestion in Core V1

UTM Lite only generates structured links and does not collect, ingest, or attribute analytics in Core V1.

UTM Lite may help format source, medium, campaign, content, and term parameters for user review. It must not connect to analytics platforms, ingest performance data, or claim attribution.

## 24. Content Versioning

Content versioning is a planning concept for preserving draft history and approval context.

Core V1 content versioning should support human comparison and approval readiness only. This document does not approve database schema, API, or runtime changes for version storage.

## 25. Human Approval Governance

Human approval is mandatory before manual publishing support.

AI outputs are draft, advisory, reviewable, and must not bypass human approval. Approval records and evidence must follow approved repository contracts if implementation is separately authorized later.

## 26. Manual Publishing Checklist

The manual publishing checklist helps the user confirm that campaign materials are ready to publish manually outside the system.

Checklist items may include:

- channel selected;
- copy reviewed;
- creative rights confirmed;
- landing destination confirmed;
- UTM Lite link reviewed;
- approval completed;
- publishing owner assigned;
- evidence capture instructions acknowledged.

## 27. Manual Publishing Evidence

Manual publishing evidence is user-provided proof that publishing occurred outside the system.

Evidence may include URLs, screenshots, timestamps, owner notes, or channel-specific references. This document does not approve external publishing, social OAuth, or automated evidence collection.

## 28. Manual Performance Review

Manual performance review is a user-entered review of campaign outcomes.

Core V1 may plan for manually entered observations and notes only. Analytics ingestion, attribution, automated optimization, paid media reporting, and connected platform metrics remain NO-GO.

## 29. Campaign State Machine

A conceptual campaign state machine may include:

```text
draft_intake
profile_review
content_drafting
rights_review
approval_review
ready_for_manual_publish
manual_publish_in_progress
manual_evidence_submitted
manual_performance_review
closed
```

These states are conceptual and do not approve runtime, ERD, SQL, OpenAPI, or QA changes.

## 30. External Integrations Scope

External integrations are not approved for Core V1 implementation by this document.

Direct publishing, social OAuth, scheduling, paid ads, payment, analytics ingestion, attribution, and autonomous AI execution remain NO-GO.

Any future external integration must have separate RFC, contract impact review, OpenAPI/SQL/QA approval where applicable, implementation scope, and verification gates.

## 31. AI Tools and Model Governance

AI tools may support draft generation, summarization, classification, and review suggestions only where separately authorized.

AI outputs are draft, advisory, reviewable, and must not bypass human approval.

AI must not publish, schedule, spend, update protected profile fields, or access external tools without explicit consent and approved contracts.

Any Core V1 analysis tool must operate only on user-provided data, uploaded files, or explicitly allowed public links.

## 32. Post V1 Organic Publishing Module as reference-only

The Post V1 Organic Publishing Module is reference-only and non-implementable without separate approval.

It may be discussed as a possible future module for social account connection, scheduling, publishing workflows, and platform status capture, but none of those capabilities are approved for Core V1.

## 33. Post V1 Paid Campaign Execution Module as reference-only

The Post V1 Paid Campaign Execution Module is reference-only and non-implementable without separate approval.

It may be discussed as a possible future module for paid campaign setup, budget handling, bidding, payment, ad platform integration, and reporting, but none of those capabilities are approved for Core V1.

## 34. Remaining gaps and required future documents

Before any implementation can be considered, future approved documents would need to define:

- authoritative Nashir product relationship to Marketing OS;
- approved Core V1 scope extraction;
- backlog mapping;
- ERD impact review;
- OpenAPI impact review;
- SQL impact review;
- QA plan;
- runtime architecture plan;
- AI governance contract;
- external integration policy;
- manual evidence and approval traceability;
- explicit allowed files, forbidden files, verification commands, and CI gates.

## 35. Expanded journey and governance detail

This section expands the baseline journey into more complete planning detail. Every item in this section is conceptual unless already approved by repository authority outside this document.

### 35.1 Registration and account journey

The registration journey may be planned around Google/email sign-in, mobile OTP sign-in, user account setup, default workspace creation or assignment, membership establishment, auth method tracking, and onboarding status.

Core planning assumptions:

- Google/email sign-in is an authentication journey concept only.
- Mobile OTP is an authentication journey concept only.
- A user account represents the signed-in person, not a new approved ERD entity from this document.
- A default workspace may be used as the first workspace context for campaign planning.
- Membership determines the user's relationship to the workspace.
- Auth method may be tracked conceptually for onboarding and support review.
- Onboarding status may indicate whether readiness review is complete.
- Gmail data access is not granted by default.

No Gmail, Google Drive, inbox, contact, advertising, or analytics data access is approved by this document.

### 35.2 Readiness Dashboard detail

The Readiness Dashboard may show four readiness dimensions:

- Profile Completion: whether required business, brand, audience, product, service, store, offer, channel, and governance details have been supplied or confirmed.
- Data Readiness: whether available inputs are specific, current, trusted, and sufficient for drafting.
- Strategy Readiness: whether objective, audience, offer, positioning, channel fit, and CTA are coherent enough for a campaign brief.
- Campaign Readiness: whether the campaign is ready for draft generation, review, approval, manual publishing support, or follow-up.

The dashboard may include:

- missing data checklist;
- continue with assistant;
- continue with smart wizard;
- quick start draft warning.

A quick start draft warning should state that lower readiness may reduce output quality or confidence. Low readiness may downgrade confidence but does not always block draft generation.

### 35.3 Dual intake mode detail

Agent Mode and Smart Wizard Mode both feed the same Intake Orchestration Layer. They must not create competing data structures, conflicting profile facts, or separate campaign truth sources.

Both modes are intake and review experiences only. They do not approve autonomous execution, direct publishing, scheduling, spend, payment, analytics ingestion, or external tool access.

### 35.4 Agent Mode detail

Agent Mode may:

- ask scoped questions;
- detect missing fields;
- clarify ambiguous answers;
- ask confirmation for sensitive fields;
- summarize user-provided information;
- propose draft answers for review.

Agent Mode must:

- never store inferred data as confirmed fact;
- never automatically overwrite confirmed values;
- ask for confirmation before updating sensitive fields;
- preserve the difference between user-confirmed facts and system-inferred suggestions;
- keep AI outputs draft, advisory, and reviewable.

### 35.5 Smart Wizard Mode detail

Smart Wizard Mode may be organized into these sections:

- business identity;
- store/product/service details;
- audience;
- brand tone;
- claims and restrictions;
- social channels;
- data sources;
- review and confirmation.

Each section should require explicit user confirmation before the information is treated as confirmed planning input.

### 35.6 Intake Orchestration Layer detail

The Intake Orchestration Layer is conceptual. It normalizes answers from Agent Mode and Smart Wizard Mode into reviewable planning inputs.

Metadata requirements for each normalized field may include:

- source;
- confidence;
- validation status;
- last updated timestamp;
- updated by;
- review status.

Allowed source types:

- user_confirmed;
- system_inferred;
- tool_observed;
- imported;
- pending_review.

These metadata items are not ERD, SQL, API, runtime, QA, or generated-client requirements unless later approved by repository authority.

### 35.7 Conceptual profile entities

The following are conceptual profile entities only and are not approved ERD entities from this document:

- User;
- Workspace;
- StrategicProfile;
- BusinessIdentity;
- BrandProfile;
- AudienceProfile;
- ProductProfile;
- ServiceProfile;
- StoreProfile;
- GovernanceProfile;
- IntakeSession;
- IntakeAnswer;
- ProfileCompletionSignal;
- DataReadinessScore;
- ConnectedDataSource;
- AuditLog.

These terms are planning labels. They do not create tables, relationships, migrations, repositories, endpoints, generated clients, tests, or runtime behavior.

### 35.8 Profile Completion, Data Readiness, Strategy Readiness, and Campaign Readiness

Profile Completion measures whether expected profile fields are present and reviewed.

Data Readiness measures whether available inputs are specific, recent, trusted, and usable.

Strategy Readiness measures whether objective, audience, offer, claims, channel fit, budget planning, timing, and CTA are coherent.

Campaign Readiness measures whether a specific campaign can move into draft generation, review, approval, manual publishing support, and manual follow-up.

Readiness levels:

- Low: many required inputs are missing or unconfirmed.
- Medium: enough data exists for a rough draft, but important gaps remain.
- Good: most required inputs are present and coherent.
- High: inputs are specific, confirmed, and suitable for stronger draft confidence.

Low readiness downgrades confidence but does not always block drafting. The system may allow a quick draft with warnings where manual review remains mandatory.

### 35.9 Analysis tools with Core V1 limitations

Any Core V1 analysis tool must operate only on user-provided data, uploaded files, or explicitly allowed public links.

Core V1 analysis tools must not imply API integration, OAuth, automated ingestion, analytics collection, scraping, or external execution.

Planning examples:

- Store Audit: reviews user-provided store information or explicitly allowed public links.
- Product Page Analyzer: reviews user-provided product page content or explicitly allowed public links.
- Service Offer Analyzer: reviews supplied service descriptions, benefits, proof, and restrictions.
- Social Profile Audit: reviews user-provided screenshots, exported text, or explicitly allowed public links only.
- Content Asset Analyzer: reviews uploaded files or user-provided asset notes only.
- SEO / Search Intent Lite: provides lightweight planning suggestions from user-provided terms or allowed public links only.
- Competitor Context: uses user-provided competitor names, notes, screenshots, or explicitly allowed public links only.
- Reviews / Comments Intelligence: summarizes user-provided reviews, comments, exports, screenshots, or explicitly allowed public links only.

### 35.10 Campaign journey expanded into eight groups

Group 1: Start Campaign

- choose new campaign or continue draft;
- select workspace context;
- choose Agent Mode or Smart Wizard Mode;
- review readiness warnings;
- choose quick start or improve data first.

Group 2: Campaign Basics

- campaign name;
- campaign type;
- primary objective;
- optional secondary objective;
- primary KPI;
- optional secondary KPI;
- geography / market;
- language;
- budget type;
- budget range or amount;
- start date;
- end date;
- occasion or season.

Budget in Core V1 is planning information only and does not authorize spend.

Group 3: Advertised Object

Product path:

- product name;
- product link;
- price;
- offer;
- category;
- key benefits;
- expected objections;
- target audience;
- product images;
- reference video;
- availability;
- phrases or claims to avoid.

Store path:

- store link;
- category;
- best products/categories;
- brand promise;
- primary audience;
- trust elements;
- current offer.

Service path:

- service name;
- description;
- target customer;
- customer problem;
- expected outcome;
- booking/contact method;
- geographic scope;
- trust elements;
- claim restrictions;
- images/videos/testimonials.

Offer / Promotion path:

- offer type;
- related product/service;
- discount or added value;
- duration;
- terms;
- quantity or availability limit;
- CTA;
- minimum purchase condition if any.

Group 4: Destination, Assets, and Rights

Landing destination options:

- product link;
- store link;
- WhatsApp;
- contact form;
- booking page;
- direct call;
- no link/manual organic post only.

Creative asset inputs:

- product image;
- lifestyle image;
- reference video;
- previous ad creative;
- logo;
- brand assets.

Rights confirmation questions:

- Do you own the right to use this image/video?
- Does it contain identifiable people?
- Do you have permission from those people?
- Does it contain third-party logos or marks?
- Was the asset generated by AI?

Group 5: Idea, Content, and Channels

Idea intake options:

- I have an idea;
- Suggest ideas for me;
- I have a reference;
- I want something similar to a previous campaign;
- I want multiple directions to compare.

Recommendation logic examples:

- Product + product image + no offer -> Direct Benefit Angle.
- Service + testimonials -> Social Proof Angle.
- Limited offer -> Urgency Angle.
- New product -> Educational Angle.

Content requirements:

- short ad copy;
- long ad copy;
- headlines;
- CTA;
- caption;
- hashtags;
- short video script;
- story copy;
- carousel slide copy.

Ad formats:

- static image;
- carousel;
- story;
- reel / short video;
- text post;
- product post;
- offer post.

Channels:

- Instagram;
- TikTok;
- Snapchat;
- X;
- YouTube Shorts;
- Facebook;
- LinkedIn;
- WhatsApp as destination only, not automated publishing channel in Core V1.

Hashtag groups:

- hashtags per selected channel;
- brand hashtags;
- product/category hashtags;
- local/market hashtags;
- intent hashtags;
- seasonal hashtags.

Hashtags must be reviewed by a human and do not guarantee reach.

Group 6: Campaign Readiness Gate

Example:

```text
Campaign Readiness: 74/100
Missing:
- no visual reference
- offer not defined
- target location not specific
Warnings:
- daily budget is lower than recommended
- audience is broad
Actions:
- generate draft now
- improve data first
- ask assistant to complete missing fields
- switch to guided wizard
```

Gate states:

- pass;
- soft_pass;
- fail;
- blocked_until_review.

Group 7: Generation and Review

Content generation outputs may include:

- Campaign Brief Draft;
- main selling angle;
- three ad ideas;
- three ad copy variants;
- three headlines;
- CTA options;
- hashtag sets per channel;
- creative direction;
- visual direction;
- video hook/script if requested;
- UTM links if destination exists;
- risk warnings;
- missing data notes;
- channel fit notes.

Video reference script outputs may include:

- Reel / TikTok Hook Script;
- Story Script;
- Product Demo Script;
- Voiceover Draft;
- Simple Shot List.

Core V1 does not edit video, generate final videos, or perform advanced visual analysis.

Review and edit actions may include:

- edit text;
- request shorter version;
- change tone;
- modify CTA;
- modify hashtags;
- change idea angle;
- generate alternatives;
- compare versions;
- mark favorite;
- submit for review.

Policy and brand checks may include:

- brand tone alignment;
- prohibited claims;
- rights status;
- channel fit;
- CTA clarity;
- offer terms;
- misleading promises;
- sensitive or restricted content.

Group 8: Checks, Approval, Manual Publishing, and Follow-Up

Approval states:

- draft;
- in_review;
- changes_requested;
- approved;
- rejected;
- requires_reapproval.

Approval Lock: Any material change after approval resets to requires_reapproval.

Material changes:

- body text;
- headline;
- CTA;
- image/video;
- hashtags;
- link;
- offer;
- channel.

Manual publishing checklist:

- copy final text;
- use approved hashtags;
- use UTM link if available;
- download or prepare assets;
- publish manually outside platform;
- enter published URL;
- upload screenshot;
- record date/time;
- confirm channel;
- assign follow-up owner;
- schedule performance review.

Manual publishing evidence:

- channel;
- published URL;
- screenshot;
- published date/time;
- notes;
- content version ID;
- hashtags used;
- CTA used.

Manual performance review:

- channel;
- published URL;
- published date;
- reach;
- clicks;
- messages;
- leads;
- purchases/sales if available;
- cost if any;
- audience reaction notes;
- what worked;
- what failed;
- self-rating;
- next action.

Next action options:

- improve ad;
- repeat with same setup;
- try different angle;
- increase budget;
- stop.

Budget and cost fields in manual performance review are user-entered planning observations only. They do not authorize spend, payment, billing, invoice state, or attribution.

### 35.11 Campaign State Machine detail

Conceptual campaign state flow:

```text
draft
-> in_progress
-> ready_for_generation
-> generated
-> in_review
-> changes_requested
-> generated
-> approved
-> published_manual
-> performance_pending
-> performance_reviewed
-> archived
```

Additional conceptual transitions:

```text
approved -> requires_reapproval
generated -> blocked_until_review
```

These states and transitions are conceptual and do not approve runtime, API, DB, ERD, SQL, OpenAPI, QA, generated-client, router, or store changes.

### 35.12 UTM Tracking Lite detail

UTM Lite only generates structured links and does not collect, ingest, or attribute analytics in Core V1.

Possible structured fields:

- utm_source;
- utm_medium;
- utm_campaign;
- utm_content;
- utm_term if needed.

UTM fields must remain user-reviewable and must not imply analytics ingestion or attribution.

### 35.13 Content Versioning detail

Conceptual content version records may include:

- version ID;
- version number;
- content type;
- channel target;
- body text;
- headline;
- CTA;
- hashtags;
- creative direction;
- risk flags;
- created by;
- created at;
- approval status;
- content hash if required by approval governance.

These fields are planning detail only and are not approved schema, API, runtime, or generated-client fields.

### 35.14 External Integrations Scope detail

#### Purpose

External integration planning identifies future integration categories and their governance requirements.

#### Core principle

No external integration is approved for Core V1 by this document.

#### Integration classification table

| Integration area | Core V1 status | Notes |
|---|---|---|
| Authentication integrations | Planning only | No new auth implementation approval. |
| Store and Product integrations | NO-GO for automated integration | User-provided data or explicitly allowed public links only. |
| Social Profile integrations | NO-GO for OAuth/API integration | User-provided screenshots, exports, or explicitly allowed public links only. |
| Publishing integrations | NO-GO | Direct publishing and scheduling are not approved. |
| Paid Ads integrations | NO-GO | Paid execution and spend are not approved. |
| Payment integrations | NO-GO | Payment, billing, invoice, refund, and tax handling are not approved. |
| Analytics and Performance integrations | NO-GO | No ingestion, collection, attribution, or automated reporting. |
| AI-enabled external tools | NO-GO unless separately approved | No external tool access without explicit consent and approved contracts. |

#### Authentication integrations

Authentication integrations may be discussed as journey context only. Any implementation would require separate approval and must preserve existing guardrails.

#### Store and Product integrations

Store and product integrations are not approved. Core V1 may use user-provided information, uploaded files, and explicitly allowed public links only.

#### Social Profile integrations

Social profile API integrations and social OAuth are not approved. Core V1 may use user-provided screenshots, exported text, or explicitly allowed public links only.

#### Publishing integrations

Publishing integrations are NO-GO in Core V1. Manual publishing outside the platform is the only Core V1 publishing boundary described here.

#### Paid Ads integrations

Paid ads integrations are NO-GO in Core V1. Budget information is planning information only and does not authorize spend.

#### Payment integrations

Payment integrations are NO-GO in Core V1. This includes payment processing, VAT/tax invoice handling, refund handling, billing providers, and provider usage logs.

#### Analytics and Performance integrations

Analytics and performance integrations are NO-GO in Core V1. Manual performance review may use user-entered values only.

#### AI-enabled external tools

AI-enabled external tools are NO-GO unless separately approved. AI must not access external tools without explicit consent and approved contracts.

#### Consent and authorization

Future integration planning must define explicit consent, revocation, scope visibility, workspace ownership, user permissions, and audit requirements before implementation.

#### Data retention and storage

Future integration planning must define what data is stored, for how long, under which workspace, and with what deletion or revocation behavior.

#### Integration failure handling

Future integration planning must define failure states, retries, user-facing errors, safe fallbacks, and audit evidence.

#### Audit requirements

Future integration planning must define audit events for consent, connection, disconnection, publish attempts, spend approval, data import, and failure handling.

#### External Integration NO-GO boundaries

Direct publishing, social OAuth, scheduling, paid ads, payment, analytics ingestion, attribution, external tool access, and autonomous execution remain NO-GO in Core V1.

#### External Integration readiness decision

External integration implementation is NO-GO until separate RFC, PRD or contract patch, ERD impact review, OpenAPI impact review, SQL impact review, QA plan, allowed files, forbidden files, verification commands, and CI gates are approved.

### 35.15 AI Tools and Model Governance detail

#### Purpose

AI governance defines how AI may support draft, advisory, reviewable work without bypassing human control.

#### Core principle

AI outputs are draft, advisory, reviewable, and must not bypass human approval.

#### AI capability classification table

| AI capability | Core V1 status | Boundary |
|---|---|---|
| Intake Assistant | Planning only | Asks questions and summarizes user-provided answers. |
| Campaign Strategist Assistant | Planning only | Suggests objectives, angles, and channel fit for review. |
| Content Generation Assistant | Planning only | Produces draft copy and scripts for human review. |
| Review Support Assistant | Planning only | Flags risks and missing data for review. |
| Performance Summary Assistant | Planning only | Summarizes user-entered manual performance notes only. |
| Autonomous Agent | NO-GO | Must not execute, publish, schedule, spend, or update protected fields. |
| External Tool Agent | NO-GO | Requires explicit consent and approved contracts before any future use. |

#### AI Service Layer

An AI Service Layer is a future planning concept only. It would require separate specification before implementation.

#### AI roles in Core V1

AI may be considered for draft intake support, campaign strategy suggestions, content drafting, review support, and manual performance summary support only where separately approved.

#### Intake Assistant

The Intake Assistant may ask scoped questions, clarify ambiguous answers, and propose draft summaries for confirmation.

#### Campaign Strategist Assistant

The Campaign Strategist Assistant may suggest angles, audiences, CTAs, channel fit, and readiness improvements for review.

#### Content Generation Assistant

The Content Generation Assistant may produce draft ad copy, headlines, captions, hashtags, and video reference scripts for review.

#### Review Support Assistant

The Review Support Assistant may flag missing fields, risky claims, rights issues, tone mismatch, unclear CTA, or channel-fit concerns.

#### Performance Summary Assistant

The Performance Summary Assistant may summarize user-entered manual performance observations. It must not ingest analytics or claim attribution.

#### Agent Mode governance

Agent Mode must preserve user confirmation, source, confidence, and review status. It must not store inferred data as confirmed fact.

#### Smart Wizard intelligence boundaries

Smart Wizard intelligence may suggest defaults or warnings but must not hide required review or confirmation steps.

#### Context assembly rules

AI context should include only the minimum necessary user-provided data, uploaded files, explicitly allowed public links, confirmed profile fields, and relevant campaign draft context.

#### Protected fields

Protected fields include identity, workspace ownership, membership, permissions, payment, spend, legal rights, approval status, and confirmed strategic profile fields. AI must not update protected fields without explicit consent and approved contracts.

#### Confidence scoring

Confidence scores may indicate input quality and output confidence, but they must not replace human approval.

#### Claims and policy governance

AI must flag claims, restricted content, misleading promises, unclear offer terms, and rights issues for human review.

#### Content generation rules

AI-generated content must remain editable, versionable, reviewable, and approval-gated.

#### Hashtag generation rules

Hashtags are draft recommendations only. They must be reviewed and do not guarantee reach.

#### Video and image AI boundaries

Core V1 does not edit video, generate final videos, perform advanced visual analysis, or generate final publishable media from this document.

#### Prompt and output logging

Prompt and output logging is a future governance requirement and would need privacy, retention, access, and audit rules before implementation.

#### Model routing and fallback

Model routing and fallback are future implementation concerns and are not approved by this document.

#### Explainability

AI suggestions should be explainable enough for a human reviewer to understand the basis of a recommendation.

#### Human-in-the-loop

Human review and approval remain mandatory before manual publishing support.

#### Strategic Profile Evolution

AI may suggest profile improvements, but it must not update protected profile fields or convert inferred suggestions into confirmed facts without explicit human confirmation.

#### AI Safety NO-GO boundaries

AI must not publish, schedule, spend, update protected profile fields, access external tools, bypass approval, ingest analytics, make attribution claims, or autonomously execute campaign actions.

#### AI readiness decision

AI implementation is NO-GO until separate AI Service Layer specification, privacy/logging policy, model governance, QA cases, allowed files, forbidden files, verification commands, and CI gates are approved.

#### Required future AI documentation patches

Future AI work would require:

- AI Service Layer specification;
- AI Logging & Privacy Policy;
- prompt and output retention policy;
- model routing and fallback policy;
- claims and safety review policy;
- human approval integration plan;
- audit and traceability plan.

#### AI governance transition rule

If any future document proposes AI execution, external tool access, autonomous agents, protected-field updates, publishing, scheduling, spend, or analytics ingestion, it must explicitly supersede this document through approved repository authority.

### 35.16 Post V1 Organic Publishing Module reference

The Post V1 Organic Publishing Module is reference-only and non-implementable in Core V1.

Possible future concepts:

- OAuth;
- account connection;
- direct organic publishing;
- scheduling;
- final approval before publishing;
- platform compliance;
- failure handling;
- account disconnection;
- audit logging.

These concepts require separate approval and are NO-GO in Core V1.

### 35.17 Post V1 Paid Campaign Execution Module reference

The Post V1 Paid Campaign Execution Module is reference-only and non-implementable in Core V1.

Possible future concepts:

- ad account authorization;
- channel selection;
- targeting;
- budget setup;
- spend caps;
- payment processing;
- VAT/tax invoice handling;
- refund handling;
- policy checks;
- final spend approval;
- campaign submission;
- status tracking;
- performance ingestion;
- reconciliation.

These concepts require separate approval and are NO-GO in Core V1.

### 35.18 Additional remaining gaps and required future documents

Additional future documents required before implementation:

- Traceability Review;
- PRD Patch;
- Backlog Patch;
- Scoring Contract;
- Role & Permission Matrix;
- Manual Publishing Evidence Contract;
- Approval State Machine Contract;
- Campaign Readiness Scoring Contract;
- AI Service Layer specification;
- AI Logging & Privacy Policy;
- Analysis Tools Contract;
- ERD Impact Review;
- OpenAPI Impact Review;
- QA/Test Cases;
- Threat Model Update.

## 36. GO / NO-GO boundaries

GO:

- documentation-only discussion;
- planning and governance review;
- manual/export/review/approval/evidence concepts for Core V1;
- reference-only Post V1 module discussion.

NO-GO:

- implementation from this document;
- PRD, ERD, OpenAPI, SQL, QA, runtime, or generated client changes;
- direct publishing;
- social OAuth;
- scheduling;
- paid ads;
- payment;
- analytics ingestion;
- attribution;
- autonomous AI execution;
- AI publishing, scheduling, spending, protected profile updates, or external tool access without explicit consent and approved contracts;
- Post V1 Organic Publishing Module implementation without separate approval;
- Post V1 Paid Campaign Execution Module implementation without separate approval.
