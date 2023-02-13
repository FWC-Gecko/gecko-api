const express = require('express');

const {
  followCommunity,
  unfollowCommunity,
  getWatchlist,
  addWatchlist,
  deleteWatchlist,
  addPost,
  repostById,
  addCommentById,
  likePostById,
  dislikePostById,
} = require('../controllers/customerController');

const {
  getWatchlistValidation,
  addWatchlistValidation,
  deleteWatchlistValidation,
  addPostValidation,
  repostByIdValidation,
  addCommentByIdValidation,
  likePostByIdValidation,
  dislikePostByIdValidation,
} = require('../validations/customerValidation');

const validation = require('../middlewares/validation');
const { isAuthenticated, isCustomer } = require('../middlewares/auth');

const router = express();

/**
 * Customer
 */
router
  .route('/community/follow')
  .post(isAuthenticated, isCustomer, followCommunity);
router
  .route('/community/unfollow')
  .post(isAuthenticated, isCustomer, unfollowCommunity);
/**
 * Post
 */
//  Add New Post
router
  .route('/posts/add')
  .post(isAuthenticated, isCustomer, ...addPostValidation, validation, addPost);
//  Repost By Id
router
  .route('/post/:id/repost')
  .post(
    isAuthenticated,
    isCustomer,
    ...repostByIdValidation,
    validation,
    repostById
  );
//  Add Comment To The Post By Id
router
  .route('/post/:id/comment/add')
  .post(
    isAuthenticated,
    isCustomer,
    ...addCommentByIdValidation,
    validation,
    addCommentById
  );
//  Like The Post By Id
router
  .route('/post/:id/like')
  .post(
    isAuthenticated,
    isCustomer,
    ...likePostByIdValidation,
    validation,
    likePostById
  );
//  Dislike The Post By Id
router
  .route('/post/:id/dislike')
  .post(
    isAuthenticated,
    isCustomer,
    ...dislikePostByIdValidation,
    validation,
    dislikePostById
  );
/**
 * Watchlist
 */
router
  .route('/watchlist/token/:id')
  // Check if the token is in the customer's watchlist
  .get(
    isAuthenticated,
    isCustomer,
    ...getWatchlistValidation,
    validation,
    getWatchlist
  )
  //  Add a token id to the customer's watchlist
  .put(
    isAuthenticated,
    isCustomer,
    ...addWatchlistValidation,
    validation,
    addWatchlist
  )
  //  Delete a token id from the customer's watchlist
  .delete(
    isAuthenticated,
    isCustomer,
    ...deleteWatchlistValidation,
    validation,
    deleteWatchlist
  );

module.exports = router;
