const Channel = require('../models/Channel');
const Message = require('../models/Message');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { getIO } = require('../sockets/registry');

exports.listChannels = asyncHandler(async (req, res) => {
  const channels = await Channel.find({ $or: [{ private: false }, { members: req.user._id }] }).populate('members', 'name username avatar').sort('-lastMessageAt');
  res.json({ ok: true, channels });
});
exports.createChannel = asyncHandler(async (req, res) => {
  const slug = req.body.name.toLowerCase().replace(/\s+/g, '-');
  const channel = await Channel.create({ ...req.body, slug, createdBy: req.user._id, members: [...(req.body.members || []), req.user._id] });
  res.status(201).json({ ok: true, channel });
});
exports.openDM = asyncHandler(async (req, res) => {
  const other = await User.findById(req.params.userId);
  if (!other) throw new ApiError(404, 'User not found');
  const members = [req.user._id, other._id].sort();
  let ch = await Channel.findOne({ kind: 'dm', members: { $all: members, $size: 2 } });
  if (!ch) ch = await Channel.create({ kind: 'dm', name: `${req.user.username}-${other.username}`, members, private: true, createdBy: req.user._id });
  res.json({ ok: true, channel: ch });
});
exports.listMessages = asyncHandler(async (req, res) => {
  const limit = Math.min(100, parseInt(req.query.limit) || 50);
  const before = req.query.before ? new Date(req.query.before) : new Date();
  const messages = await Message.find({ channel: req.params.channelId, createdAt: { $lt: before } }).populate('author', 'name username avatar').sort('-createdAt').limit(limit);
  res.json({ ok: true, messages: messages.reverse() });
});
exports.sendMessage = asyncHandler(async (req, res) => {
  const channel = await Channel.findById(req.params.channelId);
  if (!channel) throw new ApiError(404, 'Channel not found');
  const attachments = (req.files || []).map((f) => ({ url: f.path || f.secure_url, publicId: f.filename || f.public_id, name: f.originalname, size: f.size, mime: f.mimetype }));
  const msg = await Message.create({ channel: channel._id, author: req.user._id, body: req.body.body, attachments });
  await msg.populate('author', 'name username avatar');
  channel.lastMessageAt = new Date(); await channel.save();
  getIO()?.to(`channel:${channel._id}`).emit('chat', msg);
  res.status(201).json({ ok: true, message: msg });
});
exports.react = asyncHandler(async (req, res) => {
  const { emoji } = req.body;
  const msg = await Message.findById(req.params.id);
  if (!msg) throw new ApiError(404, 'Not found');
  const existing = msg.reactions.find((r) => r.emoji === emoji);
  if (existing) {
    const idx = existing.users.findIndex((u) => String(u) === String(req.user._id));
    if (idx >= 0) existing.users.splice(idx, 1); else existing.users.push(req.user._id);
    msg.reactions = msg.reactions.filter((r) => r.users.length);
  } else msg.reactions.push({ emoji, users: [req.user._id] });
  await msg.save();
  getIO()?.to(`channel:${msg.channel}`).emit('chat:reaction', { id: msg._id, reactions: msg.reactions });
  res.json({ ok: true, message: msg });
});
