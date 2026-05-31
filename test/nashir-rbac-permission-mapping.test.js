"use strict";

const assert = require("assert");
const { test } = require("node:test");
const { hasPermission, permissions } = require("../src/rbac");

// 28 approved nashir.* permission codes × 7 roles = 196 assertions.
// Derived from: nashir_auth_rbac_workspace_identity_gate.md (Section 8/9) and
// nashir_auth_rbac_review_gate.md (confirmed consistent).
// Imports only hasPermission and permissions — no router, store, guards, or server modules.
//
// Legend: true = Allowed (A in gate matrix); false = Denied (D or RA in gate matrix).
// RA (Requires Additional Approval) for reviewer + nashir.evidence.manage is treated as
// false at the RBAC layer; service-layer enforcement is separate (gate condition C-RV02).

const ROLES = ["owner", "admin", "creator", "reviewer", "publisher", "billing_admin", "viewer"];

const GRANTS = {
  // ── Store setup ────────────────────────────────────────────────────────────
  "nashir.store.read": {
    owner: true, admin: true, creator: true, reviewer: true,
    publisher: true, billing_admin: true, viewer: true
  },
  "nashir.store.update": {
    owner: true, admin: true, creator: false, reviewer: false,
    publisher: false, billing_admin: false, viewer: false
  },
  // ── Product catalog ────────────────────────────────────────────────────────
  "nashir.product.read": {
    owner: true, admin: true, creator: true, reviewer: true,
    publisher: true, billing_admin: false, viewer: true
  },
  "nashir.product.write": {
    owner: true, admin: true, creator: true, reviewer: false,
    publisher: false, billing_admin: false, viewer: false
  },
  // ── Asset library ──────────────────────────────────────────────────────────
  "nashir.asset.read": {
    owner: true, admin: true, creator: true, reviewer: true,
    publisher: true, billing_admin: false, viewer: true
  },
  "nashir.asset.write": {
    owner: true, admin: true, creator: true, reviewer: false,
    publisher: false, billing_admin: false, viewer: false
  },
  "nashir.asset.link": {
    owner: true, admin: true, creator: true, reviewer: false,
    publisher: false, billing_admin: false, viewer: false
  },
  // ── Campaigns ──────────────────────────────────────────────────────────────
  "nashir.campaign.read": {
    owner: true, admin: true, creator: true, reviewer: true,
    publisher: true, billing_admin: false, viewer: true
  },
  "nashir.campaign.write": {
    owner: true, admin: true, creator: true, reviewer: false,
    publisher: false, billing_admin: false, viewer: false
  },
  // ── Content Studio ─────────────────────────────────────────────────────────
  "nashir.content.read": {
    owner: true, admin: true, creator: true, reviewer: true,
    publisher: true, billing_admin: false, viewer: true
  },
  "nashir.content.create": {
    owner: true, admin: true, creator: true, reviewer: false,
    publisher: false, billing_admin: false, viewer: false
  },
  "nashir.content.update": {
    owner: true, admin: true, creator: true, reviewer: false,
    publisher: false, billing_admin: false, viewer: false
  },
  "nashir.content.submit_review": {
    owner: true, admin: true, creator: true, reviewer: false,
    publisher: false, billing_admin: false, viewer: false
  },
  // ── Approval ───────────────────────────────────────────────────────────────
  // creator must NOT have approval.decide (self-approval prevention at service layer too)
  "nashir.approval.decide": {
    owner: true, admin: true, creator: false, reviewer: true,
    publisher: false, billing_admin: false, viewer: false
  },
  // ── Creator Studio ─────────────────────────────────────────────────────────
  "nashir.creator_studio.use": {
    owner: true, admin: true, creator: true, reviewer: false,
    publisher: false, billing_admin: false, viewer: false
  },
  "nashir.creator_studio.transfer.create": {
    owner: true, admin: true, creator: true, reviewer: false,
    publisher: false, billing_admin: false, viewer: false
  },
  // ── Publishing queue ───────────────────────────────────────────────────────
  "nashir.publishing.queue.read": {
    owner: true, admin: true, creator: true, reviewer: true,
    publisher: true, billing_admin: false, viewer: true
  },
  "nashir.publishing.draft.receive": {
    owner: true, admin: true, creator: false, reviewer: false,
    publisher: true, billing_admin: false, viewer: false
  },
  // ── Evidence ───────────────────────────────────────────────────────────────
  // creator does NOT have evidence.submit; only publisher, owner, admin do
  "nashir.evidence.submit": {
    owner: true, admin: true, creator: false, reviewer: false,
    publisher: true, billing_admin: false, viewer: false
  },
  // reviewer RA for evidence.manage → false at RBAC layer (service-layer check required)
  "nashir.evidence.manage": {
    owner: true, admin: true, creator: false, reviewer: false,
    publisher: false, billing_admin: false, viewer: false
  },
  // ── Prompt governance ──────────────────────────────────────────────────────
  "nashir.prompt_governance.read": {
    owner: true, admin: true, creator: true, reviewer: true,
    publisher: false, billing_admin: false, viewer: true
  },
  "nashir.prompt_governance.manage": {
    owner: true, admin: true, creator: false, reviewer: false,
    publisher: false, billing_admin: false, viewer: false
  },
  // ── Model routing (admin/owner only) ───────────────────────────────────────
  "nashir.model_routing.read": {
    owner: true, admin: true, creator: false, reviewer: false,
    publisher: false, billing_admin: false, viewer: false
  },
  "nashir.model_routing.manage": {
    owner: true, admin: true, creator: false, reviewer: false,
    publisher: false, billing_admin: false, viewer: false
  },
  // ── Cost monitor ───────────────────────────────────────────────────────────
  "nashir.cost.read": {
    owner: true, admin: true, creator: false, reviewer: false,
    publisher: false, billing_admin: true, viewer: false
  },
  "nashir.cost.manage": {
    owner: true, admin: true, creator: false, reviewer: false,
    publisher: false, billing_admin: true, viewer: false
  },
  // ── Workflow advisory (admin/owner only) ───────────────────────────────────
  "nashir.workflow.read": {
    owner: true, admin: true, creator: false, reviewer: false,
    publisher: false, billing_admin: false, viewer: false
  },
  // ── Admin governance (admin/owner only) ────────────────────────────────────
  "nashir.admin.manage": {
    owner: true, admin: true, creator: false, reviewer: false,
    publisher: false, billing_admin: false, viewer: false
  }
};

// ── Permission count checks ────────────────────────────────────────────────

test("permissions array contains exactly 28 distinct nashir.* codes", () => {
  const nashirCodes = permissions
    .map((p) => p.permission_code)
    .filter((code) => code.startsWith("nashir."));
  const unique = new Set(nashirCodes);
  assert.strictEqual(
    unique.size,
    28,
    `expected 28 distinct nashir.* permission codes, got ${unique.size}: ${[...unique].sort().join(", ")}`
  );
});

test("GRANTS table covers exactly 28 nashir.* codes — no gap, no extra", () => {
  const grantsKeys = Object.keys(GRANTS).filter((k) => k.startsWith("nashir."));
  assert.strictEqual(grantsKeys.length, 28, `expected 28 nashir.* entries in GRANTS table`);
});

test("every nashir.* code in GRANTS is present in the permissions array", () => {
  const allCodes = new Set(permissions.map((p) => p.permission_code));
  for (const code of Object.keys(GRANTS)) {
    assert.ok(allCodes.has(code), `GRANTS references '${code}' which is not in permissions array`);
  }
});

test("no unapproved nashir.* codes are present in permissions array", () => {
  const approvedSet = new Set(Object.keys(GRANTS));
  const nashirCodes = permissions
    .map((p) => p.permission_code)
    .filter((code) => code.startsWith("nashir."));
  for (const code of nashirCodes) {
    assert.ok(approvedSet.has(code), `Unapproved nashir.* code found in permissions array: '${code}'`);
  }
});

// ── Per-permission, per-role assertions (28 × 7 = 196) ────────────────────

for (const [code, roleGrants] of Object.entries(GRANTS)) {
  for (const role of ROLES) {
    const expected = roleGrants[role];
    test(`${role} ${expected ? "has" : "does not have"} ${code}`, () => {
      assert.strictEqual(
        hasPermission(role, code),
        expected,
        `expected hasPermission('${role}', '${code}') to be ${expected}`
      );
    });
  }
}

// ── Structural invariants ──────────────────────────────────────────────────

test("owner and admin have all 28 nashir.* codes", () => {
  const nashirCodes = Object.keys(GRANTS);
  for (const code of nashirCodes) {
    assert.ok(hasPermission("owner", code), `owner must have '${code}'`);
    assert.ok(hasPermission("admin", code), `admin must have '${code}'`);
  }
});

test("creator cannot decide approvals (separation of duties — self-approval prevention)", () => {
  assert.strictEqual(hasPermission("creator", "nashir.approval.decide"), false);
});

test("creator can create and use content but not manage governance or routing", () => {
  assert.ok(hasPermission("creator", "nashir.content.create"));
  assert.ok(hasPermission("creator", "nashir.creator_studio.use"));
  assert.strictEqual(hasPermission("creator", "nashir.prompt_governance.manage"), false);
  assert.strictEqual(hasPermission("creator", "nashir.model_routing.read"), false);
  assert.strictEqual(hasPermission("creator", "nashir.admin.manage"), false);
});

test("reviewer can decide approvals but cannot create campaign content", () => {
  assert.ok(hasPermission("reviewer", "nashir.approval.decide"));
  assert.strictEqual(hasPermission("reviewer", "nashir.content.create"), false);
  assert.strictEqual(hasPermission("reviewer", "nashir.content.update"), false);
  assert.strictEqual(hasPermission("reviewer", "nashir.campaign.write"), false);
});

test("publisher has publishing and evidence submission capabilities but no admin governance", () => {
  assert.ok(hasPermission("publisher", "nashir.publishing.draft.receive"));
  assert.ok(hasPermission("publisher", "nashir.evidence.submit"));
  assert.strictEqual(hasPermission("publisher", "nashir.approval.decide"), false);
  assert.strictEqual(hasPermission("publisher", "nashir.prompt_governance.manage"), false);
  assert.strictEqual(hasPermission("publisher", "nashir.model_routing.read"), false);
  assert.strictEqual(hasPermission("publisher", "nashir.admin.manage"), false);
});

test("billing_admin has cost visibility only — no content, campaign, or routing access", () => {
  assert.ok(hasPermission("billing_admin", "nashir.cost.read"));
  assert.ok(hasPermission("billing_admin", "nashir.cost.manage"));
  assert.ok(hasPermission("billing_admin", "nashir.store.read"));
  assert.strictEqual(hasPermission("billing_admin", "nashir.campaign.read"), false);
  assert.strictEqual(hasPermission("billing_admin", "nashir.content.read"), false);
  assert.strictEqual(hasPermission("billing_admin", "nashir.product.read"), false);
  assert.strictEqual(hasPermission("billing_admin", "nashir.model_routing.read"), false);
  assert.strictEqual(hasPermission("billing_admin", "nashir.admin.manage"), false);
});

test("viewer has read-only visibility and cannot mutate, approve, publish, or administrate", () => {
  assert.ok(hasPermission("viewer", "nashir.campaign.read"));
  assert.ok(hasPermission("viewer", "nashir.content.read"));
  assert.ok(hasPermission("viewer", "nashir.store.read"));
  assert.ok(hasPermission("viewer", "nashir.product.read"));
  assert.ok(hasPermission("viewer", "nashir.asset.read"));
  assert.ok(hasPermission("viewer", "nashir.publishing.queue.read"));
  assert.ok(hasPermission("viewer", "nashir.prompt_governance.read"));
  assert.strictEqual(hasPermission("viewer", "nashir.campaign.write"), false);
  assert.strictEqual(hasPermission("viewer", "nashir.content.create"), false);
  assert.strictEqual(hasPermission("viewer", "nashir.approval.decide"), false);
  assert.strictEqual(hasPermission("viewer", "nashir.evidence.submit"), false);
  assert.strictEqual(hasPermission("viewer", "nashir.publishing.draft.receive"), false);
  assert.strictEqual(hasPermission("viewer", "nashir.admin.manage"), false);
  assert.strictEqual(hasPermission("viewer", "nashir.model_routing.read"), false);
  assert.strictEqual(hasPermission("viewer", "nashir.cost.read"), false);
});

test("model routing and admin management are admin/owner only", () => {
  for (const role of ["creator", "reviewer", "publisher", "billing_admin", "viewer"]) {
    assert.strictEqual(hasPermission(role, "nashir.model_routing.read"), false, `${role} must not have model_routing.read`);
    assert.strictEqual(hasPermission(role, "nashir.model_routing.manage"), false, `${role} must not have model_routing.manage`);
    assert.strictEqual(hasPermission(role, "nashir.admin.manage"), false, `${role} must not have admin.manage`);
  }
});

test("workflow read is admin/owner only", () => {
  for (const role of ["creator", "reviewer", "publisher", "billing_admin", "viewer"]) {
    assert.strictEqual(hasPermission(role, "nashir.workflow.read"), false, `${role} must not have workflow.read`);
  }
});

test("reviewer evidence.manage is false at RBAC layer (RA requires service-layer enforcement)", () => {
  assert.strictEqual(hasPermission("reviewer", "nashir.evidence.manage"), false,
    "reviewer nashir.evidence.manage must be false at RBAC layer; RA is enforced at service layer");
});
