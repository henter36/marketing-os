"use strict";

const assert = require("assert");
const { Readable } = require("stream");
const { test } = require("node:test");
const { createApp } = require("../src/router");
const { createSeedStore } = require("../src/store");

// Seed users (from store):
// user-owner-a   → workspace-a, owner       (has nashir.store.read, nashir.product.read)
// user-billing-a → workspace-a, billing_admin (has nashir.store.read, no nashir.product.read)
// user-viewer-a  → workspace-a, viewer      (has nashir.store.read, nashir.product.read)
// user-creator-a → workspace-a, creator     (has nashir.store.read, nashir.product.read)
// user-outsider  → no memberships
const WORKSPACE_A = "workspace-a";
const WORKSPACE_B = "workspace-b";
const OWNER_A = "user-owner-a";
const BILLING_A = "user-billing-a";
const VIEWER_A = "user-viewer-a";
const OUTSIDER = "user-outsider";
const INVALID_USER = "user-missing";

const PROFILE_A = {
  storeProfileId: "00000000-0000-4000-8000-000000000a10",
  workspaceId: WORKSPACE_A,
  storeName: "Store A",
  storeUrl: "https://store-a.example",
  storeProfileStatus: "active",
  createdByUserId: OWNER_A,
  createdAt: "2026-05-31T00:00:00.000Z",
  updatedAt: "2026-05-31T00:00:00.000Z"
};

const PRODUCTS_A = [
  {
    productId: "00000000-0000-4000-8000-000000000a20",
    workspaceId: WORKSPACE_A,
    storeProfileId: "00000000-0000-4000-8000-000000000a10",
    productName: "Product A1",
    productDescription: "Description",
    productUrl: null,
    productStatus: "active",
    createdByUserId: OWNER_A,
    createdAt: "2026-05-31T00:00:00.000Z",
    updatedAt: "2026-05-31T00:00:00.000Z"
  }
];

function createStoreProfileRepositoryDouble(profile) {
  return {
    async findStoreProfileByWorkspace({ workspaceId }) {
      if (profile && profile.workspaceId === workspaceId) {
        return { ...profile };
      }
      return null;
    }
  };
}

function createProductRepositoryDouble(products) {
  return {
    async listProducts({ workspaceId }) {
      return (products || []).filter((p) => p.workspaceId === workspaceId).map((p) => ({ ...p }));
    },
    async findProductById({ workspaceId, productId }) {
      const product = (products || []).find(
        (p) => p.workspaceId === workspaceId && p.productId === productId
      );
      return product ? { ...product } : null;
    }
  };
}

async function request(method, path, { userId, storeProfileRepo, productRepo } = {}) {
  const store = createSeedStore();
  const app = createApp({
    store,
    storeProfileRepository: storeProfileRepo || null,
    productRepository: productRepo || null
  });

  const req = Readable.from([]);
  req.method = method;
  req.url = `/v1${path}`;
  req.headers = {
    "content-type": "application/json",
    ...(userId ? { "x-user-id": userId } : {})
  };

  return new Promise((resolve) => {
    const res = {
      statusCode: 200,
      headers: {},
      writeHead(status, headers) {
        this.statusCode = status;
        this.headers = headers;
      },
      end(payload) {
        resolve({
          status: this.statusCode,
          body: payload ? JSON.parse(payload) : null
        });
      }
    };
    app(req, res);
  });
}

// ── Store profile routes ──────────────────────────────────────────────────────

test("GET nashir-store-profile returns 200 with profile for authorized owner", async () => {
  const res = await request("GET", `/workspaces/${WORKSPACE_A}/nashir-store-profile`, {
    userId: OWNER_A,
    storeProfileRepo: createStoreProfileRepositoryDouble(PROFILE_A)
  });

  assert.strictEqual(res.status, 200);
  assert.ok(res.body);
  assert.deepStrictEqual(res.body.data, PROFILE_A);
});

test("GET nashir-store-profile returns 200 with profile for authorized viewer", async () => {
  const res = await request("GET", `/workspaces/${WORKSPACE_A}/nashir-store-profile`, {
    userId: VIEWER_A,
    storeProfileRepo: createStoreProfileRepositoryDouble(PROFILE_A)
  });

  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.data.storeProfileId, PROFILE_A.storeProfileId);
});

test("GET nashir-store-profile returns 401 for unauthenticated request", async () => {
  const res = await request("GET", `/workspaces/${WORKSPACE_A}/nashir-store-profile`, {
    storeProfileRepo: createStoreProfileRepositoryDouble(PROFILE_A)
  });

  assert.strictEqual(res.status, 401);
});

test("GET nashir-store-profile returns 401 for invalid/unknown user", async () => {
  const res = await request("GET", `/workspaces/${WORKSPACE_A}/nashir-store-profile`, {
    userId: INVALID_USER,
    storeProfileRepo: createStoreProfileRepositoryDouble(PROFILE_A)
  });

  assert.strictEqual(res.status, 401);
});

test("GET nashir-store-profile returns 404 for non-member (non-disclosing)", async () => {
  const res = await request("GET", `/workspaces/${WORKSPACE_A}/nashir-store-profile`, {
    userId: OUTSIDER,
    storeProfileRepo: createStoreProfileRepositoryDouble(PROFILE_A)
  });

  // nonDisclosingMembershipCheck returns 404, not 403
  assert.strictEqual(res.status, 404);
  assert.notStrictEqual(res.body.code, "PERMISSION_DENIED", "non-member must get 404, not 403");
});

test("GET nashir-store-profile returns 403 for billing_admin lacking nashir.store.read... wait, billing_admin has store.read", async () => {
  // billing_admin HAS nashir.store.read per the RBAC map → should return 200
  const res = await request("GET", `/workspaces/${WORKSPACE_A}/nashir-store-profile`, {
    userId: BILLING_A,
    storeProfileRepo: createStoreProfileRepositoryDouble(PROFILE_A)
  });

  assert.strictEqual(res.status, 200);
});

test("GET nashir-store-profile returns 404 when workspace has no active store profile", async () => {
  const res = await request("GET", `/workspaces/${WORKSPACE_A}/nashir-store-profile`, {
    userId: OWNER_A,
    storeProfileRepo: createStoreProfileRepositoryDouble(null)
  });

  assert.strictEqual(res.status, 404);
});

test("GET nashir-store-profile does not respond to POST", async () => {
  const res = await request("POST", `/workspaces/${WORKSPACE_A}/nashir-store-profile`, {
    userId: OWNER_A,
    storeProfileRepo: createStoreProfileRepositoryDouble(PROFILE_A)
  });

  assert.strictEqual(res.status, 404, "POST to store profile must be 404");
});

// ── Product list routes ───────────────────────────────────────────────────────

test("GET nashir-products returns 200 with product array for authorized owner", async () => {
  const res = await request("GET", `/workspaces/${WORKSPACE_A}/nashir-products`, {
    userId: OWNER_A,
    productRepo: createProductRepositoryDouble(PRODUCTS_A)
  });

  assert.strictEqual(res.status, 200);
  assert.ok(Array.isArray(res.body.data));
  assert.strictEqual(res.body.data.length, 1);
  assert.strictEqual(res.body.data[0].productId, PRODUCTS_A[0].productId);
});

test("GET nashir-products returns only workspace-scoped products", async () => {
  const allProducts = [
    ...PRODUCTS_A,
    {
      productId: "00000000-0000-4000-8000-000000000b20",
      workspaceId: WORKSPACE_B,
      storeProfileId: "00000000-0000-4000-8000-000000000b10",
      productName: "Product B1",
      productDescription: null,
      productUrl: null,
      productStatus: "active",
      createdByUserId: "user-owner-b",
      createdAt: "2026-05-31T00:00:00.000Z",
      updatedAt: "2026-05-31T00:00:00.000Z"
    }
  ];

  const res = await request("GET", `/workspaces/${WORKSPACE_A}/nashir-products`, {
    userId: OWNER_A,
    productRepo: createProductRepositoryDouble(allProducts)
  });

  assert.strictEqual(res.status, 200);
  assert.ok(res.body.data.every((p) => p.workspaceId === WORKSPACE_A));
  assert.strictEqual(res.body.data.length, 1);
});

test("GET nashir-products returns empty array when workspace has no products", async () => {
  const res = await request("GET", `/workspaces/${WORKSPACE_A}/nashir-products`, {
    userId: OWNER_A,
    productRepo: createProductRepositoryDouble([])
  });

  assert.strictEqual(res.status, 200);
  assert.deepStrictEqual(res.body.data, []);
});

test("GET nashir-products returns 401 for unauthenticated request", async () => {
  const res = await request("GET", `/workspaces/${WORKSPACE_A}/nashir-products`, {
    productRepo: createProductRepositoryDouble(PRODUCTS_A)
  });

  assert.strictEqual(res.status, 401);
});

test("GET nashir-products returns 404 for non-member (non-disclosing)", async () => {
  const res = await request("GET", `/workspaces/${WORKSPACE_A}/nashir-products`, {
    userId: OUTSIDER,
    productRepo: createProductRepositoryDouble(PRODUCTS_A)
  });

  assert.strictEqual(res.status, 404);
  assert.notStrictEqual(res.body.code, "PERMISSION_DENIED");
});

test("GET nashir-products returns 403 for member lacking nashir.product.read", async () => {
  // billing_admin has nashir.store.read but NOT nashir.product.read per RBAC map
  const res = await request("GET", `/workspaces/${WORKSPACE_A}/nashir-products`, {
    userId: BILLING_A,
    productRepo: createProductRepositoryDouble(PRODUCTS_A)
  });

  assert.strictEqual(res.status, 403);
  assert.strictEqual(res.body.code, "PERMISSION_DENIED");
});

// ── Product by ID routes ─────────────────────────────────────────────────────

test("GET nashir-products/{productId} returns 200 with product for authorized member", async () => {
  const productId = PRODUCTS_A[0].productId;
  const res = await request("GET", `/workspaces/${WORKSPACE_A}/nashir-products/${productId}`, {
    userId: OWNER_A,
    productRepo: createProductRepositoryDouble(PRODUCTS_A)
  });

  assert.strictEqual(res.status, 200);
  assert.ok(res.body.data);
  assert.strictEqual(res.body.data.productId, productId);
  assert.strictEqual(res.body.data.workspaceId, WORKSPACE_A);
});

test("GET nashir-products/{productId} returns 404 for unknown product", async () => {
  const res = await request("GET", `/workspaces/${WORKSPACE_A}/nashir-products/unknown-product-id`, {
    userId: OWNER_A,
    productRepo: createProductRepositoryDouble(PRODUCTS_A)
  });

  assert.strictEqual(res.status, 404);
});

test("GET nashir-products/{productId} returns 404 for cross-workspace product (non-disclosing)", async () => {
  const crossWorkspaceProductId = "00000000-0000-4000-8000-000000000b20";
  const allProducts = [
    ...PRODUCTS_A,
    {
      productId: crossWorkspaceProductId,
      workspaceId: WORKSPACE_B,
      storeProfileId: "00000000-0000-4000-8000-000000000b10",
      productName: "Product B1",
      productDescription: null,
      productUrl: null,
      productStatus: "active",
      createdByUserId: "user-owner-b",
      createdAt: "2026-05-31T00:00:00.000Z",
      updatedAt: "2026-05-31T00:00:00.000Z"
    }
  ];

  const res = await request("GET", `/workspaces/${WORKSPACE_A}/nashir-products/${crossWorkspaceProductId}`, {
    userId: OWNER_A,
    productRepo: createProductRepositoryDouble(allProducts)
  });

  // workspace A member cannot see workspace B product — must get 404
  assert.strictEqual(res.status, 404);
});

test("GET nashir-products/{productId} returns 403 for member lacking nashir.product.read", async () => {
  const productId = PRODUCTS_A[0].productId;
  const res = await request("GET", `/workspaces/${WORKSPACE_A}/nashir-products/${productId}`, {
    userId: BILLING_A,
    productRepo: createProductRepositoryDouble(PRODUCTS_A)
  });

  assert.strictEqual(res.status, 403);
  assert.strictEqual(res.body.code, "PERMISSION_DENIED");
});

test("GET nashir-products/{productId} returns 404 for non-member (non-disclosing)", async () => {
  const productId = PRODUCTS_A[0].productId;
  const res = await request("GET", `/workspaces/${WORKSPACE_A}/nashir-products/${productId}`, {
    userId: OUTSIDER,
    productRepo: createProductRepositoryDouble(PRODUCTS_A)
  });

  assert.strictEqual(res.status, 404);
  assert.notStrictEqual(res.body.code, "PERMISSION_DENIED");
});

test("GET nashir-products/{productId} returns 404 (not 200 []) when productRepository is missing", async () => {
  const productId = PRODUCTS_A[0].productId;
  const res = await request("GET", `/workspaces/${WORKSPACE_A}/nashir-products/${productId}`, {
    userId: OWNER_A
    // productRepo intentionally omitted — null repository
  });

  assert.strictEqual(res.status, 404, "missing productRepository must return 404, not 200 with empty data");
  assert.ok(!Array.isArray(res.body?.data), "response body.data must not be an array when repository is missing");
});

// ── No write routes ───────────────────────────────────────────────────────────

test("POST to nashir-products returns 404 — write routes must not exist", async () => {
  const res = await request("POST", `/workspaces/${WORKSPACE_A}/nashir-products`, {
    userId: OWNER_A,
    productRepo: createProductRepositoryDouble(PRODUCTS_A)
  });

  assert.strictEqual(res.status, 404, "POST to products must be 404 — no write routes in Slice 0");
});

test("no audit events are emitted for read-only store/product routes", async () => {
  const store = createSeedStore();
  const auditCountBefore = store.auditLogs.length;
  const app = createApp({
    store,
    storeProfileRepository: createStoreProfileRepositoryDouble(PROFILE_A),
    productRepository: createProductRepositoryDouble(PRODUCTS_A)
  });

  const req = Readable.from([]);
  req.method = "GET";
  req.url = `/v1/workspaces/${WORKSPACE_A}/nashir-store-profile`;
  req.headers = { "content-type": "application/json", "x-user-id": OWNER_A };

  await new Promise((resolve) => {
    const res = {
      statusCode: 200,
      writeHead() {},
      end() { resolve(); }
    };
    app(req, res);
  });

  assert.strictEqual(store.auditLogs.length, auditCountBefore, "no audit events must be emitted for read routes");
});

// ── Correlation ID in error responses ────────────────────────────────────────

test("error responses include correlation_id", async () => {
  const res = await request("GET", `/workspaces/${WORKSPACE_A}/nashir-store-profile`, {
    userId: OUTSIDER,
    storeProfileRepo: createStoreProfileRepositoryDouble(PROFILE_A)
  });

  assert.strictEqual(res.status, 404);
  assert.ok(res.body.correlation_id, "error response must include correlation_id");
});
