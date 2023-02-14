const { body, param } = require('express-validator');

const searchCustomersValidation = [];
const getCustomerByIdValidation = [];
const deleteCustomerByIdValidation = [];
const getTokenByIdValidation = [];
const updateTokenByIdValidation = [];
const deleteTokenByIdValidation = [];
const searchInReviewTokensValidation = [];
const searchPendingTokensValidation = [];
const searchActiveTokensValidation = [];
const searchUpdateRequestedTokensValidation = [];
const approveInReviewTokenByIdValidation = [];
const refuseInReviewTokenByIdValidation = [];
const approvePendingTokenByIdValidation = [];
const refusePendingTokenByIdValidation = [];
const approveUpdateRequestedTokenByIdValidation = [];
const refuseUpdateRequestedTokenByIdValidation = [];
const searchPostsValidation = [];
const getPostByIdValidation = [];
const updatePostByIdValidation = [];
const deletePostByIdValidation = [];
const searchNewsValidation = [];
const addNewsValidation = [];
const getNewsByIdValidation = [];
const updateNewsByIdValidation = [];
const deleteNewsByIdValidation = [];

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
