"use strict";

const { toRepositoryError } = require("./repository-error-logging");

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

class NashirProductRepository {
  constructor({ pool } = {}) {
    if (!pool) {
      throw new Error("NashirProductRepository requires a pool");
    }

    this.pool = pool;
  }

  async listProducts({ workspaceId } = {}) {
    if (!workspaceId) {
      return [];
    }

    try {
      const rows = rowsFromQueryResult(await this.pool.query(
        `
          SELECT
            product_id,
            workspace_id,
            store_profile_id,
            product_name,
            product_description,
            product_url,
            product_status::text AS product_status,
            created_by_user_id,
            created_at,
            updated_at
          FROM nashir_products
          WHERE workspace_id = $1
          ORDER BY created_at, product_id
        `,
        [workspaceId],
        { workspaceId }
      ));

      return rows.map(toPublicProduct);
    } catch (error) {
      throw toRepositoryError("NashirProductRepository", error);
    }
  }

  async findProductById({ workspaceId, productId } = {}) {
    if (!workspaceId || !productId || !UUID_REGEX.test(productId)) {
      return null;
    }

    try {
      const rows = rowsFromQueryResult(await this.pool.query(
        `
          SELECT
            product_id,
            workspace_id,
            store_profile_id,
            product_name,
            product_description,
            product_url,
            product_status::text AS product_status,
            created_by_user_id,
            created_at,
            updated_at
          FROM nashir_products
          WHERE workspace_id = $1
            AND product_id = $2
          LIMIT 1
        `,
        [workspaceId, productId],
        { workspaceId }
      ));

      return rows[0] ? toPublicProduct(rows[0]) : null;
    } catch (error) {
      throw toRepositoryError("NashirProductRepository", error);
    }
  }
}

function toPublicProduct(row) {
  return {
    productId: row.product_id,
    workspaceId: row.workspace_id,
    storeProfileId: row.store_profile_id,
    productName: row.product_name,
    productDescription: row.product_description || null,
    productUrl: row.product_url || null,
    productStatus: row.product_status,
    createdByUserId: row.created_by_user_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function rowsFromQueryResult(result) {
  if (!result) {
    return [];
  }

  return Array.isArray(result) ? result : result.rows || [];
}

module.exports = {
  NashirProductRepository,
};
