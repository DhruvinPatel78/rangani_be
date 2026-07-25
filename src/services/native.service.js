const Native = require('../models/Native');
const {
  listResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
} = require('./crud.service');

const getNatives = (query) =>
  listResources(Native, {
    query,
    searchFields: ['name'],
    defaultSort: 'name',
  });

const getNativeById = (id) =>
  getResourceById(Native, id, { notFoundMessage: 'Native place not found' });

const createNative = (payload) => createResource(Native, payload);

const updateNative = (id, payload) =>
  updateResource(Native, id, payload, { notFoundMessage: 'Native place not found' });

const deleteNative = (id) =>
  deleteResource(Native, id, { notFoundMessage: 'Native place not found' });

module.exports = {
  getNatives,
  getNativeById,
  createNative,
  updateNative,
  deleteNative,
};
