const User = require('../models/User');
const AppError = require('../utils/AppError');
const { HTTP_STATUS, ROLES } = require('../constants');
const { signToken } = require('../utils/jwt');
const config = require('../config');

const findUserByIdentifier = async (identifier, { includeSecret = false } = {}) => {
  const value = identifier.trim();
  const query = {
    $or: [{ email: value.toLowerCase() }, { phone: value.replace(/\s+/g, '') }],
  };

  let userQuery = User.findOne(query);
  if (includeSecret) {
    userQuery = userQuery.select('+password +otpCode +otpExpiresAt');
  }

  return userQuery;
};

const buildAuthPayload = (user) => {
  const token = signToken({
    id: user._id,
    role: user.role,
  });

  return {
    user,
    tokens: {
      accessToken: token,
    },
  };
};

const loginWithPassword = async ({ identifier, password, role = null }) => {
  const user = await findUserByIdentifier(identifier, { includeSecret: true });

  if (!user || !user.isActive) {
    throw new AppError('Invalid credentials', HTTP_STATUS.UNAUTHORIZED);
  }

  if (user.role === ROLES.USER) {
    throw new AppError('Please login using OTP', HTTP_STATUS.BAD_REQUEST);
  }

  if (role && user.role !== role) {
    throw new AppError('Invalid credentials', HTTP_STATUS.UNAUTHORIZED);
  }

  if (![ROLES.ADMIN, ROLES.MANAGER].includes(user.role)) {
    throw new AppError('Invalid credentials', HTTP_STATUS.UNAUTHORIZED);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError('Invalid credentials', HTTP_STATUS.UNAUTHORIZED);
  }

  return buildAuthPayload(user);
};

const login = (payload) => loginWithPassword(payload);

const loginAdmin = (payload) => loginWithPassword({ ...payload, role: ROLES.ADMIN });

const loginManager = (payload) => loginWithPassword({ ...payload, role: ROLES.MANAGER });

const maskEmail = (email = '') => {
  const [name, domain] = email.split('@');
  if (!name || !domain) return email;
  const visible = name.slice(0, 1);
  return `${visible}***@${domain}`;
};

const maskPhone = (phone = '') => {
  if (phone.length < 4) return '****';
  return `${'*'.repeat(Math.max(phone.length - 4, 0))}${phone.slice(-4)}`;
};

const sendOtpChannels = async (user, otp) => {
  // Mock email + SMS delivery. Replace with real providers later.
  console.log(`[OTP][EMAIL] to ${user.email}: ${otp}`);
  console.log(`[OTP][SMS] to ${user.phone}: ${otp}`);
};

const identify = async ({ identifier }) => {
  const user = await findUserByIdentifier(identifier);

  if (!user || !user.isActive) {
    throw new AppError('No account found with this email or phone', HTTP_STATUS.NOT_FOUND);
  }

  if (user.role === ROLES.USER) {
    const otp = '123456';
    user.otpCode = otp;
    user.otpExpiresAt = new Date(Date.now() + config.otpExpirySeconds * 1000);
    await user.save();
    await sendOtpChannels(user, otp);

    return {
      identifier: identifier.trim(),
      loginMethod: 'otp',
      role: user.role,
      otpSent: true,
      expiresIn: config.otpExpirySeconds,
      destinations: {
        email: maskEmail(user.email),
        phone: maskPhone(user.phone),
      },
      demoOtp: config.env === 'development' ? otp : undefined,
      message: 'OTP sent to your registered email and phone',
    };
  }

  return {
    identifier: identifier.trim(),
    loginMethod: 'password',
    role: user.role,
    otpSent: false,
    message: 'Account verified. Please enter your password',
  };
};

const requestUserOtp = async ({ identifier }) => {
  const result = await identify({ identifier });
  if (result.loginMethod !== 'otp') {
    throw new AppError('OTP login is only available for users', HTTP_STATUS.BAD_REQUEST);
  }
  return result;
};

const verifyUserOtp = async ({ identifier, otp }) => {
  const user = await findUserByIdentifier(identifier, { includeSecret: true });

  if (!user || user.role !== ROLES.USER || !user.isActive) {
    throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
  }

  if (!user.otpCode || !user.otpExpiresAt || user.otpExpiresAt < new Date()) {
    throw new AppError('OTP expired. Please request a new one', HTTP_STATUS.UNAUTHORIZED);
  }

  if (user.otpCode !== otp) {
    throw new AppError('Invalid OTP', HTTP_STATUS.UNAUTHORIZED);
  }

  user.otpCode = undefined;
  user.otpExpiresAt = undefined;
  await user.save();

  return buildAuthPayload(user);
};

const getProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
  }
  return user;
};

module.exports = {
  identify,
  login,
  loginAdmin,
  loginManager,
  requestUserOtp,
  verifyUserOtp,
  getProfile,
  findUserByIdentifier,
};
