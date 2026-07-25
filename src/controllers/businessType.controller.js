const businessTypeService = require('../services/businessType.service');
const asyncHandler = require('../utils/asyncHandler');
const sendResponse = require('../utils/sendResponse');
const { HTTP_STATUS } = require('../constants');

const getBusinessTypes = asyncHandler(async (req, res) => {
  const data = await businessTypeService.getBusinessTypes(req.query);
  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Business types fetched successfully',
    data,
  });
});

const getBusinessType = asyncHandler(async (req, res) => {
  const data = await businessTypeService.getBusinessTypeById(req.params.id);
  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Business type fetched successfully',
    data,
  });
});

const createBusinessType = asyncHandler(async (req, res) => {
  const data = await businessTypeService.createBusinessType(req.body);
  sendResponse(res, {
    statusCode: HTTP_STATUS.CREATED,
    message: 'Business type created successfully',
    data,
  });
});

const updateBusinessType = asyncHandler(async (req, res) => {
  const data = await businessTypeService.updateBusinessType(req.params.id, req.body);
  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Business type updated successfully',
    data,
  });
});

const deleteBusinessType = asyncHandler(async (req, res) => {
  const data = await businessTypeService.deleteBusinessType(req.params.id);
  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Business type deleted successfully',
    data,
  });
});

module.exports = {
  getBusinessTypes,
  getBusinessType,
  createBusinessType,
  updateBusinessType,
  deleteBusinessType,
};
