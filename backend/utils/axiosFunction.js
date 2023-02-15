const axios = require('axios');

const {
  TOKEN_QUOTE_HISTORICAL_URL,
  TOKEN_QUOTE_LATEST_URL,
  TOKEN_MAP_URL,
  TOKEN_METADATA_URL,
  TOKEN_MARKET_PAIR_LATEST_URL,
  OHLCV_HISTORICAL_URL,
  OHLCV_LATEST_URL,
  EXCHANGE_MAP_URL,
  EXCHANGE_METADATA_URL,
  EXCHANGE_QUOTE_HISTORICAL_URL,
  EXCHANGE_QUOTE_LATEST_URL,
  EXCHANGE_LISTINGS_LATEST,
  EXCHANGE_MARKET_PAIR_LATEST_URL,
} = require('../config/url');

const axiosFunction = async (url, params) => {
  const result = await axios.get(url, {
    params,
    headers: { 'X-CMC_PRO_API_KEY': process.env.CMC_PRO_API_KEY },
  });
  const { status, data } = result.data;
  return status.error_code === 0
    ? { success: true, data }
    : {
        success: false,
        code: status.error_code,
        message: status.error_message,
      };
};

const tokenQuoteHistoricalFunction = async (
  ids,
  timeStart,
  timeEnd,
  interval
) =>
  await axiosFunction(TOKEN_QUOTE_HISTORICAL_URL, {
    id: ids.join(','),
    time_start: timeStart,
    time_end: timeEnd,
    interval,
  });

const tokenQuoteLatestFunction = async (ids, convertIds = []) => {
  let params = { id: ids.join(',') };
  if (convertIds.length) params.convert_id = convertIds.join(',');
  return await axiosFunction(TOKEN_QUOTE_LATEST_URL, params);
};

const tokenMapFunction = async () =>
  await axiosFunction(TOKEN_MAP_URL, { limit: 200, sort: 'cmc_rank' });

const tokenMetadataFunction = async (ids) =>
  await axiosFunction(TOKEN_METADATA_URL, { id: ids.join(',') });

const tokenMarketPairLatestFunction = async (id) =>
  await axiosFunction(TOKEN_MARKET_PAIR_LATEST_URL, { id });

const exchangeMapFunction = async () =>
  await axiosFunction(EXCHANGE_MAP_URL, { limit: 20, sort: 'volume_24h' });

const exchangeMetadataFunction = async (ids) =>
  await axiosFunction(EXCHANGE_METADATA_URL, { id: ids.join(',') });

const exchangeQuoteHistoricalFunction = async (
  ids,
  timeStart,
  timeEnd,
  interval
) =>
  await axiosFunction(EXCHANGE_QUOTE_HISTORICAL_URL, {
    id: ids.join(','),
    time_start: timeStart,
    time_end: timeEnd,
    interval,
  });

const exchangeListingsLatestFunction = async (category) =>
  await axiosFunction(EXCHANGE_LISTINGS_LATEST, {
    sort: 'exchange_score',
    category,
  });

const exchangeQuoteLatestFunction = async (ids) =>
  await axiosFunction(EXCHANGE_QUOTE_LATEST_URL, {
    id: ids.join(','),
    convert_id: '1,2781', //  BTC, USD
  });

const exchangeMarketPairLatestFunction = async (id) =>
  await axiosFunction(EXCHANGE_MARKET_PAIR_LATEST_URL, {
    id,
    aux: 'category',
    limit: 5000,
  });

const ohlcvHistoricalFunction = async (id) =>
  await axiosFunction(OHLCV_HISTORICAL_URL, { id, count: 21 });

const ohlcvLatestFunction = async (ids) =>
  await axiosFunction(OHLCV_LATEST_URL, { id: ids.join(',') });

module.exports = {
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
};
