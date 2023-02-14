const catchAsync = require('../middlewares/catchAsync');

const ErrorHandler = require('../utils/errorHandler');

const User = require('../models/userModel');
const Token = require('../models/tokenModel');
const Post = require('../models/postModel');
const Comment = require('../models/commentModel');

exports.searchCustomers = catchAsync(async (req, res, next) => {});
exports.getCustomerById = catchAsync(async (req, res, next) => {});
exports.deleteCustomerById = catchAsync(async (req, res, next) => {});

exports.getTokenById = catchAsync(async (req, res, next) => {});
exports.updateTokenById = catchAsync(async (req, res, next) => {});
exports.deleteTokenById = catchAsync(async (req, res, next) => {});

exports.searchInReviewTokens = catchAsync(async (req, res, next) => {});
exports.searchPendingTokens = catchAsync(async (req, res, next) => {});
exports.searchActiveTokens = catchAsync(async (req, res, next) => {});
exports.searchUpdateRequestedTokens = catchAsync(async (req, res, next) => {});

exports.approveInReviewTokenById = catchAsync(async (req, res, next) => {});
exports.refuseInReviewTokenById = catchAsync(async (req, res, next) => {});
exports.approvePendingTokenById = catchAsync(async (req, res, next) => {});
exports.refusePendingTokenById = catchAsync(async (req, res, next) => {});
exports.approveUpdateRequestedTokenById = catchAsync(
  async (req, res, next) => {}
);
exports.refuseUpdateRequestedTokenById = catchAsync(
  async (req, res, next) => {}
);

exports.searchPosts = catchAsync(async (req, res, next) => {});
exports.getPostById = catchAsync(async (req, res, next) => {});
exports.updatePostById = catchAsync(async (req, res, next) => {});
exports.deletePostById = catchAsync(async (req, res, next) => {});

exports.searchNews = catchAsync(async (req, res, next) => {});
exports.addNews = catchAsync(async (req, res, next) => {});
exports.getNewsById = catchAsync(async (req, res, next) => {});
exports.updateNewsById = catchAsync(async (req, res, next) => {});
exports.deleteNewsById = catchAsync(async (req, res, next) => {});
