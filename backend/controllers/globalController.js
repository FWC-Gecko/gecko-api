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
  ID_BTC,
  ID_ETH,
  ID_USD,
  ID_FWC,
  ID_FWCL,
} = require('../constants/tokenId');

const {
  tokenQuoteHistoricalFunction,
  tokenQuoteLatestFunction,
  tokenMapFunction,
  tokenMetadataFunction,
  marketPairFunction,
  ohlcvHistoricalFunction,
  ohlcvLatestFunction,
  exchangeMapFunction,
  exchangeMetadataFunction,
  exchangeQuoteHistoricalFunction,
  exchangeListingsLatestFunction,
  exchangeQuoteLatestFunction,
} = require('../utils/axiosFunction');

const {
  getUnixTimestamp,
  getCurrentTime,
  getBeforeDaysFromNow,
  getBeforeMonthsFromNow,
  getBeforeYearsFromNow,
  getFirstDayOfThisYear,
  getFormattedDate,
} = require('../utils/dateFunction');

exports.getRecommendedData = catchAsync(async (req, res, next) => {
  //  Get Crypto Count
  const resultCryptos = await Token.find({ status: TokenStatus.Active }).select(
    { ID: 1, _id: 0 }
  );
  const IDs = resultCryptos.map((crypto) => crypto.ID);

  //  Get Total MarketCap & volume(24h)
  const resultQuotes = await tokenQuoteLatestFunction(IDs);

  if (!resultQuotes.success) {
    return next(new ErrorHandler(resultQuotes.message, resultQuotes.code));
  }

  let totalMarketCap = 0;
  let totalVolume24h = 0;
  for (const ID of IDs) {
    totalMarketCap += resultQuotes.data[ID].quote.USD.market_cap;
    totalVolume24h += resultQuotes.data[ID].quote.USD.volume_24h;
  }

  //  Get Exchange Count
  const resultExchange = await exchangeMapFunction();

  if (!resultExchange.success) {
    return next(new ErrorHandler(resultExchange.message, resultExchange.code));
  }

  res.status(200).json({
    success: true,
    data: {
      cryptoCount: resultCryptos.length,
      exchangeCount: resultExchange.data.length,
      totalMarketCap,
      totalVolume24h,
    },
  });
});

exports.searchTokens = catchAsync(async (req, res, next) => {
  const { count, search } = req.query;

  let page = Number(req.query.page);

  //  Get all token list
  const allTokens = await Token.find({
    status: 'Active',
    name: { $regex: search, $options: 'i' },
  }).select({
    name: 1,
    symbol: 1,
    ID: 1,
    logo: 1,
  });
  //  Get total count of tokens
  const totalCount = allTokens.length;
  //  Get the max page with unit count
  const totalPage = Math.ceil(totalCount / count);

  page = totalPage < page ? totalPage : page;

  const tokens = JSON.parse(
    JSON.stringify(allTokens.slice(count * (page - 1), count * page))
  );

  const IDs = tokens.map((token) => token.ID);
  const len = IDs.length;

  if (IDs && len) {
    //  last 7 days with interval(6h)
    const timeStart = getBeforeDaysFromNow(7);
    const timeEnd = getCurrentTime();
    const { success, data, code, message } = await tokenQuoteHistoricalFunction(
      IDs,
      timeStart,
      timeEnd,
      '6h'
    );
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
    const { success, data, code, message } = await tokenQuoteLatestFunction(
      IDs
    );
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
    data: { totalCount, totalPage, page, tokens },
  });
});

exports.addTopTokens = catchAsync(async (req, res, next) => {
  const { success, data, code, message } = await tokenMapFunction();

  if (!success) {
    return next(new ErrorHandler(message, code));
  }

  const IDs = [...data.map((token) => token.id), ID_FWC, ID_FWCL];

  const result_meta = await tokenMetadataFunction(IDs);

  if (!result_meta.success) {
    return next(new ErrorHandler(result_meta.message, result_meta.code));
  }

  const result_quote_latest = await tokenQuoteLatestFunction(IDs);

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
      ID,
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

exports.getTrendingTokens = catchAsync(async (req, res, next) => {
  const tokens = JSON.parse(
    JSON.stringify(
      await Token.find({ status: 'Active' })
        .select({
          name: 1,
          symbol: 1,
          ID: 1,
          logo: 1,
        })
        .sort({ createdAt: -1 })
        .limit(3)
    )
  );

  const IDs = tokens.map((token) => token.ID);
  const len = IDs.length;

  if (IDs && len) {
    const { success, data, code, message } = await tokenQuoteLatestFunction(
      IDs
    );
    if (!success) {
      return next(new ErrorHandler(message, code));
    }
    for (let i = 0; i < len; i++) {
      tokens[i].volume_change_24h = data[IDs[i]].quote.USD.volume_change_24h;
    }
  }

  res.status(200).json({
    success: true,
    data: { tokens },
  });
});

exports.getNewTokens = catchAsync(async (req, res, next) => {
  const tokens = JSON.parse(
    JSON.stringify(
      await Token.find({ status: 'Active' })
        .select({
          name: 1,
          symbol: 1,
          ID: 1,
          logo: 1,
        })
        .sort({ createdAt: -1 })
        .limit(3)
    )
  );

  const IDs = tokens.map((token) => token.ID);
  const len = IDs.length;

  if (IDs && len) {
    const { success, data, code, message } = await tokenQuoteLatestFunction(
      IDs
    );
    if (!success) {
      return next(new ErrorHandler(message, code));
    }
    for (let i = 0; i < len; i++) {
      tokens[i].volume_change_24h = data[IDs[i]].quote.USD.volume_change_24h;
    }
  }

  res.status(200).json({
    success: true,
    data: { tokens },
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
    data: {
      positions: Position.map((position, index) => ({
        index,
        position,
      })),
    },
  });
});

exports.getBlockchainList = catchAsync(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: {
      blockchains: Blockchain.map((blockchain, index) => ({
        index,
        blockchain,
      })),
    },
  });
});

exports.getAssetTagList = catchAsync(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: { assetTags: AssetTag.map((tag, index) => ({ index, tag })) },
  });
});

exports.getTokenById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const token = JSON.parse(JSON.stringify(await Token.findById(id)));

  if (!token) {
    return next(new ErrorHandler('Token Not Found', 404));
  }

  if (token.status !== TokenStatus.Active) {
    return next(new ErrorHandler('Token Not Active', 403));
  }

  //  Watchlist count
  token.watchlistCount = token.watchlist.length;
  //  Watchlist Status
  if (
    req.user &&
    req.user._id &&
    token.watchlist.includes(req.user._id.toString())
  ) {
    token.watchlist = true;
  } else {
    token.watchlist = false;
  }

  //  Quote Lastest
  const { success, data, message, code } = await tokenQuoteLatestFunction(
    [token.ID],
    [ID_BTC, ID_ETH, ID_USD] //  1: BTC, 1027: ETH, 2781: USD
  );

  if (!success) {
    return next(new ErrorHandler(message, code));
  }

  const result_meta = await tokenMetadataFunction([token.ID]);

  if (!result_meta.success) {
    return next(new ErrorHandler(result_meta.message, result_meta.code));
  }

  const result_ohlcv = await ohlcvLatestFunction([token.ID]);

  if (!result_ohlcv.success) {
    return next(new ErrorHandler(result_ohlcv.message, result_ohlcv.code));
  }

  token.description = result_meta.data[token.ID].description;
  token.price_usd = data[token.ID].quote[ID_USD].price;
  token.volume_24h_usd = data[token.ID].quote[ID_USD].volume_24h;
  token.volume_change_24h_usd = data[token.ID].quote[ID_USD].volume_change_24h;
  token.percent_change_1h_usd = data[token.ID].quote[ID_USD].percent_change_1h;
  token.percent_change_24h_usd =
    data[token.ID].quote[ID_USD].percent_change_24h;
  token.percent_change_7d_usd = data[token.ID].quote[ID_USD].percent_change_7d;
  token.market_cap_usd = data[token.ID].quote[ID_USD].market_cap;
  token.circulating_supply = data[token.ID].circulating_supply;
  token.cmc_rank = data[token.ID].cmc_rank;
  token.market_cap_dominance_usd =
    data[token.ID].quote[ID_USD].market_cap_dominance;
  token.fully_diluted_market_cap_usd =
    data[token.ID].quote[ID_USD].fully_diluted_market_cap;
  token.high_24h_usd = result_ohlcv.data[token.ID].quote.USD.high;
  token.low_24h_usd = result_ohlcv.data[token.ID].quote.USD.low;
  token.price_btc = data[token.ID].quote[ID_BTC].price;
  token.price_change_24h_btc = data[token.ID].quote[ID_BTC].percent_change_24h;
  token.price_eth = data[token.ID].quote[ID_ETH].price;
  token.price_change_24h_eth = data[token.ID].quote[ID_ETH].percent_change_24h;
  res.status(200).json({
    success: true,
    data: { token },
  });
});

exports.getTokenOverviewById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  let { period, timeStart, timeEnd } = req.query;

  const token = await Token.findById(id);

  if (!token) {
    return next(new ErrorHandler('Token Not Found', 404));
  }

  if (token.status !== TokenStatus.Active) {
    return next(new ErrorHandler('Token Not Active', 403));
  }

  let interval = '1d';

  switch (period) {
    case '1D':
      timeEnd = getCurrentTime();
      timeStart = getBeforeDaysFromNow(1);
      interval = '5m';
      break;
    case '7D':
      timeStart = getBeforeDaysFromNow(7);
      timeEnd = getCurrentTime();
      interval = '15m';
      break;
    case '1M':
      timeStart = getBeforeMonthsFromNow(1);
      timeEnd = getCurrentTime();
      interval = '1h';
      break;
    case '3M':
      timeStart = getBeforeMonthsFromNow(3);
      timeEnd = getCurrentTime();
      interval = '3h';
      break;
    case '1Y':
      timeStart = getBeforeYearsFromNow(1);
      timeEnd = getCurrentTime();
      interval = '1d';
      break;
    case 'YTD':
      timeStart = getFirstDayOfThisYear();
      timeEnd = getCurrentTime();
      break;
    case 'ALL':
      timeStart = getBeforeYearsFromNow(1);
      timeEnd = getCurrentTime();
      break;
    case 'DATE':
      if (!timeStart) {
        return next(new ErrorHandler('Starting Time Not Found', 404));
      }
      if (!timeEnd) {
        return next(new ErrorHandler('Ending Time Not Found', 404));
      }
      timeStart = getUnixTimestamp(timeStart);
      timeEnd = getUnixTimestamp(timeEnd);
      break;
    default:
      return next(new ErrorHandler('Period Wrong', 403));
  }

  const { success, data, message, code } = await tokenQuoteHistoricalFunction(
    [token.ID],
    timeStart,
    timeEnd,
    interval
  );
  if (!success) {
    return next(new ErrorHandler(message, code));
  }

  res.status(200).json({
    success: true,
    data: data.quotes.map((quote) => ({
      timestamp: quote.timestamp,
      price: quote.quote.USD.price,
      marketCap: quote.quote.USD.market_cap,
    })),
  });
});

exports.getTokenMarketsById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const token = await Token.findById(id);

  if (!token) {
    return next(new ErrorHandler('Token Not Found', 404));
  }

  if (token.status !== TokenStatus.Active) {
    return next(new ErrorHandler('Token Not Active', 403));
  }

  const { success, data, message, code } = await marketPairFunction(token.ID);

  if (!success) {
    return next(new ErrorHandler(message, code));
  }

  const marketPairs = data.market_pairs;

  //  Seperated By Category (spot, derivatives, futures)

  const result = { spot: [], perpetual: [], futures: [] };

  for (const marketPair of marketPairs) {
    const { category, market_pair, quote, exchange } = marketPair;

    if (category === 'spot') {
      result['spot'].push({
        source: exchange.name,
        pairs: market_pair,
        price: quote.USD.price,
        volume_24h: quote.USD.volume_24h,
        depth_negative_two: quote.USD.depth_negative_two,
        depth_positive_two: quote.USD.depth_positive_two,
      });
    } else if (category === 'derivatives') {
      result['perpetual'].push({
        source: exchange.name,
        pairs: market_pair,
        price: quote.USD.price,
        volume_24h: quote.USD.volume_24h,
      });
    } else if (category === 'futures') {
      result['futures'].push({
        source: exchange.name,
        pairs: market_pair,
        price: quote.USD.price,
        volume_24h: quote.USD.volume_24h,
      });
    }
  }

  res.status(200).json({
    success: true,
    data: result,
  });
});

exports.getTokenHistoricalDataById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const token = await Token.findById(id);

  if (!token) {
    return next(new ErrorHandler('Token Not Found', 404));
  }

  if (token.status !== TokenStatus.Active) {
    return next(new ErrorHandler('Token Not Active', 403));
  }

  const { success, data, message, code } = await ohlcvHistoricalFunction(
    token.ID
  );

  if (!success) {
    return next(new ErrorHandler(message, code));
  }

  const { quotes } = data;

  res.status(200).json({
    success: true,
    data: quotes.map((quote) => ({
      open: quote.quote.USD.open,
      high: quote.quote.USD.high,
      low: quote.quote.USD.low,
      close: quote.quote.USD.close,
      volume: quote.quote.USD.volume,
      market_cap: quote.quote.USD.market_cap,
      timestamp: getFormattedDate(quote.quote.USD.timestamp),
    })),
  });
});

exports.searchExchanges = catchAsync(async (req, res, next) => {
  const resultListingsLatest = await exchangeListingsLatestFunction();

  if (!resultListingsLatest.success) {
    return next(
      new ErrorHandler(resultListingsLatest.message, resultListingsLatest.code)
    );
  }

  const IDs = resultListingsLatest.data.map((exchange) => exchange.id);

  const resultMetadata = await exchangeMetadataFunction(IDs);

  if (!resultMetadata.success) {
    return next(new ErrorHandler(resultMetadata.message, resultMetadata.code));
  }

  //  last 7 days with interval(6h)
  const timeStart = getBeforeDaysFromNow(7);
  const timeEnd = getCurrentTime();
  const resultQuoteHistorical = await exchangeQuoteHistoricalFunction(
    IDs,
    timeStart,
    timeEnd,
    '6h'
  );

  let exchanges = [];

  for (const exchange of resultListingsLatest.data) {
    exchanges.push({
      logo: resultMetadata.data[exchange.id].logo,
      name: exchange.name,
      exchange_score: exchange.exchange_score,
      volume_24h: exchange.quote.USD.volume_24h,
      effective_liquidity_24h: exchange.quote.USD.effective_liquidity_24h,
      weekly_visits: resultMetadata.data[exchange.id].weekly_visits,
      num_market_pairs: exchange.num_market_pairs,
      num_coins: exchange.num_coins,
      fiats: resultMetadata.data[exchange.id].fiats,
      quotes: resultQuoteHistorical.data[exchange.id].quotes.map((quote) => ({
        timestamp: quote.timestamp,
        volume_24h: quote.quote.USD.volume_24h,
      })),
    });
  }

  res.status(200).json({ success: true, data: { exchanges } });
});

exports.getExchangeByExId = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const resultMetadata = await exchangeMetadataFunction([id]);

  if (!resultMetadata.success) {
    return next(new ErrorHandler(resultMetadata.message, resultMetadata.code));
  }

  const resultQuoteLatest = await exchangeQuoteLatestFunction([id]);

  if (!resultQuoteLatest.success) {
    return next(
      new ErrorHandler(resultQuoteLatest.message, resultQuoteLatest.code)
    );
  }

  const {
    name,
    description,
    logo,
    urls: { fee, website, chat, twitter, blog },
  } = resultMetadata.data[id];

  const {
    quote: {
      USD: { volume_24h },
    },
  } = resultQuoteLatest.data[id];

  res
    .status(200)
    .json({
      success: true,
      data: {
        exchange: {
          name,
          description,
          logo,
          volume_24h,
          website,
          twitter,
          chat,
          fee,
          blog,
        },
      },
    });
});
