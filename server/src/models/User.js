const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true, maxlength: 80 },
  username: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  password: { type: String, minlength: 8, select: false },
  avatar:   { url: String, publicId: String },
  bio:      { type: String, maxlength: 500 },
  skills:   [{ type: String }],
  experience: { type: String, maxlength: 1000 },
  links:    { github: String, twitter: String, linkedin: String, website: String },
  role:     { type: String, enum: ['admin', 'developer', 'project_owner'], default: 'developer', index: true },
  provider: { type: String, enum: ['local', 'google'], default: 'local' },
  googleId: { type: String, index: true, sparse: true },
  emailVerified: { type: Boolean, default: false },
  verifyToken: { type: String, select: false },
  verifyTokenExpires: { type: Date, select: false },
  resetToken: { type: String, select: false },
  resetTokenExpires: { type: Date, select: false },
  refreshTokens: [{ token: String, createdAt: { type: Date, default: Date.now } }],
  online:   { type: Boolean, default: false },
  lastSeen: Date,
  settings: {
    theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
    emailNotifications: { type: Boolean, default: true },
  },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
userSchema.methods.comparePassword = function (p) { return bcrypt.compare(p, this.password); };
userSchema.methods.toJSON = function () {
  const o = this.toObject();
  delete o.password; delete o.refreshTokens; delete o.verifyToken; delete o.resetToken;
  delete o.verifyTokenExpires; delete o.resetTokenExpires;
  return o;
};

module.exports = mongoose.model('User', userSchema);
