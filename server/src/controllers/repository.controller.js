const Repository = require('../models/Repository');
const Project = require('../models/Project');
const Branch = require('../models/Branch');
const asyncHandler = require('../utils/asyncHandler');
const apiFeatures = require('../utils/apiFeatures');
const ApiError = require('../utils/ApiError');
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

exports.list = asyncHandler(async (req, res) => {
  const q = { ...req.query };
  if (!req.user || req.user.role !== 'admin') q.$or = [{ visibility: 'public' }, ...(req.user ? [{ owner: req.user._id }] : [])];
  const { exec } = apiFeatures(Repository, q, { searchFields: ['name', 'description'] });
  res.json({ ok: true, ...(await exec(['owner', 'project'])) });
});
exports.create = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.body.project);
  if (!project) throw new ApiError(404, 'Project not found');
  const repo = await Repository.create({
    name: req.body.name, slug: slugify(req.body.name), description: req.body.description,
    visibility: req.body.visibility || 'private', project: project._id, owner: req.user._id,
    readme: req.body.readme || `# ${req.body.name}\n\n${req.body.description || ''}`,
  });
  await Branch.create({ name: 'main', repository: repo._id });
  res.status(201).json({ ok: true, repository: repo });
});
exports.get = asyncHandler(async (req, res) => {
  const repo = await Repository.findById(req.params.id).populate('owner project');
  if (!repo) throw new ApiError(404, 'Not found');
  res.json({ ok: true, repository: repo });
});
exports.update = asyncHandler(async (req, res) => {
  const repo = await Repository.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!repo) throw new ApiError(404, 'Not found');
  res.json({ ok: true, repository: repo });
});
exports.remove = asyncHandler(async (req, res) => {
  await Repository.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});
