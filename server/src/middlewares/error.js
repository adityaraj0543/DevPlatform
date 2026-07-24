const logger = require('../utils/logger');
module.exports = (err, req, res, _next) => {
  const status = err.statusCode || err.status || 500;
  if (status >= 500) logger.error(err);
  res.status(status).json({
    ok: false,
    message: err.message || 'Server error',
    details: err.details || undefined,
    ...(process.env.NODE_ENV === 'development' && status >= 500 ? { stack: err.stack } : {}),
  });
};
