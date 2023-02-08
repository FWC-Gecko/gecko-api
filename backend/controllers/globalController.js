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
  IDMapFunction,
  metadataFunction,
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
    const { success, data, code, message } = await quoteHistoricalFunction(IDs);
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
    const { success, data, code, message } = await quoteLatestFunction(IDs);
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

exports.addTopTokens = catchAsync(async (req, res, next) => {
  const { success, data, code, message } = await IDMapFunction();

  if (!success) {
    return next(new ErrorHandler(message, code));
  }

  const IDs = data.map((token) => token.id);

  const result_meta = await metadataFunction(IDs);

  if (!result_meta.success) {
    return next(new ErrorHandler(result_meta.message, result_meta.code));
  }

  const result_quote_latest = await quoteLatestFunction(IDs);

  if (!result_quote_latest.success) {
    return next(
      new ErrorHandler(result_quote_latest.message, result_quote_latest.code)
    );
  }

  let tokens = [];

  for (const ID of IDs) {
    const token_meta = result_meta.data[ID];
    const token_quote = result_quote_latest.data[ID];
    tokens.push({
      userPosition: 'CEO',
      userName: 'superumam',
      userEmail: 'umamlikeyou@gmail.com',
      userTelegram: '@superumam',
      name: token_meta.name,
      symbol: token_meta.symbol,
      launchedAt:
        token_meta.date_launched === null
          ? new Date()
          : token_meta.date_launched,
      description: token_meta.description,
      detailedDescription: token_meta.description,
      decimals: 18,
      totalSupply:
        token_quote.total_supply === null ? 0 : token_quote.total_supply,
      maxSupply: token_quote.max_supply === null ? 0 : token_quote.max_supply,
      circulatingSupply:
        token_quote.circulating_supply === null
          ? 0
          : token_quote.circulating_supply,
      website1: token_meta.urls.website[0],
      twitter: token_meta.urls.twitter[0],
      reddit: token_meta.urls.reddit[0],
      explorer: token_meta.urls.explorer,
      logo: token_meta.logo,
      cryptoAssetTags: token_meta.tags,
      contractAddress: token_meta.contract_address.map((contract) => ({
        address: contract.contract_address,
        blockchain: contract.platform.coin.name,
      })),
      status: TokenStatus.Active,
    });
  }

  await Token.insertMany(tokens);

  res.status(201).json({
    success: true,
    message: 'Top Tokens Added',
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
    const { success, data, code, message } = await quoteLatestFunction(IDs);
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
  tokenValues.cryptoAssetTags = tokenValues.cryptoAssetTags.split(',');
  tokenValues.explorer = tokenValues.explorer.split(',');
  tokenValues.contractAddress = {
    address: tokenValues.address,
    blockchain: Blockchain[tokenValues.blockchain],
  };
  delete tokenValues['address'];
  delete tokenValues['blockchain'];
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
