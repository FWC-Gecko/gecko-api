const express = require('express');

const {
  getCommunityFollowerCount,
  searchTokens,
  getAllTokensForHeatmap,
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
  getMarketsOfExchangeByExId,
  getTopPosts,
  getLatestPosts,
  getPostById,
  getRequestTypes,
  getMarketTypes,
  submitRequest,
  getNewWallet,
} = require('../controllers/globalController');

const {
  searchTokensValidation,
  listNewTokenValidation,
  getTokenByIdValidation,
  getTokenOverviewByIdValidation,
  getTokenMarketsByIdValidation,
  getTokenHistoricalDataByIdValidation,
  getExchangeByExIdValidation,
  getMarketsOfExchangeByExIdValidation,
  getTokenVoteByIdValidation,
  voteTokenByIdValidation,
  unvoteTokenByIdValidation,
  getPostByIdValidation,
  submitRequestValidation,
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
//  Search Tokens
router
  .route('/tokens')
  .get(...searchTokensValidation, validation, searchTokens);

//  Get All Tokens For Heatmap
router.route('/tokens/heatmap').get(getAllTokensForHeatmap);

//  Get Featured Tokens (trending tokens, new tokens, volume_24h_change highest tokens, lowest tokens, 3 examples for each features)
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
  .route('/exchange/:exchangeId')
  .get(...getExchangeByExIdValidation, validation, getExchangeByExId);
//  Get Markets By Exchange Id
router
  .route('/exchange/:exchangeId/markets')
  .get(
    ...getMarketsOfExchangeByExIdValidation,
    validation,
    getMarketsOfExchangeByExId
  );
/**
 * List new token
 */
//  List New Token
router
  .route('/listtoken/add')
  .post(...listNewTokenValidation, validation, listNewToken);
//  Get Position list
router.route('/listtoken/positions').get(getPositionList);

//  Get Blockchain list
router.route('/listtoken/blockchains').get(getBlockchainList);

//  Get Crypto Asset Tag list
router.route('/listtoken/assettags').get(getAssetTagList);

/**
 * Post
 */
//  Get Top Posts
router.route('/posts/top').get(getTopPosts);
//  Get Latest Posts
router.route('/posts/latest').get(getLatestPosts);
//  Get Post By Id
router
  .route('/post/:id')
  .get(...getPostByIdValidation, validation, getPostById);

/**
 *  Request For Update
 */
//  Get All Request Types
router.route('/request_types').get(getRequestTypes);

//  Get All Market Types
router.route('/market_types').get(getMarketTypes);

//  Submit A New Request
router
  .route('/request/submit')
  .post(...submitRequestValidation, validation, submitRequest);

//  Get A New Wallet & Price List(BNB -> BUSD, USDT, FWC)
router.route('/new_wallet').get(getNewWallet);

module.exports = router;
