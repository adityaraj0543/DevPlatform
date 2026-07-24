const r = require('express').Router();
const c = require('../controllers/admin.controller');
const { protect } = require('../middlewares/auth');
const { requireRole } = require('../middlewares/role');
r.get('/stats', protect, requireRole('admin'), c.stats);
module.exports = r;
