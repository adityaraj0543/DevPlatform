const Comment = require('../models/Comment');
const Notification = require('../models/Notification');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { getIO } = require('../sockets/registry');

exports.list = asyncHandler(async (req, res) => {
  const { kind, id } = req.params;
  const comments = await Comment.find({ 'target.kind': kind, 'target.id': id }).populate('author').sort('createdAt');
  res.json({ ok: true, comments });
});
exports.create = asyncHandler(async (req, res) => {
  const { kind, id } = req.params;
  const mentionsRe = /@([a-z0-9_-]+)/gi;
  const usernames = [...(req.body.body || '').matchAll(mentionsRe)].map((m) => m[1]);
  const mentions = await User.find({ username: { $in: usernames } }).select('_id username');
  const comment = await Comment.create({ body: req.body.body, author: req.user._id, target: { kind, id }, mentions: mentions.map((m) => m._id) });
  for (const u of mentions) await Notification.create({ user: u._id, type: 'mention', title: 'You were mentioned', body: req.body.body.slice(0, 120), link: `/${kind}s/${id}` });
  await comment.populate('author');
  getIO()?.emit('comment', { action: 'created', comment });
  res.status(201).json({ ok: true, comment });
});
exports.remove = asyncHandler(async (req, res) => {
  const c = await Comment.findById(req.params.id);
  if (!c) throw new ApiError(404, 'Not found');
  if (String(c.author) !== String(req.user._id) && req.user.role !== 'admin') throw new ApiError(403, 'Forbidden');
  await c.deleteOne();
  res.json({ ok: true });
});
