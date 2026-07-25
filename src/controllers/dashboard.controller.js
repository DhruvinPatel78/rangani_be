const dashboardService = require('../services/dashboard.service');
const asyncHandler = require('../utils/asyncHandler');
const sendResponse = require('../utils/sendResponse');
const { HTTP_STATUS } = require('../constants');

const getStats = asyncHandler(async (_req, res) => {
  const data = await dashboardService.getStats();
  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Dashboard stats fetched successfully',
    data,
  });
});

module.exports = {
  getStats,
};
