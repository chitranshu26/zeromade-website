/**
 * Centralized error handler - must have 4 args for Express to treat as error middleware
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;
