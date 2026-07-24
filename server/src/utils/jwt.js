const jwt = require('jsonwebtoken');
const sign = (payload, secret, expiresIn) => jwt.sign(payload, secret, { expiresIn });
exports.signAccess = (u) => sign({ id: u._id, role: u.role }, process.env.JWT_ACCESS_SECRET, process.env.JWT_ACCESS_EXPIRES || '15m');
exports.signRefresh = (u) => sign({ id: u._id, t: 'refresh' }, process.env.JWT_REFRESH_SECRET, process.env.JWT_REFRESH_EXPIRES || '7d');
exports.verifyAccess = (t) => jwt.verify(t, process.env.JWT_ACCESS_SECRET);
exports.verifyRefresh = (t) => jwt.verify(t, process.env.JWT_REFRESH_SECRET);
