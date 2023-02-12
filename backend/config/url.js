const BASE_URL = 'https://pro-api.coinmarketcap.com';
const CRYPTO_QUOTE_HOSTORICAL_URL = `${BASE_URL}/v2/cryptocurrency/quotes/historical`;
const CRYPTO_QUOTE_LATEST_URL = `${BASE_URL}/v2/cryptocurrency/quotes/latest`;
const CRYPTO_MAP_URL = `${BASE_URL}/v1/cryptocurrency/map`;
const CRYPTO_METADATA_URL = `${BASE_URL}/v2/cryptocurrency/info`;
const EXCHANGE_MAP_URL = `${BASE_URL}/v1/exchange/map`;
const EXCAHNGE_METADATA_URL = `${BASE_URL}/v1/exchange/info`;
const MARKET_PAIR_URL = `${BASE_URL}/v2/cryptocurrency/market-pairs/latest`;
const OHLCV_HISTORICAL_URL = `${BASE_URL}/v2/cryptocurrency/ohlcv/historical`;
const OHLCV_LATEST_URL = `${BASE_URL}/v2/cryptocurrency/ohlcv/latest`;

module.exports = {
  CRYPTO_QUOTE_HOSTORICAL_URL,
  CRYPTO_QUOTE_LATEST_URL,
  CRYPTO_MAP_URL,
  CRYPTO_METADATA_URL,
  MARKET_PAIR_URL,
  OHLCV_HISTORICAL_URL,
  OHLCV_LATEST_URL,
  EXCHANGE_MAP_URL,
  EXCAHNGE_METADATA_URL,
};
