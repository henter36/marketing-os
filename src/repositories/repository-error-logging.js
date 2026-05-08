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
    error_message: error?.message,
    error_code: error?.code,
  };

  if (process.env.NODE_ENV !== "production") {
    payload.error_detail = error?.detail;
    payload.error_hint = error?.hint;
    payload.error_constraint = error?.constraint;
    payload.error_stack = error?.stack;
  }

  console.error(`${repositoryName} database operation failed.`, payload);
}

module.exports = {
  logUnexpectedRepositoryError,
  toRepositoryError,
};
