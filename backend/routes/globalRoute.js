const express = require('express');

const {
  getCommunityFollowerCount,
  searchTokens,
  listNewToken,
  getPositionList,
  getBlockchainList,
  getAssetTagList,
  getFeaturedTokens,
  addTopTokens,
  getTokenById,
  getTokenOverviewById,
  getTokenMarketsById,
  getTokenHistoricalDataById,
  voteTokenById,
  getTokenVoteById,
  unvoteTokenById,
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
  getTokenVoteByIdValidation,
  voteTokenByIdValidation,
  unvoteTokenByIdValidation,
} = require('../validations/globalValidation');

const validation = require('../middlewares/validation');

const router = express();
/**
 * Community
 */
//  Get the count of followers
router.route('/community/followers/count').get(getCommunityFollowerCount);
/**
 * Tokens
 */

//  Get Recommended Data (Crypto Count, Exchange Count, Total MarketCap, Total Volume 24h)
router.route('/recommend').get(getRecommendedData);
//  Search tokens
router.route('/tokens').get(searchTokens);

//  Get Featured Tokens (new tokens, volume_24h_change highest tokens, lowest tokens, 3 examples for each features)
router.route('/tokens/featured').get(getFeaturedTokens);

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
//  Get Token Vote Status By Id
router
  .route('/token/:id/vote')
  .get(...getTokenVoteByIdValidation, validation, getTokenVoteById);
//  Vote A Token By Id
router
  .route('/token/:id/up')
  .post(...voteTokenByIdValidation, validation, voteTokenById);
//  Unvote A Token By Id
router
  .route('/token/:id/down')
  .post(...unvoteTokenByIdValidation, validation, unvoteTokenById);

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
