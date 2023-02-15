const BASE_URL = 'https://pro-api.coinmarketcap.com';
const TOKEN_QUOTE_HISTORICAL_URL = `${BASE_URL}/v2/cryptocurrency/quotes/historical`;
const TOKEN_QUOTE_LATEST_URL = `${BASE_URL}/v2/cryptocurrency/quotes/latest`;
const TOKEN_MAP_URL = `${BASE_URL}/v1/cryptocurrency/map`;
const TOKEN_METADATA_URL = `${BASE_URL}/v2/cryptocurrency/info`;
const TOKEN_MARKET_PAIR_LATEST_URL = `${BASE_URL}/v2/cryptocurrency/market-pairs/latest`;
const EXCHANGE_MAP_URL = `${BASE_URL}/v1/exchange/map`;
const EXCHANGE_METADATA_URL = `${BASE_URL}/v1/exchange/info`;
const EXCHANGE_QUOTE_HISTORICAL_URL = `${BASE_URL}/v1/exchange/quotes/historical`;
const EXCHANGE_QUOTE_LATEST_URL = `${BASE_URL}/v1/exchange/quotes/latest`;
const EXCHANGE_LISTINGS_LATEST = `${BASE_URL}/v1/exchange/listings/latest`;
const EXCHANGE_MARKET_PAIR_LATEST_URL = `${BASE_URL}/v1/exchange/market-pairs/latest`;
const OHLCV_HISTORICAL_URL = `${BASE_URL}/v2/cryptocurrency/ohlcv/historical`;
const OHLCV_LATEST_URL = `${BASE_URL}/v2/cryptocurrency/ohlcv/latest`;

module.exports = {
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
};
