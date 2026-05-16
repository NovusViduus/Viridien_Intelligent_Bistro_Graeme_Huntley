/**
 * Middleware for handling 404 (route not found) responses.
 */
function notFound(req, res) {
  res.status(404).json({ success: false, error: "Route not found" });
}

/**
 * Global error handler middleware. Logs the error and returns a JSON response.
 * In production, hides internal error details from the client.
 */
function errorHandler(err, req, res, _next) {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    error:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
}

module.exports = { notFound, errorHandler };
