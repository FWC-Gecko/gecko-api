const catchAsync = require('../middlewares/catchAsync');

const ErrorHandler = require('../utils/errorHandler');

const { Role, TokenStatus } = require('../constants/enum');

const User = require('../models/userModel');
const Token = require('../models/tokenModel');
const Post = require('../models/postModel');
const Comment = require('../models/commentModel');

exports.searchCustomers = catchAsync(async (req, res, next) => {
  const search = req.query.search || '';
  let count = Number(req.query.count);
  let page = Number(req.query.page);

  let totalCount = await User.aggregate([
    {
      $match: {
        role: Role.Customer,
        $or: [
          { userName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ],
      },
    },
    { $count: 'email' },
  ]);

  totalCount = totalCount.length ? totalCount[0]['email'] : 0;

  const pages = totalCount ? Math.ceil(totalCount / count) : 1;

  page = pages < page ? pages : page;

  const customers = await User.find({
    role: Role.Customer,
    $or: [
      { userName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ],
  })
    .skip(count * (page - 1))
    .limit(count);

  res.status(200).json({
    data: { customers, pages, page, count },
  });
});
exports.getCustomerById = catchAsync(async (req, res, next) => {
  const customer = await User.findById(req.params.id);

  if (!customer) {
    return next(new ErrorHandler('Customer Not Found', 404));
  }

  res.status(200).json({
    success: true,
    data: {
      customer,
    },
  });
});
exports.deleteCustomerById = catchAsync(async (req, res, next) => {
  const customer = await User.findByIdAndRemove(req.params.id);

  if (!customer) {
    return next(new ErrorHandler('Customer Not Found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Customer Deleted',
  });
});

exports.getTokenById = catchAsync(async (req, res, next) => {
  const token = await Token.findById(req.params.id);

  if (!token) {
    return next(new ErrorHandler('Token Not Found', 404));
  }

  res.status(200).json({
    success: true,
    data: {
      token,
    },
  });
});
exports.updateTokenById = catchAsync(async (req, res, next) => {});
exports.deleteTokenById = catchAsync(async (req, res, next) => {
  const token = await Token.findByIdAndDelete(req.params.id);

  if (!token) {
    return next(new ErrorHandler('Token Not Found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Token Deleted',
  });
});

exports.searchInReviewTokens = catchAsync(async (req, res, next) => {
  const search = req.query.search || '';
  let count = Number(req.query.count);
  let page = Number(req.query.page);

  let totalCount = await Token.aggregate([
    {
      $match: {
        status: TokenStatus.InReview,
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { symbol: { $regex: search, $options: 'i' } },
        ],
      },
    },
    { $count: 'name' },
  ]);

  totalCount = totalCount.length ? totalCount[0]['name'] : 0;

  const pages = totalCount ? Math.ceil(totalCount / count) : 1;

  page = pages < page ? pages : page;

  const tokens = await Token.find({
    status: TokenStatus.InReview,
    $or: [
      { name: { $regex: search, $options: 'i' } },
      { symbol: { $regex: search, $options: 'i' } },
    ],
  })
    .skip(count * (page - 1))
    .limit(count);

  res.status(200).json({
    data: { tokens, pages, page, count },
  });
});
exports.searchPendingTokens = catchAsync(async (req, res, next) => {
  const search = req.query.search || '';
  let count = Number(req.query.count);
  let page = Number(req.query.page);

  let totalCount = await Token.aggregate([
    {
      $match: {
        status: TokenStatus.Pending,
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { symbol: { $regex: search, $options: 'i' } },
        ],
      },
    },
    { $count: 'name' },
  ]);

  totalCount = totalCount.length ? totalCount[0]['name'] : 0;

  const pages = totalCount ? Math.ceil(totalCount / count) : 1;

  page = pages < page ? pages : page;

  const tokens = await Token.find({
    status: TokenStatus.Pending,
    $or: [
      { name: { $regex: search, $options: 'i' } },
      { symbol: { $regex: search, $options: 'i' } },
    ],
  })
    .skip(count * (page - 1))
    .limit(count);

  res.status(200).json({
    data: { tokens, pages, page, count },
  });
});
exports.searchActiveTokens = catchAsync(async (req, res, next) => {
  const search = req.query.search || '';
  let count = Number(req.query.count);
  let page = Number(req.query.page);

  let totalCount = await Token.aggregate([
    {
      $match: {
        status: TokenStatus.Active,
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { symbol: { $regex: search, $options: 'i' } },
        ],
      },
    },
    { $count: 'name' },
  ]);

  totalCount = totalCount.length ? totalCount[0]['name'] : 0;

  const pages = totalCount ? Math.ceil(totalCount / count) : 1;

  page = pages < page ? pages : page;

  const tokens = await Token.find({
    status: TokenStatus.Active,
    $or: [
      { name: { $regex: search, $options: 'i' } },
      { symbol: { $regex: search, $options: 'i' } },
    ],
  })
    .skip(count * (page - 1))
    .limit(count);

  res.status(200).json({
    data: { tokens, pages, page, count },
  });
});
exports.searchUpdateRequestedTokens = catchAsync(async (req, res, next) => {
  const search = req.query.search || '';
  let count = Number(req.query.count);
  let page = Number(req.query.page);

  let totalCount = await Token.aggregate([
    {
      $match: {
        status: TokenStatus.UpdateRequested,
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { symbol: { $regex: search, $options: 'i' } },
        ],
      },
    },
    { $count: 'name' },
  ]);

  totalCount = totalCount.length ? totalCount[0]['name'] : 0;

  const pages = totalCount ? Math.ceil(totalCount / count) : 1;

  page = pages < page ? pages : page;

  const tokens = await Token.find({
    status: TokenStatus.UpdateRequested,
    $or: [
      { name: { $regex: search, $options: 'i' } },
      { symbol: { $regex: search, $options: 'i' } },
    ],
  })
    .skip(count * (page - 1))
    .limit(count);

  res.status(200).json({
    data: { tokens, pages, page, count },
  });
});

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
