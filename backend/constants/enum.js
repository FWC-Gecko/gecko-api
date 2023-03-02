const Role = {
  Admin: 'Admin',
  Customer: 'Customer',
};

const Position = [
  'Founder',
  'CEO',
  'CMO',
  'Member of the Leadership Team',
  'Admin / Community Manager',
  'Administrative Assistant',
];

const Blockchain = ['Ethereum', 'Binance Smart Chain'];

const AssetTag = [
  'Adult',
  'Marketing',
  'Agricultures',
  'Asset management',
  'Commodities',
  'Cybersecurity',
  'Art',
  'Education',
  'Fashion',
  'Engery',
  'Events',
  'Food & Beverage',
  'Gambling',
  'Government',
  'Hardware',
  'Health',
  'Hospitality',
  'Retail',
  'Manufacturing',
  'Maritime',
  'Markplace',
  'Media',
  'Military',
  'Philanthropy',
  'Medium of exchange',
  'Platform',
  'Real estate',
  'Technology',
];

const TokenStatus = {
  InReview: 'In Review',
  Pending: 'Pending',
  Active: 'Active',
  Updating: 'Updating',
  InReviewRefused: 'InReviewRefused',
  PendingRefused: 'PendingRefused',
};

const PostStatus = {
  bullish: 'bullish',
  bearish: 'bearish',
};

const UpdateRequest = [
  '[Existing Cryptoasset & Exchange] Add market/pair',
  '[Existing Cryptoasset] Update supply figures',
  '[Existing Cryptoasset] Coin/Token Swap',
  '[Existing Exchange] Update info (e.g. Fiat on-ramp, Rebrand, API update)',
  '[Existing Cryptoasset] Update info (e.g. Rebrand, URL update, Tagging)',
];

const Market = [
  'Spot',
  'Perpetual Swap (No expiry)',
  'Cash-Settled Futures',
  'Physically-delivered Futures',
  'Options',
];

const PaymentToken = ['BNB', 'BUSD', 'USDT', 'FWC'];

module.exports = {
  Role,
  Position,
  Blockchain,
  AssetTag,
  TokenStatus,
  PostStatus,
  UpdateRequest,
  Market,
  PaymentToken,
};
