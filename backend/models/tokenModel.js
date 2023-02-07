const mongoose = require('mongoose');

const { Position, Blockchain, TokenStatus } = require('../constants/enum');

const tokenSchema = new mongoose.Schema({
  // Step1: Your Information
  position: { type: String, enum: Position, required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  userTelegram: { type: String, required: true },
  // Step2: Project Information
  projectName: { type: String, required: true },
  projectSymbol: { type: String, required: true },
  projectLaunchDate: { type: Date, required: true },
  projectDescription: { type: String, required: true },
  projectDetailedDescription: { type: String, required: true },
  //  Step3: Token Information
  projectBlockchain: { type: String, enum: Blockchain, required: true },
  tokenAddress: { type: String, required: true },
  tokenDecimals: { type: Number, required: true },
  tokenTotalSupply: { type: Number, required: true },
  tokenMaxSupply: { type: Number, required: true },
  tokenCirculatingSupply: { type: Number, required: true },
  //  Step4: Other Information
  website1: { type: String, required: true },
  website2: { type: String },
  cryptoAssetTags: { type: Array, required: true },
  coinmarketcap: { type: String },
  coingecko: { type: String },
  blockExplorer: { type: String },
  whitepaper: { type: String },
  telegram: { type: String },
  twitter: { type: String },
  instagram: { type: String },
  github: { type: String },
  linkedin: { type: String },
  youTube: { type: String },
  reddit: { type: String },
  medium: { type: String },
  twitch: { type: String },
  facebook: { type: String },
  email: { type: String },
  //  Other
  status: { type: String, enum: TokenStatus, required: true },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('Token', tokenSchema);
