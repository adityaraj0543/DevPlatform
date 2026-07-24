const mongoose = require('mongoose');
const s = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true, lowercase: true },
  description: String,
  members: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, role: String }],
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
}, { timestamps: true });
module.exports = mongoose.model('Team', s);
