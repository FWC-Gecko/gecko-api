const ErrorHandler = require('../utils/errorHandler');

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  // mongodb id error
  if (err.name === 'CastError') {
    const message = `Resource Not Found. Invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // mongoose duplicate key error
  if (err.code === 11000) {
    const message = Object.keys(err.keyValue)
      .map((value) => capitalize(value) + ' Already Exists')
      .join(', ');
    err = new ErrorHandler(message, 400);
  }

  // wrong jwt error
  if (err.code === 'JsonWebTokenError') {
    const message = 'JWT Error';
    err = new ErrorHandler(message, 400);
  }

  // jwt expire error
  if (err.code === 'JsonWebTokenError') {
    const message = 'JWT Expired';
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
