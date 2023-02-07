const catchAsync = require('../middlewares/catchAsync');

const Token = require('../models/tokenModel');

const { Position, Blockchain, AssetTag } = require('../constants/enum');

exports.searchTokens = catchAsync(async (req, res, next) => {
  const { count, search } = req.query;

  let page = req.query.page;

  //  Get all token list
  const allTokens = await Token.find({ status: 'Active' });
  //  Get total count of tokens
  const totalCount = allTokens.length;
  //  Get the max page with unit count
  const totalPage = Math.ceil(allTokens / count);

  page = totalPage < page ? totalPage : page;

  const tokens = allTokens.splice(count * (page - 1), count * page);

  res.status(200).json({
    success: true,
    totalCount,
    totalPage,
    page,
    tokens,
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
