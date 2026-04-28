const { Pool } = require("pg");
const { loadConfig } = require("./config");

let singletonPool = null;

class DatabaseConfigurationError extends Error {
  constructor(message = "DATABASE_URL is required for DB-backed repository mode.") {
    super(message);
    this.name = "DatabaseConfigurationError";
    this.code = "DATABASE_URL_REQUIRED";
  }
}

class DatabaseQueryError extends Error {
  constructor(message = "Database query failed.") {
    super(message);
    this.name = "DatabaseQueryError";
    this.code = "DATABASE_QUERY_FAILED";
  }
}

class PgPoolAdapter {
  constructor({ databaseUrl }) {
    this.adapterName = "pg";
    this.databaseUrl = databaseUrl;
    this.closed = false;
    this.pool = databaseUrl
      ? new Pool({
          connectionString: databaseUrl,
        })
      : null;
  }

  async query(sql, params = [], options = {}) {
    const values = normalizeParams(params);

    if (options.workspaceId) {
      return this.withTransaction(
        async (client) => {
          const result = await runQuery(client, sql, values);
          return result.rows;
        },
        { workspaceId: options.workspaceId }
      );
    }

    const result = await runQuery(this.getQueryable(), sql, values);
    return result.rows;
  }

  async exec(sql, params = [], options = {}) {
    const values = normalizeParams(params);

    if (options.workspaceId) {
      await this.withTransaction(
        async (client) => {
          await runQuery(client, sql, values);
        },
        { workspaceId: options.workspaceId }
      );
      return;
    }

    await runQuery(this.getQueryable(), sql, values);
  }

  async withTransaction(callback, options = {}) {
    this.assertOpen();
    this.assertConfigured();

    let client;
    try {
      client = await this.pool.connect();
      await runQuery(client, "BEGIN", []);

      if (options.workspaceId) {
        await setWorkspaceContext(client, options.workspaceId);
      }

      const result = await callback(createTransactionClient(client));
      await runQuery(client, "COMMIT", []);
      return result;
    } catch (error) {
      if (client) {
        try {
          await client.query("ROLLBACK");
        } catch (rollbackError) {
          // Preserve the original sanitized database error.
        }
      }

      throw mapDatabaseError(error);
    } finally {
      if (client) {
        client.release();
      }
    }
  }

  async close() {
    if (this.closed) {
      return;
    }

    this.closed = true;

    if (this.pool) {
      try {
        await this.pool.end();
      } catch (error) {
        throw new DatabaseQueryError("Database pool failed to close.");
      }
    }
  }

  getQueryable() {
    this.assertOpen();
    this.assertConfigured();
    return this.pool;
  }

  assertOpen() {
    if (this.closed) {
      throw new DatabaseQueryError("Database pool is closed.");
    }
  }

  assertConfigured() {
    if (!this.pool) {
      throw new DatabaseConfigurationError();
    }
  }
}

function createPool(options = {}) {
  const config = loadConfig(options.env || process.env);
  const databaseUrl = options.databaseUrl || config.databaseUrl;

  if (!databaseUrl && options.requireDatabaseUrl) {
    throw new DatabaseConfigurationError();
  }

  return new PgPoolAdapter({ databaseUrl });
}

function getPool(options = {}) {
  if (!singletonPool || singletonPool.closed) {
    singletonPool = createPool(options);
  }

  return singletonPool;
}

async function closePool() {
  if (singletonPool) {
    await singletonPool.close();
    singletonPool = null;
  }
}

async function query(sql, params = [], options = {}) {
  return getPool(options.poolOptions || {}).query(sql, params, options);
}

async function exec(sql, params = [], options = {}) {
  return getPool(options.poolOptions || {}).exec(sql, params, options);
}

async function withTransaction(callback, options = {}) {
  return getPool(options.poolOptions || {}).withTransaction(callback, options);
}

async function setWorkspaceContext(client, workspaceId) {
  if (!workspaceId) {
    return;
  }

  await runQuery(client, "SELECT set_config($1, $2, true)", ["app.current_workspace_id", String(workspaceId)]);
}

function createTransactionClient(client) {
  return {
    query(sql, params = []) {
      return client.query(sql, normalizeParams(params));
    },
  };
}

async function runQuery(queryable, sql, params) {
  try {
    return await queryable.query(sql, params);
  } catch (error) {
    throw mapDatabaseError(error);
  }
}

function normalizeParams(params) {
  if (!Array.isArray(params)) {
    throw new DatabaseQueryError();
  }

  return params;
}

function mapDatabaseError(error) {
  if (error instanceof DatabaseConfigurationError || error instanceof DatabaseQueryError) {
    return error;
  }

  return new DatabaseQueryError();
}

module.exports = {
  DatabaseConfigurationError,
  DatabaseQueryError,
  PgPoolAdapter,
  closePool,
  createPool,
  exec,
  getPool,
  query,
  setWorkspaceContext,
  withTransaction,
};
