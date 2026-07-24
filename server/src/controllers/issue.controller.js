const Issue = require('../models/Issue');
const Activity = require('../models/Activity');
const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');
const apiFeatures = require('../utils/apiFeatures');
const ApiError = require('../utils/ApiError');
const { getIO } = require('../sockets/registry');

exports.list = asyncHandler(async (req, res) => {
  const { exec } = apiFeatures(Issue, req.query, { searchFields: ['title', 'body'] });
  res.json({ ok: true, ...(await exec(['author', 'assignees'])) });
});
exports.create = asyncHandler(async (req, res) => {
  const number = (await Issue.countDocuments({ project: req.body.project })) + 1;
  const issue = await Issue.create({ ...req.body, author: req.user._id, number });
  await Activity.create({ actor: req.user._id, verb: 'opened issue', target: { kind: 'issue', id: issue._id, name: issue.title }, project: issue.project });
  for (const a of issue.assignees || []) {
    await Notification.create({ user: a, type: 'issue', title: 'You were assigned an issue', body: issue.title, link: `/issues/${issue._id}` });
  }
  getIO()?.emit('issue', { action: 'created', issue });
  res.status(201).json({ ok: true, issue });
});
exports.get = asyncHandler(async (req, res) => {
  const issue = await Issue.findById(req.params.id).populate('author assignees');
  if (!issue) throw new ApiError(404, 'Not found');
  res.json({ ok: true, issue });
});
exports.update = asyncHandler(async (req, res) => {
  const issue = await Issue.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('author assignees');
  if (!issue) throw new ApiError(404, 'Not found');
  getIO()?.emit('issue', { action: 'updated', issue });
  res.json({ ok: true, issue });
});
exports.remove = asyncHandler(async (req, res) => {
  await Issue.findByIdAndDelete(req.params.id);
  getIO()?.emit('issue', { action: 'deleted', id: req.params.id });
  res.json({ ok: true });
});
exports.kanbanMove = asyncHandler(async (req, res) => {
  const { status, order } = req.body;
  const issue = await Issue.findByIdAndUpdate(req.params.id, { status, order }, { new: true });
  getIO()?.emit('kanban', { action: 'move', id: issue._id, status, order });
  res.json({ ok: true, issue });
});
exports.attach = asyncHandler(async (req, res) => {
  const issue = await Issue.findById(req.params.id);
  if (!issue) throw new ApiError(404, 'Not found');
  const files = (req.files || []).map((f) => ({ url: f.path || f.secure_url, publicId: f.filename || f.public_id, name: f.originalname, size: f.size, mime: f.mimetype }));
  issue.attachments.push(...files); await issue.save();
  res.json({ ok: true, issue });
});
