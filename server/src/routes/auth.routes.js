const r = require('express').Router();
const { body } = require('express-validator');
const c = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth');
const { authLimiter } = require('../middlewares/rateLimit');
const v = require('../middlewares/validate');

/**
 * @openapi
 * /auth/signup:
 *   post: { summary: Register a user, tags: [Auth] }
 */
r.post('/signup', authLimiter,
  body('name').isString().isLength({ min: 2, max: 80 }),
  body('username').isString().isLength({ min: 3, max: 30 }).matches(/^[a-z0-9_-]+$/i),
  body('email').isEmail(),
  body('password').isString().isLength({ min: 8 }),
  v, c.signup);
r.post('/login', authLimiter, body('email').isEmail(), body('password').isString(), v, c.login);
r.post('/google', authLimiter, body('credential').isString(), v, c.googleLogin);
r.post('/refresh', c.refresh);
r.post('/logout', protect, c.logout);
r.get('/me', protect, c.me);
r.post('/verify-email', body('token').isString(), body('email').isEmail(), v, c.verifyEmail);
r.post('/forgot-password', authLimiter, body('email').isEmail(), v, c.forgotPassword);
r.post('/reset-password', authLimiter, body('token').isString(), body('email').isEmail(), body('password').isLength({ min: 8 }), v, c.resetPassword);
module.exports = r;
