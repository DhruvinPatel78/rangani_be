const memberService = require('../services/member.service');
const asyncHandler = require('../utils/asyncHandler');
const sendResponse = require('../utils/sendResponse');
const { HTTP_STATUS } = require('../constants');

const getMembers = asyncHandler(async (req, res) => {
  const data = await memberService.getMembers(req.query);
  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Members fetched successfully',
    data,
  });
});

const getMember = asyncHandler(async (req, res) => {
  const data = await memberService.getMemberById(req.params.id);
  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Member fetched successfully',
    data,
  });
});

const createMember = asyncHandler(async (req, res) => {
  const data = await memberService.createMember(req.body, req.user._id);
  sendResponse(res, {
    statusCode: HTTP_STATUS.CREATED,
    message: 'Member created successfully',
    data,
  });
});

const updateMember = asyncHandler(async (req, res) => {
  const data = await memberService.updateMember(req.params.id, req.body);
  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Member updated successfully',
    data,
  });
});

const deleteMember = asyncHandler(async (req, res) => {
  const data = await memberService.deleteMember(req.params.id);
  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Member deleted successfully',
    data,
  });
});

module.exports = {
  getMembers,
  getMember,
  createMember,
  updateMember,
  deleteMember,
};
