const axios = require('axios');

const { QUOTE_HOSTORICAL_URL, QUOTE_LATEST_URL } = require('../config/url');

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

const quoteHistoricalFunction = async (ids) =>
  await axiosFunction(QUOTE_HOSTORICAL_URL, {
    id: ids.join(','),
    time_start: Math.floor(Date.now() / 1000 - 60 * 60 * 24 * 7), //  Last 7 days
    time_end: Math.floor(Date.now() / 1000),
    interval: '6h',
  });

const quoteLatestFunction = async (ids) =>
  await axiosFunction(QUOTE_LATEST_URL, { id: ids.join(',') });

module.exports = { quoteHistoricalFunction, quoteLatestFunction };
