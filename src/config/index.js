require('dotenv').config({ quiet: true });

const normalizeOrigin = (origin) => origin.trim().replace(/\/+$/, '');

const parseClientUrls = (value) => {
  const raw = value || 'http://localhost:5173';
  return [
    ...new Set(
      raw
        .split(',')
        .map(normalizeOrigin)
        .filter(Boolean),
    ),
  ];
};

const config = {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/rangani_parivaar',
  jwt: {
    secret: process.env.JWT_SECRET || 'rangani_parivaar_dev_jwt_secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  otpExpirySeconds: Number(process.env.OTP_EXPIRY) || 300,
  clientUrls: parseClientUrls(process.env.CLIENT_URL),
};

module.exports = config;
