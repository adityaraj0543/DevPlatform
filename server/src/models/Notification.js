const mongoose = require('mongoose');
const s = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, enum: ['mention', 'issue', 'comment', 'pr', 'repo', 'invite', 'system'], required: true },
  title: String,
  body: String,
  link: String,
  read: { type: Boolean, default: false, index: true },
  meta: mongoose.Schema.Types.Mixed,
}, { timestamps: true });
module.exports = mongoose.model('Notification', s);
