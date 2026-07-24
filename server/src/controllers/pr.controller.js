const PullRequest = require('../models/PullRequest');
const asyncHandler = require('../utils/asyncHandler');
const apiFeatures = require('../utils/apiFeatures');
const ApiError = require('../utils/ApiError');

exports.list = asyncHandler(async (req, res) => {
  const q = { ...req.query, repository: req.params.repoId };
  const { exec } = apiFeatures(PullRequest, q, { searchFields: ['title', 'body'] });
  res.json({ ok: true, ...(await exec(['author', 'reviewers'])) });
});
exports.create = asyncHandler(async (req, res) => {
  const number = (await PullRequest.countDocuments({ repository: req.params.repoId })) + 1;
  const pr = await PullRequest.create({ ...req.body, repository: req.params.repoId, author: req.user._id, number });
  res.status(201).json({ ok: true, pr });
});
exports.merge = asyncHandler(async (req, res) => {
  const pr = await PullRequest.findById(req.params.id);
  if (!pr) throw new ApiError(404, 'Not found');
  pr.status = 'merged'; pr.mergedAt = new Date(); pr.mergedBy = req.user._id;
  await pr.save();
  res.json({ ok: true, pr });
});
exports.close = asyncHandler(async (req, res) => {
  const pr = await PullRequest.findByIdAndUpdate(req.params.id, { status: 'closed' }, { new: true });
  res.json({ ok: true, pr });
});
