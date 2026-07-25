const AppError = require('../utils/AppError');
const { HTTP_STATUS } = require('../constants');
const {
  getPagination,
  buildSort,
  buildSearchFilter,
  paginateResult,
} = require('../utils/pagination');

const listResources = async (
  Model,
  {
    query = {},
    searchFields = [],
    defaultSort = '-createdAt',
    filter = {},
    populate = [],
  } = {},
) => {
  const { page, limit, skip } = getPagination(query);
  const sort = buildSort(query.sort, defaultSort);
  const searchFilter = buildSearchFilter(query.search, searchFields);

  const finalFilter = {
    ...filter,
    ...searchFilter,
  };

  const [items, total] = await Promise.all([
    Model.find(finalFilter).sort(sort).skip(skip).limit(limit).populate(populate),
    Model.countDocuments(finalFilter),
  ]);

  return paginateResult({ items, total, page, limit });
};

const getResourceById = async (Model, id, { populate = [], notFoundMessage = 'Resource not found' } = {}) => {
  const item = await Model.findById(id).populate(populate);
  if (!item) {
    throw new AppError(notFoundMessage, HTTP_STATUS.NOT_FOUND);
  }
  return item;
};

const createResource = async (Model, payload) => {
  return Model.create(payload);
};

const updateResource = async (
  Model,
  id,
  payload,
  { notFoundMessage = 'Resource not found' } = {},
) => {
  const item = await Model.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!item) {
    throw new AppError(notFoundMessage, HTTP_STATUS.NOT_FOUND);
  }

  return item;
};

const deleteResource = async (Model, id, { notFoundMessage = 'Resource not found' } = {}) => {
  const item = await Model.findByIdAndDelete(id);
  if (!item) {
    throw new AppError(notFoundMessage, HTTP_STATUS.NOT_FOUND);
  }
  return item;
};

module.exports = {
  listResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
};
