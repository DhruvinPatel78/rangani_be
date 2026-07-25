const express = require('express');
const managerController = require('../controllers/manager.controller');
const validate = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const { ROLES } = require('../constants');
const { mongoId, paginationValidators } = require('../validators/common.validator');
const {
  createManagerValidators,
  managerValidators,
} = require('../validators/resource.validator');

const router = express.Router();

router.use(authenticate, authorize(ROLES.ADMIN));

router
  .route('/')
  .get(paginationValidators, validate, managerController.getManagers)
  .post(createManagerValidators, validate, managerController.createManager);

router
  .route('/:id')
  .get(mongoId('id'), validate, managerController.getManager)
  .put(mongoId('id'), managerValidators, validate, managerController.updateManager)
  .delete(mongoId('id'), validate, managerController.deleteManager);

module.exports = router;
