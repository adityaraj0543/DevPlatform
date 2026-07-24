const crypto = require('crypto');
const Commit = require('../models/Commit');
const Branch = require('../models/Branch');
const asyncHandler = require('../utils/asyncHandler');
const apiFeatures = require('../utils/apiFeatures');

exports.list = asyncHandler(async (req, res) => {
  const q = { ...req.query, repository: req.params.repoId };
  const { exec } = apiFeatures(Commit, q, { searchFields: ['message', 'sha'] });
  res.json({ ok: true, ...(await exec('author')) });
});
exports.create = asyncHandler(async (req, res) => {
  const { branch = 'main', message, files = [], parents = [] } = req.body;
  const sha = crypto.createHash('sha1').update(`${Date.now()}-${message}-${req.user._id}`).digest('hex');
  const commit = await Commit.create({ sha, repository: req.params.repoId, branch, author: req.user._id, message, files, parents });
  await Branch.findOneAndUpdate({ repository: req.params.repoId, name: branch }, { headCommit: commit._id }, { upsert: true });
  res.status(201).json({ ok: true, commit });
});
exports.get = asyncHandler(async (req, res) => res.json({ ok: true, commit: await Commit.findById(req.params.id).populate('author') }));
