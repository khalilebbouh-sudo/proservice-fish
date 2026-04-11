const { validationResult } = require('express-validator');
const { sendError } = require('../utils/errors');

function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const first = errors.array({ onlyFirstError: true })[0];
    return sendError(res, 400, first.msg);
  }
  return next();
}

module.exports = { validateRequest };
