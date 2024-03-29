const catchAsync = require('../middlewares/catchAsync');

const ErrorHandler = require('../utils/errorHandler');
const { deleteFile } = require('../utils/awsFunctions');

const { Role, TokenStatus } = require('../constants/enum');

const User = require('../models/userModel');
const Token = require('../models/tokenModel');
const Post = require('../models/postModel');
const Request = require('../models/requestModel');

exports.searchCustomers = catchAsync(async (req, res, next) => {
  // const search = req.query.search || '';
  // let count = Number(req.query.count);
  // let page = Number(req.query.page);

  // let totalCount = await User.aggregate([
  //   {
  //     $match: {
  //       role: Role.Customer,
  //       $or: [
  //         { userName: { $regex: search, $options: 'i' } },
  //         { email: { $regex: search, $options: 'i' } },
  //       ],
  //     },
  //   },
  //   { $count: 'email' },
  // ]);

  // totalCount = totalCount.length ? totalCount[0]['email'] : 0;

  // const pages = totalCount ? Math.ceil(totalCount / count) : 1;

  // page = pages < page ? pages : page;

  // const customers = await User.find({
  //   role: Role.Customer,
  //   $or: [
  //     { userName: { $regex: search, $options: 'i' } },
  //     { email: { $regex: search, $options: 'i' } },
  //   ],
  // })
  //   .skip(count * (page - 1))
  //   .limit(count);

  // res.status(200).json({
  //   data: { customers, pages, page, count },
  // });

  const customers = await User.find({ role: Role.Customer });

  res.status(200).json({
    success: true,
    data: {
      customers,
    },
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

exports.updateTokenById = catchAsync(async (req, res, next) => {
  const token = await Token.findById(req.params.id);

  if (!token) {
    return next(new ErrorHandler('Token Not Found', 404));
  }

  for (const key of req.body) {
    if (key !== 'createdAt' && key !== 'watchlist' && key !== 'vote')
      token[key] = req.body[key];
  }

  if (req.file && req.file.location) {
    await deleteFile(token.logo);
    token.logo = req.body.logo;
  }

  await token.save();

  res.status(200).json({
    success: true,
    message: 'Token Updated',
  });
});

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

exports.searchTokens = catchAsync(async (req, res, next) => {
  // const search = req.query.search || '';
  // let count = Number(req.query.count);
  // let page = Number(req.query.page);

  // let totalCount = await Token.aggregate([
  //   {
  //     $match: {
  //       status: TokenStatus.InReview,
  //       $or: [
  //         { name: { $regex: search, $options: 'i' } },
  //         { symbol: { $regex: search, $options: 'i' } },
  //       ],
  //     },
  //   },
  //   { $count: 'name' },
  // ]);

  // totalCount = totalCount.length ? totalCount[0]['name'] : 0;

  // const pages = totalCount ? Math.ceil(totalCount / count) : 1;

  // page = pages < page ? pages : page;

  // const tokens = await Token.find({
  //   status: TokenStatus.InReview,
  //   $or: [
  //     { name: { $regex: search, $options: 'i' } },
  //     { symbol: { $regex: search, $options: 'i' } },
  //   ],
  // })
  //   .skip(count * (page - 1))
  //   .limit(count);

  // res.status(200).json({
  //   data: { tokens, pages, page, count },
  // });
  const tokens = await Token.find({});

  res.status(200).json({
    success: true,
    data: {
      tokens,
    },
  });
});

exports.approveInReviewTokenById = catchAsync(async (req, res, next) => {
  const token = await Token.findById(req.params.id);

  if (!token) {
    return next(new ErrorHandler('Token Not Found', 404));
  }

  if (token.status !== TokenStatus.InReview) {
    return next(new ErrorHandler('Token Status Not In Review', 400));
  }

  token.status = TokenStatus.Pending;

  await token.save();

  //  Send Email

  res.status(200).json({
    success: true,
    message: 'Token Approved To Pending',
  });
});

exports.refuseInReviewTokenById = catchAsync(async (req, res, next) => {
  const token = await Token.findById(req.params.id);

  if (!token) {
    return next(new ErrorHandler('Token Not Found', 404));
  }

  if (token.status !== TokenStatus.InReview) {
    return next(new ErrorHandler('Token Status Not In Review', 400));
  }

  token.status = TokenStatus.InReviewRefused;
  token.refusedReason = req.body.reason;

  await token.save();

  //  Send Email

  res.status(200).json({
    success: true,
    message: 'Token Refused From In Review',
  });
});

exports.recoverRefusedTokenToInReviewById = catchAsync(
  async (req, res, next) => {
    const token = await Token.findById(req.params.id);

    if (!token) {
      return next(new ErrorHandler('Token Not Found', 404));
    }

    if (token.status !== TokenStatus.InReviewRefused) {
      return next(new ErrorHandler('Token Status Not In Review Refused', 400));
    }

    token.status = TokenStatus.InReview;

    await token.save();

    //  Send Email

    res.status(200).json({
      success: true,
      message: 'Token Recovered To In Review',
    });
  }
);

exports.approvePendingTokenById = catchAsync(async (req, res, next) => {
  const token = await Token.findById(req.params.id);

  if (!token) {
    return next(new ErrorHandler('Token Not Found', 404));
  }

  if (token.status !== TokenStatus.Pending) {
    return next(new ErrorHandler('Token Status Not Pending', 400));
  }

  token.status = TokenStatus.Active;
  token.ID = req.body.tokenID;

  await token.save();

  //  Send Email

  res.status(200).json({
    success: true,
    message: 'Token Approved To Active',
  });
});

exports.refusePendingTokenById = catchAsync(async (req, res, next) => {
  const token = await Token.findById(req.params.id);

  if (!token) {
    return next(new ErrorHandler('Token Not Found', 404));
  }

  if (token.status !== TokenStatus.Pending) {
    return next(new ErrorHandler('Token Status Not Pending', 400));
  }

  token.status = TokenStatus.PendingRefused;
  token.refusedReason = req.body.reason;

  await token.save();

  //  Send Email

  res.status(200).json({
    success: true,
    message: 'Token Refused From Pending',
  });
});

exports.recoverRefusedTokenToPendingById = catchAsync(
  async (req, res, next) => {
    const token = await Token.findById(req.params.id);

    if (!token) {
      return next(new ErrorHandler('Token Not Found', 404));
    }

    if (token.status !== TokenStatus.Pending) {
      return next(new ErrorHandler('Token Status Not Pending Refused', 400));
    }

    token.status = TokenStatus.Pending;

    await token.save();

    //  Send Email

    res.status(200).json({
      success: true,
      message: 'Token Recovered To Pending',
    });
  }
);

exports.getTokenUpdateRequests = catchAsync(async (req, res, next) => {});
exports.getTokenUpdateRequestById = catchAsync(async (req, res, next) => {});
exports.deleteTokenUpdateRequestById = catchAsync(async (req, res, next) => {});

exports.searchPosts = catchAsync(async (req, res, next) => {
  // const search = req.query.search || '';
  // let count = Number(req.query.count);
  // let page = Number(req.query.page);

  // let totalCount = await Post.aggregate([
  //   {
  //     $match: {
  //       text: { $regex: search, $options: 'i' },
  //     },
  //   },
  //   { $count: 'text' },
  // ]);

  // totalCount = totalCount.length ? totalCount[0]['email'] : 0;

  // const pages = totalCount ? Math.ceil(totalCount / count) : 1;

  // page = pages < page ? pages : page;

  // const posts = await Post.find({
  //   text: { $regex: search, $options: 'i' },
  // })
  //   .skip(count * (page - 1))
  //   .limit(count);

  // res.status(200).json({
  //   data: { posts, pages, page, count },
  // });
  const posts = await Post.find({});

  res.status(200).json({
    success: true,
    data: {
      posts,
    },
  });
});

exports.getPostById = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id).populate('comments');

  if (!post) {
    return next(new ErrorHandler('Post Not Found', 404));
  }

  res.status(200).json({
    success: true,
    data: {
      post,
    },
  });
});

exports.updatePostById = catchAsync(async (req, res, next) => {});

exports.deletePostById = catchAsync(async (req, res, next) => {
  const post = await Post.findByIdAndDelete(req.params.id);

  if (!post) {
    return next(new ErrorHandler('Post Not Found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Post Deleted',
  });
});

exports.searchNews = catchAsync(async (req, res, next) => {});
exports.addNews = catchAsync(async (req, res, next) => {});
exports.getNewsById = catchAsync(async (req, res, next) => {});
exports.updateNewsById = catchAsync(async (req, res, next) => {});
exports.deleteNewsById = catchAsync(async (req, res, next) => {});

exports.getAllRequests = catchAsync(async (req, res, next) => {
  const requests = await Request.find({});

  res.status(200).json({
    success: true,
    data: {
      requests,
    },
  });
});

exports.getRequestById = catchAsync(async (req, res, next) => {
  const request = await Request.findById(req.params.id);

  if (!request) {
    return next(new ErrorHandler('Request Not Found', 404));
  }

  res.status(200).json({
    success: true,
    data: {
      request,
    },
  });
});
