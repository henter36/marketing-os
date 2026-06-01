// Generated TypeScript declaration types for Nashir V1 API.
// DO NOT EDIT MANUALLY.
//
// Source:       docs/nashir_v1_openapi.yaml (canonical Nashir V1 OpenAPI — marketing-os)
// Regenerate:   npm run generate:nashir-types
// Check:        npm run generate:nashir-types:check
//
// @source-hash: c97b6d8363890c7f356a7c63225d83c28f5158836b62cdbc2b55753a89c2e7a2
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
