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
    error_name: error?.name,
    error_code: error?.code,
    error_detail: error?.detail,
    error_hint: error?.hint,
    error_constraint: error?.constraint,
  };

  if (process.env.NODE_ENV !== "production") {
    payload.error_message = error?.message;
    payload.error_stack = error?.stack;
  }

  console.error(`${repositoryName} database operation failed.`, payload);
}

module.exports = {
  logUnexpectedRepositoryError,
  toRepositoryError,
};
