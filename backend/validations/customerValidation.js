const { param } = require('express-validator');

//  Unit Validation
const idValidation = [
  param('id')
    .exists()
    .withMessage('Not Existed')
    .bail()
    .isMongoId()
    .withMessage('Not Mongo ID'),
];

const addWatchlistValidation = idValidation;
const getWatchlistValidation = idValidation;
const deleteWatchlistValidation = idValidation;

module.exports = {
  getWatchlistValidation,
  addWatchlistValidation,
  deleteWatchlistValidation,
};
