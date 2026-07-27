const Member = require('../models/Member');
const Family = require('../models/Family');
const {
  listResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
} = require('./crud.service');

const searchFields = ['name', 'surname', 'email', 'phone'];

const memberDisplayName = (member) =>
  [member.name, member.surname].filter(Boolean).join(' ').trim();

const resolveId = (value) => {
  if (!value) return null;
  if (typeof value === 'object' && value._id) return String(value._id);
  return String(value);
};

const syncSpouseLink = async (memberId, spouseId, memberName) => {
  if (!spouseId) return;

  const spouse = await Member.findById(spouseId);
  if (!spouse) return;

  await Member.findByIdAndUpdate(spouseId, {
    $set: {
      spouse: memberId,
      spouseName: memberName,
      ...(spouse.maritalStatus ? {} : { maritalStatus: 'married' }),
    },
  });
};

const clearSpouseLinkIfPointsTo = async (memberId, spouseId) => {
  if (!spouseId) return;

  const spouse = await Member.findById(spouseId);
  if (!spouse) return;

  if (resolveId(spouse.spouse) === resolveId(memberId)) {
    await Member.findByIdAndUpdate(spouseId, {
      $set: { spouse: null, spouseName: '' },
    });
  }
};

const getMembers = async (query) => {
  const filter = {};

  if (query.family) filter.family = query.family;
  if (query.gender) filter.gender = query.gender;
  if (query.maritalStatus) {
    const statuses = String(query.maritalStatus).split(',').map((status) => status.trim()).filter(Boolean);
    filter.maritalStatus = statuses.length > 1 ? { $in: statuses } : statuses[0];
  }

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

  const member = await createResource(Member, { ...payload, createdBy: userId });

  if (payload.spouse) {
    await syncSpouseLink(member._id, payload.spouse, memberDisplayName(member));
  }

  return member;
};

const updateMember = async (id, payload) => {
  const existing = await getMemberById(id);
  const oldSpouseId = resolveId(existing.spouse);

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

  const member = await updateResource(Member, id, payload, { notFoundMessage: 'Member not found' });

  const hasSpouseInPayload = Object.prototype.hasOwnProperty.call(payload, 'spouse');
  const newSpouseId = hasSpouseInPayload ? resolveId(payload.spouse) : oldSpouseId;

  if (hasSpouseInPayload && oldSpouseId && oldSpouseId !== newSpouseId) {
    await clearSpouseLinkIfPointsTo(id, oldSpouseId);
  }

  if (hasSpouseInPayload && newSpouseId) {
    await syncSpouseLink(id, newSpouseId, memberDisplayName(member));
  } else if (hasSpouseInPayload && !newSpouseId && oldSpouseId) {
    await clearSpouseLinkIfPointsTo(id, oldSpouseId);
  }

  return member;
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
