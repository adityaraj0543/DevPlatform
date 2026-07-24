const Activity = require('../models/Activity');
const asyncHandler = require('../utils/asyncHandler');
const apiFeatures = require('../utils/apiFeatures');

exports.list = asyncHandler(async (req, res) => {
  const { exec } = apiFeatures(Activity, req.query, {});
  res.json({ ok: true, ...(await exec('actor')) });
});
