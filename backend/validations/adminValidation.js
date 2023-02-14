const { body, param, query } = require('express-validator');

//  Unit Validation
const paramIdValidation = [
  param('id')
    .exists()
    .withMessage('Not Existed')
    .bail()
    .isMongoId()
    .withMessage('Not Mongo ID'),
];

const queryNumberValidation = (name) => [
  query(name)
    .exists()
    .withMessage('Not Existed')
    .bail()
    .isInt({ min: 1 })
    .withMessage('Not Integer Or Out Of Range'),
];

//  Main Validation
const searchCustomersValidation = [
  ...queryNumberValidation('count'),
  ...queryNumberValidation('page'),
];
const getCustomerByIdValidation = paramIdValidation;
const deleteCustomerByIdValidation = paramIdValidation;
const getTokenByIdValidation = paramIdValidation;
const updateTokenByIdValidation = [];
const deleteTokenByIdValidation = paramIdValidation;
const searchInReviewTokensValidation = [
  ...queryNumberValidation('count'),
  ...queryNumberValidation('page'),
];
const searchPendingTokensValidation = [
  ...queryNumberValidation('count'),
  ...queryNumberValidation('page'),
];
const searchActiveTokensValidation = [
  ...queryNumberValidation('count'),
  ...queryNumberValidation('page'),
];
const searchUpdateRequestedTokensValidation = [
  ...queryNumberValidation('count'),
  ...queryNumberValidation('page'),
];
const approveInReviewTokenByIdValidation = [];
const refuseInReviewTokenByIdValidation = [];
const approvePendingTokenByIdValidation = [];
const refusePendingTokenByIdValidation = [];
const approveUpdateRequestedTokenByIdValidation = [];
const refuseUpdateRequestedTokenByIdValidation = [];
const searchPostsValidation = [];
const getPostByIdValidation = paramIdValidation;
const updatePostByIdValidation = [];
const deletePostByIdValidation = paramIdValidation;
const searchNewsValidation = [];
const addNewsValidation = [];
const getNewsByIdValidation = paramIdValidation;
const updateNewsByIdValidation = [];
const deleteNewsByIdValidation = paramIdValidation;

module.exports = {
  searchCustomersValidation,
  getCustomerByIdValidation,
  deleteCustomerByIdValidation,
  getTokenByIdValidation,
  updateTokenByIdValidation,
  deleteTokenByIdValidation,
  searchInReviewTokensValidation,
  searchPendingTokensValidation,
  searchActiveTokensValidation,
  searchUpdateRequestedTokensValidation,
  approveInReviewTokenByIdValidation,
  refuseInReviewTokenByIdValidation,
  approvePendingTokenByIdValidation,
  refusePendingTokenByIdValidation,
  approveUpdateRequestedTokenByIdValidation,
  refuseUpdateRequestedTokenByIdValidation,
  searchPostsValidation,
  getPostByIdValidation,
  updatePostByIdValidation,
  deletePostByIdValidation,
  searchNewsValidation,
  addNewsValidation,
  getNewsByIdValidation,
  updateNewsByIdValidation,
  deleteNewsByIdValidation,
};
