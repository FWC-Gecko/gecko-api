const BASE_URL = 'https://pro-api.coinmarketcap.com';
const QUOTE_HOSTORICAL_URL = `${BASE_URL}/v2/cryptocurrency/quotes/historical`;
const QUOTE_LATEST_URL = `${BASE_URL}/v2/cryptocurrency/quotes/latest`;
const ID_MAP_URL = `${BASE_URL}/v1/cryptocurrency/map`;
const METADATA_URL = `${BASE_URL}/v2/cryptocurrency/info`;
const MARKET_PAIR_URL = `${BASE_URL}/v2/cryptocurrency/market-pairs/latest`;
const OHLCV_HISTORICAL_URL = `${BASE_URL}/v2/cryptocurrency/ohlcv/historical`;

module.exports = {
  QUOTE_HOSTORICAL_URL,
  QUOTE_LATEST_URL,
  ID_MAP_URL,
  METADATA_URL,
  MARKET_PAIR_URL,
  OHLCV_HISTORICAL_URL
};
