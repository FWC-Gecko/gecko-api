const { body, param, query } = require('express-validator');

const { Position, Blockchain } = require('../constants/enum');

//  Unit validations
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

const emailValidation = (name) => [
  body(name)
    .exists()
    .withMessage('Not Existed')
    .bail()
    .isEmail()
    .withMessage('Not Email'),
];

const numberValidation = (name) => [
  body(name)
    .exists()
    .withMessage('Not Existed')
    .bail()
    .isInt({ min: 0 })
    .withMessage('Not Integer Or Out Of Range'),
];

const linkValidation = (name) => [
  body(name)
    .exists()
    .withMessage('Not Existed')
    .bail()
    .isURL()
    .withMessage('Not URL'),
];

const idValidation = [
  param('id')
    .exists()
    .withMessage('Not Existed')
    .bail()
    .isMongoId()
    .withMessage('Not Mongo ID'),
];

const listNewTokenValidation = [
  body('userPosition')
    .exists()
    .withMessage('Not Existed')
    .bail()
    .isInt({ min: 0, max: Position.length - 1 })
    .withMessage('Not Integer Or Out Of Range'),
  ...stringValidation('userName'),
  ...emailValidation('userEmail'),
  ...stringValidation('userTelegram'),
  ...stringValidation('userName'),
  ...stringValidation('symbol'),
  ...stringValidation('launchedAt'),
  ...stringValidation('description'),
  ...stringValidation('detailedDescription'),
  body('blockchain')
    .exists()
    .withMessage('Not Existed')
    .bail()
    .isInt({ min: 0, max: Blockchain.length - 1 })
    .withMessage('Not Integer Or Out Of Range'),
  ...stringValidation('address'),
  ...numberValidation('decimals'),
  ...numberValidation('totalSupply'),
  ...numberValidation('maxSupply'),
  ...numberValidation('circulatingSupply'),
  ...linkValidation('website1'),
  ...stringValidation('cryptoAssetTags'),
];
const searchTokensValidation = [
  query('count')
    .exists()
    .withMessage('Not Existed')
    .bail()
    .isInt({ min: 0 })
    .withMessage('Not Integer Or Out Of Range'),
  query('page')
    .exists()
    .withMessage('Not Existed')
    .bail()
    .isInt({ min: 0 })
    .withMessage('Not Integer Or Out Of Range'),
];
const getTokenByIdValidation = idValidation;
const getTokenOverviewByIdValidation = idValidation;
const getTokenMarketsByIdValidation = idValidation;
const getTokenHistoricalDataByIdValidation = idValidation;
const getExchangeByIdValidation = [
  param('id')
    .exists()
    .withMessage('Not Existed')
    .bail()
    .isInt({ min: 0 })
    .withMessage('Not Integer Or Out Of Range'),
];
const getTokenVoteByIdValidation = idValidation;
const voteTokenByIdValidation = idValidation;
const unvoteTokenByIdValidation = idValidation;
const getPostByIdValidation = idValidation;

module.exports = {
  searchTokensValidation,
  listNewTokenValidation,
  getTokenByIdValidation,
  getTokenOverviewByIdValidation,
  getTokenMarketsByIdValidation,
  getTokenHistoricalDataByIdValidation,
  getExchangeByIdValidation,
  getTokenVoteByIdValidation,
  voteTokenByIdValidation,
  unvoteTokenByIdValidation,
  getPostByIdValidation,
};
