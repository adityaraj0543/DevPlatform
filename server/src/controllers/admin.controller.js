const User = require('../models/User');
const Project = require('../models/Project');
const Repository = require('../models/Repository');
const Issue = require('../models/Issue');
const Commit = require('../models/Commit');
const asyncHandler = require('../utils/asyncHandler');

exports.stats = asyncHandler(async (_req, res) => {
  const [users, projects, repos, issues, commits] = await Promise.all([
    User.countDocuments(), Project.countDocuments(), Repository.countDocuments(),
    Issue.countDocuments(), Commit.countDocuments(),
  ]);
  const mostActive = await Commit.aggregate([
    { $group: { _id: '$author', count: { $sum: 1 } } },
    { $sort: { count: -1 } }, { $limit: 10 },
    { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
    { $unwind: '$user' },
    { $project: { count: 1, 'user.name': 1, 'user.username': 1, 'user.avatar': 1 } },
  ]);
  const commitsPerDay = await Commit.aggregate([
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } }, { $limit: 30 },
  ]);
  const issuesByStatus = await Issue.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
  res.json({ ok: true, totals: { users, projects, repos, issues, commits }, mostActive, commitsPerDay, issuesByStatus });
});
