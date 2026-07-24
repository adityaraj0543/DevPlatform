const { verifyAccess } = require('../utils/jwt');
const ApiError = require('../utils/ApiError');
const User = require('../models/User');

exports.protect = async (req, _res, next) => {
  try {
    const h = req.headers.authorization || '';
    const token = h.startsWith('Bearer ') ? h.slice(7) : req.cookies?.access_token;
    if (!token) throw new ApiError(401, 'Not authenticated');
    const decoded = verifyAccess(token);
    const user = await User.findById(decoded.id);
    if (!user) throw new ApiError(401, 'User not found');
    req.user = user;
    next();
  } catch (e) {
    next(new ApiError(401, 'Invalid or expired token'));
  }
};

exports.optional = async (req, _res, next) => {
  try {
    const h = req.headers.authorization || '';
    const token = h.startsWith('Bearer ') ? h.slice(7) : req.cookies?.access_token;
    if (token) {
      const decoded = verifyAccess(token);
      req.user = await User.findById(decoded.id);
    }
  } catch {}
  next();
};
