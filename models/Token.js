const mongoose = require('mongoose');
const { TokenStatus } = require('../constants/enum');

const TokenSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  token_ticker: { type: String },
  contract_address: { type: String },
  total_supply: { type: String },
  decimals: { type: String },
  chain_id: { type: String },
  user_position: { type: String },
  user_name: { type: String },
  user_email: { type: String },
  user_telegram: { type: String },
  project_name: { type: String },
  coinmarketcap_url: { type: String },
  twitter: { type: String },
  telegram: { type: String },
  discord: { type: String },
  status: {
    type: String,
    enum: Object.keys(TokenStatus),
    default: TokenStatus.Pending
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('token', TokenSchema);
