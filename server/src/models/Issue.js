const mongoose = require('mongoose');
const s = new mongoose.Schema({
  number: { type: Number, required: true },
  title: { type: String, required: true, maxlength: 200 },
  body: String,
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
  repository: { type: mongoose.Schema.Types.ObjectId, ref: 'Repository' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true }],
  labels: [String],
  milestone: String,
  priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium', index: true },
  status: { type: String, enum: ['todo', 'in_progress', 'review', 'done', 'closed'], default: 'todo', index: true },
  order: { type: Number, default: 0 },
  sprint: String,
  attachments: [{ url: String, publicId: String, name: String, size: Number, mime: String }],
  closedAt: Date,
}, { timestamps: true });
s.index({ project: 1, number: 1 }, { unique: true });
s.index({ title: 'text', body: 'text' });
module.exports = mongoose.model('Issue', s);
