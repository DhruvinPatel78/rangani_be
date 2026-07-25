const express = require('express');
const locationController = require('../controllers/location.controller');
const validate = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const { ROLES } = require('../constants');
const { mongoId, paginationValidators } = require('../validators/common.validator');
const {
  countryValidators,
  stateValidators,
  districtValidators,
  cityValidators,
} = require('../validators/resource.validator');

const router = express.Router();

router.use(authenticate, authorize(ROLES.ADMIN, ROLES.MANAGER));

router
  .route('/countries')
  .get(paginationValidators, validate, locationController.getCountries)
  .post(countryValidators, validate, locationController.createCountry);

router
  .route('/countries/:id')
  .get(mongoId('id'), validate, locationController.getCountry)
  .put(mongoId('id'), countryValidators, validate, locationController.updateCountry)
  .delete(mongoId('id'), validate, locationController.deleteCountry);

router
  .route('/countries/:countryId/states')
  .get(mongoId('countryId'), paginationValidators, validate, locationController.getStates);

router
  .route('/states')
  .get(paginationValidators, validate, locationController.getStates)
  .post(stateValidators, validate, locationController.createState);

router
  .route('/states/:id')
  .get(mongoId('id'), validate, locationController.getState)
  .put(mongoId('id'), stateValidators, validate, locationController.updateState)
  .delete(mongoId('id'), validate, locationController.deleteState);

router
  .route('/states/:stateId/districts')
  .get(mongoId('stateId'), paginationValidators, validate, locationController.getDistricts);

router
  .route('/districts')
  .get(paginationValidators, validate, locationController.getDistricts)
  .post(districtValidators, validate, locationController.createDistrict);

router
  .route('/districts/:id')
  .get(mongoId('id'), validate, locationController.getDistrict)
  .put(mongoId('id'), districtValidators, validate, locationController.updateDistrict)
  .delete(mongoId('id'), validate, locationController.deleteDistrict);

router
  .route('/districts/:districtId/cities')
  .get(mongoId('districtId'), paginationValidators, validate, locationController.getCities);

router
  .route('/cities')
  .get(paginationValidators, validate, locationController.getCities)
  .post(cityValidators, validate, locationController.createCity);

router
  .route('/cities/:id')
  .get(mongoId('id'), validate, locationController.getCity)
  .put(mongoId('id'), cityValidators, validate, locationController.updateCity)
  .delete(mongoId('id'), validate, locationController.deleteCity);

module.exports = router;
