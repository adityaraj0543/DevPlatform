const r = require('express').Router();
const c = require('../controllers/search.controller');
const { optional } = require('../middlewares/auth');
r.get('/', optional, c.global);
module.exports = r;
