const mongoose = require('mongoose');
const s = new mongoose.Schema({
  channel: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel', required: true, index: true },
  author:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  body:    { type: String, maxlength: 5000 },
  attachments: [{ url: String, publicId: String, name: String, mime: String, size: Number }],
  mentions:[{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  reactions:[{ emoji: String, users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] }],
  readBy:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  edited:  { type: Boolean, default: false },
}, { timestamps: true });
s.index({ channel: 1, createdAt: -1 });
module.exports = mongoose.model('Message', s);
