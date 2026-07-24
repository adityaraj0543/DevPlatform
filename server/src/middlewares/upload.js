const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = process.env.CLOUDINARY_CLOUD_NAME
  ? new CloudinaryStorage({
      cloudinary,
      params: { folder: 'devplatform', resource_type: 'auto' },
    })
  : multer.memoryStorage();

const fileFilter = (_req, file, cb) => {
  const allowed = /^(image|application|text|video|audio)\//;
  if (allowed.test(file.mimetype)) cb(null, true); else cb(new Error('Unsupported file type'));
};
module.exports = multer({ storage, limits: { fileSize: 20 * 1024 * 1024 }, fileFilter });
