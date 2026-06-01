"use strict";

/**
 * Deterministic TypeScript declaration generator for Nashir V1 API types.
 *
 * Source: docs/nashir_v1_openapi.yaml (canonical Nashir V1 OpenAPI — marketing-os)
 * Output: generated/nashir-api-types/index.d.ts
 *
 * No external dependencies. Uses only Node built-ins.
 * No runtime client behavior is generated.
 * No fetch, axios, or HTTP helpers are emitted.
 *
 * Usage:
 *   node scripts/generate-nashir-types.js           # generate
 *   node scripts/generate-nashir-types.js --check   # verify freshness
 */

const { createHash } = require("crypto");
const { existsSync, readFileSync, writeFileSync, mkdirSync } = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const OPENAPI_SOURCE = path.join(ROOT, "docs", "nashir_v1_openapi.yaml");
const OUTPUT_DIR = path.join(ROOT, "generated", "nashir-api-types");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "index.d.ts");

const CHECK_MODE = process.argv.includes("--check");

// ─── Read and hash source ─────────────────────────────────────────────────────

if (!existsSync(OPENAPI_SOURCE)) {
  console.error(`Source not found: ${OPENAPI_SOURCE}`);
  process.exit(1);
}

const sourceText = readFileSync(OPENAPI_SOURCE, "utf8");
const sourceHash = createHash("sha256").update(sourceText).digest("hex");

// ─── Check mode ──────────────────────────────────────────────────────────────

if (CHECK_MODE) {
  if (!existsSync(OUTPUT_FILE)) {
    console.error(`Generated file missing: ${OUTPUT_FILE}`);
    console.error("Run: npm run generate:nashir-types");
    process.exit(1);
  }
  const existing = readFileSync(OUTPUT_FILE, "utf8");
  const hashMatch = existing.match(/@source-hash:\s*([0-9a-f]{64})/);
  if (!hashMatch) {
    console.error("Generated file has no source hash. Regenerate.");
    process.exit(1);
  }
  if (hashMatch[1] !== sourceHash) {
    console.error("Generated types are stale (source YAML has changed).");
    console.error("Run: npm run generate:nashir-types");
    process.exit(1);
  }
  console.log("Nashir generated types are current.");
  process.exit(0);
}

// ─── Generate types ───────────────────────────────────────────────────────────

const output = `// Generated TypeScript declaration types for Nashir V1 API.
// DO NOT EDIT MANUALLY.
//
// Source:       docs/nashir_v1_openapi.yaml (canonical Nashir V1 OpenAPI — marketing-os)
// Regenerate:   npm run generate:nashir-types
// Check:        npm run generate:nashir-types:check
//
// @source-hash: ${sourceHash}
//
// Scope:
//   - Nashir store profile and product read-only surface (Backend Slice 0)
//   - Nashir campaign / readiness / evidence surface
// No runtime client functions, fetch helpers, or HTTP behavior is included.
// No UI integration is implied by these types.
// No Store/Product write operations are included.
// No Creator Studio, publishing, integrations, or provider/model runtime types.

// ─── Shared envelope ─────────────────────────────────────────────────────────

/** Generic { data: T } response envelope used by all Nashir V1 success responses. */
export interface NashirDataEnvelope<T> {
  data: T;
}

// ─── Error model ─────────────────────────────────────────────────────────────

/** ErrorModel: machine-readable error response from any Nashir V1 route. */
export interface ErrorModel {
  /** Machine-readable error code (e.g. PERMISSION_DENIED, NOT_FOUND). */
  code: string;
  /** Human-readable error description. */
  message: string;
  /** Suggested corrective action for the caller. */
  user_action: string;
  /** Request correlation identifier for traceability. */
  correlation_id: string;
}

/** Alias for consistent naming with OpenAPI ErrorResponse component. */
export type ErrorResponse = NashirDataEnvelope<never> & ErrorModel;

// ─── Store Profile ────────────────────────────────────────────────────────────

/** Active lifecycle status values for a Nashir store profile. Archived profiles are excluded from GET responses. */
export type NashirStoreProfileStatus = "active" | "suspended";

/** Nashir store profile read-only record returned by GET /workspaces/{workspaceId}/nashir-store-profile. */
export interface NashirStoreProfile {
  /** Store profile record identifier (UUID). */
  storeProfileId: string;
  /** Route-derived workspace context (UUID). Never accepted from request body. */
  workspaceId: string;
  /** Display name of the store profile. */
  storeName: string;
  /** Optional store URL. */
  storeUrl: string | null;
  /** Active lifecycle status. Archived profiles are not returned. */
  storeProfileStatus: NashirStoreProfileStatus;
  /** User who created the store profile (UUID). */
  createdByUserId: string;
  /** ISO 8601 creation timestamp. */
  createdAt: string;
  /** ISO 8601 last-updated timestamp. */
  updatedAt: string;
}

/** Response envelope for GET /workspaces/{workspaceId}/nashir-store-profile. */
export interface NashirStoreProfileResponse extends NashirDataEnvelope<NashirStoreProfile> {}

// ─── Product ──────────────────────────────────────────────────────────────────

/** Product lifecycle status values. */
export type NashirProductStatus = "draft" | "active" | "archived";

/** Nashir product record returned by product read-only routes. */
export interface NashirProduct {
  /** Product record identifier (UUID). An invalid UUID productId returns 404 without a DB query. */
  productId: string;
  /** Route-derived workspace context (UUID). */
  workspaceId: string;
  /** Store profile this product belongs to (UUID). */
  storeProfileId: string;
  /** Display name of the product. */
  productName: string;
  /** Optional product description. */
  productDescription: string | null;
  /** Optional product URL. */
  productUrl: string | null;
  /** Current product lifecycle status. */
  productStatus: NashirProductStatus;
  /** User who created the product record (UUID). */
  createdByUserId: string;
  /** ISO 8601 creation timestamp. */
  createdAt: string;
  /** ISO 8601 last-updated timestamp. */
  updatedAt: string;
}

/** Response envelope for GET /workspaces/{workspaceId}/nashir-products/{productId}. */
export interface NashirProductResponse extends NashirDataEnvelope<NashirProduct> {}

/** Response envelope for GET /workspaces/{workspaceId}/nashir-products. Empty array when no products exist. */
export interface NashirProductListResponse extends NashirDataEnvelope<NashirProduct[]> {}

// ─── Campaign ─────────────────────────────────────────────────────────────────

/** Campaign lifecycle status values. */
export type NashirCampaignStatus =
  | "draft"
  | "submitted_for_review"
  | "approved"
  | "rejected"
  | "archived";

/**
 * Nashir campaign record.
 * Field names are snake_case to match the campaign API contract shape.
 */
export interface NashirCampaign {
  nashir_campaign_id: string;
  workspace_id: string;
  campaign_name: string;
  campaign_status: NashirCampaignStatus;
  created_at: string;
  updated_at: string | null;
}

/** Request body for POST /workspaces/{workspaceId}/nashir-campaigns. */
export interface CreateNashirCampaignRequest {
  campaign_name: string;
}

/** Response envelope for single campaign operations. */
export interface NashirCampaignResponse extends NashirDataEnvelope<NashirCampaign> {}

/** Response envelope for campaign list operations. */
export interface NashirCampaignListResponse extends NashirDataEnvelope<NashirCampaign[]> {}

// ─── Campaign Readiness ───────────────────────────────────────────────────────

/** Advisory readiness level. Readiness does not authorize publishing. */
export type NashirReadinessLevel = "pass" | "soft_pass" | "fail" | "blocked_until_review";

/** Advisory gate state. */
export type NashirGateState = "advisory_only" | "blocked_until_review" | "ready_for_human_review";

/** A single readiness issue (blocker or warning). */
export interface ReadinessIssue {
  code: string;
  message: string;
  severity: "blocker" | "warning";
  field: string | null;
  user_action: string | null;
}

/** A missing required field in a readiness check. */
export interface ReadinessMissingField {
  field: string;
  message: string;
  user_action: string | null;
}

/** A human-readable readiness explanation entry. */
export interface ReadinessExplanation {
  code: string;
  message: string;
  related_fields: string[];
}

/** Advisory campaign readiness snapshot. Not persisted. Does not authorize publishing. */
export interface NashirCampaignReadiness {
  nashir_campaign_id: string;
  workspace_id: string;
  readiness_level: NashirReadinessLevel;
  gate_state: NashirGateState;
  blockers: ReadinessIssue[];
  warnings: ReadinessIssue[];
  missing_fields: ReadinessMissingField[];
  explanations: ReadinessExplanation[];
  /** ISO 8601 timestamp of advisory evaluation (not persisted). */
  evaluated_at: string;
}

/** Response envelope for GET /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/readiness. */
export interface NashirCampaignReadinessResponse extends NashirDataEnvelope<NashirCampaignReadiness> {}

// ─── Evidence ─────────────────────────────────────────────────────────────────

/** Evidence submission status. */
export type NashirEvidenceStatus = "submitted";

/** Nashir campaign evidence record. Field names are camelCase to match the evidence API contract shape. */
export interface NashirCampaignEvidence {
  id: string;
  workspaceId: string;
  nashirCampaignId: string;
  evidenceType: string;
  channel: string;
  status: NashirEvidenceStatus;
  submittedAt: string;
  submittedBy: string;
  publishedAt: string | null;
  url: string | null;
  notes: string | null;
  externalReference: string | null;
}

/** Request body for POST /workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/evidence. */
export interface SubmitNashirCampaignEvidenceRequest {
  evidenceType: string;
  channel: string;
  publishedAt?: string;
  url?: string;
  notes?: string;
  externalReference?: string;
}

/** Response envelope for single evidence operations. */
export interface NashirCampaignEvidenceResponse extends NashirDataEnvelope<NashirCampaignEvidence> {}

/** Response envelope for evidence list operations. */
export interface NashirCampaignEvidenceListResponse extends NashirDataEnvelope<NashirCampaignEvidence[]> {}

// ─── Operation identifiers ────────────────────────────────────────────────────

/** Union of all Nashir V1 operationIds as declared in docs/nashir_v1_openapi.yaml. */
export type NashirOperationId =
  | "getNashirStoreProfile"
  | "listNashirProducts"
  | "getNashirProduct"
  | "listNashirCampaigns"
  | "createNashirCampaign"
  | "getNashirCampaign"
  | "getNashirCampaignReadiness"
  | "listNashirCampaignEvidence"
  | "submitNashirCampaignEvidence"
  | "getNashirCampaignEvidence";

/** Union of all Nashir V1 route paths as declared in docs/nashir_v1_openapi.yaml. */
export type NashirRoutePath =
  | "/workspaces/{workspaceId}/nashir-store-profile"
  | "/workspaces/{workspaceId}/nashir-products"
  | "/workspaces/{workspaceId}/nashir-products/{productId}"
  | "/workspaces/{workspaceId}/nashir-campaigns"
  | "/workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}"
  | "/workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/readiness"
  | "/workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/evidence"
  | "/workspaces/{workspaceId}/nashir-campaigns/{nashirCampaignId}/evidence/{evidenceId}";
`;

// ─── Write output ─────────────────────────────────────────────────────────────

if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
}

writeFileSync(OUTPUT_FILE, output, "utf8");
console.log(`Generated: ${OUTPUT_FILE}`);
console.log(`Source hash: ${sourceHash}`);
