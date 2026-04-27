const DEFAULT_ACTION = "Review the request and try again.";

class AppError extends Error {
  constructor(status, code, message, userAction = DEFAULT_ACTION) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.code = code;
    this.userAction = userAction;
  }
}

function correlationId(req) {
  return req.headers["x-correlation-id"] || crypto.randomUUID();
}

function errorBody(error, id) {
  return {
    code: error.code || "INTERNAL_ERROR",
    message: error.message || "Unexpected error.",
    user_action: error.userAction || DEFAULT_ACTION,
    correlation_id: id
  };
}

function sendJson(res, status, body) {
  res.writeHead(status, { "content-type": "application/json" });
  res.end(JSON.stringify(body));
}

module.exports = {
  AppError,
  correlationId,
  errorBody,
  sendJson
};
