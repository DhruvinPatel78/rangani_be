const Family = require('../models/Family');
const {
  listResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
} = require('./crud.service');

const getFamilies = (query) =>
  listResources(Family, {
    query,
    searchFields: ['name', 'headName', 'city'],
    defaultSort: '-createdAt',
    populate: [
      { path: 'native', select: 'name' },
      { path: 'parentFamily', select: 'name' },
      { path: 'associatedFirms', select: 'name city' },
      { path: 'country', select: 'name code' },
      { path: 'state', select: 'name' },
      { path: 'district', select: 'name' },
      { path: 'cityRef', select: 'name' },
    ],
  });

const getFamilyById = (id) =>
  getResourceById(Family, id, {
    populate: [
      { path: 'native', select: 'name' },
      { path: 'parentFamily', select: 'name' },
      { path: 'associatedFirms', select: 'name city' },
      { path: 'country', select: 'name code' },
      { path: 'state', select: 'name' },
      { path: 'district', select: 'name' },
      { path: 'cityRef', select: 'name' },
    ],
    notFoundMessage: 'Family not found',
  });

const createFamily = (payload, userId) =>
  createResource(Family, { ...payload, createdBy: userId });

const updateFamily = (id, payload) =>
  updateResource(Family, id, payload, { notFoundMessage: 'Family not found' });

const deleteFamily = (id) =>
  deleteResource(Family, id, { notFoundMessage: 'Family not found' });

module.exports = {
  getFamilies,
  getFamilyById,
  createFamily,
  updateFamily,
  deleteFamily,
};
