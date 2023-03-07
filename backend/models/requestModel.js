const mongoose = require('mongoose');

const { UpdateRequest, Market, PaymentToken } = require('../constants/enum');

const requestSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  type: {
    type: Number,
    min: 0,
    max: UpdateRequest.length - 1,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  market: {
    type: Number,
    min: 0,
    max: Market.length - 1,
  },
  url: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  wallet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wallet',
  },
  paymentToken: {
    type: String,
    enum: PaymentToken,
    required: true,
  },
  expired: {
    type: Boolean,
    default: false,
  },
  paid: {
    type: Boolean,
    default: false,
  },
  withdraw: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Request', requestSchema);
