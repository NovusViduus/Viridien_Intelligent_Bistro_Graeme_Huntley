function notFound(req, res) {
  res.status(404).json({ success: false, error: "Route not found" });
}

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
