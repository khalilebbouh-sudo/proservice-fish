const jwt = require('jsonwebtoken');
const { sendError } = require('../utils/errors');

function getTokenFromRequest(req) {
  if (req.cookies && req.cookies.access_token) {
    return req.cookies.access_token;
  }
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    return header.slice(7);
  }
  return null;
}

function requireAdmin(req, res, next) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return sendError(res, 500, 'Server configuration error');
  }

  const token = getTokenFromRequest(req);
  if (!token) {
    return sendError(res, 401, 'Authentication required');
  }

  try {
    const payload = jwt.verify(token, secret);
    if (payload.role !== 'admin') {
      return sendError(res, 403, 'Forbidden');
    }
    req.admin = { id: payload.sub, email: payload.email, role: payload.role };
    return next();
  } catch {
    return sendError(res, 401, 'Invalid or expired session');
  }
}

module.exports = { requireAdmin, getTokenFromRequest };
