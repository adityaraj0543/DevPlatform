const mongoose = require('mongoose');
const s = new mongoose.Schema({
  body: { type: String, required: true, maxlength: 5000 },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  target: {
    kind: { type: String, enum: ['issue', 'pull_request', 'commit'], required: true },
    id: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
  },
  mentions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  attachments: [{ url: String, publicId: String, name: String }],
}, { timestamps: true });
s.index({ 'target.kind': 1, 'target.id': 1, createdAt: -1 });
module.exports = mongoose.model('Comment', s);
