const express = require('express');
const businessTypeController = require('../controllers/businessType.controller');
const validate = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const { ROLES } = require('../constants');
const { mongoId, paginationValidators } = require('../validators/common.validator');
const { businessTypeValidators } = require('../validators/resource.validator');

const router = express.Router();

router.use(authenticate, authorize(ROLES.ADMIN, ROLES.MANAGER));

router
  .route('/')
  .get(paginationValidators, validate, businessTypeController.getBusinessTypes)
  .post(businessTypeValidators, validate, businessTypeController.createBusinessType);

router
  .route('/:id')
  .get(mongoId('id'), validate, businessTypeController.getBusinessType)
  .put(mongoId('id'), businessTypeValidators, validate, businessTypeController.updateBusinessType)
  .delete(mongoId('id'), validate, businessTypeController.deleteBusinessType);

module.exports = router;
