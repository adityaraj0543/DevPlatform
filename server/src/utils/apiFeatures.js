// Query helper: pagination, sorting, filtering, search
module.exports = function apiFeatures(model, query, { searchFields = [], defaultSort = '-createdAt' } = {}) {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20));
  const sort = query.sort || defaultSort;

  const filter = {};
  for (const [k, v] of Object.entries(query)) {
    if (['page', 'limit', 'sort', 'q', 'fields'].includes(k)) continue;
    filter[k] = v;
  }
  if (query.q && searchFields.length) {
    filter.$or = searchFields.map((f) => ({ [f]: { $regex: query.q, $options: 'i' } }));
  }
  const fields = query.fields ? query.fields.split(',').join(' ') : '';

  const exec = async (populate) => {
    let q = model.find(filter).sort(sort).skip((page - 1) * limit).limit(limit);
    if (fields) q = q.select(fields);
    if (populate) q = q.populate(populate);
    const [items, total] = await Promise.all([q, model.countDocuments(filter)]);
    return { items, total, page, limit, pages: Math.ceil(total / limit) };
  };
  return { exec, filter };
};
