const catchAsync = require('../middlewares/catchAsync');

const Token = require('../models/tokenModel');
const Post = require('../models/postModel');
const Comment = require('../models/commentModel');

const ErrorHandler = require('../utils/errorHandler');

const { TokenStatus } = require('../constants/enum');

exports.followCommunity = catchAsync(async (req, res, next) => {
  const user = req.user;
  if (user.communityFollow) {
    return next(new ErrorHandler('Already Followed', 400));
  }
  user.communityFollow = true;
  await user.save();
  res.status(200).json({
    success: true,
    message: 'Follwed Community',
  });
});

exports.unfollowCommunity = catchAsync(async (req, res, next) => {
  const user = req.user;
  if (!user.communityFollow) {
    return next(new ErrorHandler('Already Unfollowed', 400));
  }
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

exports.addPost = catchAsync(async (req, res, next) => {
  const { text, status } = req.body;

  const newPost = new Post({
    customer: req.user,
    text,
    status,
  });

  await newPost.save();

  res.status(201).json({
    success: true,
    message: 'New Post Added',
  });
});
exports.repostById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { text, status } = req.body;

  const post = await Post.findById(id);

  if (!post) {
    return next(new ErrorHandler('Post Not Found', 404));
  }

  const newPost = new Post({
    customer: req.user,
    text: post.text + text,
    status,
  });

  post.reposts.push(await newPost.save());

  await post.save();

  res.status(200).json({
    success: true,
    message: 'Reposted',
  });
});
exports.addCommentById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { text, status } = req.body;

  const post = await Post.findById(id);

  if (!post) {
    return next(new ErrorHandler('Post Not Found', 404));
  }

  const comment = new Comment({ text, status });

  const newComment = await comment.save();

  post.comments.push(newComment);

  await post.save();

  res.status(201).json({
    success: true,
    message: 'New Comment Added',
  });
});
exports.likePostById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const post = await Post.findById(id);

  if (!post) {
    return next(new ErrorHandler('Post Not Found', 404));
  }

  const likes = post.likes.map((like) => like.toString());

  if (likes.includes(req.user._id.toString())) {
    return next(new ErrorHandler('Already Liked', 400));
  } else {
    post.likes.push(req.user);
    await post.save();
    res.status(200).json({
      success: true,
      message: 'Post Liked',
    });
  }
});
exports.dislikePostById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const post = await Post.findById(id);

  if (!post) {
    return next(new ErrorHandler('Post Not Found', 404));
  }

  const likes = post.likes.map((like) => like.toString());

  const index = likes.indexOf(req.user._id.toString());
  if (index !== -1) {
    post.likes = [
      ...post.like.slice(0, index),
      ...post.like.slice(index + 1, post.like.length),
    ];
    await post.save();
    res.status(200).json({
      success: true,
      message: 'Post Disliked',
    });
  } else {
    return next(new ErrorHandler('Already Disliked', 400));
  }
});
