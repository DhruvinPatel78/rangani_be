const nativeService = require('../services/native.service');
const asyncHandler = require('../utils/asyncHandler');
const sendResponse = require('../utils/sendResponse');
const { HTTP_STATUS } = require('../constants');

const getNatives = asyncHandler(async (req, res) => {
  const data = await nativeService.getNatives(req.query);
  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Natives fetched successfully',
    data,
  });
});

const getNative = asyncHandler(async (req, res) => {
  const data = await nativeService.getNativeById(req.params.id);
  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Native fetched successfully',
    data,
  });
});

const createNative = asyncHandler(async (req, res) => {
  const data = await nativeService.createNative(req.body);
  sendResponse(res, {
    statusCode: HTTP_STATUS.CREATED,
    message: 'Native created successfully',
    data,
  });
});

const updateNative = asyncHandler(async (req, res) => {
  const data = await nativeService.updateNative(req.params.id, req.body);
  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Native updated successfully',
    data,
  });
});

const deleteNative = asyncHandler(async (req, res) => {
  const data = await nativeService.deleteNative(req.params.id);
  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Native deleted successfully',
    data,
  });
});

module.exports = {
  getNatives,
  getNative,
  createNative,
  updateNative,
  deleteNative,
};
