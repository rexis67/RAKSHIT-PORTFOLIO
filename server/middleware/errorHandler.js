export function notFoundHandler(req, res) {
  res.status(404).json({
    error: "Route not found.",
    code: "NOT_FOUND"
  });
}

export function errorHandler(error, _req, res, _next) {
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({
      error: "Request body must be valid JSON.",
      code: "INVALID_JSON"
    });
  }
  if (error.type === "entity.too.large") {
    return res.status(413).json({
      error: "Request body is too large.",
      code: "REQUEST_TOO_LARGE"
    });
  }

  const status = Number.isInteger(error.status) && error.status >= 400 && error.status < 500
    ? error.status
    : 500;
  const code = status === 500 ? "INTERNAL_SERVER_ERROR" : "REQUEST_ERROR";

  if (status === 500) {
    console.error("Request failed:", error.name || "Error", error.code || "UNEXPECTED");
  }

  return res.status(status).json({
    error: status === 500 ? "An unexpected server error occurred." : "The request could not be completed.",
    code
  });
}
