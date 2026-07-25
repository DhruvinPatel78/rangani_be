const Firm = require('../models/Firm');
const {
  listResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
} = require('./crud.service');

const getFirms = (query) =>
  listResources(Firm, {
    query,
    searchFields: ['name', 'ownerName', 'category', 'city'],
    defaultSort: '-createdAt',
    populate: [{ path: 'family', select: 'name' }],
  });

const getFirmById = (id) =>
  getResourceById(Firm, id, {
    populate: [{ path: 'family', select: 'name' }],
    notFoundMessage: 'Firm not found',
  });

const createFirm = (payload, userId) =>
  createResource(Firm, { ...payload, createdBy: userId });

const updateFirm = (id, payload) =>
  updateResource(Firm, id, payload, { notFoundMessage: 'Firm not found' });

const deleteFirm = (id) => deleteResource(Firm, id, { notFoundMessage: 'Firm not found' });

module.exports = {
  getFirms,
  getFirmById,
  createFirm,
  updateFirm,
  deleteFirm,
};
