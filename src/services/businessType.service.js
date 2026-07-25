const BusinessType = require('../models/BusinessType');
const {
  listResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
} = require('./crud.service');

const getBusinessTypes = (query) =>
  listResources(BusinessType, {
    query,
    searchFields: ['name'],
    defaultSort: 'name',
  });

const getBusinessTypeById = (id) =>
  getResourceById(BusinessType, id, { notFoundMessage: 'Business type not found' });

const createBusinessType = (payload) => createResource(BusinessType, payload);

const updateBusinessType = (id, payload) =>
  updateResource(BusinessType, id, payload, { notFoundMessage: 'Business type not found' });

const deleteBusinessType = (id) =>
  deleteResource(BusinessType, id, { notFoundMessage: 'Business type not found' });

module.exports = {
  getBusinessTypes,
  getBusinessTypeById,
  createBusinessType,
  updateBusinessType,
  deleteBusinessType,
};
