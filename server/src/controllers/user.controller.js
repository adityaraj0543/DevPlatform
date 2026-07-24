const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const apiFeatures = require('../utils/apiFeatures');
const ApiError = require('../utils/ApiError');

exports.list = asyncHandler(async (req, res) => {
  const { exec } = apiFeatures(User, req.query, { searchFields: ['name', 'username', 'email'] });
  res.json({ ok: true, ...(await exec()) });
});
exports.get = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');
  res.json({ ok: true, user });
});
exports.updateMe = asyncHandler(async (req, res) => {
  const allowed = ['name', 'bio', 'skills', 'experience', 'links', 'settings'];
  const patch = {}; for (const k of allowed) if (k in req.body) patch[k] = req.body[k];
  const user = await User.findByIdAndUpdate(req.user._id, patch, { new: true, runValidators: true });
  res.json({ ok: true, user });
});
exports.uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'No file');
  req.user.avatar = { url: req.file.path || req.file.secure_url, publicId: req.file.filename || req.file.public_id };
  await req.user.save();
  res.json({ ok: true, avatar: req.user.avatar });
});
exports.remove = asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});
