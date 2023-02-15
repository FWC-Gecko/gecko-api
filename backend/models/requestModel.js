const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  email: {
    type: String,
    required: true,
  },
  subjectField: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  proof: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Request', requestSchema);
