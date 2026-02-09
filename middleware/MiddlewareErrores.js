function MiddlewareErrores(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  const status = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === "development"
      ? err.message
      : "Error interno del servidor";

  console.error(`[ERROR ${status}]: ${message}`);

  res.status(status).json({
    success: false,
    message,
    error: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
}
module.exports = MiddlewareErrores;
