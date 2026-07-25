const express = require('express');
const nativeController = require('../controllers/native.controller');
const validate = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const { ROLES } = require('../constants');
const { mongoId, paginationValidators } = require('../validators/common.validator');
const { nativeValidators } = require('../validators/resource.validator');

const router = express.Router();

router.use(authenticate, authorize(ROLES.ADMIN, ROLES.MANAGER));

router
  .route('/')
  .get(paginationValidators, validate, nativeController.getNatives)
  .post(nativeValidators, validate, nativeController.createNative);

router
  .route('/:id')
  .get(mongoId('id'), validate, nativeController.getNative)
  .put(mongoId('id'), nativeValidators, validate, nativeController.updateNative)
  .delete(mongoId('id'), validate, nativeController.deleteNative);

module.exports = router;
