const { spawnSync } = require("child_process");
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

class PsqlPool {
  constructor({ databaseUrl }) {
    this.databaseUrl = databaseUrl;
    this.closed = false;
  }

  query(sql, params = []) {
    this.assertOpen();
    const compiledSql = compileSql(sql, params);
    const output = this.runPsql(wrapSelect(compiledSql));
    const trimmed = output.trim();

    if (!trimmed) {
      return [];
    }

    try {
      return JSON.parse(trimmed);
    } catch (error) {
      throw new DatabaseQueryError();
    }
  }

  exec(sql) {
    this.assertOpen();
    this.runPsql(sql);
  }

  close() {
    this.closed = true;
  }

  assertOpen() {
    if (this.closed) {
      throw new DatabaseQueryError("Database pool is closed.");
    }
  }

  runPsql(sql) {
    if (!this.databaseUrl) {
      throw new DatabaseConfigurationError();
    }

    const result = spawnSync(
      "psql",
      [this.databaseUrl, "-X", "-v", "ON_ERROR_STOP=1", "-A", "-t", "-q", "-c", sql],
      { encoding: "utf8", maxBuffer: 10 * 1024 * 1024 }
    );

    if (result.error || result.status !== 0) {
      throw new DatabaseQueryError();
    }

    return result.stdout || "";
  }
}

function createPool(options = {}) {
  const config = loadConfig(options.env || process.env);
  const databaseUrl = options.databaseUrl || config.databaseUrl;

  if (!databaseUrl && options.requireDatabaseUrl) {
    throw new DatabaseConfigurationError();
  }

  return new PsqlPool({ databaseUrl });
}

function getPool(options = {}) {
  if (!singletonPool || singletonPool.closed) {
    singletonPool = createPool(options);
  }

  return singletonPool;
}

function closePool() {
  if (singletonPool) {
    singletonPool.close();
    singletonPool = null;
  }
}

function compileSql(sql, params) {
  const values = Array.isArray(params) ? params : [];
  return sql.replace(/\$(\d+)/g, (_, indexText) => {
    const index = Number(indexText) - 1;

    if (index < 0 || index >= values.length) {
      throw new DatabaseQueryError();
    }

    return quoteSqlLiteral(values[index]);
  });
}

function quoteSqlLiteral(value) {
  if (value === null || value === undefined) {
    return "NULL";
  }

  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      throw new DatabaseQueryError();
    }

    return String(value);
  }

  if (typeof value === "boolean") {
    return value ? "TRUE" : "FALSE";
  }

  if (typeof value !== "string") {
    throw new DatabaseQueryError();
  }

  return `'${value.replace(/'/g, "''")}'`;
}

function wrapSelect(sql) {
  const withoutTrailingSemicolon = sql.trim().replace(/;+$/, "");
  return `WITH __slice0_query AS (${withoutTrailingSemicolon}) SELECT COALESCE(json_agg(row_to_json(__slice0_query)), '[]'::json) FROM __slice0_query`;
}

module.exports = {
  DatabaseConfigurationError,
  DatabaseQueryError,
  PsqlPool,
  closePool,
  createPool,
  getPool,
};
