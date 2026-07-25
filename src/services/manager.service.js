const User = require('../models/User');
const Manager = require('../models/Manager');
const AppError = require('../utils/AppError');
const { HTTP_STATUS, ROLES } = require('../constants');
const {
  listResources,
  getResourceById,
  updateResource,
  deleteResource,
} = require('./crud.service');

const getManagers = (query) =>
  listResources(Manager, {
    query,
    searchFields: ['name', 'email', 'phone', 'assignedRegion'],
    defaultSort: 'name',
    populate: [{ path: 'user', select: 'name email phone role isActive' }],
  });

const getManagerById = (id) =>
  getResourceById(Manager, id, {
    populate: [{ path: 'user', select: 'name email phone role isActive' }],
    notFoundMessage: 'Manager not found',
  });

const createManager = async (payload) => {
  const existing = await User.findOne({
    $or: [{ email: payload.email.toLowerCase() }, { phone: payload.phone }],
  });

  if (existing) {
    throw new AppError('User with this email or phone already exists', HTTP_STATUS.CONFLICT);
  }

  const user = await User.create({
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    password: payload.password,
    role: ROLES.MANAGER,
    isActive: payload.status !== 'inactive',
  });

  try {
    const manager = await Manager.create({
      user: user._id,
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      assignedRegion: payload.assignedRegion || '',
      status: payload.status || 'active',
    });

    return manager.populate({ path: 'user', select: 'name email phone role isActive' });
  } catch (error) {
    await User.findByIdAndDelete(user._id);
    throw error;
  }
};

const updateManager = async (id, payload) => {
  const manager = await getManagerById(id);

  const userUpdates = {};
  if (payload.name) userUpdates.name = payload.name;
  if (payload.email) userUpdates.email = payload.email;
  if (payload.phone) userUpdates.phone = payload.phone;
  if (payload.password) userUpdates.password = payload.password;
  if (payload.status) userUpdates.isActive = payload.status === 'active';

  if (Object.keys(userUpdates).length) {
    const user = await User.findById(manager.user).select('+password');
    if (!user) {
      throw new AppError('Linked user not found', HTTP_STATUS.NOT_FOUND);
    }
    Object.assign(user, userUpdates);
    await user.save();
  }

  return updateResource(
    Manager,
    id,
    {
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      assignedRegion: payload.assignedRegion,
      status: payload.status,
    },
    { notFoundMessage: 'Manager not found' },
  );
};

const deleteManager = async (id) => {
  const manager = await deleteResource(Manager, id, { notFoundMessage: 'Manager not found' });
  if (manager.user) {
    await User.findByIdAndDelete(manager.user);
  }
  return manager;
};

module.exports = {
  getManagers,
  getManagerById,
  createManager,
  updateManager,
  deleteManager,
};
