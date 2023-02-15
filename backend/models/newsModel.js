const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('News', newsSchema);
