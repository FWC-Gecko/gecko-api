const axios = require('axios');

const {
  QUOTE_HOSTORICAL_URL,
  QUOTE_LATEST_URL,
  CRYPTO_MAP_URL,
  METADATA_URL,
  MARKET_PAIR_URL,
  OHLCV_HISTORICAL_URL,
  OHLCV_LATEST_URL,
  EXCHANGE_MAP_URL,
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

const quoteHistoricalFunction = async (ids, timeStart, timeEnd, interval) =>
  await axiosFunction(QUOTE_HOSTORICAL_URL, {
    id: ids.join(','),
    time_start: timeStart,
    time_end: timeEnd,
    interval,
  });

const quoteLatestFunction = async (ids, convertIds = []) => {
  let params = { id: ids.join(',') };
  if (convertIds.length) params.convert_id = convertIds.join(',');
  return await axiosFunction(QUOTE_LATEST_URL, params);
};

const IDMapFunction = async () =>
  await axiosFunction(CRYPTO_MAP_URL, { limit: 200, sort: 'cmc_rank' });

const exchangeMapFunction = async () =>
  await axiosFunction(EXCHANGE_MAP_URL, { limit: 20, sort: 'volume_24h' });

const metadataFunction = async (ids) =>
  await axiosFunction(METADATA_URL, { id: ids.join(',') });

const marketPairFunction = async (id) =>
  await axiosFunction(MARKET_PAIR_URL, { id });

const ohlcvHistoricalFunction = async (id) =>
  await axiosFunction(OHLCV_HISTORICAL_URL, { id });

const ohlcvLatestFunction = async (ids) =>
  await axiosFunction(OHLCV_LATEST_URL, { id: ids.join(',') });

module.exports = {
  quoteHistoricalFunction,
  quoteLatestFunction,
  IDMapFunction,
  metadataFunction,
  marketPairFunction,
  ohlcvHistoricalFunction,
  ohlcvLatestFunction,
  exchangeMapFunction,
};
