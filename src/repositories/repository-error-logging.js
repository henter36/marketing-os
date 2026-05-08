const { AppError } = require("../error-model");

function toRepositoryError(repositoryName, error) {
  if (error instanceof AppError) {
    return error;
  }

  logUnexpectedRepositoryError(repositoryName, error);
  return new AppError(500, "INTERNAL_ERROR", "Database operation failed.", "Retry or contact support.");
}

function logUnexpectedRepositoryError(repositoryName, error) {
  const payload = {
    error_name: error?.name || errorType(error),
    error_message: error?.message || errorMessage(error),
    error_code: error?.code,
  };

  if (shouldLogDetailedRepositoryError()) {
    payload.error_detail = error?.detail;
    payload.error_hint = error?.hint;
    payload.error_constraint = error?.constraint;
    payload.error_stack = error?.stack;
  }

  console.error(`${repositoryName} database operation failed.`, payload);
}

function errorType(error) {
  return error === undefined || error === null ? undefined : typeof error;
}

function errorMessage(error) {
  if (error === undefined || error === null) {
    return "Unknown error";
  }

  if (typeof error === "object" && !(error instanceof Error)) {
    return summarizeObjectError(error);
  }

  return String(error);
}

function summarizeObjectError(error) {
  try {
    const keys = Object.keys(error).sort();
    return keys.length > 0 ? `Object error with keys: ${keys.join(", ")}` : "Object error with no enumerable keys";
  } catch {
    return "Object error";
  }
}

function shouldLogDetailedRepositoryError() {
  return process.env.NODE_ENV !== "production" || process.env.REPOSITORY_ERROR_LOG_DETAIL === "true";
}

module.exports = {
  logUnexpectedRepositoryError,
  shouldLogDetailedRepositoryError,
  toRepositoryError,
};
