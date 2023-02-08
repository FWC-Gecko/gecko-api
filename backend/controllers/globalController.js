const catchAsync = require('../middlewares/catchAsync');

const Token = require('../models/tokenModel');

const ErrorHandler = require('../utils/errorHandler');

const {
  Position,
  Blockchain,
  AssetTag,
  TokenStatus,
} = require('../constants/enum');

const {
  quoteHistoricalFunction,
  quoteLatestFunction,
} = require('../utils/axiosFunction');

exports.searchTokens = catchAsync(async (req, res, next) => {
  const { count, search } = req.query;

  let page = Number(req.query.page);

  //  Get all token list
  const allTokens = await Token.find({ status: 'Active' }).select({
    name: 1,
    symbol: 1,
    ID: 1,
  });
  //  Get total count of tokens
  const totalCount = allTokens.length;
  //  Get the max page with unit count
  const totalPage = Math.ceil(totalCount / count);

  page = totalPage < page ? totalPage : page;

  const tokens = JSON.parse(
    JSON.stringify(allTokens.splice(count * (page - 1), count * page))
  );

  const IDs = tokens.map((token) => token.ID);
  const len = IDs.length;

  if (IDs && len) {
    let { success, data, code, message } = await quoteHistoricalFunction(IDs);
    if (!success) {
      return next(new ErrorHandler(message, code));
    }
    if (len === 1) {
      tokens[0].quotes = data.quotes.map((quote) => ({
        timestamp: quote.timestamp,
        price: quote.quote.USD.price,
      }));
    } else {
      for (let i = 0; i < len; i++) {
        tokens[i].quoteHistorical = data[IDs[i]].quotes.map((quote) => ({
          timestamp: quote.timestamp,
          price: quote.quote.USD.price,
        }));
      }
    }
  }

  if (IDs && len) {
    let { success, data, code, message } = await quoteLatestFunction(IDs);
    if (!success) {
      return next(new ErrorHandler(message, code));
    }
    for (let i = 0; i < len; i++) {
      tokens[i].quoteLatest = {
        timestamp: data[IDs[i]].last_updated,
        price: data[IDs[i]].quote.USD.price,
        volume_24h: data[IDs[i]].quote.USD.volume_24h,
        volume_change_24h: data[IDs[i]].quote.USD.volume_change_24h,
        percent_change_1h: data[IDs[i]].quote.USD.percent_change_1h,
        percent_change_24h: data[IDs[i]].quote.USD.percent_change_24h,
        percent_change_7d: data[IDs[i]].quote.USD.percent_change_7d,
        market_cap: data[IDs[i]].quote.USD.market_cap,
        circulating_supply: data[IDs[i]].circulating_supply,
      };
    }
  }

  res.status(200).json({
    success: true,
    totalCount,
    totalPage,
    page,
    tokens,
  });
});

exports.getTrendingTokens = catchAsync(async (req, res, next) => {});

exports.getNewTokens = catchAsync(async (req, res, next) => {
  const tokens = JSON.parse(
    JSON.stringify(
      await Token.find({ status: 'Active' })
        .select({
          name: 1,
          symbol: 1,
          ID: 1,
        })
        .sort({ createdAt: -1 })
        .limit(3)
    )
  );

  const IDs = tokens.map((token) => token.ID);
  const len = IDs.length;

  if (IDs && len) {
    let { success, data, code, message } = await quoteLatestFunction(IDs);
    if (!success) {
      return next(new ErrorHandler(message, code));
    }
    for (let i = 0; i < len; i++) {
      tokens[i].volume_change_24h = data[IDs[i]].quote.USD.volume_change_24h;
    }
  }

  res.status(200).json({
    success: true,
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
