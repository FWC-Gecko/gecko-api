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
});

module.exports = mongoose.model('Exchange', exchangeSchema);
