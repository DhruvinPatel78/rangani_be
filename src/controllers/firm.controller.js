const firmService = require('../services/firm.service');
const asyncHandler = require('../utils/asyncHandler');
const sendResponse = require('../utils/sendResponse');
const { HTTP_STATUS } = require('../constants');

const getFirms = asyncHandler(async (req, res) => {
  const data = await firmService.getFirms(req.query);
  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Firms fetched successfully',
    data,
  });
});

const getFirm = asyncHandler(async (req, res) => {
  const data = await firmService.getFirmById(req.params.id);
  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Firm fetched successfully',
    data,
  });
});

const createFirm = asyncHandler(async (req, res) => {
  const data = await firmService.createFirm(req.body, req.user._id);
  sendResponse(res, {
    statusCode: HTTP_STATUS.CREATED,
    message: 'Firm created successfully',
    data,
  });
});

const updateFirm = asyncHandler(async (req, res) => {
  const data = await firmService.updateFirm(req.params.id, req.body);
  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Firm updated successfully',
    data,
  });
});

const deleteFirm = asyncHandler(async (req, res) => {
  const data = await firmService.deleteFirm(req.params.id);
  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Firm deleted successfully',
    data,
  });
});

module.exports = {
  getFirms,
  getFirm,
  createFirm,
  updateFirm,
  deleteFirm,
};
