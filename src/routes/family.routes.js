const express = require('express');
const familyController = require('../controllers/family.controller');
const validate = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const { ROLES } = require('../constants');
const { mongoId, paginationValidators } = require('../validators/common.validator');
const { familyValidators } = require('../validators/resource.validator');

const router = express.Router();

router.use(authenticate, authorize(ROLES.ADMIN, ROLES.MANAGER));

router
  .route('/')
  .get(paginationValidators, validate, familyController.getFamilies)
  .post(familyValidators, validate, familyController.createFamily);

router
  .route('/:id')
  .get(mongoId('id'), validate, familyController.getFamily)
  .put(mongoId('id'), familyValidators, validate, familyController.updateFamily)
  .delete(mongoId('id'), validate, familyController.deleteFamily);

module.exports = router;
