import { logger } from '../utils/logger.js';
import { ENV } from '../config/env.js';

export function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    error: `Resource not found on UNSEEN API: ${req.method} ${req.originalUrl}`
  });
}

export function errorHandler(err, req, res, next) {
  logger.error(`Unhandled error during ${req.method} ${req.originalUrl}:`, err);

  const statusCode = err.status || err.statusCode || 500;
  const isProd = ENV.NODE_ENV === 'production';

  res.status(statusCode).json({
    success: false,
    error: isProd && statusCode === 500 ? 'An internal error occurred. Please try again later.' : err.message || 'Internal server error',
    ...(isProd ? {} : { stack: err.stack })
  });
}
