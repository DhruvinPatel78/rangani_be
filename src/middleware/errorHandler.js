const AppError = require('../utils/AppError');
const { HTTP_STATUS } = require('../constants');
const config = require('../config');

const notFound = (req, _res, next) => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, HTTP_STATUS.NOT_FOUND));
};

const errorHandler = (err, _req, res, _next) => {
  let statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message = err.message || 'Internal server error';
  let errors = err.errors || null;

  if (err.name === 'CastError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  if (err.code === 11000) {
    statusCode = HTTP_STATUS.CONFLICT;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `${field} already exists`;
  }

  if (err.name === 'ValidationError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    errors = Object.values(err.errors || {}).map((item) => ({
      field: item.path,
      message: item.message,
    }));
    message = 'Validation failed';
  }

  if (config.env === 'development' && statusCode === HTTP_STATUS.INTERNAL_SERVER_ERROR) {
    console.error(err);
  }

  return res.status(statusCode).json({
    success: false,
    message,
    data: errors,
  });
};

module.exports = {
  notFound,
  errorHandler,
};
