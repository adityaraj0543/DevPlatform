const mongoose = require('mongoose');
const s = new mongoose.Schema({
  actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  verb: { type: String, required: true },
  target: { kind: String, id: mongoose.Schema.Types.ObjectId, name: String },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', index: true },
  meta: mongoose.Schema.Types.Mixed,
}, { timestamps: true });
s.index({ createdAt: -1 });
module.exports = mongoose.model('Activity', s);
