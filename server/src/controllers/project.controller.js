const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 60) + '-' + Math.random().toString(36).slice(2, 6);
const Project = require('../models/Project');
const Activity = require('../models/Activity');
const asyncHandler = require('../utils/asyncHandler');
const apiFeatures = require('../utils/apiFeatures');
const ApiError = require('../utils/ApiError');

const canAccess = (project, user) => {
  if (!project) return false;
  if (project.visibility === 'public') return true;
  if (!user) return false;
  if (String(project.owner) === String(user._id) || user.role === 'admin') return true;
  return project.members.some((m) => String(m.user) === String(user._id));
};

exports.list = asyncHandler(async (req, res) => {
  const q = { ...req.query };
  if (!req.user || req.user.role !== 'admin') {
    q.$or = [{ visibility: 'public' }, ...(req.user ? [{ owner: req.user._id }, { 'members.user': req.user._id }] : [])];
  }
  const { exec } = apiFeatures(Project, q, { searchFields: ['name', 'description'] });
  res.json({ ok: true, ...(await exec(['owner', 'members.user'])) });
});
exports.create = asyncHandler(async (req, res) => {
  const p = await Project.create({ ...req.body, slug: slugify(req.body.name), owner: req.user._id, members: [{ user: req.user._id, role: 'owner' }] });
  await Activity.create({ actor: req.user._id, verb: 'created project', target: { kind: 'project', id: p._id, name: p.name }, project: p._id });
  res.status(201).json({ ok: true, project: p });
});
exports.get = asyncHandler(async (req, res) => {
  const p = await Project.findById(req.params.id).populate('owner members.user');
  if (!p || !canAccess(p, req.user)) throw new ApiError(404, 'Project not found');
  res.json({ ok: true, project: p });
});
exports.update = asyncHandler(async (req, res) => {
  const p = await Project.findById(req.params.id);
  if (!p) throw new ApiError(404, 'Project not found');
  if (String(p.owner) !== String(req.user._id) && req.user.role !== 'admin') throw new ApiError(403, 'Forbidden');
  Object.assign(p, req.body); await p.save();
  res.json({ ok: true, project: p });
});
exports.remove = asyncHandler(async (req, res) => {
  const p = await Project.findById(req.params.id);
  if (!p) throw new ApiError(404, 'Not found');
  if (String(p.owner) !== String(req.user._id) && req.user.role !== 'admin') throw new ApiError(403, 'Forbidden');
  await p.deleteOne();
  res.json({ ok: true });
});
exports.addMember = asyncHandler(async (req, res) => {
  const p = await Project.findById(req.params.id);
  if (!p) throw new ApiError(404, 'Not found');
  if (String(p.owner) !== String(req.user._id) && req.user.role !== 'admin') throw new ApiError(403, 'Forbidden');
  const { userId, role = 'contributor' } = req.body;
  if (!p.members.some((m) => String(m.user) === String(userId))) p.members.push({ user: userId, role });
  await p.save();
  res.json({ ok: true, project: p });
});
exports.removeMember = asyncHandler(async (req, res) => {
  const p = await Project.findById(req.params.id);
  if (!p) throw new ApiError(404, 'Not found');
  if (String(p.owner) !== String(req.user._id) && req.user.role !== 'admin') throw new ApiError(403, 'Forbidden');
  p.members = p.members.filter((m) => String(m.user) !== String(req.params.userId));
  await p.save();
  res.json({ ok: true, project: p });
});
