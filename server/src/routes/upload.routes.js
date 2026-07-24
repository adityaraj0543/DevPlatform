const r = require('express').Router();
const upload = require('../middlewares/upload');
const c = require('../controllers/upload.controller');
const { protect } = require('../middlewares/auth');
r.post('/', protect, upload.single('file'), c.upload);
module.exports = r;
