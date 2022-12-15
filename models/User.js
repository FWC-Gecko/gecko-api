const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String
  },
  avatar: {
    type: String
  },
  ethereumAddress: {
    type: String
  },
  watchlist: {
    type: Array
  },
  address: {
    type: String
  },
  role: {
    type: String,
    default: 0
  },
  date: {
    type: Date,
    default: Date.now
  },
  type: {
    type: String,
    default: 'email',
    enum: ['email', 'google', 'kakao']
  }
});

module.exports = mongoose.model('user', UserSchema);
