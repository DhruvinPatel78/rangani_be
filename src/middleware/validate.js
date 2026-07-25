const { validationResult } = require('express-validator');
const AppError = require('../utils/AppError');
const { HTTP_STATUS } = require('../constants');

const validate = (req, _res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formatted = errors.array().map((error) => ({
      field: error.path,
      message: error.msg,
    }));

    return next(new AppError('Validation failed', HTTP_STATUS.BAD_REQUEST, formatted));
  }

  return next();
};

module.exports = validate;
