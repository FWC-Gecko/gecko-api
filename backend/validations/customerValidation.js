const { body, param } = require('express-validator');

const { PostStatus } = require('../constants/enum');

//  Unit Validation
const paramIdValidation = [
  param('id')
    .exists()
    .withMessage('Not Existed')
    .bail()
    .isMongoId()
    .withMessage('Not Mongo ID'),
];

const stringValidation = (name) => [
  body(name)
    .exists()
    .withMessage('Not Existed')
    .bail()
    .notEmpty()
    .withMessage('Empty')
    .bail()
    .isString()
    .withMessage('Not String'),
];

const enumValidation = () => [
  body('status')
    .exists()
    .withMessage('Not Existed')
    .bail()
    .isIn(Object.keys(PostStatus))
    .withMessage('Not Matched'),
];

const addWatchlistValidation = paramIdValidation;
const getWatchlistValidation = paramIdValidation;
const deleteWatchlistValidation = paramIdValidation;

const addPostValidation = [...stringValidation('text'), ...enumValidation()];
const repostByIdValidation = [
  ...paramIdValidation,
  ...stringValidation('text'),
  ...enumValidation(),
];
const addCommentByIdValidation = paramIdValidation;
const likePostByIdValidation = paramIdValidation;
const dislikePostByIdValidation = paramIdValidation;

module.exports = {
  getWatchlistValidation,
  addWatchlistValidation,
  deleteWatchlistValidation,
  addPostValidation,
  repostByIdValidation,
  addCommentByIdValidation,
  likePostByIdValidation,
  dislikePostByIdValidation,
};
