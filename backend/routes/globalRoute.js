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
} = require('../controllers/globalController');

const {
  listNewTokenValidation,
  getTokenByIdValidation,
} = require('../validations/globalValidation');

const validation = require('../middlewares/validation');

const router = express();

/**
 * Tokens
 */
//  Search tokens
router.route('/tokens').get(searchTokens);

//  Get Trending Tokens (3 examples)
router.route('/tokens/trending').get(getTrendingTokens);
//  Get New Tokens (3 examples)
router.route('/tokens/new').get(getNewTokens);
//  Add Top Tokens (100 examples)
router.route('/tokens/add').post(addTopTokens);

//  Get A Token By Id
router
  .route('/token/:id')
  .get(...getTokenByIdValidation, validation, getTokenById);

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
