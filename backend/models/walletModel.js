const mongoose = require('mongoose');

const { PaymentToken } = require('../constants/enum');

const priceType = {};

PaymentToken.map((token) => {
  priceType[token] = { type: Number, required: true };
});

const walletSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  address: {
    type: String,
    required: true,
    unique: true,
  },
  privateKey: {
    type: String,
    required: true,
    unique: true,
  },
  price: priceType,
});

module.exports = mongoose.model('Wallet', walletSchema);
