const express = require('express');
const firmController = require('../controllers/firm.controller');
const validate = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const { ROLES } = require('../constants');
const { mongoId, paginationValidators } = require('../validators/common.validator');
const { firmValidators } = require('../validators/resource.validator');

const router = express.Router();

router.use(authenticate, authorize(ROLES.ADMIN, ROLES.MANAGER));

router
  .route('/')
  .get(paginationValidators, validate, firmController.getFirms)
  .post(firmValidators, validate, firmController.createFirm);

router
  .route('/:id')
  .get(mongoId('id'), validate, firmController.getFirm)
  .put(mongoId('id'), firmValidators, validate, firmController.updateFirm)
  .delete(mongoId('id'), validate, firmController.deleteFirm);

module.exports = router;
