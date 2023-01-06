const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstname: {
    type: String
  },
  lastname: {
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
  website: {
    type: String
  },
  birthday: {
    type: String
  },
  biography: {
    type: String
  },
  walletAddress: {
    type: String
  },
  role: {
    type: String,
    default: 'user'
  },
  block: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('user', UserSchema);
