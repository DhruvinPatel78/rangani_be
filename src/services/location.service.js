const Country = require('../models/Country');
const State = require('../models/State');
const District = require('../models/District');
const City = require('../models/City');
const {
  listResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
} = require('./crud.service');

const getCountries = async (query) => {
  const result = await listResources(Country, {
    query,
    searchFields: ['name', 'code'],
    defaultSort: 'name',
  });

  const countryIds = result.items.map((country) => country._id);
  const counts =
    countryIds.length === 0
      ? []
      : await State.aggregate([
          { $match: { country: { $in: countryIds } } },
          { $group: { _id: '$country', count: { $sum: 1 } } },
        ]);

  const countByCountryId = new Map(counts.map((row) => [String(row._id), row.count]));

  result.items = result.items.map((country) => {
    const plain = typeof country.toObject === 'function' ? country.toObject() : country;
    return {
      ...plain,
      stateCount: countByCountryId.get(String(country._id)) || 0,
    };
  });

  return result;
};

const getCountryById = async (id) => {
  const country = await getResourceById(Country, id, { notFoundMessage: 'Country not found' });
  const stateCount = await State.countDocuments({ country: id });
  const plain = typeof country.toObject === 'function' ? country.toObject() : country;
  return {
    ...plain,
    stateCount,
  };
};

const createCountry = (payload) => createResource(Country, payload);
const updateCountry = (id, payload) =>
  updateResource(Country, id, payload, { notFoundMessage: 'Country not found' });

const deleteCountry = async (id) => {
  const country = await getCountryById(id);
  const states = await State.find({ country: id }).select('_id');
  const stateIds = states.map((state) => state._id);
  const districts = await District.find({ state: { $in: stateIds } }).select('_id');
  const districtIds = districts.map((district) => district._id);

  await City.deleteMany({ district: { $in: districtIds } });
  await District.deleteMany({ state: { $in: stateIds } });
  await State.deleteMany({ country: id });
  await Country.findByIdAndDelete(id);

  return country;
};

const getStates = async (query, countryId = null) => {
  const result = await listResources(State, {
    query,
    searchFields: ['name'],
    defaultSort: 'name',
    filter: countryId ? { country: countryId } : {},
    populate: [{ path: 'country', select: 'name code' }],
  });

  const stateIds = result.items.map((state) => state._id);
  const counts =
    stateIds.length === 0
      ? []
      : await District.aggregate([
          { $match: { state: { $in: stateIds } } },
          { $group: { _id: '$state', count: { $sum: 1 } } },
        ]);

  const countByStateId = new Map(counts.map((row) => [String(row._id), row.count]));

  result.items = result.items.map((state) => {
    const plain = typeof state.toObject === 'function' ? state.toObject() : state;
    return {
      ...plain,
      districtCount: countByStateId.get(String(state._id)) || 0,
    };
  });

  return result;
};

const getStateById = async (id) => {
  const state = await getResourceById(State, id, {
    populate: [{ path: 'country', select: 'name code' }],
    notFoundMessage: 'State not found',
  });
  const districtCount = await District.countDocuments({ state: id });

  return {
    id: state._id,
    name: state.name,
    countryId: state.country?._id || state.country,
    countryName: state.country?.name || '',
    districtCount,
    isActive: state.isActive,
    createdAt: state.createdAt,
    updatedAt: state.updatedAt,
  };
};

const createState = async (payload) => {
  await getCountryById(payload.country);
  return createResource(State, payload);
};

const updateState = async (id, payload) => {
  if (payload.country) {
    await getCountryById(payload.country);
  }
  return updateResource(State, id, payload, { notFoundMessage: 'State not found' });
};

const deleteState = async (id) => {
  const state = await getStateById(id);
  const districts = await District.find({ state: id }).select('_id');
  const districtIds = districts.map((district) => district._id);

  await City.deleteMany({ district: { $in: districtIds } });
  await District.deleteMany({ state: id });
  await State.findByIdAndDelete(id);

  return state;
};

const getDistricts = async (query, stateId = null) => {
  const result = await listResources(District, {
    query,
    searchFields: ['name'],
    defaultSort: 'name',
    filter: stateId ? { state: stateId } : {},
    populate: [{ path: 'state', select: 'name country', populate: { path: 'country', select: 'name' } }],
  });

  const districtIds = result.items.map((district) => district._id);
  const counts =
    districtIds.length === 0
      ? []
      : await City.aggregate([
          { $match: { district: { $in: districtIds } } },
          { $group: { _id: '$district', count: { $sum: 1 } } },
        ]);

  const countByDistrictId = new Map(counts.map((row) => [String(row._id), row.count]));

  result.items = result.items.map((district) => {
    const plain = typeof district.toObject === 'function' ? district.toObject() : district;
    return {
      ...plain,
      cityCount: countByDistrictId.get(String(district._id)) || 0,
    };
  });

  return result;
};

const getDistrictById = async (id) => {
  const district = await getResourceById(District, id, {
    populate: [
      {
        path: 'state',
        select: 'name country',
        populate: { path: 'country', select: 'name' },
      },
    ],
    notFoundMessage: 'District not found',
  });
  const cityCount = await City.countDocuments({ district: id });

  return {
    id: district._id,
    name: district.name,
    stateId: district.state?._id || district.state,
    stateName: district.state?.name || '',
    countryId: district.state?.country?._id || district.state?.country || '',
    countryName: district.state?.country?.name || '',
    cityCount,
    isActive: district.isActive,
    createdAt: district.createdAt,
    updatedAt: district.updatedAt,
  };
};

const createDistrict = async (payload) => {
  await getStateById(payload.state);
  return createResource(District, payload);
};

const updateDistrict = async (id, payload) => {
  if (payload.state) {
    await getStateById(payload.state);
  }
  return updateResource(District, id, payload, { notFoundMessage: 'District not found' });
};

const deleteDistrict = async (id) => {
  const district = await getDistrictById(id);
  await City.deleteMany({ district: id });
  await District.findByIdAndDelete(id);
  return district;
};

const getCities = (query, districtId = null) =>
  listResources(City, {
    query,
    searchFields: ['name'],
    defaultSort: 'name',
    filter: districtId ? { district: districtId } : {},
    populate: [
      {
        path: 'district',
        select: 'name state',
        populate: { path: 'state', select: 'name' },
      },
    ],
  });

const getCityById = (id) =>
  getResourceById(City, id, {
    populate: [
      {
        path: 'district',
        select: 'name state',
        populate: { path: 'state', select: 'name' },
      },
    ],
    notFoundMessage: 'City not found',
  });

const createCity = async (payload) => {
  await getDistrictById(payload.district);
  return createResource(City, payload);
};

const updateCity = async (id, payload) => {
  if (payload.district) {
    await getDistrictById(payload.district);
  }
  return updateResource(City, id, payload, { notFoundMessage: 'City not found' });
};

const deleteCity = (id) => deleteResource(City, id, { notFoundMessage: 'City not found' });

module.exports = {
  getCountries,
  getCountryById,
  createCountry,
  updateCountry,
  deleteCountry,
  getStates,
  getStateById,
  createState,
  updateState,
  deleteState,
  getDistricts,
  getDistrictById,
  createDistrict,
  updateDistrict,
  deleteDistrict,
  getCities,
  getCityById,
  createCity,
  updateCity,
  deleteCity,
};
