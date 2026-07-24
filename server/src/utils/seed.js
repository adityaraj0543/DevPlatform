require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Project = require('../models/Project');
const Repository = require('../models/Repository');
const Issue = require('../models/Issue');
const Channel = require('../models/Channel');

(async () => {
  await connectDB();
  await Promise.all([User, Project, Repository, Issue, Channel].map((M) => M.deleteMany({})));
  const admin = await User.create({ name: 'Admin', username: 'admin', email: 'admin@devplatform.io', password: 'admin1234', role: 'admin', emailVerified: true });
  const dev = await User.create({ name: 'Ada Lovelace', username: 'ada', email: 'ada@devplatform.io', password: 'devpass123', role: 'developer', emailVerified: true, bio: 'First programmer.', skills: ['algorithms', 'math'] });
  const owner = await User.create({ name: 'Grace Hopper', username: 'grace', email: 'grace@devplatform.io', password: 'devpass123', role: 'project_owner', emailVerified: true });

  const proj = await Project.create({ name: 'Analytical Engine', slug: 'analytical-engine-x1', description: 'Compute engine', owner: owner._id, members: [{ user: owner._id, role: 'owner' }, { user: dev._id, role: 'contributor' }], visibility: 'public' });
  const repo = await Repository.create({ name: 'core', slug: 'core', description: 'Core lib', project: proj._id, owner: owner._id, visibility: 'public', readme: '# Core' });
  await Issue.create({ number: 1, title: 'Set up CI', project: proj._id, author: dev._id, assignees: [dev._id], priority: 'high', status: 'todo' });
  await Issue.create({ number: 2, title: 'Write README', project: proj._id, author: owner._id, priority: 'medium', status: 'in_progress' });
  await Channel.create({ name: 'general', slug: 'general', kind: 'channel', members: [admin._id, dev._id, owner._id], createdBy: admin._id });

  console.log('Seeded users: admin@devplatform.io / admin1234 | ada@... grace@... / devpass123');
  await mongoose.disconnect();
  process.exit(0);
})();
