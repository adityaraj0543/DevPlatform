const Branch = require('../models/Branch');
const asyncHandler = require('../utils/asyncHandler');
exports.list = asyncHandler(async (req, res) => res.json({ ok: true, branches: await Branch.find({ repository: req.params.repoId }) }));
exports.create = asyncHandler(async (req, res) => res.status(201).json({ ok: true, branch: await Branch.create({ ...req.body, repository: req.params.repoId }) }));
exports.remove = asyncHandler(async (req, res) => { await Branch.findByIdAndDelete(req.params.id); res.json({ ok: true }); });
