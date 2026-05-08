function logUnexpectedRepositoryError(repositoryName, error) {
  console.error(`${repositoryName} database operation failed.`, {
    error_name: error?.name,
    error_message: error?.message,
    error_code: error?.code,
    error_stack: error?.stack,
  });
}

module.exports = {
  logUnexpectedRepositoryError,
};
