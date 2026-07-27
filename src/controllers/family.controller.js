const familyService = require('../services/family.service');
const asyncHandler = require('../utils/asyncHandler');
const sendResponse = require('../utils/sendResponse');
const { HTTP_STATUS } = require('../constants');

const getFamilies = asyncHandler(async (req, res) => {
  const data = await familyService.getFamilies(req.query);
  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Families fetched successfully',
    data,
  });
});

const getFamily = asyncHandler(async (req, res) => {
  const data = await familyService.getFamilyById(req.params.id);
  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Family fetched successfully',
    data,
  });
});

const createFamily = asyncHandler(async (req, res) => {
  const data = await familyService.createFamily(req.body, req.user._id);
  sendResponse(res, {
    statusCode: HTTP_STATUS.CREATED,
    message: 'Family created successfully',
    data,
  });
});

const createFamilyFromMember = asyncHandler(async (req, res) => {
  const data = await familyService.createFamilyFromMember(req.body, req.user._id);
  sendResponse(res, {
    statusCode: HTTP_STATUS.CREATED,
    message: 'Family created and members linked successfully',
    data,
  });
});

const updateFamily = asyncHandler(async (req, res) => {
  const data = await familyService.updateFamily(req.params.id, req.body);
  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Family updated successfully',
    data,
  });
});

const deleteFamily = asyncHandler(async (req, res) => {
  const data = await familyService.deleteFamily(req.params.id);
  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Family deleted successfully',
    data,
  });
});

module.exports = {
  getFamilies,
  getFamily,
  createFamily,
  createFamilyFromMember,
  updateFamily,
  deleteFamily,
};
