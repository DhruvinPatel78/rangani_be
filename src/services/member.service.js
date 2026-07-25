const Member = require('../models/Member');
const Family = require('../models/Family');
const {
  listResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
} = require('./crud.service');

const searchFields = ['name', 'email', 'phone', 'familyName', 'city'];

const getMembers = async (query) => {
  const filter = {};

  if (query.family) filter.family = query.family;
  if (query.gender) filter.gender = query.gender;
  if (query.maritalStatus) filter.maritalStatus = query.maritalStatus;

  const result = await listResources(Member, {
    query,
    searchFields,
    defaultSort: '-createdAt',
    filter,
    populate: [
      { path: 'family', select: 'name headName city' },
      { path: 'native', select: 'name' },
      { path: 'father', select: 'name surname' },
      { path: 'mother', select: 'name surname' },
      { path: 'spouse', select: 'name surname' },
    ],
  });

  result.items = result.items.map((member) => {
    const plain = typeof member.toObject === 'function' ? member.toObject() : member;
    return {
      ...plain,
      city: plain.city || plain.family?.city || '',
    };
  });

  return result;
};

const getMemberById = async (id) => {
  const member = await getResourceById(Member, id, {
    populate: [
      { path: 'family', select: 'name headName city' },
      { path: 'native', select: 'name' },
    ],
    notFoundMessage: 'Member not found',
  });

  const plain = typeof member.toObject === 'function' ? member.toObject() : member;
  return {
    ...plain,
    city: plain.city || plain.family?.city || '',
  };
};

const createMember = async (payload, userId) => {
  if (payload.family) {
    const family = await Family.findById(payload.family);
    if (family) {
      payload.familyName = payload.familyName || family.name;
      payload.city = payload.city || family.city || '';
      await Family.findByIdAndUpdate(family._id, { $inc: { memberCount: 1 } });
    }
  }

  return createResource(Member, { ...payload, createdBy: userId });
};

const updateMember = async (id, payload) => {
  const existing = await getMemberById(id);

  if (payload.family && String(payload.family) !== String(existing.family?._id || existing.family)) {
    if (existing.family) {
      await Family.findByIdAndUpdate(existing.family._id || existing.family, {
        $inc: { memberCount: -1 },
      });
    }
    const family = await Family.findById(payload.family);
    if (family) {
      payload.familyName = payload.familyName || family.name;
      if (payload.city === undefined || payload.city === null || payload.city === '') {
        payload.city = family.city || '';
      }
      await Family.findByIdAndUpdate(family._id, { $inc: { memberCount: 1 } });
    }
  }

  return updateResource(Member, id, payload, { notFoundMessage: 'Member not found' });
};

const deleteMember = async (id) => {
  const member = await deleteResource(Member, id, { notFoundMessage: 'Member not found' });
  if (member.family) {
    await Family.findByIdAndUpdate(member.family, { $inc: { memberCount: -1 } });
  }
  return member;
};

module.exports = {
  getMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
};
