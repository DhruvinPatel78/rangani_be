const express = require('express');
const surnameController = require('../controllers/surname.controller');
const validate = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const { ROLES } = require('../constants');
const { mongoId, paginationValidators } = require('../validators/common.validator');
const { surnameValidators } = require('../validators/resource.validator');

const router = express.Router();

router.use(authenticate, authorize(ROLES.ADMIN, ROLES.MANAGER));

router
  .route('/')
  .get(paginationValidators, validate, surnameController.getSurnames)
  .post(surnameValidators, validate, surnameController.createSurname);

router
  .route('/:id')
  .get(mongoId('id'), validate, surnameController.getSurname)
  .put(mongoId('id'), surnameValidators, validate, surnameController.updateSurname)
  .delete(mongoId('id'), validate, surnameController.deleteSurname);

module.exports = router;
