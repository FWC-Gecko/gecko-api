const express = require('express');

const {
  searchTokens,
  getPositionList,
  getBlockchainList,
  getAssetTagList,
} = require('../controllers/globalController');

const router = express();

/**
 * Tokens
 */
//  Search tokens
router.route('/tokens').get(searchTokens);

/**
 * List new token
 */
//  Get position list
router.route('/listtoken/position').get(getPositionList);

//  Get blockchain list
router.route('/listtoken/blockchain').get(getBlockchainList);

//  Get crypto asset tag list
router.route('/listtoken/assettag').get(getAssetTagList);

module.exports = router;
