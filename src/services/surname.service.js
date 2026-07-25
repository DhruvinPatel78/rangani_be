const Surname = require('../models/Surname');
const {
  listResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
} = require('./crud.service');

const getSurnames = (query) =>
  listResources(Surname, {
    query,
    searchFields: ['name'],
    defaultSort: 'name',
  });

const getSurnameById = (id) =>
  getResourceById(Surname, id, { notFoundMessage: 'Surname not found' });

const createSurname = (payload) => createResource(Surname, payload);

const updateSurname = (id, payload) =>
  updateResource(Surname, id, payload, { notFoundMessage: 'Surname not found' });

const deleteSurname = (id) =>
  deleteResource(Surname, id, { notFoundMessage: 'Surname not found' });

module.exports = {
  getSurnames,
  getSurnameById,
  createSurname,
  updateSurname,
  deleteSurname,
};
