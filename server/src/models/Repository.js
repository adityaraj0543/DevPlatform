const mongoose = require('mongoose');
const repoSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  slug: { type: String, required: true, lowercase: true },
  description: String,
  visibility: { type: String, enum: ['public', 'private'], default: 'private' },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
  owner:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  defaultBranch: { type: String, default: 'main' },
  readme:  { type: String, default: '' },
  stars: { type: Number, default: 0 },
  forks: { type: Number, default: 0 },
  language: String,
  size: { type: Number, default: 0 },
}, { timestamps: true });
repoSchema.index({ project: 1, slug: 1 }, { unique: true });
repoSchema.index({ name: 'text', description: 'text' });
module.exports = mongoose.model('Repository', repoSchema);
