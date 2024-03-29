const mongoose = require('mongoose');

const catchAsync = require('../middlewares/catchAsync');

const Token = require('../models/tokenModel');
const User = require('../models/userModel');
const Post = require('../models/postModel');
const Comment = require('../models/commentModel');
const Request = require('../models/requestModel');
const Wallet = require('../models/walletModel');

const ErrorHandler = require('../utils/errorHandler');
const gasPrice = require('../utils/gasPrice');
const createWallet = require('../utils/createWallet');

const {
  Position,
  Blockchain,
  AssetTag,
  TokenStatus,
  UpdateRequest,
  Market,
} = require('../constants/enum');
const {
  ID_BTC,
  ID_ETH,
  ID_USD,
  ID_FWC,
  ID_FWCL,
  ID_BNB,
  ID_BUSD,
  ID_USDT,
} = require('../constants/tokenId');

const {
  tokenQuoteHistoricalFunction,
  tokenQuoteLatestFunction,
  tokenMapFunction,
  tokenMetadataFunction,
  tokenMarketPairLatestFunction,
  ohlcvHistoricalFunction,
  ohlcvLatestFunction,
  exchangeMapFunction,
  exchangeMetadataFunction,
  exchangeQuoteHistoricalFunction,
  exchangeListingsLatestFunction,
  exchangeQuoteLatestFunction,
  exchangeMarketPairLatestFunction,
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

exports.getCommunityFollowerCount = catchAsync(async (req, res, next) => {
  const count = await User.aggregate([
    { $match: { communityFollow: true } },
    { $count: 'follower_count' },
  ]);

  res.status(200).json({
    success: true,
    data: {
      count: count.length ? count[0].follower_count : 0,
    },
  });
});

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
  let btcMarketCap = 0;
  let ethMarketCap = 0;
  for (const ID of IDs) {
    if (ID === ID_BTC)
      btcMarketCap = resultQuotes.data[ID].quote.USD.market_cap;
    else if (ID === ID_ETH)
      ethMarketCap = resultQuotes.data[ID].quote.USD.market_cap;

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
      dominanceBTC: (btcMarketCap / totalMarketCap) * 100,
      dominanceETH: (ethMarketCap / totalMarketCap) * 100,
      gasPrice: await gasPrice(), //  Gas Price
    },
  });
});

exports.searchTokens = catchAsync(async (req, res, next) => {
  const { count, search } = req.query;

  let page = Number(req.query.page);

  //  Get all token list
  const allTokens = await Token.find({
    status: 'Active',
    $or: [
      { name: { $regex: search, $options: 'i' } },
      { symbol: { $regex: search, $options: 'i' } },
    ],
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

exports.getAllTokensForHeatmap = catchAsync(async (req, res, next) => {
  const tokens = await Token.find({ status: TokenStatus.Active });

  const IDs = tokens.map((token) => token.ID);
  const len = IDs.length;

  let result = [];

  if (IDs.length) {
    const { success, data, code, message } = await tokenQuoteLatestFunction(
      IDs
    );

    if (!success) {
      return next(new ErrorHandler(message, code));
    }

    let totalMarketCap = 0;

    for (let i = 0; i < len; i++) {
      result.push({
        _id: tokens[i]._id,
        symbol: tokens[i].symbol,
        price: data[IDs[i]].quote.USD.price,
        percent_change_24h: data[IDs[i]].quote.USD.percent_change_24h,
        market_cap: data[IDs[i]].quote.USD.market_cap,
      });
      totalMarketCap += data[IDs[i]].quote.USD.market_cap;
    }

    //  Add Dominance
    for (let i = 0; i < len; i++) {
      result[i].dominance = (result[i].market_cap / totalMarketCap) * 100;
    }
  }

  res.status(200).json({
    success: true,
    data: {
      tokens: result,
    },
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

exports.getFeaturedTokens = catchAsync(async (req, res, next) => {
  let trendingTokens = [];
  let newTokens = [];
  let highestTokens = [];
  let lowestTokens = [];

  const tokens = JSON.parse(
    JSON.stringify(
      await Token.aggregate([
        {
          $match: {
            status: TokenStatus.Active,
          },
        },
        {
          $project: {
            ID: '$ID',
            name: '$name',
            symbol: '$symbol',
            logo: '$logo',
            watchlist: { $size: { $ifNull: ['$watchlist', []] } },
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
      ])
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
      tokens[i].percent_change_24h = data[IDs[i]].quote.USD.percent_change_24h;
    }

    newTokens = tokens.slice(0, 3);

    //  Sort By percent_change_24h accordingly
    tokens.sort((a, b) => {
      if (a.percent_change_24h >= b.percent_change_24h) return 1;
      else if (a.percent_change_24h < b.percent_change_24h) return -1;
      return 0;
    });

    lowestTokens = tokens.slice(0, 3);
    highestTokens = tokens.slice(-3).reverse();

    //  Sort By Watchlist Count descendingly
    tokens.sort((a, b) => {
      if (a.watchlist <= b.watchlist) return 1;
      else if (a.watchlist > b.watchlist) return -1;
      return 0;
    });

    trendingTokens = tokens.slice(0, 3);
  }

  res.status(200).json({
    success: true,
    data: { trendingTokens, newTokens, lowestTokens, highestTokens },
  });
});

exports.listNewToken = catchAsync(async (req, res, next) => {
  const tokenValues = { ...req.body };

  tokenValues.userPosition = Position[tokenValues.userPosition];
  tokenValues.cryptoAssetTags = tokenValues.cryptoAssetTags.split(',');

  if (tokenValues.explorer && tokenValues.explorer.length)
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
      //  Set Interval
      if (timeEnd - timeStart <= 60 * 60 * 24 * 7) {
        //  7 Days
        interval = '5m';
      } else if (timeEnd - timeStart <= 60 * 60 * 24 * 30) {
        //  1 Month
        interval = '15m';
      } else if (timeEnd - timeStart <= 60 * 60 * 24 * 90) {
        //  3 Months
        interval = '1h';
      } else if (timeEnd - timeStart <= 60 * 60 * 24 * 365) {
        //  1 Year
        interval = '3h';
      }

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

  const { success, data, message, code } = await tokenMarketPairLatestFunction(
    token.ID
  );

  if (!success) {
    return next(new ErrorHandler(message, code));
  }

  const marketPairs = data.market_pairs;
  const marketIDs = marketPairs.map((market) => market.exchange.id);

  const resultMetadata = await exchangeMetadataFunction(marketIDs);

  if (!resultMetadata.success) {
    return next(new ErrorHandler(resultMetadata.message, resultMetadata.code));
  }

  //  Seperated By Category (spot, derivatives, futures)

  const result = { spot: [], perpetual: [], futures: [] };

  for (const marketPair of marketPairs) {
    const { category, market_pair, quote, exchange } = marketPair;

    if (category === 'spot') {
      result['spot'].push({
        logo: resultMetadata.data[exchange.id].logo,
        source: exchange.name,
        pairs: market_pair,
        price: quote.USD.price,
        volume_24h: quote.USD.volume_24h,
        depth_negative_two: quote.USD.depth_negative_two,
        depth_positive_two: quote.USD.depth_positive_two,
      });
    } else if (category === 'derivatives') {
      result['perpetual'].push({
        logo: resultMetadata.data[exchange.id].logo,
        source: exchange.name,
        pairs: market_pair,
        price: quote.USD.price,
        volume_24h: quote.USD.volume_24h,
      });
    } else if (category === 'futures') {
      result['futures'].push({
        logo: resultMetadata.data[exchange.id].logo,
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
  const resultListingsLatest = await exchangeListingsLatestFunction('spot');
  if (!resultListingsLatest.success) {
    return next(
      new ErrorHandler(resultListingsLatest.message, resultListingsLatest.code)
    );
  }

  let listings = [];

  //  Extract Spot Exchanges
  for (const exchange of resultListingsLatest.data) {
    if (
      exchange.num_market_pairs != -1 &&
      exchange.quote.USD.effective_liquidity_24h != null
    ) {
      listings.push(exchange);
    }
    if (listings.length === 20) break;
  }

  const IDs = listings.map((exchange) => exchange.id);

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

  for (const exchange of listings) {
    exchanges.push({
      id: exchange.id,
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
  const { exchangeId } = req.params;

  const resultMetadata = await exchangeMetadataFunction([exchangeId]);

  if (!resultMetadata.success) {
    return next(new ErrorHandler(resultMetadata.message, resultMetadata.code));
  }

  const resultQuoteLatest = await exchangeQuoteLatestFunction([exchangeId]);

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
  } = resultMetadata.data[exchangeId];

  const { quote } = resultQuoteLatest.data[exchangeId];

  res.status(200).json({
    success: true,
    data: {
      exchange: {
        name,
        description,
        logo,
        volume_24h_btc: quote['1'].volume_24h,
        volume_24h_usd: quote['2781'].volume_24h,
        website,
        twitter,
        chat,
        fee,
        blog,
      },
    },
  });
});

exports.getMarketsOfExchangeByExId = catchAsync(async (req, res, next) => {
  const { exchangeId } = req.params;

  const { success, data, message, code } =
    await exchangeMarketPairLatestFunction(exchangeId);

  if (!success) {
    return next(new ErrorHandler(message, code));
  }

  let pairs = [];

  for (const pair of data.market_pairs) {
    if (
      pair.category === 'spot' ||
      pair.category === 'perpetual' ||
      pair.category === 'futures'
    )
      pairs.push(pair);
  }
  //  Get Token IDs
  let currencyIDs = [];

  for (const pair of pairs) {
    if (!currencyIDs.includes(pair.market_pair_base.currency_id))
      currencyIDs.push(pair.market_pair_base.currency_id);
  }

  const len = currencyIDs.length;

  const resultTokenMetadata = await tokenMetadataFunction(currencyIDs);

  if (!resultTokenMetadata.success) {
    return next(
      new ErrorHandler(resultTokenMetadata.message, resultTokenMetadata.code)
    );
  }

  //  Map with logo
  for (let i = 0; i < len; i++) {
    pairs[i].logo = resultTokenMetadata.data[currencyIDs[i]].logo;
  }

  //  Map By Category
  const result = { spot: [], perpetual: [], futures: [] };
  for (const pair of pairs) {
    if (
      pair.category === 'spot' ||
      pair.category === 'perpetual' ||
      pair.category === 'futures'
    )
      result[pair.category].push(pair);
  }

  res.status(200).json({
    success: true,
    data: {
      pairs: result,
    },
  });
});

exports.voteTokenById = catchAsync(async (req, res, next) => {
  const token = await Token.findById(req.params.id);

  if (!token) {
    return next(new ErrorHandler('Token Not Found'), 404);
  }

  const today = getFormattedDate(new Date());

  //  Initialize with today
  if (!token.vote) token.vote = {};
  if (!Object.prototype.hasOwnProperty.call(token.vote, today))
    token.vote[today] = { up: 0, down: 0 };

  //  Increment up vote
  token.vote = {
    ...token.vote,
    [today]: { ...token.vote[today], up: token.vote[today].up + 1 },
  };

  await token.save();

  const upPercent =
    (token.vote[today].up / (token.vote[today].up + token.vote[today].down)) *
    100;
  const downPercent = 100 - upPercent;

  res.status(200).json({
    success: true,
    data: {
      vote: {
        timestamp: new Date(),
        ...token.vote[today],
        upPercent,
        downPercent,
      },
    },
  });
});

exports.unvoteTokenById = catchAsync(async (req, res, next) => {
  const token = await Token.findById(req.params.id);

  if (!token) {
    return next(new ErrorHandler('Token Not Found'), 404);
  }

  const today = getFormattedDate(new Date());

  //  Initialize with today
  if (!token.vote) token.vote = {};
  if (!Object.prototype.hasOwnProperty.call(token.vote, today))
    token.vote[today] = { up: 0, down: 0 };

  //  Increment down vote
  token.vote = {
    ...token.vote,
    [today]: { ...token.vote[today], down: token.vote[today].down + 1 },
  };

  await token.save();

  const upPercent =
    (token.vote[today].up / (token.vote[today].up + token.vote[today].down)) *
    100;
  const downPercent = 100 - upPercent;

  res.status(200).json({
    success: true,
    data: {
      vote: {
        timestamp: new Date(),
        ...token.vote[today],
        upPercent,
        downPercent,
      },
    },
  });
});

exports.getTokenVoteById = catchAsync(async (req, res, next) => {
  const token = await Token.findById(req.params.id);

  if (!token) {
    return next(new ErrorHandler('Token Not Found'), 404);
  }

  const today = getFormattedDate(new Date());

  //  Initialize with today
  if (!token.vote || !Object.prototype.hasOwnProperty.call(token.vote, today)) {
    return res.status(200).json({
      success: true,
      data: {
        vote: {
          timestamp: new Date(),
          up: 0,
          down: 0,
          upPercent: 0,
          downPercent: 0,
        },
      },
    });
  }

  const upPercent =
    (token.vote[today].up / (token.vote[today].up + token.vote[today].down)) *
    100;
  const downPercent = 100 - upPercent;

  res.status(200).json({
    success: true,
    data: {
      vote: {
        timestamp: new Date(),
        ...token.vote[today],
        upPercent,
        downPercent,
      },
    },
  });
});

exports.getTopPosts = catchAsync(async (req, res, next) => {
  const posts = await Post.aggregate([
    {
      $project: {
        text: '$text',
        createdAt: '$createdAt',
        likes: { $size: '$likes' },
        comments: { $size: '$comments' },
        reposts: { $size: '$reposts' },
        customer: { $toObjectId: '$customer' },
      },
    },
    {
      $sort: {
        likes: -1,
      },
    },
    {
      $limit: 10,
    },
  ]);

  await User.populate(posts, {
    path: 'customer',
    select: { userName: 1, avatar: 1 },
  });

  res.status(200).json({
    success: true,
    data: { posts },
  });
});

exports.getLatestPosts = catchAsync(async (req, res, next) => {
  //  Get 10 posts
  const posts = await Post.aggregate([
    {
      $project: {
        text: '$text',
        createdAt: '$createdAt',
        likes: { $size: '$likes' },
        comments: { $size: '$comments' },
        reposts: { $size: '$reposts' },
        customer: { $toObjectId: '$customer' },
      },
    },
    {
      $limit: 10,
    },
  ]);

  await User.populate(posts, {
    path: 'customer',
    select: { userName: 1, avatar: 1 },
  });

  res.status(200).json({
    success: true,
    data: { posts },
  });
});

exports.getPostById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const post = await Post.aggregate([
    {
      $match: {
        _id: mongoose.Types.ObjectId(id),
      },
    },
    {
      $project: {
        text: '$text',
        createdAt: '$createdAt',
        likesLen: { $size: '$likes' },
        commentsLen: { $size: '$comments' },
        repostsLen: { $size: '$reposts' },
        comments: '$comments',
        reposts: '$reposts',
        customer: { $toObjectId: '$customer' },
      },
    },
  ]);

  await User.populate(post, {
    path: 'customer',
    select: { userName: 1, avatar: 1 },
  });

  await Comment.populate(post, { path: 'comments' });

  await Post.populate(post, { path: 'reposts' });

  if (!post.length) {
    return next(new ErrorHandler('Post Not Found', 404));
  }

  res.status(200).json({
    success: true,
    data: { post: post[0] },
  });
});

exports.getRequestTypes = catchAsync(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: {
      requestTypes: UpdateRequest.map(
        (request, index) => `${index + 1} - ${request}`
      ),
    },
  });
});

exports.getMarketTypes = catchAsync(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: {
      marketTypes: Market,
    },
  });
});

exports.submitRequest = catchAsync(async (req, res, next) => {
  const {
    type,
    email,
    subject,
    market,
    url,
    description,
    address,
    paymentToken,
  } = req.body;

  //  If the type is "Add market/pair"
  if (type === 0 && (!market || market < 0 || market > Market.length)) {
    return next(new ErrorHandler('Market Not Existed Or Out Of Range', 400));
  }

  const wallet = await Wallet.findOne({ address });

  if (!wallet) {
    return next(new ErrorHandler('Wallet Not Found', 404));
  }

  const request = new Request(
    type === 0
      ? {
          type,
          email,
          subject,
          market,
          url,
          description,
          wallet,
          paymentToken,
        }
      : {
          type,
          email,
          subject,
          url,
          description,
          wallet,
          paymentToken,
        }
  );

  await request.save();

  res.status(200).json({
    success: true,
  });
});

exports.getNewWallet = catchAsync(async (req, res, next) => {
  const { address, privateKey } = createWallet();

  const { success, data, code, message } = await tokenQuoteLatestFunction(
    [ID_BNB],
    [ID_BUSD, ID_USDT, ID_FWC]
  );

  if (!success) {
    return next(new ErrorHandler(message, code));
  }

  const BNBAmount = 0.1; //  BNB
  const BNBFee = Number(process.env.TRANSACTION_FEE);

  const price = {
    BNB: BNBAmount + BNBFee,
    BUSD: data[ID_BNB].quote[ID_BUSD].price * (BNBAmount + BNBFee),
    USDT: data[ID_BNB].quote[ID_USDT].price * (BNBAmount + BNBFee),
    FWC: data[ID_BNB].quote[ID_FWC].price * (BNBAmount + BNBFee),
  };

  const wallet = new Wallet({
    address,
    privateKey,
    price,
  });

  await wallet.save();

  res.status(200).json({
    success: true,
    data: {
      address,
      price,
    },
  });
});
