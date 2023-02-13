const mongoose = require('mongoose');

const { PostStatus } = require('../constants/enum');

const postSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: {
    type: String,
    required: true,
  },
  like: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  status: {
    type: String,
    enum: Object.keys(PostStatus),
    required: true,
  },
});

module.exports = mongoose.model('Post', postSchema);
