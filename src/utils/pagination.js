const { DEFAULT_PAGE, DEFAULT_LIMIT, MAX_LIMIT } = require('../constants');

const getPagination = (query = {}) => {
  const page = Math.max(Number(query.page) || DEFAULT_PAGE, 1);
  let limit = Number(query.limit ?? query.pageSize) || DEFAULT_LIMIT;
  limit = Math.min(Math.max(limit, 1), MAX_LIMIT);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

const buildSort = (sort, defaultSort = '-createdAt') => {
  if (!sort || typeof sort !== 'string') {
    return defaultSort;
  }

  return sort
    .split(',')
    .map((field) => field.trim())
    .filter(Boolean)
    .join(' ');
};

const buildSearchFilter = (search, fields = []) => {
  if (!search || !fields.length) {
    return {};
  }

  const regex = { $regex: search.trim(), $options: 'i' };
  return {
    $or: fields.map((field) => ({ [field]: regex })),
  };
};

const paginateResult = ({ items, total, page, limit }) => ({
  items,
  pagination: {
    total,
    page,
    limit,
    totalPages: Math.max(Math.ceil(total / limit), 1),
  },
});

module.exports = {
  getPagination,
  buildSort,
  buildSearchFilter,
  paginateResult,
};
