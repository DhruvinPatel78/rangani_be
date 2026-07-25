const authService = require('../services/auth.service');
const asyncHandler = require('../utils/asyncHandler');
const sendResponse = require('../utils/sendResponse');
const { HTTP_STATUS } = require('../constants');

const identify = asyncHandler(async (req, res) => {
  const data = await authService.identify(req.body);
  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    message: data.message,
    data,
  });
});

const login = asyncHandler(async (req, res) => {
  const data = await authService.login(req.body);
  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Logged in successfully',
    data,
  });
});

const loginAdmin = asyncHandler(async (req, res) => {
  const data = await authService.loginAdmin(req.body);
  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Admin logged in successfully',
    data,
  });
});

const loginManager = asyncHandler(async (req, res) => {
  const data = await authService.loginManager(req.body);
  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Manager logged in successfully',
    data,
  });
});

const requestUserOtp = asyncHandler(async (req, res) => {
  const data = await authService.requestUserOtp(req.body);
  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    message: data.message,
    data,
  });
});

const verifyUserOtp = asyncHandler(async (req, res) => {
  const data = await authService.verifyUserOtp(req.body);
  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'User logged in successfully',
    data,
  });
});

const getProfile = asyncHandler(async (req, res) => {
  const data = await authService.getProfile(req.user._id);
  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Profile fetched successfully',
    data,
  });
});

const logout = asyncHandler(async (_req, res) => {
  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Logged out successfully',
    data: null,
  });
});

module.exports = {
  identify,
  login,
  loginAdmin,
  loginManager,
  requestUserOtp,
  verifyUserOtp,
  getProfile,
  logout,
};
