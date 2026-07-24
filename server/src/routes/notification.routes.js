const r = require('express').Router();
const c = require('../controllers/notification.controller');
const { protect } = require('../middlewares/auth');
r.get('/', protect, c.list);
r.post('/:id/read', protect, c.markRead);
r.post('/read-all', protect, c.markAllRead);
module.exports = r;
