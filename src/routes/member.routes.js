const express = require('express');
const memberController = require('../controllers/member.controller');
const validate = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const { ROLES } = require('../constants');
const { mongoId, paginationValidators } = require('../validators/common.validator');
const { memberValidators } = require('../validators/resource.validator');

const router = express.Router();

router.use(authenticate, authorize(ROLES.ADMIN, ROLES.MANAGER));

router
  .route('/')
  .get(paginationValidators, validate, memberController.getMembers)
  .post(memberValidators, validate, memberController.createMember);

router
  .route('/:id')
  .get(mongoId('id'), validate, memberController.getMember)
  .put(mongoId('id'), memberValidators, validate, memberController.updateMember)
  .delete(mongoId('id'), validate, memberController.deleteMember);

module.exports = router;
