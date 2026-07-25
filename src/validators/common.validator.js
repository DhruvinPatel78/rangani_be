const { body, param, query } = require('express-validator');

const mongoId = (field = 'id') =>
  param(field).isMongoId().withMessage(`Invalid ${field}`);

const paginationValidators = [
  query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit must be between 1 and 100'),
  query('search').optional().isString().trim(),
  query('sort').optional().isString().trim(),
];

const identifierValidator = body('identifier')
  .trim()
  .notEmpty()
  .withMessage('Email or phone is required')
  .custom((value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[6-9]\d{9}$/;
    const normalized = value.replace(/\s+/g, '');
    if (emailRegex.test(value) || phoneRegex.test(normalized)) {
      return true;
    }
    throw new Error('Enter a valid email or 10-digit phone number');
  });

const passwordLoginValidators = [
  identifierValidator,
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

const requestOtpValidators = [identifierValidator];

const verifyOtpValidators = [
  identifierValidator,
  body('otp')
    .trim()
    .notEmpty()
    .withMessage('OTP is required')
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP must be 6 digits')
    .isNumeric()
    .withMessage('OTP must contain only digits'),
];

module.exports = {
  mongoId,
  paginationValidators,
  passwordLoginValidators,
  requestOtpValidators,
  verifyOtpValidators,
};
