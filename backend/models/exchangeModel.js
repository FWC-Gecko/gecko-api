const mongoose = require('mongoose');

const exchangeSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  ID: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    required: true,
  },
  website: [{ type: String }],
  twitter: [{ type: String }],
  chat: [{ type: String }],
  fee: [{ type: String }],
  blog: [{ type: String }],
});

module.exports = mongoose.model('Exchange', exchangeSchema);
