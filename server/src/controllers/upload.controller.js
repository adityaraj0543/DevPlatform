const File = require('../models/File');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

exports.upload = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'No file');
  const f = await File.create({
    name: req.file.originalname, url: req.file.path || req.file.secure_url,
    publicId: req.file.filename || req.file.public_id, size: req.file.size, mime: req.file.mimetype,
    owner: req.user._id, project: req.body.project,
  });
  res.status(201).json({ ok: true, file: f });
});
