const mongoose = require('mongoose');
const fileChange = new mongoose.Schema({
  path: String, action: { type: String, enum: ['added', 'modified', 'deleted'] },
  content: String, additions: Number, deletions: Number,
}, { _id: false });
const s = new mongoose.Schema({
  sha: { type: String, required: true, index: true },
  repository: { type: mongoose.Schema.Types.ObjectId, ref: 'Repository', required: true, index: true },
  branch: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true, maxlength: 5000 },
  files: [fileChange],
  parents: [String],
}, { timestamps: true });
s.index({ repository: 1, sha: 1 }, { unique: true });
module.exports = mongoose.model('Commit', s);
