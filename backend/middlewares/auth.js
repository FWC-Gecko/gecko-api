const jwt = require('jsonwebtoken');

const User = require('../models/userModel');

const ErrorHandler = require('../utils/errorHandler');

const catchAsync = require('./catchAsync');

const { Role } = require('../constants/enum');

exports.isAuthenticated = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization
    // && req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      // token = req.headers.authorization.split(' ')[1];
      token = req.headers.authorization;

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id);
      next();
    } catch (error) {
      return next(new ErrorHandler('Not Authorized', 401));
    }
  }
  if (!token) {
    return next(new ErrorHandler('Not Authorized, No Token', 401));
  }
});

exports.isAdmin = catchAsync(async (req, res, next) => {
  if (req.user && req.user.role !== Role.Admin) {
    return next(new ErrorHandler('Only Admin To Access', 401));
  }
  next();
});

exports.isCustomer = catchAsync(async (req, res, next) => {
  if (req.user && req.user.role !== Role.Customer) {
    return next(new ErrorHandler('Only Customer To Access', 401));
  }
  next();
});
