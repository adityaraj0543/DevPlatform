const r = require('express').Router();
const { body } = require('express-validator');
const v = require('../middlewares/validate');
const c = require('../controllers/repository.controller');
const branch = require('../controllers/branch.controller');
const commit = require('../controllers/commit.controller');
const pr = require('../controllers/pr.controller');
const { protect, optional } = require('../middlewares/auth');

r.get('/', optional, c.list);
r.post('/', protect, body('name').isString().notEmpty(), body('project').isMongoId(), v, c.create);
r.get('/:id', optional, c.get);
r.patch('/:id', protect, c.update);
r.delete('/:id', protect, c.remove);

r.get('/:repoId/branches', protect, branch.list);
r.post('/:repoId/branches', protect, body('name').isString(), v, branch.create);
r.delete('/:repoId/branches/:id', protect, branch.remove);

r.get('/:repoId/commits', protect, commit.list);
r.post('/:repoId/commits', protect, body('message').isString().notEmpty(), v, commit.create);
r.get('/:repoId/commits/:id', protect, commit.get);

r.get('/:repoId/pulls', protect, pr.list);
r.post('/:repoId/pulls', protect, body('title').isString(), body('sourceBranch').isString(), body('targetBranch').isString(), v, pr.create);
r.post('/:repoId/pulls/:id/merge', protect, pr.merge);
r.post('/:repoId/pulls/:id/close', protect, pr.close);
module.exports = r;
