const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String
  },
  contract_address: {
    type: String
  },
  total_supply: {
    type: String
  },
  decimals: {
    type: String
  },
  chain: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('user', UserSchema);
