const mongoose = require('mongoose');
const s = new mongoose.Schema({
  number: { type: Number, required: true },
  title: { type: String, required: true, maxlength: 200 },
  body: String,
  repository: { type: mongoose.Schema.Types.ObjectId, ref: 'Repository', required: true, index: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sourceBranch: { type: String, required: true },
  targetBranch: { type: String, required: true },
  status: { type: String, enum: ['open', 'merged', 'closed'], default: 'open', index: true },
  reviewers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  commits:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Commit' }],
  mergedAt: Date,
  mergedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });
s.index({ repository: 1, number: 1 }, { unique: true });
module.exports = mongoose.model('PullRequest', s);
