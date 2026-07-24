const mongoose = require('mongoose');
const memberSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['owner', 'maintainer', 'contributor', 'viewer'], default: 'contributor' },
}, { _id: false });

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120, index: true },
  slug: { type: String, required: true, unique: true, lowercase: true, index: true },
  description: { type: String, maxlength: 2000 },
  visibility: { type: String, enum: ['public', 'private'], default: 'private' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  members: [memberSchema],
  labels: [{ name: String, color: String }],
  milestones: [{ title: String, description: String, dueDate: Date, closed: { type: Boolean, default: false } }],
  sprints: [{ name: String, startDate: Date, endDate: Date, active: Boolean }],
  archived: { type: Boolean, default: false },
}, { timestamps: true });

projectSchema.index({ name: 'text', description: 'text' });
module.exports = mongoose.model('Project', projectSchema);
