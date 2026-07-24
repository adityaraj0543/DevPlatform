const mongoose = require('mongoose');
const s = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, lowercase: true, index: true },
  description: String,
  kind: { type: String, enum: ['channel', 'dm', 'group'], default: 'channel' },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  private: { type: Boolean, default: false },
  lastMessageAt: Date,
}, { timestamps: true });
module.exports = mongoose.model('Channel', s);
