const axios = require('axios');

const {
  QUOTE_HOSTORICAL_URL,
  QUOTE_LATEST_URL,
  ID_MAP_URL,
  METADATA_URL,
  MARKET_PAIR_URL,
  OHLCV_HISTORICAL_URL,
  OHLCV_LATEST_URL,
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

const quoteLatestFunction = async (ids) =>
  await axiosFunction(QUOTE_LATEST_URL, { id: ids.join(',') });

const IDMapFunction = async () =>
  await axiosFunction(ID_MAP_URL, { limit: 200, sort: 'cmc_rank' });

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
};
