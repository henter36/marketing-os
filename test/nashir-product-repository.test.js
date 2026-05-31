"use strict";

const assert = require("assert");
const { test } = require("node:test");
const { NashirProductRepository } = require("../src/repositories/nashir-product-repository");

const WORKSPACE_A = "workspace-a";
const WORKSPACE_B = "workspace-b";
const PRODUCT_A1_ID = "00000000-0000-4000-8000-000000000a20";
const PRODUCT_A2_ID = "00000000-0000-4000-8000-000000000a21";
const PRODUCT_B1_ID = "00000000-0000-4000-8000-000000000b20";
const STORE_PROFILE_A_ID = "00000000-0000-4000-8000-000000000a10";
const STORE_PROFILE_B_ID = "00000000-0000-4000-8000-000000000b10";

function createPoolDouble(records = []) {
  return {
    records: records.map((record) => ({ ...record })),
    queries: [],
    async query(sql, params, options) {
      this.queries.push({ sql, params, options });

      if (sql.includes("FROM nashir_products") && params.length === 1) {
        return this.records.filter((r) => r.workspace_id === params[0]);
      }

      if (sql.includes("FROM nashir_products") && params.length === 2) {
        return this.records.filter(
          (r) => r.workspace_id === params[0] && r.product_id === params[1]
        );
      }

      return [];
    }
  };
}

function seedProducts() {
  return [
    {
      product_id: PRODUCT_A1_ID,
      workspace_id: WORKSPACE_A,
      store_profile_id: STORE_PROFILE_A_ID,
      product_name: "Product A1",
      product_description: "Description A1",
      product_url: "https://product-a1.example",
      product_status: "active",
      created_by_user_id: "user-owner-a",
      created_at: "2026-05-31T00:00:00.000Z",
      updated_at: "2026-05-31T00:00:00.000Z"
    },
    {
      product_id: PRODUCT_A2_ID,
      workspace_id: WORKSPACE_A,
      store_profile_id: STORE_PROFILE_A_ID,
      product_name: "Product A2",
      product_description: null,
      product_url: null,
      product_status: "draft",
      created_by_user_id: "user-owner-a",
      created_at: "2026-05-31T01:00:00.000Z",
      updated_at: "2026-05-31T01:00:00.000Z"
    },
    {
      product_id: PRODUCT_B1_ID,
      workspace_id: WORKSPACE_B,
      store_profile_id: STORE_PROFILE_B_ID,
      product_name: "Product B1",
      product_description: null,
      product_url: null,
      product_status: "active",
      created_by_user_id: "user-owner-b",
      created_at: "2026-05-31T00:00:00.000Z",
      updated_at: "2026-05-31T00:00:00.000Z"
    }
  ];
}

test("constructor requires a pool", () => {
  assert.throws(
    () => new NashirProductRepository(),
    /NashirProductRepository requires a pool/
  );
});

test("listProducts returns only records matching workspaceId", async () => {
  const pool = createPoolDouble(seedProducts());
  const repository = new NashirProductRepository({ pool });

  const products = await repository.listProducts({ workspaceId: WORKSPACE_A });

  assert.strictEqual(products.length, 2);
  assert.ok(products.every((p) => p.workspaceId === WORKSPACE_A));
  assert.deepStrictEqual(
    products.map((p) => p.productId),
    [PRODUCT_A1_ID, PRODUCT_A2_ID]
  );
});

test("listProducts returns empty array when workspace has no products", async () => {
  const pool = createPoolDouble([]);
  const repository = new NashirProductRepository({ pool });

  const products = await repository.listProducts({ workspaceId: WORKSPACE_A });

  assert.deepStrictEqual(products, []);
});

test("listProducts returns empty array for missing workspaceId", async () => {
  const pool = createPoolDouble(seedProducts());
  const repository = new NashirProductRepository({ pool });

  const products = await repository.listProducts({ workspaceId: null });

  assert.deepStrictEqual(products, []);
  assert.strictEqual(pool.queries.length, 0, "no query must be issued for missing workspaceId");
});

test("listProducts preserves workspace isolation — workspace B sees only its own products", async () => {
  const pool = createPoolDouble(seedProducts());
  const repository = new NashirProductRepository({ pool });

  const productsB = await repository.listProducts({ workspaceId: WORKSPACE_B });

  assert.strictEqual(productsB.length, 1);
  assert.strictEqual(productsB[0].productId, PRODUCT_B1_ID);
  assert.strictEqual(productsB[0].workspaceId, WORKSPACE_B);
});

test("listProducts passes workspaceId to pool.query options", async () => {
  const pool = createPoolDouble(seedProducts());
  const repository = new NashirProductRepository({ pool });

  await repository.listProducts({ workspaceId: WORKSPACE_A });

  assert.strictEqual(pool.queries.length, 1);
  assert.deepStrictEqual(pool.queries[0].params, [WORKSPACE_A]);
  assert.deepStrictEqual(pool.queries[0].options, { workspaceId: WORKSPACE_A });
});

test("listProducts maps rows to camelCase public fields", async () => {
  const pool = createPoolDouble(seedProducts());
  const repository = new NashirProductRepository({ pool });

  const products = await repository.listProducts({ workspaceId: WORKSPACE_A });
  const product = products[0];

  assert.ok("productId" in product);
  assert.ok("workspaceId" in product);
  assert.ok("storeProfileId" in product);
  assert.ok("productName" in product);
  assert.ok("productDescription" in product);
  assert.ok("productUrl" in product);
  assert.ok("productStatus" in product);
  assert.ok("createdByUserId" in product);
  assert.ok("createdAt" in product);
  assert.ok("updatedAt" in product);
  assert.ok(!("product_id" in product), "snake_case fields must not be exposed");
});

test("findProductById returns matching product with correct fields", async () => {
  const pool = createPoolDouble(seedProducts());
  const repository = new NashirProductRepository({ pool });

  const product = await repository.findProductById({ workspaceId: WORKSPACE_A, productId: PRODUCT_A1_ID });

  assert.ok(product, "product must be found");
  assert.strictEqual(product.productId, PRODUCT_A1_ID);
  assert.strictEqual(product.workspaceId, WORKSPACE_A);
  assert.strictEqual(product.storeProfileId, STORE_PROFILE_A_ID);
  assert.strictEqual(product.productName, "Product A1");
  assert.strictEqual(product.productDescription, "Description A1");
  assert.strictEqual(product.productUrl, "https://product-a1.example");
  assert.strictEqual(product.productStatus, "active");
});

test("findProductById returns null for non-existent product", async () => {
  const pool = createPoolDouble(seedProducts());
  const repository = new NashirProductRepository({ pool });

  const result = await repository.findProductById({ workspaceId: WORKSPACE_A, productId: "missing-id" });

  assert.strictEqual(result, null);
});

test("findProductById returns null for cross-workspace product (workspace isolation)", async () => {
  const pool = createPoolDouble(seedProducts());
  const repository = new NashirProductRepository({ pool });

  const result = await repository.findProductById({ workspaceId: WORKSPACE_A, productId: PRODUCT_B1_ID });

  assert.strictEqual(result, null, "product from workspace B must not be accessible via workspace A");
});

test("findProductById returns null for missing workspaceId", async () => {
  const pool = createPoolDouble(seedProducts());
  const repository = new NashirProductRepository({ pool });

  const result = await repository.findProductById({ workspaceId: null, productId: PRODUCT_A1_ID });

  assert.strictEqual(result, null);
  assert.strictEqual(pool.queries.length, 0, "no query must be issued for missing workspaceId");
});

test("findProductById passes workspaceId and productId to pool.query options", async () => {
  const pool = createPoolDouble(seedProducts());
  const repository = new NashirProductRepository({ pool });

  await repository.findProductById({ workspaceId: WORKSPACE_A, productId: PRODUCT_A1_ID });

  assert.strictEqual(pool.queries.length, 1);
  assert.deepStrictEqual(pool.queries[0].params, [WORKSPACE_A, PRODUCT_A1_ID]);
  assert.deepStrictEqual(pool.queries[0].options, { workspaceId: WORKSPACE_A });
});

test("findProductById returns null for null optional fields gracefully", async () => {
  const pool = createPoolDouble(seedProducts());
  const repository = new NashirProductRepository({ pool });

  const product = await repository.findProductById({ workspaceId: WORKSPACE_A, productId: PRODUCT_A2_ID });

  assert.ok(product);
  assert.strictEqual(product.productDescription, null);
  assert.strictEqual(product.productUrl, null);
  assert.strictEqual(product.productStatus, "draft");
});

test("listProducts maps database error to safe repository error", async () => {
  const failPool = {
    async query() {
      throw new Error("connection refused");
    }
  };
  const repository = new NashirProductRepository({ pool: failPool });

  await assert.rejects(
    () => repository.listProducts({ workspaceId: WORKSPACE_A }),
    (err) => {
      assert.ok(err.code === "INTERNAL_ERROR" || err.status === 500, "must surface as safe repository error");
      return true;
    }
  );
});

test("findProductById maps database error to safe repository error", async () => {
  const failPool = {
    async query() {
      throw new Error("connection refused");
    }
  };
  const repository = new NashirProductRepository({ pool: failPool });

  await assert.rejects(
    () => repository.findProductById({ workspaceId: WORKSPACE_A, productId: PRODUCT_A1_ID }),
    (err) => {
      assert.ok(err.code === "INTERNAL_ERROR" || err.status === 500, "must surface as safe repository error");
      return true;
    }
  );
});
