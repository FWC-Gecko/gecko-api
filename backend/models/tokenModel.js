const mongoose = require('mongoose');

const {
  Position,
  Blockchain,
  TokenStatus,
  AssetTag,
} = require('../constants/enum');

const tokenSchema = new mongoose.Schema({
  ID: { type: Number },
  // Step1: Your Information
  userPosition: { type: String, enum: Position, required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  userTelegram: { type: String, required: true },
  // Step2: Project Information
  name: { type: String, required: true },
  symbol: { type: String, required: true },
  launchedAt: { type: Date, required: true },
  description: { type: String, required: true },
  detailedDescription: { type: String, required: true },
  //  Step3: Token Information
  contractAddress: [
    {
      address: { type: String, required: true },
      blockchain: { type: String, required: true },
    },
  ],
  decimals: { type: Number, required: true },
  totalSupply: { type: Number, required: true },
  maxSupply: { type: Number, required: true },
  circulatingSupply: { type: Number, required: true },
  //  Step4: Other Information
  website1: { type: String, required: true },
  website2: { type: String },
  cryptoAssetTags: [
    {
      type: String,
    },
  ],
  coinmarketcap: { type: String },
  coingecko: { type: String },
  explorer: [{ type: String }],
  whitepaper: { type: String },
  telegram: { type: String },
  twitter: { type: String },
  instagram: { type: String },
  github: { type: String },
  linkedin: { type: String },
  youtube: { type: String },
  reddit: { type: String },
  medium: { type: String },
  twitch: { type: String },
  facebook: { type: String },
  email: { type: String },
  logo: { type: String },
  //  Other
  status: { type: String, enum: Object.values(TokenStatus), required: true },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  watchlist: [{ type: String }],
});

module.exports = mongoose.model('Token', tokenSchema);
