const r = require('express').Router();
const { body } = require('express-validator');
const v = require('../middlewares/validate');
const c = require('../controllers/comment.controller');
const { protect } = require('../middlewares/auth');
r.get('/:kind/:id', protect, c.list);
r.post('/:kind/:id', protect, body('body').isString().isLength({ min: 1 }), v, c.create);
r.delete('/:id', protect, c.remove);
module.exports = r;
