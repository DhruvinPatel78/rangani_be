require('dotenv').config({ quiet: true });

const mongoose = require('mongoose');
const User = require('../models/User');
const { ROLES } = require('../constants');
const config = require('../config');

async function createAdmin() {
  const email = process.argv[2] || 'patel.dhruvinpatel@gmail.com';
  const password = process.argv[3] || 'Dhruvin@123';
  const name = process.argv[4] || 'Dhruvin Patel';
  const phone = process.argv[5] || '9999999999';

  await mongoose.connect(config.mongoUri);
  console.log(`Connected to MongoDB`);

  const existing = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (existing) {
    existing.name = name;
    existing.phone = phone;
    existing.password = password;
    existing.role = ROLES.ADMIN;
    existing.isActive = true;
    await existing.save();
    console.log(`Updated existing admin: ${email}`);
  } else {
    await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password,
      role: ROLES.ADMIN,
      isActive: true,
    });
    console.log(`Created admin: ${email}`);
  }

  await mongoose.disconnect();
  console.log('Done');
}

createAdmin().catch(async (error) => {
  console.error(error);
  try {
    await mongoose.disconnect();
  } catch {
    // ignore
  }
  process.exit(1);
});
