const express = require('express');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { loginRules } = require('../validators/authValidators');
const { validateRequest } = require('../middleware/validateRequest');
const { asyncHandler, sendError } = require('../utils/errors');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts, try again later' },
});

const meLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
});

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function signToken(user) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }
  const expiresIn = process.env.JWT_EXPIRES_IN || '1d';
  return jwt.sign(
    { sub: String(user._id), email: user.email, role: user.role },
    secret,
    { expiresIn }
  );
}

router.post(
  '/login',
  loginLimiter,
  loginRules,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) {
      await delay(350 + Math.floor(Math.random() * 200));
      return sendError(res, 401, 'Invalid credentials');
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      await delay(350 + Math.floor(Math.random() * 200));
      return sendError(res, 401, 'Invalid credentials');
    }

    if (user.role !== 'admin') {
      await delay(200 + Math.floor(Math.random() * 150));
      return sendError(res, 403, 'Forbidden');
    }

    let token;
    try {
      token = signToken(user);
    } catch {
      return sendError(res, 500, 'Server configuration error');
    }
    const prod = process.env.NODE_ENV === 'production';

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: prod,
      sameSite: prod ? 'strict' : 'lax',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
    });

    return res.json({
      user: { email: user.email, role: user.role },
    });
  })
);

router.post(
  '/logout',
  asyncHandler(async (req, res) => {
    const prod = process.env.NODE_ENV === 'production';
    res.clearCookie('access_token', {
      path: '/',
      httpOnly: true,
      secure: prod,
      sameSite: prod ? 'strict' : 'lax',
    });
    return res.json({ ok: true });
  })
);

router.get(
  '/me',
  meLimiter,
  asyncHandler(async (req, res) => {
    const { getTokenFromRequest } = require('../middleware/auth');
    const secret = process.env.JWT_SECRET;
    const token = getTokenFromRequest(req);
    if (!token || !secret) {
      return res.json({ user: null });
    }
    try {
      const payload = jwt.verify(token, secret);
      if (payload.role !== 'admin') {
        return res.json({ user: null });
      }
      return res.json({
        user: { email: payload.email, role: payload.role },
      });
    } catch {
      return res.json({ user: null });
    }
  })
);

module.exports = router;
