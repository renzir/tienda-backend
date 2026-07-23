class AppError extends Error {
  constructor(message, status) {
    super(message);
    this.name = this.constructor.name;
    this.status = status || 500;
    Error.captureStackTrace(this, this.constructor);
  }
}

const MiddlewareErrores = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Error interno del servidor";

  console.error(`[ERROR ${status}]: ${message}`);

  if (res.headersSent) return next(err);
  res.status(status).json({
    success: false,
    message: message,
  });
};

module.exports = {
  MiddlewareErrores,
  AppError,
};
