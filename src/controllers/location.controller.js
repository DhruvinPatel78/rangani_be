const locationService = require('../services/location.service');
const asyncHandler = require('../utils/asyncHandler');
const sendResponse = require('../utils/sendResponse');
const { HTTP_STATUS } = require('../constants');

const getCountries = asyncHandler(async (req, res) => {
  const data = await locationService.getCountries(req.query);
  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Countries fetched successfully',
    data,
  });
});

const getCountry = asyncHandler(async (req, res) => {
  const data = await locationService.getCountryById(req.params.id);
  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Country fetched successfully',
    data,
  });
});

const createCountry = asyncHandler(async (req, res) => {
  const data = await locationService.createCountry(req.body);
  sendResponse(res, {
    statusCode: HTTP_STATUS.CREATED,
    message: 'Country created successfully',
    data,
  });
});

const updateCountry = asyncHandler(async (req, res) => {
  const data = await locationService.updateCountry(req.params.id, req.body);
  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Country updated successfully',
    data,
  });
});

const deleteCountry = asyncHandler(async (req, res) => {
  const data = await locationService.deleteCountry(req.params.id);
  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Country deleted successfully',
    data,
  });
});

const getStates = asyncHandler(async (req, res) => {
  const countryId = req.params.countryId || req.query.countryId || null;
  const data = await locationService.getStates(req.query, countryId);
  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'States fetched successfully',
    data,
  });
});

const getState = asyncHandler(async (req, res) => {
  const data = await locationService.getStateById(req.params.id);
  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'State fetched successfully',
    data,
  });
});

const createState = asyncHandler(async (req, res) => {
  const data = await locationService.createState(req.body);
  sendResponse(res, {
    statusCode: HTTP_STATUS.CREATED,
    message: 'State created successfully',
    data,
  });
});

const updateState = asyncHandler(async (req, res) => {
  const data = await locationService.updateState(req.params.id, req.body);
  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'State updated successfully',
    data,
  });
});

const deleteState = asyncHandler(async (req, res) => {
  const data = await locationService.deleteState(req.params.id);
  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'State deleted successfully',
    data,
  });
});

const getDistricts = asyncHandler(async (req, res) => {
  const stateId = req.params.stateId || req.query.stateId || null;
  const data = await locationService.getDistricts(req.query, stateId);
  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Districts fetched successfully',
    data,
  });
});

const getDistrict = asyncHandler(async (req, res) => {
  const data = await locationService.getDistrictById(req.params.id);
  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'District fetched successfully',
    data,
  });
});

const createDistrict = asyncHandler(async (req, res) => {
  const data = await locationService.createDistrict(req.body);
  sendResponse(res, {
    statusCode: HTTP_STATUS.CREATED,
    message: 'District created successfully',
    data,
  });
});

const updateDistrict = asyncHandler(async (req, res) => {
  const data = await locationService.updateDistrict(req.params.id, req.body);
  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'District updated successfully',
    data,
  });
});

const deleteDistrict = asyncHandler(async (req, res) => {
  const data = await locationService.deleteDistrict(req.params.id);
  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'District deleted successfully',
    data,
  });
});

const getCities = asyncHandler(async (req, res) => {
  const districtId = req.params.districtId || req.query.districtId || null;
  const data = await locationService.getCities(req.query, districtId);
  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Cities fetched successfully',
    data,
  });
});

const getCity = asyncHandler(async (req, res) => {
  const data = await locationService.getCityById(req.params.id);
  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'City fetched successfully',
    data,
  });
});

const createCity = asyncHandler(async (req, res) => {
  const data = await locationService.createCity(req.body);
  sendResponse(res, {
    statusCode: HTTP_STATUS.CREATED,
    message: 'City created successfully',
    data,
  });
});

const updateCity = asyncHandler(async (req, res) => {
  const data = await locationService.updateCity(req.params.id, req.body);
  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'City updated successfully',
    data,
  });
});

const deleteCity = asyncHandler(async (req, res) => {
  const data = await locationService.deleteCity(req.params.id);
  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'City deleted successfully',
    data,
  });
});

module.exports = {
  getCountries,
  getCountry,
  createCountry,
  updateCountry,
  deleteCountry,
  getStates,
  getState,
  createState,
  updateState,
  deleteState,
  getDistricts,
  getDistrict,
  createDistrict,
  updateDistrict,
  deleteDistrict,
  getCities,
  getCity,
  createCity,
  updateCity,
  deleteCity,
};
