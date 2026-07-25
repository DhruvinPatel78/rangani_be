const surnameService = require('../services/surname.service');
const asyncHandler = require('../utils/asyncHandler');
const sendResponse = require('../utils/sendResponse');
const { HTTP_STATUS } = require('../constants');

const getSurnames = asyncHandler(async (req, res) => {
  const data = await surnameService.getSurnames(req.query);
  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Surnames fetched successfully',
    data,
  });
});

const getSurname = asyncHandler(async (req, res) => {
  const data = await surnameService.getSurnameById(req.params.id);
  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Surname fetched successfully',
    data,
  });
});

const createSurname = asyncHandler(async (req, res) => {
  const data = await surnameService.createSurname(req.body);
  sendResponse(res, {
    statusCode: HTTP_STATUS.CREATED,
    message: 'Surname created successfully',
    data,
  });
});

const updateSurname = asyncHandler(async (req, res) => {
  const data = await surnameService.updateSurname(req.params.id, req.body);
  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Surname updated successfully',
    data,
  });
});

const deleteSurname = asyncHandler(async (req, res) => {
  const data = await surnameService.deleteSurname(req.params.id);
  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Surname deleted successfully',
    data,
  });
});

module.exports = {
  getSurnames,
  getSurname,
  createSurname,
  updateSurname,
  deleteSurname,
};
