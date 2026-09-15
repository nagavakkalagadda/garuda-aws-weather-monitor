/**
 * GARUDA // Global Error Handling Middleware
 */
function errorHandler(err, req, res, next) {
  console.error("[GARUDA ERROR]", err.stack || err.message || err);

  const status = err.status || 500;
  res.status(status).json({
    error: {
      message: err.message || "An unexpected meteorological system error occurred.",
      status,
      timestamp: new Date().toISOString(),
      path: req.originalUrl
    }
  });
}

module.exports = errorHandler;
