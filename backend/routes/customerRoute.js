const express = require('express');

const {
  getWatchlist,
  addWatchlist,
  deleteWatchlist,
} = require('../controllers/customerController');

const {
  getWatchlistValidation,
  addWatchlistValidation,
  deleteWatchlistValidation,
} = require('../validations/customerValidation');

const validation = require('../middlewares/validation');
const { isAuthenticated, isCustomer } = require('../middlewares/auth');

const router = express();

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
