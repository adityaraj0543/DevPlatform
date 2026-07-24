const Project = require('../models/Project');
const Repository = require('../models/Repository');
const Issue = require('../models/Issue');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

exports.global = asyncHandler(async (req, res) => {
  const q = (req.query.q || '').trim(); if (!q) return res.json({ ok: true, results: {} });
  const rx = { $regex: q, $options: 'i' };
  const [projects, repos, issues, users] = await Promise.all([
    Project.find({ $or: [{ name: rx }, { description: rx }] }).limit(10),
    Repository.find({ $or: [{ name: rx }, { description: rx }] }).limit(10),
    Issue.find({ $or: [{ title: rx }, { body: rx }] }).limit(10),
    User.find({ $or: [{ name: rx }, { username: rx }, { email: rx }] }).limit(10),
  ]);
  res.json({ ok: true, results: { projects, repos, issues, users } });
});
