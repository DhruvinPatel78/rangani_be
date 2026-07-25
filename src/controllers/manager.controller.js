const managerService = require('../services/manager.service');
const asyncHandler = require('../utils/asyncHandler');
const sendResponse = require('../utils/sendResponse');
const { HTTP_STATUS } = require('../constants');

const getManagers = asyncHandler(async (req, res) => {
  const data = await managerService.getManagers(req.query);
  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Managers fetched successfully',
    data,
  });
});

const getManager = asyncHandler(async (req, res) => {
  const data = await managerService.getManagerById(req.params.id);
  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Manager fetched successfully',
    data,
  });
});

const createManager = asyncHandler(async (req, res) => {
  const data = await managerService.createManager(req.body);
  sendResponse(res, {
    statusCode: HTTP_STATUS.CREATED,
    message: 'Manager created successfully',
    data,
  });
});

const updateManager = asyncHandler(async (req, res) => {
  const data = await managerService.updateManager(req.params.id, req.body);
  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Manager updated successfully',
    data,
  });
});

const deleteManager = asyncHandler(async (req, res) => {
  const data = await managerService.deleteManager(req.params.id);
  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Manager deleted successfully',
    data,
  });
});

module.exports = {
  getManagers,
  getManager,
  createManager,
  updateManager,
  deleteManager,
};
