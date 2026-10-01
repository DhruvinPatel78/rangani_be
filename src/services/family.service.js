const Family = require('../models/Family');
const Member = require('../models/Member');
const AppError = require('../utils/AppError');
const { HTTP_STATUS } = require('../constants');
const {
  listResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
} = require('./crud.service');

const getFamilies = (query) => {
  const filter = {};
  if (query.parentFamily) filter.parentFamily = query.parentFamily;

  return listResources(Family, {
    query,
    searchFields: ['name', 'headName', 'city'],
    defaultSort: '-createdAt',
    filter,
    populate: [
      { path: 'native', select: 'name' },
      { path: 'parentFamily', select: 'name' },
      { path: 'associatedFirms', select: 'name address city countryName stateName districtName' },
      { path: 'country', select: 'name code' },
      { path: 'state', select: 'name' },
      { path: 'district', select: 'name' },
      { path: 'cityRef', select: 'name' },
    ],
  });
};

const getFamilyById = (id) =>
  getResourceById(Family, id, {
    populate: [
      { path: 'native', select: 'name' },
      { path: 'parentFamily', select: 'name' },
      { path: 'associatedFirms', select: 'name address city countryName stateName districtName' },
      { path: 'country', select: 'name code' },
      { path: 'state', select: 'name' },
      { path: 'district', select: 'name' },
      { path: 'cityRef', select: 'name' },
    ],
    notFoundMessage: 'Family not found',
  });

const createFamily = (payload, userId) =>
  createResource(Family, { ...payload, createdBy: userId });

const collectFamilyBranchMemberIds = async (headMember) => {
  const memberIds = new Set([String(headMember._id)]);

  if (headMember.spouse) {
    memberIds.add(String(headMember.spouse));
  }

  const children = await Member.find({ father: headMember._id }).select('_id');
  children.forEach((child) => memberIds.add(String(child._id)));

  return [...memberIds];
};

const createFamilyFromMember = async (payload, userId) => {
  const headMember = await Member.findById(payload.headMember);
  if (!headMember) {
    throw new AppError('Member not found', HTTP_STATUS.NOT_FOUND);
  }

  if (headMember.gender !== 'male') {
    throw new AppError('Only male members can create a new family branch', HTTP_STATUS.BAD_REQUEST);
  }

  if (
    payload.parentFamily &&
    String(headMember.family) !== String(payload.parentFamily)
  ) {
    throw new AppError('Member does not belong to the selected parent family', HTTP_STATUS.BAD_REQUEST);
  }

  const memberIds = await collectFamilyBranchMemberIds(headMember);
  const membersToMove = await Member.find({ _id: { $in: memberIds } });
  const sourceFamilyId = payload.parentFamily || headMember.family;
  const movedFromSourceCount = membersToMove.filter(
    (member) => member.family && String(member.family) === String(sourceFamilyId),
  ).length;

  const family = await Family.create({
    name: payload.name,
    headName: payload.headName || headMember.name,
    parentFamily: payload.parentFamily || null,
    country: payload.country || null,
    state: payload.state || null,
    district: payload.district || null,
    cityRef: payload.cityRef || null,
    countryName: payload.countryName || '',
    stateName: payload.stateName || '',
    districtName: payload.districtName || '',
    city: payload.city || '',
    associatedFirms: payload.associatedFirms || [],
    memberCount: memberIds.length,
    createdBy: userId,
  });

  await Member.updateMany(
    { _id: { $in: memberIds } },
    {
      $set: {
        family: family._id,
        familyName: family.name,
        city: payload.city || family.city || '',
      },
    },
  );

  if (sourceFamilyId && movedFromSourceCount > 0) {
    await Family.findByIdAndUpdate(sourceFamilyId, {
      $inc: { memberCount: -movedFromSourceCount },
    });
  }

  return getFamilyById(family._id);
};

const updateFamily = (id, payload) =>
  updateResource(Family, id, payload, { notFoundMessage: 'Family not found' });

const resolveId = (value) => {
  if (!value) return null;
  if (typeof value === 'object' && value._id) return String(value._id);
  return String(value);
};

const deleteFamily = async (id) => {
  const family = await getFamilyById(id);
  const parentFamilyId = resolveId(family.parentFamily);
  const memberCount = await Member.countDocuments({ family: id });

  if (parentFamilyId && memberCount > 0) {
    const parentFamily = await Family.findById(parentFamilyId);
    if (parentFamily) {
      await Member.updateMany(
        { family: id },
        {
          $set: {
            family: parentFamily._id,
            familyName: parentFamily.name,
            city: parentFamily.city || '',
          },
        },
      );

      await Family.findByIdAndUpdate(parentFamily._id, {
        $inc: { memberCount: memberCount },
      });
    }
  }

  return deleteResource(Family, id, { notFoundMessage: 'Family not found' });
};

module.exports = {
  getFamilies,
  getFamilyById,
  createFamily,
  createFamilyFromMember,
  updateFamily,
  deleteFamily,
};
