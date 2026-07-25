require('dotenv').config({ quiet: true });

const connectDB = require('./connection');
const seedDatabase = require('./seedData');

const seed = async () => {
  try {
    await connectDB();
    const result = await seedDatabase({ clear: true });
    console.log(result.message);
    console.log('Admin: admin@rangani.com / admin123');
    console.log('Manager: manager@rangani.com / manager123');
    console.log('User: user@rangani.com / OTP 123456');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

seed();
