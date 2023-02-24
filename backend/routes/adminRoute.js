const express = require('express');

const { isAuthenticated, isAdmin } = require('../middlewares/auth');
const validation = require('../middlewares/validation');

const { uploadLogo } = require('../utils/awsFunctions');

const {
  searchCustomers,
  getCustomerById,
  deleteCustomerById,
  getTokenById,
  updateTokenById,
  deleteTokenById,
  searchTokens,
  approveInReviewTokenById,
  refuseInReviewTokenById,
  recoverRefusedTokenToInReviewById,
  approvePendingTokenById,
  refusePendingTokenById,
  recoverRefusedTokenToPendingById,
  getTokenUpdateRequests,
  getTokenUpdateRequestById,
  deleteTokenUpdateRequestById,
  searchPosts,
  getPostById,
  updatePostById,
  deletePostById,
  searchNews,
  addNews,
  getNewsById,
  updateNewsById,
  deleteNewsById,
} = require('../controllers/adminController');

const {
  searchCustomersValidation,
  getCustomerByIdValidation,
  deleteCustomerByIdValidation,
  getTokenByIdValidation,
  updateTokenByIdValidation,
  deleteTokenByIdValidation,
  searchTokensValidation,
  approveInReviewTokenByIdValidation,
  refuseInReviewTokenByIdValidation,
  recoverRefusedTokenToInReviewByIdValidation,
  approvePendingTokenByIdValidation,
  refusePendingTokenByIdValidation,
  recoverRefusedTokenToPendingByIdValidation,
  getTokenUpdateRequestByIdValidation,
  deleteTokenUpdateRequestByIdValidation,
  searchPostsValidation,
  getPostByIdValidation,
  updatePostByIdValidation,
  deletePostByIdValidation,
  searchNewsValidation,
  addNewsValidation,
  getNewsByIdValidation,
  updateNewsByIdValidation,
  deleteNewsByIdValidation,
} = require('../validations/adminValidation');

const router = express();

/**
 * Customer
 */
//  Search Customers
router
  .route('/customers')
  .get(
    isAuthenticated,
    isAdmin,
    ...searchCustomersValidation,
    validation,
    searchCustomers
  );

router
  .route('/customer/:id')
  //  Get Customer By Id
  .get(
    isAuthenticated,
    isAdmin,
    ...getCustomerByIdValidation,
    validation,
    getCustomerById
  )
  //  Delete Customer By Id
  .delete(
    isAuthenticated,
    isAdmin,
    ...deleteCustomerByIdValidation,
    validation,
    deleteCustomerById
  );

/**
 * Token
 */
router
  .route('/token/:id')
  //  Get Token By Id
  .get(
    isAuthenticated,
    isAdmin,
    ...getTokenByIdValidation,
    validation,
    getTokenById
  )
  //  Update Token By Id
  .put(
    isAuthenticated,
    isAdmin,
    uploadLogo.single('logo'),
    ...updateTokenByIdValidation,
    validation,
    updateTokenById
  )
  //  Delete Token By Id
  .delete(
    isAuthenticated,
    isAdmin,
    ...deleteTokenByIdValidation,
    validation,
    deleteTokenById
  );

//  Search Tokens
router
  .route('/tokens')
  .get(
    isAuthenticated,
    isAdmin,
    ...searchTokensValidation,
    validation,
    searchTokens
  );

//  Approve "In Review" Token
router
  .route('/token/:id/in_review/approve')
  .post(
    isAuthenticated,
    isAdmin,
    ...approveInReviewTokenByIdValidation,
    validation,
    approveInReviewTokenById
  );
//  Refuse "In Review" Token
router
  .route('/token/:id/in_review/refuse')
  .post(
    isAuthenticated,
    isAdmin,
    ...refuseInReviewTokenByIdValidation,
    validation,
    refuseInReviewTokenById
  );
//  Approve "Pending" Token
router
  .route('/token/:id/pending/approve')
  .post(
    isAuthenticated,
    isAdmin,
    ...approvePendingTokenByIdValidation,
    validation,
    approvePendingTokenById
  );
//  Refuse "Pending" Token
router
  .route('/token/:id/pending/refuse')
  .post(
    isAuthenticated,
    isAdmin,
    ...refusePendingTokenByIdValidation,
    validation,
    refusePendingTokenById
  );
//  Recover "Refused" Token To "In Review"
router
  .route('/token/:id/in_review_refused/recover')
  .post(
    isAuthenticated,
    isAdmin,
    ...recoverRefusedTokenToInReviewByIdValidation,
    validation,
    recoverRefusedTokenToInReviewById
  );
//  Recover "Refused" Token To "Pending"
router
  .route('/token/:id/pending_refused/recover')
  .post(
    isAuthenticated,
    isAdmin,
    ...recoverRefusedTokenToPendingByIdValidation,
    validation,
    recoverRefusedTokenToPendingById
  );
//  Search Listed Token Update Requests
router
  .route('/update_requests')
  .get(isAuthenticated, isAdmin, getTokenUpdateRequests);

router
  .route('/update_requests/:id')
  //  Get Update Request By Id
  .get(
    isAuthenticated,
    isAdmin,
    ...getTokenUpdateRequestByIdValidation,
    validation,
    getTokenUpdateRequestById
  )
  //  Delete Update Request By Id
  .delete(
    isAuthenticated,
    isAdmin,
    ...deleteTokenUpdateRequestByIdValidation,
    validation,
    deleteTokenUpdateRequestById
  );
/**
 * Post
 */
//  Search Posts
router
  .route('/posts')
  .get(
    isAuthenticated,
    isAdmin,
    ...searchPostsValidation,
    validation,
    searchPosts
  );

router
  .route('/post/:id')
  //  Get Post By Id
  .get(
    isAuthenticated,
    isAdmin,
    ...getPostByIdValidation,
    validation,
    getPostById
  )
  //  Update Post By Id
  .put(
    isAuthenticated,
    isAdmin,
    ...updatePostByIdValidation,
    validation,
    updatePostById
  )
  //  Delete Post By Id
  .delete(
    isAuthenticated,
    isAdmin,
    ...deletePostByIdValidation,
    validation,
    deletePostById
  );
/**
 * News
 */
//  Search News
router
  .route('/news')
  .get(
    isAuthenticated,
    isAdmin,
    ...searchNewsValidation,
    validation,
    searchNews
  );
//  Add News
router
  .route('/news/add')
  .post(isAuthenticated, isAdmin, ...addNewsValidation, validation, addNews);
router
  .route('/news/:id') //  Get News By Id
  .get(
    isAuthenticated,
    isAdmin,
    ...getNewsByIdValidation,
    validation,
    getNewsById
  )
  //  Update News By Id
  .put(
    isAuthenticated,
    isAdmin,
    ...updateNewsByIdValidation,
    validation,
    updateNewsById
  )
  //  Delete News By Id
  .delete(
    isAuthenticated,
    isAdmin,
    ...deleteNewsByIdValidation,
    validation,
    deleteNewsById
  );

module.exports = router;
