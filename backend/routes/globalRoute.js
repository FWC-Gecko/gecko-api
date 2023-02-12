const express = require('express');

const {
  searchTokens,
  listNewToken,
  getPositionList,
  getBlockchainList,
  getAssetTagList,
  getTrendingTokens,
  getNewTokens,
  addTopTokens,
  getTokenById,
  getTokenOverviewById,
  getTokenMarketsById,
  getTokenHistoricalDataById,
  getRecommendedData,
  searchExchanges,
  getExchangeByExId,
} = require('../controllers/globalController');

const {
  listNewTokenValidation,
  getTokenByIdValidation,
  getTokenOverviewByIdValidation,
  getTokenMarketsByIdValidation,
  getTokenHistoricalDataByIdValidation,
  getExchangeByIdValidation,
} = require('../validations/globalValidation');

const validation = require('../middlewares/validation');

const router = express();

/**
 * Tokens
 */

//  Get Recommended Data (Crypto Count, Exchange Count, Total MarketCap, Total Volume 24h)
router.route('/recommend').get(getRecommendedData);
//  Search tokens
router.route('/tokens').get(searchTokens);

//  Get Trending Tokens (3 examples)
router.route('/tokens/trending').get(getTrendingTokens);
//  Get New Tokens (3 examples)
router.route('/tokens/new').get(getNewTokens);

//  ------------Should call this API at once, not over two times.---------------
//  Add Top Tokens (200 examples)
router.route('/tokens/add').post(addTopTokens);

//  Get A Token By Id
router
  .route('/token/:id')
  .get(...getTokenByIdValidation, validation, getTokenById);
//  Get A Token Overview By Id
router
  .route('/token/:id/overview')
  .get(...getTokenOverviewByIdValidation, validation, getTokenOverviewById);
//  Get markets
router
  .route('/token/:id/markets')
  .get(...getTokenMarketsByIdValidation, validation, getTokenMarketsById);
//  Get Historical Data
router
  .route('/token/:id/historicaldata')
  .get(
    ...getTokenHistoricalDataByIdValidation,
    validation,
    getTokenHistoricalDataById
  );

/**
 * Exchange Markets
 */
//  ------------Should call this API at once, not over two times.---------------
//  Search exchanges
router.route('/exchanges').get(searchExchanges);
//  Get An Exchange By Exchange Id
router
  .route('/exchange/:id')
  .get(...getExchangeByIdValidation, validation, getExchangeByExId);
/**
 * List new token
 */
//  List a new token
router
  .route('/listtoken/add')
  .post(...listNewTokenValidation, validation, listNewToken);
//  Get position list
router.route('/listtoken/positions').get(getPositionList);

//  Get blockchain list
router.route('/listtoken/blockchains').get(getBlockchainList);

//  Get crypto asset tag list
router.route('/listtoken/assettags').get(getAssetTagList);

module.exports = router;
