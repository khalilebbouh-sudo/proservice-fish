function sendError(res, status, message) {
  return res.status(status).json({ error: message });
}

function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

function notFoundHandler(req, res) {
  return sendError(res, 404, 'Resource not found');
}

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const code = Number(err.statusCode);
  const status =
    Number.isFinite(code) && code >= 400 && code < 600 ? code : 500;

  const message =
    status === 500 && process.env.NODE_ENV === 'production'
      ? 'Something went wrong'
      : err.message || 'Something went wrong';

  return res.status(status).json({ error: message });
}

module.exports = {
  sendError,
  asyncHandler,
  notFoundHandler,
  errorHandler,
};
