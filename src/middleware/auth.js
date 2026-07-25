const { verifyToken } = require('../utils/jwt');
const AppError = require('../utils/AppError');
const { HTTP_STATUS } = require('../constants');
const User = require('../models/User');

const authenticate = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;
    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      throw new AppError('Authentication required', HTTP_STATUS.UNAUTHORIZED);
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select('-password -otpCode -otpExpiresAt');

    if (!user || !user.isActive) {
      throw new AppError('User not found or inactive', HTTP_STATUS.UNAUTHORIZED);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return next(new AppError('Invalid or expired token', HTTP_STATUS.UNAUTHORIZED));
    }
    return next(error);
  }
};

const authorize = (...roles) => (req, _res, next) => {
  if (!req.user) {
    return next(new AppError('Authentication required', HTTP_STATUS.UNAUTHORIZED));
  }

  if (!roles.includes(req.user.role)) {
    return next(new AppError('You are not authorized to perform this action', HTTP_STATUS.FORBIDDEN));
  }

  return next();
};

module.exports = {
  authenticate,
  authorize,
};
