const mongoose = require('mongoose');
const s = new mongoose.Schema({
  name: String, url: String, publicId: String, size: Number, mime: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
}, { timestamps: true });
module.exports = mongoose.model('File', s);
