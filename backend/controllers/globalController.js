const catchAsync = require('../middlewares/catchAsync');

const Token = require('../models/tokenModel');

const axiosFunction = require('../utils/axios');

const {
  Position,
  Blockchain,
  AssetTag,
  TokenStatus,
} = require('../constants/enum');

exports.searchTokens = catchAsync(async (req, res, next) => {
  const { count, search } = req.query;

  let page = req.query.page;

  //  Get all token list
  const allTokens = await Token.find({ status: 'Active' }).select({
    user: 1,
    symbol: 1,
    ID: 1,
  });
  //  Get total count of tokens
  const totalCount = allTokens.length;
  //  Get the max page with unit count
  const totalPage = Math.ceil(allTokens / count);

  page = totalPage < page ? totalPage : page;

  const tokens = allTokens.splice(count * (page - 1), count * page);

  // const IDSequence = tokens.map((token) => token.ID).join(',');

  // const { success, data } = await axiosFunction('');

  res.status(200).json({
    success: true,
    totalCount,
    totalPage,
    page,
    tokens,
  });
});

exports.listNewToken = catchAsync(async (req, res, next) => {
  const tokenValues = { ...req.body };

  tokenValues.userPosition = Position[tokenValues.userPosition];
  tokenValues.blockchain = Blockchain[tokenValues.blockchain];
  tokenValues.cryptoAssetTags = tokenValues.cryptoAssetTags.split(',');
  tokenValues.status = TokenStatus.InReview;

  const token = new Token(tokenValues);
  await token.save();

  res.status(200).json({
    success: true,
  });
});

exports.getPositionList = catchAsync(async (req, res, next) => {
  res.status(200).json({
    success: true,
    positions: Position,
  });
});

exports.getBlockchainList = catchAsync(async (req, res, next) => {
  res.status(200).json({
    success: true,
    blockchains: Blockchain,
  });
});

exports.getAssetTagList = catchAsync(async (req, res, next) => {
  res.status(200).json({
    success: true,
    assetTags: AssetTag,
  });
});
