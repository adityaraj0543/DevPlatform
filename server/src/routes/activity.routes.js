const r = require('express').Router();
const c = require('../controllers/activity.controller');
const { protect } = require('../middlewares/auth');
r.get('/', protect, c.list);
module.exports = r;
