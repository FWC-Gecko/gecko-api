const { body, param } = require('express-validator');

//  Unit Validation
const paramIdValidation = [
  param('id')
    .exists()
    .withMessage('Not Existed')
    .bail()
    .isMongoId()
    .withMessage('Not Mongo ID'),
];

// const queryNumberValidation = (name) => [
//   query(name)
//     .exists()
//     .withMessage('Not Existed')
//     .bail()
//     .isInt({ min: 1 })
//     .withMessage('Not Integer Or Out Of Range'),
// ];

const bodyTokenIdValidation = [
  body('tokenId')
    .exists()
    .withMessage('Not Existed')
    .bail()
    .isInt({ min: 0 })
    .withMessage('Not Integer Or Out Of Range'),
];

//  Main Validation
const searchCustomersValidation = [
  // ...queryNumberValidation('count'),
  // ...queryNumberValidation('page'),
];
const getCustomerByIdValidation = paramIdValidation;
const deleteCustomerByIdValidation = paramIdValidation;
const getTokenByIdValidation = paramIdValidation;
const updateTokenByIdValidation = [];
const deleteTokenByIdValidation = paramIdValidation;
const searchTokensValidation = [
  // ...queryNumberValidation('count'),
  // ...queryNumberValidation('page'),
];
const approveInReviewTokenByIdValidation = paramIdValidation;
const refuseInReviewTokenByIdValidation = paramIdValidation;
const approvePendingTokenByIdValidation = [
  ...paramIdValidation,
  ...bodyTokenIdValidation,
];
const refusePendingTokenByIdValidation = paramIdValidation;
const getTokenUpdateRequestByIdValidation = paramIdValidation;
const deleteTokenUpdateRequestByIdValidation = paramIdValidation;
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
  searchTokensValidation,
  approveInReviewTokenByIdValidation,
  refuseInReviewTokenByIdValidation,
  approvePendingTokenByIdValidation,
  refusePendingTokenByIdValidation,
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
};
