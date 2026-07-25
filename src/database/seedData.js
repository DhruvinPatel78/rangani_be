require('dotenv').config({ quiet: true });

const User = require('../models/User');
const Manager = require('../models/Manager');
const Member = require('../models/Member');
const Family = require('../models/Family');
const Firm = require('../models/Firm');
const Country = require('../models/Country');
const State = require('../models/State');
const District = require('../models/District');
const City = require('../models/City');
const Native = require('../models/Native');
const BusinessType = require('../models/BusinessType');
const Surname = require('../models/Surname');
const { ROLES } = require('../constants');

const seedDatabase = async ({ clear = true } = {}) => {
  if (clear) {
    await Promise.all([
      User.deleteMany({}),
      Manager.deleteMany({}),
      Member.deleteMany({}),
      Family.deleteMany({}),
      Firm.deleteMany({}),
      Country.deleteMany({}),
      State.deleteMany({}),
      District.deleteMany({}),
      City.deleteMany({}),
      Native.deleteMany({}),
      BusinessType.deleteMany({}),
      Surname.deleteMany({}),
    ]);
  }

  const existingAdmin = await User.findOne({ email: 'admin@rangani.com' });
  if (existingAdmin && !clear) {
    return { seeded: false, message: 'Demo data already exists' };
  }

  const admin = await User.create({
    name: 'Admin Patel',
    email: 'admin@rangani.com',
    phone: '9876543210',
    password: 'admin123',
    role: ROLES.ADMIN,
  });

  const managerUser = await User.create({
    name: 'Mehul Rangani',
    email: 'manager@rangani.com',
    phone: '9123456780',
    password: 'manager123',
    role: ROLES.MANAGER,
  });

  await User.create({
    name: 'Dhruvin Patel',
    email: 'user@rangani.com',
    phone: '9988776655',
    role: ROLES.USER,
  });

  await Manager.create({
    user: managerUser._id,
    name: managerUser.name,
    email: managerUser.email,
    phone: managerUser.phone,
    assignedRegion: 'Surat',
    status: 'active',
  });

  const natives = await Native.insertMany([
    { name: 'Amreli' },
    { name: 'Bhavnagar' },
    { name: 'Junagadh' },
    { name: 'Rajkot' },
  ]);

  await BusinessType.insertMany([
    { name: 'Manufacturing' },
    { name: 'Trading' },
    { name: 'Retail' },
    { name: 'Wholesale' },
    { name: 'Service' },
    { name: 'Export' },
    { name: 'Textiles' },
    { name: 'Jewellery' },
  ]);

  await Surname.insertMany([
    { name: 'Rangani' },
    { name: 'Shah' },
    { name: 'Mehta' },
    { name: 'Patel' },
    { name: 'Desai' },
    { name: 'Joshi' },
  ]);

  const india = await Country.create({ name: 'India', code: 'IN' });
  const uae = await Country.create({ name: 'United Arab Emirates', code: 'AE' });

  const gujarat = await State.create({ name: 'Gujarat', country: india._id });
  const maharashtra = await State.create({ name: 'Maharashtra', country: india._id });
  await State.create({ name: 'Dubai', country: uae._id });

  const surat = await District.create({ name: 'Surat', state: gujarat._id });
  const ahmedabad = await District.create({ name: 'Ahmedabad', state: gujarat._id });
  await District.create({ name: 'Mumbai', state: maharashtra._id });

  await City.insertMany([
    { name: 'Varachha', district: surat._id },
    { name: 'Katargam', district: surat._id },
    { name: 'Navrangpura', district: ahmedabad._id },
  ]);

  const families = await Family.insertMany([
    {
      name: 'Rangani Family',
      headName: 'Hitesh Rangani',
      memberCount: 2,
      city: 'Surat',
      native: natives[0]._id,
      createdBy: admin._id,
    },
    {
      name: 'Shah Family',
      headName: 'Ramesh Shah',
      memberCount: 1,
      city: 'Ahmedabad',
      native: natives[1]._id,
      createdBy: admin._id,
    },
  ]);

  await Member.insertMany([
    {
      name: 'Aarav Rangani',
      email: 'aarav@example.com',
      phone: '9000000001',
      family: families[0]._id,
      familyName: families[0].name,
      city: 'Surat',
      native: natives[0]._id,
      createdBy: admin._id,
    },
    {
      name: 'Priya Shah',
      email: 'priya@example.com',
      phone: '9000000002',
      family: families[1]._id,
      familyName: families[1].name,
      city: 'Ahmedabad',
      native: natives[1]._id,
      createdBy: admin._id,
    },
  ]);

  await Firm.insertMany([
    {
      name: 'Rangani Textiles',
      ownerName: 'Hitesh Rangani',
      category: 'Textiles',
      city: 'Surat',
      family: families[0]._id,
      createdBy: admin._id,
    },
    {
      name: 'Shah Jewellers',
      ownerName: 'Ramesh Shah',
      category: 'Jewellery',
      city: 'Ahmedabad',
      family: families[1]._id,
      createdBy: admin._id,
    },
  ]);

  return { seeded: true, message: 'Demo data seeded successfully' };
};

module.exports = seedDatabase;
