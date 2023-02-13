const mongoose = require('mongoose');

const { PostStatus } = require('../constants/enum');

const commentSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  text: {
    type: String,
    required: true,
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: {
    type: String,
    enum: Object.keys(PostStatus),
    required: true,
  },
});

module.exports = mongoose.model('Comment', commentSchema);
