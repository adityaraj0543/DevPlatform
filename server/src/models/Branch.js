const mongoose = require('mongoose');
const s = new mongoose.Schema({
  name: { type: String, required: true },
  repository: { type: mongoose.Schema.Types.ObjectId, ref: 'Repository', required: true, index: true },
  fromBranch: String,
  headCommit: { type: mongoose.Schema.Types.ObjectId, ref: 'Commit' },
  protected: { type: Boolean, default: false },
}, { timestamps: true });
s.index({ repository: 1, name: 1 }, { unique: true });
module.exports = mongoose.model('Branch', s);
