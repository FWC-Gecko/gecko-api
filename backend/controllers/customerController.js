const catchAsync = require('../middlewares/catchAsync');

const Token = require('../models/tokenModel');

const ErrorHandler = require('../utils/errorHandler');

const { TokenStatus } = require('../constants/enum');

exports.followCommunity = catchAsync(async (req, res, next) => {
  const user = req.user;
  user.communityFollow = true;
  await user.save();
  res.status(200).json({
    success: true,
    message: 'Follwed Community',
  });
});

exports.unfollowCommunity = catchAsync(async (req, res, next) => {
  const user = req.user;
  user.communityFollow = false;
  await user.save();
  res.status(200).json({
    success: true,
    message: 'Unfollwed Community',
  });
});

exports.getWatchlist = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id.toString();

  const token = await Token.findById(id);

  if (!token) {
    return next(new ErrorHandler('Token Not Found', 404));
  }

  if (token.status !== TokenStatus.Active) {
    return next(new ErrorHandler('Token Not Active', 403));
  }

  res.status(200).json({
    success: true,
    data: {
      watchlist: token.watchlist.includes(userId),
    },
  });
});

exports.addWatchlist = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id.toString();

  const token = await Token.findById(id);

  if (!token) {
    return next(new ErrorHandler('Token Not Found', 404));
  }

  if (token.status !== TokenStatus.Active) {
    return next(new ErrorHandler('Token Not Active', 403));
  }

  if (token.watchlist.indexOf(userId) !== -1) {
    return next(new ErrorHandler('Already On Watchlist', 403));
  }

  token.watchlist = [...token.watchlist, userId];

  await token.save();

  res.status(200).json({
    success: true,
    message: 'Watchlist Added',
  });
});

exports.deleteWatchlist = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id.toString();

  const token = await Token.findById(id);

  if (!token) {
    return next(new ErrorHandler('Token Not Found', 404));
  }

  if (token.status !== TokenStatus.Active) {
    return next(new ErrorHandler('Token Not Active', 403));
  }
  const index = token.watchlist.indexOf(userId);
  if (index === -1) {
    return next(new ErrorHandler('Not On Watchlist', 404));
  }

  token.watchlist = [
    ...token.watchlist.splice(0, index),
    ...token.watchlist.splice(index + 1, token.watchlist.length),
  ];

  await token.save();

  res.status(200).json({
    success: true,
    message: 'Watchlist Deleted',
  });
});
