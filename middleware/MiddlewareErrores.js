function MiddlewareErrores(err, req, res, next) {
  // Verificar que err sea un objeto Error válido
  if (!err || typeof err !== 'object') {
    return next(new Error('Error de middleware inválido'));
  }

  if (res.headersSent) {
    console.error(`[ERROR ${err.status || err.statusCode || 500}]: ${err.message || 'Error desconocido'}`);
    return next(err);
  }

  const status = err.status || err.statusCode || 500;
  const message =
    process.env.NODE_ENV === "development"
      ? err.message || "Error desconocido"
      : "Error interno del servidor";

  console.error(`[ERROR ${status}]: ${message}`);

  res.status(status).json({
    success: false,
    message,
    error: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
}
module.exports = MiddlewareErrores;
